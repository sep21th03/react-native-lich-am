import * as React from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { jdFromDate, jdToDate } from '../core/astro';
import { getLunarDayName } from '../core/format';
import { getLunarDayInfo, resolveDate } from '../core/day';
import type { LunarDayInfo } from '../core/types';
import type { LichVietDay } from '../dataset/decode';
import { createTheme, lightTheme, darkTheme, type LunarTheme } from './theme';

const WEEK_LABELS_VI = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const WEEK_LABELS_EN = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_LABELS_EN = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export interface LunarCalendarProps {
  /** Ngày đang chọn */
  value?: Date | string | number | { day: number; month: number; year: number };
  /** Ngày hiển thị ban đầu (mặc định: `value` hoặc hôm nay) */
  initialDate?: Date | string | number | { day: number; month: number; year: number };
  /** Gọi khi người dùng bấm một ngày */
  onSelectDay?: (day: LunarDayInfo, data: LichVietDay | null) => void;
  /** Gọi khi đổi tháng */
  onMonthChange?: (month: number, year: number) => void;
  /**
   * Nguồn dữ liệu chi tiết theo ngày — truyền vào để tô màu chất lượng ngày.
   * Ví dụ: `import { getDayData } from 'react-native-lich-am/dataset'`.
   */
  dayDataProvider?: (iso: string) => LichVietDay | null;
  /** Ghi đè bảng màu */
  theme?: Partial<LunarTheme>;
  /** Bộ màu nền: 'light' | 'dark' (mặc định 'light') */
  colorScheme?: 'light' | 'dark';
  /** Bắt đầu tuần: 0 = Chủ nhật, 1 = Thứ hai (mặc định 1) */
  weekStartsOn?: 0 | 1;
  /** Hiện ngày âm trong ô (mặc định true) */
  showLunar?: boolean;
  /** Hiện chú thích màu chất lượng (mặc định true nếu có `dayDataProvider`) */
  showLegend?: boolean;
  /** Hiện nút "Hôm nay" (mặc định true) */
  showTodayButton?: boolean;
  /** Hiện phần tiêu đề tháng âm (mặc định true) */
  showLunarHeader?: boolean;
  locale?: 'vi' | 'en';
  style?: StyleProp<ViewStyle>;
}

function daysInSolarMonth(month: number, year: number): number {
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  return jdFromDate(1, nextMonth, nextYear) - jdFromDate(1, month, year);
}

function todayJd(): number {
  const now = new Date();
  return jdFromDate(now.getDate(), now.getMonth() + 1, now.getFullYear());
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
export function LunarCalendar(props: LunarCalendarProps): React.ReactElement {
  const {
    value,
    initialDate,
    onSelectDay,
    onMonthChange,
    dayDataProvider,
    theme: themeOverride,
    colorScheme = 'light',
    weekStartsOn = 1,
    showLunar = true,
    showLegend,
    showTodayButton = true,
    showLunarHeader = true,
    locale = 'vi',
    style,
  } = props;

  const theme = React.useMemo(
    () => createTheme(colorScheme === 'dark' ? darkTheme : lightTheme, themeOverride),
    [colorScheme, themeOverride],
  );

  const anchor = React.useMemo(() => {
    const src = value ?? initialDate ?? new Date();
    return resolveDate(src as never);
  }, [value, initialDate]);

  const [view, setView] = React.useState({ month: anchor.month, year: anchor.year });
  const [selectedJd, setSelectedJd] = React.useState<number>(anchor.jd);
  const [today] = React.useState<number>(() => todayJd());

  // đồng bộ khi `value` đổi từ bên ngoài
  const lastValueRef = React.useRef<number | null>(null);
  React.useEffect(() => {
    if (value === undefined) return;
    const r = resolveDate(value as never);
    if (lastValueRef.current !== r.jd) {
      lastValueRef.current = r.jd;
      setSelectedJd(r.jd);
      setView({ month: r.month, year: r.year });
    }
  }, [value]);

  const goMonth = React.useCallback(
    (delta: number) => {
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
        onMonthChange?.(m, y);
        return { month: m, year: y };
      });
    },
    [onMonthChange],
  );

  const goToday = React.useCallback(() => {
    const jd = todayJd();
    const [d, m, y] = jdToDate(jd);
    setView({ month: m, year: y });
    setSelectedJd(jd);
    const info = getLunarDayInfo(jd);
    onSelectDay?.(info, dayDataProvider ? dayDataProvider(info.solar.iso) : null);
    onMonthChange?.(m, y);
  }, [dayDataProvider, onSelectDay, onMonthChange]);

  const handleSelect = React.useCallback(
    (jd: number) => {
      setSelectedJd(jd);
      const info = getLunarDayInfo(jd);
      onSelectDay?.(info, dayDataProvider ? dayDataProvider(info.solar.iso) : null);
    },
    [dayDataProvider, onSelectDay],
  );

  const grid = React.useMemo(() => {
    const first = jdFromDate(1, view.month, view.year);
    const total = daysInSolarMonth(view.month, view.year);
    const firstWeekday = resolveDate(first).weekday; // 0 = CN
    const offset = (firstWeekday - weekStartsOn + 7) % 7;
    const cells: Array<{ jd: number; info: LunarDayInfo } | null> = [];
    for (let i = 0; i < offset; i += 1) cells.push(null);
    for (let i = 0; i < total; i += 1) {
      const jd = first + i;
      cells.push({ jd, info: getLunarDayInfo(jd) });
    }
    while (cells.length % 7 !== 0) cells.push(null);
    const rows: Array<Array<{ jd: number; info: LunarDayInfo } | null>> = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
    return rows;
  }, [view.month, view.year, weekStartsOn]);

  const lunarHeader = React.useMemo(() => {
    const firstJd = jdFromDate(1, view.month, view.year);
    const info = getLunarDayInfo(firstJd);
    const leap = info.lunar.leap ? ' nhuận' : '';
    return locale === 'vi'
      ? `Tháng ${info.lunar.month}${leap} · ${info.canChi.year.name}`
      : `Lunar month ${info.lunar.month}${info.lunar.leap ? ' (leap)' : ''} · ${info.canChi.year.name}`;
  }, [view.month, view.year, locale]);

  const weekLabels = React.useMemo(() => {
    const base = locale === 'vi' ? WEEK_LABELS_VI : WEEK_LABELS_EN;
    return [...base.slice(weekStartsOn), ...base.slice(0, weekStartsOn)];
  }, [locale, weekStartsOn]);

  const title =
    locale === 'vi'
      ? `Tháng ${view.month}/${view.year}`
      : `${MONTH_LABELS_EN[view.month]} ${view.year}`;

  const legendOn = showLegend ?? !!dayDataProvider;

  return (
    <View style={[styles.root, { backgroundColor: theme.card, borderRadius: theme.radius }, style]}>
      {/* ── Header ─────────────────────────────────────────── */}
      <View style={styles.header}>
        <Pressable
          onPress={() => goMonth(-1)}
          style={[styles.navBtn, { borderColor: theme.border, borderRadius: theme.radius / 2 }]}
          accessibilityLabel={locale === 'vi' ? 'Tháng trước' : 'Previous month'}
        >
          <Text style={[styles.navTxt, { color: theme.text }]}>‹</Text>
        </Pressable>

        <View style={styles.headerMid}>
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          {showLunarHeader ? (
            <Text style={[styles.subtitle, { color: theme.primary }]}>{lunarHeader}</Text>
          ) : null}
        </View>

        <Pressable
          onPress={() => goMonth(1)}
          style={[styles.navBtn, { borderColor: theme.border, borderRadius: theme.radius / 2 }]}
          accessibilityLabel={locale === 'vi' ? 'Tháng sau' : 'Next month'}
        >
          <Text style={[styles.navTxt, { color: theme.text }]}>›</Text>
        </Pressable>
      </View>

      {/* ── Thứ trong tuần ─────────────────────────────────── */}
      <View style={styles.weekRow}>
        {weekLabels.map((w, i) => (
          <View key={`${w}-${i}`} style={styles.cellWrap}>
            <Text style={[styles.weekTxt, { color: theme.subtext }]}>{w}</Text>
          </View>
        ))}
      </View>

      {/* ── Lưới ngày ──────────────────────────────────────── */}
      <View>
        {grid.map((row, ri) => (
          <View key={`row-${ri}`} style={styles.weekRow}>
            {row.map((cell, ci) => {
              if (!cell) {
                return <View key={`empty-${ri}-${ci}`} style={styles.cellWrap} />;
              }
              const { jd, info } = cell;
              const isSelected = jd === selectedJd;
              const isToday = jd === today;
              const weekend = info.solar.weekday === 0 || info.solar.weekday === 6;
              const data = dayDataProvider ? dayDataProvider(info.solar.iso) : null;
              const qualityColor = data ? theme.quality[data.chatLuong] : null;
              const showQualityBg = !!data && data.chatLuong !== 'bt';

              return (
                <Pressable
                  key={info.solar.iso}
                  onPress={() => handleSelect(jd)}
                  style={styles.cellWrap}
                  accessibilityRole="button"
                  accessibilityLabel={`${info.solar.day}/${info.solar.month}/${info.solar.year}, ${getLunarDayName(info.lunar.day)} tháng ${info.lunar.month}`}
                >
                  <View
                    style={[
                      styles.cell,
                      { borderRadius: theme.radius / 1.5, borderColor: 'transparent' },
                      showQualityBg && {
                        backgroundColor: qualityColor as string,
                        opacity: isSelected ? 1 : 0.85,
                      },
                      isSelected && { backgroundColor: theme.selectedBg },
                      isToday && { borderColor: theme.todayBorder, borderWidth: 1.5 },
                    ]}
                  >
                    <Text
                      style={[
                        styles.solarTxt,
                        {
                          color: showQualityBg && !isSelected ? theme.primaryText : theme.text,
                          fontSize: theme.solarFontSize,
                          fontWeight: isSelected || isToday ? '700' : '500',
                        },
                      ]}
                    >
                      {info.solar.day}
                    </Text>

                    {showLunar ? (
                      <Text
                        style={[
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
                        ]}
                        numberOfLines={1}
                      >
                        {info.lunar.day === 1 ? `1/${info.lunar.month}` : info.lunar.day}
                      </Text>
                    ) : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      {/* ── Chú thích ──────────────────────────────────────── */}
      {legendOn && dayDataProvider ? (
        <View style={[styles.legend, { borderTopColor: theme.border }]}>
          {(
            [
              ['dep', locale === 'vi' ? 'Đẹp' : 'Great'],
              ['tot', locale === 'vi' ? 'Tốt' : 'Good'],
              ['bt', locale === 'vi' ? 'Bình thường' : 'Normal'],
              ['xau', locale === 'vi' ? 'Xấu' : 'Bad'],
              ['ratxau', locale === 'vi' ? 'Rất xấu' : 'Very bad'],
            ] as const
          ).map(([key, label]) => (
            <View key={key} style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: theme.quality[key] }]} />
              <Text style={[styles.legendTxt, { color: theme.subtext }]}>{label}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* ── Nút hôm nay ────────────────────────────────────── */}
      {showTodayButton ? (
        <Pressable
          onPress={goToday}
          style={[styles.todayBtn, { borderColor: theme.primary, borderRadius: theme.radius }]}
        >
          <Text style={[styles.todayTxt, { color: theme.primary }]}>
            {locale === 'vi' ? 'Hôm nay' : 'Today'}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
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
    borderTopWidth: StyleSheet.hairlineWidth,
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

export default LunarCalendar;
