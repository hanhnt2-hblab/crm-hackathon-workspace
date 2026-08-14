// `AD-CR-3` — hai họ lỗi, KHÔNG trộn.
//
// `GateDenied`  — Cổng từ chối. Thao tác chưa bao giờ bắt đầu.
//   → khai ở `@/capability/errors`, KHÔNG ở đây. Xem ghi chú dưới.
// `BusinessRuleError` — capability đã chạy và lõi bác vì một luật nghiệp vụ.
//
// Trộn hai họ này là làm `T-10` không phân biệt được *"chính sách chặn"* với
// *"capability vốn không tồn tại"* — mà đó đúng là điều `T-10` phải chứng minh.
//
// ⚠ `DenyReason` và `GateDenied` ĐÃ RỜI TỆP NÀY (Cục 0, 14/8).
//   · Từ vựng sáu mã giờ là `GateDenyReason`, khai ở `@/autonomy/gate` — tầng ③
//     sở hữu nó (`AD-GT-12`), và một bản sao ở lõi là nguồn sự thật thứ hai.
//   · Lớp `GateDenied` giờ ở `@/capability/errors` — tầng ④ là nơi DUY NHẤT đọc
//     `GateDecision` rồi quyết biến nó thành một lần ném (`AD-GT-9`: Cổng TRẢ VỀ
//     từ chối, không ném). Lõi không bao giờ thấy một từ chối của Cổng: lời gọi
//     bị chặn thì lõi chưa từng chạy.

/// Từ vựng ĐÓNG mã lỗi nghiệp vụ. Tầng ① ánh xạ sang HTTP và chữ hiển thị;
/// `tests/` khẳng định theo MÃ, không theo thông điệp.
///
/// MỖI MÃ Ở ĐÂY PHẢI TỒN TẠI SẴN Ở THƯỢNG NGUỒN — sổ đăng ký `BR-D*`/`NFR-*`
/// của PRD §7.1/§9, hoặc một `AD` của spine kiến trúc. Bịa một mã mới ở tầng mã
/// là dựng nguồn sự thật thứ hai, đúng thứ PRD cấm.
///
/// ⚠ `BR-D3` là luật **Bản lưu ↔ Công ty**, KHÔNG phải luật giai đoạn.
///
/// ⚠ KHÔNG có mã cho *"mở lại Cơ hội đã đóng cần vai Quản trị"* (`D43`). Đó là
/// **chính sách quyền**, và `AD-CR-10` chốt lõi không đọc `actor.role`; nó ra
/// khỏi Cổng dưới dạng `GateDenied("role")`. Trộn nó vào đây là trộn đúng hai
/// họ lỗi mà đầu tệp này cấm trộn.
export type BusinessRuleCode =
  | "BR-D1" | "BR-D2" | "BR-D3" | "BR-D4" | "BR-D5" | "BR-D6"
  | "BR-D7" | "BR-D8" | "BR-D9" | "BR-D10" | "BR-D11"
  | "NFR-14" | "NFR-15" | "NFR-16" | "NFR-17" | "NFR-19"
  /// Máy trạng thái Cơ hội. BỐN mã này do `AD-CR-1` và `AD-CR-3` ĐẶT TÊN, không
  /// phải do tệp này nghĩ ra — spine tier-5 khai chúng ở bảng TÁM dòng của §5.1,
  /// và `tests/` khẳng định theo MÃ, nên đổi tên ở đây là làm spine thành tài
  /// liệu chết.
  ///
  /// ⚠ Bốn mã, không phải một. Gộp lại thì phép kiểm không phân biệt được
  /// *chuyển tiếp ngoài bảng* với *đích cố định bị chọn sai* với *giai đoạn khởi
  /// tạo sai* với *dữ liệu hỏng*.
  | "STATE_TRANSITION_NOT_ALLOWED"  // §5.1 dòng 2 — cặp không có trong bảng
  | "STATE_INITIAL"                 // §5.1 dòng 1 — Cơ hội mới chỉ vào `tiep_can` (`D44`)
  | "STATE_TARGET_FIXED"            // §5.1 dòng 5,7 — đích là `latest_open_stage`, người gọi không chọn
  | "STATE_CLOSED_NO_LATEST_OPEN";  // đã đóng hoặc tạm dừng mà thiếu Giai đoạn mở gần nhất — dữ liệu hỏng

export class BusinessRuleError extends Error {
  constructor(
    public readonly code: BusinessRuleCode,
    message: string,
  ) {
    super(message);
    this.name = "BusinessRuleError";
  }
}

/// `FT1`–`FT10` — phân loại thất bại của spine.
/// KHÁC `F1`–`F40` của Mục 0: `F8` của spine là *cổng tự chủ quyết sai*,
/// `F8` của Mục 0 là *ghi đè Việc tiếp theo quá hạn*. Hai không gian mã.
export type FailureCode =
  | "FT1" | "FT2" | "FT3" | "FT4" | "FT5"
  | "FT6" | "FT7" | "FT8" | "FT9" | "FT10";
