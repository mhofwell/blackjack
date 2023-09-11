/*
  Warnings:

  - You are about to drop the column `number_of_games` on the `Fixtures` table. All the data in the column will be lost.
  - Added the required column `number_of_fixtures` to the `Fixtures` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fixtures" DROP COLUMN "number_of_games",
ADD COLUMN     "number_of_fixtures" INTEGER NOT NULL;
