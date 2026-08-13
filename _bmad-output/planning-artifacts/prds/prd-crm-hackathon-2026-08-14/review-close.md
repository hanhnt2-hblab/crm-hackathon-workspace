---
title: "Kiểm chứng đóng sổ — PRD Why Now sau mười bốn lượt sửa"
target: prd.md
baseline: review-final.md
created: 2026-08-14
kind: review
lens: closing-verification
---

# Kiểm chứng đóng sổ — tài liệu đã sạch chưa?

Bản này chạy trên `prd.md` **1.054 dòng** hiện tại (lượt trước: 1.019). Mọi con số dưới đây được
**đếm bằng máy trên chính tệp**, không lấy lại từ `review-final.md`. Nguồn đứng trên PRD —
`docs/Đề bài/Phản biện và phân tích yêu cầu.md`, Mục 0 nay chốt `D1`–`D45` — được đọc lại nguyên
văn để đối chiếu, không tin vào lời PRD tự khai về nó.

---

## 0 · Phán quyết

> **CHƯA SẠCH — còn 14 chỗ.** Nhưng hình dạng đã đổi hẳn: **1 `high`, 5 `medium`, 8 `low`**, so với
> 5 `high` + 8 `medium` + 4 `low` + 15 mục tồn đọng của lượt trước. Phát hiện `high` **duy nhất** còn
> lại không phải một khoảng trống nội dung — nó là **một câu vá bị dán nhầm chỗ**, và nó nằm đúng ở
> chỗ lượt trước đã chỉ mặt (`FR-18`, phát hiện H5/M5).

Ba điều đáng ghi:

**Một.** Lượt vá này lần đầu tiên **đóng được cả tầng tồn đọng §6** — thứ đã treo qua ba lượt.
Năm mục *chưa động tới* và một mục *sửa hụt* của lượt trước đã sạch: `§5.2` có tiêu chí đếm, `§11.1`
đọc lại đề bài `§5.3` cho đúng, `NFR-8` hoà giải với `TR-4`, `BUS-3` ⟷ `SM-1` hết cãi nhau, chữ
*hàng đợi* rút gọn biến mất, và sơ đồ §4.2 nay phủ đủ cả `high`+`doan`.

**Hai.** Tầng số học và tầng mã hiệu **sạch tuyệt đối lần thứ hai liên tiếp**, kể cả sau khi ba con
số nhãn ưu tiên bị đổi (34/16/1 → 34/15/2) — đây là loại thay đổi hay làm vỡ nhất, và bốn chỗ khai
lại đều được cập nhật đồng thời. `D1`–`D45` cũng khớp hai chiều: mọi `Dn` PRD trích đều tồn tại ở
Mục 0, và **cả 45** đều được PRD trích ít nhất một lần.

**Ba.** Dạng lỗi *"vá đúng dòng được chỉ, bỏ chỗ khác nói cùng điều"* — nguyên nhân của cả năm `high`
lượt trước — **đã giảm mạnh nhưng chưa tuyệt chủng**. Ba trong năm `high` cũ được vá **hụt**: câu vá
áp đúng chỗ, nhưng chỗ thứ hai mà chính bản phản biện đã liệt kê ra thì bỏ qua (`§4.3` dòng 254,
`FR-41` dòng 747). Và một câu vá (`M5`) không bị xoá mà bị **dời chỗ**, kéo theo phát hiện `high`
duy nhất của lượt này.

**Kết luận thao tác.** Tài liệu **đủ dùng cho bước UX và Kiến trúc**. Chỗ `high` duy nhất là một lệnh
xoá chuỗi cộng một lệnh sửa mã, không phải một quyết định nghiệp vụ. Năm chỗ `medium` đều là tham
chiếu chéo hụt, sửa được trong một lượt. Tám chỗ `low` không chặn bước nào.

---

## 1 · Phép 1 — Đối chiếu từng dòng của `review-final.md`

**29 mục duy nhất** (5 `high` · 8 `medium` · 4 `low` · 1 *sửa hụt* riêng ở §6 · 11 *chưa động tới*).

> **18 đã sửa · 7 sửa hụt · 4 chưa sửa.**

### 1.1 Năm phát hiện `high`

| Mã | Trạng thái | Bằng chứng trong PRD |
|---|---|---|
| **H1** — §8 vẫn nói `FR-14` là `nên có` | ✅ **đã sửa** | Dòng 412–415 nay là *"**Một chỗ nhãn cãi được**… `FR-28` và `FR-29` là `nên có`"*, kèm *"(`FR-14` vùng đọc **từng** bị xếp `nên có`; **đã nâng lên** `phải có` vì nó là bề mặt duy nhất `T-3` bấm vào.)"*. Con số *"Hai chỗ"* → *"Một chỗ"* ✅ |
| **H2** — `FR-40` ⟷ `FR-42` ⟷ §4.3 về nguồn `error-detection rate` | ⚠️ **sửa hụt — 2/4** | ✅ `FR-40` dòng 737–738: *"Lý do này là **tuỳ chọn**, nên nó **không** vào mẫu số của `error-detection rate` — xem `FR-42`"*. ✅ `FR-42` dòng 760–762 mang nhãn `làm chặt hơn` + *"✅ **`D30` đã sửa** ở Mục 0 ngày 14/8"*. ❌ **§4.3 dòng 254 y nguyên** *"làm dữ liệu đo cho `error-detection rate` (`D30`)"* — xem **M-1**. ❌ **§3.1 dòng 134** mẫu số vẫn thuần *Phát hiện*, không nói cách quy một Gợi ý bị bỏ về Phát hiện — xem **M-3** |
| **H3** — `FR-27` còn canh bằng *Cơ hội mở* | ✅ **đã sửa, và sửa rộng hơn đề nghị** | Dòng 632–633 *"về một Công ty **đang có ít nhất một Cơ hội đang chạy**"*; dòng 635 *"Áp cho **mọi** Cơ hội **đang chạy**"*; dòng 639–640 **thêm mới**: *"**Công ty chỉ có Cơ hội ở `tam_dung`** thì Phát hiện **không rơi mất**: nó đi vào Hàng đợi gợi ý theo `FR-18`"* — đây là chỗ bịt đúng cái lỗ mà H3 mô tả. §3.1 dòng 121 (*"`BR-B4` và `FR-27` chỉ đúng với nghĩa này"*) nay đúng ✅. Chữ *"cơ hội mở"* chỉ còn sót đúng một lần ở dòng 560, dưới dạng **trích dẫn bản cũ của `D31`** — hợp lệ |
| **H4** — `FR-51` *"vẫn đếm vào số đo"* | ⚠️ **sửa hụt** | ✅ Dòng 576–579 viết lại: *"Đây là **lý do đóng của hệ thống, không phải một lần người quyết**, nên nó **không** vào mẫu số của `auto-accept rate` lẫn `error-detection rate`"*, kèm lý giải chu kỳ demo 60 giây. ❌ Nhưng câu tiếp — *"Đếm riêng một dòng ở `FR-41`"* — trỏ vào một dòng **`FR-41` không có**. Xem **M-2** |
| **H5** — khoá xếp `FR-18` đi ngược `D31`, câu vá nhân bản | ⚠️ **sửa hụt — và đẻ ra chỗ `high` duy nhất còn lại** | ✅ Nhãn `làm chặt hơn` đã có (dòng 560–562) và `D31` đã được sửa ngược lên Mục 0 — Mục 0 dòng 309 nay viết đúng *"**so lần lượt theo thứ tự đó** — không phải một phép nhân số học"* và *"cơ hội **đang chạy**"*. ❌ Nhưng **câu nhân bản không bị xoá, chỉ bị dời** từ dòng 552 cũ xuống cuối dòng 563, và ở chỗ mới nó bị gán sai mã `D45`. Xem **H-1** |

### 1.2 Tám phát hiện `medium`

| Mã | Trạng thái | Bằng chứng |
|---|---|---|
| **M1** — nhãn `FR-51` không tra được | ✅ **đã sửa** | `FR-51` dòng 574 nay là `bỏ được`; ba con số đổi **34 · 15 · 2** ở **cả bốn** chỗ (408–410, 799–801, 934, 975). Nhãn `mở rộng ngoài đề bài` ở dòng 584 phủ toàn FR, khớp cột 3 của quy tắc `bỏ được` |
| **M2** — *"`FR-51` nằm đầu §8.3"* | ✅ **đã sửa** | Dòng 793: *"`FR-51` nằm **trong §8.3 ngay sau `FR-18`**"* |
| **M3** — ví dụ `FR-11` ở §12.5 không phải `nên có` | ✅ **đã sửa** | Dòng 980–982 đổi sang *"`FR-19` (`nên có`) bày ra bốn thứ mà `FR-20` (`phải có`) cho người bấm"* — đúng đề nghị |
| **M4** — §12.5 chỉ nhắc một vế của quy tắc `phải có` | ✅ **đã sửa** | Dòng 976–978: *"**hoặc** có một điểm `T` dựa vào, **hoặc** là một điều kiện nộp bài ở đề bài `§7` (đó là đường `FR-49` vào nhóm này)"* |
| **M5** — câu bị nhân bản ở `FR-18` | ❌ **chưa sửa (dời chỗ, không xoá)** | Dòng 557–559 nay sạch. Nhưng chuỗi *"Gợi ý điền ô trống xếp theo trọng số hoàn thiện ở `0.2.3` (`D31`, vá `F13`)"* xuất hiện lại nguyên văn ở **cuối dòng 563**, dán vào đuôi một câu khác. Xem **H-1** |
| **M6** — `FR-44` không phủ tham số PRD tự khai | ✅ **đã sửa** | Dòng 769–770: *"Cả bảng `0.2.1`, mọi tham số ở `0.2.2`, **và mọi tham số PRD này tự khai ở §3.2** — cờ ghi đè, cửa sổ Hoàn tác — đều sửa được từ đây"* |
| **M7** — `TR-5` không khớp chế độ hỏng | ✅ **đã sửa** | Dòng 844: *"đếm **hai** con số: … ô **trống**, và … ô đã điền nhưng **đã quá hạn**… **Cả hai bằng 0 thì cờ này vô dụng** — đường thoát khi đó là để lệnh nạp chừa trống Việc tiếp theo cho ít nhất một Cơ hội đang chạy"* |
| **M8** — hai lý do đóng do hệ thống không có trường | ✅ **đã sửa** | §3.2 dòng 169 thêm hẳn một dòng: `ly_do_dong_he_thong`, *"enum, nullable — *"có gợi ý mới hơn"* (`FR-51`) · *"công ty đã xoá"* (`D26`)"*, kèm *"Tách hẳn khỏi `ly_do_bo`… **không** vào mẫu số của `auto-accept rate` lẫn `error-detection rate`"*. `ly_do_bo` dòng 168 nay ghi rõ *"có, khi **người** Bỏ Gợi ý"* |

### 1.3 Bốn phát hiện `low`

| Mã | Trạng thái | Bằng chứng |
|---|---|---|
| **L1** — *"Đề bài đề bài"* nhân đôi | ⚠️ **sửa hụt — vá 2, đẻ 1** | ✅ Dòng 289 cũ → dòng 295 nay *"đề bài `§4/nhóm 1` viết…"*; dòng 922 cũ → dòng 948 nay *"đề bài `§4/nhóm 1` không đòi gì hơn"*. ❌ Nhưng **dòng 960 nay là *"Đề bài đề bài `§7` có năm điều kiện nộp bài"*** — cùng lỗi, chỗ mới. Xem **L-1** |
| **L2** — §4.3 *"bốn nhánh"* ⟷ *"ba câu"* | ✅ **đã sửa** | Dòng 234: *"nó trả lời **bốn câu** bước Kiến trúc buộc phải có đáp án"* |
| **L3** — `FR-10` hai ngoặc trích liền nhau | ✅ **đã sửa** | Dòng 473: *"**bảng thống kê lý do thua** (`FR-48`, `BR-D9`, `Q19`)"* |
| **L4** — §10.1 *"mà `§5` không đòi"* đọc mâu thuẫn | ✅ **đã sửa** | Dòng 866–867: *"kể cả ranh giới thứ tư, **chỗ đề bài `§5` không đòi mức chặn này**"* |

### 1.4 Phần §6 — tồn đọng của các lượt trước

**Sửa hụt (1 mục riêng, 3 mục còn lại trùng H2/H3/L2):**

| Mục | Trạng thái | Bằng chứng |
|---|---|---|
| regression **4.1 vế (a)** — sơ đồ §4.2 thiếu đường cho `high`+`doan` ở Công ty **có** Cơ hội đang chạy | ✅ **đã sửa** | Dòng 204–207 nay liệt kê thẳng: *"mọi Phát hiện KHÔNG đi được chạm 1 … — gồm `medium`, **`high`+`doan`**, và `high` ở Công ty không có Cơ hội"*. Cộng với `FR-27` dòng 639–640, mọi ca đều có chỗ đi |

**Chưa động tới (11 mục) — nay còn 3 nguyên vẹn:**

| Mục | Trạng thái | Bằng chứng |
|---|---|---|
| regression **2.2** — `SM-C5` đứng trước `SM-C4` | ❌ **chưa sửa** | Dòng 1018 `SM-C5`, dòng 1021 `SM-C4` — y nguyên thứ tự C1·C2·C3·**C5**·**C4** |
| regression **2.3** — `A2` ghi *§5.1, §5.3* nhưng §5.3 không mang dấu | ❌ **chưa sửa** | §5.3 (dòng 305–313) không có chuỗi `[ASSUMPTION: A2]` nào; dòng 1051 vẫn khai *"§5.1, §5.3"* |
| regression **3A** — 17 chỗ thiếu tiền tố `đề bài` | ⚠️ **sửa hụt — 17 → 4, hai chỗ nặng nhất đã đóng** | ✅ **Dòng 282 cũ** (trích `§5.1`, `§5.2` ngay trong bảng §5.1) nay là dòng 288 *"(đề bài `§5.1`, đề bài `§5.2`, `T-10`)"*. ✅ **Ba chỗ `§7.3`** nay là dòng 819, 821, 825 và đều mang tiền tố — chúng hết đọc như mã treo. ❌ Còn 4 chỗ: dòng **40** (`§1`), **400**, **934**, **942** (`§4`). Xem **L-3** |
| regression **1.3** — *"Ba chỗ chặt hơn"* §5.2 đếm không nhất quán | ✅ **đã sửa** | §5.2 nay là *"**Bốn** chỗ chặt hơn"*, bảng có **4 dòng**, và **tiêu chí đếm được viết ra** (dòng 296): *"đề bài **im lặng** hoặc **nói rộng hơn**, PRD chọn hẹp lại"*. Cả bốn dòng đều thoả tiêu chí |
| regression **4.6** — §11.1 đọc đề bài `§5.3` là *"cấm gửi bất cứ thứ gì ra ngoài"* | ✅ **đã sửa** | Dòng 905: *"đề bài `§5.3` cấm **chạm tới người thật**… *(Không phải cấm gọi mạng — xem §10.1.)*"* |
| regression **4.7** — `UJ-1` *"hạn hôm nay"* ⟷ `FR-9`/`FR-10` chỉ có *quá hạn* | ⚠️ **sửa hụt — vế số liệu xong, vế `UJ-1` ⟷ §8.1 chưa** | ✅ `FR-9` dòng 470 nay có *"**đến hạn hôm nay**, **quá hạn**, hoặc **thiếu ô**"*; `FR-10` dòng 473 *"**đến hạn hôm nay và đã quá hạn** (UJ-1 dựng trên vế *hôm nay*)"*. ❌ §8.1 dòng 425 vẫn khai *"Thực hiện UJ-1"* trong khi `UJ-1` (dòng 91–92) xoay quanh Việc tiếp theo **do hệ thống đặt** — thứ chỉ có ở §8.4. Xem **L-8** |
| regression **4.8** — `NFR-8` idempotent không điều kiện ⟷ `TR-4` | ✅ **đã sửa** | Dòng 822: *"1 lệnh, idempotent **khi chạy mặc định**; bật cờ `TR-4` thì ghi vết được giữ lại có chủ đích"* |
| regression **4.9** — `BUS-3` ⟷ `SM-1` | ✅ **đã sửa** | Dòng 999–1000: *"**Đây là số đo duy nhất đo được `BUS-1`**… Vế còn lại — `BUS-3`… **chưa có số đo nào** trong phạm vi này"* — hết xưng *"đo đúng nguyên nhân gốc"* |
| regression **5.2** — *Hàng đợi gợi ý* rút gọn thành *hàng đợi* | ✅ **đã sửa** | Quét toàn tệp: **0** lần xuất hiện chuỗi *hàng đợi* không đi kèm *gợi ý* |
| regression **5.3** — lỗi nhân bản *"Hàng đợi gợi ý / gợi ý và thông báo"* ở §11.1 | ❌ **chưa sửa** | Dòng 913–914 nguyên văn: *"…vẫn dùng để **định tuyến**: Hàng đợi gợi ý / gợi ý và thông báo đi tới người sở hữu"* — vẫn đọc thành *"Hàng đợi gợi ý gợi ý"*. Xem **M-4** |
| regression **5.5–5.9** — bốn tật từ vựng | ⚠️ **sửa hụt — 4/5** | ✅ *Sửa-rồi-duyệt*: **9/9** lần dùng gạch nối, **0** lần viết rời. ✅ **0** lần dùng *người vận hành* thay **Quản trị**. ✅ **0** bí danh khác của `auto-accept rate` (*tỉ lệ duyệt*, *tỉ lệ tự duyệt*). ❌ §3.1 ⟷ §3.2 vẫn lệch: dòng 164 viết `signalSubtype` (camelCase) trong khi dòng 162 viết `signal_subtype` và dòng 156 tự đặt quy ước `snake_case`. Xem **L-6** |

---

## 2 · Phép 2 — Con số tự khai, đếm bằng máy

**Kết quả: SẠCH — 0 chỗ hỏng.** Kể cả sau khi ba con số nhãn ưu tiên bị đổi trong chính lượt này.

| Tài liệu tự khai | Ở đâu | Đếm thật | |
|---|---|---|---|
| **51 FR** | §8.7 tiêu đề (791), §12.1 (934) | 51 khối `**FR-n ·**`, số hiệu **1–51 liên tục**, không trùng, không nhảy | ✅ |
| **34** `phải có` · **15** `nên có` · **2** `bỏ được` | §8 bảng quy tắc (**408–410**) · §8.7 bảng tra (**799–801**) · §12.1 (**934**) · §12.5 (**975**) | **Cả bốn chỗ ghi 34 · 15 · 2** — không chỗ nào sót lại 16/1 | ✅ |
| — nhãn thật trên từng khối FR | §8.1–§8.6 | `phải có` = {1–12, 14, 15, 18, 20–23, 27, 30–33, 35–37, 39, 45–50} = **34** · `nên có` = {13, 16, 17, 19, 24, 25, 28, 29, 34, 38, 40–44} = **15** · `bỏ được` = {26, 51} = **2**. **Ba danh sách mã ở §8.7 khớp từng phần tử** — không thiếu, không thừa, không mã nào nằm nhầm hàng | ✅ |
| Quy tắc `bỏ được` (*"cả FR mang nhãn `mở rộng ngoài đề bài`"*) | 410 | Đúng **2** FR mang nhãn ấy ở cấp toàn FR: `FR-26` (623) và `FR-51` (584). Bốn chỗ còn lại (`FR-3` 439, `FR-35` 699, `FR-40` 739, §4.3 266) là mở rộng **một gạch đầu dòng**, đúng ngoại lệ quy tắc tự nêu | ✅ |
| Bảng "mục nào chứa FR nào" | 803–804 | §8.1 `1–10,48,49` · §8.2 `11,50,12–17` · §8.3 `18,51,19–26` · §8.4 `27–34` · §8.5 `35–40` · §8.6 `41–47` — **khớp đúng thứ tự xuất hiện thật** | ✅ |
| **26 hành động** ma trận §6 | 349 | 26 dòng dữ liệu (28 dòng `|` trừ tiêu đề và vạch) | ✅ |
| **Bốn dòng in đậm** = toàn bộ khác biệt Sales ⟷ Quản trị | 349, `A4` | Đúng 4 dòng in đậm (329, 344, 345, 346), và **đúng 4 dòng đó là toàn bộ dòng có cột Sales khác cột Quản trị** — đã đối chiếu từng ô, 22 dòng còn lại đều ✅/✅, ❌/❌ hoặc —/— | ✅ |
| **11** luật định nghĩa · **6** luật hành vi | §7 (357) | `BR-D1`…`BR-D11` = 11 · `BR-B1`…`BR-B6` = 6 | ✅ |
| **Ba ngoại lệ** non-functional | 358–359 | `BR-D6`, `BR-B5`, `BR-B6` = 3 | ✅ |
| **13 NFR** §9.1 · **4** §10.1 | 813–827, 856–861 | 13 + 4 = 17, `NFR-1`…`NFR-17` liên tục | ✅ |
| **5 TR** · **3 BUS** | §9.2, §1 | `TR-1`…`TR-5` · `BUS-1`…`BUS-3` | ✅ |
| **Bốn nhánh** §4.3 | tiêu đề 232, thân 234 | nạp · đọc · ra biên · xoá = 4; và *"bốn câu"* ✅ (L2 đã vá) | ✅ |
| **Ba trần lưu giữ** §4.3 | 260 | 3 dòng bảng | ✅ |
| **Bốn chỗ chặt hơn** §5.2 | tiêu đề 293, thân 296 | 4 dòng bảng (300–303), và tiêu chí gom nay viết ra được | ✅ |
| **Ba chạm** · **ba nhánh ngoại lệ** §4.2 | 197, 219 | 3 · 3 | ✅ |
| **Bốn ranh giới** §10.1 · **ba mức quyền ghi** §10.2 | 851, 874 | 4 · 3 | ✅ |
| **7** Giai đoạn · **5** *Đang mở* · **4** *Đang chạy* | §3.1 (119–121) | 7 giá trị liệt kê đủ · 4+`tam_dung`=5 · 4 | ✅ |
| **5** Loại công ty · **6** Loại tin · **3** Mức chắc chắn · **3** Độ liên quan · **5** `ly_do_bo` · **13** `signal_subtype` | §3.1, §3.2, `FR-20` | 5 giá trị liệt kê đủ · 6 · 3 · 3 · 5 · 13 giá trị liệt kê đủ, và *"12 giá trị kia"* + `unclassified` = 13 | ✅ |
| **5** vai còn lại · **7** vai hệ thống thật | §2.2, `TR-2` | `am`,`presales`,`manager`,`sales_admin`,`bod` = 5 · (5+2) = 7 | ✅ |
| **5** điều kiện nộp bài = 3 trong PRD + 2 ngoài | §12.4 (960–969) | 3+2 = 5; sáu mã NFR trỏ về ba điều kiện kia (`NFR-5,7,8,11,12,13`) đều tồn tại | ✅ |
| **3** `UJ` · **5** `An` · **5** `SM-n` · **5** `SM-Cn` | §2.3, §15, §13 | 3 · 5 · 5 · 5 | ✅ |

---

## 3 · Phép 3 — Mã treo và tham chiếu

### 3.1 Mã hiệu nội bộ — dò toàn tệp

| Họ mã | Dãy | Liên tục? | Trùng? | Mọi chỗ trích đều tồn tại? |
|---|---|---|---|---|
| `FR-n` | 1–51 | ✅ | không | ✅ |
| `BR-Dn` | 1–11 | ✅ | không | ✅ |
| `BR-Bn` | 1–6 | ✅ | không | ✅ |
| `NFR-n` | 1–17 | ✅ | không | ✅ |
| `TR-n` | 1–5 | ✅ | không | ✅ |
| `BUS-n` | 1–3 | ✅ | không | ✅ |
| `SM-n` | 1–5 | ✅ | không | ✅ |
| `SM-Cn` | 1–5 | ✅ | không | ✅ *(thứ tự trình bày vẫn C1·C2·C3·**C5**·C4 — xem **L-4**)* |
| `UJ-n` | 1–3 | ✅ | không | ✅ |
| `An` | 1–5 | ✅ | không | ✅ |
| `T-n` | 1–10 | ✅ | không | ✅ |

**0 mã treo, 0 mã trùng, 0 dãy nhảy số** ở cả 11 họ.

### 3.2 Mã hiệu ngoại — đối chiếu với nguồn thật

| Họ | PRD trích | Nguồn có | Kết quả |
|---|---|---|---|
| `Dn` | `D1`–`D45`, **đủ cả 45** | Mục 0 định nghĩa `D1`–`D45` | ✅ **khớp hai chiều** — không mã treo, không mã nào bị bỏ quên |
| `Fn` | 21 mã (`F1`,`F2`,`F7`–`F9`,`F11`–`F14`,`F18`,`F19`,`F26`,`F28`–`F32`,`F36`–`F39`) | `F1`–`F40` | ✅ đều tồn tại |
| `Qn` | 6 mã (`Q6`,`Q10`,`Q12`,`Q15`,`Q16`,`Q19`) | `Q1`–`Q22` | ✅ đều tồn tại |
| `0.x.y` | `0.1.1`–`0.1.7`, `0.2.1`–`0.2.3` | Mục 0.1 có 7 tiểu mục, Mục 0.2 có 3 | ✅ đều tồn tại |

### 3.3 Tiền tố `đề bài` và lẫn `§n.n` nội bộ

**Tham chiếu nội bộ:** dò từng chỗ — §3.1, §3.2, §5.1, §5.2, §5.3, §6, §8, §8.1–§8.6, §9.1, §9.2,
§10.1, §10.2 — **mọi tham chiếu đều trỏ tới một mục có thật**. Dòng 985 (*"bốn ranh giới `§10.1`"*)
và dòng 906 (*"xem §10.1"*) là tham chiếu nội bộ đúng, không phải vi phạm tiền tố.

**Tham chiếu ra đề bài:** 17 chỗ thiếu tiền tố → **còn 4**. Xem **L-3**. Hai ổ nguy hiểm nhất đã
đóng: dòng 288 (trong bảng §5.1) và ba chỗ `§7.3`.

**Chỗ lẫn còn lại:** cả 4 chỗ sót đều là `§1`/`§4` — và PRD **cũng có** §1 và §4 của riêng nó, nên
đây đúng là loại lẫn Phép 3 nhắm tới. Ngược lại, dòng 326 làm mẫu đúng: *"❌ đề bài `§5.1` · bảng
chuyển tiếp ở **§5.1 của PRD**"* — phân biệt tường minh trong cùng một ô.

---

## 4 · Phép 4 — Nhất quán với Mục 0 vừa sửa

Đọc lại nguyên văn `D16`, `D30`, `D31`, `D42`–`D45` ở Mục 0, đối chiếu với mọi chỗ PRD nói về chúng.

| `Dn` | Mục 0 nay nói gì | PRD nói gì | Khớp? |
|---|---|---|---|
| **`D16`** (Mục 0 dòng 272) | mức *tự do* nay gồm *"**điền ô Việc tiếp theo đang trống của cơ hội đang chạy**, vì `§4/nhóm 4` nói thẳng… *không hỏi ai*"* | §10.2 bảng dòng 880 *"Thêm mục Dòng thời gian (nhóm 5) · **điền ô Việc tiếp theo đang trống (nhóm 4)**"*; §6 dòng 331 ✅ | ⚠️ **bảng khớp, lời dẫn không** — xem **M-5** |
| **`D30`** (dòng 308) | *"**đúng hai nguồn vào mẫu số**: nút *không hữu ích*…, và lý do `thong_tin_sai` khi bỏ một gợi ý. Lý do ngắn khi Sales xoá mục… **không** vào mẫu số"* | `FR-42` (756–759) khớp **nguyên văn** ✅ · `FR-40` (737–738) ✅ · §3.2 dòng 168 *"một trong hai nguồn"* ✅ | ⚠️ **3/4 chỗ khớp** — §4.3 dòng 254 lệch, xem **M-1** |
| **`D31`** (dòng 309) | *"bộ ba (`relevance`, mức chắc chắn, công ty có cơ hội **đang chạy** hay không), **so lần lượt theo thứ tự đó** — không phải một phép nhân số học… Gom theo công ty là khoá ngoài. Gợi ý điền ô trống xếp theo trọng số hoàn thiện ở 0.2.3"* | `FR-18` dòng 555–559 khớp **từng vế** ✅ | ⚠️ **nội dung khớp, mã gán sai** — xem **H-1** |
| **`D42`** (dòng 330) | trường *giai đoạn mở gần nhất*; *"Đi từ `tam_dung` sang `thang`/`thua` thì **giữ nguyên** giá trị đã lưu, không ghi đè bằng `tam_dung`"* | §3.1 dòng 142 (*"Không bao giờ nhận giá trị `tam_dung`"*) · §3.2 dòng 161 · §5.1 dòng 283, 285, 286 (*"đi từ `tam_dung` thì **giữ nguyên** giá trị đã lưu"*) · §5.3 dòng 311 | ✅ **khớp mọi chỗ** |
| **`D43`** (dòng 331) | *"Mở lại cơ hội đã đóng chỉ vai Quản trị"*, quan hệ = **làm chặt hơn** | §5.1 dòng 287 · §5.2 dòng 300 (`D43`) · §6 dòng 329 · `A5` dòng 1054 | ✅ **khớp**, nhãn `làm chặt hơn` dùng nhất quán |
| **`D44`** (dòng 332) | *"Cơ hội mới luôn bắt đầu ở `tiep_can`"*, quan hệ = **làm chặt hơn** | §5.1 dòng 280 ✅ · §5.2 dòng 303 (`D44`, trong bảng *chặt hơn*) ✅ · `FR-3` dòng 439 gọi nó là **`mở rộng ngoài đề bài`** ✗ | ⚠️ **lệch nhãn** — xem **L-7** |
| **`D45`** (dòng 333) | *"Phát hiện có `relevance = low` **không** vào hàng đợi gợi ý"* | `FR-18` dòng 569 khớp **nguyên văn** ✅ · §14 dòng 1041 khớp ✅ · **nhưng dòng 563 gán `D45` cho quyết định khoá xếp** ✗ | ❌ **mâu thuẫn nội bộ** — xem **H-1** |

**Bảng §14 (dòng 1033–1041)** — bảng PRD tự khai *"đã sửa gì ở Mục 0"* — **đúng cả bảy dòng**. Chính
nó là bằng chứng đối chứng cho **H-1**: §14 nói `D45` là luật `low`, dòng 563 nói `D45` là quyết
định khoá xếp. Một trong hai sai, và Mục 0 xử §14 thắng.

---

## 5 · Phép 5 — Lỗi mới do lượt vá cuối

Ba chỗ, và cả ba đều là **thiệt hại kèm theo của một câu vá**, không phải lỗ hổng nội dung:

1. **Dòng 563** — câu vá `M5` bị **dời** thay vì bị xoá, rồi dán vào đuôi bullet `làm chặt hơn`, kéo
   theo một mã `D45` sai. Đây là chỗ `high` duy nhất còn lại → **H-1**.
2. **Dòng 960** — lượt quét thêm tiền tố `đề bài` chạy đè lên một chỗ vốn đã mở đầu bằng *"Đề bài"*,
   đẻ ra đúng lỗi mà `L1` vừa dọn ở hai chỗ khác → **L-1**.
3. **Dòng 632–633** — câu vá `H3` chèn `**đang chạy**` vào giữa một cụm đã in đậm, thành
   `**đang có ít nhất một Cơ hội **đang chạy**` — dấu `**` mất cân bằng → **L-2**.

Ngoài ba chỗ này, **không câu vá nào làm hỏng câu khác**. Đặc biệt: đổi ba con số 34/16/1 → 34/15/2
không làm vỡ chỗ nào (Phép 2 sạch), và nâng `FR-51` lên `bỏ được` không phá quy tắc §8 (`FR-51` mang
nhãn `mở rộng ngoài đề bài` toàn FR, đúng cột 3).

---

## 6 · Danh sách phát hiện còn lại — 14 chỗ

### 6.1 Mức `critical` — **không có**

### 6.2 Mức `high` — 1 chỗ

#### **H-1 · Dòng 563 gán `D45` cho quyết định khoá xếp, và kéo theo câu vá nhân bản chưa xoá**

**Ở đâu:** dòng **560–563** (`FR-18`) ⟷ dòng **569** (`FR-18`, cùng khối) ⟷ dòng **1041** (§14)
⟷ `D45` ở Mục 0 dòng 333.

Dòng 560–563 hiện nguyên văn:

> *"- `làm chặt hơn` — `D31` viết khoá xếp dưới dạng tích ba yếu tố và dùng chữ *"cơ hội mở"*. PRD
> đọc nó thành **so lần lượt**… ✅ **`D31` đã sửa** ở Mục 0 ngày 14/8, **và quyết định này thành
> `D45`** Gợi ý điền ô trống xếp theo trọng số hoàn thiện ở `0.2.3` (`D31`, vá `F13`)"*

Hai lỗi chồng lên nhau trong một câu:

**(a) Mã sai.** `D45` ở Mục 0 là *"Phát hiện có `relevance = low` **không** vào hàng đợi gợi ý"* —
không dính gì tới khoá xếp. Quyết định khoá xếp được sửa **ngược vào chính `D31`**, không sinh mã
mới. §14 dòng 1037 và 1041 của chính PRD nói đúng điều đó. Kết quả: **`D45` được PRD gán cho hai
thứ khác nhau, cách nhau sáu dòng** — dòng 563 (khoá xếp) và dòng 569 (luật `low`).

**(b) Câu nhân bản chưa xoá.** Cụm *"Gợi ý điền ô trống xếp theo trọng số hoàn thiện ở `0.2.3`
(`D31`, vá `F13`)"* là đúng mảnh mà `M5` yêu cầu **bỏ**. Nó đã được gỡ khỏi dòng 552 cũ, nhưng
không bị xoá — nó được dán vào đuôi một câu hoàn toàn khác. Đọc liền mạch, câu thành vô nghĩa:
*"quyết định này thành `D45` Gợi ý điền ô trống xếp theo trọng số hoàn thiện ở 0.2.3"*. Nội dung
này cũng đã được nói đủ ở dòng 558–559 rồi.

**Vì sao là `high`:** đây là **mã treo có nội dung** — thứ nguy hiểm hơn mã treo rỗng. Bước Kiến
trúc tra `D45` sẽ nhận về hai định nghĩa mâu thuẫn từ chính PRD, và cách duy nhất để biết cái nào
đúng là mở Mục 0 — tức là đúng thứ hệ mã hiệu dựng ra để khỏi phải làm. Nó cũng là chỗ **duy nhất**
trong toàn bộ 11 họ mã có mã trỏ sai.

**Sửa:** cắt dòng 563 tại dấu chấm sau *"ngày 14/8"*:
> *"…**Rủi ro nghiệm thu: không** — không điểm `T` nào kiểm thứ tự Hàng đợi gợi ý. ✅ **`D31` đã
> sửa** ở Mục 0 ngày 14/8, nên PRD và `D31` nay nói cùng một điều (`vá F13`)."*

Xoá hẳn phần còn lại. Rồi `grep` chuỗi `D45` trên toàn tệp — phải còn đúng **hai** chỗ: dòng 569 và
dòng 1041.

### 6.3 Mức `medium` — 5 chỗ

| # | Ở đâu | Vấn đề | Sửa |
|---|---|---|---|
| **M-1** | dòng **254** (§4.3, nhánh xoá) ⟷ dòng **737–738** (`FR-40`) ⟷ dòng **756–759** (`FR-42`) | Vế thứ ba của **H2 chưa được vá**. §4.3 vẫn viết mục Dòng thời gian bị xoá *"Bản ghi **vẫn còn** làm dữ liệu đo cho `error-detection rate` (`D30`)"*, trong khi `FR-40` và `FR-42` vừa được sửa để nói lý do ngắn khi xoá là **tuỳ chọn** và **không vào mẫu số**. `D30` mới cũng chỉ nói xoá mềm để *"vẫn còn làm dữ liệu đo"* chung chung, **không** gắn vào `error-detection rate`. Tỉ số nay là 2–1 nghiêng về đúng, nhưng chỗ sai lại là chỗ bước Kiến trúc đọc để thiết kế **luồng dữ liệu** | → *"Bản ghi **vẫn còn** để đối chiếu và tra cứu; lý do ngắn là tuỳ chọn nên **không** vào mẫu số số đo nào (`FR-40`, `FR-42`)"* |
| **M-2** | dòng **577** (`FR-51`) · dòng **169** (§3.2) ⟷ dòng **747–749** (`FR-41`) | `FR-51` chốt *"Đếm riêng một dòng ở `FR-41`"* — nhưng `FR-41` liệt kê đủ số đo màn hình Quản trị và **không có** dòng nào nhận loại sự kiện này. Đây là **tham chiếu tiến tới một mục không tồn tại**: bản vá `H4` đã đẩy Gợi ý bị thay thế ra khỏi hai mẫu số nhưng không cho nó chỗ đáp. Cùng lỗ hổng áp cho `ly_do_dong_he_thong` ở §3.2, vốn cũng chỉ khai *không vào đâu* mà không khai *vào đâu* | `FR-41` thêm một vế vào danh sách: *"· **số Gợi ý bị thay thế** và số Gợi ý bị đóng do Công ty đã xoá (`FR-51`, `ly_do_dong_he_thong`) — để thấy Hàng đợi có đang tự nhân lên không"* |
| **M-3** | dòng **134** (§3.1) ⟷ dòng **168** (§3.2) ⟷ `D30` | Vế thứ tư của **H2 chưa được vá**. Mẫu số `error-detection rate` vẫn là *"tổng số **Phát hiện** có phản hồi"*, trong khi một trong hai nguồn tử số — `ly_do_bo = thong_tin_sai` — là thuộc tính của **Gợi ý**, không phải Phát hiện. Không có dòng nào nói cách quy một Gợi ý bị bỏ về Phát hiện đã sinh ra nó, nên **mẫu số hiện không tính được**. *(Ghi nhận công bằng: `D30` mới ở Mục 0 mang đúng lỗ hổng này, nên PRD đang **nhất quán với nguồn**; nhưng nguồn nhất quán không làm số đo tính được.)* | §3.1 dòng 134 thêm: *"Một Gợi ý bị Bỏ với lý do `thong_tin_sai` được quy về **Phát hiện đã sinh ra nó**; một Phát hiện có nhiều phản hồi chỉ đếm một lần."* Kèm một dòng *Việc phải làm ngoài PRD:* sửa `D30` cho khớp |
| **M-4** | dòng **913–914** (§11.1) | Lỗi nhân bản đã nêu từ `review-regression.md` 5.3, qua hai lượt vá vẫn nguyên: *"vẫn dùng để **định tuyến**: Hàng đợi gợi ý / gợi ý và thông báo đi tới người sở hữu"*. Đọc liền mạch thành *"Hàng đợi gợi ý gợi ý và thông báo"*. Đây là dấu vết của lượt đổi *hàng đợi* → *Hàng đợi gợi ý* (regression 5.2) chạy đè lên một câu vốn đã viết *"gợi ý và thông báo"* | → *"…vẫn dùng để **định tuyến**: Gợi ý và thông báo đi tới người sở hữu (`FR-18`, `FR-31`)"* |
| **M-5** | dòng **884–890** (§10.2, khối trích dẫn) | Khối này vẫn khai ở **thì hiện tại** rằng nguồn có thẩm quyền đang sai: *"`D16` xếp mức *tự do* gồm… **không** nhắc ô Việc tiếp theo… nên bảng trên đúng và **`D16` đang thiếu một ô**"* — rồi ngay dưới là *"✅ **Đã bổ sung vào `D16`** ở Mục 0 ngày 14/8"*. Hai câu phủ định nhau trong cùng một khối, và `D16` ở Mục 0 dòng 272 **đã có** ô đó. Ai đọc §10.2 rồi mở `D16` để "sửa cho khớp" sẽ không tìm thấy việc gì để làm | Viết lại thành thì quá khứ: *"`D16` **từng** xếp mức *tự do* gồm… **không** nhắc ô Việc tiếp theo. Nhưng đề bài `§4/nhóm 4` nói thẳng…, nên theo quy tắc thẩm quyền đề bài thắng. ✅ **Đã bổ sung vào `D16`** ở Mục 0 ngày 14/8 — PRD và `D16` nay nói cùng một điều."* Cùng cách xử lý áp cho dòng 560 (`FR-18`) và 760 (`FR-42`) — xem **L-5** |

### 6.4 Mức `low` — 8 chỗ

| # | Ở đâu | Vấn đề | Sửa |
|---|---|---|---|
| **L-1** | dòng **960** | *"**Đề bài đề bài** `§7` có năm điều kiện nộp bài"* — chữ nhân đôi, do lượt quét thêm tiền tố chạy đè lên một chỗ vốn đã mở đầu bằng *"Đề bài"*. Đúng lỗi `L1` vừa dọn ở dòng 295 và 948 | Bỏ một cụm: *"Đề bài `§7` có năm điều kiện nộp bài"* |
| **L-2** | dòng **632–633** (`FR-27`) | Dấu in đậm mất cân bằng: `**đang có ít nhất một Cơ hội **đang chạy**,` — ba mốc `**` liên tiếp. Trình dựng markdown sẽ đóng đậm ở *"Cơ hội "*, để *"đang chạy"* thành chữ thường, rồi mở đậm lại từ dấu phẩy. Nhấn mạnh rơi vào đúng những chữ không cần nhấn | → *"…về một Công ty **đang có ít nhất một Cơ hội đang chạy**, hệ thống tự điền…"* |
| **L-3** | dòng **40** (`§1`) · **400**, **934**, **942** (`§4`) | 4 chỗ cuối cùng còn thiếu tiền tố `đề bài` (từ 17). Cả bốn đều lẫn được với mục **của chính PRD**: PRD có §1 *Tầm nhìn* và §4 *Quy trình đầu-cuối*. Dòng 85 (*"nên `§2` của đề bài miễn…"*) dùng dạng hậu tố, chấp nhận được | Thêm tiền tố ở 4 chỗ. Sau đó `grep` `` `§ `` — mọi kết quả phải hoặc mang tiền tố `đề bài`, hoặc là §n.n nội bộ |
| **L-4** | dòng **1018**, **1021** (§13.3) | `SM-C5` vẫn đứng trước `SM-C4`. Nêu từ `review-regression.md` 2.2, chưa động qua hai lượt. Không sai nội dung, nhưng §13.3 là mục người đọc quét bằng mắt theo số | Hoán vị hai gạch đầu dòng |
| **L-5** | dòng **560** (`FR-18`) · dòng **760** (`FR-42`) | Nhãn `làm chặt hơn` nay **vô hiệu**: sau khi `D31` và `D30` được sửa ngược lên Mục 0, PRD **không còn** chặt hơn chúng ở hai chỗ này — hai bên nói cùng một điều. Giữ nhãn khiến bước Kiến trúc tưởng còn một khoảng lệch phải cân nhắc. Cả hai đều đã có dòng ✅ ghi nhận việc sửa nguồn, nên đây là tật diễn đạt chứ không phải sai dữ kiện | Đổi `làm chặt hơn` → *"`đã hoà giải` — PRD từng đọc `D31` khác…, nay `D31` đã sửa theo, hai bên khớp"*. Cùng cách với **M-5** |
| **L-6** | dòng **164** (§3.2) | `relevance` khai *"Suy ra từ Loại tin và `signalSubtype`"* — **camelCase**, trong khi dòng 162 viết `signal_subtype` và dòng 156 tự đặt quy ước *"`snake_case`, khớp cách Mục 0 viết (`signal_type`, `signal_subtype`)"*. Bảng vi phạm quy ước do chính nó đặt ra ba dòng trước. Nêu từ regression 5.9 | → `signal_subtype` |
| **L-7** | dòng **439** (`FR-3`) ⟷ dòng **303** (§5.2) ⟷ `D44` | Cùng một quyết định mang **hai nhãn khác nhau**: `FR-3` gọi `D44` là `mở rộng ngoài đề bài`, còn §5.2 xếp nó vào bảng *"Bốn chỗ chặt hơn"* và Mục 0 dòng 332 ghi cột quan hệ = **làm chặt hơn**. Theo tiêu chí §5.2 tự nêu (*đề bài im lặng, PRD chọn hẹp lại*) thì `làm chặt hơn` đúng, `FR-3` sai. Không đổi con số nào — nhãn của `FR-3` nằm ở một gạch đầu dòng nên không rơi vào quy tắc `bỏ được` | `FR-3` dòng 439 → *"`D44`, `làm chặt hơn` — đề bài không nói trạng thái khởi đầu…"* |
| **L-8** | dòng **425** (§8.1) ⟷ dòng **90–95** (`UJ-1`) ⟷ dòng **630** (§8.4) | §8.1 — nhóm CRM làm tay, nhóm **duy nhất** chạy khi phần AI tắt sạch — vẫn khai *"Thực hiện UJ-1"*. Nhưng `UJ-1` xoay quanh *"một cơ hội có Việc tiếp theo **do hệ thống đặt**"*, tức nhóm 4; §8.4 dòng 630 cũng khai *"Thực hiện UJ-1"*. Vế `FR-9`/`FR-10` của regression 4.7 đã vá xong, riêng vế này chưa. Đọc §8.1 rồi cắt theo `T-1` thì không thấy vấn đề, nhưng bước UX dựng màn hình theo `UJ-1` sẽ không rõ nửa nào thuộc nhóm nào | §8.1 → *"Bày ra **bề mặt** của `UJ-1` — màn hình tổng quan và ô Việc tiếp theo; vế *do hệ thống đặt* thuộc §8.4"* |

---

## 7 · Chỗ đi tìm mà không thấy gì đáng báo

Ghi ra để lượt sau không soát lại:

- **Ba con số nhãn ưu tiên sau khi đổi** — 34/15/2 khớp ở cả bốn chỗ phát biểu, và **ba danh sách mã
  ở §8.7 khớp từng phần tử** với nhãn thật trên 51 khối FR. Đây là loại thay đổi vỡ nhiều nhất, và
  nó không vỡ.
- **`D1`–`D45` khớp hai chiều** — không `Dn` nào PRD trích mà Mục 0 không có, và không `Dn` nào Mục 0
  có mà PRD bỏ quên. Kể cả bốn mã mới `D42`–`D45`.
- **Ma trận §6 ⟷ §10.2 ⟷ §5.1** — đối chiếu lại từng ô sau khi `D16` đổi: không cặp nào ngược nhau.
  Dòng *Điền ô Việc tiếp theo đang trống* nay khớp cả ba bảng lẫn `D16` mới.
- **`D42` qua bốn chỗ** — §3.1 dòng 142, §3.2 dòng 161, §5.1 dòng 283/285/286, §5.3 dòng 307–313. Luật
  ghi *giữ nguyên khi đi từ `tam_dung`* nhất quán ở mọi chỗ, và *"không bao giờ nhận giá trị
  `tam_dung`"* suy ra được từ chính luật ghi. Không mâu thuẫn.
- **Bảng chuyển tiếp §5.1 ⟷ §5.2 sau khi lên bốn dòng** — cả bốn dòng đều thoả tiêu chí gom mới, và
  hai chuyển tiếp bị cấm ở dòng 290–291 đều nằm gọn trong dòng *"mọi chuyển tiếp ngoài bảng"*.
- **`FR-51` sau khi đổi sang `bỏ được`** — vẫn thoả quy tắc §8 (mang `mở rộng ngoài đề bài` toàn FR),
  và §12.5 *"cắt `bỏ được` trước"* không kéo theo hệ quả nào: không điểm `T` nào chạm `FR-51`.
- **`TR-5` sau khi vá `M7`** — hai con số đếm nay phủ đúng hai chế độ hỏng mà `FR-34` mô tả, và đường
  thoát thứ hai không đụng `NFR-8` (nó sửa dữ liệu nạp, không sửa tính idempotent).
- **§12.4 và sáu mã NFR** — `NFR-5`, `NFR-7`, `NFR-8`, `NFR-11`, `NFR-12`, `NFR-13` đều tồn tại và
  đều trỏ về đúng một trong ba điều kiện nộp bài; `NFR-12` là con trỏ có chủ đích, không phải dòng rỗng.

---

## 8 · Thứ tự vá đề nghị

1. **H-1** — hai lệnh trên dòng 563: cắt câu, sửa mã. Rồi `grep D45` — phải còn đúng hai chỗ.
2. **M-1, M-2, M-3** — ba tham chiếu chéo hụt, cùng đụng hai mẫu số. Vá một lượt, và sau mỗi lần
   thay thì `grep` **khái niệm** (`error-detection rate`, `mẫu số`, `FR-41`) chứ không grep dòng.
3. **M-4, M-5** — hai lỗi văn bản, mỗi cái một câu.
4. **L-1** → **L-8**, làm một lượt bằng thay chuỗi.

> **Một câu cho lượt vá tới:** cả ba chỗ hỏng mới của lượt này đều sinh ra từ **một lệnh thay chuỗi
> chạy đè lên chỗ đã đúng** — thêm tiền tố lên chỗ đã có tiền tố, chèn dấu đậm vào cụm đã đậm, dời
> một mảnh thay vì xoá nó. Sau mỗi lệnh thay chuỗi hàng loạt, `grep` chính chuỗi **kết quả** để bắt
> chỗ nhân đôi. Đó là năm giây, và nó đóng đúng dạng lỗi duy nhất còn lại của tài liệu này.
