import { redirect } from "next/navigation";
import { auth } from "@/auth";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }
  return session;
}

export async function requireAdminRole() {
  const session = await requireAdmin();
  if (session.user.role !== "ADMIN") {
    redirect("/admin");
  }
  return session;
}
