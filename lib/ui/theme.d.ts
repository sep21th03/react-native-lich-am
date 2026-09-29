/** Bảng màu & kích thước cho các component lịch */
export interface LunarTheme {
    /** Nền tổng thể */
    bg: string;
    /** Nền thẻ */
    card: string;
    /** Màu chữ chính */
    text: string;
    /** Màu chữ phụ */
    subtext: string;
    /** Màu chữ mờ */
    muted: string;
    /** Viền */
    border: string;
    /** Màu nhấn (đỏ lễ hội) */
    primary: string;
    /** Chữ trên nền nhấn */
    primaryText: string;
    /** Ngày cuối tuần */
    weekend: string;
    /** Ngày âm mùng 1 */
    firstDayOfMonth: string;
    /** Nền ô đang chọn */
    selectedBg: string;
    /** Viền ô hôm nay */
    todayBorder: string;
    /** Màu chất lượng ngày */
    quality: {
        dep: string;
        tot: string;
        bt: string;
        xau: string;
        ratxau: string;
    };
    /** Bo góc */
    radius: number;
    /** Cỡ chữ ngày dương */
    solarFontSize: number;
    /** Cỡ chữ ngày âm */
    lunarFontSize: number;
}
export declare const lightTheme: LunarTheme;
export declare const darkTheme: LunarTheme;
/** Gộp theme nền với các ghi đè của người dùng */
export declare function createTheme(base: LunarTheme, overrides?: Partial<LunarTheme>): LunarTheme;
export declare const defaultTheme: LunarTheme;
