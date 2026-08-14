// T-6 — Đổi sang bản chụp *sau* thì Việc tiếp theo tự đổi
//
// `D36`: `T-n` là lớp NGOÀI, mỗi `T` một `Feature` nhiều `Scenario`. Phần phân
// hoạch tương đương và giá trị biên nằm ở lớp kiểm trường nhập liệu bên dưới,
// KHÔNG trộn vào đây.
//
// Cục sở hữu thân: ① — theo quy tắc *mắt xích cuối*: cục mà khi xong thì
// phép kiểm này chuyển xanh. Mốc: M3.
//
// ⚠ Thân là `it.todo` có chủ đích (`C0-9`). Chuỗi mô tả giữ NGUYÊN VĂN điều
// kiện của đề bài §6, để người viết thân không phải đi tra lại, và để đọc
// `npm test` là thấy ngay còn nợ gì.

import { describe, it } from "vitest";

describe("T-6 — Đổi sang bản chụp *sau* thì Việc tiếp theo tự đổi", () => {
  it.todo("đổi một Công ty đang có Cơ hội mở sang phiên bản *sau*");
  it.todo("Việc tiếp theo của Cơ hội TỰ đổi");
  it.todo("có thông báo");
  it.todo("ô mang dấu hiệu do hệ thống đặt");
});
