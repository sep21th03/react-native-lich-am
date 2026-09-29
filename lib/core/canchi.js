"use strict";
/**
 * Can Chi: năm, tháng, ngày, giờ — kèm Nạp Âm (ngũ hành) và con giáp.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConGiap = exports.getNguHanhId = exports.getNapAm = exports.getCanChiHour = exports.getCanChiMonth = exports.getCanChiDay = exports.getCanChiYear = exports.canChiIndex = void 0;
const constants_1 = require("./constants");
function build(canIndex, chiIndex) {
    const c = ((canIndex % 10) + 10) % 10;
    const z = ((chiIndex % 12) + 12) % 12;
    return { canIndex: c, chiIndex: z, can: constants_1.CAN[c], chi: constants_1.CHI[z], name: `${constants_1.CAN[c]} ${constants_1.CHI[z]}` };
}
/** Chỉ số 0–59 trong vòng 60 hoa giáp, từ cặp (can, chi) */
function canChiIndex(canIndex, chiIndex) {
    const c = ((canIndex % 10) + 10) % 10;
    const z = ((chiIndex % 12) + 12) % 12;
    for (let i = 0; i < 60; i += 1) {
        if (i % 10 === c && i % 12 === z) {
            return i;
        }
    }
    return 0;
}
exports.canChiIndex = canChiIndex;
/** Can Chi của năm âm lịch */
function getCanChiYear(lunarYear) {
    return build(lunarYear - 4, lunarYear - 4);
}
exports.getCanChiYear = getCanChiYear;
/** Can Chi của ngày, suy từ số ngày Julian */
function getCanChiDay(jd) {
    const idx = (((jd + 49) % 60) + 60) % 60;
    return build(idx % 10, idx % 12);
}
exports.getCanChiDay = getCanChiDay;
/**
 * Can Chi của tháng âm lịch (theo Ngũ Hổ Độn).
 *
 * Tháng 1 (Dần) của năm Giáp/Kỷ là Bính Dần, Ất/Canh là Mậu Dần,
 * Bính/Tân là Canh Dần, Đinh/Nhâm là Nhâm Dần, Mậu/Quý là Giáp Dần.
 */
function getCanChiMonth(lunarMonth, lunarYear) {
    const yearCan = (((lunarYear - 4) % 10) + 10) % 10;
    const canThang1 = (yearCan % 5) * 2 + 2; // can của tháng Dần
    const offset = lunarMonth - 1;
    return build(canThang1 + offset, 2 + offset);
}
exports.getCanChiMonth = getCanChiMonth;
/**
 * Can Chi của giờ (theo Ngũ Thử Độn).
 *
 * @param dayCanIndex chỉ số can của ngày (0 = Giáp)
 * @param hourChiIndex chỉ số chi của giờ (0 = Tý)
 */
function getCanChiHour(dayCanIndex, hourChiIndex) {
    const can = (((dayCanIndex % 5) * 2 + hourChiIndex) % 10 + 10) % 10;
    return build(can, hourChiIndex);
}
exports.getCanChiHour = getCanChiHour;
/** Nạp âm của một cặp can chi */
function getNapAm(canIndex, chiIndex) {
    const idx = canChiIndex(canIndex, chiIndex);
    const [name, element] = constants_1.NAP_AM[idx];
    return { name, element };
}
exports.getNapAm = getNapAm;
/** Ngũ hành của nạp âm ngày (dạng số 1..5 đúng quy ước Lịch Việt) */
function getNguHanhId(element) {
    const i = constants_1.NGU_HANH.indexOf(element);
    return i > 0 ? i : 0;
}
exports.getNguHanhId = getNguHanhId;
/** Con giáp của năm âm lịch */
function getConGiap(lunarYear) {
    const chi = (((lunarYear - 4) % 12) + 12) % 12;
    return constants_1.CON_GIAP[chi];
}
exports.getConGiap = getConGiap;
