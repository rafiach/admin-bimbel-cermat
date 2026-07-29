/*
  Warnings:

  - You are about to drop the column `alamat` on the `tutor` table. All the data in the column will be lost.
  - You are about to drop the column `jenjang` on the `tutor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tutor" DROP COLUMN "alamat",
DROP COLUMN "jenjang",
ADD COLUMN     "mapel" TEXT,
ADD COLUMN     "norek_tutor" TEXT;
