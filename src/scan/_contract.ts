// `AD-1` · `AD-CP-1` · `AD-GT-9` — hợp đồng giữa `src/scan` và tầng ④.
//
// `loadCapability` trả `BoundCapability = (params: unknown) => Promise<unknown>`,
// và từ chối của Cổng tới đây dưới dạng một lần NÉM (`GateDenied`). Vòng quét
// không được để cả hai lan vào thân: `unknown` bắt mọi truy cập trường phải ép
// kiểu, còn một lần ném giữa vòng sẽ bỏ dở đúng chỗ khoá đang cầm.
//
// Tệp này làm hai việc và không có việc thứ ba:
//   ① biến `unknown` thành kiểu bằng KIỂM LÚC CHẠY, không bằng `as`
//   ② biến `GateDenied` thành một GIÁ TRỊ — đưa từ chối trở lại đúng hình dạng
//      mà `AD-GT-9` đã chọn cho nó ở tầng ③, sau khi tầng ④ buộc phải ném
//
// ⚠ `src/scan` KHÔNG nhập `src/ingest` và ngược lại (`AD-UI-2`). Tệp này gần
// giống `src/ingest/_contract.ts`; gộp chúng vào một `src/shared` là dựng đúng
// nút mà `AD-UI-2` cấm, và cái nút đó là chỗ ba nhánh bắt đầu chia sổ đăng ký.

import type { Actor } from "@/core/actor";
import type { Registry } from "@/capability/registry";
import type { GateDenyReason } from "@/autonomy/gate";
import { GateDenied } from "@/capability/errors";

/// Hạn thuê khoá Công ty — `AD-12` chốt **10 phút**.
///
/// Hằng số, KHÔNG phải hàng `settings`: `AD-15` cho `settings` giữ tham số
/// nghiệp vụ mà Quản trị sửa lúc chạy, và hạn thuê không phải tham số nghiệp vụ
/// — nó là hằng số an toàn của cơ chế khoá. Đặt nó vào `settings` là cho phép
/// gõ `0` rồi hai vòng chạy song song trên cùng Công ty.
export const LOCK_LEASE_MINUTES = 10;

/// Hạn thuê của chính VÒNG QUÉT, tính bằng phút.
///
/// Nó phải RỘNG HƠN hạn khoá Công ty, không bằng: một vòng cầm khoá từng Công
/// ty lần lượt, nên vòng luôn sống lâu hơn bất kỳ khoá đơn lẻ nào. Bằng nhau
/// thì một vòng chạy bình thường trên Công ty thứ hai đã bị coi là *vòng chết*
/// và bị thu hồi giữa chừng.
/// ⚠ NĂM phút, KHÔNG phải ba mươi — và con số này là rủi ro vận hành, không
/// phải một tham số kỹ thuật.
///
/// `D19` bỏ mọi vòng khi còn một hàng `scan_log` chưa đóng, và một hàng chỉ được
/// thu hồi sau khi hạn thuê hết. Tiến trình bị giết giữa chu kỳ — Ctrl-C, đóng
/// terminal, máy ngủ — để lại đúng một hàng như thế.
///
/// Với 30 phút, hệ thống khi ấy **không làm gì suốt nửa tiếng** và nhật ký in
/// `BỎ VÒNG — vòng trước chưa kết thúc` mỗi phút. Không dòng nào sai, và người
/// đứng xem kết luận là AI hỏng. Đã dính hai lần trong một đêm dựng.
///
/// Năm phút vẫn rộng hơn nhiều so với một chu kỳ thật (đo được 39–66 giây), nên
/// nó không cắt nhầm một vòng đang chạy — nó chỉ rút ngắn khoảng chết sau một
/// lần chết bất thường.
export const SCAN_LEASE_MINUTES = 5;

/// Kết cục MỘT lời gọi capability, ba nhánh phân biệt được.
///
/// `denied` tách khỏi `failed` vì hai thứ khác nhau về bản chất và về cách xử:
/// từ chối là CHÍNH SÁCH — vòng quét phải đọc mã lý do rồi quyết dừng hay đi
/// tiếp; lỗi là SỰ CỐ — nó vào `FT10`. Gộp chúng làm phanh AI (`brake`) trông
/// giống hệt cơ sở dữ liệu chết, và `T-9` sẽ báo sai nguyên nhân.
export type CapOutcome =
  | { status: "ok"; value: unknown }
  | { status: "denied"; reason: GateDenyReason; capability: string }
  | { status: "failed"; capability: string; error: unknown };

/// Gọi một capability và KHÔNG BAO GIỜ ném.
///
/// Vòng quét cầm khoá Công ty trong lúc chạy; một lần ném lọt qua sẽ nhảy khỏi
/// khối `finally` gần nhất mà người viết không nghĩ tới, và khoá đó nằm lại cho
/// tới khi hết hạn thuê — mười phút không có gì xảy ra, ở nhịp 60 giây là mười
/// vòng bị bỏ. Ràng buộc *không ném* ở đây rẻ hơn nhiều so với việc rà lại mọi
/// đường thoát trong thân vòng.
export async function callCap(
  registry: Registry,
  actor: Actor,
  name: string,
  params: unknown,
): Promise<CapOutcome> {
  try {
    const bound = await registry.loadCapability(name, actor);
    return { status: "ok", value: await bound(params) };
  } catch (e) {
    if (e instanceof GateDenied) {
      return { status: "denied", reason: e.reason, capability: name };
    }
    return { status: "failed", capability: name, error: e };
  }
}

/// Hàm gọi capability đã gắn sẵn sổ đăng ký và tác nhân — thứ `runScanCycle`
/// dựng một lần rồi truyền xuống mọi hàm con.
///
/// Khai ở đây chứ không ở `loop.ts`: `next-action.ts` cũng nhận nó, và hai tệp
/// cùng khai một `type CallFn` là hai chuỗi chờ trôi khỏi nhau.
export type CallFn = (name: string, params: unknown) => Promise<CapOutcome>;

// ───────────────── Hình dạng dữ liệu đọc qua capability ─────────────────

class ContractError extends Error {
  constructor(capability: string, detail: string) {
    super(`Hợp đồng tầng ④ lệch ở \`${capability}\`: ${detail}`);
    this.name = "ContractError";
  }
}

function asRecord(cap: string, v: unknown): Record<string, unknown> {
  if (typeof v !== "object" || v === null) {
    throw new ContractError(cap, `mong đợi một đối tượng, nhận \`${typeof v}\`.`);
  }
  return v as Record<string, unknown>;
}

function str(cap: string, o: Record<string, unknown>, k: string): string {
  const v = o[k];
  if (typeof v !== "string") throw new ContractError(cap, `trường \`${k}\` không phải chuỗi.`);
  return v;
}

function num(cap: string, o: Record<string, unknown>, k: string): number {
  const v = o[k];
  if (typeof v !== "number") throw new ContractError(cap, `trường \`${k}\` không phải số.`);
  return v;
}

export type AccountRef = { id: string; name: string };

/// Nhận HAI hình dạng, có chủ đích: một mảng trần, hoặc `{ rows: [...] }`.
///
/// Không phải phòng thủ suy đoán — hai mục `readAccountList` đang cùng tồn tại
/// trong repo (xem cảnh báo XUNG ĐỘT ở `src/capability/caps/scan.ts`): bản của
/// vòng quét trả mảng trần, bản của màn hình danh sách trả `{ rows, facets }`
/// vì `EXPERIENCE.md` đòi bộ lọc quay về cùng dữ liệu. `Map` của `registry.ts`
/// chỉ giữ MỘT, và bên thắng phụ thuộc thứ tự khai trong `caps/index.ts` — thứ
/// mà lượt làm việc này không sở hữu. Chấp nhận cả hai thì vòng quét chạy được
/// dù bên nào thắng; chấp nhận một thì nó chết theo thứ tự nhập của tệp khác.
export function parseAccountList(v: unknown): AccountRef[] {
  const rows = Array.isArray(v)
    ? v
    : (asRecord("readAccountList", v).rows as unknown);
  if (!Array.isArray(rows)) {
    throw new ContractError("readAccountList", "mong đợi một mảng hoặc `{ rows: [...] }`.");
  }
  return rows.map((row) => {
    const o = asRecord("readAccountList", row);
    return { id: str("readAccountList", o, "id"), name: str("readAccountList", o, "name") };
  });
}

/// Bản lưu GẦN NHẤT của một Công ty, cộng số Phát hiện đã rút từ nó.
///
/// `signalCount` là thứ trả lời *"nội dung này đã xử lý chưa"* mà không cần một
/// cột `processed_at` nào: `FR-36` chống trùng ở **tầng Phát hiện**, nên *"Bản
/// lưu đã có Phát hiện"* chính là định nghĩa của *đã xử lý*. Một cột cờ riêng
/// là nguồn sự thật thứ hai, và nó lệch ngay lần đầu có ai xoá một Phát hiện.
export type LatestArticle = {
  articleId: string;
  snapshotId: string;
  version: string;
  contentHash: string;
  /// Bản CHUẨN HOÁ (`AD-18`) — đây là văn bản mà offset câu trích neo vào, nên
  /// nó cũng phải là văn bản đưa cho mô hình. Đưa bản thô thì `BR-D2` khớp
  /// nguyên văn trên một chuỗi khác với chuỗi đã lưu, và MỌI Phát hiện rụng.
  normalizedText: string;
  readable: boolean;
  unreadableReason: string | null;
  signalCount: number;
};

export function parseLatestArticle(v: unknown): LatestArticle | null {
  if (v === null || v === undefined) return null;
  const o = asRecord("readArticle", v);
  const reason = o.unreadableReason;
  return {
    articleId: str("readArticle", o, "id"),
    snapshotId: str("readArticle", o, "snapshotId"),
    version: str("readArticle", o, "version"),
    contentHash: str("readArticle", o, "contentHash"),
    normalizedText: str("readArticle", o, "normalizedText"),
    readable: o.readable !== false,
    unreadableReason: typeof reason === "string" ? reason : null,
    signalCount: typeof o.signalCount === "number" ? o.signalCount : 0,
  };
}

export function parseSettingValue(v: unknown): string {
  return str("readSetting", asRecord("readSetting", v), "value");
}

/// Kết cục MỘT lượt tự đặt Việc tiếp theo (`§4/nhóm 4` · `T-6`).
///
/// `filled: false` KHÔNG phải lỗi — `AD-10` chốt *"0 hàng bị chạm thì bỏ lượt,
/// không thử lại"*, và `fillNextActionIfUnchanged` bỏ lượt ở sáu chỗ khác nhau
/// (Cơ hội không đang chạy, ô đã đổi giữa lúc đọc và lúc ghi, hạn mới xa hơn hạn
/// đang có, ô do người đặt mà cờ ghi-đè đang tắt…). Vòng quét phải PHÂN BIỆT
/// được chúng, nếu không thì *"tin không đáng chú ý"* — chuyện bình thường xảy
/// ra mỗi vòng — trông hệt *"luật `AD-10` vừa chặn một lần máy suýt ghi đè người"*.
export type AutoSetNextActionValue = {
  filled: boolean;
  /// Câu tiếng Việt nói VÌ SAO bỏ lượt. `null` khi đã ghi, hoặc khi lõi chưa
  /// nói — xem ghi chú hình dạng ngay dưới.
  reason: string | null;
  opportunityId: string | null;
};

/// Nhận HAI hình dạng, cùng lý do đã cho `parseAccountList` nhận hai hình dạng.
///
/// `fillNextActionIfUnchanged` của lõi hôm nay trả một `boolean` TRẦN
/// (`src/core/nextaction/index.ts`), và lý do bỏ lượt chỉ còn lại trong dòng ghi
/// vết `no_op` — tức ở một bảng mà tầng ① không đọc được. Hình dạng đầy đủ
/// (`{ filled, reason, opportunityId }`) là thứ `FR-39` cần để dòng nhật ký nêu
/// được LÝ DO; nó thuộc phần lõi mà lượt làm việc này không sở hữu.
///
/// Chấp nhận cả hai thì vòng quét chạy đúng dù lõi đổi hay không đổi, và khi lõi
/// còn trả `boolean` thì `reason` là `null` — vòng quét in *"lõi không nêu lý
/// do"* thay vì bịa một lý do. Bịa mới là chỗ hỏng: `FR-39` đã một lần in
/// *"lỗi: không"* cho một vòng hỏng nặng, và một lý do sai đọc y hệt một lý do đúng.
export function parseAutoSetNextAction(v: unknown): AutoSetNextActionValue {
  if (typeof v === "boolean") {
    return { filled: v, reason: null, opportunityId: null };
  }
  const o = asRecord("fillNextActionIfUnchanged", v);
  const reason = o.reason;
  const opportunityId = o.opportunityId;
  return {
    filled: o.filled === true,
    reason: typeof reason === "string" ? reason : null,
    opportunityId: typeof opportunityId === "string" ? opportunityId : null,
  };
}

export type OpenScanLogValue =
  | { opened: true; scanLogId: string; startedAt: string; reclaimed: number }
  | { opened: false; reason: string; blockedByScanLogId: string; skippedScanLogId: string };

export function parseOpenScanLog(v: unknown): OpenScanLogValue {
  const o = asRecord("writeScanLog", v);
  if (o.opened === true) {
    const startedAt = o.startedAt;
    return {
      opened: true,
      scanLogId: str("writeScanLog", o, "scanLogId"),
      startedAt: startedAt instanceof Date ? startedAt.toISOString() : String(startedAt),
      reclaimed: typeof o.reclaimed === "number" ? o.reclaimed : 0,
    };
  }
  return {
    opened: false,
    reason: str("writeScanLog", o, "reason"),
    blockedByScanLogId: str("writeScanLog", o, "blockedByScanLogId"),
    skippedScanLogId: str("writeScanLog", o, "skippedScanLogId"),
  };
}

export function parseLockResult(v: unknown): { acquired: boolean; heldBy: string | null } {
  const o = asRecord("acquireAccountLock", v);
  if (o.acquired === true) return { acquired: true, heldBy: null };
  const heldBy = o.heldBy;
  return { acquired: false, heldBy: typeof heldBy === "string" ? heldBy : null };
}

/// Sáu trường của `FR-39`, đọc lại từ giá trị trả về của `writeScanLog(close)`.
export type CycleSummaryValue = {
  scanLogId: string;
  durationMs: number;
  accountsScanned: number;
  accountsPlanned: number;
  newSnapshots: number;
  newTimelineEntries: number;
  failureCodes: string[];
  signalCount: number;
  modelCallsUsed: number;
  costUsedUsd: number;
  stopReason: string;
  partial: boolean;
};

export function parseCycleSummary(v: unknown): CycleSummaryValue {
  const o = asRecord("writeScanLog", v);
  const codes = o.failureCodes;
  return {
    scanLogId: str("writeScanLog", o, "scanLogId"),
    durationMs: num("writeScanLog", o, "durationMs"),
    accountsScanned: num("writeScanLog", o, "accountsScanned"),
    accountsPlanned: num("writeScanLog", o, "accountsPlanned"),
    newSnapshots: num("writeScanLog", o, "newSnapshots"),
    newTimelineEntries: num("writeScanLog", o, "newTimelineEntries"),
    failureCodes: Array.isArray(codes) ? codes.map(String) : [],
    signalCount: num("writeScanLog", o, "signalCount"),
    modelCallsUsed: num("writeScanLog", o, "modelCallsUsed"),
    costUsedUsd: num("writeScanLog", o, "costUsedUsd"),
    stopReason: str("writeScanLog", o, "stopReason"),
    partial: o.partial === true,
  };
}
