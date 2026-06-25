#!/usr/bin/env bash
# Render templates/contract.html → public/contract-base.pdf via headless Chrome.
#
# Usage:  yarn template:render   (or: bash scripts/render-template.sh)
#
# Edit templates/contract.html or templates/contract.css, then re-run.
# Output: public/contract-base.pdf (the background the runtime renderer loads).

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HTML="$PROJECT_ROOT/templates/contract.html"
OUT="$PROJECT_ROOT/public/contract-base.pdf"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

if [[ ! -f "$HTML" ]]; then
  echo "Missing $HTML" >&2
  exit 1
fi

if [[ ! -x "$CHROME" ]]; then
  echo "Chrome not found at $CHROME — install Google Chrome or set CHROME_BIN." >&2
  exit 1
fi

mkdir -p "$(dirname "$OUT")"

"$CHROME" \
  --headless=new \
  --disable-gpu \
  --no-sandbox \
  --no-pdf-header-footer \
  --print-to-pdf="$OUT" \
  --print-to-pdf-no-header \
  "file://$HTML"

echo "Wrote $OUT ($(stat -f%z "$OUT") bytes)"
