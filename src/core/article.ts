// `AD-18` · `AD-CP-6` — đọc Bản lưu và từ vựng enum.
//
// Ba hàm ở đây phục vụ hạng ĐỌC-CHUNG của `AD-2`, tức tập mà `mcp-server.ts`
// phơi cho tầng ②. Chúng chỉ đọc, và `AD-CP-6` nói rõ vì sao tập đó tồn tại:
// nó là **lớp phòng thủ** và là đối tượng của phép đối chứng phá hoại, KHÔNG
// phải đường lấy dữ liệu — `AD-AG-3` chốt agent không gọi capability nào.
//
// Phơi rỗng đã bị loại: khi đó `allowedTools: ["mcp__crm__*"]` khớp rỗng, và
// phép đo nghiệm thu của `AD-1` mất đối tượng. Triệu chứng đã đo một lần:
// agent *trông như* gọi capability, handler chạy **0 lần**, $1,607 một lượt.

import { db } from "./db";

export type ArticleView = {
  id: string;
  accountId: string;
  /// Bản ĐÃ CHUẨN HOÁ. `AD-18` chốt đây là chuỗi mà `quote_start`/`quote_end`
  /// đánh chỉ số vào, nên tầng ② phải nhận đúng nó — không phải `rawText`.
  normalizedText: string;
  normalizerVersion: number;
  readable: boolean;
};

export async function readArticle(id: string): Promise<ArticleView | null> {
  return db.article.findUnique({
    where: { id },
    select: {
      id: true,
      accountId: true,
      normalizedText: true,
      normalizerVersion: true,
      readable: true,
    },
  });
}

/// `AD-7` — Loại công ty là MỘT trong đúng ba thứ được ra biên.
///
/// `FR-13` là lý do nó ra biên: cùng một câu trích, hai Loại công ty phải cho
/// hai câu nhận định khác nhau. Đó là điểm khác biệt lớn nhất của nhóm 2, và
/// không có trường này thì mô hình không có gì để phân biệt.
export async function readAccountType(accountId: string): Promise<string | null> {
  const row = await db.account.findUnique({
    where: { id: accountId },
    select: { accountType: true },
  });
  return row?.accountType ?? null;
}

/// `AD-AG-6` — enum vào tầng ② bằng DỮ LIỆU, không bằng lời nhập.
///
/// Tầng ② không được nhập `@prisma/client` (`AD-AG-3`), nên nó không tự biết
/// enum nào có giá trị gì. Danh sách đi vào qua tham số, và đây là nguồn.
///
/// ⚠ Khai TAY, không sinh từ Prisma lúc chạy. Prisma không phơi giá trị enum
/// dưới dạng dữ liệu ở runtime cho mọi phiên bản, và một hàm sinh động sẽ hỏng
/// im lặng thành danh sách rỗng — khi đó `BR-D10` mất hiệu lực vì mô hình được
/// bảo *"chọn trong danh sách"* mà danh sách trống. Phép kiểm đối chiếu bốn
/// mảng này với lược đồ.
export const SIGNAL_ENUMS = {
  signalType: [
    "funding", "leadership", "expansion", "hiring", "new_business", "other",
  ],
  signalSubtype: [
    "rfp", "partnership", "compliance", "m_and_a", "roadmap_delay",
    "dx_initiative", "certification", "downturn", "legacy_modernization",
    "ai_signal", "remote_team", "event", "unclassified",
  ],
  confidence: ["chac", "co_the", "doan"],
  relevance: ["high", "medium", "low"],
} as const;

export function listEnums(): {
  signalType: readonly string[];
  signalSubtype: readonly string[];
  confidence: readonly string[];
  relevance: readonly string[];
} {
  return SIGNAL_ENUMS;
}
