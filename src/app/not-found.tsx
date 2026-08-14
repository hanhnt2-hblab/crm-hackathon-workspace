// `S3` gọi `notFound()` khi Công ty không còn (đã xoá mềm theo `D26`, hoặc
// liên kết cũ). Màn này là thứ người dùng thấy khi đó.
//
// `EXPERIENCE.md` (*Giọng chữ*) — nói **việc phải làm**, không nói mã lỗi:
// *"Bản ghi này không còn"* cộng một lối đi tiếp, không phải *"404 Not Found"*.

import Link from "next/link";

export default function NotFound() {
  return (
    <section className="card">
      <h1 className="card-title">Không tìm thấy bản ghi này</h1>
      <p>
        Công ty hoặc trang bạn mở không còn nữa — có thể nó đã bị xoá, hoặc liên
        kết đã cũ.
      </p>
      <div className="row">
        <Link href="/accounts">Về danh sách công ty</Link>
        <Link href="/">Về tổng quan</Link>
      </div>
    </section>
  );
}
