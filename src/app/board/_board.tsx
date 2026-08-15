"use client";

// `S4` Pipeline board · `FR-3` `FR-4` · `T-1` — KÉO THẢ THẬT.
//
// `T-1` đòi nguyên văn *"kéo cơ hội qua ba giai đoạn"*, và `EXPERIENCE.md`
// (*Cột Stage*) đòi *"lùi và nhảy cóc đều được"* — nên thẻ đổi cột bằng chính
// cú kéo, **không mở biểu mẫu**. Hộp hỏi hai dấu hiệu chỉ hiện khi đích là
// `du_dieu_kien`, và nó **bỏ qua được** (`T-1`).
//
// `AD-UI-5` — loại bề mặt *kéo thả*: client component giữ trạng thái kéo,
// server action chốt. Lá này KHÔNG gọi `loadCapability`.
//
// ⚠ Dùng HTML5 Drag and Drop, không thêm thư viện. Một phụ thuộc kéo thả là
// thêm một thứ phải chạy được trên clone sạch lúc 9:30 sáng (`§7`), đổi lấy
// một hiệu ứng mượt hơn mà không tiêu chí nào chấm.
//
// ⚠ Bàn phím KHÔNG bị bỏ lại: *Sàn khả năng tiếp cận* của `EXPERIENCE.md` bắt
// mọi hành động bắt buộc tới được bằng bàn phím, và đổi Giai đoạn là một trong
// ba hành động nó nêu đích danh. Mỗi thẻ có một ô chọn giai đoạn — cùng đường
// server action với cú kéo, chỉ khác cách khởi phát.

import { useCallback, useOptimistic, useState, useTransition } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
} from "@fluentui/react-components";
import Link from "next/link";
import { IDLE, type ActionState } from "../_contract";
import type { BoardCard } from "../_types";
import { FLAG_LABEL, STAGE_LABEL, STAGE_ORDER, formatAmount, stageLabel } from "../_vocab";
import {
  changeStageAction,
  reopenClosedAction,
  resumeFromPauseAction,
  saveQualificationSignalsAction,
} from "./actions";

const CLOSED = new Set(["thang", "thua"]);

export function Board({ cards }: { cards: BoardCard[] }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<ActionState>(IDLE);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<string | null>(null);
  /// Hộp hỏi hai dấu hiệu — mở khi và chỉ khi đích là `du_dieu_kien` và Cơ hội
  /// chưa trả lời đủ hai ô.
  const [asking, setAsking] = useState<BoardCard | null>(null);

  // `UX-4` — phản hồi thị giác ≤ 200 ms. Lượt ghi đi tới server rồi mới về;
  // `useOptimistic` cho thẻ sang cột mới NGAY, và tự cuộn lại nếu server bác.
  // Không có nó thì mỗi cú kéo đứng im nửa giây rồi mới nhảy — đúng cảm giác
  // *"hình như hỏng"* mà `UX-4` đặt ngưỡng để tránh.
  const [shown, moveOptimistic] = useOptimistic(
    cards,
    (state: BoardCard[], move: { id: string; to: string }) =>
      state.map((c) => (c.id === move.id ? { ...c, stage: move.to } : c)),
  );

  const run = useCallback(
    (card: BoardCard, to: string, form: FormData, act: typeof changeStageAction) => {
      startTransition(async () => {
        moveOptimistic({ id: card.id, to });
        const result = await act(IDLE, form);
        setMessage(result);
      });
    },
    [moveOptimistic],
  );

  /// Chọn ĐƯỜNG ĐI theo giai đoạn hiện tại — ba capability khác nhau, và bề mặt
  /// là bên duy nhất biết thẻ đang ở đâu (`AD-GT-1`: Cổng không đọc dữ liệu).
  const move = useCallback(
    (card: BoardCard, to: string) => {
      if (card.stage === to) return;

      const form = new FormData();
      form.set("id", card.id);

      // `§5.2` — ra khỏi `tam_dung` là đường QUAY LẠI: đích cố định là Giai
      // đoạn mở gần nhất, cột người dùng thả vào không được tính.
      if (card.stage === "tam_dung" && !CLOSED.has(to)) {
        run(card, card.latestOpenStage ?? to, form, resumeFromPauseAction);
        return;
      }
      // `D43` — mở lại Cơ hội đã đóng, chỉ Quản trị. Bề mặt vẫn cho kéo: từ
      // chối là **kết quả của Cổng**, không phải một cái khoá ở giao diện
      // (`AD-UI-10`, `D28`).
      if (CLOSED.has(card.stage)) {
        run(card, card.latestOpenStage ?? to, form, reopenClosedAction);
        return;
      }

      form.set("to", to);
      run(card, to, form, changeStageAction);
    },
    [run],
  );

  const drop = useCallback(
    (to: string) => {
      setOverStage(null);
      const card = shown.find((c) => c.id === draggingId);
      setDraggingId(null);
      if (!card || card.stage === to) return;

      // `BR-B2` — hỏi hai dấu hiệu khi sang Đủ điều kiện, và CHỈ khi chưa trả
      // lời đủ. `null` là chưa hỏi, `false` là đã trả lời *không* — cả hai đều
      // chưa đủ, nên chốt là `!== true`.
      if (to === "du_dieu_kien" && (card.needSignal !== true || card.budgetSignal !== true)) {
        setAsking(card);
        return;
      }
      move(card, to);
    },
    [draggingId, move, shown],
  );

  return (
    <>
      <div className="row">
        {pending ? <span className="muted">Đang lưu…</span> : null}
        {message.ok ? (
          message.message ? (
            <span className="ok-note" role="status">
              {message.message}
            </span>
          ) : null
        ) : (
          <span className="failed" role="alert">
            {message.message}
          </span>
        )}
      </div>

      <div className="board">
        {STAGE_ORDER.map((stage) => {
          const inStage = shown.filter((c) => c.stage === stage);
          return (
            <div
              key={stage}
              className={`board-col${overStage === stage ? " over" : ""}`}
              onDragOver={(e) => {
                // Không `preventDefault` thì trình duyệt KHÔNG coi đây là đích
                // thả và sự kiện `drop` không bao giờ chạy. Đây là cái bẫy số
                // một của HTML5 DnD, và nó hỏng im lặng.
                e.preventDefault();
                setOverStage(stage);
              }}
              onDragLeave={() => setOverStage((s) => (s === stage ? null : s))}
              onDrop={(e) => {
                e.preventDefault();
                drop(stage);
              }}
            >
              <div className="board-col-head">
                {/* Cột rỗng vẫn hiện TÊN cột (`EXPERIENCE.md`, `S4` hàng
                    *Rỗng*), nên tên nằm ngoài nhánh rỗng. */}
                <span>{STAGE_LABEL[stage]}</span>
                <span className="board-col-count">{inStage.length}</span>
              </div>

              {inStage.length === 0 ? (
                <p className="board-empty">Chưa có cơ hội nào ở giai đoạn này.</p>
              ) : (
                inStage.map((card) => (
                  <div
                    key={card.id}
                    className={`board-card${draggingId === card.id ? " dragging" : ""}`}
                    draggable
                    onDragStart={() => setDraggingId(card.id)}
                    onDragEnd={() => setDraggingId(null)}
                  >
                    <span className="board-card-name">{card.name}</span>
                    <Link href={`/accounts/${card.accountId}`}>{card.accountName}</Link>
                    <span className="muted">
                      {formatAmount(card.amount, card.currency)}
                    </span>
                    {card.flags.map((f) => (
                      <span key={f} className="tag tag-warn">
                        ⚠ {FLAG_LABEL[f] ?? f}
                      </span>
                    ))}
                    {/* Lối bàn phím cho cùng một việc — *Sàn khả năng tiếp
                        cận*. Không phải một biểu mẫu: một lần chọn là một lần
                        chuyển, không có nút Lưu. */}
                    <select
                      aria-label={`Chuyển giai đoạn của ${card.name}`}
                      value={card.stage}
                      onChange={(e) => {
                        const to = e.target.value;
                        if (
                          to === "du_dieu_kien" &&
                          (card.needSignal !== true || card.budgetSignal !== true)
                        ) {
                          setAsking(card);
                          return;
                        }
                        move(card, to);
                      }}
                    >
                      {STAGE_ORDER.map((s) => (
                        <option key={s} value={s}>
                          {STAGE_LABEL[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>

      {asking ? (
        <QualificationDialog
          card={asking}
          onClose={() => setAsking(null)}
          onMove={(card, signals) => {
            setAsking(null);
            // THỨ TỰ LÀ QUYẾT ĐỊNH: chuyển giai đoạn TRƯỚC, ghi hai dấu hiệu
            // SAU. `T-1` đòi *bỏ qua hai ô dấu hiệu vẫn kéo được*, nên lượt ghi
            // dấu hiệu không bao giờ được đứng chắn đường chuyển — kể cả khi nó
            // hỏng.
            move(card, "du_dieu_kien");
            if (signals === null) return;
            startTransition(async () => {
              const form = new FormData();
              form.set("id", card.id);
              if (signals.need) form.set("needSignal", "on");
              if (signals.budget) form.set("budgetSignal", "on");
              const result = await saveQualificationSignalsAction(IDLE, form);
              // Thẻ đã sang cột mới rồi. Lượt ghi dấu hiệu hỏng thì nói riêng
              // về nó, không đụng tới kết quả của lượt chuyển.
              if (!result.ok) setMessage(result);
            });
          }}
        />
      ) : null}
    </>
  );
}

/// Hộp hỏi hai dấu hiệu — `BR-B2` · `T-1`.
///
/// ⚠ Nút **Bỏ qua** là nút thật, không phải chữ nhỏ ở góc: `EXPERIENCE.md`
/// (*Cờ cảnh báo*) chốt cờ **không chặn thao tác**, và `T-1` kiểm đúng đường
/// bỏ qua. Nếu bỏ qua khó hơn điền thì luật đã bị lật ngược ở tầng giao diện.
function QualificationDialog({
  card,
  onClose,
  onMove,
}: {
  card: BoardCard | null;
  onClose: () => void;
  onMove: (card: BoardCard, signals: { need: boolean; budget: boolean } | null) => void;
}) {
  return (
    /// ⚠ `modalType="non-modal"` — và đây là chỗ vá lỗi trợ năng, không phải
    /// một lựa chọn thẩm mỹ.
    ///
    /// Hộp thoại **modal** của Fluent đặt `aria-hidden="true"` lên các nút nền
    /// khi mở, và dọn khi đóng. Nhưng `onMove` gọi `setAsking(null)` nên cả cây
    /// hộp thoại bị THÁO ngay trong cùng lượt render — đường dọn không kịp chạy,
    /// và cờ đọng lại. Đo được sau khi bấm *Bỏ qua và chuyển*:
    ///     `[role=dialog]` → 0 (đã gỡ) · `[aria-hidden=true]` → **2** (cờ còn)
    ///     `getByText(thông báo)` → 1 · `getByRole("status")` → **0**
    /// Người dùng trình đọc màn hình không được báo giai đoạn đã đổi, và cả
    /// trang câm với trợ năng — kể cả dải băng *Phần gợi ý đang tắt* (§4/nhóm 6),
    /// với đúng nhóm người cần nó nhất.
    ///
    /// Non-modal thì **không đặt cờ ấy lên nền ngay từ đầu**, nên không có gì để
    /// rò. Đổi lại: không có lớp phủ và không bẫy tiêu điểm — chấp nhận được, vì
    /// `T-1` chốt *"bỏ qua hai ô dấu hiệu vẫn kéo được"*, tức đây KHÔNG phải một
    /// hộp thoại bắt buộc trả lời.
    ///
    /// ⚠ Đã thử giữ `Dialog` luôn gắn và chỉ đổi `open`: vỏ đóng vẫn chắn bàn cờ
    /// và **kéo thả hỏng** — `T-1` đỏ sớm hơn một bước, ở đúng thao tác nó chấm.
    <Dialog
      modalType="non-modal"
      open={card !== null}
      onOpenChange={(_, data) => (data.open ? null : onClose())}
    >
      <DialogSurface>
        {/* THÂN tháo theo thẻ, VỎ thì không. `key` ép `useState` bên trong làm
            mới khi người kéo một thẻ khác — nếu không, hai ô tick giữ nguyên
            trạng thái của thẻ trước và người ghi nhầm dấu hiệu sang Cơ hội khác. */}
        {card === null ? null : (
          <QualificationBody
            key={card.id}
            card={card}
            onMove={onMove}
          />
        )}
      </DialogSurface>
    </Dialog>
  );
}

function QualificationBody({
  card,
  onMove,
}: {
  card: BoardCard;
  onMove: (card: BoardCard, signals: { need: boolean; budget: boolean } | null) => void;
}) {
  const [need, setNeed] = useState(card.needSignal === true);
  const [budget, setBudget] = useState(card.budgetSignal === true);

  return (
        <DialogBody>
          <DialogTitle>Sang {stageLabel("du_dieu_kien")}: hai dấu hiệu</DialogTitle>
          <DialogContent>
            <p style={{ marginBottom: 12 }}>
              <strong>{card.name}</strong> · {card.accountName}
            </p>
            <Checkbox
              checked={need}
              onChange={(_, d) => setNeed(d.checked === true)}
              label="Khách đã nói rõ nhu cầu"
            />
            <Checkbox
              checked={budget}
              onChange={(_, d) => setBudget(d.checked === true)}
              label="Khách đã xác nhận có ngân sách"
            />
            <p className="field-note" style={{ marginTop: 12 }}>
              Bỏ trống vẫn chuyển được. Cơ hội sẽ mang cờ cảnh báo{" "}
              <em>{FLAG_LABEL["BR-B2"]}</em> cho tới khi hai ô này được trả lời.
            </p>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={() => onMove(card, null)}>
              Bỏ qua và chuyển
            </Button>
            <Button appearance="primary" onClick={() => onMove(card, { need, budget })}>
              Ghi dấu hiệu rồi chuyển
            </Button>
          </DialogActions>
        </DialogBody>
  );
}
