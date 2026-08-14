// `AD-GT-1` · `AD-GT-7` · `AD-GT-9` · `AD-GT-12` — Cổng tự chủ, tầng ③.
//
// Cổng là HÀM THUẦN, không phải thể hiện. Không nhà máy, không vòng đời
// (`AD-GT-7`): vòng đời nằm ở `createRegistry` của tầng ④, và nó không phải
// việc của tầng này.
//
// ⚠ TẦNG NÀY KHÔNG NHẬP GIÁ TRỊ NÀO RA NGOÀI CHÍNH NÓ (`AD-GT-4`).
// Chỉ nhập KIỂU, và phải dùng dạng `import type { X } from '…'` — KHÔNG dùng
// `import { type X } from '…'`. Với `verbatimModuleSyntax` bật, dạng nội dòng
// đó qua mặt luật ranh giới của `AD-1` mà không báo đỏ ở đâu.
//
// ⚠ CHIỀU SỞ HỮU ĐẢO SO VỚI TRỰC GIÁC (`AD-GT-12`): tầng ③ **sở hữu**
// `GateEntry`, tầng ④ **mở rộng** nó. Không phải ngược lại. Nếu `gate.ts` nhập
// `RegistryEntry` từ tầng ④ thì Zod và Prisma vào đồ thị kiểu của tầng này, và
// `npm test` trên clone sạch sẽ ĐỎ ngay tại tệp này vì `prisma generate` chưa
// chạy — trong khi bộ kiểm của Cổng không cần một byte dữ liệu nào.

import type { Actor, ActorKind, Role } from "@/core/actor";
import type { BoundaryCode } from "./zones";
/// Nhập GIÁ TRỊ, hợp lệ: `zones.ts` cùng tầng ③. `AD-GT-4` cấm nhập giá trị ra
/// NGOÀI tầng này, không cấm trong nội bộ nó. Không có chu trình lúc chạy —
/// chiều ngược (`zones` → `gate`) chỉ là `import type`, bị xoá khi biên dịch.
import { crossesBoundary } from "./zones";

/// `AD-GT-12` — ĐÚNG NĂM TRƯỜNG, đúng bằng thứ bảy bước của `AD-4` đọc tới.
///
/// `zone` và `risk` KHÔNG có mặt ở đây: `AD-2` nói `risk` không tham gia quyết
/// định, và bước ④ đọc `touches` chứ không đọc `zone`. Thêm một trường vào đây
/// là mở rộng bề mặt mà Cổng phải hiểu, và mọi trường Cổng không đọc chỉ tạo
/// ảo giác rằng nó có canh.
export type GateEntry = {
  name: string;
  allowedActors: readonly ActorKind[];
  allowedRoles: readonly Role[];
  touches: readonly BoundaryCode[];
  /// BẮT BUỘC, không `?:` (`AD-4`). `undefined` đọc thành *"tắt"* là đúng cái
  /// mặc định nguy hiểm nhất — một capability quên khai sẽ tự do lặp.
  selfLimiting: boolean;
};

/// `AD-GT-1` — ĐÚNG SÁU TRƯỜNG, toàn là SỰ KIỆN, không có suy diễn.
///
/// Ba điều cố ý vắng mặt:
///   ① **Không có trường vai.** Vai vào qua `actor` (`AD-5`); `ctx` mang vai là
///      hai nguồn sự thật cho cùng một dữ kiện.
///   ② **Ngân sách vào bằng TỈ LỆ, không bằng số tuyệt đối** — `AD-11` khai
///      ngưỡng dạng tỉ lệ, nên đổi sang số tuyệt đối ở đây là ép Cổng tự chia.
///   ③ Tử số và mẫu số lấy **cùng một hàng `ScanLog`** của lượt quét đang chạy
///      (`AD-CP-7`). Lấy hai nguồn cho hai vế là cách chắc chắn để tỉ lệ nhảy.
export type GateContext = {
  seedMode: boolean;
  aiEnabled: boolean;
  modelCallsUsed: number;
  modelCallsLimit: number;
  budgetUsedRatio: number;
  budgetStopRatio: number;
};

/// `AD-GT-9` — SÁU mã từ chối, đúng thứ tự bảy bước của `AD-4`.
///
/// Đây là NGUỒN DUY NHẤT của từ vựng này. `src/core/errors.ts` từng khai một
/// bản sao tên `DenyReason`; bản đó đã gỡ, vì hai nguồn cho một từ vựng là hai
/// chỗ trôi khỏi nhau.
export type GateDenyReason =
  | "unknown_capability"
  | "actor_not_allowed"
  | "boundary"
  | "role"
  | "limit"
  | "brake";

/// `AD-GT-9` — quyết định là một GIÁ TRỊ, không phải một lần ném.
///
/// Cổng TRẢ VỀ từ chối. Việc biến từ chối thành lỗi ném là của tầng ④
/// (`GateDenied` ở `@/capability/errors`), vì chỉ tầng ④ mới biết bên gọi là ai.
export type GateDecision =
  | { allowed: true }
  | { allowed: false; reason: GateDenyReason; boundary?: BoundaryCode };

/// `AD-GT-9` — ĐỒNG BỘ, không `Promise`. Mọi dữ kiện cần thiết đã nằm trong
/// `ctx`; gom `ctx` là việc của `collectGateContext` ở tầng ④ (`AD-CP-7`), và
/// nó chạy TRƯỚC hàm này.
///
/// `entry` là `GateEntry | undefined`: `undefined` nghĩa là tên capability
/// không có trong sổ đăng ký, và đó là bước ① `unknown_capability`. Bắt nó ở
/// đây thay vì ở tầng ④ giữ cho cả bảy bước nằm chung một chỗ đọc được.
export function decide(
  entry: GateEntry | undefined,
  actor: Actor,
  ctx: GateContext,
): GateDecision {
  // ① Có trong sổ đăng ký? — "thứ này không tồn tại" là sự thật hẹp nhất.
  if (!entry) return deny("unknown_capability");

  // ② Chế-độ-gieo (`AD-20`). Đặt ở bước HAI, không phải bước cuối: seeder dựng
  //    dữ liệu ban đầu nên nó đi trước mọi luật về ranh giới, vai và trần.
  //    Hai vế, không phải một — `actor.kind === 'seed'` một mình không đủ, vì
  //    một tiến trình web dựng ở chế-độ-thường mà nhận actor `seed` là dấu hiệu
  //    có ai đó giả mạo tác nhân, không phải một lượt gieo hợp lệ.
  if (actor.kind === "seed" && ctx.seedMode) return { allowed: true };

  // ③ Tác nhân có trong danh sách? — trước ④ có chủ đích. `changeStage(system)`
  //    vi phạm cả ③ lẫn ④, và phải trả `actor_not_allowed`: *"hệ thống không bao
  //    giờ được làm việc này"* là sự thật bền hơn *"lần này chạm ranh giới"*.
  if (!entry.allowedActors.includes(actor.kind)) return deny("actor_not_allowed");

  // ④ Chạm ranh giới cấm? Hỏi `crossesBoundary` chứ không tự đọc `touches`:
  //    luật *"trả mã đầu tiên theo thứ tự `BOUNDARY_CODES`"* phải nằm ở đúng một
  //    chỗ, nếu không hai người khai `touches` theo hai thứ tự sẽ cho hai mã lý
  //    do khác nhau cho cùng một lời gọi.
  const boundary = crossesBoundary(entry, actor);
  if (boundary) return { allowed: false, reason: "boundary", boundary };

  // ⑤ Vai đủ chưa? Chỉ có nghĩa với tác nhân NGƯỜI — `allowedRoles` rỗng nghĩa
  //    là không giới hạn vai, không phải cấm tất cả.
  if (actor.kind === "human" && entry.allowedRoles.length > 0) {
    if (!entry.allowedRoles.includes(actor.role)) return deny("role");
  }

  // ⑥ và ⑦ chỉ áp cho MÁY: trần lượt gọi và ngân sách là chuyện của vòng quét,
  //    còn người bấm nút thì không tiêu lượt gọi mô hình nào.
  //    ⚠ `limit` TRƯỚC `brake`, đúng thứ tự ⑥ rồi ⑦ của `AD-4`. Đảo hai bước
  //    này không đổi việc CÓ chặn hay không, nhưng đổi MÃ LÝ DO khi cả hai cùng
  //    vi phạm — và mã lý do là thứ đi vào dòng ghi vết mà `T-5`/`T-10` đọc.
  //
  //    ⚠⚠ `selfLimiting` BỎ QUA CẢ HAI BƯỚC. Bản trước khai trường này ở
  //    `GateEntry` rồi KHÔNG ĐỌC NÓ — tức cờ tồn tại, mọi mục khai đúng, và nó
  //    không làm gì cả. Hình dạng lỗi mà `AD-4` phát biểu:
  //
  //      *một capability chạy TẠI hoặc SAU thời điểm trần chạm, hoặc phải sống
  //      khi phanh tắt, không được để chính trần đó chặn — nếu không, hệ mất
  //      đúng cái van nó vừa dựng.*
  //
  //    Cụ thể, và cả bốn đều đo được: `disableAi` bị chặn ở 100% ngân sách thì
  //    điều kiện dừng 4 của `AD-11` KHÔNG BAO GIỜ chạy được — AI không tự tắt.
  //    `writeScanLog` bị chặn thì không dòng Nhật ký nào để `T-8` truy vấn.
  //    `releaseAccountLock` bị chặn thì **khoá không nhả**, và vì `AD-12` suy
  //    *"vòng đang chạy"* từ khoá với lease 10 phút, ở nhịp 60 giây là **mười
  //    vòng liên tiếp bị bỏ** — bật lại AI xong mười phút không có gì xảy ra.
  //    `readUserForAuth` bị chặn thì bấm Tắt AI xong **không ai đăng nhập
  //    được**, và `T-9` với `T-1` đỏ cùng lúc.
  //
  //    Cờ này KHÔNG nới ranh giới nào: các mục mang nó chỉ chạm bảng hạ tầng
  //    hoặc chỉ đọc, và chúng vẫn đi qua đủ bước ①–⑤.
  if (actor.kind === "system" && !entry.selfLimiting) {
    if (ctx.modelCallsUsed >= ctx.modelCallsLimit) return deny("limit");
    // ⚠ Tỉ lệ có thể là `NaN` khi ngân sách bằng 0, và `NaN >= x` luôn `false` —
    //    tức phanh ngân sách KHÔNG BAO GIỜ chạm trong khi tiền vẫn tiêu. Bắt
    //    tường minh thay vì tin vào phép so.
    if (!Number.isFinite(ctx.budgetUsedRatio)) return deny("limit");
    if (ctx.budgetUsedRatio >= ctx.budgetStopRatio) return deny("limit");
    if (!ctx.aiEnabled) return deny("brake");
  }

  return { allowed: true };
}

function deny(reason: GateDenyReason): GateDecision {
  return { allowed: false, reason };
}
