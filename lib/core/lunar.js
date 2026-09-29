"use strict";
/**
 * Chuyển đổi dương lịch ⇄ âm lịch (âm lịch Việt Nam, múi giờ UTC+7).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLunarMonthDays = exports.getLeapMonthOfYear = exports.lunarToSolar = exports.solarToLunar = void 0;
const constants_1 = require("./constants");
const astro_1 = require("./astro");
/**
 * Dương lịch → âm lịch.
 *
 * @example
 * solarToLunar(10, 2, 2024) // Tết Giáp Thìn → { day: 1, month: 1, year: 2024, leap: false }
 */
function solarToLunar(day, month, year, timeZone = constants_1.TZ_VN) {
    const dayNumber = (0, astro_1.jdFromDate)(day, month, year);
    const k = (0, astro_1.int)((dayNumber - 2415021.076998695) / 29.530588853);
    let monthStart = (0, astro_1.getNewMoonDay)(k + 1, timeZone);
    if (monthStart > dayNumber) {
        monthStart = (0, astro_1.getNewMoonDay)(k, timeZone);
    }
    let a11 = (0, astro_1.getLunarMonth11)(year, timeZone);
    let b11 = a11;
    let lunarYear;
    if (a11 >= monthStart) {
        lunarYear = year;
        a11 = (0, astro_1.getLunarMonth11)(year - 1, timeZone);
    }
    else {
        lunarYear = year + 1;
        b11 = (0, astro_1.getLunarMonth11)(year + 1, timeZone);
    }
    const lunarDay = dayNumber - monthStart + 1;
    const diff = (0, astro_1.int)((monthStart - a11) / 29);
    let lunarLeap = false;
    let lunarMonth = diff + 11;
    if (b11 - a11 > 365) {
        const leapMonthDiff = (0, astro_1.getLeapMonthOffset)(a11, timeZone);
        if (diff >= leapMonthDiff) {
            lunarMonth = diff + 10;
            if (diff === leapMonthDiff) {
                lunarLeap = true;
            }
        }
    }
    if (lunarMonth > 12) {
        lunarMonth -= 12;
    }
    if (lunarMonth >= 11 && diff < 4) {
        lunarYear -= 1;
    }
    return {
        day: lunarDay,
        month: lunarMonth,
        year: lunarYear,
        leap: lunarLeap,
        jd: dayNumber,
    };
}
exports.solarToLunar = solarToLunar;
/**
 * Âm lịch → dương lịch.
 *
 * @returns ngày dương lịch, hoặc `null` nếu tổ hợp âm lịch không tồn tại
 *          (ví dụ yêu cầu tháng nhuận nhưng năm đó không có tháng nhuận đó).
 */
function lunarToSolar(day, month, year, leap = false, timeZone = constants_1.TZ_VN) {
    let a11;
    let b11;
    if (month < 11) {
        a11 = (0, astro_1.getLunarMonth11)(year - 1, timeZone);
        b11 = (0, astro_1.getLunarMonth11)(year, timeZone);
    }
    else {
        a11 = (0, astro_1.getLunarMonth11)(year, timeZone);
        b11 = (0, astro_1.getLunarMonth11)(year + 1, timeZone);
    }
    let off = month - 11;
    if (off < 0) {
        off += 12;
    }
    if (b11 - a11 > 365) {
        const leapOff = (0, astro_1.getLeapMonthOffset)(a11, timeZone);
        let leapMonth = leapOff - 2;
        if (leapMonth < 0) {
            leapMonth += 12;
        }
        if (leap && month !== leapMonth) {
            return null;
        }
        if (leap || off >= leapOff) {
            off += 1;
        }
    }
    const k = (0, astro_1.int)(0.5 + (a11 - 2415021.076998695) / 29.530588853);
    const monthStart = (0, astro_1.getNewMoonDay)(k + off, timeZone);
    const jd = monthStart + day - 1;
    const [d, m, y] = (0, astro_1.jdToDate)(jd);
    return { day: d, month: m, year: y, jd };
}
exports.lunarToSolar = lunarToSolar;
/** Tháng âm `month` của năm âm `year` có phải tháng nhuận hay không */
function getLeapMonthOfYear(year, timeZone = constants_1.TZ_VN) {
    const a11 = (0, astro_1.getLunarMonth11)(year - 1, timeZone);
    const b11 = (0, astro_1.getLunarMonth11)(year, timeZone);
    if (b11 - a11 <= 365) {
        return 0;
    }
    const leapOff = (0, astro_1.getLeapMonthOffset)(a11, timeZone);
    let leapMonth = leapOff - 2;
    if (leapMonth < 0) {
        leapMonth += 12;
    }
    return leapMonth;
}
exports.getLeapMonthOfYear = getLeapMonthOfYear;
/** Số ngày của một tháng âm (29 hoặc 30) */
function getLunarMonthDays(month, year, leap = false, timeZone = constants_1.TZ_VN) {
    const first = lunarToSolar(1, month, year, leap, timeZone);
    if (!first) {
        return 0;
    }
    const next = lunarToSolar(1, month === 12 ? 1 : month + 1, month === 12 ? year + 1 : year, false, timeZone);
    if (!next) {
        return 0;
    }
    const diff = next.jd - first.jd;
    return diff > 0 && diff < 32 ? diff : 0;
}
exports.getLunarMonthDays = getLunarMonthDays;
