// `C5-2` · `E1-S2` · `FR-2` · `BR-D4` — Người liên hệ và Đầu mối chính.
//
// `BR-D4` canh bằng chỉ mục MỘT PHẦN `contact_one_primary`, không bằng
// *đặt trong cùng giao dịch*. Giao dịch cho tính nguyên tử, chỉ mục cho
// tính duy nhất: hai giao dịch cùng đọc *chưa có ai* rồi cùng ghi sẽ tạo
// hai Đầu mối chính mà không bên nào lỗi.

import type { Actor } from "@/core/actor";
/// `AD-CR-7`: lõi TỰ mở giao dịch, nên không nhận `tx` từ ngoài.
import { tx } from "@/core/db";
import type { CoreContext } from "@/core/context";

const CHUA = "chưa hiện thực";

export type CreateContactInput = {
  accountId: string;
  name: string;
  title?: string | null;
  email?: string | null;
  /// Đặt thẳng lúc tạo. `contact_one_primary` là thứ canh *tối đa một*, nên
  /// hai lời gọi đồng thời cùng đặt `true` thì một cái ăn lỗi duy nhất — đúng
  /// hành vi muốn có, hơn hẳn việc cả hai cùng thành công.
  isPrimary?: boolean;
  /// Khoá tự nhiên cho bộ gieo (`AD-UI-17`).
  sourceRef?: string | null;
};

export async function createContact(
  actor: Actor,
  input: CreateContactInput,
  ctx: CoreContext,
): Promise<{ id: string }> {
  return tx(async (t) => {
    const c = await t.contact.create({
    data: {
      accountId: input.accountId,
      name: input.name,
      title: input.title ?? null,
      email: input.email ?? null,
      isPrimary: input.isPrimary ?? false,
      sourceRef: input.sourceRef ?? null,
    },
      select: { id: true },
    });
    await ctx.audit.complete(t, ctx.auditId, "ok", { after: { id: c.id } });
    return { id: c.id };
  });
}

/// Đặt người mới thì người cũ tự mất nhãn — trong CÙNG giao dịch, và chỉ mục
/// một phần là thứ bảo đảm không bao giờ có hai.
export function setPrimaryContact(_actor: Actor, _contactId: string, _ctx: CoreContext): Promise<void> {
  throw new Error(CHUA);
}

/// Xoá Đầu mối chính để lại Công ty 0 đầu mối — KHÔNG lỗi, không tự chọn người khác.
export function softDeleteContact(_actor: Actor, _id: string, _ctx: CoreContext): Promise<void> {
  throw new Error(CHUA);
}
