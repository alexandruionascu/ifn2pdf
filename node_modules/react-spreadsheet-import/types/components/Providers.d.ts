/// <reference types="react" />
import type { RsiProps } from "../types";
import type { CustomTheme } from "../theme";
export declare const RsiContext: import("react").Context<any>;
type ProvidersProps<T extends string> = {
    children: React.ReactNode;
    theme: CustomTheme;
    rsiValues: RsiProps<T>;
};
export declare const rootId = "chakra-modal-rsi";
export declare const Providers: <T extends string>({ children, theme, rsiValues }: ProvidersProps<T>) => import("react/jsx-runtime").JSX.Element;
export {};
