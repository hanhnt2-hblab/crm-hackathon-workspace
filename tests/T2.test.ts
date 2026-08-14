// T-2 — Phát hiện thiếu câu trích không lưu được
//
// Đề bài §6, nguyên văn: *"Không lưu được một phát hiện thiếu câu trích. Thử
// ghi thẳng, phải bị từ chối."*
//
// **"Thử ghi thẳng"** là vế quyết định hình dạng tệp này. Nó KHÔNG đi qua giao
// diện, KHÔNG đi qua lược đồ Zod của tầng ④, mà gọi thẳng hàm lõi. Một bộ kiểm
// đi qua tầng ④ sẽ xanh nhờ Zod bắt chuỗi rỗng, và khi đó nó chứng minh sai thứ:
// chứng minh lược đồ chặt, không chứng minh tầng nghiệp vụ chặn.
//
// `D36`: `T-n` là lớp NGOÀI. Cục sở hữu thân: ⑤. Mốc: M1.

import { describe, it, expect, beforeAll } from "vitest";
import { db } from "@/core/db";
import { createSignal } from "@/core/signal";
import { createCompany } from "@/core/company";
import { createAuditSink } from "@/core/audit";
import { BusinessRuleError } from "@/core/errors";
import type { Actor } from "@/core/actor";
import type { CoreContext } from "@/core/context";

const sales: Actor = { kind: "human", userId: "", role: "sales" };
const seeder: Actor = { kind: "seed" };

/// Ghi vết CÂM: tệp này không kiểm ghi vết, và một sink thật sẽ để lại hàng làm
/// nhiễu `T-5` nếu ai đó chạy hai bộ kiểm cùng database.
const ctx: CoreContext = {
  auditId: null,
  causedBy: null,
  audit: createAuditSink({ seedMode: true, keepAudit: false }),
};

const BAI_VIET = "Tomahawk Systems vừa gọi vốn vòng B trị giá 20 triệu đô la.";

let accountId = "";
let articleId = "";

beforeAll(async () => {
  const user = await db.user.create({
    data: { email: `t2-${Date.now()}@x.test`, displayName: "T2", role: "sales" },
    select: { id: true },
  });
  (sales as { userId: string }).userId = user.id;

  const acc = await createCompany(seeder, { name: "T-2 Co", market: "JP" }, ctx);
  accountId = acc.id;

  // Bản chụp và Bản lưu dựng thẳng bằng Prisma: `tests/**` được phép (`AD-1`),
  // và hai bảng này chưa có capability nào — chúng thuộc `src/ingest`, chưa tới.
  const snap = await db.snapshot.create({
    data: { accountId, version: "truoc", capturedAt: new Date() },
    select: { id: true },
  });
  const art = await db.article.create({
    data: {
      accountId,
      snapshotId: snap.id,
      rawText: BAI_VIET,
      normalizedText: BAI_VIET,
      readAt: new Date(),
      contentHash: "t2-hash",
    },
    select: { id: true },
  });
  articleId = art.id;
});

const draft = (over: Record<string, unknown> = {}) => ({
  accountId,
  articleId,
  claim: "Công ty vừa gọi vốn vòng B",
  quote: "gọi vốn vòng B",
  quoteStart: 0,
  quoteEnd: 0,
  signalType: "funding" as const,
  signalSubtype: null,
  confidence: "chac" as const,
  relevance: "high" as const,
  eventDate: null,
  ...over,
});

describe("T-2 — Phát hiện thiếu câu trích không lưu được", () => {
  it("câu trích rỗng bị từ chối bằng BR-D1, gọi THẲNG lõi", async () => {
    await expect(createSignal(sales, draft({ quote: "" }), ctx)).rejects.toMatchObject({
      name: "BusinessRuleError",
      code: "BR-D1",
    });
  });

  it("câu trích chỉ có khoảng trắng cũng bị từ chối — NOT NULL không bắt được", async () => {
    await expect(createSignal(sales, draft({ quote: "   \n\t " }), ctx)).rejects.toMatchObject({
      code: "BR-D1",
    });
  });

  it("không hàng nào lọt xuống bảng sau hai lần thử", async () => {
    const n = await db.signal.count({ where: { accountId } });
    expect(n).toBe(0);
  });

  it("BR-D2 — câu trích không khớp nguyên văn thì LOẠI, không lưu kèm cảnh báo", async () => {
    await expect(
      createSignal(sales, draft({ quote: "gọi vốn vòng C" }), ctx),
    ).rejects.toMatchObject({ code: "BR-D2" });
    expect(await db.signal.count({ where: { accountId } })).toBe(0);
  });

  it("BR-D3 — Phát hiện gán sang Công ty khác Bản lưu thì bị từ chối", async () => {
    const other = await createCompany(seeder, { name: "T-2 Khác", market: "JP" }, ctx);
    await expect(
      createSignal(sales, draft({ accountId: other.id }), ctx),
    ).rejects.toMatchObject({ code: "BR-D3" });
  });

  it("đường XANH: câu trích khớp thì lưu được, và offset do LÕI tính", async () => {
    // Cố ý đưa offset sai. Lõi phải bỏ qua và dùng giá trị nó tự tìm — tin bên
    // gọi ở đây là mở đường cho `T-3` mở sai đoạn văn.
    const s = await createSignal(sales, draft({ quoteStart: 999, quoteEnd: 999 }), ctx);
    const row = await db.signal.findUniqueOrThrow({
      where: { id: s.id },
      select: { quote: true, quoteStart: true, quoteEnd: true },
    });
    expect(BAI_VIET.slice(row.quoteStart, row.quoteEnd)).toBe(row.quote);
    expect(row.quoteStart).not.toBe(999);
  });

  it("mọi lỗi trên là BusinessRuleError, không phải lỗi hạ tầng", async () => {
    const e = await createSignal(sales, draft({ quote: "" }), ctx).catch((x: unknown) => x);
    expect(e).toBeInstanceOf(BusinessRuleError);
  });
});
