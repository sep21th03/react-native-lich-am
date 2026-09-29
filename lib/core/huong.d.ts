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
/** Hướng xuất hành của ngày, suy từ can ngày */
export declare function getHuongXuatHanh(canIndex: number, canName: string): HuongXuatHanh;
/** Toạ độ la bàn (độ, 0 = Chính Bắc, thuận chiều kim đồng hồ) của 8 hướng */
export declare const HUONG_DEGREE: Record<string, number>;
