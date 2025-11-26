import { Router } from "express";
import { authMiddleware, roleGuard } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validate.middleware";
import { voucherCreateSchema } from "../schemas/event.schema";
import {
  createVoucherController,
  getEventVouchersController,
} from "../controllers/voucher.controller";

const voucherRouter = Router();

voucherRouter.get(
  "/:id/vouchers",
  authMiddleware,
  roleGuard(["ADMIN", "ORGANIZER"]),
  getEventVouchersController
);

voucherRouter.post(
  "/:id/vouchers",
  authMiddleware,
  roleGuard(["ADMIN", "ORGANIZER"]),
  validateRequest(voucherCreateSchema),
  createVoucherController
);

export default voucherRouter;
