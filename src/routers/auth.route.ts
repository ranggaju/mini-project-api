import { Router } from "express";
import {
  loginController,
  verificationLinkController,
  verifyController,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { registerTokenMiddleware } from "../middlewares/registerToken.middleware";

const authRouter = Router();

authRouter.post("/login", loginController);
authRouter.post("/verification-link", verificationLinkController);
authRouter.post("/verify", registerTokenMiddleware, verifyController);

export default authRouter;