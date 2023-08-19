/*
  Warnings:

  - You are about to drop the column `division` on the `Entry` table. All the data in the column will be lost.
  - Added the required column `pool` to the `Entry` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Pool" AS ENUM ('UK', 'CANADA');

-- AlterTable
ALTER TABLE "Entry" DROP COLUMN "division",
ADD COLUMN     "pool" "Pool" NOT NULL;

-- DropEnum
DROP TYPE "Division";
