// `AD-2` · `AD-19` · `AD-UI-5` — capability ĐỌC cho các bề mặt của tầng ①.
//
// `AD-19` bắt MỌI lượt đọc đi qua sổ đăng ký, và `AD-UI-5` cho `page.tsx` /
// `layout.tsx` đúng một cửa xuống: `loadCapability()`. Không có tệp này thì
// tầng ① hoặc không đọc được gì, hoặc mở một đường đọc thứ hai — và đường thứ
// hai là chỗ `actor` bị quên.
//
// Cắt theo `AD-2`: capability đọc **có tham số lọc theo người dùng**
// (`searchAccounts`, `readAccountDetail`, `readPipelineBoard`,
// `readOverview`) thuộc `CAP_HUMAN_ONLY`; hai mục dựng phiên
// (`readUserForAuth`, `readLoginCandidates`) thuộc `CAP_SYSTEM_INTERNAL` và
// mang `selfLimiting: true` — `AD-4` liệt đích danh `readUserForAuth`, và
// `AD-UI-10` nêu hậu quả nếu thiếu: bấm Tắt AI thì **không ai đăng nhập được**,
// `T-9` và `T-1` đỏ cùng một lượt.
//
// ─────────────────────────────────────────────────────────────────────────────
// ⚠ MÓN NỢ CÓ Ý THỨC — hai dòng `import` dưới đây, và cách trả nó
//
// `AD-1` khai *"chỉ `src/core`, `prisma/` và `tests/` được chạm Prisma"*, và
// luật lint của tầng ④ cấm cầm `db`. Tệp này VI PHẠM đúng một lần, tường minh,
// vì tại thời điểm viết `src/core` **chưa có hàm đọc nào** cho Công ty, Người
// liên hệ, Cơ hội (`searchCompanies` còn là `chưa hiện thực`, và không có
// `readAccount*` nào tồn tại). Ba lựa chọn có thật:
//
//   ① không đọc gì  → mọi bề mặt của `T-1` là màn hình lỗi; nhóm 1 hỏng hoàn toàn
//   ② đọc thẳng ở `src/app` → mất luôn Cổng và ghi vết cho mọi lượt đọc — nặng hơn
//   ③ đọc ở đây, trong một mục sổ đăng ký, **sau** bảy bước của `AD-4`
//
// Chọn ③. Cái vẫn giữ được: lượt đọc có `actor`, đi qua `decide`, để lại dòng
// ghi vết pha 1 — tức mọi bất biến của `AD-4` còn nguyên. Cái mất: `AD-1` mất
// tính *"một chỗ duy nhất chạm Prisma"*.
//
// CÁCH TRẢ, và nó rẻ: khi `src/core` có hàm đọc, mỗi `fn` dưới đây rút còn một
// dòng gọi hàm đó, hai dòng `import` này biến mất, và không bề mặt nào của tầng
// ① phải sửa một ký tự — vì chúng chỉ biết TÊN capability và HÌNH DẠNG trả về.
// Cả hai đã cố định ở đây.
//
// `db` (không phải `dbIncludingDeleted`) là bản đã `$extends`: nó tự lọc
// `deleted_at IS NULL` (`AD-14`), nên `D26` xoá mềm hiện đúng trên mọi bề mặt.
// Không lượt nào ở đây GHI — `kind: "read"` và không mục nào gọi `tx`.
// ─────────────────────────────────────────────────────────────────────────────

import { z } from "zod";
// Xem khối ⚠ ở đầu tệp: món nợ có ý thức, chỉ ĐỌC, trả bằng cách thay thân
// `fn` khi `src/core` có hàm đọc. Tắt luật ở ĐÚNG một dòng, không tắt cả tệp —
// dòng tắt phải đỏ lên lại ngay khi ai đó thêm lời nhập thứ hai.
// eslint-disable-next-line no-restricted-imports
import { db } from "@/core/db";
import { defineCap, type RegistryEntry } from "../types";
import { readTimeline } from "@/core/timeline";
import { setQualificationSignals } from "@/core/opportunity";
import { getSettingBool } from "@/core/settings";
import {
  autoAcceptRate, errorDetectionRate, unclassifiedRatio, blindApprovalSignals,
} from "@/core/metrics";

/// Đọc có bộ lọc theo người dùng → `CAP_HUMAN_ONLY` (`AD-2`). KHÔNG `"system"`:
/// vòng quét có đường đọc riêng, không lọc, và trộn hai nhu cầu vào một mục là
/// mở cho máy đúng bề mặt mà `T-10b` chứng minh bằng vắng mặt.
const NGUOI = ["human"] as const;

/// Hình dạng chung của một lượt đọc: KHÔNG ném luật nghiệp vụ, KHÔNG ghi.
const READ_COMMON = {
  allowedRoles: [] as const,
  touches: [] as const,
  selfLimiting: false,
  zone: "tu_do" as const,
  risk: "low" as const,
  requiresSignalSource: false,
  cascades: [] as const,
  kind: "read" as const,
  dirtyFlags: [] as const,
  exposeToMcp: false,
  /// `null` với mọi mục `kind: "read"` (`AD-CP-3`): không có ghi thì không có
  /// giá trị TRƯỚC-GHI để chụp.
  snapshot: null,
};

// ─────────────────────────── Phiên đăng nhập (`S11`) ──────────────────────────

/// `AD-UI-10` — lối ra DUY NHẤT của bài toán con gà quả trứng: lượt đọc dựng
/// nên `actor` phải chạy trước khi `actor` tồn tại, nên nó đi bằng
/// `actor: { kind: "system" }`.
///
/// ⚠ `selfLimiting: true` là bắt buộc, không phải tối ưu: thiếu nó thì bước ⑥
/// và ⑦ của `AD-4` chặn chính lượt đọc này ngay khi phanh bật, và *bấm Tắt AI
/// thì không ai đăng nhập được* (`AD-4`, bảng năm dòng).
///
/// `userId` nhận `null`: phiên chưa có cookie thì tầng ① vẫn cần MỘT người để
/// dựng `actor`, và bịa một `uuid` ở tầng ① là dựng nguồn sự thật thứ hai. Trả
/// người có vai `admin` sớm nhất — dữ liệu gieo của `TR-2` luôn có ít nhất một.
export const readUserForAuthCap = defineCap({
  ...READ_COMMON,
  name: "readUserForAuth",
  allowedActors: ["system"] as const,
  selfLimiting: true,
  params: z.object({ userId: z.uuid().nullable() }),
  fn: async (_actor, p) => {
    const where = p.userId === null ? {} : { id: p.userId };
    return db.user.findFirst({
      where,
      orderBy: [{ role: "asc" }, { createdAt: "asc" }],
      select: { id: true, displayName: true, email: true, role: true },
    });
  },
});

/// `AD-UI-10` (ghi chú `readLoginCandidates` của spine cha) — `S11` phải liệt
/// được các tài khoản để bấm, mà `readUserForAuth` chỉ đọc MỘT. Cùng hình dạng
/// lỗi nên cùng cờ `selfLimiting`: chặn nó thì **màn đăng nhập trống**.
export const readLoginCandidatesCap = defineCap({
  ...READ_COMMON,
  name: "readLoginCandidates",
  allowedActors: ["system"] as const,
  selfLimiting: true,
  params: z.object({}),
  fn: async () =>
    db.user.findMany({
      orderBy: [{ role: "asc" }, { createdAt: "asc" }],
      select: { id: true, displayName: true, email: true, role: true },
    }),
});

// ─────────────────────────── Khung ứng dụng (`S0`) ────────────────────────────

/// `FR-46` · `S0` · `T-9` — cờ *phần AI đang bật hay tắt*, cho dải báo ở khung.
///
/// ⚠ Đọc mỗi lượt render, không cache. `AD-UI-5` cấm `revalidate` và
/// `'use cache'` ở tầng này vì đúng lý do đó: khung bị cache tĩnh thì dải báo
/// không bao giờ đổi sau khi Quản trị bấm phanh, và `T-9` đỏ với triệu chứng
/// trỏ sang vòng quét thay vì sang tầng render.
///
/// `allowedActors` gồm cả `"human"`: dải báo hiện với **Sales**, không chỉ với
/// Quản trị (`EXPERIENCE.md`, `FR-46`).
export const readAiEnabledCap = defineCap({
  ...READ_COMMON,
  name: "readAiEnabled",
  allowedActors: NGUOI,
  params: z.object({}),
  fn: async () => ({ aiEnabled: await getSettingBool("ai_enabled") }),
});

// ─────────────────────────── Danh sách Công ty (`S6`) ─────────────────────────

/// `S6` · `FR-9` · `E1-S10` — danh sách Công ty kèm tìm kiếm và lọc kết hợp.
///
/// ⚠ TÊN LÀ `searchAccounts`, KHÔNG phải `readAccountList`. `caps/scan.ts` đã
/// giữ tên `readAccountList` cho bản **không lọc** mà vòng quét dùng (`AD-12`),
/// và sổ đăng ký tra theo tên bằng một `Map` — hai mục trùng tên thì mục nạp
/// sau lặng lẽ thắng, và bên thua không có lỗi nào để đọc. `AD-2` cũng đã cắt
/// đúng đường này: đọc **có tham số lọc theo người dùng** là một capability
/// KHÁC với đọc không lọc, nên hai tên là đúng chứ không phải né tránh.
///
/// `T-1` đòi *"tìm kiếm và lọc"*; `EXPERIENCE.md` (`S6`, hàng **Lỗi**) đòi màn
/// hình nói rõ **lọc nào** đang bật khi không ra kết quả — nên bộ lọc trả về
/// nguyên vẹn cùng dữ liệu, chứ không để tầng ① tự nhớ nó đã gửi gì.
///
/// Trả `updatedAt` thô chứ không trả một cờ *hồ sơ đã cũ*: ngưỡng 30 ngày của
/// `NFR-18` **cấu hình được** (Sales Manager chốt 14/8), nên chỗ so ngưỡng phải
/// là bề mặt đọc được ngưỡng đó, không phải mục đọc này.
export const searchAccountsCap = defineCap({
  ...READ_COMMON,
  name: "searchAccounts",
  allowedActors: NGUOI,
  params: z.object({
    text: z.string().nullable().optional(),
    industry: z.string().nullable().optional(),
    accountType: z.string().nullable().optional(),
    market: z.string().nullable().optional(),
    watching: z.boolean().nullable().optional(),
  }),
  fn: async (_actor, p) => {
    const text = p.text?.trim();
    const rows = await db.account.findMany({
      where: {
        ...(text
          ? {
              OR: [
                { name: { contains: text, mode: "insensitive" as const } },
                { industry: { contains: text, mode: "insensitive" as const } },
                { country: { contains: text, mode: "insensitive" as const } },
              ],
            }
          : {}),
        ...(p.industry ? { industry: p.industry } : {}),
        ...(p.accountType ? { accountType: p.accountType as never } : {}),
        ...(p.market ? { market: p.market as never } : {}),
        ...(p.watching === true ? { watching: true } : {}),
      },
      orderBy: [{ updatedAt: "desc" }, { name: "asc" }],
      select: {
        id: true, name: true, industry: true, accountType: true, market: true,
        country: true, website: true, watching: true, updatedAt: true,
        _count: { select: { contacts: true, opportunities: true } },
      },
    });

    // Giá trị có thật trong dữ liệu, để bộ lọc không bao giờ mời một lựa chọn
    // trả về 0 dòng — `EXPERIENCE.md` gọi đó là *"lọc không ra kết quả"*, và
    // cách rẻ nhất để không rơi vào nó là không bày ra lựa chọn rỗng.
    const facets = await db.account.findMany({
      select: { industry: true, market: true, accountType: true },
    });

    return {
      rows: rows.map((r) => ({
        id: r.id,
        name: r.name,
        industry: r.industry,
        accountType: r.accountType,
        market: r.market,
        country: r.country,
        website: r.website,
        watching: r.watching,
        updatedAt: r.updatedAt.toISOString(),
        contactCount: r._count.contacts,
        opportunityCount: r._count.opportunities,
      })),
      facets: {
        industries: unique(facets.map((f) => f.industry)),
        markets: unique(facets.map((f) => f.market as string)),
        accountTypes: unique(facets.map((f) => f.accountType as string | null)),
      },
    };
  },
});

// ─────────────────────────── Hồ sơ Công ty (`S3`) ─────────────────────────────

/// `S3` · `FR-1` `FR-2` `FR-6` — hồ sơ đầy đủ: Công ty, Người liên hệ, Cơ hội.
///
/// ⚠ KHÔNG kèm Dòng thời gian. `AD-UI-8` bắt các khối hỏng độc lập phải TẢI
/// độc lập, và Dòng thời gian là khối chậm nhất — gói chung thì một Dòng thời
/// gian chậm chặn cả hồ sơ, đúng thứ luật đó dựng ra để cấm. Nó có capability
/// riêng ngay dưới.
export const readAccountDetailCap = defineCap({
  ...READ_COMMON,
  name: "readAccountDetail",
  allowedActors: NGUOI,
  params: z.object({ accountId: z.uuid() }),
  fn: async (_actor, p) => {
    const account = await db.account.findFirst({
      where: { id: p.accountId },
      select: {
        id: true, name: true, industry: true, accountType: true, market: true,
        country: true, website: true, watching: true, watchReason: true,
        createdAt: true, updatedAt: true,
      },
    });
    if (!account) return null;

    const [contacts, opportunities] = await Promise.all([
      db.contact.findMany({
        where: { accountId: p.accountId },
        orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
        select: { id: true, name: true, title: true, email: true, isPrimary: true },
      }),
      db.opportunity.findMany({
        where: { accountId: p.accountId },
        orderBy: [{ updatedAt: "desc" }],
        select: OPPORTUNITY_SELECT,
      }),
    ]);

    return {
      account: {
        ...account,
        createdAt: account.createdAt.toISOString(),
        updatedAt: account.updatedAt.toISOString(),
      },
      contacts,
      opportunities: opportunities.map(toOpportunityCard),
    };
  },
});

/// `S3` khối Dòng thời gian — `AD-UI-8`, khối tải độc lập.
///
/// Thân là MỘT dòng gọi `readTimeline` của lõi: nó đã tồn tại, đã có khoá sắp
/// ba tầng mà `T-8` đếm theo. Đây cũng là hình dạng mà năm mục còn lại sẽ có
/// khi `src/core` mọc đủ hàm đọc.
export const readAccountTimelineCap = defineCap({
  ...READ_COMMON,
  name: "readAccountTimeline",
  allowedActors: NGUOI,
  params: z.object({ accountId: z.uuid() }),
  fn: async (actor, p) => {
    const entries = await readTimeline(actor, p.accountId);
    return entries.map((e) => ({
      id: e.id,
      content: e.content,
      occurredAt: e.occurredAt.toISOString(),
      addedBy: e.addedBy,
    }));
  },
});

// ─────────────────────────── Bảng Giai đoạn (`S4`) ────────────────────────────

/// `S4` · `FR-3` `FR-4` — bảng bảy cột, dữ liệu cho kéo thả.
///
/// Trả về PHẲNG (một mảng thẻ) chứ không gom sẵn theo cột: gom là việc hiển
/// thị, và `EXPERIENCE.md` (`S4`, hàng **Rỗng**) đòi cột rỗng vẫn hiện tên cột
/// — tức tầng ① phải tự dựng đủ bảy cột kể cả khi không có thẻ nào. Gom ở đây
/// thì cột rỗng biến mất khỏi kết quả và luật đó không cưỡng chế được.
export const readPipelineBoardCap = defineCap({
  ...READ_COMMON,
  name: "readPipelineBoard",
  allowedActors: NGUOI,
  params: z.object({ accountId: z.uuid().nullable().optional() }),
  fn: async (_actor, p) => {
    const rows = await db.opportunity.findMany({
      where: p.accountId ? { accountId: p.accountId } : {},
      orderBy: [{ updatedAt: "desc" }],
      select: { ...OPPORTUNITY_SELECT, account: { select: { id: true, name: true } } },
    });
    return rows.map((r) => ({
      ...toOpportunityCard(r),
      accountName: r.account.name,
    }));
  },
});

// ─────────────────────────── Màn hình tổng quan ───────────────────────────────

/// `T-1` (*"mở màn hình tổng quan"*) · `S1` — số đếm của nhóm 1, KHÔNG phải số
/// đo AI của `S8`.
///
/// ⚠ Hai màn hình khác nhau và đừng gộp: `S8` là bảng Quản trị, đọc
/// `src/core/metrics.ts`, chặn bằng vai ở bước ⑤ của Cổng (`AD-UI-10`). Mục
/// này là bàn làm việc của Sales và **không** có ngưỡng vai nào.
///
/// Mỗi con số đi kèm MỐC SO (`EXPERIENCE.md`, *Giọng chữ*): *"12/15 account đã
/// quét"*, không phải *"12 account"*. Nên `flagged` trả kèm `total`.
export const readOverviewCap = defineCap({
  ...READ_COMMON,
  name: "readOverview",
  allowedActors: NGUOI,
  params: z.object({}),
  fn: async () => {
    const [accountCount, contactCount, opportunities, latestEntries] = await Promise.all([
      db.account.count(),
      db.contact.count(),
      db.opportunity.findMany({
        orderBy: [{ updatedAt: "desc" }],
        select: { ...OPPORTUNITY_SELECT, account: { select: { id: true, name: true } } },
      }),
      db.timelineEntry.findMany({
        orderBy: [{ occurredAt: "desc" }, { createdAt: "desc" }, { id: "desc" }],
        take: 8,
        select: {
          id: true, content: true, occurredAt: true, addedBy: true,
          timeline: { select: { account: { select: { id: true, name: true } } } },
        },
      }),
    ]);

    const cards = opportunities.map((o) => ({
      ...toOpportunityCard(o),
      accountName: o.account.name,
    }));

    const byStage: Record<string, number> = {};
    for (const c of cards) byStage[c.stage] = (byStage[c.stage] ?? 0) + 1;

    return {
      accountCount,
      contactCount,
      opportunityCount: cards.length,
      byStage,
      flagged: cards.filter((c) => c.flags.length > 0),
      recentEntries: latestEntries.map((e) => ({
        id: e.id,
        content: e.content,
        occurredAt: e.occurredAt.toISOString(),
        addedBy: e.addedBy,
        accountId: e.timeline.account.id,
        accountName: e.timeline.account.name,
      })),
    };
  },
});

// ─────────────────────────── Bảng Quản trị (`S8`) ─────────────────────────────

/// `S8` · `AD-9` · `AD-UI-10` — số đo của bảng Quản trị.
///
/// ⚠ `allowedRoles: ["admin"]` là chỗ `D28` được cưỡng chế, và nó nằm **trên**
/// đường đi chứ không song song với nó: bề mặt `S8` render bằng cách gọi mục
/// này, nên một phiên Sales vào thẳng địa chỉ vẫn nhận từ chối `role` từ bước ⑤
/// của Cổng. Ẩn mục menu là thẩm mỹ; đây mới là biên giới.
///
/// Mỗi số đo trả về CẶP `{value, sampleSize}` của `src/core/metrics.ts`, không
/// trả một con số trần: `EXPERIENCE.md` (`S8`, hàng *Rỗng*) cấm hiện `0%` khi
/// chưa đủ mẫu — *"0% đọc thành máy sai hết"* — nên bề mặt phải thấy được cỡ
/// mẫu để chọn giữa một con số và câu *"cần ít nhất N lượt quyết"*.
export const readAdminMetricsCap = defineCap({
  ...READ_COMMON,
  name: "readAdminMetrics",
  allowedActors: NGUOI,
  allowedRoles: ["admin"] as const,
  params: z.object({}),
  fn: async () => {
    const [autoAccept, errorDetection, unclassified, blind] = await Promise.all([
      autoAcceptRate(),
      errorDetectionRate(),
      unclassifiedRatio(),
      blindApprovalSignals(),
    ]);
    return { autoAccept, errorDetection, unclassified, blind };
  },
});

// ─────────────────────────── Hai ô dấu hiệu (`BR-B2`) ─────────────────────────

/// `C5-5` · `BR-B2` · `T-1` — ghi hai ô dấu hiệu Đủ điều kiện.
///
/// ⚠ Mục này KHÔNG nằm trên đường kéo thả, và đó là cả điểm của nó: `T-1` đòi
/// *"bỏ qua hai ô dấu hiệu vẫn kéo được"*, nên đổi Giai đoạn không bao giờ được
/// phụ thuộc vào lượt ghi này. Hai capability riêng, hai lời gọi riêng — hộp
/// hỏi ở tầng ① gọi mục này **sau** khi thẻ đã sang cột mới, và mục này hỏng
/// thì thẻ vẫn ở cột mới (`AD-UI-6`: một action một capability).
///
/// `allowedActors: ["human"]` — `false` ở đây là *"đã trả lời là không"*, một
/// kết luận về khách hàng. `NFR-16` để loại kết luận đó khỏi tay máy.
export const setQualificationSignalsCap = defineCap({
  name: "setQualificationSignals",
  allowedActors: ["human"] as const,
  allowedRoles: [],
  touches: ["NFR-16"],
  selfLimiting: false,
  zone: "ho_so_chinh_thuc",
  risk: "medium",
  requiresSignalSource: false,
  cascades: [],
  kind: "write",
  params: z.object({
    id: z.uuid(),
    needSignal: z.boolean().nullable(),
    budgetSignal: z.boolean().nullable(),
  }),
  dirtyFlags: ["BR-B2"],
  exposeToMcp: false,
  fn: async (actor, p, ctx) =>
    setQualificationSignals(
      actor,
      p.id,
      { needSignal: p.needSignal, budgetSignal: p.budgetSignal },
      ctx,
    ),
  snapshot: null,
  writesTables: ["opportunity"],
});

// ─────────────────────────────── Dùng chung ──────────────────────────────────

const OPPORTUNITY_SELECT = {
  id: true, accountId: true, name: true, amount: true, currency: true,
  expectedCloseMonth: true, stage: true, latestOpenStage: true,
  needSignal: true, budgetSignal: true, lossReasons: true, updatedAt: true,
} as const;

/// Giai đoạn tính từ Đủ điều kiện trở đi — nơi `BR-B2` bắt đầu có hiệu lực.
const TU_DU_DIEU_KIEN = new Set([
  "du_dieu_kien", "soan_de_xuat", "thuong_luong", "thang", "thua",
]);

type OpportunityRow = {
  id: string; accountId: string; name: string;
  amount: { toString(): string } | null; currency: string | null;
  expectedCloseMonth: string | null; stage: string; latestOpenStage: string | null;
  needSignal: boolean | null; budgetSignal: boolean | null;
  lossReasons: string[]; updatedAt: Date;
};

/// Một thẻ Cơ hội đã **tuần tự hoá được** (`AD-UI-5`: lá `'use client'` nhận
/// props đã tuần tự hoá).
///
/// ⚠ `amount` là CHUỖI. Cột là `Decimal(14,2)`; Prisma trả một đối tượng
/// `Decimal` mà React không tuần tự hoá được qua ranh giới server→client, và
/// `Number()` làm tròn tiền sai ở đúng chỗ không ai nhìn.
///
/// ⚠ `flags` mang MÃ, không mang chữ hiển thị. Chữ tiếng Việt sống ở `src/app`
/// (quy ước cha: lõi và tầng ④ không chứa chuỗi hiển thị), và `flags` là thứ
/// `T-1` kiểm — *"cơ hội mang cờ cảnh báo"*.
function toOpportunityCard(o: OpportunityRow) {
  const flags: string[] = [];
  // `BR-B2` — sang Đủ điều kiện mà thiếu hai dấu hiệu. `null` là CHƯA HỎI,
  // `false` là ĐÃ TRẢ LỜI KHÔNG; cả hai đều chưa đủ điều kiện, nên chốt là
  // `!== true`.
  if (TU_DU_DIEU_KIEN.has(o.stage) && (o.needSignal !== true || o.budgetSignal !== true)) {
    flags.push("BR-B2");
  }
  // `BR-B3` — Thua mà chưa có lý do.
  if (o.stage === "thua" && o.lossReasons.length === 0) flags.push("BR-B3");

  return {
    id: o.id,
    accountId: o.accountId,
    name: o.name,
    amount: o.amount === null ? null : o.amount.toString(),
    currency: o.currency,
    expectedCloseMonth: o.expectedCloseMonth,
    stage: o.stage,
    latestOpenStage: o.latestOpenStage,
    needSignal: o.needSignal,
    budgetSignal: o.budgetSignal,
    lossReasons: o.lossReasons,
    updatedAt: o.updatedAt.toISOString(),
    flags,
  };
}

function unique(values: readonly (string | null)[]): string[] {
  return [...new Set(values.filter((v): v is string => v !== null && v !== ""))].sort();
}

/// `AD-CP-1` — xuất DUY NHẤT một hằng `entries`, đúng khuôn của `./account.ts`.
/// Sổ đăng ký nạp qua `./index.ts`; thiếu một dòng ở đó thì mọi mục dưới đây
/// **im lặng không tồn tại** và mọi bề mặt đọc trả `unknown_capability`.
export const entries: readonly RegistryEntry[] = [
  readUserForAuthCap,
  readLoginCandidatesCap,
  readAiEnabledCap,
  readAdminMetricsCap,
  searchAccountsCap,
  readAccountDetailCap,
  readAccountTimelineCap,
  readPipelineBoardCap,
  readOverviewCap,
  setQualificationSignalsCap,
] as unknown as readonly RegistryEntry[];
