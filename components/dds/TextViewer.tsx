"use client";

import { useCallback, useEffect, useState } from "react";
import { useDDSItem, useDwellVisibility } from "@/hooks";
import { DDS_TEXT_PROGRESS_STEPS, DDS_TEXT_SENTINEL_DWELL_MS } from "@/lib/constants";
import type { TextSentinelProps, TextViewerProps } from "@/lib/types";
import { SeenBadge } from "@/components/dds/SeenBadge";

function TextSentinel({ index, onSeen, scrollRoot }: TextSentinelProps) {
  const ref = useDwellVisibility(
    DDS_TEXT_SENTINEL_DWELL_MS,
    () => {},
    () => onSeen(index),
    { root: scrollRoot, threshold: 0 },
  );

  return <div ref={ref} className="h-px w-full" aria-hidden />;
}

export function TextViewer({ id, label, children }: TextViewerProps) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [seenSteps, setSeenSteps] = useState<Set<number>>(new Set());
  const { item, markProgress, markSeen } = useDDSItem(id, label, "text");

  const handleSentinelSeen = useCallback((index: number) => {
    setSeenSteps((prev) => (prev.has(index) ? prev : new Set(prev).add(index)));
  }, []);

  useEffect(() => {
    const progress = seenSteps.size / DDS_TEXT_PROGRESS_STEPS.length;
    markProgress(progress);
    if (seenSteps.size === DDS_TEXT_PROGRESS_STEPS.length) markSeen();
  }, [seenSteps, markProgress, markSeen]);

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2 dark:border-neutral-800">
        <span className="text-sm font-medium">{label}</span>
        <SeenBadge seen={item?.seen ?? false} progress={item?.progress ?? 0} />
      </div>
      <div ref={setContainer} className="h-64 overflow-y-auto px-4 py-3 text-sm leading-relaxed">
        <div className="relative">
          {children}
          {DDS_TEXT_PROGRESS_STEPS.map((step, index) => (
            <div key={step} className="pointer-events-none absolute left-0 w-full" style={{ top: `${step * 100}%` }}>
              <TextSentinel index={index} onSeen={handleSentinelSeen} scrollRoot={container} />
            </div>
          ))}
        </div>
      </div>
      <p className="px-4 py-2 text-xs text-neutral-500">Role até o final do texto para confirmar a leitura.</p>
    </div>
  );
}
