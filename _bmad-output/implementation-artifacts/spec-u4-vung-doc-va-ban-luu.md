---
title: 'U4 — Vùng đọc trên `S3` và `S10` Snapshot viewer, một bấm tới đoạn nguồn (`FR-14`…`FR-17` `FR-42`)'
type: 'feature'
created: '2026-08-15'
baseline_commit: 'bfb39922f26566d0131dfba745fccc0ddd2dca1c'
status: 'draft'
review_loop_iteration: 0
context:
  - '_bmad-output/planning-artifacts/ux-designs/ux-crm-hackathon-2026-08-14/EXPERIENCE.md'
  - '_bmad-output/implementation-artifacts/deferred-work.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `T-3` đòi *"**bấm** vào một phát hiện thì mở đúng đoạn văn gốc trong bản lưu,
**có đánh dấu vị trí**"*. `/accounts/[id]` hôm nay chỉ có hồ sơ, Người liên hệ, Cơ hội,
Dòng thời gian — **không khối nào hiện Phát hiện**, nên không có gì để bấm
(`e2e/T3.spec.ts:147`). Đây cũng là bề mặt duy nhất chứng minh mệnh đề *"mọi thứ máy nói
đều truy được về nguồn đúng câu chữ"* — thứ cho phép máy có quyền tự ghi.

**Approach:** Thêm Vùng đọc vào `S3` — một khu **riêng**, không phải hồ sơ và không phải
Dòng thời gian — liệt Bản lưu và Phát hiện; bấm một Phát hiện mở `S10` tại đúng đoạn, câu
trích bọc trong `<mark>`.

## Boundaries & Constraints

**Always:**
- Vùng đọc là **khu riêng** trên `S3`. Cho Phát hiện chạy thẳng lên Dòng thời gian là biến nhóm 2 thành nhóm 5 (`FR-14`).
- Đánh dấu vị trí dùng thẻ **`<mark>`** — thẻ ngữ nghĩa, trình đọc màn hình công bố được. Một `<span class="highlight">` tô vàng y hệt nhưng câm, và `e2e/T3.spec.ts` cố ý **không** nhận nó.
- Câu trích giữ **nguyên ngôn ngữ gốc** và khai `lang` riêng; câu nhận định tiếng Việt (`D33`, *Sàn khả năng tiếp cận*).
- Mức chắc chắn: **ký hiệu và màu**, không màu đơn độc, không phần trăm (`FR-16`). Ba ký hiệu của `DESIGN.md`: ● Chắc · ◐ Có thể · ○ Đoán.
- Nguồn không đọc được: Vùng đọc ghi **không đọc được** kèm lý do (`doc_duoc`), **không đoán**, không tạo khối rỗng im lặng (`FR-11`, `EXPERIENCE.md` `S3` hàng *Lỗi một phần*).
- Đọc lại không xoá Phát hiện cũ: bản mới nằm **cạnh** bản cũ, mỗi cái mang thời điểm riêng (`FR-17`).
- Lượt đọc mới nằm trong `caps/ui.ts`, đọc `db` trực tiếp, **không** nhập hàm mới từ `@/core/*`.
- `AD-UI-5` · `AD-UI-6` · `AD-UI-8` như mọi bề mặt khác; Vùng đọc có `Suspense` riêng.
- Trạng thái **AI tắt**: Vùng đọc **giữ nguyên nội dung cũ**, chỉ ngừng sinh mới.

**Ask First:**
- **Bẫy đã biết, đọc trước khi dựng:** `createSignal` lưu `quote` **thô** nhưng lưu offset của `normalize(quote)` (deferred-work, spec-t). Với câu trích có dấu cách kép hoặc CRLF thì `normalizedText.slice(quote_start, quote_end) !== signal.quote` — `S10` sẽ tô **một đoạn khác** với chữ nó hiển thị, đúng thứ `T-3` phải chứng minh là không xảy ra. Nếu gặp ca lệch: **dừng và hỏi**, đừng tự chọn giữa hai cách sửa (lưu `normalize(quote)`, hay lưu cả hai dạng) — chỗ sửa nằm ở `src/core`, ngoài phạm vi spec này.
- Nút *không hữu ích* (`FR-42`) cần mục sổ đăng ký cho `markSignalUnhelpful`, vốn **chưa tồn tại**. Hàm lõi đã nằm trong danh sách trắng của `T-10b`, nên thêm mục là hợp lệ — nhưng nó là một quyền ghi mới, nên **hỏi trước khi thêm**.

**Never:**
- **Không** cho phép xoá một Phát hiện, ở bất kỳ vai nào — Phát hiện là bằng chứng (`§6` ma trận vai).
- Không thêm capability cho tác nhân `system`.
- Không chạm `tests/**`, `prisma/**`, `src/core/**`, `src/scan/**`.
- Không commit, không push.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Bấm một Phát hiện | Phát hiện có `quote_start`/`quote_end` | `S10` mở **đúng đoạn**, câu trích bọc `<mark>`, **một** bấm (`UX-3`) | — |
| Không tìm thấy đoạn | offset không khớp | Mở Bản lưu **ở đầu** và **nói rõ** không định vị được | Không tô bừa một đoạn khác |
| Nguồn không đọc được | `doc_duoc = false` | *"Không đọc được nguồn của <Công ty>. Vòng sau thử lại."* kèm lý do | Không tạo Bản lưu rỗng |
| Vùng đọc rỗng | Công ty chưa có Bản lưu | *"Chưa đọc nguồn nào cho account này."* | — |
| Đọc lại cùng nguồn | có Bản lưu mới | Phát hiện mới **cạnh** cái cũ, mỗi cái một mốc thời gian | — |
| Ba Mức chắc chắn | `chac` / `co_the` / `doan` | Ba ký hiệu **và** ba bộ màu; đọc được khi tắt màu | — |
| AI đang tắt | `ai_enabled = false` | Nội dung cũ giữ nguyên, mở được như thường | — |

</frozen-after-approval>

## Code Map

- `src/capability/caps/read-shared.ts` -- `readArticleCap:60` — hợp đồng đã được vá ở commit `410b434`; đọc để biết `scope` nào trả hình dạng nào
- `src/capability/caps/ui.ts` -- thêm lượt đọc Vùng đọc (Bản lưu + Phát hiện của một Công ty) cạnh `readAccountTimeline:284`
- `src/core/article.ts` -- Bản lưu: bản thô và bản chuẩn hoá, `readable` + lý do
- `prisma/schema.prisma` -- `model Signal` — `quote`, `quote_start`, `quote_end`, `confidence`, `relevance` (chỉ đọc)
- `src/app/accounts/[id]/page.tsx` -- nơi Vùng đọc gắn vào, theo khuôn `TimelineBlock`
- `e2e/T3.spec.ts` -- hợp đồng giao diện đã viết sẵn: `getByText` câu nhận định → `click` → `locator("mark")`

## Tasks & Acceptance

**Execution:**
- [ ] `src/capability/caps/ui.ts` -- lượt đọc Vùng đọc: Bản lưu (kèm `readable` và lý do) và Phát hiện của Công ty, mới nhất trên -- `FR-14` `FR-17`
- [ ] `src/app/_types.ts` -- kiểu Vùng đọc và Phát hiện -- một nguồn kiểu
- [ ] `src/app/_vocab.ts` -- nhãn ba Mức chắc chắn kèm ký hiệu, nhãn sáu Loại tin -- `0.1.3`, `0.1.4`
- [ ] `src/app/accounts/[id]/_reading-area.tsx` -- khối Vùng đọc, mỗi Phát hiện là một liên kết tới `S10` -- `FR-14` `FR-16`
- [ ] `src/app/accounts/[id]/page.tsx` -- gắn vào `Suspense` riêng -- `AD-UI-8`
- [ ] `src/app/articles/[id]/page.tsx` -- `S10`: dựng Bản lưu, bọc đoạn `[quote_start, quote_end)` trong `<mark>` -- `FR-15` `T-3`
- [ ] `src/app/globals.css` -- kiểu cho `<mark>` và ba nhãn Mức chắc chắn theo **mẫu ba thành phần** (nền gần trắng + viền màu + chữ đậm) -- `DESIGN.md`

**Acceptance Criteria:**
- Given một Phát hiện trên màn Công ty, when bấm vào nó, then `S10` mở đúng Bản lưu và **một phần tử `<mark>` bọc đúng câu trích** — không phải cả đoạn được tô.
- Given một nguồn không đọc được, when mở Vùng đọc, then thấy câu *không đọc được* kèm lý do, và **không** Phát hiện bịa nào.
- Given ba Phát hiện ba Mức chắc chắn, when in màn hình đen trắng, then vẫn phân biệt được ba mức.

## Verification

**Commands:**
- `npx tsc --noEmit` -- expected: sạch
- `npx playwright test e2e/T3.spec.ts` -- expected: cả ba bước (hiện · bấm · `<mark>`) xanh

**Manual checks (if no CLI):**
- So `normalizedText.slice(quote_start, quote_end)` với `signal.quote` trên vài hàng thật: khác nhau thì dừng theo mục **Ask First**, đừng vá ở tầng hiển thị.
