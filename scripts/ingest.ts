// `§3` · `FR-50` · `T-6` · `T-8` — ĐIỂM VÀO của `src/ingest`.
//
// ⚠ VÌ SAO TỆP NÀY TỒN TẠI. `src/ingest` có đủ `readSnapshotDataset`,
// `loadSnapshotBaseline` và `switchAccountSnapshotVersion` — nhưng **không có
// bên gọi nào**. Không script, không lệnh npm, không bộ dữ liệu. Hệ quả đo được
// trên bản demo: bật Đang theo dõi cho ba Công ty, vòng quét chạy đều mỗi phút
// và in `quét 3 Công ty · nội dung mới 0 · 0 lượt gọi, $0.0000` — vì bảng
// `article` RỖNG. Không có Bản lưu thì không có gì để đọc, nên không có lượt gọi
// mô hình nào, và người xem kết luận *"AI không chạy"*.
//
// `§3` nói rõ nguồn web trong đề bài **là các Bản chụp tĩnh**, không phải trang
// thật. Nên nạp Bản chụp không phải một tiện ích demo — nó là cách duy nhất nội
// dung vào được hệ thống.
//
// Hai thao tác, đúng như `§3` mô tả:
//     npm run ingest                       nạp phiên bản `truoc` cho cả bộ
//     npm run ingest -- --switch=<ref>     đổi MỘT Công ty sang `sau`
//     npm run ingest -- --switch=<ref> --to=truoc     lùi lại
//
// `--switch` là thao tác mà `T-6` gọi là *"đổi một công ty sang phiên bản trang
// web sau"* và `T-8` gọi là *"đổi nguồn của hai công ty"*.
//
// ⚠ TÁC NHÂN LÀ `seed`, và đó là giới hạn phải nói ra. `§3` xếp việc đổi phiên
// bản vào `CAP_HUMAN_ONLY` khi nó đến từ giao diện; ở đây nó đến từ một lệnh
// dựng dữ liệu, nên ghi vết mang danh bộ nạp. Giám khảo bấm đổi nguồn TRÊN GIAO
// DIỆN thì đường đó phải mang `actor: human` — bề mặt ấy chưa dựng, và đây là
// chỗ ghi lại điều đó.

import { createRegistry } from "../src/capability/registry";
import { createAuditSink } from "../src/core/audit";
import {
  loadSnapshotBaseline,
  switchAccountSnapshotVersion,
  renderSnapshotReport,
} from "../src/ingest/load-snapshots";
import { isSnapshotVersion } from "../src/ingest/_contract";
import type { Actor } from "../src/core/actor";

const DATASET_DIR = "data/snapshots";

function co(ten: string): string | null {
  const p = process.argv.find((a) => a.startsWith(`--${ten}=`));
  return p ? p.slice(ten.length + 3) : null;
}

async function main(): Promise<void> {
  const registry = createRegistry({
    seedMode: true,
    // `keepAudit: true` — KHÁC bộ gieo. Nạp Bản chụp sinh ra Bản lưu, tức dữ
    // liệu mà `T-8` đếm; giấu vết của nó thì không tra được *"mục này từ đâu"*.
    auditSink: createAuditSink({ seedMode: true, keepAudit: true }),
  });
  const actor: Actor = { kind: "seed" };
  const deps = { registry, actor };

  const doiRef = co("switch");
  if (doiRef !== null) {
    const toRaw = co("to") ?? "sau";
    if (!isSnapshotVersion(toRaw)) {
      console.error(`Phiên bản không hợp lệ: \`${toRaw}\`. Chỉ có \`truoc\` hoặc \`sau\`.`);
      process.exit(1);
    }
    const r = await switchAccountSnapshotVersion(deps, {
      accountSourceRef: doiRef,
      to: toRaw,
      datasetDir: DATASET_DIR,
    });
    console.log(`đổi nguồn \`${doiRef}\` → \`${toRaw}\`: ${r.kind}`);
    if (r.kind === "loi") {
      console.error(`  ${r.message}`);
      process.exit(1);
    }
    process.exit(0);
  }

  const report = await loadSnapshotBaseline(deps, DATASET_DIR);
  console.log(renderSnapshotReport(report));
  process.exit(0);
}

main().catch((e: unknown) => {
  console.error("nạp Bản chụp HỎNG:", e instanceof Error ? e.message : String(e));
  process.exit(1);
});
