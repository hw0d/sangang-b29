import type { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Upserts the admin account from SEED_ADMIN_USERNAME / SEED_ADMIN_PASSWORD.
// Safe to call on every boot: Render's free plan has no Shell/SSH access, so
// this can't rely on someone manually running a seed script after deploy —
// it runs as part of the start command instead, keeping the account in sync
// with whatever those env vars currently say.
export async function ensureAdminUser(prisma: PrismaClient) {
  const username = process.env.SEED_ADMIN_USERNAME;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!username || !password) {
    console.log(
      "SEED_ADMIN_USERNAME / SEED_ADMIN_PASSWORD not set — skipping admin account bootstrap."
    );
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { username },
    update: { passwordHash, role: "ADMIN" },
    create: { username, passwordHash, role: "ADMIN" },
  });

  console.log(`Admin account ready: ${username}`);
}
