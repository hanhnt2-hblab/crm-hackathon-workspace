// `AD-18` · `AD-CR-9`
//
// NƠI DUY NHẤT chuẩn hoá văn bản. THUẦN, không phụ thuộc gì, KHÔNG BAO GIỜ
// thấy một thẻ HTML nào.
//
// Mốc cắt với `src/ingest` (khai tường minh vì không suy ra được):
//   · `src/ingest` — mọi thứ PHỤ THUỘC ĐỊNH DẠNG NGUỒN: chọn nút DOM chứa thân
//     bài, gỡ thẻ, giải mã thực thể HTML, quyết định `readable = false`.
//     KHÔNG chạm khoảng trắng, không chạm Unicode.
//   · tệp này — mọi thứ KHÔNG phụ thuộc định dạng nguồn.
//
// "Thuần" thôi chưa đủ: hai hàm thuần khác nhau, mỗi hàm một bộ kiểm thử xanh,
// vẫn lệch nhau ở NBSP hay NFC/NFD — và lệch một ký tự là LỆCH OFFSET, tức
// đúng thứ `AD` này sinh ra để chặn, chỉ đổi nguyên nhân.

/// Đổi hàm này là đổi lược đồ: tăng phiên bản và tính lại offset của Phát hiện
/// thuộc phiên bản cũ. Không tính lại tất cả.
export const NORMALIZER_VERSION = 1;

/// Sáu phép biến đổi CÓ THỨ TỰ. Thứ tự là một phần của hợp đồng — đổi thứ tự
/// cho kết quả khác, nên nó được kiểm bằng bảng đầu-vào/đầu-ra cố định.
///
/// Loại NFKC có chủ đích: nó gộp ký tự nửa-độ-rộng và toàn-độ-rộng, mà văn bản
/// tiếng Nhật của thị trường JP dùng cả hai một cách CÓ NGHĨA. Dùng NFC.
export function normalize(raw: string): string {
  return raw
    // ① chuẩn hoá Unicode — NFC, không NFKC
    .normalize("NFC")
    // ② BOM
    .replace(/^﻿/, "")
    // ③ xuống dòng: CRLF và CR về LF
    .replace(/\r\n?/g, "\n")
    // ④ khoảng trắng lạ về dấu cách thường.
    //    KHÔNG đụng U+3000 (ideographic space) — nó có nghĩa trong văn bản JP.
    .replace(/[  -   ]/g, " ")
    // ⑤ gộp dấu cách và tab liên tiếp; giữ nguyên xuống dòng
    .replace(/[ \t]+/g, " ")
    // ⑥ cắt khoảng trắng đầu/cuối mỗi dòng, rồi gộp dòng trống liên tiếp
    //
    // ⚠ KHÔNG dùng `String.prototype.trim()`. Nó cắt theo định nghĩa khoảng
    // trắng của ECMAScript, và định nghĩa đó GỒM U+3000 — nên bước ④ giữ lại
    // U+3000 rồi bước này xoá ngay, đúng thứ ④ nói là không được đụng.
    // Đã đo: `("x" + U+3000).trim()` trả `"x"`.
    //
    // Hệ quả nếu để nguyên: văn bản JP dùng U+3000 thụt đầu dòng (cách viết
    // thông thường) mất thụt ở bản chuẩn hoá nhưng còn ở bản thô, nên mọi
    // offset câu trích lệch — và triệu chứng trông y hệt *mô hình bịa câu
    // trích*, tức chẩn đoán sẽ đi sai hướng.
    .split("\n")
    .map((l) => l.replace(/^[ \t]+/, "").replace(/[ \t]+$/, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^[ \t\n]+/, "")
    .replace(/[ \t\n]+$/, "");
}

/// LUỸ ĐẲNG: `normalize(normalize(x)) === normalize(x)`.
/// Có phép kiểm riêng, vì mất tính này thì offset của một Phát hiện cũ trôi
/// mà không ai biết.
export function isIdempotent(raw: string): boolean {
  const once = normalize(raw);
  return normalize(once) === once;
}

/// `BR-D2`: đích so khớp là bản CHUẨN HOÁ, không phải bản thô.
/// Ai cài phép so đối chiếu với bản thô sẽ làm MỌI Phát hiện rụng, với triệu
/// chứng giống hệt *"mô hình bịa câu trích"*.
/// ⚠ Trả KÈM `normalizedQuote`, và bên gọi phải lưu chính chuỗi đó.
///
/// `start`/`end` là chỉ số vào `normalizedText`, nên chữ lưu kèm phải là chữ
/// nằm ở đúng khoảng ấy. Lưu bản thô mà bên gọi đưa thì hai cột nói hai chuyện
/// ngay khi mô hình trả câu trích có dấu cách kép — và triệu chứng là màn hình
/// tô sáng một đoạn khác với chữ nó hiển thị.
export function findQuote(
  normalizedText: string,
  quote: string,
): { start: number; end: number; normalizedQuote: string } | null {
  const q = normalize(quote);
  const i = normalizedText.indexOf(q);
  return i < 0 ? null : { start: i, end: i + q.length, normalizedQuote: q };
}
