import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
// Keep one client when Next.js reloads files during development.
const globalDb = globalThis as typeof globalThis & { db?: PrismaClient };
export const db =
  globalDb.db ??
  new PrismaClient({
    adapter: new PrismaBetterSqlite3({
      url: process.env.DATABASE_URL || "file:./prisma/dev.db",
    }),
  });
if (process.env.NODE_ENV !== "production") globalDb.db = db;
