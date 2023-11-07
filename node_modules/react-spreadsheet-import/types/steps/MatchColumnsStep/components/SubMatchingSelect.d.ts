import type { MatchedOptions, MatchedSelectColumn, MatchedSelectOptionsColumn } from "../MatchColumnsStep";
interface Props<T> {
    option: MatchedOptions<T> | Partial<MatchedOptions<T>>;
    column: MatchedSelectColumn<T> | MatchedSelectOptionsColumn<T>;
    onSubChange: (val: T, index: number, option: string) => void;
}
export declare const SubMatchingSelect: <T extends string>({ option, column, onSubChange }: Props<T>) => import("react/jsx-runtime").JSX.Element;
export {};
