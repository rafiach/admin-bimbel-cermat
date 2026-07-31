/*
  Warnings:

  - You are about to drop the column `no_rek_ortu` on the `siswa` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "siswa" DROP COLUMN "no_rek_ortu",
ADD COLUMN     "nama_ortu" TEXT;
