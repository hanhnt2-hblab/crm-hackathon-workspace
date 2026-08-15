"use client";

// `S11` — ba lá chọn tài khoản. `AD-UI-5`: nhận props đã tuần tự hoá, ghi qua
// server action, không đọc gì.
//
// Luật thi `3.2` (15/08) đòi **nút vào thẳng cho từng user** và giữ **đường mật
// khẩu**. Ba khối dưới đây, theo đúng thứ tự người dùng cần chúng:
//   ① `DemoLoginButtons`  — một nút cho mỗi tài khoản, bấm là vào ngay (vế ①)
//   ② `PasswordLoginForm` — chọn tài khoản + gõ mật khẩu (vế ②)
//   ③ `LoginForm`         — nhóm radio cũ, GIỮ NGUYÊN
//
// ⚠ VÌ SAO GIỮ CẢ KHỐI ③ THAY VÌ THAY NÓ BẰNG ①.
// `e2e/T1.spec.ts` bấm đích danh ba thứ: tiêu đề *Chọn tài khoản*, một `radio`
// mang nhãn `displayName · vai · email`, và nút *Dùng tài khoản này*. Thay khối
// ③ là `T-1` đỏ, mà `T-1` là điểm nghiệm thu nặng nhất của §6. Nên đây là THÊM,
// không phải sửa.
//
// ⚠ VÌ SAO KHỐI ② DÙNG `<Select>` CHỨ KHÔNG DÙNG RADIO.
// Một nhóm radio thứ hai mang cùng nhãn làm locator `getByRole("radio", …)` của
// `e2e/T1.spec.ts:139` khớp HAI phần tử, và Playwright ném `strict mode
// violation` — một phép kiểm đỏ vì hình dạng DOM, với thông điệp không trỏ về
// đây chút nào. `<option>` mang vai `option`, không phải `radio`.

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Field, Input, Radio, RadioGroup, Select } from "@fluentui/react-components";
import { IDLE } from "../_contract";
import { ActionMessage, SubmitButton } from "../_action-state";
import type { LoginCandidate } from "../_types";
import { signInAction, signInWithPasswordAction } from "./actions";

/// Chữ hiển thị của vai. Đúng hai giá trị (`src/core/actor.ts`), nên một hàm
/// nhỏ ở đây tốt hơn ba lần lặp cùng một biểu thức ba ngôi.
function nhanVai(role: string): string {
  return role === "admin" ? "Quản trị" : "Sales";
}

/// Luật thi `3.2` vế ① — **một nút cho mỗi tài khoản, bấm là vào ngay**.
///
/// N biểu mẫu nhỏ, MỘT `useActionState`. React 19 cho nhiều `<form>` dùng chung
/// một `formAction`, nên vẫn chỉ có một thông báo kết quả trên trang.
///
/// ⚠ `userId` đi bằng một ô ẩn, KHÔNG bằng `name`/`value` trên nút bấm. Cách
/// dùng nút tuy gọn hơn (một biểu mẫu, N nút) nhưng phụ thuộc vào việc
/// `<Button>` của Fluent có chuyển tiếp hai thuộc tính đó xuống thẻ `<button>`
/// thật hay không — một điều không nằm trong hợp đồng công khai của nó, và nếu
/// nó không chuyển thì `userId` rỗng, `readUserForAuth` trả `null`, và triệu
/// chứng là *"bấm nút không có gì xảy ra"* ngay giữa buổi chấm. Ô ẩn là HTML
/// trần, luôn có trong `FormData`.
///
/// ⚠ Thẻ bọc ngoài là `<div>`, không phải `<form>`: HTML cấm biểu mẫu lồng nhau,
/// và trình duyệt sẽ lặng lẽ gỡ biểu mẫu con thay vì báo lỗi.
export function DemoLoginButtons({ candidates }: { candidates: LoginCandidate[] }) {
  const [state, formAction] = useActionState(signInAction, IDLE);
  useVaoThangSauKhiDangNhap(state.ok && state.message !== undefined);

  return (
    <div className="form">
      <div className="form-actions">
        {candidates.map((c) => (
          <form key={c.id} action={formAction}>
            <input type="hidden" name="userId" value={c.id} />
            <Button type="submit" appearance="primary">
              {`Vào thẳng · ${c.displayName} (${nhanVai(c.role)})`}
            </Button>
          </form>
        ))}
      </div>
      <div className="form-actions">
        <ActionMessage state={state} />
      </div>
      <p className="field-note">
        Không cần mật khẩu — bấm một tên là dùng ngay tài khoản đó.
      </p>
    </div>
  );
}

/// Luật thi `3.2` vế ② — **đăng nhập bằng mật khẩu**, giữ nguyên theo `§7.3`.
///
/// ⚠ `autoComplete="current-password"` chứ không `"off"`: trình duyệt bỏ qua
/// `"off"` trên ô mật khẩu từ lâu, và khai đúng ý định giúp trình quản lý mật
/// khẩu không tự điền nhầm ô này bằng một mật khẩu của trang khác.
export function PasswordLoginForm({ candidates }: { candidates: LoginCandidate[] }) {
  const [state, formAction] = useActionState(signInWithPasswordAction, IDLE);
  // Đường mật khẩu chuyển trang cùng cách với đường vào thẳng: `moPhien` dùng
  // chung, nên thiếu chỗ này thì đăng nhập đúng mật khẩu cũng đứng nguyên
  // `/login` — cùng triệu chứng, cùng chẩn đoán sai.
  useVaoThangSauKhiDangNhap(state.ok && state.message !== undefined);

  return (
    <form action={formAction} className="form">
      <div className="form-grid">
        <Field label="Tài khoản" required>
          <Select name="userId" defaultValue={candidates[0]?.id}>
            {candidates.map((c) => (
              <option key={c.id} value={c.id}>
                {`${c.displayName} · ${nhanVai(c.role)} · ${c.email}`}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Mật khẩu" required>
          <Input
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </Field>
      </div>
      <div className="form-actions">
        <SubmitButton appearance="secondary">Đăng nhập bằng mật khẩu</SubmitButton>
        <ActionMessage state={state} />
      </div>
    </form>
  );
}

export function LoginForm({ candidates }: { candidates: LoginCandidate[] }) {
  const [state, formAction] = useActionState(signInAction, IDLE);

  return (
    <form action={formAction} className="form">
      <RadioGroup name="userId" defaultValue={candidates[0]?.id}>
        {candidates.map((c) => (
          <Radio
            key={c.id}
            value={c.id}
            label={`${c.displayName} · ${c.role === "admin" ? "Quản trị" : "Sales"} · ${c.email}`}
          />
        ))}
      </RadioGroup>
      <div className="form-actions">
        <SubmitButton>Dùng tài khoản này</SubmitButton>
        <ActionMessage state={state} />
      </div>
      <p className="field-note">
        Vai đọc sống từ cơ sở dữ liệu mỗi lượt yêu cầu — phiên chỉ giữ mã tài
        khoản, nên gieo lại dữ liệu là vai đổi theo ngay.
      </p>
    </form>
  );
}

/// ⚠ CHUYỂN TRANG SAU KHI MỞ PHIÊN — và thiếu nó thì nút *"vào thẳng"* của luật
/// thi `3.2` không làm đúng chữ *"chọn user là đăng nhập ngay"*.
///
/// `moPhien` đặt cookie rồi trả một `ActionState` mang câu *"Đang dùng tài khoản
/// X"*. Cookie ĐÃ được đặt, nên mọi trang khác đều vào được — nhưng màn hình
/// vẫn là `/login`, và người chấm bấm xong thấy mình còn đứng nguyên chỗ cũ thì
/// kết luận nút hỏng. Đã đo bằng trình duyệt thật: bấm xong, URL vẫn là
/// `/login`.
///
/// Chuyển ở lá client chứ không `redirect()` trong action: helper `action()` của
/// `_contract.ts` bọc thân bằng `try/catch`, mà `redirect()` của Next hoạt động
/// BẰNG CÁCH NÉM một lỗi đặc biệt — nó sẽ bị nuốt, và triệu chứng lại là *"bấm
/// không có gì xảy ra"*, lần này khó chẩn đoán hơn.
///
/// `router.refresh()` trước khi đi: `layout.tsx` đọc phiên ở phía máy chủ, và
/// không làm mới thì trang đích render bằng bộ đệm của lượt CHƯA có phiên.
/// ⚠ ĐIỀU KIỆN LÀ `ok && có message`, KHÔNG phải `ok` một mình. `IDLE` của
/// `_contract.ts` là `{ ok: true }` — trạng thái TRƯỚC KHI ai bấm gì cũng mang
/// `ok: true`. Chỉ đọc `ok` thì hook chạy ngay lúc tải trang và đá người dùng
/// khỏi `/login` trước khi họ kịp chọn tài khoản; màn hình đăng nhập trở thành
/// một chỗ không vào được. `message` chỉ có sau một lượt action thật.
function useVaoThangSauKhiDangNhap(thanhCong: boolean): void {
  const router = useRouter();
  useEffect(() => {
    if (!thanhCong) return;
    router.refresh();
    router.push("/");
  }, [thanhCong, router]);
}
