// T-9 — Bấm nút tắt toàn bộ phần AI trong lúc vòng quét đang chạy
//
// Đề bài §6, NGUYÊN VĂN: *"Bấm nút tắt toàn bộ phần AI trong lúc vòng quét đang
// chạy. Hai chu kỳ kế tiếp không thêm mục nào vào dòng thời gian, không sinh gợi
// ý, không tự đặt Việc tiếp theo; dữ liệu đã sinh còn nguyên; Sales thấy dòng
// thông báo đang tắt. Bật lại thì vòng quét chạy tiếp, cả hai lần bấm đều có ghi
// vết"*.
//
// Bảy vế, và tệp này khẳng định từng vế riêng vì chúng hỏng độc lập nhau:
//   ① bấm nút tắt                          — GIAO DIỆN
//   ② hai chu kỳ không thêm mục dòng thời gian
//   ③ không sinh gợi ý
//   ④ không tự đặt Việc tiếp theo
//   ⑤ dữ liệu ĐÃ SINH còn nguyên
//   ⑥ Sales thấy dòng thông báo đang tắt   — GIAO DIỆN
//   ⑦ bật lại thì chạy tiếp, cả hai lần bấm đều có ghi vết
//
// ⚠⚠ VẾ ① VÀ VẾ ⑦ ĐỎ, VÀ ĐÂY LÀ PHÁT HIỆN LỚN NHẤT CỦA CẢ BỘ E2E.
// **Không có nút tắt AI, và không có capability nào ghi được `ai_enabled`.**
// `/admin` hôm nay chỉ đọc bốn số đo — không một `<Button>`, không một `actions.ts`.
// Ở tầng ④, `src/capability/caps/scan.ts` ghi thẳng *"KHÔNG khai `disableAi`…"*;
// chỉ có `readAiEnabled` để ĐỌC. Nên:
//   · *"bấm nút tắt"* không thực hiện được;
//   · *"cả hai lần bấm đều có ghi vết"* không thể có, vì không lời gọi nào để ghi.
// Tệp này vẫn dựng được trạng thái tắt bằng cách ghi thẳng bảng `settings`, nên
// năm vế còn lại vẫn đo được thật. Nhưng hai vế kia phải ĐỎ, không được lặng lẽ
// bỏ qua: một bộ nghiệm thu xanh trên một công tắc không tồn tại là đúng thứ
// vòng 2 sẽ hỏi tới.
//
// Mã thượng nguồn: `T-9` · `FR-43`…`FR-46` · `NFR-17` · `AD-11` (phanh đọc ở
// ranh giới Công ty) · `D38` (đọc mỗi lần dùng, không nhớ đệm) · `D36`.

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

let accountId = "";
let salesUserId = "";
let previousAiEnabled: string | null = null;

/// Ảnh chụp *"dữ liệu đã sinh"* ngay trước khi tắt — vế ⑤ so với chính nó.
const daSinh = { timeline: 0, suggestion: 0, signal: 0, nextAction: 0 };

test.describe.configure({ mode: "serial" });

/// ⚠ `tuoiPhut` KHÔNG phải trang trí. Vòng quét đọc Bản lưu bằng
/// `readArticle scope: "latest"`, và *"latest"* xếp theo thời điểm đọc. Dựng
/// `truoc` và `sau` trong cùng một mili-giây thì thứ tự KHÔNG xác định: nửa số
/// lượt chạy sẽ lấy `truoc` — vốn không chứa câu trích — và `createSignal` bác
/// bằng `BR-D2`, cho ra 0 Phát hiện. Đây là nguyên nhân thật của một lượt đỏ
/// chập chờn đã quan sát được, không phải phòng xa.
async function themBanChup(version: string, text: string, tuoiPhut = 0): Promise<void> {
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
      contentHash: `e2e-t9-${version}-${Date.now()}`,
    },
  });
}

const drafts = () =>
  new Map([
    [
      accountId,
      [
        signalDraft({
          claim: "Công ty vừa gọi vốn vòng B trị giá 20 triệu đô la",
          quote: "gọi vốn vòng B",
        }),
      ],
    ],
  ]);

async function datAi(value: "true" | "false"): Promise<void> {
  await rawDb.setting.upsert({
    where: { key: "ai_enabled" },
    create: { key: "ai_enabled", value },
    update: { value, deletedAt: null },
  });
}

/// Đọc trạng thái phanh THẲNG TỪ CSDL. Khẳng định trên màn hình chứng minh
/// băng thông báo đúng; khẳng định ở đây chứng minh cú bấm thật sự GHI. Hai
/// chuyện khác nhau — băng có thể đọc một bộ nhớ đệm cũ.
async function docAi(): Promise<string | null> {
  const row = await rawDb.setting.findUnique({ where: { key: "ai_enabled" } });
  return row?.value ?? null;
}

test.beforeAll(async () => {
  const sales = await createE2eUser("T9");
  salesUserId = sales.id;

  const row = await rawDb.setting.findUnique({ where: { key: "ai_enabled" } });
  previousAiEnabled = row?.value ?? null;
  await datAi("true");

  const acc = await createCompany(seeder, { name: e2eName("T9"), market: "JP" }, mutedCtx);
  accountId = acc.id;
  await rawDb.account.update({ where: { id: accountId }, data: { watching: true } });
  await themBanChup("truoc", TRUOC, 60);
});

test.afterAll(async () => {
  if (previousAiEnabled === null) {
    await rawDb.setting.deleteMany({ where: { key: "ai_enabled" } });
  } else {
    await datAi(previousAiEnabled === "true" ? "true" : "false");
  }
  await cleanupE2eData();
});

test.describe(
  "T-9 — Bấm nút tắt toàn bộ phần AI trong lúc vòng quét đang chạy. Hai chu kỳ kế tiếp không thêm mục nào vào dòng thời gian, không sinh gợi ý, không tự đặt Việc tiếp theo; dữ liệu đã sinh còn nguyên; Sales thấy dòng thông báo đang tắt. Bật lại thì vòng quét chạy tiếp, cả hai lần bấm đều có ghi vết",
  () => {
    test("cảnh nền: vòng quét ĐANG CHẠY và đã sinh ra dữ liệu", async () => {
      await themBanChup("sau", SAU);
      const run = await runCycles(1, stubExtract(drafts()));
      expect(run.outcomes[0]?.ran, "Vòng quét phải chạy được trước khi nói tới chuyện tắt.").toBe(true);

      daSinh.timeline = await rawDb.timelineEntry.count({ where: { timeline: { accountId } } });
      daSinh.suggestion = await rawDb.suggestion.count({ where: { accountId } });
      daSinh.signal = await rawDb.signal.count({ where: { accountId } });
      daSinh.nextAction = await rawDb.nextAction.count({
        where: { opportunity: { accountId }, deletedAt: null },
      });

      // Phải có gì đó để mà *"còn nguyên"*. Không có thì vế ⑤ xanh vô nghĩa.
      expect(
        daSinh.signal,
        "Vòng quét chưa sinh Phát hiện nào, nên vế *dữ liệu đã sinh còn nguyên* "
          + "không có đối tượng để đo.",
      ).toBeGreaterThan(0);
    });

    test("②③④ hai chu kỳ kế tiếp: không thêm mục, không sinh gợi ý, không tự đặt Việc tiếp theo", async () => {
      // Tắt AI. Đường vòng qua bảng `settings` vì vế ① ở trên không có nút —
      // xem khối chú thích đầu tệp.
      await datAi("false");

      // Nguồn MỚI ở mỗi vòng: nếu không, *"không thêm mục"* có thể chỉ vì hết
      // tin để rút, chứ không vì phanh đã ăn.
      await themBanChup("sau-2", `${SAU} Công ty cũng mở văn phòng Osaka.`);

      const run = await runCycles(2, stubExtract(drafts()));

      // Phanh phải ăn ở CẢ HAI vòng, và ăn đúng lý do.
      for (const o of run.outcomes) {
        expect(o.ran, "Vòng quét vẫn chạy dù phanh đã bật.").toBe(false);
        if (!o.ran) expect(o.reason).toBe("phanh_ai_tat");
      }

      expect(await rawDb.timelineEntry.count({ where: { timeline: { accountId } } }))
        .toBe(daSinh.timeline);
      expect(await rawDb.suggestion.count({ where: { accountId } })).toBe(daSinh.suggestion);
      expect(
        await rawDb.nextAction.count({ where: { opportunity: { accountId }, deletedAt: null } }),
      ).toBe(daSinh.nextAction);
    });

    test("⑤ dữ liệu ĐÃ SINH còn nguyên — cắt sạch, không cuộn lại", async () => {
      // `AD-11` điều kiện dừng 2: *"cắt sạch, giữ nguyên dữ liệu đã sinh"*. Vế
      // này ngược với vế trên và cần cả hai: một bản cài xoá sạch khi tắt cũng
      // sẽ xanh ở phép kiểm *"không thêm mục"*.
      expect(await rawDb.signal.count({ where: { accountId } })).toBe(daSinh.signal);
      expect(await rawDb.timelineEntry.count({ where: { timeline: { accountId } } }))
        .toBe(daSinh.timeline);
    });

    test("⑥ Sales thấy dòng thông báo đang tắt", async ({ page }) => {
      await page.context().addCookies([
        { name: "why_now_user", value: salesUserId, domain: "127.0.0.1", path: "/" },
      ]);
      await page.goto("/accounts");

      // §4/nhóm 6: *"Không im lặng biến mất"*. Chữ hiển thị nguyên văn từ
      // `src/app/_ai-banner.tsx`.
      await expect(page.getByText("Phần gợi ý đang tắt.")).toBeVisible();
      await expect(
        page.getByText(
          "Việc đến hạn, hồ sơ và bảng giai đoạn vẫn chạy đủ; hệ thống chỉ ngừng sinh gợi ý mới.",
          { exact: false },
        ),
      ).toBeVisible();
    });

    test("⑦a bật lại thì vòng quét chạy tiếp", async () => {
      await datAi("true");
      const run = await runCycles(1, stubExtract(drafts()));
      expect(
        run.outcomes[0]?.ran,
        "Bật lại mà vòng quét không chạy tiếp — phanh kẹt ở trạng thái tắt.",
      ).toBe(true);
    });

    // ⚠ HAI PHÉP KIỂM CUỐI TỆP LÀ HAI VẾ ĐỎ, VÀ CHÚNG ĐỨNG CUỐI CÓ CHỦ ĐÍCH.
    // Tệp chạy ở `mode: "serial"`, nên một phép kiểm đỏ chặn mọi phép kiểm sau nó.
    // Đặt hai vế giao diện ở đầu tệp thì năm vế dữ liệu — vốn ĐO ĐƯỢC và ĐANG
    // XANH — không bao giờ chạy, và báo cáo mất đúng phần `T-9` chứng minh được.

    test("① bấm nút tắt rồi bấm bật lại, cả hai trên màn hình Quản trị", async ({ page }) => {
      const admin = await createE2eUser("T9-admin", "admin");
      await page.context().addCookies([
        { name: "why_now_user", value: admin.id, domain: "127.0.0.1", path: "/" },
      ]);
      await page.goto("/admin");
      await expect(page.getByRole("heading", { name: "Bảng quản trị" })).toBeVisible();

      // Nền đã biết: đặt AI về BẬT để nút *Tắt* chắc chắn là nút đang hiện.
      await datAi("true");
      await page.reload();

      await page.getByRole("button", { name: /Tắt toàn bộ phần AI/i }).click();
      await expect(
        page.getByText(/AI đang TẮT/i),
        "Bấm Tắt xong màn hình phải nói AI đang TẮT. Nút ăn mà trạng thái không "
          + "đổi nghĩa là băng thông báo đọc một nguồn khác với chỗ nút ghi.",
      ).toBeVisible();
      expect(await docAi(), "Bấm Tắt phải ghi `ai_enabled=false` xuống CSDL.").toBe("false");

      // ⑦ *"Bật lại thì vòng quét chạy tiếp"* — cú bấm thứ hai.
      await page.getByRole("button", { name: /Bật lại phần AI/i }).click();
      await expect(page.getByText(/AI đang BẬT/i)).toBeVisible();
      expect(await docAi()).toBe("true");
    });

    // ⚠ ⑦b PHẢI ĐỨNG SAU ①, và đây là thứ tự chứ không phải thẩm mỹ.
    //
    // Nó đếm dòng ghi vết do việc BẤM sinh ra, mà vế ① là chỗ duy nhất trong tệp
    // bấm thật — mọi vế khác đặt `ai_enabled` bằng `rawDb.setting.upsert`, tức đi
    // vòng qua Cổng nên không sinh ghi vết nào. Tệp chạy `mode: "serial"`, nên
    // đặt ⑦b trước ① là đếm ghi vết của những cú bấm chưa xảy ra, và nó đỏ với
    // thông điệp *"không capability nào ghi `ai_enabled`"* — một chẩn đoán sai
    // trỏ vào tầng ④ trong khi nguyên nhân nằm ở thứ tự của chính tệp này.
    test("⑦b cả hai lần bấm đều có ghi vết", async () => {
      const records = await rawDb.auditRecord.findMany({
        where: { capability: { in: ["disableAi", "enableAi"] } },
        select: { capability: true, createdAt: true },
      });

      expect(
        records.length,
        "§6 T-9 đòi *cả hai lần bấm đều có ghi vết*. Vế ① bấm đúng hai lần — một "
          + "tắt, một bật — nên phải có ít nhất hai dòng.",
      ).toBeGreaterThanOrEqual(2);
      expect(
        records.map((r) => r.capability).sort(),
        "Hai chiều phải là HAI capability khác nhau: máy tắt được, máy KHÔNG bật "
          + "lại được (`AD-11` điều kiện dừng 4).",
      ).toEqual(expect.arrayContaining(["disableAi", "enableAi"]));
    });
  },
);
