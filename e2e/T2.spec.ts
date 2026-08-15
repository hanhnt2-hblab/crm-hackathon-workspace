// T-2 — Không lưu được một phát hiện thiếu câu trích
//
// Đề bài §6, NGUYÊN VĂN: *"Không lưu được một phát hiện thiếu câu trích. Thử ghi
// thẳng, phải bị từ chối"*.
//
// ⚠ LUỒNG NÀY KHÔNG QUAN SÁT ĐƯỢC QUA TRÌNH DUYỆT, và đó là yêu cầu chứ không
// phải hạn chế. *"Thử ghi thẳng"* nghĩa là KHÔNG đi qua giao diện: một bộ kiểm
// bấm nút trên màn hình sẽ xanh nhờ lược đồ Zod của tầng ④ bắt chuỗi rỗng, và
// khi đó nó chứng minh sai thứ — chứng minh lược đồ chặt, không chứng minh tầng
// nghiệp vụ chặn. Nên tệp này gọi THẲNG hàm lõi, trong tiến trình Playwright,
// trỏ đúng CSDL demo 5442.
//
// Nó vẫn nằm trong Playwright vì hai lý do, cả hai đều thật:
//   ① báo cáo HTML phải hiện đủ mười mục — thiếu một là ban giám khảo phải đi
//      tìm chỗ khác để biết `T-2` có xanh không;
//   ② nó chạy trên CÙNG bản dựng production và CÙNG cơ sở dữ liệu với chín
//      luồng kia, nên nó chứng minh chốt chặn còn đứng ở chính cấu hình đem
//      chấm — chứ không phải ở một database kiểm thử dựng riêng.
//
// Mã thượng nguồn: `T-2` · `BR-D1` (câu trích bắt buộc) · `BR-D2` (câu trích
// khớp nguyên văn) · `BR-D3` (Phát hiện ↔ Công ty của Bản lưu) · `D36`.

import "./_env";

import { test, expect } from "@playwright/test";
import { createSignal } from "@/core/signal";
import { createCompany } from "@/core/company";
import { BusinessRuleError } from "@/core/errors";
import {
  cleanupE2eData,
  createE2eUser,
  e2eName,
  mutedCtx,
  rawDb,
  seeder,
} from "./_fixtures";

const BAI_VIET = "Tomahawk Systems vừa gọi vốn vòng B trị giá 20 triệu đô la.";

let accountId = "";
let otherAccountId = "";
let articleId = "";
let sales: Parameters<typeof createSignal>[0];

test.beforeAll(async () => {
  const user = await createE2eUser("T2");
  sales = user.actor;

  const acc = await createCompany(seeder, { name: e2eName("T2"), market: "JP" }, mutedCtx);
  accountId = acc.id;

  const other = await createCompany(seeder, { name: e2eName("T2-khac"), market: "JP" }, mutedCtx);
  otherAccountId = other.id;

  // Bản chụp và Bản lưu dựng thẳng bằng Prisma: hai bảng này thuộc `src/ingest`
  // và chưa có capability nào phủ, nên chưa có "đường sản phẩm" để đi qua.
  const snap = await rawDb.snapshot.create({
    data: { accountId, version: "truoc", capturedAt: new Date() },
    select: { id: true },
  });
  const art = await rawDb.article.create({
    data: {
      accountId,
      snapshotId: snap.id,
      rawText: BAI_VIET,
      normalizedText: BAI_VIET,
      readAt: new Date(),
      contentHash: `e2e-t2-${Date.now()}`,
    },
    select: { id: true },
  });
  articleId = art.id;
});

test.afterAll(async () => {
  await cleanupE2eData();
});

/// Bản nháp HỢP LỆ. Mỗi phép kiểm chỉ hỏng đúng một trường, nên khi nó đỏ thì
/// nguyên nhân là trường đó chứ không phải một thứ khác trong bản nháp.
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

test.describe(
  "T-2 — Không lưu được một phát hiện thiếu câu trích. Thử ghi thẳng, phải bị từ chối",
  () => {
    test("BR-D1 — câu trích rỗng bị từ chối, gọi THẲNG lõi không qua giao diện", async () => {
      const err = await createSignal(sales, draft({ quote: "" }), mutedCtx).catch(
        (e: unknown) => e,
      );
      expect(err).toBeInstanceOf(BusinessRuleError);
      expect(err).toMatchObject({ code: "BR-D1" });
    });

    test("BR-D1 — câu trích chỉ có khoảng trắng cũng bị từ chối; NOT NULL không bắt được", async () => {
      const err = await createSignal(sales, draft({ quote: "   \n\t " }), mutedCtx).catch(
        (e: unknown) => e,
      );
      expect(err).toMatchObject({ code: "BR-D1" });
    });

    test("BR-D2 — câu trích không khớp nguyên văn thì LOẠI, không lưu kèm cảnh báo", async () => {
      const err = await createSignal(
        sales,
        draft({ quote: "gọi vốn vòng C" }),
        mutedCtx,
      ).catch((e: unknown) => e);
      expect(err).toMatchObject({ code: "BR-D2" });
    });

    test("BR-D3 — Phát hiện gán sang Công ty khác Bản lưu thì bị từ chối", async () => {
      const err = await createSignal(
        sales,
        draft({ accountId: otherAccountId }),
        mutedCtx,
      ).catch((e: unknown) => e);
      expect(err).toMatchObject({ code: "BR-D3" });
    });

    test("không hàng nào lọt xuống bảng sau bốn lần thử — TỪ CHỐI, không phải lưu rồi ẩn", async () => {
      // Đếm bằng `rawDb`, tức KHÔNG lọc `deleted_at IS NULL`. Một hàng lưu rồi
      // xoá mềm vẫn là đã lưu, và `db` thường sẽ giấu nó đi.
      const n = await rawDb.signal.count({
        where: { accountId: { in: [accountId, otherAccountId] } },
      });
      expect(n).toBe(0);
    });

    test("đường XANH: câu trích khớp thì lưu được, và offset do LÕI tính", async () => {
      // Cố ý đưa offset sai. Lõi phải bỏ qua và dùng giá trị nó tự tìm — tin bên
      // gọi ở đây là mở đường cho `T-3` mở sai đoạn văn.
      const s = await createSignal(
        sales,
        draft({ quoteStart: 999, quoteEnd: 999 }),
        mutedCtx,
      );
      const row = await rawDb.signal.findUniqueOrThrow({
        where: { id: s.id },
        select: { quote: true, quoteStart: true, quoteEnd: true },
      });
      expect(BAI_VIET.slice(row.quoteStart, row.quoteEnd)).toBe(row.quote);
      expect(row.quoteStart).not.toBe(999);
    });
  },
);
