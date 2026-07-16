import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [profileCount, groupCount] = await Promise.all([
    prisma.profile.count(),
    prisma.group.count(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="font-record text-2xl font-semibold text-accent">
            {profileCount}
          </p>
          <p className="text-xs text-muted uppercase tracking-wide mt-1">
            Profiles
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="font-record text-2xl font-semibold text-accent">
            {groupCount}
          </p>
          <p className="text-xs text-muted uppercase tracking-wide mt-1">
            Groups
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/admin/profiles/new" className="btn-primary">
          + New Profile
        </Link>
        <Link href="/admin/groups/new" className="btn-secondary">
          + New Group
        </Link>
      </div>
    </div>
  );
}
