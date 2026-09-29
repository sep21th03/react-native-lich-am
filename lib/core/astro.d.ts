/**
 * Phần thiên văn: số ngày Julian, sóc (new moon) và kinh độ mặt trời.
 *
 * Công thức theo bộ tính âm lịch phổ biến của Hồ Ngọc Đức (dựa trên
 * Jean Meeus — "Astronomical Algorithms"), đã được đối chiếu với
 * 1.462 ngày dữ liệu lịch Việt (2024–2028) trong quá trình kiểm thử.
 */
/** Làm tròn xuống (khác `Math.floor` với số âm, giống `int()` của C) */
export declare function int(v: number): number;
/**
 * Số ngày Julian của ngày dương lịch.
 * Tự động dùng lịch Julius trước 15/10/1582 và lịch Gregorian sau đó.
 */
export declare function jdFromDate(dd: number, mm: number, yy: number): number;
/** Đổi số ngày Julian về [ngày, tháng, năm] dương lịch */
export declare function jdToDate(jd: number): [number, number, number];
/**
 * Thời điểm sóc (new moon) thứ k, trả về JD theo giờ UT.
 *
 * Dùng chuỗi Meeus 49.1 + 49.2 đầy đủ (kể cả nhiễu hành tinh), chính xác
 * tới cỡ vài chục giây. Bản rút gọn của Hồ Ngọc Đức sai tới ~15 phút, đủ để
 * lật ngày ở những kỳ sóc rơi sát nửa đêm (ví dụ tháng 7 âm lịch năm 2026).
 */
export declare function newMoon(k: number): number;
/** Kinh độ thật của mặt trời tại thời điểm jdn, đơn vị radian (0 → 2π) */
export declare function sunLongitude(jdn: number): number;
/** Ngày (theo múi giờ) chứa thời điểm sóc thứ k */
export declare function getNewMoonDay(k: number, timeZone?: number): number;
/**
 * Kinh độ mặt trời tại nửa đêm địa phương, quy về 12 cung
 * (mỗi cung 30°, tương ứng 12 "trung khí").
 */
export declare function getSunLongitude(dayNumber: number, timeZone?: number): number;
/** Ngày bắt đầu tháng 11 âm lịch của năm dương lịch `yy` (dạng JD) */
export declare function getLunarMonth11(yy: number, timeZone?: number): number;
/** Độ lệch của tháng nhuận so với tháng 11 âm lịch (0 = không nhuận) */
export declare function getLeapMonthOffset(a11: number, timeZone?: number): number;
/** JD của 00:00 ngày hôm nay theo múi giờ `timeZone` (tính từ Date) */
export declare function jdFromDateObject(date: Date, timeZone?: number): number;
/** JD (tại 00:00 UTC) → timestamp mili giây */
export declare function jdToTimestamp(jd: number): number;
/** Timestamp mili giây → JD */
export declare function timestampToJd(ms: number): number;
