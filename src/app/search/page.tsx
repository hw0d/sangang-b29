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
    <div className="space-y-4">
      <fieldset>
        <legend>Records &rarr; Search</legend>
        <h1>Search Records</h1>
      </fieldset>

      <fieldset>
        <legend>Find</legend>
        <form className="flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={query}
            autoFocus
            placeholder="Search profiles or groups by name..."
            className="flex-1"
          />
          <button type="submit">Search</button>
        </form>
      </fieldset>

      {!query ? (
        <p className="text-sm">
          Enter a name or alias to search across profiles and groups.
        </p>
      ) : (
        <>
          <fieldset>
            <legend>Profiles ({profiles.length})</legend>
            {profiles.length === 0 ? (
              <p className="text-sm">No matching profiles.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
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
          </fieldset>

          <fieldset>
            <legend>Groups ({groups.length})</legend>
            {groups.length === 0 ? (
              <p className="text-sm">No matching groups.</p>
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
          </fieldset>
        </>
      )}
    </div>
  );
}
