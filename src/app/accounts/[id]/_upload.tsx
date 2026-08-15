"use client";

// `U8` — hàng tải tài liệu, nằm TRONG khối `Phát hiện` của `S3`.
//
// ⚠ Lá này KHÔNG gọi `loadCapability` (`AD-UI-5`). Nó chỉ gửi một `FormData`
// tới server action; mọi quyết định nằm ở đó.
//
// ⚠ Dùng `<form action={...}>` của React 19 chứ không `onSubmit` + `fetch`:
// hình thức này giữ được `useFormStatus` cho `SubmitButton` (`UX-4`), và khi
// JavaScript chưa kịp nạp thì biểu mẫu vẫn gửi được — `UX-6` đòi thao tác ghi
// không làm trang trắng.

import { useActionState } from "react";
import { Field } from "@fluentui/react-components";
import { ActionMessage, SubmitButton } from "../../_action-state";
import { IDLE } from "../../_contract";
import { uploadDocumentAction } from "./_upload-actions";

export function UploadRow({ accountId }: { accountId: string }) {
  const [state, formAction] = useActionState(uploadDocumentAction, IDLE);

  return (
    <div
      style={{
        // Kẻ tóc ngăn với danh sách Phát hiện bên dưới. Dùng biến của
        // `globals.css`, không chế màu mới (`DESIGN.md`).
        borderBottom: "1px solid var(--rule)",
        paddingBottom: 12,
        marginBottom: 12,
      }}
    >
      <form action={formAction}>
        <input type="hidden" name="accountId" value={accountId} />
        <div className="row">
          <Field label="Tải tài liệu">
            {/* `accept` là gợi ý cho hộp thoại chọn tệp, KHÔNG phải phép canh —
                phép canh thật nằm ở server action. Vẫn khai vì nó cắt phần lớn
                lỗi trước khi người dùng phải chờ một lượt gửi. */}
            <input
              type="file"
              name="file"
              accept=".txt,.md,.html,.htm,text/plain,text/markdown,text/html"
              required
            />
          </Field>
          <SubmitButton appearance="secondary">Tải lên</SubmitButton>
        </div>
      </form>

      <p className="field-note">
        Nhận .txt .md .html · tối đa 1 MB. Tài liệu thuộc riêng công ty này và
        được đọc ở vòng quét kế tiếp.
      </p>

      <ActionMessage state={state} />
    </div>
  );
}
