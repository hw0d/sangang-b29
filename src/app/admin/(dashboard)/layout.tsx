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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <nav className="flex gap-1 text-sm font-record">
          <Link
            href="/admin"
            className="px-3 py-1.5 rounded hover:bg-surface-raised transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/groups"
            className="px-3 py-1.5 rounded hover:bg-surface-raised transition-colors"
          >
            Groups
          </Link>
          <Link
            href="/admin/profiles"
            className="px-3 py-1.5 rounded hover:bg-surface-raised transition-colors"
          >
            Profiles
          </Link>
        </nav>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
          className="flex items-center gap-3"
        >
          <span className="text-xs text-muted font-record">
            Signed in as {session.user.name}
          </span>
          <button type="submit" className="btn-secondary">
            Sign out
          </button>
        </form>
      </div>
      {children}
    </div>
  );
}
