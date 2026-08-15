// Điều khiển vòng quét cho `T-4`, `T-6`, `T-8`, `T-9`.
//
// ⚠ CHẠY `runScanCycle` TRỰC TIẾP, KHÔNG chờ bộ hẹn giờ của `bootstrap.ts`.
// Chu kỳ demo mặc định là 60 giây (Mục 0, bảng 0.2.2), nên `T-4` — *"ít nhất ba
// chu kỳ"* — sẽ mất hơn ba phút nếu chờ đồng hồ thật, và `T-8`/`T-9` mỗi cái
// thêm hai phút. Gọi thẳng từng vòng cho ĐÚNG số vòng đề bài đòi, tức thì, và
// không phụ thuộc vào việc máy chấm có nhanh hay không.
//
// Đây KHÔNG phải nới lỏng khẳng định: `runScanCycle` là chính thân vòng mà bộ
// hẹn giờ gọi (`src/scan/bootstrap.ts` chỉ lặp lại nó theo nhịp). Thứ bị bỏ qua
// là *độ trễ giữa hai vòng*, mà không điểm nghiệm thu nào của §6 phát biểu về
// độ trễ — chúng phát biểu về SỐ VÒNG.
//
// ⚠ HÀM RÚT PHÁT HIỆN LÀ HÀM GIẢ, có chủ đích và phải nói rõ.
// `AD-AG-1` cho tầng ② nhận phụ thuộc qua tham số chính là để chỗ này thay được.
// Gọi mô hình thật ở đây làm bộ nghiệm thu phụ thuộc mạng, phụ thuộc hạn mức,
// và KHÔNG TẤT ĐỊNH — cùng một đầu vào cho hai kết quả khác nhau, nên
// *"đúng hai mục mới"* của `T-8` không phát biểu được.
// Cái đang đo ở đây là **vòng quét**, không phải chất lượng của mô hình: liệu
// nó có chạy khi không ai bấm gì, có dừng khi phanh bật, có ghi nhật ký từng
// vòng. Chất lượng rút Phát hiện là phép đo khác, ở chỗ khác.

import "./_env";

import { runScanCycle, type ExtractFn, type ScanCycleOutcome } from "@/scan/loop";
import { createRegistry } from "@/capability/registry";
import { createAuditSink } from "@/core/audit";
import type { SignalDraft } from "@/agent/types";

/// Mã tiến trình riêng của bộ e2e. KHÁC `SCAN_PROCESS_ID` của `bootstrap.ts`
/// (`"scan-worker"`) có chủ đích: nếu một tiến trình quét thật đang chạy trên
/// cùng CSDL demo, hai bên phải phân biệt được nhau trong bảng `account_lock`.
export const E2E_SCAN_PROCESS_ID = "e2e-scan";

/// Hàm rút Phát hiện GIẢ, tất định: trả đúng danh sách được giao, không gọi mạng.
/// `modelCalls: 0` để không tiêu vào trần `model_calls_per_scan` — bộ e2e không
/// đo phanh ngân sách, và một con số khác 0 ở đây làm vòng dừng sớm vì lý do
/// chẳng liên quan gì tới điểm nghiệm thu đang chạy.
export function stubExtract(
  byAccount: Map<string, SignalDraft[]>,
): ExtractFn {
  return async ({ accountId }) => ({
    ok: true,
    signals: byAccount.get(accountId) ?? [],
    modelCalls: 0,
    costUsd: 0,
    numTurns: 1,
    stopReason: null,
  });
}

/// Hàm rút Phát hiện KHÔNG trả gì. Dùng cho `T-4`: vòng quét phải chạy đủ ba
/// lần mà hồ sơ vẫn y nguyên, và cách sạch nhất để nói *"không ai quyết gì"* là
/// không sinh thêm Phát hiện mới nào ở các vòng sau.
export const emptyExtract: ExtractFn = async () => ({
  ok: true,
  signals: [],
  modelCalls: 0,
  costUsd: 0,
  numTurns: 1,
  stopReason: null,
});

export type CycleRun = {
  outcomes: ScanCycleOutcome[];
  /// Mọi dòng nhật ký vòng quét sinh ra. `T-8` khẳng định trên chính danh sách
  /// này: *"Nhật ký vòng quét có dòng tổng kết cho từng vòng"*.
  journal: string[];
};

/// Chạy ĐÚNG `count` vòng quét, tuần tự, và thu lại nhật ký.
///
/// Sổ đăng ký dựng với ghi vết THẬT: `T-8` và `T-9` phát biểu về thứ vòng quét
/// để lại, và một sink câm sẽ giấu đúng vế đó.
export async function runCycles(
  count: number,
  extract: ExtractFn,
): Promise<CycleRun> {
  const journal: string[] = [];
  const registry = createRegistry({
    seedMode: false,
    auditSink: createAuditSink({ seedMode: false, keepAudit: true }),
  });

  const outcomes: ScanCycleOutcome[] = [];
  for (let i = 0; i < count; i += 1) {
    const outcome = await runScanCycle({
      registry,
      processId: E2E_SCAN_PROCESS_ID,
      extract,
      journal: (line) => journal.push(line),
    });

    // ⚠ VA CHẠM VỚI MỘT TIẾN TRÌNH QUÉT KHÁC — nêu tên ngay, đừng để nó biến
    // thành *"0 mục trên dòng thời gian"* ở phép kiểm sau.
    //
    // `D19` cấm chồng vòng: còn một hàng `scan_log` với `finished_at IS NULL`
    // trong hạn thuê 30 phút thì mọi vòng sau bị BỎ. Đó là hành vi ĐÚNG, không
    // phải lỗi — nhưng nó làm `T-4`, `T-6`, `T-8`, `T-9` không đo được gì, và
    // triệu chứng (*không có mục nào*) trỏ vào vòng quét thay vì vào nguyên nhân
    // thật. Một giờ gỡ lỗi nhầm chỗ bắt đầu từ đúng đây.
    if (!outcome.ran && outcome.reason === "bo_vi_vong_truoc_chua_xong") {
      throw new Error(
        "Vòng quét bị BỎ vì còn một vòng trước chưa đóng (`D19`, hạn thuê 30 phút).\n"
          + "  Đây KHÔNG phải lỗi sản phẩm và KHÔNG phải lỗi của phép kiểm — nó nghĩa là\n"
          + "  một tiến trình quét KHÁC đang chạy trên cùng cơ sở dữ liệu demo 5442,\n"
          + "  nhiều khả năng là bộ hẹn giờ của `src/scan/bootstrap.ts` (`processId`\n"
          + "  `scan-worker`) do `npm start` khởi động.\n"
          + "  Bộ nghiệm thu phải SỞ HỮU vòng quét thì mới đếm được số vòng mà §6 đòi.\n"
          + "  Dừng tiến trình quét kia rồi chạy lại, hoặc đợi hàng `scan_log` đang mở\n"
          + "  đóng lại (`SELECT id, started_at FROM scan_log WHERE finished_at IS NULL`).",
      );
    }

    outcomes.push(outcome);
  }
  return { outcomes, journal };
}

/// Bản nháp Phát hiện hợp lệ tối thiểu — dùng làm nền rồi ghi đè từng trường.
/// Giá trị lấy từ Mục 0: `funding` + `chac` + `high` là ô có hạn NGẮN NHẤT
/// (1 ngày làm việc, bảng 0.2.1), tức nhánh chắc chắn sinh ra Việc tiếp theo.
export function signalDraft(over: Partial<SignalDraft> = {}): SignalDraft {
  return {
    claim: "Công ty vừa gọi vốn vòng B",
    quote: "gọi vốn vòng B",
    signalType: "funding",
    signalSubtype: null,
    confidence: "chac",
    relevance: "high",
    eventDate: null,
    /// `null` = mô hình KHÔNG gọi `verifyQuote`. Đó là nền đúng cho fixture:
    /// trường này là lớp kiểm THÊM, không phải lớp thay — một bản nháp không có
    /// nó vẫn phải đi qua đúng như trước, và `T-2` vẫn bác câu trích không khớp.
    quoteRange: null,
    ...over,
  };
}
