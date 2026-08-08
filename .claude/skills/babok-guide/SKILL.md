---
name: babok-guide
description: 'Bổ trợ BMad bằng tri thức BABOK v3 ở đúng những chỗ BMad khuyết. Dùng khi đang chạy một skill BMad và cần tầng mô hình nghiệp vụ (quy trình, trạng thái, quy tắc, quyền, dữ liệu) mà BMad không sinh ra; khi có chuyên gia nghiệp vụ thật trong phòng và cần thay mô phỏng persona bằng khai thác trực tiếp; khi cần biết câu hỏi này nên hỏi ai; hoặc khi hỏi "BABOK nói gì về", "kỹ thuật nào cho việc này".'
---

# BABOK v3 — lớp bổ trợ cho BMad

Skill này **không phải bản sao BABOK** và **không lặp lại việc BMad đã làm tốt**. Nó vá đúng
ba khuyết điểm đã đo được của BMad v6.10.0.

Nguyên tắc: BMad mạnh chỗ nào thì **không can thiệp**. Đo trước, bù sau.

## Gap profile

> **Đo trên bản cài** `.claude/skills/` — BMad **v6.10.0**, ngày **2026-08-08**, quét 234 file,
> **loại `bmad-advanced-elicitation/methods.csv`** vì đó là 12 method skill này tự chèn.
> Baseline lưu ở `scripts/gap-baseline.json`.
> Đo lại sau mỗi lần update BMad: `python scripts/check-install.py`

⚠ Số cũ trong các phiên bản trước của file này đo trên **source GitHub**, lệch với bản cài ở
**12/14 khái niệm**. Đừng dùng lại số đó.

| Khái niệm | Section | File | Đánh giá |
|---|---|---|---|
| process model · roles & permissions matrix · sequence diagram | `10.35` `10.39` `10.42` | **0** | **absent** |
| business rule · document analysis · focus group · state model · workshop | `10.9` `10.18` `10.21` `10.44` `10.50` | 2 | **absent** |
| glossary | `10.23` | 5 | thin |
| non-functional | `10.30` | 7 | thin |
| data model · lessons learned | `10.15` `10.27` | 11 | covered |
| brainstorming | `10.5` | 20 | covered |
| acceptance criteria · prioritization · user stories | `10.1` `10.33` `10.48` | 23 | covered |
| persona | `10.43` | 45 | covered |

**Sắc thái quan trọng:** `data model` là `covered` (11 file) nhưng **artifact ERD chỉ có 1 file**.
`bmad-architecture/assets/spine-template.md` ghi *"core-entity ERD (names + relationships only;
an attribute that's itself an invariant is an AD, not a diagram)"* — loại thuộc tính là **cố ý**,
không phải thiếu sót. Nên `10.15` được tiêm với lý do *"khi cần hơn mức spine"* (cardinality,
thuộc tính, ba tầng conceptual/logical/physical), không phải *"BMad quên"*.

**Bốn kỹ thuật không đo được bằng từ khoá** — từ quá thông thường, mọi pattern đều cho dương
tính giả: `10.25` Interviews · `10.31` Observation · `10.37` Reviews · `10.45` Survey. Cột
`bmad_gap` để **trống** cho chúng. Bằng chứng thay thế, mạnh hơn: catalog elicitation có **71
method, không cái nào là kỹ thuật khai thác người thật**.

Cột `bmad_gap` trong `assets/techniques.csv` mang kết quả này ở mức từng kỹ thuật:
`absent` · `thin` · `covered` · rỗng = **chưa đo hoặc không đo được, đừng suy diễn**.

```
grep "absent" assets/techniques.csv     # nhung gi BMad khong co
```

## Bốn chức năng

### 1 · Tầng mô hình nghiệp vụ — khuyết điểm lớn nhất

BMad đi từ PRD dạng văn xuôi **thẳng tới** architecture. Không có tầng mô hình nghiệp vụ ở
giữa. Năm kỹ thuật lấp vào, đầu ra là **input cho `bmad-spec` và `bmad-architecture`**:

| Kỹ thuật | Section | Đầu ra | Nạp vào |
|---|---|---|---|
| Process Modelling | 10.35 | Quy trình đầu-cuối | `bmad-prd` |
| State Modelling | 10.44 | Trạng thái + chuyển tiếp cho phép | `bmad-spec` |
| Business Rules Analysis | 10.9 | Luật điều khiển quyết định | `bmad-spec` |
| Roles and Permissions Matrix | 10.39 | Vai × hành động | `bmad-spec` |
| Data Modelling | 10.15 | Entity + quan hệ | `bmad-architecture` |

**Luồng làm việc đầu-cuối với BMad — bắt đầu ở đây:**
[references/workflow.md](references/workflow.md). Nó ghi rõ ở mỗi bước BMad (`GPC` `CB` `PRD` `CU`
`CA` `CE` `IR` `SP` `CS` `DS`) thì chạy kỹ thuật BABOK nào, hỏi ai, và giao lại artifact gì.

Chi tiết BMad khuyết gì ở từng bước: [references/bmad-gap-map.md](references/bmad-gap-map.md)

### 2 · Công tắc người-thật

BMad **mô phỏng nhiều góc nhìn để bù cho việc không có người thật**. Bằng chứng:
`bmad-party-mode` tự mô tả là *"AI focus-group panel"*; catalog có `Stakeholder Round Table`
và `Stakeholder Lens Rotation` nhưng **không có một kỹ thuật khai thác người thật nào**.

Khi có chuyên gia nghiệp vụ ngồi cùng phòng, mô phỏng là lựa chọn **kém hơn**. Quy tắc:

> Có chuyên gia thật trả lời được câu hỏi này → **hỏi họ**, đừng chạy persona simulation.
> Chỉ mô phỏng khi không ai có mặt hoặc cần góc nhìn của vai không tồn tại trong team.

| Thay vì | Dùng |
|---|---|
| Stakeholder Round Table / party-mode | Workshops `10.50` — người thật, có điều phối |
| Stakeholder Lens Rotation | Interviews `10.25` — hỏi từng người |
| Suy đoán quy tắc nghiệp vụ | Business Rules Analysis `10.9` hỏi trực tiếp |

Cài cứng quy tắc này vào BMad qua `preferences` trong
[references/bmad-custom/bmad-advanced-elicitation.toml](references/bmad-custom/bmad-advanced-elicitation.toml).

### 3 · Định tuyến câu hỏi theo vai

Để mỗi người đóng góp đúng chỗ mạnh nhất. Vai theo BABOK `2.4`, nên bảng này dùng lại được
cho dự án khác — chỉ đổi tên người.

| Cần làm gì | Vai trả lời được | Vì họ nắm |
|---|---|---|
| Scope, thứ tự ưu tiên, thứ tự cắt | **Sponsor** `2.4.9` | Nguyên văn: *"control the budget and scope"* |
| Quy trình, trạng thái, quy tắc, thuật ngữ | **Domain SME** `2.4.3` | Nguyên văn nêu *"managers, process owners"* |
| Thao tác thực tế, số field, số click | **End User** `2.4.4` | Nguyên văn: *"directly interact with the solution"* |
| Data model, NFR, khả thi, ước lượng | **Implementation SME** `2.4.5` | Nguyên văn liệt kê *developer, solution architect* |
| Cách verify | **Tester** `2.4.11` | Verify *"requirements defined by the business analyst"* |

**Hai bẫy khi định tuyến:**

- **Roles matrix cần hỏi hai người.** *"Ai **được** thấy gì"* là câu của Sponsor (quyền).
  *"Ai **cần** thấy gì"* là câu của Domain SME (công việc). Hỏi một người thì thiếu một nửa.
- **Domain SME không tự động là End User.** `2.4.3` nói *managers, process owners*; `2.4.4`
  đòi *directly interact*. Một trưởng bộ phận chỉ là End User nếu họ thật sự dùng hằng ngày —
  kiểm chứng, đừng giả định.

Khi một người giữ nhiều vai: `2.4` cho phép — *"a single individual may fill more than one
role"* — nhưng mối kiểm tra giữa hai vai bị gộp thì mất. Đáng chú ý nhất là **BA + Tester**,
vì `2.4.11` giả định Tester verify yêu cầu *do người khác* định nghĩa.

### 4 · Chốt chất lượng ở chỗ BMad mỏng

| Chỗ mỏng | Kỹ thuật | Chốt |
|---|---|---|
| non-functional (7 file) | `10.30` | Mỗi quality attribute phải có **ngưỡng đo được**, không phải tính từ |
| glossary (5 file) | `10.11` + `10.23` | Thuật ngữ chốt **trước** khi vào schema |
| traceability (7 file) | — | Mỗi story truy được về một yêu cầu, mỗi yêu cầu về một nhu cầu |

## Chiều sâu lấy ở đâu

Skill này cố tình chỉ giữ tên + section + hướng dẫn. Nguyên văn nằm ở kho cá nhân:

```
C:\Workspace\PARA\3_Resources\ba\babok-v3\
```

Cột `cached` trong `techniques.csv` cho biết kỹ thuật nào đã có bản ghi. Thiếu thì sinh bằng
`QUERY-TEMPLATE.md` trong thư mục đó — **một query cho một kỹ thuật, không gộp** (đã kiểm
chứng: gộp làm sụp chất lượng).

## Cài vào BMad

Sau `npx bmad-method install`, chạy **hai** bước — hai cơ chế khác nhau:

```bash
# 1. Override cho PRD / Architecture / Spec
cp .claude/skills/babok-guide/references/bmad-custom/bmad-{prd,architecture,spec,product-brief}.toml _bmad/custom/

# 2. Chèn 12 method BABOK vào catalog elicitation
python .claude/skills/babok-guide/scripts/apply-methods.py
```

| Cơ chế | File | Tác dụng |
|---|---|---|
| `persistent_facts` | 4 file `.toml` trong `_bmad/custom/` | BMad nạp `workflow.md` + ràng buộc riêng của bước đó ngay khi khởi động |
| Chèn CSV | `apply-methods.py` | 12 method BABOK nổi trong menu elicitation ở mọi checkpoint |

`persistent_facts` là **append-merge**, nên dòng mặc định `file:{project-root}/**/project-context.md`
vẫn được giữ. Đã kiểm bằng `resolve_customization.py`: PRD 8 entry, CA 9, SPC 9.

⚠ **Vì sao elicitation phải chèn CSV chứ không dùng override.** Source trên GitHub của
`bmad-advanced-elicitation` có `customize.toml` và `scripts/pick_methods.py` hỗ trợ
`additional_methods`. Nhưng **bản cài bằng `npx bmad-method install` v6.10.0 không có hai thứ
đó** — chỉ có `SKILL.md` + `methods.csv`, và SKILL.md đọc thẳng `./methods.csv`. Override sẽ vô
tác dụng.

⚠ **Chạy lại `apply-methods.py` sau mỗi lần cập nhật BMad** — update ghi đè `methods.csv` và xoá
mất các method BABOK. Script idempotent, chạy thừa không sao.

Cố ý **không** thêm override cho `bmad-create-epics-and-stories` và `bmad-build` — BMad đã mạnh ở
đó (`acceptance criteria` 30 file), nạp thêm chỉ tốn context.

Dùng tên `.toml` cho cả team; đổi thành `.user.toml` nếu chỉ muốn áp cho riêng mình.

## Hai điều bắt buộc tôn trọng

**Không copy nguyên văn BABOK vào repo này.** Nguồn mang dòng *"Complimentary IIBA Member
Copy. Not for Distribution or Resale."* Số section và diễn giải tự viết thì được; prose
nguyên văn thì không. Ai cần chiều sâu tự tra bản của họ.

**Phân biệt dữ liệu đã kiểm chứng với đánh giá.** Đã kiểm chứng: số section, số trang, gap
profile, các trích dẫn `2.4`. Là đánh giá của người viết: cột `crm_priority`, cột
`bmad_phase`, và toàn bộ bảng định tuyến ở chức năng 3. Cứ sửa nếu thấy sai.
                