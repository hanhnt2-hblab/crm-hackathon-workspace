# Bản đồ khuyết điểm — theo từng skill BMad

> **Đo trên bản cài** `.claude/skills/` — BMad **v6.10.0**, ngày **2026-08-08**, quét 234 file,
> loại `bmad-advanced-elicitation/methods.csv` (nội dung skill này tự chèn).
> Baseline: `bmad-custom/gap-baseline.json` · Đo lại: `python bmad-custom/check-install.py`

Cho mỗi bước BMad: **nó làm tốt gì** (đừng can thiệp), **nó thiếu gì**, chạy kỹ thuật BABOK
nào để bù, và **giao lại artifact gì** cho BMad tiêu thụ.

Thứ tự và mã lệnh theo `_bmad/bmm/module-help.csv` của bản cài:
`1-analysis` → `2-planning` → `3-solutioning` → `4-implementation`.

⚠ Việc ghép cặp skill BMad với kỹ thuật BABOK là **đánh giá của người viết**. Gap profile và số
section thì đã kiểm chứng.

## Số liệu tham chiếu

| absent (0–2 file) | thin (3–7) | covered (8+) |
|---|---|---|
| `10.35` process model **0** · `10.39` roles matrix **0** · `10.42` sequence diagram **0** · `10.9` business rule 2 · `10.18` document analysis 2 · `10.21` focus group 2 · `10.44` state model 2 · `10.50` workshop 2 | `10.23` glossary 5 · `10.30` non-functional 7 | `10.15` data model 11 · `10.27` lessons learned 11 · `10.5` brainstorming 20 · `10.1` acceptance criteria 23 · `10.33` prioritization 23 · `10.48` user stories 23 · `10.43` persona 45 |

**Không đo được bằng từ khoá** (từ quá thông thường): `10.25` Interviews · `10.31` Observation ·
`10.37` Reviews · `10.45` Survey.

**Sắc thái `10.15`:** covered ở mức khái niệm (11 file) nhưng artifact ERD chỉ **1 file** —
`bmad-architecture/assets/spine-template.md` cố ý giới hạn *"core-entity ERD (names +
relationships only)"*. Bù của `10.15` là *khi cần hơn mức spine*, không phải *BMad quên*.

---

## `bmad-product-brief`

**Làm tốt:** khung ý tưởng, `bmad-forge-idea` và `bmad-brainstorming` phủ tốt phần phát ý.

**Thiếu:** không có kỹ thuật khai thác từ người thật (0/71 method).

**Bù:** Document Analysis `10.18` trên tài liệu sẵn có. Nếu có chuyên gia trong phòng →
Workshops `10.50` thay cho party-mode.

**Giao lại:** danh sách nguồn đã bóc + biên phạm vi nháp.

---

## `bmad-prd`

**Làm tốt:** prioritization (23 file), acceptance criteria (23 file). **Không bù hai cái này.**

**Thiếu:** `process model` = **0 file**. PRD tả tính năng nhưng không có quy trình đầu-cuối.
`glossary` chỉ 5 file.

**Bù:**
- **Process Modelling `10.35`** — quy trình nghiệp vụ đầu-cuối. Đây là gap rõ nhất ở bước này.
- **Concept Modelling `10.11`** + Glossary `10.23` — chốt thuật ngữ trước khi nó chảy vào schema.
- **NFR Analysis `10.30`** — `non-functional` chỉ 7 file; mỗi attribute cần ngưỡng đo được.

**Giao lại:** sơ đồ quy trình + bảng thuật ngữ + danh sách NFR có ngưỡng → `bmad-prd` nhúng vào.

---

## `bmad-spec` — nơi cần bù nhiều nhất

**Làm tốt:** acceptance criteria.

**Thiếu:** ba khái niệm cốt lõi gần như không tồn tại — `business rule` **2 file**,
`state model` **2 file**, `roles matrix` **0 file**.

**Bù:**

| Kỹ thuật | Section | Sinh ra |
|---|---|---|
| **State Modelling** | 10.44 | Danh sách trạng thái + chuyển tiếp **được phép** + điều kiện canh |
| **Business Rules Analysis** | 10.9 | Luật điều khiển quyết định, tách khỏi bước quy trình |
| **Roles and Permissions Matrix** | 10.39 | Bảng vai × hành động, tìm ô "chạm được nhưng không nên" |
| Decision Modelling | 10.17 | Logic quyết định nhiều điều kiện |
| Use Cases and Scenarios | 10.47 | Luồng chính + luồng ngoại lệ |

**Giao lại:** ba artifact đầu là đầu vào trực tiếp cho spec. Thiếu chúng thì spec nói *"cái gì"*
mà không nói *"khi nào được phép"* và *"ai được phép"*.

**Định tuyến:** State + Rules hỏi Domain SME `2.4.3`. Roles matrix hỏi **cả hai** — Sponsor
quyết *ai được thấy*, Domain SME biết *ai cần thấy*.

---

## `bmad-architecture`

**Làm tốt:** thiết kế kỹ thuật, `bmad-document-project`.

**Thiếu:** `sequence diagram` = **0 file**. `data model` là `covered` (11 file) nhưng artifact
ERD chỉ **1 file** — spine template cố ý giới hạn *"names + relationships only"*, loại thuộc tính
là chủ ý. Nên bù ở đây là **cardinality + thuộc tính + ba tầng**, không phải bù khái niệm.

**Bù:**
- **Data Modelling `10.15`** + Data Dictionary `10.12` — entity, quan hệ, ràng buộc field.
- **Interface Analysis `10.24`** ✅ đã cache — mỗi interface đặc tả **5 thuộc tính** theo
  `10.24.3.3`: name · coverage/span · exchange method · message format · exchange frequency.
- Sequence Diagrams `10.42` cho luồng phức tạp; Data Flow Diagrams `10.13`.

**Giao lại:** ER + data dictionary + bảng interface 5 cột.

---

## `bmad-create-epics-and-stories`

**Làm tốt:** user stories, acceptance criteria, functional decomposition — phủ đủ.
**Đây là bước ít cần bù nhất.**

**Bù nhẹ:** traceability (7 file) — mỗi story truy được về một yêu cầu, mỗi yêu cầu về một
nhu cầu. BMad không ép chuyện này.

---

## `bmad-ux`

**Làm tốt:** `bmad-agent-ux-designer`, personas (`10.43` = covered).

**Thiếu:** không có gì lớn — nhưng persona là **mô phỏng**. Có End User thật thì áp công tắc
người-thật: hỏi số field, số click, thay vì suy đoán từ persona.

---

## `bmad-sprint-planning`

**Làm tốt:** backlog, estimation.

**Thiếu:** `MoSCoW` 2 file. Việc **cắt gì trước** khi hết thời gian không được xử lý tường minh.

**Bù:** Prioritization `10.33` để lập **thứ tự cắt được duyệt trước**, không phải xin phép
giữa lúc code. Quyền chốt thuộc Sponsor — `2.4.9` nguyên văn *"control the budget and scope"*.

---

## Nhóm `4-implementation`

**Làm tốt:** `bmad-code-review`, `bmad-qa-generate-e2e-tests`, `bmad-retrospective`
(`Lessons Learned 10.27` = covered), `bmad-correct-course`.

**Thiếu:** ⚠ chưa đo kỹ nhóm này. Đừng kết luận sớm.

---

## Thứ tự bù, xếp theo mức khuyết

Nếu chỉ làm được một phần, làm theo thứ tự này:

```
1. bmad-spec          state 10.44 · rules 10.9 · roles 10.39     ← khuyết nặng nhất (0–2 file)
2. bmad-architecture  sequence 10.42 · interface 10.24 · data 10.15  ← sequence = 0 file
3. bmad-prd           process 10.35 · concept 10.11 · NFR 10.30  ← process = 0 file
4. cong tac nguoi-that                                           ← 0/71 method, ap dung moi buoc
```

Ba bước đầu là bù nội dung. Bước 4 là đổi hành vi, rẻ nhất và áp được ngay từ buổi đầu.
