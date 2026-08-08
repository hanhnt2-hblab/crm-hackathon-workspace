# Bước `CB` — Product Brief

Bắt buộc chạy **trước** `PRD` (`bmad-prd` có `preceded-by: bmad-product-brief`).

Toàn bộ luồng: [`../workflow.md`](../workflow.md)

## BMad khuyết gì ở bước này

Đo trên bản cài v6.10.0, 234 file, ngày 2026-08-08:

| Khái niệm | File | |
|---|---|---|
| `document analysis` | 2 | **absent** |
| Kỹ thuật khai thác người thật trong catalog 71 method | **0** | **absent** |

BMad làm tốt phần phát ý (`bmad-forge-idea`, `bmad-brainstorming` — `brainstorm` 20 file).
**Không can thiệp phần đó.**

## Bù bằng gì

**Document Analysis `10.18`** — bóc yêu cầu từ tài liệu sẵn có **trước khi** tự nghĩ ra:
tài liệu CRM đối thủ, hợp đồng, chính sách, màn hình hệ thống cũ, sách nghiệp vụ. Kết quả
còn dùng để **đối chiếu chéo** với những gì kỹ thuật khác sinh ra.

**Công tắc người-thật** — có chuyên gia thật thì hỏi thẳng, đừng chạy `bmad-party-mode` hay
persona rotation. Mô phỏng là phương án dự phòng cho stakeholder vắng mặt, không phải mặc định.

BMad còn có sẵn `MR` market-research và `DR` domain-research ở phase `1-analysis`.

## Định tuyến câu hỏi theo vai — BABOK `2.4`

| Cần gì | Hỏi vai nào | Vì họ nắm |
|---|---|---|
| Phạm vi, thứ tự ưu tiên, **thứ tự cắt** | **Sponsor** `2.4.9` | *"control the budget and scope"* |
| Quy trình, thuật ngữ, quy tắc | **Domain SME** `2.4.3` | Nguyên văn nêu *managers, process owners* |
| Số field, số click, thao tác thật | **End User** `2.4.4` | *"directly interact with the solution"* |
| Khả thi, ước lượng | **Implementation SME** `2.4.5` | Nguyên văn liệt kê *developer, solution architect* |

⚠ **Domain SME không tự động là End User.** Một trưởng bộ phận chỉ là End User nếu họ thật sự
dùng hằng ngày — kiểm chứng, đừng giả định.

## Chốt trước khi rời bước này

- [ ] Đã bóc tài liệu sẵn có, không phải tự nghĩ ra yêu cầu từ đầu
- [ ] Có câu trả lời rõ cho **"cái gì KHÔNG làm"**, không chỉ "làm gì"
- [ ] Nếu sẽ có cắt scope: đã xin Sponsor duyệt **thứ tự cắt** ngay từ buổi đầu

Điểm cuối quan trọng vì quyền chốt phạm vi thuộc Sponsor `2.4.9`, không thuộc PM — `2.4.7` chỉ
nói PM *"balancing"* các yếu tố. Xin duyệt trước biến mọi lần cắt về sau thành quyết định đã
được phê duyệt, thay vì vượt quyền giữa lúc code.
