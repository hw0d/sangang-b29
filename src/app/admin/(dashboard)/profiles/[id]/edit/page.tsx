import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProfile } from "@/app/admin/actions";
import { ProfileForm } from "../../ProfileForm";
import { TattooManager } from "../../TattooManager";
import { AffiliateManager } from "../../AffiliateManager";

export const dynamic = "force-dynamic";

export default async function EditProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [profile, groups, otherProfiles] = await Promise.all([
    prisma.profile.findUnique({
      where: { id },
      include: {
        tattoos: { orderBy: { createdAt: "asc" } },
        linksFrom: {
          include: {
            toProfile: {
              select: {
                id: true,
                fullName: true,
                alias: true,
                mugshotImageId: true,
              },
            },
          },
        },
      },
    }),
    prisma.group.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.profile.findMany({
      where: { id: { not: id } },
      orderBy: { fullName: "asc" },
      select: { id: true, fullName: true },
    }),
  ]);

  if (!profile) notFound();

  const action = updateProfile.bind(null, id);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-xl font-semibold mb-4">
          Edit Profile: {profile.fullName}
        </h1>
        <ProfileForm action={action} profile={profile} groups={groups} />
      </div>

      <div>
        <h2 className="font-record uppercase tracking-wide text-sm text-muted mb-3">
          Tattoos &amp; Markings
        </h2>
        <TattooManager profileId={id} tattoos={profile.tattoos} />
      </div>

      <div>
        <h2 className="font-record uppercase tracking-wide text-sm text-muted mb-3">
          Known Affiliates
        </h2>
        <AffiliateManager
          profileId={id}
          links={profile.linksFrom}
          otherProfiles={otherProfiles}
        />
      </div>
    </div>
  );
}
