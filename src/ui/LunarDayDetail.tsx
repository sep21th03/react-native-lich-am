import * as React from 'react';
import { ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { describeDay } from '../core/format';
import type { LunarDayInfo } from '../core/types';
import type { LichVietDay } from '../dataset/decode';
import { createTheme, darkTheme, lightTheme, type LunarTheme } from './theme';

export type DetailSection = 'canchi' | 'gio' | 'sao' | 'viec' | 'huong' | 'tuoixung';

export interface LunarDayDetailProps {
  /** Thông tin ngày (từ `getLunarDayInfo`) */
  day: LunarDayInfo;
  /** Dữ liệu chi tiết (từ `getDayData`) — tuỳ chọn, có thì hiện thêm sao/việc/hướng */
  data?: LichVietDay | null;
  /** Chọn phần muốn hiển thị, mặc định hiện hết những gì có */
  sections?: DetailSection[];
  theme?: Partial<LunarTheme>;
  colorScheme?: 'light' | 'dark';
  locale?: 'vi' | 'en';
  style?: StyleProp<ViewStyle>;
  /** Cho phép cuộn dọc bên trong (mặc định true) */
  scrollable?: boolean;
}

function Row({
  label,
  value,
  theme,
  accent,
}: {
  label: string;
  value: string;
  theme: LunarTheme;
  accent?: boolean;
}): React.ReactElement {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: theme.subtext }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: accent ? theme.primary : theme.text }]} numberOfLines={3}>
        {value}
      </Text>
    </View>
  );
}

function Section({
  title,
  children,
  theme,
}: {
  title: string;
  children: React.ReactNode;
  theme: LunarTheme;
}): React.ReactElement {
  return (
    <View style={[styles.section, { borderTopColor: theme.border }]}>
      <Text style={[styles.sectionTitle, { color: theme.primary }]}>{title}</Text>
      {children}
    </View>
  );
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
export function LunarDayDetail(props: LunarDayDetailProps): React.ReactElement {
  const {
    day,
    data,
    sections,
    theme: themeOverride,
    colorScheme = 'light',
    locale = 'vi',
    style,
    scrollable = true,
  } = props;

  const theme = React.useMemo(
    () => createTheme(colorScheme === 'dark' ? darkTheme : lightTheme, themeOverride),
    [colorScheme, themeOverride],
  );

  const want = (s: DetailSection) => !sections || sections.indexOf(s) >= 0;
  const vi = locale === 'vi';

  const body = (
    <>
      {/* Tiêu đề */}
      <View style={styles.head}>
        <Text style={[styles.headSolar, { color: theme.text }]}>{describeDay(day)}</Text>
        <Text style={[styles.headLunar, { color: theme.primary }]}>
          {day.canChi.day.name}
          {data ? `  ·  ${data.truc}  ·  ${data.diem}/100` : `  ·  ${day.truc.name}`}
        </Text>
      </View>

      {want('canchi') ? (
        <Section title={vi ? 'Can chi & tiết khí' : 'Stems & terms'} theme={theme}>
          <Row label={vi ? 'Năm' : 'Year'} value={`${day.canChi.year.name} (${day.conGiap})`} theme={theme} />
          <Row label={vi ? 'Tháng' : 'Month'} value={day.canChi.month.name} theme={theme} />
          <Row label={vi ? 'Ngày' : 'Day'} value={day.canChi.day.name} theme={theme} />
          <Row label={vi ? 'Tiết khí' : 'Solar term'} value={day.tietKhi.name} theme={theme} />
          <Row label={vi ? 'Trực' : 'Officer'} value={day.truc.name} theme={theme} accent />
          <Row
            label={vi ? 'Nạp âm' : 'Nap am'}
            value={`${day.napAm.day.name} (${day.napAm.day.element})`}
            theme={theme}
          />
          <Row label={vi ? 'Tháng âm' : 'Lunar month'} value={day.lunar.monthNameFull} theme={theme} />
        </Section>
      ) : null}

      {want('gio') ? (
        <Section title={vi ? 'Giờ hoàng đạo' : 'Auspicious hours'} theme={theme}>
          <View style={styles.chipRow}>
            {day.gioHoangDao.map((g) => (
              <View key={g.index} style={[styles.chip, { borderColor: theme.quality.dep }]}>
                <Text style={[styles.chipTitle, { color: theme.quality.dep }]}>{g.chi}</Text>
                <Text style={[styles.chipSub, { color: theme.subtext }]}>{g.range}</Text>
              </View>
            ))}
          </View>
          {data ? (
            <View style={styles.gioList}>
              {data.gio
                .slice()
                .sort((a, b) => b.diem - a.diem)
                .slice(0, 5)
                .map((g) => (
                  <View key={g.index} style={styles.gioRow}>
                    <Text style={[styles.gioChi, { color: theme.text }]}>{g.chi}</Text>
                    <View style={[styles.gioBar, { backgroundColor: theme.border }]}>
                      <View
                        style={[
                          styles.gioBarFill,
                          {
                            width: `${Math.max(4, Math.min(100, ((g.diem + 6) / 16) * 100))}%`,
                            backgroundColor: g.diem > 0 ? theme.quality.dep : theme.quality.ratxau,
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.gioDiem, { color: theme.subtext }]}>{g.diem}</Text>
                  </View>
                ))}
            </View>
          ) : null}
        </Section>
      ) : null}

      {data && want('sao') ? (
        <Section title={vi ? 'Sao tốt / Sao xấu' : 'Stars'} theme={theme}>
          <View style={styles.chipRow}>
            {data.saoTot.map((s) => (
              <View key={`t-${s}`} style={[styles.tag, { borderColor: theme.quality.dep }]}>
                <Text style={[styles.tagTxt, { color: theme.quality.dep }]}>{s}</Text>
              </View>
            ))}
            {data.saoXau.map((s) => (
              <View key={`x-${s}`} style={[styles.tag, { borderColor: theme.quality.ratxau }]}>
                <Text style={[styles.tagTxt, { color: theme.quality.ratxau }]}>{s}</Text>
              </View>
            ))}
          </View>
        </Section>
      ) : null}

      {data && want('viec') ? (
        <Section title={vi ? 'Việc nên làm' : 'Good for'} theme={theme}>
          <View style={styles.chipRow}>
            {data.nenLam.map((a) => (
              <View key={a} style={[styles.tag, { borderColor: theme.quality.dep, backgroundColor: 'transparent' }]}>
                <Text style={[styles.tagTxt, { color: theme.quality.dep }]}>{a}</Text>
              </View>
            ))}
          </View>
          <Text style={[styles.sectionTitle, { color: theme.quality.ratxau, marginTop: 10 }]}>
            {vi ? 'Việc không nên làm' : 'Avoid'}
          </Text>
          <View style={styles.chipRow}>
            {data.khongNenLam.map((a) => (
              <View key={a} style={[styles.tag, { borderColor: theme.border }]}>
                <Text style={[styles.tagTxt, { color: theme.subtext }]}>{a}</Text>
              </View>
            ))}
          </View>
        </Section>
      ) : null}

      {want('huong') ? (
        <Section title={vi ? 'Hướng xuất hành' : 'Directions'} theme={theme}>
          <Row label={vi ? 'Hỷ thần' : 'Joy'} value={day.huongXuatHanh.hyThan} theme={theme} />
          <Row label={vi ? 'Tài thần' : 'Wealth'} value={day.huongXuatHanh.taiThan} theme={theme} />
          <Row label={vi ? 'Hạc thần (kỵ)' : 'Avoid'} value={day.huongXuatHanh.hacThan} theme={theme} />
          {data && data.huong.ngay.length ? (
            <View style={styles.chipRow}>
              {data.huong.ngay.slice(0, 5).map((h) => (
                <View key={`${h.son}-${h.huong}`} style={[styles.tag, { borderColor: theme.border }]}>
                  <Text style={[styles.tagTxt, { color: theme.subtext }]}>
                    {h.son} · {h.huong} ({h.soSao}★)
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </Section>
      ) : null}

      {data && want('tuoixung') && data.tuoiXung.length ? (
        <Section title={vi ? 'Tuổi xung với ngày' : 'Clashing ages'} theme={theme}>
          <View style={styles.chipRow}>
            {data.tuoiXung.map((t) => (
              <View key={t} style={[styles.tag, { borderColor: theme.quality.xau }]}>
                <Text style={[styles.tagTxt, { color: theme.quality.xau }]}>{t}</Text>
              </View>
            ))}
          </View>
        </Section>
      ) : null}
    </>
  );

  return (
    <View style={[styles.root, { backgroundColor: theme.card, borderRadius: theme.radius }, style]}>
      {scrollable ? (
        <ScrollView showsVerticalScrollIndicator={false}>{body}</ScrollView>
      ) : (
        body
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
    borderTopWidth: StyleSheet.hairlineWidth,
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

export default LunarDayDetail;
