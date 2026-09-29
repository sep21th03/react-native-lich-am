/**
 * Can Chi: năm, tháng, ngày, giờ — kèm Nạp Âm (ngũ hành) và con giáp.
 */

import { CAN, CHI, CON_GIAP, NAP_AM, NGU_HANH } from './constants';

export interface CanChi {
  /** Chỉ số 0–9 của thiên can */
  canIndex: number;
  /** Chỉ số 0–11 của địa chi */
  chiIndex: number;
  /** Chuỗi ghép, ví dụ "Giáp Tý" */
  name: string;
  /** Can */
  can: string;
  /** Chi */
  chi: string;
}

export interface NapAm {
  /** Tên nạp âm, ví dụ "Hải Trung Kim" */
  name: string;
  /** Ngũ hành: Kim | Mộc | Thủy | Hỏa | Thổ */
  element: string;
}

function build(canIndex: number, chiIndex: number): CanChi {
  const c = ((canIndex % 10) + 10) % 10;
  const z = ((chiIndex % 12) + 12) % 12;
  return { canIndex: c, chiIndex: z, can: CAN[c], chi: CHI[z], name: `${CAN[c]} ${CHI[z]}` };
}

/** Chỉ số 0–59 trong vòng 60 hoa giáp, từ cặp (can, chi) */
export function canChiIndex(canIndex: number, chiIndex: number): number {
  const c = ((canIndex % 10) + 10) % 10;
  const z = ((chiIndex % 12) + 12) % 12;
  for (let i = 0; i < 60; i += 1) {
    if (i % 10 === c && i % 12 === z) {
      return i;
    }
  }
  return 0;
}

/** Can Chi của năm âm lịch */
export function getCanChiYear(lunarYear: number): CanChi {
  return build(lunarYear - 4, lunarYear - 4);
}

/** Can Chi của ngày, suy từ số ngày Julian */
export function getCanChiDay(jd: number): CanChi {
  const idx = (((jd + 49) % 60) + 60) % 60;
  return build(idx % 10, idx % 12);
}

/**
 * Can Chi của tháng âm lịch (theo Ngũ Hổ Độn).
 *
 * Tháng 1 (Dần) của năm Giáp/Kỷ là Bính Dần, Ất/Canh là Mậu Dần,
 * Bính/Tân là Canh Dần, Đinh/Nhâm là Nhâm Dần, Mậu/Quý là Giáp Dần.
 */
export function getCanChiMonth(lunarMonth: number, lunarYear: number): CanChi {
  const yearCan = (((lunarYear - 4) % 10) + 10) % 10;
  const canThang1 = (yearCan % 5) * 2 + 2; // can của tháng Dần
  const offset = lunarMonth - 1;
  return build(canThang1 + offset, 2 + offset);
}

/**
 * Can Chi của giờ (theo Ngũ Thử Độn).
 *
 * @param dayCanIndex chỉ số can của ngày (0 = Giáp)
 * @param hourChiIndex chỉ số chi của giờ (0 = Tý)
 */
export function getCanChiHour(dayCanIndex: number, hourChiIndex: number): CanChi {
  const can = (((dayCanIndex % 5) * 2 + hourChiIndex) % 10 + 10) % 10;
  return build(can, hourChiIndex);
}

/** Nạp âm của một cặp can chi */
export function getNapAm(canIndex: number, chiIndex: number): NapAm {
  const idx = canChiIndex(canIndex, chiIndex);
  const [name, element] = NAP_AM[idx];
  return { name, element };
}

/** Ngũ hành của nạp âm ngày (dạng số 1..5 đúng quy ước Lịch Việt) */
export function getNguHanhId(element: string): number {
  const i = (NGU_HANH as readonly string[]).indexOf(element);
  return i > 0 ? i : 0;
}

/** Con giáp của năm âm lịch */
export function getConGiap(lunarYear: number): string {
  const chi = (((lunarYear - 4) % 12) + 12) % 12;
  return CON_GIAP[chi];
}
