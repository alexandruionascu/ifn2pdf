export type FontKey = "regular" | "bold";
export type AlignKey = "left" | "center" | "right";
export type VAlignKey = "top" | "middle" | "bottom";
export type FieldKind = "text" | "signature" | "image" | "skip";

export interface Field {
  name: string;
  kind: FieldKind;
  x: number;
  y: number;
  w: number;
  h: number;
  fontSize: number;
  font: FontKey;
  align: AlignKey;
  valign: VAlignKey;
  lineHeight?: number;
  multiline?: boolean;
  imageName?: string;
}

export interface Agency {
  name: string;
  address: string;
  weekdayHours: string;
  weekendHours: string;
  phone: string;
}

export type RowInput = Record<string, unknown>;

export interface RenderInput {
  rows: RowInput[];
  agency: Agency;
  basePdfBytes: Uint8Array;
  fonts: {
    regular: ArrayBuffer;
    bold: ArrayBuffer;
  };
  images: Record<string, ArrayBuffer>;
}

export interface LoadedAssets {
  basePdf: Uint8Array;
  fonts: {
    regular: ArrayBuffer;
    bold: ArrayBuffer;
  };
  images: Record<string, ArrayBuffer>;
}