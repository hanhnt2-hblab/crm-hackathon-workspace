// `AD-15` — tham số nghiệp vụ ở bảng `settings`, đọc MỖI LẦN DÙNG.
//
// Không nhớ đệm: `D38` đòi Quản trị sửa ngưỡng và có hiệu lực NGAY. Một tầng
// đệm ở đây làm màn hình Quản trị nói một đằng, Cổng quyết một nẻo — và lệch
// đó không phép kiểm nào bắt vì cả hai đều "đúng" theo nguồn của mình.

import { db } from "./db";
import { getScanIntervalMinutesSeed } from "@/config";

/// Từ vựng ĐÓNG. Thêm khoá mà quên khai ở đây là lỗi biên dịch, không phải
/// một `undefined` im lặng lúc chạy.
/// ⚠ `ai_enabled` là NƠI DUY NHẤT lưu trạng thái nút Tắt AI (`T-9`, `C3-5`).
/// Nó ở bảng `settings` chứ không phải một biến trong tiến trình vì `T-9` đòi
/// trạng thái sống qua lần khởi động lại, và vì vòng quét chạy ở tiến trình
/// khác với tiến trình phục vụ web — một biến trong bộ nhớ thì hai bên thấy
/// hai giá trị.
export type SettingKey =
  | "ai_enabled"
  | "model_calls_per_scan"
  | "budget_warn_ratio"
  | "budget_stop_ratio"
  | "max_consecutive_denials"
  | "scan_budget_usd"
  | "scan_interval_minutes"
  | "next_action_overwrite_overdue_manual"
  | "unclassified_ratio_threshold"
  | "blind_approve_seconds"
  | "blind_approve_per_minute"
  | "metrics_min_sample";

export const SETTING_DEFAULTS: Record<SettingKey, string> = {
  ai_enabled: "true",                            // T-9 — mặc định BẬT
  model_calls_per_scan: "20",                    // NFR-2
  budget_warn_ratio: "0.80",                     // NFR-3
  budget_stop_ratio: "1.00",                     // NFR-3
  max_consecutive_denials: "3",                  // AD-11
  scan_budget_usd: "3.00",                       // trần MỘT VÒNG
  scan_interval_minutes: String(getScanIntervalMinutesSeed()),
  next_action_overwrite_overdue_manual: "false", // D12 — mặc định TẮT
  unclassified_ratio_threshold: "0.30",          // BR-B5
  blind_approve_seconds: "3",                    // BR-B6
  blind_approve_per_minute: "5",                 // BR-B6
  metrics_min_sample: "5",                       // AD-CR-5 sàn cỡ mẫu
};

export async function getSetting(key: SettingKey): Promise<string> {
  const row = await db.setting.findUnique({ where: { key } });
  return row?.value ?? SETTING_DEFAULTS[key];
}

export async function getSettingNumber(key: SettingKey): Promise<number> {
  const n = Number(await getSetting(key));
  if (!Number.isFinite(n)) {
    throw new Error(`Tham số \`${key}\` không phải số.`);
  }
  return n;
}

export async function getSettingBool(key: SettingKey): Promise<boolean> {
  return (await getSetting(key)) === "true";
}

/// `AD-11`: `estimated_cost_per_account` KHÔNG phải hàng `settings` — nó là
/// SỐ ĐO, suy từ `ScanLogEntry`. Đặt nó vào `settings` là mời người ta gõ tay
/// một con số mà máy đo được chính xác hơn.
export async function estimatedCostPerAccount(): Promise<number> {
  const last = await db.scanLog.findFirst({
    where: { finishedAt: { not: null } },
    orderBy: { startedAt: "desc" },
    select: { id: true },
  });
  if (!last) return 0; // chưa có lịch sử → Công ty đầu tiên đi vô điều kiện

  const agg = await db.scanLogEntry.aggregate({
    where: { scanLogId: last.id },
    _max: { costUsd: true },
  });
  return Number(agg._max.costUsd ?? 0);
}
