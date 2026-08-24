"use client";

import { useEffect, useRef } from "react";

export function useScrollCompletion(
  ref: React.RefObject<HTMLElement | null>,
  threshold: number,
  onProgress: (progress: number) => void,
  onComplete: () => void,
) {
  const completedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const handleScroll = () => {
      if (completedRef.current) return;
      const scrollable = node.scrollHeight - node.clientHeight;
      const progress = scrollable <= 0 ? 1 : node.scrollTop / scrollable;
      onProgress(progress);
      if (progress >= threshold) {
        completedRef.current = true;
        onComplete();
      }
    };

    node.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => node.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold]);
}
