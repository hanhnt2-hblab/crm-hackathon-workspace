---
title: '`3.2` — Nút vào thẳng từng user Sales, và đăng nhập bằng mật khẩu'
type: 'feature'
created: '2026-08-15'
status: 'done' # CHECKPOINT 1 tự duyệt `[A]` — không có người trong vòng lặp (lệnh chạy)
baseline_commit: '30e16bd'
review_loop_iteration: 0
context:
  - src/app/login/page.tsx
  - src/capability/caps/ui.ts
  - tests/T10B.test.ts
  - e2e/T1.spec.ts
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Luật thi bổ sung `3.2` (15/08) đòi màn đăng nhập có **nút vào thẳng cho từng
user Sales** — bấm là vào ngay, không cần mật khẩu — **và** giữ đường đăng nhập **bằng
mật khẩu** theo đề bài `§7.3` (*"đăng nhập thật … để giám khảo tự vào"*), với mật khẩu mặc
định `hackathon#1`. Hôm nay `S11` chỉ có một nhóm radio cộng một nút, và bảng `user`
**không có cột mật khẩu** — nên vế mật khẩu chưa tồn tại ở bất kỳ tầng nào.

**Approach:** Mở rộng `S11`, không viết lại: giữ nguyên nhóm radio và nút *Dùng tài khoản
này* (`e2e/T1.spec.ts` bấm đúng hai thứ đó), **thêm** một dải nút một-chạm cho từng tài
khoản và **thêm** một biểu mẫu mật khẩu. Thêm cột `password_hash` nullable cho `user` bằng
một migration `ADD COLUMN`, băm bằng `scrypt` của `node:crypto`, và so sánh bằng
`timingSafeEqual`. Không lưu chữ thô ở bất kỳ đâu, kể cả mật khẩu demo dùng chung.

## Boundaries & Constraints

**Always:**
- `AD-1` — `src/app` đi xuống **chỉ** qua `loadCapability`; không `db`, không `@prisma/client`.
- `AD-UI-5` — `S11` chạy **ngoài phiên**; `readLoginCandidates`/`readUserForAuth` đi bằng
  `actor: {kind:"system"}` và giữ `selfLimiting: true`.
- `AD-UI-6` — mọi server action mang chữ ký của `_contract.ts` và bọc bằng `action()`.
- `AD-UI-10` — cookie mang **chỉ `userId`**; vai đọc sống mỗi lượt yêu cầu.
- Migration là `ALTER TABLE … ADD COLUMN` **nullable**, chạy được trên CSDL đang có dữ liệu.
- Mã lỗi lấy từ từ vựng ĐÓNG đã có (`BusinessRuleCode | GateDenyReason | "unexpected"`).

**Ask First:**
- Sửa `tests/**` để nới danh sách trắng của `T-10b`. **Đã kích hoạt và đã tự quyết `[A]`:
  không sửa** — xem *Design Notes*.

**Never:**
- Chạm `src/capability/caps/ui.ts`, `src/app/page.tsx`, `tests/**`, `e2e/**`.
- Thêm capability mang `allowedActors` chứa `"system"` — làm `T-10b` đỏ (xem *Design Notes*).
- Sửa chữ hiển thị đang có; đổi cơ chế cookie `why_now_user`; tạo user.
- Chạy `npm test`, `npm run verify`, `npm run seed`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Vào thẳng | Bấm nút *Vào thẳng* của một tài khoản | Cookie `why_now_user = userId`; báo *Đang dùng tài khoản …* | — |
| Mật khẩu đúng | Chọn tài khoản + `hackathon#1` | Như trên | — |
| Mật khẩu sai | Chọn tài khoản + chuỗi khác | Không đặt cookie | `ok:false`, `code:"unexpected"`, *"Mật khẩu không đúng."* — không nói tài khoản nào có thật |
| Mật khẩu rỗng | Ô để trống | Không đặt cookie | Như trên, cùng một câu |
| Tài khoản không có thật | `userId` không khớp hàng nào | Không đặt cookie | Dùng lại câu sẵn có của `signInAction` |
| Chưa có user nào | Bảng `user` rỗng | Trạng thái rỗng nói rõ **phải nạp dữ liệu trước**, kèm lệnh | — |

</frozen-after-approval>

## Code Map

- `src/app/login/page.tsx` — `S11`. `dynamic = "force-dynamic"` (dòng 26) là bắt buộc: `S11`
  không đọc cookie nên Next sẽ prerender nó lúc `next build`. Trạng thái rỗng ở dòng 52.
- `src/app/login/_login-form.tsx` — lá `'use client'`, `RadioGroup` + `SubmitButton`
  *Dùng tài khoản này*. **Cả hai chuỗi này bị `e2e/T1.spec.ts:135,139,140` bấm** — giữ nguyên.
- `src/app/login/actions.ts` — `signInAction`; gọi `readSessionUser` (một trong ĐÚNG HAI chỗ
  gọi `readUserForAuth`), rồi `jar.set(SESSION_COOKIE, …)`; cố ý **không** `secure`.
- `src/app/_session.ts:17` — `SESSION_COOKIE = "why_now_user"`; `readSessionUser(userId|null)`.
- `src/capability/caps/ui.ts:92-122` — `readUserForAuthCap` / `readLoginCandidatesCap`,
  `select` **không** trả `password_hash`. **CHỈ ĐỌC — ngoài phạm vi.**
- `src/capability/registry.ts:140-158` — bốn danh sách cắt theo `allowedActors`/`kind`/`writesTables`.
- `tests/T10B.test.ts:37-110` — `CORE_FUNCTIONS_ALLOWED`; `:186` chặn mọi
  `import { X } from "@/core/…"` trong `caps/*.ts` nếu `X` không có trong danh sách.
  `:314` `CAP_SYSTEM_INTERNAL` đúng 5 tên; `:391` `CAP_MACHINE_ALLOWED_DOC` đúng 8 tên.
  **Đọc-chỉ.** `npm run verify` chạy Vitest trước Playwright (`e2e/verify.mjs:133`), nên
  một dòng đỏ ở đây làm `T-10` đỏ.
- `e2e/_fixtures.ts:89` — `rawDb.user.create` **không** truyền `password_hash` ⇒ cột phải
  nullable hoặc có mặc định.
- `prisma/schema.prisma:126-141` — `model User`. `prisma/migrations/*/migration.sql` — mẫu.

## Tasks & Acceptance

**Execution:**
- [x] `prisma/schema.prisma` — thêm `passwordHash String? @default(…) @map("password_hash")`
      vào `model User` — cột chứa băm; nullable + có mặc định để `db.user.create` của
      `tests/**` và `e2e/**` không đỏ.
- [x] `prisma/migrations/20260815060000_mat_khau_user_va_chu_so_huu_co_hoi/migration.sql` — `ADD COLUMN`
      nullable, `DEFAULT` là băm của `hackathon#1`, cộng một `UPDATE` bù cho hàng đang có —
      `prisma migrate deploy` phải chạy được trên CSDL có dữ liệu.
- [x] `src/capability/caps/auth-ui.ts` (mới) — module băm THUẦN (`node:crypto`, không
      `@/core/*`, không `db`) cộng capability `verifyLoginPassword`
      (`allowedActors: ["human"]`) — xem *Design Notes* về hai ràng buộc chỗ đứng.
- [x] `src/capability/caps/index.ts` — ĐÚNG hai dòng: một `import`, một dòng trong `GOP`.
- [x] `src/app/login/actions.ts` — thêm `signInWithPasswordAction`; sửa khối chú thích đầu
      tệp đang nói *"không có mật khẩu"* — nay đã lỗi thời.
- [x] `src/app/login/_login-form.tsx` — thêm `<DemoLoginButtons>` (một nút / tài khoản) và
      `<PasswordLoginForm>` (thẻ `<select>`, **không** radio: radio thứ hai cùng nhãn làm
      `e2e/T1.spec.ts:139` khớp hai phần tử và Playwright ném `strict mode violation`).
- [x] `src/app/login/page.tsx` — bày ba khối; nới trạng thái rỗng để nói *phải nạp dữ liệu
      trước*, THÊM câu chứ không sửa câu đang có.

**Acceptance Criteria:**
- Given danh sách tài khoản không rỗng, when bấm nút vào thẳng của một tài khoản, then
  cookie `why_now_user` mang đúng `id` của tài khoản đó và **không** ô mật khẩu nào phải điền.
- Given `npx tsc --noEmit` và `npx eslint src/`, when chạy, then cả hai sạch.
- Given `e2e/T1.spec.ts` "đăng nhập được qua màn hình chọn tài khoản", when đọc lại mã, then
  tiêu đề *Chọn tài khoản*, nhóm `radio` nhãn `displayName · vai · email`, và nút *Dùng tài
  khoản này* còn nguyên và **duy nhất** trên trang.
- Given bốn danh sách của `AD-CP-1`, when thêm `verifyLoginPassword`, then `CAP_HUMAN_ONLY`
  tăng một và ba danh sách kia **không đổi**.

## Spec Change Log

- **15/08, trong lúc cài đặt — điều phối viên xin gộp một cột của luật thi `3.3`.**
  Migration `20260815060000_mat_khau_user_va_chu_so_huu_co_hoi` nay mang HAI thay đổi:
  `user.password_hash` (việc của spec này) và `opportunity.owner_id` (việc của `3.3`).
  Lý do gộp: `prisma/schema.prisma` có đúng một chủ sở hữu trong lượt chạy này, và hai
  migration liên tiếp trên cùng tệp lược đồ là hai lần khoá bảng cho một lần thay đổi.
  Bằng chứng cho cột kia, do bên xin đo: `Opps.csv` mang cột `sales_owner` riêng từng Cơ
  hội, `Demo` giữ 8/23 Cơ hội mà không phụ trách Công ty nào — suy chủ qua Công ty thì bộ
  lọc `3.3` sai ở hơn một phần ba số Cơ hội. Phần đọc/ghi cột đó KHÔNG thuộc spec này.
- **Cái bẫy đã sập một lần và phải sống sót qua mọi lần viết lại:** bộ quét lời nhập của
  `tests/T10B.test.ts:191` đọc **văn bản thô**, không gỡ chú thích. Một câu ví dụ viết đúng
  hình dạng lời nhập từ lõi — kể cả trong một khối `//` — bị đếm là lời nhập thật và làm
  `T-10b` đỏ. Đã xảy ra ở khối đầu `src/capability/caps/auth-ui.ts`; nay có một dòng ⚠ tại
  chỗ. Đừng viết hình dạng đó ra trong tệp `caps/*.ts`, dù chỉ để minh hoạ.

## Design Notes

**Vì sao capability mới KHÔNG được mang `"system"`, và vì sao nó KHÔNG đọc được cột.**
`tests/T10B.test.ts` là hợp đồng đóng băng, và `npm run verify` chạy nó. Đã kiểm cả ba
nhánh: `system` + `read` phá khẳng định 8 tên ở `:391`; `system` + `write` chỉ chạm bảng hạ
tầng phá khẳng định 5 tên ở `:314`; `system` + `write` chạm bảng khác phá phép phân hoạch ở
`:294`. Và `:186` chặn `caps/*.ts` nhập bất kỳ tên nào từ `@/core/…` ngoài danh sách trắng —
nên một `@/core/auth` mới **không có bên nào nhập được**: `src/capability` bị `:186` chặn,
`src/app` bị `AD-1` chặn. Hệ quả nhận có ý thức, ghi ra để không ai đọc nhầm là sơ suất:

> Đường mật khẩu so với **băm của mật khẩu demo dùng chung**, không đọc `password_hash` của
> từng hàng. Migration đặt đúng băm ấy làm `DEFAULT` **và** bù cho mọi hàng đang có, nên
> hôm nay hai cách cho **cùng một kết quả**. Nối lượt đọc thật cần thêm một tên vào
> `CORE_FUNCTIONS_ALLOWED` — một dòng ở `tests/**`, nằm ngoài phạm vi lần này.

**Băm.** `scrypt` (`N=16384, r=8, p=1`, khoá 32 byte), chuỗi lưu là
`scrypt$N$r$p$saltHex$keyHex` — muối nằm trong chuỗi, nên đổi tham số không làm hỏng băm cũ.
So sánh bằng `timingSafeEqual`, và so **sau khi** đã dựng lại khoá với đúng muối đọc từ chuỗi.

**Vì sao module băm nằm ở `src/capability/caps/auth-ui.ts` chứ không ở `src/core/auth/`.**
Đó là chỗ DUY NHẤT vừa `src/app` nhập được (`AD-1` cho ① → ④) vừa không kích hoạt `:186`.
Nói thẳng vì đây là lệch so với chiều tầng thông thường.

## Verification

**Commands:**
- `npx tsc --noEmit` — expected: không lỗi.
- `npx eslint src/` — expected: không lỗi, không cảnh báo mới.

**Manual checks (if no CLI):**
- Đọc lại `tests/T10B.test.ts:314`, `:391`, `:294`, `:186` và đối chiếu với mục mới: mục
  mang `allowedActors: ["human"]`, `writesTables: []`, và `auth-ui.ts` không có câu
  `import { … } from "@/core/…"` nào.
- Đọc lại `e2e/T1.spec.ts:133-143`: ba locator của nó còn khớp đúng một phần tử.
