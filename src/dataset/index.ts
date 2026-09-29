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

import {
  createStore,
  dict,
  findGoodDaysIn,
  qualityStatsIn,
  toIso,
  topDaysIn,
  type ChatLuong,
  type FindGoodDaysOptions,
  type LichVietDay,
  type RawYear,
} from './decode';

declare function require(id: string): unknown;

export * from './decode';

const YEAR_KEYS = ['2024', '2025', '2026', '2027', '2028'];

// require tĩnh từng file — Metro chỉ bundle được đường dẫn literal.
// Đường dẫn trỏ thẳng về `src/dataset/data/` (thư mục dữ liệu được publish kèm)
// để bản JS trong `lib/` chạy được ngay mà không cần bước copy.
const YEARS: RawYear[] = [
  require('./data/days-2024.json') as RawYear,
  require('./data/days-2025.json') as RawYear,
  require('./data/days-2026.json') as RawYear,
  require('./data/days-2027.json') as RawYear,
  require('./data/days-2028.json') as RawYear,
];

const store = createStore(YEARS);

/** Các năm có dữ liệu */
export const AVAILABLE_YEARS = YEAR_KEYS.map(Number);

/** Có dữ liệu chi tiết cho ngày này hay không (chuỗi "YYYY-MM-DD") */
export function hasDayData(date: string): boolean {
  return store.has(date);
}

/** Lấy thông tin chi tiết một ngày theo chuỗi "YYYY-MM-DD" */
export function getDayData(date: string): LichVietDay | null {
  return store.lookup(date);
}

/** Lấy theo ngày/tháng/năm dương */
export function getDayDataBySolar(day: number, month: number, year: number): LichVietDay | null {
  return store.lookup(toIso(year, month, day));
}

/** Toàn bộ ngày có dữ liệu, dạng "YYYY-MM-DD", đã sắp xếp */
export function listDayKeys(): string[] {
  return store.keys;
}

/** Toàn bộ ngày đã giải mã */
export function listDays(): LichVietDay[] {
  return store.all();
}

/** Tìm ngày phù hợp cho một việc (xem `FindGoodDaysOptions`) */
export function findGoodDays(options: FindGoodDaysOptions): LichVietDay[] {
  return findGoodDaysIn(store.keys, store.lookup, options);
}

/** Ngày đẹp nhất trong một khoảng */
export function topDays(from?: string, to?: string, limit = 10): LichVietDay[] {
  return topDaysIn(store.keys, store.lookup, from, to, limit);
}

/** Thống kê chất lượng ngày trong một khoảng */
export function getQualityStats(
  from?: string,
  to?: string,
): Record<ChatLuong, number> & { total: number; avgDiem: number } {
  return qualityStatsIn(store.keys, store.lookup, from, to);
}

export { dict as RAW_DICT };
