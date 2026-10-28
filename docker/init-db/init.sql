-- ============================================================================
-- TUGAS KELOMPOK BASIS DATA TUBES IMPAL - SISTEM PELITA (PERSONAL LIFE ASSISTANT)
-- Target Eksekusi: Supabase SQL Editor (PostgreSQL) & Docker PostgreSQL 16
-- Mencakup:
--   1. CREATE TABLE untuk 20 Tabel Basis Data TUBES PELITA (Skema public)
--   2. INSERT 5 Baris Data untuk Setiap Tabel (Total 100 Baris Data Terelasi)
-- ============================================================================

BEGIN;

-- Pastikan seluruh tabel dibuat di dalam skema public milik aplikasi
SET search_path TO public;

-- Pembersihan tabel apabila skrip dijalankan ulang di Supabase SQL Editor
DROP TABLE IF EXISTS public.idempotency_records CASCADE;
DROP TABLE IF EXISTS public.in_app_notifications CASCADE;
DROP TABLE IF EXISTS public.push_subscriptions CASCADE;
DROP TABLE IF EXISTS public.reminder_jobs CASCADE;
DROP TABLE IF EXISTS public.meal_log_items CASCADE;
DROP TABLE IF EXISTS public.meal_logs CASCADE;
DROP TABLE IF EXISTS public.favorite_meals CASCADE;
DROP TABLE IF EXISTS public.custom_foods CASCADE;
DROP TABLE IF EXISTS public.nutrition_profiles CASCADE;
DROP TABLE IF EXISTS public.recurrence_rules CASCADE;
DROP TABLE IF EXISTS public.schedule_items CASCADE;
DROP TABLE IF EXISTS public.budget_limits CASCADE;
DROP TABLE IF EXISTS public.finance_transaction_items CASCADE;
DROP TABLE IF EXISTS public.finance_transactions CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.wallets CASCADE;
DROP TABLE IF EXISTS public.attachment_files CASCADE;
DROP TABLE IF EXISTS public.verification_tokens CASCADE;
DROP TABLE IF EXISTS public.user_sessions CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- ============================================================================
-- BAGIAN 1: SINTAKS SQL CREATE TABLE (DDL) - 20 TABEL
-- ============================================================================

-- 1. Tabel users (Entitas Pengguna Terdaftar - Setara Entitas KASIR / Pemilik)
CREATE TABLE public.users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL,
    password_hash TEXT,
    auth_method VARCHAR(20) NOT NULL CHECK (auth_method IN ('LOCAL', 'GOOGLE')),
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    timezone VARCHAR(64) NOT NULL DEFAULT 'Asia/Jakarta',
    theme VARCHAR(20) NOT NULL DEFAULT 'LIGHT' CHECK (theme IN ('LIGHT', 'DARK', 'SYSTEM')),
    allow_external_ai BOOLEAN NOT NULL DEFAULT FALSE,
    nutrition_reminder VARCHAR(5) NOT NULL DEFAULT '19:00',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tabel user_sessions (Manajemen Sesi Login Aktif Pengguna)
CREATE TABLE public.user_sessions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Tabel verification_tokens (Token Sekali Pakai Verifikasi Email & Reset Sandi)
CREATE TABLE public.verification_tokens (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    purpose VARCHAR(30) NOT NULL CHECK (purpose IN ('EMAIL_VERIFY', 'PASSWORD_RESET')),
    expires_at TIMESTAMPTZ NOT NULL,
    consumed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Tabel attachment_files (Metadata Berkas Fisik Lampiran Struk & Foto Makanan)
CREATE TABLE public.attachment_files (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size_bytes INTEGER NOT NULL CHECK (size_bytes > 0),
    is_temporary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Tabel wallets (Dompet Penyimpanan Uang IDR - Setara Entitas TOKO / Kas)
CREATE TABLE public.wallets (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'IDR' CHECK (currency = 'IDR'),
    initial_balance NUMERIC(15, 2) NOT NULL DEFAULT 0 CHECK (initial_balance >= 0),
    current_balance NUMERIC(15, 2) NOT NULL DEFAULT 0,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Tabel categories (Master Kategori Pemasukan, Pengeluaran, dan Refund)
CREATE TABLE public.categories (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('INCOME', 'EXPENSE', 'REFUND')),
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Tabel finance_transactions (Header Transaksi Keuangan - Setara Tabel PENJUALAN)
CREATE TABLE public.finance_transactions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE RESTRICT,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('INCOME', 'EXPENSE', 'REFUND')),
    amount_idr NUMERIC(15, 2) NOT NULL CHECK (amount_idr > 0),
    transaction_date TIMESTAMPTZ NOT NULL,
    merchant_or_desc VARCHAR(255) NOT NULL,
    line_items_json JSONB,
    linked_expense_id UUID REFERENCES public.finance_transactions(id) ON DELETE SET NULL,
    receipt_file_id UUID REFERENCES public.attachment_files(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Tabel finance_transaction_items (Rincian Item Struk - Setara Tabel PENJUALANDetail)
CREATE TABLE public.finance_transaction_items (
    id UUID PRIMARY KEY,
    transaction_id UUID NOT NULL REFERENCES public.finance_transactions(id) ON DELETE CASCADE,
    item_code VARCHAR(50) NOT NULL,
    item_name VARCHAR(150) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
    unit_price_idr NUMERIC(15, 2) NOT NULL CHECK (unit_price_idr >= 0),
    subtotal_idr NUMERIC(15, 2) NOT NULL CHECK (subtotal_idr >= 0)
);

-- 9. Tabel budget_limits (Batas Anggaran Harian & Mingguan Siklus Senin-Minggu)
CREATE TABLE public.budget_limits (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    period_type VARCHAR(20) NOT NULL CHECK (period_type IN ('DAILY', 'WEEKLY')),
    limit_amount_idr NUMERIC(15, 2) NOT NULL DEFAULT 50000 CHECK (limit_amount_idr > 0),
    warn_threshold_pct INTEGER NOT NULL DEFAULT 80 CHECK (warn_threshold_pct BETWEEN 1 AND 100),
    last_notified_key VARCHAR(50),
    last_notified_level INTEGER NOT NULL DEFAULT 0 CHECK (last_notified_level IN (0, 80, 100))
);

-- 10. Tabel schedule_items (Agenda Terpadu: TASK, EVENT, DEADLINE)
CREATE TABLE public.schedule_items (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('TASK', 'EVENT', 'DEADLINE')),
    title VARCHAR(200) NOT NULL,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ,
    timezone VARCHAR(64) NOT NULL DEFAULT 'Asia/Jakarta',
    category VARCHAR(80) NOT NULL,
    status VARCHAR(40) NOT NULL,
    reminder_offset_min INTEGER NOT NULL DEFAULT 60 CHECK (reminder_offset_min >= 0)
);

-- 11. Tabel recurrence_rules (Aturan Perulangan Agenda & Tanggal Pengecualian)
CREATE TABLE public.recurrence_rules (
    id UUID PRIMARY KEY,
    schedule_id UUID NOT NULL UNIQUE REFERENCES public.schedule_items(id) ON DELETE CASCADE,
    frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('DAILY', 'WEEKLY', 'MONTHLY')),
    days_of_week INTEGER[],
    end_date TIMESTAMPTZ,
    max_occurrences INTEGER CHECK (max_occurrences IS NULL OR max_occurrences > 0),
    excluded_dates TEXT[] NOT NULL DEFAULT '{}'
);

-- 12. Tabel nutrition_profiles (Profil Fisik Metrik & Target 8 Komponen Nutrisi Harian)
CREATE TABLE public.nutrition_profiles (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    goal VARCHAR(20) NOT NULL CHECK (goal IN ('BULKING', 'CUTTING', 'MAINTENANCE')),
    age INTEGER NOT NULL CHECK (age > 0),
    gender VARCHAR(15) NOT NULL CHECK (gender IN ('MALE', 'FEMALE')),
    height_cm NUMERIC(5, 2) NOT NULL CHECK (height_cm > 0),
    weight_kg NUMERIC(5, 2) NOT NULL CHECK (weight_kg > 0),
    target_weight_kg NUMERIC(5, 2) NOT NULL CHECK (target_weight_kg > 0),
    activity_level VARCHAR(30) NOT NULL,
    target_calories_kcal NUMERIC(7, 2) NOT NULL,
    target_protein_g NUMERIC(6, 2) NOT NULL,
    target_carbs_g NUMERIC(6, 2) NOT NULL,
    target_fat_g NUMERIC(6, 2) NOT NULL,
    target_fiber_g NUMERIC(6, 2) NOT NULL,
    target_water_ml NUMERIC(7, 2) NOT NULL,
    max_sugar_g NUMERIC(6, 2) NOT NULL,
    max_sodium_mg NUMERIC(7, 2) NOT NULL
);

-- 13. Tabel custom_foods (Katalog Makanan Kustom Pengguna - Setara Tabel PRODUK)
CREATE TABLE public.custom_foods (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    food_code VARCHAR(50) NOT NULL,
    food_name VARCHAR(150) NOT NULL,
    serving_unit VARCHAR(10) NOT NULL CHECK (serving_unit IN ('g', 'ml')),
    serving_size NUMERIC(7, 2) NOT NULL CHECK (serving_size > 0),
    calories_kcal NUMERIC(7, 2) NOT NULL DEFAULT 0,
    protein_g NUMERIC(6, 2) NOT NULL DEFAULT 0,
    carbs_g NUMERIC(6, 2) NOT NULL DEFAULT 0,
    fat_g NUMERIC(6, 2) NOT NULL DEFAULT 0,
    fiber_g NUMERIC(6, 2) NOT NULL DEFAULT 0,
    water_ml NUMERIC(7, 2) NOT NULL DEFAULT 0,
    sugar_g NUMERIC(6, 2) NOT NULL DEFAULT 0,
    sodium_mg NUMERIC(7, 2) NOT NULL DEFAULT 0
);

-- 14. Tabel favorite_meals (Template Kombinasi Menu Makanan Favorit)
CREATE TABLE public.favorite_meals (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    meal_name VARCHAR(150) NOT NULL,
    default_portion VARCHAR(20) NOT NULL CHECK (default_portion IN ('sedikit', 'sedang', 'banyak')),
    items_template_json JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. Tabel meal_logs (Header Pencatatan Makan Harian - Setara Header Transaksi)
CREATE TABLE public.meal_logs (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    logged_at TIMESTAMPTZ NOT NULL,
    meal_title VARCHAR(100) NOT NULL,
    is_ai_estimate BOOLEAN NOT NULL DEFAULT FALSE,
    photo_file_id UUID REFERENCES public.attachment_files(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. Tabel meal_log_items (Detail Rincian Item Makanan - Setara Detail Transaksi)
CREATE TABLE public.meal_log_items (
    id UUID PRIMARY KEY,
    meal_log_id UUID NOT NULL REFERENCES public.meal_logs(id) ON DELETE CASCADE,
    custom_food_id UUID REFERENCES public.custom_foods(id) ON DELETE SET NULL,
    food_name VARCHAR(150) NOT NULL,
    portion_category VARCHAR(20) NOT NULL CHECK (portion_category IN ('sedikit', 'sedang', 'banyak')),
    weight_gram_or_ml NUMERIC(7, 2) NOT NULL CHECK (weight_gram_or_ml > 0),
    calories_kcal NUMERIC(7, 2) NOT NULL DEFAULT 0,
    protein_g NUMERIC(6, 2) NOT NULL DEFAULT 0,
    carbs_g NUMERIC(6, 2) NOT NULL DEFAULT 0,
    fat_g NUMERIC(6, 2) NOT NULL DEFAULT 0,
    fiber_g NUMERIC(6, 2) NOT NULL DEFAULT 0,
    water_ml NUMERIC(7, 2) NOT NULL DEFAULT 0,
    sugar_g NUMERIC(6, 2) NOT NULL DEFAULT 0,
    sodium_mg NUMERIC(7, 2) NOT NULL DEFAULT 0
);

-- 17. Tabel reminder_jobs (Antrean Pekerjaan Pengingat Terjadwal pg-boss)
CREATE TABLE public.reminder_jobs (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    domain_type VARCHAR(20) NOT NULL CHECK (domain_type IN ('SCHEDULE', 'NUTRITION')),
    reference_id UUID NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'SENT', 'FAILED', 'EXPIRED')),
    retry_count INTEGER NOT NULL DEFAULT 0 CHECK (retry_count BETWEEN 0 AND 3)
);

-- 18. Tabel push_subscriptions (Langganan Perangkat PWA Web Push Notification)
CREATE TABLE public.push_subscriptions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL UNIQUE,
    p256dh_key TEXT NOT NULL,
    auth_key TEXT NOT NULL,
    user_agent VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 19. Tabel in_app_notifications (Notifikasi di Dalam Aplikasi & Fallback Push)
CREATE TABLE public.in_app_notifications (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    reminder_job_id UUID REFERENCES public.reminder_jobs(id) ON DELETE SET NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 20. Tabel idempotency_records (Pencegahan Duplikasi Transaksi & Tindakan AI)
CREATE TABLE public.idempotency_records (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    idempotency_key VARCHAR(150) NOT NULL,
    action_type VARCHAR(80) NOT NULL,
    response_json JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, idempotency_key)
);


-- ============================================================================
-- BAGIAN 2: SINTAKS SQL INSERT 5 DATA UNTUK TIAP TABEL (DML)
-- ============================================================================

-- 1. INSERT 5 Data ke Tabel users
INSERT INTO public.users (id, email, username, password_hash, auth_method, email_verified, timezone, theme, allow_external_ai, nutrition_reminder) VALUES
('10000000-0000-4000-8000-000000000001', 'hamam.nashiruddin@pelita.local', 'Hamam Nashiruddin', '$argon2id$v=19$m=65536,t=3,p=4$c2FsdHBlbGl0YTE$hashhamam001', 'LOCAL', TRUE, 'Asia/Jakarta', 'DARK', TRUE, '19:00'),
('10000000-0000-4000-8000-000000000002', 'nadia.putri@pelita.local', 'Nadia Putri', '$argon2id$v=19$m=65536,t=3,p=4$c2FsdHBlbGl0YTI$hashnadia002', 'LOCAL', TRUE, 'Asia/Jakarta', 'LIGHT', FALSE, '19:00'),
('10000000-0000-4000-8000-000000000003', 'rizky.pratama@gmail.com', 'Rizky Pratama', NULL, 'GOOGLE', TRUE, 'Asia/Jakarta', 'SYSTEM', TRUE, '19:00'),
('10000000-0000-4000-8000-000000000004', 'alya.rahma@pelita.local', 'Alya Rahma', '$argon2id$v=19$m=65536,t=3,p=4$c2FsdHBlbGl0YTQ$hashalya004', 'LOCAL', FALSE, 'Asia/Makassar', 'LIGHT', FALSE, '19:00'),
('10000000-0000-4000-8000-000000000005', 'bagas.saputra@gmail.com', 'Bagas Saputra', NULL, 'GOOGLE', TRUE, 'Asia/Jakarta', 'DARK', FALSE, '19:00');

-- 2. INSERT 5 Data ke Tabel user_sessions
INSERT INTO public.user_sessions (id, user_id, token_hash, expires_at, revoked_at) VALUES
('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'sha256_sess_token_hamam_desktop_01', '2026-11-10 23:59:59+07', NULL),
('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'sha256_sess_token_hamam_android_02', '2026-11-10 23:59:59+07', NULL),
('20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000002', 'sha256_sess_token_nadia_laptop_03', '2026-11-12 23:59:59+07', NULL),
('20000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000003', 'sha256_sess_token_rizky_chrome_04', '2026-11-15 23:59:59+07', '2026-10-25 18:30:00+07'),
('20000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000005', 'sha256_sess_token_bagas_mobile_05', '2026-11-20 23:59:59+07', NULL);

-- 3. INSERT 5 Data ke Tabel verification_tokens
INSERT INTO public.verification_tokens (id, user_id, token_hash, purpose, expires_at, consumed_at) VALUES
('30000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'sha256_verify_email_hamam_001', 'EMAIL_VERIFY', '2026-10-02 10:00:00+07', '2026-10-01 10:15:00+07'),
('30000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', 'sha256_verify_email_nadia_002', 'EMAIL_VERIFY', '2026-10-03 12:00:00+07', '2026-10-02 14:20:00+07'),
('30000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000004', 'sha256_verify_email_alya_003', 'EMAIL_VERIFY', '2026-10-28 12:00:00+07', NULL),
('30000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000001', 'sha256_reset_pwd_hamam_004', 'PASSWORD_RESET', '2026-10-15 09:00:00+07', '2026-10-15 08:12:00+07'),
('30000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000002', 'sha256_reset_pwd_nadia_005', 'PASSWORD_RESET', '2026-10-29 15:00:00+07', NULL);

-- 4. INSERT 5 Data ke Tabel attachment_files
INSERT INTO public.attachment_files (id, user_id, storage_path, mime_type, size_bytes, is_temporary) VALUES
('40000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '/var/lib/pelita/uploads/10000000-0000-4000-8000-000000000001/struk_indomaret_01.jpg', 'image/jpeg', 245800, FALSE),
('40000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', '/var/lib/pelita/uploads/10000000-0000-4000-8000-000000000001/struk_gramedia_02.png', 'image/png', 312400, FALSE),
('40000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', '/var/lib/pelita/uploads/10000000-0000-4000-8000-000000000001/foto_nasi_ayam_03.jpg', 'image/jpeg', 418200, FALSE),
('40000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000002', '/var/lib/pelita/uploads/10000000-0000-4000-8000-000000000002/struk_superindo_04.jpg', 'image/jpeg', 198500, FALSE),
('40000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000003', '/var/lib/pelita/uploads/10000000-0000-4000-8000-000000000003/foto_salad_buah_05.webp', 'image/webp', 154000, FALSE);

-- 5. INSERT 5 Data ke Tabel wallets
INSERT INTO public.wallets (id, user_id, name, currency, initial_balance, current_balance, is_archived) VALUES
('50000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'Dompet Tunai Harian', 'IDR', 500000.00, 463000.00, FALSE),
('50000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'Rekening Bank BCA', 'IDR', 2000000.00, 3425000.00, FALSE),
('50000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', 'Dompet GoPay', 'IDR', 150000.00, 150000.00, TRUE),
('50000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000002', 'Tabungan Mandiri Nadia', 'IDR', 1200000.00, 1155000.00, FALSE),
('50000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000003', 'Kas Kosan Rizky', 'IDR', 300000.00, 300000.00, FALSE);

-- 6. INSERT 5 Data ke Tabel categories
INSERT INTO public.categories (id, user_id, name, type, is_default, is_archived) VALUES
('60000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'Food & Beverage', 'EXPENSE', TRUE, FALSE),
('60000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'Academic & Books', 'EXPENSE', FALSE, FALSE),
('60000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', 'Monthly Allowance & Stipend', 'INCOME', TRUE, FALSE),
('60000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000001', 'Merchant Refund', 'REFUND', TRUE, FALSE),
('60000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000002', 'Groceries & Minimarket', 'EXPENSE', TRUE, FALSE);

-- 7. INSERT 5 Data ke Tabel finance_transactions (Header Transaksi - Setara PENJUALAN)
INSERT INTO public.finance_transactions (id, user_id, wallet_id, category_id, type, amount_idr, transaction_date, merchant_or_desc, line_items_json, linked_expense_id, receipt_file_id) VALUES
('70000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000001', '60000000-0000-4000-8000-000000000001', 'EXPENSE', 37000.00, '2026-10-25 12:30:00+07', 'Indomaret Telekomunikasi Bojongsoang', '[{"code":"PRD-001","name":"Roti Gandum Sari Roti","qty":1,"price":22000},{"code":"PRD-002","name":"Susu Ultra Milk 250ml","qty":2,"price":7500}]'::jsonb, NULL, '40000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000002', '60000000-0000-4000-8000-000000000003', 'INCOME', 1500000.00, '2026-10-25 09:00:00+07', 'Kiriman Uang Saku Bulanan Oktober', NULL, NULL, NULL),
('70000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000002', '60000000-0000-4000-8000-000000000002', 'EXPENSE', 90000.00, '2026-10-26 14:15:00+07', 'Gramedia Merdeka Bandung', '[{"code":"PRD-003","name":"Buku Catatan Grid A5","qty":2,"price":30000},{"code":"PRD-004","name":"Pulpen Gel Hitam","qty":2,"price":15000}]'::jsonb, NULL, '40000000-0000-4000-8000-000000000002'),
('70000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000002', '60000000-0000-4000-8000-000000000004', 'REFUND', 15000.00, '2026-10-26 16:00:00+07', 'Refund 1 Pulpen Cacat Gramedia', NULL, '70000000-0000-4000-8000-000000000003', NULL),
('70000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000002', '50000000-0000-4000-8000-000000000004', '60000000-0000-4000-8000-000000000005', 'EXPENSE', 45000.00, '2026-10-26 18:45:00+07', 'Superindo Buahbatu', '[{"code":"PRD-005","name":"Dada Ayam Fillet 500g","qty":1,"price":45000}]'::jsonb, NULL, '40000000-0000-4000-8000-000000000004');

-- 8. INSERT 5 Data ke Tabel finance_transaction_items (Detail Struk - Setara PENJUALANDetail)
INSERT INTO public.finance_transaction_items (id, transaction_id, item_code, item_name, unit, quantity, unit_price_idr, subtotal_idr) VALUES
('80000000-0000-4000-8000-000000000001', '70000000-0000-4000-8000-000000000001', 'PRD-001', 'Roti Gandum Sari Roti', 'bungkus', 1.00, 22000.00, 22000.00),
('80000000-0000-4000-8000-000000000002', '70000000-0000-4000-8000-000000000001', 'PRD-002', 'Susu Ultra Milk Full Cream 250ml', 'kotak', 2.00, 7500.00, 15000.00),
('80000000-0000-4000-8000-000000000003', '70000000-0000-4000-8000-000000000003', 'PRD-003', 'Buku Catatan Grid A5', 'buah', 2.00, 30000.00, 60000.00),
('80000000-0000-4000-8000-000000000004', '70000000-0000-4000-8000-000000000003', 'PRD-004', 'Pulpen Gel Hitam 0.5mm', 'buah', 2.00, 15000.00, 30000.00),
('80000000-0000-4000-8000-000000000005', '70000000-0000-4000-8000-000000000005', 'PRD-005', 'Dada Ayam Fillet Segar 500g', 'pak', 1.00, 45000.00, 45000.00);

-- 9. INSERT 5 Data ke Tabel budget_limits
INSERT INTO public.budget_limits (id, user_id, period_type, limit_amount_idr, warn_threshold_pct, last_notified_key, last_notified_level) VALUES
('90000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'DAILY', 50000.00, 80, '2026-10-26', 100),
('90000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'WEEKLY', 350000.00, 80, '2026-W44', 0),
('90000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000002', 'DAILY', 60000.00, 80, '2026-10-26', 80),
('90000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000002', 'WEEKLY', 400000.00, 80, NULL, 0),
('90000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000003', 'DAILY', 50000.00, 80, NULL, 0);

-- 10. INSERT 5 Data ke Tabel schedule_items
INSERT INTO public.schedule_items (id, user_id, type, title, start_at, end_at, timezone, category, status, reminder_offset_min) VALUES
('a0000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'EVENT', 'Kuliah Implementasi dan Pengujian Perangkat Lunak (IMPAL)', '2026-10-27 08:30:00+07', '2026-10-27 10:30:00+07', 'Asia/Jakarta', 'Academic', 'Scheduled', 60),
('a0000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'DEADLINE', 'Pengumpulan PDF Sintaks SQL Basis Data TUBES', '2026-11-03 23:59:00+07', NULL, 'Asia/Jakarta', 'Assignment', 'Pending', 60),
('a0000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', 'TASK', 'Olahraga Sore & Latihan Beban', '2026-10-27 16:30:00+07', '2026-10-27 17:30:00+07', 'Asia/Jakarta', 'Health', 'In Progress', 60),
('a0000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000002', 'EVENT', 'Rapat Koordinasi Sprint 1 Kelompok PELITA', '2026-10-28 19:30:00+07', '2026-10-28 21:00:00+07', 'Asia/Jakarta', 'Project', 'Scheduled', 60),
('a0000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000003', 'TASK', 'Evaluasi Benchmark Model Lokal Ollama di Home Server', '2026-10-29 20:00:00+07', '2026-10-29 22:00:00+07', 'Asia/Jakarta', 'Engineering', 'Not Started', 60);

-- 11. INSERT 5 Data ke Tabel recurrence_rules
INSERT INTO public.recurrence_rules (id, schedule_id, frequency, days_of_week, end_date, max_occurrences, excluded_dates) VALUES
('b0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'WEEKLY', ARRAY[2], '2026-12-22 23:59:59+07', 14, ARRAY['2026-11-17']),
('b0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000002', 'MONTHLY', NULL, '2026-12-31 23:59:59+07', 3, ARRAY[]::TEXT[]),
('b0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000003', 'WEEKLY', ARRAY[1, 3, 5], '2026-12-31 23:59:59+07', NULL, ARRAY['2026-10-30']),
('b0000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000004', 'WEEKLY', ARRAY[3], '2026-11-25 23:59:59+07', 5, ARRAY[]::TEXT[]),
('b0000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000005', 'DAILY', NULL, '2026-11-05 23:59:59+07', 7, ARRAY[]::TEXT[]);

-- 12. INSERT 5 Data ke Tabel nutrition_profiles
INSERT INTO public.nutrition_profiles (id, user_id, goal, age, gender, height_cm, weight_kg, target_weight_kg, activity_level, target_calories_kcal, target_protein_g, target_carbs_g, target_fat_g, target_fiber_g, target_water_ml, max_sugar_g, max_sodium_mg) VALUES
('c0000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'MAINTENANCE', 20, 'MALE', 172.00, 66.00, 66.00, 'MODERATE', 2350.00, 132.00, 290.00, 72.00, 30.00, 2500.00, 50.00, 2000.00),
('c0000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', 'CUTTING', 20, 'FEMALE', 160.00, 58.00, 53.00, 'LIGHT', 1650.00, 105.00, 180.00, 52.00, 25.00, 2100.00, 40.00, 2000.00),
('c0000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000003', 'BULKING', 21, 'MALE', 175.00, 62.00, 70.00, 'ACTIVE', 2750.00, 150.00, 350.00, 82.00, 32.00, 2800.00, 50.00, 2000.00),
('c0000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000004', 'MAINTENANCE', 19, 'FEMALE', 158.00, 50.00, 50.00, 'LIGHT', 1800.00, 95.00, 220.00, 58.00, 25.00, 2000.00, 45.00, 2000.00),
('c0000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000005', 'CUTTING', 22, 'MALE', 170.00, 78.00, 70.00, 'MODERATE', 2000.00, 140.00, 210.00, 62.00, 30.00, 2600.00, 45.00, 2000.00);

-- 13. INSERT 5 Data ke Tabel custom_foods (Setara Tabel PRODUK untuk Modul Nutrisi)
INSERT INTO public.custom_foods (id, user_id, food_code, food_name, serving_unit, serving_size, calories_kcal, protein_g, carbs_g, fat_g, fiber_g, water_ml, sugar_g, sodium_mg) VALUES
('d0000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'FD-001', 'Nasi Putih Pulen Matang', 'g', 150.00, 195.00, 4.00, 42.00, 0.40, 0.60, 90.00, 0.10, 5.00),
('d0000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'FD-002', 'Dada Ayam Panggang Tanpa Kulit', 'g', 120.00, 198.00, 37.20, 0.00, 4.30, 0.00, 75.00, 0.00, 88.00),
('d0000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', 'FD-003', 'Tempe Goreng Rumahan', 'g', 50.00, 118.00, 9.50, 7.50, 6.40, 3.20, 22.00, 0.30, 45.00),
('d0000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000001', 'FD-004', 'Susu Ultra Milk Full Cream', 'ml', 250.00, 160.00, 8.00, 12.00, 9.00, 0.00, 220.00, 10.00, 115.00),
('d0000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000002', 'FD-005', 'Salad Sayur & Telur Rebus', 'g', 180.00, 145.00, 8.50, 9.00, 8.20, 4.50, 140.00, 2.10, 160.00);

-- 14. INSERT 5 Data ke Tabel favorite_meals
INSERT INTO public.favorite_meals (id, user_id, meal_name, default_portion, items_template_json) VALUES
('e0000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'Paket Makan Siang Ayam Panggang & Tempe', 'sedang', '[{"foodCode":"FD-001","grams":150},{"foodCode":"FD-002","grams":120},{"foodCode":"FD-003","grams":50}]'::jsonb),
('e0000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'Sarapan Praktis Roti Gandum & Susu', 'sedang', '[{"foodCode":"FD-004","ml":250}]'::jsonb),
('e0000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000002', 'Menu Defisit Kalori Salad Telur', 'sedang', '[{"foodCode":"FD-005","grams":180}]'::jsonb),
('e0000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000003', 'Porsi Bulking Double Ayam & Nasi', 'banyak', '[{"foodCode":"FD-001","grams":250},{"foodCode":"FD-002","grams":200}]'::jsonb),
('e0000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000005', 'Makan Malam Tinggi Protein Tanpa Nasi', 'sedikit', '[{"foodCode":"FD-002","grams":120},{"foodCode":"FD-003","grams":50}]'::jsonb);

-- 15. INSERT 5 Data ke Tabel meal_logs
INSERT INTO public.meal_logs (id, user_id, logged_at, meal_title, is_ai_estimate, photo_file_id) VALUES
('f0000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '2026-10-26 07:30:00+07', 'Breakfast', FALSE, NULL),
('f0000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', '2026-10-26 12:45:00+07', 'Lunch (Estimate)', TRUE, '40000000-0000-4000-8000-000000000003'),
('f0000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', '2026-10-26 19:15:00+07', 'Dinner', FALSE, NULL),
('f0000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000002', '2026-10-26 13:00:00+07', 'Lunch', FALSE, NULL),
('f0000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000003', '2026-10-26 16:00:00+07', 'Afternoon Snack (Estimate)', TRUE, '40000000-0000-4000-8000-000000000005');

-- 16. INSERT 5 Data ke Tabel meal_log_items
INSERT INTO public.meal_log_items (id, meal_log_id, custom_food_id, food_name, portion_category, weight_gram_or_ml, calories_kcal, protein_g, carbs_g, fat_g, fiber_g, water_ml, sugar_g, sodium_mg) VALUES
('f1000000-0000-4000-8000-000000000001', 'f0000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000004', 'Susu Ultra Milk Full Cream', 'sedang', 250.00, 160.00, 8.00, 12.00, 9.00, 0.00, 220.00, 10.00, 115.00),
('f1000000-0000-4000-8000-000000000002', 'f0000000-0000-4000-8000-000000000002', 'd0000000-0000-4000-8000-000000000001', 'Nasi Putih Pulen Matang', 'sedang', 150.00, 195.00, 4.00, 42.00, 0.40, 0.60, 90.00, 0.10, 5.00),
('f1000000-0000-4000-8000-000000000003', 'f0000000-0000-4000-8000-000000000002', 'd0000000-0000-4000-8000-000000000002', 'Dada Ayam Panggang Tanpa Kulit', 'sedang', 120.00, 198.00, 37.20, 0.00, 4.30, 0.00, 75.00, 0.00, 88.00),
('f1000000-0000-4000-8000-000000000004', 'f0000000-0000-4000-8000-000000000003', 'd0000000-0000-4000-8000-000000000003', 'Tempe Goreng Rumahan', 'sedikit', 50.00, 118.00, 9.50, 7.50, 6.40, 3.20, 22.00, 0.30, 45.00),
('f1000000-0000-4000-8000-000000000005', 'f0000000-0000-4000-8000-000000000004', 'd0000000-0000-4000-8000-000000000005', 'Salad Sayur & Telur Rebus', 'banyak', 180.00, 145.00, 8.50, 9.00, 8.20, 4.50, 140.00, 2.10, 160.00);

-- 17. INSERT 5 Data ke Tabel reminder_jobs
INSERT INTO public.reminder_jobs (id, user_id, domain_type, reference_id, scheduled_at, status, retry_count) VALUES
('f2000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'SCHEDULE', 'a0000000-0000-4000-8000-000000000001', '2026-10-27 07:30:00+07', 'SENT', 0),
('f2000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'SCHEDULE', 'a0000000-0000-4000-8000-000000000002', '2026-11-03 22:59:00+07', 'PENDING', 0),
('f2000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', 'NUTRITION', 'c0000000-0000-4000-8000-000000000001', '2026-10-26 19:00:00+07', 'SENT', 0),
('f2000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000002', 'SCHEDULE', 'a0000000-0000-4000-8000-000000000004', '2026-10-28 18:30:00+07', 'FAILED', 3),
('f2000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000003', 'SCHEDULE', 'a0000000-0000-4000-8000-000000000005', '2026-10-20 19:00:00+07', 'EXPIRED', 0);

-- 18. INSERT 5 Data ke Tabel push_subscriptions
INSERT INTO public.push_subscriptions (id, user_id, endpoint, p256dh_key, auth_key, user_agent, is_active) VALUES
('f3000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'https://fcm.googleapis.com/fcm/send/pelita-win11-chrome-hamam-01', 'BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QTpQ', 'tBHItJI5svbpez7KI4CCXg', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0.0.0', TRUE),
('f3000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'https://fcm.googleapis.com/fcm/send/pelita-android-chrome-hamam-02', 'BOr6Z2L9pX1kLmN8vQ3wR5tY7uI9oP0aS2dF4gH6jK8', 'xYz987AbC654DeF321GhIj', 'Mozilla/5.0 (Linux; Android 14; Pixel 8) Chrome/130.0.0.0 Mobile', TRUE),
('f3000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000002', 'https://fcm.googleapis.com/fcm/send/pelita-win11-edge-nadia-03', 'BPq7A3M0qY2lMnO9wR4xS6uZ8vJ0pQ1bT3eG5hI7kL9', 'kLm456NoP789QrS012TuVw', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edg/130.0.0.0', TRUE),
('f3000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000003', 'https://fcm.googleapis.com/fcm/send/pelita-android-chrome-rizky-04', 'BQs8B4N1rZ3mNoP0xS5yT7vA9wK1qR2cU4fH6iJ8lM0', 'mNo345PqR678StU901VwXy', 'Mozilla/5.0 (Linux; Android 14; SM-S918B) Chrome/130.0.0.0 Mobile', FALSE),
('f3000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000005', 'https://fcm.googleapis.com/fcm/send/pelita-win11-chrome-bagas-05', 'BRt9C5O2sA4nOpQ1yT6zU8wB0xL2rS3dV5gI7jK9mN1', 'pQr234StU567VwX890YzAb', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0.0.0', TRUE);

-- 19. INSERT 5 Data ke Tabel in_app_notifications
INSERT INTO public.in_app_notifications (id, user_id, reminder_job_id, title, message, is_read) VALUES
('f4000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'f2000000-0000-4000-8000-000000000001', 'Upcoming Event in 1 Hour', 'Kuliah Implementasi dan Pengujian Perangkat Lunak (IMPAL) starts at 08:30 WIB.', TRUE),
('f4000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'f2000000-0000-4000-8000-000000000003', 'Daily Nutrition Check-In', '5 hours left before midnight! You still need 797 kcal and 43g protein to reach your daily target.', FALSE),
('f4000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', NULL, 'Daily Budget 100% Reached', 'Your net spending today (Rp75,000) has exceeded your daily budget limit of Rp50,000.', FALSE),
('f4000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000002', 'f2000000-0000-4000-8000-000000000004', 'Fallback Reminder: Rapat Sprint 1', 'Web Push delivery failed after 3 retries. Reminder shown in-app: Rapat Koordinasi Sprint 1 at 19:30 WIB.', FALSE),
('f4000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000002', NULL, 'Daily Budget 80% Warning', 'Your net spending today (Rp45,000) has reached 75-80% of your daily budget limit.', TRUE);

-- 20. INSERT 5 Data ke Tabel idempotency_records
INSERT INTO public.idempotency_records (id, user_id, idempotency_key, action_type, response_json) VALUES
('f5000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'idem-ai-chat-20261026-001', 'AI_MULTI_DOMAIN_CREATE', '{"status":"COMMITTED","createdMealLogId":"f0000000-0000-4000-8000-000000000002","createdTxId":"70000000-0000-4000-8000-000000000001"}'::jsonb),
('f5000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'idem-ocr-receipt-20261026-002', 'FINANCE_OCR_EXPENSE', '{"status":"COMMITTED","txId":"70000000-0000-4000-8000-000000000003","amountIdr":90000}'::jsonb),
('f5000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', 'idem-refund-20261026-003', 'FINANCE_LINKED_REFUND', '{"status":"COMMITTED","txId":"70000000-0000-4000-8000-000000000004","netSpendingReducedBy":15000}'::jsonb),
('f5000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000002', 'idem-manual-tx-20261026-004', 'FINANCE_MANUAL_EXPENSE', '{"status":"COMMITTED","txId":"70000000-0000-4000-8000-000000000005","amountIdr":45000}'::jsonb),
('f5000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000003', 'idem-voice-stt-20261026-005', 'AI_VOICE_SCHEDULE_CREATE', '{"status":"COMMITTED","scheduleId":"a0000000-0000-4000-8000-000000000005"}'::jsonb);

COMMIT;

-- ============================================================================
-- BAGIAN 3: KUERI VERIFIKASI OTOMATIS DI SUPABASE SQL EDITOR
-- Menampilkan bukti bahwa seluruh 20 tabel telah berisi tepat 5 baris data
-- ============================================================================
SELECT '01. users' AS nama_tabel, COUNT(*) AS jumlah_baris_data FROM public.users UNION ALL
SELECT '02. user_sessions', COUNT(*) FROM public.user_sessions UNION ALL
SELECT '03. verification_tokens', COUNT(*) FROM public.verification_tokens UNION ALL
SELECT '04. attachment_files', COUNT(*) FROM public.attachment_files UNION ALL
SELECT '05. wallets', COUNT(*) FROM public.wallets UNION ALL
SELECT '06. categories', COUNT(*) FROM public.categories UNION ALL
SELECT '07. finance_transactions', COUNT(*) FROM public.finance_transactions UNION ALL
SELECT '08. finance_transaction_items', COUNT(*) FROM public.finance_transaction_items UNION ALL
SELECT '09. budget_limits', COUNT(*) FROM public.budget_limits UNION ALL
SELECT '10. schedule_items', COUNT(*) FROM public.schedule_items UNION ALL
SELECT '11. recurrence_rules', COUNT(*) FROM public.recurrence_rules UNION ALL
SELECT '12. nutrition_profiles', COUNT(*) FROM public.nutrition_profiles UNION ALL
SELECT '13. custom_foods', COUNT(*) FROM public.custom_foods UNION ALL
SELECT '14. favorite_meals', COUNT(*) FROM public.favorite_meals UNION ALL
SELECT '15. meal_logs', COUNT(*) FROM public.meal_logs UNION ALL
SELECT '16. meal_log_items', COUNT(*) FROM public.meal_log_items UNION ALL
SELECT '17. reminder_jobs', COUNT(*) FROM public.reminder_jobs UNION ALL
SELECT '18. push_subscriptions', COUNT(*) FROM public.push_subscriptions UNION ALL
SELECT '19. in_app_notifications', COUNT(*) FROM public.in_app_notifications UNION ALL
SELECT '20. idempotency_records', COUNT(*) FROM public.idempotency_records;
