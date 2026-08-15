// Màn hình TỔNG QUAN — `T-1` (*"mở màn hình tổng quan"*) · `S1` Today.
//
// ⚠ Đây KHÔNG phải `S8` Admin dashboard. Hai màn hình khác nhau và trộn chúng
// là trộn hai luật quyền: `S8` đọc số đo AI (`src/core/metrics.ts`) và bị Cổng
// từ chối với lý do `role` khi Sales mở (`AD-UI-10`); màn này là bàn làm việc
// của **Sales**, đọc số đếm của nhóm 1, và không có ngưỡng vai nào.
//
// Phần `S1` mà bản dựng này CHƯA có, nói thẳng thay vì để người đọc đoán: dòng
// việc đến hạn, ô Next step do máy đặt, và dấu hiệu *có Gợi ý chờ* đều thuộc
// nhóm 3–4 (`FR-25`, `FR-30`), và cả hai nhánh đó chưa có capability. Cái có ở
// đây là phần `T-1` kiểm: số đếm hồ sơ, phân bố theo giai đoạn, cờ cảnh báo, và
// hoạt động mới nhất.
//
// `AD-UI-5` — server component; `AD-UI-8` — hai khối tải độc lập.
//
// ─────────────────────────────────────────────────────────────────────────────
// BỘ LỌC THEO SALES — luật thi 15/08/2026 §3.3, nguyên văn: *"Màn hình tổng
// quan trong ngày phải có sẵn view lọc theo từng Sales: chọn một Sales thì các
// con số và danh sách trên màn hình chỉ tính dữ liệu thuộc người đó"*.
//
// Đây là một CHIỀU LỌC thêm vào, không phải một màn hình viết lại: mọi chữ hiển
// thị đã có trên `/` còn nguyên từng ký tự, vì `e2e/T1.spec.ts` bắt trang này
// bằng ba tên vai và Playwright khớp tên theo chuỗi con.
//
// ⚠ LỌC NẰM TRONG CAPABILITY, không nằm ở đây. Đọc hết rồi cắt trên giao diện
// sai cả hai đường: sai về SỐ, vì `take: 8` của Hoạt động mới nhất lấy tám dòng
// TOÀN CỤC rồi mới cắt, nên lọc sau khi đọc cho ra ít hơn tám dòng của người đó
// mà không có gì báo là đã mất; và sai về RANH GIỚI, vì tầng ① cầm dữ liệu mà
// nó không được phép hiển thị.
//
// ⚠ BỘ CHỌN LÀ KHỐI RIÊNG (`AD-UI-8`). Nó có `Suspense` và `Block`
// riêng: `readOverview` hỏng thì bộ chọn vẫn render, nên người dùng vẫn đổi
// được bộ lọc để thoát khỏi chỗ hỏng. Gói chung thì một lượt đọc số liệu hỏng
// khoá luôn cái điều khiển duy nhất của màn hình.
// ─────────────────────────────────────────────────────────────────────────────

import { Suspense } from "react";
import Link from "next/link";
import { Block } from "./_block";
import { appRegistry } from "./_registry";
import { currentSession } from "./_session";
import { TodaySalesFilter } from "./_today-sales-filter";
import type { Overview, SalesOwnerOptions } from "./_types";
import {
  ADDED_BY_LABEL,
  FLAG_LABEL,
  STAGE_LABEL,
  STAGE_ORDER,
  formatDateTime,
} from "./_vocab";

export default async function OverviewPage(props: PageProps<"/">) {
  const sp = await props.searchParams;
  const sales = normalizeSales(one(sp.sales));

  return (
    <>
      <div className="row">
        <h1 className="page-title">Tổng quan</h1>
      </div>

      <Block title="Xem theo người phụ trách">
        <Suspense fallback={<SalesFilterSkeleton />}>
          <SalesFilterBlock sales={sales} />
        </Suspense>
      </Block>

      <Block title="Tổng quan">
        <Suspense fallback={<OverviewSkeleton />}>
          <OverviewBlock sales={sales} />
        </Suspense>
      </Block>
    </>
  );
}

async function SalesFilterBlock({ sales }: { sales: string }) {
  const session = await currentSession();
  const read = await appRegistry.loadCapability("readSalesOwners", session.actor);
  const data = (await read({})) as SalesOwnerOptions;

  return (
    <section className="card">
      <TodaySalesFilter
        owners={data.owners}
        unassignedAccountCount={data.unassignedAccountCount}
        current={sales}
      />
    </section>
  );
}

async function OverviewBlock({ sales }: { sales: string }) {
  const session = await currentSession();

  // Hai lượt đọc song song, cùng một `actor`, cùng đi qua Cổng. Lượt thứ hai
  // chỉ để DỊCH `sales` thành tên người: khối này không được nhận tên từ khối
  // bộ chọn, vì `AD-UI-8` bắt hai khối hỏng độc lập — mà độc lập nghĩa là không
  // khối nào chờ khối kia.
  const [readOverview, readOwners] = await Promise.all([
    appRegistry.loadCapability("readOverview", session.actor),
    appRegistry.loadCapability("readSalesOwners", session.actor),
  ]);
  const [data, owners] = await Promise.all([
    readOverview({ ownerId: sales === "" ? null : sales }) as Promise<Overview>,
    readOwners({}) as Promise<SalesOwnerOptions>,
  ]);

  const running = STAGE_ORDER.filter((s) => s !== "thang" && s !== "thua");
  const salesLabel = describeSales(data.ownerId, owners);

  return (
    <>
      <div className="grid-4">
        <div className="stat">
          <div className="stat-num">{data.accountCount}</div>
          <div className="stat-label">công ty</div>
        </div>
        <div className="stat">
          <div className="stat-num">{data.contactCount}</div>
          <div className="stat-label">người liên hệ</div>
        </div>
        <div className="stat">
          <div className="stat-num">{data.opportunityCount}</div>
          <div className="stat-label">cơ hội</div>
        </div>
        <div className="stat">
          {/* `EXPERIENCE.md` (*Giọng chữ*) — con số đi kèm MỐC SO. *"3/12 cơ
              hội mang cờ"* nói được điều mà *"3 cơ hội"* không nói. */}
          <div className="stat-num">
            {data.flagged.length}/{data.opportunityCount}
          </div>
          <div className="stat-label">cơ hội mang cờ cảnh báo</div>
        </div>
      </div>

      {/* Luật thi 15/08/2026 §3.3 — dòng THÊM, không đè lên nhãn nào ở trên.
          Chính luật đó đòi *"chọn một Sales thì các con số … chỉ tính dữ liệu
          thuộc người đó"*, nên màn hình phải nói được nó đang tính cho ai.
          Bốn ô đếm không tự nói được
          chúng đang đếm phạm vi nào, và một con số không nói phạm vi là một con
          số đọc nhầm được. Nó đọc `data.ownerId` — bộ lọc capability THẬT SỰ đã
          dùng — chứ không đọc lại tham số địa chỉ, nên chữ ở đây không bao giờ
          nói một đằng còn con số tính một nẻo. */}
      <p className="field-note">Đang tính cho: {salesLabel}.</p>

      <section className="card">
        <h2 className="card-title">Cơ hội theo giai đoạn</h2>
        <div className="row">
          {STAGE_ORDER.map((s) => (
            <span key={s} className="tag">
              {STAGE_LABEL[s]}: {data.byStage[s] ?? 0}
            </span>
          ))}
        </div>
        <p className="field-note">
          Đang chạy: {running.reduce((n, s) => n + (data.byStage[s] ?? 0), 0)} · Đã
          đóng: {(data.byStage.thang ?? 0) + (data.byStage.thua ?? 0)}
        </p>
        <Link href="/board">Mở bảng giai đoạn →</Link>
      </section>

      <div className="grid-2">
        <section className="card">
          <h2 className="card-title">Cơ hội cần rà lại · {data.flagged.length}</h2>
          {data.flagged.length === 0 ? (
            // Trạng thái rỗng ở đây là TIN VUI, nên nó không dùng giọng của một
            // chỗ thiếu dữ liệu. Khi đang lọc thì nói rõ lọc theo AI — *"không
            // cơ hội nào"* trong lúc một bộ lọc đang bật là một câu nói sai
            // (`EXPERIENCE.md`, `S6` hàng *Lỗi*).
            <p className="empty">
              Không cơ hội nào mang cờ cảnh báo.
              {data.ownerId === null ? "" : ` (đang lọc theo ${salesLabel})`}
            </p>
          ) : (
            <table className="table">
              <tbody>
                {data.flagged.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <Link href={`/accounts/${o.accountId}`}>{o.accountName}</Link>
                      <div>
                        <strong>{o.name}</strong> ·{" "}
                        <span className="muted">
                          {STAGE_LABEL[o.stage as keyof typeof STAGE_LABEL] ?? o.stage}
                        </span>
                      </div>
                      {o.flags.map((f) => (
                        <span key={f} className="tag tag-warn">
                          ⚠ {FLAG_LABEL[f] ?? f}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="card">
          <h2 className="card-title">Hoạt động mới nhất</h2>
          {data.recentEntries.length === 0 ? (
            <p className="empty">
              Hôm nay chưa có việc nào được ghi. Mở một công ty rồi ghi hoạt động
              đầu tiên.
              {data.ownerId === null ? "" : ` (đang lọc theo ${salesLabel})`}
            </p>
          ) : (
            <table className="table">
              <tbody>
                {data.recentEntries.map((e) => (
                  <tr key={e.id}>
                    <td className="muted" style={{ width: 150 }}>
                      {formatDateTime(e.occurredAt)}
                    </td>
                    <td>
                      <Link href={`/accounts/${e.accountId}`}>{e.accountName}</Link>
                      <div>{e.content}</div>
                      <span className="muted">
                        {ADDED_BY_LABEL[e.addedBy] ?? e.addedBy}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </>
  );
}

function SalesFilterSkeleton() {
  return (
    <section className="card" aria-busy="true">
      <p className="muted">Đang đọc danh sách người phụ trách…</p>
    </section>
  );
}

function OverviewSkeleton() {
  return (
    <section className="card" aria-busy="true">
      <p className="muted">Đang đọc số liệu tổng quan…</p>
      {[0, 1, 2].map((i) => (
        <div key={i} className="skeleton-row" />
      ))}
    </section>
  );
}

/// Chữ cho phạm vi đang tính. Tên người tra từ danh sách THẬT; một `id` không
/// tra được vẫn phải ra một câu đọc được, không ra một `uuid` trần.
function describeSales(ownerId: string | null, owners: SalesOwnerOptions): string {
  if (ownerId === null) return "tất cả Sales";
  if (ownerId === "none") return "công ty chưa có người phụ trách";
  return owners.owners.find((o) => o.id === ownerId)?.displayName ?? "một người phụ trách";
}

/// `?sales=` chấp nhận ĐÚNG ba hình dạng: rỗng (tất cả), `none`, hoặc một
/// `uuid`. Bất kỳ thứ gì khác quy về **tất cả** ngay tại đây.
///
/// ⚠ Lọc ở đây KHÔNG thay cho Zod của capability, và ngược lại. Zod là chốt
/// đúng đắn; chốt này là chốt TRẢI NGHIỆM: một địa chỉ gõ tay hỏng phải ra màn
/// hình đầy đủ, không ra một trang lỗi. Bỏ chốt này thì `?sales=abc` thành
/// `bad_params` và cả màn hình tổng quan trắng vì một ký tự thừa.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function normalizeSales(v: string): string {
  if (v === "none") return "none";
  return UUID.test(v) ? v : "";
}

function one(v: string | string[] | undefined): string {
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}
