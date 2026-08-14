# Digest — token Fluent 2 đọc trực tiếp từ CSS đang render

**Phương pháp:** mở `fluent2.microsoft.design` trong Chrome và đọc `getComputedStyle(document.documentElement)`,
lọc các CSS custom property. Trang trả về **552 biến**. Đây là **giá trị thật đang render trên trang
chính chủ của Microsoft**, không phải con số chép lại từ bài viết — nên là nguồn sơ cấp, độ tin **cao**.

- nguồn: fluent2.microsoft.design (đọc computed CSS, không phải đọc văn bản trang)
- nhà xuất bản: Microsoft
- ngày xuất bản: không rõ — trang sống, giá trị là trạng thái tại thời điểm truy cập
- truy cập: 2026-08-14
- lưu ý: đọc trên **theme sáng mặc định** của trang. Theme tối có bộ giá trị khác.

---

### Thang bo góc Fluent 2 có sáu bậc, cao nhất chỉ 8px
```
borderRadiusNone     = 0
borderRadiusSmall    = 2px
borderRadiusMedium   = 4px
borderRadiusLarge    = 6px
borderRadiusXLarge   = 8px
borderRadiusCircular = 10000px
```
- độ tin: cao
- lớp: radius

**Điều đáng chú ý:** bậc lớn nhất của Fluent cho thành phần thường là **8px**. Không có 12px, 16px hay
24px. "Hiện đại" theo nghĩa Microsoft **không** có nghĩa là bo nhiều.

### Elevation có sáu bậc, tất cả đều là bóng kép
```
shadow2  = 0 0 2px rgba(0,0,0,.12), 0 1px 2px  rgba(0,0,0,.14)
shadow4  = 0 0 2px rgba(0,0,0,.12), 0 2px 4px  rgba(0,0,0,.14)
shadow8  = 0 0 2px rgba(0,0,0,.12), 0 4px 8px  rgba(0,0,0,.14)
shadow16 = 0 0 2px rgba(0,0,0,.12), 0 8px 16px rgba(0,0,0,.14)
shadow28 = 0 0 8px rgba(0,0,0,.12), 0 14px 28px rgba(0,0,0,.14)
shadow64 = 0 0 8px rgba(0,0,0,.12), 0 32px 64px rgba(0,0,0,.14)
```
Có thêm biến thể `shadow*Brand` dùng alpha đậm hơn (`.30`/`.25` thay vì `.12`/`.14`).
- độ tin: cao
- lớp: elevation

**Cấu trúc:** mỗi bậc là **hai lớp** — một lớp ambient không lệch (`0 0 Npx`) và một lớp key lệch xuống.
Alpha rất thấp: `.12` và `.14`. Đây là bóng để tách lớp, không phải bóng để trang trí.

### Thang nét viền bốn bậc
```
strokeWidthThin = 1px | Thick = 2px | Thicker = 3px | Thickest = 4px
```
- độ tin: cao
- lớp: elevation

### Chữ: Segoe UI, mười bậc cỡ, bốn cân nặng
```
fontFamilyBase      = "Segoe UI", "Segoe UI Web (West European)", -apple-system,
                      BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif
fontFamilyNumeric   = Bahnschrift, "Segoe UI", ... sans-serif
fontFamilyMonospace = Consolas, "Courier New", Courier, monospace

fontSizeBase100=10px  Base200=12px  Base300=14px  Base400=16px  Base500=20px  Base600=24px
fontSizeHero700=28px  Hero800=32px  Hero900=40px  Hero1000=68px

lineHeightBase100=14px  Base200=16px  Base300=20px  Base400=22px  Base500=28px  Base600=32px
lineHeightHero700=36px  Hero800=40px  Hero900=52px  Hero1000=92px

fontWeightRegular=400  Medium=500  Semibold=600  Bold=700
```
- độ tin: cao
- lớp: chữ

**Cặp cỡ/dòng đáng chép:** 12/16 · 14/20 · 16/22 · 20/28 · 24/32. Bậc thân bài mặc định là **14px/20px**.

### Khoảng cách: thang 2-4-6-8-10-12-16-20-24-32, có bậc "Nudge"
```
XXS=2px  XS=4px  SNudge=6px  S=8px  MNudge=10px  M=12px  L=16px  XL=20px  XXL=24px  XXXL=32px
```
(giống nhau cho `spacingHorizontal*` và `spacingVertical*`)
- độ tin: cao
- lớp: khoảng cách

**Điều đáng chú ý:** Fluent **không** snap về lưới 8px thuần. Nó có 6px và 10px, đặt tên là "Nudge" —
đúng là những giá trị lẻ mà một hệ dày cần.

### Màu thương hiệu: xanh dương, có thang nền nhạt riêng
```
colorBrandBackground         = #0f6cbd   (nút chính)
colorBrandBackgroundHover    = #115ea3
colorBrandBackgroundPressed  = #0c3b5e
colorBrandBackgroundSelected = #0f548c
colorBrandBackground2        = #ebf3fc   (nền nhạt — dùng cho vùng được chọn, badge)
colorBrandBackground2Hover   = #cfe4fa
colorBrandBackground2Pressed = #96c6fa
colorBrandStroke1            = #0f6cbd
colorBrandStroke2            = #b4d6fa
```
- độ tin: cao
- lớp: màu

### Thang trung tính: nền, chữ, viền tách bạch
```
Nền:  Background1=#ffffff  1Hover=#f5f5f5  2=#fafafa  3=#f5f5f5  4=#f0f0f0  5=#ebebeb  6=#e6e6e6
      Disabled=#f0f0f0 · SubtleBackground=transparent  Hover=#f5f5f5  Pressed=#e0e0e0
Chữ:  Foreground1=#242424  2=#424242  3=#616161  4=#707070  Disabled=#bdbdbd
Viền: Stroke1=#d1d1d1  Stroke2=#e0e0e0  Stroke3=#f0f0f0  StrokeAccessible=#616161  Subtle=#e0e0e0
```
- độ tin: cao
- lớp: màu

**Điều đáng chép:** chữ đậm nhất là **#242424**, không phải đen tuyền. Viền mặc định **#d1d1d1**.
Có riêng `StrokeAccessible=#616161` cho khi viền phải đạt 3:1.

### Màu ngữ nghĩa đi theo bộ ba: nền nhạt / viền / chữ đậm
```
Success  Background1=#f1faf1  Background2=#9fd89f  Background3=#107c10
         Border1=#9fd89f  Border2=#107c10  Foreground1=#0e700e  Fg2=#094509  Fg3=#107c10
Warning  Background1=#fff9f5  Background2=#fdcfb4  Background3=#f7630c
         Border1=#fdcfb4  Border2=#bc4b09  Foreground1=#bc4b09  Fg2=#8a3707  Fg3=#bc4b09
Danger   Background1=#fdf3f4  Background2=#eeacb2  Background3=#c50f1f
         Border1=#eeacb2  Border2=#c50f1f  Foreground1=#b10e1c  Fg2=#6e0811  Fg3=#c50f1f
```
- độ tin: cao
- lớp: màu

**Đây là mẫu badge trạng thái của Fluent, và nó là mẫu ba thành phần, không phải hai:**
nền `Background1` (rất nhạt, gần trắng) + viền `Border1` (đậm vừa) + chữ `Foreground1` (đậm).
Nền nhạt tới mức gần trắng chính là cách họ giữ tương phản chữ — chứ không phải chọn nền màu vừa
rồi cố tìm chữ đọc được trên nó.

### PHÁT HIỆN PHỦ ĐỊNH: Fluent 2 web không có token nào cho AI hay Copilot
Lọc toàn bộ 552 biến theo `gradient|copilot|ai|sparkle|magic` chỉ ra **hai** kết quả, và cả hai
thuộc thanh tìm kiếm Algolia DocSearch của trang tài liệu, **không phải Fluent**:
```
docsearch-key-gradient          = linear-gradient(-225deg,#d5dbe4,#f8f8f8)
docsearch-key-gradient-override = linear-gradient(-225deg, #d5dbe4, #f8f8f8)
```
Không có `colorBrandGradient`, không có token Copilot, không có bảng màu AI nào trong lớp token web
của Fluent 2 tại thời điểm truy cập.
- độ tin: cao (đây là phép đo trực tiếp trên toàn bộ tập biến, không phải "tôi không tìm thấy")
- lớp: mau-ai

**Ý nghĩa:** gradient Copilot mà người ta hay thấy **không nằm trong lớp token nền của Fluent**. Nó
là thứ được áp riêng ở tầng sản phẩm Copilot. Một hệ thiết kế doanh nghiệp có thể hoàn toàn không
cần token AI riêng — đây là bằng chứng cho điều đó, không phải suy đoán.

---

## Manh mối đáng đuổi tiếp

- Giá trị đọc được là **theme sáng**. Nếu sản phẩm cần theme tối thì phải đọc lại — Fluent định nghĩa
  bộ khác hẳn, đặc biệt là `Background`/`Stroke`.
- Chưa đọc được **chiều cao hàng DataGrid** của Fluent — nó không nằm trong lớp token toàn cục mà ở
  cấp component. Cần mở một story DataGrid thật.
- `colorPaletteBlue*`, `colorPalette<Màu>*` là một họ token riêng dùng cho badge nhiều màu — mới lấy
  được mảnh, chưa lấy đủ bảng.

## Thứ tôi đã tìm mà không thấy

- **Token AI/Copilot trong Fluent 2** — xem phát hiện phủ định ở trên. Đã lọc toàn bộ tập biến.
- **Chiều cao hàng bảng theo mức mật độ** — không có ở tầng token toàn cục.
- Đường qua Storybook (`storybooks.fluentui.dev`) **thất bại**: công cụ chặn mọi lệnh khi URL của tab
  chứa query string. Bốn lần thử liên tiếp bị chặn cho tới khi chuyển sang một URL không có query
  string. Đây là ràng buộc của công cụ, không phải của trang.
