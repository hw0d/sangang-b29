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
        <h1 className="text-xl font-semibold">Manage Groups</h1>
        <Link href="/admin/groups/new" className="btn-primary">
          + New Group
        </Link>
      </div>

      <div className="rounded-lg border border-border overflow-hidden overflow-x-auto">
        <table className="w-full text-sm font-record">
          <thead className="bg-surface-raised text-left text-[11px] uppercase text-muted">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Members</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <tr key={g.id} className="border-t border-border">
                <td className="px-4 py-2">{g.name}</td>
                <td className="px-4 py-2">
                  <StatusBadge status={g.status} />
                </td>
                <td className="px-4 py-2">{g._count.members}</td>
                <td className="px-4 py-2">
                  <div className="flex justify-end items-center gap-3">
                    <Link
                      href={`/admin/groups/${g.id}/edit`}
                      className="text-accent hover:underline"
                    >
                      Edit
                    </Link>
                    <form action={deleteGroup.bind(null, g.id)}>
                      <button type="submit" className="btn-danger">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {groups.length === 0 && (
          <p className="p-6 text-center text-muted text-sm">No groups yet.</p>
        )}
      </div>
    </div>
  );
}
