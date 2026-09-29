/**
 * Giải mã bộ dữ liệu Lịch Việt (bản nén) + các hàm tra cứu dùng chung.
 *
 * File này KHÔNG nạp dữ liệu năm nào — nhờ vậy các entry point theo từng năm
 * (`react-native-lich-am/dataset/2024`) chỉ kéo theo đúng dữ liệu của năm đó.
 */
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
    meta: {
        start: string;
        end: string;
        count: number;
        scoreMin: number;
        scoreMax: number;
    };
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
export declare const dict: RawDict;
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
    /**
     * Nguồn gốc của khung giờ này:
     * - `nguon`  — nguyên vẹn như dữ liệu gốc
     * - `sua`    — dữ liệu gốc sai, đã tính lại theo luật cổ điển
     * - `suy-ra` — dữ liệu gốc bỏ trống, đã dựng lại
     */
    nguon: 'nguon' | 'sua' | 'suy-ra';
}
/**
 * Một khung giờ theo thang điểm riêng của app Lịch Việt.
 * Dùng cho `gioTotNhat` — điểm ở đây KHÁC `gio[].diem` (thang của thư viện).
 */
export interface LichVietGioTomTat {
    index: number;
    chi: string;
    /** Điểm theo thang riêng của app, không so được với `gio[].diem` */
    diem: number;
    sao: string[];
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
    lunar: {
        day: number;
        month: number;
        year: number;
    };
    /** Chuỗi ngày âm gốc, "1-1-2024" */
    lunarRaw: string;
    truc: string;
    nguHanh: string;
    ngayRatXau: boolean;
    saoTot: string[];
    saoXau: string[];
    nenLam: string[];
    khongNenLam: string[];
    /** Đủ 12 khung giờ, đã lấp ô thiếu và sửa ô sai của nguồn */
    gio: LichVietGio[];
    /** Khung giờ nguyên bản của nguồn (11 hoặc 12 phần tử, có thể chứa lỗi) */
    gioRaw: LichVietGio[];
    /** Các giờ tốt nhất trong ngày, theo thang điểm riêng của app */
    gioTotNhat: LichVietGioTomTat[];
    /** 4 giờ đại cát */
    bonGioDaiCat: LichVietDaiCat[];
    /** Giờ quý đăng thiên môn (Dương quý / Âm quý) */
    gioQuyDangThienMon: Array<{
        index: number;
        chi: string;
        sao: string;
    }>;
    /** Hướng tốt theo năm / tháng / ngày */
    huong: {
        nam: LichVietHuong[];
        thang: LichVietHuong[];
        ngay: LichVietHuong[];
    };
    /** Tuổi xung với ngày, ví dụ ["Mậu Ngọ", "Nhâm Ngọ"] */
    tuoiXung: string[];
    /** Điểm thô */
    diemRaw: number;
    /** Điểm 0–100 (phân vị trên toàn bộ tập dữ liệu) */
    diem: number;
    /** Xếp loại chất lượng ngày */
    chatLuong: ChatLuong;
}
export declare const LICH_VIET_META: {
    readonly start: string;
    readonly end: string;
    readonly count: number;
    readonly scoreMin: number;
    readonly scoreMax: number;
};
/** Nguồn dữ liệu */
export declare const LICH_VIET_SOURCE = "Tr\u00EDch xu\u1EA5t t\u1EEB app L\u1ECBch Vi\u1EC7t (com.somestudio.lichvietnam). D\u00F9ng cho m\u1EE5c \u0111\u00EDch c\u00E1 nh\u00E2n / tham kh\u1EA3o.";
export declare const QUALITY_LABEL: Record<ChatLuong, string>;
export declare const QUALITY_ORDER: Record<ChatLuong, number>;
export declare function decodeDay(iso: string, r: RawDay): LichVietDay;
/** Bỏ dấu tiếng Việt để so khớp tìm kiếm */
export declare function normalizeVi(s: string): string;
/** Danh sách việc có trong dữ liệu */
export declare function listActivities(): string[];
/** Danh sách nhóm việc */
export declare function listActivityGroups(): string[];
/** Tìm tên việc gần đúng (bỏ dấu, khớp một phần) */
export declare function findActivities(keyword: string): string[];
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
export declare function findGoodDaysIn(keys: string[], lookup: DayLookup, options: FindGoodDaysOptions): LichVietDay[];
/** Ngày đẹp nhất trong một khoảng */
export declare function topDaysIn(keys: string[], lookup: DayLookup, from?: string, to?: string, limit?: number): LichVietDay[];
/** Thống kê chất lượng ngày trong một khoảng */
export declare function qualityStatsIn(keys: string[], lookup: DayLookup, from?: string, to?: string): Record<ChatLuong, number> & {
    total: number;
    avgDiem: number;
};
export interface DayStore {
    keys: string[];
    lookup: DayLookup;
    has: (iso: string) => boolean;
    /** Danh sách ngày đã giải mã, sắp xếp tăng dần */
    all: () => LichVietDay[];
}
/** Tạo bộ tra cứu + danh sách ngày từ một hoặc nhiều payload năm */
export declare function createStore(years: RawYear[]): DayStore;
/** Chuẩn hoá ngày thành "YYYY-MM-DD" */
export declare function toIso(year: number, month: number, day: number): string;
