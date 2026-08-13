---
title: "Đọc lại bằng mắt mới — lỗ hổng hành vi, điều kiện đua, chỗ Kiến trúc phải tự quyết"
target: prd.md
status: review
created: 2026-08-14
scope: chỉ những vấn đề chưa có trong review-rubric · review-traceability · review-doc-standards · review-editorial
---

# Đọc lại PRD *Why Now* bằng mắt mới

## Cách đọc bản này

Bốn bản phản biện đã có được đọc **trước**, và mọi thứ chúng đã nêu đều bị loại ra khỏi bản này —
kể cả những chỗ PRD đã sửa xong theo chúng (ưu tiên FR, `đang chạy` / `đang mở`, thứ tự Hàng đợi,
`FR-50`, `FR-48`, `FR-49`, `§9.2 TR-n`, `§3.2`, `§4.3`, trạng thái khởi đầu của máy trạng thái…).
Bản này chỉ đi tìm bốn thứ mà bốn bản kia mỏng nhất:

| Loại | Câu hỏi dẫn đường | Số phát hiện mới |
|---|---|---|
| 1 · Lỗ hổng hành vi | Tình huống thật nào mà PRD **không nói hệ thống làm gì**? | 9 |
| 2 · Điều kiện đua và thứ tự | Hai việc chạy song song, cái nào thắng? | 5 |
| 3 · Thứ bước Kiến trúc phải tự quyết | PRD im ở đâu, và lựa chọn đó có đảo được không? | 6 |
| 4 · PRD lệch so với nguồn | Chỗ diễn giải sai, không phải chỗ cố ý chặt hơn có nhãn | 5 |

**Không loại nào kín.** Loại 1 và 2 là hai loại yếu nhất của tài liệu: PRD tả rất kỹ *hệ thống làm
gì trong đường đi đúng*, và gần như không tả *chuyện gì xảy ra khi hai đường đi cắt nhau*. Đó là dễ
hiểu — vòng đời bản ghi làm nền thì người viết nghĩ theo trạng thái, không nghĩ theo thời gian —
nhưng sản phẩm này có một vòng lặp 60 giây chạy cạnh một con người, nên thời gian là chiều thứ hai
không tránh được.

Mỗi phát hiện dưới đây gồm **vị trí**, **tình huống cụ thể làm nó lộ ra**, và **cách vá**. Mức xếp
theo ảnh hưởng tới ba bước sau (UX → Kiến trúc → Epic & Story), không theo mức nghiêm trọng của lỗi
xét riêng.

---

## Critical

### C1 · Bấm phanh giữa một vòng quét đang chạy — không ai nói vòng đó chết ngay hay chạy nốt
*(loại 2 · `FR-45` dòng 708–713, `NFR-1` dòng 744, `FR-38` dòng 666, đối chiếu `T-9`)*

`FR-45` viết *"Khi tắt: Vòng quét dừng"*. `T-9` của đề bài lại mở đầu bằng đúng chữ **"trong lúc
vòng quét đang chạy"** — nghĩa là điểm nghiệm thu này được thiết kế để rơi trúng giữa một vòng.

**Tình huống làm nó lộ ra.** 12 Công ty Đang theo dõi. Vòng đang xử lý Công ty thứ 5. Giám khảo bấm
phanh. Hai cách cài đặt đều đọc được từ `FR-45`:

- **Dừng ngay:** Công ty 1–4 đã có mục Dòng thời gian mới, 5–12 thì không. Vòng này có được ghi một
  dòng Nhật ký không? `NFR-1` chỉ bảo đảm *"100% vòng **bị bỏ** có dòng nhật ký"* — vòng bị **cắt
  ngang** không thuộc loại "bị bỏ", nên nó biến mất khỏi Nhật ký, và `FR-39` nói *"sau mỗi vòng ghi
  một dòng"* mà vòng này không có "sau".
- **Chạy nốt vòng hiện tại:** mục Dòng thời gian được thêm **sau** thời điểm bấm phanh. `T-9` đòi
  *"Hai chu kỳ kế tiếp không thêm mục nào"* — nếu bộ kiểm thử đếm từ lúc bấm, mục ghi muộn đó làm
  `T-9` đỏ.

Cùng một câu trong PRD, hai cách cài đặt, một trong hai làm hỏng một điểm nghiệm thu. Đây là chỗ
duy nhất trong tài liệu mà sự im lặng **trực tiếp** quyết định màu của một điểm `T`.

**Cách vá.** Thêm hai gạch vào `FR-45`: (a) vòng đang chạy **bị cắt ngay tại ranh giới Công ty đang
xử lý** — Công ty đang dở không được ghi gì, việc đã ghi cho các Công ty trước giữ nguyên; (b) vòng
bị cắt **vẫn ghi một dòng Nhật ký** với lý do *"cắt do phanh"* và số Công ty chưa quét, dùng đúng
cột của `FR-39`. Rồi mở rộng `NFR-1` từ *"vòng bị bỏ"* thành *"vòng không hoàn thành, vì bất kỳ lý
do nào"*.

---

### C2 · Một bản chụp "sau" chứa hai tin thì sinh mấy mục Dòng thời gian — PRD nói một, `D36` nói hai
*(loại 1 + 4 · `FR-36` dòng 653–657, `NFR-13` dòng 756, đối chiếu `D36`)*

`FR-36` viết vòng lặp là: *"đọc lại nguồn → so với Bản lưu gần nhất → có nội dung mới thì rút Phát
hiện → **tự thêm một mục** vào Dòng thời gian"*. Số ít, một lần, cho cả Công ty.

`D36` — quyết định chốt riêng về bộ nghiệm thu — sửa `T-8` thành khẳng định quan hệ, và viết nguyên
văn quan hệ đó là: ***"mỗi tin mới trong bản chụp sinh đúng một mục"***. Tức một mục **trên mỗi
tin**, không phải một mục trên mỗi vòng.

`NFR-13` của PRD có trích `D36`, nhưng chỉ chép phần *"`T-6` và `T-8` khẳng định **quan hệ** chứ
không khẳng định con số"* — **bỏ mất chính cái quan hệ**. Kết quả: người viết bộ kiểm thử được dặn
phải khẳng định một quan hệ mà PRD không nói quan hệ đó là gì, và chỗ duy nhất trong PRD nói tới số
lượng (`FR-36`) nói ngược với `D36`.

**Tình huống làm nó lộ ra.** Bộ dữ liệu BTC gần như chắc chắn có ít nhất một bản chụp *"sau"* mang
hai tin cùng lúc — `§3` của đề bài liệt kê sáu dạng tin cho 12–15 công ty, và `BR-D8` của chính PRD
tồn tại **chỉ vì** tình huống "nhiều tin cùng lúc" là có thật. Với bản chụp đó: cài theo `FR-36` cho
1 mục, cài theo `D36` cho 2 mục. `T-8` đếm mục.

**Cách vá.** Sửa `FR-36` thành *"tự thêm **một mục cho mỗi Phát hiện mới**"*, và bổ sung một luật
chống trùng ở tầng Phát hiện — hiện `FR-24` chỉ chống trùng cho **Gợi ý** (chạm 2), còn chạm 1 và
chạm 3 không có luật nào (xem H8). Rồi chép nốt câu quan hệ của `D36` vào `NFR-13`.

---

### C3 · `T-10` là điểm nghiệm thu duy nhất không có mã nào sở hữu — nên nó sẽ không sinh story
*(loại 3 · §10.1 dòng 780–798, §5.1 dòng 282, §6, đối chiếu §9.2 dòng 763–765)*

Bốn ranh giới `§5` được đặc tả ở **§10.1** dưới dạng một bảng bốn dòng đánh số `1`–`4`; dòng cuối
bảng §5.1 và ma trận §6 nhắc lại. **Không một dòng nào trong ba chỗ đó mang mã `FR-n`, `NFR-n` hay
`TR-n`.**

Chính PRD nói ra hệ quả, ở §9.2 dòng 763–765: *"Tách riêng vì bước Epic & Story **chỉ sinh story cho
thứ có mã** — để chúng nằm trong mục Câu hỏi còn mở là bảo đảm không ai làm."* Câu đó được viết để
biện hộ cho việc tạo `TR-1`…`TR-5`. Áp đúng logic ấy lên §10.1 thì kết luận là: **chặn ở tầng nghiệp
vụ sẽ không có story nào**.

**Tình huống làm nó lộ ra.** Bước Epic & Story quét PRD tìm `FR-`, `NFR-`, `TR-` để sinh backlog. Nó
sinh story cho 50 FR, 13 NFR, 5 TR. Không story nào nói *"từ chối thao tác đổi Giai đoạn khi tác
nhân là hệ thống"*. Ngày 15/8, `T-10` là điểm `T` duy nhất không ai được giao. §12.5 xếp bốn ranh
giới vào nhóm *"không bao giờ cắt"* — nhưng không cắt một thứ chưa từng được lập kế hoạch thì không
cứu được nó.

Đáng chú ý: `NFR-10` (truy vết) và `NFR-13` (bộ kiểm thử) đều có mã cho những thứ ít quan trọng hơn.
Đây là một chỗ hụt của **hệ thống định danh**, không phải của nội dung.

**Cách vá.** Cấp mã cho bốn ranh giới ngay trong bảng §10.1 — đề nghị `NFR-14`…`NFR-17`, hoặc một
dãy riêng `BD-1`…`BD-4` khai ở §0 — mỗi dòng giữ nguyên cột *"cách chặn"* làm tiêu chí nghiệm thu,
cộng một dòng chỉ định kiểm thử gọi thẳng tầng nghiệp vụ (`D25` đã đòi đúng thứ này). Việc này rẻ và
sửa được trong năm phút.

---

## High

### H1 · `FR-34` hứa "không bao giờ ghi đè" nhưng không có luật thứ tự giữa người và vòng quét 60 giây
*(loại 2 · `FR-34` dòng 629–637, `FR-38` dòng 666–668, `§3.2` dòng 163)*

`FR-34` là lời hứa mạnh nhất trong tài liệu: hệ thống *"**không bao giờ** ghi đè Việc tiếp theo do
người nhập tay"*. Cơ chế thực thi là đọc `next_action_set_by` rồi quyết định. `FR-38` có khoá, nhưng
khoá đó chỉ chặn **vòng quét với vòng quét** — *"một Công ty chỉ được một vòng xử lý tại một thời
điểm"*. Không có gì chặn **vòng quét với con người**.

**Tình huống làm nó lộ ra.** Ô Việc tiếp theo của Cơ hội X đang trống.

- `10:00:29` — Linh gõ *"Gọi lại anh Tanaka"* vào ô, chưa bấm Lưu.
- `10:00:30` — vòng quét đọc ô, thấy trống, `next_action_set_by` là `null` → đủ điều kiện tự điền.
- `10:00:31` — Linh bấm Lưu. Ô thành `nguoi`.
- `10:00:32` — vòng quét ghi giá trị của nó đè lên.

Máy vừa ghi đè người, đúng thứ `D12` cấm và `FR-34` gọi là *"không bao giờ"*. Không cần trùng
mili-giây: cửa sổ ở đây rộng bằng thời gian một lệnh gọi mô hình, tức vài giây. Với chu kỳ 60 giây
chạy suốt buổi demo, đây là sự kiện **sẽ** xảy ra chứ không phải có thể xảy ra.

Cùng lỗ hổng ấy trúng cả `FR-32`: Hoàn tác đọc *"giá trị trước đó"* từ một màn hình có thể đã cũ vài
chục giây.

**Cách vá.** Một câu ở `FR-34`, đủ để bước Kiến trúc không tự nghĩ ra ba cách khác nhau: *"Việc kiểm
`next_action_set_by` và việc ghi phải là **một thao tác nguyên tử**; nếu ô đã đổi kể từ lúc đọc thì
hệ thống **bỏ lượt ghi** và ghim một dòng đề xuất như trường hợp ô do người nhập."* Thêm một câu
tương tự cho `FR-32` (Hoàn tác chỉ chạy khi giá trị hiện hành đúng bằng giá trị máy đã ghi).

---

### H2 · Máy tự đặt lần thứ hai lên chính ô nó đã đặt — Hoàn tác "một cú bấm" không còn về được chỗ cũ
*(loại 1 · `FR-27` dòng 593–599, `FR-32` dòng 613–622, `FR-34` gạch 2 dòng 632, `FR-31` dòng 610)*

`FR-34` cho phép rõ ràng: *"Ô đang trống, **hoặc ô do chính hệ thống đặt trước đó**, thì tự điền"*.
Nên chuỗi tự đặt nối tiếp là hành vi hợp lệ. Nhưng `FR-32` chỉ đặc tả Hoàn tác cho **một** lần đặt:
*"Lùi **một bước**"*, và `D10` cấp *"mỗi Cơ hội **một** bản ghi tự đặt và **một** nút Hoàn tác"*.

**Tình huống làm nó lộ ra.** Cơ hội X có ô Việc tiếp theo trống.

1. `10:00` — tin gọi vốn. Máy điền *"Liên hệ trong ngày — Series B"*, hạn mai. Thông báo bật, nút
   Hoàn tác xuất hiện.
2. `10:02` — bản chụp có thêm tin tuyển dụng. Máy thấy ô là `he_thong`, được phép ghi đè, điền
   *"Liên hệ về đợt tuyển dụng"*, hạn 7 ngày.
3. Linh mở sản phẩm lúc `10:05`, thấy một Việc tiếp theo lạ, bấm Hoàn tác.

Cô lùi về **giá trị máy đặt ở bước 1**, không về ô trống. Nút Hoàn tác biến mất hay còn? Nếu còn thì
"một cú bấm" thành hai; nếu mất thì ô kẹt ở một giá trị máy đặt mà cô chưa từng chấp nhận. Đề bài
`§4/nhóm 4` cam kết *"sai thì **sửa lại bằng một cú bấm**, không phải đi khôi phục thủ công"* — đây
là chỗ cam kết đó vỡ.

Ba câu hỏi phụ đi kèm, đều không có đáp án trong PRD: lần đặt thứ hai có sinh thông báo thứ hai
không (`FR-31` nói thông báo *"không tự biến mất trước khi được xem"*, nên hai thông báo chồng nhau
là trạng thái có thật)? `undo_deadline` được tính lại từ lần đặt thứ hai hay giữ từ lần đầu (`§3.2`
dòng 164 định nghĩa nó là *"lúc máy ghi + tham số"*, mà "lúc máy ghi" giờ có hai giá trị)? Tỉ lệ hoàn
tác của `SM-2`/`FR-33` lấy mẫu số là số **lần đặt** hay số **ô bị đặt**?

**Cách vá.** Chọn một trong hai và viết ra: (a) **gộp** — lần tự đặt sau **thay thế** bản ghi tự đặt
đang mở thay vì chồng lên nó, Hoàn tác luôn lùi về giá trị **trước lần tự đặt đầu tiên còn trong cửa
sổ**, một thông báo được cập nhật chứ không nhân đôi; hoặc (b) **khoá** — trong khi còn một bản ghi
tự đặt chưa hết cửa sổ Hoàn tác, hệ thống **không đặt lại**, chỉ ghim dòng đề xuất như với ô người
nhập. (a) trung thành với `BR-D8` hơn; (b) rẻ hơn và không đụng `FR-31`.

---

### H3 · `BR-D8` không nói "cùng lúc" là bao lâu, nên tin ít gấp hơn đến sau sẽ **đẩy hạn ra xa**
*(loại 1 · `BR-D8` dòng 365, `FR-28` dòng 601–602, `FR-29` dòng 604–605, bảng `0.2.1`)*

`BR-D8` viết: *"**Nhiều tin cùng lúc**: lấy **hạn ngắn nhất**, nội dung Việc tiếp theo nhắc **mọi**
tin đã kích hoạt"*. Luật đúng — nhưng "cùng lúc" không được định nghĩa ở bất kỳ đâu: cùng một Bản
lưu? cùng một Vòng quét? trong cùng 24 giờ?

**Tình huống làm nó lộ ra.** Với chu kỳ 60 giây, hai tin của cùng một bản chụp *"sau"* rất dễ rơi vào
hai vòng khác nhau nếu `NFR-2` cắt vòng giữa chừng, hoặc nếu Phát hiện thứ hai được rút ở lần đọc
sau. Khi đó:

- Vòng 1 rút tin `funding` + `chac` + `high` → hạn **1 ngày làm việc** (bảng `0.2.1`).
- Vòng 2 rút tin `hiring` + `chac` + `high` → hạn **7 ngày làm việc**.

Vòng 2 thấy ô là `he_thong` nên được phép ghi đè (`FR-34`), và không có luật nào bắt nó so với hạn
đang có. Hạn trượt từ *ngày mai* sang *tuần sau* — đúng ngược với `FR-29` (*"Ngày hạn phản ánh độ
gấp"*) và với `BUS-3` (*"chạm được tín hiệu trong cửa sổ cơ hội của nó"*). Nội dung Việc tiếp theo
cũng chỉ còn nhắc tin tuyển dụng, mất tin gọi vốn — trái `BR-D8` vế sau.

**Cách vá.** Định nghĩa "cùng lúc" thành một điều kiện kiểm được, và biến `BR-D8` từ luật *một lần
tính* thành luật *bất biến*: *"Hạn của một Việc tiếp theo do hệ thống đặt **không bao giờ lùi ra
xa**; tin mới chỉ rút ngắn hạn, không kéo dài. Nội dung luôn nhắc **mọi** tin còn trong cửa sổ cơ hội
của nó."* Đây là cách phát biểu duy nhất không cần định nghĩa "cùng lúc".

---

### H4 · Phát hiện `high` ở Công ty **không có Cơ hội nào** rơi giữa hai nhánh — sơ đồ §4.2 và `FR-18` nói khác nhau
*(loại 1 · sơ đồ §4.2 dòng 195–206, `FR-18` dòng 539–550, `FR-27` dòng 593)*

Sơ đồ Nhánh máy phân đường theo hai trục trộn nhau:

```
├─ đáng chú ý + Công ty có Cơ hội mở ──→ TỰ ĐẶT Việc tiếp theo   ← chạm 1
├─ liên quan `medium` ────────────────→ Hàng đợi gợi ý           ← chạm 2
├─ liên quan `low` ───────────────────→ chỉ nằm ở vùng đọc
```

Một Phát hiện `high` + `chac` ở một Công ty **không có Cơ hội nào đang mở** không thoả nhánh 1 (thiếu
Cơ hội), không phải `medium` nên không thuộc nhánh 2, không phải `low` nên không thuộc nhánh 3. Nó
không có chỗ đi. Trong khi đó `FR-18` nói ngược: *"**Khi có Phát hiện mới về một Công ty**, hệ thống
sinh Gợi ý vào Hàng đợi gợi ý"*, và loại trừ duy nhất là `low`.

**Tình huống làm nó lộ ra.** Bộ dữ liệu BTC theo `§3` của đề bài có **12–15 Công ty và 8 Cơ hội**.
Kể cả khi mỗi Cơ hội thuộc một Công ty khác nhau và không cái nào đã đóng, vẫn còn **ít nhất 4–7
Công ty không có Cơ hội nào**. Mỗi Công ty đó vẫn có bản chụp *"sau"* mang tin `funding` hoặc
`leadership` — tức `relevance = high`. Đây không phải trường hợp biên, đây là **một phần ba tới một
nửa bộ dữ liệu**.

Hệ quả rất khác nhau giữa hai cách đọc: đọc theo sơ đồ thì tin gọi vốn quan trọng nhất của nửa số
Công ty **biến mất khỏi Hàng đợi**, và Sales chỉ thấy nó nếu tự mở vùng đọc — đúng thứ `§1` dựng ra
để tránh. Đọc theo `FR-18` thì Hàng đợi hoạt động bình thường.

**Cách vá.** `FR-18` đúng; sửa sơ đồ. Đổi nhánh 2 thành điều kiện tường minh *"`medium`, **hoặc**
`high` mà Công ty không có Cơ hội đang chạy"*, và thêm một gạch vào `FR-18`: *"Phát hiện `high` ở
Công ty không có Cơ hội đang chạy đi vào Hàng đợi với thứ hạng cao nhất của khoá thứ ba"* — khoá đó
(`Công ty có Cơ hội đang chạy hay không`) đã có sẵn trong bộ ba xếp hạng, nên không phải thêm cơ chế.

---

### H5 · Hai Gợi ý cùng trỏ vào một ô — không có luật giải mâu thuẫn, và "hiện tại" là ảnh chụp hay giá trị sống thì không nói
*(loại 1 + 3 · `FR-18` dòng 539–541, `FR-19` dòng 552–554, `FR-21` dòng 564–566, `FR-24` dòng 575–577)*

`FR-24` chống **trùng** (cùng nội dung), không chống **mâu thuẫn** (khác nội dung, cùng đích). `FR-19`
đòi mỗi Gợi ý hiện *"nội dung **hiện tại → đề nghị**"*, nhưng không nói "hiện tại" được chốt lúc sinh
Gợi ý hay đọc lúc hiển thị.

**Tình huống làm nó lộ ra.** Công ty A, ô *quốc gia* đang trống.

- `10:00` — Phát hiện từ bản lưu cũ sinh Gợi ý G1: *(trống) → Singapore*.
- `10:01` — Phát hiện từ bản chụp *"sau"* sinh Gợi ý G2: *(trống) → Japan*.
- `10:05` — Linh duyệt G2. Ô thành *Japan*.
- `10:06` — Linh duyệt tiếp G1, vốn vẫn đang hiển thị *"(trống) → Singapore"*.

Ô thành *Singapore*. Một cú bấm hợp lệ vừa **lùi dữ liệu về giá trị cũ hơn**, và màn hình đã nói dối
Linh: nó hiện "hiện tại = trống" trong khi ô đang là *Japan*. §6 xếp ô trống vào mức *xác nhận đơn*
và ô đã có giá trị vào mức *xác nhận kỹ* (buộc hiện diff, buộc chọn lý do) — nhưng phân loại đó được
tính lúc **sinh** Gợi ý, nên G1 mãi mãi đi đường *xác nhận đơn* dù ô đã không còn trống. `FR-21` chỉ
xử lý Gợi ý **cũ** (*"dựa trên bản lưu đã cũ"*), không xử lý Gợi ý **bị vượt mặt**.

Lựa chọn "ảnh chụp hay giá trị sống" là một quyết định kiến trúc khó đảo: nó quyết định Gợi ý là một
*bản vá* hay một *lệnh gán*, và đổi về sau thì phải viết lại cả hàng đợi lẫn màn hình.

**Cách vá.** Ba câu vào `FR-19`/`FR-21`: (a) *"hiện tại" luôn đọc **giá trị sống tại thời điểm hiển
thị**, không phải ảnh chụp lúc sinh*; (b) *nếu giá trị sống đã khác giá trị lúc sinh, Gợi ý **tự
nâng** lên mức xác nhận kỹ theo §6*; (c) *khi một Gợi ý được quyết, mọi Gợi ý đang chờ trỏ vào **cùng
một ô của cùng một Công ty** được đánh dấu là cần xem lại và hiện cạnh nhau, không xử lý độc lập*.

---

### H6 · Phát hiện `co_the` thuộc Loại tin `other` **phải** tự đặt theo `BR-D5` nhưng **không có hạn để đặt** theo bảng `0.2.1`
*(loại 4 · `BR-D5` dòng 362, `BR-D7` dòng 364, `FR-27` dòng 593, đối chiếu `0.1.5`, `0.2.1`)*

- `BR-D5` (chép đúng `D4`): *đáng chú ý = Độ liên quan `high` **và** Mức chắc chắn ∈ {`chac`,
  `co_the`}*.
- `FR-27`: Phát hiện đáng chú ý ở Công ty có Cơ hội mở thì *"tự điền Việc tiếp theo **và ngày hạn**
  ngay lập tức"*.
- `BR-D7`: *"Ngày hạn = f(Loại tin, Mức chắc chắn) theo bảng `0.2.1`"*. Hàng `other` của bảng đó ghi
  cột `co_the` là **"không đặt"**.

**Tình huống làm nó lộ ra.** `0.1.5` xếp `rfp` (RFP / tender / vendor shortlisting) là
`signal_subtype` của `other`, `relevance` mặc định **`high`** — và Mục 0 gọi nó là *"bằng chứng mua
hàng trực tiếp nhất có thể có"*. Một Phát hiện `rfp` với mức chắc chắn `co_the` (suy một bước từ
nguồn — đúng dạng của một tin RFP đọc từ trang tin tuyển thầu) là **đáng chú ý** theo `BR-D5`, nên
`FR-27` bắt tự điền; nhưng `BR-D7` không cho ra ngày hạn nào. `BR-B1` lại đòi Cơ hội đang mở phải có
**cả hai** ô.

Hệ thống rơi vào một trạng thái mà ba luật của chính PRD cấm đồng thời. Sáu trong mười ba
`signal_subtype` mang `relevance` `high` hoặc `medium` và tất cả đều đi qua hàng `other` của bảng
`0.2.1`, nên đây không phải một ô lẻ trong bảng.

Đây là **mâu thuẫn có sẵn trong nguồn** (`D4` rộng hơn bảng `0.2.1`), nhưng PRD chép cả hai vế mà
không hoà giải, trong khi PRD đã hoà giải chỗ khác (§10.2 với `D16`) — nên đây là chỗ nó bỏ sót,
không phải chỗ nó chọn im.

**Cách vá.** Thêm một gạch vào `BR-D7`: *"Loại tin `other` lấy ngày hạn theo `signal_subtype` chứ
không theo hàng `other`: subtype `relevance = high` dùng hàng `leadership`, `medium` dùng hàng
`hiring`."* Hoặc, rẻ hơn: *"Ô 'không đặt' trong bảng `0.2.1` chỉ áp cho Phát hiện **không** đáng chú
ý; Phát hiện đáng chú ý mà bảng không cho hạn thì lấy **trần 14 ngày làm việc** (`D7`)."* Cách nào
cũng được, nhưng phải chọn — và ghi ngược vào Mục 0 cùng lượt với hai việc đã có ở §14.4.

---

### H7 · `BR-D7` đánh rơi đường lui của `D5` khi không đọc được ngày sự kiện
*(loại 4 · `BR-D7` dòng 364, `§3.2` dòng 156–169, đối chiếu `D5`)*

`D5` nguyên văn: *"Ngày hạn = f(loại tin, mức chắc chắn) theo bảng 0.2.1, tính theo **ngày làm
việc**, đo từ **ngày sự kiện**. **Không đọc được ngày sự kiện thì lấy ngày của bản lưu. Lưu
`eventDate` tách khỏi `detectedAt`.**"

`BR-D7` của PRD chép hai câu đầu, trích đúng `D5`, và **bỏ cả hai câu sau**. §3.2 — bảng tự nhận là
nơi khai mọi trường PRD sinh ra — cũng không có dòng nào cho `eventDate` / `detectedAt`.

**Tình huống làm nó lộ ra.** Bản chụp là **tệp nội dung tĩnh** (`§3` đề bài), không phải một trang
tin có metadata. Một trang "About us" hay một mục "News" đã bị cắt ngày tháng là trường hợp bình
thường, không phải trường hợp hỏng. Khi đó `BR-D7` không có đầu vào: không có ngày sự kiện thì không
tính được ngày hạn, và cũng không tính được `D6` (*"tin quá cửa sổ cơ hội"*) vì cửa sổ cũng đo từ
ngày sự kiện. Toàn bộ nhóm 4 dừng, và `T-6` không có gì để kiểm.

Vế thứ hai bị rơi cũng đắt: nếu không tách `eventDate` khỏi `detectedAt`, mọi tin đọc lần đầu đều
trông như vừa xảy ra, nên `D6` **không bao giờ** gắn nhãn *"tin cũ"* — một nhánh hành vi của `FR-27`
chết lặng.

**Cách vá.** Chép nốt hai câu của `D5` vào `BR-D7`, và thêm hai dòng vào §3.2: `event_date` (mốc thời
gian, nullable, mặc định = ngày của Bản lưu khi không đọc được) và `detected_at` (mốc thời gian, bắt
buộc). Cả hai đều là trường PRD phải sở hữu vì `§3.2` đã tuyên bố sở hữu phần delta.

---

### H8 · Đổi bản chụp lùi về *"trước"* sinh ra một "tin mới" giả, và nó đi thẳng vào Dòng thời gian
*(loại 1 + 2 · `FR-50` dòng 497–502, `FR-11` gạch 3 dòng 491–494, `FR-36` dòng 653)*

`FR-50` cho phép *"Chuyển lùi về **trước** cũng làm được, để diễn lại kịch bản demo mà không phải nạp
lại dữ liệu"* — một tính năng đúng và cần. Nhưng `FR-11` định nghĩa "nội dung mới" là *"khác **bản
gần nhất**"*, so bằng hash của bản chuẩn hoá. So với **bản gần nhất**, không so với **toàn bộ lịch
sử**.

**Tình huống làm nó lộ ra.** Đúng kịch bản demo mà `FR-50` được viết ra để phục vụ:

1. Công ty A ở bản chụp *trước*. Bản lưu #1.
2. Giám khảo chuyển sang *sau* → Bản lưu #2 (khác #1) → Phát hiện *"gọi vốn Series B"* → chạm 1 tự
   đặt Việc tiếp theo, chạm 3 thêm mục Dòng thời gian. `T-6` xanh.
3. Đội bấm *"chuyển lùi về trước"* để diễn lại cho giám khảo thứ hai. Nội dung bằng #1 nhưng **khác
   #2**, tức "khác bản gần nhất" → **Bản lưu #3 được tạo**, hệ thống coi là có nội dung mới, rút Phát
   hiện, và **thêm một mục Dòng thời gian nữa**.
4. Chuyển lại sang *sau* → Bản lưu #4 → mục Dòng thời gian thứ ba, cùng một tin gọi vốn.

Sau ba lần diễn lại, Dòng thời gian của Công ty A có sáu mục *"do hệ thống thêm"* cho hai tin. Ngay
trước mắt giám khảo, và trên chính màn hình bán luận đề *"một dòng sai tệ hơn một dòng trống"*
(`BUS-2`). `FR-24` không cứu được vì nó chỉ áp cho Gợi ý.

**Cách vá.** Hai gạch. Ở `FR-11`: *"So hash với **mọi Bản lưu đã có của Công ty**, không chỉ bản gần
nhất; trùng bất kỳ bản nào thì không tạo Bản lưu mới, chỉ cập nhật thời điểm đọc gần nhất."* Ở
`FR-36`: *"Chỉ thêm mục Dòng thời gian cho Phát hiện **chưa từng** sinh mục cho Công ty đó — so bằng
dấu vân nội dung như `FR-24`."* Gạch thứ hai cũng là thứ `C2` cần.

---

## Medium

### M1 · `FR-19` xoá mất sự kiện "mở Gợi ý" mà `FR-23` đo từ đó
*(loại 1 · `FR-19` dòng 552–554, `FR-23` dòng 571–573, `§3.2` dòng 167, `FR-43` dòng 698)*

`FR-19` đòi mỗi Gợi ý hiện **đủ bốn thứ tại chỗ**, *"không phải bấm sang màn hình khác"*. `FR-23` và
`thoi_gian_quyet` lại đo *"mất bao nhiêu giây kể từ lúc **mở** Gợi ý tới lúc bấm"*.

**Tình huống làm nó lộ ra.** Bước UX làm đúng `FR-19`: Hàng đợi là một danh sách, bảy Gợi ý cùng hiện
đủ bốn thứ trên một màn hình. Không có thao tác "mở". Mốc bắt đầu của `thoi_gian_quyet` không tồn
tại. Người viết mã phải tự phát minh: tính từ lúc trang tải? từ lúc Gợi ý lọt vào khung nhìn? từ lúc
quyết Gợi ý trước đó? Ba lựa chọn cho ba con số khác nhau, và `FR-43` treo một ngưỡng cứng
(**< 3 giây**) lên con số đó, `T-5` thì kiểm nó có tồn tại.

**Cách vá.** Định nghĩa mốc bắt đầu ngay trong `FR-23`, chọn cái duy nhất không phụ thuộc bố cục:
*"đo từ lúc Gợi ý **hiện lần đầu trên màn hình của người quyết**; nếu nhiều Gợi ý cùng hiện thì mỗi
Gợi ý mang mốc riêng, và Gợi ý thứ n tính từ lúc người quyết xong Gợi ý thứ n−1."*

---

### M2 · `NFR-3` cho hệ thống tự tắt phần AI — ma trận §6 nói hệ thống **không bao giờ** làm việc đó
*(loại 1 + 4 · `NFR-3` dòng 746, §6 dòng 338, `FR-45`/`FR-47` dòng 708–718)*

Ma trận §6 có một dòng in đậm: *"**Tắt/bật toàn bộ phần AI** | Sales ❌ | Quản trị ✅ | Hệ thống ❌"*.
PRD gọi đó là một trong bốn khác biệt thật giữa hai vai, và §6 rút ra chỉ dẫn kiến trúc *"cần đúng
một điểm kiểm quyền ở tầng nghiệp vụ"*. `NFR-3` thì viết: *"**Chạm 100% thì phần AI tự tắt** như khi
bấm phanh `FR-45`"*.

**Tình huống làm nó lộ ra.** Bước Kiến trúc cài điểm kiểm quyền theo §6: hành động *tắt phần AI* chỉ
chấp nhận tác nhân `Quản trị`. Lúc ngân sách chạm trần, `NFR-3` gọi đúng hành động đó với tác nhân
`hệ thống` → bị chính điểm kiểm quyền từ chối. Phanh tự động không bao giờ nổ, và hệ thống chạy tiếp
qua trần ngân sách — im lặng, vì `NFR-3` không có đường xử lý dự phòng.

Hai câu hỏi phụ không có đáp án: lần tắt tự động có sinh bản ghi `FR-47` không, và mang danh tính
gì (§6 nói *"phần AI **không có** danh tính người dùng riêng"*)? Quản trị bật lại trong khi ngân sách
vẫn ở 100% thì có bị tắt lại ngay ở lệnh gọi kế tiếp không — vòng bật/tắt vô hạn, mỗi vòng một dòng
ghi vết?

**Cách vá.** Thêm một dòng vào ma trận §6: *"**Tự tắt phần AI khi chạm trần ngân sách** | ❌ | ❌ |
✅ — đây là ngoại lệ duy nhất, và nó **chỉ tắt được, không bật được**"*, cộng một câu ở `NFR-3`: lần
tắt tự động ghi vết với tác nhân `he_thong` và lý do `tran_ngan_sach`; Quản trị bật lại thì phải nâng
trần trước, nếu không hệ thống từ chối bật kèm thông báo lý do.

---

### M3 · `error-detection rate` có ba nguồn dữ liệu khác nhau tuỳ chỗ đọc, và một trong ba là tuỳ chọn
*(loại 4 · §3 dòng 134, `§3.2` dòng 165, `FR-42` dòng 693–696, `FR-40` dòng 675–679, đối chiếu `D30`)*

Ba chỗ nói ba điều:

| Chỗ | Nguồn của `error-detection rate` |
|---|---|
| `FR-42` | hai nút *hữu ích / không hữu ích* trên Phát hiện · lý do ngắn khi Sales xoá mục do hệ thống thêm |
| `§3.2` dòng `ly_do_bo` | *"`thong_tin_sai` là **một trong hai nguồn**"* — tức lý do **Bỏ một Gợi ý** |
| `D30` (nguồn) | giống `FR-42` |

`FR-42` và `D30` khớp nhau; `§3.2` giới thiệu một nguồn thứ ba mà `D30` không có. §3 dòng 134 mô tả
mập mờ đủ để đọc theo cả hai cách.

**Tình huống làm nó lộ ra.** Bước Kiến trúc cài bộ đếm. Đọc §3.2 thì `SM-4` cộng cả những lần Bỏ Gợi
ý với lý do `thong_tin_sai` — mà `FR-20` bắt buộc chọn lý do khi Bỏ, nên nguồn này **luôn đầy**. Đọc
`FR-42` thì nó chỉ cộng hai nguồn kia, mà một trong hai (`FR-40`, lý do khi xoá) chính PRD ghi là
***"tuỳ chọn, không chặn thao tác xoá"*** — nguồn có thể luôn rỗng. Cùng một buổi demo, hai cách cài
cho hai con số cách nhau cả bậc, và `SM-4` là số đo dùng để bảo vệ `BUS-2` ở vòng vấn đáp.

**Cách vá.** Chốt ba nguồn, không hai: nút *không hữu ích* trên Phát hiện · lý do `thong_tin_sai` khi
Bỏ Gợi ý · lý do khi xoá mục do hệ thống thêm. Viết công thức tường minh ở `FR-42` (tử số và mẫu số
đều liệt kê sự kiện nào tính), sửa §3.2, và ghi ngược vào `D30` cùng lượt với §14.4.

---

### M4 · Vòng quét bị `NFR-2` cắt giữa chừng vẫn được gọi là một vòng — trong khi §3 định nghĩa vòng là "khép kín trên toàn bộ"
*(loại 1 + 2 · `NFR-2` dòng 745, §3 dòng 137, `FR-38` dòng 666, `FR-39` dòng 670)*

§3 định nghĩa **Vòng quét** = *"Một lần chạy **khép kín trên toàn bộ** Công ty Đang theo dõi"*.
`NFR-2` thêm một trạng thái mới: *"Chạm trần thì **kết thúc vòng sớm**… vòng kế bắt đầu **từ Công ty
còn dở**, không quay về đầu danh sách"*. Một lần chạy nửa danh sách vẫn ghi một dòng `FR-39` và vẫn
được đếm là "một chu kỳ".

**Tình huống làm nó lộ ra.** 15 Công ty Đang theo dõi, mỗi Công ty tốn 2 lệnh gọi (một để rút Phát
hiện, một cho câu nhận định theo Loại công ty ở `FR-13`) → 30 lệnh, trần là 20. Vòng 1 quét Công ty
1–10, vòng 2 quét 11–15 rồi vòng lại 1–5. Công ty số 12 vừa đổi bản chụp phải **chờ hết vòng 1** mới
được nhìn tới. `T-8` đòi mục mới xuất hiện *"trong vòng **hai chu kỳ**"* và bộ kiểm thử sẽ đếm chu kỳ
bằng dòng Nhật ký — hai dòng Nhật ký ở đây **không** tương đương hai lần quét đủ.

**Cách vá.** Tách hai khái niệm trong §3: **Vòng quét** (đủ toàn bộ danh sách) và **Lượt quét** (một
lần chạy tới khi chạm trần). `FR-39` ghi cả hai, và `NFR-13`/bộ kiểm thử đếm theo **Vòng**, không
theo **Lượt**. Kèm một câu vận hành: ở chế độ demo, nếu số Công ty Đang theo dõi × chi phí mỗi Công
ty vượt trần thì màn hình Quản trị cảnh báo ngay khi bật nhãn, không đợi tới lúc chạm trần.

---

### M5 · `tam_dung` → `thua` ghi *Giai đoạn mở gần nhất* bằng gì — §5.1 và §3.2 nói ngược nhau
*(loại 3 · §5.1 dòng 279–281, `§3.2` dòng 158, §5.3 dòng 300–302)*

- §5.1, hàng *"Đang chạy **hoặc `tam_dung`** → `thua`"*, cột hành động: *"**Lưu Giai đoạn mở gần
  nhất**"*.
- §3.2, dòng `giai_doan_mo_gan_nhat`: *"Ghi **mỗi lần rời một giai đoạn đang chạy**"*, và §3 nói rõ
  trường này *"**Không bao giờ** nhận giá trị `tam_dung`"*.

Với đường `tam_dung → thua`, Cơ hội **không** rời một giai đoạn đang chạy, nên theo §3.2 không có gì
được ghi; nhưng §5.1 bảo ghi.

**Tình huống làm nó lộ ra.** Cơ hội X: `thuong_luong` → `tam_dung` (trường lưu `thuong_luong`) →
`thua`. Ba tháng sau Quản trị mở lại. §5.1 nói nó về *"**Đúng** Giai đoạn mở gần nhất"*. Nếu cài theo
§5.1 thì trường vừa bị ghi đè bằng `tam_dung` lúc sang `thua`, và §3.2 cấm giá trị đó → mở lại rơi
vào trạng thái không xác định. Nếu cài theo §3.2 thì Cơ hội về thẳng `thuong_luong`, **bỏ qua**
`tam_dung` — có lý về nghiệp vụ nhưng làm mất thông tin nó từng bị tạm dừng, và không ai viết ra điều
đó.

**Cách vá.** Sửa cột hành động của hàng đó trong §5.1 thành *"**Giữ nguyên** Giai đoạn mở gần nhất
nếu đi từ `tam_dung`; **lưu** nếu đi từ một giai đoạn đang chạy"*, khớp với §3.2. Một dòng, và nó
đóng nốt lỗ hổng cuối của máy trạng thái.

---

### M6 · Tập Công ty của một vòng quét là ảnh chụp hay đọc sống — ba tình huống, một quyết định
*(loại 2 · `FR-36` dòng 653, `FR-38` dòng 666, `FR-1` dòng 419–422, `FR-35` dòng 645, §4.3 dòng 245)*

`FR-36` nói vòng chạy *"trên toàn bộ Công ty Đang theo dõi"*. Danh sách đó được chốt lúc vòng bắt
đầu, hay hỏi lại trước mỗi Công ty? PRD không nói, và ba tình huống khác nhau đều dựa vào câu trả
lời:

1. **Xoá mềm giữa vòng.** Vòng đang ở Công ty thứ 5; Sales xoá Công ty thứ 9 (`FR-1`, cascade,
   `D26` đóng Gợi ý đang chờ). Vòng có ghi mục Dòng thời gian vào một Công ty đã xoá không? Bảng xoá
   ở §4.3 liệt kê ba thứ bị kéo theo và **không nhắc nhãn Đang theo dõi** — nên đọc chặt thì Công ty
   đã xoá **vẫn** nằm trong tập quét, vẫn tiêu lệnh gọi trong trần 20 của `NFR-2` mãi mãi.
2. **Tắt nhãn giữa vòng.** Sales bỏ theo dõi Công ty thứ 9 lúc vòng đang ở thứ 5. Vòng vẫn ghi? Nếu
   có thì `D17` bị phá: `D17` dùng nhãn này để tách chạm 2 với chạm 3, nên một Công ty vừa bị bỏ theo
   dõi có thể nhận cả mục tự thêm (chạm 3) lẫn Gợi ý *"thêm tin mới"* (chạm 2) cho cùng một tin.
3. **Bật nhãn giữa vòng.** Công ty mới bật có được quét trong vòng hiện tại không — `T-8` mở đầu bằng
   *"Bật Đang theo dõi cho ba công ty"* rồi đếm *"trong vòng hai chu kỳ"*, nên câu trả lời đổi ý
   nghĩa của "hai chu kỳ".

**Cách vá.** Một câu ở `FR-36`: *"Tập Công ty được chốt **lúc vòng bắt đầu**; trước khi ghi bất cứ
thứ gì cho một Công ty, hệ thống **kiểm lại** rằng Công ty đó chưa bị xoá mềm và vẫn mang nhãn Đang
theo dõi, không thoả thì bỏ qua và ghi một dòng vào Nhật ký."* Cộng một hàng vào bảng xoá §4.3: xoá
Công ty **tắt** nhãn Đang theo dõi.

---

### M7 · Xếp thứ tự và gom theo Công ty — cái nào là khoá ngoài, và `0.2.3` chen vào đâu
*(loại 3 · `FR-18` dòng 542–544, `0.2.3`, UJ-2 dòng 96)*

`FR-18` đã chốt được phép so (so lần lượt ba khoá, không phải phép nhân — đây là chỗ đã sửa theo bản
phản biện trước). Nhưng còn hai câu chưa có đáp án: **"gom theo Công ty"** đứng trước hay sau ba khoá
đó, và **trọng số hoàn thiện `0.2.3`** là khoá thứ tư hay một thang riêng.

**Tình huống làm nó lộ ra.** Hàng đợi có bảy Gợi ý như UJ-2 mô tả: Công ty A có một Gợi ý
`high`/`chac` và ba Gợi ý `low`… (giả sử `medium`); Công ty B có hai Gợi ý `high`/`co_the`. Hai cách
cài:

- **Gom trước:** xếp hạng Công ty theo Gợi ý tốt nhất của nó → khối A (4 Gợi ý, trong đó ba cái yếu)
  đứng trên toàn bộ khối B. Người dùng đọc ba Gợi ý yếu trước khi tới hai Gợi ý mạnh của B.
- **Xếp trước:** thứ tự đúng theo độ mạnh nhưng Gợi ý của A bị xé làm hai cụm — mất đúng lợi ích mà
  `D31` gom theo Công ty để có.

UJ-2 bán cả hai (*"đã xếp theo thứ tự ưu tiên **và** gom theo công ty"*) mà không nói cái nào thắng.
Bước UX sẽ vẽ một cái, bước Kiến trúc cài cái kia.

**Cách vá.** Viết ra một câu ở `FR-18`: *"**Gom theo Công ty là khoá ngoài cùng**; thứ hạng của một
Công ty bằng thứ hạng của Gợi ý mạnh nhất trong nhóm; trong một nhóm thì so ba khoá; riêng các Gợi ý
loại 'điền ô trống' trong cùng nhóm xếp theo trọng số `0.2.3`."*

---

### M8 · "Ô đã cũ" — đề bài đòi gợi ý sửa ô đã có giá trị, PRD không nói khi nào một ô là cũ
*(loại 1 + 3 · `FR-18` dòng 539–541, §6 dòng 325–326, đề bài `§4/nhóm 3`)*

Đề bài viết hai loại Gợi ý, loại thứ hai là *"điền hoặc sửa một ô **còn trống hoặc đã cũ**"*. PRD rút
thành *"điền hoặc sửa một ô"* và không nói gì thêm; §6 chỉ phân biệt **hậu quả** (ô trống → xác nhận
đơn, ô có giá trị → xác nhận kỹ), không nói **điều kiện kích hoạt**.

**Tình huống làm nó lộ ra.** Hồ sơ Công ty A ghi ngành = *"Logistics"*. Bản chụp *"sau"* viết
*"logistics & warehousing solutions"*. Mô hình có nên sinh Gợi ý sửa ô ngành không? Không có luật,
nên nó sẽ sinh — và làm y hệt cho quốc gia, quy mô, khoảng doanh thu, năm thành lập của cả 15 Công
ty. Vòng quét đầu tiên đổ **hàng chục** Gợi ý *"sửa ô đã có giá trị"* vào Hàng đợi, mỗi cái đều là
mức *xác nhận kỹ* (buộc hiện diff, buộc chọn lý do). Đó chính xác là chi phí chú ý mà §1 tồn tại để
cắt, và nó xảy ra ở phút thứ nhất của buổi demo.

`FR-24` không cứu: nó chống Gợi ý **mọc lại**, không chống đợt đầu.

**Cách vá.** Một gạch vào `FR-18`: *"Chỉ sinh Gợi ý sửa một ô **đã có giá trị** khi giá trị mới **mâu
thuẫn** với giá trị đang có (không phải khi nó chỉ chi tiết hơn hoặc viết khác đi), và Mức chắc chắn
đạt `chac`. Trùng nghĩa mà khác chữ thì không sinh Gợi ý."* Đây cũng là chỗ đáng gắn nhãn
`làm chặt hơn` với rủi ro nghiệm thu bằng không — không điểm `T` nào kiểm loại Gợi ý này.

---

### M9 · Xoá Cơ hội biến mất so với `D26`
*(loại 4 · `FR-3` dòng 427–431, §6 dòng 315, §4.3 bảng xoá dòng 245–249, đối chiếu `D26`)*

`D26` chốt: *"Xoá công ty là xoá mềm, kéo theo toàn bộ dữ liệu phụ thuộc… **Cơ hội cũng xoá được**"*.

PRD: `FR-3` cho *"tạo và **quản lý** Cơ hội"* (không nói xoá); ma trận §6 có hàng *"Tạo, sửa, xem
Công ty · Người liên hệ · Cơ hội"* — **không có xoá**, trong khi hàng ngay dưới là *"Xoá Công ty"* và
`FR-2` nói rõ *"tạo, sửa, **xoá** Người liên hệ"*. Nên việc bỏ xoá Cơ hội trông như có chủ đích,
nhưng không chỗ nào trong §11 hay §12.2 khai nó là ngoài phạm vi.

**Tình huống làm nó lộ ra.** Sales tạo nhầm một Cơ hội trong lúc demo, hoặc bộ dữ liệu BTC có một Cơ
hội trùng. Không có đường xoá, và cũng không có đường nào khác: `thua` đòi lý do và làm bẩn `FR-48`,
`tam_dung` giữ nó trong danh sách. Ngoài ra một Cơ hội bị xoá đang mang một bản ghi tự đặt còn trong
cửa sổ Hoàn tác thì bản ghi đó đi đâu — không có hàng nào trong bảng xoá §4.3.

**Cách vá.** Hoặc thêm *xoá mềm Cơ hội* vào `FR-3` cộng một hàng vào bảng §4.3 (bản ghi tự đặt và
thông báo `FR-31` bị đóng, giữ lại làm dữ liệu đo như `FR-40`), hoặc ghi một dòng vào §12.2 nói rõ
đây là chỗ PRD **cố ý** hẹp hơn `D26` và vì sao. Cách nào cũng được, im lặng thì không.

---

### M10 · Thứ tự cắt của §12.5 có thể cắt mất chân của một `phải có` và của một lời hứa "không bao giờ cắt"
*(loại 3 · bảng nhãn đầu §8 dòng 396–411, §12.5 dòng 898–906, `FR-10` dòng 463, `FR-48` dòng 466, `FR-19` dòng 552)*

Hệ thống nhãn ưu tiên là phần mới và tốt của bản này. Nhưng nó được suy ra theo **từng FR đứng
riêng**, trong khi vài FR phụ thuộc nhau:

- `FR-10` (**`phải có`**, màn hình tổng quan) liệt kê bốn khối, khối thứ tư là *"bảng thống kê lý do
  thua (`FR-48`)"* — mà `FR-48` là **`nên có`**. Cắt `FR-48` để lại một `phải có` không hoàn thành,
  và làm `BR-B3` (*"đứng ngoài bảng thống kê lý do thua"*) trỏ vào một bảng không tồn tại — đúng lỗi
  mà bản soát truy vết đã bắt một lần và PRD vừa sửa xong bằng cách thêm `FR-48`.
- `FR-19` (**`nên có`**, bốn thứ hiện tại chỗ) là **bề mặt duy nhất** đưa câu trích tới trước mắt
  người quyết Gợi ý. §12.5 lại liệt *"truy nguồn của Phát hiện"* vào nhóm ***không bao giờ cắt***.
  Cắt `FR-19` theo đúng thứ tự §12.5 thì Gợi ý còn ba nút và không còn bằng chứng — vi phạm chính
  dòng "không bao giờ cắt" ở ngay dưới.

§8 đã tự khai *"hai chỗ nhãn cãi được"* (`FR-14`, `FR-28`/`FR-29`); hai chỗ trên là loại thứ ba,
không phải nhãn sai mà là **phụ thuộc chưa được ghi**.

**Cách vá.** Thêm một cột hoặc một dòng ghi chú ở bảng tra §8.7: *"cắt FR này thì kéo theo…"* cho ba
cặp `FR-10 ← FR-48`, `FR-18/FR-20 ← FR-19`, `T-3 ← FR-14`. Ba dòng, và câu hỏi lúc 11 giờ trưa trả
lời được thật trong ba mươi giây như §8 hứa.

---

## Low

### L1 · Máy ghi thì ghi vết dưới danh tính nào
*(loại 3 · `FR-49` dòng 472–475, `NFR-10` dòng 753, §6 dòng 333, `FR-33` dòng 624)*

`FR-49` viết *"**mọi** bản ghi ghi vết đều mang danh tính của phiên đang đăng nhập"*; `NFR-10` đòi
100% cả *"mọi lần người quyết"* lẫn *"mọi lần **máy ghi**"*; §6 nói phần AI *"**không có** danh tính
người dùng riêng"*. Ba câu này không cùng đứng được. Máy ghi không có phiên đăng nhập, nên hoặc
`FR-49` sai chữ "mọi", hoặc cần một chủ thể hệ thống được khai. `FR-33` ghi *"Phát hiện nào kích
hoạt"* nhưng không có ô "ai ghi".

**Cách vá.** Sửa `FR-49` thành *"mọi bản ghi ghi vết **do người tạo ra**"*, và thêm vào §3.2 một
trường `tac_nhan` (enum `nguoi:<id>` · `he_thong`) dùng chung cho `FR-33`, `FR-47`, `NFR-3`.

---

### L2 · "Lưu trữ nguội" cho Bản lưu thứ 21 trở đi vẫn phải phục vụ được `T-3`, trong một triển khai không có tầng thứ hai
*(loại 3 · §4.3 dòng 254–258, §12.3 dòng 878)*

Luật lưu giữ nói Bản lưu cũ nhất *"chuyển sang **lưu trữ nguội**, không xoá — `T-3` cần nó để mở đúng
đoạn nguồn"*. Nhưng §12.3 ràng buộc *"không cloud, không staging, chạy local"*. Vậy "nguội" là gì —
một bảng khác? tệp trên đĩa? cùng bảng với một cờ? Và nếu `T-3` phải mở được nó thì độ trễ truy cập
phải như bản nóng, tức "nguội" không mang ý nghĩa gì ngoài một cột.

**Cách vá.** Hoặc bỏ chữ *"lưu trữ nguội"* và viết *"đánh dấu là đã lưu trữ, vẫn đọc được ngay"*,
hoặc bỏ luôn trần 20 — với bản chụp tĩnh và luật `D18`, mỗi Công ty chỉ sinh **hai** Bản lưu thật,
nên trần 20 không bao giờ chạm tới và đang mua một cơ chế không dùng.

---

### L3 · §3.2 tự phá quy ước đặt tên của chính nó
*(loại 3 · `§3.2` dòng 153–169)*

Ngay trên bảng, PRD chốt *"Quy ước đặt tên: `snake_case`… Bước Kiến trúc đổi sang quy ước của stack
thì đổi **một lần, toàn bộ** — đừng trộn hai kiểu."* Trong bảng đó có `nextAction.overwriteOverdueManual`
(camelCase **và** có dấu chấm phân cấp) và ô mô tả của `relevance` viết `signalSubtype` trong khi
dòng ngay trên viết `signal_subtype`. Trộn hai kiểu ngay trong bảng dựng ra để chặn việc trộn hai
kiểu là chỗ bước Kiến trúc sẽ dừng lại hỏi.

**Cách vá.** `overwrite_overdue_manual` (hoặc giữ nguyên nhưng khai rõ đây là **khoá tham số**, khác
loại với **trường dữ liệu**, và tách thành một bảng con), và sửa `signalSubtype` → `signal_subtype`.

---

### L4 · Quản trị được phép Duyệt / Bỏ Gợi ý nhưng không sở hữu Hàng đợi nào
*(loại 1 · §6 dòng 327, §3 dòng 135, `FR-18` dòng 539, `FR-31` dòng 610)*

§3 định nghĩa Hàng đợi gợi ý là *"**một trên mỗi người sở hữu**"*, `FR-18` sinh Gợi ý *"vào Hàng đợi
gợi ý **của người sở hữu**"*, và §11 xác nhận người sở hữu là một tài khoản **Sales**. Ma trận §6 lại
cho Quản trị ✅ ở *"Duyệt · Sửa-rồi-duyệt · Bỏ một Gợi ý"*.

**Tình huống làm nó lộ ra.** Giám khảo đăng nhập bằng tài khoản Quản trị — tài khoản duy nhất được
cấp cho vai vận hành — và muốn thử `T-5`. Màn hình Hàng đợi của họ trống, vì họ không sở hữu Công ty
nào. Không có gì trong PRD nói Quản trị nhìn được hàng đợi của Sales.

**Cách vá.** Một câu ở `FR-18` hoặc §6: *"Quản trị thấy **hàng đợi gộp của mọi người sở hữu**; thao
tác quyết của Quản trị ghi vết với danh tính của chính họ."* Rẻ, và nó cũng là thứ `FR-43` (khối cảnh
báo duyệt mù) cần để có nghĩa với một người không phải người duyệt.

---

## Chỗ tôi đi tìm mà không thấy gì đáng báo

Ghi ra để lượt sau không đi lại:

- **Bốn ranh giới `§5` về mặt nội dung** — §10.1 phủ đủ bốn, `D25` được áp đúng, cái bẫy của ranh
  giới 3 được nêu. Vấn đề duy nhất là định danh (`C3`), không phải nội dung.
- **Bảy Giai đoạn và bảng chuyển tiếp §5.1** — sau các lần sửa, máy trạng thái đóng kín trừ đúng một
  ô (`M5`). Trạng thái khởi đầu có, mọi chuyển tiếp có điều kiện canh, hàng cấm tác nhân hệ thống có.
- **Đường tắt AI ↔ nhóm 1** — `T-1` và `T-9` được phục vụ nhất quán ở `FR-45`, `FR-46`, §8.1 và
  §4.2; không tìm được chỗ nhóm 1 phụ thuộc ngược vào tầng AI.
- **Enum và bảng số** — mọi enum PRD dùng đều tra được về `0.1.1`–`0.1.7`; không có enum thứ hai, không
  có giá trị bịa. Mâu thuẫn duy nhất tìm được là `H6`, và nó vốn có sẵn trong nguồn.
- **`§7` điều kiện nộp bài** — §12.4 xử lý minh bạch hai điều kiện nằm ngoài; không tìm thêm được chỗ
  nào của `§7` rơi.
