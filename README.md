# CRM Hackathon Workspace

Bộ công cụ và tài liệu cho hackathon phát triển CRM — tuần chạy **10–16/8/2026**.

Repo này **không chứa mã nguồn sản phẩm CRM**. Nó chứa *cách chúng ta làm việc*: quy trình phát
triển có AI hỗ trợ, tri thức phân tích nghiệp vụ, và các tài liệu chuẩn bị.

---

## Bắt đầu từ đâu

```bash
git clone <repo> && cd crm-hackathon-workspace
git config core.hooksPath .githooks
python .claude/skills/babok-guide/scripts/check-install.py
```

Đạt khi báo `Moi thu khop voi ban cai`. BMad và bản vá đã nằm sẵn trong repo — không cần chạy
`npx bmad-method install`.

Yêu cầu: Node ≥ 20.12 · Python ≥ 3.10 · [`uv`](https://docs.astral.sh/uv/)

Đọc theo thứ tự: [`docs/kickoff.md`](docs/kickoff.md) → [`docs/roles/`](docs/roles/README.md) →
[`docs/plan/`](docs/plan/README.md).

---

## Tài liệu chuẩn bị — đã có

| Tài liệu | Nội dung |
|---|---|
| [`docs/kickoff.md`](docs/kickoff.md) | Cần hỏi gì, hỏi ai, bốn buổi làm việc đầu |
| [`docs/roles/`](docs/roles/README.md) | Ai làm gì, ai quyết gì, workshop chạy thế nào |
| [`docs/plan/`](docs/plan/README.md) | Hai phương án — làm mới và fork — kèm lịch từng ngày |
| [`docs/architecture/systems.md`](docs/architecture/systems.md) | Kiến trúc năm hệ thống AI-native đang chạy thật: Attio · Day.ai · Granola · Folk · Clay |
| [`docs/architecture/proposal.md`](docs/architecture/proposal.md) | Kiến trúc đề xuất — 🚧 đang dở, chờ có PRD |

---

## Tài liệu sẽ sinh ra khi chạy quy trình

Chạy các skill BMad sẽ tự sinh tài liệu vào `_bmad-output/planning-artifacts/`. Skill
`babok-guide` nạp thêm hướng dẫn nghiệp vụ vào từng bước, nên mỗi bước sinh thêm những artifact
mà BMad gốc không có.

```
bmad-product-brief  →  bmad-prd  →  bmad-architecture  →  bmad-create-epics-and-stories
```

---

### 1 · `bmad-product-brief`

**BMad sinh ra:**

- `brief.md` — vấn đề, người dùng, phạm vi, tiêu chí thành công
- `addendum.md` — chi tiết chưa vào brief nhưng cần cho bước sau
- `.memlog.md` — nhật ký quyết định trong lúc làm

**`babok-guide` thêm vào:**

- **Document Analysis** — bóc yêu cầu từ tài liệu sẵn có *trước khi* tự nghĩ ra: tài liệu CRM
  đối thủ, hợp đồng, chính sách công ty, màn hình hệ thống cũ, sách nghiệp vụ
- **Stakeholder routing table** — bảng định tuyến câu hỏi theo vai: hỏi ai câu nào, dựa trên
  mười một vai chuẩn
- **Công tắc người-thật** — có chuyên gia thật thì hỏi thẳng, không chạy `bmad-party-mode` hay
  xoay persona. Mô phỏng chỉ là phương án dự phòng khi vắng người

---

### 2 · `bmad-prd`

**BMad sinh ra:**

- `prd.md` — yêu cầu chức năng có mã số, yêu cầu phi chức năng, hành trình người dùng
- `addendum.md` — phương án đã cân nhắc và loại, chi tiết kỹ thuật
- `review-*.md` — kết quả soát của từng người soát

**`babok-guide` thêm vào — theo đúng thứ tự này:**

- **Concept Model** — bảng thuật ngữ chốt trước mọi thứ khác: `Lead` / `Contact` / `Account` /
  `Opportunity` khác nhau chỗ nào. Từ vựng nghèo thì luật viết ra sẽ mâu thuẫn
- **Process Model (as-is)** — hiện tại đang làm thế nào
- **Process Model (to-be)** — muốn thành thế nào. Hỏi tách hai lần, vì người mô tả có xu hướng
  kể cái *nên là* thay vì cái *đang là*
- **NFR Analysis** — thuộc tính chất lượng **kèm ngưỡng số**, không viết "nhanh" mà viết con số.
  Rà theo mười lăm nhóm: Availability · Compatibility · Functionality · Maintainability ·
  Performance Efficiency · Portability · Reliability · Scalability · Security · Usability ·
  Certification · Compliance · Localization · SLA · Extensibility

---

### 3 · `bmad-architecture`

**BMad sinh ra:**

- `architecture.md` — thành phần, luồng dữ liệu, quyết định kỹ thuật và lý do

**`babok-guide` thêm vào — bốn artifact:**

- **Data Model** — ba tầng `conceptual` → `logical` → `physical`. Tầng conceptual thuộc phía
  nghiệp vụ, tầng physical thuộc phía kỹ thuật. Đừng nhảy thẳng vào physical
- **Data Dictionary** — rút **từ** data model, không làm song song. Cột giá trị và ý nghĩa phải
  khớp với state model
- **Interface Analysis** — mỗi giao diện mô tả đủ **năm thuộc tính**: `name` · `coverage/span` ·
  `exchange method` · `message format` · `exchange frequency`
- **Sequence Diagrams** — chỉ ba kịch bản với CRM: chuyển stage kèm duyệt, nhập dữ liệu hàng
  loạt, tích hợp hệ thống ngoài. Vẽ đủ bộ cho mọi use case là lãng phí

---

### 4 · `bmad-create-epics-and-stories`

**BMad sinh ra:**

- `epics.md` — nhóm việc lớn
- `stories/*.md` — từng việc kèm tiêu chí nghiệm thu

**`babok-guide` thêm vào — ba artifact, tất cả đều phải lấy từ người thật:**

- **State Model** — vòng đời của từng đối tượng chính, hỏi chuyên gia nghiệp vụ
- **Business Rules** — tách hai loại, đừng gộp:
  - `definitional` — luật không thể vi phạm, chỉ có thể áp dụng sai. Là hàm dẫn xuất hoặc phép
    tính, **không có mức thực thi**
  - `behavioural` — luật luôn có thể bị vi phạm. Mỗi luật chọn một trong **bốn mức thực thi**
- **Roles & Permissions Matrix** — hỏi **cả hai người**, hai câu khác nhau: sponsor trả lời *ai
  được phép*, chuyên gia nghiệp vụ trả lời *thực tế ai đang làm*

---

## Công cụ trong repo

### BMad Method v6.10.0

**`.claude/skills/bmad-*/`** — [BMad Method](https://github.com/bmad-code-org/BMAD-METHOD), 46
skill, chia 4 giai đoạn:

```
1-analysis  →  2-planning  →  3-solutioning  →  4-implementation
```

Bảng lệnh đầy đủ ở `_bmad/bmm/module-help.csv`. Đội này chạy chín skill — danh sách ở
[`docs/roles/`](docs/roles/README.md).

### babok-guide

**`.claude/skills/babok-guide/`** — skill tự viết, bổ trợ BMad bằng tri thức BABOK v3 ở những
chỗ BMad mỏng.

| File | Vai trò |
|---|---|
| `SKILL.md` | Bốn chức năng bù và hồ sơ đo trên bản cài |
| `assets/techniques.csv` | 50 kỹ thuật phân tích nghiệp vụ, kèm mức khuyết của BMad |
| `references/steps/*.md` | Hướng dẫn riêng cho từng bước — nạp đúng phần cần dùng |
| `references/workflow.md` | Luồng đầu-cuối: mỗi bước chạy kỹ thuật nào, hỏi ai |
| `scripts/apply-methods.py` | Chèn 12 kỹ thuật BABOK vào danh mục của BMad |
| `scripts/check-install.py` | Kiểm skill còn khớp bản cài BMad |

**Ba chỗ được bù**, đo trên 234 file của bản cài:

- **Mô hình nghiệp vụ** — sơ đồ quy trình, ma trận vai trò và quyền, sơ đồ tuần tự đều không có
  file nào. BMad đi từ PRD văn xuôi thẳng tới kiến trúc.
- **Khai thác người thật** — danh mục gốc có 71 kỹ thuật, không cái nào để lấy thông tin từ
  người thật. BMad mô phỏng nhân vật để bù cho việc không có người thật.
- **Chỗ mỏng** — bảng từ vựng và yêu cầu phi chức năng.

Không can thiệp chỗ BMad mạnh: tiêu chí nghiệm thu, ưu tiên hoá, user story.

Nguyên văn BABOK không nằm trong repo — bản gốc có bản quyền. Repo chỉ giữ số mục, số trang và
phần diễn giải tự viết.

### Cấu hình

**`_bmad/custom/`** chứa bốn file nạp hướng dẫn `babok-guide` vào đúng bước tương ứng — brief,
PRD, kiến trúc, spec. BMad đọc chúng ngay khi khởi động workflow.

---

## Bản đồ thư mục

```
crm-hackathon-workspace/
├── README.md                    file này
├── CHECKLIST.md                 việc cần làm
├── .claude/skills/
│   ├── babok-guide/             skill tự viết
│   └── bmad-*/                  46 skill BMad
├── _bmad/                       cấu hình + 4 file override
├── _bmad-output/                brief, PRD, epic sinh ra ở đây
└── docs/
    ├── kickoff.md               hỏi gì, hỏi ai
    ├── roles/                   ai làm gì
    ├── plan/                    hai phương án + lịch
    └── architecture/            khảo sát 5 hệ thống + kiến trúc đề xuất
```

---

## Bảo trì

Sau mỗi lần update BMad, chạy hai lệnh:

```bash
python .claude/skills/babok-guide/scripts/apply-methods.py
python .claude/skills/babok-guide/scripts/check-install.py
```

Update ghi đè `methods.csv` và xoá mất 12 kỹ thuật BABOK đã chèn. Lệnh đầu chèn lại, lệnh sau
kiểm bảy mục: danh mục còn đủ · bốn override nạp được · bản cài khớp nguồn · tên skill còn đúng ·
mọi số mục BABOK có thật · mỗi trích dẫn có phân định nguồn · hồ sơ đo còn khớp mốc.

Mục kiểm số mục BABOK cần bản văn bản gốc, truyền qua `--babok-txt <đường-dẫn>` hoặc biến môi
trường `BABOK_TXT`. Không có thì mục đó bỏ qua, các mục khác vẫn chạy.

---

## Nguồn tri thức

Bản ghi nguyên văn BABOK nằm ngoài repo, ở kho cá nhân `PARA/3_Resources/ba/babok-v3/`. Cột
`cached` trong `techniques.csv` cho biết kỹ thuật nào đã có bản ghi.
