// `AD-UI-5` — hình dạng dữ liệu mà các bề mặt nhận từ capability đọc.
//
// `loadCapability()` trả `BoundCapability<unknown, unknown>` (`AD-CP-1`): sổ
// đăng ký cố ý không lộ kiểu trả về của từng mục, vì tên capability là một từ
// vựng mở lúc chạy. Nên tầng ① khai lại hình dạng nó TRÔNG ĐỢI, đúng một chỗ,
// và mỗi bề mặt ép kiểu về đây thay vì tự ép rải rác.
//
// ⚠ Đây là hợp đồng, không phải tiện nghi: khi `src/capability/caps/ui.ts` đổi
// hình dạng trả về, `tsc` **không** bắt được — hai bên nối nhau qua `unknown`.
// Chỗ duy nhất phát hiện lệch là màn hình. Nên hai tệp đó sửa cùng nhau, và
// mọi trường ở đây đều có một dòng sinh ra nó ở `ui.ts`.
//
// ⚠ Mọi trường đã TUẦN TỰ HOÁ ĐƯỢC: `Decimal` → chuỗi, `Date` → ISO. Lá
// `'use client'` nhận props qua ranh giới server→client, và `Decimal` của
// Prisma không đi qua được ranh giới đó.

export type OpportunityCard = {
  id: string;
  accountId: string;
  name: string;
  /// Chuỗi, không `number` — cột là `Decimal(14,2)` và số dấu phẩy động của
  /// JavaScript làm tròn tiền sai ở đúng chỗ không ai nhìn.
  amount: string | null;
  currency: string | null;
  expectedCloseMonth: string | null;
  stage: string;
  latestOpenStage: string | null;
  /// `null` = CHƯA HỎI, `false` = đã trả lời *không*. Hai thứ khác nhau
  /// (`C5-5`), và hộp hỏi ở `S4` phân biệt được nhờ đó.
  needSignal: boolean | null;
  budgetSignal: boolean | null;
  lossReasons: string[];
  updatedAt: string;
  /// `BR-B1`…`BR-B3` dạng MÃ. Chữ hiển thị ở `_vocab.ts` (`FLAG_LABEL`).
  flags: string[];
};

export type BoardCard = OpportunityCard & { accountName: string };

export type AccountRow = {
  id: string;
  name: string;
  industry: string | null;
  accountType: string | null;
  market: string;
  country: string | null;
  website: string | null;
  watching: boolean;
  updatedAt: string;
  contactCount: number;
  opportunityCount: number;
};

export type AccountListResult = {
  rows: AccountRow[];
  /// Giá trị có thật trong dữ liệu — bộ lọc không bao giờ mời một lựa chọn
  /// trả về 0 dòng (`EXPERIENCE.md`, `S6` hàng *Lỗi*).
  facets: {
    industries: string[];
    markets: string[];
    accountTypes: string[];
  };
};

export type ContactRow = {
  id: string;
  name: string;
  title: string | null;
  email: string | null;
  isPrimary: boolean;
};

export type AccountDetail = {
  account: {
    id: string;
    name: string;
    industry: string | null;
    accountType: string | null;
    market: string;
    country: string | null;
    website: string | null;
    watching: boolean;
    watchReason: string | null;
    createdAt: string;
    updatedAt: string;
  };
  contacts: ContactRow[];
  opportunities: OpportunityCard[];
};

export type TimelineRow = {
  id: string;
  content: string;
  occurredAt: string;
  /// `nguoi` | `he_thong` — suy từ `actor` ở lõi, không nhận từ tham số
  /// (`NFR-19`: máy chỉ THÊM, và nhãn của người thì máy không giả được).
  addedBy: string;
};

export type Overview = {
  accountCount: number;
  contactCount: number;
  opportunityCount: number;
  byStage: Record<string, number>;
  flagged: BoardCard[];
  recentEntries: Array<TimelineRow & { accountId: string; accountName: string }>;
};

export type LoginCandidate = {
  id: string;
  displayName: string;
  email: string;
  role: string;
};
