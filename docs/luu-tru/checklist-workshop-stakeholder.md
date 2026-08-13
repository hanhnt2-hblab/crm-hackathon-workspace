# Lưu trữ — kịch bản workshop với stakeholder

Ba mục này tách khỏi `CHECKLIST.md` ngày 2026-08-14. Lý do: kế hoạch hai giai đoạn không có buổi
workshop nào, đội là hai dev cộng một quản lý, và yêu cầu đã đóng băng ở `D1`–`D41` của
[Phản biện và phân tích yêu cầu](../Đề%20bài/Phản%20biện%20và%20phân%20tích%20yêu%20cầu.md).

Giữ lại vì chúng đúng về phương pháp và dùng được cho vòng sau, hoặc cho dự án CRM thật nếu sản
phẩm đi tiếp sau cuộc thi. **Không phải việc của hai ngày trước ngày thi.**

---

## B · Trước buổi làm việc với stakeholder

Cửa sổ gặp stakeholder không mở lại. Chuẩn bị trước để mỗi phút đổi lấy một quyết định.

- [ ] Đọc `~/.claude/skills/babok-business-analysis/workflow.md` — biết hỏi ai câu gì
- [ ] Bóc tài liệu sẵn có trước (Document Analysis `10.18`). **Đọc rẻ hơn hỏi.** Bắt đầu từ
      `docs/Đề bài/` — đề bài, rubric chấm và playbook do BTC phát — rồi mới tới CRM đối thủ,
      hợp đồng, chính sách, màn hình hệ thống cũ
- [ ] Chuẩn bị bảng state × transition để hỏi từng ô, thay vì hỏi mở

## C · Trong buổi làm việc — thứ tự do tài liệu quy định

`10.9.2` đòi từ vựng chuẩn trước → `10.39.3.2` đòi process model trước ma trận quyền.

- [ ] **Từ vựng trước tiên** (`10.11`): `Lead` / `Contact` / `Account` / `Opportunity` / `Deal`
      khác nhau chỗ nào — chốt trước khi vào schema
- [ ] **Process model as-is** (`10.35`): *"hiện tại đang bán thế nào"*
- [ ] **Process model to-be**: *"muốn thành thế nào"* — hỏi **tách** làm hai lần
- [ ] **State model** (`10.44`): stage nào sang được stage nào, điều kiện canh là gì.
      **Hỏi cả chiều ngược** — `10.44.3.2` nói vòng đời *"are not always linear"*: deal có tụt
      ngược stage không, deal đã đóng có mở lại được không
- [ ] **Business rules** (`10.9`) — **hai bước, đừng gộp**: phân loại *definitional*
      (`10.9.3.1`, không vi phạm được, chỉ áp dụng sai được) hay *behavioural* (`10.9.3.2`);
      rồi **chỉ behavioural** mới chọn một trong bốn mức thực thi
- [ ] **Roles matrix** (`10.39`) — hỏi **hai người, hai câu**: *"ai **được** thấy gì"* → Sponsor ·
      *"ai **cần** thấy gì"* → Domain SME
- [ ] **Delegation và Inheritance** (`10.39.3.4`) — yêu cầu **dữ liệu**, không phải UI
- [ ] **Thứ tự cắt scope** — xin Sponsor duyệt **trước**, không xin giữa lúc code
- [ ] **Số field và số click** để tạo 1 lead — hỏi trực tiếp người bán hàng

## D · Trong lúc chạy BMad — kiểm mỗi ngày

- [ ] **Công tắc người-thật**: có người trả lời được thì hỏi họ, **đừng** chạy `party-mode`
- [ ] **Tách luật khỏi luồng** — `10.35.4.2` và `10.9.2` cùng đòi. Sơ đồ chỉ vẽ *bước*;
      luật nằm ở bảng riêng
- [ ] Mỗi story có **acceptance criterion quan sát được**, viết **trước** khi code
- [ ] Mỗi NFR có **ngưỡng số**, không phải tính từ
- [ ] Cắt scope thì ghi vào bảng dưới, và kiểm cột cuối

```
NGÀY | CẮT GÌ | VÌ SAO | THAY BẰNG GÌ | ĐÃ DUYỆT TRƯỚC?
     |        |        |              |
```

- [ ] Không để xảy ra kiểu cắt scope tệ nhất: *vẫn nói là "có" nhưng bên trong hỏng*.
      Ví dụ kinh điển của CRM: hứa rep chỉ thấy deal của mình, để tạm ai cũng thấy hết, rồi quên

