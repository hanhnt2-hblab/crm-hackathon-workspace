// `AD-UI-1` · `AD-12` · `AD-1` (composition root, nhánh máy)
//
// ⚠ KHUNG RỖNG, dựng 14/08 để `next build` phân giải được lời nhập động của
// `instrumentation.ts`. Turbopack phân giải `await import()` LÚC BUILD — nhập
// động chỉ tránh việc *nạp* trong edge runtime, không tránh việc *phân giải*.
// Thiếu tệp này là build đỏ, không phải chạy đỏ.
//
// Sáng 15/08 điền vào đây, theo đúng thứ tự:
//
//   1. `createRegistry({ seedMode: false, auditSink })` — MỘT thể hiện mức
//      module cho cả nhánh máy. Không nhánh nào chia sổ đăng ký với nhánh
//      khác (`AD-1`).
//   2. Dọn khoá mang `process_id` cũ của chính tiến trình này (`AD-12`).
//   3. Đặt lịch theo `scan_interval_minutes` — env là giá trị khởi tạo,
//      bảng `settings` ghi đè lúc chạy (`AD-15`).
//   4. Trao sổ đăng ký cho `src/scan/loop.ts`.
//   5. Xử lý tín hiệu dừng: nhả khoá qua `releaseAccountLock` — nó mang cờ
//      `selfLimiting` nên chạy được cả khi trần đã chạm (`AD-4`).
//
// KHÔNG đặt gì trong `instrumentation.ts`: tệp đó lint theo thư mục không với
// tới và `tests/` không nạp được nếu nó khởi động luôn vòng lặp.

export {};

if (process.env.NODE_ENV !== "test") {
  console.log("[scan] bootstrap chưa cài — xem AD-UI-1");
}
