/*
  Warnings:

  - A unique constraint covering the columns `[kelas_id,bulan,tahun,minggu_ke]` on the table `laporan_bulanan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[kelompok_id,bulan,tahun,minggu_ke]` on the table `laporan_kelompok` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "laporan_bulanan_kelas_id_bulan_tahun_key";

-- DropIndex
DROP INDEX "laporan_kelompok_kelompok_id_bulan_tahun_key";

-- AlterTable
ALTER TABLE "laporan_bulanan" ADD COLUMN     "minggu_ke" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tipe_periode" TEXT NOT NULL DEFAULT 'bulanan';

-- AlterTable
ALTER TABLE "laporan_kelompok" ADD COLUMN     "minggu_ke" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tipe_periode" TEXT NOT NULL DEFAULT 'bulanan';

-- CreateIndex
CREATE UNIQUE INDEX "laporan_bulanan_kelas_id_bulan_tahun_minggu_ke_key" ON "laporan_bulanan"("kelas_id", "bulan", "tahun", "minggu_ke");

-- CreateIndex
CREATE UNIQUE INDEX "laporan_kelompok_kelompok_id_bulan_tahun_minggu_ke_key" ON "laporan_kelompok"("kelompok_id", "bulan", "tahun", "minggu_ke");
