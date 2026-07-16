import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminRole } from "@/lib/adminAuth";
import { updateAdminUser } from "@/app/admin/users/actions";
import { UserForm } from "../../UserForm";

export const dynamic = "force-dynamic";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminRole();
  const { id } = await params;

  const user = await prisma.adminUser.findUnique({ where: { id } });
  if (!user) notFound();

  const action = updateAdminUser.bind(null, id);

  return (
    <div className="space-y-4">
      <h1>Edit User: {user.username}</h1>
      <UserForm action={action} user={user} />
    </div>
  );
}
