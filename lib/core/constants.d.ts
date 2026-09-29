/**
 * Hằng số dùng chung cho toàn bộ thư viện.
 * Toàn bộ tên gọi theo tiếng Việt, đúng cách gọi trong lịch vạn niên.
 */
/** 10 Thiên Can */
export declare const CAN: readonly ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
/** 12 Địa Chi */
export declare const CHI: readonly ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
/** 12 con giáp (theo chi của năm) */
export declare const CON_GIAP: readonly ["Chuột", "Trâu", "Hổ", "Mèo", "Rồng", "Rắn", "Ngựa", "Dê", "Khỉ", "Gà", "Chó", "Lợn"];
/** Ngũ hành theo đúng thứ tự id mà Lịch Việt dùng: 1=Kim 2=Mộc 3=Thủy 4=Hỏa 5=Thổ */
export declare const NGU_HANH: readonly ["", "Kim", "Mộc", "Thủy", "Hỏa", "Thổ"];
/** 12 Trực (Thập nhị kiến trừ), bắt đầu từ Kiến */
export declare const TRUC: readonly ["Kiến", "Trừ", "Mãn", "Bình", "Định", "Chấp", "Phá", "Nguy", "Thành", "Thu", "Khai", "Bế"];
/**
 * 12 thần (Lục hoàng đạo / Lục hắc đạo) theo đúng thứ tự vòng.
 * Chỉ số 0,1,4,5,7,10 là 6 thần TỐT (hoàng đạo).
 */
export declare const THAN_12: readonly ["Thanh long", "Minh đường", "Thiên hình", "Chu tước", "Kim quỹ", "Bảo quang", "Bạch hổ", "Ngọc đường", "Thiên lao", "Huyền vũ", "Tư mệnh", "Câu trần"];
/** Vị trí (index) của 6 thần hoàng đạo trong vòng 12 thần */
export declare const THAN_12_TOT: readonly [0, 1, 4, 5, 7, 10];
/** 12 giờ theo địa chi: giờ Tý = 23h–01h */
export declare const GIO_CHI: readonly ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
/** Khung giờ thực tế của từng địa chi (giờ Tý bắt đầu 23:00 hôm trước) */
export declare const GIO_RANGE: ReadonlyArray<readonly [number, number]>;
/**
 * 24 Tiết khí, đánh số id theo đúng quy ước của Lịch Việt:
 * id 1 = Xuân phân … id 19 = Đông chí … id 24 = Kinh trập.
 * `lon` là kinh độ mặt trời (độ) tại thời điểm bắt đầu tiết.
 */
export declare const TIET_KHI: ReadonlyArray<{
    id: number;
    name: string;
    lon: number;
}>;
/** Tên tháng âm lịch */
export declare const TEN_THANG_AM: readonly ["", "Giêng", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy", "Tám", "Chín", "Mười", "Một", "Chạp"];
/** Tên tháng âm lịch viết đầy đủ (dạng "tháng Giêng", "tháng Chạp") */
export declare const TEN_THANG_AM_FULL: readonly ["", "tháng Giêng", "tháng Hai", "tháng Ba", "tháng Tư", "tháng Năm", "tháng Sáu", "tháng Bảy", "tháng Tám", "tháng Chín", "tháng Mười", "tháng Một", "tháng Chạp"];
/** Thứ trong tuần, bắt đầu từ Chủ nhật để khớp `Date.getDay()` */
export declare const THU: readonly ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
/** Thứ viết tắt */
export declare const THU_NGAN: readonly ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
/**
 * Bảng Nạp Âm 60 hoa giáp: index 0..59 ứng với Giáp Tý … Quý Hợi.
 * Mỗi phần tử là [tên nạp âm, ngũ hành].
 */
export declare const NAP_AM: ReadonlyArray<readonly [string, string]>;
/** 8 hướng chính dùng cho xuất hành */
export declare const HUONG_8: readonly ["Chính Bắc", "Đông Bắc", "Chính Đông", "Đông Nam", "Chính Nam", "Tây Nam", "Chính Tây", "Tây Bắc"];
/** Múi giờ mặc định của lịch Việt Nam */
export declare const TZ_VN = 7;
/** JD của ngày 1970-01-01 (dùng để quy đổi JD <-> timestamp) */
export declare const JD_UNIX_EPOCH = 2440587.5;
