import express from "express";

import {
  registerController,
  loginController,
  verifyEmailController,
  logoutController,
  changeStatusUserController,
  changeAvatarController,
  currentController,
  repeatedVerifyEmailController,
  recoveryPasswordController,
  changePasswordController,
  getAllUsersController,
  getUserController,
  deleteUserController,
  deleteCurrentUserController,
  createPasswordController
} from "../controllers/usersControllers.js";
import {
  authenticate,
  authenticateNotForUser,
  authenticateForAdmin
} from "../generalFiles/authenticate.js";
import { upload } from "../generalFiles/uploadFilles.js";

const usersRouter = express.Router();

usersRouter.post("/register", registerController);
usersRouter.post("/login", loginController);
usersRouter.get("/verify/:verificationToken", verifyEmailController);
usersRouter.post("/logout", authenticate, logoutController);
usersRouter.get("/current", authenticate, currentController);
usersRouter.delete("/current", authenticate, deleteCurrentUserController);
usersRouter.patch(
  "/status",
  authenticateNotForUser,
  changeStatusUserController
);
usersRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  changeAvatarController
);
usersRouter.post("/verify", repeatedVerifyEmailController);
usersRouter.patch("/password", recoveryPasswordController);
usersRouter.patch("/password/:recoveryToken", changePasswordController);
usersRouter.get("/", authenticateNotForUser, getAllUsersController);
usersRouter.patch("/:verificationToken", createPasswordController);
usersRouter.get("/:id", getUserController);
usersRouter.delete("/:id", authenticateForAdmin, deleteUserController);

export default usersRouter;
