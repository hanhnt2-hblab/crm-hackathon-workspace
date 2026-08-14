// `AD-CR-7` · `AD-CR-8` · `AD-21` — ngữ cảnh một thao tác ghi, do tầng ④ dựng
// và truyền xuống lõi.
//
// ⚠ KHÔNG mang `tx`, và đó là điểm mấu chốt. `AD-CR-7` đặt `BEGIN` **trong lõi**:
// hàm lõi tự mở giao dịch của mình rồi chạy sáu bước bên trong. Tầng ④ mở thêm
// một giao dịch nữa là hai giao dịch trên hai kết nối, và bước ⑥
// (`completeAuditRow`) rơi ra ngoài giao dịch chính — bất biến ② của `AD-4` vỡ
// im lặng, không lỗi nào.
//
// ⚠ MANG `audit`, và đó là thứ `AD-CP-4` không cấm. Lõi phải gọi được pha 2 của
// ghi vết TỪ BÊN TRONG giao dịch của nó (`AD-CR-8`), mà bộ ghi vết được chọn
// MỘT LẦN lúc dựng sổ đăng ký theo `seedMode` (`AD-CR-8`). Truyền xuống là cách
// duy nhất để lõi không phải tự biết chế-độ-gieo — và nó không được biết, vì
// một nhánh `if (seed)` trong lõi là đúng chỗ cờ `--keep-audit` bị đọc nhầm.

import type { AuditSink } from "./audit";

export type CoreContext = {
  /// `null` khi bộ ghi vết đang câm (chế-độ-gieo không kèm `--keep-audit`).
  /// Lõi vẫn gọi `audit.complete(...)` bình thường — sink câm tự bỏ qua. Rẽ
  /// nhánh theo `auditId === null` ở lõi là dựng lại đúng nhánh `if (seed)` mà
  /// `AD-CR-8` đã bỏ công loại.
  auditId: string | null;
  /// `AD-21` — chuỗi hệ quả. Thao tác do người bấm thì `null`; thao tác sinh ra
  /// bởi một thao tác khác mang tên capability đã gây ra nó.
  causedBy: string | null;
  audit: AuditSink;
};
