---
title: "Prompt giao cho Claude Design — Why Now"
status: ready
created: 2026-08-14
updated: 2026-08-14
producer: Claude Design
---

# Prompt giao cho Claude Design

## Mang gì lên Claude Design

**Dán:** trọn phần dưới vạch ngang. Đây là prompt, tự chứa — không cần đọc gì thêm để hiểu.

**Đính kèm bốn thứ, theo đúng thứ tự này:**

| # | Tệp | Vì sao cần |
|---|---|---|
| 1 | `DESIGN.md` | **Lớp token, đã chốt.** Toàn bộ giá trị lấy từ Microsoft Fluent 2 — bảng đối chiếu tên Fluent nằm ngay đầu tệp |
| 2 | `EXPERIENCE.md` | **Quan trọng nhất cho luồng.** 19 nhánh ngoại lệ · mẫu trạng thái bốn cột · bảy ngưỡng trải nghiệm |
| 3 | `../../prds/prd-crm-hackathon-2026-08-14/prd.md` | Bảng chuyển tiếp `§5.1` · ma trận vai `§6` · 17 luật nghiệp vụ `§7` — ba thứ này **là đặc tả tương tác** |
| 4 | `../../research/technical-ngon-ngu-thiet-ke-ui-airtable-fluent-hub-2026-08-14/research.md` | **Vì sao** lớp token là Fluent chứ không phải thứ tự chế. Đọc mục Tóm tắt và §8 là đủ |
| 5 | `prototype/wn-data.js` | **Bộ dữ liệu demo, dùng lại được nguyên.** 15 Account, 8 Opportunity đang mở, và nó **cố tình mang sẵn mười ca ngoại lệ** mà `EXPERIENCE.md` đòi. Tệp này không chứa một mã màu hay tên font nào nên **không dính lớp token cũ** |

> ⚠ **Một lỗi đã biết trong `wn-data.js`:** `DISMISS_REASONS` trong đó có năm giá trị do công cụ tự
> suy ra, **khác** năm lý do bỏ đã chốt ở `0.1.7` của Mục 0 (`thong_tin_sai` · `khong_lien_quan` ·
> `da_cu` · `hieu_sai_ngu_canh` · `khac`). Dùng danh sách của `0.1.7`, đừng dùng của tệp.

**Ba tệp `.working/direction-*.html` và toàn bộ `prototype/*.html` nay đã lỗi thời** — chúng dựng
theo lớp token của bản trước, và bản trước đã bị thay. Đừng đính kèm, đừng lấy màu từ đó.

**Không mang lên:** bất kỳ nội dung nguyên văn nào của BABOK® Guide — bản gốc ghi *"Not for
Distribution or Resale"*. Mọi bảng phương pháp trong prompt này là **diễn giải của đội**, không
phải trích dẫn, nên gửi đi được.

**Kết quả mang về** đặt thẳng vào thư mục này, giữ nguyên định dạng công cụ sinh ra. Sau đó chạy
`bmad-ux` chế độ **Update** để rút `DESIGN.md` và cập nhật `EXPERIENCE.md`.

**Hai sườn thắng mọi mock khi có mâu thuẫn** — mock minh hoạ, sườn là hợp đồng.

---

## Sản phẩm

**Why Now** — CRM cho đội Sales B2B ngành ITO (thuê ngoài làm phần mềm) của một công ty Việt Nam.
Có một lớp AI đọc nguồn công khai về khách hàng tiềm năng, và **tự ghi những gì nó đủ chắc**, chỉ
đẩy lại cho người phần thật sự cần phán đoán.

Luận đề, và mọi quyết định thị giác phải phục vụ nó:

> Thứ khan hiếm duy nhất là **chú ý của con người**. Một giao diện bày ra nhiều thứ để người phải
> quyết thì đã phản bội sản phẩm, dù nó đẹp.

Hệ quả trực tiếp: **thứ máy đã quyết xong phải trông khác hẳn thứ đang chờ người quyết.** Đó là
ranh giới thị giác quan trọng nhất trong cả sản phẩm.

## Người dùng

| Vai | Là ai | Mỗi ngày cần gì |
|---|---|---|
| **Sales / BD** *(chính)* | Theo đuổi khách doanh nghiệp; hiện mất 1–2 giờ mỗi sáng rà tin bằng tay | Mở lên là biết **hôm nay chạm ai, vì sao là hôm nay** |
| **Quản trị** *(phụ)* | Giữ phanh, nhìn sức khoẻ phần AI | Biết **máy đang đúng bao nhiêu phần**, có ai đang duyệt mù không |

Người chấm cuối cùng là **sáu người Sales thật**, năm trong số đó làm thị trường Nhật. Họ chấm với
tư cách người dùng hằng ngày và đã dùng CRM chuyên nghiệp nhiều năm. Họ sẽ so sản phẩm này với
Excel — nên **một màn hình quá thoáng sẽ thua**.

## Lớp token đã chốt — Microsoft Fluent 2

**Đội không tự phát minh lớp token.** Mọi giá trị bo góc, bóng, cỡ chữ, khoảng cách, xám trung tính
và màu ngữ nghĩa lấy **nguyên từ Microsoft Fluent 2**, đọc trực tiếp từ 552 CSS variable đang render
trên trang chính chủ và đối chiếu với mã nguồn `@fluentui/tokens`. Đừng đề xuất bảng màu khác; hãy
dùng đúng bảng này.

**Lấy token và mẫu, không lấy thư viện.** Sản phẩm không phụ thuộc `@fluentui/react-components` —
dựng lại bằng CSS thuần. Mỗi token dưới đây có tên Fluent tương ứng, xem bảng đối chiếu ở đầu
`DESIGN.md`.

```
Giấy          #ffffff   nhạt #fafafa    Nền ứng dụng #f5f5f5  #f0f0f0
Mực           #242424 → #424242 → #616161 → #707070   tắt #bdbdbd
Kẻ            #e0e0e0   đậm #d1d1d1     khi viền phải tự đạt 3:1  #616161
Thương hiệu   #0f6cbd   hover #115ea3   pressed #0c3b5e

MÁY ĐÃ QUYẾT  nền #ebf3fc   ray trái #0f6cbd 3px   (bo 4px, ký hiệu bánh răng)

Mức chắc chắn — CHỈ MỘT bộ màu, không còn hai biến thể:
  Chắc     nền #f1faf1   viền #9fd89f   chữ #0e700e
  Có thể   nền #fff9f5   viền #fdcfb4   chữ #bc4b09
  Đoán     nền #fafafa   viền #d1d1d1   chữ #616161
Cờ / quá hạn nền #fdf3f4   viền #eeacb2   chữ #b10e1c
Suggestion   dùng chung bộ "Có thể"
Đề nghị chưa nhận (ghost)  mực #707070, nền trong suốt
```

**Mọi nhãn màu dùng MẪU BA THÀNH PHẦN: nền gần trắng + viền màu + chữ đậm cùng họ.** Đây là quy tắc
quan trọng nhất — nền đẩy gần trắng để chữ luôn đọc được, **viền** mới làm việc nhận diện màu. Không
bao giờ chọn một nền màu vừa rồi đi tìm chữ đọc được trên nó.

**Bo góc: 4px mặc định · 6px thẻ · 8px hộp thoại. 8px là TRẦN, không phải sàn.** Đừng bo 12px hay
16px — cả Fluent (tối đa 8px) lẫn Airtable (mặc định 3px) đều không đi xa hơn, và đi xa hơn là ra
ngoài vùng hai hệ đó hoạt động.

**Bóng: rất ít, rất nhạt.** Thẻ và dòng việc **không có bóng**, chỉ viền 1px. Bóng chỉ dành cho thứ
nổi lên trên dòng chảy trang: menu `0 0 2px rgba(0,0,0,.12), 0 2px 4px rgba(0,0,0,.14)`; hộp thoại
`0 0 2px rgba(0,0,0,.12), 0 8px 16px rgba(0,0,0,.14)`.

**Khoảng cách: 2 · 4 · 6 · 8 · 10 · 12 · 16 · 20 · 24 · 32.** Hai bậc lẻ **6px và 10px là cố ý** —
Fluent gọi chúng là "Nudge". Đừng snap về lưới 4/8px.

### Cơ chế phân biệt máy-quyết với người-quyết

**Ba tín hiệu chồng nhau. Giữ cả ba, đừng thay bằng cơ chế khác:**

- Dòng **do hệ thống đặt**: nền `#ebf3fc`, ray trái `#0f6cbd` 3px, ký hiệu **bánh răng** dẫn đầu,
  câu 16px cân nặng **600**
- Dòng **do người gõ**: nền trắng, kẻ tóc dưới `#e0e0e0`, ký hiệu **bút** dẫn đầu, câu 16px cân
  nặng **400**

Ba tín hiệu là có chủ đích: bỏ một cái thì hai cái còn lại vẫn giữ được ranh giới.

> **Bản trước dùng một dải nền tối tràn ngang cho dòng máy. Đã bỏ.** Nghiên cứu ba hệ mà người dùng
> nêu tên cho thấy **không hệ nào nhuộm cả khối** để đánh dấu nội dung máy: Microsoft có token màu AI
> thật nhưng dùng để *gọi* AI, còn Airtable phân biệt ở **tầng dữ liệu** — máy không bao giờ ghi đè ô
> người đã sửa. Dải nền tối ồn hơn mọi thứ đang có trên thị trường, và đó chính là điều người dùng
> thử phản ứng.

**Không dùng icon sparkle.** Quyết định có bằng chứng: khảo sát cho thấy 17% người dùng hiểu icon
sparkle là "lưu / đánh dấu", vì 73% gắn hình ngôi sao với bookmark.

**Không dùng gradient, và không dùng tím làm màu AI.** Microsoft cũng không phát hành token gradient
nào — họ chỉ phát hành điểm dừng màu; và tím ở họ chỉ là điểm dừng thứ ba trong dải xanh dương →
cyan → tím.

### Chữ

**Một họ chữ, không hai.** Serif đã bỏ.

```
"Segoe UI", "Segoe UI Web (West European)", -apple-system, BlinkMacSystemFont,
Roboto, "Helvetica Neue", sans-serif
```

Thang cỡ/dòng của Fluent: `10/14 · 12/16 · 14/20 · 16/22 · 20/28 · 24/32`. Thân bài **14px/20px**,
câu Next step **16px/22px**. Cân nặng 400 · 500 · 600. Số luôn `tabular-nums`.

> **Ràng buộc tiếng Việt — đã kiểm bằng phép đo, không phải bằng niềm tin.** Segoe UI có đủ 90/90
> glyph khối `U+1EA0–U+1EF9`, kiểm bằng cách đọc bảng `cmap` của chính file font. Nếu đề xuất webfont
> để đồng nhất trên mọi máy, chỉ được chọn trong danh sách đã kiểm có subset `vietnamese`: **Inter,
> Be Vietnam Pro, IBM Plex Sans, Public Sans, Noto Sans, Roboto**. **Lato thì KHÔNG** — nó chỉ có
> `latin` + `latin-ext`, và `latin-ext` không đủ cho chữ chồng dấu (ế ộ ữ ẳ ợ ẵ).

## Ràng buộc cứng

| Ràng buộc | Nghĩa với thiết kế |
|---|---|
| Dựng cả sản phẩm trong **4,5 tiếng**, một nửa quỹ giờ đã giữ cho tính năng phát sinh | **Một** màn hình được làm thật dày, còn lại đủ dùng là đủ |
| **Web, màn hình rộng.** Không thiết kế mobile | Đổi Stage bằng **kéo thả** |
| Hai tài khoản, người chấm tự đăng nhập | Khác biệt Sales / Quản trị phải nhìn ra ngay |
| **Không được dùng màu đơn độc** để phân biệt Mức chắc chắn | Ký hiệu **và** màu, luôn đi cặp. Người mù màu vẫn phải phân biệt được |
| Phần AI **tắt được ngay lập tức** | Mọi màn hình phải còn nghĩa khi lớp AI biến mất |
| Bảy Stage **không được đổi tên** | Tiếp cận · Đủ điều kiện · Soạn đề xuất · Thương lượng · Thắng · Thua · Tạm dừng |

## Từ vựng trên giao diện

**Tiếng Anh cho thực thể** — đúng cụm người Sales nói hàng ngày. **Tiếng Việt cho câu chữ** — nhãn
hướng dẫn, thông báo, giải thích.

`Account` · `Contact` · `Primary contact` · `Opportunity` · `Stage` · `Activity` · `Timeline` ·
`Next step` · `Snapshot` · `Signal` · `Suggestion` · `Queue` · `Watching`

Ba mức chắc chắn giữ tiếng Việt: **Chắc · Có thể · Đoán**.

## Tám điều phải nhìn ra được, không cần đọc chữ

Đây là ràng buộc, không phải gợi ý. Thiếu một là hỏng.

1. Ô **Next step do máy đặt** khác ô **do người gõ**
2. **Ba Mức chắc chắn** — ký hiệu **và** màu, không màu đơn độc
3. **Account đang có Suggestion chờ** — thấy từ danh sách, không phải mở ra mới biết
4. **Mục Timeline do hệ thống thêm** — mang nhãn *do hệ thống thêm*
5. **Cờ cảnh báo**: Opportunity thiếu Next step · sang Đủ điều kiện mà thiếu hai dấu hiệu · sang
   Thua mà chưa có lý do
6. **Phần AI đang tắt** — người dùng thấy ngay, không im lặng biến mất
7. **Cửa sổ Hoàn tác còn bao lâu** — hiện rõ, không để người đoán
8. **Account có hồ sơ đã cũ** — không đổi quá 30 ngày. Ngưỡng do người trong nghề chốt: quá một
   tháng thì hồ sơ không mang đi họp được nữa

## Màn hình cần thiết kế

**Một khung cộng bốn màn hình.** Khung bao mọi màn, nên thiết kế nó trước — ba thứ trong khung là
ràng buộc nghiệm thu, không phải trang trí.

**S0 · Khung ứng dụng** — bao quanh mọi bề mặt
Ba thành phần, và cả ba đều có điểm nghiệm thu treo vào:

- **Thanh điều hướng.** Lối vào `S1` `S2` `S4` `S6` `S7` `S9`. Lối vào `S8` Admin **chỉ hiện với
  Quản trị** — Sales không thấy nó, và việc chặn diễn ra ở tầng nghiệp vụ chứ không phải bằng cách
  ẩn menu. Thiết kế phải cho thấy hai vai nhìn thanh điều hướng khác nhau
- **Dải báo AI đang tắt.** Hiện với **Sales**, không chỉ với Quản trị. Không im lặng biến mất. Đây
  là chỗ dễ bỏ nhất trong cả sản phẩm: nó chỉ xuất hiện khi ai đó bấm phanh, nên dễ quên dựng — mà
  `T-9` kiểm đúng nó
- **Khay thông báo.** Khi máy tự đặt một Next step, người sở hữu được báo ngay: máy vừa đặt **gì**,
  cho Opportunity **nào**, **vì sao**. Thông báo **không tự biến mất trước khi được xem**

Khung cũng là chỗ hiện dải *"có 2 việc mới"* khi một vòng quét ghi dữ liệu trong lúc người đang
bấm — trang **không được nhảy**, không được tự đóng thứ đang mở.

**S1 · Today — bàn làm việc buổi sáng** ★ *làm thật dày, đây là màn hình hero*
Việc **đến hạn hôm nay** và **đã quá hạn**, mỗi dòng gắn với một Opportunity và Account · ô Next
step do máy đặt kèm **câu trích làm bằng chứng** và nút Hoàn tác còn hạn · dấu hiệu Account đang
có Suggestion chờ · cờ cảnh báo · lối vào Queue kèm số đang chờ · số Opportunity và tổng giá trị
ước tính theo Stage · bảng thống kê lý do thua.

**S2 · Suggestion queue**
Danh sách Gợi ý **có thứ tự ưu tiên**, gom theo Account. Mỗi Gợi ý hiện đủ **bốn thứ tại chỗ**,
không phải bấm sang màn khác: nội dung dạng **hiện tại → đề nghị** · **câu trích** làm bằng chứng ·
**Mức chắc chắn** · **một dòng nói rõ hệ quả nếu thông tin này sai**. Ba nút: **Duyệt** ·
**Sửa rồi duyệt** · **Bỏ**. Ràng buộc kiểm được: **số thao tác để Bỏ không được nhiều hơn số thao
tác để Duyệt**.

**S3 · Account detail**
Bốn khối: hồ sơ Account · **Reading area** chứa Snapshot và Signal · Timeline · danh sách
Opportunity. Reading area **không phải** hồ sơ và **không phải** Timeline — nó là vùng đọc, và sự
tách bạch đó phải nhìn ra được. Bấm một Signal thì mở **đúng đoạn văn gốc trong Snapshot, có đánh
dấu vị trí**.

**S8 · Admin dashboard**
Số Signal đã sinh và phân bố ba Mức chắc chắn · số Suggestion cùng tỉ lệ duyệt, tỉ lệ sửa-rồi-duyệt,
tỉ lệ bỏ, phân bố lý do bỏ · **thời gian quyết trung bình đặt CẠNH tỉ lệ duyệt** · số lần máy tự
đặt Next step và tỉ lệ bị hoàn tác · **khối cảnh báo duyệt mù** · ô chỉnh tham số · **nút tắt toàn
bộ phần AI**.

Một chi tiết dễ bỏ: tỉ lệ duyệt cao **cộng** thời gian quyết thấp là tín hiệu **xấu**, không phải
tốt. Hai con số đó phải đứng cạnh nhau để đọc được điều đó.

## Luồng tương tác — đây mới là phần chính

Bốn màn hình ở trên là **bề mặt**. Thứ đáng thiết kế là cái xảy ra **giữa** chúng. Ba bảng dưới đây
là đặc tả tương tác đã có sẵn, chỉ chưa ai gọi tên chúng như vậy.

### Máy trạng thái của Opportunity là một đặc tả giao diện

Bảy Stage, và **chỉ những chuyển tiếp dưới đây được phép**. Mỗi dòng là một thao tác giao diện phải
cho phép; mỗi điều kiện canh là một trạng thái phải **từ chối kèm lý do**, không phải im lặng.

| Từ | Sang | Giao diện phải làm gì |
|---|---|---|
| *(tạo mới)* | `Tiếp cận` **duy nhất** | Không cho chọn Stage khi tạo Opportunity |
| Bốn Stage đang chạy | Bất kỳ Stage đang chạy nào khác | Kéo thả tự do, lùi và nhảy cóc đều được. Ghi một mục Timeline |
| Bất kỳ | `Đủ điều kiện` | **Hỏi ngay** hai ô *dấu hiệu nhu cầu* và *dấu hiệu ngân sách*. **Bỏ qua được** — vẫn sang, mang cờ |
| Đang chạy | `Tạm dừng` | Lưu Stage cũ. Cờ thiếu Next step **im lặng** cho tới khi quay lại |
| `Tạm dừng` | **Đúng** Stage cũ | Không cho chọn Stage khác. Chỉ một đích duy nhất |
| Đang chạy hoặc `Tạm dừng` | `Thua` | **Hỏi ngay** lý do thua. Bỏ qua được — vẫn sang, mang cờ, **đứng ngoài bảng thống kê** |
| `Thắng` hoặc `Thua` | Đúng Stage cũ | **Chỉ Quản trị.** Sales kéo thì bị từ chối kèm một câu nói vì sao |
| **Bất kỳ** | **Bất kỳ**, khi tác nhân là máy | **Chặn tuyệt đối.** Máy không bao giờ đổi Stage |

Chuyển tiếp nào không có trong bảng là **không được phép** — `Tạm dừng` không đi thẳng sang một
Stage tuỳ chọn, và `Thắng` không đi thẳng sang `Thua`.

### Sáu luật hành vi — mỗi luật là một trạng thái, không phải một rào chắn

Đây là chỗ dễ thiết kế sai nhất. Cả sáu luật này **được phép vi phạm**. Giao diện phải **đánh dấu**,
tuyệt đối **không chặn thao tác**.

| Luật | Vi phạm thì giao diện làm gì |
|---|---|
| Opportunity đang mở phải có Next step **và** ngày hạn | **Vẫn lưu.** Mang cờ; không xuất hiện trong danh sách việc phải làm |
| Sang `Đủ điều kiện` phải có hai dấu hiệu | **Vẫn kéo được.** Mang cờ tới khi bổ sung |
| Sang `Thua` phải có lý do | **Vẫn sang.** Mang cờ, đứng ngoài bảng thống kê |
| Opportunity ở `Tạm dừng` **miễn trừ** luật đầu | Cờ **im lặng** — ngoại lệ có chủ đích, không phải lỗ hổng |
| Tỉ lệ Signal chưa phân loại vượt ngưỡng | Cảnh báo ở màn Quản trị. Không chặn gì |
| Nhịp duyệt hoặc thời gian quyết vượt ngưỡng | Khối *"N gợi ý cần rà lại"*. Không chặn gì |

Một CRM chặn người dùng ở sáu chỗ này là một CRM bị bỏ. Người bán coi nhập liệu là thuế thì họ trốn.

### Mười chín nhánh ngoại lệ — mỗi nhánh là một màn hình

`EXPERIENCE.md` liệt kê đủ. Bảy nhánh dưới đây **đổi hình dạng giao diện**, không chỉ đổi một dòng
chữ:

1. **Người sửa tay ô máy vừa đặt** → nút Hoàn tác **biến mất ngay**, kể cả khi cửa sổ chưa hết
2. **Vòng quét chạy ngay lúc người đang bấm** → trang **không nhảy**, không tự đóng thứ đang mở.
   Dữ liệu mới hiện thành một dải *"có 2 việc mới"*, bấm mới nạp
3. **Hai Suggestion cùng trỏ một ô** → chỉ **một** cái chờ; cái mới thay cái cũ, cái cũ đóng với lý
   do *có gợi ý mới hơn* và **không** tính vào tỉ lệ duyệt
4. **Hồ sơ đã đổi sau khi Suggestion sinh ra** → vế *hiện tại* đọc **giá trị sống**, và thẻ mang
   nhãn *"hồ sơ đã đổi sau khi gợi ý này sinh ra"*
5. **Nguồn không đọc được** → Reading area nói **không đọc được** kèm lý do. Không đoán, không để
   trống như thể chưa quét
6. **Phanh bấm giữa một vòng quét** → vòng cắt tại ranh giới Account, vẫn ghi nhật ký kèm lý do
7. **Chưa đủ dữ liệu để tính tỉ lệ** → *"cần ít nhất N lượt quyết để tính"*, **không** hiện 0% —
   0% đọc thành *máy sai hết*

### Bảy ngưỡng trải nghiệm phải đạt

| Ngưỡng | Con số |
|---|---|
| Mở ứng dụng tới lúc biết hôm nay chạm ai | ≤ **10 giây**, không thao tác nào ngoài đăng nhập |
| Duyệt một Suggestion | **1 bấm**. Bỏ: **≤ 2 bấm** kể cả chọn lý do — và **không nhiều hơn** Duyệt |
| Từ một Signal tới đoạn nguồn có đánh dấu | **1 bấm** |
| Phản hồi thị giác cho mọi thao tác | ≤ **200 ms**; việc lâu hơn 1 giây phải hiện trạng thái đang chạy |
| Số dòng việc thấy được không cuộn ở 1440×900 | ≥ **9** |
| Mất mạng giữa một thao tác ghi | Trang **không trắng**; báo *"chưa lưu được, thử lại"*, **giữ nguyên thứ người vừa gõ** |
| Vòng quét chạy nền | **0** lần trang tự nhảy hoặc tự đóng thứ người đang mở |

Ngưỡng cuối đắt nhất và dễ bỏ nhất: chu kỳ demo **60 giây** nghĩa là một vòng quét **sẽ** chạy ngay
giữa lúc người chấm đang bấm.

## Giọng chữ

- **Nói việc, không nói tính năng.** *"Sakura Logistics vừa gọi vốn — liên hệ trong ngày"*, không
  phải *"Đã phát hiện tín hiệu funding"*
- **Cảnh báo nói việc phải làm.** *"3 gợi ý cần rà lại"* — **không** dùng *"Phát hiện bất thường"*
- **Không hứa thay máy.** Máy đoán thì nói là đoán
- **Con số đi kèm mốc so.** *"12/15 account đã quét"*, không phải *"12 account"*

## Nội dung trong thiết kế

Dùng **nội dung thật của sản phẩm**, không lorem, không chữ tiếp thị. Bộ dữ liệu thật có khoảng
**15 Account** (cả Nhật lẫn Việt), **30 Contact**, **8 Opportunity đang mở**, một đơn vị tiền duy
nhất. Câu trích là tin thật kiểu: gọi vốn Series B · bổ nhiệm CTO mới · mở trung tâm phát triển ·
tuyển kỹ sư quy mô lớn — giữ nguyên ngôn ngữ gốc của tin, câu nhận định thì tiếng Việt.

## Việc của người sản xuất

**Stack đã chốt: React cộng Fluent UI v9.** Dựng bằng thư viện thật, đừng dựng lại bằng CSS thuần.

```
@fluentui/react-components  9.74.6    @fluentui/react-icons  2.0.337
```

- Bọc ứng dụng trong `<FluentProvider theme={webLightTheme}>`. **Không cần theme tuỳ biến** — mọi
  màu trong `DESIGN.md` đều là token chuẩn của `webLightTheme`, kể cả màu dòng máy (nó chỉ là
  `colorBrandBackground2` cộng `colorBrandStroke1`)
- Ba component gánh ba chỗ nặng nhất, dùng của thư viện chứ đừng tự viết: **`DataGrid`** cho danh
  sách việc và Opportunity · **`Tag`** cho nhãn Stage · **`Badge`** cho Mức chắc chắn và cờ
- Style bằng `makeStyles` cộng `tokens.<tên>`, không viết hex trực tiếp
- **Đừng cài `@fluentui/tokens` riêng** — gói đó vẫn là `1.0.0-alpha.24`; `tokens` đã có sẵn trong
  `react-components`

`DESIGN.md` đính kèm là **hợp đồng**, không phải gợi ý. Đừng đề xuất bảng màu khác, đừng chế thang bo
góc khác, đừng thêm gradient. Việc cần làm:

1. **Một nguyên mẫu bấm được**, không phải năm ảnh tĩnh. Khung `S0` bao bốn bề mặt `S1` `S2` `S3`
   `S8`, nối với nhau bằng đúng các lối vào đã ghi ở mục *Màn hình cần thiết kế*
2. **Diễn được ba luồng**, mỗi luồng đi hết cả nhánh chính lẫn một nhánh ngoại lệ:
   - Mở Today → bấm câu trích → xem đoạn nguồn có đánh dấu → quay lại → **Hoàn tác** một ô máy đặt
   - Vào Queue → **Duyệt** một, **Bỏ** một kèm chọn lý do → gặp ca *hồ sơ đã đổi sau khi gợi ý sinh ra*
   - Vào Admin → thấy tỉ lệ duyệt cao **cạnh** thời gian quyết thấp → **bấm phanh** → quay ra Today
     thấy dải báo AI đang tắt trên khung `S0`
   - *(nếu dựng thêm được)* Đăng nhập bằng vai **Sales** rồi bằng vai **Quản trị** — thanh điều
     hướng của `S0` khác nhau ở đúng một chỗ: lối vào Admin
3. **Trạng thái, không chỉ bố cục.** Mỗi bề mặt cần bốn trạng thái: rỗng · đang tải · lỗi một phần ·
   AI tắt. Khung `S0` cần thêm trạng thái **mất kết nối**: dải *"chưa lưu được, thử lại"*, và
   **giữ nguyên thứ người vừa gõ**
4. **Dùng đúng token trong `DESIGN.md`**, không sinh lớp token mới. Nếu buộc phải lệch khỏi nó ở chỗ
   nào thì **nói thẳng lệch chỗ nào và vì sao** — một danh sách ngắn các chỗ lệch có giá trị hơn một
   bản đẹp mà không ai biết nó đã đổi gì
5. Nói rõ **mỗi màn hình minh hoạ mục nào** của hai sườn, để người đọc sau biết đối chiếu ở đâu

## Điều **không** cần làm

Không thiết kế mobile · không màn hình đăng nhập cầu kỳ · không trang tiếp thị · không onboarding ·
không biểu đồ trang trí. Bốn màn hình trên là đủ; bảy màn còn lại của sản phẩm cố ý giữ dạng biểu
mẫu, lý do ghi ở `backlog-giao-dien.md`.
