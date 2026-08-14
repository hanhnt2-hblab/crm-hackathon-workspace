// T-10a — Lõi từ chối thao tác dưới danh nghĩa hệ thống
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

describe("T-10a — Lõi từ chối thao tác dưới danh nghĩa hệ thống", () => {
  it.todo("đổi Giai đoạn dưới danh nghĩa hệ thống bị từ chối (`NFR-14`)");
  it.todo("đổi giá trị tiền dưới danh nghĩa hệ thống bị từ chối (`NFR-15`)");
  it.todo("xoá một Công ty dưới danh nghĩa hệ thống bị từ chối (`NFR-17`)");
  it.todo("sửa mục Dòng thời gian người tạo bị từ chối (`NFR-19`)");
  it.todo("cả bốn gọi THẲNG lõi, KHÔNG qua giao diện");
});
