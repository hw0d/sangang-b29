import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteProfile } from "@/app/admin/actions";
import { StatusBadge } from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

export default async function AdminProfilesPage() {
  const profiles = await prisma.profile.findMany({
    orderBy: { fullName: "asc" },
    include: { group: { select: { name: true } } },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Manage Profiles</h1>
        <Link href="/admin/profiles/new" className="btn-primary">
          + New Profile
        </Link>
      </div>

      <div className="rounded-lg border border-border overflow-hidden overflow-x-auto">
        <table className="w-full text-sm font-record">
          <thead className="bg-surface-raised text-left text-[11px] uppercase text-muted">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Group</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-2">
                  {p.fullName}
                  {p.alias && (
                    <span className="text-accent"> &quot;{p.alias}&quot;</span>
                  )}
                </td>
                <td className="px-4 py-2">{p.group?.name ?? "—"}</td>
                <td className="px-4 py-2">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-4 py-2">
                  <div className="flex justify-end items-center gap-3">
                    <Link
                      href={`/profiles/${p.id}`}
                      className="text-muted hover:underline"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/profiles/${p.id}/edit`}
                      className="text-accent hover:underline"
                    >
                      Edit
                    </Link>
                    <form action={deleteProfile.bind(null, p.id)}>
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
        {profiles.length === 0 && (
          <p className="p-6 text-center text-muted text-sm">
            No profiles yet.
          </p>
        )}
      </div>
    </div>
  );
}
