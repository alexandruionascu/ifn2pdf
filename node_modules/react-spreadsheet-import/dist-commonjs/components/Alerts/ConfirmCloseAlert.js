'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var react$1 = require('@chakra-ui/react');
var react = require('react');
var useRsi = require('../../hooks/useRsi.js');

const ConfirmCloseAlert = ({ isOpen, onClose, onConfirm }) => {
    const { translations } = useRsi.useRsi();
    const cancelRef = react.useRef(null);
    return (jsxRuntime.jsx(react$1.AlertDialog, { isOpen: isOpen, onClose: onClose, leastDestructiveRef: cancelRef, isCentered: true, id: "rsi", children: jsxRuntime.jsx(react$1.AlertDialogOverlay, { children: jsxRuntime.jsxs(react$1.AlertDialogContent, { children: [jsxRuntime.jsx(react$1.AlertDialogHeader, { children: translations.alerts.confirmClose.headerTitle }), jsxRuntime.jsx(react$1.AlertDialogBody, { children: translations.alerts.confirmClose.bodyText }), jsxRuntime.jsxs(react$1.AlertDialogFooter, { children: [jsxRuntime.jsx(react$1.Button, { ref: cancelRef, onClick: onClose, variant: "secondary", children: translations.alerts.confirmClose.cancelButtonTitle }), jsxRuntime.jsx(react$1.Button, { colorScheme: "red", onClick: onConfirm, ml: 3, children: translations.alerts.confirmClose.exitButtonTitle })] })] }) }) }));
};

exports.ConfirmCloseAlert = ConfirmCloseAlert;
