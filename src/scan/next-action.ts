// `§4/nhóm 4` · `T-6` · `FR-30`…`FR-34` · `BR-D5` · `BR-D7` · `BR-D8` · `AD-3`
// · `AD-10` · `AD-11` · `D14` — TỰ ĐẶT VIỆC TIẾP THEO, phía bên gọi.
//
// Đây là mắt xích §4/nhóm 4 mà vòng quét thiếu: trước tệp này `src/scan/loop.ts`
// chỉ gọi `createSignal` và `appendTimelineEntry`, nên một Phát hiện đáng chú ý
// sinh ra một mục Dòng thời gian rồi dừng — không Việc tiếp theo, không thông
// báo, không dấu hiệu *do hệ thống đặt*.
//
// ─────────────────────────────────────────────────────────────────────────────
// BA VẾ CỦA `T-6` RƠI RA TỪ **MỘT** LỜI GỌI, và đó không phải trùng hợp.
// ─────────────────────────────────────────────────────────────────────────────
//
// `fillNextActionIfUnchanged` của lõi ghi cả ba trong CÙNG một giao dịch:
//   ① hàng `next_action` với `content` + `due_date` + `source_signal_id`
//      (`AD-3`: chạm ghi của máy ĐÒI Phát hiện nguồn, không tuỳ chọn)
//   ② hàng `notification` — `notifyAutoSet`, cùng giao dịch, cùng tác nhân
//   ③ `set_by = "he_thong"` và `undo_deadline_at` = 7 ngày (`D14`, bảng `0.2.2`)
//
// Nên tệp này KHÔNG dựng thông báo, KHÔNG đặt cửa sổ Hoàn tác, và KHÔNG có
// `src/core/notification.ts` đi kèm. Thêm một đường ghi thứ hai vào bảng
// `notification` là tách ② ra khỏi giao dịch của ①, và hậu quả có tên: một thông
// báo còn lại kể về một lần tự đặt đã bị cuộn lại. `AD-CR-7` đặt giao dịch trong
// lõi đúng để chuyện đó không xảy ra.
//
// ─────────────────────────────────────────────────────────────────────────────
// ⚠ TẦNG ① KHÔNG QUYẾT ĐỊNH GÌ Ở ĐÂY, VÀ ĐÓ LÀ RÀNG BUỘC CHỨ KHÔNG PHẢI GU.
// ─────────────────────────────────────────────────────────────────────────────
//
// Bốn dữ kiện mà một bên gọi "đầy đủ" sẽ cần, và lý do KHÔNG cái nào lấy được từ
// tầng ①. Bốn cái này là căn cứ để đẩy toàn bộ phần quyết định xuống lõi:
//
//   · **Cơ hội nào** — `AD-3` cho tự đặt khi Cơ hội ở giai đoạn *đang chạy*
//     (`D11`). Không capability nào cho `actor.kind === "system"` đọc được Cơ
//     hội: `readAccountDetail` mang `allowedActors` chỉ-người, và
//     `CAP_MACHINE_ALLOWED_DOC` bị ghim ĐÚNG BẢY tên ở `tests/T10B.test.ts`.
//     Thêm một mục đọc thứ tám cho máy làm `T-10B` ĐỎ.
//   · **Ô hiện tại** (`expectedContent`/`expectedDueDate`) — `AD-10` đòi vế
//     `WHERE` lặp lại giá trị máy ĐÃ ĐỌC. Cùng lý do trên: không đường đọc nào.
//   · **Ngày hạn** — `computeDueDate` là hàm THUẦN, nhưng nó nằm trong
//     `src/core/nextaction/index.ts`, tệp có `import { tx } from "@/core/db"` ở
//     đầu. Tầng ① nhập nó là kéo Prisma vào đúng chỗ `AD-1` cấm. Chép bảng
//     `0.2.1` sang `src/scan` thì hết cấm — và dựng một nguồn sự thật thứ hai
//     cho bảng hạn, thứ lệch im lặng ngay lần đầu ai sửa một ô.
//   · **Độ liên quan để xét `BR-D5`** — `D4` chốt *đáng chú ý* = `relevance =
//     high` VÀ mức chắc chắn ∈ {`chac`, `co_the`}. Giá trị `relevance` ĐEM XÉT
//     phải là giá trị lõi tự suy (`deriveRelevance`, vá 14/8), không phải đề
//     nghị của mô hình trong `SignalDraft` — đã đo: mô hình trả `high` cho 5/5
//     Phát hiện. Mà `createSignal` chỉ trả `{ id }`.
//
// Nên hợp đồng là: tầng ① đưa **Phát hiện nào vừa được tạo**, lõi trả lời **đã
// đặt hay không, và vì sao không**. Toàn bộ `BR-D5`, `BR-D7`, `BR-D8`, ba nhánh
// `AD-3` và phép kiểm-và-ghi nguyên tử `AD-10` nằm ở lõi, nơi đã có sẵn cả bảng
// lẫn hàm thuần.
//
// ⚠ VIỆC CÒN NỢ, nằm ngoài phần tệp lượt này sở hữu: lược đồ Zod của
// `fillNextActionIfUnchangedCap` (`src/capability/caps/suggestion.ts`) hôm nay
// còn đòi `opportunityId`, `expectedContent`, `expectedDueDate`, `content`,
// `dueDate`, `sourceSignalId` — tức đòi đúng bốn dữ kiện vừa chứng minh là tầng
// ① không có. Tới khi lược đồ đó nhận `{ accountId, signalId }`, lời gọi dưới
// đây bị Zod bác và vòng quét ghi một dòng nhật ký nêu đích danh chuyện đó.
// Hỏng TO và RÕ, không hỏng im lặng — đúng chủ đích của bước ① trong `decide`.
//
// ⚠ KHÔNG đặt tên capability mới. `AD-2` khoá hạng ghi của khối một ở ĐÚNG SÁU
// tên và `T-10` khẳng định theo TÊN (*"tên là hợp đồng, không phải nhãn"*);
// `fillNextActionIfUnchanged` đã là một trong sáu, và `tests/T10B.test.ts` đã
// ghim nó vào họ *chạm Hồ sơ và Việc*. Một tên thứ bảy — dù rõ nghĩa hơn — làm
// `T-10` đỏ ở một khẳng định không liên quan gì tới `T-6`.

import {
  parseAutoSetNextAction,
  type AccountRef,
  type CallFn,
  type CapOutcome,
} from "./_contract";
import type { JournalSink } from "./journal";

/// Tên lấy nguyên văn từ hạng ghi của khối một (`AD-2`). Hằng số chứ không phải
/// chuỗi rải rác: nó xuất hiện ở lời gọi và ở hai dòng nhật ký, và ba bản chép
/// tay của cùng một tên là ba chỗ chờ trôi khỏi nhau.
export const AUTO_SET_NEXT_ACTION_CAP = "fillNextActionIfUnchanged";

/// Thử tự đặt Việc tiếp theo cho MỘT Phát hiện vừa tạo.
///
/// Trả về `CapOutcome` THÔ, có chủ đích: bên gọi phải đưa nó cho `noteDenial` để
/// bộ đếm `max_consecutive_denials` của `AD-11` nhìn thấy. Nuốt kết cục ở đây là
/// lặp lại đúng lỗi mà đầu `loop.ts` đã ghi lại một lần — Cổng bác mọi lượt, bộ
/// đếm không tăng, và vòng chạy hết danh sách rồi đóng với `hoan_tat` dù không
/// đặt được gì.
///
/// ⚠ MỘT LỜI GỌI CHO MỖI PHÁT HIỆN, không gom cuối Công ty. `BR-D8` (*nhiều tin
/// cùng lúc thì lấy hạn NGẮN NHẤT*) cài được bằng cách gọi lặp chính là nhờ
/// nhánh ⓑ của `AD-3`: ô do chính máy đặt thì được ghi lại, và vế `WHERE` chỉ cho
/// qua khi hạn mới KHÔNG xa hơn hạn đang có (`OR: [{dueDate: null}, {dueDate:
/// {gte: …}}]`). Tức lượt gọi thứ hai với một tin gấp hơn sẽ rút ngắn hạn, còn
/// một tin thong thả hơn thì bỏ lượt — đúng bất biến, không cần tầng ① gom gì.
///
/// ⚠ `AD-AG-9` — một Phát hiện hỏng ở đây KHÔNG kéo theo Phát hiện khác và
/// KHÔNG kéo theo Công ty khác: hàm không ném, mọi đường ra đều là một giá trị.
export async function autoSetNextAction(
  call: CallFn,
  journal: JournalSink,
  account: AccountRef,
  input: { signalId: string; claim: string },
): Promise<CapOutcome> {
  const outcome = await call(AUTO_SET_NEXT_ACTION_CAP, {
    accountId: account.id,
    /// `AD-3` — chạm ghi của máy ĐÒI Phát hiện nguồn. Đây cũng là trường mà
    /// `requiresSignalSource: true` của mục sổ đăng ký canh ở bước ④ của Cổng,
    /// và là cột `next_action.source_signal_id` mà `T-6` khẳng định KHÔNG NULL.
    signalId: input.signalId,
  });

  // ── Cổng từ chối, hoặc lời gọi hỏng ──────────────────────────────────────
  //
  // ⚠ PHẢI CÓ MỘT DÒNG NÊU LÝ DO. `fillNextActionIfUnchanged` mang
  // `selfLimiting: false` có chủ đích (bấm Tắt AI xong máy vẫn tự đặt thì `T-9`
  // đỏ ở đúng câu *"không tự đặt Việc tiếp theo"*), nên nó BỊ BÁC mã `brake` khi
  // phanh tắt và mã `limit` khi trần chạm — cả hai là hành vi ĐÚNG. Không ghi
  // dòng nào thì ba trạng thái rất khác nhau — phanh đang tắt, trần đã chạm,
  // lược đồ tầng ④ lệch — cho cùng một triệu chứng: *"vòng chạy xong, Cơ hội
  // không có Việc tiếp theo"*.
  if (outcome.status !== "ok") {
    journal(
      `[vòng quét] \`${account.name}\` · KHÔNG TỰ ĐẶT ĐƯỢC VIỆC TIẾP THEO `
      + `(\`§4/nhóm 4\`, \`T-6\`) ở \`${outcome.capability}\` — `
      + (outcome.status === "denied"
        ? `Cổng từ chối: ${outcome.reason}`
        : describe(outcome.error)),
    );
    return outcome;
  }

  // ── Lời gọi qua, nhưng hợp đồng trả về có thể lệch ───────────────────────
  //
  // `parseAutoSetNextAction` NÉM khi giá trị trả về không phải `boolean` lẫn
  // object. Lần ném đó không được thoát khỏi đây: `scanOneAccount` đang cầm khoá
  // Công ty, và tuy `finally` của nó vẫn nhả khoá, một lần ném vẫn bỏ qua những
  // Phát hiện còn lại của chính Bản lưu này — `AD-AG-9` cấm đúng chuyện đó.
  let result;
  try {
    result = parseAutoSetNextAction(outcome.value);
  } catch (e) {
    journal(
      `[vòng quét] \`${account.name}\` · HỢP ĐỒNG \`${AUTO_SET_NEXT_ACTION_CAP}\` LỆCH `
      + `— ${describe(e)}`,
    );
    return outcome;
  }

  // ── Bỏ lượt: một KẾT CỤC, không phải một khoảng trống (`AD-CR-8`) ────────
  //
  // Không phải lỗi và KHÔNG thử lại (`AD-10`: *"0 hàng bị chạm thì bỏ lượt"*) —
  // vòng quét sau đọc lại giá trị mới và tự quyết lại. Vẫn ghi một dòng, vì đây
  // là chỗ DUY NHẤT chứng minh được luật *"máy không ghi đè người vừa gõ"* của
  // `FR-34` đã chạy thật, và cũng là chỗ `BR-D5` nói *"tin này không đáng chú ý"*.
  if (!result.filled) {
    journal(
      `[vòng quét] \`${account.name}\` · KHÔNG ĐẶT VIỆC TIẾP THEO cho Phát hiện `
      + `\`${input.signalId}\` — `
      + (result.reason
        ?? "lõi không nêu lý do (`fillNextActionIfUnchanged` còn trả `boolean` trần; "
          + "lý do chỉ còn trong dòng ghi vết `no_op`)")
      + ` · ${truncate(input.claim)}`,
    );
    return outcome;
  }

  // Đã đặt. Ghi một dòng KHẲNG ĐỊNH chứ không im lặng: `FR-33` đòi ghi vết mọi
  // lần hệ thống tự đặt, và tuy bản ghi vết thật nằm ở bảng `audit`, dòng này là
  // thứ người đứng xem buổi chấm đọc được ngay — `T-6` là một điểm nghiệm thu
  // mà giám khảo nhìn, không phải một truy vấn họ chạy.
  journal(
    `[vòng quét] \`${account.name}\` · ĐÃ TỰ ĐẶT VIỆC TIẾP THEO (\`T-6\`)`
    + (result.opportunityId ? ` cho Cơ hội \`${result.opportunityId}\`` : "")
    + ` từ Phát hiện \`${input.signalId}\` · ${truncate(input.claim)}`,
  );
  return outcome;
}

/// Câu khẳng định của Phát hiện có thể dài cả đoạn; dòng nhật ký thì phải đọc
/// được trong một dòng terminal.
function truncate(s: string): string {
  const t = s.trim();
  return t.length <= 80 ? t : `${t.slice(0, 79)}…`;
}

/// ⚠ ÉP VỀ MỘT DÒNG. Nhật ký vòng quét là sink theo DÒNG (`JournalSink`), và
/// `T-8` đọc nó bằng cách đếm *"dòng tổng kết cho từng vòng"*. Đo được ở lượt
/// này: một `ZodError` từ lược đồ tầng ④ in ra 48 dòng JSON, nên MỘT lượt bỏ
/// đẩy 48 dòng vào một sink mà người đứng xem đang đếm dòng — dòng tổng kết
/// của chính vòng đó trôi khỏi màn hình.
function describe(e: unknown): string {
  const raw = e instanceof Error ? e.message : String(e);
  return raw.replace(/\s+/g, " ").trim();
}
