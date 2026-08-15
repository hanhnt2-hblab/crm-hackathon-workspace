// Bề mặt `S2` — **Hàng đợi gợi ý**, toàn hệ thống · UJ-2 · `FR-18`…`FR-23`.
//
// ⚠ `S2` KHÔNG PHẢI *"quản lý Người liên hệ"*. `epics.md` (`C1-1`) gọi tên hai
// bề mặt `S1`, `S2` cho khối tạo/sửa/xoá/xem, nhưng bảng IA của `EXPERIENCE.md`
// — nguồn sự thật của dải `S0`–`S11`, và là tệp mà luật truy vết ngược chỉ đích
// danh — khai `S1` = *Today* và `S2` = *Suggestion queue*. Lệch này đã NÊU RA
// trong báo cáo thay vì sửa im lặng một trong hai tài liệu.
//
// ⚠ BỀ MẶT NÀY KHÔNG THAY KHỐI *Gợi ý chờ quyết* Ở `S3`. Hai chỗ, hai câu hỏi
// khác nhau: `S3` hỏi *"công ty này còn gì phải quyết"*, `S2` hỏi *"hôm nay tôi
// còn bao nhiêu việc phải quyết"* (UJ-2: hàng đợi gom theo Công ty, xử trong
// bốn phút). Gỡ khối ở `S3` cũng làm đỏ `e2e/T4.spec.ts:236`, vốn khẳng định
// giá trị đề nghị xuất hiện ĐÚNG MỘT LẦN trên `/accounts/{id}` — *ở hàng đợi*.
//
// `AD-UI-5` — server component; nơi duy nhất của bề mặt này gọi
// `loadCapability()`. Phần bấm được là lá `'use client'` dùng chung với `S3`.
//
// `AD-UI-8` — `Block` + `Suspense`: hàng đợi chậm hay hỏng thì khung vẫn đứng.
//
// ⚠ MÓN NỢ CÓ Ý THỨC — N+1 LƯỢT ĐỌC, và nó nằm ở đây chứ không bị giấu.
// `readSuggestionQueueCap` khai `params: z.object({ accountId: z.uuid() })`,
// BẮT BUỘC, nên không có đường đọc hàng đợi toàn cục. Bề mặt này ghép hai
// capability đã có — `searchAccounts({})` rồi `readSuggestionQueue` từng Công ty
// — thay vì thêm một mục vào `src/capability/**`, vốn ngoài quyền của lần chạy
// này. Đánh đổi nhận rõ: N Công ty là N+1 lượt đọc và N+1 dòng ghi vết pha 1.
// Chấp nhận được vì đây là MỘT bề mặt người dùng chủ động mở trên bộ dữ liệu cỡ
// demo; KHÔNG chấp nhận được ở `layout.tsx`, vốn dựng lại mọi lượt yêu cầu của
// mọi trang — đó là lý do lối vào ở khung không mang con số.
// Cách trả nợ: một mục `readPendingSuggestionQueue` không tham số ở tầng ④.

import { Suspense } from "react";
import Link from "next/link";
import { Block } from "../_block";
import { appRegistry } from "../_registry";
import { currentSession } from "../_session";
import { formatDateTime } from "../_vocab";
import type { AccountListResult } from "../_types";
import { SuggestionQueue } from "../_suggestion-queue";
import type { SuggestionRow } from "../_suggestion-queue";

export default function SuggestionQueuePage() {
  return (
    <>
      <div className="row">
        <h1 className="page-title">Hàng đợi gợi ý</h1>
      </div>

      <Block title="Hàng đợi gợi ý">
        <Suspense fallback={<QueueSkeleton />}>
          <QueueBlock />
        </Suspense>
      </Block>
    </>
  );
}

/// Một Công ty cùng những Gợi ý đang chờ của nó — đơn vị gom của UJ-2 bước 2
/// (*"gom theo Account — cô không phải tự quyết đọc cái nào trước"*).
type AccountGroup = {
  accountId: string;
  accountName: string;
  rows: SuggestionRow[];
};

async function QueueBlock() {
  const session = await currentSession();
  const { groups, accountCount } = await readAllPending(session);
  const total = groups.reduce((n, g) => n + g.rows.length, 0);

  if (total === 0) {
    return (
      <section className="card">
        <h2 className="card-title">Không có gợi ý nào chờ</h2>
        {/* `EXPERIENCE.md` (*Mẫu trạng thái*, cột `S2` hàng **Rỗng**) đòi câu
            này KÈM thời điểm vòng quét gần nhất. Mốc ấy sống ở Nhật ký vòng quét
            (`S9`), và chưa capability đọc nào phơi nó lên tầng ① — nên chỗ này
            nói **việc phải làm** thay vì bịa một mốc thời gian. Nợ ghi ở
            `_bmad-output/implementation-artifacts/deferred-work.md`.

            ⚠ HAI câu rỗng, không một. Chưa có Công ty nào thì việc phải làm là
            gieo dữ liệu, không phải mở một danh sách rỗng rồi bật một cờ trên
            một hàng không tồn tại — câu chung sẽ chỉ người dùng đi vào ngõ cụt. */}
        {accountCount === 0 ? (
          <p className="empty">
            Chưa có công ty nào trong cơ sở dữ liệu, nên chưa có gì để sinh gợi
            ý. Chạy <code>npm run seed</code> hoặc tạo công ty đầu tiên ở{" "}
            <Link href="/accounts">danh sách công ty</Link>.
          </p>
        ) : (
          <p className="empty">
            Chưa có gợi ý nào chờ quyết. Gợi ý sinh ra khi vòng quét đọc được tin
            mới — bật <strong>Đang theo dõi</strong> cho một công ty ở{" "}
            <Link href="/accounts">danh sách công ty</Link> để nó vào vòng quét
            kế tiếp.
          </p>
        )}
      </section>
    );
  }

  return (
    <>
      <section className="card">
        <h2 className="card-title">
          {total} gợi ý đang chờ · {groups.length} công ty
        </h2>
        {/* `EXPERIENCE.md` (*Giọng chữ*) — con số đi kèm MỐC SO, và ở đây mốc
            so là ba lối ra: người mở trang cần biết mình sắp quyết cái gì. */}
        <p className="muted">
          Ba lối ra cho mỗi gợi ý: <strong>Duyệt</strong> ghi đúng giá trị máy đề
          nghị, <strong>Sửa rồi duyệt</strong> ghi giá trị bạn gõ,{" "}
          <strong>Bỏ</strong> giữ nguyên hồ sơ. Cả ba đều ghi lại ai quyết và lúc
          nào. Cũ nhất đứng trước.
        </p>
      </section>

      {groups.map((g) => (
        <section
          key={g.accountId}
          className="card"
          // `EXPERIENCE.md` — mọi thứ do máy đề nghị mang ray trái và nền riêng,
          // cùng dấu hiệu đã dùng ở mục Dòng thời gian `he_thong`. Nhãn CHỮ nằm
          // trên từng thẻ; màu không bao giờ là dấu hiệu duy nhất.
          style={{
            borderLeft: "3px solid var(--machine-border)",
            background: "var(--machine-bg)",
          }}
        >
          <h2 className="card-title">
            <Link href={`/accounts/${g.accountId}`}>{g.accountName}</Link> ·{" "}
            {g.rows.length} gợi ý
          </h2>
          <p className="muted">
            Cũ nhất từ {formatDateTime(g.rows[0]!.createdAt)}
          </p>
          {/* Lá dùng chung với `S3`. `accountId` truyền xuống để ba action làm
              mới đúng hồ sơ vừa đổi (`AD-UI-9`). */}
          <SuggestionQueue accountId={g.accountId} rows={g.rows} />
        </section>
      ))}
    </>
  );
}

/// Gom hàng đợi của MỌI Công ty, giữ nguyên thứ tự *cũ nhất trước* mà
/// `readPendingSuggestions` (`src/core/suggestion/read.ts:59`) đã áp bên trong
/// từng Công ty.
///
/// ⚠ THỨ TỰ NÀY CHƯA PHẢI THỨ TỰ `FR-18` ĐÒI, và nói ra chứ không trích một mã
/// cho có. `FR-18` chốt khoá xếp là bộ ba **(Độ liên quan, Mức chắc chắn, Công
/// ty có Cơ hội đang chạy)** so lần lượt; `SuggestionRow` — hình dạng mà
/// `readSuggestionQueueCap` trả lên — **không mang** hai trường đầu, nên tầng ①
/// không có gì để so. Xếp theo tuổi việc là thứ tự duy nhất dựng được từ dữ liệu
/// đang có, và nó ít nhất ổn định. Nợ đã ghi ở `deferred-work.md`.
///
/// ⚠ Công ty KHÔNG có Gợi ý chờ bị loại khỏi kết quả, không hiện một khối rỗng:
/// hàng đợi là danh sách việc phải xử, và một mục *"0 gợi ý"* là một dòng người
/// đọc phải bỏ qua bằng mắt ở mỗi lần mở.
///
/// ⚠ KHÔNG lọc `{ watching: true }` cho rẻ. Một Công ty vừa bị tắt Đang theo dõi
/// vẫn còn Gợi ý chờ trên hàng đợi, và `FR-21` chốt Gợi ý chưa quyết **giữ
/// nguyên vô thời hạn**. Lọc theo cờ ấy là làm việc phải quyết biến mất im lặng
/// — đắt hơn nhiều so với vài lượt đọc thừa.
async function readAllPending(
  session: Awaited<ReturnType<typeof currentSession>>,
): Promise<{ groups: AccountGroup[]; accountCount: number }> {
  const listAccounts = await appRegistry.loadCapability("searchAccounts", session.actor);
  const { rows: accounts } = (await listAccounts({})) as AccountListResult;

  const readQueue = await appRegistry.loadCapability(
    "readSuggestionQueue",
    session.actor,
  );

  // ⚠ `allSettled`, KHÔNG `all` — và đây là hàng *Lỗi một phần* của `S2` trong
  // bảng Mẫu trạng thái của `EXPERIENCE.md`: *"Một Suggestion hỏng thì ẩn nó và
  // ghi nhật ký, không đổ cả trang"*. Với `all`, MỘT Công ty đọc hỏng bác cả
  // chùm, `Block` bắt, và toàn bộ hàng đợi của mọi Công ty khác biến mất — đúng
  // thứ luật ấy dựng ra để cấm.
  //
  // Song song chứ không `for await`: N lượt đọc độc lập nhau, nối tiếp chúng
  // nhân độ trễ với N ngay trên đường mở trang.
  const settled = await Promise.allSettled(
    accounts.map(async (a): Promise<AccountGroup> => {
      // ⚠ Ép kiểu bắt buộc — `loadCapability` của sổ đăng ký này trả
      // `BoundCapability<unknown, unknown>`, nên `tsc` KHÔNG bắt được lệch giữa
      // `SuggestionRow` và `fn` của `readSuggestionQueueCap`; hai bên sửa cùng
      // nhau, và chỗ duy nhất phát hiện lệch là màn hình.
      const rows = (await readQueue({ accountId: a.id })) as SuggestionRow[];
      return { accountId: a.id, accountName: a.name, rows };
    }),
  );

  for (const r of settled) {
    // *"ghi nhật ký"* của cùng hàng bảng ấy. Nuốt im lặng thì một Công ty rơi
    // khỏi hàng đợi mà không ai biết, và người dùng tin rằng mình đã xử hết.
    if (r.status === "rejected") {
      console.error("S2: không đọc được hàng đợi của một công ty", r.reason);
    }
  }

  // Công ty có gợi ý **cũ nhất** đứng trước. `searchAccounts` trả theo
  // `updatedAt desc`, một thứ tự nói về *hồ sơ vừa đổi*, không nói về *việc phải
  // xử* — dùng thẳng nó là để thứ tự hàng đợi nhảy mỗi lần ai đó sửa một ô.
  //
  // Khoá phụ `accountId` để hai Công ty cùng mốc thời gian (dữ liệu gieo cùng
  // lô là ca thường gặp) không đổi chỗ giữa hai lượt tải.
  const groups = settled
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value)
    .filter((g) => g.rows.length > 0)
    .sort(
      (a, b) =>
        a.rows[0]!.createdAt.localeCompare(b.rows[0]!.createdAt) ||
        a.accountId.localeCompare(b.accountId),
    );

  // `accountCount` đi kèm để trạng thái rỗng phân biệt được *chưa có công ty
  // nào* với *có công ty nhưng chưa có gợi ý*. Hai câu khác nhau vì việc phải
  // làm khác nhau.
  return { groups, accountCount: accounts.length };
}

function QueueSkeleton() {
  return (
    <section className="card" aria-busy="true">
      {/* `EXPERIENCE.md` (*Mẫu trạng thái*, `S2` hàng **Đang tải**): *"như `S1`"*
          — khung xương giữ chỗ để trang không nhảy khi dữ liệu về. */}
      <p className="muted">Đang đọc hàng đợi gợi ý…</p>
      {[0, 1, 2].map((i) => (
        <div key={i} className="skeleton-row" />
      ))}
    </section>
  );
}
