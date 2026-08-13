<!-- bmad:context -->
<!-- Xác minh 2026-08-14 trên cc773a5 cộng phần chưa commit. Do bmad-project-context quản lý; sửa bên trong khối sẽ bị ghi đè khi refresh. Muốn giữ gì thì để ngoài cặp marker. -->

## crm-hackathon-workspace

Repo của hackathon CRM, thi ngày 2026-08-15. Chứa **cách đội làm việc** — bản cài BMad Method,
các file nối tri thức BABOK, và skill bù chỗ BMad thiếu — cùng **mã sản phẩm CRM sẽ nằm ở `src/`**
khi stack được chốt; hiện `src/` chưa tồn tại. Đề bài, thể lệ và phân tích ở `docs/Đề bài/`;
artifact sinh ra ở `_bmad-output/planning-artifacts/` và `_bmad-output/implementation-artifacts/`.

## Policy

- `develop` là nhánh tích hợp và là nhánh mặc định của remote. Không có `main`. Việc lớn thì
  tách `feature/*` rồi merge vào `develop`; sửa nhỏ commit thẳng `develop` được.
- Không sửa file nào dưới `.claude/skills/bmad-*/` hoặc `_bmad/` — đó là bản cài BMad nguyên
  trạng. Tuỳ biến bằng cách thêm `_bmad/custom/<skill>.toml`. Riêng trong `_bmad/custom/`: **ba
  tệp đội tự viết** (`bmad-build`, `bmad-code-review`, `bmad-qa-generate-e2e-tests`) sửa thẳng
  được; **chín tệp còn lại do `install.py` chép từ hub** thì sửa ở nguồn
  `~/.claude/skills/babok-business-analysis/bmad-overrides/` rồi chạy lại install. Đầu mỗi tệp
  có dòng ghi rõ nó thuộc loại nào.
- Không commit nguyên văn BABOK dưới bất kỳ tên file nào — bản gốc ghi *"Not for Distribution
  or Resale"*. Chỉ được giữ số mục, số trang và phần diễn giải tự viết.
- Không đặt tên sản phẩm hay bài dự thi chứa "BMad" (mọi cách viết hoa) — nhãn hiệu của BMad
  Code, LLC. Nhắc tên để ghi nguồn thì được; chi tiết ở `THIRD-PARTY.md`.
- Mang mã từ ngoài vào `src/` thì ghi nguồn và license vào `THIRD-PARTY.md` trong cùng commit.
- Không sửa tại chỗ bốn skill mượn dưới `.claude/skills/` (`ci-cd-and-automation`,
  `security-and-hardening`, `shipping-and-launch`, `observability-and-instrumentation`) — chúng
  là bản chép, sửa sẽ mất khi cập nhật. Cần chỉnh thì viết đè trong `hackathon-deploy`. Hook
  `post-merge` cảnh báo khi một merge chạm vào chúng; `skills-lock.json` ghi nguồn nhưng **hash
  trong đó không đối chiếu offline được**, đừng dựa vào nó làm phép kiểm.

## Where things are

- **Trước khi viết dòng mã đầu tiên, đọc Mục 0 của `docs/Đề bài/Phản biện và phân tích yêu cầu.md`.**
  Nó chốt mọi chi tiết đề bài để trống — enum, ngưỡng, con số — thành `D1`–`D41`, và tự đặt thứ tự
  ưu tiên khi các tài liệu nói khác nhau. Đừng quyết lại thứ nó đã quyết; trích `Dn` trong mã và
  trong kiểm thử.
- **Skill nào chạy ở bước nào, và nó nuôi cột chấm điểm nào:** `README.md` mục *Luồng phát triển*.
  Bảng lệnh thô ở `_bmad/bmm/module-help.csv`.
- Thứ tự làm việc ngày thi, và vì sao: `docs/chien-luoc-ngay-thi.md`.
- **Deployment không có bước nào trong BMad.** Mọi việc thuộc cột đó đi qua
  `skill:hackathon-deploy` — nó nói bốn skill mượn dùng phần nào, bỏ phần nào.
- MCP cơ sở dữ liệu `tabularis` khai ở `.mcp.json`, đòi nó nằm trên `PATH`. Dùng để khẳng định
  thẳng trạng thái dữ liệu khi kiểm `T-4`, `T-8`, `T-9` — **chỉ đọc, không ghi**. Không lên được
  thì khẳng định bằng lệnh truy vấn của stack và ghi rõ đã dùng đường dự phòng.
- Đề bài, thể lệ và tài liệu BTC phát: `docs/Đề bài/` — nguồn yêu cầu gốc, bóc từ đây trước khi
  tự nghĩ ra yêu cầu.
- CRM thật của HBLAB chạy trên Airtable: `docs/CRM clone từ Airtable/` — dùng khi cần một con số
  đã có người trả giá, thay vì tự suy ra.
- Bản ghi quyết định chung của nửa thực thi: `_bmad-output/implementation-artifacts/.memlog.md`.
  Ba override của đội đều ghi vào đây, **ngay khi chốt một quyết định**, không dồn tới cuối.
- Mã sản phẩm dự thi sẽ nằm ở `src/`. Mọi thứ ngoài `src/` là công cụ và quy trình.
- Việc phải làm trước và trong ngày thi: `CHECKLIST.md`.

## Running and verifying

- **TODO — chưa chốt stack cho `src/`.** Chưa có lệnh build, test hay run nào chạy được mã sản
  phẩm. Chốt stack rồi thì bổ sung lệnh thật vào đây và vào `README.md`; đừng đoán.
- Log Claude Code phải chảy về Grafana **trước** mọi việc khác, không để cuối (`D37`) — thể lệ
  ghi *"không có log bằng không có điểm và không qua được vòng 1"*. Kiểm bằng một lần chạy thật
  rồi xem log lên bảng.
- Sinh e2e test bằng skill sẵn có `bmad-qa-generate-e2e-tests` (mã `QA` trong bảng lệnh) — đừng
  tự viết lại quy trình sinh test, nó dễ bị bỏ sót vì tên dài.
- Mỗi bản clone bật hook một lần: `git config core.hooksPath .githooks`. Hook làm hai việc sau
  mỗi merge: đồng bộ lại phần nối BABOK nếu `.claude/skills/bmad-*` đổi, và cảnh báo nếu merge
  chạm bốn skill mượn.
- Kiểm bản cài BABOK: `python ~/.claude/skills/babok-business-analysis/verify.py --project-root .`
  — 5 phép, đạt khi in `Mọi phép kiểm đạt.` Phép 5 báo `[BỎ QUA]` nếu không truyền `--source`,
  đó là bình thường. Chi tiết từng phép ở `README.md` mục *Bảo trì*.
- Không chạy `npx bmad-method install` — BMad và phần nối đã nằm sẵn trong repo.

## Conventions that differ from defaults

- Commit message viết tiếng Việt có dấu theo Conventional Commits (`feat(babok): …`) — khác với
  repo `opms` cùng công ty, nơi commit message viết tiếng Anh.
- `_bmad-output/` được track, không phải build output bỏ đi. Mọi `.memlog.md` trong đó đừng xoá
  và đừng sửa tay — ghi qua `_bmad/scripts/memlog.py`, vì nó là thứ cho phép resume và audit.

## Hỏi người dùng

Tập phương án hữu hạn thì **hỏi bằng lựa chọn bấm được**, không hỏi mở. Tối ưu cho việc bấm.

- Mỗi câu **kèm khuyến nghị**: đặt làm lựa chọn đầu tiên, ghi `(Khuyến nghị)` trong nhãn.
- Mô tả từng lựa chọn nói **hệ quả nếu chọn nó**, không chỉ nói nó là gì.
- **Gom tối đa bốn quyết định đang treo vào một lần hỏi**, đừng hỏi lắt nhắt.

## Khung phân tích

Quy ước phương pháp của dự án, theo BABOK v3 — không phải điều quan sát được từ mã.

- **Năm loại yêu cầu**, phân loại nhất quán: `business` (vì sao thay đổi) · `stakeholder` (nhu
  cầu bên liên quan) · `solution functional` (làm gì) · `solution non-functional` (tốt đến mức
  nào) · `transition` (chỉ cần trong lúc chuyển đổi rồi bỏ).
- **Sáu khái niệm xét cùng lúc** khi bàn một thay đổi: Need · Change · Solution · Stakeholder ·
  Value · Context. Đóng khung Solution trước khi hiểu Need là lỗi phổ biến nhất.
- **Truy vết**: mỗi story truy được về yêu cầu sinh ra nó, mỗi yêu cầu truy được về nhu cầu
  nghiệp vụ sinh ra nó. Không truy được thì không biết vì sao nó tồn tại, và khi nhu cầu đổi thì
  không biết phải sửa ở đâu.

<!-- /bmad:context -->
