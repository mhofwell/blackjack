/*
  Warnings:

  - You are about to drop the column `standing` on the `Entry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Entry" DROP COLUMN "standing",
ADD COLUMN     "rank" TEXT;
