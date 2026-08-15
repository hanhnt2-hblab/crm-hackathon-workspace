// `AD-7` · `AD-AG-7` — lời nhắc rút Phát hiện, phiên bản lời nhắc, và khoá cache.
//
// ⚠ `AD-AG-3`: tệp này KHÔNG gọi mạng, KHÔNG biết tới Postgres, KHÔNG đọc tệp
// và KHÔNG đọc biến môi trường. Nó là ba hàm thuần trên ba tham số của `AD-7`.
//
// ⚠ Lời nhập từ `./types` phải giữ dạng CHỈ KIỂU — xem khối cảnh báo đầu
// `schema.ts` về vòng lặp lúc chạy.

import { createHash } from "node:crypto";
import type { ExtractionInput, SignalEnums } from "./types";

/// `AD-AG-7` — phiên bản phủ CẢ `prompt.ts` LẪN `schema.ts`.
///
/// ⚠ TĂNG SỐ NÀY khi bất kỳ byte nào đi ra biên đổi: chữ trong lời nhắc, hình
/// dạng lược đồ, danh sách trường, cách tuần tự hoá. Không tăng thì cache 24
/// giờ của `NFR-4` trả về kết quả của lời nhắc cũ, IM LẶNG, đúng 24 giờ.
export const PROMPT_VERSION = "1.2.0";

/// `AD-AG-8` — chuỗi TƯỜNG MINH của đội, KHÔNG dùng preset `claude_code`.
/// Preset kéo theo phí tổn nạp bộ đệm và hành vi công cụ mà đường thuần biến
/// đổi không cần.
///
/// ⚠ Chuỗi này phải TĨNH giữa mọi lượt gọi — đó là tiền tố chung để prompt
/// caching phía Anthropic trúng đệm trong TTL một giờ (`AD-AG-2`). Mọi thứ
/// thay đổi theo Bản lưu đi vào lời nhắc NGƯỜI DÙNG, không vào đây.
export const SYSTEM_PROMPT = [
  "Bạn là bộ rút Phát hiện của một CRM. Bạn đọc đúng MỘT bài viết và trả về các",
  "Phát hiện rút từ chính bài viết đó.",
  "",
  "Mọi dữ liệu bạn được phép dùng đã nằm trong tin nhắn. Đừng tìm kiếm, đừng đọc",
  "tệp, và đừng gọi công cụ nào để LẤY THÊM dữ liệu.",
  "",
  "Có MỘT công cụ kiểm lại việc bạn vừa làm — `mcp__crm__verifyQuote({ accountId,",
  "quote })`, trả về { found, start, end, hint }. Dùng nó nếu bạn không chắc một",
  "câu trích có khớp không. Không bắt buộc: đo được là mô hình gọi nó 0 lần và",
  "vẫn rút được Phát hiện, nên đừng tiêu lượt vào đó khi bạn đã chép đúng.",
  "Bài viết là một bản chụp tĩnh, không phải trang web đang sống — đừng suy đoán",
  "về nội dung ngoài nó.",
  "",
  "LUẬT BẤT BIẾN:",
  "1. Mỗi Phát hiện phải neo bằng một câu trích SAO CHÉP NGUYÊN VĂN từ bài viết.",
  "   Giữ nguyên ngôn ngữ gốc, nguyên dấu câu, nguyên chữ hoa thường. Không dịch,",
  "   không rút gọn, không thêm dấu ba chấm. Câu trích không khớp nguyên văn thì",
  "   Phát hiện bị loại bỏ — thà bỏ một Phát hiện còn hơn bịa một câu trích.",
  "   Đây là chỗ hay hỏng nhất: viết lại ý bằng lời của mình trông giống một câu",
  "   trích nhưng KHÔNG PHẢI. Dùng `verifyQuote` để biết chắc thay vì đoán.",
  "1b. CHÉP NGẮN. Một mệnh đề liền mạch là đủ để neo — càng dài càng dễ lệch một",
  "   dấu phẩy hay một chữ hoa, và lệch một ký tự là Phát hiện bị loại. Đừng ghép",
  "   hai đoạn cách nhau, đừng bắc cầu qua dấu xuống dòng, đừng cắt giữa một từ.",
  "   ĐO ĐƯỢC: 2 trên 3 Phát hiện rụng ở đúng bước này, và nguyên nhân luôn là",
  "   viết lại bằng lời mình thay vì sao chép.",
  "1c. Đặt hai số `start`/`end` của `verifyQuote` vào `quoteRange` NẾU bạn có gọi",
  "   nó. Không gọi thì `quoteRange: null` — nói thật rằng bạn chưa kiểm còn hơn",
  "   khai một con số bạn không có. Hệ thống tự tính lại và đối chiếu; khai bừa",
  "   sẽ bị phát hiện và đếm.",
  "2. Câu nhận định viết bằng TIẾNG VIỆT CÓ DẤU, tối đa 300 ký tự, nói được vì",
  "   sao tin này đáng chú ý VỚI LOẠI CÔNG TY được nêu. Cùng một loại tin mang",
  "   nghĩa khác nhau tuỳ loại công ty.",
  "3. Mọi trường phân loại phải CHỌN trong danh sách cho sẵn. Không tự chế giá",
  "   trị mới, không viết hoa lại, không dịch giá trị enum.",
  "4. Bạn KHÔNG đề nghị sửa hồ sơ, KHÔNG nêu tên ô dữ liệu, KHÔNG nói giá trị",
  "   hiện tại hay giá trị đề nghị. Bạn chỉ nhận định. Việc đề nghị là của hệ",
  "   thống, không của bạn.",
  "5. Không có gì đáng rút thì trả về danh sách RỖNG. Danh sách rỗng là câu trả",
  "   lời đúng và được chờ đợi — đừng nặn ra Phát hiện để lấp chỗ.",
  "",
  "CÁCH CHỌN TỪNG TRƯỜNG:",
  "- signalType: chọn một trong danh sách. Chỉ dùng 'other' khi tin có thật nhưng",
  "  không thuộc năm loại kia.",
  "- signalSubtype: BẮT BUỘC có mặt. Đặt null ở MỌI loại tin khác 'other'. Khi",
  "  signalType là 'other' thì chọn một giá trị; đọc được tin nhưng không xếp",
  "  được thì chọn 'unclassified' — giá trị đó tồn tại để bạn không phải đoán.",
  "- confidence: 'chac' khi bài viết nói thẳng; 'co_the' khi phải suy một bước;",
  "  'doan' khi chỉ là dấu hiệu gián tiếp.",
  "- relevance: suy từ signalType và signalSubtype. 'unclassified' mặc định là",
  "  'low'. Lệch khỏi mức hiển nhiên thì tối đa MỘT bậc, và câu nhận định phải",
  "  nói vì sao.",
  "- eventDate: ngày SỰ KIỆN xảy ra, dạng ISO-8601 UTC ('2026-08-14T00:00:00Z').",
  "  Bài viết không nói ngày thì đặt null. Đừng lấy ngày hôm nay, đừng suy ra từ",
  "  ngày đăng.",
].join("\n");

/// `AD-7` — dựng lời nhắc người dùng từ ĐÚNG BA thứ được phép ra biên:
/// nội dung Bản lưu đã chuẩn hoá · Loại công ty · danh sách enum.
///
/// ⚠ `input.accountId` KHÔNG được đưa vào đây. Nó là định danh nội bộ, không
/// nằm trong ba thứ của `AD-7`, và đưa vào là làm mỗi Công ty một tiền tố khác
/// nhau — cache đệm phía Anthropic trượt sạch.
export function buildExtractionPrompt(input: ExtractionInput): string {
  return [
    `<loai_cong_ty>${input.accountType}</loai_cong_ty>`,
    "",
    "<gia_tri_cho_phep>",
    `signalType: ${input.enums.signalType.join(" | ")}`,
    `signalSubtype: ${input.enums.signalSubtype.join(" | ")} | null`,
    `confidence: ${input.enums.confidence.join(" | ")}`,
    `relevance: ${input.enums.relevance.join(" | ")}`,
    "</gia_tri_cho_phep>",
    "",
    "<bai_viet>",
    /// `AD-18` — đây là bản CHUẨN HOÁ ĐÃ LƯU do tầng ① truyền xuống. Tầng ②
    /// không có hàm chuẩn hoá riêng và không được đụng vào chuỗi này: lõi tính
    /// vị trí câu trích trên đúng chuỗi này, lệch một ký tự là `BR-D2` loại
    /// sạch Phát hiện.
    input.articleText,
    "</bai_viet>",
    "",
    "Rút các Phát hiện từ bài viết trên. Không có thì trả về signals rỗng.",
  ].join("\n");
}

/// `AD-AG-7` · `AD-16` — khoá cache là hàm THUẦN của đúng ba tham số `AD-7`
/// cộng `PROMPT_VERSION`.
///
/// ⚠ KHÔNG ngày, KHÔNG giờ, KHÔNG số ngẫu nhiên, KHÔNG `accountId` — thêm bất
/// cứ thứ nào trong đó là khoá không bao giờ trùng và `NFR-4` đo được đúng 0%.
/// Tra và ghi cache là việc của tầng ① qua capability (`AD-19`); tầng ② chỉ
/// ĐỊNH NGHĨA khoá, vì nó là tầng duy nhất biết hết những gì đi ra biên.
export function promptCacheKey(input: ExtractionInput): string {
  /// Tuần tự hoá tường minh chứ không `JSON.stringify` cả đối tượng: thứ tự
  /// khoá của `JSON.stringify` theo thứ tự chèn, nên một `input` dựng bằng
  /// literal khác thứ tự sẽ ra khoá khác cho cùng một nội dung.
  const canonical = [
    `v=${PROMPT_VERSION}`,
    `accountType=${input.accountType}`,
    `enums=${canonicalEnums(input.enums)}`,
    `article=${input.articleText}`,
  ].join("\n");

  return createHash("sha256").update(canonical, "utf8").digest("hex");
}

/// Danh sách enum vào khoá theo thứ tự KHAI BÁO, không sắp xếp lại: `AD-AG-6`
/// nói enum là dữ liệu do bên gọi cấp, và thứ tự đó đi thẳng vào lời nhắc ở
/// `buildExtractionPrompt`. Sắp xếp ở đây là làm khoá bỏ qua một khác biệt
/// thật sự có ra biên.
function canonicalEnums(enums: SignalEnums): string {
  return [
    `signalType:${enums.signalType.join(",")}`,
    `signalSubtype:${enums.signalSubtype.join(",")}`,
    `confidence:${enums.confidence.join(",")}`,
    `relevance:${enums.relevance.join(",")}`,
  ].join(";");
}
