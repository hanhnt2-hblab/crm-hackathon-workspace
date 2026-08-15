"use server";

// Khối *Gợi ý chờ quyết* · `FR-20`…`FR-23` · `T-5` — BA lối ra của người.
//
// ⚠ Chuyển lên `src/app/` cùng lá `_suggestion-queue.tsx` (15/08): ba action
// này giờ phục vụ HAI bề mặt — `S3` một Công ty, `S2` mọi Công ty. Lý do chuyển
// ghi đầy đủ ở đầu tệp lá.
//
// BA action, không phải một, và `AD-UI-6` nói thẳng vì sao: *một action, một
// capability*. Cùng lý do đã tách ba mục ở `caps/suggestion.ts` — `T-5` khẳng
// định *sửa-rồi-duyệt* **tách bạch** khỏi *duyệt*, và `AD-2` liệt kê chúng bằng
// BA TÊN. Một action gộp phải tự đoán capability nào theo dữ liệu biểu mẫu, tức
// dựng lại ở tầng ① đúng thứ Cổng cố ý không làm (`AD-GT-1`: Cổng không đọc dữ
// liệu). Hệ quả đo được: ba dòng ghi vết mang cùng một `capability`, và phép
// kiểm *"ba lối ra để lại vết dưới ba capability riêng"* của `T-5` mất bề mặt để
// đếm.
//
// ⚠ KHÔNG có phép kiểm vai nào trong tệp này. Vai do Cổng canh ở bước ⑤, và một
// lần từ chối quay về dưới dạng `GateDenied("role")` → `ActionState` mang mã
// `role` (`AD-UI-10`, `D28`). Kiểm ở đây là dựng một biên giới thứ hai chạy
// **song song** với Cổng thay vì nằm **trên** đường đi — hai biên giới song song
// thì cái yếu hơn quyết định, và không ai biết cái nào yếu hơn.
//
// ⚠ Cũng KHÔNG kiểm *"Gợi ý này còn chờ không"*. `decideSuggestion` ghi có điều
// kiện `where status = 'cho'` và trả `no_op` khi vòng quét vừa đóng nó bằng
// `co_goi_y_moi_hon` (`FR-51`). Đọc-rồi-ghi ở đây mở đúng cửa sổ đua mà lõi vừa
// đóng lại.

import { revalidatePath } from "next/cache";
import { action, type ActionState } from "./_contract";
import { appRegistry } from "./_registry";
import { currentSession } from "./_session";
import { text } from "./_form";

/// `FR-20` — Duyệt. Ghi thẳng giá trị mô hình đề nghị vào ô hồ sơ.
export const approveSuggestionAction = action(async (form): Promise<ActionState> => {
  const session = await currentSession();
  const approve = await appRegistry.loadCapability("approveSuggestion", session.actor);

  await approve({
    suggestionId: text(form, "suggestionId"),
    decisionSeconds: decisionSeconds(form),
  });

  refreshAfterDecision(text(form, "accountId"));
  return { ok: true, message: "Đã duyệt — giá trị đề nghị đã ghi vào hồ sơ." };
});

/// `FR-22` — Sửa rồi duyệt. Ghi lại là **sửa**, KHÔNG ghi là **duyệt**.
///
/// ⚠ `editedValue` KHÔNG có giá trị dự phòng ở đây, và đó là cả điểm của lối ra
/// này: `editThenApproveCap` khai `z.string().min(1)`, nên một ô rỗng bị Zod bác
/// ở bước ⑤ và quay về thành *"Còn ô chưa điền hoặc điền chưa đúng"*. Lấp bằng
/// `proposedValue` cho tiện là biến *sửa-rồi-duyệt* thành *duyệt* đội tên khác,
/// và khi đó tử số `autoAcceptRate` đếm đúng thứ `T-5` dựng ra để tách.
export const editThenApproveSuggestionAction = action(
  async (form): Promise<ActionState> => {
    const session = await currentSession();
    const editThenApprove = await appRegistry.loadCapability(
      "editThenApprove",
      session.actor,
    );

    await editThenApprove({
      suggestionId: text(form, "suggestionId"),
      editedValue: text(form, "editedValue"),
      decisionSeconds: decisionSeconds(form),
    });

    refreshAfterDecision(text(form, "accountId"));
    return { ok: true, message: "Đã sửa rồi duyệt — hồ sơ nhận giá trị bạn gõ." };
  },
);

/// `FR-20` · `FR-21` · `BR-D10` — Bỏ, kèm lý do chọn trong năm giá trị.
///
/// Hồ sơ **giữ nguyên vô thời hạn** sau một lần Bỏ (`FR-21`), nên câu báo nói
/// đúng điều đó: người vừa bấm cần biết mình vừa không đổi gì cả.
export const dropSuggestionAction = action(async (form): Promise<ActionState> => {
  const session = await currentSession();
  const drop = await appRegistry.loadCapability("dropSuggestion", session.actor);

  await drop({
    suggestionId: text(form, "suggestionId"),
    // Token enum, KHÔNG phải nhãn tiếng Việt. Chữ hiển thị sống ở tầng ①
    // (`_suggestion-queue.tsx`); gửi nhãn xuống là để chữ hiển thị rò vào một
    // cột enum, đúng thứ quy ước cha cấm.
    dropReason: text(form, "dropReason"),
    decisionSeconds: decisionSeconds(form),
  });

  refreshAfterDecision(text(form, "accountId"));
  return { ok: true, message: "Đã bỏ gợi ý — hồ sơ giữ nguyên." };
});

/// `BR-B6` — số giây tính TỪ LÚC MỞ CHI TIẾT một Gợi ý, đo ở trình duyệt và gửi
/// lên qua một ô ẩn. Máy chủ không đo được nó: lúc render là lúc mở **hàng đợi**,
/// không phải lúc mở chi tiết, và ngưỡng duyệt mù 3 giây đo đúng khoảng sau.
///
/// ⚠ KHÔNG có giá trị dự phòng. `Number.parseInt("")` là `NaN`, và `z.number()`
/// bác `NaN` ở bước ⑤ — đúng thứ ta muốn. Dự phòng `0` thì một ô ẩn hỏng sẽ tự
/// treo cờ duyệt mù cho một người đã cân nhắc kỹ, và `blindApprovalSignals` đếm
/// một tín hiệu không có thật. Đây cũng là lý do `_form.ts` không kiểm gì:
/// lược đồ Zod của capability là nơi DUY NHẤT canh tham số (`AD-CP-5` bước ⑤).
function decisionSeconds(form: FormData): number {
  return Number.parseInt(text(form, "decisionSeconds"), 10);
}

/// `AD-UI-9` — làm mới CHỈ sau một thao tác của người, và làm mới đúng những bề
/// mặt hiện con số vừa đổi. Vòng quét không bao giờ gọi các API này.
///
/// Bốn địa chỉ, mỗi cái vì một lý do khác nhau:
///   · hồ sơ Công ty — hàng vừa quyết rời hàng đợi, và ô hồ sơ đổi giá trị
///   · `/suggestions` — bề mặt `S2` hiện CÙNG hàng đợi ấy, gom theo Công ty;
///     thiếu dòng này thì quyết ở `S3` xong mở `S2` vẫn thấy thẻ đã quyết, và
///     cú bấm kế tiếp trả `no_op` — một nút bấm vào không làm gì
///   · `/` — Gợi ý loại *thêm tin mới* sinh một mục Dòng thời gian (`FR-6`)
///   · `/admin` — `autoAcceptRate` và `errorDetectionRate` vừa có thêm một mẫu
function refreshAfterDecision(accountId: string): void {
  revalidatePath(`/accounts/${accountId}`);
  revalidatePath("/suggestions");
  revalidatePath("/");
  revalidatePath("/admin");
}
