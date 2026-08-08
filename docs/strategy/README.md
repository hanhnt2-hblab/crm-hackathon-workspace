# Chiến lược làm bài — hackathon CRM

Deadline **2026-08-15**.

> **Tình huống thật: chưa có đề bài, chưa có barem chấm.** Tài liệu này không phải kế hoạch cho
> một bài toán đã biết. Nó trả lời câu hỏi khác: **chiến lược nào hiệu quả khi thông tin còn rất
> ít**, và làm gì để mỗi mẩu thông tin mới không khiến phải đập đi làm lại.

Khung theo **chương 6 · Strategy Analysis** của BABOK, trọng tâm dồn vào `6.3 Assess Risks` —
task chuyên xử lý bất định:

```
6.1 Analyze Current State ─┐
                           ├─→ 6.4.4.2 Gap ─→ 6.4 Change Strategy
6.2 Define Future State ───┘         ↑
                          6.3 Assess Risks  (bất định → khuyến nghị)
```

`6.3.4.1` bác thẳng cái cớ *"chưa đủ thông tin nên chưa làm được"*:

> *Even when it is not possible to know all that will occur [...] **it is still possible to
> estimate the impact** of unknown or uncertain events.*

Không biết xác suất vẫn ước lượng được **hệ quả** — và hệ quả mới là thứ dẫn tới quyết định.

---

## 1 · Ranh giới giữa biết và đoán

Phân định trước, vì mọi thứ sau đây đứng trên nó.

### Đã biết chắc

| Điều |
|---|
| Deadline **2026-08-15** |
| Chủ đề là CRM |
| Greenfield, không tích hợp hệ thống cũ |
| Có 2 stakeholder tiếp cận được: giám đốc, trưởng bộ phận sales |
| Workspace + quy trình BMad/BABOK đã có sẵn trước hackathon |

### Chưa biết — đây mới là phần quyết định

| Chưa biết | Ảnh hưởng tới |
|---|---|
| **Barem chấm điểm** | Toàn bộ việc phân bổ công sức |
| **Đề bài cụ thể** | Solution scope, có giới hạn ngách không |
| Có bắt buộc AI-native không | Chọn hướng |
| Số người viết code | Cách chia việc, khối lượng khả thi |
| Format nộp: demo sống / slide / repo | Ngày cuối làm gì |
| Nỗi đau thật của sales | Hướng tính mới |

### Đang giả định — phát biểu lại thành rủi ro theo `6.3.4.2`

BABOK nói giả định *"can be restated as a risk by identifying the event or condition and
consequences"*. Làm đúng như vậy:

| Giả định | Nếu sai thì hệ quả gì |
|---|---|
| Barem có mục "ứng dụng AI trong quy trình" | Mọi đầu tư vào workspace thành vô hình khi chấm |
| Barem coi trọng sản phẩm chạy được | Chiến thuật v0-trước có thể không tối ưu |
| CRM là hạng mục bão hoà, tính mới phải ở AI | Bỏ lỡ chỗ mới ngay trong nghiệp vụ |
| Nỗi đau của sales là nhập liệu | Chọn sai hướng, giải bài không ai cần |
| Team đủ người cho hướng đã chọn | Cam kết quá sức, không kịp |

⚠ **Bảng này quan trọng hơn phần đề xuất bên dưới.** Đề xuất sẽ đổi khi có đề bài; các rủi ro
này thì không.

---

## 2 · Ba nguyên tắc chọn chiến lược khi thiếu thông tin

### 2a · Ưu tiên nước đi không hối tiếc

Việc **có giá trị dù barem thế nào** thì làm ngay, không chờ:

| Việc | Vì sao đúng với mọi barem |
|---|---|
| Chốt từ vựng nghiệp vụ với trưởng sales (`10.11`) | Là đầu vào của mọi thứ phía sau |
| Mô tả quy trình bán hàng hiện tại (`10.35` as-is) | `6.4.4.2` đòi current state dù đi hướng nào |
| Dựng xương sống chạy được sớm | Đúng với mọi barem có chấm sản phẩm |
| Làm cho quy trình AI đã dùng **nhìn thấy được** | Rẻ, và cứu được nếu barem có mục đó |

Đây là chỗ đổ công sức **ngay bây giờ**, trước khi biết đề.

### 2b · Giữ cửa mở, quyết muộn nhất có thể

Quyết định **đắt khi sai, rẻ khi hoãn** thì hoãn:

| Quyết định | Hoãn tới | Hạn chót |
|---|---|---|
| Chốt stack | Biết đề bài | Ngay trước khi code v0 |
| Chọn hướng tính mới | Sau khi hỏi trưởng sales | Sau buổi gặp |
| Phạm vi v1, v2 | Sau khi v0 chạy được | — |

Ngược lại, quyết định **rẻ khi sai** thì chốt sớm để khỏi tốn thời gian bàn.

### 2c · Mua thông tin trước khi mua giải pháp

Rẻ nhất là **giảm bất định**, không phải chuẩn bị cho mọi khả năng:

| Hành động | Chi phí | Xoá bất định nào |
|---|---|---|
| **Hỏi ban tổ chức barem và format nộp** | Gần bằng 0 | **Cái lớn nhất** |
| Đọc kỹ đề khi công bố | Thấp | Solution scope |
| Một câu hỏi mở cho trưởng sales | Một buổi | Nỗi đau thật |
| Xác nhận số người viết code | Một tin nhắn | Khối lượng khả thi |

⚠ Hàng đầu có tỷ lệ giá trị trên chi phí cao nhất trong cả tài liệu, và **chưa ai làm**.

---

## 3 · Khẩu vị rủi ro — `6.3.4.4`

Cùng một bảng so sánh sẽ cho lựa chọn khác nhau tuỳ thái độ rủi ro:

| Thái độ | BABOK định nghĩa | Với hackathon nghĩa là |
|---|---|---|
| **Risk-aversion** | Đầu tư thêm để giảm rủi ro, chấp nhận giá trị tiềm năng thấp hơn | CRM cơ bản chắc chắn chạy, bỏ tính mới |
| **Neutrality** | Chấp nhận rủi ro miễn không dẫn tới mất trắng | v0 an toàn + v1 có tính mới |
| **Risk-seeking** | Nhận nhiều rủi ro đổi lấy giá trị cao hơn | Dồn hết vào ý tưởng táo bạo |

⚠ **Chưa hỏi ai.** Đây là biến ẩn: giám đốc risk-averse mà team risk-seeking thì xung đột nổ ra
giữa tuần, lúc không còn thời gian sửa.

Nhưng `6.3.4.4` có quy tắc thoát hiểm áp cho mọi thái độ:

> *the **highest level risks are dealt with no matter what** the risk tolerance level.*

Với hackathon, rủi ro cao nhất là **không có gì để demo**. Nên dù khẩu vị nào, v0 vẫn phải xong
trước — đó không phải lựa chọn chiến lược mà là **điều kiện**.

---

## 4 · Ba kịch bản barem, và điều gì chung cho cả ba

Thay vì một đề xuất, chuẩn bị **bảng phân bổ** và điều kiện kích hoạt:

| Nếu barem nghiêng về… | Dồn công vào | Cắt bớt |
|---|---|---|
| **Sản phẩm chạy được** | Độ phủ tính năng CRM cơ bản, luồng demo mượt | Tính mới, tài liệu |
| **Ý tưởng và tính mới** | Một hướng làm thật tốt, kể chuyện rõ | Độ phủ tính năng |
| **Quy trình và kỹ thuật** | Trình bày workspace, tài liệu, kiến trúc | Số lượng tính năng |

**Điểm chung của cả ba: v0 chạy được.** Nên bắt đầu bằng v0 là đúng trong mọi kịch bản — đây là
kết luận **vững nhất** của tài liệu, vì nó không phụ thuộc barem.

### Ba hướng tính mới, để loại dần chứ chưa phải để chọn

⚠ Giả định nền: *CRM là hạng mục bão hoà nên tính mới phải ở chỗ AI thay đổi điều gì.* **Chưa
kiểm chứng** — đọc đề bài trước khi tin.

| | Hướng | Chi phí | Rủi ro chính |
|---|---|---|---|
| **A** | AI làm việc **nhập liệu** — email, ghi âm, ảnh danh thiếp | Vừa | Nếu nỗi đau không phải nhập liệu thì trượt |
| **B** | Hỏi dữ liệu bằng **ngôn ngữ tự nhiên** | Thấp | Nhiều đội làm, khó khác biệt |
| **C** | Gợi ý hành động, cảnh báo deal nguội | Cao | Greenfield không có dữ liệu lịch sử |

Sáu tiêu chí chọn của `6.4.4.4` — organizational readiness · costs · timelines · alignment ·
value realization · **opportunity cost** — chỉ dùng được **sau khi** biết nỗi đau thật. Chưa
biết mà so thì chỉ là xếp giả định cạnh nhau.

`6.2.4.2` nhắc solution space rộng hơn công nghệ: nếu nỗi đau là *rep không nhập liệu* thì **đổi
chính sách** (bắt buộc nhập, gắn KPI) cũng là một phương án. Cả ba hướng trên đều là giải pháp
công nghệ — tức tập đang bị thu hẹp sẵn mà chưa ai quyết là thu hẹp.

---

## 5 · Thang phiên bản — `6.4.4.5`

BABOK gọi là **transition states**: trạng thái đích thường đạt dần qua thời gian chứ không qua
một lần thay đổi. Release planning là *quyết định yêu cầu nào vào release nào* — tức thang phiên
bản là quyết định **phạm vi**, không phải kỹ thuật.

```
v0  Xương sống chạy được       ← đúng trong mọi kịch bản barem
v1  Điểm khác biệt             ← chọn sau khi biết đề và nỗi đau
v2  Mở rộng                    ← cắt đầu tiên
```

> **Mọi bậc demo được độc lập.** Không bắt đầu bậc sau khi bậc trước chưa demo được **trước mặt
> người khác**.

Thang này cũng chính là công cụ **giảm rủi ro**: nó biến *"làm xong hay không"* thành *"làm được
tới bậc nào"* — hỏng ở đâu vẫn còn thứ để nộp.

**Chi phí ẩn:** làm v0 cẩn thận rồi vứt để làm v1 là lãng phí. Để v0 và v1 **dùng chung mô hình
dữ liệu** — `10.15` Data Modelling làm cho cả ba bậc ngay từ đầu.

---

## 6 · Stack — tiêu chí, không phải lựa chọn

Chưa chốt là **đúng**, không phải thiếu sót — xem nguyên tắc `2b`.

| # | Tiêu chí | Vì sao |
|---|---|---|
| 1 | Thời gian tới v0 chạy được | Ràng buộc gắt nhất, đúng với mọi barem |
| 2 | Mức thạo sẵn có | `6.2.4.3` gọi đây là constraint chính thức — *restrictions based on the skills of the team* |
| 3 | Độ dễ tích hợp LLM | Nếu hướng AI được chọn thì đây là đường tới hạn |
| 4 | Demo được trên máy người khác | Deploy hỏng lúc chấm là mất trắng |
| 5 | Tính mới của bản thân stack | **Cuối** — chấm sản phẩm, không chấm stack |

`6.2.4.3` đòi mọi ràng buộc phải *"carefully examined to ensure that they are accurate and
justified"* — *"phải dùng stack X"* có thể chỉ là thói quen.

---

## 7 · Điểm dừng cứng

Đúng với mọi barem, nên chốt ngay bây giờ:

| Mốc | Quy tắc |
|---|---|
| v0 xong sớm | Trước khi chạm vào v1 |
| **Freeze tính năng** | Ngày cuối không viết tính năng mới |
| Diễn tập demo thật | Ít nhất một lần trước mặt người khác, trên máy sẽ dùng lúc chấm |

Cắt tính năng để giữ ba mốc này thì được; giữ tính năng mà mất chúng thì không.

---

## 8 · Tự phản biện

**Tài liệu này có thể đang tối ưu cho một barem tưởng tượng.** Ba kịch bản ở mục 4 là phỏng đoán.
Phòng bằng mục `2a` — chỉ làm việc đúng với mọi barem — và mục `2c` — ưu tiên đi hỏi thay vì đoán.

**Chuẩn bị ba kịch bản có chi phí.** Nếu barem công bố sớm thì hai kịch bản còn lại là lãng phí.
Nhưng chi phí thấp vì mục 4 mới là **bảng phân bổ**, chưa phải công việc thật.

**Nguyên tắc "quyết muộn" có giới hạn.** Hoãn quá thì không kịp làm. Hạn chót đã ghi trong bảng
`2b`; quá mốc đó thì chọn bừa còn hơn tiếp tục chờ.

**Phần yếu nhất vẫn là mục 4.** Nó đứng trên giả định về nỗi đau chưa hỏi ai và về barem chưa ai
biết. Đọc nó như **danh sách để loại dần**, không phải như khuyến nghị.

---

## Việc tiếp theo — xếp theo tỷ lệ giá trị trên chi phí

1. **Hỏi ban tổ chức barem và format nộp** — rẻ nhất, xoá bất định lớn nhất
2. **Xác nhận số người viết code** — một tin nhắn
3. **Hỏi trưởng sales một câu mở**: *"việc gì trong ngày làm anh mất thời gian nhất mà đáng ra
   không nên?"* — hỏi mở, đừng mớm
4. Hỏi giám đốc **khẩu vị rủi ro** và ai duy trì sau hackathon
5. Bắt đầu nhóm `2a` — những việc đúng với mọi barem

Ba việc đầu **không cần đề bài**. Làm xong thì tài liệu này viết lại được thành kế hoạch thật.

Nguyên văn chương 6 lưu ở `PARA\3_Resources\ba\babok-v3\`: `analyze-current-state` ·
`define-future-state` · `assess-risks` · `define-change-strategy`.
