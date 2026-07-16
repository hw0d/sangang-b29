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
    <Link
      href={`/profiles/${id}`}
      className="group block rounded-lg border border-border bg-surface hover:border-accent/60 transition-colors overflow-hidden"
    >
      <div className="aspect-square relative bg-surface-raised">
        {mugshotImageId ? (
          <Image
            src={`/api/images/${mugshotImageId}`}
            alt={fullName}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover grayscale group-hover:grayscale-0 transition-all"
          />
        ) : (
          <MugshotPlaceholder className="w-full h-full" />
        )}
        <div className="absolute top-2 right-2">
          <StatusBadge status={status} />
        </div>
      </div>
      <div className="p-3 font-record">
        <p className="text-sm font-semibold truncate">{fullName}</p>
        {alias && (
          <p className="text-xs text-accent truncate">&quot;{alias}&quot;</p>
        )}
        {groupName && (
          <p className="text-[11px] text-muted truncate mt-0.5">
            {groupName}
          </p>
        )}
      </div>
    </Link>
  );
}
