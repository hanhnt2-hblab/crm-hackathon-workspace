// `S3` khối *Gợi ý chờ quyết* · `§4`/nhóm 3 · `FR-19`…`FR-23` · `T-5`.
//
// `AD-UI-5` — SERVER COMPONENT, và là nơi duy nhất của khối này gọi
// `loadCapability()`. Phần bấm được nằm ở lá `'use client'` dùng chung
// `src/app/_suggestion-queue.tsx` — lá ấy đã chuyển lên gốc `src/app/` ngày
// 15/08 vì bề mặt `S2` (`/suggestions`) cũng dựng nó. Lý do tách hai tệp, và
// lý do chuyển, đều ghi ở đầu tệp lá.
//
// `AD-UI-8` — khối này có ranh giới `Suspense` riêng ở `page.tsx`: hàng đợi đọc
// chậm hay hỏng thì hồ sơ Công ty bên trên vẫn dùng được.
//
// `AD-1` — không `db`, không `@prisma/client`. Một lượt đọc ở đây đi xuống qua
// sổ đăng ký, nên nó có `actor`, đi qua Cổng, và để lại dòng ghi vết pha 1.

import Link from "next/link";
import { appRegistry } from "../../_registry";
import { currentSession } from "../../_session";
import { formatDateTime } from "../../_vocab";
import { SuggestionQueue } from "../../_suggestion-queue";
import type { SuggestionRow } from "../../_suggestion-queue";

export async function SuggestionsBlock({ accountId }: { accountId: string }) {
  const session = await currentSession();
  const read = await appRegistry.loadCapability("readSuggestionQueue", session.actor);
  // ⚠ Ép kiểu là bắt buộc: `loadCapability` trả `BoundCapability<unknown, unknown>`
  // (`AD-CP-1`) — sổ đăng ký cố ý không lộ kiểu trả về của từng mục, vì tên
  // capability là từ vựng mở lúc chạy. `tsc` KHÔNG bắt được lệch giữa hai bên;
  // chỗ duy nhất phát hiện là màn hình, nên `SuggestionRow` và `fn` của
  // `readSuggestionQueueCap` sửa cùng nhau.
  const rows = (await read({ accountId })) as SuggestionRow[];

  if (rows.length === 0) {
    return (
      <section className="card">
        <h2 className="card-title">Gợi ý chờ quyết · 0</h2>
        {/* `EXPERIENCE.md` — trạng thái rỗng nói VIỆC TIẾP THEO, không nói
            *"không có dữ liệu"*. Ở đây việc tiếp theo là bật Đang theo dõi, vì
            đó là điều kiện để Công ty lọt vào vòng quét (`FR-47`, `T-8`). */}
        <p className="empty">
          Chưa có gợi ý nào chờ quyết. Gợi ý sinh ra khi vòng quét đọc được tin
          mới về công ty này — bật <strong>Đang theo dõi</strong> ở khối hồ sơ để
          công ty vào vòng quét kế tiếp.
        </p>
        <Link href="/suggestions">Mở hàng đợi của mọi công ty →</Link>
      </section>
    );
  }

  return (
    <section
      className="card"
      // `EXPERIENCE.md` — mọi thứ do máy đề nghị mang ray trái và nền riêng,
      // cùng dấu hiệu đã dùng cho mục Dòng thời gian `he_thong`. Nhãn chữ nằm
      // trên từng thẻ; màu không bao giờ là dấu hiệu duy nhất.
      style={{
        borderLeft: "3px solid var(--machine-border)",
        background: "var(--machine-bg)",
      }}
    >
      <h2 className="card-title">Gợi ý chờ quyết · {rows.length}</h2>
      <p className="muted">
        Ba lối ra cho mỗi gợi ý: <strong>Duyệt</strong> ghi đúng giá trị máy đề
        nghị, <strong>Sửa rồi duyệt</strong> ghi giá trị bạn gõ,{" "}
        <strong>Bỏ</strong> giữ nguyên hồ sơ. Cả ba đều ghi lại ai quyết và lúc
        nào. Cũ nhất đứng trước — gợi ý cũ nhất từ {formatDateTime(rows[0]!.createdAt)}.
      </p>

      <SuggestionQueue accountId={accountId} rows={rows} />

      {/* `EXPERIENCE.md` (bảng IA) — `S2` vào được *"từ dấu hiệu ở `S1`, `S3`,
          `S6`"*. Đây là lối `S3` → `S2`. Chỉ THÊM một liên kết: trang này là
          chỗ sáu điểm nghiệm thu cùng đứng, nên không đổi một chữ nào đang có,
          không thêm `<mark>`, không thêm chỗ hiện giá trị đề nghị lần nữa. */}
      <Link href="/suggestions">Mở hàng đợi của mọi công ty →</Link>
    </section>
  );
}
