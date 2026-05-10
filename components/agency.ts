export interface Agency {
  name: string;
  address: string;
  weekdayHours: string;
  weekendHours: string;
}

export const AGENCIES: Agency[] = [
  {
    name: "S.C. DOGAR IFN S.R.L. - Calea lui Traian - Casieria 3",
    address: "Str. Calea lui Traian, nr. 2, Ap. 2",
    weekdayHours: "Luni-Vineri 08:00 - 16:00",
    weekendHours: "Sambata 10:00 - 13:00",
  },
  {
    name: "S.C. DOGAR IFN S.R.L. - Victor Babes - Casieria 1",
    address: "Str. Victor Babes nr. 23",
    weekdayHours: "Luni-Vineri 09:00 - 17:00",
    weekendHours: "Sambata 10:00 - 13:00",
  },
];

export const AGENCY_STORAGE_KEY = "dogar:selected-agency";

export const getAgencyByName = (agencyName?: string | null) => {
  return AGENCIES.find((agency) => agency.name === agencyName) ?? AGENCIES[0];
};
