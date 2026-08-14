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
import {
  readArticleLatest,
  listArticleFingerprints,
  readAccountType,
  listEnums,
} from "@/core/article";

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

/// ⚠ THAM SỐ LÀ `{accountId, scope}`, KHÔNG phải `{id}`.
///
/// Bản đầu khai `z.object({ id: z.uuid() })` — một Bản lưu theo khoá chính. Đo
/// được: không tầng ① nào gọi như thế. `src/scan/loop.ts` gọi
/// `{accountId, scope:"latest"}`, `src/ingest` gọi `{accountId, scope:"all"}`.
/// Zod bác cả hai, mỗi Công ty ăn một `FT10`, ba lần liên tiếp chạm
/// `max_consecutive_denials`, và vòng quét chết TRƯỚC khi tới mô hình.
///
/// Triệu chứng không giống lỗi hợp đồng chút nào: nhật ký `FR-39` in *"quét 0/0
/// Công ty"*, đọc như thể không có Công ty nào để quét. Đây là lý do lược đồ
/// Zod ở tầng ④ phải được viết TỪ lời gọi thật, không từ hình dung về lõi.
export const readArticleCap = defineCap({
  ...DOC_CHUNG,
  name: "readArticle",
  params: z.object({
    accountId: z.uuid(),
    /// `.default("latest")` chứ không bắt buộc: `mcp-server.ts` phơi lược đồ
    /// này cho mô hình, và một trường enum bắt buộc mà mô hình không đoán được
    /// ý nghĩa là một lượt gọi hỏng không cần thiết.
    scope: z.enum(["latest", "all"]).default("latest"),
  }),
  fn: async (_actor, p) =>
    p.scope === "all"
      ? listArticleFingerprints(p.accountId)
      : readArticleLatest(p.accountId),
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
