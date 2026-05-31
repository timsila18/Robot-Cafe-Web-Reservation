import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required for Robot Cafe reservation API.");
}

const adapter = new PrismaPg({ connectionString });

export const prisma = globalThis.robotCafePrisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalThis.robotCafePrisma = prisma;
}
