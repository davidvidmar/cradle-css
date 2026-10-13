# Cradle CSS

A private, small CSS library extracted from Cradle. Version **0.7.1**.

Neutral surfaces, subtle borders, compact navigation, readable 16px text and restrained accent colours. Plain HTML and CSS, with no package manager, framework, build step or required JavaScript. Inter is the default font family, with system fallbacks. The optional font loader fetches Inter from Google Fonts; the core alone makes no network requests.

## Preview

Open `index.html` directly in a browser. It contains working theme controls, forms, a native modal, cards, metrics, tables and reading/chat examples. `starter.html` is the smallest starting point. The gallery keeps its sidebar fixed on desktop; on phones, its navigation wraps so every component link is visible without horizontal scrolling.

Alternatively, serve this directory:

```sh
timeout 300s python3 -m http.server 9963 --bind 127.0.0.1
```

Run from the repository root, open `http://127.0.0.1:9963/`, and stop with Ctrl+C.

## Use in another project

Copy `cradle.css`, `fonts.css` and `fonts.js` into the project's static assets for the default Inter interface:

```html
<link rel="stylesheet" href="/css/cradle.css">
<link rel="stylesheet" href="/css/fonts.css">
<script src="/css/fonts.js"></script>
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

For font choices and automatic Inter loading, include `fonts.css` and `fonts.js` after the core CSS. Omit both to use the core with installed fonts and system fallbacks. Fonts stay on the CDN; no font binaries are bundled.

```html
<link rel="stylesheet" href="fonts.css">
<script src="fonts.js"></script>
```

Set `data-font` on `<html>` to `inter` (default when omitted), `native-sans` (system), `native-serif` or `native-mono` (JetBrains Mono; historical option name retained for compatibility). Set an explicit choice before loading `fonts.js` to avoid fetching an unused interface font. The loader honours that choice on startup; runtime choices use the same helper:

```js
CradleFonts.select('native-sans'); // Use the system font instead of Inter.
CradleFonts.load('mono');  // For code/pre blocks.
CradleFonts.select('native-mono'); // Set the interface font and load it when needed.
```

The helper de-duplicates stylesheet/preconnect links and uses the [Google Fonts CSS API](https://developers.google.com/fonts/docs/css2) with variable weights and `display=swap`. `fonts.css` owns all optional font stacks and the `--cr-mono` code font token. System fonts remain the fallback if loading fails. The core alone prefers installed Inter and falls back to system fonts without network requests. Including `fonts.js` loads Inter by default, or JetBrains Mono for an explicit `native-mono` choice. Explicit System/Serif choices do not fetch an interface font. The gallery and starter load Inter by default; the gallery also loads JetBrains Mono for code samples. For a CSS-only CDN setup, include a Google Fonts stylesheet for Inter with `display=swap` directly in your HTML.

## Components

| Purpose | Classes |
| --- | --- |
| Page layout | `cr-container`, `cr-section` |
| App shell | optional `cr-drawer-shell` modifier; `cr-shell`, `cr-sidebar`, `cr-sidebar-head`, `cr-brand`, `cr-nav`, `cr-sidebar-foot`, `cr-main` |
| Buttons | `cr-button` with optional `cr-primary`, `cr-quiet`, `cr-danger`, `cr-danger-fill`, `cr-bare` |
| Destructive actions | `cr-danger-box` (optional `cr-danger-title` or `h3`) around a message, an optional type-to-confirm `cr-field` and a `cr-danger-fill` button |
| Forms | `cr-form`, `cr-field`, `cr-row`, `cr-check`, `cr-toolbar` |
| Breadcrumb navigation | `cr-breadcrumbs` |
| Mixed-width dashboard | `cr-dashboard`, `cr-span-third`, `cr-span-half`, `cr-span-two-thirds`, `cr-span-full` |
| Native progress | `cr-progress` on `<progress>` |
| Cards | `cr-grid`, `cr-card`, `cr-card-head`, `cr-identity`, `cr-avatar` |
| Badges | `cr-badge`, optional `cr-outline` |
| Metrics | `cr-metrics`, `cr-metric` |
| Tables | `cr-table-wrap`, `cr-table`, `cr-sort`; optional `cr-table-scroll`, `cr-table-sticky`, `cr-table-actions` |
| Native disclosure | `cr-details` on `<details>` |
| Native dialog | `cr-dialog`, `cr-dialog-head`, `cr-dialog-body`, `cr-dialog-foot` |
| Reading and chat | `cr-prose`, `cr-message`, `cr-composer` |
| Tab controls | `cr-tabs` |
| Loading indicator | `cr-busy` (hide with `hidden`; respects reduced motion) |
| Supporting text | `cr-subtle`, `cr-error`, `cr-sr-only` |

Single-line inputs and selects share a 46px minimum height (`--cr-control-height`). Textareas inside `cr-field` have a 120px minimum height (`--cr-textarea-min-height`) and remain vertically resizable; larger `rows` values can make them taller. Override these tokens in `:root` or on an individual form.

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

Primary tokens: `--cr-paper` (page), `--cr-soft` (secondary surface), `--cr-ink`, `--cr-muted`, `--cr-faint`, `--cr-line`, `--cr-accent`, `--cr-accent-soft`, `--cr-accent-line`, `--cr-on-accent`, `--cr-danger`, `--cr-danger-soft`, `--cr-on-danger`, `--cr-font`, `--cr-font-size`, `--cr-control-height` (46px), `--cr-textarea-min-height` (120px), `--cr-radius`, `--cr-sidebar`, `--cr-container-width` (1440px), `--cr-form-width` (860px), `--cr-prose-width` (760px).

Palette rules are more specific than `:root`. To override colours for a selected palette/mode, match its selectors in your final override sheet, for example `:root[data-skin="nord"][data-theme="dark"]`. Change accent text and background together and check contrast.

## AI handoff

Give another coding assistant this repository and this instruction:

> Use my private Cradle CSS library as this project's visual foundation. Read its README and component gallery, reuse cradle.css and the documented cr- components, and preserve the quiet layout, 16px typography, subtle borders and restrained accents. Use fonts.css/fonts.js for the default Inter interface and themes.css only if needed. Adapt the examples to the project's framework. Keep project-specific styles in a separate stylesheet; extend existing components before adding new ones. Use native accessible elements and check desktop/mobile and light/dark rendering.

## Repository and maintenance

The private repository is [david/cradle-css](https://git.v51.si/david/cradle-css). Clone it with:

```sh
git clone ssh://git@git.home.vidmar.net:2222/david/cradle-css.git
```

Commit the CSS, examples and README together. Applications should copy from a recorded commit, or vendor a pinned checkout through their existing build process. Keep the library version pinned; its upgrades should be deliberate and reviewable. Optional Inter uses the Google Fonts CDN.

The Cradle application still owns its existing styles. This extraction does not change its CSS imports. After the separate repository exists, adopting the library in Cradle is a separate integration step with visual regression checks.

This initial library consolidates duplicate controls and theme overrides, removes app IDs and backend dependencies, prefixes component names and tokens, makes fonts/palettes optional, and fixes minimum card widths on phones. It intentionally remains a small source library; there is no generated/minified copy to keep synchronized. Keep changes focused, update the examples, verify rendering, and record breaking changes before adoption. Use Playwright for browser QA, including desktop/mobile, light/dark/auto, keyboard focus, dialogs, form feedback and overflow. When adding gallery sections, check that every mobile navigation link stays visible. Keep temporary tests/screenshots outside the repository, bound commands with explicit timeouts, and stop temporary servers.

For private use. Inter is requested from Google Fonts rather than redistributed here.


## Hosted gallery on Bob

The gallery is available at [cradle.home.vidmar.net/css/](https://cradle.home.vidmar.net/css/) and uses Cradle's existing Pocket ID sign-in.

Bob's authoritative `~/app-dev/docker-compose.yml` mounts a pinned release read-only at `/app/wwwroot/css` in the existing `cradle` service. Gallery assets live in `~/app-dev/config/cradle-css/releases/<commit>/site`; `deployment.json` beside the site records the commit, asset hashes, application image/version and Compose backup. Only HTML, CSS, example JavaScript and `version.txt` are served.

Every push to library `main` automatically deploys the gallery to Bob through a Forgejo repository hook. The hook (`scripts/forgejo-post-receive.sh`) exports only the committed gallery assets and sends them to `scripts/bob-deploy-gallery.py`, installed at `~/app-dev/config/cradle-css/bob-deploy-gallery.py`. Its dedicated SSH key is restricted to that receiver; no private key lives in Git. The hook is installed alongside Forgejo’s existing hooks at `cradle-css.git/hooks/post-receive.d/deploy-gallery`; its key and pinned host key live in Forgejo’s persistent `/data/gitea/gallery-deploy/` directory.

The receiver backs up the authoritative Compose file, updates only the gallery mount and recreates only `cradle` using its running immutable image ID (`--no-deps --no-build --pull never`). It verifies the application image/version and mounted asset hashes and restores the previous mount if checks fail. Restarting Cradle revokes its in-memory sessions. A failed deployment reports an error in the push output; the commit is still in Git, so retry deployment before reporting the push as published. Branch/tag pushes do not deploy, and the application’s pinned CSS submodule remains independent.

Run receiver regression tests with `python3 -m unittest discover -s tests`. For a manual retry, export the eight asset names listed in the hook with `git archive <full-commit>` and pipe it over SSH to Bob’s receiver with `deploy <full-commit>`. Never overwrite the shared Compose file from a repository template or copy application data into the CSS release.

The home-host HTTPS router also uses exact-path `cradle-css-slash` and `cradle-css-index` middleware: `/css` redirects to `/css/`, and `/css/` is rewritten to `/css/index.html` before reaching Cradle. This avoids its source-bookmark route while preserving the existing sign-in gate. Preserve these middleware settings when updating the authoritative Traefik configuration.


## Optional sortable tables

Load optional `sort-tables.js` with `defer`; it makes every supported table inside `.cradle` sortable by default, including plain/Markdown tables and tables inserted later. No `data-sortable` opt-in is needed:

```html
<script defer src="sort-tables.js"></script>
<table class="cr-table">
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

The helper creates native header buttons with visible direction indicators and `aria-sort`. Click, Enter or Space toggles ascending/descending. Columns infer plain decimal/exponent numbers or ISO dates when all nonempty values match; other columns use locale-aware natural text comparison. Set header `data-sort="text"`, `"number"` or `"date"` to choose explicitly (recommended for formatted/mixed values), or `"auto"` to infer. Set `data-sort-value` on a cell when its display text differs from its machine value, such as currency or a formatted date. Empty values, and invalid values in explicit numeric/date columns, stay last in both directions; ties retain their current row order. Existing row elements and their event handlers are preserved.

Newly inserted tables initialize automatically. `CradleTables.init(container)` remains available for manual initialization; repeated initialization is safe. This small helper supports one header row, one body and unmerged cells, and sorts only the rows currently in the DOM. For paginated/server-backed tables, let the application implement ordering. Set `data-sortable="false"` on a table or `data-sort="none"` on a header to opt out. Headers containing interactive controls are left to the application; nested, merged or uneven tables are skipped. Tables remain ordinary readable HTML without JavaScript.

Version 0.2.0 adds this optional helper and the matching header controls; core CSS still requires no JavaScript. Add `sort-tables.js` to the served release assets when deploying the updated gallery.


## Application integration helpers

`cr-tabs` styles native tab buttons; the application owns their tablist/tabpanel relationships, selection and keyboard navigation. `cr-drawer-shell` keeps the desktop sidebar and switches to a phone drawer; the application owns its toggle, aria-expanded and Escape/outside-close behavior. `cr-busy` is an indeterminate loading bar; set hidden when idle and provide a progress/status label.

For tables redrawn from typed application records, `CradleTables.order(items, key, direction, locale)` provides the same stable comparison and missing-last rules as DOM sorting. It returns a new ordered array, preserves record references, and accepts ascending/descending plus an optional language tag. The application can retain column/direction state across refreshes while using shared `cr-sort` header controls and aria-sort.

Fonts and palette definitions are owned here. Consumers keep their selected values and domain-specific UI state; they should not duplicate font stacks, CDN URLs or palette colours in application CSS.

Version 0.2.1 restores compact 13px typography for bare buttons and explicitly centres tab labels. Bare buttons inherit the selected font family without replacing the button font size.

Version 0.2.2 exposes layout widths as tokens: `--cr-container-width`, `--cr-form-width` and `--cr-prose-width`. Defaults are unchanged; override them in `:root` instead of redeclaring `.cr-container`, `.cr-form` or `.cr-prose`.

Version 0.3.0 (breaking): the default `--cr-container-width` grows from 1180px to 1440px so layouts target laptop and 24" displays. Set `--cr-container-width: 1180px` to keep the previous width. Also fixes a missing semicolon in the dark palette that left `--cr-faint` unset and `--cr-accent-line` invalid in dark mode.

Version 0.4.0 (breaking): Inter becomes the default interface family. The optional `fonts.js` loader fetches it automatically unless `data-font` explicitly selects another font. Gallery and starter use Inter by default. To restore the previous interface, include `fonts.css` and set `data-font="native-sans"` on `<html>` before the loader runs, or override `--cr-font` in your project stylesheet. The core still has no required JavaScript or CDN dependency.

Version 0.4.1 aligns native input/select minimum heights and gives form textareas a configurable minimum height. The gallery Description field now starts with four rows.

Version 0.5.0 (breaking): loading `sort-tables.js` enables sorting for all supported tables inside `.cradle`, with automatic column types and initialization of new tables. Previously tables/columns required explicit opt-in. Use `data-sortable="false"` or header `data-sort="none"` where row order must be preserved; application-managed headers keep their own controls. CSS-only tables still work without JavaScript.


## Dashboard, breadcrumbs and progress (0.6.0)

These additions are opt-in and work without JavaScript. Existing grids and tables keep their layout.

Use a labelled breadcrumb navigation with an ordered list and `aria-current="page"` on the current item. Long names wrap so links and keyboard focus stay visible:

```html
<nav class="cr-breadcrumbs" aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Workspace</a></li>
    <li><a href="/projects">Projects</a></li>
    <li><span aria-current="page">Sample notes</span></li>
  </ol>
</nav>
```

Use existing `cr-card` components inside `cr-dashboard`. Cards stack by default; when the dashboard itself is at least 760px wide, the span classes occupy a third, half, two thirds or the full six-column grid. Cards without a span class occupy the full row. Container queries respond to the available content width rather than just the viewport; browsers without container queries retain stacked cards. The default page width remains 1440px.

```html
<div class="cr-dashboard">
  <article class="cr-card cr-span-third">Summary</article>
  <article class="cr-card cr-span-two-thirds">Details</article>
  <article class="cr-card cr-span-half">First panel</article>
  <article class="cr-card cr-span-half">Second panel</article>
  <article class="cr-card cr-span-full">Activity</article>
</div>
```

Use a native labelled `<progress>` with `value` and `max`. Keep readable values outside the bar: its fallback text is not normally visible in supporting browsers. Values of zero and the maximum represent waiting and completion. The application owns updates; use a separate polite status message for meaningful milestones rather than announcing every increment. Omit `value` for native indeterminate progress; its appearance varies by browser. The existing `cr-busy` is available for the application-wide indeterminate indicator.

```html
<label for="import-progress">Documents imported · 64 of 100</label>
<progress id="import-progress" class="cr-progress" value="64" max="100">64%</progress>
<p class="cr-subtle">64% complete</p>
```

Override `--cr-progress-height` (8px) to change bar thickness. Colours follow the active palette.

## Sticky table headings and actions (0.6.0)

Add `cr-table-scroll` to the existing wrapper for bounded vertical scrolling (`--cr-table-max-height`, default 320px). Add `cr-table-sticky` to the table for sticky headings. Put `cr-table-actions` on the header and every cell of a single trailing action column; it stays at the inline end while scrolling horizontally. Header/action intersections layer above the body with opaque theme surfaces. Use `data-sort="none"` on the action header when the optional sorting helper is loaded.

```html
<div class="cr-table-wrap cr-table-scroll" tabindex="0" role="region" aria-label="Project sources">
  <table class="cr-table cr-table-sticky">
    <thead><tr>
      <th scope="col">Source</th>
      <th scope="col" class="cr-table-actions" data-sort="none">Actions</th>
    </tr></thead>
    <tbody><tr>
      <td>Sample notes</td>
      <td class="cr-table-actions"><button class="cr-button" type="button" aria-label="Edit Sample notes">Edit</button></td>
    </tr></tbody>
  </table>
</div>
```

The focusable, named wrapper supports keyboard scrolling. Stickiness is relative to the wrapper, not the page. Use one unmerged header row and one trailing action column; keep action controls compact so they leave room for data on phones. Set a project-specific table minimum width only when its content needs horizontal scrolling. The gallery demonstrates both scroll directions and preserves action buttons when sorting.

Version 0.6.0 adds these four component patterns without changing existing defaults. The design reference is [Dreeve](https://github.com/dreeveapp/dreeve); the implementation uses Cradle tokens and native markup without importing upstream code or dependencies.

Version 0.7.0 adds destructive-action design. `cr-danger-box` is a tinted, red-bordered panel for irreversible actions (title, message, optional type-to-confirm field, then a `cr-danger-fill` button). `cr-danger` gets a soft red hover/pressed tint, both danger buttons focus with a red ring, and the solid button has a not-allowed disabled state. New tokens `--cr-danger-soft` (panel and hover tint) and `--cr-on-danger` (text on `cr-danger-fill`: white in light themes, the page colour in dark ones, where the red is light; this fixes white-on-light-red contrast in dark mode). Not breaking: existing markup keeps working.



Version 0.7.1 fixes shell scrolling during anchor navigation: `cr-main` now contains absolutely positioned descendants, including visually hidden labels, so they cannot expand or scroll the outer document/shell. Keep such labels within their relevant scroll pane; do not position them relative to the outer shell. The gallery also gives the sticky-table example its own section with 32px of top spacing and the existing section scroll margin.
