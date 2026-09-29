"use strict";
/**
 * Hướng xuất hành theo bảng Ngọc Hạp Thông Thư.
 *
 * Bảng đối xứng theo cặp Can ngày:
 *   Giáp / Kỷ  → Hỷ: Đông Bắc  · Tài: Đông Bắc  · Hạc: Đông Nam
 *   Ất   / Canh→ Hỷ: Tây Bắc   · Tài: Đông Nam  · Hạc: Đông Nam
 *   Bính / Tân → Hỷ: Tây Nam   · Tài: Tây       · Hạc: Đông
 *   Đinh / Nhâm→ Hỷ: Nam       · Tài: Tây Nam   · Hạc: Đông
 *   Mậu  / Quý → Hỷ: Đông Nam  · Tài: Bắc       · Hạc: Trung cung
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HUONG_DEGREE = exports.getHuongXuatHanh = void 0;
const HY = ['Đông Bắc', 'Tây Bắc', 'Tây Nam', 'Nam', 'Đông Nam'];
const TAI = ['Đông Bắc', 'Đông Nam', 'Tây', 'Tây Nam', 'Bắc'];
const HAC = ['Đông Nam', 'Đông Nam', 'Đông', 'Đông', 'Trung cung'];
/** Hướng xuất hành của ngày, suy từ can ngày */
function getHuongXuatHanh(canIndex, canName) {
    const g = (((canIndex % 10) + 10) % 10) % 5;
    return {
        canIndex: (((canIndex % 10) + 10) % 10),
        can: canName,
        hyThan: HY[g],
        taiThan: TAI[g],
        hacThan: HAC[g],
    };
}
exports.getHuongXuatHanh = getHuongXuatHanh;
/** Toạ độ la bàn (độ, 0 = Chính Bắc, thuận chiều kim đồng hồ) của 8 hướng */
exports.HUONG_DEGREE = {
    'Chính Bắc': 0,
    'Đông Bắc': 45,
    'Chính Đông': 90,
    'Đông Nam': 135,
    'Chính Nam': 180,
    'Tây Nam': 225,
    'Chính Tây': 270,
    'Tây Bắc': 315,
    Bắc: 0,
    Đông: 90,
    Nam: 180,
    Tây: 270,
    'Trung cung': -1,
};
