/**
 * Tiết khí (24 tiết) và "tháng tiết khí" (Kiến tháng) dùng cho Trực.
 */
/**
 * Cung 15° của kinh độ mặt trời, giá trị 0..23. `arc * 15°` là kinh độ mặt trời; 0 = Xuân phân.
 *
 * Lấy tại **cuối ngày địa phương**, tức tiết khí đang hiệu lực lúc 24:00.
 * Tiết khí được ấn định cho ngày mà thời điểm giao tiết rơi vào, chứ không phải
 * theo vị trí mặt trời lúc 00:00 — nếu lấy mốc đầu ngày thì những tiết giao vào
 * buổi sáng/tối sẽ bị lùi sang hôm sau (sai 96 ngày trên dữ liệu đối chiếu).
 */
export declare function getSunArc(jd: number, timeZone?: number): number;
export interface TietKhi {
    /** id 1..24, theo quy ước: 1 = Xuân phân, 19 = Đông chí */
    id: number;
    name: string;
    /** Kinh độ mặt trời tại điểm bắt đầu tiết (độ) */
    longitude: number;
    /** Ngày dương lịch bắt đầu tiết này */
    start: {
        day: number;
        month: number;
        year: number;
    };
    /** JD của ngày bắt đầu tiết */
    startJd: number;
}
/** Tiết khí của một ngày (theo JD) */
export declare function getTietKhi(jd: number, timeZone?: number): TietKhi;
/**
 * Chi của "tháng tiết khí" (Kiến tháng) — dùng để tính Trực.
 *
 * Lập xuân → Dần, Kinh trập → Mão, Thanh minh → Thìn, …
 * Trả về chỉ số địa chi 0..11 (0 = Tý).
 */
export declare function getTietKhiMonthChi(jd: number, timeZone?: number): number;
/** Danh sách 24 tiết khí của một năm dương lịch, kèm ngày bắt đầu */
export declare function getTietKhiOfYear(year: number, timeZone?: number): TietKhi[];
/** JD của ngày sóc gần nhất trước hoặc bằng `jd` */
export declare function getMonthStart(jd: number, timeZone?: number): number;
