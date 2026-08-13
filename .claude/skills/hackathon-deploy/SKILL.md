---
name: hackathon-deploy
description: Lớp thuế cho bốn skill deploy mượn từ addyosmani/agent-skills, chỉnh về đúng ràng buộc hackathon CRM. Dùng khi làm bất cứ việc gì thuộc cột Deployment của barem, khi dựng bản chạy production, khi viết Dockerfile hoặc lệnh khởi động, hoặc trước khi nộp bài theo §7.
---

# Deploy trong phạm vi hackathon CRM

BMad không có bước deploy — bảng lệnh `_bmad/bmm/module-help.csv` chỉ có bốn phase
`plan · 2-planning · ship · anytime`, và không skill nào trong đó sinh artifact triển khai. Barem
lại chấm Deployment **15 điểm**, còn `§7.3` biến nó thành **điều kiện nộp bài**.

Chỗ trống đó được bù bằng bốn skill mượn ngoài. Nhưng cả bốn viết cho phần mềm chạy thật trên cloud
có staging, còn cuộc thi này chạy local trong 4,5 tiếng. **Đọc mục "Bỏ" dưới đây trước khi làm theo
bất kỳ skill nào trong bốn cái đó.**

## Bốn skill mượn, dùng phần nào

| Skill | Dùng | Bỏ |
|---|---|---|
| `ci-cd-and-automation` | Cổng chất lượng tuần tự · `.env.example` · nạp lỗi CI ngược lại cho agent sửa | Cú pháp GitHub Actions — mã nộp về **GitLab** HBLAB (`§7.1`) · preview deployment · Vercel/Netlify |
| `security-and-hardening` | Threat model trước · OWASP injection, access control, security misconfiguration | Phần hạ tầng cloud, secret manager, WAF |
| `shipping-and-launch` | Checklist tiền phát hành · **chiến lược rollback kèm ngưỡng kích hoạt** | **Toàn bộ staged rollout** — xem dưới |
| `observability-and-instrumentation` | Định nghĩa "chạy đúng" trước khi đo · structured logging · cảnh báo có ngưỡng | Distributed tracing · APM ngoài |

### Bỏ dứt khoát: staged rollout

`shipping-and-launch` khuyên chuỗi staging → production cờ tắt → nội bộ 24 giờ → canary 5% → 25% →
50% → 100% → theo dõi một tuần.

**Không áp dụng.** Cuộc thi không có staging, không có cloud, không có người dùng thật, và toàn bộ
quỹ giờ là 9:30–15:00 một ngày. Chạy playbook này sẽ sinh log vô nghĩa, mà log là thứ vòng 2 bốc
ngẫu nhiên câu hỏi (`F39`). Thay bằng: **một môi trường duy nhất, cờ tắt-bật phần AI mà `§4/nhóm 6`
đã đòi sẵn, và hoàn tác bằng `git revert` cộng chạy lại lệnh khởi động.**

Giữ lại từ mục đó đúng một thứ: **bảng ngưỡng quyết định rollback**. Nó vẫn đúng, chỉ đổi đơn vị —
đo trên vòng quét và hàng đợi gợi ý thay vì trên người dùng thật.

## "Đã deploy" nghĩa là gì ở đây

`§7.3` định nghĩa, không phải skill nào định nghĩa. Năm điều kiện, thiếu một là chưa xong:

1. Bản dựng production — không dev server, không hot reload, không chế độ gỡ lỗi.
2. Cấu hình ở **biến môi trường**, không nằm trong mã: khoá dịch vụ ngoài, chuỗi kết nối, chu kỳ
   vòng quét.
3. Dữ liệu ở **cơ sở dữ liệu thật**, còn nguyên sau khi khởi động lại tiến trình.
4. **Đăng nhập thật** hai tài khoản Sales và Quản trị để giám khảo tự vào.
5. **Khởi động bằng một lệnh**, log chạy ra chỗ xem được.

Cộng `§7.5`: **nạp dữ liệu BTC bằng một lệnh**, chạy lại thì về đúng trạng thái ban đầu.

Không skill mượn nào phủ điều 1, 3 và 5 — đó là phần phải tự viết: Dockerfile, compose, và ba lệnh
một-bước cho khởi động, nạp dữ liệu, chạy kiểm thử.

## Thang điểm, và bằng chứng cần để lên từng bậc

| Bậc | Barem đòi | Việc cụ thể | Bằng chứng trong log |
|---|---|---|---|
| 1 (25%) | Dockerfile / script deploy cơ bản | Dockerfile bản dựng production, compose có DB | Phiên sinh và sửa Dockerfile |
| 2 (50%) | Cấu hình CI/CD pipeline | `.gitlab-ci.yml`: lint → typecheck → test → build | Phiên chạy `ci-cd-and-automation` |
| 3 (75%) | IaC, tối ưu resource, **review bảo mật** | compose là IaC · giới hạn tài nguyên · rà OWASP trên `§5` | Phiên chạy `security-and-hardening` |
| 4 (100%) | AI-in-the-loop, **auto rollback**, giám sát AIOps | Health check · cảnh báo có ngưỡng trên nhật ký vòng quét · lệnh hoàn nguyên một bước | Phiên chạy `observability-and-instrumentation` |

Bậc 4 có sẵn nguyên liệu trong đề bài: `§4/nhóm 5` đã đòi **Nhật ký vòng quét** ghi mỗi vòng quét
bao nhiêu công ty, lỗi gì; `§4/nhóm 6` đã đòi **nút tắt toàn bộ phần AI có hiệu lực ngay**. Đó
chính là giám sát và phanh khẩn cấp — gắn ngưỡng cảnh báo vào nhật ký đó là xong, không phải dựng
hệ thống mới.

## Ràng buộc riêng của cuộc thi

- **Không cloud.** BTC không cấp VPS hay domain. Chạy local nhưng phải giả lập đủ mọi thành phần
  như production.
- **GitLab, không GitHub.** Repo do BTC cấp ngày 15/8.
- **Việc này phải chạy lại trong ngày thi** (`D39`). Dựng sẵn trước là đúng, nhưng chỉ log ngày
  15/8 được tính, nên phần sinh cấu hình phải diễn ra lại trên dữ liệu thật.
- **Log Claude Code về Grafana làm trước tiên** (`D37`) — thể lệ ghi *"không có log bằng không có
  điểm và không qua được vòng 1"*.

## Kiểm

Xong khi cả bốn lệnh dưới đây chạy được từ một bản clone sạch, không sửa mã:

```
<lệnh khởi động>      # bản production, một lệnh
<lệnh nạp dữ liệu>    # chạy lần hai về đúng trạng thái ban đầu
<lệnh chạy kiểm thử>  # phủ T-1…T-10, in kết quả rõ ràng
<lệnh dừng>           # rồi khởi động lại, dữ liệu còn nguyên
```

Chưa chốt stack cho `src/` nên chưa điền được lệnh thật. Chốt xong thì thay bốn dòng trên bằng lệnh
thật, ở đây và ở `AGENTS.md`.

**Không tự khai đã xong** khi mới chạy được trên máy đang phát triển: điều kiện là **bản clone
sạch**. Đây là chỗ hay trượt nhất, vì máy dev luôn có sẵn biến môi trường và dữ liệu từ lần chạy
trước.
