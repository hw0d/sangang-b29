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
    <form action={action} className="field-row-stacked" style={{ maxWidth: 480 }}>
      <Field label="Name" htmlFor="name">
        <input
          id="name"
          type="text"
          name="name"
          defaultValue={group?.name}
          required
        />
      </Field>
      <Field label="Aliases" htmlFor="aliases">
        <input
          id="aliases"
          type="text"
          name="aliases"
          defaultValue={group?.aliases ?? ""}
        />
      </Field>
      <Field label="Description" htmlFor="description">
        <textarea
          id="description"
          name="description"
          defaultValue={group?.description ?? ""}
          rows={4}
          className="w-full"
        />
      </Field>
      <Field label="Territory" htmlFor="territory">
        <input
          id="territory"
          type="text"
          name="territory"
          defaultValue={group?.territory ?? ""}
        />
      </Field>
      <Field label="Colors" htmlFor="colors">
        <input
          id="colors"
          type="text"
          name="colors"
          defaultValue={group?.colors ?? ""}
        />
      </Field>
      <Field label="Status" htmlFor="status">
        <select id="status" name="status" defaultValue={group?.status ?? "ACTIVE"}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Symbol image" htmlFor="symbolImage">
        {group?.symbolImageId && (
          <Image
            src={`/api/images/${group.symbolImageId}`}
            alt=""
            width={64}
            height={64}
            className="field-border"
            style={{ display: "block", marginBottom: 6, objectFit: "cover" }}
          />
        )}
        <input id="symbolImage" type="file" name="symbolImage" accept="image/*" />
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
