import { createGroup } from "@/app/admin/actions";
import { GroupForm } from "../GroupForm";

export default function NewGroupPage() {
  return (
    <div className="space-y-4">
      <h1>New Group</h1>
      <GroupForm action={createGroup} />
    </div>
  );
}
