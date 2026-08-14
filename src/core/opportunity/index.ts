// `C5-3` · `E1-S3` · `FR-3` — Cơ hội (phần CRUD).
//
// Máy trạng thái nằm ở `./stage.ts`, KHÔNG ở đây. Tệp này chỉ tạo, sửa,
// xoá mềm và đọc. Giai đoạn khởi tạo lấy từ hằng `INITIAL_STAGE` (`D44`);
// hàm tạo **không nhận** tham số giai đoạn.

import type { Actor } from "@/core/actor";
/// `AD-CR-7`: lõi TỰ mở giao dịch, nên không nhận `tx` từ ngoài.
import { tx } from "@/core/db";
import type { CoreContext } from "@/core/context";
import {
  INITIAL_STAGE, changeStage, resumeOrReopen, asRunningStage, isClosed, type Stage,
} from "./stage";
import { appendEntryWithin } from "@/core/timeline";
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
export async function setQualificationSignals(
  actor: Actor,
  id: string,
  v: { needSignal: boolean | null; budgetSignal: boolean | null },
  ctx: CoreContext,
): Promise<void> {
  await tx(async (t) => {
    const before = await t.opportunity.findUnique({
      where: { id },
      select: { needSignal: true, budgetSignal: true, accountId: true },
    });
    if (!before) throw new Error("Cơ hội không tồn tại.");

    const after = await t.opportunity.update({
      where: { id },
      data: { needSignal: v.needSignal, budgetSignal: v.budgetSignal },
      select: { needSignal: true, budgetSignal: true },
    });

    // §5.1 — mọi lần ghi để lại một mục Dòng thời gian. Ở đây nội dung nói rõ
    // ô nào vừa được điền, vì `BR-B2` là luật HÀNH VI: Cơ hội vẫn sang được
    // `du_dieu_kien` khi thiếu, chỉ mang cờ, nên người đọc lại cần biết cờ tắt
    // lúc nào và nhờ ai.
    await appendEntryWithin(t, actor, {
      accountId: before.accountId,
      content: `Dấu hiệu Đủ điều kiện: nhu cầu ${moTa(after.needSignal)}, ngân sách ${moTa(after.budgetSignal)}`,
      occurredAt: new Date(),
    });
    await ctx.audit.complete(t, ctx.auditId, "ok", { before, after });
  });
}

/// `BR-B2` — ba trạng thái, không phải hai. `null` là CHƯA HỎI; `false` là ĐÃ
/// TRẢ LỜI *"không"*. Gộp chúng làm Cơ hội trả lời *"không"* vẫn treo cờ cảnh
/// báo suốt vòng đời — và người dùng không có cách nào tắt nó.
function moTa(v: boolean | null): string {
  return v === null ? "chưa hỏi" : v ? "có" : "không";
}

/// `BR-B2` — cờ cảnh báo tính LÚC ĐỌC, không lưu thành cột.
///
/// Và nó tính theo GIAI ĐOẠN HIỆN TẠI (`>= du_dieu_kien`), KHÔNG theo sự kiện
/// *vừa sang `du_dieu_kien`*: `FR-4` cho nhảy cóc, nên một Cơ hội kéo thẳng
/// `tiep_can` → `soan_de_xuat` chưa bao giờ *"sang du_dieu_kien"* mà vẫn phải
/// mang cờ. Gắn vào sự kiện là để cả một nhánh đi qua phễu không cờ.
const THU_TU_GIAI_DOAN: readonly Stage[] = [
  "tiep_can", "du_dieu_kien", "soan_de_xuat", "thuong_luong",
];

export function needsQualificationFlag(o: {
  stage: Stage;
  needSignal: boolean | null;
  budgetSignal: boolean | null;
}): boolean {
  const i = THU_TU_GIAI_DOAN.indexOf(o.stage);
  // Đã đóng hoặc `tam_dung` → `indexOf` trả `-1`, không mang cờ.
  if (i < 1) return false;
  return o.needSignal === null || o.budgetSignal === null;
}

/// `C5-8` · `BR-B3` · `D27` — enum dạng MẢNG cộng một ô ghi chú, không phải câu tự do.
export async function setLossReasons(
  actor: Actor,
  id: string,
  v: { reasons: readonly string[]; note: string | null },
  ctx: CoreContext,
): Promise<void> {
  // `D27` — enum dạng MẢNG, không phải câu tự do. Cột là `TEXT[]` nên CSDL
  // không canh giá trị; lõi là lớp duy nhất có thể.
  const laMat = v.reasons.filter((r) => !(LOSS_REASONS as readonly string[]).includes(r));
  if (laMat.length > 0) {
    throw new BusinessRuleError(
      "BR-D10",
      `Lý do thua ngoài danh sách: ${laMat.join(", ")}.`,
    );
  }
  await tx(async (t) => {
    const before = await t.opportunity.findUnique({
      where: { id },
      select: { lossReasons: true, lossNote: true, accountId: true },
    });
    if (!before) throw new Error("Cơ hội không tồn tại.");
    const after = await t.opportunity.update({
      where: { id },
      data: { lossReasons: [...v.reasons], lossNote: v.note },
      select: { lossReasons: true, lossNote: true },
    });
    await appendEntryWithin(t, actor, {
      accountId: before.accountId,
      content: `Lý do thua: ${v.reasons.join(", ") || "(chưa nêu)"}`,
      occurredAt: new Date(),
    });
    await ctx.audit.complete(t, ctx.auditId, "ok", { before, after });
  });
}

/// `D27` — từ vựng ĐÓNG của lý do thua. Cột là `TEXT[]`, không phải enum CSDL,
/// nên đây là lớp canh DUY NHẤT. Thiếu nó thì bảng thống kê lý do thua vỡ thành
/// nhiều nhóm một phần tử, và `E1-S11` hiện một danh sách không đọc được.
export const LOSS_REASONS = [
  "gia", "doi_thu", "khong_ngan_sach", "sai_thoi_diem", "khong_phan_hoi", "khac",
] as const;

/// `C5-4` · `AD-CR-1` · `AD-CR-7` — đổi Giai đoạn, sáu bước trong MỘT giao dịch.
///
/// Máy trạng thái thuần nằm ở `./stage.ts` và là nơi DUY NHẤT đọc bảng §5.1.
/// Hàm này chỉ nối nó vào tầng lưu trữ: nạp trạng thái, hỏi hàm thuần, ghi.
///
/// Thứ tự theo `AD-CR-7`, và thứ tự là quyết định:
///   ① ghi chính
///   ② trường dẫn xuất `latest_open_stage` trong CÙNG câu `UPDATE` — tách ra
///      thành hai câu là có một khoảnh khắc hàng vi phạm `CHECK ①`
///   ⑤ mục Dòng thời gian — SAU ghi chính, để không kể một chuyện bị cuộn lại
///   ⑥ hoàn tất ghi vết — cuối, vì nó là bên duy nhất thấy đủ giá trị cũ và mới
///
/// Bước ③ (hệ quả dây chuyền) và ④ (cờ `BR-B`) chưa áp dụng ở đây: cờ `BR-B`
/// tính lúc đọc, không có cột nào để ghi.
export async function changeOpportunityStage(
  actor: Actor,
  id: string,
  to: Stage,
  ctx: CoreContext,
): Promise<void> {
  await tx(async (t) => {
    const before = await t.opportunity.findUnique({
      where: { id },
      select: { stage: true, latestOpenStage: true, name: true },
    });
    if (!before) throw new Error("Cơ hội không tồn tại.");

    // Hàm THUẦN quyết định. Nó ném `NFR-14` cho máy và `STATE_*` cho chuyển
    // tiếp ngoài bảng — cả hai cuộn giao dịch lại, đúng ý.
    const next = changeStage(
      actor,
      { stage: before.stage, latestOpenStage: asRunningStage(before.latestOpenStage) },
      to,
    );

    // ① và ② trong CÙNG một câu.
    await t.opportunity.update({
      where: { id },
      data: { stage: next.stage, latestOpenStage: next.latestOpenStage },
    });

    // ⑤ — §5.1 đòi MỌI dòng ghi một mục Dòng thời gian.
    await appendEntryWithin(t, actor, {
      accountId: (await t.opportunity.findUniqueOrThrow({
        where: { id },
        select: { accountId: true },
      })).accountId,
      content: `Giai đoạn: ${before.stage} → ${next.stage}`,
      occurredAt: new Date(),
    });

    // ⑥
    await ctx.audit.complete(t, ctx.auditId, "ok", { before, after: next });
  });
}

/// `C5-4` · `D43` — HAI đường quay lại, HAI hàm, HAI capability.
///
/// Bản trước gộp cả hai vào `resumeOrReopenOpportunity`, và chỗ gộp đó làm `D43`
/// không cưỡng chế được ở đâu:
///   · `tam_dung` → đang chạy  — **Sales làm được** (§6)
///   · `thang`/`thua` → đang chạy — **chỉ Quản trị** (`D43`, `A5`, §5.2)
///
/// Một capability thì `allowedRoles` phải chọn một giá trị cho cả hai: khai
/// `["admin"]` chặn oan Sales trên đường thứ nhất, khai rỗng thì `D43` hở. Phân
/// biệt hai đường cần TRẠNG THÁI HIỆN TẠI của Cơ hội, mà Cổng cố ý không đọc dữ
/// liệu (`AD-GT-1` — sáu trường, toàn là sự kiện), còn `AD-CR-10` cấm lõi tự
/// canh vai. Tách làm hai là lối ra duy nhất không phá `AD` nào:
///
///   `resumeFromPause`          `allowedRoles: []`        — lõi đòi `tam_dung`
///   `reopenClosedOpportunity`  `allowedRoles: ["admin"]` — lõi đòi đã đóng
///
/// Vai vẫn do CỔNG canh (`AD-CR-10`); lõi chỉ canh TRẠNG THÁI ĐẦU VÀO, và đó
/// không phải quyền — đó là *"gọi nhầm cửa"*.
export async function resumeFromPause(
  actor: Actor,
  id: string,
  ctx: CoreContext,
): Promise<void> {
  await resumeInto(actor, id, ctx, "tam_dung");
}

export async function reopenClosedOpportunity(
  actor: Actor,
  id: string,
  ctx: CoreContext,
): Promise<void> {
  await resumeInto(actor, id, ctx, "closed");
}

/// Thân dùng chung. `expect` KHÔNG phải một tham số công khai: hai cửa vào đã
/// cố định nó, và để lộ nó ra ngoài là dựng lại đúng cửa gộp vừa bị tách.
async function resumeInto(
  actor: Actor,
  id: string,
  ctx: CoreContext,
  expect: "tam_dung" | "closed",
): Promise<void> {
  await tx(async (t) => {
    const before = await t.opportunity.findUnique({
      where: { id },
      select: { stage: true, latestOpenStage: true, accountId: true },
    });
    if (!before) throw new Error("Cơ hội không tồn tại.");

    const dungCua =
      expect === "tam_dung" ? before.stage === "tam_dung" : isClosed(before.stage);
    if (!dungCua) {
      throw new BusinessRuleError(
        "STATE_TRANSITION_NOT_ALLOWED",
        expect === "tam_dung"
          ? `Cơ hội đang ở \`${before.stage}\`; đường này chỉ nhận \`tam_dung\`.`
          : `Cơ hội đang ở \`${before.stage}\`; đường này chỉ nhận Cơ hội đã đóng.`,
      );
    }

    const next = resumeOrReopen(actor, {
      stage: before.stage,
      latestOpenStage: asRunningStage(before.latestOpenStage),
    });

    await t.opportunity.update({
      where: { id },
      data: { stage: next.stage, latestOpenStage: next.latestOpenStage },
    });
    await appendEntryWithin(t, actor, {
      accountId: before.accountId,
      content:
        expect === "tam_dung"
          ? `Quay lại: ${before.stage} → ${next.stage}`
          : `Mở lại Cơ hội đã đóng: ${before.stage} → ${next.stage}`,
      occurredAt: new Date(),
    });
    await ctx.audit.complete(t, ctx.auditId, "ok", { before, after: next });
  });
}
