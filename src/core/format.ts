/** Hàm định dạng hiển thị */

import { TEN_THANG_AM, TEN_THANG_AM_FULL, THU_NGAN } from './constants';
import type { LunarDateInfo, LunarDayInfo } from './types';

/** Tên ngày âm theo cách gọi dân gian: Mùng 1 … Rằm … Ba mươi */
export function getLunarDayName(day: number): string {
  if (day === 15) return 'Rằm';
  if (day === 30) return 'Ba mươi';
  if (day >= 1 && day <= 10) return `Mùng ${day}`;
  return String(day);
}

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
export function formatLunar(
  lunar: LunarDateInfo,
  options: FormatLunarOptions = {},
): string {
  const { style = 'short', showLeap = true } = options;
  const leap = lunar.leap && showLeap ? ' nhuận' : '';

  if (style === 'day') {
    return getLunarDayName(lunar.day);
  }
  if (style === 'long') {
    const yearPart = lunar.canChiYearName ? `, năm ${lunar.canChiYearName}` : '';
    return `${lunar.day} ${TEN_THANG_AM_FULL[lunar.month]}${leap}${yearPart}`;
  }
  return `${lunar.day}/${lunar.month}${leap}/${lunar.year}`;
}

/** Định dạng ngày dương: "10/02/2024" hoặc "Thứ bảy, 10/02/2024" */
export function formatSolar(day: LunarDayInfo, withWeekday = false): string {
  const { solar } = day;
  const d = `${String(solar.day).padStart(2, '0')}/${String(solar.month).padStart(2, '0')}/${solar.year}`;
  return withWeekday ? `${solar.weekdayName}, ${d}` : d;
}

/** Nhãn ngắn cho ô lịch: thứ viết tắt + ngày dương */
export function formatCell(day: LunarDayInfo): string {
  return `${THU_NGAN[day.solar.weekday]} ${day.solar.day}`;
}

/** Một dòng mô tả đầy đủ: "Thứ bảy 10/02/2024 — Mùng 1 tháng Giêng, Giáp Thìn" */
export function describeDay(day: LunarDayInfo): string {
  const leap = day.lunar.leap ? ' nhuận' : '';
  return (
    `${day.solar.weekdayName} ${String(day.solar.day).padStart(2, '0')}/${String(day.solar.month).padStart(2, '0')}/${day.solar.year}` +
    ` — ${getLunarDayName(day.lunar.day)} ${TEN_THANG_AM_FULL[day.lunar.month]}${leap}, ${day.canChi.year.name}`
  );
}

/** Tên tháng âm ngắn: "Giêng", "Chạp" */
export function getShortMonthName(month: number): string {
  return TEN_THANG_AM[month];
}
