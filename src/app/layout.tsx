// `S0` · `AD-UI-4` · `AD-UI-5` · `AD-UI-10` — khung ứng dụng.
//
// ⚠ KHÔNG dùng `next/font/google`.
//
// Scaffold mặc định nhập `Geist` từ Google Fonts, và `next build` khi đó cần
// MẠNG để tải webfont. `§7` nghiệm thu trên **clone sạch**, và mục Deferred của
// spine cha đã nêu rủi ro chạy offline. Bỏ một phụ thuộc mạng ở đúng cổng nộp
// bài rẻ hơn nhiều so với gỡ lỗi build đỏ lúc 9:30 sáng.
//
// Phông lấy từ hệ thống. Máy demo là Windows, và bảng `cmap` của phông hệ thống
// đã được kiểm là đủ glyph tiếng Việt dựng sẵn.
//
// ⚠ Đây là server component `async` — `AD-UI-5` cho `layout.tsx` gọi
// `loadCapability()`, và nó là chỗ DUY NHẤT của khung đọc cờ AI (`FR-46`).
// Nó đọc cookie qua `currentSession()`, nên trang render ĐỘNG mỗi lượt yêu
// cầu — điều kiện mà `T-9` treo vào (`AD-UI-5`, luật *không render tĩnh*).

import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Providers } from "./providers";
import { AiOffBanner } from "./_ai-banner";
import { appRegistry } from "./_registry";
import { currentSession } from "./_session";

export const metadata: Metadata = {
  title: "Why Now — CRM AI-Native",
  description:
    "Phát hiện tín hiệu từ tin tức, neo bằng câu trích, và để người quyết. " +
    "Máy đề nghị; người duyệt.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const shell = await readShell();

  return (
    <html lang="vi">
      <body>
        {/* `AD-UI-4` — registry Griffel bọc quanh PHẦN THÂN, không bọc `html`. */}
        <Providers>
          <div className="shell">
            <header className="masthead">
              <span className="masthead-brand">Why Now</span>
              <nav className="masthead-nav">
                <Link href="/">Tổng quan</Link>
                <Link href="/accounts">Công ty</Link>
                <Link href="/board">Bảng giai đoạn</Link>
                {/* Lối vào `S2`. ⚠ KHÔNG mang số đang chờ, và đó là một quyết
                    định chứ không phải một thiếu sót. `EXPERIENCE.md` (*Mẫu
                    thành phần*, hàng **Dấu hiệu có Suggestion chờ**) đòi dấu
                    hiệu **kèm số đang chờ**, nhưng đòi nó trên **dòng Account ở
                    `S1`, `S3`, `S6`** — không trên khung. Ở đây chỉ là một lối
                    đi, không phải cái dấu hiệu ấy.
                    Ba bề mặt kia chưa có số vì đếm Gợi ý chờ toàn hệ thống chưa
                    có capability nào phơi ra; quét từng Công ty trong khung là
                    N+1 lượt đọc trên MỌI trang, kể cả `/login`. Cả hai khoản nợ
                    ghi ở `_bmad-output/implementation-artifacts/deferred-work.md`. */}
                <Link href="/suggestions">Hàng đợi gợi ý</Link>
                {/* `EXPERIENCE.md` — mục chỉ-Quản-trị ẩn với Sales. Ẩn menu là
                    THẨM MỸ; chặn thật nằm ở bước ⑤ của Cổng (`AD-UI-10`,
                    `D28`), nên vào thẳng địa chỉ vẫn bị từ chối. */}
                {shell.role === "admin" ? <Link href="/admin">Quản trị</Link> : null}
              </nav>
              <span className="masthead-who">
                {shell.who}
                {" · "}
                <Link href="/login">đổi tài khoản</Link>
              </span>
            </header>

            {/* `FR-46` · `T-9` — dải báo hiện với **Sales**, không chỉ với Quản
                trị, và không im lặng biến mất. Lá client theo bảng loại bề mặt
                của `AD-UI-5` (*"khung: layout đọc cờ AI, dải báo là lá
                client"*). */}
            <AiOffBanner aiEnabled={shell.aiEnabled} />

            <main className="main">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}

/// Hai lượt đọc của khung, gom vào một chỗ để `RootLayout` đọc được thành một
/// câu. Hỏng thì khung vẫn dựng: `AD-UI-8` bắt một khối hỏng KHÔNG được đổ cả
/// trang, và khung là khối mà cả 12 bề mặt treo vào — nó hỏng thì không bề mặt
/// nào còn lối vào.
///
/// ⚠ Không nuốt lỗi im lặng: khi đọc hỏng, khung nói *chưa đọc được* thay vì
/// khẳng định phần AI đang bật — khẳng định sai ở đây làm `T-9` xanh giả.
async function readShell(): Promise<{
  who: string;
  role: string | null;
  aiEnabled: boolean | null;
}> {
  try {
    const session = await currentSession();
    const read = await appRegistry.loadCapability("readAiEnabled", session.actor);
    const { aiEnabled } = (await read({})) as { aiEnabled: boolean };
    const roleLabel = session.user.role === "admin" ? "Quản trị" : "Sales";
    return {
      who: `${session.user.displayName} · ${roleLabel}`,
      role: session.user.role,
      aiEnabled,
    };
  } catch {
    return { who: "chưa có phiên", role: null, aiEnabled: null };
  }
}
