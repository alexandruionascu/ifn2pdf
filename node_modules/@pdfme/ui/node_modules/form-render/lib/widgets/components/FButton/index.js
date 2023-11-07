"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("antd/es/button/style");
var _button = _interopRequireDefault(require("antd/es/button"));
var _tslib = require("tslib");
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var HeaderTitle = function HeaderTitle(props) {
  var icon = props.icon,
    children = props.children,
    btnType = props.btnType,
    otherProps = (0, _tslib.__rest)(props, ["icon", "children", "btnType"]);
  var btnProps = Object.assign({}, otherProps);
  if (btnType === 'icon') {
    btnProps.icon = icon;
    btnProps.size = 'small';
  } else {
    btnProps.children = children;
  }
  return /*#__PURE__*/_react.default.createElement(_button.default, Object.assign({
    type: 'link',
    style: {
      padding: 0
    }
  }, btnProps));
};
var _default = exports.default = HeaderTitle;