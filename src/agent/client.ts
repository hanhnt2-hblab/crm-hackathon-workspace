// `AD-AG-1` · `AD-AG-2` · `AD-AG-8` · `AD-AG-9` · `AD-AG-10` · `AD-AG-11`
//
// Tệp DUY NHẤT trong repo biết tới `@anthropic-ai/claude-agent-sdk`. Đổi sang
// Messages API + Tool Runner là viết lại đúng tệp này, không đụng tệp khác.
//
// ⚠ `AD-AG-3`: không nhập gì từ tầng ①, ③, ④, ⑤ và không nhập client Prisma —
// KỂ CẢ `import type`. Máy chủ MCP đi vào qua `AgentDeps.crmMcpServer` dưới
// dạng giá trị mờ, đúng để lời nhập đó không tồn tại. `eslint` bác nếu ai thêm.
//
// ⚠ `AD-AG-8`: không đọc, không đặt, không xoá biến môi trường xác thực nào.
// Xác thực đi bằng đăng nhập subscription; đường lui khoá API đặt ở MÔI TRƯỜNG
// TIẾN TRÌNH CHA và tiến trình con thừa kế — không sửa một dòng mã nào ở đây.
//
// ⚠ Bốn chuỗi bị phép kiểm ranh giới cấm xuất hiện dưới `src/agent/**` — tên
// biến khoá API, tên client Prisma, lời gọi đọc biến môi trường, lời gọi đọc
// tệp — nên KHÔNG viết chúng ra kể cả trong chú thích: phép kiểm quét văn bản
// thô, nó không biết đâu là mã đâu là chú thích.

import { query } from "@anthropic-ai/claude-agent-sdk";
import type {
  McpServerConfig,
  Options,
  SDKResultMessage,
} from "@anthropic-ai/claude-agent-sdk";

import { buildSignalSchema } from "./schema";
import { SYSTEM_PROMPT, buildExtractionPrompt } from "./prompt";
import type {
  AgentDeps,
  ExtractionInput,
  ExtractionResult,
  SignalDraft,
} from "./types";

/// `AD-AG-4` — khoá máy chủ MCP khai ĐÚNG MỘT LẦN và dùng chung cho cả
/// `mcpServers` lẫn `allowedTools`.
///
/// ⚠ Đổi chuỗi này ở một chỗ mà quên chỗ kia là triệu chứng đã đo: agent TRÔNG
/// NHƯ gọi capability, handler chạy 0 lần, chi phí một lượt $1,607 thay vì
/// $0,091. Hai chỗ dùng chung một hằng số là cách duy nhất để không lệch được.
const MCP_SERVER_KEY = "crm";

/// `AD-AG-9` — thử lại vận chuyển ĐÚNG MỘT LẦN, chờ CỐ ĐỊNH 2 giây.
///
/// ⚠ Không cấp số nhân, không ngẫu nhiên hoá: `NFR-1` đo chu kỳ cuối-đến-đầu,
/// nên mỗi giây chờ trừ thẳng vào ngân sách thời gian của vòng quét.
const MAX_TRANSPORT_ATTEMPTS = 2;
const TRANSPORT_RETRY_DELAY_MS = 2_000;

/// `AD-AG-9` · `X2` — bốn subtype lỗi của SDK 0.3.232 về bốn `kind`.
/// `satisfies` là phép canh: SDK thêm subtype thứ năm thì đây là lỗi BIÊN DỊCH,
/// không phải một nhánh rơi vào mặc định trong im lặng (`FT9`).
const ERROR_SUBTYPE_TO_KIND = {
  error_max_structured_output_retries: "schema",
  error_max_turns: "turns",
  error_max_budget_usd: "budget",
  error_during_execution: "execution",
} as const satisfies Record<
  Exclude<SDKResultMessage["subtype"], "success">,
  "schema" | "turns" | "budget" | "execution"
>;

/// `AD-AG-1` — bề mặt công khai là MỘT hàm; mọi phụ thuộc tiêm vào qua `deps`.
/// `AD-AG-2` — MỘT Bản lưu là MỘT `query()`: không `resume`, không `continue`,
/// không `sessionId`, không gộp nhiều Bản lưu vào một lời nhắc.
/// `AD-AG-9` — hàm này KHÔNG NÉM. Mọi thất bại về `ok: false` kèm `kind`, để
/// bên gọi ghi được `ScanLogEntry` cho cả những lượt hỏng.
///
/// ⚠ Thứ tự tham số là `(input, deps)`, không phải `(deps, input)`.
export async function extractSignals(
  input: ExtractionInput,
  deps: AgentDeps,
): Promise<ExtractionResult> {
  /// `AD-1` đòi BỐN tuỳ chọn như một khối không tách rời, nên thiếu máy chủ MCP
  /// là hợp đồng chưa dựng được — hỏng ở đây, tường minh, với `modelCalls: 0`
  /// (đúng nhánh *"chưa kịp gọi"* của `AD-AG-10`), thay vì để tiến trình con
  /// chết vì một lý do khó đọc hơn.
  if (deps.crmMcpServer === null || deps.crmMcpServer === undefined) {
    return {
      ok: false,
      kind: "transport",
      subtype: "missing_mcp_server",
      modelCalls: 0,
      costUsd: null,
    };
  }

  const { jsonSchema, envelope } = buildSignalSchema(input.enums);
  const prompt = buildExtractionPrompt(input);
  const bridge = createAbortBridge(deps.abortSignal);

  let modelCalls = 0;
  let costUsd: number | null = null;

  try {
    const options = buildQueryOptions(jsonSchema, deps, bridge.controller);

    for (let attempt = 1; attempt <= MAX_TRANSPORT_ATTEMPTS; attempt += 1) {
      /// `AD-AG-10` — `NFR-2` đếm SỐ LẦN `query()`, không bao giờ đếm
      /// `num_turns`. Tăng TRƯỚC khi gọi: một lượt ném giữa chừng vẫn có thể
      /// đã tiêu token, nên đếm về phía an toàn của trần.
      modelCalls += 1;
      const outcome = await runOneQuery(prompt, options);
      costUsd = addCost(costUsd, outcome.costUsd);

      if (outcome.result !== null) {
        return classifyResult(outcome.result, envelope, modelCalls, costUsd);
      }

      /// Không có result nào ⇒ lớp VẬN CHUYỂN (`AD-AG-9`): tiến trình con không
      /// khởi động được, đứt mạng, `ENOENT`. Đây là lớp DUY NHẤT được thử lại.
      const canRetry =
        attempt < MAX_TRANSPORT_ATTEMPTS && !bridge.controller.signal.aborted;
      if (!canRetry) {
        return {
          ok: false,
          kind: "transport",
          subtype: outcome.failureName,
          modelCalls,
          costUsd,
        };
      }
      await delay(TRANSPORT_RETRY_DELAY_MS);
    }

    /// Không tới được: vòng trên luôn trả về ở lần lặp cuối. Giữ một nhánh trả
    /// về thay vì `throw` để lời hứa *"tầng ② không ném"* đúng theo kiểu, không
    /// chỉ đúng theo ý định.
    return {
      ok: false,
      kind: "transport",
      subtype: "unreachable",
      modelCalls,
      costUsd,
    };
  } finally {
    bridge.dispose();
  }
}

/// `AD-1` — BỐN tuỳ chọn là một khối KHÔNG TÁCH RỜI, cộng bốn cái ghim lượt
/// chạy của `AD-AG-8`. Đã đo: thiếu `allowedTools` + `permissionMode` thì
/// handler chạy 0 lần và chi phí gấp ~18 lần.
function buildQueryOptions(
  jsonSchema: Record<string, unknown>,
  deps: AgentDeps,
  controller: AbortController,
): Options {
  const options: Options = {
    /// ① Xoá sạch công cụ dựng sẵn — quan trọng nhất là KHÔNG còn `Bash`, thứ
    /// chạy được `psql`, tức một đường xuống Postgres đi vòng qua cả bốn tầng
    /// dưới, qua mặt sổ đăng ký, qua mặt Cổng, qua mặt ghi vết.
    tools: [],
    /// ② Capability của đội. `AD-AG-3`: đăng ký là LỚP PHÒNG THỦ và là chỗ để
    /// phép đối chứng phá hoại còn ý nghĩa — KHÔNG phải đường lấy dữ liệu. Kỳ
    /// vọng số lần gọi tool trong đường này là 0; gọi thật thì ghi `FT4`, không
    /// coi là lỗi vòng quét, không dừng.
    ///
    /// ⚠ Ép kiểu ở đây là CÓ CHỦ ĐÍCH: `AgentDeps.crmMcpServer` để `unknown` vì
    /// gõ chặt nó đòi nhập kiểu từ tầng ④, đúng thứ `AD-1` cấm. Ràng buộc thật
    /// (tên tool, không lộ trường danh tính) cưỡng chế bằng phép kiểm ở tầng ④.
    mcpServers: { [MCP_SERVER_KEY]: deps.crmMcpServer as McpServerConfig },
    /// ③ Tầng CẤP PHÉP, tách khỏi tầng hiện diện. Glob đã đo là có khớp.
    allowedTools: [`mcp__${MCP_SERVER_KEY}__*`],
    /// ④ `§4/nhóm 5` cấm vòng lặp dừng chờ ai ở bất kỳ bước nào.
    permissionMode: "dontAsk",

    /// `AD-AG-8` — ghim lượt chạy để nó không phụ thuộc máy người chạy.
    systemPrompt: SYSTEM_PROMPT,
    /// Mảng RỖNG: không nạp `CLAUDE.md`, settings hay hook nào từ đĩa. Thiếu
    /// dòng này thì hai người chạy cùng một Bản lưu ra hai kết quả, và cache
    /// `NFR-4` trúng chéo hai ngữ cảnh khác nhau.
    settingSources: [],
    /// Bí danh mô hình trôi theo thời gian; khoá cache thì không.
    model: deps.modelId,
    /// `AD-AG-10` — phanh phụ CHỐNG CHẠY LOẠN, không phải ngân sách. Nó đếm
    /// lượt hội thoại, còn trần 20 đếm `query()`. Hai bộ đếm khác đơn vị và
    /// KHÔNG BAO GIỜ so với nhau.
    maxTurns: deps.maxTurns,
    /// Trần cho MỘT `query()`. Chạm trần trả `error_max_budget_usd` ⇒ Bản lưu
    /// quá đắt (`FT10`), KHÔNG phải trần cả vòng quét — trần vòng là bộ đếm
    /// `cost_used_usd` của tầng ①.
    maxBudgetUsd: deps.maxBudgetUsd,
    /// `AD-AG-5` — đầu ra đi bằng `structured_output`, không bằng văn bản tự do.
    outputFormat: { type: "json_schema", schema: jsonSchema },
    abortController: controller,

    /// ⚠ TUYỆT ĐỐI KHÔNG truyền `env`. Bản TypeScript của SDK THAY THẾ toàn bộ
    /// môi trường tiến trình con chứ không hợp nhất — truyền nó là xoá `HOME`
    /// và `PATH`, tức xoá luôn đường đọc `~/.claude/.credentials.json`. Triệu
    /// chứng: *"đăng nhập subscription đột nhiên hỏng"*, đúng vào lúc đội đang
    /// thử đường lui API key (`AD-AG-8`).
  };

  /// `AD-AG-8` — `cwd` cố định để tiến trình con không đi lang thang theo nơi
  /// ai đó gõ lệnh. Tiêm qua `deps` chứ không đọc `process.cwd()`: `AD-AG-1`
  /// nói tầng ② không đọc gì từ máy. Vắng thì để SDK tự quyết — `settingSources`
  /// rỗng đã chặn phần lớn cái giá của việc đó.
  if (deps.cwd !== undefined) options.cwd = deps.cwd;

  return options;
}

/// `AD-AG-2` — tiêu thụ HẾT generator bằng `for await` BÊN TRONG `try/catch`,
/// và giữ lại result CUỐI CÙNG đã thấy trước khi ngoại lệ nổ.
///
/// ⚠ `query()` phát ra result lỗi RỒI MỚI ném. Bắt ngoại lệ ở ngoài vòng lặp mà
/// không giữ result thì mọi lượt hỏng mất sạch `total_cost_usd` và `num_turns`
/// — và phanh ngân sách `NFR-3` rò rỉ im lặng.
async function runOneQuery(
  prompt: string,
  options: Options,
): Promise<{
  result: SDKResultMessage | null;
  costUsd: number | null;
  failureName: string | null;
}> {
  let result: SDKResultMessage | null = null;
  let failureName: string | null = null;

  try {
    for await (const message of query({ prompt, options })) {
      if (message.type === "result") result = message;
    }
  } catch (error) {
    failureName = describeFailure(error);
  }

  return {
    result,
    costUsd: result === null ? null : readCost(result),
    failureName,
  };
}

/// `AD-AG-9` — ba lớp lỗi, ba cách xử; `AD-AG-11` — rỗng không phải lỗi.
function classifyResult(
  result: SDKResultMessage,
  envelope: { safeParse: (raw: unknown) => { success: boolean; data?: { signals: SignalDraft[] } } },
  modelCalls: number,
  costUsd: number | null,
): ExtractionResult {
  if (result.subtype !== "success") {
    /// Mọi subtype lỗi CÓ result: KHÔNG thử lại. Trả `kind` tương ứng kèm
    /// `subtype` NGUYÊN VĂN để tầng ① ánh xạ về năm điều kiện dừng của `AD-11`
    /// — luật ánh xạ thuộc tầng ①, không thuộc tầng ②.
    return {
      ok: false,
      kind: ERROR_SUBTYPE_TO_KIND[result.subtype],
      subtype: result.subtype,
      modelCalls,
      costUsd,
    };
  }

  /// `AD-AG-11` — từ chối nhận diện bằng CẤU TRÚC (`stop_reason === 'refusal'`),
  /// KHÔNG bằng so khớp chuỗi trong văn bản trả về, thứ đổi theo phiên bản mô
  /// hình và theo ngôn ngữ. Từ chối KHÔNG phải một trong năm `kind` lỗi: nó về
  /// nhánh `ok` với danh sách rỗng, và tầng ① thấy `stopReason` thì ghi `FT1`.
  /// Kiểm TRƯỚC khi phân tích: lượt từ chối thường không kèm `structured_output`
  /// nào, và không kiểm trước thì nó bị gán nhầm thành lỗi lược đồ.
  if (result.stop_reason === "refusal") {
    return {
      ok: true,
      signals: [],
      modelCalls,
      costUsd,
      numTurns: result.num_turns,
      stopReason: result.stop_reason,
    };
  }

  const parsed = envelope.safeParse(result.structured_output);
  if (!parsed.success || parsed.data === undefined) {
    /// Nhánh thứ tư của lớp LƯỢC ĐỒ, ngoài ba nhánh spine kể tên: SDK báo
    /// `success` nhưng `structured_output` không khớp lược đồ đội gửi đi. Xử
    /// như `FT5` và KHÔNG thử lại — thử lại một lược đồ sai là đốt trần 20 để
    /// nhận cùng một câu trả lời.
    return {
      ok: false,
      kind: "schema",
      subtype: "structured_output_parse_failed",
      modelCalls,
      costUsd,
    };
  }

  /// `AD-AG-11` — `signals: []` với lược đồ hợp lệ là CÂU TRẢ LỜI ĐÚNG: đi
  /// tiếp, không thử lại, không đánh mã lỗi.
  return {
    ok: true,
    signals: parsed.data.signals,
    modelCalls,
    costUsd,
    numTurns: result.num_turns,
    stopReason: result.stop_reason,
  };
}

/// `AD-AG-10` — `costUsd` là `number | null`. `null` nghĩa là KHÔNG ĐO ĐƯỢC, và
/// không bao giờ trả `0` thay cho nó.
///
/// ⚠ Lượt lỗi có thể trả mọi trường chi phí bằng 0 (spine cha ghi rõ cho
/// `error_during_execution`, tài liệu SDK ghi thêm cho result lúc sập/lỗi khởi
/// động). Cộng số 0 đó vào bộ đếm là làm phanh ngân sách `NFR-3` rò rỉ IM LẶNG.
function readCost(result: SDKResultMessage): number | null {
  const raw = result.total_cost_usd;
  if (typeof raw !== "number" || !Number.isFinite(raw)) return null;
  if (result.subtype !== "success" && raw === 0) return null;
  return raw;
}

/// Cộng dồn qua hai lần thử của `AD-AG-9`: cả hai lần đều có thể đã tiêu token.
/// `null + số` ra số; `null + null` vẫn là `null` — *không đo được* không bao
/// giờ tự biến thành `0`.
function addCost(acc: number | null, next: number | null): number | null {
  if (next === null) return acc;
  return (acc ?? 0) + next;
}

/// `AgentDeps` cấp `abortSignal`, còn SDK nhận `abortController`. Bắc cầu, và
/// GỠ listener ở `finally` — không gỡ thì mỗi Bản lưu để lại một listener trên
/// signal dùng chung của cả vòng quét, và Node cảnh báo rò rỉ ở Công ty thứ 11.
function createAbortBridge(signal: AbortSignal | undefined): {
  controller: AbortController;
  dispose: () => void;
} {
  const controller = new AbortController();
  if (signal === undefined) return { controller, dispose: () => {} };
  if (signal.aborted) {
    controller.abort();
    return { controller, dispose: () => {} };
  }
  const onAbort = () => controller.abort();
  signal.addEventListener("abort", onAbort, { once: true });
  return {
    controller,
    dispose: () => signal.removeEventListener("abort", onAbort),
  };
}

/// Tên lỗi vận chuyển ghi vào `subtype` để Nhật ký vòng quét phân biệt được
/// `AbortError` với `ENOENT`. Chỉ lấy TÊN, không lấy `message`: thông điệp lỗi
/// có thể mang đường dẫn máy người chạy, và nó đi thẳng vào cơ sở dữ liệu.
function describeFailure(error: unknown): string {
  if (error instanceof Error && error.name.length > 0) return error.name;
  return "unknown_transport_error";
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
