# Phản biện và phân tích yêu cầu — đề bài "AI Native CRM"

## Tài liệu này là gì, và dùng nó thế nào

Bản phân tích yêu cầu do đội thi soạn, **không phải văn bản của ban tổ chức**. Nó có hai công dụng,
và cấu trúc tài liệu phục vụ cả hai:

1. **Bài dự thi hạng mục Requirement Analysis** — bốn mục "Mức 1…4" bám đúng bốn mức của barem:
   diễn giải nguyên bản (Mức 1) → đặt câu hỏi làm rõ (Mức 2) → phân rã story kèm tiêu chí nghiệm
   thu và bổ sung tri thức nghiệp vụ (Mức 3) → phản biện theo persona, tự tìm edge case và rủi ro
   (Mức 4), kèm prompt log ở phụ lục.
2. **Đầu vào để sinh mã.** Ghép tài liệu này với
   [đề bài chính thức](Yêu%20Cầu%20đề%20bài%20chính%20thức%20của%20cuộc%20thi%20prd.md) là đủ để bắt
   đầu dựng sản phẩm, không cần tài liệu thứ ba. Đề bài nói *phải có gì*; tài liệu này chốt *những
   chỗ đề bài để trống*.

### Thứ tự ưu tiên khi hai tài liệu nói khác nhau

| Hạng | Nguồn | Có thẩm quyền về |
|---|---|---|
| 1 | **Đề bài chính thức** | Cái gì phải có · hành vi hệ thống · bộ nghiệm thu `T-1`…`T-10` |
| 2 | **Mục 0** của tài liệu này | Mọi chi tiết đề bài để trống: enum, ngưỡng, con số, thứ tự ưu tiên |
| 3 | **Mức 1–5** của tài liệu này | Lý do đằng sau từng quyết định ở Mục 0 — dùng khi cần bảo vệ lựa chọn |

Ba quy tắc kèm theo, có để tránh đúng lỗi "hai chỗ nói hai giá trị khác nhau":

- **Mục 0 là nguồn duy nhất của các con số.** Mức 1–5 chỉ giải thích, không định nghĩa. Sửa một con
  số thì sửa ở Mục 0 trước, rồi mới cập nhật phần giải thích.
- **Chỗ tài liệu này làm chặt hơn đề bài** đều mang nhãn `làm chặt hơn` trong bảng quyết định. Mỗi
  chỗ như vậy phải kiểm lại là không làm đỏ `T-1`…`T-10` — có một cột riêng cho việc này.
- **Giả định của đội** không trộn vào phần diễn giải đề bài. Mọi giả định đều có một dòng trong
  bảng quyết định, kèm trạng thái `chốt` hoặc `chờ BTC`.

### Nếu bạn là một tác nhân sinh mã

Đọc theo thứ tự này: đề bài chính thức → **Mục 0 trọn vẹn** → **Mức 3** (story và tiêu chí nghiệm
thu) → phần còn lại chỉ khi cần lý do. Mục 0 chứa toàn bộ enum, ngưỡng và bảng số ở dạng bảng
phẳng, không lồng, không `<br>`; mỗi dòng có một định danh `Dn` để trích dẫn lại trong mã và trong
kiểm thử.

### Nguồn

Bốn mục đầu (Mức 1–4) chỉ đứng trên năm tệp do BTC phát trong thư mục này:
[đề bài chính thức](Yêu%20Cầu%20đề%20bài%20chính%20thức%20của%20cuộc%20thi%20prd.md) ·
[thể lệ](0.%20Thể%20lệ%20AI%20Hackathon%2001%20-%20Dev%20Edition.md) ·
[playbook sales](1.%20Business%20Playbook%20-%20quy%20trình%20sales.md) ·
[phương pháp luận AI-native](2.%20Thiết%20kế%20phần%20mềm%20thế%20hệ%20AI%20Native%20-%20phương%20pháp%20luận.md) ·
[barem](3.%20Checklist%20chấm%20điểm%20AI-Hackathon.md).

**Mục 5 là phần bổ sung viết sau**, đối chiếu toàn bộ phản biện trên với hệ thống CRM thật của
HBLAB và handbook đào tạo BD ở thư mục `docs/CRM clone từ Airtable/`. Chỉ mục 5 dùng hai tệp đó.
Mục 0 thì tổng hợp kết luận của cả năm mục, nên nó dùng cả bảy tệp.

### Quy ước định danh

| Tiền tố | Nghĩa | Ví dụ |
|---|---|---|
| `§n` | mục n của đề bài chính thức. `§4/nhóm 3` là nhóm tính năng 3; `§5.2` là ranh giới thứ hai của mục 5 | `§4/nhóm 5` |
| `T-n` | điểm nghiệm thu thứ n ở `§6` của đề bài | `T-10` |
| `Dn` | **quyết định chốt** — dòng có thẩm quyền cài đặt, nằm ở Mục 0 | `D5` |
| `Qn` | điểm mơ hồ và câu hỏi làm rõ (Mức 2) | `Q10` |
| `Fn` | mâu thuẫn hoặc lỗ hổng phát hiện được (Mức 4 và mục 5.4) | `F19` |
| `En-Sm` | story thứ m của epic thứ n (Mức 3) | `E4-S1` |

### Bản đồ tài liệu

| Mục | Nội dung | Đọc khi nào |
|---|---|---|
| **Mục 0** | Tầng chuẩn: từ vựng, enum, bảng số, 47 quyết định chốt `D1`…`D47`, trạng thái mọi `Q` và `F` | Trước khi viết dòng mã đầu tiên |
| **Mức 1** | Diễn giải lại đề bài, chấp nhận nguyên bản, không đánh giá | Khi cần bản rút gọn của đề bài |
| **Mức 2** | 22 điểm mơ hồ `Q1`…`Q22`, mỗi điểm một câu hỏi cho BTC và một hướng đi | Khi cần biết vì sao một chi tiết phải tự quyết |
| **Mức 3** | 7 epic, 41 story, tiêu chí nghiệm thu, ánh xạ `T`, lỗ hổng phủ kiểm thử | Khi lập kế hoạch sprint và viết kiểm thử |
| **Mức 4** | 4 persona, 24 mâu thuẫn `F1`…`F24`, edge case, rủi ro | Khi cần bảo vệ lựa chọn ở vòng vấn đáp |
| **Mục 5** | Đối chiếu với CRM thật của HBLAB: tự trả lời `Q`, sửa `F`, thêm `F25`…`F38`; 5.7 soát thể lệ thêm `F39`, 5.8 giải đáp BTC 14/8 thêm `F40` | Khi cần con số đã có người trả giá |
| **Phụ lục** | Prompt log ba vòng làm việc | Khi giám khảo hỏi quá trình |

---

# Mục 0 — Tầng chuẩn (dùng trực tiếp khi sinh mã)

Mục này không phản biện gì. Nó gom **kết luận** của bốn mục phản biện và mục đối chiếu thành một
tầng phẳng, có định danh, đủ để cài đặt mà không phải đọc lý lẽ. Mọi con số trong sản phẩm lấy từ
đây. Mức 1–5 phía sau là phần *vì sao*.

## 0.1. Enum chuẩn

Ba enum đầu là của đề bài, chép đúng nguyên bản. Ba enum sau do đội thêm, và đều có một dòng quyết
định giải thích vì sao cần thêm.

### 0.1.1. Loại công ty — `§2`, 5 giá trị, của đề bài

| Mã | Nhãn hiển thị |
|---|---|
| `traditional` | Traditional |
| `it_solution` | IT Solution |
| `it_product` | IT Product |
| `tech_based` | Tech-based/Startup |
| `ito_other` | ITO khác |

### 0.1.2. Giai đoạn cơ hội — `§4/nhóm 1`, 7 giá trị, thứ tự cố định, không đổi tên

| Thứ tự | Mã | Nhãn hiển thị | Tình trạng |
|---|---|---|---|
| 1 | `tiep_can` | Tiếp cận | đang mở |
| 2 | `du_dieu_kien` | Đủ điều kiện | đang mở |
| 3 | `soan_de_xuat` | Soạn đề xuất | đang mở |
| 4 | `thuong_luong` | Thương lượng | đang mở |
| 5 | `thang` | Thắng | đã đóng |
| 6 | `thua` | Thua | đã đóng |
| 7 | `tam_dung` | Tạm dừng | **đang mở** (`§4/nhóm 1` xếp vậy — xem `F7` và `D11`) |

### 0.1.3. Mức chắc chắn — `§2`, 3 giá trị, của đề bài

| Mã | Nhãn | Định nghĩa `§2` | Được tự đặt Việc tiếp theo? |
|---|---|---|---|
| `chac` | Chắc | trích thẳng, không suy luận | có |
| `co_the` | Có thể | suy một bước từ nguồn cụ thể | có |
| `doan` | Đoán | không có bằng chứng trực tiếp | **không bao giờ** (`D4`) |

### 0.1.4. Loại tin — `§4/nhóm 2`, 6 giá trị

Đề bài dùng **hai bộ nhãn khác nhau cho cùng sáu giá trị**: `§3` viết "bổ nhiệm lãnh đạo công nghệ /
mở rộng văn phòng / tuyển dụng quy mô lớn", `§4/nhóm 2` viết "nhân sự cấp cao / mở rộng / tuyển
dụng". Bảng dưới lấy nhãn của `§4/nhóm 2` làm chuẩn và ghi kèm nhãn `§3` để không ai dựng thành hai
enum (xem `F37`).

| Mã | Nhãn chuẩn — `§4/nhóm 2` | Nhãn tương ứng ở `§3` | `relevance` mặc định (`D3`) |
|---|---|---|---|
| `funding` | Gọi vốn | gọi vốn | `high` |
| `leadership` | Nhân sự cấp cao | bổ nhiệm lãnh đạo công nghệ | `high` |
| `expansion` | Mở rộng | mở rộng văn phòng | `high` |
| `hiring` | Tuyển dụng | tuyển dụng quy mô lớn | `high` |
| `new_business` | Mảng kinh doanh mới | các mảng kinh doanh mới | `medium` |
| `other` | Khác | khác | theo `signal_subtype` (0.1.5) |

Câu "Tin mới thuộc **bốn dạng**" ở `§3` không phải một enum thứ hai. Bốn dạng đó là **bốn tín hiệu
kinh điển của playbook** mà `§2` gọi tên đúng như vậy: gọi vốn, nhân sự cấp cao, mở rộng, tuyển
dụng. `§3` liệt kê bốn tín hiệu đó rồi phụ thêm hai giá trị `new_business` và `other`, và giữ lại
chữ "bốn dạng" từ bản nháp. Đây là lời giải cho `Q1` và `F15`, và cũng giải thích vì sao đúng bốn
giá trị đó là bốn giá trị `high` ở bảng trên.

### 0.1.5. `signal_subtype` — đội thêm, 13 giá trị, chỉ áp khi `signal_type = other` (`D2`)

Không có trường này thì `other` thành hố rác: mọi tín hiệu không khớp năm giá trị có tên đều rơi
vào đó, và câu nhận định sinh ra sẽ chung chung — trong khi `§4/nhóm 2` đòi câu nhận định phải cho
thấy tín hiệu đã được đọc dưới góc loại công ty nào. Không phân biệt được RFP với MOU với M&A thì
không viết được câu nhận định có nghĩa.

| Mã | Nhãn | `relevance` mặc định | Vì sao có trong danh sách |
|---|---|---|---|
| `rfp` | RFP / tender / vendor shortlisting | `high` | Bằng chứng mua hàng trực tiếp nhất có thể có; handbook dặn gửi email xin vào vendor shortlist khoảng tháng 9–11 hằng năm |
| `partnership` | Hợp tác / MOU với đối tác tư vấn | `high` | Ký MOU với công ty tư vấn DX nghĩa là chuẩn bị bước triển khai tiếp theo |
| `compliance` | Quy định pháp lý / deadline tuân thủ | `high` | Tạo khối lượng kỹ thuật có deadline cứng — ví dụ HL7 cho EHR/HIS, dashboard ESG cho logistics |
| `m_and_a` | M&A / IPO / delisting | `high` | Sau sáp nhập luôn có dự án hợp nhất hệ thống; nghĩa nghiệp vụ khác hẳn `funding` dù gần nhau về tài chính |
| `roadmap_delay` | Chậm roadmap | `medium` | Suy ra từ **sự vắng mặt**: việc đáng lẽ xong tháng trước mà bản lưu mới vẫn chưa nhắc. Không có tin nào công bố việc này — đây là loại tín hiệu máy so hai bản lưu làm tốt hơn người |
| `dx_initiative` | Khởi động chuyển đổi số | `medium` | Tuyên bố DX mà không lập đơn vị mới, nên khác `new_business` |
| `certification` | Đạt chứng nhận (ISO 27001, SOC 2…) | `medium` | Tạo khối lượng kỹ thuật có deadline cứng |
| `downturn` | Mất khách lớn / tái cấu trúc / cắt giảm | `medium` | Tín hiệu **âm** — enum của đề bài không có chỗ nào cho loại này (xem `F25`) |
| `legacy_modernization` | Hiện đại hoá hệ thống cũ | `medium` | Chỉ có giá trị khi đi kèm một cái tên người: tâm lý "đang ổn thì đừng đụng" nên dự án chỉ xảy ra khi có initiator và champion |
| `ai_signal` | Tín hiệu AIX | `medium` | Tuyển vai trò AI/dữ liệu · ra mắt tính năng có AI · chuyển ngân sách từ thuê người sang nền tảng |
| `remote_team` | Đội remote-friendly | `low` | Tín hiệu yếu nhưng rẻ, playbook nêu cho nhóm Tech-based |
| `event` | Sự kiện / hiệp hội | `low` | EuroCham, KoCham, hội nghị ngành — yếu nhưng rẻ |
| `unclassified` | Chưa phân loại | `low` | Phải có để không bịa; màn hình Quản trị cảnh báo khi tỉ lệ này vượt ngưỡng |

### 0.1.6. `relevance` — đội thêm, 3 giá trị (`D3`)

| Mã | Định nghĩa vận hành | Hệ quả |
|---|---|---|
| `high` | có khả năng tạo nhu cầu nhân lực hoặc dự án IT **trong 3 tháng tới** | được tự đặt Việc tiếp theo nếu mức chắc chắn đạt (`D4`) |
| `medium` | liên quan gián tiếp | chỉ vào hàng đợi gợi ý của nhóm 3 |
| `low` | chỉ để biết | chỉ nằm ở vùng đọc của nhóm 2 |

Giá trị suy ra từ `signal_type` và `signal_subtype` theo 0.1.4 và 0.1.5. Mô hình được **hạ hoặc nâng
một bậc** so với mặc định, nhưng phải ghi kèm một câu lý do; không được nhảy hai bậc.

### 0.1.7. Lý do bỏ gợi ý — `§4/nhóm 3`, 5 giá trị, của đề bài

`thong_tin_sai` (thông tin sai) · `khong_lien_quan` (đúng nhưng không liên quan) · `da_cu` (đã cũ) ·
`hieu_sai_ngu_canh` (hiểu sai ngữ cảnh) · `khac` (khác).

Giá trị `thong_tin_sai` là một trong hai nguồn dữ liệu của `error-detection rate` ở `D30`.

## 0.2. Bảng số

### 0.2.1. Ngày hạn Việc tiếp theo và cửa sổ cơ hội (`D5`, `D6`)

Hai đồng hồ khác nhau, đề bài gộp làm một:

- **Cửa sổ cơ hội** — tín hiệu còn giá trị bán hàng trong bao lâu. Thuộc tính của *loại tin*.
- **Ngày hạn** — bao giờ Sales phải chạm. Phải **ngắn hơn cửa sổ nhiều**, vì playbook nói thẳng:
  *"khi tin gọi vốn đã lên mặt báo thì ba đối thủ đã gửi email trước rồi"*.

Ba cột hạn là **ngày làm việc**, đo từ **ngày sự kiện** chứ không từ lúc hệ thống đọc được.

| Loại tin | Cửa sổ cơ hội | `chac` + `high` | `chac` + `medium` | `co_the` (mọi `relevance`) | `doan` |
|---|---|---|---|---|---|
| `funding` | 30 ngày | **1 ngày** | 3 ngày | 5 ngày | không đặt |
| `leadership` | 90 ngày | **3 ngày** | 7 ngày | 10 ngày | không đặt |
| `new_business` | 60 ngày | **5 ngày** | 10 ngày | 14 ngày | không đặt |
| `hiring` | 90 ngày | **7 ngày** | 14 ngày | 14 ngày | không đặt |
| `expansion` | 90 ngày | **7 ngày** | 14 ngày | 14 ngày | không đặt |
| `other` | 30 ngày | 14 ngày | 14 ngày | không đặt | không đặt |

Bảng này tính hạn cho **mọi** phát hiện. Việc hạn đó được **tự điền** hay chỉ **đề nghị trong hàng
đợi** do cổng "đáng chú ý" ở `D4` quyết định, không do bảng này. Cụ thể: `relevance = high` cộng mức
chắc chắn `chac`/`co_the` thì tự điền; các trường hợp còn lại thì cùng con số đó đi vào gợi ý chờ
duyệt. Đây là chỗ hoà giải giữa `Q2` (chỉ bốn loại tin được tự đặt) và bảng số vốn có sáu dòng.

### 0.2.2. Ngưỡng và tham số

| Tham số | Giá trị mặc định | Cấu hình được? | Nguồn |
|---|---|---|---|
| Chu kỳ vòng quét — chế độ demo | 60 giây | có, ở màn hình Quản trị | `§4/nhóm 5` |
| Chu kỳ vòng quét — chế độ vận hành | 24 giờ | có | `D20` |
| Cửa sổ hoàn tác, nhóm 4 | 7 ngày | có | `§4/nhóm 4`, `D14` |
| Cửa sổ hoàn tác, nhóm 3 | 7 ngày | có | `D14`, `D15` |
| Sàn ngày hạn | cuối ngày làm việc kế tiếp | không | `D7` |
| Trần ngày hạn | 14 ngày làm việc | có | `D7` |
| Cửa sổ chống trùng tín hiệu | 30 ngày | có | `D18` |
| Ngưỡng độ tươi hồ sơ công ty | 30 ngày | có | `D47` |
| Ngưỡng trùng tiêu đề (cosine) | 0,9 | có | `D18` |
| TTL bộ đệm theo hash prompt | 24 giờ | có | `D20` |
| Cửa sổ số đo ngắn của màn hình Quản trị | 24 giờ | có | `D29` |
| Ngưỡng cảnh báo duyệt mù — thời gian quyết | < 3 giây | có | `D29` |
| Ngưỡng cảnh báo duyệt mù — nhịp duyệt | > 5 gợi ý / phút | có | `D29` |
| Ngưỡng tỉ lệ giữ nguyên ô AI điền sau 7 ngày | > 80% | có | `D29` |
| Ngưỡng tỉ lệ gợi ý được duyệt | > 85% | có | `D29` |
| Trần số lệnh gọi mô hình mỗi vòng quét | 20 | có | `D20` |

### 0.2.3. Trọng số ưu tiên (`D31`)

Thứ tự hàng đợi = `relevance` × mức chắc chắn × (công ty có cơ hội mở hay không). Với gợi ý loại
"điền ô còn trống", thứ tự trong một công ty theo trọng số hoàn thiện hồ sơ:

| Ô | Trọng số |
|---|---|
| địa chỉ trang web | 2 |
| quốc gia | 2 |
| mảng chuyên biệt | 2 |
| khoảng doanh thu | 1 |
| ngành | 1 |
| bậc giá trị thương vụ | 1 |
| năm thành lập | 1 |
| loại công ty | 1 |

Tổng 11, mục tiêu vận hành **> 0,70**. Điền địa chỉ trang web đáng giá gấp đôi điền năm thành lập.

## 0.3. Bảng quyết định chốt `D1`–`D47`

Cột **Quan hệ với đề bài**: `giữ` = chép đúng đề bài · `bổ sung` = đề bài để trống, đội tự chốt ·
`làm chặt hơn` = đội tự đặt ràng buộc nghiêm hơn đề bài · `chờ BTC` = chưa chốt được.
Cột **Rủi ro nghiệm thu**: chỗ nào một quyết định `làm chặt hơn` có thể làm đỏ một điểm `T`.

### Nhóm A — Mô hình dữ liệu và phát hiện

| ID | Quyết định | Quan hệ với đề bài | Nguồn | Rủi ro nghiệm thu |
|---|---|---|---|---|
| `D1` | Enum loại tin là 6 giá trị của `§4/nhóm 2` (0.1.4). "Bốn dạng" ở `§3` là bốn tín hiệu kinh điển của playbook theo `§2`, không phải enum thứ hai | giữ | `Q1`, `F15`, `F37` | không |
| `D2` | Thêm `signal_subtype`, từ vựng có kiểm soát 13 giá trị (0.1.5), chỉ áp khi `signal_type = other` | bổ sung | `Q1` | không |
| `D3` | Thêm trục `relevance` ∈ `high`/`medium`/`low` (0.1.6), suy ra từ loại tin và subtype; mô hình được lệch một bậc kèm lý do | bổ sung | `Q2`, `F10` | không |
| `D21` | Bản lưu lưu **hai dạng**: thô để đối chiếu và văn bản đã chuẩn hoá để neo. Offset câu trích tính trên bản chuẩn hoá; đánh dấu hiển thị trên bản chuẩn hoá | bổ sung | `Q6` | không — `T-3` chỉ đòi mở đúng đoạn có đánh dấu |
| `D22` | Câu trích phải **khớp nguyên văn** một đoạn trong bản lưu. Không khớp thì loại bỏ phát hiện đó và ghi nhật ký. Mọi enum bắt mô hình chọn trong danh sách cho sẵn, không nhập tự do | làm chặt hơn | `F34` | không — chặt hơn `T-2` theo cùng hướng |
| `D23` | Địa chỉ nguồn ghi **cả hai**: URL công bố của công ty và định danh bản chụp đã dùng | bổ sung | `Q5` | không |
| `D24` | Ba mức chắc chắn phân biệt bằng **ký hiệu và màu**, không dùng màu đơn độc | làm chặt hơn | `F14` | không |
| `D33` | Câu trích giữ nguyên ngôn ngữ gốc; câu nhận định viết tiếng Việt | bổ sung | `Q16`, `F21` | không |
| `D35` | Câu nhận định sinh theo công thức pain hypothesis có tham số loại công ty: *"Vì [áp lực bên ngoài] tạo ra [điểm nghẽn bên trong], [đầu mối] có lẽ quan tâm tới [KPI hoặc rủi ro cá nhân]"*. Cùng một câu trích với hai loại công ty phải cho hai câu nhận định khác nhau, mỗi câu chứa tên loại công ty | giữ + cách cài đặt | `§4/nhóm 2`, `E2-S4` | không — lấp một lỗ hổng phủ kiểm thử |
| `D26` | Xoá công ty là **xoá mềm**, kéo theo toàn bộ dữ liệu phụ thuộc; gợi ý đang chờ bị đóng kèm lý do "công ty đã xoá". Cơ hội cũng xoá được | bổ sung | `Q20`, `F17` | không |

### Nhóm B — Mức tự chủ và quyền ghi của AI

| ID | Quyết định | Quan hệ với đề bài | Nguồn | Rủi ro nghiệm thu |
|---|---|---|---|---|
| `D16` | **Quy tắc một dòng: thêm thì tự do, ghi đè thì phải duyệt.** Ba mức quyền ghi — *tự do* (thêm mục dòng thời gian · ghi trường chỉ-AI · **điền ô Việc tiếp theo đang trống của cơ hội đang chạy**, vì `§4/nhóm 4` nói thẳng hệ thống tự điền *"ngay lập tức, không hỏi ai"*) · *xác nhận đơn* (điền ô **hồ sơ công ty** đang trống, một cú bấm) · *xác nhận kỹ* (ghi đè ô đã có giá trị: buộc hiện diff và buộc chọn lý do) | bổ sung | `F1`, `F2` | không |
| `D17` | Công ty **Đang theo dõi**: nhóm 5 tự thêm mục dòng thời gian, nhóm 3 **không** sinh gợi ý loại "thêm tin mới". Công ty **không** theo dõi: ngược lại — nhóm 3 sinh gợi ý, nhóm 5 không chạm | bổ sung | `F1` | không |
| `D4` | **"Đáng chú ý" = `relevance = high` VÀ mức chắc chắn ∈ {`chac`, `co_the`}.** `doan` không bao giờ tự đặt. Đây là định nghĩa duy nhất của cụm từ này trong toàn bộ tài liệu | bổ sung | `Q2`, `F10` | không |
| `D10` | Tự đặt áp cho **mọi** cơ hội đang mở của công ty; mỗi cơ hội một bản ghi tự đặt và một nút Hoàn tác riêng | bổ sung | `Q3` | có — `T-6` phải khẳng định quan hệ, không khẳng định con số (`D36`) |
| `D11` | **Không** tự đặt cho cơ hội ở giai đoạn `tam_dung`, dù `§4/nhóm 1` xếp nó là *đang mở*. Cờ cảnh báo thiếu Việc tiếp theo cũng **im lặng** với cơ hội `tam_dung` cho tới khi nó quay lại một giai đoạn đang chạy | làm chặt hơn | `F7` | không — `T-1` và `T-6` không dùng `tam_dung` |
| `D12` | **Không ghi đè** ô Việc tiếp theo do người nhập tay, **kể cả khi đã quá hạn**. Thay vào đó ghim một dòng đề xuất ngay dưới ô. Ô đang trống hoặc ô do chính hệ thống đặt trước đó thì tự điền như `§4/nhóm 4` cho phép. Có cờ `nextAction.overwriteOverdueManual`, mặc định `false` | làm chặt hơn | `Q12`, `F8`, `F36` | **có** — nếu dữ liệu BTC điền sẵn Việc tiếp theo cho cả 8 cơ hội thì `T-6` không có ô trống để tự điền. Xử lý ở `F36` |
| `D13` | Hoàn tác lùi **một bước**; bản ghi lưu đủ chuỗi giá trị để tra cứu; nút hiện rõ đang lùi về giá trị nào | bổ sung | `Q12` | không |
| `D14` | Cửa sổ hoàn tác là **tham số**, mặc định **7 ngày**, dùng **một giá trị cho cả nhóm 3 và nhóm 4** để người dùng chỉ phải học một cơ chế. Cửa sổ hiện rõ trên màn hình; hết cửa sổ thì nút biến mất | giữ + mở rộng sang nhóm 3 | `Q11`, `F9` | không |
| `D15` | Duyệt và Sửa-rồi-duyệt đều lưu ảnh chụp giá trị cũ, nên nhóm 3 **cũng có** Hoàn tác — cùng kiểu nút với nhóm 4. Gợi ý vẫn **không tự hết hạn thành hành động** đúng `§4/nhóm 3`; gợi ý quá cũ chỉ mang nhãn "dựa trên bản lưu đã cũ" | bổ sung | `F9` | không |
| `D25` | Bốn ranh giới `§5` chặn ở **tầng nghiệp vụ**, không phân biệt lối vào, kể cả ranh giới thứ tư mà `§5` không đòi. Mỗi ranh giới có một dòng "ràng buộc → cách enforce" và một kiểm thử gọi thẳng tầng nghiệp vụ với danh nghĩa hệ thống. Lưu ý: `§5.3` cấm **chạm tới người thật**, không cấm gọi mạng — danh sách cho phép phải mở cho lệnh gọi mô hình ngôn ngữ (xem `F38`) | làm chặt hơn | `Q13`, `Q14`, `F6` | không — chặt hơn `T-10` theo cùng hướng |
| `D28` | Hai tài khoản, hai vai. Sales bị chặn vào màn hình Quản trị ở **tầng nghiệp vụ**, không chỉ ẩn menu | giữ | `Q18` | không |

### Nhóm C — Vòng quét và chống trùng

| ID | Quyết định | Quan hệ với đề bài | Nguồn | Rủi ro nghiệm thu |
|---|---|---|---|---|
| `D18` | Chỉ tạo bản lưu mới khi nội dung **khác** bản gần nhất. Chống trùng gợi ý theo **dấu vân nội dung**, không theo số hiệu bản lưu; thêm điều kiện trùng tiêu đề cosine ≥ 0,9 trong cửa sổ 30 ngày | bổ sung | `Q8`, `F19` | không |
| `D19` | **Không chồng vòng**: vòng mới chỉ chạy khi vòng trước kết thúc. Vòng bị bỏ vẫn ghi một dòng nhật ký kèm lý do. Khoá theo công ty — một công ty chỉ được một vòng xử lý tại một thời điểm | bổ sung | `Q7`, `F18` | không |
| `D20` | **Hai chế độ nhịp quét** trên cùng một tham số: vận hành (mặc định 24 giờ) và demo (60 giây). Kèm ba cơ chế chi phí: định tuyến model theo việc, bộ đệm theo hash prompt TTL 24 giờ, trần ngân sách kiểm trước mỗi lệnh gọi với cảnh báo ở 80% | bổ sung | `Q7`, `F18` | không — cấu hình demo giữ đúng 60 giây cho `T-4`, `T-8`, `T-9` |
| `D9` | Ngày hạn tính theo **ngày làm việc của thị trường công ty khách** (JP/Global/KR). Lưu mọi mốc thời gian theo UTC, hiển thị theo múi giờ người dùng | bổ sung | `Q10` | không |

### Nhóm D — Ngày hạn và độ gấp

| ID | Quyết định | Quan hệ với đề bài | Nguồn | Rủi ro nghiệm thu |
|---|---|---|---|---|
| `D5` | Ngày hạn = f(loại tin, mức chắc chắn) theo bảng 0.2.1, tính theo **ngày làm việc**, đo từ **ngày sự kiện**. Không đọc được ngày sự kiện thì lấy ngày của bản lưu. Lưu `eventDate` tách khỏi `detectedAt` | bổ sung | `Q10` | không — `T-6` chỉ đòi hạn có đổi |
| `D6` | Tin **quá cửa sổ cơ hội** (0.2.1) thì không tự đặt gì: chỉ vào vùng đọc, gắn nhãn "tin cũ", tối đa là sinh gợi ý chờ duyệt | bổ sung | `Q10` | không |
| `D7` | **Sàn:** hạn không bao giờ nằm trong quá khứ, sớm nhất là cuối ngày làm việc kế tiếp. **Trần:** 14 ngày làm việc — quá đó thì việc đó là nuôi dưỡng, không còn là câu trả lời cho "why now" | bổ sung | `Q10` | không |
| `D8` | **Nhiều tin cùng lúc:** lấy hạn ngắn nhất, và nội dung Việc tiếp theo nhắc **mọi** tin đã kích hoạt | bổ sung | `Q10` | không |
| `D38` | Cả bảng 0.2.1 và mọi tham số ở 0.2.2 nằm ở màn hình Quản trị, sửa được, mỗi dòng kèm một câu giải thích, đổi có hiệu lực ngay — không cần triển khai lại | bổ sung | `Q10`, `F11` | không |

### Nhóm E — Đo lường và ưu tiên

| ID | Quyết định | Quan hệ với đề bài | Nguồn | Rủi ro nghiệm thu |
|---|---|---|---|---|
| `D29` | Mỗi số đo hiện **cả luỹ kế và cửa sổ 24 giờ**, kèm ngưỡng ở 0.2.2. Tỉ lệ duyệt và thời gian quyết trung bình hiện **cạnh nhau**, có khối cảnh báo duyệt mù. Ngôn từ cảnh báo là *"3 gợi ý cần rà lại"*, không phải *"phát hiện bất thường"* | bổ sung | `Q21`, `F11` | không |
| `D30` | Thêm **`error-detection rate`** = số phát hiện bị người bác bỏ với lý do `thong_tin_sai` / tổng số phát hiện có phản hồi. Cơ chế thu, **đúng hai nguồn vào mẫu số**: nút "không hữu ích" trên một phát hiện, và lý do `thong_tin_sai` khi bỏ một gợi ý. Lý do ngắn khi Sales xoá mục do hệ thống thêm là **tuỳ chọn**, nên **không** vào mẫu số — mẫu số co giãn theo mức chăm chỉ của người dùng thì không so được giữa hai kỳ. Mục bị xoá dùng **xoá mềm** để vẫn còn làm dữ liệu đo. Đặt cạnh `auto-accept rate` | bổ sung | `F12` | không |
| `D31` | Hàng đợi **có thứ tự**: khoá xếp là bộ ba (`relevance`, mức chắc chắn, công ty có cơ hội **đang chạy** hay không), **so lần lượt theo thứ tự đó** — không phải một phép nhân số học, vì ba enum không nhân được. *Đang chạy* = bốn giai đoạn đầu, **không** gồm `tam_dung`, cho khớp `D11`. Gom theo công ty là khoá ngoài. Gợi ý điền ô trống xếp theo trọng số hoàn thiện ở 0.2.3 | bổ sung | `F13` | không |
| `D27` | Lý do thua chọn từ **enum dạng mảng** cộng một ô ghi chú tự do, không phải một câu tự do — để đếm được, và Sales bấm nhanh hơn | bổ sung | `F16` | không |
| `D34` | Một đơn vị tiền **duy nhất** trong phạm vi hackathon, ghi rõ trên giao diện. Tổng giá trị theo giai đoạn gọi đúng tên **"tổng giá trị ước tính (chưa nhân xác suất)"**, không gọi là pipeline value và không bao giờ gọi là doanh thu | bổ sung | `F27` | không |

### Nhóm F — Nghiệm thu và vận hành

| ID | Quyết định | Quan hệ với đề bài | Nguồn | Rủi ro nghiệm thu |
|---|---|---|---|---|
| `D36` | Bộ nghiệm thu viết dạng `Feature`/`Scenario`, giữ `T-1`…`T-10` làm lớp ngoài, mỗi `T` là một `Feature` nhiều `Scenario`. Ba chỗ sửa ngay: `T-4` thêm `Given công ty đang bật Đang theo dõi`; `T-6` và `T-8` đổi từ khẳng định con số sang **khẳng định quan hệ** ("mỗi tin mới trong bản chụp sinh đúng một mục"); thêm scenario cho 14 lỗ hổng phủ kiểm thử | làm chặt hơn | `F3`, `F5`, `F22` | không |
| `D32` | Lệnh nạp dữ liệu đưa hệ thống về **đúng trạng thái phát bài, kể cả ghi vết**, có cờ giữ ghi vết khi cần đối chiếu, và in một báo cáo đối soát số bản ghi. Một **lớp ánh xạ mỏng** tách riêng để đổi lược đồ nguồn mà không sửa phần còn lại | giữ + bổ sung | `Q15`, `Q17`, `F20` | không |
| `D37` | Log Claude Code chảy về Grafana là **việc làm trước tiên**, không để cuối. Kiểm bằng một lần chạy thật và xem log lên bảng | giữ | `F23` | không — đây là điều kiện tiên quyết của vòng 1 |
| `D39` | Mọi việc quan trọng có sinh log phải diễn ra **lại** trong ngày thi (viết kiểm thử, refactor, sinh tài liệu). BTC xác nhận 14/8: chỉ log ngày 15/8 được tính, và chạy lại phân tích trong ngày thi là đúng cách, không phải lách | giữ — BTC đã chốt | `Q22`, `F24` | không |
| `D40` | **Không tối ưu khối lượng log.** Mọi đầu ra AI giữ lại trong ngày thi phải có một người đọc và nói được lý do trong một câu; nói không được thì bỏ, không giữ. Thể lệ cho vòng 2 rút **ngẫu nhiên 3–5 câu hỏi từ chính log của đội**, nên phần log không ai đọc chính là bề mặt bị hỏi | bổ sung | `F39` · thể lệ | không |
| `D41` | **Giữ trống một nửa quỹ giờ ngày thi cho tính năng BTC phát thêm.** Kế hoạch 15/8 chia ba khối: nạp dữ liệu thật và sửa lớp ánh xạ · tính năng mới · hoàn thiện. Không xếp việc bắt buộc nào vào khối giữa. Thứ phải tập trước không phải sản phẩm mà là **một vòng đầy đủ RA → thiết kế → mã → kiểm thử → triển khai chạy được trong khoảng hai tiếng** | bổ sung | `F40` · giải đáp BTC 14/8 | không |

### Nhóm G — Bổ sung từ bước PRD và từ phỏng vấn

Quyết định sinh sau khi Mục 0 đã chốt `D1`–`D41`. `D42`–`D45` sinh khi dựng PRD; `D46`–`D47` sinh
từ **buổi hỏi Sales Manager ngày 14/8** — hai quyết định duy nhất trong cả sổ đứng trên câu trả
lời của một người trong nghề, không trên tài liệu.

| ID | Quyết định | Quan hệ với đề bài | Nguồn | Rủi ro nghiệm thu |
|---|---|---|---|---|
| `D42` | Thêm trường **giai đoạn mở gần nhất**: giai đoạn **đang chạy** cuối cùng của cơ hội trước khi nó sang `tam_dung`, `thang` hoặc `thua`. Một trường phục vụ hai đường quay lại — ra khỏi `tam_dung`, và khi Quản trị mở lại cơ hội đã đóng. Đi từ `tam_dung` sang `thang`/`thua` thì **giữ nguyên** giá trị đã lưu, không ghi đè bằng `tam_dung` | bổ sung | PRD §5.3 | không — `T-1` không chạm `tam_dung` |
| `D43` | **Mở lại cơ hội đã đóng chỉ vai Quản trị.** `§4/nhóm 1` viết *"đi lùi và nhảy cóc đều được, hệ thống không chặn"*; giới hạn này chặt hơn câu đó. Lý do: số thắng/thua là gốc của mọi báo cáo | làm chặt hơn | PRD §5.2 | không — không điểm `T` nào kiểm việc mở lại cơ hội đã đóng |
| `D44` | **Cơ hội mới luôn bắt đầu ở `tiep_can`**, người tạo không chọn được giai đoạn khác | làm chặt hơn | PRD §5.1 | không — `T-1` tạo cơ hội rồi mới kéo qua ba giai đoạn |
| `D45` | Phát hiện có `relevance = low` **không** vào hàng đợi gợi ý; nó chỉ nằm ở vùng đọc của nhóm 2, đúng như `0.1.6` đã định nghĩa. Đề bài không lọc theo độ liên quan | làm chặt hơn | PRD `FR-18`, `D3` | không — không điểm `T` nào đòi hàng đợi chứa phát hiện `low` |
| `D46` | **Hệ thống không tự sửa mục dòng thời gian do người tạo** — ghi chú và hoạt động của Sales chỉ người sửa được. Máy chỉ được **thêm mục mới**, gắn nhãn do hệ thống thêm. Đây là ranh giới thứ năm, đề bài chỉ có bốn | làm chặt hơn | **Sales Manager chốt 14/8** · PRD `NFR-19` | không — không điểm `T` nào đòi máy sửa được mục dòng thời gian |
| `D47` | **Ngưỡng độ tươi hồ sơ: 30 ngày.** Công ty có hồ sơ không đổi quá 30 ngày mang cờ *hồ sơ đã cũ*. Khớp mốc khách nguội trên 30 ngày của hệ thống thật | bổ sung | **Sales Manager chốt 14/8** · PRD `NFR-18` | không |

## 0.4. Trạng thái 22 câu hỏi `Q1`–`Q22`

| Câu | Tự chốt được? | Quyết định tương ứng | Còn phải hỏi BTC |
|---|---|---|---|
| `Q1` | có | `D1`, `D2` | không |
| `Q2` | có | `D3`, `D4` | không |
| `Q3` | có | `D10` | không |
| `Q4` | có | `D22` | không |
| `Q5` | có | `D23` | không |
| `Q6` | có | `D21` | nên hỏi, không chặn |
| `Q7` | có | `D19`, `D20` | không |
| `Q8` | có | `D18` | không |
| `Q9` | có | `D36` | không |
| `Q10` | có | `D5`–`D9`, `D38` | nên hỏi, không chặn |
| `Q11` | có | `D14` | không |
| `Q12` | có | `D12`, `D13` | nên hỏi, vì đề bài cho phép đè mà đội chọn không đè |
| `Q13` | có | `D25` | không |
| `Q14` | có | `D25` | không |
| `Q15` | **không** | `D32` giảm thiểu rủi ro | **phải hỏi** — lược đồ bộ dữ liệu |
| `Q16` | có | `D33` | nên hỏi, không chặn |
| `Q17` | có | `D32` | không |
| `Q18` | có | `D28` | không |
| `Q19` | có | `D27` | không |
| `Q20` | có | `D26` | không |
| `Q21` | có | `D29` | không |
| `Q22` | **BTC đã trả lời 14/8** | `D39` chốt, và sinh ra `D41` | không còn |

**Tổng: 1 câu chặn còn lại** (`Q15`) và **4 câu nên hỏi nhưng không chặn** (`Q6`, `Q10`, `Q12`,
`Q16`). `Q22` đã đóng bằng giải đáp của BTC ngày 14/8. Danh sách này thay cho mọi con số đếm khác
trong tài liệu.

## 0.5. Trạng thái 40 mâu thuẫn `F1`–`F40`

| Mã | Vấn đề, một dòng | Trạng thái | Giải bằng |
|---|---|---|---|
| `F1` | Hai đường ghi trùng vào dòng thời gian cho công ty Đang theo dõi | đã giải | `D16`, `D17` |
| `F2` | Lời hứa "không duyệt thì không có gì xảy ra" không đúng phạm vi | đã giải | `D16`, `D17` |
| `F3` | `T-4` pass được bằng cách không làm gì | đã giải | `D36` |
| `F4` | Bộ nghiệm thu do đội tự viết rồi giám khảo chạy chính bộ đó | **không giải được** — thuộc thể lệ | giảm thiểu: viết chặt và chuẩn bị lý lẽ vấn đáp |
| `F5` | `T-6`, `T-8` khẳng định con số tuyệt đối | đã giải | `D36` |
| `F6` | `§5` nói ba ranh giới, `T-10` kiểm bốn | đã giải | `D25` |
| `F7` | Cơ hội Tạm dừng vẫn bị giục | đã giải | `D11` |
| `F8` | Được ghi đè Việc tiếp theo người nhập đã quá hạn | đã giải, chọn chặt hơn đề bài | `D12`, và `F36` cho tình huống xấu |
| `F9` | Nhóm 3 duyệt xong không có đường lùi | đã giải | `D14`, `D15` |
| `F10` | "Phát hiện đáng chú ý" không có định nghĩa | đã giải | `D3`, `D4` |
| `F11` | Duyệt mù làm số đo đẹp giả | đã giải | `D29` |
| `F12` | Thiếu `error-detection rate` | đã giải | `D30` |
| `F13` | Hàng đợi không có thứ tự ưu tiên | đã giải | `D31` |
| `F14` | Mức chắc chắn được phép phân biệt bằng màu đơn độc | đã giải | `D24` |
| `F15` | `§3` viết "bốn dạng" rồi liệt kê sáu giá trị | đã giải | `D1` |
| `F16` | Hai màn hình bị nhắc mà không định nghĩa | đã giải | `D27`, `E1-S11` |
| `F17` | Xoá không rõ cascade, không nói xoá cơ hội | đã giải | `D26` |
| `F18` | Chu kỳ 60 giây gặp độ trễ mô hình | đã giải | `D19`, `D20` |
| `F19` | Gợi ý đã bỏ mọc lại mỗi vòng | đã giải | `D18` |
| `F20` | Lược đồ bộ dữ liệu BTC không công bố trước | **rủi ro còn mở** | giảm thiểu bằng `D32`; chờ `Q15` |
| `F21` | Không rõ ngôn ngữ nội dung bản chụp | đã giải | `D33` |
| `F22` | 14 yêu cầu `§4` không có kiểm thử phủ | đã giải | `D36` |
| `F23` | Barem chấm theo giai đoạn dùng AI, đề bài chấm theo sản phẩm | đã giải | `D37` |
| `F24` | Thể lệ tự bất nhất về mốc tính log | đã giải — BTC trả lời 14/8 | `D39` |
| `F25` | Enum loại tin không có tín hiệu âm | đã giải | `D2`, subtype `downturn` |
| `F26` | Không có lớp mô tả ngữ nghĩa cho chính CRM | **chưa làm** — việc tuỳ chọn | mục 5.6, phần "nếu còn thời gian" |
| `F27` | Tổng giá trị theo giai đoạn dễ bị gọi sai tên | đã giải | `D34` |
| `F28` | Mô hình một đầu mối chính không diễn được buying committee | **chưa làm** — việc tuỳ chọn | mục 5.6, phần "nếu còn thời gian" |
| `F29` | Không có bước screening Keep / Hold / Drop | đã giải một phần | thêm ô "vì sao theo dõi công ty này" khi bật nhãn |
| `F30` | Giao diện toàn biểu mẫu sẽ thua Excel ở vòng 3 | **chưa làm** — việc tuỳ chọn | mục 5.6, phần "nếu còn thời gian" |
| `F31` | Hoạt động không có hướng và không có trọng số | **chưa làm** — việc tuỳ chọn | mục 5.6, phần "nếu còn thời gian" |
| `F32` | Dòng thời gian chỉ ở cấp công ty | đã giải một phần | cho hoạt động một liên kết tuỳ chọn tới cơ hội |
| `F33` | Cờ cảnh báo chỉ biết nhắc, không biết sửa | đã giải | mục 5.6 việc 10 — gắn `fixAction` một cú bấm |
| `F34` | Đề bài không cấm AI bịa câu trích | đã giải | `D22` |
| `F35` | Đề bài không đòi hỏi lại khi mơ hồ | đã giải một phần | gợi ý dạng hai lựa chọn khi phát hiện đọc được hai nghĩa |
| `F36` | `D12` có thể làm đỏ `T-6` nếu dữ liệu BTC điền sẵn Việc tiếp theo | đã giải | cờ `nextAction.overwriteOverdueManual`, xem 5.4 |
| `F37` | `§3` và `§4/nhóm 2` dùng hai bộ nhãn cho cùng sáu loại tin | đã giải | `D1`, bảng 0.1.4 |
| `F38` | Danh sách cho phép của `E7-S2` có thể chặn oan lệnh gọi mô hình | đã giải | `D25`, xem 5.4 |
| `F39` | Log Claude Code vừa là bài làm chấm vòng 1, vừa là đề thi rút câu hỏi vòng 2 | đã giải | `D40`, xem 5.7 |
| `F40` | BTC phát **thêm một tính năng chưa biết** trong ngày thi; không tài liệu nào lường trước | đã giải | `D41`, xem 5.8 |

---

# Mức 1 — Diễn giải lại yêu cầu thô

Phần này chỉ nói lại đề bài, chấp nhận nguyên bản, không thêm đánh giá.

**Sản phẩm cần dựng.** Một CRM B2B cho đội sales HBLAB, gồm hai nửa phải liền thành một sản
phẩm: một CRM dùng tay được trọn vẹn, và một lớp AI đọc nguồn công khai rồi chủ động đẩy thông
tin vào đúng chỗ trong CRM đó (`§1`). Đề bài chỉ quy định *cần gì* và *hệ thống cư xử ra sao*;
kiến trúc, công cụ, bố cục màn hình do đội quyết.

**Hai nỗi đau nguồn gốc** (`§1`): hồ sơ công ty luôn cũ nên sales biết tin muộn; và việc gõ lại
thông tin máy đọc được từ nguồn công khai ăn hết thời gian.

**Sáu nhóm tính năng** (`§4`), xếp theo mức tự chủ tăng dần của AI:

| Nhóm | Nội dung | Mức tự chủ của AI |
|---|---|---|
| 1 · CRM làm tay | Công ty, người liên hệ, cơ hội, 7 giai đoạn kéo thả, hoạt động, dòng thời gian, Việc tiếp theo, tìm/lọc, màn hình tổng quan | Không có AI. Tắt AI thì nhóm 1 vẫn đủ chức năng |
| 2 · Đọc nguồn, rút phát hiện | Bản lưu giữ nguyên văn kèm thời điểm; phát hiện kèm câu trích, vị trí trích, loại tin, mức chắc chắn | AI sinh dữ liệu nhưng **không** chạm vào dữ liệu của Sales |
| 3 · Hàng đợi gợi ý | Gợi ý dạng "hiện tại → đề nghị" kèm bằng chứng và hệ quả nếu sai; ba nút Duyệt / Sửa rồi duyệt / Bỏ; ghi vết mọi quyết định | Chờ người bấm. Không duyệt thì không có gì xảy ra |
| 4 · Tự đặt Việc tiếp theo | Khi có phát hiện đáng chú ý ở công ty đang có cơ hội mở thì tự điền Việc tiếp theo + ngày hạn theo độ gấp của loại tin, có thông báo, có Hoàn tác một cú bấm trong 7 ngày | Tự làm ngay, không hỏi ai |
| 5 · Vòng quét Đang theo dõi | Vòng lặp khép kín đọc lại nguồn → so bản lưu → rút phát hiện → tự thêm mục vào dòng thời gian; chu kỳ cấu hình được, mặc định 60 giây; Nhật ký vòng quét mỗi vòng và tổng hợp mỗi 10 vòng | Tự chạy, không dừng chờ duyệt ở bất kỳ bước nào |
| 6 · Bảng điều khiển Quản trị | Các con số chất lượng AI, chỉnh chu kỳ vòng quét, nút tắt toàn bộ AI có hiệu lực ngay và giữ nguyên dữ liệu đã sinh | Vùng điều khiển và phanh |

**Bốn ranh giới cứng** (`§5`): không tự đổi giai đoạn; không tự đánh dấu Thắng/Thua và không tự
sửa giá trị tiền; không tự liên hệ khách; không tự xoá dữ liệu do người tạo. Ba ranh giới đầu
phải chặn được cả khi thao tác đến từ ngoài giao diện người dùng.

**Dữ liệu** (`§3`): BTC phát bộ mẫu sáng 15/08/2026 — 12–15 công ty đủ năm loại, khoảng 30 người
liên hệ, 8 cơ hội, và bản chụp trang web mỗi công ty hai phiên bản "trước"/"sau". Nguồn web
trong đề bài **chính là các bản chụp này**, không phải web thật; chuyển "trước" → "sau" là cách
kích hoạt mọi kịch bản AI và phải làm được từ giao diện hoặc bằng một lệnh.

**Nghiệm thu và nộp bài** (`§6`, `§7`): một bộ kiểm thử tự động chạy bằng một lệnh phủ 10 điểm
T-1…T-10; mã nguồn trên GitLab HBLAB; log Claude Code chảy về Grafana; sản phẩm chạy ở cấu hình
giả lập production on-premise (bản dựng production, cấu hình qua biến môi trường, dữ liệu bền
sau restart, đăng nhập thật hai tài khoản, khởi động một lệnh); nạp dữ liệu BTC bằng một lệnh và
lặp lại được về trạng thái ban đầu.

---

# Mức 2 — Điểm mơ hồ và câu hỏi làm rõ

Mỗi dòng gồm câu hỏi cho BTC **và** hướng đi để đội không bị chặn nếu chưa có câu trả lời.

Cột "Hướng đi của đội" ở đây là **bản rút gọn để đọc**. Bản có thẩm quyền cài đặt nằm ở
[Mục 0.3](#03-bảng-quyết-định-chốt-d1d39); ánh xạ từng câu tới quyết định tương ứng ở
[Mục 0.4](#04-trạng-thái-22-câu-hỏi-q1q22). Sửa một con số thì sửa ở Mục 0, không sửa ở bảng này.

| # | Chỗ mơ hồ | Câu hỏi cho BTC | Hướng đi của đội |
|---|---|---|---|
| Q1 | `§3` viết "Tin mới thuộc **bốn dạng**" rồi liệt kê sáu giá trị (gọi vốn, bổ nhiệm lãnh đạo công nghệ, mở rộng, tuyển dụng, mảng kinh doanh mới, khác); `§4/nhóm 2` cũng dùng sáu | Danh sách loại tin chuẩn là bốn hay sáu giá trị? | Sáu giá trị của `§4/nhóm 2` là enum chuẩn. Chữ "bốn dạng" ở `§3` là bốn tín hiệu kinh điển của playbook mà `§2` gọi tên đúng như vậy, không phải một enum thứ hai. Thêm trường `signal_subtype` cho giá trị `Khác` để nó không thành hố rác — lý do ở [2.1](#21-q1-chi-tiết--vì-sao-giá-trị-khác-cần-một-lớp-phân-loại-con), bảng chuẩn ở 0.1.4 và 0.1.5 |
| Q2 | `§4/nhóm 4` kích hoạt khi có "phát hiện **đáng chú ý**" | Đáng chú ý là gì — theo loại tin, theo mức chắc chắn, hay cả hai? Phát hiện mức **Đoán** có được tự đặt Việc tiếp theo không? | Cả hai, qua **hai trục**. Trục thứ nhất là `relevance` — thêm mới, suy ra từ loại tin: bốn loại `Gọi vốn / Nhân sự cấp cao / Mở rộng / Tuyển dụng` mặc định `high`, `Mảng kinh doanh mới` là `medium`, `Khác` thì theo `signal_subtype`. Trục thứ hai là mức chắc chắn. **Đáng chú ý = `relevance` `high` và mức Chắc hoặc Có thể** (`D4`). Mức **Đoán** không bao giờ tự đặt, chỉ đi vào hàng đợi nhóm 3 |
| Q3 | `§4/nhóm 4` nói tự điền cho "**cơ hội đó**" nhưng điều kiện là công ty "có **ít nhất một** cơ hội mở" | Công ty có nhiều cơ hội mở thì đặt cho cơ hội nào — tất cả, cơ hội giá trị lớn nhất, hay cơ hội ở giai đoạn xa nhất? | Đặt cho **mọi** cơ hội đang mở của công ty, mỗi cơ hội một bản ghi tự đặt và một nút Hoàn tác riêng |
| Q4 | `§2` định nghĩa mức **Đoán** là "không có bằng chứng trực tiếp", `§4/nhóm 2` lại cấm lưu phát hiện không có câu trích | Phát hiện mức Đoán trích cái gì? | Đoán vẫn phải trích đoạn văn mà nó suy ra từ đó; "không có bằng chứng trực tiếp" hiểu là câu trích không tự nói ra kết luận |
| Q5 | `§3` nói nguồn là bản chụp tĩnh, `§4/nhóm 2` đòi bản lưu kèm "**địa chỉ nguồn**" | Địa chỉ nguồn ghi gì — URL thật của công ty trong dữ liệu mẫu, hay đường dẫn tệp bản chụp? | Ghi cả hai: URL công bố của công ty (trường địa chỉ trang web) và định danh bản chụp đã dùng |
| Q6 | `§4/nhóm 2` và `T-3` đòi "**vị trí câu trích** trong bản lưu", có đánh dấu | Vị trí tính trên HTML thô hay trên văn bản đã tách thẻ? | Lưu bản lưu ở hai dạng (thô để đối chiếu, văn bản đã chuẩn hoá để neo) và tính offset trên bản chuẩn hoá; hiển thị đánh dấu trên bản chuẩn hoá |
| Q7 | `§4/nhóm 5` chu kỳ 60 giây, nhưng một vòng có gọi mô hình ngôn ngữ nên có thể chạy lâu hơn 60 giây | Vòng chạy quá chu kỳ thì chồng vòng, bỏ vòng, hay giãn chu kỳ? | Không chồng vòng: vòng mới chỉ chạy khi vòng trước kết thúc; vòng bị bỏ vẫn ghi một dòng nhật ký nói rõ lý do |
| Q8 | `§4/nhóm 3` cấm sinh lại gợi ý đã bỏ "**trừ khi có bản lưu mới**"; `§4/nhóm 5` đọc lại nguồn mỗi 60 giây | Đọc nguồn mà nội dung không đổi thì có tạo bản lưu mới không? | Chỉ tạo bản lưu khi nội dung khác bản gần nhất; chống trùng gợi ý theo dấu vân nội dung, không theo số hiệu bản lưu |
| Q9 | `T-4` đòi "hồ sơ công ty vẫn y nguyên" sau ba chu kỳ, trong khi `§4/nhóm 5` cho vòng quét tự thêm mục vào dòng thời gian | "Hồ sơ công ty" trong `T-4` có bao gồm dòng thời gian không? Công ty trong `T-4` có bật Đang theo dõi? | Hồ sơ công ty = các trường của công ty, **không** gồm dòng thời gian (đúng theo `§4/nhóm 2`). Kiểm thử chạy hai lần: một lần tắt và một lần bật Đang theo dõi |
| Q10 | `§4/nhóm 4` đòi ngày hạn "phản ánh độ gấp", `T-6` chỉ kiểm là nó có đổi | Có bảng ánh xạ loại tin → số ngày do BTC quy định không? | BTC không cho bảng, nên đội tự dựng một bảng và đặt nó ở màn hình Quản trị để sửa được. **Bảng số chuẩn ở [0.2.1](#021-ngày-hạn-việc-tiếp-theo-và-cửa-sổ-cơ-hội-d5-d6)**, các quy tắc kèm theo ở `D5`–`D9` và `D38`, lý giải từng con số ở [5.3](#q10--bảng-ánh-xạ-độ-gấp--đề-xuất-số-cụ-thể). Tóm lại: hạn là hàm của loại tin và mức chắc chắn, tính theo ngày làm việc, đo từ ngày sự kiện; tin quá cửa sổ thì không tự đặt gì; sàn là cuối ngày làm việc kế tiếp, trần 14 ngày. Kiểm thử bằng **tiêm đồng hồ** — đặt ngày sự kiện lùi lại rồi kiểm hạn tính đúng, kiểm cả nhánh tin quá cửa sổ |
| Q11 | `§4/nhóm 4` cho Hoàn tác trong 7 ngày, không nói cấu hình được | Cửa sổ 7 ngày có cấu hình được để giám khảo xem lúc hết hạn không? | Cửa sổ tính theo tham số cấu hình, mặc định 7 ngày, hiện rõ trên màn hình; kiểm thử tự động tiêm đồng hồ để kiểm mốc hết hạn |
| Q12 | `§4/nhóm 4` chỉ cấm đè lên Việc tiếp theo "do người nhập tay và **chưa tới hạn**" | Được đè lên giá trị người nhập đã quá hạn, và đè lên giá trị do chính hệ thống đặt trước đó? Hoàn tác nhiều lần thì về đâu? | Đội chọn **chặt hơn đề bài**: không đè ô do người nhập tay kể cả đã quá hạn (`D12`) — một câu quá hạn vẫn là thông tin, không phải chỗ trống — thay vào đó ghim một dòng đề xuất ngay dưới ô. Ô do chính hệ thống đặt trước đó thì được đè. Hoàn tác lùi **một bước**, bản ghi lưu đủ chuỗi giá trị (`D13`). Xem `F36` cho tình huống dữ liệu BTC điền sẵn ô này |
| Q13 | `§5` nói "Ba ranh giới đầu" phải chặn được ngoài giao diện, nhưng `T-10` lại kiểm cả xoá công ty — tức ranh giới thứ tư | Ranh giới thứ tư có phải chặn ngoài giao diện không? | Chặn cả bốn ở tầng nghiệp vụ, không phân biệt lối vào |
| Q14 | `§5.3` cấm tự liên hệ khách, nhưng sản phẩm không có tính năng gửi gì ra ngoài | Chứng minh ranh giới này bằng cách nào cho đủ? | Chứng minh bằng **vắng mặt**: không có thành phần gửi thư hay tin nhắn, và một kiểm thử chặn mọi lệnh gọi ra ngoài danh sách cho phép. Lưu ý `§5.3` tự nói rõ đây là ranh giới về việc **chạm tới người thật**, không phải lệnh cấm gọi mạng — nên danh sách cho phép phải mở cho lệnh gọi mô hình ngôn ngữ, xem `F38` |
| Q15 | `§7.5` đòi nạp dữ liệu BTC bằng một lệnh, `§3` nói dữ liệu phát sáng 15/08 | Định dạng và lược đồ bộ dữ liệu (tên tệp, tên cột, kiểu, ngôn ngữ nội dung) có được công bố trước không? | Viết bộ nạp theo lược đồ nội bộ của đội, tách riêng một lớp ánh xạ mỏng để sáng 15/08 chỉ sửa lớp đó |
| Q16 | `§1` nói ba thị trường JP, Global, KR | Bản chụp có nội dung tiếng Nhật, tiếng Hàn không? | Chuẩn bị cho nội dung đa ngữ: câu trích giữ nguyên ngôn ngữ gốc, câu nhận định viết tiếng Việt |
| Q17 | `§7.5` yêu cầu chạy lệnh nạp lần nữa là "về đúng trạng thái ban đầu" | Lệnh đó có xoá luôn bản ghi vết, số đo của Quản trị và các quyết định duyệt/bỏ không? | Có: đưa hệ thống về đúng trạng thái phát bài, kể cả ghi vết. Có cờ để giữ ghi vết khi cần đối chiếu |
| Q18 | `§2` nói dữ liệu mẫu chỉ có một tài khoản Sales, `§7.3` đòi đăng nhập thật hai tài khoản Sales và Quản trị | Quản trị có phải là một tài khoản riêng và Sales bị chặn vào màn hình Quản trị ở tầng nào? | Hai tài khoản, hai vai; chặn ở tầng nghiệp vụ, không chỉ ẩn menu |
| Q19 | `§4/nhóm 1` nhắc "danh sách việc phải làm" và "bảng thống kê lý do thua" nhưng `§4` không định nghĩa hai thứ này ở đâu | Hai màn hình đó có bắt buộc không? | Có: danh sách việc phải làm là danh sách Việc tiếp theo đến hạn/quá hạn ở màn hình tổng quan; thống kê lý do thua là một khối trong màn hình tổng quan |
| Q20 | `§4/nhóm 1` liệt kê xoá cho công ty và người liên hệ, nhưng cơ hội chỉ "tạo và quản lý" | Cơ hội có xoá được không? Xoá công ty thì cơ hội, người liên hệ, bản lưu, phát hiện, gợi ý đang chờ đi đâu? | Cơ hội xoá được; xoá công ty là xoá mềm và kéo theo toàn bộ dữ liệu phụ thuộc, gợi ý đang chờ bị đóng kèm lý do |
| Q21 | `§4/nhóm 6` yêu cầu các tỉ lệ duyệt/sửa/bỏ nhưng không nói mẫu số và khoảng thời gian | Số đo tính từ đầu hay theo cửa sổ thời gian? | Hiện cả hai: luỹ kế từ đầu và cửa sổ 24 giờ gần nhất |
| Q22 | Thể lệ nói vòng 1 "không có log bằng không có điểm" và "các đội làm trước thời điểm thu thập được log đều không được tính điểm", trong khi cũng thể lệ cho phép phát triển từ 12/8 | Phần việc làm trước 15/8 có được tính không, và mốc bắt đầu thu log là lúc nào? | Coi như chỉ log trong ngày thi được tính: mọi việc quan trọng có sinh log phải diễn ra lại trong ngày thi (viết kiểm thử, refactor, sinh tài liệu) |

## 2.1. Q1 chi tiết — vì sao giá trị "Khác" cần một lớp phân loại con

> Ghi rõ nguồn: bảng tín hiệu theo loại công ty dưới đây lấy từ **handbook đào tạo BD** ở
> `docs/CRM clone từ Airtable/`, tức nguồn của Mục 5 chứ không phải văn bản BTC phát. Nó đặt ở đây
> để câu trả lời cho `Q1` liền mạch; kết luận đã chốt thành enum ở [0.1.5](#015-signal_subtype--đội-thêm-13-giá-trị-chỉ-áp-khi-signal_type--other-d2).

Enum chuẩn là sáu giá trị của `§4/nhóm 2` (`D1`). Vấn đề nằm ở giá trị thứ sáu: nếu `Khác` không có
lớp phân loại con thì mọi tín hiệu không khớp năm giá trị có tên đều rơi vào đó.

Handbook liệt kê **25 tín hiệu mua hàng, nhóm theo năm loại công ty**:

| Loại công ty | Tín hiệu handbook nêu |
|---|---|
| Traditional | DX plan · consulting partnership · new CIO/CDO · vendor shortlisting · legacy modernization · RFP |
| IT Solution | new large client · delivery backlog · project pipeline · hiring BA/PM/SA/dev · new market expansion |
| IT Product | funding · roadmap delay · beta launch · feature release · product integration · engineering hiring |
| Tech-based | fundraising · MVP/POC · remote-friendly team · new product launch · venture portfolio listing |
| ITO khác | new client partnership · urgent hiring · rare stack request · office expansion · large team request |

Đối chiếu 25 tín hiệu này với năm giá trị **có tên** của đề bài (`Gọi vốn`, `Nhân sự cấp cao`,
`Mở rộng`, `Tuyển dụng`, `Mảng kinh doanh mới`) thì hơn một nửa không ánh xạ được — tất cả sẽ dồn
vào `Khác`. Vậy `Khác` cụ thể là những gì, xếp theo giá trị nghiệp vụ giảm dần:

| # | Tín hiệu | Vì sao xếp ở vị trí này |
|---|---|---|
| 1 | RFP / tender / vendor shortlisting | Tín hiệu mạnh nhất cho nhóm Traditional, và nó có **lịch**: handbook dặn khoảng tháng 9–11 hằng năm gửi email xin vào vendor shortlist. Một công bố RFP là bằng chứng mua hàng trực tiếp nhất có thể có, và không lọt vào bất kỳ giá trị có tên nào |
| 2 | Hợp tác / MOU với đối tác tư vấn | Ký MOU với một công ty tư vấn DX nghĩa là "chuẩn bị bước triển khai tiếp theo" |
| 3 | Quy định pháp lý / deadline tuân thủ | Ví dụ trong handbook: HL7 cho EHR/HIS, dashboard ESG cho logistics. Tạo khối lượng kỹ thuật có mốc cứng, nên độ gấp cao |
| 4 | M&A / IPO / delisting | Handbook có cả một chuỗi ca thật: delisting → quỹ mua → CTO mới → M&A. Gần `Gọi vốn` về tài chính nhưng khác hẳn về nghiệp vụ — sau sáp nhập luôn có dự án hợp nhất hệ thống |
| 5 | Chậm roadmap | Tín hiệu duy nhất suy ra từ **sự vắng mặt**: việc đáng lẽ xong tháng trước mà bản lưu mới vẫn chưa nhắc. Không có tin nào công bố việc này, nên đây đúng là loại tín hiệu máy so hai bản lưu làm tốt hơn người |
| 6 | Khởi động chuyển đổi số | Tuyên bố DX mà không lập đơn vị mới, nên khác `Mảng kinh doanh mới` |
| 7 | Đạt chứng nhận | ISO 27001, SOC 2, chứng nhận bảo mật quốc gia — tạo khối lượng kỹ thuật có deadline cứng |
| 8 | Mất khách lớn / tái cấu trúc / cắt giảm | Tín hiệu **âm**, đảo nghĩa so với phần còn lại — xem `F25` |
| 9 | Hiện đại hoá hệ thống cũ | Handbook cảnh báo tâm lý "đang ổn thì đừng đụng vào", nên dự án chỉ xảy ra khi có người khởi xướng và người bảo vệ. Tín hiệu này phải đi kèm một cái tên người mới có giá trị |
| 10 | Sự kiện / hiệp hội | EuroCham, KoCham, hội nghị ngành. Yếu nhưng rẻ |
| 11 | Đội remote-friendly | Handbook nêu cho nhóm Tech-based: thấy tin tuyển remote là một tín hiệu |
| 12 | Tín hiệu AIX | Playbook nêu ở phần đọc thêm: tuyển vai trò AI/dữ liệu · ra mắt tính năng có AI · chuyển ngân sách từ thuê người sang nền tảng |

**Kết luận.** Giữ enum sáu giá trị đúng đề bài, thêm một trường `signal_subtype` chỉ áp dụng khi
`signal_type = other`, từ vựng có kiểm soát 13 giá trị lấy từ danh sách trên cộng một giá trị
`unclassified` để mô hình không phải bịa (`D2`, bảng ở 0.1.5).

Lý do nghiệp vụ: `Khác` không có phân loại con sẽ thành hố rác, và câu nhận định sinh ra sẽ chung
chung — trong khi `§4/nhóm 2` đòi câu nhận định phải cho thấy tín hiệu đã được đọc dưới góc loại
công ty nào. Không phân biệt được RFP với MOU với M&A thì không viết được câu nhận định có nghĩa.

---

# Mức 3 — Phân rã epic / story kèm tiêu chí nghiệm thu

Bảy epic: sáu nhóm tính năng của đề bài, cộng một epic vận hành cho `§6`–`§7`.

**Quy ước đọc.** Mỗi story có một định danh `En-Sm`, một câu story, các tiêu chí nghiệm thu, và một
ánh xạ tới bộ nghiệm thu của đề bài. Ánh xạ ghi là `→ T-n`, hoặc `→ không có T` khi yêu cầu
**không có kiểm thử nào của đề bài phủ tới** — danh sách đầy đủ những chỗ như vậy ở
[Lỗ hổng phủ kiểm thử](#lỗ-hổng-phủ-kiểm-thử). Epic E1 trình bày dạng bảng vì các story của nó ngắn
và cùng ánh xạ về `T-1`; sáu epic còn lại trình bày dạng danh sách vì tiêu chí nghiệm thu dài hơn và
ánh xạ `T` khác nhau theo từng tiêu chí.

Chỗ nào tiêu chí nghiệm thu dựa trên một quyết định của đội thì có mã `Dn` ngay tại chỗ. Con số cụ
thể luôn tra ở Mục 0, không lặp lại ở đây.

## E1 — CRM làm tay (`§4/nhóm 1`)

| ID | Story | Tiêu chí nghiệm thu | T |
|---|---|---|---|
| E1-S1 | Là Sales, tôi tạo/sửa/xoá/xem chi tiết công ty để quản lý danh sách khách | Tên, ngành, loại công ty là bắt buộc; các ô khác bỏ trống được và lưu được · loại công ty chỉ nhận đúng năm giá trị `§2` (0.1.1) · xoá công ty là xoá mềm và kéo theo dữ liệu phụ thuộc (`D26`) | T-1 |
| E1-S2 | Là Sales, tôi quản lý người liên hệ dưới công ty và chỉ định một đầu mối chính | Người liên hệ thuộc đúng một công ty · mỗi công ty có **nhiều nhất một** đầu mối chính; đặt người mới thì người cũ tự mất nhãn · xoá đầu mối chính thì công ty còn 0 đầu mối, không lỗi | T-1 |
| E1-S3 | Là Sales, tôi tạo cơ hội với giá trị và tháng dự kiến chốt | Cơ hội thuộc đúng một công ty, một công ty nhiều cơ hội · giá trị tiền không âm, một đơn vị tiền duy nhất ghi rõ trên giao diện (`D34`) · giai đoạn khởi tạo là Tiếp cận — **giả định của đội**, `§4/nhóm 1` không nói · cơ hội xoá được (`D26`) | T-1 |
| E1-S4 | Là Sales, tôi kéo thả cơ hội giữa bảy giai đoạn | Bảy giai đoạn đúng thứ tự và đúng tên `§4/nhóm 1` · đi lùi và nhảy cóc đều được, hệ thống không chặn · đổi giai đoạn không cần mở biểu mẫu · mỗi lần đổi sinh một mục trên dòng thời gian | T-1 |
| E1-S5 | Là Sales, khi kéo cơ hội sang Đủ điều kiện tôi được hỏi ngay dấu hiệu nhu cầu và dấu hiệu ngân sách | Màn hình hỏi hai ô, mỗi ô một câu kèm chỗ ghi nguồn · bỏ qua được, cơ hội vẫn sang Đủ điều kiện · thiếu một trong hai ô thì cơ hội mang cờ cảnh báo nhìn thấy được cho tới khi bổ sung · thao tác kéo không bị chặn | T-1 |
| E1-S6 | Là Sales, tôi ghi hoạt động gắn vào công ty | Hoạt động có ngày, loại, mô tả, người liên hệ liên quan · người liên hệ chọn được chỉ trong phạm vi công ty đó | T-1 |
| E1-S7 | Là Sales, tôi xem một dòng thời gian duy nhất của công ty | Hoạt động, đổi giai đoạn và ghi chú hiện chung, mới nhất trên cùng · mục do hệ thống thêm mang nhãn riêng (E5-S3) | T-1 |
| E1-S8 | Là Sales, mỗi cơ hội có Việc tiếp theo và ngày hạn | Thiếu một trong hai ô vẫn lưu được · cơ hội đang mở mà thiếu thì mang cờ cảnh báo và **không** xuất hiện trong danh sách việc phải làm · điền đủ thì cờ mất và cơ hội vào lại danh sách · **ngoại lệ:** cơ hội ở giai đoạn Tạm dừng không mang cờ cảnh báo cho tới khi quay lại một giai đoạn đang chạy (`D11`) | T-1 |
| E1-S9 | Là Sales, khi chuyển cơ hội sang Thua tôi được hỏi lý do | Bỏ qua được, cơ hội vẫn sang Thua · thiếu lý do thì mang cờ cảnh báo và đứng ngoài bảng thống kê lý do thua · thao tác không bị chặn · lý do chọn từ enum dạng mảng cộng một ô ghi chú tự do, không phải một câu tự do (`D27`) | T-1 |
| E1-S10 | Là Sales, tôi tìm và lọc để tìm lại thứ đã nhập | Tìm công ty theo tên · lọc công ty theo ngành, loại, quốc gia, nhãn Đang theo dõi · lọc cơ hội theo giai đoạn và theo tình trạng quá hạn Việc tiếp theo · các bộ lọc kết hợp được | T-1 |
| E1-S11 | Là Sales, tôi mở màn hình tổng quan để biết hôm nay làm gì | Số công ty theo ngành · số cơ hội và tổng giá trị theo từng giai đoạn, gọi đúng tên "tổng giá trị ước tính (chưa nhân xác suất)" (`D34`) · danh sách Việc tiếp theo quá hạn — đây chính là "danh sách việc phải làm" mà `§4/nhóm 1` nhắc tới · khối thống kê lý do thua (`Q19`, `D27`) | T-1 |
| E1-S12 | Là Sales, tôi dùng trọn nhóm 1 khi phần AI bị tắt | Tắt AI ở E6-S3 thì toàn bộ E1-S1…S11 chạy đủ, không thiếu chức năng, không lỗi màn hình | T-1 |

## E2 — Đọc nguồn và rút phát hiện (`§4/nhóm 2`)

**E2-S1 · Bản lưu.** Là hệ thống, tôi đọc nội dung nguồn của một công ty và lưu thành bản lưu để
mọi nhận định sau này truy được về nguyên văn.
- Bản lưu giữ **nguyên văn**, kèm địa chỉ nguồn (Q5) và thời điểm đọc.
- Mỗi bản lưu thuộc **đúng một công ty**; một công ty nhiều bản lưu, xếp theo thời điểm đọc.
- Đọc lại không ghi đè bản cũ. Nội dung không đổi thì không tạo bản lưu mới (Q8).
- Nguồn không đọc được thì lưu một bản ghi "không đọc được" kèm lý do; hệ thống **không đoán**.

**E2-S2 · Phát hiện có bằng chứng.** Là Sales, tôi bấm được vào mọi nhận định của máy để thấy
chính xác câu chữ ở nguồn.
- Mỗi phát hiện gồm: câu nhận định ngắn, loại tin (enum sáu giá trị, 0.1.4), `signal_subtype` khi
  loại tin là `Khác` (`D2`, 0.1.5), `relevance` (`D3`, 0.1.6), **câu trích nguyên văn**, **vị trí
  câu trích trong bản lưu** (`D21`), mức chắc chắn, và `eventDate` tách khỏi `detectedAt` (`D5`).
- Mọi trường enum bắt mô hình **chọn trong danh sách cho sẵn**, không nhận giá trị nhập tự do
  (`D22`).
- Phát hiện thuộc **đúng một công ty**, thừa kế từ bản lưu; **không** gắn thẳng vào cơ hội, người
  liên hệ hay hoạt động.
- **Không lưu được phát hiện thiếu câu trích** — chặn ở tầng nghiệp vụ, không chỉ ở giao diện.
  → `T-2`
- **Câu trích phải khớp nguyên văn** một đoạn trong bản lưu. Mô hình tự viết lại câu thì phát hiện
  đó bị loại và ghi nhật ký (`D22`). → *không có T* — `T-2` chỉ kiểm trường hợp thiếu hẳn câu trích
- Bấm vào phát hiện ở bất cứ đâu nó xuất hiện thì mở đúng đoạn văn gốc, có đánh dấu vị trí. → `T-3`

**E2-S3 · Vùng đọc riêng.** Là Sales, tôi thấy bản lưu và phát hiện ở một khu riêng trong màn
hình công ty.
- Khu này không phải hồ sơ công ty và không phải dòng thời gian.
- Sinh phát hiện **không** làm đổi bất cứ thứ gì trong hồ sơ công ty, dòng thời gian hay cơ hội.
- Ba mức chắc chắn phân biệt được **không cần đọc chữ**; dùng ký hiệu **và** màu, không dùng màu
  đơn độc (`D24`, lý do ở `F14`). → *không có T*

**E2-S4 · Đọc tín hiệu theo loại công ty.** Là Sales, tôi thấy máy đã hiểu tín hiệu dưới góc loại
công ty của tôi.
- Câu nhận định nêu rõ loại công ty đã dùng để diễn giải (ví dụ gọi vốn ở Tech-based/Startup là
  "sắp xây MVP", ở IT Product là "sắp tăng tốc roadmap").
- Cùng một câu trích, hai loại công ty khác nhau cho hai câu nhận định khác nhau. → *không có T*

## E3 — Hàng đợi gợi ý (`§4/nhóm 3`)

**E3-S1 · Sinh gợi ý vào hàng đợi.** Khi có phát hiện mới về một công ty, hệ thống sinh gợi ý vào
hàng đợi chờ duyệt của người sở hữu.
- Hai loại theo đề bài: thêm một tin mới vào dòng thời gian; điền hoặc sửa một ô còn trống hoặc đã
  cũ của hồ sơ. Loại thứ hai **tách làm hai mức** theo `D16`: điền ô đang trống là *xác nhận đơn*,
  ghi đè ô đã có giá trị là *xác nhận kỹ*.
- Công ty **Đang theo dõi** thì loại "thêm tin mới" **không** sinh gợi ý, vì nhóm 5 đã tự thêm.
  Công ty không theo dõi thì ngược lại: nhóm 3 sinh gợi ý, nhóm 5 không chạm (`D17`, lý do ở `F1`).
- Gợi ý đã bị bỏ không sinh lại với cùng nội dung; so trùng theo **dấu vân nội dung**, không theo số
  hiệu bản lưu (`D18`). → *không có T*
- Hàng đợi **có thứ tự**, không xếp hàng ngang nhau (`D31`). → *không có T*

**E3-S2 · Đủ bằng chứng tại chỗ.** Mỗi gợi ý hiện đủ bốn thứ, không phải bấm sang màn hình khác:
nội dung "hiện tại → đề nghị", câu trích, mức chắc chắn, và một dòng nói rõ **hệ quả nếu sai**.

**E3-S3 · Ba nút quyết.** Duyệt · Sửa rồi duyệt · Bỏ.
- Bỏ là **một** thao tác kèm chọn lý do trong danh sách ngắn: thông tin sai, đúng nhưng không liên
  quan, đã cũ, hiểu sai ngữ cảnh, khác.
- Số thao tác để Bỏ **không nhiều hơn** số thao tác để Duyệt.
- **Sửa rồi duyệt** ghi là *sửa*, không cộng vào *duyệt*. → `T-5`
- Không duyệt thì **không có gì xảy ra**: hồ sơ giữ nguyên vô thời hạn, không tự hết hạn thành
  hành động, không có chế độ tự duyệt. → `T-4`

**E3-S4 · Ghi vết quyết định.** Mỗi gợi ý và mỗi lần quyết lưu: nội dung gợi ý, giá trị cũ, ai
quyết, lúc nào, quyết gì, lý do nếu bỏ, và **số giây** từ lúc mở gợi ý tới lúc bấm. → `T-5`

**E3-S5 · Nhắc có việc chờ.** Màn hình danh sách cơ hội và màn hình công ty hiện dấu hiệu "đang
có gợi ý chờ duyệt". → *không có T*

**E3-S6 · Hoàn tác sau khi duyệt.** Duyệt và Sửa-rồi-duyệt đều lưu ảnh chụp giá trị cũ, nên có nút
Hoàn tác cùng kiểu và cùng cửa sổ với nhóm 4 (`D14`, `D15`; lý do ở `F9`). Điều này **không** phá
lời hứa của `§4/nhóm 3`: gợi ý vẫn không tự hết hạn thành hành động; gợi ý dựa trên bản lưu đã cũ
chỉ mang thêm một nhãn, không tự xoá. → *không có T*

## E4 — Tự đặt Việc tiếp theo (`§4/nhóm 4`)

**E4-S1 · Tự điền.** Khi có phát hiện **đáng chú ý** về một công ty đang có cơ hội mở, hệ thống tự
điền Việc tiếp theo và ngày hạn ngay, không hỏi ai.

- "Đáng chú ý" có đúng một định nghĩa: `relevance = high` **và** mức chắc chắn `Chắc`/`Có thể`
  (`D4`). Mức `Đoán` không bao giờ kích hoạt story này.
- Áp cho **mọi** cơ hội đang mở của công ty, mỗi cơ hội một bản ghi tự đặt riêng (`D10`).
- Nội dung nhắc tới sự kiện kích hoạt và **kèm chính câu trích**. Nhiều tin cùng lúc thì nhắc mọi
  tin, và lấy hạn ngắn nhất (`D8`).
- Ngày hạn theo bảng 0.2.1, không phải một con số cố định (`D5`), tôn trọng sàn và trần (`D7`) và
  tính theo ngày làm việc của thị trường công ty khách (`D9`). Tin quá cửa sổ cơ hội thì **không tự
  đặt gì** (`D6`). → `T-6`
- **Không ghi đè** ô Việc tiếp theo do người nhập tay, kể cả khi đã quá hạn — chặt hơn `§4/nhóm 4`,
  vốn chỉ cấm đè giá trị chưa tới hạn (`D12`, lý do ở `F8`). Thay vào đó ghim một dòng đề xuất ngay
  dưới ô. Ô đang trống hoặc ô do chính hệ thống đặt trước đó thì được đè. → `T-6`
- **Không** tự đặt cho cơ hội ở giai đoạn Tạm dừng, dù `§4/nhóm 1` xếp nó là *đang mở* (`D11`, lý do
  ở `F7`).

**E4-S2 · Phân biệt và báo.** Ô do hệ thống đặt mang dấu hiệu khác ô người gõ; người sở hữu nhận
thông báo trong sản phẩm nói rõ đặt gì, cho cơ hội nào, vì sao; thông báo không tự biến mất trước
khi được xem và còn sau khi khởi động lại. → `T-6`

**E4-S3 · Hoàn tác một cú bấm.** Nút Hoàn tác đưa Việc tiếp theo và ngày hạn về đúng giá trị
trước đó, kể cả khi giá trị trước đó là trống (cờ cảnh báo E1-S8 quay lại). Hoàn tác lùi **một
bước**, và nút hiện rõ đang lùi về giá trị nào (`D13`). Cửa sổ là tham số, mặc định 7 ngày đúng
`§4/nhóm 4`, dùng cùng một giá trị với nhóm 3 (`D14`); cửa sổ hiện rõ trên màn hình; hết cửa sổ thì
nút biến mất và ô sửa tay như thường. Mốc hết cửa sổ kiểm được bằng **tiêm đồng hồ** (`Q11`). → `T-7`

**E4-S4 · Ghi vết hai chiều.** Mọi lần tự đặt lưu: cơ hội, giá trị cũ, giá trị mới, phát hiện kích
hoạt, thời điểm. Mọi lần hoàn tác lưu: ai bấm, lúc nào, về giá trị gì. Số lần và **tỉ lệ hoàn
tác** xem được ở màn hình Quản trị. → `T-7`

## E5 — Vòng quét Đang theo dõi (`§4/nhóm 5`)

**E5-S1 · Nhãn và danh sách.** Bật/tắt nhãn Đang theo dõi bằng một thao tác; có màn hình danh
sách riêng cho nhóm công ty này. → `T-8`

**E5-S2 · Vòng lặp khép kín.** Đọc lại nguồn → so với bản lưu gần nhất → có nội dung mới thì rút
phát hiện → tự thêm mục vào dòng thời gian kèm nhãn "do hệ thống thêm" và câu trích → quay lại
đầu vòng.
- Vòng **không dừng chờ ai duyệt** ở bất kỳ bước nào; tự quyết ghi hay không dựa trên việc nội
  dung có mới hay không.
- Chu kỳ cấu hình được; đổi có hiệu lực ngay. Hai chế độ trên cùng một tham số: vận hành mặc định
  24 giờ, demo 60 giây đúng `§4/nhóm 5` (`D20`). Cấu hình chấm điểm dùng chế độ demo.
- Chỉ tạo bản lưu mới khi nội dung **khác** bản gần nhất (`D18`).
- Vòng chạy lâu hơn chu kỳ thì **không chồng vòng**; vòng bị bỏ vẫn ghi một dòng nhật ký kèm lý do;
  khoá theo công ty (`D19`). → `T-8`

**E5-S3 · Mục do hệ thống thêm.** Mục mang nhãn phân biệt và câu trích; Sales xoá được như mọi
mục khác. Mỗi lần Sales xoá một mục do hệ thống thêm thì hệ thống hỏi một lý do ngắn và **xoá mềm**
để bản ghi vẫn còn làm dữ liệu đo — đây là nguồn của `error-detection rate` mà đề bài chưa đòi
(`D30`, lý do ở `F12`). → `T-8`

**E5-S4 · Nhật ký vòng quét.** Mỗi vòng ghi một dòng: chạy lúc nào, quét bao nhiêu công ty, phát
hiện bao nhiêu nội dung mới, thêm bao nhiêu mục, mất bao lâu, lỗi gì. Mỗi 10 vòng ghi thêm một
dòng tổng hợp cộng dồn. → `T-8`

## E6 — Bảng điều khiển Quản trị (`§4/nhóm 6`)

**E6-S1 · Màn hình số đo.** Gom đủ: số phát hiện và phân bố ba mức chắc chắn; số gợi ý cùng tỉ lệ
duyệt, sửa-rồi-duyệt, bỏ, phân bố lý do bỏ; thời gian quyết trung bình; số lần tự đặt và tỉ lệ bị
hoàn tác.

- Mỗi số hiện **cả luỹ kế và cửa sổ 24 giờ**, kèm ngưỡng ở 0.2.2 (`D29`).
- Tỉ lệ duyệt và thời gian quyết trung bình đặt **cạnh nhau**, có khối cảnh báo duyệt mù với ngôn từ
  rà soát chứ không cáo buộc (`D29`, lý do ở `F11`).
- Thêm **`error-detection rate`** đặt cạnh `auto-accept rate` (`D30`, lý do ở `F12`).
- Tỉ lệ phát hiện mang `signal_subtype = unclassified` có ngưỡng cảnh báo (0.1.5).
- Sales **không** vào được màn hình này, chặn ở tầng nghiệp vụ chứ không chỉ ẩn menu (`D28`).
  → *không có T*

**E6-S2 · Chỉnh tham số.** Chu kỳ vòng quét chỉnh được từ đây đúng `§4/nhóm 6`, và cùng chỗ đó chỉnh
được toàn bộ bảng ngày hạn 0.2.1 và các tham số 0.2.2 (`D38`). Mỗi tham số hiện đơn vị, giá trị mặc
định và một câu giải thích đổi nó thì cái gì đổi theo; có hiệu lực ngay, không cần triển khai lại.
→ *không có T*

**E6-S3 · Phanh.** Một nút tắt toàn bộ phần AI, hiệu lực ngay, không cần chạy lại sản phẩm.
- Khi tắt: vòng quét dừng, không sinh phát hiện, không sinh gợi ý, không tự đặt Việc tiếp theo.
- Dữ liệu đã sinh **không bị xoá**.
- Sales thấy một dòng thông báo nói rõ tính năng gợi ý đang tắt — không im lặng biến mất.
- Mỗi lần tắt/bật đều ghi vết kèm thời điểm; bật lại thì vòng quét chạy tiếp. → `T-9`

## E7 — Ranh giới, nghiệm thu và vận hành (`§5`–`§7`)

**E7-S1 · Ranh giới ở tầng nghiệp vụ.** `§5` đánh số **bốn ranh giới**, nhưng ranh giới thứ hai gộp
hai lệnh cấm, nên có **năm lệnh cấm** phải cài đặt. Cả năm chặn ở tầng nghiệp vụ, không phân biệt
lối vào (`D25`). Lời dặn dò trong prompt **không** tính là đã chặn.

| `§5` | Lệnh cấm | Cách enforce |
|---|---|---|
| 5.1 | không tự đổi giai đoạn cơ hội | service đổi giai đoạn từ chối khi `actor = system` |
| 5.2a | không tự đánh dấu Thắng/Thua | cùng service trên, cùng điều kiện từ chối |
| 5.2b | không tự sửa giá trị tiền của cơ hội | phần AI **không có** hàm ghi trường tiền |
| 5.3 | không tự liên hệ khách | không có thành phần gửi thư hay tin nhắn — chứng minh bằng vắng mặt |
| 5.4 | không tự xoá dữ liệu do người tạo | phần AI không có hàm xoá; xoá là xoá mềm và chỉ người gọi được |

`§5` chỉ đòi ba ranh giới đầu chặn được ngoài giao diện, nhưng `T-10` kiểm cả 5.4 — đội chặn cả bốn
để không đỏ `T-10` (`F6`). Kèm một lint rule cấm import thẳng tầng dữ liệu trong thư mục AI, và bốn
kiểm thử gọi thẳng tầng nghiệp vụ với danh nghĩa hệ thống. → `T-10`

**E7-S2 · Chặn gọi ra ngoài đúng phạm vi.** Mọi lệnh gọi mạng ra ngoài phải nằm trong danh sách cho
phép, ngoài danh sách thì bị từ chối và ghi vết (`Q14`).

- Danh sách cho phép **phải mở cho lệnh gọi mô hình ngôn ngữ**: `§3` nói gọi dịch vụ ngoài là thoải
  mái, và `§5.3` tự nói rõ đây là ranh giới về việc chạm tới người thật, không phải lệnh cấm gọi
  mạng. Chặn quá tay ở đây là tự làm hỏng nhóm 2 (`F38`).
- Cái bị chặn là **kênh chạm tới người thật**: thư, tin nhắn, webhook gửi ra ngoài. → *không có T*

**E7-S3 · Chuyển phiên bản nguồn.** Chuyển một công ty từ bản chụp "trước" sang "sau" làm được từ
giao diện **và** bằng một lệnh; lặp lại được nhiều lần. → `T-6`, `T-8`

**E7-S4 · Bộ nghiệm thu một lệnh.** Bộ kiểm thử tự động phủ `T-1`…`T-10`, chạy bằng một lệnh, in kết
quả rõ ràng, không phụ thuộc thứ tự chạy và không phụ thuộc dữ liệu còn lại từ lần chạy trước. Viết
dạng `Feature`/`Scenario`, mỗi `T` là một `Feature` nhiều `Scenario`, cộng scenario cho 14 lỗ hổng
phủ kiểm thử (`D36`). → `§6`, `§7.4`

**E7-S5 · Cấu hình giả lập production.** Bản dựng production (không dev server, không hot reload,
không chế độ gỡ lỗi); cấu hình qua biến môi trường gồm khoá dịch vụ ngoài, chuỗi kết nối cơ sở dữ
liệu, chu kỳ vòng quét; dữ liệu bền sau khi khởi động lại tiến trình; khởi động một lệnh; log ra
chỗ xem được.

**E7-S6 · Đăng nhập thật.** Hai tài khoản Sales và Quản trị, giám khảo tự vào được (`§7.3`). Phân
quyền chặn ở tầng nghiệp vụ (`D28`).

**E7-S7 · Nạp dữ liệu một lệnh.** Nạp bộ dữ liệu BTC bằng một lệnh, không gõ tay, không sửa mã;
chạy lại thì về đúng trạng thái ban đầu kể cả ghi vết, có cờ giữ ghi vết khi cần đối chiếu, và in
một báo cáo đối soát số bản ghi (`D32`, từ `Q17`). Một lớp ánh xạ mỏng để đổi lược đồ nguồn mà không
sửa phần còn lại (`Q15`, rủi ro ở `F20`). → `§7.5`

**E7-S8 · Log Claude Code về Grafana.** Log chảy về Grafana của công ty, mở được bảng theo dõi
trước buổi demo. Đây là **điều kiện tiên quyết của vòng 1** theo thể lệ, không phải hạng mục phụ.

## Bổ sung tri thức nghiệp vụ mà đề bài không nói ra

Đề bài cố ý chỉ mô tả hành vi. Ba tệp còn lại trong thư mục này cấp phần tri thức mà người viết
mã cần để không hiểu sai:

| Điều cần biết | Nguồn | Tại sao ảnh hưởng tới mã |
|---|---|---|
| Bốn đối tượng nguyên thủy Observation → Claim → Proposal, với Provenance làm sợi dây truy vết | Phương pháp luận, phần 4 | Từ vựng đề bài là lớp vỏ tiếng Việt của đúng bốn đối tượng này: **bản lưu** = observation, **phát hiện** = claim, **câu trích + vị trí** = provenance, **gợi ý** = proposal. Hiểu vậy thì các ràng buộc "không lưu phát hiện thiếu câu trích", "phát hiện không chạm hồ sơ" không còn là quy định rời rạc mà là một mô hình |
| Ranh giới claim: ghi chép 1-1 không phải claim; hễ **biến đổi** thông tin gốc là claim | Phương pháp luận, phần 4 | Quyết định thứ gì phải mang mức chắc chắn và câu trích. Bản summarize cũng là phát hiện |
| Trần tự chủ theo vùng: vùng tự do (observation) · vùng chạy ngầm (claim/proposal) · vùng cấm tuyệt đối | Phương pháp luận, phần 5 | Giải thích vì sao nhóm 2 được tự do, nhóm 3 phải chờ, nhóm 4 được tự làm nhưng có phanh — và vì sao ranh giới phải nằm trong mã, không nằm trong prompt |
| Quyền ≠ trách nhiệm: người duyệt phải **đủ năng lực** duyệt, hệ thống phải cấp đủ bằng chứng và thời gian | Phương pháp luận, phần 5 | Là lý do `§4/nhóm 3` đòi bốn thứ hiện tại chỗ và đòi đo *số giây* quyết. Số giây quá thấp là dấu hiệu duyệt mù, không phải thành tích |
| Hai số đo cùng cặp: **auto-accept rate** đo hệ thống khôn lên, **error-detection rate** đo người khôn lên | Phương pháp luận, phần 3 | Đề bài chỉ đòi nửa đầu. Nửa sau phải tự thêm — xem F12 |
| Tháp độ tin cậy của nguồn | Phương pháp luận, phần 7 | Gợi ý cách đặt mức chắc chắn khi một phát hiện đến từ nguồn yếu |
| Selection > Volume — chọn đúng khách quan trọng hơn chốt deal | Playbook, mục 4 | Lý do vì sao hàng đợi gợi ý **cần thứ tự ưu tiên**, dù đề bài không đòi — xem F13 |
| Qualify hai chiều: khách *cần* (requirement) và khách *chi được* (budget), cả hai phải là **fact kiểm chứng được** | Playbook, mục 4 | Là nội dung thật của hai ô ở E1-S5; chỗ ghi nguồn không phải trang trí |
| Bốn loại tín hiệu kinh điển và câu hỏi "Why now?"; tín hiệu tốt đến muộn là tín hiệu vô giá trị | Playbook, mục 5 | Là căn cứ cho bảng ánh xạ độ gấp ở Q10 |
| PIC là người sở hữu nỗi đau, không nhất thiết chức danh cao nhất | Playbook, mục 3 · đề bài `§4/nhóm 1` | Đầu mối chính không phải "người cấp cao nhất"; đừng tự động chọn theo chức danh |
| Một dòng dữ liệu **sai** tệ hơn một dòng **trống** | Playbook, mục cuối | Xếp thứ tự ưu tiên khi cân giữa "gợi ý nhiều" và "gợi ý đúng": thà để trống |

## Lỗ hổng phủ kiểm thử

Yêu cầu có trong `§4` nhưng không điểm nào trong T-1…T-10 kiểm tới:

- Đọc tín hiệu theo loại công ty (`§4/nhóm 2`) — phần AI có giá trị nghiệp vụ cao nhất của nhóm 2.
- Ba mức chắc chắn phân biệt được không cần đọc chữ (`§4/nhóm 2`).
- Đọc lại nguồn không xoá phát hiện cũ (`§4/nhóm 2`).
- Nguồn không đọc được thì ghi lại, không đoán (`§4/nhóm 2`).
- Gợi ý hiện đủ bốn thứ tại chỗ, gồm dòng "hệ quả nếu sai" (`§4/nhóm 3`).
- Bỏ không tốn nhiều thao tác hơn Duyệt (`§4/nhóm 3`).
- Gợi ý đã bỏ không sinh lại (`§4/nhóm 3`).
- Dấu hiệu "đang có gợi ý chờ duyệt" trên hai màn hình (`§4/nhóm 3`).
- Ngày hạn phản ánh **độ gấp** theo loại tin (`§4/nhóm 4`) — `T-6` chỉ kiểm là có đổi.
- Không đè lên Việc tiếp theo người nhập chưa tới hạn (`§4/nhóm 4`).
- Hết cửa sổ 7 ngày thì nút Hoàn tác biến mất (`§4/nhóm 4`).
- Dòng tổng hợp cộng dồn mỗi 10 vòng (`§4/nhóm 5`).
- Toàn bộ nhóm 6 trừ nút tắt: số đo, chỉnh chu kỳ, phân quyền Sales/Quản trị (`§4/nhóm 6`).
- Ranh giới `§5.3` không tự liên hệ khách.

Đúng **14 điểm**. Đội tự viết thêm kiểm thử cho cả 14, dạng `Scenario` gắn vào `Feature` tương ứng
(`D36`). Vòng 3 do Sales chấm theo tính năng, nên phần không có kiểm thử vẫn bị nhìn thấy — và đây
là chỗ dễ bị cắt khi hết giờ nhất, nên nó nằm trong danh sách rủi ro (`F22`).

---

# Mức 4 — Phản biện theo persona, edge case và rủi ro

## Bốn persona và điều họ sẽ nói

**Mai · sales rep thị trường JP, người dùng hằng ngày.** "Tôi bật Đang theo dõi cho tám công ty
quan trọng. Sáng ra dòng thời gian của mỗi công ty có thêm mấy mục do máy ghi, hàng đợi lại có
thêm mấy gợi ý về cùng những tin đó. Vậy tôi phải đọc hai lần một tin? Và các anh nói 'không
duyệt thì không có gì xảy ra' — nhưng máy đã ghi vào dòng thời gian của tôi rồi." → F1, F2

"Hàng đợi của tôi không có thứ tự. Mười lăm gợi ý xếp hàng như nhau, trong đó có cái 'công ty
gọi vốn Series B' và cái 'công ty đổi số điện thoại tổng đài'. Tôi cần cái gấp nằm trên, không
cần cái nào cũng có bằng chứng đẹp." → F13

"Một cơ hội tôi đang **Tạm dừng** vì khách xin hoãn ngân sách sang quý sau. Máy vẫn đặt cho nó
Việc tiếp theo hạn 1 ngày vì công ty vừa có tin. Tôi phải hoàn tác từng cái." → F7

"Tôi ghi tay Việc tiếp theo 'gọi lại sau Obon' hạn tuần trước, chưa kịp làm. Máy thấy quá hạn nên
ghi đè. Câu tôi viết mất luôn, tôi chỉ còn nút hoàn tác trong 7 ngày và không biết mình đã mất
gì." → F8

**Hùng · quản lý, vai Quản trị.** "Tôi thấy tỉ lệ duyệt 82%. Nhưng thời gian quyết trung bình là
4 giây. Rep của tôi đang duyệt mù, và con số 82% đó đang nói dối tôi rằng máy chạy tốt." → F11

"Tôi có tỉ lệ hoàn tác, nhưng không có số nào cho biết rep **phát hiện ra máy sai** — họ xoá mục
máy ghi trên dòng thời gian mà chỗ đó không ghi lại gì." → F12

"Rep duyệt một gợi ý sửa ô 'quy mô' từ 200 thành 2000 người. Sai. Không có nút hoàn tác ở hàng
đợi, tôi phải đi tra ghi vết rồi gõ lại tay. Nhóm 4 thì có hoàn tác một cú bấm — vì sao nhóm 3
không có?" → F9

**Quân · giám khảo kỹ thuật, vòng 2.** "Bộ kiểm thử 10 điểm do chính đội viết, và tôi chạy nó. Đội
nào viết `T-10` chặt thì tự làm khó mình, đội nào viết lỏng vẫn xanh hết. Tôi sẽ hỏi các anh câu
này ở phần vấn đáp: `T-4` của các anh có bật Đang theo dõi không?" → F3, F4

"`T-8` yêu cầu 'hai mục mới xuất hiện' sau khi đổi nguồn hai công ty. Nếu một bản chụp 'sau' có
hai tin — gọi vốn và tuyển dụng — thì hệ thống đúng phải ghi bốn mục, và kiểm thử của các anh sẽ
đỏ vì làm đúng." → F5

"Cửa sổ hoàn tác 7 ngày: tôi không có cách nào thấy nó hết hạn trong một buổi demo. Các anh chứng
minh thế nào?" → Q11

**Linh · sales chấm vòng 3, end user.** "Tôi không quan tâm kiến trúc. Tôi mở lên, thấy một công
ty tôi biết rõ, và muốn tin những gì màn hình nói. Nếu có một dòng máy ghi sai mà tôi phải tự đi
sửa, tôi sẽ tin cả sản phẩm ít hơn một mức." (Playbook: một dòng dữ liệu sai tệ hơn một dòng
trống.) → F13, F14

## Mâu thuẫn nội tại và lỗ hổng của đề bài

Bảng dưới chỉ **nêu vấn đề**, cố ý không nêu cách sửa — cách sửa nằm ở mục 5.3 và đã chốt thành
quyết định ở Mục 0.3. Muốn biết một `F` đã được giải hay còn mở thì tra
[Mục 0.5](#05-trạng-thái-38-mâu-thuẫn-f1f38); ở đó mỗi `F` có đúng một trạng thái, kể cả những `F`
mà mục 5.3 không nhắc tới.

| # | Vấn đề | Vị trí | Hệ quả nếu làm y nguyên |
|---|---|---|---|
| F1 | Với công ty **Đang theo dõi**, cùng một phát hiện kích hoạt hai đường ghi: nhóm 3 sinh gợi ý "thêm tin mới vào dòng thời gian" chờ duyệt, nhóm 5 **tự thêm** mục đó. Đề bài không nói đường nào nhường đường nào | `§4/nhóm 3` · `§4/nhóm 5` | Dòng thời gian có mục do máy ghi, hàng đợi có gợi ý ghi lại đúng mục đó. Duyệt gợi ý thì trùng hai mục |
| F2 | Lời hứa "**không duyệt thì không có gì xảy ra**, hồ sơ giữ nguyên vô thời hạn" chỉ đúng với các ô của hồ sơ. Với công ty Đang theo dõi thì dòng thời gian vẫn bị ghi thêm mà không ai duyệt | `§4/nhóm 3` · `§4/nhóm 5` | Sales hiểu sai mức tự chủ thật của hệ thống. Đây là chỗ đề bài mâu thuẫn với chính nguyên tắc "quyền ≠ trách nhiệm" của phương pháp luận |
| F3 | `T-4` không nói công ty thử nghiệm có bật Đang theo dõi hay không, và không định nghĩa "hồ sơ công ty" có gồm dòng thời gian | `T-4` | Kiểm thử **pass rỗng**: tắt Đang theo dõi thì vòng quét không chạm công ty đó, T-4 xanh dù nhóm 3 chưa làm gì |
| F4 | Bộ nghiệm thu do đội tự viết rồi giám khảo chạy chính bộ đó | `§6` | Chuẩn nghiệm thu khác nhau giữa các đội; đội viết kiểm thử chặt bị bất lợi. Cần BTC phát bộ kiểm thử chuẩn hoặc chấm cả **chất lượng** kiểm thử |
| F5 | `T-6` và `T-8` khẳng định số lượng kết quả ("Việc tiếp theo tự đổi", "hai mục mới") nhưng `§3` cho phép một bản chụp "sau" chứa nhiều tin, và một công ty có nhiều cơ hội mở | `T-6` · `T-8` · `§3` | Hệ thống làm đúng vẫn có thể làm kiểm thử đỏ. Kiểm thử phải khẳng định *quan hệ* (mỗi tin mới sinh đúng một mục), không khẳng định con số tuyệt đối |
| F6 | `§5` nói "**ba** ranh giới đầu" phải chặn được ngoài giao diện, nhưng `T-10` kiểm cả xoá công ty — tức ranh giới thứ tư | `§5` · `T-10` | Đề bài tự bất nhất. Đội làm đúng chữ `§5` sẽ đỏ `T-10` |
| F7 | **Tạm dừng** được xếp là *đang mở*, nên cơ hội tạm dừng vừa bị đòi Việc tiếp theo (cờ cảnh báo) vừa là đích của nhóm 4 tự đặt | `§4/nhóm 1` · `§4/nhóm 4` | Máy giục một thương vụ mà con người đã cố ý dừng — sai nghiệp vụ, và tạo nhiễu đúng chỗ Sales tin tưởng nhất |
| F8 | Nhóm 4 chỉ cấm đè lên Việc tiếp theo do người nhập **và chưa tới hạn** — nghĩa là được đè lên câu người viết đã quá hạn | `§4/nhóm 4` | Ghi đè dữ liệu con người tạo, trong khi `§5.4` cấm tự xoá dữ liệu do người tạo. Hai điều này va nhau về tinh thần; ít nhất phải giữ giá trị cũ hiện được ngay trên ô, không chỉ nằm trong log |
| F9 | Nhóm 4 có Hoàn tác một cú bấm; nhóm 3 **không có** đường lùi nào sau khi Duyệt, dù Duyệt ghi trực tiếp vào hồ sơ công ty | `§4/nhóm 3` · `§4/nhóm 4` | Chỗ hậu quả nặng hơn (sửa hồ sơ mang đi họp) lại được bảo vệ ít hơn chỗ hậu quả nhẹ hơn |
| F10 | "Phát hiện **đáng chú ý**" không có định nghĩa; mức chắc chắn **Đoán** không bị loại khỏi nhóm 4 | `§4/nhóm 4` | Một phỏng đoán không bằng chứng trực tiếp có thể tự ghi vào cơ hội thật. Vi phạm tinh thần grounding của phương pháp luận |
| F11 | Nhóm 6 đo tỉ lệ duyệt và **thời gian quyết trung bình** nhưng không đặt ngưỡng, không cảnh báo | `§4/nhóm 6` | Tỉ lệ duyệt cao + thời gian quyết vài giây là dấu hiệu duyệt mù, đúng cái bẫy AI-centric mà phương pháp luận cảnh báo. Nên hiện cặp số cạnh nhau và cảnh báo khi thời gian quyết thấp bất thường |
| F12 | Đề bài chỉ đòi số đo phía hệ thống (auto-accept, tỉ lệ hoàn tác), thiếu **error-detection rate** — tỉ lệ người tìm ra lỗi của máy | `§4/nhóm 6` · phương pháp luận phần 3 | Không đo được người có khôn lên hay không; mất đúng nửa số đo mà tài liệu phương pháp luận coi là bắt buộc. Nguồn dữ liệu có sẵn: lý do bỏ "thông tin sai", và việc Sales xoá mục do hệ thống thêm — nhưng `§4/nhóm 5` không đòi ghi vết lần xoá đó |
| F13 | Không có **thứ tự ưu tiên** cho phát hiện và gợi ý; đề bài chủ động bỏ ICP scoring | `§2` · `§4/nhóm 3` | Trái nguyên tắc Selection > Volume và câu hỏi "Why now?" của playbook. Vòng 3 do Sales chấm sẽ hỏi ngay câu này. Rẻ nhất: sắp hàng đợi theo độ gấp của loại tin × mức chắc chắn, không cần ICP |
| F14 | Mức chắc chắn được phép phân biệt bằng "ký hiệu **hoặc** màu" | `§4/nhóm 2` | Nếu chọn màu đơn độc thì người mù màu không phân biệt được — vẫn "phải đọc chữ". Dùng ký hiệu kèm màu |
| F15 | `§3` viết "bốn dạng" rồi liệt kê sáu giá trị | `§3` | Enum loại tin không xác định; ảnh hưởng bảng ánh xạ độ gấp và bộ lọc |
| F16 | "Bảng thống kê lý do thua" và "danh sách việc phải làm" được nhắc như thứ đã có, nhưng `§4` không định nghĩa màn hình nào chứa chúng | `§4/nhóm 1` | Hai tính năng ẩn. Đội không đọc kỹ sẽ thiếu, và cờ cảnh báo ở `§4/nhóm 1` mất chỗ để có nghĩa |
| F17 | Nhóm 1 có xoá công ty và người liên hệ, không nói xoá cơ hội; và không nói xoá công ty thì cơ hội, bản lưu, phát hiện, gợi ý đang chờ đi đâu | `§4/nhóm 1` | Dữ liệu mồ côi, gợi ý chờ duyệt trỏ vào công ty không còn tồn tại |
| F18 | Chu kỳ 60 giây gặp độ trễ của mô hình ngôn ngữ; đề bài không nói gì về chồng vòng, huỷ vòng, hay lỗi giữa vòng | `§4/nhóm 5` | Vòng chồng vòng sinh phát hiện trùng và làm `T-8` bất định. Nhật ký cần dòng cho vòng bị bỏ |
| F19 | "Gợi ý đã bỏ không sinh lại với **cùng nội dung**, trừ khi có bản lưu mới" — mà mỗi lần đọc lại đều có thể tạo bản lưu mới | `§4/nhóm 3` · `§4/nhóm 5` | Gợi ý đã bỏ mọc lại mỗi 60 giây; demo chìm trong rác. Phải chống trùng theo dấu vân nội dung, và chỉ tạo bản lưu khi nội dung đổi |
| F20 | Lược đồ bộ dữ liệu BTC không được công bố trước, nhưng `§7.5` đòi nạp bằng một lệnh, không sửa mã | `§3` · `§7` | Sáng 15/08 phải viết bộ nạp cho một lược đồ chưa biết. Rủi ro cao nhất về mặt thời gian trong toàn bộ đề bài |
| F21 | `§1` nêu ba thị trường JP, Global, KR nhưng không nói ngôn ngữ nội dung bản chụp | `§1` · `§3` | Nếu bản chụp có tiếng Nhật/Hàn, việc trích câu và neo vị trí khó hơn nhiều; câu nhận định phải chọn ngôn ngữ |
| F22 | Toàn bộ nhóm 6 (trừ nút tắt) và ranh giới `§5.3` không có kiểm thử; phần AI có giá trị nghiệp vụ cao nhất — đọc tín hiệu theo loại công ty — cũng không | `§6` | Chỗ dễ bị cắt khi hết giờ lại là chỗ vòng 3 nhìn thấy đầu tiên |
| F23 | Đề bài đặt trọng tâm vào sản phẩm, còn barem chấm theo **giai đoạn dùng AI** (Requirement 20 · Design 20 · Dev 25 · Testing 20 · Deployment 15) và vòng 1 chấm tự động qua log Claude Code | `§6`–`§7` · barem · thể lệ | Sản phẩm hoàn hảo nhưng không có log thì trượt vòng 1; ngược lại, log đẹp mà thiếu tính năng thì chỉ chết ở vòng 3. Phải làm cả hai, và log là điều kiện tiên quyết |
| F24 | Thể lệ cho phát triển từ 12/8 nhưng cũng viết "các đội làm trước thời điểm thu thập được log đều không được tính điểm" | thể lệ | Không rõ công sức trước ngày thi có được tính. Phải hỏi BTC; nếu không có câu trả lời thì lên kế hoạch để mọi việc sinh log quan trọng diễn ra trong ngày thi |

## Edge case cần xử lý dù đề bài không nhắc

| Tình huống | Đề bài nói gì | Xử lý đề nghị |
|---|---|---|
| Hoàn tác khi giá trị trước đó là **trống** | Chỉ nói "về đúng giá trị trước đó" | Về trống, và cờ cảnh báo thiếu Việc tiếp theo quay lại |
| Hệ thống tự đặt **hai lần liên tiếp** trên cùng cơ hội | Không nói | Hoàn tác lùi một bước; log giữ đủ chuỗi; nút hiện rõ đang lùi về giá trị nào |
| Tắt AI **giữa** một vòng quét | `T-9` chỉ kiểm hai chu kỳ sau đó | Vòng đang chạy dừng ở ranh giới an toàn, không ghi nửa vời; nhật ký ghi một dòng "bị dừng do tắt AI" |
| Bật AI lại sau một khoảng tắt | "Vòng quét chạy tiếp" | Không đọc bù quá khứ: coi bản chụp hiện tại là mốc so sánh, ghi rõ trong nhật ký để giám khảo không chờ mục cũ |
| Xoá công ty đang có gợi ý chờ duyệt | Không nói | Đóng các gợi ý đó kèm lý do "công ty đã xoá"; không để mồ côi |
| Xoá cơ hội đang có Việc tiếp theo do hệ thống đặt trong cửa sổ hoàn tác | Không nói | Bản ghi tự đặt vẫn giữ; nút hoàn tác biến mất cùng cơ hội |
| Đổi đầu mối chính khi công ty đã có một người | "Đúng một người" | Người cũ tự mất nhãn, ghi một mục dòng thời gian |
| Nguồn trả về nội dung rỗng hoặc lỗi mạng | "Ghi lại là không đọc được" | Bản ghi lỗi kèm lý do và mã lỗi; không tạo bản lưu rỗng; không rút phát hiện |
| Mô hình ngôn ngữ lỗi, hết hạn mức, hoặc trả về JSON sai định dạng | Đề bài chỉ nói về nguồn không đọc được | Coi như một lỗi vòng quét: ghi nhật ký, thử lại có giới hạn, không sinh phát hiện nửa vời. Đây là lỗi khác lỗi nguồn, nên tách hai loại |
| Câu trích do mô hình trả về **không tìm thấy** trong bản lưu (mô hình tự viết lại câu) | "Không lưu được phát hiện không có câu trích" | Đối chiếu bắt buộc: câu trích phải khớp nguyên văn trong bản lưu, không khớp thì loại bỏ phát hiện đó và ghi nhật ký |
| Cùng một tin xuất hiện lại ở bản chụp sau | "Có nội dung mới thì rút phát hiện" | So theo dấu vân nội dung của từng tin, không so cả trang |
| Hai vòng quét cùng ghi vào một công ty | Không nói | Khoá theo công ty; một công ty chỉ được một vòng xử lý tại một thời điểm |
| Người đang mở gợi ý thì gợi ý bị vòng quét làm cũ | Không nói | Không rút gợi ý khỏi tay người đang xem; khi bấm mà dữ liệu đã đổi thì báo rõ và hiện bản mới |
| Múi giờ của ngày hạn với ba thị trường JP/Global/KR | Không nói | Lưu mốc thời gian theo UTC, hiện theo múi giờ người dùng; ngày hạn tính theo ngày làm việc của thị trường công ty |
| Giá trị tiền của cơ hội ở nhiều đơn vị tiền tệ | Không nói | Một đơn vị duy nhất trong phạm vi hackathon, ghi rõ trên giao diện |
| Chạy bộ kiểm thử hai lần liên tiếp | `§6` chỉ nói chạy một lệnh | Kiểm thử tự dựng và tự dọn dữ liệu, không phụ thuộc lần chạy trước |

## Rủi ro cần theo dõi

| Rủi ro | Dấu hiệu sớm | Cách chặn |
|---|---|---|
| Lược đồ dữ liệu BTC lệch với thứ đội chuẩn bị (F20) | Không có, tới sáng 15/08 mới biết | Tách lớp ánh xạ nguồn; tự sinh một bộ dữ liệu đúng mô tả `§3` để phát triển; giữ 60 phút trong ngày thi cho việc nối dữ liệu |
| Không dựng được log Claude Code → Grafana (F23) | Bảng theo dõi trống ở buổi tổng duyệt | Làm việc này **trước tiên**, không để cuối; kiểm tra bằng một lần chạy thật và xem log lên bảng |
| Vòng quét 60 giây làm cạn hạn mức mô hình ngôn ngữ trong lúc demo | Nhật ký vòng quét có lỗi hạn mức | Đặt trần số lệnh gọi mỗi vòng; nhớ đệm theo dấu vân nội dung; có chế độ chạy không cần mô hình cho phần trích xuất đơn giản |
| Gợi ý mọc lại mỗi vòng (F19) làm demo mất kiểm soát | Hàng đợi tăng đều mỗi phút | Chống trùng theo dấu vân; chỉ tạo bản lưu khi nội dung đổi |
| Chỉ hoàn thành nửa CRM làm tay vì dồn sức cho phần AI | `T-1` chưa xanh sau ngày thứ hai | `T-1` là điều kiện tiên quyết: nhóm 1 phải xanh trước khi mở việc nhóm 4 và 5 |
| Ranh giới `§5` chỉ được viết trong prompt thay vì trong mã (`§5` cấm đúng điều này) | Không có kiểm thử nào gọi thẳng tầng nghiệp vụ | Chặn ở tầng nghiệp vụ, và viết kiểm thử gọi vòng qua giao diện |
| Bộ kiểm thử tự viết quá lỏng, bị vấn đáp vòng 2 bóc (F4) | `T-4`, `T-10` chỉ vài dòng | Viết kiểm thử đúng theo tinh thần, và chuẩn bị trả lời "chỗ này chúng tôi chọn kiểm chặt hơn đề bài vì…" |
| Duyệt mù làm số đo đẹp giả (F11) | Thời gian quyết trung bình dưới ngưỡng vài giây | Hiện cặp tỉ lệ duyệt + thời gian quyết cạnh nhau, có cảnh báo |
| Log phồng lên vì thứ không ai trong đội đọc (F39) | Có phần mã hoặc tài liệu mà không ai nói được trong một câu vì sao nó như vậy | `D40`: đọc trước khi giữ. Thà ít dấu vết mà bảo vệ được, vì vòng 2 bốc ngẫu nhiên |

---

# Mục 5 — Đối chiếu với CRM thật của HBLAB (bổ sung)

Bốn mục trước là "Mức 1…4" vì chúng bám bốn mức của barem. Mục này **không** là mức thứ năm của
barem — nó là một vòng làm việc thêm, nên gọi là *mục*. Nó có ba việc: tự trả lời các câu hỏi ở Mức
2 bằng nguồn thật (5.2), sửa các mâu thuẫn ở Mức 4 (5.3), và tìm những gì chỉ thấy được khi đối
chiếu (5.4).

## 5.1. Nguồn mới, và vì sao nó nặng hơn suy luận

Hai tệp ở `docs/CRM clone từ Airtable/`:

- **`Tomahawk_CRM_PRD_BuildReady_v3.2.md`** — bản đặc tả dựng lại chính CRM mà sales HBLAB đang
  chạy trên Airtable: schema, business rule có công thức, đặc tả tầng AI, phân quyền, acceptance
  criteria dạng Gherkin, và cả **những lỗi của hệ thống cũ kèm cách sửa**.
- **`HBLAB_Sales_Knowledge_Base_v1.0.md`** — handbook đào tạo BD: 5 chương, playbook 11 stage
  (Stage 0 → 10), 7 cây quyết định, có ngưỡng điểm và KPI cho từng stage.

Giá trị của hai tệp này với việc phản biện đề bài: chúng cho **con số thật và quyết định đã trả
giá**. Vài mốc để định cỡ lại đề bài:

| Thông số | Hệ thống thật | Đề bài |
|---|---|---|
| Account | ~1.200, tăng ~50/tháng | 12–15 công ty |
| Contact | ~1.300 | ~30 |
| Cơ hội đang mở | ~200 | 8 (mọi giai đoạn) |
| Hoạt động | ~50.000/năm — bảng lớn nhất hệ thống | không nêu |
| Người dùng đồng thời | 8–15 | 1 tài khoản Sales + 1 Quản trị |
| Vai trò | 7 (`bd`, `am`, `presales`, `manager`, `sales_admin`, `bod`, `admin`) | 2 (Sales, Quản trị) |
| Nhịp quét tin tức | cron **thứ Hai 06:00**, chỉ account `isWatching` | **60 giây**, ghi rõ là để chấm demo |
| Loại tín hiệu | 11 giá trị enum | 6 giá trị (mục `§3` còn viết nhầm là "bốn dạng") |

Đọc bảng này thì thấy đề bài không phải bản thu nhỏ trung thực của hệ thống thật — nó là **một
lát cắt được chọn để chấm được trong một ngày**. Điều đó hợp lý, nhưng nghĩa là mọi chỗ đề bài đơn
giản hoá đều là chỗ vòng 3 (Sales chấm với tư cách end user) sẽ chạm vào.

## 5.2. Tự trả lời 22 câu hỏi ở mức 2

Cột cuối nói rõ câu nào đã tự trả lời được và câu nào vẫn phải hỏi BTC.

| # | Câu trả lời tìm được từ hệ thống thật | Còn phải hỏi BTC? |
|---|---|---|
| Q1 | Enum thật có **11 loại**: `funding · hiring_surge · leadership_change · m_and_a · product_launch · market_expansion · layoff · tech_migration · partnership · financial_result · other` (Tomahawk 8.6.2). Sáu giá trị của đề bài là tập con. Dùng sáu của `§4/nhóm 2`, coi "bốn dạng" ở `§3` là lỗi soạn thảo | Không — tự chốt được |
| Q2 | Hệ thống thật dùng **hai trục**: `relevance` ∈ high/medium/low, với định nghĩa vận hành "high = có khả năng tạo nhu cầu nhân lực/dự án IT **trong 3 tháng tới**"; và `confidence` ≥ 0.8 → điền tự động, < 0.8 → chỉ gợi ý. "Đáng chú ý" = `relevance = high` **và** mức chắc chắn Chắc/Có thể | Không |
| Q3 | Hệ thống thật đặt `nextActionDate`/`nextActionNote` **trên từng opportunity**, và notification gửi cho `owner`. Vậy: đặt cho **mọi** cơ hội đang mở, mỗi cơ hội một bản ghi và một nút hoàn tác | Không |
| Q4 | Handbook có nguyên tắc "**No evidence = no hypothesis**" và bắt tách bạch fact vs hypothesis từng dòng (Stage 3). Vậy Đoán = hypothesis: vẫn phải trích đoạn đã suy ra từ đó, và phải gắn nhãn hypothesis | Không |
| Q5 | Tín hiệu thật bắt buộc có `sourceUrl`, "không có nguồn thì không báo cáo"; enrichment trả về mảng `sources[]` là URL đã đọc. Vậy ghi cả URL công bố và định danh bản chụp | Không |
| Q6 | Hệ thống thật không neo offset — nó lưu `summary` + `sourceUrl` và để người bấm ra nguồn. Đề bài đòi chặt hơn thật, nên đây là chỗ đề bài **nâng chuẩn**: phải tự chọn mô hình neo (lưu bản chuẩn hoá, offset trên bản đó) | Nên hỏi, nhưng không chặn |
| Q7 | Hệ thống thật chạy job theo queue có cấu hình riêng, và nhịp thật là **hàng tuần**, không phải 60 giây. Vậy: không chồng vòng, và mặc định sản phẩm nên là nhịp thật (ngày/tuần) với 60 giây là chế độ demo | Không |
| Q8 | Hệ thống thật chống trùng bằng **`sourceUrl` + cosine similarity của tiêu đề ≥ 0.9 trong 30 ngày**, cộng cache theo hash prompt (TTL 24h). Áp đúng cách này | Không |
| Q9 | Hệ thống thật tách rõ: `account_signal` (tin đọc được) khác `activity` (dòng thời gian) khác các field của account. "Hồ sơ công ty" = các field. Dòng thời gian là bảng khác | Không |
| Q10 | Hệ thống thật không có bảng ánh xạ ngày hạn, nhưng có đủ mốc để dựng: `DEADLINE_NEAR` **< 7 ngày**, "khách nguội" **> 30 ngày**, cửa sổ chống trùng tín hiệu **30 ngày**, relevance high = nhu cầu trong **3 tháng**. Bảng đầy đủ kèm lý do từng dòng ở mục 5.3, phần Q10 | Nên hỏi, nhưng đã tự dựng được |
| Q11 | Hệ thống thật cho **undo 24 giờ** sau khi proposal được xác nhận (lưu `undoSnapshot`), và proposal `pending` **hết hạn sau 30 phút**. Đề bài cho 7 ngày — dài hơn thật. Cửa sổ nên cấu hình được để chứng minh mốc hết hạn | Không |
| Q12 | Hệ thống thật: "**field người dùng đã nhập tay → không ghi đè, chỉ gợi ý nếu khác**". Nghĩa là câu trả lời đúng nghiệp vụ là *không đè*, kể cả khi đã quá hạn — xem F8 bên dưới | Nên hỏi, vì đề bài cho phép đè |
| Q13 | Hệ thống thật chặn theo **tầng**: tool registry không có tool xoá, `MAX_AI_BULK_UPDATE = 20`, lint rule cấm import client thô trong `modules/ai/**`. Không phân biệt lối vào. Vậy chặn cả bốn ranh giới | Không |
| Q14 | Hệ thống thật không cho AI gửi gì ra ngoài; nó chứng minh bằng **cấu trúc**: AI chỉ có tool trong registry, mọi ghi qua proposal. Vậy chứng minh bằng vắng mặt + kiểm thử chặn gọi ra ngoài allowlist | Không |
| Q15 | Hệ thống thật có hẳn mục migration với **mapping field chi tiết** và bước "dọn taxonomy là việc của người, không phải máy". Vậy: tách lớp ánh xạ, và chuẩn bị tinh thần rằng dữ liệu BTC sẽ có giá trị rác cần chuẩn hoá | Vẫn phải hỏi lược đồ |
| Q16 | Hệ thống thật: UI tiếng Việt mặc định + English, múi giờ `Asia/Ho_Chi_Minh` + Hong Kong + Sydney. Vậy nội dung đa ngữ là chuyện thường; câu trích giữ nguyên ngôn ngữ gốc, nhận định tiếng Việt | Nên hỏi |
| Q17 | Hệ thống thật có "**đối soát sau migrate — bắt buộc**". Với đề bài: lệnh nạp đưa về đúng trạng thái phát bài, kèm một báo cáo đối soát số bản ghi để giám khảo tin | Không |
| Q18 | Hệ thống thật: AI **dùng chung tầng phân quyền với người dùng đang chat** (`scopedPrisma` tạo từ chính user, không phải service account), và ghi thẳng rằng "**view filter không phải là biên giới bảo mật**". Vậy chặn ở tầng nghiệp vụ, không ẩn menu | Không |
| Q19 | Hệ thống thật có 34 view seed, trong đó nhóm `data_quality` và `weekly_meeting`, cùng catalog báo cáo. "Danh sách việc phải làm" tương đương view `nextActionDate` quá hạn; thống kê lý do thua tương đương báo cáo `lossReasons` | Không |
| Q20 | Hệ thống thật dùng **soft delete** (`deletedAt`) trên mọi bảng nghiệp vụ, và `onDelete: Cascade` cho `account_signal`. Vậy xoá mềm, cascade dữ liệu phụ thuộc, đóng gợi ý đang chờ | Không |
| Q21 | Hệ thống thật đặt **ngưỡng chấp nhận** cho từng chỉ số AI (xem 5.3/F11) và đo theo kỳ. Vậy hiện luỹ kế + cửa sổ 24h, kèm ngưỡng | Không |
| Q22 | Không có trong hai tệp này — thuần chuyện thể lệ | **Phải hỏi BTC** |

Tổng lại: **hai câu chặn** — `Q15` (lược đồ dữ liệu) và `Q22` (mốc tính log) — cộng **bốn câu nên
hỏi nhưng không chặn**: `Q6` (mô hình neo vị trí câu trích), `Q10` (bảng ánh xạ độ gấp), `Q12` (được
đè giá trị người nhập đã quá hạn không), `Q16` (ngôn ngữ nội dung bản chụp). Bảng đầy đủ ở
[Mục 0.4](#04-trạng-thái-22-câu-hỏi-q1q22), và đó là chỗ duy nhất giữ con số đếm này.

## 5.3. Phản biện cũ >> gợi ý thay đổi

Các mục con dưới đây **nhóm theo chủ đề**, không theo số `F` tăng dần, vì nhiều mâu thuẫn cùng được
giải bằng một quyết định thiết kế — tách chúng ra thành từng mục riêng sẽ lặp lý lẽ ba lần. Bảng
dưới là mục lục theo số `F` để tra nhanh; trạng thái cuối cùng của từng `F` thì ở
[Mục 0.5](#05-trạng-thái-38-mâu-thuẫn-f1f38).

| Mã | Mục con giải nó | Quyết định chốt |
|---|---|---|
| `F1` | [Hai đường ghi trùng vào dòng thời gian](#f1--hai-đường-ghi-trùng-vào-dòng-thời-gian) | `D16`, `D17` |
| `F2` | [Lời hứa "không duyệt thì không có gì xảy ra"](#f2--lời-hứa-không-duyệt-thì-không-có-gì-xảy-ra) | `D16`, `D17` |
| `F3`, `F5`, `F22` | [Bộ nghiệm thu 10 điểm quá thô](#f5-f3-và-f22--bộ-nghiệm-thu-10-điểm-quá-thô) | `D36` |
| `F6`, `Q13` | [Chặn được kể cả ngoài giao diện](#f6-q13-và-e7-s1--chặn-được-kể-cả-ngoài-giao-diện) | `D25` |
| `F7` | [Cơ hội Tạm dừng vẫn bị giục](#f7--cơ-hội-tạm-dừng-vẫn-bị-giục) | `D11` |
| `F8`, `Q12` | [Ghi đè Việc tiếp theo người nhập tay đã quá hạn](#f8-và-q12--ghi-đè-việc-tiếp-theo-người-nhập-tay-đã-quá-hạn) | `D12` |
| `F9` | [Nhóm 3 duyệt xong không có đường lùi](#f9--nhóm-3-duyệt-xong-không-có-đường-lùi) | `D14`, `D15` |
| `F10`, `Q2` | ["Phát hiện đáng chú ý" không có định nghĩa](#f10-và-q2--phát-hiện-đáng-chú-ý-không-có-định-nghĩa) | `D3`, `D4` |
| `Q10` | [Bảng ánh xạ độ gấp](#q10--bảng-ánh-xạ-độ-gấp--đề-xuất-số-cụ-thể) | `D5`–`D9`, `D38` |
| `F11` | [Duyệt mù làm số đo đẹp giả](#f11--duyệt-mù-làm-số-đo-đẹp-giả) | `D29` |
| `F12` | [Thiếu error-detection rate](#f12--thiếu-error-detection-rate) | `D30` |
| `F13` | [Hàng đợi không có thứ tự ưu tiên](#f13--hàng-đợi-không-có-thứ-tự-ưu-tiên) | `D31` |
| `F16`, `F17` | [Tính năng ẩn, xoá không rõ cascade](#f16-f17-và-q19q20--tính-năng-ẩn-xoá-không-rõ-cascade) | `D26`, `D27` |
| `F18`, `Q7` | [Vòng quét 60 giây](#f18-q7-và-rủi-ro-hạn-mức--vòng-quét-60-giây) | `D19`, `D20` |
| `F14`, `F15`, `F19`, `F21` | không có mục con riêng — giải trực tiếp ở Mục 0 | `D24`, `D1`, `D18`, `D33` |
| `F4`, `F20`, `F24` | không giải được bằng thiết kế — xem cột giảm thiểu ở Mục 0.5 | — |
| — | [Cổng Đủ điều kiện chỉ có hai ô](#e1-s5--cổng-đủ-điều-kiện-chỉ-có-hai-ô) | `E1-S5` |
| — | [Câu nhận định theo loại công ty](#e2-s4--câu-nhận-định-phải-cho-thấy-đọc-dưới-góc-loại-công-ty-nào) | `D35` |

### F1 · Hai đường ghi trùng vào dòng thời gian

> Với công ty Đang theo dõi, cùng một phát hiện kích hoạt cả gợi ý chờ duyệt của nhóm 3 và mục tự
> thêm của nhóm 5. Không câu nào loại trừ nhau.

**>> Gợi ý thay đổi.** Hệ thống thật giải bài này bằng **phân cấp quyền ghi của AI theo bản chất
thao tác**, không theo tính năng (Tomahawk 8.7):

| Mức | Loại thao tác | Cơ chế |
|---|---|---|
| Tự do | ghi log hoạt động; ghi field chỉ-AI (`aiSummary`, `aiSignals`, `account_signal`) | ghi thẳng — *"chỉ THÊM thông tin, không ghi đè dữ liệu người nhập. Người dùng vẫn xoá/sửa được"* |
| Xác nhận đơn | sửa 1 bản ghi, ≤ 5 field, không nhạy cảm | preview + 1 click |
| Xác nhận kỹ | sửa field nhạy cảm (`estimatedValue`, `winRate`, `status` → won/lost…) | preview + gõ chữ xác nhận + **bắt buộc nhập lý do** |
| Cấm | xoá bản ghi · sửa > 20 bản ghi · đổi owner hàng loạt · sửa phân quyền | không có tool tương ứng, chặn ở tầng registry |

Áp vào đề bài, quy tắc một dòng: **thêm mới thì tự do, ghi đè thì phải duyệt.** Cụ thể:

- Thêm một mục vào dòng thời gian là *thêm* → nhóm 5 tự ghi là đúng, và **nhóm 3 không sinh gợi ý
  loại "thêm tin mới" cho công ty Đang theo dõi**. Với công ty không theo dõi thì ngược lại: nhóm
  3 sinh gợi ý, nhóm 5 không chạm.
- Điền một ô đang **trống** của hồ sơ cũng là *thêm* → có thể xếp mức "Xác nhận đơn" (một click),
  không cần bằng chứng dài dòng.
- **Sửa một ô đã có giá trị** là *ghi đè* → mức "Xác nhận kỹ": buộc hiện diff và buộc chọn lý do.
  Đề bài hiện gộp cả hai vào một loại gợi ý duy nhất.

### F2 · Lời hứa "không duyệt thì không có gì xảy ra"

> Với công ty Đang theo dõi thì dòng thời gian vẫn bị ghi thêm mà không ai duyệt, nên lời hứa ở
> `§4/nhóm 3` không đúng.

**>> Gợi ý thay đổi.** Viết lại lời hứa cho đúng phạm vi, theo cách hệ thống thật diễn đạt: *"AI
được thêm thông tin, không được thay đổi thông tin của bạn."* Trên giao diện, nói rõ ở hai chỗ:
nhãn "do hệ thống thêm" trên mục dòng thời gian, và một câu ở đầu hàng đợi: "những thay đổi vào hồ
sơ công ty luôn chờ bạn duyệt". Đây là chỗ rẻ nhất để lấy điểm vòng 2 khi giám khảo hỏi "AI của
các anh được tự làm gì".

### F8 và Q12 · Ghi đè Việc tiếp theo người nhập tay đã quá hạn

> `§4/nhóm 4` chỉ cấm đè lên giá trị người nhập **chưa** tới hạn, tức cho phép đè khi đã quá hạn.

**>> Gợi ý thay đổi.** Hệ thống thật có một câu dứt khoát hơn: *"Field người dùng đã nhập tay →
**không ghi đè**, chỉ gợi ý nếu khác"* (Tomahawk 8.6.1). Và đúng nghiệp vụ: một câu quá hạn như
"gọi lại sau Obon" là **thông tin**, không phải chỗ trống. Đề nghị làm chặt hơn đề bài và nói rõ
lý do khi trình bày:

- Ô do người nhập: hệ thống **không đè**, kể cả quá hạn. Thay vào đó ghim một dòng đề xuất ngay
  dưới ô ("có tin mới, đề nghị đổi hạn về ngày mai"), người bấm là xong.
- Ô đang trống hoặc ô do chính hệ thống đặt trước đó: được tự điền như `§4/nhóm 4` cho phép.
- Nếu vẫn muốn giữ nguyên hành vi của đề bài để khỏi lệch nghiệm thu: giữ ghi đè, nhưng **hiện giá
  trị cũ ngay trên ô** kèm tên người/hệ thống đã đặt — theo nguyên tắc của hệ thống thật:
  *"hiện avatar + tên người đánh dấu ngay cạnh cờ. Không giấu trong lịch sử — để ngay trên bảng.
  Minh bạch tại chỗ hiệu quả hơn nhiều so với phải mở audit log mới biết."*

### F9 · Nhóm 3 duyệt xong không có đường lùi

> Nhóm 4 có Hoàn tác một cú bấm, nhóm 3 ghi thẳng vào hồ sơ mà không có gì lùi lại.

**>> Gợi ý thay đổi.** Hệ thống thật cho **undo 24 giờ trên mọi proposal đã xác nhận** bằng cách
lưu `undoSnapshot` lúc ghi, và cho proposal `pending` **hết hạn sau 30 phút** (vòng đời:
`pending → confirmed | rejected | edited_confirmed`). Đề nghị:

- Duyệt hoặc Sửa-rồi-duyệt đều lưu ảnh chụp giá trị cũ; nút Hoàn tác cùng một kiểu nút với nhóm 4.
- **Dùng một cửa sổ duy nhất cho cả hai nhóm, mặc định 7 ngày** — không lấy con số 24 giờ của hệ
  thống thật. Lý do: `§4/nhóm 4` đã quy định 7 ngày và `T-7` kiểm nó, nên đặt nhóm 3 ở 24 giờ sẽ
  tạo hai cửa sổ khác nhau cho hai nút trông giống nhau, đúng thứ mà lập luận "người dùng chỉ phải
  học một lần" muốn tránh. Cửa sổ là tham số nên hạ về 24 giờ được nếu muốn (`D14`).
- Không cần bỏ điều "gợi ý không tự hết hạn thành hành động" của đề bài — hai thứ không xung đột:
  hệ thống thật cho proposal hết hạn thành **không làm gì**, đúng tinh thần `§4/nhóm 3`. Có thể
  thêm nhãn "gợi ý này dựa trên bản lưu đã cũ" cho gợi ý quá 24 giờ thay vì tự xoá.

### F10 và Q2 · "Phát hiện đáng chú ý" không có định nghĩa

> Không rõ loại tin nào, mức chắc chắn nào được phép kích hoạt việc tự đặt Việc tiếp theo.

**>> Gợi ý thay đổi.** Lấy nguyên hai trục của hệ thống thật và viết thành ngưỡng cấu hình được:

- **`relevance`**: `high` = "có khả năng tạo nhu cầu nhân lực/dự án IT trong 3 tháng tới" ·
  `medium` = liên quan gián tiếp · `low` = chỉ để biết. Chỉ `high` được tự đặt Việc tiếp theo;
  `medium` vào hàng đợi; `low` chỉ nằm ở vùng đọc.
- **Mức chắc chắn**: Chắc/Có thể mới được tự đặt; Đoán thì không bao giờ.
- Hai ngưỡng này hiện trên màn hình Quản trị, sửa được, có câu giải thích — giống cách hệ thống
  thật cho sửa ngưỡng gate trong bảng config "để đổi được không cần deploy".

### Q10 · Bảng ánh xạ độ gấp — đề xuất số cụ thể

> `§4/nhóm 4` đòi "ngày hạn phải phản ánh độ gấp của loại tín hiệu, không phải một con số cố
> định", nhưng không cho bảng ánh xạ; `T-6` chỉ kiểm là ngày hạn có đổi.

**>> Gợi ý thay đổi.** Trước hết phải tách **hai cái đồng hồ** mà đề bài đang gộp làm một:

1. **Cửa sổ cơ hội** — tín hiệu còn giá trị bán hàng trong bao lâu. Đây là thuộc tính của *loại
   tin*, do nghiệp vụ quyết định.
2. **Ngày hạn của Việc tiếp theo** — bao giờ Sales phải chạm. Nó phải **ngắn hơn cửa sổ nhiều**,
   vì playbook đã nói thẳng: *"khi tin gọi vốn đã lên mặt báo thì ba đối thủ đã gửi email trước
   rồi"* và *"một tín hiệu tốt đến muộn là một tín hiệu vô giá trị"*.

Mốc tham chiếu lấy được từ nguồn — bốn số đầu là của hệ thống thật, hai số cuối của playbook:

| Mốc | Giá trị | Nguồn |
|---|---|---|
| `relevance = high` nghĩa là "tạo nhu cầu nhân lực/dự án IT **trong 3 tháng tới**" | 90 ngày | Tomahawk 8.6.2 |
| `DEADLINE_NEAR` — cơ hội bị coi là sát hạn | **< 7 ngày** | Tomahawk 4.10 |
| "Khách nguội" — quan hệ bị coi là nguội | **> 30 ngày** không hoạt động | Tomahawk 8.3 |
| Cửa sổ chống trùng tín hiệu | **30 ngày** | Tomahawk 8.6.2 |
| Cửa sổ hành động của tin gọi vốn | "tính bằng **ngày**" | playbook, mục 5 |
| Hệ quả nhân sự sau một vòng gọi vốn (case thật) | 5 → 20 headcount trong **6 tháng** | handbook, Stage 6 |

Từ đó, bảng đề xuất. Cột "cửa sổ" là tuổi tối đa của tin còn đáng chạm; ba cột sau là **ngày hạn
tính theo ngày làm việc**, đo từ **ngày sự kiện** chứ không từ lúc hệ thống đọc được:

| Loại tin (`§4/nhóm 2`) | Cửa sổ cơ hội | Chắc + high | Chắc + medium | Có thể (mọi mức) |
|---|---|---|---|---|
| **Gọi vốn** | 30 ngày | **1 ngày** | 3 ngày | 5 ngày |
| **Nhân sự cấp cao** | 90 ngày | **3 ngày** | 7 ngày | 10 ngày |
| **Mảng kinh doanh mới** | 60 ngày | **5 ngày** | 10 ngày | 14 ngày |
| **Tuyển dụng quy mô lớn** | 90 ngày | **7 ngày** | 14 ngày | 14 ngày |
| **Mở rộng** | 90 ngày | **7 ngày** | 14 ngày | 14 ngày |
| **Khác** | 30 ngày | 14 ngày | 14 ngày | không tự đặt |

**Đọc bảng cho đúng.** Bảng này tính hạn cho **mọi** phát hiện, kể cả phát hiện không đủ điều kiện
tự đặt. Việc con số đó được *tự điền* hay chỉ *đề nghị trong hàng đợi* do cổng "đáng chú ý" quyết
định, không do bảng này: `relevance = high` cộng mức `Chắc`/`Có thể` thì tự điền, còn lại thì cùng
con số ấy đi vào gợi ý chờ duyệt. Nói cách khác, cột "Chắc + medium" không phải một trường hợp tự
đặt — nó là hạn mà gợi ý sẽ đề nghị. Đây là chỗ hoà giải giữa `Q2`, vốn chỉ cho bốn loại tin được tự
đặt, và bảng này vốn có sáu dòng.

Lý do xếp thứ tự như vậy, để trả lời được khi giám khảo hỏi:

- **Gọi vốn gấp nhất** vì tiền vừa về là lúc khách chưa chọn ai, và đây là tin công khai nên đối
  thủ cùng thấy. Cửa sổ 30 ngày lấy theo cửa sổ tin còn "tươi" của hệ thống thật.
- **Nhân sự cấp cao xếp thứ hai chứ không phải nhất**: playbook nói *"người mới thường xem lại toàn
  bộ những gì người cũ chọn"* — việc xem lại đó cần vài tuần, nên chạm ngày đầu tiên là chạm vào
  lúc người ta còn chưa nhận việc xong. Ba ngày là đủ sớm để có mặt trước khi họ chốt danh sách
  vendor, không sớm đến mức vô duyên.
- **Tuyển dụng và mở rộng chậm nhất trong nhóm đáng chú ý** vì chúng là quá trình, không phải sự
  kiện: case thật cho thấy hệ quả nhân sự sau gọi vốn kéo dài **6 tháng**, nên chạm ở ngày thứ 7
  không mất cơ hội. Bù lại, đây là hai loại tin dễ **đảo nghĩa** nhất (xem F25), nên để Sales có
  thời gian đọc trước khi hành động là đúng.
- **Mảng kinh doanh mới ở giữa** vì nó thường đi kèm một quyết định công nghệ đã chốt bên trong
  nhưng chưa chọn xong đối tác.

Bốn quy tắc kèm theo, không có thì bảng trên vô nghĩa:

- **Đo từ ngày sự kiện, không từ lúc đọc được.** Hệ thống thật lưu `eventDate` tách khỏi
  `detectedAt` đúng vì lý do này. Nếu không đọc được ngày sự kiện thì lấy ngày của bản lưu.
- **Tin quá cửa sổ thì không tự đặt gì.** Tin gọi vốn 45 ngày tuổi chỉ vào vùng đọc, gắn nhãn "tin
  cũ", và nếu muốn thì sinh gợi ý chờ duyệt — không tự đặt Việc tiếp theo với hạn trong quá khứ.
- **Sàn và trần.** Hạn không bao giờ nằm trong quá khứ; sớm nhất là cuối ngày làm việc kế tiếp.
  Trần 14 ngày: quá 14 ngày thì việc đó là nuôi dưỡng, không còn là câu trả lời cho "why now".
- **Nhiều tin cùng lúc thì lấy hạn ngắn nhất**, và nội dung Việc tiếp theo nhắc cả hai tin — đúng
  ví dụ của playbook: Series B cộng 12 tin tuyển engineer *"kể một câu chuyện: họ sắp xây nhiều
  hơn tốc độ tuyển người kịp"*.
- **Ngày làm việc theo múi giờ của công ty khách**, không phải ngày dương lịch — `§1` có ba thị
  trường JP, Global, KR.

Cả bảng phải nằm ở màn hình Quản trị, sửa được, mỗi dòng kèm một câu giải thích — giống cách hệ
thống thật để ngưỡng gate trong bảng config *"để đổi được không cần deploy"*. Và kiểm thử thì
**tiêm đồng hồ** thay vì chờ ngày trôi: đặt ngày sự kiện lùi lại rồi kiểm hạn được tính đúng, kiểm
cả trường hợp tin quá cửa sổ.

> **Bản chốt để dev đọc nằm ở [Mục 0.2.1](#021-ngày-hạn-việc-tiếp-theo-và-cửa-sổ-cơ-hội-d5-d6)** —
> ở đó là bảng số không kèm lý giải, đủ để cài đặt, cộng các quy tắc `D5`–`D9` và `D38`. Phần trên
> chỉ giải thích vì sao mỗi con số là con số đó, dùng khi cần bảo vệ lựa chọn ở vòng vấn đáp. Sửa số
> thì sửa ở Mục 0.2.1 trước, rồi mới cập nhật phần giải thích này — tránh hai chỗ nói hai giá trị
> khác nhau.

### F11 · Duyệt mù làm số đo đẹp giả

> Tỉ lệ duyệt 82% với thời gian quyết 4 giây là dấu hiệu duyệt mù, nhưng đề bài không đặt ngưỡng
> và không cảnh báo.

**>> Gợi ý thay đổi.** Hệ thống thật gắn **ngưỡng chấp nhận** vào từng chỉ số, và có cả quy tắc
tắt tính năng:

| Chỉ số (hệ thống thật) | Ngưỡng |
|---|---|
| Enrichment giữ nguyên — % field AI điền mà người dùng không sửa trong 7 ngày | > 80% |
| Signal hữu ích — `isUseful=true / có feedback` | > 30% |
| Proposal được xác nhận — `confirmed / (confirmed + edited + rejected)` | > 85% |
| Chi phí AI mỗi người mỗi tháng | < 15 USD |

Kèm một quy tắc rất thẳng: *"nếu sau 3 tháng, Signal Watcher có tỷ lệ hữu ích < 20% → **tắt hoặc
thu hẹp phạm vi**. Thông báo nhiễu làm giảm niềm tin vào toàn bộ hệ thống AI, và mất niềm tin thì
không lấy lại được."* Đề nghị cho bảng Quản trị của sản phẩm hackathon:

- Hiện **cặp** tỉ lệ duyệt và thời gian quyết trung bình cạnh nhau, kèm ngưỡng, tô màu khi lệch.
- Thêm một khối cảnh báo kiểu `detect-payment-anomaly` của hệ thống thật, nhưng cho việc duyệt:
  duyệt hơn 5 gợi ý trong một phút · thời gian quyết dưới 3 giây · duyệt hàng loạt ngay trước lúc
  demo. Và giữ đúng nguyên tắc ngôn từ của hệ thống thật: *"cảnh báo là thông báo để rà soát,
  không phải cáo buộc"* — viết "3 gợi ý cần rà lại", không viết "phát hiện bất thường".

### F12 · Thiếu error-detection rate

> Đề bài chỉ đo phía hệ thống. Không có số nào cho biết người tìm ra máy sai.

**>> Gợi ý thay đổi.** Hệ thống thật đã cắm sẵn chỗ ghi nhận việc này ngay trong bảng tín hiệu:
`isRead`, **`isUseful`** (ghi rõ trong schema: *"feedback của người dùng → đo chất lượng AI"*),
`dismissedAt`. Đề nghị:

- Mỗi phát hiện có hai nút nhỏ "hữu ích / không hữu ích"; mỗi mục dòng thời gian do hệ thống thêm
  khi bị xoá thì hỏi một lý do ngắn (sai / không liên quan / trùng).
- Dùng **soft delete** cho mục do hệ thống thêm, để cái bị xoá vẫn còn làm dữ liệu đo — hệ thống
  thật soft-delete mọi bảng nghiệp vụ bằng `deletedAt`.
- Công thức trình bày ở bảng Quản trị: `error-detection rate = số phát hiện bị người bác bỏ có lý
  do "sai" / tổng số phát hiện có phản hồi`. Đặt cạnh auto-accept rate, vì tài liệu phương pháp
  luận của BTC yêu cầu đúng cặp này.

### F13 · Hàng đợi không có thứ tự ưu tiên

> Mười lăm gợi ý xếp hàng như nhau; "công ty gọi vốn Series B" nằm cạnh "đổi số điện thoại tổng
> đài". Đề bài chủ động bỏ ICP nên không có cơ chế nào xếp hạng.

**>> Gợi ý thay đổi.** Không cần dựng lại ICP scoring — chỉ cần lấy các thang đã có sẵn:

- **ICP Score của handbook** (Stage 4): 4 tiêu chí × 1–5 điểm — *ICP fit · Pain urgency · PIC
  access · Vietnam fit*, ngưỡng **≥ 16 prioritize · 12–15 nurture · < 12 low priority**. Và bốn
  tiêu chí xếp thứ tự tiếp cận: *ICP fit, signal strength, DM access, urgency*.
- **`computeAccountRank` của hệ thống thật**: rank A/B/C = f(potential, dealSizeTier), và **chỉ
  xếp hạng khi account đã "chạm thực sự"** (có first meeting, hoặc NDA, hoặc opportunity) — chưa
  chạm thì `not_ranked` bất kể chấm điểm thế nào.
- **Agenda tag có `priority`** cho họp tuần: `MEGA_ACCOUNT` 1 · `BIG_DEAL` (weightedValue ≥ 10k) 2
  · `NEW_OPP` 3 · `DEADLINE_NEAR` (< 7 ngày) 5 · `WEAK_QUALIFICATION` 6.

Bản rẻ nhất cho hackathon: sắp hàng đợi theo `relevance × mức chắc chắn × (công ty có cơ hội mở
hay không)`, và cho phép nhóm theo công ty. Với gợi ý loại "điền ô còn trống", lấy **trọng số
completeness của hệ thống thật** để biết ô nào đáng điền trước: `website 2 · countryId 2 ·
specialDomain 2 · revenueBand 1 · industryId 1 · dealSizeTier 1 · yearFounded 1 · icpType 1`,
tổng 11, mục tiêu vận hành **> 0,70**. Điền `website` đáng giá gấp đôi điền `yearFounded` — đề bài
không nói, nhưng người dùng thật cảm nhận đúng như vậy.

### F6, Q13 và E7-S1 · "Chặn được kể cả ngoài giao diện"

> `§5` nói lời dặn dò suông với AI không tính là đã chặn, nhưng không nói chặn bằng cách nào, và
> `T-10` chỉ kiểm ba việc.

**>> Gợi ý thay đổi.** Hệ thống thật viết ranh giới thành bảng hai cột — **ràng buộc** và **cách
enforce trong code** — đúng thứ đề bài đang thiếu:

| Ràng buộc (hệ thống thật) | Cách enforce |
|---|---|
| AI không sinh và chạy SQL/code tự do | tool registry chỉ có tool có JSON Schema chặt; **không tool nào nhận tham số kiểu string SQL**; code review bắt buộc kiểm điểm này |
| AI truy cập dữ liệu qua **cùng tầng phân quyền** với người dùng | mọi tool nhận `PermissionContext` và gọi service đã bọc quyền; **lint rule cấm import client thô** trong `modules/ai/**` |
| Mọi thao tác ghi phải qua proposal | tool ghi chỉ tạo proposal; ngoại lệ duy nhất là ghi log hoạt động |
| AI không tự tính toán số học | prompt cấm, và **có kiểm thử**: hỏi "tăng bao nhiêu %" phải thấy tool call `comparePeriods`, không phải LLM tự nhân chia |
| Mọi output ghi vào bảng insight | interceptor tự động, không phụ thuộc dev nhớ |
| Có trần chi phí | middleware kiểm ngân sách trước mỗi call |

Chuyển thành bốn dòng cho `§5` của đề bài: ranh giới nằm ở **tầng nghiệp vụ** (đổi giai đoạn, đánh
Thắng/Thua, sửa tiền, xoá đều đi qua một service duy nhất, service đó từ chối khi `actor = system`);
phần AI **không có** hàm/tool tương ứng để gọi; có lint rule chặn import thẳng tầng dữ liệu trong
thư mục AI; và bốn kiểm thử gọi thẳng tầng nghiệp vụ với danh nghĩa hệ thống, không qua giao diện.

### F5, F3 và F22 · Bộ nghiệm thu 10 điểm quá thô

> `T-4` pass được bằng cách không làm gì, `T-6`/`T-8` khẳng định con số tuyệt đối, và 14 yêu cầu
> trong `§4` không có kiểm thử nào phủ.

**>> Gợi ý thay đổi.** Hệ thống thật viết acceptance criteria dạng **Gherkin có tình huống**, và
đáng chú ý là nó kiểm cả những thứ khó kiểm:

```gherkin
Scenario: Không tự tính nhẩm
  When tôi hỏi "tuần này tăng bao nhiêu % so với tuần trước"
  Then hệ thống ghi nhận có gọi tool compare_periods
  And KHÔNG có phép tính nào do LLM tự thực hiện

Scenario: Không tự đóng deal
  Given có email từ khách nói "chúng tôi chọn nhà cung cấp khác"
  When AI xử lý email đó
  Then AI ĐỀ XUẤT chuyển sang Lost
  And KHÔNG tự động chuyển

Scenario: Tôn trọng phân quyền
  Then AI trả lời trong phạm vi tôi được xem
  And nói rõ kết quả bị giới hạn theo quyền, KHÔNG nói là dữ liệu không tồn tại
```

Đề nghị: viết bộ nghiệm thu của đội theo đúng dạng này, giữ nguyên T-1…T-10 làm lớp ngoài nhưng
mỗi T là một `Feature` có nhiều `Scenario`, cộng thêm các scenario cho 14 lỗ hổng đã liệt kê ở mức
3. Riêng ba chỗ sửa ngay: `T-4` thêm `Given công ty đang bật Đang theo dõi`; `T-6`/`T-8` đổi từ
khẳng định con số sang khẳng định quan hệ ("mỗi tin mới trong bản chụp sinh đúng một mục"); và
thêm một scenario "AI không tự tính con số nào trên bảng Quản trị".

### F7 · Cơ hội Tạm dừng vẫn bị giục

> Tạm dừng được xếp là *đang mở* nên vừa bị đòi Việc tiếp theo vừa là đích của nhóm 4.

**>> Gợi ý thay đổi.** Hệ thống thật xử lý bằng **grace period theo mục tiêu**, không bằng
bật/tắt: cơ hội đang ở mục tiêu `close_the_deal` được trễ hạn tối đa **30 ngày** trước khi bị coi
là quá hạn, các trường hợp khác thì `graceDays = 0`. Và agenda tag bỏ hẳn cơ hội `won`/`lost`.
Đề nghị cho đề bài: Tạm dừng vẫn tính là mở (giữ đúng `§4/nhóm 1`) nhưng **không** là đích của
nhóm 4, và cờ cảnh báo thiếu Việc tiếp theo với cơ hội Tạm dừng thì im lặng cho tới khi nó quay
lại một giai đoạn đang chạy.

### F16, F17 và Q19–Q20 · Tính năng ẩn, xoá không rõ cascade

> "Bảng thống kê lý do thua" và "danh sách việc phải làm" được nhắc mà không định nghĩa; xoá công
> ty không nói kéo theo gì.

**>> Gợi ý thay đổi.** Hệ thống thật có `lossReasons` là **mảng enum** (chứ không phải một câu tự
do) cộng `lossNote`, và có cả `winFactors` — nên bảng thống kê lý do thua là báo cáo đếm theo
enum, làm trong một truy vấn. Về xoá: mọi bảng nghiệp vụ có `deletedAt` (xoá mềm) và
`account_signal` khai `onDelete: Cascade`. Đề nghị: lý do thua chọn từ danh sách ngắn thay vì gõ
tự do (đo được, và Sales bấm nhanh hơn), xoá công ty là xoá mềm kéo theo dữ liệu phụ thuộc, gợi ý
đang chờ bị đóng với lý do "công ty đã xoá".

### F18, Q7 và rủi ro hạn mức · Vòng quét 60 giây

> Chu kỳ 60 giây gặp độ trễ mô hình ngôn ngữ; đề bài không nói gì về chồng vòng và không nói gì
> về chi phí.

**>> Gợi ý thay đổi.** Nhịp thật của hệ thống đang chạy là **cron thứ Hai 06:00** cho các account
`isWatching`, không phải mỗi phút — nghĩa là 60 giây của đề bài đúng như nó tự nhận: giá trị để
chấm demo. Đề nghị trình bày sản phẩm với **hai chế độ**: mặc định vận hành (hằng ngày hoặc hằng
tuần) và chế độ demo 60 giây, cùng một tham số. Kèm ba cơ chế chi phí lấy nguyên từ hệ thống thật:

- **Định tuyến model**: việc trích xuất dùng model rẻ, chỉ việc cần suy luận mới dùng model mạnh;
  ngoại lệ cho công ty lớn hoặc cơ hội giá trị cao.
- **Cache theo hash prompt**, TTL 24 giờ cho enrichment.
- **Trần ngân sách** kiểm trước mỗi lệnh gọi, cảnh báo ở 80%.

Cộng thêm quy tắc không chồng vòng, và nhật ký có dòng cho vòng bị bỏ.

### E1-S5 · Cổng Đủ điều kiện chỉ có hai ô

> Đề bài hỏi "dấu hiệu nhu cầu" và "dấu hiệu ngân sách", bỏ qua được, chỉ mang cờ cảnh báo.

**>> Gợi ý thay đổi.** Hai ô đó là **2 trong 6 chiều MEDDIC** mà cả hệ thống thật và handbook đều
dùng. Hệ thống thật đặt cổng: **4/6 chiều có nội dung thực chất, bắt buộc có Identify Pain và
Economic Buyer**, tối thiểu 30 ký tự mỗi chiều — và tự nhận `minChars` là proxy thô, đồng thời nói
rõ *"không dùng AI làm cổng chặn cứng, vì AI có thể sai và không nên chặn người làm việc"*. Handbook
thì cho cách kiểm hai chiều bằng **fact**: tech stack + vendor đang trả tiền → *requirement*;
headcount + revenue → *budget*, kèm câu tự vấn *"Do you actually know their tech stack and existing
vendor, or are you assuming?"*.

Đề nghị: giữ đúng hai ô của đề bài (không thêm việc), nhưng đặt placeholder theo đúng cách hỏi của
handbook, và chỗ ghi nguồn thì bắt chọn **fact hay hypothesis** — vừa đúng nghiệp vụ, vừa tái dùng
đúng khái niệm mức chắc chắn của nhóm 2. Nếu còn thời gian thì thêm bốn chiều MEDDIC còn lại dưới
dạng ô văn bản, và một chỉ báo "còn thiếu mấy chiều" — không chặn.

### E2-S4 · "Câu nhận định phải cho thấy đọc dưới góc loại công ty nào"

> Yêu cầu AI có giá trị nghiệp vụ cao nhất của nhóm 2, và không có kiểm thử nào phủ.

**>> Gợi ý thay đổi.** Handbook có sẵn **công thức viết pain hypothesis một câu**: *"Because
[external pressure] creates [internal bottleneck], [PIC] likely cares about [personal KPI /
risk]."* Cộng với chuẩn Signal Note **3–6 từ** (ví dụ đúng chuẩn trên slide: *"Công ty đang tuyển
.Net Developer"*). Đề nghị: câu nhận định sinh theo đúng công thức đó, có tham số loại công ty, và
prompt nhận `icpType` như hệ thống thật làm — nó ghi rõ `icpType` *"quyết định pain point, PIC cần
tiếp cận, và bằng chứng cần đưa ra"*. Kiểm thử được ngay: cùng một câu trích, hai `icpType` khác
nhau phải cho hai câu nhận định khác nhau, và mỗi câu phải chứa tên loại công ty.

## 5.4. Phát hiện mới, chỉ thấy được khi đối chiếu hệ thống thật

| # | Phát hiện | Vì sao quan trọng |
|---|---|---|
| F25 | Enum loại tin của đề bài **không có tín hiệu âm**. Hệ thống thật có `layoff` (sa thải) và `financial_result`; handbook cũng dạy rằng cùng một tín hiệu đảo nghĩa tuỳ bối cảnh — "tuyển 12 engineer" có thể nghĩa là khách **tự xây năng lực và sắp giảm** thuê ngoài | Sản phẩm chỉ biết reo mừng. Một CRM AI-native mà không đọc được tin xấu thì Sales sẽ không tin nó ở đúng lúc quan trọng nhất |
| F26 | Đề bài không có **lớp mô tả ngữ nghĩa** cho chính CRM. Hệ thống thật coi `field_metadata` với `aiHint`, `synonymsVi`, `sensitiveLevel` là *"phần chống lỗi quan trọng nhất của cả tầng AI"*, cộng một `business_glossary` dịch tiếng người sang filter | Đây đúng là **ontology** mà tài liệu phương pháp luận của BTC nói là lõi của phần mềm AI-native. Đề bài bắt AI đọc thế giới bên ngoài nhưng không bắt AI hiểu chính hệ thống nó đang ghi vào. Làm thêm một tệp metadata rất rẻ và ăn điểm cả System Design |
| F27 | `§4/nhóm 1` yêu cầu tổng giá trị theo giai đoạn — chính là cái bẫy mà hệ thống thật cảnh báo bằng chữ in hoa: *"KHÔNG cộng dồn `estimatedValue` rồi gọi là pipeline value — phải dùng `weightedValue` = estimatedValue × winRate"*, và *"KHÔNG BAO GIỜ gọi đây là doanh thu"* | Một con số đặt sai tên trên màn hình tổng quan là thứ Sales nhìn ra trong ba giây ở vòng 3. Rẻ nhất: gọi đúng tên "tổng giá trị ước tính (chưa nhân xác suất)" |
| F28 | Đề bài buộc **đúng một đầu mối chính** cho mỗi công ty, trong khi chính `§1` nói B2B có "nhiều người tham gia quyết định". Handbook đòi **4–5 PIC mỗi account, phủ 3 tầng** (executive lấy signal → mid-manager → C-level quyết), và dạy tìm PIC theo JD/công việc thật **chứ không theo title**; hệ thống thật có bảng `opportunity_contact` với `StakeholderRole` cho cả buying committee | Mô hình một-PIC làm sản phẩm không diễn được tình huống thật. Rẻ: thêm một trường vai trò cho người liên hệ gắn với cơ hội, giữ nguyên "đầu mối chính" theo đề bài |
| F29 | Đề bài không có bước **screening Keep / Hold / Drop**, vốn là stage kỷ luật nhất của quy trình thật: 30–45 giây mỗi công ty, **100% công ty phải có nhãn**, *"no vague states allowed"*, mỗi KEEP có một câu "why this account" bảo vệ được, phễu **50 → ~10** | Nhãn Đang theo dõi của đề bài là bản mờ của KEEP. Chỉ cần thêm một ô "vì sao theo dõi công ty này" bắt buộc khi bật nhãn là sản phẩm chạm được vào đúng chỗ Sales thấy giá trị |
| F30 | Đề bài để ngỏ hình thức giao diện, nhưng khối quan trọng nhất của hệ thống thật là **data workspace dạng bảng tính**: sửa trực tiếp trong ô, không mở form; 34 view seed; **trạng thái view lưu riêng theo từng người** và khôi phục khi mở lại — đó là yêu cầu người dùng nói ra bằng lời | `§1` của đề bài coi bảng tính là nỗi đau, nhưng người dùng thật chỉ đau vì bảng tính *rời rạc*, không phải vì dạng bảng. Làm CRM toàn form sẽ thua chính Excel ở vòng 3 |
| F31 | Đề bài không nói gì về **hướng** của hoạt động và giá trị khác nhau giữa các loại. Hệ thống thật có `direction` inbound/outbound và bảng trọng số đã kiểm chứng: `referral_received` **150** · `favor` 80 · `social_meal` 50 · `document_shared` 45 (chỉ tính khi khách mở) · `meeting_offline` 20 · `call` 5 · **`email_in` 2 > `email_out` 1** | "Khách chủ động trả lời có giá trị hơn mình gửi đi" là tri thức nghiệp vụ mà một CRM biết thì Sales tin ngay. Thêm một enum và một cột trọng số là đủ |
| F32 | Dòng thời gian của đề bài chỉ ở cấp **công ty**. Hoạt động của hệ thống thật gắn được vào account, contact, opportunity, contract — có index riêng cho từng chiều, và ràng buộc "phải gắn với ít nhất một đối tượng" | Mở một cơ hội mà không thấy lịch sử của chính cơ hội đó là thiếu hụt nhìn thấy ngay. Cho hoạt động một liên kết tuỳ chọn tới cơ hội là xong |
| F33 | Đề bài không có **quy tắc tự kiểm chất lượng dữ liệu**. Hệ thống thật có ba tầng `blocking / error / warning`, mỗi vấn đề kèm `fixHint` và **`fixAction` sửa một click** (ví dụ cảnh báo thiếu ICP đi kèm hành động "chạy AI enrichment"), và cả rule tự soi phán đoán của người: cảnh báo khi một account được chấm potential = High **quá 30 ngày mà chưa sinh cơ hội nào** | Cờ cảnh báo của đề bài chỉ biết nhắc, không biết sửa. Gắn `fixAction` vào mỗi cờ là đúng tinh thần "máy chuẩn bị sẵn, người bấm" của `§4/nhóm 3`, và gần như miễn phí |
| F34 | Đề bài bắt AI đọc nguồn nhưng **không cấm AI bịa câu trích**. Hệ thống thật ràng "mỗi tín hiệu bắt buộc có `sourceUrl`, không có nguồn thì không báo cáo" và enrichment "không chắc → để null, **KHÔNG đoán**"; ngoài ra bắt AI **chỉ chọn giá trị từ danh sách cho sẵn**, vì hệ thống cũ cho nhập tự do và kết quả là *106 giá trị ngành trùng nghĩa làm hỏng mọi báo cáo* | Phải đối chiếu câu trích với bản lưu theo nguyên văn rồi mới lưu, và enum thì bắt AI chọn trong danh sách. Đây là hai kiểm thử rẻ nhất trong toàn bộ đề bài mà `T-2` chưa chạm tới |
| F35 | Đề bài không đòi **hỏi lại khi mơ hồ**. Hệ thống thật có tiêu chí ngược lại rất rõ: gặp câu hỏi mơ hồ thì *"AI KHÔNG trả lời ngay bằng một con số"* mà hỏi lại kèm ba lựa chọn, và có chỉ số theo dõi tỉ lệ phải hỏi lại | Với sản phẩm hackathon, tương đương: khi một phát hiện có thể đọc theo hai nghĩa, sinh gợi ý dạng hai lựa chọn thay vì chọn hộ. Đúng hướng AI human-centric mà `§4` đang theo |

## 5.5. Phát hiện từ vòng soát tính thống nhất (`F36`–`F38`)

Ba phát hiện này không đến từ việc đối chiếu hệ thống thật mà từ vòng soát lại **tính thống nhất nội
bộ** của chính tài liệu này: đọc chéo từng quyết định của đội với nhau và với `T-1`…`T-10` để tìm chỗ
hai kết luận va nhau.

| # | Phát hiện | Vì sao quan trọng | Xử lý |
|---|---|---|---|
| `F36` | Quyết định **không ghi đè ô Việc tiếp theo do người nhập tay** (`D12`) có thể làm **đỏ `T-6`**. `T-6` đòi "Việc tiếp theo của cơ hội **tự đổi**" sau khi chuyển bản chụp. Nếu bộ dữ liệu BTC điền sẵn Việc tiếp theo cho cả 8 cơ hội — mà `§4/nhóm 1` khiến điều đó rất có khả năng, vì cơ hội thiếu ô này thì mang cờ cảnh báo — thì không còn ô nào trống để hệ thống tự điền, và một quyết định "làm chặt hơn" lại làm hỏng nghiệm thu | Đây là kiểu lỗi tệ nhất: đội làm đúng nghiệp vụ hơn đề bài rồi trượt vì đúng chỗ đó. Không đội nào phát hiện được nếu chỉ đọc `§4/nhóm 4` mà không đọc chéo với `§6` và `§3` | Cờ cấu hình `nextAction.overwriteOverdueManual`, mặc định `false` (không đè, đúng nghiệp vụ). Sáng 15/08, sau khi thấy dữ liệu thật: nếu cả 8 cơ hội đều có Việc tiếp theo người nhập, bật cờ lên `true` để khớp hành vi `§4/nhóm 4`, và trình bày lựa chọn mặc định ở vòng vấn đáp. Kiểm thử phủ **cả hai** nhánh cờ |
| `F37` | `§3` và `§4/nhóm 2` dùng **hai bộ nhãn khác nhau cho cùng sáu loại tin**: "bổ nhiệm lãnh đạo công nghệ / mở rộng văn phòng / tuyển dụng quy mô lớn" so với "nhân sự cấp cao / mở rộng / tuyển dụng" | Đội đọc `§3` để viết bộ nạp dữ liệu và đọc `§4/nhóm 2` để viết tầng AI, nên rất dễ dựng **hai enum** rồi phải ánh xạ giữa chúng. Nhãn `§3` hẹp hơn nhãn `§4/nhóm 2` — "bổ nhiệm lãnh đạo công nghệ" là tập con của "nhân sự cấp cao" — nên ánh xạ sai sẽ mất tin | Một enum duy nhất, nhãn `§4/nhóm 2` làm chuẩn, nhãn `§3` ghi kèm làm bút danh trong bảng 0.1.4 (`D1`) |
| `F38` | Ranh giới `§5.3` dễ bị cài đặt **quá tay**. `E7-S2` nói "chặn mọi lệnh gọi ra ngoài danh sách cho phép", nhưng `§3` cho phép gọi dịch vụ ngoài "thoải mái, kể cả mô hình ngôn ngữ", và chính `§5.3` viết rõ *"Đây là ranh giới về việc chạm tới người thật, không phải lệnh cấm gọi mạng"* | Một đội đọc `§5.3` rời khỏi ngữ cảnh sẽ chặn cả lệnh gọi mô hình ngôn ngữ, tức tự tay làm hỏng toàn bộ nhóm 2 — đúng lúc đang tưởng mình cẩn thận | Danh sách cho phép mở cho nhà cung cấp mô hình; cái bị chặn là **kênh chạm tới người thật**: thư, tin nhắn, webhook gửi ra ngoài (`D25`) |

## 5.6. Việc nên làm ngay, xếp theo rẻ trước

| # | Việc | Giải `F` nào | Quyết định |
|---|---|---|---|
| 1 | Dựng một enum loại tin duy nhất, nhãn `§4/nhóm 2` làm chuẩn, nhãn `§3` làm bút danh | `F15`, `F37` | `D1` |
| 2 | Áp quy tắc **thêm thì tự do, ghi đè thì phải duyệt** — một quyết định thiết kế, không thêm dòng mã nào đáng kể | `F1`, `F2`, `F8` | `D16`, `D17`, `D12` |
| 3 | Đặt cờ `nextAction.overwriteOverdueManual` mặc định `false`, kiểm thử phủ cả hai nhánh — làm ngay để sáng 15/08 chỉ phải bật cờ | `F36` | `D12` |
| 4 | Đặt ngưỡng cho "đáng chú ý" và bảng ngày hạn theo loại tin, để cả hai ở màn hình Quản trị | `F10` | `D3`–`D9`, `D38` |
| 5 | Đối chiếu câu trích với bản lưu theo nguyên văn trước khi lưu, và bắt mô hình chọn enum trong danh sách cho sẵn | `F34` | `D22` |
| 6 | Thêm `isUseful`, lý do khi xoá, và xoá mềm cho mục do hệ thống thêm — mở đường cho `error-detection rate` | `F12` | `D30` |
| 7 | Sắp thứ tự hàng đợi theo `relevance` × mức chắc chắn, ưu tiên ô trống theo trọng số hoàn thiện | `F13` | `D31` |
| 8 | Viết bảng "ràng buộc → cách enforce" cho năm lệnh cấm của `§5`, kèm kiểm thử gọi thẳng tầng nghiệp vụ; nhớ **không** chặn oan lệnh gọi mô hình | `F6`, `F38` | `D25` |
| 9 | Đổi `T-4`, `T-6`, `T-8` sang khẳng định quan hệ và thêm `Given` còn thiếu | `F3`, `F5` | `D36` |
| 10 | Gắn `fixAction` một cú bấm vào mỗi cờ cảnh báo | `F33` | — |
| 11 | Thêm ô "vì sao theo dõi công ty này", bắt buộc khi bật nhãn Đang theo dõi | `F29` | — |
| 12 | Cho hoạt động một liên kết tuỳ chọn tới cơ hội | `F32` | — |

**Nếu còn thời gian**, theo thứ tự giá trị giảm dần: danh sách dạng bảng sửa tại ô cộng lưu bộ lọc
theo từng người dùng (`F30`) · vai trò stakeholder cho người liên hệ gắn với cơ hội (`F28`) · hướng
và trọng số cho hoạt động (`F31`) · một tệp mô tả ngữ nghĩa trường dữ liệu (`F26`) · gợi ý dạng hai
lựa chọn khi một phát hiện đọc được hai nghĩa (`F35`).

## 5.7. Phát hiện từ vòng soát thể lệ (`F39`)

Vòng soát này chỉ đọc lại một tệp: [thể lệ](0.%20Thể%20lệ%20AI%20Hackathon%2001%20-%20Dev%20Edition.md).
Bốn mục trước dùng nó ít nhất trong năm tệp BTC phát — `F23` và `F24` là hai chỗ duy nhất chạm tới,
và cả hai đều chỉ đọc phần **vòng 1**.

### `F39` · Log vừa là bài làm vừa là đề thi

Thể lệ mô tả hai vòng đầu bằng hai câu, và hai câu đó dùng **cùng một hiện vật**:

- **Vòng 1** — *"các checklist được chấm tự động thông qua đọc Log được gửi lên"*. Log là **bài làm**.
- **Vòng 2** — *"sự hiểu biết của team về các lựa chọn được đưa ra trong lúc làm dự án, **dựa vào log
  của từng đội**; chọn ngẫu nhiên 3–5 câu hỏi cho mỗi đội"*. Log là **đề thi**.

Hai vai này kéo ngược nhau. Chiến lược đúng cho vòng 1 — sinh càng nhiều dấu vết dùng AI càng tốt —
mở rộng đúng cái bề mặt mà vòng 2 bốc ngẫu nhiên. Mỗi đầu ra AI giữ lại mà không ai trong đội đọc là
một câu hỏi có thể rơi trúng, và xác suất rơi trúng tăng theo khối lượng.

Ba tính chất khiến chỗ này khó xử hơn `F4`:

| Tính chất | Vì sao nó khó |
|---|---|
| **Ngẫu nhiên** | Không chuẩn bị chọn lọc được. `F4` còn đoán được giám khảo sẽ soi `T-4` và `T-10`; ở đây không có chỗ nào để đoán |
| **Có điều kiện** | Chỉ áp cho top 5 sau vòng 1 — tức nó chỉ gây hại đúng lúc đang thắng |
| **Không đối xứng** | Vòng 1 thưởng theo khối lượng, vòng 2 phạt theo phần không hiểu. Cùng một hành động cho điểm ở vòng này và trừ ở vòng sau |

Barem cũng nói đúng điều này ở ô Quality Gate: *"nếu team KHÔNG giải thích được tại sao AI output
đúng/sai → áp Penalty hộp đen"*. Thể lệ chỉ nói rõ thêm **cách** nó được kiểm: bốc ngẫu nhiên từ log,
không phải hỏi vào chỗ đội chọn để trình bày.

**Quyết định `D40`.** Không tối ưu khối lượng log. Mọi đầu ra AI giữ lại trong ngày thi phải có một
người đọc và phát biểu được lý do trong một câu; nói không được thì bỏ, đừng giữ. Với đội 2–3 người
và 4,5 tiếng theo agenda, đây đồng thời là ràng buộc scope thật: **bề mặt mã tối đa bằng bề mặt hai
người đọc kịp**, không bằng bề mặt AI sinh kịp.

Ghi kèm cho vòng 2: `D40` chỉ bảo đảm đội *đọc* được, chưa bảo đảm đội *nhớ* được sau bốn tiếng rưỡi.
Rẻ nhất là mỗi quyết định lớn để lại một dòng lý do ngay lúc quyết, thay vì dựng lại lý lẽ lúc 15:40
khi đã công bố top 5.

## 5.8. Phát hiện từ giải đáp BTC ngày 14/8 (`F40`)

Nguồn: [Hỏi đáp thông tin cuộc thi](4.%20Hỏi%20đáp%20thông%20tin%20cuộc%20thi.md) mục 9 và 10 — giải đáp
trên kênh chung, không có trong năm tệp phát ban đầu.

Giải đáp này đóng `Q22` và `F24`: chỉ log ngày 15/8 được tính, và chạy lại phân tích yêu cầu trong
ngày thi để sinh log là **cách làm BTC xác nhận đúng**. `D39` chuyển từ *chờ BTC* sang chốt. Nhưng
cùng câu trả lời đó mở ra một chỗ mới.

### `F40` · Ngày thi có một tính năng chưa ai biết

> *"Nếu các team đều hoàn thành rồi thì thứ 7 vẫn có một tính năng thêm nữa nhé, để cho các đội trải
> đủ các bước."*

Không tệp nào trong `docs/Đề bài/` lường trước điều này. Cả `§4` lẫn `§6` đều đóng: sáu nhóm tính
năng, mười điểm nghiệm thu, hết. Kế hoạch ngày thi dựng trên hai tài liệu đó — nạp dữ liệu thật rồi
sửa vài chỗ — nay thiếu một khối.

Đọc kỹ vế sau của câu trả lời thì thấy đây là **công cụ của BTC, không phải phần thưởng**: mục đích
ghi thẳng là *"để cho các đội trải đủ các bước"*. Nó tồn tại để ép mọi đội chạy đủ năm giai đoạn của
barem **bên trong cửa sổ được chấm**, vì `F23` đã chỉ ra rằng đội chuẩn bị kỹ trước ngày thi sẽ
không còn gì để sinh log ở hai cột Requirement Analysis và System Design — cộng lại **40 điểm**.

Ba hệ quả:

| | |
|---|---|
| **Chuẩn bị kỹ không còn là lợi thế** | Ai cũng phải chạy đủ vòng trên cùng một tính năng chưa ai biết. Phần làm sẵn chỉ giúp không phải chia trí, không giúp ghi điểm hai cột đó |
| **Thứ phân định là tốc độ một vòng, không phải độ hoàn thiện sản phẩm** | Chỉ số đáng tập là: từ lúc nhận yêu cầu tới lúc có mã chạy được, kiểm thử xanh và triển khai lại — mất bao lâu |
| **Cắt scope trở nên bắt buộc** | Quỹ giờ 9:30–15:00 nay phải chứa cả một tính năng chưa biết. Với đội 2–3 người, đây là ràng buộc cứng chứ không phải lời khuyên |

**Quyết định `D41`.** Giữ trống khối giữa của ngày thi cho tính năng mới, và trước ngày thi tập một
vòng đầy đủ trên một yêu cầu nhỏ tự nghĩ ra — không phải để có thêm tính năng, mà để đo xem một vòng
mất bao lâu và chỗ nào nghẽn.

`D41` ăn khớp với `D40`: tính năng phát tại chỗ là loại việc sinh log **tự nhiên bảo vệ được** ở vòng
2, vì cả đội vừa cùng quyết trong ngày. Đây là chỗ tốt nhất để đầu tư giờ, hơn hẳn việc sinh thêm dấu
vết cho phần đã làm xong từ trước.

### Ghi chú vòng 3

Mục 10 của tệp hỏi đáp có danh sách sáu giám khảo vòng 3 kèm thư điện tử, và BTC **chủ động mời liên
hệ trước** để hỏi kỳ vọng và tư vấn UI/UX. **Năm trên sáu người thuộc thị trường JP** — đây là dữ
kiện có sức nặng với `Q16`/`F21` (ngôn ngữ nội dung) và với mọi lựa chọn giao diện, và nó đến từ
người sẽ chấm chứ không phải từ suy luận.

---

# Phụ lục — Prompt log

Ghi lại đúng quá trình tạo ra tài liệu này, để phần phân tích yêu cầu có chỗ đối chiếu.

**Bối cảnh trước đó trong cùng phiên.** Bốn tệp gốc của BTC ở thư mục này (hai `.docx`, một
`.xlsx`, một PDF không đuôi) được chuyển sang markdown để đọc và trích dẫn được: `.docx` và
`.xlsx` chuyển bằng thư viện, PDF là tài liệu dàn nhiều cột nên các bảng được dựng lại từ toạ độ
từng đoạn chữ. Đã kiểm lại độ phủ văn bản: 166/166 và 65/65 đoạn của hai tệp `.docx` có mặt trong
bản markdown; phần lệch của PDF chỉ là mảnh vỡ do lỗi mã hoá chữ `Đ` và chữ giãn cách, không mất
nội dung. Bản markdown là thứ được dùng để phản biện, nên bước kiểm này là điều kiện để tin vào
các trích dẫn trong tài liệu.

**Yêu cầu của người dùng, nguyên văn:** *"review và phản biện lại Yêu Cầu đề bài chính thức cuộc
thi. Yêu cầu tối thiểu cần có: Tóm tắt/diễn giải lại yêu cầu thô, chấp nhận nguyên bản · Dùng AI
đặt câu hỏi làm rõ, phát hiện điểm mơ hồ · Phân rã thành user stories/epics có acceptance
criteria, có review & bổ sung domain knowledge · Đóng vai persona người dùng để phản biện yêu
cầu, tự phát hiện edge case/rủi ro, có prompt log lý giải"* — bốn gạch đầu dòng này là đúng bốn
mức của hạng mục Requirement Analysis trong barem, nên tài liệu lấy chúng làm bốn mục chính.

**Ràng buộc bổ sung của người dùng:** *"không reference đến các file khác ngoài thư mục Đề bài"* —
vì vậy tài liệu chỉ dẫn tới năm tệp trong thư mục này, không dẫn tới tài liệu nội bộ khác của
đội. Ban đầu đã định đối chiếu với các tài liệu kế hoạch của đội; ràng buộc này chặn lại, và đó
là lựa chọn đúng cho một bản phản biện đề bài: kết luận phải đứng được chỉ bằng văn bản BTC phát.

**Cách làm, theo thứ tự:**

1. Đọc trọn đề bài, không tóm tắt sớm — mục 1 của tài liệu này viết trước khi phê phán, để không
   trộn diễn giải với đánh giá.
2. Đọc chéo bốn tệp còn lại để tìm chỗ đề bài **giả định người đọc đã biết**: từ vựng
   Observation/Claim/Provenance/Proposal ở tài liệu phương pháp luận, qualify hai chiều và bốn
   loại tín hiệu ở playbook, trọng số và cơ chế ba vòng chấm ở barem và thể lệ.
3. Đối chiếu **từng cặp** nhóm tính năng có thể chạm nhau, thay vì đọc tuần tự: nhóm 2 với nhóm
   3, nhóm 3 với nhóm 5, nhóm 4 với nhóm 1, nhóm 4 với ranh giới `§5`. F1, F2, F7, F8 hiện ra từ
   bước này — đọc tuần tự thì không thấy, vì mỗi nhóm đọc riêng đều hợp lý.
4. Đọc `§6` ngược: với mỗi câu yêu cầu trong `§4`, hỏi "điểm nào trong T-1…T-10 kiểm nó?". Ra
   danh sách lỗ hổng phủ kiểm thử và F3, F5, F22.
5. Đóng vai bốn persona, mỗi vai một câu hỏi thật họ sẽ hỏi. Vai Sales chấm vòng 3 là vai đắt
   nhất, vì thể lệ cho end user chấm vòng cuối.
6. Với mỗi mơ hồ, buộc phải viết **một giả định làm việc** — không để câu hỏi treo. Đề bài phát
   ngày 07/8 và dữ liệu phát sáng 15/8; chờ BTC trả lời từng câu là không khả thi.

**Suy luận cho mấy phát hiện chính:**

- **F1** đến từ việc so hai câu: `§4/nhóm 3` "khi có phát hiện mới … sinh gợi ý … thêm một tin
  mới vào dòng thời gian" và `§4/nhóm 5` "nếu có nội dung mới thì rút phát hiện → tự thêm một mục
  vào dòng thời gian". Cùng một tác nhân kích hoạt, cùng một đích ghi, hai mức tự chủ khác nhau,
  và không có câu nào loại trừ nhau.
- **F3** đến từ việc thử hình dung cách làm `T-4` **pass mà không cần làm gì**: nếu công ty thử
  không bật Đang theo dõi thì vòng quét không chạm tới nó. Một kiểm thử pass được bằng cách không
  làm gì là kiểm thử không có giá trị.
- **F19** đến từ việc ghép "trừ khi có bản lưu mới" với "mỗi lần đọc lưu lại thành một bản lưu":
  nếu đọc lại luôn tạo bản lưu thì điều kiện miễn trừ luôn đúng, và quy tắc chống trùng tự vô
  hiệu.
- **F12** đến từ tài liệu phương pháp luận: hai số đo đi thành cặp — auto-accept rate đo hệ thống,
  error-detection rate đo người. Đối chiếu danh sách số đo ở `§4/nhóm 6` thì chỉ thấy nửa đầu.
- **F23** đến từ việc so trọng số barem (chấm theo giai đoạn dùng AI) với `§6`–`§7` (chấm theo
  sản phẩm) và cơ chế vòng 1 của thể lệ (chấm tự động qua log). Ba văn bản đo ba thứ khác nhau.

**Việc chưa làm, nói rõ để không ai hiểu nhầm:** chưa hỏi BTC bất kỳ câu nào trong mục 2 — toàn
bộ giả định trong tài liệu là của đội và cần được xác nhận. Chưa viết mã, chưa dựng thử, nên các
rủi ro về hạn mức mô hình ngôn ngữ và độ trễ vòng quét là suy luận từ đề bài, chưa đo. Chưa phỏng
vấn Sales thật; bốn persona ở mức 4 được dựng từ playbook và đề bài, không phải từ phỏng vấn.

## Vòng hai — bổ sung mục 5

**Yêu cầu của người dùng, nguyên văn:** *"hãy thử dùng tri thức sales và CRM trong thư mục 'CRM
clone từ Airtable' để tiếp tục phản biện đề bài (viết riêng thêm vào mục bên dưới). Và thử tự trả
lời các câu hỏi mà phần phản biện trên vừa đưa ra. Hãy trình bày xen kẽ: phản biện cũ >> gợi ý
thay đổi."* Ràng buộc "chỉ dùng thư mục Đề bài" của vòng một vì thế chỉ còn áp cho bốn mục đầu;
mục 5 nói rõ nguồn mới ngay từ câu đầu để người đọc không lẫn.

**Cách làm:**

1. Lấy mục lục hai tệp trước, không đọc tuần tự — tệp PRD 5.900 dòng và handbook 6.000 dòng, đọc
   thẳng là hết thời gian mà vẫn thiếu chỗ cần.
2. Chọn đọc theo **danh sách phát hiện đã có**, tức đi từ câu hỏi tới nguồn: F1/F2 → mục phân cấp
   quyền ghi của AI; F8 → luồng enrichment; F10/Q2 → Signal Watcher; F11/F12 → mục đo lường chất
   lượng AI và bảng tín hiệu; F13 → hàm xếp hạng account, ICP scoring của handbook, agenda tag;
   F6/Q13/Q18 → bảng ràng buộc tầng AI và mục phân quyền; F5/F3 → mục acceptance criteria.
3. Đọc thêm bốn chỗ **không nằm trong danh sách câu hỏi**, để tìm cái mình chưa biết là mình
   thiếu: phạm vi và quy mô hệ thống, bảng hoạt động, bảng validation, và nguyên tắc rút gọn view.
   Đúng bốn chỗ này sinh ra phần lớn phát hiện mới F25–F35 — nếu chỉ đi tìm câu trả lời cho câu
   hỏi cũ thì đã bỏ hết.
4. Với mỗi phát hiện cũ, ưu tiên **giải pháp đã có người trả giá** thay vì giải pháp tự nghĩ. Ví
   dụ F1: thay vì tự chọn "nhóm 5 nhường nhóm 3", lấy nguyên nguyên tắc "chỉ thêm thì tự do, ghi
   đè thì phải duyệt" của hệ thống thật — vì lý do đằng sau nó viết sẵn trong tài liệu.

**Ba chỗ hệ thống thật cho câu trả lời khác hẳn suy luận ban đầu:**

- **F8.** Ban đầu chỉ định hỏi BTC "được đè lên giá trị quá hạn không". Hệ thống thật trả lời dứt
  khoát là **không đè dữ liệu người nhập**, nên đội nên làm chặt hơn đề bài chứ không phải xin
  phép làm lỏng.
- **Nhịp vòng quét.** Ban đầu coi 60 giây là ràng buộc kỹ thuật phải chịu. Nhịp thật là **hằng
  tuần** — nên cách trình bày đúng là hai chế độ, và điều đó biến một rủi ro thành một điểm cộng
  khi thuyết trình.
- **F13.** Ban đầu định tự thiết kế công thức ưu tiên. Handbook đã có ICP Score 4 tiêu chí với
  ngưỡng ≥16/12–15/<12, và hệ thống thật có ma trận rank cùng bảng trọng số completeness. Không
  cần phát minh lại.

**Việc chưa làm ở vòng này:** chưa đọc hết hai tệp (đã đọc khoảng 1.100 dòng có chọn lọc trên
tổng ~12.000 dòng), nên có thể còn phát hiện chưa khai thác — đáng đọc tiếp phần cây quyết định
của handbook và mục kiến trúc của PRD khi bước sang thiết kế. Các con số trích dẫn là con số của
hệ thống thật, **không phải** con số BTC sẽ phát trong bộ dữ liệu mẫu; đừng dùng chúng làm căn cứ
nghiệm thu.

## Vòng ba — soát tính thống nhất và dựng tầng chuẩn

**Yêu cầu của người dùng, nguyên văn:** *"hãy duyệt lại một lượt logic thống nhất của tài liệu phản
biện và phân tích yêu cầu, Trình bày khoa học, dễ đọc cho cả người và máy. Đảm bảo khi AI có thể dễ
dàng đọc hiểu tài liệu phản biện, để kết hợp file phản biện này với file Yêu cầu đề bài chính thức để
có thể vibe code ra sản phẩm sau này."*

Vòng này không thêm phản biện mới về đề bài. Nó làm hai việc: soát mâu thuẫn **nội bộ** của chính tài
liệu, và dựng **Mục 0** làm tầng chuẩn để một tác nhân sinh mã đọc được mà không phải suy luận.

**Cách soát, theo thứ tự:**

1. Đọc trọn tài liệu rồi đọc trọn đề bài, sau đó kiểm **từng trích dẫn `§`** xem có trỏ đúng chỗ.
   Cách này bắt được `§7.4` bị ghi cho yêu cầu đăng nhập hai tài khoản, trong khi yêu cầu đó ở
   `§7.3`; và bắt được một tham chiếu `R14` không tồn tại, đúng ra là `F14`.
2. Với mỗi khái niệm được định nghĩa nhiều lần, so **tất cả** các định nghĩa. "Đáng chú ý" có ba
   định nghĩa khác nhau ở `Q2`, ở 5.2 và ở 5.3; ghi đè Việc tiếp theo có ba lập trường ở `Q10`,
   `Q12` và `E4-S1`; cửa sổ hoàn tác có hai giá trị. Đây là loại lỗi mà đọc tuần tự không thấy, vì
   mỗi chỗ đọc riêng đều hợp lý — cùng một cơ chế đã sinh ra `F1` và `F2` ở vòng một.
3. Đếm lại mọi con số đếm trong tài liệu. Câu "còn lại đúng bốn câu cần BTC" đếm thiếu, vì bảng 5.2
   đánh dấu sáu câu.
4. Đọc chéo mỗi quyết định "làm chặt hơn đề bài" với `T-1`…`T-10` để tìm chỗ nó tự làm đỏ nghiệm
   thu. Đúng bước này sinh ra `F36`.
5. Kiểm điều kiện nguồn mà chính tài liệu tự đặt ra: Mức 1–4 chỉ được đứng trên văn bản BTC. Phần
   trả lời chi tiết `Q1` vi phạm điều đó vì nó dẫn handbook, nên nó được ghi rõ nguồn ngay đầu mục
   2.1 thay vì im lặng.

**Ba quyết định về cấu trúc, và lý do:**

- **Tách một tầng chuẩn (Mục 0) khỏi tầng lý lẽ (Mức 1–5).** Trước vòng này, bản chốt để dev đọc
  nằm **trong một ô của bảng ở Mức 2**, dài mười mấy dòng ngăn bằng `<br>`. Một ô bảng không phải
  chỗ đặt đặc tả: người đọc phải cuộn ngang, và máy đọc thì không tách được đâu là ràng buộc đâu là
  ví dụ. Giờ mọi con số ở Mục 0 dạng bảng phẳng, và Mức 1–5 chỉ giải thích.
- **Đặt thứ tự ưu tiên tường minh giữa ba nguồn** (đề bài > Mục 0 > phần lý lẽ). Không có quy tắc
  này thì một tác nhân sinh mã gặp hai giá trị khác nhau sẽ chọn giá trị nó đọc sau cùng.
- **Cho mỗi `Q` và mỗi `F` đúng một trạng thái** ở 0.4 và 0.5, kể cả những `F` mà mục 5.3 không nhắc
  tới. Trước đó, im lặng về một `F` có thể hiểu là "đã bỏ qua" hoặc "quên", và không cách nào phân
  biệt.

**Cần nói rõ về phụ lục này:** log vòng một viết "tài liệu lấy chúng làm bốn mục chính" — đúng ở thời
điểm đó. Vòng hai thêm Mục 5, vòng ba thêm Mục 0. Các log giữ nguyên văn theo từng vòng, không sửa
lại cho khớp hiện trạng, vì giá trị của prompt log là ghi đúng những gì đã diễn ra.

**Việc chưa làm ở vòng này:** các mục con của 5.3 vẫn nhóm theo chủ đề chứ không xếp theo số `F` —
đã bù bằng một bảng mục lục đầu mục 5.3 thay vì di chuyển các khối văn bản, để tránh rủi ro sai sót
khi cắt dán. `F26`, `F28`, `F30`, `F31` vẫn là việc tuỳ chọn, chưa có quyết định `D` nào; nếu ban
thiết kế nhận chúng thì phải thêm dòng vào Mục 0.3. Và toàn bộ Mục 0 vẫn chưa được kiểm bằng cách
thật sự sinh mã từ nó — phép thử đúng nghĩa là dựng thử nhóm 1 và nhóm 4 chỉ với đề bài cộng Mục 0,
xem có phải hỏi lại gì không.
