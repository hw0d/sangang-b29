import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { PersonCard } from "@/components/PersonCard";
import { formatStatus } from "@/lib/utils";
import type { Prisma, ProfileStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const STATUSES: ProfileStatus[] = [
  "AT_LARGE",
  "IN_CUSTODY",
  "ON_PROBATION",
  "DECEASED",
  "UNKNOWN",
];

export default async function ProfilesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; group?: string }>;
}) {
  const { q, status, group } = await searchParams;
  const session = await auth();

  const where: Prisma.ProfileWhereInput = {};
  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { alias: { contains: q, mode: "insensitive" } },
    ];
  }
  if (status && STATUSES.includes(status as ProfileStatus)) {
    where.status = status as ProfileStatus;
  }
  if (group) {
    where.groupId = group;
  }

  const [profiles, groups] = await Promise.all([
    prisma.profile.findMany({
      where,
      orderBy: { fullName: "asc" },
      include: { group: { select: { name: true } } },
    }),
    prisma.group.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div className="space-y-4">
      <fieldset>
        <legend>Records &rarr; Profiles</legend>
        <div className="flex items-center justify-between">
          <h1>Individual Profiles</h1>
          {session?.user && (
            <Link href="/admin/profiles/new" className="toolbar-btn">
              ➕ New Profile
            </Link>
          )}
        </div>
      </fieldset>

      <fieldset>
        <legend>Filter</legend>
        <form className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search name or alias..."
            style={{ minWidth: 200 }}
          />
          <select name="status" defaultValue={status ?? ""}>
            <option value="">Any status</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {formatStatus(s)}
              </option>
            ))}
          </select>
          <select name="group" defaultValue={group ?? ""}>
            <option value="">Any group</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
          <button type="submit">Filter</button>
          {(q || status || group) && (
            <Link href="/profiles" className="toolbar-btn">
              Clear
            </Link>
          )}
        </form>
      </fieldset>

      <p className="text-xs">
        {profiles.length} result{profiles.length === 1 ? "" : "s"}
      </p>

      {profiles.length === 0 ? (
        <div className="sunken-panel text-center text-sm" style={{ padding: 24 }}>
          No profiles match this search.
        </div>
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
    </div>
  );
}
