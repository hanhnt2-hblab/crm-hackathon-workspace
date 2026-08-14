import type { Metadata } from "next";
import "./globals.css";

// ⚠ KHÔNG dùng `next/font/google`.
//
// Scaffold mặc định nhập `Geist` từ Google Fonts, và `next build` khi đó cần
// MẠNG để tải webfont. `§7` nghiệm thu trên **clone sạch**, và mục Deferred của
// spine cha đã nêu rủi ro chạy offline. Bỏ một phụ thuộc mạng ở đúng cổng nộp
// bài rẻ hơn nhiều so với gỡ lỗi build đỏ lúc 9:30 sáng.
//
// Phông lấy từ hệ thống. Máy demo là Windows, và bảng `cmap` của phông hệ thống
// đã được kiểm là đủ glyph tiếng Việt dựng sẵn.

export const metadata: Metadata = {
  title: "Why Now — CRM AI-Native",
  description:
    "Phát hiện tín hiệu từ tin tức, neo bằng câu trích, và để người quyết. " +
    "Máy đề nghị; người duyệt.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
