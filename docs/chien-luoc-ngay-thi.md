# Chiến lược — hackathon CRM

Đội hai dev cộng một Sales Manager. Thi ngày **15/08/2026**, quỹ giờ được chấm 9:30–12:00 và
13:00–15:00.

Tài liệu này nói **thứ tự làm và vì sao**. Không chốt lại chi tiết kỹ thuật nào — những thứ đó ở
Mục 0 của [Phản biện và phân tích yêu cầu](Đề%20bài/Phản%20biện%20và%20phân%20tích%20yêu%20cầu.md)
dưới dạng `D1`–`D41`. Hai bên nói khác nhau thì Mục 0 đúng.

---

## 1. Ba vòng, và thứ nào là cổng thứ nào là điểm

| Vòng | Ai chấm | Chấm cái gì | Là cổng? | Tính điểm? |
|---|---|---|---|---|
| **1** · 15:00–15:30 | Hệ thống AI, tự động | Log Claude Code **ngày 15/8** đối chiếu checklist 5 cột | **Có** — không log là loại | Có |
| **2** · 15:40–17:10 | BGK + AI, top 5 | 10 phút trình bày + 5 phút Q&A **bốc ngẫu nhiên từ log** | Có — chỉ top 5 đi tiếp | Có |
| **3** · 17:10– , top 3 | **Đội Sales**, góc end-user | Tính năng, checklist riêng công bố sau | Không | Có — nhưng **có thể bị hoãn** |

Phân biệt phải giữ cho rõ, vì lẫn nó là sai lầm đắt:

- **Có log** là **cổng**. Thể lệ: *"không có log bằng không có điểm và không qua được vòng 1"*.
- **Bậc trong log** là **điểm**. Checklist chấm bốn mức cho từng cột. Một phiên chạy 45 phút chứng
  minh được Mức 1–2, không phải Mức 4. Mức 4 của Requirement Analysis là *"đóng vai persona phản
  biện, tự phát hiện edge case, có prompt log lý giải"* — đó là **cách làm**, không phải **số phiên**.

Thể lệ ghi vòng 3 *"có thể công bố kết quả sau"*. Nghĩa là **vòng 2 có thể là phán xét cuối cùng của
người thật trước lúc trao giải**. Đội quyết định vẫn đầu tư mạnh cho vòng 3 — xem mục 3 — nhưng
không được để vòng 2 thiếu chuẩn bị vì nó chắc chắn xảy ra.

---

## 2. Hai giai đoạn

Đây là quyết định cấu trúc quan trọng nhất, và nó tách hai mục tiêu vốn hay bị trộn.

| | **Giai đoạn 1** — từ giờ tới hết 14/8 | **Giai đoạn 2** — ngày 15/8 |
|---|---|---|
| Làm gì | **Hoàn thiện sản phẩm** theo `§4` sáu nhóm và `§6` `T-1`…`T-10` | **Chỉ làm tính năng BTC phát thêm** |
| Phục vụ | **Vòng 2 và vòng 3** — sản phẩm để trình bày và để Sales chấm | **Vòng 1** — chạy lại trọn luồng để sinh log |
| Được chấm log không | **Không.** Log trước 15/8 không tính | **Có.** Chỉ log trong ngày này được tính |

Tách như vậy giải quyết đúng mâu thuẫn ở `F23`: sản phẩm và log là hai đầu ra khác nhau, chấm bởi
hai thước đo khác nhau, và **cố làm cả hai trong 4,5 tiếng ngày thi là cách chắc chắn hỏng cả hai**.

Đổi lại, giai đoạn 1 chịu toàn bộ áp lực. Đây là lựa chọn có ý thức: nó đưa rủi ro về phía có thể
kiểm soát được (hôm nay và mai) thay vì phía không kiểm soát được (một tính năng chưa ai biết).

### Rủi ro riêng của cách chia này

Cả năm vệt log vòng 1 giờ đến từ **một** tính năng. Hai chiều hỏng, và cả hai đều xử được nếu nói
trước:

- **Tính năng quá nhỏ** → vệt log mỏng, chỉ đạt Mức 1–2. Xử: chạy đủ năm bước **bất kể nó nhỏ cỡ
  nào**, và đào sâu đúng chỗ Mức 4 đòi — phản biện theo persona, liệt kê edge case, ghi lý do loại
  phương án. Việc này rẻ và không phụ thuộc kích thước tính năng.
- **Tính năng quá to** → không kịp trọn luồng. Xử: **cắt phạm vi tính năng, không cắt bước**. Làm
  phần lõi chạy được, ghi rõ phần đã cắt và vì sao — vòng 2 hỏi thì trả lời được.

Đường dự phòng cho hai cột nặng nhất: **Requirement Analysis và System Design không bắt buộc phải
bám vào tính năng mới.** Dữ liệu thật của BTC cũng phát sáng 15/8, nên phân tích lại phạm vi cũ trên
lược đồ thật và dẫn xuất lại kiến trúc đều là việc thật, đều sinh log hợp lệ theo `D39`. Đừng treo
40 điểm vào một thứ chưa ai biết.

---

## 3. Giai đoạn 1 — làm ngay, ưu tiên theo thứ tự này

Đội đã chọn **đầu tư mạnh vào UX và thị trường JP**. Điều đó đổi thứ tự: UX không còn là việc "nếu
còn thời gian" ở mục 5.6 tài liệu phản biện, nó lên nhóm đầu.

Căn cứ: **5 trên 6 giám khảo vòng 3 thuộc thị trường JP**, và BTC **chủ động mời liên hệ trước** để
hỏi kỳ vọng và tư vấn UI/UX. Đây là lợi thế không đội nào sao chép kịp, vì đồng đội của đội đang
**quản lý trực tiếp** sáu người đó.

| # | Việc | Vì sao ở đây |
|---|---|---|
| 1 | **Log Claude Code → Grafana chạy thật**, kiểm bằng một lần chạy và nhìn bảng | `D37`. Hỏng cái này là mất cả vòng 1, không cứu được. Làm trước mọi thứ |
| 2 | **Chốt stack cho `src/`** | Chặn ba cột Dev/Testing/Deployment và bốn dòng lệnh trong `hackathon-deploy` |
| 3 | **Gửi bộ câu hỏi cho sáu giám khảo vòng 3** | Đã soạn sẵn. Câu `B3` đóng `Q10` bằng số lấy từ chính người chấm. Gửi càng sớm càng có thời gian áp vào sản phẩm |
| 4 | Sáu nhóm `§4` tới đúng mức `T-1`…`T-10` quan sát được | `T` là cổng nộp bài |
| 5 | **UX theo phản hồi ở việc 3**, ưu tiên chỗ Sales nói ra | Vòng 3, và là chỗ đội quyết định dồn sức |
| 6 | Bốn lệnh một-bước: khởi động · nạp dữ liệu · kiểm thử · dừng | `§7.3` và `§7.5` là cổng nộp bài |

Danh sách này từng có việc thứ bảy — tập một vòng đầy đủ để lấy mốc đo. **Đội đã quyết bỏ**; lý do
và cái giá ghi ở mục 8.

---

## 4. Giai đoạn 2 — lịch ngày thi

Tải ngày thi giờ nhẹ hơn nhiều: **một tính năng, năm bước**. Nhờ vậy lịch có chỗ trống thật, không
phải trống trên giấy.

| Giờ | Dev A | Dev B | Sales |
|---|---|---|---|
| 9:00–9:30 | Khai mạc | | |
| **9:30–9:45** | **Kiểm log Grafana chảy thật — cả hai, trước mọi việc khác** | | |
| 9:45–10:15 | Nạp dữ liệu thật, sửa lớp ánh xạ (`D32`) | **Phân tích tính năng mới** → cột RA | Đọc tính năng mới, dùng thử sản phẩm |
| 10:15–11:00 | Chạy `T-1`…`T-10` trên dữ liệu thật | **Thiết kế, ghi phương án bị loại** → cột SD | tiếp |
| 11:00–12:00 | **Cài đặt tính năng mới** → cột Dev | Review, ghi lý do từng quyết định | |
| 12:00–13:00 | Nghỉ trưa | | |
| 13:00–13:40 | **Sinh e2e test** → cột Testing | Sửa nốt | |
| 13:40–14:15 | **Dựng lại bản production** → cột Deployment | Đối soát `§7` | |
| 14:15–14:30 | Chạy trọn bộ trên **bản clone sạch** | Ráp bài trình bày | |
| **14:30** | **NỘP BẢN AN TOÀN — cả hai hạng mục** | | **Sales gọi vào, nhận bài** |
| 14:30–14:50 | Đệm: cải thiện được thì làm, **nộp lại** | | |
| 14:50–15:00 | Chốt bản cuối | | |
| 15:00–15:30 | Diễn tập vòng 2 trong lúc chờ kết quả | | Tập nói |

Bốn thay đổi so với bản đầu, mỗi cái sửa một lỗi đã tìm ra:

- **Nộp lúc 14:30, không phải 14:50.** Đây vừa là mốc nộp vừa là cơ chế cưỡng chế — xem mục 5.
  Nộp rồi thì 20 phút sau là phần thêm vào cái đã an toàn, và nộp lại được nếu cải thiện kịp.
- **Có 15 phút đệm được đặt tên** (14:30–14:50). Bản đầu slack đúng bằng **0** ở cả hai buổi —
  một cú trượt là đổ hết.
- **Có bài trình bày.** Thể lệ đòi **hai** hạng mục nộp: mã nguồn **và** tài liệu trình bày & demo.
  Bản đầu quên hẳn hạng mục thứ hai.
- **Có diễn tập vòng 2** trong 30 phút chờ kết quả vòng 1.

### Bài trình bày là sản phẩm phụ, không phải một việc

Đừng để nó thành task riêng lúc 14:30. Mỗi khối trong lịch kết thúc bằng **một dòng: quyết gì, vì
sao**. Ba thứ này bổ trợ nhau, viết một lần dùng cả ba:

- nội dung bài trình bày vòng 2,
- câu trả lời cho Q&A bốc ngẫu nhiên từ log,
- quy tắc `D40` — đầu ra AI nào giữ lại cũng phải nói được lý do trong một câu.

Tách chúng ra làm ba việc là làm ngược: gộp việc bổ trợ, tách việc thay thế.

### Phân vai vòng 2

Đội chọn **Sales trình bày, dev đỡ phần Q&A**. Thể lệ chỉ nói rõ *"mỗi đội cử 01 thành viên đại diện
trình bày"* — **chưa nói ai được trả lời Q&A**. Phải hỏi BTC trước, vì nếu không được thì phải đổi
người nói và tập lại từ đầu. Câu này đã thêm vào
[Câu hỏi gửi ban tổ chức](Đề%20bài/Câu%20hỏi%20gửi%20ban%20tổ%20chức.md).

---

## 5. Không có ai cưỡng chế điểm dừng — nên dùng cơ chế khác

Đồng đội Sales không ở đó cả ngày, nên không thể giao đồng hồ cho anh. Mà điểm dừng do chính người
đang muốn code tiếp tự quyết thì **không phải điểm dừng, chỉ là lời khuyên** — người cầm quyền phạt
phải có lợi ích độc lập trong việc thi hành, và ở đây không ai có.

Ba cơ chế thay thế, không cần người thứ ba:

1. **Nộp sớm, nộp lại sau.** Nộp bản chạy được lúc **14:30** thay vì 15:00. Đã nộp rồi thì nửa
   tiếng cuối không còn là "code thêm chút nữa", nó là phần thêm vào cái đã an toàn. Đây là cách
   tự chặt cầu rút lui rẻ nhất.
2. **Hẹn ngoài với người ngoài.** Hẹn Sales gọi vào lúc **14:30** để nhận bài trình bày và tập nói.
   Cuộc hẹn với người khác cưỡng chế được, còn báo thức thì tắt là xong.
3. **Quy tắc hai người.** Ai cũng có quyền hô dừng, và **hô là dừng, không tranh luận**. Yếu hơn
   hai cái trên vì cả hai đều là người đang muốn code, nhưng vẫn hơn không có gì.

Dùng cả 1 và 2. Chúng bổ trợ nhau và đều không cần ai có mặt cả ngày.

---

## 6. Cắt gì khi hết giờ

**Không cắt theo nhóm tính năng.** `T-1`…`T-10` phủ kín cả sáu nhóm — bỏ nhóm nào cũng rụng một `T`,
mà `T` là cổng chứ không phải điểm. Chỉ được **hạ độ sâu trong từng nhóm xuống đúng mức `T` quan sát
được**.

Thứ tự bỏ, rẻ trước:

1. Việc "nếu còn thời gian" ở mục 5.6 tài liệu phản biện.
2. Bậc 4 cột Deployment (cảnh báo AIOps) — giữ bậc 1–3, vẫn được 75% của 15 điểm.
3. Độ hoàn thiện giao diện của **tính năng mới** — nhưng **không** cắt UX của sản phẩm chính, đó là
   chỗ đội đã quyết dồn sức cho vòng 3.
4. Phạm vi tính năng mới — làm phần lõi, ghi rõ phần đã cắt.

**Không bao giờ cắt:** năm vệt log · năm điều kiện `§7.3` · lệnh nạp dữ liệu `§7.5` · **bài trình
bày**.

Kiểu cắt tệ nhất, `CHECKLIST.md` đã cảnh báo: vẫn nói là "có" nhưng bên trong hỏng. Cắt thì ghi vào
bảng và nói ra khi trình bày.

---

## 7. Ba cái bẫy

Mỗi bẫy đã được lập luận ở mục ghi kèm; đây là bản nhắc để đọc nhanh trong ngày thi.

- **Tối ưu khối lượng log** → mục 1 và `D40`. Bề mặt mã tối đa bằng bề mặt hai người đọc kịp.
- **Tưởng chuẩn bị nhiều là thắng** → mục 2. Thứ dễ sao chép sẽ bị san bằng; ba thứ không sao chép
  kịp là sổ `D1`–`D41`, `hackathon-deploy` có lịch sử commit, và đồng đội đang quản lý giám khảo
  vòng 3.
- **Đặt phạm vi theo mong muốn** → mục 6. Đội đặt phạm vi tham vọng nhất là đội ước lượng sai nhiều
  nhất.

## 8. Một điều đội đã quyết bỏ

Bản review đề xuất **tập một vòng đầy đủ trước ngày thi** để có mốc đo — biết một vòng RA → thiết kế
→ mã → kiểm thử → triển khai mất bao lâu. **Đội quyết không làm**, dồn giờ ngày 14/8 cho việc hoàn
thiện sản phẩm, vì sản phẩm phục vụ vòng 2 và vòng 3.

Ghi lại để không ai đề xuất lại, và để rõ cái giá: **ngày thi sẽ không biết mình đang nhanh hay chậm
so với chính mình.** Hệ quả thực dụng — bám sát ba điểm dừng ở mục 4 chặt hơn bình thường, vì không
còn số liệu nào để hiệu chỉnh giữa chừng.
