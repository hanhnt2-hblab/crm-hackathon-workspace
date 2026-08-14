// `AD-11` · `AD-CP-7` · `AD-12` — vòng đời một lượt quét, và khoá theo Công ty.
//
// Hàm này ở LÕI chứ không ở tầng ④, dù chỉ tầng ④ gọi nó. Lý do là ranh giới
// `AD-1`: tầng ④ không cầm `db`. Nếu `collectGateContext` tự truy vấn `ScanLog`
// thì tầng ④ phải nhập client, và luật lint bác — đúng, vì khi đó tầng ④ biết
// hình dạng bảng, và một lần đổi cột kéo theo sửa ở hai tầng.
//
// ⚠ PHẠM VI TỆP NÀY RỘNG HƠN TÊN CỦA NÓ — khai ra để người sau không tưởng là
// vô tình. Bảng `account_lock` (`AD-12`) đáng lẽ ở `src/core/lock.ts`, và cây
// tệp của spine ghi `src/scan/lock.ts`. Cả hai chỗ đều không dựng được ở lượt
// này: `src/scan` là tầng ① nên không cầm `db` (`AD-1`), còn `src/core/lock.ts`
// nằm ngoài phần tệp mà lượt làm việc này sở hữu. Đặt tạm ở đây là chọn *một
// tệp lõi sai tên* thay vì *một đường ghi Postgres ở tầng ①* — và `AD-12` đã
// buộc hai thứ này vào nhau bằng câu *"trạng thái vòng đang chạy SUY TỪ KHOÁ"*.
// Việc còn nợ: tách khối `AccountLock` ở cuối tệp sang `src/core/lock.ts`, đổi
// đúng một dòng nhập ở `src/capability/caps/scan.ts`.

import { db, tx } from "./db";
import type { CoreContext } from "./context";

export type ActiveScanUsage = {
  /// `null` khi KHÔNG có lượt quét nào đang chạy — người bấm nút trên giao diện
  /// là trường hợp phổ biến nhất. Đừng thay bằng 0: *"không có lượt quét"* và
  /// *"lượt quét chưa tiêu gì"* là hai chuyện khác nhau, và gộp chúng làm phanh
  /// ngân sách đọc một hàng không tồn tại rồi kết luận còn nguyên trần.
  modelCallsUsed: number;
  costUsedUsd: number;
} | null;

/// Tử số và mẫu số của cả hai trần lấy từ CÙNG MỘT hàng — hàng của lượt quét
/// đang chạy. Hai truy vấn cho hai vế là cách chắc chắn để tỉ lệ nhảy giữa hai
/// lời gọi liền nhau, và phanh bật tắt theo nhịp không ai giải thích được.
export async function readActiveScanUsage(): Promise<ActiveScanUsage> {
  const row = await db.scanLog.findFirst({
    where: { finishedAt: null },
    orderBy: { startedAt: "desc" },
    select: { modelCallsUsed: true, costUsedUsd: true },
  });
  if (!row) return null;
  return {
    modelCallsUsed: row.modelCallsUsed,
    costUsedUsd: Number(row.costUsedUsd),
  };
}

// ───────────────────── Từ vựng lý do dừng — `AD-11` ─────────────────────

/// Cột `scan_log.stop_reason` là `String` trần trong lược đồ; TỪ VỰNG thì đóng,
/// và nó đóng **ở đây**. Không có mảng này thì mỗi bên gọi tự đặt một chuỗi, và
/// dòng *"vòng dừng vì lý do gì"* của `FR-39` trở thành văn xuôi không đếm được
/// — đúng thứ `AD-11` mở đầu bằng *"điều kiện dừng đều tường minh, không ngầm"*.
///
/// Giá trị tiếng Việt KHÔNG DẤU theo Mục 0; chỉ tên là tiếng Anh.
///
/// Năm mã đầu là **năm điều kiện dừng** của `AD-11`, đúng thứ tự bảng của nó.
/// Hai mã cuối KHÔNG phải điều kiện dừng của một vòng đang chạy — chúng là hai
/// kết cục của `FR-38`/`D19` ở *ranh giới mở vòng*, và tách ra vì gộp chúng vào
/// `loi_khong_phuc_hoi` làm mất phân biệt giữa *"vòng trước còn sống, bỏ vòng
/// này"* và *"vòng trước đã chết, thu hồi rồi chạy tiếp"*.
export const SCAN_STOP_REASONS = [
  "hoan_tat",                    // ĐK 1 — hết Công ty trong tập đã chốt
  "phanh_ai_tat",                // ĐK 2 — phanh `FR-45`, kiểm ở ranh giới Công ty
  "cham_tran_luot_goi",          // ĐK 3 — `NFR-2`, lưu `resume_cursor`
  "cham_tran_ngan_sach",         // ĐK 4 — `NFR-3`, tự tắt AI một chiều
  "loi_khong_phuc_hoi",          // ĐK 5 — kết thúc vòng, KHÔNG dồn hàng đợi
  "bo_vi_vong_truoc_chua_xong",  // `FR-38` — vòng bị bỏ, vẫn ghi một dòng
  "vong_chet_het_han_thue",      // `AD-12` — vòng trước quá hạn thuê, bị thu hồi
] as const;

export type ScanStopReason = (typeof SCAN_STOP_REASONS)[number];

/// `FR-39`: *"vòng bị cắt giữa chừng ghi là **vòng không trọn**"*, và nó KHÔNG
/// đếm vào chuỗi 10 vòng. Vị từ này là chỗ duy nhất định nghĩa *"trọn"*, để
/// không ai đi liệt kê lại danh sách ở màn hình Quản trị rồi liệt thiếu một mã.
export function isPartialCycle(reason: ScanStopReason): boolean {
  return reason !== "hoan_tat";
}

// ─────────────────── Vòng đời một lượt quét — `AD-11` ───────────────────

export type OpenScanLogInput = {
  /// Trần TUYỆT ĐỐI của MỘT vòng (`scan_budget_usd`), không phải `maxBudgetUsd`
  /// của một lời gọi. Chốt vào hàng lúc mở để tử số và mẫu số của
  /// `budgetUsedRatio` cùng thuộc một vòng, kể cả khi Quản trị sửa tham số
  /// giữa vòng.
  budgetUsd: number;
  /// `AD-12` — hạn thuê. Vòng có `finished_at IS NULL` mà `started_at` cũ hơn
  /// `now() - lease` bị coi là **vòng chết** và thu hồi.
  leaseMinutes: number;
};

export type OpenScanLogResult =
  | { opened: true; scanLogId: string; startedAt: Date; reclaimed: number }
  | {
      opened: false;
      reason: "bo_vi_vong_truoc_chua_xong";
      /// Vòng còn sống đang chặn — để dòng nhật ký nói được *chặn bởi ai*.
      blockedByScanLogId: string;
      /// `FR-38`: *"vòng bị bỏ VẪN ghi một dòng nhật ký kèm lý do"*. Đây là id
      /// của chính dòng đó — nó đã mở-và-đóng ngay, nên không chồng vòng.
      skippedScanLogId: string;
      reclaimed: number;
    };

/// `AD-11` · `AD-12` · `D19` — mở một vòng quét, hoặc từ chối mở.
///
/// Ba việc, theo đúng thứ tự, TRONG MỘT GIAO DỊCH:
///
///   ① **Thu hồi vòng chết.** `finished_at IS NULL AND started_at < now() -
///      lease`. Không có bước này thì một tiến trình bị `docker compose down`
///      giữa vòng để lại một hàng `finished_at NULL` **vĩnh viễn**, và mọi vòng
///      sau bị bỏ với lý do sai — khoá cứng vòng quét cả buổi demo. Đây là cùng
///      một lập luận `AD-12` dùng để chọn *hàng có lease* thay cho
///      `pg_advisory_lock`, chỉ áp cho hàng `ScanLog` thay vì hàng khoá.
///   ② **Không chồng vòng.** Còn hàng nào `finished_at IS NULL` thì bỏ vòng
///      mới, và ghi MỘT dòng nhật ký mở-đóng-ngay mang `stop_reason =
///      'bo_vi_vong_truoc_chua_xong'` (`FR-38`).
///   ③ Mở hàng mới.
///
/// ⚠ Giao dịch ở mức cô lập mặc định (read committed) **không** loại hẳn cuộc
/// đua hai tiến trình cùng mở: cả hai có thể đọc *"không có vòng nào"* rồi cùng
/// chèn. Lớp chặn thật của `AD-12` là cờ singleton mức module ở
/// `instrumentation.ts` cộng khoá theo Công ty; hàm này là lớp thứ hai, và nó
/// đóng đúng ca *"tiến trình chết để lại vòng treo"* mà hai lớp kia không thấy.
///
/// ⚠ `ctx` KHÔNG phải trang trí: `AD-CR-7` bước ⑥ đặt pha 2 của ghi vết **bên
/// trong giao dịch của lõi**, và lõi là bên duy nhất ở trong giao dịch đó. Bỏ
/// nó thì mọi lời gọi mở vòng đọng lại `outcome = NULL`, không phân biệt được
/// với *tiến trình chết giữa hai pha*.
export async function openScanLog(
  input: OpenScanLogInput,
  ctx: CoreContext,
): Promise<OpenScanLogResult> {
  return tx(async (t) => {
    const now = new Date();
    const leaseFloor = new Date(now.getTime() - input.leaseMinutes * 60_000);

    // ① thu hồi vòng chết
    const reclaimed = await t.scanLog.updateMany({
      where: { finishedAt: null, deletedAt: null, startedAt: { lt: leaseFloor } },
      data: { finishedAt: now, stopReason: "vong_chet_het_han_thue" },
    });

    // ② vòng trước còn sống?
    const running = await t.scanLog.findFirst({
      where: { finishedAt: null },
      orderBy: { startedAt: "desc" },
      select: { id: true },
    });

    if (running) {
      const skipped = await t.scanLog.create({
        data: {
          startedAt: now,
          finishedAt: now,
          budgetUsd: String(input.budgetUsd),
          stopReason: "bo_vi_vong_truoc_chua_xong",
        },
        select: { id: true },
      });
      // Bỏ vòng là một kết cục HỢP LỆ, không phải lỗi — `no_op` chứ không
      // `business_rule_error`: không luật nghiệp vụ nào bị vi phạm, chỉ là
      // chưa tới lượt.
      await ctx.audit.complete(t, ctx.auditId, "no_op", {
        after: { skippedScanLogId: skipped.id, blockedBy: running.id },
      });
      return {
        opened: false as const,
        reason: "bo_vi_vong_truoc_chua_xong" as const,
        blockedByScanLogId: running.id,
        skippedScanLogId: skipped.id,
        reclaimed: reclaimed.count,
      };
    }

    // ③ mở hàng mới
    const row = await t.scanLog.create({
      data: { startedAt: now, budgetUsd: String(input.budgetUsd) },
      select: { id: true, startedAt: true },
    });
    await ctx.audit.complete(t, ctx.auditId, "ok", {
      after: { scanLogId: row.id, reclaimed: reclaimed.count },
    });
    return {
      opened: true as const,
      scanLogId: row.id,
      startedAt: row.startedAt,
      reclaimed: reclaimed.count,
    };
  });
}

export type AddScanUsageInput = {
  scanLogId: string;
  /// `NFR-2` đếm **lệnh gọi mô hình**, không đếm `num_turns` (`AD-AG-10`).
  modelCalls: number;
  /// `AD-11`: `null` thì **KHÔNG cộng 0** — bên gọi ghi một dòng `FT10` thay vì
  /// để bộ đếm ngân sách nói dối rằng lượt đó miễn phí.
  costUsd: number | null;
};

/// `AD-11` — cộng dồn NGAY SAU mỗi `query()`, cùng lời gọi đã tăng số lượt.
/// Hạt Công ty làm bước ⑥ của Cổng thành trang trí: trần 20 lượt sẽ chỉ được
/// kiểm mỗi 15 lần thay vì mỗi lần.
export async function addScanUsage(
  input: AddScanUsageInput,
  ctx: CoreContext,
): Promise<void> {
  await tx(async (t) => {
    await t.scanLog.update({
      where: { id: input.scanLogId },
      data: {
        modelCallsUsed: { increment: input.modelCalls },
        ...(input.costUsd === null
          ? {}
          : { costUsedUsd: { increment: input.costUsd.toFixed(4) } }),
      },
    });
    await ctx.audit.complete(t, ctx.auditId, "ok", { after: input });
  });
}

export type RecordScanEntryInput = {
  scanLogId: string;
  accountId: string;
  costUsd: number;
  signalCount: number;
  /// `FT1`–`FT10` của spine, KHÁC `F1`–`F40` của Mục 0. `null` là lượt sạch.
  failureCode: string | null;
};

/// `AD-11` — một dòng mỗi Công ty mỗi vòng, và là NGUỒN của
/// `estimated_cost_per_account`. Ghi cho **mọi** Công ty đã chạm, kể cả Công ty
/// hỏng: `AD-AG-9` nói rõ lượt hỏng vẫn tiêu tiền, nên bỏ dòng của nó là làm
/// mẫu số chi phí nhỏ hơn sự thật.
export async function recordScanEntry(
  input: RecordScanEntryInput,
  ctx: CoreContext,
): Promise<string> {
  return tx(async (t) => {
    const row = await t.scanLogEntry.create({
      data: {
        scanLogId: input.scanLogId,
        accountId: input.accountId,
        costUsd: input.costUsd.toFixed(4),
        signalCount: input.signalCount,
        failureCode: input.failureCode,
      },
      select: { id: true },
    });
    await ctx.audit.complete(t, ctx.auditId, "ok", { after: input });
    return row.id;
  });
}

export type CloseScanLogInput = {
  scanLogId: string;
  stopReason: ScanStopReason;
  /// `AD-11` điều kiện dừng 3 — Công ty còn dở, vòng sau resume từ đó.
  resumeCursor?: string | null;
  /// Cỡ tập Công ty đã CHỐT lúc mở vòng (`AD-12`). Nó là mẫu số của câu
  /// *"đã xử lý 9/15"* mà `FR-39` đòi ở vòng không trọn, và không suy lại được
  /// sau khi vòng đóng vì danh sách Đang theo dõi có thể đã đổi.
  accountsPlanned: number;
};

/// SÁU trường của `FR-39`, cộng trạng thái *vòng không trọn*.
///
/// Bốn trong sáu suy được từ chính cơ sở dữ liệu, nên chúng KHÔNG phải tham số:
/// tham số hoá là mời bên gọi truyền một con số khác với thứ đã lưu, rồi dòng
/// nhật ký và bảng dữ liệu kể hai câu chuyện.
export type ScanCycleSummary = {
  scanLogId: string;
  /// ① chạy lúc nào
  startedAt: Date;
  finishedAt: Date;
  /// ⑤ mất bao lâu
  durationMs: number;
  /// ② quét bao nhiêu Công ty (đếm `ScanLogEntry`), trên tổng đã chốt
  accountsScanned: number;
  accountsPlanned: number;
  /// ③ phát hiện bao nhiêu nội dung mới — đếm Bản lưu sinh ra trong cửa sổ vòng.
  ///
  /// ⚠ Đo bằng CỬA SỔ THỜI GIAN, không bằng khoá ngoại: `snapshot` không có cột
  /// `scan_log_id`. Hệ quả đã biết: một lần đổi phiên bản Bản chụp do NGƯỜI bấm
  /// đúng lúc vòng đang chạy sẽ được cộng vào đây. Chấp nhận có chủ đích — cột
  /// mới phải sửa `prisma/schema.prisma`, ngoài phạm vi lượt này.
  newSnapshots: number;
  /// ④ thêm bao nhiêu mục vào Dòng thời gian — chỉ mục `added_by = he_thong`
  newTimelineEntries: number;
  /// ⑥ có lỗi gì — tập mã `FT` đã gặp, đã khử trùng
  failureCodes: string[];
  signalCount: number;
  modelCallsUsed: number;
  costUsedUsd: number;
  stopReason: ScanStopReason;
  /// `FR-39` — vòng bị cắt giữa chừng. KHÔNG đếm vào chuỗi 10 vòng.
  partial: boolean;
};

/// `AD-11` · `FR-39` — đóng vòng và trả về đủ sáu trường của dòng nhật ký.
///
/// Đóng là thao tác **luỹ đẳng theo hàng**: gọi hai lần thì lần sau không đổi
/// `finished_at`. Không có luật đó thì một lần đóng lặp ở đường xử lý tín hiệu
/// dừng kéo dài thời lượng vòng một cách tuỳ tiện, và `FR-39` trường ⑤ sai.
export async function closeScanLog(
  input: CloseScanLogInput,
  ctx: CoreContext,
): Promise<ScanCycleSummary> {
  const now = new Date();

  // Chỉ đóng khi còn mở — vế `finishedAt: null` là thứ làm hàm này luỹ đẳng.
  await tx(async (t) => {
    await t.scanLog.updateMany({
      where: { id: input.scanLogId, finishedAt: null, deletedAt: null },
      data: {
        finishedAt: now,
        stopReason: input.stopReason,
        resumeCursor: input.resumeCursor ?? null,
      },
    });
    await ctx.audit.complete(t, ctx.auditId, "ok", { after: input });
  });

  const row = await db.scanLog.findUniqueOrThrow({
    where: { id: input.scanLogId },
    select: {
      startedAt: true, finishedAt: true,
      modelCallsUsed: true, costUsedUsd: true, stopReason: true,
    },
  });
  const finishedAt = row.finishedAt ?? now;

  const entries = await db.scanLogEntry.findMany({
    where: { scanLogId: input.scanLogId },
    select: { accountId: true, signalCount: true, failureCode: true },
  });

  const window = { gte: row.startedAt, lte: finishedAt };
  const [newSnapshots, newTimelineEntries] = await Promise.all([
    db.snapshot.count({ where: { createdAt: window } }),
    db.timelineEntry.count({ where: { createdAt: window, addedBy: "he_thong" } }),
  ]);

  return {
    scanLogId: input.scanLogId,
    startedAt: row.startedAt,
    finishedAt,
    durationMs: finishedAt.getTime() - row.startedAt.getTime(),
    accountsScanned: entries.length,
    accountsPlanned: input.accountsPlanned,
    newSnapshots,
    newTimelineEntries,
    failureCodes: [...new Set(entries.map((e) => e.failureCode).filter((c): c is string => !!c))],
    signalCount: entries.reduce((s, e) => s + e.signalCount, 0),
    modelCallsUsed: row.modelCallsUsed,
    costUsedUsd: Number(row.costUsedUsd),
    stopReason: input.stopReason,
    partial: isPartialCycle(input.stopReason),
  };
}

/// `FR-39` — dòng tổng hợp cộng dồn mỗi 10 vòng. Chỉ đếm vòng **trọn**
/// (`stop_reason = 'hoan_tat'`): §3.1 định nghĩa Vòng quét là *khép kín trên
/// toàn bộ* Công ty Đang theo dõi, nên một vòng bị cắt không phải một phần tử
/// của chuỗi mười.
export type ScanRollup = {
  cycles: number;
  totalAccounts: number;
  totalSignals: number;
  totalCostUsd: number;
  totalModelCalls: number;
  /// `true` khi số vòng trọn vừa chạm bội số của `every` — bên gọi in thêm dòng.
  due: boolean;
};

export async function readScanRollup(every = 10): Promise<ScanRollup> {
  const completed = await db.scanLog.findMany({
    where: { finishedAt: { not: null }, stopReason: "hoan_tat" },
    orderBy: { startedAt: "desc" },
    take: every,
    select: { id: true, modelCallsUsed: true, costUsedUsd: true },
  });
  const total = await db.scanLog.count({
    where: { finishedAt: { not: null }, stopReason: "hoan_tat" },
  });
  const entries = await db.scanLogEntry.findMany({
    where: { scanLogId: { in: completed.map((c) => c.id) } },
    select: { signalCount: true },
  });
  return {
    cycles: completed.length,
    totalAccounts: entries.length,
    totalSignals: entries.reduce((s, e) => s + e.signalCount, 0),
    totalCostUsd: completed.reduce((s, c) => s + Number(c.costUsedUsd), 0),
    totalModelCalls: completed.reduce((s, c) => s + c.modelCallsUsed, 0),
    due: total > 0 && total % every === 0,
  };
}

// ───────────── Khoá theo Công ty — `AD-12` (xem cảnh báo đầu tệp) ─────────────

export type AcquireAccountLockInput = {
  accountId: string;
  /// Định danh tiến trình. `AD-12`: lúc khởi động, tiến trình dọn khoá mang
  /// `process_id` **cũ của chính nó** — nên giá trị này phải ổn định qua một
  /// lần khởi động lại, không phải `process.pid`.
  processId: string;
  leaseMinutes: number;
};

export type AcquireAccountLockResult =
  | { acquired: true; expiresAt: Date; renewed: boolean }
  | { acquired: false; heldBy: string; expiresAt: Date };

/// `AD-12` — lấy khoá, HOẶC gia hạn khoá của chính mình.
///
/// ⚠ MỘT capability, không hai. `AD-2` nói thẳng: *"gia hạn khoá KHÔNG phải
/// capability thứ ba — nó là `acquireAccountLock` gọi lại với cùng `process_id`.
/// Thêm `renewAccountLock` làm `T-10` đỏ."* Vì thế nhánh gia hạn nằm **trong**
/// hàm này, phân biệt bằng cờ `renewed` ở giá trị trả về chứ không bằng tên.
///
/// Hết hạn = **coi như không có khoá**, không cần xoá hàng (hợp `AD-14`).
export async function acquireAccountLock(
  input: AcquireAccountLockInput,
  ctx: CoreContext,
): Promise<AcquireAccountLockResult> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + input.leaseMinutes * 60_000);

  const result = await tx(async (t): Promise<AcquireAccountLockResult> => {
    // Một câu `updateMany` có vế bảo vệ — nguyên tử ở read committed, khác hẳn
    // đọc-rồi-ghi hai câu: hai tiến trình cùng đọc *"khoá đã hết hạn"* rồi cùng
    // ghi sẽ đều tin là mình cầm khoá.
    const taken = await t.accountLock.updateMany({
      where: {
        accountId: input.accountId,
        deletedAt: null,
        OR: [{ processId: input.processId }, { expiresAt: { lte: now } }],
      },
      data: { processId: input.processId, expiresAt },
    });
    if (taken.count > 0) {
      return { acquired: true, expiresAt, renewed: true };
    }

    const existing = await t.accountLock.findUnique({
      where: { accountId: input.accountId },
      select: { processId: true, expiresAt: true },
    });
    if (existing) {
      return { acquired: false, heldBy: existing.processId, expiresAt: existing.expiresAt };
    }

    await t.accountLock.create({
      data: { accountId: input.accountId, processId: input.processId, expiresAt },
    });
    return { acquired: true, expiresAt, renewed: false };
  }).catch(async (): Promise<AcquireAccountLockResult> => {
    // Cuộc đua chèn: tiến trình kia thắng khoá chính. Không đoán chủ mới —
    // đọc lại; đọc lại hỏng nữa thì trả *"không lấy được"*, không ném, vì mất
    // khoá là chuyện bình thường của vòng quét, không phải sự cố hạ tầng.
    const winner = await db.accountLock.findUnique({
      where: { accountId: input.accountId },
      select: { processId: true, expiresAt: true },
    });
    return {
      acquired: false,
      heldBy: winner?.processId ?? "khong_ro",
      expiresAt: winner?.expiresAt ?? now,
    };
  });

  // ⚠ Pha 2 chạy NGOÀI giao dịch ở đây, khác `AD-CR-7` mặt chữ, và có lý do:
  // nhánh cuộn-lại ở trên bắt lỗi rồi trả về một kết cục HỢP LỆ (*không lấy
  // được khoá*), nên `complete()` trong giao dịch sẽ cuộn theo và dòng ghi vết
  // đọng `outcome = NULL` — đúng ca `completeDetached` sinh ra để phục vụ.
  await ctx.audit.completeDetached(
    ctx.auditId,
    result.acquired ? "ok" : "no_op",
    { after: result },
  );
  return result;
}

/// `AD-12` — nhả khoá bằng cách cho nó HẾT HẠN, không bằng xoá.
///
/// Xoá mềm thì hàng vẫn giữ chỗ khoá chính `account_id`, nên lần lấy khoá sau
/// ăn `unique violation` — đúng cái bẫy mà `next_action` và `suggestion` đã
/// nêu tên. Cho hết hạn thì `acquireAccountLock` ở trên nhận nó qua vế
/// `expiresAt <= now` và ghi đè bình thường.
///
/// Vế `processId` là bắt buộc: một tiến trình không được nhả khoá của tiến
/// trình khác, kể cả khi nó tin là mình đang dọn dẹp.
/// `accountId` BỎ TRỐNG nghĩa là *"mọi khoá của tiến trình này"* — đó là bước
/// ② của `src/scan/bootstrap.ts` (`AD-12`: lúc khởi động, tiến trình dọn khoá
/// mang `process_id` cũ **của chính nó**). Một capability, hai phạm vi, vì
/// `AD-2` khối ba liệt đúng `releaseAccountLock` và thêm tên thứ ba vào đó là
/// nới một tập mà `T-10` khẳng định bằng vị từ.
///
/// Chỉ khoá của chính nó, không phải mọi khoá quá hạn: một tiến trình thứ hai
/// đang chạy hợp lệ vẫn phải giữ được khoá của nó qua lần khởi động lại của
/// tiến trình này. Khoá của người khác tự hết hạn theo lease.
export async function releaseAccountLock(
  input: { accountId?: string | null; processId: string },
  ctx: CoreContext,
): Promise<number> {
  const now = new Date();
  return tx(async (t) => {
    const count = await t.accountLock.updateMany({
      where: {
        ...(input.accountId ? { accountId: input.accountId } : {}),
        processId: input.processId,
        deletedAt: null,
        expiresAt: { gt: now },
      },
      data: { expiresAt: now },
    });
    await ctx.audit.complete(t, ctx.auditId, count.count > 0 ? "ok" : "no_op", {
      after: { released: count.count, scope: input.accountId ? "account" : "process" },
    });
    return count.count;
  });
}
