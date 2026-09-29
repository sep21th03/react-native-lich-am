"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LunarCalendar = void 0;
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const astro_1 = require("../core/astro");
const format_1 = require("../core/format");
const day_1 = require("../core/day");
const theme_1 = require("./theme");
const WEEK_LABELS_VI = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const WEEK_LABELS_EN = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_LABELS_EN = [
    '', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];
function daysInSolarMonth(month, year) {
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    return (0, astro_1.jdFromDate)(1, nextMonth, nextYear) - (0, astro_1.jdFromDate)(1, month, year);
}
function todayJd() {
    const now = new Date();
    return (0, astro_1.jdFromDate)(now.getDate(), now.getMonth() + 1, now.getFullYear());
}
/**
 * Lịch tháng dương–âm cho React Native.
 *
 * Chỉ dùng component gốc của React Native (View / Text / Pressable), không cần
 * thư viện ngoài, không cần native module.
 *
 * @example
 * import { LunarCalendar } from 'react-native-lich-am/ui';
 * import { getDayData } from 'react-native-lich-am/dataset';
 *
 * <LunarCalendar dayDataProvider={getDayData} onSelectDay={(d) => console.log(d)} />
 */
function LunarCalendar(props) {
    const { value, initialDate, onSelectDay, onMonthChange, dayDataProvider, theme: themeOverride, colorScheme = 'light', weekStartsOn = 1, showLunar = true, showLegend, showTodayButton = true, showLunarHeader = true, locale = 'vi', style, } = props;
    const theme = React.useMemo(() => (0, theme_1.createTheme)(colorScheme === 'dark' ? theme_1.darkTheme : theme_1.lightTheme, themeOverride), [colorScheme, themeOverride]);
    const anchor = React.useMemo(() => {
        var _a;
        const src = (_a = value !== null && value !== void 0 ? value : initialDate) !== null && _a !== void 0 ? _a : new Date();
        return (0, day_1.resolveDate)(src);
    }, [value, initialDate]);
    const [view, setView] = React.useState({ month: anchor.month, year: anchor.year });
    const [selectedJd, setSelectedJd] = React.useState(anchor.jd);
    const [today] = React.useState(() => todayJd());
    // đồng bộ khi `value` đổi từ bên ngoài
    const lastValueRef = React.useRef(null);
    React.useEffect(() => {
        if (value === undefined)
            return;
        const r = (0, day_1.resolveDate)(value);
        if (lastValueRef.current !== r.jd) {
            lastValueRef.current = r.jd;
            setSelectedJd(r.jd);
            setView({ month: r.month, year: r.year });
        }
    }, [value]);
    const goMonth = React.useCallback((delta) => {
        setView((prev) => {
            let m = prev.month + delta;
            let y = prev.year;
            while (m < 1) {
                m += 12;
                y -= 1;
            }
            while (m > 12) {
                m -= 12;
                y += 1;
            }
            onMonthChange === null || onMonthChange === void 0 ? void 0 : onMonthChange(m, y);
            return { month: m, year: y };
        });
    }, [onMonthChange]);
    const goToday = React.useCallback(() => {
        const jd = todayJd();
        const [d, m, y] = (0, astro_1.jdToDate)(jd);
        setView({ month: m, year: y });
        setSelectedJd(jd);
        const info = (0, day_1.getLunarDayInfo)(jd);
        onSelectDay === null || onSelectDay === void 0 ? void 0 : onSelectDay(info, dayDataProvider ? dayDataProvider(info.solar.iso) : null);
        onMonthChange === null || onMonthChange === void 0 ? void 0 : onMonthChange(m, y);
    }, [dayDataProvider, onSelectDay, onMonthChange]);
    const handleSelect = React.useCallback((jd) => {
        setSelectedJd(jd);
        const info = (0, day_1.getLunarDayInfo)(jd);
        onSelectDay === null || onSelectDay === void 0 ? void 0 : onSelectDay(info, dayDataProvider ? dayDataProvider(info.solar.iso) : null);
    }, [dayDataProvider, onSelectDay]);
    const grid = React.useMemo(() => {
        const first = (0, astro_1.jdFromDate)(1, view.month, view.year);
        const total = daysInSolarMonth(view.month, view.year);
        const firstWeekday = (0, day_1.resolveDate)(first).weekday; // 0 = CN
        const offset = (firstWeekday - weekStartsOn + 7) % 7;
        const cells = [];
        for (let i = 0; i < offset; i += 1)
            cells.push(null);
        for (let i = 0; i < total; i += 1) {
            const jd = first + i;
            cells.push({ jd, info: (0, day_1.getLunarDayInfo)(jd) });
        }
        while (cells.length % 7 !== 0)
            cells.push(null);
        const rows = [];
        for (let i = 0; i < cells.length; i += 7)
            rows.push(cells.slice(i, i + 7));
        return rows;
    }, [view.month, view.year, weekStartsOn]);
    const lunarHeader = React.useMemo(() => {
        const firstJd = (0, astro_1.jdFromDate)(1, view.month, view.year);
        const info = (0, day_1.getLunarDayInfo)(firstJd);
        const leap = info.lunar.leap ? ' nhuận' : '';
        return locale === 'vi'
            ? `Tháng ${info.lunar.month}${leap} · ${info.canChi.year.name}`
            : `Lunar month ${info.lunar.month}${info.lunar.leap ? ' (leap)' : ''} · ${info.canChi.year.name}`;
    }, [view.month, view.year, locale]);
    const weekLabels = React.useMemo(() => {
        const base = locale === 'vi' ? WEEK_LABELS_VI : WEEK_LABELS_EN;
        return [...base.slice(weekStartsOn), ...base.slice(0, weekStartsOn)];
    }, [locale, weekStartsOn]);
    const title = locale === 'vi'
        ? `Tháng ${view.month}/${view.year}`
        : `${MONTH_LABELS_EN[view.month]} ${view.year}`;
    const legendOn = showLegend !== null && showLegend !== void 0 ? showLegend : !!dayDataProvider;
    return (React.createElement(react_native_1.View, { style: [styles.root, { backgroundColor: theme.card, borderRadius: theme.radius }, style] },
        React.createElement(react_native_1.View, { style: styles.header },
            React.createElement(react_native_1.Pressable, { onPress: () => goMonth(-1), style: [styles.navBtn, { borderColor: theme.border, borderRadius: theme.radius / 2 }], accessibilityLabel: locale === 'vi' ? 'Tháng trước' : 'Previous month' },
                React.createElement(react_native_1.Text, { style: [styles.navTxt, { color: theme.text }] }, "\u2039")),
            React.createElement(react_native_1.View, { style: styles.headerMid },
                React.createElement(react_native_1.Text, { style: [styles.title, { color: theme.text }] }, title),
                showLunarHeader ? (React.createElement(react_native_1.Text, { style: [styles.subtitle, { color: theme.primary }] }, lunarHeader)) : null),
            React.createElement(react_native_1.Pressable, { onPress: () => goMonth(1), style: [styles.navBtn, { borderColor: theme.border, borderRadius: theme.radius / 2 }], accessibilityLabel: locale === 'vi' ? 'Tháng sau' : 'Next month' },
                React.createElement(react_native_1.Text, { style: [styles.navTxt, { color: theme.text }] }, "\u203A"))),
        React.createElement(react_native_1.View, { style: styles.weekRow }, weekLabels.map((w, i) => (React.createElement(react_native_1.View, { key: `${w}-${i}`, style: styles.cellWrap },
            React.createElement(react_native_1.Text, { style: [styles.weekTxt, { color: theme.subtext }] }, w))))),
        React.createElement(react_native_1.View, null, grid.map((row, ri) => (React.createElement(react_native_1.View, { key: `row-${ri}`, style: styles.weekRow }, row.map((cell, ci) => {
            if (!cell) {
                return React.createElement(react_native_1.View, { key: `empty-${ri}-${ci}`, style: styles.cellWrap });
            }
            const { jd, info } = cell;
            const isSelected = jd === selectedJd;
            const isToday = jd === today;
            const weekend = info.solar.weekday === 0 || info.solar.weekday === 6;
            const data = dayDataProvider ? dayDataProvider(info.solar.iso) : null;
            const qualityColor = data ? theme.quality[data.chatLuong] : null;
            const showQualityBg = !!data && data.chatLuong !== 'bt';
            return (React.createElement(react_native_1.Pressable, { key: info.solar.iso, onPress: () => handleSelect(jd), style: styles.cellWrap, accessibilityRole: "button", accessibilityLabel: `${info.solar.day}/${info.solar.month}/${info.solar.year}, ${(0, format_1.getLunarDayName)(info.lunar.day)} tháng ${info.lunar.month}` },
                React.createElement(react_native_1.View, { style: [
                        styles.cell,
                        { borderRadius: theme.radius / 1.5, borderColor: 'transparent' },
                        showQualityBg && {
                            backgroundColor: qualityColor,
                            opacity: isSelected ? 1 : 0.85,
                        },
                        isSelected && { backgroundColor: theme.selectedBg },
                        isToday && { borderColor: theme.todayBorder, borderWidth: 1.5 },
                    ] },
                    React.createElement(react_native_1.Text, { style: [
                            styles.solarTxt,
                            {
                                color: showQualityBg && !isSelected ? theme.primaryText : theme.text,
                                fontSize: theme.solarFontSize,
                                fontWeight: isSelected || isToday ? '700' : '500',
                            },
                        ] }, info.solar.day),
                    showLunar ? (React.createElement(react_native_1.Text, { style: [
                            styles.lunarTxt,
                            {
                                color: showQualityBg && !isSelected
                                    ? theme.primaryText
                                    : info.lunar.day === 1
                                        ? theme.firstDayOfMonth
                                        : weekend
                                            ? theme.weekend
                                            : theme.subtext,
                                fontSize: theme.lunarFontSize,
                                fontWeight: info.lunar.day === 1 ? '700' : '400',
                            },
                        ], numberOfLines: 1 }, info.lunar.day === 1 ? `1/${info.lunar.month}` : info.lunar.day)) : null)));
        }))))),
        legendOn && dayDataProvider ? (React.createElement(react_native_1.View, { style: [styles.legend, { borderTopColor: theme.border }] }, [
            ['dep', locale === 'vi' ? 'Đẹp' : 'Great'],
            ['tot', locale === 'vi' ? 'Tốt' : 'Good'],
            ['bt', locale === 'vi' ? 'Bình thường' : 'Normal'],
            ['xau', locale === 'vi' ? 'Xấu' : 'Bad'],
            ['ratxau', locale === 'vi' ? 'Rất xấu' : 'Very bad'],
        ].map(([key, label]) => (React.createElement(react_native_1.View, { key: key, style: styles.legendItem },
            React.createElement(react_native_1.View, { style: [styles.dot, { backgroundColor: theme.quality[key] }] }),
            React.createElement(react_native_1.Text, { style: [styles.legendTxt, { color: theme.subtext }] }, label)))))) : null,
        showTodayButton ? (React.createElement(react_native_1.Pressable, { onPress: goToday, style: [styles.todayBtn, { borderColor: theme.primary, borderRadius: theme.radius }] },
            React.createElement(react_native_1.Text, { style: [styles.todayTxt, { color: theme.primary }] }, locale === 'vi' ? 'Hôm nay' : 'Today'))) : null));
}
exports.LunarCalendar = LunarCalendar;
const styles = react_native_1.StyleSheet.create({
    root: {
        paddingHorizontal: 8,
        paddingVertical: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
        marginBottom: 10,
    },
    headerMid: {
        alignItems: 'center',
        flex: 1,
    },
    navBtn: {
        width: 36,
        height: 36,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navTxt: {
        fontSize: 20,
        lineHeight: 22,
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
    },
    subtitle: {
        fontSize: 12,
        marginTop: 2,
    },
    weekRow: {
        flexDirection: 'row',
    },
    cellWrap: {
        flex: 1,
        aspectRatio: 0.85,
        padding: 1.5,
    },
    weekTxt: {
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '600',
    },
    cell: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0,
    },
    solarTxt: {
        lineHeight: 20,
    },
    lunarTxt: {
        marginTop: 1,
    },
    legend: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 10,
        paddingTop: 8,
        borderTopWidth: react_native_1.StyleSheet.hairlineWidth,
        gap: 10,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 4,
    },
    legendTxt: {
        fontSize: 11,
    },
    todayBtn: {
        marginTop: 10,
        marginHorizontal: 4,
        paddingVertical: 8,
        borderWidth: 1,
        alignItems: 'center',
    },
    todayTxt: {
        fontSize: 13,
        fontWeight: '600',
    },
});
exports.default = LunarCalendar;
