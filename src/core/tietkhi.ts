/**
 * Tiết khí (24 tiết) và "tháng tiết khí" (Kiến tháng) dùng cho Trực.
 */

import { TIET_KHI, TZ_VN } from './constants';
import { getNewMoonDay, int, sunLongitude } from './astro';

/**
 * Cung 15° của kinh độ mặt trời, giá trị 0..23. `arc * 15°` là kinh độ mặt trời; 0 = Xuân phân.
 *
 * Lấy tại **cuối ngày địa phương**, tức tiết khí đang hiệu lực lúc 24:00.
 * Tiết khí được ấn định cho ngày mà thời điểm giao tiết rơi vào, chứ không phải
 * theo vị trí mặt trời lúc 00:00 — nếu lấy mốc đầu ngày thì những tiết giao vào
 * buổi sáng/tối sẽ bị lùi sang hôm sau (sai 96 ngày trên dữ liệu đối chiếu).
 */
export function getSunArc(jd: number, timeZone: number = TZ_VN): number {
  const l = sunLongitude(jd + 0.5 - timeZone / 24);
  return int((l / Math.PI) * 12);
}

export interface TietKhi {
  /** id 1..24, theo quy ước: 1 = Xuân phân, 19 = Đông chí */
  id: number;
  name: string;
  /** Kinh độ mặt trời tại điểm bắt đầu tiết (độ) */
  longitude: number;
  /** Ngày dương lịch bắt đầu tiết này */
  start: { day: number; month: number; year: number };
  /** JD của ngày bắt đầu tiết */
  startJd: number;
}

function arcToId(arc: number): number {
  const id = (arc + 1) % 24;
  return id === 0 ? 24 : id;
}

function jdToYmd(jd: number): { day: number; month: number; year: number } {
  // tách riêng để tránh import vòng
  let a: number;
  let b: number;
  let c: number;
  if (jd > 2299160) {
    a = jd + 32044;
    b = int((4 * a + 3) / 146097);
    c = a - int((b * 146097) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  const d = int((4 * c + 3) / 1461);
  const e = c - int((1461 * d) / 4);
  const m = int((5 * e + 2) / 153);
  return {
    day: e - int((153 * m + 2) / 5) + 1,
    month: m + 3 - 12 * int(m / 10),
    year: b * 100 + d - 4800 + int(m / 10),
  };
}

/** Tiết khí của một ngày (theo JD) */
export function getTietKhi(jd: number, timeZone: number = TZ_VN): TietKhi {
  const arc = getSunArc(jd, timeZone);
  const id = arcToId(arc);
  const meta = TIET_KHI[id - 1];

  // lùi về ngày bắt đầu tiết hiện tại
  let startJd = jd;
  while (getSunArc(startJd - 1, timeZone) === arc) {
    startJd -= 1;
  }

  return {
    id,
    name: meta.name,
    longitude: meta.lon,
    startJd,
    start: jdToYmd(startJd),
  };
}

/**
 * Chi của "tháng tiết khí" (Kiến tháng) — dùng để tính Trực.
 *
 * Lập xuân → Dần, Kinh trập → Mão, Thanh minh → Thìn, …
 * Trả về chỉ số địa chi 0..11 (0 = Tý).
 */
export function getTietKhiMonthChi(jd: number, timeZone: number = TZ_VN): number {
  const arc = getSunArc(jd, timeZone);
  return (((arc + 1) >> 1) + 3) % 12;
}

/** Danh sách 24 tiết khí của một năm dương lịch, kèm ngày bắt đầu */
export function getTietKhiOfYear(year: number, timeZone: number = TZ_VN): TietKhi[] {
  const out: TietKhi[] = [];
  const jdStart = (() => {
    // 01/01 dương lịch
    const a = int((14 - 1) / 12);
    const y = year + 4800 - a;
    const m = 1 + 12 * a - 3;
    return 1 + int((153 * m + 2) / 5) + 365 * y + int(y / 4) - int(y / 100) + int(y / 400) - 32045;
  })();
  let jd = jdStart;
  let lastId = -1;
  while (true) {
    const tk = getTietKhi(jd, timeZone);
    const ymd = jdToYmd(jd);
    if (ymd.year > year) {
      break;
    }
    if (tk.id !== lastId) {
      out.push(tk);
      lastId = tk.id;
    }
    jd += 1;
  }
  return out;
}

/** JD của ngày sóc gần nhất trước hoặc bằng `jd` */
export function getMonthStart(jd: number, timeZone: number = TZ_VN): number {
  const k = int((jd - 2415021.076998695) / 29.530588853);
  let start = getNewMoonDay(k + 1, timeZone);
  if (start > jd) {
    start = getNewMoonDay(k, timeZone);
  }
  return start;
}
