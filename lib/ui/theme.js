"use strict";
/** Bảng màu & kích thước cho các component lịch */
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultTheme = exports.createTheme = exports.darkTheme = exports.lightTheme = void 0;
exports.lightTheme = {
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
exports.darkTheme = {
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
function createTheme(base, overrides) {
    if (!overrides)
        return base;
    return Object.assign(Object.assign(Object.assign({}, base), overrides), { quality: Object.assign(Object.assign({}, base.quality), (overrides.quality || {})) });
}
exports.createTheme = createTheme;
exports.defaultTheme = exports.lightTheme;
