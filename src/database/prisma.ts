import "dotenv/config";
import { resolve } from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../../generated/prisma/client.js";

const dbPath = resolve(import.meta.dirname, "../../prisma/dev.db");

const adapter = new PrismaBetterSqlite3({
  url: `file:${dbPath}`,
});

export const prisma = new PrismaClient({ adapter });
