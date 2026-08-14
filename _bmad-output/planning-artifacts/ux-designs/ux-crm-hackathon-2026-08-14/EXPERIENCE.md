---
title: "Why Now — Trải nghiệm và hành vi"
status: draft
created: 2026-08-14
updated: 2026-08-14
---

# EXPERIENCE.md — Why Now

Sườn này sở hữu **sản phẩm chạy thế nào**. Sườn chị em `DESIGN.md` sở hữu **nó trông thế nào**.

> **Trạng thái:** `DESIGN.md` đã viết lại (14/08) trên lớp token **Microsoft Fluent 2**, sau khi
> người dùng thử phản hồi rằng bản trước trông cũ. Chỗ nào tệp này gọi tên **vai trò** — *dòng máy*,
> *ray*, *giấy*, *mực phụ* — thì giá trị tương ứng nằm ở bảng token đầu `DESIGN.md`, kèm tên Fluent
> để map thẳng.
>
> **Cơ chế phân biệt máy/người đã đổi hình dạng, không đổi ý tưởng.** Dải nền tối tràn ngang đã bỏ;
> thay bằng nền xanh rất nhạt cộng ray trái cộng cân nặng chữ. Mọi câu trong tệp này nói *dòng máy*
> vẫn đúng — chỉ hình dạng của nó khác.
>
> **Hai sườn thắng mọi mock khi có mâu thuẫn.** Nguyên mẫu ở [`prototype/`](prototype/) dựng theo
> lớp token **cũ** và nay chỉ còn giá trị tham khảo về luồng, không còn về thị giác.

## Nền

**Web, màn hình rộng.** Không thiết kế mobile — quyết định của bước UX, không phải giới hạn kỹ
thuật: người dùng làm việc này ngồi bàn, và đề bài đòi **kéo thả** để đổi Stage.

**Chưa chọn hệ thống giao diện.** Đó là đầu ra của bước Kiến trúc. Nên sườn này đặc tả **hành vi
đầy đủ**, không phải phần chênh so với một hệ có sẵn. Chọn xong hệ nào thì rút gọn sườn này về
phần chênh, đừng giữ cả hai.

Nguồn kế thừa, theo tham chiếu chứ không chép lại: `prd.md` (51 FR, ba hành trình, ma trận vai
`§6`, vòng đời `§5`) · `brief.md` · `design-handoff.md`.

## Kiến trúc thông tin

Mười một bề mặt. IA đóng khi **mọi nhu cầu đã nêu có một bề mặt phục vụ, và mọi bề mặt có một hành
trình dẫn tới**.

| # | Bề mặt | Vai | Vào từ đâu | Hành trình | FR nó phục vụ |
|---|---|---|---|---|---|
| `S0` | **Khung ứng dụng** — thanh điều hướng, dải báo AI tắt, khay thông báo | cả hai | luôn hiện sau đăng nhập | mọi hành trình | `FR-31` `FR-46` |
| `S1` | **Today** — bàn làm việc buổi sáng | Sales | mặc định sau đăng nhập | UJ-1 | `FR-7` `FR-9` `FR-10` `FR-25` `FR-30` `FR-48` |
| `S2` | Suggestion queue | Sales | dấu hiệu ở `S1`, `S3`, `S6` | UJ-2 | `FR-18`–`FR-26` · `FR-51` |
| `S3` | Account detail | Sales | `S1`, `S6`, `S7` | UJ-1, UJ-2 | `FR-1` `FR-2` `FR-6` · `FR-11`–`FR-17` · `FR-35` `FR-36` `FR-40` `FR-42` |
| `S4` | Pipeline board | Sales | thanh điều hướng | — *(xem ghi chú)* | `FR-3` `FR-4` `FR-5` `FR-8` |
| `S5` | Opportunity detail | Sales | `S1`, `S3`, `S4` | UJ-1 | `FR-3` `FR-7` `FR-8` · `FR-27`–`FR-34` |
| `S6` | Account list | Sales | thanh điều hướng | UJ-2 | `FR-9` |
| `S7` | Watching list | Sales | thanh điều hướng | — *(xem ghi chú)* | `FR-35` |
| `S8` | Admin dashboard | Quản trị | thanh điều hướng, **chỉ hiện với Quản trị** | UJ-3 | `FR-37` · `FR-41`–`FR-45` · `FR-47` |
| `S9` | Scan log | cả hai | `S8`, `S7` | UJ-3 | `FR-38` `FR-39` |
| `S10` | Snapshot viewer | Sales | bấm một Signal ở bất cứ đâu | UJ-1, UJ-2 | `FR-15` `FR-50` |
| `S11` | Login | cả hai | vào ứng dụng khi chưa có phiên | mọi hành trình | `FR-49` |

**Cột cuối là phép đóng thật của IA.** Cả 51 FR đều có bề mặt nhận; không FR nào rơi ra ngoài. Soát
lại bằng máy mỗi lần thêm FR — bốn FR từng rơi ra khỏi bảng này (`FR-36`, `FR-37`, `FR-38`,
`FR-40`), và `FR-46` từng **không thuộc màn nào** vì bảng chưa có khung ứng dụng.

> ⚠ **`FR-46` là lý do `S0` tồn tại.** *"Sales thấy trạng thái AI đang tắt"* không thuộc màn hình
> nào — nó thuộc khung. Mà `T-9` kiểm đúng điều đó. Không có `S0` thì không ai được giao dựng nó.

> ⚠ **Hai bề mặt chưa có hành trình dẫn tới.** `S4` Pipeline board và `S7` Watching list vào được
> từ thanh điều hướng nhưng **không hành trình nào kết thúc ở đó**. Đây là chỗ IA chưa đóng kín, và
> nó chưa đóng vì thiếu quan sát người dùng thật, không vì thiếu suy nghĩ. Xem *Giới hạn đã biết*.

**Quy tắc điều hướng:** `S8` và mọi lối vào nó **không hiển thị** với Sales, và việc chặn diễn ra
ở **tầng nghiệp vụ**, không phải bằng cách ẩn menu — ẩn menu không phải biên giới bảo mật.

## Giọng chữ

| Quy tắc | Đúng | Sai |
|---|---|---|
| Nói **việc**, không nói tính năng | *"Sakura Logistics vừa gọi vốn — liên hệ trong ngày"* | *"Đã phát hiện tín hiệu funding"* |
| Cảnh báo nói **việc phải làm** | *"3 gợi ý cần rà lại"* | *"Phát hiện bất thường"* ← cấm, `D29` chốt |
| Không hứa thay máy | *"Đoán — chưa có bằng chứng trực tiếp"* | *"Công ty này đang cần tuyển gấp"* |
| Con số đi kèm **mốc so** | *"12/15 account đã quét"* | *"12 account"* |
| Lỗi nói **làm gì tiếp**, không nói mã lỗi | *"Không đọc được nguồn của Aozora Tech. Vòng sau thử lại."* | *"Fetch failed (503)"* |

**Thực thể viết tiếng Anh, câu chữ viết tiếng Việt.** `Account` · `Contact` · `Primary contact` ·
`Opportunity` · `Stage` · `Activity` · `Timeline` · `Next step` · `Snapshot` · `Signal` ·
`Suggestion` · `Queue` · `Watching`. Ba Mức chắc chắn giữ tiếng Việt: **Chắc · Có thể · Đoán**.

## Mẫu thành phần — hành vi

Đặc tả thị giác thuộc `DESIGN.md`. Dưới đây chỉ nói **chúng cư xử ra sao**.

| Thành phần | Hành vi | Nguồn |
|---|---|---|
| **Ô Next step** | Hai nguồn, phân biệt được không cần đọc: *do máy đặt* nằm trên dòng máy kèm câu trích và nút Hoàn tác; *do người gõ* nằm trên giấy. Máy **không bao giờ** ghi đè ô người gõ, kể cả khi đã quá hạn — đây cũng đúng là cách Airtable giải bài toán này, ở tầng dữ liệu chứ không phải tầng thị giác | `FR-30` `FR-34` |
| **Nhãn Mức chắc chắn** | Ba mức, mỗi mức **một ký hiệu cộng một màu**, không bao giờ chỉ màu. **Một** bộ màu duy nhất — nền tối đã bỏ nên không còn cần biến thể thứ hai. Ba mức là chữ, **không bao giờ là phần trăm**: cả Google PAIR lẫn Microsoft HAX đều chống chỉ báo độ tin cậy bằng số | `FR-16` `D24` |
| **Thẻ Suggestion** | Hiện đủ **bốn thứ tại chỗ**: *hiện tại → đề nghị* · câu trích · Mức chắc chắn · một dòng hệ quả nếu tin này sai. Không bấm sang màn khác | `FR-19` |
| **Ba nút quyết** | Duyệt · Sửa-rồi-duyệt · Bỏ. **Số thao tác để Bỏ ≤ số thao tác để Duyệt** — kiểm được, không phải nguyện vọng. Bỏ kèm chọn một lý do trong năm | `FR-20` |
| **Nút Hoàn tác** | **Một cú bấm**, đưa về đúng giá trị trước khi máy chạm. Hiện rõ **còn bao lâu**. Người sửa tay ô đó thì nút **biến mất ngay**, kể cả khi cửa sổ chưa hết | `FR-32` |
| **Cờ cảnh báo** | Gắn vào Opportunity thiếu Next step · sang Đủ điều kiện mà thiếu hai dấu hiệu · sang Thua mà chưa có lý do. **Không chặn thao tác**, chỉ đánh dấu | `BR-B1`–`BR-B3` |
| **Chip Signal** | Bấm ở bất cứ đâu nó xuất hiện thì mở `S10` tại **đúng đoạn văn gốc, có đánh dấu vị trí** | `FR-15` `T-3` |
| **Dấu hiệu có Suggestion chờ** | Hiện trên dòng Account ở `S1`, `S3`, `S6` kèm **số đang chờ**. Người dùng không phải nhớ đi kiểm tra Queue | `FR-25` |
| **Cột Stage** *(S4)* | Kéo thả. Lùi và nhảy cóc đều được giữa bốn Stage đang chạy. Chuyển tiếp ngoài bảng `§5.1` của PRD bị từ chối kèm một câu nói vì sao | `FR-4` |
| **Cờ hồ sơ đã cũ** | Account có hồ sơ không đổi quá **30 ngày** mang cờ, thấy được cả ở danh sách lẫn màn hình Account. Ngưỡng do Sales Manager chốt 14/8; cấu hình được | `NFR-18` |
| **Dải báo AI đang tắt** | Hiện với **Sales**, không chỉ với Quản trị. Không im lặng biến mất | `FR-46` |

## Mẫu trạng thái

Mỗi bề mặt chính phải có bốn trạng thái này. Thiếu trạng thái là chỗ giao diện vỡ khi gặp dữ liệu
thật.

| Trạng thái | `S1` Today | `S2` Queue | `S3` Account | `S8` Admin |
|---|---|---|---|---|
| **Rỗng** | *"Hôm nay chưa có việc đến hạn."* Kèm lối vào Queue nếu có gợi ý chờ | *"Không có gợi ý nào chờ."* Kèm thời điểm vòng quét gần nhất | Reading area rỗng: *"Chưa đọc nguồn nào cho account này."* | Chưa đủ dữ liệu: hiện *"cần ít nhất N lượt quyết để tính"*, **không** hiện 0% |
| **Đang tải** | Khung xương giữ đúng số dòng của lần trước, để trang không nhảy | Như `S1` | Bốn khối tải độc lập; Timeline chậm không chặn hồ sơ | Số đo tải sau khung |
| **Lỗi một phần** | Một khối hỏng thì khối đó báo lỗi, ba khối kia vẫn chạy | Một Suggestion hỏng thì ẩn nó và ghi nhật ký, không đổ cả trang | Nguồn không đọc được thì Reading area nói **không đọc được**, không đoán | Số đo nào tính được thì hiện, số nào không thì ghi *"chưa tính được"* |
| **AI tắt** | Việc đến hạn vẫn hiện đủ; ô do máy đặt **giữ nguyên**, chỉ ngừng sinh mới | Gợi ý đang chờ **vẫn bấm được** — phanh chặn phần sinh ra, không chặn phần người quyết | Reading area giữ nguyên nội dung cũ | Nút phanh đổi thành *Bật lại*, kèm thời điểm tắt |

### Bảy bề mặt còn lại — trạng thái tối thiểu

Bảy bề mặt để dạng biểu mẫu vẫn phải có trạng thái, chỉ là không cần đầu tư thị giác. Đây là mức
tối thiểu, không phải mức mong muốn.

| Bề mặt | Rỗng | Lỗi | AI tắt |
|---|---|---|---|
| `S0` Khung | — | Mất kết nối: dải *"chưa lưu được, thử lại"*, giữ nguyên thứ người vừa gõ | **Dải báo AI đang tắt** — đây là chỗ `FR-46` sống |
| `S4` Pipeline | Stage rỗng hiện tên Stage, không hiện khoảng trắng | Kéo thả không hợp lệ: từ chối **kèm một câu nói vì sao** | Không đổi — nhóm 1 chạy độc lập |
| `S5` Opportunity | Chưa có Next step: hiện cờ, không hiện ô trống im lặng | Lưu hỏng: giữ nguyên thứ người vừa gõ | Ô do máy đặt **giữ nguyên**, ngừng sinh mới |
| `S6` Account list | *"Chưa có account nào"* kèm nút tạo | Lọc không ra kết quả: nói rõ **lọc nào** đang bật | Cột dấu hiệu Suggestion ẩn đi |
| `S7` Watching list | *"Chưa theo dõi account nào"* kèm cách bật | — | Nói rõ vòng quét **đang dừng** |
| `S9` Scan log | *"Chưa có vòng quét nào chạy"* | Vòng bị bỏ vẫn là **một dòng**, kèm lý do | Dòng cuối ghi thời điểm dừng |
| `S10` Snapshot | Bản lưu rỗng: *"nguồn không đọc được"* kèm lý do | Không tìm thấy đoạn đánh dấu: mở bản lưu ở đầu **và nói rõ** | Không đổi — bản lưu cũ vẫn mở được |
| `S11` Login | — | Sai mật khẩu: không nói tài khoản nào tồn tại | Không đổi |

## Nguyên thuỷ tương tác

- **Kéo thả** đổi Stage. Bàn phím thay thế: chọn dòng rồi dùng phím mũi tên — kéo thả không được
  là **lối duy nhất** làm một việc bắt buộc.
- **Một cú bấm** cho Hoàn tác và cho Duyệt. Sửa-rồi-duyệt là hai bước: mở sửa, rồi xác nhận.
- **Bật/tắt Watching** một thao tác. Ô *vì sao theo dõi* là **tuỳ chọn** và **không chặn** thao
  tác bật — bắt buộc nó sẽ làm đỏ `T-8`.
- **Máy không sửa được mục Timeline do người tạo.** Ghi chú và Activity của Sales chỉ người sửa;
  máy chỉ **thêm** mục mới, gắn nhãn *do hệ thống thêm*. Ranh giới này do Sales Manager chốt 14/8,
  và đề bài không có nó — đề bài chỉ có bốn ranh giới, đây là thứ năm (`NFR-19`)
- **Không có xác nhận hai lần** cho việc hoàn tác được. Chỉ ghi đè ô đã có giá trị mới buộc hiện
  diff và buộc chọn lý do.

## Sàn khả năng tiếp cận

| Quy tắc | Ngưỡng kiểm được |
|---|---|
| Không dùng **màu đơn độc** để truyền thông tin | Mọi Mức chắc chắn, mọi cờ cảnh báo, mọi ranh giới máy/người đều có **ký hiệu hoặc chữ** đi kèm |
| Bàn phím tới được mọi hành động bắt buộc | Ba nút quyết ở `S2`, Hoàn tác, đổi Stage — tất cả tới được không cần chuột |
| Tiêu điểm nhìn thấy được | Viền tiêu điểm không bị `outline: none` ở bất kỳ đâu |
| Tương phản chữ trên **mọi nền màu nhạt** | Nhãn dùng mẫu ba thành phần: nền gần trắng + viền màu + chữ đậm. Chữ phụ phải đạt ≥ 4.5:1. Rủi ro đã giảm hẳn so với bản trước — nền tối đã biến mất khỏi hệ |
| Ngôn ngữ của trang khai đúng | `lang="vi"`, và đoạn trích giữ ngôn ngữ gốc phải khai `lang` riêng |

## NFR trải nghiệm

Bốn nhóm phẩm chất, mỗi cái một ngưỡng đo được. Dòng nào chỉ có tính từ thì không kiểm được, nên
không có dòng nào như vậy.

| Mã | Phẩm chất | Ngưỡng | Đo bằng |
|---|---|---|---|
| `UX-1` | **Thời gian tới câu trả lời** — mở ứng dụng tới lúc biết hôm nay chạm ai | ≤ **10 giây**, không thao tác nào ngoài đăng nhập | Bấm giờ một lượt trên bộ dữ liệu đề bài |
| `UX-2` | **Số bước xử một Suggestion** | Duyệt: **1 bấm**. Bỏ: **≤ 2 bấm** kể cả chọn lý do. Bỏ **không** nhiều hơn Duyệt | Đếm thao tác |
| `UX-3` | **Số bước từ một Signal tới đoạn nguồn** | **1 bấm**, mở đúng đoạn có đánh dấu | `T-3` |
| `UX-4` | **Phản hồi cảm nhận được** cho mọi thao tác người bấm | ≤ **200 ms** có phản hồi thị giác; việc lâu hơn **1 giây** phải hiện trạng thái đang chạy | Quan sát |
| `UX-5` | **Mật độ `S1`** — số dòng việc thấy được không cuộn, ở 1440×900 | ≥ **9 dòng** | Đo trên mock |
| `UX-6` | **Hành vi khi mất mạng** | Trang đang mở **không trắng**; thao tác ghi báo *"chưa lưu được, thử lại"* và **giữ nguyên thứ người vừa gõ** | Ngắt mạng giữa một thao tác ghi |
| `UX-7` | **Vòng quét chạy nền không cướp tiêu điểm** | 0 lần trang tự nhảy hoặc tự đóng thứ người đang mở, kể cả khi vòng quét ghi dữ liệu mới | Mở một Suggestion, để một vòng quét chạy qua |

`UX-7` là ngưỡng dễ bỏ nhất và đắt nhất: chu kỳ demo 60 giây nghĩa là **một vòng quét sẽ chạy ngay
giữa lúc giám khảo đang bấm**.

## Hành trình chính và luồng ngoại lệ

Ba hành trình, mỗi cái có **luồng chính rồi luồng ngoại lệ**. Chỉ có luồng chính là mô tả ngày đẹp
trời, không phải mô tả sản phẩm.

### UJ-1 · Linh biết phải gọi ai, trước khi kịp pha xong cà phê

Linh là BD phụ trách thị trường JP, đã đăng nhập từ phiên trước.

**Luồng chính**

1. Mở ứng dụng → `S1` Today là màn hình mặc định
2. Dòng đầu nằm trên **dòng máy**: *"Sakura Logistics · đề xuất dedicated team"*, hạn **hôm nay**
3. Ngay dưới câu việc là **câu trích nguyên văn** và nhãn **Chắc**
4. Linh bấm câu trích → `S10` mở **đúng đoạn**, có đánh dấu
5. **Đỉnh:** cô đọc hai giây, tin, đóng lại và gọi khách. **Cô không phải quyết định gì** — việc đã
   được xếp sẵn và bằng chứng nằm ngay cạnh nó
6. Kết: quay lại `S1`, dòng đó vẫn ở đó cho tới khi cô ghi một Activity

**Luồng ngoại lệ**

| Xảy ra khi | Hệ thống làm gì |
|---|---|
| **Máy đặt sai** — tin không liên quan tới deal này | Nút Hoàn tác ngay trên dòng, **một cú bấm**, còn hạn 7 ngày. Ô về đúng giá trị trước đó |
| **Linh đã tự gõ Next step tối qua** | Máy **không** ghi đè, kể cả khi ô đó đã quá hạn. Nó ghim một dòng đề xuất bên dưới |
| **Cô sửa tay ô máy vừa đặt** | Nút Hoàn tác **biến mất ngay** — hoàn tác lúc này sẽ xoá thứ cô vừa gõ |
| **Vòng quét chạy ngay lúc cô đang đọc** | Trang **không nhảy**, không tự đóng thứ đang mở. Dữ liệu mới hiện dưới dạng một dải *"có 2 việc mới"*, cô bấm mới nạp |
| **Nguồn của một Account không đọc được** | Account đó **không** xuất hiện với việc bịa. Reading area của nó ghi *"không đọc được"* kèm lý do |
| **Phần AI đang tắt** | `S1` vẫn chạy đủ: việc đến hạn, quá hạn, cờ cảnh báo. Một dải báo rõ *"phần gợi ý đang tắt"* |
| **Hôm nay không có việc nào** | Không để trống. Hiện *"Hôm nay chưa có việc đến hạn"* cộng lối vào Queue nếu có gợi ý chờ |

### UJ-2 · Linh xử hàng đợi trong bốn phút

**Luồng chính**

1. Từ `S1`, bấm dấu hiệu *7 gợi ý chờ* → `S2`
2. Hàng đợi đã **xếp theo thứ tự** và **gom theo Account** — cô không phải tự quyết đọc cái nào trước
3. Mỗi thẻ hiện đủ bốn thứ tại chỗ
4. Duyệt bốn, Sửa-rồi-duyệt một, Bỏ hai kèm lý do
5. **Đỉnh:** hàng đợi rỗng, và cô biết **chính xác** cái gì đã vào hồ sơ vì mỗi lần bấm đều thấy
   *hiện tại → đề nghị*
6. Kết: quay về `S1`, dấu hiệu chờ biến mất

**Luồng ngoại lệ**

| Xảy ra khi | Hệ thống làm gì |
|---|---|
| **Gợi ý mâu thuẫn thứ cô vừa nghe trong họp** | Bỏ với lý do *thông tin sai*. Con số đó chảy vào `error-detection rate` |
| **Hai gợi ý cùng trỏ một ô** | Chỉ **một** gợi ý chờ trên mỗi ô. Cái mới thay cái cũ; cái cũ đóng với lý do *có gợi ý mới hơn* và **không** tính vào tỉ lệ duyệt |
| **Hồ sơ đã đổi sau khi gợi ý sinh ra** | Vế *hiện tại* đọc **giá trị sống**, không phải ảnh chụp. Thẻ mang nhãn *"hồ sơ đã đổi sau khi gợi ý này sinh ra"* |
| **Cô bỏ giữa chừng, đóng tab** | Không có gì xảy ra. Gợi ý chưa quyết **giữ nguyên vô thời hạn**, không tự áp dụng, không hết hạn thành hành động |
| **Cô duyệt nhầm** | Duyệt cũng có Hoàn tác, cùng cửa sổ 7 ngày như nhóm 4 |
| **Account bị xoá trong lúc gợi ý còn chờ** | Gợi ý **đóng lại** kèm lý do *công ty đã xoá*, không treo lơ lửng |
| **Cô bấm quá nhanh** | Không chặn. Nhưng nhịp và thời gian quyết chảy vào cảnh báo duyệt mù ở `S8` |

### UJ-3 · Hà bắt được một tuần duyệt mù

Hà phụ trách chất lượng dữ liệu, không bán hàng, mở `S8` mỗi sáng thứ Sáu.

**Luồng chính**

1. Mở `S8` → tỉ lệ duyệt **96%** hiện **cạnh** thời gian quyết trung bình **1,8 giây**
2. Khối cảnh báo: *"3 gợi ý cần rà lại"*
3. **Đỉnh:** con số đẹp mà cảnh báo đỏ — Hà hiểu ngay đây là **duyệt mù**, không phải máy giỏi.
   Hai con số đó chỉ nói được điều này khi đứng cạnh nhau
4. Kết: Hà hạ chu kỳ quét xuống, hoặc bấm phanh nếu cần

**Luồng ngoại lệ**

| Xảy ra khi | Hệ thống làm gì |
|---|---|
| **Chưa đủ dữ liệu để tính tỉ lệ** | Hiện *"cần ít nhất N lượt quyết để tính"*, **không** hiện 0% — 0% đọc thành *máy sai hết* |
| **Hà bấm phanh giữa một vòng quét** | Vòng đó **cắt tại ranh giới Account**, vẫn ghi một dòng Nhật ký kèm lý do *cắt do phanh* |
| **Chạm 100% trần ngân sách** | Hệ thống **tự tắt** phần AI như khi bấm phanh, và hiện đúng dải báo đó cho Sales. Không im lặng ngừng sinh gợi ý |
| **Sales cố mở `S8`** | Bị chặn ở **tầng nghiệp vụ**, không phải bằng cách ẩn menu |
| **Hà đổi chu kỳ quét lúc một vòng đang chạy** | Vòng đang chạy giữ nhịp cũ; nhịp mới có hiệu lực từ vòng kế. Màn hình nói rõ điều đó |

## Giới hạn đã biết

Ghi ra vì `doc_standards` của bước này bắt, và vì giấu chúng không làm chúng biến mất.

**Đã hỏi người thật, chưa quan sát người thật.** Ngày 14/8 Sales Manager của đội trả lời bốn câu,
và bốn câu trả lời đó đã thành số trong tài liệu: 1–2 giờ mỗi BD mỗi ngày · 3–4 trên 10 cơ hội thua
là vì biết tin muộn · độ tươi hồ sơ 30 ngày · hai thứ không bao giờ cho máy tự ghi. Hai quyết định
`D46` và `D47` sinh ra từ đó, và chúng là **hai quyết định duy nhất trong cả sổ đứng trên câu trả
lời của người trong nghề** thay vì trên tài liệu.

Nhưng **hỏi khác quan sát**. Linh và Hà vẫn là suy đoán: không ai trong đội xem một BD thật làm
việc, nên thứ họ *kể mình làm* và thứ họ *làm* vẫn có thể khác nhau — và khoảng cách đó chính là
chỗ thiết kế hay hỏng. Đội chọn không quan sát, có ý thức, vì bản thân việc có persona là một thang
điểm. Đây vẫn là chỗ mỏng nhất của bước UX, chỉ mỏng ít hơn trước.

**Ba hướng thị giác ở `.working/` là prototype để CHỐT, không phải để khai thác.** Chúng đủ thật
để so ba cơ chế phân biệt máy-quyết với người-quyết, và hướng C được chọn từ đó. Prototype để hỏi
thì càng thô càng tốt vì người ta dám chê; ba tệp này **không** phục vụ mục đích đó và không nên
mang đi hỏi Sales như thể đang xin góp ý.

**Hai bề mặt chưa có hành trình dẫn tới** — `S4` Pipeline board và `S7` Watching list. IA chưa đóng
kín ở đó. Thiếu quan sát người dùng nên không biết họ vào hai màn đó **để làm gì**, và bịa một hành
trình ra là bịa.

**Năm lý do Bỏ trong nguyên mẫu không khớp Mục 0.** `DISMISS_REASONS` của Claude Design liệt kê
*Thông tin sai · Không liên quan tới account này · Đã biết rồi · Nguồn không tin được · Có gợi ý mới
hơn*; `0.1.7` của Mục 0 chốt *`thong_tin_sai` · `khong_lien_quan` · `da_cu` · `hieu_sai_ngu_canh` ·
`khac`*. Bản dựng thật theo **`0.1.7`**, không theo nguyên mẫu — Mục 0 thắng. Claude Design tự khai
rằng bốn trong năm giá trị của nó là suy ra, nên đây là chỗ nó nói thật chứ không phải chỗ nó sai.
