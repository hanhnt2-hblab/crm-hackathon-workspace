// `C5-6` · `E1-S6` · `FR-6` — Hoạt động.
//
// Khoá ngoại `contact_id` chỉ bắt được *có tồn tại*. Luật *chỉ chọn trong
// phạm vi Công ty đó* do lõi canh — không có nó thì Hoạt động của Công ty
// A gắn được người của Công ty B.

import type { Actor } from "@/core/actor";
/// `AD-CR-7`: lõi TỰ mở giao dịch, nên không nhận `tx` từ ngoài.
import { tx } from "@/core/db";
import type { CoreContext } from "@/core/context";
import { isHuman } from "@/core/actor";
import { appendEntryWithin } from "@/core/timeline";
import { BusinessRuleError } from "@/core/errors";

const BT = "`";

/// Nhãn hiển thị cho mục Dòng thời gian. Bốn giá trị enum là tiếng Việt KHÔNG
/// DẤU theo Mục 0; bảng này chỉ đổi chúng thành chữ đọc được, và nó nằm ở lõi
/// **chỉ vì** mục Dòng thời gian là một hàng dữ liệu chứ không phải một khung
/// hiển thị — nội dung đã ghi rồi thì tầng ① không dựng lại được.
const TYPE_LABEL: Record<CreateActivityInput["type"], string> = {
  gap: "Gặp",
  goi: "Gọi",
  gui_thu: "Gửi thư",
  khac: "Khác",
};

export type CreateActivityInput = {
  accountId: string;
  opportunityId?: string | null;
  /// Phải thuộc CÙNG Công ty với `accountId` — lõi canh, khoá ngoại không canh.
  contactId?: string | null;
  occurredAt: Date;
  type: "gap" | "goi" | "gui_thu" | "khac";
  description?: string | null;
};

/// `E1-S6` · `FR-6` · `AD-CR-7` — tạo Hoạt động VÀ mục Dòng thời gian của nó,
/// trong CÙNG giao dịch.
///
/// HAI luật phạm vi, cả hai do lõi canh và không luật nào do khoá ngoại canh:
///   · `contact_id` phải thuộc `account_id` — khoá ngoại chỉ biết Người liên hệ
///     ấy CÓ TỒN TẠI, không biết nó của ai
///   · `opportunity_id` cũng vậy. Đề bài chỉ nêu Người liên hệ, nhưng lỗ hổng
///     giống hệt: `FR-6` cho Hoạt động một liên kết TUỲ CHỌN tới Cơ hội, và
///     không canh thì Hoạt động của Công ty A treo dưới Cơ hội của Công ty B,
///     rồi Dòng thời gian của A kể chuyện thương vụ của B
///
/// ⚠ Cả hai ném `Error` THƯỜNG, không `BusinessRuleError`. Từ vựng mã của
/// `errors.ts` là ĐÓNG và **không có mã nào cho *"tham chiếu ngoài phạm vi
/// Công ty"*** — `BR-D3` là luật Bản lưu ↔ Công ty, chính `errors.ts` ghi rõ
/// thế. Bịa một mã ở đây là dựng nguồn sự thật thứ hai, đúng thứ đầu tệp đó
/// cấm. Đây là một khoảng trống ĐÃ BÁO, không phải một chỗ quên.
///
/// Bước ⑤ của `AD-CR-7` — mục Dòng thời gian — chạy SAU ghi chính, để không kể
/// một chuyện bị cuộn lại. `appendEntryWithin` cuộn CÙNG giao dịch này.
export async function createActivity(
  actor: Actor,
  input: CreateActivityInput,
  ctx: CoreContext,
): Promise<{ id: string }> {
  return tx(async (t) => {
    const account = await t.account.findUnique({
      where: { id: input.accountId },
      select: { id: true },
    });
    if (!account) throw new Error("Công ty không tồn tại.");

    if (input.contactId) {
      const contact = await t.contact.findUnique({
        where: { id: input.contactId },
        select: { accountId: true },
      });
      if (!contact) throw new Error("Người liên hệ không tồn tại.");
      if (contact.accountId !== input.accountId) {
        throw new Error(
          "Người liên hệ không thuộc Công ty của Hoạt động này — " +
            "chỉ chọn được trong phạm vi Công ty đó.",
        );
      }
    }

    if (input.opportunityId) {
      const opportunity = await t.opportunity.findUnique({
        where: { id: input.opportunityId },
        select: { accountId: true },
      });
      if (!opportunity) throw new Error("Cơ hội không tồn tại.");
      if (opportunity.accountId !== input.accountId) {
        throw new Error(
          "Cơ hội không thuộc Công ty của Hoạt động này — " +
            "chỉ chọn được trong phạm vi Công ty đó.",
        );
      }
    }

    // ① ghi chính
    const activity = await t.activity.create({
      data: {
        accountId: input.accountId,
        opportunityId: input.opportunityId ?? null,
        contactId: input.contactId ?? null,
        occurredAt: input.occurredAt,
        type: input.type,
        description: input.description ?? null,
      },
      select: { id: true },
    });

    // ⑤ — `FR-6`: Hoạt động, lần đổi Giai đoạn và ghi chú hiện chung trên MỘT
    // Dòng thời gian. `readTimeline` chỉ đọc bảng `timeline_entry`, nên không
    // có bước này thì Hoạt động vừa ghi KHÔNG hiện ở đâu cả.
    //
    // `occurredAt` lấy NGÀY SỰ KIỆN của Hoạt động, không lấy `new Date()`:
    // khoá sắp của Dòng thời gian là `occurred_at DESC`, và ghi lùi một cuộc
    // gặp tuần trước phải rơi đúng chỗ của tuần trước.
    await appendEntryWithin(t, actor, {
      accountId: input.accountId,
      content: input.description
        ? `${TYPE_LABEL[input.type]}: ${input.description}`
        : TYPE_LABEL[input.type],
      occurredAt: input.occurredAt,
    });

    // ⑥
    await ctx.audit.complete(t, ctx.auditId, "ok", { after: { id: activity.id } });
    return { id: activity.id };
  });
}

/// `NFR-19` — máy KHÔNG sửa được Hoạt động do người tạo.
///
/// Chặn ở LÕI chứ không chỉ ở Cổng, vì `T-10a` nói nguyên văn *"kiểm thử gọi
/// thẳng tầng nghiệp vụ với danh nghĩa hệ thống, phải bị từ chối"*. Cổng là lớp
/// thứ nhất; lớp này là thứ còn đứng khi ai đó gọi vòng qua nó.
///
/// Chốt là `!isHuman`, không phải `isMachine`: bộ gieo dựng Hoạt động bằng
/// đường TẠO, không bằng đường sửa — nên nó cũng không có việc gì ở đây.
export async function updateActivity(
  actor: Actor,
  id: string,
  patch: Partial<CreateActivityInput>,
  ctx: CoreContext,
): Promise<void> {
  if (!isHuman(actor)) {
    throw new BusinessRuleError(
      "NFR-19",
      "Chỉ người sửa được Hoạt động; tác nhân là " + BT + actor.kind + BT + ".",
    );
  }
  await tx(async (t) => {
    const before = await t.activity.findUnique({
      where: { id },
      select: { occurredAt: true, type: true, description: true, contactId: true },
    });
    if (!before) throw new Error("Hoạt động không tồn tại.");

    // Đổi Người liên hệ thì luật phạm vi phải chạy LẠI — sửa là một đường ghi
    // đầy đủ, không phải một biến thể nhẹ của tạo.
    if (patch.contactId) {
      const owner = await t.activity.findUnique({
        where: { id },
        select: { accountId: true },
      });
      const contact = await t.contact.findUnique({
        where: { id: patch.contactId },
        select: { accountId: true },
      });
      if (!contact) throw new Error("Người liên hệ không tồn tại.");
      if (!owner || contact.accountId !== owner.accountId) {
        throw new Error(
          "Người liên hệ không thuộc Công ty của Hoạt động này — " +
            "chỉ chọn được trong phạm vi Công ty đó.",
        );
      }
    }

    const after = await t.activity.update({
      where: { id },
      data: {
        ...(patch.occurredAt !== undefined ? { occurredAt: patch.occurredAt } : {}),
        ...(patch.type !== undefined ? { type: patch.type } : {}),
        ...(patch.description !== undefined ? { description: patch.description } : {}),
        ...(patch.contactId !== undefined ? { contactId: patch.contactId } : {}),
      },
      select: { occurredAt: true, type: true, description: true, contactId: true },
    });

    // ⚠ KHÔNG sửa mục Dòng thời gian đã sinh ra từ Hoạt động này. `NFR-19` cấm
    // máy sửa mục Dòng thời gian, và `updateTimelineEntry` là hàm mà `T-10b`
    // cấm tầng ④ nhập — lõi cũng không gọi nó ở đây, để một đường sửa gián tiếp
    // không mọc ra sau lưng luật đó. Hệ quả đã biết: mục cũ giữ chữ cũ. Đó là
    // khoảng trống ĐÃ BÁO, không phải chỗ quên.
    await ctx.audit.complete(t, ctx.auditId, "ok", { before, after });
  });
}

/// `D26` · `NFR-17` — xoá mềm MỘT Hoạt động.
///
/// `softDeleteCompany` hiện cascade bằng `t.activity.updateMany(...)` thẳng
/// trong giao dịch của nó, và đó là đúng: gọi hàm này từ đó sẽ mở một giao dịch
/// LỒNG, mà lồng giao dịch trên ITX client là `TypeError` lúc chạy (`AD-CR-7`).
/// Hàm này là cửa vào cho đường xoá MỘT Hoạt động lẻ, không phải cho cascade.
///
/// `NFR-17` — máy KHÔNG tự xoá dữ liệu do người tạo. Chốt ở lõi vì `T-10a` gọi
/// thẳng tầng nghiệp vụ.
export async function softDeleteActivity(
  actor: Actor,
  id: string,
  ctx: CoreContext,
): Promise<void> {
  if (!isHuman(actor)) {
    throw new BusinessRuleError(
      "NFR-17",
      "Chỉ người xoá được dữ liệu; tác nhân là " + BT + actor.kind + BT + ".",
    );
  }
  await tx(async (t) => {
    const now = new Date();
    const before = await t.activity.findUnique({
      where: { id },
      select: { type: true, occurredAt: true, deletedAt: true },
    });
    if (!before) throw new Error("Hoạt động không tồn tại.");

    await t.activity.update({ where: { id }, data: { deletedAt: now } });

    // ⚠ Mục Dòng thời gian KHÔNG xoá theo. `D30` nói nguyên văn *"Mục bị xoá
    // dùng xoá mềm để vẫn còn làm dữ liệu đo"*, và Dòng thời gian là bằng
    // chứng — `softDeleteCompany` cũng cố ý để nó đứng ngoài cascade.
    await ctx.audit.complete(t, ctx.auditId, "ok", {
      before,
      after: { ...before, deletedAt: now },
    });
  });
}
