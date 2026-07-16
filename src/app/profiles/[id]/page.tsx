import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MugshotPlaceholder } from "@/components/MugshotPlaceholder";
import { StatusBadge } from "@/components/StatusBadge";
import {
  formatDate,
  formatLinkType,
  inverseLinkType,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProfileDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const profile = await prisma.profile.findUnique({
    where: { id },
    include: {
      group: { select: { id: true, name: true, slug: true } },
      tattoos: { include: { image: true }, orderBy: { createdAt: "asc" } },
      linksFrom: {
        include: {
          toProfile: {
            select: { id: true, fullName: true, alias: true, status: true, mugshotImageId: true },
          },
        },
      },
      linksTo: {
        include: {
          fromProfile: {
            select: { id: true, fullName: true, alias: true, status: true, mugshotImageId: true },
          },
        },
      },
    },
  });

  if (!profile) notFound();

  const affiliates = [
    ...profile.linksFrom.map((l) => ({
      profile: l.toProfile,
      type: l.type,
      note: l.note,
    })),
    ...profile.linksTo.map((l) => ({
      profile: l.fromProfile,
      type: inverseLinkType(l.type),
      note: l.note,
    })),
  ];

  return (
    <div className="space-y-4">
      <Link href="/profiles" className="text-xs">
        &larr; All profiles
      </Link>

      <fieldset>
        <legend>Case File</legend>
        <div className="grid sm:grid-cols-[160px_1fr] gap-4">
          <div className="space-y-2">
            <div className="win-card-thumb aspect-square">
              {profile.mugshotImageId ? (
                <Image
                  src={`/api/images/${profile.mugshotImageId}`}
                  alt={profile.fullName}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              ) : (
                <MugshotPlaceholder className="w-full h-full" />
              )}
            </div>
            <StatusBadge status={profile.status} />
          </div>

          <div className="min-w-0">
            <h1>{profile.fullName}</h1>
            {profile.alias && (
              <p className="italic mt-0.5">&quot;{profile.alias}&quot;</p>
            )}
            {profile.group && (
              <p className="text-sm mt-1">
                Affiliation:{" "}
                <Link href={`/groups/${profile.group.slug}`}>
                  {profile.group.name}
                </Link>
                {profile.rank && ` (${profile.rank})`}
              </p>
            )}

            {profile.description && (
              <p className="mt-3 text-sm max-w-2xl">{profile.description}</p>
            )}

            <div className="flex flex-wrap gap-4 mt-3 text-sm">
              <Field label="Date of birth" value={formatDate(profile.dob)} />
              <Field
                label="Height"
                value={profile.heightCm ? `${profile.heightCm} cm` : "Unknown"}
              />
              <Field
                label="Weight"
                value={profile.weightKg ? `${profile.weightKg} kg` : "Unknown"}
              />
              <Field label="Eye color" value={profile.eyeColor ?? "Unknown"} />
              <Field label="Hair color" value={profile.hairColor ?? "Unknown"} />
              <Field label="On file since" value={formatDate(profile.createdAt)} />
            </div>

            {profile.notes && (
              <div className="sunken-panel mt-3" style={{ padding: 8 }}>
                <p className="text-[11px] font-bold mb-1">
                  Investigator Notes
                </p>
                <p className="text-sm">{profile.notes}</p>
              </div>
            )}
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>Tattoos &amp; Markings</legend>
        {profile.tattoos.length === 0 ? (
          <div className="sunken-panel text-center text-sm" style={{ padding: 24 }}>
            No tattoos or markings on file.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {profile.tattoos.map((t) => (
              <div key={t.id}>
                <div className="win-card-thumb aspect-square">
                  {t.imageId ? (
                    <Image
                      src={`/api/images/${t.imageId}`}
                      alt={t.bodyLocation ?? "Tattoo"}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover"
                    />
                  ) : (
                    <MugshotPlaceholder className="w-full h-full" />
                  )}
                </div>
                <div className="mt-1">
                  {t.bodyLocation && (
                    <p className="text-xs font-bold">{t.bodyLocation}</p>
                  )}
                  {t.meaning && (
                    <p className="win-card-meta text-[11px]">{t.meaning}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend>Known Affiliates</legend>
        {affiliates.length === 0 ? (
          <div className="sunken-panel text-center text-sm" style={{ padding: 24 }}>
            No known affiliates on file.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {affiliates.map((a, i) => (
              <Link
                key={i}
                href={`/profiles/${a.profile.id}`}
                className="win-card flex items-center gap-3"
              >
                <div className="win-card-thumb w-12 h-12 shrink-0">
                  {a.profile.mugshotImageId ? (
                    <Image
                      src={`/api/images/${a.profile.mugshotImageId}`}
                      alt={a.profile.fullName}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <MugshotPlaceholder className="w-full h-full" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold truncate">
                    {a.profile.fullName}
                  </p>
                  <p className="text-[11px]">{formatLinkType(a.type)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </fieldset>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px]">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}
