// `AD-1` · `AD-14` · `AD-CR-6`
//
// NƠI DUY NHẤT trong repo nhập `@prisma/client`. Luật lint chặn nó ở mọi thư
// mục khác — không có dòng đó thì một server action gọi thẳng
// `prisma.account.update()` sẽ lint xanh, ghi vết rỗng, và `T-10` đi chứng minh
// *"chỉ có sáu capability ghi"* trên một sản phẩm ghi dữ liệu bằng chục đường
// không tên.
//
// ⚠ Prisma 7 KHÔNG dựng được `PrismaClient` nếu thiếu driver adapter — đã tái
// hiện 14/08: `PrismaClientInitializationError: A driver adapter is required`.

import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { getDatabaseUrl } from "@/config";

const base = new PrismaClient({
  adapter: new PrismaPg({ connectionString: getDatabaseUrl() }),
});

/// Danh sách bảng có `deleted_at`. Mọi bảng đều có (`AD-CR-11`), nhưng khai
/// tường minh để extension không đoán — thêm bảng mà quên thêm vào đây thì
/// một phép kiểm ở `tests/` đỏ.
const SOFT_DELETE_MODELS = new Set<string>([
  "User", "Account", "Contact", "Opportunity", "NextAction", "Activity",
  "Timeline", "TimelineEntry", "Snapshot", "Article", "Signal", "Suggestion",
  "Notification", "Setting", "AccountLock", "InferenceCache", "ScanLog",
  "ScanLogEntry", "AuditRecord",
]);

const READ_OPS = new Set([
  "findFirst", "findFirstOrThrow", "findMany", "findUnique",
  "findUniqueOrThrow", "count", "aggregate", "groupBy",
]);

/// `AD-14`: lọc `deleted_at IS NULL` ở ĐÚNG MỘT CHỖ, không ở từng truy vấn.
/// Không có nó, xoá mềm là bẫy im lặng — sau khi giám khảo bấm Xoá theo `D26`,
/// một màn hình còn hiện Công ty và màn hình kia báo không tìm thấy, và không
/// lint nào bắt được.
export const db = base.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        if (!model || !SOFT_DELETE_MODELS.has(model)) return query(args);
        if (!READ_OPS.has(operation)) return query(args);

        const a = args as { where?: Record<string, unknown> };
        a.where = { ...(a.where ?? {}), deletedAt: null };
        return query(a);
      },
    },
  },
});

/// ĐƯỜNG THOÁT, có danh sách ba nơi dùng ĐÓNG — không mở rộng mà không sửa `AD-CR-6`:
///   ① báo cáo đối soát `TR-3` — phải thấy cả bản ghi đã xoá mềm
///   ② ghi vết: đọc lại giá trị cũ của một bản ghi đã xoá
///   ③ `tests/` khẳng định vế hai của `AD-2` (*bản ghi không đổi*)
export const dbIncludingDeleted = base;

/// `AD-CR-7`: mọi capability ghi mở ĐÚNG MỘT giao dịch, và nó mở TRONG LÕI.
/// Tầng ④ không mở giao dịch — mở thêm ở đó là hai giao dịch trên hai kết nối,
/// và `completeAuditRow` rơi ra ngoài giao dịch chính.
export type Tx = Omit<typeof db, "$connect" | "$disconnect" | "$transaction" | "$extends">;

export async function tx<T>(fn: (t: Tx) => Promise<T>): Promise<T> {
  return db.$transaction(async (t) => fn(t as unknown as Tx));
}

export { Prisma };
