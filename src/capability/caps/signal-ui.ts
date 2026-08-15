// `AD-2` · `AD-CP-3` · `AD-CP-8` — capability ĐỌC Phát hiện cho khu đọc của
// `S3` (`FR-14`), tức bề mặt mà `T-3` bấm vào.
//
// ⚠ Mã dẫn là `AD-2`, KHÔNG phải `AD-19`. Thân `AD-19` khai phạm vi của nó là
// *"mọi thao tác GHI, không chỉ thao tác của máy"*; vế phủ **cả đọc lẫn ghi** là
// `AD-2`. (`AD-1` có trỏ chéo sang `AD-19` cho đường đọc — chỗ lệch đó có sẵn ở
// thượng nguồn, đã NÊU RA, không sửa im lặng tài liệu.)
//
// Tệp RIÊNG chứ không thêm mục vào `caps/ui.ts`, và lý do là một ràng buộc thật
// chứ không phải gu: `ui.ts` mang một **món nợ có ý thức** — nó nhập thẳng `db`
// với một dòng `eslint-disable`, và `tests/T10B.test.ts` giữ chuỗi `"ui.ts → db"`
// trong `KNOWN_DEBT` để chặn món nợ đó LỚN THÊM. (Viết TÊN TỆP, không viết
// `T-10b` — bộ nghiệm thu §6 của đề bài chỉ có `T-1`…`T-10`, nên `T-10b` dưới
// dạng một mã `T-n` đọc thành một mã đề bài không tồn tại.) Mục này đi qua một hàm lõi thật
// (`readAccountSignals`), nên nó không dính món nợ ấy, và đứng riêng thì diff của
// nó đọc được là *"một đường đọc sạch"*, không lẫn vào một tệp đang mắc nợ.
//
// ⚠ KHÔNG cầm `db`/`tx`. Luật lint của tầng ④ cấm cả hai (`eslint.config.mjs`,
// khối `src/capability/**`), và `AD-CP-3` đặt việc *"có mở giao dịch không"* vào
// `kind`. Thân là MỘT dòng gọi lõi — đúng hình dạng mà `caps/ui.ts` tự khai là
// cách trả nợ của nó.
//
// ⚠ Thêm tệp caps mới thì PHẢI nối vào `./index.ts` (`AD-CP-1`, điểm nạp duy
// nhất). Thiếu một dòng ở đó, mục này **im lặng không tồn tại**, bề mặt nhận
// `unknown_capability`, và `tests/T10B.test.ts` vẫn xanh trên một sổ không đầy đủ.

import { z } from "zod";
import { defineCap, type RegistryEntry } from "../types";
import { readAccountSignals } from "@/core/signal/read";

/// `C1-8` · `T-3` · `FR-14` `FR-15` — đọc Phát hiện của một Công ty kèm đoạn văn
/// gốc, để bề mặt neo câu trích vào đúng khoảng `[quote_start, quote_end)`.
///
/// ⚠ `exposeToMcp: false`. `AD-CP-6` chốt `mcp-server.ts` phơi **đúng năm** mục —
/// `readArticle`, `readAccountType`, `listEnums`, `readAccountList`, `readSetting`
/// — và mục này không nằm trong năm. Đặt `true` là phá chính phép kiểm *"đúng
/// năm"*, và mở cho mô hình một bề mặt đọc không ai đòi: `AD-AG-3` chốt agent
/// không gọi capability nào, nó nhận Bản lưu qua `readArticle`.
///
/// ⚠ `allowedActors: ["human"]`. Đây là lượt đọc **có tham số lọc theo người
/// dùng** — `AD-2` xếp đúng hạng đó vào `CAP_HUMAN_ONLY`. Vòng quét không có nhu
/// cầu nào ở đây: nó GHI Phát hiện qua `createSignal`, không đọc lại chúng.
///
/// `allowedRoles: []` — ma trận vai §6 của PRD cho **cả ba** vai xem Bản lưu và
/// Phát hiện ở vùng đọc (`FR-14`), nên không có ngưỡng vai nào để canh. Đây là
/// vắng mặt CÓ CHỦ ĐÍCH, không phải một ô quên điền.
///
/// `snapshot: null` và `dirtyFlags: []` — `AD-CP-3`: không ghi thì không có giá
/// trị TRƯỚC-GHI để chụp, và không cờ `BR-B` nào bẩn đi được.
///
/// Năm ô còn lại, nói ra chứ không để trống — một ô im lặng giữa các ô có biện
/// hộ đọc thành *"chép từ tệp bên cạnh"*, và không ai rà lại được thứ không có
/// lý do viết kèm:
///   · `touches: []` — `BoundaryCode` là bốn ranh giới `§5` (`NFR-14`…`NFR-17`)
///     cộng `NFR-19`. Một lượt ĐỌC không chạm ranh giới nào trong năm; khai một
///     mã ở đây là bắt bước ④ của Cổng canh một biên giới không tồn tại.
///   · `selfLimiting: false` — `AD-4` liệt ĐÍCH DANH sáu mục mang cờ đó, và mục
///     này không nằm trong sáu. Cờ ấy tồn tại cho các lượt đọc **dựng nên phanh**
///     (`readUserForAuth`, `readSetting`…); bật nó ở đây là cho một bề mặt người
///     dùng đi xuyên qua chính cái phanh mà Quản trị vừa kéo.
///   · `zone: "tu_do"` — `AD-2` chỉ có ba mức tự chủ, và một lượt đọc không sinh
///     hệ quả nào để mà xếp cao hơn. `chay_ngam`/`ho_so_chinh_thuc` là các mức
///     dành cho đường GHI.
///   · `risk: "low"` — `AD-2` chốt `risk` **không** tham gia quyết định của Cổng;
///     nó chỉ đi vào dòng ghi vết. Đọc không hệ quả nên `low`.
///   · `requiresSignalSource: false` — `AD-3` đòi `signalId` nguồn cho **chạm
///     ghi của máy**. Mục này không ghi, và tác nhân không phải máy.
export const readAccountSignalsCap = defineCap({
  name: "readAccountSignals",
  allowedActors: ["human"] as const,
  allowedRoles: [] as const,
  touches: [] as const,
  selfLimiting: false,
  zone: "tu_do" as const,
  risk: "low" as const,
  requiresSignalSource: false,
  cascades: [] as const,
  kind: "read" as const,
  params: z.object({ accountId: z.uuid() }),
  dirtyFlags: [] as const,
  exposeToMcp: false,
  fn: async (actor, p) => readAccountSignals(actor, p.accountId),
  snapshot: null,
});

/// `AD-CP-8` — xuất DUY NHẤT một hằng `entries`, đúng khuôn của các tệp caps kia.
/// (KHÔNG phải `AD-CP-1`: mã đó là chữ ký `createRegistry` và closure của
/// `loadCapability`, chuyện khác.)
export const entries: readonly RegistryEntry[] = [
  readAccountSignalsCap,
] as unknown as readonly RegistryEntry[];
