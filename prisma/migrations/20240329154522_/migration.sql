-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_winner_id_fkey";

-- AlterTable
ALTER TABLE "Match" ALTER COLUMN "winner_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
