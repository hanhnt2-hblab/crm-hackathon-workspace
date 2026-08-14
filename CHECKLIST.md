# Checklist — hackathon CRM

Thi **15/08/2026**, 9:30–15:00. Đội: hai dev + một Sales Manager.

Tệp này chỉ chứa **việc phải làm trước và trong ngày thi**. Thứ tự làm và lý do nằm ở
[`docs/chien-luoc-ngay-thi.md`](docs/chien-luoc-ngay-thi.md); chi tiết kỹ thuật đã chốt nằm ở Mục 0
của [Phản biện và phân tích yêu cầu](docs/Đề%20bài/Phản%20biện%20và%20phân%20tích%20yêu%20cầu.md)
dưới dạng `D1`–`D47`.

---

## A · Setup — mỗi bản clone làm một lần

- [x] Cài `uv` · Node ≥ 20.12 · Python ≥ 3.10
- [x] Bật git hook: `git config core.hooksPath .githooks`
- [x] **Đưa `tabularis` vào `PATH`** (Windows: `%LOCALAPPDATA%\tabularis\`), kiểm bằng
      `tabularis --mcp`. Không có thì MCP cơ sở dữ liệu không khởi động được, và bộ kiểm thử
      phải đi đường dự phòng khi khẳng định `T-4`, `T-8`, `T-9`. Kiểm đúng cách là **xem MCP có
      khởi động trong phiên agent không** — `command -v tabularis` trong Git Bash có thể không
      thấy vì hai tiến trình dùng `PATH` khác nhau
- [x] Xác minh phần nối BABOK: `python ~/.claude/skills/babok-business-analysis/verify.py --project-root .`
      — đạt khi in `Mọi phép kiểm đạt.`
- [x] Xác minh skill nạp được — gõ `/` xem có `babok-business-analysis` và `hackathon-deploy`

Không chạy `npx bmad-method install` — BMad đã nằm sẵn trong repo.

## B · Giai đoạn 1 — trước ngày thi

Hoàn thiện sản phẩm. Phần này phục vụ **vòng 2 và vòng 3**; log ở giai đoạn này không được chấm.

- [ ] **Log Claude Code → Grafana chảy thật**, kiểm bằng một lần chạy và nhìn bảng (`D37`).
      Hỏng cái này là mất cả vòng 1, không cứu được — **làm trước mọi thứ khác**
- [ ] **Chạy luồng `CB → PRD → CU → CA`** theo [README](README.md) mục *Luồng phát triển*.
      Stack cho `src/` là **đầu ra của `CA`**, chốt bằng ma trận quyết định có trọng số — không
      chốt tay ngoài luồng: quyết định ngoài workflow không sinh artifact và không sinh log, nên
      vòng 1 không có gì để chấm ở hai cột Requirement và Design
- [ ] Gửi [bộ câu hỏi cho sáu giám khảo vòng 3](docs/Đề%20bài/Câu%20hỏi%20cho%20ban%20giám%20khảo%20vòng%203.md)
      — câu `B3` đóng `Q10` bằng số lấy từ chính người chấm
- [ ] Sáu nhóm `§4` tới đúng mức `T-1`…`T-10` quan sát được
- [ ] **UX theo phản hồi của đội Sales** — 5/6 giám khảo vòng 3 thuộc thị trường JP
- [ ] **`§7.3` khởi động sản phẩm — `npm start`** (sau `npm ci && npm run build`). `docker compose up -d` **chỉ dựng Postgres**, không khởi động sản phẩm; ánh xạ nó vào `§7.3` là để trống một cổng nộp bài
- [ ] **`§7.5` nạp dữ liệu — `npm run seed`** (idempotent; `prisma generate && migrate deploy && node prisma/seed.ts`)
- [ ] **`§7.4` kiểm thử — `npm test`** (`vitest run`, phải thoát mã 0). Chạy **hai lần liên tiếp** vẫn xanh
- [ ] `docker compose down` rồi `up` — dữ liệu còn nguyên. **Phương tiện chứng minh** `NFR-5`, không phải mục nộp bài

Đội đã quyết **không** tập một vòng đầy đủ để lấy mốc đo — dồn giờ cho sản phẩm. Cái giá: ngày thi
không có số liệu nào để biết mình nhanh hay chậm, nên bám ba điểm dừng chặt hơn bình thường.

## C · Giai đoạn 2 — ngày thi

Chỉ làm **tính năng BTC phát thêm**, để chạy lại trọn luồng và sinh log cho vòng 1. Lịch giờ và
phân vai ở [chiến lược](docs/chien-luoc-ngay-thi.md) mục 4.

- [ ] 9:30–9:45 kiểm log Grafana chảy thật — **trước mọi việc khác**
- [ ] Mỗi cột barem có một phiên làm việc thật trong ngày: RA · SD · Dev · Testing · Deployment
- [ ] Mỗi khối kết thúc bằng **một dòng: quyết gì, vì sao** — dùng chung cho bài trình bày, cho
      vấn đáp vòng 2, và cho `D40`
- [ ] **14:30 nộp bản an toàn**, sau đó cải thiện được thì nộp lại
- [ ] Nộp **cả hai hạng mục**: mã nguồn **và** tài liệu trình bày & demo

## D · Kiểm mỗi ngày

- [ ] **Công tắc người-thật**: có người trả lời được thì hỏi họ, **đừng** chạy `party-mode`
- [ ] Mỗi story có **tiêu chí nghiệm thu quan sát được**, viết **trước** khi code
- [ ] Mỗi NFR có **ngưỡng số**, không phải tính từ
- [ ] Mọi đầu ra AI giữ lại phải có người **đọc và nói được lý do trong một câu** (`D40`)
- [ ] Cắt scope thì ghi vào bảng dưới, và kiểm cột cuối

```
NGÀY | CẮT GÌ | VÌ SAO | THAY BẰNG GÌ | ĐÃ DUYỆT TRƯỚC?
     |        |        |              |
```

- [ ] Không để xảy ra kiểu cắt scope tệ nhất: *vẫn nói là "có" nhưng bên trong hỏng*.
      Ví dụ kinh điển của CRM: hứa rep chỉ thấy deal của mình, để tạm ai cũng thấy hết, rồi quên

---

## Đã chuyển đi đâu

| Nội dung cũ | Giờ ở đâu |
|---|---|
| Kịch bản workshop stakeholder (mục B, C, D cũ) | [`docs/luu-tru/checklist-workshop-stakeholder.md`](docs/luu-tru/checklist-workshop-stakeholder.md) |
| Bảo trì hub BABOK, năm phép kiểm của `verify.py` | [`README.md`](README.md) mục *Bảo trì* |
| Danh sách việc còn treo | [`docs/chien-luoc-ngay-thi.md`](docs/chien-luoc-ngay-thi.md) mục 3 |
