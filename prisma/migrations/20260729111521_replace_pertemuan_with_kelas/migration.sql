/*
  Warnings:

  - You are about to drop the column `harga` on the `presensi` table. All the data in the column will be lost.
  - You are about to drop the column `pertemuan_id` on the `presensi` table. All the data in the column will be lost.
  - You are about to drop the column `siswa_id` on the `presensi` table. All the data in the column will be lost.
  - You are about to drop the column `status_bayar` on the `presensi` table. All the data in the column will be lost.
  - You are about to drop the column `tanggal_bayar` on the `presensi` table. All the data in the column will be lost.
  - You are about to drop the `pertemuan` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `kelas_id` to the `presensi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tanggal` to the `presensi` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "pertemuan" DROP CONSTRAINT "pertemuan_tutor_id_fkey";

-- DropForeignKey
ALTER TABLE "presensi" DROP CONSTRAINT "presensi_pertemuan_id_fkey";

-- DropForeignKey
ALTER TABLE "presensi" DROP CONSTRAINT "presensi_siswa_id_fkey";

-- DropIndex
DROP INDEX "presensi_pertemuan_id_siswa_id_key";

-- AlterTable
ALTER TABLE "presensi" DROP COLUMN "harga",
DROP COLUMN "pertemuan_id",
DROP COLUMN "siswa_id",
DROP COLUMN "status_bayar",
DROP COLUMN "tanggal_bayar",
ADD COLUMN     "kelas_id" TEXT NOT NULL,
ADD COLUMN     "tanggal" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "siswa" ADD COLUMN     "notes" TEXT;

-- DropTable
DROP TABLE "pertemuan";

-- CreateTable
CREATE TABLE "kelas" (
    "id" TEXT NOT NULL,
    "siswa_id" TEXT NOT NULL,
    "tutor_id" TEXT NOT NULL,
    "tipe" TEXT NOT NULL DEFAULT 'privat',
    "jadwal" TEXT NOT NULL,
    "biaya_ortu" INTEGER NOT NULL,
    "fee_tutor" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'aktif',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kelas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "kelas" ADD CONSTRAINT "kelas_siswa_id_fkey" FOREIGN KEY ("siswa_id") REFERENCES "siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kelas" ADD CONSTRAINT "kelas_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "tutor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presensi" ADD CONSTRAINT "presensi_kelas_id_fkey" FOREIGN KEY ("kelas_id") REFERENCES "kelas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
