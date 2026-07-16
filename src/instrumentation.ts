// Runs once, automatically, whenever the Next.js server process starts —
// in dev, in production, and regardless of what shell command launched it.
// Used to bootstrap the admin account from SEED_ADMIN_USERNAME /
// SEED_ADMIN_PASSWORD so this doesn't depend on the platform's start
// command being configured correctly (which turned out to be unreliable
// on Render — the dashboard's Start Command override wasn't taking effect
// on deploy).
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { PrismaClient } = await import("@prisma/client");
  const { ensureAdminUser } = await import("../prisma/lib/ensureAdmin");

  const prisma = new PrismaClient();
  try {
    await ensureAdminUser(prisma);
  } catch (error) {
    console.error("[instrumentation] Failed to bootstrap admin account:", error);
  } finally {
    await prisma.$disconnect();
  }
}
