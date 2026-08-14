// `C5-17` · `AD-20` · `AD-UI-3` — bộ gieo, lát cắt tối thiểu.
//
// ⚠ KHÔNG ghi thẳng Prisma. `AD-20` chốt bộ gieo đi qua ĐÚNG đường sản phẩm
// dùng: `createRegistry({ seedMode: true })` → `loadCapability`, tác nhân
// `actor.kind === 'seed'`. Ghi tắt thì bộ dữ liệu demo không chứng minh được gì
// về sản phẩm — nó chỉ chứng minh Prisma chạy.
//
// Hai vế của bước ② trong `AD-4` gặp nhau đúng ở đây: `kind: 'seed'` một mình
// không đủ, Cổng còn phải được dựng ở chế-độ-gieo. Một tiến trình web dựng ở
// chế-độ-thường mà nhận actor `seed` là dấu hiệu giả mạo tác nhân, không phải
// một lượt gieo hợp lệ.
//
// ⚠ Ghi vết CÂM ở đây (`AD-20`, `TR-4`): `createAuditSink({ seedMode: true,
// keepAudit: false })` trả sink rỗng. Nếu không, bảng ghi vết đầy hàng của bộ
// gieo trước khi giám khảo bấm nút đầu tiên, và `T-5` đếm sai.

import { createRegistry } from "../src/capability/registry";
import { createAuditSink } from "../src/core/audit";
import type { Actor } from "../src/core/actor";

const seeder: Actor = { kind: "seed" };

/// `AD-UI-17` — mọi bản ghi mang `sourceRef`, khoá tự nhiên của bộ gieo.
/// Không có nó thì `npm run seed` lần hai nhân đôi dữ liệu, và `T-8` đếm sai.
/// Ở lát cắt này chưa có đường upsert; `sourceRef` là chỗ để cắm nó vào sau.
const COMPANIES = [
  { sourceRef: "seed:acc:1", name: "Tomahawk Systems", market: "JP" as const,
    industry: "IT Services", accountType: "it_solution" as const, country: "Japan" },
  { sourceRef: "seed:acc:2", name: "Kitagawa Manufacturing", market: "JP" as const,
    industry: "Manufacturing", accountType: "traditional" as const, country: "Japan" },
  { sourceRef: "seed:acc:3", name: "Blue Harbor Logistics", market: "Global" as const,
    industry: "Logistics", accountType: "tech_based" as const, country: "Singapore" },
];

/// `C5-17` — LUỸ ĐẲNG THẬT: chạy hai lần liên tiếp cho cùng kết quả.
///
/// Không có bước này thì lần chạy thứ hai ăn `P2002` trên `source_ref` — đã đo.
/// Và giám khảo sẽ chạy `npm run seed` nhiều hơn một lần.
///
/// Bộ gieo dọn dữ liệu CỦA CHÍNH NÓ, nhận ra bằng tiền tố `seed:` trên
/// `source_ref`. Nó KHÔNG dùng `TRUNCATE` và không xoá theo bảng: dữ liệu do
/// giám khảo nhập tay trong lúc thử phải sống sót qua một lần gieo lại.
///
/// Đây là XOÁ CỨNG, không phải xoá mềm (`D26`). Xoá mềm để lại hàng mang
/// `source_ref` cũ, và chỉ mục unique vẫn bác lần chèn kế tiếp — tức vẫn hỏng,
/// chỉ khác thông điệp.
///
/// `prisma/**` được phép nhập `@prisma/client` thẳng (`AD-1`), và đây đúng
/// phạm vi đó: dọn dẹp hạ tầng của bộ gieo không phải một thao tác nghiệp vụ,
/// nên nó không đi qua capability.
async function wipeSeedData(): Promise<void> {
  const { PrismaClient } = await import("@prisma/client");
  const { PrismaPg } = await import("@prisma/adapter-pg");
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Thiếu `DATABASE_URL`.");
  const c = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
  try {
    const like = { startsWith: "seed:" };
    const accounts = await c.account.findMany({
      where: { sourceRef: like },
      select: { id: true },
    });
    const ids = accounts.map((a) => a.id);
    if (ids.length === 0) return;
    const cua = { accountId: { in: ids } };

    // ⚠ Thứ tự theo chiều khoá ngoại: CON TRƯỚC, CHA SAU. Mười hai bảng trỏ tới
    // `account`, và bỏ sót một bảng nào cũng cho cùng một lỗi `P2003` ở
    // `account.deleteMany` — thông điệp nêu tên ràng buộc chứ không nêu bảng
    // nào còn hàng, nên đọc lỗi không suy ra được chỗ thiếu.
    //
    // Bản trước dọn đúng bốn bảng và chạy được, vì bộ gieo chỉ tạo bốn bảng đó.
    // Nó hỏng ngay khi có hàng đến từ đường khác — vòng quét thật, `src/ingest`,
    // hay một lượt dựng tay. Tức phép luỹ đẳng của `C5-17` chỉ đúng trên một
    // CSDL mà **chỉ bộ gieo từng chạm**, và đó là giả định không ai phát biểu.
    await c.suggestion.deleteMany({ where: cua });
    await c.signal.deleteMany({ where: cua });
    await c.article.deleteMany({ where: cua });
    await c.snapshot.deleteMany({ where: cua });
    await c.notification.deleteMany({ where: cua });
    await c.nextAction.deleteMany({ where: { opportunity: cua } });
    await c.activity.deleteMany({ where: cua });
    await c.opportunity.deleteMany({ where: cua });
    await c.contact.deleteMany({ where: cua });
    await c.timelineEntry.deleteMany({ where: { timeline: cua } });
    await c.timeline.deleteMany({ where: cua });
    await c.accountLock.deleteMany({ where: cua });
    await c.scanLogEntry.deleteMany({ where: cua });
    await c.auditRecord.deleteMany({ where: cua });
    await c.account.deleteMany({ where: { id: { in: ids } } });
  } finally {
    await c.$disconnect();
  }
}

/// `TR-2` — hai tài khoản, một cho mỗi vai của `§6`.
///
/// ⚠ KHÔNG có capability `createUser`, nên gieo thẳng qua Prisma. `AD-1` cho
/// `prisma/**` nhập `@prisma/client`, và tạo tài khoản không phải thao tác
/// nghiệp vụ — nó là tiền đề để có tác nhân nghiệp vụ.
///
/// Không có mật khẩu: `S11` đổi VAI đang dùng chứ không xác thực (xem
/// `src/app/login/page.tsx`). Hai vai là bắt buộc chứ không phải tiện nghi —
/// `D43` và `§6` chỉ khác nhau ở vai, nên một tài khoản là không thử được.
const USERS = [
  { sourceRef: "seed:user:sales", email: "sales@whynow.demo",
    displayName: "Trần Minh Sales", role: "sales" as const },
  { sourceRef: "seed:user:admin", email: "admin@whynow.demo",
    displayName: "Lê Quản Trị", role: "admin" as const },
];

async function seedUsers(): Promise<number> {
  const { PrismaClient } = await import("@prisma/client");
  const { PrismaPg } = await import("@prisma/adapter-pg");
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Thiếu `DATABASE_URL`.");
  const c = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
  try {
    for (const u of USERS) {
      // `upsert` theo `sourceRef`, KHÔNG theo `email`: `AD-UI-17` chốt khoá tự
      // nhiên của bộ gieo là `source_ref`, và nó là cột `@unique` duy nhất trên
      // `user`. `email` không unique — hai tài khoản trùng email là hợp lệ với
      // lược đồ, nên `where: { email }` không biên dịch được.
      //
      // Luỹ đẳng thật, và KHÔNG đụng tài khoản do bộ e2e hay người khác tạo.
      await c.user.upsert({
        where: { sourceRef: u.sourceRef },
        create: u,
        update: { email: u.email, displayName: u.displayName, role: u.role, deletedAt: null },
      });
    }
    return USERS.length;
  } finally {
    await c.$disconnect();
  }
}

async function main(): Promise<void> {
  await wipeSeedData();
  const users = await seedUsers();

  const registry = createRegistry({
    seedMode: true,
    auditSink: createAuditSink({ seedMode: true, keepAudit: false }),
  });

  const createCompany = await registry.loadCapability("createCompany", seeder);
  const createContact = await registry.loadCapability("createContact", seeder);
  const createOpportunity = await registry.loadCapability("createOpportunity", seeder);

  let companies = 0;
  let contacts = 0;
  let opportunities = 0;

  for (const c of COMPANIES) {
    const account = (await createCompany(c)) as { id: string };
    companies++;

    const contact = (await createContact({
      accountId: account.id,
      name: `Đầu mối ${c.name}`,
      title: "Trưởng phòng CNTT",
      isPrimary: true,
      sourceRef: `${c.sourceRef}:contact:1`,
    })) as { id: string };
    contacts++;
    void contact;

    await createOpportunity({
      accountId: account.id,
      name: `Dự án số hoá — ${c.name}`,
      amount: "5000000.00",
      currency: "JPY",
      expectedCloseMonth: "2026-11",
      sourceRef: `${c.sourceRef}:opp:1`,
    });
    opportunities++;
  }

  // Không in mật khẩu, không in chuỗi kết nối — log đi về Grafana (`D37`).
  console.log(
    `gieo xong: ${users} Tài khoản · ${companies} Công ty · ${contacts} Người liên hệ · ${opportunities} Cơ hội`,
  );
}

main().then(
  () => process.exit(0),
  (err: unknown) => {
    console.error("gieo HỎNG:", err);
    process.exit(1);
  },
);
