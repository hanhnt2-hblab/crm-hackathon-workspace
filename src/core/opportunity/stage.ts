// `AD-CR-1` — máy trạng thái Cơ hội, cưỡng chế HAI LỚP.
//
// Lớp một: bảng chuyển tiếp là HÀM THUẦN ở đây — quyết định `from → to`, ném
// lỗi có mã. Kiểm được bằng bảng đầu-vào/đầu-ra, không cần cơ sở dữ liệu.
// Lớp hai: CSDL canh HÌNH DẠNG bằng `CHECK` (`AD-CR-11`), không bằng trigger.
//
// Đây là artifact trung tâm của hình thái trội (vòng đời bản ghi), và spine cha
// từng để nó trống — `AD-CR-1` là chỗ vá.

import { BusinessRuleError } from "../errors";

export type Stage =
  | "tiep_can" | "du_dieu_kien" | "soan_de_xuat" | "thuong_luong"
  | "thang" | "thua" | "tam_dung";

/// Bốn giai đoạn ĐANG CHẠY. `tam_dung` KHÔNG thuộc nhóm này (`D11`) —
/// đó là lý do `BR-B4` miễn trừ nó khỏi luật *"Cơ hội mở phải có Việc tiếp theo"*.
export const RUNNING_STAGES = [
  "tiep_can", "du_dieu_kien", "soan_de_xuat", "thuong_luong",
] as const satisfies readonly Stage[];

export const CLOSED_STAGES = ["thang", "thua"] as const satisfies readonly Stage[];

export function isRunning(s: Stage): boolean {
  return (RUNNING_STAGES as readonly string[]).includes(s);
}
export function isClosed(s: Stage): boolean {
  return (CLOSED_STAGES as readonly string[]).includes(s);
}

/// TÁM chuyển tiếp hợp lệ. PRD §5.1 là nguồn; đây là nó ở dạng cưỡng chế được.
const ALLOWED: ReadonlyArray<readonly [Stage, Stage]> = [
  // tiến tới, từng bước một — không nhảy cóc
  ["tiep_can", "du_dieu_kien"],
  ["du_dieu_kien", "soan_de_xuat"],
  ["soan_de_xuat", "thuong_luong"],
  // đóng: chỉ từ giai đoạn đang chạy
  ["thuong_luong", "thang"],
  ["thuong_luong", "thua"],
  ["du_dieu_kien", "thua"],
  ["soan_de_xuat", "thua"],
  // tạm dừng: từ bất kỳ giai đoạn đang chạy nào — mở rộng ở `canTransition`
  ["tiep_can", "tam_dung"],
];

/// NĂM nhóm bị cấm, nêu tên để phép kiểm khẳng định được:
///   ① nhảy cóc giai đoạn (tiep_can → soan_de_xuat)
///   ② lùi giai đoạn trực tiếp (thuong_luong → du_dieu_kien)
///   ③ thắng từ giai đoạn chưa thương lượng (du_dieu_kien → thang)
///   ④ đi tiếp từ trạng thái đã đóng — phải qua `resumeOrReopen`
///   ⑤ đóng → đóng (thang → thua)
export function canTransition(from: Stage, to: Stage): boolean {
  if (from === to) return false;
  if (isRunning(from) && to === "tam_dung") return true;
  return ALLOWED.some(([a, b]) => a === from && b === to);
}

export type StageChange = {
  stage: Stage;
  /// Bất biến HAI CHIỀU: có giá trị ⇔ `stage` ∈ {tam_dung, thang, thua}.
  /// CSDL canh bằng `CHECK opp_latest_open_stage_iff` (`AD-CR-11`).
  latestOpenStage: Stage | null;
};

/// `AD-5`: `actor` là tham số ĐẦU TIÊN, luôn.
/// `NFR-14`: máy KHÔNG BAO GIỜ đổi Giai đoạn — chặn ở Cổng bước ③/④, nhưng
/// lõi cũng chặn, vì *"một lời dặn dò suông với phần AI không tính là đã chặn"*.
export function changeStage(
  current: StageChange,
  to: Stage,
  opts: { byMachine: boolean },
): StageChange {
  if (opts.byMachine) {
    throw new BusinessRuleError(
      "NFR-14",
      "Máy không bao giờ đổi Giai đoạn của Cơ hội.",
    );
  }
  if (isClosed(current.stage) || current.stage === "tam_dung") {
    throw new BusinessRuleError(
      "BR-D3",
      `Cơ hội đang ở \`${current.stage}\`; mở lại phải đi qua resumeOrReopen.`,
    );
  }
  if (!canTransition(current.stage, to)) {
    throw new BusinessRuleError(
      "BR-D3",
      `Chuyển tiếp \`${current.stage}\` → \`${to}\` không nằm trong bảng §5.1.`,
    );
  }
  return {
    stage: to,
    latestOpenStage:
      to === "tam_dung" || isClosed(to) ? current.stage : null,
  };
}

/// MỘT lối vào cho cả *mở lại* lẫn *quay lại*, và nó KHÔNG nhận giai đoạn đích.
///
/// Phương án đã loại: dùng chung `changeStage(actor, id, to)` rồi kiểm
/// `to === latestOpenStage`. Loại vì nó để lộ một tham số mà **mọi lời gọi hợp
/// lệ đều phải đoán đúng**, và giao diện sẽ phải tự đọc cột đó để dựng nút.
export function resumeOrReopen(current: StageChange): StageChange {
  if (current.latestOpenStage === null) {
    throw new BusinessRuleError(
      "BR-D3",
      "Cơ hội đang chạy — không có gì để mở lại.",
    );
  }
  return { stage: current.latestOpenStage, latestOpenStage: null };
}
