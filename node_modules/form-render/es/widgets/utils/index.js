function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
dayjs.extend(weekOfYear); // 启用 weekOfYear 插件
export function isUrl(str) {
  var protocolRE = /^(?:\w+:)?\/\/(\S+)$/;
  // const domainRE = /^[^\s\.]+\.\S{2,}$/;
  if (typeof str !== 'string') return false;
  return protocolRE.test(str);
}
export function getFormat(format) {
  var dateFormat;
  switch (format) {
    case 'date':
      dateFormat = 'YYYY-MM-DD';
      break;
    case 'time':
      dateFormat = 'HH:mm:ss';
      break;
    case 'dateTime':
      dateFormat = 'YYYY-MM-DD HH:mm:ss';
      break;
    case 'week':
      dateFormat = 'YYYY-w';
      break;
    case 'year':
      dateFormat = 'YYYY';
      break;
    case 'quarter':
      dateFormat = 'YYYY-Q';
      break;
    case 'month':
      dateFormat = 'YYYY-MM';
      break;
    default:
      // dateTime
      if (typeof format === 'string') {
        dateFormat = format;
      } else {
        dateFormat = 'YYYY-MM-DD';
      }
  }
  return dateFormat;
}
export var transformDateValue = function transformDateValue(value, format, dateFormat) {
  var _a;
  var result = value || undefined;
  if (typeof value === 'string') {
    if (format === 'week') {
      var _value$split = value.split('-'),
        _value$split2 = _slicedToArray(_value$split, 2),
        years = _value$split2[0],
        week = _value$split2[1];
      result = (_a = dayjs(years)) === null || _a === void 0 ? void 0 : _a.week(Number(week));
    }
    if (format === 'quarter') {
      var _value$split3 = value.split('-'),
        _value$split4 = _slicedToArray(_value$split3, 2),
        yearx = _value$split4[0],
        quarter = _value$split4[1];
      result = dayjs(yearx).quarter(quarter);
    }
  }
  if (result) {
    result = dayjs(result, dateFormat);
  }
  return result;
};
export var translation = function translation(configCtx) {
  return function (key) {
    var _a;
    var locale = (_a = configCtx === null || configCtx === void 0 ? void 0 : configCtx.locale) === null || _a === void 0 ? void 0 : _a.FormRender;
    return locale[key];
  };
};