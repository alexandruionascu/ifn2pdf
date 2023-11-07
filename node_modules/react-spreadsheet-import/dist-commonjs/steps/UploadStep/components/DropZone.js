'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var react = require('@chakra-ui/react');
var reactDropzone = require('react-dropzone');
var XLSX = require('xlsx-ugnis');
var react$1 = require('react');
var getDropZoneBorder = require('../utils/getDropZoneBorder.js');
var useRsi = require('../../../hooks/useRsi.js');
var readFilesAsync = require('../utils/readFilesAsync.js');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var XLSX__namespace = /*#__PURE__*/_interopNamespace(XLSX);

const DropZone = ({ onContinue, isLoading }) => {
    const { translations, maxFileSize, dateFormat, parseRaw } = useRsi.useRsi();
    const styles = react.useStyleConfig("UploadStep");
    const toast = react.useToast();
    const [loading, setLoading] = react$1.useState(false);
    const { getRootProps, getInputProps, isDragActive, open } = reactDropzone.useDropzone({
        noClick: true,
        noKeyboard: true,
        maxFiles: 1,
        maxSize: maxFileSize,
        accept: {
            "application/vnd.ms-excel": [".xls"],
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
            "text/csv": [".csv"],
        },
        onDropRejected: (fileRejections) => {
            setLoading(false);
            fileRejections.forEach((fileRejection) => {
                toast({
                    status: "error",
                    variant: "left-accent",
                    position: "bottom-left",
                    title: `${fileRejection.file.name} ${translations.uploadStep.dropzone.errorToastDescription}`,
                    description: fileRejection.errors[0].message,
                    isClosable: true,
                });
            });
        },
        onDropAccepted: async ([file]) => {
            setLoading(true);
            const arrayBuffer = await readFilesAsync.readFileAsync(file);
            const workbook = XLSX__namespace.read(arrayBuffer, {
                cellDates: true,
                dateNF: dateFormat,
                raw: parseRaw,
                dense: true,
                codepage: 65001,
            });
            setLoading(false);
            onContinue(workbook, file);
        },
    });
    return (jsxRuntime.jsxs(react.Box, { ...getRootProps(), ...getDropZoneBorder.getDropZoneBorder(styles.dropZoneBorder), width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", flex: 1, children: [jsxRuntime.jsx("input", { ...getInputProps(), "data-testid": "rsi-dropzone" }), isDragActive ? (jsxRuntime.jsx(react.Text, { sx: styles.dropzoneText, children: translations.uploadStep.dropzone.activeDropzoneTitle })) : loading || isLoading ? (jsxRuntime.jsx(react.Text, { sx: styles.dropzoneText, children: translations.uploadStep.dropzone.loadingTitle })) : (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(react.Text, { sx: styles.dropzoneText, children: translations.uploadStep.dropzone.title }), jsxRuntime.jsx(react.Button, { sx: styles.dropzoneButton, onClick: open, children: translations.uploadStep.dropzone.buttonTitle })] }))] }));
};

exports.DropZone = DropZone;
