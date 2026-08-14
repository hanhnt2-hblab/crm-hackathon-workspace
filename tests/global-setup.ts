// `C0-8` · `AD-UI-19` · `NFR-13` — dựng CSDL kiểm thử, một lần cho cả lượt chạy.
//
// ⚠⚠ TỆP NGUY HIỂM NHẤT TRONG REPO. Nó chạy `migrate reset`, tức XOÁ SẠCH một
// cơ sở dữ liệu. Nếu nó trỏ nhầm sang cổng 5442 thì nó xoá CSDL demo — có thể
// ngay giữa buổi chấm, và không có đường hoàn lại.
//
// Nên nó KHÔNG tin vào cấu hình. Nó tự khẳng định đích trước khi chạm vào gì.
//
// Ba việc, đúng thứ tự:
//   ① nạp `.env` — Vitest KHÔNG tự nạp, và `prisma.config.ts` chỉ được CLI của
//      Prisma đọc, không nằm trên đường nạp của Vitest. Thiếu bước này thì
//      `TEST_DATABASE_URL` vắng mặt, `getDatabaseUrl()` lui về `DATABASE_URL`
//      — tức cổng 5442 — và **không một dòng cảnh báo nào**.
//   ② khẳng định đích là 5443, ném nếu không
//   ③ `prisma generate` rồi `migrate reset`

import { execFileSync } from "node:child_process";

/// Cổng của dịch vụ `db_test` trong `docker-compose.yml`. Đổi ở đây thì phải
/// đổi cả `.env` và `docker-compose.yml` — ba chỗ, cố ý, vì đây là loại hằng số
/// mà sai một chỗ là mất dữ liệu.
const TEST_PORT = "5443";
const DEMO_PORT = "5442";

export default async function setup(): Promise<void> {
  // ① — `process.loadEnvFile` là API của Node 20.6+; bản ghim là 24.19.0.
  try {
    process.loadEnvFile(".env");
  } catch {
    // `.env` vắng mặt thì để bước ② báo lỗi có nghĩa, đừng nuốt ở đây.
  }

  const url = process.env.TEST_DATABASE_URL;

  // ② — BA khẳng định, không phải một. Mỗi cái bịt một cách trỏ nhầm khác nhau.
  if (!url) {
    throw new Error(
      "Thiếu `TEST_DATABASE_URL`. KHÔNG lui về `DATABASE_URL` — lui là xoá CSDL demo.",
    );
  }
  if (!url.includes(`:${TEST_PORT}/`)) {
    throw new Error(
      `\`TEST_DATABASE_URL\` phải trỏ cổng ${TEST_PORT}, đang trỏ: ${redact(url)}`,
    );
  }
  if (url.includes(`:${DEMO_PORT}/`)) {
    throw new Error(
      `\`TEST_DATABASE_URL\` đang trỏ cổng demo ${DEMO_PORT}. Dừng.`,
    );
  }

  // `NODE_ENV=test` là vế THỨ HAI của điều kiện trong `getDatabaseUrl()`.
  // KHÔNG gán nó ở đây: Vitest tự đặt, và Next khai nó `readonly` nên gán là
  // lỗi `TS2540` — lỗi đó làm ĐỎ CẢ `npm run build`, không chỉ `tsc`.
  // Khẳng định thay vì gán: nếu một ngày Vitest đổi mặc định, ta biết ngay.
  if (process.env.NODE_ENV !== "test") {
    throw new Error(
      `NODE_ENV phải là "test", đang là "${process.env.NODE_ENV}". ` +
        "`getDatabaseUrl()` cần cả hai vế, nếu không nó lui về CSDL demo.",
    );
  }
  process.env.DATABASE_URL = url;

  // ③ — dựng lại lược đồ. KHÔNG dùng `prisma migrate reset`, và KHÔNG dùng
  // `prisma db push`. Cả hai đều hỏng ở đây, theo hai cách khác nhau:
  //
  //   · `migrate reset` — cờ `--skip-seed` ĐÃ BỊ GỠ ở Prisma 7 (đã đo: *unknown
  //     or unexpected option*), và không có cờ thay thế. Nên nó LUÔN chạy lệnh
  //     seed khai trong `prisma.config.ts`, tức `node prisma/seed.ts` — một tệp
  //     chưa tồn tại. Bộ kiểm thử không được phụ thuộc vào bộ gieo.
  //   · `db push --force-reset` — dựng lược đồ từ `schema.prisma`, tức BỎ QUA
  //     tệp migration. Mà toàn bộ bốn `CHECK` và bốn chỉ mục MỘT PHẦN là SQL
  //     viết tay chỉ nằm trong migration. Dùng nó là mỗi lần chạy kiểm thử lại
  //     mất sạch lớp cưỡng chế của `AD-CR-11` — và mất IM LẶNG, vì lược đồ
  //     trông vẫn đúng.
  //
  // Đường còn lại là tường minh: xoá lược đồ, rồi áp lại chính tệp migration.
  await dropSchema(url);
  run("prisma", ["generate"]);
  run("prisma", ["migrate", "deploy"], { DATABASE_URL: url });
}

/// Xoá `public` kéo theo cả `_prisma_migrations`, nên `migrate deploy` áp lại
/// từ đầu — đúng thứ ta muốn: mỗi lượt chạy bắt đầu từ một lược đồ dựng bằng
/// CHÍNH tệp migration mà giám khảo sẽ chạy.
async function dropSchema(url: string): Promise<void> {
  const { PrismaClient } = await import("@prisma/client");
  const { PrismaPg } = await import("@prisma/adapter-pg");
  const client = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
  try {
    await client.$executeRawUnsafe("DROP SCHEMA IF EXISTS public CASCADE");
    await client.$executeRawUnsafe("CREATE SCHEMA public");
  } finally {
    await client.$disconnect();
  }
}

function run(bin: string, args: string[], extraEnv: Record<string, string> = {}): void {
  execFileSync("npx", [bin, ...args], {
    stdio: "inherit",
    env: { ...process.env, ...extraEnv },
    shell: process.platform === "win32",
  });
}

/// Không bao giờ in mật khẩu vào log kiểm thử — log đi vào Grafana (`D37`).
function redact(url: string): string {
  return url.replace(/:\/\/[^@]*@/, "://***@");
}
