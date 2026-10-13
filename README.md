# Cradle CSS

A private, small CSS library extracted from Cradle. Version **0.3.0**.

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

For font choices, load `fonts.css` and `fonts.js` after the core CSS. Fonts stay on the CDN; no font binaries are bundled.

```html
<link rel="stylesheet" href="fonts.css">
<script src="fonts.js"></script>
```

Set `data-font` on `<html>` to `native-sans` (system default), `native-serif`, `inter` or `native-mono` (JetBrains Mono; historical option name retained for compatibility). Request an optional CDN font only when needed:

```js
CradleFonts.load('inter'); // For the Inter interface option.
CradleFonts.load('mono');  // For code/pre blocks.
CradleFonts.select('native-mono'); // Set the interface font and load it when needed.
```

The helper de-duplicates stylesheet/preconnect links and uses the [Google Fonts CSS API](https://developers.google.com/fonts/docs/css2) with variable weights and `display=swap`. `fonts.css` owns all optional font stacks and the `--cr-mono` code font token. System fonts remain the fallback if loading fails. The core alone uses system fonts and makes no network requests. The gallery loads JetBrains Mono for its code samples and loads Inter only when selected.

## Components

| Purpose | Classes |
| --- | --- |
| Page layout | `cr-container`, `cr-section` |
| App shell | optional `cr-drawer-shell` modifier; `cr-shell`, `cr-sidebar`, `cr-sidebar-head`, `cr-brand`, `cr-nav`, `cr-sidebar-foot`, `cr-main` |
| Buttons | `cr-button` with optional `cr-primary`, `cr-quiet`, `cr-danger`, `cr-danger-fill`, `cr-bare` |
| Forms | `cr-form`, `cr-field`, `cr-row`, `cr-check`, `cr-toolbar` |
| Cards | `cr-grid`, `cr-card`, `cr-card-head`, `cr-identity`, `cr-avatar` |
| Badges | `cr-badge`, optional `cr-outline` |
| Metrics | `cr-metrics`, `cr-metric` |
| Tables | `cr-table-wrap`, `cr-table`, `cr-sort` |
| Native disclosure | `cr-details` on `<details>` |
| Native dialog | `cr-dialog`, `cr-dialog-head`, `cr-dialog-body`, `cr-dialog-foot` |
| Reading and chat | `cr-prose`, `cr-message`, `cr-composer` |
| Tab controls | `cr-tabs` |
| Loading indicator | `cr-busy` (hide with `hidden`; respects reduced motion) |
| Supporting text | `cr-subtle`, `cr-error`, `cr-sr-only` |

Copy the markup from `index.html`. For navigation, use `aria-current="page"` for a current page or `location` for an anchor. Button appearance is explicit and does not depend on IDs or submit behavior. Use labels, named dialogs, table headers and actual HTML controls.

The optional shell fills the viewport. On phones, its sidebar becomes a compact top navigation row by default; with `cr-drawer-shell`, it becomes an off-canvas sidebar toggled by the application’s `sidebar-open` body class; its content remains scrollable. The starter page uses ordinary document scrolling. Wide tables scroll inside their wrapper. This library includes visual styles, not a Markdown renderer, sanitizer, chat client, routing or application state.

## Customization

Load project overrides last. Keep overrides small and use tokens first:

```css
:root {
  --cr-font-size: 17px;
  --cr-sidebar: 240px;
  --cr-radius: 8px;
  --cr-container-width: 1800px;
}
```

Primary tokens: `--cr-paper` (page), `--cr-soft` (secondary surface), `--cr-ink`, `--cr-muted`, `--cr-faint`, `--cr-line`, `--cr-accent`, `--cr-accent-soft`, `--cr-accent-line`, `--cr-on-accent`, `--cr-danger`, `--cr-font`, `--cr-font-size`, `--cr-radius`, `--cr-sidebar`, `--cr-container-width` (1440px), `--cr-form-width` (860px), `--cr-prose-width` (760px).

Palette rules are more specific than `:root`. To override colours for a selected palette/mode, match its selectors in your final override sheet, for example `:root[data-skin="nord"][data-theme="dark"]`. Change accent text and background together and check contrast.

## AI handoff

Give another coding assistant this repository and this instruction:

> Use my private Cradle CSS library as this project's visual foundation. Read its README and component gallery, reuse cradle.css and the documented cr- components, and preserve the quiet layout, 16px typography, subtle borders and restrained accents. Use themes.css and the font choices/loaders in fonts.css/fonts.js only if needed. Adapt the examples to the project's framework. Keep project-specific styles in a separate stylesheet; extend existing components before adding new ones. Use native accessible elements and check desktop/mobile and light/dark rendering.

## Repository and maintenance

The private repository is [david/cradle-css](https://git.v51.si/david/cradle-css). Clone it with:

```sh
git clone ssh://git@git.home.vidmar.net:2222/david/cradle-css.git
```

Commit the CSS, examples and README together. Applications should copy from a recorded commit, or vendor a pinned checkout through their existing build process. Keep the library version pinned; its upgrades should be deliberate and reviewable. Optional Inter uses the Google Fonts CDN.

The Cradle application still owns its existing styles. This extraction does not change its CSS imports. After the separate repository exists, adopting the library in Cradle is a separate integration step with visual regression checks.

This initial library consolidates duplicate controls and theme overrides, removes app IDs and backend dependencies, prefixes component names and tokens, makes fonts/palettes optional, and fixes minimum card widths on phones. It intentionally remains a small source library; there is no generated/minified copy to keep synchronized. Keep changes focused, update the examples, verify rendering, and record breaking changes before adoption.

For private use. Inter is requested from Google Fonts rather than redistributed here.


## Hosted gallery on Bob

The gallery is available at [cradle.home.vidmar.net/css/](https://cradle.home.vidmar.net/css/) and uses Cradle's existing Pocket ID sign-in.

Bob's authoritative `~/app-dev/docker-compose.yml` mounts a pinned release read-only at `/app/wwwroot/css` in the existing `cradle` service. Gallery assets live in `~/app-dev/config/cradle-css/releases/<commit>/site`; `deployment.json` beside the site records the commit, asset hashes, application image/version and Compose backup. Only HTML, CSS, example JavaScript and `version.txt` are served.

A library push does not automatically update this gallery. For a new release, export the committed assets into a new release directory, back up the live Compose file, update only the gallery mount and recreate only `cradle` using its existing image (`--no-deps --no-build --pull never`). Verify unchanged application image/version, health, mounted hashes and sign-in. Restarting Cradle revokes its in-memory sessions. Do not overwrite the shared Compose file from a repository template or copy application data into the CSS release.

The home-host HTTPS router also uses exact-path `cradle-css-slash` and `cradle-css-index` middleware: `/css` redirects to `/css/`, and `/css/` is rewritten to `/css/index.html` before reaching Cradle. This avoids its source-bookmark route while preserving the existing sign-in gate. Preserve these middleware settings when updating the authoritative Traefik configuration.


## Optional sortable tables

Load `sort-tables.js` with `defer`; it automatically initializes tables inside `.cradle` that opt in with `data-sortable`:

```html
<script defer src="sort-tables.js"></script>
<table class="cr-table" data-sortable>
  <thead><tr>
    <th scope="col" data-sort="text">Name</th>
    <th scope="col" data-sort="number">Count</th>
    <th scope="col" data-sort="date">Updated</th>
  </tr></thead>
  <tbody><tr>
    <td>Sample notes</td>
    <td>128</td>
    <td data-sort-value="2026-10-12T09:00:00Z">12 Oct, 09:00</td>
  </tr></tbody>
</table>
```

The helper creates native header buttons with visible direction indicators and `aria-sort`. Click, Enter or Space toggles ascending/descending. Text uses locale-aware natural comparison; numbers sort numerically; dates should use ISO values. Set `data-sort-value` on a cell when its display text differs from its machine value, such as currency or a formatted date. Empty/invalid numeric/date values stay last in both directions; ties retain their current row order. Existing row elements and their event handlers are preserved.

For dynamically inserted tables call `CradleTables.init(container)` after rendering; repeated initialization is safe. This small helper supports one header row, one body and unmerged cells, and sorts only the rows currently in the DOM. For paginated/server-backed tables, let the application implement ordering. Omit `data-sort` on a column to leave it unsortable. Tables remain ordinary readable HTML without JavaScript.

Version 0.2.0 adds this optional helper and the matching header controls; core CSS still requires no JavaScript. Add `sort-tables.js` to the served release assets when deploying the updated gallery.


## Application integration helpers

`cr-tabs` styles native tab buttons; the application owns their tablist/tabpanel relationships, selection and keyboard navigation. `cr-drawer-shell` keeps the desktop sidebar and switches to a phone drawer; the application owns its toggle, aria-expanded and Escape/outside-close behavior. `cr-busy` is an indeterminate loading bar; set hidden when idle and provide a progress/status label.

For tables redrawn from typed application records, `CradleTables.order(items, key, direction, locale)` provides the same stable comparison and missing-last rules as DOM sorting. It returns a new ordered array, preserves record references, and accepts ascending/descending plus an optional language tag. The application can retain column/direction state across refreshes while using shared `cr-sort` header controls and aria-sort.

Fonts and palette definitions are owned here. Consumers keep their selected values and domain-specific UI state; they should not duplicate font stacks, CDN URLs or palette colours in application CSS.

Version 0.2.1 restores compact 13px typography for bare buttons and explicitly centres tab labels. Bare buttons inherit the selected font family without replacing the button font size.

Version 0.2.2 exposes layout widths as tokens: `--cr-container-width`, `--cr-form-width` and `--cr-prose-width`. Defaults are unchanged; override them in `:root` instead of redeclaring `.cr-container`, `.cr-form` or `.cr-prose`.

Version 0.3.0 (breaking): the default `--cr-container-width` grows from 1180px to 1440px so layouts target laptop and 24" displays. Set `--cr-container-width: 1180px` to keep the previous width. Also fixes a missing semicolon in the dark palette that left `--cr-faint` unset and `--cr-accent-line` invalid in dark mode.
