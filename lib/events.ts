import { db } from "./db";
import { getCurrentUser, requireUser } from "./auth";
import { ApiError, json } from "./http";
import { categories } from "./shared";
import type { Prisma } from "@/app/generated/prisma/client";

export async function listEvents(request: Request, feed = false) {
  const params = new URL(request.url).searchParams;
  const page = Number(params.get("page") || 1);
  if (!Number.isInteger(page) || page < 1 || page > 100000)
    throw new ApiError(400, "Invalid page.");
  const category = params.get("category") || "";
  if (category && !categories.some((name) => name === category))
    throw new ApiError(400, "Invalid category.");
  const user = feed
    ? await requireUser(request)
    : await getCurrentUser(request);
  const search = (params.get("q") || "").trim().slice(0, 120);
  const city = (params.get("city") || "").trim().slice(0, 80);

  // Fields in a Prisma where object are combined with AND.
  const where: Prisma.EventWhereInput = {
    active: true,
    startsAt: { gt: new Date() },
  };
  if (category) where.category = category;
  if (city) where.city = city;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ];
  }
  if (feed && user) {
    const favourites = await db.favourite.findMany({
      where: { userId: user.id },
    });
    // Keep this separate so the selected category must also be a favourite.
    where.AND = [
      { category: { in: favourites.map((favourite) => favourite.category) } },
    ];
  }

  const [total, events, cityRows] = await db.$transaction([
    db.event.count({ where }),
    db.event.findMany({
      where,
      orderBy: [{ startsAt: "asc" }, { id: "asc" }],
      skip: (page - 1) * 6,
      take: 6,
      include: {
        reminders: {
          where: { userId: user?.id || "" },
          select: { userId: true },
        },
      },
    }),
    db.event.findMany({
      where: { active: true, startsAt: { gt: new Date() } },
      distinct: ["city"],
      select: { city: true },
      orderBy: { city: "asc" },
    }),
  ]);
  return json({
    events: events.map(({ reminders, ...event }) => ({
      ...event,
      reminded: reminders.length > 0,
    })),
    total,
    page,
    pages: Math.ceil(total / 6),
    cities: cityRows.map((e) => e.city),
  });
}
export async function visibleEvent(id: string) {
  const event = await db.event.findFirst({
    where: { id, active: true, startsAt: { gt: new Date() } },
  });
  if (!event) throw new ApiError(404, "This event is no longer available.");
  return event;
}
