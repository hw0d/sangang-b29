import Image from "next/image";
import type { Group } from "@prisma/client";

const STATUSES = ["ACTIVE", "DISBANDED", "UNKNOWN"] as const;

export function GroupForm({
  action,
  group,
}: {
  action: (formData: FormData) => void;
  group?: Group;
}) {
  return (
    <form action={action} className="space-y-4 max-w-xl">
      <Field label="Name">
        <input
          name="name"
          defaultValue={group?.name}
          required
          className="field-input"
        />
      </Field>
      <Field label="Aliases">
        <input
          name="aliases"
          defaultValue={group?.aliases ?? ""}
          className="field-input"
        />
      </Field>
      <Field label="Description">
        <textarea
          name="description"
          defaultValue={group?.description ?? ""}
          rows={4}
          className="field-input"
        />
      </Field>
      <Field label="Territory">
        <input
          name="territory"
          defaultValue={group?.territory ?? ""}
          className="field-input"
        />
      </Field>
      <Field label="Colors">
        <input
          name="colors"
          defaultValue={group?.colors ?? ""}
          className="field-input"
        />
      </Field>
      <Field label="Status">
        <select
          name="status"
          defaultValue={group?.status ?? "ACTIVE"}
          className="field-input"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Symbol image">
        {group?.symbolImageId && (
          <Image
            src={`/api/images/${group.symbolImageId}`}
            alt=""
            width={64}
            height={64}
            className="w-16 h-16 rounded object-cover mb-2 border border-border"
          />
        )}
        <input
          type="file"
          name="symbolImage"
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
