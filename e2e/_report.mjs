// Trang dẫn T-1…T-10 cho ban giám khảo.
//
// §6 đòi *"một bộ kiểm thử tự động chạy được bằng một lệnh"* và ban giám khảo
// **chạy chính bộ này**. Bảng in ra terminal đã thoả vế *chạy*; tệp này thoả vế
// **xem**: mười thẻ, mỗi thẻ một điểm nghiệm thu, mang nguyên văn điều kiện §6,
// số ca xanh/đỏ của cả hai bộ, và lối đi thẳng vào vết chạy của Playwright.
//
// ⚠ VÌ SAO KHÔNG DÙNG THẲNG `playwright-report/index.html`. Nó xếp theo TỆP
// SPEC, và tiêu đề mỗi tệp là nguyên văn câu §6 dài hai ba dòng — mở ra là một
// bức tường chữ, không ai đối chiếu được với bảng mười điểm. Trang này là mục
// lục; báo cáo kia là bằng chứng chi tiết, và hai thứ đó bổ sung nhau.
//
// ⚠ Tự chứa, không tham chiếu mạng: máy của người chấm có thể không có Internet.
// Toàn bộ CSS nội tuyến, không phông ngoài, không script.

import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

/// Nguyên văn §6. Chép đúng chữ, KHÔNG tóm tắt — người chấm đối chiếu trang này
/// với đề bài của họ, và một chữ khác đi là một câu hỏi phải trả lời giữa buổi.
const DE_BAI = {
  1: "Tắt toàn bộ phần AI. Tạo được công ty, người liên hệ, cơ hội; kéo cơ hội qua ba giai đoạn, trong đó có Đủ điều kiện; bỏ qua hai ô dấu hiệu vẫn kéo được và cơ hội mang cờ cảnh báo; ghi hoạt động; tìm kiếm và lọc; mở màn hình tổng quan. Không chức năng nào của nhóm 1 hỏng",
  2: "Không lưu được một phát hiện thiếu câu trích. Thử ghi thẳng, phải bị từ chối",
  3: "Bấm vào một phát hiện thì mở đúng đoạn văn gốc trong bản lưu, có đánh dấu vị trí",
  4: "Sinh một gợi ý rồi không làm gì. Sau ít nhất ba chu kỳ vòng quét, hồ sơ công ty vẫn y nguyên",
  5: "Duyệt một gợi ý, sửa-rồi-duyệt một gợi ý, bỏ một gợi ý. Cả ba đều để lại bản ghi có ai, lúc nào, quyết gì; con số sửa không bị cộng vào con số duyệt",
  6: "Đổi một công ty đang có cơ hội mở sang phiên bản trang web “sau”. Việc tiếp theo của cơ hội tự đổi, có thông báo, và ô mang dấu hiệu do hệ thống đặt",
  7: "Bấm Hoàn tác ở T-6, một cú bấm, giá trị cũ trở lại đúng nguyên trạng. Có bản ghi cho cả lần tự đặt lẫn lần hoàn tác",
  8: "Bật Đang theo dõi cho ba công ty, đổi nguồn của hai công ty. Trong vòng hai chu kỳ, hai mục mới xuất hiện trên dòng thời gian mà không ai bấm gì; Nhật ký vòng quét có dòng tổng kết cho từng vòng",
  9: "Bấm nút tắt toàn bộ phần AI trong lúc vòng quét đang chạy. Hai chu kỳ kế tiếp không thêm mục nào vào dòng thời gian, không sinh gợi ý, không tự đặt Việc tiếp theo; dữ liệu đã sinh còn nguyên; Sales thấy dòng thông báo đang tắt. Bật lại thì vòng quét chạy tiếp, cả hai lần bấm đều có ghi vết",
  10: "Thử đổi giai đoạn, đổi giá trị tiền và xoá một công ty dưới danh nghĩa hệ thống, không đi qua giao diện người dùng. Cả ba đều bị từ chối",
};

/// Bản chất mỗi luồng. Ba luồng KHÔNG phải thao tác trình duyệt, và nói trước là
/// chủ động — giám khảo kỹ thuật mở báo cáo ra sẽ tự thấy `T-2` không thể là một
/// luồng giao diện, vì chính §6 viết *"thử ghi thẳng"*.
const BAN_CHAT = {
  1: "Thao tác giao diện — kéo thả thật qua ba giai đoạn",
  2: "Kiểm tầng dưới — §6 viết “thử ghi thẳng”, cố ý không qua giao diện",
  3: "Thao tác giao diện",
  4: "Trạng thái dữ liệu sau ba chu kỳ, cộng đối chiếu trên giao diện",
  5: "Thao tác giao diện, cộng đối chiếu sổ ghi vết",
  6: "Trạng thái dữ liệu sau khi đổi bản chụp",
  7: "Thao tác giao diện — một cú bấm",
  8: "Vòng quét tự chạy, cộng đối chiếu trên giao diện",
  9: "Thao tác giao diện, hệ quả khẳng định ở cơ sở dữ liệu",
  10: "Kiểm tầng dưới — §6 viết “không đi qua giao diện người dùng”",
};

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const CSS = [
  ":root{color-scheme:light dark}",
  "*{box-sizing:border-box}",
  "body{margin:0;padding:32px 20px 64px;font:15px/1.6 system-ui,-apple-system,'Segoe UI',sans-serif;",
  "background:#f6f7f9;color:#16181d}",
  "@media(prefers-color-scheme:dark){body{background:#14161a;color:#e6e8ec}}",
  ".wrap{max-width:980px;margin:0 auto}",
  "h1{font-size:26px;margin:0 0 4px}",
  ".sub{opacity:.7;margin:0 0 24px;font-size:14px}",
  ".verdict{padding:14px 18px;border-radius:10px;font-weight:600;margin:0 0 28px}",
  ".pass{background:#e7f6ec;color:#0f5132;border:1px solid #a7d8b8}",
  ".fail{background:#fdeaea;color:#7a1c1c;border:1px solid #eaadad}",
  "@media(prefers-color-scheme:dark){.pass{background:#12301f;color:#8fe0ab;border-color:#2c5f3f}",
  ".fail{background:#39191a;color:#f0a5a5;border-color:#6d2f2f}}",
  ".card{background:#fff;border:1px solid #e2e5ea;border-radius:12px;padding:18px 20px;margin:0 0 14px}",
  "@media(prefers-color-scheme:dark){.card{background:#1c1f25;border-color:#2c313a}}",
  ".card.do{border-left:5px solid #d14343}",
  ".card.xanh{border-left:5px solid #2f9e5f}",
  ".head{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;margin-bottom:8px}",
  ".ma{font:600 17px ui-monospace,Menlo,Consolas,monospace}",
  ".ten{font-weight:600;font-size:16px}",
  ".chip{margin-left:auto;font-size:13px;font-weight:600;padding:3px 10px;border-radius:999px}",
  ".chip.xanh{background:#e7f6ec;color:#0f5132}.chip.do{background:#fdeaea;color:#7a1c1c}",
  "@media(prefers-color-scheme:dark){.chip.xanh{background:#12301f;color:#8fe0ab}",
  ".chip.do{background:#39191a;color:#f0a5a5}}",
  ".debai{margin:0 0 10px;padding-left:12px;border-left:3px solid #d7dbe2;opacity:.9;font-size:14px}",
  "@media(prefers-color-scheme:dark){.debai{border-color:#3a404b}}",
  ".meta{display:flex;gap:20px;flex-wrap:wrap;font-size:13px;opacity:.8}",
  "a{color:inherit}",
  "footer{margin-top:32px;font-size:13px;opacity:.7}",
].join("");

/// `bang` là mảng `[_, {unit:{pass,fail}, e2e:{pass,fail}}, …]` do `verify.mjs`
/// dựng. `thuMuc` là nơi ghi ra.
export function vietTrangDan({ bang, tCount, giay, thuMuc, doTong, trongTong }) {
  mkdirSync(thuMuc, { recursive: true });

  const dat = doTong === 0 && trongTong === 0;
  const the = [];
  for (let n = 1; n <= tCount; n += 1) {
    const r = bang[n];
    const do_ = r.unit.fail + r.e2e.fail;
    const xanh = r.unit.pass + r.e2e.pass;
    const coCa = do_ + xanh > 0;
    const lop = do_ > 0 ? "do" : coCa ? "xanh" : "do";
    const nhan = do_ > 0 ? `${do_} ĐỎ / ${xanh + do_} ca` : coCa ? `${xanh} ca xanh` : "CHƯA KIỂM";
    the.push(
      `<section class="card ${lop}">`,
      `<div class="head"><span class="ma">T-${n}</span>`,
      `<span class="ten">${esc(BAN_CHAT[n])}</span>`,
      `<span class="chip ${lop}">${esc(nhan)}</span></div>`,
      `<p class="debai">${esc(DE_BAI[n])}</p>`,
      `<div class="meta"><span>Tầng dưới: ${r.unit.pass} xanh, ${r.unit.fail} đỏ</span>`,
      `<span>Trình duyệt: ${r.e2e.pass} xanh, ${r.e2e.fail} đỏ</span></div>`,
      `</section>`,
    );
  }

  const html = [
    "<!doctype html>",
    '<html lang="vi"><head><meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1">',
    "<title>Bộ nghiệm thu §6 — T-1…T-10</title>",
    `<style>${CSS}</style></head><body><div class="wrap">`,
    "<h1>Bộ nghiệm thu §6 — mười điểm T-1…T-10</h1>",
    `<p class="sub">Sinh bởi <code>npm run verify</code> · ${giay}s`,
    " · mỗi thẻ mang <strong>nguyên văn</strong> điều kiện §6</p>",
    dat
      ? '<p class="verdict pass">✓ ĐẠT — cả mười điểm nghiệm thu đều xanh.</p>'
      : `<p class="verdict fail">✗ KHÔNG ĐẠT — ${doTong} điểm ĐỎ, ${trongTong} điểm chưa có phép kiểm nào.</p>`,
    ...the,
    "<footer>Vết chạy, ảnh chụp và nhật ký từng ca: ",
    '<a href="../playwright-report/index.html">playwright-report/index.html</a>',
    "<br>Ba luồng <code>T-2</code>, <code>T-10</code> và phần hệ quả của <code>T-9</code> ",
    "không phải thao tác trình duyệt — chính §6 viết như vậy; xem dòng <em>bản chất</em> của mỗi thẻ.",
    "</footer></div></body></html>",
  ].join("\n");

  const duong = join(thuMuc, "index.html");
  writeFileSync(duong, html, "utf8");
  return duong;
}
