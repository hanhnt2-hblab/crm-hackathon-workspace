// `AD-UI-6` · `AD-UI-7` — hợp đồng server action, tầng ①.
//
// ⚠ ĐÂY LÀ TỆP ĐẦU TIÊN CỦA TẦNG ①, viết trước mọi bề mặt. `ActionState` khai ở
// đây và **không tệp nào khác được khai lại nó**. Thiếu luật này thì hai người
// dựng hai bề mặt sẽ khai hai `ActionState` hơi khác nhau, và cái sai chỉ lộ ra
// khi một lá hiển thị lỗi dùng chung phải nhận cả hai.
//
// ⚠ Đường dẫn là `src/app/_contract.ts` theo đúng `AD-UI-6`, KHÔNG phải
// `src/app/_actions/types.ts` như bản nháp spec ghi — `AD-UI-6` chỉ đích danh
// tệp này và cấm tệp khác khai lại `ActionState`.
// (KHÔNG viện `AD-13`: chuỗi phân xử của nó là đề bài > Mục 0 > PRD > ontology
// > lược đồ, trong đó không có spine, nên nó không phân xử được tranh chấp này.)

import type { BusinessRuleCode } from "@/core/errors";
import type { GateDenyReason } from "@/autonomy/gate";
import { failureFromError } from "./_errors";

/// Union PHÂN BIỆT ĐƯỢC: thành công, hoặc thất bại mang **mã** và **chữ hiển thị**.
///
/// Chữ hiển thị là tiếng Việt có dấu và dựng từ MÃ (`AD-UI-7` ánh xạ hai chặng),
/// không phải từ thông điệp của lỗi — thông điệp lỗi là để đọc log, không phải
/// để đưa cho Sales.
export type ActionState =
  | { ok: true; message?: string }
  | {
      ok: false;
      code: BusinessRuleCode | GateDenyReason | "unexpected";
      message: string;
    };

export const IDLE: ActionState = { ok: true };

/// `AD-UI-6` — CHỮ KÝ DUY NHẤT của mọi server action, dùng với `useActionState`
/// của React 19 (ở package `react`, trả tuple **ba** phần tử; `useFormState` của
/// React 18 đã đổi tên và deprecate).
export type ServerAction = (prev: ActionState, form: FormData) => Promise<ActionState>;

/// `AD-UI-6` — DÒNG CƯỠNG CHẾ. Mọi server action đi qua ĐÚNG helper này, và đây
/// là chỗ DUY NHẤT có `try/catch`.
///
/// Vì sao cần cưỡng chế thay vì một lời dặn: Next **nuốt** thông điệp của lỗi
/// chưa bắt trong server action và trả một câu chung kèm `digest`. Nghĩa là mọi
/// thiết kế dựa vào việc bắt lỗi *có mã* ở phía client sẽ chạy đúng dưới `dev`
/// và **mất mã đúng lúc chấm**. Một luật không có dòng cưỡng chế thì không phải
/// bất biến, chỉ là nguyện vọng.
///
/// Phép kiểm đi kèm (thuộc `C0-8`, đã hoãn): quét `src/app/**`, khẳng định
/// không tệp nào khai `'use server'` mà không nhập `action`.
///
/// Bắt `GateDenied` (từ `@/capability/errors`) và `BusinessRuleError` — hai lỗi
/// **mong đợi** — rồi TRẢ VỀ. Chỉ lỗi **bất ngờ** mới được ném tiếp, và khi đó
/// nó đúng là việc của error boundary.
/// ⚠ `prev` bị BỎ QUA có chủ đích. React 19 truyền trạng thái của lượt trước
/// vào, nhưng mọi bề mặt của tầng này đọc lại dữ liệu từ server sau khi ghi
/// (`AD-UI-9`), nên trạng thái cũ không tham gia quyết định nào. Nhận nó vào
/// chữ ký mà không dùng là đúng `AD-UI-6`: chữ ký là hợp đồng với
/// `useActionState`, không phải danh sách phụ thuộc.
export function action(
  fn: (form: FormData) => Promise<ActionState>,
): ServerAction {
  return async function runAction(
    _prev: ActionState,
    form: FormData,
  ): Promise<ActionState> {
    try {
      return await fn(form);
    } catch (error) {
      // `failureFromError` là chặng 1 + chặng 2 của `AD-UI-7`, và là nơi DUY
      // NHẤT trong repo biết một mã lỗi đọc thành câu tiếng Việt nào.
      const failure = failureFromError(error);
      // `null` = lỗi BẤT NGỜ. `AD-UI-6` bắt ném tiếp: đó đúng là việc của
      // error boundary, và nuốt nó ở đây là biến một sự cố hạ tầng thành một
      // câu trấn an trên màn hình Sales.
      if (failure === null) throw error;
      return failure;
    }
  };
}
