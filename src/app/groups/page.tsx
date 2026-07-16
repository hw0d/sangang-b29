import { prisma } from "@/lib/prisma";
import { GroupCard } from "@/components/GroupCard";

export const dynamic = "force-dynamic";

export default async function GroupsPage() {
  const groups = await prisma.group.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { members: true } } },
  });

  return (
    <div className="space-y-4">
      <fieldset>
        <legend>Records &rarr; Groups</legend>
        <h1>Known Groups</h1>
        <p className="text-xs mt-1">
          {groups.length} group{groups.length === 1 ? "" : "s"} on file.
        </p>
      </fieldset>

      {groups.length === 0 ? (
        <div className="sunken-panel text-center text-sm" style={{ padding: 24 }}>
          No groups on file yet.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {groups.map((g) => (
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
    </div>
  );
}
