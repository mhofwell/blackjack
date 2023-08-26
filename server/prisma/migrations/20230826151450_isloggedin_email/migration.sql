-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT NOT NULL DEFAULT 'test@blackjack.com',
ALTER COLUMN "isLoggedIn" SET DEFAULT false;
