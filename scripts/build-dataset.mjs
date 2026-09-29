#!/usr/bin/env node
/**
 * Sinh bộ dữ liệu gọn cho package từ `calendar_full.json` (bản cào Lịch Việt).
 *
 *   node scripts/build-dataset.mjs "/đường/dẫn/calendar_full.json"
 *
 * Xuất ra:
 *   src/dataset/data/dict.json        bảng chuỗi dùng chung (sao, việc, hướng, sơn)
 *   src/dataset/data/days-YYYY.json   dữ liệu từng ngày, mảng nén theo năm
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'src', 'dataset', 'data');

const SRC =
  process.argv[2] ||
  '/Users/nguyenhoa/WorkBuddy AI/2026-09-21-15-43-01/calendar_full.json';

const TRUC = [
  'Kiến', 'Trừ', 'Mãn', 'Bình', 'Định', 'Chấp',
  'Phá', 'Nguy', 'Thành', 'Thu', 'Khai', 'Bế',
];

/** Hệ số Trực — giống prepare_data.py để điểm khớp app web đã có */
const TRUC_BONUS = {
  Thành: 2.0, Khai: 2.0, Định: 1.0, Bình: 1.0, Thu: 1.0,
  Mãn: 0.5, Trừ: 0.5, Kiến: 0.0, Chấp: 0.0,
  Nguy: -1.0, Phá: -2.0, Bế: -2.0,
};

/** Sắp xếp tên theo thứ tự xuất hiện để id ổn định giữa các lần build */
class Interner {
  constructor() {
    this.list = [];
    this.map = new Map();
  }
  id(value) {
    if (value === undefined || value === null || value === '') return -1;
    let i = this.map.get(value);
    if (i === undefined) {
      i = this.list.length;
      this.list.push(value);
      this.map.set(value, i);
    }
    return i;
  }
}

function acts(day, wantCode, viecInterner, nhomInterner) {
  const out = [];
  const groups = [];
  for (const g of day.viec_ngay || []) {
    if (g.code !== wantCode) continue;
    for (const n of g.nhom_viec || []) {
      const gi = nhomInterner.id(n.ten_nhom_viec);
      for (const v of n.viec || []) {
        const t = v.ten_viec;
        if (!t) continue;
        const id = viecInterner.id(t);
        if (!out.includes(id)) {
          out.push(id);
          groups.push(gi);
        }
      }
    }
  }
  return { items: out.sort((a, b) => a - b), groups };
}

function main() {
  if (!fs.existsSync(SRC)) {
    console.error(`Không tìm thấy file nguồn: ${SRC}`);
    process.exit(1);
  }
  console.log(`Đọc ${SRC} …`);
  const cal = JSON.parse(fs.readFileSync(SRC, 'utf8'));

  const sao = new Interner();
  const viec = new Interner();
  const nhom = new Interner();
  const huong = new Interner();
  const son = new Interner();
  const than = new Interner();
  const gioSao = new Interner();

  const keys = Object.keys(cal).sort();
  const perYear = new Map();
  const scored = [];

  for (const iso of keys) {
    const d = cal[iso];
    const saoNgay = d.sao_ngay || {};
    const pt = d.phan_thien || {};
    const trucName = ((pt.thap_nhi_kien_tru || {}).truc) || '';
    const rx = pt.ngay_rat_xau ? 1 : 0;

    const st = (saoNgay.tot || []).map((s) => sao.id(s.ten_sao)).filter((i) => i >= 0).sort((a, b) => a - b);
    const sx = (saoNgay.xau || []).map((s) => sao.id(String(s.ten_sao || '').trim())).filter((i) => i >= 0).sort((a, b) => a - b);

    const nen = acts(d, 1, viec, nhom);
    const khong = acts(d, 0, viec, nhom);

    // 12 giờ với điểm + sao
    const gio12 = (d.dinh_cuc_gio || []).map((g) => [
      g.gio,
      g.diem,
      (g.sao || []).map((s) => gioSao.id(s.ten_sao)).filter((i) => i >= 0).sort((a, b) => a - b),
    ]);

    // top giờ tốt nhất
    const gioTot = (d.gio_tot_nhat || []).map((g) => [g.gio, g.diem]);

    // 4 giờ đại cát + giờ quý đăng thiên môn
    const b4 = (d.bon_gio_dai_cat || []).map((g) => [Number(g.gio), than.id(g.sao), than.id(g.gio_goc)]);
    const qdm = (d.gio_quy_dang_thien_mon || []).map((g) => [Number(g.gio), than.id(g.sao)]);

    // phương hướng: lấy top theo số sao cho từng phạm vi
    const ph = { nam: [], thang: [], ngay: [] };
    for (const p of (d.phan_dia || {}).phuong_huong || []) {
      const scope = p.phuong_huong_theo;
      if (!ph[scope]) continue;
      const list = (p.list || [])
        .map((it) => [son.id(it.ten_son), it.so_sao || 0, huong.id(it.huong)])
        .sort((a, b) => b[1] - a[1])
        .slice(0, scope === 'ngay' ? 8 : 6);
      ph[scope] = list;
    }

    const tx = (pt.tuoi_xung_voi_ngay || []).map((x) => [x.can, x.chi]);

    // điểm "ngày đẹp" — công thức công khai, giống prepare_data.py
    const sumGio = gioTot.reduce((acc, g) => acc + (typeof g[1] === 'number' ? g[1] : 0), 0);
    const score =
      st.length * 1.0 -
      sx.length * 1.2 -
      rx * 3.0 +
      sumGio / 4.0 +
      (TRUC_BONUS[trucName] || 0);

    const rec = {
      l: d.ngay_am || '',
      t: Math.max(0, TRUC.indexOf(trucName)),
      n: d.ngu_hanh || 0,
      x: rx,
      s: Math.round(score * 100) / 100,
      a: st,
      b: sx,
      y: nen.items,
      z: khong.items,
      h: gio12,
      g: gioTot,
      d: b4,
      q: qdm,
      p: ph,
      u: tx,
    };

    const year = iso.slice(0, 4);
    if (!perYear.has(year)) perYear.set(year, {});
    perYear.get(year)[iso] = rec;
    scored.push(rec);
  }

  // chuẩn hoá điểm về thang 0–100 theo phân vị toàn bộ tập
  const sorted = scored.map((r) => r.s).sort((a, b) => a - b);
  const lo = sorted[0];
  const hi = sorted[sorted.length - 1];
  for (const r of scored) {
    const p = hi > lo ? Math.round(((r.s - lo) / (hi - lo)) * 100) : 50;
    r.e = p;
    r.k = p >= 70 ? 0 : p >= 55 ? 1 : p >= 35 ? 2 : p >= 20 ? 3 : 4;
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const dict = {
    _note:
      'Dữ liệu trích xuất từ app Lịch Việt (com.somestudio.lichvietnam). Xem README để biết phạm vi sử dụng.',
    truc: TRUC,
    nguHanh: ['', 'Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'],
    chatLuong: ['dep', 'tot', 'bt', 'xau', 'ratxau'],
    sao: sao.list,
    gioSao: gioSao.list,
    viec: viec.list,
    nhom: nhom.list,
    huong: huong.list,
    son: son.list,
    than: than.list,
    gioChi: ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'],
    phamVi: ['nam', 'thang', 'ngay'],
    meta: {
      start: keys[0],
      end: keys[keys.length - 1],
      count: keys.length,
      scoreMin: lo,
      scoreMax: hi,
    },
  };

  fs.writeFileSync(path.join(OUT_DIR, 'dict.json'), JSON.stringify(dict), 'utf8');

  let total = 0;
  const years = [...perYear.keys()].sort();
  for (const y of years) {
    const payload = { year: Number(y), days: perYear.get(y) };
    const json = JSON.stringify(payload);
    fs.writeFileSync(path.join(OUT_DIR, `days-${y}.json`), json, 'utf8');
    total += Buffer.byteLength(json);
    console.log(`  days-${y}.json  ${(Buffer.byteLength(json) / 1024).toFixed(1)} KB  (${Object.keys(perYear.get(y)).length} ngày)`);
  }

  const dictSize = fs.statSync(path.join(OUT_DIR, 'dict.json')).size;
  console.log(`  dict.json       ${(dictSize / 1024).toFixed(1)} KB`);
  console.log(`  ─────────────────────────────`);
  console.log(`  TỔNG            ${((total + dictSize) / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  khoảng ngày     ${dict.meta.start} → ${dict.meta.end}  (${dict.meta.count} ngày)`);
  console.log(`  sao ${sao.list.length} · giờ sao ${gioSao.list.length} · việc ${viec.list.length} · sơn ${son.list.length} · hướng ${huong.list.length}`);
  console.log(`  điểm ${lo} → ${hi}`);
}

main();
