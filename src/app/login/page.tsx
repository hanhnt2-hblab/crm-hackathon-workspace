// `S11` Login · `FR-49` · `AD-UI-5` (*ngoài phiên*) · `AD-UI-10` · luật thi `3.2`.
//
// Bề mặt duy nhất chạy KHI CHƯA CÓ PHIÊN, nên nó gọi capability bằng
// `actor: { kind: "system" }` — lối ra duy nhất của bài toán con gà quả trứng,
// và `readLoginCandidates` mang `selfLimiting: true` nên nó vẫn chạy sau khi
// Quản trị bấm phanh.
//
// ⚠ BẢN TRƯỚC CỦA KHỐI NÀY VIẾT *"không có mật khẩu, và đó là phạm vi chứ không
// phải sơ suất"*. Câu đó ĐÚNG cho tới 14/08 và SAI từ 15/08: luật thi bổ sung
// `3.2` đòi **nút vào thẳng cho từng user Sales** *và* **giữ đường đăng nhập
// bằng mật khẩu** theo `§7.3`. Màn này nay có cả hai, nên câu cũ đã được gỡ —
// để lại một lời giải thích mâu thuẫn với mã còn tệ hơn không có lời nào.
//
// Vế mật khẩu dừng ở đâu, nói rõ để không ai đọc quá: không có màn quản lý tài
// khoản (`§6`), không đặt lại mật khẩu, không khoá sau N lần sai. Mọi tài khoản
// dùng chung một mật khẩu mặc định mà luật thi công bố; băm của nó nằm ở
// `src/capability/caps/auth-ui.ts` và ở mặc định của cột `user.password_hash`.

import { Suspense } from "react";
import { Block } from "../_block";
import { appRegistry } from "../_registry";
import type { LoginCandidate } from "../_types";
import { DemoLoginButtons, LoginForm, PasswordLoginForm } from "./_login-form";

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

  // ⚠ TRẠNG THÁI RỖNG PHẢI NÓI ĐƯỢC *"làm gì tiếp"*. Tài khoản trong bản này
  // KHÔNG được tạo bằng tay ở bất kỳ màn hình nào (`§6`) — chúng sinh ra từ
  // lệnh nạp dữ liệu. Một màn trắng ở đây làm giám khảo tưởng sản phẩm hỏng,
  // trong khi thứ thiếu chỉ là một lệnh chưa chạy.
  if (candidates.length === 0) {
    return (
      <section className="card">
        <p className="empty">
          Chưa có tài khoản nào trong cơ sở dữ liệu. Chạy <code>npm run seed</code>{" "}
          rồi tải lại trang.
        </p>
        <p className="field-note">
          Tài khoản không tạo được bằng tay ở màn hình nào — chúng sinh ra khi
          nạp dữ liệu. Nạp xong mà vẫn trống thì lệnh nạp chưa chạy tới bảng tài
          khoản, không phải màn hình này hỏng.
        </p>
      </section>
    );
  }

  return (
    <>
      {/* ① Luật thi `3.2` — vào thẳng, không cần mật khẩu. Đặt TRÊN CÙNG vì đây
          là đường mà người chấm dùng, và thứ tự trên trang là thứ tự ưu tiên. */}
      <section className="card">
        <h2 className="card-title">Vào thẳng</h2>
        <DemoLoginButtons candidates={candidates} />
      </section>

      {/* ② `§7.3` — đăng nhập thật bằng mật khẩu, giữ nguyên. */}
      <section className="card">
        <h2 className="card-title">Đăng nhập bằng mật khẩu</h2>
        <PasswordLoginForm candidates={candidates} />
      </section>

      {/* ③ Nhóm radio cũ. GIỮ NGUYÊN — `e2e/T1.spec.ts` bấm đúng khối này. */}
      <section className="card">
        <LoginForm candidates={candidates} />
      </section>
    </>
  );
}
