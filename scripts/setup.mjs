import {
  existsSync,
  writeFileSync,
  mkdirSync,
  openSync,
  closeSync,
} from "node:fs";
import { randomBytes } from "node:crypto";
import { execFileSync } from "node:child_process";
if (!existsSync(".env"))
  writeFileSync(
    ".env",
    `DATABASE_URL="file:./prisma/dev.db"\nJWT_SECRET="${randomBytes(32).toString("hex")}"\n`,
  );
mkdirSync("prisma", { recursive: true });
if (!existsSync("prisma/dev.db")) closeSync(openSync("prisma/dev.db", "w"));
for (const args of [
  ["prisma", "generate", "--config", "prisma7.config.ts"],
  ["prisma", "migrate", "deploy", "--config", "prisma7.config.ts"],
  ["--import", "tsx", "prisma/seed.ts"],
])
  execFileSync(args[0] === "--import" ? "node" : "npx", args, {
    stdio: "inherit",
  });
