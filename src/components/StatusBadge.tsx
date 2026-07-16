import { formatStatus, statusBadgeClasses } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded border text-[11px] font-record uppercase tracking-wide ${statusBadgeClasses(
        status
      )}`}
    >
      {formatStatus(status)}
    </span>
  );
}
