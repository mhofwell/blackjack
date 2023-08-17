/*
  Warnings:

  - Added the required column `team_id` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "team_id" TEXT NOT NULL;
