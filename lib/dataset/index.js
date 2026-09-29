"use strict";
/**
 * react-native-lich-am / dataset
 *
 * Bộ dữ liệu chi tiết theo ngày, trích xuất từ app Lịch Việt
 * (com.somestudio.lichvietnam) — phủ 01/01/2024 → 01/01/2028 (1.462 ngày).
 *
 * Gồm những thứ KHÔNG thể suy ra bằng thuật toán:
 * sao tốt / sao xấu, việc nên làm / không nên làm, điểm từng giờ,
 * hướng tốt theo sơn, tuổi xung, 4 giờ đại cát, giờ quý đăng thiên môn.
 *
 * Muốn nhẹ bundle hơn thì import từng năm:
 *   import { getDayData } from 'react-native-lich-am/dataset/2024';
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
exports.RAW_DICT = exports.getQualityStats = exports.topDays = exports.findGoodDays = exports.listDays = exports.listDayKeys = exports.getDayDataBySolar = exports.getDayData = exports.hasDayData = exports.AVAILABLE_YEARS = void 0;
const decode_1 = require("./decode");
Object.defineProperty(exports, "RAW_DICT", { enumerable: true, get: function () { return decode_1.dict; } });
__exportStar(require("./decode"), exports);
const YEAR_KEYS = ['2024', '2025', '2026', '2027', '2028'];
// require tĩnh từng file — Metro chỉ bundle được đường dẫn literal.
// Đường dẫn trỏ thẳng về `src/dataset/data/` (thư mục dữ liệu được publish kèm)
// để bản JS trong `lib/` chạy được ngay mà không cần bước copy.
const YEARS = [
    require('./data/days-2024.json'),
    require('./data/days-2025.json'),
    require('./data/days-2026.json'),
    require('./data/days-2027.json'),
    require('./data/days-2028.json'),
];
const store = (0, decode_1.createStore)(YEARS);
/** Các năm có dữ liệu */
exports.AVAILABLE_YEARS = YEAR_KEYS.map(Number);
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
/** Tìm ngày phù hợp cho một việc (xem `FindGoodDaysOptions`) */
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
