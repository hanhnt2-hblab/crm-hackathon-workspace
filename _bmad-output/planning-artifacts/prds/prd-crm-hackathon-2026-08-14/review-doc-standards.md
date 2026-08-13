---
title: "Rà chuẩn tài liệu — PRD Why Now"
target: prd.md
created: 2026-08-14
reviewer: rà nội dung bắt buộc (3 phép)
---

# Rà chuẩn tài liệu — PRD *Why Now*

Ba phép rà bắt buộc trên `prd.md` (686 dòng, 47 FR, 13 NFR, 11 `BR-D`, 6 `BR-B`).

| Phép | Kết quả | Số phát hiện |
|---|---|---|
| 1 · Phân loại yêu cầu | ❌ **Không đạt** | 17 (5 nặng · 8 vừa · 4 nhẹ) |
| 2 · Phạm vi hai phía | ❌ **Không đạt** | 5 (2 nặng · 3 vừa) — 3 vùng sạch |
| 3 · Hình thái bài toán | ❌ **Không đạt** | 7 (2 kỹ thuật thiếu hẳn · 5 khiếm khuyết) |

---

## Phép 1 — Phân loại yêu cầu

### Cái PRD tự hứa

`§0` dòng 30–31 viết: *"Mỗi yêu cầu trong tài liệu đều xếp được vào đúng một loại:
`business` · `stakeholder` · `functional` · `non-functional` · `transition`. **Loại ghi kèm mỗi
mục**."*

### Cái thực sự có trong tài liệu

| Loại | Mục mang nhãn | Số lượng |
|---|---|---|
| `business` | **không có** | 0 |
| `stakeholder` | §2.1 | 1 khối |
| `functional` | §5.1, §5.3, và nhãn gộp ở đầu §8 | 2 mục + 47 FR gộp |
| `non-functional` | §9 (nhãn gộp trên tiêu đề) | 13 NFR gộp |
| `transition` | **không có** | 0 |

Hai trong năm loại không xuất hiện ở bất kỳ đâu trong tài liệu; §7 (17 luật) không mang nhãn nào;
và ba nhãn còn lại đều là **nhãn gộp trên tiêu đề mục**, không phải nhãn từng mục như §0 hứa. Nhãn
gộp ở §8 còn kèm mệnh đề thoát *"trừ chỗ ghi khác"* mà trong toàn §8 không có một "chỗ ghi khác"
nào — nghĩa là mệnh đề đó không bao giờ được dùng, kể cả ở những chỗ đáng dùng (xem PL1-12, PL1-13).

### Phát hiện — nặng

**PL1-01 · Loại `transition` trống hoàn toàn.** *(§0 dòng 30–31 vs toàn tài liệu)*
Không một mục nào trong 47 FR, 13 NFR, 17 BR mang nhãn `transition`, dù dự án có đủ ba dấu hiệu
kinh điển của yêu cầu chuyển đổi: nạp dữ liệu do bên thứ ba cấp, lược đồ nguồn chưa biết, và một
cửa sổ vận hành tạm (chế độ demo). Loại này không phải bị xếp nhầm — nó **bị bỏ sót nguyên khối**.
**Sửa:** mở mục `§9.2 Yêu cầu chuyển đổi` với mã riêng `TR-n`, và chuyển vào đó các mục ở PL1-02,
PL1-03, PL1-04, PL1-15.

**PL1-02 · `NFR-8` là yêu cầu chuyển đổi bị gán `non-functional`.** *(§9, dòng 550)*
*"Nạp bộ dữ liệu BTC bằng một lệnh, chạy lại thì về đúng trạng thái ban đầu"* là nạp/chuyển đổi dữ
liệu — năng lực chỉ cần **trong lúc** đưa hệ thống vào trạng thái chạy được, rồi bỏ đi. Nó không mô
tả *hệ thống chạy tốt đến mức nào*, nên không phải phi chức năng. Bằng chứng nội tại: `§12.1` liệt
kê *"lệnh nạp dữ liệu idempotent"* như một hạng mục phạm vi riêng, tách khỏi 47 FR — tài liệu đã
cảm thấy nó khác loại nhưng không có ô để đặt.
**Sửa:** chuyển thành `TR-1`, giữ nguyên ngưỡng "1 lệnh, idempotent, in báo cáo đối soát".

**PL1-03 · Lớp ánh xạ lược đồ (`D32`) là yêu cầu chuyển đổi nhưng không phải là một yêu cầu.**
*(§14 câu 1, dòng 666–667)*
*"Một lớp ánh xạ mỏng tách riêng, đổi lược đồ nguồn mà không sửa phần còn lại"* — đây đúng nghĩa
`transition`: lớp này tồn tại **chỉ vì** lược đồ BTC chưa biết, và hết vai trò ngay khi dữ liệu đã
vào hệ thống. Nhưng nó nằm ở mục **Câu hỏi còn mở**, dưới dạng biện pháp giảm thiểu rủi ro: không
mã, không tiêu chí nghiệm thu, không ai sở hữu, không nằm trong 47 FR nên bước Epic & Story sẽ
không sinh story cho nó. Đây là phát hiện nghiêm trọng nhất của Phép 1: **câu chặn duy nhất còn
lại của dự án được xử lý bằng một thứ không phải là yêu cầu.**
**Sửa:** nâng thành `TR-2` với tiêu chí nghiệm thu ("đổi tên trường ở tệp nguồn → không sửa dòng mã
nào ngoài lớp ánh xạ"), và trỏ ngược từ `§14` sang.

**PL1-05 · Loại `business` trống hoàn toàn — dây chuyền yêu cầu đứt ở đầu trên.**
*(§1, §13.1)*
Không mục nào mang nhãn `business`. Ứng viên duy nhất là `SM-1` (§13.1, dòng 641–643), mà chính
PRD gọi là *"số đo duy nhất đo đúng nguyên nhân gốc ở §1"* — nhưng nó nằm ở mục **Số đo thành
công**, viết dưới dạng chỉ số, không dưới dạng yêu cầu. `§1` là văn xuôi tầm nhìn, không có câu nào
dạng *"tổ chức cần X"*. Hệ quả: 47 FR không truy được lên một yêu cầu nghiệp vụ nào; chúng chỉ truy
lên đề bài. Với một sản phẩm dự thi thì tạm chấp nhận được, nhưng §0 đã tuyên bố ngược lại.
**Sửa:** thêm `§1.1` một tới hai câu `business` (dạng *"giảm X giờ đọc tin mỗi tuần cho mỗi BD"*),
rồi trỏ `SM-1` về nó.

**PL1-10 · `NFR-12` gộp ba loại, và đăng nhập không có FR nào phủ.** *(§9, dòng 554)*
*"Đăng nhập **thật** hai tài khoản Sales và Quản trị"* chứa: (a) năng lực đăng nhập — `functional`;
(b) hai tài khoản gieo sẵn trong bộ dữ liệu — `transition`; (c) *"giám khảo tự vào"* — cách nghiệm
thu. Nghiêm trọng hơn nhãn sai: **rà toàn bộ `FR-1`…`FR-47` không có FR nào nói về đăng nhập,
phiên, hay quản lý tài khoản.** `§6` chặn màn hình Quản trị *"ở tầng nghiệp vụ"* (`D28`) và `NFR-10`
đòi *"mọi lần người quyết đều có bản ghi"* — cả hai đều giả định một danh tính người dùng mà không
FR nào tạo ra. Bước Kiến trúc sẽ tự phát minh cơ chế xác thực.
**Sửa:** thêm `FR-48 · Đăng nhập và phiên` vào §8.1; đưa "2 tài khoản gieo sẵn" sang `TR-3`; `NFR-12`
chỉ giữ phần nghiệm thu.

### Phát hiện — vừa

**PL1-04 · `FR-34` nhét một mẩu `transition` vào trong một FR `functional`.** *(§8.4, dòng 462–464)*
Cờ `nextAction.overwriteOverdueManual` mặc định `false` là hành vi thường trực (functional). Nhưng
gạch cuối — *"nếu dữ liệu BTC điền sẵn Việc tiếp theo cho cả 8 Cơ hội thì `T-6` không còn ô trống
nào… bật cờ trên cho bộ dữ liệu đó"* — là một điều chỉnh **chỉ sống trong lúc chạy trên bộ dữ liệu
BTC**. Hai loại nằm trong một FR, và phần transition là phần có rủi ro nghiệm thu.
**Sửa:** tách gạch cuối thành `TR-4`.

**PL1-06 · Cả 17 luật ở §7 không mang nhãn loại.** *(§7.1 `BR-D1`–`BR-D11`, §7.2 `BR-B1`–`BR-B6`)*
§0 hứa "loại ghi kèm mỗi mục"; §7 là mục duy nhất có mã riêng cho từng dòng mà không có cột loại.
Điều này quan trọng vì hai bảng ở §7 **không đồng loại với nhau**: luật định nghĩa cài thành ràng
buộc (functional), luật hành vi thì lẫn functional với non-functional (xem PL1-07, PL1-08, PL1-09).
**Sửa:** thêm một cột `Loại` vào cả hai bảng §7.

**PL1-07 · `BR-D6` xếp được vào hai loại cùng lúc.** *(§7.1, dòng 250)*
*"Độ liên quan suy ra từ Loại tin và `signal_subtype`"* là quy tắc dẫn xuất — `functional`. Nhưng
*"mô hình lệch **tối đa một bậc** kèm một câu lý do, không nhảy hai bậc"* là **dung sai độ chính xác
của mô hình** — `non-functional`, và là loại ngưỡng cần cách đo, mà §9 không có dòng nào cho nó.
**Sửa:** tách thành `BR-D6` (dẫn xuất) và `NFR-14` (dung sai một bậc, đo bằng tỉ lệ lệch trên màn
hình Quản trị).

**PL1-08 · `BR-B6` không xếp được vào loại nào.** *(§7.2, dòng 266)*
*"Nhịp duyệt và thời gian quyết nằm trong ngưỡng duyệt mù"* ràng buộc hành vi của **người dùng**,
không ràng buộc hệ thống. Hệ thống không thể được yêu cầu làm cho người dùng bấm chậm lại. Cái hệ
thống phải làm đã nằm ở `FR-43` (hiện khối cảnh báo). Ở dạng hiện tại đây là một *quan sát về rủi
ro*, không phải yêu cầu — và cột "Khi vi phạm thì sao" của nó trỏ về đúng `FR-43`, tự chứng minh
điều đó.
**Sửa:** hoặc viết lại thành luật về hệ thống (*"hệ thống phải phát hiện và cảnh báo khi…"*, trùng
`FR-43` thì bỏ hẳn), hoặc chuyển xuống §13.3 cạnh `SM-C1` như một số đo đối trọng.

**PL1-12 · `FR-16` là yêu cầu phi chức năng nằm trong §8.** *(§8.2, dòng 366)*
*"Ba mức phân biệt không cần đọc chữ — bằng ký hiệu và màu, **không dùng màu đơn độc**"* là yêu cầu
tiếp cận/khả dụng (đúng WCAG 1.4.1): nó nói *tốt đến mức nào*, không nói hệ thống *làm gì*. Đang
mang nhãn gộp `functional` của §8.
**Sửa:** chuyển thành `NFR-15` hoặc đánh dấu là "chỗ ghi khác" mà §8 đã chừa sẵn.

**PL1-13 · `FR-20` gạch 2 là yêu cầu phi chức năng, và PRD tự nói vậy.** *(§8.3, dòng 392–393)*
*"Số thao tác để Bỏ không được nhiều hơn số thao tác để Duyệt. **Đây là một ràng buộc UX kiểm
được**, không phải nguyện vọng."* Tài liệu tự nhận đây là ràng buộc chất lượng có ngưỡng đo được —
tức chính định nghĩa `non-functional` — rồi vẫn để nó dưới nhãn gộp `functional`.
**Sửa:** chuyển thành `NFR-16` với ngưỡng "≤ số thao tác của Duyệt".

**PL1-14 · `FR-37` gạch 3 trùng nguyên văn `NFR-2`, `NFR-3`, `NFR-4`.** *(§8.5 dòng 486–487 vs §9
dòng 544–546)*
*"Ba cơ chế chi phí đi kèm: định tuyến model theo việc · bộ đệm theo hash prompt TTL 24 giờ · trần
ngân sách kiểm trước mỗi lệnh gọi, cảnh báo ở 80%"* — cùng một yêu cầu đứng ở hai chỗ với hai nhãn
loại khác nhau. Đây đúng là ca "không xếp được vào **đúng một** loại". `§10.3` gạch 3 còn nhắc lại
lần thứ ba.
**Sửa:** giữ ở §9, ở `FR-37` chỉ để một dòng trỏ *"chi phí: xem `NFR-2`–`NFR-4`"*.

**PL1-15 · `NFR-1` chỉ có ngưỡng cho chế độ tạm, không có ngưỡng cho trạng thái thường trực.**
*(§9 dòng 543, đọc cùng `FR-37` dòng 482–485)*
*"≤ 60 giây ở **chế độ demo**"*. `FR-37` nói rõ *"giá trị 60 giây là để chấm được trong buổi demo,
**không phải giá trị dùng thật**"*, vận hành thật là 24 giờ — nhưng §9 không có dòng nào ràng buộc
vòng quét ở chế độ vận hành. Vậy `NFR-1` thực chất là một ngưỡng **của cửa sổ chuyển đổi**, còn
thuộc tính chất lượng thường trực thì chưa được phát biểu.
**Sửa:** hoặc bổ sung ngưỡng cho chế độ 24 giờ, hoặc ghi rõ `NFR-1` áp cho chế độ demo và chuyển
sang mục chuyển đổi.

### Phát hiện — nhẹ

**PL1-09 · `BR-B5` là ngưỡng chất lượng đầu ra mô hình, không phải luật hành vi nghiệp vụ.**
*(§7.2, dòng 265)* — *"Tỉ lệ Phát hiện mang `signal_subtype = unclassified` không vượt ngưỡng"*, hệ
quả duy nhất là cảnh báo. Đúng dạng `non-functional` (độ chính xác), đang nằm trong bảng luật.

**PL1-11 · `NFR-13` trộn ngưỡng chất lượng với mục tiêu dự thi.** *(§9, dòng 555)* — *"1 lệnh, kết
quả in rõ ràng"* là `non-functional`; *"10/10 điểm"* là mục tiêu `business` của cuộc thi, không phải
thuộc tính của phần mềm.

**PL1-16 · `NFR-6` và `NFR-11` là ràng buộc thiết kế, không phải thuộc tính chất lượng.** *(§9,
dòng 548 và 553)* — *"Cấu hình nằm ở biến môi trường"* và *"không dev server, không hot reload"*
quy định **cách dựng**, trong khi `§0` dòng 12–13 tuyên bố PRD *"không nói dựng bằng gì — lựa chọn
công nghệ thuộc bước Kiến trúc"*. Nên xếp vào một bảng `Ràng buộc` riêng ở §10.

**PL1-17 · Hai ràng buộc chỉ sống trong kỳ thi không mang nhãn.** *(§10.3 gạch 1, dòng 594–595;
§12.3 dòng 635)* — *"phải lấy từ bản chụp trong bộ dữ liệu, không từ trang web thật"* và *"mọi việc
quan trọng có sinh log phải diễn ra lại trong ngày thi (`D39`)"* đều là ràng buộc của giai đoạn
chuyển giao, không phải yêu cầu thường trực của sản phẩm.

---

## Phép 2 — Phạm vi hai phía

### Có hai phía không?

**Có, ở cấp tài liệu.** §11 *"Không làm gì"* (6 gạch) và §12.2 *"Ngoài phạm vi bản đầu"* (bảng 6
dòng, mỗi dòng có mã `F`/`D` và lý do) là hai mục nói riêng về phía ngoài. Đây không phải ca thất
bại kinh điển "chỉ liệt kê cái trong". Phép này không đạt vì lý do khác: **có những vùng cụ thể nêu
cái ở trong mà không vạch rìa ngoài của chính vùng đó.**

### Vùng sạch — ghi nhận

| Vùng | Phía trong | Phía ngoài | Đánh giá |
|---|---|---|---|
| Vai người dùng | §2.1, §6 — Sales và Quản trị | §2.2 (năm vai còn lại, khách hàng cuối, quản lý pipeline nhiều người) + §12.2 dòng 5 | ✅ hai phía, có lý do |
| Quyền ghi của AI | §6 cột 3, §10.2 ba mức | §10.1 bốn ranh giới, cách chặn từng cái | ✅ **ba phía** — được / không được / có điều kiện. Đây là ranh giới tốt nhất trong tài liệu |
| Nguồn dữ liệu | `FR-11` bản lưu từ nguồn | §11 gạch 4 (*"Nguồn duy nhất… là bản chụp trang web"*) + §10.3 gạch 1 | ✅ hai phía |

### Phát hiện — nặng

**PL2-01 · "Tính năng BTC phát thêm" nằm trong phạm vi mà không có rìa ngoài, và hai mục con của
§12 không thống nhất về nó.** *(§12.3 dòng 633–634 vs §12.1 dòng 616–618)*
`§12.3` khai *"**một tính năng BTC phát thêm chưa biết nội dung**, và `D41` đã giữ trống một nửa quỹ
giờ cho nó"*. Đây là hạng mục phạm vi lớn nhất trong toàn tài liệu tính theo quỹ giờ — một nửa —
nhưng:
- `§12.1 Trong phạm vi` **không liệt kê nó**, nên hai mục con liền nhau nói khác nhau về cái gì đang
  trong phạm vi;
- không có rìa ngoài nào: không nói tính năng phát thêm lớn tới đâu thì từ chối, không nói FR nào bị
  cắt trước nếu nó ăn quá nửa quỹ giờ, không nói cái gì là bất khả xâm phạm (`T-1`…`T-10`? nhóm 1?).

Đây là ranh giới một phía đúng nghĩa: đã cấp chỗ mà không vạch mép.
**Sửa:** thêm vào §12.3 một thứ tự cắt tường minh (ví dụ *"cắt theo thứ tự: `FR-26` → `FR-35` gạch 2
→ `FR-39` gạch 2 → §8.6 ngoài `FR-45`; không bao giờ cắt §8.1 và bốn ranh giới §10.1"*), và ghi
tính năng phát thêm vào §12.1 như một hạng mục có trần.

**PL2-02 · §11 loại trừ "công cụ báo cáo cho cấp trên" nhưng §8.6 đo hành vi từng người, và đường
biên giữa hai thứ không được vạch.** *(§11 gạch 2 dòng 603–604 vs `FR-41`, `FR-43`, §6 dòng 228)*
`§11` viết *"**Không** thành một công cụ báo cáo cho cấp trên. Nếu Sales coi nhập liệu là thuế phải
nộp thì họ sẽ trốn"*. Nhưng:
- `FR-41` đo *"thời gian quyết trung bình"* và `FR-23` lưu *"**mất bao nhiêu giây** kể từ lúc mở Gợi
  ý tới lúc bấm"* — dữ liệu ở mức từng thao tác của từng người;
- `FR-43` hiện *"N gợi ý cần rà lại"*, tức một phán xét về chất lượng làm việc của người duyệt;
- `§6` cho Quản trị một màn hình mà Sales **bị chặn ở tầng nghiệp vụ** không được xem (`D28`).

Cấu hình đó — người A bị đo, không được xem số của mình, người B xem được — chính là hình dạng của
công cụ báo cáo cho cấp trên. PRD có thể vẫn muốn thế (đo sức khoẻ AI cần dữ liệu này), nhưng
**đường biên giữa "đo sức khoẻ AI" ở trong và "đo hiệu suất người" ở ngoài không tồn tại trong tài
liệu**, nên bước UX và Kiến trúc sẽ tự vẽ.
**Sửa:** thêm vào §11 gạch 2 một mép cụ thể — ví dụ *"số đo ở §8.6 là số **gộp**; không có màn hình
nào xếp hạng hay lọc theo cá nhân; `FR-23` lưu ở mức bản ghi nhưng chỉ hiện dạng phân phối"* — hoặc
sửa `§6` để Sales thấy được số của chính mình.

### Phát hiện — vừa

**PL2-03 · Khái niệm "người sở hữu" nửa trong nửa ngoài.** *(§11 gạch 5 dòng 609 vs §3 dòng 116,
`FR-18` dòng 378, `FR-31` dòng 441)*
§11 loại trừ *"phân quyền theo người sở hữu"*, nhưng "người sở hữu" vẫn là khái niệm sống trong mô
hình: §3 định nghĩa Hàng đợi là *"một trên **mỗi người sở hữu**"*, `FR-18` sinh Gợi ý *"vào Hàng đợi
của người sở hữu"*, `FR-31` báo cho *"người sở hữu Cơ hội"*. Vậy quyền sở hữu ở trong phạm vi với tư
cách **dữ liệu và định tuyến**, chỉ ở ngoài với tư cách **kiểm quyền** — và tài liệu không nói câu
đó ra.
**Sửa:** viết lại gạch 5 thành *"Cơ hội **có** trường người sở hữu, dùng để định tuyến Hàng đợi và
thông báo; **không** dùng làm điều kiện kiểm quyền đọc/ghi"*.

**PL2-04 · Rìa ngoài của mô hình dữ liệu ở cấp Cơ hội không được nêu.** *(`FR-3` dòng 293–294;
§12.2 chỉ có một dòng thuộc mô hình dữ liệu)*
`FR-3` cho Cơ hội đúng bốn trường (tên, giá trị dự kiến, tháng dự kiến chốt, Giai đoạn). §12.2 loại
trừ đúng **một** thứ thuộc mô hình dữ liệu là buying committee (`F28`) — ở phía Người liên hệ. Không
có câu nào nói dòng hàng, báo giá, hợp đồng, sản phẩm, hay tệp đính kèm là ngoài phạm vi. Với một
sản phẩm mang tên CRM, đó là đúng nhóm thứ giám khảo vòng 3 sẽ hỏi, và cũng là nhóm thứ một bước
Kiến trúc nhiệt tình sẽ tự thêm.
**Sửa:** thêm một dòng vào §12.2: *"Dòng hàng, báo giá, hợp đồng, tệp đính kèm — ngoài phạm vi; Cơ
hội chỉ mang một con số giá trị dự kiến (`BR-D9`)"*.

**PL2-05 · §11 trộn nguyên tắc vào danh sách loại trừ, làm mờ chính danh sách đó.** *(§11 gạch 3
dòng 605–606, và một phần gạch 2)*
*"**Không** tối ưu khối lượng đầu ra của AI"* là một nguyên tắc thiết kế, không phải một hạng mục
bị cắt khỏi bản dựng — đọc xong không biết cái gì sẽ không được xây. Đứng lẫn giữa bốn gạch là loại
trừ thật (tin nhắn tiếp cận, nền tảng đa nguồn, phân quyền theo người sở hữu, tự duyệt Gợi ý), nó
làm §11 mất tính "danh sách kiểm được".
**Sửa:** tách §11 thành hai khối — *"Không xây"* (loại trừ, kiểm được) và *"Không đánh đổi"*
(nguyên tắc).

---

## Phép 3 — Hình thái bài toán

### Hình thái đã được xác định và ghi ra chưa?

**Rồi.** `§0` dòng 33–34: *"**Hình thái bài toán** kế thừa từ brief, không quyết lại: **vòng đời bản
ghi** làm nền, mượn **nền tảng dữ liệu** cho tầng đọc tin. Đó là lý do §5, §6, §7 tồn tại và được đặt
trước §8 Tính năng."*

Đây là phần làm tốt: hình thái được khai tên, khai nguồn kế thừa, **và** được dùng để giải thích
trật tự các mục. Không phải khai suông.

### Bộ kỹ thuật đúng cho hình thái này — đối chiếu

| # | Kỹ thuật | Thuộc | Có chạy không | Ở đâu |
|---|---|---|---|---|
| 1 | Process Modelling | nền | ⚠️ **mỏng** | §4 — hai sơ đồ |
| 2 | State Modelling | nền | ⚠️ **có, 2 khiếm khuyết** | §5.1 bảng chuyển tiếp |
| 3 | Business Rules Analysis | nền | ✅ **đủ** | §7, 17 luật, tách hai loại, có nguồn và đường xử lý |
| 4 | Roles and Permissions Matrix | nền | ⚠️ **có, thiếu một khối** | §6, 3 cột × 20 hành động |
| 5 | Data Modelling | nền | ⚠️ **chạy một phần, bị uỷ quyền** | §3 |
| 6 | **Data Dictionary** | phần mượn | ❌ **thiếu hẳn** | — |
| 7 | **Data Flow** | phần mượn | ❌ **thiếu hẳn** | — |

**Kết luận Phép 3:** hình thái được khai đúng và có ảnh hưởng thật lên cấu trúc tài liệu, nhưng
**hai kỹ thuật thiếu hẳn đều thuộc phần mượn** — tức đúng phần mà `§0` tuyên bố là có mượn. Phần nền
(vòng đời bản ghi) chạy tương đối đầy đủ; phần mượn (nền tảng dữ liệu) chỉ được khai tên. Đó là dạng
hỏng nguy hiểm hơn cả không khai hình thái, vì tài liệu đọc như đã bao phủ.

### Phát hiện — thiếu hẳn kỹ thuật

**PL3-01 · Data Dictionary — không có.** *(toàn tài liệu; §3 không thay được)*
`§3 Từ vựng` là **glossary**: nó định nghĩa khái niệm nghiệp vụ và lực lượng quan hệ, không định
nghĩa trường dữ liệu. Data Dictionary cần: tên trường · kiểu · giá trị cho phép · mặc định · bắt
buộc hay không · cách dẫn xuất. Bằng chứng lỗ hổng là các tên kỹ thuật đã xuất hiện rải rác trong
tài liệu **mà không ở đâu định nghĩa**:

| Tên xuất hiện | Ở đâu | Cái thiếu |
|---|---|---|
| `signal_subtype` | `BR-D6`, `BR-B5`, §12.1 | §12.1 nói 13 giá trị *"khi Loại tin là `other`"*, `BR-D6` lại dùng nó để suy Độ liên quan cho **mọi** Loại tin — mâu thuẫn phạm vi áp dụng, và 13 giá trị không được liệt kê ở đâu trong PRD |
| `unclassified` | `BR-B5`, `FR-43` | Là một trong 13 `signal_subtype` hay một giá trị riêng? Không nói. Ngưỡng của nó cũng chỉ trỏ `0.2.2` |
| `nextAction.overwriteOverdueManual` | `FR-34` | Trường cấu hình hay cờ hệ thống? Có xuất hiện ở `FR-44` (chỉnh tham số) không? Không nói |
| `thong_tin_sai` | `FR-42` | Một trong 5 lý do Bỏ ở `0.1.7` (`FR-20`)? Không nói. `FR-42` lại thu nó từ **hai** nguồn khác nhau |
| `status` | §5 dòng 167 | Của hệ thống thật, không nói có tái dùng không |
| `Giai đoạn mở gần nhất` | §3, §5.3 | Trường **mới** duy nhất được khai — nhưng không có kiểu, không nói cho phép `null` khi Cơ hội chưa từng rời giai đoạn mở |

Mọi enum khác đều trỏ sang `0.1.1`–`0.1.7` và mọi ngưỡng trỏ sang `0.2.1`–`0.2.3` ở tài liệu phản
biện. Trỏ ngoài là hợp lệ theo §0, **nhưng các tên trong bảng trên thì không có nguồn nào để trỏ
tới** — chúng ra đời trong chính PRD này.
**Sửa:** thêm `§3.2 Từ điển dữ liệu` gồm đúng những trường PRD tự sinh: `signal_subtype` (phạm vi
áp dụng + 13 giá trị + `unclassified`), `Giai đoạn mở gần nhất` (kiểu, `null` khi nào),
`nextAction.overwriteOverdueManual`, `thong_tin_sai`, và trường thời gian quyết ở `FR-23`.

**PL3-02 · Data Flow — không có.** *(§4 không thay được)*
Nhánh máy ở `§4` (dòng 148–157) là **sơ đồ quy trình ở mức tính năng**: Bản lưu → Phát hiện → ba
chỗ chạm. Nó không phải data flow — thiếu tác nhân ngoài, kho dữ liệu, và cả hai đầu của đường ống:

- **Đầu vào không có trong sơ đồ nào.** Bộ dữ liệu BTC → lớp ánh xạ (`D32`) → Bản lưu là con đường
  dữ liệu thật sự đi vào hệ thống, và nó chỉ tồn tại dưới dạng một câu ở `NFR-8` và một câu ở §14.
- **Không có luật lưu giữ.** `FR-17` (dòng 370–371) nói *"đọc lại không xoá Phát hiện cũ. Phát hiện
  mới nằm cạnh Phát hiện cũ"*, cộng `FR-11` lưu **hai dạng** mỗi Bản lưu (`D21`), cộng chu kỳ quét
  60 giây ở `FR-37` → tăng trưởng không có trần và không có mục nào nói khi nào dọn. Ở chế độ demo
  60 giây, một Vòng quét mỗi phút trên toàn bộ Công ty Đang theo dõi trong 4,5 tiếng là con số cần
  được nhìn thấy trước, không phải sau.
- **Đầu ra rời hệ thống không được mô tả.** `FR-12`/`FR-13` gửi nội dung Bản lưu ra mô hình ngoài.
  `§10.1` ranh giới 3 chỉ nói về **đích gọi** (danh sách cho phép), không nói **cái gì rời khỏi
  biên**. `§10.3` nói không có bí mật trong mã, không nói gì về nội dung gửi đi.
- **Đường xoá mềm không được vẽ.** `FR-1` (xoá mềm cascade), `FR-40` (xoá mềm mục do hệ thống thêm,
  giữ lại làm dữ liệu đo), `D26` (Gợi ý đang chờ bị đóng) tạo ra ba luồng dữ liệu sau khi xoá mà
  không sơ đồ nào nối lại.

**Sửa:** thêm `§4.3 Luồng dữ liệu` một sơ đồ: **nạp** (bộ dữ liệu BTC → lớp ánh xạ → Bản lưu) ·
**lưu** (hai dạng Bản lưu, Phát hiện, luật lưu giữ và trần dung lượng) · **ra ngoài** (payload gửi
tới mô hình) · **xoá mềm** (cái gì còn lại làm dữ liệu đo).

### Phát hiện — kỹ thuật có chạy nhưng khiếm khuyết

**PL3-03 · State Modelling: hai dòng của §5.1 mâu thuẫn nhau.** *(§5.1 dòng 175 vs dòng 180)*
- Dòng 2: *"| **Bất kỳ** | `du_dieu_kien` | **Không chặn** |"*
- Dòng 7: *"| `thang` hoặc `thua` | **Đúng** Giai đoạn mở gần nhất | **Chỉ vai Quản trị** |"*

`du_dieu_kien` là một giai đoạn đang mở. Với một Cơ hội ở `thang`, dòng 2 cho phép **bất kỳ ai** kéo
sang `du_dieu_kien` không điều kiện, còn dòng 7 nói việc mở lại Cơ hội đã đóng **chỉ Quản trị** và
**chỉ về đúng Giai đoạn mở gần nhất**. Hai luật ngược nhau trên cùng một cặp trạng thái. Điều này
phá thẳng `§5.2` (*"làm chặt hơn"* — cơ sở duy nhất của nó là dòng 7), phá `§6` dòng 218 (*"Mở lại
Cơ hội đã đóng | ❌ | ✅"*), và phá giả định `A5` ở §15 vốn đang ghi *"rủi ro nghiệm thu bằng
không"*. Bước Kiến trúc đọc bảng từ trên xuống sẽ cài dòng 2 và mất luôn hạn chế.
**Sửa:** sửa cột "Từ" của dòng 2 thành *"Ba giai đoạn đang mở còn lại"*, và bổ sung một câu dưới
bảng: *"khi hai dòng cùng khớp, dòng có điều kiện canh chặt hơn thắng"*.

**PL3-04 · State Modelling: không khai trạng thái khởi đầu.** *(§5.1; `FR-3` dòng 293–294)*
Bảng liệt kê chuyển tiếp nhưng không nói Cơ hội **sinh ra ở giai đoạn nào**. `FR-3` chỉ nói Cơ hội
*"có… Giai đoạn hiện tại"*. Một máy trạng thái không có trạng thái khởi đầu thì chưa đóng: hoặc
người tạo chọn tự do bất kỳ giá trị nào trong 7 (kể cả `thang`), hoặc có mặc định — hai cách cho ra
hai sản phẩm khác nhau, và `SM-5`/`FR-10` (thống kê theo giai đoạn) phụ thuộc vào lựa chọn đó.
**Sửa:** thêm một dòng đầu bảng: *"| — (tạo mới) | giai đoạn mở đầu tiên | không chọn được giai đoạn
khác khi tạo | — |"*.

**PL3-05 · Roles and Permissions Matrix: thiếu toàn bộ khối thực thể của nhóm 2.** *(§6, 20 hàng)*
Ma trận không có hàng nào cho **Bản lưu** và **Phát hiện** — đúng hai thực thể mà tầng AI sinh ra và
là hạt nhân của phần mượn "nền tảng dữ liệu". Cụ thể thiếu:
- Xem / xoá Bản lưu — `FR-14` chỉ nói *"Sales xem được"*, Quản trị và hệ thống thì không rõ;
- Xoá hoặc ẩn một Phát hiện — `FR-17` nói đọc lại không xoá, nhưng người có xoá được không thì không
  ai nói;
- Bấm hai nút *hữu ích / không hữu ích* ở `FR-42` — không có hàng, dù đây là một trong hai nguồn của
  `error-detection rate`;
- Đăng nhập / quản lý tài khoản — không có hàng (nối với PL1-10).

Mà `§6` tự tuyên bố *"Ba dòng in đậm là **toàn bộ** khác biệt thật giữa Sales và Quản trị"* — tuyên
bố "toàn bộ" chỉ đúng nếu ma trận đầy đủ.
**Sửa:** thêm bốn hàng trên vào §6.

**PL3-06 · Process Modelling: không có nhánh ngoại lệ và không phân làn theo tác nhân.** *(§4, dòng
132–157)*
Ba tình huống ngoại lệ đã được đặc tả ở §8 nhưng không xuất hiện trong sơ đồ quy trình: nguồn không
đọc được (`FR-11` gạch 4), vòng quét bị bỏ vì chồng vòng (`FR-38`), phần AI bị tắt bằng phanh
(`FR-45`) — cái cuối làm **toàn bộ nhánh máy biến mất**, tức là một trạng thái quy trình khác hẳn,
mà sơ đồ chỉ có một. Ngoài ra sơ đồ không phân làn theo tác nhân, dù `§6` khẳng định tác nhân chính
là điểm kiểm quyền và `§10.1` khẳng định phải chặn *"kể cả khi thao tác đến từ ngoài giao diện"*.
**Sửa:** thêm nhánh "AI tắt" vào sơ đồ §4 (nhánh người chạy nguyên, ba chỗ chạm im), và đánh dấu tác
nhân ở mỗi ô của nhánh máy.

**PL3-07 · Data Modelling chạy một phần và bị uỷ quyền ra ngoài.** *(§3; §5.3 dòng 201–203)*
§3 cho thực thể và lực lượng quan hệ (*"Công ty 1–n Cơ hội"*, *"thuộc **đúng một** Công ty"*) —
phần này tốt và đủ để bước sau đọc. Nhưng không có thuộc tính của thực thể (rải ở `FR-1`, `FR-2`,
`FR-3`, `FR-6`, `FR-11`, `FR-12`), không có khoá/định danh, và §5.3 nói thẳng rằng **Mục 0 của bản
phản biện** mới là nguồn duy nhất của mô hình dữ liệu, kèm việc phải làm là bổ sung ngược trường mới
vào đó. Nghĩa là kỹ thuật này được **uỷ quyền**, không được chạy trong PRD. Đó là lựa chọn hợp lệ và
được tuyên bố công khai — nhưng nó có giá: khi Mục 0 chưa được cập nhật (việc ở §14 câu 4 vẫn đang
mở), mô hình dữ liệu đang có **hai nguồn không khớp**, đúng thứ §5.3 nói là muốn tránh.
**Sửa:** hoặc làm xong việc ở §14 câu 4 trước khi bước Kiến trúc đọc, hoặc đưa bảng thuộc tính vào
§3.1 và ghi rõ PRD sở hữu phần delta.

---

## Ghi chú ngoài ba phép

Một thứ gặp trong lúc rà, không thuộc ba phép nhưng sẽ gây lỗi cho bước sau:

**`§5.1`, `§5.2`, `§5.3` là ký hiệu mang hai nghĩa khác nhau trong cùng một bảng.** Ở `§6`, ô *"Đổi
Giai đoạn… ❌ `§5.1`"* trỏ về **§5.1 của chính PRD** (dòng cuối bảng chuyển tiếp — `§10.1` xác nhận
cách đọc này), nhưng ô *"Đóng Cơ hội… ❌ `§5.2`"* và *"Gọi ra dịch vụ ngoài ✅ `§5.3`"* trỏ về
**§5.2/§5.3 của đề bài** (ranh giới 2 và 3) — vì §5.2 của PRD nói về việc mở lại Cơ hội và §5.3 của
PRD là "Trường mới", cả hai đều không liên quan. `§2.2` dòng 72 cũng dùng `§5.3` theo nghĩa đề bài.
**Sửa:** đổi tiền tố cho tham chiếu ra ngoài, ví dụ `ĐB§5.3`, và rà lại toàn bộ `§6`.
