function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
/**
 * Updated by Tw93 on 2019-12-08.
 * 日历多选组件
 */
import TimePicker from '../../components/TimePicker';
import dayjs from 'dayjs';
import React from 'react';
import { getFormat } from '../../utils';
var RangePicker = TimePicker.RangePicker;
var TimeRange = function TimeRange(_ref) {
  var onChange = _ref.onChange,
    _ref$format = _ref.format,
    format = _ref$format === void 0 ? 'time' : _ref$format,
    value = _ref.value,
    style = _ref.style,
    schema = _ref.schema;
  var _a, _b;
  var timeFormat = getFormat(format);
  var _ref2 = Array.isArray(value) ? value : [],
    _ref3 = _slicedToArray(_ref2, 2),
    start = _ref3[0],
    end = _ref3[1];
  var _value = start && end ? [dayjs(start, ((_a = schema === null || schema === void 0 ? void 0 : schema.props) === null || _a === void 0 ? void 0 : _a.format) || timeFormat), dayjs(end, ((_b = schema === null || schema === void 0 ? void 0 : schema.props) === null || _b === void 0 ? void 0 : _b.format) || timeFormat)] : [];
  var handleChange = function handleChange(_, stringList) {
    var emptyList1 = stringList[0] === '' || stringList[1] === '';
    var emptyList2 = stringList[0] === undefined || stringList[1] === undefined;
    if (emptyList1 || emptyList2) {
      onChange(undefined);
    } else {
      onChange(stringList);
    }
  };
  var timeParams = Object.assign({
    style: Object.assign({
      width: '100%'
    }, style),
    value: _value,
    onChange: handleChange
  }, schema.props || {});
  return /*#__PURE__*/React.createElement(RangePicker, Object.assign({}, timeParams));
};
export default TimeRange;