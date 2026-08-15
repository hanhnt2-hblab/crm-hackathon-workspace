---
title: 'U7 — `S8` đủ số đo và chỉnh tham số hiệu lực ngay (`FR-41` `FR-43` `FR-44`)'
type: 'feature'
created: '2026-08-15'
baseline_commit: 'bfb39922f26566d0131dfba745fccc0ddd2dca1c'
status: 'draft'
review_loop_iteration: 0
context:
  - '_bmad-output/planning-artifacts/prds/prd-crm-hackathon-2026-08-14/prd.md'
  - '_bmad-output/planning-artifacts/ux-designs/ux-crm-hackathon-2026-08-14/EXPERIENCE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `S8` hiện có bốn con số; `FR-41` liệt **chín nhóm** — số Phát hiện đã sinh và
phân bố ba Mức chắc chắn, số Gợi ý đã sinh, tỉ lệ sửa-rồi-duyệt, tỉ lệ bỏ, phân bố lý do
bỏ, thời gian quyết trung bình, số lần tự đặt Việc tiếp theo và **tỉ lệ bị hoàn tác**, và
một dòng riêng đếm Gợi ý bị **hệ thống** đóng. `FR-44` (chỉnh tham số, hiệu lực ngay)
**không có bề mặt nào** — Quản trị hiện chỉ bấm được công tắc AI. Không có nó thì một
trong bốn khác biệt vai của PRD §6 chưa kiểm chứng được.

**Approach:** Mở rộng lượt đọc số đo cho đủ chín nhóm và hai cửa sổ (luỹ kế · 24 giờ), rồi
thêm biểu mẫu chỉnh 12 khoá `SettingKey`, mỗi dòng kèm một câu *đổi nó thì cái gì đổi theo*.

## Boundaries & Constraints

**Always:**
- Mỗi số đo hiện **cả luỹ kế và cửa sổ 24 giờ**, kèm ngưỡng ở `0.2.2` (`FR-41`).
- Chưa đủ mẫu thì hiện *"cần ít nhất N lượt quyết để tính"*, **không** hiện `0%` — `0%` đọc thành *máy sai hết*. Khuôn `Ratio` ở `admin/page.tsx:138` đã làm đúng, giữ nguyên cách đó.
- Một dòng riêng đếm **Gợi ý bị hệ thống đóng** theo `ly_do_dong_he_thong`, **tách hẳn** khỏi ba con số Duyệt / Sửa-rồi-duyệt / Bỏ — đường này không ai quyết gì (`FR-41`, `FR-51`).
- `auto-accept rate` và thời gian quyết trung bình hiện **cạnh nhau**; ngôn từ cảnh báo là ***"N gợi ý cần rà lại"***, **không** phải *"phát hiện bất thường"* (`FR-43`, `D29`).
- Mỗi tham số hiện **đơn vị**, **giá trị mặc định**, và **một câu** giải thích đổi nó thì cái gì đổi theo (`FR-44`).
- Đổi tham số **có hiệu lực ngay**, không triển khai lại. `AD-15` đã bảo đảm điều này ở tầng đọc: tham số đọc **mỗi lần dùng**, cấm đệm — bề mặt **không** được thêm một lớp nhớ nào.
- Bảy Giai đoạn và nhãn của chúng **không** nằm trong danh sách chỉnh được (`BR-D11`), khác mọi tham số khác.
- Chặn vai ở **tầng nghiệp vụ**: mọi lượt đọc/ghi của bề mặt này khai `allowedRoles: ["admin"]`, và màn 403 là **kết quả** của một lần từ chối, không phải một phép kiểm vai riêng (`AD-UI-10`, `D28`).
- `AD-UI-5` · `AD-UI-6` · `AD-UI-8`.

**Ask First:**
- **Chặn đã biết:** ghi một tham số cần hàm lõi `setSetting`, **chưa tồn tại** (`src/core/settings.ts` chỉ có `getSetting*`). Thêm nó nghĩa là thêm một tên vào `CORE_FUNCTIONS_ALLOWED` của `tests/T10B.test.ts` — chú thích ở đó nói rõ đây là *"một quyết định có chủ đích, diff nhìn thấy được trong code review"*, tức **hợp lệ nhưng phải có người duyệt**. Dừng và hỏi trước khi chạm `tests/**` hoặc `src/core/**`.
- `ai_enabled` đã có đường ghi riêng (`disableAi`/`enableAi`, hai quyền khác nhau vì `AD-11`). **Không** cho nó vào biểu mẫu tham số chung — hỏi nếu thấy cần.

**Never:**
- Không thêm capability cho tác nhân `system`.
- Không cho `enableAi` nhận `system` — máy tắt được, **không** bật lại được (`AD-11`, `T-10b` khẳng định đích danh).
- Không xuất báo cáo ra tệp, không gửi thư định kỳ — `[NON-GOAL for MVP]`.
- Không chạm `src/scan/**`, `prisma/**`. Không commit, không push.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Đủ mẫu | ≥ `metrics_min_sample` lượt quyết | Hiện tỉ lệ kèm `n/N`, cả luỹ kế và 24 giờ | — |
| Chưa đủ mẫu | dưới ngưỡng | *"cần ít nhất N lượt quyết để tính"* | **Không** hiện `0%` |
| Duyệt mù | tỉ lệ duyệt cao + quyết < 3 giây | Khối *"N gợi ý cần rà lại"* cạnh hai con số | — |
| `unclassified` vượt ngưỡng | > `unclassified_ratio_threshold` | Cảnh báo cùng khối (`BR-B5`) | — |
| Gợi ý hệ thống đóng | `system_close_reason` có giá trị | Dòng riêng, **không** vào mẫu số hai tỉ lệ kia | — |
| Sales mở `/admin` | phiên Sales | Màn 403 dựng từ `GateDenied("role")` | Không ẩn bằng cách chuyển hướng |
| Đổi chu kỳ quét | vòng đang chạy | Vòng đang chạy **giữ nhịp cũ**; nhịp mới từ vòng kế, màn hình **nói rõ** điều đó | — |
| Nhập giá trị phi lý | tỉ lệ > 1, số âm | Từ chối tại biểu mẫu, giữ nguyên thứ vừa gõ | Câu nói **làm gì tiếp** |

</frozen-after-approval>

## Code Map

- `src/core/metrics.ts` -- `autoAcceptRate`, `errorDetectionRate`, `unclassifiedRatio`, `blindApprovalSignals` — bốn hàm đã có tên trong danh sách trắng `T-10b`
- `src/core/settings.ts` -- `SettingKey:17` 12 khoá, `SETTING_DEFAULTS:31` mặc định và mã thượng nguồn của từng khoá
- `src/capability/caps/ui.ts` -- `readAdminMetricsCap:399` — mở rộng tại chỗ, giữ `allowedRoles: ["admin"]`
- `src/capability/caps/scan.ts` -- `readSettingCap:314` — khuôn đọc tham số đã có
- `src/app/admin/page.tsx` -- `MetricsBlock:65`, `Ratio:138` — khuôn hiển thị và màn 403
- `src/app/admin/_ai-switch.tsx` + `src/app/admin/actions.ts` -- khuôn lá client + action của bề mặt này

## Tasks & Acceptance

**Execution:**
- [ ] `src/capability/caps/ui.ts` -- `readAdminMetrics` trả đủ chín nhóm, mỗi nhóm hai cửa sổ, kèm dòng Gợi ý bị hệ thống đóng -- `FR-41`
- [ ] `src/app/admin/page.tsx` -- dựng đủ số đo; giữ khuôn *chưa đủ mẫu* của `Ratio` -- `FR-41` `FR-43`
- [ ] `src/capability/caps/ui.ts` -- lượt đọc 12 tham số kèm đơn vị, mặc định, câu giải thích -- `FR-44`
- [ ] `src/app/admin/_settings-form.tsx` + `src/app/admin/actions.ts` -- biểu mẫu chỉnh tham số **sau khi mục Ask First được duyệt** -- `FR-44`

**Acceptance Criteria:**
- Given chưa có lượt quyết nào, when Quản trị mở `S8`, then thấy *"cần ít nhất N lượt quyết"*, **không** thấy `0%`.
- Given tỉ lệ duyệt 96% và thời gian quyết 1,8 giây, when mở `S8`, then hai con số đứng **cạnh nhau** và khối *"N gợi ý cần rà lại"* hiện.
- Given phiên Sales, when vào thẳng `/admin`, then bị từ chối bởi Cổng, không phải bởi một phép kiểm ở giao diện.

## Verification

**Commands:**
- `npx tsc --noEmit` -- expected: sạch
- `npm run lint` -- expected: không lỗi mới
- `npx playwright test e2e/T9.spec.ts` -- expected: không hồi quy phần `/admin`

**Manual checks (if no CLI):**
- Đổi `scan_interval_minutes` rồi đợi một vòng: vòng kế phải theo nhịp mới mà **không** khởi động lại tiến trình.
