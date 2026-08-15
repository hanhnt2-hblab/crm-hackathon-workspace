// Cấu hình bộ kiểm thử đầu-cuối (e2e) — `T-1`…`T-10` của §6 đề bài.
//
// ⚠ ĐÂY LÀ BỘ THỨ HAI, KHÔNG THAY BỘ Ở `tests/`.
//   · `tests/**` chạy bằng Vitest, `environment: jsdom`, trỏ CSDL kiểm thử 5443,
//     và `tests/global-setup.ts` XOÁ SẠCH lược đồ đó mỗi lượt chạy.
//   · `e2e/**` chạy bằng Playwright, trình duyệt THẬT, trỏ CSDL demo 5442 qua
//     bản dựng production — tức đúng thứ ban giám khảo bấm tay.
//   Hai bộ không dùng chung tệp nào và không được gộp: gộp là để một lượt
//   `vitest` xoá mất CSDL demo.
//
// ⚠ CỔNG 3100, KHÔNG PHẢI 3000. `next dev` của người khác thường giữ 3000; đâm
//   vào đó thì `webServer` lặng lẽ dùng máy chủ của người ta và bộ kiểm đo nhầm
//   một bản dựng khác.
//
// `D36`: `T-n` là lớp NGOÀI — mỗi tệp `T<n>.spec.ts` đúng một `test.describe`
// mang NGUYÊN VĂN điều kiện §6. Phần phân hoạch tương đương / giá trị biên
// KHÔNG trộn vào đây; nó thuộc lớp kiểm trường nhập liệu ở `tests/unit`.

// ⚠ DÒNG NÀY ĐỨNG TRƯỚC MỌI THỨ, có chủ đích. Playwright nạp tệp cấu hình này
// trong tiến trình chính TRƯỚC khi tách tiến trình con (`webServer` và các
// worker), nên `.env` nạp ở đây là chỗ duy nhất cả ba nhánh cùng thấy.
import "./e2e/_env";

import { defineConfig, devices } from "@playwright/test";

/// Cổng riêng của bộ e2e. Đổi ở đây thì `E2E_BASE_URL` phải đổi theo.
const PORT = process.env.E2E_PORT ?? "3100";
const BASE_URL = process.env.E2E_BASE_URL ?? `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./e2e",

  // ⚠ MỘT LUỒNG, KHÔNG SONG SONG. Cả mười tệp dùng CHUNG một CSDL demo và
  // `T-9` bật/tắt cờ `ai_enabled` — một cờ TOÀN CỤC. Chạy song song thì `T-9`
  // tắt AI ngay giữa lúc `T-8` đang chờ vòng quét sinh mục, và `T-8` đỏ vì lý
  // do không liên quan gì tới nó. Đây không phải chậm cho chắc; đây là ràng
  // buộc thật của dữ liệu dùng chung.
  workers: 1,
  fullyParallel: false,

  // Không `retries`. Thử lại che đúng loại lỗi bộ này cần thấy: hành vi phụ
  // thuộc thời điểm ở vòng quét. Đỏ chập chờn là một phát hiện, không phải nhiễu.
  retries: 0,

  // Mỗi phép kiểm 120 giây: `T-4` chờ ba chu kỳ vòng quét, `T-8`/`T-9` chờ hai.
  // Chu kỳ demo mặc định 60 giây (Mục 0 bảng 0.2.2), nên các tệp đó tự hạ chu kỳ
  // xuống mức nhỏ nhất qua bảng `settings` rồi trả lại.
  timeout: 120_000,
  expect: { timeout: 15_000 },

  // Bộ tệp HTML mà đề bài đòi: tự chứa, mở bằng trình duyệt, không cần máy chủ.
  // `open: "never"` để lượt chạy không treo chờ người đóng tab.
  // `json` là thứ `e2e/verify.mjs` đọc để dựng bảng mười dòng; `html` là bộ tệp
  // nộp cho ban giám khảo. Không cái nào thay được cái kia: bảng để người chấm
  // liếc một cái là biết đỏ ở đâu, báo cáo HTML để mở ra xem vết chạy và ảnh chụp.
  reporter: [
    ["list"],
    ["json", { outputFile: "test-results/e2e-results.json" }],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],

  use: {
    baseURL: BASE_URL,
    /// ⚠ MỞ TRÌNH DUYỆT THẬT khi `E2E_HEADED=1` — dùng cho `npm run e2e:xem`.
    ///
    /// Ban giám khảo muốn NHÌN bộ kiểm thao tác, không chỉ đọc bảng kết quả. Một
    /// lượt headless chạy nhanh hơn và là mặc định đúng cho `npm run verify`;
    /// nhưng *"tôi thấy nó tự bấm"* là bằng chứng khác hẳn *"nó báo xanh"*, và
    /// đó là bằng chứng người ngồi xem tin được.
    ///
    /// `slowMo` 350ms là con số để MẮT NGƯỜI theo kịp. Không có nó thì Playwright
    /// bấm xong cả luồng trong hơn một giây — trình duyệt mở ra, nhấp nháy, đóng
    /// lại, và người xem không thấy gì ngoài một cửa sổ chớp.
    headless: process.env.E2E_HEADED !== "1",
    launchOptions: {
      slowMo: process.env.E2E_HEADED === "1" ? 350 : 0,
    },
    // Vết chạy + ảnh chụp cho MỌI phép kiểm, không chỉ phép kiểm đỏ: báo cáo
    // này là bằng chứng nộp bài, nên một luồng xanh cũng phải xem lại được.
    trace: "on",
    screenshot: "on",
    video: "off",
    locale: "vi-VN",
    timezoneId: "Asia/Ho_Chi_Minh",
  },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],

  // Playwright tự dựng sản phẩm ở cấu hình production rồi khởi động —
  // đúng đường `§7.3` đòi. `npm start` = `docker compose up -d --wait && next start`,
  // nên Postgres 5442 lên trước khi phép kiểm đầu tiên chạy.
  //
  // ⚠ `reuseExistingServer` bật ngoài CI: nếu đã có máy chủ ở 3100 thì dùng lại,
  // khỏi dựng lại mỗi lần lặp. Trên CI thì luôn dựng mới.
  webServer: {
    command: "npm run build && npm start",
    url: `${BASE_URL}/login`,
    env: { PORT },
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
