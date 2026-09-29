import * as React from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import type { LunarDayInfo } from '../core/types';
import type { LichVietDay } from '../dataset/decode';
import { type LunarTheme } from './theme';
export interface LunarCalendarProps {
    /** Ngày đang chọn */
    value?: Date | string | number | {
        day: number;
        month: number;
        year: number;
    };
    /** Ngày hiển thị ban đầu (mặc định: `value` hoặc hôm nay) */
    initialDate?: Date | string | number | {
        day: number;
        month: number;
        year: number;
    };
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
export declare function LunarCalendar(props: LunarCalendarProps): React.ReactElement;
export default LunarCalendar;
