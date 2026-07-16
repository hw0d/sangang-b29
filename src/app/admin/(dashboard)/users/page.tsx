import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdminRole } from "@/lib/adminAuth";
import { deleteAdminUser } from "@/app/admin/users/actions";
import { formatDate, formatStaffPosition } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await requireAdminRole();

  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1>Manage User Accounts</h1>
        <Link href="/admin/users/new" className="toolbar-btn">
          ➕ New User
        </Link>
      </div>

      <div className="sunken-panel" style={{ padding: 0 }}>
        <table className="w-full">
          <thead>
            <tr>
              <th>Username</th>
              <th>Access Level</th>
              <th>Position</th>
              <th>Created</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  {u.username}
                  {u.id === session.user.id && (
                    <span className="text-[11px]"> (you)</span>
                  )}
                </td>
                <td>{u.role === "ADMIN" ? "Admin" : "Staff"}</td>
                <td>{formatStaffPosition(u.position) ?? "—"}</td>
                <td>{formatDate(u.createdAt)}</td>
                <td>
                  <div className="flex justify-end items-center gap-2">
                    <Link href={`/admin/users/${u.id}/edit`}>Edit</Link>
                    {u.id !== session.user.id && (
                      <form action={deleteAdminUser.bind(null, u.id)}>
                        <button type="submit">Delete</button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
