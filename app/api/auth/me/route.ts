import { getCurrentUser } from "@/lib/auth";
import { handle, json } from "@/lib/http";

export const GET = handle(async (request) => {
  return json({ user: await getCurrentUser(request) });
});
