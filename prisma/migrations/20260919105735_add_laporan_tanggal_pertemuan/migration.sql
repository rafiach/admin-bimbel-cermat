-- CreateTable
CREATE TABLE "laporan_tanggal_pertemuan" (
    "id" TEXT NOT NULL,
    "laporan_id" TEXT NOT NULL,
    "kelas_id" TEXT NOT NULL,
    "tanggal" DATE NOT NULL,

    CONSTRAINT "laporan_tanggal_pertemuan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laporan_tanggal_pertemuan_kelompok" (
    "id" TEXT NOT NULL,
    "laporan_kelompok_id" TEXT NOT NULL,
    "kelompok_id" TEXT NOT NULL,
    "tanggal" DATE NOT NULL,

    CONSTRAINT "laporan_tanggal_pertemuan_kelompok_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "laporan_tanggal_pertemuan_kelas_id_tanggal_key" ON "laporan_tanggal_pertemuan"("kelas_id", "tanggal");

-- CreateIndex
CREATE UNIQUE INDEX "laporan_tanggal_pertemuan_kelompok_kelompok_id_tanggal_key" ON "laporan_tanggal_pertemuan_kelompok"("kelompok_id", "tanggal");

-- AddForeignKey
ALTER TABLE "laporan_tanggal_pertemuan" ADD CONSTRAINT "laporan_tanggal_pertemuan_laporan_id_fkey" FOREIGN KEY ("laporan_id") REFERENCES "laporan_bulanan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporan_tanggal_pertemuan_kelompok" ADD CONSTRAINT "laporan_tanggal_pertemuan_kelompok_laporan_kelompok_id_fkey" FOREIGN KEY ("laporan_kelompok_id") REFERENCES "laporan_kelompok"("id") ON DELETE CASCADE ON UPDATE CASCADE;
