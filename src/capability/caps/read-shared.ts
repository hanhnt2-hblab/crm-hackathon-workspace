// `AD-2` hạng ĐỌC-CHUNG · `AD-CP-6` — ba mục còn thiếu của tập phơi lên MCP.
//
// `AD-CP-6` chốt `mcp-server.ts` phơi ĐÚNG NĂM mục: `readArticle`,
// `readAccountType`, `listEnums`, `readAccountList`, `readSetting`. Hai mục sau
// đã có ở `caps/scan.ts`; ba mục ở tệp này là phần còn lại.
//
// ⚠ TẬP NÀY LÀ LỚP PHÒNG THỦ, KHÔNG PHẢI ĐƯỜNG LẤY DỮ LIỆU. `AD-AG-3` chốt
// agent không gọi capability nào — và phép đo của agent tầng ② xác nhận: hai
// lượt thật, handler chạy **0 lần**, vẫn rút được 5 Phát hiện. Tập này tồn tại
// để `allowedTools: ["mcp__crm__*"]` có đối tượng khớp, và để phép đối chứng
// phá hoại của `AD-1` có thứ để đo.
//
// Phơi rỗng đã bị `AD-CP-6` loại: glob khớp rỗng thì phép đo mất đối tượng, và
// triệu chứng đã đo một lần là agent *trông như* gọi capability, handler chạy
// 0 lần, $1,607 một lượt.

import { z } from "zod";
import { defineCap, type RegistryEntry } from "../types";
import { readArticle, readAccountType, listEnums } from "@/core/article";

/// `AD-2` hạng đọc-chung: `zone: 'tu_do'`, `risk: 'low'`,
/// `allowedActors: ['human','system']`. Ba trường này giống nhau ở cả ba mục,
/// và giống nhau là ĐÚNG — hạng đọc-chung được định nghĩa bằng chính chúng.
const DOC_CHUNG = {
  allowedActors: ["human", "system"],
  allowedRoles: [],
  touches: [],
  /// KHÔNG `selfLimiting`. `AD-4` liệt đúng sáu mục mang cờ đó, và ba mục này
  /// không nằm trong sáu. Chúng là đường đọc thường: khi trần chạm hoặc phanh
  /// tắt, chúng bị chặn — và bị chặn là ĐÚNG, vì không có chúng thì cũng không
  /// có lượt gọi mô hình nào cần chúng.
  selfLimiting: false,
  zone: "tu_do",
  risk: "low",
  requiresSignalSource: false,
  cascades: [],
  kind: "read",
  dirtyFlags: [],
  /// `AD-CP-6` — cả ba PHƠI lên MCP.
  exposeToMcp: true,
  snapshot: null,
} as const;

export const readArticleCap = defineCap({
  ...DOC_CHUNG,
  name: "readArticle",
  params: z.object({ id: z.uuid() }),
  fn: async (_actor, p) => readArticle(p.id),
});

export const readAccountTypeCap = defineCap({
  ...DOC_CHUNG,
  name: "readAccountType",
  params: z.object({ accountId: z.uuid() }),
  fn: async (_actor, p) => readAccountType(p.accountId),
});

export const listEnumsCap = defineCap({
  ...DOC_CHUNG,
  name: "listEnums",
  /// Object RỖNG, không phải `z.void()`. `AD-CP-3` đòi `params` là `ZodObject`
  /// vì `AD-CP-6` truyền `.shape` cho `tool()` của SDK; `z.void()` không có
  /// `.shape`, và đó là `TS2339` lúc dựng server — `npm start` chết.
  params: z.object({}),
  fn: async () => listEnums(),
});

export const entries: readonly RegistryEntry[] = [
  readArticleCap,
  readAccountTypeCap,
  listEnumsCap,
] as unknown as readonly RegistryEntry[];
