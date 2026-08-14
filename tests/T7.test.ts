// T-7 — Hoàn tác một cú bấm
//
// Đề bài §6, nguyên văn: *"Bấm Hoàn tác ở T-6, một cú bấm, giá trị cũ trở lại
// đúng nguyên trạng. Có bản ghi cho cả lần tự đặt lẫn lần hoàn tác"*.
//
// **"Ở T-6"** nghĩa là cảnh nền phải là một Việc tiếp theo do MÁY tự đặt, nên
// tệp này tự dựng lại cảnh đó bằng `fillNextActionIfUnchanged` với tác nhân
// `system` — KHÔNG chờ `T-6` chạy. Hai tệp độc lập nhau: `T-6` chứng minh vòng
// quét sinh ra được cảnh ấy, tệp này chứng minh Hoàn tác gỡ được nó.
//
// **"Đúng nguyên trạng"** là chỗ dễ đọc nhầm nhất. Đường phổ biến nhất là ô VỐN
// TRỐNG — mức tự do chỉ cho máy điền ô trống (`AD-3` nhánh ⓐ, `D16`) — nên
// *nguyên trạng* ở đó nghĩa là **không có Việc tiếp theo**, không phải một chuỗi
// rỗng (`C5-15`).
//
// ⚠⚠ NÚT HOÀN TÁC CHƯA TỒN TẠI. Không tệp nào trong `src/app` gọi
// `undoSystemNextAction`, và không có bề mặt nào mang nút đó (`C1-10`). Nên câu
// §6 *"Bấm Hoàn tác ở T-6, một cú bấm"* KHÔNG thao tác tay được — đây là một
// phần chưa dựng, KHÔNG phải một giới hạn của `jsdom`. Dưới đây chứng minh được
// vế *một LỜI GỌI đủ đưa ô về nguyên trạng* và cửa sổ 7 ngày tồn tại trong DỮ
// LIỆU; **số lần bấm**, **cửa sổ 7 ngày hiện rõ trên màn hình** và **thông báo
// xác nhận** đều chưa có gì để kiểm.
//
// ⚠ HAI NHÁNH CHƯA PHỦ, cố ý đẩy xuống lớp kiểm dưới (`D36`: `T-n` là lớp
// NGOÀI, ca biên không trộn vào đây) — đã ghi `deferred-work.md`:
//   · hết cửa sổ 7 ngày → Hoàn tác phải trả `false` (`undo_deadline_at > now()`)
//   · người đã sửa tay (`set_by = 'nguoi'`) → Hoàn tác KHÔNG được ghi đè
//   · nhánh ⓒ của `AD-3` — máy đè ô người đặt đã quá hạn — cố ý KHÔNG mở cửa sổ
//     Hoàn tác, nên nút không xuất hiện ở đó
//
// `D36`: `T-n` là lớp NGOÀI. Cục sở hữu thân: ①. Mốc: M2.

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { db, dbIncludingDeleted } from "@/core/db";
import { createCompany } from "@/core/company";
import { createOpportunity } from "@/core/opportunity";
import { createSignal } from "@/core/signal";
import type { Registry } from "@/capability/registry";
import {
  auditRows, auditedRegistry, createArticle, createTestUser, dbNow, machine,
  mutedCtx, seeder, setSetting, type TestUser,
} from "./_helpers";

const BAI_VIET = "Tomahawk Systems bổ nhiệm giám đốc công nghệ mới từ tháng sau.";
const VIEC_MAY_DAT = "Liên hệ chúc mừng CTO mới và hỏi ưu tiên công nghệ";

/// `D14` · `0.2.2` — cửa sổ Hoàn tác, 7 ngày.
/// ⚠ Bản CHÉP TAY của `UNDO_WINDOW_DAYS` (`src/core/nextaction/index.ts`), vì
/// hằng đó không được xuất. Hai bản có thể trôi khỏi nhau; xuất nó ra là cách
/// sửa, và nó nằm ngoài phạm vi ghi của cục này.
const CUA_SO_NGAY = 7;
const MS_MOT_NGAY = 24 * 60 * 60 * 1000;

let reg: Registry;
let sales: TestUser;
let restoreAi: (() => Promise<void>) | undefined;
let accountId = "";
let opportunityId = "";
let signalId = "";
/// Mốc thời gian để lọc ghi vết của lời gọi MÁY. `audit_record` không mang
/// `account_id` (sổ đăng ký không truyền trường đó) và `actor_user_id` là `null`
/// với tác nhân `system` — nên không có khoá nào hẹp hơn.
///
/// ⚠ Mốc lấy từ ĐỒNG HỒ POSTGRES (`dbNow()`), không từ `new Date()`:
/// `audit_record.created_at` là `@default(now())` của container `db_test`, và
/// lệch đồng hồ host↔container vài giây là đủ để bộ lọc bỏ sót hàng.
/// `fileParallelism: false` bảo đảm không tệp nào khác ghi xen vào khoảng này.
///
/// Lời gọi Hoàn tác thì KHÔNG dùng mốc này: tác nhân là người, nên
/// `actor_user_id` có sẵn và là khoá hẹp, độc lập đồng hồ.
let moc = new Date(0);
let hanXoaMem: Date | null = null;

async function vetMayTu(capability: string) {
  return dbIncludingDeleted.auditRecord.findMany({
    where: { capability, createdAt: { gte: moc } },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    select: { outcome: true, decision: true, valueBefore: true, valueAfter: true },
  });
}

beforeAll(async () => {
  // Tệp này cần phần AI ĐANG BẬT: lời gọi tự đặt đi bằng tác nhân `system`, và
  // bước ⑦ của Cổng chặn nó khi `ai_enabled = false`. Đặt tường minh thay vì tin
  // vào thứ tự tệp — `T-1` và `T-9` đều ghi cùng khoá này.
  restoreAi = await setSetting("ai_enabled", "true");
  reg = auditedRegistry();
  sales = await createTestUser("t7");

  const acc = await createCompany(
    seeder,
    { name: `T-7 Co ${Date.now()}`, market: "JP" },
    mutedCtx,
  );
  accountId = acc.id;

  const opp = await createOpportunity(
    seeder,
    { accountId, name: "Cơ hội T-7", amount: "3000000.00", currency: "JPY" },
    mutedCtx,
  );
  opportunityId = opp.id;

  const article = await createArticle(accountId, BAI_VIET);
  const signal = await createSignal(
    seeder,
    {
      accountId,
      articleId: article.id,
      claim: "Công ty vừa bổ nhiệm CTO mới",
      quote: "bổ nhiệm giám đốc công nghệ mới",
      quoteStart: 0,
      quoteEnd: 0,
      signalType: "leadership",
      signalSubtype: null,
      confidence: "chac",
      relevance: "high",
      eventDate: null,
    },
    mutedCtx,
  );
  signalId = signal.id;

  moc = await dbNow();
});

afterAll(async () => {
  await restoreAi?.();
});

describe("T-7 — Hoàn tác một cú bấm", () => {
  it("bấm Hoàn tác ở `T-6`, MỘT cú bấm", async () => {
    // Cảnh của `T-6`: ô đang TRỐNG, máy tự đặt (`AD-3` nhánh ⓐ, `FR-34`).
    const tuDat = await reg.loadCapability("fillNextActionIfUnchanged", machine);
    const daGhi = (await tuDat({
      opportunityId,
      expectedContent: null,
      expectedDueDate: null,
      content: VIEC_MAY_DAT,
      // Tính từ HÔM NAY, không gõ một ngày cứng: một ngày cố định sẽ thành quá
      // hạn khi đồng hồ đi qua nó, và khi đó cờ `BR-B1` cùng nhánh ⓒ của `AD-3`
      // đổi nghĩa dưới chân phép kiểm.
      dueDate: new Date(Date.now() + 7 * MS_MOT_NGAY).toISOString().slice(0, 10),
      sourceSignalId: signalId,
    })) as boolean;
    expect(daGhi).toBe(true);

    const truoc = await db.nextAction.findFirstOrThrow({
      where: { opportunityId },
      select: { content: true, setBy: true, undoDeadlineAt: true, sourceSignalId: true },
    });
    // `C1-11` — ô mang DẤU HIỆU do hệ thống đặt; đó cũng là cờ quyền quyết định
    // Hoàn tác có được phép hay không: `C5-15` chốt ghi có điều kiện
    // `where set_by='he_thong' AND undo_deadline_at > now()`.
    //
    // ⚠ Tên capability được gọi ở đây là `fillNextActionIfUnchanged`, còn `AD-2`
    // và `AD-3` chỉ liệt `setNextAction` cho chạm ghi thứ hai của máy. Sổ đăng
    // ký hiện có CẢ HAI tên; spine và mã đã lệch, và chỗ lệch đã nêu trong báo cáo.
    expect(truoc.setBy).toBe("he_thong");
    expect(truoc.content).toBe(VIEC_MAY_DAT);
    expect(truoc.sourceSignalId).toBe(signalId);
    // `D14` — cửa sổ 7 ngày, tính từ lúc máy đặt. Giữa lúc ghi và lúc đọc chỉ
    // trôi vài giây, nên biên MỘT GIỜ là đủ rộng — và đủ hẹp để bắt một cửa sổ
    // 6 ngày. (Biên một NGÀY thì một cài đặt 6,5 ngày vẫn lọt.)
    const conLai = truoc.undoDeadlineAt!.getTime() - Date.now();
    expect(conLai).toBeGreaterThan(CUA_SO_NGAY * MS_MOT_NGAY - 60 * 60 * 1000);
    expect(conLai).toBeLessThanOrEqual(CUA_SO_NGAY * MS_MOT_NGAY);

    // MỘT cú bấm = MỘT lời gọi, không có bước xác nhận thứ hai và không có tham
    // số nào ngoài Cơ hội. Chữ ký `{ opportunityId }` là chỗ điều đó cưỡng chế được.
    const hoanTac = await reg.loadCapability("undoSystemNextAction", sales.actor);
    expect((await hoanTac({ opportunityId })) as boolean).toBe(true);
  });

  it("giá trị cũ trở lại đúng nguyên trạng", async () => {
    // `C5-15` — nguyên trạng của nhánh ⓐ là KHÔNG CÓ Việc tiếp theo.
    const song = await db.nextAction.findFirst({
      where: { opportunityId },
      select: { id: true, content: true },
    });
    expect(song).toBeNull();

    // Xoá MỀM, không xoá cứng (`D30`, `AD-14`): hàng còn đó làm dữ liệu đo.
    const moiHang = await dbIncludingDeleted.nextAction.findMany({
      where: { opportunityId },
      select: { deletedAt: true, setBy: true, content: true },
    });
    expect(moiHang).toHaveLength(1);
    expect(moiHang[0]!.deletedAt).not.toBeNull();
    expect(moiHang[0]!.content).toBe(VIEC_MAY_DAT);
    hanXoaMem = moiHang[0]!.deletedAt;

    // ĐỐI CHỨNG: *không có hàng còn sống* chứ KHÔNG PHẢI *hàng với nội dung
    // rỗng*. Hai thứ đó khác nhau trên màn hình — một cái là ô trống, cái kia là
    // một Việc tiếp theo không nội dung, và `BR-B1` treo cờ cho cái thứ hai.
    // Khẳng định trên chính hàng đã xoá mềm: nó là hàng DUY NHẤT tồn tại, và nội
    // dung của nó vẫn nguyên — tức Hoàn tác gỡ hàng, không rỗng hoá nó.
    const conSong = await dbIncludingDeleted.nextAction.count({
      where: { opportunityId, deletedAt: null },
    });
    expect(conSong).toBe(0);
  });

  it("có bản ghi cho CẢ lần tự đặt LẪN lần hoàn tác", async () => {
    // `T-7` (§6, nguyên văn) · `FR-33` — ghi vết cho CẢ lần tự đặt LẪN lần hoàn
    // tác. Hai lời gọi, hai capability, hai dòng — và hai TÁC NHÂN khác nhau, đó
    // là điểm của phép kiểm: một dòng nói máy đã đặt, dòng kia nói người đã gỡ.
    // (`D14` chỉ chốt cửa sổ 7 ngày; câu về ghi vết là của `T-7` và `FR-33`.)
    const vetTuDat = await vetMayTu("fillNextActionIfUnchanged");
    expect(vetTuDat).toHaveLength(1);
    expect(vetTuDat[0]!.decision).toBe("allow");
    expect(vetTuDat[0]!.outcome).toBe("ok");
    // `AD-4` bất biến ② — giá trị cũ và mới khi có ghi thật.
    expect(vetTuDat[0]!.valueBefore).toBeNull();
    expect(vetTuDat[0]!.valueAfter).toMatchObject({
      content: VIEC_MAY_DAT,
      setBy: "he_thong",
    });

    // Lọc theo NGƯỜI, không theo mốc thời gian: Hoàn tác chạy bằng `sales.actor`
    // nên `actor_user_id` có sẵn, và khoá đó không phụ thuộc đồng hồ nào.
    const vetHoanTac = await auditRows(sales.id, "undoSystemNextAction");
    expect(vetHoanTac).toHaveLength(1);
    expect(vetHoanTac[0]!.outcome).toBe("ok");
    // `FR-33` — ghi vết HAI CHIỀU: từ giá trị gì, VỀ giá trị gì. Ở đây *về*
    // là `null` tường minh, tức *không còn Việc tiếp theo nào*.
    expect(vetHoanTac[0]!.valueBefore).toMatchObject({ setBy: "he_thong" });
    expect(vetHoanTac[0]!.valueAfter).toBeNull();
  });

  it("bấm lần hai là no-op, không sinh dòng vết thứ hai", async () => {
    const hoanTac = await reg.loadCapability("undoSystemNextAction", sales.actor);
    expect((await hoanTac({ opportunityId })) as boolean).toBe(false);

    // Lần hai KHÔNG chạm dữ liệu: vẫn đúng một hàng, và `deleted_at` không đổi.
    // Đây là vế mạnh hơn *"không lỗi"* — một cài đặt đọc-rồi-ghi sẽ xoá mềm lại
    // và dời `deleted_at`, mà không phép kiểm nào chỉ nhìn *"không ném"* bắt được.
    const moiHang = await dbIncludingDeleted.nextAction.findMany({
      where: { opportunityId },
      select: { deletedAt: true },
    });
    expect(moiHang).toHaveLength(1);
    // Ghim tiền đề trước khi so: `hanXoaMem` do `it` liền trước gán, và nếu `it`
    // đó không chạy thì `undefined === undefined` sẽ xanh giả.
    expect(hanXoaMem).not.toBeNull();
    expect(moiHang[0]!.deletedAt!.getTime()).toBe(hanXoaMem!.getTime());

    // ⚠ ĐỌC KỸ CHỖ NÀY. `C5-15` viết *"không sinh hai dòng vết"*, nhưng `AD-4`
    // bất biến ① nói NGƯỢC LẠI và mạnh hơn: **mọi** lời gọi qua Cổng để lại một
    // dòng, kể cả lời gọi không làm gì. Hai câu không mâu thuẫn nếu đọc đúng
    // đại lượng: cái không được có hai là dòng khai một thao tác ĐÃ XẢY RA.
    // Nên phép kiểm khẳng định trên `outcome`, không trên số dòng.
    const vet = await auditRows(sales.id, "undoSystemNextAction");
    expect(vet.map((r) => r.outcome)).toEqual(["ok", "no_op"]);
    expect(vet.filter((r) => r.outcome === "ok")).toHaveLength(1);
  });
});
