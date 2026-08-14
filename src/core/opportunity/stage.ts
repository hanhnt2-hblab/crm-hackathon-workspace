// `AD-CR-1` — máy trạng thái Cơ hội, cưỡng chế HAI LỚP.
//
// Lớp một: bảng chuyển tiếp là HÀM THUẦN ở đây — quyết định `from → to`, ném
// lỗi có mã. Kiểm được bằng bảng đầu-vào/đầu-ra, không cần cơ sở dữ liệu.
// Lớp hai: CSDL canh HÌNH DẠNG bằng `CHECK` (`AD-CR-11`), không bằng trigger.
//
// ⚠ ĐỌC §5.1 CỦA PRD TRƯỚC KHI SIẾT BẤT CỨ THỨ GÌ Ở ĐÂY.
// Một bản trước của tệp này cấm **lùi giai đoạn** và **nhảy cóc**, còn nêu đích
// danh hai thứ đó như hai nhóm bị cấm. §5.1 dòng hai nói ngược lại, nguyên văn:
//
//     | Bốn giai đoạn đang chạy | Bất kỳ giai đoạn đang chạy nào khác
//     | **Không có.** Lùi và nhảy cóc đều được (đề bài `§4/nhóm 1`) |
//
// `FR-4` nhắc lại: *"Đi lùi và nhảy cóc đều được."* Siết chỗ này làm Sales kéo
// thẻ lùi một bước ăn lỗi ngay trên bàn chấm, và `T-1` đỏ.
//
// ⚠ VÀ ĐỌC `AD-CR-10` TRƯỚC KHI THÊM MỘT CHỐT QUYỀN VÀO ĐÂY.
// Một bản trước cũng đã thêm `role` vào `resumeOrReopen` để tự canh `D43`.
// `AD-CR-10` đã **cân nhắc và loại** đúng phương án đó: *"lõi kiểm lại vai cho
// đường mở lại Cơ hội (`D43`) — hai điểm kiểm quyền là hai chỗ trôi khỏi nhau,
// và PRD §6 đã kết luận cần đúng MỘT điểm kiểm."* Điểm đó là **Cổng bước ⑤**.
// Ngoại lệ duy nhất lõi được tự chặn là `actor.kind === "system"`, vì đó là
// ranh giới `NFR-14`, không phải vai.

import { BusinessRuleError } from "../errors";
import { isHuman, type Actor } from "../actor";

export type Stage =
  | "tiep_can" | "du_dieu_kien" | "soan_de_xuat" | "thuong_luong"
  | "thang" | "thua" | "tam_dung";

/// Bốn giai đoạn ĐANG CHẠY. `tam_dung` KHÔNG thuộc nhóm này (`D11`) —
/// đó là lý do `BR-B4` miễn trừ nó khỏi luật *"Cơ hội mở phải có Việc tiếp theo"*.
export const RUNNING_STAGES = [
  "tiep_can", "du_dieu_kien", "soan_de_xuat", "thuong_luong",
] as const satisfies readonly Stage[];

export const CLOSED_STAGES = ["thang", "thua"] as const satisfies readonly Stage[];

/// Kiểu HẸP cho bốn giai đoạn đang chạy. Tồn tại để trình biên dịch gánh đúng
/// bất biến mà `CHECK opp_latest_open_stage_running` canh ở CSDL — nếu không,
/// kiểu ở đây (`Stage | null`) LỎNG HƠN cột, và chỗ lỏng đó lọt xuống thành một
/// lỗi ràng buộc Postgres không đọc được.
export type RunningStage = (typeof RUNNING_STAGES)[number];

/// `D44` — Cơ hội mới LUÔN vào `tiep_can`; người tạo không chọn được giai đoạn
/// khác (§5.1 dòng đầu, `FR-3`). Hằng số chứ không phải chữ rời rạc, để đường
/// tạo Cơ hội không có chỗ đoán.
///
/// `createOpportunity` dùng nó và KHÔNG nhận tham số giai đoạn, nên `D44` được
/// cưỡng chế bằng chữ ký chứ không bằng lời dặn. Lược đồ không có `@default`:
/// một `@default` sẽ cho phép `INSERT` bỏ qua cột và vẫn hợp lệ, tức mở lại
/// đúng cửa mà chữ ký vừa đóng.
export const INITIAL_STAGE: RunningStage = "tiep_can";

/// Vị từ THU HẸP KIỂU (`s is RunningStage`), không phải trả `boolean` suông.
/// Trả `boolean` thì `nextLatestOpenStage` không chứng minh được kết quả của nó
/// hợp lệ với cột, và ta quay lại chỗ chỉ có chú thích giữ bất biến.
export function isRunning(s: Stage): s is RunningStage {
  return (RUNNING_STAGES as readonly Stage[]).includes(s);
}
export function isClosed(s: Stage): boolean {
  return (CLOSED_STAGES as readonly Stage[]).includes(s);
}

/// §5.1 ở dạng cưỡng chế được. Viết bằng VỊ TỪ chứ không bằng bảng liệt kê:
/// luật gốc phát biểu theo NHÓM (*"bất kỳ giai đoạn đang chạy nào khác"*), nên
/// một bảng cặp phải đếm đủ 12 + 4 + 10 dòng và sai một dòng là lệch âm thầm.
///
/// BA nhóm được phép, đúng ba dòng §5.1:
///   ① đang chạy → đang chạy khác — **lùi và nhảy cóc ĐỀU ĐƯỢC**, không canh gì
///   ② đang chạy → `tam_dung`
///   ③ đang chạy **hoặc** `tam_dung` → `thang` / `thua`  (`A1` đã xác nhận 14/8)
///
/// BỐN nhóm bị cấm, nêu tên để phép kiểm khẳng định được:
///   ① `tam_dung` → một giai đoạn đang chạy **tuỳ chọn** — phải qua
///      `resumeOrReopen`, và chỉ về ĐÚNG Giai đoạn mở gần nhất (§5.2)
///   ② đã đóng → bất cứ đâu bằng `changeStage` — phải qua `resumeOrReopen`
///   ③ đóng → đóng (`thang` → `thua`), §5.1 nêu đích danh
///   ④ `from === to`
///
/// Nhóm thứ năm — **mọi** chuyển tiếp khi tác nhân là máy — không nằm ở đây mà
/// ở `changeStage`: nó phụ thuộc tác nhân, không phụ thuộc cặp giai đoạn.
///
/// ⚠ Giao diện kéo-thả (`FR-4`) dựng ô đích bằng vị từ này thì phải **tự thêm**
/// chốt tác nhân, nếu không ô sẽ sáng cho một thao tác mà lõi bác.
export function canTransition(from: Stage, to: Stage): boolean {
  if (from === to) return false;
  if (isRunning(from) && isRunning(to)) return true;      // ①
  if (isRunning(from) && to === "tam_dung") return true;  // ②
  if ((isRunning(from) || from === "tam_dung") && isClosed(to)) return true; // ③
  return false;
}

/// §5.1 dòng 5 và 7 — đường QUAY LẠI. Tách khỏi `canTransition` có chủ đích:
/// đích ở đây **cố định**, người gọi không chọn, nên nó không phải một cặp
/// `(from, to)` để tra bảng. Nhưng nó vẫn phải là một vị từ CÓ TÊN, cạnh bảng,
/// nếu không giao diện dùng `canTransition` sẽ không bao giờ dựng được nút mở
/// lại — `canTransition` bác đúng đường đó.
export function canResume(from: Stage): boolean {
  return from === "tam_dung" || isClosed(from);
}

/// Thu hẹp ở BIÊN ĐỌC. Prisma sinh kiểu cột `latest_open_stage` là cả bảy giá
/// trị `Stage`, còn `CHECK opp_latest_open_stage_running` chỉ cho bốn — tức kiểu
/// của Prisma LỎNG HƠN cột thật. Ép kiểu ở chỗ đọc là giấu đi khoảng lệch đó;
/// hàm này KIỂM rồi mới thu hẹp, nên một hàng hỏng nổ thành mã đọc được thay vì
/// đi tiếp và hỏng ở một chỗ xa hơn.
export function asRunningStage(s: Stage | null): RunningStage | null {
  if (s === null) return null;
  if (!isRunning(s)) {
    throw new BusinessRuleError(
      "STATE_CLOSED_NO_LATEST_OPEN",
      `Giai đoạn mở gần nhất là \`${s}\`, phải là một giai đoạn đang chạy.`,
    );
  }
  return s;
}

export type StageChange = {
  stage: Stage;
  /// Bất biến HAI CHIỀU: có giá trị ⇔ `stage` ∈ {tam_dung, thang, thua}.
  /// CSDL canh bằng `CHECK opp_latest_open_stage_iff` (`AD-CR-11`).
  ///
  /// Kiểu là `RunningStage`, KHÔNG phải `Stage`: §3.1 định nghĩa trường này là
  /// *"Giai đoạn **đang chạy** cuối cùng"*, và `CHECK
  /// opp_latest_open_stage_running` canh đúng thế. ⚠ Tên trường mang chữ *mở*
  /// nhưng tập giá trị là *đang chạy* — hai từ mà §3.1 tách rạch ròi. `D42` đã
  /// chốt tên, nên chỗ vá là kiểu, không phải tên.
  latestOpenStage: RunningStage | null;
};

/// Giá trị mới của *Giai đoạn mở gần nhất* — nơi duy nhất tính nó.
///
/// Dòng `thang`/`thua` của §5.1 mang một mệnh đề dễ trượt, nguyên văn:
/// *"đi từ `tam_dung` thì **giữ nguyên** giá trị đã lưu, không ghi đè bằng
/// `tam_dung`"*. Một bản trước gán thẳng `current.stage`, nên `tam_dung → thua`
/// ghi `tam_dung` vào cột — vi phạm bất biến §3.1 và bị `CHECK
/// opp_latest_open_stage_running` bác bằng một lỗi Postgres không đọc được.
/// Nay kiểu `RunningStage` làm trình biên dịch bắt luôn lỗi đó.
function nextLatestOpenStage(
  from: Stage,
  to: Stage,
  carried: RunningStage | null,
): RunningStage | null {
  if (isRunning(to)) return null;          // quay lại đường chạy → xoá dấu
  if (isRunning(from)) return from;        // vừa rời một giai đoạn đang chạy
  return carried;                          // đi từ `tam_dung` → GIỮ NGUYÊN
}

/// Bất biến hai chiều của `AD-CR-11`, kiểm ở lối vào của cả hai hàm.
///
/// Không thể xảy ra nếu `CHECK opp_latest_open_stage_iff` còn nguyên. Kiểm ở
/// đây để hỏng thành một mã đọc được thay vì một lỗi ràng buộc Postgres ở câu
/// `UPDATE` kế tiếp — và để một hàng hỏng KHÔNG tự lành: `nextLatestOpenStage`
/// vốn sẽ ghi đè giá trị hỏng bằng `from`, xoá mất dấu vết nguyên nhân.
function assertInvariant(current: StageChange): void {
  const shouldHave = !isRunning(current.stage);
  if (shouldHave !== (current.latestOpenStage !== null)) {
    throw new BusinessRuleError(
      "STATE_TRANSITION_NOT_ALLOWED",
      `Bất biến Giai đoạn mở gần nhất đã vỡ: \`${current.stage}\` với ` +
        `\`${current.latestOpenStage}\` — dữ liệu hỏng.`,
    );
  }
}

/// `AD-5`: `actor` là tham số ĐẦU TIÊN, luôn — và là `Actor` thật, không phải
/// một cờ `byMachine` do người gọi tự tính. Một bản trước dùng cờ đó, và cờ ấy
/// (a) để người gọi khai được trạng thái bất khả `{byMachine:true, role:"admin"}`,
/// (b) bỏ quên nhánh thứ ba `kind:"seed"`.
///
/// `NFR-14`: máy KHÔNG BAO GIỜ đổi Giai đoạn — chặn ở Cổng bước ③, nhưng lõi
/// cũng chặn, vì *"một lời dặn dò suông với phần AI không tính là đã chặn"*.
/// Chốt là `!isHuman`, không phải `isMachine`: `seed` cũng không được đổi Giai
/// đoạn, vì `npm run seed` dựng Cơ hội ở trạng thái mong muốn bằng đường TẠO
/// (`INITIAL_STAGE`), không bằng đường chuyển tiếp.
export function changeStage(
  actor: Actor,
  current: StageChange,
  to: Stage,
): StageChange {
  if (!isHuman(actor)) {
    throw new BusinessRuleError(
      "NFR-14",
      `Chỉ người đổi được Giai đoạn; tác nhân là \`${actor.kind}\`.`,
    );
  }
  assertInvariant(current);

  if (current.stage === to) {
    throw new BusinessRuleError(
      "STATE_TRANSITION_NOT_ALLOWED",
      `Cơ hội đã ở \`${to}\`.`,
    );
  }
  // Chỉ chặn ĐÃ ĐÓNG ở đây. `tam_dung` KHÔNG bị chặn: §5.1 cho nó đi thẳng
  // sang `thang`/`thua` (`A1` — *"khách im hẳn là thua thật, không phải quay
  // lại rồi mới đóng"*). Chỉ đường `tam_dung` → đang chạy mới phải qua
  // `resumeOrReopen`, và `canTransition` đã bác đường đó.
  //
  // ⚠ Chốt này TRÙNG CHỦ ĐÍCH với `canTransition`, vốn đã bác mọi `from` đã
  // đóng. Nó chỉ đổi THÔNG ĐIỆP để chỉ người gọi sang `resumeOrReopen`. Đừng
  // đọc nó như lưới an toàn duy nhất cho ca này.
  if (isClosed(current.stage)) {
    throw new BusinessRuleError(
      "STATE_TARGET_FIXED",
      `Cơ hội đã đóng ở \`${current.stage}\`; mở lại phải đi qua resumeOrReopen.`,
    );
  }
  if (!canTransition(current.stage, to)) {
    throw new BusinessRuleError(
      "STATE_TRANSITION_NOT_ALLOWED",
      `Chuyển tiếp \`${current.stage}\` → \`${to}\` không nằm trong bảng §5.1.`,
    );
  }
  return {
    stage: to,
    latestOpenStage: nextLatestOpenStage(current.stage, to, current.latestOpenStage),
  };
}

/// MỘT lối vào cho cả *mở lại* lẫn *quay lại*, và nó KHÔNG nhận giai đoạn đích.
///
/// Phương án đã loại: dùng chung `changeStage(actor, id, to)` rồi kiểm
/// `to === latestOpenStage`. Loại vì nó để lộ một tham số mà **mọi lời gọi hợp
/// lệ đều phải đoán đúng**, và giao diện sẽ phải tự đọc cột đó để dựng nút.
///
/// Hai đường vào chung một hàm nhưng KHÁC quyền:
///   `tam_dung` → đang chạy    — Sales làm được (§6)
///   `thang`/`thua` → đang chạy — **chỉ Quản trị** (`D43`, `A5`, §5.2)
///
/// ⚠ Chốt vai KHÔNG ở đây. `AD-CR-10` chốt lõi không đọc `actor.role`, và
/// `AD-CR-1` dòng 7 đặt điểm kiểm ở **Cổng bước ⑤**. Hệ quả phải nói ra: cho
/// tới khi `src/autonomy` tồn tại, `D43` CHƯA được cưỡng chế ở đâu cả. Đó là
/// một khoảng hở đã biết, không phải một chỗ bị quên.
export function resumeOrReopen(actor: Actor, current: StageChange): StageChange {
  if (!isHuman(actor)) {
    throw new BusinessRuleError(
      "NFR-14",
      `Chỉ người mở lại được Cơ hội; tác nhân là \`${actor.kind}\`.`,
    );
  }
  // Phân nhánh theo `stage`, KHÔNG theo `latestOpenStage`. Trạng thái quyết
  // định là giai đoạn; cột kia chỉ là hệ quả của nó. Hỏi cột hệ quả thì với một
  // hàng hỏng `{stage:'thuong_luong', latestOpenStage:'tiep_can'}` hàm sẽ thực
  // hiện một chuyển tiếp im lặng, không qua bảng §5.1.
  if (!canResume(current.stage)) {
    throw new BusinessRuleError(
      "STATE_TARGET_FIXED",
      `Cơ hội đang ở \`${current.stage}\` — không có gì để mở lại.`,
    );
  }
  assertInvariant(current);
  return { stage: current.latestOpenStage!, latestOpenStage: null };
}
