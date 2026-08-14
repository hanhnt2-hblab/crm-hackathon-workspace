// `AD-UI-1` · `AD-12` · `AD-15` · `AD-1` (composition root, nhánh máy)
//
// Đây là composition root của NHÁNH MÁY, và là tệp duy nhất của nhánh đó dựng
// phụ thuộc. Nó làm đúng năm việc, theo đúng thứ tự `AD-UI-1` đã chốt:
//
//   1. `createRegistry({ seedMode: false, auditSink })` — MỘT thể hiện mức
//      module. Không nhánh nào chia sổ đăng ký với nhánh khác (`AD-1`).
//   2. Dọn khoá mang `process_id` cũ của chính tiến trình này (`AD-12`).
//   3. Đặt lịch theo `scan_interval_minutes` — env là giá trị khởi tạo, bảng
//      `settings` ghi đè lúc chạy (`AD-15`).
//   4. Trao sổ đăng ký cho `src/scan/loop.ts`.
//   5. Xử lý tín hiệu dừng: nhả khoá qua `releaseAccountLock`.
//
// KHÔNG đặt gì trong `instrumentation.ts`: tệp đó lint theo thư mục không với
// tới, và `tests/` không nạp được nếu nó khởi động luôn vòng lặp.

import { createRegistry } from "@/capability/registry";
import { createAuditSink } from "@/core/audit";
import { runScanCycle, type ExtractFn } from "./loop";
import { callCap, parseSettingValue } from "./_contract";
import { consoleJournal, type JournalSink } from "./journal";

/// `AD-12` — `process_id` phải ỔN ĐỊNH QUA MỘT LẦN KHỞI ĐỘNG LẠI, vì bước ②
/// là *"dọn khoá mang `process_id` **cũ của chính nó**"*. Một `process.pid`
/// hay một uuid ngẫu nhiên làm câu đó vô nghĩa: sau khi khởi động lại, tiến
/// trình không nhận ra khoá nào là của mình, và mọi khoá cũ nằm lại tới hết hạn.
///
/// Định danh cố định là đúng ở đây vì `AD-12` đã chốt **một** vòng quét cho
/// **một** triển khai. Hai tiến trình worker cùng lúc là kịch bản mà cờ
/// singleton của `instrumentation.ts` sinh ra để chặn, không phải kịch bản mà
/// định danh này phải phân biệt.
export const SCAN_PROCESS_ID = "scan-worker";

/// `AD-15` — bảng `settings` ghi đè giá trị khởi tạo của env. Đọc MỖI LẦN lập
/// lịch, không đọc một lần lúc khởi động: `D38` đòi Quản trị sửa chu kỳ và có
/// hiệu lực ngay, và `FR-37` xếp chu kỳ vào nhóm sửa được lúc chạy.
const FALLBACK_INTERVAL_MINUTES = 1;

/// Chu kỳ đo **cuối-đến-đầu** (`NFR-1`): đếm từ lúc vòng trước KẾT THÚC, không
/// phải từ lúc nó bắt đầu. Đo đầu-đến-đầu thì một vòng chạy lâu hơn chu kỳ sẽ
/// làm vòng sau tới ngay lập tức rồi bị bỏ, và Nhật ký đầy dòng *"bỏ vòng"* mà
/// không ai hiểu vì sao.
async function nextIntervalMs(runtime: ScanRuntime): Promise<number> {
  const r = await callCap(
    runtime.registry,
    { kind: "system" },
    "readSetting",
    { key: "scan_interval_minutes" },
  );
  const minutes = r.status === "ok" ? Number(parseSettingValue(r.value)) : Number.NaN;
  const safe = Number.isFinite(minutes) && minutes > 0 ? minutes : FALLBACK_INTERVAL_MINUTES;
  return safe * 60_000;
}

export type ScanRuntime = {
  registry: ReturnType<typeof createRegistry>;
  journal: JournalSink;
  extract: ExtractFn;
  stop: () => Promise<void>;
};

/// ⚠ HÀM RÚT PHÁT HIỆN CHƯA NỐI, và nó cố ý KHÔNG nối bằng cách nhập thẳng
/// `extractSignals` của `@/agent/types`.
///
/// `AgentDeps` (`AD-AG-1`) đòi `crmMcpServer`, `modelId`, `maxTurns`,
/// `maxBudgetUsd`. Ba trong bốn thứ đó là **cấu hình**, mà `AD-15` chốt đúng
/// BA tệp toàn repo được đọc `process.env` và tệp này không nằm trong ba tệp
/// đó. Dựng chúng ở đây là hoặc bịa ba con số, hoặc phá `AD-15` — và
/// `maxBudgetUsd` bịa sai đúng là thứ `AD-11` cảnh báo: nhầm trần-một-lượt với
/// trần-một-vòng làm phanh ngân sách không bao giờ chạm.
///
/// Nối đúng cách, khi chủ tầng ② và `src/config.ts` sẵn sàng: thay thân hàm
/// này bằng `extractSignals({ accountId, articleText }, deps)` với `deps` dựng
/// từ `src/config.ts`. Vòng quét KHÔNG phải đổi một dòng nào — nó nhận hàm này
/// qua tham số (`ExtractFn`).
///
/// Trả về một thất bại có mã thay vì ném: `AD-AG-9` chốt bên gọi phải ghi
/// `ScanLogEntry` cho **mọi** lượt, kể cả lượt hỏng. Ném ở đây làm vòng quét
/// mất dòng kế toán của Công ty đó.
export const unwiredExtract: ExtractFn = async () => ({
  ok: false,
  kind: "transport",
  subtype: "agent_chua_noi",
  modelCalls: 0,
  costUsd: 0,
});

/// Bước 1 + 2 + 5. Tách khỏi `start()` để `tests/` dựng được runtime mà không
/// khởi động vòng lặp — `AD-UI-1` nói thẳng lý do: `tests/` không nạp được tệp
/// này nếu nó khởi động luôn.
export async function createScanRuntime(opts?: {
  journal?: JournalSink;
  extract?: ExtractFn;
}): Promise<ScanRuntime> {
  // ① sổ đăng ký của riêng nhánh máy. `seedMode: false` là hằng số của nhánh
  //    này; `keepAudit` chỉ có nghĩa ở chế-độ-gieo (`AD-CR-8`).
  const registry = createRegistry({
    seedMode: false,
    auditSink: createAuditSink({ seedMode: false, keepAudit: true }),
  });

  const runtime: ScanRuntime = {
    registry,
    journal: opts?.journal ?? consoleJournal,
    extract: opts?.extract ?? unwiredExtract,
    stop: async () => {
      // ⑤ nhả MỌI khoá của tiến trình này. `releaseAccountLock` mang cờ
      //    `selfLimiting`, nên nó chạy được cả khi trần đã chạm (`AD-4`) —
      //    xem cảnh báo ở đầu `loop.ts` về việc Cổng chưa đọc cờ đó.
      await callCap(registry, { kind: "system" }, "releaseAccountLock", {
        accountId: null,
        processId: SCAN_PROCESS_ID,
      });
    },
  };

  // ② dọn khoá mang `process_id` cũ CỦA CHÍNH TIẾN TRÌNH NÀY (`AD-12`).
  //    Chỉ của chính nó: một tiến trình thứ hai đang chạy hợp lệ vẫn phải giữ
  //    được khoá của nó qua lần khởi động lại của tiến trình này.
  const swept = await callCap(registry, { kind: "system" }, "releaseAccountLock", {
    accountId: null,
    processId: SCAN_PROCESS_ID,
  });
  if (swept.status !== "ok") {
    runtime.journal(
      "[vòng quét] khởi động: KHÔNG dọn được khoá cũ — "
      + (swept.status === "denied" ? `Cổng từ chối: ${swept.reason}` : "lỗi hạ tầng")
      + ". Khoá cũ sẽ tự hết hạn theo lease (`AD-12`).",
    );
  }

  return runtime;
}

let timer: ReturnType<typeof setTimeout> | null = null;
let running = false;

/// Bước 3 + 4. Lịch dựng bằng `setTimeout` ĐỆ QUY, không bằng `setInterval`.
///
/// `setInterval` bắn theo lịch cố định bất kể lượt trước xong chưa, tức nó tự
/// tạo ra chồng vòng — đúng thứ `D19` cấm, và nó tạo ở tầng lập lịch nơi khoá
/// không với tới. `setTimeout` đệ quy đo cuối-đến-đầu, khớp `NFR-1`.
export async function start(runtime: ScanRuntime): Promise<void> {
  if (running) return;
  running = true;

  const tick = async () => {
    try {
      await runScanCycle({
        registry: runtime.registry,
        processId: SCAN_PROCESS_ID,
        extract: runtime.extract,
        journal: runtime.journal,
      });
    } catch (e) {
      // `runScanCycle` không được ném, nhưng nếu nó ném thì lịch PHẢI sống
      // tiếp: một lần ném giết vòng lặp là *"hết buổi demo không có gì xảy
      // ra"*, và triệu chứng giống hệt phanh AI bị bật.
      runtime.journal(
        `[vòng quét] LỖI NGOÀI DỰ KIẾN: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
    if (!running) return;
    timer = setTimeout(() => void tick(), await nextIntervalMs(runtime));
  };

  timer = setTimeout(() => void tick(), await nextIntervalMs(runtime));
}

export async function stop(runtime: ScanRuntime): Promise<void> {
  running = false;
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  await runtime.stop();
}

// ─────────────────────── Điểm vào thật của tiến trình ───────────────────────
//
// `instrumentation.ts` `await import()` tệp này, nên thân module chạy đúng một
// lần trong runtime Node. Cờ `NEXT_RUNTIME` đã được chặn ở tệp kia; ở đây chỉ
// còn chặn `test`, vì `tests/` nhập tệp này để dựng runtime chứ không để chạy.
if (process.env.NODE_ENV !== "test") {
  void (async () => {
    const runtime = await createScanRuntime();
    for (const signal of ["SIGINT", "SIGTERM"] as const) {
      process.once(signal, () => {
        void stop(runtime);
      });
    }
    await start(runtime);
  })();
}
