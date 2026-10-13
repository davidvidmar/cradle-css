#!/usr/bin/env bash
# Install as cradle-css.git/hooks/post-receive.d/deploy-gallery on Forgejo.
set -euo pipefail
assets=(index.html starter.html cradle.css themes.css fonts.css fonts.js examples.js sort-tables.js lucide.svg)
while read -r old_revision new_revision ref; do
  [[ "$ref" == refs/heads/main && "$new_revision" =~ ^[0-9a-f]{40}$ && "$new_revision" != 0000000000000000000000000000000000000000 ]] || continue
  echo "Deploying Cradle CSS gallery to Bob: $new_revision"
  timeout 20 git archive "$new_revision" "${assets[@]}" |
    timeout 300 ssh -i /data/gitea/gallery-deploy/key -o IdentitiesOnly=yes -o BatchMode=yes \
      -o UserKnownHostsFile=/data/gitea/gallery-deploy/known_hosts -o StrictHostKeyChecking=yes \
      -o ConnectTimeout=10 david@192.168.51.20 "deploy $new_revision"
done
