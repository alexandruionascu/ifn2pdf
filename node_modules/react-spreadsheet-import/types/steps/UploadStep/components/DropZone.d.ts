import * as XLSX from "xlsx-ugnis";
type DropZoneProps = {
    onContinue: (data: XLSX.WorkBook, file: File) => void;
    isLoading: boolean;
};
export declare const DropZone: ({ onContinue, isLoading }: DropZoneProps) => import("react/jsx-runtime").JSX.Element;
export {};
