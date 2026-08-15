-- Luật thi `3.2` (15/08) — bảng `user` chưa có chỗ nào chứa mật khẩu.
--
-- ⚠ `ADD COLUMN`, KHÔNG dựng lại bảng. `prisma migrate deploy` chạy trên CSDL
-- demo ĐANG CÓ DỮ LIỆU của giám khảo; dựng lại bảng `user` là phải bỏ ba khoá
-- ngoại trỏ vào nó (`account.owner_id`, `audit_record.actor_user_id`), chuyển
-- dữ liệu, rồi đặt lại — bốn bước, mỗi bước một chỗ hỏng, và mất phiên đăng
-- nhập của mọi người đang mở máy. `ADD COLUMN` giữ nguyên mọi hàng và mọi ràng
-- buộc, và khoá bảng trong vài mili giây (PostgreSQL 11+ không viết lại bảng
-- cho một `ADD COLUMN` có mặc định là hằng số).
--
-- ⚠ NULLABLE là bắt buộc, không phải sở thích: `tests/**` và `e2e/**` tạo user
-- bằng `db.user.create({ data: { email, display_name, role } })` — không truyền
-- cột này. `NOT NULL` không mặc định làm mọi phép kiểm đó đỏ cùng lúc.
--
-- Giá trị mặc định là băm `scrypt` của mật khẩu demo dùng chung mà luật thi
-- công bố. KHÔNG lưu chữ thô ở bất kỳ đâu — kể cả ở đây, kể cả khi ai cũng biết
-- nó là gì. Chuỗi này phải khớp TỪNG KÝ TỰ với `DEMO_PASSWORD_HASH` ở
-- `src/capability/caps/auth-ui.ts`; hai chỗ, một hằng số, và mỗi chỗ trỏ sang
-- chỗ kia.
--
-- Vì sao vừa `DEFAULT` vừa một câu `UPDATE`: `DEFAULT` chỉ áp cho hàng CHÈN SAU
-- lệnh này. PostgreSQL điền mặc định cho hàng cũ khi thêm cột, nhưng chỉ khi cột
-- được thêm KÈM mặc định trong cùng câu lệnh — nên câu `UPDATE` bên dưới là lớp
-- thứ hai, và nó cũng phủ được ca cột đã tồn tại từ một lần chạy dở.

ALTER TABLE "user"
  ADD COLUMN IF NOT EXISTS "password_hash" TEXT
  DEFAULT 'scrypt$16384$8$1$1ea50557cd250c0bde5cd56c2c9dd75f$fdbe9b345b850748d2ac8153a240e553c67f2c5a911c596b36c259b734e5acb9';

UPDATE "user"
   SET "password_hash" = 'scrypt$16384$8$1$1ea50557cd250c0bde5cd56c2c9dd75f$fdbe9b345b850748d2ac8153a240e553c67f2c5a911c596b36c259b734e5acb9'
 WHERE "password_hash" IS NULL;

-- ─────────────────────────────────────────────────────────────────────────────
-- Luật thi `3.3` — `opportunity.owner_id`. Đi CHUNG migration này chứ không đứng
-- riêng: `prisma/schema.prisma` có đúng một chủ sở hữu, và hai migration liên
-- tiếp trên cùng một tệp lược đồ là hai lần khoá bảng cho một lần thay đổi.
--
-- ⚠ VÌ SAO KHÔNG SUY QUA `account.owner_id`. Đã đo trên bộ dữ liệu thật:
-- `Opps.csv` mang cột `sales_owner` RIÊNG cho từng Cơ hội, và phân bố là
-- `Demo=8 · Thảo=3 · Vân=3 · Phúc=3 · Linh=3 · Huệ=3` trên 23 Cơ hội. `Demo` giữ
-- **8 trên 23** mà không phụ trách Công ty nào. Suy qua Công ty thì tám Cơ hội
-- ấy bị gán cho Sales chủ Công ty tương ứng — bộ lọc theo Sales sai ở hơn một
-- phần ba số Cơ hội, và người chấm cộng các phần lại là thấy không ra tổng.
--
-- Cùng hình dạng với `account.owner_id`: NULLABLE, `ADD COLUMN`, `ON DELETE SET
-- NULL`. Nullable vì đây là định tuyến việc, không phải phân quyền — một Cơ hội
-- chưa có chủ vẫn phải tồn tại và vẫn phải nhìn thấy được.

ALTER TABLE "opportunity" ADD COLUMN IF NOT EXISTS "owner_id" UUID;

-- `IF NOT EXISTS` không có cho `ADD CONSTRAINT`, nên bọc bằng một khối canh
-- `pg_constraint`: lượt chạy lại trên một CSDL đã áp một phần sẽ không đỏ.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'opportunity_owner_id_fkey'
  ) THEN
    ALTER TABLE "opportunity"
      ADD CONSTRAINT "opportunity_owner_id_fkey"
      FOREIGN KEY ("owner_id") REFERENCES "user"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END
$$;

-- Bộ lọc theo Sales của `3.3` quét đúng cột này, nên nó cần một chỉ mục.
CREATE INDEX IF NOT EXISTS "opportunity_owner_id_idx" ON "opportunity" ("owner_id");
