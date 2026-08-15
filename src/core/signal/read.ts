// `C1-8` · `T-3` · `FR-14` · `FR-15` · `AD-18` — đường ĐỌC Phát hiện kèm Bản lưu
// sinh ra nó.
//
// Tách khỏi `./index.ts` chứ không thêm vào đó, và đó không phải sở thích: `C0-2`
// đóng băng `src/core/*/index.ts` làm **chữ ký qua ranh giới** — sáu cục đọc nó,
// nên mở lại là một quyết định của cả đội. Một hàm ĐỌC không đổi chữ ký nào đang
// có, nên nó đi vào một tệp mới bên cạnh.
//
// ⚠ KHÔNG MỞ GIAO DỊCH. `AD-CP-3` khai `kind` là thứ *"quyết định có mở giao dịch
// không"*, và `AD-CR-7` chỉ nói về capability **GHI** (*"mọi capability ghi mở
// đúng một `db.$transaction`"*). Mở một giao dịch cho một lượt đọc là trả giá mà
// không mua gì — đúng câu `searchCompanies` đã ghi ở `../company/index.ts`.
//
// ⚠ `db`, KHÔNG `dbIncludingDeleted`. Bản đã `$extends` tự chèn
// `deleted_at IS NULL` vào mọi lượt đọc (`AD-CR-6` · `AD-14`). Với Phát hiện thì
// cột đó gần như luôn `null` — `AD-14` chốt *"Phát hiện không có đường xoá kể cả
// cho người"*.
//
// ⚠ NHƯNG extension CHỈ chèn vào `where` của model đang truy vấn; nó **không** đi
// xuống quan hệ lồng — đúng cái bẫy `searchCompanies` đã vấp ở `_count`. Bản lưu
// thì xoá mềm được (`D26` liệt nó trong cascade của Công ty), nên vế
// `article: { deletedAt: null }` dưới đây phải viết TAY. Thiếu nó thì một Phát
// hiện treo dưới một Bản lưu đã xoá vẫn mở ra một đoạn văn đáng lẽ không còn.
// Cùng lý do cho vế `snapshot` lồng thêm một tầng nữa.

import type { Actor } from "@/core/actor";
import { db } from "@/core/db";

/// Trần số Phát hiện một lượt đọc trả về. KHÔNG có mã thượng nguồn — đã nêu ra,
/// giống hai hằng `SEARCH_*_LIMIT` của `../company/index.ts`. Nó tồn tại vì mỗi
/// hàng kéo theo trọn đoạn văn của Bản lưu, không vì một yêu cầu nào.
const SIGNAL_READ_LIMIT = 100;

/// Một Phát hiện kèm đoạn văn gốc, đã TUẦN TỰ HOÁ ĐƯỢC.
///
/// ⚠ Mọi `Date` ra khỏi đây dưới dạng chuỗi ISO. Bề mặt gọi hàm này là một khối
/// server của `src/app`, và giá trị của nó đi tiếp qua ranh giới server→client
/// (`AD-UI-5`); `Date` và `Decimal` không qua được ranh giới đó. Không cột nào
/// ở đây là `Decimal`, nên chỉ có ngày phải đổi.
export type AccountSignalView = {
  id: string;
  /// Câu nhận định tiếng Việt (`D33`). Đây là thứ `T-3` bấm vào.
  claim: string;
  /// `BR-D2` — câu trích KHỚP NGUYÊN VĂN một đoạn của Bản lưu. `FR-12` · `D33` —
  /// giữ nguyên **ngôn ngữ gốc** (chỉ `claim` là tiếng Việt). Hai mã khác nhau
  /// cho hai chuyện khác nhau; `BR-D1` là *"không có câu trích thì Phát hiện
  /// không tồn tại"*, không nói gì về ngôn ngữ.
  ///
  /// ⚠ Đây là bản **đã chuẩn hoá**: `createSignal` lưu `at.normalizedQuote`, tức
  /// đúng bằng `article.normalizedText.slice(quoteStart, quoteEnd)`. Bên hiển thị
  /// so hai thứ đó để biết neo còn đúng không, và **không** chuẩn hoá lại.
  quote: string;
  /// `AD-18` · `D21` — chỉ số vào `article.normalizedText`, LƯU SẴN. Bên hiển thị
  /// cắt chuỗi theo hai số này, tuyệt đối không đi tìm lại câu trích.
  quoteStart: number;
  quoteEnd: number;
  signalType: string;
  signalSubtype: string | null;
  /// `FR-16` · `D24` — ba mức, và cả hai nguồn viết nguyên văn *"ký hiệu **và
  /// màu**, không dùng màu đơn độc"*. Nên trả MÃ; chữ hiển thị và ký hiệu sống ở
  /// `src/app`, nơi biết mình đang vẽ cái gì.
  confidence: string;
  relevance: string;
  /// `BR-D7` — ngày sự kiện đọc được trong tin. `null` khi mô hình không đọc ra.
  /// Chuỗi `YYYY-MM-DD`: cột là `@db.Date`, kèm giờ vào là bịa độ chính xác.
  eventDate: string | null;
  /// `FR-42` · `D30` — đã có người bấm *không hữu ích* chưa. Chỉ ĐỌC ở đây;
  /// đường ghi là `markSignalUnhelpful`, không thuộc story này.
  markedUnhelpfulAt: string | null;
  createdAt: string;
  /// Bản lưu sinh ra Phát hiện — `AD-8` khai neo nguồn là BẮT BUỘC, nên trường
  /// này không bao giờ `null`.
  article: {
    id: string;
    /// `AD-18` — bản mà `quoteStart`/`quoteEnd` đánh chỉ số vào. Đây là *"đoạn
    /// văn gốc"* mà `T-3` đòi mở ra, không phải `rawText`.
    normalizedText: string;
    /// `FR-11` — nguồn không đọc được là một trạng thái HỢP LỆ, không phải lỗi.
    /// Bề mặt nói *"không đọc được"* kèm lý do; hệ thống không đoán.
    readable: boolean;
    unreadableReason: string | null;
    publishedUrl: string | null;
    readAt: string;
    /// `§3` — `truoc` / `sau`. *"Trong bản lưu"* của `T-3` là bản lưu NÀO thì
    /// người đọc phải thấy được.
    snapshotVersion: string;
  };
};

/// Kết quả một lượt đọc khu đọc (`FR-14`).
///
/// ⚠ `articleCount` KHÔNG phải một tiện nghi — nó là thứ tách được **hai trạng
/// thái rỗng khác hẳn nhau**, và `EXPERIENCE.md` (hàng `S3`, cột *Rỗng*) đòi đúng
/// sự phân biệt đó: *chưa đọc nguồn nào* (vòng quét chưa chạm Công ty này) khác
/// hẳn *đã đọc N nguồn nhưng không rút ra Phát hiện nào*. Không có con số này thì
/// bề mặt chỉ nói được câu thứ nhất, và nó SAI trong ca thứ hai — người đọc sẽ đi
/// bật lại một vòng quét vốn đã chạy đúng.
export type AccountSignalsView = {
  /// Số Bản lưu còn sống của Công ty. Đếm, không trả danh sách: bề mặt chỉ cần
  /// biết *có hay không*, và kéo cả danh sách về là trả giá không mua gì.
  articleCount: number;
  signals: AccountSignalView[];
};

/// `C1-8` · `T-3` · `FR-14` `FR-15` — mọi Phát hiện của một Công ty, kèm đoạn văn
/// gốc để bề mặt neo câu trích vào.
///
/// ⚠ TRẢ `normalizedText` NGUYÊN ĐOẠN, không cắt sẵn quanh câu trích. `FR-15` nói
/// nguyên văn *"không mở cả trang rồi để người tự dò"*, nhưng vế đó nói về **số
/// bước bấm**, không nói về việc giấu bớt văn bản: `T-3` bước 2 đòi thấy được
/// **đoạn văn gốc**, và cắt một cửa sổ quanh offset ở đây là quyết một chuyện
/// hiển thị ở tầng sai — bề mặt mới là chỗ biết mình có bao nhiêu chỗ.
///
/// ⚠ `_actor` KHÔNG được đọc, và đó là đúng: `AD-CR-10` chốt lõi không đọc
/// `actor.role`, còn ontology nói *"ai cũng thấy mọi Công ty"*. Tham số vẫn có mặt
/// vì `AD-5` bắt mọi hàm lõi nhận `actor` làm tham số đầu.
///
/// ⚠ THỨ TỰ SẮP KHÔNG CÓ MÃ THƯỢNG NGUỒN — đã nêu ra, không im lặng chọn. Không
/// `D` nào chốt thứ tự danh sách Phát hiện (`D31` nói về Hàng đợi gợi ý, chuyện
/// khác hẳn). Vế gần nhất là `FR-11`: *"các Bản lưu của một Công ty xếp theo thời
/// điểm đọc"*, nên tin đọc gần đây nhất lên trước. Hai khoá sau là để có TOÀN THỨ
/// TỰ ổn định: nhiều Phát hiện rút từ **cùng một** Bản lưu mang cùng `readAt` tới
/// từng micro giây, và hai lượt đọc cho hai thứ tự khác nhau làm người dùng tưởng
/// dữ liệu đổi.
///
/// ⚠ KHÔNG viện `AD-UI-12` cho ba khoá này — đã trích sai một lần và đã sửa. Mã
/// đó nói về con trỏ resume và tập Công ty của **vòng quét** sắp theo `account.id`,
/// và nó còn CẤM sắp theo cột do vòng quét tự ghi; khoá đầu ở đây lại đúng là
/// `article.readAt`. Lý do giữ ba khoá là lý do viết ở trên, không phải một mã.
export async function readAccountSignals(
  _actor: Actor,
  accountId: string,
): Promise<AccountSignalsView> {
  const articleCount = await db.article.count({ where: { accountId } });
  const rows = await db.signal.findMany({
    where: {
      accountId,
      // Công ty đã xoá mềm thì `page.tsx` trả 404 ở `ProfileBlock` — nhưng bốn
      // khối của `S3` tải ĐỘC LẬP (`AD-UI-8`), nên khối này có thể render xong
      // trước cái 404 đó. Một vế `where` rẻ hơn nhiều so với việc suy luận về
      // thứ tự hoàn thành của bốn `<Suspense>`.
      account: { deletedAt: null },
      // ⚠ HAI TẦNG, không phải một. `D26` xoá mềm cả Bản chụp lẫn Bản lưu trong
      // cascade của Công ty, và extension không đi xuống quan hệ lồng ở bất kỳ
      // tầng nào — nên bỏ vế `snapshot` thì một Phát hiện treo dưới một Bản chụp
      // đã xoá vẫn mở ra đoạn văn của nó.
      article: { deletedAt: null, snapshot: { deletedAt: null } },
    },
    // ⚠ TRẦN BẮT BUỘC, không phải tối ưu — và ở đây nó gắt hơn `searchCompanies`
    // (trần 200) vì mỗi hàng kéo theo **trọn** `normalized_text` của Bản lưu, chứ
    // không phải vài chục byte siêu dữ liệu. Một Công ty được quét cả buổi có thể
    // sinh hàng trăm Phát hiện trên vài chục Bản lưu; không trần thì lượt render
    // đầu tiên đẩy vài chục MB qua ranh giới server→client và trang treo.
    // KHÔNG phân trang: không `FR` nào đòi, và một tham số `skip` không ai gọi là
    // bề mặt thừa. Cần một dòng chốt nếu bộ dữ liệu thật lớn hơn.
    take: SIGNAL_READ_LIMIT,
    orderBy: [
      { article: { readAt: "desc" } },
      { createdAt: "desc" },
      { id: "desc" },
    ],
    select: {
      id: true,
      claim: true,
      quote: true,
      quoteStart: true,
      quoteEnd: true,
      signalType: true,
      signalSubtype: true,
      confidence: true,
      relevance: true,
      eventDate: true,
      markedUnhelpfulAt: true,
      createdAt: true,
      article: {
        select: {
          id: true,
          normalizedText: true,
          readable: true,
          unreadableReason: true,
          publishedUrl: true,
          readAt: true,
          snapshot: { select: { version: true } },
        },
      },
    },
  });

  const signals = rows.map((r) => ({
    id: r.id,
    claim: r.claim,
    quote: r.quote,
    quoteStart: r.quoteStart,
    quoteEnd: r.quoteEnd,
    signalType: r.signalType as string,
    signalSubtype: r.signalSubtype,
    confidence: r.confidence as string,
    relevance: r.relevance as string,
    // `@db.Date` — cắt lấy phần ngày, không đem giờ và múi giờ đi kèm. Kèm giờ
    // vào một cột chỉ có ngày là bịa độ chính xác, rồi so qua múi giờ lệch một
    // ngày đúng lúc `BR-D7` tính hạn.
    eventDate: r.eventDate === null ? null : r.eventDate.toISOString().slice(0, 10),
    markedUnhelpfulAt:
      r.markedUnhelpfulAt === null ? null : r.markedUnhelpfulAt.toISOString(),
    createdAt: r.createdAt.toISOString(),
    article: {
      id: r.article.id,
      normalizedText: r.article.normalizedText,
      readable: r.article.readable,
      unreadableReason: r.article.unreadableReason,
      publishedUrl: r.article.publishedUrl,
      readAt: r.article.readAt.toISOString(),
      snapshotVersion: r.article.snapshot.version,
    },
  }));

  return { articleCount, signals };
}
