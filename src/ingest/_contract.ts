// `AD-UI-19` · `AD-UI-15` · `AD-1` — hợp đồng giữa `src/ingest` và tầng ④.
//
// `src/ingest` là tầng ①: nó đi xuống **chỉ** qua `loadCapability()`, và
// `BoundCapability` trả `Promise<unknown>`. `unknown` là đúng ở ranh giới —
// tầng ④ không biết bên gọi là ai nên không hứa kiểu trả về — nhưng nếu để
// `unknown` lan vào thân `src/ingest` thì mọi truy cập trường phải ép kiểu, và
// một lần đổi hình dạng ở tầng ④ trôi qua `tsc` im lặng.
//
// Tệp này là chỗ DUY NHẤT của `src/ingest` biến `unknown` thành kiểu, và nó làm
// bằng KIỂM LÚC CHẠY chứ không bằng `as`. Ép kiểu thì lệch hợp đồng lộ ra dưới
// dạng `undefined is not an object` ở một dòng cách xa nguyên nhân; kiểm lúc
// chạy thì nó lộ ra ngay tại ranh giới, kèm tên capability.
//
// ⚠ `src/ingest` KHÔNG nhập `src/scan` và ngược lại (`AD-UI-2`). Hai tệp
// `_contract.ts` gần giống nhau là cái giá đã biết của luật đó; gộp chúng vào
// một `src/shared` là dựng đúng nút mà `AD-UI-2` cấm.

import type { Actor } from "@/core/actor";
import type { Registry } from "@/capability/registry";

/// Hai phiên bản Bản chụp của đề bài `§3`. Giá trị tiếng Việt KHÔNG DẤU theo
/// Mục 0; cột `snapshot.version` là `String` trần nên từ vựng đóng ở đây.
export const SNAPSHOT_VERSIONS = ["truoc", "sau"] as const;
export type SnapshotVersion = (typeof SNAPSHOT_VERSIONS)[number];

export function isSnapshotVersion(v: string): v is SnapshotVersion {
  return (SNAPSHOT_VERSIONS as readonly string[]).includes(v);
}

/// Một Bản chụp đọc từ bộ dữ liệu BTC, đã bóc thẻ, CHƯA chuẩn hoá.
///
/// `rawText` là **văn bản thuần** — `AD-18` chốt đầu ra của ingest là văn bản
/// thuần, và chính nó là bản thô nộp qua `createArticle`. Khoảng trắng và
/// Unicode để nguyên: lõi dọn (`src/core/normalize.ts`), không phải tệp này.
export type SnapshotDoc = {
  /// Khoá tự nhiên từ nguồn (`AD-UI-17`). KHÔNG phải `accountId` — Công ty có
  /// thể chưa được nạp lúc đọc thư mục Bản chụp.
  accountSourceRef: string;
  version: SnapshotVersion;
  capturedAt: Date;
  rawText: string;
  publishedUrl: string | null;
  /// `readable = false` là trạng thái HỢP LỆ, `FR-50`: *"nguồn không đọc được
  /// thì ghi lại là không đọc được. Hệ thống không đoán"*.
  readable: boolean;
  unreadableReason: string | null;
};

// ───────────── Hình dạng tham số và kết quả của capability đã gọi ─────────────

/// `AD-18` — `src/ingest` nộp bản THÔ; lõi sinh bản chuẩn hoá và lưu cả hai.
///
/// ⚠ `contentHash` do BÊN GỌI cấp, không do lõi tự tính, và đó là một quyết
/// định phải đọc kỹ. Dấu vân của `D18` phải tính **sau khi loại dấu thời gian
/// hiển thị, số phiên bản, số lượt xem** — mà việc loại đó PHỤ THUỘC ĐỊNH DẠNG
/// NGUỒN, tức thuộc `src/ingest` theo mốc cắt của `AD-18`, không thuộc lõi. Nếu
/// lõi tự băm `normalized_text`, hai bên băm hai đầu vào khác nhau và phép so
/// trùng của `FR-50` so hai họ hash — luôn khác, nên **mỗi lần chuyển lùi lại
/// đẻ một Bản lưu mới**, đúng thứ `FR-50` cấm.
export type CreateArticleInput = {
  accountId: string;
  snapshotVersion: SnapshotVersion;
  /// ISO 8601. `z.iso.datetime()` ở tầng ④, KHÔNG `z.date()` (Zod 4 ném lúc dựng).
  capturedAt: string;
  rawText: string;
  contentHash: string;
  publishedUrl: string | null;
  readable: boolean;
  unreadableReason: string | null;
};

/// Đã lưu, hay đã bỏ vì trùng dấu vân. Hai nhánh phân biệt được, vì bên gọi
/// phải đếm chúng riêng cho báo cáo đối soát (`TR-3`) và cho `T-8`.
export type CreateArticleResult =
  | { created: true; articleId: string; snapshotId: string }
  | { created: false; reason: "trung_hash"; articleId: string; snapshotId: string };

/// Dấu vân của MỘT Bản lưu đã có. `FR-50` so với **mọi** bản, nên bên gọi cần
/// cả danh sách chứ không chỉ bản gần nhất.
export type ArticleFingerprint = {
  articleId: string;
  snapshotId: string;
  version: string;
  contentHash: string;
  capturedAt: string;
};

// ─────────────────────── Bộ kiểm lúc chạy ở ranh giới ───────────────────────

class ContractError extends Error {
  constructor(capability: string, detail: string) {
    super(`Hợp đồng tầng ④ lệch ở \`${capability}\`: ${detail}`);
    this.name = "ContractError";
  }
}

function asRecord(cap: string, v: unknown): Record<string, unknown> {
  if (typeof v !== "object" || v === null) {
    throw new ContractError(cap, `mong đợi một đối tượng, nhận \`${typeof v}\`.`);
  }
  return v as Record<string, unknown>;
}

function str(cap: string, o: Record<string, unknown>, k: string): string {
  const v = o[k];
  if (typeof v !== "string") throw new ContractError(cap, `trường \`${k}\` không phải chuỗi.`);
  return v;
}

export function parseCreateArticleResult(v: unknown): CreateArticleResult {
  const o = asRecord("createArticle", v);
  const articleId = str("createArticle", o, "articleId");
  const snapshotId = str("createArticle", o, "snapshotId");
  if (o.created === true) return { created: true, articleId, snapshotId };
  if (o.created === false) {
    return { created: false, reason: "trung_hash", articleId, snapshotId };
  }
  throw new ContractError("createArticle", "thiếu cờ `created` kiểu boolean.");
}

export function parseArticleFingerprints(v: unknown): ArticleFingerprint[] {
  if (!Array.isArray(v)) throw new ContractError("readArticle", "mong đợi một mảng.");
  return v.map((row) => {
    const o = asRecord("readArticle", row);
    return {
      articleId: str("readArticle", o, "id"),
      snapshotId: str("readArticle", o, "snapshotId"),
      version: str("readArticle", o, "version"),
      contentHash: str("readArticle", o, "contentHash"),
      capturedAt: str("readArticle", o, "capturedAt"),
    };
  });
}

/// Danh sách Công ty do `readAccountList` trả. Chỉ rút BA trường thật sự dùng —
/// rút hết là buộc tệp này biết cả hình dạng bảng `account`, đúng thứ `AD-1`
/// tách ra khỏi tầng ①.
export type AccountRef = { id: string; name: string; sourceRef: string | null };

/// Nhận HAI hình dạng — mảng trần, hoặc `{ rows: [...] }`. Hai mục
/// `readAccountList` đang cùng tồn tại trong repo và trả hai hình dạng khác
/// nhau; xem cảnh báo XUNG ĐỘT ở `src/capability/caps/scan.ts`.
export function parseAccountList(v: unknown): AccountRef[] {
  const rows = Array.isArray(v) ? v : (asRecord("readAccountList", v).rows as unknown);
  if (!Array.isArray(rows)) {
    throw new ContractError("readAccountList", "mong đợi một mảng hoặc `{ rows: [...] }`.");
  }
  return rows.map((row) => {
    const o = asRecord("readAccountList", row);
    const sourceRef = o.sourceRef;
    return {
      id: str("readAccountList", o, "id"),
      name: str("readAccountList", o, "name"),
      sourceRef: typeof sourceRef === "string" ? sourceRef : null,
    };
  });
}

/// Gọi một capability qua sổ đăng ký. `src/ingest` chạy dưới actor `seed`
/// (`AD-20`), nhưng hàm này không tự chốt actor — `switch.ts` phục vụ cả một
/// thao tác của NGƯỜI (`FR-50` từ giao diện), và ép `seed` ở đây làm thao tác
/// đó ghi vết dưới danh nghĩa bộ nạp.
export async function callCap(
  registry: Registry,
  actor: Actor,
  name: string,
  params: unknown,
): Promise<unknown> {
  const bound = await registry.loadCapability(name, actor);
  return bound(params);
}
