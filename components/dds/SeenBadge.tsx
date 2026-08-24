import type { SeenBadgeProps } from "@/lib/types";

export function SeenBadge({ seen, progress }: SeenBadgeProps) {
  if (seen) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800 dark:bg-green-900/40 dark:text-green-300">
        ✓ Visualizado
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
      {Math.round(progress * 100)}%
    </span>
  );
}
