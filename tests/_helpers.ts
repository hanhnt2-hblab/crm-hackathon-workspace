// Khối dùng chung của bốn tệp `T-1`, `T-3`, `T-5`, `T-7` (`C0-8`).
//
// ⚠ KHÔNG phải một tệp kiểm — và thứ loại nó ra là **thiếu hậu tố `.test`**,
// KHÔNG phải dấu gạch dưới: `vitest.config.ts` gom `tests/**/*.test.ts`, nên một
// tệp tên `_foo.test.ts` vẫn bị gom. Nó cũng KHÔNG sửa `tests/setup.ts` — tệp
// đó thuộc `C0-8` và đã đóng băng.
//
// ⚠ BA TỆP CÒN LẠI CHƯA DÙNG KHỐI NÀY. `T2`, `T10A` và `T10B` vẫn tự dựng
// `mutedCtx`, tự `db.user.create`, tự dựng Bản chụp/Bản lưu và tự gọi
// `createRegistry`. Đó đúng bốn thứ tệp này vừa đóng gói, nên `C0-8` đang có hai
// nguồn. Không gộp ở đây vì ba tệp ấy thuộc cục ⑤ và ④ và đang xanh; đã ghi vào
// `deferred-work.md`.
//
// ⚠ VÌ SAO KHÔNG NHẬP `appRegistry` CỦA `src/app/_registry.ts`.
// Tệp đó dựng sink `keepAudit: true` ở MỨC MODULE, nên mọi tệp kiểm nhập nó đều
// đổ hàng vào `audit_record`. `T-5` đếm hàng ghi vết của CHÍNH NÓ theo
// `actorUserId`, nên nhiễu từ ba tệp kia phải bằng 0. Hai nhà máy dưới đây tách
// đúng hai nhu cầu: một cái CÂM cho tệp không kiểm ghi vết, một cái GHI THẬT cho
// tệp có kiểm (`AD-CR-8` — sink chọn MỘT LẦN lúc dựng, không rẽ nhánh lúc chạy).
//
// `createRegistry` là NHÀ MÁY chứ không singleton chính vì ca này (`AD-CP-1`,
// chú thích đầu `src/capability/registry.ts`).

import { createHash } from "node:crypto";
import { db, dbIncludingDeleted } from "@/core/db";
import { createRegistry, type Registry } from "@/capability/registry";
import { createAuditSink } from "@/core/audit";
import { normalize, NORMALIZER_VERSION } from "@/core/normalize";
import type { Actor, Role } from "@/core/actor";
import type { CoreContext } from "@/core/context";
import type { SettingKey } from "@/core/settings";

/// Tác nhân MÁY và tác nhân GIEO — dùng cho các vế đối chứng (§5 của đề bài;
/// `NFR-14`–`NFR-17` và `NFR-19` ở PRD §9. ⚠ KHÔNG viết dải `NFR-14`…`NFR-19`:
/// `NFR-18` nằm giữa dải đó và là luật *độ tươi hồ sơ 30 ngày*, không phải ranh giới).
export const machine: Actor = { kind: "system" };
export const seeder: Actor = { kind: "seed" };

/// Ngữ cảnh lõi với ghi vết CÂM (`AD-20` + `TR-4`). Dùng khi dựng dữ liệu nền:
/// một sink thật ở đó để lại hàng làm nhiễu phép đếm của `T-5`.
export const mutedCtx: CoreContext = {
  auditId: null,
  causedBy: null,
  audit: createAuditSink({ seedMode: true, keepAudit: false }),
};

/// Sổ đăng ký CÂM — đi đủ bảy bước của Cổng (`AD-4`), nhưng không ghi vết.
/// `seedMode: false` có chủ đích: bước ② của Cổng chỉ miễn trừ khi CẢ HAI vế
/// đúng, và một bộ kiểm chạy ở chế-độ-gieo sẽ bỏ qua đúng những luật nó phải đo.
export function mutedRegistry(): Registry {
  return createRegistry({
    seedMode: false,
    auditSink: createAuditSink({ seedMode: true, keepAudit: false }),
  });
}

/// Sổ đăng ký GHI VẾT THẬT — giống hệt nhánh web (`src/app/_registry.ts:32`).
/// Chỉ `T-5` và `T-7` dùng, vì chỉ hai tệp đó khẳng định trên `audit_record`.
export function auditedRegistry(): Registry {
  return createRegistry({
    seedMode: false,
    auditSink: createAuditSink({ seedMode: false, keepAudit: true }),
  });
}

export type TestUser = { id: string; actor: Extract<Actor, { kind: "human" }> };

/// Một người MỚI cho mỗi lượt chạy. `email` mang `Date.now()` + hậu tố ngẫu
/// nhiên nên hai lượt chạy liên tiếp không đụng nhau, và mọi phép đếm ghi vết
/// lọc theo `actorUserId` này — tức chúng miễn nhiễm với dữ liệu của tệp khác.
export async function createTestUser(tag: string, role: Role = "sales"): Promise<TestUser> {
  const row = await db.user.create({
    data: {
      email: `${tag}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@x.test`,
      displayName: tag,
      role,
    },
    select: { id: true },
  });
  return { id: row.id, actor: { kind: "human", userId: row.id, role } };
}

/// Bản chụp + Bản lưu dựng THẲNG bằng Prisma — cùng đường mà `tests/T2.test.ts`
/// đã đi. Hai bảng này chưa có capability ghi nào; chúng thuộc `src/ingest`.
///
/// ⚠ Bảng danh-sách-cho-phép của `AD-1` mở `tests/**` cho `@prisma/client` ở
/// mức ĐỌC. Bốn lời gọi `create`/`upsert` trong tệp này vượt quá mức đó — một
/// khoảng lệch ĐÃ CÓ TRƯỚC (`T2.test.ts` viện đúng `AD-1` cho cùng việc), không
/// phải chỗ tệp này tự mở. Nêu ra thay vì trích `AD-1` như một giấy phép.
///
/// `normalizedText` tính bằng chính `normalize()` của lõi, KHÔNG chép tay:
/// `AD-18` chốt offset câu trích đánh chỉ số vào chuỗi này, nên một bản chuẩn hoá
/// tự chế ở đây sẽ làm `T-3` đo trên một sự thật khác với sản phẩm. Cùng lý do,
/// `normalizerVersion` lấy từ hằng `NORMALIZER_VERSION` chứ không gõ số `1`: ghi
/// số cứng thì kịch bản mà `AD-18` dựng ra để chặn — đổi hàm chuẩn hoá mà quên
/// tăng phiên bản — vẫn xanh, và offset cũ trôi trong im lặng.
export async function createArticle(
  accountId: string,
  rawText: string,
  version: "truoc" | "sau" = "truoc",
): Promise<{ id: string; normalizedText: string }> {
  const snapshot = await db.snapshot.create({
    data: { accountId, version, capturedAt: new Date() },
    select: { id: true },
  });
  const normalizedText = normalize(rawText);
  const article = await db.article.create({
    data: {
      accountId,
      snapshotId: snapshot.id,
      rawText,
      normalizedText,
      normalizerVersion: NORMALIZER_VERSION,
      readAt: new Date(),
      // Hash THẬT của nội dung. Bản trước ghép `accountId-version-độ dài`, và
      // `src/ingest/fingerprint.ts` khớp Bản chụp bằng đúng cột này — hai bài
      // cùng Công ty, cùng phiên bản, cùng độ dài sẽ trông như một.
      contentHash: createHash("sha256").update(rawText).digest("hex"),
    },
    select: { id: true },
  });
  return { id: article.id, normalizedText };
}

/// Đồng hồ của POSTGRES, không của Node. `audit_record.created_at` là
/// `@default(now())`, tức giờ của container `db_test`; một mốc lấy từ
/// `new Date()` của máy chủ lệch vài giây là đủ để một bộ lọc `createdAt >= moc`
/// bỏ sót hoặc kéo thêm hàng, và phép kiểm hỏng theo cách không đọc được.
export async function dbNow(): Promise<Date> {
  const rows = await dbIncludingDeleted.$queryRaw<Array<{ now: Date }>>`SELECT now() AS now`;
  return rows[0]!.now;
}

/// Đặt một tham số `settings` và trả về hàm KHÔI PHỤC (`AD-15` — đọc mỗi lần
/// dùng, nên ghi ở đây có hiệu lực ngay với mọi lời gọi sau).
///
/// Trả hàm khôi phục thay vì ghi đè bằng mặc định: bảng có thể đã có hàng, và
/// xoá nó đi là đổi trạng thái của cả lượt chạy — `T-9` đọc cùng khoá này.
///
/// ⚠ Lượt ĐỌC đi bằng `dbIncludingDeleted`. Extension của `AD-14` chỉ vá thao
/// tác ĐỌC, nên `db.setting.findUnique` lọc `deleted_at IS NULL` trong khi
/// `upsert` thì không: một hàng đã xoá mềm sẽ cho `before === null`, `upsert`
/// vẫn sửa đúng hàng đó, rồi hàm khôi phục xoá CỨNG một hàng mà tệp kiểm không
/// tạo ra.
export async function setSetting(
  key: SettingKey,
  value: string,
): Promise<() => Promise<void>> {
  const before = await dbIncludingDeleted.setting.findUnique({
    where: { key },
    select: { value: true },
  });
  await db.setting.upsert({ where: { key }, create: { key, value }, update: { value } });
  return async () => {
    if (before) {
      await db.setting.update({ where: { key }, data: { value: before.value } });
    } else {
      await db.setting.deleteMany({ where: { key } });
    }
  };
}

/// Hàng ghi vết của MỘT người, cho MỘT capability (`AD-4` bất biến ①).
/// ⚠ `audit_record.account_id` KHÔNG bao giờ được `registry.ts` điền — `begin()`
/// nhận trường đó nhưng sổ đăng ký truyền `undefined`. Nên lọc theo Công ty là
/// bất khả, và `actorUserId` là khoá hẹp nhất còn dùng được.
export async function auditRows(userId: string, capability: string) {
  return db.auditRecord.findMany({
    where: { actorUserId: userId, capability },
    // Khoá sắp HAI TẦNG: `created_at` là `Timestamptz(6)`, và hai lời gọi liền
    // nhau có thể rơi vào cùng một micro-giây trên một máy nhanh. Thiếu tầng
    // thứ hai thì thứ tự do Postgres quyết, và `toEqual(["ok","no_op"])` chập chờn.
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    select: {
      capability: true, decision: true, denyReason: true, outcome: true,
      actorKind: true, actorUserId: true, actorRole: true,
      valueBefore: true, valueAfter: true, completedAt: true,
    },
  });
}
