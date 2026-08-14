---
title: 'Nghiên cứu kỹ thuật: ngôn ngữ thiết kế UI của Airtable, Fluent 2 và HubSpot Canvas'
type: 'technical'
topic: 'Ngôn ngữ thiết kế UI hiện đại của Airtable, Microsoft Fluent 2 / Power Platform và HubSpot Canvas'
decision: 'Lớp token của DESIGN.md lấy giá trị nào, khi đảo hướng thị giác từ "bản tin giấy" sang hướng ứng dụng hiện đại'
source: 'web fan-out bốn assistant, cộng hai phép đo trực tiếp của lead (computed CSS và bảng cmap font)'
status: complete
preset: 'standard'
validation: 'normal'
claims_verified: 10
claims_disputed: 2
claims_unverified: 0
created: '2026-08-14'
updated: '2026-08-14'
---

# Nghiên cứu kỹ thuật: ngôn ngữ thiết kế UI của Airtable, Fluent 2 và HubSpot Canvas

**Quyết định mà nghiên cứu này phục vụ:** lớp token của `DESIGN.md` lấy giá trị nào, khi đảo hướng
thị giác từ "bản tin giấy" (bo góc 0, không màu thương hiệu, không bóng, serif) sang hướng ứng dụng
hiện đại mà người dùng thử đã nêu đích danh.

**Ba mức chứng cứ** dùng nhất quán trong toàn báo cáo:

- **[Nguồn]** — nguồn nói và tra lại được, có link tới trang gốc hoặc giá trị đọc được trực tiếp.
- **[Đồng thuận]** — nhiều nguồn cùng nói nhưng chưa kiểm chứng độc lập được.
- **[Suy ra]** — tôi suy ra từ chứng cứ, không nguồn nào phát biểu thẳng.

---

## Tóm tắt

**Phản hồi "xấu, thiếu màu, không bo cong" là đúng, nhưng cách sửa hiển nhiên lại sai.** Không hệ nào
trong ba hệ được nêu làm hình mẫu là hệ bo góc lớn: theme Fluent 2 đang chạy phát ra tối đa **8px**
[1], Airtable mặc định **3px** và tối đa 6px [3]. Nâng bo góc lên 12–16px — thứ mà từ "hiện đại" hay
gợi ra — sẽ đưa sản phẩm ra **ngoài vùng hai hệ có token đo được**, chứ không tới gần chúng. (Con số
16px duy nhất trong báo cáo này thuộc về HubSpot [13], và đó là nguồn độ tin thấp gần chắc đo nhầm
website tiếp thị.)

Ba phát hiện dẫn tới câu trả lời:

1. **Cảm giác hiện đại đến từ màu và từ mẫu badge, không từ bán kính.** Fluent giải bài toán "nền màu
   nhạt mà chữ vẫn đọc được" bằng một mẫu **ba thành phần**: nền gần trắng + viền màu + chữ đậm
   (Success `#f1faf1` / `#9fd89f` / `#0e700e`) [1]. Đó là thứ chép được nguyên và giải luôn ràng buộc
   tương phản 4.5:1 của dự án.
2. **Ba hình mẫu không có câu trả lời cho ý tưởng thị giác trung tâm của sản phẩm.** Microsoft có
   token màu AI thật (`colorBrandFlair1–3`) nhưng ở gói tách hẳn, và dùng để *gọi* AI chứ không phải
   đánh dấu dữ liệu do AI điền [14][15]. Airtable giải ở **tầng dữ liệu**, không phải thị giác [5].
   HubSpot không có gì. Nên phần ranh giới máy/người không phải chỗ đi sao chép.
3. **Ba thứ đang bị chê oan.** Thang khoảng cách lẻ, mật độ dày, và thang ba mức bằng chữ thay vì phần
   trăm — cả ba đều **khớp** với hình mẫu hoặc với hướng dẫn chính thức [1][3][9][16], không cần đổi.

**Caveat lớn nhất:** hai trong ba hệ **không công bố token**. HubSpot Canvas là một trang giới thiệu
không có lấy một mã hex [6]; bảng số HubSpot duy nhất lấy được gần như chắc chắn là của website tiếp
thị, không phải CRM [13] — độ tin thấp, không chép. Airtable chỉ mở qua mã nguồn SDK extension [3],
và **không công bố chiều cao hàng grid** ở bất kỳ đâu [4]. Nên phần "mật độ như Airtable" của báo cáo
này dừng ở suy luận có cơ sở, không phải số đo.

---

## 1. Fluent 2 — hệ duy nhất công bố token đầy đủ

Đây là chiều có chứng cứ mạnh nhất của cả nghiên cứu, vì **hai đường độc lập cùng cho một kết quả**:
đọc mã nguồn gói npm `@fluentui/tokens` [2], và đọc `getComputedStyle` trên 552 CSS variable đang
render tại `fluent2.microsoft.design` [1]. Các giá trị dưới đây khớp nhau ở cả hai đường trừ một
chỗ, và chỗ lệch đó được nêu thẳng.

### Bo góc: cao nhất chỉ 8px [Nguồn]

```
borderRadiusNone 0 · Small 2px · Medium 4px · Large 6px · XLarge 8px · Circular 10000px
```

**Đây là phát hiện ngược trực giác nhất của cả nghiên cứu.** "Hiện đại" theo nghĩa Microsoft **không**
có nghĩa là bo nhiều. Bậc lớn nhất mà theme mặc định phát ra cho thành phần thường là 8px.

**Một chỗ hai nguồn lệch nhau, không được lấy trung bình:** mã nguồn npm [2] còn có tiếp
`2XLarge 12px · 3XLarge 16px · 4XLarge 24px · 5XLarge 32px · 6XLarge 40px`, nhưng theme đang render
trên trang chính chủ [1] **không phát ra** các bậc đó. Cách đọc đúng: các bậc lớn tồn tại trong gói
nhưng không thuộc theme mặc định — tức chúng có sẵn để dùng, chứ không phải thứ Fluent dùng.

### Elevation: sáu bậc, bóng kép, alpha rất thấp [Nguồn]

```
shadow2  = 0 0 2px rgba(0,0,0,.12), 0 1px  2px  rgba(0,0,0,.14)
shadow4  = 0 0 2px rgba(0,0,0,.12), 0 2px  4px  rgba(0,0,0,.14)
shadow8  = 0 0 2px rgba(0,0,0,.12), 0 4px  8px  rgba(0,0,0,.14)
shadow16 = 0 0 2px rgba(0,0,0,.12), 0 8px  16px rgba(0,0,0,.14)
shadow28 = 0 0 8px rgba(0,0,0,.12), 0 14px 28px rgba(0,0,0,.14)
shadow64 = 0 0 8px rgba(0,0,0,.12), 0 32px 64px rgba(0,0,0,.14)
```

Quy luật: mỗi bậc là **hai lớp** — một lớp ambient không lệch, một lớp key lệch xuống bằng nửa bán
kính mờ. Alpha `.12` và `.14` là rất nhạt. Đây là bóng để **tách lớp**, không phải bóng để trang trí.
Nét viền có thang riêng: `strokeWidth` 1 · 2 · 3 · 4px.

### Màu: xanh dương thương hiệu, và một mẫu badge ba thành phần [Nguồn]

```
Thương hiệu   Background  #0f6cbd   Hover #115ea3   Pressed #0c3b5e   Selected #0f548c
              Background2 #ebf3fc  (nền nhạt)  2Hover #cfe4fa   2Pressed #96c6fa
              Stroke1     #0f6cbd   Stroke2 #b4d6fa

Nền trung tính  1 #ffffff · 2 #fafafa · 3 #f5f5f5 · 4 #f0f0f0 · 5 #ebebeb · 6 #e6e6e6
Chữ             1 #242424 · 2 #424242 · 3 #616161 · 4 #707070 · Disabled #bdbdbd
Viền            1 #d1d1d1 · 2 #e0e0e0 · 3 #f0f0f0 · Accessible #616161
```

Hai chi tiết đáng chép nguyên: chữ đậm nhất là **#242424**, không phải đen tuyền; và có một token
viền riêng `StrokeAccessible #616161` dành cho khi viền phải tự nó đạt 3:1.

**Mẫu badge trạng thái của Fluent là ba thành phần, không phải hai** — và đây là câu trả lời trực
tiếp cho câu hỏi "nền màu nhạt thì chữ đọc thế nào":

| Trạng thái | Nền `Background1` | Viền `Border1` | Chữ `Foreground1` |
|---|---|---|---|
| Success | `#f1faf1` | `#9fd89f` | `#0e700e` |
| Warning | `#fff9f5` | `#fdcfb4` | `#bc4b09` |
| Danger | `#fdf3f4` | `#eeacb2` | `#b10e1c` |

Nền nhạt **tới mức gần trắng** chính là cơ chế giữ tương phản. Fluent không chọn một nền màu vừa rồi
cố tìm chữ đọc được trên nó — họ đẩy nền gần trắng và để **viền** làm việc nhận diện màu.

### Chữ và khoảng cách [Nguồn]

```
fontFamilyBase    "Segoe UI", "Segoe UI Web (West European)", -apple-system, BlinkMacSystemFont,
                  Roboto, "Helvetica Neue", sans-serif
fontFamilyNumeric Bahnschrift, "Segoe UI", … sans-serif      ← họ chữ riêng cho số
fontSize   10 · 12 · 14 · 16 · 20 · 24 px, rồi Hero 28 · 32 · 40 · 68
lineHeight 14 · 16 · 20 · 22 · 28 · 32 px
fontWeight 400 Regular · 500 Medium · 600 Semibold · 700 Bold
spacing    2 · 4 · 6 · 8 · 10 · 12 · 16 · 20 · 24 · 32 px
```

Bậc thân bài mặc định là **14px/20px**. Cặp cỡ-dòng đáng chép: 12/16 · 14/20 · 16/22 · 20/28 · 24/32.

**Fluent không snap về lưới 8px thuần.** Nó có 6px và 10px, đặt tên là `SNudge` và `MNudge` — đúng
là những giá trị lẻ mà một giao diện dày cần. [Suy ra] Điều này bác bỏ trực tiếp lập luận rằng một
thang khoảng cách "hiện đại" phải là bội của 4 hay 8.

Font là **`'Segoe UI'`, không phải Segoe UI Variable** [2] — điểm mà nhiều bài viết lại nói sai.

---

## 2. Airtable — không có design system công khai, nhưng có mã nguồn

**Airtable không xuất bản design system nào** [3]. Nguồn chính chủ duy nhất là gói npm
`@airtable/blocks@1.19.0` — bộ UI kit Airtable phát cho lập trình viên viết extension chạy *bên
trong* Airtable. Airtable tự giới thiệu đây là cùng bộ đội họ dùng nội bộ, nên độ gần cao, **nhưng
không đồng nhất với grid view của sản phẩm chính**. Mọi con số dưới đây phải đọc với cảnh báo đó.

### Bo góc còn chặt hơn Fluent [Nguồn]

```js
radii = { default: 3, large: 6, circle: 9999 }
```

**Ba bậc, và mặc định là 3px.** Hai hệ được người dùng nêu tên như hình mẫu "hiện đại" hoá ra có
thang bo góc gần như nhỏ nhất có thể mà vẫn không phải 0.

### Không có thang bóng dựng sẵn [Đồng thuận]

Theme của Airtable Blocks UI **không chứa** object `shadows` hay thang elevation nào. Thứ nó có là
`borderWidths { 1px, 2px }` và một thang phủ `darken1–4` / `lighten1–4` (alpha 0.05 · 0.1 · 0.25 ·
0.5). ⚠ Đây là phát biểu về **sự vắng mặt trong các file đã đọc**, và hệ style vẫn có một prop
`boxShadow` truyền tự do — tức lập trình viên đổ bóng được, chỉ là hệ không token hoá sẵn cho họ.
[Suy ra] Ngôn ngữ độ sâu của Airtable nghiêng về **kẻ 1px cộng lớp phủ**, không phải bóng đổ — cùng
kết luận với hướng "bản tin giấy" hiện tại, chỉ khác ở bo góc và màu.

### Bảng màu chip select: 10 họ × 5 sắc độ [Nguồn]

Đây là phần dùng được ngay nhất của Airtable, vì nó giải đúng bài toán "nhiều nhãn trạng thái, mỗi
nhãn một màu, chữ vẫn đọc được".

| Họ | Light2 (nền nhạt) | Light1 | Bright | Dark1 |
|---|---|---|---|---|
| blue | `#CFDFFF` | `#9CC7FF` | `#2D7FF9` | `#2750AE` |
| cyan | `#D0F0FD` | `#77D1F3` | `#18BFFF` | `#0B76B7` |
| gray | `#EEEEEE` | `#CCCCCC` | `#666666` | `#444444` |
| green | `#D1F7C4` | `#93E088` | `#20C933` | `#338A17` |
| orange | `#FEE2D5` | `#FFA981` | `#FF6F2C` | `#D74D26` |
| pink | `#FFDAF6` | `#F99DE2` | `#FF08C2` | `#B2158B` |
| purple | `#EDE2FE` | `#CDB0FF` | `#8B46FF` | `#6B1CB0` |
| red | `#FFDCE5` | `#FF9EB7` | `#F82B60` | `#BA1E45` |
| teal | `#C2F5E9` | `#72DDC3` | `#20D9D2` | `#06A09B` |
| yellow | `#FFEAB6` | `#FFD66E` | `#FCB400` | `#B87503` |

**Nhưng luật ghép nền-chữ của Airtable là một cái bẫy.** Nguyên văn trong mã: *"Light1 and Light2
colors use dark text. Bright, Dark1 and no suffix colors use light text."* Đó là luật **nhị phân
theo hậu tố tên màu, không tính tương phản**. Hệ quả: những cặp như `yellowBright #FCB400` hay
`tealBright #20D9D2` với chữ trắng là **ứng viên vi phạm rõ rệt**. ⚠ Nghiên cứu này **chưa tính số
tương phản cụ thể** cho từng cặp — điều đã xác lập là luật đó *không hề tính* tương phản, không phải
là đã đo và thấy nó trượt ngưỡng. Chép bảng màu thì được; **chép luật thì không**.

### Chữ và mật độ [Nguồn]

```
fontFamily  system stack, KHÔNG phải Inter, không cần webfont
fontSizes   9 · 11 · 13 · 15 · 17 · 19 · 21 · 23 · 27 · 35 px   ← toàn số lẻ
fontWeights chỉ 400 và 500. Không có 600, không có 700
space       0 · 4 · 8 · 16 · 32 · 64 · 128                      ← nhân đôi, không có 12/24/48
control     small 28px · default 32px · large 36px
textStyle   13px/16px (UI một dòng) · 13px/20px (đoạn văn)
```

Cỡ chữ làm việc của Airtable là **13px**, cân nặng nhấn mạnh là **500 chứ không phải bold**.

**Về ngưỡng mật độ ≥ 9 dòng: Airtable không công bố px cho bốn mức chiều cao hàng** (Short / Medium /
Tall / Extra Tall) ở bất kỳ nguồn chính chủ nào — không ở tài liệu support [4], không ở SDK, không ở
API. Đây là **một phát hiện, không phải một thất bại tra cứu**, và nó có nghĩa là không được mượn
con số nào. Số mật độ chính chủ duy nhất là chiều cao control **32px**. [Suy ra] 32px cũng là ước
lượng có cơ sở nhất cho hàng grid mức Short, vì nó khớp line-height 16px của chữ 13px cộng đệm 8px
trên dưới — nhưng đó là suy luận từ token control, **không phải giá trị Airtable công bố cho grid**.

---

## 3. HubSpot — chiều cho kết quả phủ định

**HubSpot Canvas không công bố token công khai** [6]. Trang `canvas.hubspot.com` là một trang giới
thiệu với năm nguyên tắc và ba bài Medium — **không một mã hex, không một giá trị px, không trang
foundations nào**. Tài liệu UI extensions cũng không nêu giá trị style, chỉ trỏ sang một Figma
Design Kit. Không tìm thấy gói npm token nào của HubSpot.

Bảng số duy nhất lấy được đến từ một site bên thứ ba cào tự động [13], và **gần như chắc chắn là
bảng màu của website tiếp thị `hubspot.com`, không phải giao diện CRM** — dấu hiệu: nền kem
`#f8f5ee`, font có chân, weight 300, hero 80px, nút đệm `16px 40px`. Đó là ngôn ngữ của một trang
bán hàng, không phải của một bảng dữ liệu.

Ghi lại để tham khảo, **độ tin thấp, không chép thẳng vào token**: cam chủ đạo `#ff4800`; nền canvas
`#f8f5ee`; viền `#cfcccb`; chữ `#1f1f1f` / `#9b9897`; success `#00823a`, warning `#eeb117`, error
`#d9002b` (**không có info**); radius chỉ hai bậc 8px và 16px; bước khoảng cách 4px.

**Không có bằng chứng nào** cho: elevation, nền nhạt của badge trạng thái, chiều cao hàng bảng
Contacts/Deals, chế độ mật độ, hay thang xám đầy đủ của HubSpot.

Cách duy nhất lấy được những số đó là **đo trực tiếp CRM bằng DevTools trên một tài khoản thật** —
việc nghiên cứu này không làm vì cần đăng nhập.

---

## 4. Ranh giới nội dung máy / nội dung người

Đây là chiều quan trọng nhất và là chiều duy nhất phải chạy hai vòng. Vòng 1 kết luận "không có cơ
chế nào thắng"; vòng 2 mở được gói mà vòng 1 bị chặn, và kết luận đổi.

### Microsoft có token màu AI thật — nhưng ở một gói tách hẳn [Nguồn]

Vòng 1 đo trên toàn bộ 552 CSS variable của Fluent 2 lõi và tìm thấy **rỗng** [1]. Vòng 2 mở được
`@fluentui-copilot/tokens@0.3.15` [14] và tìm thấy đầy đủ. **Cả hai phép đo đều đúng** — và chỗ
chúng gặp nhau chính là phát hiện: Microsoft cố ý **không** đưa màu AI vào lớp token nền.

```
colorBrandFlair1 = rgba(24,90,189,1)    xanh dương
colorBrandFlair2 = rgba(71,207,250,1)   cyan
colorBrandFlair3 = rgba(180,124,248,1)  tím
                 + ba bản …Transparent (cùng màu, alpha 0)

colorBrandMorseCode1–9 = #ad5ae1 #e9618d #fd9e5f #0e94e1 #57ab82
                         #c6c225 #669fc2 #6377e0 #9b80ec

shadowFlair1/2/3 · colorHCFlair* → từ khoá hệ thống Highlight / CanvasText
```

Ba điều đọc ra được, cả ba đều đi ngược giả thuyết ban đầu:

1. **Không có token gradient nào.** Microsoft chỉ phát hành *điểm dừng màu* cộng bản trong suốt để
   consumer tự dựng `linear-gradient`. "Viền gradient AI" không phải một token dùng lại được.
2. **Tím không phải màu AI.** Nó là điểm dừng thứ ba trong dải xanh dương → cyan → tím. Cùng chiều
   với một quan sát vòng 1 rằng gradient Copilot chạy lạnh → ấm chứ không phải tím-xanh — nhưng quan
   sát đó đến từ hai blog thương hiệu, **độ tin thấp**, nên nó chỉ là bằng chứng phụ họa, không phải
   chân đứng.
3. **Mọi token màu AI đều có đường thoát tương phản cao** (`colorHCFlair*` ánh xạ sang `Highlight` /
   `CanvasText`). Chính Microsoft cũng không cho phép màu là kênh thông tin duy nhất.

### Nhưng không tìm được component nào đánh dấu một *trường dữ liệu* là do AI điền [Đồng thuận]

`@fluentui-copilot/react-copilot@0.30.5` [15] có `AiGeneratedDisclaimer`, `Citation`,
`Reference`/`ReferenceList`, `SensitivityLabel`, `FeedbackButtons`. Tất cả đánh dấu ở mức **khối trả
lời hội thoại** — một bong bóng chat, một câu trả lời. Trong danh sách export không thấy gì đánh dấu
một ô dữ liệu trong bảng là do máy điền.

⚠ Đây là **"đã đọc danh sách export và không thấy"**, không phải "đã chứng minh không tồn tại": gói
có hơn 400 tên và nghiên cứu này không soi hết từng cái.

Airtable đi hướng khác hẳn: họ phân biệt AI/người **ở tầng dữ liệu, không phải tầng thị giác** [5].
Hệ theo dõi ô nào đã bị người sửa và cam kết *"sẽ không bao giờ tự động ghi đè bất kỳ ô nào đã được
người chỉnh sửa"*. Tài liệu chính thức về AI field **không mô tả icon, nền màu hay viền nào**.

HubSpot Breeze: **không tìm được bằng chứng nào** về nhãn, badge hay màu riêng cho nội dung AI sinh
trong CRM.

### Sparkle là mẫu phổ biến nhất, và nó đang thua [Đồng thuận]

Khảo sát tháng 9/2024 [7]: **17%** người dùng hiểu icon sparkle là "lưu / đánh dấu mục này", vì
**73%** gắn hình ngôi sao với bookmark. Sparkle còn bị dùng lẫn cho hiệu ứng hình ảnh, khuyến mãi và
nội dung mới, nên nó không mang nghĩa chuẩn hoá. Có phản đối rõ ràng ở tầng bình luận [8], nhưng đó
là báo chí và blog, không phải nghiên cứu — độ tin vừa.

### Mẫu "máy đề nghị, người quyết" đã có hình dạng ổn định [Nguồn]

**Ghost text**: gợi ý hiện **đúng tại chỗ** người sẽ gõ, chữ xám nhạt, chưa cam kết. Hợp đồng tương
tác đối xứng và rẻ: `Tab` nhận toàn bộ, `Ctrl+→` nhận **từng từ hoặc từng dòng**, `Esc` hoặc gõ tiếp
là bỏ [10]. Điểm đáng lấy: **chấp nhận từng phần là một trạng thái riêng**, không phải nhận/bỏ nhị
phân.

### Hai nguồn độc lập cùng chống lại việc in phần trăm [Nguồn]

Google PAIR nói thẳng rằng chỉ báo độ tin cậy bằng số *"are risky because they presume your users
have a good baseline understanding of probability"* [16]. Microsoft HAX Guideline 2 đặt nguyên tắc
**khớp mức chính xác của cách nói với hiệu năng thật** [9], và nêu bốn mẫu truyền đạt độ tin cậy —
trong đó 2A là **bằng ngôn ngữ** ("I'm not sure but…"), rồi mới tới 2B bằng con số.

HAX cũng chống **cả hai chiều**: over-trust (automation bias) lẫn under-trust (algorithm aversion).
Và nó nêu **visual uncertainty highlighting** — đánh dấu *phần nào trong nội dung* không chắc, chi
tiết hơn hẳn việc nhuộm cả khối.

### Hai hướng dẫn đã đọc đều không kê đơn hình thức thị giác [Nguồn]

**Microsoft HAX** [9] và **Google PAIR** [16] — hai bộ hướng dẫn AI công khai mà nghiên cứu này thực
sự đọc — đều nói ở **tầng nguyên tắc**: làm rõ hệ làm được gì, làm tốt tới đâu, vì sao nó làm vậy.
Không bộ nào quy định một màu, một viền hay một nền để đánh dấu nội dung AI.

⚠ **Apple HIG và IBM Design for AI thì chưa đọc** — hết ngân sách, không phải đã tra và thấy trống.
Nên phát biểu đúng là "hai bộ đã đọc không kê đơn", chứ **không** phải "không ai kê đơn". Muốn nâng
lên mức sau thì phải đọc thêm hai bộ đó.

---

## 5. Chữ và tiếng Việt

Đây là ràng buộc cứng của dự án, và nó **loại thẳng một ứng viên**.

Kiểm trực tiếp Google Fonts API [11] — đọc nhãn subset do chính Google phát ra, không phải đọc bài:

| Font | Có subset `vietnamese` |
|---|---|
| Inter · Roboto · Noto Sans · IBM Plex Sans · Public Sans · Be Vietnam Pro · Nunito Sans | ✔ |
| **Lato** | ✘ chỉ có `latin` + `latin-ext` |

**`latin-ext` không đủ cho tiếng Việt.** Các chữ chồng dấu (ế ộ ữ ẳ ợ ẵ) nằm ở khối Latin Extended
Additional `U+1EA0–U+1EF9`, mà Google tách thành subset `vietnamese` riêng. Một font chỉ có
`latin` + `latin-ext` sẽ **rơi xuống font dự phòng đúng ở những chữ có dấu chồng dấu** — chính là
lỗi đã gặp với Georgia.

Vòng 1 để lại một lỗ hổng: Segoe UI Variable không kiểm được qua Google Fonts. Tôi lấp bằng cách
**đọc thẳng bảng `cmap` của file font trên máy** [12]:

```
Segoe UI Variable   90/90 glyph khối U+1EA0–U+1EF9   ✔
Segoe UI            90/90                            ✔
Segoe UI Semibold   90/90                            ✔
```

Nhưng phép đo này **không** chứng minh người dùng sẽ thấy nó: Segoe UI là font hệ điều hành Windows.
Trên macOS, Linux hay Android nó không tồn tại và trình duyệt rơi xuống font kế tiếp. Kết luận đúng
là **chuỗi dự phòng phải tự nó an toàn với tiếng Việt**, hoặc phải nạp webfont.

---

## 6. Điều chỉ thấy được khi ghép ba hệ lại

**Bo góc không phải chỗ khác biệt.** Fluent tối đa 8px, Airtable mặc định 3px và tối đa 6px, HubSpot
(độ tin thấp) 8px và 16px. [Suy ra] Cảm giác "hiện đại" mà người dùng mô tả **không đến từ bán kính
bo góc** — nó đến từ màu và từ mẫu badge, như phần tóm tắt đã nêu.

**Cả ba đều dày, không thoáng.** Airtable làm việc ở chữ 13px và nhịp dọc 32px; Fluent ở 14px/20px
với thang khoảng cách có bậc lẻ 6px và 10px. [Suy ra] Ngưỡng mật độ ≥ 9 dòng của dự án **không mâu
thuẫn** với ba hình mẫu này — nó nằm đúng trong vùng chúng hoạt động.

**Hai hệ có token đầy đủ đều dùng thang khoảng cách có giá trị lẻ**, và đều cố ý. Fluent gọi
6px/10px là "Nudge"; Airtable dùng thang cỡ chữ toàn số lẻ 9/11/13/15/17. [Suy ra] Quy tắc "không
snap về lưới 8px" trong `DESIGN.md` hiện tại **không phải chỗ sai** và không cần đổi.

**Chỗ ba hệ khác hẳn hướng hiện tại chỉ có hai:** màu, và bo góc từ 0 lên 3–8px. Không phải bóng
(Airtable không có bóng, Fluent dùng alpha .12), không phải mật độ, không phải thang khoảng cách.
[Suy ra] Phạm vi sửa hẹp hơn nhiều so với "đảo hướng thị giác".

**Ranh giới máy/người không phải chỗ ba hệ này giỏi hơn.** Chỗ Microsoft có token AI thì đó là màu
để *gọi* AI, không phải để *đánh dấu dữ liệu do AI điền* [14][15]; chỗ Airtable giải bài toán thì họ
giải ở tầng dữ liệu chứ không phải thị giác [5]; HubSpot không có gì. [Suy ra] Ba hình mẫu mà người
dùng nêu tên **không có câu trả lời sẵn** cho ý tưởng thị giác trung tâm của sản phẩm. Nên phần đó
không phải chỗ đi sao chép — nó chỉ cần thôi ồn ào, không cần đổi bản chất.

**Nguyên tắc thì có, và nó xác nhận một quyết định đã có sẵn.** Cả PAIR [16] lẫn HAX [9] đều chống
việc in số phần trăm và ưu tiên diễn đạt bằng ngôn ngữ. Thang ba mức bằng chữ và ký hiệu (Chắc · Có
thể · Đoán) mà `DESIGN.md` hiện đã có **đúng với cả hai nguồn** — đây là chỗ hướng hiện tại đi trước
chứ không đi sau ba hình mẫu.

---

## 7. Nguồn

| # | Hỗ trợ điều gì | Nhà xuất bản | Ngày | Truy cập | Độ tin |
|---|---|---|---|---|---|
| [1] | Toàn bộ token Fluent 2 đọc từ CSS đang render — radius, shadow, màu, chữ, spacing; và phát hiện phủ định về token AI | [fluent2.microsoft.design](https://fluent2.microsoft.design) (Microsoft) | trang sống | 2026-08-14 | cao |
| [2] | Token Fluent 2 đọc từ mã nguồn gói npm — đường xác nhận thứ hai, cộng các bậc radius lớn | [@fluentui/tokens](https://unpkg.com/@fluentui/tokens) (Microsoft) | không rõ | 2026-08-14 | cao |
| [3] | Toàn bộ token Airtable — radii, màu chip, luật nền-chữ, chữ, control size | [@airtable/blocks@1.19.0](https://unpkg.com/@airtable/blocks@1.19.0) (Airtable) | v1.19.0 | 2026-08-14 | cao |
| [4] | Bốn mức chiều cao hàng grid, và việc px không được công bố | [support.airtable.com](https://support.airtable.com/docs/airtable-grid-view) (Airtable) | không rõ | 2026-08-14 | cao |
| [5] | Airtable phân biệt AI/người ở tầng dữ liệu, không phải tầng thị giác | [support.airtable.com](https://support.airtable.com/articles/8052242094-using-airtable-ai-in-fields) (Airtable) | không rõ | 2026-08-14 | cao |
| [6] | Canvas không công bố token công khai | [canvas.hubspot.com](https://canvas.hubspot.com) (HubSpot) | không rõ | 2026-08-14 | cao |
| [7] | 17% hiểu sparkle là "lưu"; 73% gắn ngôi sao với bookmark | [Nielsen Norman Group](https://www.nngroup.com/articles/ai-sparkles-icon-problem/) | khảo sát 2024-09 | 2026-08-14 | vừa |
| [8] | Phản đối quy ước sparkle | [CSS-Tricks](https://css-tricks.com/the-proliferation-and-problem-of-the-sparkles-icon/) · [Slate](https://slate.com/technology/2025/12/artificial-intelligence-tools-icon-google-gemini-chatgpt-design.html) | Slate 2025-12 | 2026-08-14 | vừa |
| [9] | HAX Guideline 2: chống cả over-trust lẫn under-trust; bốn mẫu truyền đạt độ tin cậy; visual uncertainty highlighting | [Microsoft HAX Toolkit](https://www.microsoft.com/en-us/haxtoolkit/guideline/make-clear-how-well-the-system-can-do-what-it-can-do/) | gốc 2019 | 2026-08-14 | cao |
| [10] | Ghost text: hợp đồng Tab nhận / Esc bỏ / nhận từng từ | [VS Code docs](https://code.visualstudio.com/docs/editing/ai-powered-suggestions) (Microsoft) | không rõ | 2026-08-14 | vừa |
| [11] | Subset `vietnamese` của từng font — Lato thiếu | [Google Fonts API](https://fonts.googleapis.com/css2) | dữ liệu tại thời điểm truy cập | 2026-08-14 | cao |
| [12] | Segoe UI và Segoe UI Variable đủ 90/90 glyph tiếng Việt | `C:\Windows\Fonts` (Microsoft) — đọc bảng cmap | theo bản Windows | 2026-08-14 | cao |
| [13] | Bảng màu HubSpot — ⚠ gần chắc là website tiếp thị, không phải CRM | shadcn.io / DesignMD (bên thứ ba, cào tự động) | không rõ | 2026-08-14 | **thấp** |
| [14] | Token màu AI thật của Microsoft: `colorBrandFlair1–3`, `colorBrandMorseCode1–9`, `colorHCFlair*`; và việc không có token gradient | [@fluentui-copilot/tokens@0.3.15](https://unpkg.com/@fluentui-copilot/tokens) (Microsoft) | v0.3.15 | 2026-08-14 | cao |
| [15] | `AiGeneratedDisclaimer`, `Citation`, `SensitivityLabel` — và việc không có gì đánh dấu trường dữ liệu | [@fluentui-copilot/react-copilot@0.30.5](https://unpkg.com/@fluentui-copilot/react-copilot) (Microsoft) | v0.30.5 | 2026-08-14 | cao |
| [16] | PAIR chống chỉ báo độ tin cậy bằng số phần trăm | [People + AI Guidebook](https://pair.withgoogle.com/guidebook) (Google) | không rõ | 2026-08-14 | cao |

---

## 8. Khuyến nghị

Mỗi khuyến nghị ghi rõ nó dựa trên chứng cứ mức nào. Nơi tiêu thụ là `DESIGN.md` và `EXPERIENCE.md`
của bước UX.

**R1 — Đổi bo góc từ 0 lên 4px cho bề mặt thường, 8px cho hộp thoại. Không hơn.**
Dựa trên chứng cứ **cao**, hai nguồn độc lập [1][2] cộng một nguồn thứ ba cùng chiều [3]. Đây là
khuyến nghị quan trọng nhất vì nó **ngược với thứ dễ làm**: phản hồi "bo cong như hệ hiện đại" dễ
dẫn tới 12–16px, mà cả ba hình mẫu đều không ở đó. Bo 4px đủ để mất hẳn cảm giác "bản in", và vẫn
đứng trong vùng cả ba hệ hoạt động.

**R2 — Lấy nguyên mẫu badge ba thành phần của Fluent cho mọi nhãn trạng thái.**
Dựa trên chứng cứ **cao** [1]. Nền gần trắng + viền màu + chữ đậm. Đây là lời giải trực tiếp cho
ràng buộc tương phản ≥ 4.5:1 mà không phải hy sinh màu. **Đừng** lấy luật nền-chữ nhị phân của
Airtable [3] — nó không tính tương phản và tự nó tạo ra vi phạm.

**R3 — Thêm màu, nhưng thêm ở nhãn trạng thái, không ở nền lớn.**
Dựa trên chứng cứ **cao** cho bảng màu [1][3], **suy ra** cho vị trí đặt. Bảng 50 màu của Airtable
dùng được ngay cho các nhãn nhiều giá trị (giai đoạn cơ hội, nguồn tin); ba bộ ngữ nghĩa của Fluent
dùng cho trạng thái hệ thống. Cả ba hệ đều giữ nền ứng dụng ở xám rất nhạt — màu nằm ở vật thể nhỏ.

**R4 — Giữ nguyên thang khoảng cách lẻ, và giữ ngưỡng mật độ ≥ 9 dòng.**
Nửa đầu dựa trên chứng cứ **cao** [1][3]: cả Fluent (6px, 10px "Nudge") lẫn Airtable (thang cỡ chữ
toàn số lẻ) đều cố ý không snap lưới, nên quy tắc hiện có trong `DESIGN.md` không phải chỗ sai.
Nửa sau — rằng ngưỡng ≥ 9 dòng nằm trong vùng ba hình mẫu hoạt động — là **[Suy ra]**, vì Airtable
không công bố chiều cao hàng grid [4]. Giữ ngưỡng thì được; đừng viện ba hình mẫu ra để biện minh
cho nó.

**R5 — Bỏ dải nền tối tràn ngang; giữ nguyên ý tưởng ranh giới máy/người.**
Dựa trên **suy ra**, có chống lưng bởi chứng cứ về sự vắng mặt [5][14][15]. Không hệ nào đánh dấu
dữ liệu do máy điền bằng cách nhuộm cả khối; Microsoft dùng màu AI để *gọi* AI, Airtable giải ở tầng
dữ liệu. Đề nghị thay bốn tín hiệu chồng nhau hiện tại bằng **viền trái + ký hiệu + một nhãn nhỏ**,
giữ nền giống nhau. Đây là khuyến nghị **yếu nhất** trong danh sách vì nó suy ra từ việc không ai
làm, chứ không từ việc ai đó làm khác.

**R6 — Giữ thang ba mức bằng chữ và ký hiệu; đừng bao giờ đổi sang phần trăm.**
Dựa trên chứng cứ **cao**, hai nguồn độc lập [9][16]. Đây là chỗ thiết kế hiện tại đã đúng trước khi
nghiên cứu bắt đầu.

**R7 — Chuỗi font phải tự nó an toàn với tiếng Việt; loại Lato.**
Dựa trên chứng cứ **cao**, hai phép đo trực tiếp [11][12]. Segoe UI an toàn nhưng chỉ có trên
Windows. Nếu cần kết quả giống nhau trên mọi máy thì nạp webfont, và ứng viên an toàn là Inter,
Be Vietnam Pro, IBM Plex Sans, Public Sans, Noto Sans.

---

## 9. Câu hỏi nghiên cứu chưa trả lời được

| Câu hỏi | Vì sao chưa xong | Cần gì để xong |
|---|---|---|
| Chiều cao hàng thật của Airtable grid ở bốn mức | Airtable **không công bố** ở bất kỳ nguồn chính chủ nào [4] | Mở một base ở 1440×900 và đo bằng DevTools — cần đăng nhập |
| Token thật của HubSpot CRM (elevation, badge, row height) | Canvas không công bố [6]; số duy nhất lấy được là của website tiếp thị [13] | Đo trực tiếp CRM bằng DevTools — cần tài khoản |
| Tên mẫu trong HAX Design Library, nhánh "khi AI sai" | Trang render bằng JavaScript, hai lần fetch thất bại | Trình duyệt thật, hoặc bài gốc Amershi et al. CHI 2019 |
| Radius và chiều cao thật của chip select Airtable | Chưa mở `choice_token.js` trong gói SDK | Một lần fetch nữa vào unpkg |
| Bo góc theo từng component của Fluent | Griffel nén hết px thành tên lớp, không đọc ngược được | Dựng thử một component và đo computed style |
| Tranh luận "màu tím = AI" có nguồn gốc từ đâu | Chỉ tìm được tầng blog; giả thuyết Tailwind `bg-indigo-500` chưa truy nguồn | Đào sâu hơn, giá trị thấp so với công sức |

---

## 10. Cái gì cũ trước

| Lớp claim | Cửa sổ tươi | Phải soát lại trước |
|---|---|---|
| Token và phiên bản gói (`@fluentui/tokens`, `@airtable/blocks`, `@fluentui-copilot/*`) | 1 tháng | **2026-09-14** |
| Mọi thứ thuộc AI — token Copilot, quy ước đánh dấu, tranh luận sparkle | 3 tháng | 2026-11-14 |
| Sức khoẻ hệ sinh thái, việc Canvas có công bố token hay không | 6 tháng | 2027-02-14 |
| Mẫu thiết kế nền (badge ba thành phần, ghost text, thang bo góc) | 2 năm | 2028-08-14 |

**Mốc sớm nhất là 2026-09-14**, và nó chỉ chạm các số phiên bản. Với một kỳ thi ngày 2026-08-15,
toàn bộ báo cáo này còn tươi.

Riêng claim `[7]` (khảo sát sparkle, 2024-09) **đã quá cửa sổ 3 tháng của lớp AI** — nó được giữ lại
với trạng thái `disputed` và đã khai ngày trong bảng nguồn.
