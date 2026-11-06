-- AlterTable
ALTER TABLE "laporan_bulanan" ALTER COLUMN "share_token" SET DEFAULT (replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', ''));

-- AlterTable
ALTER TABLE "laporan_kelompok" ALTER COLUMN "share_token" SET DEFAULT (replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', ''));
