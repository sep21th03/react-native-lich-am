import * as React from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import type { LunarDayInfo } from '../core/types';
import type { LichVietDay } from '../dataset/decode';
import { type LunarTheme } from './theme';
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
export declare function LunarDayDetail(props: LunarDayDetailProps): React.ReactElement;
export default LunarDayDetail;
