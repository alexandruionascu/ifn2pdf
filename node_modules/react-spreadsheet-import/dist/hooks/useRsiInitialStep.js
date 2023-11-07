import { useMemo } from 'react';
import { StepType } from '../steps/UploadFlow.js';

const useRsiInitialStep = (initialStep) => {
    const steps = ["uploadStep", "selectHeaderStep", "matchColumnsStep", "validationStep"];
    const initialStepNumber = useMemo(() => {
        switch (initialStep) {
            case StepType.upload:
                return 0;
            case StepType.selectSheet:
                return 0;
            case StepType.selectHeader:
                return 1;
            case StepType.matchColumns:
                return 2;
            case StepType.validateData:
                return 3;
            default:
                return 0;
        }
    }, [initialStep]);
    return { steps, initialStep: initialStepNumber };
};

export { useRsiInitialStep };
