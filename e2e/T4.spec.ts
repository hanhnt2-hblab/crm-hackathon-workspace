// T-4 — Sinh một gợi ý rồi không làm gì. Sau ít nhất ba chu kỳ vòng quét, hồ sơ
// công ty vẫn y nguyên
//
// Đề bài §6, NGUYÊN VĂN: *"Sinh một gợi ý rồi không làm gì. Sau ít nhất ba chu
// kỳ vòng quét, hồ sơ công ty vẫn y nguyên"*.
//
// Đây là điểm nghiệm thu về TRẠNG THÁI DỮ LIỆU, không về màn hình, nên khẳng
// định đi thẳng vào cơ sở dữ liệu rồi mới đối chiếu giao diện. Kiểm qua giao
// diện là kiểm gián tiếp: màn hình có thể đúng trong khi dữ liệu sai.
//
// ⚠ *"Y NGUYÊN"* PHẢI NÊU TÊN TẬP CỘT, nếu không phép kiểm này sai theo hai
// hướng cùng lúc:
//   · So CẢ HÀNG thì `T-4` đỏ vì `updated_at` — cột `@updatedAt` đổi theo mọi
//     lần ghi chạm hàng, kể cả lần ghi hợp lệ mà `T-8` ĐÒI phải có.
//   · So một cột thì nó xanh trên một sản phẩm đã sửa bảy cột còn lại.
// Tập đúng là TÁM ô `TargetField` — đúng tám ô mà một Gợi ý có thể nhắm vào
// (`enum TargetField`, bảng trọng số 0.2.3). KHÔNG gồm `updated_at`, KHÔNG gồm
// Dòng thời gian, KHÔNG gồm cờ `watching`.
//
// ⚠ *"BA CHU KỲ"* là ba VÒNG QUÉT, không phải ba phút. Chu kỳ demo mặc định 60
// giây (bảng 0.2.2), nên chờ đồng hồ thật là hơn ba phút cho một phép kiểm.
// `runCycles(3, …)` chạy đúng thân vòng mà bộ hẹn giờ gọi, ba lần, tức thì —
// xem `e2e/_scan.ts` để biết chỗ này bỏ qua cái gì và vì sao được phép bỏ.
//
// Mã thượng nguồn: `T-4` · `FR-21` (không duyệt thì hồ sơ giữ nguyên vô thời
// hạn) · `NFR-16` · `AD-3` · `D36`.

import "./_env";

import { test, expect } from "@playwright/test";
import { createCompany } from "@/core/company";
import { createSignal } from "@/core/signal";
import { createSuggestion } from "@/core/suggestion";
import {
  cleanupE2eData,
  createE2eUser,
  e2eName,
  mutedCtx,
  rawDb,
  seeder,
} from "./_fixtures";
import { emptyExtract, runCycles } from "./_scan";

const BAI_VIET = "Sakura Logistics vừa gọi vốn vòng B và đang mở rộng sang Osaka.";

/// TÁM ô `TargetField`, đúng tên cột Prisma. Đây là định nghĩa vận hành của
/// *"hồ sơ công ty vẫn y nguyên"*.
const TARGET_FIELDS = {
  website: true,
  country: true,
  specialtyArea: true,
  revenueRange: true,
  industry: true,
  dealValueTier: true,
  foundedYear: true,
  accountType: true,
} as const;

let accountId = "";
let suggestionId = "";
let hoSoTruoc: Record<string, unknown> = {};

test.describe.configure({ mode: "serial" });

test.beforeAll(async () => {
  const sales = await createE2eUser("T4");

  // Hồ sơ dựng với MỘT SỐ ô đã có giá trị và MỘT SỐ ô còn trống. Cả hai đều cần:
  // ô trống là nhánh máy được phép chạm (`AD-3` nhánh ⓐ), nên nếu có chỗ nào rò
  // rỉ thì nó rò ở đó trước.
  const acc = await createCompany(
    seeder,
    { name: e2eName("T4"), market: "JP", industry: "Logistics" },
    mutedCtx,
  );
  accountId = acc.id;

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
      contentHash: `e2e-t4-${Date.now()}`,
    },
    select: { id: true },
  });

  const signal = await createSignal(
    sales.actor,
    {
      accountId,
      articleId: art.id,
      claim: "Công ty đang mở rộng sang Osaka",
      quote: "mở rộng sang Osaka",
      quoteStart: 0,
      quoteEnd: 0,
      signalType: "expansion",
      signalSubtype: null,
      confidence: "chac",
      relevance: "high",
      eventDate: null,
    },
    mutedCtx,
  );

  // *"Sinh một gợi ý"* — nhắm vào ô `country`, một ô ĐANG TRỐNG. Chọn ô trống
  // có chủ đích: đó là nhánh dễ bị áp tự động nhất, nên nếu `FR-21` hỏng ở đâu
  // thì hỏng ở đây.
  const sug = await createSuggestion(
    sales.actor,
    {
      kind: "fill_field",
      accountId,
      signalId: signal.id,
      targetField: "country",
      currentValue: null,
      proposedValue: "Singapore",
    },
    mutedCtx,
  );
  suggestionId = sug.id;

  hoSoTruoc = await rawDb.account.findUniqueOrThrow({
    where: { id: accountId },
    select: TARGET_FIELDS,
  });
});

test.afterAll(async () => {
  await cleanupE2eData();
});

test.describe(
  "T-4 — Sinh một gợi ý rồi không làm gì. Sau ít nhất ba chu kỳ vòng quét, hồ sơ công ty vẫn y nguyên",
  () => {
    test("gợi ý đã sinh và đang ở trạng thái chờ — cảnh nền của phép kiểm", async () => {
      const sug = await rawDb.suggestion.findUniqueOrThrow({
        where: { id: suggestionId },
        select: { status: true, targetField: true, proposedValue: true, decidedBy: true },
      });
      expect(sug.status).toBe("cho");
      expect(sug.targetField).toBe("country");
      expect(sug.proposedValue).toBe("Singapore");
      // *"không làm gì"* — chưa ai quyết.
      expect(sug.decidedBy).toBeNull();
    });

    test("chạy ĐỦ ba chu kỳ vòng quét", async () => {
      const { outcomes } = await runCycles(3, emptyExtract);
      expect(outcomes).toHaveLength(3);

      // Ba vòng phải THẬT SỰ CHẠY. Nếu cả ba trả `ran: false` thì phép kiểm dưới
      // xanh một cách vô nghĩa: hồ sơ y nguyên vì chẳng có vòng nào chạy cả.
      const daChay = outcomes.filter((o) => o.ran);
      expect(
        daChay.length,
        "Ba vòng quét phải chạy thật. Không vòng nào chạy thì `T-4` xanh vô nghĩa — "
          + "hồ sơ y nguyên chỉ vì không có gì động vào nó. "
          + `Lý do bỏ vòng: ${outcomes.map((o) => (o.ran ? "ran" : o.reason)).join(", ")}`,
      ).toBe(3);
    });

    test("hồ sơ công ty vẫn Y NGUYÊN — cả tám ô TargetField", async () => {
      const hoSoSau = await rawDb.account.findUniqueOrThrow({
        where: { id: accountId },
        select: TARGET_FIELDS,
      });
      expect(hoSoSau).toEqual(hoSoTruoc);

      // Nêu riêng ô mà Gợi ý nhắm vào: nó phải VẪN TRỐNG. `toEqual` ở trên đã
      // phủ, nhưng khi đỏ thì dòng này nói ngay chỗ hỏng thay vì bắt người đọc
      // so tám cột.
      expect(hoSoSau.country).toBeNull();
    });

    test("gợi ý vẫn ở trạng thái chờ sau ba vòng — không ai và không cái gì tự quyết", async () => {
      const sug = await rawDb.suggestion.findUniqueOrThrow({
        where: { id: suggestionId },
        select: { status: true, decidedBy: true, decidedAt: true },
      });
      expect(sug.status).toBe("cho");
      expect(sug.decidedBy).toBeNull();
      expect(sug.decidedAt).toBeNull();
    });

    test("đối chiếu giao diện: hồ sơ trên màn hình cũng không đổi", async ({ page }) => {
      const sales = await rawDb.user.findFirstOrThrow({
        where: { email: { endsWith: "@e2e.test" } },
        select: { id: true },
      });
      await page.context().addCookies([
        { name: "why_now_user", value: sales.id, domain: "127.0.0.1", path: "/" },
      ]);
      await page.goto(`/accounts/${accountId}`);

      // Ô `country` còn trống thì màn hình KHÔNG được hiện giá trị mà Gợi ý đề
      // nghị. Đây là vế đối chiếu: dữ liệu đúng mà màn hình hiện sẵn giá trị chờ
      // duyệt cũng là hỏng — người đọc tưởng đã có.
      await expect(page.getByRole("heading", { name: /^\[E2E\] T4/ })).toBeVisible();
      // ⚠ GIÁ TRỊ ĐỀ NGHỊ CỐ Ý KHÔNG PHẢI "Nhật Bản". Công ty này có
      // `market: "JP"`, mà `MARKET_LABEL.JP` hiển thị đúng chữ *Nhật Bản* trên
      // hàng thẻ meta — nên khẳng định *"không thấy Nhật Bản"* sẽ ĐỎ vì một lý do
      // chẳng liên quan gì tới `T-4`. Một chuỗi không xuất hiện ở đâu khác trên
      // trang là điều kiện để phép kiểm này nói được điều nó định nói.
      // ⚠ KHẲNG ĐỊNH THU HẸP VỀ KHỐI HỒ SƠ, không quét cả trang — và thu hẹp
      // vì bề mặt đổi, không phải vì khẳng định cũ quá nghiêm.
      //
      // Trang nay có thêm khối **Gợi ý chờ quyết** (`T-5`), và khối đó hiện giá
      // trị đề nghị — đúng việc của một hàng đợi. Quét cả trang thì phép kiểm
      // này đỏ vì một tính năng chạy ĐÚNG, và thông điệp lỗi sẽ trỏ vào `T-4`
      // trong khi chẳng có gì sai với `T-4`.
      //
      // `section` là thẻ ngữ nghĩa, không phải class trang trí; khối hồ sơ là
      // `section` duy nhất chứa tiêu đề cấp 1.
      const khoiHoSo = page
        .locator("section")
        .filter({ has: page.getByRole("heading", { level: 1 }) });
      await expect(
        khoiHoSo.getByText("Singapore", { exact: true }),
        "Ô `country` còn trống thì khối hồ sơ KHÔNG được hiện giá trị Gợi ý đề nghị.",
      ).toHaveCount(0);

      // Vế DƯƠNG, và nó làm phép kiểm MẠNH HƠN bản cũ: giá trị phải tồn tại
      // trên trang — dưới dạng một ĐỀ NGHỊ CHỜ QUYẾT. Bản cũ chỉ chứng minh
      // *"không thấy Singapore"*, thứ cũng đúng nếu Gợi ý biến mất hoàn toàn.
      await expect(
        page.getByText("Singapore", { exact: true }),
        "Gợi ý phải còn nguyên ở hàng đợi: `T-4` là *không ai quyết*, không phải "
          + "*Gợi ý bị mất*.",
      ).toHaveCount(1);
    });
  },
);
