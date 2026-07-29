/*
  Warnings:

  - You are about to drop the `presensi` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "presensi" DROP CONSTRAINT "presensi_kelas_id_fkey";

-- DropTable
DROP TABLE "presensi";

-- CreateTable
CREATE TABLE "laporan_bulanan" (
    "id" TEXT NOT NULL,
    "kelas_id" TEXT NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "jumlah_hadir" INTEGER NOT NULL,
    "jumlah_izin" INTEGER NOT NULL DEFAULT 0,
    "materi_dipelajari" TEXT,
    "pemahaman_materi" INTEGER NOT NULL,
    "keaktifan_belajar" INTEGER NOT NULL,
    "kemandirian" INTEGER NOT NULL,
    "kedisiplinan" INTEGER NOT NULL,
    "catatan_siswa" TEXT,
    "saran_bimbel" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "laporan_bulanan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "laporan_bulanan_kelas_id_bulan_tahun_key" ON "laporan_bulanan"("kelas_id", "bulan", "tahun");

-- AddForeignKey
ALTER TABLE "laporan_bulanan" ADD CONSTRAINT "laporan_bulanan_kelas_id_fkey" FOREIGN KEY ("kelas_id") REFERENCES "kelas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
