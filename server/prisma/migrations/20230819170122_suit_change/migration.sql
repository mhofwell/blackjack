/*
  Warnings:

  - The values [CLUB,SPADE,DIAMOND,HEART] on the enum `Suit` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Suit_new" AS ENUM ('CLUBS', 'SPADES', 'DIAMONDS', 'HEARTS');
ALTER TABLE "Entry" ALTER COLUMN "suit" TYPE "Suit_new" USING ("suit"::text::"Suit_new");
ALTER TYPE "Suit" RENAME TO "Suit_old";
ALTER TYPE "Suit_new" RENAME TO "Suit";
DROP TYPE "Suit_old";
COMMIT;
