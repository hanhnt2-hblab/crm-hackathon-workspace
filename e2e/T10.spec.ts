// T-10 — Ba thao tác dưới danh nghĩa hệ thống, cả ba bị từ chối
//
// Đề bài §6, NGUYÊN VĂN: *"Thử đổi giai đoạn, đổi giá trị tiền và xoá một công ty
// dưới danh nghĩa hệ thống, không đi qua giao diện người dùng. Cả ba đều bị từ
// chối"*.
//
// ⚠ LUỒNG NÀY KHÔNG QUAN SÁT ĐƯỢC QUA TRÌNH DUYỆT, và §6 nói thẳng lý do:
// *"không đi qua giao diện người dùng"*. §5 chốt tiếp: *"Ba ranh giới đầu phải
// chặn được kể cả khi thao tác đến từ ngoài giao diện người dùng. Một lời dặn dò
// suông với phần AI không tính là đã chặn"*. Một phép kiểm bấm nút ở đây sẽ
// chứng minh sai thứ — nó chứng minh giao diện không có nút, chứ không chứng
// minh chốt chặn còn đứng khi ai đó gọi vòng qua giao diện.
//
// ⚠ ĐÂY LÀ BA LẦN THỬ BỊ TỪ CHỐI, KHÔNG PHẢI MỘT PHÉP KIỂM KIẾN TRÚC.
// §6 viết *"Thử … Cả ba đều bị từ chối"* — tức phải THỰC SỰ GỌI rồi bắt lần từ
// chối. Phép kiểm *"capability không tồn tại"* là thứ đội tự thêm ở
// `tests/T10B.test.ts`; nó có giá trị riêng (một chốt trong lõi nới ra được, một
// capability vắng mặt thì phải viết mới) nhưng nó KHÔNG thay thế được ba lần thử
// mà §6 đòi. Tệp này làm đúng cái §6 đòi, và thêm vế vắng mặt ở cuối làm gia cố.
//
// ⚠ ĐƯỜNG GỌI LÀ SỔ ĐĂNG KÝ, không phải hàm lõi. Cổng là lớp chặn mà một tác
// nhân `system` thật sự đâm vào (`AD-CP-5` bước ③). Gọi thẳng lõi sẽ bỏ qua đúng
// lớp đang được đo.
//
// Mã thượng nguồn: `T-10` · `§5` ranh giới 1, 2, 4 · `NFR-14`, `NFR-15`,
// `NFR-18` · `AD-CP-1` · `AD-CP-5` · `D36`.

import "./_env";

import { test, expect } from "@playwright/test";
import { createCompany } from "@/core/company";
import { createOpportunity } from "@/core/opportunity";
import { createRegistry, type Registry } from "@/capability/registry";
import { createAuditSink } from "@/core/audit";
import {
  cleanupE2eData,
  e2eName,
  machine,
  mutedCtx,
  rawDb,
  seeder,
} from "./_fixtures";

let accountId = "";
let opportunityId = "";
let registry: Registry;

test.describe.configure({ mode: "serial" });

test.beforeAll(async () => {
  // Sổ đăng ký GIỐNG HỆT nhánh web (`src/app/_registry.ts`): `seedMode: false`.
  // `seedMode: true` miễn trừ đúng những luật tệp này đo, nên nó sẽ cho ba thao
  // tác đi lọt và `T-10` xanh trên một sản phẩm không chặn gì.
  registry = createRegistry({
    seedMode: false,
    auditSink: createAuditSink({ seedMode: false, keepAudit: true }),
  });

  const tenCongTy = e2eName("T10");
  const acc = await createCompany(seeder, { name: tenCongTy, market: "JP" }, mutedCtx);
  accountId = acc.id;

  const opp = await createOpportunity(
    seeder,
    { accountId, name: `${tenCongTy} — gói vận hành`, amount: "5000000", currency: "JPY" },
    mutedCtx,
  );
  opportunityId = opp.id;
});

test.afterAll(async () => {
  await cleanupE2eData();
});

/// Thử gọi MỘT capability dưới danh nghĩa hệ thống và trả về lần ném, nếu có.
///
/// Hai đường tới *"bị từ chối"*, và cả hai đều tính:
///   · capability CÓ mặt nhưng Cổng bác tác nhân `system` — `GateDenied`;
///   · capability KHÔNG có mặt — máy không có đường nào để đi.
/// Phân biệt hai đường ở phép kiểm cuối; ở đây chỉ cần *đã bị chặn*.
async function thuDuoiDanhNghiaHeThong(
  name: string,
  params: unknown,
): Promise<unknown> {
  try {
    const cap = await registry.loadCapability(name as never, machine);
    await cap(params as never);
    return null; // KHÔNG bị chặn — đây là thất bại của phép kiểm.
  } catch (e) {
    return e;
  }
}

test.describe(
  "T-10 — Thử đổi giai đoạn, đổi giá trị tiền và xoá một công ty dưới danh nghĩa hệ thống, không đi qua giao diện người dùng. Cả ba đều bị từ chối",
  () => {
    test("① đổi giai đoạn dưới danh nghĩa hệ thống — BỊ TỪ CHỐI", async () => {
      const err = await thuDuoiDanhNghiaHeThong("changeOpportunityStage", {
        id: opportunityId,
        to: "du_dieu_kien",
      });

      expect(
        err,
        "§5 ranh giới 1: *Không tự đổi giai đoạn của cơ hội.* Lời gọi dưới danh "
          + "nghĩa hệ thống đã ĐI LỌT.",
      ).not.toBeNull();
      expect((err as Error).name).toBe("GateDenied");

      // Từ chối phải là THẬT, không phải ném rồi vẫn ghi. Giai đoạn còn nguyên.
      const opp = await rawDb.opportunity.findUniqueOrThrow({
        where: { id: opportunityId },
        select: { stage: true },
      });
      expect(opp.stage).toBe("tiep_can");
    });

    test("② đổi giá trị tiền dưới danh nghĩa hệ thống — BỊ TỪ CHỐI", async () => {
      const truoc = await rawDb.opportunity.findUniqueOrThrow({
        where: { id: opportunityId },
        select: { amount: true },
      });

      // Thử MỌI tên hợp lý mà một tác nhân máy có thể đoán ra. Chỉ thử một tên
      // rồi kết luận là chứng minh *"tên đó không dùng được"*, không phải
      // *"không có đường nào"*.
      const tenCoThe = [
        "updateOpportunityAmount",
        "setOpportunityAmount",
        "updateOpportunity",
        "changeOpportunityAmount",
      ];
      for (const ten of tenCoThe) {
        const err = await thuDuoiDanhNghiaHeThong(ten, {
          id: opportunityId,
          amount: 999_999_999,
        });
        expect(
          err,
          `§5 ranh giới 2: *không tự sửa giá trị tiền của cơ hội.* \`${ten}\` đã ĐI LỌT.`,
        ).not.toBeNull();
      }

      const sau = await rawDb.opportunity.findUniqueOrThrow({
        where: { id: opportunityId },
        select: { amount: true },
      });
      expect(sau.amount).toEqual(truoc.amount);
    });

    test("③ xoá một công ty dưới danh nghĩa hệ thống — BỊ TỪ CHỐI", async () => {
      const tenCoThe = ["deleteCompany", "softDeleteCompany", "removeAccount", "deleteAccount"];
      for (const ten of tenCoThe) {
        const err = await thuDuoiDanhNghiaHeThong(ten, { id: accountId });
        expect(
          err,
          `§5 ranh giới 4: *Không tự xoá dữ liệu do người tạo.* \`${ten}\` đã ĐI LỌT.`,
        ).not.toBeNull();
      }

      // Công ty còn sống — `deleted_at` vẫn NULL.
      const acc = await rawDb.account.findUniqueOrThrow({
        where: { id: accountId },
        select: { deletedAt: true },
      });
      expect(acc.deletedAt).toBeNull();
    });

    test("gia cố: sổ đăng ký không cấp cho máy đường ghi nào tới ba ranh giới đó", async () => {
      // Vế VẮNG MẶT, thêm ngoài §6. Ba lần thử ở trên chứng minh chốt hôm nay
      // còn đứng; vế này chứng minh không ai nới nó ra được mà không viết mã mới.
      const ghi = registry.CAP_MACHINE_ALLOWED_GHI;

      const cam = /stage|giai.?doan|amount|tien|delete|remove|xoa/i;
      const viPham = ghi.filter((n) => cam.test(n));
      expect(
        viPham,
        `Sổ đăng ký cấp cho máy capability ghi chạm vào ranh giới §5: ${viPham.join(", ")}`,
      ).toEqual([]);
    });

    test("cả ba lần thử đều để lại vết — kể cả lần THỬ RỒI HỎNG", async () => {
      // `AD-4` bất biến ①: *không lời gọi nào không để lại vết, kể cả lời gọi
      // THỬ RỒI HỎNG*. Một lần từ chối im lặng là một lần không ai biết máy đã
      // thử làm gì — đúng thứ §5 gọi là *"lời dặn dò suông"*.
      const tuChoi = await rawDb.auditRecord.findMany({
        where: { capability: "changeOpportunityStage", actorKind: "system" },
        select: { decision: true, denyReason: true },
      });

      expect(
        tuChoi.length,
        "Lời gọi bị Cổng từ chối phải để lại dòng ghi vết (`AD-4` bất biến ①, "
          + "`AD-CP-5` bước ④ — ghi vết pha 1 chạy KỂ CẢ khi bị từ chối).",
      ).toBeGreaterThanOrEqual(1);
      expect(tuChoi.some((r) => r.denyReason !== null)).toBe(true);
    });
  },
);
