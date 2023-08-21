/*
  Warnings:

  - A unique constraint covering the columns `[id,userId]` on the table `Entry` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Entry_userId_season_league_key";

-- CreateIndex
CREATE UNIQUE INDEX "Entry_id_userId_key" ON "Entry"("id", "userId");
