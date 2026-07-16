import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteGroup } from "@/app/admin/actions";
import { StatusBadge } from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

export default async function AdminGroupsPage() {
  const groups = await prisma.group.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { members: true } } },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1>Manage Groups</h1>
        <Link href="/admin/groups/new" className="toolbar-btn">
          ➕ New Group
        </Link>
      </div>

      <div className="sunken-panel" style={{ padding: 0 }}>
        <table className="w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Members</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <tr key={g.id}>
                <td>{g.name}</td>
                <td>
                  <StatusBadge status={g.status} />
                </td>
                <td>{g._count.members}</td>
                <td>
                  <div className="flex justify-end items-center gap-2">
                    <Link href={`/admin/groups/${g.id}/edit`}>Edit</Link>
                    <form action={deleteGroup.bind(null, g.id)}>
                      <button type="submit">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {groups.length === 0 && (
          <p className="p-6 text-center text-sm">No groups yet.</p>
        )}
      </div>
    </div>
  );
}
