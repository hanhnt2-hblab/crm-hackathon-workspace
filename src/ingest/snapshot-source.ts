// `§3` · `AD-UI-15` · `AD-18` — đọc bộ Bản chụp hai phiên bản của BTC.
//
// Đề bài `§3`: *"Bản chụp là tệp nội dung tĩnh nằm trong bộ dữ liệu. Nguồn web
// trong đề bài chính là các bản chụp này, không phải trang web thật"*. Nghĩa là
// *"đọc lại nguồn"* của `FR-36` KHÔNG phải một lời gọi HTTP — nó là đọc lại
// những tệp này. Không có luật đó thì vòng quét đi gọi web thật, và kịch bản
// demo hết lặp lại được.
//
// `AD-UI-15` xếp tệp này về phía **dựng được tối 14/08**: nó biết *hình dạng
// thư mục*, không biết *tên trường nguồn*. Phần chờ sáng 15/08 là `mapping.ts`
// của khối CRM (Công ty, Người liên hệ, Cơ hội), không phải khối Bản chụp —
// Bản chụp chỉ có hai thứ, nội dung và phiên bản, và cả hai đã khai ở `§3`.
//
// ⚠ `AD-18`: tệp này bóc thẻ và quyết định *đọc được hay không*, rồi DỪNG. Nó
// không chạm khoảng trắng, không chạm Unicode. Cưỡng chế: không `.replace(/\s+/`,
// không `.normalize(` trong cả thư mục.

import { readdir, readFile, stat } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import {
  isSnapshotVersion,
  type SnapshotDoc,
  type SnapshotVersion,
} from "./_contract";

/// Hình dạng thư mục MẶC ĐỊNH, khai tường minh vì bộ dữ liệu thật tới sáng
/// 15/08 và một mặc định không viết ra là một mặc định không kiểm được:
///
/// ```
/// <dir>/<source_ref>/truoc.html      ← hoặc .htm, .txt, .md
/// <dir>/<source_ref>/sau.html
/// ```
///
/// `<source_ref>` là **khoá tự nhiên** của Công ty ở nguồn (`AD-UI-17`), không
/// phải tên Công ty: tên đổi là sinh bản ghi thứ hai và `NFR-8` đỏ ở lần chạy
/// thứ hai.
///
/// BTC phát bộ dữ liệu theo hình dạng khác thì sửa **đúng hàm này**, không sửa
/// `switch.ts` — đó là toàn bộ lý do hai tệp tách nhau.
const TEXT_EXTENSIONS = new Set([".html", ".htm", ".txt", ".md"]);

export type ReadDatasetResult = {
  docs: SnapshotDoc[];
  /// Thư mục con bị bỏ qua, kèm lý do. `AD-UI-16`: mỗi kết cục có TÊN — im lặng
  /// bỏ qua một Công ty là cách chắc chắn để `T-8` thiếu một mục mà không ai
  /// biết vì sao.
  skipped: { entry: string; reason: string }[];
};

/// Đọc cả bộ. KHÔNG ném khi một Công ty thiếu một phiên bản: nó vào `skipped`.
///
/// Ném thì một thư mục lẻ trong bộ dữ liệu BTC làm hỏng cả lệnh nạp, và 45
/// phút đầu giờ thi sẽ trôi vào việc chẩn đoán một tệp không quan trọng. Ném
/// **chỉ** khi chính thư mục gốc không đọc được — đó mới là cấu hình sai.
export async function readSnapshotDataset(dir: string): Promise<ReadDatasetResult> {
  const docs: SnapshotDoc[] = [];
  const skipped: { entry: string; reason: string }[] = [];

  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const accountSourceRef = entry.name;
    const sub = join(dir, accountSourceRef);
    const files = await readdir(sub, { withFileTypes: true });

    const found = new Map<SnapshotVersion, string>();
    for (const f of files) {
      if (!f.isFile()) continue;
      const ext = extname(f.name).toLowerCase();
      if (!TEXT_EXTENSIONS.has(ext)) continue;
      const stem = basename(f.name, ext).toLowerCase();
      if (!isSnapshotVersion(stem)) continue;
      // Bản đầu tiên thắng: hai tệp `sau.html` và `sau.txt` cùng thư mục là dữ
      // liệu mập mờ, và chọn im lặng bản sau là chọn theo thứ tự hệ tệp trả về
      // — tức hai máy cho hai kết quả.
      if (!found.has(stem)) found.set(stem, join(sub, f.name));
    }

    if (!found.has("truoc") || !found.has("sau")) {
      skipped.push({
        entry: accountSourceRef,
        reason: `thiếu phiên bản ${!found.has("truoc") ? "`truoc`" : "`sau`"} — \`§3\` đòi ĐỦ HAI`,
      });
      continue;
    }

    for (const [version, path] of found) {
      docs.push(await readSnapshotFile({ accountSourceRef, version, path }));
    }
  }

  return { docs, skipped };
}

/// Đọc MỘT tệp Bản chụp thành `SnapshotDoc`.
///
/// `capturedAt` lấy từ `mtime` của tệp, không lấy `new Date()`: `NFR-8` đòi nạp
/// lại cho cùng kết quả, mà `new Date()` làm mỗi lần nạp sinh một mốc khác —
/// và mốc đó đi thẳng vào `snapshot.captured_at`, tức hai lần nạp cho hai hàng
/// khác nhau ở một cột mà người đọc dùng để xếp thứ tự.
export async function readSnapshotFile(input: {
  accountSourceRef: string;
  version: SnapshotVersion;
  path: string;
}): Promise<SnapshotDoc> {
  const [raw, info] = await Promise.all([
    readFile(input.path, "utf8"),
    stat(input.path),
  ]);
  const plain = extname(input.path).toLowerCase().startsWith(".htm")
    ? htmlToPlainText(raw)
    : raw;

  // `readable = false` là trạng thái HỢP LỆ (`FR-50`, `FR-12`). Điều kiện là
  // *"bóc xong không còn chữ nào"*, không phải *"tệp rỗng"*: một trang toàn
  // `<script>` đọc ra rỗng trong khi tệp thì to.
  const hasContent = plain.replace(/[\n\r\t ]/gu, "").length > 0;

  return {
    accountSourceRef: input.accountSourceRef,
    version: input.version,
    capturedAt: info.mtime,
    rawText: plain,
    publishedUrl: null,
    readable: hasContent,
    unreadableReason: hasContent ? null : "bóc thẻ xong không còn nội dung chữ",
  };
}

/// Bóc thẻ — việc PHỤ THUỘC ĐỊNH DẠNG NGUỒN, nên nó ở đây chứ không ở lõi
/// (`AD-18`).
///
/// ⚠ Nó CỐ Ý để lại khoảng trắng thừa và xuống dòng thừa. Dọn ở đây là làm hai
/// hàm cùng chuẩn hoá — và hai hàm chuẩn hoá khác nhau, mỗi hàm một bộ kiểm
/// thử xanh, vẫn lệch nhau ở NBSP hay NFC/NFD. Lệch một ký tự là LỆCH OFFSET
/// câu trích, với triệu chứng trông y hệt *mô hình bịa câu trích*.
export function htmlToPlainText(html: string): string {
  return html
    // ① khối không phải nội dung — bỏ cả thẻ lẫn ruột
    .replace(/<(script|style|noscript|template)\b[^>]*>[\s\S]*?<\/\1>/giu, "")
    // ② chú thích
    .replace(/<!--[\s\S]*?-->/gu, "")
    // ③ thẻ khối thành xuống dòng, để lõi còn thấy ranh giới đoạn. Thay bằng
    //    chuỗi rỗng thì hai đoạn dính liền và câu trích bắc cầu qua ranh giới
    //    đoạn — một câu không hề tồn tại trên trang.
    .replace(/<\/?(p|div|br|li|tr|h[1-6]|section|article|header|footer)\b[^>]*>/giu, "\n")
    // ④ mọi thẻ còn lại
    .replace(/<[^>]+>/gu, "")
    // ⑤ thực thể HTML — giải mã ĐÚNG bộ tối thiểu, có tên. Bộ đầy đủ là một gói
    //    phụ thuộc; sáu cái này phủ gần hết văn bản tin, và `&amp;` phải đi
    //    CUỐI, nếu không `&amp;lt;` giải thành `<` thay vì `&lt;`.
    .replace(/&nbsp;/gu, " ")
    .replace(/&quot;/gu, "\"")
    .replace(/&#39;|&apos;/gu, "'")
    .replace(/&lt;/gu, "<")
    .replace(/&gt;/gu, ">")
    .replace(/&amp;/gu, "&");
}
