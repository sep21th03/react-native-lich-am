/**
 * API tổng hợp: lấy toàn bộ thông tin lịch âm của một ngày.
 */
import { type LunarDate } from './lunar';
import type { DateInput, LunarDateInfo, LunarDayInfo } from './types';
/** Chuẩn hoá đầu vào thành JD + [ngày, tháng, năm] dương lịch */
export declare function resolveDate(input: DateInput, timeZone?: number): {
    jd: number;
    day: number;
    month: number;
    year: number;
    weekday: number;
};
/** Bọc thêm tên tháng, chuỗi ngày âm cho một `LunarDate` */
export declare function decorateLunar(l: LunarDate): LunarDateInfo;
/**
 * Lấy toàn bộ thông tin lịch âm của một ngày.
 *
 * @example
 * getLunarDayInfo('2024-02-10')       // mùng 1 Tết Giáp Thìn
 * getLunarDayInfo(new Date())         // hôm nay
 * getLunarDayInfo(10, 2, 2024)        // 10/02/2024
 */
export declare function getLunarDayInfo(input: DateInput, timeZone?: number): LunarDayInfo;
/** Tiện dụng: chỉ lấy ngày âm */
export declare function getLunarDate(input: DateInput, timeZone?: number): LunarDateInfo;
/**
 * Tiện dụng: hôm nay là ngày âm bao nhiêu.
 */
export declare function getTodayLunar(timeZone?: number): LunarDateInfo;
