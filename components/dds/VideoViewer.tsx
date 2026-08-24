"use client";

import { useEffect, useRef } from "react";
import { useDDSItem } from "@/hooks";
import { DDS_VIDEO_COMPLETION_THRESHOLD, DDS_VIDEO_PROGRESS_SAVE_INTERVAL_MS } from "@/lib/constants";
import type { VideoViewerProps } from "@/lib/types";
import { SeenBadge } from "@/components/dds/SeenBadge";

const SEEK_TOLERANCE_SECONDS = 1;

function progressStorageKey(id: string) {
  return `dds:video-progress:${id}`;
}

function readSavedProgress(id: string): number {
  try {
    return Number(localStorage.getItem(progressStorageKey(id)) ?? 0);
  } catch {
    return 0;
  }
}

function saveProgress(id: string, seconds: number) {
  try {
    localStorage.setItem(progressStorageKey(id), String(seconds));
  } catch {}
}

export function VideoViewer({
  id,
  label,
  src,
  completionThreshold = DDS_VIDEO_COMPLETION_THRESHOLD,
}: VideoViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const furthestPlayedRef = useRef(0);
  const lastSavedAtRef = useRef(0);
  const { item, markProgress, markSeen } = useDDSItem(id, label, "video");

  const resumeIfNeeded = (video: HTMLVideoElement) => {
    if (furthestPlayedRef.current > 0) return;
    const saved = readSavedProgress(id);
    if (saved > 0 && saved < video.duration) {
      video.currentTime = saved;
      furthestPlayedRef.current = saved;
      const progress = saved / video.duration;
      markProgress(progress);
      if (progress >= completionThreshold) markSeen();
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video && video.readyState >= 1) resumeIfNeeded(video);
  }, []);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration || video.seeking) return;
    furthestPlayedRef.current = Math.max(furthestPlayedRef.current, video.currentTime);

    const now = Date.now();
    if (now - lastSavedAtRef.current > DDS_VIDEO_PROGRESS_SAVE_INTERVAL_MS) {
      lastSavedAtRef.current = now;
      saveProgress(id, furthestPlayedRef.current);
    }

    const progress = video.currentTime / video.duration;
    markProgress(progress);
    if (progress >= completionThreshold) {
      markSeen();
    }
  };

  const handleEnded = () => {
    const video = videoRef.current;
    if (video) saveProgress(id, video.duration);
    markSeen();
  };

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
        onLoadedMetadata={(event) => resumeIfNeeded(event.currentTarget)}
        onTimeUpdate={handleTimeUpdate}
        onSeeking={handleSeeking}
        onEnded={handleEnded}
        onContextMenu={(event) => event.preventDefault()}
        className="w-full bg-black"
      />
      <p className="px-4 py-2 text-xs text-neutral-500">
        Assista {Math.round(completionThreshold * 100)}% do vídeo para confirmar a visualização. Avançar a barra não
        pula o conteúdo — o vídeo volta ao ponto assistido. Dá refresh na página: ele retoma de onde parou.
      </p>
    </div>
  );
}
