// `C5-1` · `E1-S1` · `FR-1` — Công ty.
//
// Xoá là XOÁ MỀM và cascade (`D26`). Cascade nêu đích danh ở `softDeleteCompany`;
// Phát hiện và Dòng thời gian **giữ nguyên** — chúng là bằng chứng.

import type { Actor } from "@/core/actor";
/// `AD-CR-7`: lõi TỰ mở giao dịch, nên không nhận `tx` từ ngoài.
/// `db` (bản đã `$extends`) chỉ dùng cho đường ĐỌC — `searchCompanies` không
/// ghi gì, và mở một giao dịch cho một lượt đọc là trả giá mà không mua gì.
import { db, tx } from "@/core/db";
import type { CoreContext } from "@/core/context";
import { isHuman } from "@/core/actor";
import { BusinessRuleError } from "@/core/errors";

const BT = "`";

/// ⚠ `industry` và `accountType` là TUỲ CHỌN, dù `E1-S1` gọi chúng là bắt buộc.
/// Lược đồ để cả hai nullable, và đó là chủ đích: cả hai nằm trong `TargetField`
/// — tức Gợi ý sinh ra chính để **điền chúng khi trống**. Bắt buộc lúc tạo thì
/// hai ô đích đó không bao giờ trống, và một nhánh Gợi ý chết theo.
///
/// Giao diện vẫn được đòi chúng (`E1-S1`); ràng buộc đó thuộc bề mặt, không
/// thuộc lõi. Lõi để trống được vì bộ gieo và `src/ingest` cần thế.
export type CreateCompanyInput = {
  name: string;
  market: "JP" | "Global" | "KR";
  industry?: string | null;
  /// Năm giá trị của `enum AccountType`, khớp `0.1.1`. Xem `ACCOUNT_TYPES` cuối
  /// tệp về chỗ lệch đã đóng.
  accountType?:
    | "traditional" | "it_solution" | "it_product" | "tech_based" | "ito_other"
    | null;
  country?: string | null;
  website?: string | null;
  /// ⚠ BỐN Ô DƯỚI ĐÂY LÀ PHẦN CÒN THIẾU CỦA `TargetField`.
  ///
  /// `deferred-work.md` nêu *"`updateCompany` chỉ với tới 4/8 `TargetField` —
  /// duyệt Gợi ý cho `revenue_range` không có đường ghi"*. `enum TargetField`
  /// có TÁM giá trị; kiểu này trước đây khai bốn (`industry`, `accountType`,
  /// `country`, `website`), nên `Partial<CreateCompanyInput>` của `updateCompany`
  /// cũng chỉ với tới bốn. Bốn ô còn lại có cột thật trên `account` từ đầu.
  specialtyArea?: string | null;
  revenueRange?: string | null;
  dealValueTier?: string | null;
  foundedYear?: number | null;
  /// Khoá tự nhiên của bộ gieo và `src/ingest` (`AD-UI-17`). Có nó thì gieo hai
  /// lần không nhân đôi dữ liệu; thiếu nó thì `npm run seed` lần hai làm
  /// **`NFR-8`** đỏ — `AD-UI-17` nói thẳng câu đó. (Bản trước viết `T-8`; sai.)
  sourceRef?: string | null;
};

/// Tạo Công ty VÀ hàng `timeline` của nó, trong CÙNG giao dịch.
///
/// `Timeline` là quan hệ 1-1 **bắt buộc** với `Account`. Tách hai bước thì có
/// một khoảnh khắc Công ty tồn tại mà chưa có Dòng thời gian — và bước tiếp theo
/// (`appendTimelineEntry`) ăn lỗi khoá ngoại. Đó đúng là đường `T-8` đi qua khi
/// máy thêm mục vào một Công ty vừa gieo.
export async function createCompany(
  actor: Actor,
  input: CreateCompanyInput,
  ctx: CoreContext,
): Promise<{ id: string }> {
  return tx(async (t) => {
    const account = await t.account.create({
    data: {
      name: input.name,
      market: input.market,
      industry: input.industry ?? null,
      accountType: input.accountType ?? null,
      country: input.country ?? null,
      website: input.website ?? null,
      specialtyArea: input.specialtyArea ?? null,
      revenueRange: input.revenueRange ?? null,
      dealValueTier: input.dealValueTier ?? null,
      foundedYear: input.foundedYear ?? null,
      sourceRef: input.sourceRef ?? null,
      timeline: { create: {} },
    },
      select: { id: true },
    });
    // `AD-CR-7` bước ⑥ — hoàn tất ghi vết TRONG giao dịch, sau khi ghi chính
    // đã xong. Sink câm tự bỏ qua khi `auditId` là `null` (`AD-CR-8`), nên ở
    // đây KHÔNG rẽ nhánh theo chế-độ-gieo.
    await ctx.audit.complete(t, ctx.auditId, "ok", { after: { id: account.id } });
    return { id: account.id };
  });
}

/// `C5-1` · `FR-1` — sửa hồ sơ Công ty. Với tới **cả tám** ô `TargetField`.
///
/// Tám ô, không phải bốn, và con số đó không phải thẩm mỹ: `enum TargetField`
/// có tám giá trị, mỗi giá trị là một ô mà một Gợi ý được duyệt sẽ ghi vào. Bốn
/// ô thiếu (`specialty_area`, `revenue_range`, `deal_value_tier`,
/// `founded_year`) là dòng `deferred-work.md` nêu.
///
/// ⚠ Đường GỢI Ý ĐƯỢC DUYỆT đã đủ tám ô từ trước — `TARGET_COLUMN` và
/// `applyToAccount` của `src/core/suggestion`. Cái đóng ở đây là đường NGƯỜI GÕ
/// TAY, vốn mới với tới bốn. Nói *"đóng khoảng trống Gợi ý"* là nói quá.
///
/// ⚠ ĐÂY KHÔNG PHẢI đường ghi của Gợi ý được duyệt. Đường đó nằm ở
/// `src/core/suggestion`, và nó KHÔNG gọi hàm này — `AD-CR-7` đặt giao dịch
/// TRONG lõi, nên gọi từ đó là mở một giao dịch LỒNG, và lồng giao dịch trên
/// ITX client là `TypeError` lúc chạy. Hàm này là đường NGƯỜI GÕ TAY.
///
/// ⚠ KHÔNG chặn theo `actor.kind`: `§5` liệt BỐN ranh giới — `NFR-14` Giai
/// đoạn, `NFR-15` tiền, `NFR-16` không tự liên hệ khách, `NFR-17` xoá — cộng
/// `NFR-19` là ranh giới **thứ năm đội tự thêm** (`D46`, PRD §10.1 ghi *"mở
/// rộng ngoài đề bài"*). **Sửa ô hồ sơ không nằm trong năm cái nào** — trái
/// lại, đó chính là thứ máy được đề nghị và người duyệt. Bịa một mã để chặn ở
/// đây là dựng nguồn sự thật thứ hai.
///
/// ⚠ `sourceRef` CỐ Ý ĐỨNG NGOÀI patch dù `Partial<CreateCompanyInput>` cho
/// phép gõ ra nó. Nó là khoá tự nhiên `@unique` của bộ gieo (`AD-UI-17`); đổi nó
/// làm `npm run seed` lần hai chèn thêm một Công ty thay vì cập nhật, và
/// `AD-UI-17` nói thẳng hậu quả: **`NFR-8` đỏ ở lần chạy thứ hai**. Một ô chỉ
/// ghi lúc TẠO.
///
/// ⚠ Kiểu KHÔNG chặn được điều đó — `{ sourceRef: "x" }` một mình vẫn gõ ra
/// được và cho ra một dòng ghi vết `no_op` không phân biệt với *"không gửi gì"*.
/// Sửa đúng là một kiểu patch riêng `Omit<CreateCompanyInput, "sourceRef">`,
/// nhưng `Partial<CreateCompanyInput>` là chữ ký ĐÃ ĐÓNG BĂNG của Cục 0. Khoản
/// NỢ đã báo.
///
/// ⚠ `market` thì ghi được, và đây là chỗ phải nói rõ: nó KHÔNG phải một ô
/// `TargetField` (`enum TargetField` không có `market`), nó là đầu vào lịch ngày
/// làm việc của `BR-D7`. Đổi thị trường là đổi mọi hạn tính về sau. Người gõ tay
/// được đổi; máy không, vì mục sổ đăng ký của Gợi ý chỉ khai tám ô `TargetField`.
export async function updateCompany(
  _actor: Actor,
  id: string,
  patch: Partial<CreateCompanyInput>,
  ctx: CoreContext,
): Promise<void> {
  await tx(async (t) => {
    const before = await t.account.findUnique({
      where: { id },
      select: {
        name: true, market: true, industry: true, accountType: true,
        country: true, website: true, specialtyArea: true, revenueRange: true,
        dealValueTier: true, foundedYear: true,
      },
    });
    // ⚠ `Error` thường, KHÔNG phải `BusinessRuleError` — xem `softDeleteCompany`.
    if (!before) throw new Error("Công ty không tồn tại.");

    // `undefined` = *"không đụng tới"*, `null` = *"xoá trắng ô này"*. Hai thứ
    // khác nhau, và gộp chúng làm một Gợi ý *"xoá ô sai"* không có đường diễn
    // đạt. Vì thế mọi vế đều so `!== undefined`, không dùng `??`.
    const data = {
      ...(patch.name !== undefined ? { name: patch.name } : {}),
      ...(patch.market !== undefined ? { market: patch.market } : {}),
      ...(patch.industry !== undefined ? { industry: patch.industry } : {}),
      ...(patch.accountType !== undefined ? { accountType: patch.accountType } : {}),
      ...(patch.country !== undefined ? { country: patch.country } : {}),
      ...(patch.website !== undefined ? { website: patch.website } : {}),
      ...(patch.specialtyArea !== undefined ? { specialtyArea: patch.specialtyArea } : {}),
      ...(patch.revenueRange !== undefined ? { revenueRange: patch.revenueRange } : {}),
      ...(patch.dealValueTier !== undefined ? { dealValueTier: patch.dealValueTier } : {}),
      ...(patch.foundedYear !== undefined ? { foundedYear: patch.foundedYear } : {}),
    };

    // `AD-CR-8` — patch rỗng là một KẾT CỤC, không phải một khoảng trống. Ghi
    // `ok` cho nó là khai một thao tác chưa xảy ra, và ghi thật thì `@updatedAt`
    // nhảy trên một hàng không đổi gì.
    //
    // ⚠ KHÔNG viện `T-4` cho dòng này: `C3-6` nêu đích danh tập cột `T-4` đem
    // so là tám ô `TargetField`, **KHÔNG gồm `updated_at`**. Lý do giữ nhánh
    // này là ghi vết phải nói đúng chuyện đã xảy ra, không phải `T-4`.
    if (Object.keys(data).length === 0) {
      await ctx.audit.complete(t, ctx.auditId, "no_op", { before, after: before });
      return;
    }

    const after = await t.account.update({
      where: { id },
      data,
      select: {
        name: true, market: true, industry: true, accountType: true,
        country: true, website: true, specialtyArea: true, revenueRange: true,
        dealValueTier: true, foundedYear: true,
      },
    });

    // ⚠ KHÔNG thêm mục Dòng thời gian. `C3-6` nêu đích danh tập cột mà `T-4`
    // đem so — tám ô `TargetField`, KHÔNG gồm Dòng thời gian — và không `FR`
    // nào đòi một mục cho mỗi lần sửa hồ sơ. Dòng ghi vết là vết duy nhất, và
    // nó mang đủ giá trị cũ lẫn mới (`AD-4` bất biến ②).
    await ctx.audit.complete(t, ctx.auditId, "ok", { before, after });
  });
}

/// `D26` — xoá mềm. Cascade: Người liên hệ · Cơ hội · Hoạt động · Việc tiếp
/// theo · Bản chụp · Bản lưu · Thông báo. Gợi ý còn chờ chuyển `dong_he_thong`
/// kèm `cong_ty_da_xoa`. Phát hiện và Dòng thời gian KHÔNG xoá.
/// `NFR-17` · `T-10a` vế 3 — máy KHÔNG tự xoá dữ liệu do người tạo.
///
/// `T-10a` chứng minh bằng lời gọi bị TỪ CHỐI ở đây; `T-10b` chứng minh bằng
/// VẮNG MẶT trong sổ đăng ký. Hai vế khác nhau, cần cả hai: sổ có thể mọc thêm
/// một mục xoá vào ngày mai, còn chốt này thì không.
export async function softDeleteCompany(
  actor: Actor,
  id: string,
  ctx: CoreContext,
): Promise<void> {
  if (!isHuman(actor)) {
    throw new BusinessRuleError(
      "NFR-17",
      "Chỉ người xoá được dữ liệu; tác nhân là " + BT + actor.kind + BT + ".",
    );
  }
  await tx(async (t) => {
    const now = new Date();
    const before = await t.account.findUnique({
      where: { id },
      select: { name: true, deletedAt: true },
    });
    // ⚠ `Error` thường, KHÔNG phải `BusinessRuleError`: *không tìm thấy bản
    // ghi* không có mã nào ở thượng nguồn, và bịa một mã là dựng nguồn sự
    // thật thứ hai — đúng thứ đầu `errors.ts` cấm. Tầng ① xếp nó vào nhánh
    // `unexpected` của `ActionState`.
    if (!before) throw new Error("Công ty không tồn tại.");

    // `D26` — cascade nêu ĐÍCH DANH. Phát hiện và Dòng thời gian KHÔNG có mặt:
    // chúng là bằng chứng, và `NFR-17` cấm xoá bằng chứng kể cả khi người bấm.
    await t.opportunity.updateMany({ where: { accountId: id, deletedAt: null }, data: { deletedAt: now } });
    // Việc tiếp theo — `D26` liệt nó ĐÍCH DANH trong cascade. Đi qua
    // `opportunity` vì `next_action` không có `account_id`. Thiếu dòng này thì
    // sau khi xoá Công ty vẫn còn Việc tiếp theo SỐNG treo dưới một Cơ hội đã
    // xoá: nó chiếm ô `next_action_one_active` mãi mãi, và lọt vào danh sách quá
    // hạn của `E1-S11` vì extension của `AD-CR-6` không đi xuống quan hệ lồng.
    await t.nextAction.updateMany({
      where: { opportunity: { accountId: id }, deletedAt: null },
      data: { deletedAt: now },
    });
    await t.contact.updateMany({ where: { accountId: id, deletedAt: null }, data: { deletedAt: now } });
    await t.activity.updateMany({ where: { accountId: id, deletedAt: null }, data: { deletedAt: now } });
    await t.account.update({ where: { id }, data: { deletedAt: now } });

    await ctx.audit.complete(t, ctx.auditId, "ok", {
      before,
      after: { name: before.name, deletedAt: now },
    });
  });
}

/// Năm giá trị `enum AccountType` của `0.1.1`.
///
/// ✅ Chỗ lệch ĐÃ ĐÓNG 14/8. Lược đồ từng khai `tech_startup`/`ito` trong khi
/// `0.1.1` khai `tech_based`/`ito_other`. `AD-13` xếp Mục 0 TRÊN lược đồ, nên
/// lược đồ là chỗ sai, và nó đã được đổi tên bằng `ALTER TYPE … RENAME VALUE`.
///
/// Vì sao đáng một lần mở lại `prisma/` giữa lúc đóng băng: hệ quả của việc để
/// lệch KHÔNG phải một lỗi. `searchCompanies` lọc theo chữ Mục 0 nhận về `[]` —
/// Prisma coi giá trị ngoài từ vựng là *không khớp*, không phải *sai*. Một bộ
/// lọc im lặng trả rỗng đọc thành *"không có công ty nào"*, và người đọc nó
/// giữa buổi chấm không có cách nào phân biệt hai chuyện đó.
const ACCOUNT_TYPES = [
  "traditional", "it_solution", "it_product", "tech_based", "ito_other",
] as const;
type AccountTypeValue = (typeof ACCOUNT_TYPES)[number];

/// Trần số hàng của một lượt tìm. Hai con số này KHÔNG có mã thượng nguồn —
/// `E1-S10` không nói gì về phân trang. Chúng tồn tại vì một lượt đọc không trần
/// đi ra sau `exposeToMcp: true`. Cần một dòng chốt nếu bộ dữ liệu thật lớn hơn.
const SEARCH_DEFAULT_LIMIT = 200;
const SEARCH_MAX_LIMIT = 500;

/// Ba giá trị `enum Market` của `AD-CR-11`.
const MARKETS = ["JP", "Global", "KR"] as const;
type MarketValue = (typeof MARKETS)[number];

/// Hình dạng một hàng trả về. Khớp TỪNG TRƯỜNG với `AccountRow` của
/// `src/app/_types.ts`, và đó là chủ đích: `src/capability/caps/ui.ts` khai một
/// *"món nợ có ý thức"* — nó đọc thẳng `db` vì lúc viết `src/core` chưa có hàm
/// đọc nào — và ghi rõ cách trả nợ là *"khi `src/core` có hàm đọc, mỗi `fn` rút
/// còn một dòng gọi hàm đó"*. Trả một hình dạng khác thì món nợ đó không trả
/// được bằng một dòng nữa.
///
/// `updatedAt` là chuỗi ISO chứ không phải `Date`, cùng lý do: giá trị này đi
/// thẳng qua ranh giới server action lên máy khách, và `AccountRow` đã cố định
/// nó là chuỗi. Ngưỡng *hồ sơ đã cũ* 30 ngày (`NFR-18`) **cấu hình được**, nên
/// chỗ so ngưỡng là bề mặt đọc được ngưỡng, không phải hàm này.
export type CompanySearchRow = {
  id: string;
  name: string;
  industry: string | null;
  accountType: string | null;
  market: string;
  country: string | null;
  website: string | null;
  watching: boolean;
  updatedAt: string;
  contactCount: number;
  opportunityCount: number;
};

export type SearchCompaniesQuery = {
  /// `E1-S10` — tìm theo TÊN. Không tìm sang `industry`/`country`: hai ô đó đã
  /// có bộ lọc riêng, và để một ô chữ khớp cả ba thì *"lọc ngành = A"* cộng
  /// *"chữ = B"* trả về Công ty ngành B — đúng thứ `T-1` gọi là lọc không kết hợp.
  text?: string;
  industry?: string;
  accountType?: string;
  country?: string;
  /// Trần số hàng. Mặc định `SEARCH_DEFAULT_LIMIT`, trần cứng
  /// `SEARCH_MAX_LIMIT` — xem hai hằng dưới.
  limit?: number;
  /// `AD-CR-11` — thị trường, KHÁC `country` (`AD-14` nói về xoá mềm và lịch
  /// ngày làm việc, không nói về cặp cột này). Không có trong chữ ký đóng băng của
  /// Cục 0; thêm ở đây (tuỳ chọn, không phá bên gọi nào) vì `searchAccountsCap`
  /// của tầng ① lọc theo nó, và thiếu nó thì món nợ của `ui.ts` không trả được.
  market?: string;
  watching?: boolean;
};

/// `C5-1` · `E1-S10` · `T-1` — tìm và lọc Công ty.
///
/// *"Các bộ lọc **kết hợp được**"* là nguyên văn của `E1-S10` và `C1-6`; `T-1`
/// chỉ viết *"tìm kiếm và lọc"*. Nên mọi vế nối bằng **AND**, và mỗi vế chỉ có
/// mặt khi bên gọi nêu nó. `undefined` = *"không lọc
/// theo trục này"*; `watching: false` = *"chỉ Công ty KHÔNG theo dõi"*, khác hẳn
/// bỏ trống — gộp hai thứ đó là làm bộ lọc đảo không diễn đạt được.
///
/// Giá trị enum ngoài từ vựng trả về **mảng rỗng**, không phải bỏ qua bộ lọc.
/// Bỏ qua thì một lỗi gõ ở tầng trên hiện ra dưới dạng *nhiều kết quả hơn*, và
/// đó là hình dạng hỏng khó thấy nhất trên một màn hình danh sách.
///
/// Hàng đã xoá mềm không bao giờ ra: extension của `AD-CR-6` chèn
/// `deletedAt: null` cho mọi thao tác ĐỌC, nên `D26` hiện đúng ở đây mà không
/// cần một vế `where` viết tay.
///
/// ⚠ `_actor` KHÔNG được đọc, và đó là đúng: `AD-CR-10` chốt lõi không đọc
/// `actor.role`, còn `src/ontology/crm.ontology.md` nói về `owner_id` — *"định
/// tuyến việc, KHÔNG phải phân quyền — ai cũng thấy mọi Công ty"*. Tham số vẫn
/// có mặt vì `AD-5` bắt mọi hàm lõi nhận `actor` làm tham số đầu.
export async function searchCompanies(
  _actor: Actor,
  q: SearchCompaniesQuery,
): Promise<CompanySearchRow[]> {
  const text = q.text?.trim();

  if (q.accountType !== undefined
    && !(ACCOUNT_TYPES as readonly string[]).includes(q.accountType)) {
    return [];
  }
  if (q.market !== undefined && !(MARKETS as readonly string[]).includes(q.market)) {
    return [];
  }

  const rows = await db.account.findMany({
    where: {
      ...(text ? { name: { contains: text, mode: "insensitive" as const } } : {}),
      ...(q.industry !== undefined ? { industry: q.industry } : {}),
      ...(q.accountType !== undefined
        ? { accountType: q.accountType as AccountTypeValue }
        : {}),
      ...(q.country !== undefined ? { country: q.country } : {}),
      ...(q.market !== undefined ? { market: q.market as MarketValue } : {}),
      ...(q.watching !== undefined ? { watching: q.watching } : {}),
    },
    // Khoá sắp BA TẦNG (`AD-UI-12` — toàn thứ tự ổn định): hai lần đọc phải
    // cho cùng thứ tự. `updatedAt` một mình không đủ — hai Công ty gieo cùng
    // một giao dịch mang cùng mốc tới từng micro giây.
    orderBy: [{ updatedAt: "desc" }, { name: "asc" }, { id: "asc" }],
    // ⚠ TRẦN BẮT BUỘC, không phải tối ưu. Bên gọi duy nhất hôm nay là
    // `readAccountList`, mang `exposeToMcp: true` — một `findMany` không giới
    // hạn sau một bề mặt MCP là mô hình tự nạp cả bảng vào cửa sổ ngữ cảnh, và
    // `NFR-3`/`C3-4` đo ngân sách theo token. Không phân trang: `E1-S10` không
    // đòi, và một tham số `skip` không ai gọi là bề mặt thừa.
    take: Math.min(q.limit ?? SEARCH_DEFAULT_LIMIT, SEARCH_MAX_LIMIT),
    select: {
      id: true, name: true, industry: true, accountType: true, market: true,
      country: true, website: true, watching: true, updatedAt: true,
      // ⚠ Vế `where` viết TAY, không thừa. Extension của `AD-CR-6` chỉ chèn
      // `deletedAt: null` vào `where` của model đang truy vấn; nó KHÔNG đi
      // xuống `_count`. Thiếu hai vế này thì sau khi giám khảo xoá một Người
      // liên hệ theo `D26`, thẻ Công ty vẫn đếm nó — xoá mềm hiện đúng ở danh
      // sách và sai ở con số ngay cạnh, trên cùng một màn hình.
      _count: {
        select: {
          contacts: { where: { deletedAt: null } },
          opportunities: { where: { deletedAt: null } },
        },
      },
    },
  });

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    industry: r.industry,
    accountType: r.accountType,
    market: r.market,
    country: r.country,
    website: r.website,
    watching: r.watching,
    updatedAt: r.updatedAt.toISOString(),
    contactCount: r._count.contacts,
    opportunityCount: r._count.opportunities,
  }));
}
