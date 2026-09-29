#!/usr/bin/env node
/**
 * Smoke test — chạy nhanh để chắc chắn package hoạt động sau khi cài.
 *
 *   node scripts/smoke.mjs
 */

import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const core = require(path.join(ROOT, 'lib', 'index.js'));
const ds = require(path.join(ROOT, 'lib', 'dataset', 'index.js'));
const THAN_12 = core.THAN_12;

let pass = 0;
let fail = 0;

function eq(label, got, want) {
  const g = JSON.stringify(got);
  const w = JSON.stringify(want);
  if (g === w) {
    pass += 1;
    console.log(`  ok   ${label}`);
  } else {
    fail += 1;
    console.log(`  FAIL ${label}\n       got  ${g}\n       want ${w}`);
  }
}

function ok(label, cond) {
  eq(label, !!cond, true);
}

console.log('\n── Chuyển đổi dương ⇄ âm ─────────────────────────────');
const tet = core.solarToLunar(10, 2, 2024);
eq('10/02/2024 = mùng 1 tháng Giêng 2024', [tet.day, tet.month, tet.year, tet.leap], [1, 1, 2024, false]);

const back = core.lunarToSolar(1, 1, 2024, false);
eq('mùng 1 tháng Giêng 2024 = 10/02/2024', [back.day, back.month, back.year], [10, 2, 2024]);

const leap = core.solarToLunar(25, 7, 2025);
eq('25/07/2025 nằm trong tháng nhuận', leap.leap, true);

// Chốt hồi quy cho lỗi sóc: chuỗi Meeus rút gọn cũ đặt sóc tháng 7/2026 lệch
// một ngày (12/08 thay vì 13/08), kéo theo sai cả tháng và Tết Trung thu.
const thang7 = core.solarToLunar(12, 8, 2026);
eq('12/08/2026 = 30 tháng Sáu', [thang7.day, thang7.month, thang7.year], [30, 6, 2026]);
const dauThang7 = core.solarToLunar(13, 8, 2026);
eq('13/08/2026 = mùng 1 tháng Bảy', [dauThang7.day, dauThang7.month], [1, 7]);
const trungThu = core.solarToLunar(25, 9, 2026);
eq('Trung thu 2026 = 15/08 âm lịch (25/09/2026)', [trungThu.day, trungThu.month, trungThu.year], [15, 8, 2026]);
eq('tháng nhuận 2025 là tháng 6', core.getLeapMonthOfYear(2025), 6);
eq('năm 2024 không có tháng nhuận', core.getLeapMonthOfYear(2024), 0);

console.log('\n── Can chi / tiết khí / trực ─────────────────────────');
const d1 = core.getLunarDayInfo('2024-01-01');
eq('01/01/2024 → ngày âm', d1.lunar.text, '20/11/2023');
eq('  can chi ngày', d1.canChi.day.name, 'Giáp Tý');
eq('  can chi tháng', d1.canChi.month.name, 'Giáp Tý');
eq('  can chi năm', d1.canChi.year.name, 'Quý Mão');
eq('  con giáp', d1.conGiap, 'Mèo');
eq('  nạp âm ngày', d1.napAm.day.name, 'Hải Trung Kim');
eq('  ngũ hành id (1 = Kim)', d1.nguHanhId, 1);
eq('  tiết khí id (19 = Đông chí)', d1.tietKhi.id, 19);
eq('  trực', d1.truc.name, 'Kiến');
eq('  giờ hoàng đạo', d1.gioHoangDao.map((g) => g.index), [0, 1, 3, 6, 8, 9]);
eq('  hướng xuất hành', d1.huongXuatHanh.hyThan, 'Đông Bắc');

console.log('\n── Đối chiếu nguồn ngoài (bietngay.com, 29/09/2026) ──');
const d2 = core.getLunarDayInfo('2026-09-29');
eq('  can chi ngày Bính Ngọ', d2.canChi.day.name, 'Bính Ngọ');
eq('  giờ hoàng đạo', d2.gioHoangDao.map((g) => g.chi), ['Tý', 'Sửu', 'Mão', 'Ngọ', 'Thân', 'Dậu']);
eq('  hỷ thần', d2.huongXuatHanh.hyThan, 'Tây Nam');
eq('  tài thần', d2.huongXuatHanh.taiThan, 'Tây');
eq('  hạc thần', d2.huongXuatHanh.hacThan, 'Đông');

console.log('\n── Dữ liệu Lịch Việt ─────────────────────────────────');
eq('  khoảng dữ liệu', [ds.LICH_VIET_META.start, ds.LICH_VIET_META.end], ['2024-01-01', '2028-01-01']);
eq('  số ngày', ds.listDayKeys().length, 1462);

const v1 = ds.getDayData('2024-01-01');
ok('  có dữ liệu 01/01/2024', v1);
eq('  ngày âm gốc', v1.lunarRaw, '20-11-2023');
eq('  ngày âm tách đúng day/tháng/năm', [v1.lunar.day, v1.lunar.month, v1.lunar.year], [20, 11, 2023]);
const tet2024 = ds.getDayData('2024-02-10');
eq('  mùng 1 Tết 2024 tách đúng', [tet2024.lunar.day, tet2024.lunar.month, tet2024.lunar.year], [1, 1, 2024]);
eq('  Trung thu 2026 tách đúng', (() => {
  const t = ds.getDayData('2026-09-25').lunar;
  return [t.day, t.month, t.year];
})(), [15, 8, 2026]);
eq('  trực', v1.truc, 'Kiến');
eq('  số sao tốt', v1.saoTot.length, 7);
eq('  số sao xấu', v1.saoXau.length, 5);
ok('  có việc nên làm', v1.nenLam.length > 0);
eq('  đủ 12 khung giờ', v1.gio.length, 12);
ok('  khung giờ tăng dần theo index', v1.gio.every((g, i) => i === 0 || g.index > v1.gio[i - 1].index));
ok('  mỗi giờ có đúng một thần hoàng đạo/hắc đạo',
  v1.gio.every((g) => g.sao.filter((n) => THAN_12.includes(n)).length === 1));
ok('  có hướng theo ngày', v1.huong.ngay.length > 0);
ok('  điểm 0–100', v1.diem >= 0 && v1.diem <= 100);
eq('  ngày không có dữ liệu → null', ds.getDayData('2030-01-01'), null);

// Bảng giờ chuẩn đã lấp ô thiếu và sửa ô sai của nguồn:
//   - `gio`      luôn đủ 12 khung, mỗi khung đúng 1 thần hoàng đạo/hắc đạo
//   - `gioRaw`   giữ nguyên bản gốc (125 ngày chỉ có 11 khung, thiếu giờ Tỵ)
let thieuGio = 0;   // số ngày `gio` không đủ 12
let nhieuThan = 0;  // số khung không đúng 1 thần
let rawThieu = 0;   // số ngày `gioRaw` thiếu khung
let rawThieuKhac = 0;
let suyRa = 0;      // số khung được dựng lại
let daSua = 0;      // số khung được sửa
for (const key of ds.listDayKeys()) {
  const d = ds.getDayData(key);
  if (d.gio.length !== 12) thieuGio += 1;
  for (const g of d.gio) {
    if (g.sao.filter((n) => THAN_12.includes(n)).length !== 1) nhieuThan += 1;
    if (g.nguon === 'suy-ra') suyRa += 1;
    if (g.nguon === 'sua') daSua += 1;
  }
  if (d.gioRaw.length !== 12) {
    rawThieu += 1;
    if (d.gioRaw.length !== 11 || d.gioRaw.some((x) => x.index === 5)) rawThieuKhac += 1;
  }
}
eq('  mọi ngày đều đủ 12 khung giờ', thieuGio, 0);
eq('  mọi khung giờ đúng 1 thần hoàng đạo/hắc đạo', nhieuThan, 0);
eq('  gioRaw: 125 ngày thiếu đúng 1 khung', rawThieu, 125);
eq('  gioRaw: ngày thiếu khung luôn thiếu giờ Tỵ', rawThieuKhac, 0);
eq('  số khung được dựng lại (5 can-chi × 25 ngày)', suyRa, 125);
ok('  số khung được sửa > 0', daSua > 0);

// Chốt hồi quy cho 2 lỗi cụ thể của nguồn.
// (1) Ngày Ất Dậu (2024-01-22): nguồn tính giờ 7..11 theo chi của ngày kế tiếp
//     (Bính Tuất) nên ra Câu trần thay vì Bảo quang ở giờ Mùi.
const atDau = ds.getDayData('2024-01-22');
eq('  Ất Dậu: giờ 7 (Mùi) đã sửa thành Bảo quang',
  atDau.gio[7].sao.filter((n) => THAN_12.includes(n)), ['Bảo quang']);
eq('  Ất Dậu: giờ 7 được đánh dấu đã sửa', atDau.gio[7].nguon, 'sua');
ok('  Ất Dậu: gioRaw giữ nguyên Chu tước của nguồn',
  atDau.gioRaw[7].sao.includes('Chu tước'));

// (2) Ngày Giáp Tý (2024-01-01): nguồn bỏ trống giờ Tỵ (index 5).
const giapTy = ds.getDayData('2024-01-01');
eq('  Giáp Tý: đã lấp đủ 12 khung', giapTy.gio.length, 12);
eq('  Giáp Tý: giờ Tỵ được dựng lại', giapTy.gio[5].nguon, 'suy-ra');
eq('  Giáp Tý: gioRaw chỉ có 11 khung', giapTy.gioRaw.length, 11);
// Chi Tý ⇒ thần ở giờ Tỵ là Huyền vũ (bảng cổ điển), khớp các ngày Bính/Mậu/Canh/Nhâm Tý
eq('  Giáp Tý: giờ Tỵ có Huyền vũ',
  giapTy.gio[5].sao.filter((n) => THAN_12.includes(n)), ['Huyền vũ']);

console.log('\n── Tìm ngày tốt ──────────────────────────────────────');
const good = ds.findGoodDays({ activity: 'Khai trương', from: '2024-01-01', to: '2024-12-31', limit: 3 });
eq('  tìm được 3 ngày khai trương', good.length, 3);
ok('  ngày trả về đều nằm trong "Nên làm"', good.every((d) => d.nenLam.indexOf('Khai trương') >= 0));
ok('  xếp theo điểm giảm dần', good[0].diem >= good[good.length - 1].diem);

const top = ds.topDays('2024-01-01', '2024-12-31', 5);
eq('  top 5 ngày đẹp nhất', top.length, 5);
const stats = ds.getQualityStats('2024-01-01', '2024-12-31');
eq('  thống kê đủ 366 ngày', stats.total, 366);

console.log('\n── Từng năm riêng lẻ ─────────────────────────────────');
const y2024 = require(path.join(ROOT, 'lib', 'dataset', '2024.js'));
eq('  dataset/2024 có 366 ngày', y2024.listDayKeys().length, 366);
ok('  dataset/2024 có dữ liệu 31/12/2024', !!y2024.getDayData('2024-12-31'));
eq('  dataset/2024 KHÔNG có 2025', y2024.getDayData('2025-01-01'), null);

console.log('\n── Định dạng ─────────────────────────────────────────');
eq('  tên ngày âm 1', core.getLunarDayName(1), 'Mùng 1');
eq('  tên ngày âm 15', core.getLunarDayName(15), 'Rằm');
eq('  tên ngày âm 30', core.getLunarDayName(30), 'Ba mươi');
eq('  mô tả đầy đủ', core.describeDay(d1), 'Thứ hai 01/01/2024 — 20 tháng Một, Quý Mão');

console.log(`\n${'═'.repeat(54)}`);
console.log(`  ${pass} pass · ${fail} fail`);
console.log(`${'═'.repeat(54)}\n`);
process.exit(fail === 0 ? 0 : 1);
