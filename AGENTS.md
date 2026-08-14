<!-- bmad:context -->
<!-- Xác minh 2026-08-14 trên a5e30ea cộng phần chưa commit. Do bmad-project-context quản lý; sửa bên trong khối sẽ bị ghi đè khi refresh. Muốn giữ gì thì để ngoài cặp marker. -->

## crm-hackathon-workspace

Repo của hackathon CRM, thi ngày 2026-08-15. Chứa cách đội làm việc — bản cài BMad Method, các
file nối tri thức BABOK, và skill bù chỗ BMad thiếu — cùng mã sản phẩm CRM ở `src/`. Năm loại
artifact kế hoạch đã xong ở `_bmad-output/planning-artifacts/` — brief, PRD, UX, kiến trúc, epic —
và bước dựng đang chạy. `src/` có khung năm tầng và `tests/` chạy được; `tsc --noEmit`, `npm run lint`,
`npm run build` và `npm test` đều sạch. Thân hàm phần lớn vẫn là `chưa hiện thực` — đó là chủ
đích của Cục 0, không phải việc bỏ dở. Đề bài và phân tích ở `docs/Đề bài/`.

## Policy

- `develop` là nhánh tích hợp và là nhánh mặc định của remote. Không có `main`. Việc lớn thì tách
  `feature/*` rồi merge vào `develop`; sửa nhỏ commit thẳng `develop` được.
- Remote hiện tại là `github.com/hanhnt2-hblab`, không phải `git.hblab.vn` như `dev/hblab/CLAUDE.md`
  khai. Ngày thi mã còn phải lên GitLab của HBLAB do BTC cấp (`§7.1`) — ba nơi khác nhau, đừng đoán.
- Không sửa file nào dưới `.claude/skills/bmad-*/` hoặc `_bmad/` — đó là bản cài BMad nguyên trạng.
  Tuỳ biến bằng cách thêm `_bmad/custom/<skill>.toml`. Riêng trong `_bmad/custom/`: ba tệp đội tự
  viết (`bmad-build`, `bmad-code-review`, `bmad-qa-generate-e2e-tests`) sửa thẳng được; chín tệp
  còn lại do `install.py` chép từ hub thì sửa ở nguồn
  `~/.claude/skills/babok-business-analysis/bmad-overrides/` rồi chạy lại install. Đầu mỗi tệp có
  dòng ghi rõ nó thuộc loại nào.
- Không commit nguyên văn BABOK dưới bất kỳ tên file nào — bản gốc ghi *"Not for Distribution or
  Resale"*. Chỉ được giữ số mục, số trang và phần diễn giải tự viết. Dán nó vào công cụ ngoài cũng
  là phát hành.
- Không đặt tên sản phẩm hay bài dự thi chứa "BMad" (mọi cách viết hoa) — nhãn hiệu của BMad Code,
  LLC. Nhắc tên để ghi nguồn thì được; chi tiết ở `THIRD-PARTY.md`.
- Mang mã từ ngoài vào `src/` thì ghi nguồn và license vào `THIRD-PARTY.md` trong cùng commit.
- Không sửa tại chỗ bốn skill mượn dưới `.claude/skills/` (`ci-cd-and-automation`,
  `security-and-hardening`, `shipping-and-launch`, `observability-and-instrumentation`) — chúng là
  bản chép, sửa sẽ mất khi cập nhật. Cần chỉnh thì viết đè trong `hackathon-deploy`. Hook
  `post-merge` cảnh báo khi một merge chạm vào chúng; `skills-lock.json` ghi nguồn nhưng hash trong
  đó không đối chiếu offline được, đừng dựa vào nó làm phép kiểm.

## Where things are

- Trước khi viết dòng mã đầu tiên, đọc Mục 0 của `docs/Đề bài/Phản biện và phân tích yêu cầu.md`.
  Nó chốt mọi chi tiết đề bài để trống — enum, ngưỡng, con số — thành `D1`–`D47`, và tự đặt thứ tự
  ưu tiên khi các tài liệu nói khác nhau. Đừng quyết lại thứ nó đã quyết; trích `Dn` trong mã và
  trong kiểm thử. Cả thư mục `docs/Đề bài/` là nguồn yêu cầu gốc — bóc từ đây trước khi tự nghĩ.
- Skill nào chạy ở bước nào, và nó nuôi cột chấm điểm nào: `README.md` mục *Luồng phát triển*.
  Bảng lệnh thô ở `_bmad/bmm/module-help.csv`.
- Kiến trúc đã chốt, và nó là thứ phải đọc trước khi sửa bất cứ gì trong `src/`:
  `…/architecture/architecture-crm-hackathon-2026-08-14/ARCHITECTURE-SPINE.md` — 22 bất biến
  `AD-1`…`AD-22`, bảng Stack có phiên bản ghim, sổ đăng ký Capability đóng. Ma trận quyết định có
  trọng số nằm cạnh; `src/ontology/crm.ontology.md` là từ vựng chung. Sườn là nơi duy nhất ghi
  đúng chiều phụ thuộc giữa các tầng. Năm sườn tầng cùng thư mục cha
  (`architecture-tier1-tuong-tac` … `tier5-core`) mang thêm 67 bất biến có tiền tố `AD-UI` `AD-AG`
  `AD-GT` `AD-CP` `AD-CR`; `lint_spine.py` chỉ khớp `AD-<số>` nên KHÔNG kiểm được dải đó.
- Năm bước đã chạy, artifact dùng làm đầu vào cho bước sau: brief ở
  `_bmad-output/planning-artifacts/briefs/brief-crm-hackathon-2026-08-14/`, PRD ở `…/prds/…/prd.md`
  (51 FR, mỗi FR mang nhãn ưu tiên suy từ `T-1`…`T-10`), UX ở `…/ux-designs/…/` gồm `DESIGN.md` và
  `EXPERIENCE.md`, epic và story ở `…/epics/epics-crm-hackathon-2026-08-14/epics.md`.
- Nguyên mẫu do Claude Design sinh ở `…/ux-designs/…/prototype/`. Mở `WhyNowPrototype.dc.html`
  bằng trình duyệt cho màn hình trắng — nó thiếu React. Nguyên mẫu dựng theo lớp token **cũ**, nay
  chỉ còn giá trị tham khảo về luồng; lớp token hiện tại là Fluent 2, xem `DESIGN.md`.
- Thứ tự làm việc ngày thi, và vì sao: `docs/chien-luoc-ngay-thi.md`.
- Deployment không có bước nào trong BMad. Mọi việc thuộc cột đó đi qua `skill:hackathon-deploy` —
  nó nói bốn skill mượn dùng phần nào, bỏ phần nào.
- MCP cơ sở dữ liệu `tabularis` khai ở `.mcp.json`, đòi nó nằm trên `PATH`. Dùng để khẳng định
  thẳng trạng thái dữ liệu khi kiểm `T-4`, `T-8`, `T-9` — chỉ đọc, không ghi. Không lên được thì
  khẳng định bằng lệnh truy vấn của stack và ghi rõ đã dùng đường dự phòng.
- CRM thật của HBLAB chạy trên Airtable: `docs/CRM clone từ Airtable/` — dùng khi cần một con số đã
  có người trả giá, thay vì tự suy ra.
- Nửa thực thi ở `_bmad-output/implementation-artifacts/`: `.memlog.md` ghi ngay khi chốt một
  quyết định, không dồn tới cuối; `spec-c0-frozen-contracts.md` là hợp đồng kiểu giữa năm tầng, và
  khối `<frozen-after-approval>` trong đó là ý định do người sở hữu nên đừng sửa; `deferred-work.md`
  ghi việc đã tách ra kèm lý do — đọc nó trước khi "sửa" một hình dạng kiểu trông có vẻ sai, phần
  lớn là cố ý hoãn chứ không phải sót.
- Việc phải làm trước và trong ngày thi: `CHECKLIST.md`.

## Running and verifying

- NĂM lệnh cổng nộp bài — `build` `start` `seed` `test` `stop` — và bẫy của từng lệnh:
  `CHECKLIST.md` mục *B · Giai đoạn 1*. Đừng suy lệnh từ `package.json` — `npm run dev` có trong
  đó nhưng `§7` cấm dev server.
- Bốn lệnh thoát 0; `npm run seed` thoát **1** vì `prisma/seed.ts` chưa có. Đó là trạng thái đã
  biết và là việc của `C5-17`, không phải hỏng cấu hình.
- `npm test` tự dựng CSDL của nó ở cổng **5443**. `tests/global-setup.ts` xoá lược đồ rồi
  `migrate deploy` — KHÔNG dùng `migrate reset` (cờ `--skip-seed` đã bị gỡ ở Prisma 7) và KHÔNG
  dùng `db push` (nó bỏ qua migration, tức mất sạch 4 `CHECK` và 4 chỉ mục một phần viết tay).
  Ba khẳng định ở đầu tệp đó chặn việc trỏ nhầm sang CSDL demo 5442; đừng nới chúng.
- Khi `npm install` xuống nền thì **không gõ gì thêm** cho tới lúc có thông báo. Gõ tiếp giết tiến
  trình cài giữa chừng; ngày 14/08 việc đó làm hỏng `node_modules` năm lần liên tiếp. Và đừng xoá
  `node_modules` để cài lại cho sạch — riêng Fluent là 68 gói và 51.725 tệp. Hỏng thì `npm rebuild`
  trước, nó nối lại `.bin` trong vài giây.
- `npm run lint` cưỡng chế ranh giới nhập của `AD-1` cho cả năm tầng, cộng `instrumentation.ts`
  (tệp ở gốc, `AD-1` gọi nó là chỗ nguy hiểm nhất). Mỗi khối đã được đo bằng một tệp thăm dò, không
  phải viết rồi tin. `no-import-type-side-effects` bật cùng lúc là BẮT BUỘC, không phải trang trí:
  thiếu nó thì `import { type X }` qua mặt mọi `allowTypeImports`, vì tuỳ chọn đó xét ở mức cả câu
  lệnh.
- Cấu hình lớp AI, gồm cả lý do để `ANTHROPIC_API_KEY` trống và đường lui nếu subscription hỏng:
  `.env.example`. Nó là tệp tự giải thích, đọc trước khi đặt bất kỳ biến nào.
- Ghim model cho lớp AI đặt ở **ba** biến, không phải một; bảng ở `AD-15` của sườn. Đặt mỗi
  `options.model` thì subagent và các lệnh gọi nền vẫn thoát ra model khác.
- Sửa tài liệu nhiều dòng thì viết script ra scratchpad rồi chạy, đừng dùng heredoc của Bash —
  nội dung tiếng Việt lẫn backtick và ký tự xuống dòng làm hỏng nó, đã hỏng hai lần.
- Log Claude Code phải chảy về Grafana trước mọi việc khác, không để cuối (`D37`) — thể lệ ghi
  *"không có log bằng không có điểm và không qua được vòng 1"*. Kiểm bằng một lần chạy thật rồi
  xem log lên bảng.
- Sinh e2e test bằng skill sẵn có `bmad-qa-generate-e2e-tests` (mã `QA` trong bảng lệnh) — đừng tự
  viết lại quy trình sinh test, nó dễ bị bỏ sót vì tên dài.
- Mỗi bản clone bật hook một lần: `git config core.hooksPath .githooks`. Hook làm hai việc sau mỗi
  merge: đồng bộ lại phần nối BABOK nếu `.claude/skills/bmad-*` đổi, và cảnh báo nếu merge chạm bốn
  skill mượn.
- Kiểm bản cài BABOK: `python ~/.claude/skills/babok-business-analysis/verify.py --project-root .`
  — 5 phép, đạt khi in `Mọi phép kiểm đạt.` Phép 5 báo `[BỎ QUA]` nếu không truyền `--source`, đó
  là bình thường. Chi tiết từng phép ở `README.md` mục *Bảo trì*.
- Không chạy `npx bmad-method install` — BMad và phần nối đã nằm sẵn trong repo.

## Conventions that differ from defaults

- Commit message viết tiếng Việt có dấu theo Conventional Commits (`feat(babok): …`) — khác với
  repo `opms` cùng công ty, nơi commit message viết tiếng Anh.
- Mọi tài liệu và mọi dòng memlog viết tiếng Việt **có dấu**. Bỏ dấu cho tiện shell là sai quy ước.
- `_bmad-output/` được track, không phải build output bỏ đi. Mọi `.memlog.md` trong đó đừng xoá và
  đừng sửa tay — ghi qua `_bmad/scripts/memlog.py`, vì nó là thứ cho phép resume và audit.

## Hỏi người dùng

Tập phương án hữu hạn thì hỏi bằng lựa chọn bấm được, không hỏi mở. Tối ưu cho việc bấm.

- Mỗi câu kèm khuyến nghị: đặt làm lựa chọn đầu tiên, ghi `(Khuyến nghị)` trong nhãn.
- Mô tả từng lựa chọn nói hệ quả nếu chọn nó, không chỉ nói nó là gì.
- Gom tối đa bốn quyết định đang treo vào một lần hỏi, đừng hỏi lắt nhắt.

## Khung phân tích

Quy ước phương pháp của dự án, theo BABOK v3 — không phải điều quan sát được từ mã.

- Năm loại yêu cầu, phân loại nhất quán: `business` (vì sao thay đổi) · `stakeholder` (nhu cầu bên
  liên quan) · `solution functional` (làm gì) · `solution non-functional` (tốt đến mức nào) ·
  `transition` (chỉ cần trong lúc chuyển đổi rồi bỏ).
- Sáu khái niệm xét cùng lúc khi bàn một thay đổi: Need · Change · Solution · Stakeholder · Value ·
  Context. Đóng khung Solution trước khi hiểu Need là lỗi phổ biến nhất.
- Truy vết: mỗi story truy được về yêu cầu sinh ra nó, mỗi yêu cầu truy được về nhu cầu nghiệp vụ
  sinh ra nó. Không truy được thì không biết vì sao nó tồn tại, và khi nhu cầu đổi thì không biết
  phải sửa ở đâu.

<!-- /bmad:context -->
