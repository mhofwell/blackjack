/*
  Warnings:

  - A unique constraint covering the columns `[userId,poolId]` on the table `Entry` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Entry_id_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Entry_userId_poolId_key" ON "Entry"("userId", "poolId");
