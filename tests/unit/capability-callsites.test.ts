// Lược đồ Zod của tầng ④ phải khớp LỜI GỌI THẬT của tầng ①.
//
// Đây là một họ lỗi, không phải một lỗi. Nó vừa xảy ra thật: `readArticle` khai
// `z.object({ id: z.uuid() })` trong khi `src/scan/loop.ts` gọi
// `{ accountId, scope: "latest" }` và `src/ingest` gọi `{ accountId, scope:
// "all" }`. Zod bác cả hai, mỗi Công ty ăn một `FT10`, ba lần liên tiếp chạm
// `max_consecutive_denials`, và vòng quét chết TRƯỚC khi tới mô hình.
//
// ⚠ TRIỆU CHỨNG KHÔNG GIỐNG LỖI HỢP ĐỒNG CHÚT NÀO. Nhật ký `FR-39` in *"quét
// 0/0 Công ty"*, đọc như thể không có Công ty nào để quét. Đó là lý do lớp kiểm
// này tồn tại: nó biến một lỗi mất bốn mươi phút để chẩn đoán thành một dòng đỏ
// mang đúng tên trường.
//
// Ba khẳng định, ba loại trôi khác nhau:
//   ① TÊN — mọi tên capability xuất hiện ở một lời gọi phải có trong sổ đăng ký
//      (`AD-4` bước ① trả `unknown_capability`, và nó im lặng với bên gọi nào
//      không đọc mã lý do)
//   ② THIẾU TRƯỜNG — mọi trường BẮT BUỘC của lược đồ phải có mặt ở lời gọi
//   ③ THỪA TRƯỜNG — mọi trường ở lời gọi phải có trong lược đồ. Zod GỠ ÂM THẦM
//      trường lạ, nên chiều này không bao giờ ném; nó chỉ làm dữ liệu biến mất
//
// `D36` — đây là lớp kiểm DƯỚI, không phải một `T-n`. `T-10b` rà sổ đăng ký;
// tệp này rà chỗ nối giữa sổ và bên gọi.
//
// ⚠ GIỚI HẠN ĐÃ BIẾT. Nó chỉ đọc được lời gọi mà tham số là một OBJECT LITERAL
// viết tại chỗ. Lời gọi truyền một biến (`callCap(registry, actor, name,
// params)`) không đọc được, và số lời gọi đọc được có một SÀN bên dưới — thiếu
// sàn thì một lần đổi cách viết làm bộ quét khớp rỗng và tệp này xanh vĩnh viễn.

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, lstatSync } from "node:fs";
import { join } from "node:path";
import type { z } from "zod";
import { ALL_ENTRIES } from "@/capability/caps";

/// Ba nhánh tầng ① của `AD-UI-2`. `src/capability` KHÔNG có mặt: nó là bên khai
/// lược đồ, nên đối chiếu nó với chính nó không nói được gì.
const NHANH_TANG_MOT = ["src/app", "src/scan", "src/ingest"];

/// Sàn số lời gọi đọc được. Đã đo tại thời điểm viết; hạ nó xuống là tự tay tắt
/// phép kiểm, nên hạ phải kèm một câu lý do.
const SAN_LOI_GOI = 15;

const TEN_TRONG_SO = new Set(ALL_ENTRIES.map((e) => e.name));

type LoiGoi = { file: string; cap: string; keys: string[]; coSpread: boolean };

describe("Hợp đồng tầng ④ ↔ lời gọi tầng ①", () => {
  const tep = NHANH_TANG_MOT.flatMap(docThuMuc);
  const loiGoi = tep.flatMap(({ file, text }) => rutLoiGoi(file, text));

  it("bộ quét còn đọc được lời gọi — sàn chống tự-tắt", () => {
    expect(tep.length).toBeGreaterThan(0);
    expect(loiGoi.length).toBeGreaterThanOrEqual(SAN_LOI_GOI);

    // GHIM đúng lời gọi đã hỏng thật, để phép kiểm không âm thầm mất tầm nhìn
    // vào nó: `readArticle` từ `src/scan/loop.ts`, với hai trường `accountId` và
    // `scope`. Lược đồ quay về `{ id }` thì vế ② báo `id` thiếu và vế ③ báo
    // `accountId`/`scope` lạ — tức lỗi hiện thành hai dòng mang đúng tên trường,
    // thay vì thành *"quét 0/0 Công ty"*.
    const doc = loiGoi.filter((g) => g.cap === "readArticle");
    expect(doc.length).toBeGreaterThan(0);
    expect(doc.some((g) => g.keys.includes("accountId") && g.keys.includes("scope")))
      .toBe(true);
  });

  it("① mọi tên capability ở lời gọi đều có trong sổ đăng ký", () => {
    const laMat: string[] = [];
    for (const { file, text } of tep) {
      for (const m of text.matchAll(/loadCapability\(\s*"([^"]+)"/g)) {
        if (!TEN_TRONG_SO.has(m[1]!)) laMat.push(`${file} → ${m[1]}`);
      }
    }
    // Một tên đã đổi mà bên gọi chưa đổi không ném ở đâu cả: nó trả
    // `unknown_capability`, và bên gọi nào xếp nó vào nhánh *lỗi chung* sẽ báo
    // một triệu chứng khác hẳn nguyên nhân.
    expect(laMat).toEqual([]);
  });

  it("② không lời gọi nào THIẾU một trường bắt buộc của lược đồ", () => {
    const thieu: string[] = [];
    for (const g of loiGoi) {
      // Lời gọi có `...spread` thì không đọc được đủ tập khoá — bỏ qua vế này,
      // vế ③ vẫn áp được cho phần viết tường minh.
      if (g.coSpread) continue;
      for (const k of truongBatBuoc(g.cap)) {
        if (!g.keys.includes(k)) thieu.push(`${g.file} → ${g.cap}.${k}`);
      }
    }
    expect(thieu).toEqual([]);
  });

  it("③ không lời gọi nào gửi một trường KHÔNG có trong lược đồ", () => {
    const la: string[] = [];
    for (const g of loiGoi) {
      const shape = hinhDang(g.cap);
      for (const k of g.keys) {
        if (!(k in shape)) la.push(`${g.file} → ${g.cap}.${k}`);
      }
    }
    // Chiều này KHÔNG BAO GIỜ ném lúc chạy: `ZodObject` mặc định GỠ trường lạ.
    // Một trường bị gỡ âm thầm là dữ liệu biến mất giữa hai tầng.
    expect(la).toEqual([]);
  });
});

// ───────────────────────────── bộ đọc lược đồ ─────────────────────────────

function mucSo(ten: string) {
  const e = ALL_ENTRIES.find((x) => x.name === ten);
  if (!e) throw new Error(`Không có mục \`${ten}\` trong sổ đăng ký.`);
  return e;
}

/// ⚠ Ép kiểu là bắt buộc: `ZodObject["shape"]` khai giá trị là `$ZodType` — kiểu
/// LÕI của Zod 4, vốn không phơi `safeParse`. Bề mặt công khai là `z.ZodType`,
/// và mọi trường trong sổ đăng ký đều được dựng bằng bề mặt đó.
function hinhDang(ten: string): Record<string, z.ZodType> {
  return mucSo(ten).params.shape as unknown as Record<string, z.ZodType>;
}

/// Trường BẮT BUỘC = trường mà lược đồ bác `undefined`. Suy từ chính lược đồ
/// thay vì đọc cờ nội bộ của Zod: `.optional()`, `.nullish()` và `.default()`
/// đều cho `undefined` đi qua, và cả ba đều có nghĩa *"bên gọi không phải gửi"*.
function truongBatBuoc(ten: string): string[] {
  return Object.entries(hinhDang(ten))
    .filter(([, kieu]) => !kieu.safeParse(undefined).success)
    .map(([k]) => k);
}

// ──────────────────────────── bộ đọc lời gọi ─────────────────────────────

function docThuMuc(goc: string): Array<{ file: string; text: string }> {
  const ra: Array<{ file: string; text: string }> = [];
  const di = (thuMuc: string): void => {
    for (const ten of readdirSync(thuMuc)) {
      const duong = join(thuMuc, ten);
      const st = lstatSync(duong, { throwIfNoEntry: false });
      if (!st || st.isSymbolicLink()) continue;
      if (st.isDirectory()) di(duong);
      else if (/\.tsx?$/.test(ten)) {
        ra.push({ file: duong, text: readFileSync(duong, "utf8") });
      }
    }
  };
  di(join(process.cwd(), goc));
  return ra;
}

/// Hai hình dạng lời gọi có thật trong repo, và không có hình dạng thứ ba:
///
///   ⓐ `src/app` — `const doc = await appRegistry.loadCapability("ten", actor);`
///      rồi `await doc({ … })` ở đâu đó phía sau trong CÙNG tệp.
///   ⓑ `src/scan`, `src/ingest` — `call("ten", { … })` qua `callCap`.
function rutLoiGoi(file: string, raw: string): LoiGoi[] {
  const text = boChuThich(raw);
  const ra: LoiGoi[] = [];

  // ⓑ — tên và object literal đứng liền nhau.
  for (const m of text.matchAll(/"([A-Za-z][A-Za-z0-9_]*)"\s*,\s*\{/g)) {
    const cap = m[1]!;
    if (!TEN_TRONG_SO.has(cap)) continue;
    // ⚠ `loadCapability("ten", { kind: "system" })` khớp mẫu này, nhưng object
    // đứng sau là TÁC NHÂN, không phải tham số. Đọc nhầm nó cho hai dương tính
    // giả (`.kind` lạ, và mọi trường bắt buộc đều "thiếu"). Lời gọi tham số của
    // hình dạng ⓐ được nhánh dưới bắt.
    if (/loadCapability\(\s*$/.test(text.slice(Math.max(0, m.index - 40), m.index))) {
      continue;
    }
    const than = khopNgoac(text, m.index + m[0].length - 1);
    if (than === null) continue;
    ra.push({ file, cap, ...khoaMucGoc(than) });
  }

  // ⓐ — bắc cầu qua tên biến.
  for (const m of text.matchAll(
    /const\s+([A-Za-z_$][\w$]*)\s*=\s*await\s+[\w.]*loadCapability\(\s*"([^"]+)"/g,
  )) {
    const bien = m[1]!;
    const cap = m[2]!;
    if (!TEN_TRONG_SO.has(cap)) continue;
    const goi = new RegExp(`\\b${bien}\\(\\s*\\{`, "g");
    goi.lastIndex = m.index;
    const g = goi.exec(text);
    if (!g) continue;
    const than = khopNgoac(text, g.index + g[0].length - 1);
    if (than === null) continue;
    ra.push({ file, cap, ...khoaMucGoc(than) });
  }

  return ra;
}

/// Gỡ chú thích để một tên capability nhắc trong `//` không bị đọc thành lời gọi.
/// Không gỡ chuỗi: chính chuỗi là thứ mang tên capability.
function boChuThich(text: string): string {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("\n")
    .map((l) => (/^\s*\/\//.test(l) ? "" : l))
    .join("\n");
}

/// Khớp ngoặc từ vị trí một `{`, trả phần THÂN (không kèm hai ngoặc).
/// Bỏ qua nội dung chuỗi và template để một `}` trong chuỗi không cắt sớm.
function khopNgoac(text: string, batDau: number): string | null {
  let sau = 0;
  let trong: '"' | "'" | "`" | null = null;
  for (let i = batDau; i < text.length; i++) {
    const c = text[i]!;
    if (trong) {
      if (c === "\\") i++;
      else if (c === trong) trong = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") trong = c;
    else if (c === "{" || c === "[" || c === "(") sau++;
    else if (c === "}" || c === "]" || c === ")") {
      sau--;
      if (sau === 0) return text.slice(batDau + 1, i);
    }
  }
  return null;
}

/// Khoá ở MỨC GỐC của một object literal. Cắt theo dấu phẩy ở độ sâu 0, rồi lấy
/// định danh đứng trước `:` — hoặc chính nó, nếu là dạng viết tắt.
function khoaMucGoc(than: string): { keys: string[]; coSpread: boolean } {
  const keys: string[] = [];
  let coSpread = false;
  for (const doan of catTheoPhay(than)) {
    const s = doan.trim();
    if (s.length === 0) continue;
    if (s.startsWith("...")) {
      coSpread = true;
      continue;
    }
    const m = /^(?:"([^"]+)"|'([^']+)'|([A-Za-z_$][\w$]*))\s*(:|$)/.exec(s);
    const ten = m?.[1] ?? m?.[2] ?? m?.[3];
    if (ten) keys.push(ten);
    else coSpread = true; // dạng không đọc được — xử như thiếu thông tin
  }
  return { keys, coSpread };
}

function catTheoPhay(than: string): string[] {
  const ra: string[] = [];
  let sau = 0;
  let trong: '"' | "'" | "`" | null = null;
  let dau = 0;
  for (let i = 0; i < than.length; i++) {
    const c = than[i]!;
    if (trong) {
      if (c === "\\") i++;
      else if (c === trong) trong = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") trong = c;
    else if (c === "{" || c === "[" || c === "(") sau++;
    else if (c === "}" || c === "]" || c === ")") sau--;
    else if (c === "," && sau === 0) {
      ra.push(than.slice(dau, i));
      dau = i + 1;
    }
  }
  ra.push(than.slice(dau));
  return ra;
}
