// `FR-50` · `D18` · `AD-UI-17` · `AD-UI-18` — nạp Bản chụp, và đổi phiên bản.
//
// Hai đường ra của tệp này, và chúng dùng CHUNG một phép quyết định:
//
//   · `loadSnapshotBaseline` — nạp phiên bản *trước* cho mọi Công ty. Chạy một
//     lần trong `npm run seed`, dưới actor `seed` (`AD-20`).
//   · `switchAccountSnapshotVersion` — `FR-50`: chuyển MỘT Công ty sang *sau*
//     (hoặc lùi về *trước*), từ giao diện hoặc bằng một lệnh. Đây là **cách duy
//     nhất kích hoạt mọi kịch bản AI**, và là tiền đề của cả `T-6` lẫn `T-8`.
//
// Phép quyết định chung là `decideCreateSnapshot` của `fingerprint.ts`, và nó
// so với **MỌI** Bản lưu chứ không chỉ bản gần nhất (`FR-50`). Đường lùi mới là
// đường phơi bày sai lầm: *trước* → *sau* → *trước* thì bước ba trùng bước một
// nhưng khác bước hai, nên phép so *"khác bản gần nhất"* nói là nội dung mới.
//
// ⚠ TẦNG ①: không `db`, không `tx`, không `@prisma/client`. Mọi lần chạm dữ
// liệu đi qua `loadCapability()` (`AD-1`), kể cả lượt ĐỌC để so dấu vân —
// `AD-19` khai phạm vi sổ đăng ký phủ cả đọc lẫn ghi, đúng để không có lối tắt
// nào mang tên *"chỉ đọc thôi mà"*.

import type { Actor } from "@/core/actor";
import type { Registry } from "@/capability/registry";
import {
  callCap,
  parseAccountList,
  parseArticleFingerprints,
  parseCreateArticleResult,
  type CreateArticleInput,
  type SnapshotDoc,
  type SnapshotVersion,
} from "./_contract";
import { contentFingerprint, decideCreateSnapshot } from "./fingerprint";
import { readSnapshotDataset } from "./snapshot-source";

/// Kết cục của MỘT Bản chụp, ba nhánh có tên (`AD-UI-16`).
export type SnapshotOutcome =
  | { kind: "tao_moi"; accountSourceRef: string; version: SnapshotVersion; articleId: string }
  | {
      kind: "bo_qua_trung_hash";
      accountSourceRef: string;
      version: SnapshotVersion;
      matchedArticleId: string;
      matchedVersion: string;
    }
  | { kind: "bo_qua_khong_co_cong_ty"; accountSourceRef: string; version: SnapshotVersion }
  | { kind: "loi"; accountSourceRef: string; version: SnapshotVersion; message: string };

/// Dòng `TỔNG` mà `TR-3` so (`AD-UI-18`).
export type SnapshotLoadReport = {
  source: number;
  created: number;
  skippedDuplicate: number;
  skippedNoAccount: number;
  failed: number;
  outcomes: SnapshotOutcome[];
};

export function renderSnapshotReport(r: SnapshotLoadReport): string {
  return (
    `Bản chụp  nguồn=${r.source}  tạo mới=${r.created}  `
    + `bỏ qua=${r.skippedDuplicate + r.skippedNoAccount} `
    + `(trùng dấu vân ${r.skippedDuplicate}, chưa có Công ty ${r.skippedNoAccount})  `
    + `lỗi=${r.failed}  TỔNG=${r.created + r.skippedDuplicate + r.skippedNoAccount + r.failed}`
  );
}

type Deps = { registry: Registry; actor: Actor };

/// Ánh xạ `source_ref` → `accountId`, đọc MỘT LẦN cho cả lượt nạp.
///
/// Đọc mỗi Công ty một lượt thì với 15 Công ty × 2 phiên bản là 30 lời gọi
/// capability cho một bảng tra không đổi trong lượt — và mỗi lời gọi kéo theo
/// một dòng ghi vết pha 1 (`AD-CP-2`), nên cái giá không chỉ là thời gian.
async function readAccountIndex(deps: Deps): Promise<Map<string, string>> {
  const rows = parseAccountList(
    await callCap(deps.registry, deps.actor, "readAccountList", {}),
  );
  const index = new Map<string, string>();
  for (const r of rows) {
    if (r.sourceRef) index.set(r.sourceRef, r.id);
  }
  return index;
}

/// Nạp MỘT Bản chụp, đã biết `accountId`. Đây là chỗ `D18` được cưỡng chế.
export async function ingestSnapshotDoc(
  deps: Deps,
  accountId: string,
  doc: SnapshotDoc,
): Promise<SnapshotOutcome> {
  const hash = contentFingerprint(doc.rawText);

  // ① dấu vân của MỌI Bản lưu đã có của Công ty này (`FR-50`)
  const existing = parseArticleFingerprints(
    await callCap(deps.registry, deps.actor, "readArticle", {
      accountId,
      scope: "all",
    }),
  );

  // ② quyết định — hàm THUẦN, kiểm được bằng bảng vào/ra, không cần cơ sở dữ liệu
  const decision = decideCreateSnapshot(hash, existing);
  if (!decision.create) {
    return {
      kind: "bo_qua_trung_hash",
      accountSourceRef: doc.accountSourceRef,
      version: doc.version,
      matchedArticleId: decision.matchedArticleId,
      matchedVersion: decision.matchedVersion,
    };
  }

  // ③ ghi. `contentHash` nộp KÈM, không để lõi tự tính — xem `_contract.ts`.
  const input: CreateArticleInput = {
    accountId,
    snapshotVersion: doc.version,
    capturedAt: doc.capturedAt.toISOString(),
    rawText: doc.rawText,
    contentHash: hash,
    publishedUrl: doc.publishedUrl,
    readable: doc.readable,
    unreadableReason: doc.unreadableReason,
  };
  const result = parseCreateArticleResult(
    await callCap(deps.registry, deps.actor, "createArticle", input),
  );

  // Lõi vẫn có quyền nói *"trùng"* — nó thấy một cuộc đua mà bước ① không thấy.
  // Tin nó, đừng tin quyết định của mình: bước ① đọc ở một thời điểm trước.
  if (!result.created) {
    return {
      kind: "bo_qua_trung_hash",
      accountSourceRef: doc.accountSourceRef,
      version: doc.version,
      matchedArticleId: result.articleId,
      matchedVersion: doc.version,
    };
  }
  return {
    kind: "tao_moi",
    accountSourceRef: doc.accountSourceRef,
    version: doc.version,
    articleId: result.articleId,
  };
}

/// `§7.5` — nạp phiên bản *trước* cho mọi Công ty trong bộ dữ liệu.
///
/// Chỉ *trước*: phiên bản *sau* là thứ NGƯỜI bật lên bằng `FR-50` để kích hoạt
/// kịch bản. Nạp cả hai ngay từ đầu thì vòng quét thấy nội dung mới ở vòng đầu
/// tiên mà không ai bấm gì, và `T-6` mất mất điều kiện *"đổi một Công ty đang
/// có cơ hội mở sang phiên bản sau"* — nó đã ở đó sẵn.
export async function loadSnapshotBaseline(
  deps: Deps,
  datasetDir: string,
): Promise<SnapshotLoadReport> {
  const { docs } = await readSnapshotDataset(datasetDir);
  const baseline = docs.filter((d) => d.version === "truoc");
  const index = await readAccountIndex(deps);
  const outcomes: SnapshotOutcome[] = [];

  for (const doc of baseline) {
    const accountId = index.get(doc.accountSourceRef);
    if (!accountId) {
      outcomes.push({
        kind: "bo_qua_khong_co_cong_ty",
        accountSourceRef: doc.accountSourceRef,
        version: doc.version,
      });
      continue;
    }
    outcomes.push(await runGuarded(deps, accountId, doc));
  }

  return tally(baseline.length, outcomes);
}

/// `FR-50` — MỘT thao tác: chuyển một Công ty sang phiên bản *sau*, hoặc lùi
/// về *trước*.
///
/// Gọi được từ hai chỗ và cố ý không tự chốt actor: từ giao diện thì
/// `actor = { kind: 'human', … }` và `§3` xếp việc này vào `CAP_HUMAN_ONLY`; từ
/// một lệnh dựng dữ liệu demo thì `seed`. Chốt `seed` ở đây làm cú bấm của
/// giám khảo ghi vết dưới danh nghĩa bộ nạp, và `T-7` mất bằng chứng *ai bấm*.
export async function switchAccountSnapshotVersion(
  deps: Deps,
  input: { accountSourceRef: string; to: SnapshotVersion; datasetDir: string },
): Promise<SnapshotOutcome> {
  const { docs } = await readSnapshotDataset(input.datasetDir);
  const doc = docs.find(
    (d) => d.accountSourceRef === input.accountSourceRef && d.version === input.to,
  );
  if (!doc) {
    return {
      kind: "loi",
      accountSourceRef: input.accountSourceRef,
      version: input.to,
      message:
        `Bộ dữ liệu không có phiên bản \`${input.to}\` của \`${input.accountSourceRef}\`.`,
    };
  }

  const index = await readAccountIndex(deps);
  const accountId = index.get(input.accountSourceRef);
  if (!accountId) {
    return {
      kind: "bo_qua_khong_co_cong_ty",
      accountSourceRef: input.accountSourceRef,
      version: input.to,
    };
  }
  return runGuarded(deps, accountId, doc);
}

/// Một Bản chụp hỏng KHÔNG được giết cả lượt nạp. Cùng lập luận `AD-11` dùng
/// cho `error_max_turns`: đó là lỗi của **một** Bản lưu, không phải lỗi của
/// lượt — để nó lan ra thì một trang dị dạng giết 15 Công ty.
async function runGuarded(
  deps: Deps,
  accountId: string,
  doc: SnapshotDoc,
): Promise<SnapshotOutcome> {
  try {
    return await ingestSnapshotDoc(deps, accountId, doc);
  } catch (e) {
    return {
      kind: "loi",
      accountSourceRef: doc.accountSourceRef,
      version: doc.version,
      message: e instanceof Error ? e.message : String(e),
    };
  }
}

function tally(source: number, outcomes: SnapshotOutcome[]): SnapshotLoadReport {
  return {
    source,
    created: outcomes.filter((o) => o.kind === "tao_moi").length,
    skippedDuplicate: outcomes.filter((o) => o.kind === "bo_qua_trung_hash").length,
    skippedNoAccount: outcomes.filter((o) => o.kind === "bo_qua_khong_co_cong_ty").length,
    failed: outcomes.filter((o) => o.kind === "loi").length,
    outcomes,
  };
}
