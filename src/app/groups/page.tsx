import { prisma } from "@/lib/prisma";
import { GroupCard } from "@/components/GroupCard";

export const dynamic = "force-dynamic";

export default async function GroupsPage() {
  const groups = await prisma.group.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { members: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="font-record text-xs uppercase tracking-widest text-accent mb-1">
          Records &rarr; Groups
        </p>
        <h1 className="text-2xl font-semibold">Known Groups</h1>
        <p className="text-muted text-sm mt-1">
          {groups.length} group{groups.length === 1 ? "" : "s"} on file.
        </p>
      </div>

      {groups.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted text-sm">
          No groups on file yet.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
