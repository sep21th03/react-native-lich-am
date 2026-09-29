"use strict";
/**
 * Hằng số dùng chung cho toàn bộ thư viện.
 * Toàn bộ tên gọi theo tiếng Việt, đúng cách gọi trong lịch vạn niên.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.JD_UNIX_EPOCH = exports.TZ_VN = exports.HUONG_8 = exports.NAP_AM = exports.THU_NGAN = exports.THU = exports.TEN_THANG_AM_FULL = exports.TEN_THANG_AM = exports.TIET_KHI = exports.GIO_RANGE = exports.GIO_CHI = exports.THAN_12_TOT = exports.THAN_12 = exports.TRUC = exports.NGU_HANH = exports.CON_GIAP = exports.CHI = exports.CAN = void 0;
/** 10 Thiên Can */
exports.CAN = [
    'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu',
    'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý',
];
/** 12 Địa Chi */
exports.CHI = [
    'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ',
    'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi',
];
/** 12 con giáp (theo chi của năm) */
exports.CON_GIAP = [
    'Chuột', 'Trâu', 'Hổ', 'Mèo', 'Rồng', 'Rắn',
    'Ngựa', 'Dê', 'Khỉ', 'Gà', 'Chó', 'Lợn',
];
/** Ngũ hành theo đúng thứ tự id mà Lịch Việt dùng: 1=Kim 2=Mộc 3=Thủy 4=Hỏa 5=Thổ */
exports.NGU_HANH = ['', 'Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'];
/** 12 Trực (Thập nhị kiến trừ), bắt đầu từ Kiến */
exports.TRUC = [
    'Kiến', 'Trừ', 'Mãn', 'Bình', 'Định', 'Chấp',
    'Phá', 'Nguy', 'Thành', 'Thu', 'Khai', 'Bế',
];
/**
 * 12 thần (Lục hoàng đạo / Lục hắc đạo) theo đúng thứ tự vòng.
 * Chỉ số 0,1,4,5,7,10 là 6 thần TỐT (hoàng đạo).
 */
exports.THAN_12 = [
    'Thanh long', 'Minh đường', 'Thiên hình', 'Chu tước',
    'Kim quỹ', 'Bảo quang', 'Bạch hổ', 'Ngọc đường',
    'Thiên lao', 'Huyền vũ', 'Tư mệnh', 'Câu trần',
];
/** Vị trí (index) của 6 thần hoàng đạo trong vòng 12 thần */
exports.THAN_12_TOT = [0, 1, 4, 5, 7, 10];
/** 12 giờ theo địa chi: giờ Tý = 23h–01h */
exports.GIO_CHI = exports.CHI;
/** Khung giờ thực tế của từng địa chi (giờ Tý bắt đầu 23:00 hôm trước) */
exports.GIO_RANGE = [
    [23, 1], [1, 3], [3, 5], [5, 7], [7, 9], [9, 11],
    [11, 13], [13, 15], [15, 17], [17, 19], [19, 21], [21, 23],
];
/**
 * 24 Tiết khí, đánh số id theo đúng quy ước của Lịch Việt:
 * id 1 = Xuân phân … id 19 = Đông chí … id 24 = Kinh trập.
 * `lon` là kinh độ mặt trời (độ) tại thời điểm bắt đầu tiết.
 */
exports.TIET_KHI = [
    { id: 1, name: 'Xuân phân', lon: 0 },
    { id: 2, name: 'Thanh minh', lon: 15 },
    { id: 3, name: 'Cốc vũ', lon: 30 },
    { id: 4, name: 'Lập hạ', lon: 45 },
    { id: 5, name: 'Tiểu mãn', lon: 60 },
    { id: 6, name: 'Mang chủng', lon: 75 },
    { id: 7, name: 'Hạ chí', lon: 90 },
    { id: 8, name: 'Tiểu thử', lon: 105 },
    { id: 9, name: 'Đại thử', lon: 120 },
    { id: 10, name: 'Lập thu', lon: 135 },
    { id: 11, name: 'Xử thử', lon: 150 },
    { id: 12, name: 'Bạch lộ', lon: 165 },
    { id: 13, name: 'Thu phân', lon: 180 },
    { id: 14, name: 'Hàn lộ', lon: 195 },
    { id: 15, name: 'Sương giáng', lon: 210 },
    { id: 16, name: 'Lập đông', lon: 225 },
    { id: 17, name: 'Tiểu tuyết', lon: 240 },
    { id: 18, name: 'Đại tuyết', lon: 255 },
    { id: 19, name: 'Đông chí', lon: 270 },
    { id: 20, name: 'Tiểu hàn', lon: 285 },
    { id: 21, name: 'Đại hàn', lon: 300 },
    { id: 22, name: 'Lập xuân', lon: 315 },
    { id: 23, name: 'Vũ thủy', lon: 330 },
    { id: 24, name: 'Kinh trập', lon: 345 },
];
/** Tên tháng âm lịch */
exports.TEN_THANG_AM = [
    '', 'Giêng', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu',
    'Bảy', 'Tám', 'Chín', 'Mười', 'Một', 'Chạp',
];
/** Tên tháng âm lịch viết đầy đủ (dạng "tháng Giêng", "tháng Chạp") */
exports.TEN_THANG_AM_FULL = [
    '', 'tháng Giêng', 'tháng Hai', 'tháng Ba', 'tháng Tư', 'tháng Năm',
    'tháng Sáu', 'tháng Bảy', 'tháng Tám', 'tháng Chín', 'tháng Mười',
    'tháng Một', 'tháng Chạp',
];
/** Thứ trong tuần, bắt đầu từ Chủ nhật để khớp `Date.getDay()` */
exports.THU = [
    'Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư',
    'Thứ năm', 'Thứ sáu', 'Thứ bảy',
];
/** Thứ viết tắt */
exports.THU_NGAN = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
/**
 * Bảng Nạp Âm 60 hoa giáp: index 0..59 ứng với Giáp Tý … Quý Hợi.
 * Mỗi phần tử là [tên nạp âm, ngũ hành].
 */
exports.NAP_AM = [
    ['Hải Trung Kim', 'Kim'], ['Hải Trung Kim', 'Kim'],
    ['Lư Trung Hỏa', 'Hỏa'], ['Lư Trung Hỏa', 'Hỏa'],
    ['Lôi Đình Mộc', 'Mộc'], ['Lôi Đình Mộc', 'Mộc'],
    ['Lộ Bàng Thổ', 'Thổ'], ['Lộ Bàng Thổ', 'Thổ'],
    ['Kiếm Phong Kim', 'Kim'], ['Kiếm Phong Kim', 'Kim'],
    ['Sơn Đầu Hỏa', 'Hỏa'], ['Sơn Đầu Hỏa', 'Hỏa'],
    ['Giản Hạ Thủy', 'Thủy'], ['Giản Hạ Thủy', 'Thủy'],
    ['Thành Đầu Thổ', 'Thổ'], ['Thành Đầu Thổ', 'Thổ'],
    ['Bạch Lạp Kim', 'Kim'], ['Bạch Lạp Kim', 'Kim'],
    ['Dương Liễu Mộc', 'Mộc'], ['Dương Liễu Mộc', 'Mộc'],
    ['Tuyền Trung Thủy', 'Thủy'], ['Tuyền Trung Thủy', 'Thủy'],
    ['Ốc Thượng Thổ', 'Thổ'], ['Ốc Thượng Thổ', 'Thổ'],
    ['Tích Lịch Hỏa', 'Hỏa'], ['Tích Lịch Hỏa', 'Hỏa'],
    ['Tùng Bách Mộc', 'Mộc'], ['Tùng Bách Mộc', 'Mộc'],
    ['Trường Lưu Thủy', 'Thủy'], ['Trường Lưu Thủy', 'Thủy'],
    ['Sa Trung Kim', 'Kim'], ['Sa Trung Kim', 'Kim'],
    ['Sơn Hạ Hỏa', 'Hỏa'], ['Sơn Hạ Hỏa', 'Hỏa'],
    ['Bình Địa Mộc', 'Mộc'], ['Bình Địa Mộc', 'Mộc'],
    ['Bích Thượng Thổ', 'Thổ'], ['Bích Thượng Thổ', 'Thổ'],
    ['Kim Bạch Kim', 'Kim'], ['Kim Bạch Kim', 'Kim'],
    ['Phú Đăng Hỏa', 'Hỏa'], ['Phú Đăng Hỏa', 'Hỏa'],
    ['Thiên Hà Thủy', 'Thủy'], ['Thiên Hà Thủy', 'Thủy'],
    ['Đại Trạch Thổ', 'Thổ'], ['Đại Trạch Thổ', 'Thổ'],
    ['Thoa Xuyến Kim', 'Kim'], ['Thoa Xuyến Kim', 'Kim'],
    ['Tang Đố Mộc', 'Mộc'], ['Tang Đố Mộc', 'Mộc'],
    ['Đại Khê Thủy', 'Thủy'], ['Đại Khê Thủy', 'Thủy'],
    ['Sa Trung Thổ', 'Thổ'], ['Sa Trung Thổ', 'Thổ'],
    ['Thiên Thượng Hỏa', 'Hỏa'], ['Thiên Thượng Hỏa', 'Hỏa'],
    ['Thạch Lựu Mộc', 'Mộc'], ['Thạch Lựu Mộc', 'Mộc'],
    ['Đại Hải Thủy', 'Thủy'], ['Đại Hải Thủy', 'Thủy'],
];
/** 8 hướng chính dùng cho xuất hành */
exports.HUONG_8 = [
    'Chính Bắc', 'Đông Bắc', 'Chính Đông', 'Đông Nam',
    'Chính Nam', 'Tây Nam', 'Chính Tây', 'Tây Bắc',
];
/** Múi giờ mặc định của lịch Việt Nam */
exports.TZ_VN = 7;
/** JD của ngày 1970-01-01 (dùng để quy đổi JD <-> timestamp) */
exports.JD_UNIX_EPOCH = 2440587.5;
