import prisma from "../lib/prisma";
import { createCustomError } from "../utils/customError";

export type CreateVoucherParams = {
  code: string;
  discountAmount: number;
  expiredAt: string;
  maxUsage?: number;
};

export async function createVoucher(
  eventId: string,
  params: CreateVoucherParams
) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true },
    });

    if (!event) {
      throw createCustomError(404, "Event not found");
    }

    const expired = new Date(params.expiredAt);
    if (Number.isNaN(expired.getTime())) {
      throw createCustomError(400, "Invalid expiredAt date");
    }

    if (expired <= new Date()) {
      throw createCustomError(400, "Expired date must be in the future");
    }

    const voucher = await prisma.voucher.create({
      data: {
        eventId: event.id,
        code: params.code,
        discountAmount: params.discountAmount,
        expiredAt: expired,
        maxUsage: params.maxUsage,
      },
    });

    return voucher;
  } catch (err) {
    throw err;
  }
}

export async function getVouchersByEventId(eventId: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true },
    });

    if (!event) {
      throw createCustomError(404, "Event not found");
    }

    const vouchers = await prisma.voucher.findMany({
      where: { eventId: event.id },
      orderBy: { createdAt: "desc" },
    });

    return vouchers;
  } catch (err) {
    throw err;
  }
}
