// `AD-9` · `AD-13` · `AD-CR-5` — NƠI DUY NHẤT định nghĩa hai chỉ số.
//
// Bảng đo Quản trị và mọi cảnh báo gọi CÙNG hàm ở đây. Không truy vấn tự chế:
// hai nguồn cho một con số là cách chắc chắn để màn hình nói một đằng, cảnh báo
// nói một nẻo.
//
// Phân xử khi tài liệu lệch nhau (`AD-13`):
//   đề bài §1–§7 > Mục 0 (D1–D47) > PRD > ontology > lược đồ
// Nên định nghĩa dưới đây bám bảng `D30` của PRD, KHÔNG bám ontology §10.

import { db } from "./db";
import type { SuggestionStatus } from "@prisma/client";
import { getSettingNumber } from "./settings";

export type MetricPair = {
  numerator: number;
  denominator: number;
  ratio: number | null; // null khi mẫu số dưới sàn — KHÔNG phải 0
};

function pair(numerator: number, denominator: number, minSample: number): MetricPair {
  return {
    numerator,
    denominator,
    ratio: denominator >= minSample ? numerator / denominator : null,
  };
}

/// `auto-accept rate` — đo HỆ THỐNG khôn lên.
/// Mẫu số: Gợi ý ĐÃ CÓ NGƯỜI QUYẾT. Không gồm Gợi ý còn chờ, và không gồm
/// Gợi ý hệ thống đóng (`FR-51`, `D26`) — không ai quyết gì cả.
/// Tử số: `duyet`. *Sửa-rồi-duyệt* KHÔNG tính (`FR-22`) — hai lối ra khác nhau.
/// Ba lối ra của người (`T-5`). `dong_he_thong` KHÔNG nằm ở đây: Gợi ý hệ thống
/// đóng theo `FR-51`/`D26` không vào mẫu số của chỉ số nào — không ai quyết gì cả.
const DECIDED_STATUSES: SuggestionStatus[] = ["duyet", "sua_roi_duyet", "bo"];

export async function autoAcceptRate(): Promise<MetricPair> {
  const minSample = await getSettingNumber("metrics_min_sample");
  const [den, num] = await Promise.all([
    db.suggestion.count({ where: { status: { in: DECIDED_STATUSES } } }),
    db.suggestion.count({ where: { status: "duyet" } }),
  ]);
  return pair(num, den, minSample);
}

/// `error-detection rate` — đo NGƯỜI khôn lên.
///
/// Đếm theo **Phát hiện phân biệt**, KHÔNG cộng hai bộ đếm sự kiện. Một Phát
/// hiện bị bác qua CẢ HAI đường tính MỘT — cộng chúng lại làm tỉ lệ vượt 100%
/// trên màn hình Quản trị, trước mặt giám khảo.
///
/// Mẫu số: Phát hiện CÓ PHẢN HỒI theo đúng hai đường đó (`D30`).
export async function errorDetectionRate(): Promise<MetricPair> {
  const minSample = await getSettingNumber("metrics_min_sample");

  // đường ①: nút *không hữu ích* trên chính Phát hiện (`FR-42`)
  const unhelpful = await db.signal.findMany({
    where: { markedUnhelpfulAt: { not: null } },
    select: { id: true },
  });

  // đường ②: bỏ một Gợi ý SINH TỪ Phát hiện đó với lý do `thong_tin_sai`
  const droppedWrong = await db.suggestion.findMany({
    where: { status: "bo", dropReason: "thong_tin_sai" },
    select: { signalId: true },
  });

  // Mẫu số: Phát hiện CÓ PHẢN HỒI — và phản hồi gồm CẢ HAI dấu.
  //
  // ⚠ Bản trước chỉ đếm phản hồi TIÊU CỰC (nút *không hữu ích* và Bỏ-kèm-lý-do),
  // nên Duyệt — phản hồi tích cực rõ ràng nhất — không bao giờ vào mẫu số.
  // Số học: 100 Duyệt + 2 Bỏ `khong_lien_quan` + 1 Bỏ `thong_tin_sai` hiện
  // thành **33%** thay vì ~1%. Tên chỉ số nói "tỉ lệ phát hiện lỗi"; con số nói
  // "trong các lời phàn nàn, bao nhiêu phần là phàn nàn về sai sự thật".
  const anyDecided = await db.suggestion.findMany({
    where: { status: { in: DECIDED_STATUSES } },
    select: { signalId: true },
  });

  const wrong = new Set<string>([
    ...unhelpful.map((s) => s.id),
    ...droppedWrong.map((s) => s.signalId),
  ]);
  const responded = new Set<string>([
    ...unhelpful.map((s) => s.id),
    ...anyDecided.map((s) => s.signalId),
  ]);

  return pair(wrong.size, responded.size, minSample);
}

/// `BR-B5` — chỉ số trên QUẦN THỂ, tính lúc đọc, không lưu thành cột.
/// Không có hàng nào để đặt cột lên: nó là tổng hợp trên toàn bộ Phát hiện.
export async function unclassifiedRatio(): Promise<{
  ratio: number | null;
  overThreshold: boolean;
}> {
  const [threshold, minSample] = await Promise.all([
    getSettingNumber("unclassified_ratio_threshold"),
    getSettingNumber("metrics_min_sample"),
  ]);
  // ⚠ Đếm theo `signalSubtype = "unclassified"`, KHÔNG theo `signalType = "other"`.
  //
  // PRD §7.2 định nghĩa `BR-B5` là *"tỉ lệ Phát hiện mang `signal_subtype =
  // unclassified`"*, và §3.2 nói rõ `unclassified` là **một trong 13 giá trị**
  // của `signal_subtype`. Đếm theo `other` gộp cả 12 giá trị kia — `rfp`,
  // `partnership`, `m_and_a`, `dx_initiative`… — vốn đều là phân loại THÀNH
  // CÔNG. Bản trước làm thế, nên báo động bật ngay trên dữ liệu lành, và theo
  // đúng lời chú thích ở dưới: nó *"làm giảm độ tin của mọi cảnh báo khác trên
  // cùng màn hình"*.
  const [total, other] = await Promise.all([
    db.signal.count(),
    db.signal.count({ where: { signalSubtype: "unclassified" } }),
  ]);
  // Dùng CÙNG sàn cỡ mẫu với hai chỉ số kia. Không có nó thì MỘT Phát hiện
  // loại `other` cho tỉ lệ 1,0 > 0,30 và báo động `BR-B5` bật trên bản demo
  // vừa gieo — làm giảm độ tin của mọi cảnh báo khác trên cùng màn hình.
  if (total < minSample) return { ratio: null, overThreshold: false };
  const ratio = other / total;
  return { ratio, overThreshold: ratio > threshold };
}

/// `BR-B6` — nhịp DUYỆT MÙ. Chỉ số ngược dấu với trực giác: duyệt nhanh không
/// phải thành tích, nó là dấu hiệu người đã ngừng kiểm chứng. Đây chính là cái
/// bẫy AI-centric mà phương pháp luận mô tả, đo bằng số.
/// Cửa sổ 24 giờ — đủ dài để phủ một buổi chấm, đủ ngắn để không kéo lịch sử.
const WINDOW_MS = 24 * 60 * 60 * 1000;

export async function blindApprovalSignals(): Promise<{
  tooFast: number;
  burstPerMinute: number;
  overThreshold: boolean;
}> {
  const [secs, perMin] = await Promise.all([
    getSettingNumber("blind_approve_seconds"),
    getSettingNumber("blind_approve_per_minute"),
  ]);

  // CỬA SỔ THỜI GIAN, không phải `take: 200`. Thiếu nó thì một cụm duyệt nhanh
  // đã xảy ra giữ báo động bật suốt 200 quyết định kế tiếp — kể cả khi người
  // dùng đã chậm lại. Chỉ số này đo HÀNH VI HIỆN TẠI, không đo lịch sử.
  const since = new Date(Date.now() - WINDOW_MS);

  const tooFast = await db.suggestion.count({
    where: { decisionSeconds: { lt: secs, not: null }, decidedAt: { gte: since } },
  });

  const recent = await db.suggestion.findMany({
    where: { decidedAt: { gte: since } },
    select: { decidedAt: true },
    orderBy: { decidedAt: "desc" },
  });

  let burst = 0;
  for (let i = 0; i < recent.length; i++) {
    const t0 = recent[i]!.decidedAt!.getTime();
    const n = recent.filter((r) => {
      const d = t0 - r.decidedAt!.getTime();
      return d >= 0 && d < 60_000;
    }).length;
    if (n > burst) burst = n;
  }

  return { tooFast, burstPerMinute: burst, overThreshold: burst > perMin };
}
