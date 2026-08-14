// `EXPERIENCE.md` (*Giọng chữ*) · `AD-UI-7` — chữ HIỂN THỊ của tầng ①.
//
// Quy ước cha: lõi và tầng ④ **không chứa chuỗi hiển thị nào**. Giá trị enum
// nghiệp vụ là tiếng Việt KHÔNG DẤU (`tiep_can`, `du_dieu_kien`) vì chúng là
// token của Mục 0 và của lược đồ; chữ đưa cho người đọc là tiếng Việt CÓ DẤU và
// sống ở đây.
//
// ⚠ Thực thể giữ tiếng Anh (`EXPERIENCE.md`): `Account` · `Contact` ·
// `Opportunity` · `Stage` · `Activity` · `Timeline`. Nhưng đề bài và `T-1` gọi
// chúng bằng tiếng Việt — *"công ty, người liên hệ, cơ hội"* — nên nhãn trên
// màn hình theo đề bài, và tên trong mã theo tiếng Anh. Hai chỗ khác nhau, mỗi
// chỗ một quy ước, không trộn.

/// `§5.1` của PRD · `src/core/opportunity/stage.ts` — BẢY giai đoạn, đúng thứ
/// tự bảng Kanban của `S4`. Thứ tự này là thứ tự HIỂN THỊ; luật chuyển tiếp
/// nằm ở hàm thuần `canTransition` của lõi, không nằm ở đây.
export const STAGE_ORDER = [
  "tiep_can",
  "du_dieu_kien",
  "soan_de_xuat",
  "thuong_luong",
  "thang",
  "thua",
  "tam_dung",
] as const;

export type StageValue = (typeof STAGE_ORDER)[number];

export const STAGE_LABEL: Record<StageValue, string> = {
  tiep_can: "Tiếp cận",
  du_dieu_kien: "Đủ điều kiện",
  soan_de_xuat: "Soạn đề xuất",
  thuong_luong: "Thương lượng",
  thang: "Thắng",
  thua: "Thua",
  tam_dung: "Tạm dừng",
};

export function isStageValue(v: string): v is StageValue {
  return (STAGE_ORDER as readonly string[]).includes(v);
}

/// Nhãn của một giá trị giai đoạn đến từ capability đọc — vốn khai `string`, vì
/// `loadCapability` trả `unknown` (`AD-CP-1`). Trả nguyên giá trị khi không
/// nhận ra: một giá trị enum mới hiện dưới dạng token còn hơn hiện rỗng, và
/// chỗ thiếu lộ ra ngay trên màn hình.
export function stageLabel(stage: string): string {
  return isStageValue(stage) ? STAGE_LABEL[stage] : stage;
}

export const MARKET_LABEL: Record<string, string> = {
  JP: "Nhật Bản",
  Global: "Toàn cầu",
  KR: "Hàn Quốc",
};

export const ACCOUNT_TYPE_LABEL: Record<string, string> = {
  traditional: "Doanh nghiệp truyền thống",
  it_solution: "Giải pháp CNTT",
  it_product: "Sản phẩm CNTT",
  tech_based: "Startup công nghệ",
  ito_other: "ITO khác",
};

export const ADDED_BY_LABEL: Record<string, string> = {
  nguoi: "do người ghi",
  he_thong: "do hệ thống thêm",
};

/// Cờ cảnh báo — `BR-B1`…`BR-B3`. `EXPERIENCE.md` (*Mẫu thành phần*): cờ
/// **không chặn thao tác**, chỉ đánh dấu; và mỗi cờ có **chữ** đi kèm, không
/// bao giờ chỉ có màu (*Sàn khả năng tiếp cận*).
export const FLAG_LABEL: Record<string, string> = {
  "BR-B1": "Chưa có Việc tiếp theo",
  "BR-B2": "Thiếu hai dấu hiệu Đủ điều kiện",
  "BR-B3": "Thua mà chưa ghi lý do",
};

/// `E1-S6` — bốn loại Hoạt động của lược đồ. Ghi Hoạt động ở bản dựng này để
/// lại một mục Dòng thời gian (xem chú thích ở `accounts/[id]/actions.ts`).
export const ACTIVITY_TYPE_LABEL: Record<string, string> = {
  gap: "Gặp mặt",
  goi: "Gọi điện",
  gui_thu: "Gửi thư",
  khac: "Khác",
};

/// Định dạng tiền theo `vi-VN`. Đơn vị đi CẶP với con số (`BR-D9`): một con số
/// không đơn vị làm mọi phép tổng trên bảng Cơ hội vô nghĩa.
export function formatAmount(amount: string | null, currency: string | null): string {
  if (amount === null) return "—";
  const n = Number(amount);
  const shown = Number.isFinite(n) ? n.toLocaleString("vi-VN") : amount;
  return currency ? `${shown} ${currency}` : shown;
}

/// Ngày giờ theo `vi-VN`, múi giờ của máy chủ. Không dùng `toLocaleString` với
/// mặc định của môi trường: server và trình duyệt cho hai chuỗi khác nhau và
/// React báo lệch hydration.
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
}
