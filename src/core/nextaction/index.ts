// `C5-7` · `C5-13`…`C5-15` · `BR-B1` · `FR-34` — Việc tiếp theo.
//
// `content` và `dueDate` NULLABLE: `BR-B1` nói thiếu một trong hai vẫn lưu
// được, chỉ mang cờ. Tối đa MỘT hàng đang sống mỗi Cơ hội, canh bằng chỉ
// mục một phần `next_action_one_active`.

import type { Actor } from "@/core/actor";
/// `AD-1`: `src/core` KHÔNG được nhập `src/capability` — chiều phụ thuộc là
/// ④ → ⑤, không ngược lại. `Tx` có sẵn ngay trong lõi; nhập `PrismaTx` từ
/// tầng ④ là đi vòng qua chính ranh giới mình thuộc về.
import type { Tx } from "@/core/db";

const CHUA = "chưa hiện thực";

export type SetNextActionInput = {
  opportunityId: string;
  content: string | null;
  dueDate: Date | null;
};

export function setNextAction(_tx: Tx, _actor: Actor, _input: SetNextActionInput): Promise<void> {
  throw new Error(CHUA);
}

/// `FR-34` — KIỂM-VÀ-GHI NGUYÊN TỬ. Chỉ ghi khi ô vẫn đúng giá trị máy đã đọc.
/// 0 hàng bị chạm thì BỎ LƯỢT GHI, không thử lại (`AD-10`).
///
/// Thiếu hàm này thì: vòng quét đọc lúc 10:00:30, người lưu lúc 10:00:31, máy
/// đè lúc 10:00:32 — vi phạm `D12`, đúng thứ nhóm 4 hứa tuyệt đối không làm.
/// Trả `true` khi đã ghi, `false` khi bỏ lượt.
export function fillNextActionIfUnchanged(_tx: Tx, _actor: Actor, _input: {
  opportunityId: string;
  expectedContent: string | null;
  content: string;
  dueDate: Date;
  sourceSignalId: string;
}): Promise<boolean> {
  throw new Error(CHUA);
}

/// `D14` · `C5-15` — Hoàn tác MỘT cú bấm trong 7 ngày.
///
/// Đường phổ biến nhất là ô VỐN TRỐNG (mức tự do chỉ cho điền ô trống), nên
/// *nguyên trạng* ở đó nghĩa là KHÔNG CÓ Việc tiếp theo — xoá mềm hàng, trả
/// `null`, không trả chuỗi rỗng.
///
/// Bấm lần hai là no-op. Người đã sửa tay thì Hoàn tác không ghi đè: ghi có
/// điều kiện `where set_by='he_thong' AND undo_deadline_at > now()`.
export function undoSystemNextAction(_tx: Tx, _actor: Actor, _opportunityId: string): Promise<boolean> {
  throw new Error(CHUA);
}
