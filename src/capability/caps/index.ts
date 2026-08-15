// `AD-CP-1` — ĐIỂM NẠP DUY NHẤT của sổ đăng ký.
//
// Mọi tệp `caps/*.ts` phải được gom ở đây, và `registry.ts` chỉ đọc từ đây.
// Không có tệp này thì `registry.ts` nhập thẳng từng tệp caps, và một tệp caps
// mới quên nối vào sẽ **im lặng** không tồn tại — vừa mất capability, vừa lọt
// khỏi tầm rà của `T-10b`, vốn chứng minh bằng VẮNG MẶT trên chính danh sách này.
//
// ⚠ Danh sách vắng mặt chỉ có nghĩa khi nó phủ đủ. Thêm một tệp caps mà quên
// thêm một dòng ở đây làm `T-10b` xanh trên một sổ không đầy đủ — tức nó khẳng
// định *"không mục nào xoá dữ liệu"* trong khi có một mục như thế đang chạy.
//
// ⚠ TÊN CAPABILITY LÀ KHOÁ TOÀN CỤC. `registry.ts` dựng một `Map` theo `name`,
// nên hai tệp khai trùng tên thì mục nạp SAU lặng lẽ thắng — không lỗi, không
// cảnh báo, và bên thua biến mất. Chuyện này đã suýt xảy ra một lần: hai tệp
// cùng khai `readAccountList` với hai tập `allowedActors` khác nhau, và bản
// chỉ-cho-người thắng thì vòng quét chết ở lời gọi đầu tiên. Phép kiểm chống
// trùng nằm ngay dưới.

import type { RegistryEntry } from "../types";
import { entries as accountEntries } from "./account";
import { entries as authUiEntries } from "./auth-ui";
import { entries as scanEntries } from "./scan";
import { entries as suggestionEntries } from "./suggestion";
import { entries as suggestionUiEntries } from "./suggestion-ui";
import { entries as uiEntries } from "./ui";
import { entries as signalUiEntries } from "./signal-ui";
import { entries as nextActionUiEntries } from "./nextaction-ui";
import { entries as readSharedEntries } from "./read-shared";
import { entries as writeSharedEntries } from "./write-shared";
import { entries as importEntries } from "./import";

const GOP: readonly RegistryEntry[] = [
  ...accountEntries,
  ...authUiEntries,
  ...scanEntries,
  ...suggestionEntries,
  ...suggestionUiEntries,
  ...uiEntries,
  ...signalUiEntries,
  ...nextActionUiEntries,
  ...readSharedEntries,
  ...writeSharedEntries,
  ...importEntries,
];

/// Chống trùng tên, kiểm LÚC NẠP MODULE.
///
/// Đặt ở đây chứ không ở `tests/` là có chủ đích: một tên trùng làm sổ đăng ký
/// SAI ngay lúc chạy, và `npm start` chết ồn ào tốt hơn nhiều so với một
/// capability biến mất giữa buổi chấm. Phép kiểm ở `tests/` vẫn có, nhưng nó
/// chỉ chạy khi ai đó chạy nó.
const dem = new Map<string, number>();
for (const e of GOP) dem.set(e.name, (dem.get(e.name) ?? 0) + 1);
const trung = [...dem.entries()].filter(([, n]) => n > 1).map(([k]) => k);
if (trung.length > 0) {
  throw new Error(
    `Sổ đăng ký có tên trùng: ${trung.join(", ")}. ` +
      "Tên capability là khoá toàn cục — mục nạp sau sẽ lặng lẽ thắng.",
  );
}

export const ALL_ENTRIES = GOP;
