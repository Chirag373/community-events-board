import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { handle, json } from "@/lib/http";
import { categories } from "@/lib/shared";
export const GET = handle(async (request) => {
  const user = await requireUser(request);
  return json({
    categories: (
      await db.favourite.findMany({ where: { userId: user.id } })
    ).map((f) => f.category),
  });
});
export const PUT = handle(async (request) => {
  const user = await requireUser(request);
  const input = z
    .object({ categories: z.array(z.enum(categories)).max(5) })
    .parse(await request.json());
  const selected = [...new Set(input.categories)];
  await db.$transaction([
    db.favourite.deleteMany({ where: { userId: user.id } }),
    db.favourite.createMany({
      data: selected.map((category) => ({ userId: user.id, category })),
    }),
  ]);
  return json({ categories: selected });
});
