import Link from "next/link";
import Image from "next/image";
import { MugshotPlaceholder } from "./MugshotPlaceholder";
import { StatusBadge } from "./StatusBadge";

export function PersonCard({
  id,
  fullName,
  alias,
  status,
  mugshotImageId,
  groupName,
}: {
  id: string;
  fullName: string;
  alias: string | null;
  status: string;
  mugshotImageId: string | null;
  groupName?: string | null;
}) {
  return (
    <Link href={`/profiles/${id}`} className="win-card">
      <div className="win-card-thumb">
        {mugshotImageId ? (
          <Image
            src={`/api/images/${mugshotImageId}`}
            alt={fullName}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover"
          />
        ) : (
          <MugshotPlaceholder className="w-full h-full" />
        )}
      </div>
      <div className="mt-1.5">
        <p className="text-sm font-bold truncate">{fullName}</p>
        {alias && <p className="text-xs italic truncate">&quot;{alias}&quot;</p>}
        {groupName && (
          <p className="win-card-meta text-[11px] truncate">{groupName}</p>
        )}
        <div className="mt-1">
          <StatusBadge status={status} />
        </div>
      </div>
    </Link>
  );
}
