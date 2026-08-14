// `AD-2` · `AD-11` · `AD-12` · `AD-CP-3` — sáu mục phục vụ vòng quét, tầng ④.
//
// ⚠ TÊN LẤY NGUYÊN VĂN TỪ `AD-2`, không đặt mới. Bốn mục ghi ở đây là bốn trong
// sáu tên mà `AD-2` liệt cho `CAP_SYSTEM_INTERNAL` (`writeScanLog`,
// `acquireAccountLock`, `releaseAccountLock`, `recordAccountCost`); hai mục đọc
// là hai trong năm tên của **hạng đọc-chung** (`readAccountList`, `readSetting`).
// Đặt một tên khác — dù rõ nghĩa hơn — làm khối ba của `T-10` khẳng định trên
// một danh sách không khớp tài liệu, và không phép kiểm nào bắt được.
//
// ⚠ KHÔNG có `renewAccountLock` ở đây, và đó là cố ý: `AD-2` viết thẳng *"gia
// hạn khoá KHÔNG phải capability thứ ba — nó là `acquireAccountLock` gọi lại
// với cùng `process_id`. Thêm `renewAccountLock` làm `T-10` đỏ."*
//
// ⚠ HAI MỤC ĐỌC CÓ THỂ TRÙNG với tệp caps của tầng Quản trị / tầng đọc. Nếu
// bên đó cũng khai `readAccountList` hoặc `readSetting`, GIỮ MỘT BẢN — `Map`
// của `registry.ts` lấy bản khai SAU và bản trước biến mất im lặng. Chúng nằm
// ở đây vì thiếu chúng thì bước ③ của Cổng từ chối mọi lời gọi của vòng quét,
// và `T-8` lẫn `T-9` đỏ vì một lý do không liên quan đến nội dung của chúng.
//
// ⚠ KHÔNG khai `disableAi`, `createArticle`, `createSignal`, `appendTimelineEntry`,
// `setNextAction` ở đây dù vòng quét gọi cả năm. Chúng thuộc **hạng ghi** của
// khối một, mà khối một phải bằng ĐÚNG SÁU; khai trùng ở hai tệp là cách chắc
// chắn để con số đó thành bảy. Vòng quét gọi chúng **bằng tên** qua
// `loadCapability`, nên không có cạnh biên dịch nào giữa hai tệp.

import { z } from "zod";
import { defineCap, type RegistryEntry } from "../types";
import { searchCompanies } from "@/core/company";
import { getSetting, type SettingKey } from "@/core/settings";
import {
  SCAN_STOP_REASONS,
  openScanLog,
  addScanUsage,
  closeScanLog,
  recordScanEntry,
  acquireAccountLock,
  releaseAccountLock,
} from "@/core/scanlog";

/// Từ vựng khoá `settings`, dạng TUPLE để Zod dựng được `z.enum`.
///
/// `SETTING_DEFAULTS` là `Record<SettingKey, string>` nên `Object.keys` của nó
/// trả `string[]`, không trả tuple — không dùng làm lược đồ được. Danh sách
/// dưới đây là bản thứ hai, nên nó phải được TRÌNH BIÊN DỊCH canh, không phải
/// được canh bằng lời dặn: `satisfies` bắt khoá lạ, và `AllKeysCovered` bắt
/// khoá thiếu (`Exclude` khác `never` thì vi phạm ràng buộc, `TS2344`).
const SETTING_KEYS = [
  "ai_enabled",
  "model_calls_per_scan",
  "budget_warn_ratio",
  "budget_stop_ratio",
  "max_consecutive_denials",
  "scan_budget_usd",
  "scan_interval_minutes",
  "next_action_overwrite_overdue_manual",
  "unclassified_ratio_threshold",
  "blind_approve_seconds",
  "blind_approve_per_minute",
  "metrics_min_sample",
] as const satisfies readonly SettingKey[];

type AssertNever<T extends never> = T;
type AllKeysCovered = AssertNever<Exclude<SettingKey, (typeof SETTING_KEYS)[number]>>;
/// Chỉ tồn tại để `AllKeysCovered` được ĐÁNH GIÁ. Kiểu không dùng tới thì
/// TypeScript vẫn kiểm ràng buộc, nhưng một alias không ai tham chiếu dễ bị ai
/// đó dọn đi vì tưởng là rác — dòng này là lý do để nó ở lại.
export type _SettingKeysAreExhaustive = AllKeysCovered;

// ─────────────────────── Khối ba — `CAP_SYSTEM_INTERNAL` ───────────────────────

/// ⚠ `allowedActors: ["system"]` — KHÔNG `human`, KHÔNG `seed`. Đó chính là vị
/// từ mà `AD-2` dùng để định nghĩa khối ba, nên nới nó là làm khối ba mất định
/// nghĩa chứ không phải chỉ mở thêm một cửa.
const SYSTEM_ONLY = ["system"] as const;

/// `AD-11` · `FR-38` · `FR-39` — MỘT capability cho cả vòng đời `ScanLog`.
///
/// Ba thao tác dưới một tên vì `AD-2` liệt đúng một tên `writeScanLog`; tách
/// thành `openScanLog`/`closeScanLog`/`addScanUsage` là ba mục ở khối ba trong
/// khi tài liệu khai một, và khối ba tuy khẳng định bằng vị từ chứ không bằng
/// số thì danh sách *"hiện có"* của nó vẫn là thứ người đọc đối chiếu.
///
/// ⚠ Tham số là OBJECT PHẲNG có trường `op`, không phải `z.discriminatedUnion`.
/// `AD-CP-3` đòi `params` là `z.ZodObject` để `.shape` truyền được cho `tool()`
/// của SDK; một union ở gốc không có `.shape` và là `TS2339` **lúc dựng server**.
/// Cái giá: quan hệ giữa `op` và các trường kèm theo do thân hàm canh, không do
/// lược đồ canh — nên thân hàm ném tường minh thay vì đọc `undefined`.
export const writeScanLogCap = defineCap({
  name: "writeScanLog",
  allowedActors: SYSTEM_ONLY,
  allowedRoles: [],
  /// Không chạm ranh giới `§5` nào: `scan_log` là bảng hạ tầng, không phải hồ sơ.
  touches: [],
  /// ⚠ `true`, và đây là chỗ nó chịu lực. `AD-4` cho mục tự-giới-hạn chạy kể cả
  /// khi trần đã chạm — mà ĐÓNG vòng là việc phải làm ĐÚNG LÚC trần chạm. Khai
  /// `false` thì bước ⑥ của Cổng từ chối lời gọi đóng, hàng `ScanLog` đọng
  /// `finished_at NULL`, và mọi vòng sau bị bỏ với lý do sai cho tới khi hết
  /// hạn thuê. Tức đúng cái mà điều kiện dừng 3 và 4 sinh ra để xử lý lại tự
  /// biến thành sự cố.
  selfLimiting: true,
  zone: "chay_ngam",
  risk: "low",
  requiresSignalSource: false,
  cascades: [],
  kind: "write",
  params: z.object({
    op: z.enum(["open", "usage", "close"]),
    scanLogId: z.uuid().optional(),
    budgetUsd: z.number().nonnegative().optional(),
    leaseMinutes: z.number().int().positive().optional(),
    modelCalls: z.number().int().nonnegative().optional(),
    /// `null` là *"SDK không trả chi phí"* — KHÁC `0`. `AD-11`: không cộng 0,
    /// bên gọi ghi một dòng `FT10`.
    costUsd: z.number().nullable().optional(),
    stopReason: z.enum(SCAN_STOP_REASONS).optional(),
    resumeCursor: z.uuid().nullable().optional(),
    accountsPlanned: z.number().int().nonnegative().optional(),
  }),
  dirtyFlags: [],
  exposeToMcp: false,
  fn: async (_actor, p, ctx) => {
    if (p.op === "open") {
      if (p.budgetUsd === undefined || p.leaseMinutes === undefined) {
        throw new Error("writeScanLog(open) thiếu `budgetUsd` hoặc `leaseMinutes`.");
      }
      return openScanLog({ budgetUsd: p.budgetUsd, leaseMinutes: p.leaseMinutes }, ctx);
    }
    if (!p.scanLogId) throw new Error(`writeScanLog(${p.op}) thiếu \`scanLogId\`.`);
    if (p.op === "usage") {
      if (p.modelCalls === undefined) {
        throw new Error("writeScanLog(usage) thiếu `modelCalls`.");
      }
      await addScanUsage(
        { scanLogId: p.scanLogId, modelCalls: p.modelCalls, costUsd: p.costUsd ?? null },
        ctx,
      );
      return { ok: true as const };
    }
    if (!p.stopReason || p.accountsPlanned === undefined) {
      throw new Error("writeScanLog(close) thiếu `stopReason` hoặc `accountsPlanned`.");
    }
    return closeScanLog(
      {
        scanLogId: p.scanLogId,
        stopReason: p.stopReason,
        resumeCursor: p.resumeCursor ?? null,
        accountsPlanned: p.accountsPlanned,
      },
      ctx,
    );
  },
  snapshot: null,
  writesTables: ["scan_log"],
});

/// `AD-11` — một dòng mỗi Công ty mỗi vòng, và là NGUỒN của
/// `estimated_cost_per_account`. `AD-11` gọi đích danh đường ghi này
/// `recordAccountCost`, nên tên ở đây theo nó chứ không theo tên bảng.
export const recordAccountCostCap = defineCap({
  name: "recordAccountCost",
  allowedActors: SYSTEM_ONLY,
  allowedRoles: [],
  touches: [],
  /// `true`: dòng chi phí của Công ty vừa xử lý phải ghi được kể cả khi chính
  /// Công ty đó là Công ty làm trần ngân sách chạm. Không ghi thì con số đắt
  /// nhất — đúng con số dùng để đặt trần vòng sau — biến mất.
  selfLimiting: true,
  zone: "chay_ngam",
  risk: "low",
  requiresSignalSource: false,
  cascades: [],
  kind: "write",
  params: z.object({
    scanLogId: z.uuid(),
    accountId: z.uuid(),
    costUsd: z.number().nonnegative(),
    signalCount: z.number().int().nonnegative(),
    /// `FT1`–`FT10` của spine. Chuỗi trần vì cột là `String?`; từ vựng đóng do
    /// `FailureCode` của `@/core/errors` giữ, và bên gọi lấy từ đó.
    failureCode: z.string().nullable(),
  }),
  dirtyFlags: [],
  exposeToMcp: false,
  fn: async (_actor, p, ctx) => recordScanEntry(p, ctx),
  snapshot: null,
  writesTables: ["scan_log_entry"],
});

/// `AD-12` — lấy khoá, hoặc GIA HẠN khoá của chính mình bằng cùng lời gọi này.
export const acquireAccountLockCap = defineCap({
  name: "acquireAccountLock",
  allowedActors: SYSTEM_ONLY,
  allowedRoles: [],
  touches: [],
  /// `false` — lấy khoá là MỞ ĐẦU một đơn vị công việc, không phải kết thúc nó.
  /// Khai `true` ở đây làm vòng quét chiếm được Công ty mới sau khi trần đã
  /// chạm, tức phanh không phanh.
  selfLimiting: false,
  zone: "chay_ngam",
  risk: "low",
  requiresSignalSource: false,
  cascades: [],
  kind: "write",
  params: z.object({
    accountId: z.uuid(),
    processId: z.string().min(1),
    leaseMinutes: z.number().int().positive(),
  }),
  dirtyFlags: [],
  exposeToMcp: false,
  fn: async (_actor, p, ctx) => acquireAccountLock(p, ctx),
  snapshot: null,
  writesTables: ["account_lock"],
});

/// `AD-12` — nhả khoá. `accountId` bỏ trống = mọi khoá của tiến trình này
/// (bước ② lúc khởi động).
export const releaseAccountLockCap = defineCap({
  name: "releaseAccountLock",
  allowedActors: SYSTEM_ONLY,
  allowedRoles: [],
  touches: [],
  /// `true`, và spine gọi thẳng tên hậu quả nếu để `false`: *"khoá không nhả.
  /// `AD-12` suy vòng đang chạy từ khoá, lease 10 phút — ở nhịp 60 giây là 10
  /// vòng liên tiếp bị bỏ. Bật lại AI thì mười phút không có gì xảy ra."*
  selfLimiting: true,
  zone: "chay_ngam",
  risk: "low",
  requiresSignalSource: false,
  cascades: [],
  kind: "write",
  params: z.object({
    accountId: z.uuid().nullable().optional(),
    processId: z.string().min(1),
  }),
  dirtyFlags: [],
  exposeToMcp: false,
  fn: async (_actor, p, ctx) =>
    releaseAccountLock({ accountId: p.accountId ?? null, processId: p.processId }, ctx),
  snapshot: null,
  writesTables: ["account_lock"],
});

// ───────────────── Khối một, hạng ĐỌC-CHUNG — `AD-2` ─────────────────

/// `AD-2`: hạng đọc-chung mang `zone: 'tu_do'`, `risk: 'low'`,
/// `allowedActors: ['human','system']`. **Không liệt `'seed'`** — bước ② của
/// `AD-4` đã cho actor gieo qua trước khi tới bước ③, nên liệt thêm chỉ tạo hai
/// chỗ khai cùng một quyền.
const SHARED_READ = ["human", "system"] as const;

/// `AD-12` — vòng quét chốt tập Công ty **một lần** lúc bắt đầu. Đây là lời gọi
/// làm việc chốt đó, và nó là ĐỌC KHÔNG LỌC THEO NGƯỜI DÙNG, nên nó thuộc hạng
/// đọc-chung chứ không thuộc khối hai (`readAccountDetail` mới thuộc khối hai).
///
/// ⚠⚠ XUNG ĐỘT TÊN — PHẢI GIẢI TRƯỚC KHI NỐI VÀO `caps/index.ts`.
/// `src/capability/caps/ui.ts` cũng khai một mục tên `readAccountList`, và bản
/// đó mang `allowedActors` **chỉ người**. `registry.ts` dựng một `Map` theo tên
/// nên chỉ MỘT bản sống sót, và bản nào sống phụ thuộc thứ tự nhập trong
/// `caps/index.ts` — im lặng, không lỗi.
///
/// Nếu bản của `ui.ts` thắng thì bước ③ của Cổng từ chối vòng quét ở lời gọi
/// đầu tiên (`actor_not_allowed`), và `T-8` lẫn `T-9` đỏ với triệu chứng trỏ
/// vào vòng quét thay vì vào một dòng `allowedActors`.
///
/// `AD-2` đã phân xử sẵn, và nó phân xử theo hướng ngược lại: *"nếu gộp đọc và
/// ghi thành một con số cứng, vòng quét chết kẹt: nó là `actor=system` và phải
/// đọc danh sách Công ty (`AD-12`) … không đưa vào thì bước ③ từ chối mọi lời
/// gọi và `T-8`, `T-9` đỏ. Không có lối ra thứ ba."* Tức `readAccountList`
/// **phải** là hạng đọc-chung `['human','system']`.
///
/// HAI cách giải, chọn một — đừng để cả hai mục cùng tồn tại:
///   ⓐ thêm `"system"` vào `allowedActors` của `ui.ts`, rồi XOÁ mục này;
///   ⓑ giữ mục này và xoá mục của `ui.ts`, chấp nhận màn hình danh sách mất
///      khối `facets`.
/// ⓐ tốn ít việc hơn và giữ được cả hai bề mặt. `parseAccountList` của
/// `src/scan/_contract.ts` đã nhận CẢ HAI hình dạng trả về, nên vòng quét
/// không phải đổi dòng nào dù chọn cách nào.
export const readAccountListCap = defineCap({
  name: "readAccountList",
  allowedActors: SHARED_READ,
  allowedRoles: [],
  touches: [],
  selfLimiting: false,
  zone: "tu_do",
  risk: "low",
  requiresSignalSource: false,
  cascades: [],
  kind: "read",
  params: z.object({
    /// Vòng quét luôn truyền `true`. Để tuỳ chọn vì cùng lời gọi này phục vụ
    /// màn hình danh sách Công ty (`E1-S10`), và hai capability đọc cho cùng
    /// một truy vấn là hai chỗ trôi khỏi nhau.
    watching: z.boolean().optional(),
    text: z.string().optional(),
    industry: z.string().optional(),
    accountType: z.string().optional(),
    country: z.string().optional(),
  }),
  dirtyFlags: [],
  /// `AD-CP-6` — MỘT trong đúng năm mục hạng đọc-chung phơi lên MCP. Phơi rỗng
  /// đã bị loại: glob `mcp__crm__*` khớp rỗng thì phép đo nghiệm thu của `AD-1`
  /// mất đối tượng, và triệu chứng đo được là agent *trông như* gọi capability,
  /// handler chạy 0 lần, $1,607 một lượt.
  exposeToMcp: true,
  fn: async (actor, p) => searchCompanies(actor, p),
  /// `null` vì `kind: 'read'` — không có ảnh chụp trước-ghi cho một lượt đọc.
  snapshot: null,
});

/// `AD-15` · `D38` — đọc MỖI LẦN DÙNG, không nhớ đệm. Vòng quét đọc `ai_enabled`
/// ở **mỗi ranh giới Công ty** qua đúng lời gọi này; một tầng đệm ở bất kỳ đâu
/// trên đường này làm `T-9` đỏ với triệu chứng *"bấm tắt mà vòng vẫn chạy"*.
export const readSettingCap = defineCap({
  name: "readSetting",
  allowedActors: SHARED_READ,
  allowedRoles: [],
  touches: [],
  selfLimiting: false,
  zone: "tu_do",
  risk: "low",
  requiresSignalSource: false,
  cascades: [],
  kind: "read",
  params: z.object({ key: z.enum(SETTING_KEYS) }),
  dirtyFlags: [],
  /// `AD-CP-6` — MỘT trong đúng năm mục hạng đọc-chung phơi lên MCP. Phơi rỗng
  /// đã bị loại: glob `mcp__crm__*` khớp rỗng thì phép đo nghiệm thu của `AD-1`
  /// mất đối tượng, và triệu chứng đo được là agent *trông như* gọi capability,
  /// handler chạy 0 lần, $1,607 một lượt.
  exposeToMcp: true,
  /// Trả CHUỖI THÔ, không ép kiểu. Ép ở đây thì `budget_stop_ratio` và
  /// `ai_enabled` cần hai kiểu trả về khác nhau trên cùng một capability, và
  /// bên gọi mất đường phân biệt *"chưa đặt"* với *"đặt bằng chuỗi rỗng"*.
  fn: async (_actor, p) => ({ key: p.key, value: await getSetting(p.key) }),
  snapshot: null,
});

/// Xuất DUY NHẤT một hằng số `entries` (`AD-CP-1`).
///
/// ⚠ VIỆC CÒN NỢ, không làm được ở lượt này: `src/capability/caps/index.ts`
/// phải thêm `...scanEntries` thì sáu mục này mới tồn tại. Tệp đó nằm ngoài
/// phần tệp lượt này sở hữu. Chưa nối thì mọi lời gọi của vòng quét trả
/// `unknown_capability` — hỏng TO và RÕ, không hỏng im lặng, đúng chủ đích của
/// bước ① trong `decide`.
export const entries: readonly RegistryEntry[] = [
  writeScanLogCap,
  recordAccountCostCap,
  acquireAccountLockCap,
  releaseAccountLockCap,
  readAccountListCap,
  readSettingCap,
] as unknown as readonly RegistryEntry[];
