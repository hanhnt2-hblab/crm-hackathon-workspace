// `AD-GT-9` · `AD-UI-6` — biến một từ chối THÀNH một lần ném, và chỉ ở tầng ④.
//
// Vì sao lớp này ở đây chứ không ở `src/core/errors.ts`:
//   · Cổng (tầng ③) TRẢ VỀ `GateDecision`, không ném (`AD-GT-9`). Nó là hàm
//     thuần và không biết bên gọi là ai.
//   · Tầng ⑤ không bao giờ thấy một từ chối của Cổng — lời gọi bị chặn thì lõi
//     chưa bao giờ chạy. Một lớp lỗi mà tầng sở hữu nó không bao giờ ném là một
//     lớp đặt nhầm chỗ.
//   · Tầng ④ là nơi DUY NHẤT đọc `GateDecision` rồi quyết định làm gì với nó.
//
// `AD-UI-6` liệt `GateDenied` cùng `BusinessRuleError` là hai lỗi **mong đợi**
// mà server action phải bắt và TRẢ VỀ, không để ném qua ranh giới.

import type { BoundaryCode } from "@/autonomy/zones";
import type { GateDenyReason } from "@/autonomy/gate";

export class GateDenied extends Error {
  constructor(
    public readonly reason: GateDenyReason,
    public readonly capability: string,
    public readonly boundary?: BoundaryCode,
  ) {
    super(`Cổng từ chối \`${capability}\`: ${reason}`);
    this.name = "GateDenied";
  }
}
