type SelectSheetProps = {
    sheetNames: string[];
    onContinue: (sheetName: string) => Promise<void>;
};
export declare const SelectSheetStep: ({ sheetNames, onContinue }: SelectSheetProps) => import("react/jsx-runtime").JSX.Element;
export {};
