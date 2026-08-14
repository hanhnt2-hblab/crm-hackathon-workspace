# Ba câu hỏi cho đồng đội Sales Manager

Gửi nguyên văn phần dưới. Ba câu đầu là cốt lõi, trả lời được trong hai phút; câu bốn chỉ hỏi
nếu anh ấy còn thời gian.

Vai được hỏi ở đây là **Domain SME** — chủ quy trình. Ba câu này hỏi đúng thứ đó. Câu về *số
field, số bước thao tác* thì phải hỏi **End User**, tức người trực tiếp dùng CRM hằng ngày; nếu
anh ấy không còn trực tiếp bán thì đừng hỏi anh ấy phần đó.

---

Em đang viết phần "hiện trạng" cho bài dự thi và có ba con số không tài liệu nào có. Anh trả
lời áng chừng thôi, không cần chính xác:

**1.** Một BD mất khoảng bao lâu mỗi ngày cho việc rà tin tức, LinkedIn và cập nhật hồ sơ công
ty? *(Playbook của BTC ghi 1–2 giờ mỗi sáng — con số đó có đúng với đội mình không, hay lệch?)*

**2.** Trong khoảng 10 cơ hội gần nhất bị mất, có mấy cái mất vì **biết tin muộn** — chứ không
phải vì giá, vì năng lực, hay vì khách đổi ý?

**3.** Hồ sơ một công ty cũ tới mức nào thì anh coi là **không dùng được nữa** cho một cuộc gặp?
Một tuần, một tháng, hay ba tháng?

**4.** *(nếu còn thời gian)* Có thông tin nào anh **không bao giờ** cho phép máy tự ghi vào hồ
sơ khách, dù nó có dẫn nguồn đầy đủ?

---

## Mỗi câu mua được cái gì

| Câu | Dùng vào mục nào của brief | Thiếu nó thì hỏng gì |
|---|---|---|
| 1 | Cái giá vận hành của hiện trạng | Không có gốc để so khi nói sản phẩm tiết kiệm được bao nhiêu |
| 2 | Cái giá kinh doanh — cơ hội mất vì muộn | Tiêu chí thành công không nối được với tiền |
| 3 | Ngưỡng độ tươi, thành một NFR có số | "Hồ sơ phải mới" là tính từ, không kiểm được |
| 4 | Ranh giới quyền ghi của AI, đối chiếu `D16` | `D16` hiện đứng trên suy luận thiết kế, chưa có ai trong nghề xác nhận |

## Câu trả lời — nhận 14/08/2026

- **1. Một BD mất 1–2 giờ mỗi ngày.** Khớp đúng con số playbook `§10` của BTC. Nghĩa là cái giá
  hiện trạng đứng trên **nguồn của chính ban tổ chức**, không phải con số đội tự khai — giám khảo
  khó cãi.
- **2. Ba tới bốn trên mười cơ hội mất là vì biết tin muộn.** Đây là con số `BUS-3` đã chờ. Sản
  phẩm nhắm đúng khoảng **một phần ba** lý do thua — đủ lớn để đáng làm, đủ nhỏ để không ai nghi
  là phóng đại.
- **3. Hồ sơ cũ quá một tháng thì không dùng được cho một cuộc gặp.** Khớp hai mốc đã có ở hệ
  thống thật: *khách nguội > 30 ngày* và cửa sổ chống trùng tín hiệu 30 ngày. Thành một ngưỡng đo
  được, không phải tính từ.
- **4. Hai thứ không bao giờ cho máy tự ghi:**
  - **Giá trị tiền của Opportunity** — đề bài đã cấm sẵn ở `§5.2`, và PRD chặn bằng `NFR-15`. Câu
    trả lời này xác nhận ranh giới đó **đúng nghiệp vụ**, không chỉ đúng luật
  - **Ghi chú và hồ sơ riêng của Sales** — ⚠ **PRD chưa có chỗ nào cấm điều này.** Máy được thêm
    mục mới vào Timeline, nhưng không dòng nào nói nó không được **sửa** mục do người tạo

## Ba câu này đã mở khoá gì

| Câu | Đi vào đâu |
|---|---|
| 1 | Brief mục *Hiện trạng* — cái giá vận hành, nay có số |
| 2 | PRD `BUS-3` — yêu cầu nghiệp vụ duy nhất chưa có số đo, nay có mốc |
| 3 | Một ngưỡng độ tươi hồ sơ, thành cờ cảnh báo trên màn hình Account |
| 4 | Ranh giới quyền ghi — một xác nhận, và **một lỗ hổng thật** |
