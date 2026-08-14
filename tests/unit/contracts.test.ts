import { describe, it, expect } from "vitest";
import { z } from "zod";
import { decide } from "@/autonomy/gate";
import { crossesBoundary } from "@/autonomy/zones";
import { defineCap } from "@/capability/types";
import { createRegistry } from "@/capability/registry";
import { collectGateContext } from "@/capability/gate-context";
import { action } from "@/app/_contract";
import { createCompany } from "@/core/company";
import { extractSignals } from "@/agent/types";
import { setPrimaryContact } from "@/core/contact";
import { fillNextActionIfUnchanged } from "@/core/nextaction";

const actor = { kind: "human", userId: "u", role: "sales" } as const;

describe("Ma trận dòng 2 — mọi thân rỗng ném đúng chuỗi", () => {
  const fns: Array<[string, () => unknown]> = [
    ["decide", () => decide(undefined, actor, {} as never)],
    ["crossesBoundary", () => crossesBoundary({} as never, actor)],
    ["defineCap", () => defineCap({} as never)],
    ["createRegistry", () => createRegistry({ seedMode: true, auditSink: {} as never })],
    ["collectGateContext", () => collectGateContext(actor, true)],
    ["action", () => action(async () => ({ ok: true }))],
    ["createCompany", () => createCompany({} as never, actor, {} as never)],
    ["setPrimaryContact", () => setPrimaryContact({} as never, actor, "x")],
    ["fillNextActionIfUnchanged", () => fillNextActionIfUnchanged({} as never, actor, {} as never)],
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
