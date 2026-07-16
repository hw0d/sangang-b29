import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [profileCount, groupCount] = await Promise.all([
    prisma.profile.count(),
    prisma.group.count(),
  ]);

  return (
    <div className="space-y-4">
      <fieldset>
        <legend>Dashboard</legend>
        <div className="flex flex-wrap gap-3">
          <div className="field-border" style={{ minWidth: 130, padding: 8 }}>
            <p className="text-lg font-bold text-center">{profileCount}</p>
            <p className="text-[11px] text-center">Profiles</p>
          </div>
          <div className="field-border" style={{ minWidth: 130, padding: 8 }}>
            <p className="text-lg font-bold text-center">{groupCount}</p>
            <p className="text-[11px] text-center">Groups</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <Link href="/admin/profiles/new" className="toolbar-btn">
            ➕ New Profile
          </Link>
          <Link href="/admin/groups/new" className="toolbar-btn">
            ➕ New Group
          </Link>
        </div>
      </fieldset>
    </div>
  );
}
