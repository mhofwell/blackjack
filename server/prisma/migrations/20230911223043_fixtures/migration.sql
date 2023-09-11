-- CreateTable
CREATE TABLE "Fixtures" (
    "id" SERIAL NOT NULL,
    "gameWeekId" INTEGER NOT NULL,
    "numberOfGames" INTEGER NOT NULL,
    "kickoff_time" TEXT NOT NULL,
    "ms_kickoff_time" INTEGER NOT NULL,

    CONSTRAINT "Fixtures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Fixtures_id_key" ON "Fixtures"("id");
