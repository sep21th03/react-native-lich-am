"use strict";
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./core"), exports);
