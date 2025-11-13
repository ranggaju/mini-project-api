import { Request, Response, NextFunction } from "express";
import { getAllEvents, getEventBySlug } from "../services/event.service";
import { Prisma } from "@prisma/client";

export async function getEventBySlugController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { slug } = req.params;
    const data = await getEventBySlug(slug);

    res.json({
      message: "OK",
      data,
    });
  } catch (err) {
    next(err);
  }
}

export async function getAllEventsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      page,
      pageSize,
      q,
      title,
      category,
      location,
      date,
      start,
      end,
      minPrice,
      maxPrice,
      sort,
    } = req.query;
    const pageNum = page ? Number(page) : 1;
    const pageSizeNum = pageSize ? Number(pageSize) : 12;

    const filter: Prisma.EventWhereInput = {};

    if (q) {
      const qStr = String(q);
      filter.OR = [
        {
          title: {
            contains: qStr,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: qStr,
            mode: "insensitive",
          },
        },
        {
          location: {
            contains: qStr,
            mode: "insensitive",
          },
        },
      ];
    }
    if (title) {
      filter.title = String(title);
    }
    if (category) {
      filter.category = String(category);
    }
    if (location) {
      filter.location = String(location);
    }

    const now = new Date();

    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const endOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );
    const startOfTomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );
    const endOfTomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 2
    );

    if (date === "today") {
      filter.startDate = {
        gte: startOfToday,
        lt: endOfToday,
      };
    } else if (date === "tomorrow") {
      filter.startDate = {
        gte: startOfTomorrow,
        lt: endOfTomorrow,
      };
    } else if (date === "weekend") {
      const day = now.getDay();

      const startOfSaturday = new Date(startOfToday);
      startOfSaturday.setDate(startOfSaturday.getDate() + ((6 - day + 7) % 7));
      const endOfSunday = new Date(startOfSaturday);
      endOfSunday.setDate(startOfSaturday.getDate() + 2);

      filter.startDate = {
        gte: startOfSaturday,
        lt: endOfSunday,
      };
    } else if (date === "upcoming") {
      filter.startDate = {
        gte: now,
      };
    } else if (date === "range") {
      filter.startDate = {
        gte: new Date(String(start)),
        lte: new Date(String(end)),
      };
    }

    if (minPrice != null || maxPrice != null) {
      filter.price = {
        gte: minPrice != null ? Number(minPrice) : 0,
        lte: maxPrice != null ? Number(maxPrice) : Number.MAX_SAFE_INTEGER,
      };
    }

    const data = await getAllEvents(
      pageNum,
      pageSizeNum,
      filter,
      (sort as any) || "newest"
    );

    res.json({
      message: "OK",
      data,
    });
  } catch (err) {
    next(err);
  }
}
