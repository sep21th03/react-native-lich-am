# react-native-lich-am

[![CI](https://github.com/sep21th03/react-native-lich-am/actions/workflows/ci.yml/badge.svg)](https://github.com/sep21th03/react-native-lich-am/actions/workflows/ci.yml)

Thư viện **lịch âm (âm lịch Việt Nam)** cho React Native và JavaScript.

- Thuật toán thuần — **không phụ thuộc thư viện nào**, không cần native module
- **Không cần build**: `lib/` đã dựng sẵn trong package
- Kèm **dữ liệu chi tiết 1.462 ngày** (01/01/2024 → 01/01/2028): sao tốt/xấu, việc nên làm, điểm từng giờ, hướng tốt, tuổi xung
- Kèm component `<LunarCalendar />` và `<LunarDayDetail />` sẵn dùng
- TypeScript đầy đủ — chạy trên Hermes, Expo, Node và trình duyệt

---

## Cài đặt

```bash
npm i react-native-lich-am
# hoặc: yarn add react-native-lich-am | pnpm add react-native-lich-am
```

Yêu cầu (chỉ khi dùng phần component): `react >= 17`, `react-native >= 0.64`.
Hai gói này là **peer dependency tuỳ chọn** — chỉ dùng phần core/dữ liệu thì không cần.

---

## Chọn entry point

| Entry point | Nội dung | Kích thước |
|---|---|---|
| `react-native-lich-am` | Core thuật toán — không kèm dữ liệu | ~60 KB |
| `react-native-lich-am/dataset` | Dữ liệu chi tiết 2024–2028 | ~1 MB |
| `react-native-lich-am/dataset/2024` | Chỉ một năm | ~245 KB |
| `react-native-lich-am/ui` | Component React Native | ~52 KB |

Chỉ cần đổi ngày dương ↔ âm thì import entry gốc là đủ, bundle không tăng.

---

## Dùng cơ bản

```ts
import { getLunarDayInfo, getTodayLunar, solarToLunar, lunarToSolar } from 'react-native-lich-am';

const info = getLunarDayInfo(new Date());

info.solar.iso;              // "2026-09-29"
info.lunar.text;             // "19/8/2026"
info.lunar.monthNameFull;    // "tháng Tám"
info.canChi.day.name;        // "Bính Ngọ"
info.canChi.year.name;       // "Bính Ngọ"  (can chi năm)
info.conGiap;                // "Ngựa"
info.napAm.day.name;         // "Thiên Hà Thủy"
info.tietKhi.name;           // "Thu phân"
info.truc.name;              // "Bình"
info.gioHoangDao.map(g => `${g.chi} ${g.range}`);
// ["Tý 23:00 – 00:59", "Sửu 01:00 – 02:59", ...]
info.huongXuatHanh;          // { hyThan: "Tây Nam", taiThan: "Tây", hacThan: "Đông" }
```

### Chuyển đổi

```ts
solarToLunar(10, 2, 2024);
// { day: 1, month: 1, year: 2024, leap: false, jd: 2460351 }  → mùng 1 Tết Giáp Thìn

lunarToSolar(1, 1, 2024);
// { day: 10, month: 2, year: 2024, jd: 2460351 }

solarToLunar(25, 7, 2025).leap;   // true  (tháng 6 nhuận năm 2025)
```

### Ngày âm hôm nay

```ts
getTodayLunar();   // { day, month, year, leap, monthName, text }
```

---

## Dữ liệu chi tiết theo ngày

```ts
import { getDayData, findGoodDays, topDays, getQualityStats, listActivities } from 'react-native-lich-am/dataset';

const d = getDayData('2026-09-29');

d.lunar;         // { day: 19, month: 8, year: 2026 }
d.lunarRaw;      // "19-8-2026"
d.saoTot;        // ["Thiên ân", "Nguyệt ân", ...]
d.saoXau;        // ["Thiên hỏa", "Nguyệt yếm", ...]
d.nenLam;        // ["Cầu cúng", "Khai trương", ...]
d.khongNenLam;   // ["Động thổ", "An táng", ...]
d.gio;           // đủ 12 khung: { index, chi, diem, sao, top, nguon }
d.gioRaw;        // 12 khung ở dạng chưa chuẩn hoá
d.gioTotNhat;    // 5 giờ tốt nhất (thang điểm riêng, xem ghi chú bên dưới)
d.bonGioDaiCat;  // 4 giờ đại cát (Thiên ất / Thiên không)
d.gioQuyDangThienMon;
d.huong.ngay;    // [{ son: "Khôn", huong: "Chính Tây Nam", soSao: 4 }, ...]
d.tuoiXung;      // ["Mậu Tý", "Nhâm Tý", "Giáp Ngọ", ...]
d.diem;          // 0–100
d.chatLuong;     // 'dep' | 'tot' | 'bt' | 'xau' | 'ratxau'
d.ngayRatXau;    // boolean
```

### `d.gio` — luôn đủ 12 khung giờ

Mỗi khung có dạng `{ index, chi, diem, sao, top, nguon }`:

- `diem` — điểm của giờ, tính bằng `Σ trọng số các sao` chiếu vào giờ đó
- `sao` — danh sách sao; luôn có **đúng một** thần hoàng đạo/hắc đạo
- `nguon` — `'nguon' | 'sua' | 'suy-ra'`, mức độ can thiệp so với dữ liệu thô
- `gioRaw` — bản thô chưa chuẩn hoá, nếu bạn cần đối chiếu

`d.gio` luôn có **12 phần tử** với `index` từ 0 (Tý) đến 11 (Hợi), nên render lưới
giờ không cần kiểm tra thiếu phần tử.

### Tìm ngày tốt cho một việc

```ts
listActivities();   // 31 việc: "Thành hôn", "Khai trương", "Động thổ", ...

const days = findGoodDays({
  activity: 'Khai trương',
  from: '2026-10-01',
  to: '2026-12-31',
  minQuality: 'tot',
  excludeVeryBad: true,
  limit: 10,
});
// → 10 ngày, xếp theo điểm giảm dần
```

Với **một việc cụ thể**, thư viện dùng thẳng dữ liệu: việc đó có nằm trong nhóm
**"Nên làm"** của ngày hay không — không suy diễn thêm.

```ts
topDays('2026-10-01', '2026-10-31', 5);      // 5 ngày đẹp nhất tháng
getQualityStats('2026-01-01', '2026-12-31'); // { dep, tot, bt, xau, ratxau, total, avgDiem }
```

---

## Component

```tsx
import { LunarCalendar, LunarDayDetail } from 'react-native-lich-am/ui';
import { getDayData } from 'react-native-lich-am/dataset';
import { getLunarDayInfo } from 'react-native-lich-am';
import { useState } from 'react';

export default function App() {
  const [info, setInfo] = useState(() => getLunarDayInfo(new Date()));

  return (
    <>
      <LunarCalendar
        dayDataProvider={getDayData}      // có → tô màu chất lượng ngày + hiện chú thích
        onSelectDay={(day) => setInfo(day)}
        weekStartsOn={1}                  // tuần bắt đầu từ Thứ hai
        colorScheme="light"               // 'light' | 'dark'
      />
      <LunarDayDetail day={info} data={getDayData(info.solar.iso)} />
    </>
  );
}
```

`<LunarDayDetail />` có prop `sections` để chọn phần hiển thị:
`'canchi' | 'gio' | 'sao' | 'viec' | 'huong' | 'tuoixung'`.

### Tuỳ biến màu

```tsx
<LunarCalendar
  theme={{ primary: '#0EA5E9', radius: 16, quality: { dep: '#22C55E' } }}
/>
```

---

## Đã kiểm chứng

Đối chiếu trên **1.462 ngày** liên tục:

| Trường | Khớp |
|---|---|
| Ngày âm (ngày/tháng/năm, kể cả tháng nhuận) | 1462/1462 |
| Can chi năm / tháng / ngày | 1462/1462 |
| Ngũ hành nạp âm của ngày | 1462/1462 |
| Trực | 1462/1462 |
| Tiết khí (24 tiết) | 1462/1462 |
| Giờ hoàng đạo | 1462/1462 |
| Thần cai quản từng giờ | 43.541/43.541 |

Bảng giờ hoàng đạo và hướng xuất hành cũng đối chiếu khớp với nguồn độc lập
(29/09/2026 — ngày Bính Ngọ: Tý Sửu Mão Ngọ Thân Dậu · Hỷ Tây Nam · Tài Tây · Hạc Đông).

---

## Ghi chú kỹ thuật

- **Múi giờ**: mặc định UTC+7 (lịch Việt Nam). Mọi hàm đều nhận tham số `timeZone` nếu cần.
- **Sóc (new moon)** dùng chuỗi Meeus 49.1 + 49.2 đầy đủ, kể cả số hạng nhiễu hành tinh —
  chính xác cỡ vài chục giây, đủ để không lệch ngày ở những kỳ sóc rơi sát nửa đêm.
- **Tiết khí** ấn định cho ngày mà **thời điểm giao tiết rơi vào**, nên vị trí mặt trời
  được lấy ở **cuối ngày** địa phương chứ không phải 00:00.
- **Trực** tính theo **chi tháng tiết khí** (Lập xuân → Dần, …), không phải tháng âm.
- **Can chi tháng** tính theo **tháng âm** (Ngũ Hổ Độn); can chi giờ theo Ngũ Thử Độn.
- **Giờ hoàng đạo** sinh từ công thức `(2 × chi ngày + 8) mod 12` — cho ra đúng bảng cổ điển.
- **Điểm ngày đẹp** (`d.diem`) là chỉ số tổng hợp do thư viện tính:
  `1,0 × sao tốt − 1,2 × sao xấu − 3,0 × (ngày rất xấu) + (tổng điểm giờ tốt)/4 + hệ số Trực`,
  rồi quy về thang 0–100 theo phân vị trên toàn bộ 1.462 ngày.
- **`d.gioTotNhat` dùng thang điểm riêng**, không so được với `d.gio[].diem`.
- **`d.tuoiXung`** là dữ liệu tra cứu, không suy ra từ công thức.

---

## Phát triển

```bash
npm run smoke     # 66 assert, chạy trong 1 giây
npm run build     # dựng lại lib/ từ src/ (TypeScript)
```

`lib/` là bản dựng sẵn đã commit — người dùng cài là chạy, không cần build.
CI dựng lại `lib/` từ `src/` và so với bản đã commit, nên nhớ chạy `npm run build`
trước khi push.

```
src/            nguồn TypeScript (nguồn chân lý)
  core/         thuật toán — không phụ thuộc gì
  dataset/      giải mã dữ liệu + tra cứu
  ui/           component React Native
lib/            bản JS đã dựng (được publish)
core/ dataset/ ui/   proxy cho bundler không hỗ trợ trường "exports"
```

---

## Giấy phép

**MIT** — xem [LICENSE](./LICENSE).

Bộ dữ liệu lịch kèm theo chỉ nên dùng cho mục đích cá nhân / tham khảo.

Nội dung can chi, sao tốt xấu, giờ hoàng đạo là **tham khảo văn hoá**, không phải
lời khuyên về tài chính, y tế hay pháp lý.
