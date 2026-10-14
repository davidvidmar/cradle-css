import importlib.util
import io
from html.parser import HTMLParser
import json
import re
from pathlib import Path
import tarfile
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('gallery', Path(__file__).parents[1] / 'scripts/bob-deploy-gallery.py')
gallery = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gallery)
SHA = 'a' * 40


def archive(files=None):
    out = io.BytesIO()
    with tarfile.open(fileobj=out, mode='w') as tar:
        for name, data in (files or {name: name.encode() for name in gallery.ASSETS}).items():
            entry = tarfile.TarInfo(name)
            entry.size = len(data)
            tar.addfile(entry, io.BytesIO(data))
    return out.getvalue()


class GalleryDeployTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.compose = self.root / 'docker-compose.yml'
        self.original = 'services:\n  cradle:\n    volumes:\n      - ./config/cradle-css/releases/' + 'b' * 40 + '/site:/app/wwwroot/css:ro\n'
        self.compose.write_text(self.original)

    def invoke(self, payload, failure=False):
        stream = type('Input', (), {'buffer': io.BytesIO(payload)})()
        def command(args, timeout=20):
            if args[:2] == ['docker', 'inspect']:
                return 'sha256:original'
            name = Path(args[-1]).name
            data = (self.root / 'releases' / SHA / 'site' / name).read_bytes()
            return gallery.hashlib.sha256(data).hexdigest() + '  ' + name
        def recreate(image):
            self.assertEqual(image, 'sha256:original')
            if failure and SHA in self.compose.read_text():
                raise RuntimeError('Failed new mount')
        with patch.object(gallery, 'ROOT', self.root), patch.object(gallery, 'COMPOSE', self.compose), patch.object(gallery.sys, 'stdin', stream), patch.object(gallery.sys, 'argv', ['deploy', 'deploy', SHA]), patch.dict(gallery.os.environ, {}, clear=True), patch.object(gallery, 'run', side_effect=command), patch.object(gallery, 'health', return_value='unchanged-version'), patch.object(gallery, 'recreate', side_effect=recreate) as restart:
            gallery.main()
            return restart.call_count

    def test_deploys_only_assets_and_preserves_image_and_version(self):
        self.assertEqual(self.invoke(archive()), 1)
        receipt = json.loads((self.root / 'releases' / SHA / 'deployment.json').read_text())
        self.assertEqual(receipt['image'], 'sha256:original')
        self.assertEqual(receipt['appVersion'], 'unchanged-version')
        self.assertEqual(Path(receipt['composeBackup']).read_text(), self.original)
        self.assertEqual(set(receipt['assets']), set(gallery.ASSETS) | {'version.txt'})
        self.assertEqual(self.invoke(archive()), 0)

    def test_gallery_styles_are_external_for_host_csp(self):
        class GalleryMarkup(HTMLParser):
            def __init__(self):
                super().__init__()
                self.inline_styles = []
                self.stylesheets = []
            def handle_starttag(self, tag, attrs):
                attrs = dict(attrs)
                if tag == 'style' or 'style' in attrs:
                    self.inline_styles.append(tag)
                if tag == 'link' and attrs.get('rel') == 'stylesheet':
                    self.stylesheets.append(attrs.get('href'))
        markup = GalleryMarkup()
        markup.feed((Path(__file__).parents[1] / 'index.html').read_text())
        self.assertEqual(markup.inline_styles, [])
        self.assertIn('examples.css', markup.stylesheets)
        self.assertIn('examples.css', gallery.ASSETS)

    def test_every_theme_file_is_imported_and_published(self):
        root = Path(__file__).parents[1]
        themes = sorted(path.name for path in root.glob('theme-*.css'))
        imports = sorted(re.findall(r'@import url\("(theme-[\w-]+\.css)"\)', (root / 'themes.css').read_text()))
        hook = re.search(r'assets=\(([^)]*)\)', (root / 'scripts/forgejo-post-receive.sh').read_text())[1].split()
        self.assertGreaterEqual(len(themes), 16)
        self.assertEqual(imports, themes)
        for name in themes:
            self.assertIn(name, gallery.ASSETS)
            self.assertIn(name, hook)
        self.assertEqual(sorted(hook), sorted(gallery.ASSETS))

    def test_real_gallery_bundle_fits_receiver_limits(self):
        root = Path(__file__).parents[1]
        files = {name: (root / name).read_bytes() for name in gallery.ASSETS}
        self.assertIn('lucide.svg', files)
        self.assertTrue(all(len(data) <= 1024 * 1024 for data in files.values()))
        self.assertLessEqual(len(archive(files)), 2 * 1024 * 1024)

    def test_rolls_back_mount_on_failed_deployment(self):
        with self.assertRaisesRegex(RuntimeError, 'Failed new mount'):
            self.invoke(archive(), failure=True)
        self.assertEqual(self.compose.read_text(), self.original)
        self.assertFalse((self.root / 'releases' / SHA / 'deployment.json').exists())

    def test_rejects_extra_missing_and_traversal_assets(self):
        for files in [{'../outside': b'no'}, {'index.html': b'incomplete'}, {**{name: b'asset' for name in gallery.ASSETS}, '.env': b'no'}]:
            with self.subTest(names=list(files)), self.assertRaises(ValueError):
                self.invoke(archive(files))
            self.assertEqual(self.compose.read_text(), self.original)

    def test_rejects_oversized_archive(self):
        with self.assertRaisesRegex(ValueError, 'exceeds'):
            self.invoke(b'x' * (2 * 1024 * 1024 + 1))


if __name__ == '__main__':
    unittest.main()
