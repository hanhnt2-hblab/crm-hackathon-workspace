// `FR-19` · `FR-51` · `T-5` — đường ĐỌC của hàng đợi Gợi ý.
//
// Tệp RIÊNG, không nối thêm vào `index.ts`, và không phải vì tránh va chạm:
// `index.ts` giữ đường GHI (`createSuggestion`, `decideSuggestion`) và mọi hàm ở
// đó mở giao dịch qua `tx()` theo `AD-CR-7`. Lượt đọc này không ghi gì, không mở
// giao dịch nào, và trộn hai họ vào một tệp làm mờ đúng ranh giới ấy.
//
// ⚠ `db`, KHÔNG phải `dbIncludingDeleted`: bản đã `$extends` tự lọc
// `deleted_at IS NULL` (`AD-14`), nên một Công ty xoá mềm (`D26`) không còn hàng
// đợi để ai bấm vào.

import type { Actor } from "@/core/actor";
import { db } from "@/core/db";
import type { TargetField } from "@/core/suggestion";

/// Một hàng của hàng đợi — hình dạng mà tầng ④ tuần tự hoá rồi đưa lên bề mặt.
///
/// `kind` suy từ `targetField`, không lưu ở cột nào: lược đồ khai *"NULL cho
/// loại thêm tin mới — nó không nhắm vào ô nào"* (`FR-18`), nên `targetField`
/// **là** cái phân biệt hai loại. Đưa nó ra thành một trường tường minh để bề
/// mặt không phải suy lại luật ấy một lần nữa.
export type PendingSuggestion = {
  id: string;
  kind: "fill_field" | "add_timeline";
  targetField: TargetField | null;
  /// `FR-19` vế *"hiện tại"*, đọc **SỐNG** lúc mở — xem chú thích ở `liveValues`.
  currentValue: string | null;
  proposedValue: string | null;
  timelineText: string | null;
  createdAt: Date;
  /// `AD-22` — Gợi ý trace về Phát hiện, và người quyết cần thấy **căn cứ**.
  /// `T-5` hỏi *"quyết gì"*; một hàng đợi không kèm câu trích là bắt người duyệt
  /// mù, đúng thứ `BR-B6` dựng ra để đo.
  signalId: string;
  claim: string;
  quote: string;
};

/// `FR-19` · `FR-51` — Gợi ý **đang chờ** của một Công ty.
///
/// ⚠ CHỈ `status = "cho"`. Bốn trạng thái còn lại đã có người (hoặc hệ thống)
/// quyết, và một hàng đợi hiện chúng là mời người quyết lại thứ đã quyết —
/// `decideSuggestion` ghi có điều kiện `where status = 'cho'` nên cú bấm ấy trả
/// `no_op`, tức một nút bấm không làm gì.
///
/// `_actor` chưa tham gia lọc, và cố ý nhận vào: `AD-5` đặt `actor` là tham số
/// đầu của mọi đường đi, và `readTimeline` — hàm đọc cùng họ, cùng phạm vi một
/// Công ty — đã có chữ ký này. Ngày nào hàng đợi lọc theo người phụ trách thì
/// chỗ nối đã sẵn, không phải đổi chữ ký ở bốn tầng.
export async function readPendingSuggestions(
  _actor: Actor,
  accountId: string,
): Promise<PendingSuggestion[]> {
  const [rows, live] = await Promise.all([
    db.suggestion.findMany({
      where: { accountId, status: "cho" },
      // Cũ nhất TRƯỚC: hàng đợi là việc phải xử, không phải bảng tin. Khoá phụ
      // `id` để hai lượt đọc cho cùng thứ tự khi hai Gợi ý cùng mốc thời gian.
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      select: {
        id: true,
        targetField: true,
        proposedValue: true,
        timelineText: true,
        createdAt: true,
        signalId: true,
        signal: { select: { claim: true, quote: true } },
      },
    }),
    liveValues(accountId),
  ]);

  return rows.map((r) => ({
    id: r.id,
    kind: r.targetField === null ? ("add_timeline" as const) : ("fill_field" as const),
    targetField: r.targetField,
    // ⚠ KHÔNG đọc cột `current_value`. Cột ấy là giá trị lúc **sinh** Gợi ý, và
    // lược đồ nói thẳng *"đọc SỐNG lúc mở, không phải ảnh chụp lúc sinh"* —
    // `FR-51` gọi nó là ảnh chụp KHÔNG có thẩm quyền. Giữa lúc sinh và lúc quyết,
    // một người có thể đã tự điền ô đó; hiện giá trị cũ là mời họ ghi đè chính
    // mình mà không biết.
    currentValue: r.targetField === null ? null : live[r.targetField],
    proposedValue: r.proposedValue,
    timelineText: r.timelineText,
    createdAt: r.createdAt,
    signalId: r.signalId,
    claim: r.signal.claim,
    quote: r.signal.quote,
  }));
}

/// Tám ô đích của `AD-CR-11`, đọc sống từ hồ sơ.
///
/// ⚠ BẢNG NÀY LẶP `TARGET_COLUMN` của `./index.ts`, và lặp là một khoản nợ có
/// thật — hai ánh xạ cho cùng một luật là hai chỗ trôi khỏi nhau. Nó lặp vì
/// `TARGET_COLUMN` không được xuất ra, và tệp ấy nằm ngoài phạm vi cục này.
/// Cách trả: xuất `TARGET_COLUMN` từ `./index.ts` rồi rút hàm này còn một vòng
/// lặp. Đã báo.
///
/// Cái giữ được trong lúc chưa trả: `Record<TargetField, …>` **bắt buộc đủ tám
/// khoá**, nên một ô đích thứ chín thêm vào `enum TargetField` làm `tsc` đỏ ngay
/// tại đây thay vì làm một ô im lặng hiện *"chưa có"* mãi mãi.
async function liveValues(accountId: string): Promise<Record<TargetField, string | null>> {
  const account = await db.account.findUnique({
    where: { id: accountId },
    select: {
      website: true, country: true, specialtyArea: true, revenueRange: true,
      industry: true, dealValueTier: true, foundedYear: true, accountType: true,
    },
  });

  if (!account) {
    // Không ném: Công ty vắng mặt thì `findMany` bên trên cũng trả rỗng, và bề
    // mặt gọi hàm này đã có `notFound()` của riêng nó ở khối hồ sơ.
    return {
      website: null, country: null, specialty_area: null, revenue_range: null,
      industry: null, deal_value_tier: null, founded_year: null, account_type: null,
    };
  }

  return {
    website: account.website,
    country: account.country,
    specialty_area: account.specialtyArea,
    revenue_range: account.revenueRange,
    industry: account.industry,
    deal_value_tier: account.dealValueTier,
    // `Int?` ở cột, chuỗi trên bề mặt — cùng lối `applyToAccount` đi ngược lại.
    founded_year: account.foundedYear === null ? null : String(account.foundedYear),
    account_type: account.accountType,
  };
}
