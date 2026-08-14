// `FR-39` · `AD-UI-9` — dòng Nhật ký vòng quét.
//
// `FR-39` đòi SÁU trường sau mỗi vòng: chạy lúc nào, quét bao nhiêu Công ty,
// phát hiện bao nhiêu nội dung mới, thêm bao nhiêu mục vào Dòng thời gian, mất
// bao lâu, có lỗi gì. Cộng hai luật nữa:
//   · mỗi 10 vòng ghi thêm một dòng TỔNG HỢP cộng dồn
//   · vòng bị cắt giữa chừng ghi là **vòng không trọn**, kèm số Công ty đã quét
//     trên tổng, và KHÔNG đếm vào chuỗi 10 vòng
//
// ⚠ `AD-UI-9`: vòng quét KHÔNG BAO GIỜ làm mới giao diện. Tệp này dựng CHUỖI và
// đưa cho một sink do bên gọi cấp; nó không gọi `revalidatePath`, không đẩy
// sự kiện, không chạm React. Người bấm mới nạp lại.
//
// Dòng nhật ký là thứ giám khảo ĐỌC ở `T-8` (*"Nhật ký vòng quét có dòng tổng
// kết cho từng vòng"*), nên nó viết tiếng Việt có dấu và đọc được không cần
// bảng tra.

import type { CycleSummaryValue } from "./_contract";

/// Nơi nhận dòng nhật ký. Tiêm vào thay vì gọi thẳng `console.log`, vì `tests/`
/// khẳng định **nội dung** dòng chứ không đi đọc stdout của tiến trình.
export type JournalSink = (line: string) => void;

/// Nhật ký vòng quét là đầu ra CHỦ ĐÍCH của tiến trình nền — nó không có bề mặt
/// giao diện nào (`AD-UI-9`), nên `console.log` ở đây là đích đến, không phải
/// một lần gỡ rối bỏ quên.
export const consoleJournal: JournalSink = (line) => {
  console.log(line);
};

function seconds(ms: number): string {
  return `${(ms / 1000).toFixed(1)}s`;
}

/// Dòng cho MỘT vòng — sáu trường của `FR-39`, đúng thứ tự đề bài liệt kê.
export function renderCycleLine(s: CycleSummaryValue, startedAt: string): string {
  const scope = s.partial
    ? `${s.accountsScanned}/${s.accountsPlanned} Công ty (VÒNG KHÔNG TRỌN)`
    : `${s.accountsScanned} Công ty`;
  const errors = s.failureCodes.length > 0 ? s.failureCodes.join(",") : "không";
  return (
    `[vòng quét] ${startedAt} · quét ${scope}`
    + ` · nội dung mới ${s.newSnapshots}`
    + ` · thêm ${s.newTimelineEntries} mục Dòng thời gian`
    + ` · ${seconds(s.durationMs)}`
    + ` · lỗi: ${errors}`
    + ` · dừng: ${s.stopReason}`
    + ` · ${s.modelCallsUsed} lượt gọi, $${s.costUsedUsd.toFixed(4)}`
  );
}

/// `FR-39` — dòng bổ sung mỗi 10 vòng TRỌN. Bên gọi chỉ in khi `due`.
export type RollupValue = {
  cycles: number;
  totalAccounts: number;
  totalSignals: number;
  totalCostUsd: number;
  totalModelCalls: number;
  due: boolean;
};

export function renderRollupLine(r: RollupValue): string {
  return (
    `[vòng quét · tổng hợp ${r.cycles} vòng trọn] `
    + `${r.totalAccounts} lượt Công ty · ${r.totalSignals} Phát hiện · `
    + `${r.totalModelCalls} lượt gọi · $${r.totalCostUsd.toFixed(4)}`
  );
}

/// `FR-38` — vòng bị bỏ vì vòng trước chưa xong. Vẫn ghi một dòng KÈM LÝ DO;
/// không dồn hàng, không chạy chồng.
export function renderSkippedLine(at: string, blockedBy: string): string {
  return `[vòng quét] ${at} · BỎ VÒNG — vòng trước chưa kết thúc (\`${blockedBy}\`)`;
}

/// Vòng không mở được vì phanh AI đang tắt (`T-9`).
///
/// Dòng này đi thẳng ra sink chứ không vào bảng `scan_log`, và đó là hệ quả
/// **đã biết** của Cổng: mọi capability của tác nhân `system` bị từ chối mã
/// `brake` khi `ai_enabled = false`, kể cả `writeScanLog`. Xem ghi chú
/// *phanh và mục tự-giới-hạn* ở đầu `loop.ts`.
export function renderBrakeLine(at: string): string {
  return `[vòng quét] ${at} · BỎ VÒNG — phanh AI đang tắt (\`FR-45\`, \`T-9\`)`;
}
