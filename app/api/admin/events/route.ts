import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { handle, json } from "@/lib/http";
import { eventInput } from "@/lib/validation";
export const GET = handle(async (request) => {
  await requireAdmin(request);
  return json({
    events: await db.event.findMany({ orderBy: { startsAt: "asc" } }),
  });
});
export const POST = handle(async (request) => {
  await requireAdmin(request);
  const data = eventInput.parse(await request.json());
  return json({ event: await db.event.create({ data }) }, 201);
});
