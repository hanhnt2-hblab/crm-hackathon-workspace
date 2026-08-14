"use client";

// `S6` · `FR-9` · `E1-S10` · `T-1` (*"tìm kiếm và lọc"*) — thanh tìm và lọc.
//
// Biểu mẫu **GET**, không phải server action: một bộ lọc là một cách ĐỌC, và
// đọc thì phải nằm trong địa chỉ. Nhờ vậy trạng thái lọc chia sẻ được, quay lại
// được bằng nút Back, và một lượt tải lại không mất bộ lọc. Server action ở đây
// sẽ phải tự dựng lại cả ba thứ đó bằng tay.
//
// `AD-UI-5` — lá client, không đọc gì; kết quả về qua `searchParams` của
// `page.tsx`, vốn là server component.

import Link from "next/link";
import { Button, Field, Input, Select } from "@fluentui/react-components";

export function AccountFilters({
  facets,
  current,
}: {
  facets: { industries: string[]; markets: string[]; accountTypes: string[] };
  current: {
    text: string;
    industry: string;
    market: string;
    accountType: string;
    watching: boolean;
  };
}) {
  return (
    <form method="get" className="form">
      <div className="form-grid">
        <Field label="Tìm theo tên, ngành, quốc gia">
          <Input name="text" defaultValue={current.text} placeholder="Sakura…" />
        </Field>
        <Field label="Ngành">
          <Select name="industry" defaultValue={current.industry}>
            <option value="">— mọi ngành —</option>
            {facets.industries.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Thị trường">
          <Select name="market" defaultValue={current.market}>
            <option value="">— mọi thị trường —</option>
            {facets.markets.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Loại tài khoản">
          <Select name="accountType" defaultValue={current.accountType}>
            <option value="">— mọi loại —</option>
            {facets.accountTypes.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="form-actions">
        <label className="row" style={{ gap: 6 }}>
          <input type="checkbox" name="watching" defaultChecked={current.watching} />
          <span>Chỉ Công ty Đang theo dõi</span>
        </label>
        <Button type="submit" appearance="primary">
          Lọc
        </Button>
        {/* Xoá lọc là một LIÊN KẾT, không phải một nút gọi JavaScript: nó phải
            chạy được cả khi kịch bản chưa kịp tải, và nó phải đổi địa chỉ —
            bộ lọc sống trong địa chỉ, nên xoá lọc là đi tới địa chỉ trống. */}
        <Link href="/accounts">Xoá lọc</Link>
      </div>
    </form>
  );
}
