---
title: 'U5 — Bốn chỗ hở của nhóm 1: lý do thua, bảng thống kê, việc đến hạn, lọc Cơ hội (`FR-8` `FR-48` `FR-10` `FR-9`)'
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

**Problem:** Nhóm 1 là nhóm duy nhất `T-1` kiểm khi phần AI tắt sạch, và nó còn hở bốn
chỗ, cả bốn đều `phải có`: (a) `FR-8` sang Thua **không hỏi lý do** — `board/actions.ts`
chỉ có bốn action, không đường nào ghi `ly_do_thua`; (b) `FR-48` bảng thống kê lý do thua
**không tồn tại**; (c) `FR-10` màn tổng quan thiếu **danh sách Việc tiếp theo đến hạn hôm
nay và quá hạn** — đúng vế mà UJ-1 dựng lên, và là câu trả lời cho *"hôm nay tôi chạm
ai"*; (d) `FR-9` mới lọc được Công ty, **chưa lọc Cơ hội** theo Giai đoạn và tình trạng
Việc tiếp theo.

**Approach:** Thêm mục sổ đăng ký cho `setLossReasons` (hàm lõi đã có ở
`src/core/opportunity/index.ts:229` và đã nằm trong danh sách trắng của `T-10b`), hộp hỏi
lý do khi thả vào cột Thua theo đúng khuôn `QualificationDialog` đã chạy, rồi mở rộng
`readOverview` cho hai khối còn thiếu.

## Boundaries & Constraints

**Always:**
- Hỏi lý do thua **không chặn thao tác**: Cơ hội **vẫn sang** `thua`, mang cờ `BR-B3` và **đứng ngoài** bảng thống kê tới khi bổ sung (`BR-B3`, `FR-8`).
- Nút **Bỏ qua** là nút thật, ngang hàng với nút ghi — cùng lý do `QualificationDialog` đã làm vậy: bỏ qua khó hơn điền là lật ngược luật ở tầng giao diện.
- Lý do thua là **mảng enum + ghi chú tự do**, không phải một câu (`D27`). Một Cơ hội đếm vào **nhiều dòng** của bảng thống kê.
- Bảng thống kê ghi rõ **tổng số Cơ hội tách khỏi tổng số lượt lý do**, để người đọc không cộng nhầm (`FR-48`).
- Cơ hội `thua` **chưa** có lý do thì **đứng ngoài** bảng, **không** xếp vào nhóm *"khác"*.
- Danh sách việc: **đến hạn hôm nay** và **đã quá hạn**, tính theo `due_date` của `NextAction` đang sống. Cơ hội thiếu ô **không** vào danh sách này, nó đã có cờ `BR-B1` (`FR-7`).
- Trạng thái rỗng của danh sách việc: *"Hôm nay chưa có việc đến hạn."* — kèm lối vào Hàng đợi gợi ý nếu có gợi ý chờ (`EXPERIENCE.md` `S1` hàng *Rỗng*).
- Con số đi kèm **mốc so** (*"3/12 cơ hội mang cờ"*), theo *Giọng chữ*.
- Lọc Cơ hội theo Giai đoạn **và** theo tình trạng Việc tiếp theo: *đến hạn hôm nay* · *quá hạn* · *thiếu ô* (`FR-9`).
- `AD-UI-5` · `AD-UI-6` · `AD-UI-8`; lượt đọc mở rộng nằm trong `caps/ui.ts`, đọc `db` trực tiếp, **không** nhập hàm mới từ `@/core/*` ngoài `setLossReasons`.

**Ask First:**
- `toOpportunityCard` (`caps/ui.ts:486`) và `needsQualificationFlag` (`src/core/opportunity`) **cài `BR-B2` ngược nhau** và bản của lõi không có bên gọi nào (deferred-work). Spec này **không sửa** mâu thuẫn đó. Nếu chạm phải: dừng và hỏi.
- Cờ `BR-B1` hiện chưa được `toOpportunityCard` tính. Thêm nó đổi số cờ trên mọi màn — dừng và hỏi trước khi thêm.

**Never:**
- Không thêm capability cho tác nhân `system`; mục mới cho `setLossReasons` chỉ nhận người.
- Không chặn chuyển sang `thua` vì thiếu lý do — `BR-B3` nói *vẫn sang*.
- Không chạm `tests/**`, `prisma/**`, `src/core/**`, `src/scan/**`.
- Không commit, không push.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Thả vào cột Thua | Cơ hội đang chạy | Hộp hỏi lý do mở **sau khi** đã chuyển; chọn nhiều lý do được | Ghi lý do hỏng → nói riêng về nó, **không** đụng kết quả lượt chuyển |
| Bỏ qua lý do | bấm *Bỏ qua và chuyển* | Cơ hội sang `thua`, mang cờ `BR-B3`, ngoài bảng thống kê | — |
| Bảng thống kê | 3 Cơ hội thua, 5 lượt lý do | Hiện **cả hai** con số, tách bạch | Chưa có Cơ hội thua nào → *"chưa có dữ liệu"*, không hiện 0 trống |
| Việc đến hạn | `due_date` = hôm nay | Vào danh sách, nhóm *hôm nay* | — |
| Việc quá hạn | `due_date` < hôm nay | Vào danh sách, nhóm *quá hạn*, mực `--warn-ink` **kèm chữ** | — |
| Cơ hội thiếu ô | không `NextAction` | **Không** vào danh sách việc; chỉ mang cờ | — |
| Cơ hội `tam_dung` | thiếu ô | Không cờ, không vào danh sách (`BR-B4`) | — |
| Lọc Cơ hội | Giai đoạn + tình trạng cùng lúc | AND cả hai; không kết quả → nói rõ **lọc nào** đang bật | — |

</frozen-after-approval>

## Code Map

- `src/core/opportunity/index.ts` -- `setLossReasons:229` — hàm lõi đã có, chỉ thiếu mục sổ đăng ký
- `src/capability/caps/account.ts` -- `changeStageCap:146` là khuôn để khai mục ghi mới cạnh nó
- `src/capability/caps/ui.ts` -- `readOverviewCap:337` mở rộng hai khối; `toOpportunityCard:486`
- `src/app/board/_board.tsx` -- `QualificationDialog:255` là khuôn hộp hỏi **có nút Bỏ qua thật**; `drop:105` là chỗ rẽ nhánh theo cột đích
- `src/app/board/actions.ts` -- thêm action ghi lý do, theo khuôn `saveQualificationSignalsAction:81`
- `src/app/page.tsx` -- `OverviewBlock:46` — nơi hai khối mới gắn vào
- `src/app/accounts/_filters.tsx` -- khuôn bộ lọc trả về cùng dữ liệu

## Tasks & Acceptance

**Execution:**
- [ ] `src/capability/caps/account.ts` -- mục `setLossReasons`: người, `zone: "ho_so_chinh_thuc"`, `writesTables: ["opportunity"]` -- `FR-8`
- [ ] `src/app/board/actions.ts` -- `saveLossReasonsAction` -- đường ghi của hộp hỏi
- [ ] `src/app/board/_board.tsx` -- hộp hỏi lý do khi đích là `thua`, nút **Bỏ qua và chuyển** ngang hàng -- `BR-B3`
- [ ] `src/app/_vocab.ts` -- nhãn enum lý do thua -- `0.1.x`
- [ ] `src/capability/caps/ui.ts` -- `readOverview` trả thêm: danh sách việc đến hạn/quá hạn, và đếm lý do thua kèm hai tổng -- `FR-10` `FR-48`
- [ ] `src/app/page.tsx` -- hai khối mới, mỗi khối một `Suspense` -- `AD-UI-8`
- [ ] `src/app/board/page.tsx` + `_board.tsx` -- lọc theo Giai đoạn và tình trạng Việc tiếp theo -- `FR-9`

**Acceptance Criteria:**
- Given một Cơ hội đang chạy, when kéo sang Thua rồi bấm *Bỏ qua*, then Cơ hội ở `thua`, mang cờ `BR-B3`, và **không** xuất hiện trong bảng thống kê.
- Given hai Cơ hội thua với tổng ba lượt lý do, when mở tổng quan, then bảng hiện **2 cơ hội / 3 lượt lý do**, tách bạch.
- Given một Cơ hội có Việc tiếp theo hạn hôm qua, when mở tổng quan, then nó nằm trong nhóm *quá hạn*, đánh dấu bằng **màu và chữ**.

## Verification

**Commands:**
- `npx tsc --noEmit` -- expected: sạch
- `npm run lint` -- expected: không lỗi mới
- `npx playwright test e2e/T1.spec.ts` -- expected: không hồi quy; các ca tổng quan và lọc vẫn xanh

**Manual checks (if no CLI):**
- Tắt AI rồi chạy trọn `T-1` bằng tay: tạo → kéo ba giai đoạn → bỏ qua hai dấu hiệu → ghi hoạt động → lọc → mở tổng quan. Không bước nào hỏng.
