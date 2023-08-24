/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Entry` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Pool` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Entry_id_key" ON "Entry"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Pool_id_key" ON "Pool"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
