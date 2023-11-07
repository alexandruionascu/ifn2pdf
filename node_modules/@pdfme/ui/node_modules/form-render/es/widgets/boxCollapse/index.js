import _DownOutlined from "@ant-design/icons/lib/icons/DownOutlined";
import "antd/es/collapse/style";
import _Collapse from "antd/es/collapse";
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
import React, { useState } from 'react';
import "./index.css";
import BoxPanel from '../components/PanelView';
var Panel = _Collapse.Panel;
/**
 * 折叠面板
 */
var BoxCollapse = function BoxCollapse(props) {
  var style = props.style,
    children = props.children,
    title = props.title,
    description = props.description,
    _props$collapsed = props.collapsed,
    collapsed = _props$collapsed === void 0 ? true : _props$collapsed,
    displayType = props.displayType,
    _props$bordered = props.bordered,
    bordered = _props$bordered === void 0 ? false : _props$bordered,
    _props$ghost = props.ghost,
    ghost = _props$ghost === void 0 ? true : _props$ghost;
  if (!title) {
    return /*#__PURE__*/React.createElement(BoxPanel, {
      bordered: displayType !== 'inline'
    }, children);
  }
  var _useState = useState(collapsed ? 'single' : ''),
    _useState2 = _slicedToArray(_useState, 2),
    activeKey = _useState2[0],
    setActiveKey = _useState2[1];
  var collapseHeader = /*#__PURE__*/React.createElement(React.Fragment, null, title && /*#__PURE__*/React.createElement("div", {
    className: 'collapse-title'
  }, title), description && /*#__PURE__*/React.createElement("span", {
    className: 'fr-header-desc '
  }, description));
  var renderExpandIcon = function renderExpandIcon(_ref) {
    var isActive = _ref.isActive;
    return /*#__PURE__*/React.createElement("div", {
      className: 'expand-icon-box'
    }, /*#__PURE__*/React.createElement(_DownOutlined, {
      rotate: isActive ? 0 : -90,
      style: {
        fontSize: '16px'
      }
    }));
  };
  return /*#__PURE__*/React.createElement(_Collapse, {
    className: 'fr-obj-collapse',
    style: style,
    bordered: bordered,
    ghost: ghost,
    activeKey: [activeKey],
    expandIcon: renderExpandIcon,
    onChange: function onChange() {
      return setActiveKey(activeKey ? '' : 'single');
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    key: 'single',
    header: collapseHeader,
    forceRender: true
  }, children));
};
export default BoxCollapse;