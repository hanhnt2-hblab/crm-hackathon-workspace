---
title: 'U1 — Lệnh một bước chuyển Bản chụp trước ↔ sau (`FR-50`)'
type: 'feature'
created: '2026-08-15'
baseline_commit: 'bfb39922f26566d0131dfba745fccc0ddd2dca1c'
status: 'draft'
review_loop_iteration: 0
context:
  - '_bmad-output/planning-artifacts/prds/prd-crm-hackathon-2026-08-14/prd.md'
  - '_bmad-output/planning-artifacts/architecture/architecture-tier1-tuong-tac/ARCHITECTURE-SPINE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `FR-50` (`phải có`) đòi chuyển một Công ty từ Bản chụp *trước* sang *sau*
**từ giao diện hoặc bằng một lệnh**. Hàm `switchAccountSnapshotVersion` đã tồn tại ở
`src/ingest/load-snapshots.ts:185` nhưng **không có điểm gọi nào** — không script `npm`,
không CLI, không nút. Đây là **cách duy nhất kích hoạt mọi kịch bản AI**, nên hôm nay
`T-6` và `T-8` không có đường chạy: giám khảo không có thao tác nào để bắt đầu.

**Approach:** Thêm một điểm vào CLI mỏng gọi thẳng hàm đã có, cộng một script `npm`.
Không dựng giao diện — đề bài cho chọn *giao diện **hoặc** lệnh*, và lệnh rẻ hơn nhiều
lần trong quỹ giờ còn lại.

## Boundaries & Constraints

**Always:**
- Điểm vào mới nằm trong `src/ingest/`, gọi `switchAccountSnapshotVersion` đã có. Không viết lại logic chuyển.
- Nhận Công ty theo **tên** (khớp chính xác) hoặc theo `id`; in ra dòng kết quả đọc được: công ty nào, từ phiên bản nào sang phiên bản nào.
- Chuyển **hai chiều** — *sau* → *trước* cũng chạy được, để diễn lại demo (`FR-50`).
- Chuyển lùi **không được sinh Bản lưu mới**: so dấu vân với **mọi** Bản lưu của Công ty, không chỉ bản gần nhất. Vế này đã nằm trong hàm lõi — spec này chỉ **không được phá** nó.
- Script `npm` đặt tên `snapshot`, chạy được dạng `npm run snapshot -- --account "<tên>" --version sau`.
- Công ty không tồn tại, hoặc không có bản chụp phiên bản đích → thoát mã khác 0 kèm một câu nói **làm gì tiếp**, không in stack trace (`EXPERIENCE.md`, *Giọng chữ*).

**Ask First:**
- Nếu `switchAccountSnapshotVersion` cần đổi chữ ký để dùng được từ CLI — dừng và báo, đừng đổi rồi mới nói.

**Never:**
- Không chạm `src/app/**`, `src/capability/**`, `src/core/**`, `src/scan/**`, `tests/**`, `prisma/**`.
- Không thêm capability nào vào sổ đăng ký — đường nạp dữ liệu **không** đi qua `loadCapability` cho lượt chuyển này (`AD-21`).
- Không cài thư viện phân tích tham số dòng lệnh; dùng `process.argv` trần.
- Không commit, không push.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Chuyển tiến | Công ty có bản chụp *trước* và *sau*, đang ở *trước* | Sang *sau*; in tên · phiên bản cũ → mới; mã thoát 0 | — |
| Chuyển lùi | đang ở *sau*, chuyển về *trước* | Sang *trước*; **không** Bản lưu mới nào sinh ra | — |
| Đã ở phiên bản đích | đang ở *sau*, yêu cầu *sau* | No-op, in *"đã ở phiên bản sau"*, mã thoát 0 | — |
| Tên không khớp | `--account "Không Có"` | Không đổi gì | Mã thoát ≠ 0, câu chỉ ra cách liệt kê tên đúng |
| Thiếu bản chụp đích | Công ty chỉ có phiên bản *trước* | Không đổi gì | Mã thoát ≠ 0, nói rõ Công ty nào thiếu |
| Thiếu tham số | không truyền `--account` | Không đổi gì | In cách dùng, mã thoát ≠ 0 |

</frozen-after-approval>

## Code Map

- `src/ingest/load-snapshots.ts` -- `switchAccountSnapshotVersion:185` là hàm sẽ được gọi; `renderSnapshotReport:58` là khuôn in kết quả để bắt chước
- `src/ingest/snapshot-source.ts` -- nguồn Bản chụp, đọc để biết cách xác định phiên bản
- `src/ingest/fingerprint.ts` -- `contentFingerprint`, cơ chế chặn Bản lưu trùng khi chuyển lùi
- `package.json` -- thêm script `snapshot`; đối chiếu khuôn `seed` đang dùng `tsx --env-file=.env`

## Tasks & Acceptance

**Execution:**
- [ ] `src/ingest/switch-snapshot.ts` -- điểm vào CLI mới: đọc `process.argv`, gọi hàm đã có, in kết quả, đặt mã thoát -- `FR-50` cần một đường chạy được, không cần một lớp trừu tượng
- [ ] `package.json` -- thêm `"snapshot": "tsx --env-file=.env src/ingest/switch-snapshot.ts"` -- `§7.5` đòi lệnh một bước, và khuôn phải khớp `seed` đang có

**Acceptance Criteria:**
- Given một Công ty đang ở bản chụp *trước*, when chạy `npm run snapshot -- --account "<tên>" --version sau`, then Công ty sang *sau* và vòng quét kế tiếp đọc thấy nội dung mới.
- Given vừa chuyển sang *sau* rồi chuyển lại *trước*, when đếm Bản lưu của Công ty đó, then số Bản lưu **không tăng** so với trước lượt chuyển lùi.
- Given một tên Công ty không tồn tại, when chạy lệnh, then mã thoát khác 0 và không hàng nào trong CSDL đổi.

## Verification

**Commands:**
- `npx tsc --noEmit` -- expected: sạch
- `npm run snapshot -- --account "<tên trong bộ dữ liệu>" --version sau` -- expected: in dòng kết quả, mã thoát 0
- `npm run snapshot -- --account "<tên đó>" --version truoc` -- expected: mã thoát 0; đếm `article` của Công ty đó **không đổi**

**Manual checks (if no CLI):**
- Chạy lệnh hai lần liên tiếp cùng phiên bản: lần hai phải là no-op có thông báo, không phải lỗi.
