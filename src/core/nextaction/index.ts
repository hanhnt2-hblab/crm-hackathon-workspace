// `C5-7` · `C5-13`…`C5-15` · `BR-B1` · `BR-D7` · `BR-D8` · `FR-34` — Việc tiếp theo.
//
// `content` và `dueDate` NULLABLE: `BR-B1` nói thiếu một trong hai vẫn lưu
// được, chỉ mang cờ. Tối đa MỘT hàng đang sống mỗi Cơ hội, canh bằng chỉ
// mục một phần `next_action_one_active`.
//
// Tệp này giữ BA thứ, và spine tầng ⑤ vẽ chúng thành hai tệp
// (`opportunity/next-action.ts` + `opportunity/due.ts`):
//   ① hàm THUẦN tính hạn — `BR-D7`, bảng `0.2.1`, không chạm CSDL
//   ② đường ghi của NGƯỜI — `setNextAction`
//   ③ đường ghi của MÁY — `fillNextActionIfUnchanged` + `undoSystemNextAction`
// Gộp một tệp vì phạm vi cục này chỉ mở `src/core/nextaction/index.ts`; ranh
// giới giữa ba khối vẫn là ranh giới, chỉ không phải ranh giới tệp.

import type { Actor } from "@/core/actor";
/// `AD-CR-7`: lõi TỰ mở giao dịch, nên không nhận `tx` từ ngoài.
import { tx } from "@/core/db";
/// ⚠ Câu nhập RIÊNG cho kiểu. Dạng nội dòng `import { tx, type Tx }` bị luật
/// `no-import-type-side-effects` của `eslint.config.mjs` chặn trên toàn bộ `src/`.
import type { Tx } from "@/core/db";
import type { CoreContext } from "@/core/context";
import { isMachine } from "@/core/actor";
import { isRunning } from "@/core/opportunity/stage";
import { getSettingBool } from "@/core/settings";

// ───────────────────────────────────────────────────────────────────────────
// ① `BR-D7` · `BR-D8` — tính hạn. HÀM THUẦN, không đọc CSDL, không đọc đồng hồ.
// ───────────────────────────────────────────────────────────────────────────
//
// `AD-CR-2` xếp `BR-D7` và `BR-D8` vào ô *"chỉ lõi, hàm thuần"* — không ràng
// buộc CSDL nào, không mã lỗi nào. Chúng không bao giờ TỪ CHỐI gì; chúng trả
// một ngày, hoặc trả `null` nghĩa là *"không đặt"*.
//
// `now` là THAM SỐ, không phải `new Date()` bên trong: sàn và trần của `D7` đo
// từ hôm nay, và một hàm đọc đồng hồ hệ thống thì không kiểm được bằng bảng.

/// Từ vựng ĐÓNG, khớp từng chữ `enum SignalType`/`Confidence`/`Relevance`/
/// `Market` của `AD-CR-11`. Khai lại ở đây thay vì nhập từ `@prisma/client` để
/// khối thuần này kiểm được mà không cần `prisma generate` đã chạy.
export type DueSignalType =
  | "funding" | "leadership" | "expansion" | "hiring" | "new_business" | "other";
export type DueConfidence = "chac" | "co_the" | "doan";
export type DueRelevance = "high" | "medium" | "low";
export type DueMarket = "JP" | "Global" | "KR";

/// Bảng `0.2.1` của Mục 0, nguyên vẹn. Hai đồng hồ KHÁC NHAU trên cùng một
/// hàng, và đề bài gộp chúng làm một:
///   · `windowDays` — **cửa sổ cơ hội**: tin còn giá trị bán hàng bao lâu.
///     Ngày LỊCH, không phải ngày làm việc, vì nó là tuổi thọ của tin.
///   · ba cột còn lại — **ngày hạn**: bao giờ Sales phải chạm. Ngày LÀM VIỆC.
///
/// `null` nghĩa là *"không đặt"*, không phải *"đặt bằng 0"*.
///
/// ⚠ ĐÁNG LẼ Ở BẢNG `settings` (`AD-15`, `D38`: Quản trị sửa được, hiệu lực
/// ngay). Nó nằm cứng ở đây vì `SettingKey` của `@/core/settings` là một từ
/// vựng ĐÓNG và không có khoá nào cho bảng này — thêm khoá là sửa `settings.ts`,
/// nằm ngoài phạm vi cục này. Đây là khoản NỢ đã báo, không phải chỗ quên.
const DUE_TABLE: Record<
  DueSignalType,
  {
    windowDays: number;
    /// `chac` + `high`
    chacHigh: number | null;
    /// `chac` + `medium`, và `chac` + `low` (xem `lookupDueBusinessDays`)
    chacMedium: number | null;
    /// `co_the`, mọi mức liên quan
    coThe: number | null;
  }
> = {
  funding:      { windowDays: 30, chacHigh: 1,  chacMedium: 3,  coThe: 5 },
  leadership:   { windowDays: 90, chacHigh: 3,  chacMedium: 7,  coThe: 10 },
  new_business: { windowDays: 60, chacHigh: 5,  chacMedium: 10, coThe: 14 },
  hiring:       { windowDays: 90, chacHigh: 7,  chacMedium: 14, coThe: 14 },
  expansion:    { windowDays: 90, chacHigh: 7,  chacMedium: 14, coThe: 14 },
  other:        { windowDays: 30, chacHigh: 14, chacMedium: 14, coThe: null },
};

/// `D7` — **trần** 14 ngày làm việc. Quá đó thì việc ấy là nuôi dưỡng, không
/// còn là câu trả lời cho *"why now"*.
/// ⚠ Cùng khoản nợ `settings` như `DUE_TABLE`: `0.2.2` khai nó **cấu hình được**.
const MAX_DUE_BUSINESS_DAYS = 14;

/// `AD-14` — ngày làm việc theo THỊ TRƯỜNG của Công ty, không theo quốc gia
/// (`market` ≠ `country`; ontology §14 nêu đích danh chỗ này hỏng im lặng).
const WEEKEND_BY_MARKET: Record<DueMarket, readonly number[]> = {
  JP: [0, 6],
  Global: [0, 6],
  KR: [0, 6],
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// ───────────────────────────────────────────────────────────────────────────
// `AD-14` · `BR-D7` — LỊCH NGÀY LỄ. Khoản nợ đã báo, nay trả một phần.
// ───────────────────────────────────────────────────────────────────────────
//
// Bản trước của tệp này viết *"ba thị trường dùng CHUNG một lịch: nghỉ Thứ Bảy
// và Chủ Nhật, KHÔNG có ngày lễ"*, và hệ quả đo được: một hạn 3 ngày làm việc
// đặt từ 28/4 rơi vào 1/5 thay vì 7/5 — **sớm hơn thực tế cả Tuần lễ Vàng**.
// Với cửa sổ gấp nhất của bảng `0.2.1` (`funding` + `chac` + `high` = 1 ngày)
// thì lệch đó là toàn bộ thời gian Sales có.
//
// ⚠ CHỖ NÀY LỆCH VỚI SPINE, và lý do phải nói cho đúng. Spine tầng ⑤ xếp
// *"Lịch ngày lễ JP (`AD-14`)"* vào mục **Deferred** với ghi chú *"dữ liệu,
// không phải cấu trúc; gieo cùng seeder"*, và bảng `Setting` (khoá/giá trị) CÓ
// THẬT — nên chỗ để gieo thì có. Cái không có là đường ĐỌC: `computeDueDate` là
// HÀM THUẦN theo `AD-CR-2` (*"chỉ lõi, hàm thuần"*), còn `getSetting` là `async`
// và chạm CSDL. Đọc `settings` từ đây là biến cả chuỗi `computeDueDate` →
// `addBusinessDays` → `isBusinessDay` thành `async`, tức đổi một chữ ký thuần đã
// đóng băng, để lấy một khoá mà hôm nay không màn hình nào sửa.
//
// Nên bảng nằm trong mã, ĐÚNG NHƯ `DUE_TABLE` và `MAX_DUE_BUSINESS_DAYS` ngay
// trên — cùng một khoản nợ `settings`, không phải một khoản nợ mới. `AD-15` cấm
// hằng số nghiệp vụ đông cứng, và ba bảng này đang vi phạm cùng một điều; trả nợ
// đúng cách là nạp cả ba vào lúc dựng rồi truyền xuống làm tham số.
//
// ⚠ ĐÂY LÀ BẢNG TỐI THIỂU, KHÔNG PHẢI LỊCH ĐẦY ĐỦ. Cố ý bỏ: bốn ngày lễ dời
// theo *Happy Monday* (成人の日, 海の日, 敬老の日, スポーツの日 — thứ Hai tuần
// thứ n), hai ngày phân/chí (春分の日, 秋分の日 — tính theo lịch thiên văn, 官報
// công bố trước một năm nên không viết cứng được), và bốn ngày cố định ngoài ba
// khối dưới đây (11/2, 23/2, 3/11, 23/11). Hạn rơi đúng những ngày đó vẫn sớm
// hơn thực tế **một ngày**; ba khối dưới đây là ba khối dài nhất, nơi sai số
// lên tới 5–9 ngày.

type JpHoliday = {
  month: number;
  day: number;
  /// `true` = 祝日 theo *Luật về ngày lễ quốc dân* — chỉ loại này sinh ra 振替休日
  /// khi rơi vào Chủ nhật. `false` = ngày nghỉ theo luật hành chính hoặc theo tập
  /// quán doanh nghiệp; chúng KHÔNG dời.
  statutory: boolean;
  label: string;
};

/// NGUỒN, ghi rõ vì bảng này là một khẳng định về thế giới bên ngoài mã:
///
/// ① 祝日 ngày cố định — *国民の祝日に関する法律* (Luật số 178 năm 1948), danh
///    sách hằng năm do Nội các phủ (内閣府) công bố. Bốn ngày Tuần lễ Vàng
///    (29/4, 3/5, 4/5, 5/5), 元日 (1/1) và 山の日 (11/8) đều là ngày CỐ ĐỊNH
///    trong luật, nên chép được mà không cần dữ liệu theo năm.
/// ② 振替休日 — cùng luật trên, Điều 3 khoản 2: ngày lễ rơi vào Chủ nhật thì
///    ngày kế tiếp **không phải ngày lễ** trở thành ngày nghỉ bù.
/// ③ 29/12–3/1 — *行政機関の休日に関する法律* (Luật số 91 năm 1988) Điều 1: kỳ
///    nghỉ của cơ quan hành chính. Doanh nghiệp theo rộng rãi. KHÔNG phải 祝日,
///    trừ 1/1.
/// ④ Obon 13–16/8 — **KHÔNG** phải ngày lễ theo luật. Đây là kỳ nghỉ theo TẬP
///    QUÁN, phần lớn doanh nghiệp đóng cửa. Ghi vào đây vì `BR-D7` hỏi *"bao giờ
///    Sales chạm được tới khách"*, và một hạn rơi vào Obon là một hạn không ai
///    nhấc máy. Đây là chỗ duy nhất trong bảng dựa trên tập quán chứ trên luật,
///    và nó cần một dòng chốt ở Mục 0 nếu đội muốn giữ.
const JP_HOLIDAYS: readonly JpHoliday[] = [
  // Tết — nguồn ③, trừ 1/1 thuộc nguồn ①
  { month: 1, day: 1, statutory: true, label: "元日 — Nguyên đán" },
  { month: 1, day: 2, statutory: false, label: "Nghỉ Tết — luật ngày nghỉ hành chính" },
  { month: 1, day: 3, statutory: false, label: "Nghỉ Tết — luật ngày nghỉ hành chính" },
  // Tuần lễ Vàng — nguồn ①
  { month: 4, day: 29, statutory: true, label: "昭和の日 — mở màn Tuần lễ Vàng" },
  { month: 5, day: 3, statutory: true, label: "憲法記念日" },
  { month: 5, day: 4, statutory: true, label: "みどりの日" },
  { month: 5, day: 5, statutory: true, label: "こどもの日" },
  // Obon — nguồn ④, cộng 山の日 thuộc nguồn ① dính liền vào khối này
  { month: 8, day: 11, statutory: true, label: "山の日" },
  { month: 8, day: 13, statutory: false, label: "Obon — tập quán" },
  { month: 8, day: 14, statutory: false, label: "Obon — tập quán" },
  { month: 8, day: 15, statutory: false, label: "Obon — tập quán" },
  { month: 8, day: 16, statutory: false, label: "Obon — tập quán" },
  // Cuối năm — nguồn ③
  { month: 12, day: 29, statutory: false, label: "Nghỉ cuối năm — luật ngày nghỉ hành chính" },
  { month: 12, day: 30, statutory: false, label: "Nghỉ cuối năm — luật ngày nghỉ hành chính" },
  { month: 12, day: 31, statutory: false, label: "Nghỉ cuối năm — luật ngày nghỉ hành chính" },
];

/// ⚠ Tra theo THÁNG/NGÀY, không theo năm. `山の日` chỉ có từ 2016 và các ngày
/// nghỉ hành chính đổi qua thời gian, nên một `eventDate` lùi nhiều năm sẽ nhận
/// ngày lễ chưa từng tồn tại. Chấp nhận: `BR-D7` đo từ ngày sự kiện của tin
/// trong Bản lưu, tính bằng tuần chứ không bằng thập kỷ.
function findJpHoliday(d: Date): JpHoliday | undefined {
  const m = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  return JP_HOLIDAYS.find((h) => h.month === m && h.day === day);
}

/// 振替休日 — Điều 3 khoản 2. `d` là ngày nghỉ bù khi chuỗi ngày lễ theo LUẬT
/// đứng liền ngay trước nó bắt đầu từ một Chủ nhật.
///
/// Chuỗi chứ không phải một ngày: 3/5 rơi Chủ nhật thì 4/5 và 5/5 cũng là lễ,
/// nên ngày bù là 6/5 chứ không phải 4/5. Chỉ đi qua ngày lễ `statutory` —
/// Obon và kỳ nghỉ hành chính không nằm trong luật ấy nên không dời.
function isJpSubstitute(d: Date): boolean {
  // Luật nói *"ngày kế tiếp **không phải ngày lễ**"*, nên một ngày vốn đã là lễ
  // KHÔNG phải ngày bù. Vế này không đổi kết quả của `isJpHoliday` (nó OR hai
  // vế), nhưng làm hàm phát biểu đúng luật cho bên nào dùng lại nó để HIỂN THỊ.
  if (findJpHoliday(d) !== undefined) return false;
  let cur = new Date(d.getTime() - MS_PER_DAY);
  // Chuỗi ngày lễ liên tiếp dài nhất trong bảng là 6 ngày (29/12–3/1), nên
  // vòng lặp luôn dừng; trần tường minh để một dòng thêm sai không treo tiến trình.
  for (let i = 0; i < 8; i++) {
    const h = findJpHoliday(cur);
    if (!h || !h.statutory) return false;
    if (cur.getUTCDay() === 0) return true;
    cur = new Date(cur.getTime() - MS_PER_DAY);
  }
  return false;
}

function isJpHoliday(d: Date): boolean {
  return findJpHoliday(d) !== undefined || isJpSubstitute(d);
}

/// ⚠ `Global` và `KR` KHÔNG CÓ LỊCH LỄ, và hai lý do khác nhau — nêu riêng vì
/// gộp chúng làm một khoản nợ che mất rằng một cái sửa được, cái kia thì không:
///   · `Global` không phải một quốc gia, nên không có lịch nào để chép. Cần một
///     quyết định nghiệp vụ (*lấy lịch nào?*), không phải một bảng dữ liệu.
///   · `KR` có Seollal và Chuseok tính theo ÂM LỊCH, nên không viết được thành
///     ngày cố định như bảng JP; nó cần một bảng theo năm hoặc một thư viện lịch.
/// Hệ quả còn nguyên cho hai thị trường này: hạn rơi vào lễ vẫn sớm hơn thực tế.
const HOLIDAY_BY_MARKET: Record<DueMarket, (d: Date) => boolean> = {
  JP: isJpHoliday,
  Global: () => false,
  KR: () => false,
};

/// Cột `signal.event_date` và `next_action.due_date` đều là `@db.Date` — chỉ
/// NGÀY, không giờ. Mọi phép tính chạy trên nửa đêm UTC, vì so ngày qua múi giờ
/// địa phương lệch đúng một ngày, và `BR-D7` có sàn *cuối ngày làm việc kế tiếp*
/// nên lệch một ngày là lệch toàn bộ ý nghĩa.
function atUtcMidnight(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/// Ngày làm việc = không cuối tuần VÀ không ngày lễ của thị trường ấy.
function isBusinessDay(d: Date, market: DueMarket): boolean {
  if (WEEKEND_BY_MARKET[market].includes(d.getUTCDay())) return false;
  return !HOLIDAY_BY_MARKET[market](d);
}

/// *"Cuối ngày làm việc kế tiếp"* của `D7`. Cột là `@db.Date` nên *cuối ngày*
/// không biểu diễn được — NGÀY ĐÓ chính là hạn, và đó là độ chính xác cao nhất
/// mà lược đồ cho phép.
function nextBusinessDay(from: Date, market: DueMarket): Date {
  let d = new Date(atUtcMidnight(from).getTime() + MS_PER_DAY);
  // ⚠ TRẦN TƯỜNG MINH, thêm cùng lúc với bảng ngày lễ. Vòng lặp này trước đây
  // chỉ ăn cuối tuần nên tối đa chạy 2 lượt; giờ nó ăn cả ngày lễ, và một dòng
  // sai trong `JP_HOLIDAYS` (ví dụ khai trọn một tháng) sẽ TREO vòng quét thay
  // vì hỏng ồn ào. Chuỗi nghỉ dài nhất có thật là 29/12–3/1 cộng hai đầu cuối
  // tuần, dưới 12 ngày.
  for (let i = 0; i < 30; i++) {
    if (isBusinessDay(d, market)) return d;
    d = new Date(d.getTime() + MS_PER_DAY);
  }
  throw new Error(
    `Lịch ngày làm việc của thị trường \`${market}\` không có ngày làm việc nào trong 30 ngày.`,
  );
}

function addBusinessDays(from: Date, n: number, market: DueMarket): Date {
  let d = atUtcMidnight(from);
  for (let i = 0; i < n; i++) d = nextBusinessDay(d, market);
  return d;
}

/// ⚠ `chac` + `low` KHÔNG CÓ TRONG BẢNG `0.2.1` — bảng chỉ có hai cột `chac`
/// (`high` và `medium`). Chọn cột `chacMedium` cho nó, tức con số DÀI HƠN: một
/// tin chắc chắn nhưng ít liên quan không đáng gấp bằng tin chắc chắn và liên
/// quan cao. Đây là một PHÉP ĐOÁN có chủ đích, đã báo — không phải một dòng
/// đọc được ra từ Mục 0.
///
/// GIỮ NGUYÊN lựa chọn đó, rà lại 14/8 và đây là căn cứ để giữ: cột `chac+low`
/// hôm nay hầu như không có ai đi qua — `BR-D5`/`D4` chốt *đáng chú ý* =
/// `relevance = high` cộng `chac`/`co_the`, nên một Phát hiện `chac` + `low`
/// không tự đặt gì; con số này chỉ là hạn ĐỀ NGHỊ đi kèm một Gợi ý chờ duyệt.
/// Đổi nó sang `chacHigh` là rút ngắn hạn cho đúng nhóm ít liên quan nhất.
/// VẪN LÀ ĐOÁN: cần một ô thứ ba ở bảng `0.2.1`, hoặc một dòng chốt ở Mục 0.
function lookupDueBusinessDays(
  signalType: DueSignalType,
  confidence: DueConfidence,
  relevance: DueRelevance,
): number | null {
  const row = DUE_TABLE[signalType];
  // `D4`/`BR-D5`: `doan` không bao giờ tự đặt.
  if (confidence === "doan") return null;
  if (confidence === "co_the") return row.coThe;
  // ⚠ ĐOÁN: `low` rơi vào nhánh `chacMedium` vì bảng `0.2.1` không có ô cho nó.
  return relevance === "high" ? row.chacHigh : row.chacMedium;
}

export type ComputeDueDateInput = {
  signalType: DueSignalType;
  confidence: DueConfidence;
  relevance: DueRelevance;
  /// `BR-D7` — đo TỪ NGÀY SỰ KIỆN. `null` khi mô hình không đọc được.
  eventDate: Date | null;
  /// `D5` — chỗ lui khi `eventDate` là `null`: ngày của Bản lưu.
  snapshotDate: Date;
  /// `AD-14` — lịch ngày làm việc lấy theo thị trường Công ty.
  market: DueMarket;
  /// Tham số, không phải `new Date()`. Sàn và trần của `D7` đo từ hôm nay.
  now: Date;
};

/// `BR-D7` — hạn = f(Loại tin, Mức chắc chắn), đo từ ngày sự kiện, theo ngày
/// làm việc của thị trường Công ty.
///
/// Trả `null` nghĩa **không đặt**, và có ĐÚNG HAI đường tới `null`:
///   ① ô bảng là *"không đặt"* — mọi `doan`, và `co_the` của `other`
///   ② `D6` — tin đã **quá cửa sổ cơ hội**: không tự đặt gì, tối đa là một Gợi ý
///
/// Thứ tự bốn bước cuối là quyết định:
///   base → hạn theo bảng → **trần** 14 ngày làm việc → **sàn** ngày làm việc
///   kế tiếp. Sàn đặt CUỐI vì nó là bất biến mạnh nhất (`D7`: *"hạn không bao
///   giờ nằm trong quá khứ"*), và một tin cũ đo từ ngày sự kiện luôn cho một
///   ngày đã qua. Đặt sàn trước trần thì trần kéo ngược nó về quá khứ.
export function computeDueDate(input: ComputeDueDateInput): Date | null {
  const days = lookupDueBusinessDays(input.signalType, input.confidence, input.relevance);
  if (days === null) return null;

  // `D5` — lui về ngày Bản lưu khi không đọc được ngày sự kiện.
  const base = atUtcMidnight(input.eventDate ?? input.snapshotDate);
  const today = atUtcMidnight(input.now);

  // `D6` — quá cửa sổ cơ hội thì không tự đặt gì. Cửa sổ đếm ngày LỊCH: nó là
  // tuổi thọ của tin, không phải một khoảng thời gian làm việc.
  const windowEnd = new Date(base.getTime() + DUE_TABLE[input.signalType].windowDays * MS_PER_DAY);
  if (windowEnd.getTime() < today.getTime()) return null;

  let due = addBusinessDays(base, days, input.market);

  const ceiling = addBusinessDays(today, MAX_DUE_BUSINESS_DAYS, input.market);
  if (due.getTime() > ceiling.getTime()) due = ceiling;

  const floor = nextBusinessDay(today, input.market);
  if (due.getTime() < floor.getTime()) due = floor;

  return due;
}

/// `BR-D8` — nhiều tin cùng lúc thì lấy hạn NGẮN NHẤT, và hạn do máy đặt
/// **không bao giờ bị đẩy ra xa hơn**.
///
/// Một hàm cho cả hai vế, vì chúng là CÙNG MỘT phép: `min`. Vế thứ hai không
/// phải một luật riêng — nó là điều xảy ra khi ứng viên xa hơn hạn đang có.
///
/// ⚠ *"Cùng lúc"* của `BR-D8` là **mọi tin còn trong cửa sổ cơ hội của nó**,
/// không phải cùng một vòng quét. Bên gọi chịu trách nhiệm gom đúng tập đó;
/// hàm này chỉ biết hai ngày.
export function mergeDueDate(current: Date | null, candidate: Date): Date {
  if (!current) return candidate;
  return current.getTime() <= candidate.getTime() ? current : candidate;
}

// ───────────────────────────────────────────────────────────────────────────
// ② Đường ghi của NGƯỜI
// ───────────────────────────────────────────────────────────────────────────

export type SetNextActionInput = {
  opportunityId: string;
  content: string | null;
  dueDate: Date | null;
};

/// `FR-7` · `BR-B1` — thiếu nội dung hoặc thiếu hạn thì **vẫn lưu được**, chỉ
/// mang cờ. Nên không có phép kiểm *"phải điền đủ"* nào ở đây: thêm nó vào là
/// làm `BR-B1` bất khả thi, vì nó ném lỗi CSDL thay vì treo cờ.
///
/// `set_by` SUY TỪ `actor`, không nhận từ tham số — cùng luật một-nguồn mà
/// `appendEntryWithin` dùng cho `added_by`. Người gọi không khai được *"ô này do
/// máy đặt"* trong khi tác nhân là người.
///
/// ⚠ `seed` ghi `nguoi`, KHÁC `appendEntryWithin` vốn cho `seed` ghi `he_thong`.
/// Lệch có chủ đích, và lý do nằm ở chỗ hai cột làm hai việc khác nhau:
/// `added_by` là một NHÃN HIỂN THỊ, còn `set_by` là một CỜ QUYỀN — nó quyết định
/// máy có được ghi đè hay không (`AD-3` nhánh ⓑ). Gắn `he_thong` cho dữ liệu bộ
/// gieo dựng là trao cho máy quyền ghi đè lên thứ do người cung cấp, đúng điều
/// `D12` cấm.
///
/// ⚠ `undo_deadline_at` để `null` ở ĐÂY, luôn luôn. Cửa sổ Hoàn tác chỉ có
/// nghĩa cho lần MÁY tự đặt (`D14`); mở nó cho ô người vừa gõ là bày ra một nút
/// xoá thứ hai đội lốt *hoàn tác*.
export async function setNextAction(
  actor: Actor,
  input: SetNextActionInput,
  ctx: CoreContext,
): Promise<void> {
  const setBy = isMachine(actor) ? "he_thong" : "nguoi";
  await tx(async (t) => {
    const opportunity = await t.opportunity.findUnique({
      where: { id: input.opportunityId },
      select: { id: true },
    });
    if (!opportunity) throw new Error("Cơ hội không tồn tại.");

    // ⚠ `findFirst`, không `findUnique`: bảng là MỘT-NHIỀU (xoá mềm để lại lịch
    // sử), và ràng buộc *đúng một hàng còn sống* nằm ở chỉ mục một phần
    // `next_action_one_active`, không ở kiểu quan hệ.
    const existing = await t.nextAction.findFirst({
      where: { opportunityId: input.opportunityId, deletedAt: null },
      select: { id: true, content: true, dueDate: true, setBy: true },
    });

    if (existing) {
      const after = await t.nextAction.update({
        where: { id: existing.id },
        data: {
          content: input.content,
          dueDate: input.dueDate,
          setBy,
          undoDeadlineAt: null,
          // Người gõ tay thì ô không còn trace về một Phát hiện nào nữa.
          sourceSignalId: null,
        },
        select: { content: true, dueDate: true, setBy: true },
      });
      await ctx.audit.complete(t, ctx.auditId, "ok", {
        before: { content: existing.content, dueDate: existing.dueDate, setBy: existing.setBy },
        after,
      });
      return;
    }

    const row = await t.nextAction.create({
      data: {
        opportunityId: input.opportunityId,
        content: input.content,
        dueDate: input.dueDate,
        setBy,
        undoDeadlineAt: null,
        sourceSignalId: null,
      },
      select: { id: true },
    });
    await ctx.audit.complete(t, ctx.auditId, "ok", {
      before: null,
      after: { id: row.id, content: input.content, dueDate: input.dueDate, setBy },
    });
  });
}

// ───────────────────────────────────────────────────────────────────────────
// ③ Đường ghi của MÁY — `AD-3` chạm ② , `AD-10` kiểm-và-ghi nguyên tử
// ───────────────────────────────────────────────────────────────────────────

/// `D14` · `0.2.2` — cửa sổ Hoàn tác, 7 ngày.
/// ⚠ `0.2.2` khai nó **cấu hình được**; cùng khoản nợ `settings` như `DUE_TABLE`.
const UNDO_WINDOW_DAYS = 7;

export type FillNextActionInput = {
  opportunityId: string;
  /// `FR-34` — giá trị máy ĐÃ ĐỌC. Vế `WHERE` lặp lại nó, nên nếu người vừa sửa
  /// giữa lúc đọc và lúc ghi thì 0 hàng bị chạm và máy bỏ lượt.
  expectedContent: string | null;
  /// ⚠ PHẢI có, không chỉ `expectedContent`. `AD-10` nói vế `WHERE` lặp **toàn
  /// bộ** vị từ, và bản hợp đồng trước chỉ so nội dung — người dời mỗi ngày hạn
  /// mà giữ nguyên chữ vẫn bị máy đè, im lặng.
  expectedDueDate: Date | null;
  content: string;
  dueDate: Date;
  /// `AD-3` — chạm ghi của máy **đòi `signalId` nguồn**. Không tuỳ chọn.
  sourceSignalId: string;
};

/// `FR-34` · `AD-3` · `AD-10` — KIỂM-VÀ-GHI NGUYÊN TỬ.
///
/// Thiếu hàm này thì: vòng quét đọc lúc 10:00:30, người lưu lúc 10:00:31, máy
/// đè lúc 10:00:32 — vi phạm `D12`, đúng thứ nhóm 4 hứa tuyệt đối không làm.
/// Trả `true` khi đã ghi, `false` khi BỎ LƯỢT. Bỏ lượt thì **không thử lại**
/// (`AD-10`): vòng quét sau đọc lại giá trị mới và tự quyết lại.
///
/// `AD-3` cho đúng BA nhánh, và nhánh nào chạy thì `WHERE` của nhánh đó lặp
/// toàn bộ vị từ của chính nó:
///   ⓐ ô **đang trống** — không có hàng nào còn sống
///   ⓑ ô do **chính máy** đặt **và** hạn mới **không xa hơn** hạn đang có
///   ⓒ ô do **người** đặt **và đã quá hạn**, chỉ khi
///      `settings.next_action_overwrite_overdue_manual = true`
///
/// ⚠ Nhánh ⓑ là chỗ dễ đánh rơi nhất. Không có nó thì bất biến *"nhiều tin cùng
/// lúc lấy hạn ngắn nhất"* của `BR-D8` **không có đường cài**: vòng quét sau gặp
/// tin gấp hơn sẽ thấy ô không trống, không phải người đặt, và không nhánh nào
/// khớp.
///
/// ⚠ *"Ô đang trống"* ở đây nghĩa là **không có hàng nào còn sống**, không phải
/// *"có hàng nhưng hai cột đều `null`"*. Một hàng tồn tại luôn CÓ CHỦ
/// (`set_by`), và chủ là thứ quyết định quyền ghi đè — nên hàng rỗng đi qua ⓑ
/// hoặc ⓒ theo chủ của nó, không rơi về ⓐ.
export async function fillNextActionIfUnchanged(
  actor: Actor,
  input: FillNextActionInput,
  ctx: CoreContext,
): Promise<boolean> {
  // `AD-15` — đọc MỖI LẦN DÙNG, và đọc TRƯỚC khi mở giao dịch: `getSettingBool`
  // đi qua `db` (autocommit); gọi nó bên trong giao dịch là một lượt đọc trên
  // kết nối khác, không sai nhưng vô ích.
  const overwriteOverdueManual = await getSettingBool(
    "next_action_overwrite_overdue_manual",
  );

  return tx(async (t) => {
    const now = new Date();
    const today = atUtcMidnight(now);
    const undoDeadlineAt = new Date(now.getTime() + UNDO_WINDOW_DAYS * MS_PER_DAY);

    const opportunity = await t.opportunity.findUnique({
      where: { id: input.opportunityId },
      select: { stage: true, accountId: true },
    });
    if (!opportunity) throw new Error("Cơ hội không tồn tại.");

    // `AD-3` · `D11` — chỉ Cơ hội ở giai đoạn ĐANG CHẠY. `tam_dung` được miễn
    // trừ (`BR-B4`), và Cơ hội đã đóng thì một Việc tiếp theo mới là vô nghĩa.
    if (!isRunning(opportunity.stage)) {
      return skip(t, ctx, "Cơ hội không ở giai đoạn đang chạy.");
    }

    const existing = await t.nextAction.findFirst({
      where: { opportunityId: input.opportunityId, deletedAt: null },
      select: { id: true, content: true, dueDate: true, setBy: true },
    });

    const before = existing
      ? { content: existing.content, dueDate: existing.dueDate, setBy: existing.setBy }
      : null;
    const after = {
      content: input.content,
      dueDate: input.dueDate,
      setBy: "he_thong" as const,
    };

    // ─── ⓐ ô đang trống ───────────────────────────────────────────────────
    if (!existing) {
      // Vế kiểm của `FR-34` cho nhánh này: máy phải đã đọc thấy ô TRỐNG. Đọc
      // thấy có chữ mà giờ không còn hàng nào nghĩa là ai đó vừa xoá — dữ liệu
      // đã đổi, bỏ lượt.
      if (input.expectedContent !== null || input.expectedDueDate !== null) {
        return skip(t, ctx, "Ô đã đổi giữa lúc đọc và lúc ghi.");
      }
      // ⚠ KHÔNG có vế `WHERE` nào để lặp ở đây — `create` không kiểm được cái
      // chưa tồn tại. Lớp canh là chỉ mục một phần `next_action_one_active`:
      // hai lượt quét đồng thời thì một cái ăn lỗi duy nhất và giao dịch của nó
      // cuộn lại, thay vì cả hai cùng chèn. Ngoài ra `AD-12` đã cấp khoá
      // `account_lock` cho mỗi Công ty, nên đường này thực tế không chạy song
      // song với chính nó.
      const row = await t.nextAction.create({
        data: {
          opportunityId: input.opportunityId,
          content: input.content,
          dueDate: input.dueDate,
          setBy: "he_thong",
          undoDeadlineAt,
          sourceSignalId: input.sourceSignalId,
        },
        select: { id: true },
      });
      await notifyAutoSet(t, opportunity.accountId, input.opportunityId, row.id);
      await ctx.audit.complete(t, ctx.auditId, "ok", { before, after });
      return true;
    }

    // ─── ⓑ ô do chính máy đặt, và chỉ để RÚT NGẮN hạn ─────────────────────
    if (existing.setBy === "he_thong") {
      const changed = await t.nextAction.updateMany({
        where: {
          id: existing.id,
          deletedAt: null,
          // `AD-10` — vế `WHERE` lặp TOÀN BỘ vị từ, không chỉ nội dung.
          content: input.expectedContent,
          dueDate: input.expectedDueDate,
          setBy: "he_thong",
          // `BR-D8` — hạn máy đặt KHÔNG BAO GIỜ bị đẩy xa hơn. Hạn đang `null`
          // thì điền vào một ô hạn trống không phải *đẩy xa hơn*, nên nó qua.
          AND: [{ OR: [{ dueDate: null }, { dueDate: { gte: input.dueDate } }] }],
        },
        data: {
          content: input.content,
          dueDate: input.dueDate,
          undoDeadlineAt,
          sourceSignalId: input.sourceSignalId,
        },
      });
      if (changed.count === 0) {
        return skip(t, ctx, "Ô đã đổi, hoặc hạn mới xa hơn hạn đang có.");
      }
      await notifyAutoSet(t, opportunity.accountId, input.opportunityId, existing.id);
      await ctx.audit.complete(t, ctx.auditId, "ok", { before, after });
      return true;
    }

    // ─── ⓒ ô do NGƯỜI đặt và đã quá hạn, chỉ khi cờ bật ───────────────────
    //
    // Đường thoát duy nhất của rủi ro `F36` (Mục 0): nếu dữ liệu BTC điền sẵn
    // Việc tiếp theo cho cả 8 Cơ hội thì *"chỉ khi trống"* làm `T-6` đỏ. Cờ mặc
    // định `false`; bật nó **không sinh capability mới**, chỉ nới vị từ.
    if (!overwriteOverdueManual) {
      return skip(t, ctx, "Ô do người đặt; cờ ghi-đè-quá-hạn đang tắt.");
    }
    const changed = await t.nextAction.updateMany({
      where: {
        id: existing.id,
        deletedAt: null,
        content: input.expectedContent,
        dueDate: input.expectedDueDate,
        setBy: "nguoi",
        // Lặp cả vế *đã quá hạn*, dù `dueDate: expectedDueDate` ở trên đã ghim
        // giá trị: `AD-10` đòi vế `WHERE` phát biểu ĐỦ vị từ, để đọc một mình
        // câu lệnh là thấy hết luật, không phải đi ghép với mã JavaScript quanh nó.
        AND: [{ dueDate: { lt: today } }],
      },
      data: {
        content: input.content,
        dueDate: input.dueDate,
        setBy: "he_thong",
        // ⚠ `undoDeadlineAt` để `null` Ở NHÁNH NÀY, có chủ đích.
        //
        // Hoàn tác của `undoSystemNextAction` khôi phục *nguyên trạng* bằng cách
        // XOÁ MỀM hàng do máy đặt — đúng cho ⓐ và chấp nhận được cho ⓑ, vì cả
        // hai giá trị bị mất đều do máy viết. Ở ⓒ thì giá trị bị đè là thứ NGƯỜI
        // đã gõ, và xoá nó đi là máy huỷ dữ liệu của người — đúng điều `D12`
        // cấm. Khôi phục đúng cần một ô ảnh chụp (`previous_content`,
        // `previous_due_date`, `previous_set_by`) mà `AD-CR-11` không có.
        //
        // Nên nhánh này ghi, và KHÔNG mở cửa sổ Hoàn tác. Khoản NỢ đã báo.
        undoDeadlineAt: null,
        sourceSignalId: input.sourceSignalId,
      },
    });
    if (changed.count === 0) {
      return skip(t, ctx, "Ô đã đổi, hoặc chưa quá hạn.");
    }
    await notifyAutoSet(t, opportunity.accountId, input.opportunityId, existing.id);
    await ctx.audit.complete(t, ctx.auditId, "ok", { before, after });
    return true;
  });
}

/// `T-6` — *"có thông báo"*. Hệ quả dây chuyền của `AD-CR-7` bước ③: CÙNG giao
/// dịch, CÙNG actor. Tách ra ngoài giao dịch thì một thông báo còn lại kể về
/// một lần tự đặt đã bị cuộn lại.
async function notifyAutoSet(
  t: Tx,
  accountId: string,
  opportunityId: string,
  nextActionId: string,
): Promise<void> {
  await t.notification.create({
    data: {
      accountId,
      opportunityId,
      kind: "next_action_auto_set",
      payload: { nextActionId },
    },
  });
}

/// `AD-CR-8` — bỏ lượt ghi là một KẾT CỤC, không phải một khoảng trống.
/// `no_op` là chỗ DUY NHẤT chứng minh được luật *"máy không ghi đè người vừa
/// gõ"* của `AD-10` đã chạy thật.
async function skip(
  t: Tx,
  ctx: CoreContext,
  reason: string,
): Promise<false> {
  await ctx.audit.complete(t, ctx.auditId, "no_op", { after: { reason } });
  return false;
}

/// `D14` · `C5-15` · `T-7` — Hoàn tác MỘT cú bấm trong 7 ngày.
///
/// Đường phổ biến nhất là ô VỐN TRỐNG (nhánh ⓐ: mức tự do chỉ cho điền ô
/// trống), nên *nguyên trạng* ở đó nghĩa là KHÔNG CÓ Việc tiếp theo — xoá mềm
/// hàng, ô về trống, không phải một chuỗi rỗng.
///
/// Xoá MỀM chứ không cứng: `D30` đòi mục bị xoá vẫn còn làm dữ liệu đo, và
/// `AD-14` nói lõi không phát sinh `DELETE`.
///
/// Ba đường tới `false`, và cả ba là NO-OP chứ không phải lỗi:
///   · bấm lần thứ hai — hàng đã xoá mềm, không còn hàng nào khớp
///   · hết cửa sổ 7 ngày — `undo_deadline_at` đã qua
///   · người đã sửa tay — `set_by` đã thành `nguoi`, Hoàn tác KHÔNG ghi đè
///
/// Ghi CÓ ĐIỀU KIỆN, không đọc-rồi-ghi: `AD-10` áp cho mọi lần ghi mà vị từ
/// phụ thuộc trạng thái đang đọc. Người bấm Lưu giữa hai câu lệnh thì hàng đã
/// thành `nguoi`, `updateMany` chạm 0 hàng, và Hoàn tác im lặng bỏ lượt — thay
/// vì xoá mất thứ họ vừa gõ.
///
/// ⚠ `_actor` KHÔNG được đọc, và đó là đúng: Hoàn tác là thao tác của NGƯỜI,
/// nhưng `AD-CR-10` chốt lõi không đọc vai, và `§5` không có ranh giới nào cho
/// nó — nên từ vựng ĐÓNG của `errors.ts` không có mã nào để ném. Chặn máy nằm ở
/// `allowedActors` của mục sổ đăng ký. Tham số vẫn có mặt vì `AD-5` bắt mọi hàm
/// lõi nhận `actor` làm tham số đầu, kể cả khi nó không quyết định gì.
export async function undoSystemNextAction(
  _actor: Actor,
  opportunityId: string,
  ctx: CoreContext,
): Promise<boolean> {
  return tx(async (t) => {
    const now = new Date();

    const target = await t.nextAction.findFirst({
      where: {
        opportunityId,
        deletedAt: null,
        setBy: "he_thong",
        undoDeadlineAt: { gt: now },
      },
      select: { id: true, content: true, dueDate: true },
    });
    if (!target) {
      return skip(t, ctx, "Không có Việc tiếp theo do máy đặt còn trong cửa sổ Hoàn tác.");
    }

    const changed = await t.nextAction.updateMany({
      where: {
        id: target.id,
        deletedAt: null,
        setBy: "he_thong",
        undoDeadlineAt: { gt: now },
      },
      data: { deletedAt: now },
    });
    if (changed.count === 0) {
      return skip(t, ctx, "Ô đã đổi giữa lúc đọc và lúc ghi.");
    }

    // `FR-33` — ghi vết HAI CHIỀU: về giá trị gì. Ở đây *nguyên trạng* là
    // không có Việc tiếp theo nào, nên `after` là `null` tường minh.
    await ctx.audit.complete(t, ctx.auditId, "ok", {
      before: { content: target.content, dueDate: target.dueDate, setBy: "he_thong" },
      after: null,
    });
    return true;
  });
}
