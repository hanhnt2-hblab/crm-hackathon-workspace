// `AD-CP-1` · `AD-CP-2` · `AD-CP-5` — sổ đăng ký, tầng ④.
//
// Đây là nơi DUY NHẤT tầng ② nhìn thấy capability, và là nơi bảy bước của
// `AD-4` được chạy thật.
//
// ⚠ KHÔNG singleton mức module. `createRegistry` là nhà máy vì `tests/` phải
// dựng **hai thực thể độc lập trong cùng tiến trình**: `seedRegistry({seedMode:
// true, auditSink: nullSink})` cho `beforeEach`, và `appRegistry({seedMode:
// false, auditSink: realSink})` cho phần khẳng định (`AD-4`). Singleton không
// cho phép điều đó, và cái giá là `T-4`/`T-10` không dựng được kịch bản.
//
// ⚠ `seedMode` là tham số DỰNG của SỔ ĐĂNG KÝ, không phải của Cổng (`AD-4`), và
// `auditSink` chọn MỘT LẦN lúc dựng (`AD-CR-8`). Hệ quả bắt buộc: tầng ④ **không
// có nhánh `if (seed)`** trong thân hàm nào. Miễn trừ ghi vết là chuyện chọn
// sink lúc dựng, không phải chuyện rẽ nhánh lúc chạy — đó là chỗ cờ
// `--keep-audit` dễ bị đọc nhầm nhất.

import type { Actor } from "@/core/actor";
import type { AuditSink } from "@/core/audit";
import type { BoundCapability, CapName } from "./types";

export type Registry = {
  /// `AD-CP-1` — trả CLOSURE đã gắn `actor`, không trả `entry.fn` trần.
  /// Bên gọi cầm được `fn` trần là có một đường vòng qua Cổng.
  loadCapability(name: CapName, actor: Actor): Promise<BoundCapability>;

  /// `AD-CP-1` — BỐN danh sách tên, cắt theo HẠNG TÁC NHÂN, không theo đọc/ghi.
  /// Đây là bề mặt `T-10b` khẳng định trên, và nó chứng minh bằng **vắng mặt**:
  /// không mục nào xoá dữ liệu người tạo, không mục nào sửa mục Timeline người
  /// tạo. Cắt theo đọc/ghi thì khẳng định đó không phát biểu được.
  CAP_MACHINE_ALLOWED_GHI: readonly CapName[]; // sáu tên
  CAP_MACHINE_ALLOWED_DOC: readonly CapName[]; // năm tên
  CAP_HUMAN_ONLY: readonly CapName[];
  CAP_SYSTEM_INTERNAL: readonly CapName[];
};

/// `AD-CP-5` — thứ tự bắt buộc bên trong `loadCapability`:
///   ① tra sổ → `entry | undefined`
///   ② `collectGateContext(actor, seedMode)` — ném thì ném XUYÊN, không ghi vết
///      (`AD-GT-2`: CSDL chết là sự cố hạ tầng, không phải chính sách chặn)
///   ③ `decide(entry, actor, ctx)` — hàm thuần của tầng ③
///   ④ ghi vết PHA 1 (`AD-CP-2`) — kể cả khi bị từ chối
///   ⑤ kiểm tham số theo `entry.params` — SAU `decide`, không phải trước
///   ⑥ gọi `entry.fn` — và CHỈ gọi
///
/// ⚠ Bước ⑥ KHÔNG mở giao dịch. Bản trước của chú thích này viết *"mở giao dịch
/// nếu `kind === 'write'`"*, mâu thuẫn thẳng với `AD-CP-5` bước ⑦ (*"tầng ④
/// KHÔNG mở giao dịch; lõi mở nó bên trong hàm"*), với `AD-CR-7`, và với chính
/// `CapContext` ở `./types.ts` vốn cố ý không mang `tx`. Người đọc mà tin bản
/// cũ sẽ mở `db.$transaction` ở tầng này, và `completeAuditRow` rơi ra ngoài
/// giao dịch chính — bất biến ② của `AD-4` vỡ im lặng.
///
/// ⚠ Bước ⑤ SAU bước ③ là có chủ đích: tham số sai lược đồ trên một capability
/// mà tác nhân vốn không được gọi phải trả `actor_not_allowed`, không trả lỗi
/// tham số — nếu không, thông điệp lỗi tự nó rò rỉ sự tồn tại của capability đó.
///
/// ⚠ Tầng ④ **không bao giờ** gọi `completeAuditRow`. Đó là bước ⑥ của
/// `AD-CR-7` và lõi là bên gọi, vì chỉ lõi mới ở trong giao dịch.
export function createRegistry(_deps: {
  seedMode: boolean;
  auditSink: AuditSink;
}): Registry {
  throw new Error("chưa hiện thực");
}
