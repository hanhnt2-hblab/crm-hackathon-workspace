---
title: 'C1-8 · T-3 — Khối Phát hiện trên hồ sơ Công ty, bấm là mở đoạn văn gốc có đánh dấu'
type: 'feature'
created: '2026-08-15'
status: 'done'
baseline_commit: 'bfb39922f26566d0131dfba745fccc0ddd2dca1c'
review_loop_iteration: 0
context:
  - '{project-root}/e2e/T3.spec.ts'
  - '{project-root}/src/capability/caps/ui.ts'
  - '{project-root}/src/core/company/index.ts'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `§6` đề bài đòi *"bấm vào một phát hiện thì mở đúng đoạn văn gốc trong bản lưu, có
đánh dấu vị trí"* (`T-3`), nhưng `src/app` hôm nay không màn hình nào hiện một Phát hiện — nên
`e2e/T3.spec.ts` phần ② đỏ vì **không có gì để bấm**. Dữ liệu đã sẵn: `signal.quote_start` /
`quote_end` là offset **lưu sẵn** vào `article.normalized_text` (`AD-18`).

**Approach:** Dựng ba mắt xích còn thiếu theo đúng chiều tầng ① → ④ → ⑤: một hàm đọc ở lõi
(`readAccountSignals`), một mục sổ đăng ký `kind: "read"` bọc nó, và khối `SignalsBlock` trên
`/accounts/[id]`. Khối cắt `normalizedText` thành ba mảnh `[0,start)` + `[start,end)` + `[end,∞)`
và bọc mảnh giữa bằng thẻ **ngữ nghĩa** `<mark>`. Mở/đóng đoạn văn bằng cặp `<details>`/`<summary>`
gốc HTML — không cần lá `'use client'`, không cần state.

## Boundaries & Constraints

**Always:**
- `AD-1` — `src/app` đi xuống **chỉ qua** `loadCapability()`; không nhập `db`/`tx`/`@prisma/client`.
- `AD-UI-5` — khối server đọc dữ liệu rồi truyền props **đã tuần tự hoá** (`Date` → ISO) xuống.
- `AD-UI-8` — `SignalsBlock` là khối tải độc lập, đã có `<Suspense>` + `<Block>` bọc sẵn ở `page.tsx`.
- `AD-CP-3` — `kind` là thứ *"quyết định có mở giao dịch không"*; đường ĐỌC dùng `db` trực tiếp,
  **không** mở giao dịch (khuôn: `searchCompanies`). `AD-CR-6` — `db` đã gắn extension lọc
  `deleted_at`; tra theo id thì dùng `findFirst`, không `findUnique`.
- `AD-18` — offset **lưu sẵn**, tuyệt đối không tính lại lúc hiển thị; `signal.quote` đã là bản
  chuẩn hoá khớp `normalizedText.slice(start, end)` (vá 14/8 ở `createSignal`), đừng chuẩn hoá lại.
- `AD-CP-6` — capability mới `kind: "read"`, `exposeToMcp: **false**` (tập phơi chốt đúng năm mục).
- `FR-16` · `D24` — ba Mức chắc chắn phân biệt bằng **ký hiệu VÀ chữ**, không bao giờ chỉ bằng màu.
- `FR-14` — Bản lưu và Phát hiện là **một khu riêng** trên màn hình Công ty, KHÔNG phải hồ sơ và
  KHÔNG phải Dòng thời gian. `page.tsx` đã dựng đúng khu đó (`<Block title="Phát hiện">`).
- Định danh tiếng Anh; chữ hiển thị và chú thích tiếng Việt có dấu.
- Chọn phần tử theo **vai và chữ**, không theo class CSS.

**Ask First:**
- Bất cứ thay đổi nào ngoài bốn tệp sở hữu.
- Bất cứ đề nghị nào nới khẳng định của `e2e/T3.spec.ts` — nó là đề bài, không phải bản nháp.

**Never:**
- Không chạm `page.tsx` · `_suggestions.tsx` · `_next-action.tsx` · `src/core/signal/index.ts` ·
  `src/capability/caps/ui.ts` · `src/scan/**` · `tests/**` · `e2e/**` · `prisma/**` · `package.json`
  (ba agent khác đang chạy trên chúng).
- Không thay `<mark>` bằng `<span class="highlight">` — `<mark>` là thẻ ngữ nghĩa, trình đọc màn
  hình công bố nó; `e2e/T3.spec.ts:173` cố ý không nhận class trang trí.
- Không tô cả đoạn văn: đúng **một** phần tử `<mark>` bọc **đúng** câu trích.
- Không mở đường GHI nào (nút *không hữu ích* `FR-42`/`D30` nằm ngoài phạm vi story này).
- Không chạy `npm test` · `npm run verify` · `npm run seed` — chúng đụng CSDL/cổng của người khác.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Có Phát hiện | Công ty có ≥1 `signal` sống | Mỗi Phát hiện một `<details>`; `<summary>` mang **đúng** `claim`, bấm được | N/A |
| Bấm mở | Bấm `<summary>` | `<details>` mở, hiện **trọn** `article.normalizedText` | N/A |
| Đánh dấu vị trí | `normalizedText.slice(start,end) === quote` | Đúng một `<mark>` bọc đúng câu trích, giữa đoạn văn | N/A |
| Offset lệch | `slice(start,end) !== quote` | Hiện đoạn văn từ **đầu**, **không** `<mark>`, và **nói rõ** không neo được (`EXPERIENCE.md:127`, hàng `S10` cột Lỗi) | Không đoán lại vị trí; không tìm lại chuỗi |
| Nguồn không đọc được | `article.readable === false` | Nói *"nguồn không đọc được"* **kèm lý do** `unreadableReason` (`EXPERIENCE.md:127`, `FR-11`) | Không đoán nội dung |
| Rỗng | Công ty chưa có Phát hiện | *"Chưa đọc nguồn nào cho account này."* (`EXPERIENCE.md:109`, hàng `S3` cột Rỗng) | N/A |
| Công ty không tồn tại | `accountId` lạ | Mảng rỗng → trạng thái rỗng | Không ném; 404 là việc của `ProfileBlock` |
| Khối hỏng | Lõi ném | `<Block>` của `page.tsx` bắt, ba khối kia còn dùng được | `AD-UI-8` |

</frozen-after-approval>

## Code Map

- `e2e/T3.spec.ts:138–175` — **đề bài**, ba khẳng định theo thứ tự: `getByText(claim,{exact:true})`
  bấm được → `getByText(BAI_VIET,{exact:false})` visible → `expect(page.locator("mark"))
  .toHaveText(CAU_TRICH)`. Vế ba dùng **strict mode**: cả trang chỉ được có **một** `<mark>`.
- `src/app/accounts/[id]/page.tsx:69–74` — đã gọi sẵn `<Block title="Phát hiện"><Suspense>
  <SignalsBlock accountId={id}/>`. CHỈ ĐỌC.
- `src/app/accounts/[id]/_signals.tsx` — khung rỗng, thay toàn bộ thân. **Tệp sở hữu.**
- `src/core/signal/read.ts` — tạo mới. **Tệp sở hữu.**
- `src/capability/caps/signal-ui.ts` — tạo mới. **Tệp sở hữu.**
- `src/capability/caps/index.ts:19–34` — CHỈ thêm một dòng `import { entries as signalUiEntries }
  from "./signal-ui";` và một dòng `...signalUiEntries,` trong `GOP`. **Tệp sở hữu, hai dòng.**
- `src/capability/caps/ui.ts:63–77` (`READ_COMMON`) và `:236–275` (`readAccountDetailCap`) —
  **khuôn** của một cap đọc. `READ_COMMON` **không export**, nên khai lại hằng tương đương tại chỗ.
- `src/core/company/index.ts:336–401` (`searchCompanies`) — khuôn đường đọc lõi: `db` trực tiếp,
  `_actor` nhận nhưng không đọc (`AD-CR-10`), `Date` → ISO trước khi trả.
- `src/capability/types.ts:58–98` — `RegistryEntry`; `:119` `defineCap`. `src/autonomy/gate.ts:31`
  — `GateEntry` năm trường bắt buộc (`name`, `allowedActors`, `allowedRoles`, `touches`,
  `selfLimiting`).
- `prisma/schema.prisma` — `Signal.quoteStart/quoteEnd` là offset trên **bản chuẩn hoá**;
  `Article.normalizedText`, `Article.readable`, `Snapshot.version`. CHỈ ĐỌC.
- `src/app/_registry.ts:32` `appRegistry`, `src/app/_session.ts:51` `currentSession()` — cửa xuống.
- `src/app/globals.css` — **không có** kiểu cho `mark`. Không sửa được (ngoài tệp sở hữu) → dùng
  `style` nội tuyến trên chính `<mark>`.
- `eslint.config.mjs:191–219` — `src/app/**` cấm `db`/`tx`/`@prisma/client`; `:126–154` —
  `src/capability/**` cấm luôn `db`/`tx`. Nên cap **phải** gọi hàm lõi, không được đọc thẳng.
- `tests/T10B.test.ts:37–76,152–168` — DANH SÁCH TRẮNG hàm lõi mà `caps/*.ts` được nhập. Regex chỉ
  bắt dạng `import { … } from "@/core/…"` (dạng `import type { … }` không dính). **Không sở hữu
  tệp này** — báo tên hàm, không tự sửa.

## Tasks & Acceptance

**Execution:**
- [x] `src/core/signal/read.ts` — tạo `readAccountSignals(_actor, accountId)` trả về mảng đã tuần
  tự hoá: `{id, claim, quote, quoteStart, quoteEnd, signalType, signalSubtype, confidence,
  relevance, eventDate|null, createdAt, article:{id, normalizedText, readable, unreadableReason,
  publishedUrl, readAt, snapshotVersion}}`. Dùng `db` trực tiếp, **không** `tx` (`AD-CR-7`). Khoá
  sắp ba tầng để thứ tự ổn định (`AD-UI-12`): `createdAt desc`, `id desc`. — lý do: tầng ④ bị
  eslint cấm cầm `db`, nên đường đọc phải bắt đầu ở lõi.
- [x] `src/capability/caps/signal-ui.ts` — tạo `readAccountSignalsCap`: `kind:"read"`,
  `allowedActors:["human"]`, `zone:"tu_do"`, `risk:"low"`, `selfLimiting:false`,
  `exposeToMcp:false`, `snapshot:null`, `params: z.object({accountId: z.uuid()})`, thân **một dòng**
  gọi hàm lõi. Xuất `entries`. — lý do: `AD-19` bắt mọi lượt đọc qua sổ đăng ký.
- [x] `src/capability/caps/index.ts` — thêm ĐÚNG hai dòng (nhập + trải vào `GOP`). — lý do:
  `AD-CP-1`, thiếu là mục im lặng không tồn tại.
- [x] `src/app/accounts/[id]/_signals.tsx` — thay toàn bộ thân: `SignalsBlock` gọi
  `currentSession()` + `appRegistry.loadCapability("readAccountSignals", …)`, render danh sách
  `<details>`/`<summary>` + đoạn văn ba mảnh với `<mark>`. Khai kiểu hàng **tại chỗ** (không sửa
  `_types.ts`, ngoài tệp sở hữu). — lý do: đây là bề mặt `T-3` bấm vào.

**Acceptance Criteria:**
- Given một Công ty có một Phát hiện, when mở `/accounts/{id}`, then câu `claim` hiện ra trong đúng
  **một** phần tử mà `getByText(claim, {exact:true})` khớp, và phần tử đó bấm được.
- Given đoạn văn đang đóng, when bấm câu nhận định, then **trọn** `article.normalizedText` hiện ra
  (không phải chỉ câu trích), và câu trích nằm **giữa** đoạn văn đúng vị trí `[start, end)` đã lưu.
- Given đoạn văn đã mở, when đếm `page.locator("mark")`, then có **đúng một** phần tử và nội dung
  của nó bằng đúng `signal.quote`.
- Given Công ty chưa có Phát hiện nào, when mở hồ sơ, then khối hiện câu trạng thái rỗng và không
  render `<mark>` nào.
- Given `npx tsc --noEmit` và `npx eslint src/`, when chạy, then cả hai sạch.

## Spec Change Log

## Design Notes

**BA CHỖ LỆCH ĐÃ NÊU RA, không tự chọn bên.**

① `AD-UI-5` viết nguyên văn *"trong `src/app`, **chỉ** `page.tsx` và `layout.tsx` được gọi
`loadCapability()`"*. `_signals.tsx` không phải hai tệp đó, nhưng `page.tsx` — tệp tôi **không được
chạm** — đã gọi `SignalsBlock({accountId})` và chỉ truyền xuống một chuỗi id, nên lượt đọc **bắt
buộc** nằm trong `_signals.tsx`. Hai khối anh em (`_suggestions.tsx`, `_next-action.tsx`) đứng cùng
hình dạng. Đây là quy ước đội **đã** áp; tôi theo nó và nêu ra, không sửa spine.

② `EXPERIENCE.md:53,96` giao *"bấm một Signal → mở đúng đoạn văn gốc có đánh dấu"* cho bề mặt
**`S10` Snapshot viewer** (một tuyến `snapshots/[id]` riêng), và spine tầng ① ghi `S7` là *"bề mặt
duy nhất không dựng"*. Nhưng `e2e/T3.spec.ts:144` `goto('/accounts/{id}')` rồi khẳng định cả ba
bước **trên chính trang đó**, không điều hướng. `AD-13` xếp **đề bài §1–§7 trên UX**, và `T-3` là
đề bài. Nên `T-3` đóng bằng khu đọc tại chỗ trên `S3` (đúng `FR-14` + *"1 bấm"* của
`EXPERIENCE.md:162`); tuyến `S10` riêng **vẫn còn nợ**, ngoài phạm vi story này.

③ Câu *"`AD-CR-7`: đường đọc dùng `db` trực tiếp"* **không tra được** — `AD-CR-7` chỉ nói về
capability **GHI** (*"mọi capability ghi mở đúng một `db.$transaction`"*). Vế đúng cho đường đọc là
`AD-CP-3` (`kind` quyết định có mở giao dịch không) cộng `AD-CR-6` (`db` đã lọc `deleted_at`).
Hành vi không đổi; mã trích thì đổi, vì trích sai chỗ còn tệ hơn không trích.

**Thứ tự sắp Phát hiện — KHÔNG có mã thượng nguồn.** Không `D` nào chốt thứ tự danh sách Phát hiện
(`D31` nói về Hàng đợi gợi ý, chuyện khác). Vế gần nhất là `FR-11`: *"các Bản lưu của một Công ty
xếp theo thời điểm đọc"*. Nên sắp `article.readAt desc` → `createdAt desc` → `id desc` (ba tầng cho
toàn thứ tự ổn định, `AD-UI-12`) và ghi nhận đây là **suy ra**, không phải một dòng đã chốt.

**Vì sao `<details>`/`<summary>` chứ không phải lá `'use client'` + `useState`.**
`'use client'` là chỉ thị **mức tệp**. Tôi chỉ sở hữu một tệp `_signals.tsx`, mà tệp đó phải chứa
`SignalsBlock` — một server component `async` gọi `loadCapability()` (`AD-UI-5` cấm lá client làm
việc đó). Đặt `'use client'` lên đầu tệp là giết chính `SignalsBlock`. `<details>` cho đúng hành vi
*bấm-để-mở* bằng HTML gốc, không JavaScript, không state, và `<summary>` vốn đã bấm được bằng cả
chuột lẫn bàn phím — tức sàn tiếp cận cao hơn một `<div onClick>`.

**Vì sao chỉ một `<mark>` trên trang.** `expect(page.locator("mark")).toHaveText(CAU_TRICH)` chạy ở
strict mode: nhiều phần tử thì phải truyền mảng, nên nhiều `<mark>` là đỏ. Với một Phát hiện thì
đúng một `<mark>`. Nếu về sau khối hiện nhiều Phát hiện cùng lúc, đây là chỗ phải xem lại — đã ghi
vào phần *chỗ phải đoán* của báo cáo.

**Cắt ba mảnh, và vế kiểm trước khi cắt.**

```tsx
const { normalizedText: t } = s.article;
const anchored = t.slice(s.quoteStart, s.quoteEnd) === s.quote;
// Neo hỏng thì KHÔNG đoán lại vị trí: tô sai chỗ tệ hơn không tô.
{anchored ? (
  <p>{t.slice(0, s.quoteStart)}<mark>{t.slice(s.quoteStart, s.quoteEnd)}</mark>{t.slice(s.quoteEnd)}</p>
) : (
  <><p>{t}</p><p className="failed">Không neo được câu trích vào đoạn văn này.</p></>
)}
```

`getByText(BAI_VIET, {exact:false})` vẫn khớp `<p>` dù văn bản bị `<mark>` chẻ làm ba: Playwright
so trên **text content** của phần tử và chỉ báo phần tử **sâu nhất** khớp — `<mark>` không chứa trọn
`BAI_VIET` nên `<p>` là kết quả duy nhất.

## Verification

**Commands:**
- `npx tsc --noEmit` — expected: không lỗi.
- `npx eslint src/` — expected: không lỗi, đặc biệt không `no-restricted-imports` ở ba tệp mới.

**Manual checks (if no CLI):**
- `e2e/T3.spec.ts` và `tests/**` **không chạy** (đụng CSDL/cổng của agent khác). Thay vào đó đọc
  lại `e2e/T3.spec.ts:138–175` và đối chiếu từng dòng khẳng định với JSX vừa viết.
- `tests/T10B.test.ts` **sẽ đỏ**: `signal-ui.ts` nhập `readAccountSignals`, một tên chưa có trong
  `CORE_FUNCTIONS_ALLOWED`. Không sửa tệp đó — báo tên hàm lên cho người sở hữu `tests/`.

## Suggested Review Order

**Neo câu trích — chỗ `T-3` đứng hay đổ**

- Vế kiểm trước khi tô: bốn điều kiện, sai một là không tô chứ không đoán lại.
  [`_signals.tsx:345`](../../src/app/accounts/%5Bid%5D/_signals.tsx#L345)

- Ba mảnh, `<mark>` bọc đúng mảnh giữa — thẻ ngữ nghĩa, không phải class.
  [`_signals.tsx:394`](../../src/app/accounts/%5Bid%5D/_signals.tsx#L394)

- Đọc offset lưu sẵn (`AD-18`), không tính lại; hai tầng lọc xoá mềm viết tay.
  [`read.ts:130`](../../src/core/signal/read.ts#L130)

**Bấm-để-mở, không JavaScript**

- `SignalsBlock` là server component; đây là cửa xuống duy nhất của khối.
  [`_signals.tsx:221`](../../src/app/accounts/%5Bid%5D/_signals.tsx#L221)

- `<summary>` mang ĐÚNG câu nhận định; dải nhãn đứng ngoài để không phá `exact`.
  [`_signals.tsx:278`](../../src/app/accounts/%5Bid%5D/_signals.tsx#L278)

**Đường xuống qua sổ đăng ký**

- Mục đọc mới: `exposeToMcp:false`, thân một dòng, không cầm `db`.
  [`signal-ui.ts:68`](../../src/capability/caps/signal-ui.ts#L68)

- Hai dòng nối vào điểm nạp duy nhất — thiếu là mục im lặng không tồn tại.
  [`index.ts:36`](../../src/capability/caps/index.ts#L36)

**Ngoại vi**

- Trần 100 hàng: mỗi hàng kéo trọn đoạn văn, không phải siêu dữ liệu.
  [`read.ts:32`](../../src/core/signal/read.ts#L32)

- Chặn `javascript:`/`data:` trên URL do vòng quét thu về, kèm tên miền.
  [`_signals.tsx:101`](../../src/app/accounts/%5Bid%5D/_signals.tsx#L101)

- Hai trạng thái rỗng khác hẳn nhau, tách bằng `articleCount`.
  [`_signals.tsx:240`](../../src/app/accounts/%5Bid%5D/_signals.tsx#L240)
