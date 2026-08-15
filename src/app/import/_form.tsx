"use client";

// Luật thi `3.1` — lá `'use client'` (`AD-UI-5`): nhận props tuần tự hoá, ghi
// qua server action, không gọi `loadCapability`.

import { useActionState } from "react";
import { Button, Field } from "@fluentui/react-components";
import { IDLE } from "../_contract";
import { ActionMessage } from "../_action-state";
import { importZipAction } from "./actions";

export function ImportForm() {
  const [state, formAction, pending] = useActionState(importZipAction, IDLE);

  return (
    <form action={formAction} className="form">
      <Field label="Tệp zip do Ban tổ chức phát" required>
        {/* `<input type="file">` thuần, KHÔNG bọc bằng Fluent: `FormData` cần
            đúng phần tử này để mang tệp qua server action, và một bọc ngoài có
            thể không chuyển tiếp `name`. */}
        <input type="file" name="dataset" accept=".zip,application/zip" required />
      </Field>
      <Button appearance="primary" type="submit" disabled={pending}>
        {pending ? "Đang nạp…" : "Nạp dữ liệu"}
      </Button>
      <ActionMessage state={state} />
      <p className="field-note">
        Nạp lại cùng một tệp thì dữ liệu <strong>về đúng trạng thái ban đầu</strong> —
        mọi Phát hiện, Gợi ý và Việc tiếp theo do lượt diễn trước sinh ra đều bị
        xoá, để diễn lại kịch bản từ đầu. Dữ liệu bạn nhập tay ngoài bộ này
        không bị đụng tới.
      </p>
    </form>
  );
}
