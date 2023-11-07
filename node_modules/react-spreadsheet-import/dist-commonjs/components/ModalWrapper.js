'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var react = require('@chakra-ui/react');
var ModalCloseButton = require('./ModalCloseButton.js');
var useRsi = require('../hooks/useRsi.js');

const ModalWrapper = ({ children, isOpen, onClose }) => {
    const { rtl } = useRsi.useRsi();
    return (jsxRuntime.jsx(react.Modal, { isOpen: isOpen, onClose: onClose, id: "rsi", variant: "rsi", closeOnEsc: false, closeOnOverlayClick: false, scrollBehavior: "inside", children: jsxRuntime.jsxs("div", { dir: rtl ? "rtl" : "ltr", children: [jsxRuntime.jsx(react.ModalOverlay, {}), jsxRuntime.jsx(ModalCloseButton.ModalCloseButton, { onClose: onClose }), jsxRuntime.jsx(react.ModalContent, { children: children })] }) }));
};

exports.ModalWrapper = ModalWrapper;
