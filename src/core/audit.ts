// `AD-4` (ba bất biến) · `AD-CR-8` (cơ chế) · `AD-21` (`causedBy`)
//
// Cha chốt BA BẤT BIẾN, tầng này sở hữu CƠ CHẾ:
//   ① không lời gọi nào đi qua Cổng mà không để lại dòng ghi vết — kể cả lời
//      gọi THỬ RỒI HỎNG
//   ② dòng đó mang giá trị cũ/mới khi có ghi thật
//   ③ nó không bao giờ khai một thao tác CHƯA XẢY RA
//
// Cả ba không thoả được bằng MỘT lần ghi trong giao dịch: `entry.fn` ném
// `BusinessRuleError` thì giao dịch cuộn lại và dòng ghi vết BIẾN MẤT CÙNG NÓ
// — mất đúng bằng chứng `FT6` cần, và mất đúng thứ *Penalty hộp đen* của barem.
//
// Cơ chế: GHI HAI PHA TRÊN MỘT HÀNG.
//   pha 1 — ngay sau `decide`, giao dịch RIÊNG, commit độc lập
//   pha 2 — trong giao dịch của lõi, điền `outcome` + giá trị cũ/mới
// Tiến trình chết giữa hai pha để lại `outcome = NULL`, đọc được là *đã thử,
// không biết kết cục* — vẫn là một sự thật, không phải một khoảng trống.

import { db, type Tx } from "./db";
import type { Actor } from "./actor";
import type { DenyReason } from "./errors";

export type AuditOutcome = "ok" | "business_rule_error" | "no_op" | "crashed";

export type AuditSink = {
  begin(input: {
    actor: Actor;
    capability: string;
    zone: string;
    risk: string;
    accountId?: string | null;
    allowed: boolean;
    denyReason?: DenyReason | null;
    causedBy?: string | null;
  }): Promise<string | null>;

  /// Pha 2, ĐƯỜNG THÀNH CÔNG — ghi trong giao dịch của lõi, commit cùng thao tác.
  complete(
    t: Tx,
    auditId: string | null,
    outcome: AuditOutcome,
    values?: { before?: unknown; after?: unknown },
  ): Promise<void>;

  /// Pha 2, ĐƯỜNG CUỘN LẠI — ghi NGOÀI giao dịch, autocommit.
  ///
  /// Bắt buộc phải có đường riêng: `BusinessRuleError` cuộn giao dịch của lõi
  /// lại và kéo theo cả lần ghi `outcome` của `complete()`. Không có nó thì
  /// **mọi lần bác vì luật nghiệp vụ đọng lại `outcome = NULL`** — không phân
  /// biệt được với tiến trình chết giữa chừng, đúng thứ `T-10` và `FT6` phải
  /// chứng minh được.
  completeDetached(
    auditId: string | null,
    outcome: AuditOutcome,
    values?: { before?: unknown; after?: unknown },
  ): Promise<void>;
};

/// Bộ ghi vết THẬT. `seedMode` quyết định MIỄN TRỪ **lúc dựng**, không phải
/// một nhánh `if` trong `loadCapability` (`AD-CR-8`) — nhánh đó là chỗ cờ
/// `--keep-audit` dễ bị đọc nhầm nhất.
export function createAuditSink(opts: {
  seedMode: boolean;
  keepAudit: boolean;
}): AuditSink {
  const muted = opts.seedMode && !opts.keepAudit;

  if (muted) {
    return {
      async begin() { return null; },
      async complete() { /* miễn trừ theo `AD-20` + `TR-4` */ },
      async completeDetached() { /* như trên */ },
    };
  }

  return {
    /// Pha 1. Dùng `db` (autocommit) CÓ CHỦ ĐÍCH — **không bao giờ gọi nó bên
    /// trong một giao dịch đang mở**, vì khi đó nó rơi vào giao dịch ấy và cuộn
    /// lại cùng nó, phá bất biến ① của `AD-4` (*lời gọi thử rồi hỏng vẫn để lại
    /// vết*). Sổ đăng ký gọi `begin()` TRƯỚC khi lõi mở giao dịch — đó là lý do
    /// `AD-CR-7` đặt giao dịch trong lõi chứ không ở tầng ④.
    async begin(input) {
      const row = await db.auditRecord.create({
        data: {
          actorKind: input.actor.kind,
          actorUserId: input.actor.kind === "human" ? input.actor.userId : null,
          actorRole: input.actor.kind === "human" ? input.actor.role : null,
          capability: input.capability,
          zone: input.zone,
          risk: input.risk,
          accountId: input.accountId ?? null,
          decision: input.allowed ? "allow" : "deny",
          denyReason: input.denyReason ?? null,
          causedBy: input.causedBy ?? null,
        },
        select: { id: true },
      });
      return row.id;
    },

    async complete(t, auditId, outcome, values) {
      if (!auditId) return;
      await t.auditRecord.update({
        where: { id: auditId },
        data: completionData(outcome, values),
      });
    },

    async completeDetached(auditId, outcome, values) {
      if (!auditId) return;
      await db.auditRecord.update({
        where: { id: auditId },
        data: completionData(outcome, values),
      });
    },
  };
}

function completionData(
  outcome: AuditOutcome,
  values?: { before?: unknown; after?: unknown },
) {
  return {
    outcome,
    completedAt: new Date(),
    valueBefore: (values?.before ?? null) as never,
    valueAfter: (values?.after ?? null) as never,
  };
}
