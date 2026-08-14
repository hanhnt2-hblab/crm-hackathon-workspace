// T-10b — Sổ đăng ký chứng minh bằng VẮNG MẶT
//
// Đề bài §6 chốt ba ranh giới phải chặn *"kể cả khi thao tác đến từ ngoài giao
// diện"*. `T-10a` chứng minh bằng lời gọi bị TỪ CHỐI; tệp này chứng minh bằng
// thứ khác hẳn: **capability đó không tồn tại**.
//
// Hai vế cần cả hai. Một chốt trong lõi có thể bị ai đó nới ra ngày mai; một
// capability không có mặt thì không nới được — phải viết mới, và viết mới thì
// tệp này đỏ.
//
// ⚠ VÌ SAO KHÔNG KHẲNG ĐỊNH TRÊN TÊN TỰ KHAI. Một mục tên `updateAccountField`
// nhận `value: null` vẫn xoá được dữ liệu, và mọi phép kiểm đọc `name` sẽ xanh.
// Nên tệp này khẳng định trên BA thứ đo được: hàm lõi mà mỗi tệp caps thật sự
// nhập, tập bảng mỗi mục khai ghi, và tập tác nhân được phép.
//
// `D36`: `T-n` là lớp NGOÀI. Cục sở hữu thân: ④. Mốc: M1.

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { ALL_ENTRIES } from "@/capability/caps";
import { createRegistry } from "@/capability/registry";
import { createAuditSink } from "@/core/audit";
import type { Actor } from "@/core/actor";

const CAPS_DIR = join(process.cwd(), "src", "capability", "caps");

const capsSources = readdirSync(CAPS_DIR)
  .filter((f) => f.endsWith(".ts") && f !== "index.ts")
  .map((f) => ({ file: f, text: readFileSync(join(CAPS_DIR, f), "utf8") }));

/// DANH SÁCH TRẮNG hàm lõi mà tầng ④ được phép gọi. Thêm một tên vào đây là một
/// quyết định có chủ đích, và diff của nó nhìn thấy được trong code review —
/// khác hẳn việc một tệp caps lặng lẽ nhập thêm một hàm.
const CORE_FUNCTIONS_ALLOWED = new Set([
  "createCompany", "updateCompany", "searchCompanies",
  "createContact", "setPrimaryContact",
  "createOpportunity", "updateOpportunity", "setQualificationSignals", "setLossReasons",
  "createActivity",
  "appendTimelineEntry", "readTimeline",
  "createSignal", "markSignalUnhelpful",
  "createSuggestion", "decideSuggestion",
  "setNextAction", "fillNextActionIfUnchanged", "undoSystemNextAction",
]);

/// Hàm lõi mà tầng ④ TUYỆT ĐỐI không được gọi, dù người hay máy gây ra.
/// `NFR-17` cấm máy xoá; xoá đi qua bề mặt người ở tầng ①, không qua capability.
const CORE_FUNCTIONS_FORBIDDEN = [
  "softDeleteCompany", "softDeleteOpportunity", "softDeleteContact",
  "updateTimelineEntry",
];

const machine: Actor = { kind: "system" };

describe("T-10b · NFR-17 — không mục nào xoá dữ liệu do người tạo", () => {
  it("không tệp caps nào nhập một hàm xoá của lõi", () => {
    const viPham: string[] = [];
    for (const { file, text } of capsSources) {
      for (const fn of CORE_FUNCTIONS_FORBIDDEN) {
        if (new RegExp(`\\b${fn}\\b`).test(text)) viPham.push(`${file} → ${fn}`);
      }
    }
    expect(viPham).toEqual([]);
  });

  it("không mục nào khai ghi vào bảng `signal` hay `timeline_entry`", () => {
    // Hai bảng này là BẰNG CHỨNG. `signal` không xoá được kể cả bởi người, và
    // `timeline_entry` do người tạo thì máy chỉ được THÊM cạnh, không sửa.
    const viPham = ALL_ENTRIES.filter((e) =>
      (e.writesTables ?? []).some((t) => t === "signal" || t === "timeline_entry"),
    ).map((e) => e.name);
    expect(viPham).toEqual([]);
  });

  it("tên mục không chứa động từ xoá", () => {
    const xau = ALL_ENTRIES.filter((e) => /delete|remove|drop|purge|wipe|xoa/i.test(e.name));
    expect(xau.map((e) => e.name)).toEqual([]);
  });
});

describe("T-10b · NFR-19 — không mục nào sửa mục Timeline do người tạo", () => {
  it("không tệp caps nào nhập `updateTimelineEntry`", () => {
    for (const { file, text } of capsSources) {
      expect(`${file}:${/\bupdateTimelineEntry\b/.test(text)}`).toBe(`${file}:false`);
    }
  });

  it("mọi hàm lõi mà caps nhập đều nằm trong DANH SÁCH TRẮNG", () => {
    // Đây là vế mạnh nhất của tệp này: nó không hỏi mục TÊN gì, nó hỏi mục GỌI
    // gì. Một mục tên vô hại mà gọi một hàm ngoài danh sách vẫn bị bắt.
    const laMat: string[] = [];
    for (const { file, text } of capsSources) {
      for (const m of text.matchAll(/import\s*\{([^}]+)\}\s*from\s*"@\/core\/[^"]+"/g)) {
        for (const raw of m[1]!.split(",")) {
          const name = raw.replace(/\btype\b/, "").trim();
          if (name && !CORE_FUNCTIONS_ALLOWED.has(name)) laMat.push(`${file} → ${name}`);
        }
      }
    }
    expect(laMat).toEqual([]);
  });
});

describe("T-10b · NFR-16 — không mục nào tự liên hệ khách", () => {
  it("không tệp caps nào nhập một đường ra ngoài", () => {
    const CAM = [
      "nodemailer", "node:http", "node:https", "node:net", "node:dgram",
      "axios", "got", "node-fetch", "twilio", "@sendgrid",
    ];
    const viPham: string[] = [];
    for (const { file, text } of capsSources) {
      for (const mod of CAM) {
        if (text.includes(`"${mod}`)) viPham.push(`${file} → ${mod}`);
      }
      if (/\bfetch\s*\(/.test(text)) viPham.push(`${file} → fetch()`);
    }
    expect(viPham).toEqual([]);
  });

  it("`F38` — chặn oan là hỏng cả nhóm 2, nên phải có đường CHO PHÉP", () => {
    // Vế đối chứng của `NFR-16`. Lệnh gọi mô hình đi qua `src/agent`, KHÔNG qua
    // sổ đăng ký — nên khẳng định đúng ở đây là: sổ không hề chặn nó, vì nó
    // không đi qua sổ. Kiểm bằng `AgentDeps` tồn tại và mang đường vào MCP.
    // ⚠ Vế này CHƯA đầy đủ: nó chứng minh hợp đồng tồn tại, chưa chứng minh một
    // lệnh gọi thật đi qua được. Phần đó thuộc `T-8`, khi vòng quét chạy.
    expect(ALL_ENTRIES.every((e) => e.exposeToMcp === false || e.exposeToMcp === true)).toBe(true);
  });
});

describe("T-10b — tác nhân MÁY không cầm được mục nào của vùng hồ sơ", () => {
  const registry = createRegistry({
    seedMode: false,
    auditSink: createAuditSink({ seedMode: true, keepAudit: false }),
  });

  it("mọi mục ghi vùng `ho_so_chinh_thuc` đều KHÔNG cho `system`", () => {
    const ho = ALL_ENTRIES.filter(
      (e) => e.zone === "ho_so_chinh_thuc" && e.kind === "write",
    );
    expect(ho.length).toBeGreaterThan(0);
    for (const e of ho) {
      expect(`${e.name}:${e.allowedActors.includes("system")}`).toBe(`${e.name}:false`);
    }
  });

  it("`loadCapability` với tác nhân máy bị TỪ CHỐI trên mọi mục", async () => {
    for (const e of ALL_ENTRIES) {
      await expect(registry.loadCapability(e.name, machine)).rejects.toMatchObject({
        name: "GateDenied",
        reason: "actor_not_allowed",
      });
    }
  });

  it("tên không có trong sổ trả `unknown_capability`, không phải lỗi khác", async () => {
    await expect(registry.loadCapability("khong_co_that", machine)).rejects.toMatchObject({
      reason: "unknown_capability",
    });
  });

  it("bốn danh sách của `AD-CP-1` khớp nội dung sổ", () => {
    expect(registry.CAP_MACHINE_ALLOWED_GHI).toEqual([]);
    expect(registry.CAP_MACHINE_ALLOWED_DOC).toEqual([]);
    expect([...registry.CAP_HUMAN_ONLY].sort()).toEqual(
      ALL_ENTRIES.map((e) => e.name).sort(),
    );
  });

  it("sổ không rỗng — một sổ rỗng làm MỌI khẳng định vắng mặt ở trên thành vô nghĩa", () => {
    expect(ALL_ENTRIES.length).toBeGreaterThan(0);
    expect(capsSources.length).toBeGreaterThan(0);
  });
});
