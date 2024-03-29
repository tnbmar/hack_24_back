/*
  Warnings:

  - Made the column `first_player_id` on table `Match` required. This step will fail if there are existing NULL values in that column.
  - Made the column `second_player_id` on table `Match` required. This step will fail if there are existing NULL values in that column.
  - Made the column `winner_id` on table `Match` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tournamentId` on table `Match` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_first_player_id_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_second_player_id_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_winner_id_fkey";

-- AlterTable
ALTER TABLE "Match" ALTER COLUMN "first_player_id" SET NOT NULL,
ALTER COLUMN "second_player_id" SET NOT NULL,
ALTER COLUMN "winner_id" SET NOT NULL,
ALTER COLUMN "first_score" DROP NOT NULL,
ALTER COLUMN "second_score" DROP NOT NULL,
ALTER COLUMN "tournamentId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_first_player_id_fkey" FOREIGN KEY ("first_player_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_second_player_id_fkey" FOREIGN KEY ("second_player_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
