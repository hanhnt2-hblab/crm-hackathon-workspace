---
title: "Kiểm chứng loạt sửa PRD — Why Now"
target: prd.md
sources: [review-rubric.md, review-traceability.md, review-doc-standards.md]
created: 2026-08-14
status: verify
---

# Kiểm chứng loạt sửa — PRD *Why Now*

**Đối tượng.** `prd.md` hiện tại: **845 dòng · 50 FR (`FR-1`…`FR-50`) · 11 `BR-D` · 6 `BR-B` ·
13 `NFR` · 4 `TR` · 5 `SM` · 4 `SM-C` · 3 `UJ` · 5 `A`.**

**Cách kiểm.** Duyệt từng phát hiện của ba bản phản biện, tìm bằng chứng trong `prd.md` hiện tại,
rồi chạy thêm bốn phép kiểm hồi quy trên chính loạt sửa. Không phát hiện nào được xếp `ĐÃ SỬA`
nếu không trích được cụm chữ mới trong tài liệu.

---

## 0. Bốn con số

| Nhóm | Số lượng |
|---|---|
| **ĐÃ SỬA** | **27** |
| **SỬA HỤT** | **11** |
| **CHƯA SỬA** | **32** |
| **CỐ Ý KHÔNG SỬA** | **2** |
| **Tổng phát hiện riêng biệt** | **72** |

Phân theo nguồn (73 phát hiện thô, trừ 1 trùng — `review-rubric` chiều 6 §5.x ≡ `review-doc-standards`
*Ghi chú ngoài ba phép* — còn 72):

| Nguồn | Phát hiện | ĐÃ SỬA | SỬA HỤT | CHƯA SỬA | CỐ Ý |
|---|---|---|---|---|---|
| `review-rubric.md` | 20 | 5 | 2 | 13 | 0 |
| `review-traceability.md` | 23 | 17 | 2 | 2 | 2 |
| `review-doc-standards.md` | 30 (1 trùng) | 5 | 7 | 17 | 0 |

**Đọc một dòng.** Loạt sửa xử **gần trọn** bản truy vết (17/23 sạch) — tức phần đối chiếu đề bài
và Mục 0 đã lành. Nhưng nó **gần như không chạm** vào bản chuẩn tài liệu ở tầng phân loại
(`Phép 1` còn 10/17 nguyên) và vào chiều *done-ness* của bản rubric (4/5 phát hiện "người viết mã
sẽ tự phát minh ra luật" còn nguyên). Hai mục mới lớn nhất — §3.2 và §4.3 — đều **mở đúng ô mà bản
phản biện đòi nhưng đổ vào chưa đủ**, và §4.3 còn tự đẻ ra ba mâu thuẫn mới.

---

## 1. `review-rubric.md` — 20 phát hiện

| # | Phát hiện | Kết luận | Bằng chứng / thiếu gì |
|---|---|---|---|
| R1 | **critical** · Không xếp hạng ưu tiên 47 FR | **ĐÃ SỬA** | §8 có bảng tiêu chí ba nhãn + cột *Số FR* (**31**/**18**/**1**), và mỗi FR mang đúng một nhãn ngay sau tên. §8: *"Đây là **thứ tự cắt** cho ngày thi… Tiêu chí ở trên khách quan, tra được trong ba mươi giây."* |
| R2 | **medium** · `NFR-2`/`NFR-3` không có đường xử lý khi vi phạm | **CHƯA SỬA** | `NFR-2` vẫn chỉ có *"≤ 20 lệnh · Đếm và ghi vào Nhật ký vòng quét"*; `NFR-3` vẫn *"cảnh báo ở 80%"*. Chạm trần thì bỏ vòng, huỷ vòng hay chạy vượt — vẫn không nói. |
| R3 | **high** · `SM-1` ghi *"Nghiệm FR-27, FR-18"* | **ĐÃ SỬA** | §13.1: *"Nghiệm `FR-27`, `FR-36`"*, cộng gạch *"**Không** tính Gợi ý được duyệt: gợi ý **có** người quyết"*. |
| R4 | **high** · Tử số `SM-1` không định nghĩa được | **SỬA HỤT** | Công thức đã tường minh (*"Tử số… đi qua `FR-27` **hoặc** `FR-36`"* · *"Mẫu số: **tổng** Phát hiện sinh ra trong kỳ"*). **Nhưng** đối trọng mà bản rubric đòi — *tỉ lệ Công ty mang nhãn Đang theo dõi* — **không có** trong §13.3. Vector gian lận "bật Đang theo dõi cho toàn bộ Công ty để đẩy chạm 3" vẫn không số đo nào bắt. |
| R5 | **high** · `auto-accept rate` chưa bao giờ được định nghĩa | **CHƯA SỬA** | Cụm còn nguyên ở ba chỗ (`FR-42`, `SM-4`, `SM-C1`) và **không** có trong §3.1 lẫn §3.2. `SM-C1` vẫn ghi *"Đối trọng **SM-3**"* trong khi `SM-3` là *"Tỉ lệ Gợi ý được duyệt"* — cấu trúc đối trọng vẫn có thể rỗng. |
| R6 | **high** · Công thức xếp Hàng đợi không phải công thức | **ĐÃ SỬA** | `FR-18`: *"khoá xếp là bộ ba **(Độ liên quan, Mức chắc chắn, Công ty có Cơ hội đang chạy hay không)**, so lần lượt theo thứ tự đó — **không** phải một phép nhân số học."* |
| R7 | **high** · *"Nội dung mới"* không có luật so sánh | **CHƯA SỬA** | `FR-11` vẫn *"Chỉ tạo Bản lưu mới khi nội dung **khác** bản gần nhất (`D18`)"*, `FR-36` vẫn *"có nội dung mới"*. §4.3 chép lại nguyên câu đó mà không thêm luật. Không có hash, không có danh sách trường loại trừ. Rủi ro `T-8` (dấu thời gian trong bản chụp làm mọi vòng đều "mới") còn nguyên. |
| R8 | **medium** · Hoàn tác gặp ô đã bị người sửa tay | **CHƯA SỬA** | `FR-32` vẫn ba gạch cũ (cửa sổ 7 ngày · lùi một bước · tham số dùng chung). Không có gạch "nút Hoàn tác biến mất khi ô bị người sửa tay". |
| R9 | **medium** · Phanh không nói gì về Gợi ý đang chờ | **CHƯA SỬA** | `FR-45` nguyên văn cũ, bốn thứ dừng lại + *"Dữ liệu đã sinh không bị xoá"*. Không dòng nào nói Hàng đợi còn bấm được hay không. |
| R10 | **low** · Chu kỳ quét không nói đo từ đâu | **CHƯA SỬA** | `NFR-1` đã được viết lại (bỏ trần thời lượng), nhưng *đầu-đến-đầu* hay *cuối-đến-đầu* vẫn không nói. Chuỗi `cuối-đến-đầu` không xuất hiện trong tài liệu. |
| R11 | **medium** · `A1`–`A5` không có dấu vết tại chỗ | **CHƯA SỬA** | Chuỗi `[ASSUMPTION]` không xuất hiện. `A1`…`A5` chỉ nằm trong bảng §15; §5.1, §5.2, §5.3, §6 không mang nhãn nội tuyến nào. |
| R12 | **medium** · Không có `[NON-GOAL for MVP]` tại chỗ | **CHƯA SỬA** | Chuỗi `NON-GOAL` không xuất hiện. `FR-20` không nói gì về duyệt hàng loạt; `FR-41` không nói gì về xuất báo cáo. |
| R13 | **high** · `§5.x` vừa trỏ PRD vừa trỏ đề bài; `§5.4` không tồn tại | **CHƯA SỬA** | Không có tiền tố `ĐB §` ở bất kỳ đâu. §6 vẫn ghi `❌ §5.4` (dòng 277) — mục không tồn tại trong PRD; vẫn `§5.2` cho *Đóng Cơ hội*, `§5.3` cho *Gọi ra dịch vụ ngoài*, `§5.3` ở §2.2. Xem thêm phép kiểm 2. |
| R14 | **high** · *"đang mở"* mang hai nghĩa | **SỬA HỤT** | §3.1 đã tách hai từ (*Đang mở* 5 giai đoạn · *Đang chạy* 4 giai đoạn) và §5.1 đã dùng *đang chạy* xuyên suốt. **Còn ba chỗ dùng nghĩa cũ** — xem phép kiểm 4. |
| R15 | **high** · §6 tự đếm sai *"ba dòng in đậm"* | **ĐÃ SỬA** | §6: *"**Bốn dòng in đậm** là toàn bộ khác biệt thật"*; `A4`: *"**bốn** hành động in đậm ở §6"*. |
| R16 | **medium** · Enum Giai đoạn 7 giá trị không liệt kê | **ĐÃ SỬA** | §3.1 liệt kê đủ bảy mã + nhãn: *"`tiep_can` Tiếp cận · `du_dieu_kien` Đủ điều kiện · `soan_de_xuat` Soạn đề xuất · `thuong_luong` Thương lượng · `thang` Thắng · `thua` Thua · `tam_dung` Tạm dừng"*, và dòng *Đang chạy* đánh dấu rõ bốn giá trị đầu. |
| R17 | **medium** · Ba chỗ chạm §4 không loại trừ nhau | **CHƯA SỬA** | Sơ đồ §4.2 vẫn dùng nhãn `còn lại` cho nhánh Hàng đợi (dòng 181). Không có câu *"ba chạm đánh giá độc lập, một Phát hiện có thể kích hoạt nhiều chạm"*. Đoạn dưới sơ đồ vẫn chỉ giải thích cặp chạm 2 / chạm 3. |
| R18 | **low** · §8.5 không nối vào UJ nào | **CHƯA SỬA** | *Mô tả* của §8.5 kết bằng *"…mà không phải đọc từng mục nó thêm."* — không có dòng *"Thực hiện UJ-n"*. Năm nhóm kia đều có. |
| R19 | **low** · UJ-3 không có nhân vật được đặt tên | **CHƯA SỬA** | Vẫn *"**UJ-3.** Quản trị phát hiện duyệt mù."* |
| M1 | *Mechanical* · *Hàng đợi gợi ý* bị rút thành *Hàng đợi* | **CHƯA SỬA** | Cụm đầy đủ chỉ còn 2 lần (§3.1, sơ đồ §4.2); `FR-18`, `FR-20`, `FR-25`, §6, §10.2 vẫn dùng dạng rút. Vi phạm chính luật của §3.1. |

---

## 2. `review-traceability.md` — 23 phát hiện

### 2.1 Phủ yêu cầu (6)

| # | Phát hiện | Kết luận | Bằng chứng |
|---|---|---|---|
| TC1 | `§4/nhóm 1` gạch 1.9b — **bảng thống kê lý do thua** không FR nào định nghĩa | **ĐÃ SỬA** | `FR-48 · Bảng thống kê lý do thua` — *"Đếm Cơ hội `thua` theo từng giá trị `lyDoThua`, trên màn hình tổng quan"*, kèm gạch *"Cơ hội `thua` **chưa** có lý do thì **đứng ngoài bảng** này"*. ⚠ `FR-10` (nơi liệt kê nội dung màn hình tổng quan) **không được cập nhật** để nhắc khối thứ tư, và `Q19` vẫn không được trích. |
| TC2 | 2.1b — Bản lưu *xếp theo thời điểm đọc* phủ một phần | **ĐÃ SỬA** | `FR-11`: *"…các Bản lưu của một Công ty **xếp theo thời điểm đọc** (`BR-D3`)"*. |
| TC3 | `T-6`/`T-8` — **cơ chế chuyển bản chụp "trước" → "sau"** không phủ | **ĐÃ SỬA** | `FR-50 · Chuyển bản chụp "trước" → "sau"` `phải có`, kèm *"Đây là **cách duy nhất kích hoạt mọi kịch bản AI**, và là tiền đề của `T-6` lẫn `T-8`"* và gạch chuyển lùi được. |
| TC4 | `§7.1` — mã nguồn trên GitLab không phủ | **CỐ Ý KHÔNG SỬA** | §12.4, có bảng lý do: *"Nói *mã nằm ở đâu*, không nói sản phẩm cư xử ra sao"* · theo dõi ở `CHECKLIST.md` mục C. |
| TC5 | `§7.2` — log Claude Code → Grafana không phủ | **CỐ Ý KHÔNG SỬA** | §12.4: *"Nói *quá trình làm ra sản phẩm*, không nói sản phẩm"* · `CHECKLIST.md` mục B · `D37` · `docs/chien-luoc-ngay-thi.md`. Đây cũng là chỗ `D37` cuối cùng được trích (xem C4). |
| TC6 | 7.5b — `NFR-8` bỏ mất vế ghi vết và cờ của `D32` | **ĐÃ SỬA** | `NFR-8`: *"…về đúng trạng thái phát bài **kể cả ghi vết**, có **cờ giữ ghi vết** khi cần đối chiếu"*, cộng `TR-4`. |

### 2.2 Mâu thuẫn với `D1`–`D41` (3)

| # | Phát hiện | Kết luận | Bằng chứng |
|---|---|---|---|
| TD1 | `FR-18` + sơ đồ §4 gửi **mọi** Phát hiện vào hàng đợi — trái `D3`/`0.1.6` | **SỬA HỤT** | `FR-18` đã có gạch: *"`làm chặt hơn` — Phát hiện có Độ liên quan **`low`** **không** vào Hàng đợi; nó chỉ nằm ở vùng đọc của nhóm 2 (`D3`, `0.1.6`)"*. **Nhưng vế thứ hai của phát hiện — sơ đồ §4.2 — không được sửa**: nhánh vẫn là `├─ còn lại ─→ Hàng đợi gợi ý`. Sơ đồ và FR nay nói ngược nhau. |
| TD2 | `NFR-1` biến điều `D19` nói là không bảo đảm được thành ngưỡng cứng | **ĐÃ SỬA** | `NFR-1` viết lại: *"Vòng quét **không kịp** trong chu kỳ thì vòng kế **bị bỏ và ghi nhật ký kèm lý do**"* · ngưỡng *"0 vòng chồng · 100% vòng bị bỏ có dòng nhật ký"* · *"**Không** đặt ngưỡng cứng thời lượng"*. |
| TD3 | §10.2 sắp lại ba mức quyền ghi khác `D16`, im lặng | **ĐÃ SỬA** | §10.2 có khối trích dẫn: *"**Bảng này sắp lại `D16` một chỗ, có chủ đích.**… Theo quy tắc thẩm quyền, đề bài thắng `D16`, nên bảng trên đúng và `D16` đang thiếu một ô."* + *"**Việc phải làm ngoài PRD**"*. ⚠ Bản phản biện còn đòi trỏ ngược từ §14 — §14 câu 4 chỉ nhắc trường *Giai đoạn mở gần nhất*, không nhắc `D16`. |

### 2.3 Nhãn còn thiếu N1–N8 (8)

| # | Chỗ | Kết luận | Bằng chứng |
|---|---|---|---|
| N1 | §5.1 — `tam_dung` chỉ quay về đúng Giai đoạn mở gần nhất | **ĐÃ SỬA** | Khối dưới bảng §5.1: *"`làm chặt hơn` — **hai chỗ** trong bảng trên chặt hơn đề bài… **Rủi ro nghiệm thu: không** — `T-1` chỉ kéo qua ba giai đoạn đang chạy, không chạm `tam_dung`."* ⚠ Bản phản biện đánh giá rủi ro là *"thấp nhưng không bằng không"* (rủi ro thử tay của giám khảo); PRD hạ xuống *"không"* mà không phản biện lại lập luận đó. |
| N2 | §5.1 nói chung — `mở rộng ngoài đề bài` | **SỬA HỤT** | Câu *"mọi chuyển tiếp ngoài bảng đều bị từ chối"* đã được gộp vào nhãn `làm chặt hơn` ở khối trên. **Nhưng §5.1 với tư cách một mục** — một bảng chuyển tiếp mà đề bài hoàn toàn không có — vẫn không mang nhãn `mở rộng ngoài đề bài`. |
| N3 | `NFR-1` ngưỡng "≤ 60 giây" | **ĐÃ SỬA** | Ngưỡng bị gỡ hẳn, nên nhãn thành thừa. |
| N4 | `FR-35` ô *"vì sao theo dõi"* bắt buộc — rủi ro `T-8` **có thật** | **ĐÃ SỬA** | `FR-35`: *"**tuỳ chọn, không chặn thao tác bật**"* + *"`mở rộng ngoài đề bài`. ⚠ **Ô này bắt buộc thì làm đỏ `T-8`**… Để tuỳ chọn thì **rủi ro nghiệm thu bằng không**"*. §3.2 chốt lại: `viSaoTheoDoi` *"văn bản ngắn, **tuỳ chọn**"*. |
| N5 | `FR-40` hỏi lý do khi xoá | **ĐÃ SỬA** | `FR-40`: *"`mở rộng ngoài đề bài` — `§4/nhóm 5` chỉ nói *"Sales vẫn xoá được"*… Lý do để **tuỳ chọn**, không chặn thao tác xoá. **Rủi ro nghiệm thu: không**"*. (Chọn nhãn `mở rộng ngoài đề bài` thay vì `làm chặt hơn` — hợp lý vì lý do nay là tuỳ chọn.) |
| N6 | `FR-16` "ký hiệu **và** màu" | **ĐÃ SỬA** | `FR-16`: *"`làm chặt hơn` — đề bài viết *"bằng ký hiệu **hoặc** màu"*… **Rủi ro nghiệm thu: không**"*. |
| N7 | `BR-D2`/`BR-D10` | **ĐÃ SỬA** | Đoạn sau bảng §7.1: *"`BR-D2` và `BR-D10` mang nhãn **`làm chặt hơn`** (`D22`)… **rủi ro nghiệm thu bằng không**"*. |
| N8 | Trường *Giai đoạn mở gần nhất* | **CHƯA SỬA** | §3.1 vẫn ghi *"**Trường mới** — xem §5.3"*, §5.3 vẫn *"Trường mới — `functional`"*. Không có nhãn `mở rộng ngoài đề bài`, dù §5.2 ngay cạnh thì có. |

### 2.4 Trích dẫn hỏng C1–C6 (6)

| # | Chỗ | Kết luận | Bằng chứng |
|---|---|---|---|
| C1 | §10 gán câu *"gọi ra dịch vụ bên ngoài thì thoải mái"* cho `§5.3` | **ĐÃ SỬA** | §10.1: *"`§5.3` cấm **chạm tới người thật**, **không** cấm gọi mạng — đề bài nói thẳng ở **`§3`** — *"gọi ra dịch vụ bên ngoài thì thoải mái, kể cả mô hình ngôn ngữ"*"*. Đối chiếu nguồn: câu đó đúng là ở `§3` dòng 54 của đề bài. ✅ |
| C2 | §3 *"`D1` và `F37` đã xử"* — sai vai mã | **ĐÃ SỬA** | §3.1: *"`F37` ghi nhận mâu thuẫn này và `D1` giải nó"*. |
| C3 | `NFR-13` không trích `D36` | **CHƯA SỬA** | Chuỗi `D36` **không xuất hiện một lần nào** trong `prd.md`. `NFR-13` vẫn *"phủ `T-1`…`T-10`"* trơn — bước viết kiểm thử sẽ dựng lại `T-4`/`T-6`/`T-8` ở dạng chưa được `D36` sửa. |
| C4 | §9/§12.3 không trích `D37` | **ĐÃ SỬA** | `D37` được trích ở §12.4, đúng chỗ nó thuộc về: *"`D37` đã xếp nó là **việc làm trước tiên**"*. |
| C5 | `NFR-8` thiếu hai vế của `D32` | **ĐÃ SỬA** | Xem TC6. |
| C6 | `FR-2` *"đúng một"* vs `BR-D4` *"tối đa một"* | **ĐÃ SỬA** | `FR-2`: *"Đánh dấu được **tối đa một** Đầu mối chính (`BR-D4`) — Công ty chưa xác định được đầu mối thì để trống."* Chốt `≤ 1`, khớp `BR-D4` và §3.1. |

---

## 3. `review-doc-standards.md` — 30 phát hiện

### 3.1 Phép 1 — Phân loại yêu cầu (17)

| # | Phát hiện | Kết luận | Bằng chứng / thiếu gì |
|---|---|---|---|
| PL1-01 | Loại `transition` trống hoàn toàn | **ĐÃ SỬA** | §9.2 *Yêu cầu chuyển đổi — `transition`* với `TR-1`…`TR-4`, mỗi dòng có cột *Vì sao là `transition`* và cột *Nghiệm thu*. |
| PL1-02 | `NFR-8` là yêu cầu chuyển đổi bị gán `non-functional` | **SỬA HỤT** | `TR-3` (báo cáo đối soát) và `TR-4` (cờ giữ ghi vết) được tách ra, nhưng **`NFR-8` vẫn ở §9.1 và vẫn mang cả ba vế**. Kết quả không phải sửa phân loại mà là **nhân đôi**: cùng một yêu cầu nay đứng ở hai loại — xem mâu thuẫn mới M-4. |
| PL1-03 | Lớp ánh xạ lược đồ không phải là một yêu cầu | **ĐÃ SỬA** | `TR-1` có mã, có nghiệm thu (*"Đổi tên một trường ở nguồn, chỉ sửa lớp ánh xạ, phần còn lại không đụng"*), và §9.2 nói rõ *"Không có mã thì không có story, không có story thì ngày 15/8 không ai dựng nó."* ⚠ §14 câu 1 vẫn chỉ nhắc `D32`, không trỏ sang `TR-1`. |
| PL1-04 | `FR-34` nhét một mẩu `transition` vào FR `functional` | **CHƯA SỬA** | Gạch cuối `FR-34` còn nguyên (*"⚠ Rủi ro nghiệm thu có thật… bật cờ trên cho bộ dữ liệu đó"*). `TR-4` là *cờ giữ ghi vết khi nạp lại*, hoàn toàn khác `nextAction.overwriteOverdueManual`. |
| PL1-05 | Loại `business` trống hoàn toàn | **SỬA HỤT** | §1 nay mang nhãn tiêu đề *"## 1. Tầm nhìn — `business`"`*, và `SM-1` có câu trỏ ngược (*"số đo duy nhất đo đúng nguyên nhân gốc ở §1"*). **Nhưng §1 vẫn là văn xuôi tầm nhìn**: không có câu dạng *"tổ chức cần X"*, không có §1.1, không có con số. Dán nhãn không tạo ra yêu cầu. |
| PL1-06 | Cả 17 luật §7 không mang nhãn loại | **SỬA HỤT** | §7 nay có nhãn gộp `solution functional` và câu *"Cả 11 luật định nghĩa và 6 luật hành vi đều thuộc loại `solution functional`"*. Nhưng bản phản biện đòi **một cột `Loại` trong cả hai bảng** chính vì hai bảng không đồng loại — và nhãn gộp mới **khẳng định ngược** với PL1-07/08/09 mà không phản bác chúng. Xem mâu thuẫn mới M-6. |
| PL1-07 | `BR-D6` xếp được vào hai loại cùng lúc | **CHƯA SỬA** | `BR-D6` nguyên văn cũ; không có `NFR-14` cho dung sai một bậc; §9.1 không có dòng nào đo độ lệch. |
| PL1-08 | `BR-B6` không xếp được vào loại nào | **CHƯA SỬA** | `BR-B6` vẫn ở §7.2, cột *Khi vi phạm thì sao* vẫn trỏ về `FR-43`. |
| PL1-09 | `BR-B5` là ngưỡng chất lượng đầu ra mô hình | **CHƯA SỬA** | `BR-B5` nguyên văn cũ trong bảng luật hành vi. |
| PL1-10 | `NFR-12` gộp ba loại; **đăng nhập không có FR nào phủ** | **SỬA HỤT** | Lỗ hổng thực chất đã bịt: `FR-49 · Đăng nhập và phiên` `phải có` + `TR-2` gieo hai tài khoản. **Nhưng `NFR-12` không được rút gọn về phần nghiệm thu** — nó vẫn phát biểu chính năng lực đó. Nay một yêu cầu đứng ở **ba loại**: `FR-49` (functional) · `TR-2` (transition) · `NFR-12` (non-functional). Xem M-4. |
| PL1-11 | `NFR-13` trộn ngưỡng chất lượng với mục tiêu dự thi | **CHƯA SỬA** | Vẫn *"1 lệnh, 10/10 điểm"*. |
| PL1-12 | `FR-16` là yêu cầu phi chức năng nằm trong §8 | **CHƯA SỬA** | `FR-16` vẫn là FR. §8 vẫn chừa mệnh đề thoát *"trừ chỗ ghi khác"* mà không FR nào dùng. |
| PL1-13 | `FR-20` gạch 2 là phi chức năng, và PRD tự nói vậy | **CHƯA SỬA** | Vẫn *"Đây là một ràng buộc UX kiểm được, không phải nguyện vọng"* dưới nhãn gộp `solution functional`. |
| PL1-14 | `FR-37` gạch 3 trùng nguyên văn `NFR-2`/`NFR-3`/`NFR-4` | **CHƯA SỬA** | `FR-37` vẫn liệt kê đủ ba cơ chế chi phí. (§10.3 gạch 3 thì đã là con trỏ — *"Ba cơ chế chặn chi phí ở `NFR-2`, `NFR-3`, `NFR-4`"* — nên chỉ còn trùng đôi.) |
| PL1-15 | `NFR-1` chỉ có ngưỡng cho chế độ tạm | **ĐÃ SỬA** | `NFR-1` viết lại, không còn ngưỡng thời lượng gắn với chế độ demo. |
| PL1-16 | `NFR-6`/`NFR-11` là ràng buộc thiết kế | **CHƯA SỬA** | Cả hai vẫn ở §9.1; §10 vẫn không có bảng *Ràng buộc* riêng. |
| PL1-17 | Hai ràng buộc chỉ sống trong kỳ thi không mang nhãn | **CHƯA SỬA** | §10.3 gạch 1 và §12.3 (`D39`) vẫn không nhãn, dù §9.2 nay đã có sẵn ô `transition` để đặt. |

### 3.2 Phép 2 — Phạm vi hai phía (5)

| # | Phát hiện | Kết luận | Bằng chứng / thiếu gì |
|---|---|---|---|
| PL2-01 | *Tính năng BTC phát thêm* không có rìa ngoài; §12.1 và §12.3 không thống nhất | **SỬA HỤT** | §8 nay cho một **tiêu chí cắt khách quan** — đó là nửa đầu của việc. **Nhưng §12.3 nguyên văn cũ** (không có thứ tự cắt, không có dòng *"không bao giờ cắt"*), **§12.1 nguyên văn cũ** (không liệt kê tính năng phát thêm), và không có con trỏ nào từ §12.3 sang §8. Hai mục con của §12 vẫn nói khác nhau. |
| PL2-02 | §11 loại trừ *"công cụ báo cáo cho cấp trên"* nhưng §8.6 đo hành vi từng người | **CHƯA SỬA** | §11 gạch 2 nguyên văn cũ. `FR-23`, `FR-41`, `FR-43`, §6 (`D28`) đều không đổi. Không có câu nào nói số đo là **gộp** hay có màn hình xếp hạng cá nhân hay không. |
| PL2-03 | Khái niệm *người sở hữu* nửa trong nửa ngoài | **CHƯA SỬA** | §11 gạch 5 vẫn *"**Không** làm phân quyền theo người sở hữu"*, trong khi §3.1, `FR-18`, `FR-31` vẫn dùng người sở hữu làm dữ liệu định tuyến. |
| PL2-04 | Rìa ngoài mô hình dữ liệu cấp Cơ hội không được nêu | **CHƯA SỬA** | §12.2 vẫn đúng 6 dòng; không có dòng dòng hàng / báo giá / hợp đồng / tệp đính kèm. |
| PL2-05 | §11 trộn nguyên tắc vào danh sách loại trừ | **CHƯA SỬA** | §11 vẫn một khối 6 gạch, chưa tách *Không xây* / *Không đánh đổi*. |

### 3.3 Phép 3 — Hình thái bài toán (7 + 1 ghi chú)

| # | Phát hiện | Kết luận | Bằng chứng / thiếu gì |
|---|---|---|---|
| PL3-01 | **Data Dictionary — không có** | **SỬA HỤT** | §3.2 *Từ điển dữ liệu* đã mở, 10 trường, đủ cột (Trường · Kiểu · Bắt buộc · Nghĩa và luật). **Bốn thứ bản phản biện đòi đích danh vẫn thiếu:** (a) **13 giá trị `signalSubtype` vẫn không được liệt kê** — §3.2 chỉ ghi *"enum 13 giá trị (`0.1.5`)"*, tức lại trỏ ra ngoài đúng thứ PL3-01 nói là không trỏ được; (b) **`unclassified` vẫn không được định nghĩa** — vẫn không rõ nó là một trong 13 hay một giá trị riêng, dù `BR-B5` và `FR-43` đều dựa vào nó; (c) **mâu thuẫn phạm vi áp dụng không được giải, chỉ được chép lại**: §3.2 nói `signalSubtype` *"Bỏ trống ở mọi Loại tin khác"* trong khi `BR-D6` vẫn suy `relevance` từ nó cho **mọi** Loại tin; (d) `nextAction.overwriteOverdueManual` vẫn không nói có sửa được từ `FR-44` hay không. Cộng thêm một lỗi mới: **ba cách viết cho cùng một trường** — `signalSubtype` (§3.2) · `signal_subtype` (`BR-D6`, `BR-B5`, §12.1) · `signal_type` (§3.2, cột *Bắt buộc*). |
| PL3-02 | **Data Flow — không có** | **SỬA HỤT** | §4.3 *Luồng dữ liệu* đã mở, có nhánh nạp (`TR-1`), nhánh đọc, nhánh ra biên (danh sách trắng những gì rời hệ thống — phần mạnh nhất của mục mới), và bảng **Luật lưu giữ** ba trần. **Nhánh thứ tư mà bản phản biện đòi — đường xoá mềm (`FR-1` cascade · `FR-40` giữ làm dữ liệu đo · `D26` đóng Gợi ý đang chờ) — không có.** Cộng hai lỗi đếm nội bộ, xem M-2. |
| PL3-03 | §5.1 dòng 2 và dòng 7 mâu thuẫn nhau | **ĐÃ SỬA** | Cột *Từ* của dòng 2 nay là *"Ba giai đoạn đang chạy còn lại"*, nên `thang`/`thua` không còn lọt qua đường không điều kiện. ⚠ Dòng 1 (*"Bốn giai đoạn đang chạy → Bất kỳ giai đoạn đang chạy nào khác"*) vẫn **bao trùm** dòng 2, và câu tiêu chí *"dòng có điều kiện canh chặt hơn thắng"* không được thêm — chồng lấn còn, nhưng không còn mâu thuẫn. |
| PL3-04 | State Modelling không khai trạng thái khởi đầu | **CHƯA SỬA** | §5.1 vẫn không có dòng *"— (tạo mới)"*; `FR-3` vẫn chỉ nói Cơ hội *"có… Giai đoạn hiện tại"*. Người tạo vẫn có thể chọn `thang`. |
| PL3-05 | Ma trận §6 thiếu toàn bộ khối thực thể của nhóm 2 | **CHƯA SỬA** | §6 vẫn 20 hàng. Không có hàng nào cho **Bản lưu**, **Phát hiện**, hai nút *hữu ích / không hữu ích* (`FR-42`), hay **đăng nhập / quản lý tài khoản** — dù `FR-49` vừa được thêm. Tuyên bố *"Bốn dòng in đậm là **toàn bộ** khác biệt"* vẫn dựa trên một ma trận chưa đầy. |
| PL3-06 | Process Modelling: không có nhánh ngoại lệ, không phân làn | **CHƯA SỬA** | §4.1 và §4.2 nguyên văn cũ. Không có nhánh *"AI tắt"*, không có nguồn không đọc được, không có vòng bị bỏ, không đánh dấu tác nhân. |
| PL3-07 | Data Modelling chạy một phần, bị uỷ quyền | **ĐÃ SỬA** | §3.2 chọn đúng phương án hai của bản phản biện: *"Bảng dưới là **trường dữ liệu** mà PRD này khai sinh… Thiếu bảng này thì bước Kiến trúc tự đặt tên và tự chọn kiểu."* PRD nay sở hữu phần delta một cách tường minh. |
| G1 | *Ghi chú ngoài ba phép* — `§5.1`/`§5.2`/`§5.3` hai nghĩa | **CHƯA SỬA** | Trùng R13. Không có tiền tố `ĐB§`. |

---

## 4. Bốn phép kiểm hồi quy trên chính loạt sửa

### Phép A — Mâu thuẫn mới do các mục mới đẻ ra

**Bảy chỗ. Ba chỗ nặng.**

**M-1 · `§12.1` vẫn ghi "47 FR" trong khi PRD nay có 50. — nặng, sửa một chữ.**
> §12.1: *"Sáu nhóm tính năng `§4` với **47 FR** ở §8…"*
> §8: cột *Số FR* cộng lại là **31 + 18 + 1 = 50**, và `FR-1`…`FR-50` đều tồn tại, liên tục, không trùng.

Đây là hệ quả trực tiếp của việc thêm `FR-48`, `FR-49`, `FR-50`. Hai con số trong cùng tài liệu
chênh nhau 3, và §12.1 là chỗ bước Epic & Story đọc để chốt phạm vi.

**M-2 · §4.3 tự đếm sai nhánh của chính nó. — vừa.**
- Tiêu đề: *"### 4.3 Luồng dữ liệu — **bốn nhánh**"*. Bên dưới chỉ có **ba** khối mang chữ *Nhánh*
  (nạp · đọc · ra biên); khối thứ tư là **Luật lưu giữ**, một bảng trần, không phải một nhánh.
- Câu mở: *"**Ba nhánh trên** nói *thứ tự công việc*. **Nhánh dưới** nói *dữ liệu đi đâu*"* — nhưng
  §4.1 + §4.2 chỉ có **hai** nhánh (người, máy), và "nhánh dưới" số ít lại dẫn vào bốn khối.
- Câu *"nó trả lời **ba câu** bước Kiến trúc buộc phải có đáp án"* — ba câu đó không được liệt kê.

**M-3 · §4.3 dùng thực thể "Bản chụp" mà §3 không có, ngay sau khi §3.2 vừa được mở ra để chống
đúng lỗi này. — vừa.**
> §4.3: *"Bộ dữ liệu BTC → lớp ánh xạ mỏng (`TR-1`) → Công ty · Người liên hệ · Cơ hội · **Bản chụp**"*
> §4.3: *"**Nhánh đọc.** Bản chụp → Bản lưu (hai dạng: thô và đã chuẩn hoá) → Phát hiện."*

*Bản chụp* nay là một **thực thể có vòng đời** trong luồng dữ liệu, khác *Bản lưu* — nhưng §3.1
không có dòng nào cho nó và §3.2 cũng không. §3.1 tự đặt luật: *"Bước sau dùng **đúng** các từ này.
Không dùng từ đồng nghĩa ở bất kỳ đâu trong tài liệu."* Bước Kiến trúc sẽ phải đoán *Bản chụp* và
*Bản lưu* khác nhau ở đâu, trong khi `FR-50` lại chỉ nói *"phiên bản bản chụp trước/sau"*.

**M-4 · §9.2 tạo ra hai yêu cầu bị xếp vào hai và ba loại cùng lúc — phá thẳng lời hứa của §0. — nặng.**
> §0: *"Mỗi yêu cầu trong tài liệu đều xếp được vào **đúng một** loại."*

| Yêu cầu | Đang mang mấy loại |
|---|---|
| Nạp dữ liệu idempotent + báo cáo đối soát + cờ giữ ghi vết | `NFR-8` (`non-functional`) **và** `TR-3`, `TR-4` (`transition`) — `TR-3` còn tự trỏ về *"In ra khi chạy `NFR-8`"* |
| Hai tài khoản Sales/Quản trị đăng nhập được | `FR-49` (`solution functional`) **và** `TR-2` (`transition`) **và** `NFR-12` (`non-functional`) — `FR-49` tự trỏ cả hai: *"(`TR-2`)… (`NFR-12`)"* |

Đây không phải trùng lặp vô hại: bước Epic & Story sinh story theo mã, nên hai yêu cầu này sẽ ra
**năm** story cho hai việc.

**M-5 · §12.4 mô tả sai chính bố cục sau khi sửa. — vừa.**
> §12.4: *"**Ba** trong số đó — `§7.3` bản dựng production, `§7.4` bộ kiểm thử một lệnh, `§7.5` lệnh
> nạp dữ liệu — là **phẩm chất của sản phẩm đang chạy**, nên chúng nằm ở §9 dưới dạng `NFR-5`,
> `NFR-7`, `NFR-8`, `NFR-11`, `NFR-12`, `NFR-13`."*

Sai hai chỗ sau loạt sửa: `§7.3` nay còn được phủ bởi **`FR-49`** (nằm ở §8, không phải §9) và
**`TR-2`**; `§7.5` nay còn được phủ bởi **`TR-3`**, **`TR-4`**. Nặng hơn là lý do: §12.4 biện minh
rằng ba điều kiện đó là *"phẩm chất của sản phẩm đang chạy"*, trong khi §9.2 vừa lập luận ngược cho
đúng những mảnh đó — `TR-2`: *"hệ thống thật có 7 vai và quy trình cấp tài khoản riêng"*; `TR-3`:
*"Không phải tính năng vận hành"*. Hai mục nói ngược nhau về cùng một thứ.

**M-6 · §7 khẳng định cả 17 luật là `solution functional` — mâu thuẫn với chính nội dung ba luật. — vừa.**
> §7: *"Cả 11 luật định nghĩa và 6 luật hành vi đều thuộc loại `solution functional`: chúng nói hệ
> thống phải **làm** gì, không nói làm **tốt đến mức nào** — phần đó ở §9."*

Ba luật nói đúng *tốt đến mức nào*: `BR-D6` (*"lệch **tối đa một bậc**"*), `BR-B5` (*"tỉ lệ…
**không vượt ngưỡng**"*), `BR-B6` (*"nhịp duyệt và thời gian quyết **nằm trong ngưỡng**"*). Câu
khẳng định mới biến ba phát hiện đang mở (PL1-07/08/09) thành mâu thuẫn hiển ngôn trong văn bản.

**M-7 · Bộ nhãn loại dùng thật không khớp bộ nhãn §0 công bố. — nhẹ nhưng cơ học.**
§0 công bố đúng năm giá trị: `business` · `stakeholder` · `functional` · `non-functional` ·
`transition`. Tài liệu dùng: `business` (§1) ✅ · `stakeholder` (§2.1) ✅ · `functional` (§5.1, §5.3) ✅
· `transition` (§9.2) ✅ · nhưng **`solution functional`** (§7, §8) và **`solution non-functional`**
(§9.1) không nằm trong danh sách. Hai từ vựng phân loại song song cho cùng một trục.

*Không tìm thấy mâu thuẫn nào* giữa §3.2/§4.3/§9.2 với `BR-D1`–`BR-D11`, với bốn ranh giới §10.1,
hay với `T-1`…`T-10`. Danh sách trắng "ra biên" ở §4.3 chặt hơn `§5.3` của đề bài và tự nhận điều đó
(*"Ranh giới này hẹp hơn `§5.3` của đề bài đòi… và nó là điều đội tự đặt"*) — hợp lệ.

> ⚠ Một điểm căng nhẹ đáng ghi, chưa đủ thành mâu thuẫn: §4.3 cấm gửi ra *"dữ liệu Cơ hội"*, trong
> khi `FR-28` đòi nội dung tự đặt *"nhắc tới sự kiện đã kích hoạt nó"* cho **một Cơ hội cụ thể** và
> `FR-18` đòi Gợi ý trình bày *"hiện tại → đề nghị"* trên ô hồ sơ **đã có giá trị**. Cả hai vẫn dựng
> được ở phía trong hệ thống, nhưng nếu bước Kiến trúc chọn để mô hình soạn câu, ranh giới này sẽ bị
> chạm. Nên nói rõ ai soạn câu.

> ⚠ Điểm nhỏ thứ hai: §4.3 gắn nhãn **`làm chặt hơn`** cho ba trần lưu giữ, ngay trong câu tự nhận
> *"cả bốn nhánh này đề bài **không nói gì**"*. Đề bài không nói gì thì nhãn đúng là
> `mở rộng ngoài đề bài`, không phải `làm chặt hơn`. Nhãn dùng sai từ.

### Phép B — Trích dẫn chéo

**Mã định danh: sạch.** Đối chiếu từng dãy, mọi tham chiếu đều trỏ tới thứ tồn tại thật:

| Dãy | Định nghĩa có | Được tham chiếu | Kết quả |
|---|---|---|---|
| `FR-1`…`FR-50` | 50, liên tục, không trùng | 50 mã khác nhau | ✅ không mã treo |
| `BR-D1`–`BR-D11` · `BR-B1`–`BR-B6` | 11 + 6 | đủ 17 | ✅ |
| `NFR-1`–`NFR-13` | 13 | đủ 13 | ✅ |
| `TR-1`–`TR-4` | 4 (§9.2) | `TR-1` ở §4.3, `TR-2` ở `FR-49` | ✅ |
| `SM-1`–`SM-5` · `SM-C1`–`SM-C4` | 5 + 4 | đủ | ✅ |
| `A1`–`A5` · `UJ-1`–`UJ-3` | 5 + 3 | đủ | ✅ |

**Tham chiếu `§n` nội bộ: hai loại hỏng, chưa chỗ nào được sửa.**

**B-1 · `§5.4` vẫn trỏ vào một mục không tồn tại trong PRD.**
> §6, hàng *Xoá Công ty*: *"❌ `§5.4`"*

PRD có §5.1, §5.2, §5.3 — không có §5.4. Đây là phát hiện R13 nguyên vẹn.

**B-2 · Quy ước tiền tố cho nguồn ngoài không được nhận. Bốn chỗ còn nhập nhằng:**

| Chỗ | Viết | Đọc theo PRD thì thành | Ý thật |
|---|---|---|---|
| §6, *Đóng Cơ hội* | `❌ §5.2` | §5.2 PRD = *"Một chỗ chặt hơn đề bài"* (nói Quản trị **được** mở lại) — gần như ngược | ranh giới 2 của đề bài |
| §6, *Sửa giá trị tiền* | `❌ §5.2` | như trên | ranh giới 2 của đề bài |
| §6, *Gọi ra dịch vụ ngoài* | `✅ §5.3` | §5.3 PRD = *"Trường mới — Giai đoạn mở gần nhất"* | ranh giới 3 của đề bài |
| §2.2 | *"`§5.3` cấm sản phẩm chạm tới người thật"* | như trên | ranh giới 3 của đề bài |

Ngược lại §6 hàng *Đổi Giai đoạn* ghi `❌ §5.1` **theo nghĩa nội bộ** (bảng chuyển tiếp của PRD) —
tức cùng một ký hiệu `§5.x` mang hai nghĩa trong **cùng một bảng**. Không xuất hiện chuỗi `ĐB §` hay
`ĐB§` nào trong tài liệu.

**B-3 · Riêng câu hỏi "§9 có còn được trỏ theo nghĩa cũ không": có, ba chỗ.**

`§9` nay là mục cha của §9.1 (phi chức năng) và §9.2 (chuyển đổi). Ba tham chiếu còn trỏ `§9` trong
khi ý là §9.1:

| Dòng | Câu | Nên là |
|---|---|---|
| §7, mở đầu | *"…không nói làm **tốt đến mức nào** — phần đó ở **§9**"* | §9.1 |
| §12.4 | *"…nên chúng nằm ở **§9** dưới dạng `NFR-5`, `NFR-7`…"* | §9.1 — và câu này còn sai nội dung, xem M-5 |
| §12.4, bảng `§7.1` | *"Đưa vào **§9** là mô hình sai"* | §9.1 |

Không tham chiếu nào **gãy** (§9 vẫn tồn tại), nhưng cả ba nay chỉ đúng một nửa mục, và chỗ ở §12.4
đã trở thành sai thật. **Không có chỗ nào trong tài liệu trỏ `§9.1` hoặc `§9.2`** — nghĩa là hai
mục con mới ra đời hoàn toàn không được ai dẫn tới, kể cả §0 (§0 vẫn chỉ kể ba thứ PRD thêm và
không nhắc §9.2 lẫn §3.2).

### Phép C — Nhãn ưu tiên

**Con số công bố khớp thực tế.** Đếm nhãn trong §8, trừ ba lần xuất hiện trong bảng tiêu chí:
`phải có` **31** · `nên có` **18** · `bỏ được` **1** · tổng **50** = số FR. ✅
Mỗi FR mang **đúng một** nhãn, không FR nào thiếu nhãn, không FR nào mang hai nhãn ưu tiên. ✅

**Nhưng chính quy tắc dẫn xuất công bố ở §8 bị phản chứng, và năm FR gắn sai theo quy tắc đó.**

**C-1 · Quy tắc `bỏ được` sai ngay trong tài liệu.**
> §8: *"| `bỏ được` | Đội tự thêm ngoài đề bài | **Mang nhãn `mở rộng ngoài đề bài`** | **1** |"*

Ba FR mang nhãn `mở rộng ngoài đề bài`, không phải một:

| FR | Nhãn ưu tiên | Có `mở rộng ngoài đề bài`? |
|---|---|---|
| `FR-26` Hoàn tác cho nhóm 3 | `bỏ được` | có |
| `FR-35` Nhãn Đang theo dõi | **`phải có`** | có (cho ô *vì sao theo dõi*) |
| `FR-40` Sales xoá mục hệ thống thêm | **`nên có`** | có (cho việc hỏi lý do) |

`FR-35` và `FR-40` gắn nhãn ưu tiên **đúng** (`T-8` dựa vào `FR-35`; `FR-40` nằm trong `§4/nhóm 5`),
nên cái sai là **quy tắc**: nó suy từ nhãn phạm vi của *một gạch con* sang nhãn ưu tiên của *cả FR*.
Cần viết lại thành *"toàn bộ FR nằm ngoài đề bài"*.

**C-2 · Hai FR gắn quá thấp, và cả hai đều là tiền đề của một điểm `T`.**

| FR | Đang là | Phải là | Căn cứ |
|---|---|---|---|
| **`FR-18` Sinh Gợi ý vào Hàng đợi** | `nên có` | **`phải có`** | `T-4` mở đầu bằng *"**Sinh một gợi ý** rồi không làm gì"*; `T-5` mở đầu bằng *"**Duyệt một gợi ý**, sửa-rồi-duyệt một gợi ý, bỏ một gợi ý"*. Không có `FR-18` thì hai điểm này không có đối tượng để chạy. Nghịch lý hiển nhiên: `FR-20`, `FR-21`, `FR-22`, `FR-23` — bốn FR **tiêu thụ** Gợi ý — đều `phải có`, còn FR **sinh ra** Gợi ý thì `nên có`. |
| **`FR-7` Việc tiếp theo và ngày hạn** | `nên có` | **`phải có`** | `T-1` kiểm *"tìm kiếm và **lọc**"* và *"mở **màn hình tổng quan**"*. `FR-9` lọc Cơ hội *"theo tình trạng quá hạn Việc tiếp theo"* và `FR-10` hiện *"danh sách Việc tiếp theo quá hạn"* — cả hai không tồn tại nếu không có trường của `FR-7`. `T-6`/`T-7` cũng ghi đè lên đúng trường này. |

**C-3 · Hai FR gắn quá cao theo đúng tiêu chí công bố.**

| FR | Đang là | Theo tiêu chí là | Vì sao |
|---|---|---|---|
| `FR-28` Nội dung có bằng chứng | `phải có` | `nên có` | `T-6` chỉ khẳng định *"Việc tiếp theo của cơ hội **tự đổi**, có thông báo, và ô mang dấu hiệu do hệ thống đặt"* — không kiểm nội dung có nhắc sự kiện hay kèm câu trích. `§7` không đòi. Nằm trong `§4/nhóm 4` ⇒ đúng định nghĩa `nên có`. |
| `FR-29` Ngày hạn phản ánh độ gấp | `phải có` | `nên có` | Không điểm `T` nào kiểm **giá trị** ngày hạn. Nằm trong `§4/nhóm 4` ⇒ `nên có`. |

**C-4 · Một FR gắn quá thấp ở mức tranh cãi được (nêu để đội tự quyết, không kết luận).**
`FR-14` *Vùng đọc* — `nên có`. `T-3` là *"Bấm vào một phát hiện thì mở đúng đoạn văn gốc"*, và bề
mặt duy nhất PRD định nghĩa để một Phát hiện **xuất hiện** cho người bấm chính là vùng đọc của
`FR-14`. Nếu bộ kiểm thử `T-3` gọi thẳng tầng nghiệp vụ thì không cần; nếu thử tay thì cần.

**C-5 · Hai FR rơi qua kẽ cả ba định nghĩa.**
`nên có` được định nghĩa là *"Nằm trong `§4`, không nằm trong bảng `T`"*. Hai FR mang nhãn `nên có`
nhưng **không nằm trong `§4` của đề bài**:
- `FR-42 · error-detection rate` — `§4/nhóm 6` liệt kê nội dung màn hình số đo và **không có** số đo
  này; nó đến từ `D30`.
- `FR-38 · Không chồng vòng` — `§4/nhóm 5` không nhắc; nó đến từ `D19`.

Cả hai không phải `phải có` (không `T` nào chạm), không thoả định nghĩa `nên có`, và không mang nhãn
`mở rộng ngoài đề bài` để thành `bỏ được`. Định nghĩa `nên có` nên nới thành *"đề bài **hoặc Mục 0**
đòi"*.

### Phép D — Từ vựng *đang chạy* / *đang mở*

**Định nghĩa đã vào §3.1, rõ và đúng:**
> *"**Đang mở** | Từ của **đề bài**: năm Giai đoạn chưa đóng — bốn giai đoạn đầu **cộng** `tam_dung`"*
> *"**Đang chạy** | Từ **PRD này thêm**: bốn Giai đoạn đầu, **không** gồm `tam_dung`… tập con thật sự của *Đang mở*"*

**§5.1 đã chuyển sạch sang *đang chạy*** (6/6 hàng liên quan), **§7.2 dùng đúng cả hai nghĩa**
(`BR-B1` = *đang mở* 5 giai đoạn · `BR-B4` miễn trừ `tam_dung` · miễn trừ hết khi *"quay lại một
giai đoạn **đang chạy**"*), **§3.2 dùng đúng** (`giaiDoanMoGanNhat` = *"Giai đoạn **đang chạy** cuối
cùng"*).

**Còn ba chỗ dùng lẫn. Chỗ thứ nhất và thứ hai là lỗi thật.**

**D-1 · §3.1 và §3.2 định nghĩa cùng một trường bằng hai từ ngược nhau. — nặng.**
> §3.1, dòng *Giai đoạn mở gần nhất*: *"Giai đoạn **đang mở** cuối cùng của Cơ hội trước khi nó sang
> Tạm dừng, Thắng hoặc Thua"*
> §3.2, `giaiDoanMoGanNhat`: *"Giai đoạn **đang chạy** cuối cùng trước khi Cơ hội sang `tam_dung`,
> `thang` hoặc `thua`"*

Đọc §3.1 theo đúng nghĩa §3.1 vừa đặt cho *Đang mở*, `tam_dung` cũng là một giai đoạn đang mở — nên
*"Giai đoạn đang mở cuối cùng trước khi sang Tạm dừng"* mở đường cho chính `tam_dung` làm giá trị,
và đường quay về từ `tam_dung` thành vòng lặp vô nghĩa. Hai ô cạnh nhau trong cùng một mục §3.

**D-2 · §6 vẫn cấp quyền theo nghĩa cũ, và điều đó nay mâu thuẫn với §5.1. — nặng.**
> §6: *"| Đổi Giai đoạn giữa các giai đoạn **đang mở** | ✅ | ✅ | ❌ `§5.1` |"*

Theo §3.1, *đang mở* gồm `tam_dung`. Hàng này vì thế cấp cho Sales quyền kéo tự do giữa cả năm giai
đoạn — trong khi §5.1 chỉ cho `tam_dung` quay về **đúng** Giai đoạn mở gần nhất, và `FR-4` nói
*"Chuyển tiếp không có trong §5.1 bị từ chối — kể cả `tam_dung` sang một giai đoạn đang chạy tuỳ
chọn"*. Phải là *"giữa các giai đoạn **đang chạy**"*.

**D-3 · `FR-27` gạch 1 dùng *đang mở* rồi gạch 3 phải đi vá lại. — vừa.**
> `FR-27`: *"- Áp cho **mọi** Cơ hội **đang mở** của Công ty…"*
> `FR-27`: *"- **Không** tự đặt cho Cơ hội ở `tam_dung`, dù `§4/nhóm 1` xếp nó là đang mở"*

Gạch 3 là ngoại lệ hợp lệ và có trích nguồn, nên không sai — nhưng gạch 1 nay viết được bằng một từ
(*đang chạy*) khiến gạch 3 chỉ còn là ghi chú. Trớ trêu là §3.1 lấy chính `FR-27` làm lý do khai sinh
từ *Đang chạy* (*"Cần một từ riêng vì `BR-B4` và `FR-27` chỉ đúng với nghĩa này"*) — mà `FR-27` lại
là chỗ chưa dùng từ đó.

*Ba chỗ dùng *đang mở* còn lại là **đúng**, không cần sửa:* §5 mở đầu (dẫn nhãn của đề bài),
`BR-B1` (chủ ý dùng nghĩa 5 giai đoạn), `FR-27` câu chính *"Công ty đang có ít nhất một Cơ hội mở"*
(điều kiện kích hoạt, chép đúng `§4/nhóm 4`). Sơ đồ §4.2 dùng *"Công ty có Cơ hội mở"* cho chạm 1 —
đúng ở vế kích hoạt, nhưng nên nói thêm tập đích là *đang chạy* để khớp `FR-27`.

---

## 5. Việc phải làm, xếp theo mức chặn

| # | Việc | Ở đâu | Vì sao gấp |
|---|---|---|---|
| **1** | Sửa **47 FR → 50 FR** | §12.1 | Con số phạm vi sai; bước Epic & Story đọc đúng dòng này |
| **2** | Đổi nhãn `FR-18` và `FR-7` sang `phải có`; hạ `FR-28`, `FR-29` xuống `nên có`; cập nhật cột *Số FR* | §8 | Thứ tự cắt lúc 11 giờ trưa sẽ bỏ đúng FR mà `T-4`/`T-5`/`T-1` cần |
| **3** | Sửa *"đang mở"* → *"đang chạy"* ở §3.1 dòng *Giai đoạn mở gần nhất*, §6 hàng *Đổi Giai đoạn*, `FR-27` gạch 1 | §3.1, §6, §8.4 | D-1 và D-2 phá lại đúng cái loạt sửa vừa dựng |
| **4** | Gỡ trùng loại: rút `NFR-8` về phần nghiệm thu (hoặc bỏ `TR-3`/`TR-4`), rút `NFR-12` về phần nghiệm thu | §9.1, §9.2 | §0 hứa mỗi yêu cầu đúng một loại; hiện có 2 việc → 5 mã |
| **5** | Sửa §12.4: bổ sung `FR-49`, `TR-2`, `TR-3`, `TR-4` vào danh sách phủ `§7.3`/`§7.5`; hoà giải lý do với §9.2 | §12.4 | Đang mô tả sai bố cục của chính tài liệu |
| **6** | Sửa nhánh sơ đồ §4.2 `còn lại` → điều kiện tường minh (`Độ liên quan ≥ medium`), thêm câu *"ba chạm đánh giá độc lập"* | §4.2 | Sơ đồ và `FR-18` đang nói ngược nhau sau khi `FR-18` được sửa |
| **7** | Đặt tiền tố `ĐB §` cho mọi tham chiếu đề bài; sửa `§5.4`; đổi ba chỗ `§9` → `§9.1` | §0, §2.2, §6, §7, §12.4 | R13/G1 chưa động; §9 vừa bị chia làm mục ambiguity nặng thêm |
| **8** | Liệt kê 13 giá trị `signalSubtype` + định nghĩa `unclassified`; thống nhất một cách viết; giải phạm vi áp dụng với `BR-D6` | §3.2 | §3.2 mở ra để chống đúng lỗi này mà lại trỏ ra ngoài |
| **9** | Thêm nhánh **xoá mềm** vào §4.3; sửa *"bốn nhánh"*/*"ba nhánh trên"*; đổi nhãn `làm chặt hơn` → `mở rộng ngoài đề bài`; thêm *Bản chụp* vào §3.1 | §3.1, §4.3 | Mục mới đang tự đếm sai và dùng thực thể chưa khai |
| **10** | `NFR-2`/`NFR-3`: thêm cột *khi chạm trần thì sao*; `FR-11`: luật so sánh nội dung (hash trên bản chuẩn hoá + trường loại trừ); `FR-32`: nút Hoàn tác biến mất khi ô bị sửa tay; `FR-45`: Hàng đợi còn bấm được | §9.1, §8.2, §8.4, §8.6 | Bốn chỗ *"người viết mã sẽ tự phát minh ra luật"* còn nguyên; `FR-11` có rủi ro `T-8` trực tiếp |
| **11** | Trích `D36` vào `NFR-13` | §9.1 | Bộ kiểm thử sẽ dựng lại `T-4`/`T-6`/`T-8` ở dạng chưa sửa |
| **12** | Thêm hàng Bản lưu · Phát hiện · nút *hữu ích/không hữu ích* · đăng nhập vào §6; thêm trạng thái khởi đầu vào §5.1 | §5.1, §6 | Tuyên bố *"Bốn dòng in đậm là toàn bộ khác biệt"* chưa đứng được |
| **13** | Phần còn lại của `Phép 1` (PL1-04, 07, 08, 09, 11–14, 16, 17) và `Phép 2` (PL2-02…05) | rải | Không chặn ngày thi; chặn chất lượng tài liệu ở vòng 3 |
