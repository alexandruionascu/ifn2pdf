import type { SelectOption } from "../../types";
interface Props {
    onChange: (value: SelectOption | null) => void;
    value?: SelectOption;
    options: readonly SelectOption[];
}
export declare const TableSelect: ({ onChange, value, options }: Props) => import("react/jsx-runtime").JSX.Element;
export {};
