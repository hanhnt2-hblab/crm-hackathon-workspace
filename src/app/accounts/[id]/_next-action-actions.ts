"use server";

// `S3` khối Việc tiếp theo · `T-7` · `FR-32` · `D14` — MỘT server action, cho
// MỘT capability: `undoSystemNextAction`.
//
// Tệp riêng chứ không nối vào `./actions.ts`: ba khối mới của `/accounts/[id]`
// đang được dựng song song, và `./actions.ts` là tệp của khối hồ sơ. `AD-UI-6`
// không đòi *một tệp cho mọi action của một trang*, nó đòi *một action một
// capability* — điều đó giữ nguyên khi tách tệp.
//
// ⚠ KHÔNG có phép kiểm vai nào ở đây. Vai do Cổng canh ở bước ⑤ (`AD-UI-10`,
// `D28`); một lần từ chối quay về dưới dạng `GateDenied` → `ActionState` mang
// mã. Kiểm vai ở tầng này là dựng một biên giới thứ hai chạy **song song** với
// Cổng thay vì nằm **trên** đường đi.
//
// ⚠ `AD-1` — không `db`, không `@prisma/client`. Đường xuống duy nhất là
// `loadCapability`.

import { revalidatePath } from "next/cache";
import { action, IDLE, type ActionState } from "../../_contract";
import { appRegistry } from "../../_registry";
import { currentSession } from "../../_session";
import { text } from "../../_form";

/// `T-7` — Hoàn tác một lần MÁY tự đặt Việc tiếp theo.
///
/// Trả `boolean`: `true` = đã hoàn tác, `false` = **bỏ lượt**. `false` KHÔNG
/// phải lỗi — lõi ghi nó thành `no_op` và có đúng ba đường tới đó (hết cửa sổ 7
/// ngày, người đã sửa tay, hoặc đã hoàn tác rồi). Bề mặt đã lọc cả ba trước khi
/// vẽ nút, nên `false` ở đây chỉ còn nghĩa *ai đó vừa đổi ô này giữa lúc trang
/// render và lúc bấm* — và câu trả lời đúng cho chuyện đó là một lời báo bình
/// tĩnh, không phải một màn hình lỗi.
const undoAction = action(async (form): Promise<ActionState> => {
  const session = await currentSession();
  const undo = await appRegistry.loadCapability(
    "undoSystemNextAction",
    session.actor,
  );

  const accountId = text(form, "accountId");
  // `undoSystemNextAction` nhận ĐÚNG `opportunityId` — Việc tiếp theo treo ở
  // Cơ hội, không ở Công ty. `accountId` chỉ để làm mới đúng địa chỉ bên dưới.
  const done = (await undo({ opportunityId: text(form, "opportunityId") })) as boolean;

  // `AD-UI-9` — làm mới CHỈ sau một thao tác của người. Hai địa chỉ vì cờ
  // `BR-B1` (*chưa có Việc tiếp theo*) hiện trên cả thẻ Cơ hội ở bảng `S4`.
  revalidatePath(`/accounts/${accountId}`);
  revalidatePath("/board");

  return done
    ? { ok: true, message: "Đã hoàn tác. Việc tiếp theo trở về đúng trạng thái trước khi hệ thống đặt." }
    : {
        ok: true,
        message:
          "Không còn gì để hoàn tác — ô này vừa đổi, hoặc cửa sổ hoàn tác đã hết.",
      };
});

/// VỎ cho `<form action={…}>` của một server component.
///
/// ⚠ VÌ SAO CẦN VỎ, và cái giá của nó — đọc trước khi gỡ:
///
/// `action()` trả chữ ký `(prev, form) => Promise<ActionState>` của
/// `useActionState`, mà `useActionState` chỉ chạy trong lá `'use client'`. Khối
/// `Việc tiếp theo` **bắt buộc** là server component: `page.tsx` gọi thẳng
/// `NextActionBlock({accountId})` và chính nó phải `loadCapability` để đọc dữ
/// liệu (`AD-UI-5`). Phạm vi cục này mở đúng một tệp `.tsx`, nên không có chỗ
/// đặt một lá client riêng.
///
/// ⚠ ĐÂY LÀ MỘT CHỖ LỆCH VỚI `AD-UI-6`, khai ra chứ không viện. `AD-UI-6` chốt
/// **mọi** server action mang chữ ký `(prev, form) => Promise<ActionState>`, và
/// hàm xuất ở đây trả `void`. Cái còn giữ được: đường đi vẫn qua `action()`,
/// vẫn đúng một `loadCapability`, vẫn là chỗ duy nhất có `try/catch`. Cái MẤT:
/// câu báo `ActionState`.
///
/// BA đường tới một cú bấm im lặng, và cả ba đã được cân:
///   ① Cổng từ chối — KHÔNG xảy ra ở đây. `src/autonomy/gate.ts:145` cho thấy
///      bước ⑥ (trần) và ⑦ (phanh AI) chỉ chạy với `actor.kind === "system"`;
///      `undoSystemNextAction` khai `allowedRoles: []` nên bước ⑤ không bác ai;
///      một phiên người luôn qua bước ③.
///   ② `ZodError` từ bước ⑤ kiểm tham số — `_errors.ts` XẾP nó là lỗi *mong
///      đợi*, nên `action()` trả về thay vì ném, và vỏ này nuốt. Chấp nhận:
///      `opportunityId` là ô ẨN do chính server vẽ ra từ một `uuid` vừa đọc từ
///      cơ sở dữ liệu, không phải ô người gõ — chỉ một biểu mẫu bị sửa tay mới
///      tới được đây, và im lặng là câu trả lời đúng cho nó.
///   ③ `BusinessRuleError` từ lõi — `undoSystemNextAction` KHÔNG ném mã nào
///      (`errors.ts` không có mã cho nó, xem chú thích `_actor` ở lõi); nó chỉ
///      trả `true`/`false`.
///
/// Lỗi BẤT NGỜ vẫn ném xuyên qua `action()` và rơi vào error boundary của
/// `Block` — khối báo hỏng, ba khối khác trên trang vẫn dùng được (`AD-UI-8`).
///
/// Trả nợ khi nào: lúc phạm vi cho phép thêm một tệp `_next-action-undo.tsx`
/// mang `'use client'` + `useActionState` + `ActionMessage`. Khi đó vỏ này biến
/// mất và `undoAction` được xuất thẳng.
export async function undoNextActionFormAction(form: FormData): Promise<void> {
  await undoAction(IDLE, form);
}
