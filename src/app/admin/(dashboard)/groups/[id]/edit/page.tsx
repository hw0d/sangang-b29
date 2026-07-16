import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateGroup } from "@/app/admin/actions";
import { GroupForm } from "../../GroupForm";

export const dynamic = "force-dynamic";

export default async function EditGroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const group = await prisma.group.findUnique({ where: { id } });
  if (!group) notFound();

  const action = updateGroup.bind(null, id);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Edit Group</h1>
      <GroupForm action={action} group={group} />
    </div>
  );
}
