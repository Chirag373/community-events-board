import { visibleEvent } from "@/lib/events";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { handle, json } from "@/lib/http";
export const GET = handle(async (request) => {
  const id = new URL(request.url).pathname.split("/").pop()!;
  const event = await visibleEvent(id);
  const user = await getCurrentUser(request);
  const reminder =
    user &&
    (await db.reminder.findUnique({
      where: { userId_eventId: { userId: user.id, eventId: id } },
    }));
  return json({ event: { ...event, reminded: !!reminder } });
});
