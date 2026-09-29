/**
 * Giải mã bộ dữ liệu Lịch Việt (bản nén) + các hàm tra cứu dùng chung.
 *
 * File này KHÔNG nạp dữ liệu năm nào — nhờ vậy các entry point theo từng năm
 * (`react-native-lich-am/dataset/2024`) chỉ kéo theo đúng dữ liệu của năm đó.
 */

import { CHI, NGU_HANH, TRUC } from '../core/constants';

declare function require(id: string): unknown;

/* ------------------------------------------------------------------ */
/* Kiểu dữ liệu thô trong file JSON                                    */
/* ------------------------------------------------------------------ */

export interface RawDict {
  truc: string[];
  nguHanh: string[];
  chatLuong: string[];
  sao: string[];
  gioSao: string[];
  viec: string[];
  nhom: string[];
  huong: string[];
  son: string[];
  than: string[];
  gioChi: string[];
  meta: { start: string; end: string; count: number; scoreMin: number; scoreMax: number };
}

export interface RawDay {
  /** ngày âm "d-m-yyyy" */
  l: string;
  /** chỉ số Trực */
  t: number;
  /** id ngũ hành */
  n: number;
  /** ngày rất xấu */
  x: number;
  /** điểm thô */
  s: number;
  /** sao tốt */
  a: number[];
  /** sao xấu */
  b: number[];
  /** việc nên làm */
  y: number[];
  /** việc không nên làm */
  z: number[];
  /** 12 giờ: [giờ, điểm, sao[]] */
  h: Array<[number, number, number[]]>;
  /** giờ tốt nhất: [giờ, điểm] */
  g: Array<[number, number]>;
  /** 4 giờ đại cát: [giờ, sao, hướng gốc] */
  d: Array<[number, number, number]>;
  /** giờ quý đăng thiên môn: [giờ, sao] */
  q: Array<[number, number]>;
  /** hướng tốt: [sơn, số sao, hướng] */
  p: {
    nam: Array<[number, number, number]>;
    thang: Array<[number, number, number]>;
    ngay: Array<[number, number, number]>;
  };
  /** tuổi xung: [can, chi] */
  u: Array<[number, number]>;
  /** điểm 0–100 */
  e: number;
  /** xếp loại */
  k: number;
}

export interface RawYear {
  year: number;
  days: Record<string, RawDay>;
}

export const dict = require('./data/dict.json') as RawDict;

const CAN_NAMES = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];

/* ------------------------------------------------------------------ */
/* Kiểu dữ liệu đã giải mã                                             */
/* ------------------------------------------------------------------ */

export type ChatLuong = 'dep' | 'tot' | 'bt' | 'xau' | 'ratxau';

export interface LichVietGio {
  /** Chỉ số địa chi 0..11 */
  index: number;
  /** "Tý" … "Hợi" */
  chi: string;
  /** Điểm của giờ (số càng cao càng tốt) */
  diem: number;
  /** Các sao chiếu vào giờ */
  sao: string[];
  /** Có phải một trong các giờ tốt nhất ngày */
  top: boolean;
}

export interface LichVietHuong {
  /** Tên sơn, ví dụ "Tốn", "Bính" */
  son: string;
  /** Số sao tốt của hướng */
  soSao: number;
  /** Mô tả hướng, ví dụ "Chính Đông Nam" */
  huong: string;
}

export interface LichVietDaiCat {
  index: number;
  chi: string;
  sao: string;
  /** Hướng gốc: Càn / Khôn / Cấn / Tốn */
  gioGoc: string;
}

/** Thông tin chi tiết một ngày (dữ liệu Lịch Việt) */
export interface LichVietDay {
  /** "2024-02-10" */
  date: string;
  lunar: { day: number; month: number; year: number };
  /** Chuỗi ngày âm gốc, "1-1-2024" */
  lunarRaw: string;
  truc: string;
  nguHanh: string;
  ngayRatXau: boolean;
  saoTot: string[];
  saoXau: string[];
  nenLam: string[];
  khongNenLam: string[];
  /** Đủ 12 khung giờ kèm điểm */
  gio: LichVietGio[];
  /** Các giờ tốt nhất trong ngày */
  gioTotNhat: LichVietGio[];
  /** 4 giờ đại cát */
  bonGioDaiCat: LichVietDaiCat[];
  /** Giờ quý đăng thiên môn (Dương quý / Âm quý) */
  gioQuyDangThienMon: Array<{ index: number; chi: string; sao: string }>;
  /** Hướng tốt theo năm / tháng / ngày */
  huong: { nam: LichVietHuong[]; thang: LichVietHuong[]; ngay: LichVietHuong[] };
  /** Tuổi xung với ngày, ví dụ ["Mậu Ngọ", "Nhâm Ngọ"] */
  tuoiXung: string[];
  /** Điểm thô */
  diemRaw: number;
  /** Điểm 0–100 (phân vị trên toàn bộ tập dữ liệu) */
  diem: number;
  /** Xếp loại chất lượng ngày */
  chatLuong: ChatLuong;
}

export const LICH_VIET_META = {
  start: dict.meta.start,
  end: dict.meta.end,
  count: dict.meta.count,
  scoreMin: dict.meta.scoreMin,
  scoreMax: dict.meta.scoreMax,
} as const;

/** Nguồn dữ liệu */
export const LICH_VIET_SOURCE =
  'Trích xuất từ app Lịch Việt (com.somestudio.lichvietnam). Dùng cho mục đích cá nhân / tham khảo.';

export const QUALITY_LABEL: Record<ChatLuong, string> = {
  dep: 'Ngày đẹp',
  tot: 'Ngày tốt',
  bt: 'Bình thường',
  xau: 'Ngày xấu',
  ratxau: 'Ngày rất xấu',
};

export const QUALITY_ORDER: Record<ChatLuong, number> = {
  ratxau: 0,
  xau: 1,
  bt: 2,
  tot: 3,
  dep: 4,
};

/* ------------------------------------------------------------------ */
/* Giải mã                                                             */
/* ------------------------------------------------------------------ */

function decodeHuong(list: Array<[number, number, number]>): LichVietHuong[] {
  return list.map(([s, soSao, h]) => ({ son: dict.son[s], soSao, huong: dict.huong[h] }));
}

export function decodeDay(iso: string, r: RawDay): LichVietDay {
  // r.l có dạng "dd-mm-yyyy" (ví dụ "20-11-2023" = 20 tháng Mười Một 2023)
  const [ld, lm, ly] = r.l.split('-').map(Number);
  const gio: LichVietGio[] = r.h.map(([g, diem, sao]) => ({
    index: g,
    chi: CHI[g] ?? String(g),
    diem,
    sao: sao.map((i) => dict.gioSao[i]),
    top: false,
  }));
  const topIndex = new Set(r.g.map(([g]) => g));
  for (const g of gio) {
    g.top = topIndex.has(g.index);
  }

  return {
    date: iso,
    lunar: { day: ld, month: lm, year: ly },
    lunarRaw: r.l,
    truc: dict.truc[r.t] ?? TRUC[r.t] ?? '',
    nguHanh: dict.nguHanh[r.n] ?? NGU_HANH[r.n] ?? '',
    ngayRatXau: r.x === 1,
    saoTot: r.a.map((i) => dict.sao[i]),
    saoXau: r.b.map((i) => dict.sao[i]),
    nenLam: r.y.map((i) => dict.viec[i]),
    khongNenLam: r.z.map((i) => dict.viec[i]),
    gio,
    gioTotNhat: r.g.map(([g, diem]) => ({
      index: g,
      chi: CHI[g] ?? String(g),
      diem,
      sao: (r.h.find((x) => x[0] === g)?.[2] ?? []).map((i) => dict.gioSao[i]),
      top: true,
    })),
    bonGioDaiCat: r.d.map(([g, sao, goc]) => ({
      index: g,
      chi: CHI[g] ?? String(g),
      sao: dict.than[sao] ?? '',
      gioGoc: dict.than[goc] ?? '',
    })),
    gioQuyDangThienMon: r.q.map(([g, sao]) => ({
      index: g,
      chi: CHI[g] ?? String(g),
      sao: dict.than[sao] ?? '',
    })),
    huong: {
      nam: decodeHuong(r.p.nam),
      thang: decodeHuong(r.p.thang),
      ngay: decodeHuong(r.p.ngay),
    },
    tuoiXung: r.u.map(([c, z]) => `${CAN_NAMES[c] ?? ''} ${CHI[z] ?? ''}`.trim()),
    diemRaw: r.s,
    diem: r.e,
    chatLuong: (dict.chatLuong[r.k] ?? 'bt') as ChatLuong,
  };
}

/** Bỏ dấu tiếng Việt để so khớp tìm kiếm */
export function normalizeVi(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

/* ------------------------------------------------------------------ */
/* Từ vựng                                                             */
/* ------------------------------------------------------------------ */

/** Danh sách việc có trong dữ liệu */
export function listActivities(): string[] {
  return [...dict.viec].sort((a, b) => a.localeCompare(b, 'vi'));
}

/** Danh sách nhóm việc */
export function listActivityGroups(): string[] {
  return [...dict.nhom];
}

/** Tìm tên việc gần đúng (bỏ dấu, khớp một phần) */
export function findActivities(keyword: string): string[] {
  const k = normalizeVi(keyword);
  return dict.viec.filter((v) => normalizeVi(v).includes(k)).sort((a, b) => a.localeCompare(b, 'vi'));
}

/* ------------------------------------------------------------------ */
/* Tra cứu dùng chung (nhận nguồn ngày từ bên ngoài)                   */
/* ------------------------------------------------------------------ */

export type DayLookup = (iso: string) => LichVietDay | null;

export interface FindGoodDaysOptions {
  /** Tên việc, ví dụ "Thành hôn", "Khai trương", "Động thổ" */
  activity: string;
  /** Từ ngày "YYYY-MM-DD" */
  from?: string;
  /** Đến ngày "YYYY-MM-DD" */
  to?: string;
  /** Chỉ lấy ngày có chất lượng tối thiểu */
  minQuality?: ChatLuong;
  /** Số kết quả tối đa (mặc định 30) */
  limit?: number;
  /** Bỏ qua ngày rất xấu */
  excludeVeryBad?: boolean;
}

/**
 * Tìm ngày phù hợp cho một việc, trên một danh sách ngày cho trước.
 *
 * Dùng thẳng dữ liệu gốc: việc đó có nằm trong nhóm "Nên làm" của ngày hay không,
 * KHÔNG suy diễn thêm. Kết quả xếp theo điểm ngày giảm dần.
 */
export function findGoodDaysIn(
  keys: string[],
  lookup: DayLookup,
  options: FindGoodDaysOptions,
): LichVietDay[] {
  const { activity, from, to, minQuality, limit = 30, excludeVeryBad = false } = options;
  const target = normalizeVi(activity);
  const minQ = minQuality ? QUALITY_ORDER[minQuality] : -1;
  const out: LichVietDay[] = [];

  for (const iso of keys) {
    if (from && iso < from) continue;
    if (to && iso > to) continue;
    const day = lookup(iso);
    if (!day) continue;
    if (excludeVeryBad && day.ngayRatXau) continue;
    if (minQ >= 0 && QUALITY_ORDER[day.chatLuong] < minQ) continue;
    if (!day.nenLam.some((a) => normalizeVi(a) === target)) continue;
    out.push(day);
  }

  out.sort((a, b) => b.diem - a.diem || a.date.localeCompare(b.date));
  return out.slice(0, limit);
}

/** Ngày đẹp nhất trong một khoảng */
export function topDaysIn(
  keys: string[],
  lookup: DayLookup,
  from?: string,
  to?: string,
  limit = 10,
): LichVietDay[] {
  const out: LichVietDay[] = [];
  for (const iso of keys) {
    if (from && iso < from) continue;
    if (to && iso > to) continue;
    const day = lookup(iso);
    if (day) out.push(day);
  }
  out.sort((a, b) => b.diem - a.diem || a.date.localeCompare(b.date));
  return out.slice(0, limit);
}

/** Thống kê chất lượng ngày trong một khoảng */
export function qualityStatsIn(
  keys: string[],
  lookup: DayLookup,
  from?: string,
  to?: string,
): Record<ChatLuong, number> & { total: number; avgDiem: number } {
  const stats = { dep: 0, tot: 0, bt: 0, xau: 0, ratxau: 0, total: 0, avgDiem: 0 };
  let sum = 0;
  for (const iso of keys) {
    if (from && iso < from) continue;
    if (to && iso > to) continue;
    const day = lookup(iso);
    if (!day) continue;
    stats[day.chatLuong] += 1;
    stats.total += 1;
    sum += day.diem;
  }
  stats.avgDiem = stats.total ? Math.round((sum / stats.total) * 10) / 10 : 0;
  return stats;
}

export interface DayStore {
  keys: string[];
  lookup: DayLookup;
  has: (iso: string) => boolean;
  /** Danh sách ngày đã giải mã, sắp xếp tăng dần */
  all: () => LichVietDay[];
}

/** Tạo bộ tra cứu + danh sách ngày từ một hoặc nhiều payload năm */
export function createStore(years: RawYear[]): DayStore {
  const map = new Map<string, RawDay>();
  for (const y of years) {
    for (const iso of Object.keys(y.days)) {
      map.set(iso, y.days[iso]);
    }
  }
  const keys = [...map.keys()].sort();
  const cache = new Map<string, LichVietDay>();
  const lookup: DayLookup = (iso) => {
    const hit = cache.get(iso);
    if (hit) return hit;
    const raw = map.get(iso);
    if (!raw) return null;
    const decoded = decodeDay(iso, raw);
    cache.set(iso, decoded);
    return decoded;
  };
  return {
    keys,
    lookup,
    has: (iso: string) => map.has(iso),
    all: () => keys.map((k) => lookup(k) as LichVietDay),
  };
}

/** Chuẩn hoá ngày thành "YYYY-MM-DD" */
export function toIso(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
