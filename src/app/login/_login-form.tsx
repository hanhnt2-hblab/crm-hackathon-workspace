"use client";

// `S11` — lá chọn tài khoản. `AD-UI-5`: nhận props đã tuần tự hoá, ghi qua
// server action, không đọc gì.

import { useActionState } from "react";
import { Radio, RadioGroup } from "@fluentui/react-components";
import { IDLE } from "../_contract";
import { ActionMessage, SubmitButton } from "../_action-state";
import type { LoginCandidate } from "../_types";
import { signInAction } from "./actions";

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
