/*
  Warnings:

  - Added the required column `region` to the `Pool` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pool" ADD COLUMN     "region" "Region" NOT NULL;
