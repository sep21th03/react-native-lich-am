/**
 * Chuyển đổi dương lịch ⇄ âm lịch (âm lịch Việt Nam, múi giờ UTC+7).
 */

import { TZ_VN } from './constants';
import {
  getLeapMonthOffset,
  getLunarMonth11,
  getNewMoonDay,
  int,
  jdFromDate,
  jdToDate,
} from './astro';

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
export function solarToLunar(
  day: number,
  month: number,
  year: number,
  timeZone: number = TZ_VN,
): LunarDate {
  const dayNumber = jdFromDate(day, month, year);
  const k = int((dayNumber - 2415021.076998695) / 29.530588853);

  let monthStart = getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone);
  }

  let a11 = getLunarMonth11(year, timeZone);
  let b11 = a11;
  let lunarYear: number;

  if (a11 >= monthStart) {
    lunarYear = year;
    a11 = getLunarMonth11(year - 1, timeZone);
  } else {
    lunarYear = year + 1;
    b11 = getLunarMonth11(year + 1, timeZone);
  }

  const lunarDay = dayNumber - monthStart + 1;
  const diff = int((monthStart - a11) / 29);

  let lunarLeap = false;
  let lunarMonth = diff + 11;

  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) {
        lunarLeap = true;
      }
    }
  }

  if (lunarMonth > 12) {
    lunarMonth -= 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }

  return {
    day: lunarDay,
    month: lunarMonth,
    year: lunarYear,
    leap: lunarLeap,
    jd: dayNumber,
  };
}

/**
 * Âm lịch → dương lịch.
 *
 * @returns ngày dương lịch, hoặc `null` nếu tổ hợp âm lịch không tồn tại
 *          (ví dụ yêu cầu tháng nhuận nhưng năm đó không có tháng nhuận đó).
 */
export function lunarToSolar(
  day: number,
  month: number,
  year: number,
  leap = false,
  timeZone: number = TZ_VN,
): SolarDate | null {
  let a11: number;
  let b11: number;
  if (month < 11) {
    a11 = getLunarMonth11(year - 1, timeZone);
    b11 = getLunarMonth11(year, timeZone);
  } else {
    a11 = getLunarMonth11(year, timeZone);
    b11 = getLunarMonth11(year + 1, timeZone);
  }

  let off = month - 11;
  if (off < 0) {
    off += 12;
  }

  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11, timeZone);
    let leapMonth = leapOff - 2;
    if (leapMonth < 0) {
      leapMonth += 12;
    }
    if (leap && month !== leapMonth) {
      return null;
    }
    if (leap || off >= leapOff) {
      off += 1;
    }
  }

  const k = int(0.5 + (a11 - 2415021.076998695) / 29.530588853);
  const monthStart = getNewMoonDay(k + off, timeZone);
  const jd = monthStart + day - 1;
  const [d, m, y] = jdToDate(jd);
  return { day: d, month: m, year: y, jd };
}

/** Tháng âm `month` của năm âm `year` có phải tháng nhuận hay không */
export function getLeapMonthOfYear(year: number, timeZone: number = TZ_VN): number {
  const a11 = getLunarMonth11(year - 1, timeZone);
  const b11 = getLunarMonth11(year, timeZone);
  if (b11 - a11 <= 365) {
    return 0;
  }
  const leapOff = getLeapMonthOffset(a11, timeZone);
  let leapMonth = leapOff - 2;
  if (leapMonth < 0) {
    leapMonth += 12;
  }
  return leapMonth;
}

/** Số ngày của một tháng âm (29 hoặc 30) */
export function getLunarMonthDays(
  month: number,
  year: number,
  leap = false,
  timeZone: number = TZ_VN,
): number {
  const first = lunarToSolar(1, month, year, leap, timeZone);
  if (!first) {
    return 0;
  }
  const next = lunarToSolar(1, month === 12 ? 1 : month + 1, month === 12 ? year + 1 : year, false, timeZone);
  if (!next) {
    return 0;
  }
  const diff = next.jd - first.jd;
  return diff > 0 && diff < 32 ? diff : 0;
}
