import { formatStatus, statusColor } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className="status-chip">
      <span
        className="status-dot"
        style={{ background: statusColor(status) }}
        aria-hidden
      />
      {formatStatus(status)}
    </span>
  );
}
