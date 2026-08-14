---
name: Why Now
description: CRM cho Sales B2B ngành ITO — dựng trên lớp token Fluent 2 của Microsoft, cộng một vai trò màu riêng cho thứ máy đã quyết
status: ready
created: 2026-08-14
updated: 2026-08-14
colors:
  paper: '#ffffff'
  paper-tint: '#fafafa'
  app: '#f5f5f5'
  app-2: '#f0f0f0'
  app-3: '#ebebeb'
  ink: '#242424'
  ink-2: '#424242'
  ink-3: '#616161'
  ink-4: '#707070'
  ink-disabled: '#bdbdbd'
  rule: '#e0e0e0'
  rule-strong: '#d1d1d1'
  rule-accessible: '#616161'
  brand: '#0f6cbd'
  brand-hover: '#115ea3'
  brand-pressed: '#0c3b5e'
  brand-selected: '#0f548c'
  machine-bg: '#ebf3fc'
  machine-bg-hover: '#cfe4fa'
  machine-border: '#0f6cbd'
  machine-border-soft: '#b4d6fa'
  chac-bg: '#f1faf1'
  chac-border: '#9fd89f'
  chac-ink: '#0e700e'
  cothe-bg: '#fff9f5'
  cothe-border: '#fdcfb4'
  cothe-ink: '#bc4b09'
  doan-bg: '#fafafa'
  doan-border: '#d1d1d1'
  doan-ink: '#616161'
  warn-bg: '#fdf3f4'
  warn-border: '#eeacb2'
  warn-ink: '#b10e1c'
  warn-strong: '#c50f1f'
  overdue: '#b10e1c'
  suggestion-bg: '#fff9f5'
  suggestion-border: '#fdcfb4'
  suggestion-ink: '#bc4b09'
  ghost-ink: '#707070'
typography:
  base:
    fontFamily: '"Segoe UI", "Segoe UI Web (West European)", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif'
  numeric:
    fontFamily: 'Bahnschrift, {typography.base.fontFamily}'
  size-100:
    fontSize: '10px'
    lineHeight: '14px'
  size-200:
    fontSize: '12px'
    lineHeight: '16px'
  size-300:
    fontSize: '14px'
    lineHeight: '20px'
  size-400:
    fontSize: '16px'
    lineHeight: '22px'
  size-500:
    fontSize: '20px'
    lineHeight: '28px'
  size-600:
    fontSize: '24px'
    lineHeight: '32px'
  next-step-machine:
    fontSize: '16px'
    lineHeight: '22px'
    fontWeight: 600
  next-step-human:
    fontSize: '16px'
    lineHeight: '22px'
    fontWeight: 400
  masthead:
    fontSize: '20px'
    lineHeight: '28px'
    fontWeight: 600
  label-caps:
    fontSize: '10px'
    lineHeight: '14px'
    fontWeight: 600
    letterSpacing: '.04em'
  weight-regular: 400
  weight-medium: 500
  weight-semibold: 600
  weight-bold: 700
rounded:
  none: '0'
  small: '2px'
  DEFAULT: '4px'
  large: '6px'
  xlarge: '8px'
  circular: '10000px'
spacing:
  xxs: '2px'
  xs: '4px'
  s-nudge: '6px'
  s: '8px'
  m-nudge: '10px'
  m: '12px'
  l: '16px'
  xl: '20px'
  xxl: '24px'
  xxxl: '32px'
  row: '10px 16px 11px'
  row-machine-left: '12px'
  col-when: '104px'
  col-side: '168px'
  col-rail: '400px'
  app-width: '1440px'
  app-height: '928px'
  stroke-thin: '1px'
  stroke-thick: '2px'
  stroke-thicker: '3px'
  stroke-thickest: '4px'
shadow:
  '2': '0 0 2px rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.14)'
  '4': '0 0 2px rgba(0,0,0,.12), 0 2px 4px rgba(0,0,0,.14)'
  '8': '0 0 2px rgba(0,0,0,.12), 0 4px 8px rgba(0,0,0,.14)'
  '16': '0 0 2px rgba(0,0,0,.12), 0 8px 16px rgba(0,0,0,.14)'
  '28': '0 0 8px rgba(0,0,0,.12), 0 14px 28px rgba(0,0,0,.14)'
  '64': '0 0 8px rgba(0,0,0,.12), 0 32px 64px rgba(0,0,0,.14)'
components:
  work-item-machine:
    background: '{colors.machine-bg}'
    borderLeft: '{spacing.stroke-thicker} solid {colors.machine-border}'
    borderRadius: '{rounded.DEFAULT}'
    paddingLeft: '{spacing.row-machine-left}'
    color: '{colors.ink}'
    glyph: '⚙'
  work-item-human:
    background: '{colors.paper}'
    borderBottom: '{spacing.stroke-thin} solid {colors.rule}'
    borderRadius: '{rounded.none}'
    padding: '{spacing.row}'
    color: '{colors.ink}'
    glyph: '✎'
  status-badge:
    borderRadius: '{rounded.DEFAULT}'
    borderWidth: '{spacing.stroke-thin}'
    padding: '1px 6px'
    fontSize: '{typography.size-100.fontSize}'
    fontWeight: '{typography.weight-semibold}'
  confidence-badge:
    chac: '● Chắc — {colors.chac-bg} / {colors.chac-border} / {colors.chac-ink}'
    cothe: '◐ Có thể — {colors.cothe-bg} / {colors.cothe-border} / {colors.cothe-ink}'
    doan: '○ Đoán — {colors.doan-bg} / {colors.doan-border} / {colors.doan-ink}'
  suggestion-ghost:
    color: '{colors.ghost-ink}'
    background: 'transparent'
    borderRadius: '{rounded.small}'
  suggestion-pin:
    background: '{colors.suggestion-bg}'
    border: '{spacing.stroke-thin} solid {colors.suggestion-border}'
    color: '{colors.suggestion-ink}'
    borderRadius: '{rounded.DEFAULT}'
    glyph: '◆'
  warning-flag:
    background: '{colors.warn-bg}'
    border: '{spacing.stroke-thin} solid {colors.warn-border}'
    color: '{colors.warn-ink}'
    borderRadius: '{rounded.DEFAULT}'
    glyph: '▲'
  card:
    background: '{colors.paper}'
    border: '{spacing.stroke-thin} solid {colors.rule}'
    borderRadius: '{rounded.large}'
    padding: '{spacing.m} {spacing.l}'
    boxShadow: 'none'
  dialog:
    background: '{colors.paper}'
    borderRadius: '{rounded.xlarge}'
    boxShadow: '{shadow.16}'
  button:
    borderRadius: '{rounded.DEFAULT}'
    height: '32px'
    padding: '0 {spacing.m}'
    fontSize: '{typography.size-300.fontSize}'
  input:
    borderRadius: '{rounded.DEFAULT}'
    height: '32px'
    border: '{spacing.stroke-thin} solid {colors.rule-strong}'
  focus-ring:
    outline: '{spacing.stroke-thick} solid {colors.brand}'
    outlineOffset: '1px'
---

# DESIGN.md — Why Now

Sườn này sở hữu **sản phẩm trông thế nào**. Sườn chị em [`EXPERIENCE.md`](EXPERIENCE.md) sở hữu
**nó chạy thế nào**. Hai sườn **thắng mọi mock khi có mâu thuẫn**.

**Nguồn:** hệ này **không tự phát minh lớp token**. Mọi giá trị bo góc, bóng, cỡ chữ, khoảng cách,
xám trung tính và màu ngữ nghĩa đều lấy nguyên từ **Microsoft Fluent 2**, đọc trực tiếp từ 552 CSS
variable đang render trên `fluent2.microsoft.design` và đối chiếu với mã nguồn gói
`@fluentui/tokens`. Xem [`../../research/technical-ngon-ngu-thiet-ke-ui-airtable-fluent-hub-2026-08-14/research.md`](../../research/technical-ngon-ngu-thiet-ke-ui-airtable-fluent-hub-2026-08-14/research.md).

**Stack đã chốt: React cộng Fluent UI v9.** Dùng thư viện thật, không dựng lại bằng CSS thuần.

```
@fluentui/react-components  9.74.6   peer react >=16.14 <20 · 62 dependencies
@fluentui/react-icons       2.0.337
```

> ⚠ **Đừng cài `@fluentui/tokens` riêng** — gói độc lập đó vẫn là `1.0.0-alpha.24`. Lấy `tokens` từ
> `@fluentui/react-components`, nó re-export sẵn.
>
> ⚠ **62 dependencies.** Chạy `npm install` **trước ngày thi**, đừng để nó ăn vào quỹ 4,5 tiếng.

**Điểm quan trọng nhất của mục này: hệ không cần theme tuỳ biến.** Mọi màu trong bảng dưới đây đều
là token chuẩn của `webLightTheme` — kể cả màu của dòng máy, vốn chỉ là `colorBrandBackground2` cộng
`colorBrandStroke1`. Nên bọc ứng dụng trong `<FluentProvider theme={webLightTheme}>` là xong; không
cần `createLightTheme`, không cần `BrandVariants` riêng.

Ba component của thư viện gánh đúng ba chỗ nặng nhất: **`DataGrid`** cho danh sách việc và
Opportunity · **`Tag`** cho nhãn Stage và nhãn nhiều giá trị · **`Badge`** cho Mức chắc chắn và cờ.

Bảng đối chiếu tên, dùng thẳng trong `makeStyles`:

> **Mức chứng cứ của cột bên phải.** Mọi tên trong cột đó đã được xác minh ở dạng **CSS custom
> property** — đọc trực tiếp `--colorNeutralForeground1`, `--borderRadiusMedium`, … trong 552 biến
> đang render trên trang Fluent chính chủ. Tên **khoá JS** trong object `tokens` khớp với chúng theo
> quy ước của Fluent, nhưng nghiên cứu **không mở được** định nghĩa JS để đo trực tiếp (các gói npm
> chỉ re-export). Việc đầu tiên khi dựng: `console.log(Object.keys(tokens).length)` và đối chiếu vài
> tên — một dòng, hết nghi ngờ.

| Token ở đây | Tên Fluent |
|---|---|
| `{colors.ink}` … `{colors.ink-4}` | `colorNeutralForeground1…4` |
| `{colors.paper}` `{colors.paper-tint}` `{colors.app}` | `colorNeutralBackground1 / 2 / 3` |
| `{colors.rule}` `{colors.rule-strong}` `{colors.rule-accessible}` | `colorNeutralStroke2 / 1 / Accessible` |
| `{colors.brand}` | `colorBrandBackground` |
| `{colors.machine-bg}` `{colors.machine-border}` | `colorBrandBackground2` · `colorBrandStroke1` |
| `{colors.chac-*}` | `colorStatusSuccessBackground1 / Border1 / Foreground1` |
| `{colors.cothe-*}` `{colors.suggestion-*}` | `colorStatusWarningBackground1 / Border1 / Foreground1` |
| `{colors.warn-*}` `{colors.overdue}` | `colorStatusDangerBackground1 / Border1 / Foreground1` |
| `{rounded.*}` | `borderRadiusNone…Circular` |
| `{spacing.xxs}`…`{spacing.xxxl}` | `spacingHorizontal/VerticalXXS…XXXL` |
| `{shadow.*}` | `shadow2 / 4 / 8 / 16 / 28 / 64` |

## Brand & Style

**Một ứng dụng làm việc, không phải một trang giới thiệu.** Nền xám rất nhạt, thẻ trắng, kẻ tóc
mảnh, bo góc 4px, màu dồn vào những vật thể nhỏ mang thông tin.

Sản phẩm này có **đúng một ý tưởng thị giác**, và nó không đổi khi lớp token đổi:

> Thứ máy đã quyết xong phải trông khác thứ đang chờ người quyết.

**Cơ chế đã đổi, ý tưởng thì không.** Trước đây là một dải nền tối tràn hết chiều ngang. Giờ là
**nền xanh rất nhạt `{colors.machine-bg}` cộng ray trái `{colors.machine-border}` 3px cộng ký hiệu ⚙** —
tức là chính mẫu badge ba thành phần của Fluent, áp lên cả một dòng.

Lý do đổi: nghiên cứu đo trên ba hệ mà người dùng nêu tên cho thấy **không hệ nào nhuộm cả khối để
đánh dấu nội dung máy**. Microsoft có token màu AI thật nhưng dùng để *gọi* AI; Airtable phân biệt ở
**tầng dữ liệu** — máy không bao giờ ghi đè ô người đã sửa. Dải nền tối là thứ ồn hơn mọi thứ đang có
trên thị trường, và đó là điều người dùng thử phản ứng.

**Không dùng icon sparkle ✨.** Đây là quyết định có bằng chứng, không phải sở thích: khảo sát cho
thấy 17% người dùng hiểu sparkle là "lưu / đánh dấu", vì 73% gắn hình ngôi sao với bookmark. Ký hiệu
⚙ giữ nguyên và **mang nghĩa cố định**.

## Colors

Bảng màu là **xám trung tính của Fluent, cộng bốn vai trò màu**.

| Vai trò | Token | Dùng ở đâu · **không** dùng ở đâu |
|---|---|---|
| Giấy | `{colors.paper}` `{colors.paper-tint}` | Nền thẻ và nền dòng việc |
| Nền ứng dụng | `{colors.app}` `{colors.app-2}` | Khoảng giữa các khối. **Không** làm nền thẻ |
| Mực | `{colors.ink}` → `{colors.ink-4}` | Bốn bậc. `{colors.ink-disabled}` chỉ cho thứ đã đóng |
| Kẻ | `{colors.rule}` `{colors.rule-strong}` | Kẻ tóc và viền ô nhập. `{colors.rule-accessible}` khi viền phải tự đạt 3:1 |
| **Máy** | `{colors.machine-bg}` `{colors.machine-border}` | **Chỉ** ở nơi máy đã quyết. Dùng cho một khối trang trí là phá luôn ngôn ngữ sản phẩm |
| Thương hiệu | `{colors.brand}` | Nút chính, liên kết, viền tiêu điểm. Màu nhấn **duy nhất** |
| Trạng thái | ba bộ `chac` · `cothe` · `warn` | Nhãn Mức chắc chắn, cờ, quá hạn |

**Mọi nhãn màu dùng mẫu ba thành phần** — đây là quy tắc quan trọng nhất của mục này, và là thứ giải
ràng buộc tương phản mà không phải bỏ màu:

```
nền gần trắng   +   viền màu   +   chữ đậm cùng họ
#f1faf1             #9fd89f        #0e700e
```

Nền đẩy **gần trắng** để chữ luôn đọc được; **viền** mới là thứ làm việc nhận diện màu. Không bao giờ
chọn một nền màu vừa rồi đi tìm chữ đọc được trên nó.

**Nền tối đã biến mất khỏi hệ.** Nghĩa là không còn cần hai biến thể màu cho Mức chắc chắn — trước
đây phải có bộ trên giấy và bộ trên dải. Giờ chỉ một bộ. Đây là chỗ hệ **đơn giản đi** khi đổi hướng.

Không gradient. Không màu tím "AI" — Microsoft cũng không dùng tím thuần, tím chỉ là điểm dừng thứ
ba trong dải xanh dương → cyan → tím của họ.

## Typography

**Một họ chữ, không hai.** Serif đã bị bỏ.

`{typography.base.fontFamily}` — chuỗi này lấy nguyên `fontFamilyBase` của Fluent. Segoe UI đứng đầu
vì nó **có đủ 90/90 glyph** khối `U+1EA0–U+1EF9`, đã kiểm bằng cách đọc bảng `cmap` của chính file
font. Số dùng `{typography.numeric.fontFamily}` và luôn `tabular-nums`.

> **Ràng buộc tiếng Việt, đã kiểm bằng phép đo chứ không phải bằng niềm tin.** Georgia và Times New
> Roman **không có** glyph Việt dựng sẵn — đó là lý do bản trước phải nạp Noto Serif. Segoe UI thì có,
> nhưng **chỉ tồn tại trên Windows**. Trên máy khác chuỗi dự phòng phải tự nó an toàn. Nếu cần kết
> quả giống nhau trên mọi máy thì nạp webfont, và ứng viên đã kiểm có subset `vietnamese` là **Inter,
> Be Vietnam Pro, IBM Plex Sans, Public Sans, Noto Sans, Roboto**. **Lato thì không** — nó chỉ có
> `latin` + `latin-ext`, và `latin-ext` không đủ cho chữ chồng dấu.

Thang cỡ chữ là thang Fluent nguyên xi, mỗi cỡ đi kèm một line-height cố định:

```
10/14 · 12/16 · 14/20 · 16/22 · 20/28 · 24/32
```

Bậc thân bài là **14px/20px**. Câu Next step lên **16px/22px**.

**Câu do máy đặt nặng hơn một bậc cân nặng** (600 so với 400), cùng cỡ chữ với câu người gõ. Đây là
tín hiệu thứ ba của ranh giới máy/người, sau nền và ray. Ba tín hiệu chồng nhau là có chủ đích: bỏ
một cái thì hai cái còn lại vẫn giữ được ranh giới.

Cân nặng: 400 thường · 500 nhấn nhẹ · 600 câu máy và nhãn · 700 hiếm khi cần.

## Layout & Spacing

Thang khoảng cách là thang Fluent: `2 · 4 · 6 · 8 · 10 · 12 · 16 · 20 · 24 · 32`.

**Hai bậc lẻ 6px và 10px là cố ý** — Fluent gọi chúng là `SNudge` và `MNudge`. **Không snap về lưới
4/8px.** Đây là quy tắc giữ nguyên từ bản trước, và giờ nó có xuất xứ chứ không còn là sở thích:
hệ thiết kế dày nào cũng cần bậc lẻ.

Dòng việc là lưới ba cột **`{spacing.col-when}` / 1fr / `{spacing.col-side}`**, gap `{spacing.l}`,
đệm `{spacing.row}`.

Dòng máy đệm trái `{spacing.row-machine-left}` vì ray 3px chiếm phần còn lại — tổng vẫn đúng 16px,
nên **câu việc của máy và của người thẳng hàng tuyệt đối**. Đây là chi tiết dễ làm hỏng nhất khi dựng
lại: lệch vài px là ranh giới đọc thành cẩu thả thay vì có chủ ý.

Rail phải của màn Today rộng `{spacing.col-rail}`. Khổ thiết kế `{spacing.app-width}` ×
`{spacing.app-height}`.

**Mật độ là một ngưỡng kiểm được, không phải một cảm giác:** ≥ **9 dòng việc** thấy được không cuộn
ở 1440×900 (`UX-5`). Đệm dòng `{spacing.row}` được chọn để đạt ngưỡng đó. Ba hệ được khảo sát đều
dày — Airtable làm việc ở chữ 13px với nhịp dọc 32px — nên ngưỡng này không mâu thuẫn với hướng hiện
đại.

## Elevation & Depth

**Bóng nay có, nhưng rất ít và rất nhạt.** Thang là thang Fluent, sáu bậc, mỗi bậc **hai lớp**: một
lớp ambient không lệch và một lớp key lệch xuống bằng nửa bán kính mờ. Alpha `.12` và `.14`.

| Dùng ở đâu | Bậc |
|---|---|
| Thẻ, dòng việc, mọi bề mặt tĩnh | **không bóng** — chỉ viền `{colors.rule}` |
| Menu thả xuống, tooltip, popover | `{shadow.4}` |
| Hộp thoại, Snapshot viewer | `{shadow.16}` |

**Ranh giới viền / bóng:** viền cho thứ **nằm trong dòng chảy trang**; bóng cho thứ **nổi lên trên
nó**. Một cái thẻ trong danh sách không nổi lên trên gì cả — nó không có bóng. Quy tắc này lấy từ
Airtable, hệ thậm chí không token hoá bóng.

Không blur, không transparency trừ lớp phủ hộp thoại. Không ảnh, không texture, không pattern.

## Shapes

**`{rounded.DEFAULT}` — 4px — ở mọi nơi**, trừ ba ngoại lệ:

| | Bán kính |
|---|---|
| Nút, ô nhập, nhãn, dòng máy, ô chọn | `{rounded.DEFAULT}` 4px |
| Thẻ và khối lớn | `{rounded.large}` 6px |
| Hộp thoại | `{rounded.xlarge}` 8px |
| Chấm tròn, avatar | `{rounded.circular}` |
| Dòng người trên nền giấy liền mạch | `{rounded.none}` — chúng là hàng của một bảng, không phải thẻ rời |

**8px là trần, không phải sàn.** Đây là chỗ dễ làm hỏng nhất khi nghe phản hồi "bo cong hơn": cả
Fluent (tối đa 8px) lẫn Airtable (mặc định 3px) đều không đi xa hơn. Bo 12px hay 16px sẽ đưa sản phẩm
ra ngoài vùng hai hệ này hoạt động.

Nét viền bốn bậc: `{spacing.stroke-thin}` kẻ tóc · `{spacing.stroke-thick}` viền tiêu điểm ·
`{spacing.stroke-thicker}` ray dòng máy · `{spacing.stroke-thickest}` hiếm dùng.

## Components

Đặc tả hành vi thuộc `EXPERIENCE.md`; dưới đây chỉ nói **trông thế nào**.

| Component | Thị giác |
|---|---|
| `work-item-machine` | Nền `{colors.machine-bg}` · ray trái `{colors.machine-border}` 3px · bo 4px · ⚙ dẫn đầu · câu 16px/600 |
| `work-item-human` | Giấy · kẻ tóc dưới `{colors.rule}` · không bo · ✎ dẫn đầu · câu 16px/400 |
| `confidence-badge` | ● Chắc · ◐ Có thể · ○ Đoán. Mẫu ba thành phần, **một** bộ màu duy nhất. **Ký hiệu và màu, không bao giờ màu đơn độc** |
| `suggestion-ghost` | Đề nghị chưa nhận hiện **tại chỗ** người sẽ gõ, mực `{colors.ghost-ink}`, nền trong suốt. Nhận / bỏ ngay tại đó |
| `suggestion-pin` | ◆ trên nền `{colors.suggestion-bg}` viền `{colors.suggestion-border}`, kèm số đang chờ |
| `warning-flag` | ▲ mẫu ba thành phần họ `warn`. Dòng chứa nó **không** đổi nền — cờ đã đủ nói |
| `undo-button` | ↩ cộng thời gian còn lại. Sắp hết hạn thì đổi sang họ `warn` |
| `stage-pill` | Nhãn 4px, nền `{colors.paper-tint}`, viền `{colors.rule}`. Stage **đã đóng** dùng mực `{colors.ink-disabled}` |
| `ai-off-banner` | Dải cảnh báo họ `warn` trên khung ứng dụng, ⚙ dẫn đầu — hiện với **Sales**, không chỉ Quản trị |
| `card` | Nền giấy, viền 1px, bo 6px, **không bóng** |
| `dialog` | Bo 8px, `{shadow.16}` |
| `focus-ring` | `{spacing.stroke-thick}` `{colors.brand}`, offset 1px. Không đổi theo nền nữa — nền tối đã biến mất |

**Mười ký hiệu, mỗi cái một nghĩa cố định** — hệ đóng, không thêm: ⚙ máy · ✎ người · ● Chắc ·
◐ Có thể · ○ Đoán · ▲ cờ · ◆ có Suggestion chờ · ↩ Hoàn tác · ▮ đoạn được đánh dấu · → hiện tại sang
đề nghị.

## Do's and Don'ts

**Làm**

- Lấy giá trị từ bảng token Fluent ở đầu tệp, **đừng chế số mới**
- Dùng nền máy `{colors.machine-bg}` **chỉ** ở nơi máy đã quyết
- Giữ ba tín hiệu của ranh giới máy/người: nền · ray · cân nặng chữ
- Mọi nhãn màu dùng **mẫu ba thành phần**: nền gần trắng + viền + chữ đậm
- Ghép ký hiệu với màu ở **mọi** chỗ truyền thông tin bằng màu
- Giữ hai bậc khoảng cách lẻ 6px và 10px nguyên xi
- Cho Stage đã đóng mực nhạt hơn — chúng là lịch sử, không phải việc

**Không làm**

- **Không** bo quá `{rounded.xlarge}` 8px. Trần, không phải sàn
- **Không** đổ bóng lên thứ nằm trong dòng chảy trang. Thẻ trong danh sách không có bóng
- **Không** dùng icon sparkle ✨ — 17% người dùng đọc nó thành "lưu"
- **Không** dùng gradient, và **không** dùng tím làm màu AI
- **Không** in phần trăm độ tin cậy. Ba mức bằng chữ là quyết định có bằng chứng: cả Google PAIR lẫn
  Microsoft HAX đều chống chỉ báo bằng số
- **Không** dùng emoji. Ký hiệu là unicode hình học và chúng **mang nghĩa**
- **Không** dùng màu đơn độc để truyền thông tin
- **Không** đặt `outline: none` ở bất kỳ đâu — một dòng trong sàn khả năng tiếp cận
- **Không** chép luật ghép nền-chữ của Airtable. Nó là luật nhị phân theo tên màu, **không tính
  tương phản**, và tự nó sinh vi phạm
- **Không** snap thang khoảng cách về lưới 8px
- **Không** vẽ logo. Chỗ nào cần mark thì đặt chữ "Why Now" 20px/600
