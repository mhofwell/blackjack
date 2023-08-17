/*
  Warnings:

  - You are about to drop the column `netGoals` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `ownGoals` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `netGoals` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `ownGoals` on the `Player` table. All the data in the column will be lost.
  - Added the required column `club_id` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Entry" DROP COLUMN "netGoals",
DROP COLUMN "ownGoals",
ADD COLUMN     "net_goals" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "own_goals" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "netGoals",
DROP COLUMN "ownGoals",
ADD COLUMN     "club_id" TEXT NOT NULL,
ADD COLUMN     "net_goals" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "own_goals" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Club" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Club_id_key" ON "Club"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Club_name_key" ON "Club"("name");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
