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

import type { Actor } from "./actor";
import type { CoreContext } from "./context";
import { db, tx } from "./db";
import { BusinessRuleError } from "./errors";
import { normalize, NORMALIZER_VERSION } from "./normalize";

/// ⚠ HAI HÌNH DẠNG, chọn bằng `scope`, và đó không phải tiện nghi.
///
/// Bản đầu của tệp này khai `readArticle(id)` — một Bản lưu theo khoá chính.
/// Không tầng ① nào gọi như thế: `src/scan/loop.ts` gọi
/// `{accountId, scope:"latest"}` để lấy Bản lưu mới nhất của một Công ty, và
/// `src/ingest` gọi `{accountId, scope:"all"}` để lấy dấu vân của **mọi** Bản
/// lưu cho `FR-50`. Zod bác cả hai, mỗi Công ty ăn một `FT10`, ba lần liên tiếp
/// chạm `max_consecutive_denials`, và vòng quét chết trước khi tới mô hình.
///
/// Triệu chứng đắt ở chỗ nó KHÔNG giống lỗi hợp đồng: nhật ký in *"quét 0/0
/// Công ty"*, tức trông như không có Công ty nào để quét.
export type ArticleScope = "latest" | "all";

/// `scope: "latest"` — thứ `src/scan/_contract.ts` phân tích.
export type LatestArticleView = {
  id: string;
  snapshotId: string;
  version: string;
  contentHash: string;
  /// Bản ĐÃ CHUẨN HOÁ. `AD-18` chốt đây là chuỗi mà `quote_start`/`quote_end`
  /// đánh chỉ số vào, nên tầng ② phải nhận đúng nó — không phải `rawText`.
  normalizedText: string;
  readable: boolean;
  unreadableReason: string | null;
  /// `FR-36` — số Phát hiện đã gắn. Vòng quét đọc nó để biết Bản lưu này đã
  /// được rút chưa, và bỏ qua nếu rồi.
  signalCount: number;
};

/// `scope: "all"` — dấu vân của mọi Bản lưu, phục vụ `FR-50`.
///
/// KHÔNG kèm `normalizedText`. Một Công ty có thể có hàng chục Bản lưu, và
/// `src/ingest` chỉ cần dấu vân để so; kéo cả nội dung là đọc thừa vài trăm KB
/// mỗi lượt cho một phép so chuỗi 64 ký tự.
export type ArticleFingerprintView = {
  id: string;
  snapshotId: string;
  version: string;
  contentHash: string;
  capturedAt: string;
};

export async function readArticleLatest(
  accountId: string,
): Promise<LatestArticleView | null> {
  const row = await db.article.findFirst({
    where: { accountId, deletedAt: null },
    // Mới nhất theo NGÀY CHỤP, không theo `created_at`: `src/ingest` nạp được
    // một Bản chụp cũ sau một Bản chụp mới, và `T-6` dựng đúng tình huống đó
    // khi đổi Công ty sang phiên bản *sau*.
    orderBy: [{ snapshot: { capturedAt: "desc" } }, { createdAt: "desc" }],
    select: {
      id: true,
      snapshotId: true,
      contentHash: true,
      normalizedText: true,
      readable: true,
      unreadableReason: true,
      snapshot: { select: { version: true } },
      _count: { select: { signals: true } },
    },
  });
  if (row === null) return null;
  return {
    id: row.id,
    snapshotId: row.snapshotId,
    version: row.snapshot.version,
    contentHash: row.contentHash,
    normalizedText: row.normalizedText,
    readable: row.readable,
    unreadableReason: row.unreadableReason,
    signalCount: row._count.signals,
  };
}

export async function listArticleFingerprints(
  accountId: string,
): Promise<ArticleFingerprintView[]> {
  const rows = await db.article.findMany({
    where: { accountId, deletedAt: null },
    orderBy: { snapshot: { capturedAt: "asc" } },
    select: {
      id: true,
      snapshotId: true,
      contentHash: true,
      snapshot: { select: { version: true, capturedAt: true } },
    },
  });
  return rows.map((r) => ({
    id: r.id,
    snapshotId: r.snapshotId,
    version: r.snapshot.version,
    contentHash: r.contentHash,
    // ISO chứ không `Date`. Ranh giới tầng ④→① đi qua JSON (`AD-CP-6` bọc kết
    // quả bằng `JSON.stringify`), nên một `Date` tới nơi đã là chuỗi — khai
    // chuỗi ngay ở đây thì kiểu nói đúng thứ bên kia nhận.
    capturedAt: r.snapshot.capturedAt.toISOString(),
  }));
}

export type CreateArticleInput = {
  accountId: string;
  snapshotVersion: string;
  capturedAt: string;
  rawText: string;
  /// Dấu vân NỘP KÈM, lõi không tự tính. `src/ingest` đã tính nó để quyết định
  /// có tạo hay không (`decideCreateSnapshot`), và tính lại ở đây bằng một hàm
  /// khác là mở đường cho hai giá trị lệch nhau trên cùng một nội dung.
  contentHash: string;
  publishedUrl: string | null;
  readable: boolean;
  unreadableReason: string | null;
};

export type CreateArticleResult = {
  articleId: string;
  snapshotId: string;
  created: boolean;
};

/// `FR-50` — lõi có tiếng nói CUỐI về trùng lặp.
///
/// `src/ingest` đã so dấu vân trước khi gọi, nhưng nó đọc ở một thời điểm
/// trước. Hai lượt nạp chạy sát nhau cùng thấy *"chưa có"* và cùng tạo. Lõi so
/// lại **trong cùng giao dịch** (`AD-CR-7`), nên nó thấy cuộc đua mà bên gọi
/// không thấy — và `created: false` là câu trả lời đúng, không phải lỗi.
export async function createArticle(
  _actor: Actor,
  input: CreateArticleInput,
  ctx: CoreContext,
): Promise<CreateArticleResult> {
  if (input.rawText.trim().length === 0) {
    throw new BusinessRuleError(
      "BR-D2",
      "Bản lưu không có nội dung thì không neo được câu trích nào.",
    );
  }

  return tx(async (t) => {
    const trung = await t.article.findFirst({
      where: {
        accountId: input.accountId,
        contentHash: input.contentHash,
        deletedAt: null,
      },
      select: { id: true, snapshotId: true },
    });
    if (trung !== null) {
      return { articleId: trung.id, snapshotId: trung.snapshotId, created: false };
    }

    const snapshot = await t.snapshot.create({
      data: {
        accountId: input.accountId,
        version: input.snapshotVersion,
        capturedAt: new Date(input.capturedAt),
      },
      select: { id: true },
    });

    const article = await t.article.create({
      data: {
        accountId: input.accountId,
        snapshotId: snapshot.id,
        rawText: input.rawText,
        // `AD-18` — chuẩn hoá MỘT LẦN lúc ghi, và ghi kèm phiên bản hàm đã
        // dùng. Chuẩn hoá lúc đọc thì đổi hàm là mọi offset đã lưu trỏ sai mà
        // không có gì báo.
        normalizedText: normalize(input.rawText),
        normalizerVersion: NORMALIZER_VERSION,
        publishedUrl: input.publishedUrl,
        readAt: new Date(),
        readable: input.readable,
        unreadableReason: input.unreadableReason,
        contentHash: input.contentHash,
      },
      select: { id: true },
    });

    await ctx.audit.complete(t, ctx.auditId, "ok", {
      after: {
        id: article.id,
        snapshotId: snapshot.id,
        version: input.snapshotVersion,
        contentHash: input.contentHash,
        readable: input.readable,
      },
    });

    return { articleId: article.id, snapshotId: snapshot.id, created: true };
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
