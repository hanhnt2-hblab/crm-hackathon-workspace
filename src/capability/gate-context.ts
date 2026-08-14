// `AD-CP-7` · `AD-GT-1` · `AD-GT-2` — gom ngữ cảnh cho Cổng.
//
// Hàm này ở tầng ④ chứ không ở tầng ③ vì nó ĐỌC CƠ SỞ DỮ LIỆU, và tầng ③ không
// được nhập giá trị nào ra ngoài chính nó (`AD-GT-4`). Tách như vậy giữ được
// câu của `AD-4`: *"Cổng kiểm thử được bằng bảng vào/ra, không cần cơ sở dữ
// liệu"* — bảng vào/ra chính là `GateContext`.

import type { Actor } from "@/core/actor";
import type { GateContext } from "@/autonomy/gate";
import { getSettingBool, getSettingNumber } from "@/core/settings";
import { readActiveScanUsage } from "@/core/scanlog";

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
export async function collectGateContext(
  actor: Actor,
  seedMode: boolean,
): Promise<GateContext> {
  // Đường tắt cho tác nhân KHÔNG phải máy. Bước ⑥ và ⑦ của `AD-4` chỉ áp cho
  // `system`, nên đọc bốn con số về lượt gọi và ngân sách cho một cú bấm của
  // Sales là bốn truy vấn không ai dùng — trên đường nóng của mọi thao tác.
  //
  // Không phải tối ưu sớm: nó còn sửa một lỗ thật. Người bấm nút thì KHÔNG có
  // lượt quét nào đang chạy, nên `ScanLog` không có hàng để đọc — và hàm sẽ
  // phải đoán một giá trị, rồi giá trị đoán đó đi vào một quyết định.
  if (actor.kind !== "system") {
    return {
      seedMode,
      aiEnabled: true,
      modelCallsUsed: 0,
      modelCallsLimit: Number.POSITIVE_INFINITY,
      budgetUsedRatio: 0,
      budgetStopRatio: 1,
    };
  }

  const [aiEnabled, modelCallsLimit, budgetStopRatio, scanBudgetUsd] = await Promise.all([
    getSettingBool("ai_enabled"),
    getSettingNumber("model_calls_per_scan"),
    getSettingNumber("budget_stop_ratio"),
    getSettingNumber("scan_budget_usd"),
  ]);

  // Tầng ④ KHÔNG cầm `db` (`AD-1`). Lõi đọc hộ, và nó cũng là bên duy nhất
  // biết hình dạng bảng `ScanLog`.
  const scan = await readActiveScanUsage();
  const used = scan?.costUsedUsd ?? 0;
  return {
    seedMode,
    aiEnabled,
    modelCallsUsed: scan?.modelCallsUsed ?? 0,
    modelCallsLimit,
    // ⚠ `scanBudgetUsd` bằng 0 cho `Infinity` hoặc `NaN`. Cổng bắt cả hai ở
    // bước ⑥ (`Number.isFinite`), nên ở đây KHÔNG được lặng lẽ thay bằng 0 —
    // thay là biến một cấu hình hỏng thành *"còn nguyên ngân sách"*.
    budgetUsedRatio: scanBudgetUsd > 0 ? used / scanBudgetUsd : Number.NaN,
    budgetStopRatio,
  };
}
