---
title: "Biên tập PRD Why Now — hai lượt: cấu trúc và văn phong"
target: prd.md
reader_type: humans
style_guide: Microsoft Writing Style Guide
created: 2026-08-14
---

# Biên tập PRD: Why Now

**Đọc mục đích.** Tài liệu này tồn tại để giúp **ba bước kế tiếp — UX, Kiến trúc, Epic & Story —
biết hệ thống phải làm gì và cư xử ra sao**, đủ chính xác để họ dựng màn hình, chọn công nghệ và
cắt story mà không phải hỏi lại tác giả. Người đọc là người trong đội, đọc để làm việc.

**Mô hình cấu trúc đối chiếu:** *Strategic/Context (Pyramid)* — mô hình dành cho PRD, đề xuất và
bản ghi quyết định. Bốn luật của nó: kết luận đứng đầu, bối cảnh nhóm bên dưới, thứ tự theo mức
quan trọng, các nhóm rời nhau và phủ hết. Xuất xứ mô hình: `structure-models.md` của bộ lăng kính
biên tập; từ đây trở xuống chỉ nói về tài liệu.

**Kết quả đối chiếu.** Tài liệu bám mô hình khá sát: §0 khai thẩm quyền và lý do tồn tại, §1 nêu
kết luận, §4–§7 dựng nền trước khi §8 liệt kê tính năng, §12–§13 đóng bằng phạm vi và số đo. Không
có mục nào lạc chỗ đến mức phải chuyển. Các phát hiện dưới đây tập trung vào **ba thứ có thật**:
một vài chỗ nói cùng một điều ở ba nơi, vài nhãn/con số tự vênh nhau giữa các mục, và **hai chỗ
thiếu giàn giáo** khiến bước sau phải tự đoán. Không có đề xuất nào cắt vì lý do dài.

**Không có mục tiêu độ dài.** 50 yêu cầu chức năng thì 11.812 từ là hợp lý. Mọi con số tác động
dưới đây neo vào số đo thật của `word_metrics.py`.

---

## Bảng phát hiện

| Pass | Original Text | Revised Text | Changes |
|---|---|---|---|
| structure | §3.1 Khái niệm nghiệp vụ — bảng từ vựng (782 từ), mở đầu bằng *"Bước sau dùng **đúng** các từ này"* | **THÊM một dòng «Bản chụp»** vào bảng (+~25 từ) | **Từ vựng có kiểm soát đang thiếu một mục.** *Bản chụp* được dùng như thuật ngữ viết hoa ở §4.3 (hai lần: "Nhánh nạp", "Nhánh đọc") nhưng không có dòng trong §3.1, và ở năm chỗ khác lại viết thường: FR-11 ("định danh bản chụp đã dùng"), FR-50 (chính tiêu đề), §10.3, §11, §14/`Q16`. Bảng tự nhận là nguồn duy nhất của từ vựng, nên bước Kiến trúc sẽ tự đặt tên cho khái niệm này — đúng cái §3.1 dựng ra để chặn. Thêm dòng rồi thống nhất viết hoa ở cả bảy chỗ |
| structure | §8 Tính năng — 50 khối FR trải qua sáu mục con, số hiệu không chạy tuần tự: §8.1 kết thúc bằng FR-48, FR-49; §8.2 chèn FR-50 giữa FR-11 và FR-12 | **THÊM bảng tra FR** ngay sau bảng nhãn ưu tiên ở §8: `mã → mục → nhãn ưu tiên → điểm T liên quan` (+~120 từ) | **Giàn giáo còn thiếu, và là chỗ tốn thời gian nhất cho bước Epic & Story.** Chính §8 nói số hiệu đánh **toàn cục** để nhóm xếp lại vẫn trích dẫn được — nhưng lợi ích đó chỉ thành thật khi có bảng tra. Hiện muốn biết FR-34 nằm ở đâu phải cuộn tìm. Bảng tra cũng là thứ trả lời câu *"bỏ cái gì lúc 11 giờ trưa"* trong ba mươi giây, đúng như §8 hứa. Đây là đề xuất **thêm**, không phải cắt |
| structure | §5.2 Một chỗ chặt hơn đề bài — cả mục (99 từ, một bảng một dòng) | **MERGE** vào khối trích dẫn `làm chặt hơn` ngay dưới bảng §5.1 (tiết kiệm ~60 từ) | Nội dung mục này đã có mặt ba lần trong vòng mười dòng: ô "Điều kiện canh" của hàng `thang`/`thua` ở §5.1, khối trích dẫn ngay dưới bảng, rồi cả mục §5.2. Đưa cột *Lý do* và *Rủi ro nghiệm thu* vào thẳng khối trích dẫn thì mất hẳn một cấp tiêu đề mà không mất chữ nào có nội dung. **Kèm theo:** tiêu đề §5.2 viết *"Một chỗ chặt hơn"* trong khi khối trích dẫn cách đó mười dòng viết *"**hai chỗ** trong bảng trên chặt hơn đề bài"* — hai con số đứng gần nhau đến mức người đọc dừng lại để đối chiếu |
| structure | §5.3 Trường mới, đoạn mở đầu: *"**Giai đoạn mở gần nhất.** Một trường, hai việc… Ghi giá trị mỗi lần Cơ hội rời một giai đoạn đang chạy để sang `tam_dung`, `thang` hoặc `thua`."* | **CONDENSE** còn một câu trỏ về §3.2, giữ nguyên khối *"Việc phải làm ngoài PRD"* (tiết kiệm ~55 từ) | Cùng một đặc tả trường xuất hiện ba nơi: dòng "Giai đoạn mở gần nhất" ở §3.1, dòng `giaiDoanMoGanNhat` ở §3.2 (đã có đủ kiểu, tính bắt buộc, luật ghi, mục đích), và đoạn này. §3.2 là chỗ đúng cho đặc tả trường; §5.3 chỉ cần giữ phần **duy nhất** nó có mà hai chỗ kia không có: việc phải bổ sung ngược vào Mục 0 |
| structure | Ba lần phát biểu cùng một câu: §4.3 *"đây là biện pháp duy nhất giảm thiểu `Q15`, câu chặn còn lại của cả dự án"* · §9.2 *"`TR-1` đáng chú ý: nó là **biện pháp duy nhất** giảm thiểu `Q15` — câu chặn còn lại của cả dự án"* · §14/1 *"Giảm thiểu bằng `D32`: một **lớp ánh xạ mỏng** tách riêng"* | **CONDENSE** — giữ bản đầy đủ ở §9.2 (nơi `TR-1` được khai), hai chỗ kia rút về con trỏ (tiết kiệm ~45 từ) | Trùng lặp thật: cùng một mệnh đề, cùng mức chi tiết, không thêm ý ở lần thứ hai và thứ ba. **Kèm theo:** ba chỗ dẫn ba mã khác nhau cho cùng một biện pháp — §4.3 và §9.2 dẫn `TR-1`, §14 dẫn `D32`. Chọn một cách dẫn nhất quán, hoặc nói rõ `D32` là quyết định còn `TR-1` là yêu cầu sinh ra từ nó |
| structure | Hai khối *"**Việc phải làm ngoài PRD:**"* nằm rời nhau — một ở §5.3 (bổ sung trường *Giai đoạn mở gần nhất* vào Mục 0), một ở §10.2 (bổ sung ô còn thiếu của `D16`). §14 mục 4 chỉ nhắc lại **một** trong hai | **MOVE** cả hai vào §14 thành một danh sách hai mục, để lại con trỏ tại §5.3 và §10.2 (tiết kiệm ~30 từ) | Đây là loại việc dễ rơi nhất: nó không phải yêu cầu nên không sinh story, và đang nằm rải ở hai mục không ai đọc lại. §14 đã có sẵn quy ước cho việc này — mục 4 tự nhận *"việc phải làm, không phải câu hỏi. Ghi ở đây để không rơi"*. Gom cả hai vào đó thì quy ước ấy mới thành thật; hiện tại việc `D16` chưa được liệt kê ở đâu ngoài một khối trích dẫn giữa §10.2 |
| structure | §2.2 Không phải người dùng của bản này (74 từ) · §11 gạch đầu dòng 5 *"**Không** làm phân quyền theo người sở hữu — `§2` miễn, vì dữ liệu mẫu chỉ có một tài khoản Sales"* · §12.2 hàng *"Năm vai còn lại của hệ thống thật"* | **MERGE** — giữ §2.2 làm chỗ khai duy nhất, rút hai chỗ kia thành con trỏ về §2.2 (tiết kiệm ~55 từ) | Ba loại trừ của §2.2 được kể lại nguyên vẹn ở §11 và §12.2, cùng lý do, cùng nguồn viện dẫn. §2.2 là vị trí đúng theo hành trình người đọc (biết mình không phải ai trước khi đọc tính năng); §11 và §12.2 chỉ cần một dòng trỏ về. Đây là trùng lặp thật, không phải nhắc lại có tác dụng củng cố |
| structure | §9.1 — ô "Đo bằng" của `NFR-1` và ô "Ngưỡng" của `NFR-6`, mỗi ô một đoạn văn nhiều câu nằm trong một ô bảng | **MOVE** phần lý giải xuống hai ghi chú ngay dưới bảng, giữ trong ô đúng ngưỡng và cách đo (không đổi tổng số từ) | Bảng NFR mạnh vì mọi hàng đọc được bằng mắt liếc: một mã, một ngưỡng số, một cách đo. Hai ô này phá nhịp đó — `NFR-1` giải thích vì sao **không** đặt ngưỡng cứng, `NFR-6` giải thích chuyện đề bài tự mâu thuẫn. Cả hai đều đáng giữ, chỉ là không giữ trong ô bảng. Ghi chú dưới bảng giữ nguyên nội dung mà trả lại khả năng quét cho 13 hàng còn lại |
| structure | §10.3 Chi phí và riêng tư (67 từ, ba gạch đầu dòng) — gạch 2 trỏ về `NFR-6`, gạch 3 trỏ về `NFR-2`, `NFR-3`, `NFR-4` | **CONDENSE** còn gạch đầu dòng 1 cộng một câu trỏ về §9.1 (tiết kiệm ~40 từ) | Hai phần ba mục này là con trỏ thuần. Chỉ gạch đầu dòng đầu — *"Nội dung Công ty phải lấy từ bản chụp, không từ trang web thật"* — mang thông tin không có ở chỗ khác, và nó là một ràng buộc thật của §10. Giữ nguyên tiêu đề mục để §10 vẫn đủ ba mặt: ranh giới, quyền ghi, chi phí và riêng tư |
| structure | §4.3 tiêu đề *"Luồng dữ liệu — bốn nhánh"*, bên dưới là **Nhánh nạp · Nhánh đọc · Nhánh ra biên · Luật lưu giữ** | **CONDENSE** tiêu đề: *"Luồng dữ liệu — ba nhánh và luật lưu giữ"*; hoặc tách **Luật lưu giữ** thành §4.4 (không đổi tổng số từ) | Khối thứ tư không phải một nhánh dữ liệu mà là một luật về vòng đời dữ liệu — nó có bảng riêng, khối trích dẫn `làm chặt hơn` riêng, và không nối tiếp ba khối trước. Người đọc đếm đủ bốn khối nhưng chỉ thấy ba cái cùng dạng. Sửa nhãn là đủ; nội dung không cần đụng |
| structure | §12.1 *"Sáu nhóm tính năng `§4` với **47 FR** ở §8"* — trong khi bảng nhãn ưu tiên ở §8 ghi 31 + 18 + 1 và §8 có 50 khối FR | **QUESTION** — chọn một con số và dùng nó ở cả hai chỗ | Không bàn tới con số đúng là bao nhiêu, chỉ là hai chỗ trong cùng tài liệu đang phát biểu hai giá trị cho cùng một đại lượng, và một trong hai nằm ở mục *Trong phạm vi* — chỗ bước Epic & Story đọc để biết phải cắt bao nhiêu story. Nếu 47 là số FR **sau** khi trừ ba FR nào đó thì nói rõ trừ cái gì |
| structure | §12.4, câu cuối: *"Hai dòng này ghi ở đây để người đọc PRD không tưởng đội bỏ sót `§7`."* | **CUT** (tiết kiệm ~20 từ) | Tiêu đề mục đã nói đúng điều này — *"Hai điều kiện nộp bài **cố ý** nằm ngoài PRD"* — và đoạn mở đầu nhắc lại lần nữa (*"đây là lựa chọn có chủ đích chứ không phải bỏ sót"*). Câu kết là lần thứ ba |
| structure | Chín khối `làm chặt hơn` rải khắp tài liệu: §4.3, §5.1, §5.2, §7.1, FR-16, FR-18, FR-26, FR-35, FR-40, cộng §10.1 | **PRESERVE** — không gom về phụ lục | Một lượt cắt theo mật độ sẽ đề nghị gom chín khối này thành một bảng *"những chỗ chặt hơn đề bài"*. Đừng làm. Mỗi khối nằm cạnh đúng cái quyết định mà nó biện hộ, và giá trị của nó là ở chỗ người đọc gặp lý do **cùng lúc** với gặp luật — gom lại thì phải đọc hai nơi mới hiểu một điều. Lược đồ của chúng đã nhất quán (nhãn → điều đề bài nói → điều đội đặt → rủi ro nghiệm thu); đó là dấu hiệu nên giữ, không phải dấu hiệu nên gom |
| structure | §2.3 Hành trình người dùng (266 từ, UJ-1…UJ-3) và hai sơ đồ ASCII ở §4.1, §4.2 | **PRESERVE** | Ba thứ dễ bị coi là trang trí trong một tài liệu 50 FR, và là ba thứ bước UX sẽ mở ra đầu tiên. UJ-1…UJ-3 được §8 trích dẫn ngược ở cả sáu mục con (*"Thực hiện UJ-1"*), nên cắt chúng là làm hỏng con trỏ ở sáu chỗ. Hai sơ đồ mang thứ mà không đoạn văn nào thay được: **ba chỗ chạm** giữa nhánh người và nhánh máy, nhìn ra trong một giây |
| prose | *"**PRD này chỉ thêm ba thứ ba tài liệu trên không có**, và đó là lý do nó tồn tại:"* (§0) | *"**PRD này chỉ thêm ba thứ mà ba tài liệu trên không có**, và đó là lý do nó tồn tại:"* | "ba thứ ba tài liệu" khiến người đọc dừng lại để tách hai cụm số. Thêm "mà" là sửa nhỏ nhất đủ dứt điểm. Câu này nằm ở dòng khai lý do tồn tại của cả tài liệu, nên đáng sửa trước |
| prose | Nhãn *rủi ro nghiệm thu* xuất hiện với năm dạng khác nhau: **"Rủi ro nghiệm thu: không"** (§4.3, §5.1, FR-16, FR-40) · **"rủi ro nghiệm thu bằng không"** (§7.1, `A5`) · **"Rủi ro nghiệm thu: không"** cắt dòng giữa từ (FR-18) · "Rủi ro nghiệm thu: **không**" (FR-26) · **"Rủi ro nghiệm thu có thật:"** (FR-34) | Chốt một dạng khẳng định — **"Rủi ro nghiệm thu: không"** — và một dạng phủ định — **"Rủi ro nghiệm thu: có"** — dùng ở cả chín chỗ | Đây là một nhãn có kiểm soát, không phải câu văn: nó là thứ người đọc quét để tìm chỗ nguy hiểm trước ngày thi. Năm cách viết khiến không quét được bằng tìm-chuỗi. Đặc biệt FR-34 dùng *"có thật"* thay vì *"có"*, làm hàng nguy hiểm nhất trong tài liệu lại là hàng khó tìm nhất. Đề nghị này không đụng tới nội dung của bất kỳ đánh giá rủi ro nào |
| prose | `` `làm chặt hơn` `` dùng vừa như nhãn vừa như động từ: nhãn ở tám chỗ (đứng đầu dòng, theo sau là dấu gạch ngang), động từ ở §10.1 — *"`D25` làm chặt hơn: **cả bốn** ranh giới chặn ở tầng nghiệp vụ"* — và ở FR-34 — *"— `làm chặt hơn`: **kể cả khi đã quá hạn**"* | §10.1: *"`D25` mang nhãn `làm chặt hơn`: **cả bốn** ranh giới…"*; FR-34: *"— mang nhãn `làm chặt hơn` vì **kể cả khi đã quá hạn** cũng không ghi đè"* | Khi một chuỗi trong dấu nháy ngược lúc là nhãn phân loại, lúc là động từ của câu, người đọc phải đọc hết câu mới biết mình đang gặp cái nào. Giữ dấu nháy ngược cho **duy nhất** nghĩa nhãn; khi cần dùng như động từ thì viết thường, không nháy ngược |
| prose | Mã FR khi thì trong dấu nháy ngược khi thì để trần, trong cùng một ngữ cảnh: §13.1 *"Nghiệm `FR-27`, `FR-36`"* cạnh §13.2 *"Nghiệm FR-27, FR-32"* và *"Nghiệm FR-18, FR-20"*; §8.1 *"khác mọi tham số khác ở FR-44"*; §9.1 *"đối chiếu `FR-38`"* cạnh *"Nhật ký vòng quét (FR-39)"*; §11 *"(FR-21)"*; §10.2 con trỏ trần | Chọn một quy ước cho mã nội bộ (`FR-n`, `NFR-n`, `TR-n`, `SM-n`) và áp cho toàn tài liệu | Tài liệu đang phân biệt rất chuẩn giữa mã của mình và mã của nguồn ngoài (`D-n`, `T-n`, `§n`, `F-n` — luôn nháy ngược). Chỉ riêng mã của chính nó thì dao động. Bước Epic & Story sẽ tìm theo chuỗi để dựng ma trận truy vết, nên đây là chi phí thật chứ không phải chuyện thẩm mỹ. Dạng nào cũng được, miễn một dạng |
| prose | Thuật ngữ tiếng Anh không gán quy ước, mỗi chỗ một kiểu: *pain hypothesis* (FR-13, để trần) · *buying committee* (§12.2, để trần) · *screening Keep / Hold / Drop* (FR-35) · *cosine ≥ 0,9* (FR-24) · *idempotent* (NFR-8, §12.1) · *cascade* (FR-1, §6) — trong khi `error-detection rate` và `auto-accept rate` luôn nháy ngược | Chốt một quy ước: nháy ngược cho tên riêng của số đo/kỹ thuật, và một cụm tiếng Việt kèm nguyên văn trong ngoặc ở **lần xuất hiện đầu** cho phần còn lại | Tài liệu đã có quy ước tốt cho hai số đo, chỉ chưa mở rộng ra. Hiện *pain hypothesis* và *buying committee* nằm trần giữa câu tiếng Việt nên đọc như lỗi đánh máy, còn *idempotent* xuất hiện hai lần ở hai mục cách xa nhau mà chưa lần nào được giải nghĩa. Giữ nguyên từ, chỉ thống nhất cách trình bày |
| prose | §12.2, ô "Vì sao" của hàng *Buying committee*: *"Đúng nghiệp vụ nhưng phình mô hình dữ liệu. `[NOTE FOR PM]` — đây là mục dễ bị giám khảo vòng 3 hỏi nhất trong nhóm này"* | Bỏ dấu `[NOTE FOR PM]`, giữ nguyên câu: *"Đúng nghiệp vụ nhưng phình mô hình dữ liệu — và là mục dễ bị giám khảo vòng 3 hỏi nhất trong nhóm này"* | `[NOTE FOR PM]` là dấu của quá trình soạn thảo, còn sót lại trong bản giao. Nó cũng là cụm tiếng Anh duy nhất thuộc loại này trong một tài liệu tiếng Việt xuyên suốt. Nội dung câu ghi chú đáng giữ nguyên — chỉ bỏ cái nhãn. Nếu nhãn này là quy ước cố ý thì cần khai nó ở §0 và dùng nhất quán, vì hiện chỉ có đúng một chỗ |
| prose | Tiêu đề 50 khối FR, ví dụ: *"**FR-1 · Quản lý Công ty.** `phải có` Sales tạo, sửa, xoá, xem chi tiết Công ty."* | *"**FR-1 · Quản lý Công ty** — `phải có`. Sales tạo, sửa, xoá, xem chi tiết Công ty."* | Hiện nhãn ưu tiên rơi vào khoảng giữa dấu chấm của tiêu đề và chữ đầu của câu mô tả, nên vừa không thuộc tiêu đề vừa không thuộc câu. Đưa nó vào cuối dòng tiêu đề thì cả 50 khối có cùng một hình dạng quét được: mã · tên · nhãn, rồi mới tới mô tả. Sửa hình thức thuần, không đụng chữ nào |
| prose | *"Ba nhánh trên nói *thứ tự công việc*. Nhánh dưới nói *dữ liệu đi đâu*…"* (§4.3) | Cân nhắc: *"Hai nhánh trên nói *thứ tự công việc*. Ba nhánh dưới nói *dữ liệu đi đâu*…"*? | §4.1 và §4.2 khai hai nhánh — nhánh người và nhánh máy — nên "ba nhánh trên" khiến người đọc cuộn ngược tìm cái thứ ba (có thể tác giả đang đếm ba chỗ chạm ở §4.2). Cùng câu, "nhánh dưới" số ít trong khi bên dưới có ba khối mang chữ "Nhánh". Đề nghị này đi cùng đề nghị đổi nhãn tiêu đề §4.3 ở lượt cấu trúc |
| prose | *"Thông tin quyết định *"why now"* đều là nguồn công khai ai cũng lấy được, nhưng đọc chúng là việc tăng tuyến tính theo số công ty…"* (§1) | *"Thông tin quyết định *"why now"* đều nằm ở nguồn công khai ai cũng lấy được, nhưng đọc chúng là việc tăng tuyến tính theo số công ty…"* | "Thông tin … là nguồn" đặt dấu bằng giữa hai vế không cùng loại, rồi đại từ "chúng" ở vế sau lại trỏ về *thông tin* chứ không về *nguồn*. Đổi "là" thành "nằm ở" gỡ cả hai. Đây là câu mở của §1 Tầm nhìn |
| prose | *"…mọi thứ máy ghi phải truy được về nguồn đúng câu chữ, phân biệt được fact với suy luận ngay bằng mắt, và hoàn tác được dễ hơn cả lúc máy ghi."* (§1) | *"…mọi thứ máy ghi phải truy được về nguồn đúng câu chữ, phân biệt được đâu là sự kiện đâu là suy luận ngay bằng mắt, và hoàn tác dễ hơn cả lúc máy ghi nó."* | Ba việc: "fact" là từ tiếng Anh duy nhất trong §1 và không có trong từ vựng §3.1, trong khi tài liệu đã có cặp *nhận định / câu trích* để nói đúng ý này; "phân biệt được X với Y" ở dạng phủ định kép đọc chậm hơn "đâu là X đâu là Y"; và "hoàn tác được dễ hơn cả lúc máy ghi" thiếu tân ngữ nên có thể đọc thành *dễ hơn việc máy ghi* hoặc *dễ hơn lúc máy đang ghi* |
| prose | *"`§3` của đề bài viết *"tin mới thuộc **bốn dạng**"* rồi liệt kê sáu giá trị, và dùng nhãn khác `§4/nhóm 2` cho cùng sáu giá trị đó."* (§3.1, khối Cảnh báo từ vựng) | *"…rồi liệt kê sáu giá trị, và dùng nhãn khác với `§4/nhóm 2` cho cùng sáu giá trị đó."* | Thiếu "với", "dùng nhãn khác `§4/nhóm 2`" đọc được thành *dùng nhãn khác của §4/nhóm 2* — nghĩa ngược hẳn với điều khối cảnh báo muốn nói. Khối này tồn tại để gỡ một mâu thuẫn enum, nên bản thân nó không được mơ hồ |
| prose | *"Ba ranh giới đầu phải chặn được **kể cả khi thao tác đến từ ngoài giao diện** — `T-10` kiểm đúng điều này, và *"một lời dặn dò suông với phần AI không tính là đã chặn"*."* (§10.1) | *"Ba ranh giới đầu phải chặn được **kể cả khi thao tác đến từ ngoài giao diện**. `T-10` kiểm đúng điều này, và nói thẳng: *"một lời dặn dò suông với phần AI không tính là đã chặn"*."* | Liên từ "và" đang nối một mệnh đề với một câu trích không có động từ dẫn, nên câu trích lơ lửng không rõ ai nói. Thêm "nói thẳng" và tách câu là sửa nhỏ nhất; nó cũng làm rõ câu trích thuộc về `T-10` chứ không phải nhận xét của tác giả |
| prose | *"Tách riêng vì bước Epic & Story chỉ sinh story cho thứ có mã — để chúng nằm trong mục *Câu hỏi còn mở* là bảo đảm không ai làm."* (§9.2) | *"Tách riêng vì bước Epic & Story chỉ sinh story cho thứ có mã — cứ để chúng nằm trong mục *Câu hỏi còn mở* thì chắc chắn không ai làm."* | "là bảo đảm không ai làm" đọc thoáng qua thành một lời hứa tích cực trước khi người đọc nhận ra đó là cảnh báo. Đổi sang cấu trúc điều kiện "cứ… thì…" giữ nguyên ý và bỏ được cú vấp |
| prose | 4 sửa nhỏ nữa — "không tra được ở đề bài lẫn Mục 0" (§3.2, thiếu vế "cũng không") · "sắp lại `D16` một chỗ" (§10.2, thiếu "ở") · câu kết UJ-3 §2.3 gộp ba mệnh đề vào một vế · nhấn ba lớp `***"N gợi ý cần rà lại"***` ở FR-43 lệch với cùng câu đó ở `BR-B6`. Hỏi thì mở rộng | — | — |

---

## Tổng kết

**Số đề xuất:** 26 — **14 ở lượt cấu trúc** (7 cắt/gộp/rút gọn, 2 thêm giàn giáo, 2 chuyển chỗ hoặc
đổi nhãn, 1 câu hỏi đối chiếu số, 2 giữ lại có chủ đích), **12 ở lượt văn phong** cộng một dòng gộp
4 sửa nhỏ.

**Tác động số từ** — tính trên **11.812 từ** đo được:

| Hạng mục | Từ |
|---|---|
| Cắt và rút gọn (7 đề xuất cấu trúc) | −300 |
| Thêm giàn giáo: bảng tra FR (+120), dòng «Bản chụp» (+25) | +145 |
| **Ròng** | **−155 (≈ 1,3%)** |

Lượt văn phong không đổi độ dài đáng kể: phần lớn là thống nhất nhãn, quy ước mã và sửa tại chỗ.

**Không có mục tiêu độ dài, và không đề xuất nào cắt vì lý do dài.** Bảy chỗ cắt đều là **trùng lặp
thật** — cùng một mệnh đề, cùng mức chi tiết, xuất hiện lần thứ hai hoặc thứ ba mà không thêm ý:
mục §5.2 với khối trích dẫn trên nó, §5.3 với §3.2, ba lần phát biểu về `Q15`, hai khối *Việc phải
làm ngoài PRD*, ba lần kể lại danh sách loại trừ, hai phần ba §10.3 là con trỏ, và câu kết §12.4.
Với 50 FR thì 11.812 từ là mức hợp lý; giá trị của lượt này nằm ở **hai chỗ thêm** và ở việc thống
nhất nhãn, không nằm ở việc giảm chữ.

**Đánh đổi về khả năng hiểu.** Hai đề xuất có mặt trái, ghi rõ để tác giả cân:

- **Gộp §5.2 vào khối trích dẫn §5.1** làm mất một mục có tiêu đề trong mục lục. Nếu quyết định
  "chỉ Quản trị mở lại Cơ hội đã đóng" cần được tìm thấy bằng cách quét tiêu đề — chẳng hạn vì
  giám khảo vòng 3 hay hỏi tới — thì giữ nguyên §5.2 và thay vào đó rút khối trích dẫn §5.1 còn
  một dòng trỏ xuống.
- **Rút gọn §2.2 / §11 / §12.2 về một chỗ khai** đánh đổi tác dụng củng cố. Ba mục này phục vụ ba
  người đọc khác nhau ở ba thời điểm khác nhau; nếu §11 và §12.2 được đọc độc lập với §2 thì phần
  nhắc lại là có ích chứ không thừa. Trong trường hợp đó, giữ nhắc lại nhưng rút mỗi chỗ còn nửa
  dòng.

**Hai điều được giữ lại có chủ đích**, ghi ra để lượt biên tập sau không đề xuất cắt lại: chín khối
`làm chặt hơn` nằm rải theo từng quyết định (không gom về phụ lục), và ba hành trình người dùng
UJ-1…UJ-3 cùng hai sơ đồ ASCII ở §4 (bước UX đọc trước tiên, và §8 trỏ ngược về UJ ở cả sáu mục con).

**Cách viết hoa thuật ngữ nghiệp vụ** — Công ty, Cơ hội, Phát hiện, Bản lưu, Gợi ý… — được coi là
từ vựng có kiểm soát khai ở §3.1 và **không** có đề xuất nào đụng tới, ngoài một chỗ: *Bản chụp*
đang được viết hoa như thuật ngữ ở §4.3 nhưng chưa có dòng trong bảng, nên đề xuất là **thêm dòng**
chứ không phải bỏ viết hoa.
