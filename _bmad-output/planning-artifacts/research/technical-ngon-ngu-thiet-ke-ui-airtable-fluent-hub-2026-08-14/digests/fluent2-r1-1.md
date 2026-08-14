# Fluent 2 — giá trị token thật (radius, màu, elevation, chữ, khoảng cách)

Vòng: r1-1 · Truy cập: 2026-08-14 · Người thực hiện: researcher

**Ghi chú về bề mặt tìm kiếm.** Máy chạy nghiên cứu này bị proxy chặn `github.com`,
`raw.githubusercontent.com` và `api.github.com` (lỗi TLS `unable to verify the first
certificate`). Vì vậy nguồn sơ cấp được lấy qua **unpkg.com**, tức là gói npm
`@fluentui/tokens` đã build — cùng một mã nguồn với `microsoft/fluentui`
`packages/tokens/`, chỉ khác là bản biên dịch. Đây vẫn là nguồn sơ cấp do Microsoft
xuất bản. Các URL unpkg không ghim phiên bản, nên chúng phân giải về bản `latest`
tại thời điểm truy cập.

---

## 1. Bo góc (border-radius)

### Thang `borderRadius` của Fluent 2 có 11 bậc: None 0, Small 2px, Medium 4px, Large 6px, XLarge 8px, 2XLarge 12px, 3XLarge 16px, 4XLarge 24px, 5XLarge 32px, 6XLarge 40px, Circular 10000px.
- nguồn: https://unpkg.com/@fluentui/tokens/lib/global/borderRadius.js
- nhà xuất bản: Microsoft (gói npm `@fluentui/tokens`)
- ngày xuất bản: không rõ (bản `latest` tại thời điểm truy cập)
- truy cập: 2026-08-14
- độ tin: cao
- lớp: radius

Bảng thô, chép nguyên từ tệp:

```javascript
export const borderRadius = {
    borderRadiusNone: '0',
    borderRadiusSmall: '2px',
    borderRadiusMedium: '4px',
    borderRadiusLarge: '6px',
    borderRadiusXLarge: '8px',
    borderRadius2XLarge: '12px',
    borderRadius3XLarge: '16px',
    borderRadius4XLarge: '24px',
    borderRadius5XLarge: '32px',
    borderRadius6XLarge: '40px',
    borderRadiusCircular: '10000px'
};
```

Lưu ý: brief giả định thang chỉ tới `XLarge`. Thực tế thang dài hơn — có tới
`6XLarge` (40px). `borderRadiusCircular` không phải `9999px` mà là **`10000px`**.

### `borderRadiusMedium` = 4px được xác nhận độc lập qua PR #21494 của kho `microsoft/fluentui` (đổi nút cỡ small sang bậc này).
- nguồn: https://github.com/microsoft/fluentui/pull/21494
- nhà xuất bản: Microsoft / GitHub
- ngày xuất bản: không rõ
- truy cập: 2026-08-14 (qua chỉ mục tìm kiếm — trang không mở trực tiếp được vì proxy)
- độ tin: vừa
- lớp: radius

### Hàng của Table dùng `var(--borderRadiusMedium)` cho vòng focus (`:focus-visible`).
- nguồn: https://unpkg.com/@fluentui/react-table/lib/components/TableRow/useTableRowStyles.styles.js
- nhà xuất bản: Microsoft (gói npm `@fluentui/react-table`)
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: vừa (đây là bản Griffel đã biên dịch; chỉ đọc được tham chiếu biến, không đọc được px)
- lớp: radius

**⚠ Chưa kiểm chứng trong vòng này:** bậc radius cụ thể mà nút / ô nhập / thẻ /
hộp thoại / badge dùng. Các gói `@fluentui/react-*` trên unpkg đã qua Griffel nên
giá trị bị nén thành tên lớp; không đọc được px từ đó. Xem mục "Manh mối".

---

## 2. Bảng màu

### Dải thương hiệu mặc định của Fluent 2 web (`brandWeb`) có 16 bậc 10→160; bậc 80 là `#0f6cbd` — đây chính là màu gán cho `colorBrandBackground`.
- nguồn: https://unpkg.com/@fluentui/tokens/lib/global/brandColors.js
- nhà xuất bản: Microsoft (gói npm `@fluentui/tokens`)
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: cao
- lớp: màu

Bảng thô `brandWeb`:

| bậc | hex |
| --- | --- |
| 10 | `#061724` |
| 20 | `#082338` |
| 30 | `#0a2e4a` |
| 40 | `#0c3b5e` |
| 50 | `#0e4775` |
| 60 | `#0f548c` |
| 70 | `#115ea3` |
| 80 | `#0f6cbd` |
| 90 | `#2886de` |
| 100 | `#479ef5` |
| 110 | `#62abf5` |
| 120 | `#77b7f7` |
| 130 | `#96c6fa` |
| 140 | `#b4d6fa` |
| 150 | `#cfe4fa` |
| 160 | `#ebf3fc` |

Bảng thô `brandTeams` (dải thương hiệu của Microsoft Teams, cùng tệp):

| bậc | hex |
| --- | --- |
| 10 | `#2b2b40` |
| 20 | `#2f2f4a` |
| 30 | `#333357` |
| 40 | `#383966` |
| 50 | `#3d3e78` |
| 60 | `#444791` |
| 70 | `#4f52b2` |
| 80 | `#5b5fc7` |
| 90 | `#7579eb` |
| 100 | `#7f85f5` |
| 110 | `#9299f7` |
| 120 | `#aab1fa` |
| 130 | `#b6bcfa` |
| 140 | `#c5cbfa` |
| 150 | `#dce0fa` |
| 160 | `#e8ebfa` |

Tệp cũng chứa `brandOffice` và `brandTeamsV21` — chưa trích trong vòng này.

### Trong theme sáng, token màu thương hiệu ánh xạ: `colorBrandBackground = brand[80]`, `colorBrandBackgroundHover = brand[70]`, `colorBrandForeground1 = brand[80]`, `colorCompoundBrandStroke = brand[80]`.
- nguồn: https://unpkg.com/@fluentui/tokens/lib/alias/lightColor.js
- nhà xuất bản: Microsoft (gói npm `@fluentui/tokens`)
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: cao
- lớp: màu

Ghép với dải `brandWeb`: `colorBrandBackground` = **`#0f6cbd`**,
`colorBrandBackgroundHover` = **`#115ea3`**.

### Thang xám trung tính trong theme sáng ánh xạ như sau (tên token → bậc grey → hex).
- nguồn: https://unpkg.com/@fluentui/tokens/lib/alias/lightColor.js và https://unpkg.com/@fluentui/tokens/lib/global/colors.js
- nhà xuất bản: Microsoft (gói npm `@fluentui/tokens`)
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: cao
- lớp: màu

| token | bậc grey | hex |
| --- | --- | --- |
| `colorNeutralBackground1` | white | `#ffffff` |
| `colorNeutralBackground1Hover` | grey[96] | `#f5f5f5` |
| `colorNeutralBackground1Pressed` | grey[88] | `#e0e0e0` |
| `colorNeutralBackground2` | grey[98] | `#fafafa` |
| `colorNeutralBackground3` | grey[96] | `#f5f5f5` |
| `colorNeutralBackground4` | grey[94] | `#f0f0f0` |
| `colorNeutralBackground5` | grey[92] | `#ebebeb` |
| `colorNeutralBackground6` | grey[90] | `#e6e6e6` |
| `colorNeutralForeground1` | grey[14] | `#242424` |
| `colorNeutralForeground2` | grey[26] | `#424242` |
| `colorNeutralForeground3` | grey[38] | `#616161` |
| `colorNeutralForeground4` | grey[44] | `#707070` |
| `colorNeutralForegroundDisabled` | grey[74] | `#bdbdbd` |
| `colorNeutralStroke1` | grey[82] | `#d1d1d1` |
| `colorNeutralStroke2` | grey[88] | `#e0e0e0` |
| `colorNeutralStroke3` | grey[94] | `#f0f0f0` |
| `colorNeutralStrokeAccessible` | grey[38] | `#616161` |
| `colorSubtleBackground` | — | `transparent` |
| `colorTransparentStroke` | — | `transparent` |

Quy ước tên bậc grey của Fluent là **độ sáng phần trăm**: `grey[14]` = 14% sáng
(rất tối, dùng cho chữ), `grey[98]` = 98% sáng (gần trắng, dùng cho nền).

### Các dải màu ngữ nghĩa gốc (global) — red / green / darkOrange / yellow — mỗi dải có tint60…shade30.
- nguồn: https://unpkg.com/@fluentui/tokens/lib/global/colors.js
- nhà xuất bản: Microsoft (gói npm `@fluentui/tokens`)
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: cao
- lớp: màu

| shade | red | green | darkOrange | yellow |
| --- | --- | --- | --- | --- |
| tint60 | `#fdf6f6` | `#f1faf1` | `#fdf6f3` | `#fffef5` |
| tint40 | `#f1bbbc` | `#9fd89f` | `#f4bfab` | `#fef7b2` |
| tint30 | `#e37d80` | `#54b054` | `#e9835e` | `#feee66` |
| tint20 | `#dc5e62` | `#359b35` | `#e36537` | `#fdea3d` |
| tint10 | `#d7494c` | `#218c21` | `#de501c` | `#fde61e` |
| primary | `#d13438` | `#107c10` | `#da3b01` | `#fde300` |
| shade10 | `#bc2f32` | `#0e700e` | `#c43501` | `#e4cc00` |
| shade20 | `#9f282b` | `#0c5e0c` | `#a62d01` | `#c0ad00` |
| shade30 | `#751d1f` | `#094509` | `#7a2101` | `#817400` |

`marigold.primary` = `#eaa300` (cùng tệp, chưa trích đủ dải).

---

## 3. Nền màu nhạt (tinted surface) — token trạng thái

### Fluent 2 sinh toàn bộ token `colorStatus*` bằng một hàm reduce trên `statusColorMapping`, theo đúng một mẫu ánh xạ shade cố định cho mọi trạng thái.
- nguồn: https://unpkg.com/@fluentui/tokens/lib/alias/lightColorPalette.js
- nhà xuất bản: Microsoft (gói npm `@fluentui/tokens`)
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: cao
- lớp: màu

Mẫu sinh (thô, `<status>` ∈ Success / Warning / Danger / Severe …):

| token | shade lấy từ dải màu của trạng thái |
| --- | --- |
| `colorStatus<X>Background1` | `tint60` |
| `colorStatus<X>Background2` | `tint40` |
| `colorStatus<X>Background3` | `primary` |
| `colorStatus<X>Foreground1` | `shade10` |
| `colorStatus<X>Foreground2` | `shade30` |
| `colorStatus<X>Foreground3` | `primary` |
| `colorStatus<X>ForegroundInverted` | `tint30` |
| `colorStatus<X>Border1` | `tint40` |
| `colorStatus<X>Border2` | `primary` |
| `colorStatus<X>BorderActive` | `primary` |

**Cặp nền-nhạt / chữ-đậm mà Fluent dùng:** `Background1` (tint60) đi với
`Foreground1` (shade10), viền `Border1` (tint40). Đó là bộ ba "badge nhạt" chuẩn.

Hai ngoại lệ được ghi đè thủ công trong mã, không theo mẫu:

- `colorStatusWarningForeground1` = `shade20` (không phải `shade10`)
- `colorStatusWarningForeground3` = `shade20` (không phải `primary`)
- `colorStatusWarningBorder2` = `shade20` (không phải `primary`)
- `colorStatusDangerBackground3Hover` = `shade10`
- `colorStatusDangerBackground3Pressed` = `shade20`

Lý do hợp lý: vàng/cam ở `primary` không đủ tương phản cho chữ, nên Warning bị đẩy
tối thêm một bậc. ⚠ Đây là suy luận, không phải phát biểu trong nguồn.

### ⚠ Chưa kiểm chứng: `statusColorMapping` gán trạng thái nào vào dải màu nào.
Tệp `lib/global/statusColorMapping.js` trả 404 trên unpkg; tên tệp thật khác. Bộ
tóm tắt đọc `lightColorPalette.js` xác nhận có khoá `success`, `warning`, `danger`,
`severe` nhưng không đọc được vế phải. Giả thuyết mạnh (chưa chứng minh trong vòng
này): danger → `red`, success → `green`, severe → `darkOrange`, warning →
`yellow`/`marigold`. **Đừng chép vào token trước khi xác minh.**

Nếu giả thuyết đúng thì cặp badge sẽ là:

| trạng thái | Background1 | Foreground1 |
| --- | --- | --- |
| Success | `#f1faf1` | `#0e700e` |
| Danger | `#fdf6f6` | `#bc2f32` |
| Warning (nếu yellow) | `#fffef5` | `#c0ad00` |
| Severe (nếu darkOrange) | `#fdf6f3` | `#c43501` |

⚠ Toàn bộ bảng này là suy dẫn từ mẫu sinh + dải màu, **không** phải giá trị đọc
trực tiếp. Đánh dấu chưa kiểm chứng.

---

## 4. Elevation

### Fluent 2 có đúng 6 bậc bóng — shadow2 / 4 / 8 / 16 / 28 / 64 — chia hai dải: "low elevation" (2, 4, 8, 16) và "high elevation" (28, 64).
- nguồn: https://fluent2.microsoft.design/elevation
- nhà xuất bản: Microsoft — Fluent 2 Design System (trang tài liệu chính thức)
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: cao
- lớp: elevation

Công dụng theo trang chính thức:

| bậc | dùng cho |
| --- | --- |
| `shadow2` | ribbon, icon, hero button |
| `shadow4` | thẻ không viền, mục trong grid/list |
| `shadow8` | nút hành động nổi, thẻ nâng, app bar nâng, command bar, dropdown, tooltip |
| `shadow16` | callout, hover card |
| `shadow28` | bottom sheet, side navigation, tab bar nâng |
| `shadow64` | hộp thoại pop-up, panel |

### Mỗi bậc bóng là hai lớp: một bóng "ambient" không lệch + một bóng "key" lệch trục Y. Công thức box-shadow cụ thể của từng bậc như bảng dưới.
- nguồn: https://unpkg.com/@fluentui/tokens/lib/utils/shadows.js
- nhà xuất bản: Microsoft (gói npm `@fluentui/tokens`)
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: cao
- lớp: elevation

Bảng thô (công thức):

| token | box-shadow |
| --- | --- |
| `shadow2` | `0 0 2px ${ambient}, 0 1px 2px ${key}` |
| `shadow4` | `0 0 2px ${ambient}, 0 2px 4px ${key}` |
| `shadow8` | `0 0 2px ${ambient}, 0 4px 8px ${key}` |
| `shadow16` | `0 0 2px ${ambient}, 0 8px 16px ${key}` |
| `shadow28` | `0 0 8px ${ambient}, 0 14px 28px ${key}` |
| `shadow64` | `0 0 8px ${ambient}, 0 32px 64px ${key}` |

Quy luật: blur của lớp key = số trong tên token; offset Y = **một nửa** blur.
Lớp ambient giữ 2px cho dải thấp, tăng lên 8px từ `shadow28`.

### Màu bóng trong theme sáng: ambient `rgba(0,0,0,0.12)`, key `rgba(0,0,0,0.14)`; còn có biến thể Lighter và Darker.
- nguồn: https://unpkg.com/@fluentui/tokens/lib/alias/lightColor.js
- nhà xuất bản: Microsoft (gói npm `@fluentui/tokens`)
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: cao
- lớp: elevation

```
colorNeutralShadowAmbient        = rgba(0,0,0,0.12)
colorNeutralShadowKey            = rgba(0,0,0,0.14)
colorNeutralShadowAmbientLighter = rgba(0,0,0,0.06)
colorNeutralShadowKeyLighter     = rgba(0,0,0,0.07)
colorNeutralShadowAmbientDarker  = rgba(0,0,0,0.20)
colorNeutralShadowKeyDarker      = rgba(0,0,0,0.24)
colorBrandShadowAmbient          = rgba(0,0,0,0.30)
colorBrandShadowKey              = rgba(0,0,0,0.25)
```

Con số 14% mà trang `fluent2.microsoft.design/elevation` công bố cho lớp key khớp
đúng với `colorNeutralShadowKey = rgba(0,0,0,0.14)`. Hai nguồn nhất quán.

**Giá trị CSS dùng ngay được (theme sáng, neutral):**

| token | box-shadow đầy đủ |
| --- | --- |
| `shadow2` | `0 0 2px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.14)` |
| `shadow4` | `0 0 2px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.14)` |
| `shadow8` | `0 0 2px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.14)` |
| `shadow16` | `0 0 2px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.14)` |
| `shadow28` | `0 0 8px rgba(0,0,0,0.12), 0 14px 28px rgba(0,0,0,0.14)` |
| `shadow64` | `0 0 8px rgba(0,0,0,0.12), 0 32px 64px rgba(0,0,0,0.14)` |

### Khi nào dùng viền thay bóng: trang Elevation nêu rõ "Windows uses strokes instead of key shadows to outline an object."
- nguồn: https://fluent2.microsoft.design/elevation
- nhà xuất bản: Microsoft — Fluent 2 Design System
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: cao
- lớp: elevation

Tức là quy tắc viền-thay-bóng ở Fluent 2 là **quyết định theo nền tảng** (Windows
thay bóng key bằng stroke), không phải quy tắc theo loại thành phần. ⚠ Chưa tìm
được phát biểu nào của Microsoft nói "thẻ trong trang dùng viền, thẻ nổi dùng bóng".

---

## 5. Typography

### Họ chữ mặc định của Fluent 2 web là `'Segoe UI'` với chuỗi fallback đầy đủ — **không phải** Segoe UI Variable.
- nguồn: https://unpkg.com/@fluentui/tokens/lib/global/fonts.js
- nhà xuất bản: Microsoft (gói npm `@fluentui/tokens`)
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: cao
- lớp: chữ

```javascript
export const fontFamilies = {
    fontFamilyBase: "'Segoe UI', 'Segoe UI Web (West European)', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif",
    fontFamilyMonospace: "Consolas, 'Courier New', Courier, monospace",
    fontFamilyNumeric: "Bahnschrift, 'Segoe UI', 'Segoe UI Web (West European)', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif"
};
```

Đáng chú ý: có một họ **riêng cho số** — `fontFamilyNumeric`, đứng đầu là
**Bahnschrift**. Đây là thứ dễ bỏ sót khi viết lại lớp token.

### Thang cỡ chữ có 10 bậc: Base 100–600 (10/12/14/16/20/24px) rồi Hero 700–1000 (28/32/40/68px). Không có token tên `fontSizeHero` trơn.
- nguồn: https://unpkg.com/@fluentui/tokens/lib/global/fonts.js
- nhà xuất bản: Microsoft (gói npm `@fluentui/tokens`)
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: cao
- lớp: chữ

Bảng thô cỡ chữ ghép line-height (hai object trong cùng tệp, khớp theo hậu tố):

| bậc | fontSize | lineHeight | tỉ lệ |
| --- | --- | --- | --- |
| Base100 | 10px | 14px | 1.40 |
| Base200 | 12px | 16px | 1.33 |
| Base300 | 14px | 20px | 1.43 |
| Base400 | 16px | 22px | 1.375 |
| Base500 | 20px | 28px | 1.40 |
| Base600 | 24px | 32px | 1.33 |
| Hero700 | 28px | 36px | 1.29 |
| Hero800 | 32px | 40px | 1.25 |
| Hero900 | 40px | 52px | 1.30 |
| Hero1000 | 68px | 92px | 1.35 |

`fontSizeBase300` = 14px / `lineHeightBase300` = 20px là cặp body mặc định của
Fluent web.

### Có 4 cân nặng: Regular 400, Medium 500, Semibold 600, Bold 700.
- nguồn: https://unpkg.com/@fluentui/tokens/lib/global/fonts.js
- nhà xuất bản: Microsoft (gói npm `@fluentui/tokens`)
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: cao
- lớp: chữ

```javascript
export const fontWeights = {
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightSemibold: 600,
    fontWeightBold: 700
};
```

⚠ Chưa kiểm chứng trong vòng này: cân nặng nào gắn với vai trò nào. Gói có một
tệp `typographyStyles` (kiểu chữ dựng sẵn: caption1, body1, subtitle1, title1,
largeTitle, display…) ghép sẵn size + lineHeight + weight — chưa đọc.

---

## 6. Khoảng cách và mật độ

### Thang spacing có 11 bậc, dùng chung một bộ giá trị cho cả trục ngang và trục dọc: 0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32px.
- nguồn: https://unpkg.com/@fluentui/tokens/lib/global/spacings.js
- nhà xuất bản: Microsoft (gói npm `@fluentui/tokens`)
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: cao
- lớp: khoảng cách

Bảng thô, chép nguyên:

```javascript
// Intentionally not exported! Use horizontalSpacings and verticalSpacings instead.
const spacings = {
    none: '0',
    xxs: '2px',
    xs: '4px',
    sNudge: '6px',
    s: '8px',
    mNudge: '10px',
    m: '12px',
    l: '16px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px'
};
```

| token | px |
| --- | --- |
| `spacingHorizontalNone` / `spacingVerticalNone` | 0 |
| `…XXS` | 2px |
| `…XS` | 4px |
| `…SNudge` | 6px |
| `…S` | 8px |
| `…MNudge` | 10px |
| `…M` | 12px |
| `…L` | 16px |
| `…XL` | 20px |
| `…XXL` | 24px |
| `…XXXL` | 32px |

Hai điểm dễ sai khi chép sang hệ token khác:

1. Thang **không** phải bội số 4 thuần. Có hai bậc "nudge" lẻ: **6px** (`SNudge`)
   và **10px** (`MNudge`). Bỏ chúng đi là mất đúng những bậc mà nút và ô nhập của
   Fluent dùng để padding.
2. `spacingHorizontal*` và `spacingVertical*` là **hai bộ token riêng biệt** dù
   hiện đang cùng giá trị. Fluent cố tình không export object `spacings` gốc, để
   sau này còn tách được hai trục.

### ⚠ Chưa kiểm chứng: chiều cao hàng DataGrid theo mật độ.
Tệp `useTableRowStyles.styles.js` trên unpkg đã qua Griffel nên chỉ còn tên lớp,
không còn px. Trang `fluent2.microsoft.design/components/web/react/Table/usage`
trả 404. Một kết quả tìm kiếm nói FluentDataGrid (bản Blazor) mặc định **32px** và
có tham số `RowSize` với enum `DataGridRowSize` — nhưng đó là **bản Blazor, không
phải React**, và nguồn là issue tracker chứ không phải tài liệu. Không đủ để chép
vào token.
- nguồn tham chiếu yếu: https://github.com/microsoft/fluentui-blazor/issues/3071
- độ tin: thấp
- lớp: mật độ

---

## 7. Nguồn token tra được (dẫn lại được)

| Nội dung | URL |
| --- | --- |
| Bo góc | https://unpkg.com/@fluentui/tokens/lib/global/borderRadius.js |
| Khoảng cách | https://unpkg.com/@fluentui/tokens/lib/global/spacings.js |
| Chữ (family/size/lineHeight/weight) | https://unpkg.com/@fluentui/tokens/lib/global/fonts.js |
| Dải màu thương hiệu (brandWeb, brandTeams, brandOffice, brandTeamsV21) | https://unpkg.com/@fluentui/tokens/lib/global/brandColors.js |
| Toàn bộ dải màu global (grey + shared colors) | https://unpkg.com/@fluentui/tokens/lib/global/colors.js |
| Token màu alias theme sáng | https://unpkg.com/@fluentui/tokens/lib/alias/lightColor.js |
| Token màu trạng thái / palette theme sáng | https://unpkg.com/@fluentui/tokens/lib/alias/lightColorPalette.js |
| Công thức bóng | https://unpkg.com/@fluentui/tokens/lib/utils/shadows.js |
| Điểm export gộp | https://unpkg.com/@fluentui/tokens/lib/global/index.js |
| Trang Elevation chính thức | https://fluent2.microsoft.design/elevation |
| Trang Design tokens chính thức (chỉ khái niệm, không có số) | https://fluent2.microsoft.design/design-tokens |
| Kiến trúc token (kho nguồn) | https://github.com/microsoft/fluentui/blob/master/docs/architecture/design-tokens.md |

Kho nguồn tương ứng: `microsoft/fluentui`, thư mục `packages/tokens/src/` — cùng
cây tệp, chỉ khác `.ts` thay vì `.js`.

---

## Manh mối đáng đuổi tiếp

1. **`statusColorMapping`** — tệp thật nằm ở đâu trong `@fluentui/tokens`. Đã thử
   `lib/global/statusColorMapping.js` → 404. Thử tiếp: `lib/alias/mappedStatusColors.js`,
   `lib/types.js`, hoặc liệt kê thư mục qua `https://app.unpkg.com/@fluentui/tokens/files/lib`.
   Đây là mảnh còn thiếu để chốt hex của badge Success/Warning/Danger.
2. **`lib/global/typographyStyles.js`** — chứa các kiểu chữ dựng sẵn (caption1,
   body1, subtitle1, title1…) ghép sẵn size + weight + lineHeight. Đây mới là thứ
   trả lời "cân nặng nào dùng ở đâu", tốt hơn là suy từ bảng weight trần.
3. **Chiều cao hàng DataGrid React** — nguồn khả dĩ: tài liệu Storybook
   `react.fluentui.dev` (mục DataGrid → API/size), hoặc mã chưa biên dịch trong
   `packages/react-components/react-table/src/components/TableRow/useTableRowStyles.styles.ts`.
   Griffel làm mọi gói `@fluentui/react-*` trên unpkg vô dụng cho việc đọc px —
   phải lấy `.ts` gốc.
4. **Bậc radius theo thành phần** (nút / input / card / dialog / badge). Cùng vấn
   đề Griffel. Đường vòng: bản Figma UI kit của Fluent, hoặc trang
   `fluent2.microsoft.design/components/web/react/<Component>` (URL viết thường,
   không có hậu tố `/usage` — bản `/Table/usage` trả 404 nên mẫu URL đoán sai).
5. **`brandOffice` và `brandTeamsV21`** còn nằm trong `brandColors.js`, chưa trích.
6. **Theme tối** — mọi số trên đây là theme sáng. `lib/alias/darkColor.js` và
   `lib/alias/darkColorPalette.js` là cặp đối ứng.
7. **Power Platform / Power Apps** — vòng này không chạm tới. Đường vào:
   `learn.microsoft.com` mục "Power Apps modern controls" và
   "Fluent theming in canvas apps".

## Thứ tôi đã tìm mà không thấy

- **Toàn bộ `github.com` không truy cập được từ máy này** (proxy TLS chặn
  `github.com`, `raw.githubusercontent.com`, `api.github.com`). Mọi nỗ lực đọc
  trực tiếp `packages/tokens/src/*.ts` đều thất bại. Đã thay bằng unpkg — cùng mã,
  bản đã biên dịch. Người chạy vòng sau trên máy khác nên đọc thẳng `.ts` gốc.
- **`fluent2.microsoft.design/design-tokens` không công bố một con số nào.** Trang
  chỉ giải thích khái niệm global token vs alias token rồi trỏ sang Figma UI kit.
  Đừng trông vào nó để lấy giá trị.
- **Không có token tên `fontSizeHero` trơn.** Brief giả định có; thực tế là
  `fontSizeHero700/800/900/1000`.
- **Không có token `borderRadiusXXLarge`.** Sau `XLarge` là `2XLarge`, `3XLarge`…
  Đặt tên khác hẳn nhánh spacing (`XXL`, `XXXL`). Chép nhầm quy ước là lỗi im lặng.
- **Không tìm được phát biểu chính thức nào về "mật độ" (density) của DataGrid
  React** kèm px trong vòng này.
- **Không tìm được `colorStatusSuccess*` khai báo tường minh** — chúng được sinh
  bằng vòng lặp reduce, nên không grep ra được theo tên. Ai grep tên token trong
  mã nguồn Fluent mà không thấy thì đó là lý do.
