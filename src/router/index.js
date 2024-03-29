import { userController } from "../modules/User/index.controller.js";
import { authController } from "../modules/Auth/index.controller.js";

const customControllers = [userController, authController];

export default customControllers;
