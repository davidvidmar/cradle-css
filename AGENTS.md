# Cradle CSS agent instructions

Private CSS library extracted from Cradle. Read README.md before changing components.

- Keep the quiet Cradle style, readable 16px base, restrained accents and subtle borders.
- Keep the core framework-free: no required JavaScript, build tools, remote fonts or CDN dependencies.
- Use cr- component classes and --cr- tokens. Keep native element rules scoped inside .cradle.
- Keep palettes and CDN font loading optional; Inter is the default family with system fallbacks. Load Inter and JetBrains Mono from Google Fonts CDN; do not bundle or self-host font files.
- Prefer tokens and existing components to duplicate rules or new variants.
- Update the gallery and README when components change. Record breaking changes and bump the documented version when appropriate.
- Default sizes target a laptop screen (~1440px) or a 24" monitor (1920px), not narrower displays. Do not shrink default layout widths for smaller screens; mobile is handled by responsive rules.
- Verify desktop/mobile, light/dark/auto, keyboard focus, dialog behavior, form feedback and overflow. Use fictional content only.
- Bound external commands with explicit timeouts and stop temporary servers.
- Do not commit, tag or push without explicit user approval in the current turn. After file changes, remind the user to commit and push. Every authorized push to main must deploy the CSS gallery to Bob; the user gave standing deployment authorization on 2026-10-13. Verify the deployed commit, assets, health and sign-in before reporting success.
- Keep secrets and machine-local files out of Git.

## Library decisions

- 2026-10-12: version 0.2.0 adds optional sort-tables.js. Tables opt in via data-sortable; header data-sort is text/number/date and cells can supply data-sort-value. Native header buttons expose aria-sort; missing/invalid values stay last and ties are stable. Only simple one-header/one-body unmerged tables are supported; sorting covers rendered rows. Existing nodes/handlers are preserved. Core CSS remains usable without JavaScript. Gallery and README show usage; deployment must include sort-tables.js. Desktop/mobile Chromium checks passed for type ordering, direction toggles, Enter/Space, sort state, missing values, idempotent initialization, row events, natural sorting and ties. Changes are local pending commit/push/deploy.

- 2026-10-12 Cradle now consumes this repository as a submodule under its webroot. Shared font stacks/CDN loader (fonts.css/fonts.js), theme palettes, tabs, drawer-shell variant, loading bar, dialog/prose refinements and typed table ordering APIs live here. Existing saved native-mono values select JetBrains Mono. Only runtime files are published into the app; no Git metadata/demos/instructions. Cradle's own behavior/layout state stays in the parent. Library work must be committed/pushed before its updated parent gitlink, with explicit user approval for both. Current integration changes remain uncommitted.

- 2026-10-13 sidebar regression fix (0.2.1): bare-button font shorthand inherited the 16px body size, enlarging saved chats/files, and inherited text alignment left-aligned tab labels. Preserve the component 13px size while inheriting family/weight/line height; tabs explicitly centre their labels. Keep explicit local citation/file/control typography authoritative. No commit/push/deployment authorized for this fix.

- 2026-10-13 layout width tokens (0.2.2): .cr-container, .cr-form and .cr-prose read --cr-container-width/--cr-form-width/--cr-prose-width (defaults 1180/860/760px) so consumers override widths in :root without redeclaring selectors or using !important. 0.3.0 raises the container default to 1440px (breaking; set 1180px to restore) and fixes the dark-palette semicolon that dropped --cr-faint.

- 2026-10-13 typography default (0.4.0, breaking): Inter is the default --cr-font family; optional fonts.js loads it on startup unless data-font explicitly selects another family. fonts.css restores explicit native-sans; gallery and starter default to Inter. Core keeps system fallbacks and no network dependency. User authorized integration, testing, commit and push in the current turn; publish this library before the parent pin.

- 2026-10-13 form sizing (0.4.1): native single-line inputs/selects share --cr-control-height (46px); cr-field textareas use --cr-textarea-min-height (120px) and retain vertical resizing. Gallery Description starts with four rows. Chromium checks passed at 1440px, 1920px and 390px for equal control heights, textarea minimums/token overrides, themes, focus, dialogs, form feedback and overflow. User subsequently authorized committing and pushing this library fix; application pin and gallery deployment are separate updates.

- 2026-10-13 table defaults (0.5.0, breaking): optional sort-tables.js initializes all supported tables inside .cradle, including new tables, and infers plain numbers/ISO dates/text. Table data-sortable="false" and header data-sort="none" opt out; interactive headers and complex/nested tables are left alone. Explicit data-sort types and order API remain supported. Chromium at 1440px/390px passed click/Enter/Space, focus/aria state, inferred types, explicit machine values, missing/ties, preserved row handlers, dynamic tables, repeated init, opt-outs and complex-table guards, themes, dialogs, forms and overflow; tables remain readable without JavaScript. Hosted gallery was verified on 0.1.0 with no sort-tables.js. User subsequently authorized committing and pushing this library change; application pin and hosted-gallery deployment remain separate updates.

- 2026-10-13 standing user preference: deploy the gallery to Bob every time library main is pushed. A Forgejo per-repository post-receive.d/deploy-gallery hook invokes the restricted Bob receiver in scripts/bob-deploy-gallery.py using a dedicated forced-command SSH key. Only eight allowlisted gallery assets plus generated version.txt are mounted; no source, Git metadata or secrets. Deployments preserve the running Cradle image/version, back up the authoritative Compose file, change only the gallery mount, verify hashes and roll back on failure. App submodule upgrades remain deliberate; this gallery deployment does not change the application pin.
