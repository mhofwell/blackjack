/*
  Warnings:

  - The primary key for the `Club` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `Club` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `club_id` on the `Player` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_club_id_fkey";

-- AlterTable
ALTER TABLE "Club" DROP CONSTRAINT "Club_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "Club_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "club_id",
ADD COLUMN     "club_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Club_id_key" ON "Club"("id");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
