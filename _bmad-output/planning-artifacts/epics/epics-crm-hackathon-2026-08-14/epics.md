---
title: Why Now — Kế hoạch dựng theo sáu cục song song
status: draft
created: 2026-08-14
updated: 2026-08-14
---

# Kế hoạch dựng — sáu cục, đóng băng hợp đồng trước

Tài liệu này **thay thế** dải `E1-S1`…`E7-S8` của *Phản biện và phân tích yêu cầu* Mức 3 làm đơn
vị giao việc. Dải cũ giữ nguyên giá trị **tham chiếu tiêu chí nghiệm thu** — mỗi story ở đây trỏ
ngược về mã cũ ở cột *Kế thừa*, nên không mất truy vết.

Lý do thay: dải cũ cắt theo **nhóm tính năng của đề bài**, còn đội cắt theo **tầng kiến trúc** để
chạy song song. Hai trục cắt khác nhau; giữ cả hai làm đơn vị giao là tạo hai sổ công việc cho một
đội.

---

## 0. Căn cứ ưu tiên — nêu tên trước khi xếp

BABOK Prioritization `10.33` bắt nêu **tên căn cứ** trước khi xếp thứ tự, và bắt tách **phụ thuộc
kỹ thuật** (ràng buộc ép buộc) khỏi các căn cứ về **giá trị** (lựa chọn thật). Hai loại đó xếp
riêng dưới đây.

**Căn cứ giá trị — đội chọn: *thiệt hại nếu không làm*.**
Trượt một điểm trong `T-1`…`T-10` hoặc hỏng `D37` là mất trắng, không gỡ lại được trong ngày thi.
Ấn tượng với giám khảo thì hỏng một phần vẫn còn phần khác. Nên thứ tự bám điểm nghiệm thu, không
bám độ bắt mắt.

**Ràng buộc ép buộc — không phải lựa chọn.**
Năm tầng có chuỗi phụ thuộc chặt ⑤ ← ④ ← ③ ← ② ← ①. Chuỗi này **không song song hoá được ở phần
hiện thực**. Nó chỉ song song hoá được ở phần **hợp đồng**: bốn tầng trên xây dựa vào chữ ký kiểu,
không dựa vào mã chạy được của tầng dưới. Đó là lý do có Cục 0, và Cục 0 không phải một lựa chọn.

**Hạng mục không gắn được vào căn cứ đã chọn** — nêu ra để không giả vờ là đã ưu tiên. Sáu story
dưới đây có cột `T` trống, tức **không** điểm nghiệm thu nào phủ tới, nên căn cứ *thiệt hại nếu
không làm* không nói được gì về chúng. Mỗi cái phải khai một căn cứ **khác**, hoặc bị cắt:

| Story | Căn cứ thật của nó | Cắt được không |
|---|---|---|
| `C3-3` phanh sau N lần từ chối | **rủi ro** — vòng lặp hỏng đốt ngân sách giữa buổi chấm | không, `R3` treo vào nó |
| `C3-4` trần ngân sách vòng quét | **rủi ro** — cùng lý do | không |
| `C2-4` Zod không dùng `z.date()` | **phụ thuộc kỹ thuật** — ném lúc dựng, chặn cả cục ② | không, ràng buộc ép buộc |
| `C2-5` tự giới hạn tầng ② | **rủi ro** — lặp vô hạn | không |
| `C5-11` suy Độ liên quan và Mức chắc chắn | **phụ thuộc kỹ thuật** — `C4-6` và `FR-18` đọc kết quả của nó | không |
| `C1-14` bảng đo lường Quản trị | **lợi ích mang lại** — nhóm 6 của đề bài, giám khảo xem nhưng không có `T` | **có** — đã xếp là thứ cắt đầu tiên nếu M2 trượt |

Chỉ **một** trong sáu cắt được. Năm cái còn lại trông như *"nên có"* nhưng thực ra là ràng buộc ép
buộc hoặc đường ứng phó rủi ro — đúng cái bẫy mà việc bắt nêu tên căn cứ trước khi xếp dùng để tránh.

### Kỹ thuật BABOK dùng ở tài liệu này

| Kỹ thuật | Dùng ở đâu |
|---|---|
| Functional Decomposition `10.22` | bẻ khối dựng thành sáu cục |
| Scope Modelling `10.41` | vẽ ranh giới **tệp sở hữu** của từng cục |
| Interface Analysis `10.24` | §1 — điểm trao đổi qua ranh giới, nội dung Cục 0 |
| Acceptance and Evaluation Criteria `10.1` | `T-1`…`T-10` dùng làm hợp đồng, không chỉ làm phép kiểm |
| Prioritization `10.33` | §0 |
| Risk Analysis and Management `10.38` | §4 sổ rủi ro |

> Phân định nguồn: số hiệu tra được trong BABOK v3. Cách áp vào một cây mã cụ thể là diễn giải của
> đội, không phải phát biểu của IIBA.

---

## 1. Cục 0 — Đóng băng hợp đồng

**Tuần tự. Không cục nào bắt đầu trước khi Cục 0 xong.** Ước lượng 60–90 phút.

Interface Analysis `10.24` hỏi sáu câu về mỗi điểm trao đổi qua ranh giới: ở đâu · cái gì · vì sao ·
khi nào · thế nào · **cho ai**. Cục 0 trả lời câu *cái gì* và *thế nào* bằng **chữ ký kiểu**, và để
lại *thân rỗng* ném `new Error("chưa hiện thực")`.

Nguyên tắc cắt lấy từ bổ ngữ *bó thời gian*: **chỉ đóng băng thứ sửa sau rất đắt.** Chữ ký qua ranh
giới sửa sau rất đắt vì nó kéo theo mọi bên gọi. Thân hàm sửa sau rẻ vì nó cục bộ.

| ID | Việc | Tệp sở hữu | Xong khi |
|---|---|---|---|
| `C0-1` | Trọn từ vựng mã lỗi — mọi `BusinessRuleCode`, `DenyReason`, `FailureCode` mà **cả sáu cục** sẽ cần | `src/core/errors.ts` | Không cục nào phải thêm mã sau đó. Mỗi mã tra được ở PRD §7.1/§9 hoặc Mục 0 — không bịa mã mới |
| `C0-2` | Chữ ký nghiệp vụ lõi cho tám thực thể, thân rỗng | `src/core/{company,contact,opportunity,activity,timeline,signal,suggestion,nextaction}/index.ts` | `npx tsc --noEmit` sạch |
| `C0-3` | Chữ ký `CapabilityDef` — tên, vùng, mức rủi ro, tham số, kiểu trả về; và sổ đăng ký | `src/capability/types.ts`, `src/capability/registry.ts` | Sổ khai đủ tên mọi capability, thân rỗng |
| `C0-4` | Chữ ký Cổng bảy bước + `GateResult` | `src/autonomy/types.ts` | Bảy bước có tên hàm, thân rỗng |
| `C0-5` | Chữ ký tầng agent — `runScan`, `extractSignals`, kiểu trả về Zod | `src/agent/types.ts` | Kiểu trả về là Zod schema, **không** `z.date()` (Zod 4.4.3 ném lúc dựng — dùng `z.iso.datetime()`) |
| `C0-6` | Chữ ký server action tầng ① — vào/ra, cách chở lỗi lên giao diện | `src/app/_actions/types.ts` | Mọi bề mặt `S0`–`S11` gọi được mà không cần biết tầng dưới |
| `C0-7` | **Năm** lệnh một-bước `§7.3`/`§7.5`, và **toàn bộ** phụ thuộc | `package.json`, `docker-compose.yml` | `npm run build` · `start` · `seed` · `test` · `stop` đều tồn tại; bốn lệnh đầu chạy tới nơi (được phép đỏ vì chưa có mã); `stop` **luỹ đẳng** — chạy khi chưa từng `start` vẫn thoát 0. `npm ci` cài xong phụ thuộc của **cả sáu cục**, kể cả phiên đăng nhập (`FR-49`) và lịch ngày làm việc (`BR-D7`) — sau bước này `dependencies` chỉ đọc |
| `C0-8` | Khung bộ kiểm thử — `setup.ts`, `global-setup.ts`, factory dữ liệu | `tests/setup.ts`, `tests/global-setup.ts`, `tests/factory.ts` | `npm test` chạy được và báo *0 passed*, **không** báo lỗi cấu hình. `TEST_DATABASE_URL` vào được `process.env`, và `migrate reset` trỏ CSDL **5443**, tuyệt đối không phải 5442 |
| `C0-9` | Chữ ký lời gọi của cả mười `T`, thân `it.todo` | `tests/T1.test.ts` … `tests/T10.test.ts` | Mười tệp tồn tại, mỗi tệp gọi đúng API thật của cục nó kiểm. Đây là chỗ `10.1` biến tiêu chí nghiệm thu thành hợp đồng |

**Tệp đóng băng — sau Cục 0 chỉ đọc, kể cả với cục sở hữu thư mục chứa nó.**

Ràng buộc thật của kế hoạch này là **hợp đồng**, không phải đụng độ tệp. Nên mọi tệp Cục 0 sinh ra
đều nằm trong bảng dưới, dù nó đứng trong lãnh thổ của một cục: không có dòng này thì cục ② được
phép sửa `src/agent/types.ts` đơn phương, bốn cục kia vẫn biên dịch với một kiểu **đã đổi nghĩa**,
và chỉ vỡ lúc gộp.

| Tệp | Ai muốn sửa | Vì sao phải đóng băng |
|---|---|---|
| `src/core/errors.ts` | cả sáu cục | mỗi cục thêm một mã là sáu nhánh cùng sửa một tệp |
| `prisma/schema.prisma` | ④ và ⑤ | 19 bảng; đổi lược đồ kéo theo sinh lại client ở mọi nhánh |
| `src/config.ts` | ② và ⑤ | tệp duy nhất đọc `process.env` |
| `package.json` | mọi cục | thêm script hoặc phụ thuộc là xung đột lockfile lúc gộp |
| `src/core/*/index.ts` (8 tệp) | ④ gọi, ⑤ cài | chữ ký lõi — đổi là kéo theo cả năm cục |
| `src/capability/types.ts` · `registry.ts` | ②, ③, ④ | ② chỉ thấy capability qua sổ này |
| `src/autonomy/types.ts` | ③, ④ | `GateResult` là kiểu ④ trả lên ② |
| `src/agent/types.ts` | ①, ② | lược đồ Zod mà ① hiển thị |
| `src/app/_actions/types.ts` | ① | mọi bề mặt `S0`–`S11` gọi qua đây |

**Mở lại thì làm thế nào.** Đúng **một** người có quyền mở, và phải báo cả đội trước khi ghi. Đây
là ràng buộc phối hợp, không phải ràng buộc kỹ thuật — nhưng nó là chỗ hỏng dễ nhất, vì lần mở thứ
hai không có ai nghĩ tới. Trong lúc chờ, cục bị chặn dùng tạm mã gần nhất rồi đổi ở lần gộp; tuyệt
đối **không** bịa mã mới.

---

## 2. Sáu cục

**Luật tệp sở hữu.** Mỗi cục chỉ ghi trong thư mục của mình. Muốn sửa tệp của cục khác thì **không
sửa** — nêu ra, và Cục 0 mở lại một lần cho cả đội. Đây là luật chống đụng độ, và nó là ràng buộc
thật vì nút thắt của đội là đụng độ tệp, không phải giờ-người.

| Cục | Thư mục sở hữu | Chạy được khi |
|---|---|---|
| ⑤ Lõi domain | `src/core/**`, `prisma/**` | ngay sau Cục 0 |
| ④ Capability | `src/capability/**` | ngay sau Cục 0 |
| ③ Cổng tự chủ | `src/autonomy/**` | ngay sau Cục 0 |
| ② Agent Runtime | `src/agent/**` | ngay sau Cục 0 |
| ① Tương tác | `src/app/**`, `src/ingest/**`, `src/scan/**` | ngay sau Cục 0 |
| T Nghiệm thu | `tests/**` (thân phép kiểm) | mỗi `T` khi mắt xích cuối của nó xong |

**Quy tắc gán `T`:** mỗi điểm nghiệm thu thuộc cục chứa **mắt xích cuối** của nó — cục mà khi xong
thì phép kiểm chuyển xanh. Không gán theo cục "liên quan nhiều nhất", vì tiêu chí đó không quyết
được.

---

### Cục ⑤ — Lõi domain · `src/core/**`, `prisma/**`

**Xếp theo cái mở khoá nhiều nhất.** Mỗi thực thể xong là một đèn xanh cho các cục trên; nên thứ tự
ở đây quyết định bốn cục kia phải chờ bao lâu ở trạng thái *biên dịch được nhưng chưa chạy được*.

Đã xong trước tài liệu này: `actor.ts` · `errors.ts` · `db.ts` · `normalize.ts` · `settings.ts` ·
`audit.ts` · `metrics.ts` · `opportunity/stage.ts`.

| ID | Story | Tiêu chí nghiệm thu | Kế thừa | T |
|---|---|---|---|---|
| `C5-1` | Là lõi, tôi tạo/sửa/xoá mềm/đọc Công ty | Tên, ngành, loại công ty bắt buộc · loại chỉ nhận đúng năm giá trị `0.1.1` · xoá là xoá mềm · **cascade nêu đích danh**: Người liên hệ, Cơ hội, Hoạt động, Việc tiếp theo, Bản chụp, Bản lưu, Thông báo (`D26`) · Gợi ý còn chờ chuyển `dong_he_thong` + `cong_ty_da_xoa` · **Phát hiện và Dòng thời gian GIỮ NGUYÊN** — chúng là bằng chứng · đọc không bao giờ trả hàng đã xoá | `E1-S1` | `T-1` |
| `C5-2` | Là lõi, tôi quản lý Người liên hệ và Đầu mối chính | Người liên hệ thuộc đúng một Công ty · **tối đa một** Đầu mối chính mỗi Công ty, canh bằng chỉ mục `contact_one_primary` — giao dịch cho tính **nguyên tử**, chỉ mục cho tính **duy nhất**; hai lời gọi đồng thời không tạo được hai Đầu mối (`BR-D4`) · xoá Đầu mối chính để lại 0 đầu mối, không lỗi | `E1-S2` | `T-1` |
| `C5-3` | Là lõi, tôi tạo/sửa/xoá mềm Cơ hội | Thuộc đúng một Công ty · giá trị tiền **không âm** (`CHECK opp_amount_non_negative`) · một đơn vị tiền duy nhất (`BR-D9`) · giai đoạn khởi tạo lấy từ hằng `INITIAL_STAGE`, người tạo không chọn được (`D44`) | `E1-S3` | `T-1` |
| `C5-4` | Là lõi, tôi nối máy trạng thái Giai đoạn vào tầng lưu trữ | `changeStage`/`resumeOrReopen` ghi được xuống CSDL trong một giao dịch · mỗi lần đổi **thật** sinh **một** mục Dòng thời gian; thả thẻ về đúng cột cũ là **no-op** — không sinh mục, ghi vết `outcome='no_op'` · `latest_open_stage` khớp hai `CHECK` của migration | `E1-S4` | `T-1` |
| `C5-5` | Là lõi, tôi canh Cổng Đủ điều kiện | Sang `du_dieu_kien` **không bị chặn** dù thiếu hai ô dấu hiệu · cờ tính theo **giai đoạn hiện tại ≥ `du_dieu_kien`**, KHÔNG theo sự kiện *vừa sang* — nhảy cóc `tiep_can → soan_de_xuat` vẫn phải mang cờ (`C1-2` cho phép nhảy cóc) · `false` là **đã trả lời**, khác `null` chưa hỏi; trả lời *không* thì cờ tắt (`BR-B2`) | `E1-S5` | `T-1` |
| `C5-6` | Là lõi, tôi ghi Hoạt động và dựng Dòng thời gian hợp nhất | Hoạt động có ngày, loại, mô tả, người liên hệ · người liên hệ chỉ chọn được **trong phạm vi Công ty đó** — khoá ngoại chỉ bắt được *có tồn tại*, luật phạm vi do lõi canh · hàng `timeline` tạo **cùng giao dịch** với Công ty (quan hệ 1-1 bắt buộc), nếu không máy thêm mục vào Công ty mới sẽ ăn lỗi khoá ngoại đúng đường `T-8` · Dòng thời gian trộn Hoạt động + đổi Giai đoạn + ghi chú, mới nhất trên · mục do máy thêm mang nhãn riêng | `E1-S6`, `E1-S7` | `T-1` |
| `C5-7` | Là lõi, tôi quản lý Việc tiếp theo và ngày hạn | Thiếu một trong hai vẫn lưu được — `content` và `due_date` **nullable** · tối đa một hàng ĐANG SỐNG mỗi Cơ hội, canh bằng `next_action_one_active`; xoá mềm rồi tạo lại phải được (`T-7` bấm lần hai) · Cơ hội **đang chạy** mà thiếu thì mang cờ và **không** vào danh sách việc phải làm · `tam_dung` miễn trừ, cờ im lặng (`BR-B4`, `D11`) · Cơ hội **đã đóng** không mang cờ và không vào danh sách quá hạn | `E1-S8` | `T-1` |
| `C5-8` | Là lõi, tôi canh lý do thua | Sang `thua` **không bị chặn** khi thiếu lý do · thiếu thì mang cờ và **đứng ngoài** bảng thống kê (`BR-B3`) · lý do là enum dạng mảng cộng ô ghi chú, không phải câu tự do (`D27`) | `E1-S9` | `T-1` |
| `C5-9` | Là lõi, tôi từ chối Phát hiện không có câu trích | Ghi thẳng qua lõi, không qua giao diện, vẫn bị từ chối bằng `BR-D1` · câu trích phải **khớp nguyên văn** một đoạn của Bản lưu sau chuẩn hoá, lệch thì loại và ghi nhật ký (`BR-D2`) | `E2-S1`, `E2-S2` | **`T-2`** |
| `C5-10` | Là lõi, tôi neo vị trí câu trích trong Bản lưu | `findQuote` trả khoảng vị trí trên **văn bản gốc**, không trên bản đã chuẩn hoá · chuẩn hoá luỹ đẳng (`NORMALIZER_VERSION`) · chuỗi rỗng trả `null`, không trả `{0,0}` | `E2-S3` | `T-3` |
| `C5-11` | Là lõi, tôi suy Độ liên quan và Mức chắc chắn | Suy từ Loại tin và `signal_subtype` · mô hình lệch **tối đa một bậc** kèm một câu lý do (`BR-D6`) · `signal_subtype` chỉ điền khi `signal_type = other`, canh bằng `CHECK signal_subtype_only_other` | `E2-S4` | — |
| `C5-12` | Là lõi, tôi quản lý ba lối ra của Gợi ý | `duyet` · `sua_roi_duyet` · `bo` đều ghi ai/lúc nào/quyết gì · **`sua_roi_duyet` không cộng vào `duyet`** trong `autoAcceptRate` · một Gợi ý chờ mỗi ô, canh bằng `suggestion_one_pending_per_slot` · **lối ra thứ tư**: Gợi ý mới trên ô đã có Gợi ý chờ thì đóng cái cũ bằng `dong_he_thong` + `co_goi_y_moi_hon` **trong cùng giao dịch** rồi mới chèn — không làm thế thì vi phạm chỉ mục và hỏng cả vòng quét · quyết một Gợi ý phải ghi **có điều kiện** `where status='cho'`, để người không đè lên quyết định vừa rồi của hệ thống | `E3-S1`…`E3-S4` | **`T-5`** |
| `C5-13` | Là lõi, tôi tính hạn cho Việc tiếp theo do máy đặt | Hạn = f(Loại tin, Mức chắc chắn) theo `0.2.1`, đo từ **ngày sự kiện**, tính theo ngày làm việc của thị trường Công ty · không đọc được ngày sự kiện thì lấy ngày Bản lưu (`D5`) · sàn cuối ngày làm việc kế tiếp, trần 14 ngày làm việc | `E4-S1` | `T-6` |
| `C5-14` | Là lõi, tôi gộp nhiều tin cùng lúc | Lấy **hạn ngắn nhất**; nội dung nhắc **mọi** tin đã kích hoạt · bất biến: hạn do máy đặt **không bao giờ bị đẩy xa hơn** (`BR-D8`) | `E4-S2` | `T-6` |
| `C5-15` | Là lõi, tôi cho Hoàn tác trong 7 ngày | Một cú bấm đưa ô về **đúng** giá trị trước khi máy chạm · **đường phổ biến nhất là ô vốn TRỐNG** (mức tự do chỉ cho điền ô trống), nên *nguyên trạng* ở đó nghĩa là **không có Việc tiếp theo** — xoá mềm hàng, trả `null`, không trả chuỗi rỗng · bấm lần hai là **no-op**, không sinh hai dòng vết · người đã sửa tay thì Hoàn tác **không** ghi đè: ghi có điều kiện `where set_by='he_thong' AND undo_deadline_at > now()` · cửa sổ 7 ngày · ghi vết cho **cả** lần tự đặt lẫn lần hoàn tác (`D14`) | `E4-S3` | **`T-7`** |
| `C5-16` | Là lõi, tôi từ chối mọi thao tác cấm dưới danh nghĩa hệ thống | Đổi Giai đoạn → `NFR-14` · đổi giá trị tiền → `NFR-15` · xoá Công ty → `NFR-17` · sửa mục Timeline người tạo → `NFR-19`. Cả bốn gọi **thẳng lõi**, không qua giao diện, đều ném đúng mã | `E7-S1` | **`T-10`** |
| `C5-17` | Là đội, tôi có bộ dữ liệu gieo chạy một lệnh | `npm run seed` trên clone sạch dựng đủ dữ liệu cho **cả mười** `T` · **hai tài khoản** Sales và Quản trị (`C1-16`) · tối thiểu **ba Gợi ý đang chờ** trên ba ô khác nhau, để `T-5` chạy được khi tầng ② chưa có (điều kiện xanh của M2) · gieo ở chế độ miễn trừ ghi vết (`AD-20`, `TR-4`) trừ khi có `--keep-audit` · **luỹ đẳng thật**: mọi bảng gieo phải có khoá tự nhiên hoặc `id` cố định — hôm nay chỉ 5/19 bảng có `source_ref`, nên chạy hai lần sẽ nhân đôi Phát hiện và mục Timeline, và `T-8` đếm sai | `E7-S7` | mọi `T` |

---

### Cục ④ — Capability · `src/capability/**`

| ID | Story | Tiêu chí nghiệm thu | Kế thừa | T |
|---|---|---|---|---|
| `C4-1` | Là tầng ④, tôi khai mọi capability trong **một** sổ đăng ký | Mỗi mục có tên, vùng, mức rủi ro, lược đồ tham số · **không** capability nào không nằm trong sổ · sổ là nơi duy nhất tầng ② nhìn thấy | `E7-S2` | `T-10` |
| `C4-2` | Là tầng ④, tôi chứng minh bằng **vắng mặt** rằng không có công cụ xoá | Rà trọn sổ đăng ký: không mục nào xoá dữ liệu người tạo, không mục nào sửa mục Timeline người tạo (`NFR-17`, `NFR-19`) · không mục nào gửi thư, tin nhắn hay webhook ra ngoài; lệnh gọi mạng chỉ tới nhà cung cấp mô hình trong danh sách cho phép (`NFR-16`, `D25`) — **và một lệnh gọi mô hình vẫn phải qua được** (`F38`) · khẳng định trên **danh sách trắng tên hàm lõi** mà mỗi mục được gọi, không chỉ trên tên và vùng tự khai: một capability tên `updateAccountField` nhận `value=null` vẫn xoá được | `E7-S1` | **`T-10b`** |
| `C4-3` | Là tầng ④, mỗi capability đi qua Cổng trước khi chạm lõi | Không đường nào từ ② tới ⑤ mà không qua ③ · gọi tắt bị chặn ở mức kiểu, không chỉ ở mức quy ước | `E7-S2` | `T-10` |
| `C4-4` | Là tầng ④, tôi bọc capability **đọc** cho tầng ② | Đọc Công ty, Cơ hội, Bản lưu, Phát hiện · mọi đường đọc đều lọc hàng đã xoá mềm | `E5-S1` | `T-8` |
| `C4-5` | Là tầng ④, tôi bọc capability **ghi** ở mức tự do | Thêm mục Timeline (gắn nhãn do hệ thống thêm) · điền ô Việc tiếp theo **đang trống** · cả hai và **chỉ** hai thứ này ở mức tự do (`D16`, `D4`, `D12`) · điền là **kiểm-và-ghi nguyên tử** (`FR-34`): cập nhật có điều kiện *ô vẫn đúng giá trị máy đã đọc*; 0 hàng bị chạm thì **bỏ lượt ghi**, không thử lại (`AD-10`) — thiếu nó thì vòng quét đọc lúc 10:00:30, người lưu lúc 10:00:31, máy đè lúc 10:00:32 · chỉ áp cho Cơ hội **đang chạy**, không áp cho Cơ hội đã đóng | `E5-S3`, `E4-S1` | `T-8`, `T-6` |
| `C4-6` | Là tầng ④, tôi bọc capability **đề nghị** — sinh Gợi ý chờ duyệt | Máy không tự áp; nó chỉ thêm hàng vào Hàng đợi gợi ý · Phát hiện `low` **không** vào hàng đợi (`D45`, `FR-18`) | `E3-S1` | `T-4` |
| `C4-7` | Là tầng ④, tôi ghi vết **mọi** lời gọi, kể cả lời gọi hỏng | Ghi hai pha: pha 1 trước khi lõi mở giao dịch, pha 2 trong giao dịch · đường `BusinessRuleError` dùng `completeDetached` nên không cuộn mất vết (`AD-4` bất biến ①) | `E7-S4` | `T-5`, `T-10` |

---

### Cục ③ — Cổng tự chủ · `src/autonomy/**`

| ID | Story | Tiêu chí nghiệm thu | Kế thừa | T |
|---|---|---|---|---|
| `C3-1` | Là Cổng, tôi chạy đủ bảy bước theo đúng thứ tự | Bảy bước khớp `AD-4` · từ chối trả đúng một trong sáu `DenyReason` · bước nào cũng để lại vết | `E7-S2` | `T-4` |
| `C3-2` | Là Cổng, tôi chặn theo **mức tự chủ** của capability | Mức *tự do* đi thẳng · mức *đề nghị* chỉ sinh Gợi ý · mức *chỉ người* bị từ chối với `actor_not_allowed` khi tác nhân là máy | `E7-S2` | **`T-4`**, `T-10` |
| `C3-3` | Là Cổng, tôi có phanh — dừng sau N lần từ chối liên tiếp | Ngưỡng đọc từ `settings` mỗi lần dùng, không nhớ đệm · vượt ngưỡng thì `brake`, và trạng thái phanh nhìn thấy được ở màn hình Quản trị | `E6-S2` | — |
| `C3-4` | Là Cổng, tôi canh trần ngân sách một vòng quét | Cảnh báo ở `budget_warn_ratio`, dừng ở `budget_stop_ratio` · đếm bằng bộ đếm `cost_used_usd` **mức vòng quét**, không phải `maxBudgetUsd` của một lời gọi | `E6-S2` | — |
| `C3-5` | Là Cổng, tôi có nút tắt toàn bộ phần AI | Trạng thái tắt có **chỗ lưu**: một khoá `ai_enabled` thêm vào `SettingKey` (từ vựng đang ĐÓNG, nên phải khai ở Cục 0) · từ chối trả **đúng một trong sáu** `DenyReason` — quyết `brake` hay `limit`, không bịa mã thứ bảy · tắt giữa lúc vòng quét đang chạy thì **hai chu kỳ kế tiếp** không thêm mục Timeline, không sinh Gợi ý, không tự đặt Việc tiếp theo · lời gọi mô hình **đang bay** lúc bấm: kiểm cờ **lần nữa ngay trước khi ghi**, không chỉ trước khi gọi · dữ liệu đã sinh **còn nguyên** · bật lại thì chạy tiếp · **cả hai lần bấm đều có ghi vết** | `E6-S3` | **`T-9`** |
| `C3-6` | Là Cổng, tôi để hồ sơ Công ty y nguyên khi Gợi ý không được quyết | Sinh một Gợi ý rồi không làm gì · sau **ít nhất ba** chu kỳ vòng quét, so hồ sơ Công ty: không ô nào đổi · **nêu tên tập cột** đem so — tám ô `TargetField`, KHÔNG gồm `updated_at` (`@updatedAt`, đổi theo mọi lần ghi chạm hàng), KHÔNG gồm Dòng thời gian và cờ `watching`. Thiếu việc nêu tên thì `T-4` đỏ vì đúng hành vi mà `T-8` đòi phải có | `E3-S5` | **`T-4`** |

---

### Cục ② — Agent Runtime · `src/agent/**`

| ID | Story | Tiêu chí nghiệm thu | Kế thừa | T |
|---|---|---|---|---|
| `C2-1` | Là tầng ②, tôi gọi mô hình với **cả bốn** tuỳ chọn khoá công cụ | `tools: []` **một mình là không đủ** — đã đo: bộ xử lý vẫn chạy, $1.607 so với $0.091. Phải đủ `allowedTools` + `permissionMode` + hai tuỳ chọn còn lại theo `AD-1` | `E7-S2` | `T-10` |
| `C2-2` | Là tầng ②, tôi rút Phát hiện từ Bản lưu kèm câu trích | Mọi Phát hiện mang câu trích **khớp nguyên văn**; không khớp thì loại tại chỗ, không đẩy xuống lõi · enum bắt chọn trong danh sách cho sẵn, không nhập tự do (`BR-D10`) | `E2-S1`, `E2-S4` | `T-2` |
| `C2-3` | Là tầng ②, tôi chỉ thấy capability qua sổ đăng ký của ④ | Không `import` nào từ `src/agent` chạm `src/core` hay `@prisma/client` · cưỡng chế bằng luật ranh giới của eslint, không bằng lời dặn | `E7-S2` | `T-10` |
| `C2-4` | Là tầng ②, mọi lược đồ trả về là Zod và **không** dùng `z.date()` | Đã đo với Zod 4.4.3: `z.date()` ném lúc **dựng**, không phải lúc chạy · dùng `z.iso.datetime()` · `tool()` nhận `AnyZodRawShape`, không nhận `ZodObject` | — | — |
| `C2-5` | Là tầng ②, tôi tự giới hạn để không lặp vô hạn | Sáu hình dạng lỗi đã liệt kê ở spine đều thoát được, không chỉ hình dạng đầu · vượt giới hạn thì trả về sạch, không ném | — | — |
| `C2-6` | Là tầng ②, tôi ghi chi phí và số lời gọi cho từng Công ty | Mỗi Công ty một dòng `ScanLogEntry` có `cost_usd` · `estimatedCostPerAccount` đọc được từ đó · đây là đầu vào của phanh ngân sách `C3-4` | `E5-S4` | `T-8` |

---

### Cục ① — Tương tác · `src/app/**`, `src/ingest/**`, `src/scan/**`

| ID | Story | Tiêu chí nghiệm thu | Kế thừa | T |
|---|---|---|---|---|
| `C1-1` | Là Sales, tôi quản lý Công ty và Người liên hệ trên màn hình | Bề mặt `S1`, `S2` · tạo/sửa/xoá/xem · lỗi từ lõi hiện thành chữ tiếng Việt theo **mã**, không theo thông điệp | `E1-S1`, `E1-S2` | `T-1` |
| `C1-2` | Là Sales, tôi kéo thả Cơ hội giữa bảy giai đoạn | **Kéo thả thật**, không mở biểu mẫu (`T-1` đòi nguyên văn) · **đi lùi và nhảy cóc đều được** · bảy giai đoạn đúng thứ tự và đúng nhãn (`BR-D11`) | `E1-S4` | **`T-1`** |
| `C1-3` | Là Sales, tôi được hỏi hai dấu hiệu ngay khi sang Đủ điều kiện | Hộp hỏi bật ngay · **bỏ qua được**, thẻ vẫn sang · thiếu thì cờ cảnh báo nhìn thấy trên thẻ | `E1-S5` | **`T-1`** |
| `C1-4` | Là Sales, tôi được hỏi lý do thua khi đóng Thua | Enum dạng mảng cộng ô ghi chú · bỏ qua được · cờ cảnh báo hiện trên thẻ | `E1-S9` | `T-1` |
| `C1-5` | Là Sales, tôi xem Dòng thời gian hợp nhất của Công ty | Mới nhất trên cùng · mục do máy thêm mang nhãn phân biệt được **bằng mắt** | `E1-S7` | `T-1`, `T-8` |
| `C1-6` | Là Sales, tôi tìm và lọc | Tìm Công ty theo tên · lọc theo ngành, loại, quốc gia, nhãn Đang theo dõi · lọc Cơ hội theo giai đoạn và tình trạng quá hạn · **các bộ lọc kết hợp được** | `E1-S10` | **`T-1`** |
| `C1-7` | Là Sales, tôi mở màn hình tổng quan | Số Công ty theo ngành · số Cơ hội và tổng giá trị theo giai đoạn, gọi đúng tên *"tổng giá trị ước tính (chưa nhân xác suất)"* (`D34`) · danh sách Việc tiếp theo **quá hạn** · khối thống kê lý do thua | `E1-S11` | **`T-1`** |
| `C1-8` | Là Sales, tôi bấm một Phát hiện và thấy đúng đoạn văn gốc | Mở Bản lưu, cuộn tới vị trí, **đánh dấu** khoảng câu trích · vị trí lấy từ `C5-10`, không tự tính lại ở giao diện | `E2-S3` | **`T-3`** |
| `C1-9` | Là Sales, tôi duyệt / sửa-rồi-duyệt / bỏ Gợi ý trong Hàng đợi | Ba nút phân biệt · Bỏ hỏi lý do · thời gian quyết đo được để `BR-B6` dùng | `E3-S1`…`E3-S4` | **`T-5`** |
| `C1-10` | Là Sales, tôi bấm Hoàn tác một lần và giá trị cũ trở lại | **Một** cú bấm · giá trị về đúng nguyên trạng · thông báo xác nhận | `E4-S3` | **`T-7`** |
| `C1-11` | Là Sales, tôi thấy ô Việc tiếp theo mang dấu hiệu do hệ thống đặt | Dấu hiệu nhìn thấy được, khác ô người nhập · kèm thông báo khi máy vừa đổi | `E4-S2` | **`T-6`** |
| `C1-12` | Là đội, tôi có bộ nạp Bản chụp hai phiên bản | `src/ingest` đọc bộ dữ liệu BTC, mỗi Công ty hai Bản chụp *trước*/*sau* · đổi một Công ty sang phiên bản *sau* bằng một thao tác — `T-6` và `T-8` đều cần | `E2-S1` | **`T-6`**, **`T-8`** |
| `C1-13` | Là đội, tôi có vòng quét chạy theo chu kỳ | `src/scan` chạy khép kín trên Công ty Đang theo dõi · **không chồng vòng** (`D19`), và khoá vòng có **hạn thuê**: `finished_at IS NULL AND started_at < now() - lease` thì coi là vòng chết, ghi lý do rồi cho vòng mới chạy — không có nó thì một tiến trình chết khoá cứng vòng quét cả buổi · Nhật ký ghi đủ sáu trường của `FR-39` (số Công ty, số nội dung mới, số mục thêm, thời gian, lỗi) cộng trạng thái *vòng không trọn* khi bị phanh cắt · màn hình Nhật ký thuộc `src/app`, vì `T-8` đọc trên đó · bật Đang theo dõi cho ba Công ty, đổi nguồn hai Công ty → trong hai chu kỳ có **đúng hai** mục mới, không ai bấm gì | `E5-S1`, `E5-S2`, `E5-S4` | **`T-8`** |
| `C1-14` | Là Quản trị, tôi xem bảng đo lường và sửa tham số | Hai chỉ số gọi **đúng** hàm của `metrics.ts`, không truy vấn tự chế · sửa ngưỡng có hiệu lực **ngay**, không nhớ đệm (`D38`) · khối cảnh báo dùng chữ *"N gợi ý cần rà lại"*, **không** dùng *"phát hiện bất thường"* (`D29`) | `E6-S1`, `E6-S2` | — |
| `C1-15` | Là Sales, tôi dùng trọn nhóm 1 khi phần AI **bị tắt** | Tắt AI thì `C1-1`…`C1-7` chạy đủ, không thiếu chức năng, không lỗi màn hình · có dòng thông báo đang tắt | `E1-S12`, `E6-S3` | **`T-1`**, **`T-9`** |
| `C1-16` | Là giám khảo, tôi tự đăng nhập được bằng hai tài khoản thật | Hai tài khoản Sales và Quản trị gieo sẵn, đăng nhập được không cần ai hướng dẫn (`§7.3`) · `actor` của **mọi** lời gọi lõi lấy từ phiên, không hằng số, không tham số từ máy khách · gọi thẳng server action của màn hình Quản trị bằng phiên Sales bị từ chối **ở tầng nghiệp vụ**, không chỉ ẩn menu (`D28`) | `E7-S6` | `T-10` |
| `C1-17` | Là đội, tôi có bản dựng production chạy được trên clone sạch | `npm ci && npm run build && npm run start` phục vụ được trang chủ ở `NODE_ENV=production` — **không** dev server, **không** hot reload · cấu hình qua biến môi trường · dữ liệu còn nguyên sau khi khởi động lại tiến trình · log ra chỗ xem được (`§7.3`) | `E7-S5` | — |

---

### Cục T — Nghiệm thu · `tests/**`

Thân phép kiểm viết bởi cục sở hữu **mắt xích cuối**. Chữ ký lời gọi đã đóng băng ở `C0-9`.

| T | Mắt xích cuối | Cục viết thân | Chặn mốc |
|---|---|---|---|
| `T-1` | giao diện CRM tay | ① | M2 |
| `T-2` | lõi từ chối Phát hiện thiếu câu trích | ⑤ | **M1** |
| `T-3` | giao diện neo câu trích | ① | M2 |
| `T-4` | ba **chu kỳ vòng quét** — vòng quét ở `src/scan` | ① | M3 |
| `T-5` | ba lối ra của Gợi ý + ghi vết | ① | M2 |
| `T-6` | Bản chụp *sau* → Việc tiếp theo tự đổi | ① | M3 |
| `T-7` | Hoàn tác một cú bấm | ① | M2 |
| `T-8` | vòng quét + Nhật ký vòng quét | ① | M3 |
| `T-9` | **bấm nút** tắt AI + dòng thông báo Sales thấy | ① | M3 |
| `T-10a` | lõi từ chối bốn thao tác dưới danh nghĩa hệ thống | ⑤ | **M1** |
| `T-10b` | rà **sổ đăng ký** ④: không mục nào xoá, không mục nào sửa Timeline người tạo | ④ | **M1** |

⚠ `T-4` và `T-9` **đã chuyển từ ③ sang ①**. Quy tắc *mắt xích cuối* nói vậy: `T-4` cần ba chu kỳ
vòng quét, `T-9` cần một cái nút bấm được và một dòng thông báo — cả ba đều ở `src/scan` và
`src/app`, mà cục ③ không sở hữu một pixel nào. Gán cho ③ khiến lịch trông như ③ tự chạy được.

⚠ `T-10` **tách làm hai tệp**. Một nửa khẳng định trên lõi (⑤), nửa kia khẳng định trên sổ đăng ký
của ④. Gộp một tệp thì `T-10` chặn M1 mà không ai thấy rằng **gần trọn cục ④ cũng nằm trong M1**.

---

## 3. Bốn mốc — định nghĩa bằng cái **chạy được**, kèm giờ tuyệt đối

Mốc định nghĩa bằng cái **chạy được**. Giờ ở cột thứ hai không phải ước lượng vận tốc — nó là
**cò súng**: tới giờ mà chưa xanh thì chạy ngay cột cắt, không họp. Không có cò thì chính sách
*"trượt thì cắt phạm vi"* chưa bao giờ kích hoạt được, và đội phát hiện trượt lúc 09:00 ngày thi,
khi cắt đã vô nghĩa.

| Mốc | Cò súng | Xanh khi | Cắt gì nếu trượt |
|---|---|---|---|
| **M0 — `D37` log về Grafana** | **22:00 · 14/8** | Bảng Grafana mở được, có **log thật** của một lần chạy Claude Code | **Không cắt được, và không phải việc của mã.** Nó cần hạ tầng công ty và lượt phản hồi của người khác, nên bắt đầu **trước mọi thứ**, dù xong sau |
| **M1 — nền chạy được** | **20:00 · 14/8** | Trên **clone sạch**: `npm ci && npm run build && npm run start` phục vụ được trang ở `NODE_ENV=production`; `npm run seed` và `npm test` chạy tới nơi; `T-2` · `T-10a` · `T-10b` xanh; đăng nhập được bằng hai tài khoản | Không cắt được. M1 trượt là cả kế hoạch trượt |
| **M2 — đường người demo được đầu-cuối** | **03:00 · 15/8** | `T-1` · `T-3` · `T-5` · `T-7` xanh; Sales thao tác được trọn nhóm 1 và Hàng đợi gợi ý **mà không cần tầng ② chạy** | Cắt phần **số đo** của `C1-14` (`FR-41`–`FR-43`) |
| **M3 — đường máy nối vào** | **07:00 · 15/8** | `T-4` · `T-6` · `T-8` · `T-9` xanh | Giảm chu kỳ vòng quét xuống **20 giây** để ba vòng chạy hết trong một phút |

**Hai đường cắt đã bị viết lại, vì bản trước tự đánh đỏ điểm nghiệm thu:**

- Cắt trọn `C1-14` là sai: **nút tắt AI** (`T-9`), **trạng thái phanh** và **ô chỉnh chu kỳ** đều
  ngồi trên màn hình Quản trị. Cắt nó là `T-9` mất bề mặt để bấm, và nhóm 6 của đề bài biến mất.
  Chỉ cắt được ba khối **số đo**.
- Giảm `C1-13` xuống *"một chu kỳ thủ công"* là sai: `T-8` đòi nguyên văn *"không ai bấm gì"*,
  `T-4` đòi *"ít nhất ba chu kỳ"*, `T-9` đòi *"bấm tắt **trong lúc** vòng quét đang chạy"*. Rút
  ngắn chu kỳ giữ được cả ba; bỏ hẹn giờ thì mất cả ba.

**M2 đòi Hàng đợi gợi ý dùng được khi tầng ② chưa chạy**, nên nguồn Gợi ý ở mốc đó là **dữ liệu
gieo** — `C5-17` phải gieo sẵn Gợi ý đang chờ, xem tiêu chí của nó.

---

## 4. Sổ rủi ro — Risk Analysis and Management `10.38`

| Mã | Vùng bất định | Ảnh hưởng | Đường ứng phó dựng **trước** |
|---|---|---|---|
| `R1` | ⑤ chậm → bốn cục kia biên dịch được nhưng **không chạy được** | cả bốn cục đứng ở trạng thái không kiểm chứng được | ⑤ giao **từng thực thể một**, mỗi thực thể là một đèn xanh. Không gom ⑤ thành một lần giao |
| `R2` | Đụng độ `src/core/errors.ts` giữa sáu nhánh | gộp nhánh hỏng đúng lúc không còn giờ gỡ | đóng băng trọn từ vựng ở `C0-1`; sau đó tệp này **chỉ đọc** |
| `R3` | Chi phí và độ trễ thật của tầng ② trên vòng quét đủ lớn chưa đo | vượt trần ngân sách giữa buổi chấm | `C3-4` phanh ngân sách phải xong **trước** `C1-13`, không phải sau |
| `R4` | `D37` xác minh log trên Grafana chưa làm | **mất cả vòng 1**, không cứu được | bắt đầu ngay, song song, không đợi mã |
| `R5` | `Q15` — lược đồ BTC phát ngày thi lệch giả định Tomahawk | ánh xạ dữ liệu phải viết lại sáng ngày thi | đã đo: chỉ ~19% cột trùng. Giữ `src/ingest` là **một** tệp ánh xạ, đổi một chỗ là xong |
| `R6` | Bộ câu hỏi 6 giám khảo cần lượt phản hồi qua đêm | mất đầu vào cho vòng 3 | Sales Manager gửi tối nay, không đợi mã xong |
| `R7` | **Tính năng BTC phát thêm sáng 15/8** (`D41`, `F40`) — đã biết trước là sẽ có | chiếm nửa quỹ giờ sau M2, đúng lúc không còn chỗ xoay | M2 phải xanh **trước khi** bộ dữ liệu BTC về; từ lúc đó cục ① ngừng nhận story mới. Danh sách cắt hạng hai xếp sẵn theo nhãn `nên có` của PRD: `FR-13`, `FR-17`, `FR-24`, `FR-26`, `FR-41`–`FR-43` |
| `R8` | Không có bảng phân công người | luật *tệp sở hữu* chỉ chống được đụng độ khi mỗi thư mục có **một** người ghi; hai dev chạy nhiều đầu việc AI trên sáu cục vi phạm giả định đó ngay giờ đầu | Trước khi bắt tay: một bảng ba cột — cục · người · mốc chịu trách nhiệm. Không cần ước lượng giờ, chỉ cần biết ai đang chạy cục nào |

---

## 5. Cái đã cố ý **không** làm

- **Không sinh story cho tầng ⑤ phần đã viết** — `stage.ts`, `audit.ts`, `metrics.ts`, `settings.ts`,
  `normalize.ts`, `db.ts` đã có.
  ⚠ *"Đã viết"* **không phải** *"đã kiểm"*. Hôm nay chỉ `stage.ts` và `normalize.ts` có phép kiểm
  (24 ca, chạy ngoài repo vì `tests/` chưa tồn tại) — `C0-8` là chỗ đưa chúng vào. Bốn tệp còn lại
  chưa có gì chứng minh, và hai trong số đó vừa lộ lỗi thật khi rà: `metrics.unclassifiedRatio` đếm
  sai đại lượng, `normalize` xoá mất U+3000. Đừng đọc dòng này như một đèn xanh.
- **Không giữ dải `E*-S*` làm đơn vị giao.** Nó cắt theo nhóm tính năng; đội cắt theo tầng. Hai sổ
  công việc cho một đội là cách chắc chắn để một nửa việc rơi mất.
- **Không ước lượng giờ cho từng story.** Estimation `10.19` cần dữ liệu vận tốc mà đội chưa có với
  cách làm này; một con số bịa ra ở đây sẽ được dùng như một con số thật.
