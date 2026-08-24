"use client";

import Link from "next/link";
import { useState } from "react";
import { DDSProvider, DDSGate, TextViewer, SampleTermsContent } from "@/components";

export default function TextDemo() {
  const [confirmedAt, setConfirmedAt] = useState<string | null>(null);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-16">
      <Link href="/" className="text-sm text-neutral-500 hover:underline">
        ← voltar
      </Link>
      <header className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold">DDS — Texto</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Confirma como &quot;visualizado&quot; conforme o texto é rolado, em quatro marcos (25/50/75/100%) — cada
          um precisa passar um instante na tela, então rolar rápido demais não conta.
        </p>
      </header>

      <DDSProvider>
        <DDSGate onConfirm={() => setConfirmedAt(new Date().toLocaleString("pt-BR"))}>
          <TextViewer id="texto-termos" label="Texto — Termos de ciência">
            <SampleTermsContent />
          </TextViewer>
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
