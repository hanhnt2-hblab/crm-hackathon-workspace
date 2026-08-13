---
title: "Soát hồi quy — PRD Why Now sau bảy lượt sửa"
target: prd.md
created: 2026-08-14
kind: review
---

# Soát hồi quy PRD

Sáu phép soát, chạy trên bản `prd.md` hiện tại (966 dòng). Mọi con số dưới đây được **đếm bằng
máy trên chính tệp**, không lấy lại từ bốn bản phản biện trước. Số dòng trích dẫn là số dòng thật
của `prd.md` tại thời điểm soát.

Kết quả gọn: **không phép nào sạch hoàn toàn**, nhưng hai phép nặng nhất về số học — số FR và bảng
tra §8.7 — thì sạch. Chỗ hỏng tập trung ở tiền tố tham chiếu ra đề bài (32 chỗ), ở nhãn ưu tiên
(4 FR sai theo chính quy tắc PRD tự công bố), và ở chín cặp phát biểu ngược nhau.

---

## 1 · Con số tự mâu thuẫn

### Đã đếm và **khớp** (không sửa gì)

| Con số tài liệu tự khai | Ở đâu | Đếm thật |
|---|---|---|
| 50 FR | §8.7, §12.1 | 50 khối `**FR-n ·**`, số hiệu 1–50 đủ, không trùng, không nhảy |
| 32 `phải có` · 17 `nên có` · 1 `bỏ được` | §8 đầu mục, §8.7, §12.1, §12.5 | 32 · 17 · 1 — **danh sách mã ở §8.7 khớp từng phần tử** với nhãn thật trên từng FR |
| 25 hành động ở ma trận §6 | dòng 341 | 25 dòng |
| 4 dòng in đậm ở §6 | dòng 341, `A4` | 4 dòng |
| 11 luật định nghĩa · 6 luật hành vi | §7 dòng 349 | `BR-D1`…`BR-D11` · `BR-B1`…`BR-B6` |
| 3 ngoại lệ non-functional trong §7 | dòng 350–351 | `BR-D6`, `BR-B5`, `BR-B6` |
| 3 chỗ chặt hơn ở §5.2 | dòng 290 | 3 dòng bảng *(xem 1.3)* |
| 3 chạm · 3 nhánh ngoại lệ ở §4.2 | dòng 193, 213 | 3 · 3 |
| 3 trần lưu giữ ở §4.3 | dòng 260 | 3 dòng bảng |
| 4 ranh giới §10.1 · 3 mức quyền ghi §10.2 | — | 4 · 3 |
| 7 Giai đoạn · 5 *Đang mở* · 4 *Đang chạy* | §3.1 | đếm đúng cả ba |
| 13 `signal_subtype` (và "12 giá trị kia") | §3.2 | 13 giá trị liệt kê đủ |
| 6 Loại tin · 3 Mức chắc chắn · 3 Độ liên quan · 5 `ly_do_bo` | §3.1, §3.2, FR-20 | nhất quán ở mọi chỗ nhắc lại |
| 5 vai còn lại · 7 vai hệ thống thật | §2.2, TR-2 | 5 · (5+2)=7 |
| 5 điều kiện nộp bài = 3 trong PRD + 2 ngoài | §12.4 | 3+2=5 |

13 `NFR` và 5 `TR` cũng đúng số dòng bảng; tài liệu không tự khai hai con số này ở đâu nên không
có gì để đối chiếu.

### Chỗ hỏng

**1.1 · §4.3 khai "ba nhánh" nhưng có bốn.** Tiêu đề dòng 226 viết *"Luồng dữ liệu — **ba nhánh**
và một luật lưu giữ"*, dòng 228–229 viết *"nó trả lời **ba câu**"*. Thân mục có **bốn** nhánh in
đậm: **Nhánh nạp** (231) · **Nhánh đọc** (235) · **Nhánh ra biên** (238) · **Nhánh xoá** (243).
"Nhánh ngoại lệ" ở dòng 213 thuộc §4.2 nên không tính vào đây.

*Sửa:* đổi tiêu đề thành "bốn nhánh và một luật lưu giữ" và câu dẫn thành "bốn câu" — hoặc gộp
*Nhánh xoá* vào phần *Luật lưu giữ* nếu chủ ý ban đầu là ba.

**1.2 · §8.7 nói sai vị trí `FR-50`.** Dòng 722 viết *"`FR-50` nằm **đầu** §8.2"*. Thực tế `FR-11`
mở đầu §8.2 ở dòng 486 và `FR-50` đứng sau nó ở dòng 497. Dòng 732 cũng liệt kê `§8.2 FR-50,
FR-11–FR-17` theo thứ tự ngược với thứ tự thật.

*Sửa:* hoặc chuyển khối `FR-50` lên trước `FR-11` cho khớp lời khai, hoặc sửa hai câu thành
"`FR-50` nằm giữa `FR-11` và `FR-12`" và đổi thứ tự liệt kê ở dòng 732.

**1.3 · ⚠ "ba chỗ chặt hơn" ở §5.2 đếm theo tiêu chí không nhất quán.** Dòng thứ ba của bảng
("Mọi chuyển tiếp ngoài bảng đều bị từ chối") được tính là *chặt hơn* dù lý do ghi rõ là *"Đề bài
không nói gì về chuyển tiếp ngoài danh sách"* — tức đề bài **im lặng**, không phải nói ngược. Theo
đúng tiêu chí đó thì dòng đầu bảng §5.1 (dòng 274: *"Cơ hội mới luôn bắt đầu ở `tiep_can`; người
tạo **không chọn được** giai đoạn khác"*) là chỗ thứ tư — nó cũng siết một thứ đề bài để trống, và
`FR-3` (dòng 429–431) tự dán nhãn `mở rộng ngoài đề bài` cho đúng câu ấy.

*Sửa:* chọn một trong hai — thêm dòng thứ tư vào §5.2 và đổi "ba" thành "bốn", hoặc viết rõ ở đầu
§5.2 rằng chỉ đếm những chỗ đi ngược một câu **đề bài viết ra**, và khi đó phải bỏ dòng thứ ba.

---

## 2 · Trích dẫn chéo nội bộ

**Không có mã treo.** Đã dò toàn bộ `FR-n` (127 lần nhắc), `NFR-n` (34), `TR-n` (14), `BR-Dn`,
`BR-Bn`, `SM-n` (20), `SM-Cn`, `BUS-n` (4), `UJ-n` (11), `An`, `T-n`: mọi mã được trích đều tồn
tại, không mã nào trùng số, không dãy nào nhảy số. `FR-48`…`FR-50` không tuần tự theo mục nhưng
§8.7 đã khai điều đó, nên không tính là lỗi. Mọi `§n.n` **nội bộ** đều trỏ tới mục có thật.

### Chỗ hỏng

**2.1 · `SM-C1` bị trích sai chỗ (§13.1, dòng 917–918).** Câu đang nói về việc **bơm tử số của
`SM-1`** bằng cách tính cả Gợi ý được duyệt, rồi kết: *"và `SM-C1` dựng ra để chống đúng việc
đó"*. Nhưng §13.3 định nghĩa `SM-C1` là **đối trọng của `SM-3`** (thời gian quyết). Hai số đo dựng
ra để chống việc bơm `SM-1` là `SM-C2` (số Phát hiện sinh mỗi vòng) và `SM-C5` (tỉ lệ bật Đang
theo dõi).

*Sửa:* đổi `SM-C1` thành `SM-C2` — hoặc `SM-C2` và `SM-C5` nếu muốn nhắc cả hai.

**2.2 · §13.3 xếp `SM-C5` trước `SM-C4`** (dòng 937 và 940). Đây là mục duy nhất trong tài liệu có
mã chạy ngược, và nó nằm ngay cạnh bốn mã xếp đúng.

*Sửa:* đổi chỗ hai gạch đầu dòng.

**2.3 · §15 ghi sai chỗ đứng của `A5`.** Bảng giả định (dòng 965) ghi *Ở đâu: §5.2*, nhưng dấu
`[ASSUMPTION: A5]` nằm ở **§5.1 dòng 281**; §5.2 chỉ nhắc nội dung mà không mang mã. `A2` cũng ghi
"§5.1, §5.3" trong khi §5.3 không mang dấu.

*Sửa:* ghi "§5.1, §5.2" cho `A5`, hoặc gắn `[ASSUMPTION: A5]` vào dòng đầu bảng §5.2.

**2.4 · Ghi chú định dạng (không phải lỗi trỏ).** Mã được viết lúc trong backtick lúc không:
`FR-18` trần ở dòng 203, `FR-43` ở 573, `FR-44` ở 438, `FR-40` ở 696, `FR-27`/`FR-32`/`FR-42` ở
§13.2. Bước sau nếu tra mã bằng grep trên chuỗi có backtick sẽ trượt những chỗ này.

---

## 3 · Tham chiếu ra ngoài

Quy ước: mọi tham chiếu tới đề bài phải mang tiền tố `đề bài`. **Đếm được 32 chỗ vi phạm**, chia
ba nhóm theo mức nguy hiểm. Cộng thêm một chỗ gán sai nguồn.

### 3A · Va chạm thật — PRD có mục trùng số, đọc nhầm được ngay (13 chỗ)

| Dòng | Viết là | Thật ra là | PRD cũng có mục đó | Sửa |
|---|---|---|---|---|
| 282 | `` `§5.1`, `§5.2` `` | đề bài §5 ranh giới 1 và 2 | §5.1 là **chính bảng chứa dòng này**, §5.2 là ba chỗ chặt hơn | `đề bài §5.1`, `đề bài §5.2` |
| 400 | `` `§7` đòi nó `` | đề bài §7 — điều kiện nộp bài | §7 là *Luật nghiệp vụ* | `đề bài §7` |
| 896 | `` bỏ sót `§7` `` | như trên | như trên | `đề bài §7` |
| 83 | `` `§5.3` cấm sản phẩm chạm tới người thật `` | đề bài §5 ranh giới 3 | §5.3 là *Trường mới* | `đề bài §5.3` |
| 796 | `` `§5.3` cấm **chạm tới người thật** `` | như trên | như trên | `đề bài §5.3` |
| 831 | `` `§5.3` cấm gửi bất cứ thứ gì ra ngoài `` | như trên | như trên | `đề bài §5.3` — và xem 4.6 |
| 893 | `` `§7.1` Mã nguồn trên GitLab `` | đề bài §7 mục 1 | §7.1 là *Luật định nghĩa* | `đề bài §7.1` |
| 894 | `` `§7.2` Log Claude Code `` | đề bài §7 mục 2 | §7.2 là *Luật hành vi* | `đề bài §7.2` |
| 748, 750, 754 | `` (`§7.3`) `` | đề bài §7 mục 3 | PRD **không có** §7.3 → trông như mã treo | `đề bài §7.3` |
| 392, 859, 867 | `` `§4` `` | đề bài §4 — sáu nhóm tính năng | §4 là *Quy trình đầu-cuối* | `đề bài §4` |
| 780, 793, 860 | `` `§5` `` | đề bài §5 — bốn ranh giới | §5 là *Vòng đời Cơ hội* | `đề bài §5` |

Hai chỗ đáng lo nhất:

- **Dòng 282** nằm *bên trong bảng §5.1* và trích `§5.1` để chỉ đề bài. Người đọc gặp câu này gần
  như chắc chắn hiểu là tự trích chính bảng đang đọc.
- **Dòng 400** là **câu định nghĩa nhãn `phải có`** — toàn bộ phép soát 6 dưới đây đứng trên nó.
  Đọc `§7` thành §7 của PRD (Luật nghiệp vụ) làm quy tắc ưu tiên đổi nghĩa hoàn toàn. Trớ trêu là
  **dòng 401 ngay dưới** lại viết đúng "Đề bài `§4`".

### 3B · Thiếu tiền tố, ít va chạm hơn — dạng `§4/nhóm n` (17 chỗ)

Dòng **69** · **144** · **145** · **222** · **327** · **358** · **360** · **361** · **597** ·
**632** · **965**, cộng sáu tiêu đề mục **413** (§8.1) · **480** (§8.2) · **534** (§8.3) ·
**587** (§8.4) · **639** (§8.5) · **681** (§8.6).

Không lẫn được với mục nào của PRD, nhưng không nhất quán **ngay trong cùng một bảng**:

- Bảng §7.1: dòng 358, 360, 361 viết trần `§4/nhóm 2`, `§4/nhóm 1`; dòng **368** trong cùng bảng
  viết đủ "đề bài `§4/nhóm 1`".
- Bảng nhãn ưu tiên §8: dòng 400 trần `§7`; dòng **401** viết đủ "Đề bài `§4`".

*Sửa:* thêm tiền tố cho cả 17 chỗ. Với sáu tiêu đề mục, cách rẻ nhất là đổi một lần thành
`### 8.1 CRM làm tay — đề bài §4/nhóm 1`.

### 3C · Gán sai nguồn (1 chỗ, đã đối chiếu Mục 0)

**§14 mục 1, dòng 945–946:** *"`Q15` … Giảm thiểu bằng **`D32`**: một lớp ánh xạ mỏng tách
riêng"*. Sai. Trong `Phản biện và phân tích yêu cầu.md`, `D32` là quyết định về **lệnh nạp dữ
liệu**: *"đưa hệ thống về đúng trạng thái phát bài, kể cả ghi vết, có cờ giữ ghi vết khi cần đối
chiếu, và in một báo cáo đối soát"* — đúng thứ PRD đã dùng cho `TR-3` và `TR-4` (dòng 771–772).
Lớp ánh xạ mỏng là **`TR-1`**, và §4.3 (dòng 231–233) cùng §9.2 (dòng 769, 775) đều gọi đúng tên
nó, không mang mã `D` nào.

*Sửa:* dòng 946 → "Giảm thiểu bằng **`TR-1`**: một lớp ánh xạ mỏng tách riêng". Nếu muốn giữ mã
`D`, phải kiểm lại xem Mục 0 có quyết định nào khác cho lớp ánh xạ không — hiện thì không có.

### 3D · Ghi chú

Các mã `0.1.x` / `0.2.x` (Mục 0 của bản phản biện) đứng trần khắp tài liệu. Chúng không thuộc phạm
vi quy ước `đề bài`, nhưng PRD **cũng có một §0**, nên `0.1.1` có thể bị đọc thành mục con của
§0 PRD. Một câu ở §0 nói rõ "mọi mã dạng `0.x.y` trỏ tới Mục 0 của bản phản biện" là đủ.

---

## 4 · Mâu thuẫn nội dung

Chín cặp. Bốn cặp đầu là mâu thuẫn thật về hành vi hệ thống; năm cặp sau nhẹ hơn nhưng vẫn khiến
hai người đọc rút ra hai kết luận khác nhau.

**4.1 · §4.2 sơ đồ ⟷ §8.3 `FR-18` — Phát hiện `high` không đi tới đâu.**
Sơ đồ (dòng 198–203) chia ba đường: *đáng chú ý + Công ty có Cơ hội mở* → chạm 1 · *liên quan
`medium`* → Hàng đợi gợi ý · *liên quan `low`* → chỉ vùng đọc. `FR-18` (dòng 539–541) thì viết
*"Khi có Phát hiện mới về một Công ty, hệ thống sinh Gợi ý"*, chỉ loại trừ `low`.

Hai trường hợp rơi vào khe hở của sơ đồ mà `FR-18` lại bảo phải sinh Gợi ý:

- `high` + `doan` — không phải *Phát hiện đáng chú ý* (`BR-D5` đòi `chac`/`co_the`), cũng không
  phải `medium`;
- `high` + `chac` ở Công ty **không có Cơ hội đang chạy** — chạm 1 không nhận.

*Sửa:* nhánh 2 của sơ đồ đổi thành *"liên quan `medium`, **hoặc** `high` không đi được chạm 1"*.

**4.2 · §6 ma trận ⟷ §9.1 `NFR-3` — ai được tắt phần AI.**
§6 dòng 338: hành động *"Tắt/bật toàn bộ phần AI"* — cột Hệ thống là **❌**. `NFR-3` dòng 746:
*"Chạm 100% thì **phần AI tự tắt** như khi bấm phanh `FR-45`"*. Đó chính là hệ thống thực hiện
hành động §6 cấm nó thực hiện.

*Sửa:* thêm ghi chú vào ô đó ở §6 — "❌ trừ một đường: `NFR-3` chạm trần ngân sách" — hoặc đổi lời
`NFR-3` thành "ngừng sinh và hiện đúng dòng báo của `FR-46`", tránh chữ "tự tắt như bấm phanh".

**4.3 · §5.1 ⟷ §6 — ma trận thiếu hai hành động vòng đời.**
§5.1 coi *đang chạy → `tam_dung`* và *`tam_dung` → Giai đoạn mở gần nhất* là hai chuyển tiếp riêng,
và §5.2 dành hẳn một dòng cho luật quay về. Ma trận §6 chỉ có *"Đổi Giai đoạn giữa các giai đoạn
**đang chạy**"* (dòng 319), *"Đóng Cơ hội"* (320) và *"Mở lại Cơ hội đã đóng"* (321). Không dòng
nào phủ Tạm dừng. Vì thế câu *"trên toàn bộ 25 hành động ở bảng"* (dòng 341) đang khai một tập
thiếu.

*Sửa:* thêm một dòng *"Chuyển Cơ hội sang `tam_dung` và đưa nó quay lại | ✅ | ✅ | ❌"*, cập nhật
25 → 26 ở dòng 341.

**4.4 · §5.1 ⟷ §3.2 và §5.3 — `giai_doan_mo_gan_nhat` bị ghi sai lúc đi từ `tam_dung`.**
§3.2 (dòng 158) và §5.3 (dòng 301–302) đều nói trường này được ghi *"mỗi lần rời một giai đoạn
**đang chạy**"*, và §3.1 (dòng 139) khẳng định nó *"không bao giờ nhận giá trị `tam_dung`"*.
Nhưng hai dòng của §5.1 — dòng 279 (`thua`) và dòng 280 (`thang`) — có cột *Từ* là **"Đang chạy
**hoặc** `tam_dung`"** và cột hành động ghi cụt lủn *"Lưu Giai đoạn mở gần nhất"*, không phân biệt
nguồn. Đi từ `tam_dung` mà "lưu" thì hoặc ghi đè bằng `tam_dung` (điều §3.1 cấm), hoặc là lệnh
rỗng — bảng không nói cái nào.

*Sửa:* đổi hai ô hành động thành *"Nếu đi từ một giai đoạn đang chạy thì lưu Giai đoạn mở gần
nhất; đi từ `tam_dung` thì **giữ nguyên** giá trị đã lưu"*.

**4.5 · §3.2 ⟷ §8.6 `FR-42` ⟷ §2.3 `UJ-2` — ba phiên bản của "hai nguồn `error-detection rate`".**

| Ở đâu | Nói hai nguồn là gì |
|---|---|
| §3.2 dòng 165 | `` `thong_tin_sai` `` trong `ly_do_bo` là **một trong hai nguồn** |
| `FR-42` dòng 695–696 | hai cơ chế thu = **nút *hữu ích / không hữu ích*** + **lý do ngắn khi Sales xoá mục hệ thống thêm** (`FR-40`) |
| `UJ-2` dòng 99–100 | Gợi ý bị **Bỏ** với lý do *thông tin sai* → *"con số đó chảy vào `error-detection rate`"* |

Ba chỗ cộng lại cho **ba** cơ chế, trong khi cả ba đều nói "hai". `D30` ở Mục 0 viết đúng như
`FR-42`. Còn một lệch nữa: mẫu số khai ở §3.1 dòng 134 là *"tổng số **Phát hiện** có phản hồi"*,
nhưng `ly_do_bo` là thuộc tính của **Gợi ý**, không phải Phát hiện — hai mức dữ liệu khác nhau.

*Sửa:* chốt một câu duy nhất ở §3.1 và trỏ về nó từ §3.2, `FR-42`, `UJ-2`. Nếu giữ `ly_do_bo` làm
nguồn thứ ba thì phải nói rõ cách quy một Gợi ý bị bỏ về Phát hiện sinh ra nó, nếu không mẫu số
không tính được.

**4.6 · §11.1 ⟷ §4.3, §10.1, §2.2 — hai cách đọc ngược nhau về đề bài §5.3.**
§11.1 dòng 831: *"`§5.3` cấm **gửi bất cứ thứ gì ra ngoài**"*. Ba chỗ khác nói ngược:
§2.2 dòng 83 (*"cấm chạm tới người thật"*), §4.3 dòng 240 (*"`§5.3` chỉ cấm chạm người thật"*),
và §10.1 dòng 796–798 dựng hẳn một khối cảnh báo: *"§5.3 cấm chạm tới người thật, **không** cấm
gọi mạng … Danh sách cho phép phải **mở** cho lệnh gọi mô hình, nếu không nó chặn oan chính phần
AI (`F38`)"*. §6 dòng 339 cũng ghi ✅ cho lệnh gọi ra ngoài.

Câu ở §11.1 chính là cách đọc rộng mà §10.1 dựng ra để chặn.

*Sửa:* dòng 831 → *"đề bài `§5.3` cấm gửi bất cứ thứ gì **tới người thật**"*.

**4.7 · §2.3 `UJ-1` ⟷ §8.1 `FR-10` — màn hình tổng quan không có "hạn hôm nay".**
`UJ-1` (dòng 91–95) dựng toàn bộ khoảnh khắc giá trị trên việc Linh mở màn hình tổng quan và thấy
*"một cơ hội có Việc tiếp theo do hệ thống đặt, **hạn hôm nay**"*. `FR-10` (dòng 463–464) và đề
bài `§4/nhóm 1` chỉ có *"danh sách Việc tiếp theo **quá hạn**"*; `FR-9` cũng chỉ lọc theo *"tình
trạng quá hạn"*. Việc hạn hôm nay chưa quá hạn nên không xuất hiện ở đâu.

Kèm theo: §8.1 dòng 417 tự nhận *"Thực hiện `UJ-1`"*, trong khi `UJ-1` xoay quanh Việc tiếp theo
**do hệ thống đặt** — thứ thuộc nhóm 4 và phải biến mất khi tắt sạch AI, đúng điều `T-1` kiểm.

*Sửa:* thêm "việc đến hạn hôm nay" vào `FR-10` (rẻ, và làm `UJ-1` chạy được), rồi bỏ "Thực hiện
`UJ-1`" khỏi §8.1 — giữ nó ở §8.4, nơi đã ghi đúng.

**4.8 · ⚠ §9.1 `NFR-8` ⟷ §9.2 `TR-4` — idempotent có điều kiện.**
`NFR-8` (dòng 751) khai không điều kiện: *"chạy lại thì **về đúng trạng thái phát bài**"*, ngưỡng
*"1 lệnh, idempotent"*, nghiệm *"chạy hai lần, so số bản ghi"*. `TR-4` (dòng 772) định nghĩa một
**cờ giữ ghi vết** khiến lần chạy thứ hai **không** về trạng thái phát bài (theo `D32`, trạng thái
phát bài gồm cả ghi vết).

*Sửa:* `NFR-8` thêm "khi không bật cờ `TR-4`".

**4.9 · ⚠ §1 `BUS-3` ⟷ §13.1 `SM-1` — cái nào chạm nguyên nhân gốc.**
§1 dòng 59–60: `BUS-3` là *"yêu cầu **gần nguyên nhân gốc nhất** mà cũng là yêu cầu duy nhất chưa
có số đo"*. §13.1 dòng 919: `SM-1` là *"số đo **duy nhất đo đúng nguyên nhân gốc** ở §1"*. Nếu
`SM-1` đo đúng nguyên nhân gốc thì không thể nói thứ gần gốc nhất đang không có số đo.

*Sửa:* §13.1 nói rõ hơn — "số đo duy nhất đo đúng **cơ chế** ở §1 (chi phí đọc tin tăng tuyến
tính)", và giữ nguyên `BUS-3` là chiều *Right Timing* chưa đo được.

---

## 5 · Từ vựng

§3.1 tự nhận là nguồn duy nhất và cấm từ đồng nghĩa. Chín chỗ vi phạm.

**5.1 · *Đang chạy* / *Đang mở* dùng lẫn — đúng ba chỗ §3.1 dựng từ mới để tránh.**
§3.1 dòng 121 nói thẳng: *"Cần một từ riêng vì `BR-B4` và **`FR-27`** chỉ đúng với nghĩa này"*.
Nhưng `FR-27` không dùng từ đó:

| Dòng | Đang viết | Phải là |
|---|---|---|
| 593–594 | `FR-27`: *"Công ty đang có ít nhất một **Cơ hội mở**"* rồi trừ `tam_dung` ở gạch đầu dòng 597 | *"ít nhất một **Cơ hội đang chạy**"*, bỏ gạch đầu dòng trừ đi |
| 198 | sơ đồ §4.2: *"Công ty có **Cơ hội mở**"* | *"Công ty có **Cơ hội đang chạy**"* |
| 773 | `TR-5`: *"đếm **Cơ hội mở** có ô Việc tiếp theo trống"* | *"đếm **Cơ hội đang chạy**"* — vì nó đo đúng đầu vào của `FR-27` |

`BR-B1` (dòng 378) dùng *"đang mở"* là **đúng** và không phải sửa: `BR-B4` miễn trừ `tam_dung` một
cách tường minh ngay dưới. §6 dòng 319 cũng dùng đúng.

**5.2 · *Hàng đợi gợi ý* bị rút gọn — ba chỗ.** Dòng 96 (`UJ-2`: *"Linh xử **hàng đợi** trong bốn
phút"*) · dòng 203 (sơ đồ: *"KHÔNG vào **hàng đợi**"*) · dòng 712 (`FR-45`: *"khoá luôn cả **hàng
đợi**"*). Dòng 44–45 ở §1 nói về một hệ thống giả định chứ không phải sản phẩm, nên chấp nhận
được.

**5.3 · Lỗi nhân bản chữ ở §11.1, dòng 839–840.** Đang là:

> *"…vẫn dùng để **định tuyến**: Hàng đợi gợi ý / gợi ý và thông báo đi tới người sở hữu"*

Thừa một *"gợi ý"* — dấu vết của một lượt thay chuỗi "hàng đợi gợi ý" → "Hàng đợi gợi ý" chạy đè
lên câu cũ. *Sửa:* "…**định tuyến**: Gợi ý và thông báo đi tới người sở hữu (`FR-18`, `FR-31`)".

**5.4 · `snake_case` bị phá ngay trong bảng công bố quy ước `snake_case`.** §3.2 dòng 153 viết
*"Quy ước đặt tên: `snake_case` … đừng trộn hai kiểu"*. Hai dòng sau:

- `nextAction.overwriteOverdueManual` — dòng 162, và nhắc lại ở `FR-34` dòng 633 và `TR-5` dòng
  773. Đây là **trường PRD tự khai sinh**, nên không có cớ giữ camelCase.
- `signalSubtype` trong ô `relevance` — dòng 161, trong khi cùng trường đó viết `signal_subtype` ở
  dòng 159 và ở `BR-D6` dòng 363.

`winRate` / `weightedValue` (dòng 874) là trường của **hệ thống thật**, được miễn.

*Sửa:* `next_action_overwrite_overdue_manual` và `signal_subtype`, đổi cả bốn chỗ một lượt.

**5.5 · `auto-accept rate` bị gọi bằng từ đồng nghĩa ở bốn chỗ.** §3.1 dòng 133 khai nó là thuật
ngữ. Nhưng: `SM-3` dòng 924 gọi *"Tỉ lệ Gợi ý được duyệt"* · `FR-41` dòng 687 và `FR-43` dòng 698
gọi *"tỉ lệ duyệt"* · `UJ-3` dòng 102 gọi *"tỉ lệ duyệt 96%"*. Cùng một đại lượng, bốn cách gọi.

*Sửa:* dùng `auto-accept rate` ở cả bốn — hoặc thêm vào ô §3.1 một câu *"nhãn hiển thị: **tỉ lệ
duyệt**"* rồi chỉ cho phép đúng nhãn đó.

**5.6 · *Sửa rồi duyệt* / *Sửa-rồi-duyệt*.** `FR-20` dòng 556 viết không gạch nối (khớp đề bài);
§3.1 dòng 133, §6 dòng 327, `FR-22` dòng 568, `FR-26` dòng 582, `FR-41` dòng 687, `FR-45` dòng 711
viết có gạch nối. *Sửa:* chọn một và khai ở §3.1.

**5.7 · Thuật ngữ viết hoa mà §3.1 không khai — bốn cụm.**

- **Hoàn tác** — dòng 164, 199, 328, 582, 583, 595, 613, 621, 806. Có cửa sổ, có tham số
  (`undo_deadline`), có mặt trong ma trận §6: đủ tư cách một dòng từ vựng.
- **Duyệt · Sửa-rồi-duyệt · Bỏ** — ba nút, viết hoa như tên riêng ở dòng 133, 327, 556, 711.
- **Vùng đọc** — viết hoa ở tiêu đề `FR-14` dòng 518, viết thường ở dòng 202, 330, 404. Khái niệm
  này được đề bài `§4/nhóm 2` định nghĩa hẳn hoi và §6 có một dòng cho nó.
- **Bảng thống kê lý do thua** — `FR-48` đặt tên nó, `FR-10` và `BR-B3` nhắc lại, nhưng viết
  thường và không có ở §3.1.

*Sửa:* thêm bốn dòng vào §3.1, hoặc viết thường nhất quán.

**5.8 · ⚠ *người vận hành* dùng thay **Quản trị**.** `UJ-3` dòng 101 (*"Hà, người vận hành"*) và
§8.5 dòng 642 (*"người vận hành phải nhìn thấy"*). §3.1 đã khai **Quản trị** = *"vai vận hành"*,
nên đây là từ đồng nghĩa. Nhẹ vì đề bài cũng viết thế, nhưng §3.1 không cho phép ngoại lệ.

**5.9 · §3.1 ⟷ §3.2 lệch định nghĩa Độ liên quan.** §3.1 dòng 130: *"suy ra từ Loại tin"*. §3.2
dòng 161 và `BR-D6` dòng 363: *"suy ra từ Loại tin **và** `signal_subtype`"*. §3.1 là nguồn duy
nhất nên nó phải là chỗ đầy đủ nhất.

---

## 6 · Nhãn ưu tiên

### Ba con số và bảng tra §8.7 — **sạch**

Đếm máy trên từng khối FR: **32 `phải có` · 17 `nên có` · 1 `bỏ được`**, tổng 50. Ba danh sách mã
ở bảng §8.7 (dòng 728–730) khớp **từng phần tử** với nhãn thật, không thiếu, không thừa, không mã
nào nằm nhầm hàng. Ba con số này còn được nhắc lại ở §12.1 (dòng 859) và §12.5 (dòng 900) — cả ba
chỗ đều khớp.

### Bốn FR sai nhãn theo chính quy tắc ở dòng 400

Quy tắc PRD tự công bố: `phải có` = **có ít nhất một điểm `T-1`…`T-10` dựa vào nó**, hoặc đề bài
`§7` đòi nó. Đối chiếu với bảng `T` ở mục 6 của đề bài:

**6.1 · `FR-14` (Vùng đọc) — `nên có`, phải là `phải có`.** `T-3`: *"Bấm vào một phát hiện thì mở
đúng đoạn văn gốc trong bản lưu, có đánh dấu vị trí"*. `FR-15` cung cấp hành vi mở, nhưng chỗ để
bấm là vùng đọc của `FR-14` — và chính PRD thừa nhận ở dòng 404–405: *"`FR-14` (vùng đọc) đang là
`nên có` **dù nó là bề mặt duy nhất để `T-3` bấm vào** — cắt nó thì `T-3` không có chỗ bấm"*. Quy
tắc ở dòng 400 không có ngoại lệ "cãi được"; ghi ra một ngoại lệ không làm nó thôi là ngoại lệ.

**6.2 · `FR-8` và `FR-48` — `nên có`, phải là `phải có`; hoặc `FR-7` phải xuống.**
Cả hai nằm trong §8.1, tức nhóm 1. `T-1` kết bằng: *"**Không chức năng nào của nhóm 1 hỏng**"*.
Đọc đúng câu đó thì mọi FR của §8.1 đều có một điểm `T` dựa vào.

Bằng chứng cho thấy PRD **đã** dùng mệnh đề này — nhưng chỉ một lần: `FR-7` (Việc tiếp theo và
ngày hạn) mang nhãn `phải có` trong khi `T-1` **không liệt kê bước nào** về Việc tiếp theo; chỗ
dựa duy nhất của nó là đúng mệnh đề "không chức năng nào của nhóm 1 hỏng". `FR-8` và `FR-48` cũng
ở nhóm 1, cũng chỉ dựa được vào mệnh đề đó, nhưng lại nhận `nên có`. Cùng một câu, hai cách áp.

Thêm một ràng buộc độc lập cho `FR-48`: `FR-10` (`phải có`) đã **kéo `FR-48` vào nội dung của
mình** — dòng 464 liệt kê *"và **bảng thống kê lý do thua** (`FR-48`)"* như một thành phần của màn
hình tổng quan. Cắt `FR-48` theo thứ tự cắt ở §12.5 thì `FR-10` khuyết một phần đã hứa. Lưu ý
`FR-48` **không** phải thứ đề bài đòi (đề bài `§4/nhóm 1` chỉ đòi ba thứ trên màn hình tổng quan),
nên đây là chỗ PRD tự thêm một mục `nên có` vào bụng một FR `phải có`.

*Sửa (chọn một):* (a) nâng `FR-8` và `FR-48` lên `phải có`; hoặc (b) viết vào §8 rằng mệnh đề
"không chức năng nào của nhóm 1 hỏng" **không** được tính là "một điểm `T` dựa vào" — và khi đó
phải hạ `FR-7` xuống `nên có` cho nhất quán. Dù chọn cách nào, dòng 464 vẫn phải tách `FR-48` ra
khỏi phần bắt buộc của `FR-10` nếu `FR-48` còn là `nên có`.

**6.3 · `FR-38` (Không chồng vòng) — `phải có`, phải là `nên có`.**
Không điểm `T` nào chạm tới việc không chồng vòng: `T-4` chỉ đòi *hồ sơ y nguyên sau ít nhất ba
chu kỳ*; `T-8` đòi *"Nhật ký vòng quét có dòng tổng kết cho từng vòng"* — đó là `FR-39`, và `FR-39`
đã là `phải có` độc lập. Đề bài `§4/nhóm 5` không đòi khoá vòng; đề bài `§7` không liên quan.
Nguồn thật của `FR-38` là `D19` (`vá F18`) — khớp **đúng từng chữ** với định nghĩa cột giữa của
nhãn `nên có`: *"Đề bài `§4` hoặc một quyết định `Dn` đòi, nhưng không điểm `T` nào chạm"*.

`NFR-1` có trích `FR-38`, nhưng `NFR-1` cũng không phải một điểm `T`.

*Sửa:* hạ `FR-38` xuống `nên có` — hoặc, nếu đội cho rằng vòng chồng sẽ làm `T-8` đỏ (hai mục mới
bị nhân đôi), thì viết luận cứ đó **vào chính `FR-38`**, vì lúc đó nó mới là "một điểm `T` dựa
vào".

### Các nhãn đã kiểm và **đúng**

- `FR-28`, `FR-29` (`nên có`) — hợp lệ. `T-6` chỉ khẳng định *Việc tiếp theo tự đổi*, không khẳng
  định nội dung hay giá trị ngày hạn, đúng như `NFR-13` chốt (*"`T-6` và `T-8` khẳng định quan hệ
  chứ không khẳng định con số"*). PRD đã ghi chỗ này là "cãi được" — nhưng khác `FR-14`, ở đây
  quy tắc đứng về phía nhãn hiện tại.
- `FR-34` (`nên có`) — hợp lệ. Đề bài `§4/nhóm 4` đòi, không điểm `T` nào chạm.
- `FR-49` (`phải có`) — hợp lệ qua vế thứ hai của quy tắc: đề bài `§7.3` đòi *"Đăng nhập thật bằng
  hai tài khoản Sales và Quản trị"*.
- `FR-26` (`bỏ được`) — hợp lệ và duy nhất: toàn bộ FR mang nhãn `mở rộng ngoài đề bài`. `FR-35`
  và `FR-40` đúng là chỉ có một gạch đầu dòng mở rộng, như §8 đã loại trừ.
- 32 mã `phải có` còn lại — mỗi mã tra được ít nhất một điểm `T`: `T-1` (1,2,3,4,5,6,9,10),
  `T-2` (12), `T-3` (11,15), `T-4` (18,21,35,36,37), `T-5` (20,22,23), `T-6` (27,30,31,50),
  `T-7` (32,33), `T-8` (11,35,36,37,39,50), `T-9` (45,46,47), `T-10` (1,3,4).

### Hệ quả số học nếu sửa cả ba

`phải có` 32 → **34** (+`FR-14`, +`FR-8`, +`FR-48`, −`FR-38`) · `nên có` 17 → **15** ·
`bỏ được` **1** · tổng vẫn 50. Ba con số này xuất hiện ở **bốn** chỗ phải sửa cùng lúc: bảng đầu
§8 (dòng 400–402), bảng tra §8.7 (dòng 728–730, cả danh sách mã), §12.1 (dòng 859), §12.5
(dòng 900).

---

## Thứ tự sửa đề nghị

1. **Dòng 400** — thêm tiền tố `đề bài` cho `§7`. Quy tắc ưu tiên đang mơ hồ, mọi thứ ở phép 6 dựa
   vào nó.
2. **Bốn nhãn ưu tiên** (6.1–6.3) và bốn chỗ ghi lại ba con số.
3. **Bốn mâu thuẫn hành vi** 4.1 → 4.4 — chúng sẽ thành mã sai nếu bước Kiến trúc đọc nhầm nhánh.
4. **Dòng 946** — `D32` → `TR-1`.
5. **Tiền tố `đề bài`** cho 31 chỗ còn lại, làm một lượt.
6. **Từ vựng** 5.1 → 5.4 (ba chỗ *Cơ hội mở*, ba chỗ rút gọn *Hàng đợi gợi ý*, lỗi nhân bản dòng
   839, bốn chỗ camelCase).
7. Phần còn lại: 1.1, 1.2, 2.1–2.3, 4.5–4.9, 5.5–5.9.
