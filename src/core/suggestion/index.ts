// `C5-12` · `E3-S1`…`E3-S4` · `FR-18` · `FR-19` · `FR-22` · `FR-51` — Gợi ý.
//
// BỐN lối ra, không phải ba: `duyet` · `sua_roi_duyet` · `bo` là của người;
// `dong_he_thong` là của hệ thống và KHÔNG vào mẫu số chỉ số nào (`D26`,
// `FR-51`) — không ai quyết gì cả.
//
// `AD-22` chia việc rõ: mô hình sinh **Phát hiện**, hệ thống sinh **Gợi ý**.
// Không trường nào của Gợi ý đi ra biên; `createSuggestion` suy XÁC ĐỊNH từ
// Phát hiện đã lưu cộng giá trị hiện tại đọc sống.

import type { Actor } from "@/core/actor";
/// `AD-CR-7`: lõi TỰ mở giao dịch, nên không nhận `tx` từ ngoài.
import { tx } from "@/core/db";
/// ⚠ Câu nhập RIÊNG cho kiểu — `no-import-type-side-effects` chặn dạng nội dòng.
import type { Tx } from "@/core/db";
import type { CoreContext } from "@/core/context";
import { isHuman } from "@/core/actor";
import { appendEntryWithin } from "@/core/timeline";
import { BusinessRuleError } from "@/core/errors";

/// Tám ô đích của `AD-CR-11`, khớp TỪNG CHỮ `enum TargetField`. `market` KHÔNG
/// nằm trong đây — nó là đầu vào lịch ngày làm việc của `BR-D7`, và gộp nó vào
/// thì một Gợi ý được duyệt sẽ đổi lịch, làm mọi hạn tính lệch (ontology §14).
export type TargetField =
  | "website" | "country" | "specialty_area" | "revenue_range"
  | "industry" | "deal_value_tier" | "founded_year" | "account_type";

/// `0.1.7` — năm lý do Bỏ. Khớp TỪNG CHỮ `enum DropReason`.
/// ⚠ Không phải `trung_lap`/`chua_den_luc`. `thong_tin_sai` là giá trị DUY NHẤT
/// vào tử số `errorDetectionRate` (`D30`).
export type DropReason =
  | "thong_tin_sai" | "khong_lien_quan" | "da_cu" | "hieu_sai_ngu_canh" | "khac";

/// Năm giá trị `enum AccountType` của `0.1.1`.
const ACCOUNT_TYPES = [
  "traditional", "it_solution", "it_product", "tech_startup", "ito",
] as const;

/// `AD-CR-11` — tám ô đích ↔ tên cột camelCase của Prisma.
///
/// ⚠ ĐÂY LÀ ĐƯỜNG GHI DUY NHẤT cho một Gợi ý được duyệt, và nó nằm ở lõi Gợi ý
/// chứ không gọi `updateCompany`. Không phải vì tiện: `AD-CR-7` đặt giao dịch
/// TRONG lõi, nên gọi `updateCompany` từ đây là mở một giao dịch LỒNG, và lồng
/// giao dịch trên ITX client là `TypeError` lúc chạy. Đổi trạng thái Gợi ý và áp
/// giá trị **phải** cuộn lại cùng nhau — duyệt xong mà hồ sơ không đổi, hoặc hồ
/// sơ đổi mà Gợi ý còn `cho`, đều là dữ liệu nói dối.
///
/// `deferred-work.md` nêu *"`updateCompany` chỉ với tới 4/8 `TargetField`"* —
/// bảng này đóng khoảng trống đó cho đường Gợi ý. Đường sửa hồ sơ do người gõ
/// tay vẫn thuộc `updateCompany`.
const TARGET_COLUMN: Record<TargetField, string> = {
  website: "website",
  country: "country",
  specialty_area: "specialtyArea",
  revenue_range: "revenueRange",
  industry: "industry",
  deal_value_tier: "dealValueTier",
  founded_year: "foundedYear",
  account_type: "accountType",
};

// ───────────────────────────────────────────────────────────────────────────
// Sinh Gợi ý
// ───────────────────────────────────────────────────────────────────────────

/// `FR-18` — HAI loại Gợi ý, và union phân biệt là chỗ duy nhất phát biểu được
/// điều đó.
///
/// `deferred-work.md` nêu *"`createSuggestion` không chứa được loại thêm tin
/// mới (`targetField = null`, nội dung ở `timeline_text`)"*. Một object phẳng
/// với `targetField: string | null` khai được ba trạng thái bất khả — ô đích
/// `null` mà vẫn có `proposedValue`, ô đích có mà `timelineText` cũng có, và cả
/// hai cùng rỗng. Union theo `kind` làm cả ba không gõ ra được.
export type CreateSuggestionInput =
  /// Điền hoặc sửa MỘT ô hồ sơ. Ô này chịu bất biến `FR-51`.
  | {
      kind: "fill_field";
      accountId: string;
      signalId: string;
      targetField: TargetField;
      /// `FR-19` vế *"hiện tại"* — giá trị SỐNG lúc sinh. Bên đọc vẫn đọc lại
      /// lúc mở, vì `FR-51` nói rõ đây không phải ảnh chụp có thẩm quyền.
      currentValue: string | null;
      proposedValue: string;
    }
  /// Thêm MỘT tin mới vào Dòng thời gian. Không nhắm vào ô nào.
  | {
      kind: "add_timeline";
      accountId: string;
      signalId: string;
      timelineText: string;
    };

/// `FR-51` · `AD-22` — một ô, một Gợi ý đang chờ.
///
/// Gợi ý mới trên ô đã có Gợi ý chờ thì đóng cái cũ bằng `dong_he_thong` +
/// `co_goi_y_moi_hon` TRONG CÙNG giao dịch rồi mới chèn. Không làm thế thì
/// `suggestion_one_pending_per_slot` ném ngay ở câu chèn, giao dịch cuộn lại, và
/// vòng quét hỏng ở Công ty đầu tiên có hai tin về cùng một ô.
///
/// ⚠ Đóng cũ là **lý do đóng của HỆ THỐNG, không phải một lần người quyết**:
/// `decided_by` để `null`, `decision_seconds` để `null`, và `metrics.ts` đã loại
/// `dong_he_thong` khỏi mẫu số của cả hai chỉ số. Tính nó vào mẫu số ở chế độ
/// demo 60 giây sẽ kéo tụt `SM-3` theo đúng tần suất quét — một con số xấu không
/// phản ánh gì về chất lượng.
///
/// ⚠ Loại `add_timeline` KHÔNG đóng gì. `target_field` của nó là `NULL`, và
/// Postgres coi hai `NULL` là phân biệt — nên chỉ mục một phần không ràng buộc
/// chúng, và nhiều Gợi ý *thêm tin mới* cùng tồn tại là ĐÚNG: mỗi tin là một
/// mục Dòng thời gian riêng, không cái nào thay thế cái nào.
///
/// ⚠ HAI luật lọc KHÔNG nằm ở đây, có chủ đích:
///   · `D17` — Công ty **Đang theo dõi** không sinh Gợi ý loại *thêm tin mới*
///   · `D45` — Phát hiện `relevance = low` không vào Hàng đợi gợi ý
/// Cả hai là luật CHỌN CÁI GÌ ĐÁNG SINH, thuộc vòng quét (`FR-18`), không phải
/// luật *"hàng này có hợp lệ không"*. Cưỡng chế ở đây cần một mã từ chối mà từ
/// vựng đóng của `errors.ts` không có. Khoảng trống đã báo.
export async function createSuggestion(
  _actor: Actor,
  input: CreateSuggestionInput,
  ctx: CoreContext,
): Promise<{ id: string }> {
  return tx(async (t) => {
    const now = new Date();

    // `AD-22` — Gợi ý trace về Phát hiện bằng khoá ngoại THẬT, và Phát hiện
    // thừa kế Công ty từ Bản lưu (`BR-D3`). Sinh một Gợi ý cho Công ty A từ một
    // Phát hiện của Công ty B là chuyện phải hỏng ồn ào, không phải im lặng.
    const signal = await t.signal.findUnique({
      where: { id: input.signalId },
      select: { accountId: true },
    });
    if (!signal) throw new Error("Phát hiện không tồn tại.");
    if (signal.accountId !== input.accountId) {
      throw new BusinessRuleError(
        "BR-D3",
        "Gợi ý phải thuộc đúng Công ty của Phát hiện sinh ra nó.",
      );
    }

    let closed = 0;
    if (input.kind === "fill_field") {
      // `FR-51` — đóng cái cũ TRƯỚC khi chèn, trong CÙNG giao dịch.
      // ⚠ `deletedAt: null` viết tay: extension của `AD-CR-6` chỉ lọc thao tác
      // ĐỌC, `updateMany` không đi qua nó.
      const superseded = await t.suggestion.updateMany({
        where: {
          accountId: input.accountId,
          targetField: input.targetField,
          status: "cho",
          deletedAt: null,
        },
        data: {
          status: "dong_he_thong",
          systemCloseReason: "co_goi_y_moi_hon",
          decidedAt: now,
          // `decidedBy` và `decisionSeconds` GIỮ `null`: không ai quyết gì cả.
        },
      });
      closed = superseded.count;
    }

    const row = await t.suggestion.create({
      data: {
        accountId: input.accountId,
        signalId: input.signalId,
        targetField: input.kind === "fill_field" ? input.targetField : null,
        currentValue: input.kind === "fill_field" ? input.currentValue : null,
        proposedValue: input.kind === "fill_field" ? input.proposedValue : null,
        timelineText: input.kind === "add_timeline" ? input.timelineText : null,
        status: "cho",
      },
      select: { id: true },
    });

    await ctx.audit.complete(t, ctx.auditId, "ok", {
      after: { id: row.id, supersededPending: closed },
    });
    return { id: row.id };
  });
}

/// `D26` — hệ quả dây chuyền của *xoá Công ty*: Gợi ý còn chờ chuyển
/// `dong_he_thong` kèm `cong_ty_da_xoa`.
///
/// `AD-21` khai hệ quả dây chuyền là hàm NỘI BỘ `src/core`, **không** đi qua
/// `loadCapability` — nên hàm này cố ý nhận `t` và KHÔNG mở giao dịch: nó chạy
/// bên trong giao dịch của thao tác đã gây ra nó, cùng actor.
///
/// ⚠ Hiện `softDeleteCompany` chưa gọi nó — cascade ở đó liệt kê bốn bảng và
/// chưa có `suggestion`. Đó là tệp của cục khác; hàm này là chỗ để nối vào, và
/// khoảng trống đã báo.
export async function closeSuggestionsBySystem(
  t: Tx,
  accountId: string,
  reason: "cong_ty_da_xoa",
): Promise<number> {
  const res = await t.suggestion.updateMany({
    where: { accountId, status: "cho", deletedAt: null },
    data: { status: "dong_he_thong", systemCloseReason: reason, decidedAt: new Date() },
  });
  return res.count;
}

// ───────────────────────────────────────────────────────────────────────────
// Quyết một Gợi ý
// ───────────────────────────────────────────────────────────────────────────

/// `FR-20` · `FR-22` — BA lối ra của NGƯỜI, khai bằng union phân biệt theo
/// `outcome`.
///
/// `deferred-work.md` nêu *"`DecideInput` khai được ba trạng thái bất khả
/// (`bo` không lý do; `duyet` có `dropReason`; `bo` kèm `editedValue`)"*. Union
/// dưới đây làm cả ba không gõ ra được — `BR-D10` (*"enum chọn trong danh
/// sách"*) khi đó chỉ còn phải canh GIÁ TRỊ, không phải canh SỰ CÓ MẶT.
///
/// Lối ra thứ tư — `dong_he_thong` — **không có mặt ở đây**, có chủ đích: nó
/// không phải một quyết định, nó là hệ quả. Nó vào bằng `createSuggestion`
/// (`FR-51`) và `closeSuggestionsBySystem` (`D26`).
export type DecideInput =
  | {
      suggestionId: string;
      outcome: "duyet";
      /// `BR-B6` — đo từ lúc MỞ CHI TIẾT một Gợi ý, không từ lúc mở hàng đợi.
      decisionSeconds: number;
    }
  | {
      suggestionId: string;
      outcome: "sua_roi_duyet";
      /// Bắt buộc: *sửa-rồi-duyệt* mà không có giá trị sửa thì nó là *duyệt*.
      editedValue: string;
      decisionSeconds: number;
    }
  | {
      suggestionId: string;
      outcome: "bo";
      /// `BR-D10` — bắt buộc, enum, không nhập tự do.
      dropReason: DropReason;
      decisionSeconds: number;
    };

/// `FR-20`…`FR-23` · `AD-CR-7` — quyết một Gợi ý, sáu bước trong MỘT giao dịch.
///
/// Ghi CÓ ĐIỀU KIỆN `where status = 'cho'`, và đó không phải tối ưu hoá: màn
/// hình Hàng đợi mở sẵn trong khi vòng quét có thể đóng chính Gợi ý ấy bằng
/// `co_goi_y_moi_hon` (`FR-51`). Đọc-rồi-ghi ở đây làm người **đè lên một quyết
/// định hệ thống vừa ghi**, và con số `auto-accept rate` đếm một lượt duyệt cho
/// một Gợi ý đã không còn tồn tại.
///
/// `FR-22` — *sửa-rồi-duyệt* ghi là **sửa**, KHÔNG ghi là **duyệt**. Hai lối ra
/// khác nhau, hai giá trị `status` khác nhau, và `metrics.ts` đã đếm tử số chỉ
/// trên `duyet`. Gộp chúng là làm `T-5` không phát biểu được.
///
/// Thứ tự bên trong theo `AD-CR-7`:
///   ① ghi chính — trạng thái Gợi ý, có điều kiện
///   ③ hệ quả dây chuyền — ÁP giá trị vào hồ sơ, hoặc thêm mục Dòng thời gian
///   ⑤ mục Dòng thời gian (chỉ với loại *thêm tin mới*)
///   ⑥ hoàn tất ghi vết
export async function decideSuggestion(
  actor: Actor,
  input: DecideInput,
  ctx: CoreContext,
): Promise<void> {
  await tx(async (t) => {
    const now = new Date();

    const before = await t.suggestion.findUnique({
      where: { id: input.suggestionId },
      select: {
        accountId: true, signalId: true, status: true,
        targetField: true, currentValue: true, proposedValue: true, timelineText: true,
      },
    });
    if (!before) throw new Error("Gợi ý không tồn tại.");

    // ① ghi chính, CÓ ĐIỀU KIỆN. Vế `where` lặp cả `status` lẫn `deletedAt` —
    // đây là kiểm-và-ghi, chỉ khác `AD-10` ở chỗ tác nhân là người.
    const changed = await t.suggestion.updateMany({
      where: { id: input.suggestionId, status: "cho", deletedAt: null },
      data: {
        status: input.outcome,
        dropReason: input.outcome === "bo" ? input.dropReason : null,
        // `FR-23` — ai quyết, lúc nào, mất bao nhiêu giây.
        decidedAt: now,
        decidedBy: isHuman(actor) ? actor.userId : null,
        decisionSeconds: input.decisionSeconds,
      },
    });
    if (changed.count === 0) {
      // Gợi ý đã được quyết, hoặc hệ thống đã đóng nó bằng `co_goi_y_moi_hon`.
      // `no_op` là kết cục, không phải lỗi — người bấm không làm gì sai.
      await ctx.audit.complete(t, ctx.auditId, "no_op", {
        before: { status: before.status },
        after: { status: before.status },
      });
      return;
    }

    // `bo` dừng ở đây: `FR-21` — không duyệt thì hồ sơ giữ nguyên VÔ THỜI HẠN.
    if (input.outcome === "bo") {
      await ctx.audit.complete(t, ctx.auditId, "ok", {
        before: { status: "cho" },
        after: { status: "bo", dropReason: input.dropReason },
      });
      return;
    }

    const value = input.outcome === "sua_roi_duyet" ? input.editedValue : null;

    // ③ hệ quả dây chuyền — CÙNG giao dịch, CÙNG actor (`AD-21`).
    if (before.targetField) {
      const applied = value ?? before.proposedValue;
      if (applied === null) {
        throw new Error("Gợi ý điền ô không có giá trị đề nghị — dữ liệu hỏng.");
      }
      await applyToAccount(
        t,
        before.accountId,
        before.targetField as TargetField,
        applied,
      );
      await ctx.audit.complete(t, ctx.auditId, "ok", {
        before: { status: "cho", [before.targetField]: before.currentValue },
        after: { status: input.outcome, [before.targetField]: applied },
      });
      return;
    }

    // ⑤ loại *thêm tin mới* — mục Dòng thời gian, trace về Phát hiện (`AD-22`).
    const content = value ?? before.timelineText;
    if (content === null) {
      throw new Error("Gợi ý thêm tin không có nội dung — dữ liệu hỏng.");
    }
    // `added_by` suy từ `actor` bên trong `appendEntryWithin`. Người bấm Duyệt
    // thì mục mang nhãn `nguoi`, và đó là ĐÚNG theo `NFR-19`: mục ấy giờ là của
    // người, nên máy không được sửa nó nữa.
    await appendEntryWithin(t, actor, {
      accountId: before.accountId,
      content,
      occurredAt: now,
      sourceSignalId: before.signalId,
    });
    await ctx.audit.complete(t, ctx.auditId, "ok", {
      before: { status: "cho" },
      after: { status: input.outcome, timelineText: content },
    });
  });
}

/// Áp giá trị đã duyệt vào MỘT trong tám ô hồ sơ.
///
/// Hai ô không phải `String?` nên không nhận thẳng chuỗi, và cả hai đều là chỗ
/// một Gợi ý xấu đi vào được nếu không kiểm:
///   · `account_type` — enum năm giá trị; giá trị lạ là `BR-D10`
///   · `founded_year` — `Int?`; `Number("")` là `0`, nên phải kiểm tường minh
///
/// ⚠ `data` dựng bằng khoá động, nên `as never` là bắt buộc: Prisma sinh một
/// union theo tên cột và TypeScript không thu hẹp nổi qua một khoá `string`.
/// Ép kiểu ở đây an toàn vì `TARGET_COLUMN` là ánh xạ ĐÓNG từ một union đóng —
/// không có khoá nào lọt vào mà không đi qua `enum TargetField`.
async function applyToAccount(
  t: Tx,
  accountId: string,
  field: TargetField,
  value: string,
): Promise<void> {
  const column = TARGET_COLUMN[field];

  if (field === "account_type") {
    if (!(ACCOUNT_TYPES as readonly string[]).includes(value)) {
      throw new BusinessRuleError(
        "BR-D10",
        `Loại công ty \`${value}\` không nằm trong năm giá trị của \`0.1.1\`.`,
      );
    }
  }

  if (field === "founded_year") {
    const year = Number.parseInt(value, 10);
    if (!Number.isInteger(year) || String(year) !== value.trim()) {
      // ⚠ `Error` thường: `BR-D10` là luật ENUM, và một năm không phải enum.
      // Từ vựng đóng của `errors.ts` không có mã cho *"giá trị sai kiểu"*.
      throw new Error(`Năm thành lập \`${value}\` không phải một số nguyên.`);
    }
    await t.account.update({ where: { id: accountId }, data: { [column]: year } as never });
    return;
  }

  await t.account.update({ where: { id: accountId }, data: { [column]: value } as never });
}
