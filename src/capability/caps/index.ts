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

import type { RegistryEntry } from "../types";
import { entries as accountEntries } from "./account";

export const ALL_ENTRIES: readonly RegistryEntry[] = [
  ...accountEntries,
];
