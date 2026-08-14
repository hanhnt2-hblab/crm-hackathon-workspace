---
title: "Phụ lục brief — Why Now"
status: ready
created: 2026-08-14
updated: 2026-08-14
---

# Phụ lục — chiều sâu tách khỏi brief

Phần này giữ những gì brief cần **kết luận** nhưng không cần **trình bày**: bảng số, ma trận
phương án, hình thái bài toán, và các ngưỡng đã có nguồn ở nơi khác. Bước PRD và bước Kiến trúc
đọc thẳng file này.

---

## 1. Hình thái bài toán

Phân loại theo khung phân tích nghiệp vụ BABOK v3. **Vòng đời bản ghi** làm nền — công ty và cơ
hội đi qua các trạng thái, dưới luật nghiệp vụ và quyền theo vai. Mượn **Nền tảng dữ liệu** cho
tầng đọc tin: bản lưu, truy nguồn, độ tươi, chống trùng.

Bộ kỹ thuật đi kèm hình thái nền: Process Modelling · State Modelling · Business Rules Analysis ·
Roles and Permissions Matrix · Data Modelling. Mượn thêm Data Dictionary và Data Flow Diagrams cho
tầng đọc tin.

Hai bổ ngữ đang áp lên bài toán:

| Bổ ngữ | Đổi cách làm thế nào |
|---|---|
| **Bị bó thời gian** | Suy giảm theo **rủi ro và mức độ đảo ngược được**, không theo lịch. Giữ thứ sửa sau rất đắt: ranh giới phạm vi, luật nghiệp vụ, ma trận quyền. Bỏ thứ bổ sung sau vẫn được: sơ đồ đầy đủ, persona chi tiết |
| **Đội nhỏ, gộp vai** | Mất mối kiểm giữa hai vai bị gộp. Đáng lo nhất là **BA kiêm Tester** — bộ nghiệm thu giả định người verify khác người định nghĩa yêu cầu. Đây chính là `F4`, đã ghi *"không giải được"* |

---

## 2. Hiện trạng — chi tiết

### 2.1. Một ngày của người Sales/BD

| Việc | Cách làm hôm nay |
|---|---|
| Rà tin tức và LinkedIn của các công ty đang theo dõi | **Thủ công, 1–2 giờ mỗi sáng** |
| Cập nhật hồ sơ khách khi có tin hoặc đổi chức danh | Gõ tay từng dòng |
| Xác định hôm nay phải làm gì | Tự lọc cơ hội có Việc tiếp theo đến hạn và cơ hội đang bị bỏ quên |
| Gặp, gọi, gửi email | Về ghi lại hoạt động |
| Kéo cơ hội sang giai đoạn mới, ghi lý do thua | Quyết định của con người |

Nguồn: Business Playbook `§10`.

### 2.2. Quy mô thật, để định cỡ

| Thông số | Hệ thống đang chạy | Lát cắt của đề bài |
|---|---|---|
| Công ty | ~1.200, tăng ~50/tháng | 12–15 |
| Người liên hệ | ~1.300 | ~30 |
| Cơ hội đang mở | ~200 | 8 |
| Hoạt động | ~50.000/năm — bảng lớn nhất | không nêu |
| Người dùng đồng thời | 8–15 | 1 Sales + 1 Quản trị |
| Vai | 7 (`bd`, `am`, `presales`, `manager`, `sales_admin`, `bod`, `admin`) | 2 |
| Nhịp quét tin | cron thứ Hai 06:00, chỉ công ty đang theo dõi | 60 giây, ghi rõ là để chấm demo |
| Loại tín hiệu | 11 giá trị | 6 giá trị |

Nguồn: mục 5.1 của bản phản biện, chắt từ `Tomahawk_CRM_PRD_BuildReady_v3.2.md` và
`HBLAB_Sales_Knowledge_Base_v1.0.md`.

**Đọc bảng này ra một kết luận:** đề bài không phải bản thu nhỏ trung thực của hệ thống thật — nó
là một lát cắt được chọn để chấm được trong một ngày. Mọi chỗ đề bài đơn giản hoá đều là chỗ vòng
3 sẽ chạm vào, vì người chấm vòng 3 là Sales thật.

---

## 3. Ma trận phương án — bản đầy đủ

| # | Phương án | Cắt được chi phí chú ý? | Vì sao không chọn |
|---|---|---|---|
| 1 | **Không làm gì** — giữ rà tay cộng Airtable | Không | Chi phí tăng tuyến tính theo số công ty, mà số công ty tăng ~50/tháng. Là phương án duy nhất có chi phí **tăng theo thời gian mà không có trần** |
| 2 | **Chỉ tự động thu thập** — mỗi sáng một bản tin tổng hợp | Không | Giảm việc *tìm*, không giảm việc *đọc*. Chú ý vẫn là nút thắt, chỉ dời từ trình duyệt sang hộp thư |
| 3 | **Máy đọc và chuẩn bị sẵn, người duyệt tất cả** | Không | Dạng nặng nhất của bẫy dời chi phí: toàn bộ sản lượng của máy thành tải duyệt của người. Càng đọc giỏi càng tạo nhiều việc |
| 4 | **Máy đọc, tự ghi trong vùng đủ chắc, đẩy lại người phần cần phán đoán** | **Có** | **Chọn** |

Ba phương án bị loại có cùng một lỗi và lỗi đó không hiện ra nếu chỉ nhìn tính năng: chúng đều
*dời* chi phí chú ý thay vì *cắt* nó. Phương án 3 nguy hiểm nhất vì nó trông giống phương án 4
nhất trên bản mô tả tính năng.

---

## 4. Chỉ tiêu chất lượng — chi tiết và nguồn

Điều kiện để chỉ tiêu chính có nghĩa. Không có nhóm này thì tự ghi nhiều chỉ là liều hơn.

| Chỉ tiêu | Ngưỡng | Nguồn |
|---|---|---|
| Ô do AI điền còn nguyên sau 7 ngày | > 80% | `D29` |
| Gợi ý được duyệt | > 85% | `D29` |
| `error-detection rate` — bị bác vì thông tin sai | đo và hiển thị cạnh `auto-accept rate` | `D30` |
| Duyệt mù — thời gian quyết | cảnh báo khi < 3 giây | `D29` |
| Duyệt mù — nhịp duyệt | cảnh báo khi > 5 gợi ý/phút | `D29` |

Cả năm dòng đã có sẵn trong Mục 0 của bản phản biện. Brief không định nghĩa lại chúng, chỉ dẫn
chiếu — Mục 0 là nguồn duy nhất của mọi con số.

---

## 5. Ghi chú về phân quyền

Hệ thống thật có 7 vai, bản dự thi rút còn 2. Sự rút gọn là **ràng buộc của cuộc thi**, không phải
kết luận nghiệp vụ.

Hệ quả cho bước Kiến trúc: phân quyền phải chặn ở **tầng nghiệp vụ**, không phân biệt lối vào và
không dựa vào việc ẩn menu — để thêm vai sau này không phải viết lại. Hệ thống thật đã trả giá cho
bài học này và ghi thẳng vào đặc tả của nó: *"view filter không phải là biên giới bảo mật"*. Xem
`D25` và `D28`.

---

## 6. Chỗ trống đã biết

| Trống gì | Chặn cái gì | Lấy ở đâu |
|---|---|---|
| ~~Cái giá của hiện trạng~~ | ~~không nối được với tiền~~ | ✅ **đã đóng 14/8** — 1–2 giờ/ngày · 3–4 trên 10 cơ hội thua vì muộn · độ tươi 1 tháng. Xem `cau-hoi-dong-doi.md` |
| Ngưỡng của chỉ tiêu chính (tạm ghi 40%) | Không biết sản phẩm đạt hay chưa đạt | Chỉ chốt được sau khi thấy bộ dữ liệu BTC phát ngày 15/8 |
| Lược đồ bộ dữ liệu BTC | Lớp ánh xạ khi nạp dữ liệu | `Q15` — câu chặn duy nhất còn lại, phải hỏi BTC |
