# Nghiên cứu kiến trúc software

📌 **Chưa có nội dung.** Thư mục dành cho phần anh bổ sung sau.

## Dự kiến chứa

- Khảo sát kiến trúc và pattern
- Đánh giá mức phù hợp với CRM
- Đánh giá mức phù hợp với ràng buộc **1 tuần** — tiêu chí riêng, khác hẳn tiêu chí dài hạn

## Công cụ sẵn có hỗ trợ

| Cần gì | Dùng |
|---|---|
| Nghiên cứu kỹ thuật | BMad `TR` technical-research (phase `1-analysis`) |
| Nghiên cứu ngành | BMad `DR` domain-research |
| Dựng spine kiến trúc | BMad `CA` `/bmad-architecture` |
| Đặc tả tích hợp | BABOK `10.24` Interface Analysis — 5 thuộc tính mỗi interface |
| Entity và cardinality | BABOK `10.15` Data Modelling — 3 tầng conceptual/logical/physical |
| Luồng tương tác và nhánh lỗi | BABOK `10.42` Sequence Diagrams |
| Chọn giữa các phương án | `/bmad-advanced-elicitation` → `66` Architecture Decision Records |

## Sắc thái cần biết về ERD trong BMad

`bmad-architecture/assets/spine-template.md` **cố ý** giới hạn ERD ở mức *"core-entity ERD
(names + relationships only; an attribute that's itself an invariant is an AD, not a
diagram)"*. Loại thuộc tính khỏi sơ đồ là **chủ ý thiết kế**, không phải thiếu sót.

Nên `10.15` Data Modelling được dùng khi cần **hơn mức spine** — cardinality, thuộc tính, ba
tầng — chứ không phải để "sửa lỗi" của BMad.
