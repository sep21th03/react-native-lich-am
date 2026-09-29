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
import { dict, type ChatLuong, type FindGoodDaysOptions, type LichVietDay } from './decode';
export * from './decode';
/** Các năm có dữ liệu */
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
/** Tìm ngày phù hợp cho một việc (xem `FindGoodDaysOptions`) */
export declare function findGoodDays(options: FindGoodDaysOptions): LichVietDay[];
/** Ngày đẹp nhất trong một khoảng */
export declare function topDays(from?: string, to?: string, limit?: number): LichVietDay[];
/** Thống kê chất lượng ngày trong một khoảng */
export declare function getQualityStats(from?: string, to?: string): Record<ChatLuong, number> & {
    total: number;
    avgDiem: number;
};
export { dict as RAW_DICT };
