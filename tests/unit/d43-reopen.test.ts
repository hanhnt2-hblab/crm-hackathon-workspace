// `D43` · `A5` · PRD §5.2 — mở lại Cơ hội đã đóng CHỈ vai Quản trị.
//
// Luật này từng KHÔNG được cưỡng chế ở đâu, và lý do đáng ghi lại: một
// capability `resumeOrReopenOpportunity` duy nhất phục vụ hai đường có hai luật
// vai khác nhau —
//   `tam_dung` → đang chạy      Sales làm được (§6)
//   `thang`/`thua` → đang chạy  chỉ Quản trị (`D43`)
// — và `allowedRoles` chỉ nhận MỘT giá trị. Khai `["admin"]` chặn oan Sales;
// khai rỗng thì `D43` hở. Phân biệt cần trạng thái hiện tại của Cơ hội, mà Cổng
// cố ý không đọc dữ liệu (`AD-GT-1`), còn `AD-CR-10` cấm lõi tự canh vai.
//
// Lối ra là TÁCH LÀM HAI capability. Tệp này là bằng chứng cả hai vế đều đúng:
// `D43` chặn thật, VÀ Sales không bị chặn oan trên đường hợp lệ của mình.

import { describe, it, expect, beforeAll } from "vitest";
import { createRegistry } from "@/capability/registry";
import { createCompany } from "@/core/company";
import { createOpportunity, changeOpportunityStage } from "@/core/opportunity";
import { createAuditSink } from "@/core/audit";
import { db } from "@/core/db";
import type { Actor } from "@/core/actor";
import type { CoreContext } from "@/core/context";

const sales: Actor = { kind: "human", userId: "s", role: "sales" };
const admin: Actor = { kind: "human", userId: "a", role: "admin" };
const seeder: Actor = { kind: "seed" };

const ctx: CoreContext = {
  auditId: null,
  causedBy: null,
  audit: createAuditSink({ seedMode: true, keepAudit: false }),
};

const registry = createRegistry({
  seedMode: false,
  auditSink: createAuditSink({ seedMode: true, keepAudit: false }),
});

let accountId = "";

beforeAll(async () => {
  const acc = await createCompany(seeder, { name: "D43 Co", market: "JP" }, ctx);
  accountId = acc.id;
});

/// Dựng một Cơ hội ở đúng trạng thái muốn, đi qua đường hợp lệ.
async function oppAt(stage: "tam_dung" | "thua"): Promise<string> {
  const o = await createOpportunity(seeder, { accountId, name: `D43 ${stage}` }, ctx);
  await changeOpportunityStage(sales, o.id, "thuong_luong", ctx);
  await changeOpportunityStage(sales, o.id, stage, ctx);
  return o.id;
}

const stageOf = (id: string) =>
  db.opportunity.findUniqueOrThrow({ where: { id }, select: { stage: true } });

describe("D43 — Cổng chặn Sales mở lại Cơ hội đã ĐÓNG", () => {
  it("Sales không cầm được `reopenClosedOpportunity`", async () => {
    await expect(
      registry.loadCapability("reopenClosedOpportunity", sales),
    ).rejects.toMatchObject({ name: "GateDenied", reason: "role" });
  });

  it("Quản trị cầm được, và mở lại thật", async () => {
    const id = await oppAt("thua");
    const fn = await registry.loadCapability("reopenClosedOpportunity", admin);
    await fn({ id });
    expect((await stageOf(id)).stage).toBe("thuong_luong");
  });
});

describe("D43 — và KHÔNG chặn oan Sales trên đường `tam_dung`", () => {
  it("Sales cầm được `resumeFromPause`", async () => {
    await expect(
      registry.loadCapability("resumeFromPause", sales),
    ).resolves.toBeTypeOf("function");
  });

  it("Sales quay lại được từ `tam_dung` — đây là vế dễ hỏng khi siết `D43`", async () => {
    const id = await oppAt("tam_dung");
    const fn = await registry.loadCapability("resumeFromPause", sales);
    await fn({ id });
    expect((await stageOf(id)).stage).toBe("thuong_luong");
  });
});

describe("Hai cửa không thay nhau được — lõi canh TRẠNG THÁI VÀO", () => {
  it("`resumeFromPause` trên Cơ hội đã đóng bị bác", async () => {
    const id = await oppAt("thua");
    const fn = await registry.loadCapability("resumeFromPause", sales);
    await expect(fn({ id })).rejects.toMatchObject({
      code: "STATE_TRANSITION_NOT_ALLOWED",
    });
    expect((await stageOf(id)).stage).toBe("thua");
  });

  it("`reopenClosedOpportunity` trên Cơ hội `tam_dung` bị bác — kể cả Quản trị", async () => {
    // Vế này quan trọng: không có nó thì Quản trị dùng cửa `D43` để đi đường
    // `tam_dung`, và mọi lần quay lại của Quản trị bị ghi vết như một lần mở
    // lại Cơ hội đã đóng — làm hỏng chính bằng chứng mà `D43` sinh ra để có.
    const id = await oppAt("tam_dung");
    const fn = await registry.loadCapability("reopenClosedOpportunity", admin);
    await expect(fn({ id })).rejects.toMatchObject({
      code: "STATE_TRANSITION_NOT_ALLOWED",
    });
    expect((await stageOf(id)).stage).toBe("tam_dung");
  });

  it("lõi KHÔNG tự canh vai — `AD-CR-10`", async () => {
    // Gọi thẳng lõi bằng Sales trên một Cơ hội đã đóng: lõi phải CHO QUA, vì
    // vai là việc của Cổng. Nếu phép kiểm này đỏ, nghĩa là có người vừa thêm
    // một điểm kiểm quyền thứ hai vào lõi — đúng thứ `AD-CR-10` đã loại.
    const { reopenClosedOpportunity } = await import("@/core/opportunity");
    const id = await oppAt("thua");
    await reopenClosedOpportunity(sales, id, ctx);
    expect((await stageOf(id)).stage).toBe("thuong_luong");
  });
});
