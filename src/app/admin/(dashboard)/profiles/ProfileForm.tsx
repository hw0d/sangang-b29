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
    <form action={action} className="space-y-4 max-w-xl">
      <Field label="Full name">
        <input
          name="fullName"
          defaultValue={profile?.fullName}
          required
          className="field-input"
        />
      </Field>
      <Field label="Alias / street name">
        <input
          name="alias"
          defaultValue={profile?.alias ?? ""}
          className="field-input"
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Status">
          <select
            name="status"
            defaultValue={profile?.status ?? "UNKNOWN"}
            className="field-input"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Group affiliation">
          <select
            name="groupId"
            defaultValue={profile?.groupId ?? ""}
            className="field-input"
          >
            <option value="">None / unaffiliated</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Rank / role in group">
        <input
          name="rank"
          defaultValue={profile?.rank ?? ""}
          className="field-input"
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Date of birth">
          <input
            type="date"
            name="dob"
            defaultValue={toDateInputValue(profile?.dob)}
            className="field-input"
          />
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Height (cm)">
            <input
              type="number"
              name="heightCm"
              defaultValue={profile?.heightCm ?? ""}
              className="field-input"
            />
          </Field>
          <Field label="Weight (kg)">
            <input
              type="number"
              name="weightKg"
              defaultValue={profile?.weightKg ?? ""}
              className="field-input"
            />
          </Field>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Eye color">
          <input
            name="eyeColor"
            defaultValue={profile?.eyeColor ?? ""}
            className="field-input"
          />
        </Field>
        <Field label="Hair color">
          <input
            name="hairColor"
            defaultValue={profile?.hairColor ?? ""}
            className="field-input"
          />
        </Field>
      </div>
      <Field label="Description">
        <textarea
          name="description"
          defaultValue={profile?.description ?? ""}
          rows={4}
          className="field-input"
        />
      </Field>
      <Field label="Investigator notes">
        <textarea
          name="notes"
          defaultValue={profile?.notes ?? ""}
          rows={3}
          className="field-input"
        />
      </Field>
      <Field label="Mugshot">
        {profile?.mugshotImageId && (
          <Image
            src={`/api/images/${profile.mugshotImageId}`}
            alt=""
            width={80}
            height={80}
            className="w-20 h-20 rounded object-cover mb-2 border border-border"
          />
        )}
        <input
          type="file"
          name="mugshotImage"
          accept="image/*"
          className="field-input"
        />
      </Field>
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wide text-muted mb-1 font-record">
        {label}
      </span>
      {children}
    </label>
  );
}
