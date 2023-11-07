import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { UploadFlow } from './UploadFlow.js';
import { ModalHeader } from '@chakra-ui/react';
import { useSteps, Steps as Steps$1, Step } from 'chakra-ui-steps';
import { CgCheck } from 'react-icons/cg';
import { useRsi } from '../hooks/useRsi.js';
import { useRsiInitialStep } from '../hooks/useRsiInitialStep.js';

const CheckIcon = ({ color }) => jsx(CgCheck, { size: "2.25rem", color: color });
const Steps = () => {
    const { initialStepState, translations } = useRsi();
    const { steps, initialStep } = useRsiInitialStep(initialStepState?.type);
    const { nextStep, activeStep } = useSteps({
        initialStep,
    });
    return (jsxs(Fragment, { children: [jsx(ModalHeader, { display: ["none", "none", "block"], children: jsx(Steps$1, { activeStep: activeStep, checkIcon: CheckIcon, children: steps.map((key) => (jsx(Step, { label: translations[key].title }, key))) }) }), jsx(UploadFlow, { nextStep: nextStep })] }));
};

export { Steps };
