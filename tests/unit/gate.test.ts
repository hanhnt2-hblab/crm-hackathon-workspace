// `AD-4` — bảy bước của Cổng, kiểm bằng BẢNG VÀO/RA, không chạm cơ sở dữ liệu.
//
// Đây là lời hứa của `AD-4` được thu về: *"Cổng kiểm thử được bằng bảng đầu-vào
// /đầu-ra thuần — không cần cơ sở dữ liệu để chứng minh chuỗi bảy bước đúng thứ
// tự."* Nếu tệp này một ngày cần Postgres, nghĩa là tầng ③ đã rò.

import { describe, it, expect } from "vitest";
import { decide, type GateEntry, type GateContext } from "@/autonomy/gate";
import { crossesBoundary, BOUNDARY_CODES } from "@/autonomy/zones";
import type { Actor } from "@/core/actor";

const sales: Actor = { kind: "human", userId: "u1", role: "sales" };
const admin: Actor = { kind: "human", userId: "u2", role: "admin" };
const machine: Actor = { kind: "system" };
const seed: Actor = { kind: "seed" };

/// Ngữ cảnh KHOẺ MẠNH: mọi trần còn dư, AI đang bật. Mỗi phép kiểm chỉ đổi
/// đúng một trường, để biết chắc trường nào gây ra từ chối.
const ok = (over: Partial<GateContext> = {}): GateContext => ({
  seedMode: false,
  aiEnabled: true,
  modelCallsUsed: 0,
  modelCallsLimit: 20,
  budgetUsedRatio: 0,
  budgetStopRatio: 1,
  ...over,
});

const entry = (over: Partial<GateEntry> = {}): GateEntry => ({
  name: "createCompany",
  allowedActors: ["human", "seed"],
  allowedRoles: [],
  touches: [],
  selfLimiting: false,
  ...over,
});

describe("AD-4 — bảy bước, dừng ở lần từ chối đầu tiên", () => {
  it("① không có trong sổ → unknown_capability", () => {
    expect(decide(undefined, sales, ok())).toEqual({
      allowed: false, reason: "unknown_capability",
    });
  });

  it("② seed + chế-độ-gieo → CHO PHÉP, bỏ qua mọi bước sau", () => {
    // Cố ý dựng một mục mà seed lẽ ra trượt ở ③ và ④: không có `seed` trong
    // `allowedActors`, và chạm ranh giới. Bước ② phải cắt trước cả hai.
    const e = entry({ allowedActors: ["human"], touches: ["NFR-14"] });
    expect(decide(e, seed, ok({ seedMode: true }))).toEqual({ allowed: true });
  });

  it("② HAI VẾ: seed mà Cổng dựng ở chế-độ-thường thì KHÔNG được miễn", () => {
    const e = entry({ allowedActors: ["human"] });
    expect(decide(e, seed, ok({ seedMode: false }))).toEqual({
      allowed: false, reason: "actor_not_allowed",
    });
  });

  it("③ trước ④: máy vi phạm cả hai → actor_not_allowed, KHÔNG phải boundary", () => {
    // Đây là ca mà `AD-4` nêu đích danh. Đảo thứ tự hai bước không đổi việc có
    // chặn hay không, nhưng đổi mã lý do đi vào ghi vết.
    const e = entry({ allowedActors: ["human"], touches: ["NFR-14"] });
    expect(decide(e, machine, ok())).toEqual({
      allowed: false, reason: "actor_not_allowed",
    });
  });

  it("④ máy chạm ranh giới → boundary, kèm MÃ ranh giới", () => {
    const e = entry({ allowedActors: ["human", "system"], touches: ["NFR-17"] });
    expect(decide(e, machine, ok())).toEqual({
      allowed: false, reason: "boundary", boundary: "NFR-17",
    });
  });

  it("④ NGƯỜI làm cùng việc đó thì KHÔNG bị chặn — §5 nói về máy", () => {
    const e = entry({ allowedActors: ["human", "system"], touches: ["NFR-17"] });
    expect(decide(e, sales, ok())).toEqual({ allowed: true });
  });

  it("⑤ vai không đủ → role; `allowedRoles` rỗng nghĩa là KHÔNG giới hạn", () => {
    const chiQuanTri = entry({ allowedRoles: ["admin"] });
    expect(decide(chiQuanTri, sales, ok())).toEqual({ allowed: false, reason: "role" });
    expect(decide(chiQuanTri, admin, ok())).toEqual({ allowed: true });
    expect(decide(entry({ allowedRoles: [] }), sales, ok())).toEqual({ allowed: true });
  });

  it("⑥ trần lượt gọi — chỉ áp cho MÁY", () => {
    const e = entry({ allowedActors: ["human", "system"] });
    const het = ok({ modelCallsUsed: 20, modelCallsLimit: 20 });
    expect(decide(e, machine, het)).toEqual({ allowed: false, reason: "limit" });
    expect(decide(e, sales, het)).toEqual({ allowed: true });
  });

  it("⑥ ngân sách bằng 0 cho tỉ lệ NaN → phải chặn, không được lọt", () => {
    // `NaN >= x` luôn `false`. Không bắt tường minh thì phanh ngân sách không
    // bao giờ chạm trong khi tiền vẫn tiêu.
    const e = entry({ allowedActors: ["system"] });
    expect(decide(e, machine, ok({ budgetUsedRatio: Number.NaN }))).toEqual({
      allowed: false, reason: "limit",
    });
  });

  it("⑥ TRƯỚC ⑦: hết trần VÀ tắt AI cùng lúc → limit, không phải brake", () => {
    const e = entry({ allowedActors: ["system"] });
    expect(decide(e, machine, ok({ modelCallsUsed: 99, aiEnabled: false }))).toEqual({
      allowed: false, reason: "limit",
    });
  });

  it("⑦ tắt AI → brake, và chỉ áp cho MÁY", () => {
    const e = entry({ allowedActors: ["human", "system"] });
    expect(decide(e, machine, ok({ aiEnabled: false }))).toEqual({
      allowed: false, reason: "brake",
    });
    expect(decide(e, sales, ok({ aiEnabled: false }))).toEqual({ allowed: true });
  });

  it("⑥⑦ BỎ QUA với `selfLimiting` — hết trần vẫn cho qua", () => {
    // Cờ này từng được KHAI mà không được ĐỌC, và nó không làm gì suốt nhiều
    // giờ. Bốn ca dưới là hình dạng lỗi mà `AD-4` phát biểu, không phải bốn ca
    // rời rạc: một capability chạy TẠI hoặc SAU thời điểm trần chạm không được
    // để chính trần đó chặn.
    const hatang = entry({ allowedActors: ["system"], selfLimiting: true });
    const canhtranh = entry({ allowedActors: ["system"], selfLimiting: false });

    const hetTran = ok({ modelCallsUsed: 99, modelCallsLimit: 20 });
    expect(decide(hatang, machine, hetTran)).toEqual({ allowed: true });
    expect(decide(canhtranh, machine, hetTran)).toEqual({ allowed: false, reason: "limit" });

    const tatAi = ok({ aiEnabled: false });
    expect(decide(hatang, machine, tatAi)).toEqual({ allowed: true });
    expect(decide(canhtranh, machine, tatAi)).toEqual({ allowed: false, reason: "brake" });

    const canNgan = ok({ budgetUsedRatio: 1, budgetStopRatio: 1 });
    expect(decide(hatang, machine, canNgan)).toEqual({ allowed: true });

    // Ngân sách bằng 0 → `NaN`. `selfLimiting` phải qua được cả ca này, nếu
    // không thì một cấu hình hỏng cũng khoá luôn đường tự dọn.
    expect(decide(hatang, machine, ok({ budgetUsedRatio: Number.NaN }))).toEqual({
      allowed: true,
    });
  });

  it("`selfLimiting` KHÔNG nới bước ①–⑤ — nó chỉ bỏ ⑥ và ⑦", () => {
    // Vế đối chứng. Nếu cờ này nới cả ranh giới thì nó thành một cửa hậu, và
    // `T-10` mất nghĩa. Ba bước dưới phải vẫn chặn.
    const camMay = entry({ allowedActors: ["human"], selfLimiting: true });
    expect(decide(camMay, machine, ok())).toEqual({
      allowed: false, reason: "actor_not_allowed",
    });

    const chamRanhGioi = entry({
      allowedActors: ["human", "system"], touches: ["NFR-17"], selfLimiting: true,
    });
    expect(decide(chamRanhGioi, machine, ok())).toEqual({
      allowed: false, reason: "boundary", boundary: "NFR-17",
    });

    expect(decide(undefined, machine, ok())).toEqual({
      allowed: false, reason: "unknown_capability",
    });
  });

  it("đường xanh: người, không ranh giới, còn trần", () => {
    expect(decide(entry(), sales, ok())).toEqual({ allowed: true });
  });
});

describe("crossesBoundary — thứ tự mã ổn định", () => {
  it("trả mã đầu tiên theo BOUNDARY_CODES, không theo thứ tự khai `touches`", () => {
    const xuoi = entry({ touches: ["NFR-14", "NFR-17"] });
    const nguoc = entry({ touches: ["NFR-17", "NFR-14"] });
    expect(crossesBoundary(xuoi, machine)).toBe("NFR-14");
    expect(crossesBoundary(nguoc, machine)).toBe("NFR-14");
  });

  it("người không chạm ranh giới nào", () => {
    for (const c of BOUNDARY_CODES) {
      expect(crossesBoundary(entry({ touches: [c] }), sales)).toBeNull();
      expect(crossesBoundary(entry({ touches: [c] }), seed)).toBeNull();
    }
  });

  it("`touches` rỗng → null", () => {
    expect(crossesBoundary(entry(), machine)).toBeNull();
  });
});
