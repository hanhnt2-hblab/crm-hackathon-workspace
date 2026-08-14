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

import { Suspense } from "react";
import Link from "next/link";
import { Block } from "./_block";
import { appRegistry } from "./_registry";
import { currentSession } from "./_session";
import type { Overview } from "./_types";
import {
  ADDED_BY_LABEL,
  FLAG_LABEL,
  STAGE_LABEL,
  STAGE_ORDER,
  formatDateTime,
} from "./_vocab";

export default function OverviewPage() {
  return (
    <>
      <div className="row">
        <h1 className="page-title">Tổng quan</h1>
      </div>

      <Block title="Tổng quan">
        <Suspense fallback={<OverviewSkeleton />}>
          <OverviewBlock />
        </Suspense>
      </Block>
    </>
  );
}

async function OverviewBlock() {
  const session = await currentSession();
  const read = await appRegistry.loadCapability("readOverview", session.actor);
  const data = (await read({})) as Overview;

  const running = STAGE_ORDER.filter((s) => s !== "thang" && s !== "thua");

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
            // chỗ thiếu dữ liệu.
            <p className="empty">Không cơ hội nào mang cờ cảnh báo.</p>
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
