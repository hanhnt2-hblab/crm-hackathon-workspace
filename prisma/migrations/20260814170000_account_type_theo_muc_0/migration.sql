-- `AD-13` — Mục 0 §0.1.1 đứng TRÊN lược đồ, nên lược đồ là chỗ sai.
--
-- Mục 0 khai `tech_based` và `ito_other`; migration đầu tiên khai `tech_startup`
-- và `ito`. Cùng số giá trị, cùng vị trí, khác chữ — nên đây là ĐỔI TÊN thuần,
-- không phải đổi tập giá trị.
--
-- ⚠ `RENAME VALUE` chứ không phải dựng lại kiểu. Dựng lại là phải bỏ mặc định,
-- đổi kiểu cột, chuyển dữ liệu, rồi đặt lại — bốn bước, mỗi bước một chỗ hỏng,
-- và mất toàn bộ hàng `account` đang có nếu bước chuyển đổi lệch. `RENAME VALUE`
-- giữ nguyên mọi hàng và mọi ràng buộc.
--
-- Triệu chứng của việc để lệch: `searchCompanies` lọc theo chữ Mục 0 trả về
-- danh sách RỖNG mà không báo lỗi — Prisma coi giá trị ngoài từ vựng là không
-- khớp, không phải là sai. Một bộ lọc im lặng trả rỗng là thứ người dùng đọc
-- thành *"không có công ty nào"*.

ALTER TYPE "AccountType" RENAME VALUE 'tech_startup' TO 'tech_based';
ALTER TYPE "AccountType" RENAME VALUE 'ito' TO 'ito_other';
