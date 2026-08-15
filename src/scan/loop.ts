// `AD-11` · `AD-12` · `FR-36` · `FR-38` · `FR-39` · `D19` — vòng quét khép kín.
//
// Một vòng: đọc lại nguồn → so với Bản lưu gần nhất → có nội dung mới thì rút
// Phát hiện → tự thêm MỘT mục Dòng thời gian CHO MỖI Phát hiện mới (`§4/nhóm 3`)
// → thử TỰ ĐẶT VIỆC TIẾP THEO từ chính Phát hiện đó (`§4/nhóm 4`, `T-6`) → quay
// lại đầu vòng. Vòng **không dừng chờ ai duyệt** ở bất kỳ bước nào (`§4/nhóm 5`).
//
// Nhóm 4 nối ở `writeSignals`, ngay sau `createSignal`; toàn bộ lý do chọn chỗ
// đó — và lý do phần QUYẾT ĐỊNH (`BR-D5`, `BR-D7`, `BR-D8`, ba nhánh `AD-3`)
// nằm ở lõi chứ không ở đây — viết trong `src/scan/next-action.ts`.
//
// ⚠ TẦNG ①: không `db`, không `tx`, không `@prisma/client`. Mọi lần chạm dữ
// liệu đi qua `loadCapability()`.
//
// ⚠ PHANH VÀ MỤC TỰ-GIỚI-HẠN — đọc trước khi sửa gì trong tệp này.
// `decide()` của tầng ③ NAY ĐÃ đọc `entry.selfLimiting` (`src/autonomy/gate.ts`,
// vế `actor.kind === "system" && !entry.selfLimiting`), nên `writeScanLog`,
// `recordAccountCost` và `releaseAccountLock` vẫn chạy được khi phanh tắt hoặc
// trần đã chạm — đúng thứ `AD-4` đòi. Khối cảnh báo bản trước nói ngược lại;
// nó viết cho trạng thái mã CŨ và đã được xác minh là lỗi thời ngày 14/08.
//
// Hai hệ quả còn nguyên giá trị và ĐỪNG gỡ:
//   · `readSetting` KHÔNG mang `selfLimiting`, nên khi `ai_enabled = false` thì
//     chính lượt đọc phanh bị bác mã `brake`. Bước 1 đọc `denied + brake` như
//     một CÂU TRẢ LỜI, không như một sự cố — đó là đường `T-9` đi qua.
//   · `acquireAccountLock` và `readAccountList` cũng KHÔNG mang `selfLimiting`, nên
//     chúng bị bác cùng lúc. Ca nguy hiểm nhất là `acquireAccountLock`: nó biến
//     thành `khoa_ban` — một kết cục BÌNH THƯỜNG — nên một vòng bị trần chặn
//     trông hệt một vòng đang bị tiến trình khác giữ khóa.
//   · Mọi lời gọi đi qua `callCap` vốn không ném; từ chối là một giá trị. Đừng
//     đổi nó thành một lần ném để "cho gọn".

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
  type CallFn,
  type CapOutcome,
} from "./_contract";
import {
  renderBrakeLine,
  renderCycleLine,
  renderSkippedLine,
  type JournalSink,
} from "./journal";
import { autoSetNextAction } from "./next-action";

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

  const budgetUsd = await readNumberSetting(deps, call, "scan_budget_usd", 3);
  const callLimit = await readNumberSetting(deps, call, "model_calls_per_scan", 20);
  const maxDenials = await readNumberSetting(deps, call, "max_consecutive_denials", 3);

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
    // ⚠ PHẢI NÓI RA LÝ DO. Bản trước lặng lẽ đi thẳng vào `finish`, và dòng
    // `FR-39` khi đó đọc là *"quét 0/0 Công ty"* — trông y hệt *"không Công ty
    // nào Đang theo dõi"*, tức một trạng thái BÌNH THƯỜNG. Đã mất một lượt
    // chẩn đoán vì đúng chỗ này: nguyên nhân thật là `searchCompanies` của lõi
    // ném `chưa hiện thực`, và không một dòng nhật ký nào nhắc tới nó.
    deps.journal(
      `[vòng quét] ${now().toISOString()} · KHÔNG ĐỌC ĐƯỢC DANH SÁCH CÔNG TY — `
      + (listed.status === "denied"
        ? `Cổng từ chối \`readAccountList\`: ${listed.reason}`
        : `lỗi: ${describe(listed.error)}`),
    );
    return finish(deps, call, {
      scanLogId, startedAt: open.startedAt, accountsPlanned: 0,
      stopReason: "loi_khong_phuc_hoi", resumeCursor: null, lockedOut: 0,
    });
  }
  // ⚠ `parseAccountList` NÉM khi hợp đồng tầng ④ lệch. Vòng đã MỞ ở bước 2, nên
  // một lần ném lọt ra ngoài `runScanCycle` sẽ bỏ hàng `ScanLog` ở trạng thái
  // `finished_at IS NULL` — và `D19` bỏ MỌI vòng sau cho tới hết `SCAN_LEASE_MINUTES`
  // (30 phút). Ở nhịp 60 giây đó là ba mươi vòng chết vì một lỗi phân giải.
  let accounts: AccountRef[];
  try {
    accounts = parseAccountList(listed.value);
  } catch (e) {
    deps.journal(
      `[vòng quét] ${now().toISOString()} · HỢP ĐỒNG \`readAccountList\` LỆCH — ${describe(e)}`,
    );
    return finish(deps, call, {
      scanLogId, startedAt: open.startedAt, accountsPlanned: 0,
      stopReason: "loi_khong_phuc_hoi", resumeCursor: null, lockedOut: 0,
    });
  }

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

  // ⚠ Mọi `parse*` trong thân vòng ĐỀU NÉM khi hợp đồng tầng ④ lệch
  // (`parseLatestArticle`, `parseLockResult`, `parseSettingValue`). Chúng phải
  // ném — im lặng đọc `undefined` tệ hơn nhiều — nhưng lần ném KHÔNG được phép
  // thoát khỏi `runScanCycle`: vòng đã mở ở bước 2, và bỏ nó lại với
  // `finished_at IS NULL` làm `D19` bỏ mọi vòng sau suốt 30 phút hạn thuê.
  // `bootstrap.ts` có bắt lần ném, nhưng nó không đóng được vòng — chỉ có chỗ này mới
  // cầm `scanLogId`. Khóa từng Công ty vẫn được nhả bởi `finally` của
  // `scanOneAccount`, nên ở đây chỉ còn việc đóng vòng cho đúng.
  try {
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
        await tuTatAi(deps, call, scanLogId);
        break;
      }

      // ⓓ đơn vị công việc là MỘT CÔNG TY TRỌN VẸN. Không đủ chỗ cho một Công ty
      //    nữa thì dừng SẠCH tại ranh giới, không cắt giữa chừng.
      if (state.maxAccountCost > 0 && state.costUsd + state.maxAccountCost > budgetUsd) {
        stopReason = "cham_tran_ngan_sach";
        resumeCursor = account.id;
        await tuTatAi(deps, call, scanLogId);
        break;
      }

      const outcome = await scanOneAccount(deps, call, scanLogId, account, state);
      if (outcome === "loi_khong_phuc_hoi") {
        stopReason = "loi_khong_phuc_hoi";
        resumeCursor = account.id;
        break;
      }
      if (outcome === "khoa_ban") state.lockedOut += 1;
      else state.scanned += 1;

      // `AD-11` — `max_consecutive_denials` lần từ chối LIÊN TIẾP trên cùng một
      // capability thì kết thúc vòng. Con số này là tín hiệu chẩn đoán đáng giá
      // hơn con số 20: nó nói *"Cổng và vòng quét đang bất đồng"*, không nói
      // *"đã tiêu hết"*.
      //
      // ⚠ KIỂM SAU MỌI KẾT CỤC, kể cả `khoa_ban`. Bản trước đặt `continue` ở
      // nhánh `khoa_ban` NGAY TRƯỚC phép kiểm này, trong khi chính nhánh đó là
      // nơi `noteDenial` đếm nhiều nhất: `acquireAccountLock` mang
      // `selfLimiting: false`, nên khi Cổng bác mã `limit` thì MỌI Công ty rơi vào
      // `khoa_ban`, bộ đếm tăng đủ nhưng không ai đọc, và vòng chạy hết danh
      // sách rồi đóng với `stop_reason = 'hoan_tat'` dù không quét được Công ty
      // nào. Tức điều kiện dừng đắt nhất của `AD-11` không với tới được trên
      // chính đường sinh ra nó.
      if (state.consecutiveDenials >= maxDenials) {
        stopReason = "loi_khong_phuc_hoi";
        resumeCursor = account.id;
        deps.journal(
          `[vòng quét] DỪNG VÒNG — ${state.consecutiveDenials} lần từ chối liên tiếp `
          + `ở \`${state.lastDeniedCap}\` (trần \`max_consecutive_denials\` = ${maxDenials}). `
          + "Cổng và vòng quét đang bất đồng (`AD-11`).",
        );
        break;
      }
    }
  } catch (e) {
    deps.journal(
      `[vòng quét] ${now().toISOString()} · NÉM GIỮA VÒNG — ${describe(e)}`,
    );
    stopReason = "loi_khong_phuc_hoi";
  }

  return finish(deps, call, {
    scanLogId,
    startedAt: open.startedAt,
    accountsPlanned: accounts.length,
    stopReason,
    resumeCursor,
    lockedOut: state.lockedOut,
    accountsScanned: state.scanned,
  });
}

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
      // Mã `FT` một mình KHÔNG chẩn đoán được. Đã đo: cả ba Công ty ăn `FT10`,
      // và dòng `FR-39` chỉ nói `lỗi: FT10` — thông điệp thật (*hợp đồng tham
      // số của `readArticle` lệch*) nằm trong `read.error` và bị vứt đi. Một mã
      // không tên nguyên nhân là một mã phải đi gỡ bằng tay.
      deps.journal(
        `[vòng quét] \`${account.name}\` · KHÔNG ĐỌC ĐƯỢC BẢN LƯU (${failureCode}) — `
        + (read.status === "denied"
          ? `Cổng từ chối \`readArticle\`: ${read.reason}`
          : describe(read.error)),
      );
      return "xong";
    }
    const article = parseLatestArticle(read.value);

    // Chưa có Bản lưu nào: Công ty chưa được nạp Bản chụp. Không phải lỗi.
    if (!article) return "xong";

    // `FR-50`/`FR-12` — nguồn không đọc được thì GHI LẠI là không đọc được.
    // Hệ thống không đoán, và không tiêu một lượt gọi mô hình nào cho nó.
    //
    // ⚠ *GHI LẠI* là phần việc, không phải phần đọc hiểu. Bản trước `return` trần:
    // `unreadableReason` được `_contract.ts` phân giải công phu rồi không ai đọc, và
    // một Công ty có nguồn hỏng trông y hệt một Công ty không có tin mới.
    if (!article.readable) {
      // ⚠ KHÔNG gán mã `FT` nào. Bảng `FT1`–`FT10` của spine phân loại THẤT BẠI
      // của hệ thống; nguồn không đọc được là một trạng thái HỢP LỆ mà `FR-50`
      // đặt tên sẵn. `FT9` (*điều kiện dừng hỏng*) và `FT10` (*hạ tầng*) đều nói
      // về chuyện khác, và một mã sai chỗ tệ hơn không mã: nó vào dòng `FR-39`
      // trông như đã phân loại xong.
      deps.journal(
        `[vòng quét] \`${account.name}\` · BẢN LƯU KHÔNG ĐỌC ĐƯỢC — `
        + (article.unreadableReason ?? "không rõ lý do")
        + " (`FR-50`/`FR-12`: hệ thống không đoán, không tiêu lượt gọi nào).",
      );
      return "xong";
    }

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
    // ⚠ Kiểm kết cục. Đây là lời gọi DUY NHẤT làm bộ đếm `model_calls_used` và
    // `cost_used_usd` trên hàng `ScanLog` tiến lên, mà `collectGateContext` lại đọc
    // đúng hai cột đó để dựng `modelCallsUsed`/`budgetUsedRatio` cho bước ⑥ của
    // Cổng. Nó hỏng trong im lặng thì trần của Cổng VĨNH VIỄN không chạm, trong khi
    // tiền vẫn tiêu — tức cả hai van ngân sách cùng mất hiệu lực một lúc.
    const usage = await call("writeScanLog", {
      op: "usage",
      scanLogId,
      modelCalls: result.modelCalls,
      costUsd: result.costUsd,
    });
    if (usage.status !== "ok") {
      deps.journal(
        `[vòng quét] \`${account.name}\` · KHÔNG CỘNG ĐƯỢC SỐ ĐO VÀO VÒNG — `
        + (usage.status === "denied"
          ? `Cổng từ chối \`writeScanLog(usage)\`: ${usage.reason}`
          : describe(usage.error))
        + " Trần ngân sách của Cổng sẽ không chạm.",
      );
    }

    if (!result.ok) {
      failureCode = FAILURE_BY_KIND[result.kind] ?? "FT10";
      // `AD-11`: CHỈ `error_during_execution` mới kết thúc vòng. Hai nhánh còn
      // lại là lỗi của MỘT Bản lưu — để chúng kết thúc vòng thì một trang dị
      // dạng giết cả 15 Công ty, và `T-8` mất dữ liệu vì lý do không liên quan.
      if (result.kind === "execution") return "loi_khong_phuc_hoi";
      return "xong";
    }

    const ghi = await writeSignals(
      deps, call, account, article.articleId, result.signals, state, deps.now ?? (() => new Date()),
    );
    signalCount = ghi.signals;
    return "xong";
  } finally {
    // ⚠ CẢ HAI lời gọi này phải ĐƯỢC KIỂM, và cả hai đều mang `selfLimiting`
    // nên chúng đáng lẽ không bao giờ bị bác. Đúng vì thế một lần bác ở đây là tin
    // tức: `recordAccountCost` hỏng là mất dòng kế toán của đúng Công ty vừa chạy
    // (`AD-AG-9`), còn `releaseAccountLock` hỏng là khóa treo 10 phút — `AD-12` suy
    // *"vòng đang chạy"* từ khóa, nên ở nhịp 60 giây đó là mười vòng bị bỏ liên tiếp.
    // Bản trước vứt cả hai `CapOutcome`, nên hậu quả đó tới mà không có nguyên nhân.
    const recorded = await call("recordAccountCost", {
      scanLogId,
      accountId: account.id,
      costUsd: accountCost,
      signalCount,
      failureCode,
    });
    if (recorded.status !== "ok") {
      deps.journal(
        `[vòng quét] \`${account.name}\` · MẤT DÒNG KẾ TOÁN — `
        + (recorded.status === "denied"
          ? `Cổng từ chối \`recordAccountCost\`: ${recorded.reason}`
          : describe(recorded.error)),
      );
    }
    const released = await call("releaseAccountLock", {
      accountId: account.id,
      processId: deps.processId,
    });
    if (released.status !== "ok") {
      deps.journal(
        `[vòng quét] \`${account.name}\` · KHÔNG NHẢ ĐƯỢC KHÓA — `
        + (released.status === "denied"
          ? `Cổng từ chối \`releaseAccountLock\`: ${released.reason}`
          : describe(released.error))
        + ` Công ty này bị bỏ suốt ${LOCK_LEASE_MINUTES} phút tới (\`AD-12\`).`,
      );
    }
  }
}

/// `FR-36` · `D36` — **mỗi Phát hiện mới sinh ĐÚNG MỘT mục** Dòng thời gian,
/// và mỗi Phát hiện mới đều được thử tự đặt Việc tiếp theo (`§4/nhóm 4`, `T-6`).
///
/// Một Bản lưu chứa hai tin thì sinh hai mục, không phải một; `T-8` đếm MỤC.
/// Gộp chúng thành một mục *"có 2 tin mới"* là làm phép đếm của `T-8` sai theo
/// hướng khó thấy nhất — nó vẫn có mục, chỉ thiếu một.
///
/// ⚠ Hàm trả HAI bộ đếm và cả hai đều CHỈ nói về nhóm 3. Lượt tự đặt Việc tiếp
/// theo cố ý KHÔNG có bộ đếm thứ ba: `recordAccountCost({ signalCount })` là
/// dòng kế toán của Phát hiện, và `estimated_cost_per_account` của `AD-11` đọc
/// từ đúng dòng đó — trộn một con số của nhóm 4 vào làm phép ước chi phí của
/// vòng sau sai. Số lần tự đặt là số đo của `FR-33` (*tỉ lệ hoàn tác trên tổng
/// số lần tự đặt*), và nó đọc từ bảng ghi vết, không từ đây.
async function writeSignals(
  deps: ScanLoopDeps,
  call: CallFn,
  account: AccountRef,
  articleId: string,
  signals: readonly SignalDraft[],
  state: CycleState,
  now: () => Date,
): Promise<{ signals: number; entries: number }> {
  const accountId = account.id;
  // ⚠ HAI bộ đếm, không một. Bản trước trả đúng một số `written`, chỉ tăng khi
  // CẢ `createSignal` LẪN `appendTimelineEntry` thành công, rồi bên gọi ghi nó vào
  // `recordAccountCost({ signalCount })`. Nghĩa là khi mục Dòng thời gian hỏng mà
  // Phát hiện đã nằm trong CSDL, bảng `signal` có hàng nhưng dòng kế toán báo
  // thiếu — và `estimated_cost_per_account` của `AD-11` đọc từ chính dòng đó.
  let created = 0;
  let entries = 0;
  for (const draft of signals) {
    // ⚠ ĐỔI TÊN Ở BIÊN, không đổi ở lõi. Tầng ② gọi nó `quoteRange` (*"vị trí
    // công cụ trả về"*); lõi gọi nó `modelQuoteRange` (*"vị trí MÔ HÌNH KHAI"*)
    // để đứng cạnh `quoteStart`/`quoteEnd` mà không ai đọc nhầm cái nào là
    // nguồn sự thật. Hai cái tên nói hai góc nhìn, và biên là chỗ đúng để dịch.
    const { quoteRange, ...phanConLai } = draft;
    const madeSignal = await call("createSignal", {
      accountId, articleId, ...phanConLai, modelQuoteRange: quoteRange,
    });
    if (madeSignal.status !== "ok") {
      noteDenial(state, madeSignal);
      reportDrop(deps, account, "BỎP̀ MỘT PHÁT HIỆN", madeSignal);
      // `BR-D1`/`BR-D2` bác một Phát hiện (thiếu câu trích, câu trích không
      // khớp nguyên văn) là chuyện BÌNH THƯỜNG của lớp này — bỏ Phát hiện đó,
      // đi tiếp. Nó không được kéo theo những Phát hiện hợp lệ khác.
      continue;
    }
    created += 1;

    const signalId = readId(madeSignal.value);
    if (signalId === null) {
      // `FR-36` buộc quan hệ 1-1 giữa Phát hiện và mục. `readId` trả `null` khi
      // `createSignal` không trả `id` — tạo mục với `sourceSignalId: null` thì quan
      // hệ đó đứt IM LẶNG: mục vẫn hiện trên Dòng thời gian, bấm vào không ra
      // đoạn văn gốc, và `T-3` đỏ ở một chỗ cách xa nguyên nhân.
      deps.journal(
        `[vòng quét] \`${account.name}\` · BỎ MỘT MỤC — \`createSignal\` không trả \`id\`, `
        + "không neo được mục Dòng thời gian về Phát hiện (`FR-36`).",
      );
      continue;
    }

    const appended = await call("appendTimelineEntry", {
      accountId,
      content: draft.claim,
      // Đồng hồ đi qua `deps.now` như mọi chỗ khác của tệp. Bản trước đọc
      // `new Date()` thẳng, nên `tests/` không cố định được `occurred_at` — đúng cột
      // mà Dòng thời gian sắp xếp theo, và `T-8` đọc thứ tự đó.
      occurredAt: draft.eventDate ?? now().toISOString(),
      sourceSignalId: signalId,
    });
    if (appended.status !== "ok") {
      noteDenial(state, appended);
      // ⚠ KHÔNG nói *"bỏ một Phát hiện"* ở nhánh này. Phát hiện ĐÃ được tạo và
      // đang nằm trong CSDL; thứ hỏng là mục Dòng thời gian. `BR-D2` nói về việc
      // loại Phát hiện khi câu trích không khớp — một chuyện khác hẳn. Mã đúng cho
      // ca này là `FR-36` (*mỗi Phát hiện mới sinh đúng một mục*), đã trích ở đầu hàm.
      reportDrop(deps, account, "BỎ MỘT MỤC DÒNG THỎI GIAN (`FR-36`)", appended);
    } else {
      state.consecutiveDenials = 0;
      entries += 1;
    }

    // ── §4/nhóm 4 · `T-6` — TỰ ĐẶT VIỆC TIẾP THEO ─────────────────────────
    //
    // ⚠ KHÔNG đặt sau một `continue` của nhánh trên, và đây là chỗ dễ nối sai
    // nhất của cả khối. Nhóm 3 (*thêm mục Dòng thời gian*) và nhóm 4 (*tự đặt
    // Việc tiếp theo*) là HAI nghĩa vụ độc lập của cùng một Phát hiện; gắn nhóm
    // 4 vào sau thành công của nhóm 3 làm một lượt `appendTimelineEntry` hỏng
    // lặng lẽ kéo `T-6` đỏ theo, với triệu chứng trỏ vào Việc tiếp theo trong
    // khi nguyên nhân nằm ở Dòng thời gian. Nên nhánh hỏng ở trên nay ghi nhật
    // ký rồi ĐI TIẾP, không `continue`.
    //
    // Đặt SAU `createSignal` là bắt buộc chứ không phải tuỳ chọn: `AD-3` đòi mọi
    // chạm ghi của máy truy được về một Phát hiện, và `signalId` chỉ tồn tại sau
    // khi hàng `signal` đã ghi xong. Đây cũng là cột `next_action.source_signal_id`
    // mà `T-6` khẳng định KHÔNG NULL.
    const autoSet = await autoSetNextAction(call, deps.journal, account, {
      signalId,
      claim: draft.claim,
    });
    // `AD-11` — KIỂM KẾT CỤC. Lời gọi này mang `selfLimiting: false`, nên nó
    // nằm đúng trong tập bị Cổng bác khi phanh tắt hoặc trần chạm; không đưa nó
    // cho `noteDenial` thì một Cổng đang bác mọi lượt không bao giờ chạm được
    // `max_consecutive_denials`, và vòng đóng với `hoan_tat` dù không đặt nổi
    // một Việc tiếp theo nào.
    if (autoSet.status !== "ok") noteDenial(state, autoSet);
    else state.consecutiveDenials = 0;

    // ── §4/nhóm 3 · `T-5` — XẾP GỢI Ý VÀO HÀNG ĐỢI ────────────────────────
    //
    // Ontology §6 xếp *"xếp Gợi ý vào hàng đợi"* vào vùng **chạy ngầm** của máy,
    // ngang hàng với *"tạo Phát hiện"*. Nhưng không bên gọi nào tồn tại: đo được
    // trên một lượt quét thật đã sinh Phát hiện, mục Dòng thời gian, Việc tiếp
    // theo và Thông báo — mà bảng `suggestion` RỖNG, nên khối *Gợi ý chờ quyết*
    // của `T-5` không có gì để hiện.
    //
    // ⚠ ĐỘC LẬP với hai nhánh trên, cùng lý do đã ghi ở khối nhóm 4: ba nghĩa vụ
    // của một Phát hiện không được xâu chuỗi, nếu không một cái hỏng kéo hai cái
    // kia đỏ theo với triệu chứng trỏ sai chỗ.
    //
    // ⚠ Không rút được ô nào là kết cục BÌNH THƯỜNG, không phải từ chối. Lõi trả
    // `{ skipped: true, reason }` và Cổng vẫn nói `ok` — nên nhánh này KHÔNG gọi
    // `noteDenial`, và một Bản lưu không có địa chỉ web hay năm thành lập không
    // đẩy vòng quét tới `max_consecutive_denials`.
    const queued = await call("queueSuggestion", { accountId, signalId });
    if (queued.status !== "ok") {
      noteDenial(state, queued);
      reportDrop(deps, account, "BỎ MỘT GỢI Ý (`FR-18`)", queued);
    } else {
      state.consecutiveDenials = 0;
    }
  }
  return { signals: created, entries };
}

function readId(v: unknown): string | null {
  if (typeof v === "object" && v !== null && "id" in v) {
    const id = (v as { id: unknown }).id;
    if (typeof id === "string") return id;
  }
  return null;
}

/// `C5-9`/`BR-D2` đòi nguyên văn *"lệch thì loại VÀ GHI NHẬT KÝ"*. Bản trước
/// chỉ loại: một Phát hiện bị bác biến mất không để lại dấu vết nào, và cả hai
/// nguyên nhân rất khác nhau — câu trích không khớp (bình thường) và capability
/// vắng mặt khỏi sổ đăng ký (hỏng nặng) — cho cùng một triệu chứng *"vòng chạy
/// xong, không có mục nào"*. Một dòng cho mỗi lượt bỏ là cái giá rẻ để phân
/// biệt được hai thứ đó lúc 3 giờ sáng.
/// Điều kiện dừng 4 của `AD-11` — chạm trần ngân sách thì TỰ TẮT AI, MỘT CHIỀU.
///
/// ⚠ KẾT CỤC PHẢI ĐƯỢC ĐỌC. Bản trước gọi `call("disableAi", …)` rồi vứt
/// `CapOutcome` đi — hai lời gọi duy nhất trong tệp không có nhánh xử lý. `disableAi`
/// hiện KHÔNG có trong sổ đăng ký (`AD-2` xếp nó vào khối một hạng ghi, chưa tệp
/// `caps/*.ts` nào khai), nên lời gọi trả `unknown_capability` và AI **không hề bị
/// tắt** — vòng sau lại mở, lại tiêu tiền. Van cuối cùng của ngân sách hỏng trong
/// im lặng là hình dạng lỗi đắt nhất của cả tệp này.
async function tuTatAi(deps: ScanLoopDeps, call: CallFn, scanLogId: string): Promise<void> {
  const r = await call("disableAi", { reason: "cham_tran_ngan_sach", scanLogId });
  if (r.status === "ok") return;
  deps.journal(
    "[vòng quét] CHẠM TRẦN NGÂN SÁCH NHƯNG KHÔNG TẮT ĐƯỢC AI — "
    + (r.status === "denied"
      ? `Cổng từ chối \`disableAi\`: ${r.reason}`
      : describe(r.error))
    + " Điều kiện dừng 4 của `AD-11` KHÔNG có hiệu lực; vòng sau sẽ lại mở.",
  );
}

///
/// ⚠ Tên capability lấy từ `outcome.capability`, KHÔNG nhận qua tham số. Cả hai
/// nhánh của `CapOutcome` đã mang sẵn trường đó (`_contract.ts`), và gõ lại bằng tay
/// là mở đường cho hai chuỗi trôi khỏi nhau — `noteDenial` ngay dưới đã đọc
/// `outcome.capability`, hai hàm cạnh nhau lấy cùng dữ kiện theo hai đường là một
/// chỗ lệch chờ sẵn.
function reportDrop(
  deps: ScanLoopDeps,
  account: AccountRef,
  nhan: string,
  outcome: CapOutcome,
): void {
  if (outcome.status === "ok") return;
  deps.journal(
    `[vòng quét] \`${account.name}\` · ${nhan} ở \`${outcome.capability}\` — `
    + (outcome.status === "denied"
      ? `Cổng từ chối: ${outcome.reason}`
      : describe(outcome.error)),
  );
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

/// ⚠ CANH BIÊN DƯƠNG, không chỉ `isFinite`. Cả ba tham số đọc qua hàm này là
/// TRẦN, và một trần bằng `0` không có nghĩa là *"không giới hạn"* — nó làm
/// vòng dừng ngay ở Công ty đầu tiên với `cham_tran_ngan_sach`, tức phanh bật
/// suốt buổi demo mà không ai hiểu vì sao. Chuỗi rỗng ép thành `0`, nên đây là
/// đường đi vào thật, không phải ca giả định. `bootstrap.ts` đã canh `> 0` cho
/// `scan_interval_minutes`; hai chỗ đọc `settings` mà canh khác nhau là chỗ
/// trôi khỏi nhau.
///
/// Lượt đọc bị Cổng bác cũng phải NÓI RA: lui về mặc định trong im lặng nghĩa
/// là vòng chạy theo một trần khác với trần Quản trị vừa đặt, và không dòng nào
/// ghi lại chuyện đó.
async function readNumberSetting(
  deps: ScanLoopDeps,
  call: CallFn,
  key: string,
  fallback: number,
): Promise<number> {
  const r = await call("readSetting", { key });
  if (r.status !== "ok") {
    deps.journal(
      `[vòng quét] KHÔNG ĐỌC ĐƯỢC \`${key}\`, lui về mặc định ${fallback} — `
      + (r.status === "denied" ? `Cổng từ chối: ${r.reason}` : describe(r.error)),
    );
    return fallback;
  }
  const n = Number(parseSettingValue(r.value));
  if (!Number.isFinite(n) || n <= 0) {
    deps.journal(
      `[vòng quét] THAM SỐ \`${key}\` không phải số dương (\`${String(parseSettingValue(r.value))}\`), `
      + `lui về mặc định ${fallback}.`,
    );
    return fallback;
  }
  return n;
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
    /// Số Công ty đã quét XONG, đếm trong thân vòng. Chỉ dùng cho đường ĐÓNG
    /// HỎNG: khi đóng được, con số đúng là `summary.accountsScanned` do lõi
    /// đếm từ bảng `scan_log_entry`. Bản trước trả cứng `0` ở đường hỏng, tức
    /// một vòng quét xong 10 Công ty vẫn báo về `0` cho bên gọi.
    accountsScanned?: number;
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
      accountsScanned: input.accountsScanned ?? 0,
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
