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

import { isHuman, type Actor } from "@/core/actor";
/// `AD-CR-7`: lõi TỰ mở giao dịch, nên không nhận `tx` từ ngoài.
import { tx, type Tx } from "@/core/db";
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
export async function appendTimelineEntry(
  actor: Actor,
  input: AppendEntryInput,
  ctx: CoreContext,
): Promise<{ id: string }> {
  return tx(async (t) => {
    const id = await appendEntryWithin(t, actor, input);
    await ctx.audit.complete(t, ctx.auditId, "ok", { after: { id } });
    return { id };
  });
}

/// Dùng lại TRONG một giao dịch đã mở — `changeOpportunityStage` gọi nó ở bước
/// ⑤ của `AD-CR-7`. Tách ra vì mở giao dịch lồng là `TypeError` lúc chạy trên
/// ITX client, và vì mục Dòng thời gian phải cuộn lại CÙNG thao tác sinh ra nó:
/// một mục kể chuyện đã bị rollback là đúng thứ `AD-CR-7` dựng thứ tự để tránh.
export async function appendEntryWithin(
  t: Tx,
  actor: Actor,
  input: AppendEntryInput,
): Promise<string> {
  // Hàng `timeline` là 1-1 BẮT BUỘC và được tạo cùng `createCompany`. Không
  // tìm thấy nghĩa là Công ty dựng bằng một đường khác — hỏng ồn ào ở đây tốt
  // hơn lỗi khoá ngoại ở câu sau.
  const timeline = await t.timeline.findUnique({
    where: { accountId: input.accountId },
    select: { id: true },
  });
  if (!timeline) {
    throw new Error(`Công ty ${input.accountId} không có Dòng thời gian — dữ liệu hỏng.`);
  }
  const row = await t.timelineEntry.create({
    data: {
      timelineId: timeline.id,
      content: input.content,
      occurredAt: input.occurredAt,
      // Suy từ `actor`, không nhận từ tham số. `seed` ghi như `he_thong`: bộ
      // gieo không phải một người, và mục nó tạo không được trông như của Sales.
      addedBy: isHuman(actor) ? "nguoi" : "he_thong",
      sourceSignalId: input.sourceSignalId ?? null,
    },
    select: { id: true },
  });
  return row.id;
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

export async function readTimeline(
  _actor: Actor,
  accountId: string,
): Promise<Array<{ id: string; content: string; occurredAt: Date; addedBy: string }>> {
  return tx(async (t) => {
    const timeline = await t.timeline.findUnique({
      where: { accountId },
      select: { id: true },
    });
    if (!timeline) return [];
    return t.timelineEntry.findMany({
      where: { timelineId: timeline.id },
      // Khoá sắp BA TẦNG: hai lần đọc phải cho cùng thứ tự, và `T-8` đếm theo nó.
      orderBy: [{ occurredAt: "desc" }, { createdAt: "desc" }, { id: "desc" }],
      select: { id: true, content: true, occurredAt: true, addedBy: true },
    });
  });
}
