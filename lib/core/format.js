"use strict";
/** Hàm định dạng hiển thị */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShortMonthName = exports.describeDay = exports.formatCell = exports.formatSolar = exports.formatLunar = exports.getLunarDayName = void 0;
const constants_1 = require("./constants");
/** Tên ngày âm theo cách gọi dân gian: Mùng 1 … Rằm … Ba mươi */
function getLunarDayName(day) {
    if (day === 15)
        return 'Rằm';
    if (day === 30)
        return 'Ba mươi';
    if (day >= 1 && day <= 10)
        return `Mùng ${day}`;
    return String(day);
}
exports.getLunarDayName = getLunarDayName;
/**
 * Định dạng ngày âm.
 *
 * - `short` → "20/11/2023"
 * - `long`  → "20 tháng Một, năm Quý Mão"
 * - `day`   → "Mùng 1"
 */
function formatLunar(lunar, options = {}) {
    const { style = 'short', showLeap = true } = options;
    const leap = lunar.leap && showLeap ? ' nhuận' : '';
    if (style === 'day') {
        return getLunarDayName(lunar.day);
    }
    if (style === 'long') {
        const yearPart = lunar.canChiYearName ? `, năm ${lunar.canChiYearName}` : '';
        return `${lunar.day} ${constants_1.TEN_THANG_AM_FULL[lunar.month]}${leap}${yearPart}`;
    }
    return `${lunar.day}/${lunar.month}${leap}/${lunar.year}`;
}
exports.formatLunar = formatLunar;
/** Định dạng ngày dương: "10/02/2024" hoặc "Thứ bảy, 10/02/2024" */
function formatSolar(day, withWeekday = false) {
    const { solar } = day;
    const d = `${String(solar.day).padStart(2, '0')}/${String(solar.month).padStart(2, '0')}/${solar.year}`;
    return withWeekday ? `${solar.weekdayName}, ${d}` : d;
}
exports.formatSolar = formatSolar;
/** Nhãn ngắn cho ô lịch: thứ viết tắt + ngày dương */
function formatCell(day) {
    return `${constants_1.THU_NGAN[day.solar.weekday]} ${day.solar.day}`;
}
exports.formatCell = formatCell;
/** Một dòng mô tả đầy đủ: "Thứ bảy 10/02/2024 — Mùng 1 tháng Giêng, Giáp Thìn" */
function describeDay(day) {
    const leap = day.lunar.leap ? ' nhuận' : '';
    return (`${day.solar.weekdayName} ${String(day.solar.day).padStart(2, '0')}/${String(day.solar.month).padStart(2, '0')}/${day.solar.year}` +
        ` — ${getLunarDayName(day.lunar.day)} ${constants_1.TEN_THANG_AM_FULL[day.lunar.month]}${leap}, ${day.canChi.year.name}`);
}
exports.describeDay = describeDay;
/** Tên tháng âm ngắn: "Giêng", "Chạp" */
function getShortMonthName(month) {
    return constants_1.TEN_THANG_AM[month];
}
exports.getShortMonthName = getShortMonthName;
