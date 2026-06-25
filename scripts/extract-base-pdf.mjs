// One-shot: decode the embedded basePdf from the active contract template
// and write it as a standalone .pdf binary so we stop shipping a 4.4 MB JSON.
//
//   node scripts/extract-base-pdf.mjs                       # default in/out
//   node scripts/extract-base-pdf.mjs path/in.json path/out.pdf
//
// Idempotent. Validates the %PDF magic header before writing.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const PROJECT_ROOT = path.resolve(path.dirname(__filename), "..");

const input = process.argv[2] ?? "pdfTemplates/contractTemplate2026.json";
const output = process.argv[3] ?? "public/contract-base.pdf";

const jsonPath = path.join(PROJECT_ROOT, input);
const json = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

if (typeof json.basePdf !== "string") {
  throw new Error(`No basePdf string in ${jsonPath}`);
}

const m = /^data:application\/pdf;base64,(.+)$/.exec(json.basePdf);
if (!m) {
  throw new Error(`basePdf in ${jsonPath} is not a data:application/pdf;base64 URL`);
}

const bytes = Buffer.from(m[1], "base64");
if (bytes.length < 4 || bytes[0] !== 0x25 || bytes[1] !== 0x50 || bytes[2] !== 0x44 || bytes[3] !== 0x46) {
  throw new Error(`Decoded basePdf does not start with %PDF magic header`);
}

const outPath = path.join(PROJECT_ROOT, output);
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, bytes);
console.log(`Wrote ${outPath} (${bytes.length} bytes from ${input})`);