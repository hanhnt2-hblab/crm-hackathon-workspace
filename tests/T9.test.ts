// T-9 — Tắt AI giữa lúc vòng quét đang chạy
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

describe("T-9 — Tắt AI giữa lúc vòng quét đang chạy", () => {
  it.todo("bấm nút tắt TRONG LÚC vòng quét đang chạy");
  it.todo("hai chu kỳ kế tiếp: không thêm mục Dòng thời gian");
  it.todo("hai chu kỳ kế tiếp: không sinh Gợi ý");
  it.todo("hai chu kỳ kế tiếp: không tự đặt Việc tiếp theo");
  it.todo("dữ liệu ĐÃ SINH còn nguyên");
  it.todo("Sales thấy dòng thông báo đang tắt");
  it.todo("bật lại thì vòng quét chạy tiếp");
  it.todo("CẢ HAI lần bấm đều có ghi vết");
});
