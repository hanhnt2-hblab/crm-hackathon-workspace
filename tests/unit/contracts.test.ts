import { describe, it, expect } from "vitest";
import { z } from "zod";
import { action } from "@/app/_contract";
import { extractSignals } from "@/agent/types";
import { setPrimaryContact } from "@/core/contact";
import { fillNextActionIfUnchanged } from "@/core/nextaction";

const actor = { kind: "human", userId: "u", role: "sales" } as const;

// ⚠ Danh sách này CO LẠI theo tiến độ. `decide` và `crossesBoundary` đã rời
// khỏi đây ngày 14/8 vì chúng đã có thân thật — phép kiểm của chúng nay ở
// `tests/unit/gate.test.ts`. Một hàm rời danh sách này mà không có phép kiểm
// hành vi thay thế là mất lớp canh, không phải tiến bộ.
describe("Ma trận dòng 2 — mọi thân rỗng ném đúng chuỗi", () => {
  const fns: Array<[string, () => unknown]> = [
    ["action", () => action(async () => ({ ok: true }))],
    // `createCompany` ĐÃ RỜI danh sách rỗng — nó có thân thật từ 14/8.
    ["setPrimaryContact", () => setPrimaryContact(actor, "x", {} as never)],
    ["fillNextActionIfUnchanged", () => fillNextActionIfUnchanged(actor, {} as never, {} as never)],
    ["extractSignals", () => extractSignals({} as never, {} as never)],
  ];
  for (const [name, f] of fns) {
    it(name, () => expect(f).toThrowError(/chưa hiện thực/));
  }
});

describe("Ma trận dòng 5 — z.date() ném LÚC DỰNG, z.iso.datetime() thì không", () => {
  it("z.iso.datetime() dựng được JSON Schema", () => {
    expect(() => z.toJSONSchema(z.object({ d: z.iso.datetime() }))).not.toThrow();
  });
  it("z.date() KHÔNG dựng được", () => {
    expect(() => z.toJSONSchema(z.object({ d: z.date() }))).toThrow();
  });
});
