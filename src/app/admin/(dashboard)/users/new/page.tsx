import { requireAdminRole } from "@/lib/adminAuth";
import { createAdminUser } from "@/app/admin/users/actions";
import { UserForm } from "../UserForm";

export default async function NewUserPage() {
  await requireAdminRole();

  return (
    <div className="space-y-4">
      <h1>New User Account</h1>
      <UserForm action={createAdminUser} />
    </div>
  );
}
