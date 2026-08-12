# Phản biện và phân tích yêu cầu — đề bài "AI Native CRM"

Tài liệu do đội thi soạn, **không phải văn bản của ban tổ chức**. Nguồn duy nhất là năm tệp trong
thư mục này: [đề bài chính thức](Yêu%20Cầu%20đề%20bài%20chính%20thức%20của%20cuộc%20thi%20prd.md) ·
[thể lệ](0.%20Thể%20lệ%20AI%20Hackathon%2001%20-%20Dev%20Edition.md) ·
[playbook sales](1.%20Business%20Playbook%20-%20quy%20trình%20sales.md) ·
[phương pháp luận AI-native](2.%20Thiết%20kế%20phần%20mềm%20thế%20hệ%20AI%20Native%20-%20phương%20pháp%20luận.md) ·
[barem](3.%20Checklist%20chấm%20điểm%20AI-Hackathon.md).

Bốn mục dưới đây bám đúng bốn mức của hạng mục **Requirement Analysis** trong barem: diễn giải
nguyên bản (mức 1) → đặt câu hỏi làm rõ (mức 2) → phân rã story kèm tiêu chí nghiệm thu và bổ
sung tri thức nghiệp vụ (mức 3) → phản biện theo persona, tự tìm edge case và rủi ro, kèm prompt
log (mức 4).

Quy ước: mọi trích dẫn ghi kèm vị trí trong đề bài, ví dụ `§4/nhóm 4` hoặc `T-6`. Chỗ nào là suy
luận của đội thì viết rõ **giả định**, không trộn vào phần diễn giải.

---

# Mức 1 — Diễn giải lại yêu cầu thô

Phần này chỉ nói lại đề bài, chấp nhận nguyên bản, không thêm đánh giá.

**Sản phẩm cần dựng.** Một CRM B2B cho đội sales HBLAB, gồm hai nửa phải liền thành một sản
phẩm: một CRM dùng tay được trọn vẹn, và một lớp AI đọc nguồn công khai rồi chủ động đẩy thông
tin vào đúng chỗ trong CRM đó (`§1`). Đề bài chỉ quy định *cần gì* và *hệ thống cư xử ra sao*;
kiến trúc, công cụ, bố cục màn hình do đội quyết.

**Hai nỗi đau nguồn gốc** (`§1`): hồ sơ công ty luôn cũ nên sales biết tin muộn; và việc gõ lại
thông tin máy đọc được từ nguồn công khai ăn hết thời gian.

**Sáu nhóm tính năng** (`§4`), xếp theo mức tự chủ tăng dần của AI:

| Nhóm | Nội dung | Mức tự chủ của AI |
|---|---|---|
| 1 · CRM làm tay | Công ty, người liên hệ, cơ hội, 7 giai đoạn kéo thả, hoạt động, dòng thời gian, Việc tiếp theo, tìm/lọc, màn hình tổng quan | Không có AI. Tắt AI thì nhóm 1 vẫn đủ chức năng |
| 2 · Đọc nguồn, rút phát hiện | Bản lưu giữ nguyên văn kèm thời điểm; phát hiện kèm câu trích, vị trí trích, loại tin, mức chắc chắn | AI sinh dữ liệu nhưng **không** chạm vào dữ liệu của Sales |
| 3 · Hàng đợi gợi ý | Gợi ý dạng "hiện tại → đề nghị" kèm bằng chứng và hệ quả nếu sai; ba nút Duyệt / Sửa rồi duyệt / Bỏ; ghi vết mọi quyết định | Chờ người bấm. Không duyệt thì không có gì xảy ra |
| 4 · Tự đặt Việc tiếp theo | Khi có phát hiện đáng chú ý ở công ty đang có cơ hội mở thì tự điền Việc tiếp theo + ngày hạn theo độ gấp của loại tin, có thông báo, có Hoàn tác một cú bấm trong 7 ngày | Tự làm ngay, không hỏi ai |
| 5 · Vòng quét Đang theo dõi | Vòng lặp khép kín đọc lại nguồn → so bản lưu → rút phát hiện → tự thêm mục vào dòng thời gian; chu kỳ cấu hình được, mặc định 60 giây; Nhật ký vòng quét mỗi vòng và tổng hợp mỗi 10 vòng | Tự chạy, không dừng chờ duyệt ở bất kỳ bước nào |
| 6 · Bảng điều khiển Quản trị | Các con số chất lượng AI, chỉnh chu kỳ vòng quét, nút tắt toàn bộ AI có hiệu lực ngay và giữ nguyên dữ liệu đã sinh | Vùng điều khiển và phanh |

**Bốn ranh giới cứng** (`§5`): không tự đổi giai đoạn; không tự đánh dấu Thắng/Thua và không tự
sửa giá trị tiền; không tự liên hệ khách; không tự xoá dữ liệu do người tạo. Ba ranh giới đầu
phải chặn được cả khi thao tác đến từ ngoài giao diện người dùng.

**Dữ liệu** (`§3`): BTC phát bộ mẫu sáng 15/08/2026 — 12–15 công ty đủ năm loại, khoảng 30 người
liên hệ, 8 cơ hội, và bản chụp trang web mỗi công ty hai phiên bản "trước"/"sau". Nguồn web
trong đề bài **chính là các bản chụp này**, không phải web thật; chuyển "trước" → "sau" là cách
kích hoạt mọi kịch bản AI và phải làm được từ giao diện hoặc bằng một lệnh.

**Nghiệm thu và nộp bài** (`§6`, `§7`): một bộ kiểm thử tự động chạy bằng một lệnh phủ 10 điểm
T-1…T-10; mã nguồn trên GitLab HBLAB; log Claude Code chảy về Grafana; sản phẩm chạy ở cấu hình
giả lập production on-premise (bản dựng production, cấu hình qua biến môi trường, dữ liệu bền
sau restart, đăng nhập thật hai tài khoản, khởi động một lệnh); nạp dữ liệu BTC bằng một lệnh và
lặp lại được về trạng thái ban đầu.

---

# Mức 2 — Điểm mơ hồ và câu hỏi làm rõ

Mỗi dòng gồm câu hỏi cho BTC **và** giả định làm việc để đội không bị chặn nếu chưa có câu trả
lời. Giả định nào sai thì sửa một chỗ này, không phải sửa khắp mã nguồn.

| # | Chỗ mơ hồ | Câu hỏi cho BTC | Giả định làm việc |
|---|---|---|---|
| Q1 | `§3` viết "Tin mới thuộc **bốn dạng**" rồi liệt kê sáu giá trị (gọi vốn, bổ nhiệm lãnh đạo công nghệ, mở rộng, tuyển dụng, mảng kinh doanh mới, khác); `§4/nhóm 2` cũng dùng sáu | Danh sách loại tin chuẩn là bốn hay sáu giá trị? | Dùng sáu giá trị của `§4/nhóm 2` làm enum chuẩn; "bốn dạng" hiểu là bốn loại kinh điển của playbook |
| Q2 | `§4/nhóm 4` kích hoạt khi có "phát hiện **đáng chú ý**" | Đáng chú ý là gì — theo loại tin, theo mức chắc chắn, hay cả hai? Phát hiện mức **Đoán** có được tự đặt Việc tiếp theo không? | Chỉ tự đặt với loại tin gọi vốn / nhân sự cấp cao / mở rộng / tuyển dụng **và** mức Chắc hoặc Có thể. Mức Đoán chỉ đi vào hàng đợi nhóm 3 |
| Q3 | `§4/nhóm 4` nói tự điền cho "**cơ hội đó**" nhưng điều kiện là công ty "có **ít nhất một** cơ hội mở" | Công ty có nhiều cơ hội mở thì đặt cho cơ hội nào — tất cả, cơ hội giá trị lớn nhất, hay cơ hội ở giai đoạn xa nhất? | Đặt cho **mọi** cơ hội đang mở của công ty, mỗi cơ hội một bản ghi tự đặt và một nút Hoàn tác riêng |
| Q4 | `§2` định nghĩa mức **Đoán** là "không có bằng chứng trực tiếp", `§4/nhóm 2` lại cấm lưu phát hiện không có câu trích | Phát hiện mức Đoán trích cái gì? | Đoán vẫn phải trích đoạn văn mà nó suy ra từ đó; "không có bằng chứng trực tiếp" hiểu là câu trích không tự nói ra kết luận |
| Q5 | `§3` nói nguồn là bản chụp tĩnh, `§4/nhóm 2` đòi bản lưu kèm "**địa chỉ nguồn**" | Địa chỉ nguồn ghi gì — URL thật của công ty trong dữ liệu mẫu, hay đường dẫn tệp bản chụp? | Ghi cả hai: URL công bố của công ty (trường địa chỉ trang web) và định danh bản chụp đã dùng |
| Q6 | `§4/nhóm 2` và `T-3` đòi "**vị trí câu trích** trong bản lưu", có đánh dấu | Vị trí tính trên HTML thô hay trên văn bản đã tách thẻ? | Lưu bản lưu ở hai dạng (thô để đối chiếu, văn bản đã chuẩn hoá để neo) và tính offset trên bản chuẩn hoá; hiển thị đánh dấu trên bản chuẩn hoá |
| Q7 | `§4/nhóm 5` chu kỳ 60 giây, nhưng một vòng có gọi mô hình ngôn ngữ nên có thể chạy lâu hơn 60 giây | Vòng chạy quá chu kỳ thì chồng vòng, bỏ vòng, hay giãn chu kỳ? | Không chồng vòng: vòng mới chỉ chạy khi vòng trước kết thúc; vòng bị bỏ vẫn ghi một dòng nhật ký nói rõ lý do |
| Q8 | `§4/nhóm 3` cấm sinh lại gợi ý đã bỏ "**trừ khi có bản lưu mới**"; `§4/nhóm 5` đọc lại nguồn mỗi 60 giây | Đọc nguồn mà nội dung không đổi thì có tạo bản lưu mới không? | Chỉ tạo bản lưu khi nội dung khác bản gần nhất; chống trùng gợi ý theo dấu vân nội dung, không theo số hiệu bản lưu |
| Q9 | `T-4` đòi "hồ sơ công ty vẫn y nguyên" sau ba chu kỳ, trong khi `§4/nhóm 5` cho vòng quét tự thêm mục vào dòng thời gian | "Hồ sơ công ty" trong `T-4` có bao gồm dòng thời gian không? Công ty trong `T-4` có bật Đang theo dõi? | Hồ sơ công ty = các trường của công ty, **không** gồm dòng thời gian (đúng theo `§4/nhóm 2`). Kiểm thử chạy hai lần: một lần tắt và một lần bật Đang theo dõi |
| Q10 | `§4/nhóm 4` đòi ngày hạn "phản ánh độ gấp", `T-6` chỉ kiểm là nó có đổi | Có bảng ánh xạ loại tin → số ngày do BTC quy định không? | Tự công bố bảng ánh xạ trong sản phẩm và trong bảng Quản trị: gọi vốn 1 ngày · nhân sự cấp cao 3 ngày · mở rộng 7 ngày · tuyển dụng 7 ngày · mảng kinh doanh mới 5 ngày · khác 14 ngày |
| Q11 | `§4/nhóm 4` cho Hoàn tác trong 7 ngày, không nói cấu hình được | Cửa sổ 7 ngày có cấu hình được để giám khảo xem lúc hết hạn không? | Cửa sổ tính theo tham số cấu hình, mặc định 7 ngày, hiện rõ trên màn hình; kiểm thử tự động tiêm đồng hồ để kiểm mốc hết hạn |
| Q12 | `§4/nhóm 4` chỉ cấm đè lên Việc tiếp theo "do người nhập tay và **chưa tới hạn**" | Được đè lên giá trị người nhập đã quá hạn, và đè lên giá trị do chính hệ thống đặt trước đó? Hoàn tác nhiều lần thì về đâu? | Được đè hai trường hợp đó; Hoàn tác chỉ lùi **một bước**, và bản ghi lưu đủ chuỗi giá trị để tra cứu |
| Q13 | `§5` nói "Ba ranh giới đầu" phải chặn được ngoài giao diện, nhưng `T-10` lại kiểm cả xoá công ty — tức ranh giới thứ tư | Ranh giới thứ tư có phải chặn ngoài giao diện không? | Chặn cả bốn ở tầng nghiệp vụ, không phân biệt lối vào |
| Q14 | `§5.3` cấm tự liên hệ khách, nhưng sản phẩm không có tính năng gửi gì ra ngoài | Chứng minh ranh giới này bằng cách nào cho đủ? | Chứng minh bằng vắng mặt: không có thành phần gửi thư/tin nhắn, và một kiểm thử chặn mọi lệnh gọi ra ngoài danh sách cho phép |
| Q15 | `§7.5` đòi nạp dữ liệu BTC bằng một lệnh, `§3` nói dữ liệu phát sáng 15/08 | Định dạng và lược đồ bộ dữ liệu (tên tệp, tên cột, kiểu, ngôn ngữ nội dung) có được công bố trước không? | Viết bộ nạp theo lược đồ nội bộ của đội, tách riêng một lớp ánh xạ mỏng để sáng 15/08 chỉ sửa lớp đó |
| Q16 | `§1` nói ba thị trường JP, Global, KR | Bản chụp có nội dung tiếng Nhật, tiếng Hàn không? | Chuẩn bị cho nội dung đa ngữ: câu trích giữ nguyên ngôn ngữ gốc, câu nhận định viết tiếng Việt |
| Q17 | `§7.5` yêu cầu chạy lệnh nạp lần nữa là "về đúng trạng thái ban đầu" | Lệnh đó có xoá luôn bản ghi vết, số đo của Quản trị và các quyết định duyệt/bỏ không? | Có: đưa hệ thống về đúng trạng thái phát bài, kể cả ghi vết. Có cờ để giữ ghi vết khi cần đối chiếu |
| Q18 | `§2` nói dữ liệu mẫu chỉ có một tài khoản Sales, `§7.4` đòi đăng nhập thật hai tài khoản Sales và Quản trị | Quản trị có phải là một tài khoản riêng và Sales bị chặn vào màn hình Quản trị ở tầng nào? | Hai tài khoản, hai vai; chặn ở tầng nghiệp vụ, không chỉ ẩn menu |
| Q19 | `§4/nhóm 1` nhắc "danh sách việc phải làm" và "bảng thống kê lý do thua" nhưng `§4` không định nghĩa hai thứ này ở đâu | Hai màn hình đó có bắt buộc không? | Có: danh sách việc phải làm là danh sách Việc tiếp theo đến hạn/quá hạn ở màn hình tổng quan; thống kê lý do thua là một khối trong màn hình tổng quan |
| Q20 | `§4/nhóm 1` liệt kê xoá cho công ty và người liên hệ, nhưng cơ hội chỉ "tạo và quản lý" | Cơ hội có xoá được không? Xoá công ty thì cơ hội, người liên hệ, bản lưu, phát hiện, gợi ý đang chờ đi đâu? | Cơ hội xoá được; xoá công ty là xoá mềm và kéo theo toàn bộ dữ liệu phụ thuộc, gợi ý đang chờ bị đóng kèm lý do |
| Q21 | `§4/nhóm 6` yêu cầu các tỉ lệ duyệt/sửa/bỏ nhưng không nói mẫu số và khoảng thời gian | Số đo tính từ đầu hay theo cửa sổ thời gian? | Hiện cả hai: luỹ kế từ đầu và cửa sổ 24 giờ gần nhất |
| Q22 | Thể lệ nói vòng 1 "không có log bằng không có điểm" và "các đội làm trước thời điểm thu thập được log đều không được tính điểm", trong khi cũng thể lệ cho phép phát triển từ 12/8 | Phần việc làm trước 15/8 có được tính không, và mốc bắt đầu thu log là lúc nào? | Coi như chỉ log trong ngày thi được tính: mọi việc quan trọng có sinh log phải diễn ra lại trong ngày thi (viết kiểm thử, refactor, sinh tài liệu) |

---

# Mức 3 — Phân rã epic / story kèm tiêu chí nghiệm thu

Bảy epic: sáu nhóm tính năng của đề bài, cộng một epic vận hành cho `§6`–`§7`. Cột **T** là ánh
xạ tới bộ nghiệm thu; ô trống nghĩa là yêu cầu **không có kiểm thử nào của đề bài phủ tới** —
danh sách đầy đủ ở mục "Lỗ hổng phủ kiểm thử".

## E1 — CRM làm tay (`§4/nhóm 1`)

| ID | Story | Tiêu chí nghiệm thu | T |
|---|---|---|---|
| E1-S1 | Là Sales, tôi tạo/sửa/xoá/xem chi tiết công ty để quản lý danh sách khách | Tên, ngành, loại công ty là bắt buộc; các ô khác bỏ trống được và lưu được · loại công ty chỉ nhận đúng năm giá trị `§2` · xoá công ty xử lý dữ liệu phụ thuộc theo Q20 | T-1 |
| E1-S2 | Là Sales, tôi quản lý người liên hệ dưới công ty và chỉ định một đầu mối chính | Người liên hệ thuộc đúng một công ty · mỗi công ty có **nhiều nhất một** đầu mối chính; đặt người mới thì người cũ tự mất nhãn · xoá đầu mối chính thì công ty còn 0 đầu mối, không lỗi | T-1 |
| E1-S3 | Là Sales, tôi tạo cơ hội với giá trị và tháng dự kiến chốt | Cơ hội thuộc đúng một công ty, một công ty nhiều cơ hội · giá trị tiền không âm · giai đoạn khởi tạo là Tiếp cận | T-1 |
| E1-S4 | Là Sales, tôi kéo thả cơ hội giữa bảy giai đoạn | Bảy giai đoạn đúng thứ tự và đúng tên `§4/nhóm 1` · đi lùi và nhảy cóc đều được, hệ thống không chặn · đổi giai đoạn không cần mở biểu mẫu · mỗi lần đổi sinh một mục trên dòng thời gian | T-1 |
| E1-S5 | Là Sales, khi kéo cơ hội sang Đủ điều kiện tôi được hỏi ngay dấu hiệu nhu cầu và dấu hiệu ngân sách | Màn hình hỏi hai ô, mỗi ô một câu kèm chỗ ghi nguồn · bỏ qua được, cơ hội vẫn sang Đủ điều kiện · thiếu một trong hai ô thì cơ hội mang cờ cảnh báo nhìn thấy được cho tới khi bổ sung · thao tác kéo không bị chặn | T-1 |
| E1-S6 | Là Sales, tôi ghi hoạt động gắn vào công ty | Hoạt động có ngày, loại, mô tả, người liên hệ liên quan · người liên hệ chọn được chỉ trong phạm vi công ty đó | T-1 |
| E1-S7 | Là Sales, tôi xem một dòng thời gian duy nhất của công ty | Hoạt động, đổi giai đoạn và ghi chú hiện chung, mới nhất trên cùng · mục do hệ thống thêm mang nhãn riêng (E5-S3) | T-1 |
| E1-S8 | Là Sales, mỗi cơ hội có Việc tiếp theo và ngày hạn | Thiếu một trong hai ô vẫn lưu được · cơ hội đang mở mà thiếu thì mang cờ cảnh báo và **không** xuất hiện trong danh sách việc phải làm · điền đủ thì cờ mất và cơ hội vào lại danh sách | T-1 |
| E1-S9 | Là Sales, khi chuyển cơ hội sang Thua tôi được hỏi lý do | Bỏ qua được, cơ hội vẫn sang Thua · thiếu lý do thì mang cờ cảnh báo và đứng ngoài bảng thống kê lý do thua · thao tác không bị chặn | T-1 |
| E1-S10 | Là Sales, tôi tìm và lọc để tìm lại thứ đã nhập | Tìm công ty theo tên · lọc công ty theo ngành, loại, quốc gia, nhãn Đang theo dõi · lọc cơ hội theo giai đoạn và theo tình trạng quá hạn Việc tiếp theo · các bộ lọc kết hợp được | T-1 |
| E1-S11 | Là Sales, tôi mở màn hình tổng quan để biết hôm nay làm gì | Số công ty theo ngành · số cơ hội và tổng giá trị theo từng giai đoạn · danh sách Việc tiếp theo quá hạn · khối thống kê lý do thua (Q19) | T-1 |
| E1-S12 | Là Sales, tôi dùng trọn nhóm 1 khi phần AI bị tắt | Tắt AI ở E6-S3 thì toàn bộ E1-S1…S11 chạy đủ, không thiếu chức năng, không lỗi màn hình | T-1 |

## E2 — Đọc nguồn và rút phát hiện (`§4/nhóm 2`)

**E2-S1 · Bản lưu.** Là hệ thống, tôi đọc nội dung nguồn của một công ty và lưu thành bản lưu để
mọi nhận định sau này truy được về nguyên văn.
- Bản lưu giữ **nguyên văn**, kèm địa chỉ nguồn (Q5) và thời điểm đọc.
- Mỗi bản lưu thuộc **đúng một công ty**; một công ty nhiều bản lưu, xếp theo thời điểm đọc.
- Đọc lại không ghi đè bản cũ. Nội dung không đổi thì không tạo bản lưu mới (Q8).
- Nguồn không đọc được thì lưu một bản ghi "không đọc được" kèm lý do; hệ thống **không đoán**.

**E2-S2 · Phát hiện có bằng chứng.** Là Sales, tôi bấm được vào mọi nhận định của máy để thấy
chính xác câu chữ ở nguồn.
- Mỗi phát hiện gồm: câu nhận định ngắn, loại tin (enum sáu giá trị theo Q1), **câu trích nguyên
  văn**, **vị trí câu trích trong bản lưu** (Q6), mức chắc chắn.
- Phát hiện thuộc **đúng một công ty**, thừa kế từ bản lưu; **không** gắn thẳng vào cơ hội, người
  liên hệ hay hoạt động.
- **Không lưu được phát hiện thiếu câu trích** — chặn ở tầng nghiệp vụ, không chỉ ở giao diện.
  → `T-2`
- Bấm vào phát hiện ở bất cứ đâu nó xuất hiện thì mở đúng đoạn văn gốc, có đánh dấu vị trí. → `T-3`

**E2-S3 · Vùng đọc riêng.** Là Sales, tôi thấy bản lưu và phát hiện ở một khu riêng trong màn
hình công ty.
- Khu này không phải hồ sơ công ty và không phải dòng thời gian.
- Sinh phát hiện **không** làm đổi bất cứ thứ gì trong hồ sơ công ty, dòng thời gian hay cơ hội.
- Ba mức chắc chắn phân biệt được **không cần đọc chữ**; dùng ký hiệu **và** màu, không dùng màu
  đơn độc (xem R14).

**E2-S4 · Đọc tín hiệu theo loại công ty.** Là Sales, tôi thấy máy đã hiểu tín hiệu dưới góc loại
công ty của tôi.
- Câu nhận định nêu rõ loại công ty đã dùng để diễn giải (ví dụ gọi vốn ở Tech-based/Startup là
  "sắp xây MVP", ở IT Product là "sắp tăng tốc roadmap").
- Cùng một câu trích, hai loại công ty khác nhau cho hai câu nhận định khác nhau. → *không có T*

## E3 — Hàng đợi gợi ý (`§4/nhóm 3`)

**E3-S1 · Sinh gợi ý vào hàng đợi.** Khi có phát hiện mới về một công ty, hệ thống sinh gợi ý vào
hàng đợi chờ duyệt của người sở hữu.
- Hai loại: thêm một tin mới vào dòng thời gian; điền hoặc sửa một ô còn trống hoặc đã cũ của hồ sơ.
- Công ty **Đang theo dõi** thì loại "thêm tin mới" **không** sinh gợi ý, vì nhóm 5 đã tự thêm —
  xem F1 ở mức 4; đây là giả định của đội, cần BTC xác nhận.
- Gợi ý đã bị bỏ không sinh lại với cùng nội dung; so trùng theo dấu vân nội dung (Q8).

**E3-S2 · Đủ bằng chứng tại chỗ.** Mỗi gợi ý hiện đủ bốn thứ, không phải bấm sang màn hình khác:
nội dung "hiện tại → đề nghị", câu trích, mức chắc chắn, và một dòng nói rõ **hệ quả nếu sai**.

**E3-S3 · Ba nút quyết.** Duyệt · Sửa rồi duyệt · Bỏ.
- Bỏ là **một** thao tác kèm chọn lý do trong danh sách ngắn: thông tin sai, đúng nhưng không liên
  quan, đã cũ, hiểu sai ngữ cảnh, khác.
- Số thao tác để Bỏ **không nhiều hơn** số thao tác để Duyệt.
- **Sửa rồi duyệt** ghi là *sửa*, không cộng vào *duyệt*. → `T-5`
- Không duyệt thì **không có gì xảy ra**: hồ sơ giữ nguyên vô thời hạn, không tự hết hạn thành
  hành động, không có chế độ tự duyệt. → `T-4`

**E3-S4 · Ghi vết quyết định.** Mỗi gợi ý và mỗi lần quyết lưu: nội dung gợi ý, giá trị cũ, ai
quyết, lúc nào, quyết gì, lý do nếu bỏ, và **số giây** từ lúc mở gợi ý tới lúc bấm. → `T-5`

**E3-S5 · Nhắc có việc chờ.** Màn hình danh sách cơ hội và màn hình công ty hiện dấu hiệu "đang
có gợi ý chờ duyệt". → *không có T*

## E4 — Tự đặt Việc tiếp theo (`§4/nhóm 4`)

**E4-S1 · Tự điền.** Khi có phát hiện đáng chú ý (Q2) về công ty đang có cơ hội mở, hệ thống tự
điền Việc tiếp theo và ngày hạn ngay, không hỏi ai; áp cho mọi cơ hội đang mở của công ty (Q3).
- Nội dung nhắc tới sự kiện kích hoạt và **kèm chính câu trích**.
- Ngày hạn theo bảng ánh xạ độ gấp (Q10), không phải một con số cố định.
- Không đè lên Việc tiếp theo do người nhập tay và **chưa** tới hạn. → `T-6`
- **Không** tự đặt cho cơ hội ở giai đoạn Tạm dừng — xem F7; giả định của đội.

**E4-S2 · Phân biệt và báo.** Ô do hệ thống đặt mang dấu hiệu khác ô người gõ; người sở hữu nhận
thông báo trong sản phẩm nói rõ đặt gì, cho cơ hội nào, vì sao; thông báo không tự biến mất trước
khi được xem và còn sau khi khởi động lại. → `T-6`

**E4-S3 · Hoàn tác một cú bấm.** Nút Hoàn tác đưa Việc tiếp theo và ngày hạn về đúng giá trị
trước đó, kể cả khi giá trị trước đó là trống (cờ cảnh báo E1-S8 quay lại); dùng được trong cửa
sổ 7 ngày, cửa sổ hiện rõ trên màn hình; hết cửa sổ thì nút biến mất và ô sửa tay như thường. → `T-7`

**E4-S4 · Ghi vết hai chiều.** Mọi lần tự đặt lưu: cơ hội, giá trị cũ, giá trị mới, phát hiện kích
hoạt, thời điểm. Mọi lần hoàn tác lưu: ai bấm, lúc nào, về giá trị gì. Số lần và **tỉ lệ hoàn
tác** xem được ở màn hình Quản trị. → `T-7`

## E5 — Vòng quét Đang theo dõi (`§4/nhóm 5`)

**E5-S1 · Nhãn và danh sách.** Bật/tắt nhãn Đang theo dõi bằng một thao tác; có màn hình danh
sách riêng cho nhóm công ty này. → `T-8`

**E5-S2 · Vòng lặp khép kín.** Đọc lại nguồn → so với bản lưu gần nhất → có nội dung mới thì rút
phát hiện → tự thêm mục vào dòng thời gian kèm nhãn "do hệ thống thêm" và câu trích → quay lại
đầu vòng.
- Vòng **không dừng chờ ai duyệt** ở bất kỳ bước nào; tự quyết ghi hay không dựa trên việc nội
  dung có mới hay không.
- Chu kỳ cấu hình được, mặc định 60 giây; đổi có hiệu lực ngay.
- Vòng chạy lâu hơn chu kỳ thì **không chồng vòng** (Q7). → `T-8`

**E5-S3 · Mục do hệ thống thêm.** Mục mang nhãn phân biệt và câu trích; Sales xoá được như mọi
mục khác; mỗi lần Sales xoá một mục do hệ thống thêm đều được ghi vết (xem F12 — đây là số đo
error-detection rate mà đề bài chưa đòi). → `T-8`

**E5-S4 · Nhật ký vòng quét.** Mỗi vòng ghi một dòng: chạy lúc nào, quét bao nhiêu công ty, phát
hiện bao nhiêu nội dung mới, thêm bao nhiêu mục, mất bao lâu, lỗi gì. Mỗi 10 vòng ghi thêm một
dòng tổng hợp cộng dồn. → `T-8`

## E6 — Bảng điều khiển Quản trị (`§4/nhóm 6`)

**E6-S1 · Màn hình số đo.** Gom đủ: số phát hiện và phân bố ba mức chắc chắn; số gợi ý cùng tỉ lệ
duyệt, sửa-rồi-duyệt, bỏ, phân bố lý do bỏ; thời gian quyết trung bình; số lần tự đặt và tỉ lệ bị
hoàn tác. Mỗi số hiện cả luỹ kế và cửa sổ 24 giờ (Q21). Sales **không** vào được màn hình này, chặn
ở tầng nghiệp vụ (Q18). → *không có T*

**E6-S2 · Chỉnh chu kỳ.** Chu kỳ vòng quét chỉnh được từ đây, hiện đơn vị, giá trị mặc định và
một câu giải thích đổi nó thì cái gì đổi theo; có hiệu lực ngay. → *không có T*

**E6-S3 · Phanh.** Một nút tắt toàn bộ phần AI, hiệu lực ngay, không cần chạy lại sản phẩm.
- Khi tắt: vòng quét dừng, không sinh phát hiện, không sinh gợi ý, không tự đặt Việc tiếp theo.
- Dữ liệu đã sinh **không bị xoá**.
- Sales thấy một dòng thông báo nói rõ tính năng gợi ý đang tắt — không im lặng biến mất.
- Mỗi lần tắt/bật đều ghi vết kèm thời điểm; bật lại thì vòng quét chạy tiếp. → `T-9`

## E7 — Ranh giới, nghiệm thu và vận hành (`§5`–`§7`)

**E7-S1 · Ranh giới ở tầng nghiệp vụ.** Bốn ranh giới `§5` được chặn ở tầng nghiệp vụ, không phân
biệt lối vào (Q13): không tự đổi giai đoạn, không tự đánh Thắng/Thua, không tự sửa giá trị tiền,
không tự liên hệ khách, không tự xoá dữ liệu do người tạo. Lời dặn dò trong prompt **không** tính
là đã chặn. → `T-10`

**E7-S2 · Chặn gọi ra ngoài.** Không có thành phần gửi thư/tin nhắn; mọi lệnh gọi mạng ra ngoài
phải nằm trong danh sách cho phép, ngoài danh sách thì bị từ chối và ghi vết (Q14). → *không có T*

**E7-S3 · Chuyển phiên bản nguồn.** Chuyển một công ty từ bản chụp "trước" sang "sau" làm được từ
giao diện **và** bằng một lệnh; lặp lại được nhiều lần. → `T-6`, `T-8`

**E7-S4 · Bộ nghiệm thu một lệnh.** Bộ kiểm thử tự động phủ T-1…T-10, chạy bằng một lệnh, in kết
quả rõ ràng, không phụ thuộc thứ tự chạy và không phụ thuộc dữ liệu còn lại từ lần chạy trước.

**E7-S5 · Cấu hình giả lập production.** Bản dựng production (không dev server, không hot reload,
không chế độ gỡ lỗi); cấu hình qua biến môi trường gồm khoá dịch vụ ngoài, chuỗi kết nối cơ sở dữ
liệu, chu kỳ vòng quét; dữ liệu bền sau khi khởi động lại tiến trình; khởi động một lệnh; log ra
chỗ xem được.

**E7-S6 · Đăng nhập thật.** Hai tài khoản Sales và Quản trị, giám khảo tự vào được.

**E7-S7 · Nạp dữ liệu một lệnh.** Nạp bộ dữ liệu BTC bằng một lệnh, không gõ tay, không sửa mã;
chạy lại thì về đúng trạng thái ban đầu (Q17). Một lớp ánh xạ mỏng để đổi lược đồ nguồn mà không
sửa phần còn lại (Q15).

**E7-S8 · Log Claude Code về Grafana.** Log chảy về Grafana của công ty, mở được bảng theo dõi
trước buổi demo. Đây là **điều kiện tiên quyết của vòng 1** theo thể lệ, không phải hạng mục phụ.

## Bổ sung tri thức nghiệp vụ mà đề bài không nói ra

Đề bài cố ý chỉ mô tả hành vi. Ba tệp còn lại trong thư mục này cấp phần tri thức mà người viết
mã cần để không hiểu sai:

| Điều cần biết | Nguồn | Tại sao ảnh hưởng tới mã |
|---|---|---|
| Bốn đối tượng nguyên thủy Observation → Claim → Proposal, với Provenance làm sợi dây truy vết | Phương pháp luận, phần 4 | Từ vựng đề bài là lớp vỏ tiếng Việt của đúng bốn đối tượng này: **bản lưu** = observation, **phát hiện** = claim, **câu trích + vị trí** = provenance, **gợi ý** = proposal. Hiểu vậy thì các ràng buộc "không lưu phát hiện thiếu câu trích", "phát hiện không chạm hồ sơ" không còn là quy định rời rạc mà là một mô hình |
| Ranh giới claim: ghi chép 1-1 không phải claim; hễ **biến đổi** thông tin gốc là claim | Phương pháp luận, phần 4 | Quyết định thứ gì phải mang mức chắc chắn và câu trích. Bản summarize cũng là phát hiện |
| Trần tự chủ theo vùng: vùng tự do (observation) · vùng chạy ngầm (claim/proposal) · vùng cấm tuyệt đối | Phương pháp luận, phần 5 | Giải thích vì sao nhóm 2 được tự do, nhóm 3 phải chờ, nhóm 4 được tự làm nhưng có phanh — và vì sao ranh giới phải nằm trong mã, không nằm trong prompt |
| Quyền ≠ trách nhiệm: người duyệt phải **đủ năng lực** duyệt, hệ thống phải cấp đủ bằng chứng và thời gian | Phương pháp luận, phần 5 | Là lý do `§4/nhóm 3` đòi bốn thứ hiện tại chỗ và đòi đo *số giây* quyết. Số giây quá thấp là dấu hiệu duyệt mù, không phải thành tích |
| Hai số đo cùng cặp: **auto-accept rate** đo hệ thống khôn lên, **error-detection rate** đo người khôn lên | Phương pháp luận, phần 3 | Đề bài chỉ đòi nửa đầu. Nửa sau phải tự thêm — xem F12 |
| Tháp độ tin cậy của nguồn | Phương pháp luận, phần 7 | Gợi ý cách đặt mức chắc chắn khi một phát hiện đến từ nguồn yếu |
| Selection > Volume — chọn đúng khách quan trọng hơn chốt deal | Playbook, mục 4 | Lý do vì sao hàng đợi gợi ý **cần thứ tự ưu tiên**, dù đề bài không đòi — xem F13 |
| Qualify hai chiều: khách *cần* (requirement) và khách *chi được* (budget), cả hai phải là **fact kiểm chứng được** | Playbook, mục 4 | Là nội dung thật của hai ô ở E1-S5; chỗ ghi nguồn không phải trang trí |
| Bốn loại tín hiệu kinh điển và câu hỏi "Why now?"; tín hiệu tốt đến muộn là tín hiệu vô giá trị | Playbook, mục 5 | Là căn cứ cho bảng ánh xạ độ gấp ở Q10 |
| PIC là người sở hữu nỗi đau, không nhất thiết chức danh cao nhất | Playbook, mục 3 · đề bài `§4/nhóm 1` | Đầu mối chính không phải "người cấp cao nhất"; đừng tự động chọn theo chức danh |
| Một dòng dữ liệu **sai** tệ hơn một dòng **trống** | Playbook, mục cuối | Xếp thứ tự ưu tiên khi cân giữa "gợi ý nhiều" và "gợi ý đúng": thà để trống |

## Lỗ hổng phủ kiểm thử

Yêu cầu có trong `§4` nhưng không điểm nào trong T-1…T-10 kiểm tới:

- Đọc tín hiệu theo loại công ty (`§4/nhóm 2`) — phần AI có giá trị nghiệp vụ cao nhất của nhóm 2.
- Ba mức chắc chắn phân biệt được không cần đọc chữ (`§4/nhóm 2`).
- Đọc lại nguồn không xoá phát hiện cũ (`§4/nhóm 2`).
- Nguồn không đọc được thì ghi lại, không đoán (`§4/nhóm 2`).
- Gợi ý hiện đủ bốn thứ tại chỗ, gồm dòng "hệ quả nếu sai" (`§4/nhóm 3`).
- Bỏ không tốn nhiều thao tác hơn Duyệt (`§4/nhóm 3`).
- Gợi ý đã bỏ không sinh lại (`§4/nhóm 3`).
- Dấu hiệu "đang có gợi ý chờ duyệt" trên hai màn hình (`§4/nhóm 3`).
- Ngày hạn phản ánh **độ gấp** theo loại tin (`§4/nhóm 4`) — `T-6` chỉ kiểm là có đổi.
- Không đè lên Việc tiếp theo người nhập chưa tới hạn (`§4/nhóm 4`).
- Hết cửa sổ 7 ngày thì nút Hoàn tác biến mất (`§4/nhóm 4`).
- Dòng tổng hợp cộng dồn mỗi 10 vòng (`§4/nhóm 5`).
- Toàn bộ nhóm 6 trừ nút tắt: số đo, chỉnh chu kỳ, phân quyền Sales/Quản trị (`§4/nhóm 6`).
- Ranh giới `§5.3` không tự liên hệ khách.

Đội nên tự viết thêm kiểm thử cho các điểm này. Vòng 3 do Sales chấm theo tính năng, nên phần
không có kiểm thử vẫn bị nhìn thấy.

---

# Mức 4 — Phản biện theo persona, edge case và rủi ro

## Bốn persona và điều họ sẽ nói

**Mai · sales rep thị trường JP, người dùng hằng ngày.** "Tôi bật Đang theo dõi cho tám công ty
quan trọng. Sáng ra dòng thời gian của mỗi công ty có thêm mấy mục do máy ghi, hàng đợi lại có
thêm mấy gợi ý về cùng những tin đó. Vậy tôi phải đọc hai lần một tin? Và các anh nói 'không
duyệt thì không có gì xảy ra' — nhưng máy đã ghi vào dòng thời gian của tôi rồi." → F1, F2

"Hàng đợi của tôi không có thứ tự. Mười lăm gợi ý xếp hàng như nhau, trong đó có cái 'công ty
gọi vốn Series B' và cái 'công ty đổi số điện thoại tổng đài'. Tôi cần cái gấp nằm trên, không
cần cái nào cũng có bằng chứng đẹp." → F13

"Một cơ hội tôi đang **Tạm dừng** vì khách xin hoãn ngân sách sang quý sau. Máy vẫn đặt cho nó
Việc tiếp theo hạn 1 ngày vì công ty vừa có tin. Tôi phải hoàn tác từng cái." → F7

"Tôi ghi tay Việc tiếp theo 'gọi lại sau Obon' hạn tuần trước, chưa kịp làm. Máy thấy quá hạn nên
ghi đè. Câu tôi viết mất luôn, tôi chỉ còn nút hoàn tác trong 7 ngày và không biết mình đã mất
gì." → F8

**Hùng · quản lý, vai Quản trị.** "Tôi thấy tỉ lệ duyệt 82%. Nhưng thời gian quyết trung bình là
4 giây. Rep của tôi đang duyệt mù, và con số 82% đó đang nói dối tôi rằng máy chạy tốt." → F11

"Tôi có tỉ lệ hoàn tác, nhưng không có số nào cho biết rep **phát hiện ra máy sai** — họ xoá mục
máy ghi trên dòng thời gian mà chỗ đó không ghi lại gì." → F12

"Rep duyệt một gợi ý sửa ô 'quy mô' từ 200 thành 2000 người. Sai. Không có nút hoàn tác ở hàng
đợi, tôi phải đi tra ghi vết rồi gõ lại tay. Nhóm 4 thì có hoàn tác một cú bấm — vì sao nhóm 3
không có?" → F9

**Quân · giám khảo kỹ thuật, vòng 2.** "Bộ kiểm thử 10 điểm do chính đội viết, và tôi chạy nó. Đội
nào viết `T-10` chặt thì tự làm khó mình, đội nào viết lỏng vẫn xanh hết. Tôi sẽ hỏi các anh câu
này ở phần vấn đáp: `T-4` của các anh có bật Đang theo dõi không?" → F3, F4

"`T-8` yêu cầu 'hai mục mới xuất hiện' sau khi đổi nguồn hai công ty. Nếu một bản chụp 'sau' có
hai tin — gọi vốn và tuyển dụng — thì hệ thống đúng phải ghi bốn mục, và kiểm thử của các anh sẽ
đỏ vì làm đúng." → F5

"Cửa sổ hoàn tác 7 ngày: tôi không có cách nào thấy nó hết hạn trong một buổi demo. Các anh chứng
minh thế nào?" → Q11

**Linh · sales chấm vòng 3, end user.** "Tôi không quan tâm kiến trúc. Tôi mở lên, thấy một công
ty tôi biết rõ, và muốn tin những gì màn hình nói. Nếu có một dòng máy ghi sai mà tôi phải tự đi
sửa, tôi sẽ tin cả sản phẩm ít hơn một mức." (Playbook: một dòng dữ liệu sai tệ hơn một dòng
trống.) → F13, F14

## Mâu thuẫn nội tại và lỗ hổng của đề bài

| # | Vấn đề | Vị trí | Hệ quả nếu làm y nguyên |
|---|---|---|---|
| F1 | Với công ty **Đang theo dõi**, cùng một phát hiện kích hoạt hai đường ghi: nhóm 3 sinh gợi ý "thêm tin mới vào dòng thời gian" chờ duyệt, nhóm 5 **tự thêm** mục đó. Đề bài không nói đường nào nhường đường nào | `§4/nhóm 3` · `§4/nhóm 5` | Dòng thời gian có mục do máy ghi, hàng đợi có gợi ý ghi lại đúng mục đó. Duyệt gợi ý thì trùng hai mục |
| F2 | Lời hứa "**không duyệt thì không có gì xảy ra**, hồ sơ giữ nguyên vô thời hạn" chỉ đúng với các ô của hồ sơ. Với công ty Đang theo dõi thì dòng thời gian vẫn bị ghi thêm mà không ai duyệt | `§4/nhóm 3` · `§4/nhóm 5` | Sales hiểu sai mức tự chủ thật của hệ thống. Đây là chỗ đề bài mâu thuẫn với chính nguyên tắc "quyền ≠ trách nhiệm" của phương pháp luận |
| F3 | `T-4` không nói công ty thử nghiệm có bật Đang theo dõi hay không, và không định nghĩa "hồ sơ công ty" có gồm dòng thời gian | `T-4` | Kiểm thử **pass rỗng**: tắt Đang theo dõi thì vòng quét không chạm công ty đó, T-4 xanh dù nhóm 3 chưa làm gì |
| F4 | Bộ nghiệm thu do đội tự viết rồi giám khảo chạy chính bộ đó | `§6` | Chuẩn nghiệm thu khác nhau giữa các đội; đội viết kiểm thử chặt bị bất lợi. Cần BTC phát bộ kiểm thử chuẩn hoặc chấm cả **chất lượng** kiểm thử |
| F5 | `T-6` và `T-8` khẳng định số lượng kết quả ("Việc tiếp theo tự đổi", "hai mục mới") nhưng `§3` cho phép một bản chụp "sau" chứa nhiều tin, và một công ty có nhiều cơ hội mở | `T-6` · `T-8` · `§3` | Hệ thống làm đúng vẫn có thể làm kiểm thử đỏ. Kiểm thử phải khẳng định *quan hệ* (mỗi tin mới sinh đúng một mục), không khẳng định con số tuyệt đối |
| F6 | `§5` nói "**ba** ranh giới đầu" phải chặn được ngoài giao diện, nhưng `T-10` kiểm cả xoá công ty — tức ranh giới thứ tư | `§5` · `T-10` | Đề bài tự bất nhất. Đội làm đúng chữ `§5` sẽ đỏ `T-10` |
| F7 | **Tạm dừng** được xếp là *đang mở*, nên cơ hội tạm dừng vừa bị đòi Việc tiếp theo (cờ cảnh báo) vừa là đích của nhóm 4 tự đặt | `§4/nhóm 1` · `§4/nhóm 4` | Máy giục một thương vụ mà con người đã cố ý dừng — sai nghiệp vụ, và tạo nhiễu đúng chỗ Sales tin tưởng nhất |
| F8 | Nhóm 4 chỉ cấm đè lên Việc tiếp theo do người nhập **và chưa tới hạn** — nghĩa là được đè lên câu người viết đã quá hạn | `§4/nhóm 4` | Ghi đè dữ liệu con người tạo, trong khi `§5.4` cấm tự xoá dữ liệu do người tạo. Hai điều này va nhau về tinh thần; ít nhất phải giữ giá trị cũ hiện được ngay trên ô, không chỉ nằm trong log |
| F9 | Nhóm 4 có Hoàn tác một cú bấm; nhóm 3 **không có** đường lùi nào sau khi Duyệt, dù Duyệt ghi trực tiếp vào hồ sơ công ty | `§4/nhóm 3` · `§4/nhóm 4` | Chỗ hậu quả nặng hơn (sửa hồ sơ mang đi họp) lại được bảo vệ ít hơn chỗ hậu quả nhẹ hơn |
| F10 | "Phát hiện **đáng chú ý**" không có định nghĩa; mức chắc chắn **Đoán** không bị loại khỏi nhóm 4 | `§4/nhóm 4` | Một phỏng đoán không bằng chứng trực tiếp có thể tự ghi vào cơ hội thật. Vi phạm tinh thần grounding của phương pháp luận |
| F11 | Nhóm 6 đo tỉ lệ duyệt và **thời gian quyết trung bình** nhưng không đặt ngưỡng, không cảnh báo | `§4/nhóm 6` | Tỉ lệ duyệt cao + thời gian quyết vài giây là dấu hiệu duyệt mù, đúng cái bẫy AI-centric mà phương pháp luận cảnh báo. Nên hiện cặp số cạnh nhau và cảnh báo khi thời gian quyết thấp bất thường |
| F12 | Đề bài chỉ đòi số đo phía hệ thống (auto-accept, tỉ lệ hoàn tác), thiếu **error-detection rate** — tỉ lệ người tìm ra lỗi của máy | `§4/nhóm 6` · phương pháp luận phần 3 | Không đo được người có khôn lên hay không; mất đúng nửa số đo mà tài liệu phương pháp luận coi là bắt buộc. Nguồn dữ liệu có sẵn: lý do bỏ "thông tin sai", và việc Sales xoá mục do hệ thống thêm — nhưng `§4/nhóm 5` không đòi ghi vết lần xoá đó |
| F13 | Không có **thứ tự ưu tiên** cho phát hiện và gợi ý; đề bài chủ động bỏ ICP scoring | `§2` · `§4/nhóm 3` | Trái nguyên tắc Selection > Volume và câu hỏi "Why now?" của playbook. Vòng 3 do Sales chấm sẽ hỏi ngay câu này. Rẻ nhất: sắp hàng đợi theo độ gấp của loại tin × mức chắc chắn, không cần ICP |
| F14 | Mức chắc chắn được phép phân biệt bằng "ký hiệu **hoặc** màu" | `§4/nhóm 2` | Nếu chọn màu đơn độc thì người mù màu không phân biệt được — vẫn "phải đọc chữ". Dùng ký hiệu kèm màu |
| F15 | `§3` viết "bốn dạng" rồi liệt kê sáu giá trị | `§3` | Enum loại tin không xác định; ảnh hưởng bảng ánh xạ độ gấp và bộ lọc |
| F16 | "Bảng thống kê lý do thua" và "danh sách việc phải làm" được nhắc như thứ đã có, nhưng `§4` không định nghĩa màn hình nào chứa chúng | `§4/nhóm 1` | Hai tính năng ẩn. Đội không đọc kỹ sẽ thiếu, và cờ cảnh báo ở `§4/nhóm 1` mất chỗ để có nghĩa |
| F17 | Nhóm 1 có xoá công ty và người liên hệ, không nói xoá cơ hội; và không nói xoá công ty thì cơ hội, bản lưu, phát hiện, gợi ý đang chờ đi đâu | `§4/nhóm 1` | Dữ liệu mồ côi, gợi ý chờ duyệt trỏ vào công ty không còn tồn tại |
| F18 | Chu kỳ 60 giây gặp độ trễ của mô hình ngôn ngữ; đề bài không nói gì về chồng vòng, huỷ vòng, hay lỗi giữa vòng | `§4/nhóm 5` | Vòng chồng vòng sinh phát hiện trùng và làm `T-8` bất định. Nhật ký cần dòng cho vòng bị bỏ |
| F19 | "Gợi ý đã bỏ không sinh lại với **cùng nội dung**, trừ khi có bản lưu mới" — mà mỗi lần đọc lại đều có thể tạo bản lưu mới | `§4/nhóm 3` · `§4/nhóm 5` | Gợi ý đã bỏ mọc lại mỗi 60 giây; demo chìm trong rác. Phải chống trùng theo dấu vân nội dung, và chỉ tạo bản lưu khi nội dung đổi |
| F20 | Lược đồ bộ dữ liệu BTC không được công bố trước, nhưng `§7.5` đòi nạp bằng một lệnh, không sửa mã | `§3` · `§7` | Sáng 15/08 phải viết bộ nạp cho một lược đồ chưa biết. Rủi ro cao nhất về mặt thời gian trong toàn bộ đề bài |
| F21 | `§1` nêu ba thị trường JP, Global, KR nhưng không nói ngôn ngữ nội dung bản chụp | `§1` · `§3` | Nếu bản chụp có tiếng Nhật/Hàn, việc trích câu và neo vị trí khó hơn nhiều; câu nhận định phải chọn ngôn ngữ |
| F22 | Toàn bộ nhóm 6 (trừ nút tắt) và ranh giới `§5.3` không có kiểm thử; phần AI có giá trị nghiệp vụ cao nhất — đọc tín hiệu theo loại công ty — cũng không | `§6` | Chỗ dễ bị cắt khi hết giờ lại là chỗ vòng 3 nhìn thấy đầu tiên |
| F23 | Đề bài đặt trọng tâm vào sản phẩm, còn barem chấm theo **giai đoạn dùng AI** (Requirement 20 · Design 20 · Dev 25 · Testing 20 · Deployment 15) và vòng 1 chấm tự động qua log Claude Code | `§6`–`§7` · barem · thể lệ | Sản phẩm hoàn hảo nhưng không có log thì trượt vòng 1; ngược lại, log đẹp mà thiếu tính năng thì chỉ chết ở vòng 3. Phải làm cả hai, và log là điều kiện tiên quyết |
| F24 | Thể lệ cho phát triển từ 12/8 nhưng cũng viết "các đội làm trước thời điểm thu thập được log đều không được tính điểm" | thể lệ | Không rõ công sức trước ngày thi có được tính. Phải hỏi BTC; nếu không có câu trả lời thì lên kế hoạch để mọi việc sinh log quan trọng diễn ra trong ngày thi |

## Edge case cần xử lý dù đề bài không nhắc

| Tình huống | Đề bài nói gì | Xử lý đề nghị |
|---|---|---|
| Hoàn tác khi giá trị trước đó là **trống** | Chỉ nói "về đúng giá trị trước đó" | Về trống, và cờ cảnh báo thiếu Việc tiếp theo quay lại |
| Hệ thống tự đặt **hai lần liên tiếp** trên cùng cơ hội | Không nói | Hoàn tác lùi một bước; log giữ đủ chuỗi; nút hiện rõ đang lùi về giá trị nào |
| Tắt AI **giữa** một vòng quét | `T-9` chỉ kiểm hai chu kỳ sau đó | Vòng đang chạy dừng ở ranh giới an toàn, không ghi nửa vời; nhật ký ghi một dòng "bị dừng do tắt AI" |
| Bật AI lại sau một khoảng tắt | "Vòng quét chạy tiếp" | Không đọc bù quá khứ: coi bản chụp hiện tại là mốc so sánh, ghi rõ trong nhật ký để giám khảo không chờ mục cũ |
| Xoá công ty đang có gợi ý chờ duyệt | Không nói | Đóng các gợi ý đó kèm lý do "công ty đã xoá"; không để mồ côi |
| Xoá cơ hội đang có Việc tiếp theo do hệ thống đặt trong cửa sổ hoàn tác | Không nói | Bản ghi tự đặt vẫn giữ; nút hoàn tác biến mất cùng cơ hội |
| Đổi đầu mối chính khi công ty đã có một người | "Đúng một người" | Người cũ tự mất nhãn, ghi một mục dòng thời gian |
| Nguồn trả về nội dung rỗng hoặc lỗi mạng | "Ghi lại là không đọc được" | Bản ghi lỗi kèm lý do và mã lỗi; không tạo bản lưu rỗng; không rút phát hiện |
| Mô hình ngôn ngữ lỗi, hết hạn mức, hoặc trả về JSON sai định dạng | Đề bài chỉ nói về nguồn không đọc được | Coi như một lỗi vòng quét: ghi nhật ký, thử lại có giới hạn, không sinh phát hiện nửa vời. Đây là lỗi khác lỗi nguồn, nên tách hai loại |
| Câu trích do mô hình trả về **không tìm thấy** trong bản lưu (mô hình tự viết lại câu) | "Không lưu được phát hiện không có câu trích" | Đối chiếu bắt buộc: câu trích phải khớp nguyên văn trong bản lưu, không khớp thì loại bỏ phát hiện đó và ghi nhật ký |
| Cùng một tin xuất hiện lại ở bản chụp sau | "Có nội dung mới thì rút phát hiện" | So theo dấu vân nội dung của từng tin, không so cả trang |
| Hai vòng quét cùng ghi vào một công ty | Không nói | Khoá theo công ty; một công ty chỉ được một vòng xử lý tại một thời điểm |
| Người đang mở gợi ý thì gợi ý bị vòng quét làm cũ | Không nói | Không rút gợi ý khỏi tay người đang xem; khi bấm mà dữ liệu đã đổi thì báo rõ và hiện bản mới |
| Múi giờ của ngày hạn với ba thị trường JP/Global/KR | Không nói | Lưu mốc thời gian theo UTC, hiện theo múi giờ người dùng; ngày hạn tính theo ngày làm việc của thị trường công ty |
| Giá trị tiền của cơ hội ở nhiều đơn vị tiền tệ | Không nói | Một đơn vị duy nhất trong phạm vi hackathon, ghi rõ trên giao diện |
| Chạy bộ kiểm thử hai lần liên tiếp | `§6` chỉ nói chạy một lệnh | Kiểm thử tự dựng và tự dọn dữ liệu, không phụ thuộc lần chạy trước |

## Rủi ro cần theo dõi

| Rủi ro | Dấu hiệu sớm | Cách chặn |
|---|---|---|
| Lược đồ dữ liệu BTC lệch với thứ đội chuẩn bị (F20) | Không có, tới sáng 15/08 mới biết | Tách lớp ánh xạ nguồn; tự sinh một bộ dữ liệu đúng mô tả `§3` để phát triển; giữ 60 phút trong ngày thi cho việc nối dữ liệu |
| Không dựng được log Claude Code → Grafana (F23) | Bảng theo dõi trống ở buổi tổng duyệt | Làm việc này **trước tiên**, không để cuối; kiểm tra bằng một lần chạy thật và xem log lên bảng |
| Vòng quét 60 giây làm cạn hạn mức mô hình ngôn ngữ trong lúc demo | Nhật ký vòng quét có lỗi hạn mức | Đặt trần số lệnh gọi mỗi vòng; nhớ đệm theo dấu vân nội dung; có chế độ chạy không cần mô hình cho phần trích xuất đơn giản |
| Gợi ý mọc lại mỗi vòng (F19) làm demo mất kiểm soát | Hàng đợi tăng đều mỗi phút | Chống trùng theo dấu vân; chỉ tạo bản lưu khi nội dung đổi |
| Chỉ hoàn thành nửa CRM làm tay vì dồn sức cho phần AI | `T-1` chưa xanh sau ngày thứ hai | `T-1` là điều kiện tiên quyết: nhóm 1 phải xanh trước khi mở việc nhóm 4 và 5 |
| Ranh giới `§5` chỉ được viết trong prompt thay vì trong mã (`§5` cấm đúng điều này) | Không có kiểm thử nào gọi thẳng tầng nghiệp vụ | Chặn ở tầng nghiệp vụ, và viết kiểm thử gọi vòng qua giao diện |
| Bộ kiểm thử tự viết quá lỏng, bị vấn đáp vòng 2 bóc (F4) | `T-4`, `T-10` chỉ vài dòng | Viết kiểm thử đúng theo tinh thần, và chuẩn bị trả lời "chỗ này chúng tôi chọn kiểm chặt hơn đề bài vì…" |
| Duyệt mù làm số đo đẹp giả (F11) | Thời gian quyết trung bình dưới ngưỡng vài giây | Hiện cặp tỉ lệ duyệt + thời gian quyết cạnh nhau, có cảnh báo |

---

# Phụ lục — Prompt log

Ghi lại đúng quá trình tạo ra tài liệu này, để phần phân tích yêu cầu có chỗ đối chiếu.

**Bối cảnh trước đó trong cùng phiên.** Bốn tệp gốc của BTC ở thư mục này (hai `.docx`, một
`.xlsx`, một PDF không đuôi) được chuyển sang markdown để đọc và trích dẫn được: `.docx` và
`.xlsx` chuyển bằng thư viện, PDF là tài liệu dàn nhiều cột nên các bảng được dựng lại từ toạ độ
từng đoạn chữ. Đã kiểm lại độ phủ văn bản: 166/166 và 65/65 đoạn của hai tệp `.docx` có mặt trong
bản markdown; phần lệch của PDF chỉ là mảnh vỡ do lỗi mã hoá chữ `Đ` và chữ giãn cách, không mất
nội dung. Bản markdown là thứ được dùng để phản biện, nên bước kiểm này là điều kiện để tin vào
các trích dẫn trong tài liệu.

**Yêu cầu của người dùng, nguyên văn:** *"review và phản biện lại Yêu Cầu đề bài chính thức cuộc
thi. Yêu cầu tối thiểu cần có: Tóm tắt/diễn giải lại yêu cầu thô, chấp nhận nguyên bản · Dùng AI
đặt câu hỏi làm rõ, phát hiện điểm mơ hồ · Phân rã thành user stories/epics có acceptance
criteria, có review & bổ sung domain knowledge · Đóng vai persona người dùng để phản biện yêu
cầu, tự phát hiện edge case/rủi ro, có prompt log lý giải"* — bốn gạch đầu dòng này là đúng bốn
mức của hạng mục Requirement Analysis trong barem, nên tài liệu lấy chúng làm bốn mục chính.

**Ràng buộc bổ sung của người dùng:** *"không reference đến các file khác ngoài thư mục Đề bài"* —
vì vậy tài liệu chỉ dẫn tới năm tệp trong thư mục này, không dẫn tới tài liệu nội bộ khác của
đội. Ban đầu đã định đối chiếu với các tài liệu kế hoạch của đội; ràng buộc này chặn lại, và đó
là lựa chọn đúng cho một bản phản biện đề bài: kết luận phải đứng được chỉ bằng văn bản BTC phát.

**Cách làm, theo thứ tự:**

1. Đọc trọn đề bài, không tóm tắt sớm — mục 1 của tài liệu này viết trước khi phê phán, để không
   trộn diễn giải với đánh giá.
2. Đọc chéo bốn tệp còn lại để tìm chỗ đề bài **giả định người đọc đã biết**: từ vựng
   Observation/Claim/Provenance/Proposal ở tài liệu phương pháp luận, qualify hai chiều và bốn
   loại tín hiệu ở playbook, trọng số và cơ chế ba vòng chấm ở barem và thể lệ.
3. Đối chiếu **từng cặp** nhóm tính năng có thể chạm nhau, thay vì đọc tuần tự: nhóm 2 với nhóm
   3, nhóm 3 với nhóm 5, nhóm 4 với nhóm 1, nhóm 4 với ranh giới `§5`. F1, F2, F7, F8 hiện ra từ
   bước này — đọc tuần tự thì không thấy, vì mỗi nhóm đọc riêng đều hợp lý.
4. Đọc `§6` ngược: với mỗi câu yêu cầu trong `§4`, hỏi "điểm nào trong T-1…T-10 kiểm nó?". Ra
   danh sách lỗ hổng phủ kiểm thử và F3, F5, F22.
5. Đóng vai bốn persona, mỗi vai một câu hỏi thật họ sẽ hỏi. Vai Sales chấm vòng 3 là vai đắt
   nhất, vì thể lệ cho end user chấm vòng cuối.
6. Với mỗi mơ hồ, buộc phải viết **một giả định làm việc** — không để câu hỏi treo. Đề bài phát
   ngày 07/8 và dữ liệu phát sáng 15/8; chờ BTC trả lời từng câu là không khả thi.

**Suy luận cho mấy phát hiện chính:**

- **F1** đến từ việc so hai câu: `§4/nhóm 3` "khi có phát hiện mới … sinh gợi ý … thêm một tin
  mới vào dòng thời gian" và `§4/nhóm 5` "nếu có nội dung mới thì rút phát hiện → tự thêm một mục
  vào dòng thời gian". Cùng một tác nhân kích hoạt, cùng một đích ghi, hai mức tự chủ khác nhau,
  và không có câu nào loại trừ nhau.
- **F3** đến từ việc thử hình dung cách làm `T-4` **pass mà không cần làm gì**: nếu công ty thử
  không bật Đang theo dõi thì vòng quét không chạm tới nó. Một kiểm thử pass được bằng cách không
  làm gì là kiểm thử không có giá trị.
- **F19** đến từ việc ghép "trừ khi có bản lưu mới" với "mỗi lần đọc lưu lại thành một bản lưu":
  nếu đọc lại luôn tạo bản lưu thì điều kiện miễn trừ luôn đúng, và quy tắc chống trùng tự vô
  hiệu.
- **F12** đến từ tài liệu phương pháp luận: hai số đo đi thành cặp — auto-accept rate đo hệ thống,
  error-detection rate đo người. Đối chiếu danh sách số đo ở `§4/nhóm 6` thì chỉ thấy nửa đầu.
- **F23** đến từ việc so trọng số barem (chấm theo giai đoạn dùng AI) với `§6`–`§7` (chấm theo
  sản phẩm) và cơ chế vòng 1 của thể lệ (chấm tự động qua log). Ba văn bản đo ba thứ khác nhau.

**Việc chưa làm, nói rõ để không ai hiểu nhầm:** chưa hỏi BTC bất kỳ câu nào trong mục 2 — toàn
bộ giả định trong tài liệu là của đội và cần được xác nhận. Chưa viết mã, chưa dựng thử, nên các
rủi ro về hạn mức mô hình ngôn ngữ và độ trễ vòng quét là suy luận từ đề bài, chưa đo. Chưa phỏng
vấn Sales thật; bốn persona ở mức 4 được dựng từ playbook và đề bài, không phải từ phỏng vấn.
