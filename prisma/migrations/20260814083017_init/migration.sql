-- CreateEnum
CREATE TYPE "Stage" AS ENUM ('tiep_can', 'du_dieu_kien', 'soan_de_xuat', 'thuong_luong', 'thang', 'thua', 'tam_dung');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('traditional', 'it_solution', 'it_product', 'tech_startup', 'ito');

-- CreateEnum
CREATE TYPE "SignalType" AS ENUM ('funding', 'leadership', 'expansion', 'hiring', 'new_business', 'other');

-- CreateEnum
CREATE TYPE "Confidence" AS ENUM ('chac', 'co_the', 'doan');

-- CreateEnum
CREATE TYPE "Relevance" AS ENUM ('high', 'medium', 'low');

-- CreateEnum
CREATE TYPE "DropReason" AS ENUM ('thong_tin_sai', 'khong_lien_quan', 'da_cu', 'hieu_sai_ngu_canh', 'khac');

-- CreateEnum
CREATE TYPE "SystemCloseReason" AS ENUM ('co_goi_y_moi_hon', 'cong_ty_da_xoa');

-- CreateEnum
CREATE TYPE "SuggestionStatus" AS ENUM ('cho', 'duyet', 'sua_roi_duyet', 'bo', 'dong_he_thong');

-- CreateEnum
CREATE TYPE "TargetField" AS ENUM ('website', 'country', 'specialty_area', 'revenue_range', 'industry', 'deal_value_tier', 'founded_year', 'account_type');

-- CreateEnum
CREATE TYPE "Market" AS ENUM ('JP', 'Global', 'KR');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('sales', 'admin');

-- CreateEnum
CREATE TYPE "SetBy" AS ENUM ('nguoi', 'he_thong');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('gap', 'goi', 'gui_thu', 'khac');

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "source_ref" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "industry" TEXT,
    "account_type" "AccountType",
    "market" "Market" NOT NULL,
    "country" TEXT,
    "website" TEXT,
    "specialty_area" TEXT,
    "revenue_range" TEXT,
    "deal_value_tier" TEXT,
    "founded_year" INTEGER,
    "watching" BOOLEAN NOT NULL DEFAULT false,
    "watch_reason" TEXT,
    "owner_id" UUID,
    "source_ref" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact" (
    "id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "email" TEXT,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "source_ref" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opportunity" (
    "id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(14,2),
    "currency" CHAR(3),
    "expected_close_month" TEXT,
    "stage" "Stage" NOT NULL,
    "latest_open_stage" "Stage",
    "loss_reasons" TEXT[],
    "loss_note" TEXT,
    "need_signal" BOOLEAN,
    "budget_signal" BOOLEAN,
    "source_ref" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "opportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "next_action" (
    "id" UUID NOT NULL,
    "opportunity_id" UUID NOT NULL,
    "content" TEXT,
    "due_date" DATE,
    "next_action_set_by" "SetBy" NOT NULL,
    "undo_deadline_at" TIMESTAMPTZ(6),
    "source_signal_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "next_action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity" (
    "id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "opportunity_id" UUID,
    "contact_id" UUID,
    "occurred_at" TIMESTAMPTZ(6) NOT NULL,
    "type" "ActivityType" NOT NULL,
    "description" TEXT,
    "source_ref" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeline" (
    "id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "timeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeline_entry" (
    "id" UUID NOT NULL,
    "timeline_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "occurred_at" TIMESTAMPTZ(6) NOT NULL,
    "added_by" "SetBy" NOT NULL,
    "source_signal_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "timeline_entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "snapshot" (
    "id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "version" TEXT NOT NULL,
    "captured_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article" (
    "id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "snapshot_id" UUID NOT NULL,
    "raw_text" TEXT NOT NULL,
    "normalized_text" TEXT NOT NULL,
    "normalizer_version" INTEGER NOT NULL DEFAULT 1,
    "published_url" TEXT,
    "read_at" TIMESTAMPTZ(6) NOT NULL,
    "readable" BOOLEAN NOT NULL DEFAULT true,
    "unreadable_reason" TEXT,
    "content_hash" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "signal" (
    "id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "article_id" UUID NOT NULL,
    "claim" TEXT NOT NULL,
    "signal_type" "SignalType" NOT NULL,
    "signal_subtype" TEXT,
    "quote" TEXT NOT NULL,
    "quote_start" INTEGER NOT NULL,
    "quote_end" INTEGER NOT NULL,
    "confidence" "Confidence" NOT NULL,
    "relevance" "Relevance" NOT NULL,
    "event_date" DATE,
    "marked_unhelpful_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "signal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suggestion" (
    "id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "signal_id" UUID NOT NULL,
    "target_field" "TargetField",
    "current_value" TEXT,
    "proposed_value" TEXT,
    "timeline_text" TEXT,
    "status" "SuggestionStatus" NOT NULL DEFAULT 'cho',
    "drop_reason" "DropReason",
    "system_close_reason" "SystemCloseReason",
    "decision_seconds" INTEGER,
    "decided_at" TIMESTAMPTZ(6),
    "decided_by" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "suggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "opportunity_id" UUID,
    "kind" TEXT NOT NULL,
    "payload" JSONB,
    "seen_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "settings_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "account_lock" (
    "account_id" UUID NOT NULL,
    "process_id" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "account_lock_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "inference_cache" (
    "hash" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "inference_cache_pkey" PRIMARY KEY ("hash")
);

-- CreateTable
CREATE TABLE "scan_log" (
    "id" UUID NOT NULL,
    "started_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMPTZ(6),
    "model_calls_used" INTEGER NOT NULL DEFAULT 0,
    "budget_usd" DECIMAL(14,4) NOT NULL,
    "cost_used_usd" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "stop_reason" TEXT,
    "resume_cursor" UUID,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "scan_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scan_log_entry" (
    "id" UUID NOT NULL,
    "scan_log_id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "cost_usd" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "signal_count" INTEGER NOT NULL DEFAULT 0,
    "failure_code" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "scan_log_entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_record" (
    "id" UUID NOT NULL,
    "account_id" UUID,
    "actor_kind" TEXT NOT NULL,
    "actor_user_id" UUID,
    "actor_role" "Role",
    "capability" TEXT NOT NULL,
    "zone" TEXT NOT NULL,
    "risk" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "deny_reason" TEXT,
    "caused_by" TEXT,
    "outcome" TEXT,
    "value_before" JSONB,
    "value_after" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "audit_record_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_source_ref_key" ON "user"("source_ref");

-- CreateIndex
CREATE UNIQUE INDEX "account_source_ref_key" ON "account"("source_ref");

-- CreateIndex
CREATE INDEX "account_watching_idx" ON "account"("watching");

-- CreateIndex
CREATE UNIQUE INDEX "contact_source_ref_key" ON "contact"("source_ref");

-- CreateIndex
CREATE INDEX "contact_account_id_idx" ON "contact"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "opportunity_source_ref_key" ON "opportunity"("source_ref");

-- CreateIndex
CREATE INDEX "opportunity_account_id_idx" ON "opportunity"("account_id");

-- CreateIndex
CREATE INDEX "opportunity_stage_idx" ON "opportunity"("stage");

-- CreateIndex
-- Chỉ mục duy nhất của `next_action` nằm ở khối viết tay cuối tệp
-- (`next_action_one_active`), KHÔNG ở đây: bản do Prisma sinh thiếu vế
-- `WHERE deleted_at IS NULL`.

-- CreateIndex
CREATE UNIQUE INDEX "activity_source_ref_key" ON "activity"("source_ref");

-- CreateIndex
CREATE INDEX "activity_account_id_idx" ON "activity"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "timeline_account_id_key" ON "timeline"("account_id");

-- CreateIndex
CREATE INDEX "timeline_entry_timeline_id_idx" ON "timeline_entry"("timeline_id");

-- CreateIndex
CREATE INDEX "snapshot_account_id_idx" ON "snapshot"("account_id");

-- CreateIndex
CREATE INDEX "article_account_id_idx" ON "article"("account_id");

-- CreateIndex
CREATE INDEX "article_content_hash_idx" ON "article"("content_hash");

-- CreateIndex
CREATE INDEX "signal_account_id_idx" ON "signal"("account_id");

-- CreateIndex
CREATE INDEX "signal_article_id_idx" ON "signal"("article_id");

-- CreateIndex
CREATE INDEX "suggestion_account_id_status_idx" ON "suggestion"("account_id", "status");

-- CreateIndex
CREATE INDEX "suggestion_signal_id_idx" ON "suggestion"("signal_id");

-- CreateIndex
CREATE INDEX "notification_account_id_seen_at_idx" ON "notification"("account_id", "seen_at");

-- CreateIndex
CREATE INDEX "account_lock_expires_at_idx" ON "account_lock"("expires_at");

-- CreateIndex
CREATE INDEX "inference_cache_expires_at_idx" ON "inference_cache"("expires_at");

-- CreateIndex
CREATE INDEX "scan_log_entry_scan_log_id_idx" ON "scan_log_entry"("scan_log_id");

-- CreateIndex
CREATE INDEX "audit_record_account_id_idx" ON "audit_record"("account_id");

-- CreateIndex
CREATE INDEX "audit_record_created_at_idx" ON "audit_record"("created_at");

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact" ADD CONSTRAINT "contact_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunity" ADD CONSTRAINT "opportunity_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "next_action" ADD CONSTRAINT "next_action_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "opportunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "next_action" ADD CONSTRAINT "next_action_source_signal_id_fkey" FOREIGN KEY ("source_signal_id") REFERENCES "signal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "opportunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeline" ADD CONSTRAINT "timeline_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeline_entry" ADD CONSTRAINT "timeline_entry_timeline_id_fkey" FOREIGN KEY ("timeline_id") REFERENCES "timeline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeline_entry" ADD CONSTRAINT "timeline_entry_source_signal_id_fkey" FOREIGN KEY ("source_signal_id") REFERENCES "signal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "snapshot" ADD CONSTRAINT "snapshot_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article" ADD CONSTRAINT "article_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article" ADD CONSTRAINT "article_snapshot_id_fkey" FOREIGN KEY ("snapshot_id") REFERENCES "snapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "signal" ADD CONSTRAINT "signal_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "signal" ADD CONSTRAINT "signal_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suggestion" ADD CONSTRAINT "suggestion_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suggestion" ADD CONSTRAINT "suggestion_signal_id_fkey" FOREIGN KEY ("signal_id") REFERENCES "signal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "opportunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_lock" ADD CONSTRAINT "account_lock_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scan_log_entry" ADD CONSTRAINT "scan_log_entry_scan_log_id_fkey" FOREIGN KEY ("scan_log_id") REFERENCES "scan_log"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scan_log_entry" ADD CONSTRAINT "scan_log_entry_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_record" ADD CONSTRAINT "audit_record_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_record" ADD CONSTRAINT "audit_record_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ═══════════════════════════════════════════════════════════════════════
-- VIẾT TAY — Prisma không diễn đạt được. `AD-CR-11`.
-- Nếu ai chạy `migrate dev` sinh migration mới đè lên, mấy dòng này BIẾN MẤT
-- mà không có gì đỏ, cho tới lúc hai Gợi ý mâu thuẫn nằm cạnh nhau trước mặt
-- giám khảo. Phép kiểm hành vi ở `tests/` (chèn hai hàng, đợi lỗi) là thứ bắt
-- được điều đó, không phải migration.
-- ═══════════════════════════════════════════════════════════════════════

-- `AD-22`: MỘT Gợi ý chờ mỗi ô. Ba vế, thiếu vế nào cũng hỏng:
--   · status='cho'        — Gợi ý đã quyết không giữ chỗ
--   · deleted_at IS NULL  — thiếu thì một Gợi ý đã xoá mềm khoá VĨNH VIỄN ô đó
--   · target_field NULL không tham gia (Postgres coi NULL là phân biệt), nên
--     nhiều Gợi ý "thêm tin mới" cùng tồn tại — đúng ý `FR-51`, vốn chỉ nói về Ô.
CREATE UNIQUE INDEX "suggestion_one_pending_per_slot"
  ON "suggestion" ("account_id", "target_field")
  WHERE "status" = 'cho' AND "deleted_at" IS NULL;

-- Email là định danh đăng nhập, unique trong phạm vi CHƯA XOÁ
CREATE UNIQUE INDEX "user_email_active"
  ON "user" ("email")
  WHERE "deleted_at" IS NULL;

-- `BR-D4`: TỐI ĐA MỘT Đầu mối chính mỗi Công ty.
--
-- Chỉ mục này là thứ DUY NHẤT canh luật đó. "Đặt người mới thì người cũ tự mất
-- nhãn trong cùng một giao dịch" cho tính NGUYÊN TỬ, không cho tính DUY NHẤT:
-- hai giao dịch cùng đọc *"chưa có ai"* rồi cùng ghi sẽ tạo hai Đầu mối chính
-- và không bên nào lỗi.
CREATE UNIQUE INDEX "contact_one_primary"
  ON "contact" ("account_id")
  WHERE "is_primary" AND "deleted_at" IS NULL;

-- `FR-7`: TỐI ĐA MỘT Việc tiếp theo ĐANG SỐNG mỗi Cơ hội.
--
-- Thay cho `next_action_opportunity_id_key` mà Prisma sinh từ `@unique`. Bản
-- đó thiếu vế `deleted_at IS NULL`, nên một Việc tiếp theo đã xoá mềm khoá
-- VĨNH VIỄN ô đó: lần thay thứ hai trên cùng Cơ hội ăn unique violation, và
-- `T-7` (bấm Hoàn tác) đỏ với một lỗi Postgres không đọc được.
CREATE UNIQUE INDEX "next_action_one_active"
  ON "next_action" ("opportunity_id")
  WHERE "deleted_at" IS NULL;

-- ① Bất biến HAI CHIỀU của latest_open_stage (`AD-CR-1`).
--    Đóng hoặc tạm dừng  ⇔  có giai đoạn mở gần nhất. Không một chiều.
ALTER TABLE "opportunity" ADD CONSTRAINT "opp_latest_open_stage_iff"
  CHECK ((("stage" IN ('tam_dung','thang','thua')) = ("latest_open_stage" IS NOT NULL)));

-- ② Và nó LUÔN là một giai đoạn đang chạy
ALTER TABLE "opportunity" ADD CONSTRAINT "opp_latest_open_stage_running"
  CHECK ("latest_open_stage" IS NULL
         OR "latest_open_stage" IN ('tiep_can','du_dieu_kien','soan_de_xuat','thuong_luong'));

-- ③ `D2`: phân loại phụ CHỈ tồn tại khi loại tin là `other`
ALTER TABLE "signal" ADD CONSTRAINT "signal_subtype_only_other"
  CHECK (("signal_type" = 'other') OR "signal_subtype" IS NULL);

-- ④ `BR-D9`: giá trị tiền không âm
ALTER TABLE "opportunity" ADD CONSTRAINT "opp_amount_non_negative"
  CHECK ("amount" IS NULL OR "amount" >= 0);
