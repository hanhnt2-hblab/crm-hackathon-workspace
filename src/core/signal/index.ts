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

/// Từ vựng ĐÓNG. `SignalType` và `Relevance` khai ở ontology §8 và ở `0.1.4` /
/// `0.1.6` của Mục 0; `AD-CR-2` (hàng `BR-D10`) là chỗ chốt rằng chúng thành
/// kiểu enum Postgres. Khai lại ở đây thay vì nhập từ `@prisma/client` để khối
/// thuần `BR-D6` bên dưới kiểm được mà không cần `prisma generate` đã chạy —
/// cùng lý do `nextaction` khai lại `DueSignalType`.
export type SignalTypeValue =
  | "funding" | "leadership" | "expansion" | "hiring" | "new_business" | "other";
export type RelevanceValue = "high" | "medium" | "low";

/// `0.1.5` — 13 giá trị, ĐÓNG. Khai thành union chứ không `string`: với
/// `Record<string, …>` thì một subtype gõ sai vẫn biên dịch và lặng lẽ rơi về
/// giá trị lui, còn union làm *"thêm subtype mà quên bảng"* thành lỗi biên dịch.
export type SignalSubtypeValue =
  | "rfp" | "partnership" | "compliance" | "m_and_a"
  | "roadmap_delay" | "dx_initiative" | "certification" | "downturn"
  | "legacy_modernization" | "ai_signal"
  | "remote_team" | "event" | "unclassified";

// ───────────────────────────────────────────────────────────────────────────
// `BR-D6` · `AD-CR-2` — suy Độ liên quan. HÀM THUẦN, không chạm CSDL.
// ───────────────────────────────────────────────────────────────────────────
//
// ✅ CHỐT 14/8, và nó là điểm chịu lực của cả khối này:
//    **LÕI LÀ NGUỒN SỰ THẬT. Giá trị mô hình trả về chỉ dùng để CANH, không
//    bao giờ dùng để lưu.** Mô hình KHÔNG nâng hạ được một bậc nào.
//
// ⚠ TRIỆU CHỨNG ĐÃ ĐO: trên lượt gọi mô hình thật, **5/5 Phát hiện trả
// `relevance: high`**. Đó là lý do của chốt trên. `BR-D5`/`D4` định nghĩa *đáng
// chú ý* = `relevance = high` cộng mức `chac`/`co_the`, và `D45`/`FR-18` chốt
// Phát hiện `low` **không** vào hàng đợi gợi ý — nên khi mọi Phát hiện đều
// `high`, cả hai bộ lọc ấy chết cùng lúc: mọi tin đều tự đặt Việc tiếp theo và
// hàng đợi gợi ý nhận tất cả. Mọi phương án để mô hình LÀM NGUỒN, kể cả phương
// án *"lệch một bậc kèm lý do"* của `0.1.6`, đều giữ nguyên triệu chứng đó, vì
// mô hình vẫn là bên phát biểu con số.
//
// `AD-CR-2` xếp `BR-D6` vào ô *"Kiểm ở lõi: có"* và chốt ba điều, cả ba giữ:
//   · lệch quá một bậc thì KHÔNG loại Phát hiện — Phát hiện là bằng chứng
//   · ghi nhật ký (xem `RelevanceCheck.deviation` và ghi chú về mã `F1` bên dưới)
//   · **KHÔNG có mã lỗi** — `BR-D5` và `BR-D6` không bao giờ từ chối gì
// Nên không hàm nào dưới đây ném.

/// `0.1.4` Mục 0 — sáu loại tin, cột *`relevance` mặc định (`D3`)*.
///
/// ⚠ ĐÂY LÀ ĐOÁN CÓ CƠ SỞ, KHÔNG PHẢI MỘT DÒNG ĐÃ CHỐT. Cột *`relevance` mặc
/// định* của `0.1.4` là do ĐỘI tự dựng khi phân tích (`D3`: *"đội thêm"*), không
/// phải một phát biểu của đề bài, và không có dòng chốt nào của Ban tổ chức phía
/// sau nó. Đội đã quyết KHÔNG hỏi giám khảo, nên bảng này chạy thẳng vào buổi
/// chấm. Cơ sở từng ô, đủ để người khác phản biện:
///
///   · `funding`, `leadership`, `expansion`, `hiring` → `high`.
///     `§2` của đề bài gọi đúng bốn cái này là bốn tín hiệu kinh điển của
///     playbook, và định nghĩa vận hành của `high` ở `0.1.6` là *"có khả năng
///     tạo nhu cầu nhân lực hoặc dự án IT trong 3 tháng tới"*. Bốn tín hiệu đó
///     là bốn thứ playbook dùng để mở lời ngay. PHẢN BIỆN ĐƯỢC: `hiring` có thể
///     là tuyển thay người nghỉ, không sinh nhu cầu nào.
///   · `new_business` → `medium`. Một mảng kinh doanh mới có thể mất hơn ba
///     tháng mới thành nhu cầu IT, nên nó không đạt định nghĩa `high`.
///     PHẢN BIỆN ĐƯỢC: mảng mới ở công ty `it_product` thường kèm dự án ngay.
///   · `other` → không có giá trị riêng, suy tiếp theo `signal_subtype`.
const RELEVANCE_BY_TYPE: Record<SignalTypeValue, RelevanceValue | null> = {
  funding: "high",
  leadership: "high",
  expansion: "high",
  hiring: "high",
  new_business: "medium",
  // `null` = *"theo `signal_subtype`"*, không phải *"không biết"*.
  other: null,
};

/// `0.1.5` Mục 0 — 13 `signal_subtype`, chỉ áp khi `signal_type = other` (`D2`,
/// `CHECK signal_subtype_only_other`).
///
/// ⚠ CÙNG MỘT MỨC ĐỘ ĐOÁN như bảng trên, và `0.1.5` còn tự nhận là *"đội
/// thêm"*. Cơ sở gom theo ba nhóm, mỗi nhóm một câu kiểm chứng được:
///
///   · `high` — có **bằng chứng mua hàng** hoặc một **deadline cứng** trong ba
///     tháng: `rfp` (đang chọn nhà cung cấp), `partnership` (MOU tư vấn DX là
///     bước ngay trước triển khai), `compliance` (deadline tuân thủ không dời
///     được), `m_and_a` (sau sáp nhập luôn có dự án hợp nhất hệ thống).
///   · `medium` — có tín hiệu nhưng **chưa có mốc thời gian**: `roadmap_delay`,
///     `dx_initiative`, `certification`, `downturn`, `legacy_modernization`,
///     `ai_signal`. Chúng nói *công ty đang động*, không nói *bao giờ mua*.
///   · `low` — **chỉ để biết**: `remote_team`, `event`, `unclassified`.
///
/// PHẢN BIỆN ĐƯỢC rõ nhất ở `downturn`: cắt giảm là tín hiệu ÂM, và xếp nó cùng
/// bậc với `dx_initiative` là gộp *"đang đầu tư"* với *"đang co lại"* làm một.
const RELEVANCE_BY_SUBTYPE: Record<SignalSubtypeValue, RelevanceValue> = {
  rfp: "high",
  partnership: "high",
  compliance: "high",
  m_and_a: "high",
  roadmap_delay: "medium",
  dx_initiative: "medium",
  certification: "medium",
  downturn: "medium",
  legacy_modernization: "medium",
  ai_signal: "medium",
  remote_team: "low",
  event: "low",
  unclassified: "low",
};

/// ⚠ Ô ĐOÁN NẶNG NHẤT: `signal_type = other` mà `signal_subtype` là `null` hoặc
/// ngoài 13 giá trị. Mục 0 không có dòng nào cho ô này.
///
/// Chọn `low`, cùng bậc với `unclassified` — vì đó chính là tình trạng của nó:
/// chưa phân loại. Chọn `high` hay `medium` là để một tin không ai đọc nổi đi
/// thẳng vào hàng đợi gợi ý, và `0.1.5` nói `unclassified` tồn tại *"để không
/// bịa"*. PHẢN BIỆN ĐƯỢC: nó biến mọi thất bại phân loại của mô hình thành một
/// Phát hiện im lặng, nên một mô hình hỏng sẽ trông giống một ngày ít tin.
const RELEVANCE_FALLBACK: RelevanceValue = "low";

/// `BR-D6` — bậc thang để đo *"lệch tối đa một bậc"*. `0.1.6` xếp ba giá trị
/// theo đúng thứ tự này, và không có bậc thứ tư.
const RELEVANCE_RANK: Record<RelevanceValue, number> = { low: 0, medium: 1, high: 2 };

/// `BR-D6` · `0.1.4` · `0.1.5` — Độ liên quan CỦA MỘT PHÁT HIỆN.
///
/// Sau chốt 14/8 đây không còn là *"giá trị mặc định"* — nó là GIÁ TRỊ. Thuần:
/// cùng đầu vào cho cùng đầu ra, không đọc CSDL, không đọc đồng hồ, không ném.
///
/// `Object.hasOwn` chứ không `?? RELEVANCE_FALLBACK`: `signalSubtype` là chuỗi
/// do mô hình sinh, và `"constructor"` hay `"toString"` tra trên một object
/// literal trả về một hàm chứ không `undefined` — `??` không bao giờ chạy, và
/// một hàm được trả về làm Độ liên quan.
export function deriveRelevance(
  signalType: SignalTypeValue,
  signalSubtype: string | null,
): RelevanceValue {
  if (!Object.hasOwn(RELEVANCE_BY_TYPE, signalType)) return RELEVANCE_FALLBACK;
  const byType = RELEVANCE_BY_TYPE[signalType];
  if (byType !== null) return byType;
  if (signalSubtype === null) return RELEVANCE_FALLBACK;
  if (!Object.hasOwn(RELEVANCE_BY_SUBTYPE, signalSubtype)) return RELEVANCE_FALLBACK;
  return RELEVANCE_BY_SUBTYPE[signalSubtype as SignalSubtypeValue];
}

export type CheckRelevanceInput = {
  signalType: SignalTypeValue;
  signalSubtype: string | null;
  /// Giá trị mô hình trả về. `null` khi mô hình không nói gì. CHỈ ĐỂ SO — nó
  /// không đi vào `relevance` dưới bất kỳ nhánh nào.
  modelRelevance: RelevanceValue | null;
  /// `0.1.6` — câu lý do mô hình kèm theo khi nó lệch. Giữ lại để ghi nhật ký,
  /// KHÔNG dùng để quyết. Sau chốt 14/8 không lý do nào đổi được giá trị.
  modelReason: string | null;
};

export type RelevanceCheck = {
  /// Giá trị ĐEM LƯU. Luôn là giá trị lõi suy ra, mọi nhánh.
  relevance: RelevanceValue;
  /// Mô hình lệch bao nhiêu bậc so với lõi. `0` khi trùng hoặc khi mô hình im
  /// lặng. Dương = mô hình nâng, âm = mô hình hạ.
  deviation: number;
  /// `true` khi lệch **quá một bậc** — mức mà `BR-D6` gọi là không chấp nhận
  /// được, và `AD-CR-2` đòi ghi nhật ký.
  ///
  /// ⚠ KHÔNG mang mã `F1` như spine tầng ⑤ viết. `F1` của Mục 0 §0.5 là *"hai
  /// đường ghi trùng vào Dòng thời gian"*, chuyện khác hẳn; và `errors.ts` tự
  /// cảnh báo `F1`–`F40` (Mục 0) với `FT1`–`FT10` (spine) là HAI không gian mã.
  /// Chép mã sai vào đây là dựng một mã tra ra chuyện khác. Đã NÊU RA, không tự
  /// đặt mã mới.
  outOfRange: boolean;
  /// Một câu tiếng Việt nói mô hình đã nói gì và lõi đã quyết gì. `null` khi
  /// không có gì để kể.
  note: string | null;
};

/// `BR-D6` · `0.1.6` — CANH giá trị mô hình trả về. Không bao giờ lấy nó.
///
/// `0.1.6` viết mô hình *"được hạ hoặc nâng một bậc… không được nhảy hai bậc"*.
/// Chốt 14/8 làm chặt hơn một mức, và lý do là một phép đo chứ không phải một sở
/// thích: mô hình đã trả `high` cho 5/5 Phát hiện. Một luật cho phép mô hình
/// nâng một bậc kèm lý do vẫn để đúng mô hình ấy nâng mọi thứ lên — nó chỉ phải
/// viết thêm một câu, mà viết một câu là thứ mô hình làm giỏi nhất.
///
/// Cái KHÔNG mất khi làm chặt: độ lệch vẫn được đo và ghi. Một mô hình liên tục
/// nói `high` trong khi bảng nói `low` là một tín hiệu về BẢNG — đó là dữ liệu
/// để sửa `0.1.4`/`0.1.5`, và nó chỉ tồn tại nếu ta còn ghi lại độ lệch.
export function checkRelevance(input: CheckRelevanceInput): RelevanceCheck {
  const relevance = deriveRelevance(input.signalType, input.signalSubtype);

  if (input.modelRelevance === null || input.modelRelevance === relevance) {
    return { relevance, deviation: 0, outOfRange: false, note: null };
  }

  const deviation = RELEVANCE_RANK[input.modelRelevance] - RELEVANCE_RANK[relevance];
  const reason = (input.modelReason ?? "").trim();
  return {
    relevance,
    deviation,
    outOfRange: Math.abs(deviation) > 1,
    note:
      `Mô hình đề nghị \`${input.modelRelevance}\`, lõi giữ \`${relevance}\` ` +
      `(lệch ${deviation > 0 ? "+" : ""}${deviation} bậc)`
      + (reason.length > 0 ? `. Lý do mô hình nêu: ${reason}` : "."),
  };
}

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
  /// ⚠ TUỲ CHỌN, và lõi BỎ QUA nếu có. Giữ lại trường chỉ để bên gọi cũ không
  /// vỡ; nguồn duy nhất của hai số này là `findQuote` chạy ngay dưới, trên bản
  /// đã chuẩn hoá của chính Bản lưu.
  ///
  /// Vì sao không đòi bên gọi đưa: tầng ② KHÔNG tính được. `AD-AG-3` cấm nó
  /// nhập `@/core`, nên nó không có `normalize()` — mà offset phải tính trên
  /// bản chuẩn hoá (`AD-18`). Lược đồ Zod tầng ④ từng khai hai trường này bắt
  /// buộc, và hậu quả đo được: mô hình rút 5 Phát hiện, cả 5 bị bác ở tầng ④
  /// vì thiếu hai số mà không tầng nào trên nó sinh ra được.
  quoteStart?: number;
  quoteEnd?: number;
  /// `BR-D2` — HAI SỐ MÔ HÌNH KHAI, do công cụ `verifyQuote` trả về.
  ///
  /// ⚠ KHÔNG BAO GIỜ được lưu. Nó tồn tại để ĐỐI CHIẾU với giá trị lõi tự tính,
  /// và độ lệch đi vào ghi vết. Cùng hình dạng với `relevance` sau chốt 14/8:
  /// giá trị mô hình là thứ để ĐO, giá trị lõi là thứ để LƯU.
  ///
  /// `null` khi mô hình không gọi công cụ — hợp lệ, và khi đó không có gì để đối
  /// chiếu. Trường này thêm một lớp kiểm, không thay lớp nào: `findQuote` vẫn là
  /// bên quyết định Phát hiện có sống hay không.
  modelQuoteRange?: { start: number; end: number } | null;
  /// Enum ĐÓNG, khớp từng chữ `enum SignalType`/`Confidence`/`Relevance`.
  signalType: SignalTypeValue;
  /// `CHECK signal_subtype_only_other` — CHỈ khác `null` khi `signalType` là
  /// `other`. Kiểu hiện chưa canh được điều đó; xem `deferred-work.md`.
  signalSubtype: string | null;
  confidence: "chac" | "co_the" | "doan";
  /// `BR-D6` · chốt 14/8 — ĐỀ NGHỊ CỦA MÔ HÌNH, **không bao giờ là giá trị được
  /// lưu**. `createSignal` đem nó SO với giá trị lõi tự suy (`deriveRelevance`)
  /// rồi ghi độ lệch vào ghi vết; cột `signal.relevance` luôn nhận giá trị lõi.
  ///
  /// Trường vẫn bắt buộc, không bỏ đi: bỏ nó là mất luôn khả năng đo xem mô hình
  /// lệch bao nhiêu — mà đó là dữ liệu duy nhất để phản biện bảng `0.1.4`/`0.1.5`.
  relevance: RelevanceValue;
  /// `0.1.6` — câu lý do mô hình kèm theo khi nó lệch. Chỉ để GHI NHẬT KÝ; sau
  /// chốt 14/8 nó không đổi được giá trị nào. Tuỳ chọn vì bộ gieo và
  /// `src/ingest` không có mô hình nào để giải thích.
  relevanceReason?: string | null;
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

    // `BR-D6` · `AD-CR-2` · chốt 14/8 — CÙNG MỘT LÝ DO với `quoteStart`/
    // `quoteEnd` ngay dưới, và cùng một hình dạng: giá trị mô hình đưa KHÔNG
    // được lưu, lõi tự tính lấy. Không có dòng này thì `relevance` là thứ duy
    // nhất trong `signal` mà mô hình tự khai và không ai kiểm — đúng chỗ đã đo
    // được 5/5 `high`.
    //
    // KHÔNG ném và KHÔNG loại Phát hiện dù mô hình lệch bao nhiêu bậc: `AD-CR-2`
    // chốt `BR-D6` không có mã lỗi, và Phát hiện là bằng chứng.
    const relevance = checkRelevance({
      signalType: input.signalType,
      signalSubtype: input.signalSubtype,
      modelRelevance: input.relevance,
      modelReason: input.relevanceReason ?? null,
    });

    // `BR-D2` — ĐỐI CHIẾU hai số mô hình khai với hai số lõi vừa tính.
    //
    // Ba kết cục, và cả ba đều đi vào ghi vết chứ không chặn Phát hiện: mô hình
    // KHÔNG gọi công cụ (`null`), gọi và khai ĐÚNG, gọi mà khai LỆCH. Cái thứ ba
    // là thứ đáng đo nhất — nó phân biệt *"mô hình diễn đạt lại"* (câu trích
    // không khớp, đã bị `findQuote` bác ở trên) với *"mô hình chép đúng nhưng
    // khai bừa vị trí"*, hai lỗi rất khác nhau mà trước đây cùng biến mất.
    const quoteToolUsed = input.modelQuoteRange != null;
    const quoteRangeMatches =
      quoteToolUsed
      && input.modelQuoteRange!.start === at.start
      && input.modelQuoteRange!.end === at.end;

    // ⚠ Bỏ qua `input.quoteStart`/`quoteEnd` do bên gọi đưa, dùng giá trị VỪA
    // TÍNH. Tin bên gọi ở đây là mở một đường để `T-3` mở sai đoạn: mô hình có
    // thể trả offset đúng định dạng mà lệch vị trí, và không lớp nào bắt được.
    const s = await t.signal.create({
      data: {
        accountId: input.accountId,
        articleId: input.articleId,
        claim: input.claim,
        // ⚠ LƯU BẢN ĐÃ CHUẨN HOÁ, không lưu `input.quote` thô. Hai cột này phải
        // nói cùng một chuyện: `quoteStart`/`quoteEnd` là chỉ số vào
        // `normalizedText`, nên chữ lưu kèm phải là chữ nằm ở đúng khoảng đó.
        //
        // Lưu bản thô thì `normalizedText.slice(start, end) !== signal.quote`
        // ngay khi mô hình trả câu trích có dấu cách kép hay xuống dòng — và
        // triệu chứng là `S10` **tô sáng một đoạn khác với chữ nó hiển thị**,
        // đúng thứ `T-3` phải chứng minh là không xảy ra. Chuẩn hoá là luỹ đẳng
        // (`isIdempotent`), nên câu trích vốn đã sạch thì không đổi gì.
        quote: at.normalizedQuote,
        quoteStart: at.start,
        quoteEnd: at.end,
        signalType: input.signalType,
        signalSubtype: input.signalSubtype,
        confidence: input.confidence,
        relevance: relevance.relevance,
        eventDate: input.eventDate,
      },
      select: { id: true },
    });
    // Dòng ghi vết mang CẢ HAI phía khi mô hình lệch khỏi lõi. Đây là chỗ duy
    // nhất độ lệch ấy còn lại được — `createSignal` trả về mỗi `{ id }` — và nó
    // là dữ liệu để phản biện chính bảng `0.1.4`/`0.1.5` về sau: mô hình liên
    // tục lệch cùng một chiều trên cùng một loại tin nghĩa là bảng sai, không
    // phải mô hình sai.
    await ctx.audit.complete(t, ctx.auditId, "ok", {
      accountId: input.accountId,
      after: {
        id: s.id,
        // `BR-D2` — ba trạng thái của công cụ `verifyQuote`, đếm được từ ghi vết:
        //   `khong_goi`   mô hình bỏ qua công cụ
        //   `khop`        gọi và khai đúng vị trí
        //   `khai_lech`   gọi, câu trích ĐÚNG, nhưng vị trí khai SAI
        //
        // Trạng thái thứ ba là thứ đáng đo nhất và trước đây không thấy được:
        // nó tách *"mô hình diễn đạt lại"* (đã bị `findQuote` bác trước khi tới
        // đây) khỏi *"mô hình chép đúng nhưng khai bừa"* — hai lỗi khác nhau về
        // bản chất, mà cùng biến mất vào một con số.
        quoteTool: !quoteToolUsed ? "khong_goi" : quoteRangeMatches ? "khop" : "khai_lech",
        ...(quoteToolUsed && !quoteRangeMatches
          ? { quoteRangeModel: input.modelQuoteRange, quoteRangeCore: { start: at.start, end: at.end } }
          : {}),
        relevance: relevance.relevance,
        ...(relevance.deviation === 0
          ? {}
          : {
              relevanceModel: input.relevance,
              relevanceDeviation: relevance.deviation,
              relevanceOutOfRange: relevance.outOfRange,
              relevanceNote: relevance.note,
            }),
      },
    });
    return { id: s.id };
  });
}

/// `FR-42` · `D30` — nút *không hữu ích*, một trong HAI đường vào
/// `errorDetectionRate` (đường kia là Bỏ một Gợi ý với lý do `thong_tin_sai`).
///
/// Ghi CÓ ĐIỀU KIỆN `where markedUnhelpfulAt = null` (`AD-10`), và điều kiện đó
/// là thứ làm bấm lần hai thành NO-OP thay vì dời mốc thời gian. Dời mốc là làm
/// hỏng đúng số đo mà nút này sinh ra: `D30` đếm theo lần đánh dấu ĐẦU TIÊN, và
/// một mốc trôi theo mỗi cú bấm khiến cửa sổ 24 giờ của màn hình Quản trị (`D29`)
/// đếm cùng một Phát hiện nhiều lần.
///
/// ⚠ KHÔNG chặn theo `actor.kind` ở đây, và đó là chủ đích. `§5` không có ranh
/// giới nào cho thao tác này, `errors.ts` là từ vựng ĐÓNG, nên bịa một mã để
/// chặn máy là dựng nguồn sự thật thứ hai (cùng lý do `setPrimaryContact` và
/// `undoSystemNextAction` không chặn). Chặn máy nằm ở `allowedActors` của mục sổ
/// đăng ký — §6 của PRD xếp nút này vào cột ❌ cho máy.
///
/// ⚠ KHÔNG xoá và KHÔNG sửa Phát hiện: `AD-14` chốt Phát hiện là bằng chứng.
/// Đây là một cột phản hồi cạnh nó, không phải một đường loại bỏ.
export async function markSignalUnhelpful(
  _actor: Actor,
  id: string,
  ctx: CoreContext,
): Promise<void> {
  await tx(async (t) => {
    const now = new Date();
    const before = await t.signal.findUnique({
      where: { id },
      select: { markedUnhelpfulAt: true },
    });
    // ⚠ `Error` thường, KHÔNG phải `BusinessRuleError`: *không tìm thấy bản
    // ghi* không có mã nào ở thượng nguồn. Tầng ① xếp nó vào nhánh `unexpected`.
    if (!before) throw new Error("Phát hiện không tồn tại.");

    const changed = await t.signal.updateMany({
      where: { id, deletedAt: null, markedUnhelpfulAt: null },
      data: { markedUnhelpfulAt: now },
    });
    if (changed.count === 0) {
      // `AD-CR-8` — bỏ lượt ghi là một KẾT CỤC, không phải một khoảng trống.
      await ctx.audit.complete(t, ctx.auditId, "no_op", {
        before,
        after: before,
      });
      return;
    }

    await ctx.audit.complete(t, ctx.auditId, "ok", {
      before,
      after: { markedUnhelpfulAt: now },
    });
  });
}
