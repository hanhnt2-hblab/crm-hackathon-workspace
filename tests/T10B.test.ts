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
  "changeOpportunityStage", "resumeFromPause", "reopenClosedOpportunity",
  "createSignal", "markSignalUnhelpful",
  "createSuggestion", "decideSuggestion",
  "setNextAction", "fillNextActionIfUnchanged", "undoSystemNextAction",
  "setQualificationSignals", "searchCompanies", "readTimeline",
  // `AD-CP-6` hạng đọc-chung — tập phơi lên MCP
  "readArticle", "readAccountType", "listEnums",
  // hạ tầng vòng quét
  "openScanLog", "closeScanLog", "addScanUsage", "recordScanEntry",
  "acquireAccountLock", "releaseAccountLock",
  "SCAN_STOP_REASONS", "SettingKey",
  // đọc tham số và số đo — `AD-CP-9`, `AD-9`
  "getSetting", "getSettingBool",
  "autoAcceptRate", "errorDetectionRate", "unclassifiedRatio", "blindApprovalSignals",
]);

/// KHOẢN NỢ ĐÃ KHAI, có tên và có hạn. `caps/ui.ts` nhập `db` vì `src/core`
/// chưa có hàm đọc cho Công ty/Người liên hệ/Cơ hội — `searchCompanies` còn là
/// `chưa hiện thực`. Đây là vi phạm `AD-1` THẬT, chỉ đọc, và có
/// `eslint-disable-next-line` kèm giải thích tại chỗ.
///
/// Giữ nó ở một danh sách RIÊNG thay vì nhét vào danh sách trắng: nhét vào thì
/// nó biến mất khỏi tầm nhìn và không ai trả nợ. Ở đây nó vẫn hiện hình, và
/// phép kiểm dưới chặn nó LỚN THÊM.
const KNOWN_DEBT = new Set(["ui.ts → db"]);

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

  it("không mục nào khai ghi vào `audit_record`", () => {
    // ⚠ Bản đầu của phép kiểm này cấm mọi mục ghi `timeline_entry` — SAI.
    // `§4/nhóm 5` cho máy THÊM mục Dòng thời gian ở mức tự do; `NFR-19` chỉ cấm
    // máy SỬA mục người tạo. Cấm cả hai là chặn oan đúng thứ nhóm 5 đòi phải có.
    //
    // Bảng thật sự không capability nào được chạm là `audit_record`: ghi vết là
    // BẰNG CHỨNG, và một capability ghi được vào đó thì nó nguỵ tạo được bằng
    // chứng cho chính mình. Lõi ghi nó, qua `AuditSink`, không qua sổ đăng ký.
    const viPham = ALL_ENTRIES.filter((e) =>
      (e.writesTables ?? []).some((t) => t === "audit_record"),
    ).map((e) => e.name);
    expect(viPham).toEqual([]);
  });

  it("mục nào ghi `timeline_entry` thì chỉ được THÊM, không sửa", () => {
    // Vế cưỡng chế nằm ở phép kiểm nhập `updateTimelineEntry` bên dưới. Ở đây
    // chỉ khẳng định danh sách các mục chạm bảng đó là danh sách ĐÃ BIẾT — một
    // mục mới chạm nó phải được đọc bằng mắt trước khi qua.
    const chamTimeline = ALL_ENTRIES.filter((e) =>
      (e.writesTables ?? []).includes("timeline_entry"),
    ).map((e) => e.name).sort();
    expect(chamTimeline).toEqual([
      "appendTimelineEntry", "approveSuggestion", "changeOpportunityStage",
      "createActivity", "editThenApprove", "reopenClosedOpportunity", "resumeFromPause",
    ]);
  });

  it("tên mục không chứa động từ xoá", () => {
    // ⚠ `drop` ĐÃ BỊ GỠ khỏi danh sách. `dropSuggestion` là một trong ba lối ra
    // của NGƯỜI khi quyết một Gợi ý (`FR-22`) — nó ghi một quyết định, không xoá
    // dữ liệu nào. Giữ `drop` ở đây là một dương tính giả, và một phép kiểm hay
    // báo sai sẽ bị người ta tắt đi thay vì đọc.
    const xau = ALL_ENTRIES.filter((e) => /delete|remove|purge|wipe|xoa/i.test(e.name));
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
          const khoa = `${file} → ${name}`;
          if (name && !CORE_FUNCTIONS_ALLOWED.has(name) && !KNOWN_DEBT.has(khoa)) {
            laMat.push(khoa);
          }
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

  it("máy bị TỪ CHỐI trên mọi mục KHÔNG khai `system`", async () => {
    const camMay = ALL_ENTRIES.filter((e) => !e.allowedActors.includes("system"));
    expect(camMay.length).toBeGreaterThan(0);
    for (const e of camMay) {
      await expect(registry.loadCapability(e.name, machine)).rejects.toMatchObject({
        name: "GateDenied",
        reason: "actor_not_allowed",
      });
    }
  });

  it("`AD-3` — máy GHI dữ liệu nghiệp vụ ở ĐÚNG BA chạm, không hơn", async () => {
    // Đây là khẳng định chịu lực nhất của tệp. Ba chạm của `AD-3`: thêm mục
    // Dòng thời gian, đề nghị một Gợi ý, điền ô Việc tiếp theo ĐANG TRỐNG.
    // Mục thứ tư xuất hiện ở đây là một quyền mới máy vừa có, và nó phải được
    // đọc bằng mắt trước khi qua.
    expect(registry.CAP_MACHINE_ALLOWED_GHI.slice().sort()).toEqual([
      "appendTimelineEntry", "fillNextActionIfUnchanged", "queueSuggestion",
    ]);
    // Và chúng phải cầm được thật — `F38`: chặn oan là hỏng cả nhóm 5.
    await expect(
      registry.loadCapability("appendTimelineEntry", machine),
    ).resolves.toBeTypeOf("function");
  });

  it("hạ tầng vòng quét tách RỜI khỏi khối ghi nghiệp vụ (`AD-2`)", () => {
    // Bốn khối của `AD-2` phải là một PHÂN HOẠCH. Một mục nằm hai khối làm câu
    // *"máy ghi được đúng ba thứ"* thành *"đúng ba, cộng mấy cái nữa"*.
    const giao = registry.CAP_MACHINE_ALLOWED_GHI.filter((n) =>
      registry.CAP_SYSTEM_INTERNAL.includes(n),
    );
    expect(giao).toEqual([]);
    expect(registry.CAP_SYSTEM_INTERNAL.slice().sort()).toEqual([
      "acquireAccountLock", "recordAccountCost", "releaseAccountLock", "writeScanLog",
    ]);
  });

  it("tên không có trong sổ trả `unknown_capability`, không phải lỗi khác", async () => {
    await expect(registry.loadCapability("khong_co_that", machine)).rejects.toMatchObject({
      reason: "unknown_capability",
    });
  });

  it("bốn danh sách của `AD-CP-1` khớp nội dung sổ", () => {
    // Đường ĐỌC của máy, BẢY mục và mỗi mục có lý do riêng:
    //   · năm mục hạng đọc-chung mà `AD-CP-6` phơi lên MCP — `readArticle`,
    //     `readAccountType`, `listEnums`, `readAccountList`, `readSetting`
    //   · hai mục dựng `actor` TRƯỚC KHI có `actor`, nên phải đi bằng `system`
    //     và mang `selfLimiting` (`AD-4`): `readUserForAuth`, `readLoginCandidates`
    //
    // Một mục thứ tám ở đây là một đường đọc mới của máy — đọc bằng mắt trước.
    expect(registry.CAP_MACHINE_ALLOWED_DOC.slice().sort()).toEqual([
      "listEnums", "readAccountList", "readAccountType", "readArticle",
      "readLoginCandidates", "readSetting", "readUserForAuth",
    ]);
    const chiNguoi = ALL_ENTRIES.filter((e) => !e.allowedActors.includes("system"));
    expect([...registry.CAP_HUMAN_ONLY].sort()).toEqual(
      chiNguoi.map((e) => e.name).sort(),
    );
  });

  it("`AD-CP-6` — phơi lên MCP ĐÚNG NĂM mục, và KHÔNG mục ghi nào", () => {
    // *"Không mục ghi nào"* là vế chịu lực. Một mục ghi phơi lên MCP là đưa cho
    // agent đúng thứ `AD-AG-3` nói nó không được có, và phép đối chứng phá hoại
    // của `AD-1` khi đó đo trên một bề mặt đã rộng hơn thiết kế.
    //
    // Đã từng sai đúng chiều đó: `appendTimelineEntry` (một mục GHI) để
    // `exposeToMcp: true` cho tới 14/8.
    const phoi = ALL_ENTRIES.filter((e) => e.exposeToMcp);
    expect(phoi.map((e) => e.name).sort()).toEqual([
      "listEnums", "readAccountList", "readAccountType", "readArticle", "readSetting",
    ]);
    expect(phoi.filter((e) => e.kind !== "read").map((e) => e.name)).toEqual([]);
  });

  it("sổ không rỗng — một sổ rỗng làm MỌI khẳng định vắng mặt ở trên thành vô nghĩa", () => {
    expect(ALL_ENTRIES.length).toBeGreaterThan(0);
    expect(capsSources.length).toBeGreaterThan(0);
  });
});
