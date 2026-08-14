// Prisma 7 chuyển cấu hình datasource ra khỏi `schema.prisma` vào tệp này.
// Khai `url` trong schema sẽ ném P1012.
//
// ⚠ ĐÃ ĐO 14/08: Prisma 7 **không còn tự nạp `.env`** khi dùng `prisma.config.ts`.
// Thiếu dòng `loadEnvFile` thì mọi lệnh migrate ném:
//   "The datasource.url property is required in your Prisma config file"
// — thông điệp trỏ vào tệp này chứ không vào `.env`, nên rất dễ đi lạc hướng.
//
// Đây là tệp THỨ BA — và cuối cùng — được đọc `process.env`, theo `AD-15`:
//   · src/config.ts        — bí mật và địa chỉ hạ tầng
//   · instrumentation.ts   — đúng một biến, NEXT_RUNTIME
//   · prisma.config.ts     — DATABASE_URL, không phải lựa chọn của đội

import { defineConfig } from "prisma/config";

// `process.loadEnvFile` là API sẵn có của Node (>=20.6), không cần `dotenv`.
// Bọc try/catch vì trên máy chấm `.env` có thể chưa tồn tại lúc chạy lệnh đầu.
try {
  process.loadEnvFile(".env");
} catch {
  // `.env` chưa có — để `DATABASE_URL` từ môi trường thật quyết định
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
