# Cradle CSS agent instructions

Private CSS library extracted from Cradle. Read README.md before changing components.

- Keep the quiet Cradle style, readable 16px base, restrained accents and subtle borders.
- Keep the core framework-free: no required JavaScript, build tools, remote fonts or CDN dependencies.
- Use cr- component classes and --cr- tokens. Keep native element rules scoped inside .cradle.
- Keep palettes and Inter optional. Load Inter from Google Fonts CDN; do not bundle or self-host font files.
- Prefer tokens and existing components to duplicate rules or new variants.
- Update the gallery and README when components change. Record breaking changes and bump the documented version when appropriate.
- Verify desktop/mobile, light/dark/auto, keyboard focus, dialog behavior, form feedback and overflow. Use fictional content only.
- Bound external commands with explicit timeouts and stop temporary servers.
- Do not commit, tag, push or deploy without explicit user approval in the current turn. After file changes, remind the user to commit and push.
- Keep secrets and machine-local files out of Git.
