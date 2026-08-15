---
title: '3.3 — View lọc theo từng Sales trên màn hình tổng quan'
type: 'feature'
created: '2026-08-15'
status: 'in-review'
baseline_commit: '30e16bd08957e2f5d61209401b2bca7a9f08853e'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/planning-artifacts/architecture/architecture-tier4-capability/ARCHITECTURE-SPINE.md'
  - '{project-root}/_bmad-output/planning-artifacts/architecture/architecture-tier1-tuong-tac/ARCHITECTURE-SPINE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Luật thi 15/08/2026 §3.3 đòi màn hình tổng quan có sẵn **view lọc theo từng Sales**: chọn một Sales thì mọi con số và danh sách chỉ tính dữ liệu của người đó. `readOverview` hôm nay không nhận tham số nào (`src/capability/caps/ui.ts:339`, `params: z.object({})`) và đếm toàn cục.

**Approach:** Thêm một CHIỀU LỌC dữ liệu vào đúng chỗ đọc: `readOverview` nhận `ownerId`, và một capability đọc mới `readSalesOwners` cấp danh sách người phụ trách **có thật trong dữ liệu**. Bề mặt `/` giữ nguyên mọi chữ cũ, chỉ thêm bộ chọn dạng biểu mẫu GET giữ lựa chọn ở `?sales=<id>`.

## Boundaries & Constraints

**Always:**
- Lọc nằm TRONG capability. Tầng ① không bao giờ đọc hết rồi lọc lại — sai cả số lẫn ranh giới.
- `AD-CR-10` — lọc theo người phụ trách là **tham số dữ liệu**, không phải phép kiểm quyền. Không đọc `actor.role`, không đổi `allowedRoles`. Lược đồ đã nói thẳng: `owner_id` là *"Định tuyến việc, KHÔNG phải phân quyền"* (`prisma/schema.prisma:159`).
- MỌI con số và MỌI danh sách trên `/` đi qua cùng một `ownerId`. Một ô đếm quên lọc là con số nói dối.
- Capability mới: `kind: "read"`, `exposeToMcp: false` (`AD-CP-6` chốt đúng số mục phơi ra MCP).
- CHỈ THÊM chữ hiển thị trên `/`. `e2e/T1.spec.ts:304-315` bắt theo tên: `heading "Tổng quan"`, `heading "Cơ hội theo giai đoạn"`, `heading /Cơ hội cần rà lại · [1-9]/`. Playwright khớp tên vai theo **chuỗi con**, nên chữ mới KHÔNG được chứa các chuỗi đó, và không được là `heading`.
- Mặc định là **Tất cả** (không có `?sales`) — giám khảo mở `/` phải thấy ngay đủ số như hôm nay.

**Ask First:**
- Bất kỳ thay đổi nào ở `prisma/schema.prisma` — agent khác đang giữ tệp.
- Bất kỳ sửa đổi nào lên chữ hiển thị đã tồn tại trên `/`.

**Never:**
- Không thêm cột chủ sở hữu cho `opportunity` (không sở hữu lược đồ).
- Không chạm `src/app/{login,import,accounts,board,suggestions}/**`, `src/ingest/**`, `src/core/import/**`, `tests/**`, `e2e/**`.
- Không nhập `db` hay `@prisma/client` trong `src/app` (`AD-1`).
- Không viết lại màn hình tổng quan — chỉ thêm chiều lọc.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Tất cả (mặc định) | `/` không có `?sales` | `ownerId: null` → mọi con số y hệt bản hôm nay | N/A |
| Chọn một Sales | `/?sales=<uuid>` | Bốn ô đếm, phân bố giai đoạn, danh sách cờ, hoạt động mới nhất đều chỉ tính Công ty do người đó phụ trách | N/A |
| Công ty chưa có người phụ trách | `/?sales=none` | Chỉ tính các Công ty `owner_id IS NULL` | N/A |
| `sales` không phải uuid hợp lệ | `/?sales=abc` | Coi như **Tất cả**, không ném lỗi ra màn hình | Tầng ① lọc trước khi gọi; Zod ở capability là chốt thứ hai |
| Sales không phụ trách Công ty nào | `?sales=<uuid>` hợp lệ nhưng 0 Công ty | Các ô đếm về 0, hai danh sách hiện trạng thái rỗng nói rõ **đang lọc theo ai** | N/A |
| Danh sách người phụ trách rỗng | Chưa nhập dữ liệu, mọi `owner_id` là `NULL` | Bộ chọn vẫn hiện với đúng một lựa chọn *Tất cả* | N/A |

</frozen-after-approval>

## Code Map

- `src/capability/caps/ui.ts:335-382` — `readOverviewCap`. `params: z.object({})`, bốn truy vấn `Promise.all`: `db.account.count()`, `db.contact.count()`, `db.opportunity.findMany`, `db.timelineEntry.findMany(take: 8)`. Đây là chỗ DUY NHẤT phải thêm mệnh đề lọc.
- `src/capability/caps/ui.ts:63-77` — `READ_COMMON` đã có sẵn `kind: "read"`, `exposeToMcp: false`, `snapshot: null`. Mục mới trải nó ra là xong.
- `src/capability/caps/ui.ts:521-532` — `entries`. Thiếu một dòng ở đây thì mục mới **im lặng không tồn tại** và bề mặt trả `unknown_capability`.
- `src/capability/caps/ui.ts:161-226` — `searchAccountsCap`. **Khuôn mẫu facet**: trả về giá trị có thật trong dữ liệu để bộ lọc không mời một lựa chọn trả 0 dòng.
- `src/app/page.tsx:46-52` — `OverviewBlock`, gọi `read({})`. `src/app/page.tsx:30-44` — vỏ trang, chưa nhận `searchParams`.
- `src/app/accounts/page.tsx:23-31` + `src/app/accounts/_filters.tsx` — **khuôn mẫu bộ lọc GET**: `props.searchParams`, hàm `one()`, biểu mẫu `method="get"`, liên kết *Xoá lọc*. Chép hình dạng này.
- `src/app/_types.ts:100-107` — `Overview`. Thêm trường ở đây, không khai lại ở `page.tsx`.
- `prisma/schema.prisma:160,166` — `Account.ownerId String? @map("owner_id")`, `owner User? @relation("AccountOwner")`. **CHỈ ĐỌC.**
- `prisma/schema.prisma:213-249` — `Opportunity`. **Đã đo qua `\d opportunity` trên CSDL đang chạy: KHÔNG có cột chủ sở hữu.** Chủ sở hữu Cơ hội phải suy qua `account.ownerId`.
- `e2e/T1.spec.ts:304-315` — phép kiểm *"mở được màn hình tổng quan"*. **CHỈ ĐỌC**, và là ràng buộc cứng lên chữ hiển thị.

## Tasks & Acceptance

**Execution:**
- [x] `src/capability/caps/ui.ts` — thêm `readSalesOwnersCap` (`name: "readSalesOwners"`, `allowedActors: NGUOI`, `params: z.object({})`) trả `{ owners: {id, displayName}[], unassignedAccountCount: number }`, chỉ liệt người **thực sự phụ trách ít nhất một Công ty** — vì không mời lựa chọn trả 0 dòng, đúng khuôn `searchAccountsCap`.
- [x] `src/capability/caps/ui.ts` — `readOverviewCap`: `params` thành `z.object({ ownerId: z.union([z.uuid(), z.literal("none")]).nullable().optional() })`; dựng một mệnh đề `where` theo chủ sở hữu rồi áp vào **cả bốn** truy vấn; trả thêm `ownerId` đã dùng để bề mặt không phải tự nhớ.
- [x] `src/capability/caps/ui.ts` — thêm hai mục vào `entries`; thiếu dòng này là mục không tồn tại.
- [x] `src/app/_types.ts` — thêm `SalesOwnerOptions` và trường `ownerId` vào `Overview`.
- [x] `src/app/_today-sales-filter.tsx` — lá `'use client'`, biểu mẫu `method="get"` một `Select name="sales"`, nhãn **Xem theo người phụ trách**, lựa chọn đầu là *— tất cả Sales —*. Không chứa chuỗi con nào mà `T1.spec.ts` bắt, và không dùng thẻ heading.
- [x] `src/app/page.tsx` — nhận `searchParams`, đọc `sales`, truyền xuống hai khối `Suspense` độc lập (`AD-UI-8`): khối bộ chọn và khối số liệu. Chỉ THÊM chữ.

**Acceptance Criteria:**
- Given không có `?sales`, when mở `/`, then mọi con số bằng đúng bản trước thay đổi này và bộ chọn đang ở *tất cả Sales*.
- Given chọn một Sales rồi tải lại trang, when trang render lại, then lựa chọn còn nguyên vì nó nằm trong `?sales=<id>`.
- Given cộng con số của **mọi** lựa chọn trong bộ chọn (kể cả *chưa có người phụ trách* nếu nó hiện), when so với **Tất cả**, then hai vế bằng nhau.
- Given `readOverview` hỏng, when mở `/`, then bộ chọn vẫn render được — hai khối hỏng độc lập.
- Given `npx tsc --noEmit` và `npx eslint src/`, when chạy, then không lỗi.

## Design Notes

**Vì sao suy chủ sở hữu Cơ hội qua Công ty, và cái giá của nó.** `\d opportunity` trên CSDL `whynow` đang chạy cho thấy bảng không có cột `owner_id`. Lược đồ do agent khác giữ, nên đường duy nhất còn lại là `opportunity.account.ownerId`. Hệ quả phải nói thẳng: nếu dữ liệu nguồn mang một `sales_owner` **ở mức Cơ hội** khác với chủ sở hữu Công ty, con số theo cách suy này sẽ khác con số theo `sales_owner`. Đây là giới hạn của lược đồ hiện tại, không phải lựa chọn thẩm mỹ.

**Vì sao danh sách Sales lấy từ dữ liệu, không lấy từ README.** Bộ chọn liệt các `owner_id` **có thật** trên bảng `account`. Nhờ vậy một chủ sở hữu ngoài danh sách README — ví dụ `Demo` — tự xuất hiện nếu nó phụ trách Công ty, và không lựa chọn nào trả 0 dòng.

**Vì sao có lựa chọn *chưa có người phụ trách*.** `Account.ownerId` là `String?`. Còn một Công ty `NULL` thì tổng theo Sales **không** bằng tổng toàn cục, và một màn hình mà các phần không cộng lại thành tổng là màn hình nói dối. Ô này chỉ hiện khi thực sự có Công ty như thế.

Mệnh đề lọc dùng chung cho cả bốn truy vấn:

```ts
const ownerWhere =
  p.ownerId == null ? {}
  : p.ownerId === "none" ? { ownerId: null }
  : { ownerId: p.ownerId };
// account: ownerWhere · contact/opportunity: { account: ownerWhere }
// timelineEntry: { timeline: { account: ownerWhere } }
```

## Verification

**Commands:**
- `npx tsc --noEmit` — expected: không lỗi.
- `npx eslint src/` — expected: không lỗi, và không thêm dòng `eslint-disable` nào ngoài dòng `no-restricted-imports` đã có.

**Manual checks (if no CLI):**
- Đối chiếu chữ hiển thị mới với ba locator ở `e2e/T1.spec.ts:308-314`: không chuỗi nào chứa `Tổng quan`, `Cơ hội theo giai đoạn`, `Cơ hội cần rà lại`, và không phần tử mới nào là `heading`.

## Spec Change Log

- **Lớp rà `traceability` (override đội, `_bmad/custom/bmad-build.toml`) — ba mục trích mã sai chỗ.**
  Đã sửa, chỉ chú thích, không đụng hành vi:
  1. `src/app/page.tsx` — chú thích viết *"BA KHỐI"* trong khi cây JSX dựng đúng **hai** cặp `Suspense`/`Block`. Sửa thành *"bộ chọn là khối riêng"*.
  2. `src/capability/caps/ui.ts`, `src/app/_today-sales-filter.tsx` — trích `T-1` làm **nguồn** của bộ chọn Sales. `T-1` chỉ nói *"mở màn hình tổng quan"* và không nhắc lọc theo Sales. Sửa thành: `T-1`/`S1` là mã của **bề mặt**, còn yêu cầu §3.3 **không có mã thượng nguồn**.
  3. `src/app/_types.ts`, `src/app/_today-sales-filter.tsx` — gán luật *"không mời lựa chọn trả 0 dòng"* cho `S6`. `S6` (`EXPERIENCE.md`, hàng *Lỗi*) chỉ nói *"lọc không ra kết quả thì nói rõ lọc nào đang bật"*. Sửa thành: đây là **tiền lệ của `searchAccountsCap`**, không phải câu của `S6`.
  KEEP: quy tắc *chữ mới không được chứa chuỗi con mà `e2e/T1.spec.ts` bắt, và không được là `heading`* phải sống sót mọi lần viết lại.
