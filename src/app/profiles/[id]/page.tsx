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
    <div className="space-y-8">
      <Link href="/profiles" className="text-xs text-accent hover:underline">
        &larr; All profiles
      </Link>

      <div className="grid sm:grid-cols-[220px_1fr] gap-6">
        <div className="space-y-3">
          <div className="aspect-square rounded-lg overflow-hidden border border-border bg-surface-raised relative">
            {profile.mugshotImageId ? (
              <Image
                src={`/api/images/${profile.mugshotImageId}`}
                alt={profile.fullName}
                fill
                sizes="220px"
                className="object-cover"
              />
            ) : (
              <MugshotPlaceholder className="w-full h-full" />
            )}
          </div>
          <StatusBadge status={profile.status} />
        </div>

        <div className="min-w-0">
          <h1 className="text-2xl font-semibold font-record">
            {profile.fullName}
          </h1>
          {profile.alias && (
            <p className="text-accent font-record mt-0.5">
              &quot;{profile.alias}&quot;
            </p>
          )}
          {profile.group && (
            <p className="text-sm text-muted mt-1">
              Affiliation:{" "}
              <Link
                href={`/groups/${profile.group.slug}`}
                className="text-accent hover:underline"
              >
                {profile.group.name}
              </Link>
              {profile.rank && ` (${profile.rank})`}
            </p>
          )}

          {profile.description && (
            <p className="mt-4 text-sm text-foreground/90 max-w-2xl">
              {profile.description}
            </p>
          )}

          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 font-record text-sm">
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
          </dl>

          {profile.notes && (
            <div className="mt-6 rounded border border-border bg-surface p-4">
              <p className="text-[11px] uppercase tracking-wide text-muted font-record mb-1">
                Investigator Notes
              </p>
              <p className="text-sm">{profile.notes}</p>
            </div>
          )}
        </div>
      </div>

      <section>
        <h2 className="font-record uppercase tracking-wide text-sm text-muted mb-3">
          Tattoos &amp; Markings
        </h2>
        {profile.tattoos.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted text-sm">
            No tattoos or markings on file.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {profile.tattoos.map((t) => (
              <div
                key={t.id}
                className="rounded-lg border border-border bg-surface overflow-hidden"
              >
                <div className="aspect-square relative bg-surface-raised">
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
                <div className="p-3 font-record">
                  {t.bodyLocation && (
                    <p className="text-xs font-semibold">{t.bodyLocation}</p>
                  )}
                  {t.meaning && (
                    <p className="text-[11px] text-muted mt-0.5">
                      {t.meaning}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-record uppercase tracking-wide text-sm text-muted mb-3">
          Known Affiliates
        </h2>
        {affiliates.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted text-sm">
            No known affiliates on file.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {affiliates.map((a, i) => (
              <Link
                key={i}
                href={`/profiles/${a.profile.id}`}
                className="flex items-center gap-3 rounded-lg border border-border bg-surface hover:border-accent/60 transition-colors p-3"
              >
                <div className="w-12 h-12 shrink-0 rounded overflow-hidden bg-surface-raised relative">
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
                  <p className="font-record text-sm font-semibold truncate">
                    {a.profile.fullName}
                  </p>
                  <p className="text-[11px] text-accent font-record">
                    {formatLinkType(a.type)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase text-muted">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
