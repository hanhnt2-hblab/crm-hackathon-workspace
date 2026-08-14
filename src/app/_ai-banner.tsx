"use client";

// `S0` · `FR-46` · `T-9` — dải báo *phần AI đang tắt*.
//
// `EXPERIENCE.md` (*Mẫu thành phần*): hiện với **Sales**, không chỉ với Quản
// trị, và **không im lặng biến mất**. Nên ở đây không có nút đóng: một dải
// đóng được là một dải Sales sẽ đóng ngay lần đầu rồi không bao giờ thấy nữa,
// và `T-9` kiểm đúng việc Sales *thấy* dòng đó.
//
// Lá client theo bảng loại bề mặt của `AD-UI-5`. Nó không đọc gì — cờ đi xuống
// bằng prop đã tuần tự hoá từ `layout.tsx`.

export function AiOffBanner({ aiEnabled }: { aiEnabled: boolean | null }) {
  // `null` = chưa đọc được cờ. `AD-UI-8`: một khối hỏng thì khối đó báo lỗi,
  // các khối khác vẫn chạy — và khẳng định *"AI đang bật"* lúc chưa biết là
  // đúng thứ làm `T-9` xanh giả.
  if (aiEnabled === null) {
    return (
      <div className="banner" role="status">
        <span>Chưa đọc được trạng thái phần gợi ý. Các việc làm tay vẫn chạy.</span>
      </div>
    );
  }

  if (aiEnabled) return null;

  return (
    <div className="banner" role="status">
      <strong>Phần gợi ý đang tắt.</strong>
      <span>
        Việc đến hạn, hồ sơ và bảng giai đoạn vẫn chạy đủ; hệ thống chỉ ngừng
        sinh gợi ý mới. Quản trị bật lại ở màn hình Quản trị.
      </span>
    </div>
  );
}
