// `C5-3` · `E1-S3` · `FR-3` — Cơ hội (phần CRUD).
//
// Máy trạng thái nằm ở `./stage.ts`, KHÔNG ở đây. Tệp này chỉ tạo, sửa,
// xoá mềm và đọc. Giai đoạn khởi tạo lấy từ hằng `INITIAL_STAGE` (`D44`);
// hàm tạo **không nhận** tham số giai đoạn.

import type { Actor } from "@/core/actor";
/// `AD-CR-7`: lõi TỰ mở giao dịch, nên không nhận `tx` từ ngoài.
import { tx } from "@/core/db";
import type { CoreContext } from "@/core/context";
import { INITIAL_STAGE } from "./stage";
import { isHuman } from "@/core/actor";
import { BusinessRuleError } from "@/core/errors";

const CHUA = "chưa hiện thực";
const BT = "`";

export type CreateOpportunityInput = {
  accountId: string;
  name: string;
  /// Không âm, canh bằng `CHECK opp_amount_non_negative`.
  amount?: string | null;
  /// `BR-D9` — MỘT đơn vị tiền duy nhất trong phạm vi này. Đi CẶP với `amount`:
  /// một con số không đơn vị làm mọi phép tổng trên bảng Cơ hội vô nghĩa. Mặc
  /// định `JPY` vì thị trường chính là JP; chỉ ghi khi có `amount`, để cột không
  /// mang đơn vị cho một giá trị không tồn tại.
  currency?: string | null;
  expectedCloseMonth?: string | null;
  /// Khoá tự nhiên cho bộ gieo (`AD-UI-17`).
  sourceRef?: string | null;
};

/// `D44` — KHÔNG nhận tham số giai đoạn. Cơ hội mới luôn vào `INITIAL_STAGE`.
export async function createOpportunity(
  actor: Actor,
  input: CreateOpportunityInput,
  ctx: CoreContext,
): Promise<{ id: string }> {
  return tx(async (t) => {
    const o = await t.opportunity.create({
    data: {
      accountId: input.accountId,
      name: input.name,
      amount: input.amount ?? null,
      currency: input.amount ? (input.currency ?? "JPY") : null,
      expectedCloseMonth: input.expectedCloseMonth ?? null,
      // `D44` — hằng số, KHÔNG phải tham số. Người tạo không chọn được.
      stage: INITIAL_STAGE,
      // Bất biến hai chiều của `AD-CR-11`: đang chạy ⇒ cột này `null`.
      latestOpenStage: null,
      lossReasons: [],
      sourceRef: input.sourceRef ?? null,
    },
      select: { id: true },
    });
    await ctx.audit.complete(t, ctx.auditId, "ok", { after: { id: o.id } });
    return { id: o.id };
  });
}

/// `NFR-15` · `T-10a` vế 2 — máy KHÔNG tự sửa giá trị tiền.
///
/// Chặn ở đây chứ không chỉ ở Cổng, vì `T-10a` gọi THẲNG tầng nghiệp vụ. Cổng
/// là lớp thứ nhất; lớp này là thứ chứng minh được khi ai đó gọi vòng qua nó.
///
/// Chốt là `!isHuman`, không phải `isMachine`: `seed` cũng không sửa tiền của
/// một Cơ hội đã có — bộ gieo dựng dữ liệu bằng đường TẠO, không bằng đường sửa.
export async function updateOpportunity(
  actor: Actor,
  id: string,
  patch: Partial<CreateOpportunityInput>,
  ctx: CoreContext,
): Promise<void> {
  if (!isHuman(actor) && (patch.amount !== undefined || patch.currency !== undefined)) {
    throw new BusinessRuleError(
      "NFR-15",
      "Chỉ người sửa được giá trị tiền của Cơ hội; tác nhân là " + BT + actor.kind + BT + ".",
    );
  }
  await tx(async (t) => {
    const before = await t.opportunity.findUnique({
      where: { id },
      select: { name: true, amount: true, currency: true, expectedCloseMonth: true },
    });
    // ⚠ `Error` thường, KHÔNG phải `BusinessRuleError`: *không tìm thấy bản
    // ghi* không có mã nào ở thượng nguồn, và bịa một mã là dựng nguồn sự
    // thật thứ hai — đúng thứ đầu `errors.ts` cấm. Tầng ① xếp nó vào nhánh
    // `unexpected` của `ActionState`.
    if (!before) throw new Error("Cơ hội không tồn tại.");
    const after = await t.opportunity.update({
      where: { id },
      data: {
        ...(patch.name !== undefined ? { name: patch.name } : {}),
        ...(patch.amount !== undefined ? { amount: patch.amount } : {}),
        ...(patch.currency !== undefined ? { currency: patch.currency } : {}),
        ...(patch.expectedCloseMonth !== undefined
          ? { expectedCloseMonth: patch.expectedCloseMonth }
          : {}),
      },
      select: { name: true, amount: true, currency: true, expectedCloseMonth: true },
    });
    // `AD-4` bất biến ② — dòng ghi vết mang giá trị CŨ và MỚI khi có ghi thật.
    await ctx.audit.complete(t, ctx.auditId, "ok", { before, after });
  });
}

export function softDeleteOpportunity(_actor: Actor, _id: string, _ctx: CoreContext): Promise<void> {
  throw new Error(CHUA);
}

/// `C5-5` · `BR-B2` — hai ô dấu hiệu. `false` là ĐÃ TRẢ LỜI, khác `null` chưa hỏi.
export function setQualificationSignals(_actor: Actor, _id: string, _v: {
  needSignal: boolean | null; budgetSignal: boolean | null;
}, _ctx: CoreContext): Promise<void> {
  throw new Error(CHUA);
}

/// `C5-8` · `BR-B3` · `D27` — enum dạng MẢNG cộng một ô ghi chú, không phải câu tự do.
export function setLossReasons(_actor: Actor, _id: string, _v: {
  reasons: readonly string[]; note: string | null;
}, _ctx: CoreContext): Promise<void> {
  throw new Error(CHUA);
}
