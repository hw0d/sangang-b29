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
    <div className="space-y-3">
      {links.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-3">
          {links.map((l) => (
            <div key={l.id} className="win-card flex items-center gap-3">
              <div className="win-card-thumb w-10 h-10 shrink-0">
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
                  className="text-sm block truncate"
                >
                  {l.toProfile.fullName}
                </Link>
                <p className="text-[11px]">{formatLinkType(l.type)}</p>
              </div>
              <form action={deleteAffiliateLink.bind(null, l.id, profileId)}>
                <button type="submit">Remove</button>
              </form>
            </div>
          ))}
        </div>
      )}

      <fieldset>
        <legend>Link an affiliate</legend>
        <form action={addAction} className="field-row-stacked">
          <div className="grid sm:grid-cols-3 gap-3">
            <select
              name="toProfileId"
              required
              defaultValue=""
              className="sm:col-span-2"
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
            <select name="type" defaultValue="ASSOCIATE">
              {LINK_TYPES.map((t) => (
                <option key={t} value={t}>
                  {formatLinkType(t)}
                </option>
              ))}
            </select>
          </div>
          <input type="text" name="note" placeholder="Note (optional)" />
          <button type="submit">Add link</button>
        </form>
      </fieldset>
    </div>
  );
}
