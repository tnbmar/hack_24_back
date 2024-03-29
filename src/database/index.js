import { PrismaClient } from "@prisma/client";
import createTournament from "../web3/createTournament.js";

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  const result = await next(params);
  if (params.action === "create" && params.model === "Tournament") {
    createTournament();
  }
  return result;
});

export default prisma;
