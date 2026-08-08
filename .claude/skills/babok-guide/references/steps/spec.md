# Bước `SPC` — Spec

Phase `anytime` · BMad mô tả: *"Locks the WHAT before the HOW"*

Toàn bộ luồng: [`../workflow.md`](../workflow.md)

## BMad khuyết gì ở bước này — nặng nhất trong cả quy trình

Đo trên bản cài v6.10.0, 234 file, ngày 2026-08-08:

| Khái niệm | File | |
|---|---|---|
| `roles and permissions matrix` | **0** | **absent** |
| `business rule` | 2 | **absent** |
| `state model` | 2 | **absent** |
| `acceptance criteria` | 23 | **covered — không can thiệp** |

Spec nói được *"cái gì"* nhưng không nói *"khi nào được phép"* và *"ai được phép"*.

## Ba artifact phải lấy từ stakeholder

| Kỹ thuật | Hỏi ai |
|---|---|
| **State Modelling `10.44`** | Domain SME |
| **Business Rules `10.9`** | Domain SME |
| **Roles Matrix `10.39`** | **Cả hai** — Sponsor và Domain SME, hai câu khác nhau |

## 1 · State Modelling `10.44`

Liệt kê trạng thái **và các chuyển tiếp ĐƯỢC PHÉP** kèm điều kiện canh — không chỉ liệt kê
danh sách trạng thái. Thiếu phần chuyển tiếp thì pipeline cho deal nhảy stage vô lý.

⚠ **Hỏi cả chiều quay lui.** `10.44.3.2` nói vòng đời *"are not always linear"*: deal có tụt
ngược stage không, deal đã đóng có mở lại được không. Đây là chỗ hay bị bỏ vì người ta chỉ nghĩ
theo chiều tiến.

## 2 · Business Rules `10.9` — **hai bước, đừng gộp**

`10.9.3` chia luật làm hai loại dùng **cơ chế hoàn toàn khác nhau**:

| Loại | Section | Đặc tính | Cài thế nào |
|---|---|---|---|
| **Definitional** | `10.9.3.1` | *"cannot be violated but they can be misapplied"* | Hàm dẫn xuất / phép tính. **Không có mức thực thi** |
| **Behavioural** | `10.9.3.2` | Luôn có thể bị vi phạm | Chốt chặn — chọn một trong bốn mức |

Ví dụ CRM: *"khách được coi là Ưu tiên nếu đặt hơn 10 đơn/tháng"* là **definitional** — hỏi nó
nên chặn cứng hay cho override là **câu hỏi vô nghĩa**. Còn *"không được chuyển sang giai đoạn
Báo giá khi chưa có người liên hệ"* là **behavioural**.

**Bốn mức, chỉ áp cho behavioural rule** (`10.9.3.2`, nguyên văn) — mức chọn quyết định luật
sống ở đâu trong hệ thống:

| Mức | Luật sống ở đâu | Kéo theo |
|---|---|---|
| *Allow no violations (strictly enforced)* | DB constraint / service layer | Không cần UI ngoại lệ |
| *Override by authorized actor* | Service layer + kiểm quyền | **Cần** bảng phân quyền + audit log |
| *Override with explanation* | Service layer + kiểm quyền | Thêm **field lý do bắt buộc** + lưu vết |
| *No active enforcement* | Chỉ cảnh báo UI | Không ràng buộc dữ liệu |

Chọn nhầm mức 1 thay vì mức 2 thì lúc cần duyệt ngoại lệ phải **sửa cả schema**.

**Phép thử luật đã đủ rõ chưa:** `10.9.2` định nghĩa business rule phải **practicable** —
*"needing no further interpretation for use by people in the business"*. Đọc xong mà vẫn phải
hỏi lại thì nó chưa phải business rule.

## 3 · Roles Matrix `10.39` — hỏi hai người, hai câu

| Câu hỏi | Hỏi ai | Vì sao |
|---|---|---|
| *"Ai **được** thấy gì"* | **Sponsor** `2.4.9` | Đây là quyền — sponsor *"control the budget and scope"* |
| *"Ai **cần** thấy gì"* | **Domain SME** `2.4.3` | Đây là công việc — họ biết ai cần dữ liệu nào |

Hỏi một người thì thiếu một nửa, và lỗi chỉ lộ lúc demo.

⚠ **Chức danh không phải role.** `10.39.3.1` nguyên văn: cùng job title có thể khác role, khác
job title có thể cùng role. Đừng lấy sơ đồ tổ chức làm ma trận quyền.

⚠ **Đừng bỏ sót `10.39.3.4 Refinements`** — **Delegation** (uỷ quyền tạm khi người có thẩm quyền
vắng mặt) và **Inheritance** (cấp trên thấy dữ liệu cấp dưới tới mấy tầng). Cả hai là **yêu cầu
dữ liệu**, không phải UI. Phát hiện muộn thì phải migrate schema.

## Giao lại cho BMad

Ba artifact này là **đầu vào trực tiếp** cho spec và cho `CA`. `10.39.3.2` nói ma trận quyền
tiêu thụ đầu ra của **functional decomposition** và **process modelling** — nên chạy sau hai cái đó.
