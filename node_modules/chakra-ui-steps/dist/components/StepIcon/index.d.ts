import React from 'react';
type IconType = React.ComponentType<any>;
interface StepIconProps {
    isCompletedStep?: boolean;
    isCurrentStep?: boolean;
    isError?: boolean;
    isLoading?: boolean;
    isKeepError?: boolean;
    icon?: React.ComponentType<any>;
    index?: number;
    checkIcon?: IconType;
    errorIcon?: IconType;
}
export declare const StepIcon: import("@chakra-ui/system/dist/system.types").ComponentWithAs<"div", StepIconProps>;
export {};
//# sourceMappingURL=index.d.ts.map