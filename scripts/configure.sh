#!/usr/bin/env bash
# Fill in the live domain and contact email across the site before launch.
#
#   scripts/configure.sh https://www.yourdomain.com hello@yourdomain.com
#
# Safe to re-run: it replaces the current values with the new ones.
set -euo pipefail
cd "$(dirname "$0")/.."

domain="${1:?Usage: scripts/configure.sh https://www.yourdomain.com you@yourdomain.com}"
email="${2:?Usage: scripts/configure.sh https://www.yourdomain.com you@yourdomain.com}"
domain="${domain%/}"
case "$domain" in https://*) ;; *) echo "Domain must start with https://" >&2; exit 1 ;; esac

files=(index.html privacy.html robots.txt sitemap.xml .well-known/security.txt content.js)

# Current values (placeholder on first run, previous values after that)
old_domain="$(grep -o 'https://[^"/]*' sitemap.xml | head -1)"
old_email="$(grep -o 'email: "[^"]*"' content.js | sed 's/email: "\(.*\)"/\1/')"

for f in "${files[@]}"; do
  sed -i.bak -e "s#${old_domain}#${domain}#g" -e "s#${old_email}#${email}#g" "$f" && rm "$f.bak"
done

echo "Domain: ${old_domain} -> ${domain}"
echo "Email:  ${old_email} -> ${email}"
echo "Now bump ?v= on styles.css/content.js/main.js in index.html, commit and deploy."
