if (!window.__wnDataLoaded) { window.__wnDataLoaded = 1;
// Bộ dữ liệu của bản demo — nội dung thật của sản phẩm, không lorem.
// 15 Account (Nhật và Việt), 8 Opportunity đang mở, một đơn vị tiền: JPY.

const TODAY_ROWS = [
  { id:"r1", section:"overdue", source:"machine", when:"Quá 1 ngày", whenDetail:"hạn 13/08", overdue:true,
    account:"Hoshino Retail Systems", accountMeta:"星野リテールシステムズ · Ōsaka",
    opp:"Cổng đối tác B2B", stage:"Soạn đề xuất", money:"21.000.000", confidence:"chac",
    headline:"Hoshino mở trung tâm phát triển thứ hai tại Ōsaka — hỏi lại phạm vi giai đoạn 2",
    quote:"「大阪に第二開発拠点を開設し、2026年内に80名体制とする計画です」", quoteLang:"ja",
    quoteSource:"Bản lưu 11/08 09:41 — bấm để mở đúng đoạn có đánh dấu",
    signalMeta:"Signal: Mở rộng · 11/08", undo:"5 ngày 22 giờ", snapshot:"hoshino" },
  { id:"r2", section:"overdue", source:"human", when:"Quá 2 ngày", whenDetail:"hạn 12/08", overdue:true,
    account:"Sōkō Logistics Co., Ltd.", accountMeta:"倉庫ロジスティクス株式会社 · Tōkyō", pending:2,
    opp:"Nâng cấp WMS", stage:"Soạn đề xuất", money:"32.000.000",
    headline:"Gửi bản đề xuất sửa lần 2 cho ông Tanaka", byline:"08/08 lúc 14:22",
    signalMeta:"Không sinh từ Signal" },
  { id:"r3", section:"today", source:"machine", when:"Hôm nay", whenDetail:"14/08",
    account:"Kaisei Denshi K.K.", accountMeta:"株式会社カイセイ電子 · Nagoya", pending:1,
    opp:"MES giai đoạn 1", stage:"Thương lượng", money:"48.000.000", confidence:"chac",
    headline:"Kaisei Denshi vừa công bố vòng Series B 3,2 tỷ yên — liên hệ trong ngày",
    quote:"「シリーズBラウンドにて総額32億円の資金調達を完了いたしました」", quoteLang:"ja",
    quoteSource:"Bản lưu 14/08 08:12 — bấm để mở đúng đoạn có đánh dấu",
    signalMeta:"Signal: Gọi vốn · 13/08", signalMeta2:"hạn theo độ gấp: 1 ngày",
    undo:"6 ngày 21 giờ", snapshot:"kaisei" },
  { id:"r4", section:"today", source:"machine", when:"Hôm nay", whenDetail:"14/08",
    account:"CTCP Công nghệ Minh Quang", accountMeta:"IT Product · Hà Nội",
    opp:"Thuê ngoài đội QA", stage:"Tiếp cận", money:"9.500.000", confidence:"chac",
    headline:"Minh Quang có CTO mới từ 01/09 — chào lại với người quyết mới",
    quote:"“Hội đồng quản trị bổ nhiệm ông Nguyễn Đức Toàn giữ chức Giám đốc Công nghệ kể từ ngày 01/09/2026”",
    quoteSource:"Bản lưu 07/08 16:20 — bấm để mở đúng đoạn có đánh dấu",
    signalMeta:"Signal: Nhân sự cấp cao · 06/08", undo:"4 giờ 10 phút", undoSoon:true,
    undoNote:"sau đó sửa tay như ô bình thường", snapshot:"minhquang" },
  { id:"r5", section:"today", source:"human", when:"Hôm nay", whenDetail:"14/08", flagged:true,
    account:"Midori Pharma K.K.", accountMeta:"株式会社ミドリ製薬 · Kyōto", pending:1,
    opp:"Hệ thống truy xuất lô", stage:"Đủ điều kiện", money:"26.500.000",
    headline:"Gọi bà Ishikawa xác nhận ngân sách quý IV", byline:"12/08 lúc 17:04",
    flag:"Thiếu dấu hiệu ngân sách cho Stage Đủ điều kiện — bổ sung ngay",
    signalMeta:"Hệ thống ghim một dòng đề xuất, không ghi đè ô bạn gõ" },
  { id:"r6", section:"today", source:"human", when:"Hôm nay", whenDetail:"14/08",
    account:"Tsubasa Mobility Inc.", accountMeta:"株式会社ツバサモビリティ · Yokohama", pending:1,
    opp:"Cổng dữ liệu xe điện", stage:"Tiếp cận", money:"18.000.000",
    headline:"Chốt lịch demo với đội kỹ thuật", byline:"13/08 lúc 09:15",
    signalMeta:"Không sinh từ Signal" },
  { id:"r7", section:"flagged", source:"human", when:"—", whenDetail:"chưa có hạn", flagged:true,
    account:"Công ty CP Thực phẩm Trường An", accountMeta:"Traditional · TP.HCM",
    opp:"Migration ERP lên cloud", stage:"Đủ điều kiện", money:"15.000.000",
    flag:"Thiếu Next step và ngày hạn — đặt Next step để việc này vào danh sách" },
  { id:"r8", section:"flagged", source:"human", when:"—", whenDetail:"tạm ngưng",
    account:"Công ty TNHH Dệt may Phú Hòa", accountMeta:"Traditional · Nam Định",
    opp:"Cổng ERP nhà cung cấp", stage:"Tạm dừng", money:"12.000.000",
    quiet:"Cũng thiếu Next step, nhưng cờ im lặng có chủ đích; hệ thống không tự đặt cho tới khi Opportunity quay lại Stage đang chạy." }
];

const SUGGESTIONS = [
  { id:"s1", account:"Sōkō Logistics Co., Ltd.", field:"Primary contact", current:null,
    proposed:"Tanaka Hiroshi — Trưởng phòng Hệ thống", confidence:"chac",
    quote:"「システム部長 田中 宏 が本プロジェクトの窓口を担当いたします」", quoteLang:"ja",
    quoteSource:"Bản lưu 10/08 11:03 — bấm để mở đúng đoạn có đánh dấu", snapshot:"soko",
    risk:"người liên hệ sai làm mất một vòng gọi, và Timeline ghi nhầm đối tượng." },
  { id:"s2", account:"Sōkō Logistics Co., Ltd.", field:"Ngành", current:"Logistics",
    proposed:"Logistics · kho tự động", confidence:"cothe",
    quote:"「自動倉庫システムの導入を全拠点に拡大する」", quoteLang:"ja",
    quoteSource:"Bản lưu 10/08 11:03 — bấm để mở đúng đoạn có đánh dấu", snapshot:"soko",
    risk:"phân khúc lệch một bậc, và bộ tiêu chí chấm điểm cơ hội sẽ chấm sai." },
  { id:"s3", account:"Midori Pharma K.K.", field:"Quy mô nhân sự", current:"480 người",
    proposed:"640 người", confidence:"cothe", staleProfile:true,
    quote:"「グループ従業員数は640名となりました」", quoteLang:"ja",
    quoteSource:"Bản lưu 12/08 07:55 — bấm để mở đúng đoạn có đánh dấu", snapshot:"midori",
    risk:"hồ sơ mang quy mô sai khi mang đi họp, và tiêu chí phân khúc sẽ lệch." },
  { id:"s4", account:"Kaisei Denshi K.K.", field:"Timeline", current:null,
    proposed:"Thêm mục: gọi vốn Series B 3,2 tỷ yên (13/08)", confidence:"chac",
    quote:"「シリーズBラウンドにて総額32億円の資金調達を完了いたしました」", quoteLang:"ja",
    quoteSource:"Bản lưu 14/08 08:12 — bấm để mở đúng đoạn có đánh dấu", snapshot:"kaisei",
    risk:"Timeline thiếu một mốc quan trọng, và lần chào sau sẽ nhắc lại thứ khách đã công bố." },
  { id:"s5", account:"Tsubasa Mobility Inc.", field:"Ghi chú ngành", current:null,
    proposed:"Đang tuyển 25 kỹ sư nhúng tại Yokohama", confidence:"doan",
    quote:"「組込みエンジニア 若干名 募集」", quoteLang:"ja",
    quoteSource:"Bản lưu 09/08 15:12 — bấm để mở đúng đoạn có đánh dấu", snapshot:"tsubasa",
    risk:"con số 25 là suy ra từ cụm 若干名, không có trong nguồn — dùng nó trong đề xuất là nói quá." },
  { id:"s6", account:"Hoshino Retail Systems", field:"Ghi chú ngành", current:"Bán lẻ · POS",
    proposed:"Bán lẻ · POS · trung tâm phát triển Ōsaka (80 người, 2026)", confidence:"chac",
    quote:"「大阪に第二開発拠点を開設し、2026年内に80名体制とする計画です」", quoteLang:"ja",
    quoteSource:"Bản lưu 11/08 09:41 — bấm để mở đúng đoạn có đánh dấu", snapshot:"hoshino",
    risk:"bỏ mất một dấu hiệu mở rộng đang chạy, đúng thứ làm nên độ gấp của deal này." },
  { id:"s7", account:"CTCP Công nghệ Minh Quang", field:"Primary contact", current:"Lê Thị Hòa — Trưởng phòng IT",
    proposed:"Nguyễn Đức Toàn — Giám đốc Công nghệ (từ 01/09)", confidence:"cothe",
    quote:"“Hội đồng quản trị bổ nhiệm ông Nguyễn Đức Toàn giữ chức Giám đốc Công nghệ kể từ ngày 01/09/2026”",
    quoteSource:"Bản lưu 07/08 16:20 — bấm để mở đúng đoạn có đánh dấu", snapshot:"minhquang",
    risk:"đổi Primary contact quá sớm thì mất người đang giữ quan hệ, trước khi người mới nhận việc." }
];

const SNAPSHOTS = {
  kaisei:{ source:"kaisei-denshi.co.jp / ニュースリリース", capturedAt:"14/08 08:12", lang:"ja", paragraphs:[
    "当社は2026年8月13日開催の取締役会において、資金調達に関する決議を行いましたのでお知らせいたします。",
    { text:"「シリーズBラウンドにて総額32億円の資金調達を完了いたしました」", marked:true },
    "調達した資金は、名古屋の開発体制の拡充および海外パートナーとの協業推進に充当する予定です。"] },
  hoshino:{ source:"hoshino-retail.co.jp / IR", capturedAt:"11/08 09:41", lang:"ja", paragraphs:[
    "小売業向け基幹システムの需要拡大に対応するため、開発体制の見直しを進めております。",
    { text:"「大阪に第二開発拠点を開設し、2026年内に80名体制とする計画です」", marked:true },
    "第一拠点である東京との二拠点体制により、開発の継続性を確保いたします。"] },
  minhquang:{ source:"minhquang.vn / Tin công ty", capturedAt:"07/08 16:20", lang:"vi", paragraphs:[
    "Ngày 07/08/2026, Công ty Cổ phần Công nghệ Minh Quang tổ chức phiên họp Hội đồng quản trị thường kỳ.",
    { text:"“Hội đồng quản trị bổ nhiệm ông Nguyễn Đức Toàn giữ chức Giám đốc Công nghệ kể từ ngày 01/09/2026”", marked:true },
    "Ông Toàn có 14 năm kinh nghiệm trong lĩnh vực phát triển sản phẩm phần mềm."] },
  midori:{ source:"midori-pharma.co.jp / 会社概要", capturedAt:"12/08 07:55", lang:"ja", paragraphs:[
    "2026年8月現在の会社概要は以下のとおりです。",
    { text:"「グループ従業員数は640名となりました」", marked:true },
    "京都本社および滋賀工場を中心に、医薬品の製造および品質管理を行っております。"] },
  soko:{ source:"soko-logistics.co.jp / お知らせ", capturedAt:"10/08 11:03", lang:"ja", paragraphs:[
    { text:"「システム部長 田中 宏 が本プロジェクトの窓口を担当いたします」", marked:true },
    "「自動倉庫システムの導入を全拠点に拡大する」方針のもと、2026年度中に東京・大阪・福岡の三拠点で稼働を予定しております。"] },
  tsubasa:{ source:"tsubasa-mobility.co.jp / 採用情報", capturedAt:"09/08 15:12", lang:"ja", paragraphs:[
    "横浜開発センターでは、次世代EV向けソフトウェアの開発を行っています。",
    { text:"「組込みエンジニア 若干名 募集」", marked:true },
    "応募資格および待遇の詳細は募集要項をご確認ください。"] }
};

const STAGE_STATS = [
  { name:"Tiếp cận", count:2, value:"27.500.000" },
  { name:"Đủ điều kiện", count:2, value:"41.500.000" },
  { name:"Soạn đề xuất", count:2, value:"53.000.000" },
  { name:"Thương lượng", count:1, value:"48.000.000" },
  { name:"Tạm dừng", count:1, value:"12.000.000" },
  { name:"Thắng", count:2, value:"57.000.000", closed:true },
  { name:"Thua", count:5, value:"88.500.000", closed:true }
];

const LOSS_REASONS = [
  { name:"Giá cao hơn đối thủ", count:3 },
  { name:"Ngân sách bị hoãn", count:2 },
  { name:"Chọn nhà cung cấp trong nước", count:1 },
  { name:"Thiếu chứng chỉ bảo mật", count:1 }
];

const INDUSTRIES = [
  { name:"Sản xuất", count:6 }, { name:"Logistics", count:3 }, { name:"Bán lẻ", count:3 },
  { name:"Dược phẩm", count:2 }, { name:"Dệt may", count:1 }
];

Object.assign(window, { TODAY_ROWS, SUGGESTIONS, SNAPSHOTS, STAGE_STATS, LOSS_REASONS, INDUSTRIES });

// ——— Mở rộng cho 11 bề mặt: Account list, Pipeline, Opportunity detail, Watching, Scan log, Admin, khay thông báo.
const ACCOUNTS = [
  { id:"a1", name:"Hoshino Retail Systems", local:"星野リテールシステムズ", city:"Ōsaka", industry:"Bán lẻ", size:"2.400 người", updated:"11/08/2026", stale:0, pending:1, watching:true, scanned:true, snapshot:"hoshino" },
  { id:"a2", name:"Sōkō Logistics Co., Ltd.", local:"倉庫ロジスティクス株式会社", city:"Tōkyō", industry:"Logistics", size:"1.200 người", updated:"04/07/2026", stale:41, pending:2, watching:true, scanned:true, snapshot:"soko" },
  { id:"a3", name:"Kaisei Denshi K.K.", local:"株式会社カイセイ電子", city:"Nagoya", industry:"Sản xuất", size:"860 người", updated:"14/08/2026", stale:0, pending:1, watching:true, scanned:true, snapshot:"kaisei" },
  { id:"a4", name:"CTCP Công nghệ Minh Quang", local:"IT Product", city:"Hà Nội", industry:"Sản xuất", size:"320 người", updated:"07/08/2026", stale:7, pending:1, watching:true, scanned:true, snapshot:"minhquang" },
  { id:"a5", name:"Midori Pharma K.K.", local:"株式会社ミドリ製薬", city:"Kyōto", industry:"Dược phẩm", size:"480 người", updated:"12/08/2026", stale:2, pending:1, watching:true, scanned:true, snapshot:"midori" },
  { id:"a6", name:"Tsubasa Mobility Inc.", local:"株式会社ツバサモビリティ", city:"Yokohama", industry:"Sản xuất", size:"1.050 người", updated:"09/08/2026", stale:5, pending:1, watching:true, scanned:true, snapshot:"tsubasa" },
  { id:"a7", name:"Công ty CP Thực phẩm Trường An", local:"Traditional", city:"TP.HCM", industry:"Bán lẻ", size:"640 người", updated:"02/07/2026", stale:43, pending:0, watching:false, scanned:true },
  { id:"a8", name:"Công ty TNHH Dệt may Phú Hòa", local:"Traditional", city:"Nam Định", industry:"Dệt may", size:"1.800 người", updated:"20/06/2026", stale:55, pending:0, watching:false, scanned:true },
  { id:"a9", name:"Aozora Tech K.K.", local:"株式会社アオゾラテック", city:"Fukuoka", industry:"Sản xuất", size:"210 người", updated:"12/08/2026", stale:2, pending:0, watching:true, scanned:false, unreadable:"Trang nguồn chặn truy cập từ 12/08" },
  { id:"a10", name:"Yamabuki Foods Co., Ltd.", local:"山吹フーズ株式会社", city:"Sapporo", industry:"Bán lẻ", size:"3.100 người", updated:"05/08/2026", stale:9, pending:0, watching:false, scanned:true },
  { id:"a11", name:"Seiryū Logistics K.K.", local:"青龍ロジスティクス株式会社", city:"Kōbe", industry:"Logistics", size:"740 người", updated:"01/08/2026", stale:13, pending:0, watching:false, scanned:true },
  { id:"a12", name:"CTCP Dược Đại Việt", local:"Pharma", city:"Hà Nội", industry:"Dược phẩm", size:"410 người", updated:"28/06/2026", stale:47, pending:0, watching:false, scanned:true },
  { id:"a13", name:"Công ty TNHH Cơ khí Hải Đăng", local:"Traditional", city:"Hải Phòng", industry:"Sản xuất", size:"520 người", updated:"10/08/2026", stale:4, pending:0, watching:false, scanned:true },
  { id:"a14", name:"Kitano Precision K.K.", local:"北野精密株式会社", city:"Sendai", industry:"Sản xuất", size:"290 người", updated:"08/08/2026", stale:6, pending:0, watching:false, scanned:true },
  { id:"a15", name:"CTCP Logistics Sài Gòn Xanh", local:"Traditional", city:"TP.HCM", industry:"Logistics", size:"980 người", updated:"06/08/2026", stale:8, pending:0, watching:false, scanned:true }
];

const OPPS = [
  { id:"o1", account:"Hoshino Retail Systems", name:"Cổng đối tác B2B", stage:"Soạn đề xuất", money:"21.000.000", due:"13/08", overdue:1, nextStep:"Hoshino mở trung tâm phát triển thứ hai tại Ōsaka — hỏi lại phạm vi giai đoạn 2", by:"machine", row:"r1" },
  { id:"o2", account:"Sōkō Logistics Co., Ltd.", name:"Nâng cấp WMS", stage:"Soạn đề xuất", money:"32.000.000", due:"12/08", overdue:2, nextStep:"Gửi bản đề xuất sửa lần 2 cho ông Tanaka", by:"human", row:"r2" },
  { id:"o3", account:"Kaisei Denshi K.K.", name:"MES giai đoạn 1", stage:"Thương lượng", money:"48.000.000", due:"14/08", overdue:0, nextStep:"Kaisei Denshi vừa công bố vòng Series B 3,2 tỷ yên — liên hệ trong ngày", by:"machine", row:"r3" },
  { id:"o4", account:"CTCP Công nghệ Minh Quang", name:"Thuê ngoài đội QA", stage:"Tiếp cận", money:"9.500.000", due:"14/08", overdue:0, nextStep:"Minh Quang có CTO mới từ 01/09 — chào lại với người quyết mới", by:"machine", row:"r4" },
  { id:"o5", account:"Midori Pharma K.K.", name:"Hệ thống truy xuất lô", stage:"Đủ điều kiện", money:"26.500.000", due:"14/08", overdue:0, nextStep:"Gọi bà Ishikawa xác nhận ngân sách quý IV", by:"human", row:"r5",
    need:"Hệ thống truy xuất lô hiện dùng Excel, không đạt yêu cầu thanh tra", budget:"", flag:"Thiếu dấu hiệu ngân sách cho Stage Đủ điều kiện — bổ sung ngay" },
  { id:"o6", account:"Tsubasa Mobility Inc.", name:"Cổng dữ liệu xe điện", stage:"Tiếp cận", money:"18.000.000", due:"14/08", overdue:0, nextStep:"Chốt lịch demo với đội kỹ thuật", by:"human", row:"r6" },
  { id:"o7", account:"Công ty CP Thực phẩm Trường An", name:"Migration ERP lên cloud", stage:"Đủ điều kiện", money:"15.000.000", due:"", overdue:0, nextStep:"", by:"none", row:"r7",
    need:"", budget:"", flag:"Thiếu Next step và ngày hạn — đặt Next step để việc này vào danh sách" },
  { id:"o8", account:"Công ty TNHH Dệt may Phú Hòa", name:"Cổng ERP nhà cung cấp", stage:"Tạm dừng", money:"12.000.000", due:"", overdue:0, nextStep:"", by:"none", row:"r8", prevStage:"Soạn đề xuất",
    quiet:"Cũng thiếu Next step, nhưng cờ im lặng có chủ đích; hệ thống không tự đặt cho tới khi Opportunity quay lại Stage đang chạy." },
  { id:"o9", account:"Yamabuki Foods Co., Ltd.", name:"POS nhiều chi nhánh", stage:"Thắng", money:"34.000.000", due:"", overdue:0, nextStep:"", by:"none", prevStage:"Thương lượng" },
  { id:"o10", account:"Kitano Precision K.K.", name:"Cổng kiểm tra chất lượng", stage:"Thắng", money:"23.000.000", due:"", overdue:0, nextStep:"", by:"none", prevStage:"Thương lượng" },
  { id:"o11", account:"Seiryū Logistics K.K.", name:"Định tuyến giao hàng", stage:"Thua", money:"28.000.000", loss:"Giá cao hơn đối thủ", prevStage:"Thương lượng" },
  { id:"o12", account:"CTCP Dược Đại Việt", name:"Quản lý thử nghiệm lâm sàng", stage:"Thua", money:"19.500.000", loss:"Ngân sách bị hoãn", prevStage:"Soạn đề xuất" },
  { id:"o13", account:"Công ty TNHH Cơ khí Hải Đăng", name:"MES phân xưởng", stage:"Thua", money:"16.000.000", loss:"Chọn nhà cung cấp trong nước", prevStage:"Đủ điều kiện" },
  { id:"o14", account:"CTCP Logistics Sài Gòn Xanh", name:"Cổng chủ hàng", stage:"Thua", money:"14.000.000", loss:"Thiếu chứng chỉ bảo mật", prevStage:"Soạn đề xuất" },
  { id:"o15", account:"Aozora Tech K.K.", name:"Thuê ngoài đội frontend", stage:"Thua", money:"11.000.000", loss:"", prevStage:"Tiếp cận",
    flag:"Chưa có lý do thua — Opportunity này đứng ngoài bảng thống kê lý do thua cho tới khi được bổ sung" }
];

const SCAN_LOG = [
  { at:"09:41:52", kind:"sum", text:"Tổng hợp 10 vòng gần nhất — 147/150 Account quét xong, 3 vòng bỏ, 41 Signal mới" },
  { at:"09:41:12", account:"Kitano Precision K.K.", text:"quét xong — 0 Signal mới" },
  { at:"09:40:58", account:"Aozora Tech K.K.", kind:"skip", text:"bỏ vòng — trang nguồn chặn truy cập từ 12/08, vòng sau thử lại" },
  { at:"09:40:31", account:"Kaisei Denshi K.K.", text:"quét xong — 2 Signal mới (Gọi vốn, Tuyển dụng)" },
  { at:"09:39:47", account:"Midori Pharma K.K.", text:"quét xong — 1 Signal mới (Nhân sự cấp cao)" },
  { at:"09:39:02", account:"Sōkō Logistics Co., Ltd.", text:"quét xong — 1 Signal mới (Mở rộng)" },
  { at:"09:38:20", account:"Hoshino Retail Systems", text:"quét xong — 0 Signal mới" },
  { at:"09:37:44", account:"CTCP Công nghệ Minh Quang", text:"quét xong — 0 Signal mới" },
  { at:"09:36:59", kind:"cut", text:"vòng cắt tại ranh giới Account — lý do: Quản trị bấm phanh. 9/15 Account đã quét trong vòng này" }
];

const ADMIN = {
  signals:{ total:"41/41", chac:23, cothe:12, doan:6, unclassified:"2/41" },
  decisions:{ total:"141/147", approve:"96%", approveRaw:"135/141 lượt duyệt", decideTime:"1,8 giây", editApprove:"3%", dismiss:"1%" },
  machineNextStep:{ total:"38 lần", undone:"2/38" },
  dismissReasons:[
    { name:"Thông tin sai", count:1 },
    { name:"Không liên quan tới account này", count:0 },
    { name:"Đã biết rồi", count:0 },
    { name:"Nguồn không tin được", count:0 },
    { name:"Có gợi ý mới hơn", count:4 }
  ],
  blind:[
    "Sōkō Logistics — 4 lượt duyệt liên tiếp, trung bình 0,9 giây mỗi lượt",
    "Midori Pharma — duyệt một gợi ý mức Đoán trong 0,6 giây",
    "Kaisei Denshi — duyệt cả 3 gợi ý trong 2,1 giây"
  ],
  params:[
    { label:"Chu kỳ quét", value:"60 giây", hint:"Vòng đang chạy giữ nhịp cũ; nhịp mới có hiệu lực từ vòng kế." },
    { label:"Ngưỡng độ tươi hồ sơ", value:"30 ngày", hint:"Quá ngưỡng thì Account mang cờ hồ sơ đã cũ." },
    { label:"Cửa sổ Hoàn tác", value:"7 ngày", hint:"Áp cho cả Next step do máy đặt và Suggestion đã duyệt." },
    { label:"Trần ngân sách vòng quét", value:"78% / 100%", hint:"Chạm 100% thì hệ thống tự tắt phần AI và hiện dải báo cho Sales." }
  ]
};

const NOTIFS = [
  { at:"08:12", opp:"MES giai đoạn 1 · Kaisei Denshi K.K.", what:"Đặt Next step: liên hệ trong ngày", why:"Signal Gọi vốn 13/08 — mức Chắc, có câu trích trực tiếp" },
  { at:"07:55", opp:"Hệ thống truy xuất lô · Midori Pharma K.K.", what:"Ghim một dòng đề xuất dưới ô bạn gõ", why:"Không ghi đè ô do bạn gõ — quy mô nhân sự trong nguồn đã đổi 480 → 640" },
  { at:"09:41", opp:"Cổng đối tác B2B · Hoshino Retail Systems", what:"Thêm một mục Timeline: mở trung tâm phát triển Ōsaka", why:"Signal Mở rộng 11/08 — mức Chắc" }
];

Object.assign(window, { ACCOUNTS, OPPS, SCAN_LOG, ADMIN, NOTIFS });

}
