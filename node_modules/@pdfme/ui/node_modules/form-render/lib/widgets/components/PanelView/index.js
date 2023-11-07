"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _classnames = _interopRequireDefault(require("classnames"));
require("./index.css");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var PanelView = function PanelView(_ref) {
  var children = _ref.children,
    bordered = _ref.bordered;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)('fr-panel', {
      'fr-panel-bordered': bordered
    })
  }, children);
};
var _default = exports.default = PanelView;