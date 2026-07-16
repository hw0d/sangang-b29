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
        <h1>Manage Profiles</h1>
        <Link href="/admin/profiles/new" className="toolbar-btn">
          ➕ New Profile
        </Link>
      </div>

      <div className="sunken-panel" style={{ padding: 0 }}>
        <table className="w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Group</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.fullName}
                  {p.alias && <span className="italic"> &quot;{p.alias}&quot;</span>}
                </td>
                <td>{p.group?.name ?? "—"}</td>
                <td>
                  <StatusBadge status={p.status} />
                </td>
                <td>
                  <div className="flex justify-end items-center gap-2">
                    <Link href={`/profiles/${p.id}`}>View</Link>
                    <Link href={`/admin/profiles/${p.id}/edit`}>Edit</Link>
                    <form action={deleteProfile.bind(null, p.id)}>
                      <button type="submit">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {profiles.length === 0 && (
          <p className="p-6 text-center text-sm">No profiles yet.</p>
        )}
      </div>
    </div>
  );
}
