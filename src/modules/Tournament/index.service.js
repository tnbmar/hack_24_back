import prisma from "../../database/index.js";
import matchService from "../Match/index.service.js";
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
        include: { winner: true },
      });
      const matches = await prisma.match.findMany({
        where: { tournamentId: id },
      });
      const mathesByGroups = matches.reduce((acc, obj) => {
        const index = obj.index;
        if (!acc[index]) {
          acc[index] = [];
        }
        acc[index].push(obj);
        return acc;
      }, {});

      const result = Object.values(mathesByGroups);
      if (!tournament) throw new Error("Турнир не найден");
      return { info: tournament, mathes: result };
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }

  async getTournaments() {
    try {
      const list = await prisma.tournament.findMany({
        include: {
          users: true,
          winner: true,
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
        this.checkTourPlayers(updatedTournament.id);
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

  async checkTourPlayers(id) {
    try {
      const updatedTournament = await prisma.tournament.findFirst({
        where: { id },
        include: { users: true },
      });
      if (updatedTournament) {
        let usersCount = updatedTournament.users.length;
        if (usersCount === 8) {
          matchService.createMatches(updatedTournament.id);
        }
      }
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }
}

export default new TournamentService();
