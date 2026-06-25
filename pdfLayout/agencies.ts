// Agency selector — moved verbatim from steps/PDFFillStep.tsx so the renderer
// and the UI share a single source of truth.

export interface Agency {
  name: string;
  address: string;
  weekdayHours: string;
  weekendHours: string;
  phone: string;
}

export const AGENCIES: Agency[] = [
  {
    name: "S.C. DOGAR IFN S.R.L. - Calea lui Traian - Casieria 3",
    address: "Str. Calea lui Traian, nr. 2, Ap. 2",
    weekdayHours: "Luni-Vineri 08:00 - 16:00",
    weekendHours: "Sambata 10:00 - 13:00",
    phone: "0256/373513",
  },
  {
    name: "S.C. DOGAR IFN S.R.L. - Victor Babes - Casieria 1",
    address: "Str. Victor Babes nr. 23",
    weekdayHours: "Luni-Vineri 09:00 - 17:00",
    weekendHours: "Sambata 10:00 - 13:00",
    phone: "0256/373513",
  },
];

export const formatAgencyHours = (hours: string): string =>
  hours.replace(/^Luni-Vineri\s*/i, "").replace(/^Sambata\s*/i, "").trim();