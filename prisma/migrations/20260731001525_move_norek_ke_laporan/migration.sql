/*
  Warnings:

  - You are about to drop the column `norek_tutor` on the `tutor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "laporan_bulanan" ADD COLUMN     "norek_tutor" TEXT;

-- AlterTable
ALTER TABLE "tutor" DROP COLUMN "norek_tutor";
