// Self-verification: render a sample contract via the pdf-lib pipeline, reopen
// it, and assert that every FIELDS entry produced a properly-configured
// AcroForm text widget.
//
// Usage:
//   node --experimental-strip-types scripts/verify-acroform.mjs
//
// Exit 0 on full pass; non-zero on first failed assertion. Prints a one-line
// summary on success.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument } from "pdf-lib";
import { renderContract } from "../pdfLayout/renderContract.ts";
import { AGENCIES } from "../pdfLayout/agencies.ts";
import { loadAssets } from "../pdfLayout/loadAssets.ts";
import { FIELDS } from "../pdfLayout/contractLayout.ts";

const __filename = fileURLToPath(import.meta.url);
const PROJECT_ROOT = path.resolve(path.dirname(__filename), "..");

const MM_TO_PT = 72 / 25.4;
const PT_TOLERANCE = 1.0;

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exit(1);
}

function approxEq(actual, expected, tol, label) {
  if (Math.abs(actual - expected) > tol) {
    fail(`${label}: expected ${expected.toFixed(3)} ±${tol}, got ${actual.toFixed(3)}`);
  }
}

const expectedWidgets = FIELDS.filter((f) => f.kind !== "skip");
if (expectedWidgets.length === 0) fail("FIELDS contains no renderable entries");

const sample = {
  CNP: "1960410375475",
  NUME: "VARGA IZABELA ENIQO",
  JUDET: "TM",
  LOCALITATEA: "CHERESTUR",
  STRADA: "strada",
  "NUMARUL STRAZII": "132",
  "LEGITIMAT CU": "CI",
  "SERIE CI": "TZ",
  "NR CI": "426014",
  "ELIBERAT DE": "SANNICOLAU MARE",
  "VALOARE IMPRUMUT": "600",
  "NR ZILE": "30",
  "COMISION": "12",
  "COMISION PROCENT ZI": "13",
  "SUMA DE RESTITUIT": "612",
  GARANTII: "test-gr-test\ntest-gr-test",
  "NR CONTRACT": "2",
  DIN: "24.6.2026",
  "VALOARE IMPRUMUT IN SCRIS": "SASESUTELEI",
  "DISPOZITIE INCASARE": "1234",
  "DISPOZITIE INCASARE DIN": "24.6.2026",
  "INCASARE NR CONTRACT": "2",
  "INCASARE DIN": "24.6.2026",
  "VALOARE INCASARE": "600",
  "VALOARE INCASARE IN SCRIS": "SASESUTELEI",
  "DATA SI ORA": "",
};

const assets = await loadAssets(PROJECT_ROOT);
const agency = AGENCIES[0];

const pdfBytes = await renderContract({
  rows: [sample],
  agency,
  basePdfBytes: assets.basePdf,
  fonts: assets.fonts,
});

const reloaded = await PDFDocument.load(pdfBytes);
const form = reloaded.getForm();
const fields = form.getFields();

if (fields.length !== expectedWidgets.length) {
  fail(`widget count: expected ${expectedWidgets.length}, got ${fields.length}`);
}

const byName = new Map(fields.map((f) => [f.getName(), f]));

for (const entry of expectedWidgets) {
  const f = byName.get(entry.name);
  if (!f) fail(`missing widget for field "${entry.name}"`);

  const widgets = f.acroField.getWidgets();
  if (!widgets || widgets.length === 0) {
    fail(`widget "${entry.name}" has no annotation widget`);
  }
  const rect = widgets[0].getRectangle();

  const expX = entry.x * MM_TO_PT;
  const expW = entry.w * MM_TO_PT;
  const expH = entry.h * MM_TO_PT;

  approxEq(rect.width, expW, 1.5, `${entry.name}.width`);
  approxEq(rect.height, expH, 1.5, `${entry.name}.height`);
  approxEq(rect.x, expX, PT_TOLERANCE, `${entry.name}.x`);
  approxEq(rect.y, reloaded.getPage(0).getHeight() - (entry.y + entry.h) * MM_TO_PT, PT_TOLERANCE, `${entry.name}.y`);
}

const garantie = byName.get("GARANTII");
if (!garantie || !garantie.isMultiline()) fail("GARANTII widget must be multiline");

for (let i = 1; i <= 13; i++) {
  const name = `CNP_${i}`;
  const cnp = byName.get(name);
  if (!cnp) fail(`missing CNP widget ${name}`);
  if (cnp.getMaxLength() !== 1) fail(`${name}: expected maxLength 1, got ${cnp.getMaxLength()}`);
}

const nume = byName.get("NUME");
if (!nume || nume.getText() !== "VARGA IZABELA ENIQO") {
  fail(`NUME prefill: expected "VARGA IZABELA ENIQO", got ${JSON.stringify(nume?.getText())}`);
}

const cnp1 = byName.get("CNP_1");
if (!cnp1 || cnp1.getText() !== "1") {
  fail(`CNP_1 prefill: expected "1", got ${JSON.stringify(cnp1?.getText())}`);
}
const cnp13 = byName.get("CNP_13");
if (!cnp13 || cnp13.getText() !== "5") {
  fail(`CNP_13 prefill: expected "5", got ${JSON.stringify(cnp13?.getText())}`);
}

const dataPrel = byName.get("DATA PRELUNGIRII");
if (!dataPrel) fail("DATA PRELUNGIRII widget missing");
const dpText = dataPrel.getText();
if (dpText !== "" && dpText !== undefined) {
  fail(`DATA PRELUNGIRII must be empty for empty input, got ${JSON.stringify(dpText)}`);
}
if (dataPrel.getMaxLength() !== undefined) {
  fail(`DATA PRELUNGIRII: expected undefined maxLength (operator free typing), got ${dataPrel.getMaxLength()}`);
}

const totalFields = expectedWidgets.length;
console.log(`PASS: ${totalFields} widgets verified (rects, names, GARANTII multiline, CNP maxLength=1, prefill, empty-widget free typing)`);