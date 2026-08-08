# Bước `CA` — Architecture

★ Bắt buộc · phase `3-solutioning`

Toàn bộ luồng: [`../workflow.md`](../workflow.md)

## BMad khuyết gì ở bước này

Đo trên bản cài v6.10.0, 234 file, ngày 2026-08-08:

| Khái niệm | File | |
|---|---|---|
| `sequence diagram` | **0** | **absent** |
| artifact ERD | 1 | **cố ý tối giản** — xem dưới |
| `data model` (khái niệm) | 11 | covered |

**Sắc thái phải hiểu đúng:** `bmad-architecture/assets/spine-template.md` ghi *"core-entity ERD
(names + relationships only; an attribute that's itself an invariant is an AD, not a diagram)"*.
Loại thuộc tính khỏi sơ đồ là **chủ ý thiết kế của BMad**, không phải thiếu sót. Nên `10.15`
dùng khi cần **hơn mức spine** — cardinality, thuộc tính, ba tầng — chứ không phải để "sửa lỗi".

## Bốn artifact tự làm

| Kỹ thuật | Lưu ý |
|---|---|
| **Data Modelling `10.15`** | Ba tầng conceptual → logical → physical. `10.15.2` gán physical cho **Implementation SME** `2.4.5`, conceptual thuộc phía nghiệp vụ. Đừng nhảy thẳng vào physical |
| **Data Dictionary `10.12`** | Rút **từ** ERD, không làm song song (`10.12.2`: *"may be extracted from a data model"*). Cột `Values/Meanings` phải khớp enum của state model |
| **Interface Analysis `10.24`** | Mỗi interface đủ **5 thuộc tính** `10.24.3.3`: name · coverage/span · exchange method · message format · exchange frequency |
| **Sequence Diagrams `10.42`** | **Chỉ 3 kịch bản** với CRM: chuyển stage kèm duyệt, import dữ liệu, tích hợp ngoài. `10.42.4.2` cảnh báo vẽ đủ bộ cho mọi use case là lãng phí |

`10.42.2` nói rõ sequence diagram cho thấy đối tượng *"interact, but **not how they are related to
one another**"* — quan hệ tĩnh là việc của data model. Hai thứ bù nhau, không thay nhau.

## Bốn góc nhìn mô hình hoá — trực giao

| Kỹ thuật | Trả lời câu hỏi gì |
|---|---|
| `10.35` Process | Mọi entity trong **một** quy trình |
| `10.44` State | **Một** entity xuyên qua **mọi** quy trình |
| `10.15` Data | Cấu trúc và **quan hệ** tĩnh |
| `10.42` Sequence | Tương tác theo **thời gian** trong một kịch bản |

Thiếu góc nào thì mất đúng câu hỏi đó.

## ⚠ Tách luật khỏi luồng

`10.35.4.2` và `10.9.2` **cùng** đòi điều này. `10.35.4.2` nguyên văn: process model *"can become
extremely complex and unwieldy... especially true if business rules and decisions are not managed
separately from the process"*.

Trong code cũng vậy: đừng nhét điều kiện nghiệp vụ vào giữa luồng xử lý.

## Cửa kiểm trước khi sang `CE`

- [ ] Mọi tên trong ERD tra được về bảng thuật ngữ
- [ ] Transition guard nằm **dưới** tầng UI, có test cho ô bị cấm
- [ ] Mỗi business rule có đúng một nơi thực thi, đúng loại và đúng mức đã chọn
- [ ] Delegation và Inheritance (`10.39.3.4`) đã có chỗ trong schema, hoặc **đã ghi rõ là không làm**
- [ ] Mỗi ô trống trong roles matrix có test chặn ở **tầng API**, không phải ẩn nút
- [ ] Luật không nằm lẫn trong luồng xử lý
- [ ] Mỗi interface đủ 5 thuộc tính
- [ ] Mỗi NFR có ngưỡng số và cách đo

Cửa kiểm này **thay cho review giữa hai người**. `2.4.11` định nghĩa Tester kiểm yêu cầu
*"defined by the business analyst"* — BABOK giả định hai người; gộp vai thì phép kiểm độc lập
biến mất, phải thay bằng thứ tick được.
