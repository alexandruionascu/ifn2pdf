import { SystemStyleObject } from '@chakra-ui/react';
import { StepsContextValue } from '../context';
type BaseStyleArgs = Partial<StepsContextValue> & {
    stepHeight?: string;
    inactiveColor?: string;
    activeColor?: string;
};
export declare const getCirclesHorizontalBaseStyles: ({ colorScheme: c, trackColor: t, clickable, }: BaseStyleArgs) => SystemStyleObject;
export declare const getCirclesAlternateBaseStyles: ({ colorScheme, trackColor, clickable, inactiveColor, stepHeight, }: BaseStyleArgs) => SystemStyleObject;
export declare const getCirclesVerticalBaseStyles: ({ stepHeight, colorScheme, trackColor, clickable, }: BaseStyleArgs) => SystemStyleObject;
export declare const getCirclesStepIconContainerBaseStyles: ({ inactiveColor, activeColor, }: BaseStyleArgs) => SystemStyleObject;
export {};
//# sourceMappingURL=styles.d.ts.map