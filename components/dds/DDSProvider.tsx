"use client";

import { createContext, useCallback, useMemo, useState } from "react";
import type { DDSContextValue, DDSItemMeta, DDSItemState, DDSProviderProps } from "@/lib/types";

export const DDSContext = createContext<DDSContextValue | null>(null);

export function DDSProvider({ children }: DDSProviderProps) {
  const [items, setItems] = useState<Record<string, DDSItemState>>({});

  const register = useCallback((item: DDSItemMeta) => {
    setItems((current) => {
      if (current[item.id]) return current;
      return { ...current, [item.id]: { ...item, seen: false, progress: 0 } };
    });
  }, []);

  const markProgress = useCallback((id: string, progress: number) => {
    setItems((current) => {
      const existing = current[id];
      if (!existing || existing.seen) return current;
      const clamped = Math.max(existing.progress, Math.min(1, progress));
      if (clamped === existing.progress) return current;
      return { ...current, [id]: { ...existing, progress: clamped } };
    });
  }, []);

  const markSeen = useCallback((id: string) => {
    setItems((current) => {
      const existing = current[id];
      if (!existing || existing.seen) return current;
      return { ...current, [id]: { ...existing, seen: true, progress: 1 } };
    });
  }, []);

  const isAllSeen = useMemo(() => {
    const values = Object.values(items);
    return values.length > 0 && values.every((item) => item.seen);
  }, [items]);

  const value = useMemo<DDSContextValue>(
    () => ({ items, register, markProgress, markSeen, isAllSeen }),
    [items, register, markProgress, markSeen, isAllSeen],
  );

  return <DDSContext.Provider value={value}>{children}</DDSContext.Provider>;
}
