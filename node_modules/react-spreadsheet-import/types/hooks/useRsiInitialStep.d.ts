import { StepType } from "../steps/UploadFlow";
export declare const useRsiInitialStep: (initialStep?: StepType) => {
    steps: readonly ["uploadStep", "selectHeaderStep", "matchColumnsStep", "validationStep"];
    initialStep: number;
};
