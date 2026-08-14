- source_spec: none
  summary: Cục 0 nửa hạ tầng — `C0-7` năm lệnh một-bước và toàn bộ phụ thuộc, `C0-8` khung bộ kiểm thử (`tests/setup.ts`, `global-setup.ts`, factory; `TEST_DATABASE_URL` phải trỏ cổng 5443), `C0-9` chữ ký lời gọi mười `T` với thân `it.todo`.
  evidence: Tách khỏi Cục 0 ở bước 4 của bmad-build vì trượt chuẩn đơn-mục-tiêu — nhóm này nghiệm thu bằng `npm test` chạy tới nơi, còn nhóm giữ lại nghiệm thu bằng `tsc --noEmit` sạch; hai cổng khác nhau, review và merge riêng được. `C0-9` đi theo nhóm này chứ không đứng riêng: viết `tests/T*.test.ts` khi chưa có `tests/setup.ts` làm `npm test` đỏ vì cấu hình chứ không vì mã. Chín việc gộp một spec cũng vượt xa trần 1600 token của chuẩn phạm vi (ước ~4000).

- source_spec: `_bmad-output/implementation-artifacts/spec-c0-frozen-contracts.md`
  summary: Mười bốn khoảng trống hình dạng kiểu mà bước 4 tìm ra, không sửa được bằng một dòng — mỗi cái cần một quyết định thiết kế.
  evidence: |
    Đã tự kiểm, đều thật, xếp `defer` vì sửa đúng cách là đổi hình dạng kiểu chứ không phải sửa chữ:
    · `ActionState` không có nhánh *chưa chạy*; `IDLE = {ok:true}` trùng hệt *vừa lưu xong*.
    · `GateDecision.boundary` khai `?:` trong khi `reason:"boundary"` bắt buộc phải kèm mã — nên
      `{allowed:false, reason:"boundary"}` trơ là trạng thái khai được; và `ActionState.code` không
      mang `BoundaryCode` nên `AD-UI-7` không dựng nổi chữ hiển thị.
    · `NFR-14`…`NFR-19` nằm trong CẢ `BusinessRuleCode` lẫn `BOUNDARY_CODES`; `ActionState.code` hợp
      nhất hai họ — đúng thứ đầu `errors.ts` cấm trộn.
    · `DecideInput` khai được ba trạng thái bất khả (`bo` không lý do; `duyet` có `dropReason`;
      `bo` kèm `editedValue`). Cần union phân biệt theo `outcome`.
    · `collectGateContext(actor, seedMode)` không có tay nắm tìm hàng `ScanLog` đang chạy, và với
      thao tác người bấm thì KHÔNG có lượt quét nào — vẫn phải trả bốn số. `budgetUsedRatio` nhận
      `NaN` khi ngân sách bằng 0, và `NaN >= stop` là `false`: phanh không bao giờ chạm.
    · `createRegistry` không nhận `entries` — không điểm nạp, nên `defineCap` không phải đường bắt
      buộc và một object literal đi vòng được. `CapName = string` chưa thu hẹp.
    · `RegistryEntry` không buộc `snapshot`/`writesTables`/`settingKeys` theo `kind`; tách
      `ReadEntry`/`WriteEntry` mới giữ được `AD-CP-9`/`AD-CP-10`.
    · `updateCompany` chỉ với tới 4/8 `TargetField` — duyệt Gợi ý cho `revenue_range` không có đường ghi.
    · `createSuggestion` không chứa được loại *thêm tin mới* (`targetField = null`, nội dung ở `timeline_text`).
    · `amount` không đi kèm `currency`; `BR-D9` đòi một đơn vị tiền và cột `currency` tồn tại.
    · `fillNextActionIfUnchanged` chỉ so `expectedContent`, không so `dueDate` — người sửa mỗi hạn vẫn bị đè.
    · `CHECK signal_subtype_only_other` không lên tới kiểu ở cả `agent/types.ts` lẫn `core/signal`.
    · Luật lint `AD-GT-4` là DANH SÁCH CHẶN sáu mẫu, đúng thứ chú thích ngay trên nó cấm — `node:fs`
      hay bất kỳ gói bare nào vẫn nhập giá trị vào `src/autonomy` không cảnh báo.
    · `lossReasons: readonly string[]` trong khi `D27` nói enum dạng mảng; CSDL là `TEXT[]`, nên
      khai union đóng ở lõi là lớp canh duy nhất có thể có.

- source_spec: `src/capability/caps/account.ts`
  summary: ✅ ĐÃ ĐÓNG 14/8 — tách làm hai capability, xem `tests/unit/d43-reopen.test.ts`. (Ghi chép cũ giữ lại vì lý do tách vẫn là thứ đáng đọc.) `D43` — *mở lại Cơ hội đã đóng chỉ vai Quản trị* hiện CHƯA được cưỡng chế ở đâu.
  evidence: |
    `resumeOrReopenOpportunity` phục vụ HAI đường qua cùng một capability: `tam_dung` → đang chạy
    (Sales làm được, §6) và `thang`/`thua` → đang chạy (chỉ Quản trị, `D43`/`A5`). Khai
    `allowedRoles: ["admin"]` chặn oan Sales trên đường thứ nhất; khai rỗng thì `D43` hở.
    Phân biệt hai đường cần TRẠNG THÁI HIỆN TẠI của Cơ hội, mà Cổng cố ý không đọc dữ liệu
    (`AD-GT-1` — sáu trường, toàn là sự kiện, không có tra cứu bản ghi).
    `AD-CR-10` lại cấm lõi tự canh vai. Nên chỗ đúng là **tách làm hai capability**:
    `resumeFromPause` (`allowedRoles: []`) và `reopenClosedOpportunity`
    (`allowedRoles: ["admin"]`), mỗi cái tự kiểm trạng thái đầu vào ở lõi bằng `canResume` cộng
    `isClosed`. Rủi ro nghiệm thu: PRD §5.2 ghi **không** — không điểm `T` nào kiểm việc mở lại
    Cơ hội đã đóng.

- source_spec: `_bmad-output/implementation-artifacts/spec-c1-13-vong-quet-chay-that.md`
  summary: Vòng quét đã chạy thật đầu-cuối trên CSDL demo 5442 và bị chặn bởi BỐN lỗ ở tầng ④/⑤ — không lỗ nào nằm trong `src/scan`, `src/ingest`, `src/core/scanlog.ts` hay `src/capability/caps/scan.ts`.
  evidence: |
    Đo ngày 14/08 bằng ba lượt chạy thật trên CSDL demo, mỗi lỗ có bằng chứng lấy từ nhật ký
    hoặc từ chính bảng dữ liệu. Xếp theo thứ tự chặn.

    ① `readArticle` LỆCH HỢP ĐỒNG — chặn cứng, và là chỗ vòng quét đang chết.
       `src/capability/caps/read-shared.ts:47` khai `params: z.object({ id: z.uuid() })` và gọi
       `readArticle(p.id)` của `src/core/article.ts:24`, vốn trả MỘT Bản lưu theo id.
       Tầng ① gọi hai hình dạng khác hẳn: `src/scan/loop.ts` truyền
       `{ accountId, scope: "latest" }` và đợi `{ id, snapshotId, version, contentHash,
       normalizedText, readable, signalCount }` (`src/scan/_contract.ts:145`);
       `src/ingest/load-snapshots.ts:95` truyền `{ accountId, scope: "all" }` và đợi một MẢNG dấu vân.
       Bằng chứng nguyên văn từ lượt chạy:
         `[vòng quét] \`Tomahawk Systems\` · KHÔNG ĐỌC ĐƯỢC BẢN LƯU (FT10) — [{"expected":"string",
          "code":"invalid_type","path":["id"],"message":"Invalid input: expected string, received undefined"}]`
       Cả ba Công ty ăn `FT10`; ba lần liên tiếp trên cùng capability chạm
       `max_consecutive_denials = 3` nên vòng đóng với `loi_khong_phuc_hoi`. Vòng KHÔNG tiêu một
       lượt gọi mô hình nào. Hệ quả: `T-8` và `T-6` không có đường chạy.
       Sửa ở `read-shared.ts` cộng `core/article.ts`, không sửa được ở tầng ①.

    ② BA CAPABILITY HẠNG GHI VẮNG MẶT KHỎI SỔ ĐĂNG KÝ.
       `AD-2` khối một hạng ghi khai đúng sáu tên; sổ hiện chỉ có ba (`queueSuggestion`,
       `appendTimelineEntry`, `setNextAction`). Thiếu `createSignal`, `createArticle`, `disableAi`
       (và `enableAi` ở khối bốn). Structural Seed của spine tầng ④ đặt chúng ở
       `caps/signals.ts`, `caps/articles.ts`, `caps/admin.ts` — ba tệp chưa tồn tại.
       `src/capability/caps/scan.ts:20-24` đã ghi rõ chúng CỐ Ý không nằm ở tệp đó, và khai trùng
       vào đó làm khối ba thành bảy mục, tức `T-10b` khẳng định trên một phân hoạch sai.
       Hệ quả: kể cả khi ① được vá, `writeSignals` sẽ ăn `unknown_capability` cho mọi Phát hiện —
       0 hàng `signal`, 0 mục Dòng thời gian, và `T-8` đếm 0 thay vì 2. `src/ingest` cũng không
       nạp được Bản chụp nào vì `createArticle` không tồn tại.

    ③ `prisma/seed.ts` (`C5-17`) CHƯA GIEO PHẦN VÒNG QUÉT CẦN.
       130 dòng, chỉ dựng 3 Công ty. Không bật `watching`, không gieo `settings`, không gieo
       `snapshot`/`article`, không gieo Gợi ý đang chờ. Lượt này phải dựng tay bằng SQL trên CSDL
       demo: `watching = true` cho cả ba Công ty, và một `snapshot` + `article` cho mỗi Công ty.
       ⚠ Dữ liệu đó CÒN NGUYÊN trên 5442 để lượt sau dùng lại, nhưng `content_hash` của nó là
       `md5()` chứ không phải `contentFingerprint()` của `src/ingest/fingerprint.ts` — hai họ hash
       khác nhau. Khi `createArticle` lên, gieo lại bằng đường ingest thật, đừng tin ba hàng này.

    ④ GHI VẾT PHA 2 RỖNG TRÊN MỌI CAPABILITY ĐỌC — nhỏ, nêu ra để không ai tưởng là hỏng.
       `select capability, decision, outcome from audit_record` cho `listEnums`, `readAccountType`,
       `readAccountList`, `readSetting` đều có `decision = allow` nhưng `outcome` NULL. Đúng theo
       `AD-CP-2`/`AD-CR-7` (pha 2 là việc của lõi, và lượt đọc không mở giao dịch), nhưng nó làm
       `outcome IS NULL` mất khả năng phân biệt *"tiến trình chết giữa hai pha"*. Nếu có phép kiểm
       nào định dùng vị từ đó thì phải loại `kind = 'read'` ra trước.

    ⑤ RỦI RO CHƯA CHẠM, thuộc `src/ingest/fingerprint.ts` (tệp lượt này SỞ HỮU) — CỐ Ý KHÔNG SỬA.
       Tám mẫu volatile của `D18` khớp tiếng Việt CÓ DẤU (`cập nhật`, `lượt xem`, `phiên bản`).
       Bộ dữ liệu BTC phát sáng 15/08 (`R5`) nếu là tiếng Việt KHÔNG DẤU thì cả ba mẫu trượt, dấu
       vân đổi mỗi lượt đọc, và `T-8` đếm sáu thay vì hai — đúng hình dạng lỗi mà đầu tệp cảnh báo.
       Không nới mẫu ở lượt này vì cái giá của nới SAI nặng hơn: mẫu `nhan_cap_nhat_kem_gio` nuốt
       tới 40 ký tự sau chỗ khớp, nên một câu thân bài thật như *"cập nhật hệ thống ERP cũ"* viết
       không dấu sẽ bị nuốt — khi đó hai bài KHÁC NHAU cùng dấu vân, nội dung mới bị bỏ im lặng, và
       `T-8` đếm 0. Quyết khi đã NHÌN THẤY bộ dữ liệu thật, không quyết trước.

- source_spec: `_bmad-output/implementation-artifacts/spec-c1-13-vong-quet-chay-that.md`
  summary: Ba phát hiện của bốn lăng kính rà mà lượt này CỐ Ý không sửa — mỗi cái kèm lý do vì sao hoãn là quyết định đúng, không phải quên.
  evidence: |
    ① `FR-39` LUẬT MƯỜI VÒNG CHƯA HIỆN THỰC — chặn bởi `AD-2`, không chặn bởi giờ.
       `FR-39` đòi *"mỗi 10 vòng ghi thêm một dòng TỔNG HỢP cộng dồn"*. Cả hai mảnh đã có:
       `readScanRollup` ở `src/core/scanlog.ts:377` và `renderRollupLine` ở `src/scan/journal.ts:75`.
       Nhưng `grep` toàn `src/` cho thấy KHÔNG nơi nào gọi `renderRollupLine`, và không nối được ở
       lượt này: `src/scan` là tầng ① nên chỉ đi xuống qua `loadCapability()` (`AD-1`), mà sổ đăng
       ký của `AD-2` KHÔNG có tên nào đọc số tổng hợp. Nối nghĩa là thêm một capability thứ bảy vào
       khối ba — đúng thứ `T-10` khẳng định bằng vị từ, và `AD-2` gọi đích danh việc thêm tên là
       cách làm `T-10` đỏ. Cần một quyết định kiến trúc, không phải một dòng mã.

    ② MỖI CÔNG TY CHỈ GIỮ ĐƯỢC MỘT MÃ `FT` — cần sửa lược đồ, ngoài phạm vi.
       `src/scan/loop.ts` gán `failureCode` ba lần trên cùng một đường (`costUsd === null` → `FT10`,
       rồi `FAILURE_BY_KIND[result.kind]` ghi đè). Hai sự cố khác nhau trong một lượt thì mất một.
       Sửa đúng là đổi `scan_log_entry.failure_code` thành mảng, tức `prisma/schema.prisma` — tệp
       đóng băng của Cục 0 và ngoài phạm vi lượt này.

    ③ KHÔNG MỘT PHÉP KIỂM NÀO CHẠM `src/scan/loop.ts` HAY `journal.ts`.
       `grep -rl "runScanCycle\|renderCycleLine" tests/` trả rỗng; `tests/T8.test.ts` và
       `tests/T9.test.ts` toàn thân `it.todo`. Lượt này thêm một nhánh điều kiện mới vào
       `renderCycleLine` (trường ⑥ khi vòng không trọn) mà không có ca nào ghim nó, dù đó là hàm
       THUẦN trên chuỗi — rẻ nhất để cố định và đúng là thứ `T-8` đọc. `tests/**` do agent khác
       sở hữu ở lượt này nên không viết được; đây là món nợ có địa chỉ rõ, không phải một lời than.

- source_spec: `_bmad-output/implementation-artifacts/spec-c5-sau-ham-loi-va-hai-mon-no.md`
  summary: Sáu hàm lõi mới và hai khối hàm thuần (`BR-D6`, lịch ngày lễ JP) KHÔNG có phép kiểm hồi quy nào — `tests/**` ngoài quyền ghi của cục ⑤ và `npm test` bị cấm chạy trong lượt này.
  evidence: |
    Chưa tệp nào trong `tests/` nhập `softDeleteContact`, `softDeleteOpportunity`,
    `updateTimelineEntry`, `updateCompany`, `markSignalUnhelpful`, `deriveRelevance`,
    `checkRelevance` hay `computeDueDate`. `tests/T10A.test.ts` chỉ có ba `describe`
    (`NFR-14`, `NFR-15`, `NFR-17` trên `softDeleteCompany`) — **vế 4 `NFR-19` chưa tồn tại**,
    dù `C5-16` và `T-10a` liệt nó. Bốn phép kiểm gọi `createSignal` đều dùng
    `funding`/`leadership`/`expansion` với `relevance: "high"`, trùng đúng giá trị lõi suy ra,
    nên `checkRelevance` không đổi hàng nào và một lần đảo ngược nó vẫn xanh.
    Logic thuần đã kiểm bằng bản chép chạy ngoài repo (14 ca `BR-D6` + 9 ca lịch JP, tất cả
    xanh) — có bằng chứng, chưa có phép kiểm hồi quy.
    Cần: `tests/unit/relevance.test.ts`, `tests/unit/due-date.test.ts`, và vế 4 của `T10A`.

- source_spec: `_bmad-output/implementation-artifacts/spec-c5-sau-ham-loi-va-hai-mon-no.md`
  summary: `updateCompany` và `markSignalUnhelpful` chạy được nhưng KHÔNG có mục sổ đăng ký nào, nên không bề mặt nào gọi tới — `FR-42` vẫn chưa có nút bấm, và không lớp nào chặn máy.
  evidence: |
    Không tên nào trong hai tên đó xuất hiện ở `src/capability/caps/*.ts` hay `src/app/`.
    Hệ quả thứ hai nặng hơn: chú thích của `markSignalUnhelpful` viết *"chặn máy nằm ở
    `allowedActors` của mục sổ đăng ký"* (PRD §6 xếp nút này ❌ cho máy) — mục đó chưa tồn tại,
    nên hôm nay **không lớp nào chặn máy** gọi nó. Cùng hình dạng với `setPrimaryContact`.

- source_spec: `_bmad-output/implementation-artifacts/spec-c5-sau-ham-loi-va-hai-mon-no.md`
  summary: `searchAccountsCap` của `src/capability/caps/ui.ts` vẫn đọc thẳng `db` thay vì uỷ quyền cho `searchCompanies`, và ba chú thích còn khai `searchCompanies` là "chưa hiện thực".
  evidence: |
    `caps/ui.ts:22`, `src/scan/loop.ts:154` và `tests/T10B.test.ts:58` đều còn câu đó; `T10B`
    dùng nó làm lý do cho mục `KNOWN_DEBT`. Hệ quả đo được: `caps/ui.ts:196` viết
    `_count: { select: { contacts: true, opportunities: true } }` không có
    `where: { deletedAt: null }`, nên sau khi xoá mềm một Người liên hệ theo `D26`, danh sách
    hiện đúng mà con số ngay cạnh hiện sai — đúng lỗi mà `searchCompanies` đã vá. Hai bên còn
    lệch ngữ nghĩa: `ui.ts` tìm chữ trên `name` OR `industry` OR `country` và coi
    `watching: false` là *không lọc*; `searchCompanies` tìm mỗi `name` và coi `false` là một bộ
    lọc. Ba tệp này ngoài quyền ghi của cục ⑤.

- source_spec: `_bmad-output/implementation-artifacts/spec-c5-sau-ham-loi-va-hai-mon-no.md`
  summary: Mục 0 `0.1.1` và `enum AccountType` của `prisma/schema.prisma` khai HAI bộ mã khác nhau cho hai trong năm loại công ty.
  evidence: |
    Mục 0 §0.1.1 viết `tech_based` và `ito_other`; lược đồ viết `tech_startup` và `ito`.
    `AD-13` xếp Mục 0 **trên** lược đồ, nên chỗ sai là lược đồ. Hệ quả đã cài sẵn ở
    `searchCompanies`: giá trị ngoài từ vựng trả `[]`, nên bên gọi nào dùng chữ của Mục 0 sẽ
    nhận danh sách rỗng im lặng. `prisma/` là tệp đóng băng của Cục 0 — cần một lần mở lại,
    hoặc một dòng ở Mục 0.

- source_spec: `_bmad-output/implementation-artifacts/spec-c5-sau-ham-loi-va-hai-mon-no.md`
  summary: `AD-CR-2` của spine tầng ⑤ bảo "ghi nhật ký `F1`" cho `BR-D6`, nhưng `F1` của Mục 0 §0.5 là một thất bại khác hẳn.
  evidence: |
    `F1` ở Mục 0 là *"hai đường ghi trùng vào Dòng thời gian cho công ty Đang theo dõi"*, đã
    giải bằng `D16`/`D17`. `src/core/errors.ts` còn tự cảnh báo `F1`–`F40` (Mục 0) và
    `FT1`–`FT10` (spine) là hai không gian mã. `checkRelevance` vì thế trả cờ
    `outOfRange: boolean` chứ không trả mã — không tự đặt mã mới. Cần spine sửa, hoặc chỉ đích
    danh mã đúng.

- source_spec: `_bmad-output/implementation-artifacts/spec-c5-sau-ham-loi-va-hai-mon-no.md`
  summary: Cascade `D26` của `softDeleteCompany` vẫn thiếu Bản chụp, Bản lưu, Thông báo, và chưa chuyển Gợi ý còn chờ sang `dong_he_thong` + `cong_ty_da_xoa`.
  evidence: |
    `C5-1` liệt cascade đích danh bảy nhóm. Mã hôm nay chạm bốn: `opportunity`, `next_action`
    (vừa thêm trong lượt này), `contact`, `activity`. Một Gợi ý còn trạng thái `cho` sau khi
    Công ty đã xoá là vế hỏng nhìn thấy được ngay trên Hàng đợi gợi ý của `T-5`, và
    `SystemCloseReason.cong_ty_da_xoa` tồn tại trong lược đồ chính để phục vụ đường đó. Không
    làm trong lượt này vì nó chạm bất biến đếm của `autoAcceptRate` (Gợi ý đóng theo đường hệ
    thống KHÔNG vào mẫu số) — cần một lần sửa có phép kiểm đi kèm.

- source_spec: `_bmad-output/implementation-artifacts/spec-c5-sau-ham-loi-va-hai-mon-no.md`
  summary: `updateCompany` không kiểm `name` rỗng và `foundedYear` phi lý, trong khi `applyToAccount` của đường Gợi ý có kiểm — hai đường ghi vào cùng tám cột với hai bộ kiểm khác nhau.
  evidence: |
    `applyToAccount` bác `founded_year` không phải số nguyên và kiểm `account_type` theo năm giá
    trị enum. `updateCompany` không kiểm gì, nên `foundedYear: -5` hoặc `name: ""` đi thẳng vào
    cột `NOT NULL`. Không sửa được trong lượt này vì `errors.ts` là từ vựng ĐÓNG và không có mã
    nào cho *"tên rỗng"* hay *"năm thành lập phi lý"* — bịa mã là đúng thứ `AD-CR-3` cấm. Cần
    một mã ở thượng nguồn, hoặc một lớp Zod dùng chung ở tầng ④.

- source_spec: `_bmad-output/implementation-artifacts/spec-t-nghiem-thu-than-t1-t5-t7-t3.md`
  summary: `BR-B2` có HAI cài đặt trả ngược nhau — `needsQualificationFlag` của lõi và `toOpportunityCard` của tầng ④ — và bản của lõi không có bên gọi nào trong sản phẩm.
  evidence: |
    `src/core/opportunity/index.ts` treo cờ khi một ô là `null`, dải giai đoạn dừng ở
    `thuong_luong`. `src/capability/caps/ui.ts` treo cờ khi một ô `!== true`, dải gồm cả
    `thang`/`thua`. Người trả lời *không* (`false`) thì lõi nói *hết cờ*, màn hình nói *còn cờ*,
    và không có cách nào tắt — đúng thứ chú thích của lõi nói nó tồn tại để tránh. Trên Cơ hội đã
    đóng thì ngược lại. `grep needsQualificationFlag src/` trả về đúng một định nghĩa và không
    một bên gọi nào. `T-1` cố ý chỉ chạy hai đầu vào mà hai bên đồng ý; ràng cứng ca lệch ở đó là
    làm điểm nghiệm thu đỏ vì một mâu thuẫn thượng nguồn chưa ai xử.

- source_spec: `_bmad-output/implementation-artifacts/spec-t-nghiem-thu-than-t1-t5-t7-t3.md`
  summary: `createSignal` lưu `quote` thô nhưng lưu offset của `normalize(quote)`, nên hai thứ lệch nhau khi mô hình trả câu trích chưa chuẩn hoá.
  evidence: |
    `findQuote(normalizedText, quote)` chuẩn hoá câu trích rồi mới tìm, và trả chỉ số của bản đã
    chuẩn hoá; `t.signal.create` thì ghi `quote: input.quote` nguyên trạng. Với một câu trích có
    dấu cách kép hay CRLF, `normalizedText.slice(quote_start, quote_end) !== signal.quote` — tức
    `S10` tô sáng một đoạn khác với chữ nó hiển thị, đúng thứ `T-3` phải chứng minh là không xảy
    ra. `T-3` hôm nay xanh vì bộ dữ liệu dùng câu trích đã chuẩn hoá sẵn. Sửa: lưu
    `normalize(quote)` vào cột, hoặc lưu cả hai dạng.

- source_spec: `_bmad-output/implementation-artifacts/spec-t-nghiem-thu-than-t1-t5-t7-t3.md`
  summary: Ba nhánh no-op của `undoSystemNextAction` chưa có phép kiểm — hết cửa sổ 7 ngày, ô đã bị người sửa tay, và nhánh ⓒ của `AD-3` vốn không mở cửa sổ Hoàn tác.
  evidence: |
    `T-7` phủ đúng một nhánh: bấm lần hai. Gỡ vế `undo_deadline_at > now()` khỏi cả `findFirst`
    lẫn `updateMany` thì Hoàn tác chạy vĩnh viễn, quá `D14`, mà không phép kiểm nào đỏ. Gỡ
    `set_by: "he_thong"` khỏi `updateMany` thì Hoàn tác xoá được thứ người vừa gõ. `D36` xếp ca
    biên vào lớp kiểm DƯỚI, không trộn vào `T-n`, nên chỗ đúng là một tệp `tests/unit/`.

- source_spec: `_bmad-output/implementation-artifacts/spec-t-nghiem-thu-than-t1-t5-t7-t3.md`
  summary: `T2`, `T10A`, `T10B` vẫn tự dựng bốn khối mà `tests/_helpers.ts` đã đóng gói, nên `C0-8` đang có hai nguồn.
  evidence: |
    Ba tệp tự gọi `createAuditSink({seedMode:true, keepAudit:false})`, tự `db.user.create`, tự
    dựng Bản chụp/Bản lưu và tự `createRegistry`. Không gộp trong lượt này vì cả ba đang xanh và
    thuộc cục ⑤/④; gộp là sửa tệp của cục khác giữa lúc họ đang chạy. Bản ở `T2` sẽ trôi khỏi bản
    ở `_helpers.ts` mà không lint nào bắt.

- source_spec: `_bmad-output/implementation-artifacts/spec-t-nghiem-thu-than-t1-t5-t7-t3.md`
  summary: Bốn mã thượng nguồn đang lệch với mã đang chạy — nêu ra, chưa sửa vì chúng nằm ngoài `tests/**`.
  evidence: |
    ① `epics.md` `C5-10` nói offset câu trích tính trên *văn bản gốc*; `AD-18`, chú thích cột
    `signal.quote_start` và mã đều nói *bản chuẩn hoá*.
    ② Spine tầng ⑤ `AD-CR-8` khai `outcome` bốn giá trị `applied · rule_rejected ·
    no_row_affected · denied`; `src/core/audit.ts` và cột `outcome` dùng `ok · business_rule_error
    · no_op · crashed`.
    ③ `AD-2`/`AD-3` chỉ liệt `setNextAction` cho chạm ghi thứ hai của máy; sổ đăng ký có CẢ
    `setNextAction` lẫn `fillNextActionIfUnchanged`.
    ④ `epics.md` `C5-15` gán câu *"ghi vết cho cả lần tự đặt lẫn lần hoàn tác"* cho `D14`; câu đó
    là nguyên văn `T-7` của đề bài, và mã yêu cầu là `FR-33`.
