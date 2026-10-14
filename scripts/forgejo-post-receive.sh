#!/usr/bin/env bash
# Install as cradle-css.git/hooks/post-receive.d/deploy-gallery on Forgejo.
set -euo pipefail
assets=(index.html starter.html cradle.css themes.css fonts.css fonts.js examples.js sort-tables.js lucide.svg examples.css
  theme-dracula.css theme-one-dark.css theme-nord.css theme-solarized.css theme-monokai.css theme-tokyo-night.css theme-catppuccin.css theme-gruvbox.css theme-material.css theme-gen-i.css theme-gen-i-sidebar.css theme-gen-i-teal.css theme-gen-i-charcoal.css theme-gen-i-tint.css theme-gen-i-crisp.css theme-gen-i-lagoon.css theme-gen-i-midnight.css theme-gen-i-canvas.css theme-gen-i-portal.css
  font-inter-italic-latin-ext.woff2 font-inter-italic-latin.woff2 font-inter-latin-ext.woff2 font-inter-latin.woff2 font-jetbrains-mono-italic-latin-ext.woff2 font-jetbrains-mono-italic-latin.woff2 font-jetbrains-mono-latin-ext.woff2 font-jetbrains-mono-latin.woff2 font-manrope-latin-ext.woff2 font-manrope-latin.woff2)
while read -r old_revision new_revision ref; do
  [[ "$ref" == refs/heads/main && "$new_revision" =~ ^[0-9a-f]{40}$ && "$new_revision" != 0000000000000000000000000000000000000000 ]] || continue
  echo "Deploying Cradle CSS gallery to Bob: $new_revision"
  timeout 20 git archive "$new_revision" "${assets[@]}" |
    timeout 300 ssh -i /data/gitea/gallery-deploy/key -o IdentitiesOnly=yes -o BatchMode=yes \
      -o UserKnownHostsFile=/data/gitea/gallery-deploy/known_hosts -o StrictHostKeyChecking=yes \
      -o ConnectTimeout=10 david@192.168.51.20 "deploy $new_revision"
done
