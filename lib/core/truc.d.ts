/**
 * Trực (Thập nhị kiến trừ) và 12 giờ hoàng đạo.
 *
 * Quy luật Trực đã được kiểm chứng khớp 1.462/1.462 ngày dữ liệu Lịch Việt:
 * Trực = (chi ngày − chi tháng tiết khí) mod 12, tra vào 12 Trực bắt đầu từ Kiến.
 *
 * Bảng giờ hoàng đạo sinh từ công thức `(2 × chi ngày + 8) mod 12`
 * khớp đúng bảng cổ điển (Tý–Ngọ: Tý Sửu Mão Ngọ Thân Dậu; …).
 */
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
export declare function getTruc(jd: number, dayChiIndex: number, timeZone?: number): TrucInfo;
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
/** Vị trí thần hoàng đạo tại giờ Tý, suy từ chi ngày */
export declare function getThanOffset(dayChiIndex: number): number;
/** Thần cai quản một giờ */
export declare function getThanOfHour(dayChiIndex: number, hourIndex: number): string;
/** Có phải giờ hoàng đạo hay không */
export declare function isHoangDaoHour(dayChiIndex: number, hourIndex: number): boolean;
/** Đầy đủ 12 khung giờ trong ngày kèm thông tin hoàng đạo */
export declare function getGioInDay(dayChiIndex: number): GioInfo[];
/** Danh sách chỉ số 6 giờ hoàng đạo trong ngày */
export declare function getHoangDaoHours(dayChiIndex: number): number[];
