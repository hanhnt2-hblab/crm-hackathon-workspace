// `AD-CP-3` · `AD-CP-4` — hình dạng một mục sổ đăng ký, tầng ④.
//
// Tầng ④ MỞ RỘNG `GateEntry` của tầng ③ (`AD-GT-12`), không cấp nó. Chiều này
// giữ Zod và Prisma ra khỏi đồ thị kiểu của tầng ③, nên `npm test` trên clone
// sạch không đỏ ở `gate.ts` khi `prisma generate` chưa chạy.

import type { z } from "zod";
import type { Actor } from "@/core/actor";
import type { GateEntry } from "@/autonomy/gate";
import type { Tx } from "@/core/db";

/// Vùng nghiệp vụ và mức rủi ro — `AD-2`. `risk` KHÔNG tham gia quyết định của
/// Cổng; nó chỉ vào dòng ghi vết, để đọc lại sau còn xếp được mức độ.
///
/// ⚠ ĐÚNG BA giá trị, khớp từng chữ bảng §6 của đề bài — đây là ba MỨC TỰ CHỦ,
/// không phải sáu miền dữ liệu. Khai theo miền là mất luôn ý nghĩa của `AD-2`.
export type Zone = "tu_do" | "chay_ngam" | "ho_so_chinh_thuc";
export type Risk = "low" | "medium" | "high";

/// `AD-CR-4` — cờ luật hành vi mà một capability có thể làm bẩn.
/// Tầng ④ **khai** danh sách; lõi là bên tính lại cờ.
///
/// ⚠ CHỈ `BR-B1`…`BR-B4`. `BR-B5` (tỉ lệ `unclassified`) và `BR-B6` (nhịp duyệt
/// mù) là chỉ số trên QUẦN THỂ, tính lúc đọc bằng `src/core/metrics.ts` (`AD-9`)
/// — không hàng nào để đặt cờ lên, nên không capability nào "làm bẩn" được chúng.
export type BrBFlag = "BR-B1" | "BR-B2" | "BR-B3" | "BR-B4";

/// `AD-CP-4` — kiểu giao dịch DẪN XUẤT, không ép.
///
/// `AD-14` bắt lọc `deleted_at` bằng Prisma extension, tức client đã `$extends`.
/// Khi đó `tx` **không assignable** vào `Prisma.TransactionClient` (`TS2345`, đã
/// đo trên Prisma 7.9.1). Rút kiểu thẳng từ `$transaction` của client thật thì
/// không cần ép kiểu nào, và nó tự đúng khi client đổi.
///
/// TÁI XUẤT `Tx` của `@/core/db` chứ không dẫn xuất lại — hai công thức cho
/// cùng một kiểu là hai chỗ trôi khỏi nhau. Và nhập KIỂU chứ không nhập giá trị
/// `db`: nhập giá trị ở một tệp kiểu là nạp Prisma client mỗi lần ai chạm vào
/// `types.ts`, kể cả `tests/` vốn không cần cơ sở dữ liệu.
export type PrismaTx = Tx;

/// `AD-CP-4` — ngữ cảnh truyền vào thân capability.
///
/// ⚠ KHÔNG mang `tx`. `AD-CR-7` đặt giao dịch trong LÕI; tầng ④ mở thêm một
/// giao dịch nữa là lồng giao dịch vào giao dịch chính và phá bất biến *"pha 2
/// nằm trong tx"* của `AD-CR-8`.
export type CapContext = {
  auditId: string;
  causedBy: string | null;
};

/// `AD-CP-3` — mục sổ đăng ký: `GateEntry` cộng ĐÚNG năm nhóm trường của tầng ④.
export interface RegistryEntry<
  S extends z.ZodObject<z.ZodRawShape> = z.ZodObject<z.ZodRawShape>,
  R = unknown,
> extends GateEntry {
  zone: Zone;
  risk: Risk;
  requiresSignalSource: boolean;
  cascades: readonly string[];

  /// Quyết định có mở giao dịch không, và là vế khẳng định của `AD-2`:
  /// *"hạng đọc-chung không có đường ghi nào"*.
  kind: "read" | "write";

  /// ⚠ `z.ZodObject<z.ZodRawShape>`, KHÔNG phải `z.ZodType`.
  /// `AD-CP-6` truyền `entry.params.shape` cho `tool()` của SDK, mà `.shape`
  /// chỉ có trên `ZodObject`. Khai rộng hơn là `TS2339` ở `mcp-server.ts` — lỗi
  /// **lúc biên dịch**, `npm start` chết. Hệ quả phụ đúng ý: mọi `params` là
  /// object ở mức gốc, đúng thứ MCP đòi.
  ///
  /// ⚠ CẤM `z.date()` trong `params`. Zod 4 ném *"Date cannot be represented in
  /// JSON Schema"* **lúc dựng server**, và sổ này có tham số ngày. Dùng
  /// `z.iso.datetime()`.
  params: S;

  dirtyFlags: readonly BrBFlag[];
  exposeToMcp: boolean;

  /// `AD-CP-4` — `actor` TRƯỚC, đúng mặt chữ `AD-5`. Đoạn mã minh hoạ của `AD-4`
  /// viết `entry.fn(tx, actor, …)` với `tx` trước; đó là bản cũ, và `AD-CP-4`
  /// đã chốt lại theo `AD-5`.
  fn: (actor: Actor, params: z.infer<S>, ctx: CapContext) => Promise<R>;

  /// Ảnh chụp TRƯỚC-GHI của `AD-4` — nguồn của giá trị cũ trong dòng ghi vết.
  /// `null` với capability `kind: 'read'`.
  snapshot: ((tx: PrismaTx, params: z.infer<S>) => Promise<unknown>) | null;

  /// `AD-CP-9` — bắt buộc trên mọi mục ghi bảng `settings`.
  settingKeys?: readonly string[];
  /// `AD-CP-10` — bắt buộc trên mọi mục `kind: 'write'` của khối ba.
  writesTables?: readonly string[];
}

/// Tên capability là một từ vựng ĐÓNG, sinh từ chính sổ đăng ký (`AD-CP-1`).
/// Khai `string` ở đây và thu hẹp ở `registry.ts` nơi danh sách thật tồn tại.
export type CapName = string;

/// Capability đã qua Cổng và đã gắn `actor` — cái mà `loadCapability` trả về.
/// Trả CLOSURE chứ không trả thân hàm (`AD-CP-1`): bên gọi không cầm được `fn`
/// trần, nên không có đường vòng qua Cổng.
export type BoundCapability<P = unknown, R = unknown> = (params: P) => Promise<R>;

/// `AD-CP-3` — hàm dựng một mục. Ràng buộc `S extends z.ZodObject<…>` ở đây là
/// chỗ duy nhất chặn được `z.ZodType` lọt vào, vì mọi mục đều đi qua nó.
export function defineCap<S extends z.ZodObject<z.ZodRawShape>, R>(
  _entry: RegistryEntry<S, R>,
): RegistryEntry<S, R> {
  throw new Error("chưa hiện thực");
}
