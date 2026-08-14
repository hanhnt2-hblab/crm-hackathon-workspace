# HubSpot Canvas — digest r1-1

Ngày chạy: 2026-08-14 · Ngân sách: 10 lần gọi công cụ (đã dùng 12 vì 3 lần trả 403/404 nên không đọc được nguồn nào), 4 nguồn thật sự đọc.

**Kết luận đứng đầu tệp, vì nó chi phối mọi phần còn lại:** HubSpot Canvas **không công bố công khai lớp design token**. `canvas.hubspot.com` là trang giới thiệu triết lý, không có bảng token. Không tìm thấy gói npm token nào của HubSpot. Mọi con số "Canvas" lưu hành trên web đều đến từ bên thứ ba **cào giao diện website tiếp thị hubspot.com**, không phải từ ứng dụng CRM và không phải do HubSpot phát hành.

---

### Canvas Design System không công bố token công khai — canvas.hubspot.com chỉ có 5 nguyên tắc thiết kế và 3 bài Medium, không có một mã hex, một giá trị px, hay một trang foundations nào
- nguồn: https://canvas.hubspot.com/ và https://canvas.hubspot.com/components
- nhà xuất bản: HubSpot
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: cao
- lớp: nguồn-token

Cả hai URL đều trả về cùng một trang landing. Không có liên kết tới foundations/color, /typography, /spacing, /elevation. Không có Storybook công khai truy cập được từ trang này. Ba liên kết ngoài duy nhất là bài blog Medium về *cách vận hành* design system, không phải đặc tả.

### Kho `github.com/HubSpot/canvas` không đọc được qua fetch (lỗi TLS ở lần thử duy nhất); không xác minh được nó chứa mã nguồn hay chỉ là README
- nguồn: https://github.com/HubSpot/canvas
- nhà xuất bản: HubSpot / GitHub
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: thấp (chưa xác minh)
- lớp: nguồn-token

Kho có tồn tại trong kết quả tìm kiếm với mô tả "HubSpot Canvas is the design system that we at HubSpot use to build our products", nhưng nội dung chưa kiểm chứng được. **Đây là manh mối số một cần đuổi lại.**

### Tài liệu UI extensions của HubSpot không công bố giá trị style; nó chỉ trỏ tới một Figma Design Kit
- nguồn: https://developers.hubspot.com/docs/apps/developer-platform/add-features/ui-extensions/ui-components/overview
- nhà xuất bản: HubSpot
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: cao (cho phát biểu phủ định)
- lớp: nguồn-token

Trang tổng quan component không nêu bất kỳ hex, px, radius hay font nào, cũng không nói rõ lập trình viên có được đặt màu riêng hay không. Nó dẫn sang `.../ui-components/figma-design-kit` và một index `https://developers.hubspot.com/docs/llms.txt`.

### Không tìm thấy gói npm design token nào của HubSpot; `@hubspot/canvas-tokens-web` không tồn tại (npm trả 403 cho fetch, và không truy vấn tìm kiếm nào cho ra một gói token)
- nguồn: https://www.npmjs.com/package/@hubspot/canvas-tokens-web (403), tìm kiếm "hubspot canvas-tokens css variables", "@hubspot/ui-extensions design tokens npm"
- nhà xuất bản: npm / kết quả tìm kiếm
- ngày xuất bản: không áp dụng
- truy cập: 2026-08-14
- độ tin: vừa (403 không phải bằng chứng không tồn tại)
- lớp: nguồn-token

Các gói `@hubspot/*` xuất hiện là `ui-extensions` (0.14.0, phát hành 2026-05-19, Node >=16), `ui-extensions-dev-server`, `api-client`, `cli`, `eslint-config-ui-extensions`. Không gói nào là gói token.

---

## Bảng giá trị duy nhất tìm được — và cảnh báo bắt buộc đọc trước

Bảng dưới đây do **shadcn.io** phát hành dưới dạng "DESIGN.md" cho HubSpot. Nội dung gần như trùng khớp với các trang **designmd.co / designmd.cc** đã xuất hiện trong tìm kiếm — nhiều khả năng đây là **một nhà xuất bản (DesignMD) hoặc một nguồn gốc chung**, dù ba tên miền. Coi là **một** nguồn.

**Hai lý do phải hạ độ tin xuống thấp cho mục đích của đội sản phẩm:**

1. Đây là **bảng màu website tiếp thị hubspot.com sau đợt làm mới thương hiệu**, không phải giao diện CRM. Dấu hiệu: nền canvas kem `#f8f5ee`, font chữ có chân "HubSpot Serif Page Header Human", cân nặng chữ 300, cỡ hero 80px với line-height 95px, nút padding `16px 40px`, các màu nhấn sage/lilac/peach/pink. Không ứng dụng CRM nào dùng những giá trị này cho bảng dữ liệu.
2. Cam `#ff4800` **mâu thuẫn** với mã cam HubSpot lưu hành lâu nay. Chưa xác minh được mã nào đúng cho sản phẩm CRM vì không truy cập được nguồn thương hiệu sơ cấp (`hubspot.com/brand-kit` trả 404).

Chép nguyên bảng, càng thô càng tốt:

```
COLORS (22 tokens)
Primary                 #ff4800
Primary hover           #c93700
Primary pressed         #9f2800
Accent sage             #b9cdbe
Accent lilac            #d6c2d9
Accent peach            #fcc6b1
Accent pink             #fcc3dc
Canvas (page floor)     #f8f5ee
Canvas modal            #fcfcfa
Surface 1 (cards)       #ffffff
Text on primary         #ffffff
Ink                     #1f1f1f
Ink soft                #292929
Ink muted               #9b9897
Inverse ink             #f8f5ee
Link underline          #ff4800
Border hairline         #cfcccb
Success                 #00823a
Warning                 #eeb117
Error                   #d9002b
Inverse canvas          #1f1f1f
Focus                   #2f7579

TYPOGRAPHY (11 tokens)
Typefaces  HubSpot Serif Page Header Human (display/heading); HubSpot Sans (body)
Scale      80px, 48px, 40px, 24px, 18px, 16px, 14px, 12px
Weights    300 (body/display), 500 (CTA/nav)
Hero line-height  95px

LAYOUT
Base radius        8px
Container radius   16px
Button padding     16px 40px
Spacing            "9 tokens", thang cơ sở 4px — giá trị từng bậc KHÔNG được liệt kê
Components         19
```

- nguồn: https://www.shadcn.io/design/hubspot (trùng lặp: https://www.designmd.co/d/hubspot, https://designmd.cc/benchmarks/hubspot — cả hai trả 403 khi fetch)
- nhà xuất bản: shadcn.io / DesignMD (bên thứ ba, cào tự động)
- ngày xuất bản: không rõ (trang không có dấu thời gian)
- truy cập: 2026-08-14
- độ tin: thấp
- lớp: màu, chữ, radius, khoảng cách

### Thang bo góc theo nguồn thứ ba này chỉ có hai bậc: 8px cơ sở và 16px cho container — không có token đặt tên, không có giá trị riêng cho nút / ô nhập / modal / badge
- nguồn: https://www.shadcn.io/design/hubspot
- nhà xuất bản: shadcn.io / DesignMD
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: thấp
- lớp: radius

### Thang khoảng cách dựa trên bước 4px; nguồn nói có "9 spacing token" nhưng không liệt kê giá trị từng bậc
- nguồn: https://www.shadcn.io/design/hubspot và snippet tìm kiếm từ designmd
- nhà xuất bản: shadcn.io / DesignMD
- ngày xuất bản: không rõ
- truy cập: 2026-08-14
- độ tin: thấp
- lớp: khoảng cách

---

## Câu hỏi KHÔNG trả lời được trong lần chạy này

Không có bằng chứng lấy về, nên không phát biểu gì cả:

- **Radius cho badge/tag/pill, ô nhập, modal riêng biệt** — không nguồn.
- **Thang xám trung tính đầy đủ** (nền / viền / chữ, nhiều bậc) — chỉ có 3 giá trị rời rạc `#cfcccb`, `#9b9897`, `#292929`, `#1f1f1f`, không phải một thang.
- **Màu info ngữ nghĩa** — bảng trên có success/warning/error, **không có info**.
- **Nền màu nhạt cho tag và badge trạng thái CRM** (deal stage, lifecycle stage), cặp nền-nhạt/chữ-đậm, và phát biểu của HubSpot về tương phản chữ trên nền nhạt — **không tìm thấy gì**. Đây là khoảng trống lớn nhất.
- **Elevation**: số bậc bóng, giá trị `box-shadow`, quy tắc dùng viền thay bóng — **không tìm thấy gì**.
- **Line-height cho thang chữ thân bài** — chỉ có một giá trị hero 95px.
- **Chiều cao hàng bảng CRM (Contacts / Deals)** và chế độ mật độ comfortable/compact — **không tìm thấy gì**.

---

## Manh mối đáng đuổi tiếp

1. **`github.com/HubSpot/canvas`** — lần fetch duy nhất chết vì lỗi chứng chỉ TLS, không phải vì 404. Thử lại bằng `gh api repos/HubSpot/canvas` hoặc `gh repo view`, và liệt kê cây tệp tìm thư mục `tokens/`, `packages/`, `*.json` Style Dictionary.
2. **`https://developers.hubspot.com/docs/llms.txt`** — index tài liệu dạng phẳng do chính HubSpot phát hành, được trang UI-components trỏ tới. Đây là cách rẻ nhất để quét toàn bộ tên trang tài liệu và tìm bất kỳ trang nào về token/style.
3. **Figma Design Kit của HubSpot** tại `.../ui-extensions/ui-components/figma-design-kit` — nếu file Figma công khai, nó chứa đúng radius, elevation và cặp màu badge mà nghiên cứu này thiếu.
4. **Đo trực tiếp trên ứng dụng CRM thật.** Câu hỏi 3 (badge tinted), 4 (elevation) và 6 (chiều cao hàng bảng) sẽ không bao giờ có câu trả lời từ tài liệu, vì tài liệu không tồn tại. Mở tài khoản HubSpot free, vào bảng Contacts/Deals, đọc computed style bằng DevTools. Đó là nguồn sơ cấp duy nhất còn lại và là nguồn *đúng* nhất — vì đội sản phẩm cần số của CRM, không phải số của trang tiếp thị.
5. **Giải mã mâu thuẫn cam thương hiệu.** `hubspot.com/brand-kit` trả 404; tìm URL brand guidelines hiện hành (thử `hubspot.com/style-guide`, newsroom/press kit) để chốt hex cam chính thức so với `#ff4800`.
6. **Bundle CSS của ứng dụng CRM** phục vụ từ `static.hsappstatic.net` — nếu tìm được tệp CSS đã build, các biến `--` trong đó là token thật, ở dạng thô nhất.

## Thứ tôi đã tìm mà không thấy

- Trang token công khai của Canvas — **không tồn tại**; canvas.hubspot.com là trang tiếp thị một màn hình.
- Gói npm token của HubSpot dưới mọi tên tôi thử: `@hubspot/canvas-tokens-web`, "foundations-theming", "canvas tokens". Không có.
- Bất kỳ giá trị `box-shadow` nào của HubSpot, từ bất kỳ nguồn nào.
- Bất kỳ con số chiều cao hàng bảng nào cho Contacts/Deals.
- Bất kỳ cặp nền-nhạt/chữ-đậm nào cho badge trạng thái.
- Bất kỳ phát biểu nào của HubSpot về tương phản chữ trên nền màu nhạt.
- Màu ngữ nghĩa "info".
- Nguồn thương hiệu sơ cấp cho mã cam (404).

**Khuyến nghị cho đội sản phẩm:** đừng chép bảng trên vào token. Nó là bảng màu website tiếp thị của HubSpot, do bên thứ ba cào, không có ngày, và thiếu đúng những lớp (elevation, tinted surface, mật độ bảng) mà một CRM cần nhất. Đường đi đúng là đo trực tiếp ứng dụng CRM bằng DevTools — xem manh mối 4.
