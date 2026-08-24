"use client";

import { useRef } from "react";
import { useDDSItem } from "@/hooks";
import { DDS_VIDEO_COMPLETION_THRESHOLD } from "@/lib/constants";
import type { VideoViewerProps } from "@/lib/types";
import { SeenBadge } from "@/components/dds/SeenBadge";

const SEEK_TOLERANCE_SECONDS = 1;

export function VideoViewer({
  id,
  label,
  src,
  completionThreshold = DDS_VIDEO_COMPLETION_THRESHOLD,
}: VideoViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const furthestPlayedRef = useRef(0);
  const { item, markProgress, markSeen } = useDDSItem(id, label, "video");

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    furthestPlayedRef.current = Math.max(furthestPlayedRef.current, video.currentTime);
    const progress = video.currentTime / video.duration;
    markProgress(progress);
    if (progress >= completionThreshold) {
      markSeen();
    }
  };

  // Prevents "watching" by dragging the scrubber ahead: snap back to the
  // furthest point actually played whenever the user seeks past it.
  const handleSeeking = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.currentTime > furthestPlayedRef.current + SEEK_TOLERANCE_SECONDS) {
      video.currentTime = furthestPlayedRef.current;
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2 dark:border-neutral-800">
        <span className="text-sm font-medium">{label}</span>
        <SeenBadge seen={item?.seen ?? false} progress={item?.progress ?? 0} />
      </div>
      <video
        ref={videoRef}
        src={src}
        controls
        controlsList="nofullscreen noremoteplayback"
        onTimeUpdate={handleTimeUpdate}
        onSeeking={handleSeeking}
        onEnded={markSeen}
        onContextMenu={(event) => event.preventDefault()}
        className="w-full bg-black"
      />
      <p className="px-4 py-2 text-xs text-neutral-500">
        Assista {Math.round(completionThreshold * 100)}% do vídeo para confirmar a visualização. Avançar a barra não
        pula o conteúdo — o vídeo volta ao ponto assistido.
      </p>
    </div>
  );
}
