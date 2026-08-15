---
title: 'U8 — Tải tài liệu lên cho một Công ty, để AI đọc ngay (`mở rộng ngoài đề bài`)'
type: 'feature'
created: '2026-08-15'
baseline_commit: 'bfb39922f26566d0131dfba745fccc0ddd2dca1c'
status: 'in-progress'
review_loop_iteration: 0
context:
  - '_bmad-output/planning-artifacts/prds/prd-crm-hackathon-2026-08-14/prd.md'
  - '_bmad-output/planning-artifacts/ux-designs/ux-crm-hackathon-2026-08-14/EXPERIENCE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Nội dung chỉ vào được hệ thống bằng **lệnh** — `npm run ingest`. Với bộ nghiệm
thu thì đủ (`§3` cho chọn *giao diện **hoặc** một lệnh*), nhưng trong buổi demo phải rời màn
hình sang gõ terminal, và ở vòng 3 do đội Sales chấm ở góc end-user thì câu hỏi *"tôi vừa đọc
một tin, đưa vào kiểu gì"* không có câu trả lời trên sản phẩm. `scripts/ingest.ts` tự khai
đúng chỗ hở này: *"giám khảo bấm đổi nguồn trên giao diện thì đường đó phải mang
`actor: human` — bề mặt ấy chưa dựng"*.

**Approach:** Một khối **Tải tài liệu** trên màn Công ty: chọn tệp văn bản, nội dung thành một
Bản lưu của **chính Công ty đó**, vòng quét kế tiếp rút Phát hiện từ nó như mọi Bản lưu khác.
Không bảng mới, không capability mới — `createArticleCap` đã nhận `"human"` và
`snapshotVersion` là chuỗi tự do.

## Boundaries & Constraints

**Always:**
- Tài liệu thuộc **đúng một Công ty** — `BR-D3` giữ nguyên, không có tài liệu “dùng chung”. Đây là lý do khối này nằm ở màn Công ty chứ không ở màn Quản trị.
- Dùng **`createArticle`** đã có (`caps/write-shared.ts:29`) với `snapshotVersion: "tai_lieu"`. `Snapshot.version` là `String` tự do nên **không** phải sửa `prisma/schema.prisma`.
- `allowedActors` của mục đó đã gồm `"human"` → **không** thêm capability, **không** chạm `tests/**`.
- Chỉ nhận **văn bản thuần**: `.txt` `.md` `.html` `.htm`. Định dạng khác từ chối bằng một câu nói **làm gì tiếp**, không nói mã lỗi.
- Trần kích thước **1 MB**, kiểm ở server action chứ không chỉ ở thuộc tính `accept` của ô chọn tệp — thuộc tính đó là gợi ý cho trình duyệt, không phải một phép canh.
- **Vị trí đã chốt: một hàng TRONG khối `Phát hiện`, không phải một `Block` riêng.** Khối đó là nơi Bản lưu và Phát hiện sống, nên hệ quả nằm cạnh nguyên nhân — người tải nhìn thấy kết quả ở đúng chỗ vừa thao tác. Thêm `Block` thứ sáu đẩy kết quả xuống dưới tầm mắt. *(Kết quả hiện ra tới đâu: xem ràng buộc "đừng hứa thứ lượt đọc không trả về" bên dưới.)*
- Hàng tải lên đứng **trên** danh sách Phát hiện, ngăn bằng một kẻ tóc `{colors.rule}`; dòng phụ ghi định dạng nhận và trần kích thước.
- Bản lưu do người tải mang nhãn nguồn **`tài liệu`**, phân biệt được với `bản chụp trước`/`bản chụp sau`. Đây là thứ giữ đúng câu *"mọi đội chạy trên cùng một dữ liệu"* của `§3`: cái thêm vào luôn tự khai là thêm vào.
- `AD-UI-5` — chỉ `page.tsx` gọi `loadCapability`; `AD-UI-6` — action đi qua `action()`; `AD-UI-8` — khối `Phát hiện` vốn đã có ranh giới lỗi riêng, hàng tải lên nằm trong đó và **không** thêm ranh giới mới.
- **Đừng hứa thứ lượt đọc không trả về.** `readAccountSignals` (`src/core/signal/read.ts:130`) trả `{ articleCount, signals }` — Bản lưu chỉ xuất hiện **kèm một Phát hiện** (`_signals.tsx:354`). Tải xong mà chưa có Phát hiện nào thì **không có dòng Bản lưu nào để hiện**. Nên sau khi tải: `revalidatePath` để `articleCount` tăng ngay, cộng một câu *"đã lưu — vòng quét kế tiếp sẽ đọc"*. **Không** mở rộng lượt đọc để trả danh sách Bản lưu trong phạm vi này; hứa "hiện ngay" rồi để trống là cách chắc chắn nhất làm người demo tưởng tính năng hỏng.
- **Phần AI đang tắt**: vẫn tải lên được, nhưng nói rõ *"phần gợi ý đang tắt — tài liệu đã lưu, sẽ đọc khi bật lại"*. `createArticle` **không** `selfLimiting`, nên Cổng sẽ từ chối khi phanh bật; bề mặt phải dựng câu đó từ mã từ chối, không nuốt im lặng.

**Ask First:**
- **`contentHash` phải tính ở đâu, và bằng hàm nào.** `createArticle` bắt bên gọi truyền `contentHash`. Hàm chuẩn là `contentFingerprint` ở `src/ingest/fingerprint.ts`, nhưng `src/app` nhập nó là phá `AD-UI-2` (cấm dùng chung module giữa ba nhánh ①). Đề nghị: dùng `sha256` trần của `node:crypto` trên **nội dung thô**, và ghi ngay tại chỗ rằng tài liệu tải tay **cố ý không đi qua `stripVolatile`** — nó là tệp người chọn, không phải trang web có dấu thời gian tự đổi, nên tám mẫu volatile của `D18` không áp dụng. **Dừng và hỏi** trước khi chọn khác.
- Tải trùng đúng một tệp hai lần: nên tạo hai Bản lưu, hay coi là trùng? Đề nghị **tạo hai** — người bấm hai lần là có chủ đích, khác với vòng quét đọc lại cùng một trang. Hỏi nếu muốn khác.

**Never:**
- Không thêm mục sổ đăng ký, không sửa `prisma/schema.prisma`, không chạm `tests/**`, `src/core/**`, `src/scan/**`, `src/ingest/**`.
- Không nhập `@/ingest/*` vào `src/app/**` (`AD-UI-2`).
- Không cài thư viện đọc PDF/DOCX — một phụ thuộc mới phải chạy được trên clone sạch lúc 9:30 sáng, đổi lấy một định dạng không ai chấm.
- Không tự gán tài liệu cho nhiều Công ty, không đoán Công ty từ nội dung.
- Không commit, không push.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Tải `.md` hợp lệ | tệp 20 KB | Bản lưu mới của Công ty đó; **`articleCount` của khối `Phát hiện` tăng ngay**, kèm câu *"đã lưu — vòng quét kế tiếp sẽ đọc"* | — |
| Vòng quét kế tiếp | có Bản lưu mới | Rút Phát hiện từ nó; Phát hiện hiện ra kèm nhãn nguồn `tài liệu` | — |
| Sai định dạng | `.pdf` | Không lưu gì | *"Chỉ nhận .txt .md .html. Lưu tệp thành văn bản rồi tải lại."* |
| Quá 1 MB | tệp 5 MB | Không lưu gì | Câu nói rõ trần và kích thước tệp |
| Tệp rỗng | 0 byte | Không lưu gì | `rawText` `min(1)` chặn ở tầng dưới; bề mặt nói trước |
| AI đang tắt | `ai_enabled = false` | Cổng từ chối lượt ghi | *"phần gợi ý đang tắt — bật lại rồi tải"*, dựng từ mã từ chối |
| Mất mạng giữa chừng | ngắt khi đang gửi | Trang **không trắng**, giữ nguyên lựa chọn của người dùng (`UX-6`) | *"chưa lưu được, thử lại"* |

</frozen-after-approval>

## Code Map

- `src/capability/caps/write-shared.ts` -- `createArticleCap:29` — chữ ký `params` phải khớp từng trường; `allowedActors` đã có `"human"`
- `src/app/accounts/[id]/_signals.tsx` -- **tệp sẽ sửa**: khối `Phát hiện` (`:228`) là nơi hàng tải lên chèn vào; danh sách Bản lưu ở `:354` là nơi kết quả hiện ra
- `src/app/accounts/[id]/page.tsx` -- `Block title="Phát hiện"` (`:70`) — **không** thêm `Block` mới ở đây
- `src/app/accounts/[id]/actions.ts` -- `createContactAction:17` là khuôn đầy đủ: `currentSession()` → `loadCapability` → gọi → `revalidatePath`
- `src/app/_contract.ts` -- `action()`, `ActionState`
- `src/app/_form.ts` -- `text`/`optionalText`/`checkbox`; **không có** helper đọc `File` — action tự lấy `form.get("file")` và thu hẹp kiểu
- `src/app/accounts/[id]/_signals.tsx` -- `SNAPSHOT_VERSION_LABEL:171` cần khoá `tai_lieu`; chữ ở `:354` đang cứng *"Bản lưu · bản chụp {label}"*, với tài liệu tải tay phải đọc thành *"Bản lưu · tài liệu"* chứ không phải *"bản chụp tài liệu"*
- `src/capability/caps/signal-ui.ts` -- `readAccountSignalsCap:68` và `src/core/signal/read.ts:130` — hình dạng `{ articleCount, signals }` mà khối `Phát hiện` nhận; đây là lý do của ràng buộc *"đừng hứa thứ lượt đọc không trả về"*
- `src/ingest/fingerprint.ts` -- `contentFingerprint:160` — **đọc để hiểu, không nhập** (`AD-UI-2`)
- `scripts/ingest.ts` -- đường lệnh đang chạy; khối mới là đường người, hai đường phải cho cùng hình dạng Bản lưu

## Tasks & Acceptance

**Execution:**
- [x] `src/app/accounts/[id]/_upload-actions.ts` -- server action: đọc `File` từ `FormData`, kiểm đuôi và kích thước, tính `contentHash`, gọi `createArticle` -- đường ghi của tính năng
- [x] `src/app/accounts/[id]/_upload.tsx` -- lá client: ô chọn tệp, nút Tải lên, trạng thái đang gửi (`UX-4`) -- bề mặt
- [x] `src/app/accounts/[id]/_signals.tsx` -- chèn lá trên vào **đầu khối `Phát hiện`**, ngăn bằng kẻ tóc; nhãn nguồn `tài liệu` cho Bản lưu tải tay -- vị trí đã chốt, **không** thêm `Block` thứ sáu
- [x] `eslint.config.mjs` -- loại `playwright-report/` `test-results/` `bao-cao-nghiem-thu/` `.verify/` khỏi lint -- ngoài phạm vi spec nhưng chặn mục Verification của chính nó: bốn thư mục do `npm run verify` sinh ra làm `npm run lint` đỏ với 257 lỗi trên mã đã minify của Playwright

**Acceptance Criteria:**
- Given một Công ty, when tải lên một tệp `.md` chứa tin gọi vốn, then số Bản lưu của Công ty đó tăng ngay và bề mặt nói rõ *"đã lưu — vòng quét kế tiếp sẽ đọc"*; when vòng quét kế tiếp chạy, then Phát hiện rút từ tệp đó hiện trong khối `Phát hiện` với nhãn nguồn `tài liệu`.
- Given một tệp `.pdf`, when bấm Tải lên, then không hàng nào được ghi và người dùng đọc được **phải làm gì tiếp**.
- Given phần AI đang tắt, when tải lên, then thông báo nói rõ trạng thái đó thay vì báo lỗi chung.

## Verification

**Commands:**
- `npx tsc --noEmit` -- expected: sạch
- `npm run lint` -- expected: không lỗi mới, đặc biệt không vi phạm ranh giới nhập của `AD-1`
- `npm run verify` -- expected: mười điểm `T` không hồi quy

**Manual checks (if no CLI):**
- Tải một tệp rồi mở `/accounts/<id>`: Bản lưu mới phải nằm cùng Vùng đọc với bản chụp, không phải một danh sách thứ hai.
