"use strict";
/**
 * API tổng hợp: lấy toàn bộ thông tin lịch âm của một ngày.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTodayLunar = exports.getLunarDate = exports.getLunarDayInfo = exports.decorateLunar = exports.resolveDate = void 0;
const constants_1 = require("./constants");
const astro_1 = require("./astro");
const lunar_1 = require("./lunar");
const canchi_1 = require("./canchi");
const tietkhi_1 = require("./tietkhi");
const truc_1 = require("./truc");
const huong_1 = require("./huong");
/** Chuẩn hoá đầu vào thành JD + [ngày, tháng, năm] dương lịch */
function resolveDate(input, timeZone = constants_1.TZ_VN) {
    let jd;
    let weekday;
    if (input instanceof Date) {
        jd = (0, astro_1.jdFromDateObject)(input, timeZone);
        const shifted = new Date(input.getTime() + timeZone * 3600 * 1000);
        weekday = shifted.getUTCDay();
    }
    else if (typeof input === 'number') {
        jd = input;
        weekday = (((jd + 1) % 7) + 7) % 7;
    }
    else if (typeof input === 'string') {
        const m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(input.trim());
        if (!m) {
            throw new Error(`react-native-lich-am: không hiểu chuỗi ngày "${input}" (cần dạng YYYY-MM-DD)`);
        }
        jd = (0, astro_1.jdFromDate)(Number(m[3]), Number(m[2]), Number(m[1]));
        weekday = (((jd + 1) % 7) + 7) % 7;
    }
    else {
        jd = (0, astro_1.jdFromDate)(input.day, input.month, input.year);
        weekday = (((jd + 1) % 7) + 7) % 7;
    }
    const [day, month, year] = (0, astro_1.jdToDate)(jd);
    return { jd, day, month, year, weekday };
}
exports.resolveDate = resolveDate;
/** Bọc thêm tên tháng, chuỗi ngày âm cho một `LunarDate` */
function decorateLunar(l) {
    const base = constants_1.TEN_THANG_AM_FULL[l.month];
    return Object.assign(Object.assign({}, l), { monthName: base, monthNameFull: l.leap ? `${base} nhuận` : base, text: `${l.day}/${l.month}/${l.year}` });
}
exports.decorateLunar = decorateLunar;
/**
 * Lấy toàn bộ thông tin lịch âm của một ngày.
 *
 * @example
 * getLunarDayInfo('2024-02-10')       // mùng 1 Tết Giáp Thìn
 * getLunarDayInfo(new Date())         // hôm nay
 * getLunarDayInfo(10, 2, 2024)        // 10/02/2024
 */
function getLunarDayInfo(input, timeZone = constants_1.TZ_VN) {
    const { jd, day, month, year, weekday } = resolveDate(input, timeZone);
    const lunar = (0, lunar_1.solarToLunar)(day, month, year, timeZone);
    const canChiDay = (0, canchi_1.getCanChiDay)(jd);
    const canChiYear = (0, canchi_1.getCanChiYear)(lunar.year);
    const canChiMonth = (0, canchi_1.getCanChiMonth)(lunar.month, lunar.year);
    const napAmDay = (0, canchi_1.getNapAm)(canChiDay.canIndex, canChiDay.chiIndex);
    const napAmYear = (0, canchi_1.getNapAm)(canChiYear.canIndex, canChiYear.chiIndex);
    const napAmMonth = (0, canchi_1.getNapAm)(canChiMonth.canIndex, canChiMonth.chiIndex);
    const gio = (0, truc_1.getGioInDay)(canChiDay.chiIndex);
    return {
        jd,
        solar: {
            day,
            month,
            year,
            weekday,
            weekdayName: constants_1.THU[weekday],
            iso: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        },
        lunar: decorateLunar(lunar),
        canChi: { year: canChiYear, month: canChiMonth, day: canChiDay },
        conGiap: (0, canchi_1.getConGiap)(lunar.year),
        napAm: { year: napAmYear, month: napAmMonth, day: napAmDay },
        nguHanh: napAmDay.element,
        nguHanhId: (0, canchi_1.getNguHanhId)(napAmDay.element),
        tietKhi: (0, tietkhi_1.getTietKhi)(jd, timeZone),
        truc: (0, truc_1.getTruc)(jd, canChiDay.chiIndex, timeZone),
        gio,
        gioHoangDao: gio.filter((g) => g.hoangDao),
        huongXuatHanh: (0, huong_1.getHuongXuatHanh)(canChiDay.canIndex, canChiDay.can),
    };
}
exports.getLunarDayInfo = getLunarDayInfo;
/** Tiện dụng: chỉ lấy ngày âm */
function getLunarDate(input, timeZone = constants_1.TZ_VN) {
    const { day, month, year } = resolveDate(input, timeZone);
    return decorateLunar((0, lunar_1.solarToLunar)(day, month, year, timeZone));
}
exports.getLunarDate = getLunarDate;
/**
 * Tiện dụng: hôm nay là ngày âm bao nhiêu.
 */
function getTodayLunar(timeZone = constants_1.TZ_VN) {
    return getLunarDate(new Date(), timeZone);
}
exports.getTodayLunar = getTodayLunar;
