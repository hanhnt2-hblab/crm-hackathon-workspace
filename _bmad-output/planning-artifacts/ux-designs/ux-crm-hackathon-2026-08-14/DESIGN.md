---
name: Why Now
description: CRM cho Sales B2B ngành ITO — giấy và mực, cộng một dải đảo nền đánh dấu chỗ máy đã quyết
status: ready
created: 2026-08-14
updated: 2026-08-14
colors:
  paper: '#FFFFFF'
  paper-tint: '#FAFAF8'
  app: '#F4F3F1'
  desk: '#DDDBD6'
  ink: '#111417'
  ink-strong: '#1B1F23'
  ink-2: '#5C636A'
  ink-3: '#7B828A'
  ink-quiet: '#8B9097'
  rule: '#E2E0DC'
  rule-dotted: '#E8E6E1'
  rule-frame: '#C6C3BD'
  band: '#16232E'
  band-2: '#1D2C38'
  band-edge: '#0C1620'
  band-ink: '#F2F5F7'
  band-ink-2: '#A9BBC8'
  band-quote-rail: '#4C6B84'
  band-od: '#F0A79C'
  rail: '#C9942A'
  link: '#1B4E7A'
  overdue: '#B03024'
  warn: '#C4351F'
  warn-bg: '#FCF0EE'
  warn-row: '#FDF8F7'
  suggestion: '#8A4A05'
  suggestion-bg: '#FBEEDA'
  suggestion-border: '#E0BA84'
  chac: '#176B45'
  chac-bg: '#E5F1EA'
  chac-band: '#7FD3A5'
  chac-band-bg: '#1E3A33'
  cothe: '#8C5A0C'
  cothe-bg: '#FAEFDA'
  cothe-band: '#E9BC63'
  cothe-band-bg: '#3A2E17'
  doan: '#5A626B'
  doan-bg: '#ECEEF0'
  doan-band: '#A9B6C0'
  doan-band-bg: '#26333D'
  legend-bg: '#EDEBE7'
typography:
  sans:
    fontFamily: '"Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif'
  serif:
    fontFamily: '"Noto Serif", Georgia, "Times New Roman", serif'
  next-step-machine:
    fontFamily: '{typography.serif.fontFamily}'
    fontSize: '19px'
    fontWeight: 600
    letterSpacing: '-.005em'
  next-step-human:
    fontFamily: '{typography.serif.fontFamily}'
    fontSize: '17px'
    fontWeight: 400
  masthead:
    fontFamily: '{typography.serif.fontFamily}'
    fontSize: '26px'
    fontWeight: 700
    letterSpacing: '-.02em'
  data:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: '13px'
  quote:
    fontSize: '12.5px'
  label-caps:
    fontSize: '11px'
    fontWeight: 800
    letterSpacing: '.07em'
  kicker:
    fontSize: '11px'
    fontWeight: 800
    letterSpacing: '.16em'
  confidence:
    fontSize: '10.5px'
    fontWeight: 800
rounded:
  DEFAULT: '0'
  chrome: '3px'
  dot: '50%'
spacing:
  row: '11px 24px 12px'
  row-machine-left: '20px'
  masthead: '14px 24px 12px'
  box: '12px 14px'
  quote: '8px 12px'
  gap-row: '16px'
  col-when: '104px'
  col-side: '168px'
  col-rail: '400px'
  app-width: '1440px'
  app-height: '928px'
components:
  work-item-machine:
    background: '{colors.band}'
    color: '{colors.band-ink}'
    borderLeft: '4px solid {colors.rail}'
    paddingLeft: '{spacing.row-machine-left}'
    glyph: '⚙'
  work-item-human:
    background: '{colors.paper}'
    color: '{colors.ink}'
    borderBottom: '1px solid {colors.rule}'
    padding: '{spacing.row}'
    glyph: '✎'
  confidence-badge:
    fontSize: '{typography.confidence.fontSize}'
    glyphs: '● Chắc · ◐ Có thể · ○ Đoán'
  suggestion-pin:
    color: '{colors.suggestion}'
    background: '{colors.suggestion-bg}'
    glyph: '◆'
  warning-flag:
    color: '{colors.warn}'
    background: '{colors.warn-bg}'
    rowBackground: '{colors.warn-row}'
    glyph: '▲'
  focus-ring:
    outline: '2px solid {colors.link}'
    outlineOffset: '1px'
    onMachine: '2px solid {colors.rail}'
---

# DESIGN.md — Why Now

Sườn này sở hữu **sản phẩm trông thế nào**. Sườn chị em [`EXPERIENCE.md`](EXPERIENCE.md) sở hữu
**nó chạy thế nào**. Hai sườn **thắng mọi mock khi có mâu thuẫn**.

**Nguồn:** rút từ lớp token của design system do Claude Design sinh, nhập về 14/08/2026 — xem
[`prototype/`](prototype/). Lớp token đó lại rút từ hướng thị giác C đã chốt ở
[`.working/direction-ban-tin.html`](.working/direction-ban-tin.html).

## Brand & Style

**Một tờ bản tin buổi sáng, không phải một bảng điều khiển.** Giấy trắng, mực đen, kẻ tóc mảnh,
măng-sét chia mục. Không màu thương hiệu tươi, không gradient, không bo góc, không bóng trên thẻ.

Sản phẩm này có **đúng một ý tưởng thị giác**, và mọi thứ khác phục vụ nó:

> Thứ máy đã quyết xong phải trông khác hẳn thứ đang chờ người quyết.

Cơ chế là **đảo nền**. Dòng do hệ thống đặt chạy trên dải nền tối tràn hết chiều ngang, ray vàng
đặc 4px bên trái, ký hiệu ⚙ dẫn đầu. Dòng do người gõ nằm trên giấy trắng, kẻ tóc mảnh, ký hiệu ✎.
Chọn cơ chế này thay vì hai làn cột hay thẻ nổi vì nó **đọc được từ hai mét** — người đứng sau lưng
vẫn thấy ranh giới.

Dải máy là **một dải, không phải một thẻ**. Đừng thêm bóng, đừng bo góc, đừng thu nó vào trong lề.

## Colors

Bảng màu là **giấy và mực cộng một dải đảo nền**.

| Vai trò | Token | Dùng ở đâu · **không** dùng ở đâu |
|---|---|---|
| Giấy | `{colors.paper}` `{colors.paper-tint}` | Nền dòng việc và thẻ · giấy nhạt cho măng-sét mục và ô Stage |
| Nền ứng dụng | `{colors.app}` | Khoảng giữa các khối. **Không** dùng làm nền thẻ |
| Mực | `{colors.ink}` → `{colors.ink-3}` | Bốn bậc. `{colors.ink-quiet}` chỉ cho dòng Stage **đã đóng** |
| Dải máy | `{colors.band}` | **Chỉ** ở nơi máy đã quyết. Dùng nó cho một khối trang trí là phá luôn ngôn ngữ của sản phẩm |
| Ray | `{colors.rail}` | Thứ gần nhất với một màu thương hiệu mà hệ này có. Chỉ xuất hiện cạnh dải máy và ở viền tiêu điểm **trên** dải |
| Nhấn | `{colors.link}` | Liên kết. Màu nhấn **duy nhất** |
| Quá hạn | `{colors.overdue}` · `{colors.band-od}` | Hai biến thể: trên giấy và trên dải |
| Cảnh báo | `{colors.warn}` trên `{colors.warn-bg}` | Dòng mang cờ đổi nền sang `{colors.warn-row}` — đủ để thấy, không đủ để hét |
| Suggestion | `{colors.suggestion}` trên `{colors.suggestion-bg}` | Pin ◆, hộp Queue, nút Queue |

**Mức chắc chắn có hai biến thể màu**, trên giấy và trên dải tối, vì cùng một màu không đạt tương
phản trên cả hai nền. **Đây là chỗ rủi ro tương phản cao nhất của hệ**: chữ phụ trên nền tối phải
đạt ≥ 4.5:1.

Không gradient. Không nền màu lớn ngoài dải máy. Không màu tím-xanh.

## Typography

Hai họ chữ, **vai tách bạch** — đây là ràng buộc cứng, không phải sở thích.

- **Serif** `{typography.serif.fontFamily}` — măng-sét, **câu Next step**, câu trạng thái rỗng.
  Serif làm câu việc đọc như một đầu đề tin.
- **Sans** `{typography.sans.fontFamily}` — mọi dữ liệu, nhãn, số, nút.

**Câu do máy đặt to hơn một bậc**: 19px / 600 / −.005em, so với câu người gõ 17px / 400. Đây là
**tín hiệu thứ tư** của ranh giới máy/người, sau nền, ray và ký hiệu. Bốn tín hiệu chồng lên nhau
là có chủ đích: bỏ một cái thì ba cái còn lại vẫn giữ được ranh giới.

Bậc chữ dữ liệu đặc: 13px tên Account và tiền · 12.5px trích, dòng thống kê, nút · 12px dòng
Opportunity · 11.5px byline và cờ · 11px nhãn viết hoa · 10.5px nhãn Mức chắc chắn. Số luôn
`tabular-nums`.

> **Một sự thay thế đã áp dụng, khác hướng C.** Georgia và Times New Roman **không có glyph Việt
> dựng sẵn** — dấu bị tách rời khỏi chữ. Vì serif mang đúng phần chữ quan trọng nhất trong một giao
> diện tiếng Việt, hệ nạp **Noto Serif** làm họ serif đầu tiên và giữ Georgia làm lớp dự phòng.
> Đây là chỗ **duy nhất** lệch khỏi `direction-ban-tin.html`, và nó lệch vì bản gốc **hỏng** ở
> tiếng Việt, không vì thẩm mỹ.
>
> Hệ quả: `tokens/fonts.css` có một `@import` **gọi mạng**. Muốn chạy offline thì thay bằng
> `@font-face` trỏ tệp thật.

## Layout & Spacing

Dòng việc là lưới ba cột **`{spacing.col-when}` / 1fr / `{spacing.col-side}`**, gap
`{spacing.gap-row}`, đệm `{spacing.row}`.

Dòng dải máy đệm trái `{spacing.row-machine-left}` vì ray 4px chiếm phần còn lại — tổng vẫn đúng
24px, nên **câu việc của máy và của người thẳng hàng tuyệt đối**. Đây là chi tiết dễ làm hỏng nhất
khi dựng lại: lệch 4px là hai dòng không còn thẳng, và ranh giới đọc thành cẩu thả thay vì có chủ ý.

Rail phải của màn Today rộng `{spacing.col-rail}` cố định. Khổ thiết kế
`{spacing.app-width}` × `{spacing.app-height}`.

**Thang khoảng cách lẻ có chủ đích** — 1 · 2 · 3 · 5 · 6 · 7 · 8 · 9 · 10 · 11 · 12 · 13 · 14 · 15 ·
16 · 18 · 20 · 24 · 28. **Không snap về lưới 4/8px.** 7px và 9px là giá trị thật của hướng thị
giác, và làm tròn chúng làm mất mật độ — mà mật độ là một ngưỡng kiểm được: **≥ 9 dòng việc thấy
được không cuộn ở 1440×900** (`UX-5`).

## Elevation & Depth

**Độ sâu duy nhất của sản phẩm là đảo nền.** Không có tầng z thứ hai.

- Không bóng trên thẻ. Bóng duy nhất là bóng khung ứng dụng khi trình bày sản phẩm trên nền ngoài
- Không blur, không transparency — trừ lớp phủ của Snapshot viewer
- Không ảnh, không texture, không pattern. Nền là giấy phẳng

## Shapes

**`{rounded.DEFAULT}` ở mọi nơi.** Ngoại lệ duy nhất là chrome trình duyệt trong ảnh dựng
(`{rounded.chrome}`), không thuộc sản phẩm.

Viền bốn bậc: 1px kẻ tóc · 1px dotted cho dòng thống kê · 2px mực dưới măng-sét · 4px ray dải máy
và 3px ray khối trích.

**Thẻ trông thế nào:** nền giấy, viền 1px kẻ tóc, không bo, không bóng, đệm `{spacing.box}`. Hộp có
nghĩa trạng thái thì đổi **cả nền và viền** sang cùng họ màu.

## Components

Đặc tả hành vi thuộc `EXPERIENCE.md`; dưới đây chỉ nói **trông thế nào**. Bản dựng đầy đủ 25
component nằm ở [`prototype/_ds/…/_ds_bundle.js`](prototype/).

| Component | Thị giác |
|---|---|
| `work-item-machine` | Dải nền `{colors.band}` tràn ngang · ray trái `{colors.rail}` 4px · ⚙ dẫn đầu · câu 19px serif |
| `work-item-human` | Giấy · kẻ tóc dưới · ✎ dẫn đầu · câu 17px serif |
| `confidence-badge` | ● Chắc · ◐ Có thể · ○ Đoán. **Ký hiệu và màu, không bao giờ màu đơn độc.** Hai bộ màu: trên giấy và trên dải |
| `quote-block` | Trên dải: nền `{colors.band-2}`, ray trái 3px `{colors.band-quote-rail}`, chữ 12.5px, `lang` riêng theo ngôn ngữ nguồn |
| `suggestion-pin` | ◆ `{colors.suggestion}` trên `{colors.suggestion-bg}`, 10px, kèm số đang chờ |
| `warning-flag` | ▲ `{colors.warn}` trên `{colors.warn-bg}`; dòng chứa nó đổi nền sang `{colors.warn-row}` |
| `undo-button` | ↩ cộng thời gian còn lại. Sắp hết hạn thì đổi mực sang `#3A0E08` |
| `stage-pill` | Nền giấy nhạt, viền kẻ, không bo. Stage **đã đóng** dùng mực `{colors.ink-quiet}` |
| `ai-off-banner` | Dải cảnh báo trên khung ứng dụng, ⚙ dẫn đầu — hiện với **Sales**, không chỉ Quản trị |
| `focus-ring` | `{components.focus-ring.outline}`, offset 1px. Trên dải máy đổi sang ray vàng |

**Mười ký hiệu, mỗi cái một nghĩa cố định** — đây là một hệ đóng: ⚙ máy · ✎ người · ● Chắc ·
◐ Có thể · ○ Đoán · ▲ cờ · ◆ có Suggestion chờ · ↩ Hoàn tác · ▮ đoạn được đánh dấu · → hiện tại
sang đề nghị.

## Do's and Don'ts

**Làm**

- Dùng dải máy **chỉ** ở nơi máy đã quyết
- Giữ bốn tín hiệu của ranh giới máy/người: nền · ray · ký hiệu · cỡ chữ
- Ghép ký hiệu với màu ở **mọi** chỗ truyền thông tin bằng màu
- Giữ giá trị khoảng cách lẻ nguyên xi
- Cho Stage đã đóng mực nhạt hơn — chúng là lịch sử, không phải việc

**Không làm**

- **Không** thêm bo góc, bóng thẻ, gradient, hay tầng z thứ hai
- **Không** dùng emoji. Ký hiệu là unicode hình học và chúng **mang nghĩa**
- **Không** dùng màu đơn độc để truyền thông tin
- **Không** đặt `outline: none` ở bất kỳ đâu — đây là một dòng trong sàn khả năng tiếp cận
- **Không** thu dải máy vào trong lề. Nó tràn ngang, và đó là lý do nó đọc được từ hai mét
- **Không** thêm ký hiệu mới mà không gán nghĩa
- **Không** snap thang khoảng cách về lưới 8px
- **Không** vẽ logo. Chỗ nào cần mark thì đặt chữ "Why Now" bằng serif 26px / 700 / −.02em
