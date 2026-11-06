-- AlterTable
ALTER TABLE "laporan_bulanan" ALTER COLUMN "share_token" SET DEFAULT (replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', ''));

-- AlterTable
ALTER TABLE "laporan_kelompok" ALTER COLUMN "share_token" SET DEFAULT (replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', ''));

-- CreateTable
CREATE TABLE "pengaturan" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "fee_izin_ortu" INTEGER NOT NULL,
    "fee_izin_tutor" INTEGER NOT NULL,
    "info_pembayaran" TEXT NOT NULL,
    "template_pesan_belum_lunas" TEXT NOT NULL,
    "template_pesan_lunas" TEXT NOT NULL,
    "nama_bimbel" TEXT NOT NULL,
    "subjudul_privat" TEXT NOT NULL,
    "subjudul_kelompok" TEXT NOT NULL,
    "penutup_kwitansi" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pengaturan_pkey" PRIMARY KEY ("id")
);
