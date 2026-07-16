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
    <div className="space-y-4">
      <fieldset>
        <legend>Case File Access</legend>
        <h1>LSSCPATF Records System</h1>
        <p className="mt-2 max-w-2xl">
          Central records system for gangs, crews, and known criminal
          affiliates operating in Los Santos. Browse group profiles,
          individual case files, tattoo &amp; marking references, and
          affiliate networks.
        </p>
        <div className="mt-3 flex gap-2">
          <Link href="/profiles" className="toolbar-btn">
            🪪 Browse Profiles
          </Link>
          <Link href="/groups" className="toolbar-btn">
            🗂️ Browse Groups
          </Link>
        </div>
      </fieldset>

      <fieldset>
        <legend>System Status</legend>
        <div className="flex flex-wrap gap-3">
          <StatTile label="Profiles on file" value={profileCount} />
          <StatTile label="Known groups" value={groupCount} />
          <StatTile
            label="Active groups"
            value={recentGroups.filter((g) => g.status === "ACTIVE").length}
          />
          <StatTile label="Recent entries" value={recentProfiles.length} />
        </div>
      </fieldset>

      <fieldset>
        <legend>Recently Added Profiles</legend>
        <div className="flex items-center justify-end mb-2">
          <Link href="/profiles" className="text-xs">
            View all &rarr;
          </Link>
        </div>
        {recentProfiles.length === 0 ? (
          <EmptyState message="No profiles on file yet." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
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
      </fieldset>

      <fieldset>
        <legend>Recently Added Groups</legend>
        <div className="flex items-center justify-end mb-2">
          <Link href="/groups" className="text-xs">
            View all &rarr;
          </Link>
        </div>
        {recentGroups.length === 0 ? (
          <EmptyState message="No groups on file yet." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
      </fieldset>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="field-border" style={{ minWidth: 130, padding: 8 }}>
      <p className="text-lg font-bold text-center">{value}</p>
      <p className="text-[11px] text-center">{label}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="sunken-panel text-center text-sm" style={{ padding: 24 }}>
      {message}
    </div>
  );
}
