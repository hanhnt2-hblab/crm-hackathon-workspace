// T-7 — Bấm Hoàn tác ở T-6, một cú bấm, giá trị cũ trở lại đúng nguyên trạng
//
// Đề bài §6, NGUYÊN VĂN: *"Bấm Hoàn tác ở T-6, một cú bấm, giá trị cũ trở lại
// đúng nguyên trạng. Có bản ghi cho cả lần tự đặt lẫn lần hoàn tác"*.
//
// **"Ở T-6"** nghĩa là cảnh nền phải là một Việc tiếp theo do MÁY tự đặt. Tệp
// này TỰ DỰNG LẠI cảnh đó, không chờ `T-6` chạy trước: hai tệp độc lập nhau, và
// một bộ nghiệm thu mà thứ tự chạy quyết định kết quả thì không chạy lại được.
//
// ⚠ **"ĐÚNG NGUYÊN TRẠNG"** LÀ CHỖ DỄ ĐỌC NHẦM NHẤT. Đường phổ biến nhất là ô
// VỐN TRỐNG — mức tự do chỉ cho máy điền ô trống (`AD-3` nhánh ⓐ, `D16`) — nên
// *nguyên trạng* ở đó nghĩa là KHÔNG CÒN Việc tiếp theo nào, chứ không phải một
// hàng còn đó với nội dung rỗng. Khẳng định *"nội dung bằng chuỗi rỗng"* sẽ xanh
// trên đúng cái lỗi mà `T-7` sinh ra để bắt.
//
// ⚠ **"MỘT CÚ BẤM"** là một phát biểu về GIAO DIỆN, và nó ĐỎ. §4/nhóm 4 đòi một
// nút Hoàn tác; `undoSystemNextAction` có ở tầng ④ nhưng không màn hình nào gọi,
// và cũng không có khối nào hiện Việc tiếp theo để đặt nút cạnh. Vế tầng dưới
// vẫn khẳng định được: một LỜI GỌI, không phải một chuỗi thao tác.
//
// Mã thượng nguồn: `T-7` · `FR-35`…`FR-37` · `D14` (cửa sổ 7 ngày) · `D17` ·
// `AD-4` · `AD-14` (xoá MỀM, lõi không phát sinh DELETE) · `D36`.

import "./_env";

import { test, expect } from "@playwright/test";
import { createCompany } from "@/core/company";
import { createOpportunity } from "@/core/opportunity";
import { createSignal } from "@/core/signal";
import { createRegistry, type Registry } from "@/capability/registry";
import { createAuditSink } from "@/core/audit";
import type { Actor } from "@/core/actor";
import {
  cleanupE2eData,
  createE2eUser,
  e2eName,
  machine,
  mutedCtx,
  rawDb,
  seeder,
} from "./_fixtures";

const BAI_VIET = "Sakura Logistics vừa gọi vốn vòng B trị giá 20 triệu đô la.";

let accountId = "";
let opportunityId = "";
let signalId = "";
let salesUserId = "";
let sales: Actor;
let registry: Registry;

/// Mốc thời gian mở tệp — mọi phép đếm ghi vết chỉ tính từ đây trở đi, nên một
/// lượt chạy trước trên cùng CSDL demo không cộng vào.
const batDau = new Date();

/// ⚠ CẢ HAI LỜI GỌI ĐI QUA SỔ ĐĂNG KÝ, KHÔNG GỌI THẲNG LÕI.
/// Hàng `audit_record` do **pha 1** tạo, và pha 1 nằm ở tầng ④ (`AD-CP-5` bước
/// ④) chứ không ở lõi — lõi chỉ `complete()`, vốn thoát ngay khi `auditId` là
/// `null` (`src/core/audit.ts:105`). Gọi thẳng lõi thì §6 vế *"có bản ghi cho cả
/// lần tự đặt lẫn lần hoàn tác"* đỏ dù sản phẩm hoàn toàn đúng.
///
/// Nó cũng làm phép kiểm đúng hơn về bản chất: `undoSystemNextAction` khai
/// `allowedActors: HUMAN_ONLY`, và chỉ đường qua sổ đăng ký mới đo được điều đó.
async function goi(name: string, actor: Actor, params: unknown): Promise<unknown> {
  const cap = await registry.loadCapability(name as never, actor);
  return cap(params as never);
}


test.describe.configure({ mode: "serial" });

test.beforeAll(async () => {
  const user = await createE2eUser("T7");
  salesUserId = user.id;
  sales = user.actor;

  // Giống hệt nhánh web (`src/app/_registry.ts`): ghi vết THẬT.
  registry = createRegistry({
    seedMode: false,
    auditSink: createAuditSink({ seedMode: false, keepAudit: true }),
  });

  const tenCongTy = e2eName("T7");
  const acc = await createCompany(seeder, { name: tenCongTy, market: "JP" }, mutedCtx);
  accountId = acc.id;

  const opp = await createOpportunity(
    seeder,
    { accountId, name: `${tenCongTy} — gói vận hành` },
    mutedCtx,
  );
  opportunityId = opp.id;

  const snap = await rawDb.snapshot.create({
    data: { accountId, version: "sau", capturedAt: new Date() },
    select: { id: true },
  });
  const art = await rawDb.article.create({
    data: {
      accountId,
      snapshotId: snap.id,
      rawText: BAI_VIET,
      normalizedText: BAI_VIET,
      readAt: new Date(),
      contentHash: `e2e-t7-${Date.now()}`,
    },
    select: { id: true },
  });

  const s = await createSignal(
    sales,
    {
      accountId,
      articleId: art.id,
      claim: "Công ty vừa gọi vốn vòng B",
      quote: "gọi vốn vòng B",
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
  "T-7 — Bấm Hoàn tác ở T-6, một cú bấm, giá trị cũ trở lại đúng nguyên trạng. Có bản ghi cho cả lần tự đặt lẫn lần hoàn tác",
  () => {
    test("cảnh nền: MÁY tự đặt Việc tiếp theo vào một ô ĐANG TRỐNG", async () => {
      // Ghi vết THẬT ở lượt này: *"bản ghi cho lần tự đặt"* là một trong hai vế
      // §6 đòi, và sink câm sẽ giấu đúng vế đó.
      // ⚠ HAI THAM SỐ, không phải sáu — hợp đồng đổi 15/8. Lõi tự đọc Cơ hội,
      // hạn và giá trị hiện có trong giao dịch của nó; tầng ① không dựng nổi
      // sáu giá trị cũ, nên §4/nhóm 4 chưa từng chạy trong vòng quét thật.
      const daGhi = await goi("fillNextActionIfUnchanged", machine, {
        accountId,
        signalId,
      });
      expect(daGhi, "Máy phải điền được vào ô đang trống (`AD-3` nhánh ⓐ).").toBe(true);

      const na = await rawDb.nextAction.findFirstOrThrow({
        where: { opportunityId, deletedAt: null },
        select: { setBy: true, undoDeadlineAt: true },
      });
      expect(na.setBy).toBe("he_thong");
      expect(na.undoDeadlineAt).not.toBeNull();
    });

    test("MỘT lời gọi Hoàn tác, và nó thành công", async () => {
      const xong = await goi("undoSystemNextAction", sales, { opportunityId });
      expect(xong, "Hoàn tác trong cửa sổ 7 ngày phải thành công.").toBe(true);
    });

    test("giá trị cũ trở lại ĐÚNG NGUYÊN TRẠNG — ô về TRỐNG, không phải chuỗi rỗng", async () => {
      // Ô vốn trống, nên nguyên trạng = KHÔNG CÒN hàng nào còn sống.
      const conSong = await rawDb.nextAction.count({
        where: { opportunityId, deletedAt: null },
      });
      expect(
        conSong,
        "Ô vốn TRỐNG trước khi máy điền, nên *nguyên trạng* là không còn Việc tiếp "
          + "theo nào — không phải một hàng còn đó với nội dung rỗng (`AD-3` nhánh ⓐ, `D16`).",
      ).toBe(0);

      // `AD-14` — xoá MỀM, không DELETE: `D30` đòi mục bị xoá vẫn còn làm dữ liệu đo.
      const daXoaMem = await rawDb.nextAction.count({
        where: { opportunityId, deletedAt: { not: null } },
      });
      expect(
        daXoaMem,
        "Hoàn tác phải xoá MỀM. Xoá cứng làm mất dữ liệu đo của `D30` và vi phạm `AD-14`.",
      ).toBe(1);
    });

    test("có bản ghi cho CẢ HAI — lần tự đặt VÀ lần hoàn tác", async () => {
      // ⚠ KHÔNG lọc theo `accountId`. Sổ đăng ký ghi vết pha 1 mà không truyền
      // `accountId` (`src/capability/registry.ts:84`), nên mọi dòng mang
      // `account_id = NULL`. Lọc theo nó thì phép kiểm này đỏ vì một lỗi KHÁC.
      // Lỗi ấy được giữ ĐỎ ở phép kiểm cuối tệp.
      //
      // Thay vào đó lọc theo hai capability — chính xác hơn về mặt ý nghĩa: §6
      // đòi bản ghi cho LẦN TỰ ĐẶT và cho LẦN HOÀN TÁC, tức hai lời gọi có tên.
      const records = await rawDb.auditRecord.findMany({
        where: {
          capability: { in: ["fillNextActionIfUnchanged", "undoSystemNextAction"] },
          createdAt: { gte: batDau },
        },
        select: { capability: true, outcome: true, actorKind: true, actorUserId: true },
      });

      const tuDat = records.filter((r) => r.capability === "fillNextActionIfUnchanged");
      const hoanTac = records.filter((r) => r.capability === "undoSystemNextAction");

      expect(tuDat.length, "Thiếu bản ghi cho lần MÁY tự đặt.").toBeGreaterThanOrEqual(1);
      expect(hoanTac.length, "Thiếu bản ghi cho lần HOÀN TÁC.").toBeGreaterThanOrEqual(1);

      // Hai lần phải phân biệt được TÁC NHÂN: máy đặt, người gỡ. Nếu cả hai cùng
      // `actor_kind` thì sổ ghi vết không trả lời được *"ai"* — vế đầu của §6.
      expect(tuDat.some((r) => r.actorKind === "system")).toBe(true);
      expect(hoanTac.some((r) => r.actorKind === "human" && r.actorUserId === salesUserId)).toBe(true);
    });

    test("bấm lần thứ hai là NO-OP, không phải lỗi và không xoá thêm gì", async () => {
      // Không nằm trong nguyên văn §6, nhưng *"một cú bấm"* chỉ có nghĩa nếu cú
      // bấm thứ hai không phá gì: người dùng bấm đúp là chuyện thường.
      const lai = await goi("undoSystemNextAction", sales, { opportunityId });
      expect(lai).toBe(false);

      const daXoaMem = await rawDb.nextAction.count({
        where: { opportunityId, deletedAt: { not: null } },
      });
      expect(daXoaMem).toBe(1);
    });

    test("MỘT CÚ BẤM: nút Hoàn tác có trên giao diện", async ({ page }) => {
      // ⚠ DỰNG LẠI CẢNH TRƯỚC KHI MỞ TRANG, và đây là chỗ phép kiểm này từng
      // đỏ vì một lý do sai.
      //
      // Tệp chạy `mode: "serial"`. Phép kiểm hoàn tác ở trên đã chạy xong và
      // khẳng định `conSong === 0`, nên tới đây Cơ hội KHÔNG còn Việc tiếp theo
      // nào sống — và một giao diện ĐÚNG thì không vẽ nút Hoàn tác lên hư không.
      //
      // ⚠ Cách rẻ nhất để làm nó xanh là gỡ vế `deletedAt: null` ở
      // `src/core/nextaction/read.ts` — tức ship đúng cái NÚT CHẾT mà `T-7` sinh
      // ra để bắt. Thêm dữ liệu, đừng bớt khẳng định.
      await goi("fillNextActionIfUnchanged", machine, { accountId, signalId });

      await page.context().addCookies([
        { name: "why_now_user", value: salesUserId, domain: "127.0.0.1", path: "/" },
      ]);
      await page.goto(`/accounts/${accountId}`);

      const nut = page.getByRole("button", { name: "Hoàn tác" });
      await expect(
        nut,
        "§6 T-7 đòi *một cú bấm*: một nút mang đúng chữ `Hoàn tác`, không hộp xác "
          + "nhận, không hai bước.",
      ).toBeVisible();

      // Vế ĐỐI CHỨNG, và nó là thứ phân biệt một nút THẬT với một nút vẽ sẵn:
      // bấm xong thì nút phải BIẾN MẤT, vì không còn gì để hoàn tác. Thiếu vế
      // này thì một khối luôn-luôn-vẽ-nút vẫn qua được khẳng định ở trên.
      await nut.click();
      await expect(
        page.getByRole("button", { name: "Hoàn tác" }),
        "Hoàn tác xong thì không còn gì để hoàn tác — nút phải biến mất.",
      ).toHaveCount(0);
    });
    test("LỖI GHI VẾT: dòng ghi vết không mang mã Công ty", async () => {
      // ⚠ PHÉP KIỂM NÀY ĐỎ, VÀ NÓ ĐỎ VÌ SẢN PHẨM SAI — cùng một lỗi mà `T-5` nêu.
      // `src/capability/registry.ts:84` không truyền `accountId` vào ghi vết pha 1.
      // Với `T-7` nó đắt hơn: *"bản ghi cho cả lần tự đặt lẫn lần hoàn tác"* mất
      // đúng cột dùng để dựng dòng thời gian ghi vết của MỘT Công ty.
      const coMaCongTy = await rawDb.auditRecord.count({
        where: {
          capability: { in: ["fillNextActionIfUnchanged", "undoSystemNextAction"] },
          createdAt: { gte: batDau },
          accountId: { not: null },
        },
      });
      expect(
        coMaCongTy,
        "Hai lời gọi đều gắn với một Cơ hội thuộc một Công ty cụ thể, nên hai dòng "
          + "ghi vết phải mang `account_id`. Đang có 0.",
      ).toBeGreaterThanOrEqual(2);
    });

  },
);
