"use client";

import Link from "next/link";
import { useState } from "react";
import { DDSProvider, DDSGate, ImageViewer } from "@/components";

export default function ImageDemo() {
  const [confirmedAt, setConfirmedAt] = useState<string | null>(null);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-16">
      <Link href="/" className="text-sm text-neutral-500 hover:underline">
        ← voltar
      </Link>
      <header className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold">DDS — Imagem</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Confirma como &quot;visualizado&quot; só depois que a imagem fica visível na tela por tempo mínimo.
        </p>
      </header>

      <DDSProvider>
        <DDSGate onConfirm={() => setConfirmedAt(new Date().toLocaleString("pt-BR"))}>
          <ImageViewer
            id="img-seguranca"
            label="Imagem — Instrução de segurança"
            src="https://picsum.photos/id/1080/900/500"
            alt="Instrução de segurança ilustrativa"
          />
        </DDSGate>
      </DDSProvider>

      {confirmedAt && (
        <p className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-300">
          Ciência registrada em {confirmedAt}.
        </p>
      )}
    </div>
  );
}
