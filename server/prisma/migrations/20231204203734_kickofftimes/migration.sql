/*
  Warnings:

  - You are about to drop the `Fixtures` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Fixtures";

-- CreateTable
CREATE TABLE "KickoffTime" (
    "id" SERIAL NOT NULL,
    "game_week_id" INTEGER NOT NULL,
    "number_of_fixtures" INTEGER NOT NULL,
    "kickoff_time" TEXT NOT NULL,
    "ms_kickoff_time" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "KickoffTime_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KickoffTime_id_key" ON "KickoffTime"("id");
