# Ranh giới AI / người — vòng 2, digest 1

Chủ đề: token màu AI của Microsoft Copilot UI kit, hướng dẫn PAIR về độ tin cậy, HAX khi AI sai, tranh luận "màu tím = AI".
Ngày chạy: 2026-08-14. Ngân sách: 13 lần gọi công cụ, 10 nguồn thật sự đọc.

---

## 1. Lớp token Copilot (lớp: token-copilot)

### Microsoft phát hành một gói token riêng biệt `@fluentui-copilot/tokens`, tách khỏi `@fluentui/tokens` của Fluent 2 lõi; phiên bản mới nhất là 0.3.15
- nguồn: https://registry.npmjs.org/@fluentui-copilot/tokens
- nhà xuất bản: npm registry (Microsoft)
- ngày xuất bản: không rõ (trường `time` bị cắt trong lần đọc; chỉ lấy được `dist-tags.latest`)
- truy cập: 2026-08-14
- độ tin: cao
- lớp: token-copilot

### Gói suite `@fluentui-copilot/react-copilot@0.30.5` phụ thuộc vào 22 gói con, trong đó có `@fluentui-copilot/tokens`, `react-flair`, `react-sensitivity-label`, `react-reference`, `react-feedback-buttons`, `react-latency`, `react-output-card`, `react-prompt-starter`, `react-first-run-experience`
- nguồn: https://registry.npmjs.org/@fluentui-copilot/react-copilot
- nhà xuất bản: npm registry (Microsoft). Mô tả gói: "Suite package containing fluentai copilot react components."
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: cao
- lớp: token-copilot

### Copilot UI kit định nghĩa một họ token màu riêng cho AI mà Fluent 2 lõi không có: `colorBrandFlair1/2/3`, biến `...Transparent`, `colorBrandMorseCode1–9`, `colorHCFlair1/2/3`, `colorHCMorseCode1–9`, và `shadowFlair1/2/3`
- nguồn: https://unpkg.com/@fluentui-copilot/tokens@latest/dist/index.d.ts
- nhà xuất bản: Microsoft (khai báo TypeScript của chính gói)
- ngày xuất bản: không rõ (thuộc 0.3.15)
- truy cập: 2026-08-14
- độ tin: cao
- lớp: token-copilot

### Giá trị thật của bộ token "Flair" ở theme sáng là ba màu chốt của một dải chuyển, KHÔNG phải một chuỗi `linear-gradient()` đóng gói sẵn
Đã đọc trọn `copilotLightThemeExtension.js`. Giá trị verbatim:
- `colorBrandFlair1`: `rgba(24, 90, 189, 1)` — xanh dương đậm (#185ABD)
- `colorBrandFlair2`: `rgba(71, 207, 250, 1)` — xanh cyan (#47CFFA)
- `colorBrandFlair3`: `rgba(180, 124, 248, 1)` — **tím** (#B47CF8)
- `colorBrandFlair1Transparent` / `2` / `3`: cùng ba màu trên với alpha = 0 (dùng làm điểm dừng trong suốt khi tự dựng gradient)
- `colorBrandMorseCode1–9`: `#ad5ae1`, `#e9618d`, `#fd9e5f`, `#0e94e1`, `#57ab82`, `#c6c225`, `#669fc2`, `#6377e0`, `#9b80ec`
- `colorHCFlair1/2/3`: `Highlight`, `HighlightText`, `Highlight` (từ khoá hệ thống, chế độ tương phản cao)
- `colorHCMorseCode1–9`: tất cả `CanvasText`
- `shadowFlair1`: `0 10px 12px 0 rgba(0, 30, 68, 0.04), 0 2px 8px 0 rgba(0, 30, 68, 0.06)`
- `shadowFlair2`: `0 12px 14px 0 rgba(0, 30, 68, 0.05), 0 6px 8px 0 rgba(0, 30, 68, 0.04), 0 1px 4px 0 rgba(0, 30, 68, 0.06)`
- `shadowFlair3`: `0 20px 16px 0 rgba(0, 30, 68, 0.05), 0 10px 12px 0 rgba(0, 30, 68, 0.04), 0 2px 8px 0 rgba(0, 30, 68, 0.06)`
- Gói còn mở rộng thang hình học/khoảng cách riêng: `borderRadius2XL` 12px, `3XL` 16px, `4XL` 24px, `5XL` 40px; `spacingVertical4XL`/`5XL` 40/48px; `fontSizeBase450` 18px, `lineHeightHero850` 48px.
- nguồn: https://unpkg.com/@fluentui-copilot/tokens@0.3.15/lib/themeExtensions/copilotLightThemeExtension.js
- nhà xuất bản: Microsoft (mã nguồn phát hành)
- ngày xuất bản: không rõ (thuộc 0.3.15)
- truy cập: 2026-08-14
- độ tin: cao
- lớp: token-copilot

**Đọc thêm ba điều từ bằng chứng này:**
1. Có tồn tại token màu riêng cho AI, và **có tím** — nhưng tím chỉ là một trong ba điểm dừng, đi cùng xanh dương và cyan. Không phải "tím thuần".
2. Microsoft **không** phát hành gradient thành token. Họ phát hành các **điểm dừng** cộng với bản trong suốt của chúng, để consumer tự dựng `linear-gradient` theo hướng mình cần. Đây là một quyết định kiến trúc token đáng bắt chước.
3. Có đường thoát tương phản cao: mọi token Flair/MorseCode đều có bản `colorHC*` ánh xạ về từ khoá hệ thống. Nghĩa là **màu không được phép là kênh mang thông tin duy nhất**.

### Copilot UI kit CÓ component chuyên để đánh dấu nội dung do AI sinh: `AiGeneratedDisclaimer`
Đọc `dist/index.d.ts` của gói suite (hơn 400 export). Nhóm liên quan trực tiếp đến ranh giới AI/người:
- Đánh dấu nguồn gốc AI: `AiGeneratedDisclaimer`, `aiGeneratedDisclaimerClassNames`, `AiGeneratedDisclaimerProps`, `AiGeneratedDisclaimerSlots`
- Trích dẫn / truy nguyên: `Citation`, `PackagedCitation`, `PackagedCitationV2`, `Reference`, `ReferenceV2`, `ReferenceList`, `ReferenceListV2`, `ReferenceOverflowButton`, `ReferenceCitationPreviewGenerator`, `generateReferenceCitationPreview`, `useReferenceCitationPreview`
- Phân loại độ nhạy dữ liệu: `SensitivityLabel`, `SensitivityIcon`, `SensitivityTooltip` (kèm các `*ClassNames`)
- Phản hồi của người dùng lên đầu ra AI: `FeedbackButtons`, `feedbackButtonsClassNames`, `FeedbackButtonsProps`, `FeedbackButtonsSlots`
- nguồn: https://unpkg.com/@fluentui-copilot/react-copilot@0.30.5/dist/index.d.ts
- nhà xuất bản: Microsoft (khai báo TypeScript của chính gói)
- ngày xuất bản: không rõ (thuộc 0.30.5)
- truy cập: 2026-08-14
- độ tin: cao
- lớp: token-copilot

**Phát biểu phủ định có kiểm chứng:** kit này giải bài toán đánh dấu ở **mức thông điệp hội thoại** (một khối trả lời của Copilot mang disclaimer + citation + feedback), chứ trong danh sách export **không thấy** component nào đánh dấu **một ô/ trường dữ liệu** là do AI điền. Đây là "đã đọc và không thấy trong danh sách export", không phải "đã chứng minh không tồn tại" — vẫn còn 400+ tên chưa soi hết từng cái.

---

## 2. Google PAIR — hiển thị độ tin cậy (lớp: do-tin-cay)

### PAIR cảnh báo rõ ràng chống lại việc hiển thị độ tin cậy bằng con số phần trăm
Trích verbatim: *"Numeric confidence indicators are risky because they presume your users have a good baseline understanding of probability."* Và: *"showing more granular confidence can be confusing if the impact isn't clear — what should I do when the system is 85.8% certain vs. 87% certain?"* Kèm rủi ro ngược: *"A misleadingly high confidence, for example, may cause users to blindly accept a result."*
- nguồn: https://pair.withgoogle.com/chapter/explainability-trust/
- nhà xuất bản: Google PAIR (People + AI Guidebook)
- ngày xuất bản: không rõ (guidebook không ghi ngày trên trang chương; bản gốc 2019, có cập nhật)
- truy cập: 2026-08-14
- độ tin: cao (tài liệu chính chủ) — nhưng **độ mới thấp**, cần khai rõ khi trích
- lớp: do-tin-cay

### PAIR coi việc hiển thị độ tin cậy là quyết định phải kiểm chứng bằng thử nghiệm, không phải mặc định; nếu không cải thiện được quyết định của người dùng thì bỏ hẳn
Trích verbatim: *"Be sure to set aside lots of time to test if showing model confidence is beneficial for your users and your product or feature."*
- nguồn: https://pair.withgoogle.com/chapter/explainability-trust/
- nhà xuất bản: Google PAIR
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: cao
- lớp: do-tin-cay

### Phát biểu phủ định: chương Explainability + Trust của PAIR KHÔNG bàn về việc phân biệt nội dung máy sinh với nội dung người nhập
Đã đọc chương và hỏi trực tiếp câu này. Chương tập trung vào giải thích cách mô hình ra quyết định và cách trình bày độ tin cậy, không đề cập việc gắn nhãn nguồn gốc nội dung.
- nguồn: https://pair.withgoogle.com/chapter/explainability-trust/
- nhà xuất bản: Google PAIR
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: vừa (kết luận phủ định rút từ một lần đọc một chương; các chương khác chưa đọc)
- lớp: do-tin-cay

### PAIR: khi AI không đủ tự tin, thay vì báo lỗi hãy giải thích lý do và đưa lối đi tiếp
Trích verbatim: *"Explain why a certain result couldn't be given and provide alternative paths forward. For example, 'There's not enough data to predict prices for flights to Paris next year. Try checking again in a month'."* Thông điệp lỗi nên *"tell the user what inputs the AI needs or how the AI works"*.
- nguồn: https://pair.withgoogle.com/chapter/errors-failing/
- nhà xuất bản: Google PAIR
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: cao
- lớp: cho-duyet

### PAIR: phải cho người dùng sửa dữ liệu/nhãn, và nếu người dùng liên tục từ chối đầu ra AI thì chủ động hỏi phản hồi
Trích verbatim: *"Allow users to give guidance or correct the data or label, which feeds back into the model to improve the dataset or alert the team to the need for additional training data."* và *"ask the user for feedback if they repeatedly reject AI outputs."*
PAIR phân bốn loại lỗi: prediction & training data errors; input errors; relevance errors; system hierarchy errors. Nguyên tắc lõi: *"The trick isn't to avoid failure, but to find it and make it just as user-centered as the rest of your product."*
- nguồn: https://pair.withgoogle.com/chapter/errors-failing/
- nhà xuất bản: Google PAIR
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: cao
- lớp: cho-duyet

---

## 3. Microsoft HAX Toolkit (lớp: cho-duyet)

### HAX Design Library có tổ chức pattern theo guideline; G8 là "Support efficient dismissal — Make it easy to dismiss or ignore undesired AI system services"
- nguồn: https://www.microsoft.com/en-us/haxtoolkit/library/guideline/10/ và https://www.microsoft.com/en-us/haxtoolkit/library/
- nhà xuất bản: Microsoft (HAX Toolkit)
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: vừa
- lớp: cho-duyet

**Không đạt mục tiêu.** Trang library render danh sách pattern bằng JavaScript; hai lần fetch đều chỉ lấy được khung lọc và văn bản guideline, **không lấy được tên pattern cụ thể**. Đánh số cũng không khớp: URL `/guideline/10/` trả về G8, nên ánh xạ số thứ tự ↔ đường dẫn cần kiểm lại. Đây là **"không tìm thấy"**, không phải "đã đọc và không có".

---

## 4. Tranh luận "màu tím = AI" (lớp: mau-tim)

### Có phản đối thật, và lời giải thích phổ biến nhất là nguyên nhân kỹ thuật chứ không phải thẩm mỹ: mặc định `bg-indigo-500` của Tailwind UI thống trị dữ liệu huấn luyện
Theo tổng hợp kết quả tìm kiếm, tác giả Tailwind CSS Adam Wathan được dẫn lời nói đùa rằng ông muốn "formally apologize for making every button in Tailwind UI bg-indigo-500 five years ago, leading to every AI generated UI on earth also being indigo."
- nguồn: kết quả WebSearch tổng hợp từ nhiều blog (youware.com, prg.sh, braingrid.ai, dev.to, medium.com/@kai.ni)
- nhà xuất bản: nhiều blog nhỏ, **chưa lần ra được nguồn gốc câu trích của Wathan**
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: **thấp** — câu trích chưa truy được về bài đăng gốc của Wathan; các blog trên phần lớn chép lại cùng một luận điểm
- lớp: mau-tim

### UX Collective (Fabricio Teixeira) coi "purple gradients everywhere" là một trong các cách AI đang phụ lòng người dùng, dẫn tới bài "Purple gradients everywhere: the way we're designing AI"
- nguồn: https://uxdesign.cc/form-factor-trap-purple-gradients-everywhere-how-ai-is-failing-users-4ccbb2761b8a
- nhà xuất bản: UX Collective
- ngày xuất bản: 2024-06
- truy cập: 2026-08-14
- độ tin: vừa (nhà xuất bản uy tín, nhưng đây là bản tin tổng hợp; lập luận thật nằm ở bài được dẫn mà tôi chưa mở được) — **cũ hơn 12 tháng, đã khai rõ ngày**
- lớp: mau-tim

**Đánh giá tỉnh táo:** phản đối là có thật nhưng gần như toàn bộ nằm ở tầng blog/bản tin, chưa thấy nghiên cứu hay tài liệu chính chủ nào. Đối chiếu với bằng chứng ở mục 1: Microsoft **không** dùng tím thuần — họ dùng dải xanh dương → cyan → tím, và tím chỉ là điểm dừng thứ ba.

---

## Manh mối đáng đuổi tiếp

1. **`@fluentui-copilot/react-flair`** — tên gói cho thấy đây là nơi ba token Flair biến thành hiệu ứng thật. Đọc `lib/` của gói này sẽ lộ ra **hướng và cách dựng gradient** mà Microsoft thực sự dùng, thứ mà lớp token cố tình không đóng gói.
2. **`copilotDarkThemeExtension.js`** cùng thư mục — so hai bản sáng/tối sẽ biết ba màu Flair có đổi theo theme không, hay giữ nguyên.
3. **`@fluentui-copilot/react-latency`** — gói riêng cho trạng thái chờ của AI. Nếu dự án cần ngôn ngữ hình ảnh cho "đang nghĩ", đây là nguồn chính chủ.
4. **`AiGeneratedDisclaimer`** — cần đọc `.d.ts` của riêng gói con để biết nó nhận slot gì, đặt ở đâu trong khối trả lời, có bắt buộc không.
5. **`SensitivityLabel` + `Citation`/`Reference`** — bộ ba disclaimer/citation/sensitivity là mô hình "truy nguyên" ba tầng của Microsoft, đáng dựng lại thành pattern.
6. **HAX pattern cụ thể** — cần trình duyệt thật (claude-in-chrome) vì trang render bằng JS. Cũng nên đọc bài gốc "Guidelines for Human-AI Interaction" (Amershi et al., CHI 2019) để có G1–G18 đầy đủ, thay vì đi qua trang library.
7. **Bài gốc "Purple gradients everywhere"** của tác giả tên Allen trên UX Collective — đó mới là lập luận thật, bản tin chỉ dẫn lại.
8. **Trường `time` trong metadata npm** — chưa lấy được ngày phát hành nên chưa khẳng định được độ mới của hai gói. Có thể lấy qua `npm view @fluentui-copilot/tokens time.modified` nếu máy có mạng npm.

## Thứ tôi đã tìm mà không thấy

- **Tên pattern cụ thể trong HAX Design Library** cho tình huống AI sai (dismissal / correction). Hai lần fetch chỉ trả về khung lọc — trang phụ thuộc JavaScript. **Không tìm thấy**, chưa phải phủ định.
- **Chuỗi `linear-gradient()` đóng gói sẵn trong token Copilot.** Đã đọc trọn `copilotLightThemeExtension.js` và toàn bộ export trong `dist/index.d.ts` của gói tokens: **đã đọc và không có**. Microsoft chỉ phát hành điểm dừng màu.
- **File nào có tên chứa "flair" hay "gradient" trong gói `@fluentui-copilot/tokens`.** Đã liệt kê toàn bộ cây tệp qua `?meta`: **đã đọc và không có**. Token Flair nằm trong `themeExtensions/`, không có file riêng.
- **Component đánh dấu một trường/ô dữ liệu là do AI điền** (khác với đánh dấu cả khối trả lời hội thoại). Đã quét danh sách export của gói suite: không thấy. Độ tin vừa — danh sách 400+ tên chỉ được lọc theo từ khoá, chưa soi từng cái.
- **Hướng dẫn của PAIR về phân biệt nội dung máy sinh / người nhập.** Không có trong chương Explainability + Trust. Chưa đọc các chương khác (Mental Models, Feedback + Control), có thể nằm ở đó.
- **Giá trị token ở theme tối và theme grey.** Biết file tồn tại, chưa mở — hết ngân sách.
- **Ngày phát hành của cả hai gói npm.** Trường `time` bị cắt ở cả hai lần đọc metadata.
