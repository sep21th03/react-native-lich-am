/**
 * Hướng xuất hành theo bảng Ngọc Hạp Thông Thư.
 *
 * Bảng đối xứng theo cặp Can ngày:
 *   Giáp / Kỷ  → Hỷ: Đông Bắc  · Tài: Đông Bắc  · Hạc: Đông Nam
 *   Ất   / Canh→ Hỷ: Tây Bắc   · Tài: Đông Nam  · Hạc: Đông Nam
 *   Bính / Tân → Hỷ: Tây Nam   · Tài: Tây       · Hạc: Đông
 *   Đinh / Nhâm→ Hỷ: Nam       · Tài: Tây Nam   · Hạc: Đông
 *   Mậu  / Quý → Hỷ: Đông Nam  · Tài: Bắc       · Hạc: Trung cung
 */

export interface HuongXuatHanh {
  /** Can của ngày (0 = Giáp) */
  canIndex: number;
  /** Tên can */
  can: string;
  /** Hướng Hỷ thần — gặp việc vui, cưới hỏi, gặp gỡ */
  hyThan: string;
  /** Hướng Tài thần — cầu tài, khai trương, đàm phán */
  taiThan: string;
  /** Hướng Hạc thần — đại kỵ, nên tránh */
  hacThan: string;
}

const HY = ['Đông Bắc', 'Tây Bắc', 'Tây Nam', 'Nam', 'Đông Nam'];
const TAI = ['Đông Bắc', 'Đông Nam', 'Tây', 'Tây Nam', 'Bắc'];
const HAC = ['Đông Nam', 'Đông Nam', 'Đông', 'Đông', 'Trung cung'];

/** Hướng xuất hành của ngày, suy từ can ngày */
export function getHuongXuatHanh(canIndex: number, canName: string): HuongXuatHanh {
  const g = (((canIndex % 10) + 10) % 10) % 5;
  return {
    canIndex: (((canIndex % 10) + 10) % 10),
    can: canName,
    hyThan: HY[g],
    taiThan: TAI[g],
    hacThan: HAC[g],
  };
}

/** Toạ độ la bàn (độ, 0 = Chính Bắc, thuận chiều kim đồng hồ) của 8 hướng */
export const HUONG_DEGREE: Record<string, number> = {
  'Chính Bắc': 0,
  'Đông Bắc': 45,
  'Chính Đông': 90,
  'Đông Nam': 135,
  'Chính Nam': 180,
  'Tây Nam': 225,
  'Chính Tây': 270,
  'Tây Bắc': 315,
  Bắc: 0,
  Đông: 90,
  Nam: 180,
  Tây: 270,
  'Trung cung': -1,
};
