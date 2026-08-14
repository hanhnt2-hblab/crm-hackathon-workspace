// `AD-4` · `AD-UI-5` · mục **CÒN MỞ ⑤** của spine tầng ① — ai gọi `createRegistry`
// cho nhánh không-gieo.
//
// Spine để ngỏ câu này: `AD-4` viết *"`instrumentation.ts` và `src/app` dựng
// với `false` một lần lúc khởi động"*, nhưng `AD-UI-1` chỉ cho
// `instrumentation.ts` làm đúng ba việc, và không tệp nào trong `src/app` có
// vòng đời khởi động. Cách đọc mà spine đề nghị — một thể hiện mức module
// trong `src/capability/registry.ts` — cần sửa một tệp thuộc tầng ④.
//
// Chốt ở đây, mức module, TRONG `src/app`:
//
//   · **Một thể hiện cho cả tiến trình.** Dựng ở mức module thì nó dựng đúng
//     một lần cho mỗi tiến trình Node, không phải một lần cho mỗi lượt yêu cầu.
//     Dựng trong từng `page.tsx` cho N thể hiện — mỗi cái một `Map` riêng, và
//     chi phí đó nằm trên đường nóng của mọi cú bấm.
//
//   · **KHÔNG va `AD-UI-2`.** Luật đó cấm module dùng chung **giữa ba nhánh**
//     (`src/app`, `src/scan`, `src/ingest`) và cấm `src/shared`. Tệp này nằm
//     trong `src/app`, không nhánh nào khác nhập nó, và nó **không bọc**
//     `loadCapability` — nó chỉ giữ thể hiện. Vế mà `AD-UI-2` sợ là một hàm
//     `callCapability` gộp cách xử `GateDenied` của hai nhánh; ở đây không có
//     hàm nào như thế, mỗi bề mặt tự bắt lỗi qua `action()` (`AD-UI-6`).
//
//   · **`seedMode: false`, `keepAudit: true`.** Nhánh web không bao giờ là
//     chế-độ-gieo, và miễn trừ ghi vết là chuyện của `prisma/seed.ts`
//     (`AD-20`). Một cú bấm của Sales luôn để lại vết.

import { createRegistry, type Registry } from "@/capability/registry";
import { createAuditSink } from "@/core/audit";

/// Sổ đăng ký của nhánh web. `loadCapability` là bề mặt DUY NHẤT tầng ① dùng.
export const appRegistry: Registry = createRegistry({
  seedMode: false,
  auditSink: createAuditSink({ seedMode: false, keepAudit: true }),
});
