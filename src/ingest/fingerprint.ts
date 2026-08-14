// `D18` · `FR-50` · `AD-18` — dấu vân nội dung, và chỗ chống sinh trùng Bản lưu.
//
// Đây là bẫy trực tiếp nhất của nhóm 5, và nó hỏng theo một kiểu rất dễ chịu:
// không có lỗi nào, không có cảnh báo nào, chỉ là mỗi vòng quét lại thấy nội
// dung *"mới"*. Sau ba chu kỳ Dòng thời gian có sáu mục thay vì hai, và `T-8`
// đỏ vì nó đếm ĐÚNG HAI.
//
// Nguyên nhân không nằm ở nội dung bài viết mà ở phần khung quanh nó: một trang
// tin thật in *"cập nhật 5 phút trước"*, *"1.204 lượt xem"*, *"v2.3"* — ba thứ
// đổi mỗi lần đọc trong khi bài viết đứng yên. Băm nguyên trang là băm ba con
// số đó.
//
// ⚠ MỐC CẮT `AD-18`, tệp này nằm HẲN về phía `src/ingest`: nó chỉ chạm những
// thứ **phụ thuộc định dạng nguồn** — thẻ HTML, mẫu chữ của dấu thời gian hiển
// thị, nhãn lượt xem. Nó KHÔNG chạm khoảng trắng và KHÔNG chạm Unicode; lõi làm
// việc đó ở `src/core/normalize.ts`. Cưỡng chế bằng phép kiểm cấm `.replace(/\s+/`
// và `.normalize(` trong cả thư mục — nên mọi mẫu dưới đây viết lớp ký tự
// TƯỜNG MINH `[ \t 　]`, không dùng `\s`.

import { createHash } from "node:crypto";

/// MỘT mẫu volatile, có TÊN. `AD-UI-16` cấm ép ngầm ở `mapping.ts`; cùng lý do
/// áp ở đây: một mẫu không tên là một dòng regex mà sáu tháng sau không ai dám
/// sửa vì không biết nó chống cái gì. Tên đi thẳng vào báo cáo đối soát khi cần
/// giải thích *"vì sao hai trang khác nhau lại cùng dấu vân"*.
export type VolatilePattern = {
  name: string;
  /// Vì sao nó là volatile — một câu, đọc được ở bảng đối soát.
  reason: string;
  pattern: RegExp;
};

/// Khoảng trắng viết TƯỜNG MINH, dùng lại ở mọi mẫu. Gồm cả U+3000 vì văn bản
/// thị trường JP dùng nó có nghĩa — ở đây nó chỉ là **dấu phân cách trong một
/// mẫu**, không phải thứ bị xoá: mẫu nào khớp thì cả cụm biến mất, còn U+3000
/// nằm ngoài cụm vẫn nguyên vẹn cho lõi xử lý.
const WS = "[ \\t\\u00a0\\u3000]";

/// Bảng mẫu, ĐÓNG. Thứ tự có nghĩa: mẫu dài đứng trước mẫu ngắn, vì mẫu ngắn
/// khớp một phần của mẫu dài rồi để lại phần đuôi làm nhiễu.
///
/// Mọi mẫu thay bằng CÙNG MỘT thẻ chỗ trống, không thay bằng chuỗi rỗng: xoá
/// hẳn thì hai trang khác nhau ở đúng chỗ có/không có dấu thời gian sẽ cho cùng
/// dấu vân, và đó là chống trùng quá tay — nội dung mới thật sự sẽ bị bỏ.
export const VOLATILE_PATTERNS: readonly VolatilePattern[] = [
  {
    name: "nhan_cap_nhat_kem_gio",
    reason: "dòng “Cập nhật lúc …” đổi mỗi lần trang được phục vụ lại",
    pattern: new RegExp(
      `(?:cập${WS}nhật|updated|last${WS}updated|更新)(?:${WS}(?:lúc|vào|on|at))?${WS}*[:：]?${WS}*[^\\n]{0,40}`,
      "giu",
    ),
  },
  {
    name: "thoi_gian_tuong_doi",
    reason: "“5 phút trước” / “2 hours ago” / “3分前” đổi theo từng lượt đọc",
    pattern: new RegExp(
      `\\d+${WS}*(?:giây|phút|giờ|ngày|tuần|tháng|năm)${WS}+trước`
        + `|\\d+${WS}*(?:second|minute|hour|day|week|month|year)s?${WS}+ago`
        + `|\\d+${WS}*(?:秒|分|時間|日|週間|ヶ月|年)前`,
      "giu",
    ),
  },
  {
    name: "dau_thoi_gian_iso",
    reason: "mốc thời gian hiển thị dạng máy đọc, đổi theo lần dựng trang",
    pattern: /\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2})?(?:Z|[+-]\d{2}:?\d{2})?)?/gu,
  },
  {
    name: "dau_thoi_gian_ban_dia",
    reason: "ngày hiển thị theo lịch địa phương, kể cả dạng JP 2026年8月14日",
    pattern: new RegExp(
      `\\d{4}年${WS}*\\d{1,2}月${WS}*\\d{1,2}日`
        + `|\\d{1,2}[/.-]\\d{1,2}[/.-]\\d{2,4}`,
      "gu",
    ),
  },
  {
    name: "gio_phut",
    reason: "đồng hồ trên khung trang, không thuộc thân bài",
    pattern: new RegExp(
      `(?<!\\d)\\d{1,2}:\\d{2}(?::\\d{2})?(?:${WS}*(?:AM|PM|am|pm))?(?!\\d)`,
      "gu",
    ),
  },
  {
    name: "so_luot_xem",
    reason: "bộ đếm lượt xem tăng liên tục trong khi bài viết đứng yên",
    pattern: new RegExp(
      `[\\d][\\d.,]*${WS}*(?:lượt${WS}xem|lượt${WS}đọc|views?|reads?|回視聴|閲覧)`
        + `|(?:lượt${WS}xem|views?|閲覧数)${WS}*[:：]?${WS}*[\\d][\\d.,]*`,
      "giu",
    ),
  },
  {
    name: "so_phien_ban",
    reason: "số hiệu bản dựng của trang; `D18` so theo dấu vân NỘI DUNG, không theo số hiệu",
    pattern: new RegExp(
      `(?:phiên${WS}bản|version|バージョン|ver\\.?|v)${WS}*\\d+(?:\\.\\d+){0,3}`,
      "giu",
    ),
  },
  {
    name: "so_binh_luan_va_tuong_tac",
    reason: "bộ đếm mạng xã hội trên khung trang",
    pattern: new RegExp(
      `[\\d][\\d.,]*${WS}*(?:bình${WS}luận|comments?|likes?|shares?|lượt${WS}thích)`,
      "giu",
    ),
  },
] as const;

/// Thẻ chỗ trống.
///
/// Viết bằng ESCAPE TƯỜNG MINH, không dán ký tự thật: U+0001 vô hình trong mọi
/// trình soạn thảo, nên một hằng số chứa nó dưới dạng ký tự thật trông y hệt
/// một chuỗi rỗng — và người sau sẽ "dọn" nó đi mà không biết mình vừa đổi dấu
/// vân của MỌI Bản lưu đã lưu.
///
/// Chọn ký tự điều khiển chứ không chọn một từ ASCII: một từ ASCII có thể xuất
/// hiện thật trong bài viết, và khi đó hai trang khác nhau bị coi là giống nhau
/// ở đúng chỗ đó. U+0001 không xuất hiện trong văn bản tin đã bóc thẻ.
export const VOLATILE_PLACEHOLDER = "\u0001VOLATILE\u0001";

/// Kết quả bóc, kèm ĐẾM THEO TÊN. Con số này là thứ trả lời được câu hỏi *"vì
/// sao vòng này không thấy nội dung mới"* mà không cần bật log gỡ rối.
export type StripReport = {
  text: string;
  hits: Record<string, number>;
};

/// `D18` — loại phần volatile khỏi văn bản, giữ nguyên phần còn lại từng byte.
export function stripVolatile(text: string): StripReport {
  const hits: Record<string, number> = {};
  let out = text;
  for (const p of VOLATILE_PATTERNS) {
    let n = 0;
    // `lastIndex` của một RegExp cờ `g` là TRẠNG THÁI trên chính đối tượng đó.
    // Mảng ở trên là hằng số mức module, nên dùng lại nguyên đối tượng giữa hai
    // lần gọi sẽ bỏ sót khớp ở lần thứ hai — lỗi kinh điển, và ở đây nó biểu
    // hiện thành *"lần nạp đầu sạch, lần nạp sau đẻ Bản lưu trùng"*. Dựng bản
    // sao cho mỗi lượt thay vì tin vào việc `replace` tự đặt lại `lastIndex`.
    const re = new RegExp(p.pattern.source, p.pattern.flags);
    out = out.replace(re, () => {
      n += 1;
      return VOLATILE_PLACEHOLDER;
    });
    if (n > 0) hits[p.name] = n;
  }
  return { text: out, hits };
}

/// Dấu vân nội dung của `D18`.
///
/// ⚠ ĐẦU VÀO PHẢI LÀ THỨ MÀ LÕI CŨNG BĂM. Hợp đồng chốt ở `_contract.ts`:
/// `src/ingest` tính hash này rồi **nộp kèm** qua `createArticle`, lõi lưu
/// nguyên. Nếu có ai đó sửa lõi để tự băm `normalized_text`, hai bên băm hai
/// đầu vào khác nhau, mọi phép so trùng trả *"khác"*, và `FR-50` vỡ đúng theo
/// kiểu không ai nhìn thấy: chuyển lùi về *trước* lại đẻ thêm một Bản lưu.
export function contentFingerprint(text: string): string {
  return createHash("sha256").update(stripVolatile(text).text, "utf8").digest("hex");
}

/// `FR-50` — quyết định có tạo Bản lưu mới không.
///
/// ⚠ So với **MỌI** Bản lưu của Công ty, không chỉ bản gần nhất. Đây là câu
/// `FR-50` viết ra và là chỗ duy nhất nó được cưỡng chế: chuyển *trước* → *sau*
/// → *trước* để diễn lại kịch bản demo là ba lần đổi, và phép so *"khác bản gần
/// nhất"* cho **cả ba** đều là nội dung mới. Mỗi lần diễn lại đẻ thêm một lượt
/// mục Dòng thời gian giả, và `T-8` đếm ra bốn thay vì hai.
export type DedupeDecision =
  | { create: true }
  | { create: false; reason: "trung_hash"; matchedArticleId: string; matchedVersion: string };

export function decideCreateSnapshot(
  candidateHash: string,
  existing: readonly { articleId: string; contentHash: string; version: string }[],
): DedupeDecision {
  const hit = existing.find((a) => a.contentHash === candidateHash);
  if (!hit) return { create: true };
  return {
    create: false,
    reason: "trung_hash",
    matchedArticleId: hit.articleId,
    matchedVersion: hit.version,
  };
}
