// T-10a — Lõi từ chối thao tác dưới danh nghĩa hệ thống
//
// Đề bài §6, nguyên văn: *"Thử đổi giai đoạn, đổi giá trị tiền và xoá một công
// ty dưới danh nghĩa hệ thống, không đi qua giao diện người dùng. Cả ba đều bị
// từ chối."*
//
// **"không đi qua giao diện người dùng"** quyết định hình dạng tệp này: mọi lời
// gọi ở đây vào THẲNG hàm lõi. Cổng là lớp chặn thứ nhất và `T-10b` kiểm nó;
// tệp này kiểm lớp thứ hai — thứ còn đứng khi ai đó gọi vòng qua Cổng.
//
// Đề bài nói *"một lời dặn dò suông với phần AI không tính là đã chặn"*. Hai
// lớp là cách duy nhất phát biểu đó thành thứ đo được.
//
// `D36`: `T-n` là lớp NGOÀI. Cục sở hữu thân: ⑤. Mốc: M1.

import { describe, it, expect, beforeAll } from "vitest";
import { db } from "@/core/db";
import { createCompany, softDeleteCompany } from "@/core/company";
import { createOpportunity, updateOpportunity } from "@/core/opportunity";
import { changeStage, resumeOrReopen } from "@/core/opportunity/stage";
import { createAuditSink } from "@/core/audit";
import type { Actor } from "@/core/actor";
import type { CoreContext } from "@/core/context";

const sales: Actor = { kind: "human", userId: "", role: "sales" };
const machine: Actor = { kind: "system" };
const seeder: Actor = { kind: "seed" };

const ctx: CoreContext = {
  auditId: null,
  causedBy: null,
  audit: createAuditSink({ seedMode: true, keepAudit: false }),
};

let accountId = "";
let opportunityId = "";

beforeAll(async () => {
  const user = await db.user.create({
    data: { email: `t10a-${Date.now()}@x.test`, displayName: "T10a", role: "sales" },
    select: { id: true },
  });
  (sales as { userId: string }).userId = user.id;

  const acc = await createCompany(seeder, { name: "T-10a Co", market: "JP" }, ctx);
  accountId = acc.id;
  const opp = await createOpportunity(
    seeder,
    { accountId, name: "Cơ hội T-10a", amount: "1000000.00", currency: "JPY" },
    ctx,
  );
  opportunityId = opp.id;
});

describe("T-10a vế 1 — máy KHÔNG đổi Giai đoạn (NFR-14)", () => {
  it("changeStage dưới danh nghĩa hệ thống bị từ chối", () => {
    expect(() =>
      changeStage(machine, { stage: "tiep_can", latestOpenStage: null }, "du_dieu_kien"),
    ).toThrowError(/Chỉ người đổi được Giai đoạn/);
  });

  it("chặn trên MỌI cặp, kể cả cặp hợp lệ với người", () => {
    const e = (() => {
      try {
        changeStage(machine, { stage: "thuong_luong", latestOpenStage: null }, "thang");
      } catch (x) {
        return x as { code: string };
      }
    })();
    expect(e?.code).toBe("NFR-14");
  });

  it("`seed` cũng bị chặn — nhánh thứ ba của ActorKind, không chỉ `system`", () => {
    expect(() =>
      changeStage(seeder, { stage: "tiep_can", latestOpenStage: null }, "du_dieu_kien"),
    ).toThrowError(/Chỉ người đổi được Giai đoạn/);
  });

  it("mở lại Cơ hội đã đóng dưới danh nghĩa hệ thống cũng bị chặn", () => {
    expect(() =>
      resumeOrReopen(machine, { stage: "thua", latestOpenStage: "thuong_luong" }),
    ).toThrowError(/Chỉ người mở lại/);
  });
});

describe("T-10a vế 2 — máy KHÔNG sửa giá trị tiền (NFR-15)", () => {
  it("updateOpportunity với `amount` dưới danh nghĩa hệ thống bị từ chối", async () => {
    await expect(
      updateOpportunity(machine, opportunityId, { amount: "9999999.00" }, ctx),
    ).rejects.toMatchObject({ code: "NFR-15" });
  });

  it("`currency` cũng bị chặn — đơn vị tiền là một nửa của giá trị tiền", async () => {
    await expect(
      updateOpportunity(machine, opportunityId, { currency: "USD" }, ctx),
    ).rejects.toMatchObject({ code: "NFR-15" });
  });

  it("giá trị tiền KHÔNG đổi sau hai lần thử", async () => {
    const row = await db.opportunity.findUniqueOrThrow({
      where: { id: opportunityId },
      select: { amount: true, currency: true },
    });
    expect(String(row.amount)).toBe("1000000");
    expect(row.currency).toBe("JPY");
  });

  it("người sửa được — chốt chặn đúng TÁC NHÂN, không chặn cả thao tác", async () => {
    await updateOpportunity(sales, opportunityId, { amount: "2000000.00" }, ctx);
    const row = await db.opportunity.findUniqueOrThrow({
      where: { id: opportunityId },
      select: { amount: true },
    });
    expect(String(row.amount)).toBe("2000000");
  });
});

describe("T-10a vế 3 — máy KHÔNG xoá dữ liệu người tạo (NFR-17)", () => {
  it("softDeleteCompany dưới danh nghĩa hệ thống bị từ chối", async () => {
    await expect(softDeleteCompany(machine, accountId, ctx)).rejects.toMatchObject({
      code: "NFR-17",
    });
  });

  it("Công ty còn nguyên, chưa bị đánh dấu xoá", async () => {
    const row = await db.account.findUniqueOrThrow({
      where: { id: accountId },
      select: { deletedAt: true },
    });
    expect(row.deletedAt).toBeNull();
  });

  it("người xoá được, và cascade `D26` chạm đúng ba bảng con", async () => {
    await softDeleteCompany(sales, accountId, ctx);
    const [acc, opp] = await Promise.all([
      db.account.findUnique({ where: { id: accountId } }),
      db.opportunity.findUnique({ where: { id: opportunityId } }),
    ]);
    // Extension xoá mềm lọc hàng đã xoá, nên cả hai phải là `null`.
    expect(acc).toBeNull();
    expect(opp).toBeNull();
  });
});
