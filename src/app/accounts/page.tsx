// `S6` Account list · `FR-9` · `T-1` (*"tạo được công ty … tìm kiếm và lọc"*).
//
// `AD-UI-5` — server component, và là một trong hai loại tệp được gọi
// `loadCapability()`. Nó **không** render tĩnh: `currentSession()` đọc cookie,
// và đọc cookie ép Next render động mỗi lượt yêu cầu. Không `revalidate`,
// không `'use cache'` ở đây (`AD-UI-5`, luật *không render tĩnh*).
//
// `AD-UI-8` — HAI khối hỏng độc lập: biểu mẫu tạo và danh sách. Danh sách nằm
// trong `Suspense` riêng, nên một lượt đọc chậm hoặc hỏng **không** chặn biểu
// mẫu tạo. Không có một lần `await` nào ở mức trang.

import { Suspense } from "react";
import Link from "next/link";
import { Block } from "../_block";
import { appRegistry } from "../_registry";
import { currentSession } from "../_session";
import { ACCOUNT_TYPE_LABEL, MARKET_LABEL, formatDateTime } from "../_vocab";
import type { AccountListResult } from "../_types";
import { CompanyForm } from "./_company-form";
import { AccountFilters } from "./_filters";

export default async function AccountsPage(props: PageProps<"/accounts">) {
  const sp = await props.searchParams;
  const filters = {
    text: one(sp.text),
    industry: one(sp.industry),
    market: one(sp.market),
    accountType: one(sp.accountType),
    watching: one(sp.watching) !== "",
  };

  return (
    <>
      <div className="row">
        <h1 className="page-title">Công ty</h1>
      </div>

      <section className="card">
        <h2 className="card-title">Tạo công ty mới</h2>
        <CompanyForm />
      </section>

      {/* Khối độc lập: khung xương lúc tải KHÔNG phải component của trạng thái
          rỗng (`AD-UI-8`), và nó giữ đúng chiều cao mấy dòng để trang không
          nhảy (`UX-4`). `Block` là ranh giới lỗi của riêng khối này. */}
      <Block title="Danh sách công ty">
        <Suspense fallback={<AccountListSkeleton />}>
          <AccountListBlock filters={filters} />
        </Suspense>
      </Block>
    </>
  );
}

type Filters = {
  text: string;
  industry: string;
  market: string;
  accountType: string;
  watching: boolean;
};

async function AccountListBlock({ filters }: { filters: Filters }) {
  const session = await currentSession();
  const read = await appRegistry.loadCapability("searchAccounts", session.actor);
  const data = (await read({
    text: filters.text || null,
    industry: filters.industry || null,
    market: filters.market || null,
    accountType: filters.accountType || null,
    watching: filters.watching ? true : null,
  })) as AccountListResult;

  const filtering =
    filters.text !== "" ||
    filters.industry !== "" ||
    filters.market !== "" ||
    filters.accountType !== "" ||
    filters.watching;

  return (
    <section className="card">
      <h2 className="card-title">
        Danh sách · {data.rows.length} công ty
        {filtering ? " khớp bộ lọc" : ""}
      </h2>

      <AccountFilters facets={data.facets} current={filters} />

      {data.rows.length === 0 ? (
        // Trạng thái RỖNG — chỉ tới được SAU một lượt đọc thành công trả 0 dòng
        // (`AD-UI-8`). Và khi đang lọc thì nói rõ **lọc nào** đang bật
        // (`EXPERIENCE.md`, `S6` hàng *Lỗi*), vì *"chưa có account nào"* trong
        // lúc một bộ lọc đang bật là một câu nói sai.
        <p className="empty">
          {filtering ? (
            <>
              Không có công ty nào khớp bộ lọc đang bật
              {describeFilters(filters)}. Xoá bớt một điều kiện rồi thử lại.
            </>
          ) : (
            <>Chưa có công ty nào. Dùng biểu mẫu bên trên để tạo công ty đầu tiên.</>
          )}
        </p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Thị trường</th>
              <th>Ngành</th>
              <th>Loại</th>
              <th>Người liên hệ</th>
              <th>Cơ hội</th>
              <th>Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <Link href={`/accounts/${r.id}`}>{r.name}</Link>
                  {r.watching ? <span className="tag tag-ok">Đang theo dõi</span> : null}
                </td>
                <td>{MARKET_LABEL[r.market] ?? r.market}</td>
                <td>{r.industry ?? <span className="muted">chưa có</span>}</td>
                <td>
                  {r.accountType ? (
                    (ACCOUNT_TYPE_LABEL[r.accountType] ?? r.accountType)
                  ) : (
                    <span className="muted">chưa có</span>
                  )}
                </td>
                <td>{r.contactCount}</td>
                <td>{r.opportunityCount}</td>
                <td className="muted">{formatDateTime(r.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

function AccountListSkeleton() {
  return (
    <section className="card" aria-busy="true">
      <h2 className="card-title">Danh sách</h2>
      <p className="muted">Đang đọc danh sách công ty…</p>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="skeleton-row" />
      ))}
    </section>
  );
}

/// `EXPERIENCE.md` (`S6`, hàng *Lỗi*) — nói rõ **lọc nào** đang bật. Câu này là
/// lý do bộ lọc được trả ngược lại cùng dữ liệu thay vì để bề mặt tự nhớ.
function describeFilters(f: Filters): string {
  const parts: string[] = [];
  if (f.text) parts.push(`từ khoá “${f.text}”`);
  if (f.industry) parts.push(`ngành ${f.industry}`);
  if (f.market) parts.push(`thị trường ${MARKET_LABEL[f.market] ?? f.market}`);
  if (f.accountType) {
    parts.push(`loại ${ACCOUNT_TYPE_LABEL[f.accountType] ?? f.accountType}`);
  }
  if (f.watching) parts.push("chỉ Đang theo dõi");
  return parts.length === 0 ? "" : `: ${parts.join(" · ")}`;
}

function one(v: string | string[] | undefined): string {
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}
