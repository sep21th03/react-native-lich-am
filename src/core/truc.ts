/**
 * Trực (Thập nhị kiến trừ) và 12 giờ hoàng đạo.
 *
 * Quy luật Trực đã được kiểm chứng khớp 1.462/1.462 ngày dữ liệu Lịch Việt:
 * Trực = (chi ngày − chi tháng tiết khí) mod 12, tra vào 12 Trực bắt đầu từ Kiến.
 *
 * Bảng giờ hoàng đạo sinh từ công thức `(2 × chi ngày + 8) mod 12`
 * khớp đúng bảng cổ điển (Tý–Ngọ: Tý Sửu Mão Ngọ Thân Dậu; …).
 */

import { CHI, THAN_12, THAN_12_TOT, TRUC, TZ_VN } from './constants';
import { getTietKhiMonthChi } from './tietkhi';

export interface TrucInfo {
  /** Chỉ số 0..11, 0 = Kiến */
  index: number;
  /** Tên Trực */
  name: string;
  /** Chi tháng tiết khí dùng để tính */
  monthChiIndex: number;
  /** Chi ngày */
  dayChiIndex: number;
}

/** Trực của ngày */
export function getTruc(jd: number, dayChiIndex: number, timeZone: number = TZ_VN): TrucInfo {
  const monthChiIndex = getTietKhiMonthChi(jd, timeZone);
  const index = (((dayChiIndex - monthChiIndex) % 12) + 12) % 12;
  return { index, name: TRUC[index], monthChiIndex, dayChiIndex };
}

export interface GioInfo {
  /** Chỉ số địa chi của giờ, 0 = Tý */
  index: number;
  /** Tên chi, ví dụ "Tý" */
  chi: string;
  /** Khung giờ thực, ví dụ "23:00 – 00:59" */
  range: string;
  /** Giờ bắt đầu (0..23) */
  startHour: number;
  /** Giờ kết thúc (0..23) */
  endHour: number;
  /** Thần cai quản giờ này */
  than: string;
  /** Có phải giờ hoàng đạo (giờ tốt) */
  hoangDao: boolean;
}

const GIO_LABEL = [
  '23:00 – 00:59', '01:00 – 02:59', '03:00 – 04:59', '05:00 – 06:59',
  '07:00 – 08:59', '09:00 – 10:59', '11:00 – 12:59', '13:00 – 14:59',
  '15:00 – 16:59', '17:00 – 18:59', '19:00 – 20:59', '21:00 – 22:59',
];

const GIO_START = [23, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];

/** Vị trí thần hoàng đạo tại giờ Tý, suy từ chi ngày */
export function getThanOffset(dayChiIndex: number): number {
  return (((2 * dayChiIndex + 8) % 12) + 12) % 12;
}

/** Thần cai quản một giờ */
export function getThanOfHour(dayChiIndex: number, hourIndex: number): string {
  const offset = getThanOffset(dayChiIndex);
  const idx = (((hourIndex - offset) % 12) + 12) % 12;
  return THAN_12[idx];
}

/** Có phải giờ hoàng đạo hay không */
export function isHoangDaoHour(dayChiIndex: number, hourIndex: number): boolean {
  const offset = getThanOffset(dayChiIndex);
  const idx = (((hourIndex - offset) % 12) + 12) % 12;
  return (THAN_12_TOT as readonly number[]).indexOf(idx) >= 0;
}

/** Đầy đủ 12 khung giờ trong ngày kèm thông tin hoàng đạo */
export function getGioInDay(dayChiIndex: number): GioInfo[] {
  return GIO_LABEL.map((range, i) => ({
    index: i,
    chi: CHI[i],
    range,
    startHour: GIO_START[i],
    endHour: (GIO_START[i] + 1) % 24,
    than: getThanOfHour(dayChiIndex, i),
    hoangDao: isHoangDaoHour(dayChiIndex, i),
  }));
}

/** Danh sách chỉ số 6 giờ hoàng đạo trong ngày */
export function getHoangDaoHours(dayChiIndex: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < 12; i += 1) {
    if (isHoangDaoHour(dayChiIndex, i)) {
      out.push(i);
    }
  }
  return out;
}
