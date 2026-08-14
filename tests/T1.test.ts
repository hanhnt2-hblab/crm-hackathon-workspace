// T-1 — Tắt AI, trọn nhóm 1 vẫn chạy
//
// `D36`: `T-n` là lớp NGOÀI, mỗi `T` một `Feature` nhiều `Scenario`. Phần phân
// hoạch tương đương và giá trị biên nằm ở lớp kiểm trường nhập liệu bên dưới,
// KHÔNG trộn vào đây.
//
// Cục sở hữu thân: ① — theo quy tắc *mắt xích cuối*: cục mà khi xong thì
// phép kiểm này chuyển xanh. Mốc: M2.
//
// ⚠ Thân là `it.todo` có chủ đích (`C0-9`). Chuỗi mô tả giữ NGUYÊN VĂN điều
// kiện của đề bài §6, để người viết thân không phải đi tra lại, và để đọc
// `npm test` là thấy ngay còn nợ gì.

import { describe, it } from "vitest";

describe("T-1 — Tắt AI, trọn nhóm 1 vẫn chạy", () => {
  it.todo("tạo được Công ty, Người liên hệ, Cơ hội");
  it.todo("kéo Cơ hội qua ba giai đoạn, trong đó có Đủ điều kiện");
  it.todo("bỏ qua hai ô dấu hiệu vẫn kéo được, và Cơ hội mang cờ cảnh báo");
  it.todo("ghi được Hoạt động");
  it.todo("tìm kiếm và lọc chạy, các bộ lọc kết hợp được");
  it.todo("mở được màn hình tổng quan");
  it.todo("không chức năng nào của nhóm 1 hỏng");
});
