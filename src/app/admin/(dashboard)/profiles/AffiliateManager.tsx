import Image from "next/image";
import Link from "next/link";
import { addAffiliateLink, deleteAffiliateLink } from "@/app/admin/actions";
import { MugshotPlaceholder } from "@/components/MugshotPlaceholder";
import { formatLinkType } from "@/lib/utils";

const LINK_TYPES = [
  "ASSOCIATE",
  "RIVAL",
  "FAMILY",
  "SUBORDINATE_OF",
  "LEADER_OF",
] as const;

export function AffiliateManager({
  profileId,
  links,
  otherProfiles,
}: {
  profileId: string;
  links: {
    id: string;
    type: string;
    note: string | null;
    toProfile: {
      id: string;
      fullName: string;
      alias: string | null;
      mugshotImageId: string | null;
    };
  }[];
  otherProfiles: { id: string; fullName: string }[];
}) {
  const addAction = addAffiliateLink.bind(null, profileId);

  return (
    <div className="space-y-4">
      {links.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-3">
          {links.map((l) => (
            <div
              key={l.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3"
            >
              <div className="w-10 h-10 shrink-0 rounded overflow-hidden bg-surface-raised relative">
                {l.toProfile.mugshotImageId ? (
                  <Image
                    src={`/api/images/${l.toProfile.mugshotImageId}`}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                ) : (
                  <MugshotPlaceholder className="w-full h-full" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/profiles/${l.toProfile.id}`}
                  className="font-record text-sm hover:underline block truncate"
                >
                  {l.toProfile.fullName}
                </Link>
                <p className="text-[11px] text-accent font-record">
                  {formatLinkType(l.type)}
                </p>
              </div>
              <form action={deleteAffiliateLink.bind(null, l.id, profileId)}>
                <button type="submit" className="btn-danger">
                  Remove
                </button>
              </form>
            </div>
          ))}
        </div>
      )}

      <form
        action={addAction}
        className="rounded-lg border border-dashed border-border p-4 space-y-3"
      >
        <p className="text-xs uppercase tracking-wide text-muted font-record">
          Link an affiliate
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          <select
            name="toProfileId"
            required
            defaultValue=""
            className="field-input sm:col-span-2"
          >
            <option value="" disabled>
              Select profile...
            </option>
            {otherProfiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.fullName}
              </option>
            ))}
          </select>
          <select name="type" defaultValue="ASSOCIATE" className="field-input">
            {LINK_TYPES.map((t) => (
              <option key={t} value={t}>
                {formatLinkType(t)}
              </option>
            ))}
          </select>
        </div>
        <input name="note" placeholder="Note (optional)" className="field-input" />
        <button type="submit" className="btn-secondary">
          Add link
        </button>
      </form>
    </div>
  );
}
