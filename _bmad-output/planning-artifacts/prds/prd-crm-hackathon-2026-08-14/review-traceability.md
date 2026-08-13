---
title: "Soát truy vết PRD ↔ đề bài chính thức ↔ Mục 0"
status: review
created: 2026-08-14
target: prd.md
---

# Soát truy vết — PRD "Why Now" đối chiếu hai nguồn đứng trên nó

**Đối tượng soát.** `prd.md` (686 dòng, 47 FR, 11 BR-D, 6 BR-B, 13 NFR).

**Nguồn hạng 1.** `docs/Đề bài/Yêu Cầu đề bài chính thức của cuộc thi prd.md`.
**Nguồn hạng 2.** Mục 0 của `docs/Đề bài/Phản biện và phân tích yêu cầu.md` — `D1`–`D41`,
enum `0.1.1`–`0.1.7`, bảng số `0.2.1`–`0.2.3`, trạng thái `Q1`–`Q22` và `F1`–`F40`.

**Quy tắc thẩm quyền áp dụng khi soát.** Đề bài chính thức thắng Mục 0; Mục 0 thắng PRD. PRD được
phép chặt hơn đề bài nhưng mỗi chỗ như vậy phải mang nhãn (`làm chặt hơn` hoặc
`mở rộng ngoài đề bài`) và nêu rủi ro với `T-1`…`T-10`.

**Kết quả một dòng.** Duyệt **69** gạch đầu dòng bắt buộc — **4 gạch không tìm được chỗ phủ**,
**2 gạch phủ thiếu một phần**, **3 mâu thuẫn với `Dn`**, **7 chỗ chặt hơn hoặc mở rộng mà không có
nhãn**, **2 trích dẫn hỏng**. Toàn bộ `Dn` / `Qn` / `Fn` / `T-n` được PRD nhắc đều **tồn tại thật**
trong nguồn.

---

## 1. Phủ yêu cầu

Ký hiệu cột **Trạng thái**: `phủ` · `phủ một phần` · **`KHÔNG PHỦ`**.

### 1.1 `§4/nhóm 1` — CRM làm tay (11 gạch + 1 ràng buộc)

| # | Gạch đầu dòng (cụm nhận ra) | Chỗ phủ trong PRD | Trạng thái |
|---|---|---|---|
| 1.1 | "Tạo, sửa, xoá và xem chi tiết **công ty**… bắt buộc tên, ngành, loại công ty" | `FR-1` | phủ |
| 1.2 | "Tạo, sửa, xoá **người liên hệ**… đánh dấu được đúng một người là **đầu mối chính**" | `FR-2`, `BR-D4` | phủ |
| 1.3 | "Tạo và quản lý **cơ hội**… tên, giá trị dự kiến, tháng dự kiến chốt, giai đoạn" | `FR-3` | phủ |
| 1.4 | "Bảy giai đoạn, thứ tự cố định, không cho đội tự đổi tên… *đang mở* / *đã đóng*" | `BR-D11`, §3 Từ vựng, `FR-4` gạch 3 | phủ |
| 1.5 | "**Đủ điều kiện**… hỏi ngay hai ô dấu hiệu nhu cầu / ngân sách. Bỏ qua được… không chặn" | `FR-5`, `BR-B2`, §5.1 dòng 2 | phủ |
| 1.6 | "Đổi giai đoạn bằng **kéo thả**… đi lùi và nhảy cóc đều được, hệ thống không chặn" | `FR-4`, §5.1 dòng 1 | phủ *(nhưng bị làm chặt hơn không nhãn — xem §3, mục N1/N2)* |
| 1.7 | "Ghi **hoạt động**… một dòng thời gian của công ty, mới nhất ở trên" | `FR-6` | phủ |
| 1.8 | "**Việc tiếp theo** và **ngày hạn**… vẫn lưu được, mang cờ cảnh báo, không vào danh sách việc phải làm" | `FR-7`, `BR-B1` | phủ |
| 1.9a | "Chuyển sang **Thua** thì hỏi lý do ngay. Bỏ qua được… mang cờ cảnh báo" | `FR-8`, `BR-B3` | phủ |
| 1.9b | "…và **đứng ngoài bảng thống kê lý do thua** cho tới khi bổ sung" | Chỉ được *nhắc* ở `FR-8` và `BR-B3`. **Không FR nào định nghĩa bảng đó**; `FR-10` liệt kê ba khối của màn hình tổng quan, không có khối lý do thua | **KHÔNG PHỦ** |
| 1.10 | "**Tìm kiếm** công ty theo tên. **Lọc** công ty theo ngành/loại/quốc gia/Đang theo dõi. **Lọc** cơ hội theo giai đoạn và quá hạn" | `FR-9` | phủ |
| 1.11 | "**Màn hình tổng quan**: số công ty theo ngành, số cơ hội và tổng giá trị theo giai đoạn, Việc tiếp theo quá hạn" | `FR-10`, `BR-D9` | phủ |
| 1.12 | Ràng buộc: "Tắt sạch phần AI thì nhóm 1 vẫn chạy đủ" | §8.1 "NFR riêng của nhóm này", `T-1` | phủ |

> **Ghi chú 1.9b.** Mục 0 đã chốt việc này ở `Q19` ("thống kê lý do thua là một khối trong màn
> hình tổng quan") nhưng PRD không mang sang, và cũng không trích `Q19` ở bất kỳ đâu. Hệ quả:
> `BR-B3` treo vào một màn hình không tồn tại trong phạm vi PRD.

### 1.2 `§4/nhóm 2` — Đọc nguồn và rút phát hiện (10 gạch)

| # | Gạch đầu dòng | Chỗ phủ trong PRD | Trạng thái |
|---|---|---|---|
| 2.1a | "Đọc… lưu thành **bản lưu**, giữ nguyên văn, kèm địa chỉ nguồn và thời điểm đọc. Mỗi bản lưu thuộc đúng một công ty" | `FR-11`, `BR-D3` | phủ |
| 2.1b | "…một công ty có nhiều bản lưu, **xếp theo thời điểm đọc**" | `FR-11` và §3 Từ vựng chỉ nói quan hệ 1–n, **không nói thứ tự** | phủ một phần |
| 2.2 | "Rút ra các **phát hiện**… câu nhận định, loại tin, câu trích nguyên văn, vị trí, mức chắc chắn; thuộc đúng một công ty; không gắn thẳng vào cơ hội/người liên hệ/hoạt động" | `FR-12` | phủ |
| 2.3 | "Bản lưu và phát hiện hiện ở **một khu riêng**… đây là **vùng đọc**" | `FR-14` | phủ |
| 2.4 | "**Cùng một loại tin mang nghĩa khác nhau tuỳ loại công ty**" | `FR-13` (`D35`) | phủ |
| 2.5 | "Việc sinh phát hiện **không làm thay đổi** hồ sơ, dòng thời gian hay cơ hội" | §4 "Ba chỗ chạm", `FR-14` gạch 1 | phủ |
| 2.6 | "**Không lưu được một phát hiện không có câu trích**" | `BR-D1`, `FR-12` gạch 1, `T-2` | phủ |
| 2.7 | "Bấm vào một phát hiện… mở đúng đoạn văn gốc, có đánh dấu" | `FR-15` (`T-3`) | phủ |
| 2.8 | "Ba mức chắc chắn phân biệt được **mà không cần đọc chữ**" | `FR-16` | phủ *(chặt hơn không nhãn — xem §3, mục N6)* |
| 2.9 | "Đọc lại cùng một nguồn không xoá phát hiện cũ" | `FR-17` | phủ |
| 2.10 | "Nguồn không đọc được thì ghi lại là không đọc được. Hệ thống không đoán" | `FR-11` gạch 4 | phủ |

### 1.3 `§4/nhóm 3` — Hàng đợi gợi ý (8 gạch)

| # | Gạch đầu dòng | Chỗ phủ trong PRD | Trạng thái |
|---|---|---|---|
| 3.1 | "Sinh **gợi ý** vào **hàng đợi chờ duyệt** của người sở hữu. Hai loại gợi ý" | `FR-18` | phủ |
| 3.2 | "Mỗi gợi ý hiện đủ **bốn thứ** tại chỗ" | `FR-19` | phủ |
| 3.3 | "Ba nút: Duyệt, Sửa rồi duyệt, Bỏ… số thao tác để bỏ không nhiều hơn để duyệt" | `FR-20` (`0.1.7`) | phủ |
| 3.4 | "**Không duyệt thì không có gì xảy ra**… không có chế độ tự duyệt" | `FR-21`, §11 (`T-4`) | phủ |
| 3.5 | "**Sửa rồi duyệt** được ghi lại là *sửa*, không ghi là *duyệt*" | `FR-22` (`T-5`) | phủ |
| 3.6 | "Mỗi gợi ý và mỗi lần quyết đều được lưu… **mất bao nhiêu giây**" | `FR-23` (`T-5`) | phủ |
| 3.7 | "Gợi ý đã bị bỏ không sinh lại với cùng nội dung, trừ khi có bản lưu mới" | `FR-24` (`D18`) | phủ |
| 3.8 | "Màn hình danh sách cơ hội và màn hình công ty hiện dấu hiệu 'đang có gợi ý chờ duyệt'" | `FR-25` | phủ |

### 1.4 `§4/nhóm 4` — Tự đặt Việc tiếp theo (9 gạch)

| # | Gạch đầu dòng | Chỗ phủ trong PRD | Trạng thái |
|---|---|---|---|
| 4.1 | "Phát hiện đáng chú ý… công ty **đang có ít nhất một cơ hội mở** → **tự điền**, ngay lập tức, không hỏi ai" | `FR-27`, `BR-D5` (`D4`, `D10`) | phủ |
| 4.2 | "Nội dung tự điền phải nhắc tới sự kiện… **kèm chính câu trích**" | `FR-28`, `BR-D8` | phủ |
| 4.3 | "**Ngày hạn phải phản ánh độ gấp**, không phải một con số cố định" | `FR-29`, `BR-D7`, bảng `0.2.1` | phủ |
| 4.4 | "Ô Việc tiếp theo do hệ thống đặt mang một **dấu hiệu phân biệt được**" | `FR-30` (`T-6`) | phủ |
| 4.5 | "Người sở hữu **được báo** ngay… thông báo không tự biến mất trước khi được xem" | `FR-31` (`T-6`) | phủ |
| 4.6 | "Nút **Hoàn tác**, **một cú bấm**… **trong 7 ngày**, cửa sổ hiện rõ, hết thì nút biến mất" | `FR-32` (`T-7`, `D13`, `D14`) | phủ |
| 4.7 | "**Ghi lại mọi lần hệ thống tự đặt**" | `FR-33` (`T-7`) | phủ |
| 4.8 | "**Ghi lại mọi lần hoàn tác**… tỉ lệ hoàn tác xem được ở màn hình Quản trị" | `FR-33` gạch 1, `FR-41` | phủ |
| 4.9 | "Không bao giờ tự đặt đè lên Việc tiếp theo do người nhập tay và **chưa tới hạn**" | `FR-34` (`D12`) — mang nhãn `làm chặt hơn` đúng cách | phủ |

### 1.5 `§4/nhóm 5` — Vòng quét (6 gạch)

| # | Gạch đầu dòng | Chỗ phủ trong PRD | Trạng thái |
|---|---|---|---|
| 5.1 | "Bật/tắt nhãn **Đang theo dõi**… bằng một thao tác. Có màn hình danh sách riêng" | `FR-35` | phủ *(bị mở rộng không nhãn — xem §3, mục N4)* |
| 5.2 | "Tự chạy một **vòng lặp khép kín**… tự thêm mục vào dòng thời gian, gắn nhãn 'do hệ thống thêm', kèm câu trích" | `FR-36` (`T-8`) | phủ |
| 5.3 | "**Vòng lặp không dừng lại chờ ai duyệt ở bất kỳ bước nào**" | `FR-36` gạch 1 | phủ |
| 5.4 | "**Chu kỳ vòng quét cấu hình được**, mặc định **60 giây**" | `FR-37` (`D20`) | phủ |
| 5.5 | "**Báo cáo định kỳ**… một dòng tổng kết mỗi vòng; mỗi 10 vòng một dòng cộng dồn" | `FR-39` (`T-8`) | phủ |
| 5.6 | "Sales vẫn xoá được một mục do hệ thống thêm, **như mọi mục khác**" | `FR-40` | phủ *(bị mở rộng không nhãn — xem §3, mục N5)* |

### 1.6 `§4/nhóm 6` — Bảng điều khiển Quản trị (5 gạch)

| # | Gạch đầu dòng | Chỗ phủ trong PRD | Trạng thái |
|---|---|---|---|
| 6.1 | "Một màn hình gom đủ các con số…" (7 nhóm số đo) | `FR-41` (`D29`) | phủ |
| 6.2 | "Chỉnh được từ đây: **chu kỳ vòng quét**… hiện đơn vị, mặc định, một câu giải thích. Đổi có hiệu lực ngay" | `FR-44` (`D38`) | phủ |
| 6.3 | "**Một nút tắt toàn bộ phần AI**… dữ liệu đã sinh **không bị xoá**" | `FR-45` (`T-9`) | phủ |
| 6.4 | "Khi phần AI đang tắt, **Sales nhìn thấy trạng thái đó**" | `FR-46` (`T-9`) | phủ |
| 6.5 | "Mỗi lần bấm tắt hoặc bật lại đều được ghi vết kèm thời điểm" | `FR-47` (`T-9`) | phủ |

### 1.7 `§5` — Bốn ranh giới (4 gạch)

| # | Ranh giới | Chỗ phủ trong PRD | Trạng thái |
|---|---|---|---|
| B1 | Không tự đổi giai đoạn | §10.1 dòng 1, §5.1 dòng cuối, §6 ma trận | phủ |
| B2 | Không tự đánh dấu Thắng/Thua, không tự sửa giá trị tiền | §10.1 dòng 2, §6 ma trận | phủ |
| B3 | Không tự liên hệ khách (nhưng **không** cấm gọi mạng) | §10.1 dòng 3 + khối cảnh báo bẫy, §6 dòng cuối | phủ |
| B4 | Không tự xoá dữ liệu do người tạo | §10.1 dòng 4 (`D25`) | phủ |
| B+ | "Ba ranh giới đầu phải chặn được kể cả khi thao tác đến từ **ngoài giao diện**" | §10.1 đoạn dưới bảng, `D25` `làm chặt hơn` mở lên cả bốn | phủ |

### 1.8 `§6` — Mười điểm nghiệm thu (10 gạch)

| `T` | Nội dung rút gọn | Chỗ phủ trong PRD | Trạng thái |
|---|---|---|---|
| `T-1` | Tắt AI, chạy trọn nhóm 1, kéo qua Đủ điều kiện bỏ hai ô | `FR-1`…`FR-10`, `FR-5`, §8.1 NFR riêng | phủ |
| `T-2` | Không lưu được phát hiện thiếu câu trích, ghi thẳng cũng bị từ chối | `BR-D1`, `FR-12` | phủ |
| `T-3` | Bấm phát hiện mở đúng đoạn, có đánh dấu | `FR-15` | phủ |
| `T-4` | Sinh gợi ý rồi không làm gì; sau ≥3 chu kỳ hồ sơ y nguyên | `FR-21` | phủ |
| `T-5` | Duyệt / sửa-rồi-duyệt / bỏ đều có bản ghi; *sửa* không cộng vào *duyệt* | `FR-22`, `FR-23` | phủ |
| `T-6` | **Đổi một công ty sang phiên bản trang web "sau"** → Việc tiếp theo tự đổi, có thông báo, có dấu hiệu | `FR-27`, `FR-30`, `FR-31` phủ **vế sau**. **Vế đầu — cơ chế đổi phiên bản — không có FR nào** | **KHÔNG PHỦ** (một phần điều kiện tiền đề) |
| `T-7` | Hoàn tác một cú bấm, có bản ghi hai chiều | `FR-32`, `FR-33` | phủ |
| `T-8` | Bật Đang theo dõi cho 3 công ty, **đổi nguồn của 2 công ty**, 2 mục mới trong 2 chu kỳ, có nhật ký | `FR-35`, `FR-36`, `FR-39` phủ vế sau; **vế "đổi nguồn" không có FR** | **KHÔNG PHỦ** (cùng nguyên nhân với `T-6`) |
| `T-9` | Tắt AI giữa vòng quét; 2 chu kỳ không thêm gì; dữ liệu còn; Sales thấy; bật lại có ghi vết | `FR-45`, `FR-46`, `FR-47` | phủ |
| `T-10` | Đổi giai đoạn / giá trị tiền / xoá công ty dưới danh nghĩa hệ thống — cả ba bị từ chối | §5.1 dòng cuối, §10.1, §6 ma trận | phủ |
| — | "Bộ kiểm thử tự động chạy được bằng **một lệnh**, phủ đủ 10 điểm" | `NFR-13` | phủ |

> **Ghi chú `T-6` / `T-8`.** Đề bài `§3` viết thẳng: *"Việc chuyển một công ty từ phiên bản 'trước'
> sang phiên bản 'sau' là cách kích hoạt mọi kịch bản AI, và phải làm được từ giao diện hoặc bằng
> một lệnh."* PRD nhắc tới bản chụp **ba lần** (`FR-11` gạch `D23`, §10.3, §12.2) nhưng **không có
> FR, BR hay NFR nào yêu cầu cơ chế chuyển phiên bản**. Đây là điều kiện tiền đề của hai điểm
> nghiệm thu, và cũng là thao tác đầu tiên giám khảo làm khi thử tay. Không có nó thì `T-6` và
> `T-8` không chạy được, dù mọi FR khác đã đủ.

### 1.9 `§7` — Năm điều kiện nộp bài (5 gạch)

| # | Điều kiện | Chỗ phủ trong PRD | Trạng thái |
|---|---|---|---|
| 7.1 | "**Mã nguồn trên GitLab của HBLAB**" | Không tìm được. Chuỗi `GitLab`, `mã nguồn`, `repo` không xuất hiện ở bất kỳ đâu trong PRD | **KHÔNG PHỦ** |
| 7.2 | "**Log của Claude Code chảy về Grafana**… tới buổi demo phải mở được bảng theo dõi" | Không tìm được. Chuỗi `Grafana` không xuất hiện. PRD chỉ chạm gián tiếp qua `SM-C3` (khối lượng log) và §12.3 (`D39`, log phải sinh lại trong ngày thi) — cả hai nói về *nội dung* log, không về *đường ống* và *bảng theo dõi*. `D37` — quyết định chốt riêng cho việc này — **không được PRD trích một lần nào** | **KHÔNG PHỦ** |
| 7.3 | "**Sản phẩm chạy ở cấu hình production**" — 5 gạch con | Bản dựng production → `NFR-11`; biến môi trường → `NFR-6`; dữ liệu bền sau restart → `NFR-5`; hai tài khoản đăng nhập thật → `NFR-12`; khởi động một lệnh + log xem được → `NFR-7` | phủ (5/5) |
| 7.4 | "**Bộ kiểm thử tự động**… một lệnh, kết quả in rõ ràng" | `NFR-13` | phủ |
| 7.5a | "**Nạp được bộ dữ liệu bằng một lệnh**… chạy lần nữa về đúng trạng thái ban đầu" | `NFR-8` (`D32`) | phủ |
| 7.5b | `D32` nói rõ hơn: về đúng trạng thái phát bài **kể cả ghi vết**, có **cờ giữ ghi vết** khi cần đối chiếu | `NFR-8` chỉ nói "về đúng trạng thái ban đầu, idempotent" — **bỏ mất phần ghi vết và cờ** | phủ một phần |

### 1.10 Tổng kết mục 1

| Nhóm | Số gạch duyệt | Phủ | Phủ một phần | KHÔNG PHỦ |
|---|---|---|---|---|
| `§4/nhóm 1` | 12 | 11 | 0 | 1 |
| `§4/nhóm 2` | 10 | 9 | 1 | 0 |
| `§4/nhóm 3` | 8 | 8 | 0 | 0 |
| `§4/nhóm 4` | 9 | 9 | 0 | 0 |
| `§4/nhóm 5` | 6 | 6 | 0 | 0 |
| `§4/nhóm 6` | 5 | 5 | 0 | 0 |
| `§5` | 4 (+1 điều khoản) | 5 | 0 | 0 |
| `§6` | 10 (+1 điều khoản) | 9 | 0 | 2 |
| `§7` | 5 | 4 | 1 | 2 |
| **Tổng** | **69** | **66** | **2** | **4** |

**Bốn gạch KHÔNG PHỦ:**

1. `§4/nhóm 1` — **bảng thống kê lý do thua** (nhắc ở `FR-8`/`BR-B3`, không FR nào định nghĩa)
2. `§6/T-6` + `T-8` (và `§3`) — **cơ chế chuyển bản chụp "trước" → "sau"** từ giao diện hoặc bằng
   một lệnh
3. `§7.1` — **mã nguồn trên GitLab của HBLAB**
4. `§7.2` — **log Claude Code chảy về Grafana**, bảng theo dõi mở được tới buổi demo (`D37`)

Mục 2 và 3 tính là **một** gạch không phủ ở bảng trên vì `T-6` và `T-8` cùng một nguyên nhân; tổng
đầu mục vẫn là 4 hạng mục riêng biệt cần sửa.

---

## 2. Mâu thuẫn với `D1`–`D41`

Ba chỗ. Trích cả hai bên.

### 2.1 `FR-18` và sơ đồ §4 gửi **mọi** phát hiện vào hàng đợi — trái `D3` / `0.1.6`

**PRD nói** (`FR-18`, dòng 378):

> "Khi có Phát hiện mới về một Công ty, hệ thống sinh Gợi ý vào Hàng đợi của người sở hữu."

và sơ đồ §4 (dòng 153):

> "├─ còn lại ───────────────────────────→ Hàng đợi gợi ý  ← chạm 2"

**Mục 0 nói** (`0.1.6`, bảng `relevance`, chốt bởi `D3`):

> | `medium` | liên quan gián tiếp | **chỉ vào hàng đợi gợi ý của nhóm 3** |
> | `low` | chỉ để biết | **chỉ nằm ở vùng đọc của nhóm 2** |

Phát hiện `relevance = low` — trong đó có toàn bộ `signal_subtype` `remote_team`, `event` và
`unclassified` — theo `D3` **không được sinh gợi ý**, chỉ nằm ở vùng đọc. PRD gộp chúng vào nhánh
"còn lại" và đẩy hết vào hàng đợi.

**Hệ quả.** Ngược đúng mục tiêu `D31` và `F13` (hàng đợi có thứ tự để giảm nhiễu) và làm phồng mẫu
số của `SM-3` / `SM-C1`. Nếu bộ dữ liệu BTC nhiều tin `other`, hàng đợi sẽ đầy rác `unclassified` —
đúng thứ `BR-B5` dựng ngưỡng để cảnh báo.

**Cách sửa gợi ý.** Thêm một gạch vào `FR-18`: *"Phát hiện `Độ liên quan = low` không sinh Gợi ý;
nó chỉ nằm ở vùng đọc (`FR-14`) theo `0.1.6`."* Và sửa nhánh sơ đồ §4 thành
`├─ độ liên quan medium ─→ Hàng đợi gợi ý`.

### 2.2 `NFR-1` biến điều `D19` nói là **không bảo đảm được** thành ngưỡng cứng

**PRD nói** (`NFR-1`, dòng 543):

> | `NFR-1` | Một Vòng quét phải kết thúc **trong** chu kỳ của nó | ≤ 60 giây ở chế độ demo | Cột thời lượng của Nhật ký vòng quét |

**Mục 0 nói** (`D19`, và `Q7` sinh ra nó):

> `D19`: "**Không chồng vòng**: vòng mới chỉ chạy khi vòng trước kết thúc. **Vòng bị bỏ vẫn ghi một
> dòng nhật ký kèm lý do.**"
>
> `Q7`: "`§4/nhóm 5` chu kỳ 60 giây, nhưng một vòng có gọi mô hình ngôn ngữ nên **có thể chạy lâu
> hơn 60 giây**." (`F18` cùng nội dung)

`D19` tồn tại **chính vì** một vòng có thể vượt 60 giây; cơ chế xử lý là bỏ vòng và ghi nhật ký,
không phải cấm vượt. `NFR-1` đặt "≤ 60 giây, 0 vi phạm" nghĩa là mỗi lần `D19` kích hoạt đường bỏ
vòng thì `NFR-1` bị đỏ. Trong PRD, `NFR-1` và `FR-38` (chép đúng `D19`) đứng cạnh nhau và nói
ngược nhau.

**Cách sửa gợi ý.** Đổi `NFR-1` thành số đo có dung sai — ví dụ *"≥ 90% số vòng kết thúc trong chu
kỳ; vòng vượt chu kỳ đi đường `FR-38` và ghi nhật ký kèm lý do"* — hoặc bỏ hẳn và để `FR-38` gánh.
Đề bài `§4/nhóm 5` **không** đòi ngưỡng này, nên `NFR-1` ở dạng hiện tại còn là một chỗ
`mở rộng ngoài đề bài` không nhãn (xem §3, mục N3).

### 2.3 §10.2 sắp lại ba mức quyền ghi khác `D16`

**PRD nói** (§10.2, dòng 586–590):

> | **Tự do** | Thêm mục Dòng thời gian (nhóm 5) · **điền ô Việc tiếp theo đang trống** (nhóm 4) |
> | **Xác nhận đơn** | Điền ô **hồ sơ** đang trống |

**Mục 0 nói** (`D16`):

> "Ba mức quyền ghi — *tự do* (thêm mục dòng thời gian, **ghi trường chỉ-AI**) · *xác nhận đơn*
> (**điền ô đang trống**, một cú bấm) · *xác nhận kỹ* (ghi đè ô đã có giá trị…)"

Hai lệch:

- `D16` xếp **mọi** "ô đang trống" vào *xác nhận đơn*; PRD tách ô Việc tiếp theo ra và đưa lên
  *tự do*.
- PRD **bỏ mất** vế "ghi trường chỉ-AI" khỏi mức *tự do*, không nói vì sao.

**Đánh giá.** Lệch thứ nhất là **PRD đúng và `D16` sai** theo quy tắc thẩm quyền: `§4/nhóm 4` của
đề bài nói thẳng *"hệ thống tự điền Việc tiếp theo và ngày hạn cho cơ hội đó, ngay lập tức, không
hỏi ai"*, mà đề bài thắng Mục 0. Nhưng PRD im lặng thay vì ghi rõ đây là chỗ nó đọc khác `D16` —
để nguyên thì bước Kiến trúc đọc `D16` sẽ cài sai. Lệch thứ hai là mất mát thuần tuý.

**Cách sửa gợi ý.** Thêm một dòng dưới bảng §10.2: *"Chỗ này đọc khác `D16`: `D16` xếp mọi ô đang
trống vào xác nhận đơn, nhưng `§4/nhóm 4` (hạng 1) bắt tự điền ô Việc tiếp theo không hỏi ai. Cần
sửa `D16` ngược vào Mục 0."* Bổ sung việc này vào §14 câu hỏi còn mở, cạnh việc bổ sung trường
*Giai đoạn mở gần nhất*.

---

## 3. Nhãn còn thiếu

PRD đã gắn nhãn đúng ở **bốn** chỗ: §5.1/§5.2/`A5` (mở lại cơ hội đã đóng — `làm chặt hơn`),
`FR-26` (`mở rộng ngoài đề bài`), `FR-34` (`làm chặt hơn`), §10.1 (`D25` `làm chặt hơn`). Bảy chỗ
dưới đây cùng tính chất nhưng **không mang nhãn nào**.

### N1 — §5.1: `tam_dung` chỉ quay về **đúng** Giai đoạn mở gần nhất

**PRD** (§5.1 dòng 4, và `FR-4` gạch 2):

> | `tam_dung` | **Đúng** Giai đoạn mở gần nhất | **Chỉ về đúng giá trị đã lưu, không cho chọn giai đoạn khác** |
>
> "Chuyển tiếp không có trong §5.1 bị từ chối — kể cả `tam_dung` sang một giai đoạn đang mở tuỳ chọn"

**Đề bài** (`§4/nhóm 1`): *"Người dùng đổi giai đoạn bằng **kéo thả**… **Đi lùi và nhảy cóc đều
được, hệ thống không chặn**."* `0.1.2` xếp `tam_dung` là **đang mở**, nên đây là một chuyển tiếp
giữa hai giai đoạn đang mở mà đề bài nói không chặn.

**Nhãn phải có:** `làm chặt hơn`.
**Rủi ro nghiệm thu:** `T-1` chỉ đòi *"kéo cơ hội qua ba giai đoạn, trong đó có Đủ điều kiện"* —
không nêu `tam_dung`, nên rủi ro **thấp nhưng không bằng không**: nếu bộ kiểm thử tự viết chọn
`Tiếp cận → Tạm dừng → Soạn đề xuất` làm chuỗi ba giai đoạn thì `T-1` đỏ. Rủi ro thật hơn nằm ở
phần **thử tay của giám khảo**, thứ `§6` nói rõ là có: một thao tác kéo thả bị hệ thống chặn trong
khi đề bài viết "hệ thống không chặn" là điểm trừ trực tiếp.

### N2 — §5.1: "Mọi chuyển tiếp không có trong bảng đều không được phép"

**PRD** (dòng 183–184):

> "Mọi chuyển tiếp không có trong bảng đều **không được phép**. Đáng chú ý: `tam_dung` không đi
> thẳng sang một giai đoạn đang mở tuỳ chọn, và **`thang` không đi thẳng sang `thua`**."

**Đề bài** không có bảng chuyển tiếp và không cấm chuyển tiếp nào. Toàn bộ §5.1 là
`mở rộng ngoài đề bài` — PRD tự nhận điều đó ở §0 ("`§5` — cả đề bài lẫn hệ thống thật đều chỉ
liệt kê trạng thái") nhưng chỉ gắn nhãn cho **một** dòng (mở lại cơ hội đã đóng), để trống nhãn cho
chính sách đóng "mọi thứ khác đều cấm".

**Nhãn phải có:** `mở rộng ngoài đề bài` cho §5.1 nói chung, `làm chặt hơn` cho câu "mọi chuyển
tiếp không có trong bảng đều không được phép".
**Rủi ro nghiệm thu:** không điểm `T` nào kiểm; rủi ro nằm ở thử tay, cùng dạng N1.

### N3 — `NFR-1`: ngưỡng "vòng quét ≤ 60 giây"

Đề bài `§4/nhóm 5` chỉ đòi **chu kỳ** cấu hình được mặc định 60 giây, không đòi **thời lượng** một
vòng. `NFR-1` thêm một ngưỡng mới.
**Nhãn phải có:** `mở rộng ngoài đề bài`.
**Rủi ro nghiệm thu:** không có điểm `T` nào; nhưng mâu thuẫn `D19` — xem §2.2. Đây là chỗ duy nhất
trong bảy chỗ mà nhãn thiếu **và** nội dung sai.

### N4 — `FR-35`: ô bắt buộc "vì sao theo dõi công ty này"

**PRD** (`FR-35` gạch 1):

> "Kèm ô **'vì sao theo dõi công ty này'** khi bật nhãn — vá một phần `F29`, bước screening Keep /
> Hold / Drop mà playbook đòi nhưng đề bài không có"

**Đề bài** (`§4/nhóm 5`): *"Bật/tắt nhãn **Đang theo dõi** trên một công ty **bằng một thao tác**."*

PRD tự thừa nhận "đề bài không có" ngay trong câu, nhưng không gắn nhãn.
**Nhãn phải có:** `mở rộng ngoài đề bài`, và nếu ô là bắt buộc thì thêm `làm chặt hơn`.
**Rủi ro nghiệm thu: CÓ THẬT.** `T-8` mở đầu bằng *"Bật Đang theo dõi cho ba công ty"*. Nếu bật
nhãn mở ra một hộp thoại bắt điền lý do thì (a) không còn là "một thao tác" như đề bài đòi, và (b)
bộ kiểm thử tự động phải biết điền ô đó. Đây là rủi ro nghiệm thu **cao hơn** cả chỗ PRD đã gắn
nhãn ở §5.2 (nơi rủi ro được ghi đúng là "không"). **Khuyến nghị: để ô ở dạng tuỳ chọn**, ghi rõ
"không chặn thao tác bật nhãn".

### N5 — `FR-40`: hỏi lý do khi Sales xoá mục do hệ thống thêm

**PRD** (`FR-40` gạch 1):

> "Xoá dùng **xoá mềm** để mục đó vẫn còn làm dữ liệu đo, và **hỏi một lý do ngắn**"

**Đề bài** (`§4/nhóm 5`): *"Sales vẫn xoá được một mục do hệ thống thêm, **như mọi mục khác trên
dòng thời gian**."* Thêm một bước hỏi lý do làm thao tác này **khác** mọi mục khác — đúng cái đề
bài nói là giống.

`D30` có chốt việc này, nên nội dung hợp lệ; chỉ thiếu nhãn.
**Nhãn phải có:** `làm chặt hơn`.
**Rủi ro nghiệm thu:** không điểm `T` nào kiểm việc xoá mục dòng thời gian. Rủi ro là thử tay và
tính nhất quán của lời hứa "như mọi mục khác".

### N6 — `FR-16`: "ký hiệu **và** màu"

**PRD** (`FR-16`): *"Ba mức phân biệt không cần đọc chữ — bằng **ký hiệu và màu**, không dùng màu
đơn độc (`D24`)"*
**Đề bài** (`§4/nhóm 2`): *"bằng ký hiệu **hoặc** màu, không chỉ bằng nhãn"* — một trong hai là đủ.

`D24` đã mang nhãn `làm chặt hơn` ở Mục 0; PRD chép nội dung mà bỏ nhãn.
**Nhãn phải có:** `làm chặt hơn`. **Rủi ro nghiệm thu:** không (`T` không kiểm hiển thị mức chắc
chắn); chặt hơn theo cùng hướng đề bài.

### N7 — `BR-D2` / `BR-D10`: loại bỏ phát hiện khi câu trích không khớp, và ép enum

**PRD** (`BR-D2`, `BR-D10`, `FR-12` gạch 2): loại bỏ phát hiện nếu câu trích không khớp nguyên văn;
mọi enum bắt mô hình chọn trong danh sách cho sẵn.
**Đề bài** (`§4/nhóm 2`) chỉ đòi *"không lưu được một phát hiện không có câu trích"* — không đòi
khớp nguyên văn, không đòi ép enum.

`D22` mang nhãn `làm chặt hơn` ở Mục 0 kèm ghi chú *"chặt hơn `T-2` theo cùng hướng"*; PRD chép nội
dung, bỏ nhãn và bỏ luôn dòng rủi ro.
**Nhãn phải có:** `làm chặt hơn`. **Rủi ro nghiệm thu:** không.

### N8 (mức nhẹ) — trường **Giai đoạn mở gần nhất**

PRD §3 và §5.3 giới thiệu một **trường mới** không có trong đề bài lẫn Mục 0. PRD xử lý minh bạch —
gọi đúng tên "Trường mới", và §5.3 + §14.4 ghi việc phải bổ sung ngược vào Mục 0 — nhưng vẫn không
dùng nhãn `mở rộng ngoài đề bài`, trong khi §5.2 ngay cạnh đó thì có. Nhất quán thì nên gắn.
**Rủi ro nghiệm thu:** không.

---

## 4. Trích dẫn hỏng

**Kết quả tổng.** 39 mã `Dn`, 5 mã `Qn`, 21 mã `Fn`, 10 mã `T-n` và toàn bộ mã `§n` / `0.x.y` mà
PRD nhắc đều **tồn tại thật** trong tài liệu nguồn. Không có mã bịa. Hai chỗ **nội dung sai**, và
hai chỗ đáng ghi nhận là **thiếu trích dẫn** chứ không phải trích sai.

| # | Vị trí trong PRD | Trích dẫn | Tồn tại? | Đúng nội dung? | Vấn đề |
|---|---|---|---|---|---|
| C1 | §10, dòng 578–580 | `§5.3` — gán cho câu *"gọi ra dịch vụ bên ngoài thì thoải mái, kể cả mô hình ngôn ngữ"* | có | **không** | Câu trích nguyên văn đó nằm ở **`§3`** của đề bài (dòng 54), không ở `§5.3`. `§5.3` chỉ viết *"gọi ra dịch vụ bên ngoài để chạy phần AI là bình thường"* — cùng ý, khác chữ. PRD đóng khung câu này bằng dấu ngoặc kép nghiêng nên nó đang tự nhận là trích nguyên văn. Sửa: đổi thành `§3`, hoặc trích đúng câu của `§5.3` |
| C2 | §3, khối "Cảnh báo từ vựng", dòng 125–126 | *"`D1` và `F37` đã xử"* | có | **không** (sai vai) | `F37` là **mâu thuẫn**, không phải quyết định. Bảng `0.5` ghi `F37` — "`§3` và `§4/nhóm 2` dùng hai bộ nhãn cho cùng sáu loại tin" — *giải bằng* `D1`. Viết "`D1` và `F37` đã xử" khiến một mã lỗi thành mã giải pháp; quy ước định danh của nguồn phân biệt rõ hai loại. Sửa: *"`D1` đã xử `F37`"* |
| C3 | `NFR-13`, §12.1 | Không trích `D36` | — | — | **Thiếu trích, không phải trích sai.** `D36` là quyết định chốt riêng về bộ nghiệm thu, mang nhãn `làm chặt hơn`, và sửa **ba** điểm `T`: `T-4` thêm `Given công ty đang bật Đang theo dõi`; `T-6` và `T-8` đổi từ khẳng định con số sang khẳng định quan hệ. PRD viết `NFR-13` là "phủ `T-1`…`T-10`" trơn, nên bước viết kiểm thử sẽ dựng lại `T-4`/`T-6`/`T-8` ở dạng chưa sửa — đúng lỗ hổng `F3` và `F5` mà `D36` dựng ra để bịt |
| C4 | §9 (bảng NFR), §12.3 | Không trích `D37` | — | — | **Thiếu trích.** `D37` là quyết định duy nhất về đường ống log Claude Code → Grafana, và Mục 0 xếp nó là *"điều kiện tiên quyết của vòng 1"*. Đây chính là gạch `§7.2` không phủ ở mục 1.9 |
| C5 | `NFR-8` | `D32` | có | đúng nhưng **thiếu vế** | `D32` gồm ba vế: về đúng trạng thái phát bài **kể cả ghi vết** · **cờ giữ ghi vết** khi cần đối chiếu · báo cáo đối soát. `NFR-8` chỉ mang vế thứ ba và vế "idempotent". Hai vế đầu rơi mất — liên quan trực tiếp tới `Q17` |
| C6 | `FR-2` so với `BR-D4` và §3 | (nội bộ PRD) | — | **không nhất quán** | `FR-2` viết *"Đánh dấu được **đúng một** Đầu mối chính (`BR-D4`)"*, nhưng `BR-D4` và §3 Từ vựng đều viết *"**tối đa một**"*. Đề bài `§4/nhóm 1` viết *"đánh dấu được đúng một người"* theo nghĩa "chỉ được một, không nhiều". Hai cách viết trong cùng PRD sẽ thành hai ràng buộc khác nhau trong mã: `= 1` (bắt buộc phải có) so với `≤ 1` (được để trống). Chốt một cách — đề nghị `≤ 1`, vì `FR-1` cho phép tạo công ty chưa có người liên hệ nào |

**Đối chiếu số đếm nguồn** — PRD nói đúng ở cả ba chỗ kiểm được:

- §14.1 + §14.5: 1 câu chặn (`Q15`) và 4 câu nên hỏi không chặn (`Q6`, `Q10`, `Q12`, `Q16`) —
  khớp `0.4` ✅
- §12.1: "47 FR" — đếm được `FR-1`…`FR-47`, không trùng, không nhảy số ✅
- §12.1: "sáu Loại tin (`0.1.4`) cộng 13 `signal_subtype`" — khớp `0.1.4` (6 dòng) và `0.1.5`
  (13 dòng) ✅
- Hai liên kết tệp ở §0 và §14.3 (`brief.md`, `cau-hoi-dong-doi.md`) đều tồn tại ✅

---

## 5. Việc phải làm, xếp theo mức chặn

| Ưu tiên | Việc | Ở đâu |
|---|---|---|
| **1** | Thêm FR cho **cơ chế chuyển bản chụp "trước" → "sau"** (giao diện hoặc một lệnh) — không có nó thì `T-6` và `T-8` không chạy được | §8.2 hoặc §8.5 |
| **2** | Thêm NFR cho `§7.1` (GitLab) và `§7.2` (log Claude Code → Grafana, trích `D37`) | §9 |
| **3** | Bỏ ô bắt buộc "vì sao theo dõi" ở `FR-35` hoặc đổi thành tuỳ chọn — rủi ro `T-8` | `FR-35` |
| **4** | Sửa `FR-18` + sơ đồ §4: phát hiện `low` không vào hàng đợi (`D3`/`0.1.6`) | §4, `FR-18` |
| **5** | Sửa `NFR-1` thành ngưỡng có dung sai, hoặc bỏ — mâu thuẫn `D19` | §9 |
| **6** | Định nghĩa **bảng thống kê lý do thua** (`Q19` đã chốt: một khối trong màn hình tổng quan) | `FR-10` |
| **7** | Gắn 7 nhãn còn thiếu (N1–N7) kèm dòng rủi ro nghiệm thu | §5.1, §8.2, §8.5, §9 |
| **8** | Sửa hai trích dẫn hỏng (C1, C2); trích `D36` vào `NFR-13`; bổ sung vế ghi vết của `D32` vào `NFR-8`; chốt `= 1` hay `≤ 1` cho Đầu mối chính | rải |
| **9** | Ghi rõ chỗ PRD đọc khác `D16` (§10.2), cạnh việc bổ sung trường *Giai đoạn mở gần nhất* ngược vào Mục 0 | §10.2, §14 |
| **10** | `FR-11`: nói rõ Bản lưu **xếp theo thời điểm đọc** | `FR-11` |
