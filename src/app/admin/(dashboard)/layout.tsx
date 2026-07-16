import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { formatStaffPosition } from "@/lib/utils";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const position = formatStaffPosition(session.user.position);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1">
          <Link href="/admin" className="toolbar-btn">
            🖥️ Dashboard
          </Link>
          <Link href="/admin/groups" className="toolbar-btn">
            🗂️ Groups
          </Link>
          <Link href="/admin/profiles" className="toolbar-btn">
            🪪 Profiles
          </Link>
          {session.user.role === "ADMIN" && (
            <Link href="/admin/users" className="toolbar-btn">
              🧑‍💼 Users
            </Link>
          )}
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
          className="flex items-center gap-2"
        >
          <span className="text-xs">
            Signed in as {session.user.name}
            {position ? ` (${position})` : ""}
          </span>
          <button type="submit">Sign out</button>
        </form>
      </div>
      {children}
    </div>
  );
}
