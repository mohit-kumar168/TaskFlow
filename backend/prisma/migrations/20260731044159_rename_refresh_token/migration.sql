/*
  Warnings:

  - You are about to drop the column `hashedAccessToken` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `accounts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "hashedAccessToken",
DROP COLUMN "refreshToken",
ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "hashedRefreshToken" TEXT;
