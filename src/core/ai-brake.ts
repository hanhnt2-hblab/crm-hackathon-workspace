// `AD-11` điều kiện dừng 4 · `T-9` · `C3-5` — phanh AI, phía lõi.
//
// Tệp riêng chứ không nhét vào `settings.ts` là có chủ đích: `settings.ts` là
// nơi ĐỌC cấu hình và đang có một agent khác sửa. Đường GHI của phanh có luật
// riêng — một chiều khi máy tự tắt — nên nó xứng một tệp mang đúng tên việc nó
// làm.
//
// ⚠ Đây là VAN CUỐI CÙNG của ngân sách. `src/scan/loop.ts` gọi nó khi chạm
// trần, và bản trước của vòng quét gọi một capability KHÔNG TỒN TẠI: lời gọi
// trả `unknown_capability`, AI không hề bị tắt, vòng sau lại mở và lại tiêu
// tiền. Một van hỏng trong im lặng là hình dạng lỗi đắt nhất ở đây.

import type { Actor } from "./actor";
import type { CoreContext } from "./context";
import { tx } from "./db";

export type DisableAiInput = {
  /// Vì sao tắt. `cham_tran_ngan_sach` khi máy tự tắt; `nguoi_bam` khi người
  /// bấm nút. Lưu vào ghi vết, và `T-9` đòi *"cả hai lần bấm đều có ghi vết"*.
  reason: string;
  /// Vòng quét nào chạm trần. `null` khi người bấm ngoài vòng quét.
  scanLogId?: string | null;
};

export type AiBrakeResult = {
  enabled: boolean;
  /// `false` khi AI vốn đã tắt sẵn. Bên gọi coi đây là THÀNH CÔNG, không phải
  /// lỗi: mục tiêu *"AI đang tắt"* đã đạt, và ai gọi lần hai không cần biết ai
  /// gọi lần một.
  changed: boolean;
};

/// Tắt AI. Ghi thẳng vào `settings.ai_enabled`.
///
/// `AD-4` xếp `disableAi` vào sáu mục `selfLimiting: true`, và đây là mục mà cờ
/// đó QUAN TRỌNG NHẤT: không có nó, bước ⑦ của Cổng chặn `disableAi` khi phanh
/// đang tắt, tức không tắt được AI vì AI đã tắt — vô hại. Nhưng bước ⑥ chặn nó
/// khi **chạm trần ngân sách**, mà chạm trần chính là lúc duy nhất máy gọi hàm
/// này. Không có cờ, van tự khoá đúng lúc cần mở.
export async function disableAi(
  _actor: Actor,
  input: DisableAiInput,
  ctx: CoreContext,
): Promise<AiBrakeResult> {
  return tx(async (t) => {
    const truoc = await t.setting.findUnique({
      where: { key: "ai_enabled" },
      select: { value: true },
    });
    // Vắng hàng thì coi như ĐANG BẬT — `SETTING_DEFAULTS.ai_enabled` là
    // `"true"`, và bộ gieo có thể chưa chạy. Coi vắng là *đã tắt* thì lần chạm
    // trần đầu tiên trên một CSDL mới sẽ không ghi gì cả.
    const dangBat = (truoc?.value ?? "true") === "true";

    if (dangBat) {
      await t.setting.upsert({
        where: { key: "ai_enabled" },
        create: { key: "ai_enabled", value: "false" },
        update: { value: "false" },
      });
    }

    await ctx.audit.complete(t, ctx.auditId, dangBat ? "ok" : "no_op", {
      before: { aiEnabled: dangBat },
      after: { aiEnabled: false, reason: input.reason, scanLogId: input.scanLogId ?? null },
    });

    return { enabled: false, changed: dangBat };
  });
}

/// Bật lại. Chỉ NGƯỜI gọi được — cưỡng chế ở tầng ④ bằng `allowedActors`, không
/// ở đây (`AD-CR-10`: lõi không đọc vai).
///
/// `T-9` đòi *"Bật lại thì vòng quét chạy tiếp"*, nên đường này phải tồn tại và
/// phải để lại vết ngang hàng với đường tắt.
export async function enableAi(
  _actor: Actor,
  input: { reason: string },
  ctx: CoreContext,
): Promise<AiBrakeResult> {
  return tx(async (t) => {
    const truoc = await t.setting.findUnique({
      where: { key: "ai_enabled" },
      select: { value: true },
    });
    const dangTat = (truoc?.value ?? "true") === "false";

    if (dangTat) {
      await t.setting.upsert({
        where: { key: "ai_enabled" },
        create: { key: "ai_enabled", value: "true" },
        update: { value: "true" },
      });
    }

    await ctx.audit.complete(t, ctx.auditId, dangTat ? "ok" : "no_op", {
      before: { aiEnabled: !dangTat },
      after: { aiEnabled: true, reason: input.reason },
    });

    return { enabled: true, changed: dangTat };
  });
}
