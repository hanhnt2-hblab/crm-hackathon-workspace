# Checklist — hackathon CRM

Deadline **2026-08-15**.

Vai theo BABOK `2.4`: **Sponsor** (quyết phạm vi) · **Domain SME + End User** (biết quy trình
và thao tác thật) · **Implementation SME + Tester** (thực thi và kiểm).

---

## A · Setup — mỗi bản clone làm một lần

- [ ] Cài `uv`: https://docs.astral.sh/uv/ · Node ≥ 20.12 · Python ≥ 3.10
- [ ] Bật git hook để tự đồng bộ bản vá sau khi pull:
      ```
      git config core.hooksPath .githooks
      ```
- [ ] Xác minh môi trường:
      ```
      python .claude/skills/babok-guide/scripts/check-install.py
      ```
      Đạt khi báo `Moi thu khop voi ban cai` và 4/4 mục `[OK]`
- [ ] Xác minh skill nạp được — gõ `/` xem có `babok-guide` trong danh sách

BMad và bản vá đã nằm sẵn trong repo, **không cần chạy `npx bmad-method install`**.

## B · Trước buổi làm việc với stakeholder

Cửa sổ gặp stakeholder không mở lại. Chuẩn bị trước để mỗi phút đổi lấy một quyết định.

- [ ] Đọc [`references/steps/product-brief.md`](.claude/skills/babok-guide/references/steps/product-brief.md)
      — biết hỏi ai câu gì
- [ ] Bóc tài liệu sẵn có trước (Document Analysis `10.18`): CRM đối thủ, hợp đồng, chính sách,
      màn hình hệ thống cũ. **Đọc rẻ hơn hỏi**
- [ ] Chuẩn bị bảng state × transition để hỏi từng ô, thay vì hỏi mở

## C · Trong buổi làm việc — thứ tự do tài liệu quy định

`10.9.2` đòi từ vựng chuẩn trước → `10.39.3.2` đòi process model trước ma trận quyền.

- [ ] **Từ vựng trước tiên** (`10.11`): `Lead` / `Contact` / `Account` / `Opportunity` / `Deal`
      khác nhau chỗ nào — chốt trước khi vào schema
- [ ] **Process model as-is** (`10.35`): *"hiện tại đang bán thế nào"*
- [ ] **Process model to-be**: *"muốn thành thế nào"* — hỏi **tách** làm hai lần
- [ ] **State model** (`10.44`): stage nào sang được stage nào, điều kiện canh là gì.
      **Hỏi cả chiều ngược** — `10.44.3.2` nói vòng đời *"are not always linear"*: deal có tụt
      ngược stage không, deal đã đóng có mở lại được không
- [ ] **Business rules** (`10.9`) — **hai bước, đừng gộp**: phân loại *definitional*
      (`10.9.3.1`, không vi phạm được, chỉ áp dụng sai được) hay *behavioural* (`10.9.3.2`);
      rồi **chỉ behavioural** mới chọn một trong bốn mức thực thi
- [ ] **Roles matrix** (`10.39`) — hỏi **hai người, hai câu**: *"ai **được** thấy gì"* → Sponsor ·
      *"ai **cần** thấy gì"* → Domain SME
- [ ] **Delegation và Inheritance** (`10.39.3.4`) — yêu cầu **dữ liệu**, không phải UI
- [ ] **Thứ tự cắt scope** — xin Sponsor duyệt **trước**, không xin giữa lúc code
- [ ] **Số field và số click** để tạo 1 lead — hỏi trực tiếp người bán hàng

## D · Trong lúc chạy BMad — kiểm mỗi ngày

- [ ] **Công tắc người-thật**: có người trả lời được thì hỏi họ, **đừng** chạy `party-mode`
- [ ] **Tách luật khỏi luồng** — `10.35.4.2` và `10.9.2` cùng đòi. Sơ đồ chỉ vẽ *bước*;
      luật nằm ở bảng riêng
- [ ] Mỗi story có **acceptance criterion quan sát được**, viết **trước** khi code
- [ ] Mỗi NFR có **ngưỡng số**, không phải tính từ
- [ ] Cắt scope thì ghi vào bảng dưới, và kiểm cột cuối

```
NGÀY | CẮT GÌ | VÌ SAO | THAY BẰNG GÌ | ĐÃ DUYỆT TRƯỚC?
     |        |        |              |
```

- [ ] Không để xảy ra kiểu cắt scope tệ nhất: *vẫn nói là "có" nhưng bên trong hỏng*.
      Ví dụ kinh điển của CRM: hứa rep chỉ thấy deal của mình, để tạm ai cũng thấy hết, rồi quên

## E · Bảo trì — sau mỗi lần update BMad

Bật hook ở mục A thì hai lệnh này tự chạy. Không bật thì phải tự nhớ:

```bash
python .claude/skills/babok-guide/scripts/apply-methods.py
python .claude/skills/babok-guide/scripts/check-install.py
```

Kiểm 7 mục. Ba mục đáng chú ý:

- [ ] **Mục 3** — nguồn và bản cài phải khớp từng byte. Đếm số fact không đủ: hai phiên bản
      khác nội dung mà cùng số dòng vẫn qua được
- [ ] **Mục 5** — mọi số hiệu section phải tồn tại thật. Cần bản `BABOK_Guide_v3_Member.txt`
      của riêng mình: `--babok-txt <đường-dẫn>`
- [ ] **Mục 6** — mỗi fact trích BABOK phải ghi rõ phần nào là tài liệu, phần nào là kinh
      nghiệm. Quy ước: `[BABOK: …]` hoặc `[BABOK: …; thực hành: …]`

⚠ Không check nào bắt được **diễn giải sai ngữ nghĩa** — section có thật, dấu có đủ, nhưng
nội dung dẫn không đúng ý mục đó. Loại này phải đối chiếu bằng mắt với nguyên văn.

Hỏng thì hoàn nguyên: `python .claude/skills/babok-guide/scripts/apply-methods.py --restore`

## F · Việc còn treo

- [ ] Điền `docs/strategy/` — chiến lược và plan triển khai
- [ ] Điền `docs/tooling/` — so sánh AI workflow framework, chọn stack
- [ ] Điền `docs/roles/` — phân công cụ thể, dựa trên bảng vai trong `SKILL.md`
- [ ] Điền `docs/architecture/` — nghiên cứu kiến trúc
- [ ] Cân nhắc override cho `bmad-check-implementation-readiness` (`IR`) — ghép được với
      cửa kiểm 8 ô ở bước `CA`
- [ ] Nhóm `4-implementation` của BMad (`CS` `DS` `CR` `QA` `ER`) **chưa đo gap** — đừng kết
      luận sớm là đủ hay thiếu

---

## Ghi chú về nguồn tri thức

Bản ghi nguyên văn BABOK **không nằm trong repo** do ràng buộc *"Not for Distribution or
Resale"*. Cột `cached` trong `assets/techniques.csv` chỉ có ý nghĩa với người có kho riêng —
xem [README](README.md) mục *Nguồn tri thức*.

Ai cần chiều sâu một kỹ thuật thì tra trong **bản BABOK của chính mình**, theo số section và
số trang có sẵn trong `techniques.csv`.
