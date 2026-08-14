# Airtable — ngôn ngữ thiết kế UI (R1-1)

Ngày chạy: 2026-08-14 · Researcher: technical research (Airtable)

---

## Phát hiện nền: Airtable KHÔNG có design system công khai

### Airtable không xuất bản một design system công khai (không có site kiểu material.io / carbondesignsystem.com); nguồn token chính chủ duy nhất truy được là gói npm `@airtable/blocks` (Blocks/Extensions SDK), phiên bản mới nhất trên unpkg là 1.19.0
- nguồn: https://unpkg.com/@airtable/blocks/?meta
- nhà xuất bản: Airtable (qua unpkg CDN, npm registry)
- ngày xuất bản: không rõ (phiên bản 1.19.0)
- truy cập: 2026-08-14
- độ tin: cao
- lớp: nguồn-token

Hệ quả quan trọng: **mọi token dưới đây là token của Blocks/Extensions UI kit**, tức là bộ component Airtable phát cho lập trình viên viết extension chạy *bên trong* Airtable — không phải bộ token của grid view trong sản phẩm chính. Airtable tự giới thiệu đây là "the same UI kit Airtable's team uses internally", nên độ gần là cao nhưng **không đồng nhất**. Mọi thứ liên quan tới grid (chiều cao hàng, header, cột) **không** nằm trong gói này.

Đường dẫn file gốc dùng cho digest này (tất cả trong `@airtable/blocks@1.19.0`):
- `/dist/cjs/ui/theme/default_theme/tokens.js`
- `/dist/cjs/ui/theme/default_theme/control_sizes.js`
- `/dist/cjs/ui/theme/default_theme/text_styles.js`
- `/dist/cjs/colors.js`
- `/dist/cjs/color_utils.js`

---

## 1. Bo góc (radius)

### Airtable Blocks UI chỉ có ba bán kính bo góc: `default: 3px`, `large: 6px`, `circle: 9999px`
- nguồn: https://unpkg.com/@airtable/blocks@1.19.0/dist/cjs/ui/theme/default_theme/tokens.js
- nhà xuất bản: Airtable (npm `@airtable/blocks`)
- ngày xuất bản: không rõ (v1.19.0)
- truy cập: 2026-08-14
- độ tin: cao
- lớp: radius

Nguyên văn:
```js
radii = { default: 3, large: 6, circle: 9999 }
```
Đây là thang bo góc **rất chặt** — 3px là mặc định cho hầu hết bề mặt (nút, ô nhập, thẻ), 6px cho bề mặt lớn (dialog/modal/popover), 9999px cho hình viên thuốc.

### File `control_sizes.js` KHÔNG định nghĩa borderRadius riêng cho từng control (button / input / select / switch), nên các control kế thừa thang radii chung ở trên
- nguồn: https://unpkg.com/@airtable/blocks@1.19.0/dist/cjs/ui/theme/default_theme/control_sizes.js
- nhà xuất bản: Airtable (npm `@airtable/blocks`)
- ngày xuất bản: không rõ (v1.19.0)
- truy cập: 2026-08-14
- độ tin: vừa (đây là phát biểu về *sự vắng mặt* trong một file; chưa đối chiếu `button_variants.js` / `input_variants.js`)
- lớp: radius

### Chip/pill của Single select và Multiple select: KHÔNG tìm được giá trị radius chính chủ
Component tương ứng trong SDK là `ChoiceToken` (`/dist/cjs/ui/choice_token.js`) và `CollaboratorToken` — chưa đọc được nội dung file trong lần chạy này. Với thang radii chỉ có {3, 6, 9999}, chip select hoặc là `circle: 9999px` (viên thuốc hoàn toàn tròn) hoặc `default: 3px`. **Đây là suy luận từ thang token, không phải bằng chứng.** Cần đọc `choice_token.js` để chốt.
- độ tin: thấp
- lớp: radius

---

## 2. Bảng màu

### Bảng màu người dùng chọn cho option của Single/Multiple select gồm đúng 10 họ màu × 5 sắc độ = 50 màu; năm sắc độ là `Light2`, `Light1`, `Bright`, `Dark1`, và tên trần (không hậu tố)
- nguồn: https://unpkg.com/@airtable/blocks@1.19.0/dist/cjs/colors.js
- nhà xuất bản: Airtable (npm `@airtable/blocks`)
- ngày xuất bản: không rõ (v1.19.0)
- truy cập: 2026-08-14
- độ tin: cao
- lớp: màu

Mười họ: `blue`, `cyan`, `gray`, `green`, `orange`, `pink`, `purple`, `red`, `teal`, `yellow`.

Lưu ý về ngữ nghĩa: **`Light2` là nhạt nhất**, `Light1` nhạt vừa, `Bright` là màu bão hoà rực, `Dark1` là màu đậm. Tên trần (ví dụ `blue`) là một màu riêng, không phải alias của `Bright` — trừ `gray`, nơi `gray` và `grayBright` trùng nhau ([102,102,102]).

### Giá trị RGB/hex đầy đủ của 50 màu select (chuyển từ `rgbTuplesByColor`)
- nguồn: https://unpkg.com/@airtable/blocks@1.19.0/dist/cjs/colors.js
- nhà xuất bản: Airtable (npm `@airtable/blocks`)
- ngày xuất bản: không rõ (v1.19.0)
- truy cập: 2026-08-14
- độ tin: cao (RGB lấy nguyên văn từ mã nguồn; hex do tôi chuyển đổi số học, không phải Airtable công bố)
- lớp: màu

| Họ màu | Light2 (nền nhạt) | Light1 | Bright | Dark1 | base (tên trần) |
| --- | --- | --- | --- | --- | --- |
| blue | `#CFDFFF` (207,223,255) | `#9CC7FF` (156,199,255) | `#2D7FF9` (45,127,249) | `#2750AE` (39,80,174) | `#1283DA` (18,131,218) |
| cyan | `#D0F0FD` (208,240,253) | `#77D1F3` (119,209,243) | `#18BFFF` (24,191,255) | `#0B76B7` (11,118,183) | `#01A9DB` (1,169,219) |
| gray | `#EEEEEE` (238,238,238) | `#CCCCCC` (204,204,204) | `#666666` (102,102,102) | `#444444` (68,68,68) | `#666666` (102,102,102) |
| green | `#D1F7C4` (209,247,196) | `#93E088` (147,224,136) | `#20C933` (32,201,51) | `#338A17` (51,138,23) | `#11AF22` (17,175,34) |
| orange | `#FEE2D5` (254,226,213) | `#FFA981` (255,169,129) | `#FF6F2C` (255,111,44) | `#D74D26` (215,77,38) | `#F7653B` (247,101,59) |
| pink | `#FFDAF6` (255,218,246) | `#F99DE2` (249,157,226) | `#FF08C2` (255,8,194) | `#B2158B` (178,21,139) | `#E929BA` (233,41,186) |
| purple | `#EDE2FE` (237,226,254) | `#CDB0FF` (205,176,255) | `#8B46FF` (139,70,255) | `#6B1CB0` (107,28,176) | `#7C39ED` (124,57,237) |
| red | `#FFDCE5` (255,220,229) | `#FF9EB7` (255,158,183) | `#F82B60` (248,43,96) | `#BA1E45` (186,30,69) | `#EF3061` (239,48,97) |
| teal | `#C2F5E9` (194,245,233) | `#72DDC3` (114,221,195) | `#20D9D2` (32,217,210) | `#06A09B` (6,160,155) | `#02AAA4` (2,170,164) |
| yellow | `#FFEAB6` (255,234,182) | `#FFD66E` (255,214,110) | `#FCB400` (252,180,0) | `#B87503` (184,117,3) | `#E08D00` (224,141,0) |

### Quy tắc ghép nền-chữ của Airtable là một luật nhị phân theo hậu tố tên màu, KHÔNG phải tính tương phản: màu kết thúc bằng `Light1` hoặc `Light2` dùng chữ tối; mọi màu khác (`Bright`, `Dark1`, tên trần) dùng chữ sáng
- nguồn: https://unpkg.com/@airtable/blocks@1.19.0/dist/cjs/color_utils.js
- nhà xuất bản: Airtable (npm `@airtable/blocks`)
- ngày xuất bản: không rõ (v1.19.0)
- truy cập: 2026-08-14
- độ tin: cao
- lớp: màu

Nguyên văn tài liệu trong file: *"Light1 and Light2 colors use dark text. Bright, Dark1 and no suffix colors use light text."* Hàm là `colorUtils.shouldUseLightTextOnColor(color)` → trả `true` trừ khi tên kết thúc bằng `Light1`/`Light2`.

Đây là điểm cần cẩn trọng khi sao chép: luật này **không đảm bảo WCAG**. Ví dụ `yellowBright` `#FCB400` với chữ trắng cho tỷ lệ tương phản rất thấp; `greenBright` `#20C933`, `tealBright` `#20D9D2`, `cyanBright` `#18BFFF` cũng vậy. Airtable chọn nhất quán thị giác hơn là ngưỡng tương phản. ⚠ Tôi chưa tính số tương phản cụ thể trong lần chạy này.

### Bảng màu nền/nét trung tính của theme dùng HSL, không dùng hex
- nguồn: https://unpkg.com/@airtable/blocks@1.19.0/dist/cjs/ui/theme/default_theme/tokens.js
- nhà xuất bản: Airtable (npm `@airtable/blocks`)
- ngày xuất bản: không rõ (v1.19.0)
- truy cập: 2026-08-14
- độ tin: cao
- lớp: màu

```js
white:      'hsl(0, 0%, 100%)'   // #FFFFFF
dark:       'hsl(0, 0%, 20%)'    // ~#333333 — màu chữ chính
light:      'hsl(0, 0%, 46%)'    // ~#757575 — chữ phụ
lightGray1: 'hsl(0, 0%, 98%)'    // ~#FAFAFA
lightGray2: 'hsl(0, 0%, 95%)'    // ~#F2F2F2
lightGray3: 'hsl(0, 0%, 91%)'    // ~#E8E8E8
lightGray4: 'hsl(0, 0%, 88%)'    // ~#E0E0E0 — hay dùng cho đường kẻ
lighten1..4: hsla(0,0%,100%, 0.05 / 0.1 / 0.25 / 0.5)
darken1..4:  hsla(0,0%,0%,   0.05 / 0.1 / 0.25 / 0.5)
```
Toàn bộ thang trung tính là **xám thuần, hue 0, saturation 0%** — không ám xanh, không ám ấm. Bốn bậc `lightGray` nằm rất sát nhau (98/95/91/88%), tức là hệ thống phân tầng bề mặt bằng những chênh lệch cực nhỏ.

### Thang phủ (overlay) `lighten1–4` / `darken1–4` chính là cơ chế Airtable dùng thay cho bóng để tạo trạng thái hover/active
- nguồn: https://unpkg.com/@airtable/blocks@1.19.0/dist/cjs/ui/theme/default_theme/tokens.js
- nhà xuất bản: Airtable (npm `@airtable/blocks`)
- ngày xuất bản: không rõ (v1.19.0)
- truy cập: 2026-08-14
- độ tin: vừa (giá trị token là chắc; *mục đích sử dụng* là suy luận từ tên và từ việc thiếu token shadow)
- lớp: màu / elevation

### Màu thương hiệu Airtable: KHÔNG tìm được nguồn chính chủ trong lần chạy này
Bộ vàng/đỏ/xanh dương/tím của logo Airtable không có trong token của SDK. Các trang tổng hợp mã màu thương hiệu (seekcolors, mobbin) có xuất hiện trong kết quả tìm kiếm nhưng **tôi không đọc chúng** và chúng là bên thứ ba, độ tin thấp. Giả thuyết đáng kiểm: bốn màu logo có thể trùng với `yellowBright #FCB400`, `redBright #F82B60`, `blueBright #2D7FF9` và một sắc tím — nhưng **đây là chưa kiểm chứng**.
- độ tin: thấp
- lớp: màu

---

## 3. Bóng và độ sâu

### File token của Airtable Blocks UI KHÔNG chứa bất kỳ object `shadows`, `boxShadow` hay thang elevation nào
- nguồn: https://unpkg.com/@airtable/blocks@1.19.0/dist/cjs/ui/theme/default_theme/tokens.js
- nhà xuất bản: Airtable (npm `@airtable/blocks`)
- ngày xuất bản: không rõ (v1.19.0)
- truy cập: 2026-08-14
- độ tin: vừa (phát biểu về sự vắng mặt; hệ thống style có prop `boxShadow` ở `/dist/cjs/ui/system/appearance/box_shadow.js` nhưng đó là *prop truyền tự do*, không phải thang token dựng sẵn)
- lớp: elevation

Đây là một phát hiện có ích: Airtable Blocks UI **không token hoá độ sâu**. Có `borderWidths = { default: '1px', thick: '2px' }` nhưng không có thang bóng. Ngôn ngữ thị giác nghiêng hẳn về **đường kẻ 1px + phủ darken/lighten**, không phải bóng đổ. Với grid, tôi không có bằng chứng trực tiếp, nhưng thiếu vắng token shadow trong bộ UI chính chủ là chỉ dấu mạnh rằng grid dùng kẻ 1px chứ không dùng bóng.

### `borderWidths` chỉ có hai bậc: `default: '1px'`, `thick: '2px'`
- nguồn: https://unpkg.com/@airtable/blocks@1.19.0/dist/cjs/ui/theme/default_theme/tokens.js
- nhà xuất bản: Airtable (npm `@airtable/blocks`)
- ngày xuất bản: không rõ (v1.19.0)
- truy cập: 2026-08-14
- độ tin: cao
- lớp: elevation

### Thang độ mờ (`opacities`): normal 1 · quiet 0.75 · quieter 0.5 · quietest 0.25 · invisible 0
- nguồn: https://unpkg.com/@airtable/blocks@1.19.0/dist/cjs/ui/theme/default_theme/tokens.js
- nhà xuất bản: Airtable (npm `@airtable/blocks`)
- ngày xuất bản: không rõ (v1.19.0)
- truy cập: 2026-08-14
- độ tin: cao
- lớp: elevation

---

## 4. Typography

### Airtable Blocks UI KHÔNG dùng font riêng và KHÔNG dùng Inter — nó dùng nguyên system font stack của hệ điều hành
- nguồn: https://unpkg.com/@airtable/blocks@1.19.0/dist/cjs/ui/theme/default_theme/tokens.js
- nhà xuất bản: Airtable (npm `@airtable/blocks`)
- ngày xuất bản: không rõ (v1.19.0)
- truy cập: 2026-08-14
- độ tin: cao
- lớp: chữ

```js
fontFamilies = {
  default: "-apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
  monospace: " Menlo, Courier, monospace"
}
```
Hệ quả cho hackathon: **không cần tải webfont**. Trên Windows sẽ ra Segoe UI, trên macOS ra SF Pro. (⚠ Sản phẩm Airtable web hiện tại có thể đã đổi sang font riêng — token SDK này không chứng minh được điều đó.)

### Thang cỡ chữ là mảng 10 bậc lẻ: `['9px','11px','13px','15px','17px','19px','21px','23px','27px','35px']`
- nguồn: https://unpkg.com/@airtable/blocks@1.19.0/dist/cjs/ui/theme/default_theme/tokens.js
- nhà xuất bản: Airtable (npm `@airtable/blocks`)
- ngày xuất bản: không rõ (v1.19.0)
- truy cập: 2026-08-14
- độ tin: cao
- lớp: chữ

Index 0…9. Bước nhảy 2px đều đặn từ 9→23, rồi 27, 35. Đáng chú ý: **toàn bộ là số lẻ**, không có 12/14/16px — khác hẳn thang 4px thông thường.

### Cỡ chữ mặc định của mọi control (button, input, select, switch) là index 2 = **13px**; size `large` mới lên index 3 = 15px
- nguồn: https://unpkg.com/@airtable/blocks@1.19.0/dist/cjs/ui/theme/default_theme/control_sizes.js
- nhà xuất bản: Airtable (npm `@airtable/blocks`)
- ngày xuất bản: không rõ (v1.19.0)
- truy cập: 2026-08-14
- độ tin: cao
- lớp: chữ

13px là cỡ chữ làm việc của Airtable. Đây gần như chắc chắn cũng là cỡ chữ trong ô grid, dù tôi **không có bằng chứng trực tiếp cho grid**.

### `fontWeights` chỉ định nghĩa một token: `strong: 500`. Mọi `textStyles` đều đặt `fontWeight: 400`
- nguồn: https://unpkg.com/@airtable/blocks@1.19.0/dist/cjs/ui/theme/default_theme/tokens.js và .../text_styles.js
- nhà xuất bản: Airtable (npm `@airtable/blocks`)
- ngày xuất bản: không rõ (v1.19.0)
- truy cập: 2026-08-14
- độ tin: cao
- lớp: chữ

Tức là hệ chữ chỉ có **hai cân nặng: 400 và 500**. Không có 600, không có 700. Nhấn mạnh bằng 500 chứ không bằng bold.

### Thang `textStyles` — hai nhóm, mỗi nhóm bốn bậc (fontSize index → lineHeight)
- nguồn: https://unpkg.com/@airtable/blocks@1.19.0/dist/cjs/ui/theme/default_theme/text_styles.js
- nhà xuất bản: Airtable (npm `@airtable/blocks`)
- ngày xuất bản: không rõ (v1.19.0)
- truy cập: 2026-08-14
- độ tin: cao
- lớp: chữ

| Bậc | fontSize idx (px) | `default` lineHeight | `paragraph` lineHeight |
| --- | --- | --- | --- |
| small | 1 (11px) | 14px | 16px |
| default | 2 (13px) | 16px | 20px |
| large | 3 (15px) | 20px | 22px |
| xlarge | 4 (17px) | 24px | 26px |

Nhóm `default` là chữ UI một dòng (line-height chặt: 13/16 ≈ 1.23), nhóm `paragraph` là chữ đoạn (13/20 = 1.54). **Con số 16px line-height cho chữ 13px chính là chìa khoá mật độ**: nó cho biết chữ trong một ô chỉ cần ~16px chiều cao nội dung.

---

## 5. Mật độ hàng trong grid — phần quan trọng nhất

### Airtable grid view có ĐÚNG bốn mức chiều cao hàng: Short (dày nhất, mặc định cho view mới), Medium, Tall, Extra Tall (thoáng nhất)
- nguồn: https://support.airtable.com/docs/airtable-grid-view
- nhà xuất bản: Airtable Support (chính chủ)
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: cao
- lớp: mật độ

Tài liệu mô tả ở mức Short: *"each record shows one line of text and small attachment thumbnails."*

### Airtable KHÔNG công bố giá trị px của bốn mức chiều cao hàng ở bất kỳ nguồn chính chủ nào tôi tra được — không trong tài liệu support, không trong Blocks SDK
- nguồn: https://support.airtable.com/docs/airtable-grid-view
- nhà xuất bản: Airtable Support (chính chủ)
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: cao (phát biểu về sự vắng mặt, đã kiểm ở tài liệu support + gói SDK)
- lớp: mật độ

**Đây là phát hiện, không phải thất bại.** Không được bịa số. Ba lý do khiến con số này không tồn tại công khai: (a) grid view là mã đóng của ứng dụng web Airtable, không có trong SDK; (b) tài liệu support viết cho người dùng cuối, mô tả bằng "một dòng / nhiều dòng" chứ không bằng px; (c) API REST và Blocks API không phơi bày thuộc tính `rowHeight` của view.

### Airtable cũng KHÔNG công bố chiều cao header của grid, cũng không công bố chiều rộng cột mặc định
- nguồn: https://support.airtable.com/docs/airtable-grid-view
- nhà xuất bản: Airtable Support (chính chủ)
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: cao
- lớp: mật độ

Tài liệu chỉ nói người dùng kéo mép cột để đổi độ rộng, không nêu giá trị mặc định.

### Số liệu mật độ chính chủ DUY NHẤT lấy được: chiều cao control mặc định của Airtable là 32px, small 28px, large 36px
- nguồn: https://unpkg.com/@airtable/blocks@1.19.0/dist/cjs/ui/theme/default_theme/control_sizes.js
- nhà xuất bản: Airtable (npm `@airtable/blocks`)
- ngày xuất bản: không rõ (v1.19.0)
- truy cập: 2026-08-14
- độ tin: cao (là số của control, KHÔNG phải của hàng grid)
- lớp: mật độ

| Size | height | fontSize idx (px) | lineHeight |
| --- | --- | --- | --- |
| small | 28px | 2 (13px) | 19px |
| default | 32px | 2 (13px) | 21px |
| large | 36px | 3 (15px) | 21px |

paddingX theo loại control: button 10/12/14px · input 8/10/12px · switch 8/10/12px · select paddingLeft 8/10/12px + paddingRight 24/26/28px (chừa chỗ mũi tên).

**32px là nhịp dọc chuẩn của Airtable.** Nếu cần một con số neo cho hàng grid mức Short mà không bịa, 32px là ước lượng có cơ sở nhất — nó khớp cả với line-height 16px của chữ 13px cộng padding 8px trên/dưới. Nhưng phải ghi rõ: **đây là suy luận từ token control, không phải giá trị Airtable công bố cho grid.** ⚠

### Thang khoảng cách (`space`) là bội của 4 nhưng nhảy gấp đôi: `[0, 4, 8, 16, 32, 64, 128]`
- nguồn: https://unpkg.com/@airtable/blocks@1.19.0/dist/cjs/ui/theme/default_theme/tokens.js
- nhà xuất bản: Airtable (npm `@airtable/blocks`)
- ngày xuất bản: không rõ (v1.19.0)
- truy cập: 2026-08-14
- độ tin: cao
- lớp: khoảng cách

Không có 12px, không có 24px, không có 48px. Thang nhân đôi thuần tuý sau bậc 4.

### Về ngưỡng cứng "9 dòng không cuộn ở 1440×900" — tôi KHÔNG tìm được số Airtable công bố để đối chiếu
Phép tính chỉ có thể làm từ giả định, và giả định thì không phải bằng chứng. Nếu đội sản phẩm muốn con số thật, cách duy nhất đáng tin là **tự đo**: mở một base Airtable ở 1440×900, chụp màn hình, đếm hàng và đo bằng DevTools. Đó vẫn là đo đạc chứ không phải tài liệu, nhưng nó là nguồn sơ cấp trực tiếp và **chính xác hơn bất kỳ con số đi mượn nào**.
- độ tin: không áp dụng (khuyến nghị phương pháp, không phải phát hiện)
- lớp: mật độ

---

## 6. Nguồn sơ cấp nhất — danh sách link

| Nguồn | Loại | Nội dung lấy được | Độ tin |
| --- | --- | --- | --- |
| https://unpkg.com/@airtable/blocks@1.19.0/dist/cjs/ui/theme/default_theme/tokens.js | Mã nguồn chính chủ | radii, fontFamilies, fontSizes, fontWeights, space, opacities, borderWidths, colors trung tính | cao |
| https://unpkg.com/@airtable/blocks@1.19.0/dist/cjs/colors.js | Mã nguồn chính chủ | 50 màu select + `rgbTuplesByColor` | cao |
| https://unpkg.com/@airtable/blocks@1.19.0/dist/cjs/color_utils.js | Mã nguồn chính chủ | luật `shouldUseLightTextOnColor` | cao |
| https://unpkg.com/@airtable/blocks@1.19.0/dist/cjs/ui/theme/default_theme/control_sizes.js | Mã nguồn chính chủ | chiều cao 28/32/36px, padding | cao |
| https://unpkg.com/@airtable/blocks@1.19.0/dist/cjs/ui/theme/default_theme/text_styles.js | Mã nguồn chính chủ | thang textStyles + lineHeight | cao |
| https://unpkg.com/@airtable/blocks/?meta | Manifest gói npm chính chủ | danh sách file, version 1.19.0 | cao |
| https://support.airtable.com/docs/airtable-grid-view | Tài liệu chính chủ | bốn mức row height, Short là mặc định | cao |
| https://github.com/Airtable/blocks | Kho mã chính chủ | ⚠ **không đọc được** trong lần chạy này (lỗi chứng chỉ TLS trên raw.githubusercontent + github.com, GitHub API không xác thực) | — |

---

## Manh mối đáng đuổi tiếp

1. **`/dist/cjs/ui/choice_token.js`** — đây là component chip của trường Single/Multiple select trong SDK. Nó gần như chắc chắn chứa radius, padding và chiều cao thật của viên chip. Câu hỏi số 1 của brief chưa trả lời được chỉ vì chưa mở file này. **Ưu tiên cao nhất.**
2. **`/dist/cjs/ui/theme/default_theme/button_variants.js`, `input_variants.js`, `select_variants.js`, `link_variants.js`, `switch_variants.js`, `select_buttons_variants.js`** — sáu file variant này chứa màu nền/viền/hover và có thể chứa borderRadius ghi đè cho từng loại control. Là nơi duy nhất còn có thể chứa giá trị bóng.
3. **`/dist/cjs/ui/record_card.js`** — RecordCard là thẻ bản ghi chính chủ; nhiều khả năng có hằng số chiều cao thẻ cố định. Đây là số mật độ chính chủ gần grid nhất còn lại.
4. **`/dist/cjs/ui/cell_renderer.js`** — CellRenderer vẽ nội dung một ô đúng như grid vẽ. Nếu có bất kỳ hằng số chiều cao ô nào chính chủ, nó nằm đây.
5. **`/dist/cjs/ui/theme/default_theme/heading_styles.js`** — thang heading, bổ sung cho typography.
6. **`/dist/cjs/ui/use_text_color_for_background_color.js`** — có thể chứa logic tương phản tinh hơn luật hậu tố nhị phân, đáng đối chiếu.
7. **Kho GitHub `Airtable/blocks`** — chưa vào được vì lỗi TLS. Nếu môi trường khác vào được, `packages/sdk/src/` có mã TypeScript gốc dễ đọc hơn bản build CJS, và có thể có comment giải thích.
8. **Tự đo bằng trình duyệt** — mở Airtable ở 1440×900, DevTools, đo chiều cao hàng ở cả bốn mức + header + cột mặc định. Đây là cách duy nhất lấy được con số mật độ thật. Kết quả sẽ là nguồn sơ cấp do chính đội tạo ra.
9. **Màu thương hiệu Airtable** — cần một nguồn chính chủ (trang brand/press của airtable.com), chưa tra trong lần chạy này.

## Thứ tôi đã tìm mà không thấy

- **Design system công khai của Airtable.** Không tồn tại. Không có site tài liệu thiết kế, không có bảng token xuất bản, không có hướng dẫn thương hiệu công khai tìm được. Nguồn chính chủ duy nhất là mã của Blocks/Extensions SDK.
- **Giá trị px của bốn mức row height (Short/Medium/Tall/Extra Tall).** Không có ở tài liệu support, không có ở SDK, không có ở API. Hai lần tìm kiếm với hai cách đặt câu hỏi khác nhau đều trả về cùng một nhóm trang (tài liệu support Airtable + các bài hướng dẫn bên thứ ba + câu hỏi cộng đồng), **không trang nào nêu px**. Các bài của guideflow/iorad/YouTube chỉ hướng dẫn thao tác.
- **Chiều cao header grid và chiều rộng cột mặc định.** Không công bố.
- **Bất kỳ token bóng/elevation nào.** Không tồn tại trong theme của Blocks UI.
- **Radius của chip select.** Chưa lấy được (xem manh mối #1).
- **Mã hex màu thương hiệu từ nguồn chính chủ.** Chỉ thấy các trang tổng hợp bên thứ ba, không đọc, độ tin thấp.
- **`airtable.com/developers/extensions/api`** — trang tài liệu developer render bằng JavaScript, WebFetch chỉ nhận được thông báo "browser không được hỗ trợ". Không dùng được nếu không chạy trình duyệt thật. `airtable.com/developers/extensions/api/colors` trả 404.
- **`raw.githubusercontent.com` và `github.com`** — cả WebFetch lẫn curl đều thất bại vì lỗi xác thực chứng chỉ TLS trong môi trường này; GitHub API yêu cầu token. unpkg là đường vòng đã cứu được lần chạy này.
