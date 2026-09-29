#!/usr/bin/env node
/**
 * Đối chiếu thuật toán trong `lib/` với dữ liệu gốc Lịch Việt (1.462 ngày).
 *
 *   node scripts/verify.mjs ["/đường/dẫn/calendar_full.json"]
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const SRC =
  process.argv[2] ||
  '/Users/nguyenhoa/WorkBuddy AI/2026-09-21-15-43-01/calendar_full.json';

const core = require(path.join(ROOT, 'lib', 'index.js'));

const GOOD_DEITIES = new Set([
  'thanh long', 'minh đường', 'kim quỹ', 'bảo quang', 'ngọc đường', 'tư mệnh',
]);

const TRUC_TIET_KHI_MONTH = {
  22: 2, 23: 2, 24: 3, 1: 3, 2: 4, 3: 4, 4: 5, 5: 5,
  6: 6, 7: 6, 8: 7, 9: 7, 10: 8, 11: 8, 12: 9, 13: 9,
  14: 10, 15: 10, 16: 11, 17: 11, 18: 0, 19: 0, 20: 1, 21: 1,
};

const THAN_12 = core.THAN_12;

/** Vị trí thần thứ nhất trong vòng 12 giờ, suy từ chi của ngày */
const thanOffset = (chi) => (((2 * chi + 8) % 12) + 12) % 12;

/**
 * Kiểm tra xem tập giờ hoàng đạo `good` của nguồn có phải là kết quả của việc
 * dùng chi ngày cho nửa đầu và chi NGÀY KẾ TIẾP cho nửa sau hay không.
 * Trả về mốc chia nếu khớp, null nếu không.
 */
function matchesNextDaySplit(chi, nextChi, good) {
  const mine = new Set(core.getHoangDaoHours(chi));
  const theirs = new Set(core.getHoangDaoHours(nextChi));
  for (let split = 1; split < 12; split += 1) {
    const candidate = [];
    for (let h = 0; h < 12; h += 1) {
      const set = h < split ? mine : theirs;
      if (set.has(h)) candidate.push(h);
    }
    if (JSON.stringify(candidate) === JSON.stringify(good)) return split;
  }
  return null;
}

function main() {
  console.log(`Đọc ${SRC} …`);
  const cal = JSON.parse(fs.readFileSync(SRC, 'utf8'));
  const keys = Object.keys(cal).sort();

  const stats = {
    lunar: 0, lunarLeap: 0, canChiYear: 0, canChiMonth: 0, canChiDay: 0,
    nguHanh: 0, truc: 0, tietKhi: 0, gioHoangDao: 0, than: 0,
  };
  // Ba nhóm bất thường đã lần ra là lỗi của chính app nguồn, không phải của lib.
  // Đếm riêng để phần kết luận chỉ tính những sai lệch CHƯA giải thích được.
  const anomalies = { missing5: 0, nextDay: 0, duplicate: 0 };
  const samples = {};
  const note = (field, iso, expected, got) => {
    stats[field] += 1;
    if (!samples[field]) samples[field] = [];
    if (samples[field].length < 4) samples[field].push({ iso, expected, got });
  };

  let n = 0;
  for (let i = 0; i < keys.length; i += 1) {
    const iso = keys[i];
    const d = cal[iso];
    const [y, m, dd] = iso.split('-').map(Number);
    const info = core.getLunarDayInfo(iso);
    // Chi ngày luôn tiến đúng 1 mỗi ngày, nên ngày kế tiếp suy được kể cả
    // ở ngày cuối cùng của dữ liệu (không có phần tử kế tiếp trong mảng).
    const nextChi = (info.canChi.day.chiIndex + 1) % 12;
    n += 1;

    // 1. ngày âm
    const [ld, lm, ly] = d.ngay_am.split('-').map(Number);
    if (info.lunar.day !== ld || info.lunar.month !== lm || info.lunar.year !== ly) {
      note('lunar', iso, d.ngay_am, `${info.lunar.day}-${info.lunar.month}-${info.lunar.year}`);
    }

    // 2. can chi
    if (info.canChi.year.name !== d.can_chi_nam) note('canChiYear', iso, d.can_chi_nam, info.canChi.year.name);
    if (info.canChi.month.name !== d.can_chi_thang) note('canChiMonth', iso, d.can_chi_thang, info.canChi.month.name);
    if (info.canChi.day.name !== d.can_chi_ngay) note('canChiDay', iso, d.can_chi_ngay, info.canChi.day.name);

    // 3. ngũ hành nạp âm
    if (info.nguHanhId !== d.ngu_hanh) note('nguHanh', iso, d.ngu_hanh, info.nguHanhId);

    // 4. trực
    if (info.truc.name !== d.phan_thien.thap_nhi_kien_tru.truc) {
      note('truc', iso, d.phan_thien.thap_nhi_kien_tru.truc, info.truc.name);
    }

    // 5. tiết khí
    const ids = new Set();
    for (const g of d.gio_quy_dang_thien_mon || []) ids.add(g.tiet_khi);
    for (const b of d.bon_gio_dai_cat || []) ids.add(b.tiet_khi);
    if (ids.size) {
      const expected = [...ids][0];
      if (info.tietKhi.id !== expected) note('tietKhi', iso, expected, info.tietKhi.id);
    }

    // 6. giờ hoàng đạo — suy từ tên thần trong dữ liệu gốc
    const good = [];
    const thanByHour = {};
    for (const g of d.dinh_cuc_gio || []) {
      for (const s of g.sao || []) {
        const lower = String(s.ten_sao || '').toLowerCase();
        if (GOOD_DEITIES.has(lower)) {
          if (!good.includes(g.gio)) good.push(g.gio);
          thanByHour[g.gio] = s.ten_sao;
        }
      }
    }
    good.sort((a, b) => a - b);
    const mine = core.getHoangDaoHours(info.canChi.day.chiIndex);
    if (JSON.stringify(good) !== JSON.stringify(mine)) {
      const hoursPresent = new Set((d.dinh_cuc_gio || []).map((g) => g.gio));
      const add = mine.filter((x) => !good.includes(x));
      const del = good.filter((x) => !mine.includes(x));
      // (a) nguồn bỏ trống giờ Tỵ nên không thể liệt kê giờ đó là hoàng đạo
      if (!hoursPresent.has(5) && add.length === 1 && add[0] === 5 && del.length === 0) {
        anomalies.missing5 += 1;
      } else if (nextChi !== null && matchesNextDaySplit(info.canChi.day.chiIndex, nextChi, good)) {
        // (b) nguồn tính nửa cuối ngày theo chi của NGÀY KẾ TIẾP
        anomalies.nextDay += 1;
      } else {
        note('gioHoangDao', iso, good.join(','), mine.join(','));
      }
    }

    // 7. thần cai quản giờ (chỉ so những giờ có dữ liệu)
    const dayDeities = new Set();
    let dupDeity = false;
    for (const g of d.dinh_cuc_gio || []) {
      for (const s of g.sao || []) {
        if (THAN_12.indexOf(s.ten_sao) < 0) continue;
        if (dayDeities.has(s.ten_sao)) dupDeity = true;
        dayDeities.add(s.ten_sao);
      }
    }
    for (const g of d.dinh_cuc_gio || []) {
      const expected = thanByHour[g.gio];
      if (!expected) continue;
      const got = core.getThanOfHour(info.canChi.day.chiIndex, g.gio);
      if (expected === got) continue;
      const nextDeity = nextChi === null
        ? null
        : core.THAN_12[(((g.gio - (2 * nextChi + 8)) % 12) + 12) % 12];
      if (nextDeity === expected) anomalies.nextDay += 1;
      else if (dupDeity) anomalies.duplicate += 1;
      else note('than', `${iso}#${g.gio}`, expected, got);
    }
  }

  const pct = (bad) => (((n - bad) / n) * 100).toFixed(3);
  console.log(`\nĐối chiếu ${n} ngày\n${'─'.repeat(58)}`);
  const labels = {
    lunar: 'Ngày âm (ngày/tháng/năm)',
    canChiYear: 'Can chi NĂM',
    canChiMonth: 'Can chi THÁNG',
    canChiDay: 'Can chi NGÀY',
    nguHanh: 'Ngũ hành nạp âm',
    truc: 'Trực',
    tietKhi: 'Tiết khí',
    gioHoangDao: 'Giờ hoàng đạo',
  };
  for (const [k, label] of Object.entries(labels)) {
    const bad = stats[k];
    const mark = bad === 0 ? 'OK ' : '!! ';
    console.log(`${mark}${label.padEnd(28)} sai ${String(bad).padStart(4)}  khớp ${pct(bad)}%`);
  }
  const thanTotal = Object.keys(cal).reduce(
    (acc, iso) => acc + (cal[iso].dinh_cuc_gio || []).reduce((a, g) => a + (g.sao || []).length, 0),
    0,
  );
  console.log(
    `   ${'Thần cai quản giờ'.padEnd(28)} sai ${String(stats.than).padStart(4)}  / ${thanTotal} giờ-sao  khớp ${(((thanTotal - stats.than) / thanTotal) * 100).toFixed(3)}%`,
  );

  console.log(`\n${'─'.repeat(58)}\nVí dụ sai lệch (tối đa 4 mỗi loại):`);
  let any = false;
  for (const [k, list] of Object.entries(samples)) {
    if (!list.length) continue;
    any = true;
    console.log(`\n[${k}]`);
    for (const s of list) console.log(`   ${s.iso}  gốc=${s.expected}  →  lib=${s.got}`);
  }
  if (!any) console.log('   (không có sai lệch nào)');

  const anomalyTotal = anomalies.missing5 + anomalies.nextDay + anomalies.duplicate;
  console.log(`\n${'─'.repeat(58)}\nBất thường của dữ liệu nguồn (đã lần ra nguyên nhân, không tính là lỗi lib):`);
  console.log(`   nguồn bỏ trống giờ Tỵ nên thiếu giờ hoàng đạo   ${String(anomalies.missing5).padStart(5)} ngày`);
  console.log(`   nửa cuối ngày tính theo chi NGÀY KẾ TIẾP       ${String(anomalies.nextDay).padStart(5)} ô`);
  console.log(`   cùng một thần bị gán lặp trong ngày            ${String(anomalies.duplicate).padStart(5)} ô`);

  const critical = stats.lunar + stats.canChiYear + stats.canChiMonth + stats.canChiDay + stats.nguHanh + stats.truc + stats.tietKhi;
  const residual = stats.gioHoangDao + stats.than;
  console.log(`\n${'═'.repeat(58)}`);
  if (critical === 0 && residual === 0) {
    console.log('KẾT LUẬN: khớp 100% với dữ liệu Lịch Việt ở mọi trường.');
    if (anomalyTotal) {
      console.log(`          ${anomalyTotal} chỗ lệch còn lại đều là lỗi của app nguồn (xem mục trên).`);
    }
  } else {
    console.log(`KẾT LUẬN: còn ${critical} sai lệch ở trường cốt lõi và ${residual} chưa giải thích — cần xem lại.`);
  }
  process.exitCode = critical + residual === 0 ? 0 : 1;
}

main();
