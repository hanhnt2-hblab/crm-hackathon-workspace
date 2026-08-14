---
title: 'Cục ⑤ — sáu hàm lõi còn rỗng và hai món nợ đo được'
type: 'feature'
created: '2026-08-14'
baseline_commit: '4dee5324ea720ede183bec6771f4e342d764a168'
status: 'done' # CHECKPOINT 1 tự duyệt `[A]` — không có người trong vòng lặp
review_loop_iteration: 0
context:
  - '_bmad-output/planning-artifacts/architecture/architecture-tier5-core/ARCHITECTURE-SPINE.md'
  - 'docs/Đề bài/Phản biện và phân tích yêu cầu.md'
  - '_bmad-output/implementation-artifacts/deferred-work.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sáu hàm lõi còn ném `chưa hiện thực` (`updateCompany`, `searchCompanies`,
`softDeleteContact`, `softDeleteOpportunity`, `markSignalUnhelpful`, `updateTimelineEntry`),
và hai khoản nợ đã ĐO ĐƯỢC: `BR-D6` không có bảng suy diễn nào trong mã nên trên lượt gọi
mô hình thật **5/5 Phát hiện trả `relevance: high`** — mọi Phát hiện thành *đáng chú ý* theo
`BR-D5`, đường tự đặt Việc tiếp theo mất điều kiện kích hoạt, `T-4` và `T-6` cùng lệch; và
`nextaction` tính ngày làm việc không có lịch ngày lễ nên hạn rơi vào Tuần lễ Vàng hay Obon
sẽ **sớm hơn thực tế**.

**Approach:** Cài sáu hàm theo đúng khuôn `AD-CR-7` của `changeOpportunityStage`. Dựng
`deriveRelevance` + `checkRelevance` như HÀM THUẦN trong `src/core/signal/`, bảng lấy từ Mục 0
§0.1.4 và §0.1.5. **CHỐT 14/8 của người dùng: LÕI LÀ NGUỒN SỰ THẬT** — giá trị `relevance` mô
hình trả về chỉ dùng để CANH và ghi độ lệch, không bao giờ dùng để lưu; mô hình không tự nâng
được mức. Mọi phương án để mô hình làm nguồn đều giữ nguyên triệu chứng 5/5 `high`.
Thêm bảng ngày lễ JP tối thiểu vào `src/core/nextaction/index.ts`, nguồn ghi ngay tại chỗ.

## Boundaries & Constraints

**Always:**
- Chỉ ghi trong bảy tệp được giao: `src/core/{company,contact,opportunity,signal,timeline,nextaction}/index.ts` và `src/core/settings.ts` (chỉ THÊM khoá).
- `AD-CR-7`: lõi TỰ mở `tx()`; mục Dòng thời gian dùng `appendEntryWithin(t, …)`; `ctx.audit.complete(t, …)` là bước cuối.
- `AD-CR-10`: lõi KHÔNG đọc `actor.role`. Chặn theo `actor.kind` thì được.
- `AD-CR-3`: mã lỗi lấy trong từ vựng ĐÓNG của `src/core/errors.ts`. Không tìm thấy bản ghi → `Error` thường, không phải `BusinessRuleError`.
- `AD-CR-2`: `BR-D5`/`BR-D6` **không bao giờ từ chối gì** — không mã lỗi, không ném, không loại Phát hiện.
- `AD-10`: mọi lần ghi mà vị từ phụ thuộc trạng thái vừa đọc phải là ghi CÓ ĐIỀU KIỆN.
- Mỗi hàm trích một mã thượng nguồn tra được, ngay trong mã.

**Ask First:**
- Bất kỳ mã lỗi nào cần mà `errors.ts` không có → DỪNG, báo, không bịa.
- Đổi lược đồ, đổi chữ ký đã đóng băng theo nghĩa **phá tương thích** (thêm trường tuỳ chọn thì không phải).

**Never:**
- Không chạm `src/app/**`, `src/scan/**`, `src/ingest/**`, `src/agent/**`, `src/capability/**`, `src/autonomy/**`, `tests/**`, `prisma/**`, `package.json`, `eslint.config.mjs`.
- Không chạy `npm test` (xoá lược đồ CSDL kiểm thử) và `npm run seed`.
- Không gọi hàm lõi khác từ trong một `tx()` đang mở — giao dịch lồng trên ITX client là `TypeError` lúc chạy. Cascade của `softDeleteCompany` vì thế KHÔNG gọi `softDeleteContact`/`softDeleteOpportunity`.
- Không commit, không push.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| `updateCompany` tám ô | patch chạm `revenue_range`, `founded_year` | Ghi được — patch với tới **cả tám** `TargetField` | patch rỗng → ghi vết `no_op` |
| `searchCompanies` kết hợp | `{industry, accountType, country, watching, text}` cùng lúc | AND toàn bộ; hàng đã xoá mềm không bao giờ ra | không khớp → mảng rỗng |
| `softDeleteContact` máy | `actor.kind = "system"` | Từ chối | `BusinessRuleError("NFR-17")` |
| `softDeleteContact` Đầu mối chính | người xoá Đầu mối chính | Công ty còn 0 đầu mối, KHÔNG tự chọn người khác | không lỗi |
| `softDeleteOpportunity` | người xoá Cơ hội đang chạy | Cơ hội và Việc tiếp theo ĐANG SỐNG của nó cùng xoá mềm | máy gọi → `NFR-17` |
| `markSignalUnhelpful` lần hai | `markedUnhelpfulAt` đã có | No-op, mốc thời gian KHÔNG dời | ghi vết `no_op` |
| `updateTimelineEntry` máy sửa mục người | `actor.kind="system"`, `addedBy="nguoi"` | Từ chối | `BusinessRuleError("NFR-19")` |
| `deriveRelevance` | `("hiring", null)` / `("other","event")` / `("other", null)` | `high` / `low` / `low` ⚠đoán | không ném |
| `checkRelevance` lệch 2 bậc | lõi `low`, mô hình `high` | Lưu `low`; `deviation: 2`, `outOfRange: true` | không ném, không loại Phát hiện |
| `checkRelevance` lệch 1 bậc | lõi `medium`, mô hình `high` | Lưu `medium`; `deviation: 1`, `outOfRange: false` | không ném |
| `deriveRelevance` khoá kế thừa | `("other","constructor")` | `low` — tra bằng `Object.hasOwn` | không ném |
| `computeDueDate` qua Tuần lễ Vàng | `market="JP"`, hạn rơi 03–05/5 | Nhảy qua ngày lễ | — |

</frozen-after-approval>

## Code Map

- `src/core/opportunity/index.ts:232` `changeOpportunityStage` — KHUÔN CHUẨN `AD-CR-7`: `tx()` → đọc `before` → ghi → `appendEntryWithin` → `ctx.audit.complete`.
- `src/core/activity/index.ts:206` `softDeleteActivity` — khuôn chuẩn xoá mềm một bản ghi lẻ, kèm câu chốt *"cascade KHÔNG gọi hàm này, vì lồng giao dịch là `TypeError`"*.
- `src/core/company/index.ts:88` `softDeleteCompany` — cascade `D26` bằng `updateMany` thẳng; giữ nguyên.
- `src/core/db.ts:39` extension lọc `deletedAt: null` cho **thao tác đọc**; `updateMany` KHÔNG đi qua nó — mọi vế `where` của ghi phải tự viết `deletedAt: null`.
- `src/core/errors.ts:31` `BusinessRuleCode` — từ vựng ĐÓNG, chỉ đọc.
- `prisma/schema.prisma:89` `enum TargetField` tám giá trị · `:143` `Account` có `specialtyArea`/`revenueRange`/`dealValueTier`/`foundedYear` mà `CreateCompanyInput` chưa khai · `:383` `Signal.markedUnhelpfulAt` · `:320` `TimelineEntry.addedBy`.
- `src/capability/caps/scan.ts:306` `readAccountListCap` gọi `searchCompanies(actor, p)` với `{watching?, text?, industry?, accountType?, country?}` — chỉ đọc, KHÔNG sửa.
- `src/capability/caps/ui.ts:161` `searchAccountsCap` đọc thẳng `db` (món nợ có ý thức) và trả `{rows, facets}`; `src/app/_types.ts:40` `AccountRow` là hình dạng hàng nó trả. Trả đúng hình dạng đó thì món nợ trả được bằng một dòng.
- `src/scan/_contract.ts:112` `parseAccountList` — nhận cả mảng trần lẫn `{rows}`; đòi `id` và `name`.
- Mục 0 §0.1.4 (dòng 127–134) và §0.1.5 (dòng 149–163) — **BẢNG SUY DIỄN `relevance` ĐÃ TỒN TẠI**, mỗi loại tin và mỗi `signal_subtype` có một giá trị mặc định. §0.1.6 (dòng 173) — lệch một bậc phải kèm lý do.
- `ARCHITECTURE-SPINE.md` tier ⑤ dòng 208 (`AD-CR-2`): lệch quá một bậc thì **kẹp về biên ±1**, ghi nhật ký `F1`, KHÔNG loại Phát hiện, KHÔNG mã lỗi. Dòng 775: lịch ngày lễ JP xếp *Deferred* dạng **dữ liệu gieo cùng seeder** — nhưng `schema.prisma` không có bảng ngày lễ nào, nên đường đó không tồn tại hôm nay.
- `_bmad-output/implementation-artifacts/deferred-work.md:24` — *"`updateCompany` chỉ với tới 4/8 `TargetField`"*, đúng khoản mục này đóng.

## Tasks & Acceptance

**Execution:**
- [x] `src/core/company/index.ts` — thêm bốn trường tuỳ chọn (`specialtyArea`, `revenueRange`, `dealValueTier`, `foundedYear`) vào `CreateCompanyInput`; cài `updateCompany` (tám ô) và `searchCompanies` (lọc AND kết hợp, trả hình dạng `AccountRow`) — đóng khoảng trống 4/8 của `deferred-work.md`.
- [x] `src/core/contact/index.ts` — cài `softDeleteContact`, chặn `!isHuman` bằng `NFR-17`.
- [x] `src/core/opportunity/index.ts` — cài `softDeleteOpportunity`, chặn `NFR-17`, xoá mềm kèm Việc tiếp theo đang sống.
- [x] `src/core/signal/index.ts` — thêm `deriveRelevance` + `checkRelevance` (hàm thuần, bảng Mục 0; lõi là nguồn sự thật), nối vào `createSignal`; cài `markSignalUnhelpful` (`FR-42`) ghi có điều kiện.
- [x] `src/core/timeline/index.ts` — cài `updateTimelineEntry`, chặn máy sửa mục `addedBy = "nguoi"` bằng `NFR-19`.
- [x] `src/core/nextaction/index.ts` — thêm `JP_HOLIDAYS` (Tuần lễ Vàng, Obon, Tết) kèm nguồn và luật 振替休日; nối vào `isBusinessDay`; giữ `chac + low` ở cột `chacMedium` và đánh dấu ⚠ tại chỗ.

**Acceptance Criteria:**
- Given một Phát hiện `signal_type = other`, `signal_subtype = event`, mô hình trả `high` kèm lý do, when `createSignal` chạy, then hàng lưu `relevance = medium` (kẹp ±1), không ném và không bị loại.
- Given `market = "JP"` và một hạn rơi vào 03/5, when `computeDueDate` chạy, then ngày trả về không phải một ngày trong Tuần lễ Vàng.
- Given `npx tsc --noEmit` và `npx eslint src/core/`, when chạy trên cây làm việc sau khi sửa, then cả hai sạch.

## Spec Change Log

- **2026-08-14 · `intent_gap` do người dùng chốt lại (`BR-D6`).**
  Triggering finding: lăng kính `verification-gap` và `blind-hunter` đều chỉ ra nhánh *"mô hình
  thắng khi lệch một bậc kèm lý do"* không có bên sản xuất `relevanceReason`
  (`src/agent/schema.ts` là `z.strictObject` không có trường lý do), nên `BR-D6` trên thực tế đã
  bị cài thành *"mô hình không bao giờ được lệch"* mà không ai khai. Người dùng chốt thẳng:
  **lõi là nguồn sự thật**.
  Amended: `resolveRelevance` → `checkRelevance`; kiểu trả về đổi từ `{source, failure}` sang
  `{deviation, outOfRange}`; `createSignal` luôn lưu giá trị lõi.
  Known-bad state avoided: mô hình trả `high` cho 5/5 Phát hiện vẫn nâng được mức chỉ bằng cách
  viết thêm một câu lý do — đúng thứ mô hình làm giỏi nhất.
  KEEP: bảng `0.1.4`/`0.1.5` chép nguyên; độ lệch vẫn phải ĐO và ghi vào ghi vết (đó là dữ liệu
  duy nhất để phản biện lại chính bảng); không ném, không loại Phát hiện.
- **2026-08-14 · `patch` từ lăng kính truy vết** — chín trích dẫn sai chỗ đã vá tại chỗ:
  `§5` bốn ranh giới chứ không năm · `T-4` không so `updated_at` · `NFR-8` chứ không `T-8` ·
  `AD-CR-11` chứ không `AD-14` cho *"`market` ≠ `country`"* · `E1-S10` chứ không `T-1` cho
  *"lọc kết hợp được"* · ontology chứ không PRD §6 cho *"ai cũng thấy mọi Công ty"* · bỏ mã `F1`
  sai không gian · `AD-CR-2` xếp `BR-D6` là *"kiểm ở lõi"* chứ không *"chỉ lõi"* · lý do lệch
  spine về lịch ngày lễ (bảng `Setting` có thật; cái thiếu là đường đọc từ một hàm THUẦN).
- **2026-08-14 · `patch` từ hai lăng kính còn lại** — `Object.hasOwn` thay `??` khi tra
  `signal_subtype` (khoá kế thừa `"constructor"` trả về một hàm); union đóng `SignalSubtypeValue`
  thay `Record<string, …>`; trần vòng lặp cho `nextBusinessDay` (nay ăn cả ngày lễ); `take` cho
  `searchCompanies` (bên gọi mang `exposeToMcp: true`); `_count` lọc `deletedAt`; cascade
  `next_action` cho `softDeleteCompany`; `isJpSubstitute` không nhận ngày vốn đã là lễ.

## Design Notes

`deriveRelevance` KHÔNG phải một phép đoán mới. Mục 0 §0.1.4 chốt bốn loại tin `high`
(`funding`, `leadership`, `expansion`, `hiring`), `new_business` là `medium`, và `other` thì
*"theo `signal_subtype`"*; §0.1.5 liệt 13 subtype kèm cột `relevance` mặc định. Bảng trong mã
chỉ chép lại hai bảng đó. Đúng **một** ô là đoán: `other` mà `signal_subtype` là `null` hoặc
ngoài 13 giá trị — chọn `low`, cùng bậc với `unclassified`. Cần một dòng chốt ở Mục 0.

`resolveRelevance` là chỗ triệu chứng 5/5 `high` chết: mô hình chỉ được lệch **một bậc** và
**phải kèm một câu lý do** (§0.1.6). Không lý do thì giá trị mặc định thắng — nên một mô hình
trả `high` trơn cho một tin `event` không nâng được nó lên.

```ts
const r = resolveRelevance({ signalType: "other", signalSubtype: "event",
                             modelRelevance: "high", modelReason: "khách mời là CTO" });
// → { relevance: "medium", base: "low", source: "kep_mot_bac", failure: "F1", note: … }
```

## Verification

**Commands:**
- `npx tsc --noEmit` — expected: 0 lỗi.
- `npx eslint src/core/` — expected: 0 lỗi, 0 cảnh báo.

**Manual checks:**
- `npm test` và `npm run seed` **KHÔNG chạy** — hai agent khác đang dùng CSDL kiểm thử và CSDL demo.
