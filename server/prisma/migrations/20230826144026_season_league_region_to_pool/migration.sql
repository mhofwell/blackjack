/*
  Warnings:

  - You are about to drop the column `league` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `season` on the `Entry` table. All the data in the column will be lost.
  - Added the required column `league` to the `Pool` table without a default value. This is not possible if the table is not empty.
  - Added the required column `season` to the `Pool` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Entry" DROP COLUMN "league",
DROP COLUMN "region",
DROP COLUMN "season";

-- AlterTable
ALTER TABLE "Pool" ADD COLUMN     "league" "League" NOT NULL,
ADD COLUMN     "season" INTEGER NOT NULL;
