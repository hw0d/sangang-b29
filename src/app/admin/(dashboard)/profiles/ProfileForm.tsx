import Image from "next/image";
import type { Profile } from "@prisma/client";

const STATUSES = [
  "AT_LARGE",
  "IN_CUSTODY",
  "ON_PROBATION",
  "DECEASED",
  "UNKNOWN",
] as const;

function toDateInputValue(date: Date | null | undefined): string {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

export function ProfileForm({
  action,
  profile,
  groups,
}: {
  action: (formData: FormData) => void;
  profile?: Profile;
  groups: { id: string; name: string }[];
}) {
  return (
    <form action={action} className="field-row-stacked" style={{ maxWidth: 480 }}>
      <Field label="Full name" htmlFor="fullName">
        <input
          id="fullName"
          type="text"
          name="fullName"
          defaultValue={profile?.fullName}
          required
        />
      </Field>
      <Field label="Alias / street name" htmlFor="alias">
        <input
          id="alias"
          type="text"
          name="alias"
          defaultValue={profile?.alias ?? ""}
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Status" htmlFor="status">
          <select id="status" name="status" defaultValue={profile?.status ?? "UNKNOWN"}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Group affiliation" htmlFor="groupId">
          <select id="groupId" name="groupId" defaultValue={profile?.groupId ?? ""}>
            <option value="">None / unaffiliated</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Rank / role in group" htmlFor="rank">
        <input
          id="rank"
          type="text"
          name="rank"
          defaultValue={profile?.rank ?? ""}
        />
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Date of birth" htmlFor="dob">
          <input
            id="dob"
            type="date"
            name="dob"
            defaultValue={toDateInputValue(profile?.dob)}
          />
        </Field>
        <Field label="Height (cm)" htmlFor="heightCm">
          <input
            id="heightCm"
            type="number"
            name="heightCm"
            defaultValue={profile?.heightCm ?? ""}
          />
        </Field>
        <Field label="Weight (kg)" htmlFor="weightKg">
          <input
            id="weightKg"
            type="number"
            name="weightKg"
            defaultValue={profile?.weightKg ?? ""}
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Eye color" htmlFor="eyeColor">
          <input
            id="eyeColor"
            type="text"
            name="eyeColor"
            defaultValue={profile?.eyeColor ?? ""}
          />
        </Field>
        <Field label="Hair color" htmlFor="hairColor">
          <input
            id="hairColor"
            type="text"
            name="hairColor"
            defaultValue={profile?.hairColor ?? ""}
          />
        </Field>
      </div>
      <Field label="Description" htmlFor="description">
        <textarea
          id="description"
          name="description"
          defaultValue={profile?.description ?? ""}
          rows={4}
          className="w-full"
        />
      </Field>
      <Field label="Investigator notes" htmlFor="notes">
        <textarea
          id="notes"
          name="notes"
          defaultValue={profile?.notes ?? ""}
          rows={3}
          className="w-full"
        />
      </Field>
      <Field label="Mugshot" htmlFor="mugshotImage">
        {profile?.mugshotImageId && (
          <Image
            src={`/api/images/${profile.mugshotImageId}`}
            alt=""
            width={80}
            height={80}
            className="field-border"
            style={{ display: "block", marginBottom: 6, objectFit: "cover" }}
          />
        )}
        <input id="mugshotImage" type="file" name="mugshotImage" accept="image/*" />
      </Field>
      <button type="submit" className="default">
        Save
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-xs mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}
