"use server";

// Luật thi `3.1` — server action nhận tệp zip và giải nén.
//
// ⚠ GIẢI NÉN Ở ĐÂY, KHÔNG Ở TẦNG ④. `AD-1` đặt mọi thứ biết về định dạng vận
// chuyển ở tầng ①; capability nhận dữ liệu ĐÃ giải nén. Đẩy `Uint8Array` của
// một tệp zip xuống tầng ④ là bắt nó biết một định dạng nén, và khi BTC đổi
// sang `.tar.gz` thì chỗ phải sửa nằm sai tầng.

import { revalidatePath } from "next/cache";
import { unzipSync, strFromU8 } from "fflate";
import { action, type ActionState } from "../_contract";
import { appRegistry } from "../_registry";
import { currentSession } from "../_session";

/// Tên ba tệp CSV, so KHÔNG phân biệt hoa thường và bỏ qua thư mục bọc.
///
/// ⚠ Zip của BTC bọc mọi thứ trong một thư mục (`hackathon-1-data/…`) và macOS
/// nhét thêm `__MACOSX/`. So bằng đường dẫn đầy đủ thì không tệp nào khớp và
/// lượt nạp báo *"thiếu Account.csv"* trong khi nó nằm ngay đó.
function tenTep(duong: string): string {
  const p = duong.split("/").pop() ?? duong;
  return p.toLowerCase();
}

/// macOS gói kèm `__MACOSX/._<tên>` cho mọi tệp — chúng là siêu dữ liệu nhị
/// phân, không phải nội dung. Không lọc thì mỗi Bản chụp có một bản sao rác.
function laRac(duong: string): boolean {
  return duong.startsWith("__MACOSX/")
    || duong.includes("/._")
    || tenTep(duong).startsWith("._")
    || tenTep(duong) === ".ds_store";
}

export const importZipAction = action(async (form): Promise<ActionState> => {
  const file = form.get("dataset");
  if (!(file instanceof File) || file.size === 0) {
    // ⚠ `"unexpected"` là mã DUY NHẤT dùng được, và nó không mô tả đúng ca này.
    //
    // `ActionState` khai từ vựng ĐÓNG: `BusinessRuleCode | GateDenyReason |
    // "unexpected"`. Ba lỗi của lượt nạp — chưa chọn tệp, không giải nén được,
    // thiếu CSV — không phải vi phạm luật nghiệp vụ nào và cũng không phải
    // quyết định của Cổng; chúng là lỗi HÌNH DẠNG ĐẦU VÀO, một hạng mà từ vựng
    // chưa có. Bịa một `BR-D*` ở đây là dựng nguồn sự thật thứ hai cho một mã
    // mà lõi sở hữu, nên tôi dùng `"unexpected"` và nói ra chỗ thiếu.
    return { ok: false, code: "unexpected", message: "Chưa chọn tệp. Chọn tệp `.zip` do Ban tổ chức phát." };
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  let giaiNen: Record<string, Uint8Array>;
  try {
    giaiNen = unzipSync(bytes);
  } catch {
    return {
      ok: false,
      code: "unexpected",
      message: "Không giải nén được tệp. Kiểm lại xem đúng là tệp `.zip` chưa "
        + "(tệp `.rar` hay `.7z` sẽ hỏng ở bước này).",
    };
  }

  const csv = new Map<string, string>();
  const snapshots: { name: string; html: string }[] = [];
  for (const [duong, noiDung] of Object.entries(giaiNen)) {
    if (laRac(duong) || duong.endsWith("/")) continue;
    const ten = tenTep(duong);
    if (ten.endsWith(".csv")) csv.set(ten, strFromU8(noiDung));
    else if (ten.endsWith(".html") || ten.endsWith(".htm")) {
      snapshots.push({ name: ten, html: strFromU8(noiDung) });
    }
  }

  const thieu = ["account.csv", "contacts.csv", "opps.csv"].filter((t) => !csv.has(t));
  if (thieu.length > 0) {
    return {
      ok: false,
      code: "unexpected",
      // Nói ra thứ TÌM THẤY, không chỉ thứ thiếu: người chấm cầm nhầm zip sẽ
      // biết ngay, thay vì đoán xem tên tệp phải viết hoa thế nào.
      message: `Thiếu ${thieu.join(", ")}. Trong tệp có: `
        + ([...csv.keys()].join(", ") || "không có tệp .csv nào") + ".",
    };
  }

  const nap = await appRegistry.loadCapability("importDataset", (await currentSession()).actor);
  const rep = (await nap({
    accounts: csv.get("account.csv"),
    contacts: csv.get("contacts.csv"),
    opportunities: csv.get("opps.csv"),
    snapshots,
  })) as {
    users: number; accounts: number; contacts: number; opportunities: number;
    snapshots: number;
    skipped: { what: string; reason: string }[];
    unmapped: { field: string; value: string; count: number }[];
  };

  // Mọi bề mặt đọc dữ liệu này, nên làm mới cả cây (`AD-UI-9` — chỉ sau một
  // thao tác của NGƯỜI, và đây đúng là một).
  revalidatePath("/", "layout");

  const phan = [
    `${rep.users} người phụ trách`,
    `${rep.accounts} Công ty`,
    `${rep.contacts} Người liên hệ`,
    `${rep.opportunities} Cơ hội`,
    `${rep.snapshots} Bản lưu`,
  ].join(" · ");
  const bo = rep.skipped.length > 0 ? ` — bỏ qua ${rep.skipped.length} mục` : "";
  const la = rep.unmapped.length > 0
    ? ` — ${rep.unmapped.reduce((n, u) => n + u.count, 0)} ô không ánh xạ được, để trống`
    : "";

  return { ok: true, message: `Đã nạp: ${phan}${bo}${la}.` };
});
