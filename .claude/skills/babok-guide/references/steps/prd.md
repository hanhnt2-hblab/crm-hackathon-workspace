# Bước `PRD` — Create PRD

★ Bắt buộc · phase `2-planning` · `preceded-by: bmad-product-brief`

Toàn bộ luồng: [`../workflow.md`](../workflow.md)

## BMad khuyết gì ở bước này

Đo trên bản cài v6.10.0, 234 file, ngày 2026-08-08:

| Khái niệm | File | |
|---|---|---|
| `process model` | **0** | **absent** |
| `glossary` | 5 | thin |
| `non-functional` | 7 | thin |
| `acceptance criteria` | 23 | **covered — không can thiệp** |
| `prioritization` | 23 | **covered — không can thiệp** |

BMad tả tính năng rất tốt nhưng **không sinh sơ đồ quy trình đầu-cuối**.

## Bù bằng gì — theo đúng thứ tự

| # | Kỹ thuật | Sinh ra |
|---|---|---|
| 1 | **Concept Modelling `10.11`** | Bảng thuật ngữ: `Lead` / `Contact` / `Account` / `Opportunity` khác nhau chỗ nào |
| 2 | **Process Modelling `10.35` as-is** | Hiện tại đang làm thế nào |
| 3 | **Process Modelling `10.35` to-be** | Muốn thành thế nào |
| 4 | **NFR Analysis `10.30`** | Thuộc tính chất lượng kèm ngưỡng số |

**Thứ tự 1 trước mọi thứ là bắt buộc, không phải sở thích.** `10.9.2` đòi *"basing them on
standard business vocabulary"*; `10.9.4.2` nói hệ quả nếu bỏ qua: *"If available vocabulary is
insufficiently rich... resulting business rules will be inaccurate or contradictory"*.

**Hỏi as-is và to-be tách hai lần** (`10.35.2` phân biệt rõ hai loại mô hình). Người mô tả quy
trình có xu hướng kể cái **nên là** thay vì cái **đang là**.

**NFR phải có ngưỡng số.** Khuôn nguyên văn trong `10.30.2`: *"transactions must be at least X%
processed after S seconds"*. Dùng **15 category** của `10.30.3.1` làm checklist rà soát:
Availability · Compatibility · Functionality · Maintainability · Performance Efficiency ·
Portability · Reliability · Scalability · Security · Usability · Certification · Compliance ·
Localization · SLA · Extensibility.

## Rút gọn khi thời gian ngắn

`10.11.4.2` cảnh báo concept model đầy đủ đòi *"specialized skill set... think abstractly and
nonprocedurally"* và *"may be foreign to stakeholders"*. Nhưng `10.11.2` mở đầu bằng *"A concept
model **starts with a glossary**"* — **phần 20% đáng làm là cái glossary**. Chốt 5–7 danh từ cốt
lõi rồi dừng; bỏ Verb Concepts và Other Connections.

## ⚠ Đừng đưa sơ đồ kỹ thuật cho stakeholder nghiệp vụ

Ba mục BABOK độc lập cùng cảnh báo:

| Section | Nguyên văn |
|---|---|
| `10.11.2` | *"resistance from stakeholders about the perceived technical nature of data models"* |
| `10.15.4.2` | *"unfamiliar to people without a background in IT"* |
| `10.42.4.2` | *"may be considered too technical"* |

Dùng bảng thuật ngữ và sơ đồ quy trình thay thế. Giữ ERD cho phần việc của mình.

## Giao lại cho BMad

Bảng thuật ngữ + sơ đồ quy trình as-is/to-be + danh sách NFR có ngưỡng → `bmad-prd` nhúng vào PRD.
