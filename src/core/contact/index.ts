// `C5-2` · `E1-S2` · `FR-2` · `BR-D4` — Người liên hệ và Đầu mối chính.
//
// `BR-D4` canh bằng chỉ mục MỘT PHẦN `contact_one_primary`, không bằng
// *đặt trong cùng giao dịch*. Giao dịch cho tính nguyên tử, chỉ mục cho
// tính duy nhất: hai giao dịch cùng đọc *chưa có ai* rồi cùng ghi sẽ tạo
// hai Đầu mối chính mà không bên nào lỗi.

import type { Actor } from "@/core/actor";
/// `AD-1`: `src/core` KHÔNG được nhập `src/capability` — chiều phụ thuộc là
/// ④ → ⑤, không ngược lại. `Tx` có sẵn ngay trong lõi; nhập `PrismaTx` từ
/// tầng ④ là đi vòng qua chính ranh giới mình thuộc về.
import type { Tx } from "@/core/db";

const CHUA = "chưa hiện thực";

export type CreateContactInput = {
  accountId: string;
  name: string;
  title?: string | null;
  email?: string | null;
};

export function createContact(_tx: Tx, _actor: Actor, _input: CreateContactInput): Promise<{ id: string }> {
  throw new Error(CHUA);
}

/// Đặt người mới thì người cũ tự mất nhãn — trong CÙNG giao dịch, và chỉ mục
/// một phần là thứ bảo đảm không bao giờ có hai.
export function setPrimaryContact(_tx: Tx, _actor: Actor, _contactId: string): Promise<void> {
  throw new Error(CHUA);
}

/// Xoá Đầu mối chính để lại Công ty 0 đầu mối — KHÔNG lỗi, không tự chọn người khác.
export function softDeleteContact(_tx: Tx, _actor: Actor, _id: string): Promise<void> {
  throw new Error(CHUA);
}
