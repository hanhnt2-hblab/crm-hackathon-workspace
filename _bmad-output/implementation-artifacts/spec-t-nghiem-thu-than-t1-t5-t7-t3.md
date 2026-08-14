---
title: 'Thân bốn điểm nghiệm thu chạy được — T-1, T-5, T-7, T-3'
type: 'feature'
created: '2026-08-14'
status: 'done' # CHECKPOINT 1 tự duyệt: lượt chạy này không có người trong vòng lặp
baseline_commit: '4dee5324ea720ede183bec6771f4e342d764a168'
review_loop_iteration: 0
context:
  - '{project-root}/docs/Đề bài/Yêu Cầu đề bài chính thức của cuộc thi prd.md'
  - '{project-root}/_bmad-output/planning-artifacts/architecture/architecture-crm-hackathon-2026-08-14/ARCHITECTURE-SPINE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Bốn tệp `tests/T1|T5|T7|T3.test.ts` mới có `it.todo`. Bốn `T` này chặn mốc
**M2**, và tính năng của chúng ĐÃ chạy (lõi ⑤, tầng ④, bề mặt ①) — nên chúng là bốn điểm
duy nhất có thể chuyển xanh ngay mà không đợi vòng quét.

**Approach:** Thay `it.todo` bằng `it` có thân, giữ NGUYÊN VĂN chuỗi mô tả (§6 → truy vết).
Mỗi vế khẳng định ba lớp theo khuôn `T2`/`T10A`: ① lời gọi trả đúng · ② DỮ LIỆU trong CSDL
đúng sau đó · ③ đường đối chứng (người làm được thứ máy không làm được, hoặc ngược lại).
Đường gọi: `createRegistry(...).loadCapability(...)` khi kiểm **đường thật** (đi qua Cổng +
ghi vết), gọi THẲNG lõi khi đề bài nói *"không đi qua giao diện"* hoặc khi chỉ cần dựng dữ liệu.

## Boundaries & Constraints

**Always:**
- Chỉ ghi trong `tests/**`. `src/**`, `prisma/**`, `package.json`, `eslint.config.mjs` là CHỈ ĐỌC.
- Chuỗi mô tả `it` giữ nguyên văn; mỗi phép kiểm trích ít nhất một mã tra được
  (`T-n` · `FR-n` · `BR-*` · `NFR-n` · `D n` · `AD-*`).
- Tự dựng và tự dọn dữ liệu của mình; chạy hai lần liên tiếp cho cùng kết quả (mỗi tệp
  dùng một `user.email` mang `Date.now()`, và mọi khẳng định đếm đều **phạm vi hẹp** theo
  `accountId`/`actorUserId` hoặc đo bằng **delta**, không đếm toàn bảng).
- Tệp nào không kiểm ghi vết thì dùng `createAuditSink({ seedMode: true, keepAudit: false })`
  để không làm bẩn số đo của `T-5`.

**Ask First:** —

**Never:**
- KHÔNG nới khẳng định để làm test xanh. Cách duy nhất để xanh là đổi khẳng định ⇒ mã sản
  phẩm sai ⇒ NÊU RA trong báo cáo, không lặng lẽ sửa.
- KHÔNG chạm `tests/T4|T6|T8|T9.test.ts` (phụ thuộc vòng quét, cục khác đang làm).
- KHÔNG `npm run seed` (chạm CSDL demo 5442).
- KHÔNG giả vờ một khẳng định DOM chứng minh kéo-thả chạy: bộ kiểm là `jsdom`, không có
  trình duyệt. Phần giao diện kiểm ở mức **server action / capability + dữ liệu**, và ghi rõ
  trong chú thích phần nào chỉ kiểm được bằng tay.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| `T-1` tắt AI rồi dùng nhóm 1 | `settings.ai_enabled='false'`, actor người | `createCompany/Contact/Opportunity`, ba lần `changeOpportunityStage`, `createActivity`, `searchAccounts`, `readOverview` đều thành công | Cổng bước ⑦ chỉ áp cho `system` ⇒ người không bị `brake` |
| `T-1` bỏ qua hai ô dấu hiệu | không gọi `setQualificationSignals` | thẻ vẫn sang `du_dieu_kien`; `flags` chứa `BR-B2` | không lỗi — `BR-B2` là cờ, không phải chặn |
| `T-1` lọc kết hợp | `text` + `industry` + `market` cùng lúc | chỉ Công ty khớp CẢ BA | bộ lọc không khớp ⇒ mảng rỗng, không ném |
| `T-5` ba lối ra | 3 Gợi ý `cho` trên 3 ô khác nhau | `duyet` · `sua_roi_duyet` · `bo`; mỗi lối ra một hàng `audit_record` `outcome='ok'` mang `actorUserId` | quyết lại Gợi ý đã quyết ⇒ `no_op`, không ném |
| `T-5` không cộng dồn | delta của `autoAcceptRate()` | tử số **+1**, mẫu số **+3** | `ratio` có thể `null` khi dưới sàn cỡ mẫu — khẳng định trên tử/mẫu, KHÔNG trên `ratio` |
| `T-7` hoàn tác | máy đặt qua `fillNextActionIfUnchanged`, người bấm `undoSystemNextAction` | trả `true`; 0 hàng `next_action` còn sống; 2 hàng ghi vết `ok` | — |
| `T-7` bấm lần hai | gọi lại `undoSystemNextAction` | trả `false`; hàng vẫn đúng một hàng đã xoá mềm, `deletedAt` KHÔNG đổi | vết lần hai là `outcome='no_op'`, KHÔNG phải `ok` |
| `T-3` neo câu trích | `rawText` ≠ `normalizedText` (CRLF + dấu cách kép) | `normalizedText.slice(quoteStart, quoteEnd) === quote` | câu trích không khớp ⇒ `BR-D2`, không lưu |

</frozen-after-approval>

## Code Map

- `tests/T2.test.ts`, `tests/T10A.test.ts` -- KHUÔN: `beforeAll` dựng `user` + dữ liệu, `ctx`
  ghi vết câm, khẳng định theo **mã** chứ không theo thông điệp.
- `tests/setup.ts` · `tests/global-setup.ts` -- ép cổng 5443, `DROP SCHEMA` mỗi lượt chạy.
- `src/capability/registry.ts:63` `createRegistry({seedMode, auditSink})` -- nhà máy, KHÔNG
  singleton; `loadCapability(name, actor)` trả closure đã gắn `actor`.
- `src/app/_registry.ts:32` -- nhánh web dựng `seedMode:false, keepAudit:true`. Bộ kiểm dựng
  thể hiện riêng thay vì nhập tệp này (nó không mang cookie, nhưng dựng riêng thì `T-5` kiểm
  được ghi vết mà `T-1`/`T-3`/`T-7` vẫn câm được).
- `src/app/_session.ts:51` `currentSession()` -- gọi `cookies()` của `next/headers` ⇒ **không
  gọi được** ngoài một lượt yêu cầu Next. Đây là lý do bộ kiểm dừng ở tầng capability.
- `src/capability/caps/account.ts` -- `createCompany` `createContact` `createOpportunity`
  `changeOpportunityStage`(chỉ `human`, `NFR-14`).
- `src/capability/caps/ui.ts:161,236,306,335,426` -- `searchAccounts` (lọc kết hợp, `E1-S10`),
  `readAccountDetail`, `readPipelineBoard`, `readOverview`, `setQualificationSignals`;
  `toOpportunityCard():486` dựng `flags` = `["BR-B2"]`/`["BR-B3"]`.
- `src/capability/caps/suggestion.ts:118,147,178,275,324` -- `approveSuggestion`
  `editThenApprove` `dropSuggestion` `fillNextActionIfUnchanged` `undoSystemNextAction`.
- `src/capability/caps/read-shared.ts:44` -- `readArticle` (đường đọc Bản lưu của `T-3`).
- `src/core/suggestion/index.ts:259` `decideSuggestion` -- ghi có điều kiện `where status='cho'`;
  `FR-22` tách `sua_roi_duyet` khỏi `duyet`.
- `src/core/metrics.ts:37` `autoAcceptRate()` -- tử số CHỈ `duyet`; mẫu số ba lối ra của người.
- `src/core/nextaction/index.ts:340,544` -- `fillNextActionIfUnchanged` (ba nhánh ⓐⓑⓒ),
  `undoSystemNextAction` (xoá mềm, cửa sổ `UNDO_WINDOW_DAYS=7`).
- `src/core/normalize.ts:68` `findQuote` · `src/core/signal/index.ts:114` -- lõi TỰ tính
  offset và bỏ qua giá trị bên gọi đưa; offset đánh chỉ số vào **`normalizedText`** (`AD-18`,
  và chú thích cột `signal.quote_start` của `prisma/schema.prisma:394` nói đúng thế).
- `src/autonomy/gate.ts:145` -- bước ⑥/⑦ CHỈ áp cho `actor.kind==='system'` ⇒ tắt AI không
  chặn người, đúng thứ `T-1` đòi.
- `src/core/settings.ts:17` -- `ai_enabled` sống ở bảng `setting`; `T-1` ghi rồi **dọn**.

## Tasks & Acceptance

**Execution:**
- [x] `tests/_helpers.ts` -- thêm mới: `mutedRegistry()`/`auditedRegistry()`, `mutedCtx`,
  `createTestUser`, `createArticle`, `setSetting`, `dbNow`, `auditRows` -- bốn tệp dùng
  chung, tránh chép bốn lần một khối `beforeAll` và tránh chạm `tests/setup.ts` (`C0-8`).
- [x] `tests/T1.test.ts` -- 7 `it` -- `T-1` §6: tắt AI, trọn nhóm 1 vẫn chạy.
- [x] `tests/T5.test.ts` -- 5 `it` -- `T-5` §6: ba lối ra + bản ghi + không cộng dồn.
- [x] `tests/T7.test.ts` -- 4 `it` -- `T-7` §6: hoàn tác một cú bấm, hai chiều ghi vết.
- [x] `tests/T3.test.ts` -- 2 `it` -- `T-3` §6: neo câu trích, không tính lại ở giao diện.
- [x] `tests/T10B.test.ts` -- cập nhật sau khi sổ đăng ký đổi ở `410b434` (bốn mục mới,
  `readArticle` đổi hợp đồng); thêm hai phép kiểm `AD-11` (van `disableAi` mở được đúng
  lúc trần chạm; `enableAi` không cho `system`). Việc phát sinh, do điều phối giao.
- [x] `tests/unit/capability-callsites.test.ts` -- thêm mới: bắt họ lỗi *lược đồ Zod tầng ④
  lệch lời gọi thật của tầng ①* — đúng hình dạng lỗi `readArticle` vừa gây ra.

**Acceptance Criteria:**
- Given CSDL 5443 vừa dựng, when `npm test`, then bốn tệp trên **xanh** và mã thoát `0`.
- Given chạy `npm test` hai lần liên tiếp, when so kết quả, then giống hệt nhau (không phép
  kiểm nào đếm toàn bảng, không phép kiểm nào phụ thuộc thứ tự tệp).
- Given một `it` chỉ chứng minh được ở mức dữ liệu, when đọc thân nó, then chú thích nói RÕ
  phần giao diện nào còn phải thử tay.

## Design Notes

Vì sao **không** nhập `appRegistry` của `src/app/_registry.ts`: nó dựng sink
`keepAudit: true` ở mức module, nên mọi tệp nhập nó đều đổ hàng vào `audit_record`. `T-5`
đếm hàng ghi vết của chính nó theo `actorUserId`, nên nhiễu từ ba tệp kia phải bằng 0.

Vì sao đo `autoAcceptRate` bằng **delta** chứ không bằng giá trị tuyệt đối: nó `count()` trên
TOÀN bảng `suggestion`, và một tệp kiểm khác thêm một Gợi ý đã quyết là đủ làm khẳng định
tuyệt đối đỏ. Delta đo đúng điều `FR-22` phát biểu và miễn nhiễm với thứ tự tệp.

```ts
const truoc = await autoAcceptRate();
// … duyet · sua_roi_duyet · bo …
const sau = await autoAcceptRate();
expect(sau.numerator - truoc.numerator).toBe(1);     // CHỈ `duyet`
expect(sau.denominator - truoc.denominator).toBe(3); // cả ba lối ra của người
```

## Verification

**Commands:**
- `npm test` -- expected: mã thoát `0`; `T-1`/`T-3`/`T-5`/`T-7` không còn dòng `todo`.
- `npx tsc --noEmit` -- expected: sạch (bộ kiểm nhập kiểu thật của lõi và tầng ④).

**Manual checks (if no CLI):**
- Kéo-thả thật giữa bảy cột `S4` (`FR-4`, `C1-2`) — `jsdom` không có bàn phím/chuột thật.
- Hộp hỏi hai dấu hiệu bật ngay khi thả vào Đủ điều kiện (`C1-3`).
- Bấm một Phát hiện mở Bản lưu, **cuộn tới** và **tô sáng** khoảng câu trích (`C1-8`, `S7`).
- Nút Hoàn tác là **một** cú bấm và cửa sổ 7 ngày hiện rõ trên màn hình (`C1-10`).
