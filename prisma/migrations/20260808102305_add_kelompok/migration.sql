-- CreateTable
CREATE TABLE "kelompok" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "tutor_id" TEXT NOT NULL,
    "jadwal" TEXT NOT NULL,
    "harga_kelompok" INTEGER NOT NULL,
    "fee_tutor_kelompok" INTEGER NOT NULL,
    "nama_wali" TEXT,
    "no_hp_wali" TEXT,
    "status" TEXT NOT NULL DEFAULT 'aktif',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kelompok_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anggota_kelompok" (
    "id" TEXT NOT NULL,
    "kelompok_id" TEXT NOT NULL,
    "siswa_id" TEXT NOT NULL,
    "harga_privat" INTEGER NOT NULL,
    "fee_tutor" INTEGER NOT NULL,

    CONSTRAINT "anggota_kelompok_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laporan_kelompok" (
    "id" TEXT NOT NULL,
    "kelompok_id" TEXT NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "jumlah_kelompok" INTEGER NOT NULL,
    "harga_kelompok_final" INTEGER,
    "materi_dipelajari" TEXT,
    "pemahaman_materi" INTEGER NOT NULL,
    "keaktifan_belajar" INTEGER NOT NULL,
    "kemandirian" INTEGER NOT NULL,
    "kedisiplinan" INTEGER NOT NULL,
    "catatan_siswa" TEXT,
    "saran_bimbel" TEXT,
    "norek_tutor" TEXT,
    "status_bayar_ortu" TEXT NOT NULL DEFAULT 'belum',
    "status_bayar_tutor" TEXT NOT NULL DEFAULT 'belum',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "laporan_kelompok_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anggota_laporan_kelompok" (
    "id" TEXT NOT NULL,
    "laporan_kelompok_id" TEXT NOT NULL,
    "siswa_id" TEXT NOT NULL,
    "jumlah_individu" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "anggota_laporan_kelompok_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "anggota_kelompok_kelompok_id_siswa_id_key" ON "anggota_kelompok"("kelompok_id", "siswa_id");

-- CreateIndex
CREATE UNIQUE INDEX "laporan_kelompok_kelompok_id_bulan_tahun_key" ON "laporan_kelompok"("kelompok_id", "bulan", "tahun");

-- CreateIndex
CREATE UNIQUE INDEX "anggota_laporan_kelompok_laporan_kelompok_id_siswa_id_key" ON "anggota_laporan_kelompok"("laporan_kelompok_id", "siswa_id");

-- AddForeignKey
ALTER TABLE "kelompok" ADD CONSTRAINT "kelompok_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "tutor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anggota_kelompok" ADD CONSTRAINT "anggota_kelompok_kelompok_id_fkey" FOREIGN KEY ("kelompok_id") REFERENCES "kelompok"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anggota_kelompok" ADD CONSTRAINT "anggota_kelompok_siswa_id_fkey" FOREIGN KEY ("siswa_id") REFERENCES "siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporan_kelompok" ADD CONSTRAINT "laporan_kelompok_kelompok_id_fkey" FOREIGN KEY ("kelompok_id") REFERENCES "kelompok"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anggota_laporan_kelompok" ADD CONSTRAINT "anggota_laporan_kelompok_laporan_kelompok_id_fkey" FOREIGN KEY ("laporan_kelompok_id") REFERENCES "laporan_kelompok"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anggota_laporan_kelompok" ADD CONSTRAINT "anggota_laporan_kelompok_siswa_id_fkey" FOREIGN KEY ("siswa_id") REFERENCES "siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
