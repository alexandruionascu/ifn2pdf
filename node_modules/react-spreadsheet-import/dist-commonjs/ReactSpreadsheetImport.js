'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var merge = require('lodash/merge');
var Steps = require('./steps/Steps.js');
var theme = require('./theme.js');
var Providers = require('./components/Providers.js');
var ModalWrapper = require('./components/ModalWrapper.js');
var translationsRSIProps = require('./translationsRSIProps.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var merge__default = /*#__PURE__*/_interopDefaultLegacy(merge);

const defaultTheme = theme.themeOverrides;
const defaultRSIProps = {
    autoMapHeaders: true,
    autoMapSelectValues: false,
    allowInvalidSubmit: true,
    autoMapDistance: 2,
    translations: translationsRSIProps.translations,
    uploadStepHook: async (value) => value,
    selectHeaderStepHook: async (headerValues, data) => ({ headerValues, data }),
    matchColumnsStepHook: async (table) => table,
    dateFormat: "yyyy-mm-dd",
    parseRaw: true,
};
const ReactSpreadsheetImport = (props) => {
    const mergedTranslations = props.translations !== translationsRSIProps.translations ? merge__default["default"](translationsRSIProps.translations, props.translations) : translationsRSIProps.translations;
    const mergedThemes = props.rtl
        ? merge__default["default"](defaultTheme, theme.rtlThemeSupport, props.customTheme)
        : merge__default["default"](defaultTheme, props.customTheme);
    return (jsxRuntime.jsx(Providers.Providers, { theme: mergedThemes, rsiValues: { ...props, translations: mergedTranslations }, children: jsxRuntime.jsx(ModalWrapper.ModalWrapper, { isOpen: props.isOpen, onClose: props.onClose, children: jsxRuntime.jsx(Steps.Steps, {}) }) }));
};
ReactSpreadsheetImport.defaultProps = defaultRSIProps;

exports.ReactSpreadsheetImport = ReactSpreadsheetImport;
exports.defaultRSIProps = defaultRSIProps;
exports.defaultTheme = defaultTheme;
