"use server";

// `S3` Account detail — ba server action: Người liên hệ, Cơ hội, Hoạt động.
// `FR-2` `FR-3` `FR-11`…`FR-14` · `T-1` (*"tạo được … người liên hệ, cơ hội …
// ghi hoạt động"*).
//
// `AD-UI-6` — mỗi action gọi ĐÚNG MỘT `loadCapability`, không có `try/catch`
// nào ngoài `action()`, và `actor` dựng trong chính action từ phiên.

import { revalidatePath } from "next/cache";
import { action, type ActionState } from "../../_contract";
import { appRegistry } from "../../_registry";
import { currentSession } from "../../_session";
import { checkbox, optionalText, text } from "../../_form";
import { ACTIVITY_TYPE_LABEL } from "../../_vocab";

export const createContactAction = action(async (form): Promise<ActionState> => {
  const session = await currentSession();
  const create = await appRegistry.loadCapability("createContact", session.actor);

  const accountId = text(form, "accountId");
  const name = text(form, "name");
  await create({
    accountId,
    name,
    title: optionalText(form, "title"),
    email: optionalText(form, "email"),
    // `BR-D4` — tối đa MỘT Đầu mối chính mỗi Công ty, canh bằng chỉ mục một
    // phần ở cơ sở dữ liệu. Bề mặt không tự canh: hai lượt gửi song song đều
    // đọc *"chưa có ai"* rồi cùng ghi, và chỉ chỉ mục mới bắt được.
    isPrimary: checkbox(form, "isPrimary"),
  });

  revalidatePath(`/accounts/${accountId}`);
  return { ok: true, message: `Đã thêm người liên hệ ${name}.` };
});

/// `D44` — Cơ hội mới LUÔN vào `tiep_can`. Biểu mẫu không có ô Giai đoạn, và
/// đó không phải thiếu sót: lõi không nhận tham số giai đoạn lúc tạo, nên một
/// ô như thế sẽ là một lời hứa mà tầng dưới không giữ.
export const createOpportunityAction = action(async (form): Promise<ActionState> => {
  const session = await currentSession();
  const create = await appRegistry.loadCapability("createOpportunity", session.actor);

  const accountId = text(form, "accountId");
  const name = text(form, "name");
  const amount = optionalText(form, "amount");
  await create({
    accountId,
    name,
    // Tiền là CHUỖI suốt cả đường đi (`Decimal(14,2)` ở cột). Đổi sang `number`
    // ở bất kỳ chặng nào là làm tròn sai ở đúng chỗ không ai nhìn.
    amount,
    // `BR-D9` — đơn vị đi CẶP với con số; chỉ ghi khi có `amount`, để cột không
    // mang đơn vị cho một giá trị không tồn tại.
    currency: amount === null ? null : (optionalText(form, "currency") ?? "JPY"),
    expectedCloseMonth: optionalText(form, "expectedCloseMonth"),
  });

  revalidatePath(`/accounts/${accountId}`);
  revalidatePath("/board");
  return { ok: true, message: `Đã tạo cơ hội ${name} ở giai đoạn Tiếp cận.` };
});

/// `T-1` (*"ghi hoạt động"*) · `FR-11`…`FR-14` · `E1-S6` · `C5-6`.
///
/// Đi qua capability `createActivity`, và mục Dòng thời gian đi kèm là
/// `cascades` của chính mục đó (`AD-21`) — KHÔNG phải hai lời gọi xâu chuỗi ở
/// đây. `AD-UI-6` nói thẳng: *"ghi kèm theo là việc của `cascades` trong sổ
/// đăng ký, không phải việc xâu hai lời gọi trong action"*.
///
/// ⚠ `type` gửi xuống dạng token (`gap`/`goi`/`gui_thu`/`khac`), không phải
/// nhãn tiếng Việt: `ACTIVITY_TYPE_LABEL` chỉ dùng để dựng câu báo cho người
/// đọc. Gửi nhãn xuống là để chữ hiển thị rò vào cột enum, đúng thứ quy ước cha
/// cấm.
export const logActivityAction = action(async (form): Promise<ActionState> => {
  const session = await currentSession();
  const create = await appRegistry.loadCapability("createActivity", session.actor);

  const accountId = text(form, "accountId");
  const type = text(form, "type");
  const occurredAt = optionalText(form, "occurredAt");

  await create({
    accountId,
    type,
    description: optionalText(form, "description"),
    // `z.iso.datetime()` ở lược đồ capability — KHÔNG `z.date()`, vốn làm Zod 4
    // ném *"Date cannot be represented in JSON Schema"* lúc dựng server.
    // Ô `datetime-local` gửi `2026-08-14T09:30` (không múi giờ), nên `Date`
    // dựng nó theo giờ máy chủ rồi mới đổi sang ISO.
    occurredAt: (occurredAt === null ? new Date() : new Date(occurredAt)).toISOString(),
  });

  revalidatePath(`/accounts/${accountId}`);
  revalidatePath("/");
  return {
    ok: true,
    message: `Đã ghi hoạt động ${(ACTIVITY_TYPE_LABEL[type] ?? "khác").toLowerCase()}.`,
  };
});
