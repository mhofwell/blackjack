/*
  Warnings:

  - Added the required column `division` to the `Entry` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `league` on the `Entry` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Division" AS ENUM ('EUROPE', 'NORTH_AMERICA');

-- CreateEnum
CREATE TYPE "League" AS ENUM ('EPL');

-- AlterTable
ALTER TABLE "Entry" ADD COLUMN     "division" "Division" NOT NULL,
DROP COLUMN "league",
ADD COLUMN     "league" "League" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Entry_userId_season_league_key" ON "Entry"("userId", "season", "league");
