/*
  Warnings:

  - You are about to drop the column `tipe` on the `kelas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "kelas" DROP COLUMN "tipe",
ADD COLUMN     "tipe_periode" TEXT NOT NULL DEFAULT 'bulanan';

-- AlterTable
ALTER TABLE "kelompok" ADD COLUMN     "tipe_periode" TEXT NOT NULL DEFAULT 'bulanan';


UPDATE "kelas" SET "tipe_periode" = 'mingguan'
WHERE "id" IN (SELECT DISTINCT "kelas_id" FROM "laporan_bulanan" WHERE "tipe_periode" = 'mingguan');

UPDATE "kelompok" SET "tipe_periode" = 'mingguan'
WHERE "id" IN (SELECT DISTINCT "kelompok_id" FROM "laporan_kelompok" WHERE "tipe_periode" = 'mingguan');
