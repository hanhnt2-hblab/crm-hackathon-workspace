// `AD-5` · `AD-20` · `AD-CR-10`
//
// Actor là THAM SỐ BẮT BUỘC, không phải ngữ cảnh ngầm. Không đọc từ session,
// biến toàn cục, hay `AsyncLocalStorage`. Không mặc định. Thiếu là lỗi biên dịch.
//
// Ba nhánh — nhánh thứ ba tồn tại vì seeder không có nhánh nào hợp lệ để dùng:
// với hai nhánh, `npm run seed` hoặc bị Cổng chặn ở bước ③ (không gieo được
// Công ty nào), hoặc phải giả mạo một `userId` chưa tồn tại và sinh gấp đôi ghi
// vết ở lần chạy thứ hai, phá `NFR-8`.

/// Từ vựng ĐÓNG, đúng hai giá trị, lấy token của Mục 0.
/// KHÔNG `quan_tri` — ba cách viết cho một khái niệm làm bước ⑤ của Cổng từ chối
/// Quản trị đúng lúc bấm Tắt AI, và `T-9` đỏ vì một lỗi chính tả.
export type Role = "sales" | "admin";

export type ActorKind = "human" | "system" | "seed";

export type Actor =
  | { kind: "human"; userId: string; role: Role }
  | { kind: "system" }
  | { kind: "seed" };

export function isHuman(a: Actor): a is Extract<Actor, { kind: "human" }> {
  return a.kind === "human";
}

export function isMachine(a: Actor): boolean {
  return a.kind === "system";
}

/// Chữ hiển thị cho ghi vết. Không tham gia quyết định nào.
export function describeActor(a: Actor): string {
  return a.kind === "human" ? `human:${a.role}` : a.kind;
}
