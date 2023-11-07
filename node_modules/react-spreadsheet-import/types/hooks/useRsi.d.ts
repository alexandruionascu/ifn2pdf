import type { RsiProps } from "../types";
import type { Translations } from "../translationsRSIProps";
export declare const useRsi: <T extends string>() => Omit<RsiProps<T>, keyof RsiProps<any>> & Required<Pick<RsiProps<T>, keyof RsiProps<any>>> & {
    translations: Translations;
};
