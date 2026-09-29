/**
 * Can Chi: năm, tháng, ngày, giờ — kèm Nạp Âm (ngũ hành) và con giáp.
 */
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
/** Chỉ số 0–59 trong vòng 60 hoa giáp, từ cặp (can, chi) */
export declare function canChiIndex(canIndex: number, chiIndex: number): number;
/** Can Chi của năm âm lịch */
export declare function getCanChiYear(lunarYear: number): CanChi;
/** Can Chi của ngày, suy từ số ngày Julian */
export declare function getCanChiDay(jd: number): CanChi;
/**
 * Can Chi của tháng âm lịch (theo Ngũ Hổ Độn).
 *
 * Tháng 1 (Dần) của năm Giáp/Kỷ là Bính Dần, Ất/Canh là Mậu Dần,
 * Bính/Tân là Canh Dần, Đinh/Nhâm là Nhâm Dần, Mậu/Quý là Giáp Dần.
 */
export declare function getCanChiMonth(lunarMonth: number, lunarYear: number): CanChi;
/**
 * Can Chi của giờ (theo Ngũ Thử Độn).
 *
 * @param dayCanIndex chỉ số can của ngày (0 = Giáp)
 * @param hourChiIndex chỉ số chi của giờ (0 = Tý)
 */
export declare function getCanChiHour(dayCanIndex: number, hourChiIndex: number): CanChi;
/** Nạp âm của một cặp can chi */
export declare function getNapAm(canIndex: number, chiIndex: number): NapAm;
/** Ngũ hành của nạp âm ngày (dạng số 1..5 đúng quy ước Lịch Việt) */
export declare function getNguHanhId(element: string): number;
/** Con giáp của năm âm lịch */
export declare function getConGiap(lunarYear: number): string;
