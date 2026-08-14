// `AD-2` · `AD-CP-3` — ba mục capability đầu tiên, vùng hồ sơ Công ty.
//
// Ba mục này là KHUÔN cho mọi mục còn lại. Đọc kỹ một lần rồi chép, đừng phát
// minh lại: `zone`/`risk`/`touches`/`allowedActors` là bốn trường quyết định
// hành vi của Cổng, và sai một trường là sai một luật §5 mà không lint nào bắt.

import { z } from "zod";
import { defineCap, type RegistryEntry } from "../types";
import { createCompany } from "@/core/company";
import { createContact } from "@/core/contact";
import { createOpportunity } from "@/core/opportunity";

/// ⚠ MỌI mục ở đây là `allowedActors: ["human", "seed"]` — KHÔNG có `"system"`.
///
/// Không phải vì tiện: `§5` của đề bài cấm máy tạo và xoá dữ liệu hồ sơ. Thêm
/// `"system"` vào một trong ba mục này là mở đúng ranh giới mà `T-10` kiểm.
/// `"seed"` có mặt vì bộ gieo đi qua chính đường này (`AD-20`), và bước ② của
/// `AD-4` đã canh nó bằng hai vế.
const ACTORS = ["human", "seed"] as const;

export const createCompanyCap = defineCap({
  name: "createCompany",
  allowedActors: ACTORS,
  /// Rỗng = không giới hạn vai. Sales tạo Công ty được (§6).
  allowedRoles: [],
  /// Không chạm ranh giới nào: đây là thao tác của NGƯỜI, và `allowedActors`
  /// đã loại máy ở bước ③ trước khi tới bước ④.
  touches: [],
  selfLimiting: false,
  zone: "ho_so_chinh_thuc",
  risk: "medium",
  requiresSignalSource: false,
  cascades: [],
  kind: "write",
  params: z.object({
    name: z.string().min(1),
    market: z.enum(["JP", "Global", "KR"]),
    industry: z.string().nullable().optional(),
    accountType: z
      .enum(["traditional", "it_solution", "it_product", "tech_startup", "ito"])
      .nullable()
      .optional(),
    country: z.string().nullable().optional(),
    website: z.string().nullable().optional(),
    sourceRef: z.string().nullable().optional(),
  }),
  dirtyFlags: [],
  exposeToMcp: false,
  fn: async (actor, params, ctx) => createCompany(actor, params, ctx),
  snapshot: null,
  writesTables: ["account", "timeline"],
});

export const createContactCap = defineCap({
  name: "createContact",
  allowedActors: ACTORS,
  allowedRoles: [],
  touches: [],
  selfLimiting: false,
  zone: "ho_so_chinh_thuc",
  risk: "medium",
  requiresSignalSource: false,
  cascades: [],
  kind: "write",
  params: z.object({
    accountId: z.uuid(),
    name: z.string().min(1),
    title: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    isPrimary: z.boolean().optional(),
    sourceRef: z.string().nullable().optional(),
  }),
  dirtyFlags: [],
  exposeToMcp: false,
  fn: async (actor, params, ctx) => createContact(actor, params, ctx),
  snapshot: null,
  writesTables: ["contact"],
});

export const createOpportunityCap = defineCap({
  name: "createOpportunity",
  allowedActors: ACTORS,
  allowedRoles: [],
  /// `NFR-15` — máy không tự đánh Thắng/Thua và không tự sửa giá trị tiền. Mục
  /// này NHẬN giá trị tiền, nên nó khai chạm ranh giới đó. `allowedActors` đã
  /// loại máy ở bước ③; khai `touches` là lớp thứ hai, và là lớp mà `T-10b`
  /// khẳng định trên SỔ chứ không trên một lời gọi.
  touches: ["NFR-15"],
  selfLimiting: false,
  zone: "ho_so_chinh_thuc",
  risk: "high",
  requiresSignalSource: false,
  cascades: [],
  kind: "write",
  params: z.object({
    accountId: z.uuid(),
    name: z.string().min(1),
    /// Chuỗi, không `z.number()`: cột là `Decimal(14,2)`, và số dấu phẩy động
    /// của JavaScript làm tròn tiền sai ở đúng chỗ không ai nhìn.
    amount: z.string().nullable().optional(),
    currency: z.string().length(3).nullable().optional(),
    expectedCloseMonth: z.string().nullable().optional(),
    sourceRef: z.string().nullable().optional(),
  }),
  dirtyFlags: ["BR-B1"],
  exposeToMcp: false,
  fn: async (actor, params, ctx) => createOpportunity(actor, params, ctx),
  snapshot: null,
  writesTables: ["opportunity"],
});

/// Xuất DUY NHẤT một hằng số `entries` (`AD-CP-1`). Sổ đăng ký nạp từ đây, và
/// không có đường nào khác thêm mục — nên `defineCap` thật sự là cửa bắt buộc.
export const entries: readonly RegistryEntry[] = [
  createCompanyCap,
  createContactCap,
  createOpportunityCap,
] as unknown as readonly RegistryEntry[];
