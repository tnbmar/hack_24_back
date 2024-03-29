import { Router } from "express";
import matchtService from "./index.service.js";
import userService from "../User/index.service.js";

import checkError from "../../utils/checkError.js";

export const matchController = Router();

matchController.get("/matches", async (req, res) => {
  // #swagger.tags = ['Match']
  try {
    const token = req.headers.authorization;
    if (!token) throw Error("token field empty");
    const list = await matchtService.getMatches(token);
    res.status(200).json({ list });
  } catch (error) {
    console.log(error);
    const errorStatus = checkError(error);
    res.status(errorStatus.status).json(errorStatus.message);
  }
});

matchController.get("/matches/:tourId", async (req, res) => {
  // #swagger.tags = ['Match']
  try {
    const token = req.headers.authorization;

    if (!token) throw Error("token field empty");
    const user = await userService.getUserByToken(token);
    const matches = user && (await matchtService.getMatchtByTourId(+req.params.id));
    res.status(200).json(matches);
  } catch (error) {
    const errorStatus = checkError(error);
    res.status(errorStatus.status).json(errorStatus.message);
  }
});

matchController.get("/matches/:id", async (req, res) => {
  // #swagger.tags = ['Match']
  try {
    const token = req.headers.authorization;

    if (!token) throw Error("token field empty");
    const user = await userService.getUserByToken(token);
    const match = user && (await matchtService.getMatchtById(+req.params.id));
    res.status(200).json(match);
  } catch (error) {
    const errorStatus = checkError(error);
    res.status(errorStatus.status).json(errorStatus.message);
  }
});
