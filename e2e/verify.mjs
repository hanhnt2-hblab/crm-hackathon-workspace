#!/usr/bin/env node
// MỘT LỆNH của §6 — `npm run verify`.
//
// Đề bài §6: *"Đội phải nộp một bộ kiểm thử tự động chạy được bằng **một lệnh**,
// phủ đủ 10 điểm dưới đây. **Ban giám khảo chạy chính bộ này**, cộng với việc
// thử tay"*.
//
// Ba điều đó quyết định toàn bộ hình dạng tệp này:
//   ① **Một lệnh** là tiêu chí nghiệm thu. Người chấm không được phải gõ
//      `build` rồi `seed` rồi `e2e`. Tệp này lo hết, theo đúng thứ tự.
//   ② **Máy của họ, checkout sạch.** Nên nó tự cài trình duyệt Playwright nếu
//      thiếu, và khi không cài được thì báo bằng tiếng Việt có nghĩa chứ không
//      chết giữa chừng với một vết ngăn xếp Node.
//   ③ **Phủ đủ 10 điểm.** Nên nó in ĐÚNG mười dòng `T-1`…`T-10` và thoát mã
//      khác 0 nếu bất kỳ dòng nào đỏ.
//
// ⚠ HAI BỘ KIỂM, KHÔNG PHẢI MỘT. Chúng trả lời hai câu khác nhau và không bộ
// nào thay được bộ kia:
//   · **Vitest** (`tests/**`, CSDL 5443) — luật nghiệp vụ, Cổng, ranh giới kiến
//     trúc. `T-2` và `T-10` thuộc về đây: §6 nói thẳng *"thử ghi thẳng"* và
//     *"không đi qua giao diện người dùng"*.
//   · **Playwright** (`e2e/**`, CSDL demo 5442, bản dựng production) — thứ
//     jsdom không chứng minh được: kéo thả `T-1`, đánh dấu đoạn văn `T-3`, một
//     cú bấm Hoàn tác `T-7`.
// Một điểm `T` XANH khi cả hai bộ đều xanh ở điểm đó. Bộ nào không có ca nào
// cho điểm đó thì không kéo nó xuống — cột trống, không phải cột đỏ.

import { spawnSync } from "node:child_process";
import { vietTrangDan } from "./_report.mjs";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { platform } from "node:process";

const T_COUNT = 10;
const E2E_JSON = "test-results/e2e-results.json";
/// ⚠ KHÔNG đặt trong `test-results/`, và đây là chỗ bộ nghiệm thu từng TỰ NÓI DỐI.
///
/// Playwright **xoá sạch `test-results/`** ở đầu mỗi lượt chạy. Vitest chạy
/// trước, ghi JSON của nó vào đó, rồi Playwright quét sạch — nên bước phân tích
/// không tìm thấy gì và cột *Tầng dưới* in `—` cho cả mười điểm. Đo được: nhật
/// ký có dòng `JSON report written to …/test-results/unit-results.json`, mà tệp
/// thì không tồn tại lúc đọc.
///
/// Hậu quả không phải mất thẩm mỹ: `coDo` chỉ đọc `r.unit.fail`, và với dữ liệu
/// đã bị xoá thì `fail` luôn bằng 0 — **một bộ kiểm tầng dưới ĐỎ vẫn cho ra
/// dòng xanh**, rồi cả lệnh kết luận ĐẠT.
const UNIT_JSON = ".verify/unit-results.json";

/// Cờ dòng lệnh. `--only=e2e` và `--only=unit` là để GỠ LỖI trong lúc phát
/// triển; lượt chạy của ban giám khảo không truyền cờ nào.
const only = (process.argv.find((a) => a.startsWith("--only=")) ?? "").slice(7);
const chayUnit = only === "" || only === "unit";
const chayE2e = only === "" || only === "e2e";

const t0 = Date.now();

// ── Bước 1: trình duyệt ─────────────────────────────────────────────────────
//
// Lần chạy đầu trên máy lạ phải tải bộ Chromium (~150 MB nén). `playwright
// install` là lệnh TỰ NHẬN BIẾT: đã có thì nó thoát trong khoảng một giây, nên
// gọi vô điều kiện rẻ hơn nhiều so với đoán xem đã có chưa.
if (chayE2e) {
  console.log("→ Kiểm trình duyệt Playwright…");
  const args = ["playwright", "install", "chromium"];
  // `--with-deps` cài gói hệ thống bằng apt — chỉ có nghĩa trên Linux, và trên
  // Windows nó làm lệnh hỏng thay vì giúp được gì.
  if (platform === "linux") args.push("--with-deps");

  const r = spawnSync("npx", args, { stdio: "inherit", shell: platform === "win32" });
  if (r.status !== 0) {
    console.error(
      "\n✗ KHÔNG CÀI ĐƯỢC TRÌNH DUYỆT CHO PLAYWRIGHT.\n"
        + "\n  Bộ kiểm đầu-cuối cần Chromium, và lần chạy đầu trên một máy sạch phải tải"
        + "\n  khoảng 150 MB. Lệnh vừa hỏng là:"
        + `\n      npx ${args.join(" ")}`
        + "\n"
        + "\n  Ba nguyên nhân theo thứ tự hay gặp:"
        + "\n    · máy không ra được Internet, hoặc proxy chặn — đặt HTTPS_PROXY rồi chạy lại;"
        + "\n    · đĩa hết chỗ ở thư mục bộ đệm của Playwright;"
        + "\n    · phiên bản Node quá cũ — dự án cần Node >= 24.19.0."
        + "\n"
        + "\n  Bộ kiểm tầng dưới (Vitest) KHÔNG cần trình duyệt và vẫn chạy được:"
        + "\n      npm run verify -- --only=unit\n",
    );
    process.exit(1);
  }
}

// ── Bước 2: chạy hai bộ ─────────────────────────────────────────────────────
//
// Xoá kết quả cũ TRƯỚC khi chạy. Không xoá thì một lượt chạy hỏng giữa chừng để
// lại tệp JSON của lần trước, và bảng dưới đây báo xanh trên kết quả cũ — dạng
// sai tệ nhất, vì nó trông y hệt một lượt chạy thành công.
for (const f of [E2E_JSON, UNIT_JSON]) {
  if (existsSync(f)) rmSync(f);
}

/// `docker compose up -d --wait db_test` + `vitest run`. `tests/global-setup.ts`
/// tự lo `prisma generate` và dựng lược đồ, nên không cần bước riêng ở đây.
function chayVitest() {
  console.log("\n→ Bộ kiểm tầng dưới (Vitest) — luật nghiệp vụ, Cổng, ranh giới…\n");
  // ⚠ `--outputFile.json=` CÓ KHOÁ, không phải `--outputFile=`. Khi khai HAI
  // reporter, Vitest cần biết tệp này thuộc reporter nào; dạng không khoá làm
  // reporter `default` cũng cố ghi vào đó và tệp JSON ra rỗng — bảng mười dòng
  // khi ấy im lặng báo *TRỐNG* cho cả mười điểm.
  const r = spawnSync(
    "npx",
    [
      "vitest",
      "run",
      "--reporter=default",
      "--reporter=json",
      `--outputFile.json=${UNIT_JSON}`,
    ],
    { stdio: "inherit", shell: platform === "win32" },
  );
  return r.status ?? 1;
}

/// `playwright test` tự dựng sản phẩm và khởi động qua `webServer` trong
/// `playwright.config.ts`, nên ở đây không gọi `build` hay `start` riêng.
function chayPlaywright() {
  console.log("\n→ Bộ kiểm đầu-cuối (Playwright) — trình duyệt thật, bản dựng production…\n");
  const r = spawnSync("npx", ["playwright", "test"], {
    stdio: "inherit",
    shell: platform === "win32",
  });
  return r.status ?? 1;
}

// ⚠ GIỮ MÃ THOÁT. Bản trước gọi `chayVitest()` rồi vứt giá trị trả về, nên một
// bộ kiểm tầng dưới hỏng ở mức TIẾN TRÌNH — không dựng được, lỗi cú pháp, CSDL
// không lên — đi qua mà không để lại dấu nào trong phán quyết cuối.
const maUnit = chayUnit ? chayVitest() : 0;
const maE2e = chayE2e ? chayPlaywright() : 0;

// ── Bước 3: gộp kết quả về mười dòng ────────────────────────────────────────

/// Rút số hiệu `T` từ một chuỗi. `\b` sau nhóm số là bắt buộc: thiếu nó thì
/// `"T-10"` khớp luôn mẫu của `T-1`, và điểm `T-10` bị cộng vào dòng `T-1`.
function soHieuT(s) {
  const m = /\bT-(\d{1,2})\b/.exec(s ?? "");
  if (!m) return null;
  const n = Number(m[1]);
  return n >= 1 && n <= T_COUNT ? n : null;
}

/// Một ô của bảng: đếm đạt/hỏng, và `null` khi bộ đó không có ca nào cho điểm này.
const trong = () => ({ pass: 0, fail: 0 });
const bang = Array.from({ length: T_COUNT + 1 }, () => ({ unit: trong(), e2e: trong() }));

function docJson(path) {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

// Playwright — suite lồng nhau, mỗi `spec` mang `ok` và danh sách `tests`.
const e2eJson = docJson(E2E_JSON);
if (e2eJson) {
  const duyet = (suite, keMang) => {
    // Tên tệp (`T3.spec.ts`) là nguồn nhận dạng đáng tin hơn tiêu đề describe:
    // tiêu đề là nguyên văn §6 và có thể chứa nhiều chuỗi giống mã `T`.
    const nhan = soHieuT(suite.file ?? "") ?? soHieuT(suite.title ?? "") ?? keMang;
    for (const spec of suite.specs ?? []) {
      const n = nhan ?? soHieuT(spec.title ?? "");
      if (!n) continue;

      // ⚠ ĐỌC `status` CỦA TỪNG KẾT QUẢ, KHÔNG ĐỌC `spec.ok`.
      // Một phép kiểm KHÔNG CHẠY vẫn mang `ok: true` trong JSON của Playwright,
      // và ở `mode: "serial"` thì một ca đỏ chặn mọi ca sau nó — nên đếm theo
      // `spec.ok` sẽ cộng cả loạt ca chưa từng chạy vào cột xanh. Bảng khi đó
      // báo *"xanh 8"* cho một tệp chỉ thực sự chạy ba ca.
      for (const t of spec.tests ?? []) {
        for (const kq of t.results ?? []) {
          if (kq.status === "passed") bang[n].e2e.pass += 1;
          else if (kq.status === "failed" || kq.status === "timedOut") bang[n].e2e.fail += 1;
          // `skipped` / `interrupted` không thuộc bên nào — chúng là *chưa biết*.
        }
      }
    }
    for (const con of suite.suites ?? []) duyet(con, nhan);
  };
  for (const s of e2eJson.suites ?? []) duyet(s, null);
}

// Vitest — `testResults[]` mỗi phần tử là một TỆP, với `assertionResults[]`.
const unitJson = docJson(UNIT_JSON);
const thieuUnit = chayUnit && !unitJson;
if (thieuUnit) {
  // Im lặng bỏ qua ở đây là cách phán quyết cuối mất một nửa bằng chứng mà
  // không ai thấy. Hỏng ồn ào.
  console.error(
    [
      "",
      "‼ KHÔNG ĐỌC ĐƯỢC kết quả bộ kiểm tầng dưới — bảng dưới thiếu một nửa",
      "  bằng chứng, nên lượt chạy này KHÔNG kết luận được.",
      "",
    ].join("\n"),
  );
}
if (unitJson) {
  for (const tep of unitJson.testResults ?? []) {
    const nhan = soHieuT(tep.name ?? "");
    for (const ca of tep.assertionResults ?? []) {
      const n = nhan ?? soHieuT((ca.ancestorTitles ?? []).join(" "));
      if (!n) continue;
      // `todo` và `pending` KHÔNG tính là đạt. Một `it.todo` là lời hứa chưa
      // trả, và đếm nó thành xanh là đúng cách bộ nghiệm thu tự nói dối.
      if (ca.status === "passed") bang[n].unit.pass += 1;
      else if (ca.status === "failed") bang[n].unit.fail += 1;
    }
  }
}

// ── Bước 4: in bảng ─────────────────────────────────────────────────────────

const NHAN = {
  1: "Tắt AI, trọn nhóm 1 vẫn chạy",
  2: "Phát hiện thiếu câu trích: không lưu được",
  3: "Bấm Phát hiện mở đúng đoạn văn gốc",
  4: "Ba chu kỳ, hồ sơ vẫn y nguyên",
  5: "Ba lối ra Gợi ý đều để lại bản ghi",
  6: "Bản chụp sau — Việc tiếp theo tự đổi",
  7: "Hoàn tác một cú bấm",
  8: "Vòng quét chạy không ai bấm gì",
  9: "Tắt AI giữa lúc vòng quét chạy",
  10: "Ba thao tác hệ thống đều bị từ chối",
};

function o(x) {
  if (x.fail > 0) return `ĐỎ ${x.pass}/${x.pass + x.fail}`;
  if (x.pass > 0) return `xanh ${x.pass}`;
  return "—";
}

const giay = ((Date.now() - t0) / 1000).toFixed(0);

console.log(`\n${"═".repeat(78)}`);
console.log("BỘ NGHIỆM THU §6 — mười điểm T-1…T-10");
console.log("═".repeat(78));
console.log(
  `${"#".padEnd(6)}${"Điểm nghiệm thu".padEnd(42)}${"Tầng dưới".padEnd(12)}${"Trình duyệt".padEnd(13)}Kết`,
);
console.log("─".repeat(78));

let doTong = 0;
let trongTong = 0;
for (let n = 1; n <= T_COUNT; n += 1) {
  const r = bang[n];
  const coDo = r.unit.fail > 0 || r.e2e.fail > 0;
  const coCa = r.unit.pass + r.unit.fail + r.e2e.pass + r.e2e.fail > 0;

  let ket;
  if (coDo) {
    ket = "✗ ĐỎ";
    doTong += 1;
  } else if (coCa) {
    ket = "✓";
  } else {
    // Không bộ nào có ca nào cho điểm này. KHÔNG phải xanh — không ai kiểm cả.
    ket = "‼ TRỐNG";
    trongTong += 1;
  }

  console.log(
    `${`T-${n}`.padEnd(6)}${NHAN[n].padEnd(42)}${o(r.unit).padEnd(12)}${o(r.e2e).padEnd(13)}${ket}`,
  );
}

console.log("─".repeat(78));

// Trang dẫn mười điểm — §6 đòi ban giám khảo **chạy** bộ này, và họ cũng phải
// **xem** được nó. Bảng trên terminal cuộn mất; trang này ở lại.
const trangDan = vietTrangDan({
  bang,
  tCount: T_COUNT,
  giay,
  thuMuc: "bao-cao-nghiem-thu",
  doTong,
  trongTong,
});

console.log(`Thời gian: ${giay}s`);
console.log(`Xem mười điểm T-1…T-10:  ${trangDan}`);
console.log("Vết chạy và ảnh chụp:     playwright-report/index.html");

if (doTong > 0 || trongTong > 0 || maUnit !== 0 || maE2e !== 0 || thieuUnit) {
  console.log(
    `\n✗ KHÔNG ĐẠT — ${doTong} điểm ĐỎ, ${trongTong} điểm chưa có phép kiểm nào.`,
  );
  if (maUnit !== 0) console.log(`  Bộ kiểm tầng dưới thoát với mã ${maUnit}.`);
  if (maE2e !== 0) console.log(`  Bộ kiểm đầu-cuối thoát với mã ${maE2e}.`);
  if (thieuUnit) console.log("  Không có kết quả tầng dưới để đọc.");
  process.exit(1);
}

console.log("\n✓ ĐẠT — cả mười điểm nghiệm thu đều xanh.\n");
