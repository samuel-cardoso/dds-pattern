"use client";

import { useState } from "react";
import { useDDS } from "@/hooks";
import type { DDSGateProps } from "@/lib/types";
import { Button } from "@/components/ui/Button";

export function DDSGate({
  children,
  onConfirm,
  confirmLabel = "Confirmar que visualizei todo o conteúdo",
  confirmedLabel = "Ciência confirmada",
}: DDSGateProps) {
  const { items, isAllSeen } = useDDS();
  const [confirmed, setConfirmed] = useState(false);

  const total = Object.keys(items).length;
  const seenCount = Object.values(items).filter((item) => item.seen).length;

  const handleConfirm = () => {
    setConfirmed(true);
    onConfirm();
  };

  return (
    <div className="flex flex-col gap-6">
      {children}
      <div className="flex flex-col items-start gap-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {seenCount} de {total} itens visualizados
        </p>
        <Button onClick={handleConfirm} disabled={!isAllSeen || confirmed}>
          {confirmed ? confirmedLabel : confirmLabel}
        </Button>
      </div>
    </div>
  );
}
