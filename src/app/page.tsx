import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PersonCard } from "@/components/PersonCard";
import { GroupCard } from "@/components/GroupCard";
import { CrestSeal } from "@/components/CrestSeal";

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
        <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
          <CrestSeal className="w-28 h-28 shrink-0" />
          <div className="min-w-0 text-center sm:text-left">
            <h1>C.R.E.S.T. Records System</h1>
            <p className="text-xs italic mt-0.5">
              Criminal Racketeering Enforcement &amp; STEP Task Force — a
              joint operation of the Los Santos Police Department and the
              Los Santos Sheriff&apos;s Department. &ldquo;Two Badges, One
              Spreadsheet.&rdquo;
            </p>
            <p className="mt-2 max-w-2xl text-sm">
              Central records system for gangs, crews, and known criminal
              affiliates operating in Los Santos. Browse group profiles,
              individual case files, tattoo &amp; marking references, and
              affiliate networks.
            </p>
            <div className="mt-3 flex gap-2 justify-center sm:justify-start">
              <Link href="/profiles" className="toolbar-btn">
                🪪 Browse Profiles
              </Link>
              <Link href="/groups" className="toolbar-btn">
                🗂️ Browse Groups
              </Link>
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>About C.R.E.S.T.</legend>
        <p className="text-sm max-w-2xl">
          Established after an LSPD detective and an LSSD detective
          discovered they had independently opened three identical case
          files on the same crew, the C.R.E.S.T. Task Force exists to keep
          one moderately accurate record of persons and organizations of
          interest across Los Santos County, instead of two mediocre ones.
        </p>
        <ul className="text-sm mt-2" style={{ paddingLeft: 18, listStyle: "square" }}>
          <li>
            Maintains a database of persons the Task Force finds suspicious,
            pending further suspicion.
          </li>
          <li>
            Coordinates seamlessly between LSPD and LSSD, assuming both
            departments remember their login.
          </li>
          <li>
            Committed to due process, procedural fairness, and finding out
            who tagged the east-side underpass again.
          </li>
          <li>
            Publishes intelligence that is current as of whenever someone
            last got around to updating it.
          </li>
        </ul>
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
