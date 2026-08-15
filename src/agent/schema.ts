// `AD-AG-5` · `AD-AG-6` — lược đồ Phát hiện, dựng từ enum ĐƯỢC TRUYỀN VÀO.
//
// ⚠ `AD-AG-3`/`AD-AG-6`: tệp này KHÔNG đọc ontology từ đĩa và KHÔNG nhập gì từ
// tầng ④ hay tầng ⑤. Danh sách enum là **tham số thứ ba của `AD-7`** — nó đi
// vào dưới dạng dữ liệu, do tầng ① lấy qua capability `listEnums`.
//
// ⚠ Lời nhập từ `./types` ở đây là **CHỈ KIỂU** và phải giữ nguyên như vậy.
// `types.ts` xuất lại `extractSignals` từ `./client`, còn `client.ts` nhập
// tệp này — một lời nhập GIÁ TRỊ ngược về `./types` sẽ đóng vòng lúc chạy và
// `SignalDraftSchema` rơi vào vùng chết TDZ ngay lần gọi đầu.

import { z } from "zod";
import type { SignalDraft, SignalEnums } from "./types";

/// `AD-AG-6` — MỘT hàm dựng lược đồ. Trả hai mặt của cùng một lược đồ vì
/// tầng ② cần cả hai và chúng phải KHÔNG BAO GIỜ lệch nhau:
///   · `jsonSchema` — thứ gửi ra biên qua `outputFormat` (draft-07, `AD-6`)
///   · `envelope`   — thứ đọc `structured_output` trả về
/// Dựng hai lược đồ ở hai nơi là đúng lỗi `AD-AG-5` sinh ra để chặn, chỉ đổi
/// chỗ: lược đồ gửi đi và lược đồ đọc về trôi khỏi nhau trong im lặng.
export function buildSignalSchema(enums: SignalEnums): {
  jsonSchema: Record<string, unknown>;
  envelope: z.ZodType<{ signals: SignalDraft[] }>;
} {
  /// `AD-AG-5` — SÁU trường của spine, cộng `eventDate` là trường thứ bảy đã
  /// được `types.ts` khai là thêm CÓ CHỦ ĐÍCH (`BR-D7` cần ngày sự kiện).
  /// `strictObject` để `additionalProperties: false` có mặt ở MỌI mức: một
  /// trường thừa phải thành lỗi lược đồ nhìn thấy được, không thành dữ liệu
  /// trôi vào lõi.
  ///
  /// ⚠ CẤM `z.date()` — Zod 4.4.3 ném *"Date cannot be represented in JSON
  /// Schema"* LÚC DỰNG, tức `npm start` chết trước khi giám khảo bấm gì.
  const draft = z.strictObject({
    claim: z.string().min(1).max(300),
    /// `BR-D1` — không câu trích thì Phát hiện không tồn tại. Đây là lớp chặn
    /// thứ nhất; lõi khớp nguyên văn với bản chuẩn hoá (`BR-D2`) là lớp thứ hai.
    quote: z.string().min(1),
    /// `BR-D10` — mô hình CHỌN trong danh sách cho sẵn, không nhập tự do.
    signalType: z.enum(enums.signalType),
    /// `AD-AG-6` — luật *"chỉ có nghĩa khi `signalType = other`"* KHÔNG cài
    /// bằng `if`/`then` của JSON Schema (mức hỗ trợ draft-07 phía SDK chưa xác
    /// minh). Nó là `BR-D` cưỡng chế ở lõi. Ở đây chỉ là enum-hoặc-`null` và
    /// BẮT BUỘC có mặt — `null` là câu trả lời hợp lệ.
    signalSubtype: z.enum(enums.signalSubtype).nullable(),
    confidence: z.enum(enums.confidence),
    /// `BR-D6` — suy ra từ Loại tin và `signalSubtype`; biên lệch một bậc là
    /// luật *non-functional*, đo ở tầng khác, không cưỡng chế được bằng lược đồ.
    relevance: z.enum(enums.relevance),
    /// `z.iso.datetime()`, KHÔNG `z.date()`. `null` khi Bản lưu không nói ngày
    /// — `BR-D7` khi đó lấy ngày của Bản lưu, và đó là việc của lõi.
    eventDate: z.iso.datetime().nullable(),
    /// `BR-D2` — HAI SỐ DO CÔNG CỤ `verifyQuote` TRẢ VỀ, mô hình chép lại.
    ///
    /// ⚠ Đây là trường KIỂM ĐƯỢC, không phải một lời hứa. Một cờ `quoteChecked:
    /// boolean` thì mô hình khai `true` là xong và không lớp nào bác được. Hai số
    /// này thì lõi TỰ TÍNH lại bằng `findQuote` và đối chiếu — khai bừa là lệch,
    /// và lệch thì đếm được.
    ///
    /// `null` là hợp lệ: mô hình không gọi công cụ, hoặc gọi mà không khớp. Khi đó
    /// lõi vẫn kiểm câu trích như cũ; trường này chỉ thêm một lớp, không thay lớp
    /// nào.
    quoteRange: z
      .object({ start: z.number().int().nonnegative(), end: z.number().int().nonnegative() })
      .nullable(),
  });

  /// `AD-AG-5` — gốc là ĐỐI TƯỢNG BỌC, không phải mảng trần: mảng trần không
  /// có chỗ cho kênh trả lời rỗng đọc được, và một số đường structured output
  /// đòi gốc là object. `signals: []` là câu trả lời hợp lệ (`AD-AG-11`).
  const envelope = z.strictObject({ signals: z.array(draft) });

  const jsonSchema = z.toJSONSchema(envelope, {
    /// `AD-6` — draft-07, không thương lượng. Lược đồ khai sai draft giết cả
    /// lượt chạy ngay lúc khởi động, ở chỗ không dễ thấy.
    target: "draft-7",
    /// `z.iso.datetime()` sinh kèm một `pattern` regex ~200 ký tự. `format`
    /// trong draft-07 vốn chỉ là chú thích, còn regex đó là một mặt tiếp xúc
    /// chưa đo với bộ kiểm phía API — bỏ nó đi thì lược đồ nhẹ hơn mà phía
    /// đội KHÔNG lỏng ra: `envelope` vẫn kiểm đúng ISO-8601 lúc đọc về.
    override: (ctx) => {
      const node = ctx.jsonSchema as { format?: string; pattern?: string };
      if (node.format === "date-time" && typeof node.pattern === "string") {
        delete node.pattern;
      }
    },
  }) as Record<string, unknown>;

  /// ⚠ Ép kiểu, có chủ đích và có phạm vi. `z.enum(enums.signalType)` với
  /// `enums` là DỮ LIỆU chỉ suy ra được `string`, không suy ra được union hẹp
  /// của `SignalDraft`. `AD-AG-6` đặt trách nhiệm *"danh sách enum đúng ontology
  /// §8"* lên bên gọi (`listEnums`), nên chỗ này tin bên gọi — và đó là toàn bộ
  /// khoảng cách giữa hai kiểu. Truyền danh sách lệch ontology thì lời hứa này
  /// sai, và không bộ kiểm kiểu nào ở tầng ② bắt được.
  return {
    jsonSchema,
    envelope: envelope as unknown as z.ZodType<{ signals: SignalDraft[] }>,
  };
}
