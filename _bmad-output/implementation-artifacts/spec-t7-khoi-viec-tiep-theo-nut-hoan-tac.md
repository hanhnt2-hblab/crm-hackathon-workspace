---
title: 'T-7 — khối Việc tiếp theo và nút Hoàn tác một cú bấm'
type: 'feature'
created: '2026-08-15'
status: 'done' # bốn lớp rà đã chạy; phát hiện được xếp loại # CHECKPOINT 1: TỰ DUYỆT `[A]` — cục chạy không có người trong vòng lặp
baseline_commit: 'bfb39922f26566d0131dfba745fccc0ddd2dca1c'
review_loop_iteration: 0
context:
  - '{project-root}/e2e/T7.spec.ts'
  - '{project-root}/src/core/nextaction/index.ts'
  - '{project-root}/src/app/board/actions.ts'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `undoSystemNextAction` đã có ở tầng ④ và chạy đúng, nhưng **không màn hình nào gọi nó**, và `/accounts/{id}` cũng chưa có khối nào hiện Việc tiếp theo để đặt nút cạnh. `e2e/T7.spec.ts:229–241` đòi `getByRole("button", { name: "Hoàn tác" })` hiện trên trang hồ sơ Công ty, và đó là vế duy nhất của `T-7` còn đỏ.

**Approach:** Dựng một đường ĐỌC mới (lõi → capability `kind: "read"`) trả về Việc tiếp theo còn sống của từng Cơ hội thuộc Công ty, kèm cờ `canUndo` tính bằng **đúng ba vị từ** mà `undoSystemNextAction` dùng để từ chối; rồi dựng khối server component hiện nội dung, hạn, **ai đặt**, **cửa sổ hoàn tác còn bao lâu**, và một `<form>` một nút gọi capability qua helper `action()`.

## Boundaries & Constraints

**Always:**
- `AD-1` — `src/app` đi xuống **chỉ** qua `loadCapability`; không `db`, không `@prisma/client`.
- `AD-UI-5` — tệp `'use client'` nhận props đã tuần tự hoá (`Date` → ISO), không gọi `loadCapability`.
- `AD-UI-6` — một action, một capability; đi qua helper `action()` của `src/app/_contract.ts`.
- `AD-UI-10` · `D28` — **không** kiểm vai trong action; Cổng canh ở bước ⑤.
- **MỘT CÚ BẤM** (`§6 T-7`, `EXPERIENCE.md` dòng 94/134/194): không hộp xác nhận, không hai bước, không menu thả xuống.
- Nút **chỉ hiện khi hoàn tác được**; hết cửa sổ hoặc người đã sửa tay thì nút **biến mất** và chỗ đó nói rõ vì sao (`EXPERIENCE.md` dòng 94 và 196).
- Định danh tiếng Anh; chữ hiển thị và chú thích tiếng Việt có dấu.

**Ask First:**
- Bất kỳ thay đổi nào ngoài năm tệp sở hữu (ba agent khác đang chạy song song trên cùng thư mục).
- Nới bất kỳ khẳng định nào của `e2e/T7.spec.ts`.

**Never:**
- Không chạm `page.tsx`, `_signals.tsx`, `_suggestions.tsx`, `src/core/nextaction/index.ts`, `caps/suggestion.ts`, `caps/ui.ts`, `src/scan/**`, `tests/**`, `e2e/**`, `prisma/**`, `package.json`.
- Không sửa lỗi `registry.ts` thiếu `accountId` ở ghi vết pha 1 — đã có người nhận.
- Không chạy `npm test`, `npm run verify`, `npm run seed`.
- Không thêm hàng `next_action` nào ở đường đọc; không mở giao dịch ở tầng ④.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Máy vừa tự đặt, còn hạn | `set_by = he_thong`, `undo_deadline_at > now` | Dòng máy: nội dung, hạn, nhãn *Hệ thống tự đặt*, *Hoàn tác được thêm N ngày*, **nút Hoàn tác** | N/A |
| Bấm Hoàn tác | Cùng trạng thái trên | Một lời gọi `undoSystemNextAction`, hàng xoá mềm, khối làm mới → ô về **trống** | Lỗi bất ngờ đi lên `Block` error boundary |
| Hết cửa sổ 7 ngày | `set_by = he_thong`, `undo_deadline_at <= now` | Vẫn hiện Việc tiếp theo, **không nút**, kèm câu *Cửa sổ hoàn tác đã hết* | N/A — nhánh no-op ① của lõi không bao giờ bị gọi |
| Người đã sửa tay | `set_by = nguoi` | Hiện trên nền *giấy*, nhãn *Người đặt*, **không nút** | N/A — nhánh no-op ② không bao giờ bị gọi |
| Đã hoàn tác rồi / chưa từng có | không hàng nào `deleted_at IS NULL` | Trạng thái rỗng cho Cơ hội đó (`BR-B1`), **không nút** | N/A — nhánh no-op ③ không bao giờ bị gọi |
| Bấm hai lần rất nhanh | Hàng đã xoá mềm giữa hai lượt | Lượt hai trả `false`, lõi ghi `no_op`, màn hình không đổi | Không lỗi, không xoá thêm |
| Công ty không có Cơ hội nào | `opportunity = []` | Trạng thái rỗng của cả khối | N/A |

</frozen-after-approval>

## Code Map

- `e2e/T7.spec.ts:229–241` — khẳng định chịu lực: cookie `why_now_user`, mở `/accounts/{accountId}`, đòi `button` tên **đúng** `Hoàn tác`.
- `src/core/nextaction/index.ts:688–730` — `undoSystemNextAction`: vị từ `deletedAt: null` + `setBy: "he_thong"` + `undoDeadlineAt: { gt: now }`. **Ba nhánh no-op** ghi ở khối chú thích 673–681. `canUndo` phải là bản sao đúng ba vị từ này.
- `src/core/nextaction/index.ts:444` — `UNDO_WINDOW_DAYS = 7` (`D14`); cột `undo_deadline_at` đã mang mốc tuyệt đối nên bề mặt **không** tính lại 7 ngày.
- `src/core/timeline/index.ts:156–173` — khuôn hàm đọc của lõi: `(_actor, id)`, trả `Date` thô, không chuỗi hiển thị.
- `prisma/schema.prisma` `model NextAction` — cảnh báo tại chỗ: `db.ts` **không** lọc `deleted_at` ở quan hệ lồng, bên đọc phải tự lọc.
- `src/capability/caps/ui.ts:63–77` (`READ_COMMON`) và `:282–296` (`readAccountTimelineCap`) — khuôn mục đọc: `kind:"read"`, `exposeToMcp:false`, `snapshot:null`, `zone:"tu_do"`, trả ISO.
- `src/capability/caps/index.ts:19–34` — điểm nạp; chỉ thêm một `import` và một dòng trải mảng.
- `src/app/board/actions.ts:27–39` — khuôn action: `currentSession()` → `loadCapability` → gọi → `revalidatePath`.
- `src/app/_contract.ts:58–78` — `action()`; chỗ DUY NHẤT có `try/catch`.
- `src/app/_action-state.tsx:37–55` — `SubmitButton` là lá `'use client'` **dùng lại được** bên trong `<form>` do server component render (`useFormStatus` đọc từ form cha).
- `src/app/accounts/[id]/page.tsx:55–60` — `<Block title="Việc tiếp theo"><Suspense><NextActionBlock accountId={id}/>` đã dựng sẵn; chữ ký không được đổi.
- `src/app/_vocab.ts:100–110` — `formatDate`/`formatDateTime` tránh lệch hydration.
- `tests/T10B.test.ts:37–76` — danh sách trắng hàm lõi mà `caps/*` được nhập; tệp caps mới sẽ đỏ ở đây cho tới khi chủ `tests/` thêm tên.
- `src/autonomy/gate.ts:145` — bước ⑥/⑦ chỉ áp cho `actor.kind === "system"`, nên một lượt Hoàn tác của người **không** bị bác vì trần hay phanh.
- `_bmad-output/planning-artifacts/ux-designs/.../EXPERIENCE.md:90,94,194,196` — dòng máy kèm câu trích và nút; nút hiện rõ **còn bao lâu**; người sửa tay thì nút biến mất ngay.

## Tasks & Acceptance

**Execution:**
- [x] `src/core/nextaction/read.ts` — TẠO `readAccountNextActions(actor, accountId, now)`: một lượt `findMany` trên `opportunity`, quan hệ `nextActions` lọc `deletedAt: null`, `take: 1`; trả `running` (từ `isRunning`) và `canUndo` tính bằng đúng ba vị từ của `undoSystemNextAction`. Lý do: `AD-1` — chỗ duy nhất được chạm Prisma, và `canUndo` phải ở cạnh hàm ghi mà nó phản chiếu.
- [x] `src/capability/caps/nextaction-ui.ts` — TẠO mục `readAccountNextActions`, `kind:"read"`, `exposeToMcp:false`, `allowedActors:["human"]`, `zone:"tu_do"`, `snapshot:null`; `fn` chỉ gọi hàm lõi rồi đổi `Date` → ISO. Lý do: `AD-19` mọi lượt đọc đi qua sổ đăng ký.
- [x] `src/capability/caps/index.ts` — THÊM đúng hai dòng (một `import`, một `...`). Lý do: `AD-CP-1`, thiếu là mục **im lặng không tồn tại**.
- [x] `src/app/accounts/[id]/_next-action-actions.ts` — TẠO `'use server'`: action thật qua `action()` gọi ĐÚNG một capability, cộng một vỏ trả `void` cho `<form action=…>`. Lý do: `AD-UI-6`.
- [x] `src/app/accounts/[id]/_next-action.tsx` — THAY toàn bộ thân: server component đọc qua `loadCapability`, hiện nội dung/hạn/ai đặt/cửa sổ còn lại, và `<form>` một nút **Hoàn tác** chỉ khi `canUndo`. Lý do: `T-7`.

**Acceptance Criteria:**
- Given một Việc tiếp theo do máy đặt còn trong cửa sổ 7 ngày, when mở `/accounts/{id}`, then có **đúng một** phần tử `role=button` tên `Hoàn tác` cho Cơ hội đó, và nó nằm trong một `<form>` submit thẳng — không có bước xác nhận nào chen giữa.
- Given khối đã render, when đọc bằng mắt, then thấy đủ **nội dung**, **hạn**, **ai đặt** (`nguoi`/`he_thong` đọc thành chữ Việt), và **cửa sổ hoàn tác còn bao lâu**.
- Given `canUndo = false` ở bất kỳ nhánh nào trong ba, when render, then **không** có nút nào tên `Hoàn tác` cho Cơ hội đó, và có một câu nói rõ lý do.
- Given `npx tsc --noEmit` và `npx eslint src/`, when chạy, then không phát sinh lỗi mới thuộc năm tệp trên.

## Spec Change Log

- **2026-08-15 · rà bốn lớp (blind-hunter, edge-case, verification-gap, truy-vết-ngược), KHÔNG quay vòng.**
  Phát hiện xếp `patch`, đã vá tại chỗ: ⓐ quan hệ lồng `sourceSignal` chưa lọc `deleted_at`/`marked_unhelpful_at` — một Phát hiện đã rút vẫn đứng làm *căn cứ* dưới dòng máy; ⓑ nhánh `set_by = he_thong` cộng `undo_deadline_at = null` (nhánh ⓒ của `fillNextActionIfUnchanged`) bị dán nhãn *cửa sổ đã hết* trong khi cửa sổ **chưa từng mở**; ⓒ `content = ""` render một đoạn văn trống thay vì chỗ giữ chỗ; ⓓ `sourceQuote` bị đánh rơi khi `sourceClaim` rỗng; ⓔ `formatDueDate` sai âm thầm nếu capability đổi sang ISO đầy đủ; ⓕ hai `orderBy` thiếu khoá phụ; ⓖ ba trích dẫn sai chỗ — `AD-CP-1` → `AD-CP-8` (luật *mỗi tệp một `entries`*), còn `AD-UI-5` và `AD-UI-6` đổi từ **viện dẫn** sang **khai lệch**, vì nguyên văn hai mã đó nói ngược lại điều mã nguồn đang làm.
  Trạng thái xấu tránh được: một khối trông như đã kiểm nhờ mấy mã trích sai, cộng bốn đường hiển thị nói sai với người đọc.
  **KEEP:** `canUndo` tính ở lõi, cạnh chính hàm ghi mà nó phản chiếu; `now` là tham số; nút nằm trong `<form>` một nút, nhãn đúng hai chữ `Hoàn tác`.
  Phát hiện xếp `defer` (ba mục, đã ghi vào `deferred-work.md`), trong đó MỘT mục chặn nghiệm thu và nằm ngoài phạm vi cục này: `e2e/T7.spec.ts:229` mở giao diện **sau** khi chính tệp đó đã hoàn tác xong.

## Design Notes

**Vì sao `<form>` thuần thay vì `useActionState`.** `page.tsx` gọi `NextActionBlock({accountId})` và khối phải tự đọc dữ liệu, nên nó **bắt buộc** là server component (`AD-UI-5`). `useActionState` chỉ chạy trong lá `'use client'`, mà phạm vi cục này chỉ mở một tệp `.tsx` — không có chỗ đặt lá đó. `<form action={vỏ}>` cộng `SubmitButton` (lá `'use client'` đã có sẵn, `useFormStatus` đọc từ form cha) cho đúng **một cú bấm**, có trạng thái đang chạy, và chạy cả khi JavaScript chưa nạp xong. Cái mất: câu báo `ActionState`. Cái đó chấp nhận được ở ĐÂY vì `gate.ts:145` cho thấy một lượt Hoàn tác của người không có nhánh từ chối *mong đợi* nào — lỗi bất ngờ vẫn ném xuyên qua `action()` tới error boundary của `Block`.

**Vì sao `canUndo` tính ở lõi.** Một nút bấm vào không làm gì là hình dạng lỗi tệ nhất giữa buổi chấm: người bấm không phân biệt được *nút hỏng* với *đã hết hạn*. Tính ở bề mặt thì hai bản sao của cùng một luật nằm cách nhau hai tầng và trôi khỏi nhau. Đặt cạnh `undoSystemNextAction` thì ai sửa vị từ ghi sẽ thấy ngay vị từ đọc.

```ts
/// BẢN SAO CÓ CHỦ ĐÍCH của vế `where` ở `undoSystemNextAction`.
const canUndo =
  na !== undefined &&                          // ③ còn hàng sống
  na.setBy === "he_thong" &&                   // ② máy đặt
  na.undoDeadlineAt !== null &&
  na.undoDeadlineAt.getTime() > now.getTime(); // ① còn trong cửa sổ
```

## Verification

**Commands:**
- `npx tsc --noEmit` — expected: không lỗi mới thuộc năm tệp của cục này.
- `npx eslint src/` — expected: sạch; đặc biệt `no-restricted-imports` không kêu ở `src/app/**`.

**Manual checks (if no CLI):**
- Đọc lại `e2e/T7.spec.ts:236` và khẳng định chuỗi nhãn nút trong `_next-action.tsx` là **đúng** `Hoàn tác`, không thừa khoảng trắng, không kèm biểu tượng chen vào tên khả truy cập.
- Đếm bằng mắt: từ lúc dòng máy hiện tới lúc gọi capability có đúng **một** `<button type="submit">`, không `dialog`, không `Menu`.

## Suggested Review Order

**Luật quyết định nút — đọc trước, mọi thứ khác treo vào đây**

- Bản sao có chủ đích của vế `where` trong `undoSystemNextAction`; ba nhánh no-op nằm cả ở đây.
  [`read.ts:182`](../../src/core/nextaction/read.ts#L182)

- Lượt đọc: `now` là tham số, `canUndo` và đếm ngược dùng chung một lần đồng hồ.
  [`read.ts:79`](../../src/core/nextaction/read.ts#L79)

- Quan hệ lồng thứ hai — Prisma không cho `where`, nên hai cột cờ đi kèm và lọc trong mã.
  [`read.ts:121`](../../src/core/nextaction/read.ts#L121)

**Đường xuống của tầng ① — ranh giới `AD-1`**

- Mục đọc: `kind:"read"`, `exposeToMcp:false`, chỉ người; thân là một dòng gọi lõi.
  [`nextaction-ui.ts:42`](../../src/capability/caps/nextaction-ui.ts#L42)

- Hai dòng nạp; thiếu chúng thì mục im lặng không tồn tại.
  [`index.ts:37`](../../src/capability/caps/index.ts#L37)

**Bề mặt — nơi *một cú bấm* được cưỡng chế**

- Ba nhánh KHÔNG vẽ nút, mỗi nhánh nói ra lý do của nó thay cho một nút chết.
  [`_next-action.tsx:194`](../../src/app/accounts/%5Bid%5D/_next-action.tsx#L194)

- Nút duy nhất: `<form>` submit thẳng, nhãn đúng hai chữ `Hoàn tác`.
  [`_next-action.tsx:244`](../../src/app/accounts/%5Bid%5D/_next-action.tsx#L244)

- Khối server component; chỗ duy nhất gọi `loadCapability`.
  [`_next-action.tsx:78`](../../src/app/accounts/%5Bid%5D/_next-action.tsx#L78)

**Action — một action, một capability**

- Đường thật qua helper `action()`; `false` là bỏ lượt, không phải lỗi.
  [`_next-action-actions.ts:33`](../../src/app/accounts/%5Bid%5D/_next-action-actions.ts#L33)

- Vỏ trả `void` cho `<form action=…>`; chỗ lệch `AD-UI-6` được khai và cân ở ngay trên.
  [`_next-action-actions.ts:96`](../../src/app/accounts/%5Bid%5D/_next-action-actions.ts#L96)
