/*
  Warnings:

  - Added the required column `status` to the `Reward` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RewardType" AS ENUM ('AUTH', 'MATCH', 'MORE_MATCH');

-- AlterTable
ALTER TABLE "Reward" ADD COLUMN     "status" "RewardType" NOT NULL;
