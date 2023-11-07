'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');
var UploadFlow = require('../steps/UploadFlow.js');

const useRsiInitialStep = (initialStep) => {
    const steps = ["uploadStep", "selectHeaderStep", "matchColumnsStep", "validationStep"];
    const initialStepNumber = react.useMemo(() => {
        switch (initialStep) {
            case UploadFlow.StepType.upload:
                return 0;
            case UploadFlow.StepType.selectSheet:
                return 0;
            case UploadFlow.StepType.selectHeader:
                return 1;
            case UploadFlow.StepType.matchColumns:
                return 2;
            case UploadFlow.StepType.validateData:
                return 3;
            default:
                return 0;
        }
    }, [initialStep]);
    return { steps, initialStep: initialStepNumber };
};

exports.useRsiInitialStep = useRsiInitialStep;
