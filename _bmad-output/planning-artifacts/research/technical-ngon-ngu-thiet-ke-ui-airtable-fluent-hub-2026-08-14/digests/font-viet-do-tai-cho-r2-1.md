# Digest — kiểm glyph tiếng Việt bằng cách đọc thẳng bảng cmap của file font

Vòng 1 để lại một lỗ hổng: **Segoe UI Variable không kiểm được** vì font này không phát hành qua
Google Fonts nên không có kênh xác minh tương đương. Lỗ hổng này lấp được **tại chỗ, không cần mạng** —
file font nằm sẵn trong `C:\Windows\Fonts\`.

**Phương pháp:** đọc bảng `cmap` của chính file `.ttf` bằng `fontTools`, đếm số code point hiện diện
trong khối Latin Extended Additional `U+1EA0–U+1EF9` (90 code point — đây là khối chứa toàn bộ chữ
Việt có dấu chồng dấu), và kiểm riêng chín chữ khó nhất.

Đây là **phép đo trực tiếp trên tệp nhị phân**, không phải đọc tài liệu. Độ tin **cao nhất** trong
cả run: không có khâu trung gian nào để sai.

- nguồn: `C:\Windows\Fonts\SegUIVar.ttf`, `segoeui.ttf`, `seguisb.ttf` (đọc bảng cmap)
- nhà xuất bản: Microsoft (font cài sẵn trong Windows 11)
- ngày xuất bản: theo bản Windows trên máy — không đọc phiên bản font trong lần chạy này
- truy cập: 2026-08-14
- độ tin: cao
- lớp: font-viet

---

### Segoe UI Variable có đủ toàn bộ 90/90 glyph khối U+1EA0–U+1EF9
Chín chữ khó đã kiểm riêng đều có mặt: ế (U+1EBF) · ộ (U+1ED9) · ữ (U+1EEF) · ẳ (U+1EB3) ·
ợ (U+1EE3) · ẵ (U+1EB5) · ạ (U+1EA1) · ư (U+01B0) · đ (U+0111).
- độ tin: cao
- lớp: font-viet

### Segoe UI (tĩnh) cũng đủ 90/90, và Segoe UI Semibold cũng vậy
Nghĩa là cả họ Segoe trên Windows an toàn với tiếng Việt, không riêng bản variable.
- độ tin: cao
- lớp: font-viet

---

## Điều phép đo này **không** chứng minh

Font có glyph **không** đồng nghĩa với việc người dùng sẽ thấy nó. Segoe UI là font hệ điều hành
Windows: một máy macOS, Linux hay Android **không có nó**, và trình duyệt sẽ rơi xuống font kế tiếp
trong chuỗi `font-family`. Nên kết luận đúng là:

- Trên **Windows**, đặt Segoe UI ở đầu chuỗi là an toàn với tiếng Việt. ✔
- Trên **nền tảng khác**, chuỗi dự phòng mới là thứ quyết định, và nó phải tự nó an toàn.
- Muốn kết quả **giống nhau trên mọi máy** thì phải nạp webfont, và khi đó câu hỏi quay về
  danh sách Google Fonts đã kiểm ở vòng 1.

Chưa kiểm trong lần chạy này: chất lượng **dựng hình** của dấu (glyph tồn tại không có nghĩa dấu đặt
đẹp ở mọi cỡ chữ) và các font hệ của macOS/Linux.

## Manh mối đáng đuổi tiếp

- Đọc phiên bản font (`name` table, bản ghi 5) để biết bản Segoe UI Variable trên máy này là bản nào —
  glyph coverage có thể khác giữa các bản Windows.
- Kiểm cùng cách với font hệ của macOS (SF Pro) nếu cần bảo đảm đa nền tảng.

## Thứ tôi đã tìm mà không thấy

- Không có. Câu hỏi đặt ra đã được trả lời dứt điểm bằng phép đo.
