# Chiến lược ngày thi — 15/08/2026

Đội hai dev cộng một Sales Manager. Quỹ giờ được chấm: **9:30–12:00 và 13:00–15:00**, nộp lúc 15:00.

Tài liệu này nói **thứ tự làm và vì sao**. Nó không chốt lại chi tiết kỹ thuật nào — những thứ đó
nằm ở Mục 0 của [Phản biện và phân tích yêu cầu](Đề%20bài/Phản%20biện%20và%20phân%20tích%20yêu%20cầu.md)
dưới dạng `D1`–`D41`. Chỗ nào hai bên nói khác nhau thì Mục 0 đúng.

---

## 1. Ba vòng, ba thước đo khác nhau

Sai lầm đắt nhất là tưởng cuộc thi chấm một thứ.

| Vòng | Ai chấm | Chấm cái gì | Loại ai |
|---|---|---|---|
| **1** · 15:00–15:30 | **Hệ thống AI**, tự động | **Log Claude Code ngày 15/8** đối chiếu checklist | Giữ **top 5** |
| **2** · 15:40–17:10 | BGK + AI | **3–5 câu hỏi bốc ngẫu nhiên từ log của chính đội** | Giữ **top 3** |
| **3** · 17:10– | **Đội Sales**, góc end-user | Tính năng, theo checklist riêng công bố sau | Xếp giải |

Ba thước đo này thưởng ba thứ khác nhau, và **chúng chống nhau ở chỗ then chốt**: vòng 1 thưởng
khối lượng dấu vết dùng AI, vòng 2 phạt đúng phần dấu vết mà đội không hiểu (`F39`). Cùng một hành
động cho điểm ở vòng này và trừ ở vòng sau.

Suy ra thứ tự ưu tiên tuyệt đối, không thương lượng:

> **Không có log ngày 15/8 thì trượt vòng 1, và sản phẩm hoàn hảo đến mấy cũng không ai nhìn tới.**

Thể lệ ghi thẳng: *"không có log bằng không có điểm và không qua được vòng 1"*. Nên trong ngày thi,
**sinh đủ năm vệt log thắng việc hoàn thiện sản phẩm** — không phải vì sản phẩm không quan trọng, mà
vì vòng 1 loại người trước khi có ai mở sản phẩm ra xem.

---

## 2. Suy ngược từ 15:00

Nước đi tương lai của người chấm không phải điều bất định — dự đoán từ luật rồi tỉa nhánh.

```
15:00 nộp
  └── AI đọc log ngày 15/8, đối chiếu checklist 5 cột
        └── mỗi cột cần một phiên làm việc có thật trong ngày
              └── mà artifact chuẩn bị sẵn từ 13–14/8 KHÔNG sinh log ngày 15/8
                    └── nên mỗi cột phải có một việc thật để làm lại trong ngày
```

Hai thứ cấp cho ta đúng cái "việc thật" đó, và cả hai đều do BTC phát vào sáng 15/8:

- **Dữ liệu thật** — buộc phải sửa lớp ánh xạ, chạy lại kiểm thử, sửa cái vỡ.
- **Một tính năng mới chưa ai biết** (`F40`) — buộc chạy đủ vòng phân tích → thiết kế → mã → kiểm
  thử → triển khai.

Tính năng phát thêm **không phải phiền toái, nó là phương tiện**. BTC nói rõ mục đích: *"để cho các
đội trải đủ các bước"*. Nó tồn tại để bịt đúng lỗ hổng `F23` — đội chuẩn bị kỹ quá sẽ không còn gì
để sinh log ở hai cột Requirement Analysis và System Design, cộng lại **40 điểm**.

**Hệ quả:** chuẩn bị xong hết trước ngày thi không phải lợi thế. Thứ phân định là **tốc độ chạy trọn
một vòng trên một yêu cầu chưa từng thấy** (`D41`).

---

## 3. Cột barem chạy bằng engine nào

| Cột | Điểm | Engine | Sinh log bằng |
|---|---|---|---|
| Requirement Analysis | 20 | BMad `PRD` · `CE` · advanced-elicitation | Phân tích tính năng mới trong ngày |
| System Design | 20 | BMad `CA` architecture · `CU` ux | Thiết kế tính năng mới trong ngày |
| Development | 25 | BMad `BD` build · `CR` code-review | Cài đặt tính năng mới |
| Testing | 20 | BMad **`QA` bmad-qa-generate-e2e-tests** | Sinh e2e test cho tính năng mới |
| **Deployment** | **15** | **BMad không có** → `hackathon-deploy` + 4 skill mượn | Dựng lại bản production trên dữ liệu thật |

**Cột Deployment là chỗ duy nhất BMad để trống.** Bảng lệnh `_bmad/bmm/module-help.csv` chỉ có bốn
phase `plan · 2-planning · ship · anytime`, không phase nào dẫn tới triển khai, không skill nào sinh
artifact triển khai. Đã bù bằng bốn skill từ `addyosmani/agent-skills` cộng một lớp thuế dự án —
chi tiết ở [`.claude/skills/hackathon-deploy/SKILL.md`](../.claude/skills/hackathon-deploy/SKILL.md).

Lưu ý về `QA`: skill sinh e2e test **đã có sẵn trong bản cài**, tên dài nên dễ bỏ sót. Đừng tự viết
lại.

---

## 4. Lịch ngày thi

Hai dev chạy song song theo cột, Sales dùng thử liên tục. Đây là hình dạng, không phải hợp đồng —
tính năng BTC phát có thể to hơn dự tính, xem mục 5.

| Giờ | Dev A | Dev B | Sales |
|---|---|---|---|
| 9:00–9:30 | Khai mạc | | |
| **9:30–9:45** | **Kiểm log Grafana chảy thật — cả hai, trước mọi việc khác** (`D37`) | | Đọc tính năng mới |
| 9:45–10:30 | Nạp dữ liệu BTC, sửa lớp ánh xạ (`D32`) | **Phân tích tính năng mới** → cột RA | Dùng thử bản hiện có, ghi chỗ vô lý |
| 10:30–11:15 | Chạy `T-1`…`T-10` trên dữ liệu thật, sửa cái vỡ | **Thiết kế tính năng mới** → cột SD | tiếp |
| 11:15–12:00 | **Cài đặt tính năng mới** → cột Dev | Review, ghi lý do quyết định | tiếp |
| 12:00–13:00 | Nghỉ trưa | | |
| 13:00–13:45 | **Sinh e2e test** → cột Testing | Sửa nốt tính năng mới | Dùng thử lần hai |
| 13:45–14:30 | **Dựng lại bản production** → cột Deployment | Đối soát `§7` năm điều kiện | |
| 14:30–14:50 | **Chạy trọn bộ trên một bản clone sạch** | | |
| 14:50–15:00 | Nộp | | |

Ba điểm dừng bắt buộc:

- **9:45** — log chưa lên Grafana thì **dừng mọi việc khác** cho tới khi lên. Đây là điều kiện tiên
  quyết của vòng 1, không phải hạng mục phụ.
- **12:00** — chưa có vệt log cho RA và SD thì buổi chiều không đủ chỗ. Cắt phạm vi tính năng mới
  xuống mức nhỏ nhất còn chạy được, đừng cắt bước.
- **14:30** — dừng viết mã. Nửa tiếng cuối chỉ để đối soát và nộp.

---

## 5. Cắt gì khi hết giờ

**Không được cắt theo nhóm tính năng.** Mười điểm nghiệm thu `T-1`…`T-10` phủ kín cả sáu nhóm — bỏ
nhóm nào cũng rụng một `T`, mà `T` là cổng chứ không phải điểm. Cắt chỉ có thể là **hạ độ sâu trong
từng nhóm xuống đúng mức `T` quan sát được**.

Thứ tự bỏ, từ rẻ nhất tới đắt nhất:

1. Việc "nếu còn thời gian" ở mục 5.6 tài liệu phản biện — bỏ trước, không tiếc.
2. Độ hoàn thiện giao diện của tính năng mới — miễn nó chạy và có `T` phủ.
3. Bậc 4 của cột Deployment (cảnh báo AIOps) — giữ bậc 1–3, vẫn được 75% của 15 điểm.
4. Phạm vi tính năng mới — làm phần lõi, ghi rõ phần đã cắt và vì sao.

**Không bao giờ cắt:** năm vệt log, năm điều kiện `§7.3`, và lệnh nạp dữ liệu `§7.5`.

Kiểu cắt tệ nhất, đã cảnh báo ở `CHECKLIST.md`: vẫn nói là "có" nhưng bên trong hỏng. Cắt thì ghi
vào bảng, và nói ra ở phần trình bày — vòng 2 hỏi được thì trả lời được.

---

## 6. Ba cái bẫy

**Bẫy 1 — tối ưu khối lượng log.** Vòng 2 bốc **ngẫu nhiên** 3–5 câu từ log. Không chuẩn bị chọn
lọc được, và nó chỉ cắn khi đã vào top 5, tức đúng lúc đang thắng. Quy tắc `D40`: **mọi đầu ra AI
giữ lại phải có một người đọc và nói được lý do trong một câu; nói không được thì bỏ.** Hệ quả về
phạm vi: bề mặt mã tối đa bằng bề mặt hai người đọc kịp, không bằng bề mặt AI sinh kịp.

**Bẫy 2 — tưởng chuẩn bị nhiều là hơn.** BTC đã phản ứng đúng kiểu: thấy các đội xong sớm thì thêm
tính năng phát tại chỗ. Thứ dễ bù trừ — khối lượng log — sẽ bị san bằng giữa các đội. Thứ **không**
bù trừ được là công cụ có thật trong repo với lịch sử commit, và khả năng trả lời vấn đáp. Đầu tư
vào đó.

**Bẫy 3 — đặt phạm vi theo mong muốn.** Giả định phạm vi bạn định làm là vừa đủ 4,5 tiếng, rồi hỏi
điều đó hàm ý gì về tốc độ của đội. Đội đặt phạm vi tham vọng nhất chính là đội ước lượng sai nhiều
nhất.

---

## 7. Việc phải xong trước ngày thi

| # | Việc | Vì sao trước |
|---|---|---|
| 1 | **Log Claude Code → Grafana chạy thật, kiểm bằng một lần chạy và nhìn bảng** | Sáng 15/8 mà hỏng thì mất cả vòng 1 |
| 2 | **Chốt stack cho `src/`** | Ba cột Dev/Testing/Deployment không khởi động được khi chưa có |
| 3 | Lớp ánh xạ dữ liệu tách mỏng (`D32`) | Sáng 15/8 chỉ phải sửa một lớp |
| 4 | Bốn lệnh một-bước: khởi động · nạp dữ liệu · kiểm thử · dừng | `§7.3` và `§7.5` là cổng nộp bài |
| 5 | **Tập một vòng đầy đủ trên một yêu cầu nhỏ tự nghĩ ra** (`D41`) | Đo xem một vòng mất bao lâu, nghẽn ở đâu — thứ thật sự phân định |
| 6 | Gửi bộ câu hỏi cho [ban giám khảo vòng 3](Đề%20bài/Câu%20hỏi%20cho%20ban%20giám%20khảo%20vòng%203.md) | Câu `B3` đóng `Q10` bằng số lấy từ chính người chấm |

Việc 5 là việc dễ bỏ qua nhất và đáng giá nhất. Nó không thêm một tính năng nào cho sản phẩm — nên
cảm giác như lãng phí. Nhưng ngày thi không thưởng sản phẩm đã xong, nó thưởng **một vòng chạy đủ
năm bước trên thứ chưa ai thấy bao giờ**, và đó là kỹ năng phải tập chứ không phải đọc.
