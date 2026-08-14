// `C5-3` · `E1-S3` · `FR-3` — Cơ hội (phần CRUD).
//
// Máy trạng thái nằm ở `./stage.ts`, KHÔNG ở đây. Tệp này chỉ tạo, sửa,
// xoá mềm và đọc. Giai đoạn khởi tạo lấy từ hằng `INITIAL_STAGE` (`D44`);
// hàm tạo **không nhận** tham số giai đoạn.

import type { Actor } from "@/core/actor";
/// `AD-1`: `src/core` KHÔNG được nhập `src/capability` — chiều phụ thuộc là
/// ④ → ⑤, không ngược lại. `Tx` có sẵn ngay trong lõi; nhập `PrismaTx` từ
/// tầng ④ là đi vòng qua chính ranh giới mình thuộc về.
import type { Tx } from "@/core/db";

const CHUA = "chưa hiện thực";

export type CreateOpportunityInput = {
  accountId: string;
  name: string;
  /// Không âm, canh bằng `CHECK opp_amount_non_negative` (`BR-D9`).
  amount?: string | null;
  expectedCloseMonth?: string | null;
};

/// `D44` — KHÔNG nhận tham số giai đoạn. Cơ hội mới luôn vào `INITIAL_STAGE`.
export function createOpportunity(_tx: Tx, _actor: Actor, _input: CreateOpportunityInput): Promise<{ id: string }> {
  throw new Error(CHUA);
}

export function updateOpportunity(_tx: Tx, _actor: Actor, _id: string, _patch: Partial<CreateOpportunityInput>): Promise<void> {
  throw new Error(CHUA);
}

export function softDeleteOpportunity(_tx: Tx, _actor: Actor, _id: string): Promise<void> {
  throw new Error(CHUA);
}

/// `C5-5` · `BR-B2` — hai ô dấu hiệu. `false` là ĐÃ TRẢ LỜI, khác `null` chưa hỏi.
export function setQualificationSignals(_tx: Tx, _actor: Actor, _id: string, _v: {
  needSignal: boolean | null; budgetSignal: boolean | null;
}): Promise<void> {
  throw new Error(CHUA);
}

/// `C5-8` · `BR-B3` · `D27` — enum dạng MẢNG cộng một ô ghi chú, không phải câu tự do.
export function setLossReasons(_tx: Tx, _actor: Actor, _id: string, _v: {
  reasons: readonly string[]; note: string | null;
}): Promise<void> {
  throw new Error(CHUA);
}
