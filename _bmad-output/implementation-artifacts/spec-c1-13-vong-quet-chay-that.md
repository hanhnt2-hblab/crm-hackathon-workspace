---
title: 'C1-13 — chạy MỘT vòng quét thật trên CSDL demo, đo và vá phần tầng ① sở hữu'
type: 'bugfix'
created: '2026-08-14'
status: 'done' # CHECKPOINT 1 duyệt tự động [A] — không có người trong vòng lặp ở lượt chạy này
baseline_commit: '4dee5324ea720ede183bec6771f4e342d764a168'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/planning-artifacts/architecture/architecture-crm-hackathon-2026-08-14/ARCHITECTURE-SPINE.md'
  - '{project-root}/_bmad-output/planning-artifacts/architecture/architecture-tier1-tuong-tac/ARCHITECTURE-SPINE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `createExtract(registry)` vừa nối tầng ② vào vòng quét ở `src/scan/bootstrap.ts` và **dựng được nhưng chưa ai chạy một vòng thật**. Không có số đo thật thì `M3` (`T-4` `T-6` `T-8` `T-9`) không có bằng chứng nào, và `R3` — *chi phí và độ trễ thật của tầng ② trên vòng quét đủ lớn chưa đo* — vẫn treo.

**Approach:** Chạy vòng quét thật trên CSDL demo 5442, đo sáu con số (`modelCalls`, chi phí, Phát hiện lưu được, mục Dòng thời gian, sáu trường `FR-39`, `stopReason`), vá mọi thứ hỏng **nằm trong** `src/scan/**` · `src/ingest/**` · `src/core/scanlog.ts` · `src/capability/caps/scan.ts`, và ghi lại — không sửa — thứ hỏng ngoài phạm vi đó.

## Boundaries & Constraints

**Always:**
- `src/scan` và `src/ingest` là tầng ①: đi xuống **chỉ** qua `loadCapability()`, không `db`/`tx`/`@prisma/client` (`AD-1`). `src/core/scanlog.ts` được cầm `db`.
- Mọi script tạm phải gọi `process.exit()` tường minh — máy chủ MCP giữ event loop sống, script không thoát sẽ **treo vô hạn và không in lỗi** (đã đo, mất một lượt 600 giây).
- Tối đa **ba lượt gọi mô hình thật** cho cả lượt làm việc; báo cáo tổng chi phí.
- `stopReason` của tầng ② trả `"tool_use"` ở lượt THÀNH CÔNG — khác `end_turn` **không** phải hỏng (`AD-AG-9`).
- Chạm CSDL demo 5442 thì chỉ THÊM, không xoá dữ liệu người khác.

**Ask First:** không có — mọi quyết định trong lượt này đã bị ràng buộc bởi phạm vi tệp sở hữu.

**Never:**
- Không chạy `npm test` (xoá lược đồ 5443, agent khác đang dùng) và không chạy `npm run seed`.
- Không sửa `src/app/**` · `src/agent/**` · `src/autonomy/**` · `src/core/**` trừ `scanlog.ts` · `src/capability/**` trừ `caps/scan.ts` · `tests/**` · `prisma/**` · `package.json` · `eslint.config.mjs`.
- Không kết luận vòng quét hỏng vì mô hình trả `relevance: high` và `eventDate: null` cho mọi Phát hiện — `BR-D6` đang được vá ở lõi bởi agent khác.
- Không commit, không push.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Vòng quét đủ điều kiện | 3 Công ty `watching=true`, mỗi Công ty một Bản lưu `readable`, `signalCount=0`, `ai_enabled=true` | Mở `scan_log`, quét đủ 3 Công ty, gọi mô hình, lưu Phát hiện + mục Dòng thời gian, đóng vòng với `stopReason='hoan_tat'`, in dòng `FR-39` đủ sáu trường | mọi `callCap` trả giá trị, không ném |
| Chống trùng (`T-8`) | Chạy lại trên nội dung KHÔNG ĐỔI | `article.signalCount > 0` → bỏ qua trước khi gọi mô hình; số mục Dòng thời gian **không tăng** | không lượt gọi mô hình nào bị tiêu |
| Phanh AI (`T-9`) | `settings.ai_enabled='false'` giữa lúc vòng đang chạy | Vòng hiện tại cắt ở ranh giới Công ty (`stopReason='phanh_ai_tat'`); hai chu kỳ kế tiếp trả `{ran:false, reason:'phanh_ai_tat'}`, **không** mở `scan_log`, không thêm mục, không sinh Gợi ý | `readSetting` bị Cổng bác mã `brake` được đọc thành trạng thái, không thành lỗi |
| Capability vắng mặt | `createSignal` / `disableAi` / `createArticle` không có trong sổ đăng ký | `callCap` trả `denied` mã `unknown_capability`; vòng bỏ Phát hiện đó và đi tiếp, `noteDenial` đếm | hỏng TO và RÕ, không hỏng im lặng |

</frozen-after-approval>

## Code Map

- `src/scan/bootstrap.ts` — composition root nhánh máy; `createExtract` (dòng 106–143) là bộ nối vừa xong. Khối cuối tệp (dòng 243–253) **tự khởi động vòng lặp** khi `NODE_ENV !== "test"` — mọi script tạm phải đặt `NODE_ENV=test` trước khi nhập, nếu không nó chạy nền song song.
- `src/scan/loop.ts` — `runScanCycle`; bước 1 đọc phanh (dòng 106–114), bước 4 vòng Công ty (179–237), `scanOneAccount` (266–361), `writeSignals` (368–400), `finish` (434–484). Chống trùng `T-8` ở dòng 311: `if (article.signalCount > 0) return "xong"`.
- `src/scan/_contract.ts` — `callCap` không ném (56–71); `parseLatestArticle` (145–159) đòi `{id, snapshotId, version, contentHash, normalizedText, readable, signalCount}`.
- `src/scan/journal.ts` — `renderCycleLine` (36–50) in sáu trường `FR-39`.
- `src/core/scanlog.ts` — `openScanLog`/`closeScanLog`/`recordScanEntry`/`addScanUsage`, khoá Công ty. `closeScanLog` (306–361) là chỗ sáu trường được TÍNH.
- `src/capability/caps/scan.ts` — sáu mục của vòng quét, đã được nối vào `caps/index.ts:21`. Xung đột `readAccountList` đã tự giải: `ui.ts` nay khai `searchAccounts`.
- `src/capability/caps/read-shared.ts` — **CHỈ ĐỌC với lượt này**. `readArticleCap` khai `params: z.object({ id: z.uuid() })` và gọi `readArticle(p.id)`; tầng ① gọi `{accountId, scope:'latest'|'all'}` → lệch hợp đồng.
- `src/capability/caps/index.ts` — sổ đăng ký hiện có **34** mục; `createSignal`, `createArticle`, `disableAi`, `enableAi` **không** có mặt.
- `src/autonomy/gate.ts:145` — Cổng NAY ĐÃ đọc `entry.selfLimiting`; cảnh báo ở đầu `loop.ts` (dòng 10–23) nói ngược lại và đã lỗi thời.
- `prisma/seed.ts` — 130 dòng, chỉ gieo 3 Công ty. Không gieo `settings`, không bật `watching`, không gieo Bản chụp/Bản lưu/`timeline`. `C5-17` chưa xong.

## Tasks & Acceptance

**Execution:**
- [x] Dựng dữ liệu tiền đề trên CSDL demo bằng SQL trực tiếp (`watching=true`, hàng `timeline`, `snapshot`+`article` có nội dung tin thật) — `src/ingest` không dùng được vì `createArticle` vắng mặt khỏi sổ đăng ký.
- [x] Viết script tạm dưới `src/scan/` chạy `runScanCycle` một lần, đo, rồi `process.exit(0)`. Xoá script sau khi xong.
- [x] `src/scan/loop.ts` — sửa mọi lệch phát lộ trong lượt chạy; cập nhật khối cảnh báo đầu tệp cho khớp `gate.ts` hiện tại.
- [x] `src/scan/journal.ts` / `src/scan/_contract.ts` / `src/core/scanlog.ts` / `src/capability/caps/scan.ts` — sửa theo phát lộ, chỉ trong bốn tệp này.
- [x] Ghi vào `_bmad-output/implementation-artifacts/deferred-work.md` mọi lỗi ngoài phạm vi, kèm bằng chứng `tệp:dòng`.

**Acceptance Criteria:**
- Given CSDL demo có 3 Công ty `watching` và Bản lưu đọc được, when chạy `runScanCycle` một lần, then dòng `FR-39` in ra có đủ sáu trường và `scan_log` có một hàng `finished_at` khác `NULL`.
- Given lượt chạy trên, when đọc `scan_log_entry`, then mỗi Công ty đã chạm có đúng một hàng, kể cả Công ty hỏng (`AD-AG-9`).
- Given nội dung Bản lưu KHÔNG ĐỔI, when chạy ba chu kỳ liên tiếp, then số mục Dòng thời gian `added_by='he_thong'` **không tăng** sau chu kỳ đầu.
- Given `settings.ai_enabled='false'`, when chạy hai chu kỳ, then cả hai trả `{ran:false, reason:'phanh_ai_tat'}`, không hàng `scan_log` mới, không hàng `suggestion` mới, không hàng `next_action` mới, và số hàng `signal`/`timeline_entry` giữ nguyên.

## Spec Change Log

## Verification

**Commands:**
- `npx tsc --noEmit` — kỳ vọng: sạch.
- `npx eslint src/scan src/ingest src/core/scanlog.ts src/capability/caps/scan.ts` — kỳ vọng: sạch, đặc biệt luật ranh giới nhập của `AD-1`.
- `docker exec why-now-db psql -U whynow -d whynow -c "<truy vấn đếm>"` — khẳng định thẳng trên dữ liệu, không tin log.

**Manual checks:**
- Dòng `[vòng quét] …` trên stdout phải mang: mốc bắt đầu · `N Công ty` · `nội dung mới N` · `thêm N mục Dòng thời gian` · thời lượng · `lỗi: …`. Sáu trường, đúng thứ tự `FR-39`.

## Kết quả đo được — 14/08, CSDL demo 5442

| Đại lượng | Giá trị thật |
|---|---|
| Bộ nối tầng ② (`createExtract`→MCP→`extractSignals`→mô hình) | **chạy được** |
| `modelCalls` · `numTurns` · chi phí · `stopReason` | `1` · `2` · **$0,0424** · `tool_use` |
| Phát hiện rút được · câu trích khớp nguyên văn | 3 · **3/3** |
| Độ trễ một lượt | 17,9s |
| Vòng quét đầy đủ | chạy, nhưng **chặn ở `readArticle`** — 0 lượt gọi mô hình |
| Phát hiện lưu được · mục Dòng thời gian sinh ra | 0 · 0 (`createSignal` vắng mặt khỏi sổ) |
| Dòng `FR-39` đủ sáu trường | **đủ**, cộng `VÒNG KHÔNG TRỌN`, số Phát hiện, lượt gọi, chi phí |
| `T-9` | **đạt** — hai chu kỳ `phanh_ai_tat`, mọi bảng giữ nguyên, hai dòng ghọi vết `readSetting deny brake` |
| `T-8` | **chưa có đường chạy đầu-cuối** — chặn bởi hai lỗ tầng ④ |
| Chống trùng dấu vân (hàm thuần) | **đạt** — 3 chu kỳ cùng nội dung và `truoc→sau→truoc` đều không tăng số Bản lưu |
| **Tổng chi phí mô hình** | **$0,0424** (1 trên 3 lượt được phép) |

CHECKPOINT 1 được duyệt tự động `[A]`: lượt chạy này không có người trong vòng lặp.
Bước 3 hiện thực TRỰC TIẾP thay vì giao subagent: lượt chạy tiêu tiền thật với trần ba
lượt gọi, và bẫy treo event loop của máy chủ MCP đã từng ăn mất một lượt 600 giây — giao
đi là mất quyền kiểm soát cả hai.
