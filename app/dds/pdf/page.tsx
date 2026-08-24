"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import { DDSProvider, DDSGate } from "@/components";

const PdfViewer = dynamic(() => import("@/components/dds/PdfViewer").then((mod) => mod.PdfViewer), {
  ssr: false,
  loading: () => <p className="p-4 text-sm text-neutral-500">Carregando visualizador de PDF...</p>,
});

export default function PdfDemo() {
  const [confirmedAt, setConfirmedAt] = useState<string | null>(null);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-16">
      <Link href="/" className="text-sm text-neutral-500 hover:underline">
        ← voltar
      </Link>
      <header className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold">DDS — PDF</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Confirma como &quot;visualizado&quot; só depois que <strong>cada página</strong> individualmente fica
          visível por um instante — rolar rápido até o final sem passar pelo meio do documento não conta.
        </p>
      </header>

      <DDSProvider>
        <DDSGate onConfirm={() => setConfirmedAt(new Date().toLocaleString("pt-BR"))}>
          <PdfViewer id="pdf-manual" label="PDF — Manual do colaborador" src="/sample-dds.pdf" />
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
