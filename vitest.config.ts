import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// `AD-UI-19` · `NFR-13` · `§7.4`
//
// Ba luật của bộ kiểm thử, mỗi luật vá một cách hỏng đã biết:
//
// 1. `npm test` là `vitest run`, KHÔNG phải `vitest`. Hướng dẫn của Next.js
//    đặt `"vitest"` — chế độ theo dõi, không bao giờ trả mã thoát, và giám
//    khảo gõ `npm test` sẽ thấy tiến trình treo. Luật này nằm ở `package.json`.
//
// 2. Database RIÊNG (`whynow_test`, cổng 5443). `T-2` và `T-10` đọc-ghi
//    Postgres thật; chạy trên database demo sẽ để lại bản ghi ghi vết và bản
//    ghi xoá mềm giữa buổi chấm.
//
// 3. `globalSetup` chạy `prisma generate` TRƯỚC `migrate reset`. Prisma 7
//    không còn tự chạy `generate`, và cờ `--skip-generate` đã bị gỡ.

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    globals: false, // import tường minh từ `vitest`; không biến toàn cục ngầm
    setupFiles: ["./tests/setup.ts"],
    globalSetup: ["./tests/global-setup.ts"],
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    // `T-1`…`T-10` chạm cùng một database → KHÔNG chạy song song giữa các tệp.
    // Một tệp mỗi `T` (`NFR-13`), nên tuần tự vẫn nhanh.
    fileParallelism: false,
    hookTimeout: 60_000, // migrate reset trên máy nguội
    testTimeout: 30_000,
  },
});
