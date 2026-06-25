import type { PDFPage, PDFFont } from "pdf-lib";
import { rgb } from "pdf-lib";
import type { Field } from "./types.ts";

const MM_TO_PT = 72 / 25.4;

export function mmToPt(mm: number): number {
  return mm * MM_TO_PT;
}

export function wrapText(text: string, font: PDFFont, size: number, maxWidthPt: number): string[] {
  const out: string[] = [];
  const paragraphs = text.split(/\r?\n/);
  for (const para of paragraphs) {
    if (!para) {
      out.push("");
      continue;
    }
    const words = para.split(/\s+/);
    let line = "";
    for (const w of words) {
      const trial = line ? `${line} ${w}` : w;
      const width = font.widthOfTextAtSize(trial, size);
      if (width <= maxWidthPt || !line) {
        line = trial;
      } else {
        out.push(line);
        line = w;
      }
    }
    if (line) out.push(line);
  }
  return out;
}

function baselineY(field: Field, pageHeightPt: number): number {
  const topY = pageHeightPt - mmToPt(field.y);
  const bottomY = pageHeightPt - mmToPt(field.y + field.h);
  const midY = (topY + bottomY) / 2;
  switch (field.valign) {
    case "top":
      return topY - field.fontSize * 0.8;
    case "bottom":
      return bottomY + field.fontSize * 0.32;
    case "middle":
    default:
      return midY - field.fontSize * 0.3;
  }
}

function alignX(field: Field, font: PDFFont, text: string, size: number): number {
  const xLeft = mmToPt(field.x);
  const wPt = mmToPt(field.w);
  if (field.align === "center") {
    return xLeft + wPt / 2 - font.widthOfTextAtSize(text, size) / 2;
  }
  if (field.align === "right") {
    return xLeft + wPt - font.widthOfTextAtSize(text, size);
  }
  return xLeft;
}

function fitFontSize(font: PDFFont, text: string, size: number, maxWidthPt: number): number {
  if (!text) return size;

  const minSize = Math.min(size, 5.8);
  let fitted = size;
  while (fitted > minSize && font.widthOfTextAtSize(text, fitted) > maxWidthPt) {
    fitted -= 0.2;
  }
  return Math.round(fitted * 10) / 10;
}

export interface DrawFonts {
  regular: PDFFont;
  bold: PDFFont;
}

export function drawField(
  page: PDFPage,
  fonts: DrawFonts,
  field: Field,
  value: string,
  pageHeightPt: number,
): void {
  if (field.kind === "skip") return;
  if (!value) return;

  const font = field.font === "bold" ? fonts.bold : fonts.regular;
  const xPt = mmToPt(field.x);
  const wPt = mmToPt(field.w);
  const size = field.fontSize;

  if (field.multiline) {
    const lineHeightPt = size * (field.lineHeight ?? 1.2);
    const maxLines = Math.max(1, Math.floor(mmToPt(field.h) / lineHeightPt));
    const lines = wrapText(value, font, size, wPt).slice(0, maxLines);
    const firstBaseline = baselineY(field, pageHeightPt);
    lines.forEach((line, i) => {
      const lx = alignX(field, font, line, size);
      page.drawText(line, {
        x: lx,
        y: firstBaseline - i * lineHeightPt,
        size,
        font,
        color: rgb(0, 0, 0),
      });
    });
  } else {
    const fittedSize = fitFontSize(font, value, size, wPt);
    const y = baselineY(field, pageHeightPt);
    page.drawText(value, {
      x: alignX(field, font, value, fittedSize),
      y,
      size: fittedSize,
      font,
      color: rgb(0, 0, 0),
    });
  }
}

export function drawUnderline(
  page: PDFPage,
  field: Field,
  pageHeightPt: number,
  widthHint: number,
): void {
  if (field.kind === "skip") return;
  const xPt = mmToPt(field.x);
  const wPt = mmToPt(Math.max(field.w, widthHint));
  const yPt = pageHeightPt - mmToPt(field.y + field.h) + 0.5;
  page.drawLine({
    start: { x: xPt, y: yPt },
    end: { x: xPt + wPt, y: yPt },
    thickness: 0.25,
    color: rgb(0, 0, 0),
  });
}
