# Kickoff — hỏi gì, hỏi ai

Cần biết ba nhóm: **bài toán** (đề bài, barem) · **nghiệp vụ** (sales làm việc thế nào) ·
**nguồn lực** (ai có bao nhiêu thời gian, ràng buộc gì).

---

## Bốn buổi

| Buổi | Mục tiêu | Ai dự | Ai làm gì |
|---|---|---|---|
| **1 · Phỏng vấn nghiệp vụ** | Hiểu sales làm việc thế nào, đau ở đâu | HanhNT2 ↔ Tung Nguyen | Hanh hỏi · Tùng kể |
| **2 · Workshop brief** | Chốt **vấn đề** trước khi bàn giải pháp | Cả ba | Hanh điều phối · Toàn ghi chép · Tùng cấp nội dung |
| **3 · Workshop PRD** | Chốt **yêu cầu** và tiêu chí đo | Cả ba | như trên |
| **4 · Chốt nguồn lực** | Thời gia n, stack, hạ tầng | HanhNT2 → ToanNH | hỏi thẳng |

Buổi 1 chạy **trước** buổi 2 — để buổi chung không mất thời gian nghe lại thứ một người đã biết.

Khi có đề bài: **cả ba đọc độc lập rồi mới đối chiếu**, tránh một người diễn giải hộ cả nhóm.
      
---

## Hỏi ban tổ chức

- [ ] Đề bài chính xác — chép nguyên văn, không tóm tắt
- [ ] Có được dùng mã nguồn mở / fork dự án có sẵn không?
- [ ] Barem gồm những hạng mục nào, trọng số bao nhiêu?
- [ ] Ai chấm — giám khảo kỹ thuật hay nghiệp vụ?
- [ ] Trình bày bao nhiêu phút, có phần hỏi đáp không?
- [ ] Nộp cái gì — mã nguồn, bản chạy được, slide, video?
- [ ] Triển khai online hay demo local là được?
- [ ] Được dùng dữ liệu thật của công ty không?
- [ ] Có ràng buộc công nghệ bắt buộc không?
- [ ] Hạn nộp chính xác

---

## Hỏi Tung Nguyen — nghiệp vụ

Hỏi được ngay hôm nay. Để câu mở dẫn đường, đừng chen câu đóng vào giữa.

- [ ] **Một ngày làm việc của một sales rep diễn ra thế nào?** — để kể, đừng ngắt
- [ ] Hiện họ dùng công cụ gì — Excel, Zalo, sổ tay, phần mềm nào?
- [ ] Việc gì tốn thời gian nhất mà không tạo ra giá trị?
- [ ] Thông tin nào hay thiếu hoặc sai nhất?
- [ ] Một pipeline thật trông thế nào — mấy giai đoạn, mỗi giai đoạn bao lâu, rơi rụng ra sao?
- [ ] Cấp trên cần thấy gì mà hiện không thấy được?
- [ ] Nếu chỉ được sửa đúng một thứ, sửa gì?
- [ ] Bao nhiêu rep, bao nhiêu khách, khối lượng mỗi ngày?
- [ ] Khách đến từ đâu — gọi điện, email, Zalo, giới thiệu?

Đừng hỏi *"có phải họ ngại nhập liệu không"* — câu đó gợi sẵn đáp án và sẽ nhận lại đúng thứ
mình muốn nghe. Để nó tự hiện ra từ câu mở đầu.

Tùng là chuyên gia nghiệp vụ, không phải người đang nhập liệu hằng ngày. Nếu chạm được một rep
thật thì hỏi lại ba câu giữa.

---

## Hỏi ToanNH — nguồn lực

- [ ] Ba người thực sự có bao nhiêu thời gian?
- [ ] Toàn mạnh phần nào — giao diện hay backend?
- [ ] Có ràng buộc stack từ công ty không?
- [ ] Có ngân sách cho dịch vụ ngoài không — LLM, API trả phí?
- [ ] Hạ tầng sẵn có gì — tài khoản cloud, domain, môi trường triển khai?
- [ ] Sau hackathon sản phẩm có đi tiếp không?
- [ ] Sơ đồ HDN-HUB có bản rõ hơn không, và nó có phải thứ đề bài tham chiếu?
- [ ] Ai trình bày trước giám khảo?

---

## Phải tự đo

- [ ] Cho LLM đọc một nội dung tiếng Việt thật rồi xem tách thực thể có đúng không
- [ ] Dựng thử một CRM mã nguồn mở, xem thêm được trường riêng không

---

## Sau mỗi buổi

Đọc lại cho người vừa trả lời nghe để họ sửa. Không cần biên bản, chỉ cần được gật đầu.

Nếu điều Tùng nói không khớp điều đề bài đòi, hỏi lại — đừng tự chọn bên nào đúng.

---

## Đã chốt

| | |
|---|---|
| **ToanNH** | sponsor · dev · BA — **ghi chép** trong workshop |
| **HanhNT2** | PM · techlead · dev · BA — **điều phối** |
| **Tung Nguyen** | chuyên gia nghiệp vụ · tester duy nhất · BA — **cấp nội dung** |
| Tuần chạy | 10–16/8/2026 |
| Quy trình | BMad Method v6.11.0 + skill `babok-business-analysis` |
| Tài liệu tin được | [`architecture/systems.md`](architecture/systems.md) — khảo sát năm hệ thống thật |

Mang `systems.md` theo buổi 2 và 3: nó là năm cách làm đã chạy được ngoài thực tế, dùng để hỏi
*"cách này có hợp với sales bên mình không"*.

Đừng mang [`architecture/proposal.md`](architecture/proposal.md) và lịch trong
[`plan/`](plan/README.md) — cả hai còn dở, đưa ra sẽ dẫn dắt câu trả lời.
