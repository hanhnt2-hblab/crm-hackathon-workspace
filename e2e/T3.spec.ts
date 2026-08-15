// T-3 — Bấm vào một phát hiện thì mở đúng đoạn văn gốc trong bản lưu, có đánh
// dấu vị trí
//
// Đề bài §6, NGUYÊN VĂN: *"Bấm vào một phát hiện thì mở đúng đoạn văn gốc trong
// bản lưu, có đánh dấu vị trí"*.
//
// ĐÂY LÀ LUỒNG GIAO DIỆN, và là một trong ba điểm mà bộ e2e trình duyệt đáng
// công nhất: *"bấm"*, *"mở"*, *"đánh dấu vị trí"* đều là thứ jsdom không phát
// biểu được. `tests/T3.test.ts` nói thẳng điều đó ở đầu tệp.
//
// ⚠ TỆP NÀY SẼ ĐỎ, VÀ ĐỎ LÀ CÂU TRẢ LỜI ĐÚNG.
// Bề mặt `S7` — xem Bản lưu, tô sáng câu trích — CHƯA TỒN TẠI. `src/app` hôm nay
// có đúng sáu trang: `/`, `/login`, `/accounts`, `/accounts/[id]`, `/board`,
// `/admin`. Không trang nào hiện một Phát hiện, nên không có gì để bấm.
//
// Có thể làm cho tệp này xanh trong ba phút bằng cách bỏ phần giao diện và chỉ
// giữ phần hợp đồng dữ liệu. KHÔNG LÀM. Xanh khi đó nghĩa là *"khoảng
// `[quote_start, quote_end)` cắt đúng chuỗi"* — đúng, nhưng đó không phải điều
// `T-3` hỏi. `T-3` hỏi một cú bấm có mở đúng đoạn văn không, và câu trả lời
// trung thực hôm nay là CHƯA. Một bộ nghiệm thu xanh trên một tính năng chưa
// tồn tại còn tệ hơn không có bộ nghiệm thu.
//
// Nên tệp này có HAI phần, và báo cáo phải đọc được cả hai:
//   ① hợp đồng dữ liệu mà bề mặt ấy sẽ dùng — XANH, đã sẵn sàng;
//   ② chính điều §6 đòi — ĐỎ, vì thiếu bề mặt.
//
// Mã thượng nguồn: `T-3` · `FR-13` · `BR-D2` (câu trích khớp nguyên văn) ·
// `C1-8` · `S7` · `D36`.

import "./_env";

import { test, expect } from "@playwright/test";
import { createSignal } from "@/core/signal";
import { createCompany } from "@/core/company";
import {
  cleanupE2eData,
  createE2eUser,
  e2eName,
  mutedCtx,
  rawDb,
  seeder,
} from "./_fixtures";

// Đoạn văn CÓ CHỦ ĐÍCH chứa câu trích ở GIỮA, không ở đầu. Câu trích ở offset 0
// làm phép kiểm xanh kể cả khi mã bỏ qua `quote_start` hoàn toàn.
const BAI_VIET =
  "Bản tin ngành ngày 12/08. Tomahawk Systems vừa gọi vốn vòng B trị giá 20 triệu đô la. "
  + "Công ty cho biết sẽ mở thêm văn phòng tại Osaka trong quý tới.";
const CAU_TRICH = "gọi vốn vòng B";

let accountId = "";
let signalId = "";
let salesUserId = "";

test.describe.configure({ mode: "serial" });

test.beforeAll(async () => {
  const sales = await createE2eUser("T3");
  salesUserId = sales.id;

  const acc = await createCompany(seeder, { name: e2eName("T3"), market: "JP" }, mutedCtx);
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
      contentHash: `e2e-t3-${Date.now()}`,
    },
    select: { id: true },
  });

  const s = await createSignal(
    sales.actor,
    {
      accountId,
      articleId: art.id,
      claim: "Công ty vừa gọi vốn vòng B",
      quote: CAU_TRICH,
      quoteStart: 0,
      quoteEnd: 0,
      signalType: "funding",
      signalSubtype: null,
      confidence: "chac",
      relevance: "high",
      eventDate: null,
    },
    mutedCtx,
  );
  signalId = s.id;
});

test.afterAll(async () => {
  await cleanupE2eData();
});

test.describe(
  "T-3 — Bấm vào một phát hiện thì mở đúng đoạn văn gốc trong bản lưu, có đánh dấu vị trí",
  () => {
    // ── ① Hợp đồng dữ liệu — nền của *"đánh dấu vị trí"* ───────────────────
    test("khoảng [quote_start, quote_end) cắt ĐÚNG câu trích trên đoạn văn gốc", async () => {
      const row = await rawDb.signal.findUniqueOrThrow({
        where: { id: signalId },
        select: {
          quote: true,
          quoteStart: true,
          quoteEnd: true,
          article: { select: { rawText: true } },
        },
      });

      // Đây là thứ khiến *"đánh dấu vị trí"* khả thi: bề mặt chỉ cần cắt chuỗi
      // theo hai offset này là tô sáng đúng chỗ.
      expect(row.article.rawText.slice(row.quoteStart, row.quoteEnd)).toBe(row.quote);
      expect(row.quote).toBe(CAU_TRICH);

      // Câu trích nằm GIỮA đoạn văn — nếu offset là 0 thì mã đang bỏ qua nó.
      expect(row.quoteStart).toBeGreaterThan(0);
    });

    test("Phát hiện trace về đúng Bản lưu, và Bản lưu thuộc đúng Công ty", async () => {
      const row = await rawDb.signal.findUniqueOrThrow({
        where: { id: signalId },
        select: { accountId: true, article: { select: { accountId: true } } },
      });
      expect(row.accountId).toBe(accountId);
      expect(row.article.accountId).toBe(accountId);
    });

    // ── ② Chính điều §6 đòi — qua trình duyệt ──────────────────────────────
    test("bấm vào Phát hiện trên hồ sơ công ty thì mở đoạn văn gốc có đánh dấu vị trí", async ({
      page,
    }) => {
      await page.context().addCookies([
        { name: "why_now_user", value: salesUserId, domain: "127.0.0.1", path: "/" },
      ]);
      await page.goto(`/accounts/${accountId}`);

      // Bước 1 — Phát hiện phải HIỆN trên hồ sơ công ty và bấm được.
      // Hôm nay `/accounts/[id]` chỉ có Cơ hội, Người liên hệ, Ghi hoạt động,
      // Dòng thời gian. Không khối nào hiện Phát hiện, nên dòng dưới đây đỏ.
      const phatHien = page.getByText("Công ty vừa gọi vốn vòng B", { exact: true });
      await expect(
        phatHien,
        "§6 T-3 đòi bấm được vào một Phát hiện. Bề mặt `S7` chưa tồn tại trong `src/app` — "
          + "không màn hình nào hiện Phát hiện, nên không có gì để bấm.",
      ).toBeVisible();

      await phatHien.click();

      // Bước 2 — mở đúng ĐOẠN VĂN GỐC, không phải chỉ câu trích.
      await expect(page.getByText(BAI_VIET, { exact: false })).toBeVisible();

      // Bước 3 — *"có đánh dấu vị trí"*. Đánh dấu phải là một phần tử RIÊNG bọc
      // ĐÚNG câu trích, không phải cả đoạn văn được tô.
      //
      // ⚠ `<mark>` là THẺ NGỮ NGHĨA, không phải một class trang trí — nó là cách
      // HTML phát biểu *"đoạn này được làm nổi vì liên quan"*, và trình đọc màn
      // hình công bố nó. Nên `locator("mark")` ở đây không vi phạm luật
      // *"chọn bằng vai và chữ hiển thị, không bằng class CSS"*: nó chọn bằng ý
      // nghĩa. Playwright chưa cấp vai ARIA `mark` nên không có
      // `getByRole` tương ứng.
      //
      // Một `<span class="highlight">` cũng tô vàng y hệt trên màn hình nhưng
      // câm với trình đọc màn hình — và phép kiểm này cố ý KHÔNG nhận nó.
      const danhDau = page.locator("mark");
      await expect(danhDau).toHaveText(CAU_TRICH);
    });
  },
);
