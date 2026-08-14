// `S4` Pipeline board · `FR-3` `FR-4` `FR-5` `FR-8` · `T-1`.
//
// `AD-UI-5` — server component đọc, lá client giữ trạng thái kéo. Đây là loại
// bề mặt *kéo thả* trong bảng của `AD-UI-5`, và là bề mặt duy nhất thuộc loại
// đó.
//
// `S4` từng nằm trong mục `Deferred` của spine cha; tầng ① nhận dựng nó và cha
// đã theo (mục ⑤ của *Xung đột với spine anh em*) — nên bề mặt này có mã
// thượng nguồn, không phải một thứ thêm vào cho đẹp.

import { Suspense } from "react";
import { Block } from "../_block";
import { appRegistry } from "../_registry";
import { currentSession } from "../_session";
import type { BoardCard } from "../_types";
import { Board } from "./_board";

export default function BoardPage() {
  return (
    <>
      <div className="row">
        <h1 className="page-title">Bảng giai đoạn</h1>
        <span className="muted">
          Kéo thẻ sang cột khác để đổi giai đoạn — lùi và nhảy cóc đều được.
        </span>
      </div>

      <Block title="Bảng giai đoạn">
        <Suspense fallback={<BoardSkeleton />}>
          <BoardBlock />
        </Suspense>
      </Block>
    </>
  );
}

async function BoardBlock() {
  const session = await currentSession();
  const read = await appRegistry.loadCapability("readPipelineBoard", session.actor);
  const cards = (await read({ accountId: null })) as BoardCard[];

  // Trạng thái RỖNG chỉ tới được SAU một lượt đọc thành công trả 0 dòng
  // (`AD-UI-8`). Bảng vẫn dựng đủ bảy cột kể cả khi rỗng — `EXPERIENCE.md`
  // (`S4`, hàng *Rỗng*): cột rỗng hiện tên cột, không hiện khoảng trắng.
  return (
    <section className="card">
      {cards.length === 0 ? (
        <p className="empty">
          Chưa có cơ hội nào. Mở một công ty rồi tạo cơ hội đầu tiên — nó sẽ hiện
          ở cột Tiếp cận.
        </p>
      ) : null}
      <Board cards={cards} />
    </section>
  );
}

function BoardSkeleton() {
  return (
    <section className="card" aria-busy="true">
      <p className="muted">Đang đọc bảng giai đoạn…</p>
      <div className="board">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="board-col">
            <div className="skeleton-row" />
            <div className="skeleton-row" />
          </div>
        ))}
      </div>
    </section>
  );
}
