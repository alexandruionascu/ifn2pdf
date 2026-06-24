// Measure pre-printed form structure and rendered digit positions in a PDF.
//
// Usage:
//   node scripts/measure-pdf.mjs /path/to/file.pdf
//   node scripts/measure-pdf.mjs /path/to/template.json   # auto-extracts embedded basePdf
//   node scripts/measure-pdf.mjs file.pdf --region 85,95  # y-band in mm (default CNP row)
//   node scripts/measure-pdf.mjs file.pdf --digits-only
//   node scripts/measure-pdf.mjs file.pdf --lines-only
//
// Output: vertical + horizontal line positions (mm), digit/text positions,
// cell pitch + per-cell centering delta. Use to verify template alignment
// against the rendered output.

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pdfjsLib = require(path.join(PROJECT_ROOT, "node_modules/pdfjs-dist/legacy/build/pdf.js"));
pdfjsLib.GlobalWorkerOptions.workerSrc = path.join(
  PROJECT_ROOT,
  "node_modules/pdfjs-dist/legacy/build/pdf.worker.js",
);

const PT_TO_MM = 0.3528;

function parseArgs(argv) {
  const args = { region: [85, 95], digitsOnly: false, linesOnly: false, page: 1 };
  const positional = [];
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--region") args.region = argv[++i].split(",").map(Number);
    else if (a === "--page") args.page = Number(argv[++i]);
    else if (a === "--digits-only") args.digitsOnly = true;
    else if (a === "--lines-only") args.linesOnly = true;
    else if (a === "--help" || a === "-h") {
      console.log("Usage: node scripts/measure-pdf.mjs <pdf-or-template.json> [--region y1,y2] [--page N] [--digits-only|--lines-only]");
      process.exit(0);
    } else positional.push(a);
  }
  if (positional.length < 1) throw new Error("Missing PDF or template path argument");
  args.input = positional[0];
  return args;
}

function resolvePdfPath(input) {
  const abs = path.resolve(input);
  if (!fs.existsSync(abs)) throw new Error(`File not found: ${abs}`);
  if (abs.toLowerCase().endsWith(".pdf")) return abs;
  // Treat as template JSON — extract embedded basePdf to a stable cache location.
  const json = JSON.parse(fs.readFileSync(abs, "utf8"));
  if (!json.basePdf) throw new Error(`No embedded basePdf in ${abs}`);
  const m = /^data:application\/pdf;base64,(.+)$/.exec(json.basePdf);
  if (!m) throw new Error("basePdf is not a data:application/pdf;base64 URL");
  const cacheDir = path.join(PROJECT_ROOT, ".pdf-cache");
  fs.mkdirSync(cacheDir, { recursive: true });
  const cachePath = path.join(cacheDir, `${path.basename(abs, ".json")}-base.pdf`);
  fs.writeFileSync(cachePath, Buffer.from(m[1], "base64"));
  return cachePath;
}

function walkOps(opList, OPS) {
  let ctm = [1, 0, 0, 1, 0, 0];
  const ctmStack = [];
  const lines = [];
  const rects = [];

  for (let i = 0; i < opList.fnArray.length; i++) {
    const fn = opList.fnArray[i];
    const args = opList.argsArray[i];
    switch (fn) {
      case OPS.save: ctmStack.push(ctm.slice()); break;
      case OPS.restore: ctm = ctmStack.pop() || ctm; break;
      case OPS.transform: {
        const [a, b, c, d, e, f] = args;
        const [a0, b0, c0, d0, e0, f0] = ctm;
        ctm = [a0 * a + b0 * c, a0 * b + b0 * d, c0 * a + d0 * c, c0 * b + d0 * d, e0 * a + f0 * c + e, e0 * b + f0 * d + f];
        break;
      }
      case OPS.constructPath: {
        const codes = Array.from(args[0]);
        const coords = Array.from(args[1]);
        let cx = 0, cy = 0, pi = 0;
        for (const code of codes) {
          if (code === 13) { cx = coords[pi++]; cy = coords[pi++]; }
          else if (code === 14) {
            const x1 = cx, y1 = cy;
            const x2 = coords[pi++], y2 = coords[pi++];
            cx = x2; cy = y2;
            const tx1 = ctm[0] * x1 + ctm[2] * y1 + ctm[4];
            const ty1 = ctm[1] * x1 + ctm[3] * y1 + ctm[5];
            const tx2 = ctm[0] * x2 + ctm[2] * y2 + ctm[4];
            const ty2 = ctm[1] * x2 + ctm[3] * y2 + ctm[5];
            lines.push({ x1: tx1, y1: ty1, x2: tx2, y2: ty2 });
          } else if (code === 19) {
            const x = coords[pi++], y = coords[pi++];
            const w = coords[pi++], h = coords[pi++];
            const tx = ctm[0] * x + ctm[2] * y + ctm[4];
            const ty = ctm[1] * x + ctm[3] * y + ctm[5];
            rects.push({ x: tx, y: ty, w: ctm[0] * w + ctm[2] * h, h: ctm[1] * w + ctm[3] * h });
          } else if (code === 21 || code === 22 || code === 23 || code === 24 || code === 25 || code === 26) {
            // close / curve commands consume coord pairs/quads/triples — advance the cursor
            const skip = [0, 2, 0, 4, 6, 0, 6][code] || 0;
            for (let k = 0; k < skip; k++) coords[pi++];
          }
        }
        break;
      }
    }
  }
  return { lines, rects };
}

const args = parseArgs(process.argv);
const pdfPath = resolvePdfPath(args.input);
console.log(`# measuring ${pdfPath}  region=y[${args.region[0]},${args.region[1]}]mm  page=${args.page}\n`);

const data = new Uint8Array(fs.readFileSync(pdfPath));
const pdf = await pdfjsLib.getDocument({ data, disableFontFace: true }).promise;
const page = await pdf.getPage(args.page);
const viewport = page.getViewport({ scale: 1.0 });
const pageH_pt = viewport.height;

const opList = await page.getOperatorList();
const { lines } = walkOps(opList, pdfjsLib.OPS);
const text = await page.getTextContent();

const [yMin, yMax] = args.region;

if (!args.digitsOnly) {
  const vertical = lines
    .filter((l) => {
      const dx = Math.abs(l.x2 - l.x1) * PT_TO_MM;
      const dy = Math.abs(l.y2 - l.y1) * PT_TO_MM;
      if (dx > 0.3 || dy < 2) return false;
      const yMm = (pageH_pt - (l.y1 + l.y2) / 2) * PT_TO_MM;
      return yMm >= yMin - 2 && yMm <= yMax + 2;
    })
    .map((l) => ({
      xMm: ((l.x1 + l.x2) / 2) * PT_TO_MM,
      yMinMm: (pageH_pt - Math.max(l.y1, l.y2)) * PT_TO_MM,
      yMaxMm: (pageH_pt - Math.min(l.y1, l.y2)) * PT_TO_MM,
    }))
    .sort((a, b) => a.xMm - b.xMm);

  console.log(`vertical lines in region (n=${vertical.length}):`);
  for (const v of vertical) {
    console.log(`  x=${v.xMm.toFixed(3)}mm  y=[${v.yMinMm.toFixed(2)},${v.yMaxMm.toFixed(2)}]mm`);
  }

  const horizontal = lines
    .filter((l) => {
      const dx = Math.abs(l.x2 - l.x1) * PT_TO_MM;
      const dy = Math.abs(l.y2 - l.y1) * PT_TO_MM;
      if (dy > 0.3 || dx < 5) return false;
      const yMm = (pageH_pt - (l.y1 + l.y2) / 2) * PT_TO_MM;
      return yMm >= yMin - 2 && yMm <= yMax + 2;
    })
    .map((l) => ({
      yMm: (pageH_pt - (l.y1 + l.y2) / 2) * PT_TO_MM,
      xMinMm: Math.min(l.x1, l.x2) * PT_TO_MM,
      xMaxMm: Math.max(l.x1, l.x2) * PT_TO_MM,
    }))
    .sort((a, b) => a.yMm - b.yMm);

  console.log(`\nhorizontal lines in region (n=${horizontal.length}):`);
  for (const h of horizontal) {
    console.log(`  y=${h.yMm.toFixed(3)}mm  x=[${h.xMinMm.toFixed(1)},${h.xMaxMm.toFixed(1)}]mm`);
  }

  if (vertical.length >= 2) {
    const cells = [];
    for (let i = 0; i < vertical.length - 1; i++) {
      cells.push({ center: (vertical[i].xMm + vertical[i + 1].xMm) / 2, width: vertical[i + 1].xMm - vertical[i].xMm });
    }
    console.log(`\ncells (n=${cells.length}):`);
    cells.forEach((c, i) => console.log(`  cell ${i + 1}: center=${c.center.toFixed(3)}mm  width=${c.width.toFixed(3)}mm`));
    const pitch = cells.length > 1 ? (cells[cells.length - 1].center - cells[0].center) / (cells.length - 1) : 0;
    console.log(`\ncell pitch: ${pitch.toFixed(3)}mm  (first=${cells[0]?.center.toFixed(3)} last=${cells[cells.length - 1]?.center.toFixed(3)})`);
  }
}

if (!args.linesOnly) {
  const inRegion = [];
  for (const it of text.items) {
    if (!it.transform) continue;
    const yMm = (pageH_pt - it.transform[5]) * PT_TO_MM;
    const xMm = it.transform[4] * PT_TO_MM;
    if (yMm >= yMin && yMm <= yMax && it.str.length === 1 && /^\d$/.test(it.str)) {
      inRegion.push({ digit: it.str, x: xMm, y: yMm });
    }
  }

  console.log(`\ntext digits in region (n=${inRegion.length}):`);
  for (const t of inRegion) console.log(`  "${t.digit}" at x=${t.x.toFixed(2)}mm y=${t.y.toFixed(2)}mm`);

  if (inRegion.length >= 2) {
    const xs = inRegion.map((t) => t.x);
    const pitch = (xs[xs.length - 1] - xs[0]) / (xs.length - 1);
    console.log(`\ndigit pitch: ${pitch.toFixed(3)}mm  (first=${xs[0].toFixed(2)} last=${xs[xs.length - 1].toFixed(2)})`);
  }

  // Compute centering delta vs the first cell center on the page (re-walk lines for cell centers).
  if (inRegion.length > 0) {
    const allVerts = lines
      .filter((l) => {
        const dx = Math.abs(l.x2 - l.x1) * PT_TO_MM;
        const dy = Math.abs(l.y2 - l.y1) * PT_TO_MM;
        if (dx > 0.3 || dy < 2) return false;
        const yMm = (pageH_pt - (l.y1 + l.y2) / 2) * PT_TO_MM;
        return yMm >= yMin - 2 && yMm <= yMax + 2;
      })
      .map((l) => ((l.x1 + l.x2) / 2) * PT_TO_MM)
      .sort((a, b) => a - b);
    if (allVerts.length >= 2) {
      const centers = [];
      for (let i = 0; i < allVerts.length - 1; i++) centers.push((allVerts[i] + allVerts[i + 1]) / 2);
      console.log(`\ncentering delta (digit - cell center):`);
      inRegion.forEach((t, i) => {
        if (i < centers.length) {
          const d = t.x - centers[i];
          console.log(`  digit "${t.digit}": x=${t.x.toFixed(2)}mm  cell_center=${centers[i].toFixed(2)}mm  delta=${d >= 0 ? "+" : ""}${d.toFixed(3)}mm`);
        }
      });
    }
  }
}

await pdf.destroy();