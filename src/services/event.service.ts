import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";
import { createCustomError } from "../utils/customError";

export async function getEventBySlug(slug: string) {
  try {
    const event = prisma.event.findUnique({
      where: { slug },
      include: {
        organizer: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
        ticketType: true,
        voucher: {
          where: {
            expiredAt: {
              gt: new Date(),
            },
          },
        },
        review: {
          select: {
            rating: true,
            comment: true,
            createdAt: true,
          },
        },
      },
    });

    if (!event) {
      throw createCustomError(404, "Event not found");
    }
  } catch (err) {
    throw err;
  }
}

export type PublishedSort =
  | "newest"
  | "oldest"
  | "price_asc"
  | "price_desc"
  | "popular";

export async function getAllEvents(
  page = 1,
  pageSize = 12,
  filter: Prisma.EventWhereInput,
  sort: PublishedSort = "newest"
) {
  try {
    if (filter.title) {
      filter.title = {
        contains: filter.title,
        mode: "insensitive",
      } as any;
      filter.location = {
        contains: filter.location,
        mode: "insensitive",
      } as any;
      filter.category = {
        contains: filter.category,
        mode: "insensitive",
      } as any;
    }

    const where: Prisma.EventWhereInput = { status: "PUBLISHED", ...filter };

    const orderBy: Prisma.EventOrderByWithRelationInput =
      sort === "oldest"
        ? { createdAt: "asc" }
        : sort === "price_asc"
        ? { price: "asc" }
        : sort === "price_desc"
        ? { price: "desc" }
        : { createdAt: "desc" };

    const [items, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          category: true,
          location: true,
          startDate: true,
          endDate: true,
          price: true,
          availableSeats: true,
          bannerImg: true,
          status: true,
        },
      }),
      prisma.event.count({ where }),
    ]);

    return {
      items,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (err) {
    throw err;
  }
}
