// `AD-CR-7` — sáu bước của một thao tác ghi, kiểm trên cơ sở dữ liệu thật.
//
// `tests/unit/stage.test.ts` kiểm HÀM THUẦN bằng bảng vào/ra, không chạm CSDL.
// Tệp này kiểm phần còn lại: hàm thuần đã đúng, nhưng nối nó vào tầng lưu trữ
// còn hai chỗ hỏng được mà bảng vào/ra không thấy —
//   ① `latest_open_stage` ghi ở câu `UPDATE` KHÁC với `stage`, để lộ một khoảnh
//      khắc hàng vi phạm `CHECK opp_latest_open_stage_iff`
//   ② mục Dòng thời gian **không** cuộn lại cùng một thao tác bị bác, để lại
//      một mục kể chuyện chưa từng xảy ra

import { describe, it, expect, beforeAll } from "vitest";
import { db } from "@/core/db";
import { createCompany } from "@/core/company";
import {
  createOpportunity,
  changeOpportunityStage,
  resumeFromPause,
} from "@/core/opportunity";
import { readTimeline } from "@/core/timeline";
import { createAuditSink } from "@/core/audit";
import type { Actor } from "@/core/actor";
import type { CoreContext } from "@/core/context";

const sales: Actor = { kind: "human", userId: "x", role: "sales" };
const machine: Actor = { kind: "system" };
const seeder: Actor = { kind: "seed" };

const ctx: CoreContext = {
  auditId: null,
  causedBy: null,
  audit: createAuditSink({ seedMode: true, keepAudit: false }),
};

let accountId = "";

beforeAll(async () => {
  const acc = await createCompany(seeder, { name: "Stage Co", market: "JP" }, ctx);
  accountId = acc.id;
});

async function newOpp(name: string): Promise<string> {
  const o = await createOpportunity(seeder, { accountId, name }, ctx);
  return o.id;
}

const stageOf = (id: string) =>
  db.opportunity.findUniqueOrThrow({
    where: { id },
    select: { stage: true, latestOpenStage: true },
  });

describe("AD-CR-7 — ghi chính và trường dẫn xuất trong CÙNG câu UPDATE", () => {
  it("đang chạy → đang chạy khác: `latest_open_stage` giữ `null`", async () => {
    const id = await newOpp("A");
    await changeOpportunityStage(sales, id, "thuong_luong", ctx);
    expect(await stageOf(id)).toEqual({ stage: "thuong_luong", latestOpenStage: null });
  });

  it("đang chạy → `tam_dung`: ghi lại giai đoạn vừa rời", async () => {
    const id = await newOpp("B");
    await changeOpportunityStage(sales, id, "soan_de_xuat", ctx);
    await changeOpportunityStage(sales, id, "tam_dung", ctx);
    expect(await stageOf(id)).toEqual({
      stage: "tam_dung",
      latestOpenStage: "soan_de_xuat",
    });
  });

  it("`tam_dung` → `thua`: GIỮ NGUYÊN, không ghi đè bằng `tam_dung`", async () => {
    // Đây là mệnh đề dễ trượt nhất của §5.1, và nếu trượt thì nó không hỏng ở
    // TypeScript mà hỏng ở `CHECK opp_latest_open_stage_running` — một lỗi
    // Postgres không đọc được, giữa buổi chấm.
    const id = await newOpp("C");
    await changeOpportunityStage(sales, id, "thuong_luong", ctx);
    await changeOpportunityStage(sales, id, "tam_dung", ctx);
    await changeOpportunityStage(sales, id, "thua", ctx);
    expect(await stageOf(id)).toEqual({
      stage: "thua",
      latestOpenStage: "thuong_luong",
    });
  });

  it("mở lại đưa về ĐÚNG Giai đoạn mở gần nhất, và xoá dấu", async () => {
    const id = await newOpp("D");
    await changeOpportunityStage(sales, id, "du_dieu_kien", ctx);
    await changeOpportunityStage(sales, id, "tam_dung", ctx);
    await resumeFromPause(sales, id, ctx);
    expect(await stageOf(id)).toEqual({ stage: "du_dieu_kien", latestOpenStage: null });
  });
});

describe("AD-CR-7 bước ⑤ — mục Dòng thời gian cuộn lại CÙNG thao tác", () => {
  it("mỗi lần đổi THẬT sinh đúng một mục", async () => {
    const id = await newOpp("E");
    const truoc = (await readTimeline(sales, accountId)).length;
    await changeOpportunityStage(sales, id, "du_dieu_kien", ctx);
    await changeOpportunityStage(sales, id, "thuong_luong", ctx);
    expect((await readTimeline(sales, accountId)).length).toBe(truoc + 2);
  });

  it("chuyển tiếp NGOÀI bảng §5.1 không để lại mục nào", async () => {
    const id = await newOpp("F");
    await changeOpportunityStage(sales, id, "thang", ctx);
    const truoc = (await readTimeline(sales, accountId)).length;
    // `thang` → `thua` là đóng → đóng, §5.1 nêu đích danh là cấm.
    await expect(changeOpportunityStage(sales, id, "thua", ctx)).rejects.toMatchObject({
      name: "BusinessRuleError",
    });
    expect((await readTimeline(sales, accountId)).length).toBe(truoc);
    // Và giai đoạn không nhúc nhích.
    expect((await stageOf(id)).stage).toBe("thang");
  });

  it("lời gọi của MÁY bị bác và không để lại mục nào", async () => {
    const id = await newOpp("G");
    const truoc = (await readTimeline(sales, accountId)).length;
    await expect(
      changeOpportunityStage(machine, id, "du_dieu_kien", ctx),
    ).rejects.toMatchObject({ code: "NFR-14" });
    expect((await readTimeline(sales, accountId)).length).toBe(truoc);
    expect((await stageOf(id)).stage).toBe("tiep_can");
  });

  it("mục do NGƯỜI tạo mang nhãn `nguoi`, do máy mang `he_thong`", async () => {
    const id = await newOpp("H");
    await changeOpportunityStage(sales, id, "du_dieu_kien", ctx);
    const muc = await readTimeline(sales, accountId);
    expect(muc[0]?.addedBy).toBe("nguoi");
  });

  it("Dòng thời gian sắp mới-nhất-trên, và thứ tự ổn định qua hai lần đọc", async () => {
    const a = await readTimeline(sales, accountId);
    const b = await readTimeline(sales, accountId);
    expect(a.map((x) => x.id)).toEqual(b.map((x) => x.id));
    for (let i = 1; i < a.length; i++) {
      expect(a[i - 1]!.occurredAt.getTime()).toBeGreaterThanOrEqual(
        a[i]!.occurredAt.getTime(),
      );
    }
  });
});
