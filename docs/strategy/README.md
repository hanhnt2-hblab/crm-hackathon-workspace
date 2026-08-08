# Chiến lược phát triển — hackathon CRM

Deadline **2026-08-15**. Bản nháp đầu, viết từ dữ kiện đã có; chỗ nào còn giả định thì đánh ⚠.

---

## 1 · Dữ kiện đầu vào

| Yếu tố | Trạng thái |
|---|---|
| Tiêu chí chấm | Ứng dụng AI **trong quy trình** · Ý tưởng và tính mới · Sản phẩm **chạy được, demo sống** |
| Ràng buộc thời gian | Rất gắt — cần chiến thuật bản tối thiểu chạy được trước, nâng dần theo version |
| Bối cảnh | **Greenfield**, không phải tích hợp hệ thống cũ |
| Stack | **Chưa chốt** — cố ý để mở cho phần sáng tạo |
| Nhân lực | Chia vai theo workflow BMad để tối ưu nguồn lực ⚠ chưa rõ số người viết code |

---

## 2 · Ba tiêu chí xung đột — đây là bài toán thật

Không phải ba mục tiêu song song mà là **ba hướng kéo ngược nhau**:

| Tiêu chí | Kéo về đâu | Rủi ro nếu tối đa hoá |
|---|---|---|
| Demo chạy được | Hẹp, an toàn, ít tính năng | Sản phẩm chạy tốt nhưng nhàm, mất điểm tính mới |
| Ý tưởng và tính mới | Rủi ro, chưa ai làm | Ý tưởng hay nhưng **không kịp chạy** — mất luôn cả hai điểm |
| AI trong quy trình | Đầu tư vào phương pháp | Quy trình đẹp nhưng sản phẩm mỏng |

**Kết luận chiến lược:** không tối đa hoá cái nào. Phân bổ có chủ đích, và **chốt trước ngưỡng
tối thiểu cho từng tiêu chí** thay vì để chúng cạnh tranh nhau lúc đang gấp.

---

## 3 · Lợi thế bất đối xứng: tiêu chí AI-trong-quy-trình gần như đã thắng

Đây là phát hiện quan trọng nhất của tài liệu này.

Phần lớn đội sẽ dùng AI theo kiểu **hỏi đáp rời rạc** — mở chat, hỏi, dán code. Repo này đã có
thứ khác hẳn, và **đã tồn tại trước khi hackathon bắt đầu**:

- Quy trình có cấu trúc 4 phase, 6 bước bắt buộc (BMad v6.10.0)
- Tri thức phân tích nghiệp vụ chuẩn IIBA được **tiêm vào đúng chỗ công cụ khuyết**, có đo đạc
- **Script tự kiểm 7 mục** phát hiện khi công cụ lệch khỏi thiết kế
- Quy ước **phân định nguồn**: mỗi chỉ dẫn ghi rõ đâu là chuẩn, đâu là kinh nghiệm

Chi phí biên để ghi điểm ở tiêu chí này giờ **gần bằng 0** — chỉ cần trình bày lại thứ đã có.

**Hệ quả phân bổ:** đừng đầu tư thêm giờ nào vào phương pháp. Dồn thời gian còn lại cho hai
tiêu chí kia. Nếu có làm gì thêm thì chỉ là **làm cho nó nhìn thấy được**: một trang mô tả quy
trình, vài ảnh chụp `check-install.py` chạy, và bản ghi quyết định (`.memlog.md`) mà BMad tự
sinh ra trong lúc làm.

---

## 4 · Chiến lược đề xuất: thang phiên bản, mỗi bậc demo được

Ý của anh — bản tối thiểu chạy được rồi nâng dần — là đúng. Ghi rõ ra thành nguyên tắc:

> **Mọi bậc phải demo được độc lập.** Không có bậc nào ở trạng thái "gần xong".

```
v0  Xương sống chạy được          ← bảo hiểm. Xong sớm nhất có thể
v1  Điểm khác biệt                ← nơi đặt toàn bộ tính mới
v2  Mở rộng nếu còn thời gian     ← cắt đầu tiên khi trượt lịch
```

| Bậc | Mục đích | Điều kiện hoàn thành |
|---|---|---|
| **v0** | Có cái để demo dù mọi thứ khác đổ vỡ | Một luồng đầu-cuối chạy trên dữ liệu thật, không phải mock |
| **v1** | Ghi điểm tính mới | Thứ mà đội khác không có, chạy được trong demo |
| **v2** | Độ phủ | Cắt được mà không ảnh hưởng v0 và v1 |

**Quy tắc chuyển bậc:** không bắt đầu v1 khi v0 chưa demo được **từ đầu đến cuối, trước mặt
người khác**. Tự mình bấm thử không tính.

Kỹ thuật hỗ trợ: `10.41` Scope Modelling vẽ biên từng bậc · `10.33` Prioritization quyết thứ tự
và **thứ tự cắt** · `10.1` Acceptance Criteria định nghĩa "demo được" cho từng bậc.

---

## 5 · Đặt tính mới ở đâu — câu hỏi khó nhất

**CRM là một hạng mục đã bão hoà.** Không có cách nào mới ở "quản lý khách hàng": pipeline,
lead, deal, báo cáo — mọi thứ đã có hàng chục sản phẩm làm tốt. Cố tìm tính mới **trong tính
năng CRM** là đi vào chỗ không có gì để tìm.

Tính mới phải nằm ở chỗ khác. Ba hướng, xếp theo mức khả thi trong 1 tuần:

| Hướng | Nội dung | Đánh giá |
|---|---|---|
| **A · AI thay đổi thao tác nhập liệu** | Vấn đề kinh điển của CRM là rep không nhập liệu. Nếu AI làm việc đó — từ email, ghi âm cuộc gọi, ảnh danh thiếp — thì nó giải **đúng cái đau thật** | ✅ Khả thi, gắn với nỗi đau có thật |
| **B · AI thay đổi cách đọc dữ liệu** | Hỏi bằng ngôn ngữ tự nhiên thay vì dựng báo cáo | 🟡 Dễ làm nhưng nhiều người làm rồi |
| **C · AI thay đổi quyết định** | Gợi ý hành động tiếp theo, cảnh báo deal sắp nguội | 🟡 Ấn tượng nhưng cần dữ liệu lịch sử — greenfield thì không có |

⚠ **Đây là đánh giá của người viết, chưa kiểm chứng với đề bài và với stakeholder.** Hướng A
mạnh nhất vì nó gắn với limitation có thật của CRM, nhưng phải hỏi trưởng bộ phận sales xem
nỗi đau thật của họ có đúng là nhập liệu không — đừng giả định.

**Về "sản phẩm AI-native":** đây là quyết định lớn chưa chốt. AI-native nghĩa là bỏ AI đi thì
sản phẩm mất lý do tồn tại, chứ không phải gắn thêm nút "hỏi AI". Hướng A đạt tiêu chuẩn đó;
hướng B thì không.

---

## 6 · Stack chưa chốt — tiêu chí chọn, không phải lựa chọn

Cố ý không chốt stack ở đây. Nhưng chốt **tiêu chí**, và thứ tự ưu tiên của chúng:

| # | Tiêu chí | Vì sao xếp ở đây |
|---|---|---|
| 1 | **Thời gian tới v0 chạy được** | Ràng buộc gắt nhất. Stack lạ mà đẹp thì vô nghĩa nếu v0 trượt |
| 2 | **Mức thạo sẵn có của team** | 1 tuần không đủ để học stack mới **và** giao hàng |
| 3 | **Độ dễ tích hợp LLM** | Nếu chọn hướng AI-native thì đây là đường tới hạn |
| 4 | **Demo được trên máy người khác** | Deploy hỏng lúc chấm là mất trắng |
| 5 | Tính mới của bản thân stack | **Xếp cuối.** Ban giám khảo chấm sản phẩm, không chấm stack |

**Cảnh báo:** anh nói phần này *"cần sáng tạo"*. Sáng tạo nên đặt ở **hướng A/B/C** — tức ở bài
toán — chứ không ở stack. Stack mới lạ tiêu thời gian đúng vào chỗ đang thiếu nhất, mà điểm
thưởng gần như bằng 0.

---

## 7 · Phân vai theo workflow BMad

⚠ Chưa rõ số người viết code, nên phần này viết theo **vai**, không theo tên. Điền tên khi rõ:
xem [`docs/roles/`](../roles/).

Ánh xạ vai BABOK `2.4` sang bước BMad:

| Bước BMad | Vai chủ trì | Đầu ra |
|---|---|---|
| `CB` product-brief | BA + Sponsor | Biên phạm vi, thứ tự cắt đã duyệt |
| `PRD` | BA + Domain SME | Thuật ngữ, quy trình, NFR có ngưỡng |
| `CA` architecture | Implementation SME | Spine, ERD, interface |
| `CE` epics & stories | BA + Implementation SME | Backlog theo bậc v0/v1/v2 |
| `IR` readiness | Tester | Cổng kiểm trước khi code |
| `SP`→`CS`→`DS` | Implementation SME | Code |

**Nếu chỉ có một người viết code**, nguyên tắc phân bổ đổi hẳn: không chia việc theo người mà
**chia theo bậc phiên bản**, và dùng agent BMad làm lực lượng song song. Cảnh báo từ `2.4.11`
vẫn áp: gộp BA và Tester thì mất phép kiểm độc lập — bù bằng **cửa kiểm 8 ô** ở
[`steps/architecture.md`](../../.claude/skills/babok-guide/references/steps/architecture.md).

---

## 8 · Điểm dừng cứng

Thứ hay giết đội hackathon không phải thiếu ý tưởng, mà là **code tới phút chót rồi demo hỏng**.

| Mốc | Quy tắc |
|---|---|
| **v0 phải xong sớm** | Trước khi chạm vào v1 |
| **Freeze tính năng** | Ngày cuối **không viết tính năng mới**, chỉ sửa lỗi và chuẩn bị demo |
| **Diễn tập demo thật** | Ít nhất một lần trước mặt người khác, trên máy sẽ dùng lúc chấm |

Ba mốc này không thương lượng. Cắt tính năng để giữ chúng thì được; giữ tính năng mà mất chúng
thì không.

---

## 9 · Tự phản biện

**Lợi thế AI-trong-quy-trình có thể bị chấm thấp hơn kỳ vọng.** Nếu ban giám khảo chỉ nhìn sản
phẩm cuối, mọi đầu tư vào phương pháp thành vô hình. **Cách phòng:** dành đúng một slide hoặc
một trang cho nó — rẻ, và biến thứ vô hình thành thấy được.

**"CRM bão hoà nên tính mới phải ở AI" là suy luận, chưa kiểm chứng.** Nếu đề bài giới hạn ở
một ngách hẹp thì có thể vẫn còn chỗ mới ngay trong nghiệp vụ. Đọc kỹ đề trước khi tin mục 5.

**Thang phiên bản có chi phí ẩn.** Làm v0 thật cẩn thận rồi vứt đi để làm v1 là lãng phí. Giảm
bằng cách để v0 và v1 **dùng chung mô hình dữ liệu** — nên `10.15` Data Modelling phải làm cho
cả ba bậc ngay từ đầu, không làm riêng từng bậc.

**Phần yếu nhất của tài liệu này là mục 5.** Nó dựa trên giả định về nỗi đau của người dùng mà
chưa hỏi ai. Đó là câu hỏi đầu tiên cần đưa cho trưởng bộ phận sales.

---

## Việc cần chốt để viết được plan chi tiết

- [ ] Đọc kỹ đề bài — có giới hạn ngách nào không, có bắt buộc AI-native không
- [ ] Số người viết code → quyết cách chia việc
- [ ] Chọn hướng tính mới trong A/B/C, sau khi hỏi trưởng bộ phận sales về nỗi đau thật
- [ ] Chốt stack theo 5 tiêu chí ở mục 6
- [ ] Định nghĩa "demo được" cho v0 bằng `10.1` Acceptance Criteria

Xong 5 mục này thì viết được **plan triển khai theo ngày** — xem `plan.md` *(chưa có)*.
