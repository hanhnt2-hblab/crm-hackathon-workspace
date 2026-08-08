# CRM Hackathon Workspace

Bộ công cụ và tài liệu cho hackathon phát triển CRM — deadline **2026-08-15**.

Repo này **không chứa mã nguồn sản phẩm CRM**. Nó chứa *cách chúng ta làm việc*: quy trình AI
hỗ trợ phát triển, tri thức phân tích nghiệp vụ, chiến lược triển khai và phân công vai trò.

---

## Cài

BMad và bản vá đã nằm sẵn trong repo — **không cần chạy `npx bmad-method install`**.

```bash
git clone <repo> && cd crm-hackathon-workspace
git config core.hooksPath .githooks                              # tự đồng bộ sau khi pull
python .claude/skills/babok-guide/scripts/check-install.py       # xác minh môi trường
```

Đạt khi báo `Moi thu khop voi ban cai` và 4/4 mục `[OK]`.

Yêu cầu: Node ≥ 20.12 · Python ≥ 3.10 · [`uv`](https://docs.astral.sh/uv/)

---

## Thành phần

### 1 · Công cụ — AI workflow framework

**`.claude/skills/bmad-*/`** — [BMad Method](https://github.com/bmad-code-org/BMAD-METHOD)
**v6.10.0**, 46 skill. Framework điều phối quy trình phát triển bằng AI agent, chia 4 phase:

```
1-analysis  →  2-planning  →  3-solutioning  →  4-implementation
CB brief       PRD ★ CU ux    CA ★ CE ★ IR ★    SP ★ CS ★ DS ★ CR QA ER
```

★ = bắt buộc. Bảng lệnh đầy đủ ở `_bmad/bmm/module-help.csv`.

**Đã sửa so với bản gốc:** `bmad-advanced-elicitation/methods.csv` được chèn thêm 12 method
BABOK (71 → 83). Xem mục 2.

> 📌 **Chỗ để so sánh framework khác** — spec kit, hoặc framework triển khai phần mềm khác —
> là `docs/tooling/`. Hiện chưa có nội dung.

### 2 · Tri thức phân tích nghiệp vụ

**`.claude/skills/babok-guide/`** — skill tự viết, bổ trợ BMad bằng BABOK v3 ở **đúng những
chỗ BMad khuyết**, đo được chứ không phỏng đoán.

| File | Vai trò |
|---|---|
| `SKILL.md` | Gap profile đo trên bản cài + 4 chức năng bù |
| `assets/techniques.csv` | 50 kỹ thuật chương 10, kèm section, số trang, mức khuyết của BMad |
| `references/steps/*.md` | Hướng dẫn từng bước — nạp riêng cho từng skill, không nạp cả file |
| `references/workflow.md` | Luồng đầu-cuối: mỗi bước BMad chạy kỹ thuật BABOK nào, hỏi ai |
| `references/bmad-gap-map.md` | BMad khuyết gì ở từng bước |
| `references/bmad-custom/*.toml` | 4 override + bản tiêm catalog |
| `scripts/apply-methods.py` | Chèn 12 method vào catalog BMad |
| `scripts/check-install.py` | Kiểm skill còn khớp bản cài BMad |
| `scripts/gap-baseline.json` | Mốc so sánh, phát hiện BMad đổi |

**Ba khuyết điểm được bù**, đo trên 234 file của bản cài:

- **Tầng mô hình nghiệp vụ** — `process model`, `roles & permissions matrix`,
  `sequence diagram` đều **0 file**. BMad đi từ PRD văn xuôi thẳng tới architecture.
- **Khai thác người thật** — catalog gốc 71 method, **0** kỹ thuật lấy thông tin từ người
  thật. BMad mô phỏng persona để bù cho việc không có stakeholder.
- **Chỗ mỏng** — `glossary` 5 file, `non-functional` 7 file.

**Không can thiệp** chỗ BMad mạnh: `acceptance criteria` 23 file, `prioritization` 23,
`user stories` 23.

**Độ phủ của phép đo — nói rõ để khỏi hiểu nhầm:** chỉ **17/50** kỹ thuật đo được bằng từ
khoá. Cột `bmad_gap` có bốn giá trị:

| Giá trị | Nghĩa | Số dòng |
|---|---|---|
| `absent` · `thin` · `covered` | Đã đo, phân loại theo ngưỡng 3 và 8 | 17 |
| `unmeasurable` | Từ khoá quá thông thường, mọi pattern đều cho dương tính giả | 4 |
| *(trống)* | **Chưa đo** — đừng suy diễn từ ô trống | 29 |

Bốn kỹ thuật `unmeasurable` là `10.25` Interviews · `10.31` Observation · `10.37` Reviews ·
`10.45` Survey. Với chúng có một bằng chứng khác mạnh hơn: catalog elicitation của BMad có
**71 method, không cái nào là kỹ thuật khai thác người thật**.

⚠ Nguyên văn BABOK **không** nằm trong repo này. Nguồn mang dòng *"Complimentary IIBA Member
Copy. Not for Distribution or Resale."* Repo chỉ giữ số section, số trang và diễn giải tự
viết. Ai cần chiều sâu tự tra bản của mình.

### 3 · Cấu hình BMad

**`_bmad/`** — config, resolver script, và **`_bmad/custom/`** chứa 4 file override:

| File | Nạp gì vào bước nào |
|---|---|
| `bmad-product-brief.toml` | `CB` — Document Analysis 10.18, công tắc người-thật, định tuyến theo vai |
| `bmad-prd.toml` | `PRD` — glossary trước luật, tách as-is/to-be, NFR có ngưỡng |
| `bmad-architecture.toml` | `CA` — 5 thuộc tính interface, 3 tầng data model, tách luật khỏi luồng |
| `bmad-spec.toml` | `SPC` — 4 mức thực thi luật, state transition, roles matrix hỏi 2 người |

Cơ chế: `persistent_facts` — BMad nạp file hướng dẫn **của riêng bước đó**
(`references/steps/*.md`, mỗi file 2.6–4.4 KB) cùng các ràng buộc, ngay khi khởi động
workflow. Đã xác minh chạy thật.

Cố ý **không** nạp cả `workflow.md` (10.8 KB × 4 skill = 43 KB) — tách theo bước giảm 68%
chi phí ngữ cảnh mà không mất thông tin nào cần cho bước đang chạy.

### 4 · Chiến lược phát triển dự án 📌 *chưa có nội dung*

**`docs/strategy/`** — chưa có nội dung. Dự kiến chứa:

- Các chiến lược phát triển được cân nhắc, kèm đánh đổi
- **Plan triển khai theo từng chiến lược** — mốc thời gian, thứ tự việc, điều kiện chuyển
- Tiêu chí chọn chiến lược cho hackathon 1 tuần

Đây là phần **quan trọng nhất với hackathon**: thời gian ngắn thì chọn sai chiến lược tốn
hơn nhiều so với viết code chậm.

### 5 · Công cụ và framework 📌 *chưa có nội dung*

**`docs/tooling/`** — dự kiến chứa:

- **AI workflow framework**: BMad Method (đang dùng), spec kit, và các lựa chọn khác — so
  sánh, khi nào hợp cái nào
- **Framework triển khai phần mềm**: stack, thư viện, công cụ CI/CD
- Tiêu chí đánh giá và lý do chọn

### 6 · Phân công vai trò 📌 *chưa có nội dung*

**`docs/roles/`** — dự kiến chứa: ai làm gì, ai quyết gì, ai trả lời câu hỏi nào.

Nền tham chiếu có sẵn: BABOK `2.4` định nghĩa 11 vai chung. Bảng định tuyến câu hỏi theo vai
đã có trong `babok-guide/SKILL.md` mục 3 — dùng lại được, chỉ cần điền tên người.

Lưu ý từ `2.4`: *"a single individual may fill more than one role"* — cho phép, nhưng mối
kiểm tra giữa hai vai bị gộp thì mất. Đáng chú ý nhất là **BA + Tester**, vì `2.4.11` giả
định Tester kiểm yêu cầu **do người khác** định nghĩa.

### 7 · Nghiên cứu kiến trúc software mới 📌 *chưa có nội dung*

**`docs/architecture/`** — dự kiến chứa: khảo sát kiến trúc, pattern, đánh giá phù hợp với
CRM và với ràng buộc 1 tuần.

BMad có sẵn `TR` technical-research và `DR` domain-research ở phase `1-analysis` để hỗ trợ
phần này.

---

## Bản đồ thư mục

```
crm-hackathon-workspace/
├── README.md                    file này
├── CHECKLIST.md                 việc cần làm, theo nhóm
├── LICENSE                      MIT cho nội dung của repo
├── THIRD-PARTY.md               license bên thứ ba (BMad)
├── .githooks/                   post-merge tự đồng bộ bản vá
├── .claude/skills/
│   ├── babok-guide/             ← mục 2 (SKILL.md · assets · references · scripts)
│   └── bmad-*/                  ← mục 1 (46 skill)
├── _bmad/                       ← mục 3
│   ├── custom/                  4 file override
│   ├── bmm/ core/               config + bảng lệnh
│   └── scripts/                 resolver
├── _bmad-output/                brief, PRD, epic — **được track**, là sản phẩm chung
└── docs/
    ├── strategy/                ← mục 4 📌
    ├── tooling/                 ← mục 5 📌
    ├── roles/                   ← mục 6 📌
    └── architecture/            ← mục 7 📌
```

⚠ `_bmad/bmm/config.yaml` đặt `project_knowledge: {project-root}/docs`, nên
`bmad-generate-project-context` sẽ ghi `kernel.md` vào **thẳng `docs/`**. Bốn thư mục con
nằm cạnh nó, không đè nhau.

---

## Bảo trì

Sau **mỗi** lần update BMad, chạy hai lệnh:

```bash
python .claude/skills/babok-guide/scripts/apply-methods.py
python .claude/skills/babok-guide/scripts/check-install.py
```

Update **ghi đè `methods.csv`** và xoá mất 12 method BABOK. Lệnh đầu chèn lại (idempotent),
lệnh sau kiểm **7 mục**:

| # | Kiểm gì | Bắt được lỗi nào |
|---|---|---|
| 1 | Catalog còn đủ 12 method BABOK | Update BMad ghi đè `methods.csv` |
| 2 | 4 override resolve được | Override không được nạp |
| 3 | **Diff nguồn ↔ bản cài từng cặp file** | Nguồn đúng mà bản cài là bản cũ — cùng số dòng nên đếm không phát hiện được |
| 4 | Tên skill và mã lệnh trong `workflow.md` | BMad đổi tên skill (`bmad-build` → `CS`/`DS`) |
| 5 | **Mọi số hiệu section tồn tại trong văn bản BABOK** | Trích dẫn lệch cấp hoặc bịa section |
| 6 | **Mỗi fact trích BABOK có dấu phân định nguồn** | Gán kinh nghiệm thực hành cho BABOK |
| 7 | Gap profile lệch baseline bao nhiêu | BMad bổ sung hoặc bỏ tính năng |

Mục 5 cần bản `BABOK_Guide_v3_Member.txt` — file có bản quyền, **không nằm trong repo**.
Truyền qua `--babok-txt <đường-dẫn>` hoặc biến môi trường `BABOK_TXT`. Không có thì mục này
báo bỏ qua, các mục khác vẫn chạy.

**Giới hạn của mục 5 và 6:** chúng bắt được *section không tồn tại* và *chưa ai phân định
nguồn*. Chúng **không** bắt được *diễn giải sai ngữ nghĩa* — hai loại đó cần đọc hiểu, phải
đối chiếu bằng mắt với nguyên văn.

**Vì sao cần:** skill này ban đầu được dựng theo **source GitHub** của BMad chứ không phải
**bản cài**, và hai thứ khác nhau đáng kể — đã gây 4 lỗi thật, gồm cả việc gap profile lệch
ở 12/14 khái niệm. `check-install.py` biến cả lớp lỗi đó thành một lệnh.

---

## Nguồn tri thức

Bản ghi nguyên văn BABOK (có số section, kiểm chứng bằng citation) nằm **ngoài repo**, ở kho
cá nhân `PARA\3_Resources\ba\babok-v3\`. Cột `cached` trong `techniques.csv` cho biết kỹ
thuật nào đã có bản ghi.

Sinh bản ghi mới: dùng `QUERY-TEMPLATE.md` trong kho đó — **một query cho một kỹ thuật,
không gộp**.
