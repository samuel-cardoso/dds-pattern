"use client";

import { useRef } from "react";
import { useDDSItem, useScrollCompletion } from "@/hooks";
import { DDS_SCROLL_COMPLETION_THRESHOLD } from "@/lib/constants";
import type { TextViewerProps } from "@/lib/types";
import { SeenBadge } from "@/components/dds/SeenBadge";

export function TextViewer({
  id,
  label,
  children,
  completionThreshold = DDS_SCROLL_COMPLETION_THRESHOLD,
}: TextViewerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { item, markProgress, markSeen } = useDDSItem(id, label, "text");

  useScrollCompletion(ref, completionThreshold, markProgress, markSeen);

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2 dark:border-neutral-800">
        <span className="text-sm font-medium">{label}</span>
        <SeenBadge seen={item?.seen ?? false} progress={item?.progress ?? 0} />
      </div>
      <div ref={ref} className="h-64 overflow-y-auto px-4 py-3 text-sm leading-relaxed">
        {children}
      </div>
      <p className="px-4 py-2 text-xs text-neutral-500">Role até o final do texto para confirmar a leitura.</p>
    </div>
  );
}
