"use client";

// `AD-UI-6` · `AD-UI-8` — ranh giới lỗi mức trang.
//
// `action()` bắt ba loại lỗi MONG ĐỢI và trả chúng thành `ActionState`; lỗi
// **bất ngờ** thì nó ném tiếp, *"và khi đó nó đúng là việc của error boundary"*.
// Tệp này là error boundary đó.
//
// ⚠ Next **nuốt** thông điệp của lỗi chưa bắt ở bản production và chỉ để lại
// `digest`. Nên màn này không cố hiện thông điệp gốc — nó hiện `digest` để đối
// chiếu với nhật ký máy chủ, và một câu nói **việc phải làm**
// (`EXPERIENCE.md`, *Giọng chữ*).
//
// Câu về `npm run seed` không phải phỏng đoán: `currentSession()` ném đúng khi
// bảng `user` rỗng, và đó là cách hỏng thường gặp nhất trên một clone sạch —
// người chạy `npm start` trước khi gieo dữ liệu.

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="card">
      <h1 className="card-title">Chưa mở được màn hình này</h1>
      <p className="failed" role="alert">
        Có một lỗi ngoài dự tính. Các màn hình khác vẫn dùng được — bấm{" "}
        <em>Thử lại</em>, hoặc quay về Tổng quan.
      </p>
      <p className="field-note">
        Nếu đây là lần chạy đầu trên máy mới: cơ sở dữ liệu có thể chưa có tài
        khoản nào. Chạy <code>npm run seed</code> rồi tải lại trang.
      </p>
      {error.digest ? (
        <p className="muted">Mã đối chiếu nhật ký: {error.digest}</p>
      ) : null}
      <div className="form-actions">
        <button type="button" onClick={reset}>
          Thử lại
        </button>
      </div>
    </section>
  );
}
