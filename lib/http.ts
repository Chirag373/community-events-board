import { connection } from "next/server";
import { z } from "zod";
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
// Wrap each route in the same try/catch, so every screen receives JSON errors.
// The route function below only needs to check permissions and do its work.
export function handle(fn: (request: Request) => Promise<Response>) {
  return async (request: Request) => {
    await connection();
    try {
      if (!["GET", "HEAD"].includes(request.method)) {
        const origin = request.headers.get("origin");
        if (origin && new URL(origin).host !== request.headers.get("host"))
          throw new ApiError(403, "Cross-origin request rejected.");
      }
      return await fn(request);
    } catch (error) {
      if (error instanceof ApiError)
        return Response.json(
          { error: error.message },
          { status: error.status },
        );
      if (error instanceof z.ZodError)
        return Response.json(
          { error: error.issues[0].message },
          { status: 400 },
        );
      if (error instanceof SyntaxError)
        return Response.json({ error: "Invalid JSON body." }, { status: 400 });
      console.error(error);
      return Response.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 },
      );
    }
  };
}
export const json = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
