import { PrismaClient } from "@prisma/client";
import { ensureAdminUser } from "./lib/ensureAdmin";

const prisma = new PrismaClient();

ensureAdminUser(prisma)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
