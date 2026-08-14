// T-3 — Bấm Phát hiện mở đúng đoạn văn gốc
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

describe("T-3 — Bấm Phát hiện mở đúng đoạn văn gốc", () => {
  it.todo("mở Bản lưu, cuộn tới vị trí, ĐÁNH DẤU khoảng câu trích");
  it.todo("vị trí lấy từ `quote_start`/`quote_end` đã lưu, không tính lại ở giao diện");
});
