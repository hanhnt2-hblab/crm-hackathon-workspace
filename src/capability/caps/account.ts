// `AD-2` · `AD-CP-3` — ba mục capability đầu tiên, vùng hồ sơ Công ty.
//
// Ba mục này là KHUÔN cho mọi mục còn lại. Đọc kỹ một lần rồi chép, đừng phát
// minh lại: `zone`/`risk`/`touches`/`allowedActors` là bốn trường quyết định
// hành vi của Cổng, và sai một trường là sai một luật §5 mà không lint nào bắt.

import { z } from "zod";
import { defineCap, type RegistryEntry } from "../types";
import { createCompany } from "@/core/company";
import { createContact } from "@/core/contact";
import {
  createOpportunity, changeOpportunityStage, resumeFromPause, reopenClosedOpportunity,
} from "@/core/opportunity";
import { appendTimelineEntry } from "@/core/timeline";

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

export const changeStageCap = defineCap({
  name: "changeOpportunityStage",
  /// ⚠ CHỈ `human`. Không `seed`, không `system`. `NFR-14` là ranh giới tuyệt
  /// đối, và bộ gieo dựng Cơ hội ở `tiep_can` bằng đường TẠO — nó không cần
  /// đường chuyển tiếp, nên cho nó vào đây là mở một cửa không ai dùng.
  allowedActors: ["human"],
  allowedRoles: [],
  touches: ["NFR-14"],
  selfLimiting: false,
  zone: "ho_so_chinh_thuc",
  risk: "high",
  requiresSignalSource: false,
  cascades: ["timeline_entry"],
  kind: "write",
  params: z.object({
    id: z.uuid(),
    to: z.enum([
      "tiep_can", "du_dieu_kien", "soan_de_xuat", "thuong_luong",
      "thang", "thua", "tam_dung",
    ]),
  }),
  dirtyFlags: ["BR-B1", "BR-B2", "BR-B3", "BR-B4"],
  exposeToMcp: false,
  fn: async (actor, p, ctx) => changeOpportunityStage(actor, p.id, p.to, ctx),
  snapshot: null,
  writesTables: ["opportunity", "timeline_entry"],
});

/// §6 — Sales quay lại được từ `tam_dung`. `allowedRoles` RỖNG là đúng ở đây,
/// vì đường này không giới hạn vai. Lõi đòi trạng thái vào phải là `tam_dung`.
export const resumeFromPauseCap = defineCap({
  name: "resumeFromPause",
  allowedActors: ["human"],
  allowedRoles: [],
  touches: ["NFR-14"],
  selfLimiting: false,
  zone: "ho_so_chinh_thuc",
  risk: "medium",
  requiresSignalSource: false,
  cascades: ["timeline_entry"],
  kind: "write",
  params: z.object({ id: z.uuid() }),
  dirtyFlags: ["BR-B1", "BR-B4"],
  exposeToMcp: false,
  fn: async (actor, p, ctx) => resumeFromPause(actor, p.id, ctx),
  snapshot: null,
  writesTables: ["opportunity", "timeline_entry"],
});

/// `D43` · `A5` · §5.2 — mở lại Cơ hội ĐÃ ĐÓNG, CHỈ vai Quản trị.
///
/// Đây là chỗ `D43` cuối cùng được cưỡng chế, và nó cưỡng chế ở CỔNG bước ⑤
/// (`AD-CR-10`: lõi không đọc `actor.role`). Lõi chỉ canh trạng thái vào phải
/// là đã đóng — đó không phải quyền, đó là *"gọi nhầm cửa"*.
///
/// Vì sao phải tách khỏi `resumeFromPause` thay vì thêm một tham số: một
/// capability với một `allowedRoles` không phát biểu được hai luật vai khác
/// nhau, và Cổng cố ý không đọc dữ liệu để phân biệt (`AD-GT-1`).
export const reopenClosedOpportunityCap = defineCap({
  name: "reopenClosedOpportunity",
  allowedActors: ["human"],
  allowedRoles: ["admin"],
  touches: ["NFR-14", "NFR-15"],
  selfLimiting: false,
  zone: "ho_so_chinh_thuc",
  risk: "high",
  requiresSignalSource: false,
  cascades: ["timeline_entry"],
  kind: "write",
  params: z.object({ id: z.uuid() }),
  dirtyFlags: ["BR-B1", "BR-B3", "BR-B4"],
  exposeToMcp: false,
  fn: async (actor, p, ctx) => reopenClosedOpportunity(actor, p.id, ctx),
  snapshot: null,
  writesTables: ["opportunity", "timeline_entry"],
});

export const appendTimelineEntryCap = defineCap({
  name: "appendTimelineEntry",
  /// ⚠ MỤC DUY NHẤT cho `system` chạm được. `§4/nhóm 5` cho máy ghi Hoạt động
  /// vào Dòng thời gian ở mức TỰ DO, và `NFR-19` chỉ cấm máy SỬA mục người tạo
  /// — thêm mục mới là việc khác. `added_by` suy từ `actor` ở lõi, nên máy
  /// không giả được nhãn của người.
  allowedActors: ["human", "system", "seed"],
  allowedRoles: [],
  touches: [],
  selfLimiting: false,
  zone: "tu_do",
  risk: "low",
  requiresSignalSource: false,
  cascades: [],
  kind: "write",
  params: z.object({
    accountId: z.uuid(),
    content: z.string().min(1),
    /// `z.iso.datetime()`, KHÔNG `z.date()` — Zod 4 ném lúc DỰNG server.
    occurredAt: z.iso.datetime(),
    sourceSignalId: z.uuid().nullable().optional(),
  }),
  dirtyFlags: [],
  /// ⚠ `false`. Bản trước để `true`, và `AD-CP-6` cấm thẳng: tập phơi lên MCP là
  /// **đúng năm mục hạng đọc-chung**, *"không mục ghi nào"*. Một mục ghi phơi ra
  /// đó là đưa cho agent đúng thứ `AD-AG-3` nói nó không được có — và phép đối
  /// chứng phá hoại của `AD-1` khi đó đo trên một bề mặt đã rộng hơn thiết kế.
  exposeToMcp: false,
  fn: async (actor, p, ctx) =>
    appendTimelineEntry(
      actor,
      { ...p, occurredAt: new Date(p.occurredAt) },
      ctx,
    ),
  snapshot: null,
  writesTables: ["timeline_entry"],
});

/// Xuất DUY NHẤT một hằng số `entries` (`AD-CP-1`). Sổ đăng ký nạp từ đây, và
/// không có đường nào khác thêm mục — nên `defineCap` thật sự là cửa bắt buộc.
export const entries: readonly RegistryEntry[] = [
  createCompanyCap,
  createContactCap,
  createOpportunityCap,
  changeStageCap,
  resumeFromPauseCap,
  reopenClosedOpportunityCap,
  appendTimelineEntryCap,
] as unknown as readonly RegistryEntry[];
