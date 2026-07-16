import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PersonCard } from "@/components/PersonCard";
import { StatusBadge } from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const group = await prisma.group.findUnique({
    where: { slug },
    include: {
      members: {
        orderBy: { fullName: "asc" },
      },
    },
  });

  if (!group) notFound();

  return (
    <div className="space-y-8">
      <Link href="/groups" className="text-xs text-accent hover:underline">
        &larr; All groups
      </Link>

      <div className="flex flex-col sm:flex-row gap-6 rounded-lg border border-border bg-surface p-6">
        <div className="w-28 h-28 shrink-0 rounded bg-surface-raised border border-border overflow-hidden relative flex items-center justify-center mx-auto sm:mx-0">
          {group.symbolImageId ? (
            <Image
              src={`/api/images/${group.symbolImageId}`}
              alt={group.name}
              fill
              sizes="112px"
              className="object-cover"
            />
          ) : (
            <span className="font-record text-2xl text-muted">
              {group.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold font-record">
              {group.name}
            </h1>
            <StatusBadge status={group.status} />
          </div>
          {group.aliases && (
            <p className="text-sm text-accent mt-0.5">
              aka {group.aliases}
            </p>
          )}
          {group.description && (
            <p className="text-sm text-foreground/90 mt-3 max-w-2xl">
              {group.description}
            </p>
          )}
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 font-record text-sm">
            {group.territory && (
              <div>
                <dt className="text-[11px] uppercase text-muted">
                  Territory
                </dt>
                <dd>{group.territory}</dd>
              </div>
            )}
            {group.colors && (
              <div>
                <dt className="text-[11px] uppercase text-muted">Colors</dt>
                <dd>{group.colors}</dd>
              </div>
            )}
            <div>
              <dt className="text-[11px] uppercase text-muted">Members</dt>
              <dd>{group.members.length}</dd>
            </div>
          </dl>
        </div>
      </div>

      <section>
        <h2 className="font-record uppercase tracking-wide text-sm text-muted mb-3">
          Known Members
        </h2>
        {group.members.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted text-sm">
            No members on file for this group.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {group.members.map((m) => (
              <PersonCard
                key={m.id}
                id={m.id}
                fullName={m.fullName}
                alias={m.alias}
                status={m.status}
                mugshotImageId={m.mugshotImageId}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
