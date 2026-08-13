---
title: "Why Now — CRM AI-Native cho Sales HBLAB"
status: final
created: 2026-08-14
updated: 2026-08-14
---

# PRD: Why Now

## 0. Mục đích tài liệu

Tài liệu này dành cho bước **UX**, **Kiến trúc** và **Epic & Story** đọc tiếp. Nó nói *hệ thống
phải làm gì và cư xử ra sao*, không nói *dựng bằng gì* — lựa chọn công nghệ thuộc bước Kiến trúc.

**Nó không định nghĩa lại thứ đã có nguồn.** Ba tài liệu đứng trên nó, theo đúng thứ tự ưu tiên:

| Hạng | Nguồn | Có thẩm quyền về |
|---|---|---|
| 1 | [Đề bài chính thức](../../../../docs/Đề%20bài/Yêu%20Cầu%20đề%20bài%20chính%20thức%20của%20cuộc%20thi%20prd.md) | Cái gì phải có · hành vi hệ thống · bộ nghiệm thu `T-1`…`T-10` |
| 2 | [Mục 0 của bản phản biện](../../../../docs/Đề%20bài/Phản%20biện%20và%20phân%20tích%20yêu%20cầu.md) | Mọi chi tiết đề bài để trống: enum, ngưỡng, con số — `D1`–`D45` |
| 3 | [Product brief](../../briefs/brief-crm-hackathon-2026-08-14/brief.md) | Vấn đề, trạng thái mong muốn, phạm vi, tiêu chí thành công |

**PRD này chỉ thêm ba thứ ba tài liệu trên không có**, và đó là lý do nó tồn tại:

1. **Quy trình đầu-cuối** (§4) — thứ tự công việc thật, trước khi bàn tính năng
2. **Vòng đời cơ hội có điều kiện canh** (§5) — cả đề bài lẫn hệ thống thật đều chỉ liệt kê trạng
   thái, không nói chuyển tiếp nào được phép và canh bằng gì
3. **Ma trận vai × hành động** (§6) và **luật nghiệp vụ tách hai loại** (§7)

Mỗi yêu cầu trong tài liệu đều xếp được vào đúng một loại: `business` · `stakeholder` ·
`functional` · `non-functional` · `transition`. Loại ghi kèm mỗi mục.

**Hình thái bài toán** kế thừa từ brief, không quyết lại: **vòng đời bản ghi** làm nền, mượn **nền
tảng dữ liệu** cho tầng đọc tin. Đó là lý do §5, §6, §7 tồn tại và được đặt trước §8 Tính năng.

## 1. Tầm nhìn — `business`

Thông tin quyết định *"why now"* đều là nguồn công khai ai cũng lấy được, nhưng đọc chúng là việc
tăng tuyến tính theo số công ty, còn quỹ giờ của người thì cố định. Đó là nguyên nhân gốc của cả
hai nỗi đau đề bài nêu ở đề bài `§1` — hồ sơ luôn cũ, và gõ tay ăn hết buổi sáng.

**Why Now** là một CRM dùng tay được trọn vẹn, cộng một lớp AI đọc nguồn công khai và **tự ghi
những gì nó đủ chắc**, chỉ đẩy lại cho người phần thật sự cần phán đoán. Ranh giới đó là điểm khác
biệt: một hệ thống đẩy *toàn bộ* kết quả vào Hàng đợi gợi ý chờ duyệt thì không xoá chi phí chú ý, nó
chỉ đổi tên công việc từ *đọc tin* sang *duyệt Hàng đợi gợi ý*.

Quyền tự ghi chỉ tồn tại được nhờ một ràng buộc đứng **trước** nó: mọi thứ máy ghi phải truy được
về nguồn đúng câu chữ, phân biệt được fact với suy luận ngay bằng mắt, và hoàn tác được dễ hơn cả
lúc máy ghi.

**Ba yêu cầu nghiệp vụ**, tức thứ tổ chức muốn đạt — khác với thứ hệ thống phải làm:

| Mã | Yêu cầu nghiệp vụ | Đo bằng |
|---|---|---|
| `BUS-1` | Giảm **số quyết định** người phải ra mỗi sáng, không phải giảm số thao tác gõ | `SM-1` |
| `BUS-2` | Giữ **niềm tin** của Sales vào dữ liệu trong CRM — một dòng sai tệ hơn một dòng trống | `SM-2`, `SM-4` |
| `BUS-3` | Chạm được tín hiệu **trong cửa sổ cơ hội** của nó, tức không mất *Right Timing* | Chưa đo được trong phạm vi này — cần dữ liệu đối chứng không dựng nổi trong 4,5 tiếng. Ghi ra để không ai tưởng đã đo |

`BUS-3` là yêu cầu **gần kết quả kinh doanh nhất** mà cũng là yêu cầu duy nhất chưa có số đo. Đó là
giới hạn thật của bản này, không phải chỗ bỏ sót.

## 2. Người dùng đích

### 2.1 Việc cần làm được — `stakeholder`

**Sales** *(vai chính)*

- Trả lời được câu "hôm nay tôi chạm ai, vì sao là hôm nay" trong vòng một phút sau khi mở sản phẩm
- Làm trọn công việc bán hàng **kể cả khi phần AI tắt sạch** — đề bài `§4/nhóm 1` đòi đúng điều này
- Tin được thứ máy ghi vào hồ sơ, vì hồ sơ là thứ mang đi họp và chịu trách nhiệm từng dòng
- Sửa lại thứ máy làm sai bằng **một cú bấm**, không phải khôi phục thủ công

**Quản trị** *(vai phụ)*

- Biết máy đang đúng bao nhiêu phần, và có ai đang duyệt mù không
- Chỉnh được tham số vận hành mà không phải triển khai lại
- Có một cái phanh dừng toàn bộ phần AI, có hiệu lực ngay

### 2.2 Không phải người dùng của bản này

- **Năm vai còn lại của hệ thống thật** — `am`, `presales`, `manager`, `sales_admin`, `bod`. Đề
  bài chỉ cấp hai tài khoản.
- **Khách hàng cuối.** đề bài `§5.3` cấm sản phẩm chạm tới người thật, nên không có bề mặt nào hướng ra
  ngoài.
- **Người quản lý pipeline nhiều người sở hữu.** Dữ liệu mẫu chỉ có một tài khoản Sales, nên `§2`
  của đề bài miễn phần phân quyền theo người sở hữu.

### 2.3 Hành trình người dùng

- **UJ-1. Sáng thứ Hai, Linh mở sản phẩm và biết ngay phải gọi ai.** Linh là BD phụ trách thị
  trường JP, đã đăng nhập từ phiên trước. Cô mở màn hình tổng quan và thấy một cơ hội có Việc tiếp
  theo **do hệ thống đặt**, hạn hôm nay: *"Công ty A vừa công bố Series B — liên hệ trong ngày"*,
  kèm câu trích. Cô bấm vào câu trích, đúng đoạn văn trong bản lưu mở ra có đánh dấu. Cô đọc hai
  giây, tin, và gọi. **Giá trị đến ở chỗ cô không phải quyết định gì** — việc đã được xếp sẵn và
  bằng chứng nằm ngay cạnh nó.
- **UJ-2. Linh xử Hàng đợi gợi ý trong bốn phút.** Hàng đợi gợi ý có bảy gợi ý, đã xếp theo thứ tự ưu tiên và
  gom theo công ty. Mỗi gợi ý hiện *hiện tại → đề nghị*, câu trích, mức chắc chắn, và một dòng
  *hệ quả nếu tin này sai*. Cô duyệt bốn, sửa-rồi-duyệt một, bỏ hai kèm lý do. **Edge case:** một
  gợi ý mâu thuẫn với thứ cô vừa nghe trong cuộc họp — cô bỏ với lý do *thông tin sai*, và con số
  đó chảy vào `error-detection rate`.
- **UJ-3. Hà, Quản trị, bắt được một tuần duyệt mù.** Hà phụ trách chất lượng dữ liệu cho
  cả đội, không bán hàng, mở màn hình Quản trị mỗi sáng thứ Sáu. Màn hình Quản trị hiện `auto-accept rate` 96% cạnh thời gian
  quyết trung bình 1,8 giây, kèm khối cảnh báo *"3 gợi ý cần rà lại"*. Con số đẹp mà cảnh báo đỏ —
  đó chính là tình huống hai số đứng cạnh nhau mới đọc được, đứng riêng thì không.

## 3. Từ vựng

### 3.1 Khái niệm nghiệp vụ

Bước sau dùng **đúng** các từ này. Không dùng từ đồng nghĩa ở bất kỳ đâu trong tài liệu.

| Từ | Nghĩa | Quan hệ và số lượng |
|---|---|---|
| **Công ty** | Pháp nhân khách hàng tiềm năng hoặc đang giao dịch | Gốc của mọi dữ liệu khác |
| **Loại công ty** | Một trong năm loại ITO — `traditional` · `it_solution` · `it_product` · `tech_based` · `ito_other` (`0.1.1`) | Bắt buộc khi tạo Công ty |
| **Người liên hệ** | Một cá nhân thuộc **đúng một** Công ty | Công ty 1–n Người liên hệ |
| **Đầu mối chính** | Người liên hệ sở hữu nỗi đau — PIC của playbook | **Tối đa một** trên mỗi Công ty |
| **Cơ hội** | Một thương vụ đang theo đuổi tại một Công ty | Công ty 1–n Cơ hội |
| **Giai đoạn** | Vị trí của Cơ hội trên đường tới ký hợp đồng. **Bảy giá trị, thứ tự cố định, nhãn không đổi tên** (`0.1.2`, `BR-D11`): `tiep_can` Tiếp cận · `du_dieu_kien` Đủ điều kiện · `soan_de_xuat` Soạn đề xuất · `thuong_luong` Thương lượng · `thang` Thắng · `thua` Thua · `tam_dung` Tạm dừng | Mỗi Cơ hội ở **đúng một** Giai đoạn |
| **Đang mở** | Từ của **đề bài**: năm Giai đoạn chưa đóng — bốn giai đoạn đầu **cộng** `tam_dung` | đối lập với *đã đóng* (`thang`, `thua`) |
| **Đang chạy** | Từ **PRD này thêm**: bốn Giai đoạn đầu, **không** gồm `tam_dung`. Cần một từ riêng vì `BR-B4` và `FR-27` chỉ đúng với nghĩa này | tập con thật sự của *Đang mở* |
| **Hoạt động** | Một việc đã xảy ra và được ghi lại | Gắn vào Công ty; liên kết tuỳ chọn tới Cơ hội |
| **Dòng thời gian** | Chuỗi Hoạt động, lần đổi Giai đoạn và ghi chú của một Công ty, mới nhất trên | Một trên mỗi Công ty |
| **Việc tiếp theo** | Câu mô tả việc sắp làm cho một Cơ hội, kèm **ngày hạn** | Một trên mỗi Cơ hội |
| **Bản chụp** | Tệp nội dung tĩnh trong bộ dữ liệu BTC, mỗi Công ty **hai phiên bản**: *trước* và *sau* khi có tin mới. Đây là **nguồn web duy nhất** — không phải trang web thật (đề bài `§3`) | Công ty 1–2 Bản chụp |
| **Bản lưu** | Nội dung thô đọc được từ một nguồn, giữ nguyên văn, kèm địa chỉ nguồn và thời điểm đọc | Thuộc **đúng một** Công ty; Công ty 1–n Bản lưu |
| **Phát hiện** | Nhận định ngắn rút từ một Bản lưu, luôn kèm **câu trích nguyên văn** và vị trí của nó | Thuộc **đúng một** Công ty, thừa kế từ Bản lưu |
| **Loại tin** | Phân loại Phát hiện — 6 giá trị (`0.1.4`) | Mỗi Phát hiện **đúng một** Loại tin |
| **Mức chắc chắn** | `chac` · `co_the` · `doan` (`0.1.3`) | Mỗi Phát hiện **đúng một** mức |
| **Độ liên quan** | `high` · `medium` · `low` (`0.1.6`) — suy ra từ Loại tin **và** `signal_subtype` khi Loại tin là `other` (`BR-D6`) | Mỗi Phát hiện **đúng một** giá trị |
| **Phát hiện đáng chú ý** | Độ liên quan `high` **và** Mức chắc chắn ∈ {`chac`, `co_the`} (`D4`) | Định nghĩa **duy nhất** của cụm này |
| **Gợi ý** | Một thay đổi hệ thống muốn thực hiện, trình bày *hiện tại → đề nghị*, chờ người quyết | Sinh từ Phát hiện |
| **`auto-accept rate`** | Tỉ lệ Gợi ý được **Duyệt** trên tổng số Gợi ý **đã có người quyết**. Mẫu số **không** gồm Gợi ý còn chờ. *Sửa-rồi-duyệt* **không** tính vào tử số (`FR-22`) | Đọc cạnh `error-detection rate` (`FR-42`) |
| **`error-detection rate`** | Tử số: Phát hiện bị bác vì sai — qua nút *không hữu ích*, hoặc qua lý do `thong_tin_sai` khi Bỏ một Gợi ý **sinh từ Phát hiện đó**. Mẫu số: Phát hiện **có phản hồi** theo đúng hai đường trên (`D30`) | Mẫu số nhỏ hơn tổng Phát hiện |
| **Hàng đợi gợi ý** | Nơi Gợi ý chờ quyết, **có thứ tự ưu tiên**, gom theo Công ty (`D31`) | Một trên mỗi người sở hữu |
| **Vùng đọc** | Khu riêng trong màn hình Công ty chứa Bản lưu và Phát hiện. **Không** phải hồ sơ Công ty, **không** phải Dòng thời gian (`FR-14`) | Một trên mỗi Công ty |
| **Duyệt · Sửa-rồi-duyệt · Bỏ** | Ba quyết định người ra trên một Gợi ý. *Sửa-rồi-duyệt* ghi là **sửa**, không ghi là **duyệt** (`FR-22`) | Mỗi Gợi ý nhận **đúng một** |
| **Hoàn tác** | Đưa một ô về **đúng** giá trị trước khi máy chạm vào, bằng **một cú bấm**, trong cửa sổ 7 ngày | Có ở cả nhóm 3 và nhóm 4, cùng cơ chế (`D14`) |
| **Đang theo dõi** | Nhãn bật/tắt trên Công ty; Công ty mang nhãn được đọc lại theo chu kỳ | Bật/tắt một thao tác |
| **Vòng quét** | Một lần chạy khép kín trên toàn bộ Công ty Đang theo dõi | Không chồng vòng (`D19`) |
| **Nhật ký vòng quét** | Bản ghi tổng kết mỗi Vòng quét | Một dòng mỗi vòng |
| **Giai đoạn mở gần nhất** `[ASSUMPTION: A2]` | `mở rộng ngoài đề bài`. Giai đoạn **đang chạy** cuối cùng của Cơ hội trước khi nó sang Tạm dừng, Thắng hoặc Thua. Không bao giờ nhận giá trị `tam_dung` | **Trường mới** — xem §3.2 và §5.3 |
| **Sales** | Vai người dùng thông thường | 1 tài khoản trong dữ liệu mẫu |
| **Quản trị** | Vai vận hành; thấy phần đo lường Sales không thấy | 1 tài khoản |

> **Cảnh báo từ vựng.** đề bài `§3` của đề bài viết *"tin mới thuộc **bốn dạng**"* rồi liệt kê sáu giá
> trị, và dùng nhãn khác đề bài `§4/nhóm 2` cho cùng sáu giá trị đó. `F37` ghi nhận mâu thuẫn này và `D1` giải nó: **chỉ có một
> enum Loại tin, sáu giá trị, lấy nhãn của đề bài `§4/nhóm 2`.** Đừng dựng enum thứ hai.

### 3.2 Từ điển dữ liệu — các trường PRD này tự sinh

Từ vựng ở §3.1 là khái niệm nghiệp vụ. Bảng dưới là **trường dữ liệu** mà PRD này khai sinh, tức
những thứ không tra được ở đề bài lẫn Mục 0. Thiếu bảng này thì bước Kiến trúc tự đặt tên và tự
chọn kiểu.

**Quy ước đặt tên:** `snake_case`, khớp cách Mục 0 viết (`signal_type`, `signal_subtype`). Bước
Kiến trúc đổi sang quy ước của stack thì đổi **một lần, toàn bộ** — đừng trộn hai kiểu.

| Trường | Kiểu | Bắt buộc | Nghĩa và luật |
|---|---|---|---|
| `giai_doan_mo_gan_nhat` | enum Giai đoạn, nullable | không | Giai đoạn **đang chạy** cuối cùng trước khi Cơ hội sang `tam_dung`, `thang` hoặc `thua`. Ghi mỗi lần rời một giai đoạn đang chạy. Là đích quay về của cả hai đường ở §5.1 |
| `signal_subtype` | enum **13 giá trị**, nullable | chỉ khi `signal_type = other` | Chặn `other` thành hố rác. **Bỏ trống ở mọi Loại tin khác** (`D2`). Mười ba giá trị (`0.1.5`): `rfp` · `partnership` · `compliance` · `m_and_a` · `roadmap_delay` · `dx_initiative` · `certification` · `downturn` · `legacy_modernization` · `ai_signal` · `remote_team` · `event` · `unclassified` |
| `unclassified` | **một trong 13 giá trị** của `signal_subtype`, không phải trường riêng | — | Nghĩa: mô hình đọc được tin nhưng **không xếp được** vào 12 giá trị kia. Phải có để mô hình **không bịa**. Độ liên quan mặc định `low`, nên theo `FR-18` nó **không vào Hàng đợi gợi ý**. `BR-B5` đo tỉ lệ này |
| `relevance` | enum `high` · `medium` · `low` (`0.1.6`) | có | Suy ra từ Loại tin và `signal_subtype`; lệch tối đa một bậc kèm lý do (`BR-D6`) |
| `next_action_overwrite_overdue_manual` | boolean | có, mặc định `false` | Cho phép ghi đè Việc tiếp theo người nhập đã quá hạn. Chỉ bật cho bộ dữ liệu BTC nếu `T-6` không còn ô trống (`FR-34`, `F36`). **Sửa được từ `FR-44`** như mọi tham số khác |
| `next_action_set_by` | enum `nguoi` · `he_thong` | có | Nguồn của ô Việc tiếp theo. Là thứ `FR-30` hiển thị và `FR-34` đọc trước khi quyết có ghi đè |
| `undo_deadline` | mốc thời gian, nullable | không | Hết hạn cửa sổ Hoàn tác. Tính từ lúc máy ghi, cộng tham số cửa sổ (mặc định 7 ngày, `D14`). `null` nghĩa là bản ghi không do máy tạo |
| `ly_do_bo` | enum 5 giá trị (`0.1.7`) | có, khi **người** Bỏ Gợi ý | `thong_tin_sai` là một trong hai nguồn của `error-detection rate` (`D30`) |
| `ly_do_dong_he_thong` | enum, nullable — *"có gợi ý mới hơn"* (`FR-51`) · *"công ty đã xoá"* (`D26`) | có, khi **hệ thống** đóng Gợi ý | Tách hẳn khỏi `ly_do_bo`. Gợi ý đóng theo đường này **không** vào mẫu số của `auto-accept rate` lẫn `error-detection rate` — không ai quyết gì cả |
| `ly_do_thua` | **mảng** enum + ghi chú tự do | không (`BR-B3`) | Mảng, không phải một câu — để đếm được (`D27`) |
| `thoi_gian_quyet` | số giây | có, mỗi lần quyết Gợi ý | Từ lúc mở Gợi ý tới lúc bấm. Đầu vào của cảnh báo duyệt mù (`FR-23`, `FR-43`) |
| `vi_sao_theo_doi` | văn bản ngắn, **tuỳ chọn** | không | Lý do bật nhãn Đang theo dõi (`FR-35`). **Phải để tuỳ chọn** — bắt buộc sẽ thêm thao tác và làm đỏ `T-8` |
| `doc_duoc` | boolean + lý do | có, mỗi Bản lưu | Nguồn không đọc được thì ghi lại, **không đoán** (`FR-11`) |

## 4. Quy trình đầu-cuối

Mô tả trước khi bàn tính năng, vì tính năng chỉ là lát cắt của quy trình này.

### 4.1 Nhánh người

Chạy được trọn vẹn khi phần AI tắt sạch (đề bài `§4/nhóm 1`):

```
Tạo Công ty ─→ Thêm Người liên hệ, đánh dấu Đầu mối chính ─→ Tạo Cơ hội
     ↓
Ghi Hoạt động ──→ Dòng thời gian
     ↓
Đổi Giai đoạn (kéo thả, lùi và nhảy cóc đều được) ─→ Đủ điều kiện: hỏi hai dấu hiệu
     ↓
Đặt Việc tiếp theo + ngày hạn ─→ Màn hình tổng quan: việc quá hạn
     ↓
Đóng: Thắng, hoặc Thua kèm lý do
```

### 4.2 Nhánh máy

Chạy song song, chạm vào nhánh người ở đúng **ba chỗ**:

```
Bản lưu ─→ Phát hiện (câu trích bắt buộc)
              │
              ├─ đáng chú ý + Công ty có Cơ hội đang chạy ──→ TỰ ĐẶT Việc tiếp theo    ← chạm 1
              │                                          (nhóm 4, có Hoàn tác 7 ngày)
              ├─ mọi Phát hiện KHÔNG đi được chạm 1 ─→ Hàng đợi gợi ý            ← chạm 2
              │   nhưng liên quan ≠ `low`               (nhóm 3, người bấm mới ghi)
              │   — gồm `medium`, `high`+`doan`, và
              │     `high` ở Công ty không có Cơ hội
              ├─ liên quan `low` ───────────────────→ chỉ nằm ở vùng đọc, KHÔNG
              │                                          vào Hàng đợi gợi ý (`D3`, FR-18)
              └─ Công ty Đang theo dõi ─────────────→ TỰ THÊM mục Dòng thời gian ← chạm 3
                                                         (nhóm 5, vòng quét)
```

**Ba chạm đánh giá độc lập.** Một Phát hiện có thể kích hoạt **nhiều chạm cùng lúc** — ví dụ một
tin gọi vốn `high`/`chac` về Công ty đang theo dõi và đang có Cơ hội chạy sẽ đi cả chạm 1 và chạm
3. Nhánh trong sơ đồ **không** loại trừ nhau, trừ đúng một chỗ: `D17` cấm chạm 2 và chạm 3 cùng
sinh mục "thêm tin mới" cho một Công ty.

**Nhánh ngoại lệ.** Ba đường thoát khỏi sơ đồ trên, đều phải có chỗ đi:

| Ngoại lệ | Xảy ra khi | Hệ thống làm gì |
|---|---|---|
| **Phần AI tắt** | Quản trị bấm phanh (`FR-45`) | Toàn bộ nhánh máy dừng. Nhánh người chạy nguyên vẹn — đó là `T-1` và `T-9`. Sales thấy dòng báo đang tắt (`FR-46`) |
| **Nguồn không đọc được** | Bản chụp hỏng hoặc thiếu | Ghi lại là **không đọc được** kèm lý do (`doc_duoc`), **không** đoán, **không** tạo Bản lưu rỗng (`FR-11`) |
| **Vòng quét bị bỏ** | Vòng trước chưa xong (`FR-38`) | Ghi một dòng nhật ký kèm lý do; **không** dồn hàng, **không** chạy chồng (`NFR-1`) |

**Ba chỗ chạm là toàn bộ quyền ghi của máy.** Ngoài ba chỗ đó, việc sinh Phát hiện **không làm đổi
bất cứ thứ gì** trong hồ sơ, Dòng thời gian hay Cơ hội — đề bài `§4/nhóm 2` nói thẳng, và `D17` phân
tách để hai đường không ghi trùng: Công ty **Đang theo dõi** đi đường chạm 3 và **không** sinh gợi
ý loại "thêm tin mới"; Công ty không theo dõi thì ngược lại.

### 4.3 Luồng dữ liệu — bốn nhánh và một luật lưu giữ

Hai nhánh trên nói *thứ tự công việc*. Nhánh dưới nói *dữ liệu đi đâu*, và nó trả lời bốn câu bước
Kiến trúc buộc phải có đáp án.

**Nhánh nạp.** Bộ dữ liệu BTC → **lớp ánh xạ mỏng** (`TR-1`) → Công ty · Người liên hệ · Cơ hội ·
Bản chụp. Lớp ánh xạ tách riêng để đổi lược đồ nguồn mà không sửa phần còn lại — đây là biện pháp
duy nhất giảm thiểu `Q15`, câu chặn còn lại của cả dự án.

**Nhánh đọc.** Bản chụp → Bản lưu (hai dạng: thô và đã chuẩn hoá) → Phát hiện. Chỉ tạo Bản lưu mới
khi nội dung **khác** bản gần nhất (`D18`) — đây là cơ chế chặn tăng trưởng chính.

**Nhánh ra biên.** Khi gọi mô hình, thứ **rời khỏi hệ thống** là: nội dung Bản lưu đã chuẩn hoá,
Loại công ty, và danh sách enum cho sẵn. **Không** gửi ra: dữ liệu Cơ hội, giá trị tiền, thông tin
Người liên hệ. Ranh giới này hẹp hơn đề bài `§5.3` của đề bài đòi — đề bài `§5.3` chỉ cấm chạm người thật — và
nó là điều đội tự đặt.

**Nhánh xoá.** Mọi xoá là **xoá mềm**, không có đường xoá cứng nào trong sản phẩm:

| Xoá gì | Kéo theo |
|---|---|
| Công ty (`FR-1`) | Cascade toàn bộ dữ liệu phụ thuộc; Gợi ý đang chờ bị **đóng kèm lý do** *"công ty đã xoá"* (`D26`) |
| Mục Dòng thời gian do hệ thống thêm (`FR-40`) | Bản ghi **vẫn còn** để tra cứu và đối chiếu. Lý do xoá là **tuỳ chọn** nên **không** vào mẫu số `error-detection rate` — xem `FR-42` |
| Phát hiện | **Không xoá được.** Phát hiện là bằng chứng — `T-3` cần nó để mở đúng đoạn nguồn |

**Luật lưu giữ.** Nếu không có trần, chu kỳ 60 giây cộng `FR-17` (đọc lại không xoá) cho tăng
trưởng vô hạn:

| Dữ liệu | Trần | Khi vượt |
|---|---|---|
| Bản lưu của một Công ty | giữ **20** bản gần nhất | bản cũ nhất **không xoá và vẫn mở được** — `T-3` cần nó. Ở đây *lưu trữ* nghĩa là **đánh dấu, không phải chuyển đi đâu**: không có tầng lưu trữ thứ hai |
| Phát hiện | không giới hạn | Phát hiện là bằng chứng, không được rơi |
| Dòng Nhật ký vòng quét | giữ **1.000** dòng gần nhất cộng mọi dòng tổng hợp 10-vòng | cuộn theo cửa sổ |

> `mở rộng ngoài đề bài` — đề bài không nói gì về luồng dữ liệu. Ba trần ở trên là đội tự đặt để hệ thống
> chạy được nhiều giờ ở chế độ demo. **Rủi ro nghiệm thu: không** — trần 20 Bản lưu vẫn dư cho
> `T-4` và `T-8` vốn chỉ dùng hai ba chu kỳ.

## 5. Vòng đời Cơ hội

Đây là mục cả đề bài lẫn hệ thống thật đều để trống. Đề bài liệt kê 7 giai đoạn kèm nhãn *đang mở
/ đã đóng*; hệ thống thật lưu `status` và thời điểm đổi, nhưng không khai điều kiện canh ở đâu.
Không viết ra thì bước Kiến trúc sẽ tự chọn, và cái nó chọn thành luật ngầm trong mã.

### 5.1 Bảng chuyển tiếp được phép — `solution functional` · `mở rộng ngoài đề bài`

| Từ | Sang | Điều kiện canh | Hành động kèm theo |
|---|---|---|---|
| **— (tạo mới)** | `tiep_can` **duy nhất** | Cơ hội mới **luôn** bắt đầu ở `tiep_can`; người tạo không chọn được giai đoạn khác | Ghi một mục vào Dòng thời gian |
| Bốn giai đoạn **đang chạy** | Bất kỳ giai đoạn đang chạy nào khác | **Không có.** Lùi và nhảy cóc đều được (đề bài `§4/nhóm 1`) | Ghi một mục vào Dòng thời gian |
| Ba giai đoạn đang chạy còn lại | `du_dieu_kien` | Không chặn | Hỏi ngay **dấu hiệu nhu cầu** và **dấu hiệu ngân sách**; bỏ qua được, Cơ hội mang cờ cảnh báo tới khi bổ sung |
| Bốn giai đoạn **đang chạy** | `tam_dung` | Không chặn | Lưu **Giai đoạn mở gần nhất**; tắt cờ cảnh báo thiếu Việc tiếp theo và ngừng tự đặt (`D11`) |
| `tam_dung` | **Đúng** Giai đoạn mở gần nhất `[ASSUMPTION: A2]` | Chỉ về đúng giá trị đã lưu, không cho chọn giai đoạn khác | Bật lại cờ cảnh báo và quyền tự đặt |
| Đang chạy hoặc `tam_dung` | `thua` | Không chặn | Hỏi **lý do thua** ngay (enum dạng mảng + ghi chú, `D27`); bỏ qua được, mang cờ cảnh báo và **đứng ngoài bảng thống kê** tới khi bổ sung. Lưu Giai đoạn mở gần nhất — đi từ `tam_dung` thì **giữ nguyên** giá trị đã lưu, không ghi đè bằng `tam_dung` |
| Đang chạy hoặc `tam_dung` | `thang` | Không chặn; đề bài không đòi trường bắt buộc nào `[ASSUMPTION: A1, A3]` | Lưu Giai đoạn mở gần nhất — đi từ `tam_dung` thì **giữ nguyên** giá trị đã lưu |
| `thang` hoặc `thua` | **Đúng** Giai đoạn mở gần nhất `[ASSUMPTION: A2]` | **Chỉ vai Quản trị** `[ASSUMPTION: A5]`. `làm chặt hơn` — xem §5.2 | Ghi vết bắt buộc; ghi một mục vào Dòng thời gian |
| **Bất kỳ** | **Bất kỳ**, khi tác nhân là hệ thống | **Chặn tuyệt đối** ở tầng nghiệp vụ (đề bài `§5.1`, đề bài `§5.2`, `T-10`) | Từ chối và ghi nhật ký |

Mọi chuyển tiếp không có trong bảng đều **không được phép**. Đáng chú ý: `tam_dung` không đi thẳng
sang một giai đoạn đang chạy tuỳ chọn, và `thang` không đi thẳng sang `thua`.

### 5.2 Bốn chỗ chặt hơn đề bài, gom một bảng

đề bài `§4/nhóm 1` viết *"đi lùi và nhảy cóc đều được, hệ thống không chặn"*. Bảng §5.1 chặt hơn
câu đó ở **bốn** chỗ. Tiêu chí gom: đề bài **im lặng** hoặc **nói rộng hơn**, PRD chọn hẹp lại.

| Chỗ | Lý do | Rủi ro nghiệm thu |
|---|---|---|
| **Mở lại Cơ hội đã đóng chỉ vai Quản trị** (`D43`) | Số Thắng/Thua là gốc của mọi báo cáo; ai cũng sửa được thì báo cáo mất độ tin. Giới hạn ở Quản trị khiến việc này hiếm và luôn có vết | **Không** — không điểm `T` nào kiểm việc mở lại Cơ hội đã đóng |
| **`tam_dung` chỉ quay về đúng Giai đoạn mở gần nhất** | Cho chọn tự do thì mất luôn thông tin nó đang ở đâu trước khi dừng, và Sales hay chọn đại | **Không** — `T-1` chỉ kéo qua ba giai đoạn đang chạy, không chạm `tam_dung` |
| **Mọi chuyển tiếp ngoài bảng đều bị từ chối** | Đề bài không nói gì về chuyển tiếp ngoài danh sách; im lặng ở đây nghĩa là bước Kiến trúc tự quyết | **Không** với bộ nghiệm thu; ⚠ **thấp** với phần **thử tay** của giám khảo, nếu họ kéo thử một đường lạ |
| **Cơ hội mới luôn bắt đầu ở `tiep_can`** (`D44`) | Đề bài không nói trạng thái khởi đầu, nên người tạo có thể chọn thẳng `thang` | **Không** — `T-1` tạo Cơ hội rồi mới kéo qua ba giai đoạn |

### 5.3 Trường mới — `solution functional` · `mở rộng ngoài đề bài`

**Giai đoạn mở gần nhất.** Một trường, hai việc: quay lại từ `tam_dung`, và quay lại khi Quản trị
mở lại Cơ hội đã đóng. Ghi giá trị mỗi lần Cơ hội rời một giai đoạn đang chạy để sang `tam_dung`,
`thang` hoặc `thua`.

> ✅ **Đã bổ sung vào Mục 0 ngày 14/8 thành `D42`.** Mục 0 là nguồn duy nhất của mô hình dữ liệu;
> để PRD sinh một trường mà Mục 0 không biết là tạo ra đúng hai nguồn sự thật mà tài liệu đó dựng
> ra để tránh.

## 6. Ma trận vai × hành động

Ba cột, không phải hai. Cột **Hệ thống** là chỗ tìm ra ô *"chạm được nhưng không nên"* — và cũng
là chỗ `T-10` kiểm.

| Hành động | Sales | Quản trị | Hệ thống (AI) |
|---|---|---|---|
| Tạo, sửa, xem Công ty · Người liên hệ · Cơ hội `[ASSUMPTION: A4]` | ✅ | ✅ | ❌ |
| Xoá Công ty (xoá mềm, cascade — `D26`) | ✅ | ✅ | ❌ đề bài `§5.4` |
| Ghi Hoạt động vào Dòng thời gian | ✅ | ✅ | ✅ **tự do** — chỉ nhóm 5, chỉ Công ty Đang theo dõi, gắn nhãn *do hệ thống thêm* |
| Xoá mục do hệ thống thêm | ✅ | ✅ | ❌ |
| Đổi Giai đoạn giữa các giai đoạn **đang chạy** | ✅ | ✅ | ❌ đề bài `§5.1` · bảng chuyển tiếp ở §5.1 của PRD |
| Đóng Cơ hội — sang Thắng hoặc Thua | ✅ | ✅ | ❌ đề bài `§5.2` |
| Đưa Cơ hội sang `tam_dung`, và đưa nó quay lại | ✅ | ✅ | ❌ đề bài `§5.1` |
| **Mở lại Cơ hội đã đóng** | ❌ | ✅ | ❌ |
| Sửa giá trị tiền của Cơ hội | ✅ | ✅ | ❌ đề bài `§5.2` |
| Điền ô Việc tiếp theo **đang trống** của Cơ hội | ✅ | ✅ | ✅ **tự do**, khi Phát hiện đáng chú ý (`D4`, `D12`) |
| Ghi đè Việc tiếp theo **người nhập tay** | ✅ | ✅ | ❌ kể cả khi đã quá hạn (`D12`); chỉ ghim một dòng đề xuất |
| Điền ô hồ sơ Công ty **đang trống** | ✅ | ✅ | ⚠️ **xác nhận đơn** — qua Hàng đợi gợi ý, một cú bấm (`D16`) |
| Ghi đè ô hồ sơ **đã có giá trị** | ✅ | ✅ | ⚠️ **xác nhận kỹ** — buộc hiện diff và buộc chọn lý do (`D16`) |
| Duyệt · Sửa-rồi-duyệt · Bỏ một Gợi ý — Quản trị quyết được **Hàng đợi gợi ý của Sales**, vì bản này chỉ có một người sở hữu | ✅ | ✅ | ❌ không có chế độ tự duyệt (đề bài `§4/nhóm 3`) |
| Hoàn tác Việc tiếp theo hệ thống đặt (7 ngày) | ✅ | ✅ | ❌ |
| Bật/tắt nhãn Đang theo dõi | ✅ | ✅ | ❌ |
| Xem Bản lưu và Phát hiện ở vùng đọc (`FR-14`) | ✅ | ✅ | ✅ **tạo**, không sửa, không xoá |
| Xoá một Phát hiện | ❌ | ❌ | ❌ — Phát hiện là bằng chứng, không ai xoá được |
| Bấm *hữu ích / không hữu ích* trên một Phát hiện (`FR-42`) | ✅ | ✅ | ❌ |
| Đăng nhập bằng tài khoản của mình (`FR-49`) | ✅ | ✅ | ❌ — phần AI **không có** danh tính người dùng riêng |
| Tạo hoặc sửa tài khoản | ❌ | ❌ | ❌ — hai tài khoản gieo sẵn khi nạp dữ liệu (`TR-2`), không có màn hình quản lý tài khoản trong phạm vi này |
| Xem Nhật ký vòng quét | ✅ | ✅ | — ghi vào |
| **Xem màn hình đo lường của Quản trị** | ❌ chặn ở **tầng nghiệp vụ**, không chỉ ẩn menu (`D28`) | ✅ | ❌ |
| **Chỉnh tham số vận hành** (chu kỳ quét, bảng số `0.2.1`, ngưỡng `0.2.2`) | ❌ | ✅ (`D38`) | ❌ |
| **Tắt/bật toàn bộ phần AI** | ❌ | ✅ | ⚠️ **tự tắt** khi chạm 100% trần ngân sách (`NFR-3`) — đường duy nhất hệ thống chạm công tắc này, và nó chỉ **tắt**, không bao giờ tự bật lại |
| Gọi ra dịch vụ ngoài trong danh sách cho phép | — | — | ✅ đề bài `§5.3` **không** cấm gọi mạng, chỉ cấm chạm người thật (`D25`, `F38`) |

**Bốn dòng in đậm là toàn bộ khác biệt thật giữa Sales và Quản trị**, trên toàn bộ 26 hành động ở
bảng. Mọi khác biệt khác chỉ là hiển
thị. Điều đó có hệ quả cho bước Kiến trúc: cần đúng một điểm kiểm quyền ở tầng nghiệp vụ, không
phải rải khắp giao diện.

## 7. Luật nghiệp vụ — `solution functional`

Tách hai loại, vì cách cài đặt khác hẳn nhau.
Phần lớn 11 luật định nghĩa và 6 luật hành vi thuộc loại `solution functional` — chúng nói hệ
thống phải **làm** gì. Ba ngoại lệ nói *tốt đến mức nào* nên thuộc `solution non-functional`:
`BR-D6` (biên lệch một bậc), `BR-B5` (ngưỡng `unclassified`), `BR-B6` (ngưỡng duyệt mù). Ba luật đó
được đặt ở đây thay vì §9.1 vì chúng chỉ có nghĩa cạnh các luật quanh chúng.

### 7.1 Luật định nghĩa — không thể vi phạm, cài như hàm dẫn xuất

| Mã | Luật | Nguồn |
|---|---|---|
| `BR-D1` | Một Phát hiện **không có câu trích thì không tồn tại**. Từ chối ở tầng nghiệp vụ, kể cả khi ghi thẳng không qua giao diện | đề bài `§4/nhóm 2`, `T-2` |
| `BR-D2` | Câu trích phải **khớp nguyên văn** một đoạn trong Bản lưu. Không khớp thì loại bỏ Phát hiện và ghi nhật ký | `D22` |
| `BR-D3` | Mỗi Bản lưu thuộc **đúng một** Công ty; Phát hiện thừa kế Công ty từ Bản lưu sinh ra nó | đề bài `§4/nhóm 2` |
| `BR-D4` | Mỗi Công ty có **tối đa một** Đầu mối chính | đề bài `§4/nhóm 1` |
| `BR-D5` | **Phát hiện đáng chú ý** = Độ liên quan `high` **và** Mức chắc chắn ∈ {`chac`, `co_the`}. `doan` không bao giờ tự đặt | `D4` |
| `BR-D6` | Độ liên quan suy ra từ Loại tin và `signal_subtype`; mô hình lệch **tối đa một bậc** kèm một câu lý do, không nhảy hai bậc | `D3` |
| `BR-D7` | Ngày hạn = f(Loại tin, Mức chắc chắn) theo bảng `0.2.1`, tính theo **ngày làm việc** của thị trường Công ty, đo từ **ngày sự kiện**. Không đọc được ngày sự kiện thì lấy **ngày của Bản lưu** (`D5`). Sàn: cuối ngày làm việc kế tiếp. Trần: 14 ngày làm việc | `D5`, `D7`, `D9` |
| `BR-D8` | Nhiều tin cùng lúc: lấy **hạn ngắn nhất**, nội dung Việc tiếp theo nhắc **mọi** tin đã kích hoạt. *"Cùng lúc"* = **mọi tin còn trong cửa sổ cơ hội của nó**, không phải cùng một vòng quét. Bất biến kèm theo: **hạn do máy đặt không bao giờ bị đẩy ra xa hơn** — tin mới có hạn dài hơn thì chỉ thêm vào nội dung, không đổi ngày | `D8`, `BUS-3` |
| `BR-D9` | Một **đơn vị tiền duy nhất** trong phạm vi này. Tổng theo giai đoạn gọi đúng tên *"tổng giá trị ước tính (chưa nhân xác suất)"* | `D34` |
| `BR-D10` | Mọi enum bắt mô hình **chọn trong danh sách cho sẵn**, không nhập tự do | `D22` |
| `BR-D11` | Enum Giai đoạn là **bảy giá trị, thứ tự cố định, nhãn hiển thị không đổi tên**. Không cấu hình được, không thêm bớt, kể cả từ màn hình Quản trị | đề bài `§4/nhóm 1`, `0.1.2` |

`BR-D2` và `BR-D10` mang nhãn **`làm chặt hơn`** (`D22`): đề bài chỉ đòi *"không lưu được phát hiện
không có câu trích"*, không đòi câu trích phải khớp nguyên văn, cũng không cấm mô hình nhập tự do
vào enum. Cả hai chặt hơn **theo cùng hướng** với `T-2`, nên **rủi ro nghiệm thu bằng không**.

### 7.2 Luật hành vi — vi phạm được, phải có đường xử lý

| Mã | Luật | Khi vi phạm thì sao |
|---|---|---|
| `BR-B1` | Cơ hội đang mở phải có Việc tiếp theo **và** ngày hạn | **Vẫn lưu.** Mang cờ cảnh báo nhìn thấy được; không xuất hiện trong danh sách việc phải làm cho tới khi điền đủ |
| `BR-B2` | Sang `du_dieu_kien` phải có **dấu hiệu nhu cầu** và **dấu hiệu ngân sách**, mỗi ô một câu kèm nguồn | **Vẫn kéo được.** Mang cờ cảnh báo tới khi bổ sung. Không chặn thao tác |
| `BR-B3` | Sang `thua` phải có **lý do thua** | **Vẫn sang.** Mang cờ cảnh báo và đứng ngoài bảng thống kê lý do thua tới khi bổ sung |
| `BR-B4` | Cơ hội ở `tam_dung` **miễn trừ** `BR-B1` — cờ cảnh báo im lặng cho tới khi nó quay lại một giai đoạn đang chạy | `D11`. Đây là ngoại lệ có chủ đích, không phải lỗ hổng |
| `BR-B5` | Tỉ lệ Phát hiện mang `signal_subtype = unclassified` không vượt ngưỡng | Màn hình Quản trị cảnh báo. Không chặn gì |
| `BR-B6` | Nhịp duyệt và thời gian quyết nằm trong ngưỡng duyệt mù (`0.2.2`) | Khối cảnh báo *"N gợi ý cần rà lại"* — **không** dùng chữ *"phát hiện bất thường"* (`D29`) |

**Vì sao tách hai bảng:** luật định nghĩa cài thành ràng buộc và hàm dẫn xuất — vi phạm là lỗi hệ
thống. Luật hành vi cài thành cờ và cảnh báo — vi phạm là **trạng thái hợp lệ của dữ liệu thật**.
Trộn hai loại vào một chỗ dẫn tới hai lỗi ngược nhau: chặn thao tác mà đề bài nói *không chặn*, và
để lọt thứ đề bài nói *phải từ chối*.

## 8. Tính năng

Sáu nhóm của đề bài `§4`. FR đánh số **toàn cục** để bước sau trích dẫn được dù nhóm có bị xếp lại. Mọi
FR thuộc loại `solution functional` trừ chỗ ghi khác. Chỗ nào `T-n` đã kiểm thì ghi kèm, để bước
viết kiểm thử không dựng trùng.

**Mỗi FR mang một nhãn ưu tiên**, và nhãn đó suy ra từ bộ nghiệm thu chứ không từ cảm tính:

| Nhãn | Nghĩa | Suy ra thế nào | Số FR |
|---|---|---|---|
| `phải có` | Cắt là tự đánh đỏ bộ nghiệm thu hoặc trượt điều kiện nộp bài | Có ít nhất một điểm `T-1`…`T-10` dựa vào nó, hoặc **đề bài `§7`** đòi nó | **34** |
| `nên có` | Đề bài `§4` **hoặc** một quyết định `Dn` đòi, nhưng không điểm `T` nào chạm | Không nằm trong bảng `T`, và không phải thứ đội tự thêm | **15** |
| `bỏ được` | **Toàn bộ** FR nằm ngoài đề bài, do đội tự thêm | Cả FR mang nhãn `mở rộng ngoài đề bài` — không tính FR chỉ có **một gạch đầu dòng** mở rộng, như `FR-35` và `FR-40` | **2** |

**Một chỗ nhãn cãi được, ghi ra để khỏi tranh lúc gấp:** `FR-28` và `FR-29` là `nên có` vì `T-6`
chỉ kiểm *có đổi hay không*, không kiểm nội dung và không kiểm giá trị ngày hạn — nhưng cắt chúng
thì tính năng còn vỏ. *(`FR-14` vùng đọc từng bị xếp `nên có`; đã nâng lên `phải có` vì nó là bề
mặt duy nhất `T-3` bấm vào.)*

Đây là **thứ tự cắt** cho ngày thi. `D41` đã giữ trống một nửa quỹ giờ cho tính năng BTC phát thêm,
nên câu *"bỏ cái gì"* sẽ được hỏi thật lúc 11 giờ trưa — và lúc đó không ai có thời gian tranh
luận. Tiêu chí ở trên khách quan, tra được trong ba mươi giây.

### 8.1 CRM làm tay — đề bài `§4/nhóm 1`

**Mô tả.** Toàn bộ công việc bán hàng làm được **không cần một thành phần AI nào**. Đây không phải
nhóm "cơ bản" — nó là nền mà bốn nhóm sau dựng lên, và là nhóm duy nhất `T-1` kiểm khi phần AI tắt
sạch. Thực hiện **nửa nhánh người của UJ-1** — màn hình tổng quan và danh sách việc đến hạn; nửa
còn lại, ô Việc tiếp theo do máy đặt, thuộc §8.4.

**FR-1 · Quản lý Công ty.** `phải có` Sales tạo, sửa, xoá, xem chi tiết Công ty. Khi tạo, **bắt buộc** tên,
ngành, Loại công ty; mọi ô khác bỏ trống được.
- Xoá là **xoá mềm**, cascade toàn bộ dữ liệu phụ thuộc; Gợi ý đang chờ bị đóng kèm lý do *"công
  ty đã xoá"* (`D26`)

**FR-2 · Quản lý Người liên hệ.** `phải có` Sales tạo, sửa, xoá Người liên hệ dưới một Công ty, mỗi người có
tên, chức danh, thư điện tử. Đánh dấu được **tối đa một** Đầu mối chính (`BR-D4`) — Công ty chưa xác định được đầu mối thì để trống.

**FR-3 · Quản lý Cơ hội.** `phải có` Sales tạo, sửa, **xoá** và xem Cơ hội thuộc một Công ty, có
tên, giá trị dự kiến, tháng dự kiến chốt, Giai đoạn hiện tại. Xoá Cơ hội là **xoá mềm** như xoá
Công ty (`D26`).
- Cơ hội mới **luôn** vào `tiep_can`; người tạo **không chọn được** giai đoạn khác (§5.1 dòng đầu).
  `D44`, `mở rộng ngoài đề bài` — đề bài không nói trạng thái khởi đầu. **Rủi ro nghiệm thu: không** —
  `T-1` tạo Cơ hội rồi mới kéo qua ba giai đoạn

**FR-4 · Đổi Giai đoạn bằng kéo thả.** `phải có` Sales đổi Giai đoạn bằng **kéo thả**, không mở biểu mẫu. Đi
lùi và nhảy cóc đều được. Chuyển tiếp nào được phép và canh bằng gì: **§5.1**.
- Mỗi lần đổi ghi một mục vào Dòng thời gian
- Chuyển tiếp không có trong §5.1 bị từ chối — kể cả `tam_dung` sang một giai đoạn đang chạy tuỳ chọn
- Bảy Giai đoạn và nhãn hiển thị của chúng **không đổi tên và không cấu hình được** (`BR-D11`) —
  khác mọi tham số khác ở FR-44, vốn sửa được từ màn hình Quản trị

**FR-5 · Cổng Đủ điều kiện.** `phải có` Khi Cơ hội sang `du_dieu_kien`, màn hình hỏi ngay **dấu hiệu nhu
cầu** và **dấu hiệu ngân sách**, mỗi ô một câu kèm chỗ ghi nguồn.
- **Bỏ qua được.** Cơ hội vẫn sang, mang cờ cảnh báo tới khi bổ sung (`BR-B2`). `T-1` kiểm đúng
  đường này

**FR-6 · Hoạt động và Dòng thời gian.** `phải có` Sales ghi Hoạt động gắn vào Công ty, có ngày, loại, mô tả,
Người liên hệ liên quan. Hoạt động, lần đổi Giai đoạn và ghi chú hiện chung trên **một** Dòng thời
gian của Công ty, mới nhất trên.
- Hoạt động có **một liên kết tuỳ chọn** tới Cơ hội — vá một phần `F32`, vì Dòng thời gian chỉ ở
  cấp Công ty thì mất ngữ cảnh thương vụ

**FR-7 · Việc tiếp theo và ngày hạn.** `phải có` Mỗi Cơ hội có Việc tiếp theo và ngày hạn. Thiếu một trong
hai thì **vẫn lưu được** (`BR-B1`).
- Mang cờ cảnh báo nhìn thấy được, và **không** vào danh sách việc phải làm tới khi điền đủ
- Cơ hội ở `tam_dung` được miễn trừ, cờ im lặng (`BR-B4`)

**FR-8 · Đóng Thua kèm lý do.** `phải có` Khi Cơ hội sang `thua`, màn hình hỏi lý do ngay. Lý do là **enum
dạng mảng** cộng một ô ghi chú tự do, không phải một câu tự do (`D27`).
- Bỏ qua được; Cơ hội vẫn sang, mang cờ cảnh báo, **đứng ngoài** bảng thống kê lý do thua (`BR-B3`)

**FR-9 · Tìm kiếm và lọc.** `phải có` Tìm Công ty theo tên. Lọc Công ty theo ngành, Loại công ty, quốc gia,
nhãn Đang theo dõi. Lọc Cơ hội theo Giai đoạn và theo tình trạng Việc tiếp theo — **đến hạn hôm nay**, **quá hạn**, hoặc **thiếu ô**.

**FR-10 · Màn hình tổng quan.** `phải có` Hiện số Công ty theo ngành; số Cơ hội và **tổng giá trị ước tính
(chưa nhân xác suất)** theo từng Giai đoạn; danh sách Việc tiếp theo **đến hạn hôm nay và đã quá hạn** (UJ-1 dựng trên vế *hôm nay*); và **bảng thống kê lý do thua** (`FR-48`, `BR-D9`, `Q19`).

**FR-48 · Bảng thống kê lý do thua.** `phải có` Đếm Cơ hội `thua` theo từng giá trị `ly_do_thua`, trên màn hình
tổng quan.
- Cơ hội `thua` **chưa** có lý do thì **đứng ngoài bảng** này, không xếp vào nhóm "khác" (`BR-B3`)
- Lý do là mảng, nên một Cơ hội đếm vào nhiều dòng; bảng ghi rõ tổng số Cơ hội tách khỏi tổng số
  lượt lý do, để người đọc không cộng nhầm

**FR-49 · Đăng nhập và phiên.** `phải có` Sales và Quản trị đăng nhập bằng tài khoản thật; mọi bản ghi ghi
vết đều mang danh tính của phiên đang đăng nhập.
- Hai tài khoản có sẵn sau khi chạy lệnh nạp dữ liệu (`TR-2`), giám khảo tự vào (`NFR-12`)
- Danh tính này là thứ `NFR-10` ghi vào bản ghi, và là thứ điểm kiểm quyền ở §6 đọc

**NFR riêng của nhóm này.** Tắt sạch phần AI thì **không chức năng nào ở trên hỏng** — `T-1`. Điều
này ràng buộc kiến trúc: nhóm 1 không được phụ thuộc chiều nào vào tầng AI.

### 8.2 Đọc nguồn và rút Phát hiện — đề bài `§4/nhóm 2`

**Mô tả.** Không ai bấm gì ở nhóm này; nó là nguyên liệu cho ba nhóm sau. Điều duy nhất người dùng
quan tâm: khi hệ thống nói một điều về Công ty của họ, họ bấm được vào để thấy **chính xác câu chữ
ở nguồn**. Thực hiện UJ-1, UJ-2.

**FR-11 · Tạo Bản lưu.** `phải có` Hệ thống đọc nội dung nguồn của một Công ty và lưu thành Bản lưu, giữ
nguyên văn, kèm địa chỉ nguồn và thời điểm đọc. Mỗi Bản lưu thuộc **đúng một** Công ty, và các Bản lưu của một Công ty **xếp theo thời điểm đọc**
(`BR-D3`).
- Lưu **hai dạng**: bản thô để đối chiếu, và bản đã chuẩn hoá để neo vị trí câu trích (`D21`)
- Địa chỉ nguồn ghi **cả hai**: URL công bố và định danh bản chụp đã dùng (`D23`)
- Chỉ tạo Bản lưu mới khi nội dung **khác** bản gần nhất (`D18`). **"Khác" định nghĩa được:** so
  hash của **bản đã chuẩn hoá**, sau khi loại bỏ dấu thời gian hiển thị, số phiên bản, số lượt xem
  và mọi trường tự đổi mỗi lần đọc. Không loại bỏ chúng thì **mọi vòng quét đều "mới"** và `T-8`
  đỏ — đây là bẫy trực tiếp nhất của nhóm 5
- Nguồn không đọc được thì **ghi lại là không đọc được**. Hệ thống không đoán

**FR-50 · Chuyển bản chụp "trước" → "sau".** `phải có` Chuyển một Công ty từ phiên bản bản chụp *trước* sang
*sau* làm được **từ giao diện hoặc bằng một lệnh** (đề bài `§3`).
- Đây là **cách duy nhất kích hoạt mọi kịch bản AI**, và là tiền đề của `T-6` lẫn `T-8` — thiếu nó
  thì hai điểm nghiệm thu đó không chạy được
- Chuyển xong thì vòng đọc kế tiếp thấy nội dung mới và sinh Bản lưu mới (`D18`)
- Chuyển lùi về *trước* cũng làm được, để diễn lại kịch bản demo mà không phải nạp lại dữ liệu
- **Chuyển lùi không được sinh Bản lưu mới.** So hash với **mọi** Bản lưu của Công ty, không chỉ
  bản gần nhất — nếu không, mỗi lần diễn lại demo lại đẻ thêm một lượt mục Dòng thời gian giả

**FR-12 · Rút Phát hiện.** `phải có` Từ Bản lưu, hệ thống rút các Phát hiện. Mỗi Phát hiện gồm câu nhận định
ngắn, Loại tin, **câu trích nguyên văn**, **vị trí câu trích trong Bản lưu**, Mức chắc chắn, Độ
liên quan.
- **Không lưu được Phát hiện thiếu câu trích** — từ chối ở tầng nghiệp vụ, kể cả khi ghi thẳng
  không qua giao diện (`BR-D1`, `T-2`)
- Câu trích không khớp nguyên văn thì **loại bỏ Phát hiện** và ghi nhật ký (`BR-D2`)
- Câu trích giữ **nguyên ngôn ngữ gốc**; câu nhận định viết tiếng Việt (`D33`)
- Phát hiện thuộc đúng một Công ty, **không** gắn thẳng vào Cơ hội, Người liên hệ hay Hoạt động

**FR-13 · Câu nhận định đọc theo Loại công ty.** `nên có` Cùng một Loại tin mang nghĩa khác nhau tuỳ Loại
công ty. Câu nhận định sinh theo công thức pain hypothesis có tham số Loại công ty (`D35`).
- **Cùng một câu trích với hai Loại công ty phải cho hai câu nhận định khác nhau**, mỗi câu chứa
  tên Loại công ty. Đây là điểm kiểm được, và nó lấp một lỗ hổng phủ kiểm thử

**FR-14 · Vùng đọc.** `phải có` Bản lưu và Phát hiện hiện ở **một khu riêng** trong màn hình Công ty. Sales
xem được.
- Khu này **không phải** hồ sơ Công ty và **không phải** Dòng thời gian. Cho Phát hiện chạy thẳng
  lên Dòng thời gian là biến nhóm 2 thành nhóm 5

**FR-15 · Mở đúng đoạn nguồn.** `phải có` Bấm vào một Phát hiện ở bất cứ đâu nó xuất hiện thì mở **đúng đoạn
văn gốc** trong Bản lưu, có đánh dấu (`T-3`). Không mở cả trang rồi để người tự dò.

**FR-16 · Mức chắc chắn nhìn ra được.** `nên có` Ba mức phân biệt **không cần đọc chữ** — bằng **ký hiệu và
màu**, không dùng màu đơn độc (`D24`, vá `F14`).
- `làm chặt hơn` — đề bài viết *"bằng ký hiệu **hoặc** màu"*. Màu đơn độc loại người mù màu ra khỏi
  sản phẩm, nên đội đòi cả hai. **Rủi ro nghiệm thu: không** — chặt hơn theo cùng hướng

**FR-17 · Đọc lại không xoá.** `nên có` Đọc lại cùng một nguồn không xoá Phát hiện cũ. Phát hiện mới nằm
cạnh Phát hiện cũ, mỗi cái mang thời điểm riêng.

### 8.3 Hàng đợi gợi ý — đề bài `§4/nhóm 3`

**Mô tả.** Sales muốn hồ sơ luôn đúng mà không phải tự gõ, nhưng **không** chấp nhận máy tự sửa
hồ sơ ở chỗ này — hồ sơ là thứ họ mang đi họp. Máy chuẩn bị sẵn, người bấm. Thực hiện UJ-2.

**FR-18 · Sinh Gợi ý vào Hàng đợi gợi ý có thứ tự.** `phải có` Khi có Phát hiện mới về một Công ty, hệ thống sinh
Gợi ý vào Hàng đợi gợi ý của người sở hữu. Hai loại: **thêm một tin mới** vào Dòng thời gian, và **điền
hoặc sửa một ô** trong hồ sơ Công ty.
- **"Ô đã cũ"** = ô có giá trị, và Bản lưu mới nhất chứa một câu trích **mâu thuẫn** với giá trị đó.
  Không phải ô lâu ngày không ai đụng — thời gian một mình không làm một giá trị sai đi
- Hàng đợi gợi ý **có thứ tự**: khoá xếp là bộ ba **(Độ liên quan, Mức chắc chắn, Công ty có Cơ hội đang
  chạy hay không)**, so lần lượt theo thứ tự đó — **không** phải một phép nhân số học.
- **Gom theo Công ty là khoá ngoài**: Gợi ý của cùng Công ty đứng liền nhau, thứ tự giữa các Công ty
  lấy theo Gợi ý cao nhất của mỗi Công ty. Bộ ba trên xếp **trong** một Công ty. Trọng số hoàn thiện
  ở `0.2.3` chỉ áp cho Gợi ý loại *điền ô trống*, và cũng chỉ **trong** một Công ty
- `làm chặt hơn` — `D31` viết khoá xếp dưới dạng tích ba yếu tố và dùng chữ *"cơ hội mở"*. PRD đọc
  nó thành **so lần lượt** (tích ba enum không có nghĩa số học) và thay bằng *đang chạy* cho khớp
  `FR-27`. **Rủi ro nghiệm thu: không** — không điểm `T` nào kiểm thứ tự Hàng đợi gợi ý. ✅ **`D31` đã sửa** ở Mục 0
  ngày 14/8
- Công ty **Đang theo dõi** thì **không** sinh Gợi ý loại "thêm tin mới" — đường đó thuộc nhóm 5
  (`D17`, vá `F1`)
- **Phát hiện `high` ở Công ty không có Cơ hội đang chạy vẫn vào Hàng đợi gợi ý** — chạm 1 đòi phải
  có Cơ hội, nên không có Cơ hội thì nó rơi về đây chứ không rơi ra ngoài. Bộ dữ liệu BTC có 12–15
  Công ty và 8 Cơ hội, nên đây là 4–7 Công ty, không phải ca biên
- `D45`, `làm chặt hơn` — Phát hiện có Độ liên quan **`low`** **không** vào Hàng đợi gợi ý; nó chỉ nằm ở vùng
  đọc của nhóm 2 (`D3`, `0.1.6`). Đề bài không lọc theo Độ liên quan, nhưng đổ `unclassified` và
  `event` vào Hàng đợi gợi ý chính là cách tái tạo chi phí chú ý mà §1 dựng ra để cắt. **Rủi ro nghiệm
  thu: không** — không điểm `T` nào đòi Hàng đợi gợi ý phải chứa Phát hiện `low`

**FR-51 · Một ô, một Gợi ý đang chờ.** `bỏ được` Mỗi ô hồ sơ có **tối đa một** Gợi ý đang chờ. Gợi ý
mới hơn về cùng ô **thay thế** cái cũ; cái cũ đóng lại với lý do *"có gợi ý mới hơn"*.
- Đây là **lý do đóng của hệ thống, không phải một lần người quyết**, nên nó **không** vào mẫu số
  của `auto-accept rate` lẫn `error-detection rate`. Đếm riêng một dòng ở `FR-41`. Ở chế độ demo 60
  giây, tính nó vào mẫu số sẽ kéo tụt `SM-3` theo đúng tần suất quét — một con số xấu không phản
  ánh gì về chất lượng
- Vế *"hiện tại"* ở `FR-19` là **giá trị sống đọc lúc mở Gợi ý**, không phải ảnh chụp lúc sinh ra
  nó. Người vừa sửa tay ô đó thì Gợi ý phải hiện giá trị vừa sửa — nếu không, họ duyệt một phép so
  sánh đã sai
- Giá trị sống khác giá trị lúc sinh thì Gợi ý mang nhãn *"hồ sơ đã đổi sau khi gợi ý này sinh ra"*
- `mở rộng ngoài đề bài` — đề bài không nói gì về hai Gợi ý cùng trỏ một ô. **Rủi ro nghiệm thu:
  không.** Bỏ FR này thì hai Gợi ý mâu thuẫn cùng nằm trong Hàng đợi gợi ý, và duyệt cái cũ sau sẽ
  lùi dữ liệu về giá trị cũ hơn

**FR-19 · Bốn thứ hiện tại chỗ.** `nên có` Mỗi Gợi ý hiện đủ bốn thứ, không phải bấm sang màn hình khác:
nội dung **hiện tại → đề nghị** · **câu trích** làm bằng chứng · **Mức chắc chắn** · **một dòng nói
rõ hệ quả nếu thông tin này sai**.

**FR-20 · Ba nút.** `phải có` **Duyệt** · **Sửa-rồi-duyệt** · **Bỏ**. Bỏ kèm chọn lý do từ 5 giá trị
(`0.1.7`).
- **Số thao tác để Bỏ không được nhiều hơn số thao tác để Duyệt.** Đây là một ràng buộc UX kiểm
  được, không phải nguyện vọng. *(Loại `solution non-functional` nằm trong một FR — đặt ở đây vì nó
  chỉ có nghĩa cạnh ba nút)*
- `[NON-GOAL for MVP]` Duyệt hàng loạt, chọn nhiều Gợi ý một lúc. Nó là đường thẳng nhất tới duyệt
  mù, đúng thứ `FR-43` dựng ra để bắt

**FR-21 · Không duyệt thì không có gì xảy ra.** `phải có` Hồ sơ Công ty giữ nguyên **vô thời hạn**. Gợi ý
không tự hết hạn thành hành động, không tự áp dụng, **không có chế độ tự duyệt** (`T-4`).
- Gợi ý quá cũ chỉ mang nhãn *"dựa trên bản lưu đã cũ"* (`D15`)

**FR-22 · Sửa-rồi-duyệt tách khỏi Duyệt.** `phải có` Ghi lại là *sửa*, không ghi là *duyệt*. Hai con số phải
tách bạch (`T-5`).

**FR-23 · Bản ghi mỗi lần quyết.** `phải có` Lưu nội dung Gợi ý, ai quyết, lúc nào, quyết gì, lý do nếu bỏ,
và **mất bao nhiêu giây** kể từ lúc mở Gợi ý tới lúc bấm (`T-5`).
- **"Mở Gợi ý"** = thời điểm bốn thứ ở `FR-19` **hiện đủ trên màn hình**. `FR-19` bắt mọi thứ hiện
  tại chỗ nên không có thao tác *mở* riêng — mốc đếm là lúc Gợi ý vào khung nhìn, không phải lúc
  tải trang
- Con số giây này là đầu vào của khối cảnh báo duyệt mù ở FR-43

**FR-24 · Không mọc lại.** `nên có` Gợi ý đã bỏ không sinh lại với cùng nội dung, trừ khi có Bản lưu mới.
Chống trùng theo **dấu vân nội dung**, không theo số hiệu Bản lưu; cộng điều kiện trùng tiêu đề
cosine ≥ 0,9 trong cửa sổ 30 ngày (`D18`, vá `F19`).

**FR-25 · Dấu hiệu đang có Gợi ý chờ.** `nên có` Màn hình danh sách Cơ hội và màn hình Công ty hiện dấu
hiệu, để người dùng không phải nhớ đi kiểm tra Hàng đợi gợi ý.

**FR-26 · Hoàn tác cho nhóm này.** `bỏ được` Duyệt và Sửa-rồi-duyệt đều lưu ảnh chụp giá trị cũ, nên nhóm 3
**cũng có** Hoàn tác — cùng kiểu nút với nhóm 4, cùng cửa sổ 7 ngày (`D14`, `D15`, vá `F9`).
- `mở rộng ngoài đề bài` — đề bài `§4/nhóm 3` không đòi. Rủi ro nghiệm thu: **không**, không điểm `T` nào
  đòi nhóm 3 phải *không có* đường lùi

### 8.4 Tự đặt Việc tiếp theo — đề bài `§4/nhóm 4`

**Mô tả.** Đây là chỗ **chờ người bấm gây thiệt hại thật**, và là chỗ hiện thực nguyên tắc ở §1:
máy hấp thụ quyết định trong vùng nó đủ chắc. Sales chấp nhận cho máy tự làm ở đúng chỗ này với
một điều kiện tuyệt đối — sai thì sửa bằng **một cú bấm**. Thực hiện UJ-1.

**FR-27 · Tự điền.** `phải có` Khi xuất hiện **Phát hiện đáng chú ý** (`BR-D5`) về một Công ty
**đang có ít nhất một Cơ hội đang chạy**, hệ thống tự điền Việc tiếp theo và ngày hạn **ngay lập
tức, không hỏi ai**.
- Áp cho **mọi** Cơ hội **đang chạy** của Công ty; mỗi Cơ hội một bản ghi tự đặt và một nút Hoàn
  tác riêng (`D10`)
- Cơ hội ở `tam_dung` **không** được tự đặt, dù đề bài `§4/nhóm 1` xếp nó là *đang mở* — đó chính
  là lý do §3.1 khai từ *đang chạy* (`D11`, vá `F7`)
- **Công ty chỉ có Cơ hội ở `tam_dung`** thì Phát hiện **không rơi mất**: nó đi vào Hàng đợi gợi ý
  theo `FR-18`, cùng đường với Công ty không có Cơ hội nào
- Tin **quá cửa sổ cơ hội** (`0.2.1`) thì không tự đặt gì: gắn nhãn *"tin cũ"*, tối đa là sinh Gợi
  ý chờ duyệt (`D6`)

**FR-28 · Nội dung có bằng chứng.** `nên có` Nội dung tự điền nhắc tới sự kiện đã kích hoạt nó và **kèm
chính câu trích**. Nhiều tin cùng lúc thì nhắc **mọi** tin đã kích hoạt (`BR-D8`).

**FR-29 · Ngày hạn phản ánh độ gấp.** `nên có` Không phải một con số cố định. Tính theo `BR-D7` và bảng
`0.2.1`: `funding` hạn sát tính bằng ngày, `hiring` và `expansion` dài hơn.

**FR-30 · Dấu hiệu ô do hệ thống đặt.** `phải có` Ô Việc tiếp theo do hệ thống đặt mang dấu hiệu phân biệt
được với ô do người gõ (`T-6`).

**FR-31 · Thông báo trong sản phẩm.** `phải có` Người sở hữu Cơ hội được báo ngay: hệ thống vừa đặt gì, cho
Cơ hội nào, **vì sao**. Thông báo **không tự biến mất trước khi được xem** (`T-6`).

**FR-32 · Hoàn tác một cú bấm.** `phải có` Đưa Việc tiếp theo và ngày hạn về **đúng** giá trị trước đó, dùng
được **trong 7 ngày** kể từ lúc hệ thống đặt (`T-7`).
- Cửa sổ 7 ngày **hiện rõ trên màn hình**; hết cửa sổ thì nút biến mất và người dùng sửa tay như ô
  bình thường
- Lùi **một bước**; bản ghi lưu đủ chuỗi giá trị để tra cứu; nút hiện rõ đang lùi về giá trị nào
  (`D13`)
- **Máy đặt lần thứ hai lên chính ô nó đã đặt thì Hoàn tác vẫn về giá trị *trước lần máy chạm đầu
  tiên***, không về giá trị máy đặt lần trước. Lùi từng bước qua một chuỗi toàn giá trị của máy
  không đưa người về đâu cả — mà đề bài `§4/nhóm 4` hứa *"một cú bấm"*. Cửa sổ 7 ngày đếm từ lần
  chạm **đầu tiên** của chuỗi, không đặt lại mỗi lần máy ghi
- Cửa sổ là **tham số**, mặc định 7 ngày, dùng **một giá trị** cho cả nhóm 3 và nhóm 4 để người
  dùng chỉ phải học một cơ chế (`D14`)
- **Người sửa tay ô đó thì nút Hoàn tác biến mất ngay**, kể cả khi cửa sổ chưa hết: hoàn tác lúc
  này sẽ xoá mất thứ người vừa gõ, tức máy ghi đè người — đúng điều `D12` cấm

**FR-33 · Ghi vết hai chiều.** `phải có` Ghi lại **mọi lần** hệ thống tự đặt — Cơ hội nào, giá trị cũ, giá
trị mới, Phát hiện nào kích hoạt, lúc nào. Và **mọi lần** hoàn tác — ai bấm, lúc nào, về giá trị gì
(`T-7`).
- Số lần hoàn tác và **tỉ lệ hoàn tác trên tổng số lần tự đặt** xem được ở màn hình Quản trị

**FR-34 · Không ghi đè ô người nhập tay.** `nên có` Hệ thống **không bao giờ** ghi đè Việc tiếp theo do
người nhập tay — `làm chặt hơn`: **kể cả khi đã quá hạn** (`D12`, vá `F8`).
- Thay vào đó **ghim một dòng đề xuất** ngay dưới ô
- Ô đang trống, hoặc ô do chính hệ thống đặt trước đó, thì tự điền như đề bài `§4/nhóm 4` cho phép
- Có cờ `next_action_overwrite_overdue_manual`, mặc định `false`
- **Kiểm-và-ghi phải nguyên tử.** Vòng quét đọc ô lúc 10:00:30, người lưu lúc 10:00:31, máy ghi lúc
  10:00:32 — máy vừa ghi đè người mà không luật nào cấm được. Máy chỉ ghi khi ô **vẫn đúng giá trị
  nó đã đọc**; khác đi thì **bỏ lượt ghi này** và để lại một dòng đề xuất
- ⚠️ **Rủi ro nghiệm thu có thật:** nếu dữ liệu BTC điền sẵn Việc tiếp theo cho cả 8 Cơ hội thì
  `T-6` không còn ô trống nào để tự điền. Đường xử lý ở `F36` — bật cờ trên cho bộ dữ liệu đó.
  Việc **quyết định có bật hay không** chỉ tồn tại trong ngày thi, nên nó là `TR-5`, không phải một
  phần của FR này

### 8.5 Vòng quét Công ty Đang theo dõi — đề bài `§4/nhóm 5`

**Mô tả.** Với Công ty quan trọng, người dùng giao hẳn: cứ theo dõi giúp tôi, có gì thì tự ghi vào.
Đổi lại, Quản trị phải nhìn thấy cái vòng đó đang làm gì mà không phải đọc từng mục nó
thêm. Thực hiện UJ-1 (việc đã xếp sẵn từ sáng) và UJ-3 (Nhật ký là thứ Hà đọc).

**FR-35 · Nhãn Đang theo dõi.** `phải có` Bật/tắt bằng **một thao tác**. Có một màn hình danh sách riêng cho
nhóm này.
- Kèm ô **"vì sao theo dõi công ty này"**, **tuỳ chọn, không chặn thao tác bật** — vá một phần
  `F29`, bước screening Keep / Hold / Drop mà playbook đòi nhưng đề bài không có
- `mở rộng ngoài đề bài`. ⚠️ **Ô này bắt buộc thì làm đỏ `T-8`**, vốn mở đầu bằng *"Bật Đang theo
  dõi cho ba công ty"* trong khi đề bài đòi bật **bằng một thao tác**. Để tuỳ chọn thì **rủi ro
  nghiệm thu bằng không**

**FR-36 · Vòng lặp khép kín.** `phải có` Trên toàn bộ Công ty Đang theo dõi: đọc lại nguồn → so với Bản lưu
gần nhất → có nội dung mới thì rút Phát hiện → **tự thêm một mục cho mỗi Phát hiện mới** vào Dòng
thời gian, gắn nhãn
*"do hệ thống thêm"*, kèm câu trích → quay lại đầu vòng (`T-8`).
- **Một Bản lưu chứa hai tin thì sinh hai mục, không phải một** — `D36` phát biểu đúng quan hệ đó
  (*"mỗi tin mới trong bản chụp sinh đúng một mục"*), và `T-8` **đếm mục**
- Chống trùng ở **tầng Phát hiện**, không ở tầng Bản lưu: cùng một tin đọc lại ở vòng sau không
  sinh mục thứ hai (`D18`)
- **Tập Công ty của một vòng chốt lúc vòng bắt đầu.** Bật Đang theo dõi giữa vòng thì Công ty đó
  vào vòng **sau**; tắt giữa vòng thì nó bị bỏ qua ngay. Đọc sống danh sách giữa vòng khiến hai lần
  chạy trên cùng dữ liệu cho hai kết quả
- **Vòng lặp không dừng chờ ai duyệt ở bất kỳ bước nào.** Nó tự quyết dựa trên việc nội dung có
  mới so với lần trước hay không

**FR-37 · Chu kỳ cấu hình được.** `phải có` Mặc định **60 giây** cho chế độ demo. Hai chế độ trên cùng một
tham số: vận hành mặc định 24 giờ, demo 60 giây (`D20`).
- Giá trị 60 giây là để **chấm được trong buổi demo**, không phải giá trị dùng thật. `T-4`, `T-8`,
  `T-9` chạy ở chế độ demo
- Ba cơ chế chặn chi phí đi kèm — định nghĩa và ngưỡng ở `NFR-2`, `NFR-3`, `NFR-4`, không lặp lại
  ở đây (`D20`)

**FR-38 · Không chồng vòng.** `nên có` Vòng mới chỉ chạy khi vòng trước kết thúc. Vòng bị bỏ **vẫn ghi một
dòng nhật ký kèm lý do**. Khoá theo Công ty — một Công ty chỉ được một vòng xử lý tại một thời điểm
(`D19`, vá `F18`).

**FR-39 · Nhật ký vòng quét.** `phải có` Sau mỗi vòng, ghi một dòng: chạy lúc nào, quét bao nhiêu Công ty,
phát hiện bao nhiêu nội dung mới, thêm bao nhiêu mục vào Dòng thời gian, mất bao lâu, **có lỗi gì**
(`T-8`).
- Cứ **mỗi 10 vòng** ghi thêm một dòng tổng hợp cộng dồn
- Vòng bị cắt giữa chừng — chạm trần `NFR-2` hoặc bị phanh `FR-45` — ghi là **vòng không trọn**,
  kèm số Công ty đã quét trên tổng. Nó **không** đếm vào chuỗi 10 vòng, vì §3.1 định nghĩa Vòng
  quét là *khép kín trên toàn bộ* Công ty Đang theo dõi

**FR-40 · Sales xoá được mục do hệ thống thêm.** `nên có` Như mọi mục khác trên Dòng thời gian.
- Xoá dùng **xoá mềm** để mục đó vẫn còn làm dữ liệu đo, và hỏi **một lý do ngắn**. Lý do này là
  **tuỳ chọn**, nên nó **không** vào mẫu số của `error-detection rate` — xem `FR-42` (`D30`, vá `F12`)
- `mở rộng ngoài đề bài` — đề bài `§4/nhóm 5` chỉ nói *"Sales vẫn xoá được"*, không đòi hỏi lý do. Lý do
  để **tuỳ chọn**, không chặn thao tác xoá. **Rủi ro nghiệm thu: không**

### 8.6 Bảng điều khiển Quản trị — đề bài `§4/nhóm 6`

**Mô tả.** Người chịu trách nhiệm cần một chỗ duy nhất để thấy sức khoẻ phần AI, chỉnh vài con số,
và có một cái phanh. Thực hiện UJ-3.

**FR-41 · Màn hình số đo.** `nên có` Gom đủ: số Phát hiện đã sinh và phân bố ba Mức chắc chắn · số Gợi ý đã
sinh cùng `auto-accept rate`, tỉ lệ sửa-rồi-duyệt, tỉ lệ bỏ, phân bố lý do bỏ · thời gian quyết trung
bình · số lần tự đặt Việc tiếp theo và tỉ lệ bị hoàn tác.
- Mỗi số đo hiện **cả luỹ kế và cửa sổ 24 giờ**, kèm ngưỡng ở `0.2.2` (`D29`)
- Một dòng riêng đếm **Gợi ý bị hệ thống đóng** theo `ly_do_dong_he_thong`, tách hẳn khỏi ba con
  số Duyệt / Sửa-rồi-duyệt / Bỏ — đường này không ai quyết gì
- `[NON-GOAL for MVP]` Xuất báo cáo ra tệp, gửi báo cáo định kỳ qua thư. Màn hình này để **xem và
  can thiệp**, không phải để nộp lên trên

**FR-42 · `error-detection rate`.** `nên có` Số Phát hiện bị người bác bỏ với lý do `thong_tin_sai` trên
tổng số Phát hiện **có phản hồi**. Đặt **cạnh** `auto-accept rate` (`D30`, vá `F12`).
- Cơ chế thu, **đúng hai nguồn**: nút *không hữu ích* trên một Phát hiện, và lý do `thong_tin_sai`
  khi Bỏ một Gợi ý (`FR-20`). Lý do ngắn khi Sales xoá mục do hệ thống thêm (`FR-40`) là **tuỳ
  chọn**, nên **không** vào mẫu số — mẫu số co giãn theo mức chăm chỉ của người dùng thì không so
  được giữa hai kỳ
- `làm chặt hơn` — `D30` mô tả cơ chế thu gồm cả lý do khi xoá mục. Chốt lại còn hai nguồn bắt buộc
  là chặt hơn, để mẫu số ổn định. **Rủi ro nghiệm thu: không** — không điểm `T` nào chạm số đo này.
  ✅ **`D30` đã sửa** ở Mục 0 ngày 14/8

**FR-43 · Khối cảnh báo duyệt mù.** `nên có` `auto-accept rate` và thời gian quyết trung bình hiện **cạnh nhau**.
Ngưỡng ở `0.2.2`: dưới 3 giây mỗi quyết, hoặc trên 5 Gợi ý mỗi phút (`D29`, vá `F11`).
- Ngôn từ là ***"N gợi ý cần rà lại"***, **không** phải *"phát hiện bất thường"*
- Cảnh báo cả khi tỉ lệ `unclassified` vượt ngưỡng (`BR-B5`)

**FR-44 · Chỉnh tham số, hiệu lực ngay.** `nên có` Cả bảng `0.2.1`, mọi tham số ở `0.2.2`, **và
mọi tham số PRD này tự khai ở §3.2** — cờ ghi đè, cửa sổ Hoàn tác — đều sửa được từ đây,
mỗi dòng kèm **một câu giải thích đổi nó thì cái gì đổi theo**, đổi **có hiệu lực ngay** — không
cần triển khai lại (`D38`).
- Mỗi tham số hiện đơn vị và giá trị mặc định

**FR-45 · Phanh — nút tắt toàn bộ phần AI.** `phải có` Có hiệu lực **ngay**, không cần chạy lại sản phẩm.
Khi tắt: Vòng quét dừng · không sinh Phát hiện mới · không sinh Gợi ý mới · không tự đặt Việc tiếp
theo. **Dữ liệu đã sinh không bị xoá** (`T-9`).
- **Bấm giữa một vòng quét đang chạy:** vòng đó **cắt tại ranh giới Công ty** — Công ty đang xử lý
  làm nốt rồi dừng, các Công ty còn lại không đụng tới. Vòng vẫn ghi một dòng Nhật ký kèm lý do
  *"cắt do phanh"*. Dừng giữa chừng một Công ty để lại Bản lưu không có Phát hiện; chạy nốt cả vòng
  thì ghi mục Dòng thời gian **sau** lúc bấm và làm `T-9` đỏ
- **Gợi ý đang chờ vẫn bấm được** — Duyệt, Sửa-rồi-duyệt và Bỏ đều hoạt động bình thường. Phanh
  chặn phần **sinh ra**, không chặn phần **người quyết**: khoá luôn cả Hàng đợi gợi ý là nhốt dữ liệu
  của Sales sau một cái công tắc họ không điều khiển

**FR-46 · Sales thấy trạng thái đang tắt.** `phải có` Một dòng thông báo nói rõ tính năng gợi ý đang tắt.
**Không im lặng biến mất** (`T-9`).

**FR-47 · Ghi vết mỗi lần tắt/bật.** `phải có` Kèm thời điểm (`T-9`).

### 8.7 Tra nhanh 51 FR

Số hiệu **không tuần tự theo mục**: `FR-48` và `FR-49` nằm cuối §8.1, `FR-50` nằm giữa §8.2 ngay sau `FR-11`, `FR-51` nằm trong §8.3 ngay sau `FR-18` — chúng
được thêm sau khi soát phủ yêu cầu, và giữ số mới thay vì đánh lại để mọi trích dẫn cũ còn dùng
được.

| Nhãn | Số FR | Mã |
|---|---|---|
| `phải có` | 34 | `1` · `2` · `3` · `4` · `5` · `6` · `7` · `8` · `9` · `10` · `11` · `12` · `14` · `15` · `18` · `20` · `21` · `22` · `23` · `27` · `30` · `31` · `32` · `33` · `35` · `36` · `37` · `39` · `45` · `46` · `47` · `48` · `49` · `50` |
| `nên có` | 15 | `13` · `16` · `17` · `19` · `24` · `25` · `28` · `29` · `34` · `38` · `40` · `41` · `42` · `43` · `44` |
| `bỏ được` | 2 | `26` · `51` |

Mục nào chứa FR nào: §8.1 `FR-1`–`FR-10`, `FR-48`, `FR-49` · §8.2 `FR-11`, `FR-50`, `FR-12`–`FR-17` ·
§8.3 `FR-18`, `FR-51`, `FR-19`–`FR-26` · §8.4 `FR-27`–`FR-34` · §8.5 `FR-35`–`FR-40` · §8.6 `FR-41`–`FR-47`.

## 9. Yêu cầu phi chức năng và chuyển đổi

### 9.1 Phi chức năng xuyên suốt — `solution non-functional`

Mỗi dòng có **ngưỡng số và cách đo**. Dòng nào chỉ có tính từ thì không kiểm được, nên không có
dòng nào như vậy ở đây.

| Mã | Yêu cầu | Ngưỡng | Đo bằng |
|---|---|---|---|
| `NFR-1` | Chu kỳ đo **cuối-đến-đầu**: đếm từ lúc vòng trước kết thúc, không phải từ lúc nó bắt đầu. Vòng quét **không kịp** trong chu kỳ thì vòng kế **bị bỏ và ghi nhật ký kèm lý do** — không chồng vòng, không dồn hàng | 0 vòng chồng · 100% vòng bị bỏ có dòng nhật ký | Nhật ký vòng quét (FR-39), đối chiếu `FR-38`. **Không** đặt ngưỡng cứng thời lượng: độ trễ mô hình ngoài tầm kiểm soát của đội, và `T-8` chỉ đòi *trong hai chu kỳ* |
| `NFR-2` | Trần lệnh gọi mô hình mỗi Vòng quét | ≤ 20 lệnh (`0.2.2`) | Đếm và ghi vào Nhật ký vòng quét. **Chạm trần thì kết thúc vòng sớm**, ghi dòng nhật ký nêu số Công ty chưa quét; vòng kế bắt đầu **từ Công ty còn dở**, không quay về đầu danh sách |
| `NFR-3` | Trần ngân sách kiểm **trước** mỗi lệnh gọi, cảnh báo sớm | cảnh báo ở 80% (`D20`) | Bản ghi từng lệnh gọi. **Chạm 100% thì phần AI tự tắt** như khi bấm phanh `FR-45`, và hiện đúng dòng báo đó cho Sales — không im lặng ngừng sinh Gợi ý |
| `NFR-4` | Bộ đệm theo hash prompt | TTL 24 giờ (`0.2.2`) | Tỉ lệ trúng đệm trên màn hình Quản trị |
| `NFR-5` | Dữ liệu **còn nguyên sau khi khởi động lại tiến trình** | 100% bản ghi | Khởi động lại rồi đối soát số bản ghi (đề bài `§7.3`) |
| `NFR-6` | Cấu hình **hai lớp**: biến môi trường đặt giá trị lúc khởi động (thoả đề bài `§7.3`), kho tham số sửa lúc chạy **ghi đè** lên nó, hiệu lực ngay (thoả đề bài `§4/nhóm 6`). Bí mật và chuỗi kết nối **chỉ** ở lớp env | 0 bí mật trong mã · 0 tham số nghiệp vụ đòi triển khai lại | Rà mã, cộng một lần đổi chu kỳ quét lúc chạy rồi xem vòng kế đổi nhịp. Đây là chỗ **hoà giải đề bài tự mâu thuẫn** — xem `FR-37`, `FR-44` |
| `NFR-7` | Khởi động bằng **một lệnh**, log chạy ra chỗ xem được | 1 lệnh | Chạy từ **bản clone sạch** (đề bài `§7.3`) |
| `NFR-8` | Nạp bộ dữ liệu BTC bằng **một lệnh**, chạy lại thì về đúng trạng thái phát bài | 1 lệnh, idempotent **khi chạy mặc định**; bật cờ `TR-4` thì ghi vết được giữ lại có chủ đích | Chạy hai lần không cờ, so số bản ghi (đề bài `§7.5`). *Báo cáo đối soát ở `TR-3`, cờ giữ ghi vết ở `TR-4` — không lặp lại ở đây* |
| `NFR-9` | Mọi mốc thời gian lưu theo **UTC**, hiển thị theo múi giờ người dùng | không lệch ngày | Kiểm với thị trường JP và Global (`D9`) |
| `NFR-10` | Truy vết: mọi lần người quyết và mọi lần máy ghi đều có bản ghi. Máy ghi dưới **một danh tính hệ thống riêng**, phân biệt được với hai tài khoản người và **không đăng nhập được** | 100% | `T-5`, `T-7`, `T-9` |
| `NFR-11` | Bản dựng **production**: không dev server, không hot reload, không chế độ gỡ lỗi | 0 vi phạm | Rà cấu hình bản dựng (đề bài `§7.3`) |
| `NFR-12` | *(gộp — năng lực đăng nhập ở `FR-49`, việc gieo hai tài khoản ở `TR-2`)* | — | Xem `FR-49` và `TR-2`. Giữ dòng này làm con trỏ để người đối chiếu đề bài `§7.3` không tưởng bị bỏ sót |
| `NFR-13` | Bộ kiểm thử chạy bằng **một lệnh**, kết quả in rõ ràng, phủ `T-1`…`T-10` **theo dạng `D36` đã chốt**: mỗi `T` là một `Feature` nhiều `Scenario`, `T-4` thêm điều kiện *Công ty đang bật Đang theo dõi*, `T-6` và `T-8` khẳng định **quan hệ** chứ không khẳng định con số | 1 lệnh · 10/10 điểm `T` xanh | Chạy từ bản clone sạch (đề bài `§7.4`, `D36`) |

> **`NFR-7`, `NFR-8` và `NFR-13` chưa viết được lệnh thật** vì stack cho `src/` chưa chốt — đó là
> đầu ra của bước Kiến trúc. Ba dòng này là **yêu cầu**, không phải mô tả thứ đã có.

### 9.2 Yêu cầu chuyển đổi — `transition`

Loại yêu cầu hay bị bỏ sót nhất: thứ **chỉ cần trong lúc chuyển đổi** rồi bỏ đi. Tách riêng vì
bước Epic & Story chỉ sinh story cho thứ có mã — để chúng nằm trong mục *Câu hỏi còn mở* là bảo
đảm không ai làm.

| Mã | Yêu cầu | Vì sao là `transition` | Nghiệm thu |
|---|---|---|---|
| `TR-1` | **Lớp ánh xạ mỏng** giữa lược đồ bộ dữ liệu BTC và mô hình dữ liệu sản phẩm, tách riêng khỏi phần còn lại | Chỉ tồn tại vì dữ liệu đến từ ngoài với lược đồ **chưa biết**. Sản phẩm vận hành thật không cần nó | Đổi tên một trường ở nguồn, chỉ sửa lớp ánh xạ, phần còn lại không đụng |
| `TR-2` | Gieo **hai tài khoản** Sales và Quản trị trong cùng lệnh nạp dữ liệu | Chỉ cần để giám khảo vào được; hệ thống thật có 7 vai và quy trình cấp tài khoản riêng | Từ bản clone sạch, chạy một lệnh rồi đăng nhập được cả hai (`NFR-12`, `FR-49`) |
| `TR-3` | **Báo cáo đối soát** sau mỗi lần nạp: số bản ghi từng loại, chênh lệch so với nguồn | Chỉ cần lúc nạp, để tin rằng dữ liệu vào đủ. Không phải tính năng vận hành | In ra khi chạy `NFR-8`; hai lần chạy cho cùng con số |
| `TR-4` | **Cờ giữ ghi vết** khi nạp lại, để đối chiếu trước-sau | Chỉ dùng trong ngày thi khi cần diễn lại mà vẫn giữ vết lần trước (`D32`) | Chạy có cờ và không cờ, so số dòng ghi vết |
| `TR-5` | **Quyết định bật `next_action_overwrite_overdue_manual`** sau khi xem bộ dữ liệu BTC thật | Chỉ tồn tại sáng 15/8, lúc lần đầu thấy dữ liệu. Vận hành thật luôn để `false` (`D12`) | Sau khi nạp, đếm **hai** con số: Cơ hội đang chạy có ô Việc tiếp theo **trống**, và Cơ hội có ô đã điền nhưng **đã quá hạn**. Con số thứ hai > 0 thì bật cờ. **Cả hai bằng 0 thì cờ này vô dụng** — đường thoát khi đó là để lệnh nạp chừa trống Việc tiếp theo cho ít nhất một Cơ hội đang chạy (`F36`) |

`TR-1` đáng chú ý: nó là **biện pháp duy nhất** giảm thiểu `Q15` — câu chặn còn lại của cả dự án.
Không có mã thì không có story, không có story thì ngày 15/8 không ai dựng nó.

## 10. Ràng buộc và phanh an toàn

### 10.1 Bốn ranh giới đề bài `§5` — chặn ở tầng nghiệp vụ

**Bốn ranh giới mang mã `NFR-14`…`NFR-17`** — không phải để cho đẹp: §9.2 đã nói *"Epic & Story chỉ
sinh story cho thứ có mã"*, và `T-10` là điểm nghiệm thu duy nhất treo hoàn toàn vào mục này.

| Mã | Ranh giới | Cách chặn | Nghiệm thu |
|---|---|---|---|
| `NFR-14` | Hệ thống **không tự đổi Giai đoạn** của Cơ hội | Dòng cuối bảng §5.1: tác nhân là hệ thống thì từ chối ở tầng nghiệp vụ | `T-10` vế 1 — gọi thẳng tầng nghiệp vụ với danh nghĩa hệ thống, phải bị từ chối |
| `NFR-15` | Hệ thống **không tự đánh dấu Thắng/Thua**, không tự sửa giá trị tiền | Cùng điểm chặn với `NFR-14` | `T-10` vế 2 |
| `NFR-16` | Hệ thống **không tự liên hệ khách** — không thư, không tin nhắn | Danh sách cho phép cho lệnh gọi ra ngoài | Chặn một lệnh gọi ngoài danh sách; **và** kiểm một lệnh gọi mô hình vẫn qua được (`F38`) |
| `NFR-17` | Hệ thống **không tự xoá dữ liệu do người tạo** | Không có công cụ xoá trong bộ công cụ của tầng AI | `T-10` vế 3 — chứng minh bằng **vắng mặt**: rà bộ công cụ, không có mục xoá |

Ba ranh giới đầu phải chặn được **kể cả khi thao tác đến từ ngoài giao diện** — `T-10` kiểm đúng
điều này, và *"một lời dặn dò suông với phần AI không tính là đã chặn"*.

`D25` làm chặt hơn: **cả bốn** ranh giới chặn ở tầng nghiệp vụ, không phân biệt lối vào, kể cả
ranh giới thứ tư, chỗ đề bài `§5` không đòi mức chặn này. Mỗi ranh giới có một dòng *"ràng buộc → cách enforce"* và một
kiểm thử **gọi thẳng tầng nghiệp vụ** với danh nghĩa hệ thống.

> ⚠️ **Cái bẫy của ranh giới 3.** đề bài `§5.3` cấm **chạm tới người thật**, **không** cấm gọi mạng — đề
> bài nói thẳng ở **đề bài `§3`** — *"gọi ra dịch vụ bên ngoài thì thoải mái, kể cả mô hình ngôn ngữ"*. Danh sách cho
> phép phải **mở** cho lệnh gọi mô hình, nếu không nó chặn oan chính phần AI (`F38`).

### 10.2 Ba mức quyền ghi của AI

Quy tắc một dòng: **thêm thì tự do, ghi đè thì phải duyệt** (`D16`, vá `F1` và `F2`).

| Mức | Áp cho | Cần gì |
|---|---|---|
| **Tự do** | Thêm mục Dòng thời gian (nhóm 5) · điền ô Việc tiếp theo đang trống (nhóm 4) | Không cần ai bấm; có Hoàn tác |
| **Xác nhận đơn** | Điền ô hồ sơ đang trống | Một cú bấm trong Hàng đợi gợi ý |
| **Xác nhận kỹ** | Ghi đè ô hồ sơ đã có giá trị | Buộc hiện diff **và** buộc chọn lý do |

> **Bảng này sắp lại `D16` một chỗ, có chủ đích.** `D16` xếp mức *tự do* gồm "thêm mục Dòng thời
> gian" và "ghi trường chỉ-AI", **không** nhắc ô Việc tiếp theo. Nhưng đề bài `§4/nhóm 4` nói thẳng
> hệ thống tự điền *"ngay lập tức, không hỏi ai"* — tức mức tự do. Theo quy tắc thẩm quyền, đề bài
> thắng `D16`, nên bảng trên đúng, và ô đó **đã được bổ sung vào `D16`** ở Mục 0 ngày 14/8.
>
> ✅ **Đã bổ sung vào `D16`** ở Mục 0 ngày 14/8, cùng lượt với `D42` cho trường *Giai đoạn mở gần
> nhất*.

### 10.3 Chi phí và riêng tư

- `transition` — Nội dung Công ty **phải lấy từ Bản chụp** trong bộ dữ liệu, không từ trang web
  thật, để mọi đội chạy trên cùng dữ liệu và kịch bản demo lặp lại được (đề bài `§3`). Ràng buộc
  này **chỉ sống trong kỳ thi**; sản phẩm thật đọc nguồn thật
- Không có chuỗi kết nối, khoá hay bí mật nào nằm trong mã hoặc trong lịch sử git (`NFR-6`)
- Ba cơ chế chặn chi phí ở `NFR-2`, `NFR-3`, `NFR-4`

## 11. Không làm gì

### 11.1 Không xây — ranh giới phạm vi

- **Không** soạn message tiếp cận, không phân vai buyer persona, không nỗi đau ba tầng như một
  tính năng — đề bài `§5.3` cấm **chạm tới người thật**, nên ba thứ này không có đầu ra. *(Không phải cấm gọi
  mạng — xem §10.1.)*
- **Không** thành một công cụ báo cáo cho cấp trên. Nếu Sales coi nhập liệu là thuế phải nộp thì họ
  sẽ trốn, và sản phẩm chết dù số đo đẹp. Cụ thể: mọi số đo ở `FR-41` và `FR-43` là **số gộp của
  cả hệ thống**, không có màn hình xếp hạng theo người, không có cột "ai duyệt nhanh nhất". Chúng
  đo **máy**, không đo **người**
- **Không** trở thành nền tảng dữ liệu đa nguồn. Nguồn duy nhất trong phạm vi này là bản chụp trang
  web của Công ty
- **Không** làm **phân quyền** theo người sở hữu — đề bài `§2` miễn, vì dữ liệu mẫu chỉ có một tài
  khoản Sales. Nhưng trường *người sở hữu* **vẫn tồn tại** và vẫn dùng để **định tuyến**: Hàng đợi gợi ý
  gợi ý và thông báo đi tới người sở hữu (`FR-18`, `FR-31`). Định tuyến là dữ liệu, phân quyền là
  kiểm soát — bản này có cái đầu, không có cái sau
- **Không** có chế độ tự duyệt Gợi ý, ở bất kỳ dạng nào, kể cả sau một khoảng thời gian (`FR-21`)

### 11.2 Không đánh đổi — nguyên tắc, không phải phạm vi

Ba dòng dưới **không** nói sản phẩm thiếu tính năng gì. Chúng nói có những thứ **không được đem ra
đổi** lấy tiến độ hay điểm số, kể cả lúc gấp:

- **Không** đổi truy nguồn lấy thêm tự động hoá. Câu trích không khớp thì Phát hiện bị loại, chứ
  không hiển thị kèm cảnh báo (`BR-D2`)
- **Không** đổi quyền sở hữu dữ liệu của Sales lấy con số đẹp. Không duyệt thì không có gì xảy ra,
  vô thời hạn (`FR-21`)
- **Không** tối ưu khối lượng đầu ra của AI (`D40`)

## 12. Phạm vi bản đầu

### 12.1 Trong phạm vi

Sáu nhóm tính năng đề bài `§4` với **51 FR** ở §8 (34 `phải có` · 15 `nên có` · 2 `bỏ được`) · hai vai Sales và Quản trị · sáu Loại tin (`0.1.4`) cộng
13 `signal_subtype` khi Loại tin là `other` (`D2`) · bốn ranh giới đề bài `§5` chặn ở tầng nghiệp vụ · bộ
kiểm thử phủ `T-1`…`T-10` · lệnh nạp dữ liệu idempotent.

### 12.2 Ngoài phạm vi bản đầu

| Bỏ gì | Mã | Vì sao |
|---|---|---|
| Lớp mô tả ngữ nghĩa cho chính CRM | `F26` | Việc tuỳ chọn; không nhóm nào của đề bài `§4` đòi |
| Buying committee — nhiều đầu mối một Công ty | `F28` | Đúng nghiệp vụ nhưng phình mô hình dữ liệu. `[NOTE FOR PM]` — đây là mục dễ bị giám khảo vòng 3 hỏi nhất trong nhóm này |
| Giao diện vượt khỏi dạng biểu mẫu | `F30` | Rủi ro đã biết cho vòng 3, **chấp nhận có ý thức** |
| Hoạt động có hướng và trọng số | `F31` | Việc tuỳ chọn |
| Năm vai còn lại của hệ thống thật | — | Đề bài chỉ cấp hai tài khoản |
| Nhiều đơn vị tiền | `D34` | Một đơn vị duy nhất trong phạm vi này |
| Dòng hàng, báo giá, hợp đồng, tệp đính kèm dưới Cơ hội | — | Cơ hội chỉ có **một** giá trị dự kiến và một tháng dự kiến chốt. đề bài `§4/nhóm 1` không đòi gì hơn, và mọi thứ trong danh sách này đều kéo theo một thực thể mới |
| Dự báo có nhân xác suất thắng | `D34` | Chỉ có *"tổng giá trị ước tính (chưa nhân xác suất)"*. Hệ thống thật có `winRate` và `weightedValue`; bản này **không** |

### 12.3 Ràng buộc của cuộc thi định hình phạm vi

4,5 tiếng ngày 15/8 · không cloud, không staging, chạy local nhưng đủ như production · **một tính
năng BTC phát thêm chưa biết nội dung**, và `D41` đã giữ trống một nửa quỹ giờ cho nó · mọi việc
quan trọng có sinh log phải diễn ra **lại** trong ngày thi (`D39`) — `transition`, ràng buộc chỉ
sống trong kỳ thi.

### 12.4 Hai điều kiện nộp bài cố ý nằm ngoài PRD

Đề bài `§7` có năm điều kiện nộp bài. **Ba** trong số đó — đề bài `§7.3` bản dựng production, đề bài `§7.4` bộ
kiểm thử một lệnh, đề bài `§7.5` lệnh nạp dữ liệu — là **phẩm chất của sản phẩm đang chạy**, nên chúng
nằm ở §9.1 dưới dạng `NFR-5`, `NFR-7`, `NFR-8`, `NFR-11`, `NFR-12`, `NFR-13`.

**Hai** điều kiện còn lại **không** vào PRD, và đây là lựa chọn có chủ đích chứ không phải bỏ sót:

| Điều kiện | Vì sao ngoài PRD | Theo dõi ở đâu |
|---|---|---|
| đề bài `§7.1` Mã nguồn trên GitLab của HBLAB | Nói *mã nằm ở đâu*, không nói sản phẩm cư xử ra sao. Đưa vào §9.1 là mô hình sai — nó không phải một phẩm chất đo được của hệ đang chạy | `CHECKLIST.md` mục C |
| đề bài `§7.2` Log Claude Code chảy về Grafana | Nói *quá trình làm ra sản phẩm*, không nói sản phẩm. Đây là điều kiện tiên quyết của vòng 1, và `D37` đã xếp nó là **việc làm trước tiên** | `CHECKLIST.md` mục B · `D37` · `docs/chien-luoc-ngay-thi.md` |

Hai dòng này ghi ở đây để người đọc PRD không tưởng đội bỏ sót đề bài `§7`.

### 12.5 Thứ tự cắt khi hết giờ

**Tiêu chí và bảng ở đầu §8** — 34 `phải có` · 15 `nên có` · 2 `bỏ được`. Cắt theo đúng thứ tự
ngược: `bỏ được` trước, rồi `nên có`, và **không bao giờ** chạm `phải có` — vì mỗi cái trong đó **hoặc**
có một điểm `T` dựa vào, **hoặc** là một điều kiện nộp bài ở đề bài `§7` (đó là đường `FR-49` vào
nhóm này).

**Một `nên có` bị một `phải có` dựa vào thì không cắt được.** Ví dụ `FR-19` (`nên có`) bày ra bốn
thứ mà `FR-20` (`phải có`) cho người bấm; cắt `FR-19` thì ba nút của `FR-20` không còn gì để quyết,
và `T-5` đỏ. Trước khi cắt, đọc phần *Mô tả* của nhóm chứa nó.

**Không bao giờ cắt, kể cả khi đã hết `nên có`:** truy nguồn của Phát hiện (`BR-D1`, `BR-D2`) ·
bốn ranh giới `§10.1` · phanh `FR-45`. Ba thứ này là điều kiện để những thứ còn lại được phép tồn
tại; cắt chúng thì sản phẩm còn chạy nhưng không còn đúng.

## 13. Số đo thành công

### 13.1 Chính

- **SM-1 · Tỉ lệ Phát hiện được xử lý không cần người quyết.**
  - **Tử số:** số Phát hiện đi qua `FR-27` (tự đặt Việc tiếp theo) **hoặc** `FR-36` (tự thêm mục
    Dòng thời gian) — hai đường máy ghi mà không ai bấm
  - **Mẫu số:** **tổng** Phát hiện sinh ra trong kỳ
  - **Mục tiêu ≥ 40%** *(tạm — chỉ chốt được sau khi thấy bộ dữ liệu BTC)*. Nghiệm `FR-27`, `FR-36`
  - **Không** tính Gợi ý được duyệt: gợi ý **có** người quyết, đưa vào là tự phá định nghĩa của
    chính số đo — và `SM-C2` cùng `SM-C5` dựng ra để chống đúng việc đó
  - **Đây là số đo duy nhất đo được `BUS-1`**, tức vế *chi phí chú ý* của nguyên nhân gốc. Vế còn
    lại — `BUS-3`, *chạm được trong cửa sổ* — chưa có số đo nào trong phạm vi này

### 13.2 Phụ

- **SM-2 · Ô do AI điền còn nguyên sau 7 ngày.** > 80% (`D29`). Nghiệm FR-27, FR-32
- **SM-3 · `auto-accept rate`.** > 85% (`D29`). Định nghĩa ở §3.1. Nghiệm `FR-18`, `FR-20`
- **SM-4 · `error-detection rate`.** Đo và hiển thị cạnh `auto-accept rate` (`D30`). Nghiệm FR-42
- **SM-5 · Trọng số hoàn thiện hồ sơ.** > 0,70 theo bảng `0.2.3` (`D31`). Nghiệm FR-18

### 13.3 Số đo đối trọng — **không** được tối ưu

- **SM-C1 · Thời gian quyết trung bình.** Đối trọng **SM-3**. `SM-3` lên cao có thể vì máy đúng,
  cũng có thể vì người duyệt mù — hai khả năng chỉ tách ra được khi đọc hai số **cạnh nhau**.
  `SM-3` trên 85% mà thời gian quyết dưới 3 giây là tín hiệu **xấu**, không phải tốt (`D29`)
- **SM-C2 · Số Phát hiện sinh ra mỗi vòng.** Đối trọng **SM-1**. Tăng số Phát hiện là cách rẻ nhất
  để đẩy tử số của SM-1, và nó tạo nhiễu — mà nhiễu là thứ phá niềm tin nhanh nhất
- **SM-C3 · Khối lượng log Claude Code.** Đối trọng cách chấm vòng 1. Vòng 2 rút **ngẫu nhiên 3–5
  câu hỏi từ chính log của đội**, nên log không ai đọc chính là bề mặt bị hỏi (`D40`, `F39`)
- **SM-C4 · Tỉ lệ hoàn tác thấp.** Đối trọng **SM-2**. Tỉ lệ hoàn tác thấp có thể nghĩa là máy
  đúng, cũng có thể nghĩa là **không ai nhìn**. Đọc cùng `SM-4`
- **SM-C5 · Tỉ lệ Công ty bật Đang theo dõi.** Đối trọng **SM-1**. Chạm 3 (`FR-36`) nằm trong tử số
  của `SM-1`, nên bật Đang theo dõi cho **toàn bộ** Công ty là cách rẻ nhất đẩy `SM-1` lên mà không
  cải thiện gì. Bật cho mọi Công ty cũng phá luôn `D17`, vốn dựa vào nhãn này để tách hai đường ghi

## 14. Câu hỏi còn mở

1. **`Q15` — lược đồ bộ dữ liệu BTC.** Câu chặn duy nhất còn lại, và nó thuộc BTC. Giảm thiểu bằng
   **`TR-1`** — một lớp ánh xạ mỏng tách riêng, đổi lược đồ nguồn mà không sửa phần còn lại
2. **Ngưỡng của `SM-1`.** Ghi tạm 40%; chỉ chốt được ngày 15/8 khi thấy dữ liệu thật
3. **Cái giá của hiện trạng.** Chờ ba câu ở `cau-hoi-dong-doi.md` của bước brief. Thiếu nó thì
   `SM-1` đo được sản phẩm nhưng không nói được sản phẩm đáng giá bao nhiêu
4. ~~Bổ sung ngược vào Mục 0~~ — **đã làm 14/8**, không còn treo. Mục 0 nay chốt `D1`–`D45`:

   | Đã sửa gì ở Mục 0 | Chỗ trong PRD |
   |---|---|
   | `D16` thêm ô *"điền Việc tiếp theo đang trống"* vào mức **tự do** | §10.2 |
   | `D30` chốt `error-detection rate` còn **hai** nguồn vào mẫu số | `FR-42` |
   | `D31` khoá xếp là **so lần lượt**, và dùng *đang chạy* | `FR-18` |
   | **`D42` mới** — trường *giai đoạn mở gần nhất* | §3.2, §5.3 |
   | **`D43` mới** — mở lại Cơ hội đã đóng chỉ vai Quản trị | §5.2 |
   | **`D44` mới** — Cơ hội mới luôn bắt đầu ở `tiep_can` | §5.1, `FR-3` |
   | **`D45` mới** — Phát hiện `low` không vào Hàng đợi gợi ý | `FR-18` |
5. **`Q6` mô hình neo vị trí câu trích · `Q10` bảng ánh xạ độ gấp · `Q12` được đè ô người nhập đã
   quá hạn không · `Q16` ngôn ngữ nội dung bản chụp** — bốn câu *nên hỏi BTC nhưng không chặn*; đội
   đã tự chốt bằng `D21`, `D5`–`D9`, `D12`, `D33`

## 15. Mục lục giả định

| Mã | Giả định | Ở đâu | Trạng thái |
|---|---|---|---|
| `A1` | `tam_dung` đi thẳng sang `thang` **hoặc** `thua` được — khách im hẳn là thua thật, không phải quay lại rồi mới đóng | §5.1 | ✅ **đã xác nhận** 14/8 |
| `A2` | Khi Quản trị mở lại Cơ hội đã đóng, nó về **Giai đoạn mở gần nhất** — đối xứng với đường ra của `tam_dung`, dùng chung một trường | §5.1, §5.3 | ✅ **đã xác nhận** 14/8 |
| `A3` | Sang `thang` không đòi trường bắt buộc nào, khác `thua` vốn đòi lý do — theo đúng đề bài, không thêm yêu cầu ngoài | §5.1 | ✅ **đã xác nhận** 14/8 |
| `A4` | Vai Quản trị **bao trùm** Sales; **bốn** hành động in đậm ở §6 là toàn bộ khác biệt | §6 | ✅ **đã xác nhận** 14/8 |
| `A5` | Giới hạn việc mở lại Cơ hội đã đóng cho riêng Quản trị — `làm chặt hơn` đề bài `§4/nhóm 1` | §5.1, §5.2 | ✅ **đã xác nhận** 14/8, rủi ro nghiệm thu bằng không |
