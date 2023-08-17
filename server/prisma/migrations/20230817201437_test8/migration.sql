/*
  Warnings:

  - Changed the type of `team_id` on the `Player` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "team_id",
ADD COLUMN     "team_id" INTEGER NOT NULL;
