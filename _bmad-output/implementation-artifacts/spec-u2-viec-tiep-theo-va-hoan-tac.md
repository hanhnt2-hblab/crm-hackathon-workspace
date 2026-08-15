---
title: 'U2 — Khối Việc tiếp theo, dấu hiệu máy đặt, Hoàn tác một cú bấm (`FR-7` `FR-30`…`FR-32`)'
type: 'feature'
created: '2026-08-15'
baseline_commit: 'bfb39922f26566d0131dfba745fccc0ddd2dca1c'
status: 'draft'
review_loop_iteration: 0
context:
  - '_bmad-output/planning-artifacts/ux-designs/ux-crm-hackathon-2026-08-14/EXPERIENCE.md'
  - '_bmad-output/planning-artifacts/architecture/architecture-tier1-tuong-tac/ARCHITECTURE-SPINE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `T-6` đòi *"ô mang **dấu hiệu** do hệ thống đặt"* và `T-7` đòi *"**bấm** Hoàn
tác, một cú bấm"*. Cả hai đường ghi đã xong ở tầng ④ (`setNextAction`,
`fillNextActionIfUnchanged`, `undoSystemNextAction`) và lõi đã sinh Thông báo
(`src/core/nextaction/index.ts:642`), nhưng **không bề mặt nào hiện Việc tiếp theo**:
`toOpportunityCard` (`caps/ui.ts:486`) không trả trường nào của `NextAction`. Giám khảo
thử tay không có ô để nhìn và không có nút để bấm.

**Approach:** Mở rộng lượt đọc `readAccountDetail` để mỗi Cơ hội mang Việc tiếp theo đang
sống, rồi dựng khối hiển thị trên `S3` với ba tín hiệu máy/người của `DESIGN.md`, nút
Hoàn tác kèm thời hạn còn lại, và một khay Thông báo trên khung ứng dụng.

## Boundaries & Constraints

**Always:**
- `AD-UI-5` — chỉ `page.tsx`/`layout.tsx` gọi `loadCapability`. Lá client nhận dữ liệu qua props.
- `AD-UI-6` — mọi server action đi qua `action()` của `src/app/_contract.ts`; đó là chỗ **duy nhất** có `try/catch`.
- `AD-UI-8` — khối Việc tiếp theo có `Suspense` riêng; nó chậm không được chặn hồ sơ.
- Mở rộng lượt đọc **bên trong `caps/ui.ts`**, đọc `db` trực tiếp như các mục đang có. Đây là `KNOWN_DEBT` *"ui.ts → db"* đã khai ở `tests/T10B.test.ts` — **không** nhập thêm hàm mới từ `@/core/*`.
- Ba tín hiệu ranh giới máy/người của `DESIGN.md`, đủ cả ba: nền `--machine-bg` · ray trái 3px `--machine-border` · **cân nặng chữ 600** cho câu do máy đặt. Ô người gõ nằm trên giấy, cân nặng 400.
- Nút Hoàn tác **chỉ hiện** khi `set_by = he_thong` **và** `undo_deadline_at > hiện tại`. Hiện rõ **còn bao lâu** (`FR-32`).
- Người sửa tay ô đó thì nút Hoàn tác **biến mất ngay**, kể cả khi cửa sổ chưa hết — đọc theo `set_by`, không theo một cờ ở giao diện.
- Cơ hội thiếu Việc tiếp theo hoặc thiếu hạn: hiện **cờ cảnh báo**, không hiện ô trống im lặng (`BR-B1`, `EXPERIENCE.md` `S5` hàng *Rỗng*). Cơ hội ở `tam_dung` được miễn, cờ im lặng (`BR-B4`).
- Khay Thông báo ở khung: đọc `notification` chưa xem, hiện *hệ thống vừa đặt gì · cho Cơ hội nào · vì sao*. **Không tự biến mất** (`FR-31`).

**Ask First:**
- Đánh dấu Thông báo **đã xem** (`seen_at`) cần một mục ghi mới. Cân nhắc chưa xong — **để nguyên chưa đánh dấu** trong phạm vi này. Muốn làm thì dừng và hỏi.
- Bất kỳ nhu cầu nào phải nhập một hàm mới từ `@/core/*` vào `src/capability/caps/**` — dừng và hỏi, vì danh sách trắng nằm trong `tests/**` và sửa nó là sửa phép kiểm để hợp với mã.

**Never:**
- **Không** thêm capability nào cho tác nhân `system`. `T-10b` khẳng định khối ghi của máy là một **phân hoạch** ba tên chạm hồ sơ cộng hai tên chạm bằng chứng; một mục thứ tư làm phép kiểm đó đỏ.
- Không chạm `tests/**`, `prisma/**`, `src/core/**`, `src/scan/**`, `src/agent/**`.
- Không đặt `outline: none` ở bất kỳ đâu. Không dùng màu đơn độc để truyền tin.
- Không commit, không push.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Ô do máy đặt | `set_by = he_thong`, còn hạn hoàn tác | Dòng máy: nền + ray + chữ 600, kèm câu trích và nút **Hoàn tác** + thời gian còn lại | — |
| Ô do người gõ | `set_by = nguoi` | Trên giấy, chữ 400, **không** nút Hoàn tác | — |
| Hết cửa sổ 7 ngày | `undo_deadline_at` đã qua | Ô giữ nguyên nội dung, nút **biến mất**, sửa tay như ô thường | — |
| Bấm Hoàn tác | ô máy đặt còn hạn | Một cú bấm; ô về đúng giá trị trước khi máy chạm | Cổng từ chối → câu tiếng Việt dựng từ mã, không phải thông điệp lỗi |
| Bấm Hoàn tác lần hai | vừa hoàn tác xong | No-op, **không** báo lỗi | — |
| Cơ hội chưa có ô | không có `NextAction` sống | Cờ `BR-B1` nhìn thấy được, kèm chỗ nhập | — |
| Cơ hội `tam_dung` | không có ô | **Không** cờ (`BR-B4`) | — |
| Thông báo chưa xem | có hàng `notification` | Khay hiện số đang chờ và nội dung | Đọc hỏng → khay nói *chưa đọc được*, khung vẫn dựng |

</frozen-after-approval>

## Code Map

- `src/capability/caps/ui.ts` -- `OPPORTUNITY_SELECT`, `toOpportunityCard:486` cần trả thêm Việc tiếp theo; `readAccountDetail:238` là lượt đọc mở rộng; thêm mục đọc Thông báo cạnh `readAiEnabled:137`
- `src/capability/caps/suggestion.ts` -- `setNextActionCap:219`, `undoSystemNextActionCap:324` — hai mục ghi đã có, dùng nguyên
- `src/app/accounts/[id]/page.tsx` -- nơi đặt khối mới, theo khuôn `TimelineBlock`
- `src/app/accounts/[id]/actions.ts` -- thêm action gọi hai mục ghi trên, theo khuôn `logActivityAction:76`
- `src/app/layout.tsx` -- `readShell:81` là chỗ khay Thông báo treo vào
- `src/app/globals.css` -- `--machine-bg`, `--machine-border` đã có; thiếu bậc cân nặng cho câu máy
- `src/app/_types.ts` -- kiểu `AccountDetail` cần trường mới

## Tasks & Acceptance

**Execution:**
- [ ] `src/capability/caps/ui.ts` -- `readAccountDetail` trả Việc tiếp theo đang sống của từng Cơ hội (nội dung, hạn, `setBy`, `undoDeadlineAt`, câu trích của Phát hiện nguồn); thêm mục đọc Thông báo chưa xem -- `FR-30` `FR-31` cần dữ liệu trước khi cần pixel
- [ ] `src/app/_types.ts` -- khai kiểu cho hai hình dạng trên -- một nguồn kiểu, không để bề mặt tự đoán
- [ ] `src/app/accounts/[id]/actions.ts` -- `setNextActionAction`, `undoNextActionAction` -- hai đường ghi của `T-7`
- [ ] `src/app/accounts/[id]/_next-action.tsx` -- lá client: ô, dấu hiệu ba tín hiệu, nút Hoàn tác kèm đếm ngược -- `T-6` `T-7`
- [ ] `src/app/accounts/[id]/page.tsx` -- gắn khối vào `Suspense` riêng -- `AD-UI-8`
- [ ] `src/app/layout.tsx` + `src/app/_notifications.tsx` -- khay Thông báo trên khung -- `FR-31`, `S0`
- [ ] `src/app/globals.css` -- lớp dòng máy: nền · ray 3px · `font-weight: 600` -- `DESIGN.md` đòi đủ ba tín hiệu

**Acceptance Criteria:**
- Given một Cơ hội có Việc tiếp theo do máy đặt, when Sales mở màn Công ty, then thấy ô đó **khác biệt bằng ba tín hiệu** và một nút Hoàn tác kèm thời gian còn lại.
- Given ô đó, when bấm Hoàn tác đúng một lần, then giá trị trước khi máy chạm trở lại và nút biến mất.
- Given máy vừa đặt một Việc tiếp theo, when Sales mở bất kỳ trang nào, then khay Thông báo hiện việc đó kèm lý do, và **không** tự biến mất.
- Given `npx tsc --noEmit`, then sạch; `npm run lint`, then không lỗi mới.

## Verification

**Commands:**
- `npx tsc --noEmit` -- expected: sạch
- `npm run lint` -- expected: không lỗi mới
- `npx playwright test e2e/T6.spec.ts e2e/T7.spec.ts` -- expected: hai phép kiểm giao diện đang đỏ (`T6.spec.ts:206`, `T7.spec.ts:236`) chuyển xanh

**Manual checks (if no CLI):**
- Mở màn Công ty với một Cơ hội máy vừa đặt: ô phải phân biệt được **không cần đọc chữ**, và bỏ một trong ba tín hiệu đi thì hai cái còn lại vẫn giữ được ranh giới.
