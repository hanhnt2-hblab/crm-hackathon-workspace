---
title: "Kiểm chứng cuối — PRD Why Now sau mười một lượt sửa"
target: prd.md
created: 2026-08-14
kind: review
lens: final-convergence
---

# Kiểm chứng cuối — tài liệu đã hội tụ chưa?

Bản này chạy trên `prd.md` **1.019 dòng** hiện tại. Mọi con số dưới đây được **đếm bằng máy
trên chính tệp**, không lấy lại từ bảy bản phản biện trước. Bảy bản đó chỉ được đọc để biết
cái gì đã nêu — những gì đã nêu mà **chưa sửa** được gom riêng ở §6, không tính là phát hiện
mới.

---

## 0 · Phán quyết hội tụ

> **GẦN HỘI TỤ.** Lần đầu tiên tầng số học và tầng mã hiệu — hai tầng vỡ nhiều nhất trong sáu
> lượt trước — **sạch tuyệt đối**; nhưng lượt sửa gần nhất vẫn đẻ ra **năm mâu thuẫn mới**, và
> cả năm đều cùng một dạng: **một câu vá được áp lên đúng chỗ nó được chỉ, rồi bỏ quên những
> chỗ khác cùng nói về điều đó.**

Vì sao *gần hội tụ* chứ không phải *đã hội tụ*, và cũng không phải *chưa hội tụ*:

**Bằng chứng đang hội tụ.** Ba tầng dễ vỡ nhất đã đứng yên:

| Tầng | Lượt trước (`review-regression.md`) | Lượt này |
|---|---|---|
| Con số tự khai | 3 chỗ hỏng (§4.3, §8.7, §5.2) | **0 chỗ hỏng thật** — 51 FR · 34/16/1 khớp từng phần tử · 26 hành động · 4 dòng in đậm · 11+6 luật · 3 ngoại lệ · mọi enum |
| Mã treo · trích dẫn chéo | 3 chỗ hỏng (`SM-C1`, `SM-C5`/`SM-C4`, `A5`) | **0 mã treo, 0 mã trùng, 0 dãy nhảy số**; 2/3 chỗ trên đã sửa |
| Nhãn ưu tiên | 4 FR sai theo chính quy tắc | **0 FR sai** — cả bốn đã sửa đúng, ba con số cập nhật đủ ở bốn chỗ |
| Tiền tố `đề bài` | 32 chỗ thiếu | 17 chỗ còn thiếu (**giảm 47%**) |

**Bằng chứng chưa hội tụ hẳn.** Tất cả năm phát hiện `high` của lượt này đều là **thiệt hại
kèm theo của chính các lượt vá**, không phải lỗ hổng nội dung mới:

| Lượt vá | Chỗ được vá | Chỗ bị bỏ quên → mâu thuẫn mới |
|---|---|---|
| Nâng `FR-14` lên `phải có` (6.1) | nhãn trên `FR-14`, bảng §8.7, ba con số | đoạn văn §8 vẫn nói `FR-14` là `nên có` → **H1** |
| Chốt hai nguồn `error-detection rate` (4.5) | `FR-42` | `FR-40` và §4.3 vẫn giữ nguồn cũ; `D30` bị đi ngược không nhãn → **H2** |
| Đổi *Cơ hội mở* → *đang chạy* (5.1) | §4.2 và `TR-5` | `FR-27` — dòng thứ ba của chính bảng sửa — bị bỏ → **H3** |
| Thêm `FR-51` (H5 của freshpass) | luật một-ô-một-gợi-ý | phá định nghĩa mẫu số `auto-accept rate` ở §3.1 → **H4** |
| Gỡ nhập nhằng khoá xếp hàng đợi (M7) | `FR-18` | đi ngược `D31` không nhãn, kèm một câu bị nhân bản → **H5** |

Đây là **dạng lỗi bị chặn**, không phải dạng lỗi mở rộng: bán kính của nó bằng đúng số chỗ
nhắc lại cùng một điều, và số đó đếm được bằng `grep`. Khác hẳn ba lượt đầu, khi mỗi lượt sửa
còn phát lộ những khoảng trống nội dung chưa ai nghĩ tới (phanh giữa vòng quét, kiểm-và-ghi
nguyên tử, một bản lưu hai tin). **Lượt này không phát lộ thêm một khoảng trống nội dung nào.**

**Kết luận thao tác.** Tài liệu đã đủ dùng cho bước UX và Kiến trúc **sau khi vá năm chỗ `high`
ở §3**, và năm chỗ đó là năm lệnh thay chuỗi, không phải năm quyết định nghiệp vụ. Nếu lượt vá
tới được làm theo nguyên tắc *"vá xong thì grep lại toàn bộ tài liệu tìm mọi chỗ nhắc cùng
điều đó"* thì đây là lượt cuối. Nếu vẫn vá đúng dòng được chỉ, lượt sau sẽ lại có 3–5 phát
hiện cùng dạng.

---

## 1 · Phép 1 — Tính nhất quán số học

**Kết quả: SẠCH.** Đây là lần đầu tiên trong bảy lượt soát phép này không có chỗ hỏng thật.

### Đã đếm bằng máy và khớp

| Tài liệu tự khai | Ở đâu | Đếm thật | |
|---|---|---|---|
| **51 FR** | §8.7 tiêu đề, §12.1 | 51 khối `**FR-n ·**`, số hiệu **1–51 liên tục**, không trùng, không nhảy | ✅ |
| **34** `phải có` · **16** `nên có` · **1** `bỏ được` | §8 (dòng 401–403), §8.7 (774–776), §12.1 (908), §12.5 (949) | 34 · 16 · 1 — và **ba danh sách mã ở §8.7 khớp từng phần tử** với nhãn thật trên từng khối FR: không thiếu, không thừa, không mã nào nằm nhầm hàng | ✅ |
| Bảng "mục nào chứa FR nào" (§8.7 dòng 778–779) | §8.7 | §8.1 `1–10,48,49` · §8.2 `11,50,12–17` · §8.3 `18,51,19–26` · §8.4 `27–34` · §8.5 `35–40` · §8.6 `41–47` — **khớp đúng thứ tự xuất hiện thật** | ✅ |
| **26 hành động** ma trận §6 | dòng 342 | 26 dòng dữ liệu (không kể dòng tiêu đề) | ✅ |
| **Bốn dòng in đậm** = toàn bộ khác biệt Sales / Quản trị | dòng 342, `A4` | đúng 4 dòng in đậm (8, 23, 24, 25 trong bảng), và **đúng 4 dòng đó là toàn bộ dòng có cột Sales khác cột Quản trị** — đã đối chiếu từng ô | ✅ |
| **11** luật định nghĩa · **6** luật hành vi | §7 dòng 350 | `BR-D1`…`BR-D11` · `BR-B1`…`BR-B6` | ✅ |
| **Ba ngoại lệ** non-functional trong §7 | dòng 351–353 | `BR-D6`, `BR-B5`, `BR-B6` | ✅ |
| **13 NFR** ở §9.1 · **4** ở §10.1 | — | `NFR-1`…`NFR-17` liên tục, 13 + 4 | ✅ |
| **5 TR** | §9.2 | `TR-1`…`TR-5` | ✅ |
| **Ba yêu cầu nghiệp vụ** | §1 | `BUS-1`…`BUS-3` | ✅ |
| **Bốn nhánh** §4.3 | tiêu đề dòng 226 | nạp · đọc · ra biên · xoá = 4 | ✅ (xem L2) |
| **Ba trần lưu giữ** §4.3 | dòng 260 | 3 dòng bảng | ✅ |
| **Ba chỗ chặt hơn** §5.2 | dòng 289–290 | 3 dòng bảng | ✅ *(tiêu chí đếm vẫn như ghi chú 1.3 lượt trước — xem §6)* |
| **Ba chạm** · **ba nhánh ngoại lệ** §4.2 | dòng 193, 213 | 3 · 3 | ✅ |
| **Bốn ranh giới** §10.1 · **ba mức quyền ghi** §10.2 | — | 4 · 3 | ✅ |
| **7** Giai đoạn · **5** *Đang mở* · **4** *Đang chạy* | §3.1 | liệt kê đủ cả ba | ✅ |
| **5** Loại công ty · **6** Loại tin · **3** Mức chắc chắn · **3** Độ liên quan · **5** `ly_do_bo` · **13** `signal_subtype` | §3.1, §3.2, `FR-20` | khớp ở mọi chỗ nhắc lại; 13 giá trị `signal_subtype` liệt kê đủ và "12 giá trị kia" cộng `unclassified` = 13 | ✅ |
| **5** vai còn lại · **7** vai hệ thống thật | §2.2, `TR-2` | 5 · (5+2)=7 | ✅ |
| **5** điều kiện nộp bài = 3 trong PRD + 2 ngoài | §12.4 | 3+2=5, và 6 mã NFR trỏ về ba điều kiện kia đều tồn tại | ✅ |
| **3** hành trình `UJ` · **5** giả định `An` · **5** `SM-n` · **5** `SM-Cn` | §2.3, §15, §13 | 3 · 5 · 5 · 5 | ✅ |

### Một con số duy nhất sai — và nó thuộc phép 4

Dòng 405 khai *"**Hai** chỗ nhãn cãi được"* rồi liệt kê `FR-14` và `FR-28`/`FR-29`. Sau khi
`FR-14` được nâng lên `phải có`, chỉ còn **một** chỗ cãi được. Đây là hệ quả của lượt vá nhãn,
nên nó được báo đầy đủ ở **H1** thay vì ở đây.

---

## 2 · Phép 2 — Mã treo và trích dẫn chéo

**Kết quả: SẠCH về mã. Còn 17 chỗ vi phạm quy ước tiền tố `đề bài` (đã nêu lượt trước).**

### Mã hiệu — dò toàn tệp bằng máy

| Họ mã | Dãy tìm được | Liên tục? | Trùng? | Mọi chỗ trích đều tồn tại? |
|---|---|---|---|---|
| `FR-n` | 1–51 | ✅ | ✅ không | ✅ |
| `BR-Dn` | 1–11 | ✅ | ✅ không | ✅ |
| `BR-Bn` | 1–6 | ✅ | ✅ không | ✅ |
| `NFR-n` | 1–17 | ✅ | ✅ không | ✅ |
| `TR-n` | 1–5 | ✅ | ✅ không | ✅ |
| `BUS-n` | 1–3 | ✅ | ✅ không | ✅ |
| `SM-n` | 1–5 | ✅ | ✅ không | ✅ |
| `SM-Cn` | 1–5 | ✅ | ✅ không | ✅ (thứ tự trình bày vẫn C1·C2·C3·**C5**·C4 — xem §6) |
| `UJ-n` | 1–3 | ✅ | ✅ không | ✅ |
| `An` | 1–5 | ✅ | ✅ không | ✅ |
| `T-n` | 1–10 | ✅ | ✅ không | ✅ |

Số khối định nghĩa bằng đúng số mã trong dãy ở **cả 11 họ** — không họ nào có mã được trích mà
không có dòng định nghĩa, cũng không có dòng định nghĩa nào không được ai trích.

### `§n.n` nội bộ PRD

Đã dò từng chỗ: §5.1, §5.2, §5.3, §8.1–§8.7, §9.1, §9.2, §10.1, §10.2, §11.1, §12.1, §12.5,
§13.1, §13.3, §3.1, §3.2, §4.2, §4.3 — **mọi tham chiếu đều trỏ tới một mục có thật.**

### Tham chiếu ra đề bài — 17 chỗ còn thiếu tiền tố

Giảm từ 32 xuống 17. Danh sách dòng: **85 · 240 · 282 (hai lần) · 393 · 794 · 796 · 800 · 842 ·
880 · 908 · 916 · 945**, cộng ba chỗ có tiền tố nằm sau mã nên chấp nhận được (143, 845, 846).
Dòng **958** (`§10.1`) là tham chiếu nội bộ **đúng**, không phải vi phạm.

Toàn bộ đã nêu ở `review-regression.md` §3A/§3B nên không báo lại. Ba chỗ đáng lo nhất vẫn y
nguyên và được nhắc ở §6: **dòng 282** (trích `§5.1`, `§5.2` để chỉ đề bài, **ngay bên trong
bảng §5.1**), và **ba chỗ `§7.3`** (dòng 794, 796, 800) — PRD không có §7.3 nên chúng đọc như
mã treo.

**Điểm sáng:** dòng 401 — câu định nghĩa nhãn `phải có`, thứ toàn bộ hệ ưu tiên đứng lên — đã
được vá thành **đề bài `§7`**. Đó là chỗ nguy hiểm nhất trong 32 chỗ và nó đã đóng.

---

## 3 · Phát hiện mức `high`

Không có phát hiện mức `critical`. Năm phát hiện dưới đây đều thuộc phép 4: chúng **không tồn
tại trước lượt sửa gần nhất**.

### H1 · §8 vẫn nói `FR-14` là `nên có`, trong khi nó đã là `phải có` ở ba chỗ khác

**Ở đâu:** dòng **405–406** ⟷ dòng **522** (nhãn thật) ⟷ dòng **774** (bảng §8.7).

Lượt vá gần nhất nâng `FR-14` từ `nên có` lên `phải có` — đúng theo đề nghị 6.1, và đã cập nhật
nhãn trên chính khối FR, danh sách mã ở §8.7, và cả bốn chỗ ghi ba con số. Nhưng **đoạn văn giải
thích ngay dưới bảng nhãn thì không**:

> *"**Hai chỗ nhãn cãi được, ghi ra để khỏi tranh lúc gấp:** `FR-14` (vùng đọc) đang là `nên có`
> dù nó là bề mặt duy nhất để `T-3` bấm vào…"*

Đây là chỗ duy nhất trong tài liệu còn khai `FR-14` là `nên có`, và nó nằm **ở §8 — chỗ người
đọc tới đầu tiên khi hỏi "FR nào cắt được"**. Kèm theo, con số *"Hai chỗ"* nay chỉ còn đúng
một (`FR-28`/`FR-29`).

**Vì sao là `high`, không phải `low`:** §12.5 ra lệnh *"cắt `nên có` trước"*. Ai đọc §8 rồi đi
cắt sẽ đưa `FR-14` vào danh sách cắt, và §12.5 nói thẳng cắt nó thì `T-3` **không còn chỗ bấm**.
Hai chỗ khác nói đúng, nhưng chỗ sai lại là chỗ có thẩm quyền diễn giải.

**Sửa:** viết lại dòng 405–408 thành *"**Một chỗ nhãn cãi được:** `FR-28`/`FR-29` là `nên có` vì
`T-6` chỉ kiểm có đổi hay không… `FR-14` từng ở `nên có` và đã được nâng lên `phải có` vì nó là
bề mặt duy nhất `T-3` bấm vào."*

---

### H2 · `FR-40` và `FR-42` nói ngược nhau về nguồn của `error-detection rate` — và bản vá đi ngược `D30` không mang nhãn

**Ở đâu:** dòng **717** (`FR-40`) ⟷ dòng **735–738** (`FR-42`) ⟷ dòng **248** (§4.3 nhánh xoá)
⟷ `D30` ở Mục 0.

Ba phát biểu đang cùng sống trong tài liệu:

| Ở đâu | Nói gì |
|---|---|
| `FR-40` dòng 717 | lý do ngắn khi Sales xoá mục hệ thống thêm *"là **một trong hai nguồn** của `error-detection rate` (`D30`)"* |
| §4.3 dòng 248 | mục bị xoá *"**vẫn còn** làm dữ liệu đo cho `error-detection rate` (`D30`)"* |
| `FR-42` dòng 735–738 | *"Cơ chế thu, **đúng hai nguồn**: nút *không hữu ích*, và lý do `thong_tin_sai` khi **Bỏ một Gợi ý**. Lý do ngắn khi Sales xoá mục do hệ thống thêm (`FR-40`) là **tuỳ chọn**, nên **không** vào mẫu số"* |

`FR-40` nói mình **là** một trong hai nguồn; `FR-42` nói `FR-40` **không phải nguồn nào cả**.
Đây không phải nhập nhằng — đây là hai câu phủ định nhau trực tiếp, và §4.3 đứng về phía
`FR-40`, thành tỉ số 2–1 nghiêng về phía **sai** so với ý định của bản vá.

**Nghiêm hơn — bản vá đi ngược nguồn có thẩm quyền mà không khai.** `D30` ở Mục 0 viết nguyên
văn: *"Cơ chế thu: hai nút 'hữu ích / không hữu ích' trên mỗi phát hiện, **và hỏi một lý do
ngắn khi Sales xoá mục do hệ thống thêm**."* Tức `D30` khai đúng hai nguồn mà `FR-40` đang nói,
và **không** có `ly_do_bo` trong đó. §0 của PRD xếp Mục 0 là hạng 2 — *"có thẩm quyền về mọi
chi tiết đề bài để trống"*. `FR-42` đang thay một nguồn của `D30` bằng một nguồn khác mà không
mang nhãn `làm chặt hơn` / `mở rộng ngoài đề bài` và không có một dòng nào giải thích vì sao
`D30` bị đi ngược — đúng cái quy ước mà `review-traceability.md` §3 dựng ra để bắt.

*(Ghi nhận công bằng: Mục 0 **tự nó** cũng lệch — `0.1.7` viết `thong_tin_sai` *"là một trong
hai nguồn dữ liệu của `error-detection rate` ở `D30`"*, trong khi `D30` không liệt kê nó. Bản vá
`FR-42` chọn cách đọc của `0.1.7`. Chọn thế là hợp lý — nhưng phải **ghi ra là đang chọn**.)*

**Kèm theo:** mẫu số ở §3.1 dòng 134 vẫn là *"tổng số **Phát hiện** có phản hồi"*, trong khi
`ly_do_bo` là thuộc tính của **Gợi ý**. Trước bản vá đây là lệch nhẹ; sau bản vá `ly_do_bo`
thành nguồn chính thức, nên **mẫu số hiện không tính được** nếu không nói cách quy một Gợi ý bị
bỏ về Phát hiện sinh ra nó.

**Sửa:**
1. `FR-40` dòng 717 → *"…hỏi **một lý do ngắn**, tuỳ chọn. Lý do này **không** vào mẫu số
   `error-detection rate` (xem `FR-42`); nó chỉ để đọc định tính."*
2. §4.3 dòng 248 → bỏ cụm *"làm dữ liệu đo cho `error-detection rate`"*, thay bằng *"Bản ghi
   **vẫn còn** để đối chiếu; không vào mẫu số số đo nào (`FR-42`)"*.
3. `FR-42` thêm một câu: *"`làm chặt hơn` — thay nguồn thứ hai của `D30` bằng `ly_do_bo =
   thong_tin_sai`, theo `0.1.7`. Lý do: nguồn của `D30` là **tuỳ chọn**, mẫu số co giãn theo
   mức chăm chỉ của người dùng. **Việc phải làm ngoài PRD:** sửa `D30` cho khớp `0.1.7`."*
4. §3.1 dòng 134 → nói rõ mẫu số quy về **Phát hiện**, và một Gợi ý bị bỏ được quy về Phát hiện
   đã sinh ra nó.

---

### H3 · `FR-27` còn canh bằng *"Cơ hội mở"* trong khi §4.2 và `FR-18` đã đổi sang *"đang chạy"* — hai hành vi khác nhau cho cùng một Công ty

**Ở đâu:** dòng **615–619** (`FR-27`) ⟷ dòng **198** (§4.2) ⟷ dòng **555–557** (`FR-18`) ⟷
dòng **121** (§3.1).

`review-regression.md` §5.1 chỉ ra **ba** chỗ dùng nhầm *Cơ hội mở* và cho bảng sửa ba dòng.
Lượt vá áp **hai** dòng — §4.2 (dòng 198) và `TR-5` (dòng 819) — và **bỏ dòng thứ ba là
`FR-27`**. Trước bản vá, cả ba chỗ cùng sai nên **cùng nói một điều**. Sau bản vá, hai chỗ nói
*đang chạy* và một chỗ nói *mở* — và §3.1 dựng hẳn hai từ riêng để hai nghĩa này **không bằng
nhau**.

**Hai hành vi khác nhau, ca thật, không phải ca biên.** Công ty có đúng một Cơ hội, đang ở
`tam_dung`, xuất hiện một Phát hiện đáng chú ý (`high` + `chac`):

| Đọc theo | Kết quả |
|---|---|
| `FR-27` dòng 615–616 | Công ty *"đang có ít nhất một **Cơ hội mở**"* → **cổng chạm 1 mở** (vì `tam_dung` **là** *Đang mở* theo §3.1). Rồi gạch đầu dòng 619 chặn không tự đặt cho Cơ hội `tam_dung`. **Kết cục: không có gì xảy ra, và Phát hiện không đi tiếp đâu cả.** |
| §4.2 dòng 198 + `FR-18` dòng 555 | Công ty **không** có Cơ hội **đang chạy** → chạm 1 không nhận → rơi về **chạm 2, vào Hàng đợi gợi ý** |

Một đằng Phát hiện rơi mất, một đằng nó vào hàng đợi để người quyết. Bước Kiến trúc cài theo
`FR-27` sẽ đánh rơi đúng nhóm Công ty mà `FR-18` dòng 556–557 vừa tính ra là **4–7 Công ty
trong bộ dữ liệu BTC**.

**Kèm theo:** §3.1 dòng 121 khẳng định *"Cần một từ riêng vì `BR-B4` và **`FR-27`** chỉ đúng với
nghĩa này"* — tài liệu đang khai sai về chính văn bản của mình. Đây là chỗ duy nhất §3.1 nêu
đích danh một FR để biện minh cho một từ vựng, nên nó phải đúng.

**Sửa:** dòng 615–616 → *"…về một Công ty **đang có ít nhất một Cơ hội đang chạy**"*; dòng 617 →
*"Áp cho **mọi** Cơ hội **đang chạy** của Công ty"*; **bỏ hẳn** gạch đầu dòng 619 vì nó thành
thừa (giữ trích dẫn `D11`, `F7` chuyển lên câu đầu).

---

### H4 · `FR-51` đóng Gợi ý cũ *"và vẫn đếm vào số đo"* — phá định nghĩa mẫu số của `auto-accept rate`

**Ở đâu:** dòng **563–565** (`FR-51`, mục mới thêm) ⟷ dòng **133** (§3.1).

§3.1 định nghĩa: *"`auto-accept rate` = Tỉ lệ Gợi ý được **Duyệt** trên tổng số Gợi ý **đã có
người quyết**. Mẫu số **không** gồm Gợi ý còn chờ."*

`FR-51` dựng một đường đóng Gợi ý **hoàn toàn không có người nào quyết**: một Gợi ý mới hơn về
cùng ô tự động thay thế cái cũ, *"cái cũ đóng lại với lý do 'có gợi ý mới hơn' **và vẫn đếm vào
số đo**"*.

Cụm *"vẫn đếm vào số đo"* chỉ có hai cách đọc, và cả hai đều hỏng:

- **Vào mẫu số `auto-accept rate`** → mâu thuẫn trực tiếp §3.1: nó chưa hề *"có người quyết"*.
  Hệ quả thật: mỗi lần một ô được đọc lại và sinh gợi ý mới, mẫu số tăng mà tử số không tăng —
  `auto-accept rate` **tụt xuống theo tần suất vòng quét**, không theo chất lượng máy. Chu kỳ
  demo 60 giây (`FR-37`) khiến hiệu ứng này đủ lớn để làm hỏng chính con số `SM-3` (>85%) và
  khối cảnh báo duyệt mù `FR-43`.
- **Vào một số đo khác** → tài liệu không nói là số đo nào. `FR-41` liệt kê đủ số đo màn hình
  Quản trị, không có mục nào nhận nổi loại sự kiện này.

**Kèm theo (mức `medium`, ghi ở M8):** lý do *"có gợi ý mới hơn"* là **giá trị thứ sáu** ngoài
enum `ly_do_bo` 5 giá trị mà §3.2 khai là *"có, khi Bỏ Gợi ý"*.

**Sửa:** dòng 564–565 → *"…cái cũ đóng lại với **lý do hệ thống** *'có gợi ý mới hơn'* — đây
**không** phải một lần Bỏ, nên nó **không** vào mẫu số `auto-accept rate` (§3.1) và **không**
dùng enum `ly_do_bo`. Nó chỉ được đếm riêng ở `FR-41` dưới dạng *số Gợi ý bị thay thế*, để thấy
hàng đợi có đang tự nhân lên không."*

---

### H5 · Khoá xếp Hàng đợi ở `FR-18` đi ngược `D31` mà không mang nhãn, và câu vá bị nhân bản

**Ở đâu:** dòng **548–552** ⟷ `D31` và `0.2.3` ở Mục 0.

`D31` viết nguyên văn: *"Hàng đợi **có thứ tự**: `relevance` **×** mức chắc chắn **×** (công ty
có **cơ hội mở** hay không), nhóm được theo công ty."*

Bản vá cho `FR-18` viết ngược lại ở **hai** chỗ trong cùng một câu:

| `D31` (Mục 0, hạng 2 theo §0) | `FR-18` dòng 548–549 (sau vá) |
|---|---|
| một **phép nhân** ba thừa số | *"khoá xếp là **bộ ba**…, so **lần lượt** theo thứ tự đó — **không** phải một phép nhân số học"* |
| *"công ty có **cơ hội mở**"* | *"Công ty có Cơ hội **đang chạy**"* |

Cả hai đều là lựa chọn **đúng** về kỹ thuật — phép nhân trên ba thang hạng cho ra thứ hạng vô
nghĩa, và *đang chạy* mới khớp `FR-27`. Nhưng cả hai đều đi ngược một nguồn có thẩm quyền, và
tài liệu này có sẵn một quy ước cho đúng việc đó (`làm chặt hơn` / `mở rộng ngoài đề bài`, kèm
dòng *Rủi ro nghiệm thu*). `FR-18` dùng quy ước ấy ba lần ở các gạch đầu dòng khác — riêng chỗ
này thì không. Bước Kiến trúc đọc `D31` và đọc `FR-18` sẽ cài ra hai thứ tự hàng đợi khác nhau,
và không có dòng nào nói cái nào thắng.

**Câu vá còn bị nhân bản.** Dòng 552 hiện nguyên văn:

> *"…Trọng số hoàn thiện ở `0.2.3` chỉ áp cho Gợi ý loại *điền ô trống*, và cũng chỉ **trong**
> một Công ty **Gợi ý điền ô trống xếp theo trọng số hoàn thiện ở `0.2.3`** (`D31`, vá `F13`)"*

Nửa sau là câu cũ chưa xoá, dính vào nửa trước. Đọc liền mạch thì nó thành một mệnh đề thứ hai
mâu thuẫn về phạm vi áp dụng của `0.2.3`.

**Sửa:** dòng 552 → *"…chỉ áp cho Gợi ý loại *điền ô trống*, và cũng chỉ **trong** một Công ty
(`D31`, vá `F13`)"*; thêm ngay dưới: *"`làm chặt hơn` — `D31` viết khoá xếp là một **phép
nhân** và dùng từ *cơ hội mở*; PRD này đổi sang **so lần lượt** (nhân ba thang hạng cho ra thứ
hạng vô nghĩa) và sang **đang chạy** (cho khớp `FR-27`). **Rủi ro nghiệm thu: không** — không
điểm `T` nào kiểm thứ tự hàng đợi. **Việc phải làm ngoài PRD:** sửa `D31` ở Mục 0."*

---

## 4 · Phát hiện mức `medium` — 8 chỗ

| # | Ở đâu | Vấn đề | Sửa |
|---|---|---|---|
| **M1** | dòng 563 (`FR-51`) ⟷ dòng 402–403 (§8) | Nhãn `nên có` của `FR-51` **không tra được** bằng chính quy tắc §8. Cột 3 của `nên có` đòi *"không phải thứ đội tự thêm"*; `FR-51` không trích đề bài, không trích một `Dn` nào, và sinh ra từ phát hiện H5 của `review-freshpass.md` — tức đúng là thứ đội tự thêm. Nhưng nó cũng không mang nhãn `mở rộng ngoài đề bài` nên không rơi được vào `bỏ được`. Đây là FR duy nhất trong 51 FR không xếp được theo quy tắc mà §8 tự hứa là *"khách quan, tra được trong ba mươi giây"* | Gắn `mở rộng ngoài đề bài` cho `FR-51` và chuyển sang `bỏ được` (khi đó `bỏ được` **1 → 2**, `nên có` **16 → 15**, phải sửa **bốn** chỗ ghi ba con số) — hoặc giữ `nên có` và ghi thẳng vào `FR-51` một dòng ngoại lệ có lý do |
| **M2** | dòng 768 (§8.7) | *"`FR-51` nằm **đầu** §8.3"* — sai. `FR-18` mở đầu §8.3 (dòng 543), `FR-51` đứng thứ hai (dòng 563). Bảng liệt kê hai dòng bên dưới (`§8.3 FR-18, FR-51, FR-19–FR-26`) thì **đúng**. Đây đúng là lỗi mà lượt trước vừa vá cho `FR-50` (*"nằm đầu §8.2"* → *"nằm giữa §8.2 ngay sau `FR-11`"*), lặp lại nguyên xi trên mục mới thêm | → *"`FR-51` nằm trong §8.3 ngay sau `FR-18`"* |
| **M3** | dòng 953–955 (§12.5) | Đoạn *"**Một `nên có` bị một `phải có` dựa vào thì không cắt được**"* minh hoạ bằng `FR-11` — nhưng `FR-11` **là `phải có`**, nên nó không bao giờ nằm trong tập bị cắt. Ví dụ không phải một thể hiện của quy tắc nó minh hoạ. (Trước lượt vá nhãn, ví dụ đúng lẽ ra là `FR-14`, khi đó còn `nên có` và bị `FR-15` `phải có` dựa vào — nâng `FR-14` lên đã xoá mất ví dụ hợp lệ duy nhất) | Đổi ví dụ sang `FR-19`/`FR-51` (cả hai `nên có`, và `FR-20` `phải có` dựa vào bốn thứ `FR-19` bày ra), hoặc bỏ ví dụ và giữ quy tắc |
| **M4** | dòng 950 (§12.5) | *"**không bao giờ** chạm `phải có` **vì mỗi cái trong đó có ít nhất một điểm `T` dựa vào**"* — sai với `FR-49`, vốn được xếp `phải có` qua **vế thứ hai** của quy tắc (*hoặc đề bài `§7` đòi*), không qua một điểm `T`. §12.5 chỉ nhắc lại một trong hai vế | → *"…vì mỗi cái trong đó **hoặc** có một điểm `T` dựa vào, **hoặc** là điều kiện nộp bài ở đề bài `§7`"* |
| **M5** | dòng 552 (`FR-18`) | Câu bị nhân bản — chi tiết ở **H5**, tách riêng ở đây vì đó là lỗi văn bản độc lập với lỗi thiếu nhãn | xem H5 |
| **M6** | dòng 162 (§3.2) ⟷ dòng 745–748 (`FR-44`) | §3.2 khai `next_action_overwrite_overdue_manual` *"**Sửa được từ `FR-44`** như mọi tham số khác"*, nhưng `FR-44` tự giới hạn phạm vi: *"Cả bảng `0.2.1` và mọi tham số ở `0.2.2` sửa được từ đây"*. Cờ này là **trường PRD tự khai sinh**, không nằm trong `0.2.1` lẫn `0.2.2`. Cùng lỗ hổng áp cho cửa sổ Hoàn tác (`FR-32` gọi nó là *"tham số"*) và `undo_deadline` | `FR-44` → *"Cả bảng `0.2.1`, mọi tham số ở `0.2.2`, **và mọi tham số PRD này tự khai ở §3.2** sửa được từ đây"* |
| **M7** | dòng 819 (`TR-5`) ⟷ dòng 663–666 (`FR-34`) | Đường thoát không khớp chế độ hỏng nó nhận. `FR-34` mô tả rủi ro là *"dữ liệu BTC **điền sẵn** Việc tiếp theo cho cả 8 Cơ hội thì `T-6` không còn **ô trống**"*; `TR-5` nghiệm bằng *"đếm Cơ hội đang chạy có ô Việc tiếp theo **trống**. Bằng 0 thì bật cờ"*. Nhưng cờ được bật tên là `next_action_overwrite_overdue_**manual**` và §3.2 định nghĩa nó chỉ cho phép ghi đè ô người nhập **đã quá hạn**. Nếu BTC điền sẵn Việc tiếp theo với ngày hạn **chưa** quá hạn, bật cờ **không mở được ô nào** và `T-6` vẫn đỏ | `TR-5` đếm **hai** con số: ô trống, **và** ô đã điền nhưng quá hạn. Nếu cả hai bằng 0 thì cờ này vô dụng — phải ghi ra đường thoát thứ hai (ví dụ: lệnh nạp dữ liệu chừa trống Việc tiếp theo cho ít nhất một Cơ hội đang chạy) |
| **M8** | dòng 564 (`FR-51`) · dòng 247 (§4.3) ⟷ dòng 165 (§3.2) | Hai **lý do đóng do hệ thống** đã xuất hiện — *"có gợi ý mới hơn"* (`FR-51`) và *"công ty đã xoá"* (§4.3, `D26`) — nhưng §3.2 chỉ có `ly_do_bo`, *"enum 5 giá trị (`0.1.7`), **có, khi Bỏ Gợi ý**"*, và `0.1.7` chốt cứng 5 giá trị của đề bài. Không trường nào nhận hai lý do kia. Bước Kiến trúc sẽ hoặc nhét chúng vào `ly_do_bo` (phá enum, và bơm mẫu số `error-detection rate`), hoặc tự đặt trường mới | Thêm một dòng §3.2: `ly_do_dong_he_thong`, enum, nullable — *"có gợi ý mới hơn" · "công ty đã xoá"*; và ghi rõ Gợi ý đóng theo đường này **không** vào mẫu số `auto-accept rate` lẫn `error-detection rate` |

---

## 5 · Phát hiện mức `low` — 4 chỗ

| # | Ở đâu | Vấn đề |
|---|---|---|
| **L1** | dòng **289**, dòng **922** | *"**Đề bài đề bài** `§4/nhóm 1`"* — chữ bị nhân đôi, dấu vết của lượt quét thêm tiền tố `đề bài` chạy đè lên hai chỗ vốn đã có tiền tố. Sửa: bỏ một cụm |
| **L2** | dòng **226** ⟷ dòng **228** | Tiêu đề §4.3 đã vá thành *"**bốn** nhánh và một luật lưu giữ"*, nhưng câu ngay dưới vẫn *"nó trả lời **ba** câu bước Kiến trúc buộc phải có đáp án"*. Vá được nửa của phát hiện 1.1 lượt trước. Sửa: *"bốn câu"* |
| **L3** | dòng **466** (`FR-10`) | *"…và **bảng thống kê lý do thua** (`FR-48`) (`BR-D9`, `Q19`)"* — hai ngoặc trích liền nhau, dấu vết của lượt chèn `FR-48`. Gộp thành `(FR-48, BR-D9, Q19)` |
| **L4** | dòng **841–842** (§10.1) | *"`D25` làm chặt hơn: **cả bốn** ranh giới chặn ở tầng nghiệp vụ… kể cả ranh giới thứ tư **mà `§5` không đòi**"* — đọc thoáng thì mâu thuẫn với chính tiêu đề mục (*"**Bốn** ranh giới đề bài `§5`"*). Ý thật là *§5 không đòi **chặn ở tầng nghiệp vụ** cho ranh giới thứ tư*. Sửa: *"…kể cả ranh giới thứ tư, chỗ đề bài `§5` không đòi mức chặn này"* |

---

## 6 · Đã nêu ở lượt trước, **chưa** sửa — không tính là phát hiện mới

Ghi lại để lượt vá cuối không bỏ sót, và vì đây là một nửa bằng chứng cho phán quyết hội tụ.

**Sửa hụt — vá đúng chỗ được chỉ, bỏ chỗ còn lại:**

- **`review-regression.md` 4.1 vế (a)** — sơ đồ §4.2 nhánh 2 đã mở cho *`high` ở Công ty không
  có Cơ hội đang chạy*, nhưng vẫn **không** có đường cho **`high` + `doan` ở Công ty CÓ Cơ hội
  đang chạy**: không *đáng chú ý* (`BR-D5` đòi `chac`/`co_the`), không `medium`, không `low`.
  `FR-18` bảo nó phải sinh Gợi ý. Đề nghị lượt trước là *"`medium`, **hoặc** `high` không đi
  được chạm 1"* — chữ *"không đi được chạm 1"* phủ cả hai ca; bản vá thu hẹp thành *"không có
  Cơ hội đang chạy"* nên chỉ phủ một. **Sơ đồ giờ trông vét cạn hơn thực tế.**
- **`review-regression.md` 1.1** — xem L2.
- **`review-regression.md` 4.5** — xem H2, chỗ mẫu số Phát hiện ⟷ Gợi ý.
- **`review-regression.md` 5.1** — xem H3, dòng thứ ba của bảng.

**Chưa động tới:**

| Mã lượt trước | Nội dung | Còn ở dòng |
|---|---|---|
| regression 2.2 | `SM-C5` đứng trước `SM-C4` | 990, 993 |
| regression 2.3 | `A2` ghi *Ở đâu: §5.1, §5.3* nhưng §5.3 không mang dấu `[ASSUMPTION: A2]` | 1015 |
| regression 3A | 17 chỗ thiếu tiền tố `đề bài`, nặng nhất là **dòng 282** (trích `§5.1`,`§5.2` **bên trong bảng §5.1**) và ba chỗ `§7.3` (794, 796, 800) đọc như mã treo | nhiều |
| regression 1.3 | *"Ba chỗ chặt hơn"* §5.2 đếm theo tiêu chí không nhất quán | 287–296 |
| regression 4.6 | §11.1 vẫn đọc đề bài `§5.3` là *"cấm gửi bất cứ thứ gì ra ngoài"* — đúng cách đọc rộng mà §10.1 dựng khối cảnh báo để chặn | 880 |
| regression 4.7 | `UJ-1` dựng trên *"hạn **hôm nay**"*, `FR-10`/`FR-9` chỉ có *quá hạn*; §8.1 vẫn nhận *"Thực hiện `UJ-1`"* dù `UJ-1` xoay quanh Việc tiếp theo do **hệ thống** đặt | 92, 418, 465–466 |
| regression 4.8 | `NFR-8` khai idempotent không điều kiện, `TR-4` có cờ giữ ghi vết phá điều đó | 797, 818 |
| regression 4.9 | `BUS-3` *"gần nguyên nhân gốc nhất, chưa có số đo"* ⟷ `SM-1` *"số đo duy nhất đo đúng nguyên nhân gốc"* | 59, 972 |
| regression 5.2 | *Hàng đợi gợi ý* bị rút gọn thành *hàng đợi* | 96, 203, 758 |
| regression 5.3 | Lỗi nhân bản *"Hàng đợi gợi ý / gợi ý và thông báo"* ở §11.1 | 888–889 |
| regression 5.5–5.9 | `auto-accept rate` gọi bằng 4 tên · *Sửa rồi duyệt* / *Sửa-rồi-duyệt* · 4 cụm viết hoa không khai ở §3.1 · *người vận hành* thay **Quản trị** · §3.1 ⟷ §3.2 lệch định nghĩa Độ liên quan | nhiều |

**Ghi nhận sửa đúng và đủ** (không còn dấu vết): nhãn ưu tiên 6.1–6.3 và bốn chỗ ba con số ·
`SM-C1` → `SM-C2`/`SM-C5` ở §13.1 · `D32` → `TR-1` ở §14 · `A5` ghi *§5.1, §5.2* · §6 thêm dòng
`tam_dung` và 25 → 26 · `NFR-3` ⟷ §6 về ai được tắt phần AI · §5.1 phân biệt *lưu* và *giữ
nguyên* `giai_doan_mo_gan_nhat` · dòng 401 thêm tiền tố **đề bài `§7`** · §8.7 vị trí `FR-50` ·
`FR-3` xoá Cơ hội.

---

## 7 · Chỗ đi tìm mà không thấy gì đáng báo

Ghi ra để lượt sau không soát lại:

- **Ma trận §6 ⟷ §10.2 ⟷ §5.1** — ba bảng cùng nói về quyền ghi của máy, đã đối chiếu từng ô:
  không cặp nào ngược nhau. Dòng *Tắt/bật toàn bộ phần AI* nay có ngoại lệ `NFR-3` viết đúng.
- **`NFR-14`…`NFR-17` ⟷ §5.1 dòng cuối ⟷ §6** — bốn ranh giới, điểm chặn và nghiệm thu khớp
  nhau. `NFR-16` không mang vế `T-10` nào, nhưng §10.1 chỉ khai *`T-10` treo vào mục này*, không
  khai mỗi ranh giới có một vế — nên không mâu thuẫn.
- **`BUS-1`…`BUS-3` ⟷ §13** — `BUS-1`→`SM-1`, `BUS-2`→`SM-2`,`SM-4`, `BUS-3` khai thẳng là chưa
  đo được. Ba mã, ba dòng, không mã nào trỏ vào số đo không tồn tại.
- **§4.3 nhánh xoá ⟷ `FR-1`, `FR-3`, `FR-40`, `D26`** — xoá mềm nhất quán ở mọi chỗ; §4.3 không
  liệt kê Cơ hội / Người liên hệ / Hoạt động nhưng cũng **không khai một con số**, nên không
  phải lỗi đếm.
- **§11.2 ba dòng không đánh đổi** — cả ba trỏ đúng (`BR-D2`, `FR-21`, `D40`); `D40` ở Mục 0
  đúng là *"không tối ưu khối lượng log / đầu ra AI"*, khớp cả `SM-C3`.
- **§12.5 tập "không bao giờ cắt"** — `BR-D1`, `BR-D2`, bốn ranh giới §10.1, `FR-45`: cả ba đều
  tồn tại và đều nằm ngoài tập bị cắt.
- **Bảng chuyển tiếp §5.1** — 9 dòng, không dòng nào phủ chồng mâu thuẫn; hai chuyển tiếp bị cấm
  (`tam_dung` → giai đoạn tuỳ chọn, `thang` → `thua`) nhất quán với `FR-4` và §5.2.

---

## 8 · Thứ tự vá đề nghị cho lượt cuối

1. **H1** — một câu ở dòng 405. Rẻ nhất, và nó đang nói sai về nhãn của một `phải có`.
2. **H3** — ba dòng ở `FR-27`. Đây là chỗ duy nhất trong năm phát hiện `high` làm **đổi hành vi
   hệ thống**, nên nó chặn bước Kiến trúc.
3. **H2** và **H4** — hai định nghĩa số đo. Sửa cùng lượt vì cả hai đụng mẫu số.
4. **H5** + **M5** — một câu vá và một nhãn `làm chặt hơn`.
5. **M1**–**M8**, rồi **L1**–**L4**.
6. §6 — toàn bộ phần chưa sửa của lượt trước, làm **một lượt bằng thay chuỗi**, và sau mỗi lần
   thay thì `grep` lại chuỗi cũ trên toàn tệp. Đó là quy trình duy nhất chặn được dạng lỗi đã
   sinh ra cả năm phát hiện `high` của lượt này.

> **Một câu cho lượt vá tới:** mọi phát hiện `high` ở đây đều có dạng *"chỗ A đã sửa, chỗ B và C
> nói cùng điều đó thì chưa"*. Trước khi đóng một mục, hãy `grep` khái niệm vừa sửa — không phải
> dòng vừa sửa — trên cả 1.019 dòng. Năm lệnh `grep` là đủ để lượt này thành lượt cuối.
