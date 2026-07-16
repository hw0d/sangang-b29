import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PersonCard } from "@/components/PersonCard";
import { GroupCard } from "@/components/GroupCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [profileCount, groupCount, recentProfiles, recentGroups] =
    await Promise.all([
      prisma.profile.count(),
      prisma.group.count(),
      prisma.profile.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { group: { select: { name: true } } },
      }),
      prisma.group.findMany({
        orderBy: { createdAt: "desc" },
        take: 3,
        include: { _count: { select: { members: true } } },
      }),
    ]);

  return (
    <div className="space-y-12">
      <section className="rounded-lg border border-border bg-surface p-6">
        <p className="font-record text-xs uppercase tracking-widest text-accent mb-2">
          Case File Access
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold">
          SANGANG Records System
        </h1>
        <p className="mt-2 text-muted max-w-2xl">
          A fictional roleplay database of gangs, crews, and known
          affiliates. Browse group profiles, individual case files, tattoo
          &amp; marking references, and affiliate networks.
        </p>
        <div className="mt-4 flex gap-3 text-sm font-record">
          <Link
            href="/profiles"
            className="px-4 py-2 rounded bg-accent text-accent-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            Browse Profiles
          </Link>
          <Link
            href="/groups"
            className="px-4 py-2 rounded border border-border hover:border-accent hover:text-accent transition-colors"
          >
            Browse Groups
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatTile label="Profiles on file" value={profileCount} />
        <StatTile label="Known groups" value={groupCount} />
        <StatTile
          label="Active groups"
          value={recentGroups.filter((g) => g.status === "ACTIVE").length}
        />
        <StatTile label="Recent entries" value={recentProfiles.length} />
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-record uppercase tracking-wide text-sm text-muted">
            Recently Added Profiles
          </h2>
          <Link href="/profiles" className="text-xs text-accent hover:underline">
            View all &rarr;
          </Link>
        </div>
        {recentProfiles.length === 0 ? (
          <EmptyState message="No profiles on file yet." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {recentProfiles.map((p) => (
              <PersonCard
                key={p.id}
                id={p.id}
                fullName={p.fullName}
                alias={p.alias}
                status={p.status}
                mugshotImageId={p.mugshotImageId}
                groupName={p.group?.name}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-record uppercase tracking-wide text-sm text-muted">
            Recently Added Groups
          </h2>
          <Link href="/groups" className="text-xs text-accent hover:underline">
            View all &rarr;
          </Link>
        </div>
        {recentGroups.length === 0 ? (
          <EmptyState message="No groups on file yet." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentGroups.map((g) => (
              <GroupCard
                key={g.id}
                slug={g.slug}
                name={g.name}
                status={g.status}
                territory={g.territory}
                symbolImageId={g.symbolImageId}
                memberCount={g._count.members}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="font-record text-2xl font-semibold text-accent">
        {value}
      </p>
      <p className="text-xs text-muted uppercase tracking-wide mt-1">
        {label}
      </p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted text-sm">
      {message}
    </div>
  );
}
