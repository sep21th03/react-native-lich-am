/**
 * react-native-lich-am / dataset/2027
 *
 * Chỉ nạp dữ liệu năm 2027 — nhẹ hơn hẳn so với entry `dataset` (nạp cả 5 năm).
 */
import { type ChatLuong, type FindGoodDaysOptions, type LichVietDay } from './decode';
export * from './decode';
/** Năm của bộ dữ liệu này */
export declare const YEAR = 2027;
/** Các năm có dữ liệu trong entry point này */
export declare const AVAILABLE_YEARS: number[];
/** Có dữ liệu chi tiết cho ngày này hay không (chuỗi "YYYY-MM-DD") */
export declare function hasDayData(date: string): boolean;
/** Lấy thông tin chi tiết một ngày theo chuỗi "YYYY-MM-DD" */
export declare function getDayData(date: string): LichVietDay | null;
/** Lấy theo ngày/tháng/năm dương */
export declare function getDayDataBySolar(day: number, month: number, year: number): LichVietDay | null;
/** Toàn bộ ngày có dữ liệu, dạng "YYYY-MM-DD", đã sắp xếp */
export declare function listDayKeys(): string[];
/** Toàn bộ ngày đã giải mã */
export declare function listDays(): LichVietDay[];
/** Tìm ngày phù hợp cho một việc */
export declare function findGoodDays(options: FindGoodDaysOptions): LichVietDay[];
/** Ngày đẹp nhất trong một khoảng */
export declare function topDays(from?: string, to?: string, limit?: number): LichVietDay[];
/** Thống kê chất lượng ngày trong một khoảng */
export declare function getQualityStats(from?: string, to?: string): Record<ChatLuong, number> & {
    total: number;
    avgDiem: number;
};
