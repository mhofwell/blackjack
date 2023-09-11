/*
  Warnings:

  - You are about to drop the column `gameWeekId` on the `Fixtures` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfGames` on the `Fixtures` table. All the data in the column will be lost.
  - Added the required column `game_week_id` to the `Fixtures` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number_of_games` to the `Fixtures` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fixtures" DROP COLUMN "gameWeekId",
DROP COLUMN "numberOfGames",
ADD COLUMN     "game_week_id" INTEGER NOT NULL,
ADD COLUMN     "number_of_games" INTEGER NOT NULL;
