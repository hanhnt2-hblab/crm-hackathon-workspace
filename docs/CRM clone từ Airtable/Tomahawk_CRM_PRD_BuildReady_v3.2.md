# TOMAHAWK CRM — PRD BUILD-READY SPECIFICATION

**Version:** 3.2 (build-ready + kiểm toán triết lý + vai trò sales_admin)
**Ngày:** 08/2026
**Loại tài liệu:** Đặc tả kỹ thuật đủ chi tiết để AI agent code toàn bộ hệ thống
**Thay thế:** `Tomahawk_CRM_Kien_Truc_v1.md` (tài liệu nghiên cứu — vẫn giữ để tham chiếu bối cảnh)

---

## 0. HƯỚNG DẪN SỬ DỤNG TÀI LIỆU NÀY

### 0.1. Tài liệu này viết cho ai

Tài liệu này được viết để **một AI coding agent (hoặc một team dev) có thể build toàn bộ hệ thống mà không cần hỏi thêm**. Mọi phần "triết lý", "tầm nhìn", trích dẫn CEO, ngôn ngữ marketing đã bị loại bỏ. Thay vào đó là:

- Schema DDL đầy đủ (copy-paste chạy được)
- Business rule viết dưới dạng pseudocode/TypeScript
- API contract đầy đủ (method, path, request, response, error)
- Đặc tả từng màn hình: layout, component, hành vi, phím tắt
- Acceptance criteria dạng Given/When/Then

### 0.2. Quy ước trong tài liệu

| Ký hiệu | Nghĩa |
|---|---|
| `[MUST]` | Bắt buộc có ở v1. Không có = không nghiệm thu |
| `[SHOULD]` | Nên có ở v1, có thể lùi v1.1 nếu hết thời gian |
| `[LATER]` | Không làm ở v1, ghi lại để không thiết kế chặn đường |
| `[DECIDE]` | Cần người quyết định trước khi code phần đó. **Có giá trị mặc định để không bị chặn** |
| `⚠️` | Cảnh báo lỗi đã xảy ra ở hệ thống cũ, không được lặp lại |

### 0.3. Thứ tự đọc để build

```
Phần 1  → hiểu phạm vi, đọc 10 phút
Phần 2  → cài môi trường, dựng skeleton
Phần 3  → chạy migration, có DB
Phần 4  → implement business logic layer
Phần 5  → implement API
Phần 6-7 → implement UI
Phần 8  → implement AI layer
Phần 9  → implement background jobs
Phần 10 → implement phân quyền (làm SỚM, không để cuối)
Phần 11 → seed 63 view + 8 báo cáo dựng sẵn
Phần 12 → migrate dữ liệu từ Airtable
Phần 13 → chạy acceptance test
Phần 14 → thứ tự sprint chi tiết
Phần 15 → KIỂM TOÁN TRIẾT LÝ + 5 hạng mục bổ sung
Phụ lục A → 13 điểm cần quyết định (4 đã chốt)
Phụ lục B → 20 lỗi của hệ thống cũ và cách tránh
```

⚠️ **Hai phần dễ bị bỏ sót nhất, nhưng quyết định sản phẩm có được dùng hay không:**
- **Phần 11** — nếu build Phần 1-10 mà bỏ Phần 11, người dùng nhận một hệ thống trống trơn và phải tự dựng lại 71 view họ đã có trên Airtable.
- **Phần 15** — Phần 1-14 đặc tả một ứng dụng CRM có **schema cố định**. Airtable là **nền tảng**. Phần 15 bổ sung custom field, formula/rollup do người dùng tạo, form, page và automation builder. **Đọc Phần 15 trước khi ước lượng timeline.**

⚠️ **Phần 10 (phân quyền) phải implement từ đầu, không phải cuối.** Nếu để cuối, sẽ phải sửa lại toàn bộ tầng data access.

---

## 1. PHẠM VI HỆ THỐNG

### 1.1. Tomahawk CRM là gì — mô tả cụ thể

Tomahawk CRM là một **web application quản lý bán hàng cho công ty IT outsourcing**, gồm 5 khối chức năng:

| Khối | Mô tả cụ thể |
|---|---|
| **A. Data workspace** | Giao diện dạng bảng tính (spreadsheet-like). Người dùng xem và sửa dữ liệu trực tiếp trong ô của bảng, không phải mở form riêng. Mỗi bảng dữ liệu có nhiều "view" đã lưu (bộ lọc + sắp xếp + cột hiện + độ rộng cột). Trạng thái view được lưu riêng cho từng người dùng và khôi phục khi mở lại |
| **B. Sales pipeline** | Quản lý Account (công ty khách), Contact (người), Opportunity (cơ hội), Contract (hợp đồng), Pipeline forecast (dự báo doanh thu theo nhân lực/tháng) |
| **C. Activity tracking** | Mọi tương tác với khách (email, họp, gọi, ghi chú) là một bản ghi có cấu trúc, được tạo tự động từ đồng bộ email/lịch hoặc nhập tay |
| **D. KPI & reporting** | Đặt chỉ tiêu cho cá nhân/nhóm/công ty theo tuần/tháng/quý/năm. Tự động tính kết quả thực tế. Màn hình họp tuần tổng hợp sẵn |
| **E. AI assistant** | Chatbot truy vấn dữ liệu bằng tiếng Việt/Anh, sinh báo cáo, và đề xuất cập nhật dữ liệu (có bước xác nhận). Cộng các tính năng AI nhúng trong bảng: tự điền thông tin công ty, theo dõi tin tức, chấm điểm chất lượng qualification |

### 1.2. Người dùng và quy mô

| Thông số | Giá trị |
|---|---|
| Số người dùng đồng thời | **8-15** (dữ liệu thực tế từ hệ thống cũ) |
| Số Account | ~1.200, tăng ~50/tháng |
| Số Contact | ~1.300, tăng ~60/tháng |
| Số Opportunity | ~200 đang mở + lịch sử |
| Số Contract | ~65 |
| Số Activity dự kiến | **~50.000/năm** (sau khi bật email sync) — đây là bảng lớn nhất |
| Ngôn ngữ UI | Tiếng Việt (mặc định) + English (chuyển được) |
| Múi giờ | Asia/Ho_Chi_Minh (mặc định), hỗ trợ Asia/Hong_Kong, Australia/Sydney |

> **Hệ quả thiết kế từ quy mô 15 người:** KHÔNG cần sharding, KHÔNG cần ClickHouse riêng, KHÔNG cần microservices, KHÔNG cần multi-tenancy phức tạp. Một monolith Postgres là đủ và đúng. Mọi đề xuất kiến trúc "cho quy mô lớn" ở tài liệu nghiên cứu v1 đã được lược bỏ ở đây.

### 1.3. Vai trò người dùng

| Role | Mã | Mô tả |
|---|---|---|
| BD (Business Development) | `bd` | Tìm và nuôi contact mới, tạo opportunity giai đoạn đầu |
| AM (Account Manager) / Sales | `am` | Quản lý account, chốt deal, quản lý hợp đồng |
| Presales | `presales` | Hỗ trợ kỹ thuật cho opportunity được assign |
| Sales Manager | `manager` | Quản lý team, đặt KPI, xem toàn bộ |
| **Sales Admin** | `sales_admin` | **Quản lý hợp đồng, invoice, thu tiền.** Không tham gia bán hàng, không sở hữu account/opportunity — nhưng chịu trách nhiệm toàn bộ vòng đời tài chính sau khi deal đã Won |
| BOD | `bod` | Đọc và sửa toàn bộ dữ liệu, xem toàn bộ báo cáo |
| Admin | `admin` | Quản trị hệ thống, cấu hình schema |

> **Ghi chú về vai trò `sales_admin`:** đây là vai trò **vận hành tài chính**, tách khỏi vai trò bán hàng. Trong hệ thống cũ, công việc này nằm rải rác — AM tự cập nhật tình trạng thanh toán trong ô ghi chú, và bảng `Contracts` có 3 link tới `Month` (Contract Month / Invoiced Months / Paid Months) mà không ai chịu trách nhiệm rõ ràng, dẫn tới `Invoiced Months` bị bỏ hoang (không rollup nào tiêu thụ nó). Tách vai trò riêng để có người sở hữu rõ ràng khâu invoice và thu tiền.
>
> ⚠️ **Ghi chú về vai trò `bod`:** BOD nay có quyền **sửa** chứ không chỉ đọc. Điều này bỏ mất một lớp an toàn (trước đây BOD không thể vô tình làm hỏng dữ liệu). Bù lại bằng: mọi thay đổi đều vào `audit_log` với `actorId` rõ ràng, và các field ảnh hưởng tài chính vẫn yêu cầu xác nhận kỹ khi sửa hàng loạt.

### 1.4. Ngoài phạm vi v1

- Mobile app native (web responsive là đủ)
- Multi-workspace / multi-tenant (một công ty, một workspace)
- Offline-first / làm việc không mạng
- Tích hợp kế toán/ERP
- Marketing automation, email campaign
- Call recording, conversation intelligence

---

## 2. TECH STACK VÀ KIẾN TRÚC

### 2.1. Stack quyết định (không mở để tranh luận)

```yaml
frontend:
  framework: React 19 + TypeScript 5.6+
  build: Vite 6
  routing: React Router 7
  state_server: TanStack Query v5
  state_client: Zustand 5
  styling: Tailwind CSS 4 + shadcn/ui
  data_grid: react-data-grid v7 (MIT)      # xem 2.3 để biết lý do
  charts: Recharts 2
  forms: React Hook Form + Zod
  date: date-fns + date-fns-tz
  i18n: i18next

backend:
  runtime: Node.js 22 LTS
  framework: NestJS 11 + TypeScript
  api_style: REST (OpenAPI 3.1)            # xem 2.4 để biết lý do
  orm: Prisma 6
  database: PostgreSQL 16
  cache_queue: Redis 7 + BullMQ 5
  vector: pgvector (extension của Postgres, KHÔNG dùng vector DB riêng)
  auth: JWT (access 15m + refresh 7d), bcrypt
  validation: Zod (dùng chung schema với FE)
  ai_sdk: @anthropic-ai/sdk + openai (routing được)

infra:
  deploy: Docker Compose (v1) → Kubernetes [LATER]
  storage: S3-compatible (MinIO self-host hoặc AWS S3)
  email_sync: Gmail API + Microsoft Graph API
  monitoring: Sentry + pino logger
  ci: GitHub Actions
```

### 2.2. Cấu trúc thư mục monorepo

```
tomahawk/
├── apps/
│   ├── api/                        # NestJS backend
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── common/
│   │   │   │   ├── guards/         # AuthGuard, PermissionGuard
│   │   │   │   ├── decorators/     # @CurrentUser, @RequirePermission
│   │   │   │   ├── filters/        # exception filters
│   │   │   │   └── interceptors/   # audit log interceptor
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   ├── users/
│   │   │   │   ├── accounts/
│   │   │   │   ├── contacts/
│   │   │   │   ├── opportunities/
│   │   │   │   ├── contracts/
│   │   │   │   ├── pipeline/
│   │   │   │   ├── activities/
│   │   │   │   ├── views/          # saved views + per-user state
│   │   │   │   ├── kpi/
│   │   │   │   ├── meetings/       # weekly meeting + action items
│   │   │   │   ├── ai/             # chatbot, tools, enrichment
│   │   │   │   ├── sync/           # email/calendar sync
│   │   │   │   └── audit/
│   │   │   ├── jobs/               # BullMQ processors
│   │   │   └── db/
│   │   │       ├── schema.prisma
│   │   │       ├── migrations/
│   │   │       └── seed/
│   │   └── test/
│   └── web/                        # React frontend
│       ├── src/
│       │   ├── main.tsx
│       │   ├── routes/
│       │   ├── features/
│       │   │   ├── grid/           # data grid core — phần lớn nhất
│       │   │   ├── accounts/
│       │   │   ├── contacts/
│       │   │   ├── opportunities/
│       │   │   ├── contracts/
│       │   │   ├── pipeline/
│       │   │   ├── kpi/
│       │   │   ├── weekly-meeting/
│       │   │   └── ai-chat/
│       │   ├── components/ui/      # shadcn
│       │   ├── lib/
│       │   └── locales/            # vi.json, en.json
│       └── ...
├── packages/
│   ├── shared/                     # types + Zod schemas dùng chung FE/BE
│   │   ├── src/
│   │   │   ├── enums.ts
│   │   │   ├── schemas/
│   │   │   └── formulas/           # business formula, dùng chung
│   └── config/                     # eslint, tsconfig, prettier
├── docker-compose.yml
├── .env.example
└── README.md
```

### 2.3. Vì sao chọn `react-data-grid`

| Tiêu chí | react-data-grid | AG Grid Community | TanStack Table | Glide Data Grid |
|---|---|---|---|---|
| License | MIT ✅ | MIT ✅ | MIT ✅ | MIT ✅ |
| Virtualize hàng | ✅ | ✅ | cần lib phụ | ✅ |
| Virtualize cột | ✅ | ✅ | cần tự làm | ✅ |
| Inline edit sẵn | ✅ | ✅ | ❌ tự viết | ✅ |
| Copy-paste đa ô | ✅ **bản MIT** | ❌ chỉ Enterprise ($999/dev/năm) | ❌ tự viết | phải tự làm |
| Column resize | ✅ | ✅ | tự viết | ✅ |
| Rủi ro bảo trì | thấp | thấp | thấp | ⚠️ release cuối ghi nhận 02/2024 |

**Quyết định: `react-data-grid`.** Lý do quyết định: copy-paste đa ô có sẵn ở bản MIT (AG Grid tính phí cho tính năng này), rủi ro bảo trì thấp, DOM-based nên dễ tuỳ biến cell renderer bằng React thông thường.

**[DECIDE]** Nếu benchmark với 50.000 dòng thật cho thấy scroll giật (>16ms/frame), fallback sang Glide Data Grid (canvas). **Bắt buộc làm benchmark này ở Sprint 1**, không để đến khi xong mới phát hiện.

### 2.4. Vì sao REST chứ không GraphQL

- 15 người dùng, ~12 entity → GraphQL không mang lại lợi ích over-fetching đáng kể
- REST + OpenAPI sinh client TypeScript tự động, dễ cho AI agent code hơn
- Phân quyền field-level trên REST đơn giản hơn (một tầng serializer) so với GraphQL (phải làm ở resolver từng field)
- Nếu sau này cần schema động [LATER], có thể thêm endpoint `/api/dynamic/:object` mà không phá REST hiện có

### 2.5. Sơ đồ kiến trúc runtime

```
┌────────────────────────────────────────────────────┐
│  Browser (React SPA)                                │
│  ┌──────────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ DataGrid     │  │ AI Chat  │  │ KPI Cockpit  │  │
│  └──────┬───────┘  └────┬─────┘  └──────┬───────┘  │
│         └───────────────┴───────────────┘          │
│                    TanStack Query                   │
└─────────────────────────┬──────────────────────────┘
                          │ HTTPS REST + WebSocket
┌─────────────────────────▼──────────────────────────┐
│  NestJS API                                         │
│  ┌───────────────────────────────────────────────┐ │
│  │ AuthGuard → PermissionGuard → Controller      │ │
│  └──────────────────┬────────────────────────────┘ │
│  ┌──────────────────▼────────────────────────────┐ │
│  │ Service layer (business logic)                 │ │
│  └──────────────────┬────────────────────────────┘ │
│  ┌──────────────────▼────────────────────────────┐ │
│  │ ScopedPrismaService                            │ │
│  │ (TỰ ĐỘNG thêm điều kiện row-level security)    │ │
│  └──────────────────┬────────────────────────────┘ │
└─────────────────────┼──────────────────────────────┘
          ┌───────────┼───────────┬─────────────┐
    ┌─────▼────┐ ┌────▼─────┐ ┌───▼──────┐ ┌───▼─────┐
    │PostgreSQL│ │  Redis   │ │ BullMQ   │ │   S3    │
    │+pgvector │ │  cache   │ │ workers  │ │ files   │
    └──────────┘ └──────────┘ └───┬──────┘ └─────────┘
                                  │
                     ┌────────────┼────────────┐
              ┌──────▼─────┐ ┌────▼──────┐ ┌───▼────────┐
              │ Gmail/     │ │ AI API    │ │ Web search │
              │ MS Graph   │ │ (Claude/  │ │ (cho signal│
              │ sync       │ │  OpenAI)  │ │  watcher)  │
              └────────────┘ └───────────┘ └────────────┘
```

### 2.6. Quy ước code bắt buộc

| Quy ước | Chi tiết |
|---|---|
| **Naming DB** | `snake_case` cho bảng và cột. Bảng dạng số ít: `account`, không phải `accounts` |
| **Naming API** | `kebab-case` cho path, `camelCase` cho JSON body |
| **ID** | UUID v7 (sắp xếp được theo thời gian) cho mọi bảng. Cột tên `id` |
| **Timestamp** | Mọi bảng có `created_at`, `updated_at` kiểu `timestamptz`. Lưu UTC, hiển thị theo timezone user |
| **Soft delete** | Bảng nghiệp vụ chính có `deleted_at timestamptz NULL`. KHÔNG hard delete |
| **Money** | Kiểu `numeric(14,2)`, luôn kèm cột `currency char(3)` ISO 4217. **KHÔNG dùng float** |
| **Enum** | Định nghĩa ở `packages/shared/src/enums.ts`, sinh ra Postgres enum type. Một nguồn duy nhất |
| **Formula** | Viết ở `packages/shared/src/formulas/`, dùng chung FE (hiển thị tức thì) và BE (tính chuẩn) |
| **Error** | Format `{ code: string, message: string, details?: object }`. `code` là hằng số máy đọc được |
| **Test** | Mỗi công thức nghiệp vụ ở Phần 4 PHẢI có unit test với case lấy từ dữ liệu thật |

### 2.7. Biến môi trường

```bash
# .env.example
NODE_ENV=development
PORT=3000

DATABASE_URL=postgresql://tomahawk:password@localhost:5432/tomahawk
REDIS_URL=redis://localhost:6379

JWT_SECRET=<random-32-bytes>
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d

# AI
AI_PROVIDER=anthropic            # anthropic | openai
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
AI_MODEL_STRONG=claude-sonnet-4-5      # dùng cho chatbot, qualification coach
AI_MODEL_CHEAP=claude-haiku-4-5        # dùng cho enrichment hàng loạt
AI_MONTHLY_BUDGET_USD=200              # hard cap, xem 8.9

# Email sync
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
MS_CLIENT_ID=
MS_CLIENT_SECRET=
EMAIL_SYNC_MODE=metadata_plus_matched  # xem 9.3

# Storage
S3_ENDPOINT=
S3_BUCKET=tomahawk
S3_ACCESS_KEY=
S3_SECRET_KEY=

# Web search (cho AI signal watcher)
SEARCH_API_KEY=

DEFAULT_TIMEZONE=Asia/Ho_Chi_Minh
DEFAULT_CURRENCY=USD
```
---

# 3. DATA MODEL — ĐẶC TẢ ĐẦY ĐỦ

## 3.1. Sơ đồ quan hệ

```
team ──< user ──< (owner của nhiều entity)
                    │
account ──< contact ──< activity
   │  │        │
   │  │        └──< contact_score_history
   │  ├──< opportunity ──< contract ──< contract_month_revenue
   │  │         │
   │  │         └──< opportunity_presales (n-n)
   │  ├──< pipeline_entry ──< pipeline_month
   │  └──< account_signal
   │
taxonomy_industry / taxonomy_tech_domain / taxonomy_country  (bảng tra cứu)

view ──< view_user_state
kpi_target / kpi_snapshot
weekly_meeting ──< action_item
ai_insight / ai_proposal
audit_log
```

## 3.2. Enum — định nghĩa tập trung

File `packages/shared/src/enums.ts`. Mỗi enum sinh ra một Postgres enum type cùng tên (snake_case).

```typescript
// ============ NGƯỜI DÙNG ============
export const UserRole = {
  BD: 'bd',                     // tìm & nuôi contact, tạo opportunity giai đoạn đầu
  AM: 'am',                     // quản lý account, chốt deal
  PRESALES: 'presales',         // hỗ trợ kỹ thuật cho opportunity được assign
  SALES_ADMIN: 'sales_admin',   // quản lý hợp đồng, invoice, thu tiền
  MANAGER: 'manager',           // quản lý team, đặt KPI
  BOD: 'bod',                   // đọc + sửa toàn bộ, xem mọi báo cáo
  ADMIN: 'admin',               // quản trị hệ thống, cấu hình schema
} as const;

// ============ ACCOUNT ============
/** Quy mô deal kỳ vọng — GIỮ NGUYÊN từ hệ thống cũ.
 *  Mega:   doanh thu công ty >100M USD. SI lớn 200+ người, revenue/người >100K/năm
 *  Medium: 20-100M. SI vừa 50-200 người, HOẶC end-user/SaaS có phòng IT 20-50 người, tăng trưởng >50%
 *  Small:  <20M. SI nhỏ <50 người (revenue/người >80K/năm), HOẶC startup */
export const DealSizeTier = {
  MEGA: 'mega',
  MEDIUM: 'medium',
  SMALL: 'small',
} as const;

/** Loại hình công ty theo Sales Knowledge Base — FIELD MỚI, độc lập với DealSizeTier */
export const IcpType = {
  TRADITIONAL: 'traditional',       // DN truyền thống, cần DX/hiện đại hoá. PIC: CEO/COO/CIO/CDO
  IT_SOLUTION: 'it_solution',       // SI/solution house. Cần customization, scale-up resource. PIC: CTO/Head of Delivery/PM
  IT_PRODUCT: 'it_product',         // Công ty làm product. Cần dev feature, tăng tốc roadmap. PIC: CTO/VP Eng/Head of Product
  TECH_STARTUP: 'tech_startup',     // Startup. Cần MVP/POC, scale sau gọi vốn. PIC: Founder/CTO
  ITO: 'ito',                       // Công ty outsourcing khác. Cần subcontract, skill hiếm. PIC: CEO/Delivery Director
} as const;

/** Đánh giá tiềm năng — NGƯỜI TỰ CHẤM.
 *  Rule: chỉ có hiệu lực SAU KHI có 1st meeting. Có RFP/JD mà chưa gặp thì không tính. */
export const AccountPotential = {
  HIGH: 'high',       // Phù hợp, có bài toán, cơ hội ngay hoặc <=2 tuần
  MIDDLE: 'middle',   // Phù hợp, cơ hội <3 tháng
  LOW: 'low',         // Chưa thực sự phù hợp, hoặc phù hợp nhưng chưa thấy cơ hội
  NA: 'na',
  ZERO: 'zero',       // Không phù hợp / không có cơ hội
} as const;

/** Rank — TÍNH TỰ ĐỘNG từ (potential × dealSizeTier). Xem công thức 4.2 */
export const AccountRank = {
  A: 'a',
  B: 'b',
  C: 'c',
  NOT_RANKED: 'not_ranked',
} as const;

/** Nhịp chăm sóc account */
export const ActionCadence = {
  WEEKLY: 'weekly',
  FOCUS_WHALE_HUNTING: 'focus_whale_hunting',
  BI_WEEKLY: 'bi_weekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly',
  RETURN_TO_MKT: 'return_to_mkt',
} as const;

export const CompanySizeBand = {
  S_1_10: '1-10', S_11_50: '11-50', S_51_200: '51-200', S_201_500: '201-500',
  S_501_1000: '501-1000', S_1001_5000: '1001-5000', S_5001_10000: '5001-10000',
  S_10000_PLUS: '10000+',
} as const;

export const RevenueBand = {
  R_LT_10M: '<10M', R_10_50M: '10-50M', R_50_100M: '50-100M', R_100_200M: '100-200M',
  R_200_500M: '200-500M', R_500M_1B: '500M-1B', R_GT_1B: '>1B',
} as const;

/** Phân loại account theo doanh thu HBLAB THU ĐƯỢC (khác RevenueBand = doanh thu của chính khách) */
export const AccountRevenueTier = {
  NORMAL: 'normal',
  KEY: 'key',       // >= 200k USD/năm
  MEGA: 'mega',     // >= 400k USD/năm
} as const;

// ============ CONTACT ============
/** Mục tiêu nuôi dưỡng — GIỮ NGUYÊN 6 giá trị từ hệ thống cũ. Bắt buộc >= 1 */
export const ContactObjective = {
  CUSTOMER: 'customer',                   // Ra được hợp đồng
  FAN_FREE: 'fan_free',                   // Giới thiệu khách khác, không điều kiện
  ADVISORY_CONTRACT: 'advisory_contract', // Giới thiệu có điều kiện win-win / partner
  CLOSE_THE_DEAL: 'close_the_deal',       // Đang có RFP, chăm theo chủ đề RFP
  RETURN_TO_MKT: 'return_to_mkt',         // Trả về marketing nuôi branding
  REVIEW_FOR_REMOVING: 'review_for_removing',
} as const;

export const ContactSource = {
  LINKEDIN: 'linkedin', EMAIL_APOLLO: 'email_apollo', SALES_REFERRAL: 'sales_referral',
  FACEBOOK: 'facebook', OFFLINE_EVENT: 'offline_event', COMPANY_REFERRAL: 'company_referral',
  ADS: 'ads', HOMEPAGE: 'homepage', BD_JP: 'bd_jp', OTHER: 'other',
} as const;

export const ContactChannel = {
  EMAIL: 'email', LINKEDIN: 'linkedin', WHATSAPP: 'whatsapp', FACEBOOK: 'facebook',
  TELEGRAM: 'telegram', X: 'x', ZALO: 'zalo', INSTAGRAM: 'instagram',
  GOOGLE_CHAT: 'google_chat', SKYPE: 'skype', TEAMS: 'teams',
} as const;

/** Vai trò trong buying committee — FIELD MỚI (theo MEDDIC) */
export const StakeholderRole = {
  ECONOMIC_BUYER: 'economic_buyer',   // Người duyệt ngân sách
  CHAMPION: 'champion',               // Người ủng hộ nội bộ
  INFLUENCER: 'influencer',
  TECHNICAL_EVALUATOR: 'technical_evaluator',
  BLOCKER: 'blocker',                 // Gatekeeper / cản trở
  USER: 'user',
  UNKNOWN: 'unknown',
} as const;

// ============ OPPORTUNITY ============
/** Pipeline 5 bước — GIỮ NGUYÊN từ hệ thống cũ */
export const OpportunityStatus = {
  FOLLOWING: 'following',   // Mặc định. Nhu cầu chưa rõ, chưa chuyển presales
  RFP_JD: 'rfp_jd',         // Đã có RFP/JD. Cần đủ ngưỡng MEDDIC mới chuyển presales
  PROPOSED: 'proposed',     // Đã gửi proposal/CV, chờ phản hồi
  WON: 'won',               // Đã ký. Bắt buộc có contract
  LOST: 'lost',             // Thua. Bắt buộc có lossReasons
} as const;

/** Mô hình hợp tác */
export const EngagementModel = {
  BODY_SHOP: 'body_shop',
  PROJECT_BASED: 'project_based',
  ODC_TEAM_BASED: 'odc_team_based',
} as const;

/** Mức độ ưu tiên follow-up. LƯU Ý: hệ thống cũ thiếu option B dù có field đếm B — ở đây bổ sung đủ */
export const OpportunityActionClass = {
  A_SALES_ONLY: 'a_sales_only',           // Check hàng ngày, follow trong <=5 ngày làm việc
  A_PLUS_PRESALES: 'a_plus_presales',     // Có presales tham gia
  B_MONTHLY: 'b_monthly',                 // Follow sau 1 tháng
  C_QUARTERLY: 'c_quarterly',             // Follow sau 3 tháng
  D_ARCHIVE: 'd_archive',                 // Ngừng follow
} as const;

/** Lý do thua — ánh xạ sang 6 chiều MEDDIC. Giữ tương thích với taxonomy cũ (BANT) qua legacyCode */
export const LossReason = {
  BUDGET_TOO_LOW: 'budget_too_low',                     // legacy: Budget
  BUDGET_NO_FUNDING: 'budget_no_funding',
  EB_NO_ACCESS: 'eb_no_access',                         // legacy: Authority
  EB_LACK_DECISION_POWER: 'eb_lack_decision_power',     // legacy: A- Lack of Decision-making Power
  NEED_MISALIGNED_SOLUTION: 'need_misaligned_solution',  // legacy: N- Misaligned Solutions
  NEED_POOR_ASSESSMENT: 'need_poor_assessment',          // legacy: N- Poor Needs Assessment
  NEED_COMMUNICATION: 'need_communication',              // legacy: N-Communication
  PROCESS_DECISION_DELAY: 'process_decision_delay',      // legacy: N- Decision Delay
  PROCESS_PROJECT_DELAY: 'process_project_delay',        // legacy: T- Project Delay
  CRITERIA_LOST_TO_COMPETITOR: 'criteria_lost_to_competitor',
  CRITERIA_TECH_CAPABILITY: 'criteria_tech_capability',
  NO_CHAMPION: 'no_champion',
  UNKNOWN: 'unknown',
} as const;

/** Yếu tố thắng — GIỮ NGUYÊN 4 giá trị. Dữ liệu thực tế cho thấy 2/4 là về quan hệ */
export const WinFactor = {
  MEDDIC_FIT: 'meddic_fit',
  TRUSTED_DELIVERY: 'trusted_delivery',
  COMPANY_RELATIONSHIP: 'company_relationship',
  SALES_RELATIONSHIP: 'sales_relationship',
  PRICE: 'price',
  SPEED: 'speed',
} as const;

/** Đơn vị delivery nội bộ */
export const DeliveryUnit = {
  HBG: 'hbg', RND: 'rnd', OUTSOURCE: 'outsource', HB2: 'hb2', HB4: 'hb4', HBU: 'hbu',
} as const;

// ============ CONTRACT ============
export const ContractStatus = {
  ADAPTING: 'adapting',
  NORMAL: 'normal',
  GOOD: 'good',
  CLAIMED: 'claimed',
  MAINTAIN_UAT: 'maintain_uat',
  WAITING_PAYMENT: 'waiting_payment',
  FINISHED: 'finished',
} as const;

// ============ PIPELINE FORECAST ============
/** Trọng số xác suất — QUYẾT ĐỊNH ĐÃ CHỐT: dùng model KT của file Excel KPI.
 *  Giá trị trọng số lưu ở bảng cấu hình, KHÔNG hard-code trong công thức (⚠️ hệ thống cũ
 *  hard-code 12 lần và sai 1 lần → forecast tháng 3 bị nhân đôi) */
export const PipelineWeightClass = {
  KT1: 'kt1',         // 90%
  KT2: 'kt2',         // 50%
  KT3: 'kt3',         // 10%
  TT: 'tt',           // [DECIDE] mặc định 10% — xem 3.14
  PENDING: 'pending', // 0% — không tính vào forecast
} as const;

export const ResourceType = {
  BACKEND: 'backend', FRONTEND: 'frontend', FULLSTACK: 'fullstack',
  MOBILE: 'mobile', QA: 'qa', DEVOPS: 'devops', DATA_AI: 'data_ai',
  LOWCODE: 'lowcode', BA_PM: 'ba_pm', OTHER: 'other',
} as const;

export const ServiceOffering = {
  RETAIL: 'retail', MODERNIZATION: 'modernization', DATA_AI: 'data_ai',
  LOWCODE: 'lowcode', MANAGED_SERVICE: 'managed_service', LOGISTICS: 'logistics',
  EDUTECH: 'edutech', FINTECH: 'fintech', OTHER: 'other',
} as const;

// ============ ACTIVITY ============
export const ActivityType = {
  EMAIL_IN: 'email_in',
  EMAIL_OUT: 'email_out',
  CALL: 'call',
  MEETING_ONLINE: 'meeting_online',
  MEETING_OFFLINE: 'meeting_offline',
  NOTE: 'note',
  LINKEDIN_MESSAGE: 'linkedin_message',
  LINKEDIN_ENGAGEMENT: 'linkedin_engagement',   // like/comment/share bài của khách
  DOCUMENT_SHARED: 'document_shared',           // gửi case study/whitepaper
  GIFT_SENT: 'gift_sent',                       // quà, chúc mừng
  FAVOR: 'favor',                               // giúp đỡ khách
  REFERRAL_RECEIVED: 'referral_received',       // khách giới thiệu cho mình
  SOCIAL_MEAL: 'social_meal',                   // ăn/cafe/đi chơi
  OFFICE_VISIT_TO_CLIENT: 'office_visit_to_client',
  OFFICE_VISIT_FROM_CLIENT: 'office_visit_from_client',
  STATUS_CHANGE: 'status_change',               // hệ thống tự ghi
} as const;

export const ActivitySource = {
  MANUAL: 'manual',
  EMAIL_SYNC: 'email_sync',
  CALENDAR_SYNC: 'calendar_sync',
  AI_EXTRACTED: 'ai_extracted',
  SYSTEM: 'system',
} as const;

export const ActivityDirection = { INBOUND: 'inbound', OUTBOUND: 'outbound', INTERNAL: 'internal' } as const;

export const Sentiment = { POSITIVE: 'positive', NEUTRAL: 'neutral', NEGATIVE: 'negative', UNKNOWN: 'unknown' } as const;

/** Trạng thái lịch hẹn offline — giữ pipeline con 5 bước của hệ thống cũ */
export const MeetingStatus = {
  LISTED: 'listed', INVITED: 'invited', ACCEPTED: 'accepted',
  SCHEDULED: 'scheduled', DONE: 'done', CANCELLED: 'cancelled', ARCHIVED: 'archived',
} as const;

// ============ SIGNAL ============
export const SignalType = {
  FUNDING: 'funding', HIRING_SURGE: 'hiring_surge', LEADERSHIP_CHANGE: 'leadership_change',
  M_AND_A: 'm_and_a', PRODUCT_LAUNCH: 'product_launch', MARKET_EXPANSION: 'market_expansion',
  LAYOFF: 'layoff', TECH_MIGRATION: 'tech_migration', PARTNERSHIP: 'partnership',
  FINANCIAL_RESULT: 'financial_result', OTHER: 'other',
} as const;

export const SignalRelevance = { HIGH: 'high', MEDIUM: 'medium', LOW: 'low' } as const;

// ============ VIEW ============
export const ViewType = { GRID: 'grid', KANBAN: 'kanban', CALENDAR: 'calendar', TIMELINE: 'timeline' } as const;
export const ViewVisibility = { PERSONAL: 'personal', SHARED: 'shared', LOCKED: 'locked' } as const;

// ============ KPI ============
export const KpiMetric = {
  BOOKED_REVENUE: 'booked_revenue',       // Doanh số KÝ trong kỳ (theo ngày ký hợp đồng)
  BILLING_REVENUE: 'billing_revenue',     // Doanh thu THUỘC VỀ kỳ (theo tháng phân bổ)
  COLLECTED_REVENUE: 'collected_revenue', // Tiền ĐÃ THU trong kỳ
  MEETING_COUNT: 'meeting_count',
  FIRST_MEETING_COUNT: 'first_meeting_count',
  SQL_COUNT: 'sql_count',                 // Opportunity đạt ngưỡng MEDDIC
  NEW_ACCOUNT_COUNT: 'new_account_count',
  NEW_CONTACT_COUNT: 'new_contact_count',
  NEW_SIGNED_CUSTOMER: 'new_signed_customer',
  ACTIVITY_COUNT: 'activity_count',
  PIPELINE_VALUE: 'pipeline_value',
} as const;

export const KpiPeriodType = { WEEK: 'week', MONTH: 'month', QUARTER: 'quarter', YEAR: 'year' } as const;
export const KpiScopeType = { USER: 'user', TEAM: 'team', COMPANY: 'company' } as const;
export const RagStatus = { RED: 'red', AMBER: 'amber', GREEN: 'green', NO_TARGET: 'no_target' } as const;

// ============ AI ============
export const AiInsightKind = {
  COMPANY_ENRICHMENT: 'company_enrichment',
  SIGNAL_WATCH: 'signal_watch',
  ACTIVITY_SUMMARY: 'activity_summary',
  QUALIFICATION_COACH: 'qualification_coach',
  NEXT_ACTION_SUGGESTION: 'next_action_suggestion',
  CHATBOT_ANSWER: 'chatbot_answer',
  REPORT_GENERATION: 'report_generation',
  WEEKLY_BRIEF: 'weekly_brief',
} as const;

export const AiProposalStatus = {
  PENDING: 'pending', CONFIRMED: 'confirmed', REJECTED: 'rejected',
  EDITED_CONFIRMED: 'edited_confirmed', EXPIRED: 'expired',
} as const;

export const AuditActorType = { USER: 'user', AI: 'ai', AUTOMATION: 'automation', SYSTEM: 'system' } as const;
```

---

## 3.3. Bảng tra cứu (taxonomy) — bắt buộc chuẩn hoá

⚠️ **Lý do có phần này:** hệ thống cũ dùng singleSelect tự do → `Industry` phình lên **106 giá trị** với 11 nhóm trùng lặp (`SI` vs `System Integrator`, `EC` vs `E-commerce` vs `Ecommerce`, `Finance` vs `Fintech` vs `Banking` vs `Bank`…), `Country` có 47 giá trị với `German` vs `Germany`, `UK` vs `England`, và giá trị rác `ho`, `Croatia  `. Điều này làm mọi báo cáo theo ngành/quốc gia sai.

**Giải pháp: taxonomy là bảng có khoá, có trạng thái, KHÔNG cho người dùng tự thêm giá trị mới tuỳ ý.**

```prisma
model TaxonomyIndustry {
  id          String   @id @default(uuid(7))
  code        String   @unique              // 'si', 'fintech', 'healthcare'
  nameVi      String   @map("name_vi")
  nameEn      String   @map("name_en")
  parentId    String?  @map("parent_id")    // cho phép 2 cấp
  parent      TaxonomyIndustry?  @relation("IndustryTree", fields: [parentId], references: [id])
  children    TaxonomyIndustry[] @relation("IndustryTree")
  isActive    Boolean  @default(true) @map("is_active")
  sortOrder   Int      @default(0) @map("sort_order")
  aliases     String[] @default([])         // để migrate: ['SI','System Integrator']
  accounts    Account[]
  @@map("taxonomy_industry")
}

model TaxonomyTechDomain {
  id       String   @id @default(uuid(7))
  code     String   @unique                 // 'bfsi','retail','healthcare',...
  nameVi   String   @map("name_vi")
  nameEn   String   @map("name_en")
  isActive Boolean  @default(true) @map("is_active")
  sortOrder Int     @default(0) @map("sort_order")
  accounts Account[]
  @@map("taxonomy_tech_domain")
}

model TaxonomyCountry {
  id        String   @id @default(uuid(7))
  iso2      String   @unique               // 'SG','AU','JP' — ISO 3166-1 alpha-2
  nameVi    String   @map("name_vi")
  nameEn    String   @map("name_en")
  region    String?                        // 'APAC','EMEA','AMER'
  timezone  String?                        // IANA
  aliases   String[] @default([])          // ['German','Germany'] → DE
  isActive  Boolean  @default(true) @map("is_active")
  accounts  Account[]
  @@map("taxonomy_country")
}
```

**Seed bắt buộc — 12 tech domain (theo Sales Knowledge Base):**

| code | nameVi | nameEn |
|---|---|---|
| `bfsi` | Tài chính - Ngân hàng - Bảo hiểm | Banking, Financial Services & Insurance |
| `retail` | Bán lẻ & Thương mại điện tử | Retail & E-commerce |
| `fmcg` | Hàng tiêu dùng nhanh | FMCG |
| `healthcare` | Y tế & Chăm sóc sức khoẻ | Healthcare |
| `education` | Giáo dục | Education |
| `manufacturing` | Sản xuất | Manufacturing |
| `entertainment` | Giải trí & Game | Entertainment & Gaming |
| `wellness` | Sức khoẻ & Thể hình | Wellness & Fitness |
| `hospitality` | Khách sạn & Du lịch | Hospitality & Travel |
| `marketing` | Marketing & Quảng cáo | Marketing & Advertising |
| `real_estate` | Bất động sản & Xây dựng | Real Estate & Construction |
| `logistics` | Logistics & Vận tải | Logistics & Transportation |

**Seed bắt buộc — industry chuẩn hoá (~18 giá trị, gom từ 106 giá trị cũ):**

| code | nameVi | aliases (dùng để migrate) |
|---|---|---|
| `si` | Tích hợp hệ thống (SI) | SI, System Integrator, IT System Integration |
| `it_services` | Dịch vụ IT | IT, IT Services, IT Outsourcing, Software Development, IT Managed Services, Managed Services |
| `it_consulting` | Tư vấn IT | IT consulting, Consultant, Consulting, Business Consulting and Services, AI Consulting, Strategic Management Services, Data consulting |
| `saas_product` | Sản phẩm phần mềm / SaaS | SAAS, Mobile Computing Software Products, Business Intelligence Platforms |
| `fintech_banking` | Tài chính - Ngân hàng | Finance, Bank, Banking, Fintech, Insurance, Security chứng khoán, Accounting, Audit |
| `ecommerce_retail` | TMĐT & Bán lẻ | EC, E-commerce, Ecommerce, Retail, Internet Marketplace, Distributor |
| `healthcare` | Y tế | Healthcare, Medical |
| `education` | Giáo dục | Education, Higher Education, Edtech, Training Center, Training and Coaching |
| `manufacturing` | Sản xuất | Manufacturing, Mes, Semiconductor Manufacturing, Motor Vehicle Manufacturing, Food and Beverage Manufacturing, Consumer Electronics, Furniture |
| `logistics` | Logistics | Logictics, Transportation, Marine, Airlines and Aviation, Aviation and Aerospace Component Manufacturing |
| `marketing_media` | Marketing & Truyền thông | MKT, Marketing Services, MarTech, Advertising Services, Communication Media MKT, Design Service |
| `gaming_entertainment` | Game & Giải trí | Game, Computer Games, Entertainment |
| `data_ai` | Data & AI | AI, Data, Data Infra |
| `cybersecurity` | An ninh mạng | Network Security, Cyber Security, Data Security Software Products, Risk Solutions |
| `real_estate_construction` | BĐS & Xây dựng | Real Estate, Construct, Construction, Facilities Services |
| `hospitality_travel` | Khách sạn & Du lịch | Hotel, Hospitality, Travel, MICE, Food and Beverage, Spa, Wellness and Fitness |
| `government_nonprofit` | Chính phủ & Phi lợi nhuận | Government, Government Relations, non-profit, Public Safety, Utilities, Energy, Power, Environmental Services, Mining |
| `hr_staffing` | Nhân sự & Tuyển dụng | HR, Human Resources Services, Staffing and Recruiting |
| `other` | Khác | (mọi giá trị không map được) |

⚠️ **Quy tắc bắt buộc:** khi migrate, mọi giá trị không map được vào bảng trên → gán `other` **và ghi giá trị gốc vào `account.legacy_industry_raw`** để không mất thông tin. KHÔNG tự tạo code mới.

---

## 3.4. Bảng người dùng và nhóm

```prisma
model Team {
  id        String   @id @default(uuid(7))
  name      String
  leaderId  String?  @map("leader_id")
  leader    User?    @relation("TeamLeader", fields: [leaderId], references: [id])
  members   User[]   @relation("TeamMembers")
  isActive  Boolean  @default(true) @map("is_active")
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt DateTime @updatedAt @map("updated_at") @db.Timestamptz
  @@map("team")
}

model User {
  id            String    @id @default(uuid(7))
  email         String    @unique
  passwordHash  String?   @map("password_hash")     // null nếu chỉ dùng SSO
  fullName      String    @map("full_name")
  displayName   String?   @map("display_name")      // 'Mike','Dory' — tên gọi trong team
  avatarUrl     String?   @map("avatar_url")
  role          UserRole
  /** sales_admin: không sở hữu account/opportunity, nhưng sở hữu toàn bộ khâu
   *  invoice + thu tiền. Xem ma trận phân quyền 10.2 */
  teamId        String?   @map("team_id")
  team          Team?     @relation("TeamMembers", fields: [teamId], references: [id])
  ledTeams      Team[]    @relation("TeamLeader")
  timezone      String    @default("Asia/Ho_Chi_Minh")
  locale        String    @default("vi")
  isActive      Boolean   @default(true) @map("is_active")
  lastLoginAt   DateTime? @map("last_login_at") @db.Timestamptz
  createdAt     DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt     DateTime  @updatedAt @map("updated_at") @db.Timestamptz
  deletedAt     DateTime? @map("deleted_at") @db.Timestamptz

  ownedAccounts       Account[]      @relation("AccountOwner")
  bdAccounts          Account[]      @relation("AccountBd")
  assignedContacts    Contact[]      @relation("ContactAssignee")
  ownedOpportunities  Opportunity[]  @relation("OpportunityOwner")
  presalesOpps        OpportunityPresales[]
  ownedContracts      Contract[]     @relation("ContractOwner")
  ownedPipelines      PipelineEntry[]
  activities          Activity[]
  views               View[]
  viewStates          ViewUserState[]
  emailAccounts       EmailAccount[]

  @@index([teamId])
  @@index([role])
  @@map("user")
}
```

---

## 3.5. Bảng Account

```prisma
model Account {
  id              String   @id @default(uuid(7))

  // --- Định danh ---
  companyName     String   @map("company_name")
  website         String?
  linkedinUrl     String?  @map("linkedin_url")
  physicalAddress String?  @map("physical_address")
  countryId       String?  @map("country_id")
  country         TaxonomyCountry? @relation(fields: [countryId], references: [id])

  // --- Phân loại: 3 FIELD ĐỘC LẬP, KHÔNG GỘP ---
  dealSizeTier    DealSizeTier?  @map("deal_size_tier")   // Mega/Medium/Small — quy mô deal kỳ vọng
  icpType         IcpType?       @map("icp_type")         // 5 loại hình công ty
  industryId      String?        @map("industry_id")
  industry        TaxonomyIndustry?   @relation(fields: [industryId], references: [id])
  techDomainId    String?        @map("tech_domain_id")
  techDomain      TaxonomyTechDomain? @relation(fields: [techDomainId], references: [id])
  specialDomain   String?        @map("special_domain")   // ngách, text tự do
  sizeBand        CompanySizeBand? @map("size_band")
  revenueBand     RevenueBand?   @map("revenue_band")
  yearFounded     Int?           @map("year_founded")
  fiscalYearEndMonth Int?        @map("fiscal_year_end_month")  // 1-12
  developmentRatio Decimal?      @map("development_ratio") @db.Decimal(5,4) // 0.0000-1.0000
  devCenterCountries String[]    @default([]) @map("dev_center_countries")  // ISO2

  // --- Đánh giá ---
  potential       AccountPotential? // NGƯỜI TỰ CHẤM
  rank            AccountRank    @default(NOT_RANKED)     // TÍNH TỰ ĐỘNG, xem 4.2
  rankComputedAt  DateTime?      @map("rank_computed_at") @db.Timestamptz
  actionCadence   ActionCadence? @map("action_cadence")
  revenueTier     AccountRevenueTier @default(NORMAL) @map("revenue_tier") // TÍNH TỰ ĐỘNG, xem 4.6
  isWatching      Boolean        @default(false) @map("is_watching")       // bật AI theo dõi tin tức

  // --- Quan hệ 2 công ty ---
  ndaSignedDate       DateTime? @map("nda_signed_date") @db.Date
  firstContractDate   DateTime? @map("first_contract_date") @db.Date
  annualItBudget      Decimal?  @map("annual_it_budget") @db.Decimal(14,2)
  annualItBudgetCurrency String? @map("annual_it_budget_currency") @db.Char(3)
  companyRelationshipScore Decimal? @map("company_relationship_score") @db.Decimal(6,2) // TÍNH, xem 4.3
  basicInfoQuality    Decimal?  @map("basic_info_quality") @db.Decimal(5,4)             // TÍNH, xem 4.4

  // --- Sở hữu ---
  ownerId  String? @map("owner_id")     // AM/Sales chịu trách nhiệm chính
  owner    User?   @relation("AccountOwner", fields: [ownerId], references: [id])
  bdId     String? @map("bd_id")        // BD phụ trách (có thể khác owner)
  bd       User?   @relation("AccountBd", fields: [bdId], references: [id])

  // --- Ghi chú ---
  investigatedInfo String? @map("investigated_info") @db.Text  // thông tin nghiên cứu
  planNote         String? @map("plan_note") @db.Text          // kế hoạch; hỗ trợ hashtag #SKIP #HELP

  // --- AI ---
  aiSummary          String?   @map("ai_summary") @db.Text
  aiSummaryUpdatedAt DateTime? @map("ai_summary_updated_at") @db.Timestamptz
  aiConfidence       Decimal?  @map("ai_confidence") @db.Decimal(3,2)
  embedding          Unsupported("vector(1536)")?              // pgvector, cho semantic search

  // --- Migrate ---
  legacyAirtableId    String? @unique @map("legacy_airtable_id")
  legacyIndustryRaw   String? @map("legacy_industry_raw")
  legacyCountryRaw    String? @map("legacy_country_raw")

  createdAt DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt DateTime  @updatedAt @map("updated_at") @db.Timestamptz
  deletedAt DateTime? @map("deleted_at") @db.Timestamptz
  createdById String? @map("created_by_id")
  updatedById String? @map("updated_by_id")

  contacts      Contact[]
  opportunities Opportunity[]
  pipelines     PipelineEntry[]
  signals       AccountSignal[]
  activities    Activity[]

  @@index([ownerId])
  @@index([bdId])
  @@index([rank])
  @@index([dealSizeTier])
  @@index([icpType])
  @@index([isWatching])
  @@index([countryId])
  @@index([deletedAt])
  @@index([companyName])
  @@map("account")
}
```

**Constraint bổ sung (viết trong migration SQL, Prisma không hỗ trợ trực tiếp):**

```sql
-- Chống trùng account theo domain website
CREATE UNIQUE INDEX account_website_domain_uniq
  ON account (lower(regexp_replace(website, '^https?://(www\.)?([^/]+).*$', '\2')))
  WHERE website IS NOT NULL AND deleted_at IS NULL;

-- Chống trùng theo tên công ty (case-insensitive, bỏ khoảng trắng thừa)
CREATE UNIQUE INDEX account_name_uniq
  ON account (lower(trim(regexp_replace(company_name, '\s+', ' ', 'g'))))
  WHERE deleted_at IS NULL;

-- Full-text search tiếng Việt
CREATE INDEX account_fts ON account
  USING gin(to_tsvector('simple', coalesce(company_name,'') || ' ' || coalesce(special_domain,'')));

-- Vector search
CREATE INDEX account_embedding_idx ON account USING hnsw (embedding vector_cosine_ops);
```

---

## 3.6. Bảng Contact

```prisma
model Contact {
  id         String  @id @default(uuid(7))
  accountId  String? @map("account_id")
  account    Account? @relation(fields: [accountId], references: [id])

  fullName   String  @map("full_name")
  title      String?                       // BẮT BUỘC theo rule nghiệp vụ, xem 4.8
  email      String?
  phone      String?
  linkedinUrl String? @map("linkedin_url")
  birthday   DateTime? @db.Date

  channels   ContactChannel[] @default([])
  source     ContactSource?
  objectives ContactObjective[]            // BẮT BUỘC >= 1
  stakeholderRole StakeholderRole @default(UNKNOWN) @map("stakeholder_role")

  assigneeId String? @map("assignee_id")
  assignee   User?   @relation("ContactAssignee", fields: [assigneeId], references: [id])

  nextActionDate DateTime? @map("next_action_date") @db.Date
  nextActionNote String?   @map("next_action_note")
  firstMeetingAt DateTime? @map("first_meeting_at") @db.Date

  // --- Điểm quan hệ: TÍNH TỰ ĐỘNG từ activity, xem 4.9 ---
  relationshipScore     Int?      @map("relationship_score")
  relationshipScoreAt   DateTime? @map("relationship_score_at") @db.Timestamptz
  infoQuality           Decimal?  @map("info_quality") @db.Decimal(5,4)
  lastEngagedAt         DateTime? @map("last_engaged_at") @db.Timestamptz
  daysSinceLastActivity Int?      @map("days_since_last_activity")   // materialized, job cập nhật

  workingHistory   String? @map("working_history") @db.Text
  investigatedInfo String? @map("investigated_info") @db.Text

  aiSummary String? @map("ai_summary") @db.Text
  embedding Unsupported("vector(1536)")?

  legacyAirtableId String? @unique @map("legacy_airtable_id")

  createdAt DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt DateTime  @updatedAt @map("updated_at") @db.Timestamptz
  deletedAt DateTime? @map("deleted_at") @db.Timestamptz
  createdById String? @map("created_by_id")

  activities   Activity[]
  scoreHistory ContactScoreHistory[]
  oppRoles     OpportunityContact[]

  @@index([accountId])
  @@index([assigneeId])
  @@index([nextActionDate])
  @@index([email])
  @@index([deletedAt])
  @@map("contact")
}

/** ⚠️ Thay thế field 'Heartbeat' của hệ thống cũ — vốn nhét cả time-series vào 1 ô text
 *  phân tách bằng dấu | và phải parse bằng công thức MID/FIND. */
model ContactScoreHistory {
  id           String   @id @default(uuid(7))
  contactId    String   @map("contact_id")
  contact      Contact  @relation(fields: [contactId], references: [id], onDelete: Cascade)
  snapshotDate DateTime @map("snapshot_date") @db.Date
  score        Int
  delta        Int?                                    // so với snapshot trước
  breakdown    Json?                                   // {meals:2, favors:1, ...}
  createdAt    DateTime @default(now()) @map("created_at") @db.Timestamptz

  @@unique([contactId, snapshotDate])
  @@index([snapshotDate])
  @@map("contact_score_history")
}
```

---

## 3.7. Bảng Opportunity

```prisma
model Opportunity {
  id        String  @id @default(uuid(7))
  code      Int     @default(autoincrement())        // số hiệu ngắn cho người đọc: OPP-1234
  name      String
  accountId String  @map("account_id")
  account   Account @relation(fields: [accountId], references: [id])

  status          OpportunityStatus @default(FOLLOWING)
  statusChangedAt DateTime? @map("status_changed_at") @db.Timestamptz
  engagementModel EngagementModel?  @map("engagement_model")
  actionClass     OpportunityActionClass @default(A_SALES_ONLY) @map("action_class")
  deliveryUnits   DeliveryUnit[] @default([]) @map("delivery_units")

  ownerId String @map("owner_id")
  owner   User   @relation("OpportunityOwner", fields: [ownerId], references: [id])

  // --- Giá trị ---
  estimatedValue   Decimal? @map("estimated_value") @db.Decimal(14,2)
  currency         String   @default("USD") @db.Char(3)
  winRate          Decimal? @map("win_rate") @db.Decimal(5,4)    // 0.0000-1.0000
  weightedValue    Decimal? @map("weighted_value") @db.Decimal(14,2)  // TÍNH: estimated × winRate

  // --- Thời gian ---
  originCreatedDate DateTime? @map("origin_created_date") @db.Date  // ngày cơ hội thực sự phát sinh
  nextActionDate    DateTime? @map("next_action_date") @db.Date
  nextActionNote    String?   @map("next_action_note")
  deadline          DateTime? @db.Date
  estimatedStartDate DateTime? @map("estimated_start_date") @db.Date
  estimatedEndDate   DateTime? @map("estimated_end_date") @db.Date

  // --- MEDDIC (thay BANT) ---
  meddicMetrics         String? @map("meddic_metrics") @db.Text
  meddicEconomicBuyer   String? @map("meddic_economic_buyer") @db.Text
  meddicDecisionCriteria String? @map("meddic_decision_criteria") @db.Text
  meddicDecisionProcess String? @map("meddic_decision_process") @db.Text
  meddicIdentifyPain    String? @map("meddic_identify_pain") @db.Text
  meddicChampion        String? @map("meddic_champion") @db.Text

  meddicScore       Decimal? @map("meddic_score") @db.Decimal(3,2)   // 0.00-1.00, AI chấm, xem 8.6
  meddicScoreAt     DateTime? @map("meddic_score_at") @db.Timestamptz
  meddicDetail      Json?     @map("meddic_detail")                  // kết quả AI chi tiết
  readyForPresales  Boolean   @default(false) @map("ready_for_presales")

  // --- BANT cũ: READ-ONLY, chỉ để tra cứu lịch sử ---
  legacyBantBudget    String? @map("legacy_bant_budget") @db.Text
  legacyBantAuthority String? @map("legacy_bant_authority") @db.Text
  legacyBantNeed      String? @map("legacy_bant_need") @db.Text
  legacyBantTime      String? @map("legacy_bant_time") @db.Text

  // --- Kết thúc ---
  lossReasons String[] @default([]) @map("loss_reasons")   // LossReason[]
  lossNote    String?  @map("loss_note") @db.Text
  winFactors  String[] @default([]) @map("win_factors")    // WinFactor[]
  closedAt    DateTime? @map("closed_at") @db.Timestamptz

  legacyAirtableId String? @unique @map("legacy_airtable_id")

  createdAt DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt DateTime  @updatedAt @map("updated_at") @db.Timestamptz
  deletedAt DateTime? @map("deleted_at") @db.Timestamptz
  createdById String? @map("created_by_id")

  contracts  Contract[]
  presales   OpportunityPresales[]
  contacts   OpportunityContact[]
  activities Activity[]
  pipelines  PipelineEntry[]

  @@index([accountId])
  @@index([ownerId])
  @@index([status])
  @@index([nextActionDate])
  @@index([deletedAt])
  @@map("opportunity")
}

model OpportunityPresales {
  opportunityId String @map("opportunity_id")
  userId        String @map("user_id")
  opportunity   Opportunity @relation(fields: [opportunityId], references: [id], onDelete: Cascade)
  user          User        @relation(fields: [userId], references: [id])
  assignedAt    DateTime @default(now()) @map("assigned_at") @db.Timestamptz
  @@id([opportunityId, userId])
  @@map("opportunity_presales")
}

/** Buying committee của một opportunity */
model OpportunityContact {
  opportunityId String @map("opportunity_id")
  contactId     String @map("contact_id")
  role          StakeholderRole @default(UNKNOWN)
  opportunity   Opportunity @relation(fields: [opportunityId], references: [id], onDelete: Cascade)
  contact       Contact     @relation(fields: [contactId], references: [id], onDelete: Cascade)
  @@id([opportunityId, contactId])
  @@map("opportunity_contact")
}
```

---

## 3.8. Bảng Contract

⚠️ **Thay đổi quan trọng so với hệ thống cũ:** hệ thống cũ có **12 cột tiền Jan..Dec** trên bảng Contract + 12 rollup `TCV01..12` + 12 rollup `Paid01..12` trên bảng Month = **36 field lặp**, và đã sinh lỗi (`Mar` dùng sai trọng số; `FIND()` bị dùng như boolean nên nhân sai hệ số). Ở đây chuẩn hoá thành **bảng con một dòng một tháng**.

```prisma
model Contract {
  id            String  @id @default(uuid(7))
  code          Int     @default(autoincrement())
  name          String
  opportunityId String? @map("opportunity_id")
  opportunity   Opportunity? @relation(fields: [opportunityId], references: [id])
  accountId     String  @map("account_id")            // denormalize để query nhanh

  status   ContractStatus @default(ADAPTING)
  ownerId  String @map("owner_id")
  owner    User   @relation("ContractOwner", fields: [ownerId], references: [id])

  signedDate DateTime? @map("signed_date") @db.Date   // NGÀY KÝ → dùng cho booked_revenue
  startDate  DateTime? @map("start_date") @db.Date
  endDate    DateTime? @map("end_date") @db.Date
  nextActionDate DateTime? @map("next_action_date") @db.Date

  currency        String @default("USD") @db.Char(3)
  engagementModel EngagementModel? @map("engagement_model")
  deliveryUnits   DeliveryUnit[] @default([]) @map("delivery_units")

  // TCV/ActRev là generated column từ bảng con — xem SQL bên dưới
  contractDriveUrl String? @map("contract_drive_url")
  invoiceDriveUrl  String? @map("invoice_drive_url")
  note             String? @db.Text

  legacyAirtableId String? @unique @map("legacy_airtable_id")

  createdAt DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt DateTime  @updatedAt @map("updated_at") @db.Timestamptz
  deletedAt DateTime? @map("deleted_at") @db.Timestamptz

  monthlyRevenues ContractMonthRevenue[]
  activities      Activity[]

  @@index([accountId])
  @@index([opportunityId])
  @@index([ownerId])
  @@index([status])
  @@index([signedDate])
  @@map("contract")
}

/** MỘT DÒNG = MỘT THÁNG của một hợp đồng. Thay 12 cột + 24 rollup của hệ thống cũ. */
model ContractMonthRevenue {
  id         String   @id @default(uuid(7))
  contractId String   @map("contract_id")
  contract   Contract @relation(fields: [contractId], references: [id], onDelete: Cascade)
  year       Int
  month      Int                                        // 1-12
  amount     Decimal  @db.Decimal(14,2)                  // doanh thu kế hoạch của tháng
  isInvoiced Boolean  @default(false) @map("is_invoiced")
  invoicedAt DateTime? @map("invoiced_at") @db.Date
  isPaid     Boolean  @default(false) @map("is_paid")
  paidAt     DateTime? @map("paid_at") @db.Date
  paidAmount Decimal? @map("paid_amount") @db.Decimal(14,2)  // cho phép thu một phần
  note       String?

  // --- Truy vết: ai đánh dấu, lúc nào ---
  // Quyền cập nhật cờ thu tiền mở cho bd/am/sales_admin (xem 10.2), nên bắt buộc
  // ghi rõ người thao tác và hiển thị ngay trên bảng, không giấu trong audit log.
  invoicedById     String?   @map("invoiced_by_id")
  invoicedMarkedAt DateTime? @map("invoiced_marked_at") @db.Timestamptz
  paidById         String?   @map("paid_by_id")
  paidMarkedAt     DateTime? @map("paid_marked_at") @db.Timestamptz

  // --- Đối soát: chỉ sales_admin đặt được. Báo cáo tài chính chính thức
  //     dùng cột này, không dùng isPaid. Xem 10.5.2 ---
  reconciledById String?   @map("reconciled_by_id")
  reconciledAt   DateTime? @map("reconciled_at") @db.Timestamptz
  reconcileNote  String?   @map("reconcile_note")

  @@unique([contractId, year, month])
  @@index([year, month])
  @@index([isPaid])
  @@index([reconciledAt])
  @@map("contract_month_revenue")
}
```

**View tổng hợp (thay các field formula TCV/Act Rev/Q1-Q4/Hunting/Farming của hệ thống cũ):**

```sql
CREATE MATERIALIZED VIEW contract_summary AS
SELECT
  c.id AS contract_id,
  c.account_id,
  c.owner_id,
  SUM(m.amount)                                        AS tcv,
  SUM(CASE WHEN m.is_paid   THEN COALESCE(m.paid_amount, m.amount) ELSE 0 END) AS reported_collected,
  SUM(CASE WHEN m.reconciled_at IS NOT NULL
           THEN COALESCE(m.paid_amount, m.amount) ELSE 0 END)                    AS collected_revenue,
  SUM(CASE WHEN m.is_invoiced THEN m.amount ELSE 0 END) AS invoiced_revenue,
  SUM(CASE WHEN m.month BETWEEN 1 AND 3  THEN m.amount ELSE 0 END) AS q1,
  SUM(CASE WHEN m.month BETWEEN 4 AND 6  THEN m.amount ELSE 0 END) AS q2,
  SUM(CASE WHEN m.month BETWEEN 7 AND 9  THEN m.amount ELSE 0 END) AS q3,
  SUM(CASE WHEN m.month BETWEEN 10 AND 12 THEN m.amount ELSE 0 END) AS q4
FROM contract c
JOIN contract_month_revenue m ON m.contract_id = c.id
WHERE c.deleted_at IS NULL
GROUP BY c.id, c.account_id, c.owner_id;

CREATE UNIQUE INDEX ON contract_summary (contract_id);
-- Refresh: sau mỗi thay đổi contract_month_revenue (debounce 30s) + cron mỗi giờ
```

---

## 3.9. Bảng Pipeline (forecast)

⚠️ **Thay đổi so với hệ thống cũ:** bỏ hậu tố năm trong tên bảng (`Account Pipeline 2026` → `pipeline_entry`), chuẩn hoá 12 cột headcount + 24 cột revenue formula thành bảng con.

```prisma
model PipelineEntry {
  id        String   @id @default(uuid(7))
  name      String                                     // "Fujifilm HK - Photo platform"
  accountId String?  @map("account_id")                // NULL cho pipeline chưa lộ tên khách
  account   Account? @relation(fields: [accountId], references: [id])
  placeholderName String? @map("placeholder_name")     // "Thao unseen company" — giữ convention cũ
  opportunityId String? @map("opportunity_id")
  opportunity   Opportunity? @relation(fields: [opportunityId], references: [id])

  fiscalYear  Int     @map("fiscal_year")              // 2026, 2027...
  ownerId     String  @map("owner_id")
  owner       User    @relation(fields: [ownerId], references: [id])

  weightClass PipelineWeightClass @map("weight_class")  // KT1/KT2/KT3/TT/Pending
  engagementModel EngagementModel? @map("engagement_model")
  resourceType    ResourceType?    @map("resource_type")
  serviceOfferings ServiceOffering[] @default([]) @map("service_offerings")

  monthlyRate Decimal @map("monthly_rate") @db.Decimal(14,2)  // đơn giá / người / tháng
  currency    String  @default("USD") @db.Char(3)

  actionPlan  String? @map("action_plan") @db.Text
  isHunt      Boolean @default(true) @map("is_hunt")    // TÍNH TỰ ĐỘNG, xem 4.11

  legacyAirtableId String? @unique @map("legacy_airtable_id")

  createdAt DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt DateTime  @updatedAt @map("updated_at") @db.Timestamptz
  deletedAt DateTime? @map("deleted_at") @db.Timestamptz

  months PipelineMonth[]

  @@index([accountId])
  @@index([ownerId])
  @@index([fiscalYear])
  @@index([weightClass])
  @@map("pipeline_entry")
}

model PipelineMonth {
  id        String        @id @default(uuid(7))
  pipelineId String       @map("pipeline_id")
  pipeline  PipelineEntry @relation(fields: [pipelineId], references: [id], onDelete: Cascade)
  year      Int
  month     Int                                        // 1-12
  headcount Decimal       @db.Decimal(5,2)             // cho phép 0.5 FTE
  @@unique([pipelineId, year, month])
  @@index([year, month])
  @@map("pipeline_month")
}

/** Trọng số xác suất — LƯU Ở BẢNG, KHÔNG HARD-CODE.
 *  ⚠️ Hệ thống cũ hard-code trọng số trong 12 công thức tháng và SAI 1 tháng (Mar dùng 0.3
 *  trong khi 11 tháng khác dùng 0.15) → forecast tháng 3 bị nhân đôi trong nhiều tháng. */
model PipelineWeightConfig {
  weightClass PipelineWeightClass @id @map("weight_class")
  weight      Decimal @db.Decimal(4,3)                 // 0.900, 0.500, 0.100, 0.000
  labelVi     String  @map("label_vi")
  labelEn     String  @map("label_en")
  countsAsCommitted Boolean @default(false) @map("counts_as_committed") // vào "Total Worst Case"
  sortOrder   Int     @map("sort_order")
  updatedAt   DateTime @updatedAt @map("updated_at") @db.Timestamptz
  @@map("pipeline_weight_config")
}
```

**Seed bắt buộc:**

| weightClass | weight | labelVi | countsAsCommitted | sortOrder |
|---|---|---|---|---|
| `kt1` | 0.900 | KT1 — Rất chắc chắn (90%) | true | 1 |
| `kt2` | 0.500 | KT2 — Khả năng cao (50%) | false | 2 |
| `kt3` | 0.100 | KT3 — Còn sớm (10%) | false | 3 |
| `tt` | 0.100 | TT | false | 4 |
| `pending` | 0.000 | Pending — Chưa tính | false | 5 |

> **[DECIDE] Trọng số của `TT`.** File Excel nguồn tự mâu thuẫn: bảng "Trọng số" để trống % của TT, nhưng sheet "New Pipelines" gộp thành nhóm **"KT3+TT (10%)"**. **Mặc định dùng 0.100** (theo cách hiểu thứ hai, vì nó có số rõ ràng) và ghi nhận là cần xác nhận. Vì trọng số nằm trong bảng config nên **sửa lại chỉ mất 1 dòng UPDATE, không phải sửa code**.

**View tổng hợp forecast:**

```sql
CREATE VIEW pipeline_month_summary AS
SELECT
  p.fiscal_year, pm.year, pm.month, p.weight_class, p.owner_id, p.is_hunt,
  SUM(pm.headcount * p.monthly_rate)                  AS full_revenue,
  SUM(pm.headcount * p.monthly_rate * w.weight)       AS weighted_revenue,
  SUM(pm.headcount)                                   AS total_headcount
FROM pipeline_entry p
JOIN pipeline_month pm          ON pm.pipeline_id = p.id
JOIN pipeline_weight_config w   ON w.weight_class = p.weight_class
WHERE p.deleted_at IS NULL
GROUP BY p.fiscal_year, pm.year, pm.month, p.weight_class, p.owner_id, p.is_hunt;
```

---

## 3.10. Bảng Activity — bảng quan trọng nhất

⚠️ **Bảng này KHÔNG tồn tại trong hệ thống cũ.** Hệ thống cũ lưu lịch sử tương tác trong **7 field văn bản tự do** rải rác trên 4 bảng (`Account.Plan & Activity`, `Account.Investigated Info`, `Contact.Interactions`, `Contact.Investigated Info`, `Opportunity.Interactions`, `Contract.Interactions`, `Offline MTG.Note`), với quy ước ghi tay "dùng mốc thời gian tuyệt đối, tin mới ở trên". Hệ quả: không query được, không thống kê được, và AI không đọc được đáng tin cậy.

```prisma
model Activity {
  id        String       @id @default(uuid(7))
  type      ActivityType
  direction ActivityDirection @default(OUTBOUND)
  source    ActivitySource    @default(MANUAL)

  occurredAt DateTime @map("occurred_at") @db.Timestamptz   // BẮT BUỘC — thời điểm tuyệt đối
  durationMinutes Int? @map("duration_minutes")

  subject String?
  body    String? @db.Text

  // --- Liên kết (ít nhất 1 phải có) ---
  accountId     String? @map("account_id")
  account       Account? @relation(fields: [accountId], references: [id])
  contactId     String? @map("contact_id")
  contact       Contact? @relation(fields: [contactId], references: [id])
  opportunityId String? @map("opportunity_id")
  opportunity   Opportunity? @relation(fields: [opportunityId], references: [id])
  contractId    String? @map("contract_id")
  contract      Contract? @relation(fields: [contractId], references: [id])

  userId       String  @map("user_id")                      // người thực hiện
  user         User    @relation(fields: [userId], references: [id])
  participantUserIds String[] @default([]) @map("participant_user_ids")
  participantContactIds String[] @default([]) @map("participant_contact_ids")

  // --- Cho meeting offline (thay bảng Offline Schedule MTG cũ) ---
  meetingStatus  MeetingStatus? @map("meeting_status")
  meetingAddress String?        @map("meeting_address")
  meetingEndAt   DateTime?      @map("meeting_end_at") @db.Timestamptz
  isFirstMeeting Boolean        @default(false) @map("is_first_meeting")

  // --- Chấm điểm quan hệ ---
  scoreWeight Int? @map("score_weight")     // điểm cộng vào relationshipScore, xem 4.9
  countsForEngagement Boolean @default(true) @map("counts_for_engagement")

  // --- AI ---
  aiSummary   String?   @map("ai_summary") @db.Text
  aiSignals   Json?     @map("ai_signals")
  sentiment   Sentiment @default(UNKNOWN)
  aiProcessedAt DateTime? @map("ai_processed_at") @db.Timestamptz
  embedding   Unsupported("vector(1536)")?

  // --- Đồng bộ email ---
  externalId       String? @map("external_id")             // Gmail message id / Graph id
  externalThreadId String? @map("external_thread_id")
  fromEmail String? @map("from_email")
  toEmails  String[] @default([]) @map("to_emails")
  ccEmails  String[] @default([]) @map("cc_emails")

  attachments Json? // [{name, url, size, mimeType}]

  createdAt DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt DateTime  @updatedAt @map("updated_at") @db.Timestamptz
  deletedAt DateTime? @map("deleted_at") @db.Timestamptz

  @@unique([source, externalId])
  @@index([accountId, occurredAt(sort: Desc)])
  @@index([contactId, occurredAt(sort: Desc)])
  @@index([opportunityId, occurredAt(sort: Desc)])
  @@index([userId, occurredAt(sort: Desc)])
  @@index([type])
  @@index([occurredAt(sort: Desc)])
  @@map("activity")
}
```

**Constraint bổ sung:**

```sql
-- Bắt buộc gắn với ít nhất 1 đối tượng
ALTER TABLE activity ADD CONSTRAINT activity_has_link CHECK (
  account_id IS NOT NULL OR contact_id IS NOT NULL
  OR opportunity_id IS NOT NULL OR contract_id IS NOT NULL
);

-- Không cho ghi hoạt động ở tương lai quá 1 năm (bắt lỗi nhập sai năm)
ALTER TABLE activity ADD CONSTRAINT activity_occurred_sane CHECK (
  occurred_at < now() + interval '1 year'
);

CREATE INDEX activity_embedding_idx ON activity USING hnsw (embedding vector_cosine_ops);
CREATE INDEX activity_body_fts ON activity USING gin(to_tsvector('simple', coalesce(subject,'') || ' ' || coalesce(body,'')));
```

**Bảng trọng số điểm quan hệ (thay 6 cột đếm tay của hệ thống cũ):**

```prisma
model EngagementWeightConfig {
  activityType ActivityType @id @map("activity_type")
  weight       Int                                        // điểm cộng
  labelVi      String @map("label_vi")
  requiresProof Boolean @default(false) @map("requires_proof") // vd: document_shared cần bằng chứng khách mở
  updatedAt    DateTime @updatedAt @map("updated_at") @db.Timestamptz
  @@map("engagement_weight_config")
}
```

**Seed — giữ nguyên trọng số đã kiểm chứng của hệ thống cũ:**

| activityType | weight | Ghi chú |
|---|---|---|
| `referral_received` | **150** | Khách giới thiệu khách khác — giá trị cao nhất |
| `favor` | **80** | Giúp đỡ khách |
| `social_meal` | **50** | Ăn/cafe/đi chơi |
| `document_shared` | **45** | `requiresProof = true` — chỉ tính khi khách mở/tải/phản hồi |
| `gift_sent` | **40** | Quà, chúc mừng sinh nhật/kỷ niệm |
| `office_visit_from_client` | 40 | Khách tới thăm văn phòng |
| `office_visit_to_client` | 30 | Mình tới thăm khách |
| `meeting_offline` | 20 | |
| `meeting_online` | 10 | |
| `linkedin_engagement` | **3** | Like/comment/share |
| `call` | 5 | |
| `email_out` | 1 | |
| `email_in` | 2 | Khách chủ động trả lời có giá trị hơn mình gửi đi |
| `note`, `status_change` | 0 | Không tính điểm |

---

## 3.11. Bảng Signal (thay `Recent IT Events`)

```prisma
model AccountSignal {
  id        String  @id @default(uuid(7))
  accountId String  @map("account_id")
  account   Account @relation(fields: [accountId], references: [id], onDelete: Cascade)

  type       SignalType
  relevance  SignalRelevance
  title      String
  summary    String  @db.Text
  whyRelevant String? @map("why_relevant") @db.Text
  sourceUrl  String? @map("source_url")
  eventDate  DateTime? @map("event_date") @db.Date
  detectedAt DateTime @default(now()) @map("detected_at") @db.Timestamptz

  isRead      Boolean @default(false) @map("is_read")
  isUseful    Boolean? @map("is_useful")           // feedback của người dùng → đo chất lượng AI
  dismissedAt DateTime? @map("dismissed_at") @db.Timestamptz

  aiInsightId String? @map("ai_insight_id")

  @@index([accountId, detectedAt(sort: Desc)])
  @@index([relevance])
  @@index([type])
  @@map("account_signal")
}
```

---

## 3.12. Bảng View và trạng thái theo người dùng

Đây là phần đáp ứng yêu cầu: *"View phải cho phép tuỳ chỉnh độ rộng cột, và khi thoát ra thì lưu lại trạng thái hiển thị, view đó, filter đó."*

```prisma
model View {
  id         String   @id @default(uuid(7))
  objectType String   @map("object_type")   // 'account'|'contact'|'opportunity'|'contract'|'pipeline'|'activity'
  name       String
  viewType   ViewType @default(GRID) @map("view_type")
  visibility ViewVisibility @default(PERSONAL)
  ownerId    String?  @map("owner_id")
  owner      User?    @relation(fields: [ownerId], references: [id])
  isDefault  Boolean  @default(false) @map("is_default")
  sortOrder  Int      @default(0) @map("sort_order")
  icon       String?
  description String?

  config     Json                            // ViewConfig, xem schema bên dưới

  createdAt DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt DateTime  @updatedAt @map("updated_at") @db.Timestamptz
  deletedAt DateTime? @map("deleted_at") @db.Timestamptz

  userStates ViewUserState[]

  @@index([objectType, visibility])
  @@index([ownerId])
  @@map("view")
}

model ViewUserState {
  viewId      String   @map("view_id")
  userId      String   @map("user_id")
  view        View     @relation(fields: [viewId], references: [id], onDelete: Cascade)
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  overrides   Json     @default("{}")        // ViewUserOverrides, xem bên dưới
  lastOpenedAt DateTime @default(now()) @map("last_opened_at") @db.Timestamptz
  @@id([viewId, userId])
  @@map("view_user_state")
}

/** Ghi nhớ view cuối cùng người dùng mở cho mỗi object */
model UserLastView {
  userId     String @map("user_id")
  objectType String @map("object_type")
  viewId     String @map("view_id")
  updatedAt  DateTime @updatedAt @map("updated_at") @db.Timestamptz
  @@id([userId, objectType])
  @@map("user_last_view")
}
```

**Schema của `View.config` (Zod, file `packages/shared/src/schemas/view.ts`):**

```typescript
export const FilterOperator = z.enum([
  'eq','neq','gt','gte','lt','lte',
  'contains','not_contains','starts_with','ends_with',
  'is_empty','is_not_empty',
  'in','not_in',
  'is_within',          // cho date range
  'has_any_of','has_all_of','has_none_of',   // cho array field
]);

export const FilterCondition = z.object({
  field: z.string(),                    // 'rank' | 'account.country.iso2' | 'owner.id'
  operator: FilterOperator,
  value: z.any().optional(),
  // Giá trị động — QUAN TRỌNG: thay 9 calendar view đặt tên cứng theo người của hệ thống cũ
  dynamicValue: z.enum([
    'CURRENT_USER','CURRENT_USER_TEAM',
    'TODAY','THIS_WEEK','THIS_MONTH','THIS_QUARTER','THIS_YEAR',
    'LAST_WEEK','LAST_MONTH','LAST_QUARTER',
    'NEXT_7_DAYS','NEXT_30_DAYS','PAST_7_DAYS','PAST_30_DAYS','PAST_90_DAYS',
  ]).optional(),
});

export const FilterGroup: z.ZodType<any> = z.lazy(() => z.object({
  conjunction: z.enum(['and','or']),
  conditions: z.array(z.union([FilterCondition, FilterGroup])),
}));

export const ViewConfig = z.object({
  filters: FilterGroup.optional(),
  sorts: z.array(z.object({
    field: z.string(),
    direction: z.enum(['asc','desc']),
  })).default([]),
  groupBy: z.object({
    field: z.string(),
    collapsed: z.array(z.string()).default([]),
  }).optional(),
  fields: z.array(z.object({
    key: z.string(),
    visible: z.boolean().default(true),
    width: z.number().int().min(60).max(800).default(160),   // ĐỘ RỘNG CỘT
    pinned: z.enum(['left','right']).optional(),
  })),
  rowHeight: z.enum(['short','medium','tall','extra_tall']).default('short'),
  colorRules: z.array(z.object({
    condition: FilterCondition,
    color: z.string(),
  })).default([]),
  // riêng cho kanban
  kanbanGroupField: z.string().optional(),
  // riêng cho calendar
  calendarDateField: z.string().optional(),
  // riêng cho timeline
  timelineStartField: z.string().optional(),
  timelineEndField: z.string().optional(),
});

/** Ghi đè cá nhân trên view chung — người dùng chỉnh độ rộng cột trên view của team
 *  thì chỉ ảnh hưởng chính họ */
export const ViewUserOverrides = z.object({
  fieldWidths: z.record(z.string(), z.number()).default({}),
  hiddenFields: z.array(z.string()).default([]),
  collapsedGroups: z.array(z.string()).default([]),
  sorts: z.array(z.object({ field: z.string(), direction: z.enum(['asc','desc']) })).optional(),
  lastScrollRowIndex: z.number().optional(),
});
```

**Quy tắc hợp nhất config + overrides (implement ở `packages/shared/src/formulas/mergeViewConfig.ts`):**

```typescript
function resolveViewConfig(view: View, overrides: ViewUserOverrides | null): ResolvedConfig {
  const base = ViewConfig.parse(view.config);
  if (!overrides) return base;

  // view LOCKED: không cho ghi đè bất cứ gì trừ độ rộng cột
  if (view.visibility === 'locked') {
    return { ...base, fields: applyWidths(base.fields, overrides.fieldWidths) };
  }

  return {
    ...base,
    sorts: overrides.sorts ?? base.sorts,
    fields: base.fields.map(f => ({
      ...f,
      width: overrides.fieldWidths[f.key] ?? f.width,
      // QUY TẮC: field MỚI được thêm vào view chung thì MẶC ĐỊNH HIỆN,
      // kể cả với người đã tuỳ biến ẩn cột. Lý do: rủi ro lớn hơn là người dùng
      // không biết có field mới (vd field bắt buộc cho KPI mới) và bỏ trống nó.
      visible: overrides.hiddenFields.includes(f.key) ? false : f.visible,
    })),
    groupBy: base.groupBy ? {
      ...base.groupBy,
      collapsed: overrides.collapsedGroups,
    } : undefined,
  };
}
```

---

## 3.13. Bảng KPI

```prisma
model KpiTarget {
  id         String @id @default(uuid(7))
  metric     KpiMetric
  scopeType  KpiScopeType @map("scope_type")
  scopeId    String?      @map("scope_id")        // userId | teamId | null (company)
  periodType KpiPeriodType @map("period_type")
  periodStart DateTime @map("period_start") @db.Date
  periodEnd   DateTime @map("period_end") @db.Date
  targetValue Decimal  @map("target_value") @db.Decimal(14,2)
  currency    String?  @db.Char(3)
  note        String?

  createdById String   @map("created_by_id")
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt   DateTime @updatedAt @map("updated_at") @db.Timestamptz

  @@unique([metric, scopeType, scopeId, periodType, periodStart])
  @@index([periodStart, periodEnd])
  @@map("kpi_target")
}

/** ⚠️ Snapshot phải ĐÓNG BĂNG con số tại thời điểm chốt kỳ.
 *  Nếu tính lại từ dữ liệu hiện tại, thì khi ai đó sửa hợp đồng cũ,
 *  con số KPI tuần trước sẽ đổi → báo cáo đã trình lãnh đạo không còn khớp. */
model KpiSnapshot {
  id          String @id @default(uuid(7))
  metric      KpiMetric
  scopeType   KpiScopeType @map("scope_type")
  scopeId     String?      @map("scope_id")
  periodType  KpiPeriodType @map("period_type")
  periodStart DateTime @map("period_start") @db.Date
  periodEnd   DateTime @map("period_end") @db.Date

  targetValue Decimal? @map("target_value") @db.Decimal(14,2)
  actualValue Decimal  @map("actual_value") @db.Decimal(14,2)
  achievementRate Decimal? @map("achievement_rate") @db.Decimal(6,4)  // actual/target
  rag         RagStatus @default(NO_TARGET)

  breakdown   Json?                                   // chi tiết drill-down
  recordIds   String[] @default([]) @map("record_ids") // id các bản ghi tạo nên con số
  isFinal     Boolean @default(false) @map("is_final") // true = kỳ đã đóng, không tính lại
  computedAt  DateTime @default(now()) @map("computed_at") @db.Timestamptz

  @@unique([metric, scopeType, scopeId, periodType, periodStart])
  @@index([periodStart, periodType])
  @@map("kpi_snapshot")
}

/** Ngưỡng RAG — cấu hình được, không hard-code.
 *  ⚠️ Hệ thống cũ (file Excel) gán màu bằng tay, không có quy tắc. */
model RagThresholdConfig {
  id          String @id @default(uuid(7))
  metric      KpiMetric?                          // null = áp dụng cho mọi metric
  redBelow    Decimal @map("red_below") @db.Decimal(5,4)     // mặc định 0.40
  amberBelow  Decimal @map("amber_below") @db.Decimal(5,4)   // mặc định 0.70
  updatedAt   DateTime @updatedAt @map("updated_at") @db.Timestamptz
  @@unique([metric])
  @@map("rag_threshold_config")
}
```

> **[DECIDE] Ngưỡng RAG mặc định: Red < 40%, Amber 40–70%, Green ≥ 70%.** Suy ra từ 2 điểm dữ liệu quan sát được trong file Excel gốc (33% được gán Red; 54,5% được gán Amber). **Hai điểm dữ liệu không đủ để khẳng định** — nhưng vì ngưỡng nằm trong bảng config nên đổi lại chỉ mất 1 câu UPDATE.

---

## 3.14. Bảng họp tuần và việc cần làm

```prisma
model WeeklyMeeting {
  id          String   @id @default(uuid(7))
  meetingDate DateTime @map("meeting_date") @db.Date
  weekStart   DateTime @map("week_start") @db.Date       // thứ 2 của tuần
  weekEnd     DateTime @map("week_end") @db.Date
  title       String?
  facilitatorId String? @map("facilitator_id")
  participantIds String[] @default([]) @map("participant_ids")

  aiBrief     String?  @map("ai_brief") @db.Text          // AI tóm tắt tuần
  aiBriefAt   DateTime? @map("ai_brief_at") @db.Timestamptz
  notes       String?  @db.Text
  snapshotData Json?   @map("snapshot_data")              // đóng băng số liệu tại thời điểm họp

  status      String   @default("draft")                  // draft | in_progress | closed
  closedAt    DateTime? @map("closed_at") @db.Timestamptz
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz

  actionItems ActionItem[]

  @@unique([weekStart])
  @@map("weekly_meeting")
}

model ActionItem {
  id        String   @id @default(uuid(7))
  meetingId String?  @map("meeting_id")
  meeting   WeeklyMeeting? @relation(fields: [meetingId], references: [id])

  title       String
  description String? @db.Text
  assigneeId  String  @map("assignee_id")
  dueDate     DateTime? @map("due_date") @db.Date
  priority    Int     @default(2)                    // 1=cao, 2=trung bình, 3=thấp

  accountId     String? @map("account_id")
  opportunityId String? @map("opportunity_id")
  contactId     String? @map("contact_id")

  status      String  @default("open")               // open | in_progress | done | cancelled
  completedAt DateTime? @map("completed_at") @db.Timestamptz
  carriedOverCount Int @default(0) @map("carried_over_count")  // số tuần bị dời

  createdFromAi Boolean @default(false) @map("created_from_ai")
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt   DateTime @updatedAt @map("updated_at") @db.Timestamptz

  @@index([assigneeId, status])
  @@index([dueDate])
  @@map("action_item")
}
```

---

## 3.15. Bảng AI và audit

```prisma
model AiInsight {
  id        String @id @default(uuid(7))
  kind      AiInsightKind
  objectType String? @map("object_type")
  objectId   String? @map("object_id")
  userId     String? @map("user_id")

  model       String                              // 'claude-sonnet-4-5'
  promptHash  String  @map("prompt_hash")          // sha256, để dedupe/cache
  promptText  String? @map("prompt_text") @db.Text
  inputRefs   Json?   @map("input_refs")           // [{type:'activity', ids:[...]}]
  toolCalls   Json?   @map("tool_calls")           // các tool đã gọi + tham số
  output      Json?
  outputText  String? @map("output_text") @db.Text

  inputTokens  Int? @map("input_tokens")
  outputTokens Int? @map("output_tokens")
  costUsd      Decimal? @map("cost_usd") @db.Decimal(10,6)
  latencyMs    Int? @map("latency_ms")

  userFeedback String? @map("user_feedback")       // 'useful'|'not_useful'|null
  createdAt    DateTime @default(now()) @map("created_at") @db.Timestamptz

  @@index([kind, createdAt(sort: Desc)])
  @@index([objectType, objectId])
  @@index([userId, createdAt(sort: Desc)])
  @@map("ai_insight")
}

/** Mọi thao tác GHI do AI đề xuất đều đi qua bảng này. Không có ngoại lệ cho bulk update. */
model AiProposal {
  id          String @id @default(uuid(7))
  aiInsightId String? @map("ai_insight_id")
  userId      String @map("user_id")
  status      AiProposalStatus @default(PENDING)

  operations  Json                                 // ProposalOperation[], xem 8.7
  reason      String  @db.Text                     // AI giải thích vì sao đề xuất
  warnings    Json?                                // cảnh báo validation

  affectedCount Int   @map("affected_count")
  previewData   Json  @map("preview_data")         // diff để hiển thị

  confirmedAt  DateTime? @map("confirmed_at") @db.Timestamptz
  rejectedAt   DateTime? @map("rejected_at") @db.Timestamptz
  editedOperations Json? @map("edited_operations") // nếu người dùng sửa trước khi xác nhận
  expiresAt    DateTime @map("expires_at") @db.Timestamptz   // mặc định +30 phút
  undoDeadline DateTime? @map("undo_deadline") @db.Timestamptz // +24h sau khi confirm
  undoSnapshot Json?     @map("undo_snapshot")     // dữ liệu trước khi ghi

  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz

  @@index([userId, status])
  @@index([status, expiresAt])
  @@map("ai_proposal")
}

model AuditLog {
  id        String   @id @default(uuid(7))
  occurredAt DateTime @default(now()) @map("occurred_at") @db.Timestamptz
  actorType AuditActorType @map("actor_type")
  actorId   String?  @map("actor_id")
  action    String                                  // 'create'|'update'|'delete'|'bulk_update'|'login'|'export'
  objectType String  @map("object_type")
  objectId   String  @map("object_id")
  changes    Json?                                  // {field: {before, after}}
  reason     String?                                // BẮT BUỘC khi actorType='ai'
  aiProposalId String? @map("ai_proposal_id")
  ipAddress  String? @map("ip_address")
  userAgent  String? @map("user_agent")

  @@index([objectType, objectId, occurredAt(sort: Desc)])
  @@index([actorId, occurredAt(sort: Desc)])
  @@index([occurredAt(sort: Desc)])
  @@map("audit_log")
}
```

**Phân vùng bảng audit (vì sẽ lớn nhanh):**
```sql
-- Partition theo tháng, giữ vô thời hạn (yêu cầu compliance ISO 27001/SOC2)
CREATE TABLE audit_log (...) PARTITION BY RANGE (occurred_at);
-- Job tự tạo partition tháng kế tiếp, chạy ngày 25 hàng tháng
```

---

## 3.16. Bảng hỗ trợ đồng bộ email

```prisma
model EmailAccount {
  id           String @id @default(uuid(7))
  userId       String @map("user_id")
  user         User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  provider     String                          // 'google' | 'microsoft'
  emailAddress String @map("email_address")
  accessToken  String @map("access_token")     // mã hoá at-rest
  refreshToken String @map("refresh_token")    // mã hoá at-rest
  tokenExpiresAt DateTime @map("token_expires_at") @db.Timestamptz

  syncEnabled  Boolean @default(true) @map("sync_enabled")
  syncMode     String  @default("metadata_plus_matched") @map("sync_mode")
  lastHistoryId String? @map("last_history_id")   // Gmail historyId / Graph deltaToken
  lastSyncAt   DateTime? @map("last_sync_at") @db.Timestamptz
  lastSyncError String?  @map("last_sync_error")

  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz
  @@unique([userId, emailAddress])
  @@map("email_account")
}

/** Địa chỉ email lặp lại nhiều lần nhưng chưa có Contact → gợi ý tạo */
model UnmatchedEmailAddress {
  id         String @id @default(uuid(7))
  email      String @unique
  domain     String
  seenCount  Int    @default(1) @map("seen_count")
  firstSeenAt DateTime @default(now()) @map("first_seen_at") @db.Timestamptz
  lastSeenAt  DateTime @default(now()) @map("last_seen_at") @db.Timestamptz
  suggestedAccountId String? @map("suggested_account_id")
  dismissedAt DateTime? @map("dismissed_at") @db.Timestamptz
  @@index([seenCount(sort: Desc)])
  @@map("unmatched_email_address")
}
```
---

# 4. BUSINESS RULES — ĐẶC TẢ TÍNH TOÁN

> Mọi hàm trong phần này implement ở `packages/shared/src/formulas/`, dùng chung FE và BE.
> **Mỗi hàm PHẢI có unit test với ít nhất 3 case, trong đó có 1 case lấy từ dữ liệu thật của hệ thống cũ.**

## 4.1. Nguyên tắc chung

| Nguyên tắc | Chi tiết |
|---|---|
| Không hard-code hằng số nghiệp vụ | Trọng số, ngưỡng đều đọc từ bảng config. ⚠️ Hệ thống cũ hard-code trọng số 12 lần và sai 1 lần |
| Tính toán idempotent | Chạy lại cho cùng input phải ra cùng output |
| Tính bất đồng bộ, không chặn UI | Field tính toán cập nhật qua job/trigger, không tính trong request path |
| Luôn có `computedAt` | Để biết số liệu cũ bao lâu |
| Null-safe | Thiếu dữ liệu → trả `null`, KHÔNG trả 0. Vì 0 và "chưa biết" khác nhau hoàn toàn trong báo cáo |

---

## 4.2. `computeAccountRank` — xếp hạng account

**Nguồn:** giữ nguyên ma trận đã dùng thật trong hệ thống cũ (`Account.Rank`).

```typescript
/**
 * Rank = f(potential, dealSizeTier), CHỈ áp dụng khi account đã "chạm" thực sự.
 * "Chạm thực sự" = có ít nhất một trong: first meeting | NDA đã ký | có opportunity.
 * Chưa chạm → NOT_RANKED, bất kể potential được chấm thế nào.
 */
export function computeAccountRank(input: {
  potential: AccountPotential | null;
  dealSizeTier: DealSizeTier | null;
  hasFirstMeeting: boolean;
  hasNda: boolean;
  hasOpportunity: boolean;
}): AccountRank {
  const touched = input.hasFirstMeeting || input.hasNda || input.hasOpportunity;
  if (!touched) return 'not_ranked';
  if (!input.potential || !input.dealSizeTier) return 'not_ranked';

  const { potential: p, dealSizeTier: t } = input;
  const isBig = t === 'mega' || t === 'medium';

  if (p === 'high')                      return 'a';
  if (p === 'middle' && isBig)           return 'a';
  if (p === 'middle' && t === 'small')   return 'b';
  if (p === 'low'    && isBig)           return 'b';
  if (p === 'low'    && t === 'small')   return 'c';
  if (p === 'zero')                      return 'c';
  return 'not_ranked';   // p === 'na'
}
```

**Ma trận kết quả (dùng làm test case):**

| potential ↓ / tier → | mega | medium | small |
|---|---|---|---|
| high | A | A | A |
| middle | A | A | B |
| low | B | B | C |
| zero | C | C | C |
| na | NOT_RANKED | NOT_RANKED | NOT_RANKED |

**Trigger tính lại:** khi `potential` hoặc `dealSizeTier` đổi; khi tạo activity `is_first_meeting=true`; khi `ndaSignedDate` được điền; khi tạo/xoá opportunity.

**Rule kiểm chứng potential tự chấm [SHOULD]:**
```typescript
/** Cảnh báo khi potential=HIGH quá lâu mà không sinh cơ hội.
 *  Định nghĩa HIGH là "cơ hội ngay hoặc <=2 tuần" → sau 30 ngày mà không có
 *  opportunity nào thì đánh giá đó nhiều khả năng sai. */
export function shouldFlagStalePotential(a: {
  potential: AccountPotential | null;
  potentialSetAt: Date | null;
  openOpportunityCount: number;
  now: Date;
}): boolean {
  if (a.potential !== 'high' || !a.potentialSetAt) return false;
  if (a.openOpportunityCount > 0) return false;
  return daysBetween(a.potentialSetAt, a.now) > 30;
}
```

---

## 4.3. `computeCompanyRelationshipScore`

**Nguồn:** công thức hệ thống cũ, đã sửa 1 lỗi (dùng TCV năm hiện tại thay vì TCV 2024 cố định).

```typescript
/**
 * Đo mức độ quan hệ giữa 2 CÔNG TY (khác với relationshipScore đo quan hệ giữa 2 NGƯỜI).
 * Mục tiêu vận hành: >= 3.0
 *
 * Điểm visit tính theo quy ước nghiệp vụ (người nhập tự cộng dồn khi tạo activity):
 *   3 điểm: cả 2 tầng C-level của khách ra mặt
 *   2 điểm: 1 trong 2 C-level ra mặt (hoặc Senior Manager/VP với khách tier Mega)
 *   1 điểm: các trường hợp còn lại
 */
export function computeCompanyRelationshipScore(input: {
  visitToClientPoints: number;      // tổng điểm từ activity office_visit_to_client
  visitFromClientPoints: number;    // tổng điểm từ activity office_visit_from_client
  currentYearTcv: number | null;    // ⚠️ hệ thống cũ dùng cứng TCV 2024 → đã lỗi thời
  annualItBudget: number | null;
  hasNda: boolean;
}): number {
  let score = input.visitToClientPoints + input.visitFromClientPoints;

  if (input.annualItBudget && input.annualItBudget > 0 && input.currentYearTcv) {
    score += (input.currentYearTcv / input.annualItBudget) * 10;
  }
  if (input.hasNda) score += 1;
  if (input.currentYearTcv && input.currentYearTcv > 0) score += 0.5;

  return round(score, 1);
}
```

---

## 4.4. `computeAccountInfoQuality`

⚠️ Hệ thống cũ có bug: đếm field `Type` **hai lần** (trọng số 2) trong khi mô tả nói số hạng thứ 8 phải là Tier. Bản dưới đã sửa.

```typescript
const ACCOUNT_INFO_WEIGHTS = {
  revenueBand: 1, industryId: 1, specialDomain: 2, website: 2,
  countryId: 2, dealSizeTier: 1, yearFounded: 1, icpType: 1,   // ← thay cho lần đếm trùng
} as const;
const ACCOUNT_INFO_TOTAL = 11;   // tổng trọng số

export function computeAccountInfoQuality(a: Partial<Account>): number {
  let s = 0;
  for (const [field, w] of Object.entries(ACCOUNT_INFO_WEIGHTS)) {
    if (isFilled(a[field])) s += w;
  }
  return round(s / ACCOUNT_INFO_TOTAL, 4);   // 0.0000 - 1.0000
}
```
**Mục tiêu vận hành: > 0.70.** Hiển thị dạng thanh tiến độ trong record panel.

---

## 4.5. `computeContactInfoQuality`

```typescript
const CONTACT_INFO_WEIGHTS = { email:1, linkedinUrl:1, phone:1, birthday:1, title:2 } as const;
const CONTACT_INFO_TOTAL = 6;

export function computeContactInfoQuality(c: Partial<Contact>): number {
  let s = 0;
  for (const [f, w] of Object.entries(CONTACT_INFO_WEIGHTS)) if (isFilled(c[f])) s += w;
  return round(s / CONTACT_INFO_TOTAL, 4);
}
```

---

## 4.6. `computeAccountRevenueTier`

```typescript
/** Phân loại theo doanh thu HBLAB THU ĐƯỢC từ account trong 12 tháng gần nhất.
 *  KHÁC với account.revenueBand (= doanh thu của chính công ty khách). */
const REVENUE_TIER_THRESHOLDS = { key: 200_000, mega: 400_000 };  // USD/năm, lưu ở config

export function computeAccountRevenueTier(trailing12mRevenueUsd: number): AccountRevenueTier {
  if (trailing12mRevenueUsd >= REVENUE_TIER_THRESHOLDS.mega) return 'mega';
  if (trailing12mRevenueUsd >= REVENUE_TIER_THRESHOLDS.key)  return 'key';
  return 'normal';
}
```

---

## 4.7. `computeRelationshipScore` — điểm quan hệ với một người

**Nguồn:** công thức **thật** trong hệ thống cũ (khác với mô tả trong tài liệu của họ — luôn theo công thức).

```typescript
/**
 * Điểm quan hệ giữa 1 nhân viên HBLAB và 1 contact.
 * Khác biệt lớn nhất so với hệ thống cũ: KHÔNG còn 6 ô đếm nhập tay,
 * mà tính từ bảng activity → giảm bỏ sót.
 *
 * Đặc điểm giữ nguyên từ hệ thống cũ:
 *   - Phân rã theo thời gian: -0.5 điểm/ngày kể từ khi tạo contact
 *   - Điểm khởi đầu +7
 *   - Chặn dưới -30, chặn trên 200
 */
const SCORE_FLOOR = -30;
const SCORE_CAP = 200;
const SCORE_STARTING_BONUS = 7;
const SCORE_DECAY_PER_DAY = 0.5;

export function computeRelationshipScore(input: {
  activities: Array<{ type: ActivityType; countsForEngagement: boolean }>;
  weights: Record<ActivityType, number>;      // từ engagement_weight_config
  hasFirstMeeting: boolean;
  contactCreatedAt: Date;
  now: Date;
}): number {
  let raw = SCORE_STARTING_BONUS;
  if (input.hasFirstMeeting) raw += 10;

  for (const a of input.activities) {
    if (!a.countsForEngagement) continue;
    raw += input.weights[a.type] ?? 0;
  }

  const ageDays = daysBetween(input.contactCreatedAt, input.now);
  raw -= ageDays * SCORE_DECAY_PER_DAY;

  return Math.round(Math.min(Math.max(raw, SCORE_FLOOR), SCORE_CAP));
}
```

> **Giải thích cơ chế phân rã cho người đọc tài liệu:** điểm giảm 0,5/ngày (≈15/tháng) nghĩa là một contact không có tương tác gì sẽ **tự động nguội**. Muốn giữ điểm dương, cần khoảng 1 hành động cỡ trung bình (như chia sẻ tài liệu hữu ích, 45 điểm) mỗi 3 tháng. Đây là thiết kế có chủ đích: điểm cao = quan hệ **đang** tốt, không phải **đã từng** tốt.

**Job tính lại:** hàng đêm cho contact có activity mới trong 24h; hàng tuần cho toàn bộ (vì phân rã theo ngày).

---

## 4.8. Validation rules — thay cơ chế `Validator` formula của hệ thống cũ

⚠️ **Thay đổi cách hoạt động:** hệ thống cũ tính formula rồi đưa vào view "Invalid Record" — tức là **phát hiện sau khi dữ liệu đã sai**. Ở đây validation chạy **tại thời điểm nhập**, và hiển thị **cảnh báo mềm trong ô** (viền vàng/đỏ + tooltip) chứ **không chặn lưu** — trừ nhóm `blocking`.

```typescript
export type ValidationSeverity = 'blocking' | 'error' | 'warning';

export interface ValidationIssue {
  field: string;
  code: string;                 // 'MISSING_ASSIGNEE'
  severity: ValidationSeverity;
  messageVi: string;
  messageEn: string;
  fixHint?: string;             // hướng dẫn sửa
  fixAction?: { type: string; payload: any };   // hành động sửa 1 click
}
```

### 4.8.1. Account

```typescript
export function validateAccount(a: Account, ctx: ValidationContext): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!a.companyName?.trim())
    issues.push({ field:'companyName', code:'MISSING_NAME', severity:'blocking',
      messageVi:'Tên công ty là bắt buộc', messageEn:'Company name is required' });

  if (!a.ownerId)
    issues.push({ field:'ownerId', code:'MISSING_OWNER', severity:'error',
      messageVi:'Chưa có người phụ trách', messageEn:'No owner assigned',
      fixHint:'Mọi account phải có người phụ trách' });

  if (!a.dealSizeTier)
    issues.push({ field:'dealSizeTier', code:'MISSING_TIER', severity:'error',
      messageVi:'Chưa phân loại quy mô deal', messageEn:'Deal size tier not set' });

  // Giữ nguyên rule cũ: account đang watch thì chưa cần contact
  if (ctx.contactCount === 0 && !a.isWatching)
    issues.push({ field:'contacts', code:'MISSING_CONTACT', severity:'error',
      messageVi:'Chưa có contact nào', messageEn:'No contact yet',
      fixAction:{ type:'CREATE_CONTACT', payload:{ accountId:a.id } } });

  if (!a.icpType)
    issues.push({ field:'icpType', code:'MISSING_ICP', severity:'warning',
      messageVi:'Chưa xác định loại hình công ty (ICP)', messageEn:'ICP type not set',
      fixAction:{ type:'RUN_AI_ENRICHMENT', payload:{ accountId:a.id } } });

  if (a.potential && !ctx.hasFirstMeeting)
    issues.push({ field:'potential', code:'POTENTIAL_WITHOUT_MEETING', severity:'warning',
      messageVi:'Đánh giá tiềm năng chỉ có hiệu lực sau khi đã có 1st meeting',
      messageEn:'Potential rating is only valid after a first meeting' });

  if (shouldFlagStalePotential({ ...a, openOpportunityCount: ctx.openOppCount, now: ctx.now }))
    issues.push({ field:'potential', code:'STALE_HIGH_POTENTIAL', severity:'warning',
      messageVi:'Đã đánh giá High >30 ngày nhưng chưa có cơ hội nào — cần xem lại',
      messageEn:'Marked High >30 days with no opportunity — review needed' });

  return issues;
}
```

### 4.8.2. Contact — giữ nguyên logic phân nhánh của hệ thống cũ

```typescript
export function validateContact(c: Contact, ctx: ValidationContext): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const isRelaxed = c.objectives.includes('return_to_mkt')
                 || c.objectives.includes('review_for_removing');

  if (!c.fullName?.trim())
    issues.push({ field:'fullName', code:'MISSING_NAME', severity:'blocking',
      messageVi:'Tên là bắt buộc', messageEn:'Name is required' });

  if (!c.accountId)
    issues.push({ field:'accountId', code:'MISSING_ACCOUNT', severity:'error',
      messageVi:'Chưa gắn với công ty nào', messageEn:'Not linked to any company' });

  // NHÁNH NỚI LỎNG: contact đã trả về marketing hoặc chờ xoá
  if (isRelaxed) return issues;

  // NHÁNH ĐẦY ĐỦ
  if (!c.assigneeId)
    issues.push({ field:'assigneeId', code:'MISSING_ASSIGNEE', severity:'error',
      messageVi:'Chưa có người phụ trách', messageEn:'No assignee' });

  if (c.objectives.length === 0)
    issues.push({ field:'objectives', code:'MISSING_OBJECTIVE', severity:'error',
      messageVi:'Phải có ít nhất 1 mục tiêu', messageEn:'At least one objective required' });

  if (!c.source)
    issues.push({ field:'source', code:'MISSING_SOURCE', severity:'error',
      messageVi:'Chưa ghi nguồn contact', messageEn:'Source is required' });

  if (!c.title?.trim())
    issues.push({ field:'title', code:'MISSING_TITLE', severity:'warning',
      messageVi:'Chưa có chức danh — cần để biết vai trò trong tổ chức',
      messageEn:'Title missing — needed to understand their role' });

  if (!c.nextActionDate) {
    issues.push({ field:'nextActionDate', code:'MISSING_NEXT_ACTION', severity:'error',
      messageVi:'Chưa đặt ngày hành động tiếp theo', messageEn:'Next action date not set' });
  } else {
    // Rule khác nhau theo objective — giữ nguyên hệ thống cũ
    const overdueDays = daysBetween(c.nextActionDate, ctx.now);
    const graceDays = c.objectives.includes('close_the_deal') ? 30 : 0;
    if (overdueDays > graceDays) {
      issues.push({ field:'nextActionDate', code:'OVERDUE_NEXT_ACTION', severity:'error',
        messageVi: graceDays > 0
          ? `Quá hạn ${overdueDays} ngày (cơ hội đang đóng deal cho phép trễ tối đa 30 ngày)`
          : `Quá hạn ${overdueDays} ngày`,
        messageEn: `Overdue by ${overdueDays} days` });
    }
  }
  return issues;
}
```

### 4.8.3. Opportunity

```typescript
export function validateOpportunity(o: Opportunity, ctx: ValidationContext): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const isClosed = o.status === 'won' || o.status === 'lost' || o.actionClass === 'd_archive';

  if (!o.ownerId)
    issues.push({ field:'ownerId', code:'MISSING_OWNER', severity:'blocking',
      messageVi:'Chưa có người phụ trách', messageEn:'Owner is required' });

  if (!o.accountId)
    issues.push({ field:'accountId', code:'MISSING_ACCOUNT', severity:'blocking',
      messageVi:'Chưa gắn công ty', messageEn:'Account is required' });

  if (o.status === 'won' && ctx.contractCount === 0)
    issues.push({ field:'status', code:'WON_WITHOUT_CONTRACT', severity:'error',
      messageVi:'Đã Won nhưng chưa có hợp đồng',
      messageEn:'Won but no contract exists',
      fixHint:'Tạo hợp đồng cho cơ hội này',
      fixAction:{ type:'CREATE_CONTRACT', payload:{ opportunityId:o.id } } });

  if (o.status === 'lost' && o.lossReasons.length === 0)
    issues.push({ field:'lossReasons', code:'LOST_WITHOUT_REASON', severity:'error',
      messageVi:'Đã Lost nhưng chưa ghi lý do — cần để phân tích win/loss',
      messageEn:'Lost without reason — needed for win/loss analysis' });

  if (isClosed) return issues;

  // Chỉ áp dụng cho cơ hội đang mở
  if (!o.nextActionDate)
    issues.push({ field:'nextActionDate', code:'MISSING_NEXT_ACTION', severity:'error',
      messageVi:'Chưa đặt hành động tiếp theo', messageEn:'Next action date required' });
  else if (isBefore(o.nextActionDate, ctx.today))
    issues.push({ field:'nextActionDate', code:'OVERDUE_NEXT_ACTION', severity:'error',
      messageVi:'Ngày hành động tiếp theo đã quá hạn', messageEn:'Next action date is overdue' });
  else if (daysBetween(ctx.today, o.nextActionDate) >= 90)
    issues.push({ field:'nextActionDate', code:'NEXT_ACTION_TOO_FAR', severity:'warning',
      messageVi:'Kế hoạch quá xa (>90 ngày) — cơ hội có còn thật không?',
      messageEn:'Next action >90 days away — is this still real?' });

  if (!o.deadline)
    issues.push({ field:'deadline', code:'MISSING_DEADLINE', severity:'error',
      messageVi:'Chưa có deadline', messageEn:'Deadline required' });
  else if (o.nextActionDate && isBefore(o.deadline, o.nextActionDate))
    issues.push({ field:'deadline', code:'DEADLINE_BEFORE_ACTION', severity:'error',
      messageVi:'Deadline sớm hơn ngày hành động tiếp theo', messageEn:'Deadline is before next action' });

  // Rule tự động phát hiện cơ hội chết
  const ageDays = daysBetween(o.originCreatedDate ?? o.createdAt, ctx.now);
  if (ageDays > 90 && ctx.daysSinceLastActivity > 45)
    issues.push({ field:'status', code:'STALE_OPPORTUNITY', severity:'warning',
      messageVi:`Cơ hội đã ${Math.round(ageDays/30)} tháng và không có hoạt động ${ctx.daysSinceLastActivity} ngày — cân nhắc đóng`,
      messageEn:'Stale opportunity — consider closing',
      fixAction:{ type:'MARK_LOST', payload:{ opportunityId:o.id } } });

  return issues;
}
```

### 4.8.4. Contract — giữ cơ chế đối soát tài chính của hệ thống cũ

```typescript
export function validateContract(c: Contract, months: ContractMonthRevenue[], ctx): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (c.status === 'finished') return issues;

  if (!c.startDate || !c.endDate)
    issues.push({ field:'startDate', code:'MISSING_DATES', severity:'error',
      messageVi:'Thiếu ngày bắt đầu/kết thúc', messageEn:'Missing start/end date' });
  else if (daysBetween(c.startDate, c.endDate) < 5)
    issues.push({ field:'endDate', code:'DATES_TOO_CLOSE', severity:'warning',
      messageVi:'Ngày bắt đầu và kết thúc quá gần nhau (<5 ngày)',
      messageEn:'Start and end dates are too close' });

  if (!c.engagementModel)
    issues.push({ field:'engagementModel', code:'MISSING_MODEL', severity:'error',
      messageVi:'Chưa chọn mô hình hợp tác', messageEn:'Engagement model required' });

  // Đối soát: có tiền tháng nào thì tháng đó phải nằm trong khoảng hiệu lực hợp đồng
  if (c.startDate && c.endDate) {
    for (const m of months) {
      if (m.amount <= 0) continue;
      const monthDate = new Date(m.year, m.month - 1, 1);
      if (isBefore(monthDate, startOfMonth(c.startDate)) || isAfter(monthDate, endOfMonth(c.endDate))) {
        issues.push({ field:`month_${m.year}_${m.month}`, code:'REVENUE_OUTSIDE_TERM', severity:'error',
          messageVi:`Có doanh thu tháng ${m.month}/${m.year} nhưng tháng này nằm ngoài thời hạn hợp đồng`,
          messageEn:`Revenue in ${m.month}/${m.year} falls outside contract term` });
      }
    }
  }

  if (!c.nextActionDate)
    issues.push({ field:'nextActionDate', code:'MISSING_NEXT_ACTION', severity:'warning',
      messageVi:'Chưa đặt ngày theo dõi tiếp theo', messageEn:'Next action date not set' });
  else if (daysBetween(ctx.today, c.nextActionDate) >= 31)
    issues.push({ field:'nextActionDate', code:'NEXT_ACTION_TOO_FAR', severity:'warning',
      messageVi:'Ngày theo dõi tiếp theo quá xa (>31 ngày)', messageEn:'Next action too far out' });

  // Cảnh báo thu tiền
  const overdueUnpaid = months.filter(m =>
    m.isInvoiced && !m.isPaid && m.invoicedAt && daysBetween(m.invoicedAt, ctx.today) > 45);
  if (overdueUnpaid.length > 0)
    issues.push({ field:'payment', code:'OVERDUE_PAYMENT', severity:'error',
      messageVi:`Có ${overdueUnpaid.length} tháng đã xuất invoice >45 ngày chưa thu được tiền`,
      messageEn:`${overdueUnpaid.length} invoiced month(s) unpaid for >45 days` });

  return issues;
}
```

---

## 4.9. Presales handoff gate

```typescript
/**
 * Chặn chuyển opportunity sang trạng thái cần presales nếu chưa đủ thông tin.
 * Thay rule "đủ 3/4 BANT mới chuyển presales" của hệ thống cũ — vốn chỉ ghi trong
 * mô tả field và KHÔNG CÓ GÌ ENFORCE.
 *
 * [DECIDE] Ngưỡng mặc định: 4/6 chiều MEDDIC được điền có nội dung thực chất,
 *          BẮT BUỘC gồm Identify Pain và Economic Buyer.
 *          Lưu ở bảng config để đổi được không cần deploy.
 */
const MEDDIC_GATE = {
  minDimensionsFilled: 4,
  requiredDimensions: ['meddicIdentifyPain', 'meddicEconomicBuyer'] as const,
  minCharsPerDimension: 30,      // chống điền cho có
};

export function canHandoffToPresales(o: Opportunity): { allowed: boolean; missing: string[] } {
  const dims = [
    'meddicMetrics','meddicEconomicBuyer','meddicDecisionCriteria',
    'meddicDecisionProcess','meddicIdentifyPain','meddicChampion',
  ] as const;

  const filled = dims.filter(d => (o[d]?.trim().length ?? 0) >= MEDDIC_GATE.minCharsPerDimension);
  const missingRequired = MEDDIC_GATE.requiredDimensions.filter(d => !filled.includes(d));

  const allowed = filled.length >= MEDDIC_GATE.minDimensionsFilled && missingRequired.length === 0;
  const missing = [
    ...missingRequired,
    ...(filled.length < MEDDIC_GATE.minDimensionsFilled
        ? [`Cần điền thêm ${MEDDIC_GATE.minDimensionsFilled - filled.length} chiều MEDDIC`] : []),
  ];
  return { allowed, missing };
}
```

> ⚠️ **Lưu ý về `minCharsPerDimension`:** đây là proxy thô giống hệt cách hệ thống cũ chấm `BANT LoD Score` bằng `LEN()`. Nó **chỉ dùng làm cổng chặn cơ bản**. Chất lượng thực sự do AI đánh giá (mục 8.6) — nhưng không dùng AI làm cổng chặn cứng, vì AI có thể sai và không nên chặn người làm việc.

---

## 4.10. Meeting agenda category — điều khiển agenda họp tuần

**Nguồn:** giữ logic `MTG Category` và `Meeting Category` của hệ thống cũ, gồm cả cơ chế hashtag.

```typescript
export interface AgendaTag { code: string; priority: number; labelVi: string; labelEn: string; }

/** Cho Account */
export function computeAccountAgendaTags(a: Account, ctx: {
  currentYearRevenue: number; lastYearRevenue: number;
  maxOpenWinRate: number; maxOpenOppValue: number;
  hasMeetingInWindow: boolean;   // -7 ngày đến +30 ngày
}): AgendaTag[] {
  const note = (a.planNote ?? '').toLowerCase();
  const hasSkip = note.includes('#skip');
  const hasHelp = note.includes('#help');
  const tags: AgendaTag[] = [];

  // #SKIP tắt nhóm 1-4, nhưng KHÔNG tắt #HELP và New MTG — giữ nguyên hành vi cũ
  if (!hasSkip) {
    if (ctx.currentYearRevenue > 0) tags.push({ code:'REV_CURRENT_YEAR', priority:1,
      labelVi:'Có doanh thu năm nay', labelEn:'Revenue this year' });
    if (ctx.lastYearRevenue > 0)    tags.push({ code:'REV_LAST_YEAR', priority:2,
      labelVi:'Có doanh thu năm ngoái', labelEn:'Revenue last year' });
    if (ctx.maxOpenWinRate >= 0.25) tags.push({ code:'HIGH_WIN_RATE', priority:3,
      labelVi:'RFP win rate cao', labelEn:'High RFP win rate' });
    if (ctx.maxOpenOppValue >= 30_000) tags.push({ code:'HIGH_VALUE_RFP', priority:4,
      labelVi:'RFP giá trị lớn', labelEn:'High value RFP' });
  }
  if (ctx.hasMeetingInWindow) tags.push({ code:'NEW_MEETING', priority:5,
    labelVi:'Có lịch gặp', labelEn:'Has meeting' });
  if (hasHelp) tags.push({ code:'NEEDS_HELP', priority:6,
    labelVi:'Cần thảo luận', labelEn:'Needs discussion' });

  return tags.sort((x,y) => x.priority - y.priority);
}

/** Cho Opportunity */
export function computeOpportunityAgendaTags(o: Opportunity, ctx: {
  accountDealSizeTier: DealSizeTier | null; ageWeeks: number; today: Date;
}): AgendaTag[] {
  if (o.status === 'won' || o.status === 'lost') return [];
  const tags: AgendaTag[] = [];

  if (ctx.accountDealSizeTier === 'mega')   tags.push({ code:'MEGA_ACCOUNT', priority:1, labelVi:'Khách Mega', labelEn:'Mega account' });
  if ((o.weightedValue ?? 0) >= 10_000)     tags.push({ code:'BIG_DEAL', priority:2, labelVi:'Deal lớn', labelEn:'Big deal' });
  if (ctx.ageWeeks === 0)                    tags.push({ code:'NEW_OPP', priority:3, labelVi:'Cơ hội mới', labelEn:'New opportunity' });
  if (ctx.accountDealSizeTier === 'medium') tags.push({ code:'MEDIUM_ACCOUNT', priority:4, labelVi:'Khách Medium', labelEn:'Medium account' });
  if (o.deadline && daysBetween(ctx.today, o.deadline) < 7)
    tags.push({ code:'DEADLINE_NEAR', priority:5, labelVi:'Sát deadline', labelEn:'Deadline near' });
  if ((o.meddicScore ?? 0) < 0.24)
    tags.push({ code:'WEAK_QUALIFICATION', priority:6, labelVi:'Thiếu thông tin MEDDIC', labelEn:'Weak MEDDIC' });

  return tags.sort((x,y) => x.priority - y.priority);
}
```

**Yêu cầu UI cho hashtag [MUST]:** ô `planNote` phải có autocomplete gợi ý `#SKIP`, `#HELP` khi người dùng gõ `#`; sau khi lưu, hashtag hiển thị dưới dạng chip màu; parse **không phân biệt hoa thường**. ⚠️ Hệ thống cũ phân biệt hoa thường nên gõ `#help` là không ăn.

---

## 4.11. Hunt vs Farm

> ✅ **ĐÃ CHỐT: dùng định nghĩa 12 THÁNG LĂN (`rolling_12m`).**
>
> Doanh thu phát sinh trong **12 tháng đầu** kể từ hợp đồng đầu tiên của account = Hunt; từ tháng 13 trở đi = Farm.
>
> Hệ thống cũ có hai định nghĩa song song (theo năm tài chính và theo 12 tháng lăn), cả hai đều được rollup lên KPI của sales — nghĩa là hai báo cáo cho cùng một câu hỏi ra hai con số khác nhau. Nay thống nhất một.
>
> ⚠️ **Hệ quả triển khai:** nhãn hunt/farm gắn vào **từng dòng `contract_month_revenue`**, không phải một cờ trên Account — vì một account có thể vừa sinh doanh thu Hunt vừa sinh Farm trong cùng một năm. Job tính lại hằng đêm và **đóng băng nhãn vào KPI snapshot** khi chốt kỳ. Xem chi tiết ở mục 15.10.1. Vẫn cấu hình được qua `system_config.hunt_farm_mode`.

```typescript
export type HuntFarmMode = 'fiscal_year' | 'rolling_12m';

export function classifyHuntFarm(input: {
  mode: HuntFarmMode;
  accountFirstContractDate: Date | null;
  revenueYear: number; revenueMonth: number;
  fiscalYear: number;
}): 'hunt' | 'farm' {
  if (!input.accountFirstContractDate) return 'hunt';   // chưa từng có hợp đồng → khách mới

  if (input.mode === 'fiscal_year') {
    return input.accountFirstContractDate.getFullYear() >= input.fiscalYear ? 'hunt' : 'farm';
  }
  // rolling_12m
  const revenueDate = new Date(input.revenueYear, input.revenueMonth - 1, 1);
  const monthsSince = monthsBetween(input.accountFirstContractDate, revenueDate);
  return monthsSince < 12 ? 'hunt' : 'farm';
}
```

---

## 4.12. KPI — định nghĩa từng metric

⚠️ **Đây là phần dễ sai nhất và ảnh hưởng nghiêm trọng nhất.** Ba khái niệm "doanh thu" khác nhau phải được phân biệt tuyệt đối rõ:

| Metric | Định nghĩa chính xác | Mốc thời gian dùng để quy về kỳ |
|---|---|---|
| `booked_revenue` | **Doanh số ký.** Tổng TCV của các hợp đồng **được ký** trong kỳ | `contract.signed_date` |
| `billing_revenue` | **Doanh thu thuộc kỳ.** Tổng `amount` của các tháng doanh thu **rơi vào** kỳ | `contract_month_revenue.(year, month)` |
| `collected_revenue` | **Tiền đã thu.** Tổng `paid_amount` của các tháng **được đánh dấu đã thu** trong kỳ | `contract_month_revenue.paid_at` |

```sql
-- booked_revenue: theo ngày ký
SELECT SUM(cs.tcv)
FROM contract c JOIN contract_summary cs ON cs.contract_id = c.id
WHERE c.signed_date BETWEEN :periodStart AND :periodEnd
  AND c.deleted_at IS NULL
  AND (:scopeType <> 'user' OR c.owner_id = :scopeId);

-- billing_revenue: theo tháng phân bổ
SELECT SUM(m.amount)
FROM contract_month_revenue m JOIN contract c ON c.id = m.contract_id
WHERE make_date(m.year, m.month, 1)
      BETWEEN date_trunc('month', :periodStart::date) AND :periodEnd
  AND c.deleted_at IS NULL
  AND (:scopeType <> 'user' OR c.owner_id = :scopeId);

-- collected_revenue: theo ngày thu tiền, CHỈ TÍNH DÒNG ĐÃ ĐỐI SOÁT
-- ⚠️ Dùng reconciled_at chứ không dùng is_paid — vì is_paid do bd/am tự đánh dấu,
--    còn reconciled_at do sales_admin xác nhận với kế toán. Xem 10.5.2.
SELECT SUM(COALESCE(m.paid_amount, m.amount))
FROM contract_month_revenue m JOIN contract c ON c.id = m.contract_id
WHERE m.reconciled_at IS NOT NULL
  AND m.paid_at BETWEEN :periodStart AND :periodEnd
  AND c.deleted_at IS NULL;

-- reported_collected: "báo đã thu", chưa đối soát — dùng cho theo dõi nội bộ,
-- KHÔNG dùng cho báo cáo tài chính chính thức
SELECT SUM(COALESCE(m.paid_amount, m.amount))
FROM contract_month_revenue m JOIN contract c ON c.id = m.contract_id
WHERE m.is_paid AND m.paid_at BETWEEN :periodStart AND :periodEnd
  AND c.deleted_at IS NULL;

-- meeting_count
SELECT COUNT(*) FROM activity
WHERE type IN ('meeting_online','meeting_offline')
  AND occurred_at BETWEEN :periodStart AND :periodEnd
  AND deleted_at IS NULL
  AND (:scopeType <> 'user' OR user_id = :scopeId);

-- first_meeting_count
SELECT COUNT(*) FROM activity
WHERE is_first_meeting = true
  AND occurred_at BETWEEN :periodStart AND :periodEnd AND deleted_at IS NULL;

-- sql_count: opportunity vượt ngưỡng MEDDIC trong kỳ
SELECT COUNT(*) FROM opportunity
WHERE ready_for_presales = true
  AND meddic_score_at BETWEEN :periodStart AND :periodEnd
  AND deleted_at IS NULL;

-- pipeline_value: forecast có trọng số
SELECT SUM(pm.headcount * p.monthly_rate * w.weight)
FROM pipeline_entry p
JOIN pipeline_month pm        ON pm.pipeline_id = p.id
JOIN pipeline_weight_config w ON w.weight_class = p.weight_class
WHERE make_date(pm.year, pm.month, 1) BETWEEN :periodStart AND :periodEnd
  AND p.deleted_at IS NULL;
```

**Ranh giới kỳ (bắt buộc thống nhất):**

```typescript
/** Tuần: THỨ HAI 00:00 đến CHỦ NHẬT 23:59:59 theo timezone user.
 *  Quý: Q1 = Jan-Mar (năm dương lịch).
 *  [DECIDE] Nếu HBLAB dùng năm tài chính khác năm dương lịch thì sửa ở đây. Mặc định: trùng. */
export function getPeriodRange(type: KpiPeriodType, ref: Date, tz: string): { start: Date; end: Date } { ... }
```

**Tính RAG:**
```typescript
export function computeRag(actual: number, target: number | null, cfg: RagThresholdConfig): RagStatus {
  if (target == null || target === 0) return 'no_target';
  const rate = actual / target;
  if (rate < cfg.redBelow)   return 'red';      // mặc định < 0.40
  if (rate < cfg.amberBelow) return 'amber';    // mặc định 0.40 - 0.70
  return 'green';
}
```

---

## 4.13. Phát hiện trùng lặp

```typescript
/** Chạy khi tạo Account mới — hệ thống cũ không có gì chống trùng nên có
 *  nhiều account trùng tên khác cách viết. */
export async function findDuplicateAccounts(input: { companyName: string; website?: string })
  : Promise<Array<{ id: string; score: number; reason: string }>> {
  // 1. Trùng domain website  → score 1.0 (chắc chắn trùng)
  // 2. Trùng tên đã chuẩn hoá (lowercase, bỏ Ltd/Inc/Pte/JSC/Co, gộp khoảng trắng) → 0.9
  // 3. Trigram similarity > 0.8 trên tên → 0.7
  // 4. Cosine similarity embedding > 0.92 → 0.6
  // Ngưỡng hiển thị cảnh báo: >= 0.6
}
```

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX account_name_trgm ON account USING gin (company_name gin_trgm_ops);
```

---

# 5. API SPECIFICATION

## 5.1. Quy ước chung

| Hạng mục | Quy định |
|---|---|
| Base URL | `/api/v1` |
| Auth | `Authorization: Bearer <accessToken>` |
| Content-Type | `application/json` |
| Timezone | Server trả UTC ISO8601. Client tự chuyển đổi |
| Pagination | Cursor-based: `?cursor=<opaque>&limit=50`. Response có `nextCursor` |
| Sorting | `?sort=field:asc,field2:desc` |
| Sparse fields | `?fields=id,companyName,rank` |
| Rate limit | 300 req/phút/user; AI endpoint 20 req/phút/user |

**Response thành công:**
```json
{ "data": {...}, "meta": { "requestId": "...", "computedAt": "..." } }
```

**Response danh sách:**
```json
{ "data": [...], "meta": { "total": 1147, "nextCursor": "eyJpZCI6...", "hasMore": true } }
```

**Response lỗi:**
```json
{ "error": { "code": "VALIDATION_FAILED", "message": "...",
             "details": { "issues": [ { "field": "ownerId", "code": "MISSING_OWNER", ... } ] } } }
```

**Mã lỗi chuẩn:** `UNAUTHENTICATED` · `FORBIDDEN` · `NOT_FOUND` · `VALIDATION_FAILED` · `CONFLICT` · `RATE_LIMITED` · `AI_BUDGET_EXCEEDED` · `INTERNAL_ERROR`

## 5.2. Auth

```
POST   /api/v1/auth/login          { email, password } → { accessToken, refreshToken, user }
POST   /api/v1/auth/refresh        { refreshToken } → { accessToken }
POST   /api/v1/auth/logout
GET    /api/v1/auth/me             → User + permissions
POST   /api/v1/auth/oauth/google   (SSO) [SHOULD]
```

## 5.3. CRUD chuẩn cho các object nghiệp vụ

Áp dụng cho `accounts`, `contacts`, `opportunities`, `contracts`, `pipeline-entries`, `activities`.

```
GET    /api/v1/{object}                    Danh sách (query params ở 5.4)
POST   /api/v1/{object}                    Tạo mới
GET    /api/v1/{object}/{id}               Chi tiết
PATCH  /api/v1/{object}/{id}               Cập nhật một phần
DELETE /api/v1/{object}/{id}               Soft delete
POST   /api/v1/{object}/bulk               Tạo/sửa hàng loạt (tối đa 500)
GET    /api/v1/{object}/{id}/validation    Danh sách ValidationIssue
GET    /api/v1/{object}/{id}/activities    Timeline hoạt động
GET    /api/v1/{object}/{id}/audit         Lịch sử thay đổi
```

### `PATCH /api/v1/{object}/{id}` — endpoint dùng nhiều nhất (inline edit)

**Yêu cầu hiệu năng [MUST]: p95 < 200ms.** Đây là endpoint được gọi mỗi khi người dùng sửa một ô trong grid.

```jsonc
// Request
{ "potential": "high", "ownerId": "018f..." }

// Response 200
{
  "data": { /* record đầy đủ sau khi cập nhật, gồm cả field tính lại */ },
  "meta": {
    "validation": { "issues": [ /* cảnh báo mềm, KHÔNG chặn */ ] },
    "recomputed": ["rank", "companyRelationshipScore"]   // để FE biết field nào đổi theo
  }
}

// Response 422 — chỉ khi vi phạm rule 'blocking'
{ "error": { "code": "VALIDATION_FAILED",
             "details": { "issues": [{ "field":"companyName", "severity":"blocking", ... }] } } }
```

**Optimistic concurrency:** client gửi header `If-Unmodified-Since: <updatedAt>`. Nếu bản ghi đã đổi → `409 CONFLICT` kèm bản mới nhất để client hiển thị so sánh.

## 5.4. Query API cho grid

`GET /api/v1/{object}` nhận các tham số:

```
?viewId=<uuid>              Áp dụng config của view đã lưu (gồm cả overrides của user hiện tại)
&filter=<base64 JSON>       Ghi đè filter tạm thời
&sort=rank:asc,companyName:asc
&groupBy=rank
&fields=id,companyName,rank,ownerId
&cursor=<opaque>&limit=100
&search=<text>              Full-text search
&includeDeleted=false
```

**Endpoint tổng hợp (cho summary bar dưới mỗi cột — hành vi kiểu spreadsheet):**
```
GET /api/v1/{object}/aggregate?viewId=...&aggregations=estimatedValue:sum,id:count,winRate:avg
→ { "data": { "estimatedValue_sum": 1250000, "id_count": 47, "winRate_avg": 0.32 } }
```

## 5.5. View API

```
GET    /api/v1/views?objectType=account          Danh sách view user thấy được
POST   /api/v1/views                             Tạo view
GET    /api/v1/views/{id}                        Chi tiết (đã merge overrides)
PATCH  /api/v1/views/{id}                        Sửa view (kiểm tra quyền)
DELETE /api/v1/views/{id}
POST   /api/v1/views/{id}/duplicate              Nhân bản thành view cá nhân

// QUAN TRỌNG cho yêu cầu "lưu trạng thái": gọi khi user thay đổi UI
PUT    /api/v1/views/{id}/user-state
       { "fieldWidths": {"companyName": 240}, "hiddenFields": ["fiscalYearEndMonth"],
         "collapsedGroups": ["mega"], "lastScrollRowIndex": 120 }
       → 204 No Content

GET    /api/v1/views/last?objectType=account     View cuối cùng user mở
PUT    /api/v1/views/last                        { objectType, viewId }
```

**Hành vi bắt buộc [MUST]:**
- FE gọi `PUT /user-state` với **debounce 800ms** sau khi người dùng resize cột / ẩn cột / gập nhóm
- Khi mở lại object, FE gọi `GET /views/last` → nếu có thì mở view đó, không có thì mở view mặc định
- Trạng thái cuộn chỉ lưu chỉ số dòng, không lưu pixel

## 5.6. KPI API

```
GET  /api/v1/kpi/dashboard?periodType=week&periodStart=2026-08-03&scopeType=team&scopeId=...
→ {
  "data": {
    "period": { "type":"week", "start":"2026-08-03", "end":"2026-08-09", "label":"Tuần 32/2026" },
    "metrics": [
      { "metric":"booked_revenue", "target":50000, "actual":33000,
        "achievementRate":0.66, "rag":"amber", "currency":"USD",
        "previousPeriodActual":41000, "trend":-0.195,
        "drillDownUrl":"/api/v1/kpi/drill-down?..." },
      ...
    ],
    "byUser": [ { "userId":"...", "displayName":"Mike", "metrics":[...] } ],
    "dataQuality": {                      // BẮT BUỘC — khai báo dữ liệu thiếu
      "missingOwner": 3, "invalidRecords": 12, "staleOpportunities": 5,
      "excludedFromCalc": [ { "reason":"Thiếu estimatedValue", "count":4 } ]
    }
  }
}

GET  /api/v1/kpi/drill-down?metric=booked_revenue&periodStart=...&scopeId=...
→ Danh sách record tạo nên con số (để mở thành view)

GET  /api/v1/kpi/targets?periodType=quarter&year=2026
POST /api/v1/kpi/targets              Đặt chỉ tiêu
POST /api/v1/kpi/targets/bulk         Đặt hàng loạt (VD: cả năm cho cả team)
POST /api/v1/kpi/recompute            Tính lại snapshot kỳ hiện tại (chỉ manager+)
```

## 5.7. Weekly meeting API

```
GET  /api/v1/weekly-meetings/current            Lấy/tạo phiên họp tuần hiện tại
GET  /api/v1/weekly-meetings/{id}
POST /api/v1/weekly-meetings/{id}/generate-brief    AI sinh tóm tắt tuần
POST /api/v1/weekly-meetings/{id}/close             Đóng phiên, đóng băng snapshot
GET  /api/v1/weekly-meetings/{id}/agenda            Danh sách account/opp cần bàn (theo agenda tag)

GET  /api/v1/action-items?assigneeId=&status=open
POST /api/v1/action-items
PATCH /api/v1/action-items/{id}
POST /api/v1/action-items/{id}/carry-over          Dời sang tuần sau, tăng carriedOverCount
```

## 5.8. AI API

```
POST /api/v1/ai/chat
  { "message": "Tuần này team đạt bao nhiêu % KPI meeting?",
    "conversationId": "...", "context": { "objectType":"account", "viewId":"..." } }
→ Server-Sent Events stream:
  event: thinking     data: {"step":"Đang xác định phạm vi câu hỏi"}
  event: tool_call    data: {"tool":"getKPI","args":{...}}
  event: tool_result  data: {"rowCount":47}
  event: message      data: {"text":"Tuần này team đạt 66%..."}
  event: evidence     data: {"queryDescription":"...","recordCount":47,"drillDownUrl":"..."}
  event: done         data: {"aiInsightId":"..."}

POST /api/v1/ai/enrich-account/{id}      Chạy enrichment cho 1 account
POST /api/v1/ai/qualification/{oppId}    Chấm điểm MEDDIC
POST /api/v1/ai/summarize-activities     { objectType, objectId, limit }
GET  /api/v1/ai/proposals?status=pending
POST /api/v1/ai/proposals/{id}/confirm   { editedOperations?: [...] }
POST /api/v1/ai/proposals/{id}/reject    { reason?: string }
POST /api/v1/ai/proposals/{id}/undo      Trong 24h
POST /api/v1/ai/insights/{id}/feedback   { feedback: 'useful' | 'not_useful' }
GET  /api/v1/ai/usage                    Chi phí AI tháng này vs ngân sách
```

## 5.9. WebSocket

```
ws://host/ws?token=<accessToken>

Server → Client:
  { "type":"record.updated", "objectType":"account", "id":"...",
    "changes":{...}, "updatedBy":{"id":"...","displayName":"Mike"} }
  { "type":"record.created",  ... }
  { "type":"record.deleted",  ... }
  { "type":"proposal.created", "proposalId":"..." }
  { "type":"signal.detected", "accountId":"...", "relevance":"high" }
  { "type":"kpi.recomputed", "periodType":"week" }
  { "type":"presence", "objectType":"account", "id":"...",
    "users":[{"id":"...","displayName":"Dory","editingField":"potential"}] }

Client → Server:
  { "type":"subscribe", "channels":["account:list","account:018f..."] }
  { "type":"presence.enter", "objectType":"account", "id":"...", "field":"potential" }
```

**Hành vi bắt buộc:** khi người khác sửa một ô đang hiển thị trên màn hình mình, ô đó **nhấp nháy nhẹ 1 giây kèm tên người sửa**, không hiện popup, không reload trang.
---

# 6. ĐẶC TẢ MÀN HÌNH

## 6.0. Khung layout chung

```
┌───────────────────────────────────────────────────────────────────────────┐
│ [Logo] Tomahawk    [⌘K Tìm kiếm...]              [🔔 3] [AI ✨] [Avatar▾] │ 56px
├──────┬────────────────────────────────────────────────────────────────────┤
│      │  ┌─ Tabs view ─────────────────────────────────┐  [+ View]  [⚙]   │
│ Nav  │  │ ⭐Của tôi │ Tất cả │ Tier A │ Cần action ▾  │                   │ 40px
│      │  └─────────────────────────────────────────────┘                   │
│ 200px│  [🔍 Lọc nhanh] [Filter: 2] [Sort: 1] [Nhóm: Rank] [Cột] [Xuất]   │ 40px
│      ├────────────────────────────────────────────────────────────────────┤
│      │                                                                     │
│      │                     VÙNG NỘI DUNG (Grid / Kanban / Calendar)        │
│      │                                                                     │
│      ├────────────────────────────────────────────────────────────────────┤
│      │ Tổng: 1.147 bản ghi   Σ Giá trị: $2.4M   ⚠ 12 bản ghi thiếu dữ liệu│ 32px
└──────┴────────────────────────────────────────────────────────────────────┘
```

**Sidebar (200px, thu gọn được xuống 56px):**
```
🏠 Trang chủ
📊 Họp tuần                    ← mở là thấy ngay cockpit tuần hiện tại
🎯 KPI
─────────────
🏢 Công ty          (1.147)
👤 Liên hệ          (1.230)
💼 Cơ hội           (198)  ← badge đỏ nếu có cơ hội quá hạn
📄 Hợp đồng         (62)
📈 Pipeline
📅 Hoạt động
─────────────
✅ Việc của tôi     (7)
💰 Thu tiền         (5)  ← chỉ hiện với vai trò sales_admin / manager / bod / admin
⚙️  Cài đặt
```

> **Sidebar thay đổi theo vai trò.** `bd` không thấy mục Hợp đồng và Thu tiền (không có quyền xem). `sales_admin` thấy mục Thu tiền làm mục mặc định khi đăng nhập, thay vì Trang chủ.

## 6.1. Màn hình danh sách (Grid) — màn quan trọng nhất

**Route:** `/accounts`, `/contacts`, `/opportunities`, `/contracts`, `/pipeline`, `/activities`

### 6.1.1. Hành vi khi tải trang [MUST]

```
1. GET /views/last?objectType=account
2. Nếu có viewId  → GET /views/{id}  (config đã merge với user overrides)
   Nếu không      → dùng view mặc định của object
3. GET /{object}?viewId=...&limit=100
4. Khôi phục: độ rộng cột, cột ẩn/hiện, sort, filter, nhóm đã gập,
   và cuộn tới dòng lastScrollRowIndex
5. Không có màn hình "chọn view" ở giữa. Mở là thấy đúng thứ lần trước đang xem.
```

### 6.1.2. Thanh view tabs

- Hiển thị tối đa 6 view, còn lại gom vào dropdown `▾`
- View cá nhân có icon ⭐, view khoá có icon 🔒
- Click phải trên tab → menu: Đổi tên · Nhân bản · Chia sẻ · Đặt mặc định · Xoá
- Nút `[+ View]` mở modal tạo view

### 6.1.3. Thanh công cụ

| Nút | Hành vi |
|---|---|
| 🔍 Lọc nhanh | Ô search, debounce 300ms, tìm full-text |
| Filter (n) | Mở panel dựng filter (xem 6.1.7). Badge = số điều kiện |
| Sort (n) | Panel sắp xếp nhiều cấp, kéo thả đổi thứ tự |
| Nhóm | Chọn field để nhóm. Nhóm hiện header có count + tổng số tiền |
| Cột | Panel bật/tắt + kéo thả sắp xếp cột |
| Xuất | CSV / Excel — xuất đúng cột và filter đang hiển thị |
| ✨ Hỏi AI | Mở chat panel với ngữ cảnh view hiện tại |

### 6.1.4. Grid — hành vi bắt buộc

| # | Hành vi | Chi tiết kỹ thuật |
|---|---|---|
| 1 | **Sửa trực tiếp trong ô** | Click 1 lần = chọn ô. Click 2 lần hoặc Enter hoặc bắt đầu gõ = vào chế độ sửa. **Không mở modal** |
| 2 | Lưu tự động | Blur hoặc Enter hoặc Tab = gọi `PATCH`. Optimistic UI: hiện giá trị mới ngay, rollback nếu lỗi |
| 3 | **Resize cột** | Kéo mép phải header. Double-click mép = auto-fit. Lưu qua `PUT /views/{id}/user-state` (debounce 800ms) |
| 4 | Reorder cột | Kéo thả header |
| 5 | Ghim cột | Cột đầu (tên) ghim trái mặc định |
| 6 | **Điều hướng bàn phím** | ↑↓←→ di chuyển · Tab/Shift+Tab sang phải/trái · Enter xuống dưới · Esc huỷ sửa · Ctrl/Cmd+C/V copy-paste · Ctrl+Z undo |
| 7 | **Chọn vùng** | Shift+click, Shift+arrow. Ctrl/Cmd+A chọn tất cả |
| 8 | **Copy-paste đa ô** | Copy ra clipboard dạng TSV (dán được vào Excel). Paste từ Excel vào grid: khớp theo vị trí, validate từng ô, ô lỗi tô đỏ và không ghi |
| 9 | Fill-down | Kéo góc dưới-phải ô đã chọn |
| 10 | **Sửa hàng loạt** | Chọn nhiều dòng → thanh hành động nổi lên: "Đã chọn 12 · Đổi owner · Đổi rank · Xoá" |
| 11 | Virtualize | Chỉ render dòng trong viewport + 10 dòng đệm. **Mượt tới 100.000 dòng** |
| 12 | Tải thêm | Cuộn tới 80% → tự tải trang tiếp theo |
| 13 | Chiều cao dòng | 4 mức: 32/48/64/96px |
| 14 | Đóng băng header | Header luôn dính trên |
| 15 | **Cảnh báo validation trong ô** | Ô có issue: viền vàng (warning) / viền đỏ (error). Hover hiện tooltip + nút "Sửa" nếu có `fixAction` |
| 16 | Realtime | Người khác sửa ô đang hiển thị → ô nhấp nháy 1s kèm tên người sửa. Không popup |
| 17 | Mở record | Click icon ⤢ ở cột đầu → mở side panel (KHÔNG chuyển trang) |

### 6.1.5. Kiểu ô theo loại field

| Loại | Hiển thị | Chế độ sửa |
|---|---|---|
| text | text 1 dòng, cắt bằng `…` | input |
| longText | 2 dòng đầu + `…` | textarea nổi 400×200, Ctrl+Enter lưu |
| number/currency | canh phải, format `$1,234` | input số, chỉ nhận số |
| percent | `32%` + thanh mini | input, nhận cả `32` và `0.32` |
| date | `15/08/2026` | date picker, gõ nhanh `15/8` |
| select | chip màu | dropdown có search |
| multiSelect | nhiều chip, `+2` nếu tràn | multi-select có search |
| relation | chip có avatar | autocomplete tìm kiếm, có nút "Tạo mới" |
| user | avatar + tên | picker |
| checkbox | ☑ | toggle |
| computed | **nền xám nhạt**, không sửa được | hover hiện công thức |
| aiField | giá trị + icon ✨ | click ✨ = chạy lại AI; sửa tay được, khi đó mất nhãn AI |

### 6.1.6. Ô tính toán — hiển thị rõ ràng [MUST]

Field tính tự động (`rank`, `relationshipScore`, `weightedValue`, `meddicScore`…) phải:
- Nền `#FAFAFA`, con trỏ `not-allowed` khi hover
- Tooltip hiện: công thức + thời điểm tính + nút "Tính lại"
- Nếu `computedAt` quá 24h: icon ⏱ mờ cạnh giá trị

### 6.1.7. Panel dựng filter

```
┌─ Bộ lọc ────────────────────────────────────┐
│ Hiện những bản ghi thoả  [Tất cả ▾] điều kiện│
│ ┌─────────────────────────────────────────┐ │
│ │ [Rank ▾] [là ▾] [A ▾]              [🗑] │ │
│ │ [Chủ sở hữu ▾] [là ▾] [👤 Tôi ▾]   [🗑] │ │← giá trị động
│ │ [Ngày action ▾] [trong ▾] [7 ngày tới▾] │ │
│ └─────────────────────────────────────────┘ │
│ [+ Điều kiện]  [+ Nhóm điều kiện]           │
│ ─────────────────────────────────────────── │
│ Khớp 47 / 1.147 bản ghi                     │
│              [Huỷ]  [Lưu vào view]  [Áp dụng]│
└─────────────────────────────────────────────┘
```

**Giá trị động bắt buộc có [MUST]** — đây là thứ thay 9 calendar view đặt tên cứng theo từng người của hệ thống cũ:
`👤 Tôi` · `👥 Team của tôi` · `Hôm nay` · `Tuần này` · `Tháng này` · `Quý này` · `7 ngày tới` · `30 ngày tới` · `7 ngày qua` · `30 ngày qua` · `90 ngày qua`

## 6.2. Record side panel

Mở khi click ⤢. Rộng 480px, trượt từ phải, **không che grid hoàn toàn** (grid co lại).

```
┌─────────────────────────────────────────────┐
│ 🏢 Fujifilm BI Hong Kong            [⤢][✕] │  ⤢ = mở full page
│ Rank A · Mega · IT Solution · Hong Kong     │
│ ┌───────────────────────────────────────┐   │
│ │ ⚠️ 2 vấn đề dữ liệu          [Xem ▾]  │   │ ← chỉ hiện khi có issue
│ └───────────────────────────────────────┘   │
├─────────────────────────────────────────────┤
│ [Tổng quan][Liên hệ 4][Cơ hội 2][Hoạt động] │
│ [Hợp đồng][Tín hiệu 3][Lịch sử]             │
├─────────────────────────────────────────────┤
│ ▼ THÔNG TIN CƠ BẢN         Độ đầy đủ: 73% ▓▓│
│   Website      fujifilm.com.hk           ✏️  │ ← sửa trực tiếp tại chỗ
│   Quy mô       201-500                   ✏️  │
│   ICP Type     IT Solution        ✨ AI  ✏️  │
│   ...                                        │
│ ▼ QUAN HỆ                                    │
│   Điểm quan hệ công ty    4.5  ▓▓▓▓░ (mục tiêu 3.0)
│   NDA ký ngày             12/03/2025         │
│   Thăm viếng              2 lần / 1 lần      │
│ ▼ AI TÓM TẮT                    [Làm mới ✨] │
│   "Công ty SI tại Hong Kong, ~300 nhân sự,   │
│    tập trung imaging & document solutions.   │
│    Có dev center tại Trung Quốc..."          │
│   Cập nhật 2 ngày trước · độ tin cậy 0.85    │
│ ▼ GHI CHÚ KẾ HOẠCH                           │
│   [#HELP] Cần a Tùng hỗ trợ tiếp cận CTO     │ ← hashtag hiện dạng chip
└─────────────────────────────────────────────┘
```

**Nguyên tắc [MUST]:** mọi field trong panel **sửa được ngay tại chỗ** (click là vào chế độ sửa), không có nút "Edit" toàn form.

## 6.3. Màn hình họp tuần (Weekly Cockpit)

**Route:** `/weekly-meeting`
**Yêu cầu [MUST]: mở lên là có số ngay, không chờ tính.** Đọc từ `kpi_snapshot`.

```
┌───────────────────────────────────────────────────────────────────────────┐
│ HỌP TUẦN 32/2026  (03/08 - 09/08)     [◀ Tuần trước] [Tuần sau ▶] [Đóng] │
│                                          [✨ Sinh tóm tắt AI] [Xuất PDF]  │
├───────────────────────────────────────────────────────────────────────────┤
│ ✨ TÓM TẮT AI                                                              │
│ Tuần này team ký được $33.000 (66% chỉ tiêu tuần). Hai điểm cần chú ý:    │
│ (1) Doanh số ký quý 3 mới đạt 11% chỉ tiêu, còn 7 tuần.                   │
│ (2) 5 cơ hội quá 90 ngày không có hoạt động — tổng giá trị $180.000.      │
│ [Xem chi tiết] [👍 Hữu ích] [👎 Không hữu ích]                            │
├───────────────────────────────────────────────────────────────────────────┤
│ 1. TÀI CHÍNH                                                              │
│ ┌──────────────┬──────────┬──────────┬───────┬─────┬─────────────────┐   │
│ │ Chỉ tiêu     │ Thực hiện│ Chỉ tiêu │  %    │ RAG │ Ghi chú         │   │
│ ├──────────────┼──────────┼──────────┼───────┼─────┼─────────────────┤   │
│ │ DS ký tuần   │  $33.000 │  $50.000 │  66%  │ 🟡  │ Gamelocker      │   │
│ │ DS ký tháng  │  $33.000 │  $99.352 │  33%  │ 🔴  │                 │   │
│ │ DS luỹ kế quý│  $33.000 │ $300.000 │  11%  │ 🔴  │ còn 7 tuần      │   │
│ │ DT dự kiến   │  $54.500 │ $100.000 │  55%  │ 🟡  │                 │   │
│ └──────────────┴──────────┴──────────┴───────┴─────┴─────────────────┘   │
│  ↑ mỗi con số CLICK ĐƯỢC → mở view chứa các bản ghi tạo nên số đó        │
├───────────────────────────────────────────────────────────────────────────┤
│ 2. KHÁCH HÀNG          3. TỔ CHỨC              4. CHẤT LƯỢNG DỮ LIỆU      │
│ Ký mới tuần:    0      Tổng thành viên: 4      ⚠ Thiếu người phụ trách: 3 │
│ Khách luỹ kế:   9      AM: 2 (Tùng, Quyên)     ⚠ Bản ghi lỗi: 12          │
│ Đang active:    8      BD: 2 (Linh, Dương)     ⚠ Cơ hội treo: 5           │
│ Key account:    0                              [Sửa ngay →]               │
├───────────────────────────────────────────────────────────────────────────┤
│ 5. HIỆU SUẤT BD                     6. HIỆU SUẤT AM (theo quý)            │
│ ┌──────┬───────┬─────┬──────┬───┐   ┌────────┬────┬────┬────┬────┬─────┐ │
│ │ Tên  │ Meeting│ SQL │ %KPI │RAG│   │ TungNX │ Q1 │ Q2 │ Q3 │ Q4 │ Năm │ │
│ ├──────┼───────┼─────┼──────┼───┤   ├────────┼────┼────┼────┼────┼─────┤ │
│ │ Linh │   1   │  0  │ 11%  │🔴 │   │ KPI ký │50k │150k│200k│200k│600k │ │
│ │ Thảo │   2   │  0  │ 16%  │🔴 │   │ Đã ký  │  0 │  0 │33k │  0 │ 33k │ │
│ │ Dương│   0   │  0  │  5%  │🔴 │   │ %      │ 0% │ 0% │16% │ 0% │  6% │ │
│ └──────┴───────┴─────┴──────┴───┘   └────────┴────┴────┴────┴────┴─────┘ │
├───────────────────────────────────────────────────────────────────────────┤
│ 7. AGENDA — CẦN BÀN (tự sinh từ agenda tag)                              │
│ 🔴 Fujifilm HK  · Mega · Sát deadline · Deal $70k · [Mở]                  │
│ 🟡 ScienTec     · Deal lớn · Thiếu MEDDIC · [Mở]                          │
│ 💬 Thomson Med. · #HELP: cần hỗ trợ tiếp cận CIO · [Mở]                   │
├───────────────────────────────────────────────────────────────────────────┤
│ 8. VIỆC CẦN LÀM                                            [+ Thêm việc]  │
│ ☐ Gửi proposal Fujifilm      · Tùng  · 12/08 · 🔴 quá hạn 2 ngày          │
│ ☐ Follow up ScienTec         · Hiệp  · 15/08                              │
│ ☑ Chuẩn bị CV cho GameLocker · Quyên · 08/08 · xong                       │
│ ⚠ 2 việc đã dời 3 tuần liên tiếp                                          │
└───────────────────────────────────────────────────────────────────────────┘
```

**Hành vi bắt buộc:**
- Mọi số trong bảng KPI **click được** → mở grid với filter tương ứng
- Mục 4 (chất lượng dữ liệu) **luôn hiện**, kể cả khi bằng 0 — để tạo thói quen soát
- Nút "Đóng phiên họp" đóng băng `snapshotData`, sau đó số liệu không đổi kể cả khi dữ liệu gốc thay đổi
- Việc chưa xong tự động chuyển sang tuần sau và tăng `carriedOverCount`

## 6.4. Màn hình KPI

**Route:** `/kpi`

```
┌───────────────────────────────────────────────────────────────────────────┐
│ [Tuần][Tháng][Quý][Năm]  [◀ Q3/2026 ▶]   [Công ty][Team▾][Cá nhân▾]      │
├───────────────────────────────────────────────────────────────────────────┤
│ ┌────────────┐┌────────────┐┌────────────┐┌────────────┐                 │
│ │DS KÝ       ││DT THUỘC KỲ ││TIỀN ĐÃ THU ││SỐ MEETING  │                 │
│ │$33.000     ││$153.700    ││$122.800    ││   47       │                 │
│ │/$300.000   ││/$350.000   ││            ││/60         │                 │
│ │▓░░░░░ 11%🔴││▓▓▓░░░ 44%🟡││            ││▓▓▓▓░ 78%🟢 │                 │
│ │▼ -19% ↔ kỳ ││▲ +5%       ││            ││▲ +12%      │                 │
│ └────────────┘└────────────┘└────────────┘└────────────┘                 │
├───────────────────────────────────────────────────────────────────────────┤
│ [Biểu đồ đường: thực hiện vs chỉ tiêu theo tuần trong quý]                │
├───────────────────────────────────────────────────────────────────────────┤
│ BẢNG CHI TIẾT THEO NGƯỜI                                    [Đặt chỉ tiêu]│
└───────────────────────────────────────────────────────────────────────────┘
```

**Modal đặt chỉ tiêu:**
```
┌─ Đặt chỉ tiêu ────────────────────────────┐
│ Chỉ số  [Doanh số ký ▾]                   │
│ Phạm vi ( )Công ty (•)Team ( )Cá nhân     │
│         [Team Global ▾]                    │
│ Kỳ      [Quý ▾]  [Q3/2026 ▾]              │
│ Giá trị [300000] USD                       │
│ ☑ Tự chia đều cho các tuần trong kỳ        │
│ ☑ Áp dụng cho cả 4 quý (nhập 1 lần)        │
│                        [Huỷ]  [Lưu]        │
└────────────────────────────────────────────┘
```

## 6.5. Pipeline forecast

**Route:** `/pipeline`
Grid đặc biệt: mỗi dòng là một pipeline entry, **12 cột tháng nhập headcount**.

```
┌──────────────────┬─────┬──────┬─────┬─────┬─────┬─────┬───┬──────────┬─────────┐
│ Tên              │ KT  │ Rate │ Jan │ Feb │ Mar │ Apr │...│ Full Rev │ Weighted│
├──────────────────┼─────┼──────┼─────┼─────┼─────┼─────┼───┼──────────┼─────────┤
│ Fujifilm - Photo │ KT3 │ $2500│     │     │     │  2  │   │ $180.000 │ $18.000 │
│ Belive - Team    │ KT1 │ $2100│  3  │  3  │  3  │  3  │   │ $226.800 │ $204.120│
│ Thao unseen co.  │ KT2 │ $2000│     │     │  2  │  2  │   │ $120.000 │ $60.000 │
├──────────────────┴─────┴──────┴─────┴─────┴─────┴─────┴───┴──────────┴─────────┤
│ TỔNG                          │ 3.0 │ 3.0 │ 5.0 │ 7.0 │...│ $526.800 │ $282.120│
│ Trong đó chắc chắn (KT1)      │$6.3k│$6.3k│$6.3k│$6.3k│...│          │ $204.120│
└────────────────────────────────────────────────────────────────────────────────┘
```

**Hành vi:**
- Ô headcount nhận số thập phân (0.5 FTE)
- Đổi `weightClass` hoặc `rate` → cột Full Rev / Weighted tính lại ngay (optimistic)
- Dòng tổng cuối bảng: 2 dòng — tổng tất cả, và tổng chỉ KT1 ("chắc chắn")
- Cho phép tạo entry **không có account** (nhập `placeholderName`) — giữ convention "unseen company" của hệ thống cũ
- Nút chuyển năm tài chính

## 6.6. AI Chat panel

Mở bằng nút `✨ AI` trên header hoặc phím `⌘J`. Panel phải, rộng 400px.

```
┌─ Trợ lý AI ─────────────────────────[⤢][✕]│
│ Ngữ cảnh: 📊 Công ty · view "Tier A"       │ ← biết user đang xem gì
├────────────────────────────────────────────┤
│ 👤 Tuần này team đạt bao nhiêu % KPI       │
│    meeting, ai đang đỏ?                    │
│                                             │
│ ✨ Tuần 32 (03-09/08), team đạt            │
│    47/60 meeting = 78% 🟢                  │
│                                             │
│    Đang đỏ:                                 │
│    • Linh — 1/8 meeting (11%) 🔴           │
│    • Dương — 0/8 meeting (5%) 🔴           │
│                                             │
│    ┌─ Nguồn số liệu ──────────────────┐    │
│    │ 47 hoạt động loại meeting         │    │
│    │ Khoảng: 03/08 - 09/08/2026        │    │
│    │ Phạm vi: Team Global (4 người)    │    │
│    │ [Mở thành view] [Xem SQL]         │    │
│    └───────────────────────────────────┘    │
│    [👍][👎]                                 │
├────────────────────────────────────────────┤
│ Gợi ý:                                      │
│ [Vì sao Linh thấp?] [So với tuần trước]    │
├────────────────────────────────────────────┤
│ [Hỏi về dữ liệu của bạn...]          [↑]   │
└────────────────────────────────────────────┘
```

**Bắt buộc [MUST]:**
- Mọi câu trả lời có số liệu **phải kèm khối "Nguồn số liệu"** với: số bản ghi, khoảng thời gian, phạm vi, và nút "Mở thành view"
- Nút 👍/👎 ghi vào `ai_insight.userFeedback`
- Khi câu hỏi mơ hồ → hiện **chip lựa chọn** thay vì đoán:
  ```
  ✨ Anh muốn xem loại doanh thu nào?
     [Doanh số ký] [Doanh thu thuộc kỳ] [Tiền đã thu]
  ```

**Preview đề xuất ghi dữ liệu:**
```
┌─ AI đề xuất cập nhật ───────────────────────┐
│ 💼 Fujifilm HK - Photo album platform       │
│ ┌───────────────┬────────────┬────────────┐ │
│ │ Trường        │ Hiện tại   │ Đề xuất    │ │
│ ├───────────────┼────────────┼────────────┤ │
│ │ Trạng thái    │ RFP, JD    │ Proposed   │ │
│ │ Ngày action   │ 05/08/2026 │ 15/08/2026 │ │
│ └───────────────┴────────────┴────────────┘ │
│ + Tạo hoạt động: Gửi email · 07/08          │
│                                              │
│ ⚠️ Cảnh báo:                                 │
│ • MEDDIC mới điền 3/6 (thiếu Metrics,       │
│   Decision Process, Champion)                │
│                                              │
│ Lý do AI đề xuất: "Người dùng nói đã gửi    │
│ proposal hôm qua và hẹn gọi Nelson 15/8"    │
│                                              │
│         [Huỷ]  [Sửa]  [Xác nhận]            │
└──────────────────────────────────────────────┘
```

## 6.7. Command palette (⌘K)

```
┌─ ⌘K ───────────────────────────────────────┐
│ [fuji                                   ]  │
├────────────────────────────────────────────┤
│ BẢN GHI                                     │
│ 🏢 Fujifilm BI Hong Kong        Công ty    │
│ 💼 Fujifilm HK - Photo album    Cơ hội     │
│ HÀNH ĐỘNG                                   │
│ ➕ Tạo công ty mới "fuji"                   │
│ ✨ Hỏi AI về "fuji"                         │
│ ĐIỀU HƯỚNG                                  │
│ 📊 Họp tuần                                 │
└────────────────────────────────────────────┘
```

## 6.8. Trang chủ

```
┌───────────────────────────────────────────────────────────────┐
│ Chào buổi sáng, Tùng 👋            Thứ Bảy, 08/08/2026        │
├───────────────────────────────────────────────────────────────┤
│ VIỆC HÔM NAY (7)                    KPI CỦA TÔI - TUẦN NÀY    │
│ 🔴 Gọi Nelson (Fujifilm) - quá hạn  Meeting  4/8   ▓▓░░ 50%🟡 │
│ 🟡 Follow up ScienTec - hôm nay     DS ký    $0/$12k ░░░ 0%🔴 │
│ ⚪ Gửi CV GameLocker - ngày mai                                │
├───────────────────────────────────────────────────────────────┤
│ ✨ TÍN HIỆU MỚI (3)                 CẦN CHÚ Ý                  │
│ 🔴 Belive gọi vốn Series A $12M     ⚠ 3 cơ hội quá hạn action │
│    → cơ hội mở rộng team            ⚠ 5 contact quá hạn       │
│ 🟡 ScienTec tuyển 15 dev            ⚠ 2 hợp đồng sắp hết hạn  │
└───────────────────────────────────────────────────────────────┘
```

---

# 7. ĐẶC TẢ COMPONENT DATA GRID

## 7.1. Cấu trúc component

```
features/grid/
├── DataGrid.tsx                  # container chính
├── hooks/
│   ├── useGridData.ts            # fetch + phân trang + realtime merge
│   ├── useViewState.ts           # đọc/ghi view + user overrides (debounce)
│   ├── useCellEdit.ts            # optimistic update + rollback
│   ├── useSelection.ts           # chọn ô/vùng/dòng
│   ├── useClipboard.ts           # copy-paste TSV
│   └── useKeyboardNav.ts
├── cells/
│   ├── TextCell.tsx  NumberCell.tsx  CurrencyCell.tsx  PercentCell.tsx
│   ├── DateCell.tsx  SelectCell.tsx  MultiSelectCell.tsx
│   ├── RelationCell.tsx  UserCell.tsx  CheckboxCell.tsx
│   ├── ComputedCell.tsx  AiCell.tsx
│   └── CellWrapper.tsx           # bọc chung: viền validation, tooltip, trạng thái selected
├── toolbar/
│   ├── ViewTabs.tsx  FilterPanel.tsx  SortPanel.tsx
│   ├── GroupPanel.tsx  ColumnPanel.tsx  ExportButton.tsx
└── SummaryBar.tsx
```

## 7.2. Interface chính

```typescript
interface DataGridProps<T> {
  objectType: ObjectType;
  viewId?: string;
  columns: ColumnDef<T>[];
  onCellEdit: (rowId: string, field: string, value: unknown) => Promise<void>;
  onRowOpen: (rowId: string) => void;
  onBulkAction?: (action: string, rowIds: string[]) => void;
  readOnly?: boolean;
}

interface ColumnDef<T> {
  key: string;
  label: string;
  type: FieldType;
  width: number;
  minWidth?: number;
  editable: boolean;
  computed?: boolean;
  formula?: string;                 // hiện trong tooltip khi computed
  aiGenerated?: boolean;
  pinned?: 'left' | 'right';
  render?: (row: T) => ReactNode;
  validate?: (value: unknown, row: T) => ValidationIssue | null;
  options?: SelectOption[];          // cho select
  relationTo?: ObjectType;           // cho relation
}
```

## 7.3. Luồng sửa ô (chi tiết implement)

```typescript
async function handleCellEdit(rowId, field, newValue) {
  const prev = getRowValue(rowId, field);

  // 1. Validate client-side trước — bắt lỗi rõ ràng ngay, không cần round-trip
  const issue = column.validate?.(newValue, row);
  if (issue?.severity === 'blocking') { showCellError(rowId, field, issue); return; }

  // 2. Optimistic: cập nhật local ngay, UI phản hồi tức thì
  setLocalValue(rowId, field, newValue);
  setCellState(rowId, field, 'saving');

  try {
    // 3. Gọi API kèm optimistic concurrency
    const res = await api.patch(`/${objectType}/${rowId}`, { [field]: newValue },
                                { headers: { 'If-Unmodified-Since': row.updatedAt } });

    // 4. Nhận về record đầy đủ — QUAN TRỌNG vì server có thể tính lại field khác
    //    (VD sửa potential → rank đổi theo)
    mergeRow(rowId, res.data);
    setCellState(rowId, field, 'saved');           // hiệu ứng ✓ xanh, tắt sau 1s

    // 5. Hiện cảnh báo mềm nếu có (KHÔNG rollback)
    if (res.meta.validation.issues.length) showRowIssues(rowId, res.meta.validation.issues);

    // 6. Highlight các ô được tính lại
    res.meta.recomputed?.forEach(f => flashCell(rowId, f));

  } catch (err) {
    if (err.status === 409) {
      // Người khác đã sửa trước → hiện đối chiếu, không tự ghi đè
      showConflictDialog(rowId, field, { mine: newValue, theirs: err.data.current });
    } else {
      setLocalValue(rowId, field, prev);            // rollback
      setCellState(rowId, field, 'error');
      toast.error(err.message);
    }
  }
}
```

## 7.4. Copy-paste — đặc tả chi tiết

**Copy:** chuyển vùng chọn thành TSV (tab giữa cột, `\n` giữa dòng), format theo kiểu hiển thị (currency ghi số thô, date ghi `yyyy-MM-dd`), ghi vào clipboard cả `text/plain` và `text/html`.

**Paste:**
```typescript
async function handlePaste(e: ClipboardEvent) {
  const rows = parseTSV(e.clipboardData.getData('text/plain'));
  const anchor = selection.start;

  // 1. Dựng danh sách thay đổi, validate từng ô
  const changes = []; const errors = [];
  rows.forEach((row, ri) => row.forEach((cellText, ci) => {
    const target = { rowId: visibleRows[anchor.row + ri]?.id, field: visibleCols[anchor.col + ci]?.key };
    if (!target.rowId || !target.field) return;           // dán tràn ngoài bảng → bỏ qua
    const col = getColumn(target.field);
    if (!col.editable) { errors.push({...target, reason:'Cột không sửa được'}); return; }
    const parsed = parseValueForType(cellText, col.type);
    if (parsed.error) { errors.push({...target, reason: parsed.error}); return; }
    changes.push({ ...target, value: parsed.value });
  }));

  // 2. Nếu >20 ô hoặc có lỗi → hiện xác nhận trước
  if (changes.length > 20 || errors.length > 0) {
    const ok = await confirmPasteDialog({ changeCount: changes.length, errors });
    if (!ok) return;
  }

  // 3. Ghi theo lô 50 ô/lần
  await api.post(`/${objectType}/bulk`, { updates: groupByRow(changes) });

  // 4. Ô lỗi tô đỏ trong 5 giây
  errors.forEach(er => flashCellError(er.rowId, er.field, er.reason));
}
```

## 7.5. Yêu cầu hiệu năng [MUST]

| Chỉ số | Ngưỡng | Cách đo |
|---|---|---|
| Render lần đầu 100 dòng | < 300ms | Performance API |
| Cuộn 10.000 dòng | 60fps (< 16ms/frame) | Chrome DevTools |
| Sửa ô → thấy giá trị mới | < 50ms (optimistic) | |
| Sửa ô → lưu xong | < 500ms p95 | |
| Đổi view | < 400ms | |
| Bộ nhớ với 10.000 dòng | < 200MB | |

**Benchmark bắt buộc ở Sprint 1:** dựng grid 50.000 dòng dữ liệu giả với 25 cột, đo 6 chỉ số trên. Nếu không đạt → đổi sang Glide Data Grid (canvas). **Không được để đến cuối dự án mới phát hiện.**
---

# 8. ĐẶC TẢ TẦNG AI

## 8.1. Nguyên tắc triển khai (dạng ràng buộc kỹ thuật, không phải khẩu hiệu)

| # | Ràng buộc | Cách enforce trong code |
|---|---|---|
| R1 | AI **không** được sinh và chạy SQL/code tự do | Tool registry chỉ có các tool có JSON Schema chặt. **Không có tool nào nhận tham số kiểu string SQL.** Code review bắt buộc kiểm điểm này |
| R2 | AI truy cập dữ liệu qua **cùng tầng phân quyền** với người dùng | Mọi tool nhận `PermissionContext` bắt buộc và gọi `ScopedPrismaService`, không gọi `PrismaClient` thô. Lint rule cấm import `PrismaClient` trong `modules/ai/**` |
| R3 | Mọi thao tác **ghi** phải qua `AiProposal` | Tool ghi chỉ tạo proposal, không gọi service ghi trực tiếp. Ngoại lệ duy nhất: `logActivity` (mục 8.7) |
| R4 | AI **không tự tính toán số học** | Prompt cấm; mọi con số phải đến từ kết quả tool. Có kiểm thử: hỏi "tăng bao nhiêu %" phải thấy tool call `comparePeriods`, không phải LLM tự nhân chia |
| R5 | Mọi output ghi vào `ai_insight` | Interceptor tự động, không phụ thuộc dev nhớ |
| R6 | Có trần chi phí | Middleware kiểm tra `AI_MONTHLY_BUDGET_USD` trước mỗi call; vượt → `AI_BUDGET_EXCEEDED` |

## 8.2. Semantic layer — metadata cho từng field

Lưu ở bảng `field_metadata` (seed từ file, sửa được qua UI admin):

```typescript
interface FieldSemantics {
  objectType: string;
  fieldKey: string;
  labelVi: string;
  labelEn: string;
  dataType: string;
  descriptionVi: string;      // cho người, hiện khi hover
  aiHint: string;             // cho agent — QUAN TRỌNG NHẤT
  exampleValues: string[];
  synonymsVi: string[];       // để nhận diện ý định
  synonymsEn: string[];
  isComputed: boolean;
  formulaText?: string;
  sensitiveLevel: 'public' | 'internal' | 'restricted';   // restricted không đưa vào prompt nếu user không có quyền
}
```

**Seed bắt buộc cho các field dễ nhầm nhất** — đây là phần chống lỗi quan trọng nhất của cả tầng AI:

```yaml
- objectType: opportunity
  fieldKey: estimatedValue
  labelVi: "Giá trị ước tính"
  aiHint: |
    Giá trị ước tính CHƯA nhân xác suất thắng. Dùng khi người hỏi muốn biết
    "deal này bao nhiêu tiền". KHÔNG dùng để báo cáo doanh thu — doanh thu
    chỉ đến từ contract. KHÔNG cộng dồn trường này rồi gọi là "pipeline value"
    (phải dùng weightedValue).
  synonymsVi: ["giá trị deal", "deal size", "giá trị cơ hội"]

- objectType: opportunity
  fieldKey: weightedValue
  labelVi: "Giá trị có trọng số"
  aiHint: |
    = estimatedValue × winRate. Đây là giá trị KỲ VỌNG. Dùng khi người hỏi
    "pipeline có bao nhiêu tiền". KHÔNG BAO GIỜ gọi đây là "doanh thu".
  synonymsVi: ["pipeline value", "giá trị kỳ vọng"]

- objectType: contract
  fieldKey: __booked_revenue
  labelVi: "Doanh số ký"
  aiHint: |
    Tổng TCV của hợp đồng ĐƯỢC KÝ trong kỳ, quy về kỳ theo signedDate.
    Tiếng Việt gọi là "DOANH SỐ". Phân biệt tuyệt đối với "doanh thu".
    Nếu người dùng chỉ nói "doanh thu" chung chung mà không rõ, PHẢI HỎI LẠI.
  synonymsVi: ["doanh số", "doanh số ký", "booked", "signing revenue"]

- objectType: contract
  fieldKey: __billing_revenue
  labelVi: "Doanh thu thuộc kỳ"
  aiHint: |
    Tổng amount của các tháng doanh thu RƠI VÀO kỳ (theo contract_month_revenue.year/month).
    Tiếng Việt gọi là "DOANH THU". Không phải tiền đã thu.
  synonymsVi: ["doanh thu", "revenue", "billing"]

- objectType: contract
  fieldKey: __collected_revenue
  labelVi: "Tiền đã thu"
  aiHint: |
    Tiền THỰC SỰ ĐÃ THU (isPaid = true), quy về kỳ theo paidAt.
  synonymsVi: ["đã thu", "tiền về", "collected", "thực thu"]

- objectType: account
  fieldKey: revenueBand
  labelVi: "Doanh thu công ty khách"
  aiHint: |
    Doanh thu của CHÍNH CÔNG TY KHÁCH (để đánh giá ngân sách của họ).
    TUYỆT ĐỐI KHÔNG NHẦM với doanh thu HBLAB thu được từ khách — cái đó là revenueTier.
  sensitiveLevel: internal

- objectType: account
  fieldKey: revenueTier
  labelVi: "Phân hạng theo doanh thu mang lại"
  aiHint: |
    Phân hạng theo doanh thu HBLAB THU ĐƯỢC từ account này trong 12 tháng gần nhất.
    key >= 200k USD/năm, mega >= 400k USD/năm.

- objectType: account
  fieldKey: dealSizeTier
  labelVi: "Quy mô deal kỳ vọng"
  aiHint: |
    Mega/Medium/Small — phân loại theo quy mô deal có thể có, dựa trên quy mô công ty khách.
    KHÁC với icpType (loại hình công ty) và revenueTier (doanh thu thực tế mang lại).
    Khi người dùng nói "khách lớn" thường là muốn nói field này.
  synonymsVi: ["tier", "quy mô khách", "khách lớn/nhỏ"]

- objectType: account
  fieldKey: icpType
  labelVi: "Loại hình công ty (ICP)"
  aiHint: |
    5 loại: traditional (DN truyền thống cần DX), it_solution (SI/solution house),
    it_product (công ty product), tech_startup, ito (công ty outsourcing khác).
    Quyết định pain point, PIC cần tiếp cận, và bằng chứng cần đưa ra.
    KHÔNG phải phân loại theo quy mô.
```

## 8.3. Business glossary

Bảng `business_glossary`, dùng để dịch ngôn ngữ người dùng sang filter:

| Thuật ngữ (vi) | Ánh xạ | Ghi chú |
|---|---|---|
| khách Tier A | `account.rank = 'a'` | |
| cá voi / whale | `account.actionCadence = 'focus_whale_hunting'` | |
| khách nguội | `contact.daysSinceLastActivity > 30` | |
| deal sắp chết | `opportunity.deadline - today < 7 AND status NOT IN (won,lost)` | |
| deal treo | `opportunity` age > 90 ngày AND không hoạt động > 45 ngày | |
| khách mới / hunt | theo `system_config.hunt_farm_mode` | mặc định: hợp đồng đầu trong năm tài chính hiện tại |
| khách cũ / farm | phần bù của hunt | |
| pipeline | `pipeline_entry WHERE weight_class <> 'pending'` | |
| chắc chắn / commit | `weight_class = 'kt1'` | |
| SQL (sales qualified lead) | `opportunity.readyForPresales = true` | |
| khách đang active | account có hợp đồng `status NOT IN (finished)` |
| công nợ / còn phải thu | `contract_month_revenue` có `isInvoiced=true AND isPaid=false` |
| quá hạn thu tiền | như trên, và `invoicedAt` cách hôm nay >45 ngày |
| cần xuất invoice | tháng doanh thu đã tới kỳ nhưng `isInvoiced=false` | |

## 8.4. Tool registry — đặc tả đầy đủ

```typescript
// modules/ai/tools/registry.ts

export const AI_TOOLS = [
  // ══════════ NHÓM ĐỌC ══════════
  {
    name: 'query_records',
    description: 'Truy vấn danh sách bản ghi với bộ lọc, sắp xếp, nhóm và tổng hợp. '
               + 'Dùng cho mọi câu hỏi định lượng về dữ liệu CRM.',
    input_schema: {
      type: 'object',
      properties: {
        object: { enum: ['account','contact','opportunity','contract','pipeline_entry','activity'] },
        filters: { $ref: '#/definitions/FilterGroup' },
        sorts:   { type:'array', items:{ type:'object',
                   properties:{ field:{type:'string'}, direction:{enum:['asc','desc']} } } },
        groupBy: { type:'array', items:{ type:'string' } },
        aggregate: { type:'array', items:{ type:'object', properties:{
                     fn:{enum:['sum','count','avg','min','max','count_distinct']},
                     field:{type:'string'} } } },
        dateRange: { type:'object', properties:{
                     field:{type:'string'}, from:{type:'string',format:'date'},
                     to:{type:'string',format:'date'} } },
        limit: { type:'integer', maximum: 500, default: 50 },
      },
      required: ['object'],
    },
    // Trả về kèm queryDescription bằng tiếng Việt để hiển thị lại cho người dùng kiểm chứng
    returns: '{ rows, total, queryDescription, appliedPermissionFilter }',
  },

  {
    name: 'get_record',
    description: 'Lấy chi tiết một bản ghi kèm các quan hệ.',
    input_schema: { type:'object', properties:{
      object:{enum:[...]}, id:{type:'string'},
      include:{type:'array', items:{enum:['contacts','opportunities','contracts','activities','signals']}} },
      required:['object','id'] },
  },

  {
    name: 'get_kpi',
    description: 'Lấy số liệu KPI so với chỉ tiêu. Dùng cho mọi câu hỏi về "đạt bao nhiêu %", '
               + '"có đạt chỉ tiêu không", "ai đang đỏ".',
    input_schema: { type:'object', properties:{
      metric:{enum:['booked_revenue','billing_revenue','collected_revenue','meeting_count',
                    'first_meeting_count','sql_count','new_account_count','new_contact_count',
                    'new_signed_customer','activity_count','pipeline_value']},
      scopeType:{enum:['user','team','company']},
      scopeId:{type:'string'},
      periodType:{enum:['week','month','quarter','year']},
      periodOffset:{type:'integer', description:'0 = kỳ hiện tại, -1 = kỳ trước'},
      breakdownBy:{enum:['user','team','none'], default:'none'} },
      required:['metric','periodType'] },
  },

  {
    name: 'compare_periods',
    description: 'So sánh một chỉ số giữa các kỳ. LUÔN DÙNG TOOL NÀY thay vì tự tính '
               + 'phần trăm thay đổi trong đầu.',
    input_schema: { type:'object', properties:{
      metric:{type:'string'}, scopeType:{enum:[...]}, scopeId:{type:'string'},
      periodType:{enum:[...]}, periodCount:{type:'integer', maximum:12, default:2} },
      required:['metric','periodType'] },
  },

  {
    name: 'search_semantic',
    description: 'Tìm kiếm ngữ nghĩa trong nội dung ghi chú, email, hoạt động. '
               + 'CHỈ dùng cho câu hỏi định tính ("khách nào từng nhắc tới vấn đề X"). '
               + 'KHÔNG dùng cho câu hỏi định lượng — dùng query_records.',
    input_schema: { type:'object', properties:{
      query:{type:'string'},
      objects:{type:'array', items:{enum:['activity','account','contact','opportunity']}},
      limit:{type:'integer', maximum:30, default:10} },
      required:['query'] },
  },

  {
    name: 'get_validation_issues',
    description: 'Lấy danh sách bản ghi có vấn đề chất lượng dữ liệu.',
    input_schema: { type:'object', properties:{
      object:{enum:[...]}, severity:{enum:['blocking','error','warning']},
      ownerId:{type:'string'} } },
  },

  // ══════════ NHÓM GHI (luôn tạo proposal) ══════════
  {
    name: 'propose_update',
    description: 'Đề xuất cập nhật một bản ghi. KHÔNG ghi ngay — tạo đề xuất để người dùng xác nhận.',
    input_schema: { type:'object', properties:{
      object:{enum:[...]}, id:{type:'string'},
      changes:{type:'object'},
      reason:{type:'string', description:'Giải thích vì sao đề xuất thay đổi này'} },
      required:['object','id','changes','reason'] },
  },

  {
    name: 'propose_create',
    description: 'Đề xuất tạo bản ghi mới.',
    input_schema: { type:'object', properties:{
      object:{enum:[...]}, values:{type:'object'}, reason:{type:'string'} },
      required:['object','values','reason'] },
  },

  {
    name: 'propose_bulk_update',
    description: 'Đề xuất cập nhật nhiều bản ghi. Tối đa 20 bản ghi.',
    input_schema: { type:'object', properties:{
      object:{enum:[...]}, filters:{$ref:'#/definitions/FilterGroup'},
      changes:{type:'object'}, reason:{type:'string'} },
      required:['object','filters','changes','reason'] },
  },

  {
    name: 'log_activity',
    description: 'Ghi nhận một hoạt động đã xảy ra. Đây là tool GHI DUY NHẤT không cần '
               + 'xác nhận, vì chỉ THÊM thông tin, không sửa dữ liệu người dùng nhập.',
    input_schema: { type:'object', properties:{
      type:{enum:[...ActivityType]}, occurredAt:{type:'string',format:'date-time'},
      subject:{type:'string'}, body:{type:'string'},
      accountId:{type:'string'}, contactId:{type:'string'},
      opportunityId:{type:'string'}, contractId:{type:'string'} },
      required:['type','occurredAt'] },
  },

  // ══════════ NHÓM CẤU HÌNH ══════════
  {
    name: 'create_view',
    description: 'Tạo một view mới từ bộ lọc — dùng khi người dùng muốn "lưu lại cách xem này".',
    input_schema: { type:'object', properties:{
      objectType:{enum:[...]}, name:{type:'string'},
      config:{$ref:'#/definitions/ViewConfig'} },
      required:['objectType','name','config'] },
  },

  {
    name: 'ask_clarification',
    description: 'Hỏi lại khi câu hỏi mơ hồ. BẮT BUỘC dùng khi: (a) người dùng nói "doanh thu" '
               + 'mà không rõ loại nào, (b) khoảng thời gian không rõ, (c) phạm vi người không rõ. '
               + 'KHÔNG được đoán.',
    input_schema: { type:'object', properties:{
      question:{type:'string'},
      options:{type:'array', items:{type:'object',
               properties:{ label:{type:'string'}, value:{type:'string'}, hint:{type:'string'} }}} },
      required:['question','options'] },
  },
];
```

## 8.5. System prompt cho chatbot

```
Bạn là trợ lý dữ liệu của Tomahawk CRM — hệ thống quản lý bán hàng của HBLAB,
một công ty IT outsourcing tại Việt Nam.

## Nhiệm vụ
Trả lời câu hỏi về dữ liệu CRM, sinh báo cáo, và đề xuất cập nhật dữ liệu.

## Người đang hỏi
Tên: {{user.displayName}} ({{user.fullName}})
Vai trò: {{user.role}} ({{user.roleLabelVi}})
Team: {{user.teamName}}
Múi giờ: {{user.timezone}}
Hôm nay: {{today}} ({{dayOfWeek}}), Tuần {{weekNumber}}/{{year}}

## Ngữ cảnh hiện tại
{{#if context}}Người dùng đang xem: {{context.objectType}}, view "{{context.viewName}}"
Bộ lọc đang áp dụng: {{context.filterDescription}}{{/if}}

## QUY TẮC BẮT BUỘC

1. MỌI CON SỐ PHẢI ĐẾN TỪ TOOL. Không bao giờ tự tính nhẩm, tự ước lượng,
   tự nội suy. Muốn biết phần trăm thay đổi → gọi compare_periods.

2. KHÔNG ĐOÁN KHI CÂU HỎI MƠ HỒ. Gọi ask_clarification khi:
   - Người dùng nói "doanh thu" mà chưa rõ là doanh số ký / doanh thu thuộc kỳ / tiền đã thu
   - Khoảng thời gian không rõ ("gần đây", "vừa rồi")
   - Phạm vi người không rõ và người hỏi quản lý nhiều team
   Một câu hỏi lại tốn 5 giây. Một con số sai đưa lên họp lãnh đạo tốn nhiều hơn thế.

3. LUÔN KÈM BẰNG CHỨNG. Sau mỗi câu trả lời có số liệu, nêu rõ:
   - Bao nhiêu bản ghi tạo nên con số
   - Khoảng thời gian
   - Phạm vi (ai/team nào)

4. KHAI BÁO DỮ LIỆU THIẾU. Nếu kết quả tool cho thấy có bản ghi bị loại vì thiếu
   dữ liệu, PHẢI nói ra. Ví dụ: "12 cơ hội chưa có giá trị ước tính nên không
   được tính vào tổng."

5. KHÔNG NGOẠI SUY. Nếu mới có dữ liệu 8 tháng mà người hỏi về cả năm, trả lời
   8 tháng và nói rõ, đừng tự suy ra cả năm.

6. GHI DỮ LIỆU LUÔN QUA ĐỀ XUẤT. Dùng propose_* và giải thích lý do rõ ràng.
   Không bao giờ nói "đã cập nhật xong" — chỉ nói "đã tạo đề xuất, anh/chị xem và xác nhận".

7. KHÔNG TỰ ĐỘNG ĐÓNG DEAL. Kể cả khi đọc được từ email rằng khách từ chối,
   chỉ ĐỀ XUẤT chuyển sang Lost. Quyết định đóng deal thuộc về con người vì
   nó ảnh hưởng tới KPI và hoa hồng.

8. TÔN TRỌNG PHÂN QUYỀN. Nếu tool trả về ít dữ liệu hơn mong đợi vì phân quyền,
   nói rõ "trong phạm vi anh/chị được xem" chứ đừng nói dữ liệu không tồn tại.

## Từ điển nghiệp vụ
{{businessGlossary}}

## Schema
{{fieldSemantics}}

## Định dạng trả lời
- Tiếng Việt (trừ khi người dùng hỏi bằng tiếng Anh)
- Ngắn gọn, đi thẳng vào số liệu
- Dùng bảng khi so sánh nhiều đối tượng
- Tiền tệ: $33,000 (không viết 33000)
- Phần trăm làm tròn 0 chữ số thập phân
- Không dùng emoji trừ RAG status (🔴🟡🟢)
```

## 8.6. Các tính năng AI nhúng

### 8.6.1. Company Enrichment

**Trigger:** tạo Account mới có website · người dùng bấm "Làm mới ✨" · job hàng tháng cho account `isWatching`

**Model:** `AI_MODEL_CHEAP` (đủ cho việc trích xuất). Tools: `web_search`, `read_webpage`.

```
Bạn trích xuất thông tin công ty phục vụ bán hàng IT outsourcing.

Đọc website và LinkedIn của công ty, trả về JSON đúng schema dưới đây.

QUY TẮC:
- CHỈ chọn giá trị từ danh sách cho sẵn. TUYỆT ĐỐI KHÔNG tạo giá trị mới.
  (Hệ thống trước đây cho nhập tự do và kết quả là 106 giá trị ngành với
   nhiều giá trị trùng nghĩa, làm hỏng mọi báo cáo.)
- Không chắc → để null, KHÔNG đoán.
- Mọi thông tin phải có nguồn.

Danh sách ngành hợp lệ: {{industryCodes}}
Danh sách tech domain hợp lệ: {{techDomainCodes}}
Loại hình công ty (ICP) hợp lệ:
  traditional  — DN truyền thống, cần chuyển đổi số
  it_solution  — SI/solution house, làm dự án cho khách
  it_product   — công ty làm sản phẩm phần mềm riêng
  tech_startup — startup công nghệ
  ito          — công ty outsourcing khác

Schema:
{
  "industryCode": string | null,
  "techDomainCode": string | null,
  "icpType": string | null,
  "sizeBand": string | null,
  "revenueBand": string | null,
  "yearFounded": number | null,
  "devCenterCountries": string[],     // mã ISO2
  "techStack": string[],
  "summary": string,                   // 2-3 câu, tiếng Việt
  "confidence": number,                // 0-1
  "sources": string[]                  // URL đã đọc
}

Công ty: {{account.companyName}}
Website: {{account.website}}
LinkedIn: {{account.linkedinUrl}}
```

**Xử lý kết quả:**
- `confidence >= 0.8` → điền tự động, đánh dấu `✨`, người dùng sửa được
- `confidence < 0.8` → hiện dạng gợi ý cần xác nhận, chưa ghi
- Field người dùng đã nhập tay → **không ghi đè**, chỉ gợi ý nếu khác

### 8.6.2. Signal Watcher

**Trigger:** cron thứ Hai 06:00 giờ VN, cho mọi account `isWatching = true` và có website.

```
Bạn thu thập tín hiệu mua hàng (buying signals) cho một công ty IT outsourcing.

Tìm các sự kiện của công ty mục tiêu trong {{days}} ngày qua từ: website chính thức,
LinkedIn, tin tức công khai, thông cáo báo chí.

Phân loại mỗi sự kiện vào ĐÚNG MỘT loại sau (không tạo loại mới):
  funding | hiring_surge | leadership_change | m_and_a | product_launch
  | market_expansion | layoff | tech_migration | partnership
  | financial_result | other

Chấm mức liên quan tới cơ hội bán dịch vụ outsourcing IT:
  high   — có khả năng tạo nhu cầu nhân lực/dự án IT trong 3 tháng tới
  medium — có thể liên quan gián tiếp
  low    — chỉ để biết

QUY TẮC:
- Mỗi tín hiệu BẮT BUỘC có source_url. Không có nguồn thì không báo cáo.
- KHÔNG suy đoán, KHÔNG diễn giải quá mức.
- Không tìm thấy gì → trả {"signals": []}

Schema:
{ "signals": [ { "type": string, "title": string, "summary": string,
                 "eventDate": "YYYY-MM-DD" | null, "relevance": string,
                 "sourceUrl": string, "whyRelevant": string } ] }

Công ty: {{account.companyName}}
Website: {{account.website}}
Ngành: {{account.industryName}}
Quy mô: {{account.sizeBand}}
```

**Xử lý:** ghi vào `account_signal`; `relevance = high` → tạo notification cho owner. Dedupe bằng cách so `sourceUrl` và cosine similarity của title với các signal 30 ngày qua (ngưỡng 0.9).

### 8.6.3. MEDDIC Qualification Coach

**Trigger:** người dùng bấm nút · khi chuyển sang `rfp_jd` · cron hàng ngày cho opportunity đang mở có activity mới.

```
Bạn là huấn luyện viên bán hàng B2B, chuyên đánh giá chất lượng qualification
theo khung MEDDIC cho dịch vụ IT outsourcing.

Đọc 6 chiều MEDDIC và lịch sử tương tác, đánh giá:
- Chiều nào đã có thông tin thực chất, chiều nào chỉ điền cho có
- Thiếu gì cụ thể
- Câu hỏi nên hỏi khách ở lần tiếp theo

QUY TẮC:
- Đánh giá dựa trên NỘI DUNG, không dựa trên độ dài văn bản.
  (Hệ thống cũ chấm điểm bằng cách đếm ký tự — gõ 250 ký tự vô nghĩa vẫn được
   điểm tối đa. Đừng lặp lại sai lầm đó.)
- Câu hỏi gợi ý phải cụ thể cho tình huống này, không phải câu hỏi mẫu chung chung.
- Nghiêm khắc. Thà báo chưa đủ còn hơn cho qua rồi thua deal.

Schema:
{
  "score": number,              // 0-1
  "byDimension": {
    "metrics":          {"filled": bool, "quality": "strong"|"weak"|"missing", "gap": string|null},
    "economicBuyer":    {...}, "decisionCriteria": {...}, "decisionProcess": {...},
    "identifyPain":     {...}, "champion": {...}
  },
  "nextBestQuestions": string[],     // tối đa 3
  "readyForPresales": bool,
  "blockingReason": string | null,
  "riskFlags": string[]
}

--- DỮ LIỆU ---
Cơ hội: {{opp.name}} | Trạng thái: {{opp.status}} | Giá trị: {{opp.estimatedValue}}
Khách: {{account.companyName}} ({{account.icpType}}, {{account.dealSizeTier}})

Metrics:           {{opp.meddicMetrics}}
Economic Buyer:    {{opp.meddicEconomicBuyer}}
Decision Criteria: {{opp.meddicDecisionCriteria}}
Decision Process:  {{opp.meddicDecisionProcess}}
Identify Pain:     {{opp.meddicIdentifyPain}}
Champion:          {{opp.meddicChampion}}

10 tương tác gần nhất:
{{activities}}
```

⚠️ **Kết quả AI ghi vào `meddicScore`/`meddicDetail` để tham khảo, NHƯNG cổng chặn `readyForPresales` dùng rule cứng ở mục 4.9**, không dùng điểm AI. Lý do: AI có thể sai, và không nên để AI chặn người làm việc.

### 8.6.4. Activity Summarizer

**Trigger:** activity mới từ email sync có body > 500 ký tự.
**Model:** cheap. Output: `aiSummary` (2-3 câu), `sentiment`, `aiSignals` (JSON: có nhắc tới ngân sách/deadline/đối thủ/người ra quyết định không).

### 8.6.5. Weekly Brief

**Trigger:** cron thứ Hai 07:00, hoặc bấm nút trên màn hình họp tuần.
Input: KPI snapshot tuần này + tuần trước · danh sách agenda tag · action item quá hạn · signal `high` · số liệu chất lượng dữ liệu.
Output: 3-5 câu tiếng Việt nêu **kết quả chính + 2 điểm cần chú ý**, kèm số liệu cụ thể. Cấm dùng từ ngữ tô hồng.

## 8.7. Proposal — luồng ghi dữ liệu

```typescript
interface ProposalOperation {
  type: 'update' | 'create' | 'bulk_update';
  object: ObjectType;
  id?: string;
  filters?: FilterGroup;
  changes: Record<string, unknown>;
  currentValues?: Record<string, unknown>;   // để hiển thị diff
}
```

**Phân cấp quyền ghi của AI (enforce trong `ProposalService`):**

| Mức | Loại thao tác | Cơ chế |
|---|---|---|
| **Tự do** | `log_activity`; ghi field AI-only (`aiSummary`, `aiSignals`, `sentiment`, `account_signal`) | Ghi thẳng, không cần xác nhận. Lý do: chỉ THÊM thông tin, không ghi đè dữ liệu người nhập. Người dùng vẫn xoá/sửa được |
| **Xác nhận đơn** | Sửa 1 bản ghi, ≤ 5 field, không thuộc nhóm nhạy cảm | Preview + 1 click |
| **Xác nhận kỹ** | Sửa field nhạy cảm: `estimatedValue`, `winRate`, `monthlyRate`, `headcount`, `weightClass`, `status` → won/lost, `contract.*` | Preview + gõ chữ xác nhận + bắt buộc nhập lý do |
| **Cấm** | Xoá bản ghi · sửa > 20 bản ghi · đổi owner hàng loạt · sửa `kpi_target` · sửa phân quyền | AI không có tool tương ứng. Chặn ở tầng registry |

```typescript
const SENSITIVE_FIELDS: Record<ObjectType, string[]> = {
  opportunity: ['estimatedValue','winRate','status','lossReasons'],
  contract:    ['*'],                       // toàn bộ contract là nhạy cảm
  pipeline_entry: ['monthlyRate','weightClass'],
  account:     ['ownerId','revenueTier'],
  contact:     ['assigneeId'],
  activity:    [],
};
const MAX_AI_BULK_UPDATE = 20;
```

**Vòng đời proposal:** `pending` (hết hạn sau 30 phút) → `confirmed` (ghi + audit log + lưu `undoSnapshot`, cho undo 24h) hoặc `rejected` hoặc `edited_confirmed`.

## 8.8. Đo lường chất lượng AI

Dashboard `/settings/ai-metrics`, dữ liệu từ `ai_insight` + `ai_proposal`:

| Chỉ số | Công thức | Ngưỡng chấp nhận |
|---|---|---|
| Enrichment giữ nguyên | % field AI điền mà người dùng KHÔNG sửa trong 7 ngày | > 80% |
| Signal hữu ích | `count(isUseful=true) / count(có feedback)` | > 30% |
| Proposal xác nhận | `count(confirmed) / count(confirmed + edited + rejected)` | > 85% |
| Chatbot không cần hỏi lại | % hội thoại không có `ask_clarification` | > 70% |
| Chatbot được kiểm chứng | % câu trả lời mà user bấm "Mở thành view" | theo dõi xu hướng |
| Chi phí/người/tháng | `sum(costUsd) / activeUsers` | < $15 |

⚠️ **Quy tắc tắt tính năng:** nếu sau 3 tháng, Signal Watcher có tỷ lệ hữu ích < 20% → **tắt hoặc thu hẹp phạm vi**. Thông báo nhiễu làm giảm niềm tin vào toàn bộ hệ thống AI, và mất niềm tin thì không lấy lại được.

## 8.9. Kiểm soát chi phí

```typescript
// Chạy trước mỗi lệnh gọi AI
async function checkAiBudget(userId: string): Promise<void> {
  const monthSpend = await getMonthlySpendUsd();
  const budget = Number(process.env.AI_MONTHLY_BUDGET_USD);
  if (monthSpend >= budget) throw new AiBudgetExceededError();
  if (monthSpend >= budget * 0.8) notifyAdmins(`AI đã dùng ${Math.round(monthSpend/budget*100)}% ngân sách tháng`);
}
```

**Định tuyến model:** chatbot + qualification coach → `AI_MODEL_STRONG`. Enrichment + summarizer + signal → `AI_MODEL_CHEAP`. Ngoại lệ: account `dealSizeTier = mega` hoặc opportunity `estimatedValue > 50.000` → dùng model mạnh.

**Cache:** hash prompt (sha256) + TTL 24h cho enrichment, 1h cho câu hỏi chatbot giống hệt.

---

# 9. BACKGROUND JOBS

## 9.1. Danh sách job

| Job | Lịch | Queue | Nội dung |
|---|---|---|---|
| `recompute-account-rank` | on-event | `compute` | Khi `potential`/`dealSizeTier`/first-meeting/NDA/opportunity đổi |
| `recompute-relationship-score` | 02:00 hằng ngày + on-event | `compute` | Tính lại điểm cho contact có activity mới; toàn bộ vào Chủ Nhật (vì có phân rã theo ngày) |
| `snapshot-contact-score` | 03:00 thứ Hai | `compute` | Ghi `contact_score_history` cho toàn bộ contact |
| `recompute-company-relationship` | on-event | `compute` | Khi có activity visit / contract mới / NDA |
| `refresh-contract-summary` | debounce 30s + mỗi giờ | `compute` | `REFRESH MATERIALIZED VIEW CONCURRENTLY` |
| `compute-kpi-snapshot` | 00:30 hằng ngày (kỳ hiện tại) + 01:00 thứ Hai (chốt tuần trước) | `compute` | Kỳ đã qua → `isFinal = true`, không tính lại |
| `email-sync` | mỗi 5 phút/user | `sync` | Incremental sync |
| `calendar-sync` | mỗi 15 phút/user | `sync` | |
| `ai-enrich-account` | on-demand + hằng tháng | `ai` | |
| `ai-signal-watch` | 06:00 thứ Hai | `ai` | Chỉ account `isWatching` |
| `ai-summarize-activity` | on-event | `ai` | Activity mới có body dài |
| `ai-weekly-brief` | 07:00 thứ Hai | `ai` | |
| `detect-stale-records` | 08:00 hằng ngày | `compute` | Tạo notification cho record quá hạn |
| `detect-payment-anomaly` | 08:30 hằng ngày | `compute` | Gắn cờ dòng thu tiền cần rà soát, thông báo `sales_admin` + `manager`. Xem 10.5.3 |
| `carry-over-action-items` | 08:00 thứ Hai | `compute` | Dời việc chưa xong sang tuần mới |
| `create-audit-partition` | ngày 25 hằng tháng | `maintenance` | Tạo partition tháng sau |
| `cleanup-expired-proposals` | mỗi giờ | `maintenance` | `pending` quá 30 phút → `expired` |

## 9.2. Cấu hình queue

```typescript
export const QUEUE_CONFIG = {
  compute: { concurrency: 5,
             defaultJobOptions: { attempts: 3, backoff:{type:'exponential', delay:2000},
                                  removeOnComplete: 100, removeOnFail: 500 } },
  sync:    { concurrency: 3, attempts: 5, backoff:{type:'exponential', delay:30000} },
  ai:      { concurrency: 2,               // giới hạn để không vượt rate limit của nhà cung cấp
             attempts: 2, backoff:{type:'exponential', delay:10000},
             limiter: { max: 20, duration: 60000 } },
  maintenance: { concurrency: 1, attempts: 1 },
};
```

⚠️ **Yêu cầu bắt buộc [MUST]:** mọi job phải có **dead-letter queue** và màn hình `/settings/jobs` hiển thị: job đang chạy, job thất bại, nút chạy lại. Hệ thống cũ có 4 automation **chưa từng chạy một lần nào** mà không ai biết, vì không có gì báo lỗi.

## 9.3. Đồng bộ email — đặc tả chi tiết

**Ba chế độ (`EMAIL_SYNC_MODE`):**

| Chế độ | Hành vi | Đánh giá |
|---|---|---|
| `matched_only` | Chỉ sync email có địa chỉ khớp Contact đã tồn tại | An toàn nhất, bỏ sót contact mới |
| `metadata_plus_matched` ⭐ | Sync metadata (from/to/subject/time) của tất cả; **lưu body chỉ khi khớp Contact** | **Mặc định.** Cân bằng giữa riêng tư và hữu ích |
| `full` | Sync toàn bộ | Cần chính sách nhân sự rõ ràng |

> **[DECIDE] — cần cả HR tham gia quyết.** Mặc định `metadata_plus_matched`. Bắt buộc: màn hình onboarding phải nói rõ với nhân viên hệ thống đọc gì, và cho phép loại trừ theo domain (VD: bỏ qua mọi email từ `@gmail.com` cá nhân).

**Thuật toán khớp:**
```
1. Địa chỉ email khớp chính xác contact.email → gắn contactId + accountId
2. Không khớp → lấy domain, tìm account theo domain website → gắn accountId,
   ghi vào unmatched_email_address (tăng seenCount)
3. seenCount >= 3 → tạo gợi ý "Tạo contact mới cho địa chỉ này?"
4. Bỏ qua domain trong danh sách loại trừ (gmail, yahoo, outlook cá nhân...) trừ khi đã khớp contact
5. Bỏ qua email nội bộ (domain của chính công ty) trừ khi có contact bên ngoài trong CC
```

**Chống trùng:** unique `(source, externalId)`. Gmail dùng `historyId` để lấy incremental; Microsoft dùng delta token.

---

# 10. PHÂN QUYỀN

## 10.1. Bốn tầng

```
1. Route-level     — AuthGuard: đã đăng nhập chưa
2. Object-level    — PermissionGuard: role này được thao tác gì trên object nào
3. Row-level       — ScopedPrismaService: TỰ ĐỘNG thêm điều kiện WHERE
4. Field-level     — Serializer: xoá field khỏi response nếu không có quyền
```

⚠️ **Tầng 3 phải nằm ở tầng truy vấn, KHÔNG PHẢI ở filter của view.** View filter là tiện ích hiển thị, không phải biên giới bảo mật.

## 10.2. Ma trận quyền

**[DECIDE]** Ma trận dưới đây là đề xuất dựa trên cấu trúc dữ liệu và tên các view trong hệ thống cũ (`MKT Share View`, `Public View`, `HBx View` cho thấy đã có nhu cầu phân quyền theo nhóm). **Cần Tùng xác nhận trước khi code.**

| Object / Hành động | bd | am | presales | **sales_admin** | manager | bod | admin |
|---|---|---|---|---|---|---|---|
| Account — xem | tất cả | tất cả | tất cả | **tất cả** | tất cả | tất cả | tất cả |
| Account — sửa | của mình | tất cả | ✗ | **✗** | tất cả | **✓ tất cả** | tất cả |
| Account — xoá | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ |
| Contact — xem | tất cả | tất cả | tất cả | **tất cả** | tất cả | tất cả | tất cả |
| Contact — sửa | của mình | tất cả | ✗ | **✗** | tất cả | **✓ tất cả** | tất cả |
| Opportunity — xem | của mình | tất cả | được assign | **tất cả** | tất cả | tất cả | tất cả |
| Opportunity — sửa | của mình | tất cả | chỉ field MEDDIC | **✗** | tất cả | **✓ tất cả** | tất cả |
| **Contract — xem** | **✓ của account mình phụ trách** | tất cả | ✗ | ✓ tất cả | tất cả | tất cả | tất cả |
| **Contract — sửa** (tên, ngày, mô hình, số tiền tháng) | ✗ | của mình | ✗ | ✓ tất cả | tất cả | ✓ tất cả | tất cả |
| **Contract — tạo** | ✗ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ |
| **Invoice / thu tiền** (`isInvoiced`, `isPaid`, `paidAmount`, `invoicedAt`, `paidAt`) | **✓** | **✓** | ✗ | ✓ | ✓ | ✓ | ✓ |
| Pipeline — xem | của mình | tất cả | ✗ | **tất cả** | tất cả | tất cả | tất cả |
| Pipeline — sửa | của mình | tất cả | ✗ | **✗** | tất cả | **✓** | tất cả |
| Activity — tạo/sửa | của mình | của mình | của mình | **của mình** | tất cả | tất cả | tất cả |
| KPI người khác | ✗ | team mình | ✗ | **tất cả (chỉ xem)** | tất cả | tất cả | tất cả |
| Đặt KPI target | ✗ | ✗ | ✗ | **✗** | ✓ | ✓ | ✓ |
| Cấu hình hệ thống | ✗ | ✗ | ✗ | ✗ | một phần | ✗ | ✓ |
| Tạo/sửa field, view chung | ✗ | ✓ | ✗ | **✓** | ✓ | ✓ | ✓ |

**Bốn điểm cần chú ý trong ma trận trên:**

1. **Cập nhật invoice/thu tiền là quyền MỞ — `bd`, `am`, `sales_admin` đều làm được.** Đây là quyết định có chủ đích cho quy mô 15 người: ai làm việc với khách và biết tiền đã về thì cập nhật được luôn, không phải chờ một người duy nhất.

   > ⚠️ **Đánh đổi cần biết rõ:** cách làm chuẩn trong kiểm soát nội bộ là tách người bán khỏi người xác nhận thu tiền (segregation of duties), để tránh việc người bán tự đánh dấu "đã thu" nhằm đẹp số KPI. Mở quyền này bỏ mất lớp chặn đó.
   >
   > **Thay bằng cơ chế phát hiện, không phải cơ chế chặn** — xem mục 10.5. Với 15 người quen biết nhau, phát hiện sau thường hiệu quả hơn chặn trước, và ít cản trở công việc hơn nhiều.

2. **`bd` nay XEM được hợp đồng, nhưng chỉ của account mình phụ trách** (là `ownerId` hoặc `bdId` của account đó). Đây là hệ quả bắt buộc: không thể cập nhật thu tiền cho một hợp đồng mà mình không nhìn thấy. Vẫn giữ giới hạn theo account để BD không xem được toàn bộ tài chính công ty.

3. **`sales_admin` không sửa được Account/Contact/Opportunity/Pipeline.** Họ xem toàn bộ để hiểu bối cảnh hợp đồng, nhưng không tham gia bán hàng. Vai trò của họ chuyển từ *"người duy nhất được cập nhật"* sang **"người chịu trách nhiệm đối soát và đốc thúc"**.

4. **`bod` nay sửa được mọi thứ.** Bỏ mất lớp an toàn "chỉ đọc" trước đây. ⚠️ Bù lại bắt buộc: mọi thao tác ghi vào `audit_log`; và cân nhắc bật cảnh báo cho manager khi `bod` sửa field tài chính — không phải vì nghi ngờ, mà để tránh trường hợp lãnh đạo sửa một con số rồi cả team không biết vì sao báo cáo đổi.

**Field-level:**

| Field | Ai XEM được | Ai SỬA được |
|---|---|---|
| `account.annualItBudget` | am, sales_admin, manager, bod, admin | am, manager, bod, admin |
| `contract.*` (mọi field) | bd (account mình), am, sales_admin, manager, bod, admin | am (của mình), sales_admin, manager, bod, admin |
| `contract_month_revenue.amount` | bd (account mình), am, sales_admin, manager, bod, admin | am (của mình), sales_admin, manager, bod, admin |
| `contract_month_revenue.isInvoiced / isPaid / paidAmount / invoicedAt / paidAt` | như trên | **bd (account mình), am, sales_admin, manager, bod, admin** |
| `pipeline_entry.monthlyRate` | am, sales_admin, manager, bod, admin | am, manager, bod, admin |
| `opportunity.estimatedValue`, `winRate` | tất cả | am, manager, bod, admin |
| `user.email`, `user.role` | tất cả | admin |

## 10.3. Implement

```typescript
@Injectable({ scope: Scope.REQUEST })
export class ScopedPrismaService {
  constructor(private prisma: PrismaClient, @Inject(REQUEST) private req: Request) {}

  private get user(): AuthUser { return this.req.user; }

  /** Trả về điều kiện WHERE bắt buộc theo phân quyền hàng. */
  private rowScope(object: ObjectType): Prisma.Sql | object {
    const u = this.user;
    // Ba vai trò thấy toàn bộ dữ liệu
    if (u.role === 'admin' || u.role === 'manager' || u.role === 'bod') return {};

    switch (object) {
      case 'opportunity':
        if (u.role === 'bd')       return { ownerId: u.id };
        if (u.role === 'presales') return { presales: { some: { userId: u.id } } };
        return {};   // am, sales_admin: xem tất cả
      case 'contract':
        if (u.role === 'presales') return { id: 'IMPOSSIBLE' };
        // BD thấy hợp đồng của các account mình phụ trách — cần để cập nhật thu tiền
        if (u.role === 'bd')       return { account: { OR: [{ ownerId: u.id }, { bdId: u.id }] } };
        if (u.role === 'am')       return { ownerId: u.id };
        return {};   // sales_admin: xem TẤT CẢ hợp đồng — đây là công việc của họ
      case 'pipeline_entry':
        if (u.role === 'bd')       return { ownerId: u.id };
        if (u.role === 'presales') return { id: 'IMPOSSIBLE' };
        return {};
      default:
        return {};   // account, contact: mọi người xem được
    }
  }

  /** Quyền SỬA khác quyền XEM — kiểm tra riêng trước mọi thao tác ghi. */
  private canWrite(object: ObjectType, record?: { ownerId?: string }): boolean {
    const u = this.user;
    if (u.role === 'admin' || u.role === 'manager' || u.role === 'bod') return true;

    switch (object) {
      case 'account':
      case 'contact':
        if (u.role === 'am') return true;
        if (u.role === 'bd') return record?.ownerId === u.id;
        return false;                                   // presales, sales_admin: không sửa
      case 'opportunity':
        if (u.role === 'am') return true;
        if (u.role === 'bd') return record?.ownerId === u.id;
        if (u.role === 'presales') return true;         // nhưng bị chặn field-level ở serializer
        return false;                                   // sales_admin
      case 'contract':
        if (u.role === 'sales_admin') return true;
        if (u.role === 'am') return record?.ownerId === u.id;
        return false;                                   // bd: sửa hợp đồng thì không,
                                                        // nhưng cờ thu tiền thì được — xem canWriteField
      case 'contract_month_revenue':
        // Cờ invoice/thu tiền: mở cho bd + am + sales_admin (quyết định 08/2026)
        if (u.role === 'sales_admin') return true;
        if (u.role === 'am') return true;
        if (u.role === 'bd') return true;               // đã bị giới hạn theo account ở rowScope
        return false;
      case 'pipeline_entry':
        if (u.role === 'am') return true;
        if (u.role === 'bd') return record?.ownerId === u.id;
        return false;
      default:
        return true;
    }
  }

  account = this.scoped('account');
  contact = this.scoped('contact');
  opportunity = this.scoped('opportunity');
  // ...

  private scoped(object: ObjectType) {
    const scope = this.rowScope(object);
    return {
      findMany: (args) => this.prisma[object].findMany(
        { ...args, where: { AND: [args.where ?? {}, scope, { deletedAt: null }] } }),
      findUnique: async (args) => {
        const r = await this.prisma[object].findFirst(
          { where: { AND: [{ id: args.where.id }, scope, { deletedAt: null }] } });
        if (!r) throw new NotFoundException();
        return r;
      },
      // update/create tương tự, kiểm tra quyền sửa trước
    };
  }
}
```

**Lint rule bắt buộc:**
```json
{ "no-restricted-imports": ["error", {
    "paths": [{ "name": "@prisma/client", "importNames": ["PrismaClient"],
                "message": "Dùng ScopedPrismaService. Truy cập PrismaClient trực tiếp bỏ qua phân quyền hàng." }] }] }
```
Ngoại lệ duy nhất: module `jobs/` (chạy nền, không có user context) và `migration/`.

**Field-level ở serializer:**
```typescript
export function applyFieldPermissions<T>(record: T, object: ObjectType, user: AuthUser): Partial<T> {
  const restricted = FIELD_PERMISSIONS[object] ?? {};
  const out = { ...record };
  for (const [field, allowedRoles] of Object.entries(restricted)) {
    if (!allowedRoles.includes(user.role)) delete out[field];
  }
  return out;
}
```

## 10.5. Cơ chế đối soát thay cho cơ chế chặn

Vì quyền cập nhật thu tiền được mở cho `bd`, `am`, `sales_admin`, phải bù lại bằng **truy vết và đối soát**. Ba hạng mục bắt buộc:

### 10.5.1. Ghi rõ ai đánh dấu, lúc nào

Bổ sung vào `contract_month_revenue` (Phần 3.8):

```prisma
  invoicedById   String?   @map("invoiced_by_id")      // ai đánh dấu đã xuất invoice
  invoicedMarkedAt DateTime? @map("invoiced_marked_at") @db.Timestamptz
  paidById       String?   @map("paid_by_id")          // ai đánh dấu đã thu
  paidMarkedAt   DateTime? @map("paid_marked_at") @db.Timestamptz
  reconciledById String?   @map("reconciled_by_id")    // sales_admin đối soát với kế toán
  reconciledAt   DateTime? @map("reconciled_at") @db.Timestamptz
```

**Hiển thị [MUST]:** trong mọi view có cột thu tiền, hiện avatar + tên người đánh dấu ngay cạnh cờ. Không giấu trong lịch sử — để ngay trên bảng. Minh bạch tại chỗ hiệu quả hơn nhiều so với phải mở audit log mới biết.

### 10.5.2. Hàng đợi đối soát cho `sales_admin`

View mới `contract_need_reconcile`: các dòng có `isPaid = true` nhưng `reconciledById IS NULL`, sort theo `paidMarkedAt` cũ nhất trước.

Quy trình: BD/AM đánh dấu "đã thu" khi khách báo đã chuyển tiền → dòng vào hàng đợi đối soát → `sales_admin` kiểm tra với sao kê/kế toán → bấm "Đã đối soát". Con số **chỉ vào báo cáo `collected_revenue` chính thức sau khi đối soát**.

> **Đây là điểm mấu chốt của thiết kế mới:** ai cũng đánh dấu được, nhưng có **hai trạng thái** — "báo đã thu" (ai cũng đặt được, dùng để theo dõi nội bộ) và "đã đối soát" (chỉ `sales_admin`, dùng cho báo cáo tài chính). Vừa nhanh cho người làm việc, vừa giữ được độ tin cậy của con số đưa lên lãnh đạo.
>
> **[DECIDE]** Nếu thấy hai trạng thái là rườm rà, có thể bỏ bước đối soát và dùng thẳng `isPaid` cho báo cáo. Khi đó chấp nhận rủi ro số liệu thu tiền phản ánh "người bán nói đã thu" chứ không phải "kế toán xác nhận đã thu". Mặc định tôi bật hai trạng thái.

### 10.5.3. Cảnh báo bất thường

Job `detect-payment-anomaly` chạy hằng ngày, tạo thông báo cho `sales_admin` và `manager` khi:

| Điều kiện | Vì sao đáng chú ý |
|---|---|
| Đánh dấu "đã thu" mà chưa từng đánh dấu "đã xuất invoice" | Thu tiền trước khi xuất hoá đơn là bất thường |
| Một người đánh dấu >5 dòng "đã thu" trong 1 ngày | Có thể là thao tác hàng loạt cho đẹp số cuối kỳ |
| Đánh dấu "đã thu" trong 3 ngày cuối kỳ KPI | Đúng thời điểm dễ có động cơ làm đẹp số |
| Cờ `isPaid` bị bật rồi tắt rồi bật lại | Dấu hiệu nhập sai hoặc đang thử nghiệm số liệu |
| `paidAmount` khác `amount` mà không có ghi chú | Thu một phần cần giải thích |

Cảnh báo là **thông báo để rà soát, không phải cáo buộc**. Ngôn từ trong thông báo phải trung tính: *"3 dòng thu tiền cần rà lại"*, không phải *"phát hiện bất thường"*.

## 10.4. AI dùng chung tầng phân quyền

```typescript
// modules/ai/tools/queryRecords.ts
export async function queryRecords(args: QueryArgs, ctx: ToolContext) {
  // ctx.scopedPrisma được tạo với CHÍNH user đang chat, không phải service account
  const rows = await ctx.scopedPrisma[args.object].findMany({ where: buildWhere(args.filters) });

  return {
    rows,
    total: rows.length,
    queryDescription: describeQueryVi(args),          // để hiển thị lại cho người dùng
    appliedPermissionFilter: ctx.scopedPrisma.describeScope(args.object),
    // ↑ để chatbot có thể nói "trong phạm vi anh được xem" khi dữ liệu bị giới hạn
  };
}
```
---

# 11. CATALOG VIEW VÀ BÁO CÁO DỰNG SẴN

> **Bổ sung cho Phần 3.12 (schema view) và Phần 6 (màn hình).** Phần 3.12 chỉ định nghĩa *cơ chế* view. Phần này định nghĩa *nội dung cụ thể* phải seed sẵn khi cài đặt — để người dùng mở lên là dùng được ngay, không phải tự dựng lại.
>
> **Nguồn:** 71 view và 14 trang dashboard đang có trong HBG CRM (Airtable), đã lọc bỏ view chết và gộp các view trùng chức năng.

## 11.1. Nguyên tắc rút gọn — vì sao 71 view cũ chỉ còn 34

HBG CRM có 71 view, nhưng phần lớn là **nhân bản thủ công** vì Airtable thiếu 2 thứ: filter động theo người xem, và tham số kỳ báo cáo.

| Nhóm view cũ | Số lượng | Xử lý trong Tomahawk | Còn lại |
|---|---|---|---|
| Calendar cá nhân theo tên (`Alice`, `Jack`, `Giang`, `Mike`, `Dory`, `Grace`, `Cindy`, `Elina`, `QuyenHT's Calendar`) | 9 | **Gộp thành 1 view** với filter `assignee = CURRENT_USER` | 1 |
| Calendar action theo tên trên Opportunity (`Action Mike`, `Action Dory`, `Action Jack`, `Action all`) | 4 | Gộp thành 1 view + 1 view "tất cả" | 2 |
| View "For Copy" / "For Copy to PP" / "For copy To PP" | 3 | **Bỏ** — đây là workaround để copy dữ liệu sang file khác. Tomahawk có nút Xuất Excel | 0 |
| View `For Migration`, `News Letter (Under construct)`, `Giang's Grid copy` | 3 | **Bỏ** — view chết / dở dang | 0 |
| View `All`, `ALL`, `All View`, `All Ref`, `All Fields`, `00 ALL` (trùng nghĩa) | ~6 | Gộp thành 1 view "Tất cả" mỗi object | 1/object |
| `MKT Share`, `MKT Share View`, `HBx View`, `HBX View`, `Public View` | 5 | **Thay bằng phân quyền thật** (Phần 10), không phải view | 0 |

> **Điểm cần nói rõ:** nhóm `MKT Share` / `Public View` trong Airtable là cách chia sẻ dữ liệu ra ngoài bằng link — nhưng **view filter không phải là biên giới bảo mật**. Trong Tomahawk, nhu cầu này giải quyết bằng phân quyền theo vai trò, không tạo view riêng.

## 11.2. Quy ước seed view

```typescript
interface SeedView {
  key: string;                    // ổn định, dùng để nâng cấp không tạo trùng
  objectType: ObjectType;
  name: { vi: string; en: string };
  viewType: ViewType;
  visibility: 'shared' | 'locked';
  isDefault?: boolean;
  sortOrder: number;
  icon?: string;
  description?: { vi: string; en: string };
  requiredRoles?: UserRole[];     // view chỉ hiện với vai trò này
  config: ViewConfig;
  tags?: ('weekly_meeting' | 'data_quality' | 'my_work')[];  // nhóm để lọc trong UI
}
```

**Quy tắc nâng cấp [MUST]:** khi deploy phiên bản mới có thêm/sửa seed view, hệ thống **cập nhật theo `key`**, không tạo bản trùng. View người dùng tự tạo (`visibility = personal`) **không bao giờ bị đụng tới**.

---

## 11.3. View cho Account (8 view)

| # | key | Tên hiển thị | Nguồn gốc | Cấu hình |
|---|---|---|---|---|
| 1 | `account_my` | **Của tôi** ⭐ | mới (thay `Group By Assignee`) | filter `ownerId = CURRENT_USER OR bdId = CURRENT_USER`; sort `rank asc, companyName asc`. **isDefault** |
| 2 | `account_all` | Tất cả công ty | `All - with contact` | không filter; sort `companyName asc` |
| 3 | `account_watching` | Đang theo dõi | `Watching List All` | filter `isWatching = true`; hiện thêm cột "Tín hiệu mới" |
| 4 | `account_by_rank` | Theo hạng | `Group By Tier` | group `rank`; sort `dealSizeTier asc` |
| 5 | `account_whale` | Săn cá voi | `Group By Focus Whale Hunting` | filter `actionCadence = focus_whale_hunting`; group `ownerId` |
| 6 | `account_has_contract` | Đã có hợp đồng | `Have Contract` | filter `firstContractDate is_not_empty`; sort `firstContractDate desc` |
| 7 | `account_need_action` | Cần hành động | `Need Action` | filter: có contact quá hạn nextActionDate HOẶC không có activity 30 ngày; sort theo mức trễ |
| 8 | `account_data_issues` | ⚠️ Dữ liệu thiếu | `Potential Checking` + cơ chế Validator | filter `hasValidationIssue = true`; hiện cột "Vấn đề". tag `data_quality` |

```typescript
// Ví dụ đầy đủ 2 view để làm mẫu
{
  key: 'account_my',
  objectType: 'account',
  name: { vi: 'Của tôi', en: 'My accounts' },
  viewType: 'grid', visibility: 'shared', isDefault: true, sortOrder: 1, icon: 'star',
  tags: ['my_work'],
  config: {
    filters: { conjunction: 'or', conditions: [
      { field: 'ownerId', operator: 'eq', dynamicValue: 'CURRENT_USER' },
      { field: 'bdId',    operator: 'eq', dynamicValue: 'CURRENT_USER' },
    ]},
    sorts: [{ field: 'rank', direction: 'asc' }, { field: 'companyName', direction: 'asc' }],
    fields: [
      { key: 'companyName', visible: true, width: 220, pinned: 'left' },
      { key: 'rank',        visible: true, width: 80 },
      { key: 'dealSizeTier',visible: true, width: 100 },
      { key: 'icpType',     visible: true, width: 130 },
      { key: 'potential',   visible: true, width: 100 },
      { key: 'countryId',   visible: true, width: 110 },
      { key: 'industryId',  visible: true, width: 150 },
      { key: 'actionCadence', visible: true, width: 120 },
      { key: 'companyRelationshipScore', visible: true, width: 110 },
      { key: 'lastActivityAt', visible: true, width: 120 },
      { key: 'ownerId',     visible: true, width: 120 },
      { key: 'basicInfoQuality', visible: false, width: 100 },
    ],
    rowHeight: 'short',
    colorRules: [
      { condition: { field: 'rank', operator: 'eq', value: 'a' }, color: '#FEF3C7' },
      { condition: { field: 'daysSinceLastActivity', operator: 'gt', value: 30 }, color: '#FEE2E2' },
    ],
  },
},
{
  key: 'account_data_issues',
  objectType: 'account',
  name: { vi: '⚠️ Dữ liệu thiếu', en: '⚠️ Data issues' },
  viewType: 'grid', visibility: 'shared', sortOrder: 8, tags: ['data_quality'],
  description: { vi: 'Công ty thiếu thông tin bắt buộc — cần bổ sung trước họp tuần',
                 en: 'Accounts missing required data' },
  config: {
    filters: { conjunction: 'and', conditions: [
      { field: 'validationSeverity', operator: 'in', value: ['blocking','error'] },
    ]},
    sorts: [{ field: 'validationIssueCount', direction: 'desc' }],
    fields: [
      { key: 'companyName', visible: true, width: 220, pinned: 'left' },
      { key: 'validationIssues', visible: true, width: 320 },   // cột ảo, render danh sách issue
      { key: 'ownerId', visible: true, width: 120 },
      { key: 'dealSizeTier', visible: true, width: 100 },
    ],
  },
}
```

## 11.4. View cho Contact (7 view)

| # | key | Tên | Nguồn gốc | Cấu hình |
|---|---|---|---|---|
| 1 | `contact_my_calendar` | **Lịch của tôi** ⭐ | **gộp 9 calendar cá nhân** | `viewType: calendar`, dateField `nextActionDate`, filter `assigneeId = CURRENT_USER`. **isDefault** |
| 2 | `contact_my_list` | Của tôi (danh sách) | `By Assignee` | filter `assigneeId = CURRENT_USER`; sort `nextActionDate asc` |
| 3 | `contact_all` | Tất cả liên hệ | `ALL` | sort `fullName asc` |
| 4 | `contact_overdue` | Quá hạn hành động | `Need Action` | filter `nextActionDate < TODAY AND NOT objectives has_any_of [return_to_mkt, review_for_removing]`; sort `nextActionDate asc`. Badge đỏ trên sidebar |
| 5 | `contact_return_mkt` | Trả về Marketing | `Return to MKT` | filter `objectives has_any_of [return_to_mkt]` |
| 6 | `contact_review_remove` | Chờ rà soát xoá | `Review Remove` | filter `objectives has_any_of [review_for_removing]` |
| 7 | `contact_by_country` | Theo quốc gia | `By Country` | group `account.countryId`; sort `relationshipScore desc` |
| 8 | `contact_data_issues` | ⚠️ Dữ liệu thiếu | (cơ chế Validator) | tag `data_quality` |

> **Ghi chú về view #1:** đây là view thay thế 9 calendar view đặt tên cứng (`Alice`, `Jack`, `Giang`, `Mike`, `Dory`, `Grace`, `Cindy`, `Elina`, `QuyenHT's Calendar`). Với `dynamicValue: 'CURRENT_USER'`, mỗi người mở lên thấy đúng lịch của mình, và **nhân sự mới không cần admin tạo view**.

## 11.5. View cho Opportunity (9 view)

| # | key | Tên | Nguồn gốc | Cấu hình |
|---|---|---|---|---|
| 1 | `opp_my_pipeline` | **Pipeline của tôi** ⭐ | mới | filter `ownerId = CURRENT_USER AND status not_in [won,lost]`; **viewType `kanban`** group theo `status`. **isDefault** |
| 2 | `opp_my_action` | Lịch action của tôi | gộp `Action Mike/Dory/Jack` | calendar, dateField `nextActionDate`, filter `ownerId = CURRENT_USER` |
| 3 | `opp_all_action` | Lịch action toàn team | `Action all` | calendar, dateField `nextActionDate`, không filter người |
| 4 | `opp_active_rfp` | RFP đang chạy | `Active RFP` | filter `status in [rfp_jd, proposed]`; sort `deadline asc` |
| 5 | `opp_need_action` | Cần hành động | `Need Action` | filter `nextActionDate <= TODAY AND status not_in [won,lost]` |
| 6 | `opp_stale` | Cơ hội treo | (rule ẩn "quá 3 tháng" chưa từng enforce) | filter tuổi > 90 ngày AND không activity > 45 ngày AND status not_in [won,lost] |
| 7 | `opp_win_loss` | Phân tích Win/Loss | `Win Factor` | filter `status in [won,lost]`; group `status`; hiện cột `winFactors`, `lossReasons`, `engagementModel`, `meddicScore` |
| 8 | `opp_timeline` | Dòng thời gian | `Timeline` | `viewType: timeline`, start `estimatedStartDate`, end `estimatedEndDate` |
| 9 | `opp_data_issues` | ⚠️ Dữ liệu thiếu | `all failed` | tag `data_quality` |

```typescript
{
  key: 'opp_my_pipeline',
  objectType: 'opportunity',
  name: { vi: 'Pipeline của tôi', en: 'My pipeline' },
  viewType: 'kanban', visibility: 'shared', isDefault: true, sortOrder: 1,
  tags: ['my_work'],
  config: {
    kanbanGroupField: 'status',
    filters: { conjunction: 'and', conditions: [
      { field: 'ownerId', operator: 'eq', dynamicValue: 'CURRENT_USER' },
      { field: 'status', operator: 'not_in', value: ['won','lost'] },
    ]},
    sorts: [{ field: 'weightedValue', direction: 'desc' }],
    fields: [
      { key: 'name', visible: true, width: 200 },
      { key: 'accountId', visible: true, width: 160 },
      { key: 'estimatedValue', visible: true, width: 110 },
      { key: 'winRate', visible: true, width: 80 },
      { key: 'weightedValue', visible: true, width: 110 },
      { key: 'meddicScore', visible: true, width: 100 },
      { key: 'nextActionDate', visible: true, width: 110 },
      { key: 'deadline', visible: true, width: 110 },
    ],
    colorRules: [
      { condition: { field: 'deadline', operator: 'is_within', dynamicValue: 'NEXT_7_DAYS' }, color: '#FEE2E2' },
      { condition: { field: 'meddicScore', operator: 'lt', value: 0.4 }, color: '#FEF3C7' },
    ],
  },
}
```

## 11.6. View cho Contract (11 view)

| # | key | Tên | Nguồn gốc |
|---|---|---|---|
| 1 | `contract_working` | **Đang chạy** ⭐ | `Working Contract` — filter `status not_in [finished]`. isDefault |
| 2 | `contract_all` | Tất cả hợp đồng | `All Ref` |
| 3 | `contract_by_account` | Doanh thu theo công ty | `Revenue By Account` — group `accountId`, summary sum TCV |
| 4 | `contract_by_owner` | Doanh thu theo người | `Revenue By Sales` — group `ownerId`, summary sum TCV |
| 5 | `contract_payment_watch` | ⚠️ Theo dõi thu tiền | mới (từ status `Waiting for Payment` + rule 45 ngày) — filter có tháng đã invoice >45 ngày chưa thu. **isDefault cho `sales_admin`** |
| 6 | `contract_ending_soon` | Sắp hết hạn | (từ formula `Meeting Category` cũ) — filter `endDate` trong 60 ngày tới |
| 7 | `contract_data_issues` | ⚠️ Dữ liệu thiếu | `Invalid` — tag `data_quality` |
| 8 | `contract_to_invoice` | 📄 **Cần xuất invoice** | **MỚI** — tháng doanh thu đã tới kỳ nhưng `isInvoiced = false` |
| 9 | `contract_unpaid` | 💰 **Chưa thu tiền** | **MỚI** — `isInvoiced = true AND isPaid = false`, sort theo số ngày chờ giảm dần |
| 10 | `contract_need_reconcile` | ✅ **Cần đối soát** | **MỚI** — `isPaid = true AND reconciledAt IS NULL`. Hàng đợi riêng của `sales_admin`. Hiện cột "Ai đánh dấu" + "Lúc nào" |
| 11 | `contract_my_accounts` | Hợp đồng khách của tôi | **MỚI** — filter `account.ownerId = CURRENT_USER OR account.bdId = CURRENT_USER`. **isDefault cho `bd`** — đây là view duy nhất BD thấy trong mục Hợp đồng |

> **Bộ view 5, 8, 9, 10 là quy trình thu tiền hoàn chỉnh:** cần xuất invoice → đã xuất chưa thu → báo đã thu chờ đối soát → đối soát xong. View 8, 9 mở cho `bd`/`am`/`sales_admin` cùng dùng (giới hạn theo account với BD); view 10 chỉ `sales_admin` và cấp trên.
>
> Trong hệ thống cũ, khâu này không có ai sở hữu rõ ràng — bảng `Contracts` có link `Invoiced Months` nhưng **không có rollup nào tiêu thụ nó**, tức là dữ liệu được nhập rồi bỏ đó.

## 11.7. View cho Pipeline (5 view)

| # | key | Tên | Nguồn gốc |
|---|---|---|---|
| 1 | `pipeline_current_year` | **Năm nay** ⭐ | `By Account` — filter `fiscalYear = CURRENT_YEAR`. isDefault |
| 2 | `pipeline_committed` | Chỉ phần chắc chắn | `Without Best Case` — filter `weightClass in [kt1]` |
| 3 | `pipeline_hunt_farm` | Hunt / Farm | `Hunt/Farm` — group `isHunt` |
| 4 | `pipeline_by_owner` | Theo người phụ trách | `All group by owner` + `By Sales` (gộp) — group `ownerId` |
| 5 | `pipeline_no_account` | Chưa lộ tên khách | mới — filter `accountId is_empty`; nhắc bổ sung khi đã rõ |

## 11.8. View cho Activity (4 view — object mới)

| # | key | Tên | Cấu hình |
|---|---|---|---|
| 1 | `activity_my_recent` | **Hoạt động của tôi** ⭐ | filter `userId = CURRENT_USER AND occurredAt is_within PAST_30_DAYS`. isDefault |
| 2 | `activity_team_week` | Cả team tuần này | filter `occurredAt is_within THIS_WEEK`; group `userId` |
| 3 | `activity_meetings` | Lịch gặp | calendar, dateField `occurredAt`, filter `type in [meeting_online, meeting_offline]` |
| 4 | `activity_offline_pipeline` | Hẹn gặp offline | (thay bảng `Offline Schedule MTG`) — kanban group `meetingStatus`, filter `type = meeting_offline` |

---

## 11.9. VIEW DÀNH RIÊNG CHO HỌP TUẦN

Đây là nhóm view có `tags: ['weekly_meeting']`. Trong UI, màn hình Weekly Cockpit có tab riêng dẫn tới nhóm này; ngoài ra chúng vẫn xuất hiện trong danh sách view của từng object với icon 📅.

**Hai nguồn:** (a) các view `MTG` trong HBG CRM Airtable, (b) các sheet làm việc trong file Excel `HBL Global Revenue & Pipeline Management` — xem 14.9.3.

| # | key | Object | Tên | Nguồn gốc | Mục đích trong cuộc họp |
|---|---|---|---|---|---|
| W1 | `wm_account_agenda` | account | 📅 Agenda công ty | `Sales Weekly MTG` | Công ty cần bàn tuần này. Filter: có agenda tag (mục 4.10) và **không** có `#SKIP`. Group theo tag ưu tiên cao nhất |
| W2 | `wm_opp_agenda` | opportunity | 📅 Agenda cơ hội | `Weekly MTG` (levels) | Cơ hội cần bàn. Filter: có agenda tag. Sort theo `weightedValue desc` |
| W3 | `wm_hierarchy` | account | 📅 Cây Công ty → Cơ hội → Hợp đồng | `Account - Opp - Contract` (levels) | **View phân cấp 3 tầng**, mở rộng được. Dùng để rà soát toàn cảnh một khách |
| W4 | `wm_contract_review` | contract | 📅 Hợp đồng cần rà | `MTG` (levels) | Hợp đồng sắp hết hạn, đang chờ thanh toán, hoặc status khác `Normal` |
| W5 | `wm_new_this_week` | account | 📅 Mới trong tuần | (từ dashboard `Weekly Nurturing`) | Account mới tạo trong tuần, group theo người |
| W6 | `wm_first_meetings` | activity | 📅 First meeting tuần này | (từ big number `1ST MTG trong 7 ngày`) | Đếm và liệt kê first meeting |
| W7 | `wm_overdue_all` | — | 📅 Tất cả quá hạn | (từ big number `Over dues`) | View tổng hợp đa object: contact + opportunity + contract quá hạn |
| W8 | `wm_help_requested` | account | 📅 Cần hỗ trợ (#HELP) | (từ hashtag `#HELP`) | Account có `#HELP` trong ghi chú kế hoạch |
| W9 | `wm_data_quality` | — | 📅 Chất lượng dữ liệu | `Missing Assignee` + `Invalid Record` | Tổng hợp mọi bản ghi có validation issue, group theo người phụ trách |

### 11.9.1. Đặc tả view phân cấp (W3) — kiểu view mới

HBG CRM có 3 view kiểu `levels` mà Tomahawk cần hỗ trợ. Bổ sung vào enum:

```typescript
export const ViewType = {
  GRID: 'grid', KANBAN: 'kanban', CALENDAR: 'calendar',
  TIMELINE: 'timeline',
  HIERARCHY: 'hierarchy',      // ← BỔ SUNG
} as const;
```

```typescript
// Bổ sung vào ViewConfig
hierarchy: z.object({
  levels: z.array(z.object({
    objectType: z.string(),
    relationField: z.string(),          // field nối với cấp trên
    displayFields: z.array(z.string()),
    summaryFields: z.array(z.object({
      field: z.string(),
      fn: z.enum(['sum','count','avg','max','min']),
    })).default([]),
    defaultExpanded: z.boolean().default(false),
  })),
}).optional(),
```

**Cấu hình cụ thể của W3:**
```typescript
{
  key: 'wm_hierarchy',
  objectType: 'account',
  name: { vi: '📅 Cây Công ty → Cơ hội → Hợp đồng', en: '📅 Account → Opp → Contract' },
  viewType: 'hierarchy', visibility: 'shared', tags: ['weekly_meeting'],
  config: {
    filters: { conjunction: 'and', conditions: [
      { field: 'hasAgendaTag', operator: 'eq', value: true },
    ]},
    hierarchy: { levels: [
      { objectType: 'account', relationField: '',
        displayFields: ['companyName','rank','dealSizeTier','ownerId','agendaTags'],
        summaryFields: [{ field: 'currentYearRevenue', fn: 'sum' }],
        defaultExpanded: true },
      { objectType: 'opportunity', relationField: 'accountId',
        displayFields: ['name','status','estimatedValue','winRate','meddicScore','nextActionDate'],
        summaryFields: [{ field: 'weightedValue', fn: 'sum' }, { field: 'id', fn: 'count' }],
        defaultExpanded: true },
      { objectType: 'contract', relationField: 'opportunityId',
        displayFields: ['name','status','startDate','endDate','tcv','collectedRevenue'],
        summaryFields: [{ field: 'tcv', fn: 'sum' }],
        defaultExpanded: false },
    ]},
  },
}
```

**Hiển thị:**
```
▼ 🏢 Fujifilm BI Hong Kong        A · Mega · TungNX   [Mega Account][Sát deadline]  $0
  ▼ 💼 Photo album platform       RFP,JD · $70.000 · 30% · MEDDIC 0.45 · 15/08
      (chưa có hợp đồng)
  ▶ 💼 OCR integration            Following · $12.000 · 10%
▼ 🏢 Belive                        A · Medium · QuyenHT  [Có doanh thu năm nay]  $59.714
  ▼ 💼 Team-based expansion       Won · $69.300
    ▶ 📄 HĐ Belive Q3-Q4 2026     Normal · 01/07-31/12 · $69.300 · thu $12.600
```

### 11.9.2. View đa object (W7, W9) — kiểu view mới

Hai view này gộp bản ghi từ nhiều object. Bổ sung:

```typescript
// ViewConfig
multiObject: z.object({
  sources: z.array(z.object({
    objectType: z.string(),
    filters: FilterGroup.optional(),
    labelVi: z.string(),
    displayMapping: z.record(z.string(), z.string()),  // map field object → cột chung
  })),
  commonColumns: z.array(z.object({ key: z.string(), label: z.string(), type: z.string() })),
}).optional(),
```

**W7 — Tất cả quá hạn:**
```typescript
multiObject: {
  commonColumns: [
    { key: 'objectType', label: 'Loại',      type: 'text' },
    { key: 'title',      label: 'Tên',        type: 'text' },
    { key: 'owner',      label: 'Phụ trách',  type: 'user' },
    { key: 'dueDate',    label: 'Hạn',        type: 'date' },
    { key: 'overdueDays',label: 'Trễ (ngày)', type: 'number' },
    { key: 'value',      label: 'Giá trị',    type: 'currency' },
  ],
  sources: [
    { objectType: 'contact', labelVi: 'Liên hệ',
      filters: { conjunction:'and', conditions:[
        { field:'nextActionDate', operator:'lt', dynamicValue:'TODAY' },
        { field:'objectives', operator:'has_none_of', value:['return_to_mkt','review_for_removing'] }]},
      displayMapping: { title:'fullName', owner:'assigneeId', dueDate:'nextActionDate', value:'' } },
    { objectType: 'opportunity', labelVi: 'Cơ hội',
      filters: { conjunction:'and', conditions:[
        { field:'nextActionDate', operator:'lt', dynamicValue:'TODAY' },
        { field:'status', operator:'not_in', value:['won','lost'] }]},
      displayMapping: { title:'name', owner:'ownerId', dueDate:'nextActionDate', value:'weightedValue' } },
    { objectType: 'contract', labelVi: 'Hợp đồng',
      filters: { conjunction:'and', conditions:[
        { field:'nextActionDate', operator:'lt', dynamicValue:'TODAY' },
        { field:'status', operator:'neq', value:'finished' }]},
      displayMapping: { title:'name', owner:'ownerId', dueDate:'nextActionDate', value:'tcv' } },
    { objectType: 'action_item', labelVi: 'Việc cần làm',
      filters: { conjunction:'and', conditions:[
        { field:'dueDate', operator:'lt', dynamicValue:'TODAY' },
        { field:'status', operator:'in', value:['open','in_progress'] }]},
      displayMapping: { title:'title', owner:'assigneeId', dueDate:'dueDate', value:'' } },
  ],
}
```

### 11.9.3. View lấy trực tiếp từ file Excel `HBL Global Revenue & Pipeline Management`

File Excel đang dùng để họp có 8 sheet. Bốn sheet trong đó là **bảng làm việc thật** (không phải dashboard), cần chuyển thành view trong Tomahawk — nếu không, đội vẫn phải mở Excel song song.

| Sheet Excel | Cột trong Excel | → View Tomahawk | key |
|---|---|---|---|
| `Signing Revenue` | Market, Team, Code, Client Name, Status, Project, Duration, Source, Model, Sizing, Domain, BD, Signing Date, Booked revenue (USD), Jan-26…Dec-26 | Hợp đồng đã ký trong kỳ + phân bổ 12 tháng | `wm_signing_revenue` |
| `Invoice Revenue` | (cùng bộ cột) + Invoice revenue (Local Currency) | Doanh thu xuất hoá đơn theo tháng | `wm_invoice_revenue` |
| `Upsales Pipeline` | Input Date/Last Activities, Prospecting Source, Status, Sales, Client's Name, Market, Domain, Business Model, Sizing, Client Brief, Requirement, Collaboration Model, Tech stacks, Client PIC Name, Tiến độ dự án, Winning/Breaking point, Note, Doanh số dự kiến, Tháng 1-12 | Cơ hội mở rộng trên khách hiện hữu | `wm_upsales_pipeline` |
| `New Pipeline` | Nhóm theo KT1 (90%) / KT2 (50%) / KT3+TT (10%): Market, Code, Client Name, Status, Duration, Source, Model, Sizing, Domain, AM, Signing Date, Booked revenue (USD), Pipeline Value | Pipeline khách mới, nhóm theo trọng số | `wm_new_pipeline` |

---

#### W10 — `wm_signing_revenue` · Doanh số ký

```typescript
{
  key: 'wm_signing_revenue',
  objectType: 'contract',
  name: { vi: '📅 Doanh số ký', en: '📅 Signing revenue' },
  viewType: 'grid', visibility: 'shared', tags: ['weekly_meeting'],
  description: { vi: 'Hợp đồng ký trong kỳ, kèm phân bổ doanh thu 12 tháng (thay sheet Signing Revenue)',
                 en: 'Contracts signed in period with 12-month revenue split' },
  config: {
    filters: { conjunction: 'and', conditions: [
      { field: 'signedDate', operator: 'is_within', dynamicValue: 'THIS_QUARTER' },
    ]},
    sorts: [{ field: 'signedDate', direction: 'desc' }],
    fields: [
      { key: 'account.countryId',      visible: true, width: 100 },   // = Market
      { key: 'ownerId',                visible: true, width: 110 },   // = Team / AM
      { key: 'code',                   visible: true, width: 80 },
      { key: 'account.companyName',    visible: true, width: 180, pinned: 'left' },
      { key: 'status',                 visible: true, width: 120 },
      { key: 'name',                   visible: true, width: 180 },   // = Project
      { key: 'durationMonths',         visible: true, width: 90 },    // cột tính: endDate - startDate
      { key: 'account.firstContactSource', visible: true, width: 110 },
      { key: 'engagementModel',        visible: true, width: 120 },   // = Model
      { key: 'account.sizeBand',       visible: true, width: 100 },   // = Sizing
      { key: 'account.techDomainId',   visible: true, width: 130 },   // = Domain
      { key: 'account.bdId',           visible: true, width: 100 },
      { key: 'signedDate',             visible: true, width: 110 },
      { key: 'tcv',                    visible: true, width: 120 },   // = Booked revenue
      // 12 cột tháng, render từ contract_month_revenue
      { key: 'month.2026.1',  visible: true, width: 90 },
      { key: 'month.2026.2',  visible: true, width: 90 },
      // ... tới month.2026.12
    ],
    // Dòng tổng cuối bảng
    summaryRow: [
      { field: 'tcv', fn: 'sum' },
      ...range(1,12).map(m => ({ field: `month.2026.${m}`, fn: 'sum' })),
    ],
  },
}
```

> **Yêu cầu kỹ thuật mới [MUST]:** grid phải hỗ trợ **cột động sinh từ bảng con** — `month.{year}.{month}` đọc/ghi vào `contract_month_revenue`. Sửa ô tháng = upsert một dòng bảng con. Đây là thứ làm cho Tomahawk thay được Excel: người dùng vẫn thấy 12 cột tháng quen thuộc, nhưng bên dưới là dữ liệu chuẩn hoá.

---

#### W11 — `wm_invoice_revenue` · Doanh thu xuất hoá đơn

Cùng cấu trúc W10, khác ở:
- Filter theo `contract_month_revenue.isInvoiced = true` trong kỳ
- Cột tháng hiển thị `amount` kèm **cờ trạng thái**: ⬜ chưa xuất · 📄 đã xuất · ✅ đã thu
- Thêm dòng tổng: `Đã xuất` / `Đã thu` / `Chênh lệch`
- Thêm cột `Số ngày chờ thu` (từ `invoicedAt` tới hôm nay, chỉ hiện khi chưa thu) — tô đỏ khi >45 ngày

> Cột "Số ngày chờ thu" là bổ sung mới. File Excel hiện có sheet ghi `DT dự kiến / DT xuất invoice / Invoice đã thanh toán` ở cuối bảng nhưng **không có cảnh báo tuổi nợ**.

---

#### W12 — `wm_upsales_pipeline` · Pipeline mở rộng khách hiện hữu

```typescript
{
  key: 'wm_upsales_pipeline',
  objectType: 'opportunity',
  name: { vi: '📅 Pipeline Upsales', en: '📅 Upsales pipeline' },
  viewType: 'grid', visibility: 'shared', tags: ['weekly_meeting'],
  description: { vi: 'Cơ hội trên khách đã có hợp đồng (thay sheet Upsales Pipeline)',
                 en: 'Opportunities on existing customers' },
  config: {
    filters: { conjunction: 'and', conditions: [
      { field: 'account.firstContractDate', operator: 'is_not_empty' },   // khách hiện hữu
      { field: 'status', operator: 'not_in', value: ['won','lost'] },
    ]},
    sorts: [{ field: 'weightedValue', direction: 'desc' }],
    fields: [
      { key: 'lastActivityAt',       visible: true, width: 110 },  // = Input Date/Last Activities
      { key: 'account.firstContactSource', visible: true, width: 110 },
      { key: 'status',               visible: true, width: 110 },
      { key: 'ownerId',              visible: true, width: 100 },
      { key: 'account.companyName',  visible: true, width: 170, pinned: 'left' },
      { key: 'account.website',      visible: false, width: 140 },
      { key: 'account.countryId',    visible: true, width: 90 },
      { key: 'account.techDomainId', visible: true, width: 120 },
      { key: 'account.icpType',      visible: true, width: 120 },  // = Business Model
      { key: 'account.sizeBand',     visible: true, width: 90 },
      { key: 'meddicIdentifyPain',   visible: true, width: 260 },  // = Client Brief + Requirement
      { key: 'engagementModel',      visible: true, width: 110 },  // = Collaboration Model
      { key: 'techStack',            visible: true, width: 120 },
      { key: 'primaryContactName',   visible: true, width: 130 },  // = Client PIC Name
      { key: 'progressNote',         visible: true, width: 280 },  // = Tiến độ dự án
      { key: 'winLossNote',          visible: true, width: 240 },  // = Winning/Breaking point
      { key: 'estimatedValue',       visible: true, width: 110 },  // = Doanh số dự kiến
      // 12 cột tháng phân bổ dự kiến
    ],
    rowHeight: 'tall',   // vì có nhiều cột text dài
  },
}
```

> **Hai field cần bổ sung vào bảng `opportunity`** (chưa có trong Phần 3.7):
> ```prisma
> progressNote  String? @map("progress_note") @db.Text   // "20/7: Đã gửi function list, đợi KH confirm"
> winLossNote   String? @map("win_loss_note") @db.Text   // "Breaking point: Cecilia lo ngại communication"
> techStack     String[] @default([]) @map("tech_stack")
> ```
> Đây là 3 cột đang dùng thật trong Excel mà mô hình dữ liệu chưa có. `progressNote` khác `meddicIdentifyPain` ở chỗ nó là **nhật ký tiến độ ngắn**, còn MEDDIC là phân tích qualification.

---

#### W13 — `wm_new_pipeline` · Pipeline khách mới, nhóm theo trọng số

```typescript
{
  key: 'wm_new_pipeline',
  objectType: 'pipeline_entry',
  name: { vi: '📅 Pipeline khách mới', en: '📅 New pipeline' },
  viewType: 'grid', visibility: 'shared', tags: ['weekly_meeting'],
  config: {
    filters: { conjunction: 'and', conditions: [
      { field: 'isHunt', operator: 'eq', value: true },
      { field: 'fiscalYear', operator: 'eq', dynamicValue: 'CURRENT_YEAR' },
    ]},
    groupBy: { field: 'weightClass', collapsed: [] },   // nhóm KT1 / KT2 / KT3 / TT / Pending
    sorts: [{ field: 'weightedValue', direction: 'desc' }],
    fields: [
      { key: 'account.countryId',   visible: true, width: 100 },
      { key: 'code',                visible: true, width: 70 },
      { key: 'displayName',         visible: true, width: 200, pinned: 'left' },  // account hoặc placeholderName
      { key: 'opportunity.status',  visible: true, width: 110 },
      { key: 'durationMonths',      visible: true, width: 90 },
      { key: 'account.firstContactSource', visible: true, width: 110 },
      { key: 'engagementModel',     visible: true, width: 110 },
      { key: 'account.sizeBand',    visible: true, width: 90 },
      { key: 'account.techDomainId',visible: true, width: 120 },
      { key: 'ownerId',             visible: true, width: 100 },
      { key: 'expectedSignDate',    visible: true, width: 110 },
      { key: 'fullRevenue',         visible: true, width: 120 },   // = Booked revenue (chưa trọng số)
      { key: 'weightedValue',       visible: true, width: 120 },   // = Pipeline Value (đã × trọng số)
    ],
    // Mỗi nhóm hiện dòng tổng: tổng chưa trọng số + tổng có trọng số
    groupSummary: [
      { field: 'fullRevenue', fn: 'sum' },
      { field: 'weightedValue', fn: 'sum' },
    ],
  },
}
```

**Hiển thị (khớp cấu trúc sheet `New Pipeline`):**
```
▼ KT1 (90%)                                    Σ $218.400    Σ trọng số $196.560
    Thailand   Club Miracle - PMS      Upsales  Team-based  QuyenHT   $45.000   $40.500
    Thailand   Club Miracle - Channel  Upsales  Team-based  QuyenHT   $75.000   $67.500
    Australia  GameLocker              Upsales  Team-based  TungNX    $38.400   $34.560
    Singapore  Fujifilm HK             New      Project     TungNX    $60.000   $54.000
▼ KT2 (50%)                                    Σ $102.000    Σ trọng số  $51.000
    Singapore  ScienTec                New      PB/ODC      HiepLM    $90.000   $45.000
    Singapore  Editetech               New      Project     TungNX    $12.000    $6.000
▼ KT3 + TT (10%)                               Σ  $35.200    Σ trọng số   $3.520
    ...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  TỔNG CỘNG                                    Σ $355.600    Σ trọng số $251.080
```

> **Cần bổ sung field vào `pipeline_entry`:** `expectedSignDate` (ngày dự kiến ký) và `durationMonths` — hai cột này có trong Excel nhưng chưa có trong mô hình dữ liệu ở Phần 3.9.

---

#### W14 — `wm_performance_summary` · Bảng điều hành (thay sheet `Dashboard for Report`)

Đây **không phải view** mà là section chính của màn hình Weekly Cockpit (Phần 6.3), giữ đúng cấu trúc 4 nhóm chỉ tiêu của Excel:

| Nhóm | Các chỉ số (verbatim từ Excel) | Metric trong Tomahawk |
|---|---|---|
| **Tài Chính** | Doanh số ký trong tuần | `booked_revenue` / week |
| | Doanh số ký trong tháng | `booked_revenue` / month |
| | Doanh số lũy kế trong quý | `booked_revenue` / quarter (cộng dồn) |
| | Doanh số lũy kế năm | `booked_revenue` / year (cộng dồn) |
| | Doanh thu nền dự kiến trong tháng | `billing_revenue` từ hợp đồng đang chạy |
| | Doanh thu mới dự kiến trong tháng | `billing_revenue` từ hợp đồng ký trong tháng |
| | Doanh thu dự kiến trong tháng | tổng 2 dòng trên |
| | Doanh thu dự kiến trong quý | `billing_revenue` / quarter |
| | Doanh thu luỹ kế dự kiến (năm) | `billing_revenue` / year |
| **Khách hàng** | Số lượng khách hàng ký mới trong tuần | `new_signed_customer` / week |
| | Số lượng khách luỹ kế | đếm account có ≥1 hợp đồng |
| | Số lượng khách hàng active | đếm account có hợp đồng status ≠ finished |
| | Số lượng khách hàng Key account (≥200k/năm) | đếm `revenueTier = key` |
| | Số lượng khách hàng Mega account (≥400k/năm) | đếm `revenueTier = mega` |
| | Khách hàng đáng chú ý | account có agenda tag ưu tiên cao, kèm tên |
| **Tổ Chức** | Tổng số team member · Số lượng AM (kèm tên) · Số lượng BD (kèm tên) · Số lượng Intern | đếm `user` theo `role` |
| **BD Performance** | Name · Total meeting · Total SQL · Monthly KPI (%) · RAG · Monthly KPI (target dạng chữ "8 meetings, 2 SQLs") | bảng per-user |
| **AM Performance** | Per person × Q1-Q4 + Năm: KPI Booked Revenue · Sum Quarter Booked · % Complete · KPI Billable Revenue Forecast · Sum Quarter Billed · % Complete · New signing customers | bảng per-user theo quý |

> **Ba khác biệt so với Excel — cần nói rõ để không bị coi là thiếu sót:**
>
> 1. **Cột "Note (Tên KH)"** trong Excel là ghi chú tay ghi tên khách đóng góp vào con số. Trong Tomahawk, thay bằng **click vào số để mở danh sách** — chính xác hơn và không phải gõ.
> 2. **Cột "Monthly KPI" dạng chữ** ("8 meetings, 2 SQLs") trong Excel gộp 2 chỉ tiêu vào một ô text. Trong Tomahawk tách thành **2 dòng KPI riêng** để tính % được từng cái.
> 3. **Ô "Warning" gán màu tay** → thay bằng RAG tính tự động theo ngưỡng cấu hình (mục 3.13).

---

#### Bổ sung sheet `Overview` — bảng Gap và Yield

Sheet `Overview` (có dấu cách cuối tên) trong Excel có vài chỉ số **không có trong HBG CRM Airtable**, cần đưa vào R2:

| Chỉ số Excel | Ý nghĩa | Bổ sung vào |
|---|---|---|
| `Gap` (DS và DT) theo tháng và quý | Chênh lệch thực tế − chỉ tiêu, để âm | R2, thêm cột `Gap` cạnh `% Complete` |
| `Signed Customers` | Số khách ký trong kỳ | R2 |
| `AVG Contract Value` | Giá trị hợp đồng trung bình | R2 — chỉ số này hữu ích để dự báo cần bao nhiêu deal |
| `Yield Ratio REV` | Tỷ lệ chuyển đổi từ pipeline sang doanh thu thực | R3 — **chỉ số quan trọng để hiệu chỉnh trọng số KT** |
| `Hệ số` (3.4725 / 20.14 cho 3 tháng / 12 tháng) | Hệ số quy đổi pipeline → doanh thu | R3, ghi rõ là hệ số kinh nghiệm |

> **`Yield Ratio REV` đáng chú ý nhất.** Nó đo pipeline dự báo có sát thực tế không. Nếu sau vài quý thấy KT1 (đang gán 90%) thực tế chỉ chuyển đổi 60%, thì **trọng số đang sai** và cần điều chỉnh trong `pipeline_weight_config`. Đây là cơ chế tự hiệu chỉnh mà file Excel đã có mầm mống nhưng chưa dùng có hệ thống.

### 11.9.4. Luồng chạy một cuộc họp tuần

```
1. Mở /weekly-meeting → hệ thống tự tạo/lấy phiên tuần hiện tại
2. Tab "Tổng quan" → đọc W14 (4 nhóm chỉ tiêu, khớp sheet Dashboard for Report) — số đã tính sẵn
3. Bấm "✨ Sinh tóm tắt AI" (hoặc đã có sẵn từ job 07:00 thứ Hai)
4. Tab "Agenda" → duyệt W1, W2 theo thứ tự ưu tiên tag
5. Khách nào cần đào sâu → mở W3 (cây phân cấp) ngay trong tab
6. Tab "Doanh số & doanh thu" → W10, W11 (thay sheet Signing/Invoice Revenue)
7. Tab "Pipeline" → W12 (upsales), W13 (khách mới theo KT1/KT2/KT3)
8. Tab "Quá hạn" → W7, phân công xử lý
9. Tab "Chất lượng dữ liệu" → W9, giao người sửa
10. Ghi việc cần làm (gắn với account/opportunity liên quan)
11. Bấm "Đóng phiên họp" → đóng băng snapshot, việc chưa xong tự chuyển tuần sau
```

**Cấu trúc tab của Weekly Cockpit:**
```
[Tổng quan] [Agenda] [Doanh số & DT] [Pipeline] [Quá hạn] [Chất lượng DL] [Việc cần làm]
     W14      W1,W2,W3    W10,W11      W12,W13      W7          W9         action_item
```

**Yêu cầu [MUST]:** Weekly Cockpit có tab dẫn thẳng tới W1-W14, **không bắt người dùng đi vòng qua menu từng object**. Mỗi tab hiển thị grid đầy đủ chức năng (sửa được tại chỗ), không phải bảng chỉ đọc — vì trong lúc họp thường phát hiện dữ liệu sai và sửa luôn.

---

## 11.10. CATALOG BÁO CÁO

### 11.10.1. Rút gọn từ 14 trang dashboard cũ xuống 8 báo cáo

HBG CRM có 2 interface với 14 trang dashboard, 334 element. Nhưng phần lớn là **bản sao theo quý**:

| Trang dashboard cũ | Nhận xét | Xử lý |
|---|---|---|
| `Nurturing Q2 2024`, `Nurturing Q3 2024`, `Nurturing 2024` | 3 bản gần giống nhau, khác kỳ | **Gộp thành 1 báo cáo có bộ chọn kỳ** |
| `Q1 2025`, `Q2 2025`, `Q3 2025`, `2025 up to date` | 4 bản sao cùng template | **Gộp thành 1** |
| `Monthly Nurturing` | theo tháng | Gộp cùng nhóm trên, đổi granularity |
| `Weekly Nurturing` | theo tuần, có KPI target ghi cứng trong tiêu đề | → Weekly Cockpit (Phần 6.3) |
| `Mike's Business Overview` | 360° cho 1 người, build tay | **→ 1 báo cáo động filter `CURRENT_USER`** |
| `BD KPI Checking 2025` | chấm điểm rep theo Rank | Giữ thành báo cáo riêng |
| `Q3 2025 Sales Dashboard` | tài chính cấp quản lý | Giữ, thêm bộ chọn kỳ |
| `Dashboard` | tổng quan tài chính | Gộp với trên |
| `AU Only` | giới hạn theo quốc gia | **→ bộ lọc quốc gia trên báo cáo funnel**, không phải báo cáo riêng |

**Kết quả: 14 trang → 8 báo cáo có tham số.**

### 11.10.2. Mô hình báo cáo có tham số

```prisma
model ReportDefinition {
  id          String  @id @default(uuid(7))
  key         String  @unique
  nameVi      String  @map("name_vi")
  nameEn      String  @map("name_en")
  category    String                       // 'funnel'|'financial'|'performance'|'quality'
  descriptionVi String? @map("description_vi")
  isSystem    Boolean @default(true) @map("is_system")   // báo cáo dựng sẵn, không cho xoá
  requiredRoles String[] @default([]) @map("required_roles")
  parameters  Json                         // ReportParameter[]
  layout      Json                         // ReportSection[]
  sortOrder   Int     @default(0) @map("sort_order")
  @@map("report_definition")
}

model ReportSnapshot {
  id         String   @id @default(uuid(7))
  reportKey  String   @map("report_key")
  parameters Json                          // giá trị tham số lúc chạy
  data       Json                          // kết quả đóng băng
  generatedBy String  @map("generated_by")
  generatedAt DateTime @default(now()) @map("generated_at") @db.Timestamptz
  note       String?
  @@index([reportKey, generatedAt(sort: Desc)])
  @@map("report_snapshot")
}
```

```typescript
interface ReportParameter {
  key: string;
  type: 'period' | 'periodType' | 'scope' | 'select' | 'multiSelect' | 'dateRange';
  labelVi: string;
  required: boolean;
  defaultValue?: unknown;
  options?: Array<{ value: string; labelVi: string }>;
}

interface ReportSection {
  key: string;
  titleVi: string;
  type: 'kpi_tiles' | 'table' | 'chart' | 'pivot' | 'funnel' | 'text';
  query: ReportQuery;              // dùng lại tool query_records ở Phần 8.4
  visualization?: { chartType: 'bar'|'line'|'pie'|'area'; xField: string; yFields: string[]; groupBy?: string };
  drillDownView?: string;          // key của view để mở khi click
}
```

> **Vì sao dùng tham số thay vì tạo báo cáo mới mỗi quý:** hệ thống cũ mỗi quý phải nhân bản một trang dashboard rồi sửa filter bằng tay. Sau 2 năm có 7 bản sao, không ai biết bản nào đang đúng. Với tham số, chỉ có **một** định nghĩa báo cáo, chọn kỳ từ dropdown.

### 11.10.3. Tám báo cáo dựng sẵn

---

#### R1 — `funnel_nurturing` · Phễu nuôi dưỡng
**Nguồn:** `Nurturing 2024/Q2/Q3`, `Q1-Q3 2025`, `2025 up to date`, `Monthly Nurturing` (7 trang cũ)
**Tham số:** `periodType` (tuần/tháng/quý/năm) · `period` · `scope` (công ty/team/cá nhân) · `country` (tuỳ chọn — thay trang `AU Only`)
**Quyền:** tất cả

| Section | Loại | Nội dung |
|---|---|---|
| Phễu 4 bước | funnel | Account mới → có 1st MTG hoặc RFP → có RFP → có hợp đồng. Hiện số + tỷ lệ chuyển đổi giữa các bước |
| Phễu theo người | table | Ma trận người × 4 bước, có tổng |
| Theo quy mô | chart bar | Trục X = `dealSizeTier`, group theo người |
| Theo nguồn | chart bar | Trục X = `contact.source`, group theo người |
| Theo tiềm năng | pivot | Hàng = người, cột = `potential` |
| Theo hạng | pivot | Hàng = người, cột = `rank` |
| Xu hướng | chart line | Số account mới theo tuần trong kỳ |
| Thời gian trung bình | kpi_tiles | Ngày tạo → NDA (tuần) · Ngày tạo → hợp đồng đầu (tuần) · 1st contact → 1st meeting (tuần) |

> Ba chỉ số cuối là `Create2NDA`, `Create2FirstContract`, `1st Rep - 1st Meet` của hệ thống cũ — đo tốc độ chu kỳ bán hàng.

---

#### R2 — `financial_overview` · Tổng quan tài chính
**Nguồn:** `Q3 2025 Sales Dashboard`, `Dashboard`
**Tham số:** `periodType` · `period` · `scope` · `currency`
**Quyền:** `am`, `sales_admin`, `manager`, `bod`, `admin`

| Section | Loại | Nội dung |
|---|---|---|
| Ba loại doanh thu | kpi_tiles | **Doanh số ký** · **Doanh thu thuộc kỳ** · **Tiền đã thu** — mỗi ô có target, %, RAG, so kỳ trước |
| Xu hướng | chart line | 3 đường theo tháng trong kỳ |
| Theo quý | table | Q1-Q4 × 3 loại doanh thu, có cột Tổng năm |
| Theo mô hình hợp tác | chart pie | Chia theo `engagementModel` (Body Shop / Project Based / ODC), 2 biểu đồ: theo số lượng và theo tiền |
| Theo quốc gia | chart pie | Tổng TCV theo `account.country` |
| Hunt vs Farm | chart bar | Doanh thu khách mới vs khách cũ theo tháng |
| Trạng thái hợp đồng | pivot | Hàng = hợp đồng, cột = `status`, giá trị = TCV + Act Rev |
| Win rate theo mô hình | chart bar | Trục X = `engagementModel`, Y = win rate trung bình |
| Top khách hàng | table | 10 account có doanh thu cao nhất kỳ |

---

#### R3 — `forecast_pipeline` · Dự báo Pipeline
**Nguồn:** `Q3 2025 Sales Dashboard` (phần `Monthly Revenue Trend for 2026`) + bảng `Month Pipeline 2026`
**Tham số:** `fiscalYear` · `scope`

| Section | Loại | Nội dung |
|---|---|---|
| Tổng dự báo | kpi_tiles | Tổng có trọng số · Tổng chắc chắn (chỉ KT1) · Tổng chưa trọng số |
| Theo tháng | chart bar (stacked) | 12 tháng, xếp chồng theo `weightClass` (KT1/KT2/KT3/TT) |
| Bảng chi tiết | table | Pipeline entry × 12 tháng headcount, có dòng tổng |
| Hunt vs Farm | chart bar | Dự báo tách theo `isHunt` |
| Theo người | pivot | Hàng = người, cột = `weightClass`, giá trị = doanh thu có trọng số |
| Theo dịch vụ | chart pie | Chia theo `serviceOfferings` |
| Nhu cầu nhân lực | chart line | Tổng headcount theo tháng, tách theo `resourceType` — **báo cho delivery biết cần tuyển bao nhiêu** |

> Section cuối là bổ sung mới, không có ở hệ thống cũ. Với công ty ITO, forecast doanh thu **cũng chính là** kế hoạch nhân lực — nhưng HBG CRM chỉ dùng nó để tính tiền, chưa dùng để lập kế hoạch tuyển dụng.

---

#### R4 — `bd_performance` · Hiệu suất BD
**Nguồn:** `BD KPI Checking 2025`, phần `BD Performance` của `Dashboard for Report`
**Tham số:** `periodType` · `period` · `team`
**Quyền:** `manager`, `bod`, `admin`

| Section | Loại | Nội dung |
|---|---|---|
| Bảng hiệu suất | table | Người × (số meeting, số first meeting, SQL, account mới, contact mới, % KPI, RAG) |
| Số account theo hạng | kpi_tiles | Đếm A / B / C / chưa xếp hạng |
| Ma trận người × hạng | pivot | |
| Ma trận quy mô × tiềm năng | pivot | Hàng = `dealSizeTier`, cột = `potential` |
| Số account theo dải doanh thu | chart bar | |
| Điểm quan hệ trung bình | chart bar | Theo người |
| Xu hướng hoạt động | chart line | Số activity theo tuần, group theo người |

---

#### R5 — `my_business` · Sổ khách hàng của tôi
**Nguồn:** `Mike's Business Overview` — **chuyển từ build tay cho từng người sang một báo cáo động**
**Tham số:** `user` (mặc định = người đang xem) · `periodType` · `period`
**Quyền:** tất cả (chỉ xem được của mình, trừ manager/bod)

| Section | Loại | Nội dung |
|---|---|---|
| KPI cá nhân | kpi_tiles | Doanh số ký · Doanh thu · Số meeting · Số SQL — kèm target và RAG |
| Danh sách account | table | Account tôi phụ trách, kèm rank, điểm quan hệ, hoạt động gần nhất |
| Pipeline cá nhân | funnel | 5 bước status của opportunity |
| Cơ hội đang mở | table | Sort theo `weightedValue` |
| Hợp đồng đang chạy | table | |
| Phân bố ngành | chart pie | Account của tôi theo `industry` |
| Phân bố quy mô | chart bar | Theo `dealSizeTier` |
| Việc quá hạn | table | Contact/opportunity/contract quá hạn của tôi |

> Với 15 người dùng, hệ thống cũ phải build 15 dashboard riêng nếu muốn ai cũng có. Thực tế chỉ build cho 1 người (Mike). Đây là ví dụ rõ nhất của việc thiếu filter động gây ra lãng phí công sức.

---

#### R6 — `win_loss_analysis` · Phân tích Thắng/Thua
**Nguồn:** biểu đồ `Failed Factors` trên các trang quý + view `Win Factor`
**Tham số:** `periodType` · `period` · `scope`
**Quyền:** `am`, `manager`, `bod`, `admin`

| Section | Loại | Nội dung |
|---|---|---|
| Tỷ lệ thắng | kpi_tiles | Số won / (won + lost) · Giá trị thắng · Giá trị thua · Chu kỳ trung bình (tuần) |
| Lý do thua | chart bar | Đếm theo `lossReasons`, xếp theo tần suất |
| Lý do thua theo MEDDIC | chart pie | Gom theo 6 chiều MEDDIC |
| Yếu tố thắng | chart bar | Đếm theo `winFactors` |
| Win rate theo mô hình | chart bar | Theo `engagementModel` |
| Win rate theo ICP | chart bar | Theo `account.icpType` |
| Win rate theo quy mô | chart bar | Theo `dealSizeTier` |
| Điểm MEDDIC: thắng vs thua | chart bar | So sánh `meddicScore` trung bình của deal thắng và thua — **kiểm chứng xem khung MEDDIC có thực sự dự báo được kết quả không** |
| ✨ Nhận định AI | text | AI phân tích pattern, nêu 3 phát hiện đáng chú ý |

> Section áp chót là bổ sung mới và quan trọng: nó **kiểm chứng chính công cụ qualification**. Nếu sau 6 tháng thấy `meddicScore` của deal thắng và deal thua không khác nhau, nghĩa là hoặc khung MEDDIC đang được điền hình thức, hoặc cách chấm điểm sai — cả hai đều cần biết.

---

#### R7 — `relationship_health` · Sức khoẻ quan hệ
**Nguồn:** các chart `Score Relationship`, `Company Relationship` trên dashboard `Nurturing`
**Tham số:** `scope` · `dealSizeTier` (tuỳ chọn)

| Section | Loại | Nội dung |
|---|---|---|
| Điểm trung bình | kpi_tiles | Điểm quan hệ cá nhân trung bình · Điểm quan hệ công ty trung bình · Số contact "nguội" (>30 ngày) |
| Phân bố điểm | chart bar | Histogram điểm quan hệ |
| Theo hạng account | chart bar | Điểm trung bình theo `rank` |
| Xu hướng | chart line | Điểm trung bình theo tuần (từ `contact_score_history`) |
| Top tăng / Top giảm | table | 10 contact tăng điểm nhiều nhất và giảm nhiều nhất trong kỳ |
| Contact nguội cần cứu | table | Điểm cao trong quá khứ nhưng >30 ngày không tương tác — sort theo điểm cũ giảm dần |
| Loại hoạt động | chart pie | Phân bố activity theo type trong kỳ |

> Bảng "Contact nguội cần cứu" là bổ sung mới. Cơ chế phân rã điểm (-0.5/ngày) của hệ thống cũ làm điểm tự giảm, nhưng **không có gì cảnh báo** — nên quan hệ tốt bị mất đi âm thầm.

---

#### R8 — `data_quality` · Chất lượng dữ liệu
**Nguồn:** big number `Missing Assignee`, `Invalid Record` trên `Weekly Nurturing` + các view `Invalid` / `all failed`
**Tham số:** `scope`

| Section | Loại | Nội dung |
|---|---|---|
| Tổng quan | kpi_tiles | Số bản ghi có lỗi theo mức: blocking / error / warning |
| Theo object | chart bar | Số vấn đề theo account/contact/opportunity/contract |
| Theo loại vấn đề | table | Mã lỗi × số lượng × mô tả, có nút "Mở danh sách" |
| Theo người phụ trách | pivot | Hàng = người, cột = mức nghiêm trọng |
| Độ đầy đủ thông tin | chart bar | Phân bố `basicInfoQuality` của account và `infoQuality` của contact |
| Xu hướng | chart line | Số vấn đề theo tuần — **để biết đang tốt lên hay xấu đi** |

---

---

#### R9 — `collection_ar` · Công nợ và thu tiền
**Nguồn:** cột `DT dự kiến / DT xuất invoice / Invoice đã thanh toán` ở cuối sheet `Invoice Revenue` của file Excel — hiện đang là 3 ô ghi tay, chưa có báo cáo nào
**Tham số:** `periodType` · `period` · `accountId` (tuỳ chọn)
**Quyền:** `sales_admin`, `am`, `manager`, `bod`, `admin` · `bd` xem được phần của account mình phụ trách

| Section | Loại | Nội dung |
|---|---|---|
| Tổng quan công nợ | kpi_tiles | Đã xuất invoice · Đã thu · **Còn phải thu** · Quá hạn >45 ngày |
| Tuổi nợ (aging) | chart bar | Chia nhóm: 0-30 · 31-45 · 46-60 · 61-90 · >90 ngày |
| Chi tiết theo hợp đồng | table | Hợp đồng × tháng × số tiền × ngày xuất invoice × số ngày chờ × trạng thái |
| Theo công ty | table | Top account còn nợ nhiều nhất |
| Theo người phụ trách | pivot | Hàng = AM, cột = nhóm tuổi nợ — để biết ai cần đốc thúc khách |
| Tỷ lệ thu đúng hạn | chart line | % invoice thu được trong 30 ngày, theo tháng |
| **Chênh lệch báo vs đối soát** | kpi_tiles | "Báo đã thu" (`isPaid`) vs "Đã đối soát" (`reconciledAt`) — chênh lệch là số tiền đang chờ xác nhận. Chênh lệch lớn kéo dài = quy trình đối soát đang tắc |
| **Cần rà soát** | table | Các dòng bị job `detect-payment-anomaly` gắn cờ (xem 10.5.3), kèm lý do |

> **Vì sao cần báo cáo này:** hệ thống cũ theo dõi thu tiền bằng cách link record `Month` vào field `Paid Months`, và tính `Act Rev` bằng công thức khớp chuỗi. **Không có bất kỳ báo cáo tuổi nợ nào.** Với công ty ITO có hợp đồng ODC trả theo tháng, chậm thu 45 ngày trên nhiều hợp đồng cùng lúc là rủi ro dòng tiền thật.

---

### 11.10.4. Yêu cầu chung cho mọi báo cáo [MUST]

| # | Yêu cầu | Lý do |
|---|---|---|
| 1 | **Mọi con số phải click được** → mở view chứa các bản ghi tạo nên số đó | Không kiểm chứng được thì không ai tin |
| 2 | **Chân trang khai báo dữ liệu thiếu** — VD: "12 cơ hội chưa có giá trị ước tính, không được tính vào tổng" | Hệ thống cũ âm thầm bỏ qua bản ghi thiếu dữ liệu |
| 3 | **Ghi rõ thời điểm tính** và nút "Tính lại" | |
| 4 | **Xuất được PDF và Excel** | Để đưa vào tài liệu họp |
| 5 | **Lưu snapshot** khi bấm "Chốt số" — đóng băng để đối chiếu sau | Sửa dữ liệu cũ không được làm đổi báo cáo đã trình |
| 6 | **So sánh kỳ trước** mặc định bật | |
| 7 | Tôn trọng phân quyền — người dùng chỉ thấy phạm vi mình được xem | |
| 8 | Thời gian tải < 2 giây cho kỳ 1 năm | Đọc từ `kpi_snapshot`, không tính lại |

### 11.10.5. Lịch chạy tự động

| Báo cáo | Lịch | Gửi cho |
|---|---|---|
| R1 Funnel (tuần) | 07:00 thứ Hai | Toàn team, kèm trong Weekly Brief |
| R2 Tài chính (tháng) | 08:00 ngày 1 hàng tháng | manager, bod |
| R3 Forecast | 08:00 thứ Hai | manager, am |
| R4 BD Performance (tháng) | 08:00 ngày 1 | manager |
| R6 Win/Loss (quý) | 08:00 ngày đầu quý | manager, bod, am |
| R8 Chất lượng dữ liệu (tuần) | 07:00 thứ Hai | Mỗi người nhận phần của mình |

---

## 11.11. Bổ sung vào Sprint plan

Phần này thêm việc vào Phần 13. Cập nhật:

| Sprint | Bổ sung |
|---|---|
| **Sprint 2** | Seed view Account + Contact (11.3, 14.4). Hỗ trợ `dynamicValue` trong filter engine |
| **Sprint 3** | Seed view Opportunity + Contract + Pipeline (11.5-14.7). Bổ sung `viewType: kanban`. **Cột động `month.{year}.{month}`** đọc/ghi bảng con (cần cho W10, W11, W13) |
| **Sprint 4** | Seed view Activity (11.8) + **toàn bộ view họp tuần W1-W14** (11.9). Bổ sung `viewType: hierarchy` và `multiObject`. `ReportDefinition` + engine báo cáo. **R1, R2, R8** |
| **Sprint 5** | **R3, R4, R5, R9** |
| **Sprint 6** | **R6, R7** + section "✨ Nhận định AI" trong R6 |
| **Sprint 8** | Lịch chạy tự động + gửi email báo cáo |

**Field cần bổ sung vào schema Phần 3** (phát sinh từ file Excel):

```prisma
// opportunity — 3 cột đang dùng thật trong sheet Upsales Pipeline
progressNote  String?  @map("progress_note") @db.Text    // nhật ký tiến độ ngắn: "20/7: đã gửi function list"
winLossNote   String?  @map("win_loss_note") @db.Text    // "Breaking point: KH lo ngại communication"
techStack     String[] @default([]) @map("tech_stack")

// pipeline_entry — 2 cột từ sheet New Pipeline
expectedSignDate DateTime? @map("expected_sign_date") @db.Date
durationMonths   Int?      @map("duration_months")
```

**Ước lượng bổ sung:** khoảng **2 sprint** so với kế hoạch ban đầu (13.1). Phần lớn nằm ở: 2 kiểu view mới (`hierarchy`, `multiObject`), cột động theo tháng, và engine báo cáo có tham số.

**Tổng kết số lượng phải seed:**

| Hạng mục | Số lượng |
|---|---|
| View cho object (Account 8 + Contact 8 + Opportunity 9 + Contract 11 + Pipeline 5 + Activity 4) | **45** |
| View họp tuần (W1-W14) | **14** |
| Báo cáo dựng sẵn (R1-R9) | **9** |
| **Tổng** | **67 view + 9 báo cáo** |

So với HBG CRM: 71 view + 14 trang dashboard → **67 view + 9 báo cáo có tham số**. Ít hơn về số lượng nhưng **phủ nhiều chức năng hơn**, vì mỗi báo cáo thay được 2-7 trang dashboard cũ nhờ có bộ chọn kỳ, và các view cá nhân hoá bằng `CURRENT_USER` thay vì nhân bản theo tên người.
---

# 12. MIGRATION TỪ AIRTABLE

## 12.1. Nguồn dữ liệu

Base `appHFjw7QNsdwg46o` ("HBG CRM"), 10 bảng. Đọc qua Airtable REST API hoặc export CSV.

| Bảng Airtable | tableId | Số record | → Bảng Tomahawk |
|---|---|---|---|
| Account | `tbloL6CohHFD8Y9nC` | ~1.147 | `account` |
| Contact | `tblkPvRF8X6mp2OS6` | ~1.230 | `contact` |
| Opportunities | `tblHzDTslHFEqpfXF` | 198 | `opportunity` |
| Contracts | `tblrNj7ettwUdIcj9` | 62 | `contract` + `contract_month_revenue` |
| Account Pipeline 2026 | `tbl1RwOuXCMXpv5IZ` | 129 | `pipeline_entry` + `pipeline_month` |
| Offline Schedule MTG | `tblWLdEJh68P1Jp2d` | — | `activity` (type = `meeting_offline`) |
| Sales/BD + Presales | `tbl6hj2ftcTVhJLGN`, `tblbHcFuy2IfyQRVL` | — | `user` |
| Month, Month Pipeline 2026 | — | — | **KHÔNG migrate** — thay bằng aggregation |

## 12.2. Thứ tự migrate (bắt buộc theo đúng thứ tự này)

```
Bước 0: DỌN TAXONOMY THỦ CÔNG          ← làm TRƯỚC, trên chính Airtable hoặc file mapping
Bước 1: user, team
Bước 2: taxonomy (industry, tech_domain, country) — seed
Bước 3: account (chưa gắn owner)
Bước 4: gắn owner cho account
Bước 5: contact
Bước 6: opportunity
Bước 7: contract + contract_month_revenue
Bước 8: pipeline_entry + pipeline_month
Bước 9: activity (từ Offline MTG + parse các field richText log)
Bước 10: tính lại toàn bộ field computed
Bước 11: đối soát (mục 12.6)
```

## 12.3. Bước 0 — dọn taxonomy (việc của người, không phải máy)

⚠️ **Đây là bước quan trọng nhất và không được bỏ qua.** Nếu migrate nguyên trạng, mọi báo cáo theo ngành và mọi câu trả lời của chatbot về ngành đều sai.

**Việc cần làm:**

1. Xuất danh sách giá trị hiện có của `Account.Industry` (106 giá trị) ra file CSV.
2. Người hiểu nghiệp vụ ánh xạ từng giá trị về 19 mã chuẩn ở mục 3.3. File kết quả:
   ```csv
   airtable_value,tomahawk_code
   SI,si
   System Integrator,si
   EC,ecommerce_retail
   E-commerce,ecommerce_retail
   Ecommerce,ecommerce_retail
   ...
   Securevision,other          # tên công ty, không phải ngành
   ```
3. Làm tương tự cho `Country` (47 → ISO2):
   ```csv
   German,DE
   Germany,DE
   UK,GB
   England,GB
   turkey,TR
   qatar,QA
   "Croatia  ",HR
   " Cambodia",KH
   ho,NULL                     # rác, bỏ
   ```
4. Gộp 2 field `Development Centers` (9 giá trị) và `Development Center` (15 giá trị) thành một danh sách ISO2.
5. `Revenue`: bỏ 2 giá trị rác `1.6B` và `5B` (ánh xạ về `>1B`).

**Quy tắc bất di bất dịch:** giá trị không map được → `other` **và giữ nguyên bản gốc** vào `account.legacy_industry_raw` / `legacy_country_raw`. Không tự tạo mã mới, không đoán.

## 12.4. Mapping field chi tiết

### 12.4.1. Account

| Airtable | fieldId | Tomahawk | Ghi chú chuyển đổi |
|---|---|---|---|
| Company Name | `fldLEsTD8hLbmo8u1` | `companyName` | trim, gộp khoảng trắng |
| Is Watching | `fldxYtlvYCgH8nKs7` | `isWatching` | |
| Industry | `fldve7OHZtmtljNKQ` | `industryId` | **qua bảng mapping bước 0** |
| Special Domain | `fldNWbF9VmFIJFh9d` | `specialDomain` | |
| Size | `fldAVPHMeENP2xktM` | `sizeBand` | `501-1,000` → `501-1000` (bỏ dấu phẩy) |
| Country | `fldswdzS8bmk3qjUZ` | `countryId` | **qua bảng mapping bước 0** |
| Revenue | `fldZ0MhDtnbJEDAfS` | `revenueBand` | bỏ rác |
| Website / LinkedIn / Physical Address | | `website` / `linkedinUrl` / `physicalAddress` | chuẩn hoá URL |
| **Type** | `fldVono1SD5oSSgOR` | `dealSizeTier` | Mega→mega, Medium→medium, Small→small |
| — | | `icpType` | **KHÔNG có ở nguồn.** Để null; chạy AI enrichment sau |
| — | | `techDomainId` | **KHÔNG có ở nguồn.** Để null |
| Action Class | `fldROVSuD3t6hRY8j` | `actionCadence` | `Quaterly`→`quarterly` (sửa chính tả) |
| Potential | `fldyEBxK0P80jh54o` | `potential` | N/A→`na` |
| Rank (formula) | `fldc68R2Y8mvjY3o1` | **KHÔNG copy** | Tính lại bằng `computeAccountRank` |
| Year Found | `fldzYjFVqeafAL9x5` | `yearFounded` | |
| Fiscal year | `fldAHKRbONj30zyOU` | `fiscalYearEndMonth` | ⚠️ Kiểm tra ý nghĩa — có thể là năm, không phải tháng |
| NDA Sign Date | `fldoYeDCKdEAsFYPx` | `ndaSignedDate` | |
| First Contract | `fldpeFXFmSOaZlEUk` | `firstContractDate` | |
| Annual IT Budget | `fldKAaNR1wTO0e3u7` | `annualItBudget` + `currency='USD'` | |
| Development Ratio | `fldPJYfogjJdukA6u` | `developmentRatio` | |
| Development Centers + Development Center | 2 field | `devCenterCountries[]` | **gộp 2 field**, chuyển sang ISO2 |
| **Account Official Visit** | `fldlvQgB0M7B7OoOX` | → **tạo `activity`** | Tạo N activity `office_visit_to_client` với `scoreWeight` = giá trị đã tích luỹ. Xem 11.5 |
| **HBLAB Official Visit** | `fldkKDh5L6Fup5VMc` | → **tạo `activity`** | type `office_visit_from_client` |
| Investigated Info | `fldLwIG6wQmOEgMIJ` | `investigatedInfo` | HTML→markdown |
| **Plan & Activity** | `fldiuX1BzzG1amCx4` | `planNote` + **parse thành activity** | Giữ nguyên text, đồng thời parse dòng có ngày thành activity. Xem 11.5 |
| BD | `fldoJgvErFxGYQO8c` | `bdId` | map collaborator email → user.id |
| AM/Sales | `fldlG1T9zqgzjLjkr` | `ownerId` | |
| Summary from website | `fldM3drM7bsKIOjni` | `aiSummary` | giữ, đánh dấu cần refresh |
| 24 TCV / 25 TCV | | **KHÔNG copy** | Tính từ contract |
| Company Relationship (formula) | `fldmRa91mgYwo0Z8j` | **KHÔNG copy** | Tính lại |
| List Opps Old, Link nghiên cứu, Account Pipeline 2026 copy | | **KHÔNG migrate** | Field chết |
| (record id) | | `legacyAirtableId` | Bắt buộc, để đối soát |

### 12.4.2. Contact

| Airtable | Tomahawk | Ghi chú |
|---|---|---|
| Name / Title / Email / LinkedIn / Phone / Birthday | tương ứng | |
| Account (link) | `accountId` | qua `legacyAirtableId` |
| Channel | `channels[]` | `Whatapp`→`whatsapp` (sửa chính tả) |
| Source | `source` | `Company Referal`→`company_referral` |
| Objective | `objectives[]` | 6 giá trị map 1-1 |
| Assignee (link Sales/BD) | `assigneeId` | |
| Next Action Date | `nextActionDate` | |
| 1ST MTG Time | `firstMeetingAt` | + **tạo activity `is_first_meeting=true`** |
| **6 bộ đếm engagement** | → **tạo `activity`** | Xem 11.5 — quan trọng nhất |
| **Heartbeat** (chuỗi `\|`) | → **`contact_score_history`** | Parse chuỗi, mỗi giá trị = 1 dòng, ngày suy ra ngược từ `Heartbeat Last Update` lùi mỗi tuần |
| Interactions (richText) | → **parse thành activity** | Xem 11.5 |
| Summary Working History | `workingHistory` | |
| Investigated Info | `investigatedInfo` | |
| Score Relationship (formula) | **KHÔNG copy** | Tính lại từ activity |

### 12.4.3. Opportunity

| Airtable | Tomahawk | Ghi chú |
|---|---|---|
| Op name | `name` | |
| Account (link) | `accountId` | |
| Status | `status` | `Following`→`following`, `RFP, JD`→`rfp_jd`, `Proposed`→`proposed`, `Won deal, Running`→`won`, `Lost- close`→`lost` |
| Request Type | `engagementModel` | `ODC/Team Based`→`odc_team_based` |
| Action class | `actionClass` | `A Sales only`→`a_sales_only`, `A+ Presales action`→`a_plus_presales`, `C 3 month follow`→`c_quarterly`, `D Archive`→`d_archive`. ⚠️ Nguồn **không có B** |
| Owner (link) | `ownerId` | |
| Presales (link) | `opportunity_presales` | |
| Estimated value | `estimatedValue` + `currency='USD'` | |
| Win Rate | `winRate` | |
| Weighted Rev (formula) | **KHÔNG copy** | Tính lại |
| Created - Origin | `originCreatedDate` | |
| Next time Action / Deadline | `nextActionDate` / `deadline` | |
| Start/End Time Est | `estimatedStartDate` / `estimatedEndDate` | |
| **BANT-Budget/Authority/Need/Time** | `legacyBantBudget/Authority/Need/Time` | **Giữ nguyên, READ-ONLY** |
| — | 6 field MEDDIC | **KHÔNG suy từ BANT.** Để null. Xem cảnh báo bên dưới |
| Failed Factor | `lossReasons[]` | Map theo bảng: `Budget`→`budget_too_low`, `Authority`→`eb_no_access`, `A- Lack of Decision-making Power`→`eb_lack_decision_power`, `Need`→`need_poor_assessment`, `N- Misaligned Solutions`→`need_misaligned_solution`, `N- Poor Needs Assessment`→`need_poor_assessment`, `N- Decision Delay`→`process_decision_delay`, `N-Communication`→`need_communication`, `T- Project Delay`→`process_project_delay`, `Unknown`→`unknown` |
| Win Factor | `winFactors[]` | `BANT FIT`→`meddic_fit`, `Trusted Delivery`→`trusted_delivery`, `Company Close Relationship`→`company_relationship`, `Sales Close Relationship`→`sales_relationship` |
| Delivery | `deliveryUnits[]` | |
| BANT LoD Score | **KHÔNG copy** | Chạy AI qualification coach sau |
| Interactions | → parse thành activity | |

> ⚠️ **CẢNH BÁO QUAN TRỌNG VỀ BANT → MEDDIC:** BANT có 4 chiều, MEDDIC có 6. Hai chiều **Metrics** và **Champion** KHÔNG có tương đương trong dữ liệu cũ.
>
> **TUYỆT ĐỐI KHÔNG để AI "suy ra" giá trị Metrics/Champion từ text BANT cũ.** Việc đó tạo ra dữ liệu trông hợp lý nhưng vô căn cứ, và sau này không ai phân biệt được đâu là thật đâu là AI đoán. Để trống, và điền dần khi làm việc với khách.
>
> Ánh xạ gần đúng cho 4 chiều còn lại (chỉ để tham khảo khi sales tự điền, KHÔNG tự động copy):
> - `BANT-Budget` → gợi ý cho `meddicMetrics` (nhưng Metrics là tác động kinh doanh đo được, không phải ngân sách)
> - `BANT-Authority` → gợi ý cho `meddicEconomicBuyer` + `meddicDecisionProcess`
> - `BANT-Need` → gợi ý cho `meddicIdentifyPain` + `meddicDecisionCriteria`
> - `BANT-Time` → gợi ý cho `meddicDecisionProcess`

### 12.4.4. Contract — chuyển 12 cột thành bảng con

```typescript
// Với mỗi record Contract của Airtable
const MONTH_FIELDS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ⚠️ [DECIDE] Năm của 12 cột tháng KHÔNG được ghi ở đâu trong hệ thống cũ.
// Suy ra từ startDate; nếu hợp đồng kéo dài qua 2 năm thì phải kiểm tra thủ công.
const year = inferYear(airtableContract);

for (let m = 1; m <= 12; m++) {
  const amount = airtableContract[MONTH_FIELDS[m-1]];
  if (!amount || amount === 0) continue;

  // Airtable link các tháng qua TÊN record của bảng Month (chứa chuỗi "01".."12")
  const isInContractMonth = (airtableContract['Contract Month'] ?? [])
                              .some(name => name.includes(String(m).padStart(2,'0')));
  const isPaid     = (airtableContract['Paid Months'] ?? [])
                              .some(name => name.includes(String(m).padStart(2,'0')));
  const isInvoiced = (airtableContract['Invoiced Months'] ?? [])
                              .some(name => name.includes(String(m).padStart(2,'0')));

  await createContractMonthRevenue({
    contractId, year, month: m, amount,
    isPaid, paidAt: isPaid ? new Date(year, m-1, 28) : null,   // không có ngày chính xác ở nguồn
    isInvoiced,
    note: !isInContractMonth ? 'MIGRATE: có tiền nhưng tháng không nằm trong Contract Month' : null,
  });
}
```

⚠️ **Lỗi cần kiểm tra khi migrate:** hệ thống cũ tính `Month.TCV Rev` bằng `FIND("01", {Month}) * {TCV01} + ...`. Trong Airtable, `FIND()` trả về **vị trí ký tự**, không phải true/false — nên nếu tên record Month là `"2025-01"` thì `FIND("01", ...)` = 6, và công thức tính `6 × TCV01`. **Số liệu doanh thu theo tháng trong các báo cáo cũ có khả năng bị nhân sai hệ số.** Sau khi migrate phải đối soát lại với sổ kế toán, không dùng số của Airtable làm chuẩn.

### 12.4.5. Pipeline

```typescript
// Certainty → PipelineWeightClass
// ⚠️ Hai model không map 1:1 (cũ 5 mức 100/90/80/50/30%, mới 90/50/10%).
// [DECIDE] Bảng dưới là đề xuất, CẦN TÙNG DUYỆT trước khi chạy.
const CERTAINTY_MAP = {
  'Contracted': 'kt1',   // 100% → KT1 (90%)   ⚠️ mất 10% giá trị
  'Worstcase':  'kt1',   // 90%  → KT1 (90%)   ✓ khớp
  'Extend':     'kt1',   // 80%  → KT1 (90%)   ⚠️ tăng 10%
  'Forecast':   'kt2',   // 50%  → KT2 (50%)   ✓ khớp
  'Bestcase':   'kt3',   // 15%  → KT3 (10%)   ⚠️ giảm 5%
};
```

> **Nói rõ hệ quả để Tùng quyết:** với bảng map trên, tổng forecast sau migrate sẽ **khác** con số hiện tại. Hai lựa chọn:
> (a) Chấp nhận lệch, coi model KT là chuẩn mới từ nay.
> (b) Thêm 2 mức `kt1_plus` (100%) và `kt1_minus` (80%) để giữ nguyên số cũ.
> **Mặc định chọn (a)** — đơn giản hơn, và Tùng đã chốt dùng model KT.

**12 cột headcount → `pipeline_month`:** mỗi cột có giá trị > 0 tạo một dòng. **KHÔNG copy** 24 field `*Rev`/`*Full Rev` — tính lại (⚠️ nguồn có bug: `Mar Rev` dùng trọng số Bestcase 0.3 trong khi 11 tháng khác dùng 0.15).

**`Pipe Name` không có Account link:** giữ vào `placeholderName` (VD `"Thao unseen company"`).

## 12.5. Chuyển log văn bản thành Activity

Đây là phần khó nhất. Hệ thống cũ lưu lịch sử tương tác trong **7 field richText tự do**.

### 12.5.1. Từ bộ đếm sang activity

```typescript
/** 6 ô đếm của Contact → tạo activity tương ứng.
 *  ⚠️ Không có ngày chính xác ở nguồn. Dùng `contact.lastEngagedAt` làm mốc,
 *  rải ngược đều nhau, và ĐÁNH DẤU RÕ là dữ liệu migrate ước lượng. */
const COUNTER_TO_ACTIVITY = {
  'Eat/Coffee out side':          'social_meal',
  'Favor':                        'favor',
  'Ref Request':                  'referral_received',
  'Social Engagement':            'linkedin_engagement',
  'Educational Content Sharing':  'document_shared',
  'Personalized Interactions':    'gift_sent',
};

for (const [field, activityType] of Object.entries(COUNTER_TO_ACTIVITY)) {
  const count = contact[field] ?? 0;
  for (let i = 0; i < count; i++) {
    await createActivity({
      type: activityType,
      occurredAt: subDays(contact.lastEngagedAt ?? contact.createdAt, i * 30),  // ước lượng
      source: 'system',
      subject: `[Migrate] ${field}`,
      body: 'Bản ghi tạo từ dữ liệu đếm của hệ thống cũ — thời điểm là ước lượng',
      contactId, accountId: contact.accountId,
      userId: contact.assigneeId,
      countsForEngagement: true,
    });
  }
}
```

> **Vì sao vẫn nên làm dù ngày không chính xác:** điểm quan hệ (`relationshipScore`) tính từ activity. Nếu không tạo, mọi contact sẽ về gần 0 sau migrate và mất toàn bộ lịch sử tích luỹ quan hệ. Ngày ước lượng ảnh hưởng nhẹ tới phần phân rã theo thời gian, nhưng giữ được thứ hạng tương đối giữa các contact — đó mới là thứ quan trọng.

### 12.5.2. Parse richText log thành activity

```typescript
/** Convention của hệ thống cũ (ghi trong mô tả field):
 *  "Sử dụng mốc thời gian tuyệt đối... Các thông tin mới ghi ở trên đầu"
 *  Ví dụ thực tế: "05/21/2024 đã email lại cho khách hàng về chuyến đi Úc, chờ khách phản hồi"
 *                 "20/7: Đã gửi function list, đang đợi KH confirm"
 *                 "23/6 KH chưa phản hồi..."
 */
const DATE_PATTERNS = [
  /^(\d{1,2})\/(\d{1,2})\/(\d{4})/,     // 05/21/2024 — ⚠️ có thể là MM/DD hoặc DD/MM
  /^(\d{1,2})\/(\d{1,2})[:\s]/,          // 20/7:  → DD/MM, năm suy từ ngữ cảnh
  /^(\d{4})-(\d{2})-(\d{2})/,            // 2024-05-21
];

function parseInteractionLog(text: string, ctx): ParsedEntry[] {
  const lines = htmlToPlainText(text).split('\n').filter(l => l.trim());
  const entries = [];
  let current = null;

  for (const line of lines) {
    const dateMatch = matchAnyDatePattern(line);
    if (dateMatch) {
      if (current) entries.push(current);
      current = { occurredAt: dateMatch.date, body: line.slice(dateMatch.length).trim(),
                  dateAmbiguous: dateMatch.ambiguous };
    } else if (current) {
      current.body += '\n' + line;      // dòng tiếp theo thuộc entry hiện tại
    } else {
      // Đoạn đầu không có ngày → gom vào 1 activity "ghi chú không rõ thời điểm"
      current = { occurredAt: null, body: line, dateAmbiguous: true };
    }
  }
  if (current) entries.push(current);
  return entries;
}
```

**Quy tắc xử lý:**

| Tình huống | Xử lý |
|---|---|
| Parse được ngày rõ ràng | Tạo activity `type='note'`, `source='system'`, `occurredAt` = ngày parse |
| Ngày mơ hồ (`05/21/2024` — MM/DD hay DD/MM?) | Nếu số đầu > 12 → chắc chắn DD/MM. Nếu số sau > 12 → MM/DD. Nếu cả hai ≤ 12 → **mặc định DD/MM** (convention Việt Nam) và đánh dấu `dateAmbiguous` |
| Không parse được ngày | Tạo **một** activity duy nhất `occurredAt = record.createdAt`, body = toàn bộ text, subject = `[Migrate] Ghi chú chưa phân tách được` |
| Đoạn có 🤖 (AI tóm tắt cũ) | Giữ nguyên, đánh dấu `source='ai_extracted'` |

⚠️ **BẮT BUỘC: giữ nguyên text gốc** trong `account.planNote` / `contact.investigatedInfo`, **không xoá sau khi parse**. Parse là để AI dùng được; text gốc là nguồn sự thật để đối chiếu khi parse sai.

### 12.5.3. Offline Schedule MTG → Activity

| Airtable | Tomahawk |
|---|---|
| MTG Time GMT+8 | `occurredAt` — **⚠️ chuyển từ `Asia/Hong_Kong` sang UTC** |
| MTG End Time GMT+8 | `meetingEndAt` |
| MTG Address | `meetingAddress` |
| Note - Message | `body` |
| Status | `meetingStatus` (`Archived`→`archived`) |
| Contact (link) | `contactId` |
| Participant | `participantUserIds[]` |
| — | `type = 'meeting_offline'` |

## 12.6. Đối soát sau migrate — bắt buộc

Script `npm run migrate:verify` kiểm tra và **fail nếu không đạt**:

| # | Kiểm tra | Ngưỡng chấp nhận |
|---|---|---|
| 1 | Số lượng record từng bảng khớp nguồn | Chênh lệch = 0 |
| 2 | Không có record nào mất `legacyAirtableId` | 0 record |
| 3 | Mọi Account có `industryId` hoặc `legacyIndustryRaw` | 100% |
| 4 | Tổng TCV của contract khớp tổng 12 cột tháng của nguồn | Chênh < $1 |
| 5 | Số Opportunity theo từng status khớp nguồn | Chênh = 0 |
| 6 | Mọi Contact có `accountId` (trừ nhóm `return_to_mkt`) | ≥ 95% |
| 7 | `computeAccountRank` cho ra cùng kết quả với cột `Rank` của Airtable | **≥ 98%** — lệch nhiều hơn nghĩa là hiểu sai công thức |
| 8 | Tổng `pipeline_month.headcount` khớp tổng 12 cột nguồn | Chênh = 0 |
| 9 | Số activity tạo ra ≥ tổng 6 bộ đếm + số record Offline MTG | ≥ |
| 10 | Không có FK mồ côi | 0 |
| 11 | Không có `contract_month_revenue` nằm ngoài thời hạn hợp đồng | báo cáo danh sách, không fail |

**Báo cáo migrate** (`migration-report.md`) phải liệt kê: số record mỗi bảng, giá trị taxonomy không map được (kèm số lượng), record có `dateAmbiguous`, contract có tháng ngoài thời hạn, chênh lệch Rank.

## 12.7. Chiến lược cắt chuyển

```
Tuần 1: Migrate lần 1 lên môi trường staging. Chạy đối soát. Sửa mapping.
Tuần 2: Migrate lần 2. 3 người dùng chính test song song (nhập cả 2 hệ thống).
Tuần 3: Migrate lần 3 (delta từ Airtable). Toàn team dùng Tomahawk, Airtable read-only.
Tuần 4: Airtable đóng băng hoàn toàn. Giữ 6 tháng để tra cứu.
```

---

# 13. ACCEPTANCE CRITERIA

## 13.1. Grid — yêu cầu cốt lõi

```gherkin
Feature: Sửa dữ liệu trực tiếp trong bảng

  Scenario: Sửa một ô không cần mở record
    Given tôi đang ở màn hình danh sách Công ty
    When tôi click đúp vào ô "Potential" của dòng "Fujifilm"
    Then ô chuyển sang chế độ sửa với dropdown mở sẵn
    And KHÔNG có modal hay trang chi tiết nào được mở
    When tôi chọn "High" và nhấn Enter
    Then giá trị hiển thị ngay lập tức (dưới 50ms)
    And ô "Rank" của cùng dòng tự cập nhật thành "A" và nhấp nháy
    And con trỏ nhảy xuống ô cùng cột ở dòng dưới

  Scenario: Sửa ô bị lỗi mạng
    Given tôi vừa sửa ô "Potential" thành "High"
    When request thất bại
    Then ô quay lại giá trị cũ
    And hiện thông báo lỗi kèm nút "Thử lại"

  Scenario: Người khác sửa cùng lúc
    Given tôi đang xem dòng "Fujifilm"
    When Dory sửa ô "Owner" của dòng đó
    Then ô "Owner" nhấp nháy 1 giây kèm nhãn "Dory"
    And KHÔNG có popup nào hiện lên
    And trang KHÔNG reload

Feature: Ghi nhớ trạng thái view

  Scenario: Khôi phục đúng trạng thái lần trước
    Given tôi mở view "Tier A" của Công ty
    And tôi kéo cột "Tên công ty" rộng thành 280px
    And tôi ẩn cột "Fiscal year"
    And tôi gập nhóm "Small"
    When tôi chuyển sang màn hình Cơ hội rồi quay lại Công ty
    Then view "Tier A" được mở lại
    And cột "Tên công ty" rộng 280px
    And cột "Fiscal year" vẫn ẩn
    And nhóm "Small" vẫn gập
    And KHÔNG có màn hình chọn view nào ở giữa

  Scenario: Trạng thái riêng theo từng người
    Given Mike đặt độ rộng cột "Tên" = 280px trên view chung "Tất cả"
    When Dory mở view "Tất cả"
    Then Dory thấy độ rộng mặc định, không bị ảnh hưởng bởi Mike

  Scenario: Admin thêm cột mới vào view chung
    Given tôi đã ẩn 5 cột trên view chung "Tất cả"
    When admin thêm cột "ICP Type" vào view đó
    Then cột "ICP Type" HIỆN với tôi kèm nhãn "mới"
    And 5 cột tôi ẩn vẫn ẩn

Feature: Copy-paste với Excel

  Scenario: Dán từ Excel vào grid
    Given tôi copy 3 dòng × 2 cột từ Excel
    When tôi chọn ô đầu tiên trong grid và nhấn Ctrl+V
    Then hiện hộp xác nhận "Sẽ cập nhật 6 ô"
    When tôi xác nhận
    Then 6 ô được cập nhật
    And ô nào không hợp lệ thì tô đỏ và KHÔNG được ghi

Feature: Hiệu năng
  Scenario: Cuộn bảng lớn
    Given bảng có 50.000 dòng và 25 cột
    When tôi cuộn nhanh
    Then frame rate không dưới 55fps
    And bộ nhớ trình duyệt không vượt 300MB
```

## 13.2. Business logic

```gherkin
Feature: Xếp hạng Account

  Scenario Outline: Ma trận rank
    Given account có potential "<potential>" và tier "<tier>"
    And account đã có ít nhất 1 first meeting
    When hệ thống tính rank
    Then rank là "<rank>"
    Examples:
      | potential | tier   | rank |
      | high      | mega   | a    |
      | high      | small  | a    |
      | middle    | mega   | a    |
      | middle    | small  | b    |
      | low       | mega   | b    |
      | low       | small  | c    |
      | zero      | mega   | c    |
      | na        | mega   | not_ranked |

  Scenario: Chưa chạm thì không xếp hạng
    Given account có potential "high" và tier "mega"
    But account chưa có first meeting, chưa có NDA, chưa có opportunity
    Then rank là "not_ranked"

Feature: Cổng chuyển Presales

  Scenario: Chặn khi chưa đủ MEDDIC
    Given cơ hội chỉ điền 2/6 chiều MEDDIC
    When tôi bấm "Chuyển cho Presales"
    Then hệ thống từ chối
    And hiện rõ đang thiếu chiều nào

  Scenario: Cho qua khi đủ
    Given cơ hội đã điền 4/6 chiều, trong đó có Identify Pain và Economic Buyer
    And mỗi chiều có ít nhất 30 ký tự
    When tôi bấm "Chuyển cho Presales"
    Then được phép
    And readyForPresales = true

Feature: Điểm quan hệ

  Scenario: Ghi nhận hoạt động làm tăng điểm
    Given contact "Nelson" có điểm 45
    When tôi ghi nhận hoạt động "Khách giới thiệu khách khác"
    Then điểm tăng thêm 150 (trước khi trừ phân rã)

  Scenario: Điểm giảm theo thời gian
    Given contact có điểm 100 hôm nay, không có hoạt động mới
    When 30 ngày trôi qua
    Then điểm còn khoảng 85 (giảm 0.5/ngày)

Feature: Phân biệt ba loại doanh thu

  Scenario: Doanh số ký tính theo ngày ký
    Given hợp đồng ký 05/08/2026, tổng giá trị $120.000, trải đều 12 tháng từ 09/2026
    When tôi xem "Doanh số ký" tuần 03-09/08/2026
    Then kết quả là $120.000

  Scenario: Doanh thu thuộc kỳ tính theo tháng phân bổ
    Given cùng hợp đồng trên
    When tôi xem "Doanh thu thuộc kỳ" tháng 08/2026
    Then kết quả là $0
    When tôi xem "Doanh thu thuộc kỳ" tháng 09/2026
    Then kết quả là $10.000
```

## 13.3. AI

```gherkin
Feature: Chatbot truy vấn

  Scenario: Trả lời kèm bằng chứng
    When tôi hỏi "tuần này team đạt bao nhiêu % KPI meeting"
    Then câu trả lời có con số cụ thể
    And có khối "Nguồn số liệu" ghi rõ số bản ghi, khoảng thời gian, phạm vi
    And có nút "Mở thành view"
    When tôi bấm "Mở thành view"
    Then grid mở ra đúng các hoạt động tạo nên con số đó

  Scenario: Hỏi lại khi mơ hồ
    When tôi hỏi "doanh thu tháng này bao nhiêu"
    Then AI KHÔNG trả lời ngay bằng một con số
    And AI hỏi lại kèm 3 lựa chọn: Doanh số ký / Doanh thu thuộc kỳ / Tiền đã thu

  Scenario: Tôn trọng phân quyền
    Given tôi có vai trò "bd"
    When tôi hỏi "tổng doanh thu hợp đồng năm nay"
    Then AI trả lời trong phạm vi tôi được xem
    And nói rõ kết quả bị giới hạn theo quyền, KHÔNG nói là dữ liệu không tồn tại

  Scenario: Không tự tính nhẩm
    When tôi hỏi "tuần này tăng bao nhiêu % so với tuần trước"
    Then hệ thống ghi nhận có gọi tool compare_periods
    And KHÔNG có phép tính nào do LLM tự thực hiện

Feature: Ghi dữ liệu bằng AI

  Scenario: Bắt buộc xác nhận
    When tôi nói "chuyển deal Fujifilm sang Proposed"
    Then AI KHÔNG ghi ngay
    And hiện bảng so sánh giá trị hiện tại vs đề xuất
    And có nút Huỷ / Sửa / Xác nhận
    When tôi bấm Xác nhận
    Then dữ liệu được ghi
    And có bản ghi audit với actorType = "ai" và lý do đề xuất

  Scenario: Không tự đóng deal
    Given có email từ khách nói "chúng tôi chọn nhà cung cấp khác"
    When AI xử lý email đó
    Then AI ĐỀ XUẤT chuyển sang Lost
    And KHÔNG tự động chuyển

  Scenario: Chặn sửa hàng loạt quá lớn
    When tôi nói "đánh dấu tất cả cơ hội quá 90 ngày là Lost" và có 47 bản ghi khớp
    Then AI từ chối vì vượt giới hạn 20 bản ghi
    And đề xuất cách khác (lọc hẹp hơn, hoặc làm thủ công)
```

## 13.4. Phân quyền

```gherkin
Scenario: BD không xem được hợp đồng
  Given tôi có vai trò "bd"
  When tôi gọi GET /api/v1/contracts
  Then kết quả rỗng
  And KHÔNG phải lỗi 500

Scenario: Không thể lách bằng filter của view
  Given tôi có vai trò "bd"
  And tồn tại view chung "Tất cả hợp đồng"
  When tôi mở view đó
  Then tôi không thấy hợp đồng nào
  And phân quyền được áp ở tầng truy vấn, không phải tầng view

Scenario: Ẩn field theo quyền
  Given tôi có vai trò "bd"
  When tôi xem chi tiết một Account
  Then response KHÔNG chứa field "annualItBudget"

Scenario: Sales Admin sở hữu khâu thu tiền
  Given tôi có vai trò "sales_admin"
  When tôi mở view "Chưa thu tiền"
  Then tôi thấy TẤT CẢ hợp đồng chưa thu, không giới hạn theo người phụ trách
  When tôi click đánh dấu "đã thu" trên một tháng
  Then dữ liệu được ghi ngay
  And có bản ghi audit log với actorId là tôi

Scenario: AM và BD đều cập nhật được thu tiền
  Given tôi có vai trò "am"
  When tôi đánh dấu "đã thu" cho một tháng hợp đồng
  Then dữ liệu được ghi ngay
  And hệ thống lưu paidById = tôi và paidMarkedAt = bây giờ
  And bảng hiện avatar + tên tôi ngay cạnh cờ đó

Scenario: BD chỉ thấy hợp đồng của account mình phụ trách
  Given tôi có vai trò "bd" và phụ trách account "Belive"
  When tôi mở mục Hợp đồng
  Then tôi thấy hợp đồng của Belive
  But KHÔNG thấy hợp đồng của account người khác phụ trách
  When tôi đánh dấu "đã thu" cho hợp đồng Belive
  Then thao tác thành công

Scenario: Chỉ Sales Admin đối soát được
  Given một dòng đã được AM đánh dấu "đã thu" nhưng chưa đối soát
  When tôi có vai trò "am" và mở dòng đó
  Then nút "Đối soát" ở trạng thái vô hiệu
  When tôi có vai trò "sales_admin"
  Then nút "Đối soát" bấm được
  And sau khi bấm, reconciledById = tôi

Scenario: Báo cáo tài chính chỉ tính dòng đã đối soát
  Given có $50.000 được đánh dấu "đã thu" nhưng chưa đối soát
  And có $30.000 đã đối soát
  When tôi xem báo cáo "Tiền đã thu" của kỳ
  Then kết quả là $30.000
  And có chú thích "$50.000 đang chờ đối soát, chưa tính vào"

Scenario: Sales Admin không sửa được dữ liệu bán hàng
  Given tôi có vai trò "sales_admin"
  When tôi mở một Opportunity
  Then tôi xem được toàn bộ thông tin
  But không sửa được bất kỳ field nào
  When tôi gọi PATCH /api/v1/opportunities/{id}
  Then nhận lỗi 403 FORBIDDEN

Scenario: BOD sửa được dữ liệu
  Given tôi có vai trò "bod"
  When tôi sửa trường "Potential" của một Account
  Then thao tác thành công
  And audit log ghi actorType="user", actorId là tôi, role="bod"
```

---

# 14. THỨ TỰ BUILD

## 14.1. Sprint plan (2 tuần/sprint, giả định 2-3 dev)

### Sprint 1 — Nền móng + benchmark grid
```
[ ] Dựng monorepo, Docker Compose (Postgres 16 + pgvector, Redis)
[ ] Prisma schema đầy đủ Phần 3, migration chạy được
[ ] Seed: taxonomy (industry 19, tech domain 12, country ~35),
    pipeline_weight_config, engagement_weight_config, rag_threshold_config
[ ] Auth: login/refresh/me, JWT, bcrypt
[ ] ScopedPrismaService + PermissionGuard (Phần 10) — LÀM NGAY, KHÔNG ĐỂ SAU
[ ] CRUD API cho account + contact
[ ] ⚠️ BENCHMARK GRID: dựng POC react-data-grid với 50.000 dòng × 25 cột,
    đo 6 chỉ số ở mục 7.5. Nếu không đạt → đổi Glide Data Grid NGAY sprint này
Đầu ra: đăng nhập được, gọi API được, đã chốt thư viện grid
```

### Sprint 2 — Grid hoạt động đầy đủ
```
[ ] DataGrid: virtualize, inline edit, resize cột, reorder, ghim cột
[ ] Toàn bộ cell type (Phần 6.1.5)
[ ] Điều hướng bàn phím + chọn vùng + copy-paste TSV
[ ] View system: CRUD view, user-state, GET /views/last
[ ] FilterPanel + SortPanel + GroupPanel + ColumnPanel
[ ] SummaryBar
Đầu ra: dùng được như một bảng tính trên dữ liệu Account/Contact
```

### Sprint 3 — Đủ 4 object nghiệp vụ
```
[ ] Opportunity: CRUD, 6 field MEDDIC, cổng presales (4.9)
[ ] Contract + contract_month_revenue + materialized view
[ ] Pipeline entry + pipeline_month, grid 12 cột tháng
[ ] Toàn bộ formula Phần 4 + unit test
[ ] Validation engine + hiển thị cảnh báo trong ô
[ ] Record side panel
Đầu ra: thay được hoàn toàn phần nhập liệu của Airtable
```

### Sprint 4 — Activity + KPI + Họp tuần
```
[ ] Activity: CRUD, timeline theo account/contact/opportunity
[ ] Job tính relationshipScore + contact_score_history
[ ] KPI target + snapshot + job tính
[ ] Màn hình KPI (6.4)
[ ] Weekly Cockpit (6.3) + action item
[ ] Job carry-over
Đầu ra: thay được file Excel KPI
```

### Sprint 5 — Đồng bộ email + AI enrichment
```
[ ] OAuth Google + Microsoft
[ ] Email sync incremental + thuật toán khớp contact
[ ] Calendar sync
[ ] AI Company Enrichment (8.6.1)
[ ] AI Signal Watcher (8.6.2) + màn hình signal
[ ] AI Activity Summarizer (8.6.4)
[ ] Màn hình /settings/jobs (dead-letter queue, chạy lại)
Đầu ra: activity tự sinh, AI có dữ liệu để làm việc
```

### Sprint 6 — Chatbot
```
[ ] Tool registry (8.4) + semantic layer + business glossary
[ ] Chat API (SSE streaming)
[ ] AI Chat panel (6.6) — CHỈ ĐỌC trước
[ ] Khối "Nguồn số liệu" + nút "Mở thành view"
[ ] ask_clarification
[ ] AI MEDDIC Coach (8.6.3)
[ ] AI Weekly Brief (8.6.5)
[ ] Dashboard đo chất lượng AI (8.8)
Đầu ra: hỏi được dữ liệu bằng tiếng Việt
```

### Sprint 7 — AI ghi dữ liệu + migration
```
[ ] Proposal system (8.7): preview diff, confirm, undo 24h
[ ] Phân cấp quyền ghi + chặn sửa hàng loạt
[ ] Script migration đầy đủ (Phần 12)
[ ] Script đối soát (11.6)
[ ] Migrate lần 1 lên staging
Đầu ra: dữ liệu thật đã ở trong hệ thống
```

### Sprint 8 — Hoàn thiện + cắt chuyển
```
[ ] Command palette ⌘K
[ ] Trang chủ
[ ] Xuất CSV/Excel
[ ] Notification + realtime WebSocket
[ ] Audit log + partition
[ ] i18n vi/en
[ ] Chạy toàn bộ acceptance test Phần 13
[ ] Migrate lần 2, 3 + cắt chuyển
```

## 14.2. Thứ tự trong một sprint (cho AI agent code)

```
1. Prisma schema + migration        → chạy `prisma migrate dev`, kiểm tra DB
2. Seed data                        → chạy `npm run seed`, kiểm tra bằng psql
3. Shared types + Zod schema        → build packages/shared
4. Formula + unit test              → `npm test`, phải xanh 100% trước khi đi tiếp
5. Service layer + test tích hợp
6. Controller + OpenAPI
7. Sinh API client cho FE
8. UI component (không gắn dữ liệu) + Storybook
9. Gắn dữ liệu vào UI
10. Test E2E (Playwright)
```

## 14.3. Definition of Done

Một tính năng chỉ được coi là xong khi:
- [ ] Có unit test cho mọi business logic, coverage > 80%
- [ ] Có test tích hợp cho mọi API endpoint
- [ ] Có test E2E cho luồng chính
- [ ] Đã kiểm tra phân quyền cho **mọi** vai trò (không chỉ admin)
- [ ] Có xử lý loading + error + empty state ở UI
- [ ] Đạt các ngưỡng hiệu năng ở mục 7.5
- [ ] Có bản dịch vi + en
- [ ] Có bản ghi audit log cho thao tác ghi
- [ ] Không có `PrismaClient` được import trực tiếp ngoài `jobs/` và `migration/`

---

---

# 15. KIỂM TOÁN TRIẾT LÝ AIRTABLE — VÀ CÁC PHẦN BỔ SUNG BẮT BUỘC

> **Vì sao có phần này:** PRD từ Phần 1-14 đặc tả một **ứng dụng CRM có schema cố định**. Airtable không phải ứng dụng — nó là **nền tảng**. Nếu build đúng Phần 1-14, sản phẩm sẽ chạy tốt, đúng nghiệp vụ, nhưng người dùng HBG CRM sẽ **cảm thấy bị trói tay** trong tuần thứ hai, khi họ muốn thêm một cột mà không thêm được.
>
> Phần này kiểm toán lại toàn bộ theo 12 nguyên tắc + 10 cạm bẫy, và bổ sung 5 hạng mục còn thiếu.

## 15.1. Bảng kiểm toán

### A. Mười hai nguyên tắc nên copy

| # | Nguyên tắc | Trạng thái | Ở đâu / Thiếu gì |
|---|---|---|---|
| **A1** | Vỏ spreadsheet, ruột database | ✅ **Đạt** | Grid là màn hình chính (6.1); record panel không che hết grid (6.2); không có "record detail page" làm nơi làm việc chính |
| **A2** | Inline editing là điều kiện tiên quyết | ✅ **Đạt** | 6.1.4 (17 hành vi bắt buộc), 7.3 (luồng sửa ô), 13.1 (acceptance) |
| **A3** | View là entity hạng nhất | 🟡 **Gần đạt** | Có bảng `view` + 3 chế độ personal/shared/locked + state theo user (3.12). **Thiếu: form view và gallery view** — Airtable có 8 loại, PRD mới có 6 |
| **A4** | Linked record + lookup + rollup là trung tâm; mọi phép tính quan hệ phải là **CỘT nhìn thấy được** | ❌ **KHÔNG ĐẠT** | PRD thay rollup bằng materialized view và cột computed **do lập trình viên định nghĩa**. **Người dùng không tự tạo được rollup/lookup/formula.** Đây là gap nghiêm trọng nhất |
| **A5** | Thêm field trong 5 giây, không migration | ❌ **KHÔNG ĐẠT** | PRD dùng Prisma schema cố định. Mục 2.4 ghi rõ schema động là `[LATER]`. Muốn thêm 1 cột phải sửa code + migration + deploy |
| **A6** | Field description = semantic layer cho người và AI | 🟡 **Gần đạt** | Có `FieldSemantics` với `description` + `aiHint` + `exampleValues` (8.2). **Thiếu: chưa đặc tả hiển thị description khi hover header cột trong grid** — tức là phần "cho người" chưa có UI |
| **A7** | Kiến trúc hai tầng: workspace (power user) + interface (end user) | ❌ **KHÔNG ĐẠT** | PRD **không có khái niệm interface/page**. Mọi người dùng cùng làm việc trên một bộ grid. Không có cách nào để manager dựng một trang gọn cho người mới hoặc cho BOD |
| **A8** | AI sinh CẤU HÌNH, không sinh CODE | 🟡 **Gần đạt** | Tool registry chặt (8.4), có `create_view`. **Nhưng AI chỉ tạo được view** — chưa tạo được field, report, automation. Nguyên tắc đúng nhưng phạm vi hẹp |
| **A9** | AI apps, not chat interfaces | ✅ **Đạt** | 8.6: AI cell, brief card, MEDDIC coach, weekly brief — AI sống trong grid, không chỉ ở sidebar |
| **A10** | Agent permission-aware | ✅ **Đạt** | 10.4 — AI dùng chung `ScopedPrismaService`, có lint rule chặn |
| **A11** | Optimistic update + LWW cấp field, không CRDT | ✅ **Đạt** | 7.3 optimistic + rollback + 409 conflict dialog |
| **A12** | Tách object attribute khỏi list attribute (Attio) | 🟡 **Một phần** | `pipeline_entry` có `fiscalYear` nên không phải tạo bảng mới mỗi năm (tốt hơn Airtable). **Nhưng chưa có khái niệm "list" tổng quát** — không đặt được một Account vào nhiều pipeline/chiến dịch với stage khác nhau |

### B. Mười cạm bẫy phải tránh

| # | Cạm bẫy | Trạng thái | Ghi chú |
|---|---|---|---|
| **B1** | Kế thừa "không validation" | ✅ **Đạt** | 4.8: 3 mức blocking/error/warning, cảnh báo mềm trong ô, có `fixAction` |
| **B2** | Thiếu activity timeline + email sync | ✅ **Đạt** | Bảng `activity` (3.10) + sync (9.3), xếp P0 |
| **B3** | Thiết kế giới hạn theo "base" | ✅ **Đạt** | Postgres-native, activity partition được |
| **B4** | Automation "hết quota là chết cả workspace" | 🟡 **Một phần** | Có DLQ + retry + màn hình giám sát (9.2) — **nhưng chỉ cho job do dev viết. Người dùng KHÔNG tự dựng được automation.** HBG CRM tự dựng 4 cái |
| **B5** | View filter bị nhầm là bảo mật | ✅ **Đạt** | 10.3 RLS ở tầng query + lint rule |
| **B6** | Phụ thuộc revision history nền tảng | ✅ **Đạt** | `audit_log` append-only, partition theo tháng, giữ vô thời hạn |
| **B7** | Giao một canvas trắng | ✅ **Đạt** | Phần 11: 63 view + 8 báo cáo dựng sẵn |
| **B8** | Bỏ qua khoảng trống analytics | ✅ **Đạt** | 8 báo cáo có tham số + drill-down |
| **B9** | Bất cẩn với license | ✅ **Đạt** | 2.3: chỉ MIT/Apache, cảnh báo AGPL |
| **B10** | Đánh giá thấp chi phí grid | ✅ **Đạt** | Benchmark bắt buộc Sprint 1 |

**Kết quả: 14/22 đạt · 5 gần đạt · 3 không đạt.**

## 15.2. Chẩn đoán gốc rễ

Ba mục không đạt (**A4, A5, A7**) và hai mục yếu (**A8, B4**) đều xuất phát từ **một quyết định duy nhất mà tôi đã đưa ra ngầm, không nêu ra để bàn**: chọn Prisma schema cố định thay vì metadata-driven schema.

Quyết định đó tối ưu cho **tốc độ build**, nhưng đánh đổi đúng thứ làm nên "cảm giác Airtable":

| Người dùng HBG CRM hôm nay làm được | Với PRD Phần 1-14 |
|---|---|
| Thêm cột `Tech Stack` vào Account trong 5 giây | Phải mở ticket cho dev, chờ deploy |
| Tạo rollup "Tổng TCV của account này" bằng 3 cú click | Phải nhờ dev viết SQL + migration |
| Viết formula `IF(Potential="High", "Ưu tiên", "")` | Không làm được |
| Tự dựng automation "mỗi thứ Hai gửi email danh sách quá hạn" | Không làm được |
| Dựng một trang gọn cho BOD chỉ xem 5 chỉ số | Không làm được |

**Bằng chứng cho thấy đây không phải nhu cầu giả định:** trong HBG CRM có **~20 field lookup, ~10 field rollup, 12 field formula do chính đội tự tạo**, cộng 71 view và 4 automation. Đó là dấu vết của việc người dùng liên tục tự mở rộng hệ thống — thứ mà bản PRD hiện tại chặn lại.

> **Nói thẳng:** nếu giao Phần 1-14 cho dev và bỏ Phần 15, sản phẩm sẽ tốt hơn Airtable ở validation, email sync, phân quyền và báo cáo — nhưng **tệ hơn hẳn ở thứ khiến đội yêu thích HBG CRM**. Rủi ro rất thực: sau 2 tháng, đội quay lại mở Excel bên cạnh để làm những việc Tomahawk không cho làm.

## 15.3. Năm hạng mục bổ sung — xếp theo bằng chứng sử dụng thực tế

Ưu tiên dựa trên **số lượng thứ đội đã tự tạo trong HBG CRM**, không dựa trên cảm tính:

| Hạng mục | Bằng chứng dùng thật | Ưu tiên |
|---|---|---|
| **15.4 — Custom field engine** | Schema Account tiến hoá liên tục (có field ghi "hết Q2 2024 sẽ xoá", "không dùng từ 03/2025") | **P0** |
| **15.5 — Lookup / Rollup / Formula do người dùng tạo** | ~20 lookup + ~10 rollup + 12 formula tự tạo | **P0** |
| **15.6 — Form view + tooltip mô tả field** | 0 form trong base, nhưng field description được dùng rất kỹ | **P1** |
| **15.7 — Page (kiến trúc hai tầng)** | 2 interface, 14 trang, 334 element | **P1** |
| **15.8 — Automation builder** | Dựng 4 cái nhưng **chưa từng deploy cái nào** | **P2** |

> Automation builder xếp P2 dù nó là cạm bẫy B4, vì bằng chứng cho thấy đội **đã thử và bỏ dở** — nhu cầu có thật nhưng không cấp bách bằng 4 hạng mục trên. Trong khi đó, phần lớn giá trị của automation cũ (heartbeat, signal watcher, auto-link tháng, tính forecast) **đã được PRD thay bằng job hệ thống chạy sẵn** ở Phần 9.

---

## 15.4. Custom Field Engine — sửa A5

### 15.4.1. Mô hình lai: cột thật cho field hệ thống, JSONB cho field tuỳ biến

```prisma
model FieldDefinition {
  id          String   @id @default(uuid(7))
  objectType  String   @map("object_type")     // 'account'|'contact'|'opportunity'|...
  key         String                            // snake_case, unique trong object
  labelVi     String   @map("label_vi")
  labelEn     String   @map("label_en")
  fieldType   FieldType @map("field_type")

  /** true  = cột thật trong bảng (field hệ thống, không xoá được, có index)
   *  false = lưu trong cột custom_fields jsonb */
  isSystem    Boolean  @default(false) @map("is_system")
  /** Khi field custom được dùng nhiều để lọc/sắp xếp, admin bấm "Tối ưu"
   *  → job tạo cột thật + expression index, cờ này bật lên */
  isPromoted  Boolean  @default(false) @map("is_promoted")

  config      Json     @default("{}")           // tuỳ fieldType, xem 15.4.3
  descriptionVi String? @map("description_vi") @db.Text
  aiHint      String?  @map("ai_hint") @db.Text
  exampleValues String[] @default([]) @map("example_values")
  synonymsVi  String[] @default([]) @map("synonyms_vi")

  isRequired  Boolean  @default(false) @map("is_required")
  requiredWhen Json?   @map("required_when")    // conditional required, xem 4.8
  sensitiveLevel String @default("internal") @map("sensitive_level")
  visibleToRoles String[] @default([]) @map("visible_to_roles")   // rỗng = mọi vai trò
  editableByRoles String[] @default([]) @map("editable_by_roles")

  sortOrder   Int      @default(0) @map("sort_order")
  isActive    Boolean  @default(true) @map("is_active")
  deprecatedNote String? @map("deprecated_note")   // "hết Q2/2026 sẽ xoá" — pattern của HBG CRM

  createdById String?  @map("created_by_id")
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt   DateTime @updatedAt @map("updated_at") @db.Timestamptz

  @@unique([objectType, key])
  @@index([objectType, isActive])
  @@map("field_definition")
}

enum FieldType {
  TEXT LONG_TEXT NUMBER CURRENCY PERCENT DURATION
  DATE DATE_TIME CHECKBOX
  SINGLE_SELECT MULTI_SELECT
  USER MULTI_USER
  RELATION                    // linked record
  ATTACHMENT URL EMAIL PHONE
  FORMULA LOOKUP ROLLUP COUNT // 4 loại tính toán, xem 15.5
  AI_TEXT                     // sinh bằng prompt
  RATING BARCODE
}
```

**Mọi bảng nghiệp vụ thêm một cột:**
```prisma
// thêm vào account, contact, opportunity, contract, pipeline_entry, activity
customFields Json @default("{}") @map("custom_fields")
```
```sql
CREATE INDEX account_custom_fields_gin ON account USING gin (custom_fields jsonb_path_ops);
```

### 15.4.2. Vì sao chọn mô hình lai thay vì thuần metadata-driven

| | Cột thật (`ALTER TABLE`) | JSONB | **Lai (chọn)** |
|---|---|---|---|
| Tốc độ thêm field | chậm (DDL + lock) | **tức thì** | tức thì cho field custom |
| Hiệu năng lọc/sắp xếp | **tốt** | kém hơn | tốt cho ~80% field hệ thống |
| Độ phức tạp code | cao | **thấp** | trung bình |
| Rủi ro migration | có | **không** | thấp |

Với ~15 người dùng và ~12 object, mô hình lai cho **95% lợi ích của metadata-driven với 30% công sức**. Cơ chế "Tối ưu" (`isPromoted`) xử lý trường hợp một field custom trở nên quan trọng: job chạy `ALTER TABLE ADD COLUMN` + backfill + expression index, người dùng không thấy gì thay đổi.

### 15.4.3. Cấu hình theo từng loại field

```typescript
type FieldConfig =
  | { type: 'TEXT' }
  | { type: 'NUMBER'; precision: number; allowNegative: boolean }
  | { type: 'CURRENCY'; precision: number; currencyCode: string }
  | { type: 'PERCENT'; precision: number; displayAsBar: boolean }
  | { type: 'DATE'; dateFormat: 'local'|'iso'|'friendly'; includeTime: boolean; timezone?: string }
  | { type: 'SINGLE_SELECT'|'MULTI_SELECT';
      choices: Array<{ id: string; value: string; labelVi: string; color: string; sortOrder: number }>;
      allowUserToAddChoice: boolean }     // ⚠️ mặc định FALSE — xem cảnh báo bên dưới
  | { type: 'RELATION'; targetObject: string; allowMultiple: boolean;
      inverseFieldKey?: string;            // tự tạo field ngược, giống Airtable
      filterCondition?: FilterGroup }
  | { type: 'FORMULA'; expression: string; resultType: FieldType }
  | { type: 'LOOKUP'; viaFieldKey: string; targetFieldKey: string; filterCondition?: FilterGroup }
  | { type: 'ROLLUP'; viaFieldKey: string; targetFieldKey: string;
      fn: RollupFn; filterCondition?: FilterGroup; resultType: FieldType }
  | { type: 'COUNT'; viaFieldKey: string; filterCondition?: FilterGroup }
  | { type: 'AI_TEXT'; prompt: string; inputFieldKeys: string[]; model: 'cheap'|'strong';
      autoRefresh: 'never'|'on_change'|'weekly'|'monthly' }
```

> ⚠️ **`allowUserToAddChoice` mặc định `false` là quyết định có chủ đích.** Đây chính xác là cơ chế đã làm `Industry` của HBG CRM phình lên 106 giá trị với 11 nhóm trùng nghĩa. Người dùng vẫn thêm được lựa chọn mới, nhưng phải qua màn hình quản lý field (có hiển thị danh sách hiện có + cảnh báo giá trị gần giống bằng trigram), **không phải gõ tự do ngay trong ô**.

### 15.4.4. Luồng thêm field — phải đạt "5 giây"

```
1. Trong grid, click nút [+] ở cuối hàng header
2. Panel trượt ra:
   ┌─ Thêm trường mới ────────────────────┐
   │ Tên       [Tech Stack            ]   │
   │ Loại      [Nhiều lựa chọn      ▾]   │
   │ ┌─ Lựa chọn ────────────────────┐    │
   │ │ Java      [🔵] [🗑]           │    │
   │ │ .NET      [🟢] [🗑]           │    │
   │ │ [+ Thêm]                      │    │
   │ └───────────────────────────────┘    │
   │ ▸ Nâng cao (mô tả, bắt buộc, quyền)  │
   │                    [Huỷ]  [Tạo]      │
   └──────────────────────────────────────┘
3. Bấm Tạo → cột xuất hiện NGAY trong grid, có thể nhập liệu luôn
4. Không reload trang. Không chờ deploy.
```

**Ràng buộc kỹ thuật [MUST]:** thời gian từ lúc bấm "Tạo" tới lúc cột dùng được **< 1 giây**. Với JSONB thì chỉ là một `INSERT` vào `field_definition` + invalidate cache schema.

### 15.4.5. API

```
GET    /api/v1/fields?objectType=account       Danh sách field (gồm cả hệ thống và custom)
POST   /api/v1/fields                           Tạo field mới
PATCH  /api/v1/fields/{id}                      Sửa (đổi tên/mô tả/lựa chọn — KHÔNG đổi được fieldType)
DELETE /api/v1/fields/{id}                      Soft delete (isActive=false, dữ liệu giữ 90 ngày)
POST   /api/v1/fields/{id}/promote               Chuyển JSONB → cột thật (admin)
GET    /api/v1/fields/{id}/usage                 Field đang được dùng ở view/report/formula nào

// Chặn xoá field đang được tham chiếu
DELETE trả 409 nếu field đang dùng trong: view filter/sort, formula khác, report, automation
→ { error: { code:'FIELD_IN_USE', details:{ views:[...], formulas:[...], reports:[...] } } }
```

---

## 15.5. Lookup / Rollup / Formula do người dùng tạo — sửa A4

Đây là hạng mục quan trọng nhất của Phần 15. Nguyên tắc A4 nói: *"Mọi phép tính quan hệ phải được vật chất hoá thành một cột tồn tại vật lý trong bảng — nhìn thấy được, chạm được, sửa được — không phải một query ẩn."*

### 15.5.1. Rollup

**UI tạo rollup (3 bước, giống Airtable):**
```
┌─ Trường Rollup ──────────────────────────┐
│ Tên     [Tổng giá trị cơ hội         ]   │
│                                           │
│ 1. Qua liên kết  [Cơ hội (Opportunity)▾] │
│ 2. Lấy trường    [Giá trị ước tính    ▾] │
│ 3. Hàm tổng hợp  [SUM — Tổng          ▾] │
│                                           │
│ ▸ Chỉ tính các bản ghi thoả điều kiện     │
│   [Trạng thái] [không phải] [Lost]  [🗑]  │
│                                           │
│ Xem trước: Fujifilm HK → $82,000          │
│                    [Huỷ]  [Tạo]           │
└───────────────────────────────────────────┘
```

**Hàm rollup phải hỗ trợ (theo đúng bộ của Airtable):**
```typescript
type RollupFn =
  // số học
  | 'SUM' | 'AVERAGE' | 'MIN' | 'MAX'
  // đếm
  | 'COUNT'        // đếm giá trị không rỗng
  | 'COUNTA'       // đếm tất cả
  | 'COUNTALL'     // đếm cả phần tử trong mảng
  | 'COUNT_UNIQUE'
  // mảng
  | 'ARRAY_UNIQUE' | 'ARRAY_JOIN' | 'ARRAY_COMPACT'
  // logic
  | 'AND' | 'OR' | 'XOR'
  // chuỗi
  | 'CONCATENATE'
  // ngày
  | 'EARLIEST' | 'LATEST';
```

**Triển khai:** sinh SQL từ định nghĩa, KHÔNG dùng chuỗi ghép tay.
```typescript
function buildRollupSql(def: RollupConfig, ctx: SchemaContext): SqlFragment {
  const rel = ctx.getRelation(def.viaFieldKey);       // biết bảng đích + khoá ngoại
  const target = ctx.getField(rel.targetObject, def.targetFieldKey);
  const where = def.filterCondition
    ? buildWhereClause(def.filterCondition, rel.targetObject)
    : sql`TRUE`;

  return sql`(
    SELECT ${rollupAggregate(def.fn, target)}
    FROM ${sql.identifier(rel.targetTable)} t
    WHERE t.${sql.identifier(rel.foreignKey)} = base.id
      AND t.deleted_at IS NULL
      AND ${where}
  )`;
}
```

**Chiến lược tính:**

| Trường hợp | Cách tính | Lý do |
|---|---|---|
| Rollup trên quan hệ nhỏ (< 100 bản ghi con) | Sub-select ngay trong query đọc | Đơn giản, luôn đúng |
| Rollup trên quan hệ lớn hoặc dùng trong filter/sort | Cột materialized + job cập nhật khi bản ghi con đổi | Cần index để lọc/sắp xếp |
| Rollup lồng rollup (chuỗi nhiều tầng) | Tính theo thứ tự topo, phát hiện vòng lặp | HBG CRM có chuỗi 3 tầng: `Contract.TCV → Opp.TCV → Account.25 TCV` |

⚠️ **Bắt buộc phát hiện vòng lặp:** khi tạo formula/rollup, dựng đồ thị phụ thuộc và kiểm tra chu trình. Nếu có → từ chối với thông báo chỉ rõ vòng lặp.

### 15.5.2. Lookup

Đơn giản hơn rollup: kéo giá trị từ bảng liên kết về, có thể lọc. HBG CRM dùng rất nhiều (Contact có 11 lookup từ Account). Cùng cơ chế sinh SQL, `fn` cố định là `ARRAY_UNIQUE` khi quan hệ nhiều, hoặc lấy giá trị đơn khi quan hệ một-một.

### 15.5.3. Formula — cần bộ đánh giá biểu thức an toàn

⚠️ **TUYỆT ĐỐI KHÔNG dùng `eval()` hoặc `new Function()`.** Đây là lỗ hổng thực thi mã từ xa.

**Kiến trúc:** parser → AST → validator (kiểm kiểu + tham chiếu field + vòng lặp) → biên dịch sang SQL expression HOẶC đánh giá trong sandbox.

```typescript
// packages/shared/src/formula/
├── lexer.ts        // tách token
├── parser.ts       // AST
├── validator.ts    // kiểm kiểu, tham chiếu, vòng lặp
├── sqlCompiler.ts  // AST → SQL (cho filter/sort/tính hàng loạt)
├── jsEvaluator.ts  // AST → giá trị (cho xem trước tức thì ở client)
└── functions.ts    // thư viện hàm
```

**Thư viện hàm bắt buộc — bám sát Airtable để người dùng cũ không phải học lại:**

| Nhóm | Hàm |
|---|---|
| Logic | `IF` `AND` `OR` `NOT` `XOR` `SWITCH` `BLANK` `ERROR` `IS_ERROR` |
| Số | `SUM` `AVERAGE` `MIN` `MAX` `ROUND` `ROUNDUP` `ROUNDDOWN` `CEILING` `FLOOR` `ABS` `MOD` `POWER` `SQRT` `INT` `VALUE` |
| Chuỗi | `CONCATENATE` `&` `LEFT` `RIGHT` `MID` `LEN` `LOWER` `UPPER` `TRIM` `SUBSTITUTE` `REPLACE` `FIND` `SEARCH` `REPT` `T` |
| Ngày | `TODAY` `NOW` `DATETIME_DIFF` `DATETIME_FORMAT` `DATEADD` `DATETIME_PARSE` `YEAR` `MONTH` `DAY` `HOUR` `WEEKDAY` `WEEKNUM` `WORKDAY` `WORKDAY_DIFF` `IS_BEFORE` `IS_AFTER` `IS_SAME` |
| Mảng | `ARRAYJOIN` `ARRAYUNIQUE` `ARRAYCOMPACT` `ARRAYFLATTEN` `COUNTA` `COUNTALL` |
| Bản ghi | `RECORD_ID` `CREATED_TIME` `LAST_MODIFIED_TIME` |

> **Ghi chú tương thích:** bộ hàm trên cho phép **copy nguyên văn** phần lớn formula của HBG CRM sang Tomahawk. Ví dụ `Account.Rank`, `Contact.Validator`, `Opportunity.Meeting Category` chạy được gần như không sửa. Đây là lợi ích lớn khi migrate: đội không phải học lại cú pháp.

**Trình soạn formula [MUST]:**
```
┌─ Trường Formula ─────────────────────────────────────┐
│ Tên  [Mức ưu tiên                              ]     │
│ ┌──────────────────────────────────────────────┐     │
│ │ IF(                                          │     │
│ │   AND({Rank} = "A", {Potential} = "High"),   │     │
│ │   "🔴 Ưu tiên cao",                          │     │
│ │   IF({Rank} = "A", "🟡 Ưu tiên", "")         │     │
│ │ )                                            │     │
│ └──────────────────────────────────────────────┘     │
│ ✅ Cú pháp hợp lệ · Kiểu kết quả: Văn bản            │
│                                                       │
│ Xem trước trên 3 bản ghi đầu:                        │
│   Fujifilm HK  → 🔴 Ưu tiên cao                      │
│   Belive       → 🟡 Ưu tiên                          │
│   ScienTec     → (rỗng)                              │
│                                                       │
│ 💡 Gõ { để chèn tên trường · Ctrl+Space gợi ý hàm    │
│                          [Huỷ]  [Lưu]                 │
└───────────────────────────────────────────────────────┘
```
Bắt buộc có: autocomplete tên field khi gõ `{`, autocomplete hàm, kiểm tra cú pháp real-time, **xem trước kết quả trên bản ghi thật**, và tooltip mô tả từng hàm bằng tiếng Việt.

### 15.5.4. AI hỗ trợ viết formula

Bổ sung tool vào registry (8.4):
```typescript
{
  name: 'propose_field',
  description: 'Đề xuất tạo trường mới (gồm cả formula/rollup/lookup) từ mô tả bằng lời.',
  input_schema: { type:'object', properties:{
    objectType:{enum:[...]}, labelVi:{type:'string'},
    fieldType:{enum:[...]}, config:{type:'object'}, reason:{type:'string'} },
    required:['objectType','labelVi','fieldType','config','reason'] },
}
```

Ví dụ luồng: người dùng gõ *"tạo cho tôi cột đánh dấu account nào có doanh thu năm nay trên 100 nghìn đô"* → AI đề xuất field ROLLUP + FORMULA kèm xem trước → người dùng xác nhận.

Đây chính là hiện thực hoá nguyên tắc **A8 (AI sinh cấu hình, không sinh code)** ở phạm vi rộng hơn: AI tạo được field, view, report — nhưng chỉ bằng cách lắp ráp các primitive đã kiểm chứng, không bao giờ sinh SQL hay JS tự do.

---

## 15.6. Form view và tooltip mô tả field — sửa A3 và A6

### 15.6.1. Form view

Bổ sung `ViewType.FORM`. Dùng cho: tạo bản ghi có kiểm soát (bắt buộc điền đủ), nhập liệu cho người không quen grid, và thu thập thông tin từ người ngoài (link chia sẻ).

```typescript
// ViewConfig bổ sung
form: z.object({
  titleVi: z.string(),
  descriptionVi: z.string().optional(),
  fields: z.array(z.object({
    key: z.string(),
    required: z.boolean().default(false),
    helpTextVi: z.string().optional(),
    defaultValue: z.any().optional(),
    showWhen: FilterCondition.optional(),      // hiện field có điều kiện
  })),
  submitButtonLabelVi: z.string().default('Gửi'),
  afterSubmit: z.enum(['show_message','new_form','redirect']).default('show_message'),
  successMessageVi: z.string().optional(),
  allowPublicShare: z.boolean().default(false),
  publicShareToken: z.string().optional(),
}).optional(),
```

**Ba form seed sẵn:**

| key | Object | Dùng khi |
|---|---|---|
| `form_new_account` | account | Tạo công ty mới — bắt buộc: tên, website, quốc gia, owner. Có nút "✨ Tự điền bằng AI" từ website |
| `form_new_contact` | contact | Tạo liên hệ — bắt buộc: tên, công ty, chức danh, nguồn, mục tiêu, người phụ trách |
| `form_log_activity` | activity | Ghi nhận nhanh tương tác — **1 click chọn loại, 1 ô ghi chú, xong**. Đây là form quan trọng nhất |

> **Lý do `form_log_activity` quan trọng:** Phần 3.10 nói điểm quan hệ tính tự động từ activity. Nhưng một số loại (giúp đỡ khách, được giới thiệu, đi ăn) **máy không tự biết** — vẫn phải người ghi. Nếu bắt mở form 5 field thì sẽ không ai ghi, và toàn bộ mô hình điểm quan hệ sụp đổ. Form này phải **nhanh hơn 5 giây**.

### 15.6.2. Tooltip mô tả field ở mọi nơi [MUST]

Đây là phần "cho người" của nguyên tắc A6, chưa được đặc tả ở Phần 8.2.

| Vị trí | Hành vi |
|---|---|
| Header cột trong grid | Hover 500ms → tooltip hiện `labelVi` + `descriptionVi` + `exampleValues` |
| Nhãn field trong record panel | Icon ⓘ cạnh nhãn, click hiện popover |
| Field trong form | `helpTextVi` hiện luôn dưới ô nhập, không cần hover |
| Field computed | Tooltip thêm: công thức (dạng đọc được, không phải field ID) + thời điểm tính + nút "Tính lại" |
| Field AI | Tooltip thêm: prompt đã dùng + độ tin cậy + nguồn |

> **Đây là thứ HBG CRM làm xuất sắc nhất và tuyệt đối không được để mất.** Mô tả field `Contact.Objective` dài hơn 200 từ, dạy cả cách chọn mục tiêu — một sales mới học nghiệp vụ ngay trong lúc nhập liệu. Migration phải **chép nguyên văn** mọi field description từ Airtable sang `field_definition.descriptionVi`.

**Bổ sung vào Phần 12 (migration):**
```typescript
// Bước bổ sung: chép mô tả field
for (const table of airtableTables) {
  for (const field of table.fields) {
    if (!field.description) continue;
    await updateFieldDefinition({
      objectType: mapTable(table.id),
      key: mapField(field.id),
      descriptionVi: field.description,     // CHÉP NGUYÊN VĂN, không tóm tắt
    });
  }
}
```

---

## 15.7. Page — kiến trúc hai tầng, sửa A7

### 15.7.1. Mô hình

```prisma
model Page {
  id          String   @id @default(uuid(7))
  key         String   @unique
  nameVi      String   @map("name_vi")
  nameEn      String   @map("name_en")
  icon        String?
  groupName   String?  @map("group_name")        // gom nhóm trong sidebar
  layout      Json                                // PageBlock[]
  visibleToRoles String[] @default([]) @map("visible_to_roles")
  isSystem    Boolean  @default(false) @map("is_system")
  sortOrder   Int      @default(0) @map("sort_order")
  createdById String?  @map("created_by_id")
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt   DateTime @updatedAt @map("updated_at") @db.Timestamptz
  @@map("page")
}
```

```typescript
type PageBlock =
  | { type: 'grid';       viewKey: string; height: 'auto'|'fixed'; maxRows?: number; allowEdit: boolean }
  | { type: 'kpi_tiles';  metrics: KpiMetric[]; scope: KpiScopeType; periodType: KpiPeriodType }
  | { type: 'chart';      query: ReportQuery; visualization: ChartConfig }
  | { type: 'report';     reportKey: string; parameters?: Record<string, unknown> }
  | { type: 'text';       contentMd: string }
  | { type: 'form';       viewKey: string }
  | { type: 'record_detail'; objectType: string; recordIdSource: 'url_param'|'fixed'; recordId?: string }
  | { type: 'button';     labelVi: string; action: 'open_page'|'open_url'|'open_form'|'run_ai'; target: string };
```

### 15.7.2. Quy tắc phân quyền [MUST]

> **Page chỉ THU HẸP quyền, không bao giờ NỚI RỘNG.**
>
> Nếu người dùng không có quyền sửa `contract.tcv` ở tầng object, thì đặt block grid của Contract lên page **cũng không cho họ sửa**. Kiểm tra quyền luôn diễn ra ở `ScopedPrismaService`, page chỉ là lớp trình bày.

Implement: block `grid` với `allowEdit: true` chỉ có nghĩa "cho phép sửa **nếu** người dùng vốn có quyền" — không phải "cấp quyền sửa".

### 15.7.3. Page seed sẵn

| key | Tên | Dành cho | Nội dung |
|---|---|---|---|
| `page_home` | Trang chủ | tất cả | Việc hôm nay · KPI của tôi · Tín hiệu mới · Cần chú ý (đã đặc tả ở 6.8) |
| `page_weekly_meeting` | Họp tuần | tất cả | 7 tab W1-W14 (đã đặc tả ở 6.3, 11.9) |
| `page_bod` | Bảng điều hành | `bod`, `manager` | **MỚI** — 6 KPI tile + 3 chart + 1 grid rút gọn (BOD nay sửa được nên vẫn cần grid, nhưng chỉ hiện cột quan trọng) |
| `page_sales_admin` | Hợp đồng & Thu tiền | `sales_admin`, `manager`, `bod`, `admin` | **MỚI** — bàn làm việc của vai trò `sales_admin`. Xem 15.7.4 |
| `page_onboarding` | Bắt đầu | tất cả | **MỚI** — trang hướng dẫn cho người mới: giải thích 5 khái niệm cốt lõi, link tới các view chính, form tạo bản ghi đầu tiên |

> Ba trang này chưa có trong PRD gốc nhưng giải quyết đúng bài toán mà Interface của Airtable sinh ra để giải: **không phải ai cũng cần và cũng muốn làm việc trong grid, và mỗi vai trò có một bàn làm việc khác nhau.**

### 15.7.4. `page_sales_admin` — bàn làm việc của Sales Admin

Vai trò `sales_admin` không bán hàng — họ vận hành vòng đời tài chính sau khi deal Won. Trang này là nơi họ ở cả ngày.

```
┌───────────────────────────────────────────────────────────────────────────┐
│ HỢP ĐỒNG & THU TIỀN                          Tháng 08/2026  [◀] [▶]      │
├───────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐         │
│ │CẦN XUẤT      ││ĐÃ XUẤT       ││ĐÃ THU        ││QUÁ HẠN >45N  │         │
│ │  7 tháng HĐ  ││  $122.800    ││  $98.400     ││  $24.400  🔴 │         │
│ │  $54.500     ││              ││  80%         ││  3 hợp đồng  │         │
│ └──────────────┘└──────────────┘└──────────────┘└──────────────┘         │
├───────────────────────────────────────────────────────────────────────────┤
│ 📄 CẦN XUẤT INVOICE (view contract_to_invoice)                            │
│  Hợp đồng          Công ty      Tháng   Số tiền   [Đánh dấu đã xuất]      │
│  HĐ Belive Q3      Belive       08/2026 $12.600   [✓]                     │
│  HĐ Telemax ODC    Telemax      08/2026 $13.500   [✓]                     │
├───────────────────────────────────────────────────────────────────────────┤
│ 💰 CHƯA THU TIỀN (view contract_unpaid)                                   │
│  Hợp đồng          Tháng   Số tiền   Xuất ngày  Chờ    [Đánh dấu đã thu]  │
│  HĐ Ascentis       06/2026 $6.100    28/06      52n 🔴 [✓]                │
│  HĐ Meeco          07/2026 $5.600    30/07      21n    [✓]                │
├───────────────────────────────────────────────────────────────────────────┤
│ 📊 TUỔI NỢ                        │  ⚠️ HỢP ĐỒNG CẦN CHÚ Ý                │
│  [biểu đồ cột theo nhóm ngày]     │  • 2 HĐ sắp hết hạn trong 30 ngày     │
│                                    │  • 1 HĐ thiếu ngày ký                 │
└───────────────────────────────────────────────────────────────────────────┘
```

**Bốn yêu cầu bắt buộc [MUST]:**

1. **Đánh dấu đã xuất / đã thu bằng 1 click ngay trên bảng** — không mở modal, không chuyển trang. Nếu thu một phần thì click vào ô số tiền để sửa `paidAmount`.
2. **Hiện avatar + tên người đánh dấu ngay cạnh mỗi cờ**, không giấu trong audit log. Vì `bd`/`am`/`sales_admin` đều đánh dấu được, minh bạch tại chỗ là cơ chế kiểm soát chính (xem 10.5.1).
3. **Thêm khối "Cần đối soát"** — các dòng `isPaid = true` nhưng chưa có `reconciledAt`, kèm cột "ai báo" và "báo lúc nào". Đây là công việc riêng của `sales_admin` mà `bd`/`am` không làm thay được.
4. **Mỗi thao tác ghi audit log** với `actorId`.

**Khối bổ sung trên trang:**
```
├───────────────────────────────────────────────────────────────────────────┤
│ ✅ CẦN ĐỐI SOÁT (5)                    (view contract_need_reconcile)     │
│  Hợp đồng       Tháng   Số tiền   Ai báo đã thu   Báo lúc  [Đối soát]     │
│  HĐ Belive      07/2026 $12.600   👤 Quyên        2 ngày   [✓]            │
│  HĐ GameLocker  07/2026 $10.000   👤 Tùng         5 ngày   [✓]            │
│  ⚠️ HĐ Meeco    07/2026  $5.600   👤 Dương        1 ngày   [✓] cần rà     │
│     └ Lý do: đánh dấu đã thu nhưng chưa từng xuất invoice                 │
├───────────────────────────────────────────────────────────────────────────┤
```

> **Vì sao giữ bước đối soát dù đã mở quyền:** mở quyền giải quyết bài toán *tốc độ* (không phải chờ một người), bước đối soát giải quyết bài toán *độ tin cậy của con số lên báo cáo*. Hai việc khác nhau, không thay thế nhau. Nếu bỏ bước đối soát, báo cáo `collected_revenue` sẽ phản ánh "người bán nói đã thu" chứ không phải "kế toán xác nhận đã thu".

---

## 15.8. Automation Builder — sửa B4 (ưu tiên P2)

### 15.8.1. Mô hình

```prisma
model AutomationRule {
  id          String   @id @default(uuid(7))
  nameVi      String   @map("name_vi")
  descriptionVi String? @map("description_vi")
  isEnabled   Boolean  @default(false) @map("is_enabled")
  trigger     Json                          // AutomationTrigger
  conditions  Json?                         // FilterGroup
  actions     Json                          // AutomationAction[]
  version     Int      @default(1)
  lastRunAt   DateTime? @map("last_run_at") @db.Timestamptz
  runCount    Int      @default(0) @map("run_count")
  failCount   Int      @default(0) @map("fail_count")
  createdById String   @map("created_by_id")
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz
  @@map("automation_rule")
}

model AutomationRun {
  id           String   @id @default(uuid(7))
  ruleId       String   @map("rule_id")
  ruleVersion  Int      @map("rule_version")
  status       String                        // 'success'|'failed'|'skipped'
  triggeredBy  Json     @map("triggered_by")  // {objectType, recordId} hoặc {schedule}
  actionResults Json    @map("action_results")
  errorMessage String?  @map("error_message") @db.Text
  durationMs   Int      @map("duration_ms")
  startedAt    DateTime @map("started_at") @db.Timestamptz
  @@index([ruleId, startedAt(sort: Desc)])
  @@map("automation_run")
}
```

```typescript
type AutomationTrigger =
  | { type: 'record_created';  objectType: string }
  | { type: 'record_updated';  objectType: string; watchFields?: string[] }
  | { type: 'record_matches';  objectType: string; conditions: FilterGroup }  // vào/ra khỏi điều kiện
  | { type: 'schedule';        cron: string; timezone: string }
  | { type: 'field_date';      objectType: string; dateField: string; offsetDays: number }  // "3 ngày trước deadline"
  | { type: 'manual';          buttonLabelVi: string };

type AutomationAction =
  | { type: 'update_record';   objectType: string; target: 'trigger'|'found'; changes: Record<string, unknown> }
  | { type: 'create_record';   objectType: string; values: Record<string, unknown> }
  | { type: 'find_records';    objectType: string; filters: FilterGroup; limit: number }
  | { type: 'send_notification'; to: 'owner'|'assignee'|'user'|'role'; userId?: string; messageVi: string }
  | { type: 'send_email';      to: string[]; subject: string; bodyHtml: string }
  | { type: 'create_action_item'; title: string; assignee: 'owner'|'user'; userId?: string; dueInDays: number }
  | { type: 'run_ai';          promptTemplate: string; inputFields: string[]; outputField: string }
  | { type: 'call_webhook';    url: string; method: 'POST'|'PUT'; payloadTemplate: Json };
```

### 15.8.2. Khắc phục đúng các lỗi của Airtable

| Lỗi của Airtable (cạm bẫy B4) | Tomahawk giải quyết |
|---|---|
| Hết quota → dừng toàn workspace | Không có quota. Giới hạn theo tốc độ (rate limit) mỗi rule, suy giảm mềm |
| Một run bị đếm kể cả khi fail hoặc không làm gì | `automation_run` ghi rõ `success`/`failed`/`skipped` |
| Không có retry cấu hình được | Retry + exponential backoff qua BullMQ, cấu hình được mỗi action |
| Không có dead-letter queue | Có, kèm màn hình `/settings/automations/failed` |
| Không có version control | `version` + lưu `ruleVersion` trong mỗi run → biết run nào chạy bản nào |
| Không có môi trường test | Nút **"Chạy thử"** — thực thi trên 1 bản ghi ở chế độ khô, hiện diff sẽ ghi mà **không ghi thật** |
| Không cảnh báo trong app | Rule fail 3 lần liên tiếp → tự tắt + thông báo cho người tạo và admin |

> ⚠️ **Bài học trực tiếp từ HBG CRM:** script `Calculate All Certainty Rev 2026` gọi `getView("All")` — view không tồn tại → throw ngay dòng 2 → **chưa từng chạy lần nào, không ai biết**. Nút "Chạy thử" bắt buộc, cộng cơ chế tự tắt sau 3 lần fail, chính là để lỗi kiểu này không lặp lại.

### 15.8.3. Automation seed sẵn (thay 4 automation cũ)

| key | Trigger | Nội dung | Tương ứng cái cũ |
|---|---|---|---|
| `auto_score_snapshot` | schedule thứ Hai 03:00 | Ghi `contact_score_history` | `Heartbeat Update` |
| `auto_signal_watch` | schedule thứ Hai 06:00 | AI quét tin tức account đang watch | `Social Listener` |
| `auto_stale_opportunity` | schedule hằng ngày 08:00 | Cơ hội >90 ngày không hoạt động → thông báo owner + tạo action item | rule "quá 3 tháng → Lost" chưa từng enforce |
| `auto_overdue_reminder` | schedule hằng ngày 08:00 | Contact/opportunity quá hạn → thông báo người phụ trách | mới |
| `auto_payment_overdue` | schedule hằng ngày | Invoice >45 ngày chưa thu → thông báo owner + manager | mới |
| `auto_deadline_warning` | field_date, `deadline`, -7 ngày | Cảnh báo trước deadline 7 ngày | từ logic `Meeting Category` |

Tất cả để `isEnabled = true` sẵn, người dùng tắt/sửa được.

---

## 15.9. Ảnh hưởng tới kế hoạch

### 15.9.1. Cập nhật sprint plan

| Sprint | Bổ sung từ Phần 15 |
|---|---|
| **Sprint 2** | `field_definition` + custom field JSONB + API field. Tooltip mô tả field ở grid header (15.6.2) |
| **Sprint 3** | **Formula engine** (lexer/parser/validator/compiler + thư viện hàm) — hạng mục nặng nhất. Trình soạn formula có xem trước |
| **Sprint 4** | Lookup + Rollup + Count do người dùng tạo (15.5.1-15.5.2). Phát hiện vòng lặp phụ thuộc |
| **Sprint 5** | Form view + 3 form seed (15.6.1). Page engine + 5 page seed (15.7) |
| **Sprint 6** | Tool `propose_field` cho AI (15.5.4) |
| **Sprint 7** | Automation builder + 6 automation seed (15.8) |

**Ước lượng: +3 sprint** (từ 8 lên 11 sprint). Trong đó **formula engine chiếm gần 1 sprint** — đây là hạng mục dễ bị đánh giá thấp nhất sau data grid.

### 15.9.2. Nếu buộc phải cắt giảm

Nếu timeline không cho phép +3 sprint, thứ tự cắt **từ dưới lên**:

| Cắt gì | Hậu quả | Chấp nhận được? |
|---|---|---|
| Automation builder (15.8) | Người dùng không tự dựng được automation. Nhưng 6 automation seed đã phủ nhu cầu đã biết, và bằng chứng cho thấy đội chưa từng deploy được cái nào | ✅ **Cắt được** — lùi v1.1 |
| Page engine (15.7) | Không có trang gọn cho BOD. Nhưng 8 báo cáo đã phủ phần lớn | 🟡 **Cắt được**, giữ lại 3 page cứng (`page_home`, `page_weekly_meeting`, `page_sales_admin`) |
| Form view (15.6.1) | Tạo bản ghi vẫn qua grid + record panel | 🟡 **Cắt được** trừ `form_log_activity` — cái này **phải giữ** |
| Lookup/Rollup do người dùng tạo (15.5.1-2) | Người dùng không tự tổng hợp được | ❌ **KHÔNG nên cắt** — đây là nguyên tắc A4 |
| Formula do người dùng tạo (15.5.3) | Không tự tính toán được | ❌ **KHÔNG nên cắt** |
| Custom field (15.4) | Quay lại schema cố định | ❌ **TUYỆT ĐỐI KHÔNG cắt** — đây là nguyên tắc A5, và là thứ khiến người dùng cảm thấy quen thuộc |

> **Ranh giới tối thiểu để sản phẩm còn "ra chất Airtable": 15.4 + 15.5 + `form_log_activity` + tooltip mô tả field.** Dưới ngưỡng này, Tomahawk là một CRM cố định có giao diện đẹp — không phải thứ HBG CRM đang là.

### 15.9.3. Bổ sung acceptance criteria

```gherkin
Feature: Người dùng tự mở rộng hệ thống

  Scenario: Thêm cột trong 5 giây
    Given tôi đang xem danh sách Công ty
    When tôi bấm nút [+] ở cuối hàng tiêu đề
    And nhập tên "Tech Stack", chọn loại "Nhiều lựa chọn", thêm 2 lựa chọn
    And bấm "Tạo"
    Then cột mới xuất hiện trong grid trong vòng 1 giây
    And tôi nhập liệu được ngay
    And KHÔNG có thao tác deploy hay reload trang nào

  Scenario: Tự tạo rollup
    Given bảng Công ty có liên kết tới Cơ hội
    When tôi tạo trường Rollup: qua "Cơ hội", lấy "Giá trị ước tính", hàm SUM
    And thêm điều kiện lọc "Trạng thái không phải Lost"
    Then trường hiện xem trước đúng trên 3 bản ghi đầu
    When tôi bấm Tạo
    Then cột xuất hiện với giá trị đúng
    And khi tôi thêm một Cơ hội mới cho công ty đó, giá trị tự cập nhật

  Scenario: Formula của hệ thống cũ chạy được gần như nguyên văn
    Given tôi có công thức từ Airtable:
      """
      IF(AND({Rank}="A", {Potential}="High"), "Ưu tiên cao", "")
      """
    When tôi dán vào trình soạn formula
    Then cú pháp hợp lệ, không cần sửa
    And xem trước ra kết quả đúng

  Scenario: Chặn vòng lặp
    Given trường A tính từ trường B
    When tôi sửa trường B để tính từ trường A
    Then hệ thống từ chối
    And chỉ rõ vòng lặp: "A → B → A"

  Scenario: Chặn xoá trường đang được dùng
    Given trường "Rank" đang được dùng trong 3 view và 1 formula
    When tôi xoá trường đó
    Then hệ thống từ chối và liệt kê 3 view + 1 formula đang tham chiếu

Feature: Mô tả trường dạy nghiệp vụ

  Scenario: Học nghiệp vụ khi nhập liệu
    Given trường "Mục tiêu" có mô tả giải thích 6 lựa chọn
    When tôi hover chuột lên tiêu đề cột 500ms
    Then tooltip hiện mô tả đầy đủ và ví dụ giá trị
    And nội dung mô tả giống nguyên văn mô tả trong Airtable cũ

Feature: Automation tự dựng an toàn

  Scenario: Chạy thử trước khi bật
    Given tôi vừa tạo automation "cơ hội quá 90 ngày → thông báo"
    When tôi bấm "Chạy thử"
    Then hệ thống hiện những gì SẼ xảy ra trên 1 bản ghi mẫu
    And KHÔNG ghi dữ liệu thật

  Scenario: Tự tắt khi lỗi liên tục
    Given automation đã fail 3 lần liên tiếp
    Then hệ thống tự tắt nó
    And thông báo cho người tạo và admin kèm thông điệp lỗi
```

## 15.10. Cập nhật Phụ lục A theo các quyết định mới nhất

Bốn điểm đã được chốt, cập nhật lại giá trị mặc định trong toàn bộ tài liệu:

| # | Vấn đề | Giá trị CHỐT | Thay đổi so với mặc định cũ |
|---|---|---|---|
| 1 | Định nghĩa Hunt/Farm | **`rolling_12m`** — doanh thu phát sinh trong 12 tháng đầu kể từ hợp đồng đầu tiên là Hunt | ⚠️ **ĐỔI** (mặc định cũ là `fiscal_year`). Xem 15.10.1 |
| 2 | Trọng số `TT` | **0.10**, gộp nhóm hiển thị với KT3 | Giữ nguyên mặc định |
| 3 | Năm tài chính | **Trùng năm dương lịch**, Q1 = Jan-Mar | Giữ nguyên mặc định |
| 4 | Chế độ đồng bộ email | **`metadata_plus_matched`** | Giữ nguyên mặc định |

### 15.10.1. Hệ quả kỹ thuật của việc chọn `rolling_12m`

Quyết định này chính xác hơn về mặt kinh tế nhưng **tốn công hơn để triển khai** — cần nói rõ để không bị bất ngờ:

```typescript
// Phần 4.11 — đổi giá trị mặc định của system_config
const DEFAULT_HUNT_FARM_MODE: HuntFarmMode = 'rolling_12m';   // đã đổi từ 'fiscal_year'
```

**Ba điểm cần xử lý thêm:**

1. **Không phân loại được ở mức Account, chỉ ở mức từng tháng doanh thu.** Một account có thể vừa có doanh thu Hunt (tháng 1-12 kể từ hợp đồng đầu) vừa có Farm (từ tháng 13). Nghĩa là `contract_month_revenue` phải mang nhãn hunt/farm riêng cho từng dòng, không phải một cờ trên Account.

2. **Phải tính lại mỗi tháng.** Một dòng doanh thu là Hunt hôm nay có thể vẫn là Hunt tháng sau, nhưng account đó sẽ dần chuyển sang Farm. Job `compute-kpi-snapshot` phải tính nhãn tại thời điểm chốt kỳ và **đóng băng vào snapshot** — không tính lại từ dữ liệu hiện tại, nếu không số liệu lịch sử sẽ thay đổi.

3. **Bổ sung cột materialized để lọc/báo cáo nhanh:**
```prisma
// thêm vào contract_month_revenue
huntFarm      String?  @map("hunt_farm")          // 'hunt' | 'farm', tính bởi job
huntFarmAt    DateTime? @map("hunt_farm_at") @db.Timestamptz
```

```sql
-- Job tính lại, chạy hằng đêm và khi account.first_contract_date thay đổi
UPDATE contract_month_revenue m
SET hunt_farm = CASE
      WHEN a.first_contract_date IS NULL THEN 'hunt'
      WHEN (m.year * 12 + m.month) - (EXTRACT(YEAR FROM a.first_contract_date)::int * 12
                                    + EXTRACT(MONTH FROM a.first_contract_date)::int) < 12
        THEN 'hunt'
      ELSE 'farm'
    END,
    hunt_farm_at = now()
FROM contract c JOIN account a ON a.id = c.account_id
WHERE m.contract_id = c.id;
```

> **Lưu ý cho báo cáo R2 (Tổng quan tài chính) và R3 (Dự báo Pipeline):** biểu đồ "Hunt vs Farm" giờ chia theo **dòng doanh thu tháng**, không phải theo account. Con số sẽ khác so với cách hiểu "account này là khách mới" — cần giải thích rõ trong chú thích biểu đồ để người xem không nhầm.
# PHỤ LỤC A — TỔNG HỢP CÁC ĐIỂM CẦN QUYẾT ĐỊNH

Bốn mục đã được chốt (đánh dấu ✅). Các mục còn lại **đã có giá trị mặc định** để không chặn việc code, nhưng cần xác nhận trước khi chạy production.

| # | Vấn đề | Mặc định đang dùng | Ảnh hưởng nếu sai |
|---|---|---|---|
| 1 | ~~Trọng số của `TT`~~ | ✅ **ĐÃ CHỐT: 0.10**, gộp nhóm hiển thị với KT3 | — |
| 2 | Ánh xạ Certainty cũ → KT mới | Contracted/Worstcase/Extend→KT1, Forecast→KT2, Bestcase→KT3 | Tổng forecast sau migrate lệch so với số hiện tại |
| 3 | ~~Định nghĩa Hunt/Farm~~ | ✅ **ĐÃ CHỐT: `rolling_12m`** (12 tháng đầu kể từ hợp đồng đầu tiên = hunt). Xem hệ quả kỹ thuật ở 15.10.1 | — |
| 4 | Ngưỡng RAG | Red < 40%, Amber 40-70%, Green ≥ 70% | Màu cảnh báo sai, sửa bằng UPDATE |
| 5 | Ngưỡng MEDDIC để chuyển Presales | 4/6 chiều, bắt buộc có Identify Pain + Economic Buyer | Presales nhận deal chưa đủ thông tin, hoặc bị chặn quá gắt |
| 6 | ~~Chế độ đồng bộ email~~ | ✅ **ĐÃ CHỐT: `metadata_plus_matched`** — lưu metadata mọi email, lưu nội dung chỉ khi khớp Contact | Vẫn nên thông báo minh bạch cho nhân viên |
| 7 | Ma trận phân quyền (10.2) | Xem bảng | Lộ dữ liệu tài chính hoặc chặn nhầm |
| 8 | ~~Năm tài chính~~ | ✅ **ĐÃ CHỐT: trùng năm dương lịch**, Q1 = Jan-Mar | — |
| 9 | Field `Fiscal year` của Airtable | Hiểu là **tháng kết thúc năm tài chính** | Có thể nguồn lưu là năm — cần kiểm tra dữ liệu thật |
| 10 | Năm của 12 cột tháng trong Contract | Suy từ `startDate` | Hợp đồng vắt qua 2 năm sẽ sai — cần soát tay |
| 11 | `Invoiced Months` có còn dùng không | Migrate vào `isInvoiced` | Nếu bỏ hoang thì thừa dữ liệu, vô hại |
| 12 | Currency `German` trong Contracts | Coi là lỗi nhập, map về `EUR` | Sai đơn vị tiền |
| 13 | Số người dùng và vai trò thật | 15 người, 6 vai trò | Ảnh hưởng seed và phân quyền |

---

# PHỤ LỤC B — CÁC LỖI CỦA HỆ THỐNG CŨ ĐÃ ĐƯỢC XỬ LÝ

Bảng này để đối chiếu khi nghiệm thu — mỗi dòng phải kiểm tra đã không lặp lại.

| # | Lỗi ở HBG CRM (Airtable) | Cách Tomahawk tránh |
|---|---|---|
| 1 | `Month.TCV Rev` dùng `FIND()` như boolean nhưng nó trả về **vị trí ký tự** → nhân sai hệ số | Không dùng khớp chuỗi để join. Bảng `contract_month_revenue` có cột `year`, `month` kiểu số |
| 2 | `Mar Rev` dùng trọng số 0.3 trong khi 11 tháng khác dùng 0.15 | Trọng số lưu ở bảng `pipeline_weight_config`, tham chiếu một chỗ duy nhất |
| 3 | Script tính forecast gọi `getView("All")` — view không tồn tại → **chưa từng chạy lần nào** | Job có dead-letter queue + màn hình giám sát + alert khi fail |
| 4 | `BANT LoD Score` thưởng BANT-Time 2 lần, BANT-Budget 0 lần | Thay bằng AI chấm nội dung; công thức có unit test |
| 5 | `Account Basic Info Quality` đếm `Type` 2 lần | Trọng số định nghĩa trong hằng số có test |
| 6 | Mô tả field và công thức thật đã trôi xa nhau (`Score Relationship` mô tả -15/tháng, thật là -0.5/ngày + cap 200) | Công thức nằm trong code có test; mô tả sinh từ code |
| 7 | `Industry` phình lên 106 giá trị với 11 nhóm trùng nghĩa | Bảng taxonomy có khoá; AI chỉ được chọn từ danh sách, không tạo mới |
| 8 | `Country` có `German` vs `Germany`, `UK` vs `England`, giá trị rác `ho` | Dùng ISO 3166-1 alpha-2 |
| 9 | `Heartbeat` nhét time-series vào một ô text phân tách bằng `\|` | Bảng `contact_score_history` |
| 10 | 9 calendar view đặt tên cứng theo từng người | Một view + filter động `CURRENT_USER` |
| 11 | Không có validation — required chỉ hoạt động trên form khi tạo mới | Validation engine chạy cả create và update, có 3 mức nghiêm trọng |
| 12 | Không có ràng buộc chống trùng → account trùng tên khác cách viết | Unique index trên domain + tên chuẩn hoá, cộng phát hiện trùng mờ |
| 13 | Lịch sử tương tác nằm trong 7 field văn bản tự do | Bảng `activity` có cấu trúc |
| 14 | `Action class` thiếu option "B" dù có field đếm B | Enum đầy đủ 5 mức |
| 15 | View filter bị dùng thay cho phân quyền | Row-level security ở tầng truy vấn |
| 16 | Rule "quá 3 tháng → Lost" chỉ ghi trong mô tả, không có gì enforce | Validation rule + job phát hiện + đề xuất |
| 17 | Rule "3/4 BANT mới chuyển Presales" không có gì enforce | Cổng chặn cứng ở API |
| 18 | Hai định nghĩa Hunt/Farm song song, cả hai cùng lên KPI | Một định nghĩa, cấu hình ở `system_config` |
| 19 | Email automation có 4/5 địa chỉ nhận thừa dấu cách đầu | Validate + trim ở tầng nhập |
| 20 | Không có audit trail dùng được (giới hạn 1 năm, không export) | `audit_log` append-only, partition theo tháng, giữ vô thời hạn |
