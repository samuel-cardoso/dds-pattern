"use client";

import { useEffect, useRef } from "react";
import { DDS_VISIBILITY_RATIO } from "@/lib/constants";

export function useDwellVisibility(
  ref: React.RefObject<Element | null>,
  minDwellMs: number,
  onProgress: (progress: number) => void,
  onComplete: () => void,
) {
  const completedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || completedRef.current) return;

    let visibleSince: number | null = null;
    let rafId: number;

    const tick = () => {
      if (visibleSince !== null && !completedRef.current) {
        const elapsed = Date.now() - visibleSince;
        onProgress(elapsed / minDwellMs);
        if (elapsed >= minDwellMs) {
          completedRef.current = true;
          onComplete();
          return;
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (completedRef.current) return;
        visibleSince = entry.isIntersecting ? Date.now() : null;
      },
      { threshold: DDS_VISIBILITY_RATIO },
    );

    observer.observe(node);
    rafId = requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minDwellMs]);
}
