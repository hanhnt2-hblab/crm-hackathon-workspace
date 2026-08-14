// `AD-CR-3` — hai họ lỗi, KHÔNG trộn.
//
// `GateDenied`  — Cổng từ chối. Thao tác chưa bao giờ bắt đầu.
// `BusinessRuleError` — capability đã chạy và lõi bác vì luật `BR-D`.
//
// Trộn hai họ này là làm `T-10` không phân biệt được *"chính sách chặn"* với
// *"capability vốn không tồn tại"* — mà đó đúng là điều `T-10` phải chứng minh.

/// Sáu mã từ chối của Cổng, đúng thứ tự bảy bước của `AD-4`.
export type DenyReason =
  | "unknown_capability"
  | "actor_not_allowed"
  | "boundary"
  | "role"
  | "limit"
  | "brake";

export class GateDenied extends Error {
  constructor(
    public readonly reason: DenyReason,
    public readonly capability: string,
  ) {
    super(`Cổng từ chối \`${capability}\`: ${reason}`);
    this.name = "GateDenied";
  }
}

/// Từ vựng ĐÓNG mã lỗi nghiệp vụ. Tầng ① ánh xạ sang HTTP và chữ hiển thị;
/// `tests/` khẳng định theo MÃ, không theo thông điệp.
export type BusinessRuleCode =
  | "BR-D1" | "BR-D2" | "BR-D3" | "BR-D4" | "BR-D5" | "BR-D6"
  | "BR-D7" | "BR-D8" | "BR-D9" | "BR-D10" | "BR-D11"
  | "NFR-14" | "NFR-15" | "NFR-16" | "NFR-17" | "NFR-19";

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
