import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // Check if we're using a libsql URL (Turso)
  const databaseUrl = process.env.DATABASE_URL || "";
  const isLibSQL = databaseUrl.startsWith("libsql://");

  if (isLibSQL) {
    // For Turso/libSQL in production
    // The adapter is automatically used when DATABASE_URL starts with libsql://
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }

  // For local SQLite development
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
