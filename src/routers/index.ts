import { Router } from "express";

import authRouter from "./auth.route";
import eventRouter from "./event.router";
import voucherRouter from "./voucher.router";

const router = Router();

router.use("/auth", authRouter);
router.use("/events", eventRouter);
router.use("/events", voucherRouter);

export default router;
