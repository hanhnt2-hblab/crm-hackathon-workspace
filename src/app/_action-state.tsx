"use client";

// `AD-UI-6` — LÁ HIỂN THỊ DÙNG CHUNG cho `ActionState`.
//
// `ActionState` khai đúng một lần ở `_contract.ts`, nên lá đọc nó cũng chỉ cần
// một. Đây chính là chỗ mà luật *"không tệp nào khác khai lại `ActionState`"*
// trả cổ tức: nếu hai bề mặt khai hai union hơi khác nhau, lá này không nhận
// nổi cả hai — và cái sai lộ ra ở đây, muộn.
//
// ⚠ Lá này KHÔNG dựng chữ từ `code`. Chữ đã được `_errors.ts` dựng ở server
// (`AD-UI-7`, chặng 2); dựng lại ở client là bảng thứ hai, và bảng thứ hai là
// chỗ ba người viết ba câu tiếng Việt cho cùng một mã.

import { useFormStatus } from "react-dom";
import { Button, Spinner } from "@fluentui/react-components";
import type { ActionState } from "./_contract";

export function ActionMessage({ state }: { state: ActionState }) {
  if (state.ok) {
    if (!state.message) return null;
    return (
      <p className="ok-note" role="status">
        {state.message}
      </p>
    );
  }
  return (
    <p className="failed" role="alert">
      {state.message}
    </p>
  );
}

/// `UX-4` — mọi thao tác người bấm có phản hồi thị giác ≤ 200 ms, và việc lâu
/// hơn 1 giây phải hiện trạng thái đang chạy. `useFormStatus` cho cả hai mà
/// không cần một biến trạng thái nào ở bề mặt.
export function SubmitButton({
  children,
  appearance = "primary",
}: {
  children: React.ReactNode;
  appearance?: "primary" | "secondary";
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      appearance={appearance}
      disabled={pending}
      icon={pending ? <Spinner size="tiny" /> : undefined}
    >
      {children}
    </Button>
  );
}
