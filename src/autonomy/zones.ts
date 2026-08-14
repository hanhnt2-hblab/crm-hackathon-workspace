// `AD-GT-3` · `AD-GT-5` — vùng ranh giới, khai bằng HẰNG SỐ.
//
// `AD-GT-3`: ontology đối chiếu bằng PHÉP KIỂM, không bằng lời nhập. Tệp này
// không đọc `src/ontology/crm.ontology.md` lúc chạy — nó khai lại danh sách, và
// một phép kiểm ở `tests/` khẳng định hai bên khớp. Đọc tài liệu lúc chạy là
// đưa một tệp markdown vào đường găng của `npm start`.

import type { Actor } from "@/core/actor";
import type { GateEntry } from "./gate";

/// NĂM mã ranh giới (`AD-GT-3`): **bốn** của đề bài `§5`, **cộng một** đội tự
/// thêm là `NFR-19` (`D46`). Chú thích cũ ghi *"bốn"* rồi liệt kê năm — sai chữ,
/// không sai mảng.
///
/// ⚠ Mã ở đây là mã `NFR` của PRD §9, KHÔNG phải một từ vựng mới. `NFR-15` gộp
/// hai việc (*không tự đánh Thắng/Thua* và *không tự sửa giá trị tiền*) vì đề
/// bài gộp chúng ở ranh giới thứ hai.
export const BOUNDARY_CODES = [
  "NFR-14", // không tự đổi Giai đoạn
  "NFR-15", // không tự đánh Thắng/Thua, không tự sửa giá trị tiền
  "NFR-16", // không tự liên hệ khách
  "NFR-17", // không tự xoá dữ liệu do người tạo
  "NFR-19", // không tự sửa mục Timeline do người tạo
] as const;

export type BoundaryCode = (typeof BOUNDARY_CODES)[number];

/// `AD-GT-5` — ranh giới gắn vào CAPABILITY, không gắn vào tham số lời gọi.
///
/// Đây là quyết định chịu lực. Gắn vào tham số thì Cổng phải hiểu nội dung mỗi
/// lời gọi — tức phải biết `updateOpportunity({stage})` là chạm `NFR-14` còn
/// `updateOpportunity({name})` thì không. Gắn vào capability thì sổ đăng ký khai
/// một lần ở `touches`, và Cổng chỉ đọc danh sách.
///
/// Cái giá: hai capability khác nhau cho hai việc mà một hàm làm được. Đó là
/// giá đúng — nó buộc `AD-2` chia capability theo ranh giới chứ không theo bảng.
///
/// Trả `null` khi không chạm ranh giới nào. Trả mã ĐẦU TIÊN chạm phải theo thứ
/// tự `BOUNDARY_CODES`, để hai lần chạy trên cùng đầu vào cho cùng một mã —
/// không có luật này thì thứ tự phụ thuộc thứ tự khai trong `touches`.
export function crossesBoundary(
  entry: GateEntry,
  actor: Actor,
): BoundaryCode | null {
  // Năm ranh giới `§5` nói về việc MÁY không được tự làm. Người làm những việc
  // đó là bình thường — đó là toàn bộ nhóm 1 của đề bài.
  if (actor.kind !== "system") return null;
  if (entry.touches.length === 0) return null;

  // Trả mã ĐẦU TIÊN theo thứ tự `BOUNDARY_CODES`, không theo thứ tự khai trong
  // `touches`. Không có luật này thì cùng một capability, hai người khai
  // `touches` theo hai thứ tự, cho hai mã lý do khác nhau trong ghi vết.
  for (const code of BOUNDARY_CODES) {
    if (entry.touches.includes(code)) return code;
  }
  return null;
}
