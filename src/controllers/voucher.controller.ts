import type { Request, Response, NextFunction } from "express";
import {
  createVoucher,
  getVouchersByEventId,
} from "../services/voucher.service";

export async function createVoucherController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const payload = req.body as {
      code: string;
      discountAmount: number;
      expiredAt: string;
      maxUsage?: number;
    };

    const data = await createVoucher(id, payload);

    res.status(201).json({
      message: "OK",
      data,
    });
  } catch (err) {
    next(err);
  }
}

export async function getEventVouchersController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const data = await getVouchersByEventId(id);

    res.status(200).json({
      message: "OK",
      data,
    });
  } catch (err) {
    next(err);
  }
}
