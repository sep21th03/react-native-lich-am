/**
 * Chuyển đổi dương lịch ⇄ âm lịch (âm lịch Việt Nam, múi giờ UTC+7).
 */
export interface LunarDate {
    /** Ngày âm (1–30) */
    day: number;
    /** Tháng âm (1–12) */
    month: number;
    /** Năm âm */
    year: number;
    /** Tháng nhuận hay không */
    leap: boolean;
    /** Số ngày Julian của ngày dương tương ứng */
    jd: number;
}
export interface SolarDate {
    day: number;
    month: number;
    year: number;
    jd: number;
}
/**
 * Dương lịch → âm lịch.
 *
 * @example
 * solarToLunar(10, 2, 2024) // Tết Giáp Thìn → { day: 1, month: 1, year: 2024, leap: false }
 */
export declare function solarToLunar(day: number, month: number, year: number, timeZone?: number): LunarDate;
/**
 * Âm lịch → dương lịch.
 *
 * @returns ngày dương lịch, hoặc `null` nếu tổ hợp âm lịch không tồn tại
 *          (ví dụ yêu cầu tháng nhuận nhưng năm đó không có tháng nhuận đó).
 */
export declare function lunarToSolar(day: number, month: number, year: number, leap?: boolean, timeZone?: number): SolarDate | null;
/** Tháng âm `month` của năm âm `year` có phải tháng nhuận hay không */
export declare function getLeapMonthOfYear(year: number, timeZone?: number): number;
/** Số ngày của một tháng âm (29 hoặc 30) */
export declare function getLunarMonthDays(month: number, year: number, leap?: boolean, timeZone?: number): number;
