// T-7 — Hoàn tác một cú bấm
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

describe("T-7 — Hoàn tác một cú bấm", () => {
  it.todo("bấm Hoàn tác ở `T-6`, MỘT cú bấm");
  it.todo("giá trị cũ trở lại đúng nguyên trạng");
  it.todo("có bản ghi cho CẢ lần tự đặt LẪN lần hoàn tác");
  it.todo("bấm lần hai là no-op, không sinh dòng vết thứ hai");
});
