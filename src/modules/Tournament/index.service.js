import prisma from "../../database/index.js";

class TournamentService {
  async createTournament(newTourDto) {
    const { name, icon } = newTourDto;
    try {
      const newTour = await prisma.tournament.create({
        data: { name, icon },
      });
      return newTour;
    } catch (e) {
      console.error({ e });
    }
  }

  async getTournamentById(id) {
    try {
      const tournament = await prisma.tournament.findFirst({
        where: { id },
      });
      if (!tournament) throw new Error("Турнир не найден");
      return tournament;
    } catch (e) {
      throw new Error(e);
    }
  }

  async getTournaments() {
    try {
      const list = await prisma.tournament.findMany({
        include: {
          users: true,
        },
      });
      if (!list) throw new Error("Турниры не найдены");
      return list;
    } catch (e) {
      throw new Error(e);
    }
  }

  async participateInTournament(data, userId) {
    const { tournamentId } = data;
    if (!tournamentId) throw new Error("ID не обнаружен");
    const currentTournament = await prisma.tournament.findFirst({
      where: { id: Number(tournamentId) },
    });
    try {
      if (currentTournament) {
        const updatedTournament = await prisma.tournament.update({
          where: { id: Number(tournamentId) },
          include: { users: true },
          data: {
            users: {
              connect: { id: userId },
            },
          },
          include: { users: true },
        });
        return updatedTournament;
      } else {
        throw new Error("ID не обнаружен");
      }
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }

  async deleteTournament({ id }) {
    await prisma.user.delete({ where: { id } });
  }
}

export default new TournamentService();
