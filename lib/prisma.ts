import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import PG from "pg";

const adapter = new PrismaPg({
  connectionString: process.env.PRISMA_DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

export default prisma;
