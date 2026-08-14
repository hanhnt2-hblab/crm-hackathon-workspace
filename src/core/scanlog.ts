// `AD-11` · `AD-CP-7` — số đo của lượt quét đang chạy.
//
// Hàm này ở LÕI chứ không ở tầng ④, dù chỉ tầng ④ gọi nó. Lý do là ranh giới
// `AD-1`: tầng ④ không cầm `db`. Nếu `collectGateContext` tự truy vấn `ScanLog`
// thì tầng ④ phải nhập client, và luật lint bác — đúng, vì khi đó tầng ④ biết
// hình dạng bảng, và một lần đổi cột kéo theo sửa ở hai tầng.

import { db } from "./db";

export type ActiveScanUsage = {
  /// `null` khi KHÔNG có lượt quét nào đang chạy — người bấm nút trên giao diện
  /// là trường hợp phổ biến nhất. Đừng thay bằng 0: *"không có lượt quét"* và
  /// *"lượt quét chưa tiêu gì"* là hai chuyện khác nhau, và gộp chúng làm phanh
  /// ngân sách đọc một hàng không tồn tại rồi kết luận còn nguyên trần.
  modelCallsUsed: number;
  costUsedUsd: number;
} | null;

/// Tử số và mẫu số của cả hai trần lấy từ CÙNG MỘT hàng — hàng của lượt quét
/// đang chạy. Hai truy vấn cho hai vế là cách chắc chắn để tỉ lệ nhảy giữa hai
/// lời gọi liền nhau, và phanh bật tắt theo nhịp không ai giải thích được.
export async function readActiveScanUsage(): Promise<ActiveScanUsage> {
  const row = await db.scanLog.findFirst({
    where: { finishedAt: null },
    orderBy: { startedAt: "desc" },
    select: { modelCallsUsed: true, costUsedUsd: true },
  });
  if (!row) return null;
  return {
    modelCallsUsed: row.modelCallsUsed,
    costUsedUsd: Number(row.costUsedUsd),
  };
}
