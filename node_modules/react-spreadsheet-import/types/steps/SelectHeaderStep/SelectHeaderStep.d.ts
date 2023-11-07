import type { RawData } from "../../types";
type SelectHeaderProps = {
    data: RawData[];
    onContinue: (headerValues: RawData, data: RawData[]) => Promise<void>;
};
export declare const SelectHeaderStep: ({ data, onContinue }: SelectHeaderProps) => import("react/jsx-runtime").JSX.Element;
export {};
