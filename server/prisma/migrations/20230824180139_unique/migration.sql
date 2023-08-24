/*
  Warnings:

  - A unique constraint covering the columns `[userId,poolId,id]` on the table `Entry` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Entry_userId_poolId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Entry_userId_poolId_id_key" ON "Entry"("userId", "poolId", "id");
