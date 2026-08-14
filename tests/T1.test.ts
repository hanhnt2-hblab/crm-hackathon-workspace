// T-1 — Tắt AI, trọn nhóm 1 vẫn chạy
//
// Đề bài §6, nguyên văn: *"Tắt toàn bộ phần AI. Tạo được công ty, người liên hệ,
// cơ hội; kéo cơ hội qua ba giai đoạn, trong đó có Đủ điều kiện; bỏ qua hai ô
// dấu hiệu vẫn kéo được và cơ hội mang cờ cảnh báo; ghi hoạt động; tìm kiếm và
// lọc; mở màn hình tổng quan. Không chức năng nào của nhóm 1 hỏng"*.
//
// **"Tắt toàn bộ phần AI"** là tiền đề của CẢ TỆP, không phải một phép kiểm
// riêng: `beforeAll` đặt `settings.ai_enabled = 'false'` và `afterAll` trả lại
// giá trị cũ. Mọi khẳng định dưới đây chạy trong trạng thái đó (`C1-15`, `T-9`).
//
// **Đường gọi là `loadCapability`**, không phải hàm lõi: `T-1` kiểm *"chức năng
// của nhóm 1"*, tức đường mà một cú bấm thật đi qua — Cổng bảy bước cộng lõi
// (`AD-19`, `AD-UI-5`). Gọi thẳng lõi ở đây sẽ xanh kể cả khi Cổng chặn oan
// người dùng, và khi đó nó chứng minh sai thứ.
//
// ⚠⚠ PHẦN CHỈ KIỂM ĐƯỢC BẰNG TAY. Bộ kiểm chạy `environment: jsdom`, KHÔNG có
// trình duyệt thật, và `currentSession()` gọi `cookies()` của `next/headers` nên
// server action không gọi được ngoài một lượt yêu cầu Next. Nên tệp này dừng ở
// tầng capability + dữ liệu, và BA thứ dưới đây vẫn phải thử tay trước khi nộp:
//   · **kéo-thả thật** giữa bảy cột `S4` (`FR-4`, `C1-2`) — ở đây chỉ chứng minh
//     được *lời gọi mà một cú thả sinh ra* thành công, không chứng minh được cú
//     thả. Một khẳng định DOM cũng KHÔNG chứng minh được, nên tệp này không có.
//   · **hộp hỏi hai dấu hiệu** bật ngay khi thả vào Đủ điều kiện (`C1-3`).
//   · **cờ cảnh báo nhìn thấy được trên thẻ** (`C1-3`) — dưới đây chỉ khẳng định
//     mã cờ `BR-B2` có trong dữ liệu mà thẻ nhận.
//
// `D36`: `T-n` là lớp NGOÀI. Cục sở hữu thân: ①. Mốc: M2.

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { db } from "@/core/db";
import { needsQualificationFlag } from "@/core/opportunity";
import type { Stage } from "@/core/opportunity/stage";
import type { Registry } from "@/capability/registry";
import {
  createTestUser, machine, mutedRegistry, setSetting, type TestUser,
} from "./_helpers";

/// Nhãn duy nhất cho lượt chạy. `searchAccounts` tìm trên TOÀN bảng, và `T-10a`
/// gieo một Công ty tên *"T-10a Co"* — chuỗi đó chứa `T-1`, nên một từ khoá cố
/// định sẽ kéo theo dữ liệu của tệp khác và phép kiểm lọc mất tính xác định.
const NHAN = `T1-${Date.now()}`;

type Card = {
  id: string; stage: string; flags: string[];
  needSignal: boolean | null; budgetSignal: boolean | null;
};

let reg: Registry;
let sales: TestUser;
let restoreAi: (() => Promise<void>) | undefined;

let accountId = "";
let otherAccountId = "";
let opportunityId = "";

async function card(id: string): Promise<Card> {
  const read = await reg.loadCapability("readPipelineBoard", sales.actor);
  const cards = (await read({ accountId: null })) as Card[];
  const found = cards.find((c) => c.id === id);
  if (!found) throw new Error(`Không thấy thẻ ${id} trên bảng Giai đoạn.`);
  return found;
}

beforeAll(async () => {
  // `C3-5` · `T-9` — `ai_enabled` là NƠI DUY NHẤT lưu trạng thái nút Tắt AI.
  restoreAi = await setSetting("ai_enabled", "false");
  reg = mutedRegistry();
  sales = await createTestUser("t1");
});

afterAll(async () => {
  // Bộ kiểm tự dọn thứ nó đổi. Bảng `settings` sống qua cả lượt chạy, và `T-9`
  // đọc cùng khoá này — để lại `false` là làm đỏ một tệp của cục khác.
  //
  // `?.()` chứ không `()`: `setSetting` ném trong `beforeAll` thì `restoreAi`
  // còn `undefined`, và một `TypeError` ở đây sẽ che mất nguyên nhân thật.
  await restoreAi?.();
});

describe("T-1 — Tắt AI, trọn nhóm 1 vẫn chạy", () => {
  it("tạo được Công ty, Người liên hệ, Cơ hội", async () => {
    // `FR-1` `FR-2` `FR-3` · `C1-1` — ba lời gọi, ba capability (`AD-UI-6`).
    const taoCongTy = await reg.loadCapability("createCompany", sales.actor);
    const acc = (await taoCongTy({
      name: `${NHAN} Kéo Thả`,
      market: "JP",
      industry: "phan_mem",
      accountType: "it_solution",
      country: "JP",
    })) as { id: string };
    accountId = acc.id;

    const khac = (await taoCongTy({
      name: `${NHAN} Khác`,
      market: "KR",
      industry: "san_xuat",
    })) as { id: string };
    otherAccountId = khac.id;

    const taoNguoi = await reg.loadCapability("createContact", sales.actor);
    const contact = (await taoNguoi({
      accountId, name: "Nguyễn Đầu Mối", title: "CTO", isPrimary: true,
    })) as { id: string };

    const taoCoHoi = await reg.loadCapability("createOpportunity", sales.actor);
    const opp = (await taoCoHoi({
      accountId, name: `${NHAN} Cơ hội`, amount: "5000000.00", currency: "JPY",
    })) as { id: string };
    opportunityId = opp.id;

    // Lớp ② — DỮ LIỆU trong CSDL sau đó.
    const [accRow, contactRow, oppRow, timeline] = await Promise.all([
      db.account.findUniqueOrThrow({
        where: { id: accountId },
        select: { name: true, market: true, accountType: true },
      }),
      db.contact.findUniqueOrThrow({
        where: { id: contact.id },
        select: { accountId: true, isPrimary: true },
      }),
      db.opportunity.findUniqueOrThrow({
        where: { id: opportunityId },
        select: { accountId: true, stage: true, amount: true, currency: true },
      }),
      // `C5-6` — hàng `timeline` sinh CÙNG giao dịch với Công ty (quan hệ 1-1
      // bắt buộc). Thiếu nó thì mọi lần thêm mục sau này ăn lỗi khoá ngoại,
      // đúng đường `T-8`.
      db.timeline.findUnique({ where: { accountId }, select: { id: true } }),
    ]);
    expect(accRow.name).toBe(`${NHAN} Kéo Thả`);
    expect(accRow.accountType).toBe("it_solution");
    expect(contactRow.accountId).toBe(accountId);
    expect(contactRow.isPrimary).toBe(true);
    expect(oppRow.accountId).toBe(accountId);
    // `D44` — Cơ hội mới LUÔN vào `tiep_can`; hàm tạo không nhận tham số giai đoạn.
    expect(oppRow.stage).toBe("tiep_can");
    expect(String(oppRow.amount)).toBe("5000000");
    expect(oppRow.currency).toBe("JPY");
    expect(timeline).not.toBeNull();

    // Lớp ③ — ĐỐI CHỨNG: người tạo được, MÁY thì không. Từ chối rơi ở bước ③
    // của Cổng, tức ngay lúc `loadCapability`, không phải lúc gọi.
    //
    // ⚠ Mã đúng là `AD-2`, KHÔNG phải §5. Bốn ranh giới §5 của đề bài là *đổi
    // giai đoạn* · *Thắng/Thua và tiền* · *liên hệ khách* · *xoá dữ liệu người
    // tạo* — không dòng nào cấm máy TẠO Công ty. Chỗ cấm là tập đóng của `AD-2`:
    // `createCompany` vắng mặt trong khối máy-được-ghi, và `caps/account.ts`
    // khai `allowedActors: ["human","seed"]`.
    await expect(
      reg.loadCapability("createCompany", machine),
    ).rejects.toMatchObject({ name: "GateDenied", reason: "actor_not_allowed" });
  });

  it("kéo Cơ hội qua ba giai đoạn, trong đó có Đủ điều kiện", async () => {
    // `FR-4` · `C1-2` — BA lần đổi, và `du_dieu_kien` nằm giữa. Đây là lời gọi
    // mà một cú thả sinh ra; cú thả nằm ngoài tầm của `jsdom` (xem đầu tệp).
    const keo = await reg.loadCapability("changeOpportunityStage", sales.actor);
    await keo({ id: opportunityId, to: "du_dieu_kien" });
    await keo({ id: opportunityId, to: "soan_de_xuat" });
    await keo({ id: opportunityId, to: "thuong_luong" });

    const row = await db.opportunity.findUniqueOrThrow({
      where: { id: opportunityId },
      select: { stage: true, latestOpenStage: true },
    });
    expect(row.stage).toBe("thuong_luong");
    // `AD-CR-11` bất biến hai chiều: đang chạy ⇒ cột này `null`.
    expect(row.latestOpenStage).toBeNull();

    // `C5-4` — mỗi lần đổi THẬT sinh ĐÚNG MỘT mục Dòng thời gian. Đếm phạm vi
    // hẹp theo Công ty này, không đếm toàn bảng.
    const doc = await reg.loadCapability("readAccountTimeline", sales.actor);
    const entries = (await doc({ accountId })) as Array<{ content: string }>;
    const mucGiaiDoan = entries.filter((e) => e.content.startsWith("Giai đoạn:"));
    expect(mucGiaiDoan).toHaveLength(3);
    expect(mucGiaiDoan.map((e) => e.content)).toContain(
      "Giai đoạn: tiep_can → du_dieu_kien",
    );

    // ĐỐI CHỨNG `NFR-14`: máy không đổi được Giai đoạn, dù ở cặp hợp lệ với người.
    await expect(
      reg.loadCapability("changeOpportunityStage", machine),
    ).rejects.toMatchObject({ name: "GateDenied", reason: "actor_not_allowed" });
  });

  it("bỏ qua hai ô dấu hiệu vẫn kéo được, và Cơ hội mang cờ cảnh báo", async () => {
    // `BR-B2` — chưa một lời gọi `setQualificationSignals` nào chạy, mà thẻ đã
    // đi qua `du_dieu_kien` và đang ở `thuong_luong`. Đó là vế *"vẫn kéo được"*.
    const truoc = await db.opportunity.findUniqueOrThrow({
      where: { id: opportunityId },
      select: { stage: true, needSignal: true, budgetSignal: true },
    });
    expect(truoc.stage).toBe("thuong_luong");
    expect(truoc.needSignal).toBeNull();
    expect(truoc.budgetSignal).toBeNull();

    // `C5-5` — cờ tính theo GIAI ĐOẠN HIỆN TẠI ≥ `du_dieu_kien`, không theo sự
    // kiện *vừa sang*: thẻ này nhảy qua `du_dieu_kien` rồi đi tiếp, và vẫn phải
    // mang cờ.
    //
    // ⚠⚠ `BR-B2` HIỆN CÓ HAI CÀI ĐẶT, VÀ CHÚNG KHÔNG BẰNG NHAU. Phép kiểm này
    // cố ý chỉ chạy hai đầu vào mà cả hai đồng ý (`null,null` và `true,true`) —
    // xem báo cáo, đây là lỗi mã sản phẩm chứ không phải chỗ nới khẳng định:
    //   · `needsQualificationFlag` (`src/core/opportunity/index.ts`) — cờ khi
    //     một ô là `null`; dải giai đoạn dừng ở `thuong_luong`; KHÔNG có bên gọi
    //     nào trong sản phẩm.
    //   · `toOpportunityCard` (`src/capability/caps/ui.ts`) — cờ khi một ô
    //     `!== true`; dải giai đoạn gồm cả `thang`/`thua`. Đây mới là thứ hiện
    //     trên màn hình.
    // Hai bên trả NGƯỢC nhau khi người trả lời *không* (`false`) và trên Cơ hội
    // đã đóng. Ràng cứng ca đó ở đây là làm `T-1` đỏ vì một mâu thuẫn thượng
    // nguồn chưa ai xử — nên nó nằm ở `deferred-work.md` và ở báo cáo.
    expect(
      needsQualificationFlag({
        stage: truoc.stage as Stage,
        needSignal: truoc.needSignal,
        budgetSignal: truoc.budgetSignal,
      }),
    ).toBe(true);
    // Và cờ đó phải có mặt trong DỮ LIỆU mà thẻ `S4` nhận. (Việc nó hiện thành
    // một dấu nhìn thấy được trên thẻ là phần thử tay — xem đầu tệp.)
    expect((await card(opportunityId)).flags).toContain("BR-B2");

    // ĐỐI CHỨNG: trả lời CẢ HAI ô thì cờ tắt — cờ nói về hai ô còn trống, không
    // nói về giai đoạn. Trả lời xong đặt lại `null` để trạng thái tệp không đổi.
    const ghi = await reg.loadCapability("setQualificationSignals", sales.actor);
    try {
      await ghi({ id: opportunityId, needSignal: true, budgetSignal: true });
      expect((await card(opportunityId)).flags).not.toContain("BR-B2");
    } finally {
      // `finally` chứ không phải dòng kế tiếp: khẳng định trên hỏng thì Cơ hội
      // đọng lại ở `true/true`, và `it` *"mở được màn hình tổng quan"* sẽ đỏ vì
      // một lý do không phải của nó.
      await ghi({ id: opportunityId, needSignal: null, budgetSignal: null });
    }
    expect((await card(opportunityId)).flags).toContain("BR-B2");
  });

  it("ghi được Hoạt động", async () => {
    // `FR-6` · `C5-6` — Hoạt động VÀ mục Dòng thời gian của nó, cùng giao dịch.
    // (Bề mặt xem Dòng thời gian là `C1-5`, không phải `C1-1` vốn nói về màn
    // hình Công ty và Người liên hệ.)
    const ghi = await reg.loadCapability("createActivity", sales.actor);
    const act = (await ghi({
      accountId,
      type: "goi",
      description: "Gọi hỏi ngân sách quý sau",
      occurredAt: new Date("2026-08-13T02:00:00.000Z").toISOString(),
    })) as { id: string };

    const row = await db.activity.findUniqueOrThrow({
      where: { id: act.id },
      select: { accountId: true, type: true, description: true },
    });
    expect(row.accountId).toBe(accountId);
    expect(row.type).toBe("goi");

    const doc = await reg.loadCapability("readAccountTimeline", sales.actor);
    const entries = (await doc({ accountId })) as Array<{ content: string; addedBy: string }>;
    const muc = entries.find((e) => e.content === "Gọi: Gọi hỏi ngân sách quý sau");
    expect(muc).toBeDefined();
    // `C1-5` — mục do NGƯỜI ghi mang nhãn `nguoi`, phân biệt được với `he_thong`.
    expect(muc?.addedBy).toBe("nguoi");

    // ĐỐI CHỨNG `C5-6` (`FR-6`): Người liên hệ chỉ chọn được TRONG phạm vi Công ty đó.
    // Khoá ngoại chỉ biết người ấy CÓ TỒN TẠI; luật phạm vi do lõi canh.
    const taoNguoi = await reg.loadCapability("createContact", sales.actor);
    const nguoiCongTyKhac = (await taoNguoi({
      accountId: otherAccountId, name: "Người của Công ty khác",
    })) as { id: string };
    await expect(
      ghi({
        accountId,
        contactId: nguoiCongTyKhac.id,
        type: "gap",
        occurredAt: new Date().toISOString(),
      }),
    ).rejects.toThrowError(/không thuộc Công ty/);
  });

  it("tìm kiếm và lọc chạy, các bộ lọc kết hợp được", async () => {
    // `E1-S10` · `C1-6` — bộ lọc phải KẾT HỢP được, không phải chạy lần lượt.
    const tim = await reg.loadCapability("searchAccounts", sales.actor);
    type KetQua = { rows: Array<{ id: string; name: string }> };

    const chiTuKhoa = (await tim({ text: NHAN })) as KetQua;
    expect(chiTuKhoa.rows.map((r) => r.id).sort()).toEqual(
      [accountId, otherAccountId].sort(),
    );

    const ketHop = (await tim({
      text: NHAN, industry: "phan_mem", market: "JP",
    })) as KetQua;
    expect(ketHop.rows).toHaveLength(1);
    expect(ketHop.rows[0]?.id).toBe(accountId);

    // ĐỐI CHỨNG — hai bộ lọc mà MỖI CÁI đều khớp một Công ty, nhưng KẾT HỢP thì
    // không khớp cái nào. Thiếu vế này thì một cài đặt `OR` cũng xanh.
    const giaoRong = (await tim({
      text: NHAN, industry: "san_xuat", market: "JP",
    })) as KetQua;
    expect(giaoRong.rows).toHaveLength(0);
  });

  it("mở được màn hình tổng quan", async () => {
    // `C1-7` · `E1-S11` — bàn làm việc của Sales. KHÁC bảng số đo `S8` của Quản
    // trị (`AD-UI-10`), và mục này cố ý không có ngưỡng vai nào.
    const doc = await reg.loadCapability("readOverview", sales.actor);
    const tongQuan = (await doc({})) as {
      accountCount: number; contactCount: number; opportunityCount: number;
      byStage: Record<string, number>;
      flagged: Array<{ id: string; flags: string[] }>;
      recentEntries: Array<{
        id: string; content: string; occurredAt: string; addedBy: string;
        accountId: string; accountName: string;
      }>;
    };

    // Số đếm là TOÀN CỤC (các tệp kiểm khác cũng gieo dữ liệu), nên khẳng định
    // *ít nhất*; phần XÁC ĐỊNH nằm ở hai vế phạm vi hẹp bên dưới.
    expect(tongQuan.accountCount).toBeGreaterThanOrEqual(2);
    expect(tongQuan.opportunityCount).toBeGreaterThanOrEqual(1);
    expect(tongQuan.byStage.thuong_luong ?? 0).toBeGreaterThanOrEqual(1);

    // ⚠ HAI TRƯỜNG DƯỚI ĐÂY KHÔNG TRỎ VỀ MÃ THƯỢNG NGUỒN NÀO — nêu ra thay vì
    // trích bừa. `FR-10`/`C1-7`/`E1-S11` khai đúng BỐN khối của màn tổng quan
    // (Công ty theo ngành · Cơ hội và tổng giá trị theo giai đoạn · Việc tiếp
    // theo quá hạn · thống kê lý do thua). `flagged` và `recentEntries` là hai
    // trường `readOverviewCap` tự thêm; chúng hoặc thiếu một yêu cầu ở thượng
    // nguồn, hoặc là phạm vi thừa. Khẳng định ở đây chỉ ghim HỢP ĐỒNG hiện có
    // để một lần đổi hình dạng không đi qua im lặng.
    expect(tongQuan.flagged.map((c) => c.id)).toContain(opportunityId);
    // `recentEntries` lấy 8 mục mới nhất TOÀN CỤC, nên không ghim được nội dung;
    // ghim HÌNH DẠNG. `Array.isArray` một mình thì một lần trả `[]` cũng xanh.
    expect(tongQuan.recentEntries.length).toBeGreaterThan(0);
    expect(tongQuan.recentEntries.length).toBeLessThanOrEqual(8);
    for (const muc of tongQuan.recentEntries) {
      expect(Object.keys(muc).sort()).toEqual(
        ["accountId", "accountName", "addedBy", "content", "id", "occurredAt"],
      );
      expect(typeof muc.accountName).toBe("string");
    }
  });

  it("không chức năng nào của nhóm 1 hỏng", async () => {
    // Tiền đề của cả tệp còn đúng: phần AI ĐANG TẮT trong suốt các phép kiểm
    // trên. Nếu không, sáu vế trước chứng minh nhóm 1 chạy *khi AI bật*, tức
    // chứng minh sai thứ (`C1-15`).
    const docCoAi = await reg.loadCapability("readAiEnabled", sales.actor);
    expect((await docCoAi({})) as { aiEnabled: boolean }).toEqual({ aiEnabled: false });

    // Năm bề mặt của nhóm 1 gọi lại một lượt, sau khi mọi thao tác ghi đã chạy.
    // `C1-15` — *"không thiếu chức năng, không lỗi màn hình"*.
    const doc = async (ten: string, p: unknown) =>
      (await reg.loadCapability(ten, sales.actor))(p);
    await expect(doc("searchAccounts", { text: NHAN })).resolves.toBeDefined();
    await expect(doc("readAccountTimeline", { accountId })).resolves.toBeDefined();
    await expect(doc("readPipelineBoard", { accountId })).resolves.toBeDefined();
    await expect(doc("readOverview", {})).resolves.toBeDefined();

    // ⚠ `readAccountDetail` KHÔNG dùng `toBeDefined()`: `toBeDefined` chỉ bác
    // `undefined`, mà mục này trả `null` khi không tìm thấy — và `S3` biến `null`
    // thành `notFound()`, tức toàn bộ màn hình hồ sơ 404. Một vế lỏng ở đây làm
    // *"không chức năng nào của nhóm 1 hỏng"* xanh trên một màn hình đã chết.
    const hoSo = (await doc("readAccountDetail", { accountId })) as {
      account: { id: string };
      contacts: Array<{ id: string; isPrimary: boolean }>;
      opportunities: Array<{ id: string }>;
    } | null;
    expect(hoSo).not.toBeNull();
    expect(hoSo!.account.id).toBe(accountId);
    expect(hoSo!.contacts.some((c) => c.isPrimary)).toBe(true);
    expect(hoSo!.opportunities.map((o) => o.id)).toContain(opportunityId);

    // ĐỐI CHỨNG: *"tắt AI"* KHÔNG có nghĩa là tắt hệ thống. Cùng lúc nhóm 1 chạy
    // đủ cho người, đường của MÁY vẫn bị chặn ở bước ⑦ của Cổng (`brake`) — và
    // đó là hai chuyện khác nhau mà một phép kiểm chỉ nhìn người sẽ trộn lẫn.
    //
    // Ghim tiền đề trước khi khẳng định MÃ lý do: bước ⑥ (`limit`) chạy TRƯỚC ⑦,
    // và nó đọc hàng `ScanLog` đang mở. Một vòng quét còn treo với `model_calls_
    // used` chạm trần sẽ trả `limit` — đúng là bị chặn, nhưng vì lý do khác.
    expect(await db.scanLog.count({ where: { finishedAt: null } })).toBe(0);
    await expect(
      reg.loadCapability("appendTimelineEntry", machine),
    ).rejects.toMatchObject({ name: "GateDenied", reason: "brake" });
  });
});
