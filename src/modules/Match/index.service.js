import prisma from "../../database/index.js";

class MatchService {
  async getMatchtById(id) {
    try {
      const match = await prisma.tournament.findFirst({
        where: { id },
      });
      if (!match) throw new Error("Матч не найден");
      return match;
    } catch (e) {
      throw new Error(e);
    }
  }

  async getMatchtByTourId(id) { 
    try {
      const matches = await prisma.match.findMany({
        where: { tournamentId: id },
      });
      if (!matches) throw new Error("Матчи не найдены");
      return matches;
    } catch (e) {
      throw new Error(e);
    }
  }

  async getMatches() {
    try {
      const list = await prisma.match.findMany({});
      if (!list) throw new Error("Матчи не найдены");
      return list;
    } catch (e) {
      throw new Error(e);
    }
  }
}

export default new MatchService();
