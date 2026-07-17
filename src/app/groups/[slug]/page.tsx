import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { PersonCard } from "@/components/PersonCard";
import { StatusBadge } from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/groups" className="text-xs">
          &larr; All groups
        </Link>
        {session?.user && (
          <Link href={`/admin/groups/${group.id}/edit`} className="toolbar-btn">
            ✏️ Edit
          </Link>
        )}
      </div>

      <fieldset>
        <legend>Group File</legend>
        <div className="flex flex-col sm:flex-row gap-4">
          <div
            className="win-card-thumb w-28 h-28 shrink-0 flex items-center justify-center mx-auto sm:mx-0"
          >
            {group.symbolImageId ? (
              <Image
                src={`/api/images/${group.symbolImageId}`}
                alt={group.name}
                fill
                sizes="112px"
                className="object-cover"
              />
            ) : (
              <span className="text-2xl font-bold">
                {group.name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1>{group.name}</h1>
              <StatusBadge status={group.status} />
            </div>
            {group.aliases && (
              <p className="text-sm italic mt-0.5">aka {group.aliases}</p>
            )}
            {group.description && (
              <p className="text-sm mt-2 max-w-2xl">{group.description}</p>
            )}
            <div className="flex flex-wrap gap-4 mt-3 text-sm">
              {group.territory && (
                <Field label="Territory" value={group.territory} />
              )}
              {group.colors && <Field label="Colors" value={group.colors} />}
              <Field label="Members" value={String(group.members.length)} />
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>Known Members</legend>
        {group.members.length === 0 ? (
          <div
            className="sunken-panel text-center text-sm"
            style={{ padding: 24 }}
          >
            No members on file for this group.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
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
      </fieldset>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px]">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}
