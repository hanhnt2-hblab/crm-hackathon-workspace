# CRM Hackathon Workspace

Bộ công cụ và tài liệu cho hackathon phát triển CRM — tuần chạy **10–16/8/2026**.

Repo chứa hai thứ: **mã nguồn sản phẩm CRM** ở `src/`, và *cách chúng ta làm việc* — quy trình
phát triển có AI hỗ trợ, tri thức phân tích nghiệp vụ, và tài liệu đề bài.

Quy tắc cho agent (Claude Code và tương đương) nằm ở [`AGENTS.md`](AGENTS.md).

---

## Bắt đầu từ đâu

```bash
git clone <repo> && cd crm-hackathon-workspace
git config core.hooksPath .githooks
python ~/.claude/skills/babok-business-analysis/verify.py --project-root .
```

Đạt khi báo `Mọi phép kiểm đạt.` BMad và phần nối đã nằm sẵn trong repo — không cần chạy
`npx bmad-method install`.

Yêu cầu: Node ≥ 20.12 · Python ≥ 3.10 · [`uv`](https://docs.astral.sh/uv/)

Đọc theo thứ tự: [`Phản biện và phân tích yêu cầu`](docs/Đề%20bài/Phản%20biện%20và%20phân%20tích%20yêu%20cầu.md)
→ [`CHECKLIST.md`](CHECKLIST.md) → [`AGENTS.md`](AGENTS.md).

---

## Đề bài và phân tích

**Điểm vào là [`docs/Đề bài/Phản biện và phân tích yêu cầu.md`](docs/Đề%20bài/Phản%20biện%20và%20phân%20tích%20yêu%20cầu.md)**
— nó chốt 39 quyết định `D1`–`D39`, theo dõi 22 điểm mơ hồ `Q1`–`Q22` và 38 mâu thuẫn `F1`–`F38`,
và tự đặt thứ tự ưu tiên khi hai tài liệu nói khác nhau. Đọc Mục 0 trước khi viết dòng mã đầu tiên.

Sáu tài liệu BTC phát, ở `docs/Đề bài/`:

| Tài liệu | Nội dung |
|---|---|
| [Yêu cầu đề bài chính thức](docs/Đề%20bài/Yêu%20Cầu%20đề%20bài%20chính%20thức%20của%20cuộc%20thi%20prd.md) | Đề bài "AI Native CRM" — PRD, sáu nhóm tính năng, `T-1`…`T-10` |
| [0. Thể lệ](docs/Đề%20bài/0.%20Thể%20lệ%20AI%20Hackathon%2001%20-%20Dev%20Edition.md) | Ba vòng chấm, agenda ngày thi, điều kiện dự thi |
| [3. Checklist chấm điểm](docs/Đề%20bài/3.%20Checklist%20chấm%20điểm%20AI-Hackathon.md) | Rubric — 4 mức cho từng giai đoạn |
| [1. Business Playbook](docs/Đề%20bài/1.%20Business%20Playbook%20-%20quy%20trình%20sales.md) | Sales B2B ngành ITO — đọc trước, dành cho Dev/Tester/BA/PM |
| [2. Thiết kế phần mềm AI-Native](docs/Đề%20bài/2.%20Thiết%20kế%20phần%20mềm%20thế%20hệ%20AI%20Native%20-%20phương%20pháp%20luận.md) | Từ CRUD sang Ontology |
| [4. Hỏi đáp thông tin cuộc thi](docs/Đề%20bài/4.%20Hỏi%20đáp%20thông%20tin%20cuộc%20thi.md) | Giải đáp của BTC cho các đội |

Kèm [Câu hỏi gửi ban tổ chức](docs/Đề%20bài/Câu%20hỏi%20gửi%20ban%20tổ%20chức.md) — bốn câu đã gửi và
chỗ ghi trả lời, và `docs/CRM clone từ Airtable/` — CRM thật của HBLAB, nguồn đối chiếu của Mục 5.

---

## Mã nguồn

`src/` — **chưa chốt stack.** Chốt xong thì bổ sung lệnh build, test và run vào đây và vào
[`AGENTS.md`](AGENTS.md) mục *Running and verifying*.

Mang mã từ ngoài vào thì ghi nguồn và license vào [`THIRD-PARTY.md`](THIRD-PARTY.md) trong cùng
commit.

---

## Tài liệu sẽ sinh ra khi chạy quy trình

Chạy các skill BMad sẽ tự sinh tài liệu vào `_bmad-output/planning-artifacts/`. Skill
`babok-business-analysis` nạp thêm hướng dẫn nghiệp vụ vào từng bước, nên mỗi bước sinh thêm những artifact
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

**`babok-business-analysis` thêm vào:**

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

**`babok-business-analysis` thêm vào — theo đúng thứ tự này:**

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

**`babok-business-analysis` thêm vào — bốn artifact:**

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

**`babok-business-analysis` thêm vào — ba artifact, tất cả đều phải lấy từ người thật:**

- **State Model** — vòng đời của từng đối tượng chính, hỏi chuyên gia nghiệp vụ
- **Business Rules** — tách hai loại, đừng gộp:
  - `definitional` — luật không thể vi phạm, chỉ có thể áp dụng sai. Là hàm dẫn xuất hoặc phép
    tính, **không có mức thực thi**
  - `behavioural` — luật luôn có thể bị vi phạm. Mỗi luật chọn một trong **bốn mức thực thi**
- **Roles & Permissions Matrix** — hỏi **cả hai người**, hai câu khác nhau: sponsor trả lời *ai
  được phép*, chuyên gia nghiệp vụ trả lời *thực tế ai đang làm*

---

## Công cụ trong repo

### BMad Method v6.11.0

**`.claude/skills/bmad-*/`** — [BMad Method](https://github.com/bmad-code-org/BMAD-METHOD), 49
skill, chia 4 giai đoạn:

```
1-analysis  →  2-planning  →  3-solutioning  →  4-implementation
```

Bảng lệnh đầy đủ ở `_bmad/bmm/module-help.csv`.

### babok-business-analysis

**`~/.claude/skills/babok-business-analysis/`** — hub tri thức tự viết (junction sang repo nguồn
`babok-bmad-skill`), bổ trợ BMad bằng BABOK v3 ở những chỗ BMad mỏng.

| File | Vai trò |
|---|---|
| `SKILL.md` | Phân loại hình thái bài toán → bộ kỹ thuật tương ứng |
| `workflow.md` | Luồng đầu-cuối: mỗi bước chạy kỹ thuật nào, hỏi ai |
| `data/techniques.csv` | 50 kỹ thuật, kèm `tier` — mức khuyết của BMad |
| `data/gap-baseline.json` | Hồ sơ đo trên bản BMad đang cài, dùng làm mốc so |
| `bmad-overrides/*.toml` | **Nguồn** của 9 file trong `_bmad/custom/` — sửa ở đây, không sửa bản chép |
| `install.py` | Chép override vào `{project}/_bmad/custom/`. Không ghi đè, chạy lại vô hại |
| `verify.py` | 5 phép kiểm: tên kỹ thuật · số hiệu section · gap profile · hai trục · trích dẫn |

**Ba chỗ được bù**, đo trên 247 file của bản cài:

- **Mô hình nghiệp vụ** — sơ đồ quy trình, ma trận vai trò và quyền, sơ đồ tuần tự đều không có
  file nào. BMad đi từ PRD văn xuôi thẳng tới kiến trúc.
- **Khai thác người thật** — danh mục gốc có 71 kỹ thuật, không cái nào để lấy thông tin từ
  người thật. BMad mô phỏng nhân vật để bù cho việc không có người thật.
- **Chỗ mỏng** — bảng từ vựng và yêu cầu phi chức năng.

Không can thiệp chỗ BMad mạnh: tiêu chí nghiệm thu, ưu tiên hoá, user story.

Nguyên văn BABOK không nằm trong repo — bản gốc có bản quyền. Repo chỉ giữ số mục, số trang và
phần diễn giải tự viết.

### Cấu hình

**`_bmad/custom/`** chứa chín file nạp hướng dẫn `babok-business-analysis` vào đúng bước tương
ứng — brief, PRD, kiến trúc, epic & story, UX, review, elicitation, deep recon, project context.
BMad đọc chúng ngay khi khởi động workflow.

Chúng là **bản chép** do `install.py` mang sang. Sửa ở nguồn `bmad-overrides/` của hub rồi chạy
lại install; sửa tại chỗ sẽ mất.

---

## Bản đồ thư mục

```
crm-hackathon-workspace/
├── AGENTS.md                    quy tắc cho agent
├── README.md                    file này
├── CHECKLIST.md                 việc cần làm
├── src/                         mã nguồn sản phẩm CRM
├── .claude/skills/bmad-*/       49 skill BMad (hub BABOK nằm ngoài repo)
├── _bmad/                       cấu hình + 9 file override
├── _bmad-output/                brief, PRD, epic sinh ra ở đây
└── docs/
    ├── Đề bài/                  6 tài liệu BTC phát + phản biện + câu hỏi
    └── CRM clone từ Airtable/   CRM thật của HBLAB, nguồn đối chiếu
```

---

## Bảo trì

Sau mỗi lần update BMad, chạy hai lệnh:

```bash
python ~/.claude/skills/babok-business-analysis/install.py --project-root .
python ~/.claude/skills/babok-business-analysis/verify.py --project-root .
```

Lệnh đầu chép lại override nếu bản cài BMad đổi; nó không ghi đè file sẵn có và chạy lại bao
nhiêu lần cũng vô hại. Lệnh sau kiểm năm phép:

| # | Kiểm gì |
|---|---|
| 1 | Mọi tên kỹ thuật nhắc tới đều nằm trong danh mục 50 |
| 2 | Mọi số hiệu section đúng **định dạng và phạm vi** của BABOK v3 |
| 3 | Gap profile còn khớp baseline của bản BMad đang cài |
| 4 | Kỹ thuật được nối rơi đúng chỗ BMad mỏng — phép quan trọng nhất |
| 5 | Mọi section được trích **có thật** trong sách — cần `--source` |

Phép 5 cần bản BABOK của riêng bạn: `--source <đường-dẫn>`. Không có thì nó báo `[BỎ QUA]`, bốn
phép kia vẫn chạy.

⚠ Không phép nào bắt được **diễn giải sai ngữ nghĩa** — số mục có thật, định dạng đúng, nhưng
nội dung dẫn không đúng ý mục đó. Loại này phải đối chiếu bằng mắt với nguyên văn.

Phần method BABOK nạp qua `additional_methods` trong file override, nên BMad tự gộp lúc resolve
và **không file gốc nào bị đụng** — xem [`THIRD-PARTY.md`](THIRD-PARTY.md).

---

## Nguồn tri thức

Bản ghi nguyên văn BABOK nằm ngoài repo, ở kho cá nhân `PARA/3_Resources/ba/babok-v3/`. Trong
`data/techniques.csv` của hub, cột `tier` cho biết BMad khuyết kỹ thuật đó đến mức nào.
