import Link from "next/link";
import Image from "next/image";
import { StatusBadge } from "./StatusBadge";

export function GroupCard({
  slug,
  name,
  status,
  territory,
  symbolImageId,
  memberCount,
}: {
  slug: string;
  name: string;
  status: string;
  territory: string | null;
  symbolImageId: string | null;
  memberCount: number;
}) {
  return (
    <Link
      href={`/groups/${slug}`}
      className="group flex items-center gap-4 rounded-lg border border-border bg-surface hover:border-accent/60 transition-colors p-4"
    >
      <div className="w-16 h-16 shrink-0 rounded bg-surface-raised border border-border overflow-hidden relative flex items-center justify-center">
        {symbolImageId ? (
          <Image
            src={`/api/images/${symbolImageId}`}
            alt={name}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <span className="font-record text-lg text-muted">
            {name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-record font-semibold truncate">{name}</p>
          <StatusBadge status={status} />
        </div>
        {territory && (
          <p className="text-xs text-muted truncate mt-0.5">
            Territory: {territory}
          </p>
        )}
        <p className="text-[11px] text-muted mt-0.5">
          {memberCount} known member{memberCount === 1 ? "" : "s"}
        </p>
      </div>
    </Link>
  );
}
