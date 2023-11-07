import { Column } from "react-data-grid";
import type { RawData } from "../../../types";
export declare const SelectColumn: Column<any, any>;
export declare const generateSelectionColumns: (data: RawData[]) => (Column<any, any> | {
    key: string;
    name: string;
})[];
