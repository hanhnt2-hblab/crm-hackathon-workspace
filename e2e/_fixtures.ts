// Khối dùng chung của mười tệp `T1`…`T10`.
//
// BA việc, và chỉ ba việc:
//   ① đặt TIỀN TỐ nhận dạng được cho mọi hàng do bộ e2e sinh ra
//   ② dọn đúng những hàng mang tiền tố đó, không chạm hàng nào khác
//   ③ mở một đường ĐỌC vào CSDL demo để khẳng định trạng thái dữ liệu
//
// ⚠ VÌ SAO PHẢI CÓ TIỀN TỐ, KHÔNG PHẢI "XOÁ SẠCH RỒI GIEO LẠI".
// CSDL demo 5442 là chỗ ban giám khảo mở, và có thể có người khác đang chạy
// vòng quét thật trên đó cùng lúc. `migrate reset` hay `deleteMany({})` ở đây
// là xoá dữ liệu của người khác — không hoàn lại được, và hỏng đúng lúc đông
// người nhất. Nên bộ này chỉ được xoá thứ chính nó tạo ra.
//
// ⚠ VÌ SAO DỌN BẰNG `dbIncludingDeleted`.
// `db` gắn extension lọc `deleted_at IS NULL` (`AD-14`). Một Công ty đã xoá mềm
// giữa chừng phép kiểm sẽ VÔ HÌNH với `db`, nên bước dọn bỏ sót nó, và lượt
// chạy sau đụng ràng buộc duy nhất. `dbIncludingDeleted` là đường thoát đã được
// khai sẵn cho đúng loại việc này (`src/core/db.ts`, nhánh ③).

import "./_env";

import { dbIncludingDeleted } from "@/core/db";
import { createAuditSink } from "@/core/audit";
import type { Actor } from "@/core/actor";
import type { CoreContext } from "@/core/context";

/// Client ĐỌC cho mọi khẳng định trạng thái dữ liệu. Đây là đường dự phòng thay
/// cho MCP `tabularis` (không có trên máy này) — vẫn là lớp truy cập dữ liệu
/// của chính sản phẩm, không phải SQL viết tay song song.
///
/// ⚠ CHỈ ĐỌC khi khẳng định. Sửa dữ liệu qua đây để làm một phép kiểm xanh là
/// tự huỷ giá trị của cả bộ: dựng dữ liệu phải đi qua đúng đường sản phẩm dùng,
/// nếu không bài kiểm không chứng minh được gì về sản phẩm. Đường ghi duy nhất
/// được phép ở đây là bước DỌN cuối tệp.
export const rawDb = dbIncludingDeleted;

/// Tiền tố của MỘT lượt chạy. Nằm trong `Account.name`, nên nhìn bằng mắt trên
/// giao diện cũng phân biệt được ngay dữ liệu kiểm thử với dữ liệu demo thật.
///
/// ⚠ CỐ ĐỊNH THEO LƯỢT CHẠY, không theo tệp: `T-7` dựng lại cảnh của `T-6`, và
/// bước dọn cuối lượt phải quét được cả hai bằng một tiền tố.
export const E2E_PREFIX = "[E2E]";

/// Tên Công ty cho một phép kiểm. `Date.now()` + hậu tố ngẫu nhiên để hai lượt
/// chạy liên tiếp không đụng ràng buộc duy nhất nào — điều kiện của
/// *"chạy hai lần cho cùng kết quả"*.
export function e2eName(tag: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${E2E_PREFIX} ${tag} ${Date.now()}-${rand}`;
}

export function e2eEmail(tag: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `e2e-${tag}-${Date.now()}-${rand}@e2e.test`;
}

/// Tác nhân GIEO — dùng cho dữ liệu nền, để không bị nhầm với thao tác người
/// trong các phép đếm ghi vết (`AD-5` ba nhánh actor).
export const seeder: Actor = { kind: "seed" };

/// Tác nhân MÁY — vế đối chứng của `§5` / `NFR-14`…`NFR-19` (`T-10`).
export const machine: Actor = { kind: "system" };

/// Ngữ cảnh lõi với ghi vết CÂM. Dùng khi dựng dữ liệu nền: một sink thật ở đó
/// để lại hàng `audit_record` làm nhiễu phép đếm của `T-5` và `T-7`.
export const mutedCtx: CoreContext = {
  auditId: null,
  causedBy: null,
  audit: createAuditSink({ seedMode: true, keepAudit: false }),
};

/// Ngữ cảnh lõi GHI VẾT THẬT — giống hệt nhánh web (`src/app/_registry.ts`).
/// Chỉ tệp nào khẳng định trên `audit_record` mới dùng.
export function auditedCtx(): CoreContext {
  return {
    auditId: null,
    causedBy: null,
    audit: createAuditSink({ seedMode: false, keepAudit: true }),
  };
}

/// Dựng một người dùng riêng cho một tệp kiểm. Mỗi tệp một người, nên mọi phép
/// đếm ghi vết lọc theo `actorUserId` này đều miễn nhiễm với dữ liệu tệp khác.
export async function createE2eUser(
  tag: string,
  role: "sales" | "admin" = "sales",
): Promise<{ id: string; email: string; actor: Extract<Actor, { kind: "human" }> }> {
  const email = e2eEmail(tag);
  const u = await rawDb.user.create({
    data: { email, displayName: `${E2E_PREFIX} ${tag}`, role },
    select: { id: true },
  });
  return { id: u.id, email, actor: { kind: "human", userId: u.id, role } };
}

/// Dọn mọi hàng do bộ e2e sinh ra trong lượt này.
///
/// ⚠ THỨ TỰ LÀ BẮT BUỘC, không phải sở thích. Mọi bảng con phải đi trước bảng
/// cha, nếu không khoá ngoại chặn và bước dọn im lặng thất bại một nửa — để lại
/// đúng loại rác làm lượt chạy sau đỏ vì lý do không liên quan.
///
/// Phạm vi hẹp có chủ đích: xoá theo `accountId` thu được từ tiền tố tên, và
/// theo `email` của người dùng e2e. Không có `deleteMany({})` trần ở bất kỳ đâu.
export async function cleanupE2eData(): Promise<void> {
  const accounts = await rawDb.account.findMany({
    where: { name: { startsWith: E2E_PREFIX } },
    select: { id: true },
  });
  const accountIds = accounts.map((a) => a.id);

  const users = await rawDb.user.findMany({
    where: { email: { endsWith: "@e2e.test" } },
    select: { id: true },
  });
  const userIds = users.map((u) => u.id);

  if (accountIds.length > 0) {
    const byAccount = { accountId: { in: accountIds } };

    // Cháu trước con, con trước cha.
    const timelines = await rawDb.timeline.findMany({
      where: byAccount,
      select: { id: true },
    });
    const timelineIds = timelines.map((t) => t.id);
    if (timelineIds.length > 0) {
      await rawDb.timelineEntry.deleteMany({ where: { timelineId: { in: timelineIds } } });
    }

    const opps = await rawDb.opportunity.findMany({
      where: byAccount,
      select: { id: true },
    });
    const oppIds = opps.map((o) => o.id);
    if (oppIds.length > 0) {
      await rawDb.nextAction.deleteMany({ where: { opportunityId: { in: oppIds } } });
    }

    await rawDb.scanLogEntry.deleteMany({ where: byAccount });
    await rawDb.auditRecord.deleteMany({ where: byAccount });
    await rawDb.notification.deleteMany({ where: byAccount });
    await rawDb.suggestion.deleteMany({ where: byAccount });
    await rawDb.signal.deleteMany({ where: byAccount });
    await rawDb.article.deleteMany({ where: byAccount });
    await rawDb.snapshot.deleteMany({ where: byAccount });
    await rawDb.activity.deleteMany({ where: byAccount });
    await rawDb.timeline.deleteMany({ where: byAccount });
    await rawDb.accountLock.deleteMany({ where: byAccount });
    await rawDb.opportunity.deleteMany({ where: byAccount });
    await rawDb.contact.deleteMany({ where: byAccount });
    await rawDb.account.deleteMany({ where: { id: { in: accountIds } } });
  }

  if (userIds.length > 0) {
    // Ghi vết KHÔNG gắn Công ty (`listEnums`, `readSetting`, `writeScanLog`) —
    // `accountId` nullable, nên vòng trên bỏ sót chúng.
    await rawDb.auditRecord.deleteMany({ where: { actorUserId: { in: userIds } } });
    await rawDb.account.updateMany({
      where: { ownerId: { in: userIds } },
      data: { ownerId: null },
    });
    await rawDb.user.deleteMany({ where: { id: { in: userIds } } });
  }
}
