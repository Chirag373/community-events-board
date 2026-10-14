import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { visibleEvent } from "@/lib/events";
import { handle, json } from "@/lib/http";
export const PUT = handle(async (request) => {
  const user = await requireUser(request);
  const eventId = new URL(request.url).pathname.split("/").pop()!;
  await visibleEvent(eventId);
  const { reminded } = z
    .object({ reminded: z.boolean() })
    .parse(await request.json());
  const where = { userId_eventId: { userId: user.id, eventId } };
  if (reminded)
    await db.reminder.upsert({
      where,
      update: {},
      create: { userId: user.id, eventId },
    });
  else await db.reminder.deleteMany({ where: { userId: user.id, eventId } });
  return json({ reminded });
});
