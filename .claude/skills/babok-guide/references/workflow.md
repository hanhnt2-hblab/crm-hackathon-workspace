# Luồng làm việc — BMad v6.10.0 + babok-guide

Trình tự, mã lệnh và `preceded-by` lấy từ **bản cài thật** `_bmad/bmm/module-help.csv`
(v6.10.0, cài bằng `npx bmad-method install`) — **không** lấy từ source GitHub, vì hai bản
khác nhau đáng kể. Phần ghép với BABOK là **đánh giá của người viết** ⚠.

## Hai cơ chế kết hợp — hiểu cái này trước

**1 · Tự động.** 12 method BABOK đã được chèn vào `.claude/skills/bmad-advanced-elicitation/methods.csv`
(catalog 71 → 83). `bmad-advanced-elicitation` là *"shared refinement checkpoint"* mà các skill
khác gọi ở mọi điểm dừng, nên chúng tự nổi lên trong menu.

⚠ **Update BMad sẽ ghi đè `methods.csv`.** Chạy lại sau mỗi lần update:
`python .claude/skills/babok-guide/references/bmad-custom/apply-methods.py`

**2 · Chủ động.** `_bmad/custom/bmad-{prd,architecture,spec}.toml` nạp file này + ràng buộc riêng
của từng bước qua `persistent_facts`.

Quy tắc phân vai: **BMad điều phối và sinh tài liệu; BABOK cung cấp kỹ thuật cho phần BMad khuyết.**
Đừng dùng BABOK ở chỗ BMad đã mạnh (`acceptance criteria` 30 file, `prioritization` 14 file).

---

## Đường bắt buộc

Sáu bước `required: true`: **PRD → CA → CE → IR → SP → CS → DS**.

```
1-analysis        2-planning      3-solutioning              4-implementation
─────────────     ──────────      ─────────────              ────────────────
BP brainstorm     PRD ★           CA ★  architecture         SP ★  sprint-planning
MR market         CU  ux          CE ★  epics & stories      CS ★  create-story
DR domain                         IR ★  readiness gate       DS ★  dev-story
TR technical                                                 CR    code-review
CB product-brief                                             QA    e2e-tests
WB prfaq                                                     ER    retrospective
```

`bmad-prd` có `preceded-by: bmad-product-brief` → **CB chạy trước PRD**.

**anytime:** `GPC` generate-project-context · `DP` document-project · `QQ` quick-dev ·
`CC` correct-course · `bmad-spec`

---

## 0 · `GPC` — Generate Project Context · *anytime*

Nơi cắm **tri thức domain** (quyển sách nghiệp vụ sale). Không phải nơi cắm BABOK.
Cân nhắc `DR` domain-research nếu cần nghiên cứu ngành trước.

⚠ Cắt xuống tối thiểu, đừng nhồi cả sách — tài liệu sinh ra quá nhiều làm agent tệ đi.

**BABOK:** không dùng.

---

## 1 · `CB` — Product Brief · *1-analysis* · **bắt buộc chạy trước PRD**

**Tại checkpoint AE:** `Document Analysis (BABOK 10.18)` — bóc tài liệu CRM đối thủ và sách
nghiệp vụ trước khi tự nghĩ ra yêu cầu.

**Công tắc người-thật:** có giám đốc thì hỏi thẳng về scope và giá trị, đừng chạy `Party Mode`.

Bổ trợ có sẵn trong BMad: `MR` market-research cho đối thủ, `DR` domain-research cho nghiệp vụ sale.

---

## 2 · `PRD` — Create PRD · ★ · *2-planning*

BMad thiếu `process model` (**0 file**), `glossary` mỏng (6 file).

**Trước khi chạy — làm với trưởng bộ phận sales:**

| Thứ tự | Kỹ thuật | Sinh ra |
|---|---|---|
| 1 | Concept Modelling `10.11` | Glossary: `Lead` / `Contact` / `Account` / `Opportunity` |
| 2 | Process Modelling `10.35` **as-is** | Hiện tại đang bán thế nào |
| 3 | Process Modelling `10.35` **to-be** | Muốn thành thế nào — **hỏi tách**, đừng gộp |

Thứ tự 1 trước 2 là **bắt buộc**: `10.9.2` đòi *"basing them on standard business vocabulary"*;
`10.9.4.2` nói hệ quả nếu bỏ qua — *"resulting business rules will be inaccurate or contradictory"*.

Với 1 tuần: làm **glossary** rồi dừng. `10.11.2` mở đầu bằng *"A concept model starts with a
glossary"* — đó là phần 20% đáng làm.

**Trong lúc chạy:** NFR `10.30`, dùng **15 category** làm checklist, mỗi cái có **ngưỡng số**.

⚠ **Đừng đưa ERD cho trưởng sales** — `10.11.2`, `10.15.4.2`, `10.42.4.2` cùng cảnh báo.

---

## 3 · `CU` — UX · *2-planning*

**Công tắc người-thật:** có End User thật (trưởng sales trực tiếp bán hàng) thì hỏi
*"rep mới vào mất mấy click để tạo 1 lead?"* thay vì suy đoán từ persona. `2.4.4` định nghĩa
End User là *"stakeholders who **directly interact** with the solution"*.

---

## 4 · `CA` — Architecture · ★ · *3-solutioning*

BMad khuyết nặng: `ER diagram` **0 file**, `sequence diagram` **0 file**, `data model` 6 file.

### 4a · Ba artifact lấy từ stakeholder

| Kỹ thuật | Hỏi ai | Sinh ra |
|---|---|---|
| State Modelling `10.44` | Domain SME | Stage nào sang được stage nào, điều kiện canh |
| Business Rules `10.9` | Domain SME | Mỗi luật kèm **một trong 4 mức thực thi** |
| Roles Matrix `10.39` | **Cả hai** | Sponsor quyết *ai **được** thấy*; Domain SME biết *ai **cần** thấy* |

Cộng `10.39.3.4`: **Delegation** và **Inheritance** — **yêu cầu dữ liệu**, muộn thì phải migrate.

### 4b · Bốn artifact tự làm

| Kỹ thuật | Lưu ý |
|---|---|
| Data Modelling `10.15` | Ba tầng conceptual → logical → physical; `10.15.2` gán physical cho **Implementation SME** `2.4.5` |
| Data Dictionary `10.12` | Rút **từ** ERD. Cột `Values/Meanings` khớp enum của state model |
| Interface Analysis `10.24` | Mỗi interface đủ **5 thuộc tính** `10.24.3` |
| Sequence Diagrams `10.42` | **Chỉ 3 kịch bản** — `10.42.4.2` cảnh báo vẽ hết là lãng phí |

### 4c · Bốn mức thực thi quyết định luật sống ở đâu

| Mức (`10.9.3`, nguyên văn) | Luật sống ở đâu | Kéo theo |
|---|---|---|
| *Allow no violations* | DB constraint / service layer | Không cần UI ngoại lệ |
| *Override by authorized actor* | Service layer + kiểm quyền | **Cần** bảng phân quyền + audit log |
| *Override with explanation* | Service layer + kiểm quyền | Thêm **field lý do bắt buộc** |
| *No active enforcement* | Chỉ cảnh báo UI | Không ràng buộc dữ liệu |

### 4d · Cửa kiểm trước khi sang `CE`

- [ ] Mọi tên trong ERD tra được về glossary
- [ ] Transition guard nằm **dưới** tầng UI, có test cho ô bị cấm
- [ ] Mỗi business rule có đúng một nơi thực thi, đúng mức đã chọn
- [ ] Delegation và Inheritance đã có chỗ trong schema, hoặc **đã ghi rõ là không làm**
- [ ] Mỗi ô trống trong roles matrix có test chặn ở **tầng API**, không phải ẩn nút
- [ ] Luật không nằm lẫn trong luồng — `10.35.4.2` và `10.9.2` cùng đòi tách
- [ ] Mỗi interface đủ 5 thuộc tính
- [ ] Mỗi NFR có ngưỡng số và cách đo

Cửa kiểm này thay cho review giữa hai người: `2.4.11` định nghĩa Tester verify *"requirements
defined by the business analyst"* — BABOK giả định hai người, bạn gộp vai nên phải thay bằng thứ
tick được.

---

## 5 · `CE` — Epics & Stories · ★ · *3-solutioning*

**BMad mạnh nhất ở đây** — `acceptance criteria` 30 file, user stories và functional decomposition
đều covered. **Không bù gì.**

Chỉ thêm chỗ BMad mỏng (`traceability` 4 file): mỗi story truy được về một yêu cầu.

---

## 6 · `IR` — Check Implementation Readiness · ★ · *3-solutioning*

Cổng kiểm PRD + UX + Architecture + Epics đã đủ chưa. **Bước này không có trong bản source** —
chỉ xuất hiện ở bản cài.

Dùng **cửa kiểm 4d** ở trên làm phần bổ sung: BMad kiểm tính đầy đủ của tài liệu, BABOK kiểm
tính đúng đắn của mô hình nghiệp vụ.

---

## 7 · `SP` → `CS` → `DS` · ★ · *4-implementation*

`SP` sprint-planning → `CS` create-story → `DS` dev-story. Rồi `CR` code-review · `QA` e2e-tests ·
`ER` retrospective.

**Tại `SP`:** đưa **thứ tự cắt scope đã xin duyệt trước** vào. `2.4.9`: Sponsor *"control the
budget and scope"* — thứ tự cắt là quyết định của giám đốc, chốt từ buổi đầu.

**Trong lúc `DS`:** luật không nhét vào giữa luồng xử lý; cắt scope thì ghi lại kèm cột
*"đã duyệt trước chưa"*.

---

## Bảng tra nhanh

| Bước | Mã | Phase | BABOK cần | Bù gap gì |
|---|---|---|---|---|
| Generate Project Context | `GPC` | anytime | — | nơi cắm sách sale |
| Product Brief | `CB` | 1-analysis | `10.18` | elicitation 0/71 |
| **PRD** ★ | `PRD` | 2-planning | `10.11` · `10.35` · `10.30` | process model **0** |
| UX | `CU` | 2-planning | công tắc người-thật | mô phỏng thay người thật |
| **Architecture** ★ | `CA` | 3-solutioning | `10.44` `10.9` `10.39` `10.15` `10.12` `10.24` `10.42` | ER **0** · sequence **0** · roles **0** |
| **Epics & Stories** ★ | `CE` | 3-solutioning | *(không bù)* | — |
| **Readiness gate** ★ | `IR` | 3-solutioning | cửa kiểm 4d | — |
| **Sprint Planning** ★ | `SP` | 4-implementation | `10.33` thứ tự cắt | MoSCoW 1 file |
| **Create/Dev Story** ★ | `CS` `DS` | 4-implementation | *(không bù)* | — |

## Nếu chỉ còn 3 ngày

Giữ **CB → PRD → CA → CE → IR → SP → CS → DS**, cắt `CU` và `ER`.
Phần BABOK rút còn bốn: **glossary** `10.11` · **state model** `10.44` ·
**business rules + mức thực thi** `10.9` · **roles matrix** `10.39`.
