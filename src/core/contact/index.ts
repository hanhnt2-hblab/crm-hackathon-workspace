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
import { isHuman } from "@/core/actor";
import { BusinessRuleError } from "@/core/errors";

const BT = "`";

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

/// `BR-D4` · `AD-CR-7` — Đặt người mới thì người cũ tự mất nhãn, trong CÙNG
/// giao dịch, và chỉ mục một phần là thứ bảo đảm không bao giờ có hai.
///
/// Hai thứ khác nhau, và trộn chúng là chỗ luật này hay hỏng:
///   · GIAO DỊCH cho tính NGUYÊN TỬ — không có khoảnh khắc Công ty mất đầu mối
///   · CHỈ MỤC `contact_one_primary` cho tính DUY NHẤT — hai giao dịch cùng đọc
///     *"chưa có ai"* rồi cùng ghi thì một cái ăn lỗi, thay vì cả hai qua
///
/// THỨ TỰ HAI CÂU LỆNH LÀ QUYẾT ĐỊNH: gỡ nhãn cũ TRƯỚC, gắn nhãn mới SAU. Đảo
/// lại thì có một khoảnh khắc hai hàng cùng `is_primary = true` trên một Công
/// ty, và `contact_one_primary` ném ngay tại câu thứ nhất — luật đúng, nhưng
/// hỏng vì thứ tự chứ không vì dữ liệu.
///
/// ⚠ Lõi KHÔNG chặn theo `actor.kind` ở đây: `§5` không có ranh giới nào về
/// Đầu mối chính, và `errors.ts` là từ vựng ĐÓNG — bịa một mã để chặn máy là
/// dựng nguồn sự thật thứ hai. Chặn máy nằm ở `allowedActors` của mục sổ đăng
/// ký (`caps/account.ts` khai `["human", "seed"]`).
export async function setPrimaryContact(
  actor: Actor,
  contactId: string,
  ctx: CoreContext,
): Promise<void> {
  await tx(async (t) => {
    const target = await t.contact.findUnique({
      where: { id: contactId },
      select: { accountId: true, isPrimary: true },
    });
    // ⚠ `Error` thường, KHÔNG phải `BusinessRuleError`: *không tìm thấy bản
    // ghi* không có mã nào ở thượng nguồn. Tầng ① xếp nó vào nhánh `unexpected`.
    if (!target) throw new Error("Người liên hệ không tồn tại.");

    // Đặt lại đúng người đang mang nhãn là KHÔNG có gì để ghi. Trả `no_op` chứ
    // không `ok`: `AD-CR-8` dùng nhánh này để chứng minh *"dòng ghi vết không
    // bao giờ khai một thao tác chưa xảy ra"*.
    if (target.isPrimary) {
      await ctx.audit.complete(t, ctx.auditId, "no_op", {
        before: { primaryContactId: contactId },
        after: { primaryContactId: contactId },
      });
      return;
    }

    const previous = await t.contact.findFirst({
      where: { accountId: target.accountId, isPrimary: true, deletedAt: null },
      select: { id: true },
    });

    // ⚠ `deletedAt: null` viết TAY. Extension của `AD-CR-6` chỉ lọc thao tác
    // ĐỌC; `updateMany` không đi qua nó, nên thiếu vế này là gỡ nhãn cả những
    // Người liên hệ đã xoá mềm — vô hại hôm nay, sai lịch sử mãi mãi.
    await t.contact.updateMany({
      where: { accountId: target.accountId, isPrimary: true, deletedAt: null },
      data: { isPrimary: false },
    });
    await t.contact.update({ where: { id: contactId }, data: { isPrimary: true } });

    // `AD-CR-7` bước ⑥ — cuối cùng, vì nó là bên duy nhất thấy đủ cũ lẫn mới.
    await ctx.audit.complete(t, ctx.auditId, "ok", {
      before: { primaryContactId: previous?.id ?? null },
      after: { primaryContactId: contactId },
    });
  });
}

/// `C5-2` · `D26` · `NFR-17` — xoá mềm MỘT Người liên hệ.
///
/// Xoá Đầu mối chính để lại Công ty 0 đầu mối — KHÔNG lỗi, và KHÔNG tự chọn
/// người khác. `BR-D4` nói *"tối đa một"*, không nói *"ít nhất một"*; máy tự
/// thăng một người thành Đầu mối chính là bịa ra một quyết định bán hàng mà
/// không ai đưa ra, và người dùng không có cách nào biết nó đã xảy ra.
///
/// `NFR-17` — máy KHÔNG tự xoá dữ liệu do người tạo. Chốt ở lõi vì `T-10a` gọi
/// thẳng tầng nghiệp vụ, không qua giao diện. `!isHuman` chứ không `isMachine`:
/// `seed` cũng không xoá — bộ gieo dựng dữ liệu bằng đường TẠO.
///
/// ⚠ CASCADE CỦA `softDeleteCompany` KHÔNG GỌI HÀM NÀY, và không gọi được:
/// `AD-CR-7` đặt giao dịch TRONG lõi, nên gọi từ trong giao dịch của
/// `softDeleteCompany` là lồng giao dịch, và lồng trên ITX client là `TypeError`
/// lúc chạy. Cascade ở `company/index.ts` dùng `t.contact.updateMany(...)` thẳng
/// và đó là đúng; hàm này là cửa vào cho đường xoá MỘT người lẻ.
///
/// ⚠ Hoạt động gắn với Người liên hệ này KHÔNG xoá theo. `Activity.contactId`
/// nullable, và `D26` liệt cascade cho **Công ty**, không cho Người liên hệ —
/// một cuộc gọi đã diễn ra vẫn diễn ra sau khi người ấy rời công ty. Cùng
/// nguyên tắc mà `softDeleteActivity` dùng để không xoá theo mục Dòng thời gian.
export async function softDeleteContact(
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
    const before = await t.contact.findUnique({
      where: { id },
      select: { name: true, isPrimary: true, accountId: true, deletedAt: true },
    });
    // ⚠ `Error` thường, KHÔNG phải `BusinessRuleError`: *không tìm thấy bản
    // ghi* không có mã nào ở thượng nguồn. Tầng ① xếp nó vào nhánh `unexpected`.
    if (!before) throw new Error("Người liên hệ không tồn tại.");

    // ⚠ `isPrimary` để NGUYÊN, không gỡ về `false`. Chỉ mục một phần
    // `contact_one_primary` mang vế `deleted_at IS NULL`, nên hàng đã xoá mềm
    // không còn chiếm ô Đầu mối chính — đặt người mới vẫn qua. Gỡ cờ đi thì lịch
    // sử mất câu *"ai từng là đầu mối"*, đổi lấy đúng con số không.
    await t.contact.update({ where: { id }, data: { deletedAt: now } });

    await ctx.audit.complete(t, ctx.auditId, "ok", {
      before,
      after: { ...before, deletedAt: now },
    });
  });
}
