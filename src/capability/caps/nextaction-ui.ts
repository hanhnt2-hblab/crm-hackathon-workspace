// `AD-2` · `AD-19` · `AD-CP-3` · `AD-CP-8` — mục capability ĐỌC cho khối Việc
// tiếp theo.
//
// ⚠ MÀN HÌNH NÀO. `FR-30`/`FR-32` là dải của `S5` (Opportunity detail) theo
// `EXPERIENCE.md`; khối này lại đứng trên `S3` (Account detail) vì `page.tsx`
// đã dựng sẵn `<Block title="Việc tiếp theo">` ở đó và `S5` chưa có màn hình.
// Nêu ra chứ không sửa im lặng tài liệu hạng dưới cho khớp (`AD-13`).
//
// MỘT mục, một tệp. Nó không nằm chung `caps/ui.ts` vì hai lý do khác nhau:
//   · phạm vi cục dựng khối `S3` không mở `caps/ui.ts` — đang có người khác
//   · và nó KHÔNG mang món nợ của tệp đó. `caps/ui.ts` nhập thẳng `db` vì
//     `src/core` chưa có hàm đọc; mục dưới đây có `readAccountNextActions` ở
//     lõi nên thân `fn` của nó là một dòng gọi hàm cộng một lượt tuần tự hoá —
//     đúng hình dạng mà `caps/ui.ts` sẽ có khi trả xong nợ. Gộp nó vào đó là
//     làm khoản nợ ấy trông lớn hơn thực tế.
//
// ⚠ TỆP NÀY PHẢI ĐƯỢC NẠP QUA `caps/index.ts` (`AD-CP-8` — điểm nạp và luật
// *mỗi tệp xuất duy nhất `entries`*; `AD-CP-1` là chữ ký `createRegistry`,
// KHÔNG phải luật này). Thiếu dòng
// `...nextActionUiEntries` ở đó thì mục dưới đây **im lặng không tồn tại**, và
// khối `S3` nhận `unknown_capability` thay vì dữ liệu.

import { z } from "zod";
import { defineCap, type RegistryEntry } from "../types";
import { readAccountNextActions } from "@/core/nextaction/read";

/// `T-7` · `FR-30` · `FR-32` · `D14` — Việc tiếp theo của mọi Cơ hội thuộc một
/// Công ty, kèm cờ *hoàn tác được không*.
///
/// `allowedActors: ["human"]` — KHÔNG `"system"`. Vòng quét đọc Việc tiếp theo
/// bằng đường riêng của nó (`fillNextActionIfUnchanged` tự đọc trong giao dịch
/// của mình, `AD-10`), nên mở mục này cho máy là thêm một đường đọc thứ hai mà
/// `T-10b` phải rà, đổi lấy đúng con số không.
///
/// `exposeToMcp: false` — mục này trả `canUndo`, tức một lời khuyên *nên bấm
/// hay không*. Đưa nó lên MCP là mời agent tự quyết chuyện hoàn tác, mà `T-4`
/// chốt *"không có chế độ tự duyệt"* và `undoSystemNextAction` khai
/// `allowedActors: HUMAN_ONLY` đúng vì thế.
///
/// `kind: "read"` nên `snapshot: null` (`AD-CP-3`: không ghi thì không có giá
/// trị TRƯỚC-GHI để chụp), `dirtyFlags: []`, và không có `writesTables`.
export const readAccountNextActionsCap = defineCap({
  name: "readAccountNextActions",
  allowedActors: ["human"] as const,
  allowedRoles: [],
  /// `touches` khai năm RANH GIỚI của `§5` mà một mục có thể chạm; một lượt đọc
  /// không chạm ranh giới nào, nên rỗng — cùng lý do `READ_COMMON` của
  /// `caps/ui.ts` để rỗng cho cả bảy mục đọc.
  /// `risk` KHÔNG tham gia quyết định của Cổng (`types.ts`), nó chỉ vào dòng ghi
  /// vết; `low` vì mục này không đổi một ô nào.
  touches: [],
  /// `AD-4` — `selfLimiting` nghĩa là **miễn trừ bước ⑥ và ⑦** của Cổng, không
  /// phải *"nhẹ nên cho qua"*. Sáu mục được miễn đều là hạ tầng hoặc đường dựng
  /// phiên; một khối trên hồ sơ Công ty không nằm trong số đó.
  /// (Thực tế bước ⑥/⑦ chỉ chạy với `actor.kind === "system"`, mà mục này chỉ
  /// cho người — nên cờ này không đổi hành vi hôm nay. Nó khai đúng ý nghĩa để
  /// ngày mai ai đó mở `"system"` thì không thừa hưởng một miễn trừ im lặng.)
  selfLimiting: false,
  /// `tu_do` như mọi mục đọc: `Zone` là ba MỨC TỰ CHỦ, không phải ba miền dữ
  /// liệu. Một lượt đọc không đổi ô hồ sơ nào.
  zone: "tu_do",
  risk: "low",
  requiresSignalSource: false,
  cascades: [],
  kind: "read",
  params: z.object({ accountId: z.uuid() }),
  dirtyFlags: [],
  exposeToMcp: false,
  snapshot: null,
  fn: async (actor, p) => {
    const rows = await readAccountNextActions(actor, p.accountId);
    return rows.map((r) => ({
      opportunityId: r.opportunityId,
      opportunityName: r.opportunityName,
      stage: r.stage,
      running: r.running,
      nextAction:
        r.nextAction === null
          ? null
          : {
              content: r.nextAction.content,
              // ⚠ `YYYY-MM-DD`, không phải ISO đầy đủ. Cột là `@db.Date` nên
              // Prisma trả nửa đêm UTC; đưa chuỗi có giờ cho bề mặt là mời nó
              // dựng `new Date(...)` rồi đọc theo giờ máy — lệch đúng MỘT NGÀY
              // ở mọi múi giờ âm, trên chính con số mà `BR-D7` nói là hạn.
              dueDate: r.nextAction.dueDate?.toISOString().slice(0, 10) ?? null,
              setBy: r.nextAction.setBy,
              // Mốc này CÓ giờ thật (`@db.Timestamptz`), nên nó đi nguyên ISO.
              undoDeadlineAt: r.nextAction.undoDeadlineAt?.toISOString() ?? null,
              sourceClaim: r.nextAction.sourceClaim,
              sourceQuote: r.nextAction.sourceQuote,
              canUndo: r.nextAction.canUndo,
              // Đi kèm `canUndo` và đọc CÙNG một lần đồng hồ ở lõi — bề mặt
              // không được gọi `Date.now()` lúc render (`react-hooks/purity`).
              undoRemainingMs: r.nextAction.undoRemainingMs,
            },
    }));
  },
});

/// `AD-CP-8` — xuất DUY NHẤT một hằng `entries`, đúng khuôn `./account.ts`.
export const entries: readonly RegistryEntry[] = [
  readAccountNextActionsCap,
] as unknown as readonly RegistryEntry[];
