import { jsx } from 'react/jsx-runtime';
import { ModalFooter, Button } from '@chakra-ui/react';

const ContinueButton = ({ onContinue, title, isLoading }) => (jsx(ModalFooter, { children: jsx(Button, { size: "lg", w: "21rem", onClick: onContinue, isLoading: isLoading, children: title }) }));

export { ContinueButton };
