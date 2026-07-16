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

const STATUS_COLORS: Record<string, string> = {
  AT_LARGE: "#cc0000",
  IN_CUSTODY: "#c98a00",
  ON_PROBATION: "#007a33",
  DECEASED: "#555555",
  UNKNOWN: "#808080",
  ACTIVE: "#cc0000",
  DISBANDED: "#808080",
};

export function statusColor(status: string): string {
  return STATUS_COLORS[status] ?? "#808080";
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
