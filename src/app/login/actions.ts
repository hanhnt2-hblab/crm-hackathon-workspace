"use server";

// `S11` Login · `FR-49` · `AD-UI-10`.
//
// Đây là chỗ THỨ HAI (và cuối) trong repo gọi `readUserForAuth` — chỗ kia là
// `_session.ts`. `AD-UI-5` viết *"`S11` không đọc gì trước khi có phiên"*, và
// `AD-UI-10` đọc câu đó là *"không đọc gì **ngoài** lối này"*.
//
// ⚠ Cookie mang **chỉ `userId`**. `role` không bao giờ vào cookie: giám khảo
// gieo lại dữ liệu giữa buổi demo thì một phiên mang vai cũ sẽ giữ nguyên vai
// cũ, và không có gì phát hiện (`AD-UI-10`, `TR-2`).

import { cookies } from "next/headers";
import { action, type ActionState } from "../_contract";
import { readSessionUser, SESSION_COOKIE } from "../_session";
import { text } from "../_form";

export const signInAction = action(async (form): Promise<ActionState> => {
  const userId = text(form, "userId");

  // MỘT lời gọi capability, đúng `AD-UI-6`. Nó vừa là lượt đọc dựng `actor`,
  // vừa là phép kiểm *tài khoản này có thật không* — không cần một lượt đọc
  // thứ hai để xác nhận.
  const user = await readSessionUser(userId);
  if (!user) {
    // `EXPERIENCE.md` (`S11`, hàng *Lỗi*): không nói tài khoản nào tồn tại.
    return {
      ok: false,
      code: "unexpected",
      message: "Không mở được phiên với tài khoản này. Chọn lại trong danh sách.",
    };
  }

  const jar = await cookies();
  jar.set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    // Không `secure`: `§7` nghiệm thu trên `http://localhost`, và cookie
    // `secure` không bao giờ được gửi ở đó — phiên sẽ im lặng không bao giờ
    // dựng được, với triệu chứng trỏ sang phần đọc vai.
  });

  return { ok: true, message: `Đang dùng tài khoản ${user.displayName}.` };
});
