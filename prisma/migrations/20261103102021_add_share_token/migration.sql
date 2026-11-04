/*
  Warnings:

  - A unique constraint covering the columns `[share_token]` on the table `laporan_bulanan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[share_token]` on the table `laporan_kelompok` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "laporan_bulanan" ADD COLUMN     "share_token" TEXT NOT NULL DEFAULT (replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', ''));

-- AlterTable
ALTER TABLE "laporan_kelompok" ADD COLUMN     "share_token" TEXT NOT NULL DEFAULT (replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', ''));

-- CreateIndex
CREATE UNIQUE INDEX "laporan_bulanan_share_token_key" ON "laporan_bulanan"("share_token");

-- CreateIndex
CREATE UNIQUE INDEX "laporan_kelompok_share_token_key" ON "laporan_kelompok"("share_token");
