import prisma from "../../database/index.js";
import shuffleArray from "../../utils/shuffleArray.js";

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

  async createMatches(id) {
    try {
      const updatedTournament = await prisma.tournament.findFirst({
        where: { id },
        include: { users: true },
      });
      const users = updatedTournament.users;
      const shuffledUsers = shuffleArray(users);
      for (let i = 0; i < 4; i++) {
        const firstPlayer = shuffledUsers[i * 2];
        const secondPlayer = shuffledUsers[i * 2 + 1];
        const match = await prisma.match.create({
          data: {
            first_player: { connect: { id: firstPlayer.id } },
            second_player: { connect: { id: secondPlayer.id } },
            tournament: { connect: { id: updatedTournament.id } },
            index: 1,
          },
        });
        console.log(match);
      }
      await prisma.tournament.update({
        where: { id },
        data: {
          status: "NOW",
        },
      });
    } catch (e) {
      throw new Error(e);
    }
  }
  async checkGroupMatches(id) {
    const groupMatches = await prisma.match.findMany({
      where: {
        tournamentId: id,
        index: 1,
      },
    });
    const winMatches = groupMatches.filter((elem) => elem.winner_id !== null);
    const notGroupMatch = await prisma.match.findMany({
      where: {
        NOT: {
          index: 1,
        },
      },
    });
    if (winMatches.length === 4 && notGroupMatch.length === 0) {
      this.createPlayoffMathes(id);
    }
  }
  async createPlayoffMathes(id) {
    const winnersMatches = await prisma.match.findMany({
      where: {
        tournamentId: id,
        index: 1,
      },
      orderBy: {
        id: "asc",
      },
    });

    await prisma.match.create({
      data: {
        first_player: { connect: { id: winnersMatches[0].winner_id } },
        second_player: { connect: { id: winnersMatches[1].winner_id } },
        tournament: { connect: { id } },
        index: 2,
      },
    });

    await prisma.match.create({
      data: {
        first_player: { connect: { id: winnersMatches[2].winner_id } },
        second_player: { connect: { id: winnersMatches[3].winner_id } },
        tournament: { connect: { id } },
        index: 2,
      },
    });
  }
  async checkPlayOffMatches(id) {
    const playOffMatches = await prisma.match.findMany({
      where: {
        tournamentId: id,
        index: 2,
      },
    });
    const winMatches = playOffMatches.filter((elem) => elem.winner_id !== null);

    const notFinalMatch = await prisma.match.findMany({
      where: {
        index: 3,
      },
    });

    if (winMatches.length === 2 && notFinalMatch.length === 0) {
      this.createFinalMatch(id);
    }
  }

  async createFinalMatch(id) {
    const winnersMatches = await prisma.match.findMany({
      where: {
        tournamentId: id,
        index: 2,
      },
      orderBy: {
        id: "asc",
      },
    });

    await prisma.match.create({
      data: {
        first_player: { connect: { id: winnersMatches[0].winner_id } },
        second_player: { connect: { id: winnersMatches[1].winner_id } },
        tournament: { connect: { id } },
        index: 3,
      },
    });
  }
  async checkFinalMatch(id) {
    const finalMatch = await prisma.match.findMany({
      where: {
        tournamentId: id,
        index: 3,
      },
    });
    const winMatches = finalMatch.filter((elem) => elem.winner_id !== null);
    if (winMatches.length === 1) {
      await prisma.tournament.update({
        where: { id },
        data: {
          status: "FINISHED",
          winner: { connect: { id: winMatches[0].winner_id } },
        },
      });
    }
  }
}

export default new MatchService();
