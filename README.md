# CRM Hackathon Workspace

Repo dự thi **AI Hackathon #01 — Dev Edition**, HBLAB. Thi ngày **15/08/2026**, 9:30–15:00.

Chứa hai thứ: **cách đội làm việc** — bản cài BMad Method, tri thức BABOK nối vào từng bước,
và các skill bù chỗ BMad thiếu — cùng **mã nguồn sản phẩm CRM** khi nó ra đời.

---

## Bắt đầu

```bash
git clone git@github.com:hanhnt2-hblab/crm-hackathon-workspace.git
cd crm-hackathon-workspace
git config core.hooksPath .githooks
python ~/.claude/skills/babok-business-analysis/verify.py --project-root .
```

Đạt khi in `Mọi phép kiểm đạt.` BMad và phần nối đã nằm sẵn trong repo — **không chạy**
`npx bmad-method install`.

**Yêu cầu:** Node ≥ 20.12 · Python ≥ 3.10 · [`uv`](https://docs.astral.sh/uv/) ·
[tabularis](#mcp-cơ-sở-dữ-liệu) trên `PATH`

Đọc theo thứ tự: [`Phản biện và phân tích yêu cầu`](docs/Đề%20bài/Phản%20biện%20và%20phân%20tích%20yêu%20cầu.md)
→ [`chiến lược ngày thi`](docs/chien-luoc-ngay-thi.md) → [`CHECKLIST.md`](CHECKLIST.md) →
[`AGENTS.md`](AGENTS.md)

Nhánh tích hợp là `develop` — **không có `main`**.

---

## Đề bài và phân tích

**Điểm vào là [`docs/Đề bài/Phản biện và phân tích yêu cầu.md`](docs/Đề%20bài/Phản%20biện%20và%20phân%20tích%20yêu%20cầu.md)**
— chốt 47 quyết định `D1`–`D47`, theo dõi 22 điểm mơ hồ `Q1`–`Q22` và 40 mâu thuẫn `F1`–`F40`,
và tự đặt thứ tự ưu tiên khi các tài liệu nói khác nhau. **Đọc Mục 0 trước khi viết dòng mã đầu
tiên.**

| Tài liệu trong `docs/Đề bài/` | Nội dung |
|---|---|
| [Yêu cầu đề bài chính thức](docs/Đề%20bài/Yêu%20Cầu%20đề%20bài%20chính%20thức%20của%20cuộc%20thi%20prd.md) | PRD "AI Native CRM" — sáu nhóm tính năng, `T-1`…`T-10`, điều kiện nộp `§7` |
| [0. Thể lệ](docs/Đề%20bài/0.%20Thể%20lệ%20AI%20Hackathon%2001%20-%20Dev%20Edition.md) | Ba vòng chấm, agenda ngày thi, cơ cấu giải |
| [3. Checklist chấm điểm](docs/Đề%20bài/3.%20Checklist%20chấm%20điểm%20AI-Hackathon.md) | Barem — 5 cột × 4 mức, và ba Quality Gate |
| [1. Business Playbook](docs/Đề%20bài/1.%20Business%20Playbook%20-%20quy%20trình%20sales.md) | Sales B2B ngành ITO — đọc trước |
| [2. Thiết kế phần mềm AI-Native](docs/Đề%20bài/2.%20Thiết%20kế%20phần%20mềm%20thế%20hệ%20AI%20Native%20-%20phương%20pháp%20luận.md) | Từ CRUD sang Ontology |
| [4. Hỏi đáp thông tin cuộc thi](docs/Đề%20bài/4.%20Hỏi%20đáp%20thông%20tin%20cuộc%20thi.md) | Giải đáp của BTC, và danh sách giám khảo vòng 3 |
| [Câu hỏi gửi ban tổ chức](docs/Đề%20bài/Câu%20hỏi%20gửi%20ban%20tổ%20chức.md) · [Câu hỏi cho giám khảo vòng 3](docs/Đề%20bài/Câu%20hỏi%20cho%20ban%20giám%20khảo%20vòng%203.md) | Câu đã gửi và chỗ ghi trả lời |

`docs/CRM clone từ Airtable/` là CRM thật của HBLAB — nguồn đối chiếu khi cần một con số đã có
người trả giá, thay vì tự suy ra.

---

## Mã nguồn

`src/` — **chưa tồn tại, stack chưa chốt.** Chốt xong thì bổ sung lệnh build, test và run vào đây
và vào [`AGENTS.md`](AGENTS.md) mục *Running and verifying*.

Mang mã từ ngoài vào thì ghi nguồn và license vào [`THIRD-PARTY.md`](THIRD-PARTY.md) trong cùng
commit.

---

## Luồng phát triển

Đây là chuỗi thật sự chạy, lấy từ cột `preceded-by` của `_bmad/bmm/module-help.csv`. Năm bước
đánh dấu **bắt buộc** là do BMad quy định, không phải đội tự đặt.

```
CB ─→ PRD ─→ CU ─→ CA ─→ CE ─→ SP ─→ BD ─┬─→ CR ──→ ER
                                          └─→ QA ──→ hackathon-deploy
```

| # | Bước | Mã | Sinh ra | Lớp nối thêm | Cột barem |
|---|---|---|---|---|---|
| 1 | Product brief | `CB` | brief · addendum · memlog | **BABOK** — Document Analysis, bảng định tuyến câu hỏi theo vai, công tắc người-thật | Requirement 20 |
| 2 | PRD **(bắt buộc)** | `PRD` | prd · addendum · review | **BABOK** — Concept Model, Process Model as-is/to-be, NFR có ngưỡng số | Requirement 20 |
| 3 | UX | `CU` | ux design | **BABOK** — Use Cases & Scenarios, Observation, Prototyping | Design 20 |
| 4 | Kiến trúc **(bắt buộc)** | `CA` | architecture · memlog | **BABOK** — Data Model ba tầng, Data Dictionary, Interface Analysis, **Decision Analysis** (ma trận quyết định có trọng số) | Design 20 |
| 5 | Epic & story **(bắt buộc)** | `CE` | epics · stories | **BABOK** — khung căn cứ ưu tiên | Requirement 20 |
| 6 | Sprint planning **(bắt buộc)** | `SP` | sprint status | — | — |
| 7 | Build **(bắt buộc)** | `BD` | mã · spec thực thi | **Đội** — tra `D1`–`D47` trước khi tự quyết · ranh giới `§5` chặn ở tầng nghiệp vụ · `D40` đọc trước khi giữ · ghi memlog | Development 25 |
| 8 | Code review | `CR` | phát hiện đã phân loại | **Đội** — đối chiếu `D1`–`D47` · ghi memlog | Development 25 |
| 9 | Sinh e2e test | `QA` | bộ kiểm thử | **Đội** — **EP/BVA** trên enum và trường nhập liệu · self-healing tối đa ba vòng · khẳng định trạng thái CSDL qua MCP · ghi memlog | Testing 20 |
| 10 | **Triển khai** | *(không có trong BMad)* | Dockerfile · CI · production config | **`hackathon-deploy`** cộng bốn skill mượn | **Deployment 15** |
| 11 | Retrospective | `ER` | retrospective | — | — |

**Bước 10 là chỗ BMad để trống.** Bốn phase của nó — `plan · 2-planning · ship · anytime` — không
phase nào dẫn tới triển khai và không skill nào sinh artifact triển khai. Đó là lý do
`hackathon-deploy` tồn tại: nó nối vào sau `QA`, và chỉ ở đó.

### Ba lớp chồng lên nhau

- **BMad** cho khung và thứ tự các bước.
- **Hub BABOK** nối vào **năm bước đầu** — toàn bộ nửa lập kế hoạch. Không chạm vào `BD`, `CR`,
  `QA`: hub được đo để bù chỗ BMad mỏng về *phân tích nghiệp vụ*, không phải về thực thi.
- **Ba override của đội** nối vào **đúng ba bước hub bỏ trống**, và cùng ghi vào một bản ghi
  quyết định chung `_bmad-output/implementation-artifacts/.memlog.md`.

### Chạy bất kỳ lúc nào

`PC` project-context (BABOK) · `SPC` spec · `CC` correct-course · `SS` sprint status ·
`CK` checkpoint. Ba override BABOK nữa gắn vào skill không nằm trong bảng lệnh:
`bmad-advanced-elicitation`, `bmad-deep-recon`, `bmad-review`.

### Vì sao luồng này khớp với cách chấm

Cột cuối bảng trên không phải trang trí: **mỗi cột barem vòng 1 có ít nhất một bước sinh log cho
nó.** Bỏ một bước là bỏ trắng một cột — và vòng 1 chấm tự động bằng cách đọc log, nên bước không
chạy thì cột đó không có gì để chấm.

---

## Công cụ trong repo

### BMad Method 6.11.0 — `.claude/skills/bmad-*/`

**49 skill**, chia bốn phase `plan · 2-planning · ship · anytime`. Bảng lệnh đầy đủ ở
`_bmad/bmm/module-help.csv`.

### Hub BABOK — ngoài repo

`~/.claude/skills/babok-business-analysis/` là junction sang repo nguồn `babok-bmad-skill`. Nó bổ
trợ BMad ở những chỗ BMad mỏng về phân tích nghiệp vụ.

| Tệp của hub | Vai trò |
|---|---|
| `SKILL.md` | Phân loại hình thái bài toán → bộ kỹ thuật tương ứng |
| `workflow.md` | Luồng đầu-cuối: mỗi bước chạy kỹ thuật nào, hỏi ai |
| `data/techniques.csv` | 50 kỹ thuật, cột `tier` cho biết BMad khuyết tới mức nào |
| `data/gap-baseline.json` | Hồ sơ đo trên bản BMad đang cài, dùng làm mốc so |
| `bmad-overrides/*.toml` | **Nguồn** của 9 trong 12 tệp ở `_bmad/custom/` |
| `install.py` · `verify.py` | Chép override sang project · kiểm 5 phép |

Nguyên văn BABOK **không** nằm trong repo — bản gốc ghi *"Not for Distribution or Resale"*. Repo
chỉ giữ số mục, số trang và phần diễn giải tự viết.

### Skill bù chỗ BMad thiếu — `.claude/skills/`

BMad không có bước deployment nào trong bốn phase của nó, trong khi barem chấm cột đó **15 điểm**
và `§7.3` biến nó thành điều kiện nộp bài.

| Skill | Nguồn | Vai trò |
|---|---|---|
| `hackathon-deploy` | đội tự viết | Nói bốn skill dưới đây dùng phần nào, **bỏ phần nào**, và bù phần Dockerfile / lệnh một-bước |
| `ci-cd-and-automation` | addyosmani | Cổng chất lượng, `.env.example` |
| `security-and-hardening` | addyosmani | Threat model, OWASP |
| `shipping-and-launch` | addyosmani | Checklist tiền phát hành, ngưỡng rollback |
| `observability-and-instrumentation` | addyosmani | Structured logging, cảnh báo có ngưỡng |

Bốn skill mượn là **bản chép** — `skills-lock.json` giữ nguồn và hash từng tệp. Không sửa tại chỗ;
cần chỉnh thì viết đè trong `hackathon-deploy`. Chi tiết license ở [`THIRD-PARTY.md`](THIRD-PARTY.md).

### Override — `_bmad/custom/`

**12 tệp**, BMad đọc ngay khi khởi động workflow. Hai loại, đầu mỗi tệp có dòng khai báo:

- **9 tệp từ hub** — brief · PRD · kiến trúc · epic & story · UX · review · elicitation · deep
  recon · project context. Là bản chép: sửa ở `bmad-overrides/` của hub rồi chạy lại `install.py`;
  sửa tại chỗ sẽ mất.
- **3 tệp đội tự viết** — `bmad-build` · `bmad-code-review` · `bmad-qa-generate-e2e-tests`. Hub
  không quản, sửa thẳng. Chúng bù hai chỗ barem gọi tên mà bản cài không có: sinh test theo
  **Equivalence Partitioning / Boundary Value Analysis**, và **bản ghi quyết định** cho nửa thực thi.

### MCP cơ sở dữ liệu

`.mcp.json` khai báo `tabularis` bằng **lệnh trần**, không phải đường dẫn tuyệt đối, để mọi máy
dùng chung một khai báo. Cài tabularis rồi đưa thư mục chứa nó vào `PATH` — trên Windows mặc định
là `%LOCALAPPDATA%\tabularis\`.

Dùng để khẳng định thẳng trạng thái cơ sở dữ liệu khi kiểm `T-4`, `T-8`, `T-9` — ba điểm nghiệm
thu nói về **dữ liệu**, không về màn hình. Chỉ đọc, không ghi.

---

## Bố cục

```
crm-hackathon-workspace/
├── AGENTS.md              quy tắc cho agent — nạp mỗi phiên
├── README.md              file này
├── CHECKLIST.md           việc cần làm trước và trong ngày thi
├── THIRD-PARTY.md         license và ràng buộc nhãn hiệu
├── LICENSE
├── .mcp.json              khai báo MCP tabularis
├── .gitattributes         chốt đầu dòng LF, đánh dấu cây vendored
├── .githooks/             post-merge tự đồng bộ phần nối BABOK
├── skills-lock.json       nguồn và hash của bốn skill mượn
├── .claude/skills/        49 skill BMad + 6 skill khác
├── _bmad/                 cấu hình BMad + 12 override
├── _bmad-output/          brief, PRD, epic, memlog sinh ra ở đây
└── docs/
    ├── Đề bài/            tài liệu BTC phát + phản biện + câu hỏi
    ├── CRM clone từ Airtable/   CRM thật của HBLAB
    └── chien-luoc-ngay-thi.md   thứ tự làm việc và vì sao
```

`BABOK_Guide_v3_Member.txt` nằm ở gốc nhưng **đã gitignore** — bản có bản quyền, không commit.

---

## Bảo trì

Sau mỗi lần update BMad, chạy hai lệnh — bật hook ở phần Bắt đầu thì chúng tự chạy:

```bash
python ~/.claude/skills/babok-business-analysis/install.py --project-root .
python ~/.claude/skills/babok-business-analysis/verify.py --project-root .
```

Lệnh đầu chép lại override nếu bản cài BMad đổi; nó không ghi đè tệp sẵn có và chạy lại bao nhiêu
lần cũng vô hại. Lệnh sau kiểm năm phép:

| # | Kiểm gì |
|---|---|
| 1 | Mọi tên kỹ thuật nhắc tới nằm trong danh mục 50 |
| 2 | Mọi số hiệu section đúng **định dạng và phạm vi** BABOK v3 |
| 3 | Gap profile còn khớp baseline của bản BMad đang cài |
| 4 | Kỹ thuật được nối rơi đúng chỗ BMad mỏng — **phép quan trọng nhất** |
| 5 | Mọi section được trích **có thật** trong sách — cần `--source <đường-dẫn>` |

Không có `--source` thì phép 5 báo `[BỎ QUA]`, bốn phép kia vẫn chạy.

⚠ **Không phép nào bắt được diễn giải sai ngữ nghĩa** — số mục có thật, định dạng đúng, nhưng nội
dung dẫn không đúng ý mục đó. Loại này phải đối chiếu bằng mắt với nguyên văn.

Xem trước install sẽ chèn gì mà chưa ghi: thêm `--check`.

---

## Nguồn tri thức

Bản ghi nguyên văn BABOK nằm ngoài repo, ở kho cá nhân `PARA/3_Resources/ba/babok-v3/`. Ai cần
chiều sâu một kỹ thuật thì tra trong **bản BABOK của chính mình**, theo số section trong
`data/techniques.csv` của hub.
