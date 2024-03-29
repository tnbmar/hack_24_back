import prisma from "../../database/index.js";
import { encodeToken } from "../../utils/encodeToken.js";
import sha256 from "sha256";

class UserService {
  async createUser(newUserDto) {
    const { username, password, email, address } = newUserDto;
    try {
      const newUser = await prisma.user.create({
        data: { username, password: sha256(password), email, address },
      });
      const regReward = await prisma.reward.findFirst({ where: { status: "AUTH" } });
      if (regReward) {
        await prisma.user.update({
          where: { id: newUser.id },
          data: {
            rewards: {
              connect: {
                id: regReward.id,
              },
            },
          },
        });
      } else {
        const newReward = await prisma.reward.create({
          data: {
            status: "AUTH",
            name: "Авторизация",
            icon: "https://i.ibb.co/ys376Xd/867594176-app-icon-big-1441389202.jpg",
          },
        });
        await prisma.user.update({
          where: { id: newUser.id },
          data: {
            rewards: {
              connect: {
                id: newReward.id,
              },
            },
          },
        });
      }
      return newUser;
    } catch (e) {
      console.error({ e });
    }
  }

  async getUserById(id) {
    try {
      const user = await prisma.user.findFirst({
        where: { id },

        include: { rewards: true },
      });
      if (!user) throw new Error("Пользователь не найден");
      return user;
    } catch (e) {
      throw new Error(e);
    }
  }

  async getAllUsers() {
    try {
      const users = await prisma.user.findMany();
      if (!users) throw new Error("Пользователь не найден");
      return users;
    } catch (e) {
      throw new Error(e);
    }
  }

  async getUserByToken(token) {
    const id = encodeToken(token);
    if (id) {
      const user = await this.getUserById(id);
      return user;
    } else {
      throw new Error("Not authorization");
    }
  }

  async getStats(token) {
    const id = encodeToken(token);
    if (id) {
      try {
        const user = await prisma.user.findFirst({
          where: { id },
          include: {
            firstMatches: true,
            secondMatches: true,
            winnedMatches: true,
          },
        });
        const alMatches = user.firstMatches.length + user.secondMatches.length;
        if (!user) throw new Error("Пользователь не найден");
        return {
          match_count: alMatches,
          win_count: user.winnedMatches.length,
          rating_percent: Math.ceil((user.winnedMatches.length * 100) / alMatches),
        };
      } catch (e) {
        throw new Error(e);
      }
    } else {
      throw new Error("Not authorization");
    }
  }

  async getUserByUsernameAndPassword(username, password) {
    try {
      const user = await prisma.user.findFirst({
        where: { username, password: sha256(password) },
      });
      return user;
    } catch (error) {
      return;
    }
  }

  async deleteUser({ id }) {
    await prisma.user.delete({ where: { id } });
  }
}

export default new UserService();
