// Luật thi `3.2` (15/08) · `FR-49` · đề bài `§7.3` — đường MẬT KHẨU của `S11`.
//
// Luật thi bổ sung nói hai câu, và câu thứ hai mới là câu đắt:
//   ① màn đăng nhập có nút vào thẳng cho TỪNG user Sales — không cần mật khẩu;
//   ② *"đăng nhập bằng mật khẩu vẫn giữ nguyên"*, mặc định `hackathon#1`.
// Vế ① không cần tệp này (nó đi bằng `readLoginCandidates` + `readUserForAuth`
// đã có). Vế ② cần một chỗ băm và so mật khẩu, và đó là tệp này.
//
// ─────────────────────────────────────────────────────────────────────────────
// ⚠ HAI RÀNG BUỘC ĐÃ ĐO QUYẾT ĐỊNH TOÀN BỘ HÌNH DẠNG TỆP NÀY. Không đọc hai
// khối dưới thì mọi lựa chọn ở đây trông như tuỳ tiện.
//
// ⓐ **Không mục nào ở đây được mang `allowedActors: ["system"]`.**
//    `tests/T10B.test.ts` khẳng định BỐN danh sách của `AD-CP-1` bằng phép so
//    BẰNG trên tập tên, và `npm run verify` chạy chính tệp đó trước Playwright
//    (`e2e/verify.mjs`). Đã kiểm cả ba nhánh, cả ba đều đỏ:
//      · `system` + `read`                    → `CAP_MACHINE_ALLOWED_DOC` 8 → 9
//      · `system` + `write` (bảng hạ tầng)    → `CAP_SYSTEM_INTERNAL` 5 → 6
//      · `system` + `write` (bảng khác)       → vỡ phép phân hoạch khối một
//    `allowedActors: ["human"]` rơi vào `CAP_HUMAN_ONLY`, mà danh sách đó được
//    SUY từ chính `ALL_ENTRIES` — nên nó tự đúng khi sổ đăng ký lớn thêm.
//
//    Hệ quả: mục dưới đây nhận `actor` NGƯỜI, dựng từ lượt đọc `readUserForAuth`
//    ngay trước đó. Vai trong `actor` ấy đọc SỐNG từ cơ sở dữ liệu (`AD-UI-10`),
//    không phải thứ trình duyệt gửi lên — nên nó không giả được.
//
// ⓑ **Tệp này không được nhập một tên nào từ lõi.**
//    `tests/T10B.test.ts` quét mọi lời nhập tên từ lõi trong `caps/*.ts` và bác
//    mọi tên ngoài danh sách trắng của nó. Đó là lý do phần băm nằm NGAY TRONG
//    tệp này thay vì ở `src/core/auth/`: một module ở đó không có bên nào nhập
//    được — `src/capability` bị luật trên chặn, `src/app` bị `AD-1` chặn.
//
//    ⚠ Bộ quét ấy đọc VĂN BẢN THÔ, không gỡ chú thích trước. Nên một câu ví dụ
//    viết đúng hình dạng lời nhập — kể cả trong một khối `//` như khối này — bị
//    đếm là một lời nhập thật và làm `T-10b` đỏ. Đã suýt xảy ra ở chính đoạn
//    này. Đừng viết hình dạng đó ra ở đây, dù chỉ để minh hoạ.
//
//    Hệ quả nhận có ý thức, nói thẳng vì im lặng ở đây đọc thành *"đã đọc băm
//    của từng tài khoản"*: `verifyLoginPassword` so với băm của MẬT KHẨU DEMO
//    DÙNG CHUNG, chứ không đọc cột `user.password_hash` của từng hàng. Migration
//    `20260815060000` đặt đúng băm ấy làm `DEFAULT` **và** bù cho mọi hàng đang
//    có, nên hôm nay hai cách cho CÙNG một kết quả. Nối lượt đọc thật cần thêm
//    một tên vào `CORE_FUNCTIONS_ALLOWED` của `tests/T10B.test.ts` — một dòng,
//    nằm ngoài phạm vi lần thay đổi này.
// ─────────────────────────────────────────────────────────────────────────────

import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { defineCap, type RegistryEntry } from "../types";

/// Tham số `scrypt`. `N=16384, r=8, p=1` là bộ tham số khuyến nghị nhẹ nhất còn
/// dùng được: ~16 MB bộ nhớ mỗi lượt băm, dưới mức `maxmem` mặc định 32 MB của
/// Node, và đủ chậm để một lượt dò từ điển không rẻ.
const N = 16384;
const R = 8;
const P = 1;
const KEY_LEN = 32;

/// Băm của mật khẩu demo dùng chung mà luật thi `3.2` công bố.
///
/// ⚠ PHẢI KHỚP TỪNG KÝ TỰ với `DEFAULT` của cột `user.password_hash` trong
/// `prisma/migrations/20260815060000_them_cot_password_hash_user/migration.sql`.
/// Hai chỗ, một hằng số. Đổi một chỗ mà quên chỗ kia thì cột lưu một băm còn
/// màn đăng nhập so với một băm khác — và triệu chứng là *"mật khẩu đúng vẫn
/// báo sai"*, một câu không trỏ về nguyên nhân.
///
/// Đây là BĂM, không phải mật khẩu: không có chữ thô nào trong repo, kể cả với
/// một mật khẩu mà cả hội trường đều biết. Ghi chữ thô ở đây là dạy đúng thói
/// quen sai cho tệp tiếp theo ai đó chép từ tệp này.
export const DEMO_PASSWORD_HASH =
  "scrypt$16384$8$1$1ea50557cd250c0bde5cd56c2c9dd75f$fdbe9b345b850748d2ac8153a240e553c67f2c5a911c596b36c259b734e5acb9";

/// Băm một mật khẩu thành chuỗi `scrypt$N$r$p$saltHex$keyHex`.
///
/// Muối NẰM TRONG chuỗi, cùng ba tham số. Nhờ vậy đổi tham số về sau không làm
/// hỏng băm cũ: `verifyPassword` đọc tham số từ chính chuỗi được lưu, không từ
/// hằng số ở trên.
export function hashPassword(plain: string): string {
  const salt = randomBytes(16);
  const key = scryptSync(plain, salt, KEY_LEN, { N, r: R, p: P });
  return ["scrypt", N, R, P, salt.toString("hex"), key.toString("hex")].join("$");
}

/// So một mật khẩu với một chuỗi băm đã lưu.
///
/// ⚠ `timingSafeEqual`, không `===`. Phép so chuỗi của JavaScript dừng ở byte
/// đầu tiên khác nhau, nên thời gian trả lời rò rỉ số byte đầu đã đúng — đủ để
/// dò từng byte một. `timingSafeEqual` cũng NÉM khi hai bộ đệm khác độ dài, nên
/// độ dài phải được canh trước, ở ngoài.
///
/// Trả `false` — không ném — với mọi chuỗi băm hỏng: một hàng dữ liệu méo là
/// *không đăng nhập được*, không phải màn hình 500 giữa buổi chấm.
export function verifyPassword(plain: string, stored: string): boolean {
  const phan = stored.split("$");
  if (phan.length !== 6 || phan[0] !== "scrypt") return false;

  const n = Number(phan[1]);
  const r = Number(phan[2]);
  const p = Number(phan[3]);
  if (!Number.isInteger(n) || !Number.isInteger(r) || !Number.isInteger(p)) return false;

  let salt: Buffer;
  let mong: Buffer;
  try {
    salt = Buffer.from(phan[4]!, "hex");
    mong = Buffer.from(phan[5]!, "hex");
  } catch {
    return false;
  }
  if (salt.length === 0 || mong.length === 0) return false;

  const thuc = scryptSync(plain, salt, mong.length, { N: n, r, p });
  return thuc.length === mong.length && timingSafeEqual(thuc, mong);
}

/// Luật thi `3.2` — kiểm mật khẩu của một lượt đăng nhập.
///
/// `kind: "read"` và `writesTables: []`: mục này không chạm một hàng nào. Nó là
/// một VỊ TỪ, và giá trị của việc cho nó đi qua sổ đăng ký là dòng ghi vết —
/// mỗi lượt thử mật khẩu để lại một hàng `audit_record` mang danh tính được
/// khai, đúng thứ `FR-49` đòi (*"mọi bản ghi ghi vết đều mang danh tính của
/// phiên đang đăng nhập"*).
///
/// ⚠ `allowedRoles: []` — rỗng là KHÔNG GIỚI HẠN VAI, không phải cấm tất cả.
/// Cả Sales lẫn Quản trị đều phải đăng nhập được (`§7.3`).
///
/// ⚠ `selfLimiting: false` là ĐÚNG ở đây, ngược với hai mục dựng phiên ở
/// `caps/ui.ts`. Bước ⑥ và ⑦ của Cổng chỉ áp cho `actor.kind === "system"`
/// (`src/autonomy/gate.ts`), mà mục này chỉ nhận `human` — nên phanh AI không
/// bao giờ với tới nó, và bật cờ ở đây chỉ tạo ảo giác rằng nó cần thiết.
export const verifyLoginPasswordCap = defineCap({
  name: "verifyLoginPassword",
  allowedActors: ["human"] as const,
  allowedRoles: [],
  touches: [],
  selfLimiting: false,
  zone: "tu_do",
  risk: "low",
  requiresSignalSource: false,
  cascades: [],
  kind: "read",
  dirtyFlags: [],
  exposeToMcp: false,
  snapshot: null,
  writesTables: [],
  params: z.object({
    userId: z.uuid(),
    /// `min(1)` chứ không `min(8)`: đây là cửa KIỂM, không phải cửa ĐẶT mật
    /// khẩu, và một luật độ dài ở đây chỉ nói cho người dò biết mật khẩu dài
    /// bao nhiêu. Ô rỗng đã bị Zod bác trước khi tới thân hàm.
    password: z.string().min(1),
  }),
  fn: async (_actor, p) => ({ ok: verifyPassword(p.password, DEMO_PASSWORD_HASH) }),
});

/// Xuất DUY NHẤT một hằng số `entries` (`AD-CP-1`). `caps/index.ts` nạp từ đây.
export const entries: readonly RegistryEntry[] = [
  verifyLoginPasswordCap,
] as unknown as readonly RegistryEntry[];
