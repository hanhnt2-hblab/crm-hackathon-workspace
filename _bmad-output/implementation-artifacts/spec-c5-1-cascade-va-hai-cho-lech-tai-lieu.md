---
title: 'C5-1 — đóng cascade xoá mềm còn thiếu, và chú thích hai chỗ tài liệu lệch mã'
type: 'bugfix'
created: '2026-08-15'
status: 'done'
baseline_commit: 'bfb39922f26566d0131dfba745fccc0ddd2dca1c'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics/epics-crm-hackathon-2026-08-14/epics.md'
  - '{project-root}/_bmad-output/planning-artifacts/architecture/architecture-tier5-core/'
  - '{project-root}/_bmad-output/implementation-artifacts/deferred-work.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `C5-1` liệt cascade xoá mềm ĐÍCH DANH bảy nhóm bảng; `softDeleteCompany`
hôm nay chỉ chạm bốn (`opportunity`, `next_action`, `contact`, `activity`). Xoá một Công
ty để lại Bản chụp, Bản lưu và Thông báo còn SỐNG trỏ về một Công ty đã xoá, cộng với
Gợi ý còn trạng thái `cho` hiện trên Hàng đợi của `T-5`. Song song, `epics.md` nói
khác mã đang chạy ở `C5-10` (offset câu trích) và `C5-15` (mã thượng nguồn của câu
*"ghi vết cho cả lần tự đặt lẫn lần hoàn tác"*) — mã ĐÚNG ở cả hai, và người sau đọc
`epics.md` có thể đi sửa mã cho khớp tài liệu sai.

**Approach:** Thêm ba lượt `updateMany` vào cascade trong cùng giao dịch đang mở, nối
`closeSuggestionsBySystem` vốn đã viết sẵn cho đúng đường này, và ghi hai chú thích
tại chỗ nêu rõ chỗ lệch cùng bên phân xử.

## Boundaries & Constraints

**Always:**
- `D26` — Phát hiện (`signal`) và Dòng thời gian (`timeline`, `timeline_entry`) GIỮ
  NGUYÊN. Chúng là bằng chứng, và `T-3` (câu trích neo trên Bản lưu) cùng `T-10`
  (không xoá bằng chứng) dựa vào chúng.
- `AD-CR-7` — cascade dùng `updateMany` THẲNG trên `t`, không gọi `softDeleteContact`
  / `softDeleteOpportunity`. Gọi lồng là mở giao dịch lồng, và lồng trên ITX client
  là `TypeError` lúc chạy.
- `AD-CR-10` — không đọc `actor.role`. Chốt `isHuman(actor)` ở đầu hàm giữ NGUYÊN vị
  trí và nguyên mã `NFR-17`.
- Mã lỗi chỉ lấy trong từ vựng ĐÓNG của `src/core/errors.ts`.
- Định danh tiếng Anh; chú thích tiếng Việt có dấu.

**Ask First:**
- Bất kỳ nhu cầu nào về một mã lỗi MỚI — dừng và báo, không bịa.
- Bất kỳ thay đổi nào ngoài `src/core/**` và `src/capability/**`.

**Never:**
- Không sửa `epics.md` (ngoài quyền lượt này) — chỉ báo lại chỗ lệch.
- Không sửa `src/app/**`, `tests/**`, `e2e/**`, `prisma/schema.prisma`, `package.json`.
- Không mở thêm đường nào cho `actor.kind === "system"` (`NFR-17` · `T-10`).
- Không thêm hàm lõi mới mà `src/capability/caps/**` nhập (danh sách trắng `T10B`).
- Không chạy `npm test` / `npm run verify` / `npm run seed`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Người xoá Công ty có đủ dữ liệu con | `actor.kind = "human"`, Công ty còn sống | `account` + 7 nhóm con chuyển `deleted_at = now` trong MỘT giao dịch; Gợi ý `cho` → `dong_he_thong` + `cong_ty_da_xoa` | — |
| Bằng chứng đứng ngoài | cùng trên | `signal`, `timeline`, `timeline_entry` giữ `deleted_at = NULL` | — |
| Máy xoá | `actor.kind = "system"` \| `"seed"` | Từ chối TRƯỚC khi mở giao dịch | `BusinessRuleError("NFR-17")` |
| Công ty không tồn tại | id lạ | Ném trước mọi lượt ghi, giao dịch cuộn | `Error` thường (không có mã thượng nguồn) |
| Xoá lần hai | Công ty đã xoá mềm | `findUnique` qua `db` đã lọc → không tìm thấy | `Error` thường |
| Công ty không có Bản chụp/Bản lưu/Thông báo | bảng con rỗng | `updateMany` chạm 0 hàng, KHÔNG lỗi | — |

</frozen-after-approval>

## Code Map

- `src/core/company/index.ts` — `softDeleteCompany` (≈dòng 192–244). Chốt `isHuman`
  ném `NFR-17`, rồi `tx(...)` chứa bốn `updateMany` hiện có. Chú thích đầu tệp
  (dòng 1–4) và khối `///` trên hàm liệt bảy nhóm — đã đúng, mã mới là chỗ thiếu.
- `src/core/suggestion/index.ts` — `closeSuggestionsBySystem(t, accountId, reason)`
  (≈dòng 195–205). Nhận `t`, KHÔNG mở giao dịch (`AD-21`, hệ quả dây chuyền là hàm
  NỘI BỘ lõi). Chú thích tại chỗ (dòng 192–194) ghi *"hiện `softDeleteCompany` chưa
  gọi nó"* — phải cập nhật khi nối xong.
- `prisma/schema.prisma` — CHỈ ĐỌC. `Snapshot` (340), `Article` (356),
  `Notification` (456) đều có `accountId` + `deletedAt`. `Suggestion` (427) có
  `status`, `systemCloseReason`; `SystemCloseReason.cong_ty_da_xoa` (74) có sẵn.
- `src/core/db.ts` — extension `AD-CR-6` chỉ chèn `deletedAt: null` cho `READ_OPS`,
  KHÔNG cho `updateMany`; nên vế `deletedAt: null` trong `where` phải viết TAY.
- `src/core/normalize.ts` — `findQuote` (dòng 74). Chỗ ghi chú lệch `C5-10`.
- `src/core/nextaction/index.ts` — `undoSystemNextAction` (dòng 772–845), chú thích
  `FR-33` ở dòng 836. Chỗ ghi chú lệch `C5-15`.
- `src/core/metrics.ts` (dòng 29–35) — CHỈ ĐỌC, đã xác minh: `DECIDED_STATUSES`
  không chứa `dong_he_thong`, nên nối Gợi ý vào cascade KHÔNG động vào mẫu số của
  `autoAcceptRate`. Đây là rủi ro mà `deferred-work.md` nêu; nó đã đóng sẵn.
- `tests/T10A.test.ts` (dòng 133–142) — CHỈ ĐỌC. Chỉ khẳng định `account` và
  `opportunity` biến mất; Công ty của nó không có Bản chụp/Bản lưu/Thông báo/Gợi ý.
- `tests/T10B.test.ts` (dòng 37–110) — CHỈ ĐỌC. Danh sách trắng chỉ quét
  `src/capability/caps/*.ts`; lượt này không thêm hàm lõi nào ở đó.
- `e2e/T10.spec.ts` (dòng 151–167) — CHỈ ĐỌC. Chỉ kiểm lời gọi BỊ TỪ CHỐI; không
  e2e nào xoá thành công một Công ty.

## Tasks & Acceptance

**Execution:**
- [x] `src/core/company/index.ts` — thêm ba `updateMany` (`snapshot`, `article`,
  `notification`) vào cascade của `softDeleteCompany`, đặt TRƯỚC lượt cập nhật
  `account`, dùng cùng biến `now`. Lý do: `C5-1` liệt bảy nhóm đích danh; ba nhóm
  này là phần thiếu.
- [x] `src/core/company/index.ts` — nhập và gọi `closeSuggestionsBySystem(t, id,
  "cong_ty_da_xoa")` trong cùng giao dịch. Lý do: `C5-1` đòi Gợi ý còn chờ chuyển
  `dong_he_thong` + `cong_ty_da_xoa`; hàm đã có sẵn và nhận `t` đúng cho đường này.
- [x] `src/core/company/index.ts` — chú thích tại chỗ nêu rõ vì sao `signal`,
  `timeline`, `timeline_entry` ĐỨNG NGOÀI, và vì sao dùng `updateMany` thẳng.
- [x] `src/core/suggestion/index.ts` — sửa chú thích *"hiện chưa gọi nó"* thành
  trạng thái đã nối. Lý do: chú thích sai là bẫy cho người đọc sau.
- [x] `src/core/normalize.ts` — chú thích tại `findQuote`: `C5-10` nói *văn bản gốc*,
  `AD-18` + cột `signal.quote_start` + hàm này nói *bản chuẩn hoá*; mã theo `AD-18`.
- [x] `src/core/nextaction/index.ts` — chú thích tại `undoSystemNextAction`: câu
  *"ghi vết cho cả lần tự đặt lẫn lần hoàn tác"* là nguyên văn `T-7` + `FR-33`, KHÔNG
  phải `D14` (`D14` là cửa sổ Hoàn tác 7 ngày, một tham số).

**Acceptance Criteria:**
- Given một Công ty có Bản chụp, Bản lưu, Thông báo và Gợi ý `cho`, when người xoá nó,
  then cả bốn nhóm rời khỏi đường đọc thường và Gợi ý mang `dong_he_thong` +
  `cong_ty_da_xoa`.
- Given cùng Công ty đó, when người xoá nó, then `signal`, `timeline` và
  `timeline_entry` vẫn `deleted_at IS NULL`.
- Given `actor.kind = "system"`, when gọi `softDeleteCompany`, then vẫn ném
  `BusinessRuleError("NFR-17")` trước khi mở giao dịch — không nhánh nào mới.
- Given `src/capability/caps/**`, when quét theo `T10B`, then không tên hàm lõi mới
  nào xuất hiện.

## Spec Change Log

- **Vòng rà 1 (step-04, 15/8).** Bốn lớp rà độc lập chạy trên diff phạm vi
  `src/core/{company,normalize,nextaction,suggestion}`. Không có `intent_gap` hay
  `bad_spec`, nên không có vòng lặp lại; chỉ `patch` và `defer`.
  - `patch` — sáu chỗ TRÍCH MÃ SAI trong chú thích cascade mới: `NFR-17`/`T-10` bị kéo
    xuống đoạn *giữ bằng chứng* (chúng ràng buộc MÁY, không cấm người) → thay bằng
    `AD-14`; `FR-51` bị gán cho lý do `cong_ty_da_xoa` → PRD §7.1 gán lý do đó cho
    `D26`; `C3-4` (trần ngân sách vòng quét) trích nhầm cho phép đo Gợi ý → bỏ; một
    chuỗi phân xử `AD-13` tự chế → rút về đúng vế chịu lực (*`AD-13` không liệt
    `epics.md`*); `D30` trích cho vế `deletedAt: null` → thay bằng lý do trực tiếp.
    Trạng thái xấu tránh được: chú thích trích mã sai trông NHƯ ĐÃ KIỂM, và người sau
    tin nó thay vì tra lại.
  - `patch` — chú thích khẳng định Phát hiện *"vẫn đọc được"* sau khi Bản lưu bị xoá
    mềm. SAI một nửa: hàng `signal` sống, nhưng `quote_start`/`quote_end` là chỉ số vào
    `article.normalized_text` và extension `AD-CR-6` giấu Bản lưu đã xoá khỏi mọi lượt
    đọc. Chú thích nay nói thẳng hệ quả và chỉ đường `dbIncludingDeleted`.
  - `patch` — LỖI HÀNH VI THẬT do cascade gây ra: `blindApprovalSignals` của
    `src/core/metrics.ts` đếm `decided_at` mà KHÔNG lọc trạng thái. Đóng N Gợi ý lúc
    xoá Công ty bơm N mốc trùng nhau vào cửa sổ 24 giờ, và `burstPerMinute` đọc đó
    thành *"một người vừa duyệt N Gợi ý trong một phút"* — báo động duyệt mù `BR-B6`
    bật vì một thao tác không ai duyệt gì cả. Đã thêm `status: { in: DECIDED_STATUSES }`
    cho cả `tooFast` lẫn `recent`.
  - `defer` × 4 — đã ghi vào `deferred-work.md`.
  - KEEP: ba lượt `updateMany` phẳng theo `accountId`, lời gọi
    `closeSuggestionsBySystem` trong cùng giao dịch, và vị trí chốt `isHuman` TRƯỚC khi
    mở giao dịch — cả ba đúng và phải sống sót mọi lần dựng lại.

## Design Notes

Thứ tự trong giao dịch: mọi bảng con TRƯỚC, `account` SAU CÙNG. Cascade đọc
`accountId` của Công ty đang xoá, và `updateMany` không đi qua extension lọc — nhưng
để `account` sau cùng giữ đúng nghĩa *"Công ty còn sống cho tới khi con của nó đã
đóng"*, và đó cũng là thứ tự bốn dòng hiện có đang theo.

`next_action` đi qua quan hệ `opportunity` vì bảng đó không có `account_id`. Ba bảng
mới thì có `account_id` trực tiếp, nên vế `where` phẳng.

```ts
await t.snapshot.updateMany({ where: { accountId: id, deletedAt: null }, data: { deletedAt: now } });
await t.article.updateMany({ where: { accountId: id, deletedAt: null }, data: { deletedAt: now } });
await t.notification.updateMany({ where: { accountId: id, deletedAt: null }, data: { deletedAt: now } });
await closeSuggestionsBySystem(t, id, "cong_ty_da_xoa");
```

## Verification

**Commands:**
- `npx tsc --noEmit` — expected: 0 lỗi.
- `npx eslint src/` — expected: 0 lỗi, 0 cảnh báo mới.

**Manual checks (if no CLI):**
- Đọc `tests/T10A.test.ts` và `e2e/T10.spec.ts`: không phép kiểm nào đếm số bảng bị
  chạm, nên cascade rộng ra không làm đỏ.
- Đọc `tests/T10B.test.ts`: danh sách trắng chỉ quét `src/capability/caps/*.ts`; xác
  nhận lượt này không sửa tệp nào ở đó.
