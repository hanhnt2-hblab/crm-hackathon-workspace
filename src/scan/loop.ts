// `AD-11` · `AD-12` · `FR-36` · `FR-38` · `FR-39` · `D19` — vòng quét khép kín.
//
// Một vòng: đọc lại nguồn → so với Bản lưu gần nhất → có nội dung mới thì rút
// Phát hiện → tự thêm MỘT mục Dòng thời gian CHO MỖI Phát hiện mới → quay lại
// đầu vòng. Vòng **không dừng chờ ai duyệt** ở bất kỳ bước nào (`§4/nhóm 5`).
//
// ⚠ TẦNG ①: không `db`, không `tx`, không `@prisma/client`. Mọi lần chạm dữ
// liệu đi qua `loadCapability()`.
//
// ⚠ PHANH VÀ MỤC TỰ-GIỚI-HẠN — đọc trước khi sửa gì trong tệp này.
// `decide()` của tầng ③ áp bước ⑥ (`limit`) và ⑦ (`brake`) cho **mọi** lời gọi
// của tác nhân `system`, và nó **KHÔNG đọc `entry.selfLimiting`**. Hệ quả đo
// được, không phải suy đoán: khi `ai_enabled = false` hoặc trần đã chạm thì
// `readSetting`, `writeScanLog(close)` và `releaseAccountLock` đều bị từ chối
// mã `brake`/`limit` — tức vòng quét mất cả đường đọc phanh lẫn đường tự dọn.
// `AD-4` nói mục tự-giới-hạn phải chạy được trong đúng hai ca đó, và spine gọi
// tên hậu quả: *"khoá không nhả … mười phút không có gì xảy ra"*.
//
// Tệp này KHÔNG vá lỗi đó — `src/autonomy/gate.ts` là chỗ sửa, một dòng: bỏ qua
// bước ⑥/⑦ khi `entry.selfLimiting`. Nó CHỊU ĐỰNG lỗi đó: mọi lời gọi đi qua
// `callCap` vốn không ném, từ chối được đọc thành trạng thái, và dòng nhật ký
// vẫn ra được qua sink. Khi Cổng sửa xong, tệp này không phải đổi một dòng nào
// — chỉ có thêm dòng nhật ký vào bảng `scan_log` thay vì chỉ ra stdout.

import type { Actor } from "@/core/actor";
import type { Registry } from "@/capability/registry";
import type { ExtractionResult, SignalDraft } from "@/agent/types";
import {
  LOCK_LEASE_MINUTES,
  SCAN_LEASE_MINUTES,
  callCap,
  parseAccountList,
  parseCycleSummary,
  parseLatestArticle,
  parseLockResult,
  parseOpenScanLog,
  parseSettingValue,
  type AccountRef,
  type CapOutcome,
} from "./_contract";
import {
  renderBrakeLine,
  renderCycleLine,
  renderSkippedLine,
  type JournalSink,
} from "./journal";

/// `AD-AG-1` — tầng ② nhận phụ thuộc qua tham số. Vòng quét cũng vậy: nó nhận
/// hàm rút Phát hiện thay vì tự dựng `AgentDeps`.
///
/// Vì sao TIÊM chứ không nhập thẳng `extractSignals`: `AgentDeps` đòi
/// `modelId`, `maxTurns`, `maxBudgetUsd` và một `crmMcpServer`, mà `AD-15` chỉ
/// cho **ba tệp** đọc `process.env` — `src/scan/loop.ts` không nằm trong ba tệp
/// đó. Dựng `AgentDeps` ở đây là phải bịa ba con số hoặc phá `AD-15`. Tiêm thì
/// composition root (`bootstrap.ts`) chịu, đúng chỗ `AD-1` đặt nó.
export type ExtractFn = (input: {
  accountId: string;
  articleText: string;
}) => Promise<ExtractionResult>;

export type ScanLoopDeps = {
  registry: Registry;
  /// `AD-12` — ổn định qua một lần khởi động lại, KHÔNG phải `process.pid`.
  processId: string;
  extract: ExtractFn;
  journal: JournalSink;
  now?: () => Date;
};

export type ScanCycleOutcome =
  | { ran: false; reason: "phanh_ai_tat" | "bo_vi_vong_truoc_chua_xong" | "khong_mo_duoc" }
  | {
      ran: true;
      scanLogId: string;
      stopReason: string;
      accountsScanned: number;
      accountsPlanned: number;
      lockedOut: number;
      partial: boolean;
    };

/// `AD-11` — năm điều kiện dừng, ánh xạ từ ba nhánh kết thúc của SDK.
///
/// ⚠ `turns` KHÔNG có mã `FT` trong bảng của spine — đó là chỗ tệp này ĐOÁN, và
/// nó đoán `FT7` (*capability không đủ*) vì cạn lượt nghĩa là mô hình chưa gọi
/// đủ công cụ để hoàn tất. Nếu bảng `FT` được chốt khác thì sửa đúng dòng này.
const FAILURE_BY_KIND: Record<string, string> = {
  schema: "FT5",      // `AD-11`: lược đồ thử lại hết lượt → `FT5`
  transport: "FT10",  // hạ tầng
  execution: "FT10",  // `error_during_execution` — kết thúc vòng, xem dưới
  budget: "FT10",     // `AD-11`: Bản lưu quá đắt → `FT10`, vòng đi tiếp
  turns: "FT7",       // ⚠ ĐOÁN — spine không gán mã cho nhánh này
};

export async function runScanCycle(deps: ScanLoopDeps): Promise<ScanCycleOutcome> {
  const now = deps.now ?? (() => new Date());
  const actor: Actor = { kind: "system" };
  const call = (name: string, params: unknown): Promise<CapOutcome> =>
    callCap(deps.registry, actor, name, params);

  // ── Bước 1: phanh, đọc TRƯỚC khi mở vòng ────────────────────────────────
  //
  // `D38` — đọc mỗi lần dùng, không nhớ đệm. Một lượt đọc bị từ chối mã `brake`
  // TỰ NÓ là câu trả lời: chỉ bước ⑦ mới phát mã đó, và nó chỉ phát khi
  // `ai_enabled = false`. Không suy diễn gì thêm.
  const aiSetting = await call("readSetting", { key: "ai_enabled" });
  if (aiSetting.status === "denied" && aiSetting.reason === "brake") {
    deps.journal(renderBrakeLine(now().toISOString()));
    return { ran: false, reason: "phanh_ai_tat" };
  }
  if (aiSetting.status === "ok" && parseSettingValue(aiSetting.value) !== "true") {
    deps.journal(renderBrakeLine(now().toISOString()));
    return { ran: false, reason: "phanh_ai_tat" };
  }

  const budgetUsd = await readNumberSetting(call, "scan_budget_usd", 3);
  const callLimit = await readNumberSetting(call, "model_calls_per_scan", 20);
  const maxDenials = await readNumberSetting(call, "max_consecutive_denials", 3);

  // ── Bước 2: mở vòng — `D19` không chồng vòng, cộng hạn thuê ──────────────
  const opened = await call("writeScanLog", {
    op: "open",
    budgetUsd,
    leaseMinutes: SCAN_LEASE_MINUTES,
  });
  if (opened.status !== "ok") {
    deps.journal(
      `[vòng quét] ${now().toISOString()} · KHÔNG MỞ ĐƯỢC VÒNG — `
      + (opened.status === "denied"
        ? `Cổng từ chối \`writeScanLog\`: ${opened.reason}`
        : `lỗi: ${describe(opened.error)}`),
    );
    return { ran: false, reason: "khong_mo_duoc" };
  }
  const open = parseOpenScanLog(opened.value);
  if (!open.opened) {
    // `FR-38`: dòng nhật ký của vòng bị bỏ đã được LÕI ghi (`skippedScanLogId`).
    // Ở đây chỉ dội nó ra sink để người đứng xem thấy ngay.
    deps.journal(renderSkippedLine(now().toISOString(), open.blockedByScanLogId));
    return { ran: false, reason: "bo_vi_vong_truoc_chua_xong" };
  }
  const scanLogId = open.scanLogId;

  // ── Bước 3: CHỐT tập Công ty (`AD-12`) ──────────────────────────────────
  //
  // Đọc MỘT LẦN. Bật Đang theo dõi giữa vòng thì Công ty đó vào vòng **sau**;
  // đọc sống danh sách giữa vòng khiến hai lần chạy trên cùng dữ liệu cho hai
  // kết quả, và `T-8` hết lặp lại được.
  const listed = await call("readAccountList", { watching: true });
  if (listed.status !== "ok") {
    return finish(deps, call, {
      scanLogId, startedAt: open.startedAt, accountsPlanned: 0,
      stopReason: "loi_khong_phuc_hoi", resumeCursor: null, lockedOut: 0,
    });
  }
  const accounts = parseAccountList(listed.value);

  // ── Bước 4: chạy từng Công ty ───────────────────────────────────────────
  const state = {
    modelCalls: 0,
    costUsd: 0,
    /// `AD-11` — chi phí một Công ty ước theo GIÁ TRỊ LỚN NHẤT đã quan sát,
    /// KHÔNG theo trung bình: đã đo ba lượt $0,075 và một lượt $0,727.
    ///
    /// ⚠ Ở đây là *lớn nhất trong CHÍNH vòng này*, không phải lớn nhất của vòng
    /// trước (`estimated_cost_per_account` của `AD-UI-14`). Hệ quả đã biết và
    /// chấp nhận: **Công ty đầu tiên của vòng đi vô điều kiện**. Đường đúng cần
    /// một capability đọc số đo đó, mà `AD-2` chưa liệt tên nào cho nó.
    maxAccountCost: 0,
    scanned: 0,
    lockedOut: 0,
    consecutiveDenials: 0,
    lastDeniedCap: "",
  };

  let stopReason = "hoan_tat";
  let resumeCursor: string | null = null;

  for (const account of accounts) {
    // ⓐ phanh, kiểm ở RANH GIỚI Công ty (`AD-11` điều kiện dừng 2) —
    //    *"cắt sạch, giữ nguyên dữ liệu đã sinh"*.
    const brake = await call("readSetting", { key: "ai_enabled" });
    const braked =
      (brake.status === "denied" && brake.reason === "brake")
      || (brake.status === "ok" && parseSettingValue(brake.value) !== "true");
    if (braked) {
      stopReason = "phanh_ai_tat";
      resumeCursor = account.id;
      break;
    }

    // ⓑ trần lượt gọi (điều kiện dừng 3) — lưu con trỏ, vòng sau resume
    if (state.modelCalls >= callLimit) {
      stopReason = "cham_tran_luot_goi";
      resumeCursor = account.id;
      break;
    }

    // ⓒ trần ngân sách (điều kiện dừng 4) — tự tắt AI, MỘT CHIỀU
    if (state.costUsd >= budgetUsd) {
      stopReason = "cham_tran_ngan_sach";
      resumeCursor = account.id;
      await call("disableAi", { reason: "cham_tran_ngan_sach", scanLogId });
      break;
    }

    // ⓓ đơn vị công việc là MỘT CÔNG TY TRỌN VẸN. Không đủ chỗ cho một Công ty
    //    nữa thì dừng SẠCH tại ranh giới, không cắt giữa chừng.
    if (state.maxAccountCost > 0 && state.costUsd + state.maxAccountCost > budgetUsd) {
      stopReason = "cham_tran_ngan_sach";
      resumeCursor = account.id;
      await call("disableAi", { reason: "cham_tran_ngan_sach", scanLogId });
      break;
    }

    const outcome = await scanOneAccount(deps, call, scanLogId, account, state);
    if (outcome === "khoa_ban") {
      state.lockedOut += 1;
      continue;
    }
    if (outcome === "loi_khong_phuc_hoi") {
      stopReason = "loi_khong_phuc_hoi";
      resumeCursor = account.id;
      break;
    }
    state.scanned += 1;

    // `AD-11` — `max_consecutive_denials` lần từ chối LIÊN TIẾP trên cùng một
    // capability thì kết thúc vòng. Con số này là tín hiệu chẩn đoán đáng giá
    // hơn con số 20: nó nói *"Cổng và vòng quét đang bất đồng"*, không nói
    // *"đã tiêu hết"*.
    if (state.consecutiveDenials >= maxDenials) {
      stopReason = "loi_khong_phuc_hoi";
      resumeCursor = account.id;
      break;
    }
  }

  return finish(deps, call, {
    scanLogId,
    startedAt: open.startedAt,
    accountsPlanned: accounts.length,
    stopReason,
    resumeCursor,
    lockedOut: state.lockedOut,
  });
}

type CallFn = (name: string, params: unknown) => Promise<CapOutcome>;

type CycleState = {
  modelCalls: number;
  costUsd: number;
  maxAccountCost: number;
  scanned: number;
  lockedOut: number;
  consecutiveDenials: number;
  lastDeniedCap: string;
};

/// Một Công ty, TRỌN VẸN — `AD-11`: không bao giờ cắt giữa chừng ở đây.
///
/// Khoá lấy ở đầu và nhả ở `finally`. `callCap` không ném, nhưng `finally` vẫn
/// bắt buộc: `parse*` **có** ném khi hợp đồng lệch, và một hợp đồng lệch không
/// được phép để lại khoá treo mười phút.
async function scanOneAccount(
  deps: ScanLoopDeps,
  call: CallFn,
  scanLogId: string,
  account: AccountRef,
  state: CycleState,
): Promise<"xong" | "khoa_ban" | "loi_khong_phuc_hoi"> {
  const lock = await call("acquireAccountLock", {
    accountId: account.id,
    processId: deps.processId,
    leaseMinutes: LOCK_LEASE_MINUTES,
  });
  if (lock.status !== "ok") {
    noteDenial(state, lock);
    return "khoa_ban";
  }
  if (!parseLockResult(lock.value).acquired) {
    // `D19` khoá theo Công ty: một vòng khác đang giữ. Không phải lỗi, không
    // ghi `ScanLogEntry` — Công ty này chưa được quét, và đếm nó là *đã quét*
    // làm mẫu số của `FR-39` nói dối.
    return "khoa_ban";
  }

  let signalCount = 0;
  let accountCost = 0;
  let failureCode: string | null = null;

  try {
    const read = await call("readArticle", { accountId: account.id, scope: "latest" });
    if (read.status !== "ok") {
      noteDenial(state, read);
      failureCode = read.status === "denied" ? "FT8" : "FT10";
      return "xong";
    }
    const article = parseLatestArticle(read.value);

    // Chưa có Bản lưu nào: Công ty chưa được nạp Bản chụp. Không phải lỗi.
    if (!article) return "xong";

    // `FR-50`/`FR-12` — nguồn không đọc được thì GHI LẠI là không đọc được.
    // Hệ thống không đoán, và không tiêu một lượt gọi mô hình nào cho nó.
    if (!article.readable) return "xong";

    // `FR-36` — chống trùng ở **tầng Phát hiện**: cùng một tin đọc lại ở vòng
    // sau không sinh mục thứ hai. Bản lưu đã có Phát hiện là Bản lưu đã xử lý.
    if (article.signalCount > 0) return "xong";

    // ── rút Phát hiện: MỘT Bản lưu = MỘT `query()` (`AD-AG-2`) ─────────────
    const result = await deps.extract({
      accountId: account.id,
      articleText: article.normalizedText,
    });

    // `AD-11` — cộng dồn NGAY SAU lời gọi, kể cả lượt hỏng: `AD-AG-9` nói rõ
    // lượt hỏng vẫn tiêu tiền. Bỏ qua nó là làm phanh không bao giờ chạm.
    state.modelCalls += result.modelCalls;
    if (result.costUsd !== null) {
      state.costUsd += result.costUsd;
      accountCost = result.costUsd;
      state.maxAccountCost = Math.max(state.maxAccountCost, result.costUsd);
    } else {
      // `AD-11`: `costUsd === null` thì **không cộng 0** — ghi `FT10`.
      failureCode = "FT10";
    }
    await call("writeScanLog", {
      op: "usage",
      scanLogId,
      modelCalls: result.modelCalls,
      costUsd: result.costUsd,
    });

    if (!result.ok) {
      failureCode = FAILURE_BY_KIND[result.kind] ?? "FT10";
      // `AD-11`: CHỈ `error_during_execution` mới kết thúc vòng. Hai nhánh còn
      // lại là lỗi của MỘT Bản lưu — để chúng kết thúc vòng thì một trang dị
      // dạng giết cả 15 Công ty, và `T-8` mất dữ liệu vì lý do không liên quan.
      if (result.kind === "execution") return "loi_khong_phuc_hoi";
      return "xong";
    }

    signalCount = await writeSignals(call, account.id, article.articleId, result.signals, state);
    return "xong";
  } finally {
    await call("recordAccountCost", {
      scanLogId,
      accountId: account.id,
      costUsd: accountCost,
      signalCount,
      failureCode,
    });
    await call("releaseAccountLock", {
      accountId: account.id,
      processId: deps.processId,
    });
  }
}

/// `FR-36` · `D36` — **mỗi Phát hiện mới sinh ĐÚNG MỘT mục** Dòng thời gian.
///
/// Một Bản lưu chứa hai tin thì sinh hai mục, không phải một; `T-8` đếm MỤC.
/// Gộp chúng thành một mục *"có 2 tin mới"* là làm phép đếm của `T-8` sai theo
/// hướng khó thấy nhất — nó vẫn có mục, chỉ thiếu một.
async function writeSignals(
  call: CallFn,
  accountId: string,
  articleId: string,
  signals: readonly SignalDraft[],
  state: CycleState,
): Promise<number> {
  let written = 0;
  for (const draft of signals) {
    const created = await call("createSignal", { accountId, articleId, ...draft });
    if (created.status !== "ok") {
      noteDenial(state, created);
      // `BR-D1`/`BR-D2` bác một Phát hiện (thiếu câu trích, câu trích không
      // khớp nguyên văn) là chuyện BÌNH THƯỜNG của lớp này — bỏ Phát hiện đó,
      // đi tiếp. Nó không được kéo theo những Phát hiện hợp lệ khác.
      continue;
    }
    const signalId = readId(created.value);
    const appended = await call("appendTimelineEntry", {
      accountId,
      content: draft.claim,
      occurredAt: draft.eventDate ?? new Date().toISOString(),
      sourceSignalId: signalId,
    });
    if (appended.status !== "ok") {
      noteDenial(state, appended);
      continue;
    }
    state.consecutiveDenials = 0;
    written += 1;
  }
  return written;
}

function readId(v: unknown): string | null {
  if (typeof v === "object" && v !== null && "id" in v) {
    const id = (v as { id: unknown }).id;
    if (typeof id === "string") return id;
  }
  return null;
}

/// `AD-11` — đếm từ chối LIÊN TIẾP **trên cùng một capability**. Đổi capability
/// là chuỗi bắt đầu lại: ba lần bị bác ở ba chỗ khác nhau là ba sự cố rời rạc,
/// còn ba lần liên tiếp ở cùng một chỗ là một vòng thử-lại đang quay.
function noteDenial(state: CycleState, outcome: CapOutcome): void {
  if (outcome.status === "ok") return;
  const cap = outcome.capability;
  state.consecutiveDenials = state.lastDeniedCap === cap ? state.consecutiveDenials + 1 : 1;
  state.lastDeniedCap = cap;
}

async function readNumberSetting(
  call: CallFn,
  key: string,
  fallback: number,
): Promise<number> {
  const r = await call("readSetting", { key });
  if (r.status !== "ok") return fallback;
  const n = Number(parseSettingValue(r.value));
  return Number.isFinite(n) ? n : fallback;
}

/// Đóng vòng và in dòng `FR-39`. Chạy trên MỌI đường ra, kể cả đường lỗi —
/// một vòng không đóng để lại `finished_at NULL`, và `D19` sẽ bỏ mọi vòng sau
/// cho tới khi hết hạn thuê.
async function finish(
  deps: ScanLoopDeps,
  call: CallFn,
  input: {
    scanLogId: string;
    startedAt: string;
    accountsPlanned: number;
    stopReason: string;
    resumeCursor: string | null;
    lockedOut: number;
  },
): Promise<ScanCycleOutcome> {
  const closed = await call("writeScanLog", {
    op: "close",
    scanLogId: input.scanLogId,
    stopReason: input.stopReason,
    resumeCursor: input.resumeCursor,
    accountsPlanned: input.accountsPlanned,
  });

  if (closed.status !== "ok") {
    deps.journal(
      `[vòng quét] ${input.startedAt} · KHÔNG ĐÓNG ĐƯỢC VÒNG \`${input.scanLogId}\` — `
      + (closed.status === "denied"
        ? `Cổng từ chối \`writeScanLog\`: ${closed.reason} `
          + "(xem ghi chú *phanh và mục tự-giới-hạn* đầu tệp)"
        : describe(closed.error)),
    );
    return {
      ran: true,
      scanLogId: input.scanLogId,
      stopReason: input.stopReason,
      accountsScanned: 0,
      accountsPlanned: input.accountsPlanned,
      lockedOut: input.lockedOut,
      partial: true,
    };
  }

  const summary = parseCycleSummary(closed.value);
  deps.journal(renderCycleLine(summary, input.startedAt));
  return {
    ran: true,
    scanLogId: summary.scanLogId,
    stopReason: summary.stopReason,
    accountsScanned: summary.accountsScanned,
    accountsPlanned: summary.accountsPlanned,
    lockedOut: input.lockedOut,
    partial: summary.partial,
  };
}

function describe(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}
