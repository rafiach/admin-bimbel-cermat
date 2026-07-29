-- CreateTable
CREATE TABLE "siswa" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "sekolah" TEXT,
    "kelas" TEXT,
    "no_hp_ortu" TEXT,
    "tanggal_daftar" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'aktif',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "siswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tutor" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "mapel" TEXT,
    "no_hp" TEXT,
    "status" TEXT NOT NULL DEFAULT 'aktif',
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tutor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pertemuan" (
    "id" TEXT NOT NULL,
    "tutor_id" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "mapel" TEXT,
    "tipe" TEXT NOT NULL DEFAULT 'privat',
    "status" TEXT NOT NULL DEFAULT 'terjadwal',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pertemuan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "presensi" (
    "id" TEXT NOT NULL,
    "pertemuan_id" TEXT NOT NULL,
    "siswa_id" TEXT NOT NULL,
    "hadir" BOOLEAN NOT NULL DEFAULT true,
    "harga" INTEGER NOT NULL,
    "status_bayar" TEXT NOT NULL DEFAULT 'belum',
    "tanggal_bayar" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "presensi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tutor_user_id_key" ON "tutor"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "presensi_pertemuan_id_siswa_id_key" ON "presensi"("pertemuan_id", "siswa_id");

-- AddForeignKey
ALTER TABLE "pertemuan" ADD CONSTRAINT "pertemuan_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "tutor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presensi" ADD CONSTRAINT "presensi_pertemuan_id_fkey" FOREIGN KEY ("pertemuan_id") REFERENCES "pertemuan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presensi" ADD CONSTRAINT "presensi_siswa_id_fkey" FOREIGN KEY ("siswa_id") REFERENCES "siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
