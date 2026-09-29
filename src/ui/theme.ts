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

export const lightTheme: LunarTheme = {
  bg: '#FFFFFF',
  card: '#FFFFFF',
  text: '#111827',
  subtext: '#6B7280',
  muted: '#9CA3AF',
  border: '#E5E7EB',
  primary: '#DC2626',
  primaryText: '#FFFFFF',
  weekend: '#DC2626',
  firstDayOfMonth: '#DC2626',
  selectedBg: '#FEE2E2',
  todayBorder: '#DC2626',
  quality: {
    dep: '#16A34A',
    tot: '#4ADE80',
    bt: '#D1D5DB',
    xau: '#FB923C',
    ratxau: '#EF4444',
  },
  radius: 12,
  solarFontSize: 16,
  lunarFontSize: 10,
};

export const darkTheme: LunarTheme = {
  bg: '#0B0B0F',
  card: '#16161D',
  text: '#F9FAFB',
  subtext: '#9CA3AF',
  muted: '#6B7280',
  border: '#27272A',
  primary: '#EF4444',
  primaryText: '#FFFFFF',
  weekend: '#F87171',
  firstDayOfMonth: '#F87171',
  selectedBg: '#3F1D1D',
  todayBorder: '#EF4444',
  quality: {
    dep: '#22C55E',
    tot: '#4ADE80',
    bt: '#3F3F46',
    xau: '#FB923C',
    ratxau: '#EF4444',
  },
  radius: 12,
  solarFontSize: 16,
  lunarFontSize: 10,
};

/** Gộp theme nền với các ghi đè của người dùng */
export function createTheme(
  base: LunarTheme,
  overrides?: Partial<LunarTheme>,
): LunarTheme {
  if (!overrides) return base;
  return {
    ...base,
    ...overrides,
    quality: { ...base.quality, ...(overrides.quality || {}) },
  };
}

export const defaultTheme = lightTheme;
