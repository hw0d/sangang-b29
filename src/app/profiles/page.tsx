import Link from "next/link";
import { prisma } from "@/lib/prisma";
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
    <div className="space-y-6">
      <div>
        <p className="font-record text-xs uppercase tracking-widest text-accent mb-1">
          Records &rarr; Profiles
        </p>
        <h1 className="text-2xl font-semibold">Individual Profiles</h1>
      </div>

      <form className="flex flex-wrap gap-3 rounded-lg border border-border bg-surface p-4 font-record text-sm">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search name or alias..."
          className="flex-1 min-w-[200px] bg-surface-raised border border-border rounded px-3 py-2 focus:outline-none focus:border-accent"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="bg-surface-raised border border-border rounded px-3 py-2 focus:outline-none focus:border-accent"
        >
          <option value="">Any status</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {formatStatus(s)}
            </option>
          ))}
        </select>
        <select
          name="group"
          defaultValue={group ?? ""}
          className="bg-surface-raised border border-border rounded px-3 py-2 focus:outline-none focus:border-accent"
        >
          <option value="">Any group</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-accent text-accent-foreground font-semibold hover:opacity-90 transition-opacity"
        >
          Filter
        </button>
        {(q || status || group) && (
          <Link
            href="/profiles"
            className="px-4 py-2 rounded border border-border hover:border-accent hover:text-accent transition-colors"
          >
            Clear
          </Link>
        )}
      </form>

      <p className="text-xs text-muted font-record">
        {profiles.length} result{profiles.length === 1 ? "" : "s"}
      </p>

      {profiles.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted text-sm">
          No profiles match this search.
        </div>
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
    </div>
  );
}
