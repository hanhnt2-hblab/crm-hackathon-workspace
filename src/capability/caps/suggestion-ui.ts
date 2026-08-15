// `AD-2` · `AD-19` · `AD-UI-5` · `T-5` — capability ĐỌC của hàng đợi Gợi ý.
//
// ⚠ VÌ SAO MỘT TỆP RIÊNG chứ không thêm một mục vào `caps/suggestion.ts`: tệp ấy
// gom chín mục GHI của khối Gợi ý / Việc tiếp theo / Hồ sơ, và ba người đang sửa
// ba tệp khác nhau trong cùng buổi. Thêm một mục `kind: "read"` vào giữa chín
// mục ghi cũng làm mờ vế khẳng định của `AD-2` — *"hạng đọc không có đường ghi
// nào"* — vốn dễ đọc nhất khi hai hạng nằm ở hai tệp.
//
// `AD-19` bắt MỌI lượt đọc đi qua sổ đăng ký, và `AD-UI-5` cho tầng ① đúng một
// cửa xuống: `loadCapability()`. Không có mục này thì khối Gợi ý hoặc không đọc
// được gì, hoặc mở một đường đọc thứ hai — và đường thứ hai là chỗ `actor` bị
// quên.
//
// ⚠ KHÔNG nhập `db`. Món nợ có ý thức của `caps/ui.ts` (`ui.ts → db`) đứng yên ở
// đó; tệp này đi xuống qua một hàm lõi thật, đúng hình dạng mà `caps/ui.ts` mô
// tả là *"cách trả nợ"*.

import { z } from "zod";
import { defineCap, type RegistryEntry } from "../types";
import { readPendingSuggestions } from "@/core/suggestion/read";

/// `S3` khối *Gợi ý chờ quyết* · `FR-19` · `T-5` — hàng đợi của MỘT Công ty.
///
/// `allowedActors: ["human"]` và KHÔNG `"system"`: hàng đợi là bề mặt để người
/// quyết. Vòng quét không đọc nó — nó SINH Gợi ý qua `queueSuggestion` và không
/// bao giờ cần biết cái gì đang chờ. Mở cửa cho máy ở đây là cho máy một lượt
/// đọc không ai gọi, và `T-10b` chứng minh bằng vắng mặt trên chính danh sách đó.
///
/// `exposeToMcp: false` — `AD-CP-6` chốt `mcp-server.ts` phơi ĐÚNG NĂM mục, và
/// mục này không nằm trong năm. Mô hình không cần biết người còn bao nhiêu việc
/// phải quyết; nó chỉ sinh Phát hiện (`AD-22`).
///
/// KHÔNG `selfLimiting`: `AD-4` liệt đúng sáu mục mang cờ đó và đây không phải
/// một trong sáu.
///
/// ⚠ Và nó KHÔNG cần cờ ấy, dù `T-9` bắt *"bấm Tắt AI xong việc làm tay vẫn
/// chạy"*: bước ⑥ và ⑦ của Cổng đều mở đầu bằng `actor.kind === "system"`
/// (`gate.ts:145`), nên trần ngân sách và phanh AI không với tới một lượt đọc
/// của người. Bật `selfLimiting` ở đây là miễn trừ một thứ chưa từng chặn nó, và
/// làm danh sách sáu mục của `AD-4` mất nghĩa.
export const readSuggestionQueueCap = defineCap({
  name: "readSuggestionQueue",
  allowedActors: ["human"] as const,
  allowedRoles: [],
  /// Không chạm ranh giới nào của `§5`: lượt đọc không đổi một ô hồ sơ nào.
  touches: [],
  selfLimiting: false,
  zone: "tu_do",
  risk: "low",
  requiresSignalSource: false,
  cascades: [],
  kind: "read",
  params: z.object({ accountId: z.uuid() }),
  dirtyFlags: [],
  exposeToMcp: false,
  /// ⚠ `createdAt` ra khỏi đây dưới dạng CHUỖI ISO. `AD-UI-5` bắt lá
  /// `'use client'` nhận props **đã tuần tự hoá**, và `Date` của Prisma không đi
  /// qua ranh giới server→client. Đổi ở đây, một lần, thay vì ở mỗi bề mặt.
  fn: async (actor, p) => {
    const rows = await readPendingSuggestions(actor, p.accountId);
    return rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));
  },
  /// `AD-CP-3` — `null` với mọi mục `kind: "read"`: không ghi thì không có giá
  /// trị TRƯỚC-GHI để chụp.
  snapshot: null,
});

/// `AD-CP-1` — xuất DUY NHẤT một hằng `entries`, đúng khuôn của `./suggestion.ts`.
/// Sổ đăng ký nạp qua `./index.ts`; thiếu dòng ở đó thì mục trên **im lặng
/// không tồn tại** và khối Gợi ý trả `unknown_capability`.
export const entries: readonly RegistryEntry[] = [
  readSuggestionQueueCap,
] as unknown as readonly RegistryEntry[];
