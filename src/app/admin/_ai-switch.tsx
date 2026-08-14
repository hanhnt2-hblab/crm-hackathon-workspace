"use client";

// `S8` · `T-1` · `T-9` — công tắc AI, lá `'use client'` theo `AD-UI-5`.
//
// Nhận trạng thái đã tuần tự hoá qua props, KHÔNG gọi `loadCapability`, ghi qua
// server action.

import { useActionState } from "react";
import { Button } from "@fluentui/react-components";
import { IDLE } from "../_contract";
import { ActionMessage } from "../_action-state";
import { disableAiAction, enableAiAction } from "./actions";

export function AiSwitch({ aiEnabled }: { aiEnabled: boolean }) {
  // HAI `useActionState`, mỗi action một cái. Dùng chung một state thì thông
  // báo của lần bấm trước dính lại trên nút kia.
  const [tatState, tatAction, tatPending] = useActionState(disableAiAction, IDLE);
  const [batState, batAction, batPending] = useActionState(enableAiAction, IDLE);

  return (
    <div className="stack">
      <p>
        Trạng thái hiện tại:{" "}
        <strong className={aiEnabled ? "tag tag-ok" : "tag tag-warn"}>
          {aiEnabled ? "AI đang BẬT" : "AI đang TẮT"}
        </strong>
      </p>

      {aiEnabled ? (
        <form action={tatAction}>
          <Button appearance="primary" type="submit" disabled={tatPending}>
            {tatPending ? "Đang tắt…" : "Tắt toàn bộ phần AI"}
          </Button>
        </form>
      ) : (
        <form action={batAction}>
          <Button appearance="primary" type="submit" disabled={batPending}>
            {batPending ? "Đang bật…" : "Bật lại phần AI"}
          </Button>
        </form>
      )}

      <ActionMessage state={aiEnabled ? tatState : batState} />

      <p className="field-note">
        Tắt AI dừng vòng quét, việc sinh Gợi ý và việc tự đặt Việc tiếp theo.
        Dữ liệu đã sinh <strong>giữ nguyên</strong>, và toàn bộ nhóm 1 vẫn chạy
        bình thường — đó là điều kiện của <code>T-1</code>. Cả hai lần bấm đều
        để lại ghi vết (<code>T-9</code>).
      </p>
    </div>
  );
}
