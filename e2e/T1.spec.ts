// T-1 — Tắt AI, trọn nhóm 1 vẫn chạy
//
// Đề bài §6, NGUYÊN VĂN: *"Tắt toàn bộ phần AI. Tạo được công ty, người liên hệ,
// cơ hội; kéo cơ hội qua ba giai đoạn, trong đó có Đủ điều kiện; bỏ qua hai ô
// dấu hiệu vẫn kéo được và cơ hội mang cờ cảnh báo; ghi hoạt động; tìm kiếm và
// lọc; mở màn hình tổng quan. Không chức năng nào của nhóm 1 hỏng"*.
//
// ĐÂY LÀ LUỒNG NGƯỜI DÙNG THẬT, và là luồng đầy đủ nhất trong mười: từ đăng
// nhập tới màn hình tổng quan, mọi bước qua trình duyệt.
//
// **"Tắt toàn bộ phần AI"** là tiền đề của CẢ TỆP, không phải một phép kiểm
// riêng: `beforeAll` đặt `settings.ai_enabled = 'false'`, `afterAll` trả lại giá
// trị cũ. Mọi khẳng định dưới đây chạy trong trạng thái đó.
//
// ⚠ GHI THẲNG BẢNG `settings` LÀ MỘT PHÁT HIỆN, KHÔNG PHẢI MỘT LỰA CHỌN.
// §4/nhóm 6 đòi một nút tắt trên màn hình Quản trị, nhưng `/admin` hôm nay
// không có nút nào và sổ đăng ký không có capability ghi nào cho `ai_enabled`
// (`src/capability/caps/scan.ts` ghi thẳng *"KHÔNG khai `disableAi`…"*). Nên
// tiền đề của `T-1` chỉ dựng được bằng đường vòng. `T-9` là chỗ khẳng định
// đúng khoảng trống đó và để nó ĐỎ.
//
// **KÉO-THẢ THẬT, bằng chuột.** §6 viết *"kéo cơ hội qua ba giai đoạn"*, và
// chính thao tác đó là thứ `tests/T1.test.ts` nói thẳng là nó KHÔNG chứng minh
// được (jsdom không có trình duyệt). Nếu bộ e2e cũng né sang
// `<select aria-label="Chuyển giai đoạn của …">` thì nó không thêm bằng chứng
// nào so với bộ Vitest, và cả hai bộ cùng để trống đúng chỗ đề bài chỉ tay vào.
// Nên ở đây là `dragTo` thật: `dragstart` → `dragover` → `drop`.
//
// Đích thả là ĐẦU CỘT, và nó được chọn bằng chữ hiển thị chứ không bằng class.
// Trình xử lý `onDragOver`/`onDrop` nằm trên `div` cột, nhưng sự kiện NỔI BỌT từ
// con lên, nên thả vào nhãn đầu cột là đúng cột đó.
//
// ⚠ CỘT KHÔNG CÓ VAI ARIA NÀO — không `role`, không `aria-label`. Đó là một
// phát hiện về khả năng tiếp cận, không phải một chi tiết kỹ thuật: một cái
// bảng bảy cột mà trình đọc màn hình không đọc được tên cột thì `S4` chưa đạt
// sàn tiếp cận. Ở đây phải lách bằng `getByText(...).and(locator("span"))` —
// vế `and` để loại các `<option>` mang y hệt chữ đó trong mỗi thẻ.
//
// Mã thượng nguồn: `T-1` · `FR-1`…`FR-9` · `BR-B2` (cờ Thiếu hai dấu hiệu) ·
// `C1-2` · `C1-3` · `C1-15` · `D36`.

import "./_env";

import { test, expect, type Page } from "@playwright/test";
import { rawDb, cleanupE2eData, createE2eUser, e2eName } from "./_fixtures";

const COMPANY = e2eName("T1");
const CONTACT = "Nguyễn Thị Lan";
const OPPORTUNITY = `${COMPANY} — gói triển khai`;

let salesUserId = "";
let previousAiEnabled: string | null = null;

test.describe.configure({ mode: "serial" });

test.beforeAll(async () => {
  const sales = await createE2eUser("T1", "sales");
  salesUserId = sales.id;

  // Nhớ giá trị CŨ để trả lại — CSDL demo là chỗ người khác đang dùng, và bỏ
  // lại `ai_enabled = false` là tắt phần gợi ý của cả buổi demo.
  const row = await rawDb.setting.findUnique({ where: { key: "ai_enabled" } });
  previousAiEnabled = row?.value ?? null;
  await rawDb.setting.upsert({
    where: { key: "ai_enabled" },
    create: { key: "ai_enabled", value: "false" },
    update: { value: "false", deletedAt: null },
  });
});

test.afterAll(async () => {
  if (previousAiEnabled === null) {
    await rawDb.setting.deleteMany({ where: { key: "ai_enabled" } });
  } else {
    await rawDb.setting.update({
      where: { key: "ai_enabled" },
      data: { value: previousAiEnabled },
    });
  }
  await cleanupE2eData();
});

/// Đăng nhập bằng cookie phiên. `src/app/_session.ts` giữ ĐÚNG `userId` trong
/// cookie `why_now_user`, và vai đọc sống từ CSDL mỗi lượt yêu cầu — nên đặt
/// cookie tương đương hoàn toàn với bấm qua `/login`.
///
/// Bấm qua `/login` VẪN được kiểm, ở phép kiểm đầu tiên. Từ phép kiểm thứ hai
/// trở đi dùng cookie: chín lần đăng nhập lại không chứng minh thêm gì, mà mỗi
/// lần lại là một chỗ hỏng chập chờn mới.
async function signIn(page: Page): Promise<void> {
  await page.context().addCookies([
    {
      name: "why_now_user",
      value: salesUserId,
      domain: "127.0.0.1",
      path: "/",
    },
  ]);
}

/// Thông báo KẾT QUẢ của một hành động (`ok-note` / `failed`).
///
/// ⚠ KHÔNG dùng `getByRole("status")` trần ở tệp này. Dải băng *Phần gợi ý đang
/// tắt* cũng mang `role="status"` (`src/app/_ai-banner.tsx`) và nó LUÔN hiện ở
/// đây, vì tiền đề của cả tệp là AI đã tắt — nên locator trần khớp hai phần tử
/// và Playwright ném `strict mode violation`.
///
/// Lọc XUÔI theo chữ mong đợi, không lọc ngược để loại dải băng. Hai lý do:
/// lọc xuôi không phụ thuộc vào việc dải băng đang hiện hay không, và nó khẳng
/// định mạnh hơn — thông báo vừa phải được CÔNG BỐ (`role="status"`) vừa phải
/// nói ĐÚNG câu, thay vì chỉ *"có một vùng status nào đó"*.
///
/// Khoản nợ tiếp cận đáng ghi: hai vùng này khác nhau về ý nghĩa — *trạng thái
/// hệ thống* so với *kết quả việc tôi vừa làm* — mà dùng chung một vai, nên
/// trình đọc màn hình đọc lại dải băng mỗi lần người dùng bấm Lưu.
function thongBao(page: Page, chu: string) {
  return page.getByRole("status").filter({ hasText: chu });
}

/// Đích thả của một cột trên bảng giai đoạn, chọn bằng CHỮ HIỂN THỊ.
///
/// `.and(page.locator("span"))` không phải trang trí: mỗi thẻ mang một `<select>`
/// có đủ bảy `<option>` cùng chữ, nên `getByText("Đủ điều kiện")` trần sẽ khớp
/// tám phần tử và Playwright ném `strict mode violation`. Vế `and` giữ lại đúng
/// cái `<span>` ở đầu cột.
function stageColumn(page: Page, label: string) {
  return page.getByText(label, { exact: true }).and(page.locator("span"));
}

test.describe(
  "T-1 — Tắt toàn bộ phần AI. Tạo được công ty, người liên hệ, cơ hội; kéo cơ hội qua ba giai đoạn, trong đó có Đủ điều kiện; bỏ qua hai ô dấu hiệu vẫn kéo được và cơ hội mang cờ cảnh báo; ghi hoạt động; tìm kiếm và lọc; mở màn hình tổng quan. Không chức năng nào của nhóm 1 hỏng",
  () => {
    test("đăng nhập được qua màn hình chọn tài khoản", async ({ page }) => {
      await page.goto("/login");
      await expect(page.getByRole("heading", { name: "Chọn tài khoản" })).toBeVisible();

      // Nhãn radio dựng theo `${displayName} · ${vai} · ${email}` — chọn theo
      // chữ hiển thị, không theo chỉ số, để thứ tự danh sách đổi thì vẫn đúng người.
      await page.getByRole("radio", { name: new RegExp(`\\[E2E\\] T1 · Sales`) }).check();
      await page.getByRole("button", { name: "Dùng tài khoản này" }).click();

      await expect(thongBao(page, "Đang dùng tài khoản")).toBeVisible();
    });

    test("Sales nhìn thấy phần gợi ý đang tắt — không im lặng biến mất", async ({ page }) => {
      await signIn(page);
      await page.goto("/accounts");

      // §4/nhóm 6: *"Sales nhìn thấy trạng thái đó — một dòng thông báo nói rõ
      // tính năng gợi ý đang tắt"*. Khẳng định trên CHỮ HIỂN THỊ, không trên class.
      await expect(page.getByText("Phần gợi ý đang tắt.")).toBeVisible();
    });

    test("tạo được công ty", async ({ page }) => {
      await signIn(page);
      await page.goto("/accounts");

      // ⚠ SCOPE THEO BIỂU MẪU TẠO. Nhãn `Ngành`, `Thị trường`, `Loại tài khoản`
      // xuất hiện HAI LẦN trên trang này — một lần ở biểu mẫu tạo, một lần ở bộ
      // lọc. Không scope thì `getByLabel` ném `strict mode violation`.
      const form = page.locator("form").filter({ has: page.getByRole("button", { name: "Tạo công ty" }) });

      await form.getByLabel("Tên công ty").fill(COMPANY);
      await form.getByLabel("Ngành", { exact: true }).fill("Logistics");
      await form.getByLabel("Quốc gia").fill("Nhật Bản");
      await form.getByRole("button", { name: "Tạo công ty" }).click();

      await expect(thongBao(page, `Đã tạo Công ty ${COMPANY}.`)).toBeVisible();
      await expect(page.getByRole("cell", { name: COMPANY })).toBeVisible();
    });

    test("tạo được người liên hệ và cơ hội", async ({ page }) => {
      await signIn(page);
      await page.goto("/accounts");
      await page.getByRole("link", { name: COMPANY }).click();
      await expect(page.getByRole("heading", { name: COMPANY })).toBeVisible();

      const contactForm = page
        .locator("form")
        .filter({ has: page.getByRole("button", { name: "Thêm người liên hệ" }) });
      await contactForm.getByLabel("Họ tên").fill(CONTACT);
      await contactForm.getByLabel("Chức danh").fill("Trưởng phòng CNTT");
      await contactForm.getByRole("button", { name: "Thêm người liên hệ" }).click();
      // ⚠ SCOPE THEO ĐÚNG BIỂU MẪU. Màn hình hồ sơ có BA biểu mẫu, mỗi cái tự
      // render một `ActionMessage` mang `role="status"`. Sau cú gửi thứ hai đã
      // có hai vùng status cùng sống, và một locator ở mức trang khớp cả hai.
      // Scope theo biểu mẫu cũng khẳng định mạnh hơn: thông báo phải hiện ở
      // ĐÚNG chỗ người vừa thao tác, không phải ở đâu đó trên trang.
      await expect(contactForm.getByRole("status"))
        .toContainText(`Đã thêm người liên hệ ${CONTACT}.`);

      const oppForm = page
        .locator("form")
        .filter({ has: page.getByRole("button", { name: "Tạo cơ hội" }) });
      await oppForm.getByLabel("Tên cơ hội").fill(OPPORTUNITY);
      await oppForm.getByLabel("Giá trị").fill("5000000");
      await oppForm.getByRole("button", { name: "Tạo cơ hội" }).click();

      // §4/nhóm 1: cơ hội mới LUÔN bắt đầu ở Tiếp cận — đó là vế phải khẳng định,
      // không chỉ *"đã tạo"*.
      await expect(oppForm.getByRole("status")).toContainText(
        `Đã tạo cơ hội ${OPPORTUNITY} ở giai đoạn Tiếp cận.`,
      );
    });

    test("kéo cơ hội qua ba giai đoạn, trong đó có Đủ điều kiện; bỏ qua hai ô dấu hiệu vẫn kéo được", async ({
      page,
    }) => {
      await signIn(page);
      await page.goto("/board");
      await expect(page.getByRole("heading", { name: "Bảng giai đoạn" })).toBeVisible();

      const card = page.getByText(OPPORTUNITY, { exact: true }).and(page.locator("span"));

      // Kéo ①→② — Đủ điều kiện. Hộp hỏi hai dấu hiệu phải bật, và
      // *"Bỏ qua và chuyển"* phải VẪN chuyển được (`BR-B2` là luật hành vi:
      // vi phạm được, có đường xử lý — không phải luật chặn).
      await card.dragTo(stageColumn(page, "Đủ điều kiện"));
      await expect(
        page.getByRole("heading", { name: "Sang Đủ điều kiện: hai dấu hiệu" }),
      ).toBeVisible();
      await page.getByRole("button", { name: "Bỏ qua và chuyển" }).click();

      // ⚠ TỪ ĐÂY DÙNG `getByText`, KHÔNG `getByRole("status")` — và đây là hệ quả
      // của MỘT LỖI SẢN PHẨM, không phải một sở thích về locator.
      // Sau khi hộp thoại đóng, hai phần tử vẫn còn `aria-hidden="true"` (đã đo:
      // `role=dialog` biến mất nhưng `[aria-hidden=true]` còn 2), nên TOÀN BỘ nội
      // dung trang rơi khỏi cây tiếp cận: `getByRole("status")` trả về 0 trong khi
      // `getByText` trả về 1. Phép kiểm riêng ở dưới giữ lỗi này ĐỎ.
      // Ở đây `T-1` hỏi *"bỏ qua hai ô dấu hiệu vẫn kéo được"*, tức chuyển được —
      // nên nó khẳng định trên thứ người dùng nhìn thấy, và để vế công bố cho
      // trình đọc màn hình đứng riêng làm một phát hiện riêng.
      await expect(page.getByText("Đã chuyển sang Đủ điều kiện.")).toBeVisible();

      // Kéo ②→③ và ③→④ — không hộp hỏi nào.
      await card.dragTo(stageColumn(page, "Soạn đề xuất"));
      await expect(page.getByText("Đã chuyển sang Soạn đề xuất.")).toBeVisible();

      await card.dragTo(stageColumn(page, "Thương lượng"));
      await expect(page.getByText("Đã chuyển sang Thương lượng.")).toBeVisible();

      // Vế dữ liệu: ba lần kéo phải thật sự đổi giai đoạn, không chỉ đổi trên màn
      // hình. `useOptimistic` cho thẻ nhảy cột NGAY rồi mới đợi máy chủ, nên một
      // khẳng định thuần giao diện sẽ xanh cả khi lượt ghi bị bác.
      const opp = await rawDb.opportunity.findFirstOrThrow({
        where: { name: OPPORTUNITY },
        select: { stage: true },
      });
      expect(opp.stage).toBe("thuong_luong");
    });

    test("cơ hội mang cờ cảnh báo Thiếu hai dấu hiệu Đủ điều kiện", async ({ page }) => {
      await signIn(page);
      await page.goto("/board");

      // Chữ hiển thị của cờ lấy từ `FLAG_LABEL['BR-B2']` (`src/app/_vocab.ts`).
      await expect(
        page.getByText("Thiếu hai dấu hiệu Đủ điều kiện").first(),
      ).toBeVisible();
    });

    test("ghi được hoạt động", async ({ page }) => {
      await signIn(page);
      await page.goto("/accounts");
      await page.getByRole("link", { name: COMPANY }).click();

      const actForm = page
        .locator("form")
        .filter({ has: page.getByRole("button", { name: "Ghi hoạt động" }) });
      await actForm.getByLabel("Nội dung").fill("Gọi cho chị Lan, chốt lịch demo");
      await actForm.getByRole("button", { name: "Ghi hoạt động" }).click();

      await expect(actForm.getByRole("status")).toContainText("Đã ghi hoạt động");

      // Hoạt động phải hiện trên Dòng thời gian, không chỉ báo thành công rồi thôi.
      await expect(page.getByText("Gọi cho chị Lan, chốt lịch demo")).toBeVisible();
    });

    test("tìm kiếm và lọc chạy", async ({ page }) => {
      await signIn(page);
      await page.goto("/accounts");

      const filterForm = page
        .locator("form")
        .filter({ has: page.getByRole("button", { name: "Lọc" }) });

      // Tìm theo tên — công ty của phép kiểm này phải còn, mọi công ty khác biến mất.
      await filterForm.getByLabel("Tìm theo tên, ngành, quốc gia").fill(COMPANY);
      await filterForm.getByRole("button", { name: "Lọc" }).click();

      await expect(page.getByRole("cell", { name: COMPANY })).toBeVisible();
      await expect(page.getByRole("heading", { name: /Danh sách · 1 công ty khớp bộ lọc/ }))
        .toBeVisible();

      // Vế NGƯỢC LẠI của bộ lọc, và nó mới là vế chứng minh bộ lọc thật sự lọc:
      // một từ khoá không khớp gì phải cho danh sách rỗng, không phải cho cả bảng.
      await filterForm
        .getByLabel("Tìm theo tên, ngành, quốc gia")
        .fill("khong-cong-ty-nao-ten-the-nay-2026");
      await filterForm.getByRole("button", { name: "Lọc" }).click();
      await expect(page.getByText(/Không có công ty nào khớp bộ lọc đang bật/)).toBeVisible();
    });

    test("mở được màn hình tổng quan", async ({ page }) => {
      await signIn(page);
      await page.goto("/");

      await expect(page.getByRole("heading", { name: "Tổng quan" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Cơ hội theo giai đoạn" })).toBeVisible();

      // Cơ hội của phép kiểm này đang ở Thương lượng và mang cờ — nó phải xuất
      // hiện ở khối *"Cơ hội cần rà lại"*. Khẳng định này nối `T-1` với chính
      // trạng thái mà bốn phép kiểm trên vừa dựng, thay vì chỉ xem trang có mở.
      await expect(page.getByRole("heading", { name: /Cơ hội cần rà lại · [1-9]/ })).toBeVisible();
    });

    test("không chức năng nào của nhóm 1 hỏng — dữ liệu trên CSDL khớp thao tác", async () => {
      // Khẳng định cuối vào THẲNG dữ liệu: màn hình có thể đúng trong khi dữ
      // liệu sai, và ngược lại. Đây là vế kiểm chéo cho tám phép kiểm giao diện trên.
      const acc = await rawDb.account.findFirstOrThrow({
        where: { name: COMPANY },
        select: {
          id: true,
          industry: true,
          country: true,
          contacts: { select: { name: true } },
          opportunities: { select: { name: true, stage: true } },
          activities: { select: { description: true } },
        },
      });

      expect(acc.industry).toBe("Logistics");
      expect(acc.country).toBe("Nhật Bản");
      expect(acc.contacts.map((c) => c.name)).toContain(CONTACT);
      expect(acc.opportunities).toHaveLength(1);
      expect(acc.opportunities[0]?.stage).toBe("thuong_luong");
      expect(acc.activities).toHaveLength(1);

      // Phần AI tắt suốt lượt chạy, nên KHÔNG được có Phát hiện hay Gợi ý nào
      // sinh ra cho công ty này — vế *"tắt toàn bộ"* của tiền đề.
      expect(await rawDb.signal.count({ where: { accountId: acc.id } })).toBe(0);
      expect(await rawDb.suggestion.count({ where: { accountId: acc.id } })).toBe(0);
    });
    test("LỖI TIẾP CẬN: sau hộp thoại Đủ điều kiện, thông báo rơi khỏi cây tiếp cận", async ({
      page,
    }) => {
      // ⚠ PHÉP KIỂM NÀY ĐỎ, VÀ NÓ ĐỎ VÌ SẢN PHẨM SAI.
      //
      // Đo được, tái hiện được: kéo một thẻ sang *Đủ điều kiện*, bấm *Bỏ qua và
      // chuyển*, rồi đếm ngay sau đó —
      //     [role=dialog]        → 0   (hộp thoại đã gỡ)
      //     [aria-hidden=true]   → 2   (nhưng cờ ẩn thì CÒN)
      //     getByText(thông báo) → 1   (chữ có trên màn hình)
      //     getByRole("status")  → 0   (không có gì trong cây tiếp cận)
      //
      // Nghĩa vận hành: một người dùng trình đọc màn hình kéo cơ hội sang Đủ điều
      // kiện rồi bỏ qua hai ô dấu hiệu sẽ KHÔNG được báo là giai đoạn đã đổi — và
      // cả trang câm với trợ năng cho tới lần render kế tiếp. Dải băng
      // *Phần gợi ý đang tắt* cũng biến mất khỏi cây tiếp cận cùng lúc, nên vế
      // §4/nhóm 6 *"Sales nhìn thấy trạng thái đó"* cũng hỏng theo với đúng nhóm
      // người dùng cần nó nhất.
      //
      // Nguyên nhân nhiều khả năng: hộp thoại Fluent UI đặt `aria-hidden` lên nền
      // và không dọn khi gỡ. Sửa ở `src/app/board/_board.tsx` — KHÔNG sửa ở đây.
      // ⚠ ĐẶT GIAI ĐOẠN VỀ MỘT MỐC BIẾT TRƯỚC, và đây là chỗ phép kiểm này từng
      // CHẬP CHỜN — xanh một lượt, đỏ lượt sau, cùng một mã.
      //
      // Nó kéo thẻ sang *Tiếp cận* rồi chờ thông báo. Nhưng `canTransition` trả
      // `false` khi `from === to`, nên nếu thẻ ĐANG ở Tiếp cận thì không có
      // chuyển nào, không có thông báo, và phép kiểm đỏ với thông điệp
      // *"không tìm thấy Đã chuyển sang Tiếp cận."* — đọc như giao diện hỏng.
      //
      // Giai đoạn đầu vào đến từ những phép kiểm trước trong tệp `serial` này,
      // và từ dữ liệu sót lại khi một lượt chạy bị cắt ngang (bộ e2e dùng CSDL
      // demo, `afterAll` không chạy nếu tiến trình bị giết). Ghim nó ở đây thì
      // phép kiểm không còn phụ thuộc thứ nó không kiểm.
      const oppTruoc = await rawDb.opportunity.findFirstOrThrow({
        where: { name: OPPORTUNITY, deletedAt: null },
        select: { id: true },
      });
      // ⚠ GHIM VỀ `tiep_can`, RỒI KÉO THẲNG sang `Đủ điều kiện` — MỘT lượt kéo,
      // không phải hai.
      //
      // Bản trước ghim `soan_de_xuat` rồi kéo qua `Tiếp cận` trước. Lượt kéo ấy
      // KHÔNG kiểm gì cả: phép kiểm này đo cờ `aria-hidden` sau hộp thoại Đủ
      // điều kiện, và mọi thứ trước đó chỉ là dàn cảnh. Nhưng nó vẫn hỏng được
      // — và đã hỏng hai lần: sau khi nạp bộ dữ liệu BTC, bàn có 25 Công ty nên
      // cột dài ra và lượt kéo đầu tiên trượt đích. Một bước dàn cảnh làm đỏ một
      // điểm nghiệm thu là bước phải bỏ, không phải bước phải vá.
      await rawDb.opportunity.update({
        where: { id: oppTruoc.id },
        data: { stage: "tiep_can" },
      });

      await signIn(page);
      await page.goto("/board");

      const card = page.getByText(OPPORTUNITY, { exact: true }).and(page.locator("span"));
      await card.scrollIntoViewIfNeeded();
      await card.dragTo(stageColumn(page, "Đủ điều kiện"));
      await page.getByRole("button", { name: "Bỏ qua và chuyển" }).click();
      await expect(page.getByText("Đã chuyển sang Đủ điều kiện.")).toBeVisible();

      await expect(
        page.locator("[aria-hidden='true']"),
        "Hộp thoại đã gỡ mà cờ `aria-hidden` còn lại trên nền — toàn bộ trang rơi "
          + "khỏi cây tiếp cận.",
      ).toHaveCount(0);
      await expect(
        page.getByRole("status").filter({ hasText: "Đã chuyển sang Đủ điều kiện." }),
        "Thông báo có trên màn hình nhưng không có trong cây tiếp cận, nên trình đọc "
          + "màn hình không công bố nó.",
      ).toBeVisible();
    });

  },
);
