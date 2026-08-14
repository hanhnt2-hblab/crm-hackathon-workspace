import { describe, it, expect } from "vitest";
import { z } from "zod";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { ALL_ENTRIES } from "@/capability/caps";

// Tệp này từng liệt kê mọi hàm còn ném `chưa hiện thực`, và danh sách đó CO LẠI
// theo tiến độ: `decide`, `crossesBoundary`, `createCompany`, `extractSignals`,
// `action`… lần lượt rời đi khi có thân thật. Ngày 14/8 nó cạn.
//
// Danh sách cạn KHÔNG có nghĩa là hết việc canh — nó có nghĩa là phép canh cũ
// hết tác dụng. Hai khối dưới là hai thứ thay nó, và cả hai canh được thứ mà
// danh sách cũ không với tới.

const CAPS_DIR = join(process.cwd(), "src", "capability", "caps");

describe("Capability đã đăng ký thì thân KHÔNG được còn rỗng", () => {
  // Đây là hình dạng hỏng mà danh sách cũ bỏ sót: một capability nằm trong sổ,
  // Cổng cho qua, rồi thân ném `chưa hiện thực` — hỏng lúc CHẠY, trước mặt giám
  // khảo, chứ không hỏng lúc biên dịch. `tsc` không thấy gì vì chữ ký đúng cả.

  it("không HÀM LÕI nào mà caps gọi còn thân rỗng", () => {
    // ⚠ Bản đầu quét văn bản tệp caps tìm chuỗi `chưa hiện thực` — DƯƠNG TÍNH
    // GIẢ ngay lần chạy đầu, vì một tệp caps nhắc chuỗi đó trong CHÚ THÍCH giải
    // thích một khoản nợ. Một phép kiểm hay báo sai sẽ bị người ta tắt đi thay
    // vì đọc, nên nó phải soi đúng thứ: hàm lõi mà caps THẬT SỰ gọi.
    const tenLoiRong = new Set<string>();
    const quet = (d: string): void => {
      for (const e of readdirSync(d, { withFileTypes: true })) {
        const p = join(d, e.name);
        if (e.isDirectory()) { quet(p); continue; }
        if (!e.name.endsWith(".ts")) continue;
        const t = readFileSync(p, "utf8");
        // Cắt theo `export function` / `export async function`, lấy tới dấu `}`
        // ở cột 0 — đủ chắc cho quy ước định dạng của repo này.
        for (const khoi of t.split("\nexport ").slice(1)) {
          const dau = khoi.startsWith("async function ")
            ? "async function ".length
            : khoi.startsWith("function ")
              ? "function ".length
              : -1;
          if (dau < 0) continue;
          const conLai = khoi.slice(dau);
          const ten = conLai.slice(0, conLai.search(/[^A-Za-z0-9_]/));
          const than = conLai.split("\n}")[0] ?? "";
          if (than.includes("chưa hiện thực")) tenLoiRong.add(ten);
        }
      }
    };
    quet(join(process.cwd(), "src", "core"));

    const goi = new Set<string>();
    for (const f of readdirSync(CAPS_DIR)) {
      if (!f.endsWith(".ts") || f === "index.ts") continue;
      const t = readFileSync(join(CAPS_DIR, f), "utf8");
      for (const m of t.matchAll(/import\s*\{([^}]+)\}\s*from\s*"@\/core\//g)) {
        for (const r of (m[1] ?? "").split(",")) {
          const n = r.replace(/type/, "").trim();
          if (n) goi.add(n);
        }
      }
    }

    const dangKyMaRong = [...goi].filter((n) => tenLoiRong.has(n)).sort();
    expect(dangKyMaRong).toEqual([]);
  });

  it("sổ không rỗng — một sổ rỗng làm khẳng định trên vô nghĩa", () => {
    expect(ALL_ENTRIES.length).toBeGreaterThan(0);
  });

  it("mỗi mục có `fn` gọi được, và `params` là ZodObject", () => {
    // `AD-CP-3`: `params` phải là `ZodObject` vì `AD-CP-6` truyền `.shape` cho
    // `tool()` của SDK. Khai rộng hơn là `TS2339` lúc dựng server — `npm start`
    // chết trước khi giám khảo bấm gì. Kiểu đã canh, nhưng một `as never` ở đâu
    // đó qua mặt được, nên kiểm lại lúc chạy.
    const xau: string[] = [];
    for (const e of ALL_ENTRIES) {
      if (typeof e.fn !== "function") xau.push(`${e.name}: fn không phải hàm`);
      if (typeof (e.params as { shape?: unknown }).shape !== "object") {
        xau.push(`${e.name}: params thiếu .shape`);
      }
    }
    expect(xau).toEqual([]);
  });

  it("mọi tên capability là duy nhất — tên là khoá toàn cục", () => {
    // `registry.ts` dựng `Map` theo `name`; hai mục trùng tên thì mục nạp SAU
    // lặng lẽ thắng. Chuyện này đã suýt xảy ra một lần với `readAccountList`.
    // `caps/index.ts` cũng ném lúc nạp module; đây là lớp thứ hai, và nó nói
    // được TÊN NÀO trùng khi hỏng.
    const dem = new Map<string, number>();
    for (const e of ALL_ENTRIES) dem.set(e.name, (dem.get(e.name) ?? 0) + 1);
    expect([...dem.entries()].filter(([, n]) => n > 1).map(([k]) => k)).toEqual([]);
  });
});

describe("Ma trận dòng 5 — z.date() ném LÚC DỰNG, z.iso.datetime() thì không", () => {
  it("z.iso.datetime() dựng được JSON Schema", () => {
    expect(() => z.toJSONSchema(z.object({ d: z.iso.datetime() }))).not.toThrow();
  });
  it("z.date() KHÔNG dựng được", () => {
    expect(() => z.toJSONSchema(z.object({ d: z.date() }))).toThrow();
  });
  it("không `params` nào của sổ chứa `z.date()`", () => {
    // Vế thật của luật trên: nó chỉ có giá trị khi không mục nào vi phạm. Dựng
    // JSON Schema cho từng mục là cách duy nhất chứng minh `npm start` sống.
    const xau: string[] = [];
    for (const e of ALL_ENTRIES) {
      try {
        z.toJSONSchema(e.params);
      } catch {
        xau.push(e.name);
      }
    }
    expect(xau).toEqual([]);
  });
});
