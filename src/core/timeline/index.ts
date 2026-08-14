// `C5-6` · `E1-S7` · `FR-6` — Dòng thời gian hợp nhất.
//
// ⚠ Bản trước của tệp này khai `kind: TimelineEntryKind`, `body`, và
// `bySystem: boolean` — KHÔNG cột nào trong ba tồn tại. Bảng `timeline_entry`
// thật có: `content` · `occurred_at` · `added_by` (enum `SetBy`) ·
// `source_signal_id`. Khai một trường không có chỗ chứa là hợp đồng hứa một
// thứ tầng dưới không giữ nổi.
//
// `bySystem: boolean` còn sai theo cách thứ hai: nó cho phép khai trạng thái
// bất khả `{ bySystem: true }` với `actor.kind === "human"`. Nguồn sự thật là
// `actor`, và `added_by` suy từ nó — đúng luật một-nguồn mà `gate.ts` nêu.
//
// Hàng `timeline` là quan hệ 1-1 BẮT BUỘC với Công ty, nên nó phải được tạo
// trong CÙNG giao dịch với `createCompany`. Thiếu bước đó thì máy thêm mục vào
// Công ty mới gieo sẽ ăn lỗi khoá ngoại — đúng đường `T-8`.

import type { Actor } from "@/core/actor";
/// `AD-CR-7`: lõi TỰ mở giao dịch, nên không nhận `tx` từ ngoài.
import { tx } from "@/core/db";
import type { CoreContext } from "@/core/context";

const CHUA = "chưa hiện thực";

export type AppendEntryInput = {
  accountId: string;
  /// Khớp cột `content`, không phải `body`.
  content: string;
  /// Ngày SỰ KIỆN, có thể lùi so với ngày ghi — mục do máy thêm mang ngày trong
  /// tin, có khi lùi vài tuần.
  ///
  /// ⚠ Khoá sắp là `occurredAt DESC, createdAt DESC, id DESC`. Tiebreaker này
  /// KHÔNG có mã thượng nguồn — `C5-6` chỉ nói *"mới nhất trên"*. Nó tồn tại vì
  /// `T-8` đếm mục theo thứ tự, và thiếu nó thì hai lần đọc cho hai kết quả.
  /// Cần một dòng chốt ở `C5-6` hoặc ở spine tầng ⑤.
  occurredAt: Date;
  /// `AD-22` — mục do máy thêm trace ngược về Phát hiện sinh ra nó. Thiếu
  /// trường này thì cột *nguồn* trên giao diện trống và `NFR-19` mất vế chứng
  /// minh *"máy chỉ THÊM, và thêm từ đâu thì nói được"*.
  sourceSignalId?: string | null;
};

/// `added_by` KHÔNG phải tham số: nó suy từ `actor` (`AD-5`). Người gọi không
/// khai được *"mục này do máy thêm"* trong khi tác nhân là người.
export function appendTimelineEntry(
  _actor: Actor,
  _input: AppendEntryInput,
  _ctx: CoreContext,
): Promise<{ id: string }> {
  throw new Error(CHUA);
}

/// `NFR-19` — máy chỉ được THÊM mục mới, không sửa mục do người tạo.
///
/// Tham số gói vào object có chủ đích: dạng `(tx, actor, id, content)` để hai
/// `string` đứng liền nhau, và gọi ngược thì ghi nội dung vào mệnh đề `where` —
/// `updateMany` chạm 0 hàng, không lỗi, mất bản sửa mà không ai biết.
export function updateTimelineEntry(
  _actor: Actor,
  _input: { id: string; content: string },
  _ctx: CoreContext,
): Promise<void> {
  throw new Error(CHUA);
}

export function readTimeline(_actor: Actor, _accountId: string): Promise<unknown[]> {
  throw new Error(CHUA);
}
