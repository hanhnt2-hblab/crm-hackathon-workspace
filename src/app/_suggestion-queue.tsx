"use client";

// Khối *Gợi ý chờ quyết* · `§4`/nhóm 3 · `T-5` — BA lối ra bấm được.
//
// ⚠ TỆP NÀY ĐÃ CHUYỂN LÊN `src/app/` (15/08) và mất tiền tố `S3` ở dòng đầu:
// từ lúc bề mặt `S2` (`/suggestions`) dựng lên, **hai** bề mặt cùng dựng lá này
// — `S3` cho một Công ty, `S2` cho mọi Công ty gom lại. Đó đúng là vai mà
// `src/app/` giữ cho `_action-state.tsx` và `_block.tsx`: hình dạng mà NHIỀU bề
// mặt cùng nhận.
//
// Hai lý do chuyển, và lý do thứ hai mới là lý do bắt buộc:
//   ① Một bản sao thứ hai cho `S2` là hai chỗ sẽ trôi khỏi nhau, đúng ở nơi
//      `T-5` đo *ba lối ra tách bạch* và `BR-B6` đo *thời gian quyết*.
//   ② Để `S2` nhập được, đường nhập phải đi **vào trong** `accounts/[id]/` —
//      một hình dạng chưa tệp nào trong repo này dùng, nên chưa bản dựng xanh
//      nào chứng minh. Chiều **ra khỏi** `[id]` thì đã có sẵn (`../../_contract`,
//      `../_watch-toggle`). Không chạy được `next build` để kiểm (cổng 3000
//      đang có người dùng), nên chọn hình dạng đã được chứng minh thay vì hình
//      dạng chỉ mới được `tsc` chấp nhận.
//
// ⚠ VÌ SAO TỆP NÀY TỒN TẠI, tách khỏi khối server ngay cạnh:
// `_suggestions.tsx` **phải** là server component — `page.tsx` gọi
// `SuggestionsBlock({accountId})` và khối ấy gọi `loadCapability` (`AD-UI-5`).
// Một module không thể vừa là server component vừa mang `'use client'`, và
// `_suggestion-actions.ts` là `.ts` nên không chứa được JSX. Bỏ lá client thì
// mất hai thứ có mã thượng nguồn:
//   · đồng hồ `BR-B6` — đo từ lúc **mở chi tiết** một Gợi ý, việc chỉ trình
//     duyệt biết; máy chủ chỉ biết lúc render, tức lúc mở **hàng đợi**
//   · `ActionMessage` cho lần Cổng từ chối (`AD-UI-10`, `D28`) — không có nó
//     thì một lần từ chối `role` là một cú bấm không phản hồi gì
//
// `AD-UI-5` — lá này nhận props **đã tuần tự hoá** (`createdAt` là chuỗi ISO) và
// **không** gọi `loadCapability`.
//
// `AD-UI-6` — ba biểu mẫu, ba `useActionState`, ba server action. Không có một
// nút nào tự đoán capability theo dữ liệu.

import { useActionState, useEffect, useRef } from "react";
import type { MouseEvent } from "react";
import { Button, Input, Select } from "@fluentui/react-components";
import { IDLE } from "./_contract";
import { ActionMessage } from "./_action-state";
import {
  approveSuggestionAction,
  dropSuggestionAction,
  editThenApproveSuggestionAction,
} from "./_suggestion-actions";

/// Hình dạng một hàng của hàng đợi, sau khi `readSuggestionQueue` tuần tự hoá.
///
/// Khai ở ĐÂY chứ không ở `_types.ts`: kiểu này chỉ có hai bên đọc — khối server
/// ngay cạnh và lá này — nên một khai báo dùng chung ở tệp kia là mở rộng một
/// hợp đồng toàn cục cho hai tệp anh em. `_types.ts` giữ đúng vai của nó: hình
/// dạng mà **nhiều** bề mặt cùng nhận.
export type SuggestionRow = {
  id: string;
  /// Suy từ `targetField` ở lõi (`FR-18`), không phải một cột.
  kind: "fill_field" | "add_timeline";
  targetField: string | null;
  /// `FR-19` vế *"hiện tại"* — đọc SỐNG lúc mở, không phải ảnh chụp lúc sinh.
  currentValue: string | null;
  proposedValue: string | null;
  timelineText: string | null;
  createdAt: string;
  signalId: string;
  claim: string;
  quote: string;
};

/// Tám ô đích của `enum TargetField`. Token ở cột, chữ có dấu ở đây — quy ước
/// cha: lõi và tầng ④ không chứa chuỗi hiển thị nào.
const TARGET_FIELD_LABEL: Record<string, string> = {
  website: "Website",
  country: "Quốc gia",
  specialty_area: "Lĩnh vực chuyên sâu",
  revenue_range: "Khoảng doanh thu",
  industry: "Ngành",
  deal_value_tier: "Bậc giá trị hợp đồng",
  founded_year: "Năm thành lập",
  account_type: "Loại công ty",
};

/// `BR-D10` · `0.1.7` — NĂM lý do Bỏ, chọn trong danh sách, không nhập tự do.
///
/// ⚠ Khớp TỪNG CHỮ `enum DropReason`. Không phải `trung_lap`/`chua_den_luc` —
/// hai tên đó đã bị bác ở Mục 0. `thong_tin_sai` là giá trị DUY NHẤT vào tử số
/// `errorDetectionRate` (`D30`), nên nó đứng đầu: người bắt được một tin sai
/// phải chọn được nó mà không phải cuộn.
const DROP_REASON_LABEL: Record<string, string> = {
  thong_tin_sai: "Thông tin sai",
  khong_lien_quan: "Không liên quan",
  da_cu: "Đã cũ",
  hieu_sai_ngu_canh: "Hiểu sai ngữ cảnh",
  khac: "Khác",
};

export function SuggestionQueue({
  accountId,
  rows,
}: {
  accountId: string;
  rows: SuggestionRow[];
}) {
  return (
    // Kiểu nội dòng chứ không thêm một lớp: `globals.css` thuộc cục khác, và một
    // lớp mới ở đó là một lần sửa tệp dùng chung để chỉnh đúng một danh sách.
    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "var(--m)" }}>
      {rows.map((row) => (
        <SuggestionCard key={row.id} accountId={accountId} row={row} />
      ))}
    </ul>
  );
}

function SuggestionCard({ accountId, row }: { accountId: string; row: SuggestionRow }) {
  const [approveState, approve, approving] = useActionState(approveSuggestionAction, IDLE);
  const [editState, editThenApprove, editing] = useActionState(
    editThenApproveSuggestionAction,
    IDLE,
  );
  const [dropState, drop, dropping] = useActionState(dropSuggestionAction, IDLE);
  const busy = approving || editing || dropping;

  // `BR-B6` — đồng hồ của RIÊNG hàng này.
  //
  // ⚠ Mốc là lúc người **chạm vào hàng này**, không phải lúc trang tải xong:
  // ngưỡng duyệt mù 3 giây đo khoảng người thật sự nhìn một Gợi ý, và một mốc
  // dùng chung cho cả hàng đợi làm Gợi ý thứ ba luôn trông như đã cân nhắc lâu.
  // Con trỏ và bàn phím đều được tính — người dùng bàn phím không hover.
  //
  // `useRef` chứ không `useState`: mốc này không vẽ lại gì cả, và một `setState`
  // ở `onPointerEnter` là một lượt render mỗi lần rê chuột qua.
  //
  // ⚠ Mốc dự phòng đặt trong `useEffect`, KHÔNG phải `useRef(Date.now())`:
  // `react-hooks/purity` bác mọi lời gọi `Date.now()` **trong lúc render**, và
  // nó bác đúng — thân component chạy lại nhiều lần, kể cả một lượt render trên
  // máy chủ vốn cho một đồng hồ khác hẳn đồng hồ trình duyệt.
  const openedAt = useRef<number | null>(null);
  const mountedAt = useRef<number | null>(null);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);
  const markOpened = () => {
    if (openedAt.current === null) openedAt.current = Date.now();
  };

  /// Ghi số giây vào ô ẩn NGAY TRƯỚC khi biểu mẫu gửi đi.
  ///
  /// `onClick` của nút chạy trước sự kiện `submit`, nên giá trị luôn là lúc bấm
  /// chứ không phải lúc render. Đi qua `e.currentTarget.form` thay vì một `ref`
  /// cho mỗi ô: ba biểu mẫu trên một hàng thì ba `ref` là ba chỗ để nhầm, còn
  /// `form` thì trình duyệt tự trỏ đúng biểu mẫu chứa nút vừa bấm.
  const stampSeconds = (e: MouseEvent<HTMLButtonElement>) => {
    const field = e.currentTarget.form?.elements.namedItem("decisionSeconds");
    if (!(field instanceof HTMLInputElement)) return;
    // Ba mức lùi: mốc chạm hàng này → mốc gắn vào cây → lúc bấm (0 giây). Mức
    // cuối chỉ xảy ra khi hiệu ứng gắn chưa chạy, tức trước cả lượt hydrate đầu
    // tiên — lúc ấy nút còn chưa bấm được.
    const now = Date.now();
    const from = openedAt.current ?? mountedAt.current ?? now;
    field.value = String(Math.max(0, Math.round((now - from) / 1000)));
  };

  const heading =
    row.kind === "fill_field"
      ? (TARGET_FIELD_LABEL[row.targetField ?? ""] ?? row.targetField ?? "Ô hồ sơ")
      : "Thêm tin vào dòng thời gian";
  const proposed = row.kind === "fill_field" ? row.proposedValue : row.timelineText;

  return (
    <li className="card" onPointerEnter={markOpened} onFocusCapture={markOpened}>
      <div className="row">
        {/* `EXPERIENCE.md` — phân biệt máy/người KHÔNG BAO GIỜ chỉ bằng màu:
            nhãn này có chữ, và khối có ray trái ở `_suggestions.tsx`. */}
        <span className="tag tag-machine">Máy đề nghị</span>
        <strong>{heading}</strong>
      </div>

      <p>
        {row.kind === "fill_field" ? (
          <>
            <span className="muted">Đang có: </span>
            <span>{row.currentValue ?? "chưa có"}</span>
            <span className="muted"> → đề nghị: </span>
            <strong>{proposed}</strong>
          </>
        ) : (
          <strong>{proposed}</strong>
        )}
      </p>

      {/* `AD-22` · `T-5` — CĂN CỨ đi kèm quyết định. Không có câu trích thì người
          duyệt không có gì để kiểm, và `BR-B6` đo một nhịp bấm vô nghĩa. */}
      <p className="muted">
        {row.claim} — “{row.quote}”
      </p>

      {/* ① DUYỆT — `FR-20`. Ghi thẳng giá trị đề nghị vào ô hồ sơ. */}
      <form action={approve} className="row" aria-label="Duyệt gợi ý">
        <HiddenFields suggestionId={row.id} accountId={accountId} />
        <Button type="submit" appearance="primary" disabled={busy} onClick={stampSeconds}>
          Duyệt
        </Button>
        <span className="field-note">Ghi đúng giá trị máy đề nghị.</span>
      </form>
      <ActionMessage state={approveState} />

      {/* ② SỬA RỒI DUYỆT — `FR-22`.
          ⚠ Ô này để TRỐNG, không điền sẵn giá trị đề nghị. Điền sẵn thì một cú
          bấm không sửa gì vẫn ghi `sua_roi_duyet`, và con số *sửa* phình lên
          bằng đúng những lượt thật ra là *duyệt* — `T-5` tách hai lối ra này
          chính vì thế. Trống thì phải gõ, và `min(1)` ở tầng ④ canh nốt. */}
      <form action={editThenApprove} className="row" aria-label="Sửa rồi duyệt gợi ý">
        <HiddenFields suggestionId={row.id} accountId={accountId} />
        <Input
          name="editedValue"
          required
          disabled={busy}
          placeholder={proposed ?? "Giá trị bạn muốn ghi"}
          aria-label="Giá trị bạn sửa"
        />
        <Button type="submit" disabled={busy} onClick={stampSeconds}>
          Sửa rồi duyệt
        </Button>
      </form>
      <ActionMessage state={editState} />

      {/* ③ BỎ — `FR-21` · `BR-D10`. Hồ sơ giữ nguyên vô thời hạn. */}
      <form action={drop} className="row" aria-label="Bỏ gợi ý">
        <HiddenFields suggestionId={row.id} accountId={accountId} />
        <Select
          name="dropReason"
          defaultValue="thong_tin_sai"
          disabled={busy}
          aria-label="Lý do bỏ"
        >
          {Object.entries(DROP_REASON_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <Button type="submit" disabled={busy} onClick={stampSeconds}>
          Bỏ
        </Button>
      </form>
      <ActionMessage state={dropState} />
    </li>
  );
}

/// Ba ô ẩn dùng chung cho cả ba biểu mẫu.
///
/// `decisionSeconds` là ô KHÔNG kiểm soát (`defaultValue`): `stampSeconds` ghi
/// thẳng vào `.value` lúc bấm, và một ô có `value` do React giữ sẽ nuốt mất lần
/// ghi đó ở lượt render kế tiếp.
function HiddenFields({
  suggestionId,
  accountId,
}: {
  suggestionId: string;
  accountId: string;
}) {
  return (
    <>
      <input type="hidden" name="suggestionId" value={suggestionId} />
      <input type="hidden" name="accountId" value={accountId} />
      <input type="hidden" name="decisionSeconds" defaultValue="0" />
    </>
  );
}
