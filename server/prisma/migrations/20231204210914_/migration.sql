/*
  Warnings:

  - You are about to drop the `KickoffTime` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "KickoffTime";

-- CreateTable
CREATE TABLE "Kickoff" (
    "id" SERIAL NOT NULL,
    "game_week_id" INTEGER NOT NULL,
    "number_of_fixtures" INTEGER NOT NULL,
    "kickoff_time" TEXT NOT NULL,
    "ms_kickoff_time" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Kickoff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Kickoff_id_key" ON "Kickoff"("id");
