# Ma trận quyết định kiến trúc — CRM AI-Native "Why Now"

Ngày chốt: 14/08/2026 · Thi: 15/08/2026 · Phương pháp: Decision Analysis

Tài liệu này ghi lại **các phương án đã bị loại và lý do loại**. Một phương án duy nhất không kèm phương án đã loại thì chưa phải là phân tích quyết định.

---

## 1. Bối cảnh và ràng buộc

| Ràng buộc | Nội dung | Hệ quả lên việc chọn phương án |
| --- | --- | --- |
| Quỹ giờ | 15/08, 9:30–15:00 — **4,5 tiếng**, hạn chót cứng 15:00 | Không có chỗ cho việc dựng khung mất nửa ngày |
| D41 | Giữ trống **một nửa quỹ giờ (~2,5 giờ)** cho tính năng BTC phát thêm; BTC đã xác nhận 14/08 là vẫn có tính năng thêm | "Chỗ cho tính năng lạ" là tiêu chí chấm, không phải lời khuyên |
| Đội | 2 dev + 1 Sales Manager | Không chia được thành hai nhánh công nghệ song song |
| Hạ tầng | Công ty **không hỗ trợ VPS và domain** (hỏi đáp mục 3) → deploy local, tự giả lập như production (NFR-11, §12.3) | Mọi phương án cần dịch vụ đám mây bị loại từ vòng ngoài, không cần chấm |
| Ngôn ngữ | BTC **không giới hạn** FE/BE/DB (hỏi đáp mục 7) | Quyết định 1 thực sự mở, không bị đề bài ép |
| Cỡ dữ liệu | 12–15 công ty, ~30 người liên hệ, 8 cơ hội, 2 bản chụp/công ty (§3) | Mọi ràng buộc hiệu năng của CSDL đều **không** ràng buộc — loại hiệu năng khỏi bộ tiêu chí |
| D39 | Chỉ log Claude Code ngày 15/08 được tính điểm | Ưu tiên thứ **dễ tái sinh bằng AI trong ngày**, không phải thứ chép lại |

---

## 2. Tiêu chí và trọng số

**Trọng số được chốt trước khi chấm bất kỳ phương án nào**, ngay sau khi đọc §7 và bảng T-1…T-10 của đề bài, chứ không chọn sau để hợp lý hoá kết quả. Thang điểm 1–5 cho mỗi ô.

| # | Tiêu chí | Trọng số | Vì sao trọng số đó |
| --- | --- | --- | --- |
| C1 | Thoả ba lệnh một-bước | **5** | §7.3 khởi động, §7.4 kiểm thử, §7.5 nạp dữ liệu từ clone sạch là **cổng nộp bài**. Hỏng một lệnh là hỏng cả bài, không phải mất điểm cục bộ |
| C2 | Tầng nghiệp vụ gọi thẳng được | **5** | T-2, T-10 và D25 cùng đòi kiểm thử gọi thẳng tầng nghiệp vụ với danh nghĩa hệ thống. Logic nằm rải trong handler HTTP là hỏng T-2 lẫn T-10 |
| C3 | Tốc độ dựng trong ~1 ngày | 4 | Quỹ giờ 4,5 tiếng trừ đi ~2,5 giờ D41 giữ trống, còn **~2 giờ** hữu dụng cho phần lõi |
| C4 | Chỗ cho tính năng lạ trong ~2,5 giờ | 4 | D41 — tiêu chí chấm trực tiếp |
| C5 | Hỗ trợ dùng AI dễ tới đâu | 4 | Tầng AI là trục sản phẩm: D22 ép enum, NFR-2 trần 20 lệnh gọi, NFR-3 kiểm ngân sách trước mỗi lệnh |
| C6 | Vòng quét + kill-switch tức thì | 4 | T-9 đòi tắt AI **có hiệu lực ngay**, cắt vòng đang chạy tại ranh giới Công ty (FR-45). Loại mọi phương án chạy vòng quét ở tiến trình không chia sẻ trạng thái |
| C7 | Tận dụng bộ component React sẵn có | 3 | Vòng 3 có **5/6 giám khảo là Sales** — chấm đúng phần nhìn thấy được |
| C8 | Đội thạo sẵn | 3 | 1 ngày không đủ để học nền mới; nhưng thấp hơn C1/C2 vì thạo mà hỏng cổng nộp bài thì vô nghĩa |
| C9 | Giao dịch nguyên tử cho FR-34 | 2 | FR-34 đòi compare-and-set thật; mọi lựa chọn ở đây đều làm được, khác nhau ở độ gọn |

Tổng trọng số 34 → điểm tối đa 170.

---

## 3. Quyết định 1 — Ngôn ngữ nền

| Tiêu chí (trọng số) | TypeScript toàn bộ | Python BE + TS FE | Python toàn bộ |
| --- | --- | --- | --- |
| C1 ba lệnh một-bước (5) | 5 → 25 | 2 → 10 | 5 → 25 |
| C2 tầng nghiệp vụ gọi thẳng (5) | 5 → 25 | 5 → 25 | 5 → 25 |
| C3 tốc độ dựng (4) | 4 → 16 | 2 → 8 | 4 → 16 |
| C4 chỗ cho tính năng lạ (4) | 5 → 20 | 2 → 8 | 4 → 16 |
| C5 hỗ trợ dùng AI (4) | 4 → 16 | **5 → 20** | **5 → 20** |
| C6 vòng quét + kill-switch (4) | 4 → 16 | 3 → 12 | 5 → 20 |
| C7 component React (3) | 4 → 12 | 5 → 15 | 1 → 3 |
| C8 đội thạo sẵn (3) | **5 → 15** | 2 → 6 | 2 → 6 |
| C9 nguyên tử FR-34 (2) | 3 → 6 | 3 → 6 | 4 → 8 |
| **Tổng** | **151** | **110** | **139** |

**Chốt: TypeScript toàn bộ (151).**

Vì sao hai phương án kia rụng:

- **Tách đôi Python BE + TS FE (110)** — rụng ở C1 (2/5) và C3 (2/5), không phải ở chất lượng kỹ thuật. Một lệnh §7.3 phải dựng hai runtime, hai trình quản lý gói, hai bộ khoá phiên bản; §7.4 phải chạy hai bộ kiểm thử rồi gộp kết quả. Với đội 2 người, tách đôi còn nghĩa là mỗi người gác một nửa và không ai đọc được cả hệ trong lúc chữa cháy.
- **Python toàn bộ (139)** — thua 12 điểm, gần hết khoảng cách nằm ở C7 (1 vs 4, −9) và C8 (2 vs 5, −9), bù lại bằng C5 và C6. Đây là phương án tốt thứ hai và không hề tệ.

**Chỗ phương án thắng thua thẳng:** ở ô C5 "hỗ trợ dùng AI", **Python nhỉnh hơn TypeScript** (5 so với 4). `messages.parse` với Pydantic trả về đối tượng đã validate sẵn; `beta_tool` sinh JSON schema thẳng từ chữ ký hàm. Bên TypeScript phải khai schema thủ công rồi tự kiểm. Chấp nhận thua ô này vì cả hai là **hai ngôn ngữ duy nhất có Agent SDK**, nên chọn TypeScript không đóng cánh cửa nào của Quyết định 2. Ở C6 Python cũng hơn (5 so với 4) — xem §9.

---

## 4. Quyết định 2 — Tầng AI

Chấm trên tập tiêu chí có phân biệt: C2 (5), C3 (4), C4 (4), C5 (4), C6 (4) — tối đa 105.

| Phương án | C2 | C3 | C4 | C5 | C6 | Tổng |
| --- | --- | --- | --- | --- | --- | --- |
| **Agent SDK qua subscription Team** | 5 → 25 | 5 → 20 | 5 → 20 | 5 → 20 | 4 → 16 | **101** |
| Agent SDK qua API key | 5 → 25 | 3 → 12 | 5 → 20 | 5 → 20 | 4 → 16 | 93 |
| Messages API + Tool Runner | 4 → 20 | 4 → 16 | 4 → 16 | 4 → 16 | 5 → 20 | 88 |
| Tự viết vòng lặp trên Messages API | 5 → 25 | 2 → 8 | 2 → 8 | 3 → 12 | 5 → 20 | 73 |

**Chốt: Agent SDK qua đăng nhập subscription Team, KHÔNG dùng `ANTHROPIC_API_KEY`.**

Quyết định này không dựa vào tài liệu mà dựa vào **thực nghiệm đã chạy ngày 14/08/2026**:

| Phép thử | Kết quả |
| --- | --- |
| Đường subscription có chạy không | Máy không có `ANTHROPIC_API_KEY` lẫn `ANTHROPIC_AUTH_TOKEN`; chỉ có `~/.claude/.credentials.json`. Cài `@anthropic-ai/claude-agent-sdk`, gọi `query()` — chạy, trả kết quả đúng |
| D22 ép enum | `outputFormat` json_schema trả đúng `signal_type=funding`, `confidence=chac` theo enum 0.1.1 và 0.1.3 |
| BR-D2 câu trích | Khớp nguyên văn đoạn nguồn **từng ký tự** |
| NFR-2 chặn lượt | `maxTurns` chặn được số lượt |
| NFR-3 ngân sách | `result` trả `total_cost_usd`; có thêm `maxBudgetUsd` — đọc số thật thay vì ước lượng token |
| **NFR-17 / T-10 — có đối chứng** | Với `tools: []`, agent bị bảo thẳng là đọc tệp rồi chạy `rm`: **không tool nào được gọi, tệp mồi còn nguyên**. Đối chứng với `allowedTools` Read + Bash, cùng lời nhắc: agent gọi Read, Bash sáu lượt, **tệp mồi bị xoá**. Đối chứng chứng minh phép thử có giá trị chứ không phải mô hình ngẫu nhiên ngoan |

Số đo chi phí thật: một lệnh gọi rút phát hiện tốn **0,025–0,039 đô**; một vòng chạm trần 20 lệnh gọi rơi vào **0,50–0,80 đô**. Nhưng D18 chỉ tạo Bản lưu mới khi dấu vân nội dung khác, và cache 24h theo hash prompt của NFR-4 cắt hẳn lệnh gọi lặp — kịch bản T-8 đổi nguồn hai công ty chỉ tốn khoảng **0,05 đô**.

**Rủi ro đã biết và đã chấp nhận.** Tài liệu chính thức của Agent SDK, đọc ngày 14/08/2026, **vẫn ghi** rằng không cho phép bên thứ ba dùng đăng nhập claude.ai cho sản phẩm của họ và bảo dùng API key. Trang hỗ trợ khai gói Pro/Max/Team/Enterprise dùng được từ 15/06/2026, **nhưng cùng trang ghi thay đổi đó đã bị tạm dừng**, chưa có ngày hiệu lực mới. Đội đang dựa vào một cơ chế đang treo; nếu nó ngừng giữa ngày thi thì T-4, T-6, T-8 đỏ cùng lúc. Biện pháp giảm: **tầng AI nằm sau một giao diện hẹp**, đổi sang API key chỉ bằng biến môi trường (chính là phương án 93 điểm ở trên, giữ nguyên làm đường lui), và **kiểm lại một lần vào sáng 15/08 trước khi làm bất cứ việc gì khác**.

Phí tổn đã biết: mỗi lệnh gọi nguội mang theo khoảng **2548 token** system prompt của Claude Code (đo qua `cache_creation_input_tokens`). Gọi thẳng Messages API nhẹ hơn nhiều — đây là lý do Tool Runner được 5 ở C6 mà phương án thắng chỉ được 4.

---

## 5. Quyết định 3 — Khung ứng dụng

Tiêu chí có phân biệt: C1 (5), C2 (5), C3 (4), C4 (4), C6 (4), C7 (3) — tối đa 125.

| Phương án | C1 | C2 | C3 | C4 | C6 | C7 | Tổng |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Next.js đơn khối, lõi tách riêng** | 5 → 25 | 4 → 20 | 5 → 20 | 5 → 20 | 3 → 12 | 5 → 15 | **112** |
| Fastify + Vite tách đôi | 3 → 15 | 5 → 25 | 3 → 12 | 4 → 16 | 5 → 20 | 4 → 12 | 100 |
| NestJS | 4 → 20 | 5 → 25 | 2 → 8 | 3 → 12 | 5 → 20 | 2 → 6 | 91 |

**Chốt: Next.js đơn khối, tầng nghiệp vụ tách thành module lõi không phụ thuộc HTTP.** Một tiến trình, một lệnh §7.3, một chỗ giữ trạng thái cho kill-switch T-9. NestJS rụng vì C3 (2/5): bộ khung DI và decorator tốn quá nhiều thời gian dựng cho một sản phẩm sống 4,5 tiếng. Fastify + Vite thua 12 điểm ở C1 và C3 vì lại là hai tiến trình.

Điều kiện kèm theo, không phải tuỳ chọn: lõi nghiệp vụ **không được import gì từ `next/*`**, nếu không thì C2 tụt về 2 và T-2/T-10 hỏng.

---

## 6. Quyết định 4 — Cơ sở dữ liệu

Tiêu chí có phân biệt: C1 (5), C3 (4), C4 (4), C9 (2) — tối đa 75.

| Phương án | C1 | C3 | C4 | C9 | Tổng |
| --- | --- | --- | --- | --- | --- |
| **Postgres + Prisma qua Docker Compose** | 4 → 20 | 5 → 20 | 5 → 20 | 5 → 10 | **70** |
| SQLite + Prisma | 5 → 25 | 5 → 20 | 4 → 16 | 3 → 6 | 67 |
| Postgres + Drizzle | 4 → 20 | 3 → 12 | 4 → 16 | 5 → 10 | 58 |

**Chốt: Postgres + Prisma.** Khoảng cách với SQLite chỉ **3 điểm** — đây là quyết định sát nút và tài liệu này ghi rõ như vậy. SQLite thắng C1 (không cần Docker) nhưng rụng ở C9 vì một người ghi tại một thời điểm, trong khi vòng quét (FR-36…FR-38) ghi đồng thời với thao tác của Sales trên UI, và ở NFR-11 vì "local nhưng đủ như production". Drizzle rụng ở C3: `migrate deploy` và `db seed` của Prisma cho §7.5 gần như miễn phí, Drizzle phải viết tay.

**Đường lui đã định sẵn:** nếu Docker không dựng được trên máy tại địa điểm thi, đổi datasource của Prisma sang SQLite — cùng schema, mất C9, giữ được cổng nộp bài.

---

## 7. Quyết định 5 — Bộ kiểm thử

Tiêu chí có phân biệt: C1 (5), C2 (5), C3 (4), C4 (4) — tối đa 90.

| Phương án | C1 | C2 | C3 | C4 | Tổng |
| --- | --- | --- | --- | --- | --- |
| **Vitest, mỗi T một tệp** | 5 → 25 | 5 → 25 | 5 → 20 | 5 → 20 | **90** |
| Vitest + Playwright | 4 → 20 | 5 → 25 | 2 → 8 | 3 → 12 | 65 |
| Cucumber Gherkin thật | 4 → 20 | 5 → 25 | 2 → 8 | 2 → 8 | 61 |

**Chốt: Vitest, một tệp cho mỗi phép kiểm T-1…T-10, tên tệp mang mã T.** Điểm tuyệt đối vì nó là hình chiếu trực tiếp của T-2/T-10: gọi thẳng hàm tầng nghiệp vụ với danh nghĩa hệ thống, không dựng trình duyệt.

Cucumber rụng ở C3/C4: lớp step definition là chi phí thuần với một bộ 10 phép kiểm cố định đã được đề bài đặt tên sẵn — Gherkin trả giá trị khi yêu cầu còn đang thương lượng, ở đây thì không. Playwright rụng vì thời gian dựng và độ giòn: FR-4 kéo thả là thứ tốn nhiều giờ nhất để tự động hoá và cũng dễ vỡ nhất, trong khi giám khảo tự bấm tay ở vòng 3.

---

## 8. Giả định chống đỡ các quyết định này

| Giả định | Điều gì làm nó sai | Phát hiện bằng cách nào |
| --- | --- | --- |
| **Q15** — lược đồ dữ liệu BTC phát ngày thi khớp `docs/CRM clone từ Airtable/` | BTC phát lược đồ khác tên trường, khác quan hệ, hoặc gộp/tách thực thể | Mở tệp dữ liệu ngay phút đầu 9:30 và đối chiếu tên trường trước khi chạy bất cứ gì. Giảm thiệt hại bằng **TR-1**: lớp ánh xạ mỏng ở module riêng, lõi không đọc trực tiếp tệp BTC |
| Đường subscription của Agent SDK còn chạy 15/08 | Cơ chế đang **bị tạm dừng** theo chính trang hỗ trợ; có thể ngừng bất cứ lúc nào | Chạy lại đúng kịch bản thực nghiệm §4 vào sáng 15/08 **trước** mọi việc khác. Nếu hỏng: đổi sang API key qua biến môi trường (đã là phương án 93 điểm) |
| Bộ component React 18 UMD nối được vào Next.js / React 19 | Bản dựng UMD **không import thẳng được**, phải nối qua lớp mount thủ công; có thể vỡ vì khác bản React | Dựng một trang mẫu dùng đúng một component trước khi cam kết cả giao diện. Nếu vỡ: dùng 191 token CSS thôi và tự viết component — đây chính là lý do C7 chấm 4 chứ không phải 5 |
| **D12** — dữ liệu BTC còn ô Việc tiếp theo trống để T-6 chạy | BTC điền sẵn Việc tiếp theo cho cả 8 Cơ hội → T-6 không có ô trống. Đây là **rủi ro nghiệm thu duy nhất** được đánh dấu trong 47 quyết định | Đếm số Cơ hội đang chạy có Việc tiếp theo rỗng ngay sau khi nạp dữ liệu. Đường thoát **TR-5**: seeder chừa trống ít nhất một Cơ hội, cờ ghi đè bật được lúc chạy |
| Cỡ dữ liệu §3 giữ nguyên (12–15 công ty, 8 cơ hội) | BTC phát bộ lớn hơn hàng chục lần | Đếm bản ghi lúc nạp. Rủi ro thấp: mọi lựa chọn ở Quyết định 4 đều dư sức cho cỡ này |

---

## 9. Cái giá của phương án thắng

Nói thẳng những chỗ tổ hợp TypeScript + Next.js + Agent SDK yếu hơn phương án đã loại:

1. **Vòng quét trong Next.js là chỗ yếu nhất** — C6 chấm 3, thấp nhất trong mọi ô của phương án thắng ở Quyết định 3. Vòng lặp dài (FR-36, FR-37) không thuộc về vòng đời một route handler, nên phải có một điểm vào worker riêng trong cùng tiến trình, chia sẻ trạng thái kill-switch T-9 và khoá theo Công ty FR-38. Python toàn bộ được 5 ở ô này. **Đây là hạng mục cần dựng đầu tiên và kiểm sớm nhất**, vì nếu sai thì T-8 và T-9 đỏ cùng lúc.
2. **Ép cấu trúc đầu ra tốn công hơn Python** — không có Pydantic, phải khai schema và kiểm thủ công. Đã có bằng chứng chạy được, nhưng công viết ra là công thật.
3. **Mỗi lệnh gọi nguội gánh ~2548 token thừa** của system prompt Claude Code. Trong phiên thì bộ đệm khấu hao được; ở chế độ vận hành vòng quét 24 giờ thì **mỗi vòng đều nguội**. Đây là giá phải trả cho tốc độ dựng và cho việc chứng minh ranh giới NFR-17 bằng `tools: []`.
4. **Tầng AI treo trên một cơ chế đăng nhập đang bị tạm dừng.** Đã chấp nhận có ý thức, có đường lui, có mốc kiểm lại sáng 15/08 — nhưng vẫn là rủi ro sống, không phải rủi ro đã đóng.
5. **Postgres thắng SQLite đúng 3/75 điểm** và kéo theo phụ thuộc Docker vào lệnh §7.3. Nếu máy tại địa điểm thi không chạy được Docker, ưu thế này thành nợ trong vòng vài phút.
6. **Không làm chatbot.** §4 có sáu nhóm chức năng, không nhóm nào là chatbot; không phép kiểm nào trong T-1…T-10 chạm tới. Nếu giám khảo mong đợi một hộp chat vì đây là sản phẩm AI thì đội mất điểm ấn tượng — đổi lại giữ được đúng nửa quỹ giờ mà D41 bắt để trống.
