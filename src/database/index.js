import { PrismaClient } from "@prisma/client";
import createTournament from "../web3/createTournament.js";
import matchService from "../modules/Match/index.service.js";
import rewardService from "../modules/Reward/index.service.js";

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  const result = await next(params);
  if (params.action === "create" && params.model === "Tournament") {
    createTournament();
  }
  if (params.model === "Match" && params.action === "update") {
    matchService.checkGroupMatches(params.args.data.tournamentId);
    matchService.checkPlayOffMatches(params.args.data.tournamentId);
    matchService.checkFinalMatch(params.args.data.tournamentId);
    rewardService.checkFirstMatch(
      params.args.data.first_player_id,
      params.args.data.second_player_id
    );
  }
  return result;
});

export default prisma;
