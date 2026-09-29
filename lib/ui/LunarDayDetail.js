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
exports.LunarDayDetail = void 0;
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const format_1 = require("../core/format");
const theme_1 = require("./theme");
function Row({ label, value, theme, accent, }) {
    return (React.createElement(react_native_1.View, { style: styles.row },
        React.createElement(react_native_1.Text, { style: [styles.rowLabel, { color: theme.subtext }] }, label),
        React.createElement(react_native_1.Text, { style: [styles.rowValue, { color: accent ? theme.primary : theme.text }], numberOfLines: 3 }, value)));
}
function Section({ title, children, theme, }) {
    return (React.createElement(react_native_1.View, { style: [styles.section, { borderTopColor: theme.border }] },
        React.createElement(react_native_1.Text, { style: [styles.sectionTitle, { color: theme.primary }] }, title),
        children));
}
/**
 * Thẻ chi tiết một ngày: can chi, tiết khí, trực, giờ hoàng đạo,
 * sao tốt/xấu, việc nên làm, hướng tốt, tuổi xung.
 *
 * @example
 * import { LunarDayDetail } from 'react-native-lich-am/ui';
 * import { getDayData } from 'react-native-lich-am/dataset';
 *
 * <LunarDayDetail day={getLunarDayInfo(new Date())} data={getDayData('2024-02-10')} />
 */
function LunarDayDetail(props) {
    const { day, data, sections, theme: themeOverride, colorScheme = 'light', locale = 'vi', style, scrollable = true, } = props;
    const theme = React.useMemo(() => (0, theme_1.createTheme)(colorScheme === 'dark' ? theme_1.darkTheme : theme_1.lightTheme, themeOverride), [colorScheme, themeOverride]);
    const want = (s) => !sections || sections.indexOf(s) >= 0;
    const vi = locale === 'vi';
    const body = (React.createElement(React.Fragment, null,
        React.createElement(react_native_1.View, { style: styles.head },
            React.createElement(react_native_1.Text, { style: [styles.headSolar, { color: theme.text }] }, (0, format_1.describeDay)(day)),
            React.createElement(react_native_1.Text, { style: [styles.headLunar, { color: theme.primary }] },
                day.canChi.day.name,
                data ? `  ·  ${data.truc}  ·  ${data.diem}/100` : `  ·  ${day.truc.name}`)),
        want('canchi') ? (React.createElement(Section, { title: vi ? 'Can chi & tiết khí' : 'Stems & terms', theme: theme },
            React.createElement(Row, { label: vi ? 'Năm' : 'Year', value: `${day.canChi.year.name} (${day.conGiap})`, theme: theme }),
            React.createElement(Row, { label: vi ? 'Tháng' : 'Month', value: day.canChi.month.name, theme: theme }),
            React.createElement(Row, { label: vi ? 'Ngày' : 'Day', value: day.canChi.day.name, theme: theme }),
            React.createElement(Row, { label: vi ? 'Tiết khí' : 'Solar term', value: day.tietKhi.name, theme: theme }),
            React.createElement(Row, { label: vi ? 'Trực' : 'Officer', value: day.truc.name, theme: theme, accent: true }),
            React.createElement(Row, { label: vi ? 'Nạp âm' : 'Nap am', value: `${day.napAm.day.name} (${day.napAm.day.element})`, theme: theme }),
            React.createElement(Row, { label: vi ? 'Tháng âm' : 'Lunar month', value: day.lunar.monthNameFull, theme: theme }))) : null,
        want('gio') ? (React.createElement(Section, { title: vi ? 'Giờ hoàng đạo' : 'Auspicious hours', theme: theme },
            React.createElement(react_native_1.View, { style: styles.chipRow }, day.gioHoangDao.map((g) => (React.createElement(react_native_1.View, { key: g.index, style: [styles.chip, { borderColor: theme.quality.dep }] },
                React.createElement(react_native_1.Text, { style: [styles.chipTitle, { color: theme.quality.dep }] }, g.chi),
                React.createElement(react_native_1.Text, { style: [styles.chipSub, { color: theme.subtext }] }, g.range))))),
            data ? (React.createElement(react_native_1.View, { style: styles.gioList }, data.gio
                .slice()
                .sort((a, b) => b.diem - a.diem)
                .slice(0, 5)
                .map((g) => (React.createElement(react_native_1.View, { key: g.index, style: styles.gioRow },
                React.createElement(react_native_1.Text, { style: [styles.gioChi, { color: theme.text }] }, g.chi),
                React.createElement(react_native_1.View, { style: [styles.gioBar, { backgroundColor: theme.border }] },
                    React.createElement(react_native_1.View, { style: [
                            styles.gioBarFill,
                            {
                                width: `${Math.max(4, Math.min(100, ((g.diem + 6) / 16) * 100))}%`,
                                backgroundColor: g.diem > 0 ? theme.quality.dep : theme.quality.ratxau,
                            },
                        ] })),
                React.createElement(react_native_1.Text, { style: [styles.gioDiem, { color: theme.subtext }] }, g.diem)))))) : null)) : null,
        data && want('sao') ? (React.createElement(Section, { title: vi ? 'Sao tốt / Sao xấu' : 'Stars', theme: theme },
            React.createElement(react_native_1.View, { style: styles.chipRow },
                data.saoTot.map((s) => (React.createElement(react_native_1.View, { key: `t-${s}`, style: [styles.tag, { borderColor: theme.quality.dep }] },
                    React.createElement(react_native_1.Text, { style: [styles.tagTxt, { color: theme.quality.dep }] }, s)))),
                data.saoXau.map((s) => (React.createElement(react_native_1.View, { key: `x-${s}`, style: [styles.tag, { borderColor: theme.quality.ratxau }] },
                    React.createElement(react_native_1.Text, { style: [styles.tagTxt, { color: theme.quality.ratxau }] }, s))))))) : null,
        data && want('viec') ? (React.createElement(Section, { title: vi ? 'Việc nên làm' : 'Good for', theme: theme },
            React.createElement(react_native_1.View, { style: styles.chipRow }, data.nenLam.map((a) => (React.createElement(react_native_1.View, { key: a, style: [styles.tag, { borderColor: theme.quality.dep, backgroundColor: 'transparent' }] },
                React.createElement(react_native_1.Text, { style: [styles.tagTxt, { color: theme.quality.dep }] }, a))))),
            React.createElement(react_native_1.Text, { style: [styles.sectionTitle, { color: theme.quality.ratxau, marginTop: 10 }] }, vi ? 'Việc không nên làm' : 'Avoid'),
            React.createElement(react_native_1.View, { style: styles.chipRow }, data.khongNenLam.map((a) => (React.createElement(react_native_1.View, { key: a, style: [styles.tag, { borderColor: theme.border }] },
                React.createElement(react_native_1.Text, { style: [styles.tagTxt, { color: theme.subtext }] }, a))))))) : null,
        want('huong') ? (React.createElement(Section, { title: vi ? 'Hướng xuất hành' : 'Directions', theme: theme },
            React.createElement(Row, { label: vi ? 'Hỷ thần' : 'Joy', value: day.huongXuatHanh.hyThan, theme: theme }),
            React.createElement(Row, { label: vi ? 'Tài thần' : 'Wealth', value: day.huongXuatHanh.taiThan, theme: theme }),
            React.createElement(Row, { label: vi ? 'Hạc thần (kỵ)' : 'Avoid', value: day.huongXuatHanh.hacThan, theme: theme }),
            data && data.huong.ngay.length ? (React.createElement(react_native_1.View, { style: styles.chipRow }, data.huong.ngay.slice(0, 5).map((h) => (React.createElement(react_native_1.View, { key: `${h.son}-${h.huong}`, style: [styles.tag, { borderColor: theme.border }] },
                React.createElement(react_native_1.Text, { style: [styles.tagTxt, { color: theme.subtext }] },
                    h.son,
                    " \u00B7 ",
                    h.huong,
                    " (",
                    h.soSao,
                    "\u2605)")))))) : null)) : null,
        data && want('tuoixung') && data.tuoiXung.length ? (React.createElement(Section, { title: vi ? 'Tuổi xung với ngày' : 'Clashing ages', theme: theme },
            React.createElement(react_native_1.View, { style: styles.chipRow }, data.tuoiXung.map((t) => (React.createElement(react_native_1.View, { key: t, style: [styles.tag, { borderColor: theme.quality.xau }] },
                React.createElement(react_native_1.Text, { style: [styles.tagTxt, { color: theme.quality.xau }] }, t))))))) : null));
    return (React.createElement(react_native_1.View, { style: [styles.root, { backgroundColor: theme.card, borderRadius: theme.radius }, style] }, scrollable ? (React.createElement(react_native_1.ScrollView, { showsVerticalScrollIndicator: false }, body)) : (body)));
}
exports.LunarDayDetail = LunarDayDetail;
const styles = react_native_1.StyleSheet.create({
    root: {
        padding: 12,
    },
    head: {
        marginBottom: 4,
    },
    headSolar: {
        fontSize: 15,
        fontWeight: '700',
    },
    headLunar: {
        fontSize: 12,
        marginTop: 2,
    },
    section: {
        marginTop: 12,
        paddingTop: 10,
        borderTopWidth: react_native_1.StyleSheet.hairlineWidth,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
        marginBottom: 6,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 3,
    },
    rowLabel: {
        fontSize: 13,
        flexShrink: 0,
        marginRight: 12,
    },
    rowValue: {
        fontSize: 13,
        fontWeight: '600',
        flexShrink: 1,
        textAlign: 'right',
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    chip: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 5,
        alignItems: 'center',
    },
    chipTitle: {
        fontSize: 13,
        fontWeight: '700',
    },
    chipSub: {
        fontSize: 10,
    },
    tag: {
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: 9,
        paddingVertical: 4,
    },
    tagTxt: {
        fontSize: 11.5,
    },
    gioList: {
        marginTop: 10,
        gap: 6,
    },
    gioRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    gioChi: {
        width: 38,
        fontSize: 12,
        fontWeight: '600',
    },
    gioBar: {
        flex: 1,
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    gioBarFill: {
        height: 6,
        borderRadius: 3,
    },
    gioDiem: {
        width: 32,
        fontSize: 11,
        textAlign: 'right',
    },
});
exports.default = LunarDayDetail;
