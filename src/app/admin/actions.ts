"use server";

// `S8` Admin · `AD-11` điều kiện dừng 4 · `T-1` · `T-9` — công tắc AI.
//
// ⚠ HAI action, không phải một, và `AD-UI-6` (*một action, một capability*) là
// lý do đủ. Nhưng còn một lý do nặng hơn: `disableAi` và `enableAi` có luật
// **tác nhân khác nhau**. `disableAi` cho `system` gọi — nó là van tự tắt khi
// chạm trần ngân sách, và nó mang `selfLimiting: true` để bước ⑥ của Cổng không
// khoá nó đúng lúc cần mở. `enableAi` chỉ cho `human`: máy tự tắt được, máy
// KHÔNG tự bật lại được, nếu không điều kiện dừng 4 chỉ trì hoãn một vòng.
//
// Gộp hai đường vào một action thì action đó phải tự đoán capability nào theo
// dữ liệu — dựng lại ở tầng ① đúng thứ Cổng cố ý không làm.
//
// ⚠ Không có phép kiểm vai ở đây. Vai do Cổng canh ở bước ⑤; một lần từ chối
// quay về thành `ActionState` mang mã `role` (`AD-UI-10`, `D28`). Kiểm vai ở
// tầng này là dựng biên giới thứ hai chạy SONG SONG với Cổng thay vì nằm TRÊN
// đường đi.

import { revalidatePath } from "next/cache";
import { action, type ActionState } from "../_contract";
import { appRegistry } from "../_registry";
import { currentSession } from "../_session";

/// `T-9` — *"Bấm nút tắt toàn bộ phần AI trong lúc vòng quét đang chạy"*.
/// Cũng là tiền đề của `T-1`, vốn mở bằng *"Tắt toàn bộ phần AI"*.
export const disableAiAction = action(async (): Promise<ActionState> => {
  const session = await currentSession();
  const tat = await appRegistry.loadCapability("disableAi", session.actor);

  const r = (await tat({ reason: "nguoi_bam", scanLogId: null })) as {
    changed: boolean;
  };

  refresh();
  return {
    ok: true,
    // Phân biệt *vừa tắt* với *vốn đã tắt*. Cùng một câu cho hai chuyện làm
    // người bấm không biết cú bấm của mình có tác dụng gì — và giữa buổi chấm
    // đó là khác biệt giữa *"nút hỏng"* và *"nút đã bấm rồi"*.
    message: r.changed
      ? "Đã tắt toàn bộ phần AI. Vòng quét sẽ bỏ mọi chu kỳ tiếp theo."
      : "AI vốn đã tắt sẵn.",
  };
});

/// `T-9` — *"Bật lại thì vòng quét chạy tiếp"*.
export const enableAiAction = action(async (): Promise<ActionState> => {
  const session = await currentSession();
  const bat = await appRegistry.loadCapability("enableAi", session.actor);

  const r = (await bat({ reason: "nguoi_bam" })) as { changed: boolean };

  refresh();
  return {
    ok: true,
    message: r.changed
      ? "Đã bật lại phần AI. Chu kỳ quét kế tiếp sẽ chạy."
      : "AI vốn đang bật.",
  };
});

/// Băng thông báo trạng thái AI nằm ở `layout.tsx`, tức MỌI trang đọc nó. Làm
/// mới một mình `/admin` thì người bấm tắt ở đây, sang trang khác vẫn thấy băng
/// cũ — và tin rằng nút không ăn.
function refresh(): void {
  revalidatePath("/", "layout");
}
