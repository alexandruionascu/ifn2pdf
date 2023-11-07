import { HTMLChakraProps } from '@chakra-ui/react';
import * as React from 'react';
export interface StepProps extends HTMLChakraProps<'li'> {
    label?: string | React.ReactNode;
    description?: string;
    icon?: React.ComponentType<any>;
    state?: 'loading' | 'error';
    checkIcon?: React.ComponentType<any>;
    errorIcon?: React.ComponentType<any>;
    isCompletedStep?: boolean;
    isKeepError?: boolean;
}
export declare const Step: import("@chakra-ui/system/dist/system.types").ComponentWithAs<"li", StepProps>;
//# sourceMappingURL=index.d.ts.map