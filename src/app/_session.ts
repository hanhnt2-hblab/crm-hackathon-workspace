// `AD-UI-10` — cookie mang **chỉ `userId`**; `role` đọc SỐNG từ cơ sở dữ liệu
// mỗi lượt yêu cầu, qua capability `readUserForAuth`.
//
// Vì sao không nhét `role` vào cookie hay JWT: vai chỉ đổi bằng cách gieo lại
// dữ liệu (`TR-2` — không có màn hình quản lý tài khoản), nên một phiên mở từ
// trước lần gieo lại sẽ giữ **vai cũ** và không có gì phát hiện. Giám khảo gieo
// lại giữa buổi demo là kịch bản có thật.
//
// Đây là một trong ĐÚNG HAI chỗ trong repo gọi `readUserForAuth` (`AD-UI-10`);
// chỗ còn lại là server action đăng nhập của `S11`.

import { cookies } from "next/headers";
import type { Actor, Role } from "@/core/actor";
import { appRegistry } from "./_registry";

/// Tên cookie. Chỉ `userId`, không gì khác (`AD-UI-10`).
export const SESSION_COOKIE = "why_now_user";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type SessionUser = {
  id: string;
  displayName: string;
  email: string;
  role: Role;
};

export type Session = {
  /// `AD-5` — `actor` là tham số BẮT BUỘC của mọi lời gọi capability, dựng
  /// TRONG chính lượt yêu cầu, không phải một ngữ cảnh ngầm.
  actor: Extract<Actor, { kind: "human" }>;
  user: SessionUser;
};

/// `AD-UI-10` — lời gọi capability DUY NHẤT được phép chạy trước khi `actor`
/// người tồn tại, nên nó đi bằng `{ kind: "system" }`.
///
/// ⚠ `userId: null` là hợp lệ và có chủ đích: chưa có cookie thì vẫn cần MỘT
/// người để dựng `actor`, và bịa một `uuid` ở đây là dựng nguồn sự thật thứ
/// hai. Capability trả người có vai sớm nhất trong dữ liệu gieo (`TR-2`).
/// Hệ quả nhận có ý thức: bản dựng cho kỳ thi **không bắt đăng nhập** — `T-1`
/// không kiểm phiên, còn `S11` vẫn có để đổi vai khi cần thử `D43`/`S8`.
export async function readSessionUser(userId: string | null): Promise<SessionUser | null> {
  const read = await appRegistry.loadCapability("readUserForAuth", { kind: "system" });
  return (await read({ userId })) as SessionUser | null;
}

/// Phiên hiện tại. Ném khi cơ sở dữ liệu chưa có người nào — đó là **sự cố dữ
/// liệu**, không phải một chính sách chặn, nên nó là việc của error boundary
/// chứ không phải một `ActionState` thất bại (`AD-UI-6`).
export async function currentSession(): Promise<Session> {
  // Đọc cookie ép Next render ĐỘNG mỗi lượt yêu cầu — `AD-UI-5` treo `T-9` vào
  // đúng điều này: khung `S0` bị cache tĩnh thì dải *"phần AI đang tắt"* không
  // bao giờ đổi sau khi Quản trị bấm phanh.
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value ?? null;
  // Cookie là dữ liệu do trình duyệt gửi, tức KHÔNG tin được. Lược đồ của
  // capability đòi `uuid`, nên một cookie rác sẽ ném `ZodError` **trong một
  // server component** — nơi không có `action()` để bắt, tức màn hình 500 cho
  // một người chỉ có cookie cũ. Lọc ở đây, và cookie sai đọc thành *chưa có
  // phiên*, đúng thứ nó thật sự là.
  const userId = raw !== null && UUID.test(raw) ? raw : null;

  const user = await readSessionUser(userId);
  if (!user) {
    throw new Error(
      "Chưa có tài khoản nào trong cơ sở dữ liệu. Chạy `npm run seed` trước.",
    );
  }

  return {
    user,
    actor: { kind: "human", userId: user.id, role: user.role },
  };
}
