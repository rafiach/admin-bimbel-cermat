/*
  Warnings:

  - You are about to drop the column `mapel` on the `tutor` table. All the data in the column will be lost.
  - Added the required column `alamat` to the `tutor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tutor" DROP COLUMN "mapel",
ADD COLUMN     "alamat" TEXT NOT NULL,
ADD COLUMN     "jenjang" TEXT;
