/*
  Warnings:

  - The primary key for the `Init` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `fn` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ln` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Winner" AS ENUM ('YES', 'NO');

-- CreateEnum
CREATE TYPE "Suit" AS ENUM ('CLUB', 'SPADE', 'DIAMOND', 'HEART');

-- AlterTable
ALTER TABLE "Init" DROP CONSTRAINT "Init_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Init_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "currentWinner" "Winner" NOT NULL DEFAULT 'NO',
ADD COLUMN     "fn" TEXT NOT NULL,
ADD COLUMN     "ln" TEXT NOT NULL,
ADD COLUMN     "losses" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
ADD COLUMN     "team" TEXT,
ADD COLUMN     "ties" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "wins" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Entry" (
    "id" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "league" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "ownGoals" INTEGER NOT NULL DEFAULT 0,
    "netGoals" INTEGER NOT NULL DEFAULT 0,
    "suit" "Suit" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" INTEGER NOT NULL,
    "avatar" TEXT,
    "fn" TEXT NOT NULL,
    "ln" TEXT NOT NULL,
    "club_id" TEXT NOT NULL,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "ownGoals" INTEGER NOT NULL DEFAULT 0,
    "netGoals" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Club" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EntryToPlayer" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Entry_userId_season_league_key" ON "Entry"("userId", "season", "league");

-- CreateIndex
CREATE UNIQUE INDEX "Player_id_key" ON "Player"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Club_id_key" ON "Club"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Club_name_key" ON "Club"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_EntryToPlayer_AB_unique" ON "_EntryToPlayer"("A", "B");

-- CreateIndex
CREATE INDEX "_EntryToPlayer_B_index" ON "_EntryToPlayer"("B");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EntryToPlayer" ADD CONSTRAINT "_EntryToPlayer_A_fkey" FOREIGN KEY ("A") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EntryToPlayer" ADD CONSTRAINT "_EntryToPlayer_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
