// T-10b — Sổ đăng ký chứng minh bằng VẮNG MẶT
//
// `D36`: `T-n` là lớp NGOÀI, mỗi `T` một `Feature` nhiều `Scenario`. Phần phân
// hoạch tương đương và giá trị biên nằm ở lớp kiểm trường nhập liệu bên dưới,
// KHÔNG trộn vào đây.
//
// Cục sở hữu thân: ④ — theo quy tắc *mắt xích cuối*: cục mà khi xong thì
// phép kiểm này chuyển xanh. Mốc: M1.
//
// ⚠ Thân là `it.todo` có chủ đích (`C0-9`). Chuỗi mô tả giữ NGUYÊN VĂN điều
// kiện của đề bài §6, để người viết thân không phải đi tra lại, và để đọc
// `npm test` là thấy ngay còn nợ gì.

import { describe, it } from "vitest";

describe("T-10b — Sổ đăng ký chứng minh bằng VẮNG MẶT", () => {
  it.todo("rà trọn sổ: không mục nào xoá dữ liệu người tạo (`NFR-17`)");
  it.todo("rà trọn sổ: không mục nào sửa mục Dòng thời gian người tạo (`NFR-19`)");
  it.todo("rà trọn sổ: không mục nào gửi thư, tin nhắn hay webhook (`NFR-16`)");
  it.todo("một lệnh gọi mô hình VẪN QUA ĐƯỢC (`F38` — chặn oan là hỏng cả nhóm 2)");
  it.todo("khẳng định trên DANH SÁCH TRẮNG tên hàm lõi, không chỉ trên tên tự khai");
});
