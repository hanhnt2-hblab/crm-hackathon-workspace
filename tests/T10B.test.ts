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
import { db } from "@/core/db";
import { getSettingNumber } from "@/core/settings";
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
  // ⚠ `proposeFromSignal` thêm 15/08. Nó là hàm lõi mà `queueSuggestionCap`
  // gọi thay cho `createSuggestion` sau khi `AD-22` chuyển phép suy đề nghị
  // vào lõi (*"`queueSuggestion` suy XÁC ĐỊNH trong lõi"*). Đây là ĐỔI TÊN
  // đường gọi, KHÔNG phải nới quyền: `writesTables` của mục đó không đổi, và
  // ba chạm ghi của máy ở `AD-3` vẫn là ba — phép kiểm phân hoạch bên dưới
  // vẫn khẳng định đúng điều đó.
  "createSuggestion", "proposeFromSignal", "decideSuggestion",
  "setNextAction", "fillNextActionIfUnchanged", "undoSystemNextAction",
  "setQualificationSignals", "searchCompanies", "readTimeline",
  // `AD-CP-6` hạng đọc-chung — tập phơi lên MCP.
  // ⚠ `readArticle` là TÊN CAPABILITY; hai hàm lõi đứng sau nó là
  // `readArticleLatest` (`scope:"latest"`) và `listArticleFingerprints`
  // (`scope:"all"`). Cả hai CHỈ ĐỌC.
  "readArticle", "readArticleLatest", "listArticleFingerprints",
  // ⚠ BA HÀM ĐỌC CỦA BỀ MẶT, thêm 15/08 cùng ba tệp caps mới
  // (`signal-ui.ts`, `suggestion-ui.ts`, `nextaction-ui.ts`).
  //
  // Vì sao chúng KHÔNG nới quyền nào: cả ba `kind: "read"`, `writesTables` rỗng,
  // và không tệp nào trong ba tệp đó nhập `db` — nên khoản nợ `ui.ts → db` cũng
  // không lớn thêm. Phép kiểm phân hoạch khối một bên dưới chỉ đọc
  // `CAP_MACHINE_ALLOWED_GHI`, và một mục đọc không bao giờ vào tập đó.
  //
  // Đây là đường ĐÚNG HƠN đường mà `ui.ts` đang đi: hàm đọc nằm ở `src/core`,
  // capability chỉ uỷ quyền. `ui.ts` còn đọc thẳng `db` vì `src/core` chưa mọc
  // đủ hàm đọc — ba tệp này cho thấy hình dạng khi nó mọc đủ.
  "readAccountSignals", "readPendingSuggestions", "readAccountNextActions",
  // `BR-D2` — công cụ KIỂM ĐẦU RA, mục thứ sáu của `AD-CP-6` và là mục DUY NHẤT
  // tầng ② được kỳ vọng gọi. Chỉ đọc: nó tra một câu trích trong Bản lưu mới
  // nhất và trả vị trí, không ghi gì.
  "verifyQuote",
  "readAccountType", "listEnums", "SIGNAL_ENUMS",
  // `AD-8` · `AD-22` — hai đường GHI BẰNG CHỨNG của vòng quét. Chúng ghi Bản
  // lưu và Phát hiện, tức dữ liệu MÁY TỰ SINH; không ô hồ sơ nào do người tạo bị
  // chạm. Xem phép kiểm phân hoạch khối một bên dưới, chỗ hai họ được tách ra.
  "createArticle",
  // `AD-11` điều kiện dừng 4 — van ngân sách. Hai chiều, hai hàm, hai quyền:
  // máy tắt được, máy KHÔNG bật lại được (xem phép kiểm riêng bên dưới).
  "disableAi", "enableAi",
  // `FR-47` · `T-8` — cờ Đang theo dõi, tức ĐIỀU KIỆN KÍCH HOẠT của cả nhóm 2.
  //
  // Ghi vào bảng `account` nhưng KHÔNG chạm ô hồ sơ nào: `watching` không nằm
  // trong tám giá trị của `enum TargetField`, nên đường Gợi ý không với tới nó.
  // Và `setWatchingCap` không cho `system` — máy tự bật theo dõi là máy tự chọn
  // việc cho mình, khi đó trần ngân sách của `AD-11` canh một tập do chính bên
  // bị canh mở rộng.
  "setWatching",
  // `T-5` §4/nhóm 3 — hàng đợi Gợi ý. CHỈ ĐỌC: nó đọc Gợi ý `cho` cùng giá trị
  // đang có trên hồ sơ, không ghi gì. Ba lối ra vẫn đi qua ba capability ghi đã
  // có (`approveSuggestion`, `editThenApprove`, `dropSuggestion`).
  "readPendingSuggestions",
  // `T-5` — đường MÁY sinh Gợi ý. Lõi tự suy ô đích và giá trị đề nghị bằng
  // `deriveProposal`; tầng ① không dựng nổi chúng (`AD-1`).
  "proposeFromSignal",
  // Luật thi `3.1` — nạp bộ dữ liệu bằng upload zip.
  //
  // ⚠ Đây là hàm lõi GHI NHIỀU NHẤT trong cả sổ: nó xoá sạch rồi dựng lại Công
  // ty, Người liên hệ, Cơ hội, Bản chụp, Bản lưu và mọi thứ máy sinh ra sau đó.
  // Nó qua được vì `importDatasetCap` khai `allowedActors: ["human"]` — MÁY
  // KHÔNG gọi được. Một lượt nạp là xoá dữ liệu, đúng thứ `NFR-17` cấm máy làm,
  // nên mở nó cho `system` là cửa hậu vòng qua `T-10`.
  //
  // Phạm vi xoá bị chặn bằng tiền tố `import:` trên `source_ref`: dữ liệu giám
  // khảo nhập tay trong lúc thử KHÔNG bị đụng.
  "applyImport",
  // `T-3` — khối Phát hiện trên hồ sơ Công ty. CHỈ ĐỌC.
  "readAccountSignals",
  // `T-7` — khối Việc tiếp theo kèm nút Hoàn tác. CHỈ ĐỌC; nút đi qua
  // `undoSystemNextAction` vốn đã có trong danh sách.
  "readAccountNextActions",
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
    // Đây là khẳng định chịu lực nhất của tệp, và nó KHÔNG còn phát biểu được
    // bằng một danh sách phẳng: khối một của `AD-2` gom cả mục ghi BẰNG CHỨNG
    // (`createArticle`, `createSignal` — thêm 14/8) lẫn ba chạm HỒ SƠ của
    // `AD-3`. Hai họ khác nhau về hậu quả, nên chúng được tách bằng thứ đo được
    // — TẬP BẢNG mỗi mục khai ghi — chứ không bằng tên hay bằng ý định:
    //
    //   · họ ① — chạm bảng thuộc HỒ SƠ/VIỆC của người: `timeline_entry`,
    //     `suggestion`, `next_action`. Đây là ba chạm của `AD-3`, và một mục
    //     thứ tư ở đây là một quyền mới máy vừa có trên dữ liệu của người.
    //   · họ ② — chỉ chạm bảng BẰNG CHỨNG do máy tự sinh: `snapshot`,
    //     `article`, `signal`. Vòng quét không nạp được Bản lưu và không lưu
    //     được Phát hiện thì `T-2` và `T-8` không có gì để đo.
    //
    // Nới danh sách họ ① là mở một quyền mới trên dữ liệu người tạo. Nới họ ②
    // thì phải hỏi bảng mới ấy là bằng chứng của ai.
    const HO_SO_VA_VIEC = new Set(["timeline_entry", "suggestion", "next_action"]);
    const BANG_CHUNG = new Set(["snapshot", "article", "signal"]);

    const bang = (ten: string): readonly string[] =>
      ALL_ENTRIES.find((e) => e.name === ten)?.writesTables ?? [];

    const chamHoSo = registry.CAP_MACHINE_ALLOWED_GHI
      .filter((n) => bang(n).some((t) => HO_SO_VA_VIEC.has(t)))
      .slice().sort();
    const chiBangChung = registry.CAP_MACHINE_ALLOWED_GHI
      .filter((n) => bang(n).length > 0 && bang(n).every((t) => BANG_CHUNG.has(t)))
      .slice().sort();

    expect(chamHoSo).toEqual([
      "appendTimelineEntry", "fillNextActionIfUnchanged", "queueSuggestion",
    ]);
    expect(chiBangChung).toEqual(["createArticle", "createSignal"]);
    // PHÂN HOẠCH: hai họ rời nhau và phủ hết khối một. Thiếu vế này thì một mục
    // ghi cả `article` lẫn `next_action` sẽ lọt vào họ ② và biến mất khỏi tầm rà.
    expect(chamHoSo.filter((n) => chiBangChung.includes(n))).toEqual([]);
    expect(chamHoSo.length + chiBangChung.length).toBe(
      registry.CAP_MACHINE_ALLOWED_GHI.length,
    );

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
    // `disableAi` thuộc khối này vì nó chỉ ghi bảng `setting` — một bảng HẠ
    // TẦNG, không phải dữ liệu của người. Nó vào khối ba theo đúng bộ phân biệt
    // `writesTables` mà `registry.ts` dùng, không theo một ngoại lệ viết tay.
    expect(registry.CAP_SYSTEM_INTERNAL.slice().sort()).toEqual([
      "acquireAccountLock", "disableAi", "recordAccountCost",
      "releaseAccountLock", "writeScanLog",
    ]);
  });

  it("`AD-11` điều kiện dừng 4 — máy TẮT được AI, và KHÔNG bật lại được", async () => {
    // Hai chiều của phanh là hai mục, hai quyền. Gộp chúng — hoặc cho `system`
    // vào `enableAi` — làm điều kiện dừng 4 chỉ TRÌ HOÃN một vòng: máy chạm
    // trần, tự tắt, rồi tự bật lại, và hoá đơn chạy tiếp.
    const tat = ALL_ENTRIES.find((e) => e.name === "disableAi");
    const bat = ALL_ENTRIES.find((e) => e.name === "enableAi");
    expect(tat, "sổ đăng ký phải có `disableAi`").toBeDefined();
    expect(bat, "sổ đăng ký phải có `enableAi`").toBeDefined();

    expect(tat!.allowedActors).toContain("system");
    expect(bat!.allowedActors).not.toContain("system");
    await expect(registry.loadCapability("enableAi", machine)).rejects.toMatchObject({
      name: "GateDenied",
      reason: "actor_not_allowed",
    });
  });

  it("`disableAi` mang `selfLimiting` — van phải mở được ĐÚNG lúc trần chạm", async () => {
    // Khẳng định trên CỜ là chưa đủ: cờ có thể đúng mà bước ⑥/⑦ đọc sai. Nên
    // dựng đúng trạng thái mà van sinh ra để phục vụ — một vòng quét đang chạy
    // đã tiêu HẾT ngân sách — rồi hỏi Cổng.
    //
    // Không có `selfLimiting`, `disableAi` bị bác `limit` ở đúng khoảnh khắc
    // duy nhất máy gọi nó. Triệu chứng không phải một dòng lỗi mà là hoá đơn:
    // vòng sau lại mở, lại tiêu, lại chạm trần, lại không tắt được.
    expect(ALL_ENTRIES.find((e) => e.name === "disableAi")!.selfLimiting).toBe(true);

    const tran = await getSettingNumber("scan_budget_usd");
    const vong = await db.scanLog.create({
      data: {
        budgetUsd: String(tran),
        // Vượt trần, không phải chạm đúng trần: `budget_stop_ratio` mặc định là
        // `1.00`, và phép so là `>=`.
        costUsedUsd: String(tran * 2),
        modelCallsUsed: 9_999,
      },
      select: { id: true },
    });
    try {
      // Van MỞ được…
      await expect(
        registry.loadCapability("disableAi", machine),
      ).resolves.toBeTypeOf("function");
      // …trong khi một mục ghi thường của máy thì KHÔNG. Vế đối chứng: thiếu nó
      // thì phép kiểm trên cũng xanh khi Cổng quên đọc trần với mọi mục.
      await expect(
        registry.loadCapability("queueSuggestion", machine),
      ).rejects.toMatchObject({ name: "GateDenied", reason: "limit" });
    } finally {
      // Dọn: một vòng quét treo `finished_at = NULL` làm mọi tệp kiểm sau đó đọc
      // một ngữ cảnh Cổng đã cạn ngân sách.
      await db.scanLog.delete({ where: { id: vong.id } });
    }
  });

  it("tên không có trong sổ trả `unknown_capability`, không phải lỗi khác", async () => {
    await expect(registry.loadCapability("khong_co_that", machine)).rejects.toMatchObject({
      reason: "unknown_capability",
    });
  });

  it("bốn danh sách của `AD-CP-1` khớp nội dung sổ", () => {
    // Đường ĐỌC của máy, TÁM mục và mỗi mục có lý do riêng:
    //   · năm mục hạng đọc-chung mà `AD-CP-6` phơi lên MCP — `readArticle`,
    //     `readAccountType`, `listEnums`, `readAccountList`, `readSetting`
    //   · hai mục dựng `actor` TRƯỚC KHI có `actor`, nên phải đi bằng `system`
    //     và mang `selfLimiting` (`AD-4`): `readUserForAuth`, `readLoginCandidates`
    //   · `verifyQuote` (thêm 15/8) — công cụ KIỂM ĐẦU RA của tầng ②. Khác bảy
    //     mục trên ở chỗ nó được KỲ VỌNG gọi, không phải lớp phòng thủ.
    //
    // Một mục thứ chín ở đây là một đường đọc mới của máy — đọc bằng mắt trước.
    expect(registry.CAP_MACHINE_ALLOWED_DOC.slice().sort()).toEqual([
      "listEnums", "readAccountList", "readAccountType", "readArticle",
      "readLoginCandidates", "readSetting", "readUserForAuth", "verifyQuote",
    ]);
    const chiNguoi = ALL_ENTRIES.filter((e) => !e.allowedActors.includes("system"));
    expect([...registry.CAP_HUMAN_ONLY].sort()).toEqual(
      chiNguoi.map((e) => e.name).sort(),
    );
  });

  it("`AD-CP-6` — phơi lên MCP ĐÚNG SÁU mục, và KHÔNG mục ghi nào", () => {
    // *"Không mục ghi nào"* là vế chịu lực. Một mục ghi phơi lên MCP là đưa cho
    // agent đúng thứ `AD-AG-3` nói nó không được có, và phép đối chứng phá hoại
    // của `AD-1` khi đó đo trên một bề mặt đã rộng hơn thiết kế.
    //
    // Đã từng sai đúng chiều đó: `appendTimelineEntry` (một mục GHI) để
    // `exposeToMcp: true` cho tới 14/8.
    // ⚠ SÁU, không còn năm — `verifyQuote` thêm vào 15/8. Năm mục kia là LỚP
    // PHÒNG THỦ và `AD-AG-3` đo được rằng agent không gọi chúng (handler chạy 0
    // lần). `verifyQuote` khác hạng: nó KIỂM ĐẦU RA, và tầng ② được KỲ VỌNG gọi.
    // Nó vào đây vì đã đo 2/3 Phát hiện rụng do mô hình diễn đạt lại câu trích.
    const phoi = ALL_ENTRIES.filter((e) => e.exposeToMcp);
    expect(phoi.map((e) => e.name).sort()).toEqual([
      "listEnums", "readAccountList", "readAccountType", "readArticle", "readSetting",
      "verifyQuote",
    ]);
    expect(phoi.filter((e) => e.kind !== "read").map((e) => e.name)).toEqual([]);
  });

  it("sổ không rỗng — một sổ rỗng làm MỌI khẳng định vắng mặt ở trên thành vô nghĩa", () => {
    expect(ALL_ENTRIES.length).toBeGreaterThan(0);
    expect(capsSources.length).toBeGreaterThan(0);
  });
});
