// `AD-CP-7` · `AD-GT-1` · `AD-GT-2` — gom ngữ cảnh cho Cổng.
//
// Hàm này ở tầng ④ chứ không ở tầng ③ vì nó ĐỌC CƠ SỞ DỮ LIỆU, và tầng ③ không
// được nhập giá trị nào ra ngoài chính nó (`AD-GT-4`). Tách như vậy giữ được
// câu của `AD-4`: *"Cổng kiểm thử được bằng bảng vào/ra, không cần cơ sở dữ
// liệu"* — bảng vào/ra chính là `GateContext`.

import type { Actor } from "@/core/actor";
import type { GateContext } from "@/autonomy/gate";

/// Chạy MỖI LỜI GỌI capability, trước `decide` (`AD-CP-5` bước ②).
///
/// ⚠ Lỗi gom KHÔNG thành một lần từ chối (`AD-GT-2`). Thiếu hàng `settings` hay
/// không ép được kiểu thì hàm này **ném xuyên**, và lời gọi hỏng như một sự cố
/// hạ tầng — xếp `FT10`. Biến nó thành `{allowed:false}` là nói dối: hệ thống
/// không hề áp một chính sách nào, nó chỉ không đọc được cấu hình.
///
/// `modelCallsUsed` và `budgetUsedRatio` lấy từ **cùng một hàng `ScanLog`** của
/// lượt quét đang chạy. Hai nguồn cho hai vế là cách chắc chắn để tỉ lệ nhảy
/// giữa hai lời gọi liền nhau.
///
/// `seedMode` truyền vào chứ không tự đọc: nó là tham số dựng của
/// `createRegistry` (`AD-4`), và đây là chuyền tham số, không phải rẽ nhánh.
export function collectGateContext(
  _actor: Actor,
  _seedMode: boolean,
): Promise<GateContext> {
  throw new Error("chưa hiện thực");
}
