// T-5 — Ba lối ra của Gợi ý đều để lại bản ghi
//
// Đề bài §6, nguyên văn: *"Duyệt một gợi ý, sửa-rồi-duyệt một gợi ý, bỏ một gợi
// ý. Cả ba đều để lại bản ghi có ai, lúc nào, quyết gì; con số **sửa** không bị
// cộng vào con số **duyệt**"*.
//
// **Đây là tệp DUY NHẤT trong bốn tệp dùng sổ đăng ký GHI VẾT THẬT.** *"Bản ghi
// có ai, lúc nào, quyết gì"* tồn tại ở HAI chỗ, và cần cả hai:
//   · hàng `suggestion` — `status` · `decided_by` · `decided_at` · `drop_reason`
//   · hàng `audit_record` — `actor_*` · `capability` · `outcome` · giá trị cũ/mới
// Chỉ kiểm chỗ thứ nhất là chứng minh *bảng Gợi ý nhớ được*, không chứng minh
// *hệ thống để lại vết* (`AD-4` bất biến ①).
//
// Dữ liệu NỀN dựng bằng lời gọi lõi với ghi vết CÂM, có chủ đích: nếu nó cũng
// ghi vết thì phép đếm dưới đây không phân biệt được *vết của một quyết định*
// với *vết của việc dựng cảnh*.
//
// ⚠ TỆP NÀY KHÔNG DỌN THỨ NÓ TẠO, và đó là quyết định chứ không phải chỗ quên.
// Ba Gợi ý đã quyết ở lại trong bảng, nên `autoAcceptRate` và `errorDetectionRate`
// — vốn `count()` toàn bảng (`AD-9`) — thấy một quần thể đã dịch. Xoá chúng đi
// thì chính phép đo delta dưới đây mất đối tượng. Hệ quả bắt buộc phải nói ra:
// **mọi tệp kiểm khác đọc hai chỉ số ấy cũng phải đo bằng delta**, không bằng
// giá trị tuyệt đối. Lược đồ được dựng lại từ đầu mỗi lượt `npm test`, nên nó
// không rò qua giữa hai lượt chạy.
//
// ⚠⚠ BỀ MẶT `S2` **Suggestion queue** CHƯA TỒN TẠI trong `src/app` (hôm nay chỉ
// có `accounts`, `board`, `admin`, `login`), và không tệp nào trong `src/app`
// gọi `approveSuggestion` / `editThenApprove` / `dropSuggestion`. Nghĩa là câu
// §6 *"Duyệt một gợi ý, sửa-rồi-duyệt một gợi ý, bỏ một gợi ý"* KHÔNG thao tác
// tay được: không có nút để bấm. Đây KHÔNG phải một giới hạn của `jsdom` — đó là
// một phần chưa dựng (`C1-9`, `S2`), và tệp này xanh ở mức capability + dữ liệu
// chứ không ở mức điểm nghiệm thu trước một giám khảo. (`S5` là **Opportunity
// detail** — đừng trích nhầm.)
//
// ⚠ `decisionSeconds` ở đây là THAM SỐ truyền vào, nên nó chứng minh cột được
// ghi, KHÔNG chứng minh đồng hồ đúng. Mốc bắt đầu đếm do bề mặt quyết và `FR-23`
// mô tả; `BR-B6` chỉ chốt NGƯỠNG duyệt mù, không chốt mốc bắt đầu.
//
// `D36`: `T-n` là lớp NGOÀI. Cục sở hữu thân: ①. Mốc: M2.

import { describe, it, expect, beforeAll } from "vitest";
import { db } from "@/core/db";
import { createCompany } from "@/core/company";
import { createSignal } from "@/core/signal";
import { createSuggestion } from "@/core/suggestion";
import type { TargetField } from "@/core/suggestion";
import { autoAcceptRate, type MetricPair } from "@/core/metrics";
import type { Registry } from "@/capability/registry";
import {
  auditRows, auditedRegistry, createArticle, createTestUser, machine, mutedCtx,
  seeder, type TestUser,
} from "./_helpers";

const BAI_VIET =
  "Tomahawk Systems công bố vòng gọi vốn Series B trị giá 20 triệu đô la, " +
  "và mở văn phòng mới tại Osaka.";

/// Giá trị đề nghị của ba Gợi ý — mỗi cái nhắm một ô đích KHÁC nhau, vì
/// `suggestion_one_pending_per_slot` chỉ cho MỘT Gợi ý đang chờ trên mỗi ô
/// (`FR-51`). Ba Gợi ý cùng ô thì hai cái đầu bị đóng `dong_he_thong` trước khi
/// ai kịp quyết, và phép kiểm này mất hai trong ba lối ra.
const DE_NGHI_WEBSITE = "https://tomahawk.example.jp";
const DE_NGHI_COUNTRY = "JP";
const SUA_THANH_COUNTRY = "Nhật Bản";
const DE_NGHI_INDUSTRY = "tai_chinh";
const NGANH_BAN_DAU = "phan_mem";

let reg: Registry;
let sales: TestUser;
let accountId = "";
let signalId = "";
let idDuyet = "";
let idSuaRoiDuyet = "";
let idBo = "";
/// Chụp TRƯỚC mọi quyết định. Xem `it` cuối: chỉ số này đếm trên TOÀN bảng, nên
/// giá trị tuyệt đối không xác định — delta thì xác định.
let doTruoc: MetricPair;

beforeAll(async () => {
  reg = auditedRegistry();
  sales = await createTestUser("t5");

  const acc = await createCompany(
    seeder,
    { name: `T-5 Co ${Date.now()}`, market: "JP", industry: NGANH_BAN_DAU },
    mutedCtx,
  );
  accountId = acc.id;

  const article = await createArticle(accountId, BAI_VIET);
  const signal = await createSignal(
    seeder,
    {
      accountId,
      articleId: article.id,
      claim: "Công ty vừa gọi vốn Series B",
      quote: "vòng gọi vốn Series B",
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
  signalId = signal.id;

  const dungGoiY = async (
    targetField: TargetField,
    currentValue: string | null,
    proposedValue: string,
  ) =>
    (
      await createSuggestion(
        seeder,
        { kind: "fill_field", accountId, signalId, targetField, currentValue, proposedValue },
        mutedCtx,
      )
    ).id;

  idDuyet = await dungGoiY("website", null, DE_NGHI_WEBSITE);
  idSuaRoiDuyet = await dungGoiY("country", null, DE_NGHI_COUNTRY);
  idBo = await dungGoiY("industry", NGANH_BAN_DAU, DE_NGHI_INDUSTRY);

  doTruoc = await autoAcceptRate();
});

describe("T-5 — Ba lối ra của Gợi ý đều để lại bản ghi", () => {
  it("duyệt một Gợi ý", async () => {
    // `FR-20` — Duyệt ghi thẳng giá trị đề nghị vào ô hồ sơ.
    const duyet = await reg.loadCapability("approveSuggestion", sales.actor);
    await duyet({ suggestionId: idDuyet, decisionSeconds: 12 });

    const row = await db.suggestion.findUniqueOrThrow({
      where: { id: idDuyet },
      select: { status: true, decidedBy: true, decidedAt: true, decisionSeconds: true },
    });
    expect(row.status).toBe("duyet");
    expect(row.decidedBy).toBe(sales.id);
    expect(row.decidedAt).not.toBeNull();
    expect(row.decisionSeconds).toBe(12);

    // Hệ quả dây chuyền, CÙNG giao dịch (`AD-21`): ô hồ sơ mang giá trị đề nghị.
    const acc = await db.account.findUniqueOrThrow({
      where: { id: accountId },
      select: { website: true },
    });
    expect(acc.website).toBe(DE_NGHI_WEBSITE);

    // ĐỐI CHỨNG `T-4` — *"không có chế độ tự duyệt"*. Vắng `system` trong
    // `allowedActors` là chỗ luật đó được cưỡng chế, ở bước ③ của Cổng.
    await expect(
      reg.loadCapability("approveSuggestion", machine),
    ).rejects.toMatchObject({ name: "GateDenied", reason: "actor_not_allowed" });
  });

  it("sửa-rồi-duyệt một Gợi ý", async () => {
    // `FR-22` — lối ra RIÊNG, không phải một biến thể của Duyệt.
    const sua = await reg.loadCapability("editThenApprove", sales.actor);
    await sua({
      suggestionId: idSuaRoiDuyet,
      editedValue: SUA_THANH_COUNTRY,
      decisionSeconds: 25,
    });

    const row = await db.suggestion.findUniqueOrThrow({
      where: { id: idSuaRoiDuyet },
      select: {
        status: true, decidedBy: true, decidedAt: true, decisionSeconds: true,
        proposedValue: true,
      },
    });
    expect(row.status).toBe("sua_roi_duyet");
    expect(row.decidedBy).toBe(sales.id);
    expect(row.decidedAt).not.toBeNull();
    expect(row.decisionSeconds).toBe(25);

    // Giá trị áp vào hồ sơ là giá trị NGƯỜI SỬA, không phải giá trị máy đề nghị.
    const acc = await db.account.findUniqueOrThrow({
      where: { id: accountId },
      select: { country: true },
    });
    expect(acc.country).toBe(SUA_THANH_COUNTRY);
    expect(acc.country).not.toBe(row.proposedValue);
    // Giá trị đề nghị gốc GIỮ NGUYÊN trên hàng Gợi ý — không có nó thì không đọc
    // lại được *người đã sửa cái gì*, và `FR-22` mất bằng chứng.
    expect(row.proposedValue).toBe(DE_NGHI_COUNTRY);
  });

  it("bỏ một Gợi ý", async () => {
    // `FR-21` — không duyệt thì hồ sơ giữ nguyên VÔ THỜI HẠN.
    const bo = await reg.loadCapability("dropSuggestion", sales.actor);
    await bo({ suggestionId: idBo, dropReason: "thong_tin_sai", decisionSeconds: 40 });

    const row = await db.suggestion.findUniqueOrThrow({
      where: { id: idBo },
      select: {
        status: true, dropReason: true, decidedBy: true, decidedAt: true,
        decisionSeconds: true,
      },
    });
    expect(row.status).toBe("bo");
    // `FR-20` · `0.1.7` — lý do là ENUM năm giá trị, do NGƯỜI chọn. (`BR-D10` là
    // luật ràng đầu ra của MÔ HÌNH, không phải luật này — đừng trích nhầm.)
    // `thong_tin_sai` là giá trị DUY NHẤT vào tử số `errorDetectionRate` (`D30`).
    expect(row.dropReason).toBe("thong_tin_sai");
    expect(row.decidedBy).toBe(sales.id);
    expect(row.decidedAt).not.toBeNull();
    expect(row.decisionSeconds).toBe(40);

    // ĐỐI CHỨNG: Bỏ KHÔNG chạm hồ sơ — ô `industry` còn nguyên giá trị ban đầu.
    const acc = await db.account.findUniqueOrThrow({
      where: { id: accountId },
      select: { industry: true },
    });
    expect(acc.industry).toBe(NGANH_BAN_DAU);
    expect(acc.industry).not.toBe(DE_NGHI_INDUSTRY);
  });

  it("cả ba để lại bản ghi có ai, lúc nào, quyết gì", async () => {
    const BA_LOI_RA = [
      { cap: "approveSuggestion", status: "duyet" },
      { cap: "editThenApprove", status: "sua_roi_duyet" },
      { cap: "dropSuggestion", status: "bo" },
    ] as const;

    for (const { cap, status } of BA_LOI_RA) {
      const rows = await auditRows(sales.id, cap);
      // MỘT dòng cho MỘT lối ra: ba capability khác nhau là ba tên khác nhau
      // trong cột `capability` — đó là lý do `AD-2` không gộp chúng làm một mục
      // với tham số `outcome`.
      expect(rows, `ghi vết của \`${cap}\``).toHaveLength(1);
      const r = rows[0]!;
      // AI — `actor` đi vào dòng ghi vết, không phải một hằng số.
      expect(r.actorKind).toBe("human");
      expect(r.actorUserId).toBe(sales.id);
      expect(r.actorRole).toBe("sales");
      // LÚC NÀO — pha 2 đã điền, tức thao tác đã kết thúc (`AD-CR-8`).
      expect(r.completedAt).not.toBeNull();
      // QUYẾT GÌ — Cổng cho qua, lõi ghi thật, và giá trị MỚI mang đúng lối ra.
      expect(r.decision).toBe("allow");
      expect(r.denyReason).toBeNull();
      expect(r.outcome).toBe("ok");
      expect(r.valueAfter).toMatchObject({ status });
    }

    // ĐỐI CHỨNG `AD-4` bất biến ③ — dòng ghi vết KHÔNG BAO GIỜ khai một thao tác
    // chưa xảy ra. Quyết lại một Gợi ý đã quyết thì `where status='cho'` chạm 0
    // hàng, và vết mang `no_op` chứ không mang `ok`.
    //
    // ⚠ Từ vựng `outcome` được khẳng định ở đây (`ok` · `no_op`) là từ vựng của
    // MÃ NGUỒN — `AuditOutcome` ở `src/core/audit.ts` và cột `outcome` của lược
    // đồ. Spine tầng ⑤ (`AD-CR-8`) khai bốn giá trị KHÁC (`applied`,
    // `rule_rejected`, `no_row_affected`, `denied`). Hai bên đã lệch; phép kiểm
    // bám mã đang chạy, và chỗ lệch đã nêu trong báo cáo.
    const duyetLai = await reg.loadCapability("approveSuggestion", sales.actor);
    await duyetLai({ suggestionId: idBo, decisionSeconds: 1 });

    const sau = await auditRows(sales.id, "approveSuggestion");
    expect(sau.map((r) => r.outcome)).toEqual(["ok", "no_op"]);
    // Và trạng thái cũ không bị đè: người không ghi chồng lên một quyết định đã có.
    const row = await db.suggestion.findUniqueOrThrow({
      where: { id: idBo },
      select: { status: true, dropReason: true },
    });
    expect(row.status).toBe("bo");
    expect(row.dropReason).toBe("thong_tin_sai");
  });

  it("con số *sửa* KHÔNG bị cộng vào con số *duyệt*", async () => {
    // `FR-22` · `AD-9` — `metrics.ts` là NƠI DUY NHẤT định nghĩa chỉ số này, nên
    // khẳng định phải chạy trên chính nó, không trên một truy vấn tự chế.
    //
    // ⚠ Đo bằng DELTA. `autoAcceptRate` `count()` trên TOÀN bảng `suggestion`,
    // nên giá trị tuyệt đối phụ thuộc mọi tệp kiểm khác trong cùng lượt chạy.
    // Delta thì không, và nó phát biểu đúng điều `FR-22` nói.
    //
    // ⚠ Khẳng định trên TỬ SỐ và MẪU SỐ, KHÔNG trên `ratio`: `ratio` là `null`
    // khi mẫu số dưới `metrics_min_sample` (`AD-CR-5`), và `null` ở đây không
    // nói gì về việc *sửa* có bị cộng vào *duyệt* hay không.
    const doSau = await autoAcceptRate();
    expect(doSau.numerator - doTruoc.numerator).toBe(1);
    expect(doSau.denominator - doTruoc.denominator).toBe(3);

    // Vế phạm vi HẸP, xác định tuyệt đối: ba Gợi ý của Công ty này, ba trạng thái.
    const dem = async (status: "duyet" | "sua_roi_duyet" | "bo") =>
      db.suggestion.count({ where: { accountId, status } });
    expect(await dem("duyet")).toBe(1);
    expect(await dem("sua_roi_duyet")).toBe(1);
    expect(await dem("bo")).toBe(1);

    // ĐỐI CHỨNG: hai lối ra khác nhau ở CỘT `status`, không chỉ ở tên capability.
    // Gộp chúng thì hàng *sửa-rồi-duyệt* sẽ mang `status = 'duyet'`, và `metrics`
    // — vốn đếm tử số bằng đúng cột đó — cộng nó vào con số *duyệt*.
    const hangSua = await db.suggestion.findUniqueOrThrow({
      where: { id: idSuaRoiDuyet },
      select: { status: true },
    });
    expect(hangSua.status).not.toBe("duyet");
  });
});
