# Công cụ và framework

📌 **Chưa có nội dung.** Thư mục dành cho phần anh bổ sung sau.

## Dự kiến chứa

### AI workflow framework

So sánh và lý do chọn:

| Framework | Trạng thái |
|---|---|
| **BMad Method** v6.10.0 | ✅ Đang dùng — xem README mục 1 |
| spec kit | 📌 Chưa khảo sát |
| … | |

Nên ghi rõ **tiêu chí đánh giá** trước khi so, không so xong mới nghĩ ra tiêu chí.

### Framework triển khai phần mềm

Stack, thư viện, CI/CD. Ràng buộc thực tế của HBLAB nếu có.

## Bài học đã có từ việc tích hợp BMad

Ghi lại để lần sau không mắc lại:

- **Bản cài khác source GitHub.** Skill `babok-guide` ban đầu dựng theo source, gây 4 lỗi
  thật — trong đó gap profile lệch ở 12/14 khái niệm. Luôn đo trên **cái đang chạy**.
- **Update ghi đè bản vá.** `npx bmad-method install` ghi đè `methods.csv`. Phải có script
  đắp lại, idempotent.
- **Đếm bằng từ khoá rất dễ sai.** Ba lần dương tính giả: `permission` khớp `permission-denied`,
  `erd` khớp `verdict`, `persona` khớp `personal`. `check-install.py` giờ cảnh báo khi một
  pattern khớp trên 25% số file.
