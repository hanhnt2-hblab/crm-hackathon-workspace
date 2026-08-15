// T-6 — Đổi một công ty đang có cơ hội mở sang phiên bản trang web "sau"
//
// Đề bài §6, NGUYÊN VĂN: *"Đổi một công ty đang có cơ hội mở sang phiên bản trang
// web "sau". Việc tiếp theo của cơ hội tự đổi, có thông báo, và ô mang dấu hiệu
// do hệ thống đặt"*.
//
// Ba vế phải khẳng định RIÊNG, vì chúng hỏng độc lập nhau:
//   ① Việc tiếp theo TỰ ĐỔI — có hàng `next_action` mới, nội dung và hạn đổi
//   ② CÓ THÔNG BÁO — hàng `notification`
//   ③ Ô MANG DẤU HIỆU DO HỆ THỐNG ĐẶT — `next_action_set_by = 'he_thong'`
// Vế ③ là vế dễ đánh rơi nhất và là vế `T-7` dựa vào: không có nó thì Hoàn tác
// không biết cái gì được phép gỡ.
//
// ⚠ *"ĐỔI SANG PHIÊN BẢN SAU"* là thao tác của NGƯỜI, và hôm nay chưa có bề mặt
// nào cho nó. §3 nói bản chụp có phiên bản trước/sau; `src/ingest` dựng được
// chúng, nhưng `src/app` không có màn hình đổi phiên bản. Nên tệp này dựng Bản
// chụp `"sau"` bằng Prisma rồi để VÒNG QUÉT đọc nó — tức vẫn đi qua đúng đường
// sản phẩm dùng để sinh Việc tiếp theo, chỉ thiếu cú bấm của người ở đầu.
//
// ⚠ HẠN LẤY TỪ MỤC 0, KHÔNG TỰ NGHĨ. `funding` + `chac` + `high` = **1 ngày làm
// việc** (bảng 0.2.1). Đó cũng là lý do chọn `funding` cho tệp này: nó là dòng
// có hạn NGẮN NHẤT, nên nếu bảng hạn bị đọc sai thì sai lệch lộ ra rõ nhất.
//
// Mã thượng nguồn: `T-6` · `FR-30`…`FR-34` · `BR-D7` (hạn đo từ ngày sự kiện) ·
// `AD-3` (chạm ghi của máy đòi `signalId` nguồn) · `AD-10` · `D36`.

import "./_env";

import { test, expect } from "@playwright/test";
import { createCompany } from "@/core/company";
import { createOpportunity } from "@/core/opportunity";
import {
  cleanupE2eData,
  createE2eUser,
  e2eName,
  mutedCtx,
  rawDb,
  seeder,
} from "./_fixtures";
import { runCycles, signalDraft, stubExtract } from "./_scan";

const TRUOC = "Sakura Logistics là công ty vận tải nội địa, thành lập năm 2008.";
const SAU =
  "Sakura Logistics là công ty vận tải nội địa, thành lập năm 2008. "
  + "Tháng 8/2026 công ty công bố gọi vốn vòng B trị giá 20 triệu đô la.";

let accountId = "";
let opportunityId = "";
let salesUserId = "";

test.describe.configure({ mode: "serial" });

test.beforeAll(async () => {
  const sales = await createE2eUser("T6");
  salesUserId = sales.id;

  // Công ty ĐANG THEO DÕI — điều kiện để vòng quét nhặt nó lên (`AD-3`).
  const tenCongTy = e2eName("T6");
  const acc = await createCompany(seeder, { name: tenCongTy, market: "JP" }, mutedCtx);
  accountId = acc.id;
  await rawDb.account.update({ where: { id: accountId }, data: { watching: true } });

  // *"đang có cơ hội mở"* — Tiếp cận là giai đoạn mở.
  const opp = await createOpportunity(
    seeder,
    { accountId, name: `${tenCongTy} — gói vận hành` },
    mutedCtx,
  );
  opportunityId = opp.id;

  // Bản chụp TRƯỚC — cảnh nền, chưa có tin gọi vốn.
  const snapTruoc = await rawDb.snapshot.create({
    data: { accountId, version: "truoc", capturedAt: new Date(Date.now() - 86_400_000) },
    select: { id: true },
  });
  await rawDb.article.create({
    data: {
      accountId,
      snapshotId: snapTruoc.id,
      rawText: TRUOC,
      normalizedText: TRUOC,
      readAt: new Date(Date.now() - 86_400_000),
      contentHash: `e2e-t6-truoc-${Date.now()}`,
    },
  });
});

test.afterAll(async () => {
  await cleanupE2eData();
});

test.describe(
  "T-6 — Đổi một công ty đang có cơ hội mở sang phiên bản trang web sau. Việc tiếp theo của cơ hội tự đổi, có thông báo, và ô mang dấu hiệu do hệ thống đặt",
  () => {
    test("cảnh nền: cơ hội đang mở và CHƯA có Việc tiếp theo", async () => {
      const opp = await rawDb.opportunity.findUniqueOrThrow({
        where: { id: opportunityId },
        select: { stage: true },
      });
      expect(opp.stage).toBe("tiep_can");

      const n = await rawDb.nextAction.count({
        where: { opportunityId, deletedAt: null },
      });
      expect(n).toBe(0);
    });

    test("đổi sang phiên bản SAU rồi chạy vòng quét", async () => {
      const snapSau = await rawDb.snapshot.create({
        data: { accountId, version: "sau", capturedAt: new Date() },
        select: { id: true },
      });
      await rawDb.article.create({
        data: {
          accountId,
          snapshotId: snapSau.id,
          rawText: SAU,
          normalizedText: SAU,
          readAt: new Date(),
          contentHash: `e2e-t6-sau-${Date.now()}`,
        },
      });

      const drafts = new Map([
        [
          accountId,
          [
            signalDraft({
              claim: "Công ty vừa gọi vốn vòng B trị giá 20 triệu đô la",
              quote: "gọi vốn vòng B",
              signalType: "funding",
              confidence: "chac",
              relevance: "high",
            }),
          ],
        ],
      ]);

      const { outcomes } = await runCycles(1, stubExtract(drafts));
      expect(
        outcomes[0]?.ran,
        `Vòng quét không chạy: ${outcomes[0]?.ran === false ? outcomes[0].reason : "?"}`,
      ).toBe(true);
    });

    test("① Việc tiếp theo của cơ hội TỰ ĐỔI", async () => {
      const na = await rawDb.nextAction.findFirst({
        where: { opportunityId, deletedAt: null },
        select: { content: true, dueDate: true, sourceSignalId: true },
      });

      expect(
        na,
        "§6 T-6 đòi Việc tiếp theo TỰ ĐỔI sau khi đổi sang bản chụp *sau*. Không "
          + "hàng `next_action` nào được tạo.\n"
          + "  NGUYÊN NHÂN ĐÃ TRA: `src/scan/loop.ts` không gọi `setNextAction` lẫn "
          + "`fillNextActionIfUnchanged` ở bất kỳ đâu — vòng quét chỉ gọi `createSignal` "
          + "và `appendTimelineEntry`. Tức §4/nhóm 4 (*Tự đặt Việc tiếp theo*) CHƯA "
          + "được nối vào vòng quét.\n"
          + "  Đây KHÔNG phải capability thiếu: `fillNextActionIfUnchanged` tồn tại và "
          + "chạy đúng — `T-7` chứng minh điều đó bằng cách gọi nó trực tiếp. Thiếu "
          + "đúng một chỗ: bên gọi trong vòng quét.",
      ).not.toBeNull();
      expect(na?.content).toBeTruthy();
      expect(na?.dueDate).not.toBeNull();

      // `AD-3` — chạm ghi của máy ĐÒI `signalId` nguồn. Không tuỳ chọn: một Việc
      // tiếp theo do máy đặt mà không truy được về Phát hiện nào là chỗ `T-3`
      // và `T-7` cùng mất điểm tựa.
      expect(na?.sourceSignalId).not.toBeNull();
    });

    test("② có THÔNG BÁO", async () => {
      const n = await rawDb.notification.count({ where: { accountId, opportunityId } });
      expect(
        n,
        "§6 T-6 đòi *có thông báo*. Không hàng `notification` nào cho cơ hội này.",
      ).toBeGreaterThanOrEqual(1);
    });

    test("③ ô mang dấu hiệu DO HỆ THỐNG ĐẶT, và có cửa sổ hoàn tác 7 ngày", async () => {
      const na = await rawDb.nextAction.findFirstOrThrow({
        where: { opportunityId, deletedAt: null },
        select: { setBy: true, undoDeadlineAt: true },
      });

      expect(na.setBy).toBe("he_thong");

      // `D14` · bảng 0.2.2 — cửa sổ hoàn tác 7 ngày. Đây là điều kiện `T-7` dựa
      // vào; thiếu nó thì *"bấm Hoàn tác ở T-6"* không có gì để bấm.
      expect(na.undoDeadlineAt).not.toBeNull();
      const days = (na.undoDeadlineAt!.getTime() - Date.now()) / 86_400_000;
      expect(days).toBeGreaterThan(6);
      expect(days).toBeLessThanOrEqual(7);
    });

    test("giao diện: Sales thấy Việc tiếp theo và dấu hiệu do hệ thống đặt", async ({ page }) => {
      await page.context().addCookies([
        { name: "why_now_user", value: salesUserId, domain: "127.0.0.1", path: "/" },
      ]);
      await page.goto(`/accounts/${accountId}`);

      // §4/nhóm 4 đòi ô Việc tiếp theo hiện rõ dấu hiệu do hệ thống đặt.
      // `src/app` chưa có khối nào hiện Việc tiếp theo — cờ `BR-B1`
      // *Chưa có Việc tiếp theo* hiện được, nhưng không có ô nào để đọc nó.
      await expect(
        page.getByText("Việc tiếp theo", { exact: false }).first(),
        "§6 T-6 đòi *ô mang dấu hiệu do hệ thống đặt* — tức Sales phải NHÌN THẤY. "
          + "`src/app` chưa có bề mặt nào hiện Việc tiếp theo (§4/nhóm 4).",
      ).toBeVisible();
    });
  },
);
