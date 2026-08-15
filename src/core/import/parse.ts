// Luật thi `3.1` — phân tích bộ dữ liệu BTC. HÀM THUẦN, không chạm CSDL.
//
// Tách khỏi phần ghi để bảng ánh xạ enum kiểm được bằng bảng vào/ra, không cần
// dựng CSDL. Mọi quyết định *"giá trị này thành giá trị nào"* nằm ở đây.
//
// ⚠ MỌI ÁNH XẠ ĐỀU TƯỜNG MINH, VÀ GIÁ TRỊ LẠ THÌ ĐẾM CHỨ KHÔNG ĐOÁN.
// README của BTC nói `company_type` *"đã quy đổi hợp lý nhất"* sang năm loại của
// `§0.1.1`. Đo trên dữ liệu thật thì KHÔNG: có **mười hai** giá trị tự do, kèm
// một lỗi gõ (`Sỉe` ← `SIer`), và sáu ô trống. Đoán bừa là gán sai hơn nửa số
// Công ty ở một cột mà `FR-13` dùng để đổi nghĩa câu nhận định.

/// ⚠ KHÔNG `split("\n")`. `Account.csv` có **89 dòng cho 25 công ty** vì cột
/// `notes` là chuỗi nhiều dòng trong nháy kép. Một bộ tách ngây thơ đọc ra 89
/// công ty rác, và 64 cái trong đó mang tên là một mẩu ghi chú.
///
/// Cài đúng RFC 4180: nháy kép mở/đóng ô, `""` là một nháy kép thật, và xuống
/// dòng bên trong nháy thuộc về ô.
export function parseCsv(text: string): Record<string, string>[] {
  // BOM của Excel. Không gỡ thì khoá cột đầu tiên là `﻿company_code` và
  // mọi lượt tra cột đó trả `undefined` — im lặng, vì object không báo thiếu khoá.
  const s = text.replace(/^﻿/, "");
  const rows: string[][] = [];
  let o: string[] = [];
  let ô = "";
  let trongNhay = false;

  for (let i = 0; i < s.length; i += 1) {
    const c = s[i]!;
    if (trongNhay) {
      if (c === '"') {
        if (s[i + 1] === '"') { ô += '"'; i += 1; } else { trongNhay = false; }
      } else { ô += c; }
      continue;
    }
    if (c === '"') { trongNhay = true; continue; }
    if (c === ",") { o.push(ô); ô = ""; continue; }
    if (c === "\r") continue;
    if (c === "\n") { o.push(ô); rows.push(o); o = []; ô = ""; continue; }
    ô += c;
  }
  if (ô.length > 0 || o.length > 0) { o.push(ô); rows.push(o); }

  const [dau, ...than] = rows;
  if (!dau) return [];
  const cot = dau.map((h) => h.trim());
  return than
    // Dòng rỗng cuối tệp là chuyện thường; một dòng chỉ có dấu phẩy thì không.
    .filter((r) => r.some((v) => v.trim() !== ""))
    .map((r) => Object.fromEntries(cot.map((h, i) => [h, (r[i] ?? "").trim()])));
}

export type AccountTypeValue =
  | "traditional" | "it_solution" | "it_product" | "tech_based" | "ito_other";

/// `§0.1.1` — năm mã. Khoá bên trái là chữ THẬT trong `Account.csv`, viết
/// thường và bỏ khoảng trắng thừa.
///
/// ⚠ `sỉe` là lỗi gõ của `SIer` trong dữ liệu gốc, giữ nguyên ở đây có chủ
/// đích: sửa dữ liệu của BTC là sửa thứ mình không sở hữu, còn ánh xạ cả hai
/// cách gõ về cùng một mã thì không mất gì.
///
/// ⚠ BỐN giá trị CỐ Ý không ánh xạ — `drug store`, `super market chain`,
/// `enduser`, và ô trống. Chúng mô tả **ngành**, không mô tả **quan hệ với
/// HBLAB**, mà `§0.1.1` phân loại theo quan hệ đó. Ép chúng vào `traditional`
/// là bịa một dữ kiện mà `FR-13` sẽ dùng để đổi nghĩa câu nhận định của mô
/// hình. Để `null` và ĐẾM: ô trống trên màn hình đọc được là *chưa biết*, còn
/// một giá trị sai thì không ai phát hiện.
const ACCOUNT_TYPE: Record<string, AccountTypeValue> = {
  "traditional": "traditional",
  "it solution": "it_solution",
  "it product": "it_product",
  "sier/it product": "it_product",
  "tech-based/startup": "tech_based",
  "ito khác": "ito_other",
  // `SIer` = nhà tích hợp hệ thống. Đứng giữa HBLAB và khách cuối, tức đúng
  // quan hệ mà `it_solution` mô tả ở `§0.1.1`.
  "sier": "it_solution",
  "sỉe": "it_solution",
  "it consulting": "it_solution",
  "payment platform": "it_product",
};

export function mapAccountType(raw: string): AccountTypeValue | null {
  return ACCOUNT_TYPE[raw.trim().toLowerCase()] ?? null;
}

export type StageValue =
  | "tiep_can" | "du_dieu_kien" | "soan_de_xuat" | "thuong_luong"
  | "thang" | "thua" | "tam_dung";

/// `§0.1.2` — bảy giai đoạn. Dữ liệu dùng đúng nhãn hiển thị tiếng Việt, nên
/// bảng này khớp sạch: không giá trị nào ngoài bảy.
const STAGE: Record<string, StageValue> = {
  "tiếp cận": "tiep_can",
  "đủ điều kiện": "du_dieu_kien",
  "soạn đề xuất": "soan_de_xuat",
  "thương lượng": "thuong_luong",
  "thắng": "thang",
  "thua": "thua",
  "tạm dừng": "tam_dung",
};

export function mapStage(raw: string): StageValue | null {
  return STAGE[raw.trim().toLowerCase()] ?? null;
}

/// `AD-14` — `market` quyết định lịch ngày làm việc của `BR-D7`, và nó KHÁC
/// `country`. Dữ liệu chỉ có `Japan` và `Singapore`.
///
/// ⚠ Singapore → `Global`, không phải một thị trường riêng: enum có đúng ba
/// giá trị `JP` `Global` `KR`, và `Global` là chỗ mọi thứ ngoài Nhật và Hàn về.
/// Hệ quả đo được: 5 trong 25 Công ty dùng lịch `Global`.
export function mapMarket(country: string): "JP" | "Global" | "KR" {
  const c = country.trim().toLowerCase();
  if (c === "japan" || c === "nhật bản" || c === "jp") return "JP";
  if (c === "korea" || c === "south korea" || c === "hàn quốc" || c === "kr") return "KR";
  return "Global";
}

/// ⚠ `WON` KHÔNG phải mã ISO 4217 — mã đúng của đồng won Hàn Quốc là `KRW`, và
/// cột `currency` của lược đồ là `char(3)`. Để nguyên `WON` thì nó vừa khít ba
/// ký tự và **không lỗi gì cả**, nên sai này sẽ không bao giờ tự lộ ra; nó chỉ
/// hiện khi ai đó định dạng tiền theo mã và không có locale nào khớp.
export function mapCurrency(raw: string): string | null {
  const c = raw.trim().toUpperCase();
  if (c === "") return null;
  if (c === "WON") return "KRW";
  return c.slice(0, 3);
}

/// `Có`/`Không` → boolean. Ô trống là `Không`.
export function mapCo(raw: string): boolean {
  return raw.trim().toLowerCase() === "có";
}

/// `BR-B2` hai ô dấu hiệu — và đây là chỗ hình dạng dữ liệu KHÔNG khớp lược đồ.
///
/// Lược đồ khai `need_signal`/`budget_signal` là `Boolean?`. Dữ liệu BTC là
/// **văn bản tự do**, có ô dài cả đoạn: *"Core banking chạy COBOL, buộc phải
/// thay trước 2027 vì nhà cung cấp ngừng hỗ trợ — CIO nói ở buổi họp
/// 05/08/2026"*. Ba ô trống mỗi cột.
///
/// Quy về `có chữ = true`, và **giữ nguyên văn bản gốc trong `notes`** — mất nó
/// là mất đúng phần bằng chứng mà Sales viết ra, thứ `T-1` gọi là *"cơ hội mang
/// cờ cảnh báo"* khi thiếu.
export function mapSignal(raw: string): boolean | null {
  const t = raw.trim();
  return t === "" ? null : true;
}

/// Tên tệp Bản chụp: `C15-ir-press-after.html` → `{code, page, version}`.
///
/// ⚠ `Snapshots.csv` KHÔNG CÓ trong bộ BTC đã phát, dù README mô tả đủ chín cột
/// của nó. Nên tên tệp là NGUỒN DUY NHẤT để biết một tệp thuộc Công ty nào và
/// là bản trước hay sau. Mất theo: `key_quote` (câu trích BTC đã kiểm chứng
/// khớp từng ký tự), `news_type`, `captured_at`, `source_url`.
///
/// Mất `key_quote` là mất nhiều nhất — nó là đúng thứ `BR-D2` đang vật lộn.
export function parseSnapshotFileName(
  name: string,
): { companyCode: string; page: string; version: "truoc" | "sau" } | null {
  const m = /^([A-Z]\d+)-(.+)-(before|after)\.html$/i.exec(name);
  if (!m) return null;
  return {
    companyCode: m[1]!.toUpperCase(),
    page: m[2]!.toLowerCase(),
    version: m[3]!.toLowerCase() === "before" ? "truoc" : "sau",
  };
}
