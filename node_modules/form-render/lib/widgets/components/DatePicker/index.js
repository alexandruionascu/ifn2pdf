"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _dayjs = _interopRequireDefault(require("rc-picker/es/generate/dayjs"));
var _generatePicker = _interopRequireDefault(require("antd/es/date-picker/generatePicker"));
require("antd/es/date-picker/style/index");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var DatePicker = (0, _generatePicker.default)(_dayjs.default);
var _default = exports.default = DatePicker;