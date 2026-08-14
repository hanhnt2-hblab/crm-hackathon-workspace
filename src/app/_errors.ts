// `AD-UI-7` — ánh xạ lỗi HAI CHẶNG, và đây là tệp duy nhất giữ hai bảng đó.
//
//   chặng 1   mã lõi (`BR-D*`, `NFR-*`, `STATE_*`, `GateDenied.reason`) → mã giao diện
//   chặng 2   mã giao diện → chữ hiển thị tiếng Việt
//
// Vì sao hai chặng chứ không một: nhiều mã lõi đọc thành **cùng một câu** cho
// người dùng (`actor_not_allowed` và `boundary` đều là *"thao tác này không đi
// qua đây được"*), nhưng chúng phải giữ MÃ RIÊNG trong `ActionState` để dòng
// ghi vết và phép kiểm còn phân biệt được. Gộp một chặng là mất một trong hai.
//
// ⚠ Lõi KHÔNG chứa chuỗi hiển thị nào (quy ước cha). `error.message` của
// `BusinessRuleError` là để đọc log; thứ đưa cho Sales dựng từ MÃ, ở đây.
//
// Giọng chữ theo `EXPERIENCE.md` mục *Giọng chữ*: câu nói **việc phải làm**,
// không nói mã lỗi, không nói *"Fetch failed (503)"*.

import type { BusinessRuleCode } from "@/core/errors";
import { BusinessRuleError } from "@/core/errors";
import type { GateDenyReason } from "@/autonomy/gate";
import { GateDenied } from "@/capability/errors";
import type { ActionState } from "./_contract";

/// Mã GIAO DIỆN — từ vựng đóng, đúng bảng của `AD-UI-7`.
///
/// `nhap_khong_hop_le` KHÔNG có trong bảng của `AD-UI-7`, và đó là một bổ sung
/// có ý thức: bước ⑤ của `AD-CP-5` kiểm tham số bằng Zod **sau** Cổng, nên một
/// biểu mẫu thiếu ô ném `ZodError` — một lỗi *mong đợi* mà bảng gốc chưa xếp
/// chỗ. Xếp nó vào `loi_he_thong` là nói dối người vừa quên điền một ô.
export type UiErrorCode =
  | "loi_he_thong"
  | "khong_duoc_phep"
  | "khong_du_quyen"
  | "ai_dang_tat"
  | "nhap_khong_hop_le"
  | "luat_nghiep_vu";

/// Chặng 1 — lý do từ chối của Cổng → mã giao diện (`AD-UI-7`, bảng năm dòng).
const GATE_TO_UI: Record<GateDenyReason, UiErrorCode> = {
  unknown_capability: "loi_he_thong",
  actor_not_allowed: "khong_duoc_phep",
  boundary: "khong_duoc_phep",
  role: "khong_du_quyen",
  limit: "ai_dang_tat",
  brake: "ai_dang_tat",
};

/// Chặng 2 — mã giao diện → chữ hiển thị. Một câu, nói việc phải làm.
const UI_TO_TEXT: Record<UiErrorCode, string> = {
  loi_he_thong: "Hệ thống chưa xử lý được yêu cầu này. Thử lại, hoặc báo Quản trị.",
  khong_duoc_phep: "Thao tác này không đi qua đường đó được.",
  khong_du_quyen: "Việc này cần tài khoản Quản trị.",
  ai_dang_tat:
    "Phần gợi ý đang tắt. Các việc làm tay vẫn chạy bình thường; " +
    "bật lại ở màn hình Quản trị.",
  nhap_khong_hop_le: "Còn ô chưa điền hoặc điền chưa đúng. Xem lại rồi lưu lại.",
  luat_nghiep_vu: "Không lưu được vì trái một luật nghiệp vụ.",
};

/// Chặng 1 cho lỗi nghiệp vụ — mã lõi giữ NGUYÊN trong `ActionState` (bảng
/// `AD-UI-7`: *"mã `BR-D` giữ nguyên"*), còn câu hiển thị lấy ở đây.
///
/// Mã nào không có dòng riêng thì rơi về `luat_nghiep_vu`. Đó là chủ đích: một
/// mã mới ở lõi vẫn hiện một câu đọc được thay vì chuỗi rỗng, và chỗ thiếu lộ
/// ra dưới dạng câu chung chứ không dưới dạng màn hình trắng.
const RULE_TEXT: Partial<Record<BusinessRuleCode, string>> = {
  STATE_TRANSITION_NOT_ALLOWED:
    "Cặp giai đoạn này không có trong bảng vòng đời. Chọn một giai đoạn khác.",
  STATE_INITIAL: "Cơ hội mới luôn bắt đầu ở Tiếp cận.",
  STATE_TARGET_FIXED:
    "Đường quay lại tự chọn giai đoạn mở gần nhất — không chọn tay được.",
  STATE_CLOSED_NO_LATEST_OPEN:
    "Cơ hội này thiếu giai đoạn mở gần nhất, chưa mở lại được. Báo Quản trị.",
  "NFR-14": "Chỉ người mới đổi được giai đoạn.",
  "NFR-15": "Chỉ người mới sửa được giá trị tiền.",
  "NFR-16": "Chỉ người mới ghi được kết luận này.",
  "NFR-17": "Chỉ người mới xoá được dữ liệu.",
  "NFR-19": "Máy không sửa được mục Dòng thời gian do người tạo.",
  "BR-D4": "Mỗi Công ty chỉ có một Đầu mối chính.",
};

/// Chữ hiển thị cho một `ActionState` thất bại — dùng cho cả lá hiển thị lỗi
/// dùng chung (`AD-UI-6`: chỉ có một `ActionState`, nên chỉ có một lá).
export function textForUiCode(code: UiErrorCode): string {
  return UI_TO_TEXT[code];
}

/// Phân loại một lỗi bị ném thành `ActionState` thất bại, hoặc `null` khi nó
/// **bất ngờ** — và bất ngờ thì `action()` ném tiếp (`AD-UI-6`).
///
/// ⚠ Bốn nhánh, đúng bốn loại lỗi mong đợi mà tầng này có thể gặp:
///   ① `GateDenied` — tầng ④ biến từ chối của Cổng thành lần ném (`AD-GT-9`)
///   ② `BusinessRuleError` — lõi từ chối vì một luật `§5`
///   ③ lỗi kiểm tham số của Zod ở bước ⑤ `AD-CP-5`
///   ④ *không tìm thấy bản ghi* — lõi ném `Error` thường, không có mã thượng
///      nguồn (xem chú thích ở `softDeleteCompany`). Nó là lỗi MONG ĐỢI trên
///      giao diện: người vừa mở một liên kết cũ. Xếp `unexpected` thì nó thành
///      màn hình 500 cho một cú bấm bình thường.
export function failureFromError(error: unknown): ActionState | null {
  if (error instanceof GateDenied) {
    const ui = GATE_TO_UI[error.reason];
    return { ok: false, code: error.reason, message: UI_TO_TEXT[ui] };
  }

  if (error instanceof BusinessRuleError) {
    return {
      ok: false,
      code: error.code,
      message: RULE_TEXT[error.code] ?? UI_TO_TEXT.luat_nghiep_vu,
    };
  }

  if (isZodError(error)) {
    return {
      ok: false,
      code: "unexpected",
      message: UI_TO_TEXT.nhap_khong_hop_le,
    };
  }

  if (error instanceof Error && /không tồn tại/.test(error.message)) {
    return {
      ok: false,
      code: "unexpected",
      message: "Bản ghi này không còn nữa. Tải lại danh sách rồi thử lại.",
    };
  }

  return null;
}

/// Nhận diện `ZodError` KHÔNG bằng `instanceof`: `zod` là phụ thuộc của tầng ④
/// và có thể tồn tại hai bản sao module trong một tiến trình (`next build`
/// tách chunk server/client), lúc đó `instanceof` trả `false` đúng lúc cần nó
/// nhất. `name` là hợp đồng ổn định của Zod 4 và không phụ thuộc đồ thị module.
function isZodError(error: unknown): boolean {
  return error instanceof Error && error.name === "ZodError";
}
