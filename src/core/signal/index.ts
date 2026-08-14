// `C5-9` · `C5-10` · `BR-D1` · `BR-D2` — Phát hiện.
//
// Phát hiện là BẰNG CHỨNG: không xoá theo cascade của Công ty, và `NFR-17`
// cấm máy xoá. Câu trích phải khớp NGUYÊN VĂN một đoạn của Bản lưu sau
// chuẩn hoá; không khớp thì LOẠI và ghi nhật ký, không lưu kèm cảnh báo.

import type { Actor } from "@/core/actor";
/// `AD-CR-7`: lõi TỰ mở giao dịch, nên không nhận `tx` từ ngoài.
import { tx } from "@/core/db";
import type { CoreContext } from "@/core/context";
import { BusinessRuleError } from "@/core/errors";
import { findQuote } from "@/core/normalize";

const CHUA = "chưa hiện thực";

/// Mọi trường NOT NULL của bảng `signal` đều phải có mặt ở đây, nếu không
/// `createSignal` không ghi nổi một hàng hợp lệ. Bản trước thiếu `accountId`,
/// `quoteStart`, `quoteEnd` — cả ba NOT NULL — và thừa `eventDate` vốn không
/// có cột nào chứa.
export type CreateSignalInput = {
  /// NOT NULL và KHÔNG suy ngầm từ `articleId`: `BR-D3` nói Phát hiện thừa kế
  /// Công ty từ Bản lưu sinh ra nó, nên bên gọi phải nêu rõ và lõi đối chiếu.
  accountId: string;
  articleId: string;
  claim: string;
  /// `BR-D1` — thiếu là Phát hiện KHÔNG TỒN TẠI. Từ chối ở tầng nghiệp vụ, kể
  /// cả khi ghi thẳng không qua giao diện (`T-2`).
  quote: string;
  /// `AD-18` — khoảng vị trí LƯU SẴN, không tính lại lúc hiển thị. Cả hai NOT
  /// NULL, không `@default`. Nguồn là `findQuote` của `@/core/normalize`, và
  /// offset tính trên bản đã chuẩn hoá theo `NORMALIZER_VERSION` nào thì
  /// `article.normalizer_version` phải khớp cái đó.
  quoteStart: number;
  quoteEnd: number;
  /// Enum ĐÓNG, khớp từng chữ `enum SignalType`/`Confidence`/`Relevance`.
  signalType:
    | "funding" | "leadership" | "expansion" | "hiring" | "new_business" | "other";
  /// `CHECK signal_subtype_only_other` — CHỈ khác `null` khi `signalType` là
  /// `other`. Kiểu hiện chưa canh được điều đó; xem `deferred-work.md`.
  signalSubtype: string | null;
  confidence: "chac" | "co_the" | "doan";
  /// `BR-D6` — suy từ Loại tin và `signalSubtype`; mô hình lệch tối đa một bậc
  /// kèm một câu lý do.
  relevance: "high" | "medium" | "low";
  /// `BR-D7` — NGÀY SỰ KIỆN, đầu vào của phép tính hạn. `null` khi mô hình không
  /// đọc được; khi đó `D5` bảo lui về ngày Bản lưu.
  ///
  /// ✅ Chốt 14/8: LƯU thành cột `signal.event_date`, không tính hạn một lần rồi
  /// bỏ. Lý do: `BR-D8` định nghĩa *"cùng lúc"* là **mọi tin còn trong cửa sổ cơ
  /// hội của nó** — một tin cũ tới sau cần so ngày sự kiện của những tin trước,
  /// và không lưu thì dữ kiện đó đã mất.
  eventDate: Date | null;
};

/// `BR-D1` · `BR-D2` · `T-2` — hai lớp chặn, và cả hai ở TẦNG NGHIỆP VỤ.
///
/// `T-2` nói nguyên văn *"Thử ghi thẳng, phải bị từ chối"*. Nghĩa là chặn phải
/// nằm ở đây, không ở lược đồ Zod của tầng ④ và không ở giao diện — một lời gọi
/// bỏ qua cả hai vẫn phải hỏng.
///
/// Lớp ① `BR-D1`: không có câu trích thì Phát hiện KHÔNG TỒN TẠI. Chuỗi rỗng và
/// chuỗi chỉ có khoảng trắng đều tính là không có — `NOT NULL` của cột không
/// bắt được hai thứ đó.
///
/// Lớp ② `BR-D2`: câu trích phải KHỚP NGUYÊN VĂN một đoạn của Bản lưu. So trên
/// bản đã chuẩn hoá, vì đó là bản mà `quote_start`/`quote_end` đánh chỉ số vào
/// (`AD-18`). Không khớp thì LOẠI, không lưu kèm cờ cảnh báo: một Phát hiện có
/// câu trích không tra được là thứ `T-3` sẽ mở ra một khoảng trống.
export async function createSignal(
  _actor: Actor,
  input: CreateSignalInput,
  ctx: CoreContext,
): Promise<{ id: string }> {
  // `BR-D1` — trước cả khi chạm cơ sở dữ liệu.
  if (input.quote.trim().length === 0) {
    throw new BusinessRuleError(
      "BR-D1",
      "Phát hiện không có câu trích thì không tồn tại.",
    );
  }

  return tx(async (t) => {
    const article = await t.article.findUnique({
      where: { id: input.articleId },
      select: { accountId: true, normalizedText: true, normalizerVersion: true },
    });
    if (!article) {
      throw new BusinessRuleError("BR-D2", "Bản lưu không tồn tại.");
    }

    // `BR-D3` — Phát hiện thừa kế Công ty TỪ Bản lưu. Bên gọi vẫn phải nêu rõ
    // `accountId`, và lõi đối chiếu: hai giá trị lệch nhau nghĩa là bên gọi
    // đang gán một Phát hiện sang Công ty khác, và đó là chuyện phải hỏng ồn ào.
    if (article.accountId !== input.accountId) {
      throw new BusinessRuleError(
        "BR-D3",
        "Phát hiện phải thuộc đúng Công ty của Bản lưu sinh ra nó.",
      );
    }

    // `BR-D2` — khớp nguyên văn. `findQuote` tự chuẩn hoá câu trích trước khi
    // tìm, nên khác biệt về khoảng trắng không làm hỏng một câu trích đúng.
    const at = findQuote(article.normalizedText, input.quote);
    if (!at) {
      throw new BusinessRuleError(
        "BR-D2",
        "Câu trích không khớp nguyên văn một đoạn nào của Bản lưu.",
      );
    }

    // ⚠ Bỏ qua `input.quoteStart`/`quoteEnd` do bên gọi đưa, dùng giá trị VỪA
    // TÍNH. Tin bên gọi ở đây là mở một đường để `T-3` mở sai đoạn: mô hình có
    // thể trả offset đúng định dạng mà lệch vị trí, và không lớp nào bắt được.
    const s = await t.signal.create({
      data: {
        accountId: input.accountId,
        articleId: input.articleId,
        claim: input.claim,
        quote: input.quote,
        quoteStart: at.start,
        quoteEnd: at.end,
        signalType: input.signalType,
        signalSubtype: input.signalSubtype,
        confidence: input.confidence,
        relevance: input.relevance,
        eventDate: input.eventDate,
      },
      select: { id: true },
    });
    await ctx.audit.complete(t, ctx.auditId, "ok", { after: { id: s.id } });
    return { id: s.id };
  });
}

/// `FR-42` — nút *không hữu ích*, một trong hai đường vào `errorDetectionRate`.
export function markSignalUnhelpful(_actor: Actor, _id: string, _ctx: CoreContext): Promise<void> {
  throw new Error(CHUA);
}
