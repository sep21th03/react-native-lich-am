/** Hàm định dạng hiển thị */
import type { LunarDateInfo, LunarDayInfo } from './types';
/** Tên ngày âm theo cách gọi dân gian: Mùng 1 … Rằm … Ba mươi */
export declare function getLunarDayName(day: number): string;
export interface FormatLunarOptions {
    /** Dạng hiển thị */
    style?: 'short' | 'long' | 'day';
    /** Thêm chữ "nhuận" khi là tháng nhuận (mặc định true) */
    showLeap?: boolean;
}
/**
 * Định dạng ngày âm.
 *
 * - `short` → "20/11/2023"
 * - `long`  → "20 tháng Một, năm Quý Mão"
 * - `day`   → "Mùng 1"
 */
export declare function formatLunar(lunar: LunarDateInfo, options?: FormatLunarOptions): string;
/** Định dạng ngày dương: "10/02/2024" hoặc "Thứ bảy, 10/02/2024" */
export declare function formatSolar(day: LunarDayInfo, withWeekday?: boolean): string;
/** Nhãn ngắn cho ô lịch: thứ viết tắt + ngày dương */
export declare function formatCell(day: LunarDayInfo): string;
/** Một dòng mô tả đầy đủ: "Thứ bảy 10/02/2024 — Mùng 1 tháng Giêng, Giáp Thìn" */
export declare function describeDay(day: LunarDayInfo): string;
/** Tên tháng âm ngắn: "Giêng", "Chạp" */
export declare function getShortMonthName(month: number): string;
