# Why Now — Design System

**Why Now** là CRM cho đội Sales B2B ngành ITO (thuê ngoài làm phần mềm) của một công ty Việt Nam,
có một lớp AI đọc nguồn công khai về khách hàng tiềm năng và **tự ghi những gì nó đủ chắc**, chỉ đẩy
lại cho người phần thật sự cần phán đoán.

Luận đề của sản phẩm, và mọi quyết định thị giác trong hệ này phục vụ nó:

> Thứ khan hiếm duy nhất là **chú ý của con người**. Một giao diện bày ra nhiều thứ để người phải
> quyết thì đã phản bội sản phẩm, dù nó đẹp.

Hệ quả trực tiếp, và là **ranh giới thị giác quan trọng nhất trong cả sản phẩm**: thứ máy đã quyết
xong phải trông khác hẳn thứ đang chờ người quyết. Cơ chế thực hiện là **đảo nền** — dòng do hệ
thống đặt chạy trên dải nền tối tràn ngang có ray vàng đặc 4px và ký hiệu ⚙ dẫn đầu; dòng do người
gõ nằm trên giấy trắng, kẻ tóc mảnh, ký hiệu ✎. Lý do chọn cơ chế này thay vì hai làn cột hay thẻ
nổi: **đọc được từ hai mét**.

## Sản phẩm và người dùng

Một sản phẩm, một bề mặt: **web màn hình rộng (1440×928)**. Không có bản mobile — quyết định của
bước UX, không phải giới hạn kỹ thuật: người dùng làm việc này ngồi bàn, và đề bài đòi kéo thả để
đổi Stage. Không có trang tiếp thị, không có onboarding.

| Vai | Là ai | Mỗi ngày cần gì |
|---|---|---|
| **Sales / BD** (chính) | Theo đuổi khách doanh nghiệp; hiện mất 1–2 giờ mỗi sáng rà tin bằng tay | Mở lên là biết **hôm nay chạm ai, vì sao là hôm nay** |
| **Quản trị** (phụ) | Giữ phanh, nhìn sức khoẻ phần AI | Biết **máy đang đúng bao nhiêu phần**, có ai đang duyệt mù không |

Mười một bề mặt trong sản phẩm; **bốn** được thiết kế dày (S1 Today · S2 Suggestion queue · S3
Account detail · S8 Admin dashboard), cộng S10 Snapshot viewer vì nó gắn thẳng vào một điểm nghiệm
thu. Bảy màn còn lại **cố ý** giữ dạng biểu mẫu.

## Nguồn được giao

Toàn bộ hệ này dựng từ một codebase tài liệu được mount trong buổi làm việc 14/08/2026. Người đọc
sau có thể không truy cập được, nên đây là danh sách để đối chiếu:

| Tệp trong nguồn | Chứa gì | Dùng vào đâu trong hệ này |
|---|---|---|
| `ux-crm-hackathon-2026-08-14/.working/direction-ban-tin.html` | **Hướng thị giác đã chốt** ("Bản tin", hướng C) — một mock S1 Today đầy đủ, kèm bảng màu trong comment CSS | Nguồn của **mọi** token màu, bậc chữ, khoảng cách, và của UI kit S1 |
| `ux-crm-hackathon-2026-08-14/design-handoff.md` | Prompt handoff: sản phẩm, người dùng, bảng màu, ràng buộc cứng, tám điều phải nhìn ra được, bảng chuyển tiếp Stage, sáu luật hành vi, bảy ngưỡng trải nghiệm, giọng chữ | Hợp đồng hành vi của mọi component; mục Content Fundamentals |
| `ux-crm-hackathon-2026-08-14/EXPERIENCE.md` | IA 11 bề mặt · mẫu thành phần theo hành vi · mẫu trạng thái bốn cột · 19 nhánh ngoại lệ · NFR UX-1…UX-7 · sàn khả năng tiếp cận | Props và các trạng thái bắt buộc của component; bốn trạng thái của mỗi bề mặt |
| `ux-crm-hackathon-2026-08-14/backlog-giao-dien.md` | Bảy màn cố ý để dạng biểu mẫu, kèm cái giá và dấu hiệu phải nâng cấp | Lý do UI kit chỉ dựng năm bề mặt |
| `ux-crm-hackathon-2026-08-14/.memlog.md` | Sổ quyết định: vì sao chọn hướng C, vì sao loại hướng A và B, bốn câu trả lời của Sales Manager ngày 14/8 | Ghi chú "vì sao" trong hệ này |
| `ux-crm-hackathon-2026-08-14/DESIGN.md` | **Rỗng** — chỉ có frontmatter, status draft | Không dùng được; hệ này đứng thay chỗ nó |
| `.working/direction-so-cai.html`, `direction-phieu-noi.html` | Hai hướng đã loại (A Sổ cái, B Phiếu nổi) | Không lấy gì; ghi lại để không đề xuất lại |

**Không có tài liệu Figma, không có repo GitHub, không có slide deck.**

### Thứ nguồn không có

- **Không có logo, không có brand mark.** Chỗ nào cần dấu hiệu thương hiệu thì hệ này đặt chữ
  "Why Now" bằng serif, cỡ 26px, weight 700, letter-spacing −.02em, chữ "Now" liền chữ "Why" bằng
  một khoảng trắng không ngắt. Không có ai vẽ mark, và hệ này **không vẽ hộ**.
- **Không có tệp webfont.** Hướng thị giác dùng ngăn xếp chữ hệ thống, và hệ này giữ đúng như vậy
  (xem Visual Foundations → Type).
- **Không có ảnh, illustration, icon SVG hay icon font nào.** Xem mục Iconography.

## Content Fundamentals — copy viết thế nào

**Song ngữ có luật, không phải trộn tuỳ ý.** Thực thể viết **tiếng Anh** — đúng cụm người Sales nói
hằng ngày: `Account` · `Contact` · `Primary contact` · `Opportunity` · `Stage` · `Activity` ·
`Timeline` · `Next step` · `Snapshot` · `Signal` · `Suggestion` · `Queue` · `Watching`. Câu chữ,
nhãn hướng dẫn, thông báo, giải thích viết **tiếng Việt**. Ba Mức chắc chắn giữ tiếng Việt:
**Chắc · Có thể · Đoán**. Bảy Stage giữ tiếng Việt và **không được đổi tên**: Tiếp cận · Đủ điều
kiện · Soạn đề xuất · Thương lượng · Thắng · Thua · Tạm dừng.

Câu trích từ nguồn **giữ nguyên ngôn ngữ gốc** (thường là tiếng Nhật) và khai `lang` riêng. Không
dịch, không diễn giải lại thành ý.

**Năm luật giọng chữ, mỗi luật có ví dụ đúng và ví dụ sai:**

| Luật | Đúng | Sai |
|---|---|---|
| Nói **việc**, không nói tính năng | "Sakura Logistics vừa gọi vốn — liên hệ trong ngày" | "Đã phát hiện tín hiệu funding" |
| Cảnh báo nói **việc phải làm** | "3 gợi ý cần rà lại" | "Phát hiện bất thường" |
| Không hứa thay máy | "Đoán — chưa có bằng chứng trực tiếp" | "Công ty này đang cần tuyển gấp" |
| Con số đi kèm **mốc so** | "12/15 account đã quét" · "141/147 lượt quyết" | "12 account" · "96%" một mình |
| Lỗi nói **làm gì tiếp**, không nói mã lỗi | "Không đọc được nguồn của Aozora Tech. Vòng sau thử lại." | "Fetch failed (503)" |

**Ngôi và cách nói.** Gọi người dùng là **bạn** ("Next step do bạn gõ"), gọi lớp AI là **hệ thống**
hoặc **máy** ("do hệ thống đặt", "do hệ thống thêm") — không bao giờ "AI" trong microcopy, không bao
giờ nhân cách hoá nó thành một trợ lý có tên. Không dùng "chúng tôi".

**Chữ hoa.** Câu và nhãn viết **sentence case**. Chỉ nhãn cấu trúc viết `UPPERCASE` cộng
letter-spacing: măng-sét mục, tiêu đề hộp, cột thời hạn, byline nguồn. Không bao giờ Title Case.

**Không dùng emoji ở bất kỳ đâu.** Bản tin không dùng emoji. Ký hiệu là unicode hình học (⚙ ✎ ● ◐ ○
▲ ◆ ↩), và chúng mang nghĩa, không trang trí.

**Rỗng không bao giờ là khung trắng.** "Hôm nay chưa có việc đến hạn." kèm lối đi tiếp. Chưa đủ dữ
liệu để tính một tỉ lệ thì nói "cần ít nhất N lượt quyết để tính" — **không bao giờ hiện 0%**, vì 0%
đọc thành *máy sai hết*.

**Câu dài được phép.** Người dùng đọc mỗi ngày và thuộc lòng màn hình; một câu 18 từ nói đủ việc tốt
hơn một câu 6 từ phải suy. Nhưng câu chỉ có tính từ thì không được: mọi ngưỡng, mọi cảnh báo phải
kiểm được.

## Visual Foundations

### Màu

Bảng màu là **giấy và mực cộng một dải đảo nền**. Không có màu thương hiệu tươi, không có màu nhấn
thứ hai.

- **Giấy** `#FFFFFF` · giấy nhạt `#FAFAF8` (măng-sét mục, ô Stage) · nền ứng dụng `#F4F3F1` · nền
  ngoài khung `#DDDBD6`.
- **Mực** bốn bậc: `#111417` chính · `#5C636A` phụ · `#7B828A` nhạt · `#8B9097` cho dòng Stage đã
  đóng. Kẻ tóc `#E2E0DC`.
- **Dải máy** `#16232E`, khối trích trong dải `#1D2C38`, chữ `#F2F5F7` / phụ `#A9BBC8`, **ray trái
  `#C9942A` đặc 4px**. Ray vàng là thứ gần nhất với một màu thương hiệu mà hệ này có, và nó chỉ
  xuất hiện ở nơi máy đã quyết.
- **Nhấn liên kết** `#1B4E7A`, duy nhất.
- **Trạng thái**: quá hạn `#B03024` · cảnh báo `#C4351F` trên `#FCF0EE` · Suggestion `#8A4A05` trên
  `#FBEEDA`. Dòng mang cờ đổi nền giấy sang `#FDF8F7` — đủ để thấy, không đủ để hét.
- **Mức chắc chắn có hai biến thể**, trên giấy và trên dải tối, vì cùng một màu không đạt tương
  phản trên cả hai nền. Đây là chỗ rủi ro tương phản cao nhất của hướng này: chữ phụ trên nền tối
  phải đạt ≥ 4.5:1.

Không gradient. Không màu tím-xanh. Không nền màu lớn ngoài dải máy.

### Type

Hai họ chữ, **vai tách bạch** (ràng buộc cứng của nguồn):

- **Serif** — `Georgia, "Times New Roman", serif`: măng-sét thương hiệu, **câu Next step**, câu
  trạng thái rỗng. Serif ở đây làm câu việc đọc như một đầu đề tin.
- **Sans** — `"Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif`: mọi dữ
  liệu, nhãn, số, nút.

Câu do **máy đặt to hơn một bậc**: 19px / weight 600 / letter-spacing −.005em, so với câu người gõ
17px / 400. Đây là tín hiệu thứ tư của ranh giới máy/người, sau nền, ray và ký hiệu.

Bậc chữ dữ liệu đặc: 13px (tên Account, tiền) · 12.5px (trích, dòng thống kê, nút) · 12px (dòng
Opportunity) · 11.5px (byline, cờ) · 11px (nhãn viết hoa) · 10.5px (nhãn Mức chắc chắn, sàn dưới).
Số luôn `font-variant-numeric: tabular-nums`.

**Không có tệp webfont trong nguồn.** Hai ngăn xếp trên là nguyên văn từ hướng thị giác đã chốt, nên
đây **không phải** một sự thay thế do thiếu tệp — nhưng nó cũng có nghĩa là chữ sẽ khác nhau giữa
macOS và Windows. Nếu muốn cố định, xem mục Caveats.

### Khoảng cách và lưới

Dòng việc là lưới ba cột **104px / 1fr / 168px**, gap 16px, đệm `11px 24px 12px`. Dòng dải máy đệm
trái 20px vì ray 4px chiếm phần còn lại — tổng vẫn đúng 24px, nên câu việc của máy và của người
thẳng hàng nhau tuyệt đối. Rail phải của S1 rộng **400px** cố định.

Thang khoảng cách **lẻ có chủ đích**: 1 · 2 · 3 · 5 · 6 · 7 · 8 · 9 · 10 · 11 · 12 · 13 · 14 · 15 ·
16 · 18 · 20 · 24 · 28. Không snap về lưới 4/8px — 7px và 9px là giá trị thật của hướng thị giác, và
làm tròn chúng làm mất mật độ. Mật độ là một ngưỡng kiểm được: **≥ 9 dòng việc thấy được không cuộn
ở 1440×900**.

### Nền, bo góc, bóng, độ sâu

- **Không bo góc ở bất kỳ đâu.** `border-radius: 0`. Ngoại lệ duy nhất trong nguồn là chrome trình
  duyệt của ảnh dựng (3px), không thuộc sản phẩm.
- **Không bóng trên thẻ.** Bóng duy nhất là bóng khung ứng dụng khi trình bày sản phẩm trên nền ngoài
  (`0 10px 34px rgba(0,0,0,.16)`).
- **Không blur, không transparency**, trừ lớp phủ của Snapshot viewer (`rgba(17,20,23,.55)`).
- **Độ sâu duy nhất của sản phẩm là đảo nền.** Dải máy tràn hết chiều ngang — nó là một dải, không
  phải một thẻ nổi. Đừng thêm bóng, đừng bo, đừng thu hẹp nó vào trong lề.
- **Không ảnh, không texture, không pattern.** Nền là giấy phẳng. Nguồn không có ảnh nào và sản phẩm
  không có chỗ cho ảnh.
- **Viền bốn bậc**: 1px kẻ tóc `#E2E0DC` · 1px dotted `#E8E6E1` (dòng thống kê) · 2px `#111417` (kẻ
  dưới măng-sét) · 4px `#C9942A` (ray dải máy) và 3px `#4C6B84` (ray khối trích).
- **Thẻ trông thế nào**: nền giấy, viền 1px kẻ tóc, không bo, không bóng, đệm `12px 14px`. Hộp có
  nghĩa trạng thái thì đổi cả nền và viền sang cùng họ màu (hộp Queue: nền `#FBEEDA` viền `#E0BA84`).

### Chuyển động

Gần như không có. Chỉ đổi màu cho hover và press, 80ms. Trần phản hồi cảm nhận được là **200ms**;
việc lâu hơn **1 giây** phải hiện trạng thái đang chạy. Không bounce, không spring, không hoạt ảnh
vào-trang.

Một ngưỡng cứng chi phối mọi hoạt ảnh: **vòng quét chạy nền không được cướp tiêu điểm** — 0 lần
trang tự nhảy hoặc tự đóng thứ người đang mở, kể cả khi có dữ liệu mới. Dữ liệu mới hiện thành dải
"có N việc mới" và chỉ vào trang khi người dùng bấm. Khung xương lúc tải giữ **đúng số dòng của lần
trước** để trang không nhảy. `prefers-reduced-motion` đưa mọi thời lượng về 0.

### Hover, press, focus

- **Hover**: đổi màu, không đổi cỡ, không nâng bóng. Nút primary hover thì nền sang mực đậm hơn;
  liên kết hover thì chữ sang mực chính.
- **Press**: đổi màu, **không co lại**. Không có transform trong hệ này.
- **Focus**: `2px solid #1B4E7A`, offset 1px; trên dải máy dùng ray vàng `2px solid #C9942A`.
  `outline: none` **không được xuất hiện ở bất kỳ đâu** — đây là một dòng trong sàn khả năng tiếp cận,
  không phải một sở thích.

### Sàn khả năng tiếp cận

Không dùng **màu đơn độc** để truyền thông tin: mọi Mức chắc chắn, mọi cờ, mọi ranh giới máy/người
đều có ký hiệu hoặc chữ đi kèm. Bàn phím tới được mọi hành động bắt buộc. Trang khai `lang="vi"`, và
đoạn trích giữ ngôn ngữ gốc khai `lang` riêng.

## Iconography

**Nguồn không có một icon nào** — không icon font, không sprite, không SVG, không PNG. Đây không
phải chỗ để bù bằng một bộ icon từ CDN: hướng thị giác giải quyết ký hiệu bằng **chữ unicode hình
học**, và nó có lý do — ký hiệu phải hiện được cả trên nền tối lẫn nền sáng, ở cỡ 11–13px, cạnh chữ,
mà không cần một tệp nào.

Mười ký hiệu, mỗi ký hiệu một nghĩa cố định:

| Ký hiệu | Nghĩa | Dùng ở |
|---|---|---|
| `⚙` | do hệ thống đặt / thêm | byline dòng dải máy, nhãn Timeline, dải AI tắt |
| `✎` | do người gõ | byline dòng giấy |
| `●` | Mức chắc chắn **Chắc** | nhãn ConfidenceBadge |
| `◐` | Mức chắc chắn **Có thể** | nhãn ConfidenceBadge |
| `○` | Mức chắc chắn **Đoán** | nhãn ConfidenceBadge |
| `▲` | cờ cảnh báo | WarningFlag, PartialError, khối duyệt mù |
| `◆` | Account đang có Suggestion chờ | SuggestionPin |
| `↩` | Hoàn tác | UndoButton |
| `▮` | đoạn được đánh dấu | chỉ dẫn trong Snapshot viewer |
| `→` | hiện tại → đề nghị | thẻ Suggestion |

**Emoji không được dùng ở bất kỳ đâu.** Không thêm ký hiệu mới mà không gán nghĩa — mười ký hiệu này
là một hệ đóng, và người dùng học nó trong ngày đầu.

`assets/` trong hệ này **rỗng có chủ đích**: nguồn không có logo, không có illustration, không có
ảnh. Đừng vẽ hộ, đừng sinh ảnh; chỗ nào cần mark thì đặt chữ "Why Now" bằng serif.

## Index — các tệp trong hệ này

**Gốc**
- `styles.css` — điểm vào duy nhất cho consumer; chỉ chứa các dòng `@import`
- `readme.md` — tệp này
- `SKILL.md` — bao ngoài để dùng hệ này như một Agent Skill
- `thumbnail.html` — tile của hệ trên trang chủ

**`tokens/`** — `colors.css` · `typography.css` · `spacing.css` · `borders.css` · `motion.css` ·
`semantic.css` (bí danh theo vai trò: `--surface-machine`, `--text-on-machine`, `--machine-rail`, …)

**`guidelines/`** — 19 thẻ specimen của tab Design System, nhóm **Colors** (7) · **Type** (5) ·
**Spacing** (3) · **Brand** (5)

**`components/`** — 25 component, gom theo vai:

| Nhóm | Component |
|---|---|
| `core/` | **Button** · **TextField** |
| `masthead/` | **Masthead** · **SectionKicker** · **Legend** |
| `worklist/` | **WorkItem** · **StagePill** · **QuoteBlock** · **UndoButton** |
| `signals/` | **ConfidenceBadge** · **SuggestionPin** · **WarningFlag** · **SignalChip** · **SourceByline** |
| `suggestions/` | **SuggestionCard** · **DismissReasonPicker** |
| `data/` | **StatBox** · **StatRow** · **QueueCallout** · **Metric** · **TimelineEntry** |
| `feedback/` | **AIOffBanner** · **NewItemsBanner** · **EmptyState** · **SkeletonRows** · **PartialError** |
| `reading/` | **SnapshotHighlight** |

Mỗi component có `.jsx` · `.d.ts` (hợp đồng props, kèm luật hành vi trong JSDoc) · `.prompt.md` (khi
nào dùng, ví dụ, biến thể). Mỗi thư mục có một thẻ `@dsCard`.

**`ui_kits/why-now/`** — nguyên mẫu bấm được năm bề mặt; xem `ui_kits/why-now/README.md`

**`templates/today-board/`** — template bàn làm việc buổi sáng, dùng lại được cho một bề mặt mới

### Component inventory bắt nguồn từ đâu

Nguồn không có component library dạng mã, nhưng nó có **một bảng đặc tả thành phần theo hành vi**
(`design-handoff.md` mục *Mẫu thành phần*, cộng `EXPERIENCE.md` mục cùng tên) và một mock CSS đầy
đủ. 25 component ở trên là bảng đó cộng các lớp CSS thật của mock, không nhiều hơn.

**Intentional additions** — bốn thứ nguồn không gọi tên nhưng bề mặt cần:

- **Button**, **TextField** — mock không có nút nào ngoài lối vào Queue, nhưng ba nút quyết ở S2 và
  các bề mặt biểu mẫu cần một nút cơ sở. Kiểu dáng suy ra từ hai thứ có thật: nút Queue
  (`#8A4A05`, 12.5px/700, đệm 8px, radius 0) và ô `.unit` (viền `#CFCDC8`).
- **SkeletonRows** — "khung xương giữ đúng số dòng của lần trước" là một dòng trong mẫu trạng thái;
  hình dáng cụ thể là của hệ này.
- **DismissReasonPicker** — nguồn nói "chọn một lý do trong năm" nhưng không liệt kê năm lý do. Năm
  lý do trong `DISMISS_REASONS` là **suy ra**, trừ "Có gợi ý mới hơn" (nguồn có). Cần người trong
  nghề chốt lại.

**Không** dựng: Toast, Avatar, Tabs, Modal chung, Tooltip, Pagination, Pipeline board kéo thả. Nguồn
không định nghĩa chúng, và S4 Pipeline board cố ý ở lại backlog.

## Caveats

- **Không có logo.** Chỗ nào cần mark, hệ này đặt chữ. Cần logo thật thì gửi tệp.
- **Một sự thay thế chữ đã áp dụng, cần bạn xác nhận.** Georgia và Times New Roman **không có glyph
  Việt dựng sẵn**: dấu bị tách rời khỏi chữ ("gọi vốn" hiện thành "gọi vô ́n"). Vì serif mang đúng
  phần copy quan trọng nhất của sản phẩm — câu Next step 19px, măng-sét, câu trạng thái rỗng — trong
  một giao diện tiếng Việt, hệ này nạp **Noto Serif** từ Google Fonts làm họ serif đầu tiên và giữ
  Georgia làm lớp dự phòng (`tokens/fonts.css`). Đây là chỗ **duy nhất** hệ này lệch khỏi
  `direction-ban-tin.html`, và nó lệch vì bản gốc hỏng ở tiếng Việt, không vì thẩm mỹ.
- **Sans vẫn là ngăn xếp hệ thống** — Segoe UI / system-ui có glyph Việt đủ, nên chữ sẽ khác giữa
  macOS và Windows nhưng không hỏng. Cặp gần nhất nếu muốn cố định cả hai: **Source Serif 4** +
  **Source Sans 3**.
- **Nội dung tiếng Nhật** dựa vào chữ CJK mặc định của hệ điều hành. Nếu bản dựng thật cần Noto Sans
  JP / Noto Serif JP, phải thêm `@font-face` và tệp.
- **Năm lý do Bỏ** chỉ có một lý do đến từ nguồn; bốn còn lại là suy ra.
- **S4 Pipeline board và S7 Watching list** không có trong UI kit vì nguồn ghi rõ chúng ở lại
  backlog, và vì **không hành trình nào dẫn tới chúng** — IA chưa đóng kín ở đó. Đừng dựng chúng từ
  suy đoán.
