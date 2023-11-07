export declare const defineMultiStyleConfig: <BaseStyle extends import("@chakra-ui/styled-system").PartsStyleInterpolation<{
    keys: ("label" | "root" | "icon" | "step" | "iconLabel" | "stepIconContainer" | "description" | "labelContainer" | "stepContainer")[];
}>, Sizes extends {
    [key: string]: import("@chakra-ui/styled-system").PartsStyleInterpolation<{
        keys: ("label" | "root" | "icon" | "step" | "iconLabel" | "stepIconContainer" | "description" | "labelContainer" | "stepContainer")[];
    }>;
}, Variants extends {
    [key: string]: import("@chakra-ui/styled-system").PartsStyleInterpolation<{
        keys: ("label" | "root" | "icon" | "step" | "iconLabel" | "stepIconContainer" | "description" | "labelContainer" | "stepContainer")[];
    }>;
}>(config: {
    baseStyle?: BaseStyle | undefined;
    sizes?: Sizes | undefined;
    variants?: Variants | undefined;
    defaultProps?: {
        size?: keyof Sizes | undefined;
        variant?: keyof Variants | undefined;
        colorScheme?: string | undefined;
    } | undefined;
}) => {
    baseStyle?: BaseStyle | undefined;
    sizes?: Sizes | undefined;
    variants?: Variants | undefined;
    defaultProps?: {
        size?: keyof Sizes | undefined;
        variant?: keyof Variants | undefined;
        colorScheme?: string | undefined;
    } | undefined;
    parts: ("label" | "root" | "icon" | "step" | "iconLabel" | "stepIconContainer" | "description" | "labelContainer" | "stepContainer")[];
}, definePartsStyle: <PartStyles extends import("@chakra-ui/styled-system").PartsStyleInterpolation<{
    keys: ("label" | "root" | "icon" | "step" | "iconLabel" | "stepIconContainer" | "description" | "labelContainer" | "stepContainer")[];
}>>(config: PartStyles) => PartStyles;
export declare const StepsTheme: any;
//# sourceMappingURL=index.d.ts.map