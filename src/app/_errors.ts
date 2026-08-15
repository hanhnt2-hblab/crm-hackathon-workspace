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
/// ⚠ BẢNG TOÀN PHẦN, không `Partial`. Bản trước là `Partial<…>` cộng một câu
/// dự phòng, và lý lẽ của nó — *"mã mới vẫn hiện một câu đọc được"* — đúng ở
/// tầng chạy nhưng sai ở tầng biên dịch: **mười trên hai mươi** mã đang rơi về
/// *"Không lưu được vì trái một luật nghiệp vụ"*, một câu KHÔNG nói việc phải
/// làm, đúng thứ `EXPERIENCE.md` (*Giọng chữ*) cấm — và không có gì báo chỗ
/// thiếu ngoài việc gặp nó trên màn hình.
///
/// `Record<BusinessRuleCode, string>` bắt `tsc` đỏ ngay khi `src/core/errors.ts`
/// khai mã thứ 21 mà chưa ai viết câu cho nó. Toán tử `??` ở chỗ gọi GIỮ LẠI:
/// nó là lưới lúc chạy cho trường hợp lõi và giao diện dựng lệch phiên bản,
/// không phải cho trường hợp quên viết câu.
///
/// Nguồn của mỗi câu, tra được từng dòng:
///   · `BR-D1`…`BR-D11` → PRD §7.1, bảng luật miền
///   · `NFR-14`, `15`, `16`, `17`, `19` → PRD §10.1, *Bốn ranh giới đề bài `§5`
///     cộng một ranh giới thứ năm*. ⚠ KHÔNG viết `NFR-14`…`NFR-19` như một dải
///     liền: `NFR-18` (độ tươi hồ sơ 30 ngày) không phải `BusinessRuleCode`, và
///     một dải liền mời người đọc sau đi tìm một mã không có ở đây.
///   · bốn mã `STATE_*` → `AD-CR-3` của spine tầng ⑤ (KHÔNG phải *"§5.1"* —
///     §5.1 là mục của PRD, một tài liệu khác).
const RULE_TEXT: Record<BusinessRuleCode, string> = {
  // ── Máy trạng thái Cơ hội — `AD-CR-1` · `AD-CR-3` ────────────────────────
  STATE_TRANSITION_NOT_ALLOWED:
    "Cặp giai đoạn này không có trong bảng vòng đời. Chọn một giai đoạn khác.",
  STATE_INITIAL: "Cơ hội mới luôn bắt đầu ở Tiếp cận.",
  STATE_TARGET_FIXED:
    "Đường quay lại tự chọn giai đoạn mở gần nhất — không chọn tay được.",
  STATE_CLOSED_NO_LATEST_OPEN:
    "Cơ hội này thiếu giai đoạn mở gần nhất, chưa mở lại được. Báo Quản trị.",

  // ── Năm ranh giới §5 — PRD §10.1 ─────────────────────────────────────────
  "NFR-14": "Chỉ người mới đổi được giai đoạn.",
  // ⚠ `NFR-15` phủ CẢ HAI vế của PRD §10.1: *"không tự đánh dấu Thắng/Thua,
  // không tự sửa giá trị tiền"*. Câu cũ chỉ nói vế tiền, nên một lần từ chối
  // đóng Thắng/Thua đọc thành một câu chẳng liên quan.
  "NFR-15": "Chỉ người mới đánh dấu Thắng/Thua và sửa được giá trị tiền.",
  // ⚠ CÂU CŨ NÓI SAI LUẬT. `NFR-16` là *"hệ thống không tự liên hệ khách —
  // không thư, không tin nhắn"*, không phải *"ghi kết luận"*. Trích một mã có
  // thật nhưng nói về chuyện khác còn tệ hơn không trích, vì nó trông như đã
  // kiểm.
  "NFR-16": "Máy không tự liên hệ khách được. Gửi thư hoặc tin nhắn bằng tay.",
  "NFR-17": "Chỉ người mới xoá được dữ liệu.",
  "NFR-19": "Máy không sửa được mục Dòng thời gian do người tạo.",

  // ── Luật miền — PRD §7.1 ─────────────────────────────────────────────────
  "BR-D1":
    "Phát hiện phải kèm câu trích nguyên văn. Thêm câu trích từ bản lưu rồi lưu lại.",
  "BR-D2":
    "Câu trích không khớp đoạn nào trong bản lưu. Chép đúng nguyên văn một đoạn rồi thử lại.",
  "BR-D3": "Bản lưu này thuộc một công ty khác. Chọn bản lưu của đúng công ty.",
  "BR-D4": "Mỗi Công ty chỉ có một Đầu mối chính.",
  "BR-D5":
    "Tin này chưa đủ đáng chú ý để tự đặt việc. Đặt Việc tiếp theo bằng tay nếu cần.",
  "BR-D6": "Độ liên quan lệch quá xa loại tin. Chọn lại mức sát với loại tin.",
  "BR-D7":
    "Ngày hạn nằm ngoài khoảng cho phép. Chọn một hạn trong vòng 14 ngày làm việc.",
  "BR-D8":
    "Hạn do máy đặt không đẩy ra xa hơn được. Sửa tay ô Việc tiếp theo nếu cần đổi ngày.",
  "BR-D9":
    "Phạm vi này chỉ dùng một đơn vị tiền. Nhập lại giá trị theo đúng đơn vị đang dùng.",
  "BR-D10": "Giá trị này phải chọn trong danh sách có sẵn, không gõ tự do.",
  "BR-D11": "Bảy giai đoạn là cố định — không thêm, không bớt, không đổi tên.",
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
      // `??` GIỮ LẠI dù `RULE_TEXT` đã toàn phần — và giữ với đúng lý do của
      // nó, không hơn: `error.code` là dữ liệu lúc chạy, còn `Record` chỉ là
      // một lời hứa lúc biên dịch, nên một hàng ngoài bảng vẫn cho một câu đọc
      // được thay vì `undefined` trên màn hình Sales.
      //
      // ⚠ Nó KHÔNG che được kịch bản *hai bó mã lệch phiên bản*: đúng kịch bản
      // ấy thì `instanceof BusinessRuleError` ở dòng trên đã trả `false` và
      // luồng chẳng bao giờ tới đây (chính lập luận của `isZodError` bên dưới
      // chứng minh điều đó). Muốn phủ ca ấy thì phải nhận diện theo `name`, và
      // đó là một thay đổi hành vi riêng — đã ghi ở `deferred-work.md`.
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
