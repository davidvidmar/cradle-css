# Cradle CSS agent instructions

Private CSS library extracted from Cradle. Read README.md before changing components.

- Keep the quiet Cradle style, readable 16px base, restrained accents and subtle borders.
- Keep the core framework-free: no required JavaScript, build tools, remote fonts or CDN dependencies.
- Use cr- component classes and --cr- tokens. Keep native element rules scoped inside .cradle.
- Keep palettes and Inter optional. Load Inter and JetBrains Mono from Google Fonts CDN; do not bundle or self-host font files.
- Prefer tokens and existing components to duplicate rules or new variants.
- Update the gallery and README when components change. Record breaking changes and bump the documented version when appropriate.
- Verify desktop/mobile, light/dark/auto, keyboard focus, dialog behavior, form feedback and overflow. Use fictional content only.
- Bound external commands with explicit timeouts and stop temporary servers.
- Do not commit, tag, push or deploy without explicit user approval in the current turn. After file changes, remind the user to commit and push.
- Keep secrets and machine-local files out of Git.

## Library decisions

- 2026-10-12: version 0.2.0 adds optional sort-tables.js. Tables opt in via data-sortable; header data-sort is text/number/date and cells can supply data-sort-value. Native header buttons expose aria-sort; missing/invalid values stay last and ties are stable. Only simple one-header/one-body unmerged tables are supported; sorting covers rendered rows. Existing nodes/handlers are preserved. Core CSS remains usable without JavaScript. Gallery and README show usage; deployment must include sort-tables.js. Desktop/mobile Chromium checks passed for type ordering, direction toggles, Enter/Space, sort state, missing values, idempotent initialization, row events, natural sorting and ties. Changes are local pending commit/push/deploy.

- 2026-10-12 Cradle now consumes this repository as a submodule under its webroot. Shared font stacks/CDN loader (fonts.css/fonts.js), theme palettes, tabs, drawer-shell variant, loading bar, dialog/prose refinements and typed table ordering APIs live here. Existing saved native-mono values select JetBrains Mono. Only runtime files are published into the app; no Git metadata/demos/instructions. Cradle's own behavior/layout state stays in the parent. Library work must be committed/pushed before its updated parent gitlink, with explicit user approval for both. Current integration changes remain uncommitted.

- 2026-10-13 sidebar regression fix (0.2.1): bare-button font shorthand inherited the 16px body size, enlarging saved chats/files, and inherited text alignment left-aligned tab labels. Preserve the component 13px size while inheriting family/weight/line height; tabs explicitly centre their labels. Keep explicit local citation/file/control typography authoritative. No commit/push/deployment authorized for this fix.
