# react-native-lich-am

Thư viện **lịch âm (âm lịch Việt Nam)** cho React Native và JavaScript.

- Thuật toán thuần, **không phụ thuộc thư viện nào**, không cần native module
- Kèm **bộ dữ liệu chi tiết 1.462 ngày** (01/01/2024 → 01/01/2028): sao tốt/xấu, việc nên làm, điểm từng giờ, hướng tốt, tuổi xung
- Kèm component `<LunarCalendar />` và `<LunarDayDetail />` sẵn dùng
- TypeScript đầy đủ, chạy được trên Hermes, Expo, Node, trình duyệt

```bash
npm i react-native-lich-am
```

---

## Nội dung

| Entry point | Nội dung | Kích thước |
|---|---|---|
| `react-native-lich-am` | Core thuật toán — không có dữ liệu | ~40 KB |
| `react-native-lich-am/dataset` | Dữ liệu chi tiết 2024–2028 | ~0,96 MB |
| `react-native-lich-am/dataset/2024` | Chỉ một năm | ~0,25 MB |
| `react-native-lich-am/ui` | Component React Native | ~15 KB |

Nếu chỉ cần đổi ngày dương ↔ âm thì import entry gốc là đủ, bundle không tăng.

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
d.lunarRaw;      // "19-8-2026" (đúng như dữ liệu gốc)
d.saoTot;        // ["Thiên ân", "Nguyệt ân", ...]
d.saoXau;        // ["Thiên hỏa", "Nguyệt yếm", ...]
d.nenLam;        // ["Cầu cúng", "Khai trương", ...]
d.khongNenLam;   // ["Động thổ", "An táng", ...]
d.gio;           // đủ 12 giờ: { index, chi, diem, sao, top, nguon }
d.gioRaw;        // giờ nguyên bản của nguồn (11 hoặc 12 phần tử, có thể còn lỗi)
d.gioTotNhat;    // 5 giờ tốt nhất theo thang điểm riêng của app
d.bonGioDaiCat;  // 4 giờ đại cát (Thiên ất / Thiên không)
d.gioQuyDangThienMon;
d.huong.ngay;    // [{ son: "Khôn", huong: "Chính Tây Nam", soSao: 4 }, ...]
d.tuoiXung;      // ["Mậu Tý", "Nhâm Tý", "Giáp Ngọ", ...]
d.diem;          // 0–100
d.chatLuong;     // 'dep' | 'tot' | 'bt' | 'xau' | 'ratxau'
d.ngayRatXau;    // boolean
```

### `d.gio` — 12 khung giờ, đã lấp ô thiếu và sửa ô sai

Dữ liệu gốc có 3 loại lỗi (xem [Bất thường của dữ liệu nguồn](#bất-thường-của-dữ-liệu-nguồn)).
Thư viện dựng lại toàn bộ lưới giờ từ bảng chuẩn `60 can-chi × 12 giờ`
(`scripts/build-gio-table.mjs`), nên `d.gio` **luôn đủ 12 khung** và mỗi khung
**luôn đúng đúng một thần hoàng đạo/hắc đạo**. Trường `nguon` cho biết xuất xứ:

| `nguon` | Nghĩa | Số lượng |
|---|---|---|
| `nguon` | nguyên vẹn như dữ liệu gốc | 17.142 khung |
| `sua` | gốc sai, đã tính lại theo luật cổ điển | 277 khung |
| `suy-ra` | gốc bỏ trống, đã dựng lại | 125 khung |

277 khung bị sửa nằm gọn trong 7 can-chi: **Ất Dậu** (125), **Canh Ngọ** (50),
**Quý Tỵ** (24), **Ất Mão** (24), **Bính Thìn** (24), **Kỷ Mùi** (24), **Giáp Ngọ** (6).

Muốn dữ liệu y như bản gốc thì đọc `d.gioRaw`. Lưu ý `d.gioTotNhat` vẫn theo
**thang điểm riêng của app**, không so được với `d.gio[].diem`.

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

> Với **một việc cụ thể**, thư viện dùng thẳng dữ liệu gốc: việc đó có nằm trong
> nhóm **"Nên làm"** của ngày hay không — không suy diễn thêm.

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

## Độ chính xác

Thuật toán được đối chiếu với **1.462 ngày** dữ liệu gốc (`npm run verify`):

| Trường | Khớp |
|---|---|
| Ngày âm (ngày/tháng/năm, kể cả tháng nhuận) | 1462/1462 |
| Can chi năm / tháng / ngày | 1462/1462 |
| Ngũ hành nạp âm của ngày | 1462/1462 |
| Trực | 1462/1462 |
| Tiết khí (24 tiết) | 1462/1462 |
| Giờ hoàng đạo | 1462/1462 |
| Thần cai quản từng giờ | 43.541/43.541 giờ-sao |

Còn **206 chỗ** lệch giữa *thuật toán* và *dữ liệu gốc*, nhưng đều là **lỗi của chính
app nguồn** — đã lần ra nguyên nhân và `verify` đếm riêng, không tính vào kết quả:

| Loại | Số lượng | Nguyên nhân |
|---|---|---|
| Thiếu giờ hoàng đạo | 75 ngày | nguồn bỏ trống khung giờ Tỵ nên không liệt kê được |
| Nửa cuối ngày sai chi | 100 ô | nguồn tính giờ từ index 7 trở đi theo chi của **ngày kế tiếp** |
| Thần bị gán lặp | 31 ô | nguồn gán cùng một thần cho 2 giờ trong ngày |

Ví dụ kiểm chứng được: ngày Ất Dậu, tập giờ hoàng đạo của nguồn đúng bằng
*hợp của* tập chuẩn cho giờ 0–6 và tập của ngày kế tiếp cho giờ 7–11.

Bảng giờ hoàng đạo và hướng xuất hành cũng khớp với nguồn độc lập (bietngay.com,
29/09/2026 — ngày Bính Ngọ: Tý Sửu Mão Ngọ Thân Dậu · Hỷ Tây Nam · Tài Tây · Hạc Đông).

---

## Bất thường của dữ liệu nguồn

App Lịch Việt có lỗi rải rác trong bảng giờ. Thư viện **không copy nguyên** mà
dựng lại lưới giờ từ bảng chuẩn (xem [`d.gio`](#dgio--12-khung-giờ-đã-lấp-ô-thiếu-và-sửa-ô-sai)),
đồng thời giữ bản gốc ở `d.gioRaw`. Bảy can-chi bị ảnh hưởng:

| Can-chi ngày | Số khung | Lỗi |
|---|---|---|
| **Ất Dậu** | 125 | giờ 7–11 tính theo chi của ngày kế tiếp (Bính Tuất) |
| **Canh Ngọ** | 50 | giờ 2 và 6 sai/lặp thần |
| **Quý Tỵ** | 24 | giờ 7 sai thần, thiếu Tuần trung không vong và Ngũ bất ngộ |
| **Ất Mão** | 24 | giờ 11 thừa Câu trần |
| **Bính Thìn** | 24 | giờ 5 thiếu Triệt lộ không vong |
| **Kỷ Mùi** | 24 | giờ 8 thiếu Triệt lộ không vong |
| **Giáp Ngọ** | 6 | giờ 3 thừa Thanh long |

Ngoài ra nguồn **bỏ trống hẳn khung giờ Tỵ** cho 5 can-chi đầu vòng lục giáp
(Giáp Tý, Ất Sửu, Bính Dần, Đinh Mão, Mậu Thìn) ⇒ 125 ngày chỉ có 11 khung.

Bảng chuẩn được kiểm chứng lại trên **704/715 ô** dữ liệu gốc; 11 ô còn lại đúng là
các ô lỗi nêu trên, và ở mỗi ô thuật toán cổ điển đều đúng còn nguồn sai.

---

## Kiểm chứng

`lib/` là **bản dựng sẵn đã commit** — cài là chạy, không cần bước build.

```bash
npm run smoke            # kiểm tra nhanh (66 assert): chuyển đổi, can chi, dữ liệu, lấp/sửa giờ
npm run verify           # đối chiếu toàn bộ 1.462 ngày với calendar_full.json (cần file nguồn)
npm run build            # dựng lại lib/ từ src/ (TypeScript)
npm run build:gio-table  # dựng lại bảng giờ chuẩn từ calendar_full.json
```

`verify` kiểm ở **hai tầng**: thuật toán trong `lib/` so với dữ liệu gốc, và lớp
dataset sau khi lấp ô thiếu / sửa ô sai — cả hai đều phải 0 sai lệch.

`verify` và `build:gio-table` cần đường dẫn tới `calendar_full.json`:

```bash
node scripts/verify.mjs "/Users/nguyenhoa/WorkBuddy AI/2026-09-21-15-43-01/calendar_full.json"
```

---

## Cấu trúc repo

```
lib/                      bản JS đã dựng (được publish, cài là chạy)
  index.js                core — không phụ thuộc gì
  dataset/                decode + index + 2024…2028
  dataset/data/           dict.json + days-YYYY.json + gio-table.json
  ui/                     <LunarCalendar/> & <LunarDayDetail/>
src/                      nguồn TypeScript tương ứng (nguồn chân lý)
  core/ dataset/ ui/
src/dataset/data/         dữ liệu nguồn để build chép sang lib/
scripts/
  build-dataset.mjs       calendar_full.json  →  src/dataset/data/days-YYYY.json
  build-gio-table.mjs     calendar_full.json  →  src/dataset/data/gio-table.json
  build.mjs               src/ (TS)  →  lib/ (JS + .d.ts) + data + proxy subpath
  smoke.mjs               kiểm tra nhanh
  verify.mjs              đối chiếu 1.462 ngày với dữ liệu gốc (2 tầng)
core/ dataset/ ui/        proxy package.json cho bundler không hỗ trợ "exports"
```

---


## Ghi chú kỹ thuật

- **Múi giờ**: mặc định UTC+7 (lịch Việt Nam). Mọi hàm đều nhận tham số `timeZone` nếu cần.
- **Sóc (new moon)** dùng chuỗi Meeus 49.1 + 49.2 đầy đủ, kể cả nhiễu hành tinh — chính xác
  cỡ vài chục giây. Bản rút gọn của Hồ Ngọc Đức sai tới ~15 phút và từng làm lệch hẳn một
  tháng âm (tháng 7/2026) ở những kỳ sóc rơi sát nửa đêm.
- **Tiết khí** ấn định cho ngày mà **thời điểm giao tiết rơi vào**, nên vị trí mặt trời được
  lấy ở **cuối ngày** địa phương chứ không phải 00:00. Lấy mốc đầu ngày sẽ lùi tiết khí
  (và kéo theo Trực) ở đúng những ngày giao tiết.
- **Trực** tính theo **chi tháng tiết khí** (Lập xuân → Dần, …), không phải tháng âm.
- **Can chi tháng** tính theo **tháng âm** (Ngũ Hổ Độn); can chi giờ theo Ngũ Thử Độn.
- **Giờ hoàng đạo** sinh từ công thức `(2 × chi ngày + 8) mod 12` — cho ra đúng bảng cổ điển.
- **Điểm ngày đẹp** là chỉ số tổng hợp do thư viện tính (không phải điểm chính thức của Lịch Việt):
  `1,0 × sao tốt − 1,2 × sao xấu − 3,0 × (ngày rất xấu) + (tổng điểm giờ tốt)/4 + hệ số Trực`,
  rồi quy về thang 0–100 theo phân vị trên toàn bộ 1.462 ngày.

---

## Giấy phép & dữ liệu

Mã nguồn thuật toán: **MIT**.

Bộ dữ liệu trong `dataset/` được trích xuất từ ứng dụng **Lịch Việt**
(`com.somestudio.lichvietnam`) và thuộc quyền của Lịch Việt — dùng cho mục đích
cá nhân / tham khảo. Phát hành lại hoặc thương mại hoá cần sự đồng ý của họ.

Nội dung can chi, sao tốt xấu, giờ hoàng đạo là **tham khảo văn hoá**, không phải
lời khuyên về tài chính, y tế hay pháp lý.
