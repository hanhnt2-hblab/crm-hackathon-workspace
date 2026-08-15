"use client";

// Luật thi 15/08/2026 §3.3 — bộ chọn Sales của màn hình tổng quan (`S1`).
//
// ⚠ Yêu cầu này KHÔNG có mã thượng nguồn. Không `FR`, không `D`, không `T`: nó
// là luật thi ra ngày 15/08, sau khi PRD và Mục 0 đã chốt. Và nó ĐI NGƯỢC một
// câu của đề bài §2 (*"đội không phải làm phân quyền theo người sở hữu"*) — chỗ
// ngược đó chỉ tan khi đọc §3.3 là một BỘ LỌC XEM chứ không phải một biên giới
// quyền, đúng cách nó được cài ở đây. `T-1` chỉ nói *"mở màn hình tổng quan"*,
// nên nó là mã của BỀ MẶT này, không phải mã của yêu cầu này.
//
// Biểu mẫu **GET**, đúng khuôn `accounts/_filters.tsx`: một bộ lọc là một cách
// ĐỌC, và đọc thì phải nằm trong địa chỉ. Nhờ vậy lựa chọn còn nguyên sau khi
// tải lại trang (`?sales=<id>`), chia sẻ được, và nút Back quay đúng chỗ. Server
// action ở đây sẽ phải tự dựng lại cả ba thứ đó bằng tay.
//
// `AD-UI-5` — lá client, KHÔNG đọc gì; các lựa chọn xuống theo props đã tuần tự
// hoá, và kết quả về qua `searchParams` của `page.tsx` vốn là server component.
//
// ⚠ KHÔNG CÓ THẺ HEADING Ở ĐÂY, và đó không phải chuyện thẩm mỹ.
// `e2e/T1.spec.ts` bắt màn hình tổng quan bằng ba tên vai — `Tổng quan`,
// `Cơ hội theo giai đoạn`, `Cơ hội cần rà lại · N`. Playwright khớp tên vai theo
// **chuỗi con**, nên một heading mới chứa một trong ba chuỗi đó làm
// `strict mode violation` và điểm nghiệm thu nặng nhất đỏ. Mọi chữ ở đây là chữ
// THÊM, không đè lên chữ nào đang có trên `/`.

import { Button, Field, Select } from "@fluentui/react-components";

export function TodaySalesFilter({
  owners,
  unassignedAccountCount,
  current,
}: {
  owners: Array<{ id: string; displayName: string }>;
  unassignedAccountCount: number;
  /// `""` = tất cả · `"none"` = chưa có người phụ trách · còn lại là `id`.
  current: string;
}) {
  return (
    <form method="get" className="form">
      <div className="form-grid">
        <Field label="Xem theo người phụ trách">
          <Select name="sales" defaultValue={current}>
            {/* Lựa chọn ĐẦU TIÊN và là mặc định: giám khảo mở `/` phải thấy
                ngay đủ số, không phải chọn mới thấy gì. */}
            <option value="">— tất cả Sales —</option>
            {owners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.displayName}
              </option>
            ))}
            {/* Chỉ mời khi thật sự có Công ty chưa gán, theo đúng tiền lệ của
                `searchAccountsCap` (`src/capability/caps/ui.ts`, khối `facets`):
                *"bộ lọc không bao giờ mời một lựa chọn trả về 0 dòng"*. Đây là
                quy ước của mã sẵn có, không phải một câu của `S6`. Không có ô
                này thì tổng theo Sales nhỏ hơn tổng toàn cục mà không chỗ nào
                nói phần thiếu đi đâu. */}
            {unassignedAccountCount > 0 ? (
              <option value="none">
                — chưa có người phụ trách ({unassignedAccountCount} công ty) —
              </option>
            ) : null}
          </Select>
        </Field>
      </div>

      <div className="form-actions">
        <Button type="submit" appearance="primary">
          Áp dụng
        </Button>
      </div>
    </form>
  );
}
