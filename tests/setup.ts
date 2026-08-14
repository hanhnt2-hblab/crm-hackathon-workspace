// `C0-8` — chạy trong MỖI tệp kiểm thử, trước mọi `describe`.
//
// Khác `global-setup.ts`: tệp đó chạy MỘT LẦN trong tiến trình cha và dựng CSDL;
// tệp này chạy trong tiến trình con của từng tệp kiểm, nơi biến môi trường KHÔNG
// được thừa kế từ `globalSetup`. Đó là lý do phải nạp `.env` lần nữa ở đây —
// bỏ qua thì `src/core/db.ts` dựng client trỏ vào cổng 5442 ngay lúc nhập module.

import { beforeAll } from "vitest";

beforeAll(() => {
  try {
    process.loadEnvFile(".env");
  } catch {
    // để khẳng định dưới báo lỗi có nghĩa
  }

  const url = process.env.TEST_DATABASE_URL;
  if (!url || !url.includes(":5443/")) {
    throw new Error(
      "`TEST_DATABASE_URL` vắng mặt hoặc không trỏ cổng 5443. " +
        "Bộ kiểm thử KHÔNG chạy trên CSDL demo.",
    );
  }
  // KHÔNG gán `NODE_ENV`: Vitest tự đặt, và Next khai nó `readonly` — gán là
  // `TS2540`, và lỗi đó làm đỏ cả `npm run build` chứ không chỉ `tsc`.
  if (process.env.NODE_ENV !== "test") {
    throw new Error(
      `NODE_ENV phải là "test", đang là "${process.env.NODE_ENV}".`,
    );
  }
  process.env.DATABASE_URL = url;
});
