---
title: "Phản biện chất lượng PRD — Why Now"
status: review
created: 2026-08-14
updated: 2026-08-14
---

# PRD Quality Review — Why Now (CRM AI-Native cho Sales HBLAB)

## Overall verdict

Đây là một PRD **trên mức trung bình rõ rệt**: nó có luận đề thật (cắt chi phí chú ý chứ không dời
nó), biết mình tồn tại để làm gì (§0 nêu đúng ba thứ nó thêm vào), và ba mục §5–§7 là đóng góp có
giá trị thật cho bước Kiến trúc chứ không phải nội thất. Không có persona theater, không có NFR
tính từ, và bộ số đo đối trọng ở §13.3 là thứ hiếm gặp.

Cái đang rủi ro nằm ở **hai chỗ nó sẽ được đọc kỹ nhất**: bảng chuyển tiếp §5.1 — mục cờ hiệu của
chính PRD này — có một hàng tự mâu thuẫn với bốn chỗ khác trong tài liệu, và từ *"đang mở"* mang
hai nghĩa khác nhau ở những nơi luật nghiệp vụ dựa vào nó. Cộng thêm một khoảng trống ở tầng quyết
định: 47 FR đi vào một cửa sổ 4,5 tiếng mà **một nửa quỹ giờ đã được giữ trống** cho tính năng chưa
biết, nhưng không FR nào được xếp hạng ưu tiên — nghĩa là việc de-scope sẽ xảy ra lúc 11 giờ trưa
ngày 15/8, do người viết mã quyết, không do PRD quyết.

Đây là những lỗi sửa trong một giờ. Nhưng nếu không sửa trước khi bước UX và Kiến trúc đọc, mỗi lỗi
sẽ hoá thành một quyết định ngầm nằm trong mã.

---

## 1. Decision-readiness — **adequate**

Chiều này gần mạnh. PRD **nói ra quyết định như quyết định**, không giấu chúng thành "cân nhắc".
§5.2 là ví dụ mẫu: nó tự dán nhãn `làm chặt hơn` cho việc giới hạn mở lại Cơ hội, nêu lý do, rồi
đối chiếu ngược `T-1`…`T-10` để kết luận rủi ro nghiệm thu bằng không. FR-26 làm y hệt với nhãn
`mở rộng ngoài đề bài`. FR-34 còn tốt hơn: nó **tự nêu một rủi ro có thể làm hỏng điểm `T-6`** —
*"nếu dữ liệu BTC điền sẵn Việc tiếp theo cho cả 8 Cơ hội thì `T-6` không còn ô trống nào để tự
điền"* — và chỉ đường xử lý kèm cờ `nextAction.overwriteOverdueManual`. Đó là thứ một người phản
biện đi tìm mà thường không thấy.

§14 cũng là câu hỏi mở thật, không phải câu hỏi tu từ: `Q15` được gọi đúng tên *"câu chặn duy nhất
còn lại"* và thuộc bên thứ ba, không tự trả lời được.

Chỗ hụt là chỗ lớn nhất. §12.3 ghi ràng buộc *"4,5 tiếng ngày 15/8"* và *"`D41` đã giữ trống một
nửa quỹ giờ"* cho một tính năng chưa biết nội dung. §12.1 ngay phía trên đó ghi phạm vi là
*"Sáu nhóm tính năng `§4` với 47 FR ở §8"*, phẳng, không thứ tự. Hai câu này đứng cách nhau một
mục và không nói chuyện với nhau. Người đọc PRD để ra quyết định **không có căn cứ nào trong tài
liệu** để trả lời câu duy nhất sẽ được hỏi lúc 11 giờ trưa: bỏ cái gì trước.

Đáng chú ý là brief đã có sẵn nguyên tắc này — addendum mục 1 viết *"Suy giảm theo **rủi ro và mức
độ đảo ngược được**, không theo lịch"* — nhưng PRD **không mang nó xuống** thành nhãn trên từng FR.

### Findings

- **critical** Không có xếp hạng ưu tiên trên 47 FR (§12.1, đối chiếu §12.3) — §12.1 liệt kê phạm
  vi là *"47 FR ở §8"* dưới dạng một danh sách phẳng, trong khi §12.3 xác nhận cửa sổ *"4,5 tiếng"*
  và *"`D41` đã giữ trống một nửa quỹ giờ"*. Suy ra ngân sách thực cho 47 FR là ~2,25 tiếng. Vì
  không có nhãn ưu tiên, bước Epic & Story không có cơ sở xếp thứ tự, và việc de-scope sẽ do người
  viết mã quyết tại chỗ — tức là quyết định phạm vi bị đẩy xuống tầng thấp nhất, đúng lúc áp lực
  cao nhất. *Fix:* gắn một cột `phải có / nên có / bỏ được` cho từng FR ở §8, dẫn xuất từ hai căn
  cứ đã có sẵn — (a) FR nào bị `T-1`…`T-10` kiểm trực tiếp thì `phải có`, (b) nguyên tắc *"suy giảm
  theo rủi ro và mức độ đảo ngược được"* của addendum mục 1 cho phần còn lại. Thêm một dòng ở §12.3
  nêu rõ tuyến bỏ đầu tiên nếu tính năng BTC phát ra nặng hơn dự trù.
- **medium** `NFR-2` và `NFR-3` không có đường xử lý khi vi phạm (§9) — `NFR-2` đặt trần *"≤ 20
  lệnh"* mỗi Vòng quét và `NFR-3` *"cảnh báo ở 80%"*, nhưng cả hai không nói **chạm trần thì hệ
  thống làm gì**: bỏ nốt các Công ty còn lại trong vòng, huỷ vòng, hay chạy tiếp và vượt trần. So
  sánh với §7.2, nơi mọi `BR-B` đều có cột *"Khi vi phạm thì sao"* — hai NFR này thiếu đúng cột đó.
  Với 12–15 Công ty Đang theo dõi (addendum mục 2.2), trần 20 lệnh là mức chật, nên tình huống chạm
  trần không phải giả thuyết. *Fix:* thêm một dòng cho mỗi NFR: dừng vòng sạch, ghi lý do vào Nhật
  ký vòng quét (FR-39 đã có cột *"có lỗi gì"*), Công ty chưa quét được ưu tiên ở vòng sau.

---

## 2. Substance over theater — **strong**

Không có gì để gỡ ở đây, và cần nói rõ tại sao chứ không chỉ nói là mạnh.

**Không có persona theater.** Hai vai, mỗi vai 3–4 dòng ở §2.1, và mỗi dòng **kéo được về một FR
cụ thể**: *"Sửa lại thứ máy làm sai bằng một cú bấm"* → FR-32; *"Có một cái phanh dừng toàn bộ phần
AI"* → FR-45. §2.2 còn làm việc khó hơn là liệt kê ai **không** phải người dùng, kèm lý do có
nguồn.

**Không có NFR theater.** Cả 13 dòng §9 đều có cột ngưỡng số và cột cách đo. Câu mở đầu *"Dòng nào
chỉ có tính từ thì không kiểm được, nên không có dòng nào như vậy ở đây"* là một lời tự cam kết, và
tài liệu giữ được nó — tôi đã rà từng dòng và không tìm ra dòng nào chỉ có tính từ.

**Không có innovation theater.** Brief đã nói thẳng *"Không có hào công nghệ, và không nên bịa ra
một cái"*, và PRD §1 giữ đúng lập trường: điểm khác biệt được nêu là một **lựa chọn thiết kế**
(ranh giới tự ghi), không phải một năng lực kỹ thuật. FR-12 còn trả giá cho lập trường đó bằng một
luật tự cắt sản lượng của chính mình — *"Câu trích không khớp nguyên văn thì **loại bỏ Phát hiện**"*.

**Tầm nhìn §1 không hoán đổi được sang PRD khác.** Nó đặt tên nguyên nhân gốc (đọc tin tăng tuyến
tính, quỹ giờ cố định) và nêu điều kiện tiên quyết đứng trước quyền tự ghi. Không có câu nào thuộc
loại *"nền tảng hàng đầu"*.

Một quan sát nhỏ, không đủ thành phát hiện: §1 lặp lại gần nguyên văn *Tóm tắt điều hành* của brief.
Xét theo §0 — *"Nó không định nghĩa lại thứ đã có nguồn"* — đây là chỗ duy nhất PRD hơi tự mâu
thuẫn với nguyên tắc của mình. Nhưng một PRD cần đứng một mình được, nên tôi coi việc lặp này là
đúng, không phải nội thất.

---

## 3. Strategic coherence — **adequate**

Luận đề rõ và **được bảo vệ nhất quán từ đầu đến cuối**: chi phí thật là chú ý của con người, nên
một hệ thống đẩy toàn bộ sản lượng vào hàng đợi chỉ *đổi tên công việc*. §1 nêu nó, §4 vẽ nó thành
ba chỗ chạm, §10.2 rút nó thành một quy tắc một dòng (*"thêm thì tự do, ghi đè thì phải duyệt"*),
và §11 dùng nó để loại bỏ tính năng. Đó là một arc thật, không phải backlog có tiêu đề.

Bộ số đo đối trọng §13.3 là phần mạnh nhất của mục này. `SM-C2` bắt đúng cách gian lận rẻ nhất
(tăng số Phát hiện để đẩy tử số của SM-1), `SM-C4` bắt đúng cái bẫy ngược (*"Tỉ lệ hoàn tác thấp có
thể nghĩa là máy đúng, cũng có thể nghĩa là không ai nhìn"*), và `SM-C3` thậm chí đối trọng với
**cách chấm** chứ không chỉ với sản phẩm.

Cái làm chiều này tụt khỏi *strong* là: **số đo dùng để nghiệm luận đề bị định nghĩa sai.** SM-1 là
dòng PRD tự gọi là *"số đo duy nhất đo đúng nguyên nhân gốc ở §1"*, và nó lại là dòng thiếu chặt
nhất trong cả §13.

### Findings

- **high** SM-1 tự mâu thuẫn ở dòng *"Nghiệm"* (§13.1) — SM-1 tên là *"Tỉ lệ Phát hiện được xử lý
  **không cần người quyết**"* nhưng ghi *"Nghiệm FR-27, FR-18"*. FR-18 là *"Sinh Gợi ý vào Hàng đợi
  có thứ tự"*, tức đường **bắt buộc phải có người quyết** — FR-21 nói thẳng *"không có chế độ tự
  duyệt"*. Ngược lại FR-36, đường tự thêm mục Dòng thời gian (chạm 3) và là đường thật sự không cần
  ai bấm, **không** được liệt kê. *Fix:* đổi thành *"Nghiệm FR-27, FR-36"*.
- **high** Tử số của SM-1 không định nghĩa được (§13.1, đối chiếu §4) — SM-1 ghi *"Số lần tự ghi
  trên tổng số Phát hiện"*, trong khi §4 định nghĩa **ba** chỗ máy ghi: chạm 1 (tự đặt Việc tiếp
  theo), chạm 2 (Hàng đợi — có người bấm), chạm 3 (tự thêm Dòng thời gian). *"Số lần tự ghi"* không
  nói gồm chạm nào. Hệ quả cụ thể: nếu tử số gồm chạm 3 thì SM-1 đẩy lên được **bằng cách bật nhãn
  Đang theo dõi cho toàn bộ Công ty**, vì chạm 3 kích hoạt theo nội dung mới chứ không theo phán
  đoán — và không số đo đối trọng nào ở §13.3 bắt được vector đó (`SM-C2` đếm Phát hiện, không đếm
  Công ty theo dõi). *Fix:* viết công thức tường minh, ví dụ tử số = (số lần tự đặt Việc tiếp theo
  theo FR-27) + (số mục Dòng thời gian tự thêm theo FR-36), mẫu số = tổng Phát hiện sinh trong cùng
  cửa sổ; và bổ sung một đối trọng *tỉ lệ Công ty mang nhãn Đang theo dõi*.
- **high** `auto-accept rate` chưa bao giờ được định nghĩa, và có vẻ trùng với chính thứ nó đối
  trọng (§13.2 SM-3, §13.3 SM-C1, FR-42) — `SM-C1` ghi *"`auto-accept rate`. Đối trọng **SM-3**"*,
  còn SM-3 là *"Tỉ lệ Gợi ý được duyệt. > 85%"*. Nếu hai đại lượng này là một, thì cấu trúc đối
  trọng rỗng: một số đo không thể đối trọng chính nó. Nếu chúng khác nhau, PRD không nói khác ở
  đâu — `auto-accept rate` không có trong §3 Từ vựng, không có công thức ở §13, và FR-41 chỉ liệt
  kê *"tỉ lệ duyệt"* bằng tiếng Việt mà không nói đó có phải cùng một số hay không. *Fix:* đưa
  `auto-accept rate` vào §3 với công thức, hoặc bỏ hẳn cụm tiếng Anh và dùng *tỉ lệ duyệt* thống
  nhất; nếu chúng thực sự là một số, thay `SM-C1` bằng đối trọng đúng — *thời gian quyết trung
  bình*, thứ §13.3 đã mô tả đúng vai trò mà lại đặt nhầm tên.

---

## 4. Done-ness clarity — **adequate**

Đây là chiều tôi soi kỹ nhất, và kết quả tốt hơn dự đoán. Phần lớn FR có **hệ quả kiểm được**, và
vài chỗ đạt mức hiếm:

- FR-13 tự dựng ra một phép kiểm mà đề bài không có: *"Cùng một câu trích với hai Loại công ty phải
  cho hai câu nhận định khác nhau, mỗi câu chứa tên Loại công ty"*. Đó là một oracle xác định.
- FR-20 biến một nguyện vọng UX thành ràng buộc đếm được: *"Số thao tác để Bỏ không được nhiều hơn
  số thao tác để Duyệt"*, và tự nói rõ *"không phải nguyện vọng"*.
- FR-23 đòi ghi *"mất bao nhiêu giây kể từ lúc mở Gợi ý tới lúc bấm"* — một đại lượng đo được, và
  nối thẳng sang ngưỡng ở FR-43.
- FR-24 không dừng ở "chống trùng" mà cho luật: *"dấu vân nội dung"* cộng *"cosine ≥ 0,9 trong cửa
  sổ 30 ngày"*.

Tôi đã rà tìm các cụm *"xử lý một cách phù hợp"*, *"hiệu năng hợp lý"*, *"thân thiện"* và **không
tìm thấy dòng nào**.

Nhưng bốn chỗ dưới đây là chỗ người viết mã sẽ **buộc phải tự phát minh ra luật**, và cái họ phát
minh sẽ thành hành vi sản phẩm.

### Findings

- **high** Công thức xếp thứ tự Hàng đợi không phải một công thức (FR-18) — *"Hàng đợi **có thứ
  tự**: Độ liên quan × Mức chắc chắn × (Công ty có Cơ hội mở hay không)"*. Dấu `×` giữa ba đại
  lượng **enum** không xác định được phép toán: sắp xếp từ điển theo thứ tự ba khoá, hay tích số
  với trọng số? Nếu là tích số thì trọng số của `chac` / `co_the` / `doan` và của `high` / `medium`
  / `low` không có ở đâu trong PRD. Đây không phải chi tiết trang trí: UJ-2 bán đúng giá trị này
  (*"đã xếp theo thứ tự ưu tiên"*), và hai người viết mã khác nhau sẽ cho ra hai Hàng đợi khác
  nhau. *Fix:* chọn một trong hai và viết ra — đề nghị sắp xếp từ điển với thứ tự khoá cố định
  (Công ty có Cơ hội mở → Độ liên quan → Mức chắc chắn), rồi gom theo Công ty như `D31` đã đòi; nếu
  là tích số thì đưa bảng trọng số vào `0.2.3` và dẫn chiếu.
- **high** *"Nội dung mới"* không có luật so sánh (FR-11, FR-36) — FR-11 ghi *"Chỉ tạo Bản lưu mới
  khi nội dung **khác** bản gần nhất (`D18`)"* và FR-36 ghi *"so với Bản lưu gần nhất → **có nội
  dung mới** thì rút Phát hiện"*. *"Khác"* ở mức nào: khác một byte, khác sau khi chuẩn hoá khoảng
  trắng, hay khác về ngữ nghĩa? Đối chiếu FR-24, vốn cho luật rất chặt cho việc chống trùng **Gợi
  ý** (`cosine ≥ 0,9`), thì việc FR-11/FR-36 không cho luật tương đương cho **Bản lưu** là một
  khoảng trống lệch hẳn. Hệ quả trực tiếp lên `T-8`: một thay đổi vô nghĩa ở dấu thời gian trong
  trang chụp sẽ khiến mọi vòng quét đều thấy *"nội dung mới"* và tự thêm mục Dòng thời gian mỗi 60
  giây. *Fix:* nêu luật ở FR-11 — so sánh trên **bản đã chuẩn hoá** (mà chính FR-11 đã đòi lưu),
  bằng hash toàn văn, cộng danh sách trường bị loại trừ khỏi hash (dấu thời gian, mã phiên).
- **medium** Hoàn tác gặp ô đã bị người sửa tay: không có luật (FR-32, đối chiếu FR-34) — FR-32 nói
  Hoàn tác *"Đưa Việc tiếp theo và ngày hạn về **đúng** giá trị trước đó"* trong 7 ngày, và *"Lùi
  **một bước**"*. Nhưng nếu hệ thống tự điền vào ô trống (FR-27), rồi người sửa tay ô đó, rồi bấm
  Hoàn tác — thì *"giá trị trước đó"* là ô trống, và cú bấm sẽ **xoá mất thứ người vừa gõ**. Điều
  đó đi ngược tinh thần FR-34 (*"Hệ thống **không bao giờ** ghi đè Việc tiếp theo do người nhập
  tay"*), dù về hình thức FR-34 chỉ nói về tác nhân hệ thống. *Fix:* thêm một gạch đầu dòng ở
  FR-32: nút Hoàn tác **biến mất** ngay khi ô bị người sửa tay, vì bản tự đặt không còn là giá trị
  hiện hành. Rẻ hơn cả hai phương án còn lại và giữ đúng lời hứa *"lùi một bước"*.
- **medium** Phanh không nói gì về Gợi ý đang chờ (FR-45, FR-46) — FR-45 liệt kê bốn thứ dừng lại
  (*"Vòng quét dừng · không sinh Phát hiện mới · không sinh Gợi ý mới · không tự đặt Việc tiếp
  theo"*) và cam kết *"Dữ liệu đã sinh không bị xoá"*, nhưng không nói **Hàng đợi còn bấm được
  không**. Đây là câu giám khảo `T-9` có thể hỏi trực tiếp, và hai cách cài đặt đều bảo vệ được —
  nghĩa là PRD đang bỏ ngỏ đúng một chỗ đáng lẽ nó phải chốt. *Fix:* thêm một dòng: Gợi ý đang chờ
  **vẫn duyệt/bỏ được** (chúng là dữ liệu đã sinh, và FR-45 đã cam kết không xoá), chỉ việc **sinh
  mới** bị dừng.
- **low** Chu kỳ quét không nói đo từ đâu (FR-37, `NFR-1`, FR-38) — mặc định *"60 giây"* nhưng
  không nói là khoảng cách **đầu-đến-đầu** hay **cuối-đến-đầu**. Với `NFR-1` đặt trần thời lượng
  đúng bằng 60 giây và FR-38 cấm chồng vòng, hai cách hiểu cho hai nhịp demo khác nhau. *Fix:* ghi
  rõ cuối-đến-đầu, và hạ trần `NFR-1` xuống một giá trị nhỏ hơn chu kỳ (ví dụ ≤ 45 giây) để có
  biên.

---

## 5. Scope honesty — **adequate**

Việc bỏ ra được nói ra, không để người đọc tự suy. §11 *Không làm gì* làm việc thật: mỗi dòng có lý
do, và hai dòng trong đó là **lý do sản phẩm chứ không phải lý do thời gian** — *"Không thành một
công cụ báo cáo cho cấp trên. Nếu Sales coi nhập liệu là thuế phải nộp thì họ sẽ trốn"*. §12.2 gắn
mã `F` cho từng mục bị bỏ, và dòng `F30` *"Giao diện vượt khỏi dạng biểu mẫu"* tự nhận là *"Rủi ro
đã biết cho vòng 3, **chấp nhận có ý thức**"* — đó là de-scope trung thực, không phải de-scope im
lặng. Dòng `F28` mang đúng một `[NOTE FOR PM]`, đặt tại chỗ căng thật (*"mục dễ bị giám khảo vòng 3
hỏi nhất"*), không phải ở một trạm kiểm an toàn.

Mật độ mục mở là **đúng cỡ cho mức cược này**: 5 câu hỏi mở, trong đó chỉ một câu chặn và nó thuộc
BTC; 5 giả định ở §15 và **cả 5 đều đã đóng** (*"✅ đã xác nhận 14/8"*). Với một PRD sắp bật đèn
xanh cho xây, đó là con số lành mạnh.

Hai chỗ hụt, và cả hai đều thuộc dạng *"bỏ ngỏ mà không đánh dấu là đang bỏ ngỏ"*.

### Findings

- **medium** Năm giả định `A1`–`A5` không có dấu vết tại chỗ (§15, đối chiếu §5.1, §5.2, §6) —
  §15 chỉ ra `A1` nằm ở §5.1, `A2` ở §5.1 và §5.3, `A4` ở §6, nhưng **không mục nào trong số đó
  mang nhãn `[ASSUMPTION]` nội tuyến**. Chiều đi từ mục lục xuống mục thì thông; chiều ngược lại
  thì không. Người đọc §5.1 một mình — mà bước Kiến trúc sẽ đọc đúng như vậy — không phân biệt được
  hàng nào chép từ đề bài và hàng nào do đội tự chốt ngày 14/8. Điều đó làm hỏng đúng lời cam kết ở
  §0 rằng mọi thứ đều truy được về một trong ba nguồn. *Fix:* gắn `[A1]`…`[A5]` vào đúng ô/hàng
  tương ứng, giống cách các mã `D` đang được gắn.
- **medium** Không có `[NON-GOAL for MVP]` tại chỗ dễ bị ngầm định nhất (§8.3, §8.6) — §11 và §12.2
  gom hết việc bỏ vào cuối tài liệu, nên một người chỉ đọc §8 sẽ không thấy chúng. Hai chỗ đáng gắn
  nhất: FR-18 (*"điền hoặc sửa một ô trong hồ sơ Công ty"*) rất dễ bị bước UX hiểu thành có xử lý
  hàng loạt — trong khi FR-20 chỉ cho ba nút cho **một** Gợi ý, và duyệt hàng loạt sẽ phá thẳng
  ngưỡng duyệt mù ở FR-43; và FR-41 rất dễ bị hiểu thành có xuất báo cáo. *Fix:* thêm
  `[NON-GOAL for MVP]` cho *duyệt hàng loạt* dưới FR-20 và cho *xuất báo cáo* dưới FR-41.

---

## 6. Downstream usability — **adequate**

Chiều này quan trọng nhất với PRD đầu chuỗi, và ở đây có cả phần rất mạnh lẫn phần phải sửa trước
khi ai đọc tiếp.

Phần mạnh: §3 Từ vựng là một bảng thật — 23 mục, mỗi mục có **cột quan hệ và số lượng**, tức là nó
đang làm việc của một Data Dictionary chứ không phải một danh sách định nghĩa. Nó thậm chí xử lý
trước một cái bẫy: *"Cảnh báo từ vựng"* chỉ ra đề bài nói *"bốn dạng"* rồi liệt kê sáu giá trị, và
chốt *"Đừng dựng enum thứ hai"*. Đó là loại ghi chú cứu được một ngày công ở bước sau. Định danh
sạch: FR-1…FR-47 liên tục không đứt không trùng, `BR-D1`–`BR-D11`, `BR-B1`–`BR-B6`, `NFR-1`–
`NFR-13`, `SM-1`–`SM-5`, `SM-C1`–`SM-C4`, `UJ-1`–`UJ-3`, `A1`–`A5` — tôi đã đối chiếu từng dãy,
không có lỗ hổng. Tham chiếu chéo nội bộ (FR-4 → FR-44, FR-23 → FR-43, FR-42 → FR-40) đều giải
được.

Phần phải sửa: **ký hiệu `§` mang hai nghĩa trong cùng một tài liệu**, và trong đó có ít nhất một
chỗ hai nghĩa cho hai câu trả lời trái ngược nhau. Cộng thêm một từ nghiệp vụ trung tâm mang hai
nghĩa.

### Findings

- **high** `§5.x` vừa trỏ vào PRD vừa trỏ vào đề bài, và có chỗ trỏ sai hẳn (§6, §2.2) — hàng
  *"Đóng Cơ hội — sang Thắng hoặc Thua"* của §6 ghi cột Hệ thống là `❌ §5.2`. Đọc theo nghĩa nội
  bộ, **§5.2 của chính PRD** là *"Một chỗ chặt hơn đề bài"*, nói về việc **Quản trị được phép** mở
  lại Cơ hội — tức gần như ngược với điều đang được viện dẫn. Tương tự, hàng *"Gọi ra dịch vụ
  ngoài"* ghi `§5.3` trong khi §5.3 của PRD là *"Trường mới — Giai đoạn mở gần nhất"*, và §2.2 ghi
  *"`§5.3` cấm sản phẩm chạm tới người thật"*. Nặng hơn: hàng *"Xoá Công ty"* dẫn `§5.4`, **một mục
  không tồn tại trong PRD**. Cùng vấn đề với `§1` (§0 dẫn *"hai nỗi đau đề bài nêu ở `§1`"* trong
  khi §8.4 dẫn *"nguyên tắc ở §1"* là §1 của PRD) và với `§4/nhóm n`. *Fix:* đặt một tiền tố cho
  nguồn ngoài — ví dụ `ĐB §5.2`, `ĐB §4/nhóm 1` — và khai báo quy ước đó ngay tại §0, nơi đã có
  bảng ba nguồn. Sửa cơ học, nhưng tài liệu này có hàng chục tham chiếu như vậy nên tác động
  downstream là thật.
- **high** *"đang mở"* mang hai nghĩa ở đúng chỗ luật nghiệp vụ dựa vào nó (§5.1, FR-27, `BR-B1`,
  `BR-B4`) — §5.1 nói *"**Bốn** giai đoạn đang mở"*, loại `tam_dung` ra ngoài. FR-27 lại nói
  ngược: *"Không tự đặt cho Cơ hội ở `tam_dung`, **dù `§4/nhóm 1` xếp nó là đang mở**"*. Và
  `BR-B1`/`BR-B4` chỉ có nghĩa dưới nghĩa thứ hai — `BR-B1` bắt *"Cơ hội đang mở phải có Việc tiếp
  theo"*, `BR-B4` phải **miễn trừ** riêng `tam_dung`, điều chỉ cần thiết nếu `tam_dung` nằm trong
  tập *"đang mở"*. Một người viết mã đọc §5.1 và một người đọc `BR-B1` sẽ dựng hai tập trạng thái
  khác nhau. *Fix:* tách thành hai từ và đưa cả hai vào §3 — ví dụ **đang chạy** (bốn giai đoạn,
  dùng cho §5.1 và cho quyền tự đặt) và **chưa đóng** (năm giai đoạn, gồm `tam_dung`, dùng cho
  `BR-B1`); rồi rà lại mọi chỗ dùng chữ *"đang mở"*.
- **high** §6 tự đếm sai số khác biệt giữa hai vai, và `A4` đóng dấu xác nhận cho con số sai (§6,
  §15) — câu kết §6 viết *"**Ba dòng in đậm** là toàn bộ khác biệt thật giữa Sales và Quản trị"*,
  nhưng bảng ngay trên có **bốn** hàng in đậm với cột Sales `❌` và Quản trị `✅`: *Mở lại Cơ hội
  đã đóng* · *Xem màn hình đo lường của Quản trị* · *Chỉnh tham số vận hành* · *Tắt/bật toàn bộ
  phần AI*. `A4` ở §15 nhân bản lỗi này (*"ba hành động ở §6 là toàn bộ khác biệt"*) và gắn nhãn
  *"✅ đã xác nhận 14/8"*. Câu ngay sau đó lại rút ra một chỉ dẫn kiến trúc từ con số này (*"cần
  đúng một điểm kiểm quyền ở tầng nghiệp vụ"*), nên đây là con số có người đọc tiếp. *Fix:* sửa
  thành *bốn dòng* ở cả §6 và `A4`.
- **medium** Enum Giai đoạn — bảy giá trị — không được liệt kê ở đâu trong PRD (§3, §5.1) — §3 chỉ
  ghi *"7 giá trị, thứ tự cố định (`0.1.2`)"* và trỏ ra ngoài, trong khi bốn enum khác trong cùng
  bảng **được liệt kê đầy đủ tại chỗ** (Loại công ty năm giá trị, Mức chắc chắn ba giá trị, Độ liên
  quan ba giá trị). Toàn bộ §5.1 rồi được viết bằng cụm *"Bốn giai đoạn đang mở"* mà không nói bốn
  giai đoạn nào. Hệ quả: §5 — mục PRD tự nhận là lý do nó tồn tại — **không đứng một mình được**,
  đúng thứ tiêu chí này đòi. *Fix:* liệt kê bảy giá trị và nhãn hiển thị của chúng ngay trong ô
  Từ vựng, giữ nguyên `0.1.2` làm nguồn; đánh dấu rõ bốn giá trị nào là *đang chạy*.
- **medium** Ba chỗ chạm của §4 được vẽ như ba nhánh loại trừ nhau, nhưng chúng không loại trừ
  (§4) — sơ đồ *Nhánh máy* dùng nhãn *"còn lại"* cho nhánh Hàng đợi, hàm ý ba nhánh là một phép
  phân hoạch. Thực tế một Phát hiện đáng chú ý, thuộc một Công ty **Đang theo dõi** và **có Cơ hội
  mở**, kích hoạt cả chạm 1 lẫn chạm 3; và vì `D17` chỉ chặn Gợi ý loại *"thêm tin mới"*, nó còn
  có thể sinh cả Gợi ý loại *"điền/sửa ô hồ sơ"* — tức cả ba chạm cùng lúc. Đoạn văn dưới sơ đồ chỉ
  giải thích cặp chạm 2/chạm 3, không nói gì về việc chạm 1 chồng lên chạm 3. *Fix:* thay nhãn
  *"còn lại"* bằng điều kiện tường minh cho từng nhánh và thêm một câu: ba chạm **đánh giá độc
  lập**, một Phát hiện có thể kích hoạt nhiều chạm.

---

## 7. Shape fit — **strong**

PRD này được đổ vào đúng khuôn của bài toán, và đó là một lựa chọn có ý thức chứ không phải may
mắn — §0 khai thẳng *"Hình thái bài toán kế thừa từ brief... **vòng đời bản ghi** làm nền, mượn
**nền tảng dữ liệu** cho tầng đọc tin. Đó là lý do §5, §6, §7 tồn tại và được đặt trước §8 Tính
năng."* Việc đặt State Model (§5), Roles & Permissions Matrix (§6) và Business Rules (§7) **trước**
danh sách tính năng là đúng hình thái vòng đời bản ghi, và nó khiến §8 đọc như những lát cắt của
một mô hình chứ không như một backlog.

Không có over-formalization: **ba** UJ cho một công cụ nội bộ hai vai là đúng liều — vừa đủ để §8
neo được (*"Thực hiện UJ-1"*), không đủ để thành nghi lễ. Không có hành trình bảy bước, không có
sơ đồ empathy, không có bản đồ hành trình. Đúng như bối cảnh đòi.

Cũng không có under-formalization ở chỗ dễ bị bỏ: một công cụ nội bộ vẫn cần ma trận quyền, và §6
làm nó với **ba cột** thay vì hai — cột *Hệ thống (AI)* chính là nơi `T-10` sẽ kiểm. Đó là quyết
định hình thái đúng nhất trong cả tài liệu.

Về nhóm số đo: §13 trộn số đo vận hành (`SM-4`, `SM-5`) với số đo hướng người dùng (`SM-2`), đúng
với hình thái công cụ nội bộ mà tiêu chí mô tả. Không phạt.

### Findings

- **low** §8.5 là nhóm tính năng duy nhất không nối vào UJ nào (§8.5) — năm nhóm còn lại đều kết
  phần *Mô tả* bằng một dòng *"Thực hiện UJ-n"*; §8.5 (Vòng quét, FR-35…FR-40) không có. Vì đây
  chính là nhóm hiện thực hoá lời hứa *"cứ theo dõi giúp tôi"*, việc không có UJ khiến nó thành
  nhóm dễ bị bước UX coi là hạ tầng chạy nền, không có bề mặt. *Fix:* nối vào UJ-1 (mục Dòng thời
  gian do hệ thống thêm chính là thứ Linh đọc) hoặc thêm một UJ ngắn cho lúc bật nhãn Đang theo
  dõi, tận dụng ô *"vì sao theo dõi công ty này"* mà FR-35 đã có.
- **low** UJ-3 không có nhân vật được đặt tên (§2.3) — UJ-1 và UJ-2 có Linh, mang theo ngữ cảnh
  (*"BD phụ trách thị trường JP"*); UJ-3 chỉ có *"Quản trị"*, một vai. Với hình thái này thì không
  nghiêm trọng, nhưng nó khiến UJ-3 đọc như mô tả màn hình chứ không như một hành trình. *Fix:* đặt
  tên và một mẩu ngữ cảnh, một câu là đủ.

---

## Mechanical notes

- **Trôi từ vựng.** §3 tự cấm dùng từ đồng nghĩa, và giữ được ở hầu hết các danh từ nghiệp vụ
  (*Bản lưu*, *Phát hiện*, *Việc tiếp theo*, *Dòng thời gian*, *Phát hiện đáng chú ý* đều nhất
  quán). Hai chỗ trôi: *Hàng đợi gợi ý* bị rút thành *Hàng đợi* ở FR-18, FR-20, §6 và §10.2 — vô
  hại nhưng vi phạm chính luật của §3; và cặp `auto-accept rate` / *tỉ lệ duyệt*, đã nêu ở chiều 3.
  Nghiêm trọng nhất là *"đang mở"*, đã nêu ở chiều 6.
- **Liên tục định danh.** Sạch. FR-1…FR-47 liên tục, khớp với con số *"47 FR"* ở §12.1. `BR-D`,
  `BR-B`, `NFR`, `SM`, `SM-C`, `UJ`, `A` đều liên tục, không trùng.
- **Tham chiếu chéo.** Nội bộ đều giải được **trừ** `§5.4` ở §6 (mục không tồn tại trong PRD) và
  nhóm `§5.2` / `§5.3` / `§1` mơ hồ hai nguồn — xem chiều 6. Ngoài ra `§5.1` được viện dẫn từ bên
  trong chính §5.1 (hàng cuối bảng: *"Chặn tuyệt đối ở tầng nghiệp vụ (`§5.1`, `§5.2`, `T-10`)"*),
  một tự tham chiếu chỉ đọc được nếu đã biết đó là đề bài.
- **Vòng lặp mục lục giả định.** Một chiều: `A1`–`A5` ở §15 nêu đúng vị trí, nhưng không mục nào
  mang nhãn nội tuyến. Xem chiều 5. Cả 5 đã đóng trạng thái — không còn giả định treo, điều này
  tốt.
- **Mã ngoài không có chú giải tại chỗ.** PRD dựa rất nặng vào `D1`–`D41`, `F1`–`F39`, `T-1`–`T-10`
  và `0.1.x` / `0.2.x`. §0 khai bảng ba nguồn nên chúng **giải được**, và với mức cược này việc
  không nhắc lại là đúng. Nhưng các cụm dạng *"vá `F13`"* không thêm thông tin cho người đọc chưa
  mở tài liệu kia — cân nhắc đổi thành *"vá `F13` (thiếu thứ tự ưu tiên trong hàng đợi)"* ở vài chỗ
  quan trọng nhất.
- **Mục bắt buộc.** Đủ cho mức cược và cho hình thái: Tầm nhìn · Người dùng · Từ vựng · Quy trình ·
  Mô hình trạng thái · Ma trận quyền · Luật nghiệp vụ · FR · NFR · Ràng buộc · Không làm gì · Phạm
  vi · Số đo (kèm đối trọng) · Câu hỏi mở · Mục lục giả định. Thiếu duy nhất một cột **ưu tiên**
  trên §8 — đã nêu là phát hiện `critical` ở chiều 1.
