import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { ApiError, handle, json } from "@/lib/http";
export const PATCH = handle(async (request) => {
  await requireAdmin(request);
  const id = new URL(request.url).pathname.split("/").pop()!;
  const data = z.object({ active: z.boolean() }).parse(await request.json());
  if (!(await db.event.findUnique({ where: { id } })))
    throw new ApiError(404, "Event not found.");
  return json({ event: await db.event.update({ where: { id }, data }) });
});
