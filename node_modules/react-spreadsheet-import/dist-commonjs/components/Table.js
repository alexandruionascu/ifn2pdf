'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var DataGrid = require('react-data-grid');
var useRsi = require('../hooks/useRsi.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var DataGrid__default = /*#__PURE__*/_interopDefaultLegacy(DataGrid);

const Table = ({ className, ...props }) => {
    const { rtl } = useRsi.useRsi();
    return jsxRuntime.jsx(DataGrid__default["default"], { className: "rdg-light " + className || "", direction: rtl ? "rtl" : "ltr", ...props });
};

exports.Table = Table;
