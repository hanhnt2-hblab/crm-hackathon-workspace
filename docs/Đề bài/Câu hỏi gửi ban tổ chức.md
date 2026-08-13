# Câu hỏi gửi ban tổ chức

Bốn câu còn lại sau khi đã tự trả lời 18/22 câu ở
[Phản biện và phân tích yêu cầu.md](Phản%20biện%20và%20phân%20tích%20yêu%20cầu.md): **Q15** lược đồ
dữ liệu · **Q12** quyền ghi đè · **Q22** mốc tính log · **Q10** bảng ánh xạ ngày hạn.

## Cách gửi

- **Một tin nhắn duy nhất, không hỏi lẻ bốn lần.** BTC đang chốt danh sách đội và chuẩn bị ngày
  thi; bốn tin nhắn rời sẽ nhận được ít câu trả lời hơn một tin gọn.
- **Hỏi ở kênh chung nếu được phép**, không hỏi riêng. Câu trả lời về lược đồ dữ liệu ảnh hưởng
  tới mọi đội; hỏi công khai thì BTC chỉ phải trả lời một lần và không ai bị lợi thế thông tin.
- **Mỗi câu kèm phương án mặc định của đội.** Đây là điểm quan trọng nhất: BTC chỉ cần gật hoặc
  sửa, không phải soạn câu trả lời. Và nếu không ai trả lời thì im lặng cũng là một câu trả lời —
  đội cứ chạy theo mặc định, không bị chặn.
- **Xếp câu chặn tiến độ lên đầu.** Chỉ Q15 là thứ có thể ăn mất hàng giờ trong ngày thi; ba câu
  còn lại chỉ đổi cách trình bày.
- **Không hỏi lại thứ tài liệu đã trả lời.** Bốn câu này đều đã kiểm là không có đáp án trong cả
  năm tệp BTC phát — nói rõ điều đó trong tin nhắn để câu hỏi không bị coi là chưa đọc kỹ đề.
- **Hạn nhận trả lời hữu ích: trưa 14/8.** Sau mốc đó thì chốt theo mặc định, vì còn phải kịp
  dựng và kiểm thử.

## Bản tin nhắn gửi được luôn

> Chào anh/chị BTC,
>
> Đội **[tên đội]** có 4 câu hỏi về đề bài "AI Native CRM". Bọn em đã đọc cả năm tài liệu và
> không tìm thấy đáp án cho bốn chỗ này. Câu nào anh/chị không kịp trả lời thì bọn em làm theo
> phương án mặc định ghi kèm và nói rõ trong phần trình bày.
>
> **1. Lược đồ bộ dữ liệu mẫu — câu bọn em cần nhất.**
> `§7.5` yêu cầu *"nạp được bộ dữ liệu của BTC bằng một lệnh — không gõ tay, không sửa mã"*, nhưng
> `§3` nói dữ liệu phát sáng 15/8. Nếu chỉ biết định dạng vào sáng ngày thi thì phần "không sửa
> mã" không thể đạt được — bọn em sẽ phải viết bộ nạp ngay trong giờ thi.
> Xin BTC cho **trước** một trong hai thứ, dữ liệu thật vẫn giữ kín tới 15/8:
> (a) danh sách tệp + tên cột + kiểu dữ liệu, hoặc (b) một bộ mẫu 2–3 bản ghi mỗi loại, dữ liệu
> giả cũng được.
> Kèm ba chi tiết nhỏ: bản chụp trang web là tệp dạng gì (HTML / Markdown / JSON, một tệp cho mỗi
> phiên bản?), cách ghép cặp "trước" – "sau", và nội dung có tiếng Nhật/Hàn hay chỉ Việt – Anh.
> *Mặc định nếu không có:* bọn em tự sinh dữ liệu theo đúng mô tả `§3` và tách một lớp ánh xạ
> mỏng, để sáng 15/8 chỉ phải sửa lớp đó.
>
> **2. Trong bộ dữ liệu, 8 cơ hội có sẵn "Việc tiếp theo" chưa — và đã quá hạn chưa?**
> Câu này ảnh hưởng trực tiếp tới `T-6`. Nhóm 4 chỉ tự đặt Việc tiếp theo khi ô đó trống hoặc do
> hệ thống đặt, nên nếu cả 8 cơ hội đều đã có giá trị do người nhập thì `T-6` không còn cơ hội nào
> để chạy.
> Liên quan: `§4/nhóm 4` **cho phép** đè lên Việc tiếp theo người nhập tay đã quá hạn. Bọn em dự
> định **không đè** — thay vào đó hiện một dòng đề xuất ngay dưới ô để người bấm — vì một câu
> người viết là thông tin, không phải chỗ trống. Xin BTC xác nhận làm chặt hơn đề bài như vậy
> **không bị trừ điểm** ở `T-6`.
> *Mặc định nếu không có:* làm không đè, và trong bộ kiểm thử tự tạo một cơ hội có ô trống để
> `T-6` chạy được.
>
> **3. Mốc bắt đầu tính log Claude Code.**
> Thể lệ cho phép phát triển từ 12/8, nhưng cũng ghi *"các đội làm trước thời điểm thu thập được
> log đều không được tính điểm"*. Xin BTC cho **mốc thời gian chính xác** mà log bắt đầu được
> tính, và cho biết phần việc 12–14/8 có được tính nếu log đã chảy về Grafana từ trước đó.
> Một câu vận hành nữa: nếu đường log về Grafana gián đoạn trong ngày thi thì có kênh dự phòng
> không (ví dụ nộp tệp log cuối ngày)?
> *Mặc định nếu không có:* bọn em coi như chỉ log trong ngày 15/8 được tính, và xếp lịch để mọi
> việc sinh log quan trọng diễn ra trong ngày thi.
>
> **4. Ngày hạn của Việc tiếp theo.**
> `§4/nhóm 4` đòi *"ngày hạn phản ánh độ gấp của loại tín hiệu, không phải một con số cố định"*
> nhưng không có bảng ánh xạ, còn `T-6` chỉ kiểm là ngày hạn có đổi. BTC có bảng số kỳ vọng sẵn
> không, hay đội tự quy định miễn giải thích được?
> *Mặc định nếu không có:* bọn em dùng bảng sau, đo theo ngày làm việc và tính từ ngày sự kiện —
> gọi vốn **1** ngày · nhân sự cấp cao **3** · mảng kinh doanh mới **5** · tuyển dụng **7** · mở
> rộng **7** · khác **14**; mức chắc chắn thấp hơn thì nới ra, mức "Đoán" không tự đặt. Bảng này
> cấu hình được ở màn hình Quản trị và có câu giải thích kèm mỗi dòng.
>
> Cảm ơn anh/chị. Nếu câu **1** và **3** có trước trưa 14/8 thì giúp bọn em rất nhiều.
>
> **[Tên người gửi]** — đội **[tên đội]**

## Theo dõi trả lời

Điền vào đây khi có phản hồi, rồi cập nhật lại chỗ tương ứng trong
[Phản biện và phân tích yêu cầu.md](Phản%20biện%20và%20phân%20tích%20yêu%20cầu.md).

| Câu | Mã trong tài liệu phản biện | Ngày hỏi | Trả lời của BTC | Phải sửa ở đâu nếu câu trả lời khác mặc định |
|---|---|---|---|---|
| 1 · Lược đồ dữ liệu | Q15, F20 | | | Lớp ánh xạ của bộ nạp dữ liệu · story E7-S7 |
| 2 · Ghi đè và dữ liệu cơ hội | Q12, F8 | | | Story E4-S1 · bộ kiểm thử `T-6` |
| 3 · Mốc tính log | Q22, F24 | | | Lịch làm việc hai ngày còn lại · story E7-S8 |
| 4 · Ngày hạn | Q10 | | | Dòng Q10 mục 2 (bảng quy tắc chốt) · mục 5.3 |

Nếu tới trưa 14/8 vẫn trắng thì ghi "không có phản hồi" vào ô trả lời — đó là bằng chứng cho phần
trình bày khi giám khảo hỏi vì sao đội chọn phương án đó.
