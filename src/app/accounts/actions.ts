"use server";

// `S6` · `FR-1` · `T-1` (*"tạo được công ty"*) — server action tạo Công ty.
//
// `AD-UI-6`, ba luật, cả ba cưỡng chế được ở tệp này:
//   ① chữ ký `(prev, form) => Promise<ActionState>` — do `action()` áp
//   ② không `try/catch` nào ở đây; nơi duy nhất có nó là `action()`
//   ③ **một action, một capability** — đúng một lời gọi `loadCapability`
//
// `actor` dựng TRONG chính action từ `userId` của phiên (`AD-UI-10`). Server
// action là một endpoint POST công khai: chặn lúc render **không phải** ranh
// giới bảo mật, nên không action nào bỏ qua Cổng vì *"màn hình này đã chặn rồi"*.

import { revalidatePath } from "next/cache";
import { action, type ActionState } from "../_contract";
import { appRegistry } from "../_registry";
import { currentSession } from "../_session";
import { optionalText, text } from "../_form";

export const createCompanyAction = action(async (form): Promise<ActionState> => {
  const session = await currentSession();
  const create = await appRegistry.loadCapability("createCompany", session.actor);

  const name = text(form, "name");
  await create({
    name,
    market: text(form, "market"),
    industry: optionalText(form, "industry"),
    accountType: optionalText(form, "accountType"),
    country: optionalText(form, "country"),
    website: optionalText(form, "website"),
  });

  // `AD-UI-9` — làm mới CHỈ sau một thao tác của người. Vòng quét không bao giờ
  // gọi các API làm mới của Next; nếu nó gọi, trang tự nhảy giữa lúc giám khảo
  // đang bấm và `UX-7` đỏ.
  revalidatePath("/accounts");
  revalidatePath("/");

  return { ok: true, message: `Đã tạo Công ty ${name}.` };
});
