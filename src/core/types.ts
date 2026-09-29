/** Kiểu dữ liệu dùng chung */

import type { CanChi, NapAm } from './canchi';
import type { GioInfo, TrucInfo } from './truc';
import type { HuongXuatHanh } from './huong';
import type { TietKhi } from './tietkhi';
import type { LunarDate } from './lunar';

/** Ngày dương lịch */
export interface SolarDateInfo {
  day: number;
  month: number;
  year: number;
  /** 0 = Chủ nhật … 6 = Thứ bảy */
  weekday: number;
  /** "Chủ nhật" … */
  weekdayName: string;
  /** "2024-02-10" */
  iso: string;
}

/** Ngày âm lịch kèm tên tháng */
export interface LunarDateInfo extends LunarDate {
  /** "tháng Giêng", "tháng Chạp" */
  monthName: string;
  /** "tháng Sáu nhuận" nếu là tháng nhuận */
  monthNameFull: string;
  /** "20/11/2023" */
  text: string;
  /** "Quý Mão" — chỉ có khi đi kèm can chi năm */
  canChiYearName?: string;
}

/** Thông tin đầy đủ của một ngày */
export interface LunarDayInfo {
  jd: number;
  solar: SolarDateInfo;
  lunar: LunarDateInfo;
  canChi: {
    year: CanChi;
    month: CanChi;
    day: CanChi;
  };
  /** Con giáp của năm âm, ví dụ "Rồng" */
  conGiap: string;
  /** Nạp âm (ngũ hành) của năm / tháng / ngày */
  napAm: {
    year: NapAm;
    month: NapAm;
    day: NapAm;
  };
  /** Ngũ hành của ngày, dạng chữ: Kim | Mộc | Thủy | Hỏa | Thổ */
  nguHanh: string;
  /** Ngũ hành của ngày, dạng số đúng quy ước Lịch Việt: 1=Kim 2=Mộc 3=Thủy 4=Hỏa 5=Thổ */
  nguHanhId: number;
  tietKhi: TietKhi;
  truc: TrucInfo;
  /** Đủ 12 khung giờ trong ngày */
  gio: GioInfo[];
  /** Chỉ 6 giờ hoàng đạo */
  gioHoangDao: GioInfo[];
  /** Hướng xuất hành (Hỷ thần / Tài thần / Hạc thần) */
  huongXuatHanh: HuongXuatHanh;
}

/** Ngày có thể truyền vào API */
export type DateInput =
  | Date
  | string
  | number
  | { day: number; month: number; year: number };
