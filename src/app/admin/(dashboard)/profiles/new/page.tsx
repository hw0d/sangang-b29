import { prisma } from "@/lib/prisma";
import { createProfile } from "@/app/admin/actions";
import { ProfileForm } from "../ProfileForm";

export const dynamic = "force-dynamic";

export default async function NewProfilePage() {
  const groups = await prisma.group.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-4">
      <h1>New Profile</h1>
      <ProfileForm action={createProfile} groups={groups} />
    </div>
  );
}
