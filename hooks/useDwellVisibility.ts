"use client";

import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { DDS_VISIBILITY_RATIO } from "@/lib/constants";

interface DwellVisibilityOptions {
  threshold?: number;
  root?: Element | null;
}

export function useDwellVisibility(
  minDwellMs: number,
  onProgress: (progress: number) => void,
  onComplete: () => void,
  options?: DwellVisibilityOptions,
) {
  const completedRef = useRef(false);
  const visibleSinceRef = useRef<number | null>(null);
  const { ref, inView } = useInView({
    threshold: options?.threshold ?? DDS_VISIBILITY_RATIO,
    root: options?.root ?? undefined,
  });

  useEffect(() => {
    if (completedRef.current) return;
    visibleSinceRef.current = inView ? Date.now() : null;
  }, [inView]);

  useEffect(() => {
    if (completedRef.current) return;

    let rafId: number;
    const tick = () => {
      if (visibleSinceRef.current !== null && !completedRef.current) {
        const elapsed = Date.now() - visibleSinceRef.current;
        onProgress(elapsed / minDwellMs);
        if (elapsed >= minDwellMs) {
          completedRef.current = true;
          onComplete();
          return;
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [minDwellMs]);

  return ref;
}
