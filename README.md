# Cradle CSS

A private, small CSS library extracted from Cradle. Version **0.1.0**.

Neutral surfaces, subtle borders, compact navigation, readable 16px text and restrained accent colours. Plain HTML and CSS, with no package manager, framework, build step or required JavaScript. The core uses system fonts; optional Inter loads from Google Fonts.

## Preview

Open `index.html` directly in a browser. It contains working theme controls, forms, a native modal, cards, metrics, tables and reading/chat examples. `starter.html` is the smallest starting point.

Alternatively, serve this directory:

```sh
timeout 300s python3 -m http.server 9963 --bind 127.0.0.1
```

Run from the repository root, open `http://127.0.0.1:9963/`, and stop with Ctrl+C.

## Use in another project

Copy `cradle.css` into the project's static assets and include it:

```html
<link rel="stylesheet" href="/css/cradle.css">
<body class="cradle">
  <main class="cr-container">
    <h1>My project</h1>
    <button class="cr-button cr-primary" type="button">Save</button>
  </main>
</body>
```

The base reset and native element styles apply inside `.cradle`. Components have `cr-` class names and tokens use `--cr-` to reduce collisions. Components must live inside `.cradle`; put native dialogs inside it too. Root tokens and colour-scheme apply to the document. This is intended as a project's base stylesheet, rather than a drop-in widget in an unrelated design system.

Load optional `themes.css` after `cradle.css` for the additional nine palettes. Set `data-skin` on `<html>` to `cradle`, `dracula`, `one-dark`, `nord`, `solarized`, `monokai`, `tokyo-night`, `catppuccin`, `gruvbox` or `material`.

Theme mode is CSS-only: omit `data-theme` for the system setting, or use `data-theme="light"` / `data-theme="dark"`. Auto works for every palette. The gallery's `examples.js` only demonstrates switching and interactions; it is not a library dependency.

For Inter, copy `inter.css`, set `data-font="inter"` on `<html>`, and add:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&amp;display=swap">
<link rel="stylesheet" href="inter.css">
```

Inter is served by Google Fonts; no font binaries are bundled or hosted by this repository. The [Google Fonts CSS API](https://developers.google.com/fonts/docs/css2) supplies variable weights with `display=swap` and the system stack provides fallback. The gallery loads the CDN stylesheet only when you select Inter. Projects using system fonts need no CDN request.

## Components

| Purpose | Classes |
| --- | --- |
| Page layout | `cr-container`, `cr-section` |
| App shell | `cr-shell`, `cr-sidebar`, `cr-sidebar-head`, `cr-brand`, `cr-nav`, `cr-sidebar-foot`, `cr-main` |
| Buttons | `cr-button` with optional `cr-primary`, `cr-quiet`, `cr-danger` |
| Forms | `cr-form`, `cr-field`, `cr-row`, `cr-check`, `cr-toolbar` |
| Cards | `cr-grid`, `cr-card`, `cr-card-head`, `cr-identity`, `cr-avatar` |
| Badges | `cr-badge`, optional `cr-outline` |
| Metrics | `cr-metrics`, `cr-metric` |
| Tables | `cr-table-wrap`, `cr-table` |
| Native disclosure | `cr-details` on `<details>` |
| Native dialog | `cr-dialog`, `cr-dialog-head`, `cr-dialog-body`, `cr-dialog-foot` |
| Reading and chat | `cr-prose`, `cr-message`, `cr-composer` |
| Supporting text | `cr-subtle`, `cr-error`, `cr-sr-only` |

Copy the markup from `index.html`. For navigation, use `aria-current="page"` for a current page or `location` for an anchor. Button appearance is explicit and does not depend on IDs or submit behavior. Use labels, named dialogs, table headers and actual HTML controls.

The optional shell fills the viewport. On phones, its sidebar becomes a compact top navigation row; its content remains scrollable. The starter page uses ordinary document scrolling. Wide tables scroll inside their wrapper. This library includes visual styles, not a Markdown renderer, sanitizer, chat client, routing or application state.

## Customization

Load project overrides last. Keep overrides small and use tokens first:

```css
:root {
  --cr-font-size: 17px;
  --cr-sidebar: 240px;
  --cr-radius: 8px;
}
```

Primary tokens: `--cr-paper` (page), `--cr-soft` (secondary surface), `--cr-ink`, `--cr-muted`, `--cr-faint`, `--cr-line`, `--cr-accent`, `--cr-accent-soft`, `--cr-accent-line`, `--cr-on-accent`, `--cr-danger`, `--cr-font`, `--cr-font-size`, `--cr-radius`, `--cr-sidebar`.

Palette rules are more specific than `:root`. To override colours for a selected palette/mode, match its selectors in your final override sheet, for example `:root[data-skin="nord"][data-theme="dark"]`. Change accent text and background together and check contrast.

## AI handoff

Give another coding assistant this repository and this instruction:

> Use my private Cradle CSS library as this project's visual foundation. Read its README and component gallery, reuse cradle.css and the documented cr- components, and preserve the quiet layout, 16px typography, subtle borders and restrained accents. Use themes.css and Inter from Google Fonts only if needed. Adapt the examples to the project's framework. Keep project-specific styles in a separate stylesheet; extend existing components before adding new ones. Use native accessible elements and check desktop/mobile and light/dark rendering.

## Repository and maintenance

The private repository is [david/cradle-css](https://git.v51.si/david/cradle-css). Clone it with:

```sh
git clone ssh://git@git.home.vidmar.net:2222/david/cradle-css.git
```

Commit the CSS, examples and README together. Applications should copy from a recorded commit, or vendor a pinned checkout through their existing build process. Keep the library version pinned; its upgrades should be deliberate and reviewable. Optional Inter uses the Google Fonts CDN.

The Cradle application still owns its existing styles. This extraction does not change its CSS imports. After the separate repository exists, adopting the library in Cradle is a separate integration step with visual regression checks.

This initial library consolidates duplicate controls and theme overrides, removes app IDs and backend dependencies, prefixes component names and tokens, makes fonts/palettes optional, and fixes minimum card widths on phones. It intentionally remains a small source library; there is no generated/minified copy to keep synchronized. Keep changes focused, update the examples, verify rendering, and record breaking changes before adoption.

For private use. Inter is requested from Google Fonts rather than redistributed here.
