// Browser-or-Node asset loader. Browser uses fetch (Vite serves /public at /);
// Node uses fs.readFileSync. Returns the same shape regardless of env.

import type { LoadedAssets } from "./types.ts";

const BASE_PDF_PATH = "contract-base.pdf";
const FONT_REGULAR_PATH = "SourceSans3-Regular.ttf";
const FONT_BOLD_PATH = "SourceSans3-Bold.ttf";
const STAMP_PATH = "stamp-dogar.png";

const isBrowser = typeof window !== "undefined" && typeof fetch !== "undefined";

async function fetchArrayBuffer(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch ${url}: ${res.status} ${res.statusText}`);
  return await res.arrayBuffer();
}

export async function loadAssets(baseDir?: string): Promise<LoadedAssets> {
  if (isBrowser) {
    const [basePdfBuf, regularBuf, boldBuf, stampBuf] = await Promise.all([
      fetchArrayBuffer(`/${BASE_PDF_PATH}`),
      fetchArrayBuffer(`/${FONT_REGULAR_PATH}`),
      fetchArrayBuffer(`/${FONT_BOLD_PATH}`),
      fetchArrayBuffer(`/${STAMP_PATH}`),
    ]);
    return {
      basePdf: new Uint8Array(basePdfBuf),
      fonts: {
        regular: regularBuf,
        bold: boldBuf,
      },
      images: { "stamp-dogar": stampBuf },
    };
  }

  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const dir = baseDir ?? process.cwd();
  const read = (p: string) => fs.readFile(path.join(dir, p));
  const [basePdf, regular, bold, stamp] = await Promise.all([
    read(`public/${BASE_PDF_PATH}`),
    read(`public/${FONT_REGULAR_PATH}`),
    read(`public/${FONT_BOLD_PATH}`),
    read(`public/${STAMP_PATH}`),
  ]);
  return {
    basePdf: new Uint8Array(basePdf),
    fonts: {
      regular: regular.buffer.slice(regular.byteOffset, regular.byteOffset + regular.byteLength),
      bold: bold.buffer.slice(bold.byteOffset, bold.byteOffset + bold.byteLength),
    },
    images: { "stamp-dogar": stamp.buffer.slice(stamp.byteOffset, stamp.byteOffset + stamp.byteLength) },
  };
}