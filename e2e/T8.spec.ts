// T-8 — Vòng quét chạy mà không ai bấm gì
//
// Đề bài §6, NGUYÊN VĂN: *"Bật Đang theo dõi cho ba công ty, đổi nguồn của hai
// công ty. Trong vòng hai chu kỳ, hai mục mới xuất hiện trên dòng thời gian mà
// không ai bấm gì; Nhật ký vòng quét có dòng tổng kết cho từng vòng"*.
//
// ⚠ CON SỐ **BA** VÀ **HAI** LÀ PHÉP ĐO, KHÔNG PHẢI TRANG TRÍ. Ba công ty theo
// dõi nhưng chỉ HAI đổi nguồn, nên đúng HAI mục mới. Công ty thứ ba là ĐỐI
// CHỨNG: nó chứng minh vòng quét không rải mục lên mọi thứ nó chạm tới. Bỏ nó đi
// thì *"hai mục"* và *"mọi công ty đều có mục"* không phân biệt được.
//
// ⚠ **"KHÔNG AI BẤM GÌ"** là vế phải dựng cho đúng: sau khi bật Đang theo dõi và
// đổi nguồn, tệp này không gọi thêm lời nào ngoài `runCycles`. Mọi mục xuất hiện
// đều do vòng quét tự sinh.
//
// ⚠ **"ĐÚNG HAI MỤC"** đo bằng DELTA, không bằng tổng tuyệt đối. CSDL demo có
// thể có tiến trình quét thật đang chạy song song; một phép đếm tuyệt đối sẽ
// đếm cả mục của họ và đỏ vì lý do không liên quan.
//
// ⚠ **"BẬT ĐANG THEO DÕI"** chưa bấm được: `/accounts` hiện nhãn *Đang theo dõi*
// và lọc theo nó, nhưng không có nút bật/tắt, và sổ đăng ký không có capability
// ghi nào cho cờ đó. Phép kiểm giao diện dưới cùng khẳng định đúng khoảng trống ấy.
//
// Mã thượng nguồn: `T-8` · `FR-38`…`FR-41` · `NFR-19` (máy không sửa mục người
// ghi) · `AD-11` (điều kiện dừng) · `D17` · `D36`.

import "./_env";

import { test, expect } from "@playwright/test";
import { createCompany } from "@/core/company";
import {
  cleanupE2eData,
  createE2eUser,
  e2eName,
  mutedCtx,
  rawDb,
  seeder,
} from "./_fixtures";
import { runCycles, signalDraft, stubExtract } from "./_scan";

const TRUOC = "Công ty vận tải nội địa, thành lập năm 2008, trụ sở tại Tokyo.";
const SAU =
  "Công ty vận tải nội địa, thành lập năm 2008, trụ sở tại Tokyo. "
  + "Tháng 8/2026 công bố gọi vốn vòng B trị giá 20 triệu đô la.";

/// Ba công ty: hai cái ĐỔI NGUỒN, một cái KHÔNG — đối chứng.
const ids: { doiNguon: string[]; doiChung: string } = { doiNguon: [], doiChung: "" };
let salesUserId = "";
let mucTruoc = 0;
let journal: string[] = [];

test.describe.configure({ mode: "serial" });

/// ⚠ `tuoiPhut` KHÔNG phải trang trí — xem chú thích cùng tên ở `T9.spec.ts`.
/// `readArticle scope: "latest"` xếp theo thời điểm đọc, nên `truoc` và `sau`
/// dựng trong cùng một mili-giây cho thứ tự không xác định, và nửa số lượt chạy
/// sẽ rút Phát hiện trên bản chụp CŨ.
async function themBanChup(
  accountId: string,
  version: string,
  text: string,
  tuoiPhut = 0,
): Promise<void> {
  const luc = new Date(Date.now() - tuoiPhut * 60_000);
  const snap = await rawDb.snapshot.create({
    data: { accountId, version, capturedAt: luc },
    select: { id: true },
  });
  await rawDb.article.create({
    data: {
      accountId,
      snapshotId: snap.id,
      rawText: text,
      normalizedText: text,
      readAt: luc,
      contentHash: `e2e-t8-${version}-${accountId}-${Date.now()}`,
    },
  });
}

test.beforeAll(async () => {
  const sales = await createE2eUser("T8");
  salesUserId = sales.id;

  for (let i = 0; i < 3; i += 1) {
    const acc = await createCompany(
      seeder,
      { name: e2eName(`T8-${i + 1}`), market: "JP" },
      mutedCtx,
    );
    // *"Bật Đang theo dõi cho ba công ty"* — cả ba.
    await rawDb.account.update({ where: { id: acc.id }, data: { watching: true } });
    await themBanChup(acc.id, "truoc", TRUOC, 60);

    if (i < 2) ids.doiNguon.push(acc.id);
    else ids.doiChung = acc.id;
  }
});

test.afterAll(async () => {
  await cleanupE2eData();
});

test.describe(
  "T-8 — Bật Đang theo dõi cho ba công ty, đổi nguồn của hai công ty. Trong vòng hai chu kỳ, hai mục mới xuất hiện trên dòng thời gian mà không ai bấm gì; Nhật ký vòng quét có dòng tổng kết cho từng vòng",
  () => {
    test("cảnh nền: ba công ty Đang theo dõi, chưa mục nào trên dòng thời gian", async () => {
      const n = await rawDb.account.count({
        where: { id: { in: [...ids.doiNguon, ids.doiChung] }, watching: true },
      });
      expect(n).toBe(3);

      mucTruoc = await rawDb.timelineEntry.count({
        where: { timeline: { accountId: { in: [...ids.doiNguon, ids.doiChung] } } },
      });
      expect(mucTruoc).toBe(0);
    });

    test("đổi nguồn của HAI công ty, rồi để yên hai chu kỳ — không ai bấm gì", async () => {
      for (const id of ids.doiNguon) {
        await themBanChup(id, "sau", SAU);
      }

      // Chỉ HAI công ty đổi nguồn có Phát hiện mới. Công ty đối chứng trả mảng
      // rỗng, đúng như một Bản lưu không đổi thì không có gì mới để rút.
      const drafts = new Map(
        ids.doiNguon.map((id) => [
          id,
          [
            signalDraft({
              claim: "Công ty vừa gọi vốn vòng B trị giá 20 triệu đô la",
              quote: "gọi vốn vòng B",
            }),
          ],
        ]),
      );

      const run = await runCycles(2, stubExtract(drafts));
      journal = run.journal;

      expect(run.outcomes).toHaveLength(2);
      const daChay = run.outcomes.filter((o) => o.ran).length;
      expect(
        daChay,
        "Hai chu kỳ phải chạy thật, nếu không *hai mục mới* không chứng minh gì. "
          + `Lý do bỏ vòng: ${run.outcomes.map((o) => (o.ran ? "ran" : o.reason)).join(", ")}`,
      ).toBe(2);
    });

    test("ĐÚNG HAI mục mới xuất hiện trên dòng thời gian", async () => {
      const mucSau = await rawDb.timelineEntry.count({
        where: { timeline: { accountId: { in: [...ids.doiNguon, ids.doiChung] } } },
      });
      expect(
        mucSau - mucTruoc,
        "§6 T-8 đòi ĐÚNG hai mục mới sau hai chu kỳ. Nhiều hơn hai nghĩa là vòng "
          + "quét sinh trùng giữa hai vòng (`D18` cửa sổ chống trùng 30 ngày); ít hơn "
          + "hai nghĩa là vòng quét không rút được Phát hiện nào.\n"
          // Nhật ký đi kèm thông điệp lỗi, không để riêng: khi phép kiểm này đỏ,
          // nguyên nhân LUÔN nằm trong nhật ký, và bắt người đọc đi tìm nó ở
          // chỗ khác là bắt họ chạy lại một lượt chỉ để biết vì sao.
          + `Nhật ký vòng quét:\n${journal.join("\n")}`,
      ).toBe(2);
    });

    test("hai mục thuộc ĐÚNG hai công ty đổi nguồn; công ty đối chứng không có mục nào", async () => {
      const doiChung = await rawDb.timelineEntry.count({
        where: { timeline: { accountId: ids.doiChung } },
      });
      expect(
        doiChung,
        "Công ty KHÔNG đổi nguồn không được có mục nào. Có mục nghĩa là vòng quét "
          + "rải mục lên mọi công ty nó chạm tới, và con số *hai* chỉ là trùng hợp.",
      ).toBe(0);

      for (const id of ids.doiNguon) {
        const n = await rawDb.timelineEntry.count({ where: { timeline: { accountId: id } } });
        expect(n).toBe(1);
      }
    });

    test("mục do HỆ THỐNG thêm, không phải do người ghi", async () => {
      const entries = await rawDb.timelineEntry.findMany({
        where: { timeline: { accountId: { in: ids.doiNguon } } },
        select: { addedBy: true, sourceSignalId: true },
      });
      expect(entries).toHaveLength(2);
      for (const e of entries) {
        expect(e.addedBy).toBe("he_thong");
        // Truy được về Phát hiện nguồn (`AD-22`).
        expect(e.sourceSignalId).not.toBeNull();
      }
    });

    test("Nhật ký vòng quét có dòng tổng kết cho TỪNG vòng", async () => {
      // Hai vòng chạy → hai dòng tổng kết. Một dòng cho cả hai vòng là hỏng:
      // §6 viết *"cho từng vòng"*.
      const tongKet = journal.filter((l) => l.includes("[vòng quét]"));
      expect(
        tongKet.length,
        `Nhật ký phải có dòng tổng kết cho TỪNG vòng. Đang có ${journal.length} dòng: `
          + journal.join(" | "),
      ).toBeGreaterThanOrEqual(2);
    });

    test("hai vòng để lại hai hàng ScanLog đã đóng", async () => {
      // Nhật ký là chữ in ra; `scan_log` là bằng chứng bền. Cần cả hai: một dòng
      // log đẹp trên một hàng `finished_at IS NULL` nghĩa là vòng chưa đóng, và
      // `D19` sẽ bỏ mọi vòng sau suốt 30 phút hạn thuê.
      const logs = await rawDb.scanLog.findMany({
        where: { entries: { some: { accountId: { in: [...ids.doiNguon, ids.doiChung] } } } },
        select: { finishedAt: true, stopReason: true },
      });
      expect(logs.length).toBeGreaterThanOrEqual(2);
      for (const l of logs) {
        expect(l.finishedAt, "Hàng `scan_log` chưa đóng — `D19` sẽ bỏ mọi vòng sau.").not.toBeNull();
        expect(l.stopReason).not.toBeNull();
      }
    });

    test("giao diện: bật Đang theo dõi bằng một cú bấm", async ({ page }) => {
      await page.context().addCookies([
        { name: "why_now_user", value: salesUserId, domain: "127.0.0.1", path: "/" },
      ]);
      await page.goto(`/accounts/${ids.doiChung}`);

      await expect(
        // ⚠ `i` — nút đổi nhãn theo trạng thái: *Theo dõi* khi đang tắt, *Bỏ theo
        // dõi* khi đang bật. Regex phân biệt hoa thường chỉ khớp một trong hai,
        // và Công ty của phép kiểm này ĐANG bật — nên bản trước đỏ trên một nút
        // hiện hữu. Không nới nghĩa: vẫn là *"có nút bật/tắt theo dõi"*.
        page.getByRole("button", { name: /theo dõi/i }),
        "§6 T-8 mở đầu bằng *bật Đang theo dõi cho ba công ty*, nên hồ sơ Công ty "
          + "phải có nút bật/tắt bấm được — không chỉ một nhãn đọc được.",
      ).toBeVisible();
    });
  },
);
