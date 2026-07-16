import type { AdminUser } from "@prisma/client";
import { STAFF_POSITIONS, formatStaffPosition } from "@/lib/utils";

export function UserForm({
  action,
  user,
}: {
  action: (formData: FormData) => void;
  user?: AdminUser;
}) {
  const isEdit = !!user;

  return (
    <form action={action} className="field-row-stacked" style={{ maxWidth: 420 }}>
      <Field label="Username" htmlFor="username">
        {isEdit ? (
          <input type="text" defaultValue={user.username} disabled />
        ) : (
          <input id="username" name="username" type="text" required />
        )}
      </Field>
      <Field
        label={isEdit ? "New password (leave blank to keep current)" : "Password"}
        htmlFor="password"
      >
        <input
          id="password"
          name="password"
          type="password"
          required={!isEdit}
          minLength={isEdit ? undefined : 6}
        />
      </Field>
      <Field label="Access level" htmlFor="role">
        <select id="role" name="role" defaultValue={user?.role ?? "EDITOR"}>
          <option value="EDITOR">Staff (manage records only)</option>
          <option value="ADMIN">Admin (can also manage user accounts)</option>
        </select>
      </Field>
      <Field label="Position" htmlFor="position">
        <select id="position" name="position" defaultValue={user?.position ?? ""}>
          <option value="">None</option>
          {STAFF_POSITIONS.map((p) => (
            <option key={p} value={p}>
              {formatStaffPosition(p)}
            </option>
          ))}
        </select>
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
