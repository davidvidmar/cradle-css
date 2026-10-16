#!/usr/bin/env python3
"""Restricted Bob gallery receiver: stdin is an allowlisted git archive."""
import fcntl
import hashlib
import io
import json
import os
from pathlib import Path
import re
import shlex
import shutil
import subprocess
import sys
import tarfile
import tempfile
import time
import urllib.request

ASSETS = ('index.html', 'starter.html', 'cradle.css', 'themes.css', 'fonts.css', 'fonts.js', 'themes.js', 'examples.js', 'sort-tables.js', 'lucide.svg', 'examples.css',
          'theme-dracula.css', 'theme-one-dark.css', 'theme-nord.css', 'theme-solarized.css', 'theme-monokai.css', 'theme-tokyo-night.css', 'theme-catppuccin.css', 'theme-gruvbox.css', 'theme-material.css', 'theme-gen-i.css', 'theme-gen-i-portal.css', 'theme-gen-i-lagoon.css',
          'font-inter-italic-latin-ext.woff2', 'font-inter-italic-latin.woff2', 'font-inter-latin-ext.woff2', 'font-inter-latin.woff2', 'font-jetbrains-mono-italic-latin-ext.woff2', 'font-jetbrains-mono-italic-latin.woff2', 'font-jetbrains-mono-latin-ext.woff2', 'font-jetbrains-mono-latin.woff2', 'font-manrope-latin-ext.woff2', 'font-manrope-latin.woff2')
STACK = Path('/home/david/app-dev')
ROOT = STACK / 'config/cradle-css'
COMPOSE = STACK / 'docker-compose.yml'


def run(args, timeout=20):
    return subprocess.check_output(args, timeout=timeout, text=True, stderr=subprocess.STDOUT).strip()


def health():
    with urllib.request.urlopen('http://127.0.0.1:9954/api/health', timeout=5) as response:
        return json.load(response)['version']


def recreate(image):
    # Use the running immutable image ID, even if the mutable latest tag changes.
    with tempfile.TemporaryDirectory(prefix='cradle-css-compose-') as tmp:
        override = Path(tmp) / 'override.json'
        override.write_text(json.dumps({'services': {'cradle': {'image': image}}}))
        run(['docker', 'compose', '-f', str(COMPOSE), '-f', str(override), 'up', '-d', '--no-deps', '--no-build', '--pull', 'never', 'cradle'], 120)
    for _ in range(30):
        if run(['docker', 'inspect', '-f', '{{.State.Health.Status}}', 'cradle']) == 'healthy':
            return
        time.sleep(2)
    raise RuntimeError('Cradle did not become healthy')


def main():
    args = shlex.split(os.environ['SSH_ORIGINAL_COMMAND']) if os.environ.get('SSH_ORIGINAL_COMMAND') else sys.argv[1:]
    if len(args) != 2 or args[0] != 'deploy' or not re.fullmatch('[0-9a-f]{40}', args[1]):
        raise ValueError('Usage: deploy <full commit SHA>')
    commit = args[1]
    payload = sys.stdin.buffer.read(2 * 1024 * 1024 + 1)
    if len(payload) > 2 * 1024 * 1024:
        raise ValueError('Archive exceeds 2 MiB')
    files = {}
    with tarfile.open(fileobj=io.BytesIO(payload)) as archive:
        for entry in archive:
            if not entry.isfile() or entry.name not in ASSETS or entry.name in files or entry.size > 1024 * 1024:
                raise ValueError('Unexpected archive member')
            files[entry.name] = archive.extractfile(entry).read()
    if set(files) != set(ASSETS):
        raise ValueError('Missing gallery assets')
    files['version.txt'] = (commit + '\n').encode()
    ROOT.mkdir(parents=True, exist_ok=True)
    with (ROOT / 'deploy.lock').open('w') as lock:
        # Bound lock acquisition so simultaneous pushes cannot wait indefinitely.
        for attempt in range(120):
            try:
                fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
                break
            except BlockingIOError:
                if attempt == 119:
                    raise TimeoutError('Another gallery deployment is running')
                time.sleep(1)
        site = ROOT / 'releases' / commit / 'site'
        site.mkdir(parents=True, exist_ok=True)
        for name, data in files.items():
            path = site / name
            if path.exists() and path.read_bytes() != data:
                raise ValueError('Existing release differs: ' + name)
            path.write_bytes(data)
        if {p.name for p in site.iterdir()} != set(files):
            raise ValueError('Release contains unexpected files')
        hashes = {name: hashlib.sha256(data).hexdigest() for name, data in files.items()}
        image = run(['docker', 'inspect', '-f', '{{.Image}}', 'cradle'])
        version = health()
        original = COMPOSE.read_text()
        pattern = r'(?m)^(\s*-\s*)(?:\./config/cradle-css/releases/[0-9a-f]{40}/site|/home/david/app-dev/config/cradle-css/releases/[0-9a-f]{40}/site)(:/app/wwwroot/css:ro\s*)$'
        updated, matches = re.subn(pattern, lambda m: m[1] + './config/cradle-css/releases/' + commit + '/site' + m[2], original)
        if matches != 1:
            raise ValueError('Expected exactly one gallery mount')
        backup = ROOT / 'backups' / ('docker-compose-' + time.strftime('%Y%m%dT%H%M%SZ', time.gmtime()) + '.yml')
        backup.parent.mkdir(exist_ok=True)
        shutil.copy2(COMPOSE, backup)
        backup.chmod(0o600)
        changed = updated != original
        try:
            if changed:
                COMPOSE.write_text(updated)
                recreate(image)
            if run(['docker', 'inspect', '-f', '{{.Image}}', 'cradle']) != image or health() != version:
                raise RuntimeError('Application image/version changed')
            for name, expected in hashes.items():
                actual = run(['docker', 'exec', 'cradle', 'sha256sum', '/app/wwwroot/css/' + name]).split()[0]
                if actual != expected:
                    raise RuntimeError('Mounted asset mismatch: ' + name)
            receipt = {'commit': commit, 'image': image, 'appVersion': version, 'composeBackup': str(backup), 'assets': hashes}
            (site.parent / 'deployment.json').write_text(json.dumps(receipt, indent=2) + '\n')
        except Exception:
            if changed:
                COMPOSE.write_text(original)
                recreate(image)
            raise
        print('Gallery deployed:', commit, 'app unchanged:', version, flush=True)


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print('Gallery deployment failed:', str(error), file=sys.stderr)
        sys.exit(1)
