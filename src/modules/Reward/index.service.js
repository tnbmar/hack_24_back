import prisma from "../../database/index.js";

class RewardService {
  async getAllRewards() {
    try {
      const rewards = await prisma.reward.findMany();
      if (!rewards) throw new Error("Награды не найдены");
      return rewards;
    } catch (e) {
      throw new Error(e);
    }
  }
  async checkFirstMatch(first, second) {
    const regReward = await prisma.reward.findFirst({ where: { status: "MATCH" } });
    const firstPlayer = await prisma.user.findFirst({
      where: { id: first },
      include: { winnedMatches: true },
    });
    const secondPlayer = await prisma.user.findFirst({
      where: { id: second },
      include: { winnedMatches: true },
    });
    if (firstPlayer.winnedMatches.length === 1) {
      await prisma.user.update({
        where: { id: first },
        data: {
          rewards: {
            connect: {
              id: regReward.id,
            },
          },
        },
      });
    }

    if (secondPlayer.winnedMatches.length === 1) {
      await prisma.user.update({
        where: { id: second },
        data: {
          rewards: {
            connect: {
              id: regReward.id,
            },
          },
        },
      });
    }
  }
}

export default new RewardService();
