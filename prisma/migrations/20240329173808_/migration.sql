-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "winner_id" INTEGER;

-- CreateTable
CREATE TABLE "Reward" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RewardToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RewardToUser_AB_unique" ON "_RewardToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RewardToUser_B_index" ON "_RewardToUser"("B");

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RewardToUser" ADD CONSTRAINT "_RewardToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Reward"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RewardToUser" ADD CONSTRAINT "_RewardToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
