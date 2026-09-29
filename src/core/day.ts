/**
 * API tổng hợp: lấy toàn bộ thông tin lịch âm của một ngày.
 */

import { TEN_THANG_AM_FULL, THU, TZ_VN } from './constants';
import { jdFromDate, jdToDate, jdFromDateObject } from './astro';
import { solarToLunar, type LunarDate } from './lunar';
import {
  getCanChiDay,
  getCanChiMonth,
  getCanChiYear,
  getConGiap,
  getNapAm,
  getNguHanhId,
} from './canchi';
import { getTietKhi } from './tietkhi';
import { getGioInDay, getTruc } from './truc';
import { getHuongXuatHanh } from './huong';
import type { DateInput, LunarDateInfo, LunarDayInfo } from './types';

/** Chuẩn hoá đầu vào thành JD + [ngày, tháng, năm] dương lịch */
export function resolveDate(input: DateInput, timeZone: number = TZ_VN): {
  jd: number;
  day: number;
  month: number;
  year: number;
  weekday: number;
} {
  let jd: number;
  let weekday: number;

  if (input instanceof Date) {
    jd = jdFromDateObject(input, timeZone);
    const shifted = new Date(input.getTime() + timeZone * 3600 * 1000);
    weekday = shifted.getUTCDay();
  } else if (typeof input === 'number') {
    jd = input;
    weekday = (((jd + 1) % 7) + 7) % 7;
  } else if (typeof input === 'string') {
    const m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(input.trim());
    if (!m) {
      throw new Error(`react-native-lich-am: không hiểu chuỗi ngày "${input}" (cần dạng YYYY-MM-DD)`);
    }
    jd = jdFromDate(Number(m[3]), Number(m[2]), Number(m[1]));
    weekday = (((jd + 1) % 7) + 7) % 7;
  } else {
    jd = jdFromDate(input.day, input.month, input.year);
    weekday = (((jd + 1) % 7) + 7) % 7;
  }

  const [day, month, year] = jdToDate(jd);
  return { jd, day, month, year, weekday };
}

/** Bọc thêm tên tháng, chuỗi ngày âm cho một `LunarDate` */
export function decorateLunar(l: LunarDate): LunarDateInfo {
  const base = TEN_THANG_AM_FULL[l.month];
  return {
    ...l,
    monthName: base,
    monthNameFull: l.leap ? `${base} nhuận` : base,
    text: `${l.day}/${l.month}/${l.year}`,
  };
}

/**
 * Lấy toàn bộ thông tin lịch âm của một ngày.
 *
 * @example
 * getLunarDayInfo('2024-02-10')       // mùng 1 Tết Giáp Thìn
 * getLunarDayInfo(new Date())         // hôm nay
 * getLunarDayInfo(10, 2, 2024)        // 10/02/2024
 */
export function getLunarDayInfo(input: DateInput, timeZone: number = TZ_VN): LunarDayInfo {
  const { jd, day, month, year, weekday } = resolveDate(input, timeZone);

  const lunar = solarToLunar(day, month, year, timeZone);
  const canChiDay = getCanChiDay(jd);
  const canChiYear = getCanChiYear(lunar.year);
  const canChiMonth = getCanChiMonth(lunar.month, lunar.year);

  const napAmDay = getNapAm(canChiDay.canIndex, canChiDay.chiIndex);
  const napAmYear = getNapAm(canChiYear.canIndex, canChiYear.chiIndex);
  const napAmMonth = getNapAm(canChiMonth.canIndex, canChiMonth.chiIndex);

  const gio = getGioInDay(canChiDay.chiIndex);

  return {
    jd,
    solar: {
      day,
      month,
      year,
      weekday,
      weekdayName: THU[weekday],
      iso: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    },
    lunar: decorateLunar(lunar),
    canChi: { year: canChiYear, month: canChiMonth, day: canChiDay },
    conGiap: getConGiap(lunar.year),
    napAm: { year: napAmYear, month: napAmMonth, day: napAmDay },
    nguHanh: napAmDay.element,
    nguHanhId: getNguHanhId(napAmDay.element),
    tietKhi: getTietKhi(jd, timeZone),
    truc: getTruc(jd, canChiDay.chiIndex, timeZone),
    gio,
    gioHoangDao: gio.filter((g) => g.hoangDao),
    huongXuatHanh: getHuongXuatHanh(canChiDay.canIndex, canChiDay.can),
  };
}

/** Tiện dụng: chỉ lấy ngày âm */
export function getLunarDate(input: DateInput, timeZone: number = TZ_VN): LunarDateInfo {
  const { day, month, year } = resolveDate(input, timeZone);
  return decorateLunar(solarToLunar(day, month, year, timeZone));
}

/**
 * Tiện dụng: hôm nay là ngày âm bao nhiêu.
 */
export function getTodayLunar(timeZone: number = TZ_VN): LunarDateInfo {
  return getLunarDate(new Date(), timeZone);
}
