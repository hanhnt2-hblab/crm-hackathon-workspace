# Chiến lược phát triển — hackathon CRM

Deadline **2026-08-15**. Bản nháp; chỗ nào còn giả định thì đánh ⚠.

Tài liệu này theo khung **BABOK `6.4` Define Change Strategy** — task chuyên về việc chọn cách
triển khai một thay đổi. Năm phần dưới ánh xạ đúng năm element `6.4.4`.

> `6.4.1` định nghĩa mục đích là *develop and assess **alternative approaches**, then select the
> recommended approach* — **số nhiều**. Một tài liệu chỉ đưa một phương án là chưa làm đúng task
> này, dù phương án đó tốt.

---

## 0 · Dữ kiện đầu vào

| Yếu tố | Trạng thái |
|---|---|
| Tiêu chí chấm | Ứng dụng AI **trong quy trình** · Ý tưởng và tính mới · Sản phẩm **chạy được, demo sống** |
| Ràng buộc | Thời gian rất gắt — cần bản tối thiểu chạy được rồi nâng dần theo version |
| Bối cảnh | **Greenfield** |
| Stack | **Chưa chốt** — cố ý để mở |
| Nhân lực | Chia vai theo workflow BMad ⚠ chưa rõ số người viết code |

---

## 1 · Solution Scope — `6.4.4.1`

BABOK đòi mô tả biên **đủ chi tiết để stakeholder hiểu năng lực mới nào sẽ được giao**, và nói
rõ phạm vi **có thể tiến hoá** khi biết thêm thông tin. Cũng khuyến khích ghi cả phần
**out-of-scope** để rõ ràng.

⚠ **Chưa điền được.** Cần đề bài và buổi làm việc với stakeholder. Đây là ô trống lớn nhất của
tài liệu.

Khi điền, dùng `10.41` Scope Modelling, và ghi **cả hai cột**:

| Trong phạm vi | Ngoài phạm vi (ghi rõ để khỏi tranh cãi) |
|---|---|
| | |

---

## 2 · Gap Analysis — `6.4.4.2`

BABOK đặt một điều kiện tiên quyết dễ bị bỏ: gap analysis đòi **cả** current state **và** future
state được định nghĩa trước, và khuyên **dùng cùng một kỹ thuật** để mô tả hai bên cho dễ so.

→ Đây chính là lý do `10.35` Process Modelling phải làm **as-is và to-be, hai lần, cùng một
notation**. Không phải hình thức.

⚠ Greenfield nên "current state" ở đây là **cách sales đang làm việc hiện nay** — Excel, sổ tay,
trí nhớ — chứ không phải hệ thống cũ. Vẫn phải mô tả, vì không có nó thì không có gap.

---

## 3 · Enterprise Readiness Assessment — `6.4.4.3`

BABOK hỏi câu mà đội kỹ thuật hay quên: không chỉ *"có làm được không"* mà **"làm xong có duy
trì được không"**, kèm **cultural readiness** của stakeholder.

**Với CRM đây là câu hỏi sống còn.** Sản phẩm chạy được nhưng sales không chịu dùng thì giá trị
bằng không — và đó là cách phần lớn dự án CRM thất bại.

| Câu hỏi | Hỏi ai |
|---|---|
| Sales có sẵn sàng đổi cách làm việc không | Trưởng bộ phận sales |
| Ai duy trì sau hackathon, hay đây là bản demo rồi bỏ | Giám đốc |
| Nếu công cụ đòi nhập liệu nhiều hơn hiện tại, họ có làm không | Trưởng bộ phận sales |

⚠ Câu thứ ba là phép thử thẳng vào hướng tính mới ở mục 4.

---

## 4 · Change Strategy — `6.4.4.4` · phần trọng tâm

### 4a · Ba tiêu chí chấm kéo ngược nhau

| Tiêu chí | Kéo về đâu | Rủi ro nếu tối đa hoá |
|---|---|---|
| Demo chạy được | Hẹp, an toàn | Chạy tốt nhưng nhàm, mất điểm tính mới |
| Ý tưởng và tính mới | Rủi ro | Hay nhưng **không kịp chạy** — mất cả hai điểm |
| AI trong quy trình | Đầu tư phương pháp | Quy trình đẹp, sản phẩm mỏng |

Không tối đa hoá cái nào. Chốt **ngưỡng tối thiểu cho từng cái** trước, thay vì để chúng cạnh
tranh lúc đang gấp.

### 4b · Lợi thế bất đối xứng đã có sẵn

Tiêu chí **AI-trong-quy-trình gần như đã thắng**: workspace này tồn tại **trước** hackathon, với
quy trình 4 phase, tri thức IIBA tiêm vào đúng chỗ đo được là khuyết, và script tự kiểm 7 mục.
Phần lớn đội sẽ dùng AI kiểu hỏi-đáp rời rạc.

Chi phí biên để ghi điểm ở đây **gần bằng 0** — chỉ cần làm cho nó nhìn thấy được. Nên **đừng
đầu tư thêm giờ nào vào phương pháp**; dồn cho hai tiêu chí kia.

### 4c · Ba phương án — `6.4.4.4` đòi có tập lựa chọn

**CRM là hạng mục bão hoà.** Tìm cái mới trong tính năng CRM là đi vào chỗ trống. Tính mới phải
nằm ở chỗ AI thay đổi điều gì.

| | Phương án | Nội dung |
|---|---|---|
| **A** | AI làm việc **nhập liệu** | Bóc lead từ email, ghi âm cuộc gọi, ảnh danh thiếp |
| **B** | AI thay đổi cách **đọc** dữ liệu | Hỏi bằng ngôn ngữ tự nhiên thay vì dựng báo cáo |
| **C** | AI thay đổi **quyết định** | Gợi ý hành động tiếp, cảnh báo deal nguội |

### 4d · So sánh theo sáu tiêu chí của `6.4.4.4`

BABOK liệt kê đúng sáu tiêu chí chọn phương án. Dùng nguyên si:

| Tiêu chí `6.4.4.4` | A · Nhập liệu | B · Đọc dữ liệu | C · Quyết định |
|---|---|---|---|
| Organizational readiness | ✅ Giảm việc cho sales → dễ chấp nhận | 🟡 Trung tính | 🟡 Cần tin vào gợi ý của máy |
| Costs and investments | 🟡 Cần xử lý đa phương tiện | ✅ Rẻ nhất | ❌ Cần dữ liệu huấn luyện |
| Timelines to make the change | 🟡 Vừa | ✅ Nhanh nhất | ❌ Lâu nhất |
| Alignment to business objectives | ✅ Giải đúng nỗi đau kinh điển của CRM | 🟡 Tiện nhưng không giải đau | ✅ Nếu chạy được thì giá trị cao |
| Timelines for value realization | ✅ Thấy ngay lần nhập đầu | ✅ Thấy ngay | ❌ Cần tích luỹ dữ liệu |
| **Opportunity cost** | Mất phần trình diễn "hỏi đáp thông minh" — thứ dễ gây ấn tượng lúc demo | Mất phần giải nỗi đau thật | Mất cả hai, đổi lấy rủi ro cao |
| **AI-native thật?** | ✅ Bỏ AI đi thì sản phẩm mất lý do tồn tại | ❌ Chỉ là nút "hỏi AI" gắn thêm | ✅ |

**Đề xuất: A**, vì thắng ở bốn trong sáu tiêu chí và là phương án duy nhất vừa AI-native vừa
giải nỗi đau có thật.

⚠ **Opportunity cost của A phải nói rõ:** bỏ đi phần hỏi-đáp thông minh — thứ **dễ gây ấn tượng
nhất trong 3 phút demo**. Nếu ban giám khảo chấm theo cảm giác lúc demo hơn là theo giá trị
nghiệp vụ, thì B có thể thắng dù yếu hơn về bản chất. Cân nhắc **A làm lõi, B làm lớp mỏng ở
v2** để lấy cả hai.

⚠ **Toàn bộ mục 4c–4d dựa trên giả định về nỗi đau, chưa hỏi ai.** Câu đầu tiên cho trưởng bộ
phận sales: *"việc gì trong ngày làm anh mất thời gian nhất mà đáng ra không nên?"* — hỏi mở,
đừng mớm "có phải nhập liệu không".

---

## 5 · Transition States và Release Planning — `6.4.4.5`

BABOK nói trạng thái đích thường **đạt dần qua thời gian chứ không qua một lần thay đổi**, nên
tổ chức phải vận hành ở **một hoặc nhiều transition state**. Release planning được định nghĩa là
**quyết định yêu cầu nào vào release nào** — tức thang phiên bản là quyết định **phạm vi**, không
phải quyết định kỹ thuật.

Đây là nền lý thuyết cho ý bản-tối-thiểu-rồi-nâng-dần.

```
v0  Xương sống chạy được          ← transition state đầu. Bảo hiểm
v1  Điểm khác biệt (phương án A)  ← nơi đặt toàn bộ tính mới
v2  Mở rộng (lớp B mỏng)          ← cắt đầu tiên khi trượt lịch
```

> **Mọi bậc phải demo được độc lập.** Không bậc nào ở trạng thái "gần xong".
> Không bắt đầu bậc sau khi bậc trước chưa demo được **trước mặt người khác**.

Các yếu tố `6.4.4.5` nêu để quyết release, áp vào đây: **deadline** (gắt nhất) · **resource
constraints** (⚠ chưa rõ số người) · **ability to absorb changes** (sales quen được bao nhiêu
thay đổi một lúc).

**Chi phí ẩn cần giảm:** làm v0 cẩn thận rồi vứt để làm v1 là lãng phí. Để v0 và v1 **dùng chung
mô hình dữ liệu** — `10.15` Data Modelling làm cho cả ba bậc **ngay từ đầu**.

---

## 6 · Stack — tiêu chí, không phải lựa chọn

Cố ý không chốt stack. Chốt **tiêu chí và thứ tự ưu tiên**:

| # | Tiêu chí | Vì sao xếp ở đây |
|---|---|---|
| 1 | Thời gian tới v0 chạy được | Ràng buộc gắt nhất |
| 2 | Mức thạo sẵn có | 1 tuần không đủ để học stack mới **và** giao hàng |
| 3 | Độ dễ tích hợp LLM | Nếu chọn A thì đây là đường tới hạn |
| 4 | Demo được trên máy người khác | Deploy hỏng lúc chấm là mất trắng |
| 5 | Tính mới của bản thân stack | **Cuối.** Ban giám khảo chấm sản phẩm, không chấm stack |

⚠ Sáng tạo nên đặt ở **bài toán** (mục 4c), không ở stack. Stack lạ tiêu thời gian đúng chỗ đang
thiếu nhất mà điểm thưởng gần bằng 0.

---

## 7 · Điểm dừng cứng

| Mốc | Quy tắc |
|---|---|
| v0 xong sớm | Trước khi chạm vào v1 |
| **Freeze tính năng** | Ngày cuối không viết tính năng mới, chỉ sửa lỗi và chuẩn bị demo |
| Diễn tập demo thật | Ít nhất một lần trước mặt người khác, trên máy sẽ dùng lúc chấm |

Không thương lượng. Cắt tính năng để giữ ba mốc này thì được; giữ tính năng mà mất chúng thì không.

---

## 8 · Tự phản biện

**Lợi thế AI-trong-quy-trình có thể bị chấm thấp hơn kỳ vọng** nếu ban giám khảo chỉ nhìn sản
phẩm cuối. Phòng bằng đúng một trang trình bày — rẻ, biến thứ vô hình thành thấy được.

**"CRM bão hoà nên tính mới phải ở AI" là suy luận, chưa kiểm chứng.** Đọc kỹ đề trước khi tin
mục 4c.

**Mục 1 và 2 đang trống** — mà `6.4.4.2` nói rõ gap analysis đòi cả hai trạng thái được định
nghĩa trước. Nghĩa là tài liệu này **chưa hoàn chỉnh theo chính khung nó dùng**, và phần thiếu
chỉ điền được sau buổi làm việc với stakeholder.

---

## Việc cần chốt để viết `plan.md`

- [ ] Đọc kỹ đề bài — có giới hạn ngách không, có bắt buộc AI-native không
- [ ] Số người viết code → quyết cách chia việc và `resource constraints` ở mục 5
- [ ] Hỏi trưởng bộ phận sales nỗi đau thật → xác nhận hoặc bác phương án A
- [ ] Điền mục 1 Solution Scope và mục 2 Gap Analysis
- [ ] Chốt stack theo 5 tiêu chí mục 6
- [ ] Định nghĩa "demo được" cho v0 bằng `10.1` Acceptance Criteria

Nguyên văn `6.4` lưu ở kho cá nhân `PARA\3_Resources\ba\babok-v3\define-change-strategy.md`.
