"use client";

import { useDDSItem, useDwellVisibility } from "@/hooks";
import { DDS_IMAGE_MIN_DWELL_MS } from "@/lib/constants";
import type { ImageViewerProps } from "@/lib/types";
import { SeenBadge } from "@/components/dds/SeenBadge";

export function ImageViewer({ id, label, src, alt, minDwellMs = DDS_IMAGE_MIN_DWELL_MS }: ImageViewerProps) {
  const { item, markProgress, markSeen } = useDDSItem(id, label, "image");
  const ref = useDwellVisibility(minDwellMs, markProgress, markSeen);

  return (
    <div ref={ref} className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2 dark:border-neutral-800">
        <span className="text-sm font-medium">{label}</span>
        <SeenBadge seen={item?.seen ?? false} progress={item?.progress ?? 0} />
      </div>
      <img src={src} alt={alt} className="max-h-96 w-full object-contain bg-neutral-50 dark:bg-neutral-900" />
      <p className="px-4 py-2 text-xs text-neutral-500">
        Mantenha a imagem visível por {Math.round(minDwellMs / 1000)}s para confirmar a visualização.
      </p>
    </div>
  );
}
