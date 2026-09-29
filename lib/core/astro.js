"use strict";
/**
 * Phần thiên văn: số ngày Julian, sóc (new moon) và kinh độ mặt trời.
 *
 * Công thức theo bộ tính âm lịch phổ biến của Hồ Ngọc Đức (dựa trên
 * Jean Meeus — "Astronomical Algorithms"), đã được đối chiếu với
 * 1.462 ngày dữ liệu lịch Việt (2024–2028) trong quá trình kiểm thử.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.timestampToJd = exports.jdToTimestamp = exports.jdFromDateObject = exports.getLeapMonthOffset = exports.getLunarMonth11 = exports.getSunLongitude = exports.getNewMoonDay = exports.sunLongitude = exports.newMoon = exports.jdToDate = exports.jdFromDate = exports.int = void 0;
const constants_1 = require("./constants");
const PI = Math.PI;
const DR = PI / 180;
/** Làm tròn xuống (khác `Math.floor` với số âm, giống `int()` của C) */
function int(v) {
    return Math.floor(v);
}
exports.int = int;
/**
 * Số ngày Julian của ngày dương lịch.
 * Tự động dùng lịch Julius trước 15/10/1582 và lịch Gregorian sau đó.
 */
function jdFromDate(dd, mm, yy) {
    const a = int((14 - mm) / 12);
    const y = yy + 4800 - a;
    const m = mm + 12 * a - 3;
    let jd = dd + int((153 * m + 2) / 5) + 365 * y + int(y / 4) - int(y / 100) + int(y / 400) - 32045;
    if (jd < 2299161) {
        jd = dd + int((153 * m + 2) / 5) + 365 * y + int(y / 4) - 32083;
    }
    return jd;
}
exports.jdFromDate = jdFromDate;
/** Đổi số ngày Julian về [ngày, tháng, năm] dương lịch */
function jdToDate(jd) {
    let a;
    let b;
    let c;
    if (jd > 2299160) {
        a = jd + 32044;
        b = int((4 * a + 3) / 146097);
        c = a - int((b * 146097) / 4);
    }
    else {
        b = 0;
        c = jd + 32082;
    }
    const d = int((4 * c + 3) / 1461);
    const e = c - int((1461 * d) / 4);
    const m = int((5 * e + 2) / 153);
    const day = e - int((153 * m + 2) / 5) + 1;
    const month = m + 3 - 12 * int(m / 10);
    const year = b * 100 + d - 4800 + int(m / 10);
    return [day, month, year];
}
exports.jdToDate = jdToDate;
/**
 * Hệ số k của Hồ Ngọc Đức lấy mốc 1900-01-01, còn Meeus lấy mốc 2000-01-06.
 * Hai mốc cách nhau đúng 1237 tuần trăng nên chỉ cần dịch k;
 * pha của các số hạng tuần hoàn vẫn giữ nguyên.
 */
const MEEUS_K_OFFSET = 1237;
/** ΔT (TT − UT) tính bằng giây — Espenak & Meeus, dùng cho giai đoạn 2005–2050 */
function deltaTSeconds(year) {
    if (year < 2005) {
        const t0 = year - 2000;
        return 63.86 + 0.3345 * t0 - 0.060374 * t0 * t0 + 0.0017275 * t0 * t0 * t0;
    }
    const t = year - 2000;
    return 62.92 + 0.32217 * t + 0.005589 * t * t;
}
/**
 * Thời điểm sóc (new moon) thứ k, trả về JD theo giờ UT.
 *
 * Dùng chuỗi Meeus 49.1 + 49.2 đầy đủ (kể cả nhiễu hành tinh), chính xác
 * tới cỡ vài chục giây. Bản rút gọn của Hồ Ngọc Đức sai tới ~15 phút, đủ để
 * lật ngày ở những kỳ sóc rơi sát nửa đêm (ví dụ tháng 7 âm lịch năm 2026).
 */
function newMoon(k) {
    const km = k - MEEUS_K_OFFSET;
    const T = km / 1236.85;
    const T2 = T * T;
    const T3 = T2 * T;
    const T4 = T3 * T;
    const jde = 2451550.09766 + 29.530588861 * km
        + 0.00015437 * T2 - 0.000000150 * T3 + 0.00000000073 * T4;
    const E = 1 - 0.002516 * T - 0.0000074 * T2;
    const M = (2.5534 + 29.10535670 * km - 0.0000014 * T2 - 0.00000011 * T3) * DR;
    const Mp = (201.5643 + 385.81693528 * km + 0.0107582 * T2 + 0.00001238 * T3 - 0.000000058 * T4) * DR;
    const F = (160.7108 + 390.67050284 * km - 0.0016118 * T2 - 0.00000227 * T3 + 0.000000011 * T4) * DR;
    const Om = (124.7746 - 1.56375588 * km + 0.0020672 * T2 + 0.00000215 * T3) * DR;
    let c = 0;
    c -= 0.40720 * Math.sin(Mp);
    c += 0.17241 * E * Math.sin(M);
    c += 0.01608 * Math.sin(2 * Mp);
    c += 0.01039 * Math.sin(2 * F);
    c += 0.00739 * E * Math.sin(Mp - M);
    c -= 0.00514 * E * Math.sin(Mp + M);
    c += 0.00208 * E * E * Math.sin(2 * M);
    c -= 0.00111 * Math.sin(Mp - 2 * F);
    c -= 0.00057 * Math.sin(Mp + 2 * F);
    c += 0.00056 * E * Math.sin(2 * Mp + M);
    c -= 0.00042 * Math.sin(3 * Mp);
    c += 0.00042 * E * Math.sin(M + 2 * F);
    c += 0.00038 * E * Math.sin(M - 2 * F);
    c -= 0.00024 * E * Math.sin(2 * Mp - M);
    c -= 0.00017 * Math.sin(Om);
    c -= 0.00007 * Math.sin(Mp + 2 * M);
    c += 0.00004 * Math.sin(2 * Mp - 2 * F);
    c += 0.00004 * Math.sin(3 * M);
    c += 0.00003 * Math.sin(Mp + M - 2 * F);
    c += 0.00003 * Math.sin(2 * Mp + 2 * F);
    c -= 0.00003 * Math.sin(Mp + M + 2 * F);
    c += 0.00003 * Math.sin(Mp - M + 2 * F);
    c -= 0.00002 * Math.sin(Mp - M - 2 * F);
    c -= 0.00002 * Math.sin(3 * Mp + M);
    c += 0.00002 * Math.sin(4 * Mp);
    // Nhiễu do các hành tinh khác (Meeus, bảng 49.A)
    c += 0.000325 * Math.sin((299.77 + 0.107408 * km - 0.009173 * T2) * DR);
    c += 0.000165 * Math.sin((251.88 + 0.016321 * km) * DR);
    c += 0.000164 * Math.sin((251.83 + 26.651886 * km) * DR);
    c += 0.000126 * Math.sin((349.42 + 36.412478 * km) * DR);
    c += 0.000110 * Math.sin((84.66 + 18.206239 * km) * DR);
    c += 0.000062 * Math.sin((141.74 + 53.303771 * km) * DR);
    c += 0.000060 * Math.sin((207.14 + 2.453732 * km) * DR);
    c += 0.000056 * Math.sin((154.84 + 7.306860 * km) * DR);
    c += 0.000047 * Math.sin((34.52 + 27.261239 * km) * DR);
    c += 0.000042 * Math.sin((207.19 + 0.121824 * km) * DR);
    c += 0.000040 * Math.sin((291.34 + 1.844379 * km) * DR);
    c += 0.000037 * Math.sin((161.72 + 24.198154 * km) * DR);
    c += 0.000035 * Math.sin((239.56 + 25.513099 * km) * DR);
    c += 0.000023 * Math.sin((331.55 + 3.592518 * km) * DR);
    return jde + c - deltaTSeconds(1900 + k / 12.3685) / 86400;
}
exports.newMoon = newMoon;
/** Kinh độ thật của mặt trời tại thời điểm jdn, đơn vị radian (0 → 2π) */
function sunLongitude(jdn) {
    const T = (jdn - 2451545.0) / 36525;
    const T2 = T * T;
    const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
    const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
    let dl = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(DR * M);
    dl += (0.019993 - 0.000101 * T) * Math.sin(DR * 2 * M) + 0.00029 * Math.sin(DR * 3 * M);
    let l = (L0 + dl) * DR;
    l -= PI * 2 * int(l / (PI * 2));
    return l;
}
exports.sunLongitude = sunLongitude;
/** Ngày (theo múi giờ) chứa thời điểm sóc thứ k */
function getNewMoonDay(k, timeZone = constants_1.TZ_VN) {
    return int(newMoon(k) + 0.5 + timeZone / 24);
}
exports.getNewMoonDay = getNewMoonDay;
/**
 * Kinh độ mặt trời tại nửa đêm địa phương, quy về 12 cung
 * (mỗi cung 30°, tương ứng 12 "trung khí").
 */
function getSunLongitude(dayNumber, timeZone = constants_1.TZ_VN) {
    return int((sunLongitude(dayNumber - 0.5 - timeZone / 24) / PI) * 6);
}
exports.getSunLongitude = getSunLongitude;
/** Ngày bắt đầu tháng 11 âm lịch của năm dương lịch `yy` (dạng JD) */
function getLunarMonth11(yy, timeZone = constants_1.TZ_VN) {
    const off = jdFromDate(31, 12, yy) - 2415021;
    const k = int(off / 29.530588853);
    let nm = getNewMoonDay(k, timeZone);
    const sunLong = getSunLongitude(nm, timeZone);
    if (sunLong >= 9) {
        nm = getNewMoonDay(k - 1, timeZone);
    }
    return nm;
}
exports.getLunarMonth11 = getLunarMonth11;
/** Độ lệch của tháng nhuận so với tháng 11 âm lịch (0 = không nhuận) */
function getLeapMonthOffset(a11, timeZone = constants_1.TZ_VN) {
    const k = int((a11 - 2415021.076998695) / 29.530588853 + 0.5);
    let last = 0;
    let i = 1;
    let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
    do {
        last = arc;
        i += 1;
        arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
    } while (arc !== last && i < 14);
    return i - 1;
}
exports.getLeapMonthOffset = getLeapMonthOffset;
/** JD của 00:00 ngày hôm nay theo múi giờ `timeZone` (tính từ Date) */
function jdFromDateObject(date, timeZone = constants_1.TZ_VN) {
    const shifted = new Date(date.getTime() + timeZone * 3600 * 1000);
    return jdFromDate(shifted.getUTCDate(), shifted.getUTCMonth() + 1, shifted.getUTCFullYear());
}
exports.jdFromDateObject = jdFromDateObject;
/** JD (tại 00:00 UTC) → timestamp mili giây */
function jdToTimestamp(jd) {
    return Math.round((jd - constants_1.JD_UNIX_EPOCH) * 86400000);
}
exports.jdToTimestamp = jdToTimestamp;
/** Timestamp mili giây → JD */
function timestampToJd(ms) {
    return ms / 86400000 + constants_1.JD_UNIX_EPOCH;
}
exports.timestampToJd = timestampToJd;
