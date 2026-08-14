// `AD-15` — NƠI DUY NHẤT trong mã của đội đọc `process.env`.
//
// Phát biểu có phạm vi *"trong mã của đội"* vì hai phụ thuộc tự đọc môi trường
// và đội không đổi được: Prisma đọc qua `prisma.config.ts`, Next.js đọc
// `NEXT_PUBLIC_*` lúc build. Một bất biến tuyệt đối có ngoại lệ sẵn thì sẽ bị
// vi phạm rồi bị bỏ qua — nên nó được khai đúng phạm vi cưỡng chế được.
//
// Đúng BA tệp toàn repo đọc `process.env`:
//   · tệp này          — bí mật và địa chỉ hạ tầng
//   · instrumentation.ts — đúng một biến, `NEXT_RUNTIME`
//   · prisma.config.ts   — `DATABASE_URL`, không phải lựa chọn của đội
//
// ⚠ KHÔNG thêm tham số nghiệp vụ vào đây. Ngưỡng, trần, chu kỳ đều nằm ở bảng
// `settings` và sửa được lúc chạy (`D38`). Ngoại lệ duy nhất là chu kỳ vòng
// quét, do `§7.3` của đề bài ép — env là GIÁ TRỊ KHỞI TẠO, `settings` ghi đè.

function required(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(
      `Thiếu biến môi trường \`${name}\`. Chép \`.env.example\` thành \`.env\`.`,
    );
  }
  return v;
}

export function getDatabaseUrl(): string {
  // `tests/` trỏ sang database riêng để `npm test` không đụng dữ liệu demo
  return process.env.TEST_DATABASE_URL && process.env.NODE_ENV === "test"
    ? process.env.TEST_DATABASE_URL
    : required("DATABASE_URL");
}

/// `AD-AG-8`: ĐỂ TRỐNG là có chủ đích — Agent SDK khi đó dùng credential
/// subscription ở `~/.claude`. Điền khoá vào `.env` là TOÀN BỘ việc phải làm
/// nếu đường subscription hỏng; không sửa một dòng mã nào.
export function getAnthropicApiKey(): string | undefined {
  return process.env.ANTHROPIC_API_KEY || undefined;
}

/// Giá trị KHỞI TẠO của chu kỳ vòng quét. Bảng `settings` ghi đè lúc chạy.
export function getScanIntervalMinutesSeed(): number {
  const raw = process.env.SCAN_INTERVAL_MINUTES;
  const n = raw ? Number(raw) : 1;
  return Number.isFinite(n) && n > 0 ? n : 1;
}

/// `AD-15` — tham số HẠ TẦNG của tầng ②, đọc từ môi trường.
///
/// Chúng ở đây chứ không ở bảng `settings` vì chúng không phải tham số nghiệp
/// vụ: Quản trị không chỉnh model id giữa buổi chấm, và một model id sai trong
/// `settings` làm vòng quét chết lúc chạy chứ không lúc khởi động. Ngưỡng và
/// trần nghiệp vụ vẫn ở `settings` (`D38`).
///
/// ⚠ `maxBudgetUsd` ở đây là trần cho MỘT lời gọi `query()`, KHÔNG phải trần cả
/// vòng quét. Trần vòng quét là bộ đếm `cost_used_usd` trên hàng `ScanLog`
/// (`AD-11`). Nhầm hai thứ này làm phanh ngân sách không bao giờ chạm.
export function getAgentConfig(): {
  modelId: string;
  maxTurns: number;
  maxBudgetUsd: number;
} {
  return {
    modelId: process.env.AGENT_MODEL_ID || "claude-sonnet-5",
    maxTurns: soDuong(process.env.AGENT_MAX_TURNS, 8),
    maxBudgetUsd: soDuong(process.env.AGENT_MAX_BUDGET_USD, 0.5),
  };
}

function soDuong(raw: string | undefined, macDinh: number): number {
  const n = raw ? Number(raw) : macDinh;
  return Number.isFinite(n) && n > 0 ? n : macDinh;
}
