# Digest R1-1 — Ranh giới thị giác giữa nội dung AI và nội dung người

Chiều nghiên cứu: nội dung do AI sinh được đánh dấu bằng cơ chế thị giác gì trong phần mềm
doanh nghiệp hiện đại, và cơ chế đó ồn ào tới đâu.

Ngày chạy: 2026-08-14 · Ngân sách: 14 lần gọi công cụ (đã dùng hết), 8 nguồn đọc thật.

---

## Lớp: co-che-danh-dau

### Airtable không mô tả bất kỳ cơ chế thị giác nào (icon, nền màu, viền) để phân biệt ô do AI sinh với ô người nhập trong tài liệu chính thức về AI field; thứ duy nhất tài liệu nêu là các phần tử điều khiển trong ô — nút "Run agent" và một icon hai mũi tên để chạy lại
- nguồn: https://support.airtable.com/articles/8052242094-using-airtable-ai-in-fields
- nhà xuất bản: Airtable (Help Center, tài liệu chính thức)
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: cao (về việc *tài liệu nói gì*); thấp (nếu suy ra rằng giao diện thật không có dấu hiệu thị giác — tài liệu im lặng, không phủ định)
- lớp: co-che-danh-dau

### Airtable có một trạng thái vòng đời tên là "Generating" cho ô AI field (tài liệu nhắc tới ô "bị kẹt ở trạng thái Generating"), nhưng không mô tả hình dạng thị giác của trạng thái đó
- nguồn: https://support.airtable.com/articles/8052242094-using-airtable-ai-in-fields
- nhà xuất bản: Airtable
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: cao
- lớp: co-che-danh-dau

### Airtable phân biệt nguồn gốc nội dung ở tầng **dữ liệu**, không phải ở tầng thị giác: hệ thống theo dõi ô nào đã bị người sửa và cam kết "sẽ không bao giờ tự động ghi đè bất kỳ ô nào đã được người chỉnh sửa"
- nguồn: https://support.airtable.com/articles/8052242094-using-airtable-ai-in-fields
- nhà xuất bản: Airtable
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: cao
- lớp: co-che-danh-dau
- ghi chú: đây là phát hiện đáng giá nhất về Airtable — ranh giới AI/người ở đó là **quy tắc ghi đè**, không phải một dải màu.

### Icon sparkle (✨) là mẫu thị giác phổ biến nhất hiện dùng để chỉ tính năng AI trong UI, xuất hiện từ phần mềm soạn thảo văn bản tới công cụ UX tới ứng dụng mua sắm di động
- nguồn: https://www.nngroup.com/articles/ai-sparkles-icon-problem/
- nhà xuất bản: Nielsen Norman Group
- ngày xuất bản: không rõ (bài dẫn số liệu khảo sát tháng 9/2024)
- truy cập: 2026-08-14
- độ tin: vừa (đọc qua bản tóm tắt kết quả tìm kiếm, chưa fetch toàn văn)
- lớp: co-che-danh-dau

### Sparkle thất bại về mặt định danh: khảo sát tháng 9/2024 cho thấy **17%** người dùng hiểu icon sparkle là "đánh dấu/lưu mục này", vì sparkle trông giống ngôi sao — mà **73%** liên hệ ngôi sao với việc lưu/đánh dấu
- nguồn: https://www.nngroup.com/articles/ai-sparkles-icon-problem/
- nhà xuất bản: Nielsen Norman Group
- ngày xuất bản: khảo sát 2024-09; ngày bài không rõ (>12 tháng — khai rõ)
- truy cập: 2026-08-14
- độ tin: vừa
- lớp: co-che-danh-dau

### Sparkle còn bị dùng lẫn cho những thứ hoàn toàn không phải AI — hiệu ứng hình ảnh, khuyến mãi/phần thưởng, quảng cáo cá nhân hóa, nội dung mới — nên nó không mang nghĩa chuẩn hóa
- nguồn: https://www.nngroup.com/articles/ai-sparkles-icon-problem/ ; https://css-tricks.com/the-proliferation-and-problem-of-the-sparkles-icon/
- nhà xuất bản: Nielsen Norman Group; CSS-Tricks
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: vừa
- lớp: co-che-danh-dau

### Có phản đối rõ ràng với quy ước sparkle trên hai trục: (a) nó là chiêu tiếp thị làm một thứ tầm thường trông "đặc biệt"; (b) việc gói LLM thành thứ "kỳ diệu" là mờ ám và phục vụ diễn ngôn mà Big Tech muốn
- nguồn: https://css-tricks.com/the-proliferation-and-problem-of-the-sparkles-icon/ ; https://slate.com/technology/2025/12/artificial-intelligence-tools-icon-google-gemini-chatgpt-design.html
- nhà xuất bản: CSS-Tricks; Slate
- ngày xuất bản: Slate 2025-12; CSS-Tricks không rõ
- truy cập: 2026-08-14
- độ tin: vừa (bình luận cộng đồng/báo chí, không phải nghiên cứu)
- lớp: co-che-danh-dau

---

## Lớp: mau-ai

### Microsoft có gói component chính thức riêng cho giao diện Copilot, tách khỏi Fluent UI lõi: `@fluentui-copilot/react-copilot` (và `@fluentai/react-copilot`), khai báo peer dependency tới Fluent UI v9
- nguồn: https://www.npmjs.com/package/@fluentui-copilot/react-copilot ; https://www.npmjs.com/package/@fluentai/react-copilot
- nhà xuất bản: npm (registry), gói do Microsoft phát hành
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: vừa (biết gói tồn tại qua kết quả tìm kiếm; **fetch trang npm trả HTTP 403**, chưa đọc được danh sách export hay token)
- lớp: mau-ai
- ghi chú: đây là bằng chứng mạnh nhất tìm được cho giả thuyết "Microsoft có hệ thị giác AI riêng, không chỉ tô lại Fluent". Nhưng chưa mở được.

### Microsoft phát hành **Copilot UI kit** riêng, mở rộng Fluent 2 Core UI kit để phục vụ trải nghiệm AI, trên web / iOS / Android; Figma variables nay hỗ trợ tài sản styling cho cả Fluent lẫn Copilot
- nguồn: https://fluent2.microsoft.design/get-started/design
- nhà xuất bản: Microsoft (Fluent 2 Design System, tài liệu chính thức)
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: vừa (đọc qua tóm tắt kết quả tìm kiếm, chưa fetch toàn văn trang)
- lớp: mau-ai

### Fluent 2 dùng kiến trúc token hai tầng: **global token** giữ giá trị thô (mã hex, typography, bo góc, độ dày nét, animation) và **alias token** gắn nghĩa ngữ nghĩa lên giá trị đó. Quy ước đặt tên: `Global.Color.Blue.60` → `colorBlue60` trong mã
- nguồn: https://fluent2.microsoft.design/design-tokens ; https://microsoft.github.io/fluentui-token-pipeline/naming.html
- nhà xuất bản: Microsoft
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: vừa
- lớp: mau-ai

### KHÔNG xác nhận được token `colorBrandGradient` hay bất kỳ token gradient-AI có tên cụ thể nào trong tài liệu Fluent 2 công khai
- nguồn: https://fluent2.microsoft.design/design-tokens ; https://fluent2.microsoft.design/color ; https://microsoft.github.io/fluentui-token-pipeline/naming.html
- nhà xuất bản: Microsoft
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: vừa (là phát biểu **phủ định qua tìm kiếm**, không phải đọc hết tài liệu — coi là "chưa tìm thấy", không phải "không tồn tại")
- lớp: mau-ai

### Các mã hex gradient Copilot lưu hành trên web đều đến từ nguồn thứ cấp và **mâu thuẫn nhau**: một bảng nêu `#0078d4 #5cb85c #f4d35e #8e44ad #6c757d #fafafa`, bảng khác nêu `#ee5091 #199fd7 #99bd3c #fc7942 #8a50d8`
- nguồn: https://colorswall.com/palette/557664 ; https://www.color-hex.com/color-palette/1068243
- nhà xuất bản: ColorsWall; Color-Hex (đều là site do người dùng đóng góp)
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: **thấp** — không phải nguồn Microsoft, hai bảng không khớp nhau; **không dùng làm cơ sở quyết định**
- lớp: mau-ai

### Logo Copilot là dải ruy-băng gấp thành vòng lục giác với chuyển sắc từ tông lạnh (xanh dương, tím) ở trên sang tông ấm (cam, đỏ cam) ở dưới, dùng chung phương pháp gradient với Microsoft 365, Bing và Azure
- nguồn: https://1000logos.net/copilot-logo/ ; https://www.designyourway.net/blog/copilot-logo/
- nhà xuất bản: 1000logos; DesignYourWay (blog thương hiệu)
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: thấp
- lớp: mau-ai
- ghi chú: đáng chú ý về mặt phản-giả-thuyết — gradient Copilot **không phải tím-xanh** như quy ước "AI purple" thường được nói tới, mà là dải nhiều màu chạy lạnh→ấm.

---

## Lớp: huong-dan-thiet-ke

### Microsoft có bộ hướng dẫn thiết kế AI công khai, có tên **HAX Toolkit** (Human-AI eXperience), gồm **18 guideline** dựa trên hơn 20 năm nghiên cứu, công bố lần đầu trong một bài CHI 2019
- nguồn: https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/ ; https://blogs.microsoft.com/ai-for-business/hax-toolkit/
- nhà xuất bản: Microsoft / Microsoft Research
- ngày xuất bản: guideline gốc 2019; toolkit công bố sau (>12 tháng — khai rõ)
- truy cập: 2026-08-14
- độ tin: cao
- lớp: huong-dan-thiet-ke

### HAX Toolkit có **Design Library** tổ chức mẫu thiết kế theo bốn thời điểm trong trải nghiệm: lúc tương tác đầu, trong khi tương tác, **khi hệ AI sai**, và theo thời gian
- nguồn: https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/
- nhà xuất bản: Microsoft
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: cao
- lớp: huong-dan-thiet-ke
- ghi chú: trục "khi hệ AI sai" là trục thiết kế mà một dải nền tối tràn ngang không giải quyết được.

### Guideline 11 của HAX là "Make clear why the system did what it did" — tức lời giải thích lý do, không phải chỉ nhãn nguồn gốc
- nguồn: https://www.microsoft.com/en-us/haxtoolkit/guideline/make-clear-why-the-system-did-what-it-did/
- nhà xuất bản: Microsoft
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: vừa (biết tiêu đề qua kết quả tìm kiếm, chưa fetch trang)
- lớp: huong-dan-thiet-ke

---

## Lớp: do-tin-cay

### HAX Guideline 2 ("Make clear how well the system can do what it can do") đặt mục tiêu kép: chống **over-trust** (automation bias) và chống **under-trust** (algorithm aversion). Nói cách khác, hiển thị độ tin cậy phục vụ cả hai chiều, không chỉ chiều cảnh báo
- nguồn: https://www.microsoft.com/en-us/haxtoolkit/guideline/make-clear-how-well-the-system-can-do-what-it-can-do/
- nhà xuất bản: Microsoft (HAX Toolkit, tài liệu chính thức)
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: cao (fetch trực tiếp)
- lớp: do-tin-cay

### HAX Guideline 2 liệt kê bốn mẫu cụ thể để truyền đạt độ tin cậy — 2A: khớp mức độ chính xác của diễn đạt UI với hiệu năng hệ thống **bằng ngôn ngữ** (ví dụ "I'm not sure but…"); 2B: **bằng con số**; 2C: **báo cáo thông tin hiệu năng hệ thống**; 2D: **cảnh báo khi hiệu năng thấp**
- nguồn: https://www.microsoft.com/en-us/haxtoolkit/guideline/make-clear-how-well-the-system-can-do-what-it-can-do/
- nhà xuất bản: Microsoft
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: cao
- lớp: do-tin-cay
- ghi chú: nguyên tắc trung tâm là **"match the level of precision in UI communication with the system performance"** — mức chính xác của cách nói phải khớp mức chính xác thật. Đây là lập luận trực tiếp chống lại việc in một con số phần trăm giả chính xác.

### HAX Guideline 2 nhắc tới **visual uncertainty highlighting** (tô sáng phần bất định về mặt thị giác), contrastive explanation và background explanation như các cách hiện thực hóa
- nguồn: https://www.microsoft.com/en-us/haxtoolkit/guideline/make-clear-how-well-the-system-can-do-what-it-can-do/
- nhà xuất bản: Microsoft
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: cao
- lớp: do-tin-cay
- ghi chú: "visual uncertainty highlighting" đánh dấu **phần nào trong nội dung** không chắc — chi tiết hơn hẳn việc nhuộm cả khối.

---

## Lớp: cho-duyet

### Mẫu chủ đạo cho "AI đề nghị, người quyết" là **ghost text**: gợi ý hiện ngay tại chỗ soạn thảo dưới dạng chữ xám nhạt, **cùng vị trí** với nội dung người sẽ gõ, chưa được cam kết vào tài liệu
- nguồn: https://code.visualstudio.com/docs/editing/ai-powered-suggestions
- nhà xuất bản: Microsoft (tài liệu VS Code chính thức)
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: vừa (đọc qua tóm tắt kết quả tìm kiếm; nội dung trùng khớp giữa nhiều nguồn độc lập)
- lớp: cho-duyet

### Ghost text có hợp đồng tương tác đối xứng và rẻ: **Tab** chấp nhận toàn bộ, **Ctrl+→** chấp nhận từng từ hoặc từng dòng, **Esc** hoặc chỉ cần gõ tiếp là bỏ
- nguồn: https://code.visualstudio.com/docs/editing/ai-powered-suggestions ; https://learn.microsoft.com/en-us/visualstudio/ide/visual-studio-github-copilot-extension
- nhà xuất bản: Microsoft
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: vừa
- lớp: cho-duyet
- ghi chú: điểm cần lưu — **chấp nhận từng phần** là một trạng thái riêng, không chỉ nhận/bỏ nhị phân.

### Nguyên tắc thiết kế của mẫu ghost text là **tốc độ đánh giá**: người dùng phải quyết được nhận / sửa / bỏ trong vòng khoảng một giây kể từ khi thấy gợi ý
- nguồn: https://gentext.ai/blog/en/ghost-text-autocomplete-academic-writing/
- nhà xuất bản: GenText (blog sản phẩm)
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: thấp (blog tiếp thị của một sản phẩm cạnh tranh)
- lớp: cho-duyet
- ghi chú: đây là ràng buộc ngân sách thị giác đáng nhớ — cơ chế đánh dấu nào bắt người dùng dừng lại đọc là đã đắt hơn ngưỡng này.

---

## Lớp: font-viet

### Kiểm trực tiếp Google Fonts API (`fonts.googleapis.com/css2`, User-Agent Chrome, đọc nhãn subset và unicode-range do chính Google phát ra): **Lato là font duy nhất trong danh sách KHÔNG có subset `vietnamese`**
- nguồn: https://fonts.googleapis.com/css2?family=Lato&display=swap
- nhà xuất bản: Google Fonts (API, nguồn sơ cấp — đây là chính CSS mà trình duyệt nhận)
- ngày xuất bản: truy vấn trực tiếp, dữ liệu tại thời điểm truy cập
- truy cập: 2026-08-14
- độ tin: **cao** (kiểm bằng chạy thật, không phải đọc bài)
- lớp: font-viet
- kết quả thô: `Lato` → chỉ có `/* latin */ /* latin-ext */`

### Các font sau **có** subset `vietnamese` do Google phát hành, xác nhận trực tiếp từ API
- nguồn: https://fonts.googleapis.com/css2 (truy vấn từng family)
- nhà xuất bản: Google Fonts (API)
- ngày xuất bản: dữ liệu tại thời điểm truy cập
- truy cập: 2026-08-14
- độ tin: cao
- lớp: font-viet
- kết quả thô:
  - `Inter` → cyrillic, cyrillic-ext, greek, greek-ext, latin, latin-ext, **vietnamese**
  - `Roboto` → cyrillic, cyrillic-ext, greek, greek-ext, latin, latin-ext, math, symbols, **vietnamese**
  - `Noto Sans` → cyrillic, cyrillic-ext, devanagari, greek, greek-ext, latin, latin-ext, **vietnamese**
  - `IBM Plex Sans` → cyrillic, cyrillic-ext, greek, latin, latin-ext, **vietnamese**
  - `Public Sans` → latin, latin-ext, **vietnamese**
  - `Be Vietnam Pro` → latin, latin-ext, **vietnamese**
  - `Nunito Sans` (kiểm thêm ngoài danh sách) → cyrillic, cyrillic-ext, latin, latin-ext, **vietnamese**

### Cảnh báo diễn giải: `latin-ext` KHÔNG đủ cho tiếng Việt. Các chữ khó (ế ộ ữ ẳ ợ ẵ) nằm ở khối Latin Extended Additional `U+1EA0–U+1EF9`, mà Google tách thành subset `vietnamese` riêng — nên một font chỉ có `latin` + `latin-ext` như Lato sẽ **rơi vào font dự phòng** đúng ở những chữ có dấu nặng/hỏi/ngã chồng dấu
- nguồn: https://fonts.googleapis.com/css2?family=Lato&display=swap ; https://fonts.googleapis.com/css2?family=Inter&display=swap (so sánh nhãn subset)
- nhà xuất bản: Google Fonts (API)
- ngày xuất bản: dữ liệu tại thời điểm truy cập
- truy cập: 2026-08-14
- độ tin: cao về **sự khác biệt subset**; vừa về **suy luận khối Unicode nào tương ứng** (chưa đọc lại từng dải unicode-range trong lần chạy này)
- lớp: font-viet

### Segoe UI Variable: **không kiểm được** trong lần chạy này — font này không phát hành qua Google Fonts nên không có kênh xác minh tương đương
- nguồn: —
- nhà xuất bản: —
- ngày xuất bản: —
- truy cập: 2026-08-14
- độ tin: không có bằng chứng — **không kết luận**
- lớp: font-viet

---

## Manh mối đáng đuổi tiếp

1. **`@fluentui-copilot/react-copilot` — mở bằng đường khác.** npm trả 403 với WebFetch. Thử `npm view @fluentui-copilot/react-copilot` qua registry API (`https://registry.npmjs.org/@fluentui-copilot/react-copilot`), hoặc `unpkg.com/@fluentui-copilot/react-copilot/dist/index.d.ts` để đọc thẳng danh sách export và tên token. Đây là nơi khả năng cao nhất tìm ra tên token AI thật của Microsoft.
2. **Repo `microsoft/fluentui` trên GitHub** — grep mã nguồn cho `gradient`, `copilot`, `brandGradient` trong `packages/tokens`. Nguồn sơ cấp nhất có thể có, và trả lời dứt điểm câu hỏi `colorBrandGradient` có thật hay không.
3. **Airtable — bằng chứng thị giác phải lấy từ giao diện thật**, không từ help center. Ảnh chụp trong bài của XRAY (xray.tech/post/airtable-ai-fields) hoặc video YouTube đã tìm thấy có thể cho thấy ô AI trông ra sao; hoặc dùng công cụ trình duyệt mở trực tiếp Airtable.
4. **HAX Design Library, nhánh "when the AI system is wrong"** — chưa mở. Đây là nơi có mẫu cụ thể nhất cho trạng thái "đề nghị, chờ duyệt" từ nguồn Microsoft chính thức.
5. **Google PAIR People + AI Guidebook, chương "Explainability + Trust"** — hoàn toàn chưa chạm tới. Đây là đối trọng chính với HAX và nhiều khả năng nói thẳng về việc hiển thị confidence.
6. **Apple HIG mục "Generative AI" / "Machine learning"**, và **IBM Design for AI** — chưa chạm.
7. **HubSpot Breeze** — chưa có bằng chứng nào về nhãn/badge. Đường tốt nhất: knowledge.hubspot.com, tìm bài về "AI disclosure" hoặc log hoạt động trên bản ghi CRM, chứ không phải trang tiếp thị.
8. **Notion AI và Gmail Smart Compose** — chưa chạm, cả hai đều là mẫu "chờ duyệt" trong ngữ cảnh nội dung nghiệp vụ (gần bài toán CRM hơn ghost text trong editor mã).
9. **Segoe UI Variable + tiếng Việt** — kiểm qua tài liệu Microsoft Typography, hoặc đọc bảng `cmap` của file font thật trên máy Windows (`C:\Windows\Fonts\SegUIVar*.ttf`) bằng fontTools. Kiểm được tại chỗ, không cần mạng.
10. **Tranh luận "màu tím = AI"** — brief hỏi mà chưa tìm được nguồn nào bàn riêng về nó. Truy vấn đáng thử: "AI purple UI backlash", "why is AI always purple".

## Thứ tôi đã tìm mà không thấy

- **Không tìm thấy** mã hex nào cho gradient Copilot từ nguồn Microsoft. Mọi mã hex thu được đều từ site palette do người dùng đóng góp và **mâu thuẫn nhau** — đã hạ độ tin xuống thấp và không dùng.
- **Không xác nhận được** sự tồn tại của token tên `colorBrandGradient` trong Fluent 2. Tìm kiếm trực tiếp tên token này chỉ trả về trang tài liệu token chung, không có mục nào cho nó.
- **Không tìm thấy** mô tả thị giác nào của ô AI field Airtable trong tài liệu chính thức — không icon sparkle, không màu nền, không mô tả trạng thái lỗi.
- **Không tìm thấy** bất kỳ bằng chứng nào về việc HubSpot Breeze gắn nhãn, badge hay màu riêng cho nội dung AI sinh ra trong CRM. Kết quả tìm kiếm chỉ có trang tiếp thị và bài viết lại của bên thứ ba.
- **Không tìm thấy** trong lần chạy này bất kỳ hướng dẫn công khai nào (Microsoft, Google, Apple, IBM) quy định *cơ chế thị giác cụ thể* — màu, viền, nền — để đánh dấu nội dung AI. Các hướng dẫn tìm được đều nói ở tầng nguyên tắc (làm rõ hệ làm được gì, làm tốt tới đâu, vì sao làm vậy), **không kê đơn hình thức**. Đây là một phát hiện âm bản có sức nặng, không phải một lỗ hổng nghiên cứu.
- **Không mở được** trang npm `@fluentui-copilot/react-copilot` (HTTP 403).
- **Không kiểm được** Segoe UI Variable với tiếng Việt.
- **Không chạm tới** (hết ngân sách, không phải không tìm thấy): Google PAIR, Apple HIG, IBM Design for AI, Notion AI, Gmail Smart Compose, tranh luận về màu tím.
