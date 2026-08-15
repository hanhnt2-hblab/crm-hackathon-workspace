// `S3` khối **Việc tiếp theo** · `T-6` `T-7` · `FR-30` `FR-32` `FR-34` · `D14`.
//
// §6 `T-7` nguyên văn: *"Bấm Hoàn tác ở T-6, **một cú bấm**, giá trị cũ trở lại
// đúng nguyên trạng"*. Trước tệp này, `undoSystemNextAction` đã chạy đúng ở
// tầng ④ nhưng **không màn hình nào gọi** — vế còn thiếu là đúng bên gọi này.
//
// SERVER COMPONENT, và đây là nơi duy nhất của khối gọi `loadCapability()`.
// `AD-1` — không `db`, không `@prisma/client`.
//
// ⚠ LỆCH VỚI `AD-UI-5`, KHAI RA CHỨ KHÔNG VIỆN. Nguyên văn `AD-UI-5` là
// *"`page.tsx` và `layout.tsx` … là nơi **duy nhất** gọi `loadCapability`"*, mà
// tệp này không phải hai tệp đó. Lý do lệch: `page.tsx` đã dựng sẵn
// `<Block title="Việc tiếp theo"><Suspense><NextActionBlock accountId={id}/>`
// và **không** truyền dữ liệu xuống — ba khối mới của `S3` được dựng song song
// và mỗi khối tự đọc để hỏng độc lập (`AD-UI-8`). Chính `page.tsx` cũng đã đọc
// theo cách này ở `ProfileBlock`/`TimelineBlock`, chỉ khác là chúng nằm cùng
// tệp. Vế mà `AD-UI-5` thật sự canh — *không đọc gì ngoài `loadCapability`* —
// còn nguyên ở đây.
//
// `AD-UI-5` vế props: mọi giá trị đi xuống lá `'use client'` đã tuần tự hoá.
//
// ⚠ MỘT CÚ BẤM LÀ TIÊU CHÍ NGHIỆM THU, không phải mong muốn. Nút nằm trong một
// `<form>` submit thẳng: không hộp xác nhận, không hai bước, không menu thả
// xuống. Ai thêm một `confirm()` hay một `Dialog` vào đây là làm `T-7` đỏ, và
// nó đỏ ở một chỗ không ai nghĩ là mình vừa chạm.
//
// ⚠ NÚT CHỈ HIỆN KHI HOÀN TÁC ĐƯỢC. `undoSystemNextAction` có ĐÚNG BA đường
// tới *không làm gì*, và cả ba đều là NO-OP im lặng chứ không phải lỗi. Một nút
// bấm vào không phản ứng là hình dạng lỗi tệ nhất giữa buổi chấm: người bấm
// không phân biệt được *nút hỏng* với *đã hết hạn*. Nên bề mặt hỏi lõi trước
// (`canUndo` ở `src/core/nextaction/read.ts`) rồi mới vẽ, và ở mỗi nhánh không
// vẽ nút thì nó **nói ra lý do**:
//   ① hết cửa sổ 7 ngày (`D14`)  → câu *Cửa sổ hoàn tác đã hết*
//   ② người đã sửa tay           → nhãn *Do bạn đặt* + câu giải thích
//   ③ đã hoàn tác / chưa từng có → trạng thái rỗng `BR-B1`

import { appRegistry } from "../../_registry";
import { currentSession } from "../../_session";
import { formatDateTime, stageLabel } from "../../_vocab";
import { SubmitButton } from "../../_action-state";
import { undoNextActionFormAction } from "./_next-action-actions";

/// Hình dạng mà capability `readAccountNextActions` trả về.
///
/// Khai TẠI ĐÂY chứ không ở `src/app/_types.ts`: ba khối mới của trang này đang
/// được dựng song song và `_types.ts` là tệp dùng chung — sửa nó là ba người
/// cùng chạm một tệp. Khi ba khối gộp lại, chuyển hai kiểu này sang đó.
///
/// ⚠ Mọi trường đã TUẦN TỰ HOÁ: `Date` → chuỗi. `loadCapability` trả `unknown`
/// (`AD-CP-1`), nên `tsc` **không** bắt được lệch giữa hai bên — hai tệp này và
/// `caps/nextaction-ui.ts` sửa cùng nhau.
type ActiveNextActionView = {
  content: string | null;
  /// `YYYY-MM-DD`. Cột là `@db.Date`; xem chú thích ở `caps/nextaction-ui.ts`
  /// về lý do không gửi ISO có giờ.
  dueDate: string | null;
  /// `nguoi` | `he_thong`
  setBy: string;
  /// ISO đầy đủ, hoặc `null` khi ô không mở cửa sổ Hoàn tác nào.
  undoDeadlineAt: string | null;
  sourceClaim: string | null;
  sourceQuote: string | null;
  canUndo: boolean;
  /// `D14` — cửa sổ còn lại, đã tính SẴN ở lõi. Bề mặt không gọi `Date.now()`:
  /// React 19 cấm hàm không thuần lúc render (`react-hooks/purity`), và tính ở
  /// lõi còn giữ được `canUndo` cùng con số này đọc chung một lần đồng hồ.
  undoRemainingMs: number;
};

type OpportunityNextActionView = {
  opportunityId: string;
  opportunityName: string;
  stage: string;
  running: boolean;
  nextAction: ActiveNextActionView | null;
};

export async function NextActionBlock({ accountId }: { accountId: string }) {
  const session = await currentSession();
  const read = await appRegistry.loadCapability(
    "readAccountNextActions",
    session.actor,
  );
  const rows = (await read({ accountId })) as OpportunityNextActionView[];

  // Cơ hội ĐÃ ĐÓNG mà không có Việc tiếp theo thì không có gì để nói, và một
  // danh sách dài những dòng *không có gì* làm chìm đúng dòng cần bấm. Cơ hội
  // đã đóng mà VẪN còn Việc tiếp theo thì hiện — đó là một chỗ lệch đáng nhìn.
  const shown = rows.filter((r) => r.running || r.nextAction !== null);

  if (shown.length === 0) {
    return (
      <section className="card">
        <p className="empty">
          Công ty này chưa có cơ hội nào đang chạy, nên chưa có Việc tiếp theo
          nào. Tạo cơ hội ở khối Hồ sơ công ty bên trên.
        </p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2 className="card-title">Việc tiếp theo · {shown.length} cơ hội</h2>
      {shown.map((row) => (
        <NextActionRow key={row.opportunityId} row={row} accountId={accountId} />
      ))}
    </section>
  );
}

function NextActionRow({
  row,
  accountId,
}: {
  row: OpportunityNextActionView;
  accountId: string;
}) {
  const na = row.nextAction;
  const byMachine = na !== null && na.setBy === "he_thong";

  return (
    <div
      // `EXPERIENCE.md` — phân biệt máy/người **không bao giờ chỉ bằng màu**:
      // dòng máy mang cả ray trái, nền riêng, LẪN nhãn chữ ngay dưới.
      style={
        byMachine
          ? {
              borderLeft: "3px solid var(--machine-border)",
              background: "var(--machine-bg)",
              padding: "12px",
              marginTop: "12px",
            }
          : { borderLeft: "3px solid transparent", padding: "12px", marginTop: "12px" }
      }
    >
      <div className="row">
        <strong>{row.opportunityName}</strong>
        <span className="tag">{stageLabel(row.stage)}</span>
      </div>

      {na === null ? (
        // ③ Không còn hàng nào sống. Đây cũng là *nguyên trạng* sau một lượt
        // Hoàn tác thành công trên ô vốn trống (`AD-3` nhánh ⓐ, `D16`): ô về
        // TRỐNG, không phải một dòng còn đó với nội dung rỗng.
        <p className="empty">
          Chưa có Việc tiếp theo cho cơ hội này (<code>BR-B1</code>). Đặt một
          việc để cơ hội không rơi khỏi tầm mắt.
        </p>
      ) : (
        <>
          <p>
            {/* ⚠ Kiểm cả chuỗi RỖNG, không chỉ `null`. `BR-B1` cho phép thiếu
                nội dung, và không gì trong lược đồ chuẩn hoá `""` thành `NULL`
                — `??` một mình sẽ render một đoạn văn trống, tức một dòng
                trông như đã điền mà không có chữ nào. */}
            {na.content !== null && na.content.trim() !== "" ? (
              na.content
            ) : (
              <span className="muted">— chưa điền nội dung —</span>
            )}
          </p>

          <div className="row">
            <span className="muted">
              Hạn: <strong>{formatDueDate(na.dueDate)}</strong>
            </span>
            {/* AI ĐẶT — `FR-30`: hai nguồn, phân biệt được không cần đọc kỹ. */}
            <span className={byMachine ? "tag tag-machine" : "tag"}>
              {byMachine ? "Hệ thống tự đặt" : "Do người đặt"}
            </span>
          </div>

          {/* `FR-30` · `EXPERIENCE.md` — dòng máy đi kèm CÂU TRÍCH, để người
              quyết có bấm hay không mà không phải mở sang khối Phát hiện. */}
          {/* ⚠ Hai trường ĐỘC LẬP nhau ở lõi. Treo câu trích vào điều kiện của
              `claim` là đánh rơi bằng chứng khi một Phát hiện có `quote` mà
              thiếu `claim` — đúng thứ `FR-30` đòi hiện. */}
          {byMachine && (na.sourceClaim !== null || na.sourceQuote !== null) ? (
            <p className="muted">
              Căn cứ: {na.sourceClaim ?? "—"}
              {na.sourceQuote !== null ? ` — “${na.sourceQuote}”` : ""}
            </p>
          ) : null}

          <UndoSlot row={row} nextAction={na} accountId={accountId} />
        </>
      )}
    </div>
  );
}

/// Chỗ đặt nút, và ba nhánh KHÔNG vẽ nút — mỗi nhánh nói ra lý do của nó.
function UndoSlot({
  row,
  nextAction,
  accountId,
}: {
  row: OpportunityNextActionView;
  nextAction: ActiveNextActionView;
  accountId: string;
}) {
  // ② Người đã gõ ô này. Hoàn tác ở đây sẽ xoá thứ họ vừa gõ, nên lõi từ chối
  // và bề mặt không mời. `EXPERIENCE.md`: *"Cô sửa tay ô máy vừa đặt → nút Hoàn
  // tác biến mất ngay"*.
  if (nextAction.setBy !== "he_thong") {
    return (
      <p className="field-note">
        Ô này do người đặt, nên không có gì để hoàn tác — và hệ thống cũng không
        ghi đè lên nó.
      </p>
    );
  }

  // ①ᵇ Ô do máy đặt nhưng CHƯA TỪNG mở cửa sổ Hoàn tác. Trường hợp này có
  // thật và có chủ đích: nhánh ⓒ của `fillNextActionIfUnchanged` (máy ghi đè
  // một ô người đặt đã quá hạn) ghi `undo_deadline_at = null`, vì hoàn tác ở
  // đó sẽ XOÁ thứ người đã gõ — `D12` cấm. Nói *đã hết* ở đây là bảo người
  // dùng họ lỡ mất một cửa sổ chưa bao giờ tồn tại.
  if (nextAction.undoDeadlineAt === null) {
    return (
      <p className="field-note">
        Lần đặt này không mở cửa sổ hoàn tác, vì nó ghi đè một việc đã quá hạn
        do người đặt. Sửa tay ô này nếu nội dung chưa đúng.
      </p>
    );
  }

  // ① Quá `undo_deadline_at`. Cửa sổ là 7 ngày (`D14`) và mốc đã cộng sẵn lúc
  // máy ghi, nên chỗ này KHÔNG tính lại 7 ngày từ đâu cả.
  if (!nextAction.canUndo) {
    return (
      <p className="field-note">
        Cửa sổ hoàn tác đã hết (đóng lúc{" "}
        {formatDateTime(nextAction.undoDeadlineAt)}). Sửa tay ô này nếu nội dung
        chưa đúng.
      </p>
    );
  }

  return (
    // MỘT CÚ BẤM. `<form>` gửi thẳng tới server action; hai ô ẩn là toàn bộ
    // tham số, và không có bước nào chen giữa cú bấm với lời gọi capability.
    <form action={undoNextActionFormAction} className="form">
      <input type="hidden" name="opportunityId" value={row.opportunityId} />
      {/* Chỉ để `revalidatePath` trỏ đúng địa chỉ — không tham số nào của
          capability lấy từ đây. */}
      <input type="hidden" name="accountId" value={accountId} />
      <div className="form-actions">
        {/* ⚠ NHÃN LÀ ĐÚNG HAI CHỮ `Hoàn tác`. `e2e/T7.spec.ts:236` tra nút theo
            TÊN KHẢ TRUY CẬP; thêm một biểu tượng hay một chữ nữa vào đây là làm
            phép kiểm đỏ với triệu chứng *không tìm thấy nút*. */}
        <SubmitButton appearance="secondary">Hoàn tác</SubmitButton>
        <span className="field-note">
          Một cú bấm. Việc tiếp theo trở về đúng trạng thái trước khi hệ thống
          đặt.{" "}
          {describeRemaining(nextAction.undoRemainingMs, nextAction.undoDeadlineAt)}
        </span>
      </div>
    </form>
  );
}

/// `D14` — *cửa sổ hiện rõ trên màn hình*. Hiện CẢ khoảng còn lại lẫn mốc đóng:
/// khoảng còn lại trả lời *"có gấp không"*, mốc đóng trả lời *"đến bao giờ"*, và
/// người đọc cần cả hai để quyết có bấm ngay hay để mai.
function describeRemaining(remainingMs: number, deadlineIso: string | null): string {
  if (deadlineIso === null || remainingMs <= 0) return "";

  const hours = Math.floor(remainingMs / 3_600_000);
  const days = Math.floor(hours / 24);
  const gioLe = hours % 24;
  // *"còn 6 ngày 0 giờ"* đọc như một lỗi hiển thị, nên bỏ vế giờ khi nó bằng 0.
  const khoang =
    days > 0
      ? gioLe > 0
        ? `còn ${days} ngày ${gioLe} giờ`
        : `còn ${days} ngày`
      : hours > 0
        ? `còn ${hours} giờ`
        : "còn dưới 1 giờ";
  return `Cửa sổ hoàn tác ${khoang}, đóng lúc ${formatDateTime(deadlineIso)}.`;
}

/// `YYYY-MM-DD` → `DD/MM/YYYY`, bằng phép CẮT CHUỖI chứ không qua `new Date()`.
///
/// Cột là `@db.Date` nên chuỗi đã là ngày đúng rồi; dựng một `Date` từ nó là
/// đọc nửa đêm UTC theo giờ máy, và mọi múi giờ âm lùi mất **một ngày** trên
/// đúng con số mà `BR-D7` gọi là hạn.
function formatDueDate(iso: string | null): string {
  if (iso === null) return "chưa đặt hạn";
  // ⚠ CẮT MƯỜI KÝ TỰ ĐẦU trước khi tách. Hai bên nối nhau qua `unknown`
  // (`AD-CP-1`), nên `tsc` không bắt được ngày mai ai đó đổi capability sang
  // ISO đầy đủ; không có lát cắt này thì `"2026-08-14T00:00:00Z"` cho ra
  // `14T00:00:00Z/08/2026` — một chuỗi trông như ngày, sai âm thầm.
  const [y, m, d] = iso.slice(0, 10).split("-");
  return y?.length === 4 && m && d ? `${d}/${m}/${y}` : iso;
}
