# Cradle CSS

A private, small CSS library extracted from Cradle. Version **0.12.0**.

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

Each optional palette is a standalone file, `theme-<name>.css`. Load the one you use after `cradle.css`, for example `theme-gen-i.css` or `theme-nord.css`. `themes.css` imports every theme file for palette pickers; publish the imported files beside it. Set `data-skin` on `<html>` to `cradle`, `dracula`, `one-dark`, `nord`, `solarized`, `monokai`, `tokyo-night`, `catppuccin`, `gruvbox`, `material`, or one of the GEN-I variants: `gen-i`, `gen-i-sidebar`, `gen-i-teal`, `gen-i-charcoal`, `gen-i-tint`, `gen-i-crisp`, `gen-i-canvas`, `gen-i-lagoon` or `gen-i-midnight`.

Theme mode is CSS-only: omit `data-theme` for the system setting, or use `data-theme="light"` / `data-theme="dark"`. Auto works for every palette. The gallery's `examples.js` only demonstrates switching and interactions; it is not a library dependency.

For font choices and automatic Inter loading, include `fonts.css` and `fonts.js` after the core CSS. Omit both to use the core with installed fonts and system fallbacks. Fonts stay on the CDN; no font binaries are bundled.

```html
<link rel="stylesheet" href="fonts.css">
<script src="fonts.js"></script>
```

Set `data-font` on `<html>` to `inter` (default when omitted), `native-sans` (system), `native-serif`, `native-mono` (JetBrains Mono; historical option name retained for compatibility) or `gen-i` (compatibility alias for Inter). Set an explicit choice before loading `fonts.js` to avoid fetching an unused interface font. The loader honours that choice on startup; runtime choices use the same helper:

```js
CradleFonts.select('native-sans'); // Use the system font instead of Inter.
CradleFonts.load('mono');  // For code/pre blocks.
CradleFonts.select('native-mono'); // Set the interface font and load it when needed.
```

The helper de-duplicates stylesheet/preconnect links and uses the [Google Fonts CSS API](https://developers.google.com/fonts/docs/css2) with variable weights and `display=swap`. `fonts.css` owns all optional font stacks and the `--cr-mono` code font token. System fonts remain the fallback if loading fails. The core alone prefers installed Inter and falls back to system fonts without network requests. Including `fonts.js` loads Inter by default, or JetBrains Mono for an explicit `native-mono` choice. Explicit System/Serif choices do not fetch an interface font; GEN-I uses the same optional Inter loader as the default. The gallery and starter load Inter by default; the gallery also loads JetBrains Mono for code samples. For a CSS-only CDN setup, include a Google Fonts stylesheet for Inter with `display=swap` directly in your HTML.

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
| Lucide icons | `cr-icon` on `<svg>` with optional local `lucide.svg` |
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

## Have AI build with Cradle CSS

Give the coding assistant access to this repository or a pinned checkout inside your application. The README explains the API, `index.html` shows the component markup, and `starter.html` is the smallest working page. The hosted gallery is a visual reference; the assistant also needs source files to implement the components. Point it at the actual checkout path in your prompt.

Copy this prompt and replace the bracketed paths and task:

> Implement [the page or feature] in this application using Cradle CSS from [library checkout path]. Read that checkout's README.md, cradle.css and index.html before editing. Reuse its documented cr- components and --cr- tokens. Keep native styles inside .cradle, the readable 16px base, quiet surfaces, subtle borders and desktop width defaults; use responsive rules for phones. Adapt the component markup to this application's framework and keep application-specific overrides in an external stylesheet loaded last. Use the optional fonts.css/fonts.js for Inter and the bundled Lucide sprite for interface icons. Keep icon labels accessible and use consistent icon names. The application owns routing, data, tab/drawer state, progress updates and destructive-action confirmation. Implement the requested UI, update the runtime asset/publish rules, and verify it with Playwright at 1440px, 1920px and 390px in light/dark/auto modes, including keyboard focus, dialogs, forms and overflow. Test with the deployed application's CSP. Report the library commit, changed screens, assets included and checks performed. Follow this application's commit and deployment permissions.

For future tasks, put a short version in the **application's** `AGENTS.md` (or its equivalent agent instructions):

```text
Use our pinned Cradle CSS checkout at [path] for interface work.
Read its README and gallery before adding or changing UI.
Reuse cr- components and --cr- tokens; keep app overrides external and small.
Use Lucide for icons with accessible labels. Keep application behavior here.
For upgrades, review the library diff, update runtime publishing, and explicitly
adopt applicable new components in app markup. Record which screens use them.
Verify with Playwright under the deployed CSP, including desktop/mobile,
themes, keyboard focus, dialogs, form feedback and overflow.
```

### Choose the application assets

Publish these files from the **same pinned library commit**, according to the features your application uses:

| Asset | Include when |
| --- | --- |
| `cradle.css` | Always: base styles, tokens and component styling |
| `fonts.css`, `fonts.js` | Using the optional Inter/JetBrains Mono choices and CDN loader |
| `theme-<name>.css` | Using one optional palette, such as `theme-gen-i-teal.css` |
| `themes.css` plus all `theme-*.css` | Offering a runtime palette picker; `themes.css` only `@import`s the theme files |
| `sort-tables.js` | Enabling client-side table sorting or the typed ordering helper |
| `lucide.svg` | Referencing bundled Lucide icons; preserve its embedded licence |

Use `starter.html` and the gallery as examples. `index.html`, `examples.css` and `examples.js` belong to the library gallery; applications implement their own pages and behavior. Keep Git metadata, instructions and machine-local files out of public assets. Use external stylesheets and same-origin sprite URLs compatible with the application's CSP.

## Update the library in an application

Updating the library checkout/files makes its features available. Adopting new components also requires changes to the application's markup and, where relevant, its behavior. A library push deploys the gallery on Bob; upgrading and deploying a consuming application is a separate step.

1. Identify the current library commit and the target commit. Read the README release notes and review the diff for breaking changes, new assets and new components. Keep a record of the previous pin for rollback.
2. Update to a specific approved commit using the application's existing integration method. Keep local library modifications safe and reviewable before changing its checkout.
3. Refresh the runtime files together and update copy/build/publish allowlists for any new assets. Check the built output or container, not just the source directory.
4. Map the new features to the application's screens, implement the applicable components, and remove obsolete overrides that mask the new styles. Keep application state and interactions in the application.
5. Run the application and verify the upgraded screens with Playwright under its deployed CSP. Record the actual library commit and the adoption results below.
6. Commit the application changes, including the submodule pin or vendored files, under the application's authorization rules. Rebuild and deploy the application, then check the served assets and UI. Retain the previous application/library revision for rollback.

### If the application uses a Git submodule

From the application repository, initialize its recorded pin first. Then fetch the library and select the reviewed target. Replace the two quoted values with the application's submodule path and a full approved commit SHA:

```sh
timeout 30s git submodule update --init --recursive
LIBRARY_PATH='path/to/cradle-css'
LIBRARY_COMMIT='FULL_APPROVED_COMMIT_SHA'
timeout 10s git -C "$LIBRARY_PATH" status --short
timeout 10s git -C "$LIBRARY_PATH" rev-parse HEAD
timeout 30s git -C "$LIBRARY_PATH" fetch origin
timeout 10s git -C "$LIBRARY_PATH" show --stat "$LIBRARY_COMMIT"
# After reviewing the target and any local changes:
timeout 10s git -C "$LIBRARY_PATH" checkout --detach "$LIBRARY_COMMIT"
timeout 10s git diff --submodule=log -- "$LIBRARY_PATH"
```

The parent repository records the selected commit as its gitlink. Include that path in the authorized application commit together with markup, publish-rule and integration changes. New library work must be committed and pushed in the library repository before the parent can publish a gitlink to it. Initializing a submodule alone restores the parent's existing pin; it does not select a newer library version.

**Cradle application:** its submodule path is `src/Cradle.Web/wwwroot/vendor/cradle-css`. Its runtime publish allowlist and required-file checks are in `src/Cradle.Web/Cradle.Web.csproj`. Update those rules when adopting a new runtime asset: for example, Lucide use needs `lucide.svg` in the published output. The gallery deployment does not update Cradle's submodule pin, publish list or UI markup.

### If the application copies runtime files

Check out the reviewed library commit, copy the assets listed above into the existing public asset location, and update the application's recorded source commit/version. Include newly required files and review removed files. Use the application's existing cache strategy (such as content hashes, a commit-based asset URL or revalidation) so browsers fetch the new files after deployment. Keep project overrides separate from the copied library files.

## Make sure new features are used after an update

Use an adoption record in the application PR or integration notes. For every new feature in the reviewed release, record the app screen, required markup/behavior, validation and whether it was adopted or skipped with a reason. Updating an existing component's CSS can change its appearance automatically; newly added opt-in components need application markup. Optional JavaScript helpers need a script import and compatible markup too.

| Feature | Application adoption | Proof in the running app |
| --- | --- | --- |
| Lucide icons | Publish `lucide.svg`; add labelled `cr-icon` SVG references using valid symbol names | Sprite request succeeds; icons render with the intended gap/colour; controls have accessible names |
| Sticky table headers/actions | Add `cr-table-scroll`, `cr-table-sticky` and a single trailing `cr-table-actions` column; exclude its header from sorting | Scroll both directions; headings/actions stay visible and keyboard sorting still works |
| Breadcrumbs | Add `cr-breadcrumbs` with real route links and `aria-current="page"` | Links navigate correctly, long labels wrap, and keyboard focus remains visible |
| Progress bars | Add labelled native `cr-progress` elements and wire real `value`/`max` updates | Trigger the operation and check waiting, partial and complete states with readable values |
| Mixed-width cards | Use `cr-dashboard` and the appropriate span classes on its direct children | Inspect widths in a desktop container and stacking in a narrow container |
| Destructive-action panel | Use `cr-danger-box`/danger controls and implement the application's confirmation rules | Exercise confirmation and disabled/focus states; verify the intended application action |
| Sortable tables | Load `sort-tables.js`, configure formatted values and opt-outs as needed | Click and use Enter/Space; inspect aria-sort, actual row ordering and row actions |

Check the deployed stylesheet/script/sprite responses, including status, MIME type and cache behavior, and compare their contents/hashes with the pinned files. Confirm the application build includes the assets, the page imports them, the DOM contains the expected component classes, and old overrides do not cancel the new rules. Exercise the actual feature and check computed layout, screenshots, console/CSP errors and keyboard behavior. Use Firefox for Firefox reports and Playwright WebKit for Safari reports; distinguish WebKit checks from testing the user's actual Safari.

Copy this upgrade prompt for the assistant:

> Upgrade this application's Cradle CSS integration from [old commit] to [approved target commit] at [checkout path]. Read the target README/gallery and the old-to-new library diff. Update the pin or copied runtime assets and the build/publish rules. Review every new feature and map it to an app screen. Implement the applicable components and interactions; record skipped features with reasons. In particular, adopt [the features/screens you want, for example Lucide icons in navigation and sticky actions in the sources table]. Verify the running app with Playwright under its deployed CSP, including desktop/mobile, themes, keyboard focus, dialogs, forms, overflow and real feature interactions. Report the target commit, assets, screens, adoption record and test evidence. After an authorized app deployment, verify the served asset versions and the same interactions there.

## Repository and maintenance

The private repository is [david/cradle-css](https://git.v51.si/david/cradle-css). Clone it with:

```sh
git clone ssh://git@git.home.vidmar.net:2222/david/cradle-css.git
```

Commit the CSS, examples and README together. Applications should copy from a recorded commit, or vendor a pinned checkout through their existing build process. Keep the library version pinned; its upgrades should be deliberate and reviewable. Optional Inter uses the Google Fonts CDN.

The Cradle application consumes a pinned submodule of this repository and owns its application-specific styles and behavior. Updating the library or deploying its gallery does not update the application pin or adopt new components; use the application update/adoption workflow above.

This initial library consolidates duplicate controls and theme overrides, removes app IDs and backend dependencies, prefixes component names and tokens, makes fonts/palettes optional, and fixes minimum card widths on phones. It intentionally remains a small source library; there is no generated/minified copy to keep synchronized. Keep changes focused, update the examples, verify rendering, and record breaking changes before adoption. Use Playwright for browser QA, including desktop/mobile, light/dark/auto, keyboard focus, dialogs, form feedback and overflow. When adding gallery sections, check that every mobile navigation link stays visible. Keep temporary tests/screenshots outside the repository, bound commands with explicit timeouts, and stop temporary servers.

For private use. Inter is requested from Google Fonts rather than redistributed here.


## Hosted gallery on Bob

The gallery is available at [cradle.home.vidmar.net/css/](https://cradle.home.vidmar.net/css/) and uses Cradle's existing Pocket ID sign-in.

Bob's authoritative `~/app-dev/docker-compose.yml` mounts a pinned release read-only at `/app/wwwroot/css` in the existing `cradle` service. Gallery assets live in `~/app-dev/config/cradle-css/releases/<commit>/site`; `deployment.json` beside the site records the commit, asset hashes, application image/version and Compose backup. Only allowlisted HTML, CSS, example JavaScript, the optional Lucide SVG sprite and `version.txt` are served.

Every push to library `main` automatically deploys the gallery to Bob through a Forgejo repository hook. The hook (`scripts/forgejo-post-receive.sh`) exports only the committed gallery assets and sends them to `scripts/bob-deploy-gallery.py`, installed at `~/app-dev/config/cradle-css/bob-deploy-gallery.py`. Its dedicated SSH key is restricted to that receiver; no private key lives in Git. The hook is installed alongside Forgejo’s existing hooks at `cradle-css.git/hooks/post-receive.d/deploy-gallery`; its key and pinned host key live in Forgejo’s persistent `/data/gitea/gallery-deploy/` directory.

The receiver backs up the authoritative Compose file, updates only the gallery mount and recreates only `cradle` using its running immutable image ID (`--no-deps --no-build --pull never`). It verifies the application image/version and mounted asset hashes and restores the previous mount if checks fail. Restarting Cradle revokes its in-memory sessions. A failed deployment reports an error in the push output; the commit is still in Git, so retry deployment before reporting the push as published. Branch/tag pushes do not deploy, and the application’s pinned CSS submodule remains independent.

Run receiver regression tests with `python3 -m unittest discover -s tests`. For a manual retry, export the ten asset names listed in the hook with `git archive <full-commit>` and pipe it over SSH to Bob’s receiver with `deploy <full-commit>`. Never overwrite the shared Compose file from a repository template or copy application data into the CSS release.

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



Version 0.7.1 fixes shell scrolling during anchor navigation: `cr-main` now contains absolutely positioned descendants, including visually hidden labels, so they cannot expand or scroll the outer document/shell. Keep such labels within their relevant scroll pane; do not position them relative to the outer shell. The gallery also gives the sticky-table example its own section with 32px of explicit top padding and the existing section scroll margin. This keeps the spacing inside the section rather than relying on adjacent margins.


## Optional Lucide icons (0.8.0)

Use [Lucide](https://lucide.dev/icons/) for interface icons in projects using Cradle CSS. The pack includes the complete **lucide-static 1.56.0** SVG sprite (`lucide.svg`, 1879 named symbols), pinned from the [official static package](https://www.npmjs.com/package/lucide-static/v/1.56.0). No JavaScript, icon font, CDN or build step is required. The optional sprite is only fetched when your markup references it; the core stylesheet alone does not load icons.

Copy `lucide.svg` alongside your CSS, then use a native SVG reference. Keep the sprite on the same origin and serve it over HTTP(S); browsers restrict external SVG references when opening files directly with `file://`. Inline individual Lucide SVG markup is an alternative for direct-file use or applications needing just a few icons. Keep the relevant upstream licence notices when copying individual SVGs. The gallery ends with the complete catalogue: three columns on desktop, two on smaller screens, and 20px between each icon and its name. Search stays visible above the expanded catalogue; typing filters names and reopens the catalogue, and Clear search restores every icon. Filtering requires only the optional gallery JavaScript.

```html
<button class="cr-button" type="button">
  <svg class="cr-icon" aria-hidden="true" focusable="false">
    <use href="lucide.svg#save"></use>
  </svg>
  Save
</button>

<button class="cr-button cr-quiet" type="button" aria-label="Search workspace">
  <svg class="cr-icon" aria-hidden="true" focusable="false">
    <use href="lucide.svg#search"></use>
  </svg>
</button>
```

Use kebab-case symbol names from the catalogue. Default size is 18px (`--cr-icon-size`); stroke width is 2 (`--cr-icon-stroke`). Icons inherit `currentColor`, so buttons, navigation and theme colours apply without additional variants. Prefer labelled controls; decorative SVGs must use `aria-hidden="true"` and `focusable="false"`. Give icon-only controls an accessible name. For a standalone meaningful icon use `role="img"` and an accessible name on the SVG. Do not rely on an icon alone to communicate success, danger or progress. Keep Lucide's line style and choose a consistent symbol for each action; avoid mixing icon libraries or substituting emoji for interface controls.

`lucide.svg` embeds the full upstream licence notices; [LUCIDE-LICENSE](LUCIDE-LICENSE) preserves the original notice separately. Lucide uses ISC with MIT notices for icons derived from Feather. Preserve these notices when distributing the sprite. Upstream references: [static usage](https://lucide.dev/guide/static), [accessibility](https://lucide.dev/guide/advanced/accessibility), [licence](https://lucide.dev/license).

Version 0.8.0 adds optional Lucide icons and the full searchable gallery catalogue. Existing core usage is unchanged. To update the sprite, use a pinned official `lucide-static` archive, retain its licence, regenerate the gallery's symbol list from the sprite, and verify every reference in Playwright Chromium and WebKit. Keep the gallery archive below the receiver's 2 MiB limit and each asset below 1 MiB.

The installed copies were synchronized for the 0.8.0 release. Before any future asset-list change is pushed, synchronize the installed Forgejo `post-receive.d/deploy-gallery` hook and Bob's `~/app-dev/config/cradle-css/bob-deploy-gallery.py` receiver with the repository scripts: both now allowlist `lucide.svg` in addition to the previous eight assets. Updating these script sources alone does not update their installed copies. Run receiver tests before installing them; retain the restricted SSH key/host settings and existing deployment safeguards. Do this as part of an authorized publish, before pushing main, then verify the sprite hash alongside all other deployed assets. Application consumers must include `lucide.svg` in their separate runtime-asset copying rules when adopting icons.


Version 0.8.1 moves all gallery presentation into external `examples.css` so Cradle's `style-src` policy can apply it. The catalogue now uses a three-column desktop/two-column mobile grid, with each row placing its 24px icon in a separate grid track and a 20px gap before a 12px name. The same sheet owns mobile navigation wrapping, search layout and sticky-demo spacing/width. Do not add inline style blocks or style attributes to the gallery: Bob's policy rejects them. Validate the served gallery with Bob's CSP in Playwright Firefox, Chromium and WebKit. `examples.css` is for the gallery only; application consumers still use core CSS and optional runtime assets.

The publishing allowlists now include `examples.css` (ten assets plus generated version.txt). Both installed deployment scripts were synchronized for 0.8.1. Synchronize them again when the allowlists change, and verify the stylesheet hash on every deployment. Keep this external sheet linked from index.html and included in future gallery releases.


## Optional GEN-I theme (0.9.0)

Use `data-skin="gen-i"` with `theme-gen-i.css` after the core stylesheet. Light mode follows the supplied GEN-I CGP reference's digital colours exactly: teal **#005670** for primary actions/links, gray **#414141** for main text, and white **#FFFFFF** for surfaces/text on teal. The supplied reference identifies the November 2015 manual, volume A, p. 8, §3.4; current corporate approval and the original PDF were not independently verified here.

```html
<html lang="sl" data-skin="gen-i" data-theme="light" data-font="gen-i">
<head>
  <link rel="stylesheet" href="cradle.css">
  <link rel="stylesheet" href="theme-gen-i.css">
  <link rel="stylesheet" href="fonts.css">
  <script src="fonts.js"></script>
</head>
<body class="cradle">
  <!-- Reuse ordinary Cradle components here. -->
</body>
</html>
```

Remove `data-theme` to follow the system, or set it to `dark`. White/light surfaces, neutral borders, muted text and error states are digital application choices; they are not additional official brand colours. Dark mode is also a digital adaptation, using #78D2E2 for readable accents on deep teal surfaces. It does not represent Pantone 8201 or a metallic effect. GEN-I reuses the existing component shapes, spacing, 16px base and desktop width defaults. The gallery offers GEN-I in the palette selector and shows the original three colours plus Slovenian character samples.

Typography is selected separately. Use **Inter**, the pack's existing web font, for both GEN-I palettes. `data-font="gen-i"` remains a compatibility alias for `inter` in `fonts.css` and `fonts.js`; both selections use the same optional Google Fonts stylesheet and system fallbacks. This is an explicit web-interface adaptation, rather than the manual's print typography. Set `data-font="native-sans"` or omit `fonts.js` when network font loading is unwanted. Test č/š/ž rendering in the delivered interface. Choosing a colour palette alone keeps the application's selected typography.

No GEN-I logo is bundled or recreated. Use an approved official asset, preserve its proportions and clearance, and give a linked logo a destination label. Official logo delivery and clearance remain application responsibilities; the palette alone is not a complete approved GEN-I design system.

Measured palette pairs include teal/white **8.19:1**, gray/white **10.21:1**, and the light neutral border/secondary surface above **3:1**. Validate the actual app states, including icons, focus and errors, against WCAG 2.2 AA. This palette does not certify an application's accessibility or implement domain-specific review/AI workflows. Use the shared native controls, evidence and human-review patterns appropriate to the application's task.

Version 0.9.0 introduced the GEN-I palette and an installed-font profile; version 0.10.0 replaces that profile with Inter. Existing palettes retain their colours, and default Inter consumers keep their font. No new deployment assets are required: the palette, font profile and gallery are part of the existing published files.


### GEN-I blue-sidebar alternative (0.10.0)

Set `data-skin="gen-i-sidebar"` to use the official teal **#005670** for the shell sidebar and charcoal **#414141** for light-mode primary buttons, links and UI highlights. Content surfaces remain white. Both GEN-I palettes are available in the gallery.

```html
<html lang="sl" data-skin="gen-i-sidebar" data-font="inter">
```

The sidebar reuses `cr-sidebar`/`cr-nav` and scopes its colour tokens locally: white text/focus indicators, a darker teal hover surface, charcoal selection and a white inset marker. The marker provides a clear selection cue because teal/charcoal backgrounds alone have low contrast. White sidebar labels are 8.19:1 against teal; white button labels are 10.21:1 against charcoal. Dark/auto modes keep the teal sidebar and use a brighter neutral gray for main UI accents. These dark/hover/state colours are digital adaptations; no metallic colour is invented. Existing palettes and the original `gen-i` teal-highlight layout are unchanged.

Version 0.10.0 adds this alternative. **Breaking for the optional `data-font="gen-i"` profile:** it now selects Inter and the optional loader fetches Inter on startup or selection. The former licensed/installed typography has been removed. Existing default Inter consumers are unaffected. `native-sans` or omitting `fonts.js` preserves a network-free setup. Existing deployment assets cover the change.

### GEN-I variants (0.11.0)

Seven GEN-I palettes share the classic light/dark tokens (teal **#005670**, gray **#414141**, white surfaces) and differ in shell treatment. Pick one per application; all are in the gallery's palette selector.

| Skin             | Sidebar                        | Selection                         | Main accents | Other                                  |
| ---------------- | ------------------------------ | --------------------------------- | ------------ | -------------------------------------- |
| `gen-i`          | Pale gray-teal                 | Pale teal fill, teal text         | Teal         | Classic                                |
| `gen-i-sidebar`  | Teal                           | Charcoal fill, white inset marker | Charcoal     | See above                              |
| `gen-i-teal`     | Teal                           | White fill, teal text             | Teal         |                                        |
| `gen-i-charcoal` | Charcoal #414141               | Light teal text and inset marker  | Teal         |                                        |
| `gen-i-tint`     | Pale teal                      | Filled teal, white text           | Teal         | Teal-tinted soft surfaces              |
| `gen-i-crisp`    | Neutral gray                   | Teal inset bar, no fill           | Teal         | Neutral grays, 4px corners             |
| `gen-i-canvas`   | White                          | Pale teal fill, teal text         | Teal         | Soft gray work area behind white cards |

Coloured sidebars scope their tokens to `.cr-sidebar`, keeping white or light-teal focus indicators readable. Tested text pairs are at least 4.5:1 and control borders at least 3:1 in light and dark modes. Sidebar, tint, crisp and canvas colours are digital adaptations, not official brand colours. `gen-i-crisp` sets `--cr-radius:4px` and rounds buttons, fields, navigation links and dialogs to 4px; `gen-i-canvas` adds `--cr-canvas` for the `.cr-main` background. Existing `gen-i` and `gen-i-sidebar` output is unchanged. Each variant is self-contained in `theme-<skin>.css`, so it does not need `theme-gen-i.css`.

**Breaking in 0.11.0:** palettes moved from `themes.css` into standalone `theme-<name>.css` files. `themes.css` now only `@import`s them. Applications that publish `themes.css` must also publish the `theme-*.css` files, or link only the theme they use. Extend application asset allowlists and required-file checks accordingly. The gallery deployment allowlist (receiver and Forgejo hook) now includes all sixteen theme files. Synchronize both installed copies before pushing main.


### Bolder GEN-I variants (0.12.0)

Two additional optional palettes explore stronger colour treatments without changing component sizing or the existing themes:

| GEN-I variant / skin | Sidebar | Selection | Workspace and highlights |
| --- | --- | --- | --- |
| GEN-I Lagoon · `gen-i-lagoon` | Bright cyan #78D2E2, deep teal labels | Deep teal #005670, white text and inset marker | Teal-tinted canvas, teal soft surfaces and accent-edged metrics |
| GEN-I Midnight · `gen-i-midnight` | Charcoal #414141, white labels | Bright teal #78D2E2, deep teal text and inset marker | Teal-gray light canvas, deep teal dark canvas and accent-edged metrics |

Load `theme-gen-i-lagoon.css` or `theme-gen-i-midnight.css` after `cradle.css` and set the matching `data-skin`. Each file works independently and supports light, dark and system-auto modes. Canvas colour uses `--cr-canvas`; sidebar tokens are scoped locally. These colours are independent digital adaptations, not additional official GEN-I colours. Typography remains a separate choice.

Both files are imported by `themes.css` and included in the repository deployment allowlists (28 assets plus generated `version.txt`). Before an authorized main push, synchronize the installed Forgejo hook and Bob receiver with the updated repository scripts. Application consumers offering all palettes must publish the two new files as well.
