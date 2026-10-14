import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { createToken, setSession } from "@/lib/auth";
import { ApiError, handle, json } from "@/lib/http";
import { credentials } from "@/lib/validation";

export const POST = handle(async (request) => {
  const { email, password } = credentials.parse(await request.json());
  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser)
    throw new ApiError(409, "This email is already registered. Please log in.");

  const passwordHash = await hash(password, 12);
  // The unique email constraint also protects against two simultaneous signups.
  let user;
  try {
    user = await db.user.create({ data: { email, passwordHash } });
  } catch (error) {
    if ((error as { code?: string }).code === "P2002") {
      throw new ApiError(409, "This email is already registered.");
    }
    throw error;
  }

  const token = await createToken(user.id);
  await setSession(token);
  return json(
    { token, user: { id: user.id, email: user.email, role: user.role } },
    201,
  );
});
