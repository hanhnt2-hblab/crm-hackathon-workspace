// `S3` Account detail · `FR-1` `FR-2` `FR-6` `FR-11`…`FR-14` · `T-1`.
//
// `AD-UI-5` — server component, nơi duy nhất gọi `loadCapability()`.
//
// `AD-UI-8` — khối hỏng độc lập thì tải độc lập. Trang này có **hai** ranh giới
// đọc, không phải bốn:
//
//   · hồ sơ + Người liên hệ + Cơ hội — MỘT lượt đọc (`readAccountDetail`)
//   · Dòng thời gian — lượt đọc riêng (`readAccountTimeline`)
//
// Vì sao ba khối đầu đi chung một lượt đọc dù `AD-UI-8` đếm bốn khối: chúng
// hỏng CÙNG NHAU (cùng một Công ty, cùng một khoá ngoại) và chậm cùng nhau,
// nên tách ba lượt chỉ thêm hai vòng tới cơ sở dữ liệu mà không tách được thứ
// gì hỏng riêng. Khối mà luật đó thật sự nhắm tới đã tách: **Dòng thời gian
// chậm không chặn hồ sơ** — đúng nguyên văn `EXPERIENCE.md`, hàng *Đang tải*
// của `S3`.

import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Block } from "../../_block";
import { appRegistry } from "../../_registry";
import { currentSession } from "../../_session";
import {
  ACCOUNT_TYPE_LABEL,
  ADDED_BY_LABEL,
  FLAG_LABEL,
  MARKET_LABEL,
  formatAmount,
  formatDateTime,
  stageLabel,
} from "../../_vocab";
import type { AccountDetail, TimelineRow } from "../../_types";
import { WatchToggle } from "../_watch-toggle";
import { ActivityForm, ContactForm, OpportunityForm } from "./_forms";
import { SignalsBlock } from "./_signals";
import { SuggestionsBlock } from "./_suggestions";
import { NextActionBlock } from "./_next-action";

export default async function AccountDetailPage(props: PageProps<"/accounts/[id]">) {
  const { id } = await props.params;

  return (
    <>
      <div className="row">
        <Link href="/accounts">← Danh sách công ty</Link>
      </div>

      <Block title="Hồ sơ công ty">
        <Suspense fallback={<ProfileSkeleton />}>
          <ProfileBlock accountId={id} />
        </Suspense>
      </Block>

      {/* `T-6` `T-7` §4/nhóm 4 — Việc tiếp theo và nút Hoàn tác. */}
      <Block title="Việc tiếp theo">
        <Suspense fallback={<p className="muted">Đang đọc…</p>}>
          <NextActionBlock accountId={id} />
        </Suspense>
      </Block>

      {/* `T-5` §4/nhóm 3 — hàng đợi Gợi ý, ba lối ra bấm được. */}
      <Block title="Gợi ý chờ quyết">
        <Suspense fallback={<p className="muted">Đang đọc…</p>}>
          <SuggestionsBlock accountId={id} />
        </Suspense>
      </Block>

      {/* `T-3` — Phát hiện, bấm vào thì mở đoạn văn gốc có đánh dấu vị trí. */}
      <Block title="Phát hiện">
        <Suspense fallback={<p className="muted">Đang đọc…</p>}>
          <SignalsBlock accountId={id} />
        </Suspense>
      </Block>

      {/* Khối chậm nhất, ranh giới riêng: nó hỏng hay chậm thì hồ sơ bên trên
          vẫn dùng được (`AD-UI-8`). */}
      <Block title="Dòng thời gian">
        <Suspense fallback={<TimelineSkeleton />}>
          <TimelineBlock accountId={id} />
        </Suspense>
      </Block>
    </>
  );
}

async function ProfileBlock({ accountId }: { accountId: string }) {
  const session = await currentSession();
  const read = await appRegistry.loadCapability("readAccountDetail", session.actor);
  const data = (await read({ accountId })) as AccountDetail | null;

  // Công ty không tồn tại (hoặc đã xoá mềm — `db` lọc `deleted_at`, `AD-14`).
  // 404 thật, không phải một khối rỗng: người vừa mở một liên kết cũ cần biết
  // trang này không còn, không phải đoán.
  if (data === null) notFound();

  const { account, contacts, opportunities } = data;

  return (
    <>
      <section className="card">
        <div className="row">
          <h1 className="page-title">{account.name}</h1>
          {account.watching ? <span className="tag tag-ok">Đang theo dõi</span> : null}
          <WatchToggle id={account.id} watching={account.watching} />
        </div>
        <div className="row">
          <span className="tag">{MARKET_LABEL[account.market] ?? account.market}</span>
          {account.industry ? <span className="tag">{account.industry}</span> : null}
          {account.accountType ? (
            <span className="tag">
              {ACCOUNT_TYPE_LABEL[account.accountType] ?? account.accountType}
            </span>
          ) : null}
          {account.country ? <span className="tag">{account.country}</span> : null}
          {account.website ? (
            <a href={account.website} target="_blank" rel="noopener noreferrer">
              {account.website}
            </a>
          ) : null}
        </div>
        <p className="muted">Cập nhật lần cuối {formatDateTime(account.updatedAt)}</p>
      </section>

      <div className="grid-2">
        <section className="card">
          <h2 className="card-title">Cơ hội · {opportunities.length}</h2>
          {opportunities.length === 0 ? (
            <p className="empty">
              Chưa có cơ hội nào. Tạo cơ hội đầu tiên bằng biểu mẫu bên dưới —
              nó sẽ bắt đầu ở giai đoạn Tiếp cận.
            </p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Cơ hội</th>
                  <th>Giai đoạn</th>
                  <th>Giá trị</th>
                  <th>Cờ cảnh báo</th>
                </tr>
              </thead>
              <tbody>
                {opportunities.map((o) => (
                  <tr key={o.id}>
                    <td>{o.name}</td>
                    <td>
                      <span className="tag">{stageLabel(o.stage)}</span>
                    </td>
                    <td>{formatAmount(o.amount, o.currency)}</td>
                    <td>
                      {/* `EXPERIENCE.md` — cờ **không chặn thao tác**, chỉ đánh
                          dấu; và mỗi cờ có CHỮ, không bao giờ chỉ có màu. */}
                      {o.flags.length === 0 ? (
                        <span className="muted">không</span>
                      ) : (
                        o.flags.map((f) => (
                          <span key={f} className="tag tag-warn">
                            ⚠ {FLAG_LABEL[f] ?? f}
                          </span>
                        ))
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <h3 className="card-title">Tạo cơ hội</h3>
          <OpportunityForm accountId={account.id} />
        </section>

        <section className="card">
          <h2 className="card-title">Người liên hệ · {contacts.length}</h2>
          {contacts.length === 0 ? (
            <p className="empty">Chưa có người liên hệ nào cho công ty này.</p>
          ) : (
            <table className="table">
              <tbody>
                {contacts.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong>{c.name}</strong>
                      {c.isPrimary ? (
                        <span className="tag tag-ok">Đầu mối chính</span>
                      ) : null}
                      <div className="muted">
                        {c.title ?? "—"}
                        {c.email ? ` · ${c.email}` : ""}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <h3 className="card-title">Thêm người liên hệ</h3>
          <ContactForm accountId={account.id} />
        </section>
      </div>

      <section className="card">
        <h2 className="card-title">Ghi hoạt động</h2>
        <ActivityForm accountId={account.id} />
      </section>
    </>
  );
}

async function TimelineBlock({ accountId }: { accountId: string }) {
  const session = await currentSession();
  const read = await appRegistry.loadCapability("readAccountTimeline", session.actor);
  const entries = (await read({ accountId })) as TimelineRow[];

  return (
    <section className="card">
      <h2 className="card-title">Dòng thời gian · {entries.length} mục</h2>
      {entries.length === 0 ? (
        <p className="empty">
          Chưa có mục nào trên dòng thời gian. Ghi một hoạt động ở khối bên trên.
        </p>
      ) : (
        <table className="table">
          <tbody>
            {entries.map((e) => (
              // `EXPERIENCE.md` — phân biệt máy/người **không bao giờ chỉ bằng
              // màu**: mục do máy thêm mang cả nhãn chữ lẫn ray trái.
              <tr key={e.id}>
                <td style={{ width: 170 }} className="muted">
                  {formatDateTime(e.occurredAt)}
                </td>
                <td
                  style={
                    e.addedBy === "he_thong"
                      ? {
                          borderLeft: "3px solid var(--machine-border)",
                          background: "var(--machine-bg)",
                        }
                      : undefined
                  }
                >
                  {e.content}
                  <div className="muted">{ADDED_BY_LABEL[e.addedBy] ?? e.addedBy}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

function ProfileSkeleton() {
  return (
    <section className="card" aria-busy="true">
      <p className="muted">Đang đọc hồ sơ công ty…</p>
      {[0, 1, 2].map((i) => (
        <div key={i} className="skeleton-row" />
      ))}
    </section>
  );
}

function TimelineSkeleton() {
  return (
    <section className="card" aria-busy="true">
      <h2 className="card-title">Dòng thời gian</h2>
      <p className="muted">Đang đọc dòng thời gian…</p>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="skeleton-row" />
      ))}
    </section>
  );
}
