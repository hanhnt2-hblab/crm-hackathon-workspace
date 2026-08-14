// T-3 — Bấm Phát hiện mở đúng đoạn văn gốc
//
// Đề bài §6, nguyên văn: *"Bấm vào một phát hiện thì mở đúng đoạn văn gốc trong
// bản lưu, có đánh dấu vị trí"*.
//
// ⚠⚠ ĐỌC TRƯỚC KHI TIN MÀU XANH CỦA TỆP NÀY.
// Bề mặt `S10` **Snapshot viewer** (`EXPERIENCE.md`: *"bấm một Signal ở bất cứ
// đâu"*, `FR-15` `FR-50`) **CHƯA TỒN TẠI** trong `src/app`: hôm nay chỉ có
// `accounts`, `board`, `admin`, `login`. (`S7` là **Watching list** — đừng trích
// nhầm.) Nên tệp này chứng minh
// được HỢP ĐỒNG DỮ LIỆU mà bề mặt ấy sẽ dùng — khoảng `[quote_start,
// quote_end)` cắt đúng câu trích trên chuỗi mà bề mặt hiển thị — và KHÔNG chứng
// minh được ba việc còn lại:
//   · **mở** Bản lưu khi bấm vào một Phát hiện (`C1-8`)
//   · **cuộn tới** vị trí
//   · **tô sáng** khoảng đó cho mắt người nhìn thấy
// Cả ba phải thử TAY, và cho tới khi `S10` có mặt thì `T-3` chưa đạt trước một
// giám khảo bấm thật. Không nới khẳng định ở đây để che chỗ đó.
//
// **Chuỗi nào là chuỗi được đánh chỉ số** là quyết định trung tâm của tệp:
// `AD-18` và chú thích cột `signal.quote_start` (`prisma/schema.prisma`) chốt
// **bản CHUẨN HOÁ**, và `createSignal` tính offset bằng `findQuote` trên
// `article.normalized_text`. Bộ dữ liệu dưới đây cố ý làm `raw_text` KHÁC
// `normalized_text` (CRLF, dấu cách kép, thụt đầu dòng) để phép kiểm phân biệt
// được hai chuỗi — nếu chúng bằng nhau thì mọi khẳng định đều xanh một cách
// vô nghĩa.
//
// ⚠ LỆCH TÀI LIỆU ĐÃ NÊU, KHÔNG TỰ CHỌN BÊN: `epics.md` mô tả `C5-10` là
// *"`findQuote` trả khoảng vị trí trên **văn bản gốc**, không trên bản đã chuẩn
// hoá"*, ngược với `AD-18`, với chú thích cột `signal.quote_start` của lược đồ,
// và với mã đang chạy. Chuỗi phân xử của `AD-13` (*đề bài > Mục 0 > PRD >
// ontology > lược đồ*) KHÔNG có `epics.md` mà cũng KHÔNG có spine, nên nó không
// phân xử được tranh chấp này — ba bên còn lại đồng ý với nhau, và phép kiểm bám
// theo đó. Câu của `C5-10` cần sửa ở thượng nguồn.
//
// ⚠ MỘT KHOẢNG HỞ ĐÃ ĐO, chưa ràng ở đây: `createSignal` lưu `quote` là chuỗi
// bên gọi đưa (thô), còn `quote_start`/`quote_end` là chỉ số của `normalize(quote)`
// trong bản chuẩn hoá. Hai thứ đó chỉ trùng khi câu trích ĐÃ chuẩn hoá sẵn — như
// bộ dữ liệu dưới đây. Mô hình trả một câu trích có dấu cách kép thì
// `normalizedText.slice(start, end) !== signal.quote`, và `S10` sẽ tô sáng một
// đoạn khác với chữ nó hiển thị. Đó là lỗi mã sản phẩm, đã nêu trong báo cáo;
// ca biên thuộc lớp kiểm dưới (`D36`), không trộn vào `T-n`.
//
// `D36`: `T-n` là lớp NGOÀI. Cục sở hữu thân: ①. Mốc: M2.

import { describe, it, expect, beforeAll } from "vitest";
import { existsSync, lstatSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { db } from "@/core/db";
import { createCompany } from "@/core/company";
import { createSignal } from "@/core/signal";
import { normalize, NORMALIZER_VERSION } from "@/core/normalize";
import type { Registry } from "@/capability/registry";
import {
  createArticle, createTestUser, mutedCtx, mutedRegistry, seeder, type TestUser,
} from "./_helpers";

/// CRLF + dấu cách kép + thụt đầu dòng: ba thứ mà `normalize` gỡ. Câu trích nằm
/// ở dòng THỨ HAI để offset khác 0 — một câu trích ở đầu bài cho `start === 0`,
/// và khi đó một cài đặt hỏng *luôn trả 0* vẫn xanh.
const BAI_THO =
  "Tin thị trường Nhật Bản\r\n" +
  "   Tomahawk Systems  vừa  mở văn phòng thứ hai tại Osaka trong tháng này.\r\n" +
  "Công ty cho biết sẽ tuyển thêm 40 kỹ sư.";

const CAU_TRICH = "mở văn phòng thứ hai tại Osaka";

let reg: Registry;
let sales: TestUser;
let accountId = "";
let articleId = "";
let signalId = "";
let banChuanHoa = "";

beforeAll(async () => {
  reg = mutedRegistry();
  sales = await createTestUser("t3");

  const acc = await createCompany(
    seeder,
    { name: `T-3 Co ${Date.now()}`, market: "JP" },
    mutedCtx,
  );
  accountId = acc.id;

  const article = await createArticle(accountId, BAI_THO);
  articleId = article.id;
  banChuanHoa = article.normalizedText;

  const signal = await createSignal(
    seeder,
    {
      accountId,
      articleId,
      claim: "Công ty vừa mở văn phòng thứ hai tại Osaka",
      quote: CAU_TRICH,
      // Cố ý SAI. Lõi phải bỏ qua và dùng giá trị nó tự tìm — xem `it` thứ hai.
      quoteStart: 999,
      quoteEnd: 999,
      signalType: "expansion",
      signalSubtype: null,
      confidence: "chac",
      relevance: "high",
      eventDate: null,
    },
    mutedCtx,
  );
  signalId = signal.id;
});

describe("T-3 — Bấm Phát hiện mở đúng đoạn văn gốc", () => {
  it("mở Bản lưu, cuộn tới vị trí, ĐÁNH DẤU khoảng câu trích", async () => {
    // Lớp ① — đường ĐỌC THẬT mà một bề mặt sẽ đi: capability `readArticle`
    // (`AD-2` hạng đọc-chung), không phải một truy vấn Prisma tự chế.
    // ⚠ Tham số là `{accountId, scope}`, KHÔNG phải `{id}`: mục này trả BẢN LƯU
    // MỚI NHẤT của một Công ty (`readArticleLatest`), vì đó là hình dạng mà
    // `src/scan` và `src/ingest` gọi thật. Bộ dữ liệu của tệp này chỉ có MỘT Bản
    // lưu, nên *mới nhất* và *bản lưu của Phát hiện* là một — vế `id` dưới đây
    // ghim đúng điều đó thay vì giả định nó.
    const doc = await reg.loadCapability("readArticle", sales.actor);
    const banLuu = (await doc({ accountId, scope: "latest" })) as {
      id: string; normalizedText: string; readable: boolean;
      unreadableReason: string | null; signalCount: number;
    } | null;
    expect(banLuu).not.toBeNull();
    expect(banLuu!.id).toBe(articleId);
    expect(banLuu!.readable).toBe(true);

    // Lớp ② — DỮ LIỆU: khoảng đã lưu cắt ĐÚNG câu trích trên chuỗi mà bề mặt
    // hiển thị. Đây là toàn bộ thứ *"đánh dấu vị trí"* cần từ tầng dưới: một cặp
    // số cắt được, và một chuỗi để cắt.
    const phatHien = await db.signal.findUniqueOrThrow({
      where: { id: signalId },
      select: { quote: true, quoteStart: true, quoteEnd: true, articleId: true },
    });
    expect(phatHien.articleId).toBe(articleId);
    expect(banLuu!.normalizedText.slice(phatHien.quoteStart, phatHien.quoteEnd))
      .toBe(phatHien.quote);
    // Không suy biến: khoảng nằm giữa bài, không phải `{0,0}`.
    expect(phatHien.quoteStart).toBeGreaterThan(0);
    expect(phatHien.quoteEnd).toBeGreaterThan(phatHien.quoteStart);

    // `AD-18` — chuỗi được đánh chỉ số là bản CHUẨN HOÁ, không phải `raw_text`.
    // Bộ dữ liệu làm hai chuỗi khác nhau, nên vế này thật sự phân biệt được.
    const tho = await db.article.findUniqueOrThrow({
      where: { id: articleId },
      select: { rawText: true, normalizedText: true, normalizerVersion: true },
    });
    expect(tho.rawText).not.toBe(tho.normalizedText);
    expect(tho.normalizedText).toBe(banChuanHoa);
    expect(tho.rawText.slice(phatHien.quoteStart, phatHien.quoteEnd))
      .not.toBe(phatHien.quote);
    // Phiên bản chuẩn hoá đi kèm: đổi hàm chuẩn hoá mà không tăng nó là làm mọi
    // offset cũ trôi trong im lặng (`AD-18`). So với HẰNG SỐ, không với số `1`:
    // gõ số cứng thì đúng kịch bản ấy vẫn xanh.
    expect(tho.normalizerVersion).toBe(NORMALIZER_VERSION);

    // Lớp ③ — ĐỐI CHỨNG: không có Phát hiện nào mở ra một khoảng trống. Câu
    // trích không khớp nguyên văn thì bị LOẠI ở lõi (`BR-D2`), không lưu kèm cờ
    // cảnh báo — vì một hàng như thế chính là thứ `T-3` sẽ mở ra sai chỗ.
    await expect(
      createSignal(
        seeder,
        {
          accountId, articleId,
          claim: "Câu trích bịa",
          quote: "mở văn phòng thứ ba tại Osaka",
          quoteStart: 0, quoteEnd: 0,
          signalType: "expansion", signalSubtype: null,
          confidence: "chac", relevance: "high", eventDate: null,
        },
        mutedCtx,
      ),
    ).rejects.toMatchObject({ code: "BR-D2" });
    expect(await db.signal.count({ where: { accountId } })).toBe(1);
  });

  it("vị trí lấy từ `quote_start`/`quote_end` đã lưu, không tính lại ở giao diện", async () => {
    // Vế ①: giá trị ĐÃ LƯU là giá trị LÕI TỰ TÍNH. `beforeAll` đưa vào cặp
    // `999/999`; lõi bỏ qua nó (`src/core/signal/index.ts` — *"tin bên gọi ở đây
    // là mở một đường để `T-3` mở sai đoạn"*).
    const daLuu = await db.signal.findUniqueOrThrow({
      where: { id: signalId },
      select: { quote: true, quoteStart: true, quoteEnd: true },
    });
    expect(daLuu.quoteStart).not.toBe(999);
    expect(daLuu.quoteEnd).not.toBe(999);
    expect(daLuu.quoteStart).toBe(banChuanHoa.indexOf(CAU_TRICH));
    expect(daLuu.quoteEnd - daLuu.quoteStart).toBe(CAU_TRICH.length);

    // Vế ②: chuẩn hoá LUỸ ĐẲNG, nên hai lượt đọc cho cùng một khoảng. Mất tính
    // này thì offset của một Phát hiện cũ trôi mà không ai biết (`C5-10`).
    expect(normalize(banChuanHoa)).toBe(banChuanHoa);

    // Vế ③ — *"không tính lại ở giao diện"*, khẳng định trên MÃ NGUỒN.
    //
    // ⚠ Hôm nay vế này còn RỖNG về nội dung: `src/app` chưa có bề mặt Bản lưu
    // nào (xem cảnh báo đầu tệp), nên nó chưa loại trừ được gì. Nó là một chốt
    // CHẶN THOÁI LUI: người dựng `S10` sau này mà gọi `findQuote` hay `normalize`
    // ở tầng ① sẽ làm tệp này đỏ ngay, thay vì để giao diện tự tính một khoảng
    // thứ hai lệch với khoảng đã lưu.
    //
    // ⚠ NÓ KHÔNG BẮT ĐƯỢC cách tính lại phổ biến nhất: `normalizedText.indexOf(
    // quote)` viết tay, vốn không nhắc tên hàm nào. Chốt này hẹp hơn điều nó
    // mang tên, và đó là giới hạn đã biết — không phải một lời hứa.
    const viPham: string[] = [];
    for (const { file, text } of tepTangMotDuoi("src/app")) {
      // Bắt cả `@/core/normalize` lẫn nhập tương đối `../../core/normalize`.
      if (/\bfindQuote\b|core\/normalize/.test(text)) viPham.push(file);
    }
    expect(viPham).toEqual([]);
  });
});

/// Đọc đệ quy mọi tệp `.ts`/`.tsx` dưới một thư mục.
///
/// `lstatSync` chứ không `statSync`: một liên kết tượng trưng trỏ vòng lại sẽ
/// làm `statSync` đi mãi. `throwIfNoEntry: false` để một liên kết hỏng thành
/// *bỏ qua* thay vì thành một lần ném — phép kiểm phải đỏ vì VI PHẠM, không vì
/// hệ tệp.
function tepTangMotDuoi(goc: string): Array<{ file: string; text: string }> {
  const ra: Array<{ file: string; text: string }> = [];
  const di = (thuMuc: string): void => {
    for (const ten of readdirSync(thuMuc)) {
      const duong = join(thuMuc, ten);
      const st = lstatSync(duong, { throwIfNoEntry: false });
      if (!st || st.isSymbolicLink()) continue;
      if (st.isDirectory()) {
        di(duong);
      } else if (/\.tsx?$/.test(ten)) {
        ra.push({ file: duong, text: readFileSync(duong, "utf8") });
      }
    }
  };
  const duongGoc = join(process.cwd(), goc);
  // Thư mục vắng mặt là một sự thật đáng biết, không phải một lần ném ENOENT.
  if (!existsSync(duongGoc)) {
    throw new Error(`Không có thư mục \`${goc}\` — chốt chặn thoái lui mất đối tượng.`);
  }
  di(duongGoc);
  return ra;
}
