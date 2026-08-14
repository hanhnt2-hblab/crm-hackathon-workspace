// `AD-UI-1` · `AD-12` · `AD-15`
//
// Tệp này làm ĐÚNG BA VIỆC và không có việc thứ tư. Mọi thứ khác — chu kỳ,
// lịch, khôi phục khoá cũ, xử lý tín hiệu dừng — sống ở `src/scan/bootstrap.ts`,
// nơi lint theo thư mục và `tests/` với tới được.
//
// Hai luật dễ vi phạm, cả hai đều hỏng im lặng:
//
// · Lời nhập phải ĐỘNG. Import tĩnh nạp cả cây `src/scan → src/capability →
//   src/core/db.ts → @prisma/client` trong **edge runtime**, TRƯỚC khi dòng
//   chặn kịp chạy. Cờ chặn khi đó chỉ ngăn việc *khởi động*, không ngăn việc
//   *nạp* — và Prisma không chạy được trên edge runtime.
//
// · Đây là một trong ĐÚNG BA tệp toàn repo được đọc `process.env` (`AD-15`),
//   và nó đọc **đúng một biến**: `NEXT_RUNTIME`. Nó phải đọc trực tiếp vì nó
//   chạy trước khi mọi module của đội được nạp, kể cả `src/config.ts`.

let started = false;

export async function register() {
  // ① chặn runtime
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  // ② cờ singleton mức module — hot-reload lúc phát triển đánh giá lại module
  //    và sẽ sinh HAI vòng quét song song nếu thiếu dòng này (`AD-12`)
  if (started) return;
  started = true;

  // ③ nhập động, và chỉ nhập một thứ
  await import("./src/scan/bootstrap");
}
