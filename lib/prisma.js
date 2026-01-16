import {PrismaClient} from '../generated/prisma/client.js';
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['query', 'error', 'warn', 'info'],
  // For SQLite, we use the better-sqlite3 adapter for improved performance and reliability
  /*adapter: new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? ''
  })*/
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL,
  })
});

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}
