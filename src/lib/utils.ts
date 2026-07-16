export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatStatus(status: string): string {
  return status.replace(/_/g, " ");
}

const STATUS_STYLES: Record<string, string> = {
  AT_LARGE: "bg-danger/15 text-danger border-danger/40",
  IN_CUSTODY: "bg-warn/15 text-warn border-warn/40",
  ON_PROBATION: "bg-ok/15 text-ok border-ok/40",
  DECEASED: "bg-surface-raised text-muted border-border",
  UNKNOWN: "bg-surface-raised text-muted border-border",
  ACTIVE: "bg-danger/15 text-danger border-danger/40",
  DISBANDED: "bg-surface-raised text-muted border-border",
};

export function statusBadgeClasses(status: string): string {
  return (
    STATUS_STYLES[status] ??
    "bg-surface-raised text-muted border-border"
  );
}

const LINK_TYPE_LABELS: Record<string, string> = {
  ASSOCIATE: "Associate",
  RIVAL: "Rival",
  FAMILY: "Family",
  SUBORDINATE_OF: "Subordinate of",
  LEADER_OF: "Leader of",
};

export function formatLinkType(type: string): string {
  return LINK_TYPE_LABELS[type] ?? formatStatus(type);
}

const INVERSE_LINK_TYPE: Record<string, string> = {
  ASSOCIATE: "ASSOCIATE",
  RIVAL: "RIVAL",
  FAMILY: "FAMILY",
  SUBORDINATE_OF: "LEADER_OF",
  LEADER_OF: "SUBORDINATE_OF",
};

export function inverseLinkType(type: string): string {
  return INVERSE_LINK_TYPE[type] ?? type;
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "Unknown";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
