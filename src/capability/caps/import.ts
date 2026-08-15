// Luật thi `3.1` — nạp bộ dữ liệu bằng upload zip từ giao diện.
//
// ⚠ `allowedActors: ["human"]`. Máy KHÔNG được nạp dữ liệu: lượt nạp xoá sạch
// rồi dựng lại mọi thứ của bộ trước, kể cả Phát hiện và Gợi ý — đúng thứ
// `NFR-17` cấm máy làm. Một mục cho `system` ở đây là cửa hậu vòng qua `T-10`.
//
// ⚠ `zone: "ho_so_chinh_thuc"`, `risk: "high"`. Nó ghi thẳng vào hồ sơ, và
// `AD-2` xếp mọi mục như thế vào hạng người.

import { z } from "zod";
import { defineCap, type RegistryEntry } from "../types";
import { applyImport } from "@/core/import/apply";

export const importDatasetCap = defineCap({
  name: "importDataset",
  allowedActors: ["human"],
  allowedRoles: [],
  touches: [],
  selfLimiting: false,
  zone: "ho_so_chinh_thuc",
  risk: "high",
  requiresSignalSource: false,
  cascades: [],
  kind: "write",
  dirtyFlags: [],
  exposeToMcp: false,
  snapshot: null,
  writesTables: ["account", "contact", "opportunity", "snapshot", "article", "timeline"],
  /// Ba tệp CSV là chuỗi, Bản chụp là cặp tên→nội dung. Tầng ④ nhận DỮ LIỆU ĐÃ
  /// GIẢI NÉN, không nhận tệp zip: giải nén là việc phụ thuộc định dạng vận
  /// chuyển, và `AD-1` đặt nó ở tầng ① cùng với mọi thứ biết về HTTP.
  params: z.object({
    accounts: z.string().min(1),
    contacts: z.string().min(1),
    opportunities: z.string().min(1),
    snapshots: z.array(z.object({ name: z.string().min(1), html: z.string() })),
  }),
  fn: async (_actor, p) =>
    applyImport({
      accounts: p.accounts,
      contacts: p.contacts,
      opportunities: p.opportunities,
      snapshots: new Map(p.snapshots.map((s) => [s.name, s.html])),
    }),
});

export const entries: readonly RegistryEntry[] = [
  importDatasetCap,
] as unknown as readonly RegistryEntry[];
