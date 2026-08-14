// `AD-2` · `AD-3` · `AD-CP-3` — chín mục capability của khối Gợi ý, Việc tiếp
// theo, Người liên hệ và Hoạt động.
//
// ⚠ TÊN TỆP HẸP HƠN NỘI DUNG, có chủ đích. `setPrimaryContact` và
// `createActivity` thuộc vùng hồ sơ và đúng ra nằm ở `caps/account.ts`; chúng ở
// đây vì phạm vi cục này chỉ mở đúng một tệp caps mới. Khi gộp lại thì chuyển
// hai mục cuối sang `account.ts` và tệp này còn đúng cái tên nó mang.
//
// ⚠ TỆP NÀY CHƯA ĐƯỢC NẠP. `AD-CP-1` bắt mọi tệp caps đi qua `caps/index.ts`,
// và một dòng `...suggestionEntries` phải được thêm vào `ALL_ENTRIES` ở đó.
// Thiếu dòng ấy thì chín mục dưới đây **không tồn tại** với sổ đăng ký, và
// `T-10b` vẫn xanh trên một sổ không đầy đủ. `caps/index.ts` nằm ngoài phạm vi
// cục này — đã báo.

import { z } from "zod";
import { defineCap, type RegistryEntry } from "../types";
import { setPrimaryContact } from "@/core/contact";
import { createActivity } from "@/core/activity";
import { createSuggestion, decideSuggestion } from "@/core/suggestion";
import {
  setNextAction, fillNextActionIfUnchanged, undoSystemNextAction,
} from "@/core/nextaction";

/// Hạng NGƯỜI. `"seed"` có mặt vì bộ gieo đi qua chính đường này (`AD-20`), và
/// bước ② của Cổng đã canh nó bằng hai vế (`actor.kind === 'seed'` **và**
/// `ctx.seedMode`).
const HUMAN = ["human", "seed"] as const;

/// Hạng NGƯỜI THUẦN — không `seed`. Dùng cho ba lối ra Gợi ý và Hoàn tác: bộ
/// gieo dựng dữ liệu ở trạng thái phát bài bằng đường TẠO, nó không quyết một
/// Gợi ý nào và không hoàn tác gì. Cho nó vào đây là mở một cửa không ai dùng,
/// và mở cửa không ai dùng là cách `T-5` đếm nhầm một lượt duyệt của bộ gieo.
const HUMAN_ONLY = ["human"] as const;

const SUGGESTION_ID = z.uuid();

// ───────────────────────────────────────────────────────────────────────────
// Sinh Gợi ý — `AD-22`, vùng CHẠY NGẦM
// ───────────────────────────────────────────────────────────────────────────

/// `AD-2` khối một hạng ghi — `queueSuggestion` là một trong sáu tên máy chạm
/// được. Vùng `chay_ngam` chứ không `ho_so_chinh_thuc`: Gợi ý là **Proposal**,
/// và ontology §6 xếp Claim/Proposal vào vùng chạy ngầm — *"chưa chạm vào dữ
/// liệu chính thức"*. Sinh một Gợi ý không đổi một ô hồ sơ nào; chỉ `FR-20` mới
/// đổi, và ba mục dưới đây đều là `HUMAN_ONLY`.
///
/// ⚠ `selfLimiting: false`. Lập luận *"`FR-51` tự giới hạn nó"* là ĐÚNG về
/// hành vi nhưng SAI về cờ này. `selfLimiting` không có nghĩa *"capability tự
/// giới hạn"* — `AD-4` định nghĩa nó là **miễn trừ bước ⑥ và ⑦ của Cổng**, tức
/// bỏ qua trần ngân sách và bỏ qua phanh AI.
///
/// Bật nó ở đây thì bấm Tắt AI xong Gợi ý VẪN sinh ra, và `T-9` đỏ ở đúng câu
/// *"hai chu kỳ kế tiếp không sinh gợi ý"*. `AD-4` liệt đúng SÁU mục mang cờ
/// này, và cả sáu đều là hạ tầng hoặc chỉ-đọc; không mục nào ghi dữ liệu
/// nghiệp vụ.
export const queueSuggestionCap = defineCap({
  name: "queueSuggestion",
  allowedActors: ["human", "system", "seed"],
  allowedRoles: [],
  /// Không chạm ranh giới nào: năm ranh giới của `§5` nói về Hồ sơ chính thức,
  /// và Gợi ý là Proposal.
  touches: [],
  selfLimiting: false,
  zone: "chay_ngam",
  risk: "low",
  /// `AD-22` — Gợi ý trace về Phát hiện bằng khoá ngoại THẬT.
  requiresSignalSource: true,
  cascades: ["suggestion_system_close"],
  kind: "write",
  /// Union phân biệt theo `kind`, khớp `CreateSuggestionInput` của lõi. Object
  /// phẳng ở đây khai được đúng ba trạng thái bất khả mà lõi vừa loại bỏ.
  ///
  /// ⚠ `z.object` ở mức GỐC là bắt buộc (`AD-CP-6`: `tool()` của SDK đọc
  /// `.shape`), nên union nằm ở một trường con, không ở gốc.
  params: z.object({
    accountId: z.uuid(),
    signalId: z.uuid(),
    proposal: z.discriminatedUnion("kind", [
      z.object({
        kind: z.literal("fill_field"),
        targetField: z.enum([
          "website", "country", "specialty_area", "revenue_range",
          "industry", "deal_value_tier", "founded_year", "account_type",
        ]),
        currentValue: z.string().nullable(),
        proposedValue: z.string().min(1),
      }),
      z.object({
        kind: z.literal("add_timeline"),
        timelineText: z.string().min(1),
      }),
    ]),
  }),
  dirtyFlags: [],
  exposeToMcp: false,
  fn: async (actor, p, ctx) =>
    createSuggestion(
      actor,
      { accountId: p.accountId, signalId: p.signalId, ...p.proposal },
      ctx,
    ),
  snapshot: null,
  writesTables: ["suggestion"],
});

// ───────────────────────────────────────────────────────────────────────────
// Ba lối ra của NGƯỜI — `FR-20`, `FR-22`
// ───────────────────────────────────────────────────────────────────────────
//
// BA mục, không một mục với tham số `outcome`. Cùng lý do đã tách
// `resumeFromPause` khỏi `reopenClosedOpportunity`: `T-5` khẳng định *sửa-rồi-
// duyệt* tách bạch khỏi *duyệt*, và `AD-2` liệt kê chúng bằng BA TÊN
// (`approveSuggestion`, `editThenApprove`, `dropSuggestion`). Tên là hợp đồng.
// Một mục gộp làm dòng ghi vết ghi cùng một `capability` cho ba việc khác nhau,
// và `T-5` mất bề mặt để đếm.

/// `FR-20` — Duyệt. Ghi thẳng giá trị đề nghị vào ô hồ sơ.
export const approveSuggestionCap = defineCap({
  name: "approveSuggestion",
  /// ⚠ `T-4` — *"không có chế độ tự duyệt"*. Vắng `"system"` ở đây là chỗ luật
  /// đó được cưỡng chế, và nó cưỡng chế ở bước ③ của Cổng, không bằng lời dặn.
  allowedActors: HUMAN_ONLY,
  allowedRoles: [],
  touches: [],
  selfLimiting: false,
  /// Duyệt ĐỔI một ô hồ sơ, nên vùng là `ho_so_chinh_thuc` — và `allowedActors`
  /// vắng `system` giữ đúng bất biến *"máy không cầm mục ghi hồ sơ nào"*.
  zone: "ho_so_chinh_thuc",
  risk: "high",
  requiresSignalSource: false,
  cascades: ["timeline_entry"],
  kind: "write",
  params: z.object({
    suggestionId: SUGGESTION_ID,
    /// `BR-B6` — đo từ lúc MỞ CHI TIẾT một Gợi ý, không từ lúc mở hàng đợi.
    decisionSeconds: z.number().int().nonnegative(),
  }),
  dirtyFlags: [],
  exposeToMcp: false,
  fn: async (actor, p, ctx) =>
    decideSuggestion(actor, { ...p, outcome: "duyet" }, ctx),
  snapshot: null,
  writesTables: ["suggestion", "account", "timeline_entry"],
});

/// `FR-22` — Sửa-rồi-duyệt. Ghi lại là **sửa**, KHÔNG ghi là **duyệt**.
export const editThenApproveCap = defineCap({
  name: "editThenApprove",
  allowedActors: HUMAN_ONLY,
  allowedRoles: [],
  touches: [],
  selfLimiting: false,
  zone: "ho_so_chinh_thuc",
  risk: "high",
  requiresSignalSource: false,
  cascades: ["timeline_entry"],
  kind: "write",
  params: z.object({
    suggestionId: SUGGESTION_ID,
    /// Bắt buộc, `min(1)`: *sửa-rồi-duyệt* mà giá trị sửa rỗng thì nó là *duyệt*
    /// đội một cái tên khác, và `T-5` đếm sai đúng con số nó dựng ra để đo.
    editedValue: z.string().min(1),
    decisionSeconds: z.number().int().nonnegative(),
  }),
  dirtyFlags: [],
  exposeToMcp: false,
  fn: async (actor, p, ctx) =>
    decideSuggestion(actor, { ...p, outcome: "sua_roi_duyet" }, ctx),
  snapshot: null,
  writesTables: ["suggestion", "account", "timeline_entry"],
});

/// `FR-20` · `BR-D10` — Bỏ, kèm lý do chọn từ năm giá trị của `0.1.7`.
///
/// `risk: "low"` và `writesTables` chỉ có `suggestion`: Bỏ **không đổi hồ sơ**
/// (`FR-21`). Nó vẫn là đường vào tử số của `errorDetectionRate` khi lý do là
/// `thong_tin_sai` (`D30`), nên nó đắt về mặt đo lường, không về mặt dữ liệu.
export const dropSuggestionCap = defineCap({
  name: "dropSuggestion",
  allowedActors: HUMAN_ONLY,
  allowedRoles: [],
  touches: [],
  selfLimiting: false,
  zone: "chay_ngam",
  risk: "low",
  requiresSignalSource: false,
  cascades: [],
  kind: "write",
  params: z.object({
    suggestionId: SUGGESTION_ID,
    /// ⚠ Năm giá trị này khớp TỪNG CHỮ `enum DropReason`. Không phải
    /// `trung_lap`/`chua_den_luc` — hai tên đó đã bị bác ở Mục 0.
    dropReason: z.enum([
      "thong_tin_sai", "khong_lien_quan", "da_cu", "hieu_sai_ngu_canh", "khac",
    ]),
    decisionSeconds: z.number().int().nonnegative(),
  }),
  dirtyFlags: [],
  exposeToMcp: false,
  fn: async (actor, p, ctx) =>
    decideSuggestion(actor, { ...p, outcome: "bo" }, ctx),
  snapshot: null,
  writesTables: ["suggestion"],
});

// ───────────────────────────────────────────────────────────────────────────
// Việc tiếp theo — HAI cửa vào, `AD-3` chạm ②
// ───────────────────────────────────────────────────────────────────────────
//
// Hai mục cho một bảng, cùng lý do đã tách hai đường quay lại của Cơ hội: một
// `allowedActors` không phát biểu được hai luật tác nhân khác nhau, và Cổng cố
// ý không đọc dữ liệu để phân biệt (`AD-GT-1`).
//
//   `setNextAction`              người gõ tay — ghi thẳng, `set_by = nguoi`
//   `fillNextActionIfUnchanged`  máy tự đặt   — kiểm-và-ghi nguyên tử (`AD-10`)

/// `FR-7` · `BR-B1` — người gõ. Thiếu nội dung hoặc thiếu hạn vẫn LƯU ĐƯỢC, nên
/// hai trường đều `nullable`; ép `min(1)` ở đây là làm `BR-B1` bất khả thi.
export const setNextActionCap = defineCap({
  name: "setNextAction",
  allowedActors: HUMAN,
  allowedRoles: [],
  touches: [],
  selfLimiting: false,
  zone: "ho_so_chinh_thuc",
  risk: "medium",
  requiresSignalSource: false,
  cascades: [],
  kind: "write",
  params: z.object({
    opportunityId: z.uuid(),
    content: z.string().nullable(),
    /// `z.iso.date()`, không `z.iso.datetime()`: cột là `@db.Date`. Gửi kèm giờ
    /// là bịa ra độ chính xác không có thật, rồi so qua múi giờ sẽ lệch một
    /// ngày — đúng lúc `BR-D7` có sàn *cuối ngày làm việc kế tiếp*.
    dueDate: z.iso.date().nullable(),
  }),
  /// `AD-CR-4` — mọi mục ghi chạm `opportunity` hoặc `next_action` phải khai
  /// danh sách KHÁC RỖNG. `BR-B1` là cờ thiếu Việc tiếp theo; `BR-B4` là vế
  /// *đang chạy* của nó, tức miễn trừ cho `tam_dung`.
  dirtyFlags: ["BR-B1", "BR-B4"],
  exposeToMcp: false,
  fn: async (actor, p, ctx) =>
    setNextAction(
      actor,
      {
        opportunityId: p.opportunityId,
        content: p.content,
        dueDate: p.dueDate ? new Date(p.dueDate) : null,
      },
      ctx,
    ),
  snapshot: null,
  writesTables: ["next_action"],
});

/// `AD-3` chạm ② · `FR-34` · `AD-10` — máy tự đặt, kiểm-và-ghi nguyên tử.
///
/// ⚠ `zone: "tu_do"`, KHÔNG `ho_so_chinh_thuc`, và đây là chỗ dễ đọc nhầm nhất
/// trong tệp. Bảng `Zone` có đúng ba giá trị và chúng là ba MỨC TỰ CHỦ, không
/// phải ba miền dữ liệu (`types.ts` nói thẳng thế). Ontology §6 xếp *"điền Việc
/// tiếp theo vào ô đang trống, hoặc rút ngắn hạn trên ô do chính máy đặt"* vào
/// hàng **Ba chạm ghi được phép** — tức mức máy được tự làm mà không hỏi ai.
/// Đó là cùng chỗ `appendTimelineEntryCap` đứng, và nó cũng khai `tu_do`.
///
/// Khai `ho_so_chinh_thuc` ở đây làm bất biến *"mọi mục ghi vùng hồ sơ đều
/// không cho `system`"* mâu thuẫn thẳng với `AD-3`, vốn cho máy đúng ba chạm và
/// đây là chạm thứ hai.
///
/// ⚠ `selfLimiting: false`, cùng lý do với `queueSuggestion`. *"0 hàng bị chạm
/// thì bỏ lượt, không thử lại"* (`AD-10`) là một tính chất tốt của thân hàm,
/// KHÔNG phải nghĩa của cờ này. Cờ này miễn trừ trần và phanh; bật nó thì bấm
/// Tắt AI xong máy VẪN tự đặt Việc tiếp theo — `T-9` đỏ ở đúng câu *"không tự
/// đặt Việc tiếp theo"*.
export const fillNextActionIfUnchangedCap = defineCap({
  name: "fillNextActionIfUnchanged",
  /// Không `"human"`: người gõ tay đi cửa `setNextAction`. Một người đi cửa này
  /// sẽ ghi một hàng `set_by = he_thong` mang cửa sổ Hoàn tác 7 ngày trên thứ
  /// chính họ vừa gõ.
  allowedActors: ["system", "seed"],
  allowedRoles: [],
  touches: [],
  selfLimiting: false,
  zone: "tu_do",
  risk: "high",
  /// `AD-3` — chạm ghi của máy **đòi `signalId` nguồn**.
  requiresSignalSource: true,
  cascades: ["notification"],
  kind: "write",
  params: z.object({
    opportunityId: z.uuid(),
    /// `FR-34` — giá trị máy ĐÃ ĐỌC. Cả HAI, không chỉ nội dung: người dời mỗi
    /// ngày hạn mà giữ nguyên chữ cũng không được bị đè.
    expectedContent: z.string().nullable(),
    expectedDueDate: z.iso.date().nullable(),
    content: z.string().min(1),
    dueDate: z.iso.date(),
    sourceSignalId: z.uuid(),
  }),
  dirtyFlags: ["BR-B1", "BR-B4"],
  exposeToMcp: false,
  fn: async (actor, p, ctx) =>
    fillNextActionIfUnchanged(
      actor,
      {
        opportunityId: p.opportunityId,
        expectedContent: p.expectedContent,
        expectedDueDate: p.expectedDueDate ? new Date(p.expectedDueDate) : null,
        content: p.content,
        dueDate: new Date(p.dueDate),
        sourceSignalId: p.sourceSignalId,
      },
      ctx,
    ),
  snapshot: null,
  writesTables: ["next_action", "notification"],
});

/// `D14` · `T-7` — Hoàn tác MỘT cú bấm, cửa sổ 7 ngày.
///
/// `allowedActors: HUMAN_ONLY`. Máy hoàn tác chính nó là một vòng lặp không ai
/// yêu cầu, và `selfLimiting: false` nói đúng điều đó: mục này không có cơ chế
/// tự dừng nào ngoài việc chỉ người mới bấm được.
export const undoSystemNextActionCap = defineCap({
  name: "undoSystemNextAction",
  allowedActors: HUMAN_ONLY,
  allowedRoles: [],
  touches: [],
  selfLimiting: false,
  zone: "ho_so_chinh_thuc",
  risk: "medium",
  requiresSignalSource: false,
  cascades: [],
  kind: "write",
  params: z.object({ opportunityId: z.uuid() }),
  dirtyFlags: ["BR-B1", "BR-B4"],
  exposeToMcp: false,
  fn: async (actor, p, ctx) => undoSystemNextAction(actor, p.opportunityId, ctx),
  snapshot: null,
  writesTables: ["next_action"],
});

// ───────────────────────────────────────────────────────────────────────────
// Hồ sơ — hai mục đúng ra thuộc `caps/account.ts`
// ───────────────────────────────────────────────────────────────────────────

/// `BR-D4` — Đầu mối chính, tối đa một mỗi Công ty.
export const setPrimaryContactCap = defineCap({
  name: "setPrimaryContact",
  allowedActors: HUMAN,
  allowedRoles: [],
  touches: [],
  selfLimiting: false,
  zone: "ho_so_chinh_thuc",
  risk: "medium",
  requiresSignalSource: false,
  /// Người cũ tự mất nhãn — một hệ quả trong CÙNG giao dịch, nên nó khai ở đây
  /// chứ không im lặng.
  cascades: ["contact_primary_cleared"],
  kind: "write",
  params: z.object({ contactId: z.uuid() }),
  dirtyFlags: [],
  exposeToMcp: false,
  fn: async (actor, p, ctx) => setPrimaryContact(actor, p.contactId, ctx),
  snapshot: null,
  writesTables: ["contact"],
});

/// `E1-S6` · `FR-6` — Hoạt động, và mục Dòng thời gian của nó.
///
/// `writesTables` khai CẢ `timeline_entry`: `FR-6` bắt Hoạt động hiện trên
/// Dòng thời gian chung, mà `readTimeline` chỉ đọc bảng `timeline_entry` —
/// không ghi vào đó thì Hoạt động vừa tạo không hiện ở đâu cả.
export const createActivityCap = defineCap({
  name: "createActivity",
  allowedActors: HUMAN,
  allowedRoles: [],
  touches: [],
  selfLimiting: false,
  zone: "ho_so_chinh_thuc",
  risk: "medium",
  requiresSignalSource: false,
  cascades: ["timeline_entry"],
  kind: "write",
  params: z.object({
    accountId: z.uuid(),
    opportunityId: z.uuid().nullable().optional(),
    /// Phải thuộc CÙNG Công ty với `accountId`. Zod không kiểm được điều đó —
    /// nó cần một lượt đọc — nên luật nằm ở LÕI, và dòng này chỉ nói nó tồn tại.
    contactId: z.uuid().nullable().optional(),
    /// `z.iso.datetime()` chứ không `z.date()`: Zod 4 ném *lúc dựng server*.
    occurredAt: z.iso.datetime(),
    type: z.enum(["gap", "goi", "gui_thu", "khac"]),
    description: z.string().nullable().optional(),
  }),
  dirtyFlags: [],
  exposeToMcp: false,
  fn: async (actor, p, ctx) =>
    createActivity(actor, { ...p, occurredAt: new Date(p.occurredAt) }, ctx),
  snapshot: null,
  writesTables: ["activity", "timeline_entry"],
});

/// Xuất DUY NHẤT một hằng số `entries` (`AD-CP-1`), giống `caps/account.ts`.
export const entries: readonly RegistryEntry[] = [
  queueSuggestionCap,
  approveSuggestionCap,
  editThenApproveCap,
  dropSuggestionCap,
  setNextActionCap,
  fillNextActionIfUnchangedCap,
  undoSystemNextActionCap,
  setPrimaryContactCap,
  createActivityCap,
] as unknown as readonly RegistryEntry[];
