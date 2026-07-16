export function MugshotPlaceholder({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      role="img"
    >
      <rect width="100" height="100" fill="var(--surface-raised)" />
      <circle cx="50" cy="38" r="18" fill="var(--border)" />
      <path
        d="M18 92c0-20 14-34 32-34s32 14 32 34"
        fill="var(--border)"
      />
    </svg>
  );
}
