// `C5-1` · `E1-S1` · `FR-1` — Công ty.
//
// Xoá là XOÁ MỀM và cascade (`D26`). Cascade nêu đích danh ở `softDeleteCompany`;
// Phát hiện và Dòng thời gian **giữ nguyên** — chúng là bằng chứng.

import type { Actor } from "@/core/actor";
/// `AD-CR-7`: lõi TỰ mở giao dịch, nên không nhận `tx` từ ngoài.
import { tx } from "@/core/db";
import type { CoreContext } from "@/core/context";
import { isHuman } from "@/core/actor";
import { BusinessRuleError } from "@/core/errors";

const CHUA = "chưa hiện thực";
const BT = "`";

/// ⚠ `industry` và `accountType` là TUỲ CHỌN, dù `E1-S1` gọi chúng là bắt buộc.
/// Lược đồ để cả hai nullable, và đó là chủ đích: cả hai nằm trong `TargetField`
/// — tức Gợi ý sinh ra chính để **điền chúng khi trống**. Bắt buộc lúc tạo thì
/// hai ô đích đó không bao giờ trống, và một nhánh Gợi ý chết theo.
///
/// Giao diện vẫn được đòi chúng (`E1-S1`); ràng buộc đó thuộc bề mặt, không
/// thuộc lõi. Lõi để trống được vì bộ gieo và `src/ingest` cần thế.
export type CreateCompanyInput = {
  name: string;
  market: "JP" | "Global" | "KR";
  industry?: string | null;
  /// Đúng năm giá trị `0.1.1`, khớp TỪNG CHỮ với `enum AccountType`.
  accountType?:
    | "traditional" | "it_solution" | "it_product" | "tech_startup" | "ito"
    | null;
  country?: string | null;
  website?: string | null;
  /// Khoá tự nhiên của bộ gieo và `src/ingest` (`AD-UI-17`). Có nó thì gieo hai
  /// lần không nhân đôi dữ liệu; thiếu nó thì `npm run seed` lần hai hỏng `T-8`.
  sourceRef?: string | null;
};

/// Tạo Công ty VÀ hàng `timeline` của nó, trong CÙNG giao dịch.
///
/// `Timeline` là quan hệ 1-1 **bắt buộc** với `Account`. Tách hai bước thì có
/// một khoảnh khắc Công ty tồn tại mà chưa có Dòng thời gian — và bước tiếp theo
/// (`appendTimelineEntry`) ăn lỗi khoá ngoại. Đó đúng là đường `T-8` đi qua khi
/// máy thêm mục vào một Công ty vừa gieo.
export async function createCompany(
  actor: Actor,
  input: CreateCompanyInput,
  ctx: CoreContext,
): Promise<{ id: string }> {
  return tx(async (t) => {
    const account = await t.account.create({
    data: {
      name: input.name,
      market: input.market,
      industry: input.industry ?? null,
      accountType: input.accountType ?? null,
      country: input.country ?? null,
      website: input.website ?? null,
      sourceRef: input.sourceRef ?? null,
      timeline: { create: {} },
    },
      select: { id: true },
    });
    // `AD-CR-7` bước ⑥ — hoàn tất ghi vết TRONG giao dịch, sau khi ghi chính
    // đã xong. Sink câm tự bỏ qua khi `auditId` là `null` (`AD-CR-8`), nên ở
    // đây KHÔNG rẽ nhánh theo chế-độ-gieo.
    await ctx.audit.complete(t, ctx.auditId, "ok", { after: { id: account.id } });
    return { id: account.id };
  });
}

export function updateCompany(
  _actor: Actor,
  _id: string,
  _patch: Partial<CreateCompanyInput>,
  _ctx: CoreContext,
): Promise<void> {
  throw new Error(CHUA);
}

/// `D26` — xoá mềm. Cascade: Người liên hệ · Cơ hội · Hoạt động · Việc tiếp
/// theo · Bản chụp · Bản lưu · Thông báo. Gợi ý còn chờ chuyển `dong_he_thong`
/// kèm `cong_ty_da_xoa`. Phát hiện và Dòng thời gian KHÔNG xoá.
/// `NFR-17` · `T-10a` vế 3 — máy KHÔNG tự xoá dữ liệu do người tạo.
///
/// `T-10a` chứng minh bằng lời gọi bị TỪ CHỐI ở đây; `T-10b` chứng minh bằng
/// VẮNG MẶT trong sổ đăng ký. Hai vế khác nhau, cần cả hai: sổ có thể mọc thêm
/// một mục xoá vào ngày mai, còn chốt này thì không.
export async function softDeleteCompany(
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
    const before = await t.account.findUnique({
      where: { id },
      select: { name: true, deletedAt: true },
    });
    // ⚠ `Error` thường, KHÔNG phải `BusinessRuleError`: *không tìm thấy bản
    // ghi* không có mã nào ở thượng nguồn, và bịa một mã là dựng nguồn sự
    // thật thứ hai — đúng thứ đầu `errors.ts` cấm. Tầng ① xếp nó vào nhánh
    // `unexpected` của `ActionState`.
    if (!before) throw new Error("Công ty không tồn tại.");

    // `D26` — cascade nêu ĐÍCH DANH. Phát hiện và Dòng thời gian KHÔNG có mặt:
    // chúng là bằng chứng, và `NFR-17` cấm xoá bằng chứng kể cả khi người bấm.
    await t.opportunity.updateMany({ where: { accountId: id, deletedAt: null }, data: { deletedAt: now } });
    await t.contact.updateMany({ where: { accountId: id, deletedAt: null }, data: { deletedAt: now } });
    await t.activity.updateMany({ where: { accountId: id, deletedAt: null }, data: { deletedAt: now } });
    await t.account.update({ where: { id }, data: { deletedAt: now } });

    await ctx.audit.complete(t, ctx.auditId, "ok", {
      before,
      after: { name: before.name, deletedAt: now },
    });
  });
}

/// `E1-S10` — lọc kết hợp được: ngành, loại, quốc gia, nhãn Đang theo dõi.
export function searchCompanies(_actor: Actor, _q: {
  text?: string; industry?: string; accountType?: string; country?: string; watching?: boolean;
}): Promise<unknown[]> {
  throw new Error(CHUA);
}
