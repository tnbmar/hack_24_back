import { userController } from "../modules/User/index.controller.js";
import { authController } from "../modules/Auth/index.controller.js";
import { tournamentController } from "../modules/Tournament/index.controller.js";
import { matchController } from "../modules/Match/index.controller.js";

const customControllers = [
  userController,
  authController,
  tournamentController,
  matchController,
];

export default customControllers;
