// Render the active PDF contract template with a sample debtor payload,
// so the generated PDF can be inspected in a viewer or fed to scripts/measure-pdf.mjs.
//
// Usage:
//   node scripts/render-sample.mjs                          # writes /tmp/sample-render.pdf
//   node scripts/render-sample.mjs --out /tmp/foo.pdf
//   node scripts/render-sample.mjs --no-public              # skip copying to public/
//
// The sample mirrors the "VARGA IZABELA ENIQO" scenario used during alignment work.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generate } from "@pdfme/generator";
import { text, multiVariableText, rectangle } from "@pdfme/schemas";

const __filename = fileURLToPath(import.meta.url);
const PROJECT_ROOT = path.resolve(path.dirname(__filename), "..");

const DEFAULT_TEMPLATE =
  "pdfTemplates/contractTemplate2026.json";
const DEFAULT_OUT = "/tmp/sample-render.pdf";
const PUBLIC_PATH = "public/test-render.pdf";

function parseArgs(argv) {
  const out = { out: DEFAULT_OUT, copyPublic: true, template: DEFAULT_TEMPLATE };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--out") out.out = argv[++i];
    else if (a === "--template") out.template = argv[++i];
    else if (a === "--no-public") out.copyPublic = false;
    else throw new Error(`Unknown arg: ${a}`);
  }
  return out;
}

const sample = {
  "CNP": "1960410375475",
  "NUME": "VARGA IZABELA ENIQO",
  "NUME1": "VARGA IZABELA ENIQO",
  "BENEFICIAR INCASARE": "VARGA IZABELA ENIQO",
  "JUDET": "TM",
  "LOCALITATEA": "CHERESTUR",
  "STRADA": "strada",
  "NUMARUL STRAZII": "132",
  "BLOC": "",
  "SCARA": "",
  "APARTAMENT": "",
  "LEGITIMAT CU": "CI",
  "SERIE CI": "TZ",
  "NR CI": "426014",
  "ELIBERAT DE": "SANNICOLAU MARE",
  "VALOARE IMPRUMUT": "600",
  "VALOARE IMPRUMUT1": "600",
  "NR ZILE": "30",
  "DATA SCADENTA": "24.07.2026",
  "COMISION PROCENT ZI": "13",
  "COMISION": "12",
  "SUMA DE RESTITUIT": "612",
  "GARANTII": "test-gr-test\ntest-gr-test\n",
  "DISPOZITIE DE PLATA NUMARUL": "123",
  "DIN1": "24.6.2026",
  "NR CONTRACT": "2",
  "DIN": "24.6.2026",
  "DISPOZITIE INCASARE": "1234",
  "DISPOZITIE INCASARE DIN": "24.6.2026",
  "BENEFICIAR INCASARE CNP": "1960410375475",
  "BENEFICIAR INCASARE CI": "CI",
  "BENEFICIAR INCASARE SERIA CI": "TZ",
  "BENEFICIAR INCASARE NR CI": "426014",
  "INCASARE NR CONTRACT": "2",
  "INCASARE DIN": "24.6.2026",
  "VALOARE INCASARE": "600",
  "VALOARE INCASARE IN SCRIS": "SASESUTELEI",
  "AM PLATIT SUMA DE": "600",
  "DATA PRELUNGIRII": "",
  "DATA RESTITUIRII PRELUNGIRE copy": "",
  "DATA RESTITUIRII PRELUNGIRE": "",
  "COMISION PRELUNGIRE": "",
  "SUMA RESTITUIT PRELUNGIRE": "",
  "DATA SI ORA": "",
  "VALOARE IMPRUMUT2": "600",
  "VALOARE IMPRUMUT3": "600",
  "VALOARE IMPRUMUT IN SCRIS": "SASESUTELEI",
  "BENEFICIAR PLATII": "VARGA IZABELA ENIQO",
  "SUMA PLATITA LEI": "600",
  "SUMA PRIMITĂ LEI": "600",
  "AM PRIMIT SUMA DE LEI": "600",
};

// Same CNP split that PDFFillStep.tsx applies per row.
const cnpDigits = String(sample.CNP).replace(/\D/g, "").slice(0, 13);
for (let i = 0; i < 13; i++) sample[`CNP_${i + 1}`] = cnpDigits[i] ?? "";

const { out, copyPublic, template } = parseArgs(process.argv);
const templatePath = path.join(PROJECT_ROOT, template);
const templateJson = JSON.parse(fs.readFileSync(templatePath, "utf8"));

const regularBuf = fs.readFileSync(path.join(PROJECT_ROOT, "public/SourceSans3-Regular.ttf"));
const boldBuf = fs.readFileSync(path.join(PROJECT_ROOT, "public/SourceSans3-Bold.ttf"));
const toArrayBuf = (buf) => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

const pdfBytes = await generate({
  template: templateJson,
  inputs: [sample],
  plugins: { text, multiVariableText, rectangle },
  options: {
    font: {
      SourceSans3: { data: toArrayBuf(regularBuf), fallback: true },
      "SourceSans3-Bold": { data: toArrayBuf(boldBuf) },
    },
  },
});

fs.writeFileSync(out, Buffer.from(pdfBytes));
console.log(`Wrote ${out} (${pdfBytes.length} bytes)`);

if (copyPublic) {
  const pub = path.join(PROJECT_ROOT, PUBLIC_PATH);
  fs.mkdirSync(path.dirname(pub), { recursive: true });
  fs.copyFileSync(out, pub);
  console.log(`Copied to ${pub}`);
}