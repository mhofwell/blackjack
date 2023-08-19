/*
  Warnings:

  - Changed the type of `season` on the `Entry` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Entry" DROP COLUMN "season",
ADD COLUMN     "season" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Entry_userId_season_league_key" ON "Entry"("userId", "season", "league");
