/*
  Warnings:

  - You are about to drop the `_TournamentToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_TournamentToUser" DROP CONSTRAINT "_TournamentToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_TournamentToUser" DROP CONSTRAINT "_TournamentToUser_B_fkey";

-- DropTable
DROP TABLE "_TournamentToUser";

-- CreateTable
CREATE TABLE "UserInTouramnets" (
    "tournamentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    CONSTRAINT "UserInTouramnets_pkey" PRIMARY KEY ("tournamentId","userId")
);

-- AddForeignKey
ALTER TABLE "UserInTouramnets" ADD CONSTRAINT "UserInTouramnets_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInTouramnets" ADD CONSTRAINT "UserInTouramnets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
