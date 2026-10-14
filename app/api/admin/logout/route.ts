import { cookies } from "next/headers";
import { handle, json } from "@/lib/http";

export const POST = handle(async () => {
  (await cookies()).delete("session");
  return json({ ok: true });
});
