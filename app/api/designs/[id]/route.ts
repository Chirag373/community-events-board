import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { visibleEvent } from "@/lib/events";
import { handle, json } from "@/lib/http";
import { designInput } from "@/lib/validation";
export const GET = handle(async (request) => {
  const user = await requireUser(request);
  const eventId = new URL(request.url).pathname.split("/").pop()!;
  await visibleEvent(eventId);
  const design = await db.cardDesign.findUnique({
    where: { userId_eventId: { userId: user.id, eventId } },
  });
  return json({
    design: design
      ? { theme: design.theme, stickers: design.stickers }
      : { theme: "sage", stickers: [] },
  });
});
export const PUT = handle(async (request) => {
  const user = await requireUser(request);
  const eventId = new URL(request.url).pathname.split("/").pop()!;
  await visibleEvent(eventId);
  const data = designInput.parse(await request.json());
  await db.cardDesign.upsert({
    where: { userId_eventId: { userId: user.id, eventId } },
    update: data,
    create: { userId: user.id, eventId, ...data },
  });
  return json({ design: data });
});
