// `S11` Login · `FR-49` · `AD-UI-5` (*ngoài phiên*) · `AD-UI-10`.
//
// Bề mặt duy nhất chạy KHI CHƯA CÓ PHIÊN, nên nó gọi capability bằng
// `actor: { kind: "system" }` — lối ra duy nhất của bài toán con gà quả trứng,
// và `readLoginCandidates` mang `selfLimiting: true` nên nó vẫn chạy sau khi
// Quản trị bấm phanh.
//
// ⚠ Không có mật khẩu, và đó là phạm vi chứ không phải sơ suất: `TR-2` gieo
// tài khoản, đề bài không có màn quản lý người dùng, và `§6` chỉ phân biệt hai
// vai. Màn này đổi VAI đang dùng để thử `D43`/`S8`, không phải một cơ chế xác
// thực. Nói ra vì im lặng ở đây đọc thành *"đã có xác thực"*.

import { Suspense } from "react";
import { Block } from "../_block";
import { appRegistry } from "../_registry";
import type { LoginCandidate } from "../_types";
import { LoginForm } from "./_login-form";

/// `AD-UI-5`, luật *không bề mặt nào được render tĩnh*.
///
/// Mọi bề mặt khác thoả luật này **miễn phí**, vì `currentSession()` đọc cookie
/// và đọc cookie ép Next render động. `S11` là ngoại lệ duy nhất: nó chạy khi
/// CHƯA có phiên nên không đọc cookie nào, và Next sẽ prerender nó lúc `next
/// build` — tức chạy một lời gọi capability, tức cần cơ sở dữ liệu, **lúc dựng**.
/// Đã đo: build đỏ ngay ở bước prerender. Khai tường minh ở đây.
export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <>
      <div className="row">
        <h1 className="page-title">Chọn tài khoản</h1>
      </div>
      <Block title="Tài khoản">
        <Suspense fallback={<p className="muted">Đang đọc danh sách tài khoản…</p>}>
          <CandidatesBlock />
        </Suspense>
      </Block>
    </>
  );
}

async function CandidatesBlock() {
  const read = await appRegistry.loadCapability("readLoginCandidates", {
    kind: "system",
  });
  const candidates = (await read({})) as LoginCandidate[];

  return (
    <section className="card">
      {candidates.length === 0 ? (
        <p className="empty">
          Chưa có tài khoản nào trong cơ sở dữ liệu. Chạy <code>npm run seed</code>{" "}
          rồi tải lại trang.
        </p>
      ) : (
        <LoginForm candidates={candidates} />
      )}
    </section>
  );
}
