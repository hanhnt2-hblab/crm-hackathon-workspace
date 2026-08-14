// `C5-12` · `E3-S1`…`E3-S4` · `FR-51` — Gợi ý.
//
// BỐN lối ra, không phải ba: `duyet` · `sua_roi_duyet` · `bo` là của người;
// `dong_he_thong` là của hệ thống và KHÔNG vào mẫu số chỉ số nào (`D26`,
// `FR-51`) — không ai quyết gì cả.

import type { Actor } from "@/core/actor";
/// `AD-CR-7`: lõi TỰ mở giao dịch, nên không nhận `tx` từ ngoài.
import { tx } from "@/core/db";
import type { CoreContext } from "@/core/context";

const CHUA = "chưa hiện thực";

export type DecideInput = {
  suggestionId: string;
  outcome: "duyet" | "sua_roi_duyet" | "bo";
  /// Bắt buộc khi `outcome === "bo"`. Enum, không nhập tự do (`BR-D10`).
  /// Khớp TỪNG CHỮ với `enum DropReason`. ⚠ Không phải `trung_lap`/`chua_den_luc`.
  /// `thong_tin_sai` là giá trị DUY NHẤT vào tử số `errorDetectionRate` (`D30`).
  dropReason?: "thong_tin_sai" | "khong_lien_quan" | "da_cu" | "hieu_sai_ngu_canh" | "khac" | null;
  /// Chỉ có nghĩa với `sua_roi_duyet`.
  editedValue?: string | null;
  /// `BR-B6` — đo từ lúc MỞ CHI TIẾT một Gợi ý, không từ lúc mở hàng đợi.
  decisionSeconds: number;
};

/// Ghi CÓ ĐIỀU KIỆN `where status='cho'` — nếu không, người có thể đè lên một
/// quyết định mà hệ thống vừa ghi trong lúc màn hình đang mở.
export function decideSuggestion(_actor: Actor, _input: DecideInput, _ctx: CoreContext): Promise<void> {
  throw new Error(CHUA);
}

/// `FR-51` — một ô một Gợi ý chờ. Gợi ý mới trên ô đã có Gợi ý chờ thì đóng cái
/// cũ bằng `dong_he_thong` + `co_goi_y_moi_hon` TRONG CÙNG giao dịch rồi mới
/// chèn; không làm thế thì vi phạm `suggestion_one_pending_per_slot` và hỏng cả
/// vòng quét.
export function createSuggestion(_actor: Actor, _input: {
  accountId: string; signalId: string; targetField: string | null;
  currentValue: string | null; proposedValue: string;
}, _ctx: CoreContext): Promise<{ id: string }> {
  throw new Error(CHUA);
}
