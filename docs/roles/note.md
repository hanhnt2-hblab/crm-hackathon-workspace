**Khung BABOK dùng ở đây:**

| Kỹ thuật | Dùng để làm gì |
|---|---|
| `10.33.3.3` Time Boxing | Xuất phát từ **năng lực có sẵn**, không từ danh sách việc muốn làm |
| `10.39` Roles and Permissions Matrix | Phân vai, và **phát hiện vai còn thiếu** |
| `10.39.3.2` | Cấp dự án dùng **RACI**, cấp hệ thống mới dùng CRUD — không lẫn tầng |
| `2.4` Stakeholders | Định tuyến câu hỏi theo vai |

`10.39.3.1` cảnh báo: **chức danh không phải vai trò** — *"individuals with the same job title
may have different roles"*. Nên bảng dưới ghi vai, không ghi chức danh.

**Cả ba đều làm BA.** Đây là điểm mạnh nhất của đội: BABOK coi BA là **vai**, không phải chức
danh, nên ba người cùng phân tích là hợp lệ và cho ba góc nhìn.

### Hai điều `10.39` phát hiện được từ bảng trên

`10.39.1` nói mục đích của ma trận là *"discover missing roles"*. Chạy nó ra hai thứ:

**① Vai trùng, không phải vai thiếu — và trùng thì nguy hơn.** Ba người cùng làm BA nghĩa là
**không ai chịu trách nhiệm cuối** về một quyết định phân tích. RACI đòi mỗi việc chỉ có **đúng
một chữ A**. Nếu để mở, ba người sẽ cùng đồng ý một thứ mà không ai kiểm tra nó — mục 4 gán cụ
thể để tránh.

**② Sponsor kiêm dev là xung đột vai có thật.** T vừa là người **quyết cắt phạm vi** vừa là người
**viết mã**. Người viết mã luôn muốn làm thêm — ai cũng vậy. Cách chặn: quyết định cắt phạm vi
phải xảy ra ở **mốc định sẵn trong lịch**, không phải khi ai đó thấy nên cắt.

**Một vai đã được lấp so với bản trước:** SME giờ **nằm trong đội**. Câu hỏi đắt nhất — *nỗi đau
thật của sales là gì* — không phải chờ ai bên ngoài nữa. Chi phí hỏi giảm từ "xin lịch họp"
xuống "nhắn tin".

⚠ **Vẫn thiếu người dùng cuối thật.** SME biết nghiệp vụ, nhưng SME không phải là nhân viên sales
đang phải nhập liệu hằng ngày. Hai vai này có nỗi đau khác nhau.

### Bỏ — và lý do

| Bỏ | Vì sao |
|---|---|
| `bmad-market-research` · `bmad-domain-research` · `bmad-technical-research` | **Đã chạy rồi** — kết quả ở [`docs/architecture/systems.md`](../architecture/systems.md) |
| `bmad-brainstorming` · `bmad-forge-idea` · `bmad-prfaq` | Đã làm thủ công theo `10.5` trong vòng khảo sát kiến trúc |
| `bmad-ux` · `bmad-agent-ux-designer` | Hai người, không ai chuyên UX. Dùng thư viện component có sẵn |
| `bmad-sprint-planning` · `bmad-sprint-status` | Hai người ngồi cạnh nhau không cần nghi thức sprint |
| `bmad-qa-generate-e2e-tests` | E2E tốn thời gian dựng hơn giá trị nó mang lại trong 7 ngày |
| `bmad-retrospective` | Sau hackathon, không phải trong |
| `bmad-validate-prd` · `bmad-edit-prd` | PRD một lượt, không đủ thời gian để lặp |
| `bmad-document-project` · `bmad-index-docs` · `bmad-shard-doc` | Dự án mới, chưa có gì để tài liệu hoá |
| 20+ skill còn lại | Không chạm vào đường đi chính |

⚠ **Bỏ không phải xoá.** Nếu đề bài đòi UX nặng hoặc đòi kiểm thử, các skill trên vẫn còn đó.
`10.33.2` nói **revisit priorities** khi bối cảnh đổi — mốc xem lại là lúc có đề bài thật.