#!/usr/bin/env node
// `npm run e2e:xem` — chạy bộ kiểm đầu-cuối với TRÌNH DUYỆT MỞ RA nhìn thấy được.
//
// Ban giám khảo muốn NHÌN bộ kiểm thao tác, không chỉ đọc bảng kết quả. Đó là
// bằng chứng khác hẳn: *"nó báo xanh"* là một lời khai, *"tôi thấy nó tự bấm"*
// là một quan sát.
//
// ⚠ KHÔNG thay `npm run verify`. Lượt nghiệm thu của §6 vẫn chạy headless — nhanh
// hơn, không đòi máy có màn hình, và chạy được trên máy chủ. Lệnh này là lượt
// TRÌNH DIỄN, và nó cố ý chậm hơn.
//
// ⚠ Đặt biến môi trường bằng Node chứ không bằng cú pháp shell: `E2E_HEADED=1 npx`
// là cú pháp POSIX và **không chạy trên `cmd.exe`** của Windows, còn `set X=1 &&`
// thì ngược lại. Máy của người chấm có thể là bất kỳ cái nào.

import { spawnSync } from "node:child_process";
import { platform } from "node:process";

console.log("→ Mở trình duyệt thật. Mười luồng T-1…T-10 sẽ tự thao tác;");
console.log("  mỗi bước chậm lại 350ms để mắt theo kịp. Đừng bấm vào cửa sổ đó.\n");

const r = spawnSync(
  "npx",
  [
    "playwright",
    "test",
    "--headed",
    // MỘT worker: nhiều worker mở nhiều cửa sổ cùng lúc và người xem không biết
    // nhìn cái nào. Config đã đặt `workers: 1`, lặp lại ở đây để lệnh này đúng
    // kể cả khi ai đó đổi config.
    "--workers=1",
  ],
  {
    stdio: "inherit",
    shell: platform === "win32",
    env: { ...process.env, E2E_HEADED: "1" },
  },
);

process.exit(r.status ?? 1);
