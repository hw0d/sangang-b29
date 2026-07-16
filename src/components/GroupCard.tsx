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
    <Link href={`/groups/${slug}`} className="win-card flex items-center gap-3">
      <div className="win-card-thumb w-14 h-14 shrink-0 flex items-center justify-center">
        {symbolImageId ? (
          <Image
            src={`/api/images/${symbolImageId}`}
            alt={name}
            fill
            sizes="56px"
            className="object-cover"
          />
        ) : (
          <span className="text-lg font-bold">
            {name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold truncate">{name}</p>
        {territory && (
          <p className="win-card-meta text-xs truncate">
            Territory: {territory}
          </p>
        )}
        <p className="win-card-meta text-[11px]">
          {memberCount} known member{memberCount === 1 ? "" : "s"}
        </p>
        <div className="mt-1">
          <StatusBadge status={status} />
        </div>
      </div>
    </Link>
  );
}
