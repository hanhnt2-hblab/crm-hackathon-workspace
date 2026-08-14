// `C5-9` · `C5-10` · `BR-D1` · `BR-D2` — Phát hiện.
//
// Phát hiện là BẰNG CHỨNG: không xoá theo cascade của Công ty, và `NFR-17`
// cấm máy xoá. Câu trích phải khớp NGUYÊN VĂN một đoạn của Bản lưu sau
// chuẩn hoá; không khớp thì LOẠI và ghi nhật ký, không lưu kèm cảnh báo.

import type { Actor } from "@/core/actor";
/// `AD-1`: `src/core` KHÔNG được nhập `src/capability` — chiều phụ thuộc là
/// ④ → ⑤, không ngược lại. `Tx` có sẵn ngay trong lõi; nhập `PrismaTx` từ
/// tầng ④ là đi vòng qua chính ranh giới mình thuộc về.
import type { Tx } from "@/core/db";

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

export function createSignal(_tx: Tx, _actor: Actor, _input: CreateSignalInput): Promise<{ id: string }> {
  throw new Error(CHUA);
}

/// `FR-42` — nút *không hữu ích*, một trong hai đường vào `errorDetectionRate`.
export function markSignalUnhelpful(_tx: Tx, _actor: Actor, _id: string): Promise<void> {
  throw new Error(CHUA);
}
