---
title: 'T-5 — Hàng đợi Gợi ý trên hồ sơ Công ty, ba lối ra bấm được'
type: 'feature'
created: '2026-08-15'
status: 'in-review'
baseline_commit: 'bfb39922f26566d0131dfba745fccc0ddd2dca1c'
review_loop_iteration: 0
context:
  - src/capability/caps/suggestion.ts
  - src/app/_contract.ts
  - src/app/board/actions.ts
  - e2e/T5.spec.ts
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `§4`/nhóm 3 đòi một hàng đợi Gợi ý có ba lối ra, nhưng không bề mặt nào
trong `src/app` gọi `approveSuggestion` · `editThenApprove` · `dropSuggestion`. Ba
capability đã đủ ở tầng ④ từ 14/8; *duyệt*, *sửa-rồi-duyệt*, *bỏ* hôm nay **không bấm
được**, nên `T-5` đỏ ở đúng câu nó dựng ra để đo.

**Approach:** Một đường đọc mới ở lõi (`readPendingSuggestions`) → một capability đọc
(`readSuggestionQueue`) → khối server `SuggestionsBlock` → lá `'use client'` giữ ba
biểu mẫu → **ba** server action, mỗi action đúng một capability.

## Boundaries & Constraints

**Always:**
- `AD-1` — `src/app` đi xuống **chỉ** qua `loadCapability`; không `db`, không `@prisma/client`.
- `AD-UI-5` — lá `'use client'` nhận props **đã tuần tự hoá** (`Date` → ISO), không gọi `loadCapability`.
- `AD-UI-6` — **một action, một capability**. Ba lối ra = ba action, mọi action qua `action()` của `src/app/_contract.ts`; `try/catch` chỉ tồn tại trong `action()`.
- `AD-UI-10` · `D28` — **không kiểm vai trong action**. Vai do Cổng canh ở bước ⑤; từ chối quay về thành `ActionState` mang mã `role`.
- `BR-B6` — `decisionSeconds` đo **từ lúc mở chi tiết một Gợi ý**, không từ lúc mở hàng đợi.
- `BR-D10` — lý do Bỏ chọn trong **năm** giá trị của `enum DropReason`, không nhập tự do.
- Định danh tiếng Anh; chữ hiển thị và chú thích tiếng Việt có dấu.

**Ask First:**
- Mở thêm tệp ngoài danh sách sở hữu.
- Bất kỳ ý định sửa `src/capability/registry.ts` (lỗi `account_id = NULL` đã có chủ khác).

**Never:**
- Chạm `page.tsx` · `_signals.tsx` · `_next-action.tsx` · `src/core/suggestion/index.ts` ·
  `src/capability/caps/suggestion.ts` · `src/capability/caps/ui.ts` · `src/scan/**` ·
  `tests/**` · `e2e/**` · `prisma/**` · `package.json`.
- Gộp ba lối ra thành một action tự đoán capability theo dữ liệu.
- *Sửa-rồi-duyệt* mà không cho người **gõ giá trị khác** — khi đó nó chỉ là *Duyệt* đội tên khác.
- Nới khẳng định của `e2e/T5.spec.ts`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Duyệt | Gợi ý `cho`, `fill_field`, người bấm **Duyệt** | `status = duyet`, ô hồ sơ nhận `proposedValue`, `decidedBy`/`decidedAt` có giá trị | N/A |
| Sửa rồi duyệt | Người mở ô sửa, gõ giá trị khác, bấm **Sửa rồi duyệt** | `status = sua_roi_duyet`, ô hồ sơ nhận **giá trị người gõ**; tử số `autoAcceptRate` KHÔNG tăng | `editedValue` rỗng → `nhap_khong_hop_le` |
| Bỏ | Người chọn một trong năm lý do, bấm **Bỏ** | `status = bo`, `dropReason` ghi lại, hồ sơ **giữ nguyên** (`FR-21`) | Thiếu lý do → Zod bác |
| Hàng đợi rỗng | Công ty không có Gợi ý `cho` | Câu trạng thái rỗng, nói việc tiếp theo — không hiện bảng trống | N/A |
| Gợi ý đã bị đóng | Vòng quét vừa đóng bằng `co_goi_y_moi_hon` | Lõi trả `no_op`, không ghi đè; trang tải lại và hàng biến mất | N/A |
| Sales vào mục chỉ Quản trị | Cổng từ chối bước ⑤ | `ActionState` mã `role` → *"Việc này cần tài khoản Quản trị."* | qua `failureFromError` |

</frozen-after-approval>

## Code Map

- `e2e/T5.spec.ts:274-290` — phép kiểm giao diện: `getByRole("button", { name: "Duyệt" }).first()` phải thấy được ở `/accounts/{accountId}`.
- `src/capability/caps/suggestion.ts:118-204` — ba capability đã có: `approveSuggestionCap` (`{suggestionId, decisionSeconds}`), `editThenApproveCap` (**+`editedValue: z.string().min(1)`**), `dropSuggestionCap` (**+`dropReason` enum năm giá trị**). Tất cả `HUMAN_ONLY`.
- `src/core/suggestion/index.ts:259-348` — `decideSuggestion`; ghi có điều kiện `where status = 'cho'`; `TARGET_COLUMN` (dòng 51) là ánh xạ ô đích → cột Prisma, **không xuất ra**.
- `src/app/_contract.ts:58` — `action()`, dòng cưỡng chế; `ActionState`, `IDLE`, `ServerAction`.
- `src/app/board/actions.ts` — khuôn ba action riêng cho ba capability; chú thích *"không kiểm vai ở đây"* (dòng 55-58).
- `src/app/accounts/[id]/actions.ts` — khuôn `revalidatePath` theo `accountId`.
- `src/app/_action-state.tsx` — `ActionMessage`, `SubmitButton` (dùng lại, không sửa).
- `src/capability/caps/ui.ts:63-77` — `READ_COMMON`, khuôn của một mục `kind: "read"`.
- `src/capability/caps/index.ts:20-34` — điểm nạp; `suggestionEntries` đã có, cần thêm `suggestionUiEntries`.
- `prisma/schema.prisma` — `model Suggestion`, `enum SuggestionStatus/DropReason/TargetField`; `model Signal` (`claim`, `quote`).
- `tests/T10B.test.ts:38-77` — `CORE_FUNCTIONS_ALLOWED`; mọi hàm lõi mà một tệp `caps/*.ts` nhập phải có tên trong đó. **`tests/` không thuộc phạm vi này.**

## Tasks & Acceptance

**Execution:**
- [x] `src/core/suggestion/read.ts` — thêm `readPendingSuggestions(actor, accountId)`: đọc Gợi ý `status = "cho"` kèm `claim`/`quote` của Phát hiện, và đọc **sống** giá trị đang có trên hồ sơ cho ô đích (`FR-19`, `FR-51`). Lõi là tầng duy nhất chạm Prisma.
- [x] `src/capability/caps/suggestion-ui.ts` — `readSuggestionQueueCap`: `kind: "read"`, `exposeToMcp: false`, `allowedActors: ["human"]`, `zone: "tu_do"`, `snapshot: null`; tuần tự hoá `Date` → ISO.
- [x] `src/capability/caps/index.ts` — đúng hai dòng: nhập `suggestionUiEntries`, trải vào `GOP`.
- [x] `src/app/accounts/[id]/_suggestion-actions.ts` — ba server action, mỗi cái một `loadCapability`, `revalidatePath` hồ sơ + `/` + `/admin`.
- [x] `src/app/accounts/[id]/_suggestions.tsx` — khối server: đọc qua `loadCapability`, dựng danh sách, trạng thái rỗng; giao phần bấm cho lá `'use client'`.
- [x] `src/app/accounts/[id]/_suggestion-queue.tsx` — lá `'use client'`: ba biểu mẫu, ô gõ giá trị sửa, ô chọn lý do Bỏ, đồng hồ `BR-B6`.

**Acceptance Criteria:**
- Given hồ sơ Công ty có ít nhất một Gợi ý `cho`, when mở `/accounts/{id}`, then thấy nút mang **chữ** `Duyệt`, `Sửa rồi duyệt`, `Bỏ`, chọn được theo vai và chữ.
- Given người mở chi tiết một Gợi ý rồi bấm sau N giây, when action chạy, then `decision_seconds` xấp xỉ N — không phải một hằng số gõ cứng.
- Given Cổng từ chối, when action trả về, then màn hình hiện câu tiếng Việt dựng từ mã, không phải màn hình 500.
- Given `npx tsc --noEmit` và `npx eslint src/`, then cả hai sạch.

## Design Notes

**Vì sao cần lá `'use client'` riêng (`_suggestion-queue.tsx`).** `_suggestions.tsx` phải là
**server component** — `page.tsx` gọi `SuggestionsBlock({accountId})` và khối này gọi
`loadCapability`. Một module không thể vừa là server component vừa mang `'use client'`, và
`_suggestion-actions.ts` là `.ts` nên không chứa được JSX. Bỏ lá client thì mất hai thứ có
mã thượng nguồn: đồng hồ `BR-B6` (đo từ lúc **mở chi tiết**, việc chỉ trình duyệt biết) và
`ActionMessage` cho lần Cổng từ chối (`AD-UI-10`, `D28`). Đây là tệp **mới**, không tệp nào
của ba cục song song chạm tới.

**⚠ CHẶN NGOÀI PHẠM VI — `e2e/T5.spec.ts` tự tiêu hết dữ liệu của phép kiểm giao
diện.** `test.describe.configure({ mode: "serial" })` chạy sáu phép kiểm theo thứ
tự. Phép kiểm ① quyết cả ba Gợi ý của `beforeAll` (`country`, `industry`,
`website`); phép kiểm ⑤ tạo thêm một Gợi ý `revenue_range` rồi cũng
`editThenApprove` nó. Đến phép kiểm ⑥ (dòng 274), Công ty ấy còn **0** Gợi ý
`status = "cho"` — hàng đợi đúng ra phải hiện trạng thái rỗng, nên không nút
`Duyệt` nào tồn tại và `toBeVisible()` đỏ **dù bề mặt hoàn toàn đúng**.

Không sửa được từ phía này: hiện nút `Duyệt` cho một Gợi ý đã quyết là dựng một
nút bấm vào trả `no_op` (lõi ghi có điều kiện `where status = 'cho'`), tức làm
vừa lòng *mặt chữ* của phép kiểm và phá *ý* của nó. `e2e/` thuộc chủ khác. Cách
sửa nhỏ nhất mà **không nới một khẳng định nào**: thêm dữ liệu, không bớt kiểm —
`beforeAll` tạo Gợi ý thứ tư trên một ô chưa ai đụng (ví dụ `specialty_area`) và
để nó nguyên trạng `cho`; hoặc chính phép kiểm ⑥ gọi `createSuggestion` trước khi
`page.goto`.

**Vì sao đọc sống `currentValue`.** Lược đồ ghi rõ *"đọc SỐNG lúc mở, không phải ảnh chụp
lúc sinh"*, và lõi nhắc lại ở `CreateSuggestionInput`. Cột `current_value` là giá trị lúc
**sinh** Gợi ý; hiện nó cho người quyết là hiện một sự thật đã cũ.

## Verification

**Commands:**
- `npx tsc --noEmit` — expected: 0 lỗi.
- `npx eslint src/` — expected: 0 lỗi, 0 cảnh báo.

**Manual checks (if no CLI):**
- `e2e/T5.spec.ts`, `tests/**` **không chạy** trong phạm vi này (`npm test`/`npm run verify` bị cấm). Báo lại tên hàm lõi mới để chủ `tests/` thêm vào `CORE_FUNCTIONS_ALLOWED`.
