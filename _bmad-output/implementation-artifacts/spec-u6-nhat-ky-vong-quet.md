---
title: 'U6 — `S9` Nhật ký vòng quét, một dòng mỗi vòng (`FR-38` `FR-39`)'
type: 'feature'
created: '2026-08-15'
baseline_commit: 'bfb39922f26566d0131dfba745fccc0ddd2dca1c'
status: 'draft'
review_loop_iteration: 0
context:
  - '_bmad-output/implementation-artifacts/deferred-work.md'
  - '_bmad-output/planning-artifacts/ux-designs/ux-crm-hackathon-2026-08-14/EXPERIENCE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `T-8` đòi *"**Nhật ký vòng quét có dòng tổng kết cho từng vòng**"*. Dữ liệu đã
được ghi — `src/core/scanlog.ts` và `src/scan/journal.ts` đều chạy — nhưng **không bề mặt
nào đọc nó**. Giám khảo thử tay không có chỗ nào nhìn thấy vòng quét đang làm gì, và UJ-3
(*Hà đọc Nhật ký mỗi sáng thứ Sáu*) không có màn hình.

**Approach:** Một bề mặt đọc `/scan-log`, mỗi vòng một dòng, vào được từ `S8` và từ danh
sách Công ty đang theo dõi. Chỉ đọc, không nút nào.

## Boundaries & Constraints

**Always:**
- Mỗi vòng **một dòng**: chạy lúc nào · quét bao nhiêu Công ty · phát hiện bao nhiêu nội dung mới · thêm bao nhiêu mục Dòng thời gian · mất bao lâu · **có lỗi gì** (`FR-39`).
- Vòng **bị bỏ** vẫn là **một dòng**, kèm lý do — không dồn hàng, không im lặng (`FR-38`, `EXPERIENCE.md` `S9` hàng *Lỗi*).
- Vòng **không trọn** (chạm trần ngân sách hoặc bị phanh) ghi rõ **số Công ty đã quét trên tổng**, và **không** đếm vào chuỗi 10 vòng (`FR-39`).
- Con số đi kèm **mốc so**: *"12/15 account đã quét"*, không phải *"12 account"* (*Giọng chữ*).
- Lỗi nói **làm gì tiếp**, không nói mã lỗi: *"Không đọc được nguồn của Aozora Tech. Vòng sau thử lại."*
- Trạng thái rỗng: *"Chưa có vòng quét nào chạy"*. Trạng thái **AI tắt**: dòng cuối ghi **thời điểm dừng**.
- Lượt đọc mới nằm trong `caps/ui.ts` và **đọc `db` trực tiếp** — đây là `KNOWN_DEBT` *"ui.ts → db"* đã khai ở `tests/T10B.test.ts`.
- `AD-UI-5` · `AD-UI-8`. Bề mặt chỉ đọc, nên **không** server action nào.

**Ask First:**
- **Đọc trước khi dựng:** `FR-39` còn đòi *"mỗi 10 vòng ghi thêm một dòng tổng hợp cộng dồn"*. Hai mảnh đã có (`readScanRollup` ở `src/core/scanlog.ts:377`, `renderRollupLine` ở `src/scan/journal.ts:75`) nhưng **chưa nối**, và deferred-work xếp việc nối là **một quyết định kiến trúc**, không phải một dòng mã: nối từ `src/scan` cần một capability thứ bảy ở khối ba của `AD-2`, đúng thứ `T-10` khẳng định bằng vị từ. Spec này **chỉ hiển thị** dòng tổng hợp **nếu nó đã có trong dữ liệu**; nếu chưa có thì hiện phần từng-vòng và **nói rõ dòng tổng hợp chưa được ghi**. Muốn nối thật: dừng và hỏi.
- Nếu bề mặt cần một hàm đọc chưa có tên trong danh sách trắng `CORE_FUNCTIONS_ALLOWED` (`readScanRollup` **không** có tên trong đó) — **không** nhập nó vào `caps/**`; đọc `db` trực tiếp, hoặc dừng và hỏi.

**Never:**
- Không nhập bất kỳ hàm nào từ `@/core/scanlog` vào `src/capability/caps/**` — làm `T-10b` đỏ.
- Không thêm capability cho tác nhân `system`; bề mặt này của **người**.
- Không chạm `src/scan/**`, `src/core/**`, `tests/**`, `prisma/**`.
- Không commit, không push.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Hai vòng đã chạy | 2 hàng `ScanLog` | Hai dòng, mới nhất trên, đủ sáu trường | — |
| Vòng bị bỏ | vòng trước chưa xong | **Một dòng** kèm lý do *"vòng trước chưa kết thúc"* | — |
| Vòng không trọn | bị phanh giữa chừng | Dòng ghi *"cắt do phanh"* + `n/N` Công ty đã quét | — |
| Có lỗi trên một Công ty | mã `FT*` | Câu tiếng Việt nói **làm gì tiếp**, kèm tên Công ty | Không in mã trần cho người đọc |
| Chưa có vòng nào | bảng rỗng | *"Chưa có vòng quét nào chạy"* | — |
| AI đang tắt | `ai_enabled = false` | Dòng cuối ghi thời điểm dừng; bảng vẫn mở được | — |
| Chưa có dòng tổng hợp | chưa nối `renderRollupLine` | Hiện phần từng-vòng, **nói rõ** dòng tổng hợp chưa được ghi | Không bịa số cộng dồn |

</frozen-after-approval>

## Code Map

- `prisma/schema.prisma` -- `model ScanLog`, `model ScanLogEntry` — hai bảng nhật ký (`AD-UI-14`), chỉ đọc
- `src/core/scanlog.ts` -- `readScanRollup:377` — **đọc để hiểu hình dạng, không nhập vào caps**
- `src/scan/journal.ts` -- `renderCycleLine`, `renderRollupLine:75` — chữ hiển thị đã được soạn; bắt chước cách diễn đạt
- `src/capability/caps/ui.ts` -- thêm lượt đọc cạnh `readAdminMetrics:399`
- `src/app/admin/page.tsx` -- khuôn bề mặt chỉ đọc có `Suspense`; cũng là chỗ đặt liên kết sang `S9`
- `src/app/_vocab.ts` -- nhãn lý do dừng và mã lỗi → câu tiếng Việt

## Tasks & Acceptance

**Execution:**
- [ ] `src/capability/caps/ui.ts` -- lượt đọc nhật ký: các vòng gần nhất kèm số Công ty đã quét trên tổng, số nội dung mới, số mục đã thêm, thời lượng, lý do dừng -- `FR-39`
- [ ] `src/app/_types.ts` -- kiểu dòng nhật ký -- một nguồn kiểu
- [ ] `src/app/_vocab.ts` -- ánh xạ mã lỗi và lý do dừng sang câu **nói việc phải làm** -- *Giọng chữ*
- [ ] `src/app/scan-log/page.tsx` -- bề mặt `S9`, `Suspense` riêng, ba trạng thái rỗng/lỗi/AI-tắt -- `EXPERIENCE.md`
- [ ] `src/app/admin/page.tsx` + `src/app/layout.tsx` -- lối vào `S9` (cả hai vai đọc được, `EXPERIENCE.md` `S9`) -- IA đóng

**Acceptance Criteria:**
- Given hai vòng quét đã chạy, when mở `/scan-log`, then thấy **đúng hai dòng**, mỗi dòng đủ sáu trường của `FR-39`.
- Given một vòng bị bỏ vì vòng trước chưa xong, when mở nhật ký, then vòng đó vẫn là **một dòng** kèm lý do.
- Given chưa vòng nào chạy, when mở nhật ký, then thấy câu rỗng đúng chữ, **không** phải bảng trắng.

## Verification

**Commands:**
- `npx tsc --noEmit` -- expected: sạch
- `npm run lint` -- expected: không lỗi mới
- `npx playwright test e2e/T8.spec.ts` -- expected: không hồi quy

**Manual checks (if no CLI):**
- Chạy hai chu kỳ demo rồi mở `/scan-log`: số mục đã thêm trên nhật ký phải khớp số mục mới đếm được trên Dòng thời gian.
