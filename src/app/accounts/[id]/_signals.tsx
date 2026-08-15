// `C1-8` · `T-3` · `FR-14` `FR-15` `FR-16` · `AD-18` · `D21` `D24` — khu đọc của
// `S3`: Phát hiện, và bấm vào một Phát hiện thì mở đúng đoạn văn gốc trong Bản
// lưu, có đánh dấu vị trí.
//
// `FR-14` chốt đây là **một khu riêng**, không phải hồ sơ Công ty và không phải
// Dòng thời gian — *"cho Phát hiện chạy thẳng lên Dòng thời gian là biến nhóm 2
// thành nhóm 5"*. `page.tsx` đã dựng đúng khu đó (`<Block title="Phát hiện">`).
//
// ─────────────────────────────────────────────────────────────────────────────
// ⚠ VÌ SAO `<details>`/`<summary>` CHỨ KHÔNG PHẢI MỘT LÁ `'use client'`
//
// `'use client'` là chỉ thị **mức tệp**. Tệp này phải chứa `SignalsBlock` — một
// server component `async` gọi `loadCapability()` — vì `page.tsx` gọi nó với
// **đúng một** tham số `accountId` và không tệp nào khác đọc hộ. Đặt
// `'use client'` lên đầu tệp là giết chính lượt đọc đó.
//
// `<details>` cho đúng hành vi *bấm-để-mở* bằng HTML gốc: không JavaScript,
// không state, và `<summary>` vốn đã bấm được bằng cả chuột lẫn bàn phím
// (`Enter`/`Space`) mà không cần một dòng `role`/`tabIndex` nào — tức sàn tiếp
// cận cao hơn một `<div onClick>`.
//
// ⚠ CHỖ LỆCH ĐÃ NÊU RA, không im lặng chọn bên. `EXPERIENCE.md` giao *"bấm một
// Signal → mở đúng đoạn văn gốc có đánh dấu"* cho bề mặt **`S10` Snapshot
// viewer**, một tuyến `snapshots/[id]` riêng, và spine tầng ① ghi `S7` là bề mặt
// duy nhất không dựng. Nhưng `e2e/T3.spec.ts` mở `/accounts/{id}` rồi đòi cả ba
// bước **trên chính trang đó**, không điều hướng. `AD-13` xếp **đề bài §1–§7
// trên UX**, và `T-3` là đề bài — nên `T-3` đóng bằng khu đọc tại chỗ. Tuyến
// `S10` riêng vẫn còn NỢ; nó là chỗ để xem một Bản lưu không đi từ một Phát hiện.
//
// ⚠ ĐỪNG viện `AD-13` cho quyết định này — đã trích sai một lần và đã sửa. Chuỗi
// phân xử của `AD-13` là `đề bài §1–§7 > Mục 0 > PRD > ontology > lược đồ`, và
// **UX không có mặt trong chuỗi**; `AD-13` im lặng về UX chứ không xếp nó dưới.
// Căn cứ thật thì đơn giản hơn và tra được: `e2e/T3.spec.ts` là `T-3` viết thành
// mã, `T-3` nằm trong §6 của đề bài, và §1–§7 đứng đầu chuỗi. Chỗ `EXPERIENCE.md`
// giao việc cho một tuyến khác là một chỗ lệch THẬT giữa hai tài liệu — đã nêu
// ra, chưa ai phân xử.
// ─────────────────────────────────────────────────────────────────────────────

import { appRegistry } from "../../_registry";
import { currentSession } from "../../_session";
import { formatDateTime } from "../../_vocab";
import { UploadRow } from "./_upload";

/// `BR-D7` — ngày sự kiện, cột `@db.Date`, tới đây dưới dạng `YYYY-MM-DD`.
///
/// ⚠ CỐ Ý KHÔNG dùng `formatDate` của `_vocab.ts`. Hàm đó chạy
/// `new Date("2026-08-12")`, mà chuỗi ngày trần được ECMAScript phân giải là
/// **nửa đêm UTC**, rồi `getDate()` đọc theo giờ máy. Ở bất cứ múi giờ nào âm so
/// với UTC, ngày hiện ra LÙI MỘT NGÀY — đúng cột mà `BR-D7` đo hạn từ đó, và
/// đúng loại lỗi không ai nhìn ra trên một máy đang ở `UTC+7`. Ở đây không có
/// múi giờ nào tham gia: chuỗi vào, chuỗi ra.
function formatDateOnly(ymd: string): string {
  const [y, m, d] = ymd.split("-");
  return y && m && d ? `${d}/${m}/${y}` : ymd;
}

/// Hình dạng `readAccountSignals` của tầng ④ trả về (`AD-UI-5` — đã tuần tự hoá:
/// mọi `Date` là chuỗi ISO).
///
/// ⚠ Khai TẠI CHỖ chứ không thêm vào `src/app/_types.ts`: ba khối mới của
/// `/accounts/[id]` đang được dựng song song bởi ba người, mỗi người chạm đúng
/// một tệp, và `_types.ts` là tệp dùng chung. Cùng cảnh báo của `_types.ts` áp ở
/// đây: `loadCapability()` trả `unknown`, nên `tsc` **không** bắt được lệch hình
/// dạng — tệp này và `src/core/signal/read.ts` sửa cùng nhau.
type SignalRow = {
  id: string;
  claim: string;
  quote: string;
  /// `AD-18` · `D21` — chỉ số vào `article.normalizedText`, **lưu sẵn**. Khối này
  /// chỉ CẮT theo hai số đó; nó không đi tìm lại câu trích và không chuẩn hoá lại.
  quoteStart: number;
  quoteEnd: number;
  signalType: string;
  signalSubtype: string | null;
  confidence: string;
  relevance: string;
  eventDate: string | null;
  markedUnhelpfulAt: string | null;
  createdAt: string;
  article: {
    id: string;
    normalizedText: string;
    readable: boolean;
    unreadableReason: string | null;
    publishedUrl: string | null;
    readAt: string;
    snapshotVersion: string;
  };
};

/// `articleCount` tách hai trạng thái rỗng — xem nhánh rỗng của `SignalsBlock`.
type SignalsResult = { articleCount: number; signals: SignalRow[] };

/// Chỉ `http`/`https` được phép thành một liên kết bấm được.
///
/// ⚠ KHÔNG phải phòng xa. `article.published_url` là dữ liệu **thu thập từ
/// ngoài** — `src/ingest` và vòng quét ghi nó, không ai gõ tay — nên một giá trị
/// `javascript:…` hay `data:text/html,…` lọt vào đó là mã lạ chạy trong phiên của
/// Sales ngay lúc bấm chữ *nguồn*. `target="_blank"` không chặn gì, và
/// `rel="noopener"` chặn chuyện khác hẳn. Lược đồ sai thì KHÔNG render liên kết —
/// không thay bằng một liên kết "đã làm sạch", vì không có bản sạch nào cả.
function safeHttpUrl(url: string | null): { href: string; host: string } | null {
  if (url === null) return null;
  try {
    const p = new URL(url);
    if (p.protocol !== "http:" && p.protocol !== "https:") return null;
    // Trả kèm TÊN MIỀN để chữ liên kết nói được người dùng sắp đi đâu. Một liên
    // kết chỉ ghi *"nguồn"* buộc người ta bấm rồi mới biết mình rời trang đi đâu
    // — mà nội dung này do vòng quét thu về, không do ai trong đội gõ.
    return { href: url, host: p.host };
  } catch {
    return null;
  }
}

/// `0.1.4` Mục 0 — sáu Loại tin. Chữ hiển thị sống ở `src/app` (quy ước cha: lõi
/// và tầng ④ không chứa chuỗi hiển thị).
const SIGNAL_TYPE_LABEL: Record<string, string> = {
  funding: "Gọi vốn",
  // Nhãn của `0.1.4`, không phải một cách nói gọn tự chế.
  leadership: "Nhân sự cấp cao",
  expansion: "Mở rộng",
  hiring: "Tuyển dụng",
  new_business: "Mảng kinh doanh mới",
  other: "Khác",
};

/// `0.1.5` Mục 0 · `D2` — 13 `signal_subtype`, từ vựng ĐÓNG, chỉ tồn tại khi
/// `signalType = other`. Có bản đồ ở đây vì không có nó thì mã máy (`m_and_a`,
/// `roadmap_delay`) hiện thẳng lên màn hình giám khảo giữa một khối tiếng Việt.
const SIGNAL_SUBTYPE_LABEL: Record<string, string> = {
  rfp: "Mời thầu",
  partnership: "Hợp tác",
  compliance: "Tuân thủ",
  m_and_a: "Sáp nhập · mua lại",
  roadmap_delay: "Lộ trình trễ",
  dx_initiative: "Chuyển đổi số",
  certification: "Chứng nhận",
  downturn: "Cắt giảm",
  legacy_modernization: "Hiện đại hoá hệ thống cũ",
  ai_signal: "Tín hiệu AI",
  remote_team: "Đội từ xa",
  event: "Sự kiện",
  unclassified: "Chưa phân loại",
};

/// `0.1.3` Mục 0 — ba Mức chắc chắn, và CHỮ lấy đúng nhãn của `0.1.3`
/// (`Chắc` / `Có thể` / `Đoán`), không phải một bản diễn đạt lại cho êm tai.
///
/// `FR-16` · `D24` viết nguyên văn *"ký hiệu **và màu**, không dùng màu đơn
/// độc"*. Cặp `[ký hiệu, chữ]` ở đây làm hơn mức luật đòi và làm đúng hướng: ký
/// hiệu là thứ luật nêu tên, chữ là thứ đọc được thành tiếng. Cả hai đều sống sót
/// qua một ảnh chụp đen trắng, và không ô nào ở đây phân biệt bằng màu.
///
/// ⚠ BỘ KÝ HIỆU LÀ ĐỘI CHỌN, không có mã thượng nguồn. `FR-16`/`D24` đòi *có* ký
/// hiệu, không chốt ký hiệu nào. Nêu ra để người sau đổi mà không phải đi tìm một
/// dòng chốt không tồn tại.
const CONFIDENCE_LABEL: Record<string, [string, string]> = {
  chac: ["●●●", "Chắc"],
  co_the: ["●●○", "Có thể"],
  doan: ["●○○", "Đoán"],
};

/// `0.1.6` — ba bậc Độ liên quan. Ký hiệu cùng một mức tự chọn như trên.
const RELEVANCE_LABEL: Record<string, [string, string]> = {
  high: ["▲", "Liên quan cao"],
  medium: ["▶", "Liên quan trung bình"],
  low: ["▽", "Liên quan thấp"],
};

/// `§3` — hai phiên bản Bản chụp, cộng nguồn thứ ba do người tải lên (`U8`).
const SNAPSHOT_VERSION_LABEL: Record<string, string> = {
  truoc: "trước",
  sau: "sau",
  tai_lieu: "tài liệu",
};

/// Cụm mô tả nguồn của một Bản lưu.
///
/// ⚠ Vì sao là một HÀM chứ không phải nối chuỗi tại chỗ như trước: chữ cũ cứng
/// là *"Bản lưu · bản chụp {nhãn}"*, và với nguồn `tai_lieu` nó đọc thành **"bản
/// chụp tài liệu"** — một cụm vô nghĩa. Tài liệu người tải lên không phải bản
/// chụp của trang web nào, nên nó không được mang chữ đó.
function nguonBanLuu(version: string): string {
  if (version === "tai_lieu") return "tài liệu";
  return `bản chụp ${SNAPSHOT_VERSION_LABEL[version] ?? version}`;
}

/// Kiểu của thẻ `<mark>`.
///
/// ⚠ Đặt nội tuyến vì `src/app/globals.css` **không có** luật nào cho `mark` và
/// tệp đó nằm ngoài phần tôi sở hữu. Khai cả `backgroundColor` LẪN `color`, không
/// chỉ nền: để trống chữ thì trong giao diện tối, chữ sáng nằm trên nền vàng và
/// độ tương phản rơi xuống dưới sàn — tô sáng để dễ đọc mà thành khó đọc hơn.
///
/// ⚠ CẶP MÀU LÀ ĐỘI CHỌN, không có mã thượng nguồn và không lấy từ `DESIGN.md`.
/// Căn cứ duy nhất là tương phản: `#1f1300` trên `#fde68a` đạt trên 12:1, tức
/// vượt sàn `AA` cho chữ thường. Khi khu đọc được gom vào bảng kiểu chung, hai
/// hằng nội tuyến này là chỗ phải xoá và thay bằng token chủ đề.
/// Kiểu của đoạn văn gốc.
///
/// ⚠ `whiteSpace: "pre-wrap"` KHÔNG phải trang trí. Mặc định của HTML gộp mọi
/// xuống dòng thành một dấu cách, nên một bài báo nhiều đoạn hiện ra thành một
/// khối chữ liền — và người đọc mất đúng cái ngữ cảnh mà *"đánh dấu vị trí"* dựa
/// vào để mà định vị. Cùng lý do với `overflowWrap`: một URL dài không ngắt được
/// làm đoạn văn tràn ngang và đẩy `<mark>` ra ngoài màn hình.
///
/// ⚠ Nội tuyến vì `src/app/globals.css` không có luật nào cho `.article-passage`
/// và tệp đó nằm ngoài phần tôi sở hữu. Đây là ràng buộc TỔ CHỨC, không phải kỹ
/// thuật, và hệ quả có thật: kiểu nội tuyến thắng mọi luật CSS về sau. Khi khu
/// đọc được gom vào bảng kiểu chung thì hai hằng này là chỗ phải xoá.
const PASSAGE_STYLE = {
  whiteSpace: "pre-wrap",
  overflowWrap: "anywhere",
  marginTop: 4,
} as const;

const MARK_STYLE = {
  backgroundColor: "#fde68a",
  color: "#1f1300",
  padding: "0 2px",
  borderRadius: 2,
} as const;

/// `T-3` · `C1-8` — khối Phát hiện. Server component; đây là chỗ DUY NHẤT của
/// khối này đi xuống, và nó đi qua `loadCapability()` (`AD-1`).
///
/// ⚠ `AD-UI-5` viết nguyên văn *"chỉ `page.tsx` và `layout.tsx` được gọi
/// `loadCapability()`"*. Tệp này không phải hai tệp đó. Đã NÊU RA thay vì im
/// lặng: `page.tsx` gọi `SignalsBlock({accountId})` và chỉ truyền xuống một chuỗi
/// id, nên lượt đọc **bắt buộc** nằm ở đây; hai khối anh em (`_suggestions.tsx`,
/// `_next-action.tsx`) đứng cùng hình dạng. Cái luật đó thật sự canh — *lá
/// `'use client'` không tự đọc* — vẫn nguyên: tệp này là server component.
export async function SignalsBlock({ accountId }: { accountId: string }) {
  const session = await currentSession();
  const read = await appRegistry.loadCapability("readAccountSignals", session.actor);
  const { articleCount, signals } = (await read({ accountId })) as SignalsResult;

  return (
    <section className="card">
      <h2 className="card-title">Phát hiện · {signals.length}</h2>

      {/* `U8` — hàng tải tài liệu nằm TRONG khối này, không phải một `Block`
          thứ sáu: đây là nơi Bản lưu và Phát hiện sống, nên hệ quả nằm cạnh
          nguyên nhân. Đặt TRÊN danh sách vì nó là thao tác, còn phần dưới là
          kết quả. */}
      <UploadRow accountId={accountId} />

      {/* Số Bản lưu là thứ đổi NGAY sau một lượt tải, trong khi Phát hiện phải
          chờ vòng quét. Hiện nó ở đây để người vừa tải có một con số xác nhận
          thay vì một danh sách không đổi. */}
      <p className="field-note">
        {articleCount === 0
          ? "Chưa có bản lưu nào cho công ty này."
          : `${articleCount} bản lưu đã đọc cho công ty này.`}
      </p>

      {signals.length === 0 ? (
        // `AD-UI-8` — trạng thái RỖNG chỉ tới được **sau** một lượt đọc thành
        // công trả về 0 dòng; nó không bao giờ là giá trị mặc định trước khi đọc.
        //
        // ⚠ HAI CÂU, vì đây là HAI trạng thái rỗng khác hẳn nhau và gộp chúng là
        // nói sai một nửa số ca. Câu đầu lấy nguyên hàng `S3` cột *Rỗng* của
        // `EXPERIENCE.md`; câu sau là ca *đã đọc nguồn, không rút ra gì*, và nếu
        // dùng câu đầu cho nó thì người đọc sẽ đi bật lại một vòng quét vốn đã
        // chạy đúng.
        <p className="empty">
          {articleCount === 0 ? (
            <>
              {/* `EXPERIENCE.md` viết *"account"*; đổi thành *"công ty"* cho khớp
                  phần còn lại của bản dựng — `page.tsx`, `_vocab.ts` và mọi khối
                  khác đều gọi thực thể này là Công ty, và hai tên cho một danh từ
                  trên cùng một màn hình là chỗ người đọc phải tự nối. Đã nêu ra.
                  Câu sau KHÔNG bảo *"bật Đang theo dõi"*: khối này không đọc cờ
                  đó, nên bảo bật một cờ vốn đã bật là dặn sai. */}
              Chưa đọc nguồn nào cho công ty này. Khi công ty đang được theo dõi,
              vòng quét sẽ đọc nguồn của nó ở chu kỳ tới.
            </>
          ) : (
            <>
              Đã đọc {articleCount} nguồn cho công ty này nhưng chưa rút ra Phát
              hiện nào. Không có gì phải làm — nguồn không mang tin đáng chú ý
              cũng là một kết quả.
            </>
          )}
        </p>
      ) : (
        <ul className="signal-list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {signals.map((s) => (
            <SignalItem key={s.id} signal={s} />
          ))}
        </ul>
      )}
    </section>
  );
}

/// Một Phát hiện: dải nhãn luôn hiện, câu nhận định bấm được, đoạn văn gốc mở ra.
///
/// ⚠ `<summary>` chứa **ĐÚNG** câu nhận định và không gì khác. Đó là ràng buộc
/// của `T-3` bước 1: phép kiểm dùng `getByText(claim, { exact: true })`, tức nó
/// đòi một phần tử mà **toàn bộ** chữ bằng đúng câu nhận định. Nhét thêm một nhãn
/// vào trong `<summary>` là làm phần tử đó hết khớp, và phép kiểm phải đi tìm một
/// phần tử con — một tầng gián tiếp không ai đọc ra từ mã. Nên dải nhãn đứng
/// NGOÀI `<summary>`, ngay trên nó, và vẫn hiện khi đoạn văn đang đóng.
function SignalItem({ signal: s }: { signal: SignalRow }) {
  const [confSymbol, confText] = CONFIDENCE_LABEL[s.confidence] ?? ["○○○", s.confidence];
  const [relSymbol, relText] = RELEVANCE_LABEL[s.relevance] ?? ["·", s.relevance];

  return (
    <li className="card" style={{ marginTop: 12 }}>
      <div className="row">
        <span className="tag">{SIGNAL_TYPE_LABEL[s.signalType] ?? s.signalType}</span>
        {s.signalSubtype ? (
          <span className="tag">
            {SIGNAL_SUBTYPE_LABEL[s.signalSubtype] ?? s.signalSubtype}
          </span>
        ) : null}
        {/* `FR-16` · `D24` — ký hiệu ĐI KÈM chữ, không bao giờ chỉ có màu. */}
        <span className="tag">
          {confSymbol} {confText}
        </span>
        <span className="tag">
          {relSymbol} {relText}
        </span>
        {s.eventDate ? (
          <span className="muted">Ngày sự kiện {formatDateOnly(s.eventDate)}</span>
        ) : null}
        {s.markedUnhelpfulAt ? (
          <span className="tag tag-warn">⚠ Đã đánh dấu không hữu ích</span>
        ) : null}
      </div>

      <details>
        <summary style={{ cursor: "pointer", fontWeight: 600, padding: "4px 0" }}>
          {s.claim}
        </summary>
        <ArticlePassage signal={s} />
      </details>
    </li>
  );
}

/// `T-3` bước 2 và 3 — *"mở đúng đoạn văn gốc trong bản lưu, có đánh dấu vị trí"*.
///
/// ⚠ Cắt `normalizedText` thành BA mảnh theo `[quoteStart, quoteEnd)` rồi bọc mảnh
/// giữa bằng `<mark>`. Hiện **trọn** đoạn văn, không chỉ câu trích: `T-3` phân
/// biệt rõ hai thứ đó, và một bề mặt chỉ hiện lại câu trích thì *"đánh dấu vị
/// trí"* không có nghĩa gì — không có gì quanh nó để mà định vị.
///
/// ⚠ `<mark>` là THẺ NGỮ NGHĨA, không phải một class trang trí: nó là cách HTML
/// phát biểu *"đoạn này được làm nổi vì liên quan"*, và nó nằm trong cây khả
/// truy cập với vai `mark` — khác hẳn một `<span className="highlight">`, thứ tô
/// vàng y hệt trên màn hình nhưng không mang nghĩa nào. Đừng thay.
///
/// ⚠ NÓI VỪA ĐỦ, đừng nói quá: `e2e/T3.spec.ts` viết *"trình đọc màn hình công bố
/// nó"*, và câu đó **chưa được đội kiểm chứng**. Phần lớn trình đọc màn hình
/// KHÔNG đọc ranh giới `<mark>` ở cấu hình mặc định; muốn chắc thì phải thêm chữ
/// ẩn hoặc `::before`/`::after` với `content`. Cái tra được và đủ để giữ thẻ này
/// là vế còn lại: `<mark>` mang **nghĩa**, class thì không.
function ArticlePassage({ signal: s }: { signal: SignalRow }) {
  const text = s.article.normalizedText;
  const sourceUrl = safeHttpUrl(s.article.publishedUrl);

  // `BR-D2` — vế kiểm TRƯỚC KHI TÔ. `createSignal` lưu `quote` dưới dạng đã chuẩn
  // hoá, đúng bằng `normalizedText.slice(start, end)`, nên hai vế phải trùng. Nếu
  // không trùng thì neo đã hỏng — đổi hàm chuẩn hoá mà chưa tính lại offset của
  // Phát hiện cũ (`AD-18`, `normalizer_version`) là đường hỏng đã lường trước.
  //
  // Khi đó KHÔNG đoán lại vị trí và KHÔNG đi tìm lại chuỗi: tô nhầm chỗ tệ hơn
  // không tô, vì nó trông y như đã tô đúng. `EXPERIENCE.md` (hàng `S10`, cột
  // *Lỗi*) chốt đúng cách xử này: *"mở bản lưu ở đầu và nói rõ"*.
  const anchored =
    s.quoteStart >= 0
    && s.quoteEnd <= text.length
    && s.quoteStart < s.quoteEnd
    && text.slice(s.quoteStart, s.quoteEnd) === s.quote;

  return (
    <div style={{ marginTop: 8 }}>
      <p className="muted">
        Bản lưu · {nguonBanLuu(s.article.snapshotVersion)}
        {" · đọc lúc "}
        {formatDateTime(s.article.readAt)}
        {sourceUrl ? (
          <>
            {" · "}
            <a href={sourceUrl.href} target="_blank" rel="noopener noreferrer">
              nguồn: {sourceUrl.host}
            </a>
          </>
        ) : null}
      </p>

      {/* `FR-11` — nguồn không đọc được là một trạng thái HỢP LỆ. Nói rõ **kèm lý
          do**, và hệ thống không đoán nội dung thay.

          `role="status"` chứ KHÔNG `role="alert"`: chữ này render sẵn từ máy chủ
          và có mặt ngay lúc trang tải. `alert` là vùng sống *assertive* dành cho
          nội dung XUẤT HIỆN sau đó; đặt nó trên chữ tĩnh thì trình đọc màn hình
          hoặc bỏ qua, hoặc cắt ngang người dùng sai thời điểm. */}
      {s.article.readable ? null : (
        <p className="failed" role="status">
          Nguồn không đọc được.{" "}
          {s.article.unreadableReason
            ? `Lý do: ${s.article.unreadableReason}.`
            : "Không có lý do nào được ghi lại."}{" "}
          Phần văn bản dưới đây là những gì đã lưu được.
        </p>
      )}

      {text.length === 0 ? (
        // Bản lưu không lưu được ký tự nào. Nói ra, đừng để một khoảng trắng —
        // một khối rỗng không lời giải thích đọc thành *giao diện hỏng*, và
        // `FR-11` chốt hệ thống KHÔNG đoán thay nội dung.
        <p className="empty">Bản lưu này không giữ được nội dung văn bản nào.</p>
      ) : anchored ? (
        // BA MẢNH, và `<mark>` bọc ĐÚNG mảnh giữa — không bọc cả đoạn.
        <p className="article-passage" style={PASSAGE_STYLE}>
          {text.slice(0, s.quoteStart)}
          <mark style={MARK_STYLE}>{text.slice(s.quoteStart, s.quoteEnd)}</mark>
          {text.slice(s.quoteEnd)}
        </p>
      ) : (
        <>
          <p className="article-passage" style={PASSAGE_STYLE}>{text}</p>
          <p className="failed" role="status">
            Không neo được câu trích vào đoạn văn này, nên đoạn văn mở ở đầu và
            không có chỗ nào được đánh dấu. Câu trích đã lưu: “{s.quote}”.
          </p>
        </>
      )}
    </div>
  );
}
