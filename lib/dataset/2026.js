"use strict";
/**
 * react-native-lich-am / dataset/2026
 *
 * Chỉ nạp dữ liệu năm 2026 — nhẹ hơn hẳn so với entry `dataset` (nạp cả 5 năm).
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQualityStats = exports.topDays = exports.findGoodDays = exports.listDays = exports.listDayKeys = exports.getDayDataBySolar = exports.getDayData = exports.hasDayData = exports.AVAILABLE_YEARS = exports.YEAR = void 0;
const decode_1 = require("./decode");
__exportStar(require("./decode"), exports);
const store = (0, decode_1.createStore)([require('./data/days-2026.json')]);
/** Năm của bộ dữ liệu này */
exports.YEAR = 2026;
/** Các năm có dữ liệu trong entry point này */
exports.AVAILABLE_YEARS = [2026];
/** Có dữ liệu chi tiết cho ngày này hay không (chuỗi "YYYY-MM-DD") */
function hasDayData(date) {
    return store.has(date);
}
exports.hasDayData = hasDayData;
/** Lấy thông tin chi tiết một ngày theo chuỗi "YYYY-MM-DD" */
function getDayData(date) {
    return store.lookup(date);
}
exports.getDayData = getDayData;
/** Lấy theo ngày/tháng/năm dương */
function getDayDataBySolar(day, month, year) {
    return store.lookup((0, decode_1.toIso)(year, month, day));
}
exports.getDayDataBySolar = getDayDataBySolar;
/** Toàn bộ ngày có dữ liệu, dạng "YYYY-MM-DD", đã sắp xếp */
function listDayKeys() {
    return store.keys;
}
exports.listDayKeys = listDayKeys;
/** Toàn bộ ngày đã giải mã */
function listDays() {
    return store.all();
}
exports.listDays = listDays;
/** Tìm ngày phù hợp cho một việc */
function findGoodDays(options) {
    return (0, decode_1.findGoodDaysIn)(store.keys, store.lookup, options);
}
exports.findGoodDays = findGoodDays;
/** Ngày đẹp nhất trong một khoảng */
function topDays(from, to, limit = 10) {
    return (0, decode_1.topDaysIn)(store.keys, store.lookup, from, to, limit);
}
exports.topDays = topDays;
/** Thống kê chất lượng ngày trong một khoảng */
function getQualityStats(from, to) {
    return (0, decode_1.qualityStatsIn)(store.keys, store.lookup, from, to);
}
exports.getQualityStats = getQualityStats;
