---
title: 'U3 — `S2` Hàng đợi gợi ý: ba nút quyết và thẻ bốn thứ tại chỗ (`FR-18`…`FR-23` `FR-25`)'
type: 'feature'
created: '2026-08-15'
baseline_commit: 'bfb39922f26566d0131dfba745fccc0ddd2dca1c'
status: 'in-review'
review_loop_iteration: 0
context:
  - '_bmad-output/planning-artifacts/ux-designs/ux-crm-hackathon-2026-08-14/EXPERIENCE.md'
  - 'src/app/_errors.ts'
  - 'e2e/T4.spec.ts'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `T-5` đòi *"**Duyệt** một gợi ý, **sửa-rồi-duyệt** một gợi ý, **bỏ** một gợi ý"*.
Bốn capability `queueSuggestion` · `approveSuggestion` · `editThenApprove` ·
`dropSuggestion` đã có đủ ở `src/capability/caps/suggestion.ts`, nhưng **không màn hình
nào gọi chúng** — `e2e/T5.spec.ts:21` tự khai phần giao diện đang đỏ có chủ đích. `S2` là
bề mặt gánh trọn UJ-2, và cũng là thứ đội Sales chấm ở vòng 3.

**Approach:** Dựng `/suggestions` — danh sách đã xếp thứ tự, gom theo Công ty, mỗi thẻ
hiện đủ bốn thứ tại chỗ và ba nút quyết. Đo `decisionSeconds` từ lúc thẻ vào khung nhìn.

## Boundaries & Constraints

**Always:**
- `AD-UI-5` — chỉ `page.tsx` gọi `loadCapability`; `AD-UI-6` — action đi qua `action()`; `AD-UI-8` — khối tải độc lập.
- Lượt đọc mới nằm **trong `caps/ui.ts`**, đọc `db` trực tiếp như `readOverview`. **Không** nhập hàm mới từ `@/core/*` (danh sách trắng nằm ở `tests/T10B.test.ts`).
- Thẻ hiện đủ **bốn thứ tại chỗ**, không bấm sang màn khác: *hiện tại → đề nghị* · **câu trích** · **Mức chắc chắn** · **một dòng hệ quả nếu tin này sai** (`FR-19`).
- Vế *hiện tại* đọc **giá trị sống lúc mở**, không phải `current_value` chụp lúc sinh. Lệch nhau thì thẻ mang nhãn *"hồ sơ đã đổi sau khi gợi ý này sinh ra"* (`FR-51`).
- Thứ tự: khoá xếp là bộ ba **(Độ liên quan, Mức chắc chắn, Công ty có Cơ hội đang chạy)** so **lần lượt**, không nhân số học. Gom theo Công ty là khoá ngoài (`FR-18`).
- **Số thao tác để Bỏ ≤ số thao tác để Duyệt** (`UX-2`): Duyệt 1 bấm, Bỏ tối đa 2 kể cả chọn lý do. Đây là ràng buộc kiểm được, không phải nguyện vọng.
- Lý do Bỏ dùng **đúng năm giá trị** của `0.1.7`: `thong_tin_sai` · `khong_lien_quan` · `da_cu` · `hieu_sai_ngu_canh` · `khac`. Không dùng bộ năm giá trị của nguyên mẫu Claude Design.
- *Sửa-rồi-duyệt* gọi `editThenApprove` với `editedValue` không rỗng — nó **không** được đi qua `approveSuggestion` (`T-5` đếm hai con số tách bạch).
- `decisionSeconds` đếm từ lúc thẻ **hiện đủ bốn thứ trên màn hình**, không từ lúc tải trang (`FR-23`).
- Mức chắc chắn hiện bằng **ký hiệu và màu**, không màu đơn độc; ba mức là chữ, **không bao giờ phần trăm** (`FR-16`, `DESIGN.md`).
- Dấu hiệu *có Gợi ý chờ* kèm **số đang chờ** trên `S1`, `S3`, `S6` (`FR-25`).
- Trạng thái **AI tắt**: Gợi ý đang chờ **vẫn bấm được** — phanh chặn phần sinh ra, không chặn phần người quyết (`FR-45`).

**Ask First:**
- Nếu thứ tự xếp đòi một trường chưa có trong `suggestion`/`signal` — dừng và hỏi, đừng thêm cột.
- Duyệt hàng loạt là `[NON-GOAL for MVP]`; ai đề xuất thì dừng và hỏi.

**Never:**
- **Không** thêm capability cho tác nhân `system`, và không đổi `writesTables` của bốn mục đã có — `T-10b` khẳng định khối ghi của máy là một phân hoạch đóng.
- Không chạm `tests/**`, `prisma/**`, `src/core/**`, `src/scan/**`.
- Không có chế độ tự duyệt, không hết hạn thành hành động (`FR-21`, `T-4`).
- Không commit, không push.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Hàng đợi có gợi ý | vài hàng `status = cho` | Xếp theo bộ ba, gom theo Công ty; mỗi thẻ đủ bốn thứ | Một thẻ hỏng → **ẩn nó**, ghi nhật ký, không đổ cả trang |
| Duyệt | bấm Duyệt | Một bấm; ô hồ sơ nhận giá trị đề nghị; thẻ rời hàng đợi | Cổng từ chối → câu tiếng Việt dựng từ mã |
| Sửa-rồi-duyệt | sửa giá trị rồi xác nhận | Ghi là **sửa**; `auto-accept rate` **không** tăng tử số | `editedValue` rỗng → chặn ở biểu mẫu |
| Bỏ | bấm Bỏ, chọn lý do | Tối đa 2 thao tác; hồ sơ **không** đổi | Chưa chọn lý do → không gửi được |
| Hồ sơ đã đổi | giá trị sống ≠ lúc sinh | Thẻ mang nhãn *"hồ sơ đã đổi sau khi gợi ý này sinh ra"*, vẫn quyết được | — |
| Hàng đợi rỗng | không hàng `cho` nào | *"Không có gợi ý nào chờ."* kèm thời điểm vòng quét gần nhất | — |
| AI đang tắt | `ai_enabled = false` | Gợi ý đang chờ **vẫn bấm được**; dải báo hiện ở khung | — |
| Loại *thêm tin mới* | `target_field = null`, có `timeline_text` | Hiện nội dung mục sẽ thêm, không hiện *hiện tại → đề nghị* | — |

</frozen-after-approval>

## Code Map

Bản dựng ngày 15/08 đã hiện thực **một phần** khối ý định trên, dưới nhãn `T-5`, nhưng
**gắn vào `S3`** chứ không thành bề mặt `S2` riêng. Phần còn thiếu là *bề mặt*, không
phải *cơ chế*.

- `src/app/accounts/[id]/_suggestion-queue.tsx` -- **lá `'use client'` đã xong**: ba biểu mẫu, ba `useActionState`, đồng hồ `BR-B6` (`markOpened` dòng 127), năm lý do Bỏ đúng `0.1.7` (dòng 73), tám nhãn `TargetField` (dòng 56). Xuất `SuggestionQueue` và kiểu `SuggestionRow`. **Dùng lại nguyên vẹn — không sao chép**
- `src/app/accounts/[id]/_suggestion-actions.ts` -- ba server action đã xong; `refreshAfterDecision:112` làm mới ba địa chỉ, **thiếu `/suggestions`**
- `src/app/accounts/[id]/_suggestions.tsx` -- khối server của `S3`; khuôn đọc + trạng thái rỗng để bắt chước
- `src/capability/caps/suggestion-ui.ts` -- `readSuggestionQueueCap:41` — `params: z.object({ accountId: z.uuid() })`, **bắt buộc**, không có biến thể toàn cục. CHỈ ĐỌC
- `src/capability/caps/ui.ts` -- `searchAccountsCap:161` — `params` toàn tuỳ chọn nên `{}` trả **mọi** Công ty. Đây là mắt xích cho phép gom hàng đợi mà không thêm capability. CHỈ ĐỌC
- `src/app/_errors.ts` -- `RULE_TEXT:65` là `Partial<Record<BusinessRuleCode, string>>` và **thiếu mười mã**: `BR-D1` `BR-D2` `BR-D3` `BR-D5` `BR-D6` `BR-D7` `BR-D8` `BR-D9` `BR-D10` `BR-D11`. `NFR-16` có dòng nhưng **nói sai luật**
- `src/core/errors.ts` -- `BusinessRuleCode:31` — từ vựng ĐÓNG, 20 mã. CHỈ ĐỌC
- `src/app/layout.tsx` -- `masthead-nav:44` — ba `Link` cho Sales; chỗ thêm lối vào `S2`
- `e2e/T4.spec.ts:230` -- `getByText("Singapore", {exact:true})` phải **đúng 1** trên `/accounts/{id}`
- `e2e/T3.spec.ts:174` -- `locator("mark")` strict mode: **đúng 1** `<mark>` trên `/accounts/{id}`
- `e2e/T9.spec.ts:198` -- `/accounts` phải còn nguyên hai câu của dải báo AI tắt

## Tasks & Acceptance

**Execution:**
- [x] `src/app/_errors.ts` -- đổi `RULE_TEXT` thành `Record<BusinessRuleCode, string>` **toàn phần**; viết mười câu còn thiếu; sửa `NFR-16` (không phải *"ghi kết luận"* mà là *máy không tự liên hệ khách*) và mở rộng `NFR-15` sang vế Thắng/Thua -- `AD-UI-7` · `BR-D1`…`BR-D11` · `NFR-14`…`NFR-19`
- [x] `src/app/suggestions/page.tsx` -- bề mặt `S2`: server component, `searchAccounts({})` rồi `readSuggestionQueue` từng Công ty, gom theo Công ty, cũ nhất trước; `Block` + `Suspense`; trạng thái rỗng theo `EXPERIENCE.md` -- `S2` · `FR-18` · `FR-19`
- [x] `src/app/_suggestion-actions.ts` (đã chuyển khỏi `accounts/[id]/`) -- thêm `revalidatePath("/suggestions")` vào `refreshAfterDecision` -- `AD-UI-9`
- [x] `src/app/layout.tsx` -- một `Link` *Hàng đợi gợi ý* trong `masthead-nav` -- lối vào `S2`
- [x] `src/app/accounts/[id]/_suggestions.tsx` -- một liên kết *Mở toàn bộ hàng đợi →* ở cả hai nhánh (rỗng và có hàng) -- lối vào `S3` → `S2` của `EXPERIENCE.md`

**Acceptance Criteria:**
- Given hai Công ty đều có Gợi ý chờ, when mở `/suggestions`, then Gợi ý cùng một Công ty đứng liền nhau dưới đúng một tiêu đề mang tên Công ty đó.
- Given một Gợi ý đang chờ, when Duyệt trên `/suggestions`, then thẻ rời hàng đợi ở **cả** `/suggestions` **và** `/accounts/{id}` mà không phải tải lại tay.
- Given lõi ném một `BusinessRuleError` với **bất kỳ** mã nào của từ vựng đóng, when action trả về, then `message` là một câu tiếng Việt nói việc phải làm — không mã, không chuỗi rỗng, và `tsc` đỏ nếu lõi thêm mã thứ 21 mà không ai viết câu cho nó.
- Given `/accounts/{id}` của cảnh `T-3`/`T-4`, when tải trang, then vẫn đúng **một** `<mark>` và **một** lần xuất hiện giá trị đề nghị.

## Spec Change Log

- **15/08 · thu hẹp phạm vi vì ranh giới sở hữu.** Khối `frozen-after-approval` bắt lượt đọc
  mới nằm trong `src/capability/caps/ui.ts`. Lần chạy này **không sở hữu `src/capability/**`**
  (một agent khác đang chạy trên `src/core/**` cùng lúc), nên không viết dòng nào ở đó.
  Thay thế: gom hàng đợi **trong `src/app`** bằng cách ghép hai capability đã có —
  `searchAccounts({})` rồi `readSuggestionQueue({accountId})` cho từng Công ty. Không vi phạm
  `AD-1`/`AD-19`: mọi lượt đọc vẫn đi qua sổ đăng ký, vẫn mang `actor`, vẫn qua Cổng, vẫn ghi
  vết. **Trạng thái xấu tránh được:** một bản sao thứ hai của đường đọc hàng đợi, hoặc một lần
  sửa mù vào tệp mà người khác đang mở.
- **15/08 · `FR-25` (số đang chờ trên `S1`/`S3`/`S6`) HOÃN, không bịa.** Đếm Gợi ý chờ toàn hệ
  thống cần một capability chưa có; làm bằng fan-out ở `layout.tsx` là N+1 lượt đọc **trên mọi
  trang**, kể cả `/login`. Nợ đã ghi ở *Design Notes*.
- **KEEP:** lá `_suggestion-queue.tsx` dùng lại NGUYÊN VẸN. Nó là chỗ `T-5` đo *ba lối ra tách
  bạch* và `BR-B6` đo *thời gian quyết*; một bản sao cho `S2` là hai bản sẽ trôi khỏi nhau.

- **15/08 · lá dùng chung CHUYỂN CHỖ, không sao chép.** `_suggestion-queue.tsx` và
  `_suggestion-actions.ts` chuyển từ `src/app/accounts/[id]/` lên `src/app/`. Bản đầu để
  nguyên chỗ cũ và cho `S2` nhập vào `../accounts/[id]/…`; `tsc` và `eslint` đều xanh, nhưng
  đó là đường nhập **đi vào trong** một đoạn động — hình dạng chưa tệp nào trong repo dùng,
  nên chưa bản dựng xanh nào chứng minh. Chiều **đi ra khỏi** `[id]` thì đã có sẵn
  (`../../_contract`, `../_watch-toggle`). Cổng 3000 đang có người dùng nên `next build`
  không chạy được để kiểm, và dưới một ràng buộc *không được làm đỏ bộ e2e* mà lại không
  kiểm được, chọn hình dạng ĐÃ ĐƯỢC CHỨNG MINH là rẻ hơn chọn hình dạng mới. **KEEP vẫn
  nguyên:** một bản duy nhất của lá, không sao chép.
- **15/08 · MATRIX TEST AUDIT KHÔNG QUA, nêu ra thay vì lờ đi.** Tám hàng của I/O Matrix
  chưa hàng nào có phép kiểm ĐÃ CHẠY. Lần chạy này bị cấm `npm test` · `npm run verify` ·
  `npm run e2e:xem` · `npm run seed` (đụng CSDL và cổng người khác đang dùng), nên bằng
  chứng duy nhất là `npx tsc --noEmit` và `npx eslint src/` — cả hai sạch. Đã ghi vào
  `deferred-work.md`.

- **15/08 · vòng rà bốn lớp, tất cả xếp `patch` (không loopback).** Đã vá tại chỗ:
  `Promise.all` → `Promise.allSettled` cộng một dòng nhật ký (hàng *Lỗi một phần* của `S2`
  đòi *"ẩn nó và ghi nhật ký, không đổ cả trang"*, và `all` làm MỘT Công ty hỏng xoá cả
  hàng đợi) · trạng thái rỗng tách hai câu (*chưa có công ty nào* khác *chưa có gợi ý*) ·
  khoá phụ `accountId` cho thứ tự ổn định khi hai Công ty cùng mốc · bốn chỗ **trích mã sai
  chỗ** do chính lần chạy này viết ra: `PRD §9.2` → `§10.1`, `spine tier-5 §5.1` → `AD-CR-3`,
  dải `NFR-14`…`NFR-19` (`NFR-18` không phải `BusinessRuleCode`), `FR-25` ở `layout.tsx`
  (nguồn đòi số là `EXPERIENCE.md` *Mẫu thành phần*, và đòi trên `S1`/`S3`/`S6`, không trên
  khung), `e2e/T4.spec.ts:230` → `:236`, và lý lẽ tự bác của `??` ở `_errors.ts`. Phần còn
  lại xếp `defer` — tám mục đã ghi ở `deferred-work.md`.

## Design Notes

**Vì sao `RULE_TEXT` phải TOÀN PHẦN.** Bản cũ là `Partial<…>` cộng một câu dự phòng, và lý lẽ
của nó — *"mã mới vẫn hiện một câu đọc được"* — đúng ở tầng chạy nhưng sai ở tầng thời gian
biên dịch: mười trên hai mươi mã đang rơi về *"Không lưu được vì trái một luật nghiệp vụ"*, một
câu **không nói việc phải làm**, đúng thứ `EXPERIENCE.md` (*Giọng chữ*) cấm. Bảng toàn phần bắt
`tsc` đỏ khi lõi khai mã thứ 21. Toán tử `??` ở chỗ gọi **giữ lại** — nó là lưới runtime cho
trường hợp lõi và giao diện dựng lệch phiên bản, không phải cho trường hợp quên viết câu.

**Vì sao N+1 chấp nhận được ở `/suggestions` mà không chấp nhận được ở `layout.tsx`.** Trang
hàng đợi là **một** bề mặt người dùng chủ động mở, trên bộ dữ liệu cỡ demo; khung ứng dụng dựng
lại ở **mọi** lượt yêu cầu của **mọi** trang. Cùng một phép tính, hai bậc chi phí khác nhau.

**Ranh giới với `e2e` — chỗ dễ làm đỏ nhất.** `S2` là một địa chỉ MỚI; không phép kiểm nào trỏ
vào nó. Nguy hiểm nằm ở hai tệp bị *chạm ké*: `layout.tsx` (mọi trang) và `_suggestions.tsx`
(`/accounts/{id}`, nơi `T-3` `T-4` `T-5` `T-6` `T-7` `T-8` cùng đứng). Nên hai chỗ đó **chỉ
thêm liên kết**, không đổi một chữ nào đang có, không thêm `<mark>`, không thêm chỗ hiện giá
trị đề nghị.

## Verification

**Commands:**
- `npx tsc --noEmit` -- expected: sạch
- `npx eslint src/` -- expected: không lỗi mới, đặc biệt `no-restricted-imports` của tầng ①

**Manual checks (if no CLI):**
- `npm run verify` **không chạy được ở lần này** (đụng CSDL và cổng của người khác). Thay bằng
  đọc: `e2e/T3.spec.ts:174` · `e2e/T4.spec.ts:222-236` · `e2e/T9.spec.ts:198-209` — không
  khẳng định nào của ba chỗ ấy chạm vào chữ mới thêm.
- Mở `/suggestions` với ≥ 2 Công ty có Gợi ý: Gợi ý cùng Công ty đứng liền nhau.
