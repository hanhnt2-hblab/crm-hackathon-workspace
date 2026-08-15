// `AD-2` khối một hạng GHI — ba mục máy chạm được mà sổ đăng ký đang thiếu.
//
// `AD-2` khai đúng sáu mục hạng ghi; sổ chỉ có ba (`queueSuggestion`,
// `fillNextActionIfUnchanged`, `appendTimelineEntry`). Ba mục dưới đây là phần
// còn lại, và cả ba đều **được gọi bởi mã đang chạy**:
//
//   `src/scan/loop.ts:508`  → `createSignal`
//   `src/ingest/load-snapshots.ts:125` → `createArticle`
//   `src/scan/loop.ts:579`  → `disableAi`
//
// Vắng mặt khỏi sổ, cả ba trả `unknown_capability` ở bước ① của `AD-4`. Với
// `disableAi` đó là van cuối cùng của ngân sách hỏng trong im lặng: chạm trần,
// gọi tắt, không tắt được, vòng sau lại mở và lại tiêu tiền.
//
// ⚠ KHÔNG mục nào ở đây `exposeToMcp`. `AD-CP-6` cấm thẳng phơi mục ghi, và ba
// mục này là đúng thứ `AD-AG-3` nói agent không được có.

import { z } from "zod";
import { defineCap, type RegistryEntry } from "../types";
import { createArticle } from "@/core/article";
import { createSignal } from "@/core/signal";
import { disableAi, enableAi } from "@/core/ai-brake";
import { SIGNAL_ENUMS } from "@/core/article";

/// `createArticle` — nạp một Bản lưu mới. `src/ingest` là bên gọi duy nhất.
///
/// Vùng `chay_ngam`: một Bản lưu chưa chạm ô hồ sơ nào. `touches: []` vì năm
/// ranh giới của `§5` nói về Hồ sơ chính thức, và Bản lưu không phải hồ sơ.
export const createArticleCap = defineCap({
  name: "createArticle",
  allowedActors: ["human", "system", "seed"],
  allowedRoles: [],
  touches: [],
  /// `selfLimiting: false`. `AD-4` liệt đúng sáu mục mang cờ này và đây không
  /// nằm trong sáu. Đúng như vậy: bấm Tắt AI thì việc nạp Bản lưu MỚI cũng
  /// phải dừng, vì nạp xong là vòng quét có cớ gọi mô hình.
  selfLimiting: false,
  zone: "chay_ngam",
  risk: "low",
  requiresSignalSource: false,
  cascades: [],
  kind: "write",
  dirtyFlags: [],
  exposeToMcp: false,
  snapshot: null,
  writesTables: ["snapshot", "article"],
  params: z.object({
    accountId: z.uuid(),
    snapshotVersion: z.string().min(1),
    capturedAt: z.string().min(1),
    rawText: z.string().min(1),
    contentHash: z.string().min(1),
    publishedUrl: z.string().nullable(),
    readable: z.boolean(),
    unreadableReason: z.string().nullable(),
  }),
  fn: async (actor, p, ctx) => createArticle(actor, p, ctx),
});

/// `createSignal` — `T-2` sống ở đây.
///
/// ⚠ Lược đồ này KHÔNG phải chỗ cưỡng chế `BR-D1`. `T-2` nói nguyên văn *"Thử
/// ghi thẳng, phải bị từ chối"*, nghĩa là chặn phải nằm ở TẦNG NGHIỆP VỤ —
/// `createSignal` của lõi ném `BusinessRuleError("BR-D1")` trước khi chạm CSDL.
/// `z.string().min(1)` ở đây chỉ là lớp ngoài; gỡ nó đi thì `T-2` vẫn phải xanh.
export const createSignalCap = defineCap({
  name: "createSignal",
  allowedActors: ["human", "system", "seed"],
  allowedRoles: [],
  touches: [],
  selfLimiting: false,
  zone: "chay_ngam",
  risk: "low",
  /// `AD-22` — Phát hiện là GỐC của chuỗi trace, không phải mắt xích giữa. Nó
  /// không cần một Phát hiện nguồn; nó LÀ nguồn.
  requiresSignalSource: false,
  cascades: [],
  kind: "write",
  dirtyFlags: [],
  exposeToMcp: false,
  snapshot: null,
  writesTables: ["signal"],
  params: z.object({
    accountId: z.uuid(),
    articleId: z.uuid(),
    claim: z.string().min(1),
    quote: z.string(),
    /// ⚠ KHÔNG khai `quoteStart`/`quoteEnd` ở đây, và đó không phải sơ suất.
    ///
    /// Bản đầu khai cả hai bắt buộc. Đo được trên một lượt quét thật: mô hình
    /// rút 5 Phát hiện, **cả 5 bị bác ngay tại lược đồ này** vì không tầng nào
    /// trên nó sinh ra được hai số đó — `AD-AG-3` cấm tầng ② nhập `@/core`, nên
    /// nó không có `normalize()`, mà `AD-18` bắt offset tính trên bản chuẩn hoá.
    ///
    /// Lõi tự tính bằng `findQuote` và **cố ý bỏ qua** giá trị bên gọi đưa: mô
    /// hình trả được offset đúng định dạng mà lệch vị trí, và khi đó `T-3` mở
    /// sai đoạn văn mà không lớp nào bắt được. Một trường mà bên gọi không điền
    /// nổi và bên nhận không dùng thì không thuộc về hợp đồng.
    signalType: z.enum(SIGNAL_ENUMS.signalType),
    signalSubtype: z.enum(SIGNAL_ENUMS.signalSubtype).nullable(),
    confidence: z.enum(SIGNAL_ENUMS.confidence),
    /// `BR-D6` · chốt 14/8 — ĐỀ NGHỊ của mô hình. Lõi so nó với giá trị tự suy
    /// rồi ghi độ lệch; cột `signal.relevance` luôn nhận giá trị lõi.
    relevance: z.enum(SIGNAL_ENUMS.relevance),
    relevanceReason: z.string().nullable().optional(),
    /// Chuỗi ISO, không `z.date()`. `AD-CP-5` chốt tầng ④ không nhận `Date` qua
    /// biên: tham số tới đây đã đi qua JSON, và `z.date()` bác mọi chuỗi.
    eventDate: z.string().nullable(),
    /// `BR-D2` — hai số công cụ `verifyQuote` trả về, mô hình chép lại. Lõi đối
    /// chiếu với giá trị nó tự tính; KHÔNG BAO GIỜ lưu. `.optional()` vì bộ gieo
    /// và `src/ingest` không có mô hình nào để gọi công cụ.
    modelQuoteRange: z
      .object({ start: z.number().int().nonnegative(), end: z.number().int().nonnegative() })
      .nullable()
      .optional(),
  }),
  fn: async (actor, p, ctx) =>
    createSignal(
      actor,
      { ...p, eventDate: p.eventDate === null ? null : new Date(p.eventDate) },
      ctx,
    ),
});

/// `disableAi` — điều kiện dừng 4 của `AD-11`, van cuối cùng của ngân sách.
///
/// ⚠ `selfLimiting: true`. Đây là một trong SÁU mục `AD-4` liệt, và là mục cờ
/// đó quan trọng nhất. Không có nó, bước ⑥ của Cổng chặn `disableAi` khi chạm
/// trần ngân sách — mà chạm trần chính là lúc DUY NHẤT máy gọi hàm này. Van tự
/// khoá đúng lúc cần mở, và triệu chứng là hoá đơn chứ không phải một dòng lỗi.
export const disableAiCap = defineCap({
  name: "disableAi",
  allowedActors: ["human", "system", "seed"],
  allowedRoles: [],
  touches: [],
  selfLimiting: true,
  zone: "tu_do",
  risk: "low",
  requiresSignalSource: false,
  cascades: [],
  kind: "write",
  dirtyFlags: [],
  exposeToMcp: false,
  snapshot: null,
  writesTables: ["setting"],
  params: z.object({
    reason: z.string().min(1),
    scanLogId: z.uuid().nullable().optional(),
  }),
  fn: async (actor, p, ctx) => disableAi(actor, p, ctx),
});

/// `enableAi` — `T-9` đòi *"Bật lại thì vòng quét chạy tiếp"*.
///
/// ⚠ `allowedActors` CHỈ có `human`. Đây là chỗ khác biệt duy nhất giữa hai
/// chiều của phanh, và nó là chủ đích: máy tự tắt được, máy KHÔNG tự bật lại
/// được. Nếu bật được thì điều kiện dừng 4 chỉ trì hoãn một vòng.
///
/// ⚠ `selfLimiting: false` — ngược với `disableAi`. Bước ⑦ của Cổng chặn mục
/// này khi phanh đang tắt… mà phanh đang tắt là tiền đề của việc bật lại. Nên
/// cờ phải bật? KHÔNG: `AD-4` bước ⑦ chỉ áp cho `actor.kind === "system"`, và
/// mục này người mới gọi được. Người bấm không đi qua bước ⑥/⑦.
export const enableAiCap = defineCap({
  name: "enableAi",
  allowedActors: ["human"],
  allowedRoles: [],
  touches: [],
  selfLimiting: false,
  zone: "tu_do",
  risk: "low",
  requiresSignalSource: false,
  cascades: [],
  kind: "write",
  dirtyFlags: [],
  exposeToMcp: false,
  snapshot: null,
  writesTables: ["setting"],
  params: z.object({ reason: z.string().min(1) }),
  fn: async (actor, p, ctx) => enableAi(actor, p, ctx),
});

export const entries: readonly RegistryEntry[] = [
  createArticleCap,
  createSignalCap,
  disableAiCap,
  enableAiCap,
] as unknown as readonly RegistryEntry[];
