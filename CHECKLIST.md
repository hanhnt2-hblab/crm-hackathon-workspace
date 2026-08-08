# Checklist — hackathon CRM

Deadline **2026-08-15**. Cập nhật lần cuối 2026-08-08.
Team: giám đốc (Sponsor) · trưởng bộ phận sales (Domain SME + End User) · bạn (BA/PM/Dev/Test).

---

## A · Setup công cụ — làm một lần, trước khi bắt đầu

- [x] ~~`npx bmad-method install`~~ — xong 2026-08-08, v6.10.0, 47 skill trong `.claude/skills/`
- [x] ~~Copy 3 file override~~ — `bmad-prd` · `bmad-architecture` · `bmad-spec` vào `_bmad/custom/`.
      Đã xác minh bằng `resolve_customization.py`: 8 / 9 / 9 entry, append-merge giữ nguyên mặc định
- [x] ~~Chèn 12 method BABOK vào catalog~~ — `apply-methods.py`, catalog từ 71 → **83 method**,
      category `babok` = 12
- [x] ~~Override cho `bmad-product-brief`~~ — bước `CB` bắt buộc trước PRD, đã thêm
- [ ] **Sau MỖI lần update BMad, chạy hai lệnh:**
      ```
      python .claude/skills/babok-guide/references/bmad-custom/apply-methods.py
      python .claude/skills/babok-guide/references/bmad-custom/check-install.py
      ```
      Lệnh đầu chèn lại 12 method (update ghi đè `methods.csv`); lệnh sau kiểm 4 thứ:
      catalog · override · tên skill trong `workflow.md` · gap profile lệch baseline
- [ ] Xác minh thực tế — chạy `bmad-prd`, xem nó có tự biết quy tắc *"chốt thuật ngữ trước khi
      hỏi luật"* không
- [ ] Xác minh skill `babok-guide` load được (gõ `/` xem có trong danh sách)
- [ ] `git init` + commit, để team chia sẻ được

## B · Nạp cache BABOK còn thiếu — khi cần, không nạp trước hàng loạt

Đã có 6: `10.9` `10.24` `10.25` `10.35` `10.39` `10.44`.
Dùng `QUERY-TEMPLATE.md` trong `PARA\3_Resources\ba\babok-v3\`. Một query một kỹ thuật.

- [ ] `10.11` Concept Modelling — **mắt xích đầu tiên của chuỗi**, ưu tiên cao nhất
- [ ] `10.18` Document Analysis — để bóc quyển sách nghiệp vụ sale
- [ ] `10.15` Data Modelling *(thin trong BMad)*
- [ ] `10.30` Non-Functional Requirements *(thin)*
- [ ] `10.42` Sequence Diagrams *(absent)*

Nhóm collaborative (`10.50` Workshops · `10.21` Focus Groups · `10.31` Observation ·
`10.45` Survey) — ưu tiên thấp: có stakeholder thật nên dùng trực tiếp, không cần lý thuyết trước.

## C · Buổi làm việc với 2 stakeholder — cửa sổ này không mở lại

Thứ tự dưới đây do **chính tài liệu quy định**, không phải sắp xếp tuỳ ý:
`10.9` đòi từ vựng chuẩn trước → `10.39.3.2` đòi process model trước.

- [ ] **Từ vựng trước tiên** (`10.11`): `Lead` / `Contact` / `Account` / `Opportunity` / `Deal`
      khác nhau chỗ nào — chốt trước khi vào schema
- [ ] **Process model as-is** (`10.35`): *"hiện tại đang bán thế nào"*
- [ ] **Process model to-be**: *"muốn thành thế nào"* — hỏi **tách** làm hai lần, đừng gộp
- [ ] **State model** (`10.44`): stage nào sang được stage nào, điều kiện canh là gì
- [ ] **Business rules** (`10.9`): mỗi luật chọn **một trong bốn mức thực thi** —
      chặn cứng · quản lý override được · override kèm lý do · chỉ khuyến nghị
- [ ] **Roles matrix** (`10.39`) — hỏi **hai người, hai câu khác nhau**:
      *"ai **được** thấy gì"* → giám đốc · *"ai **cần** thấy gì"* → trưởng sales
- [ ] **Delegation và Inheritance** (`10.39.3.4`): trưởng phòng đi vắng uỷ quyền cho ai;
      cấp trên thấy dữ liệu cấp dưới tới mấy tầng. Đây là yêu cầu **dữ liệu**, không phải UI
- [ ] **Thứ tự cắt scope** — xin giám đốc duyệt **trước**:
      *"nếu đến ngày 5 không kịp, em cắt theo thứ tự (1)(2)(3), anh đồng ý chứ?"*
- [ ] **Số field và số click** để một sales rep tạo 1 lead — hỏi trực tiếp người bán

## D · Trong lúc chạy BMad — kiểm mỗi ngày

- [ ] **Công tắc người-thật**: có người trả lời được thì hỏi họ, **đừng** chạy `party-mode`
      hay persona rotation. Mô phỏng là phương án dự phòng, không phải mặc định
- [ ] **Tách luật khỏi luồng** — `10.35.4.2` và `10.9.2` **cùng** nói điều này. Sơ đồ quy trình
      chỉ vẽ *bước*; luật nằm ở bảng riêng
- [ ] Mỗi story có **acceptance criterion quan sát được**, viết **trước** khi code
- [ ] Mỗi NFR có **ngưỡng đo được**, không phải tính từ
- [ ] Cắt scope thì ghi vào bảng dưới, và kiểm cột cuối

```
NGÀY | CẮT GÌ | VÌ SAO | THAY BẰNG GÌ | ĐÃ DUYỆT TRƯỚC?
     |        |        |              |
```

- [ ] Không để xảy ra kiểu cắt scope thứ 4: *vẫn nói là "có" nhưng bên trong hỏng*.
      Ví dụ kinh điển của CRM: hứa rep chỉ thấy deal của mình, để tạm ai cũng thấy hết, rồi quên

## E · Nợ cần tra lại — đã đánh dấu ⚠, đừng dẫn cho ai trước khi kiểm

Trong `PARA\3_Resources\ba\babok-v3\`, tra `grep "status: partial"`.

- [ ] `10.44` State Modelling — mục **Limitations** không có citation → tra bản gốc **trang 348–350**
- [ ] `10.9` Business Rules — mục **Limitations** không có citation → **trang 240–243**
- [ ] `10.35` Process Modelling — mục Elements có thể thiếu `.2` `.3` → **trang 318–323**
- [ ] `10.25` Interviews — Elements `.2`–`.5` chưa có citation → **trang 290–294**
- [ ] Nhóm `ship` của BMad (`bmad-build`, `bmad-code-review`, `bmad-qa-generate-e2e-tests`,
      `bmad-correct-course`, `bmad-checkpoint-preview`) — **chưa đo gap**, đừng kết luận sớm

## F · Việc treo, chưa quyết

- [ ] **Quyển sách nghiệp vụ sale** → cắm vào `bmad-project-context`, **không** làm MCP riêng.
      Cảnh báo của chính BMad: *"generated documentation makes agents worse; a curated minimum
      of verified, non-derivable truths makes them better"* → cắt xuống tối thiểu, đừng nhồi
- [ ] Entry MCP của project `C:\Users\HanhNT2` vẫn trỏ `npx notebooklm-mcp@latest` (bản hỏng)
- [ ] `npm audit` — 6 vulnerability (2 moderate, 4 high) trong `dev\_tools\notebooklm-mcp`
- [ ] Repo BMAD-METHOD đang ở scratchpad, **sẽ mất khi hết phiên** — muốn giữ thì chuyển sang
      `dev\_tools\`

---

## Hạn mức và số liệu

| | |
|---|---|
| Quota NotebookLM | **50 query/ngày**, đã dùng ~12 hôm nay (kể cả 1 lần timeout) |
| Query timeout | Truyền `browser_options.timeout_ms: 600000`; timeout **vẫn tính quota** |
| Ba lớp tri thức | nguyên văn ở `PARA` → định tuyến ở `.claude/skills` → tiêm vào `_bmad/custom` |
| Bản quyền | Nguồn ghi *"Not for Distribution or Resale"* — **không** copy nguyên văn vào repo này |
