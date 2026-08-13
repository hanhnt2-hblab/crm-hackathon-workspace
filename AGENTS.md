<!-- bmad:context -->
<!-- Xác minh 2026-08-13 trên b4ee071, cộng tài liệu kéo từ origin/develop 2f333d9. Do bmad-project-context quản lý; sửa bên trong khối sẽ bị ghi đè khi refresh. Muốn giữ gì thì để ngoài cặp marker. -->

## crm-hackathon-workspace

Repo của hackathon CRM, thi ngày 2026-08-15. Chứa hai thứ: **mã nguồn sản phẩm CRM** ở `src/`,
và cách chúng ta làm việc — bản cài BMad Method cùng các file nối tri thức BABOK vào từng bước.
Đề bài, thể lệ và phân tích ở `docs/Đề bài/`; artifact quy trình sinh ra ở
`_bmad-output/planning-artifacts/`.

## Policy

- Không push thẳng `main` — làm trên nhánh `feature/*` rồi mở PR.
- Không sửa file nào dưới `.claude/skills/bmad-*/` hoặc `_bmad/` (trừ `_bmad/custom/`) — đó là
  bản cài BMad nguyên trạng. Tuỳ biến bằng cách thêm `_bmad/custom/<skill>.toml`.
- Không sửa `_bmad/custom/*.toml` tại chỗ — chúng do `install.py` chép từ hub. Sửa ở nguồn
  `~/.claude/skills/babok-business-analysis/bmad-overrides/` rồi chạy lại install.
- Không commit nguyên văn BABOK dưới bất kỳ tên file nào — bản gốc ghi *"Not for Distribution
  or Resale"*. Chỉ được giữ số mục, số trang và phần diễn giải tự viết.
- Không đặt tên sản phẩm hay bài dự thi chứa "BMad" (mọi cách viết hoa) — nhãn hiệu của BMad
  Code, LLC. Nhắc tên để ghi nguồn thì được; chi tiết ở `THIRD-PARTY.md`.
- Mang mã từ ngoài vào `src/` thì ghi nguồn và license vào `THIRD-PARTY.md` trong cùng commit.
- Không sửa tại chỗ bốn skill mượn dưới `.claude/skills/` (`ci-cd-and-automation`,
  `security-and-hardening`, `shipping-and-launch`, `observability-and-instrumentation`) — chúng
  là bản chép, `skills-lock.json` giữ hash. Cần chỉnh thì viết đè trong `hackathon-deploy`.

## Where things are

- **Trước khi viết dòng mã đầu tiên, đọc Mục 0 của `docs/Đề bài/Phản biện và phân tích yêu cầu.md`.**
  Nó chốt mọi chi tiết đề bài để trống — enum, ngưỡng, con số — thành `D1`–`D41`, và tự đặt thứ tự
  ưu tiên khi các tài liệu nói khác nhau. Đừng quyết lại thứ nó đã quyết; trích `Dn` trong mã và
  trong kiểm thử.
- Thứ tự làm việc ngày thi, và vì sao: `docs/chien-luoc-ngay-thi.md`.
- **Deployment không có bước nào trong BMad.** Mọi việc thuộc cột đó đi qua
  `skill:hackathon-deploy` — nó nói bốn skill mượn dùng phần nào, bỏ phần nào.
- Đề bài, thể lệ và tài liệu BTC phát: `docs/Đề bài/` — nguồn yêu cầu gốc, bóc từ đây trước khi
  tự nghĩ ra yêu cầu.
- CRM thật của HBLAB chạy trên Airtable: `docs/CRM clone từ Airtable/` — dùng khi cần một con số
  đã có người trả giá, thay vì tự suy ra.
- Mã nguồn sản phẩm CRM: `src/`. Mọi thứ ngoài `src/` là công cụ và quy trình, không phải sản
  phẩm dự thi.
- Việc cần làm và cửa kiểm trước buổi gặp stakeholder: `CHECKLIST.md`.
- Bảng lệnh BMad đầy đủ: `_bmad/bmm/module-help.csv`.

## Running and verifying

- **TODO — chưa chốt stack cho `src/`.** Chưa có lệnh build, test hay run nào chạy được mã sản
  phẩm. Chốt stack rồi thì bổ sung lệnh thật vào đây và vào `README.md`; đừng đoán.
- Log Claude Code phải chảy về Grafana **trước** mọi việc khác, không để cuối (`D37`) — thể lệ
  ghi *"không có log bằng không có điểm và không qua được vòng 1"*. Kiểm bằng một lần chạy thật
  rồi xem log lên bảng.
- Sinh e2e test bằng skill sẵn có `bmad-qa-generate-e2e-tests` (mã `QA` trong bảng lệnh) — đừng
  tự viết lại quy trình sinh test, nó dễ bị bỏ sót vì tên dài.
- Mỗi bản clone bật hook một lần: `git config core.hooksPath .githooks`. Không bật thì sau mỗi
  lần pull có đổi `.claude/skills/bmad-*` phải tự chạy `install.py` rồi `verify.py`.
- Kiểm bản cài BABOK: `python ~/.claude/skills/babok-business-analysis/verify.py --project-root .`
  — 5 phép kiểm, đạt khi in `Mọi phép kiểm đạt.`
- Phép kiểm 5 chỉ chạy khi truyền `--source <bản BABOK của bạn>`; không có thì nó báo BỎ QUA và
  bốn phép kia vẫn chạy. Không phép nào bắt được diễn giải sai ngữ nghĩa — số mục có thật nhưng
  dẫn sai ý thì phải đối chiếu bằng mắt.
- Không chạy `npx bmad-method install` — BMad và phần nối đã nằm sẵn trong repo.

## Conventions that differ from defaults

- Commit message viết tiếng Việt có dấu theo Conventional Commits (`feat(babok): …`) — khác với
  repo `opms` cùng công ty, nơi commit message viết tiếng Anh.
- `_bmad-output/` được track, không phải build output bỏ đi. `.memlog.md` trong đó đừng xoá và
  đừng sửa tay — nó là thứ cho phép resume và audit.

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
