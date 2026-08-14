// T-2 — Phát hiện thiếu câu trích không lưu được
//
// `D36`: `T-n` là lớp NGOÀI, mỗi `T` một `Feature` nhiều `Scenario`. Phần phân
// hoạch tương đương và giá trị biên nằm ở lớp kiểm trường nhập liệu bên dưới,
// KHÔNG trộn vào đây.
//
// Cục sở hữu thân: ⑤ — theo quy tắc *mắt xích cuối*: cục mà khi xong thì
// phép kiểm này chuyển xanh. Mốc: M1.
//
// ⚠ Thân là `it.todo` có chủ đích (`C0-9`). Chuỗi mô tả giữ NGUYÊN VĂN điều
// kiện của đề bài §6, để người viết thân không phải đi tra lại, và để đọc
// `npm test` là thấy ngay còn nợ gì.

import { describe, it } from "vitest";

describe("T-2 — Phát hiện thiếu câu trích không lưu được", () => {
  it.todo("ghi THẲNG qua lõi, không qua giao diện, vẫn bị từ chối bằng `BR-D1`");
  it.todo("câu trích không khớp nguyên văn Bản lưu thì loại và ghi nhật ký (`BR-D2`)");
});
