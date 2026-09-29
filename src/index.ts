/**
 * react-native-lich-am
 *
 * Thư viện lịch âm (âm lịch Việt Nam) cho React Native và JavaScript.
 *
 * - `react-native-lich-am`            → core thuật toán (entry này)
 * - `react-native-lich-am/dataset`    → dữ liệu chi tiết theo ngày 2024–2028
 * - `react-native-lich-am/ui`         → component <LunarCalendar/> & <LunarDayDetail/>
 *
 * Core không phụ thuộc thư viện ngoài, không cần native module.
 *
 * @example
 * import { getLunarDayInfo, getTodayLunar } from 'react-native-lich-am';
 *
 * const info = getLunarDayInfo(new Date());
 * console.log(info.lunar.text);        // "18/8/2026"
 * console.log(info.canChi.day.name);   // "Bính Ngọ"
 * console.log(info.truc.name);         // "Bình"
 * console.log(info.gioHoangDao.map(g => g.chi)); // ["Tý","Sửu","Mão",...]
 */

export * from './core';
