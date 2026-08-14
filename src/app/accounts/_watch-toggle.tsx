"use client";

// `FR-47` · `T-8` — nút bật/tắt Đang theo dõi, lá `'use client'` (`AD-UI-5`).

import { useActionState } from "react";
import { Button } from "@fluentui/react-components";
import { IDLE } from "../_contract";
import { toggleWatchingAction } from "./actions";

export function WatchToggle({ id, watching }: { id: string; watching: boolean }) {
  const [, formAction, pending] = useActionState(toggleWatchingAction, IDLE);

  return (
    <form action={formAction} style={{ display: "inline" }}>
      <input type="hidden" name="id" value={id} />
      {/* Trạng thái ĐÍCH, không phải trạng thái hiện tại — xem chú thích ở action. */}
      <input type="hidden" name="watching" value={watching ? "false" : "true"} />
      <Button size="small" type="submit" disabled={pending}
        appearance={watching ? "secondary" : "primary"}>
        {pending ? "…" : watching ? "Bỏ theo dõi" : "Theo dõi"}
      </Button>
    </form>
  );
}
