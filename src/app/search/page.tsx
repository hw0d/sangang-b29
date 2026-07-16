import { prisma } from "@/lib/prisma";
import { PersonCard } from "@/components/PersonCard";
import { GroupCard } from "@/components/GroupCard";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim();

  const [profiles, groups] = query
    ? await Promise.all([
        prisma.profile.findMany({
          where: {
            OR: [
              { fullName: { contains: query, mode: "insensitive" } },
              { alias: { contains: query, mode: "insensitive" } },
            ],
          },
          include: { group: { select: { name: true } } },
          take: 24,
        }),
        prisma.group.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { aliases: { contains: query, mode: "insensitive" } },
            ],
          },
          include: { _count: { select: { members: true } } },
          take: 12,
        }),
      ])
    : [[], []];

  return (
    <div className="space-y-6">
      <div>
        <p className="font-record text-xs uppercase tracking-widest text-accent mb-1">
          Records &rarr; Search
        </p>
        <h1 className="text-2xl font-semibold">Search Records</h1>
      </div>

      <form className="flex gap-3 rounded-lg border border-border bg-surface p-4 font-record text-sm">
        <input
          type="text"
          name="q"
          defaultValue={query}
          autoFocus
          placeholder="Search profiles or groups by name..."
          className="flex-1 bg-surface-raised border border-border rounded px-3 py-2 focus:outline-none focus:border-accent"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded bg-accent text-accent-foreground font-semibold hover:opacity-90 transition-opacity"
        >
          Search
        </button>
      </form>

      {!query ? (
        <p className="text-sm text-muted">
          Enter a name or alias to search across profiles and groups.
        </p>
      ) : (
        <>
          <section>
            <h2 className="font-record uppercase tracking-wide text-sm text-muted mb-3">
              Profiles ({profiles.length})
            </h2>
            {profiles.length === 0 ? (
              <p className="text-sm text-muted">No matching profiles.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {profiles.map((p) => (
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
            <h2 className="font-record uppercase tracking-wide text-sm text-muted mb-3">
              Groups ({groups.length})
            </h2>
            {groups.length === 0 ? (
              <p className="text-sm text-muted">No matching groups.</p>
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
          </section>
        </>
      )}
    </div>
  );
}
