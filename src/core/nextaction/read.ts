// `T-7` · `FR-30` · `FR-32` · `D14` · `BR-B1` — ĐƯỜNG ĐỌC của khối Việc tiếp theo.
//
// Tệp RIÊNG, cạnh `./index.ts`, và ranh giới giữa hai tệp là ranh giới đường
// GHI ↔ đường ĐỌC. Hai lý do, và lý do thứ hai mới là lý do thật:
//   ① phạm vi cục dựng khối `S3` không mở `./index.ts` — nó đang có người khác
//   ② `canUndo` dưới đây là một BẢN SAO của vế `where` trong
//      `undoSystemNextAction`, nên nó phải nằm ĐỦ GẦN để ai sửa vị từ ghi
//      nhìn thấy vị từ đọc trong cùng một thư mục. Đặt nó ở tầng ① hay tầng ④
//      là để hai bản sao cách nhau hai tầng, và chúng sẽ trôi khỏi nhau.
//
// ⚠ KHÔNG có chuỗi hiển thị nào ở đây. Quy ước cha: lõi và tầng ④ trả TOKEN
// (`nguoi` / `he_thong`), chữ tiếng Việt sống ở `src/app/_vocab.ts`.

import type { Actor } from "@/core/actor";
/// `AD-1` — `src/core` là tầng DUY NHẤT được chạm Prisma. `db` (không phải
/// `dbIncludingDeleted`) đã `$extends` để tự lọc `deleted_at IS NULL` ở mức
/// GỐC — xem cảnh báo về quan hệ lồng ngay dưới.
import { db } from "@/core/db";
import { isRunning } from "@/core/opportunity/stage";

/// Việc tiếp theo còn sống của MỘT Cơ hội. `Date` thô, chưa tuần tự hoá: đổi
/// sang ISO là việc của tầng ④ (`AD-UI-5` nói về props của lá `'use client'`,
/// không nói về hình dạng của lõi).
export type ActiveNextAction = {
  /// `BR-B1` — thiếu nội dung hoặc thiếu hạn VẪN LƯU ĐƯỢC, nên cả hai `null` được.
  content: string | null;
  dueDate: Date | null;
  /// `nguoi` | `he_thong`. Thuộc tính NGUỒN GỐC, không phải siêu dữ liệu: nó
  /// quyết định máy có được ghi đè không, và ở đây nó quyết định nút Hoàn tác
  /// có hiện không.
  setBy: string;
  /// `D14` — MỐC TUYỆT ĐỐI, đã cộng sẵn 7 ngày lúc máy ghi. Bề mặt **không**
  /// tính lại 7 ngày từ `createdAt`; cửa sổ là tham số và mốc này là câu trả
  /// lời duy nhất còn đúng khi tham số đổi.
  undoDeadlineAt: Date | null;
  /// `FR-30` · `EXPERIENCE.md` — dòng máy đi kèm CÂU TRÍCH. `null` khi ô không
  /// trace về Phát hiện nào (mọi ô do người gõ đều thế — `setNextAction` xoá
  /// `source_signal_id`).
  sourceClaim: string | null;
  sourceQuote: string | null;
  /// `T-7` — hoàn tác BÂY GIỜ có thành công không. Xem khối chú thích dưới.
  canUndo: boolean;
  /// `D14` — cửa sổ còn lại, tính bằng mili giây, `0` khi đã đóng.
  ///
  /// ⚠ TÍNH Ở ĐÂY, không ở bề mặt, và đó không phải tiện nghi. React 19 cấm gọi
  /// hàm không thuần (`Date.now()`) trong lúc render — luật `react-hooks/purity`
  /// chặn thẳng ở lint. Quan trọng hơn: `canUndo` và con số này phải đọc CÙNG
  /// MỘT lần đồng hồ, nếu không màn hình vẽ được một nút kèm câu *còn 0 giây*.
  undoRemainingMs: number;
};

export type OpportunityNextAction = {
  opportunityId: string;
  opportunityName: string;
  /// Token giai đoạn (`tiep_can`…). Chữ hiển thị ở `_vocab.ts`.
  stage: string;
  /// `BR-B4` — cờ *thiếu Việc tiếp theo* chỉ có nghĩa với Cơ hội ĐANG CHẠY.
  /// Tính ở đây vì `isRunning` thuộc lõi và tầng ① không được nhập `@/core/*`.
  running: boolean;
  /// `null` = không còn hàng nào sống, tức **chưa có Việc tiếp theo** — đúng
  /// *nguyên trạng* mà `T-7` đòi sau khi Hoàn tác chạy (`AD-3` nhánh ⓐ, `D16`).
  nextAction: ActiveNextAction | null;
};

/// `T-7` · `FR-32` — Việc tiếp theo của MỌI Cơ hội thuộc một Công ty.
///
/// Theo Công ty chứ không theo Cơ hội vì bề mặt gọi nó là khối `S3`, vốn chỉ
/// cầm `accountId`; còn `undoSystemNextAction` nhận `opportunityId`. Chính lượt
/// đọc này là chỗ bắc cầu giữa hai mã đó, nên nó phải trả `opportunityId` cho
/// từng dòng — nếu không, bề mặt phải đoán Cơ hội nào, và nó không đoán được.
///
/// ⚠ `now` là THAM SỐ có mặc định, không phải `new Date()` chôn trong thân:
/// `canUndo` là một phép so với đồng hồ, và một hàm tự đọc đồng hồ hệ thống thì
/// không kiểm được ba nhánh của nó bằng bảng.
///
/// ⚠ `_actor` không được đọc — `AD-CR-10`: lõi không đọc vai. Lọc theo người
/// dùng, nếu có, là việc của mục sổ đăng ký. Tham số vẫn có mặt vì `AD-5` bắt
/// mọi hàm lõi nhận `actor` làm tham số đầu.
export async function readAccountNextActions(
  _actor: Actor,
  accountId: string,
  now: Date = new Date(),
): Promise<OpportunityNextAction[]> {
  const rows = await db.opportunity.findMany({
    where: { accountId },
    // Cơ hội vừa động đậy lên trước — cùng khoá sắp mà `readAccountDetail`
    // dùng, để hai khối trên cùng một trang không xếp Cơ hội theo hai thứ tự.
    // `id` là khoá phụ: dữ liệu gieo hay tạo hàng loạt cho nhiều hàng chung
    // một `updated_at`, và khi ấy thứ tự không có khoá phụ là không xác định.
    orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
    select: {
      id: true,
      name: true,
      stage: true,
      nextActions: {
        // ⚠ VẾ NÀY BẮT BUỘC. Extension của `db.ts` lọc `deleted_at` ở mức GỐC,
        // KHÔNG lọc quan hệ lồng — lược đồ nói thẳng điều đó ở `model
        // Opportunity`. Thiếu nó thì hàng máy vừa hoàn tác (xoá MỀM) vẫn hiện,
        // kèm một nút Hoàn tác thứ hai bấm vào không làm gì: đúng hình dạng lỗi
        // mà `T-7` sinh ra để bắt.
        where: { deletedAt: null },
        // Chỉ mục một phần `next_action_one_active` đã canh *đúng một hàng
        // sống*; `take: 1` là vế thứ hai cho cùng bất biến, để một chỉ mục bị
        // rơi trong lúc migrate không biến khối này thành một danh sách.
        //
        // ⚠ Khoá sắp HAI TẦNG. `created_at` một mình không định thứ tự khi hai
        // hàng cùng mốc — và nếu chỉ mục đã rơi thì đó đúng là lúc có hai hàng.
        // Thứ tự không xác định ở đây nghĩa là hai lượt render cho hai kết quả.
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: 1,
        select: {
          content: true,
          dueDate: true,
          setBy: true,
          undoDeadlineAt: true,
          // ⚠ QUAN HỆ LỒNG THỨ HAI, và nó KHÔNG lọc được bằng `where` —
          // Prisma không cho `where` trên quan hệ một-một ở `select`. Nên hai
          // cột cờ đi kèm và bên dưới tự bỏ: một Phát hiện đã xoá mềm hoặc đã
          // bị đánh dấu *không hữu ích* mà vẫn đứng làm *căn cứ* dưới dòng máy
          // là trưng bằng chứng đã bị rút.
          sourceSignal: {
            select: {
              claim: true,
              quote: true,
              deletedAt: true,
              markedUnhelpfulAt: true,
            },
          },
        },
      },
    },
  });

  return rows.map((o) => {
    const na = o.nextActions[0];
    // Phát hiện nguồn chỉ được TRÍCH khi nó còn giá trị làm bằng chứng.
    const src =
      na?.sourceSignal &&
      na.sourceSignal.deletedAt === null &&
      na.sourceSignal.markedUnhelpfulAt === null
        ? na.sourceSignal
        : null;
    return {
      opportunityId: o.id,
      opportunityName: o.name,
      stage: o.stage,
      running: isRunning(o.stage),
      nextAction:
        na === undefined
          ? null
          : {
              content: na.content,
              dueDate: na.dueDate,
              setBy: na.setBy,
              undoDeadlineAt: na.undoDeadlineAt,
              sourceClaim: src?.claim ?? null,
              sourceQuote: src?.quote ?? null,
              canUndo: canUndoNow(na.setBy, na.undoDeadlineAt, now),
              undoRemainingMs: remainingMs(na.undoDeadlineAt, now),
            },
    };
  });
}

/// `T-7` — BẢN SAO CÓ CHỦ ĐÍCH của vế `where` trong `undoSystemNextAction`
/// (`./index.ts`), và nó phải giữ nguyên hình dạng đó từng vị từ một.
///
/// Vì sao cần: lõi có ĐÚNG BA đường tới *không làm gì*, và cả ba là NO-OP chứ
/// không phải lỗi — nên một nút bấm vào không làm gì sẽ **im lặng**. Giữa buổi
/// chấm, người bấm không phân biệt được *nút hỏng* với *đã hết hạn*, và đó là
/// hình dạng lỗi đắt nhất trong cả cục này. Nên bề mặt hỏi TRƯỚC, và chỉ vẽ nút
/// khi câu trả lời là có:
///
///   ① hết cửa sổ 7 ngày   → `undo_deadline_at` đã qua      → `false`
///   ② người đã sửa tay    → `set_by` đã thành `nguoi`      → `false`
///   ③ đã hoàn tác rồi     → không còn hàng sống nào        → bên gọi trả `null`
///
/// ⚠ ĐÂY LÀ MỘT LỜI ĐOÁN VỀ TƯƠNG LAI GẦN, không phải một lời hứa. Giữa lúc
/// render và lúc bấm, ai đó có thể vừa Lưu ô này. Khi ấy `updateMany` của lõi
/// chạm 0 hàng và trả `false` — thao tác vẫn AN TOÀN, chỉ là không làm gì. Bề
/// mặt thu hẹp cửa sổ hiểu nhầm; lõi mới là chỗ bất biến được cưỡng chế.
function canUndoNow(
  setBy: string,
  undoDeadlineAt: Date | null,
  now: Date,
): boolean {
  if (setBy !== "he_thong") return false;
  if (undoDeadlineAt === null) return false;
  // `gt`, đúng một chiều với `undoDeadlineAt: { gt: now }` của lõi: đúng
  // khoảnh khắc hết hạn thì KHÔNG hoàn tác được nữa.
  return undoDeadlineAt.getTime() > now.getTime();
}

/// Cửa sổ còn lại, không bao giờ âm. `0` nghĩa **đã đóng** — cùng một câu trả
/// lời với ô chưa từng mở cửa sổ nào, và bề mặt không cần phân biệt hai chuyện
/// đó vì `canUndo` đã trả lời câu hỏi thật.
function remainingMs(undoDeadlineAt: Date | null, now: Date): number {
  if (undoDeadlineAt === null) return 0;
  return Math.max(0, undoDeadlineAt.getTime() - now.getTime());
}
