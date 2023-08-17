/*
  Warnings:

  - You are about to drop the column `club_id` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Club` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_club_id_fkey";

-- DropIndex
DROP INDEX "User_email_idx";

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "club_id";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
ALTER COLUMN "password" SET DEFAULT 'eplblackjack';

-- DropTable
DROP TABLE "Club";
