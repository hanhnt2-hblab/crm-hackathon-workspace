// Đọc `FormData` — ba hàm, dùng trong server action của `src/app`.
//
// ⚠ KHÔNG kiểm hợp lệ ở đây, và đó là quyết định: lược đồ Zod của capability là
// nơi DUY NHẤT canh tham số (`AD-CP-5` bước ⑤). Thêm một lớp kiểm ở đây là hai
// nguồn sự thật cho cùng một luật, và lớp trên sẽ trôi khỏi lớp dưới. Ba hàm
// này chỉ làm một việc: đổi `FormDataEntryValue | null` thành thứ Zod nhận.
//
// `AD-UI-2` không cấm tệp này: nó cấm module dùng chung **giữa ba nhánh**
// (`src/app`, `src/scan`, `src/ingest`). Đây là tệp trong `src/app`, và nó
// không bọc `loadCapability` — không nhánh nào khác nhập nó.

/// Ô bắt buộc → chuỗi đã cắt khoảng trắng. Rỗng thành chuỗi rỗng, và Zod bác
/// nó ở `min(1)` cùng một thông điệp với mọi ô rỗng khác.
export function text(form: FormData, key: string): string {
  const v = form.get(key);
  return typeof v === "string" ? v.trim() : "";
}

/// Ô tuỳ chọn → `null` khi để trống. `null` chứ không phải `""`: cột nullable
/// mang `""` là một giá trị *đã điền, rỗng*, và mọi bộ lọc `is null` sau đó
/// trượt mất hàng đó.
export function optionalText(form: FormData, key: string): string | null {
  const v = text(form, key);
  return v === "" ? null : v;
}

/// Ô đánh dấu. HTML chỉ gửi ô ĐÃ tick, nên vắng mặt là `false`.
export function checkbox(form: FormData, key: string): boolean {
  return form.get(key) !== null;
}
