// T-5 — Duyệt một gợi ý, sửa-rồi-duyệt một gợi ý, bỏ một gợi ý
//
// Đề bài §6, NGUYÊN VĂN: *"Duyệt một gợi ý, sửa-rồi-duyệt một gợi ý, bỏ một gợi
// ý. Cả ba đều để lại bản ghi có ai, lúc nào, quyết gì; con số **sửa** không bị
// cộng vào con số **duyệt**"*.
//
// ⚠ *"BẢN GHI CÓ AI, LÚC NÀO, QUYẾT GÌ"* TỒN TẠI Ở HAI CHỖ, và cần cả hai:
//   · hàng `suggestion` — `status` · `decided_by` · `decided_at` · `drop_reason`
//   · hàng `audit_record` — `actor_*` · `capability` · `outcome` · giá trị cũ/mới
// Chỉ kiểm chỗ thứ nhất là chứng minh *bảng Gợi ý nhớ được*, không chứng minh
// *hệ thống để lại vết* (`AD-4` bất biến ①). Nên tệp này dùng ngữ cảnh GHI VẾT
// THẬT, và mọi phép đếm lọc theo `actorUserId` của riêng nó để miễn nhiễm với
// dữ liệu của tệp khác trên cùng CSDL demo.
//
// ⚠ *"SỬA KHÔNG BỊ CỘNG VÀO DUYỆT"* là vế dễ trôi nhất và phải khẳng định trên
// CHÍNH HÀM ĐO, không phải trên bảng thô. Đếm tay ba hàng rồi kết luận là kiểm
// lại phép đếm của mình, không phải kiểm phép đếm của sản phẩm — mà chỗ hỏng
// nằm ở `metrics.ts`.
//
// ⚠ PHẦN GIAO DIỆN ĐỎ, CÓ CHỦ ĐÍCH. Hàng đợi Gợi ý (§4/nhóm 3) không có bề mặt
// nào trong `src/app`: bốn capability `approveSuggestion`, `editThenApprove`,
// `dropSuggestion`, `queueSuggestion` đã có ở tầng ④ nhưng không màn hình nào
// gọi. Nên *"duyệt"*, *"sửa-rồi-duyệt"*, *"bỏ"* hôm nay không bấm được.
//
// Mã thượng nguồn: `T-5` · `FR-20`…`FR-23` · `AD-4` · `AD-CR-7` · `D36`.

import "./_env";

import { test, expect } from "@playwright/test";
import { createCompany } from "@/core/company";
import { createSignal } from "@/core/signal";
import { createSuggestion } from "@/core/suggestion";
import { autoAcceptRate } from "@/core/metrics";
import { createRegistry, type Registry } from "@/capability/registry";
import { createAuditSink } from "@/core/audit";
import {
  cleanupE2eData,
  createE2eUser,
  e2eName,
  mutedCtx,
  rawDb,
  seeder,
} from "./_fixtures";

const BAI_VIET =
  "Sakura Logistics vừa gọi vốn vòng B, mở văn phòng Osaka và tuyển 50 kỹ sư.";

let accountId = "";
let salesUserId = "";
let sales: Parameters<typeof createSuggestion>[0];
let registry: Registry;

/// ⚠ QUYẾT ĐỊNH ĐI QUA SỔ ĐĂNG KÝ, KHÔNG GỌI THẲNG LÕI — và đây là lý do:
/// hàng `audit_record` do **pha 1** tạo ra, mà pha 1 nằm ở tầng ④
/// (`AD-CP-5` bước ④), KHÔNG ở lõi. Lõi chỉ `complete()`, và `complete()` thoát
/// ngay khi `auditId` là `null` (`src/core/audit.ts:105`).
/// Gọi thẳng `decideSuggestion` với `auditId: null` nên KHÔNG để lại dòng nào —
/// và `T-5` sẽ đỏ ở đúng vế *"để lại bản ghi"* dù sản phẩm hoàn toàn đúng.
/// Đi qua sổ đăng ký còn đo thêm được Cổng, tức đúng đường mà một cú bấm thật đi.
async function quyet(name: string, params: unknown): Promise<void> {
  const cap = await registry.loadCapability(name as never, sales);
  await cap(params as never);
}
const sug: Record<"duyet" | "sua" | "bo" | "giuLaiChoGiaoDien", string> =
  { duyet: "", sua: "", bo: "", giuLaiChoGiaoDien: "" };

test.describe.configure({ mode: "serial" });

test.beforeAll(async () => {
  const user = await createE2eUser("T5");
  salesUserId = user.id;
  sales = user.actor;

  // Giống hệt nhánh web (`src/app/_registry.ts`): ghi vết THẬT, không chế độ gieo.
  registry = createRegistry({
    seedMode: false,
    auditSink: createAuditSink({ seedMode: false, keepAudit: true }),
  });

  const acc = await createCompany(seeder, { name: e2eName("T5"), market: "JP" }, mutedCtx);
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
      contentHash: `e2e-t5-${Date.now()}`,
    },
    select: { id: true },
  });

  const signal = await createSignal(
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

  // BA Gợi ý trên BA ô KHÁC NHAU. Cùng một ô thì `suggestion_one_pending_per_slot`
  // đóng cái trước bằng `co_goi_y_moi_hon` (`FR-51`), và hai trong ba lối ra
  // biến mất trước khi ai kịp quyết.
  const mk = async (
    targetField: "country" | "industry" | "website" | "specialty_area",
    value: string,
  ) => {
    const s = await createSuggestion(
      sales,
      { kind: "fill_field", accountId, signalId: signal.id, targetField, currentValue: null, proposedValue: value },
      mutedCtx,
    );
    return s.id;
  };
  sug.duyet = await mk("country", "Nhật Bản");
  sug.sua = await mk("industry", "Logistic");
  sug.bo = await mk("website", "https://sai-hoan-toan.example");

  // ⚠ Gợi ý THỨ TƯ, và nó tồn tại vì phép kiểm giao diện ở cuối tệp.
  //
  // Tệp chạy `mode: "serial"`. Phép kiểm ① quyết cả ba Gợi ý trên, phép kiểm ⑤
  // tạo thêm một cái rồi cũng quyết nốt — nên đến phép kiểm giao diện, Công ty
  // này còn **0** Gợi ý `cho`, hàng đợi hiện trạng thái rỗng, và không nút
  // *Duyệt* nào tồn tại để tìm.
  //
  // Cách sửa là THÊM DỮ LIỆU, không bớt khẳng định. Cho hàng đợi hiện một nút
  // *Duyệt* trên một Gợi ý đã quyết là dựng một nút bấm vào trả `no_op` — làm
  // vừa mặt chữ của phép kiểm và phá đúng ý nó.
  //
  // Ô `specialty_area` chọn vì không phép kiểm nào khác trong tệp đụng tới, nên
  // Gợi ý này ở nguyên trạng thái `cho` tới cuối.
  sug.giuLaiChoGiaoDien = await mk("specialty_area", "Tích hợp hệ thống kho vận");
});

test.afterAll(async () => {
  await cleanupE2eData();
});

test.describe(
  "T-5 — Duyệt một gợi ý, sửa-rồi-duyệt một gợi ý, bỏ một gợi ý. Cả ba đều để lại bản ghi có ai, lúc nào, quyết gì; con số sửa không bị cộng vào con số duyệt",
  () => {
    test("ba lối ra chạy được, mỗi lối một lần", async () => {
      // `decisionSeconds` để 8 giây: TRÊN ngưỡng duyệt mù 3 giây (`BR-B6`,
      // bảng 0.2.2). Để 1 giây thì ba quyết định này tự treo cờ duyệt mù và làm
      // bẩn số đo của màn hình Quản trị.
      await quyet("approveSuggestion", { suggestionId: sug.duyet, decisionSeconds: 8 });
      await quyet("editThenApprove", {
        suggestionId: sug.sua,
        editedValue: "Logistics",
        decisionSeconds: 12,
      });
      await quyet("dropSuggestion", {
        suggestionId: sug.bo,
        dropReason: "thong_tin_sai",
        decisionSeconds: 5,
      });

      const rows = await rawDb.suggestion.findMany({
        where: { id: { in: [sug.duyet, sug.sua, sug.bo] } },
        select: { id: true, status: true },
      });
      const byId = new Map(rows.map((r) => [r.id, r.status]));
      expect(byId.get(sug.duyet)).toBe("duyet");
      expect(byId.get(sug.sua)).toBe("sua_roi_duyet");
      expect(byId.get(sug.bo)).toBe("bo");
    });

    test("cả ba để lại bản ghi có AI, LÚC NÀO, QUYẾT GÌ — trên hàng Gợi ý", async () => {
      const rows = await rawDb.suggestion.findMany({
        where: { id: { in: [sug.duyet, sug.sua, sug.bo] } },
        select: { id: true, status: true, decidedBy: true, decidedAt: true, dropReason: true },
      });
      expect(rows).toHaveLength(3);

      for (const r of rows) {
        expect(r.decidedBy, `Gợi ý ${r.id} thiếu vế AI`).toBe(salesUserId);
        expect(r.decidedAt, `Gợi ý ${r.id} thiếu vế LÚC NÀO`).not.toBeNull();
      }

      // *"Quyết gì"* với lối ra `bo` gồm cả LÝ DO — `BR-D10` bắt chọn trong enum
      // năm giá trị, không nhập tự do.
      const bo = rows.find((r) => r.id === sug.bo);
      expect(bo?.dropReason).toBe("thong_tin_sai");
    });

    test("cả ba để lại bản ghi trên sổ ghi vết — hệ thống để lại vết, không chỉ bảng Gợi ý nhớ", async () => {
      // Lọc theo `actorUserId` của riêng tệp này: CSDL demo có thể có người khác
      // đang thao tác, và một phép đếm trần sẽ đếm cả họ.
      //
      // ⚠ KHÔNG lọc thêm theo `accountId`. Sổ đăng ký ghi vết pha 1 mà KHÔNG
      // truyền `accountId` (`src/capability/registry.ts:84`), nên mọi dòng đi qua
      // đường đó mang `account_id = NULL`. Lọc theo nó thì phép kiểm này đỏ vì một
      // lỗi KHÁC với lỗi nó định bắt. Lỗi ấy được giữ ĐỎ ở phép kiểm cuối tệp.
      const records = await rawDb.auditRecord.findMany({
        where: {
          actorUserId: salesUserId,
          capability: { in: ["approveSuggestion", "editThenApprove", "dropSuggestion"] },
        },
        select: { capability: true, outcome: true, valueBefore: true, valueAfter: true },
      });

      // Ba lối ra, ba capability KHÁC NHAU — đủ ba, không phải ba dòng cùng loại.
      const tenCap = new Set(records.map((r) => r.capability));
      expect(
        tenCap,
        "Ba lối ra phải để lại vết dưới ba capability riêng (`AD-4` bất biến ①).",
      ).toEqual(new Set(["approveSuggestion", "editThenApprove", "dropSuggestion"]));

      // Bất biến ② của `AD-4`: dòng ghi vết mang giá trị cũ/mới khi có ghi thật.
      const coGhiThat = records.filter((r) => r.outcome === "ok");
      expect(coGhiThat.length).toBeGreaterThanOrEqual(3);
      for (const r of coGhiThat) {
        expect(r.valueAfter, `\`${r.capability}\` ghi vết thiếu giá trị mới`).not.toBeNull();
      }
    });

    test("SỬA-RỒI-DUYỆT áp giá trị ĐÃ SỬA, không áp giá trị mô hình đề nghị", async () => {
      const acc = await rawDb.account.findUniqueOrThrow({
        where: { id: accountId },
        select: { industry: true, country: true, website: true },
      });

      // Duyệt thẳng → áp nguyên giá trị đề nghị.
      expect(acc.country).toBe("Nhật Bản");
      // Sửa-rồi-duyệt → áp giá trị NGƯỜI sửa, không phải `"Logistic"` mô hình đưa.
      expect(acc.industry).toBe("Logistics");
      // Bỏ → hồ sơ giữ nguyên VÔ THỜI HẠN (`FR-21`).
      expect(acc.website).toBeNull();
    });

    test("con số SỬA không bị cộng vào con số DUYỆT — khẳng định trên chính hàm đo", async () => {
      // ⚠ Đọc từ `readAdminMetrics`, KHÔNG tự đếm ba hàng vừa tạo. Chỗ có thể
      // hỏng là `metrics.ts`, nên đếm tay rồi so là kiểm phép đếm của mình.
      const m = await autoAcceptRate();

      // `sua_roi_duyet` phải nằm ở MẪU SỐ (đã có người quyết) nhưng KHÔNG ở tử
      // số của tỉ lệ duyệt thẳng. Hai vế, và vế mẫu số mới là vế hay bị bỏ sót:
      // loại hẳn `sua_roi_duyet` khỏi cả hai làm tỉ lệ duyệt thẳng bị THỔI LÊN.
      expect(m.denominator).toBeGreaterThanOrEqual(3);
      expect(m.numerator).toBeLessThan(m.denominator);

      // Vế sắc hơn, và là vế `T-5` thật sự hỏi. Hai lượt đếm quanh MỘT lần
      // sửa-rồi-duyệt: mẫu số phải tăng đúng 1, tử số phải KHÔNG đổi. So tuyệt
      // đối trên CSDL demo không phát biểu được vì người khác có thể đang quyết
      // gợi ý cùng lúc — so DELTA thì phát biểu được.
      const truoc = await autoAcceptRate();
      const s = await createSuggestion(
        sales,
        {
          kind: "fill_field",
          accountId,
          signalId: (await rawDb.suggestion.findUniqueOrThrow({
            where: { id: sug.duyet },
            select: { signalId: true },
          })).signalId,
          targetField: "revenue_range",
          currentValue: null,
          proposedValue: "1-5 tỉ",
        },
        mutedCtx,
      );
      await quyet("editThenApprove", {
        suggestionId: s.id,
        editedValue: "5-10 tỉ",
        decisionSeconds: 9,
      });
      const sau = await autoAcceptRate();

      expect(sau.denominator - truoc.denominator).toBe(1);
      expect(
        sau.numerator - truoc.numerator,
        "Một lượt *sửa-rồi-duyệt* vừa được cộng vào tử số của tỉ lệ DUYỆT THẲNG. "
          + "`FR-22` tách hai lối ra này, và gộp chúng làm `T-5` không phát biểu được.",
      ).toBe(0);
    });

    test("hàng đợi Gợi ý bấm được trên giao diện — duyệt, sửa-rồi-duyệt, bỏ", async ({ page }) => {
      await page.context().addCookies([
        { name: "why_now_user", value: salesUserId, domain: "127.0.0.1", path: "/" },
      ]);
      await page.goto(`/accounts/${accountId}`);

      // §4/nhóm 3 đòi một hàng đợi có ba lối ra bấm được. Bốn capability đã có ở
      // tầng ④ nhưng không bề mặt nào gọi chúng, nên ba nút này chưa tồn tại.
      await expect(
        page.getByRole("button", { name: "Duyệt" }).first(),
        "§6 T-5 đòi *duyệt / sửa-rồi-duyệt / bỏ* một gợi ý. Hàng đợi Gợi ý (§4/nhóm 3) "
          + "chưa có bề mặt nào trong `src/app` — `approveSuggestion`, `editThenApprove`, "
          + "`dropSuggestion` có ở tầng ④ nhưng không màn hình nào gọi.",
      ).toBeVisible();
    });
    test("LỖI GHI VẾT: dòng ghi vết không mang mã Công ty", async () => {
      // ⚠ PHÉP KIỂM NÀY ĐỎ, VÀ NÓ ĐỎ VÌ SẢN PHẨM SAI.
      //
      // `src/capability/registry.ts:84` gọi `auditSink.begin({actor, capability,
      // zone, risk, allowed, denyReason, causedBy})` — KHÔNG có `accountId`. Nên
      // mọi dòng ghi vết đi qua sổ đăng ký, tức mọi cú bấm thật trên giao diện,
      // đều mang `account_id = NULL`.
      //
      // Hệ quả: không trả lời được câu *"hệ thống đã làm gì với Công ty này?"* từ
      // sổ ghi vết. Chỉ mục `@@index([accountId])` trên `audit_record` cũng thành
      // vô dụng, và chú thích của lược đồ nói rõ `accountId` chỉ nên NULL với
      // những lời gọi KHÔNG gắn Công ty (`listEnums`, `readSetting`,
      // `writeScanLog`) — `approveSuggestion` không thuộc nhóm đó.
      //
      // Sửa ở `src/capability/registry.ts` — KHÔNG sửa ở đây.
      const coMaCongTy = await rawDb.auditRecord.count({
        where: {
          actorUserId: salesUserId,
          capability: { in: ["approveSuggestion", "editThenApprove", "dropSuggestion"] },
          accountId: { not: null },
        },
      });
      expect(
        coMaCongTy,
        "Ba lần quyết Gợi ý đều gắn với một Công ty cụ thể, nên ba dòng ghi vết phải "
          + "mang `account_id`. Đang có 0 — sổ ghi vết không truy được theo Công ty.",
      ).toBeGreaterThanOrEqual(3);
    });

  },
);
