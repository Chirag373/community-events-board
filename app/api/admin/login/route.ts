import { compare } from "bcryptjs";
import { db } from "@/lib/db";
import { createToken, setSession } from "@/lib/auth";
import { ApiError, handle, json } from "@/lib/http";
import { credentials } from "@/lib/validation";

export const POST = handle(async (request) => {
  const { email, password } = credentials.parse(await request.json());
  const user = await db.user.findUnique({ where: { email } });
  if (!user || !(await compare(password, user.passwordHash))) {
    throw new ApiError(401, "Email or password is incorrect.");
  }

  if (user.role !== "ADMIN") throw new ApiError(403, "Admin access required.");

  const token = await createToken(user.id);
  await setSession(token);
  return json({
    token,
    user: { id: user.id, email: user.email, role: user.role },
  });
});
