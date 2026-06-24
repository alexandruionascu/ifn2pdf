# PDF tooling

Local Node scripts for rendering and measuring the active contract PDF template
(`pdfTemplates/contractTemplate2026.json`). Use these to diagnose alignment
issues against pre-printed form elements.

## Scripts

### `render-sample.mjs`

Renders the template with a sample debtor payload (the same "VARGA IZABELA ENIQO"
scenario used during alignment work).

```
yarn pdf:render
# or
node scripts/render-sample.mjs --out /tmp/foo.pdf --no-public
```

Outputs:
- `/tmp/sample-render.pdf` (configurable via `--out`)
- `public/test-render.pdf` (so the dev server can preview at `/test-render.pdf`)
  — skip with `--no-public`

### `measure-pdf.mjs`

Measures pre-printed form structure (vertical/horizontal lines, cell pitch) and
rendered text positions in any PDF. Computes per-cell centering delta vs the
printed cell centers.

```
yarn pdf:measure -- /tmp/sample-render.pdf
yarn pdf:measure -- pdfTemplates/contractTemplate2026.json --region 85,95
yarn pdf:measure -- /tmp/foo.pdf --digits-only
```

The script accepts:
- a `.pdf` file path, OR
- a template JSON path (auto-extracts the embedded `basePdf` into `.pdf-cache/`)

Flags:
- `--region y1,y2` — y-band in mm to inspect (default `85,95`, the CNP row)
- `--page N` — page number (default `1`)
- `--digits-only` / `--lines-only` — restrict output
- `--help` / `-h` — usage

Typical output:

```
cells (n=15):
  cell 1: center=16.876mm  width=6.250mm
  ...
digit pitch: 6.251mm  (first=16.89 last=91.90)
centering delta (digit - cell center):
  digit "1": x=16.89mm  cell_center=16.88mm  delta=+0.012mm
  ...
```

A small `|delta|` (≤ ~0.05mm) means the digit is at the cell center; anything
beyond ±0.3mm usually means the corresponding template field needs a position
nudge.

## Common debugging loop

1. Edit the template (`pdfTemplates/contractTemplate2026.json`).
2. `yarn pdf:render` to produce a fresh sample PDF.
3. `yarn pdf:measure -- /tmp/sample-render.pdf --region 85,95` to verify
   digits land in cell centers.
4. Iterate the field positions in the template until centering deltas are small.