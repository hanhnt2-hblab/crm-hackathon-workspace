// `FR-19` · `FR-21` · ontology §6 — SUY ĐỀ NGHỊ, hàm THUẦN.
//
// ⚠ VÌ SAO HỆ THỐNG SUY, KHÔNG PHẢI MÔ HÌNH. Luật bất biến số 4 của lời nhắc
// (`src/agent/prompt.ts`) nói thẳng với mô hình: *"Bạn KHÔNG đề nghị sửa hồ sơ,
// KHÔNG nêu tên ô dữ liệu, KHÔNG nói giá trị hiện tại hay giá trị đề nghị. Bạn
// chỉ nhận định. Việc đề nghị là của hệ thống, không của bạn."*
//
// Đó là một quyết định kiến trúc, không phải sơ suất: một mô hình vừa nhận định
// vừa đề nghị thì hai thứ đi cùng một lượt sinh, và không còn cách nào tách
// *"tin này có thật"* khỏi *"nên ghi giá trị này"*. Tách ra thì Phát hiện vẫn là
// bằng chứng kể cả khi đề nghị sai — và `T-5` đo đúng ranh giới đó.
//
// ⚠ CÁI GIÁ CỦA QUYẾT ĐỊNH ẤY nằm ở đây: hệ thống chỉ đề nghị được những gì nó
// rút được bằng LUẬT VIẾT TAY. Ba ô dưới đây là ba ô có dạng đủ đặc trưng để
// bắt bằng mẫu mà không đoán. Tám ô của `TargetField` thì năm ô còn lại —
// `specialty_area`, `revenue_range`, `deal_value_tier`, `industry`,
// `account_type` — cần đọc hiểu, và hệ thống KHÔNG đề nghị chúng.
//
// Đây là giới hạn phải nói ra chứ không phải lấp liếm: nếu đề bài muốn máy đề
// nghị cả tám ô thì luật số 4 phải mở, và đó là quyết định của người ra đề, không
// phải của tệp này.

import type { TargetField } from "./index";

export type ProposalDraft = {
  targetField: TargetField;
  proposedValue: string;
  /// Vì sao rút được — đi vào nhật ký, không vào cột nào. Một đề nghị không nói
  /// được nó đến từ đâu là thứ người duyệt phải tin mù.
  basis: string;
};

/// Giá trị ĐANG CÓ của ba ô mà hàm này với tới. `null` là *đang trống*.
export type ProposalCurrent = {
  website: string | null;
  country: string | null;
  foundedYear: number | null;
};

/// Danh sách quốc gia hẹp, CÓ CHỦ ĐÍCH. Ba thị trường của `AD-14` là `JP`,
/// `Global`, `KR`; mở rộng danh sách này là mở rộng bề mặt đoán sai, và một đề
/// nghị sai về quốc gia kéo theo lịch ngày làm việc sai qua `BR-D7`.
const QUOC_GIA: ReadonlyArray<readonly [RegExp, string]> = [
  [/\bNhật Bản\b|\bJapan\b/i, "Japan"],
  [/\bHàn Quốc\b|\bKorea\b/i, "South Korea"],
  [/\bSingapore\b/i, "Singapore"],
  [/\bViệt Nam\b|\bVietnam\b/i, "Vietnam"],
];

/// ⚠ Không bắt URL trong ngoặc hay cuối câu kèm dấu chấm: mẫu dừng ở khoảng
/// trắng và ở dấu câu đóng. Một `https://a.com.` lưu kèm dấu chấm là một liên
/// kết hỏng mà người duyệt không nhìn ra khi lướt.
const URL_MAU = /https?:\/\/[^\s<>"')\]]+[^\s<>"')\].,;:]/;

/// `thành lập năm 2014` — dạng duy nhất được nhận. Một con số bốn chữ số đứng
/// một mình có thể là năm doanh thu, năm chứng nhận, hay số lượng nhân viên.
const NAM_MAU = /thành lập năm\s+(\d{4})/i;

/// Trả về ĐỀ NGHỊ ĐẦU TIÊN rút được cho một ô ĐANG TRỐNG, hoặc `null`.
///
/// ⚠ CHỈ ô đang trống. `FR-21` chốt không duyệt thì hồ sơ giữ nguyên vô thời
/// hạn; đề nghị ĐÈ một ô người đã điền là mời người duyệt xoá công của chính họ,
/// và `FR-51` cũng chỉ cho một Gợi ý chờ mỗi ô. Ô đã có giá trị thì máy im lặng.
///
/// ⚠ MỘT đề nghị mỗi lượt, không phải tất cả. `FR-51` đóng Gợi ý cũ khi có cái
/// mới trên cùng ô, nhưng ba ô khác nhau sinh ba Gợi ý cùng lúc thì hàng đợi
/// đầy lên từ một tin duy nhất — và `BR-B6` đo *thời gian quyết mỗi Gợi ý* sẽ
/// đọc thành duyệt mù khi người bấm ba cái liền.
export function deriveProposal(
  articleText: string,
  current: ProposalCurrent,
): ProposalDraft | null {
  if (current.website === null) {
    const m = URL_MAU.exec(articleText);
    if (m) {
      return {
        targetField: "website",
        proposedValue: m[0],
        basis: "địa chỉ web xuất hiện trong Bản lưu",
      };
    }
  }

  if (current.country === null) {
    for (const [mau, gia] of QUOC_GIA) {
      if (mau.test(articleText)) {
        return {
          targetField: "country",
          proposedValue: gia,
          basis: "tên quốc gia xuất hiện trong Bản lưu",
        };
      }
    }
  }

  if (current.foundedYear === null) {
    const m = NAM_MAU.exec(articleText);
    if (m) {
      const nam = Number(m[1]);
      // Biên tỉnh táo: một công ty thành lập năm 1206 hay 2190 là lỗi đọc, không
      // phải dữ liệu. Thà không đề nghị còn hơn đề nghị một con số vô lý — người
      // duyệt thấy nó một lần là mất tin vào cả hàng đợi.
      if (nam >= 1800 && nam <= new Date().getUTCFullYear()) {
        return {
          targetField: "founded_year",
          proposedValue: String(nam),
          basis: "cụm “thành lập năm” trong Bản lưu",
        };
      }
    }
  }

  return null;
}
