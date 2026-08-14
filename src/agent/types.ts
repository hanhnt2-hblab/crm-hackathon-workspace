// `AD-AG-1` · `AD-AG-3` · `AD-AG-5` · `AD-AG-9` — tầng ② Agent Runtime.
//
// ⚠ `AD-AG-3`: tầng này là BỘ BIẾN ĐỔI THUẦN — nó không gọi capability nào,
// không nhập `src/capability` và không nhập `src/core`. Nó nhận văn bản, trả
// dữ liệu có cấu trúc. Máy chủ MCP đi vào qua `AgentDeps.crmMcpServer` dưới
// dạng **giá trị mờ**, đúng để lời nhập đó không tồn tại.

import { z } from "zod";

/// `AD-AG-1` — bề mặt công khai là MỘT hàm; mọi phụ thuộc tiêm vào.
export type AgentDeps = {
  /// Kiểu lấy từ SDK, để `unknown` có chủ đích — khai kiểu thật ở đây là kéo
  /// `src/capability` vào đồ thị kiểu của tầng ②, đúng thứ `AD-AG-3` cấm.
  crmMcpServer: unknown;
  modelId: string;
  maxTurns: number;
  /// ⚠ Đây là trần cho MỘT lời gọi `query()`, KHÔNG phải trần cả vòng quét.
  /// Trần vòng quét là bộ đếm `cost_used_usd` riêng ở `AD-11`. Nhầm hai thứ này
  /// làm phanh ngân sách không bao giờ chạm.
  maxBudgetUsd: number;
  abortSignal?: AbortSignal;
};

/// `AD-AG-5` — lược đồ Phát hiện: một đối tượng bọc, sáu trường, ĐÓNG.
///
/// ⚠ CẤM `z.date()` ở mọi nơi trong lược đồ này. Zod 4.4.3 ném *"Date cannot be
/// represented in JSON Schema"* **lúc dựng**, không phải lúc chạy — nghĩa là
/// `npm start` chết trước khi giám khảo mở được trang. Dùng `z.iso.datetime()`.
///
/// `BR-D10`: mọi enum bắt mô hình CHỌN trong danh sách cho sẵn, không nhập tự
/// do. Giá trị enum giữ tiếng Việt không dấu theo Mục 0.
export const SignalDraftSchema = z.object({
  claim: z.string().min(1),
  /// `BR-D1` — không có câu trích thì Phát hiện không tồn tại. Lược đồ bắt
  /// buộc trường này là lớp chặn thứ nhất; lõi khớp nguyên văn là lớp thứ hai.
  quote: z.string().min(1),
  /// Khớp TỪNG CHỮ với `enum SignalType` của lược đồ.
  /// ⚠ Không phải `product_launch`/`leadership_change` — hai tên đó không tồn tại.
  signalType: z.enum([
    "funding", "leadership", "expansion", "hiring", "new_business", "other",
  ]),
  signalSubtype: z
    .enum([
      "rfp", "partnership", "compliance", "m_and_a", "roadmap_delay",
      "dx_initiative", "certification", "downturn", "legacy_modernization",
      "ai_signal", "remote_team", "event", "unclassified",
    ])
    .nullable(),
  confidence: z.enum(["chac", "co_the", "doan"]),
  /// `AD-AG-5` khai ĐÚNG SÁU trường và `relevance` là một trong sáu — cột
  /// `signal.relevance` cũng NOT NULL. Bỏ nó là `createSignal` thiếu một
  /// trường bắt buộc mà không nguồn nào trong hợp đồng cấp được.
  relevance: z.enum(["high", "medium", "low"]),
  /// ⚠ NGOÀI sáu trường của `AD-AG-5` — trường thứ bảy, thêm có chủ đích.
  /// `BR-D7` tính hạn ĐO TỪ NGÀY SỰ KIỆN và không nguồn nào khác cấp nó; chốt
  /// 14/8 là lưu thành cột `signal.event_date` (`BR-D8` cần nó về sau).
  /// `z.iso.datetime()`, KHÔNG `z.date()` — xem cảnh báo đầu khối.
  eventDate: z.iso.datetime().nullable(),
});

export type SignalDraft = z.infer<typeof SignalDraftSchema>;

/// `AD-AG-9` — BA lớp lỗi, và kết quả là union PHÂN BIỆT ĐƯỢC.
///
/// Vì sao không ném: bên gọi (`src/scan`) phải ghi `ScanLogEntry` cho **mọi**
/// lượt, kể cả lượt hỏng — `modelCalls` và `costUsd` vẫn phải cộng vào bộ đếm
/// ngân sách. Ném thì hai con số đó mất, và phanh của `AD-11` không bao giờ
/// chạm dù tiền vẫn tiêu.
export type ExtractionResult =
  | {
      ok: true;
      signals: SignalDraft[];
      modelCalls: number;
      costUsd: number | null;
      numTurns: number;
      stopReason: string | null;
    }
  | {
      ok: false;
      kind: "schema" | "transport" | "execution" | "turns" | "budget";
      subtype: string | null;
      modelCalls: number;
      costUsd: number | null;
    };

/// `AD-AG-2` — MỘT Bản lưu là MỘT `query()`. Không phiên dùng lại, không gộp lô.
/// `AD-AG-10` — `NFR-2` đếm số `query()`, KHÔNG BAO GIỜ đếm `num_turns`.
/// ⚠ Thứ tự tham số là `(input, deps)` theo `AD-AG-1`, KHÔNG phải `(deps, input)`.
export function extractSignals(
  _input: { accountId: string; articleText: string },
  _deps: AgentDeps,
): Promise<ExtractionResult> {
  throw new Error("chưa hiện thực");
}
