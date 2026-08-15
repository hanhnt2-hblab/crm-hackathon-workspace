"use server";

// `U8` · `FR-11` · `§3` — đường NGƯỜI đưa nội dung vào hệ thống.
//
// `scripts/ingest.ts` đã có đường lệnh, và nó tự khai chỗ hở: *"giám khảo bấm
// đổi nguồn TRÊN GIAO DIỆN thì đường đó phải mang `actor: human` — bề mặt ấy
// chưa dựng"*. Tệp này là bề mặt đó. Cùng một capability `createArticle`, khác
// tác nhân: lệnh chạy dưới `seed`, ô này chạy dưới phiên đang đăng nhập.
//
// `AD-UI-6` — đi qua `action()`, và đó là chỗ DUY NHẤT có `try/catch`.

import { createHash } from "node:crypto";
import { revalidatePath } from "next/cache";
import { action, type ActionState } from "../../_contract";
import { appRegistry } from "../../_registry";
import { currentSession } from "../../_session";
import { text } from "../../_form";

/// `§3` gọi nguồn web là **bản chụp tĩnh**. Tài liệu người tải lên là nguồn thứ
/// hai, nên nó mang một phiên bản Bản chụp RIÊNG — không trộn vào `truoc`/`sau`
/// của bộ dữ liệu BTC. Nhờ vậy *"mọi đội chạy trên cùng một dữ liệu"* vẫn đúng:
/// thứ thêm vào luôn tự khai là thêm vào, và đếm được tách bạch.
const SNAPSHOT_VERSION = "tai_lieu";

/// Chỉ văn bản thuần. KHÔNG cài thư viện đọc PDF/DOCX — một phụ thuộc mới phải
/// chạy được trên clone sạch lúc 9:30 sáng (`§7`), đổi lấy một định dạng không
/// tiêu chí nào chấm.
const ACCEPTED = [".txt", ".md", ".html", ".htm"] as const;

/// 1 MB. Trần kiểm Ở ĐÂY chứ không chỉ ở thuộc tính `accept` của ô chọn tệp:
/// `accept` là gợi ý cho hộp thoại chọn tệp của trình duyệt, không phải một
/// phép canh — kéo-thả và một lượt POST dựng tay đều đi vòng qua nó.
const MAX_BYTES = 1_000_000;

export const uploadDocumentAction = action(async (form): Promise<ActionState> => {
  const accountId = text(form, "accountId");

  const file = form.get("file");
  // `instanceof File` chứ không `as File`: một lượt POST dựng tay gửi được một
  // chuỗi ở đúng khoá này, và khi đó `.name`/`.size` là `undefined` — phép kiểm
  // bên dưới sẽ so `undefined` và cho qua.
  if (!(file instanceof File) || file.size === 0) {
    return {
      ok: false,
      code: "unexpected",
      message: "Chưa chọn tệp nào. Chọn một tệp văn bản rồi bấm Tải lên.",
    };
  }

  const ten = file.name.toLowerCase();
  if (!ACCEPTED.some((duoi) => ten.endsWith(duoi))) {
    return {
      ok: false,
      code: "unexpected",
      message: `Chỉ nhận ${ACCEPTED.join(" ")}. Lưu tệp thành văn bản rồi tải lại.`,
    };
  }

  if (file.size > MAX_BYTES) {
    const mb = (file.size / 1_000_000).toFixed(1);
    return {
      ok: false,
      code: "unexpected",
      message: `Tệp ${mb} MB, vượt trần 1 MB. Cắt bớt phần không cần rồi tải lại.`,
    };
  }

  const rawText = await file.text();
  if (rawText.trim() === "") {
    return {
      ok: false,
      code: "unexpected",
      message: "Tệp không có chữ nào đọc được. Kiểm tra lại rồi tải lên.",
    };
  }

  const session = await currentSession();
  const create = await appRegistry.loadCapability("createArticle", session.actor);

  await create({
    accountId,
    snapshotVersion: SNAPSHOT_VERSION,
    capturedAt: new Date().toISOString(),
    rawText,
    contentHash: contentHashOf(rawText),
    // Tệp cục bộ không có địa chỉ công bố. `null` chứ không phải tên tệp: cột
    // này là URL nguồn, và nhét tên tệp vào đó sinh một liên kết chết trên khu
    // đọc.
    publishedUrl: null,
    readable: true,
    unreadableReason: null,
  });

  revalidatePath(`/accounts/${accountId}`);

  return {
    ok: true,
    message: `Đã lưu “${file.name}” — vòng quét kế tiếp sẽ đọc.`,
  };
});

/// ⚠ CỐ Ý KHÔNG dùng `contentFingerprint` của `src/ingest/fingerprint.ts`, và
/// đây là quyết định chứ không phải tiện tay. Hai lý do, cái thứ hai mới là cái
/// chịu lực:
///
///   · `AD-UI-2` cấm module dùng chung giữa ba nhánh của tầng ① (`src/app`,
///     `src/scan`, `src/ingest`). Nhập ngang là mở đúng cái cửa đó.
///   · `contentFingerprint` băm bản đã qua `stripVolatile` — tám mẫu bóc dấu
///     thời gian hiển thị, số lượt xem, số phiên bản. Chúng tồn tại vì một
///     TRANG WEB đọc lại mỗi phút sẽ đổi vài byte mà không có tin gì mới
///     (`D18`). Một tệp người chọn không có tính chất đó: nội dung là thứ họ
///     cố ý đưa vào, và bóc bớt trước khi băm là làm hai tài liệu khác nhau
///     đụng nhau ở dấu vân.
///
/// Hệ quả có chủ đích: tải cùng một tệp hai lần cho HAI Bản lưu. Người bấm hai
/// lần là có chủ đích, khác hẳn vòng quét đọc lại cùng một trang.
function contentHashOf(rawText: string): string {
  return createHash("sha256").update(rawText, "utf8").digest("hex");
}
