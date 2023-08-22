/*
  Warnings:

  - You are about to drop the column `currentWinner` on the `Entry` table. All the data in the column will be lost.
  - Added the required column `standing` to the `Entry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Entry" DROP COLUMN "currentWinner",
ADD COLUMN     "standing" INTEGER NOT NULL,
ADD COLUMN     "winner" "Winner" NOT NULL DEFAULT 'NO';
