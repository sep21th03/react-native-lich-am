"use strict";
/**
 * react-native-lich-am / core
 *
 * Toàn bộ phần tính toán lịch âm — không phụ thuộc React Native,
 * không phụ thuộc thư viện ngoài, chạy được cả trên Node và trình duyệt.
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
__exportStar(require("./constants"), exports);
__exportStar(require("./astro"), exports);
__exportStar(require("./lunar"), exports);
__exportStar(require("./canchi"), exports);
__exportStar(require("./tietkhi"), exports);
__exportStar(require("./truc"), exports);
__exportStar(require("./huong"), exports);
__exportStar(require("./format"), exports);
__exportStar(require("./day"), exports);
__exportStar(require("./types"), exports);
