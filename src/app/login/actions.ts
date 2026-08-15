"use server";

// `S11` Login · `FR-49` · `AD-UI-10` · luật thi `3.2`.
//
// Đây là chỗ THỨ HAI (và cuối) trong repo gọi `readUserForAuth` — chỗ kia là
// `_session.ts`. `AD-UI-5` viết *"`S11` không đọc gì trước khi có phiên"*, và
// `AD-UI-10` đọc câu đó là *"không đọc gì **ngoài** lối này"*.
//
// ⚠ Cookie mang **chỉ `userId`**. `role` không bao giờ vào cookie: giám khảo
// gieo lại dữ liệu giữa buổi demo thì một phiên mang vai cũ sẽ giữ nguyên vai
// cũ, và không có gì phát hiện (`AD-UI-10`, `TR-2`).
//
// ─────────────────────────────────────────────────────────────────────────────
// ⚠ KHỐI CHÚ THÍCH CŨ Ở ĐÂY VÀ Ở `page.tsx` NÓI *"không có mật khẩu, và đó là
// phạm vi chứ không phải sơ suất"*. Câu đó ĐÃ LỖI THỜI từ 15/08 và đã được gỡ.
// Luật thi `3.2` bổ sung đúng hai việc, và màn này có cả hai:
//   ① nút vào thẳng cho TỪNG tài khoản — `signInAction`, không ô mật khẩu nào;
//   ② đăng nhập bằng MẬT KHẨU — `signInWithPasswordAction`, mặc định là mật
//      khẩu demo mà luật thi công bố (băm ở `caps/auth-ui.ts`).
// Để lại lời giải thích cũ thì nó mâu thuẫn với mã ngay dòng dưới, và một chú
// thích sai còn tệ hơn không có chú thích.
//
// Hai lối ra HỘI TỤ ở `moPhien()` — một chỗ duy nhất đặt cookie. Tách đôi là hai
// bộ tuỳ chọn cookie sẽ trôi khỏi nhau, và chỗ trôi nằm đúng trên cờ `secure`.
// ─────────────────────────────────────────────────────────────────────────────

import { cookies } from "next/headers";
import { action, type ActionState } from "../_contract";
import { appRegistry } from "../_registry";
import { readSessionUser, SESSION_COOKIE, type SessionUser } from "../_session";
import { text } from "../_form";

/// `EXPERIENCE.md` (`S11`, hàng *Lỗi*) — câu sẵn có cho *tài khoản này không mở
/// được phiên*, giữ nguyên từng chữ.
const KHONG_VAO_DUOC: ActionState = {
  ok: false,
  // `code` lấy từ từ vựng ĐÓNG của `_contract.ts`
  // (`BusinessRuleCode | GateDenyReason | "unexpected"`). Không mã nào trong đó
  // nghĩa là *sai mật khẩu*, và bịa một mã mới là dựng một từ vựng thứ hai —
  // nên dùng `"unexpected"`, đúng như lối vào thẳng vẫn dùng từ trước.
  code: "unexpected",
  message: "Không mở được phiên với tài khoản này. Chọn lại trong danh sách.",
};

/// MỘT câu cho MỌI cách hỏng của đường mật khẩu: ô rỗng, sai chữ, sai hoa
/// thường. Tách chúng ra thì màn đăng nhập tự nói cho người dò biết họ đã đúng
/// được đến đâu.
const MAT_KHAU_SAI: ActionState = {
  ok: false,
  code: "unexpected",
  message: "Mật khẩu không đúng. Nhập lại, hoặc bấm nút vào thẳng ở trên.",
};

/// Đặt cookie phiên. Chỗ DUY NHẤT trong repo ghi `SESSION_COOKIE`.
async function moPhien(user: SessionUser): Promise<ActionState> {
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
}

/// Luật thi `3.2` vế ① — **vào thẳng, không cần mật khẩu**.
///
/// Nhóm radio cộng nút *Dùng tài khoản này* và dải nút một-chạm dùng CHUNG action
/// này: cả hai chỉ gửi lên đúng một trường `userId`, nên không có lý do gì để có
/// hai đường.
export const signInAction = action(async (form): Promise<ActionState> => {
  const userId = text(form, "userId");

  // MỘT lời gọi capability. Nó vừa là lượt đọc dựng `actor`, vừa là phép kiểm
  // *tài khoản này có thật không* — không cần một lượt đọc thứ hai để xác nhận.
  const user = await readSessionUser(userId);
  if (!user) return KHONG_VAO_DUOC;

  return moPhien(user);
});

/// Luật thi `3.2` vế ② — **đăng nhập bằng mật khẩu**, giữ nguyên theo `§7.3`.
///
/// HAI lời gọi capability, và thứ tự là bắt buộc:
///   ① `readUserForAuth` (`actor: {kind:"system"}`) — lối ra duy nhất của bài
///      toán con gà quả trứng, và là chỗ vai được đọc SỐNG từ cơ sở dữ liệu;
///   ② `verifyLoginPassword` (`actor` NGƯỜI dựng từ ①) — kiểm mật khẩu.
///
/// ⚠ `actor` của bước ② là danh tính ĐƯỢC KHAI, chưa được chứng minh — đúng
/// bản chất của một lượt thử đăng nhập. Nó không phải một lỗ hổng leo thang:
/// `userId` được tra ở bước ① nên nó phải có thật, `role` lấy từ hàng dữ liệu
/// chứ không từ biểu mẫu, và mục ② mang `allowedRoles: []` nên vai không mở
/// thêm quyền nào. Cái nó mua được là dòng ghi vết mang tên người đã thử.
export const signInWithPasswordAction = action(async (form): Promise<ActionState> => {
  const userId = text(form, "userId");
  const password = text(form, "password");

  // Ô rỗng dừng ở đây: lược đồ Zod của mục ② đòi `min(1)`, và để nó ném
  // `ZodError` thì người dùng nhận một câu lỗi kỹ thuật thay vì câu ở trên.
  if (password === "") return MAT_KHAU_SAI;

  const user = await readSessionUser(userId);
  if (!user) return KHONG_VAO_DUOC;

  const actor = { kind: "human", userId: user.id, role: user.role } as const;
  const kiem = await appRegistry.loadCapability("verifyLoginPassword", actor);
  const ketQua = (await kiem({ userId: user.id, password })) as { ok: boolean };
  if (!ketQua.ok) return MAT_KHAU_SAI;

  return moPhien(user);
});
