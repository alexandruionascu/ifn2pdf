import { PDFDocument } from "pdf-lib";
// @ts-expect-error — @pdf-lib/fontkit has no published types in this version.
import fontkit from "@pdf-lib/fontkit";
import { FIELDS, STAMP_FIELD } from "./contractLayout.ts";
import { formatAgencyHours, type Agency } from "./agencies.ts";
import { drawField, mmToPt } from "./drawField.ts";
import type { RenderInput, RowInput } from "./types.ts";

const NUMERIC_IDENTIFIER_FIELDS = new Set([
  "CNP",
  "NR CI",
  "NR CI1",
]);

// Dispoziția de încasare personal-info slots stay blank for handwriting.
// The sum (numeric + in-scris) is prefilled via the fallback chain below.
// Form values still exist in formData (e.g. DISPOZITIE INCASARE receipt nr)
// but never reach the PDF for the blanked slots.
const BLANK_FOR_HANDWRITING = new Set([
  "DISPOZITIE INCASARE",
  "DISPOZITIE INCASARE DIN",
  "BENEFICIAR INCASARE",
  "BENEFICIAR INCASARE CNP",
  "BENEFICIAR INCASARE SERIA CI",
  "BENEFICIAR INCASARE NR CI",
  "CASIER_INCASARE",
  "CLIENT_INCASARE",
]);

function normalizeValue(key: string, value: unknown): string {
  if (value === undefined || value === null) return "";
  const raw = String(value).trim();
  if (!raw) return "";

  if (NUMERIC_IDENTIFIER_FIELDS.has(key)) {
    if (/^[+-]?\d+(?:\.0+)?$/.test(raw)) {
      return raw.replace(/\.0+$/, "");
    }
    if (/^[+-]?\d+(?:\.\d+)?e[+-]?\d+$/i.test(raw)) {
      const n = Number(raw);
      if (Number.isFinite(n)) return Math.trunc(n).toLocaleString("en-US", { useGrouping: false });
    }
  }

  if (typeof value === "number") return Number.isInteger(value) ? value.toString() : String(value);
  return raw;
}

function resolveRow(row: RowInput, agency: Agency): Record<string, string> {
  const out: Record<string, string> = {};

  for (const [k, v] of Object.entries(row)) {
    if (v === undefined || v === null) continue;
    out[k] = normalizeValue(k, v);
  }

  // Agency overrides — same precedence as PDFFillStep.tsx.
  out["ADRESA AGENTIE"] = agency.address;
  out["PROGRAM LUNI VINERI"] = formatAgencyHours(agency.weekdayHours);
  out["PROGRAM WEEKEND"] = formatAgencyHours(agency.weekendHours);
  out["TELEFON AGENTIE"] = agency.phone;
  out["DATA SI ORA"] = "";

  out["COMISION"] = out["COMISION"] || out["COMISION - RON"] || "";
  out["COMISION PROCENT ZI"] =
    out["COMISION PROCENT ZI"] ||
    out["COMISION %ZI"] ||
    out["COMISION %zi"] ||
    out["Comision %zi"] ||
    "";
  out["VALOARE IMPRUMUT2"] =
    out["VALOARE IMPRUMUT2"] || out["VALOARE IMPRUMUT - RON"] || out["VALOARE IMPRUMUT"] || "";
  out["SUMA PRIMITĂ LEI"] =
    out["SUMA PRIMITĂ LEI"] ||
    out["AM PRIMIT SUMA DE LEI"] ||
    out["AM PRIMIT SUMA DE"] ||
    out["VALOARE IMPRUMUT2"] ||
    "";
  out["VALOARE INCASARE"] =
    out["VALOARE INCASARE"] ||
    out["AM INCASAT SUMA DE LEI"] ||
    out["AM INCASAT SUMA DE"] ||
    out["VALOARE IMPRUMUT2"] ||
    "";
  out["VALOARE INCASARE IN SCRIS"] =
    out["VALOARE INCASARE IN SCRIS"] ||
    out["AM INCASAT SUMA IN SCRIS"] ||
    out["VALOARE IMPRUMUT IN SCRIS"] ||
    "";
  out["DATA PRELUNGIRII"] =
    out["DATA PRELUNGIRII"] || out["DATA INCEPERII PRELUNGIRII"] || "";
  out["NR ZILE PREL"] =
    out["NR ZILE PREL"] || out["NR ZILE PRELUNGIRE"] || out["NR ZILE"] || "";
  out["DATA RESTITUIRII PRELUNGIRE"] =
    out["DATA RESTITUIRII PRELUNGIRE"] || out["DATA RESTITUIRII"] || "";
  out["COMISION PRELUNGIRE"] =
    out["COMISION PRELUNGIRE"] || out["COMISION PROCENT ZI PRELUNGIRE"] || out["COMISION PROCENT ZI"] || "";
  out["VALOARE COMISION PREL"] =
    out["VALOARE COMISION PREL"] || out["VALOARE COMISION"] || out["COMISION"] || out["COMISION - RON"] || "";
  out["SUMA RESTITUIT PRELUNGIRE"] =
    out["SUMA RESTITUIT PRELUNGIRE"] || out["SUMA DE RESTITUIT PRELUNGIRE"] || out["SUMA DE RESTITUIT"] || "";

  // CNP 13-cell split — preserve pdfme fallback chain.
  const debtorCnp = (out["CNP"] ?? "").replace(/\D/g, "");
  const cnpValue = debtorCnp.slice(0, 13);
  for (let i = 0; i < 13; i++) out[`CNP_${i + 1}`] = cnpValue[i] ?? "";

  // Strip receipt + personal-info slots — they stay blank for handwriting.
  for (const key of BLANK_FOR_HANDWRITING) out[key] = "";

  return out;
}

export async function renderContract({
  rows,
  agency,
  basePdfBytes,
  fonts,
  images,
}: RenderInput): Promise<Uint8Array> {
  const templateDoc = await PDFDocument.load(basePdfBytes);
  const outputDoc = await PDFDocument.create();
  outputDoc.registerFontkit(fontkit);

  const regular = await outputDoc.embedFont(fonts.regular, { subset: false });
  const bold = await outputDoc.embedFont(fonts.bold, { subset: false });
  const fontsMap = { regular, bold };

  const stampPngBytes = images?.[STAMP_FIELD.imageName ?? ""];
  const stampImage = stampPngBytes ? await outputDoc.embedPng(stampPngBytes) : null;

  const rowsToRender = rows.length === 0 ? [{}] : rows;

  for (let i = 0; i < rowsToRender.length; i++) {
    const [copiedPage] = await outputDoc.copyPages(templateDoc, [0]);
    outputDoc.addPage(copiedPage);

    const pageHeightPt = copiedPage.getHeight();
    const inputs = resolveRow(rowsToRender[i], agency);

    if (stampImage && STAMP_FIELD.imageName) {
      copiedPage.drawImage(stampImage, {
        x: mmToPt(STAMP_FIELD.x),
        y: pageHeightPt - mmToPt(STAMP_FIELD.y + STAMP_FIELD.h),
        width: mmToPt(STAMP_FIELD.w),
        height: mmToPt(STAMP_FIELD.h),
      });
    }

    for (const field of FIELDS) {
      if (field.kind === "skip") continue;
      const value = inputs[field.name];
      if (!value) continue;
      drawField(copiedPage, fontsMap, field, value, pageHeightPt);
    }
  }

  return await outputDoc.save();
}
