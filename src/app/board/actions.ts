"use server";

// `S4` Pipeline board · `FR-3` `FR-4` `FR-5` · `T-1` (*"kéo cơ hội qua ba giai
// đoạn, trong đó có Đủ điều kiện"*).
//
// BỐN action, không phải một, và lý do nằm ở `AD-UI-6` (*một action, một
// capability*) cộng `§5.2`: đường ra khỏi `tam_dung` và đường mở lại Cơ hội đã
// đóng là HAI capability khác, với hai luật vai khác nhau —
// `resumeFromPause` (`allowedRoles: []`) và `reopenClosedOpportunity`
// (`allowedRoles: ["admin"]`, `D43`). Gộp ba đường vào một action thì action đó
// phải tự đoán capability nào theo dữ liệu, tức dựng lại ở tầng ① đúng thứ Cổng
// cố ý không làm (`AD-GT-1`: Cổng không đọc dữ liệu).
//
// ⚠ `resumeFromPause` và `reopenClosedOpportunity` KHÔNG nhận giai đoạn đích:
// đích cố định là *Giai đoạn mở gần nhất* (`§5.2`). Bề mặt kéo thả phải nói
// điều đó ra, nếu không người kéo sang cột X rồi thấy thẻ nhảy về cột Y.

import { revalidatePath } from "next/cache";
import { action, type ActionState } from "../_contract";
import { appRegistry } from "../_registry";
import { currentSession } from "../_session";
import { text } from "../_form";
import { stageLabel } from "../_vocab";

/// `FR-4` — lùi và nhảy cóc ĐỀU ĐƯỢC giữa các giai đoạn đang chạy; luật nằm ở
/// hàm thuần `canTransition` của lõi, và bề mặt không chép lại nó.
export const changeStageAction = action(async (form): Promise<ActionState> => {
  const session = await currentSession();
  const change = await appRegistry.loadCapability(
    "changeOpportunityStage",
    session.actor,
  );

  const to = text(form, "to");
  await change({ id: text(form, "id"), to });

  refreshBoards();
  return { ok: true, message: `Đã chuyển sang ${stageLabel(to)}.` };
});

/// `§5.2` · `§6` — Sales quay lại được từ `tam_dung`. Đích là Giai đoạn mở gần
/// nhất, không phải cột người dùng thả vào.
export const resumeFromPauseAction = action(async (form): Promise<ActionState> => {
  const session = await currentSession();
  const resume = await appRegistry.loadCapability("resumeFromPause", session.actor);

  await resume({ id: text(form, "id") });

  refreshBoards();
  return { ok: true, message: "Đã quay lại giai đoạn mở gần nhất." };
});

/// `D43` · `A5` · `§5.2` — mở lại Cơ hội ĐÃ ĐÓNG, **chỉ Quản trị**.
///
/// Không có phép kiểm vai nào ở đây: vai do Cổng canh ở bước ⑤, và một lần
/// từ chối quay về dưới dạng `GateDenied("role")` → `ActionState` mang mã
/// `role` (`AD-UI-10`, `D28`). Kiểm vai ở tầng này là dựng một biên giới thứ
/// hai chạy **song song** với Cổng thay vì nằm **trên** đường đi.
export const reopenClosedAction = action(async (form): Promise<ActionState> => {
  const session = await currentSession();
  const reopen = await appRegistry.loadCapability(
    "reopenClosedOpportunity",
    session.actor,
  );

  await reopen({ id: text(form, "id") });

  refreshBoards();
  return { ok: true, message: "Đã mở lại cơ hội đã đóng." };
});

/// `BR-B2` · `T-1` — hai ô dấu hiệu Đủ điều kiện.
///
/// ⚠ Action này KHÔNG nằm trên đường kéo thả. `T-1` đòi *"bỏ qua hai ô dấu hiệu
/// vẫn kéo được"*, nên hộp hỏi ở `S4` gọi `changeStageAction` TRƯỚC; lượt ghi
/// hai dấu hiệu là một lời gọi riêng, và nó hỏng thì thẻ **vẫn** ở cột mới.
///
/// `null` ở đây là *chưa trả lời*, `false` là *đã trả lời là không* (`C5-5`).
/// Hộp hỏi chỉ gửi những ô người thật sự tick, nên ô không tick đi xuống dưới
/// dạng `false` — đã hỏi, đã trả lời.
export const saveQualificationSignalsAction = action(
  async (form): Promise<ActionState> => {
    const session = await currentSession();
    const save = await appRegistry.loadCapability(
      "setQualificationSignals",
      session.actor,
    );

    await save({
      id: text(form, "id"),
      needSignal: form.get("needSignal") !== null,
      budgetSignal: form.get("budgetSignal") !== null,
    });

    refreshBoards();
    return { ok: true, message: "Đã ghi hai dấu hiệu Đủ điều kiện." };
  },
);

/// `AD-UI-9` — làm mới CHỈ sau một thao tác của người, và làm mới đúng những
/// bề mặt hiện con số vừa đổi. Vòng quét không bao giờ gọi các API này.
function refreshBoards(): void {
  // Một lần đổi Giai đoạn hiện lại ở BA chỗ: bảng `S4`, hồ sơ Công ty (`S3`) và
  // màn hình tổng quan. Địa chỉ hồ sơ phụ thuộc Cơ hội nào vừa đổi, mà action
  // chỉ cầm `id` của Cơ hội — nên làm mới theo `layout` gốc thay vì ghép ba lời
  // gọi trong đó một cái phải đoán `accountId`. Giá phải trả là vài lượt render
  // server thừa; cái tránh được là một màn hình hiện số cũ sau khi người dùng
  // vừa thấy thẻ sang cột khác.
  revalidatePath("/", "layout");
}
