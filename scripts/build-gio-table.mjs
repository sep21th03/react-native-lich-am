#!/usr/bin/env node
/**
 * Sinh bảng giờ chuẩn: 60 can-chi × 12 giờ → tập sao + điểm.
 *
 *   node scripts/build-gio-table.mjs [đường-dẫn/calendar_full.json]
 *
 * Vì sao cần bảng này — 3 lỗi của dữ liệu nguồn:
 *   1. Bỏ trống khung giờ index 5 (giờ Tỵ) cho 5 can-chi đầu vòng lục giáp
 *      (Giáp Tý, Ất Sửu, Bính Dần, Đinh Mão, Mậu Thìn) ⇒ 125 ngày chỉ có 11 giờ.
 *   2. Ngày Ất Dậu: giờ index 7..11 tính theo chi của NGÀY KẾ TIẾP (Bính Tuất).
 *   3. Ngày Canh Ngọ và Giáp Ngọ: vài giờ bị gán sai/lặp thần.
 *
 * Cách dựng: mọi sao trong bộ dữ liệu chỉ phụ thuộc CAN ngày, CHI ngày, hoặc cả hai
 * (đã kiểm chứng: không phụ thuộc tháng âm lẫn tiết khí). Nên dựng bảng từ 4 nguồn:
 *   A. 12 thần hoàng đạo/hắc đạo  — công thức (2×chi + 8) mod 12, đã đối chiếu 1462/1462
 *   B. 3 sao phụ thuộc CHI        — học từ các can-chi cùng chi
 *   C. 5 sao phụ thuộc CAN        — học từ các can-chi cùng can
 *   D. 6 sao có luật cổ điển      — Nhật kiến / mã / hình, Ngũ bất ngộ,
 *                                   Triệt lộ không vong, Tuần trung không vong
 * 26 sao = 12 + 3 + 5 + 6, không sót sao nào.
 *
 * Điểm mỗi giờ: diem = Σ w[sao], w giải ra bằng bình phương tối thiểu — khớp 17.419/17.419
 * và toàn bộ trọng số là số nguyên.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const SRC = process.argv[2]
  || '/Users/nguyenhoa/WorkBuddy AI/2026-09-21-15-43-01/calendar_full.json';
const OUT = path.join(ROOT, 'src', 'dataset', 'data', 'gio-table.json');

const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const ccName = (i) => `${CAN[i % 10]} ${CHI[i % 12]}`;
const ccIndex = (name) => {
  const [c, z] = name.split(' ');
  for (let i = 0; i < 60; i += 1) {
    if (i % 10 === CAN.indexOf(c) && i % 12 === CHI.indexOf(z)) return i;
  }
  return -1;
};

/* ── A. 12 thần theo chi ngày ─────────────────────────────────────────────── */
const DEITY_IDS = [12, 31, 16, 4, 19, 21, 11, 36, 24, 2, 25, 9];
const deityAt = (chi, h) => DEITY_IDS[(((h - ((2 * chi + 8) % 12)) % 12) + 12) % 12];

/* ── D. 6 sao có luật cổ điển ─────────────────────────────────────────────── */
// 驛馬: 申子辰→寅, 寅午戌→申, 巳酉丑→亥, 亥卯未→巳
const MA = { 8: 2, 0: 2, 4: 2, 2: 8, 6: 8, 10: 8, 5: 11, 9: 11, 1: 11, 11: 5, 3: 5, 7: 5 };
// 相刑
const XING = { 0: [3], 3: [0], 2: [5], 5: [8], 8: [2], 1: [10], 10: [7], 7: [1], 4: [4], 6: [6], 9: [9], 11: [11] };
// 截路空亡 theo can ngày (bảng đọc trực tiếp từ dữ liệu)
const TRIET = { 0: [8, 9], 5: [8, 9], 1: [6, 7], 6: [6, 7], 2: [4, 5], 7: [4, 5], 3: [2, 3], 8: [2, 3], 4: [0, 1, 10, 11], 9: [0, 1, 10, 11] };
// 空亡 theo tuần (xún)
const TUAN = { 0: [10, 11], 1: [8, 9], 2: [6, 7], 3: [4, 5], 4: [2, 3], 5: [0, 1] };
// 五不遇時: giờ có can khắc can ngày; can giờ lấy theo Ngũ Thử Độn
function nguBatNgo(can) {
  const start = ((can % 5) * 2) % 10;
  const target = (can + 6) % 10;
  const out = [];
  for (let h = 0; h < 12; h += 1) if ((start + h) % 10 === target) out.push(h);
  return out;
}
const RULES = {
  18: (can, chi) => [chi],                                   // Nhật kiến
  30: (can, chi) => [MA[chi]],                               // Nhật mã
  34: (can, chi) => XING[chi],                               // Nhật hình
  32: (can) => nguBatNgo(can),                               // Ngũ bất ngộ
  22: (can) => TRIET[can],                                   // Triệt lộ không vong
  28: (can, chi, ci) => TUAN[Math.floor(ci / 10)],            // Tuần trung không vong
};
const RULE_IDS = Object.keys(RULES).map(Number);

/* ── Đọc dữ liệu nguồn ────────────────────────────────────────────────────── */
const cal = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const keys = Object.keys(cal).sort();

const saoMeta = new Map(); // id -> { loai, ten }
const votes = new Map();   // `${ci}|${h}` -> Map(sig -> count)
for (const iso of keys) {
  const d = cal[iso];
  const ci = ccIndex(d.can_chi_ngay);
  for (const g of d.dinh_cuc_gio || []) {
    for (const s of g.sao || []) saoMeta.set(s.id, { loai: s.loai, ten: s.ten_sao });
    const sig = (g.sao || []).map((s) => s.id).sort((a, b) => a - b).join(',');
    const k = `${ci}|${g.gio}`;
    if (!votes.has(k)) votes.set(k, new Map());
    const m = votes.get(k);
    m.set(sig, (m.get(sig) || 0) + 1);
  }
}

const cells = new Map(); // `${ci}|${h}` -> Set(id)
for (const [k, m] of votes) {
  const best = [...m.entries()].sort((a, b) => b[1] - a[1])[0];
  cells.set(k, new Set(best[0] ? best[0].split(',').map(Number) : []));
}

/* ── B + C. Học sao phụ thuộc CHI và phụ thuộc CAN ────────────────────────────
 * Không cần phân loại trước: học cả hai chiều rồi HỢP lại. Một sao theo CHI sẽ
 * được chiParts bắt, theo CAN thì canParts bắt; chiều còn lại đòi hỏi "có mặt ở
 * mọi tổ hợp cùng giá trị" nên hầu như không sinh dương tính giả.
 * ─────────────────────────────────────────────────────────────────────────── */
const extraIds = [...saoMeta.keys()].filter((id) => !DEITY_IDS.includes(id) && !RULE_IDS.includes(id));

/**
 * Ô đã chứng minh là lỗi nguồn — KHÔNG dùng để học (nếu không chúng sẽ đầu độc
 * phần CHI của chi Dậu và phần CAN của can Ất), nhưng vẫn được mô hình dựng lại
 * để sửa. Ngày Ất Dậu lấy giờ 7..11 theo chi của Bính Tuất (ngày kế tiếp).
 */
const POISON = new Set(['21|7', '21|8', '21|9', '21|10', '21|11']);

const learn = (id, groupOf, n) => {
  const out = new Set(); // `${group}|${h}`
  for (let g = 0; g < n; g += 1) {
    for (let h = 0; h < 12; h += 1) {
      let seen = 0; let yes = 0;
      for (let ci = 0; ci < 60; ci += 1) {
        if (groupOf(ci) !== g) continue;
        if (POISON.has(`${ci}|${h}`)) continue;
        const c = cells.get(`${ci}|${h}`);
        if (!c) continue;
        seen += 1;
        if (c.has(id)) yes += 1;
      }
      if (seen && yes === seen) out.add(`${g}|${h}`);
    }
  }
  return out;
};
const chiParts = new Map();
const canParts = new Map();
for (const id of extraIds) {
  chiParts.set(id, learn(id, (ci) => ci % 12, 12));
  canParts.set(id, learn(id, (ci) => ci % 10, 10));
}
const byChiOnly = extraIds.filter((id) => !canParts.get(id).size);
const byCanOnly = extraIds.filter((id) => !chiParts.get(id).size);

/* ── Mô hình dựng một ô ───────────────────────────────────────────────────── */
function buildCell(ci, h) {
  const can = ci % 10;
  const chi = ci % 12;
  const out = new Set([deityAt(chi, h)]);
  for (const id of RULE_IDS) if (RULES[id](can, chi, ci).includes(h)) out.add(id);
  for (const id of extraIds) {
    if (chiParts.get(id).has(`${chi}|${h}`) || canParts.get(id).has(`${can}|${h}`)) out.add(id);
  }
  return out;
}

/* ── Kiểm chứng trên các ô nguồn có dữ liệu ───────────────────────────────── */
let ok = 0; let bad = 0; const badCells = [];
for (const [k, set] of cells) {
  const [ci, h] = k.split('|').map(Number);
  const pred = buildCell(ci, h);
  const same = pred.size === set.size && [...set].every((x) => pred.has(x));
  if (same) ok += 1;
  else {
    bad += 1;
    const missing = [...set].filter((x) => !pred.has(x)).map((x) => saoMeta.get(x).ten);
    const extra = [...pred].filter((x) => !set.has(x)).map((x) => saoMeta.get(x).ten);
    if (badCells.length < 15) badCells.push(`${ccName(ci)} giờ ${h}: thiếu [${missing.join(', ')}] thừa [${extra.join(', ')}]`);
  }
}
console.log(`Thành phần: ${DEITY_IDS.length} thần + ${RULE_IDS.length} luật cổ điển + ${extraIds.length} sao học từ dữ liệu`);
console.log(`   chỉ khớp phần CHI: ${byChiOnly.map((i) => saoMeta.get(i).ten).join(', ') || '(không có)'}`);
console.log(`   chỉ khớp phần CAN: ${byCanOnly.map((i) => saoMeta.get(i).ten).join(', ') || '(không có)'}`);
console.log(`\nKiểm chứng trên ${cells.size} ô nguồn có dữ liệu: khớp ${ok} | lệch ${bad}`);
badCells.forEach((x) => console.log('   ', x));

/* ── Giải trọng số điểm ───────────────────────────────────────────────────── */
const ids = [...saoMeta.keys()].sort((a, b) => a - b);
const wIdx = new Map(ids.map((id, i) => [id, i]));
const n = ids.length;
const A = Array.from({ length: n }, () => new Array(n).fill(0));
const b = new Array(n).fill(0);
let rows = 0;
for (const iso of keys) {
  for (const g of cal[iso].dinh_cuc_gio || []) {
    const v = new Array(n).fill(0);
    for (const s of g.sao || []) v[wIdx.get(s.id)] += 1;
    for (let i = 0; i < n; i += 1) {
      if (!v[i]) continue;
      b[i] += v[i] * g.diem;
      for (let j = 0; j < n; j += 1) A[i][j] += v[i] * v[j];
    }
    rows += 1;
  }
}
const M = A.map((row, i) => [...row, b[i]]);
for (let c = 0; c < n; c += 1) {
  let p = c;
  for (let r = c + 1; r < n; r += 1) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
  [M[c], M[p]] = [M[p], M[c]];
  if (Math.abs(M[c][c]) < 1e-9) continue;
  for (let r = 0; r < n; r += 1) {
    if (r === c) continue;
    const f = M[r][c] / M[c][c];
    if (!f) continue;
    for (let k2 = c; k2 <= n; k2 += 1) M[r][k2] -= f * M[c][k2];
  }
}
const w = new Map();
for (let i = 0; i < n; i += 1) w.set(ids[i], M[i][i] ? M[i][n] / M[i][i] : 0);

let scoreOk = 0; let scoreBad = 0;
for (const iso of keys) {
  for (const g of cal[iso].dinh_cuc_gio || []) {
    const pred = (g.sao || []).reduce((a, s) => a + w.get(s.id), 0);
    if (Math.abs(pred - g.diem) < 1e-6) scoreOk += 1; else scoreBad += 1;
  }
}
console.log(`\nCông thức điểm diem = Σ w[sao]: khớp ${scoreOk}/${rows} | lệch ${scoreBad}`);
const allInt = ids.every((id) => Math.abs(w.get(id) - Math.round(w.get(id))) < 1e-6);
console.log(`   mọi trọng số là số nguyên: ${allInt ? 'có' : 'KHÔNG'}`);

/* ── Dựng bảng cuối ───────────────────────────────────────────────────────── */
const finalCells = {};
let filled = 0; let replaced = 0;
for (let ci = 0; ci < 60; ci += 1) {
  for (let h = 0; h < 12; h += 1) {
    const k = `${ci}|${h}`;
    const built = [...buildCell(ci, h)].sort((a, b) => a - b);
    const src = cells.get(k);
    if (!src) filled += 1;
    else if (src.size !== built.length || built.some((x) => !src.has(x))) replaced += 1;
    finalCells[k] = built;
  }
}
console.log(`\nBảng cuối: lấp ${filled} ô nguồn bỏ trống, sửa ${replaced} ô lệch, giữ nguyên ${720 - filled - replaced} ô.`);

const out = {
  note: 'Bảng giờ chuẩn 60 can-chi × 12 giờ. Sinh bởi scripts/build-gio-table.mjs — đừng sửa tay.',
  sao: ids.map((id) => ({ id, loai: saoMeta.get(id).loai, ten: saoMeta.get(id).ten, w: Math.round(w.get(id) * 1e6) / 1e6 })),
  cells: finalCells,
};
fs.writeFileSync(OUT, JSON.stringify(out));
console.log(`Đã ghi ${path.relative(ROOT, OUT)} (${(fs.statSync(OUT).size / 1024).toFixed(1)} KB)`);

if (scoreBad !== 0) {
  console.error('\n!! Công thức điểm chưa khớp — không nên dùng bảng này.');
  process.exitCode = 1;
}
