"use strict";
/**
 * Trực (Thập nhị kiến trừ) và 12 giờ hoàng đạo.
 *
 * Quy luật Trực đã được kiểm chứng khớp 1.462/1.462 ngày dữ liệu Lịch Việt:
 * Trực = (chi ngày − chi tháng tiết khí) mod 12, tra vào 12 Trực bắt đầu từ Kiến.
 *
 * Bảng giờ hoàng đạo sinh từ công thức `(2 × chi ngày + 8) mod 12`
 * khớp đúng bảng cổ điển (Tý–Ngọ: Tý Sửu Mão Ngọ Thân Dậu; …).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHoangDaoHours = exports.getGioInDay = exports.isHoangDaoHour = exports.getThanOfHour = exports.getThanOffset = exports.getTruc = void 0;
const constants_1 = require("./constants");
const tietkhi_1 = require("./tietkhi");
/** Trực của ngày */
function getTruc(jd, dayChiIndex, timeZone = constants_1.TZ_VN) {
    const monthChiIndex = (0, tietkhi_1.getTietKhiMonthChi)(jd, timeZone);
    const index = (((dayChiIndex - monthChiIndex) % 12) + 12) % 12;
    return { index, name: constants_1.TRUC[index], monthChiIndex, dayChiIndex };
}
exports.getTruc = getTruc;
const GIO_LABEL = [
    '23:00 – 00:59', '01:00 – 02:59', '03:00 – 04:59', '05:00 – 06:59',
    '07:00 – 08:59', '09:00 – 10:59', '11:00 – 12:59', '13:00 – 14:59',
    '15:00 – 16:59', '17:00 – 18:59', '19:00 – 20:59', '21:00 – 22:59',
];
const GIO_START = [23, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];
/** Vị trí thần hoàng đạo tại giờ Tý, suy từ chi ngày */
function getThanOffset(dayChiIndex) {
    return (((2 * dayChiIndex + 8) % 12) + 12) % 12;
}
exports.getThanOffset = getThanOffset;
/** Thần cai quản một giờ */
function getThanOfHour(dayChiIndex, hourIndex) {
    const offset = getThanOffset(dayChiIndex);
    const idx = (((hourIndex - offset) % 12) + 12) % 12;
    return constants_1.THAN_12[idx];
}
exports.getThanOfHour = getThanOfHour;
/** Có phải giờ hoàng đạo hay không */
function isHoangDaoHour(dayChiIndex, hourIndex) {
    const offset = getThanOffset(dayChiIndex);
    const idx = (((hourIndex - offset) % 12) + 12) % 12;
    return constants_1.THAN_12_TOT.indexOf(idx) >= 0;
}
exports.isHoangDaoHour = isHoangDaoHour;
/** Đầy đủ 12 khung giờ trong ngày kèm thông tin hoàng đạo */
function getGioInDay(dayChiIndex) {
    return GIO_LABEL.map((range, i) => ({
        index: i,
        chi: constants_1.CHI[i],
        range,
        startHour: GIO_START[i],
        endHour: (GIO_START[i] + 1) % 24,
        than: getThanOfHour(dayChiIndex, i),
        hoangDao: isHoangDaoHour(dayChiIndex, i),
    }));
}
exports.getGioInDay = getGioInDay;
/** Danh sách chỉ số 6 giờ hoàng đạo trong ngày */
function getHoangDaoHours(dayChiIndex) {
    const out = [];
    for (let i = 0; i < 12; i += 1) {
        if (isHoangDaoHour(dayChiIndex, i)) {
            out.push(i);
        }
    }
    return out;
}
exports.getHoangDaoHours = getHoangDaoHours;
