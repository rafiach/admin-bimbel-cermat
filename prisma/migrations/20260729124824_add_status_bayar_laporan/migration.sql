-- AlterTable
ALTER TABLE "laporan_bulanan" ADD COLUMN     "status_bayar_ortu" TEXT NOT NULL DEFAULT 'belum',
ADD COLUMN     "status_bayar_tutor" TEXT NOT NULL DEFAULT 'belum';

-- AlterTable
ALTER TABLE "tutor" ALTER COLUMN "alamat" DROP NOT NULL;
