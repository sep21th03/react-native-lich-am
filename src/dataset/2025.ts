/**
 * react-native-lich-am / dataset/2025
 *
 * Chỉ nạp dữ liệu năm 2025 — nhẹ hơn hẳn so với entry `dataset` (nạp cả 5 năm).
 */

import {
  createStore,
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

const store = createStore([require('./data/days-2025.json') as RawYear]);

/** Năm của bộ dữ liệu này */
export const YEAR = 2025;

/** Các năm có dữ liệu trong entry point này */
export const AVAILABLE_YEARS = [2025];

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

/** Tìm ngày phù hợp cho một việc */
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
