import { Router } from "express";
import tournamentService from "./index.service.js";
import userService from "../User/index.service.js";

import checkError from "../../utils/checkError.js";

export const tournamentController = Router();

tournamentController.get("/tournaments", async (req, res) => {
  // #swagger.tags = ['Tournament']
  try {
    const token = req.headers.authorization;
    if (!token) throw Error("token field empty");
    const list = await tournamentService.getTournaments(token);
    res.status(200).json({ list });
  } catch (error) {
    console.log(error);
    const errorStatus = checkError(error);
    res.status(errorStatus.status).json(errorStatus.message);
  }
});

tournamentController.post("/tournaments/participate", async (req, res) => {
  // #swagger.tags = ['Tournament']
  /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Some description...',
            schema: {
                tournamentId:"0",
                
            }
    } */
  try {
    const token = req.headers.authorization;
    if (!token) throw Error("token field empty");
    const user = await userService.getUserByToken(token);
    const task =
      user && (await tournamentService.participateInTournament(req.body, user.id));
    res.status(200).json(task);
  } catch (error) {
    const errorStatus = checkError(error);
    res.status(errorStatus.status).json(errorStatus.message);
  }
});

tournamentController.get("/tournaments/:id", async (req, res) => {
  // #swagger.tags = ['Tournament']
  try {
    const token = req.headers.authorization;

    if (!token) throw Error("token field empty");
    const user = await userService.getUserByToken(token);
    const tournament =
      user && (await tournamentService.getTournamentById(+req.params.id));
    res.status(200).json(tournament);
  } catch (error) {
    const errorStatus = checkError(error);
    res.status(errorStatus.status).json(errorStatus.message);
  }
});

tournamentController.delete("/tournaments/:id", async (req, res) => {
  // #swagger.tags = ['Tournament']
  try {
    const token = req.headers.authorization;

    if (!token) throw Error("token field empty");
    const user = await userService.getUserByToken(token);
    const tournament = user && (await tournamentService.deleteTournament(+req.params.id));
    res.status(200).json(tournament);
  } catch (error) {
    const errorStatus = checkError(error);
    res.status(errorStatus.status).json(errorStatus.message);
  }
});

tournamentController.post("/tournaments", async (req, res) => {
  // #swagger.tags = ['Tournament']
  /*  #swagger.parameters['obj'] = {
                in: 'body',
                description: '',
                schema: {
                    $name: 'Test',
                    $icon: 'https://img.ru'


                }
        } */
  try {
    const token = req.headers.authorization;
    if (!token) throw Error("token field empty");
    const user = await userService.getUserByToken(token);
    const tournament = user && (await tournamentService.createTournament(req.body));
    res.status(200).json(tournament);
  } catch (error) {
    const errorStatus = checkError(error);
    res.status(errorStatus.status).json(errorStatus.message);
  }
});
