import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

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
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
          className="flex items-center gap-2"
        >
          <span className="text-xs">Signed in as {session.user.name}</span>
          <button type="submit">Sign out</button>
        </form>
      </div>
      {children}
    </div>
  );
}
