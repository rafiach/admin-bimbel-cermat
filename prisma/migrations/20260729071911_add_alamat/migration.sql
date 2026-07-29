/*
  Warnings:

  - You are about to drop the column `mapel` on the `tutor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tutor" DROP COLUMN "mapel",
ADD COLUMN     "alamat" TEXT,
ADD COLUMN     "jenjang" TEXT;
