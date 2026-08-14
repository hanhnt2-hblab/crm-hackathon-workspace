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
  _entry: GateEntry | undefined,
  _actor: Actor,
  _ctx: GateContext,
): GateDecision {
  throw new Error("chưa hiện thực");
}
