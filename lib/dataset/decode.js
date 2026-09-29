"use strict";
/**
 * Giải mã bộ dữ liệu Lịch Việt (bản nén) + các hàm tra cứu dùng chung.
 *
 * File này KHÔNG nạp dữ liệu năm nào — nhờ vậy các entry point theo từng năm
 * (`react-native-lich-am/dataset/2024`) chỉ kéo theo đúng dữ liệu của năm đó.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toIso = exports.createStore = exports.qualityStatsIn = exports.topDaysIn = exports.findGoodDaysIn = exports.findActivities = exports.listActivityGroups = exports.listActivities = exports.normalizeVi = exports.decodeDay = exports.QUALITY_ORDER = exports.QUALITY_LABEL = exports.LICH_VIET_SOURCE = exports.LICH_VIET_META = exports.dict = void 0;
const constants_1 = require("../core/constants");
const astro_1 = require("../core/astro");
const canchi_1 = require("../core/canchi");
exports.dict = require('./data/dict.json');
const CAN_NAMES = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
exports.LICH_VIET_META = {
    start: exports.dict.meta.start,
    end: exports.dict.meta.end,
    count: exports.dict.meta.count,
    scoreMin: exports.dict.meta.scoreMin,
    scoreMax: exports.dict.meta.scoreMax,
};
/** Nguồn dữ liệu */
exports.LICH_VIET_SOURCE = 'Trích xuất từ app Lịch Việt (com.somestudio.lichvietnam). Dùng cho mục đích cá nhân / tham khảo.';
exports.QUALITY_LABEL = {
    dep: 'Ngày đẹp',
    tot: 'Ngày tốt',
    bt: 'Bình thường',
    xau: 'Ngày xấu',
    ratxau: 'Ngày rất xấu',
};
exports.QUALITY_ORDER = {
    ratxau: 0,
    xau: 1,
    bt: 2,
    tot: 3,
    dep: 4,
};
/* ------------------------------------------------------------------ */
/* Giải mã                                                             */
/* ------------------------------------------------------------------ */
function decodeHuong(list) {
    return list.map(([s, soSao, h]) => ({ son: exports.dict.son[s], soSao, huong: exports.dict.huong[h] }));
}
const GIO_TABLE = require('./data/gio-table.json');
/** Tra sao theo id — `GIO_TABLE.sao` là mảng phẳng, id không trùng vị trí. */
const SAO_BY_ID = new Map(GIO_TABLE.sao.map((s) => [s.id, s]));
/**
 * Chỉ số 0..59 trong vòng lục giáp của ngày dương `iso`.
 * Khớp với `scripts/build-gio-table.mjs` nên bảng tra được đúng ô.
 */
function canChi60(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    const cc = (0, canchi_1.getCanChiDay)((0, astro_1.jdFromDate)(d, m, y));
    for (let i = 0; i < 60; i += 1) {
        if (i % 10 === cc.canIndex && i % 12 === cc.chiIndex)
            return i;
    }
    return -1;
}
function decodeDay(iso, r) {
    var _a, _b, _c, _d, _e, _f;
    // r.l có dạng "dd-mm-yyyy" (ví dụ "20-11-2023" = 20 tháng Mười Một 2023)
    const [ld, lm, ly] = r.l.split('-').map(Number);
    // Dựng lại 12 khung giờ từ bảng chuẩn (xem scripts/build-gio-table.mjs).
    // Nguồn bỏ trống giờ Tỵ ở 5 can-chi và tính sai vài ô, nên không dùng thẳng r.h.
    const gio = [];
    const rawHours = new Map(r.h.map(([g, diem, sao]) => [g, { diem, sao }]));
    const ci = canChi60(iso);
    const topIndex = new Set(r.g.map(([g]) => g));
    for (let h = 0; h < 12; h += 1) {
        const ids = GIO_TABLE.cells[`${ci}|${h}`] || [];
        const sao = ids.map((id) => SAO_BY_ID.get(id));
        const diem = sao.reduce((a, s) => a + (s ? s.w : 0), 0);
        const src = rawHours.get(h);
        let nguon = 'nguon';
        if (!src)
            nguon = 'suy-ra';
        else {
            const srcNames = src.sao.map((i) => exports.dict.gioSao[i]).slice().sort().join('|');
            const nowNames = sao.map((s) => (s ? s.ten : '')).slice().sort().join('|');
            if (srcNames !== nowNames || src.diem !== diem)
                nguon = 'sua';
        }
        gio.push({
            index: h,
            chi: (_a = constants_1.CHI[h]) !== null && _a !== void 0 ? _a : String(h),
            diem,
            sao: sao.map((s) => (s ? s.ten : '')),
            top: topIndex.has(h),
            nguon,
        });
    }
    return {
        date: iso,
        lunar: { day: ld, month: lm, year: ly },
        lunarRaw: r.l,
        truc: (_c = (_b = exports.dict.truc[r.t]) !== null && _b !== void 0 ? _b : constants_1.TRUC[r.t]) !== null && _c !== void 0 ? _c : '',
        nguHanh: (_e = (_d = exports.dict.nguHanh[r.n]) !== null && _d !== void 0 ? _d : constants_1.NGU_HANH[r.n]) !== null && _e !== void 0 ? _e : '',
        ngayRatXau: r.x === 1,
        saoTot: r.a.map((i) => exports.dict.sao[i]),
        saoXau: r.b.map((i) => exports.dict.sao[i]),
        nenLam: r.y.map((i) => exports.dict.viec[i]),
        khongNenLam: r.z.map((i) => exports.dict.viec[i]),
        gio,
        gioRaw: r.h.map(([g, diem, sao]) => {
            var _a;
            return ({
                index: g,
                chi: (_a = constants_1.CHI[g]) !== null && _a !== void 0 ? _a : String(g),
                diem,
                sao: sao.map((i) => exports.dict.gioSao[i]),
                top: false,
                nguon: 'nguon',
            });
        }),
        gioTotNhat: r.g.map(([g, diem]) => {
            var _a, _b, _c;
            return ({
                index: g,
                chi: (_a = constants_1.CHI[g]) !== null && _a !== void 0 ? _a : String(g),
                diem,
                sao: ((_c = (_b = r.h.find((x) => x[0] === g)) === null || _b === void 0 ? void 0 : _b[2]) !== null && _c !== void 0 ? _c : []).map((i) => exports.dict.gioSao[i]),
                top: true,
            });
        }),
        bonGioDaiCat: r.d.map(([g, sao, goc]) => {
            var _a, _b, _c;
            return ({
                index: g,
                chi: (_a = constants_1.CHI[g]) !== null && _a !== void 0 ? _a : String(g),
                sao: (_b = exports.dict.than[sao]) !== null && _b !== void 0 ? _b : '',
                gioGoc: (_c = exports.dict.than[goc]) !== null && _c !== void 0 ? _c : '',
            });
        }),
        gioQuyDangThienMon: r.q.map(([g, sao]) => {
            var _a, _b;
            return ({
                index: g,
                chi: (_a = constants_1.CHI[g]) !== null && _a !== void 0 ? _a : String(g),
                sao: (_b = exports.dict.than[sao]) !== null && _b !== void 0 ? _b : '',
            });
        }),
        huong: {
            nam: decodeHuong(r.p.nam),
            thang: decodeHuong(r.p.thang),
            ngay: decodeHuong(r.p.ngay),
        },
        tuoiXung: r.u.map(([c, z]) => { var _a, _b; return `${(_a = CAN_NAMES[c]) !== null && _a !== void 0 ? _a : ''} ${(_b = constants_1.CHI[z]) !== null && _b !== void 0 ? _b : ''}`.trim(); }),
        diemRaw: r.s,
        diem: r.e,
        chatLuong: ((_f = exports.dict.chatLuong[r.k]) !== null && _f !== void 0 ? _f : 'bt'),
    };
}
exports.decodeDay = decodeDay;
/** Bỏ dấu tiếng Việt để so khớp tìm kiếm */
function normalizeVi(s) {
    return s
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase()
        .trim();
}
exports.normalizeVi = normalizeVi;
/* ------------------------------------------------------------------ */
/* Từ vựng                                                             */
/* ------------------------------------------------------------------ */
/** Danh sách việc có trong dữ liệu */
function listActivities() {
    return [...exports.dict.viec].sort((a, b) => a.localeCompare(b, 'vi'));
}
exports.listActivities = listActivities;
/** Danh sách nhóm việc */
function listActivityGroups() {
    return [...exports.dict.nhom];
}
exports.listActivityGroups = listActivityGroups;
/** Tìm tên việc gần đúng (bỏ dấu, khớp một phần) */
function findActivities(keyword) {
    const k = normalizeVi(keyword);
    return exports.dict.viec.filter((v) => normalizeVi(v).includes(k)).sort((a, b) => a.localeCompare(b, 'vi'));
}
exports.findActivities = findActivities;
/**
 * Tìm ngày phù hợp cho một việc, trên một danh sách ngày cho trước.
 *
 * Dùng thẳng dữ liệu gốc: việc đó có nằm trong nhóm "Nên làm" của ngày hay không,
 * KHÔNG suy diễn thêm. Kết quả xếp theo điểm ngày giảm dần.
 */
function findGoodDaysIn(keys, lookup, options) {
    const { activity, from, to, minQuality, limit = 30, excludeVeryBad = false } = options;
    const target = normalizeVi(activity);
    const minQ = minQuality ? exports.QUALITY_ORDER[minQuality] : -1;
    const out = [];
    for (const iso of keys) {
        if (from && iso < from)
            continue;
        if (to && iso > to)
            continue;
        const day = lookup(iso);
        if (!day)
            continue;
        if (excludeVeryBad && day.ngayRatXau)
            continue;
        if (minQ >= 0 && exports.QUALITY_ORDER[day.chatLuong] < minQ)
            continue;
        if (!day.nenLam.some((a) => normalizeVi(a) === target))
            continue;
        out.push(day);
    }
    out.sort((a, b) => b.diem - a.diem || a.date.localeCompare(b.date));
    return out.slice(0, limit);
}
exports.findGoodDaysIn = findGoodDaysIn;
/** Ngày đẹp nhất trong một khoảng */
function topDaysIn(keys, lookup, from, to, limit = 10) {
    const out = [];
    for (const iso of keys) {
        if (from && iso < from)
            continue;
        if (to && iso > to)
            continue;
        const day = lookup(iso);
        if (day)
            out.push(day);
    }
    out.sort((a, b) => b.diem - a.diem || a.date.localeCompare(b.date));
    return out.slice(0, limit);
}
exports.topDaysIn = topDaysIn;
/** Thống kê chất lượng ngày trong một khoảng */
function qualityStatsIn(keys, lookup, from, to) {
    const stats = { dep: 0, tot: 0, bt: 0, xau: 0, ratxau: 0, total: 0, avgDiem: 0 };
    let sum = 0;
    for (const iso of keys) {
        if (from && iso < from)
            continue;
        if (to && iso > to)
            continue;
        const day = lookup(iso);
        if (!day)
            continue;
        stats[day.chatLuong] += 1;
        stats.total += 1;
        sum += day.diem;
    }
    stats.avgDiem = stats.total ? Math.round((sum / stats.total) * 10) / 10 : 0;
    return stats;
}
exports.qualityStatsIn = qualityStatsIn;
/** Tạo bộ tra cứu + danh sách ngày từ một hoặc nhiều payload năm */
function createStore(years) {
    const map = new Map();
    for (const y of years) {
        for (const iso of Object.keys(y.days)) {
            map.set(iso, y.days[iso]);
        }
    }
    const keys = [...map.keys()].sort();
    const cache = new Map();
    const lookup = (iso) => {
        const hit = cache.get(iso);
        if (hit)
            return hit;
        const raw = map.get(iso);
        if (!raw)
            return null;
        const decoded = decodeDay(iso, raw);
        cache.set(iso, decoded);
        return decoded;
    };
    return {
        keys,
        lookup,
        has: (iso) => map.has(iso),
        all: () => keys.map((k) => lookup(k)),
    };
}
exports.createStore = createStore;
/** Chuẩn hoá ngày thành "YYYY-MM-DD" */
function toIso(year, month, day) {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
exports.toIso = toIso;
