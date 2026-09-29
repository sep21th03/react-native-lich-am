"use strict";
/**
 * Tiết khí (24 tiết) và "tháng tiết khí" (Kiến tháng) dùng cho Trực.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthStart = exports.getTietKhiOfYear = exports.getTietKhiMonthChi = exports.getTietKhi = exports.getSunArc = void 0;
const constants_1 = require("./constants");
const astro_1 = require("./astro");
/**
 * Cung 15° của kinh độ mặt trời, giá trị 0..23. `arc * 15°` là kinh độ mặt trời; 0 = Xuân phân.
 *
 * Lấy tại **cuối ngày địa phương**, tức tiết khí đang hiệu lực lúc 24:00.
 * Tiết khí được ấn định cho ngày mà thời điểm giao tiết rơi vào, chứ không phải
 * theo vị trí mặt trời lúc 00:00 — nếu lấy mốc đầu ngày thì những tiết giao vào
 * buổi sáng/tối sẽ bị lùi sang hôm sau (sai 96 ngày trên dữ liệu đối chiếu).
 */
function getSunArc(jd, timeZone = constants_1.TZ_VN) {
    const l = (0, astro_1.sunLongitude)(jd + 0.5 - timeZone / 24);
    return (0, astro_1.int)((l / Math.PI) * 12);
}
exports.getSunArc = getSunArc;
function arcToId(arc) {
    const id = (arc + 1) % 24;
    return id === 0 ? 24 : id;
}
function jdToYmd(jd) {
    // tách riêng để tránh import vòng
    let a;
    let b;
    let c;
    if (jd > 2299160) {
        a = jd + 32044;
        b = (0, astro_1.int)((4 * a + 3) / 146097);
        c = a - (0, astro_1.int)((b * 146097) / 4);
    }
    else {
        b = 0;
        c = jd + 32082;
    }
    const d = (0, astro_1.int)((4 * c + 3) / 1461);
    const e = c - (0, astro_1.int)((1461 * d) / 4);
    const m = (0, astro_1.int)((5 * e + 2) / 153);
    return {
        day: e - (0, astro_1.int)((153 * m + 2) / 5) + 1,
        month: m + 3 - 12 * (0, astro_1.int)(m / 10),
        year: b * 100 + d - 4800 + (0, astro_1.int)(m / 10),
    };
}
/** Tiết khí của một ngày (theo JD) */
function getTietKhi(jd, timeZone = constants_1.TZ_VN) {
    const arc = getSunArc(jd, timeZone);
    const id = arcToId(arc);
    const meta = constants_1.TIET_KHI[id - 1];
    // lùi về ngày bắt đầu tiết hiện tại
    let startJd = jd;
    while (getSunArc(startJd - 1, timeZone) === arc) {
        startJd -= 1;
    }
    return {
        id,
        name: meta.name,
        longitude: meta.lon,
        startJd,
        start: jdToYmd(startJd),
    };
}
exports.getTietKhi = getTietKhi;
/**
 * Chi của "tháng tiết khí" (Kiến tháng) — dùng để tính Trực.
 *
 * Lập xuân → Dần, Kinh trập → Mão, Thanh minh → Thìn, …
 * Trả về chỉ số địa chi 0..11 (0 = Tý).
 */
function getTietKhiMonthChi(jd, timeZone = constants_1.TZ_VN) {
    const arc = getSunArc(jd, timeZone);
    return (((arc + 1) >> 1) + 3) % 12;
}
exports.getTietKhiMonthChi = getTietKhiMonthChi;
/** Danh sách 24 tiết khí của một năm dương lịch, kèm ngày bắt đầu */
function getTietKhiOfYear(year, timeZone = constants_1.TZ_VN) {
    const out = [];
    const jdStart = (() => {
        // 01/01 dương lịch
        const a = (0, astro_1.int)((14 - 1) / 12);
        const y = year + 4800 - a;
        const m = 1 + 12 * a - 3;
        return 1 + (0, astro_1.int)((153 * m + 2) / 5) + 365 * y + (0, astro_1.int)(y / 4) - (0, astro_1.int)(y / 100) + (0, astro_1.int)(y / 400) - 32045;
    })();
    let jd = jdStart;
    let lastId = -1;
    while (true) {
        const tk = getTietKhi(jd, timeZone);
        const ymd = jdToYmd(jd);
        if (ymd.year > year) {
            break;
        }
        if (tk.id !== lastId) {
            out.push(tk);
            lastId = tk.id;
        }
        jd += 1;
    }
    return out;
}
exports.getTietKhiOfYear = getTietKhiOfYear;
/** JD của ngày sóc gần nhất trước hoặc bằng `jd` */
function getMonthStart(jd, timeZone = constants_1.TZ_VN) {
    const k = (0, astro_1.int)((jd - 2415021.076998695) / 29.530588853);
    let start = (0, astro_1.getNewMoonDay)(k + 1, timeZone);
    if (start > jd) {
        start = (0, astro_1.getNewMoonDay)(k, timeZone);
    }
    return start;
}
exports.getMonthStart = getMonthStart;
