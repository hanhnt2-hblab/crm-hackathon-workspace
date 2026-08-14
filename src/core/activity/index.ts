// `C5-6` · `E1-S6` · `FR-6` — Hoạt động.
//
// Khoá ngoại `contact_id` chỉ bắt được *có tồn tại*. Luật *chỉ chọn trong
// phạm vi Công ty đó* do lõi canh — không có nó thì Hoạt động của Công ty
// A gắn được người của Công ty B.

import type { Actor } from "@/core/actor";
/// `AD-1`: `src/core` KHÔNG được nhập `src/capability` — chiều phụ thuộc là
/// ④ → ⑤, không ngược lại. `Tx` có sẵn ngay trong lõi; nhập `PrismaTx` từ
/// tầng ④ là đi vòng qua chính ranh giới mình thuộc về.
import type { Tx } from "@/core/db";

const CHUA = "chưa hiện thực";

export type CreateActivityInput = {
  accountId: string;
  opportunityId?: string | null;
  /// Phải thuộc CÙNG Công ty với `accountId` — lõi canh, khoá ngoại không canh.
  contactId?: string | null;
  occurredAt: Date;
  type: "gap" | "goi" | "gui_thu" | "khac";
  description?: string | null;
};

export function createActivity(_tx: Tx, _actor: Actor, _input: CreateActivityInput): Promise<{ id: string }> {
  throw new Error(CHUA);
}

/// `NFR-19` — máy KHÔNG sửa được Hoạt động do người tạo.
export function updateActivity(_tx: Tx, _actor: Actor, _id: string, _patch: Partial<CreateActivityInput>): Promise<void> {
  throw new Error(CHUA);
}
