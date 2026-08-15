// Nạp `.env` và CHỐT đích của bộ e2e vào CSDL demo 5442.
//
// ⚠ ĐỐI XỨNG NGƯỢC VỚI `tests/global-setup.ts`, và cả hai đều cần thiết.
//   · Tệp kia sợ trỏ nhầm sang 5442 và xoá sạch dữ liệu demo.
//   · Tệp này sợ điều ngược lại: Playwright chạy trên bản dựng production và
//     phải đo ĐÚNG cơ sở dữ liệu mà ban giám khảo nhìn thấy. Trỏ nhầm sang
//     5443 thì mọi khẳng định vẫn xanh trong khi sản phẩm thật chưa chạy được —
//     dạng xanh giả tệ nhất, vì nó xanh vì đúng lý do sai.
//
// `getDatabaseUrl()` (`src/config.ts`) lui về `DATABASE_URL` khi và chỉ khi
// `NODE_ENV !== "test"`. Playwright KHÔNG hứa hẹn gì về `NODE_ENV`, nên không
// dựa vào điều kiện đó: gỡ hẳn `TEST_DATABASE_URL` khỏi môi trường thì nhánh
// 5443 không tồn tại nữa, bất kể `NODE_ENV` bằng gì.
//
// Nhập tệp này TRƯỚC mọi thứ chạm CSDL. ESM chạy các `import` theo đúng thứ tự
// khai báo, mà `@/core/db` dựng `PrismaClient` ngay ở mức module — nạp muộn một
// dòng là đã trễ.

const DEMO_PORT = "5442";
const TEST_PORT = "5443";

try {
  process.loadEnvFile(".env");
} catch {
  // `.env` vắng mặt thì để khẳng định bên dưới báo lỗi có nghĩa, đừng nuốt ở đây.
}

// Gỡ nhánh 5443. Không phải phòng xa: `npm test` và `npm run e2e` chạy trong
// cùng một vỏ lệnh, và biến này thường đã có sẵn trong môi trường.
delete process.env.TEST_DATABASE_URL;

const url = process.env.DATABASE_URL;

if (!url) {
  throw new Error(
    "Thiếu `DATABASE_URL`. Chép `.env.example` thành `.env`. " +
      "Bộ e2e KHÔNG có giá trị mặc định — đoán địa chỉ CSDL là cách nhanh nhất " +
      "để ghi dữ liệu kiểm thử vào một database không ai ngờ tới.",
  );
}
if (url.includes(`:${TEST_PORT}/`)) {
  throw new Error(
    `\`DATABASE_URL\` đang trỏ cổng kiểm thử ${TEST_PORT}. Bộ e2e phải đo CSDL ` +
      `demo ${DEMO_PORT} — chính cái ban giám khảo mở. Dừng.`,
  );
}
if (!url.includes(`:${DEMO_PORT}/`)) {
  throw new Error(
    `\`DATABASE_URL\` phải trỏ cổng ${DEMO_PORT}, đang trỏ: ${redact(url)}`,
  );
}

/// Không bao giờ in mật khẩu vào log kiểm thử — log đi vào Grafana (`D37`).
function redact(u: string): string {
  return u.replace(/:\/\/[^@]*@/, "://***@");
}

export const DEMO_DATABASE_URL = url;
