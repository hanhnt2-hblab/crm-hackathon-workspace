// `C5-1` · `E1-S1` · `FR-1` — Công ty.
//
// Xoá là XOÁ MỀM và cascade (`D26`). Cascade nêu đích danh ở `cascade`;
// Phát hiện và Dòng thời gian **giữ nguyên** — chúng là bằng chứng.

import type { Actor } from "@/core/actor";
/// `AD-1`: `src/core` KHÔNG được nhập `src/capability` — chiều phụ thuộc là
/// ④ → ⑤, không ngược lại. `Tx` có sẵn ngay trong lõi; nhập `PrismaTx` từ
/// tầng ④ là đi vòng qua chính ranh giới mình thuộc về.
import type { Tx } from "@/core/db";

const CHUA = "chưa hiện thực";

export type CreateCompanyInput = {
  name: string;
  industry: string;
  /// Đúng năm giá trị `0.1.1`, khớp TỪNG CHỮ với `enum AccountType` của lược đồ.
  /// ⚠ Không phải `tech_based`/`ito_other` — hai tên đó không tồn tại trong CSDL.
  accountType: "traditional" | "it_solution" | "it_product" | "tech_startup" | "ito";
  /// `BR-D7` — thị trường quyết LỊCH NGÀY LÀM VIỆC dùng để tính hạn Việc tiếp theo.
  market: "JP" | "Global" | "KR";
  country?: string | null;
  website?: string | null;
};

export function createCompany(_tx: Tx, _actor: Actor, _input: CreateCompanyInput): Promise<{ id: string }> {
  throw new Error(CHUA);
}

export function updateCompany(_tx: Tx, _actor: Actor, _id: string, _patch: Partial<CreateCompanyInput>): Promise<void> {
  throw new Error(CHUA);
}

/// `D26` — xoá mềm. Cascade: Người liên hệ · Cơ hội · Hoạt động · Việc tiếp
/// theo · Bản chụp · Bản lưu · Thông báo. Gợi ý còn chờ chuyển `dong_he_thong`
/// kèm `cong_ty_da_xoa`. Phát hiện và Dòng thời gian KHÔNG xoá.
export function softDeleteCompany(_tx: Tx, _actor: Actor, _id: string): Promise<void> {
  throw new Error(CHUA);
}

/// `E1-S10` — lọc kết hợp được: ngành, loại, quốc gia, nhãn Đang theo dõi.
export function searchCompanies(_actor: Actor, _q: {
  text?: string; industry?: string; accountType?: string; country?: string; watching?: boolean;
}): Promise<unknown[]> {
  throw new Error(CHUA);
}
