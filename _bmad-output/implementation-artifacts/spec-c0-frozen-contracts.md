---
title: 'Cục 0 — Đóng băng hợp đồng giữa năm tầng'
type: 'feature'
created: '2026-08-14'
status: 'done'
baseline_commit: 'c0c3ed8db3e1589a7e1e231d137118da8e9e999f'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/planning-artifacts/architecture/architecture-tier3-autonomy/ARCHITECTURE-SPINE.md'
  - '{project-root}/_bmad-output/planning-artifacts/architecture/architecture-tier4-capability/ARCHITECTURE-SPINE.md'
  - '{project-root}/_bmad-output/planning-artifacts/architecture/architecture-tier2-agent/ARCHITECTURE-SPINE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Năm tầng của Why Now có chuỗi phụ thuộc chặt ⑤←④←③←②←①, nên hai dev không xây song song được: tầng trên cần tầng dưới tồn tại. Thư mục `src/capability`, `src/autonomy`, `src/agent` hiện chưa có tệp nào, và bốn cục còn lại đang chờ chúng.

**Approach:** Đóng băng **hợp đồng** thay vì hiện thực. Viết chữ ký kiểu + thân rỗng cho từng ranh giới, để bốn tầng trên biên dịch được ngay từ phút đầu và `tsc` bắt lệch hợp đồng tức thì. Chữ ký **chép từ spine tầng** đã khai sẵn (`AD-CP-1`, `AD-CP-3`, `AD-CP-4`, `AD-GT-1`, `AD-GT-5`, `AD-GT-9`, `AD-GT-12`, `AD-AG-1`, `AD-AG-9`, `AD-UI-6`), không phát minh lại.

## Boundaries & Constraints

**Always:**
- Thân hàm là `throw new Error("chưa hiện thực")`. Không viết logic nghiệp vụ nào.
- Mọi chữ ký chép từ `AD` của spine tầng; trích mã `AD` ngay tại chỗ khai.
- Định danh trong mã tiếng Anh; chỉ **giá trị** enum nghiệp vụ giữ tiếng Việt không dấu theo Mục 0. Chú thích tiếng Việt có dấu.
- `src/autonomy` không có lời nhập **giá trị** nào ra ngoài chính nó (`AD-GT-4`). Nhập kiểu dùng dạng `import type { X } from '…'`, **không** dùng `import { type X }` — `verbatimModuleSyntax` bật.
- Alias là `@/*` → `./src/*`.

**Ask First:**
- Hai xung đột dưới, nếu cách giải khác đề xuất ở *Design Notes*.
- Thêm bất kỳ mã nào vào `BusinessRuleCode` mà không tra được ở PRD §7.1/§9, Mục 0, hay một `AD`.

**Never:**
- Không sửa `prisma/schema.prisma`, `src/core/{db,audit,settings,metrics,normalize,actor}.ts`, `src/core/opportunity/stage.ts` — đã kiểm, ngoài phạm vi.
- Không đụng `package.json`, `vitest.config.ts`, `tests/` — thuộc phần đã hoãn (`C0-7`/`C0-8`/`C0-9`).
- Không commit, không push.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Hợp đồng khớp | Cả năm thư mục có tệp kiểu | `npx tsc --noEmit` thoát 0 | N/A |
| Gọi thân rỗng | Bất kỳ hàm nào của Cục 0 | Ném `Error("chưa hiện thực")` | Có chủ đích — không nuốt, không trả giá trị giả |
| Tầng ③ nhập giá trị ra ngoài | `import { x } from '@/core/…'` trong `src/autonomy` | `tsc` hoặc lint đỏ | `AD-GT-4` |
| `params` khai `z.ZodType` | `defineCap` với lược đồ không phải object | `TS2339` tại `.shape` | `AD-CP-3` — phải là `z.ZodObject<z.ZodRawShape>` |
| `params` chứa `z.date()` | Lược đồ tham số có ngày | Zod 4 ném **lúc dựng** | Dùng `z.iso.datetime()` (`AD-CP-3`) |

</frozen-after-approval>

## Code Map

- `src/core/errors.ts` -- ĐÃ CÓ. `DenyReason` (6) · `BusinessRuleCode` (11 `BR-D` + 5 `NFR` + 3 `STATE_*`) · `FailureCode` (`FT1`–`FT10`) · `GateDenied` · `BusinessRuleError`. `C0-1` mở rộng, **không** viết lại. Xem xung đột ① ở *Design Notes*.
- `src/core/db.ts:63-67` -- ĐÃ CÓ. Xuất `Tx = Omit<typeof db, …>` và `tx()` có ép kiểu `as unknown as Tx`. Xung đột ② ở *Design Notes*.
- `src/core/actor.ts` -- ĐÃ CÓ. `Actor` (3 nhánh) · `Role` · `isHuman` · `isMachine`. Nguồn của mọi tham số `actor`.
- `architecture-tier3-autonomy/ARCHITECTURE-SPINE.md:83-135` (`AD-GT-1`), `:263-300` (`AD-GT-5`), `:372-395` (`AD-GT-9`), `:305-330` (`AD-GT-12`) -- chữ ký `GateContext` 6 trường, `GateEntry` 5 trường, `crossesBoundary`, `decide`, `GateDecision`.
- `architecture-tier4-capability/ARCHITECTURE-SPINE.md:112-150` (`AD-CP-1`), `:179-238` (`AD-CP-3`), `:239-266` (`AD-CP-4`) -- `createRegistry`, `RegistryEntry`, `defineCap`, `CapContext`, `PrismaTx`.
- `architecture-tier2-agent/ARCHITECTURE-SPINE.md:92-118` (`AD-AG-1`), `:274-303` (`AD-AG-9`) -- `AgentDeps`, `ExtractionResult` union.
- `architecture-tier1-tuong-tac/ARCHITECTURE-SPINE.md:205-269` (`AD-UI-6`, `AD-UI-7`) -- chữ ký server action; **không lỗi nào băng qua ranh giới bằng cách ném**.

## Tasks & Acceptance

**Execution:**
- [x] `src/core/errors.ts` -- gỡ `DenyReason` và `GateDenied`; `src/core/audit.ts` chuyển sang `import type { GateDenyReason } from "@/autonomy/gate"` -- `AD-GT-12`
- [x] `src/capability/errors.ts` -- **TỆP THÊM, không có trong bản nháp**: lớp `GateDenied` chuyển về tầng ④ thay vì bị xoá -- `AD-UI-6` liệt nó là lỗi *mong đợi* mà server action phải bắt, nên nó vẫn phải tồn tại; chỉ đổi chủ sở hữu
- [x] `src/autonomy/gate.ts` -- khai `GateEntry` (5 trường) · `GateContext` (6 trường) · `GateDenyReason` (6 mã) · `GateDecision`; hàm `decide(entry, actor, ctx)`, thân rỗng -- `AD-GT-1`, `AD-GT-9`, `AD-GT-12`
- [x] `src/autonomy/zones.ts` -- hằng số vùng + `crossesBoundary(entry, actor): BoundaryCode | null`, thân rỗng -- `AD-GT-3`, `AD-GT-5`
- [x] `src/capability/types.ts` -- `RegistryEntry extends GateEntry` + 5 trường tầng ④ · `CapContext` · `PrismaTx` (tái xuất `Tx`) · `defineCap<S extends z.ZodObject<z.ZodRawShape>, R>` -- `AD-CP-3`, `AD-CP-4`
- [x] `src/core/db.ts` -- xung đột ②: `Tx` dẫn xuất từ `$transaction`, bỏ `as unknown as Tx` -- `AD-CP-4`
- [x] `eslint.config.mjs` -- **TỆP THÊM**: luật `no-restricted-imports` cho `src/autonomy/**` -- dòng 3 của ma trận I/O nói *lint đỏ*, mà đo được là KHÔNG có guard nào; bất biến `AD-GT-4` chỉ do quy ước giữ
- [x] `src/capability/registry.ts` -- `createRegistry({ seedMode, auditSink })` trả `{ loadCapability }`, thân rỗng -- `AD-CP-1`
- [x] `src/capability/gate-context.ts` -- `collectGateContext(actor, seedMode): Promise<GateContext>`, thân rỗng -- `AD-CP-7`, `AD-GT-1`
- [x] `src/agent/types.ts` -- `AgentDeps` · lược đồ Zod Phát hiện (**không** `z.date()`) · `ExtractionResult` union ba nhánh -- `AD-AG-1`, `AD-AG-5`, `AD-AG-9`
- [x] `src/core/company/index.ts` … `src/core/{contact,opportunity,activity,timeline,signal,suggestion,nextaction}/index.ts` -- chữ ký nghiệp vụ tám thực thể, thân rỗng -- `C0-2`
- [x] `src/app/_contract.ts` -- **ĐỔI ĐƯỜNG DẪN** so với bản nháp (`_actions/types.ts`): `AD-UI-6` chỉ đích danh `src/app/_contract.ts` và cấm tệp khác khai lại `ActionState`. Spine thắng theo `AD-13`. Gồm `ActionState`, `ServerAction`, và helper cưỡng chế `action(fn)` -- `AD-UI-6`, `AD-UI-7`

**Acceptance Criteria:**
- Given cây mã sau khi Cục 0 xong, when chạy `npx tsc --noEmit`, then thoát 0.
- Given `src/autonomy/*.ts`, when đọc mọi câu `import`, then không câu nào nhập một **giá trị** từ ngoài `src/autonomy`.
- Given mỗi tệp Cục 0 tạo ra, when đọc, then mỗi kiểu và mỗi hàm có trích ít nhất một mã `AD-*` tra được trong spine tầng của nó.
- Given bất kỳ hàm nào của Cục 0, when gọi, then ném `Error` chứa chuỗi `chưa hiện thực`.

## Spec Change Log

## Design Notes

**Xung đột ① — `DenyReason` khai ở hai nơi. ✅ ĐÃ CHỐT 14/8.**
`src/core/errors.ts` (đã viết) có `DenyReason` 6 mã và lớp `GateDenied`. `AD-GT-12` khai `gate.ts` sở hữu `GateDenyReason`, và `AD-GT-9` nói **`GateDecision` là một GIÁ TRỊ** — Cổng *trả về* từ chối, không *ném*. Nếu vậy `GateDenied` là một lớp lỗi không ai ném, và `DenyReason` ở lõi là bản sao thứ hai của từ vựng tầng ③.

**Chốt:** `gate.ts` sở hữu `GateDenyReason` (6 mã); `src/core/errors.ts` **gỡ** `DenyReason` và `GateDenied`. Hệ quả phải xử trong cùng lượt: `src/core/audit.ts` đang nhập `DenyReason` cho trường `denyReason` của `AuditSink.begin` — đổi sang nhập kiểu từ `@/autonomy/gate`. Đó là nhập **kiểu** từ ⑤ sang ③, ngược chiều `AD-1`; nếu `tsc` hoặc lint bác, dùng phương án lui: giữ từ vựng ở `errors.ts` dưới đúng tên `GateDenyReason` và cho `gate.ts` **tái xuất** nó, để vẫn còn đúng MỘT nguồn. Nêu ra chọn phương án nào và vì sao.

**Xung đột ② — kiểu giao dịch. ✅ ĐÃ CHỐT 14/8.**
`db.ts` xuất `Tx = Omit<typeof db, …>` và `tx()` ép `as unknown as Tx`. `AD-CP-4` khai `PrismaTx = Parameters<Parameters<Db['$transaction']>[0]>[0]`, dẫn xuất thay vì ép, vì client đã `$extends` **không** assignable vào `Prisma.TransactionClient` (`TS2345`, spine ghi là đã đo trên Prisma 7.9.1).

**Chốt:** dùng dạng dẫn xuất của `AD-CP-4` và **bỏ ép kiểu** trong `tx()`. Đây là ngoại lệ có chủ đích với ranh giới *"không sửa `src/core/db.ts`"* ở mục **Never** — chỉ được chạm đúng hai dòng `63` và `66`, không chạm phần extension xoá mềm. Nếu bỏ ép kiểu làm `tsc` đỏ ở chỗ khác, DỪNG và báo, đừng thêm ép kiểu mới để che.

## Verification

**Commands:**
- `npx tsc --noEmit` -- expected: thoát 0, không phát ra dòng nào
- `npx eslint src/` -- expected: thoát 0
- `grep -rn "^import {" src/autonomy/` -- expected: không dòng nào nhập giá trị từ ngoài `src/autonomy`
- `grep -rln "chưa hiện thực" src/capability src/autonomy src/agent src/app/_actions` -- expected: mọi tệp có thân hàm đều khớp
