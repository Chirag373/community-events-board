import "dotenv/config";
import { resolve } from "node:path";
import { defineConfig } from "prisma/config";
// Resolve from the project root so CLI and runtime use exactly the same file.
const url = process.env.DATABASE_URL || "file:./prisma/dev.db";
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: `file:${resolve(url.replace(/^file:/, ""))}` },
});
