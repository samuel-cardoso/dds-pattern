"use client";

import { useCallback, useContext, useEffect } from "react";
import { DDSContext } from "@/components/dds/DDSProvider";
import type { DDSContentType } from "@/lib/types";

export function useDDS() {
  const context = useContext(DDSContext);
  if (!context) {
    throw new Error("useDDS must be used within a DDSProvider");
  }
  return context;
}

export function useDDSItem(id: string, label: string, type: DDSContentType) {
  const { items, register, markProgress, markSeen } = useDDS();

  useEffect(() => {
    register({ id, label, type });
  }, [register, id, label, type]);

  // Stable identities: consumers put these in their own effect deps, and an
  // inline arrow here would recreate them every render, re-firing those
  // effects and calling markProgress in a loop.
  const itemMarkProgress = useCallback((progress: number) => markProgress(id, progress), [markProgress, id]);
  const itemMarkSeen = useCallback(() => markSeen(id), [markSeen, id]);

  return {
    item: items[id],
    markProgress: itemMarkProgress,
    markSeen: itemMarkSeen,
  };
}
